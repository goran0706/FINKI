/**
 * Error Boundary Limitations
 * ===========================
 *
 * Error boundaries handle errors thrown during rendering, in lifecycle methods,
 * and in constructors of descendant components. They do not function as a
 * general-purpose JavaScript error handler for every type of failure that can
 * occur in a React application.
 *
 * In particular, error boundaries do not catch errors thrown from event
 * handlers, asynchronous callbacks, server-side rendering, or the boundary
 * component itself. Those cases require their own error-handling mechanisms.
 */

import { Component, type ErrorInfo, type FC, type ReactElement, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LimitationBoundaryProps {
  readonly children: ReactNode;
}

export interface LimitationBoundaryState {
  readonly hasError: boolean;
}

export interface ErrorSourceExampleProps {
  readonly title: string;
  readonly description: string;
}

export interface EventHandlerExampleProps {
  readonly onErrorHandled: () => void;
}

export interface AsyncErrorExampleProps {
  readonly onErrorHandled: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A minimal error boundary used to demonstrate which errors React can route
 * through the error-boundary mechanism.
 */
export class LimitationErrorBoundary extends Component<LimitationBoundaryProps, LimitationBoundaryState> {
  public readonly state: LimitationBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_error: Error): LimitationBoundaryState {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error boundary caught:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h3>Rendering error caught</h3>
          <p>This descendant error is within the scope of the error boundary.</p>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * Demonstrates an error that occurs during descendant rendering.
 *
 * Rendering errors are within the normal scope of an error boundary.
 */
export const RenderingErrorExample: FC = (): ReactElement => {
  const ThrowingComponent: FC = (): ReactElement => {
    throw new Error("Rendering failure.");
  };

  return (
    <section>
      <h2>Rendering errors are caught</h2>

      <LimitationErrorBoundary>
        <ThrowingComponent />
      </LimitationErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates the correct pattern for handling an event-handler failure.
 *
 * Error boundaries do not catch errors thrown by event handlers. Event-handler
 * failures should instead be handled directly inside the event handler or by
 * another appropriate application-level mechanism.
 */
export const EventHandlerErrorExample: FC<EventHandlerExampleProps> = ({ onErrorHandled }): ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleClick = (): void => {
    try {
      throw new Error("Event-handler failure.");
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown event-handler error.";

      setMessage(errorMessage);
      onErrorHandled();
    }
  };

  return (
    <section>
      <h2>Event-handler errors</h2>

      <p>Error boundaries do not catch errors thrown from event handlers.</p>

      <button type="button" onClick={handleClick}>
        Trigger handled event error
      </button>

      {message ? <p role="alert">{message}</p> : null}
    </section>
  );
};

/**
 * Demonstrates the correct pattern for an asynchronous failure.
 *
 * An error thrown after an asynchronous operation has completed is outside
 * the rendering phase protected by an error boundary. The asynchronous
 * operation should therefore represent its failure explicitly in state.
 */
export const AsyncErrorExample: FC<AsyncErrorExampleProps> = ({ onErrorHandled }): ReactElement => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAsyncOperation = (): void => {
    void Promise.resolve()
      .then((): never => {
        throw new Error("Asynchronous operation failed.");
      })
      .catch((error: unknown): void => {
        const message: string = error instanceof Error ? error.message : "Unknown asynchronous error.";

        setErrorMessage(message);
        onErrorHandled();
      });
  };

  return (
    <section>
      <h2>Asynchronous errors</h2>

      <p>
        Asynchronous failures should be handled by the asynchronous operation rather than relying on an error boundary.
      </p>

      <button type="button" onClick={handleAsyncOperation}>
        Start asynchronous operation
      </button>

      {errorMessage ? <p role="alert">{errorMessage}</p> : null}
    </section>
  );
};

/**
 * Demonstrates that server-side rendering has a separate error-handling
 * boundary from the client-side React error-boundary mechanism.
 *
 * Error boundaries are React components that participate in client rendering;
 * they should not be treated as a server-rendering exception mechanism.
 */
export const ServerRenderingLimitationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Server-side rendering</h2>

      <p>Errors occurring while server-rendering the application are not caught by a client-side error boundary.</p>

      <p>Server rendering infrastructure must handle server-side rendering failures separately.</p>
    </section>
  );
};

/**
 * Demonstrates that an error boundary does not protect itself.
 *
 * An error thrown by the boundary's own implementation is outside the
 * descendant subtree that the boundary is responsible for protecting.
 */
export const BoundarySelfErrorExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Errors in the boundary itself</h2>

      <p>An error boundary cannot catch an error thrown by its own rendering or lifecycle implementation.</p>

      <p>To isolate failures at this level, another error boundary must exist higher in the component tree.</p>
    </section>
  );
};

/**
 * Demonstrates that error boundaries are not a replacement for ordinary
 * `try/catch` around imperative code.
 */
export const TryCatchLimitationExample: FC = (): ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleOperation = (): void => {
    try {
      throw new Error("Imperative operation failed.");
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown operation error.";

      setMessage(errorMessage);
    }
  };

  return (
    <section>
      <h2>Imperative error handling</h2>

      <p>
        Imperative operations should use appropriate local error handling instead of expecting an error boundary to
        catch them.
      </p>

      <button type="button" onClick={handleOperation}>
        Run protected operation
      </button>

      {message ? <p role="alert">{message}</p> : null}
    </section>
  );
};

/**
 * Demonstrates that error boundaries are not global application error
 * handlers.
 *
 * Multiple boundaries can provide different recovery scopes, but each boundary
 * only protects its descendant React subtree.
 */
export const LocalScopeExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Local protection scope</h2>

      <LimitationErrorBoundary>
        <article>
          <h3>Protected feature</h3>
          <p>This subtree has an explicit error boundary.</p>
        </article>
      </LimitationErrorBoundary>

      <article>
        <h3>Unrelated feature</h3>
        <p>This feature belongs to a different part of the React tree.</p>
      </article>
    </section>
  );
};

/**
 * Demonstrates the distinction between rendering errors and other failures.
 *
 * The boundary is appropriate for failures that occur while React is
 * constructing or updating the protected descendant tree, but other execution
 * contexts require their own error-handling strategy.
 */
export const ErrorContextComparisonExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Error context comparison</h2>

      <ul>
        <li>Rendering and supported lifecycle failures can be caught by an ancestor error boundary.</li>
        <li>Event-handler failures require event-level handling.</li>
        <li>Asynchronous failures require promise or asynchronous operation handling.</li>
        <li>Server-rendering failures require server-side handling.</li>
        <li>Errors inside the boundary itself require protection from another boundary higher in the tree.</li>
      </ul>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ErrorBoundaryLimitationsDemo: FC = (): ReactElement => {
  const handleHandledError = (): void => {
    console.info("The example handled the error outside the boundary.");
  };

  return (
    <main>
      <h1>Error Boundary Limitations</h1>

      <RenderingErrorExample />

      <EventHandlerErrorExample onErrorHandled={handleHandledError} />

      <AsyncErrorExample onErrorHandled={handleHandledError} />

      <ServerRenderingLimitationExample />

      <BoundarySelfErrorExample />

      <TryCatchLimitationExample />

      <LocalScopeExample />

      <ErrorContextComparisonExample />
    </main>
  );
};

export default ErrorBoundaryLimitationsDemo;

// ---------------------------------------------------------------------
// Summary
// Error boundaries catch supported errors thrown during descendant rendering, constructors, and lifecycle methods.
// Error boundaries do not catch errors thrown by event handlers.
// Errors from asynchronous callbacks and promise operations require their own error-handling mechanisms.
// Client-side error boundaries do not provide a server-side rendering exception boundary.
// An error boundary cannot catch errors thrown by its own implementation.
// Imperative operations should use appropriate try/catch or operation-specific error handling.
// An error boundary protects its descendant React subtree rather than acting as a global JavaScript error handler.
// Multiple boundaries can provide separate failure and recovery scopes within an application.
// ----------------------------------------------------------------------reset.tsx
