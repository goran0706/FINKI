/**
 * Suspense Boundary
 * =================
 *
 * A Suspense boundary is a React component that defines a subtree whose
 * rendering can be temporarily replaced by fallback UI when a descendant
 * suspends. The boundary uses the `fallback` prop to determine what React
 * should display while the suspended work is not yet ready.
 *
 * Suspense boundaries can be nested, allowing different portions of an
 * interface to reveal independently. The nearest applicable boundary handles
 * a suspension, while content outside that boundary continues according to
 * its own rendering state.
 */

import { type FC, type ReactElement, type ReactNode, Suspense, use } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SuspenseBoundaryExampleProps {
  readonly children: ReactNode;
}

export interface SuspendedContentProps {
  readonly label: string;
  readonly promise: Promise<string>;
}

export interface BoundaryFallbackProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A reusable fallback component for a Suspense boundary.
 *
 * The fallback is displayed by React when a descendant of the surrounding
 * Suspense boundary suspends during rendering.
 */
export const BoundaryFallback: FC<BoundaryFallbackProps> = ({ label }): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      <p>{label}</p>
    </div>
  );
};

/**
 * Reads a Promise during rendering.
 *
 * When the Promise is pending, use() suspends this component. The nearest
 * Suspense boundary then renders its fallback instead of this subtree.
 */
export const SuspendedContent: FC<SuspendedContentProps> = ({ label, promise }): ReactElement => {
  const message: string = use(promise);

  return (
    <article>
      <h3>{label}</h3>
      <p>{message}</p>
    </article>
  );
};

/**
 * Creates a Promise that resolves after a specified delay.
 *
 * The Promise is created outside the rendering component so retries caused by
 * suspension continue reading the same asynchronous resource.
 */
const createDelayedMessage = (message: string, delay: number): Promise<string> => {
  return new Promise<string>((resolve): void => {
    window.setTimeout((): void => {
      resolve(message);
    }, delay);
  });
};

const boundaryMessagePromise: Promise<string> = createDelayedMessage("The boundary content is ready.", 1200);

/**
 * Demonstrates the smallest useful Suspense boundary.
 *
 * The Suspense component defines both the protected subtree and the fallback
 * that temporarily replaces it when the subtree suspends.
 */
export const BasicBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Basic Suspense boundary</h2>

      <Suspense fallback={<BoundaryFallback label="Loading boundary content..." />}>
        <SuspendedContent label="Boundary content" promise={boundaryMessagePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that the fallback belongs to the Suspense boundary rather than
 * to the suspended child.
 *
 * The child only reads the asynchronous resource. It does not decide which
 * fallback should replace the suspended subtree.
 */
export const BoundaryOwnsFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Boundary-owned fallback</h2>

      <Suspense
        fallback={
          <article>
            <h3>Loading profile</h3>
            <p>Profile content is being prepared.</p>
          </article>
        }
      >
        <SuspendedContent label="Profile" promise={boundaryMessagePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that content outside the boundary is not part of the
 * boundary's fallback scope.
 *
 * Only descendants of this Suspense component are replaced when they
 * suspend.
 */
export const BoundaryScopeExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Boundary scope</h2>

      <header>
        <h3>Application header</h3>
        <p>This content is outside the Suspense boundary.</p>
      </header>

      <Suspense fallback={<BoundaryFallback label="Loading main content..." />}>
        <SuspendedContent label="Main content" promise={boundaryMessagePromise} />
      </Suspense>

      <footer>
        <h3>Application footer</h3>
        <p>This content is also outside the boundary.</p>
      </footer>
    </section>
  );
};

/**
 * Demonstrates two independent Suspense boundaries.
 *
 * Each boundary controls only its own subtree, allowing each region to use a
 * different fallback and to reveal independently.
 */
export const IndependentBoundaryExample: FC = (): ReactElement => {
  const firstPromise: Promise<string> = createDelayedMessage("First panel is ready.", 700);

  const secondPromise: Promise<string> = createDelayedMessage("Second panel is ready.", 1400);

  return (
    <section>
      <h2>Independent boundaries</h2>

      <Suspense fallback={<BoundaryFallback label="Loading first panel..." />}>
        <SuspendedContent label="First panel" promise={firstPromise} />
      </Suspense>

      <Suspense fallback={<BoundaryFallback label="Loading second panel..." />}>
        <SuspendedContent label="Second panel" promise={secondPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates nested Suspense boundaries.
 *
 * When the inner subtree suspends, the inner boundary can handle that
 * suspension instead of the outer boundary. This allows a more specific
 * loading state to be displayed for the inner region.
 */
export const NestedBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Nested boundaries</h2>

      <Suspense fallback={<BoundaryFallback label="Loading entire section..." />}>
        <article>
          <h3>Outer section</h3>

          <Suspense fallback={<BoundaryFallback label="Loading inner panel..." />}>
            <SuspendedContent label="Inner panel" promise={boundaryMessagePromise} />
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a boundary containing multiple descendants.
 *
 * If any descendant suspends, the boundary can replace the relevant boundary
 * content with its fallback while React waits for the suspended work.
 */
export const MultipleDescendantsExample: FC = (): ReactElement => {
  const firstPromise: Promise<string> = createDelayedMessage("User information is ready.", 900);

  const secondPromise: Promise<string> = createDelayedMessage("Activity information is ready.", 1300);

  return (
    <section>
      <h2>Multiple descendants</h2>

      <Suspense fallback={<BoundaryFallback label="Loading user dashboard..." />}>
        <article>
          <SuspendedContent label="User information" promise={firstPromise} />
          <SuspendedContent label="Recent activity" promise={secondPromise} />
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a boundary whose fallback contains ordinary React elements.
 *
 * Suspense does not require a dedicated loading component. The fallback can
 * contain any renderable React node, including structured placeholder markup.
 */
export const StructuredFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Structured fallback</h2>

      <Suspense
        fallback={
          <article aria-busy="true">
            <h3>Loading dashboard</h3>
            <div>
              <p>Loading account summary...</p>
              <p>Loading recent activity...</p>
              <p>Loading recommendations...</p>
            </div>
          </article>
        }
      >
        <SuspendedContent label="Dashboard" promise={boundaryMessagePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a Suspense boundary around content that does not suspend.
 *
 * Merely placing a component inside Suspense does not cause the fallback to
 * appear. The fallback is used only when supported React work below the
 * boundary actually suspends.
 */
export const NonSuspendingContentExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Non-suspending content</h2>

      <Suspense fallback={<BoundaryFallback label="This fallback is not needed." />}>
        <article>
          <h3>Immediately available content</h3>
          <p>This subtree renders normally because nothing inside it suspends.</p>
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that Suspense is not a general JavaScript error boundary.
 *
 * A thrown rendering error and a suspended render are different mechanisms.
 * Suspense handles suspension; rendering errors require an error boundary.
 */
export const SuspensionVersusErrorExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Suspension versus rendering errors</h2>

      <ul>
        <li>
          <strong>Suspension:</strong> React temporarily waits for supported asynchronous work and renders the Suspense
          fallback.
        </li>
        <li>
          <strong>Rendering error:</strong> an error boundary is responsible for replacing a failed subtree with error
          UI.
        </li>
        <li>
          <strong>Fallback:</strong> Suspense fallback UI does not represent an error state by itself.
        </li>
      </ul>
    </section>
  );
};

/**
 * Demonstrates that boundaries can be composed around meaningful interface
 * regions.
 *
 * The boundary placement determines which interface region shares the same
 * fallback. A broad boundary produces a broader loading state, while smaller
 * boundaries allow more independent reveal behavior.
 */
export const BoundaryCompositionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Boundary composition</h2>

      <Suspense fallback={<BoundaryFallback label="Loading dashboard..." />}>
        <article>
          <h3>Dashboard</h3>

          <Suspense fallback={<BoundaryFallback label="Loading analytics..." />}>
            <SuspendedContent label="Analytics" promise={boundaryMessagePromise} />
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SuspenseBoundaryDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Suspense Boundary</h1>

      <section>
        <h2>1. Basic Suspense boundary</h2>
        <BasicBoundaryExample />
      </section>

      <section>
        <h2>2. Boundary-owned fallback</h2>
        <BoundaryOwnsFallbackExample />
      </section>

      <section>
        <h2>3. Boundary scope</h2>
        <BoundaryScopeExample />
      </section>

      <section>
        <h2>4. Independent boundaries</h2>
        <IndependentBoundaryExample />
      </section>

      <section>
        <h2>5. Nested boundaries</h2>
        <NestedBoundaryExample />
      </section>

      <section>
        <h2>6. Multiple descendants</h2>
        <MultipleDescendantsExample />
      </section>

      <section>
        <h2>7. Structured fallback</h2>
        <StructuredFallbackExample />
      </section>

      <section>
        <h2>8. Non-suspending content</h2>
        <NonSuspendingContentExample />
      </section>

      <section>
        <h2>9. Suspension versus rendering errors</h2>
        <SuspensionVersusErrorExample />
      </section>

      <section>
        <h2>10. Boundary composition</h2>
        <BoundaryCompositionExample />
      </section>
    </main>
  );
};

export default SuspenseBoundaryDemo;

// ---------------------------------------------------------------------
// Summary
// A Suspense boundary defines a subtree whose suspension can be replaced by fallback UI.
// The fallback is controlled by the Suspense boundary rather than by the suspended child.
// Content outside the boundary is not replaced when a descendant suspends.
// Multiple boundaries can provide independent loading states for different interface regions.
// Nested boundaries allow a more specific inner fallback to handle suspension within its subtree.
// A Suspense fallback can contain any valid React node, including structured placeholder UI.
// A boundary does not display its fallback when its descendants render normally without suspending.
// Suspense handles supported suspension, while rendering errors are handled by error boundaries.
// Boundary placement determines which interface regions share the same loading state.
// ---------------------------------------------------------------------
