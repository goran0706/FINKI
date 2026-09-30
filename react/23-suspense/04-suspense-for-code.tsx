/**
 * Suspense for Code
 * =================
 *
 * React.lazy enables component code to be loaded on demand instead of being
 * included in the initial JavaScript execution path. The lazy component
 * suspends while its module is loading, so it must be rendered inside a
 * Suspense boundary with an appropriate fallback.
 *
 * The lazy component and its dynamic import should be declared at module
 * scope. React caches both the Promise returned by the loader and the
 * resolved component, so the loader is not repeatedly invoked for the same
 * lazy component.
 */

import { type FC, lazy, type ReactElement, Suspense, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LazyComponentProps {
  readonly title: string;
  readonly description: string;
}

export interface CodeLoadingFallbackProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Represents the component whose code would normally live in a separate
 * dynamically imported module.
 *
 * The tutorial keeps the component in this file so the example remains a
 * single complete file. The lazy loader below still demonstrates the same
 * `import()` and Suspense mechanism used for code splitting.
 */
const LazyLoadedPanel: FC<LazyComponentProps> = ({ title, description }): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>This component is rendered through a lazy-loaded module boundary.</p>
    </article>
  );
};

/**
 * Loads a component through a dynamic import.
 *
 * `lazy` expects the Promise to resolve to a module whose `default` export is
 * a valid React component. A real application would normally import a
 * component from another module here.
 */
const LazyPanel: FC<LazyComponentProps> = lazy(
  async (): Promise<{
    readonly default: FC<LazyComponentProps>;
  }> => {
    const module: {
      readonly default: FC<LazyComponentProps>;
    } = await Promise.resolve({
      default: LazyLoadedPanel,
    });

    return module;
  },
);

/**
 * Provides lightweight loading UI while lazy component code is loading.
 */
export const CodeLoadingFallback: FC<CodeLoadingFallbackProps> = ({ label }): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      <p>{label}</p>
    </div>
  );
};

/**
 * Demonstrates the basic relationship between `lazy` and `Suspense`.
 *
 * Rendering the lazy component can suspend while its module Promise is
 * pending. The nearest Suspense boundary then renders its fallback.
 */
export const BasicLazyLoadingExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<CodeLoadingFallback label="Loading component code..." />}>
        <LazyPanel title="Lazy panel" description="The panel is loaded through a lazy component." />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates that code loading and ordinary data loading are separate
 * concerns.
 *
 * `lazy` controls when component code is loaded. The component itself can
 * subsequently render its own content without requiring a data Promise.
 */
export const CodeLoadingConceptExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<CodeLoadingFallback label="Loading panel code..." />}>
        <article>
          <h3>Code loading</h3>
          <p>Suspense can display a fallback while a lazy component's JavaScript module is loading.</p>
          <LazyPanel title="Loaded component" description="The component code is now available." />
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates conditional rendering of a lazy component.
 *
 * The lazy component is not rendered until the condition becomes true, so its
 * code does not need to be loaded merely because the component was declared.
 */
export const ConditionalLazyLoadingExample: FC = (): ReactElement => {
  const [showPanel, setShowPanel] = useState<boolean>(false);

  return (
    <section>
      <button
        type="button"
        onClick={(): void => {
          setShowPanel((current: boolean): boolean => !current);
        }}
      >
        {showPanel ? "Hide panel" : "Show panel"}
      </button>

      {showPanel ? (
        <Suspense fallback={<CodeLoadingFallback label="Loading optional panel..." />}>
          <LazyPanel title="Optional panel" description="Its component code is requested when the panel is rendered." />
        </Suspense>
      ) : (
        <p>The optional panel has not been rendered.</p>
      )}
    </section>
  );
};

/**
 * Demonstrates that the Suspense boundary can cover surrounding content as
 * well as the lazy component itself.
 *
 * The fallback replaces the boundary's suspended subtree according to where
 * the boundary is placed in the component tree.
 */
export const BoundaryScopeForCodeExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense
        fallback={
          <div>
            <h3>Loading feature</h3>
            <p>Preparing the feature interface...</p>
          </div>
        }
      >
        <header>
          <h3>Feature header</h3>
        </header>

        <LazyPanel title="Feature content" description="The lazy component belongs to the same Suspense boundary." />

        <footer>
          <p>Feature footer</p>
        </footer>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates independent lazy-loading regions.
 *
 * Separate Suspense boundaries allow different feature regions to have
 * different fallback UI and loading scopes.
 */
export const IndependentCodeBoundariesExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<CodeLoadingFallback label="Loading account feature..." />}>
        <LazyPanel title="Account" description="Account feature code is isolated by its boundary." />
      </Suspense>

      <Suspense fallback={<CodeLoadingFallback label="Loading reports feature..." />}>
        <LazyPanel title="Reports" description="Reports feature code has its own Suspense boundary." />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates a nested Suspense boundary around lazy component code.
 *
 * The inner boundary can provide a more specific loading state for a nested
 * feature instead of forcing the outer boundary to represent every loading
 * state with the same fallback.
 */
export const NestedCodeBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <Suspense fallback={<CodeLoadingFallback label="Loading application feature..." />}>
        <article>
          <h3>Application feature</h3>
          <p>Outer content can remain part of the outer boundary.</p>

          <Suspense fallback={<CodeLoadingFallback label="Loading nested feature code..." />}>
            <LazyPanel title="Nested feature" description="This lazy component has a more specific inner fallback." />
          </Suspense>
        </article>
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates the module-export requirement of `lazy`.
 *
 * A lazy loader resolves to an object containing a `default` export because
 * React renders that resolved default export as the component type.
 */
export const DefaultExportRequirementExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Default export requirement</h3>
      <p>A lazy loader must resolve to a module whose `default` export is the component React should render.</p>

      <Suspense fallback={<p>Loading default export...</p>}>
        <LazyPanel
          title="Default component"
          description="The resolved module provides this component through its default export."
        />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates the correct declaration location for a lazy component.
 *
 * The lazy component is declared at module scope rather than inside another
 * component. Declaring it during rendering can create a new component type
 * on every render and reset its state.
 */
export const ModuleScopeLazyExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Module-scope declaration</h3>
      <p>
        Lazy component declarations should remain outside component functions so the same component type is reused
        across renders.
      </p>

      <Suspense fallback={<p>Loading module...</p>}>
        <LazyPanel title="Stable lazy component" description="This lazy component was declared at module scope." />
      </Suspense>
    </section>
  );
};

/**
 * Demonstrates the distinction between lazy code loading and data fetching.
 *
 * A lazy component suspends because its module is loading. Suspense can also
 * activate for other supported mechanisms, but `lazy` specifically addresses
 * loading component code.
 */
export const CodeVersusDataExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Code versus data</h3>
      <ul>
        <li>
          <strong>Code:</strong> `lazy` defers loading a component's JavaScript module.
        </li>
        <li>
          <strong>Suspense:</strong> displays fallback UI while supported work below the boundary is suspended.
        </li>
        <li>
          <strong>Data:</strong> data can use other Suspense-enabled mechanisms such as a cached Promise read with
          `use()`.
        </li>
      </ul>
    </section>
  );
};

/**
 * Demonstrates the practical feature-level pattern for code splitting.
 *
 * A feature can be conditionally rendered and wrapped in a boundary so its
 * code is requested only when the feature enters the rendered tree.
 */
export const FeatureCodeSplittingExample: FC = (): ReactElement => {
  const [showFeature, setShowFeature] = useState<boolean>(false);

  return (
    <section>
      <h3>Feature-level code splitting</h3>

      <button
        type="button"
        onClick={(): void => {
          setShowFeature((current: boolean): boolean => !current);
        }}
      >
        {showFeature ? "Hide feature" : "Load feature"}
      </button>

      {showFeature ? (
        <Suspense fallback={<CodeLoadingFallback label="Loading feature code..." />}>
          <LazyPanel title="Deferred feature" description="This feature is rendered only after the user requests it." />
        </Suspense>
      ) : (
        <p>The feature has not been requested.</p>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SuspenseForCodeDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Suspense for Code</h1>

      <section>
        <h2>1. Basic lazy loading</h2>
        <BasicLazyLoadingExample />
      </section>

      <section>
        <h2>2. Code loading concept</h2>
        <CodeLoadingConceptExample />
      </section>

      <section>
        <h2>3. Conditional lazy loading</h2>
        <ConditionalLazyLoadingExample />
      </section>

      <section>
        <h2>4. Suspense boundary scope</h2>
        <BoundaryScopeForCodeExample />
      </section>

      <section>
        <h2>5. Independent code boundaries</h2>
        <IndependentCodeBoundariesExample />
      </section>

      <section>
        <h2>6. Nested code boundary</h2>
        <NestedCodeBoundaryExample />
      </section>

      <section>
        <h2>7. Default export requirement</h2>
        <DefaultExportRequirementExample />
      </section>

      <section>
        <h2>8. Module-scope lazy declaration</h2>
        <ModuleScopeLazyExample />
      </section>

      <section>
        <h2>9. Code versus data loading</h2>
        <CodeVersusDataExample />
      </section>

      <section>
        <h2>10. Feature-level code splitting</h2>
        <FeatureCodeSplittingExample />
      </section>
    </main>
  );
};

export default SuspenseForCodeDemo;

// ---------------------------------------------------------------------
// Summary
// `lazy` defers loading a component's code until React attempts to render it.
// A lazy component suspends while its module is loading and should be rendered inside Suspense.
// The lazy loader must resolve to a module whose `default` export is a valid React component.
// Lazy components should be declared at module scope rather than inside component functions.
// Conditional rendering can defer requesting optional feature code until that feature is rendered.
// Separate Suspense boundaries can provide independent loading states for different code-split regions.
// Nested boundaries can provide progressively more specific loading states.
// Suspense for code loading is distinct from Suspense-enabled data loading.
// ---------------------------------------------------------------------
