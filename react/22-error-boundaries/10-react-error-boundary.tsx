/**
 * React Error Boundary
 * ====================
 *
 * React provides error-boundary behavior through class components that
 * implement getDerivedStateFromError and/or componentDidCatch. Error
 * boundaries isolate rendering failures in descendant component trees and
 * replace the failed subtree with fallback UI.
 *
 * A reusable error-boundary abstraction can centralize fallback rendering,
 * diagnostics, and recovery while allowing different parts of an application
 * to choose their own failure boundaries. The react-error-boundary package
 * provides a functional API around these concepts, including fallback
 * components, reset handlers, and reset keys.
 */

import { Component, type ErrorInfo, type FC, type ReactElement, type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface NativeBoundaryProps {
  readonly children: ReactNode;
}

export interface NativeBoundaryState {
  readonly hasError: boolean;
}

export interface FailingComponentProps {
  readonly shouldThrow: boolean;
  readonly label: string;
}

export interface CustomFallbackProps {
  readonly error: Error;
  readonly resetErrorBoundary: () => void;
}

export interface RecoveryFeatureProps {
  readonly shouldThrow: boolean;
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A deliberately failing component used to demonstrate error-boundary
 * behavior.
 *
 * Throwing during render allows the nearest error boundary to replace this
 * component subtree with fallback UI.
 */
export const FailingComponent: FC<FailingComponentProps> = ({ shouldThrow, label }): ReactElement => {
  if (shouldThrow) {
    throw new Error(`${label} failed during rendering.`);
  }

  return (
    <article>
      <h3>{label}</h3>
      <p>{label} rendered successfully.</p>
    </article>
  );
};

/**
 * Demonstrates the native React error-boundary pattern.
 *
 * This class boundary uses the same React lifecycle mechanisms that reusable
 * error-boundary libraries build upon: getDerivedStateFromError for fallback
 * state and componentDidCatch for side effects such as logging.
 */
export class NativeReactErrorBoundary extends Component<NativeBoundaryProps, NativeBoundaryState> {
  public readonly state: NativeBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_error: Error): NativeBoundaryState {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Native React boundary caught:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h3>Native React fallback</h3>
          <p>The descendant component could not be rendered.</p>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * Demonstrates a fallback component supplied to react-error-boundary.
 *
 * The library passes the thrown Error and a reset function to the fallback.
 * The fallback can display a user-facing message while keeping recovery logic
 * explicit.
 */
export const ErrorBoundaryFallback: FC<CustomFallbackProps> = ({ error, resetErrorBoundary }): ReactElement => {
  return (
    <section role="alert">
      <h3>Feature unavailable</h3>
      <p>{error.message}</p>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </section>
  );
};

/**
 * Demonstrates the FallbackProps shape exposed by react-error-boundary.
 *
 * The library's fallback component receives error information and a reset
 * function. This provides a functional alternative to implementing fallback
 * state manually in a class boundary.
 */
export const LibraryFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }): ReactElement => {
  return (
    <section role="alert">
      <h3>Library fallback</h3>
      <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
      <button type="button" onClick={resetErrorBoundary}>
        Reset boundary
      </button>
    </section>
  );
};

/**
 * Demonstrates a basic react-error-boundary instance.
 *
 * The ErrorBoundary component catches rendering errors from its descendants
 * and renders the supplied fallback instead.
 */
export const BasicLibraryBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Basic library boundary</h2>

      <ErrorBoundary fallbackRender={LibraryFallback}>
        <FailingComponent label="Library-protected feature" shouldThrow={true} />
      </ErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates the explicit fallbackRender API.
 *
 * The fallbackRender function receives the same FallbackProps used by a
 * fallback component and can construct fallback UI directly.
 */
export const FallbackRenderExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Fallback render</h2>

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }: FallbackProps): ReactElement => (
          <section role="alert">
            <h3>Rendered fallback</h3>
            <p>{error instanceof Error ? error.message : "Rendering failed."}</p>
            <button type="button" onClick={resetErrorBoundary}>
              Retry
            </button>
          </section>
        )}
      >
        <FailingComponent label="Fallback-render feature" shouldThrow={true} />
      </ErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates successful rendering through the library boundary.
 *
 * Error boundaries do not alter a descendant's normal rendering behavior when
 * no error is thrown.
 */
export const SuccessfulLibraryBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Successful rendering</h2>

      <ErrorBoundary fallbackRender={LibraryFallback}>
        <FailingComponent label="Healthy feature" shouldThrow={false} />
      </ErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates recovery through resetErrorBoundary.
 *
 * The feature's failure condition is controlled outside the boundary. Once
 * the condition is repaired, resetErrorBoundary causes the boundary to retry
 * rendering its descendants.
 */
export const LibraryRecoveryExample: FC = (): ReactElement => {
  const [shouldThrow, setShouldThrow] = React.useState<boolean>(true);

  const handleRepair = (): void => {
    setShouldThrow(false);
  };

  return (
    <section>
      <h2>Library recovery</h2>

      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }: FallbackProps): ReactElement => (
          <section role="alert">
            <h3>Recoverable feature failed</h3>
            <p>Repair the feature condition before resetting the boundary.</p>
            <button
              type="button"
              onClick={(): void => {
                handleRepair();
                resetErrorBoundary();
              }}
            >
              Repair and retry
            </button>
          </section>
        )}
      >
        <FailingComponent label="Recoverable library feature" shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates resetKeys.
 *
 * Changing one of the reset keys tells react-error-boundary that the logical
 * context has changed and allows the boundary to reset its error state.
 */
export const ResetKeysExample: FC = (): ReactElement => {
  const [resourceId, setResourceId] = React.useState<string>("resource-a");

  return (
    <section>
      <h2>Reset keys</h2>

      <p>Current resource: {resourceId}</p>

      <ErrorBoundary FallbackComponent={LibraryFallback} resetKeys={[resourceId]}>
        <FailingComponent label={`Resource ${resourceId}`} shouldThrow={resourceId === "resource-a"} />
      </ErrorBoundary>

      <button
        type="button"
        onClick={(): void => {
          setResourceId("resource-b");
        }}
      >
        Load resource B
      </button>
    </section>
  );
};

/**
 * Demonstrates the onReset callback.
 *
 * onReset provides a place to coordinate application state with the boundary's
 * reset operation. It can be used to clear or update state that should change
 * before the failed subtree is rendered again.
 */
export const OnResetExample: FC = (): ReactElement => {
  const [resourceId, setResourceId] = React.useState<string>("invalid");

  const handleReset = (): void => {
    setResourceId("valid");
  };

  return (
    <section>
      <h2>onReset</h2>

      <p>Resource: {resourceId}</p>

      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }: FallbackProps): ReactElement => (
          <section role="alert">
            <h3>Resource failed</h3>
            <button type="button" onClick={resetErrorBoundary}>
              Reset resource
            </button>
          </section>
        )}
        onReset={handleReset}
      >
        <FailingComponent label="Resettable resource" shouldThrow={resourceId === "invalid"} />
      </ErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates multiple independent error boundaries.
 *
 * Each ErrorBoundary owns only its descendant subtree. A failure in one
 * boundary therefore does not replace a sibling subtree protected by another
 * boundary.
 */
export const IndependentLibraryBoundariesExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Independent boundaries</h2>

      <ErrorBoundary FallbackComponent={LibraryFallback}>
        <FailingComponent label="Failed feature" shouldThrow={true} />
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={LibraryFallback}>
        <FailingComponent label="Independent healthy feature" shouldThrow={false} />
      </ErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates a common misconception about reusable error-boundary
 * libraries.
 *
 * A library does not change which React errors can be caught. Rendering,
 * lifecycle, and related descendant failures remain subject to the same
 * React error-boundary rules.
 */
export const LibraryScopeExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Library scope</h2>

      <ul>
        <li>react-error-boundary provides a reusable error-boundary abstraction.</li>
        <li>It still relies on React's error-boundary mechanism for descendant rendering failures.</li>
        <li>Event-handler and asynchronous errors require their own handling strategies.</li>
        <li>A library does not automatically make every application error recoverable.</li>
      </ul>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReactErrorBoundaryDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>React Error Boundary</h1>

      <section>
        <h2>1. Native React error boundary</h2>
        <NativeReactErrorBoundary>
          <FailingComponent label="Native React feature" shouldThrow={true} />
        </NativeReactErrorBoundary>
      </section>

      <section>
        <h2>2. Basic react-error-boundary</h2>
        <BasicLibraryBoundaryExample />
      </section>

      <section>
        <h2>3. Custom fallback rendering</h2>
        <FallbackRenderExample />
      </section>

      <section>
        <h2>4. Successful rendering</h2>
        <SuccessfulLibraryBoundaryExample />
      </section>

      <section>
        <h2>5. Recovery with resetErrorBoundary</h2>
        <LibraryRecoveryExample />
      </section>

      <section>
        <h2>6. Resetting with resetKeys</h2>
        <ResetKeysExample />
      </section>

      <section>
        <h2>7. Coordinating recovery with onReset</h2>
        <OnResetExample />
      </section>

      <section>
        <h2>8. Independent error-boundary scopes</h2>
        <IndependentLibraryBoundariesExample />
      </section>

      <section>
        <h2>9. Error-boundary library scope</h2>
        <LibraryScopeExample />
      </section>
    </main>
  );
};

export default ReactErrorBoundaryDemo;

// ---------------------------------------------------------------------
// Summary
// React's native error-boundary mechanism is implemented through class lifecycle methods such as getDerivedStateFromError and componentDidCatch.
// react-error-boundary provides a reusable functional API around React's error-boundary behavior.
// Fallback components receive the thrown error and a resetErrorBoundary function.
// fallbackRender provides an inline way to construct fallback UI from FallbackProps.
// resetErrorBoundary resets the library boundary so its descendants can be rendered again.
// resetKeys can reset the boundary when a logical resource or application context changes.
// onReset provides a callback for coordinating application state with a boundary reset.
// Multiple ErrorBoundary instances can isolate independent feature subtrees.
// A reusable error-boundary library does not change React's fundamental error-boundary limitations.
// ---------------------------------------------------------------------
