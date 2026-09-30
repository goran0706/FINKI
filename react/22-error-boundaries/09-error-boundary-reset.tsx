/**
 * Error Boundary Reset
 * ====================
 *
 * Resetting an error boundary means returning the boundary from its error state
 * to its normal rendering state so that its descendants can be rendered again.
 * A reset can be triggered explicitly, by a changing identity such as a key,
 * or by application state that changes the conditions responsible for failure.
 *
 * Resetting the boundary is different from repairing the failure. The reset
 * only controls the boundary's error state; the next render must also be able
 * to complete successfully for recovery to occur.
 */

import { Component, type FC, type ReactElement, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ResetBoundaryProps {
  readonly children: ReactNode;
  readonly fallbackTitle?: string;
}

export interface ResetBoundaryState {
  readonly hasError: boolean;
}

export interface ResettableFeatureProps {
  readonly shouldThrow: boolean;
  readonly label: string;
}

export interface ResetKeyBoundaryProps {
  readonly children: ReactNode;
  readonly resetKey: string | number;
}

export interface ResettableFallbackProps {
  readonly onReset: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A reusable error boundary with an explicit reset method.
 *
 * The reset method clears the boundary's error state. React then attempts to
 * render the same descendants again, which means the underlying failure must
 * no longer occur for the reset to produce a successful recovery.
 */
export class ResettableErrorBoundary extends Component<ResetBoundaryProps, ResetBoundaryState> {
  public readonly state: ResetBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_error: Error): ResetBoundaryState {
    return {
      hasError: true,
    };
  }

  public reset = (): void => {
    this.setState({
      hasError: false,
    });
  };

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h3>{this.props.fallbackTitle ?? "Something went wrong"}</h3>
          <p>The component subtree could not be rendered.</p>
          <button type="button" onClick={this.reset}>
            Reset boundary
          </button>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * A feature whose render path can intentionally fail.
 *
 * The feature is controlled by external state so that the examples can show
 * the difference between resetting a boundary and actually repairing the
 * condition that caused the error.
 */
export const ResettableFeature: FC<ResettableFeatureProps> = ({ shouldThrow, label }): ReactElement => {
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
 * Demonstrates a reset that does not repair the underlying error.
 *
 * The boundary returns to its normal rendering state, but the child still
 * throws immediately. The fallback therefore appears again.
 */
export const ResetWithoutRepairExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Reset without repairing the failure</h2>

      <ResettableErrorBoundary fallbackTitle="Persistent failure">
        <ResettableFeature label="Persistent feature" shouldThrow={true} />
      </ResettableErrorBoundary>

      <p>A reset alone cannot recover a subtree that throws on every render.</p>
    </section>
  );
};

/**
 * Demonstrates a successful explicit reset.
 *
 * The parent repairs the failing condition first. Resetting the boundary then
 * allows the repaired subtree to render successfully.
 */
export const ExplicitResetExample: FC = (): ReactElement => {
  const [shouldThrow, setShouldThrow] = useState<boolean>(true);
  const [resetCount, setResetCount] = useState<number>(0);

  const handleRepairAndReset = (): void => {
    setShouldThrow(false);
    setResetCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h2>Explicit reset after repair</h2>

      <p>Reset count: {resetCount}</p>

      <ResettableErrorBoundary fallbackTitle="Feature unavailable">
        <ResettableFeature label="Explicitly reset feature" shouldThrow={shouldThrow} />
      </ResettableErrorBoundary>

      {shouldThrow && (
        <button type="button" onClick={handleRepairAndReset}>
          Repair and reset
        </button>
      )}
    </section>
  );
};

/**
 * Demonstrates using a changing key to reset a boundary.
 *
 * Changing the key causes React to treat the boundary as a new component
 * instance. Its initial state is therefore restored, including
 * hasError: false.
 */
export const KeyResetBoundary: FC<ResetKeyBoundaryProps> = ({ children, resetKey }): ReactElement => {
  return <ResettableErrorBoundary key={resetKey}>{children}</ResettableErrorBoundary>;
};

/**
 * Demonstrates key-based resetting when the logical resource changes.
 *
 * A new resource identity can naturally create a new boundary instance and
 * clear the previous resource's error state.
 */
export const ResourceResetExample: FC = (): ReactElement => {
  const [resourceId, setResourceId] = useState<string>("resource-a");

  return (
    <section>
      <h2>Reset by changing resource identity</h2>

      <p>Current resource: {resourceId}</p>

      <KeyResetBoundary resetKey={resourceId}>
        <ResettableFeature label={`Resource ${resourceId}`} shouldThrow={resourceId === "resource-a"} />
      </KeyResetBoundary>

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
 * Demonstrates a boundary whose reset is associated with a changing
 * application condition.
 *
 * The important distinction is that the application changes the condition
 * first, while the boundary reset clears the boundary's own error state.
 */
export const ApplicationStateResetExample: FC = (): ReactElement => {
  const [configuration, setConfiguration] = useState<string>("invalid");

  return (
    <section>
      <h2>Reset from application state</h2>

      <p>Configuration: {configuration}</p>

      <KeyResetBoundary resetKey={configuration}>
        <ResettableFeature label="Configuration feature" shouldThrow={configuration === "invalid"} />
      </KeyResetBoundary>

      <button
        type="button"
        onClick={(): void => {
          setConfiguration("valid");
        }}
      >
        Use valid configuration
      </button>
    </section>
  );
};

/**
 * Demonstrates a reset boundary that can be recreated for each logical
 * navigation target.
 *
 * The boundary identity follows the selected page, preventing an error state
 * from one page from automatically becoming the initial state of another.
 */
export const PageIdentityResetExample: FC = (): ReactElement => {
  const [page, setPage] = useState<string>("dashboard");

  const shouldThrow: boolean = page === "dashboard";

  return (
    <section>
      <h2>Reset by page identity</h2>

      <p>Current page: {page}</p>

      <KeyResetBoundary resetKey={page}>
        <ResettableFeature label={`${page} page`} shouldThrow={shouldThrow} />
      </KeyResetBoundary>

      <button
        type="button"
        onClick={(): void => {
          setPage("settings");
        }}
      >
        Open settings
      </button>
    </section>
  );
};

/**
 * Demonstrates that changing a reset key remounts the boundary instance.
 *
 * A key reset is broader than simply clearing hasError because the boundary
 * itself is recreated. This makes key changes useful when a fresh boundary
 * instance should represent a new logical resource.
 */
export const BoundaryRemountExample: FC = (): ReactElement => {
  const [version, setVersion] = useState<number>(1);

  return (
    <section>
      <h2>Boundary remount</h2>

      <p>Boundary version: {version}</p>

      <KeyResetBoundary resetKey={version}>
        <ResettableFeature label={`Feature version ${version}`} shouldThrow={false} />
      </KeyResetBoundary>

      <button
        type="button"
        onClick={(): void => {
          setVersion((previousVersion: number): number => previousVersion + 1);
        }}
      >
        Create new boundary instance
      </button>
    </section>
  );
};

/**
 * Demonstrates a common reset misconception.
 *
 * A changing key does not magically repair arbitrary application failures.
 * It creates a new component instance. If the new instance renders the same
 * failing subtree under the same conditions, the error can occur again.
 */
export const ResetMisconceptionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Reset misconception</h2>

      <ul>
        <li>Clearing an error boundary's state is not the same as fixing the failed component.</li>
        <li>Changing a key recreates the boundary but does not alter external data by itself.</li>
        <li>Successful recovery requires a subsequent render that does not throw the same error.</li>
      </ul>
    </section>
  );
};

/**
 * Demonstrates a fallback action whose responsibility is explicitly defined
 * by the parent.
 *
 * The fallback action can coordinate application state changes and then
 * trigger a new boundary identity through the parent's reset key.
 */
export const ParentCoordinatedResetExample: FC = (): ReactElement => {
  const [resetKey, setResetKey] = useState<number>(0);
  const [shouldThrow, setShouldThrow] = useState<boolean>(true);

  const handleReset = (): void => {
    setShouldThrow(false);
    setResetKey((previousKey: number): number => previousKey + 1);
  };

  return (
    <section>
      <h2>Parent-coordinated reset</h2>

      <KeyResetBoundary resetKey={resetKey}>
        <ResettableFeature label="Parent-coordinated feature" shouldThrow={shouldThrow} />
      </KeyResetBoundary>

      {shouldThrow && (
        <button type="button" onClick={handleReset}>
          Repair and recreate boundary
        </button>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ErrorBoundaryResetDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Error Boundary Reset</h1>

      <section>
        <h2>1. Reset without repairing the failure</h2>
        <ResetWithoutRepairExample />
      </section>

      <section>
        <h2>2. Explicit reset after repairing the failure</h2>
        <ExplicitResetExample />
      </section>

      <section>
        <h2>3. Reset by changing resource identity</h2>
        <ResourceResetExample />
      </section>

      <section>
        <h2>4. Reset from application state</h2>
        <ApplicationStateResetExample />
      </section>

      <section>
        <h2>5. Reset by page identity</h2>
        <PageIdentityResetExample />
      </section>

      <section>
        <h2>6. Boundary remount</h2>
        <BoundaryRemountExample />
      </section>

      <section>
        <h2>7. Reset misconception</h2>
        <ResetMisconceptionExample />
      </section>

      <section>
        <h2>8. Parent-coordinated reset</h2>
        <ParentCoordinatedResetExample />
      </section>
    </main>
  );
};

export default ErrorBoundaryResetDemo;

// ---------------------------------------------------------------------
// Summary
// Resetting an error boundary clears its internal error state and causes its descendants to render again.
// An explicit reset can be implemented by changing the boundary state from hasError: true to false.
// A changing key resets a boundary by causing React to create a new boundary instance.
// Resource, page, or application identity can be used as a reset key when a new logical context should start fresh.
// Resetting a boundary does not repair the underlying failure condition.
// A successful reset requires the subsequent render to complete without throwing the same error.
// Parent components can coordinate application-state changes with boundary resets.
// A key-based reset is a remount, not merely a state update on the existing boundary instance.
// ---------------------------------------------------------------------
