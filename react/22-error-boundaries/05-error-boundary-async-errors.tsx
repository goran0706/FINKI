/**
 * Error Boundary Async Errors
 * ============================
 *
 * Error boundaries do not automatically catch errors thrown asynchronously
 * from promise callbacks, timers, effects, or other asynchronous work. Those
 * failures occur outside the synchronous rendering and lifecycle work covered
 * by the error-boundary mechanism.
 *
 * Asynchronous failures should normally be caught where the asynchronous
 * operation is performed and represented explicitly in component state. If an
 * application needs an error boundary to render the fallback for an
 * asynchronous failure, the failure can be recorded in state and deliberately
 * thrown during a later render.
 */

import { Component, type ErrorInfo, type FC, type ReactElement, type ReactNode, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AsyncErrorBoundaryProps {
  readonly children: ReactNode;
}

export interface AsyncErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

export interface AsyncFailureExampleProps {
  readonly delay: number;
}

export interface AsyncOperationState {
  readonly status: "idle" | "loading" | "success" | "error";
  readonly error: Error | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A standard error boundary used to demonstrate the boundary's behavior around
 * asynchronous failures.
 */
export class AsyncErrorBoundary extends Component<AsyncErrorBoundaryProps, AsyncErrorBoundaryState> {
  public readonly state: AsyncErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): AsyncErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Asynchronous error boundary caught:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h3>Async operation failed</h3>
          <p>{this.state.error?.message ?? "An unexpected error occurred."}</p>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * Demonstrates a promise rejection that is handled directly by the
 * asynchronous operation.
 *
 * The error boundary does not catch the rejection automatically because the
 * rejection occurs after the synchronous event that started the operation.
 */
export const PromiseRejectionExample: FC = (): ReactElement => {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequest = (): void => {
    setStatus("loading");
    setErrorMessage(null);

    void Promise.reject(new Error("The request failed.")).catch((error: unknown): void => {
      const message: string = error instanceof Error ? error.message : "Unknown request error.";

      setStatus("error");
      setErrorMessage(message);
    });
  };

  return (
    <section>
      <h2>Promise rejection handling</h2>

      <button type="button" onClick={handleRequest}>
        Start request
      </button>

      {status === "loading" ? <p>Request in progress...</p> : null}

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
    </section>
  );
};

/**
 * Demonstrates an asynchronous timer failure handled inside the timer
 * callback.
 *
 * The `try/catch` must surround the code that executes asynchronously. A
 * `try/catch` around `setTimeout` itself would not catch an exception thrown
 * later by the callback.
 */
export const TimerErrorExample: FC = (): ReactElement => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStart = (): void => {
    setErrorMessage(null);

    window.setTimeout((): void => {
      try {
        throw new Error("The delayed operation failed.");
      } catch (error: unknown) {
        const message: string = error instanceof Error ? error.message : "Unknown timer error.";

        setErrorMessage(message);
      }
    }, 500);
  };

  return (
    <section>
      <h2>Timer errors</h2>

      <button type="button" onClick={handleStart}>
        Start delayed operation
      </button>

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
    </section>
  );
};

/**
 * Demonstrates an asynchronous operation started from an effect.
 *
 * The rejection is handled inside the effect rather than being delegated to
 * an error boundary.
 */
export const EffectAsyncErrorExample: FC = (): ReactElement => {
  const [state, setState] = useState<AsyncOperationState>({
    status: "loading",
    error: null,
  });

  useEffect((): (() => void) => {
    let cancelled: boolean = false;

    const runOperation = async (): Promise<void> => {
      try {
        await Promise.reject(new Error("Effect operation failed."));

        if (!cancelled) {
          setState({
            status: "success",
            error: null,
          });
        }
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        const normalizedError: Error = error instanceof Error ? error : new Error("Unknown effect error.");

        setState({
          status: "error",
          error: normalizedError,
        });
      }
    };

    void runOperation();

    return (): void => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <h2>Async errors from effects</h2>

      {state.status === "loading" ? <p>Running asynchronous operation...</p> : null}

      {state.status === "success" ? <p>Operation completed successfully.</p> : null}

      {state.status === "error" ? <p role="alert">{state.error?.message ?? "The operation failed."}</p> : null}
    </section>
  );
};

/**
 * Demonstrates the difference between an asynchronous error and a rendering
 * error from the perspective of an error boundary.
 *
 * The asynchronous operation catches its own failure and stores it as state.
 * The boundary does not receive the error automatically.
 */
export const BoundaryDoesNotCatchAsyncExample: FC = (): ReactElement => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAsyncFailure = (): void => {
    void Promise.resolve()
      .then((): never => {
        throw new Error("Async failure outside rendering.");
      })
      .catch((error: unknown): void => {
        const message: string = error instanceof Error ? error.message : "Unknown asynchronous error.";

        setErrorMessage(message);
      });
  };

  return (
    <section>
      <h2>Error boundary does not catch async failures automatically</h2>

      <AsyncErrorBoundary>
        <button type="button" onClick={handleAsyncFailure}>
          Trigger asynchronous failure
        </button>
      </AsyncErrorBoundary>

      {errorMessage ? <p role="alert">Handled by the asynchronous operation: {errorMessage}</p> : null}
    </section>
  );
};

/**
 * Demonstrates the explicit bridge from asynchronous failure state to an
 * error boundary.
 *
 * The asynchronous operation catches the failure and stores the `Error` in
 * state. During the following render, the component deliberately throws that
 * error. Because the throw occurs during rendering, the ancestor boundary can
 * handle it.
 */
export const RethrowDuringRenderExample: FC = (): ReactElement => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }

  const handleRequest = (): void => {
    void Promise.reject(new Error("Failure rethrown during render.")).catch((caughtError: unknown): void => {
      const normalizedError: Error =
        caughtError instanceof Error ? caughtError : new Error("Unknown asynchronous error.");

      setError(normalizedError);
    });
  };

  return (
    <section>
      <h2>Rethrowing an async error during render</h2>

      <button type="button" onClick={handleRequest}>
        Trigger async failure
      </button>
    </section>
  );
};

/**
 * Demonstrates the complete asynchronous-to-boundary pattern.
 *
 * The asynchronous operation owns the rejection handling, state stores the
 * failure, and the render phase deliberately throws the stored error so that
 * the ancestor error boundary can render its fallback.
 */
export const AsyncErrorBoundaryBridgeExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Async error to error-boundary bridge</h2>

      <AsyncErrorBoundary>
        <RethrowDuringRenderExample />
      </AsyncErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates a common misconception: wrapping the code that starts an
 * asynchronous operation in `try/catch` does not catch errors that occur later
 * in the asynchronous callback.
 */
export const AsyncTryCatchMisconceptionExample: FC = (): ReactElement => {
  const [message, setMessage] = useState<string>("No asynchronous failure has occurred.");

  const handleOperation = (): void => {
    try {
      window.setTimeout((): void => {
        try {
          throw new Error("Delayed failure.");
        } catch (error: unknown) {
          const errorMessage: string = error instanceof Error ? error.message : "Unknown delayed error.";

          setMessage(errorMessage);
        }
      }, 500);
    } catch {
      setMessage("This catch does not handle the delayed callback.");
    }
  };

  return (
    <section>
      <h2>Asynchronous try/catch misconception</h2>

      <button type="button" onClick={handleOperation}>
        Start delayed operation
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates explicit error state as the normal way to represent an
 * asynchronous operation's failure.
 *
 * This pattern allows the component to distinguish loading, success, and error
 * states without treating an error boundary as a data-fetching state manager.
 */
export const ExplicitAsyncStateExample: FC = (): ReactElement => {
  const [state, setState] = useState<AsyncOperationState>({
    status: "idle",
    error: null,
  });

  const handleOperation = (): void => {
    setState({
      status: "loading",
      error: null,
    });

    void Promise.resolve()
      .then((): never => {
        throw new Error("Data operation failed.");
      })
      .catch((error: unknown): void => {
        const normalizedError: Error = error instanceof Error ? error : new Error("Unknown data operation error.");

        setState({
          status: "error",
          error: normalizedError,
        });
      });
  };

  return (
    <section>
      <h2>Explicit asynchronous state</h2>

      <button type="button" onClick={handleOperation}>
        Run data operation
      </button>

      {state.status === "idle" ? <p>Ready.</p> : null}

      {state.status === "loading" ? <p>Loading...</p> : null}

      {state.status === "error" ? <p role="alert">{state.error?.message ?? "The operation failed."}</p> : null}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ErrorBoundaryAsyncErrorsDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Error Boundary Async Errors</h1>

      <PromiseRejectionExample />

      <TimerErrorExample />

      <EffectAsyncErrorExample />

      <BoundaryDoesNotCatchAsyncExample />

      <AsyncErrorBoundaryBridgeExample />

      <AsyncTryCatchMisconceptionExample />

      <ExplicitAsyncStateExample />
    </main>
  );
};

export default ErrorBoundaryAsyncErrorsDemo;

// ---------------------------------------------------------------------
// Summary
// Error boundaries do not automatically catch errors from promise callbacks, timers, effects, or other asynchronous work.
// Asynchronous operations should normally catch and represent their failures explicitly in state.
// A try/catch must surround the code that actually executes asynchronously to handle asynchronous exceptions.
// Error boundaries are not asynchronous operation managers or data-fetching state managers.
// An asynchronous failure can be deliberately passed to an error boundary by storing the error and throwing it during a later render.
// Throwing the stored error during render is what brings the failure into the scope of the ancestor error boundary.
// Explicit loading, success, and error states are usually the appropriate model for recoverable asynchronous operations.
// ---------------------------------------------------------------------
