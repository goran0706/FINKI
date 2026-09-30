/**
 * Suspense & Error Boundaries
 * ===========================
 *
 * Suspense and Error Boundaries handle different outcomes of rendering
 * asynchronous content. Suspense handles the pending state of a resource,
 * while an Error Boundary handles errors thrown while rendering descendants.
 *
 * When a component reads a Promise with React's `use()` API, a pending Promise
 * suspends rendering and can activate the nearest Suspense fallback. If that
 * Promise rejects, the rejection propagates to the nearest Error Boundary
 * instead. The two boundaries therefore complement each other rather than
 * replacing one another.
 *
 * Promises passed to `use()` must be stable and cached so React can reuse the
 * same Promise across render retries. `use()` should not be wrapped in a
 * `try/catch`; render errors and rejected resources should be handled by an
 * Error Boundary.
 */

import { Component, type ErrorInfo, type FC, type ReactElement, type ReactNode, Suspense, use, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface MessageData {
  readonly title: string;
  readonly message: string;
}

export interface MessageContentProps {
  readonly messagePromise: Promise<MessageData>;
}

export interface LoadingFallbackProps {
  readonly label: string;
}

export interface ErrorFallbackProps {
  readonly message: string;
  readonly onRetry?: () => void;
}

export interface ErrorBoundaryProps {
  readonly children: ReactNode;
  readonly resetKey?: unknown;
}

export interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

export interface RetryResourceProps {
  readonly resourceKey: number;
}

export interface BoundaryComparisonProps {
  readonly title: string;
  readonly messagePromise: Promise<MessageData>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates a stable Promise for the examples.
 *
 * The Promise is created outside the consuming component so its identity
 * remains stable when React retries rendering after suspension.
 */
const createMessageResource = (
  message: MessageData,
  delay: number,
  shouldReject: boolean = false,
): Promise<MessageData> => {
  return new Promise<MessageData>((resolve: (value: MessageData) => void, reject: (reason?: unknown) => void): void => {
    window.setTimeout((): void => {
      if (shouldReject) {
        reject(new Error(message.message));
        return;
      }

      resolve(message);
    }, delay);
  });
};

const successfulMessagePromise: Promise<MessageData> = createMessageResource(
  {
    title: "Loaded content",
    message: "The resource resolved successfully.",
  },
  1200,
);

const rejectedMessagePromise: Promise<MessageData> = createMessageResource(
  {
    title: "Failed content",
    message: "The resource could not be loaded.",
  },
  1400,
  true,
);

const slowMessagePromise: Promise<MessageData> = createMessageResource(
  {
    title: "Slow content",
    message: "This resource takes longer to resolve.",
  },
  1800,
);

/**
 * Creates a resource that can be recreated when a retry is requested.
 *
 * Unlike the module-level resources, this function is intentionally called
 * from an event handler so the new Promise is created in response to an
 * explicit user action rather than during rendering.
 */
const createRetryResource = (resourceKey: number): Promise<MessageData> => {
  return createMessageResource(
    {
      title: `Retry ${resourceKey}`,
      message: `The retry resource ${resourceKey} resolved successfully.`,
    },
    1000,
  );
};

/**
 * Displays the loading state owned by a Suspense boundary.
 */
export const LoadingFallback: FC<LoadingFallbackProps> = ({ label }): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      <p>{label}</p>
    </div>
  );
};

/**
 * Displays an error state owned by an Error Boundary.
 */
export const ErrorFallback: FC<ErrorFallbackProps> = ({ message, onRetry }): ReactElement => {
  return (
    <div role="alert" aria-live="assertive">
      <p>{message}</p>

      {onRetry !== undefined ? (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
};

/**
 * Reads a Promise with `use()`.
 *
 * While the Promise is pending, this component suspends. If the Promise
 * rejects, the rejection is handled by the nearest Error Boundary.
 */
export const MessageContent: FC<MessageContentProps> = ({ messagePromise }): ReactElement => {
  const data: MessageData = use(messagePromise);

  return (
    <article>
      <h3>{data.title}</h3>
      <p>{data.message}</p>
    </article>
  );
};

/**
 * Implements a native React Error Boundary.
 *
 * Error Boundaries are class components because React exposes the boundary
 * lifecycle through `getDerivedStateFromError` and `componentDidCatch`.
 */
export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  public componentDidUpdate(previousProps: ErrorBoundaryProps): void {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
      });
    }
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return <ErrorFallback message={this.state.error?.message ?? "Something went wrong."} />;
    }

    return <>{this.props.children}</>;
  }
}

/**
 * Demonstrates the normal Suspense lifecycle.
 *
 * The Promise begins pending, so Suspense displays its fallback. Once the
 * Promise resolves, the fallback is replaced by the rendered content.
 */
export const SuspenseHandlesPendingExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading message..." />}>
        <MessageContent messagePromise={successfulMessagePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that Suspense does not handle a rejected Promise as an error
 * state. The rejection is propagated to the nearest Error Boundary.
 */
export const ErrorBoundaryHandlesRejectionExample: FC = (): ReactElement => {
  return (
    <section>
      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback label="Loading message..." />}>
          <MessageContent messagePromise={rejectedMessagePromise} />
        </Suspense>
      </AppErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates the recommended nesting order.
 *
 * The Error Boundary is outside Suspense so that it can handle errors from
 * the content while Suspense handles the pending state of that same content.
 */
export const SuspenseInsideErrorBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback label="Loading protected content..." />}>
          <MessageContent messagePromise={rejectedMessagePromise} />
        </Suspense>
      </AppErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates independent responsibilities of the two boundaries.
 *
 * Suspense owns the pending state and the Error Boundary owns the failure
 * state. They are both required when asynchronous content can either remain
 * pending or reject.
 */
export const PendingAndErrorStatesExample: FC = (): ReactElement => {
  return (
    <section>
      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback label="Waiting for asynchronous content..." />}>
          <MessageContent messagePromise={slowMessagePromise} />
        </Suspense>
      </AppErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates that Error Boundaries isolate failures to their boundary
 * subtree.
 *
 * The healthy sibling remains outside the failing boundary and can continue
 * rendering normally.
 */
export const ErrorIsolationExample: FC = (): ReactElement => {
  return (
    <section>
      <article>
        <h3>Healthy content</h3>
        <p>This content is outside the failing boundary.</p>
      </article>

      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback label="Loading failing content..." />}>
          <MessageContent messagePromise={rejectedMessagePromise} />
        </Suspense>
      </AppErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates multiple Error Boundaries around independent regions.
 *
 * A failure in one region does not require the other region to display the
 * same error fallback.
 */
export const IndependentErrorBoundariesExample: FC = (): ReactElement => {
  return (
    <section>
      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback label="Loading first region..." />}>
          <MessageContent messagePromise={successfulMessagePromise} />
        </Suspense>
      </AppErrorBoundary>

      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback label="Loading second region..." />}>
          <MessageContent messagePromise={rejectedMessagePromise} />
        </Suspense>
      </AppErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates retrying by replacing a rejected resource with a new Promise.
 *
 * The failed Promise itself cannot become resolved later. A retry therefore
 * needs a new resource instance, and the boundary is reset when the resource
 * identity changes.
 */
export const RetryAfterErrorExample: FC = (): ReactElement => {
  const [resourceKey, setResourceKey] = useState<number>(0);

  const [messagePromise, setMessagePromise] = useState<Promise<MessageData>>(
    (): Promise<MessageData> => rejectedMessagePromise,
  );

  const handleRetry = (): void => {
    const nextKey: number = resourceKey + 1;

    setResourceKey(nextKey);
    setMessagePromise(createRetryResource(nextKey));
  };

  return (
    <section>
      <AppErrorBoundary resetKey={messagePromise}>
        <Suspense fallback={<LoadingFallback label="Loading resource..." />}>
          <MessageContent messagePromise={messagePromise} />
        </Suspense>
      </AppErrorBoundary>

      <button type="button" onClick={handleRetry}>
        Replace failed resource
      </button>
    </section>
  );
};

/**
 * Demonstrates that `use()` should not be wrapped in a try/catch block.
 *
 * React uses the suspension mechanism internally when `use()` encounters a
 * pending Promise. Error Boundaries are the appropriate React mechanism for
 * handling rejected resources and render errors.
 */
export const UseWithoutTryCatchExample: FC = (): ReactElement => {
  return (
    <section>
      <AppErrorBoundary>
        <Suspense fallback={<LoadingFallback label="Reading resource..." />}>
          <MessageContent messagePromise={successfulMessagePromise} />
        </Suspense>
      </AppErrorBoundary>

      <p>
        The component calls <code>use()</code> directly and lets React route pending and rejected states through the
        appropriate boundaries.
      </p>
    </section>
  );
};

/**
 * Demonstrates a common misconception: Suspense is not a general error
 * handler.
 *
 * A Suspense fallback represents "not ready yet", whereas an Error Boundary
 * represents "rendering failed".
 */
export const SuspenseIsNotAnErrorBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <dl>
        <dt>Suspense</dt>
        <dd>Handles pending suspended content.</dd>

        <dt>Error Boundary</dt>
        <dd>Handles errors thrown by descendants.</dd>

        <dt>Both</dt>
        <dd>Use both when asynchronous content can be pending and can also fail.</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates boundary placement as a UI design decision.
 *
 * A broad boundary can replace a large section of the interface, while a
 * narrower boundary can isolate a single piece of content.
 */
export const BoundaryPlacementExample: FC = (): ReactElement => {
  return (
    <section>
      <AppErrorBoundary>
        <article>
          <h3>Page shell</h3>
          <p>The surrounding interface remains part of the page.</p>

          <Suspense fallback={<LoadingFallback label="Loading page content..." />}>
            <MessageContent messagePromise={successfulMessagePromise} />
          </Suspense>
        </article>
      </AppErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates that a rejected Promise can be recovered by replacing the
 * resource rather than attempting to mutate the already rejected Promise.
 */
export const ResourceReplacementExample: FC = (): ReactElement => {
  const [resource, setResource] = useState<Promise<MessageData>>((): Promise<MessageData> => rejectedMessagePromise);

  const handleRecovery = (): void => {
    setResource(createRetryResource(2));
  };

  return (
    <section>
      <AppErrorBoundary resetKey={resource}>
        <Suspense fallback={<LoadingFallback label="Loading recoverable content..." />}>
          <MessageContent messagePromise={resource} />
        </Suspense>
      </AppErrorBoundary>

      <button type="button" onClick={handleRecovery}>
        Recover with a new resource
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SuspenseAndErrorBoundariesDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Suspense &amp; Error Boundaries</h1>

      <section>
        <h2>1. Suspense handles pending content</h2>
        <SuspenseHandlesPendingExample />
      </section>

      <section>
        <h2>2. Error Boundary handles rejection</h2>
        <ErrorBoundaryHandlesRejectionExample />
      </section>

      <section>
        <h2>3. Suspense inside an Error Boundary</h2>
        <SuspenseInsideErrorBoundaryExample />
      </section>

      <section>
        <h2>4. Pending and error states</h2>
        <PendingAndErrorStatesExample />
      </section>

      <section>
        <h2>5. Error isolation</h2>
        <ErrorIsolationExample />
      </section>

      <section>
        <h2>6. Independent Error Boundaries</h2>
        <IndependentErrorBoundariesExample />
      </section>

      <section>
        <h2>7. Retry after an error</h2>
        <RetryAfterErrorExample />
      </section>

      <section>
        <h2>8. Calling use without try/catch</h2>
        <UseWithoutTryCatchExample />
      </section>

      <section>
        <h2>9. Suspense is not an Error Boundary</h2>
        <SuspenseIsNotAnErrorBoundaryExample />
      </section>

      <section>
        <h2>10. Boundary placement</h2>
        <BoundaryPlacementExample />
      </section>
    </main>
  );
};

export default SuspenseAndErrorBoundariesDemo;

// ---------------------------------------------------------------------
// Summary
// Suspense handles pending content while an Error Boundary handles errors from descendants.
// A Promise read with `use()` suspends while pending and propagates rejection to the nearest Error Boundary.
// Suspense and Error Boundaries solve different states and are commonly used together.
// `use()` should not be wrapped in `try/catch`; React uses Suspense and Error Boundaries for these cases.
// Promises passed to `use()` must remain stable across render retries.
// A rejected Promise cannot be repaired; retrying normally means creating and supplying a new resource.
// Multiple boundaries can isolate loading and error states to smaller regions of the interface.
// Error Boundary placement determines how much of the rendered interface is replaced when an error occurs.
// ---------------------------------------------------------------------
