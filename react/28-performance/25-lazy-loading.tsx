/**
 * Lazy Loading
 * ============
 *
 * Lazy loading defers loading a resource or feature until it is actually needed instead of loading
 * everything during the initial application load. In React applications, lazy loading commonly uses
 * dynamic imports with `lazy` and `Suspense` to defer component code until the component is rendered.
 */

import { lazy, Suspense, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Lazy loading defers work
// ---------------------------------------------------------------------

const LazyLoadingConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Initial load: application code needed immediately.</p>
      <p>Lazy load: feature code requested when the feature is needed.</p>
    </section>
  );
};

// Lazy loading changes when a resource is requested.
// It does not necessarily reduce the total amount of code or data an application can eventually load.

// ---------------------------------------------------------------------
// 2. Static imports load through the initial dependency graph
// ---------------------------------------------------------------------

const StaticImportConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Static imports are known during the build.</p>
      <p>The imported module is part of the application's static dependency graph.</p>
    </section>
  );
};

// A static import such as `import {Editor} from "./Editor"` establishes a normal module dependency.
// Whether that dependency is placed in the initial chunk or another statically generated chunk depends on the build system.

// ---------------------------------------------------------------------
// 3. Dynamic imports defer module loading
// ---------------------------------------------------------------------

const DynamicImportConcept: FC = (): ReactElement => {
  const [status, setStatus] = useState("Feature not loaded");

  const loadFeature = async (): Promise<void> => {
    setStatus("Loading feature...");

    await Promise.resolve();

    setStatus("Feature module loaded");
  };

  return (
    <section>
      <p>{status}</p>

      <button type="button" onClick={() => void loadFeature()}>
        Load feature
      </button>
    </section>
  );
};

// `import()` returns a Promise for the requested module.
// Bundlers can turn a dynamic import into a separately loaded chunk.

// ---------------------------------------------------------------------
// 4. React.lazy wraps a dynamic import
// ---------------------------------------------------------------------

const LazyComponentConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>React.lazy can load a component from a dynamic import.</p>
      <p>The resolved module should provide the component as its default export.</p>
    </section>
  );
};

// The common pattern is:
// const LazyComponent = lazy(() => import("./Feature"));
// The module returned by the Promise must have a compatible default component export.

// ---------------------------------------------------------------------
// 5. Suspense displays a fallback while lazy content loads
// ---------------------------------------------------------------------

const LazyFeature = lazy(() =>
  Promise.resolve({
    default: (): ReactElement => (
      <section>
        <h2>Lazy feature</h2>
        <p>The feature has finished loading.</p>
      </section>
    ),
  }),
);

const SuspenseLoadingExample: FC = (): ReactElement => {
  const [showFeature, setShowFeature] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setShowFeature((value) => !value)}>
        {showFeature ? "Hide" : "Show"} feature
      </button>

      {showFeature && (
        <Suspense fallback={<p>Loading feature...</p>}>
          <LazyFeature />
        </Suspense>
      )}
    </section>
  );
};

// Suspense renders its fallback while a descendant is suspended.
// For a real network-loaded component, the lazy component would normally use a dynamic import.

// ---------------------------------------------------------------------
// 6. Lazy components should be declared outside components
// ---------------------------------------------------------------------

const StableLazyComponent: FC = (): ReactElement => {
  return <p>The lazy component has stable identity.</p>;
};

const LazyDeclarationConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Lazy component definitions belong at module scope.</p>
      <p>This keeps their component type stable across parent renders.</p>
    </section>
  );
};

// Calling `lazy` inside a component creates a new lazy component type on each render.
// Defining the lazy component at module scope avoids that identity problem.

// ---------------------------------------------------------------------
// 7. Lazy loading can be triggered by user interaction
// ---------------------------------------------------------------------

const InteractionDrivenLoading: FC = (): ReactElement => {
  const [opened, setOpened] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setOpened((value) => !value)}>
        {opened ? "Close" : "Open"} advanced feature
      </button>

      {opened && (
        <Suspense fallback={<p>Loading advanced feature...</p>}>
          <LazyFeature />
        </Suspense>
      )}
    </section>
  );
};

// Rendering a lazy component can trigger its dynamic import when the component's module is first needed.
// This makes user interaction a natural loading boundary for features that are not needed immediately.

// ---------------------------------------------------------------------
// 8. Lazy loading is useful for large features
// ---------------------------------------------------------------------

interface Feature {
  readonly name: string;
  readonly size: number;
}

const largeFeatures: readonly Feature[] = [
  { name: "Rich-text editor", size: 220 },
  { name: "Interactive charts", size: 160 },
  { name: "Report builder", size: 240 },
  { name: "Administration tools", size: 180 },
];

const LargeFeatureExample: FC = (): ReactElement => {
  return (
    <ul>
      {largeFeatures.map((feature) => (
        <li key={feature.name}>
          {feature.name}: {feature.size} KB
        </li>
      ))}
    </ul>
  );
};

// Large features can be useful lazy-loading candidates when they are not required for the initial experience.
// Size alone is not sufficient; usage frequency and interaction latency also matter.

// ---------------------------------------------------------------------
// 9. Lazy loading is useful for infrequently used features
// ---------------------------------------------------------------------

const InfrequentFeatureExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Primary dashboard: loaded immediately.</p>
      <p>Advanced reporting: loaded only when opened.</p>
    </section>
  );
};

// A feature that only a small portion of users access can often be deferred.
// This can avoid downloading its code for users who never request the feature.

// ---------------------------------------------------------------------
// 10. Lazy loading can reduce initial JavaScript
// ---------------------------------------------------------------------

interface LoadingSize {
  readonly asset: string;
  readonly initial: number;
  readonly deferred: number;
}

const loadingSizes: readonly LoadingSize[] = [
  { asset: "application", initial: 320, deferred: 0 },
  { asset: "editor", initial: 0, deferred: 220 },
  { asset: "reports", initial: 0, deferred: 180 },
];

const InitialJavaScriptExample: FC = (): ReactElement => {
  return (
    <ul>
      {loadingSizes.map((asset) => (
        <li key={asset.asset}>
          {asset.asset}: initial {asset.initial} KB / deferred {asset.deferred} KB
        </li>
      ))}
    </ul>
  );
};

// Moving feature code out of the initial load can reduce the JavaScript required to start the application.
// The deferred code still has to be downloaded and evaluated when the feature is requested.

// ---------------------------------------------------------------------
// 11. Lazy loading does not remove code
// ---------------------------------------------------------------------

const DeferredCostExample: FC = (): ReactElement => {
  const initialSize = 320;
  const deferredSize = 400;

  return (
    <section>
      <p>Initial JavaScript: {initialSize} KB</p>
      <p>Potential deferred JavaScript: {deferredSize} KB</p>
      <p>Total generated JavaScript: {initialSize + deferredSize} KB</p>
    </section>
  );
};

// Lazy loading changes the timing of delivery.
// It should not be described as a way to make the deferred feature's code disappear.

// ---------------------------------------------------------------------
// 12. Lazy loading can introduce interaction latency
// ---------------------------------------------------------------------

const InteractionLatencyExample: FC = (): ReactElement => {
  return (
    <ol>
      <li>User requests the feature.</li>
      <li>The browser requests the lazy chunk.</li>
      <li>The chunk is downloaded and evaluated.</li>
      <li>React renders the feature.</li>
    </ol>
  );
};

// If a feature is loaded only after an interaction, the user may wait for the network and JavaScript evaluation.
// A good loading strategy balances initial-load savings against the cost of the later interaction.

// ---------------------------------------------------------------------
// 13. Suspense fallback should represent the loading region
// ---------------------------------------------------------------------

const LoadingRegionExample: FC = (): ReactElement => {
  return (
    <Suspense fallback={<p>Loading editor...</p>}>
      <section>
        <h2>Editor</h2>
        <p>Editor content</p>
      </section>
    </Suspense>
  );
};

// The fallback should make sense for the part of the interface that is waiting.
// A boundary around an entire page produces a different loading experience from a boundary around one panel.

// ---------------------------------------------------------------------
// 14. Nested Suspense boundaries allow granular loading
// ---------------------------------------------------------------------

const NestedLoadingExample: FC = (): ReactElement => {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <section>
        <h2>Page shell</h2>

        <Suspense fallback={<p>Loading chart...</p>}>
          <p>Chart content</p>
        </Suspense>
      </section>
    </Suspense>
  );
};

// Nested boundaries can allow independent regions to reveal themselves at different times.
// The appropriate granularity depends on the desired user experience.

// ---------------------------------------------------------------------
// 15. Lazy loading can be combined with route boundaries
// ---------------------------------------------------------------------

interface Route {
  readonly path: string;
  readonly feature: string;
}

const routes: readonly Route[] = [
  { path: "/", feature: "Home" },
  { path: "/dashboard", feature: "Dashboard" },
  { path: "/settings", feature: "Settings" },
  { path: "/editor", feature: "Editor" },
];

const RouteLazyLoadingExample: FC = (): ReactElement => {
  return (
    <ul>
      {routes.map((route) => (
        <li key={route.path}>
          {route.path} → {route.feature}
        </li>
      ))}
    </ul>
  );
};

// Routers can associate routes with lazily loaded modules.
// This allows route-specific code to be requested when the corresponding route is entered.

// ---------------------------------------------------------------------
// 16. Lazy loading can be used for feature components
// ---------------------------------------------------------------------

const FeatureComponentExample: FC = (): ReactElement => {
  const [showReports, setShowReports] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setShowReports((value) => !value)}>
        {showReports ? "Hide" : "Show"} reports
      </button>

      {showReports && (
        <Suspense fallback={<p>Loading reports...</p>}>
          <LazyFeature />
        </Suspense>
      )}
    </section>
  );
};

// Feature components can be lazy loaded independently of routing.
// This is useful when a feature is large or only needed after a particular user action.

// ---------------------------------------------------------------------
// 17. Preloading can reduce later waiting
// ---------------------------------------------------------------------

const PreloadingExample: FC = (): ReactElement => {
  const [status, setStatus] = useState("Feature has not been requested");

  const prepareFeature = (): void => {
    setStatus("Feature preparation started");
  };

  const openFeature = (): void => {
    setStatus("Feature opened");
  };

  return (
    <section>
      <p>{status}</p>

      <button type="button" onMouseEnter={prepareFeature}>
        Prepare feature
      </button>

      <button type="button" onClick={openFeature}>
        Open feature
      </button>
    </section>
  );
};

// An application can begin loading a resource before it is strictly required when there is a useful signal.
// For example, hovering over a control can sometimes provide enough evidence that the user is about to open a feature.

// ---------------------------------------------------------------------
// 18. Prefetching can prepare for future navigation
// ---------------------------------------------------------------------

const PrefetchingExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Current page: Home</p>
      <p>Potential next page: Dashboard</p>
      <p>Its code may be fetched before navigation.</p>
    </section>
  );
};

// Prefetching is intended for resources that may be needed later.
// It can improve later navigation latency, but unnecessary prefetching consumes network and device resources.

// ---------------------------------------------------------------------
// 19. Preloading and prefetching have different priorities
// ---------------------------------------------------------------------

const LoadingPriorityExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Preload: a resource needed soon.</p>
      <p>Prefetch: a resource that may be needed later.</p>
    </section>
  );
};

// The browser treats preload and prefetch as different loading hints.
// They should be used deliberately rather than as interchangeable terms.

// ---------------------------------------------------------------------
// 20. Lazy loading can affect caching
// ---------------------------------------------------------------------

interface CachedChunk {
  readonly name: string;
  readonly version: string;
}

const cachedChunks: readonly CachedChunk[] = [
  { name: "main.js", version: "a1b2c3" },
  { name: "editor.js", version: "d4e5f6" },
];

const CacheExample: FC = (): ReactElement => {
  return (
    <ul>
      {cachedChunks.map((chunk) => (
        <li key={chunk.name}>
          {chunk.name}: {chunk.version}
        </li>
      ))}
    </ul>
  );
};

// Once a lazy chunk is cached, later visits can potentially reuse it without downloading it again.
// Content-hashed asset names help browsers distinguish changed versions of generated assets.

// ---------------------------------------------------------------------
// 21. Lazy chunks can contain shared dependencies
// ---------------------------------------------------------------------

interface SharedDependency {
  readonly dependency: string;
  readonly features: readonly string[];
}

const sharedDependencies: readonly SharedDependency[] = [
  {
    dependency: "UI library",
    features: ["Dashboard", "Editor", "Reports"],
  },
  {
    dependency: "Chart library",
    features: ["Dashboard", "Reports"],
  },
];

const SharedDependencyExample: FC = (): ReactElement => {
  return (
    <ul>
      {sharedDependencies.map((dependency) => (
        <li key={dependency.dependency}>
          {dependency.dependency}: {dependency.features.join(", ")}
        </li>
      ))}
    </ul>
  );
};

// Multiple lazy features can depend on the same modules.
// The bundler may create shared chunks depending on its chunking and optimization strategy.

// ---------------------------------------------------------------------
// 22. Lazy loading and tree shaking solve different problems
// ---------------------------------------------------------------------

const TreeShakingComparison: FC = (): ReactElement => {
  return (
    <section>
      <p>Tree shaking: removes unused code when safely possible.</p>
      <p>Lazy loading: defers when selected code is loaded.</p>
    </section>
  );
};

// Tree shaking affects what code remains in generated output.
// Lazy loading affects when a selected portion of that output is requested.

// ---------------------------------------------------------------------
// 23. Lazy loading and minification solve different problems
// ---------------------------------------------------------------------

const MinificationComparison: FC = (): ReactElement => {
  return (
    <section>
      <p>Minification: reduces the representation size of generated code.</p>
      <p>Lazy loading: changes the loading boundary.</p>
    </section>
  );
};

// Minification reduces the number of bytes needed to represent code.
// Lazy loading determines whether those bytes are requested immediately or later.

// ---------------------------------------------------------------------
// 24. Lazy loading is not the same as memoization
// ---------------------------------------------------------------------

const LazyLoadingVsMemoization: FC = (): ReactElement => {
  return (
    <section>
      <p>Lazy loading: controls when code or data is loaded.</p>
      <p>Memoization: reuses a previously computed value or function reference.</p>
    </section>
  );
};

// These techniques optimize different phases.
// Lazy loading primarily addresses delivery timing, while memoization primarily addresses repeated computation or identity.

// ---------------------------------------------------------------------
// 25. Lazy loading does not automatically improve runtime rendering
// ---------------------------------------------------------------------

const RuntimeCostExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Lazy-loaded feature: less initial code.</p>
      <p>Loaded feature: its rendering and execution still have a runtime cost.</p>
    </section>
  );
};

// Deferring a feature does not make the feature itself cheaper to execute.
// Once loaded, its JavaScript still consumes CPU and memory when it runs.

// ---------------------------------------------------------------------
// 26. Lazy loading does not replace virtualization
// ---------------------------------------------------------------------

const LazyLoadingVsVirtualization: FC = (): ReactElement => {
  return (
    <section>
      <p>Lazy loading: defer loading feature code.</p>
      <p>Virtualization: limit how many list items are mounted.</p>
    </section>
  );
};

// A large list may still contain expensive rendering work after its feature has been lazy loaded.
// Virtualization addresses the number of rendered items, not the timing of feature-code delivery.

// ---------------------------------------------------------------------
// 27. Lazy loading can defer memory usage
// ---------------------------------------------------------------------

interface MemoryUsage {
  readonly stage: string;
  readonly memory: number;
}

const memoryUsage: readonly MemoryUsage[] = [
  { stage: "Before feature load", memory: 80 },
  { stage: "After feature load", memory: 135 },
];

const MemoryExample: FC = (): ReactElement => {
  return (
    <ul>
      {memoryUsage.map((stage) => (
        <li key={stage.stage}>
          {stage.stage}: {stage.memory} MB
        </li>
      ))}
    </ul>
  );
};

// Deferring a module can also defer the memory required by its loaded JavaScript and data structures.
// The actual memory effect depends on what the feature allocates after loading.

// ---------------------------------------------------------------------
// 28. Lazy loading can increase the number of chunks
// ---------------------------------------------------------------------

const ChunkCountExample: FC = (): ReactElement => {
  const chunks = ["main.js", "dashboard.js", "editor.js", "reports.js"];

  return (
    <ul>
      {chunks.map((chunk) => (
        <li key={chunk}>{chunk}</li>
      ))}
    </ul>
  );
};

// More lazy boundaries generally produce more independently loaded assets.
// Excessive fragmentation can introduce unnecessary requests and loading coordination.

// ---------------------------------------------------------------------
// 29. Avoid lazy loading very small, frequently used components
// ---------------------------------------------------------------------

interface ComponentCost {
  readonly name: string;
  readonly size: number;
  readonly usage: string;
}

const componentCosts: readonly ComponentCost[] = [
  { name: "Primary button", size: 2, usage: "Used everywhere" },
  { name: "Editor", size: 220, usage: "Used occasionally" },
  { name: "Report builder", size: 240, usage: "Used rarely" },
];

const LazyBoundarySelection: FC = (): ReactElement => {
  return (
    <ul>
      {componentCosts.map((component) => (
        <li key={component.name}>
          {component.name}: {component.size} KB — {component.usage}
        </li>
      ))}
    </ul>
  );
};

// A tiny component that is required immediately is generally not a useful lazy-loading boundary.
// Large or infrequently used features are more natural candidates, subject to measurement.

// ---------------------------------------------------------------------
// 30. Loading boundaries should match meaningful application boundaries
// ---------------------------------------------------------------------

const MeaningfulBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Dashboard</h2>

      <Suspense fallback={<p>Loading analytics...</p>}>
        <section>
          <h3>Analytics</h3>
          <p>Analytics content</p>
        </section>
      </Suspense>
    </section>
  );
};

// A loading boundary should correspond to a meaningful part of the user interface.
// This makes the fallback understandable and prevents unrelated UI from disappearing unnecessarily.

// ---------------------------------------------------------------------
// 31. Failed lazy loading requires an error strategy
// ---------------------------------------------------------------------

const LoadingFailureExample: FC = (): ReactElement => {
  const [status, setStatus] = useState("Ready");

  const loadFeature = async (): Promise<void> => {
    try {
      await Promise.resolve();
      setStatus("Feature ready");
    } catch {
      setStatus("Feature failed to load");
    }
  };

  return (
    <section>
      <p>{status}</p>

      <button type="button" onClick={() => void loadFeature()}>
        Load feature
      </button>
    </section>
  );
};

// A lazy-loaded chunk can fail because of network errors, deployment changes, cache inconsistencies,
// or other runtime conditions. Important features should have an appropriate recovery strategy.

// ---------------------------------------------------------------------
// 32. Error boundaries and Suspense solve different problems
// ---------------------------------------------------------------------

const BoundaryResponsibilities: FC = (): ReactElement => {
  return (
    <section>
      <p>Suspense: waiting for suspended content.</p>
      <p>Error Boundary: handling rendering errors.</p>
    </section>
  );
};

// Suspense is not a replacement for error handling.
// A robust application can use both loading and error boundaries around asynchronous features.

// ---------------------------------------------------------------------
// 33. Measure lazy-loading behavior in the browser
// ---------------------------------------------------------------------

const LoadingMeasurementExample: FC = (): ReactElement => {
  const resources = performance.getEntriesByType("resource");

  return (
    <section>
      <p>Observed resource entries: {resources.length}</p>
      <p>Network tools can reveal when lazy chunks are requested.</p>
    </section>
  );
};

// Bundle analysis shows generated chunk sizes.
// Browser Network and Performance tools can show when those chunks are requested, transferred, evaluated, and cached.

// ---------------------------------------------------------------------
// 34. Measure cold and warm loading separately
// ---------------------------------------------------------------------

interface LoadScenario {
  readonly scenario: string;
  readonly transferred: number;
}

const loadScenarios: readonly LoadScenario[] = [
  { scenario: "Cold cache", transferred: 220 },
  { scenario: "Warm cache", transferred: 0 },
];

const CacheMeasurementExample: FC = (): ReactElement => {
  return (
    <ul>
      {loadScenarios.map((scenario) => (
        <li key={scenario.scenario}>
          {scenario.scenario}: {scenario.transferred} KB transferred
        </li>
      ))}
    </ul>
  );
};

// A lazy chunk may be expensive on its first request but inexpensive on later requests when cached.
// Performance testing should account for cache state when it affects the scenario being measured.

// ---------------------------------------------------------------------
// 35. Compare initial and deferred costs
// ---------------------------------------------------------------------

interface LoadingSnapshot {
  readonly version: string;
  readonly initial: number;
  readonly deferred: number;
}

const loadingSnapshots: readonly LoadingSnapshot[] = [
  { version: "Before lazy loading", initial: 560, deferred: 0 },
  { version: "After lazy loading", initial: 340, deferred: 220 },
];

const BeforeAfterExample: FC = (): ReactElement => {
  return (
    <ul>
      {loadingSnapshots.map((snapshot) => (
        <li key={snapshot.version}>
          {snapshot.version}: initial {snapshot.initial} KB / deferred {snapshot.deferred} KB
        </li>
      ))}
    </ul>
  );
};

// A useful before-and-after comparison shows where the bytes moved.
// A lower initial size does not by itself prove that the complete user experience became faster.

// ---------------------------------------------------------------------
// 36. Use real feature usage to choose boundaries
// ---------------------------------------------------------------------

interface UsagePattern {
  readonly feature: string;
  readonly usage: string;
}

const usagePatterns: readonly UsagePattern[] = [
  { feature: "Dashboard", usage: "Every session" },
  { feature: "Editor", usage: "Occasional" },
  { feature: "Advanced reports", usage: "Rare" },
];

const UsageBasedSelection: FC = (): ReactElement => {
  return (
    <ul>
      {usagePatterns.map((pattern) => (
        <li key={pattern.feature}>
          {pattern.feature}: {pattern.usage}
        </li>
      ))}
    </ul>
  );
};

// Actual feature usage helps determine whether deferring a feature is useful.
// A feature that nearly every user needs immediately may provide little benefit from being loaded only after interaction.

// ---------------------------------------------------------------------
// 37. Avoid delaying critical application code
// ---------------------------------------------------------------------

const CriticalCodeExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Application shell: required immediately.</p>
      <p>Primary navigation: required immediately.</p>
      <p>Rare advanced editor: candidate for lazy loading.</p>
    </section>
  );
};

// Code required for the first meaningful experience should generally not be delayed unnecessarily.
// Lazy loading is most useful for code outside the critical initial path.

// ---------------------------------------------------------------------
// 38. Integrated lazy-loading example
// ---------------------------------------------------------------------

const LazyLoadingDemo: FC = (): ReactElement => {
  const [feature, setFeature] = useState<"none" | "dashboard" | "editor">("none");

  return (
    <main>
      <h1>Lazy Loading</h1>

      <section>
        <p>
          Features can be deferred until the user requests them. Suspense provides fallback UI while lazy content is
          waiting.
        </p>

        <button type="button" onClick={() => setFeature("dashboard")}>
          Open dashboard
        </button>

        <button type="button" onClick={() => setFeature("editor")}>
          Open editor
        </button>
      </section>

      <Suspense fallback={<p>Loading feature...</p>}>
        {feature === "dashboard" && (
          <section>
            <h2>Dashboard</h2>
            <p>Dashboard content is displayed here.</p>
          </section>
        )}

        {feature === "editor" && (
          <section>
            <h2>Editor</h2>
            <p>Editor content is displayed here.</p>
          </section>
        )}
      </Suspense>
    </main>
  );
};

export default LazyLoadingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Lazy loading defers loading code or other resources until they are needed.
// - Dynamic `import()` provides an asynchronous module-loading mechanism that bundlers can use for code splitting.
// - React.lazy integrates dynamically imported component modules with React rendering.
// - Suspense provides fallback UI while Suspense-enabled content is waiting.
// - Lazy component definitions should normally be declared at module scope for stable component identity.
// - User interaction, route changes, and feature activation are common lazy-loading boundaries.
// - Large or infrequently used features are common candidates for lazy loading.
// - Lazy loading can reduce initial JavaScript without necessarily reducing total application JavaScript.
// - Deferred code still incurs network, parsing, evaluation, rendering, and memory costs when it is eventually loaded.
// - Loading a feature on demand can introduce interaction latency if its chunk is not already available.
// - Preloading and prefetching can begin resource loading before a feature is rendered, but they have different purposes and priorities.
// - Lazy-loaded chunks can benefit from browser caching and content-hashed asset names.
// - Shared dependencies influence how lazy chunks are composed by the bundler.
// - Tree shaking removes unused code, while lazy loading changes when selected code is requested.
// - Minification reduces generated-code size, while lazy loading changes loading boundaries.
// - Lazy loading is different from memoization and virtualization because those techniques address different performance costs.
// - Excessive lazy boundaries can create unnecessary chunks and loading coordination.
// - Loading boundaries should correspond to meaningful UI regions and provide understandable fallback states.
// - Suspense and Error Boundaries address different failure and loading concerns.
// - Browser Network and Performance tools can verify when lazy chunks are actually requested and transferred.
// - Cold-cache and warm-cache measurements can produce substantially different loading behavior.
// - Critical application code should not be delayed merely to increase the number of lazy-loaded modules.
// - Lazy-loading decisions should be based on actual feature size, usage patterns, loading behavior, and measured user-facing performance.
