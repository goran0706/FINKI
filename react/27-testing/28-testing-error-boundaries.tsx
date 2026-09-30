/**
 * Testing Error Boundaries
 * ========================
 *
 * Error boundaries are React components that catch errors thrown during rendering,
 * lifecycle methods, and constructors of their descendant components. Tests should
 * verify the user-visible fallback and recovery behavior while distinguishing errors
 * that error boundaries do and do not catch.
 */

import { Component, type ErrorInfo, type FC, type ReactElement, type ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------
// 1. Basic error boundary
// ---------------------------------------------------------------------

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error boundary caught an error:", error, errorInfo);
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <h2>Something went wrong</h2>
          <p>Please try again later.</p>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

// ---------------------------------------------------------------------
// 2. Component that throws during rendering
// ---------------------------------------------------------------------

interface ThrowingComponentProps {
  readonly shouldThrow?: boolean;
}

export const ThrowingComponent: FC<ThrowingComponentProps> = ({ shouldThrow = true }): ReactElement => {
  if (shouldThrow) {
    throw new Error("Rendering failed");
  }

  return <p>Rendered successfully.</p>;
};

// An error boundary catches an error thrown while rendering a descendant:
//
// render(
//     <ErrorBoundary>
//         <ThrowingComponent />
//     </ErrorBoundary>,
// );
//
// expect(
//     screen.getByRole("heading", {name: "Something went wrong"}),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 3. Testing the fallback UI
// ---------------------------------------------------------------------

// The primary assertion should describe what the user sees:
//
// expect(screen.getByRole("alert")).toHaveTextContent(
//     "Please try again later.",
// );
//
// Avoid asserting only that `getDerivedStateFromError` or `componentDidCatch`
// was called. Those are implementation details; the fallback is observable
// application behavior.

// ---------------------------------------------------------------------
// 4. Preserving normal rendering
// ---------------------------------------------------------------------

export const SafeComponent: FC = (): ReactElement => {
  return <p>Content loaded successfully.</p>;
};

// An error boundary should not interfere with descendants that render normally:
//
// render(
//     <ErrorBoundary>
//         <SafeComponent />
//     </ErrorBoundary>,
// );
//
// expect(
//     screen.getByText("Content loaded successfully."),
// ).toBeInTheDocument();
//
// expect(
//     screen.queryByRole("heading", {name: "Something went wrong"}),
// ).not.toBeInTheDocument();

// ---------------------------------------------------------------------
// 5. Testing the boundary with a throwing descendant
// ---------------------------------------------------------------------

export const ErrorBoundaryExample: FC = (): ReactElement => {
  return (
    <ErrorBoundary>
      <ThrowingComponent />
    </ErrorBoundary>
  );
};

// A complete test can render the real component tree:
//
// render(<ErrorBoundaryExample />);
//
// expect(screen.getByRole("alert")).toBeInTheDocument();
//
// The important behavior is that the boundary replaces the failed subtree
// with its fallback UI.

// ---------------------------------------------------------------------
// 6. Suppressing expected console output
// ---------------------------------------------------------------------

// React may report caught rendering errors through the test environment's
// console. When a test intentionally triggers an error, the test can temporarily
// suppress the expected console output:
//
// const consoleError = vi
//     .spyOn(console, "error")
//     .mockImplementation(() => undefined);
//
// render(<ErrorBoundaryExample />);
//
// expect(screen.getByRole("alert")).toBeInTheDocument();
//
// consoleError.mockRestore();
//
// The spy should be restored after the test. Do not globally disable
// `console.error` for the entire test suite.

// ---------------------------------------------------------------------
// 7. Testing the original error through logging
// ---------------------------------------------------------------------

// `componentDidCatch` receives both the original error and React's component
// stack information:
//
// public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
//     console.error(error, errorInfo);
// }
//
// If application code sends this information to an error-reporting service,
// the test can mock that service and verify the observable integration:
//
// const reportError = vi.fn();
//
// // Render the boundary using a reporting implementation.
//
// expect(reportError).toHaveBeenCalledWith(
//     expect.objectContaining({message: "Rendering failed"}),
// );
//
// The exact logging mechanism is application-specific.

// ---------------------------------------------------------------------
// 8. Testing fallback content
// ---------------------------------------------------------------------

export const DetailedFallbackBoundary: FC<ErrorBoundaryProps> = ({ children }): ReactElement => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

// The fallback should be tested through accessible output:
//
// expect(
//     screen.getByRole("heading", {name: "Something went wrong"}),
// ).toBeInTheDocument();
//
// expect(
//     screen.getByText("Please try again later."),
// ).toBeInTheDocument();
//
// If the fallback contains an action, query and interact with that action
// through its accessible role and name.

// ---------------------------------------------------------------------
// 9. Testing a retry action
// ---------------------------------------------------------------------

interface RetryBoundaryProps {
  readonly children: ReactNode;
  readonly onRetry: () => void;
}

interface RetryBoundaryState {
  readonly hasError: boolean;
}

export class RetryBoundary extends Component<RetryBoundaryProps, RetryBoundaryState> {
  public state: RetryBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): RetryBoundaryState {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error boundary caught an error:", error, errorInfo);
  }

  private handleRetry = (): void => {
    this.props.onRetry();
    this.setState({ hasError: false });
  };

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <h2>Something went wrong</h2>
          <button type="button" onClick={this.handleRetry}>
            Try again
          </button>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

// A retry test should verify the user interaction:
//
// const user = userEvent.setup();
// const onRetry = vi.fn();
//
// render(
//     <RetryBoundary onRetry={onRetry}>
//         <ThrowingComponent />
//     </RetryBoundary>,
// );
//
// expect(screen.getByRole("alert")).toBeInTheDocument();
//
// await user.click(screen.getByRole("button", {name: "Try again"}));
//
// expect(onRetry).toHaveBeenCalledTimes(1);

// ---------------------------------------------------------------------
// 10. Recovery after a retry
// ---------------------------------------------------------------------

interface RecoveringChildProps {
  readonly shouldThrow: boolean;
}

export const RecoveringChild: FC<RecoveringChildProps> = ({ shouldThrow }): ReactElement => {
  if (shouldThrow) {
    throw new Error("Temporary rendering failure");
  }

  return <p>Content recovered.</p>;
};

// A realistic recovery test can control whether the child throws:
//
// const user = userEvent.setup();
// const onRetry = vi.fn();
// const {rerender} = render(
//     <RetryBoundary onRetry={onRetry}>
//         <RecoveringChild shouldThrow />
//     </RetryBoundary>,
// );
//
// expect(screen.getByRole("alert")).toBeInTheDocument();
//
// rerender(
//     <RetryBoundary onRetry={onRetry}>
//         <RecoveringChild shouldThrow={false} />
//     </RetryBoundary>,
// );
//
// The exact recovery strategy depends on how the application's boundary
// resets its state. A retry action should be tested against that real strategy.

// ---------------------------------------------------------------------
// 11. Resetting an error boundary with a key
// ---------------------------------------------------------------------

interface ResettableViewProps {
  readonly version: number;
}

export const ResettableView: FC<ResettableViewProps> = ({ version }): ReactElement => {
  return <p>View version: {version}</p>;
};

// Changing a boundary's `key` can remount it and reset its internal state:
//
// const {rerender} = render(
//     <ErrorBoundary key="first">
//         <ThrowingComponent />
//     </ErrorBoundary>,
// );
//
// expect(screen.getByRole("alert")).toBeInTheDocument();
//
// rerender(
//     <ErrorBoundary key="second">
//         <ResettableView version={2} />
//     </ErrorBoundary>,
// );
//
// expect(screen.getByText("View version: 2")).toBeInTheDocument();
//
// This tests the application's chosen reset strategy rather than assuming
// that every error boundary automatically recovers.

// ---------------------------------------------------------------------
// 12. Boundaries catch descendant render errors
// ---------------------------------------------------------------------

// Error boundaries catch errors thrown by descendants during:
//
// - Rendering.
// - Class component lifecycle methods.
// - Class component constructors.
//
// A test should place the throwing component below the boundary:
//
// render(
//     <ErrorBoundary>
//         <ThrowingComponent />
//     </ErrorBoundary>,
// );

// ---------------------------------------------------------------------
// 13. Boundaries do not catch event-handler errors
// ---------------------------------------------------------------------

export const EventHandlerFailure: FC = (): ReactElement => {
  const handleClick = (): void => {
    throw new Error("Event handler failed");
  };

  return (
    <button type="button" onClick={handleClick}>
      Trigger error
    </button>
  );
};

// Error boundaries do not catch errors thrown directly from event handlers.
//
// render(
//     <ErrorBoundary>
//         <EventHandlerFailure />
//     </ErrorBoundary>,
// );
//
// await user.click(screen.getByRole("button", {name: "Trigger error"}));
//
// The error must be handled by the event test or application code itself.
// It should not be used as a test of the error boundary's fallback behavior.

// ---------------------------------------------------------------------
// 14. Boundaries do not catch asynchronous callback errors
// ---------------------------------------------------------------------

export const AsyncFailure: FC = (): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        setTimeout(() => {
          throw new Error("Asynchronous failure");
        }, 0);
      }}
    >
      Start async operation
    </button>
  );
};

// An error thrown later by an asynchronous callback is outside the error
// boundary's rendering lifecycle. Test asynchronous error handling according
// to the application's actual mechanism instead of expecting the boundary
// to catch it.

// ---------------------------------------------------------------------
// 15. Boundaries do not catch their own errors
// ---------------------------------------------------------------------

// An error boundary does not catch an error thrown by its own implementation:
//
// class Boundary extends Component {
//     render() {
//         throw new Error("Boundary itself failed");
//     }
// }
//
// The failing code must be inside a descendant boundary if the application
// expects that failure to be handled by an error boundary.

// ---------------------------------------------------------------------
// 16. Nested error boundaries
// ---------------------------------------------------------------------

export const NestedBoundaries: FC = (): ReactElement => {
  return (
    <ErrorBoundary>
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    </ErrorBoundary>
  );
};

// When boundaries are nested, the nearest boundary capable of handling the
// descendant error can render its fallback.
//
// render(<NestedBoundaries />);
//
// expect(screen.getByRole("alert")).toBeInTheDocument();
//
// Tests should focus on the intended fallback behavior rather than relying on
// internal traversal details.

// ---------------------------------------------------------------------
// 17. Testing a component that conditionally fails
// ---------------------------------------------------------------------

interface ConditionalFailureProps {
  readonly fail: boolean;
}

export const ConditionalFailure: FC<ConditionalFailureProps> = ({ fail }): ReactElement => {
  if (fail) {
    throw new Error("Conditional failure");
  }

  return <p>Everything is working.</p>;
};

// This pattern makes it possible to test both branches:
//
// const {rerender} = render(
//     <ErrorBoundary>
//         <ConditionalFailure fail={false} />
//     </ErrorBoundary>,
// );
//
// expect(screen.getByText("Everything is working.")).toBeInTheDocument();
//
// rerender(
//     <ErrorBoundary>
//         <ConditionalFailure fail />
//     </ErrorBoundary>,
// );
//
// expect(screen.getByRole("alert")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 18. Testing accessibility of the fallback
// ---------------------------------------------------------------------

// A fallback should expose meaningful semantics:
//
// <div role="alert">
//     <h2>Something went wrong</h2>
//     <p>Please try again later.</p>
// </div>
//
// The test should query those semantics:
//
// expect(screen.getByRole("alert")).toBeInTheDocument();
// expect(
//     screen.getByRole("heading", {name: "Something went wrong"}),
// ).toBeInTheDocument();
//
// This verifies that the fallback is discoverable through the same accessibility
// tree used by assistive technologies.

// ---------------------------------------------------------------------
// 19. Avoiding implementation-detail assertions
// ---------------------------------------------------------------------

// Prefer:
//
// expect(screen.getByRole("alert")).toBeInTheDocument();
//
// over:
//
// expect(boundary.state.hasError).toBe(true);
//
// The first assertion verifies the rendered contract. The second couples the
// test directly to the boundary's internal state representation.

// ---------------------------------------------------------------------
// 20. Complete testing pattern
// ---------------------------------------------------------------------

// A typical error-boundary test should:
//
// 1. Arrange a descendant that intentionally fails during rendering.
// 2. Render it inside the real error boundary.
// 3. Suppress expected console output only for that test.
// 4. Assert the accessible fallback UI.
// 5. Interact with recovery controls when the boundary provides them.
// 6. Restore any console spies.
//
// This keeps the test focused on the failure behavior users actually encounter.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Error boundaries catch descendant rendering, lifecycle, and constructor errors.
// - `getDerivedStateFromError` can update state so the boundary renders fallback UI.
// - `componentDidCatch` is appropriate for side effects such as error reporting.
// - Test the fallback through accessible UI rather than boundary state or lifecycle methods.
// - Intentionally triggered errors may produce console output that should be scoped and restored.
// - Error boundaries do not catch errors thrown directly in event handlers.
// - Error boundaries do not catch errors thrown later by asynchronous callbacks.
// - An error boundary does not catch errors thrown by its own implementation.
// - Nested boundaries can provide more localized fallback behavior.
// - Recovery must be tested according to the application's actual reset strategy.
// - Accessibility semantics in the fallback should be tested like any other user-facing UI.
