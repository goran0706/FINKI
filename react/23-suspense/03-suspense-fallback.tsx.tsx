/**
 * Suspense Fallback
 * =================
 *
 * The `fallback` prop of a Suspense boundary defines the React node that is
 * rendered while a descendant is suspended. The fallback is temporary UI:
 * React displays it when the boundary cannot currently render its children,
 * then replaces it with the resolved content when the suspended work becomes
 * available.
 *
 * A fallback can be as simple as text or as complex as a complete skeleton
 * layout. Its structure should communicate the loading state of the subtree
 * it represents without being confused with an error state.
 */

import { type FC, type ReactElement, type ReactNode, Suspense, use } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SuspendedContentProps {
  readonly title: string;
  readonly promise: Promise<string>;
}

export interface LoadingFallbackProps {
  readonly label: string;
}

export interface SkeletonFallbackProps {
  readonly rows: number;
}

export interface FallbackContainerProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates a Promise that resolves after a delay.
 *
 * The Promise is created outside component rendering so React can continue
 * reading the same asynchronous resource when rendering retries after
 * suspension.
 */
const createDelayedMessage = (message: string, delay: number): Promise<string> => {
  return new Promise<string>((resolve): void => {
    window.setTimeout((): void => {
      resolve(message);
    }, delay);
  });
};

const profilePromise: Promise<string> = createDelayedMessage("John Doe's profile is ready.", 1200);

const dashboardPromise: Promise<string> = createDelayedMessage("The dashboard data is ready.", 1600);

const articlePromise: Promise<string> = createDelayedMessage("The article content is ready.", 2000);

const nestedContentPromise: Promise<string> = createDelayedMessage("The nested content is ready.", 2400);

/**
 * Reads a suspended resource and displays its resolved value.
 */
export const SuspendedContent: FC<SuspendedContentProps> = ({ title, promise }): ReactElement => {
  const message: string = use(promise);

  return (
    <article>
      <h3>{title}</h3>
      <p>{message}</p>
    </article>
  );
};

/**
 * Demonstrates a minimal text fallback.
 *
 * The fallback can be any React node. It does not need to be a separate
 * component when the loading UI is simple.
 */
export const TextFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<p>Loading profile...</p>}>
        <SuspendedContent title="Profile" promise={profilePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a reusable fallback component.
 *
 * Extracting the fallback into a component is useful when the same loading
 * presentation is used by multiple boundaries.
 */
export const LoadingFallback: FC<LoadingFallbackProps> = ({ label }): ReactElement => {
  return (
    <div role="status" aria-live="polite" aria-label={label}>
      <span aria-hidden="true">Loading...</span>
      <span>{label}</span>
    </div>
  );
};

export const ReusableFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading dashboard" />}>
        <SuspendedContent title="Dashboard" promise={dashboardPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a structured fallback.
 *
 * Suspense fallbacks can contain multiple elements and can therefore preserve
 * the approximate structure of the content that is being loaded.
 */
export const StructuredFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense
        fallback={
          <article aria-busy="true" aria-label="Loading article">
            <h3>Loading article</h3>
            <p>Preparing the article content...</p>
            <p>Please wait while the content becomes available.</p>
          </article>
        }
      >
        <SuspendedContent title="Article" promise={articlePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a skeleton-style fallback.
 *
 * A skeleton can approximate the dimensions and hierarchy of the final
 * interface instead of displaying a generic loading message.
 */
export const SkeletonFallback: FC<SkeletonFallbackProps> = ({ rows }): ReactElement => {
  return (
    <div aria-busy="true" aria-label="Loading content">
      {Array.from({ length: rows }, (_, index: number) => (
        <p key={index}>
          <span aria-hidden="true">Loading row {index + 1}...</span>
        </p>
      ))}
    </div>
  );
};

export const SkeletonFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<SkeletonFallback rows={3} />}>
        <SuspendedContent title="Dashboard content" promise={dashboardPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a fallback with explicit status semantics.
 *
 * `role="status"` identifies the content as a status message, while
 * `aria-live="polite"` allows assistive technologies to announce relevant
 * changes without interrupting the user.
 */
export const AccessibleFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense
        fallback={
          <div role="status" aria-live="polite" aria-busy="true">
            <p>Loading profile information.</p>
          </div>
        }
      >
        <SuspendedContent title="Accessible profile" promise={profilePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that a fallback can be supplied through a wrapper component.
 *
 * The wrapper does not implement suspension itself. It simply centralizes the
 * Suspense boundary and its fallback presentation.
 */
export const FallbackContainer: FC<FallbackContainerProps> = ({ children }): ReactElement => {
  return <Suspense fallback={<LoadingFallback label="Loading section" />}>{children}</Suspense>;
};

export const FallbackWrapperExample: FC = (): ReactElement => {
  return (
    <section>
      <FallbackContainer>
        <SuspendedContent title="Wrapped section" promise={articlePromise} />
      </FallbackContainer>
    </section>
  );
};

/**
 * Demonstrates different fallbacks for different boundaries.
 *
 * Each Suspense boundary owns its own fallback, so separate interface regions
 * can communicate different loading states.
 */
export const DifferentFallbacksExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<p>Loading profile summary...</p>}>
        <SuspendedContent title="Profile summary" promise={profilePromise} />
      </Suspense>

      <Suspense
        fallback={
          <div role="status" aria-live="polite">
            <p>Loading dashboard metrics...</p>
            <p>Calculating recent activity...</p>
          </div>
        }
      >
        <SuspendedContent title="Dashboard metrics" promise={dashboardPromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a nested fallback.
 *
 * The inner Suspense boundary can provide a more specific fallback for its
 * own subtree instead of forcing the outer boundary to represent every
 * loading state with the same UI.
 */
export const NestedFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<LoadingFallback label="Loading entire application section" />}>
        <article>
          <h3>Application section</h3>
          <p>This part belongs to the outer boundary.</p>

          <Suspense fallback={<LoadingFallback label="Loading nested content" />}>
            <SuspendedContent title="Nested content" promise={nestedContentPromise} />
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that the fallback is not an error message.
 *
 * Suspense uses fallback UI while supported work is suspended. A failed
 * Promise read by `use()` is an error condition and is handled through an
 * error boundary rather than by treating the fallback as an error screen.
 */
export const LoadingIsNotErrorExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Loading is not an error</h3>
      <ul>
        <li>A loading fallback represents temporarily unavailable suspended content.</li>
        <li>A resolved resource causes the suspended content to render.</li>
        <li>A rendering error requires error-boundary handling rather than an error-specific Suspense fallback.</li>
      </ul>
    </section>
  );
};

/**
 * Demonstrates that fallback content does not need to duplicate the final
 * content exactly.
 *
 * A fallback should communicate the state of the interface clearly, while
 * the actual content remains responsible for its final structure and data.
 */
export const FallbackShapeExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense
        fallback={
          <div role="status" aria-live="polite">
            <p>Preparing your dashboard...</p>
          </div>
        }
      >
        <article>
          <h3>Dashboard</h3>
          <SuspendedContent title="Dashboard details" promise={dashboardPromise} />
        </article>
      </Suspense>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SuspenseFallbackDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Suspense Fallback</h1>

      <section>
        <h2>1. Text fallback</h2>
        <TextFallbackExample />
      </section>

      <section>
        <h2>2. Reusable fallback component</h2>
        <ReusableFallbackExample />
      </section>

      <section>
        <h2>3. Structured fallback</h2>
        <StructuredFallbackExample />
      </section>

      <section>
        <h2>4. Skeleton fallback</h2>
        <SkeletonFallbackExample />
      </section>

      <section>
        <h2>5. Accessible fallback</h2>
        <AccessibleFallbackExample />
      </section>

      <section>
        <h2>6. Fallback wrapper</h2>
        <FallbackWrapperExample />
      </section>

      <section>
        <h2>7. Different fallbacks</h2>
        <DifferentFallbacksExample />
      </section>

      <section>
        <h2>8. Nested fallback</h2>
        <NestedFallbackExample />
      </section>

      <section>
        <h2>9. Loading is not an error</h2>
        <LoadingIsNotErrorExample />
      </section>

      <section>
        <h2>10. Fallback shape</h2>
        <FallbackShapeExample />
      </section>
    </main>
  );
};

export default SuspenseFallbackDemo;

// ---------------------------------------------------------------------
// Summary
// The `fallback` prop defines the UI React renders while a Suspense subtree is suspended.
// A fallback can be plain text, a component, structured markup, or a skeleton interface.
// Accessible fallbacks can communicate loading status through appropriate ARIA semantics.
// Each Suspense boundary owns its own fallback, allowing different regions to use different loading UI.
// Nested boundaries can provide more specific fallbacks for inner interface regions.
// A fallback represents temporary loading state and should not be treated as an error message.
// The fallback does not need to duplicate the final content exactly.
// Suspense fallback UI is replaced when the suspended content becomes renderable.
// ---------------------------------------------------------------------
