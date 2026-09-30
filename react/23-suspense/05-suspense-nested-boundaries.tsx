/**
 * Nested Suspense Boundaries
 * ==========================
 *
 * Suspense boundaries can be nested so different regions of an interface can
 * reveal at different times. An outer boundary can provide a broader loading
 * state, while an inner boundary can provide a more specific fallback for a
 * smaller subtree.
 *
 * Nested boundaries are useful when an interface has a meaningful hierarchy of
 * loading states. The placement of each boundary determines which suspended
 * subtree it is responsible for and which fallback is displayed while that
 * subtree is unavailable.
 */

import { type FC, type ReactElement, Suspense, use } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SuspendedSectionProps {
  readonly title: string;
  readonly message: string;
  readonly promise: Promise<string>;
}

export interface LoadingFallbackProps {
  readonly label: string;
}

export interface NestedSectionProps {
  readonly children: ReactElement;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates a Promise that resolves after a delay.
 *
 * These resources are created at module scope so React can read the same
 * Promise when rendering retries after suspension.
 */
const createDelayedResource = (message: string, delay: number): Promise<string> => {
  return new Promise<string>((resolve): void => {
    window.setTimeout((): void => {
      resolve(message);
    }, delay);
  });
};

const profilePromise: Promise<string> = createDelayedResource("The profile information is ready.", 800);

const activityPromise: Promise<string> = createDelayedResource("The activity information is ready.", 1800);

const recommendationsPromise: Promise<string> = createDelayedResource("The recommendations are ready.", 2800);

const analyticsPromise: Promise<string> = createDelayedResource("The analytics data is ready.", 3800);

/**
 * Displays a reusable fallback for a Suspense boundary.
 */
export const LoadingFallback: FC<LoadingFallbackProps> = ({ label }): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      <p>{label}</p>
    </div>
  );
};

/**
 * Reads one asynchronous resource with `use()`.
 *
 * While the Promise is pending, this component suspends and the nearest
 * applicable Suspense boundary renders its fallback.
 */
export const SuspendedSection: FC<SuspendedSectionProps> = ({ title, message, promise }): ReactElement => {
  const resolvedMessage: string = use(promise);

  return (
    <article>
      <h3>{title}</h3>
      <p>{resolvedMessage}</p>
      <p>{message}</p>
    </article>
  );
};

/**
 * Demonstrates a single outer boundary containing multiple regions.
 *
 * Because there is only one boundary, all suspended content belongs to the
 * same loading region. The boundary therefore provides one fallback for the
 * entire subtree.
 */
export const SingleBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Single boundary</h3>

      <Suspense fallback={<LoadingFallback label="Loading the entire dashboard..." />}>
        <SuspendedSection
          title="Profile"
          message="Profile content belongs to the dashboard."
          promise={profilePromise}
        />

        <SuspendedSection
          title="Activity"
          message="Activity content belongs to the dashboard."
          promise={activityPromise}
        />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates an outer boundary containing an inner boundary.
 *
 * The inner boundary owns the activity subtree, so its fallback can represent
 * that smaller region independently from the outer dashboard boundary.
 */
export const BasicNestedBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Basic nested boundary</h3>

      <Suspense fallback={<LoadingFallback label="Loading dashboard..." />}>
        <SuspendedSection
          title="Profile"
          message="The profile belongs directly to the outer boundary."
          promise={profilePromise}
        />

        <Suspense fallback={<LoadingFallback label="Loading activity panel..." />}>
          <SuspendedSection
            title="Activity"
            message="The activity panel has its own loading state."
            promise={activityPromise}
          />
        </Suspense>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates progressive reveal with several nested boundaries.
 *
 * Each inner boundary can reveal its own region as its resource becomes
 * available instead of waiting for every region in the parent section.
 */
export const ProgressiveRevealExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Progressive reveal</h3>

      <Suspense fallback={<LoadingFallback label="Loading dashboard shell..." />}>
        <article>
          <h4>Dashboard</h4>

          <Suspense fallback={<LoadingFallback label="Loading profile..." />}>
            <SuspendedSection title="Profile" message="This region reveals independently." promise={profilePromise} />
          </Suspense>

          <Suspense fallback={<LoadingFallback label="Loading activity..." />}>
            <SuspendedSection title="Activity" message="This region reveals independently." promise={activityPromise} />
          </Suspense>

          <Suspense fallback={<LoadingFallback label="Loading recommendations..." />}>
            <SuspendedSection
              title="Recommendations"
              message="This region reveals independently."
              promise={recommendationsPromise}
            />
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that the outer boundary can represent the structural shell
 * while an inner boundary represents a specific piece of content.
 */
export const ShellAndContentExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Shell and content</h3>

      <Suspense
        fallback={
          <div role="status" aria-live="polite">
            <h4>Loading dashboard</h4>
            <p>Preparing the dashboard structure...</p>
          </div>
        }
      >
        <article>
          <header>
            <h4>Dashboard</h4>
            <p>The dashboard shell is part of the outer boundary.</p>
          </header>

          <Suspense
            fallback={
              <div role="status" aria-live="polite">
                <p>Loading dashboard analytics...</p>
              </div>
            }
          >
            <SuspendedSection
              title="Analytics"
              message="Analytics is controlled by the inner boundary."
              promise={analyticsPromise}
            />
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates multiple levels of nesting.
 *
 * A boundary can contain another boundary, which can contain another
 * boundary. Each boundary establishes a progressively smaller loading scope.
 */
export const MultipleLevelsExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Multiple levels</h3>

      <Suspense fallback={<LoadingFallback label="Loading application area..." />}>
        <article>
          <h4>Application area</h4>

          <Suspense fallback={<LoadingFallback label="Loading dashboard..." />}>
            <article>
              <h5>Dashboard</h5>

              <Suspense fallback={<LoadingFallback label="Loading analytics..." />}>
                <SuspendedSection
                  title="Analytics"
                  message="Analytics is inside the innermost boundary."
                  promise={analyticsPromise}
                />
              </Suspense>
            </article>
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that an inner boundary can have a more specific fallback than
 * its parent.
 *
 * The inner fallback describes the exact region being loaded, while the outer
 * fallback describes the larger application area.
 */
export const SpecificFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Specific inner fallback</h3>

      <Suspense fallback={<LoadingFallback label="Loading account area..." />}>
        <article>
          <h4>Account</h4>
          <p>Account-level loading is controlled by the outer boundary.</p>

          <Suspense fallback={<LoadingFallback label="Loading recommendations..." />}>
            <SuspendedSection
              title="Recommendations"
              message="The inner fallback describes this specific region."
              promise={recommendationsPromise}
            />
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates independent sibling boundaries inside the same parent.
 *
 * Sibling boundaries are not nested, but they are useful for comparison:
 * each establishes its own fallback scope inside the shared parent subtree.
 */
export const SiblingBoundariesExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Sibling boundaries</h3>

      <article>
        <Suspense fallback={<LoadingFallback label="Loading profile panel..." />}>
          <SuspendedSection title="Profile" message="Profile has an independent boundary." promise={profilePromise} />
        </Suspense>

        <Suspense fallback={<LoadingFallback label="Loading activity panel..." />}>
          <SuspendedSection
            title="Activity"
            message="Activity has an independent boundary."
            promise={activityPromise}
          />
        </Suspense>
      </article>
    </section>
  );
};

/**
 * Demonstrates a common misconception about nested boundaries.
 *
 * Nesting boundaries does not mean the outer boundary must always show its
 * fallback whenever an inner descendant suspends. The inner boundary exists
 * specifically to establish a smaller suspension-handling scope.
 */
export const NestedBoundaryMisconceptionExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Nested boundary misconception</h3>

      <ul>
        <li>The outer boundary does not automatically own every suspension inside a nested boundary.</li>
        <li>The inner boundary can handle suspension within its own subtree.</li>
        <li>
          Boundary placement determines the scope of the fallback rather than the visual nesting of the fallback itself.
        </li>
      </ul>
    </section>
  );
};

/**
 * Demonstrates a practical page composition pattern.
 *
 * The page shell uses an outer boundary, while major content regions use
 * inner boundaries so each region can reveal independently.
 */
export const PageCompositionExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Page composition</h3>

      <Suspense fallback={<LoadingFallback label="Loading page..." />}>
        <header>
          <h4>Account dashboard</h4>
          <p>The page structure is controlled by the outer boundary.</p>
        </header>

        <Suspense fallback={<LoadingFallback label="Loading profile..." />}>
          <SuspendedSection
            title="Profile"
            message="Profile is an independently suspended region."
            promise={profilePromise}
          />
        </Suspense>

        <Suspense fallback={<LoadingFallback label="Loading activity..." />}>
          <SuspendedSection
            title="Activity"
            message="Activity is an independently suspended region."
            promise={activityPromise}
          />
        </Suspense>

        <Suspense fallback={<LoadingFallback label="Loading recommendations..." />}>
          <SuspendedSection
            title="Recommendations"
            message="Recommendations are an independently suspended region."
            promise={recommendationsPromise}
          />
        </Suspense>
      </Suspense>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SuspenseNestedBoundariesDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Nested Suspense Boundaries</h1>

      <section>
        <h2>1. Single boundary</h2>
        <SingleBoundaryExample />
      </section>

      <section>
        <h2>2. Basic nested boundary</h2>
        <BasicNestedBoundaryExample />
      </section>

      <section>
        <h2>3. Progressive reveal</h2>
        <ProgressiveRevealExample />
      </section>

      <section>
        <h2>4. Shell and content</h2>
        <ShellAndContentExample />
      </section>

      <section>
        <h2>5. Multiple levels</h2>
        <MultipleLevelsExample />
      </section>

      <section>
        <h2>6. Specific inner fallback</h2>
        <SpecificFallbackExample />
      </section>

      <section>
        <h2>7. Sibling boundaries</h2>
        <SiblingBoundariesExample />
      </section>

      <section>
        <h2>8. Nested boundary misconception</h2>
        <NestedBoundaryMisconceptionExample />
      </section>

      <section>
        <h2>9. Page composition</h2>
        <PageCompositionExample />
      </section>

      <section>
        <h2>10. Nested boundary hierarchy</h2>
        <MultipleLevelsExample />
      </section>
    </main>
  );
};

export default SuspenseNestedBoundariesDemo;

// ---------------------------------------------------------------------
// Summary
// Nested Suspense boundaries divide a larger interface into progressively smaller loading scopes.
// An outer boundary can provide a broad fallback for a larger region of the interface.
// An inner boundary can provide a more specific fallback for its own suspended subtree.
// Multiple inner boundaries allow separate interface regions to reveal independently.
// Nested boundaries can be combined across several levels when the interface has meaningful hierarchy.
// Sibling boundaries provide independent scopes without requiring one boundary to contain another.
// Boundary placement determines which fallback is responsible for a suspended subtree.
// Nested boundaries are useful for progressive reveal and meaningful loading states rather than arbitrary fragmentation.
// ---------------------------------------------------------------------
