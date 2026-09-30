/**
 * Code Splitting
 * ==============
 *
 * Code splitting divides an application's JavaScript into separately loaded chunks instead of delivering
 * all application code in the initial bundle. It can reduce the amount of JavaScript required for the
 * initial experience by loading feature-specific code only when that code is needed.
 */

import { lazy, Suspense, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Code splitting changes when code is loaded
// ---------------------------------------------------------------------

const CodeSplittingConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Initial code: application code required immediately.</p>
      <p>Async code: feature code loaded when needed.</p>
    </section>
  );
};

// Without code splitting, application code can be included in the initial JavaScript.
// With code splitting, selected modules can become separately loaded chunks.

// ---------------------------------------------------------------------
// 2. Static imports are part of the initial dependency graph
// ---------------------------------------------------------------------

const StaticImportConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>This component is represented by the current module.</p>
      <p>Static imports are known during the build.</p>
    </section>
  );
};

// A static import such as `import {Editor} from "./Editor"` creates a normal module dependency.
// Depending on the build, that dependency can become part of the same initial chunk or another statically determined chunk.

// ---------------------------------------------------------------------
// 3. Dynamic import creates an asynchronous module boundary
// ---------------------------------------------------------------------

const DynamicImportConcept: FC = (): ReactElement => {
  const [status, setStatus] = useState("Feature not loaded");

  const loadFeature = (): void => {
    setStatus("Loading feature...");

    void import("./feature-module").then(() => {
      setStatus("Feature module loaded");
    });
  };

  return (
    <section>
      <p>{status}</p>

      <button type="button" onClick={loadFeature}>
        Load feature
      </button>
    </section>
  );
};

// `import()` returns a Promise for the requested module.
// Bundlers can use this dynamic import as a boundary for creating an asynchronously loaded chunk.
// The referenced module must exist in the actual application for this example to compile and run.

// ---------------------------------------------------------------------
// 4. Dynamic imports are asynchronous
// ---------------------------------------------------------------------

const AsyncImportConcept: FC = (): ReactElement => {
  const [status, setStatus] = useState("Waiting");

  const loadModule = async (): Promise<void> => {
    setStatus("Loading...");

    await Promise.resolve();

    setStatus("Loaded");
  };

  return (
    <section>
      <p>{status}</p>

      <button type="button" onClick={() => void loadModule()}>
        Load module
      </button>
    </section>
  );
};

// Dynamic imports resolve asynchronously.
// The application must therefore account for the loading state before the module becomes available.

// ---------------------------------------------------------------------
// 5. React.lazy integrates dynamic imports with components
// ---------------------------------------------------------------------

const LazyComponentConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>React.lazy can represent a component loaded through a dynamic import.</p>
      <p>The imported module must provide the component as its default export.</p>
    </section>
  );
};

// The common pattern is:
// const LazyComponent = lazy(() => import("./Feature"));
// React.lazy expects the Promise to resolve to a module whose default export is a component.

// ---------------------------------------------------------------------
// 6. React.lazy and Suspense work together
// ---------------------------------------------------------------------

const LazyLoadingPattern: FC = (): ReactElement => {
  const [showFeature, setShowFeature] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setShowFeature((value) => !value)}>
        {showFeature ? "Hide" : "Show"} feature
      </button>

      {showFeature && (
        <Suspense fallback={<p>Loading feature...</p>}>
          <p>Lazy feature would render here.</p>
        </Suspense>
      )}
    </section>
  );
};

// Suspense provides a fallback while a Suspense-enabled child is waiting for something,
// including a lazy component whose module has not finished loading.

// ---------------------------------------------------------------------
// 7. Lazy components should normally be declared outside components
// ---------------------------------------------------------------------

const LazyDeclarationConcept: FC = (): ReactElement => {
  return <p>Lazy component definitions should have stable component identity.</p>;
};

// Declaring `lazy(() => import(...))` inside a component creates a new lazy component type on every render.
// Define lazy components at module scope so their identity remains stable.

// ---------------------------------------------------------------------
// 8. Route-level code splitting
// ---------------------------------------------------------------------

interface Route {
  readonly path: string;
  readonly chunk: string;
}

const routes: readonly Route[] = [
  { path: "/", chunk: "home" },
  { path: "/dashboard", chunk: "dashboard" },
  { path: "/settings", chunk: "settings" },
  { path: "/editor", chunk: "editor" },
];

const RouteSplittingConcept: FC = (): ReactElement => {
  return (
    <ul>
      {routes.map((route) => (
        <li key={route.path}>
          {route.path} → {route.chunk} chunk
        </li>
      ))}
    </ul>
  );
};

// Route-level splitting keeps feature-specific route code out of the initial JavaScript when it is not needed.
// Routing libraries and frameworks commonly provide abstractions for this pattern.

// ---------------------------------------------------------------------
// 9. Feature-level code splitting
// ---------------------------------------------------------------------

const FeatureSplittingConcept: FC = (): ReactElement => {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setShowEditor((value) => !value)}>
        {showEditor ? "Close" : "Open"} editor
      </button>

      {showEditor && <p>An editor module can be loaded when the editor feature is opened.</p>}
    </section>
  );
};

// Code splitting does not have to follow routes.
// Large features such as editors, charts, reports, or administrative tools can also be loaded on demand.

// ---------------------------------------------------------------------
// 10. Initial JavaScript can be reduced by moving feature code out
// ---------------------------------------------------------------------

interface Chunk {
  readonly name: string;
  readonly size: number;
}

const chunks: readonly Chunk[] = [
  { name: "main", size: 320 },
  { name: "dashboard", size: 140 },
  { name: "editor", size: 220 },
  { name: "reports", size: 180 },
];

const InitialChunkConcept: FC = (): ReactElement => {
  const initialChunk = chunks.find((chunk) => chunk.name === "main");

  return (
    <section>
      <p>Initial chunk: {initialChunk?.size ?? 0} KB</p>
      <p>Feature chunks are loaded separately when required.</p>
    </section>
  );
};

// Moving feature-specific code into asynchronous chunks can reduce initial JavaScript.
// It does not necessarily reduce the total amount of JavaScript the application may eventually download.

// ---------------------------------------------------------------------
// 11. Code splitting does not remove code
// ---------------------------------------------------------------------

const TotalCodeConcept: FC = (): ReactElement => {
  const initialSize = 320;
  const asynchronousSize = 540;

  return (
    <section>
      <p>Initial JavaScript: {initialSize} KB</p>
      <p>Potential asynchronous JavaScript: {asynchronousSize} KB</p>
      <p>Total generated JavaScript: {initialSize + asynchronousSize} KB</p>
    </section>
  );
};

// Code splitting changes delivery timing and chunk boundaries.
// The total generated code can remain the same or even increase slightly because of additional chunk/runtime overhead.

// ---------------------------------------------------------------------
// 12. Chunk boundaries can create additional requests
// ---------------------------------------------------------------------

const RequestCountConcept: FC = (): ReactElement => {
  const requests = ["main.js", "dashboard.js", "editor.js"];

  return (
    <ul>
      {requests.map((request) => (
        <li key={request}>{request}</li>
      ))}
    </ul>
  );
};

// More chunks can mean more network requests.
// HTTP/2 and HTTP/3 reduce the cost of many concurrent requests, but request overhead and loading coordination still matter.

// ---------------------------------------------------------------------
// 13. Avoid splitting tiny modules indiscriminately
// ---------------------------------------------------------------------

interface FeatureCost {
  readonly feature: string;
  readonly size: number;
  readonly usage: string;
}

const featureCosts: readonly FeatureCost[] = [
  { feature: "Settings", size: 8, usage: "Frequently visited" },
  { feature: "Editor", size: 220, usage: "Rarely visited" },
  { feature: "Help panel", size: 6, usage: "Occasionally opened" },
];

const SplittingGranularityConcept: FC = (): ReactElement => {
  return (
    <ul>
      {featureCosts.map((feature) => (
        <li key={feature.feature}>
          {feature.feature}: {feature.size} KB — {feature.usage}
        </li>
      ))}
    </ul>
  );
};

// Splitting every small component can add complexity without meaningful savings.
// The useful boundary is usually a meaningful amount of code associated with a feature or loading boundary.

// ---------------------------------------------------------------------
// 14. Large features are common code-splitting candidates
// ---------------------------------------------------------------------

const LargeFeatureConcept: FC = (): ReactElement => {
  const candidates = ["Rich-text editor", "Interactive charting", "Report builder", "Advanced administration"];

  return (
    <ul>
      {candidates.map((candidate) => (
        <li key={candidate}>{candidate}</li>
      ))}
    </ul>
  );
};

// Feature size alone does not determine whether it should be split.
// Usage frequency, loading importance, caching, and interaction behavior should also be considered.

// ---------------------------------------------------------------------
// 15. User interaction can trigger a dynamic import
// ---------------------------------------------------------------------

const InteractionDrivenLoading: FC = (): ReactElement => {
  const [status, setStatus] = useState("Feature is not loaded");

  const handleOpen = async (): Promise<void> => {
    setStatus("Loading...");

    await Promise.resolve();

    setStatus("Feature is ready");
  };

  return (
    <section>
      <p>{status}</p>

      <button type="button" onClick={() => void handleOpen()}>
        Open feature
      </button>
    </section>
  );
};

// Loading can begin in response to an interaction.
// In a real application, the interaction handler could call a dynamic import and then render the loaded feature.

// ---------------------------------------------------------------------
// 16. Preloading can start work before the feature is rendered
// ---------------------------------------------------------------------

const PreloadConcept: FC = (): ReactElement => {
  const [status, setStatus] = useState("Feature has not been requested");

  const preloadFeature = (): void => {
    setStatus("Feature preload requested");
  };

  const openFeature = (): void => {
    setStatus("Feature opened");
  };

  return (
    <section>
      <p>{status}</p>

      <button type="button" onMouseEnter={preloadFeature}>
        Prepare feature
      </button>

      <button type="button" onClick={openFeature}>
        Open feature
      </button>
    </section>
  );
};

// A real application can initiate a dynamic import before the user actually opens a feature.
// Preloading can reduce later waiting time when there is a reasonable signal that the feature will be needed.

// ---------------------------------------------------------------------
// 17. Prefetching and preloading have different purposes
// ---------------------------------------------------------------------

const ResourceHintConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Preload: prioritize a resource needed soon.</p>
      <p>Prefetch: fetch a resource that may be needed later.</p>
    </section>
  );
};

// Resource hints communicate different loading priorities to the browser.
// The appropriate strategy depends on how certain and how urgent the future resource need is.

// ---------------------------------------------------------------------
// 18. Suspense provides a loading boundary
// ---------------------------------------------------------------------

const SuspenseBoundaryConcept: FC = (): ReactElement => {
  return (
    <Suspense fallback={<p>Loading content...</p>}>
      <section>
        <h2>Feature content</h2>
        <p>This content is inside a Suspense boundary.</p>
      </section>
    </Suspense>
  );
};

// Suspense boundaries define what React can replace with fallback UI while suspended content is unavailable.
// A boundary should be placed where the loading experience makes sense for the user interface.

// ---------------------------------------------------------------------
// 19. Nested Suspense boundaries provide more granular loading
// ---------------------------------------------------------------------

const NestedSuspenseConcept: FC = (): ReactElement => {
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

// Nested boundaries allow different parts of the interface to reveal themselves independently.
// The correct boundary structure depends on the desired loading sequence and user experience.

// ---------------------------------------------------------------------
// 20. Code splitting can interact with error handling
// ---------------------------------------------------------------------

const LoadingFailureConcept: FC = (): ReactElement => {
  const [status, setStatus] = useState("Ready");

  const loadFeature = async (): Promise<void> => {
    try {
      await Promise.resolve();
      setStatus("Feature loaded");
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

// A dynamically loaded chunk can fail because of network failures, deployment changes, caching problems,
// or other runtime conditions. Applications should provide an appropriate recovery path for important features.

// ---------------------------------------------------------------------
// 21. Error boundaries handle rendering errors
// ---------------------------------------------------------------------

const ErrorBoundaryConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Suspense handles waiting.</p>
      <p>Error boundaries handle rendering errors.</p>
    </section>
  );
};

// Suspense fallback UI and Error Boundaries solve different problems.
// A loading boundary does not replace an Error Boundary for failed rendering or loading-related errors.

// ---------------------------------------------------------------------
// 22. Code splitting can improve cacheability
// ---------------------------------------------------------------------

interface Asset {
  readonly name: string;
  readonly version: string;
}

const cachedAssets: readonly Asset[] = [
  { name: "main.js", version: "a1b2c3" },
  { name: "editor.js", version: "d4e5f6" },
];

const CacheabilityConcept: FC = (): ReactElement => {
  return (
    <ul>
      {cachedAssets.map((asset) => (
        <li key={asset.name}>
          {asset.name}: {asset.version}
        </li>
      ))}
    </ul>
  );
};

// Separating relatively stable feature chunks from frequently changing application code can sometimes improve caching.
// Whether this happens depends on the build's chunking and content-hashing strategy.

// ---------------------------------------------------------------------
// 23. Shared dependencies affect chunk composition
// ---------------------------------------------------------------------

interface SharedDependency {
  readonly dependency: string;
  readonly chunks: readonly string[];
}

const sharedDependencies: readonly SharedDependency[] = [
  {
    dependency: "ui-library",
    chunks: ["dashboard", "settings", "editor"],
  },
  {
    dependency: "chart-library",
    chunks: ["dashboard", "reports"],
  },
];

const SharedChunkConcept: FC = (): ReactElement => {
  return (
    <ul>
      {sharedDependencies.map((dependency) => (
        <li key={dependency.dependency}>
          {dependency.dependency}: {dependency.chunks.join(", ")}
        </li>
      ))}
    </ul>
  );
};

// Multiple asynchronous features may depend on the same package.
// The bundler can place shared modules into common chunks depending on its optimization strategy.

// ---------------------------------------------------------------------
// 24. Chunk duplication is not always obvious
// ---------------------------------------------------------------------

const ChunkDuplicationConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Dashboard chunk → shared dependency</p>
      <p>Editor chunk → shared dependency</p>
      <p>Reports chunk → shared dependency</p>
    </section>
  );
};

// Seeing a dependency associated with multiple chunks does not by itself prove that the dependency
// is duplicated in the final output. Inspect the generated assets and module graph.

// ---------------------------------------------------------------------
// 25. Analyze generated chunks instead of source imports alone
// ---------------------------------------------------------------------

interface BundleModule {
  readonly module: string;
  readonly chunk: string;
  readonly size: number;
}

const bundleModules: readonly BundleModule[] = [
  { module: "application code", chunk: "main", size: 180 },
  { module: "ui-library", chunk: "shared", size: 120 },
  { module: "editor-library", chunk: "editor", size: 210 },
  { module: "chart-library", chunk: "dashboard", size: 140 },
];

const GeneratedChunkAnalysis: FC = (): ReactElement => {
  return (
    <ul>
      {bundleModules.map((module) => (
        <li key={`${module.chunk}-${module.module}`}>
          {module.chunk}: {module.module} — {module.size} KB
        </li>
      ))}
    </ul>
  );
};

// Source structure does not always map one-to-one to generated chunks.
// Bundle analyzers show the result of module resolution, optimization, tree shaking, and chunking.

// ---------------------------------------------------------------------
// 26. Tree shaking and code splitting solve different problems
// ---------------------------------------------------------------------

const TreeShakingVsSplitting: FC = (): ReactElement => {
  return (
    <section>
      <p>Tree shaking: remove code that is not needed.</p>
      <p>Code splitting: separate code into independently loaded chunks.</p>
    </section>
  );
};

// Tree shaking can reduce how much code exists in a generated chunk.
// Code splitting can reduce how much code is loaded at a particular point in the application.

// ---------------------------------------------------------------------
// 27. Minification and code splitting solve different problems
// ---------------------------------------------------------------------

const MinificationVsSplitting: FC = (): ReactElement => {
  return (
    <section>
      <p>Minification: reduce representation size.</p>
      <p>Code splitting: change loading boundaries.</p>
    </section>
  );
};

// Minification reduces the size of generated code.
// Code splitting changes when portions of that code are requested.

// ---------------------------------------------------------------------
// 28. Code splitting can shift cost to later interactions
// ---------------------------------------------------------------------

const DeferredCostConcept: FC = (): ReactElement => {
  const [opened, setOpened] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setOpened((value) => !value)}>
        {opened ? "Close" : "Open"} advanced feature
      </button>

      {opened && <p>The feature's JavaScript can be requested at interaction time.</p>}
    </section>
  );
};

// Code splitting does not eliminate execution and network costs.
// It can move those costs from the initial load to the moment the feature is actually requested.

// ---------------------------------------------------------------------
// 29. Interaction latency matters for on-demand loading
// ---------------------------------------------------------------------

const InteractionLatencyConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Click</p>
      <p>Request asynchronous chunk</p>
      <p>Download and evaluate JavaScript</p>
      <p>Render feature</p>
    </section>
  );
};

// A feature loaded only after a click may introduce a visible delay.
// Loading strategy should therefore consider both initial-load savings and the latency of the later interaction.

// ---------------------------------------------------------------------
// 30. The browser may already have an asynchronous chunk cached
// ---------------------------------------------------------------------

const CachedChunkConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>First visit: download feature chunk.</p>
      <p>Later visit: cached feature chunk may be reused.</p>
    </section>
  );
};

// Cache state changes the cost of loading a chunk.
// Performance measurements should distinguish cold-cache and warm-cache scenarios when that distinction matters.

// ---------------------------------------------------------------------
// 31. Avoid creating excessive loading boundaries
// ---------------------------------------------------------------------

const BoundaryGranularityConcept: FC = (): ReactElement => {
  return (
    <section>
      <h2>Page</h2>

      <Suspense fallback={<p>Loading section...</p>}>
        <p>Section content</p>
      </Suspense>

      <Suspense fallback={<p>Loading another section...</p>}>
        <p>Another section</p>
      </Suspense>
    </section>
  );
};

// More boundaries provide more granular loading behavior but can also make the loading experience fragmented.
// Boundary placement should reflect meaningful UI regions rather than an arbitrary component hierarchy.

// ---------------------------------------------------------------------
// 32. Code splitting does not automatically improve every application
// ---------------------------------------------------------------------

const SplittingTradeoffs: FC = (): ReactElement => {
  return (
    <ul>
      <li>Initial JavaScript size</li>
      <li>Number of asynchronous chunks</li>
      <li>Chunk request latency</li>
      <li>Cacheability</li>
      <li>Feature usage frequency</li>
      <li>Loading experience</li>
    </ul>
  );
};

// Code splitting is a delivery optimization with tradeoffs.
// Its effect should be evaluated using the application's actual loading and interaction measurements.

// ---------------------------------------------------------------------
// 33. Framework routing can provide higher-level splitting
// ---------------------------------------------------------------------

const FrameworkSplittingConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Framework router</p>
      <p>Route module</p>
      <p>Generated route chunk</p>
    </section>
  );
};

// Frameworks can automatically create or manage route-level loading boundaries and chunks.
// The exact behavior depends on the framework and its build system.

// ---------------------------------------------------------------------
// 34. Measure the initial bundle
// ---------------------------------------------------------------------

const InitialBundleMeasurement: FC = (): ReactElement => {
  const initialBundleSize = 320;

  return (
    <section>
      <p>Initial JavaScript: {initialBundleSize} KB</p>
      <p>Measure the production build rather than relying on source-file size.</p>
    </section>
  );
};

// Initial bundle size is useful for understanding how much JavaScript is delivered for the first experience.
// It should be measured from the generated production assets.

// ---------------------------------------------------------------------
// 35. Measure asynchronous chunks separately
// ---------------------------------------------------------------------

const AsyncChunkMeasurement: FC = (): ReactElement => {
  const asynchronousChunks = [
    { name: "dashboard.js", size: 140 },
    { name: "editor.js", size: 220 },
    { name: "reports.js", size: 180 },
  ];

  return (
    <ul>
      {asynchronousChunks.map((chunk) => (
        <li key={chunk.name}>
          {chunk.name}: {chunk.size} KB
        </li>
      ))}
    </ul>
  );
};

// A large asynchronous chunk may still matter if users frequently load the feature.
// Analyze individual chunks instead of looking only at the initial bundle.

// ---------------------------------------------------------------------
// 36. Use network tools to verify actual delivery
// ---------------------------------------------------------------------

const NetworkVerification: FC = (): ReactElement => {
  const resources = performance.getEntriesByType("resource");

  return (
    <section>
      <p>Observed resource entries: {resources.length}</p>
      <p>Browser tools can reveal actual requests and transfer timing.</p>
    </section>
  );
};

// Generated chunk sizes describe build output.
// Browser Network tools show what was actually requested, transferred, cached, and timed during a real load.

// ---------------------------------------------------------------------
// 37. Use production builds for meaningful bundle measurements
// ---------------------------------------------------------------------

const ProductionMeasurement: FC = (): ReactElement => {
  return (
    <section>
      <p>Development build: optimized differently.</p>
      <p>Production build: representative of deployed assets.</p>
    </section>
  );
};

// Development tooling often includes debugging information and transformations that do not represent production delivery.
// Bundle-size decisions should generally use the production build.

// ---------------------------------------------------------------------
// 38. Compare before and after a splitting change
// ---------------------------------------------------------------------

interface BundleSnapshot {
  readonly version: string;
  readonly initialSize: number;
  readonly totalSize: number;
}

const bundleSnapshots: readonly BundleSnapshot[] = [
  { version: "Before", initialSize: 560, totalSize: 560 },
  { version: "After", initialSize: 340, totalSize: 575 },
];

const BeforeAfterComparison: FC = (): ReactElement => {
  return (
    <ul>
      {bundleSnapshots.map((snapshot) => (
        <li key={snapshot.version}>
          {snapshot.version}: initial {snapshot.initialSize} KB / total {snapshot.totalSize} KB
        </li>
      ))}
    </ul>
  );
};

// A splitting change can reduce initial JavaScript while increasing total generated or eventually loaded JavaScript.
// Compare both initial and total costs rather than assuming that one metric tells the complete story.

// ---------------------------------------------------------------------
// 39. Integrated code-splitting workflow
// ---------------------------------------------------------------------

const CodeSplittingDemo: FC = (): ReactElement => {
  const [feature, setFeature] = useState<"none" | "dashboard" | "editor">("none");

  const openDashboard = (): void => {
    setFeature("dashboard");
  };

  const openEditor = (): void => {
    setFeature("editor");
  };

  return (
    <main>
      <h1>Code Splitting</h1>

      <section>
        <p>
          Initial code contains the application shell. Feature-specific code can be loaded asynchronously when required.
        </p>

        <button type="button" onClick={openDashboard}>
          Open dashboard
        </button>

        <button type="button" onClick={openEditor}>
          Open editor
        </button>
      </section>

      <Suspense fallback={<p>Loading feature...</p>}>
        {feature === "dashboard" && (
          <section>
            <h2>Dashboard</h2>
            <p>In a real application, this feature could be provided by a dynamically imported module.</p>
          </section>
        )}

        {feature === "editor" && (
          <section>
            <h2>Editor</h2>
            <p>In a real application, this feature could be provided by a separate asynchronously loaded chunk.</p>
          </section>
        )}
      </Suspense>
    </main>
  );
};

export default CodeSplittingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Code splitting divides application code into separately loaded chunks.
// - Dynamic import creates an asynchronous module boundary that bundlers can use for chunking.
// - React.lazy integrates dynamic imports with component rendering.
// - Suspense provides fallback UI while Suspense-enabled content is waiting.
// - Lazy component definitions should normally be created outside components so their identity remains stable.
// - Route-level splitting can keep feature-specific routes out of the initial JavaScript.
// - Feature-level splitting can defer large functionality such as editors, reports, charts, or administration tools.
// - Code splitting changes when code is loaded; it does not automatically remove code from the application.
// - Reducing initial JavaScript can increase later interaction cost when a feature must be downloaded on demand.
// - Additional chunks can introduce additional network requests and loading coordination.
// - Splitting every small module can add complexity without producing meaningful savings.
// - Large, infrequently needed features are common candidates for asynchronous loading.
// - Preloading or prefetching can begin loading before a feature is actually rendered when there is a useful signal.
// - Suspense boundaries determine where loading fallback UI can appear.
// - Error boundaries solve a different problem from Suspense and can handle rendering failures.
// - Shared dependencies influence how asynchronous chunks are composed and whether common chunks are generated.
// - Tree shaking removes unused code, while code splitting changes loading boundaries.
// - Minification reduces representation size, while code splitting changes when code is requested.
// - Code splitting can improve cacheability when stable code is separated into independently cacheable assets.
// - Initial bundle size and asynchronous chunk size should be measured separately.
// - Browser Network tools verify what assets are actually requested, transferred, and cached.
// - Production builds provide more meaningful bundle measurements than development builds.
// - Before-and-after comparisons should consider initial size, asynchronous size, total size, loading latency, and actual feature usage.
