/**
 * Error Boundary Recovery
 * ========================
 *
 * Error boundaries can replace failed subtrees with fallback UI, but recovery
 * requires the failed subtree to be rendered again in a state where the error
 * no longer occurs. A boundary can therefore expose a recovery action that
 * resets its error state, while the surrounding application remains mounted.
 *
 * Resetting the boundary state alone does not repair the underlying failure.
 * Recovery is successful only when the next render no longer throws, which
 * commonly requires changing the failing input, remounting the subtree, or
 * otherwise resetting the state responsible for the failure.
 */

import { Component, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RecoveryBoundaryProps {
  readonly children: ReactNode;
  readonly fallbackTitle?: string;
}

export interface RecoveryBoundaryState {
  readonly hasError: boolean;
}

export interface RecoverableFeatureProps {
  readonly shouldThrow: boolean;
  readonly label: string;
}

export interface RecoveryControlsProps {
  readonly onRetry: () => void;
}

export interface ResettableBoundaryProps {
  readonly children: ReactNode;
  readonly resetKey: string | number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A reusable error boundary that exposes a retry action through its fallback.
 *
 * Calling retry resets the boundary's error state. React then attempts to
 * render the children again. The retry succeeds only if the children can now
 * render without throwing another error.
 */
export class RecoveryErrorBoundary extends Component<RecoveryBoundaryProps, RecoveryBoundaryState> {
  public readonly state: RecoveryBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_error: Error): RecoveryBoundaryState {
    return {
      hasError: true,
    };
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h3>{this.props.fallbackTitle ?? "Something went wrong"}</h3>
          <p>The failed component could not be rendered.</p>
          <button type="button" onClick={this.handleRetry}>
            Try again
          </button>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }

  private readonly handleRetry = (): void => {
    this.setState({
      hasError: false,
    });
  };
}

/**
 * A feature whose rendering can be controlled by its parent.
 *
 * This allows the retry example to change the condition that caused the
 * original render failure before the boundary attempts another render.
 */
export const RecoverableFeature: FC<RecoverableFeatureProps> = ({ shouldThrow, label }): ReactElement => {
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
 * Provides a simple external retry control.
 *
 * Keeping the recovery action outside the boundary demonstrates that recovery
 * can also be coordinated by a parent component rather than only by fallback
 * UI rendered inside the boundary.
 */
export const RecoveryControls: FC<RecoveryControlsProps> = ({ onRetry }): ReactElement => {
  return (
    <button type="button" onClick={onRetry}>
      Reset feature
    </button>
  );
};

/**
 * Demonstrates a recovery action that resets only the boundary state.
 *
 * The child continues to throw, so resetting the boundary immediately causes
 * the fallback to appear again. This is not successful recovery; it shows why
 * the underlying failure condition must also be addressed.
 */
export const RetryWithoutFixingErrorExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Retry without fixing the error</h2>

      <RecoveryErrorBoundary fallbackTitle="Feature failed">
        <RecoverableFeature label="Persistent failure" shouldThrow={true} />
      </RecoveryErrorBoundary>

      <p>Resetting the boundary does not help when the child throws again on the next render.</p>
    </section>
  );
};

/**
 * Demonstrates successful recovery by changing the condition that caused the
 * failure before retrying.
 *
 * The parent owns the failing condition, while the boundary owns the
 * temporary error state. Once the parent changes the condition, resetting the
 * boundary allows the feature to render successfully.
 */
export const SuccessfulRetryExample: FC = (): ReactElement => {
  const [shouldThrow, setShouldThrow] = React.useState<boolean>(true);

  return (
    <section>
      <h2>Successful retry</h2>

      <RecoveryErrorBoundary fallbackTitle="Feature unavailable">
        <RecoverableFeature label="Recoverable feature" shouldThrow={shouldThrow} />
      </RecoveryErrorBoundary>

      <button
        type="button"
        onClick={(): void => {
          setShouldThrow(false);
        }}
      >
        Repair feature
      </button>
    </section>
  );
};

/**
 * Demonstrates a parent-controlled recovery sequence.
 *
 * The parent first changes the failing condition and then the boundary can
 * render the repaired subtree. React does not automatically infer how the
 * application should repair the cause of a rendering error.
 */
export const ParentControlledRecoveryExample: FC = (): ReactElement => {
  const [shouldThrow, setShouldThrow] = React.useState<boolean>(true);
  const [attempt, setAttempt] = React.useState<number>(0);

  const handleRecovery = (): void => {
    setShouldThrow(false);
    setAttempt((previousAttempt: number): number => previousAttempt + 1);
  };

  return (
    <section>
      <h2>Parent-controlled recovery</h2>

      <p>Recovery attempts: {attempt}</p>

      <RecoveryErrorBoundary fallbackTitle="Dashboard unavailable">
        <RecoverableFeature label="Dashboard" shouldThrow={shouldThrow} />
      </RecoveryErrorBoundary>

      <RecoveryControls onRetry={handleRecovery} />
    </section>
  );
};

/**
 * Demonstrates resetting an error boundary when a logical resource changes.
 *
 * A changing reset key causes the boundary instance to be remounted. This is
 * useful when a new route, record, or feature identity should receive a fresh
 * error-boundary state.
 */
export const ResetKeyRecoveryExample: FC = (): ReactElement => {
  const [resourceId, setResourceId] = React.useState<string>("resource-a");

  return (
    <section>
      <h2>Resetting with a changing key</h2>

      <p>Current resource: {resourceId}</p>

      <ResettableErrorBoundary resetKey={resourceId}>
        <RecoverableFeature label={`Resource ${resourceId}`} shouldThrow={resourceId === "resource-a"} />
      </ResettableErrorBoundary>

      <button
        type="button"
        onClick={(): void => {
          setResourceId("resource-b");
        }}
      >
        Load another resource
      </button>
    </section>
  );
};

/**
 * Remounts the boundary when resetKey changes.
 *
 * Changing the key creates a new boundary instance, which starts with its
 * initial state rather than retaining the previous error state.
 */
export class ResettableErrorBoundary extends Component<ResettableBoundaryProps> {
  public render(): ReactElement {
    return <RecoveryErrorBoundary key={this.props.resetKey}>{this.props.children}</RecoveryErrorBoundary>;
  }
}

/**
 * Demonstrates recovery by changing the input responsible for a rendering
 * failure.
 *
 * The important recovery step is not the boundary reset itself. The important
 * step is changing the condition so that the subsequent render can succeed.
 */
export const InputDrivenRecoveryExample: FC = (): ReactElement => {
  const [value, setValue] = React.useState<string>("invalid");

  return (
    <section>
      <h2>Input-driven recovery</h2>

      <RecoveryErrorBoundary fallbackTitle="Invalid configuration">
        <RecoverableFeature label={`Configuration: ${value}`} shouldThrow={value === "invalid"} />
      </RecoveryErrorBoundary>

      <button
        type="button"
        onClick={(): void => {
          setValue("valid");
        }}
      >
        Use valid configuration
      </button>
    </section>
  );
};

/**
 * Demonstrates that an error boundary remains mounted while its descendant is
 * replaced by fallback UI.
 *
 * The boundary can later render its children again when its state is reset.
 * This is different from permanently unmounting the entire application.
 */
export const BoundaryLifecycleRecoveryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Boundary fallback and recovery lifecycle</h2>

      <p>The boundary switches between its child subtree and fallback UI according to its error state.</p>

      <RecoveryErrorBoundary fallbackTitle="Temporary feature failure">
        <RecoverableFeature label="Lifecycle demonstration" shouldThrow={false} />
      </RecoveryErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates a common misconception about retrying.
 *
 * An error boundary cannot determine the correct repair operation for an
 * arbitrary application failure. Recovery logic belongs to the application
 * state or resource that caused the failure.
 */
export const RecoveryResponsibilityExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Recovery responsibility</h2>

      <ul>
        <li>The boundary detects the rendering failure and displays fallback UI.</li>
        <li>Application state or resource state determines whether the underlying problem has been repaired.</li>
        <li>A retry can reset the boundary after the failure condition has changed.</li>
        <li>Resetting the boundary alone cannot guarantee recovery.</li>
      </ul>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ErrorBoundaryRecoveryDemo: FC = (): ReactElement => {
  const [successfulRetryError, setSuccessfulRetryError] = React.useState<boolean>(true);

  const handleRepairAndRetry = (): void => {
    setSuccessfulRetryError(false);
  };

  return (
    <main>
      <h1>Error Boundary Recovery</h1>

      <section>
        <h2>1. Retry without fixing the underlying error</h2>
        <RetryWithoutFixingErrorExample />
      </section>

      <section>
        <h2>2. Successful retry after repairing the failure</h2>

        <RecoveryErrorBoundary fallbackTitle="Feature unavailable">
          <RecoverableFeature label="Retryable feature" shouldThrow={successfulRetryError} />
          {!successfulRetryError && <p>The feature recovered successfully.</p>}
        </RecoveryErrorBoundary>

        {successfulRetryError && (
          <button type="button" onClick={handleRepairAndRetry}>
            Repair and retry
          </button>
        )}
      </section>

      <section>
        <h2>3. Parent-controlled recovery</h2>
        <ParentControlledRecoveryExample />
      </section>

      <section>
        <h2>4. Recovery using a changing reset key</h2>
        <ResetKeyRecoveryExample />
      </section>

      <section>
        <h2>5. Recovery by changing the failing input</h2>
        <InputDrivenRecoveryExample />
      </section>

      <section>
        <h2>6. Boundary fallback and recovery lifecycle</h2>
        <BoundaryLifecycleRecoveryExample />
      </section>

      <section>
        <h2>7. Recovery responsibility</h2>
        <RecoveryResponsibilityExample />
      </section>
    </main>
  );
};

export default ErrorBoundaryRecoveryDemo;

// ---------------------------------------------------------------------
// Summary
// An error boundary can recover by resetting its error state and rendering its descendants again.
// Resetting the boundary does not repair the underlying failure by itself.
// Successful recovery requires the next render to complete without throwing another error.
// Parent state can repair the failure condition before the boundary is reset or remounted.
// A changing key can remount a boundary and provide a fresh error-boundary state for a new resource.
// Recovery logic belongs to the application state or resource responsible for the failure.
// Retry controls should therefore be designed around a concrete recovery operation rather than a blind state reset.
// ---------------------------------------------------------------------
