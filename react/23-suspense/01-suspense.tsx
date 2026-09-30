/**
 * Suspense
 * ========
 *
 * Suspense lets React temporarily replace a rendering subtree with fallback UI
 * when that subtree suspends. The boundary remains responsible for deciding
 * what placeholder should be displayed while its children are not yet ready.
 *
 * A Suspense boundary is activated when supported React features such as lazy
 * component loading or reading a Promise with use() suspend during rendering.
 * Once the suspended work is ready, React retries the subtree and replaces the
 * fallback with the resolved content.
 */

import { type FC, type ReactElement, type ReactNode, Suspense, use, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SuspenseBoundaryProps {
  readonly children: ReactNode;
  readonly fallback: ReactNode;
}

export interface SuspendedContentProps {
  readonly label: string;
  readonly promise: Promise<string>;
}

export interface SuspenseStatusProps {
  readonly label: string;
  readonly isLoading: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A small fallback component used while a Suspense subtree is suspended.
 *
 * The fallback is rendered in place of the suspended children and should
 * generally be lightweight enough to display immediately.
 */
export const LoadingFallback: FC = (): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      <p>Loading content...</p>
    </div>
  );
};

/**
 * Demonstrates a component that reads a cached Promise during rendering.
 *
 * In React 19, use() suspends the component while the Promise is pending.
 * Because the Promise is created outside the component and reused, React can
 * read the same Promise instance across retries.
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
 * Creates a cached Promise that resolves after a controlled delay.
 *
 * The Promise is created once rather than during component rendering. This
 * prevents a new Promise from being created on every render and allows use()
 * to observe the same asynchronous resource across retries.
 */
const createDelayedMessage = (message: string, delay: number): Promise<string> => {
  return new Promise<string>((resolve): void => {
    window.setTimeout((): void => {
      resolve(message);
    }, delay);
  });
};

const delayedMessagePromise: Promise<string> = createDelayedMessage("The suspended content is now ready.", 1200);

/**
 * Demonstrates the basic Suspense boundary.
 *
 * While SuspendedContent is waiting for its Promise, the nearest Suspense
 * boundary renders its fallback. When the Promise resolves, React retries the
 * suspended subtree and reveals the content.
 */
export const BasicSuspenseExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Basic Suspense boundary</h2>

      <Suspense fallback={<LoadingFallback />}>
        <SuspendedContent label="Delayed content" promise={delayedMessagePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that the fallback belongs to the boundary rather than to the
 * suspended component itself.
 *
 * The suspended child does not render its own loading state. The surrounding
 * Suspense boundary decides what replaces the child while it is suspended.
 */
export const FallbackOwnershipExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Fallback ownership</h2>

      <Suspense
        fallback={
          <div role="status">
            <p>Preparing the profile...</p>
          </div>
        }
      >
        <SuspendedContent label="Profile" promise={delayedMessagePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a Suspense boundary with arbitrary fallback content.
 *
 * The fallback prop accepts any valid React node, allowing applications to
 * use text, skeletons, placeholders, or complete loading layouts.
 */
export const CustomFallbackExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Custom fallback content</h2>

      <Suspense
        fallback={
          <article aria-busy="true">
            <h3>Loading profile</h3>
            <p>Profile details are being prepared.</p>
          </article>
        }
      >
        <SuspendedContent label="Profile details" promise={delayedMessagePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a subtree that does not suspend.
 *
 * Suspense does not automatically show its fallback merely because the
 * boundary exists. The fallback is rendered when a descendant actually
 * suspends during rendering.
 */
export const ReadyContentExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Content that does not suspend</h2>

      <Suspense fallback={<LoadingFallback />}>
        <article>
          <h3>Immediately available content</h3>
          <p>This subtree does not suspend, so the fallback is not required.</p>
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates placing ordinary content beside a Suspense boundary.
 *
 * Content outside the boundary continues to render normally. Only the
 * descendant subtree controlled by the boundary is replaced when it suspends.
 */
export const BoundaryScopeExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Suspense boundary scope</h2>

      <h3>Page heading</h3>
      <p>This content is outside the Suspense boundary.</p>

      <Suspense fallback={<LoadingFallback />}>
        <SuspendedContent label="Protected content" promise={delayedMessagePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates multiple independent Suspense boundaries.
 *
 * Each boundary controls its own subtree. This allows different sections to
 * display different fallback UI rather than forcing unrelated content into a
 * single loading state.
 */
export const IndependentBoundariesExample: FC = (): ReactElement => {
  const firstMessagePromise: Promise<string> = createDelayedMessage("The first panel is ready.", 700);

  const secondMessagePromise: Promise<string> = createDelayedMessage("The second panel is ready.", 1400);

  return (
    <section>
      <h2>Independent Suspense boundaries</h2>

      <Suspense fallback={<p role="status">Loading first panel...</p>}>
        <SuspendedContent label="First panel" promise={firstMessagePromise} />
      </Suspense>

      <Suspense fallback={<p role="status">Loading second panel...</p>}>
        <SuspendedContent label="Second panel" promise={secondMessagePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that Suspense replaces the suspended subtree rather than
 * rendering the suspended children alongside the fallback.
 *
 * While the Promise is pending, the content inside the boundary is not shown.
 * When the Promise resolves, the fallback is replaced by the children.
 */
export const ReplacementBehaviorExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Fallback replacement behavior</h2>

      <Suspense fallback={<LoadingFallback />}>
        <article>
          <h3>Suspended subtree</h3>
          <SuspendedContent label="Loaded content" promise={delayedMessagePromise} />
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that Suspense is different from manually rendering a loading
 * flag from component state.
 *
 * A state-based loading flag is controlled explicitly by application code.
 * Suspense fallback rendering is controlled by whether a descendant suspends.
 */
export const SuspenseVsLoadingStateExample: FC = (): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleToggle = (): void => {
    setIsLoading((previousIsLoading: boolean): boolean => !previousIsLoading);
  };

  return (
    <section>
      <h2>Suspense versus loading state</h2>

      <button type="button" onClick={handleToggle}>
        Toggle manual loading state
      </button>

      {isLoading ? <p role="status">Manual loading state is active.</p> : <p>Manual loading state is inactive.</p>}

      <Suspense fallback={<LoadingFallback />}>
        <SuspendedContent label="Suspense-controlled content" promise={delayedMessagePromise} />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a reusable status component for ordinary application state.
 *
 * This component is intentionally separate from Suspense so the distinction
 * between manually controlled loading UI and Suspense-driven fallback UI
 * remains explicit.
 */
export const ManualStatusExample: FC<SuspenseStatusProps> = ({ label, isLoading }): ReactElement => {
  return (
    <section>
      <h3>{label}</h3>
      <p>{isLoading ? "Loading..." : "Ready."}</p>
    </section>
  );
};

/**
 * Demonstrates the relationship between a suspended child and its closest
 * Suspense ancestor.
 *
 * A Suspense boundary handles suspension from descendants within its subtree.
 * Components outside that subtree are unaffected by the suspended content.
 */
export const ClosestBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Closest Suspense boundary</h2>

      <Suspense fallback={<p>Outer fallback...</p>}>
        <article>
          <h3>Outer content</h3>

          <Suspense fallback={<p>Inner fallback...</p>}>
            <SuspendedContent label="Inner suspended content" promise={delayedMessagePromise} />
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SuspenseDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Suspense</h1>

      <section>
        <h2>1. Basic Suspense boundary</h2>
        <BasicSuspenseExample />
      </section>

      <section>
        <h2>2. Fallback ownership</h2>
        <FallbackOwnershipExample />
      </section>

      <section>
        <h2>3. Custom fallback content</h2>
        <CustomFallbackExample />
      </section>

      <section>
        <h2>4. Content that does not suspend</h2>
        <ReadyContentExample />
      </section>

      <section>
        <h2>5. Suspense boundary scope</h2>
        <BoundaryScopeExample />
      </section>

      <section>
        <h2>6. Independent Suspense boundaries</h2>
        <IndependentBoundariesExample />
      </section>

      <section>
        <h2>7. Fallback replacement behavior</h2>
        <ReplacementBehaviorExample />
      </section>

      <section>
        <h2>8. Suspense versus manual loading state</h2>
        <SuspenseVsLoadingStateExample />
      </section>

      <section>
        <h2>9. Manual loading status</h2>
        <ManualStatusExample label="Application state" isLoading={false} />
      </section>

      <section>
        <h2>10. Closest Suspense boundary</h2>
        <ClosestBoundaryExample />
      </section>
    </main>
  );
};

export default SuspenseDemo;

// ---------------------------------------------------------------------
// Summary
// Suspense lets React replace a suspended descendant subtree with fallback UI until that subtree is ready.
// The fallback is supplied by the Suspense boundary and can be any valid React node.
// A Suspense boundary does not display its fallback unless a descendant actually suspends.
// Content outside a boundary remains independent from that boundary's suspended subtree.
// Multiple boundaries can provide independent loading states for different interface regions.
// When a descendant suspends, the closest applicable Suspense boundary handles the fallback.
// Suspense-driven fallback rendering is different from manually rendering a loading state from component state.
// In React 19, use() can suspend while reading a cached Promise during rendering.
// Suspense also integrates with React features such as lazy-loaded components and Suspense-enabled data sources.
// ---------------------------------------------------------------------
