/**
 * Error Boundary Fallback UI
 * ===========================
 *
 * An error boundary renders fallback UI after a descendant throws an error
 * during a React rendering phase that error boundaries can handle. The
 * fallback replaces the failed descendant subtree while the surrounding
 * React tree can continue rendering.
 *
 * Fallback UI can be static or can expose information derived from the error.
 * A useful fallback should communicate that the affected interface failed and
 * provide an appropriate recovery action when recovery is possible. Error
 * details should be handled carefully because raw error messages may expose
 * implementation details that are not suitable for end users.
 */

import { Component, type ErrorInfo, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FallbackBoundaryProps {
  readonly children: ReactNode;
}

export interface FallbackBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

export interface FallbackUIProps {
  readonly error: Error | null;
  readonly onRetry: () => void;
}

export interface FallbackThrowerProps {
  readonly shouldThrow: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A simple fallback component that communicates the failure without exposing
 * the underlying JavaScript error to the user.
 */
export const BasicFallbackUI: FC<FallbackUIProps> = ({ onRetry }): ReactElement => {
  return (
    <section role="alert">
      <h2>Something went wrong</h2>
      <p>This part of the interface could not be displayed.</p>
      <button type="button" onClick={onRetry}>
        Try again
      </button>
    </section>
  );
};

/**
 * A fallback component that displays a controlled error message.
 *
 * Raw error messages are generally better suited to logs and diagnostics than
 * to user-facing interfaces, so applications should decide deliberately which
 * information is safe to expose.
 */
export const ErrorMessageFallbackUI: FC<FallbackUIProps> = ({ error, onRetry }): ReactElement => {
  return (
    <section role="alert">
      <h2>Unable to display this section</h2>
      <p>{error?.message ?? "An unexpected error occurred."}</p>
      <button type="button" onClick={onRetry}>
        Try again
      </button>
    </section>
  );
};

/**
 * An error boundary that renders a static fallback after a descendant error.
 *
 * The fallback is rendered from boundary state rather than directly from
 * `componentDidCatch`.
 */
export class StaticFallbackBoundary extends Component<FallbackBoundaryProps, FallbackBoundaryState> {
  public readonly state: FallbackBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): FallbackBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Fallback boundary caught:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <BasicFallbackUI
          error={null}
          onRetry={() =>
            this.setState({
              hasError: false,
              error: null,
            })
          }
        />
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * An error boundary that passes the captured error to its fallback component.
 *
 * This allows the fallback component to display selected diagnostic
 * information while keeping the error-boundary mechanism separate from the
 * fallback presentation.
 */
export class DynamicFallbackBoundary extends Component<FallbackBoundaryProps, FallbackBoundaryState> {
  public readonly state: FallbackBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): FallbackBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Dynamic fallback error:", error);
    console.error("Dynamic fallback component stack:", errorInfo.componentStack);
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return <ErrorMessageFallbackUI error={this.state.error} onRetry={this.handleRetry} />;
    }

    return <>{this.props.children}</>;
  }

  private readonly handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };
}

/**
 * A descendant that can intentionally throw during rendering.
 */
export const FallbackThrower: FC<FallbackThrowerProps> = ({ shouldThrow }): ReactElement => {
  if (shouldThrow) {
    throw new Error("The protected feature failed to render.");
  }

  return (
    <section>
      <h3>Feature rendered successfully</h3>
      <p>The descendant did not throw an error.</p>
    </section>
  );
};

/**
 * Demonstrates a simple static fallback.
 *
 * The boundary replaces the failed descendant with user-facing recovery UI.
 */
export const StaticFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Static fallback</h2>

      <StaticFallbackBoundary>
        <FallbackThrower shouldThrow={true} />
      </StaticFallbackBoundary>
    </section>
  );
};

/**
 * Demonstrates a fallback that receives the captured error.
 *
 * This pattern can expose carefully selected diagnostic information when that
 * information is appropriate for the intended audience.
 */
export const DynamicFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Fallback with error information</h2>

      <DynamicFallbackBoundary>
        <FallbackThrower shouldThrow={true} />
      </DynamicFallbackBoundary>
    </section>
  );
};

/**
 * Demonstrates a fallback with a recovery action.
 *
 * Resetting the boundary state allows React to attempt rendering the protected
 * subtree again. Whether this succeeds depends on whether the underlying
 * failure condition has actually been resolved.
 */
export const RecoverableFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Fallback recovery</h2>

      <DynamicFallbackBoundary>
        <FallbackThrower shouldThrow={true} />
      </DynamicFallbackBoundary>
    </section>
  );
};

/**
 * Demonstrates the normal rendering path when no error occurs.
 */
export const SuccessfulFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>No fallback required</h2>

      <DynamicFallbackBoundary>
        <FallbackThrower shouldThrow={false} />
      </DynamicFallbackBoundary>
    </section>
  );
};

/**
 * Demonstrates a contextual fallback for a feature rather than an application
 * wide error screen.
 */
export const FeatureFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Feature-specific fallback</h2>

      <DynamicFallbackBoundary>
        <article>
          <h3>Account information</h3>
          <FallbackThrower shouldThrow={true} />
        </article>
      </DynamicFallbackBoundary>
    </section>
  );
};

/**
 * Demonstrates a common misconception: a fallback is not rendered alongside
 * the failed subtree. The boundary renders the fallback in place of that
 * descendant subtree after an error is caught.
 */
export const FallbackReplacementExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Fallback replaces the failed subtree</h2>

      <DynamicFallbackBoundary>
        <FallbackThrower shouldThrow={true} />
      </DynamicFallbackBoundary>

      <p>This paragraph is outside the boundary and remains independent of the failed subtree.</p>
    </section>
  );
};

/**
 * Demonstrates that a user-facing fallback should generally avoid exposing
 * internal implementation details.
 */
export const SafeFallbackMessageExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>User-facing error message</h2>

      <BasicFallbackUI
        error={null}
        onRetry={() => {
          // A real application could retry or reset related state here.
        }}
      />
    </section>
  );
};

/**
 * Demonstrates that an error boundary fallback is itself ordinary React UI.
 *
 * The fallback can contain headings, explanatory text, controls, and other
 * elements appropriate to the recovery experience.
 */
export const FallbackCompositionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Composing fallback UI</h2>

      <section role="alert">
        <h3>Profile unavailable</h3>
        <p>The profile section could not be loaded. Other parts of the application remain available.</p>
        <button
          type="button"
          onClick={() => {
            // A real application could initiate a recovery action here.
          }}
        >
          Retry profile
        </button>
      </section>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ErrorBoundaryFallbackDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Error Boundary Fallback UI</h1>

      <StaticFallbackExample />

      <DynamicFallbackExample />

      <RecoverableFallbackExample />

      <SuccessfulFallbackExample />

      <FeatureFallbackExample />

      <FallbackReplacementExample />

      <SafeFallbackMessageExample />

      <FallbackCompositionExample />
    </main>
  );
};

export default ErrorBoundaryFallbackDemo;

// ---------------------------------------------------------------------
// Summary
// Fallback UI is rendered when an error boundary catches a supported descendant error.
// The fallback replaces the failed descendant subtree rather than rendering alongside it.
// A fallback can be static or receive selected error information from boundary state.
// User-facing fallbacks should communicate the failure without unnecessarily exposing internal implementation details.
// A fallback can provide a recovery action that resets the boundary state and retries rendering.
// Resetting the boundary does not guarantee recovery if the underlying failure condition still exists.
// Error boundaries can provide feature-level fallback UI so unrelated parts of the interface remain available.
// The fallback itself is ordinary React UI and can contain accessible messages and recovery controls.
// ---------------------------------------------------------------------
