/**
 * Error Boundaries
 * ================
 *
 * An error boundary is a React class component that catches JavaScript errors
 * thrown during rendering, lifecycle methods, and constructors of descendant
 * components. When an error is caught, the boundary can render fallback UI
 * instead of allowing the failed subtree to break the surrounding application.
 *
 * Error boundaries are implemented with the `static getDerivedStateFromError`
 * lifecycle method and/or `componentDidCatch`. The former is used to update
 * state so fallback UI can render, while the latter is intended for side effects
 * such as error logging. An error boundary catches errors in its descendants,
 * not errors thrown by the boundary component itself.
 */

import { Component, type ErrorInfo, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

export interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export interface ErrorBoundaryFallbackProps {
  readonly onRetry: () => void;
}

export interface ThrowingComponentProps {
  readonly shouldThrow: boolean;
}

export interface ErrorBoundaryDemoProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A minimal error boundary implementation.
 *
 * `getDerivedStateFromError` runs after a descendant throws during a render,
 * lifecycle method, or constructor. Returning a new state causes the boundary
 * to render its fallback UI on the next render.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public readonly state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error boundary caught an error:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h2>Something went wrong.</h2>
          <p>The failed component subtree has been replaced.</p>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * A descendant component that can intentionally throw during rendering.
 *
 * The error is thrown from the descendant rather than from the boundary itself,
 * allowing the surrounding `ErrorBoundary` to catch it.
 */
export const ThrowingComponent: FC<ThrowingComponentProps> = ({ shouldThrow }): ReactElement => {
  if (shouldThrow) {
    throw new Error("Intentional rendering error.");
  }

  return (
    <section>
      <h3>Working component</h3>
      <p>This component rendered successfully.</p>
    </section>
  );
};

/**
 * Demonstrates the normal rendering path before an error occurs.
 */
export const SuccessfulRenderingExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Successful rendering</h2>
      <p>The descendant renders normally when no error is thrown.</p>
      <ThrowingComponent shouldThrow={false} />
    </section>
  );
};

/**
 * Demonstrates an error thrown by a descendant during rendering.
 *
 * The error boundary above this component catches the error and renders its
 * fallback instead of allowing the failed subtree to continue rendering.
 */
export const RenderingErrorExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Rendering error</h2>
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates that the error boundary only protects its descendant subtree.
 *
 * The boundary does not catch errors thrown by the boundary component itself,
 * nor does it provide a general-purpose try/catch mechanism for arbitrary
 * asynchronous or event-handler errors.
 */
export const BoundaryScopeExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Error boundary scope</h2>
      <ErrorBoundary>
        <p>Errors thrown by descendants during supported React rendering phases can be handled by this boundary.</p>
      </ErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates that an error boundary can protect a specific part of an
 * otherwise functioning interface.
 *
 * Content outside the boundary remains independently rendered.
 */
export const IsolatedSubtreeExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Isolated subtree</h2>

      <p>This content is outside the error boundary and belongs to the surrounding application.</p>

      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>

      <p>This content is also outside the failed subtree.</p>
    </section>
  );
};

/**
 * Demonstrates that `getDerivedStateFromError` and `componentDidCatch` have
 * different responsibilities.
 *
 * The state update determines what gets rendered, while `componentDidCatch`
 * is appropriate for side effects such as logging the error.
 */
export class ErrorBoundaryLifecycleExample extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public readonly state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Lifecycle error:", error);
    console.error("Lifecycle component stack:", errorInfo.componentStack);
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h3>Fallback rendered</h3>
          <p>`getDerivedStateFromError` changed the boundary state, allowing the fallback to render.</p>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * Demonstrates the relationship between a throwing descendant and its nearest
 * error boundary.
 *
 * React searches upward through the rendered tree for an error boundary that
 * can handle the error.
 */
export const NearestBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Nearest error boundary</h2>

      <ErrorBoundary>
        <div>
          <p>Outer protected subtree.</p>

          <ErrorBoundary>
            <ThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates the common misconception that an error boundary catches every
 * JavaScript error occurring anywhere in the application.
 *
 * Error boundaries are specifically part of React's error-handling model and
 * do not replace ordinary error handling for unrelated asynchronous work,
 * event handlers, or server-side failures.
 */
export const ErrorBoundaryMisconceptionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Error boundary misconception</h2>

      <p>An error boundary is not equivalent to a global JavaScript `try/catch` or global error handler.</p>

      <ErrorBoundary>
        <p>It protects descendant React rendering work within its boundary.</p>
      </ErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates a boundary around a reusable UI region.
 *
 * The boundary can be placed around an individual feature instead of wrapping
 * the entire application.
 */
export const FeatureBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Feature-level boundary</h2>

      <ErrorBoundary>
        <article>
          <h3>Profile feature</h3>
          <p>
            A feature can have its own failure boundary so its failure is isolated from unrelated interface regions.
          </p>
        </article>
      </ErrorBoundary>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ErrorBoundaryDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Error Boundaries</h1>

      <SuccessfulRenderingExample />

      <RenderingErrorExample />

      <BoundaryScopeExample />

      <IsolatedSubtreeExample />

      <section>
        <h2>Error boundary lifecycle</h2>
        <ErrorBoundaryLifecycleExample>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundaryLifecycleExample>
      </section>

      <NearestBoundaryExample />

      <ErrorBoundaryMisconceptionExample />

      <FeatureBoundaryExample />
    </main>
  );
};

export default ErrorBoundaryDemo;

// ---------------------------------------------------------------------
// Summary
// Error boundaries are React class components that protect descendant subtrees from supported rendering errors.
// `static getDerivedStateFromError` updates state so fallback UI can be rendered.
// `componentDidCatch` is used for side effects such as logging error information.
// An error boundary catches errors in descendants, not errors thrown by the boundary itself.
// The nearest applicable boundary in the React tree handles a descendant error.
// A boundary can isolate a feature or smaller UI region instead of wrapping the entire application.
// Error boundaries are not a replacement for handling asynchronous failures, event-handler errors, or server-side errors.
// ---------------------------------------------------------------------
