/**
 * Error Boundary Lifecycle Methods
 * =================================
 *
 * Error boundaries rely on two React lifecycle APIs: `static
 * getDerivedStateFromError` and `componentDidCatch`. The first allows a class
 * component to update its state so that fallback UI can be rendered, while the
 * second is intended for side effects such as error reporting and logging.
 *
 * `getDerivedStateFromError` must remain free of side effects because it is part
 * of React's rendering process. `componentDidCatch` runs after the error has
 * been caught and is the appropriate lifecycle method for reporting details
 * about the failure.
 */

import { Component, type ErrorInfo, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ErrorBoundaryLifecycleProps {
  readonly children: ReactNode;
}

export interface ErrorBoundaryLifecycleState {
  readonly hasError: boolean;
  readonly errorMessage: string | null;
}

export interface LifecycleThrowerProps {
  readonly shouldThrow: boolean;
}

export interface LifecycleLoggerProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates `getDerivedStateFromError`.
 *
 * This static lifecycle method receives the thrown error and returns the state
 * required to switch the boundary from normal content to fallback content.
 * Because it participates in rendering, it should not perform side effects.
 */
export class DerivedStateErrorBoundary extends Component<ErrorBoundaryLifecycleProps, ErrorBoundaryLifecycleState> {
  public readonly state: ErrorBoundaryLifecycleState = {
    hasError: false,
    errorMessage: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryLifecycleState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h3>Fallback from derived state</h3>
          <p>{this.state.errorMessage ?? "An unknown error occurred."}</p>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * Demonstrates `componentDidCatch`.
 *
 * This lifecycle method receives both the thrown error and an `ErrorInfo`
 * object containing React's component stack. It is appropriate for side
 * effects such as sending the failure to an external error-reporting service.
 */
export class DidCatchErrorBoundary extends Component<ErrorBoundaryLifecycleProps, ErrorBoundaryLifecycleState> {
  public readonly state: ErrorBoundaryLifecycleState = {
    hasError: false,
    errorMessage: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryLifecycleState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Captured error:", error);
    console.error("React component stack:", errorInfo.componentStack);
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h3>Fallback from componentDidCatch boundary</h3>
          <p>{this.state.errorMessage ?? "An unknown error occurred."}</p>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * Demonstrates the intended division of responsibility between the two
 * lifecycle methods.
 *
 * `getDerivedStateFromError` determines the state required for fallback UI,
 * while `componentDidCatch` performs the logging side effect.
 */
export class CompleteErrorBoundary extends Component<ErrorBoundaryLifecycleProps, ErrorBoundaryLifecycleState> {
  public readonly state: ErrorBoundaryLifecycleState = {
    hasError: false,
    errorMessage: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryLifecycleState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error boundary report:", {
      message: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h3>Application error</h3>
          <p>The protected interface could not be rendered successfully.</p>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * A descendant component that throws during rendering when requested.
 *
 * The error is thrown by the descendant, allowing the surrounding error
 * boundary to receive it through its lifecycle methods.
 */
export const LifecycleThrower: FC<LifecycleThrowerProps> = ({ shouldThrow }): ReactElement => {
  if (shouldThrow) {
    throw new Error("Lifecycle demonstration error.");
  }

  return (
    <section>
      <h3>Normal rendering</h3>
      <p>The descendant rendered without throwing an error.</p>
    </section>
  );
};

/**
 * Demonstrates that `getDerivedStateFromError` receives the thrown error.
 *
 * The returned state can retain selected error information for use by the
 * fallback UI.
 */
export const DerivedStateExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>getDerivedStateFromError</h2>

      <DerivedStateErrorBoundary>
        <LifecycleThrower shouldThrow={true} />
      </DerivedStateErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates that `componentDidCatch` receives an `ErrorInfo` object.
 *
 * The `componentStack` describes the React component stack associated with the
 * failure and is useful when recording an error for diagnostics.
 */
export const ComponentDidCatchExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>componentDidCatch</h2>

      <DidCatchErrorBoundary>
        <LifecycleThrower shouldThrow={true} />
      </DidCatchErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates both lifecycle methods working together.
 *
 * The state transition controls what the user sees, while the logging
 * lifecycle performs the side effect associated with the failure.
 */
export const CombinedLifecycleExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Combined lifecycle methods</h2>

      <CompleteErrorBoundary>
        <LifecycleThrower shouldThrow={true} />
      </CompleteErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates the normal path when no descendant error occurs.
 *
 * Neither error-boundary lifecycle method is invoked when the protected
 * subtree renders successfully.
 */
export const SuccessfulLifecycleExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Successful rendering path</h2>

      <CompleteErrorBoundary>
        <LifecycleThrower shouldThrow={false} />
      </CompleteErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates the important distinction between rendering state and side
 * effects.
 *
 * Updating state belongs in `getDerivedStateFromError`; logging, telemetry,
 * and other external effects belong in `componentDidCatch`.
 */
export const LifecycleResponsibilityExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Lifecycle responsibilities</h2>

      <ul>
        <li>
          <strong>getDerivedStateFromError:</strong> derives fallback state during error handling.
        </li>
        <li>
          <strong>componentDidCatch:</strong> performs post-catch side effects such as logging.
        </li>
      </ul>
    </section>
  );
};

/**
 * Demonstrates that the lifecycle methods belong to the error boundary rather
 * than to the component that throws.
 *
 * The descendant does not need to know which boundary catches its error.
 */
export const BoundaryOwnershipExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Boundary owns the error handling</h2>

      <CompleteErrorBoundary>
        <article>
          <h3>Protected feature</h3>
          <LifecycleThrower shouldThrow={true} />
        </article>
      </CompleteErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates a common misconception about `componentDidCatch`.
 *
 * `componentDidCatch` is not the place to render fallback UI directly. The
 * fallback should be derived from boundary state, typically through
 * `getDerivedStateFromError`.
 */
export const ComponentDidCatchMisconceptionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>componentDidCatch misconception</h2>

      <p>`componentDidCatch` is intended for side effects. It does not return fallback JSX.</p>

      <CompleteErrorBoundary>
        <LifecycleThrower shouldThrow={true} />
      </CompleteErrorBoundary>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ErrorBoundaryLifecycleDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Error Boundary Lifecycle Methods</h1>

      <DerivedStateExample />

      <ComponentDidCatchExample />

      <CombinedLifecycleExample />

      <SuccessfulLifecycleExample />

      <LifecycleResponsibilityExample />

      <BoundaryOwnershipExample />

      <ComponentDidCatchMisconceptionExample />
    </main>
  );
};

export default ErrorBoundaryLifecycleDemo;

// ---------------------------------------------------------------------
// Summary
// `getDerivedStateFromError` is a static lifecycle method used to derive fallback state after a descendant error.
// `componentDidCatch` receives the error and `ErrorInfo` and is intended for side effects such as logging.
// `getDerivedStateFromError` should remain free of side effects because it participates in rendering.
// `componentDidCatch` is not used to return fallback JSX; the boundary renders fallback UI from its state.
// The component that throws does not need to implement error-boundary lifecycle methods.
// Both lifecycle methods operate on the error boundary class that protects the descendant subtree.
// When no descendant error occurs, neither error-boundary lifecycle method is invoked.
// ---------------------------------------------------------------------
