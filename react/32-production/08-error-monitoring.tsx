/**
 * Error Monitoring
 * ================
 *
 * Error monitoring detects, contextualizes, groups, and reports production failures.
 * A React application has several failure paths, so they should converge on one reporter:
 * React root callbacks handle rendering errors, window "error" handles uncaught browser
 * errors and resource failures, unhandledrejection handles rejected promises, and event
 * handlers or async operations explicitly report failures they catch.
 *
 * The reporter normalizes unknown thrown values, removes sensitive data, deduplicates
 * repeated Error objects, samples non-critical events, attaches release and environment
 * metadata, and sends the result to a monitoring backend. Monitoring must never become
 * a failure path itself.
 */

import { Component, createContext, use, type FC, type PropsWithChildren, type ReactNode } from "react";
import { createRoot, type RootOptions } from "react-dom/client";

// ---------------------------------------------------------------------
// 1. Error model
// ---------------------------------------------------------------------

type ErrorCategory = "rendering" | "network" | "validation" | "configuration" | "unknown";

type ErrorSeverity = "low" | "medium" | "high" | "critical";

const DEFAULT_USER_MESSAGE = "Something went wrong. Please try again.";

interface AppErrorOptions extends ErrorOptions {
  readonly category: ErrorCategory;
  readonly userMessage?: string;
  readonly retryable?: boolean;
}

class AppError extends Error {
  readonly category: ErrorCategory;
  readonly userMessage: string;
  readonly retryable: boolean;

  constructor(
    message: string,
    { category, userMessage = DEFAULT_USER_MESSAGE, retryable = false, ...options }: AppErrorOptions,
  ) {
    super(message, options);
    this.name = "AppError";
    this.category = category;
    this.userMessage = userMessage;
    this.retryable = retryable;
  }
}

class HttpError extends AppError {
  readonly status: number;

  constructor(status: number, path: string) {
    super(`Request to ${path} failed with status ${status}.`, {
      category: "network",
      retryable: status === 408 || status === 429 || status >= 500,
    });
    this.name = "HttpError";
    this.status = status;
  }
}

// ---------------------------------------------------------------------
// 2. Normalization and privacy
// ---------------------------------------------------------------------

interface NormalizedError {
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly category: ErrorCategory;
  readonly cause?: NormalizedError;
}

const normalizeError = (value: unknown, depth = 0): NormalizedError => {
  if (!(value instanceof Error)) {
    return {
      name: "NonErrorThrown",
      message: typeof value === "string" ? value : "A non-Error value was thrown.",
      category: "unknown",
    };
  }

  return {
    name: value.name,
    message: value.message,
    stack: value.stack,
    category: value instanceof AppError ? value.category : "unknown",
    cause: value.cause !== undefined && depth < 3 ? normalizeError(value.cause, depth + 1) : undefined,
  };
};

const SENSITIVE_KEY = /password|secret|token|authorization|cookie|api[-_]?key|session|ssn|card/i;

const scrub = (value: unknown, depth = 0): unknown => {
  if (depth > 4) {
    return "[Truncated]";
  }

  if (Array.isArray(value)) {
    return value.map((item) => scrub(item, depth + 1));
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        SENSITIVE_KEY.test(key) ? "[Redacted]" : scrub(item, depth + 1),
      ]),
    );
  }

  return value;
};

const sanitizeUrl = (raw: string): string => {
  try {
    const url = new URL(raw, window.location.origin);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "[invalid-url]";
  }
};

// ---------------------------------------------------------------------
// 3. Monitoring envelope
// ---------------------------------------------------------------------

interface Breadcrumb {
  readonly event: string;
  readonly timestamp: string;
  readonly data?: Readonly<Record<string, unknown>>;
}

interface ErrorEnvelope {
  readonly error: NormalizedError;
  readonly fingerprint: readonly string[];
  readonly severity: ErrorSeverity;
  readonly operation: string;
  readonly context: Readonly<Record<string, unknown>>;
  readonly breadcrumbs: readonly Breadcrumb[];
  readonly release: string;
  readonly environment: string;
  readonly pageUrl?: string;
  readonly timestamp: string;
}

interface MonitoringTransport {
  readonly send: (envelope: ErrorEnvelope) => void;
}

interface ErrorReporter {
  readonly report: (
    error: unknown,
    options?: {
      readonly operation?: string;
      readonly severity?: ErrorSeverity;
      readonly context?: Readonly<Record<string, unknown>>;
    },
  ) => void;
  readonly addBreadcrumb: (event: string, data?: Record<string, unknown>) => void;
}

// ---------------------------------------------------------------------
// 4. Reporter
// ---------------------------------------------------------------------

interface MonitoringConfig {
  readonly release: string;
  readonly environment: string;
  readonly sampleRate: number;
  readonly transport: MonitoringTransport;
}

const createErrorReporter = ({ release, environment, sampleRate, transport }: MonitoringConfig): ErrorReporter => {
  const reportedErrors = new WeakSet<object>();
  const breadcrumbs: Breadcrumb[] = [];

  return {
    addBreadcrumb: (event, data) => {
      breadcrumbs.push({
        event,
        timestamp: new Date().toISOString(),
        data: data ? (scrub(data) as Record<string, unknown>) : undefined,
      });

      if (breadcrumbs.length > 50) {
        breadcrumbs.shift();
      }
    },

    report: (value, { operation = "unknown", severity = "medium", context = {} } = {}) => {
      try {
        if (typeof value === "object" && value !== null) {
          if (reportedErrors.has(value)) {
            return;
          }

          reportedErrors.add(value);
        }

        if (severity !== "critical" && Math.random() >= sampleRate) {
          return;
        }

        const error = normalizeError(value);

        const envelope: ErrorEnvelope = {
          error,
          fingerprint: [error.name, error.category, operation],
          severity,
          operation,
          context: scrub(context) as Record<string, unknown>,
          breadcrumbs: [...breadcrumbs],
          release,
          environment,
          pageUrl: typeof window === "undefined" ? undefined : sanitizeUrl(window.location.href),
          timestamp: new Date().toISOString(),
        };

        transport.send(envelope);
      } catch {
        // Monitoring must never become an application failure.
      }
    },
  };
};

// ---------------------------------------------------------------------
// 5. HTTP transport
// ---------------------------------------------------------------------

const createHttpTransport = (endpoint: string): MonitoringTransport => ({
  send: (envelope) => {
    const body = JSON.stringify(envelope);

    if (
      "sendBeacon" in navigator &&
      navigator.sendBeacon(
        endpoint,
        new Blob([body], {
          type: "application/json",
        }),
      )
    ) {
      return;
    }

    void fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      keepalive: true,
    }).catch(() => undefined);
  },
});

// ---------------------------------------------------------------------
// 6. Error reporter context
// ---------------------------------------------------------------------

const ErrorReporterContext = createContext<ErrorReporter | null>(null);

interface ErrorReporterProviderProps extends PropsWithChildren {
  readonly reporter: ErrorReporter;
}

const ErrorReporterProvider: FC<ErrorReporterProviderProps> = ({ reporter, children }) => {
  return <ErrorReporterContext.Provider value={reporter}>{children}</ErrorReporterContext.Provider>;
};

const useErrorReporter = (): ErrorReporter => {
  const reporter = use(ErrorReporterContext);

  if (reporter === null) {
    throw new AppError("useErrorReporter must be used inside ErrorReporterProvider.", {
      category: "configuration",
    });
  }

  return reporter;
};

// ---------------------------------------------------------------------
// 7. React error boundary
// ---------------------------------------------------------------------

interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback: (error: Error, reset: () => void) => ReactNode;
  readonly resetKeys?: readonly unknown[];
}

interface ErrorBoundaryState {
  readonly error: Error | null;
}

const haveResetKeysChanged = (previous: readonly unknown[] = [], next: readonly unknown[] = []): boolean =>
  previous.length !== next.length || previous.some((value, index) => !Object.is(value, next[index]));

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps, previousState: ErrorBoundaryState): void {
    if (
      this.state.error !== null &&
      previousState.error !== null &&
      haveResetKeysChanged(previousProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset();
    }
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error === null) {
      return this.props.children;
    }

    return this.props.fallback(this.state.error, this.reset);
  }
}

interface ErrorFallbackProps {
  readonly error: Error;
  readonly reset: () => void;
}

const ErrorFallback: FC<ErrorFallbackProps> = ({ error, reset }) => {
  return (
    <section role="alert">
      <h2>Something went wrong</h2> <p>{error instanceof AppError ? error.userMessage : DEFAULT_USER_MESSAGE} </p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 8. React root callbacks
// ---------------------------------------------------------------------

type RootErrorOptions = Pick<RootOptions, "onCaughtError" | "onUncaughtError" | "onRecoverableError">;

const createRootErrorOptions = (reporter: ErrorReporter): RootErrorOptions => ({
  onCaughtError: (error, info) => {
    reporter.report(error, {
      operation: "react-caught-error",
      severity: "high",
      context: {
        componentStack: info.componentStack,
      },
    });
  },

  onUncaughtError: (error, info) => {
    reporter.report(error, {
      operation: "react-uncaught-error",
      severity: "critical",
      context: {
        componentStack: info.componentStack,
      },
    });
  },

  onRecoverableError: (error, info) => {
    reporter.report(error, {
      operation: "react-recoverable-error",
      severity: "low",
      context: {
        componentStack: info.componentStack,
      },
    });
  },
});

// ---------------------------------------------------------------------
// 9. Global browser handlers
// ---------------------------------------------------------------------

const installGlobalHandlers = (reporter: ErrorReporter): (() => void) => {
  const handleError = (event: Event): void => {
    if (event instanceof ErrorEvent) {
      reporter.report(event.error ?? new Error(event.message), {
        operation: "window-error",
        severity: "high",
        context: {
          filename: event.filename ? sanitizeUrl(event.filename) : undefined,
        },
      });

      return;
    }

    const target = event.target;

    if (
      target instanceof HTMLScriptElement ||
      target instanceof HTMLImageElement ||
      target instanceof HTMLLinkElement
    ) {
      const source = target instanceof HTMLLinkElement ? target.href : target.src;

      reporter.report(
        new AppError("A resource failed to load.", {
          category: "network",
        }),
        {
          operation: "resource-load",
          severity: "medium",
          context: {
            tag: target.tagName.toLowerCase(),
            source: sanitizeUrl(source),
          },
        },
      );
    }
  };

  const handleRejection = (event: PromiseRejectionEvent): void => {
    reporter.report(event.reason, {
      operation: "unhandled-rejection",
      severity: "high",
    });
  };

  window.addEventListener("error", handleError, true);

  window.addEventListener("unhandledrejection", handleRejection);

  return () => {
    window.removeEventListener("error", handleError, true);

    window.removeEventListener("unhandledrejection", handleRejection);
  };
};

// ---------------------------------------------------------------------
// 10. Explicit async error reporting
// ---------------------------------------------------------------------

const saveDraft = async (): Promise<void> => {
  const response = await fetch("/api/drafts", {
    method: "POST",
  });

  if (!response.ok) {
    throw new HttpError(response.status, "/api/drafts");
  }
};

const SaveDraftButton: FC = () => {
  const reporter = useErrorReporter();

  const handleSave = async (): Promise<void> => {
    try {
      reporter.addBreadcrumb("draft-save-started");
      await saveDraft();
    } catch (error: unknown) {
      reporter.report(error, {
        operation: "save-draft",
        severity: "medium",
      });
    }
  };

  return (
    <button type="button" onClick={() => void handleSave()}>
      Save draft
    </button>
  );
};

// ---------------------------------------------------------------------
// 11. Application bootstrap
// ---------------------------------------------------------------------

const App: FC = () => {
  return (
    <ErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} reset={reset} />}>
      <SaveDraftButton />
    </ErrorBoundary>
  );
};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

const reporter = createErrorReporter({
  release: "2026.10.1",
  environment: "production",
  sampleRate: 0.5,
  transport: createHttpTransport("/api/errors"),
});

installGlobalHandlers(reporter);

createRoot(rootElement, createRootErrorOptions(reporter)).render(
  <ErrorReporterProvider reporter={reporter}>
    <App />
  </ErrorReporterProvider>,
);

// ---------------------------------------------------------------------
// 12. Source maps
// ---------------------------------------------------------------------

//
// Production stack traces must be associated with source maps for the exact release.
// Source maps can be uploaded privately to the monitoring service rather than served
// publicly. The deployment pipeline should associate the uploaded maps with the release.
//
// For example, a build can generate hidden source maps:
//
//   build: {
//       sourcemap: "hidden"
//   }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Error boundaries provide local fallback UI; React root callbacks provide centralized render-error reporting.
// Event handlers and async operations must explicitly report failures they catch.
// window "error" captures uncaught script errors and resource-loading failures.
// unhandledrejection captures promises that reject without a handler.
// One reporter normalizes, scrubs, deduplicates, samples, enriches, and transports every report.
// Fingerprints use stable fields so variable error messages do not unnecessarily split groups.
// Release and environment metadata associate errors with the exact deployed application version.
// Source maps should be uploaded privately and associated with the corresponding release.
// Monitoring failures are swallowed so telemetry can never become an application failure.
