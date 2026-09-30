/**
 * Error Boundary Placement
 * =========================
 *
 * The placement of an error boundary determines which part of the React tree
 * is isolated when a descendant throws an error. A boundary can protect an
 * entire application, a page, a feature, or a small component subtree.
 *
 * There is no single placement that is appropriate for every application.
 * Boundaries should be placed according to the desired failure and recovery
 * scope so that an isolated failure does not unnecessarily replace unrelated
 * interface regions.
 */

import { Component, type ErrorInfo, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PlacementBoundaryProps {
  readonly children: ReactNode;
}

export interface PlacementBoundaryState {
  readonly hasError: boolean;
}

export interface ThrowingFeatureProps {
  readonly shouldThrow: boolean;
  readonly name: string;
}

export interface FeatureSectionProps {
  readonly title: string;
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A reusable error boundary used throughout the placement examples.
 *
 * The boundary owns the failure state for its entire descendant subtree. The
 * larger the protected subtree, the larger the portion of the interface that
 * will be replaced by this fallback when an error occurs.
 */
export class PlacementErrorBoundary extends Component<PlacementBoundaryProps, PlacementBoundaryState> {
  public readonly state: PlacementBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_error: Error): PlacementBoundaryState {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Placement boundary caught:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  public render(): ReactElement {
    if (this.state.hasError) {
      return (
        <section role="alert">
          <h3>This section is unavailable</h3>
          <p>An error occurred inside the protected component subtree.</p>
        </section>
      );
    }

    return <>{this.props.children}</>;
  }
}

/**
 * A feature that can intentionally fail during rendering.
 *
 * The feature is used to make the scope of different boundary placements
 * visible in the examples.
 */
export const ThrowingFeature: FC<ThrowingFeatureProps> = ({ shouldThrow, name }): ReactElement => {
  if (shouldThrow) {
    throw new Error(`${name} failed during rendering.`);
  }

  return (
    <article>
      <h3>{name}</h3>
      <p>{name} rendered successfully.</p>
    </article>
  );
};

/**
 * Represents an independent application feature.
 *
 * Keeping unrelated features as separate siblings makes it possible for
 * feature-level boundaries to isolate failures without replacing the entire
 * application interface.
 */
export const FeatureSection: FC<FeatureSectionProps> = ({ title, children }): ReactElement => {
  return (
    <section>
      <h3>{title}</h3>
      {children}
    </section>
  );
};

/**
 * Demonstrates an application-level boundary.
 *
 * A boundary near the application root can provide a final fallback when a
 * descendant failure is not isolated by a more specific boundary lower in the
 * tree. Its large scope also means that its fallback can replace a substantial
 * portion of the application.
 */
export const ApplicationLevelPlacementExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Application-level boundary</h2>

      <PlacementErrorBoundary>
        <header>
          <h3>Application shell</h3>
          <p>Navigation and global interface content.</p>
        </header>

        <main>
          <ThrowingFeature name="Application feature" shouldThrow={true} />
        </main>
      </PlacementErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates a page-level boundary.
 *
 * A page boundary protects the page while allowing application-level content
 * outside that page subtree to remain independently rendered.
 */
export const PageLevelPlacementExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Page-level boundary</h2>

      <header>
        <h3>Application navigation</h3>
        <p>This content is outside the page boundary.</p>
      </header>

      <PlacementErrorBoundary>
        <main>
          <h3>Settings page</h3>
          <ThrowingFeature name="Settings panel" shouldThrow={true} />
        </main>
      </PlacementErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates feature-level boundaries.
 *
 * Each feature receives its own boundary, so an error in one feature does not
 * replace an unrelated feature rendered beside it.
 */
export const FeatureLevelPlacementExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Feature-level boundaries</h2>

      <PlacementErrorBoundary>
        <FeatureSection title="Profile">
          <ThrowingFeature name="Profile feature" shouldThrow={true} />
        </FeatureSection>
      </PlacementErrorBoundary>

      <PlacementErrorBoundary>
        <FeatureSection title="Notifications">
          <ThrowingFeature name="Notifications feature" shouldThrow={false} />
        </FeatureSection>
      </PlacementErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates a small component-level boundary.
 *
 * A narrow boundary is useful when a single widget can fail independently
 * from the larger feature that contains it.
 */
export const ComponentLevelPlacementExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Component-level boundary</h2>

      <article>
        <h3>Dashboard</h3>

        <p>The surrounding dashboard remains outside the boundary.</p>

        <PlacementErrorBoundary>
          <ThrowingFeature name="Analytics widget" shouldThrow={true} />
        </PlacementErrorBoundary>
      </article>
    </section>
  );
};

/**
 * Demonstrates multiple boundaries at different levels.
 *
 * The inner boundary provides a more specific isolation scope. If the inner
 * boundary itself cannot handle a failure, an ancestor boundary can provide a
 * broader fallback scope.
 */
export const NestedPlacementExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Nested boundaries</h2>

      <PlacementErrorBoundary>
        <article>
          <h3>Page boundary</h3>

          <PlacementErrorBoundary>
            <ThrowingFeature name="Nested feature" shouldThrow={true} />
          </PlacementErrorBoundary>
        </article>
      </PlacementErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates placing a boundary around a group of related components.
 *
 * The boundary should surround the smallest meaningful unit whose failure
 * should produce the same recovery experience.
 */
export const RelatedComponentsPlacementExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Related component group</h2>

      <PlacementErrorBoundary>
        <article>
          <h3>Checkout summary</h3>

          <div>
            <p>Cart summary</p>
            <p>Shipping summary</p>
            <ThrowingFeature name="Payment summary" shouldThrow={true} />
          </div>
        </article>
      </PlacementErrorBoundary>
    </section>
  );
};

/**
 * Demonstrates intentionally leaving independent interface regions outside a
 * boundary.
 *
 * Content that should remain available during a feature failure should not be
 * placed inside that feature's failure boundary merely for convenience.
 */
export const IndependentRegionsExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Independent interface regions</h2>

      <header>
        <h3>Navigation</h3>
        <p>Navigation remains outside the feature boundary.</p>
      </header>

      <PlacementErrorBoundary>
        <ThrowingFeature name="Main content" shouldThrow={true} />
      </PlacementErrorBoundary>

      <footer>
        <h3>Footer</h3>
        <p>Footer remains outside the failed subtree.</p>
      </footer>
    </section>
  );
};

/**
 * Demonstrates a common placement misconception.
 *
 * A boundary does not need to wrap every individual component. Excessively
 * narrow boundaries can create repetitive fallback UI, while excessively
 * broad boundaries can replace more interface than intended.
 */
export const PlacementGranularityExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Choosing placement granularity</h2>

      <ul>
        <li>Broad boundaries can provide application or page-level recovery.</li>
        <li>Feature boundaries can isolate independently meaningful interface regions.</li>
        <li>Narrow boundaries can protect particularly failure-prone widgets.</li>
        <li>Multiple boundaries can provide layered failure scopes.</li>
      </ul>
    </section>
  );
};

/**
 * Demonstrates a root-level fallback as a final protection layer.
 *
 * The root-level boundary can coexist with narrower boundaries. Lower
 * boundaries handle failures within their own scopes, while the root boundary
 * provides broader protection for failures that propagate beyond them.
 */
export const RootFallbackPlacementExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Root fallback as a final layer</h2>

      <PlacementErrorBoundary>
        <article>
          <h3>Application root protection</h3>

          <PlacementErrorBoundary>
            <ThrowingFeature name="Protected feature" shouldThrow={false} />
          </PlacementErrorBoundary>

          <p>A higher-level boundary can provide a final fallback for failures not isolated by lower boundaries.</p>
        </article>
      </PlacementErrorBoundary>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ErrorBoundaryPlacementDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Error Boundary Placement</h1>

      <ApplicationLevelPlacementExample />

      <PageLevelPlacementExample />

      <FeatureLevelPlacementExample />

      <ComponentLevelPlacementExample />

      <NestedPlacementExample />

      <RelatedComponentsPlacementExample />

      <IndependentRegionsExample />

      <PlacementGranularityExample />

      <RootFallbackPlacementExample />
    </main>
  );
};

export default ErrorBoundaryPlacementDemo;

// ---------------------------------------------------------------------
// Summary
// Error boundary placement determines the portion of the React tree that receives the fallback UI.
// Application-level boundaries provide broad protection and can replace a large part of the interface.
// Page-level boundaries isolate a page while allowing surrounding application content to remain available.
// Feature-level boundaries isolate independently meaningful interface regions.
// Component-level boundaries can protect individual widgets that should fail independently.
// Nested boundaries provide multiple failure scopes, with more specific boundaries lower in the tree.
// Independent interface regions should remain outside a boundary when they should survive a neighboring feature failure.
// Boundary placement should reflect the desired failure and recovery scope rather than wrapping every component indiscriminately.
// A broad boundary can serve as a final fallback layer alongside narrower boundaries.
// ---------------------------------------------------------------------
