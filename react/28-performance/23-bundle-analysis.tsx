/**
 * Bundle Analysis
 * ===============
 *
 * Bundle analysis examines the JavaScript and other assets produced by a build to understand their
 * size, composition, duplication, and dependency relationships. It helps identify large dependencies,
 * duplicated modules, oversized chunks, and opportunities for code splitting or dependency replacement.
 */

import { useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What a bundle contains
// ---------------------------------------------------------------------

interface BundleModule {
  readonly name: string;
  readonly size: number;
  readonly category: "application" | "dependency";
}

const bundleModules: readonly BundleModule[] = [
  { name: "Application code", size: 180, category: "application" },
  { name: "UI library", size: 120, category: "dependency" },
  { name: "Date library", size: 95, category: "dependency" },
  { name: "Utility library", size: 70, category: "dependency" },
  { name: "Application styles", size: 35, category: "application" },
];

// A production bundle is the result of processing application source and its dependencies.
// The exact structure depends on the bundler, framework, configuration, and optimization settings.

// ---------------------------------------------------------------------
// 2. Bundle size is not the same as source-file size
// ---------------------------------------------------------------------

const BundleSizeExample: FC = (): ReactElement => {
  const sourceSize = 600;
  const bundledSize = 420;
  const compressedSize = 130;

  return (
    <section>
      <p>Source modules: {sourceSize} KB</p>
      <p>Generated bundle: {bundledSize} KB</p>
      <p>Compressed transfer size: {compressedSize} KB</p>
    </section>
  );
};

// Source modules can be transformed, combined, removed, and compressed during a production build.
// Analysis should therefore focus on generated build artifacts rather than only source-file sizes.

// ---------------------------------------------------------------------
// 3. Analyze generated chunks
// ---------------------------------------------------------------------

interface Chunk {
  readonly name: string;
  readonly size: number;
}

const chunks: readonly Chunk[] = [
  { name: "main", size: 420 },
  { name: "dashboard", size: 180 },
  { name: "settings", size: 90 },
  { name: "editor", size: 240 },
];

const ChunkSizeExample: FC = (): ReactElement => {
  return (
    <ul>
      {chunks.map((chunk) => (
        <li key={chunk.name}>
          {chunk.name}: {chunk.size} KB
        </li>
      ))}
    </ul>
  );
};

// A build can produce multiple chunks instead of one JavaScript file.
// Comparing chunk sizes helps identify which parts of an application contribute most to initial or later loads.

// ---------------------------------------------------------------------
// 4. Identify large dependencies
// ---------------------------------------------------------------------

const DependencySizeExample: FC = (): ReactElement => {
  const dependencies = bundleModules.filter((module) => module.category === "dependency");

  return (
    <ul>
      {dependencies.map((dependency) => (
        <li key={dependency.name}>
          {dependency.name}: {dependency.size} KB
        </li>
      ))}
    </ul>
  );
};

// Dependencies can contribute substantially to a bundle even when application source code is small.
// A bundle analyzer can expose which packages account for that weight.

// ---------------------------------------------------------------------
// 5. Large dependencies are not automatically problems
// ---------------------------------------------------------------------

interface Dependency {
  readonly name: string;
  readonly size: number;
  readonly reason: string;
}

const dependencyReasons: readonly Dependency[] = [
  {
    name: "Charting package",
    size: 150,
    reason: "Required for an interactive chart",
  },
  {
    name: "Editor package",
    size: 220,
    reason: "Required only by the document editor",
  },
];

const DependencyContextExample: FC = (): ReactElement => {
  return (
    <ul>
      {dependencyReasons.map((dependency) => (
        <li key={dependency.name}>
          {dependency.name}: {dependency.size} KB — {dependency.reason}
        </li>
      ))}
    </ul>
  );
};

// Size must be interpreted in context.
// A dependency that provides essential functionality may be justified, while another dependency may contain
// functionality that is rarely used or could be loaded only when needed.

// ---------------------------------------------------------------------
// 6. Inspect dependency composition
// ---------------------------------------------------------------------

interface PackageContribution {
  readonly packageName: string;
  readonly size: number;
}

const packageContributions: readonly PackageContribution[] = [
  { packageName: "application", size: 180 },
  { packageName: "ui-library", size: 120 },
  { packageName: "date-library", size: 95 },
  { packageName: "utility-library", size: 70 },
];

const PackageCompositionExample: FC = (): ReactElement => {
  const total = packageContributions.reduce((sum, packageInfo) => sum + packageInfo.size, 0);

  return (
    <section>
      <p>Total analyzed size: {total} KB</p>

      <ul>
        {packageContributions.map((packageInfo) => (
          <li key={packageInfo.packageName}>
            {packageInfo.packageName}: {packageInfo.size} KB
          </li>
        ))}
      </ul>
    </section>
  );
};

// Module-level analysis can show which packages contribute to a chunk.
// This is more actionable than knowing only the final chunk size.

// ---------------------------------------------------------------------
// 7. Tree shaking can remove unused exports
// ---------------------------------------------------------------------

interface ExportUsage {
  readonly exportName: string;
  readonly included: boolean;
}

const exports: readonly ExportUsage[] = [
  { exportName: "formatDate", included: true },
  { exportName: "parseDate", included: true },
  { exportName: "generateCalendar", included: false },
  { exportName: "createLocale", included: false },
];

const TreeShakingExample: FC = (): ReactElement => {
  const includedExports = exports.filter((item) => item.included);

  return (
    <ul>
      {includedExports.map((item) => (
        <li key={item.exportName}>{item.exportName}</li>
      ))}
    </ul>
  );
};

// Tree shaking can remove code that the final application does not use when the module format and build pipeline
// allow the bundler to determine that the code is safely removable.

// ---------------------------------------------------------------------
// 8. Module format affects tree shaking
// ---------------------------------------------------------------------

const ModuleFormatExample: FC = (): ReactElement => {
  return (
    <section>
      <p>ES modules provide static import/export structure.</p>
      <p>Static structure gives bundlers information useful for tree shaking.</p>
    </section>
  );
};

// Static ES module imports and exports give build tools analyzable dependency relationships.
// Whether code is actually removed depends on the module, package metadata, bundler, and code semantics.

// ---------------------------------------------------------------------
// 9. Side effects can limit removal
// ---------------------------------------------------------------------

const SideEffectExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Some modules execute code when imported.</p>
      <p>Such side effects can affect whether unused exports can safely be removed.</p>
    </section>
  );
};

// Bundlers must preserve observable module initialization behavior.
// Package metadata such as the sideEffects field can provide additional information to supported build tools.

// ---------------------------------------------------------------------
// 10. Detect duplicated dependencies
// ---------------------------------------------------------------------

interface DuplicateDependency {
  readonly name: string;
  readonly versions: readonly string[];
  readonly size: number;
}

const duplicatedDependencies: readonly DuplicateDependency[] = [
  {
    name: "utility-package",
    versions: ["2.1.0", "3.0.0"],
    size: 80,
  },
];

const DuplicateDependencyExample: FC = (): ReactElement => {
  return (
    <ul>
      {duplicatedDependencies.map((dependency) => (
        <li key={dependency.name}>
          {dependency.name}: {dependency.versions.join(" + ")} — {dependency.size} KB
        </li>
      ))}
    </ul>
  );
};

// Different versions of the same package can sometimes appear in the dependency graph.
// That can increase bundle size and may indicate an opportunity to deduplicate dependencies.

// ---------------------------------------------------------------------
// 11. Dependency duplication is a graph problem
// ---------------------------------------------------------------------

interface DependencyEdge {
  readonly importer: string;
  readonly imported: string;
}

const dependencyGraph: readonly DependencyEdge[] = [
  { importer: "App", imported: "ui-library" },
  { importer: "Dashboard", imported: "ui-library" },
  { importer: "Editor", imported: "editor-library" },
  { importer: "Editor", imported: "ui-library" },
];

const DependencyGraphExample: FC = (): ReactElement => {
  return (
    <ul>
      {dependencyGraph.map((edge, index) => (
        <li key={`${edge.importer}-${edge.imported}-${index}`}>
          {edge.importer} → {edge.imported}
        </li>
      ))}
    </ul>
  );
};

// Bundle analysis represents dependencies as a graph of modules and packages.
// Understanding the graph helps explain why a module appears in a particular chunk.

// ---------------------------------------------------------------------
// 12. Shared dependencies can belong in separate chunks
// ---------------------------------------------------------------------

const SharedChunkExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Dashboard → shared UI code</p>
      <p>Settings → shared UI code</p>
      <p>Editor → shared UI code</p>
    </section>
  );
};

// When multiple asynchronously loaded features depend on the same modules,
// a bundler can produce shared chunks depending on its chunking strategy.

// ---------------------------------------------------------------------
// 13. Initial JavaScript matters
// ---------------------------------------------------------------------

interface LoadingStage {
  readonly stage: string;
  readonly size: number;
}

const loadingStages: readonly LoadingStage[] = [
  { stage: "Initial chunk", size: 420 },
  { stage: "Dashboard chunk", size: 180 },
  { stage: "Editor chunk", size: 240 },
];

const InitialBundleExample: FC = (): ReactElement => {
  return (
    <ul>
      {loadingStages.map((stage) => (
        <li key={stage.stage}>
          {stage.stage}: {stage.size} KB
        </li>
      ))}
    </ul>
  );
};

// Initial JavaScript is relevant to the first application load.
// Code that is needed only for later interactions can potentially be moved out of the initial chunk.

// ---------------------------------------------------------------------
// 14. Code splitting changes when code is loaded
// ---------------------------------------------------------------------

const CodeSplittingExample: FC = (): ReactElement => {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setShowEditor((value) => !value)}>
        {showEditor ? "Hide" : "Open"} editor
      </button>

      {showEditor && <p>The editor feature can be loaded on demand.</p>}
    </section>
  );
};

// A dynamic import can create an asynchronously loaded chunk when supported by the build tool.
// The important performance distinction is that the feature's code does not have to be part of the initial JavaScript.

// ---------------------------------------------------------------------
// 15. React.lazy commonly participates in code splitting
// ---------------------------------------------------------------------

const LazyComponentExample: FC = (): ReactElement => {
  return (
    <section>
      <p>React.lazy can load a component from a dynamic import.</p>
      <p>The corresponding module can become an asynchronously loaded chunk.</p>
    </section>
  );
};

// React.lazy describes how React loads a component from a Promise-returning module import.
// The bundler determines how that import is represented in the generated build.

// ---------------------------------------------------------------------
// 16. Analyze route-level chunks
// ---------------------------------------------------------------------

interface RouteChunk {
  readonly route: string;
  readonly chunk: string;
  readonly size: number;
}

const routeChunks: readonly RouteChunk[] = [
  { route: "/", chunk: "home", size: 80 },
  { route: "/dashboard", chunk: "dashboard", size: 180 },
  { route: "/settings", chunk: "settings", size: 90 },
  { route: "/editor", chunk: "editor", size: 240 },
];

const RouteChunkExample: FC = (): ReactElement => {
  return (
    <ul>
      {routeChunks.map((route) => (
        <li key={route.route}>
          {route.route}: {route.chunk} ({route.size} KB)
        </li>
      ))}
    </ul>
  );
};

// Route-level splitting can keep feature-specific code out of the initial application chunk.
// The actual chunk boundaries depend on the application's imports and build configuration.

// ---------------------------------------------------------------------
// 17. Inspect asset sizes after compression
// ---------------------------------------------------------------------

interface AssetSize {
  readonly asset: string;
  readonly raw: number;
  readonly compressed: number;
}

const assetSizes: readonly AssetSize[] = [
  { asset: "main.js", raw: 420, compressed: 130 },
  { asset: "dashboard.js", raw: 180, compressed: 55 },
  { asset: "editor.js", raw: 240, compressed: 72 },
];

const CompressionExample: FC = (): ReactElement => {
  return (
    <ul>
      {assetSizes.map((asset) => (
        <li key={asset.asset}>
          {asset.asset}: {asset.raw} KB raw / {asset.compressed} KB compressed
        </li>
      ))}
    </ul>
  );
};

// Raw asset size and network transfer size are different measurements.
// Bundle analysis should make clear whether a displayed size is uncompressed, compressed, or another representation.

// ---------------------------------------------------------------------
// 18. Gzip and Brotli produce different transfer sizes
// ---------------------------------------------------------------------

interface CompressionResult {
  readonly asset: string;
  readonly gzip: number;
  readonly brotli: number;
}

const compressionResults: readonly CompressionResult[] = [
  { asset: "main.js", gzip: 130, brotli: 115 },
  { asset: "dashboard.js", gzip: 55, brotli: 49 },
];

const CompressionComparisonExample: FC = (): ReactElement => {
  return (
    <ul>
      {compressionResults.map((result) => (
        <li key={result.asset}>
          {result.asset}: gzip {result.gzip} KB / Brotli {result.brotli} KB
        </li>
      ))}
    </ul>
  );
};

// Compressed transfer size depends on the compression algorithm and server configuration.
// A bundle analyzer may report raw sizes while network tooling reports transferred sizes.

// ---------------------------------------------------------------------
// 19. Source maps help explain bundle composition
// ---------------------------------------------------------------------

const SourceMapExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Generated code: optimized production JavaScript</p>
      <p>Source map: mapping from generated code back to source modules</p>
    </section>
  );
};

// Source maps can associate generated bundle locations with original source files.
// They make bundle inspection more useful because a large generated section can be traced back to its source.

// ---------------------------------------------------------------------
// 20. Analyze the dependency tree, not only the final number
// ---------------------------------------------------------------------

const DependencyTreeExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>
        Application
        <ul>
          <li>
            Dashboard
            <ul>
              <li>Chart package</li>
              <li>UI package</li>
            </ul>
          </li>
          <li>
            Settings
            <ul>
              <li>UI package</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  );
};

// A total bundle size tells you how much code exists.
// The dependency tree explains why that code exists and which application paths cause it to be included.

// ---------------------------------------------------------------------
// 21. Look for dependencies loaded by only one feature
// ---------------------------------------------------------------------

const FeatureSpecificDependency: FC = (): ReactElement => {
  return (
    <section>
      <p>Editor → rich-text editor package</p>
      <p>Home → no editor dependency</p>
    </section>
  );
};

// A large dependency used by one rarely visited feature can be a candidate for asynchronous loading.
// This does not mean it should automatically be split; loading frequency and user experience also matter.

// ---------------------------------------------------------------------
// 22. Identify unexpectedly large transitive dependencies
// ---------------------------------------------------------------------

interface TransitiveDependency {
  readonly direct: string;
  readonly transitive: string;
  readonly size: number;
}

const transitiveDependencies: readonly TransitiveDependency[] = [
  {
    direct: "reporting-package",
    transitive: "formatting-package",
    size: 75,
  },
  {
    direct: "reporting-package",
    transitive: "locale-data",
    size: 90,
  },
];

const TransitiveDependencyExample: FC = (): ReactElement => {
  return (
    <ul>
      {transitiveDependencies.map((dependency) => (
        <li key={`${dependency.direct}-${dependency.transitive}`}>
          {dependency.direct} → {dependency.transitive}: {dependency.size} KB
        </li>
      ))}
    </ul>
  );
};

// A direct dependency can bring additional transitive dependencies into the build.
// Bundle analysis helps reveal costs that are not obvious from the application's direct imports.

// ---------------------------------------------------------------------
// 23. Analyze imported functionality
// ---------------------------------------------------------------------

interface ImportCost {
  readonly importPath: string;
  readonly size: number;
}

const importCosts: readonly ImportCost[] = [
  { importPath: "utility-package/small-function", size: 8 },
  { importPath: "utility-package/full-package", size: 70 },
];

const ImportCostExample: FC = (): ReactElement => {
  return (
    <ul>
      {importCosts.map((item) => (
        <li key={item.importPath}>
          {item.importPath}: {item.size} KB
        </li>
      ))}
    </ul>
  );
};

// Some package APIs allow importing a narrower module or named functionality.
// The actual effect depends on the package's module structure and how the bundler performs tree shaking.

// ---------------------------------------------------------------------
// 24. Bundle analysis can expose accidental imports
// ---------------------------------------------------------------------

const AccidentalImportExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Feature code</p>
      <p>Unexpected dependency: server-only utility</p>
    </section>
  );
};

// An analyzer can reveal a dependency that entered a client bundle unexpectedly.
// Investigating the import path can show which module introduced it.

// ---------------------------------------------------------------------
// 25. Duplicate code can appear across chunks
// ---------------------------------------------------------------------

interface ChunkDependency {
  readonly chunk: string;
  readonly dependency: string;
  readonly size: number;
}

const chunkDependencies: readonly ChunkDependency[] = [
  { chunk: "dashboard", dependency: "ui-library", size: 120 },
  { chunk: "settings", dependency: "ui-library", size: 120 },
  { chunk: "editor", dependency: "ui-library", size: 120 },
];

const SharedDependencyExample: FC = (): ReactElement => {
  return (
    <ul>
      {chunkDependencies.map((item) => (
        <li key={`${item.chunk}-${item.dependency}`}>
          {item.chunk} → {item.dependency}: {item.size} KB
        </li>
      ))}
    </ul>
  );
};

// Repeated dependency presence across chunks is not automatically duplication in the final output.
// A bundler can extract shared modules into common chunks, depending on its chunking strategy.

// ---------------------------------------------------------------------
// 26. Analyze after production optimization
// ---------------------------------------------------------------------

const ProductionBuildExample: FC = (): ReactElement => {
  const environments = ["development", "production"];

  return (
    <ul>
      {environments.map((environment) => (
        <li key={environment}>{environment} build</li>
      ))}
    </ul>
  );
};

// Production builds commonly apply transformations such as minification and dead-code elimination.
// Bundle analysis should generally examine the production build when investigating production delivery cost.

// ---------------------------------------------------------------------
// 27. Bundle analysis does not measure runtime performance
// ---------------------------------------------------------------------

const RuntimeVsBundleExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Bundle analysis → what code is delivered.</p>
      <p>Runtime profiling → how code executes.</p>
      <p>Network measurement → how assets are transferred.</p>
    </section>
  );
};

// A small bundle can still contain expensive runtime work.
// A large bundle can also be efficiently cached or loaded asynchronously.
// Bundle size is one performance dimension, not a complete performance measurement.

// ---------------------------------------------------------------------
// 28. Browser network tools complement bundle analyzers
// ---------------------------------------------------------------------

const NetworkMeasurementExample: FC = (): ReactElement => {
  const resources = performance.getEntriesByType("resource");

  return <p>Resource timing entries observed: {resources.length}</p>;
};

// Browser Performance and Network tools can show requested assets, transfer sizes, timing,
// caching behavior, and loading order that static bundle analysis cannot fully capture.

// ---------------------------------------------------------------------
// 29. Analyze cached versus uncached loads separately
// ---------------------------------------------------------------------

interface LoadScenario {
  readonly scenario: string;
  readonly transferredBytes: number;
}

const loadScenarios: readonly LoadScenario[] = [
  { scenario: "Cold load", transferredBytes: 520_000 },
  { scenario: "Cached shared chunk", transferredBytes: 180_000 },
];

const CacheScenarioExample: FC = (): ReactElement => {
  return (
    <ul>
      {loadScenarios.map((scenario) => (
        <li key={scenario.scenario}>
          {scenario.scenario}: {scenario.transferredBytes} bytes
        </li>
      ))}
    </ul>
  );
};

// The cost of a deployment depends partly on which assets the browser already has cached.
// Stable shared chunks can sometimes remain cached across deployments when their content does not change.

// ---------------------------------------------------------------------
// 30. Chunk naming and content hashes affect caching
// ---------------------------------------------------------------------

const CacheableAssetsExample: FC = (): ReactElement => {
  const assets = ["main.a1b2c3.js", "dashboard.d4e5f6.js"];

  return (
    <ul>
      {assets.map((asset) => (
        <li key={asset}>{asset}</li>
      ))}
    </ul>
  );
};

// Production builds commonly use content hashes in asset names.
// When content changes, the hash changes, allowing browsers and CDNs to distinguish new asset versions.

// ---------------------------------------------------------------------
// 31. Compare bundle composition before and after a change
// ---------------------------------------------------------------------

interface BundleSnapshot {
  readonly version: string;
  readonly initialSize: number;
  readonly totalSize: number;
}

const snapshots: readonly BundleSnapshot[] = [
  { version: "Before", initialSize: 420, totalSize: 930 },
  { version: "After", initialSize: 330, totalSize: 940 },
];

const BundleComparisonExample: FC = (): ReactElement => {
  return (
    <ul>
      {snapshots.map((snapshot) => (
        <li key={snapshot.version}>
          {snapshot.version}: initial {snapshot.initialSize} KB / total {snapshot.totalSize} KB
        </li>
      ))}
    </ul>
  );
};

// A change can reduce initial JavaScript while increasing total asynchronously loaded code.
// Both measurements can matter, so a single aggregate number can hide important tradeoffs.

// ---------------------------------------------------------------------
// 32. Initial size and total application size answer different questions
// ---------------------------------------------------------------------

const SizePerspectiveExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Initial size: code needed for the first experience.</p>
      <p>Total size: all generated application JavaScript.</p>
    </section>
  );
};

// Initial size helps describe the first load.
// Total size helps describe the overall amount of JavaScript that may eventually be downloaded and executed.

// ---------------------------------------------------------------------
// 33. Set explicit performance budgets
// ---------------------------------------------------------------------

interface PerformanceBudget {
  readonly metric: string;
  readonly limit: number;
  readonly unit: string;
}

const budgets: readonly PerformanceBudget[] = [
  { metric: "Initial JavaScript", limit: 350, unit: "KB" },
  { metric: "Largest feature chunk", limit: 250, unit: "KB" },
];

const PerformanceBudgetExample: FC = (): ReactElement => {
  return (
    <ul>
      {budgets.map((budget) => (
        <li key={budget.metric}>
          {budget.metric}: {budget.limit} {budget.unit}
        </li>
      ))}
    </ul>
  );
};

// Performance budgets turn bundle analysis into an ongoing engineering constraint.
// The limits shown here are illustrative rather than universal thresholds.

// ---------------------------------------------------------------------
// 34. Automate bundle-size regression checks
// ---------------------------------------------------------------------

interface BuildResult {
  readonly name: string;
  readonly size: number;
  readonly budget: number;
}

const buildResults: readonly BuildResult[] = [
  { name: "main.js", size: 330, budget: 350 },
  { name: "editor.js", size: 240, budget: 250 },
];

const BudgetCheckExample: FC = (): ReactElement => {
  return (
    <ul>
      {buildResults.map((result) => (
        <li key={result.name}>
          {result.name}: {result.size} KB / {result.budget} KB budget
        </li>
      ))}
    </ul>
  );
};

// Automated checks can detect regressions when a pull request or build increases an important asset.
// The exact enforcement mechanism depends on the project's build and CI tooling.

// ---------------------------------------------------------------------
// 35. Use analysis to investigate a concrete regression
// ---------------------------------------------------------------------

const RegressionInvestigation: FC = (): ReactElement => {
  return (
    <ol>
      <li>Compare the new and previous build.</li>
      <li>Identify the changed chunk.</li>
      <li>Inspect newly included modules.</li>
      <li>Trace those modules to their imports.</li>
      <li>Determine whether the additional code is intentional.</li>
    </ol>
  );
};

// Bundle analysis is most useful when it answers a specific question:
// what changed, where did the additional bytes come from, and why are they being delivered?

// ---------------------------------------------------------------------
// 36. Do not optimize based on size alone
// ---------------------------------------------------------------------

const OptimizationContextExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Bundle size</p>
      <p>Loading frequency</p>
      <p>Cacheability</p>
      <p>Runtime cost</p>
      <p>User-facing importance</p>
    </section>
  );
};

// A useful analysis considers delivery, caching, execution, and user interaction.
// Reducing bytes that are irrelevant to the user's actual bottleneck may not produce a meaningful improvement.

// ---------------------------------------------------------------------
// 37. Build an interactive bundle summary
// ---------------------------------------------------------------------

const BundleSummary: FC = (): ReactElement => {
  const [showDependencies, setShowDependencies] = useState(true);

  const totalSize = useMemo(() => {
    return bundleModules.reduce((sum, module) => sum + module.size, 0);
  }, []);

  const visibleModules = showDependencies
    ? bundleModules
    : bundleModules.filter((module) => module.category === "application");

  return (
    <section>
      <h2>Bundle summary</h2>
      <p>Total analyzed size: {totalSize} KB</p>

      <button type="button" onClick={() => setShowDependencies((value) => !value)}>
        {showDependencies ? "Hide" : "Show"} dependencies
      </button>

      <ul>
        {visibleModules.map((module) => (
          <li key={module.name}>
            {module.name}: {module.size} KB
          </li>
        ))}
      </ul>
    </section>
  );
};

// This UI represents the kind of information a bundle analyzer exposes:
// total size, module composition, and the distinction between application and dependency code.

// ---------------------------------------------------------------------
// 38. Integrated example
// ---------------------------------------------------------------------

const BundleAnalysisDemo: FC = (): ReactElement => {
  const [selectedChunk, setSelectedChunk] = useState("main");

  const selected = chunks.find((chunk) => chunk.name === selectedChunk);

  const dependencies = useMemo(() => {
    return bundleModules.filter((module) => module.category === "dependency");
  }, []);

  const totalDependencySize = dependencies.reduce((sum, dependency) => sum + dependency.size, 0);

  return (
    <main>
      <h1>Bundle Analysis</h1>

      <section>
        <h2>Chunks</h2>

        <select value={selectedChunk} onChange={(event) => setSelectedChunk(event.target.value)}>
          {chunks.map((chunk) => (
            <option key={chunk.name} value={chunk.name}>
              {chunk.name}
            </option>
          ))}
        </select>

        <p>
          Selected chunk: {selected?.name ?? "Unknown"} — {selected?.size ?? 0} KB
        </p>
      </section>

      <section>
        <h2>Dependencies</h2>

        <p>Total dependency size: {totalDependencySize} KB</p>

        <ul>
          {dependencies.map((dependency) => (
            <li key={dependency.name}>
              {dependency.name}: {dependency.size} KB
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Analysis workflow</h2>

        <ol>
          <li>Build the application in production mode.</li>
          <li>Inspect generated chunks and assets.</li>
          <li>Find the largest modules and dependencies.</li>
          <li>Look for duplication and unexpected imports.</li>
          <li>Compare initial and asynchronous chunks.</li>
          <li>Verify changes with network and runtime measurements.</li>
        </ol>
      </section>
    </main>
  );
};

export default BundleAnalysisDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Bundle analysis examines the assets produced by the build rather than only source-file sizes.
// - Raw bundle size, compressed size, and transferred size represent different measurements.
// - Chunk analysis shows how JavaScript is divided across initial and asynchronous assets.
// - Dependency analysis identifies which packages and modules contribute to bundle weight.
// - Dependency graphs explain why particular modules are included and which features introduce them.
// - Tree shaking can remove unused code when the module structure and build configuration allow it.
// - Module side effects can affect whether unused code can safely be removed.
// - Duplicate dependency versions can increase the amount of code included in a build.
// - Shared dependencies can be extracted into common chunks depending on the bundler's chunking strategy.
// - Code splitting changes when code is loaded rather than necessarily removing the code from the application.
// - Route-level and feature-level splitting can keep rarely needed code out of the initial JavaScript.
// - Large dependencies should be evaluated in the context of their functionality, loading frequency, and delivery cost.
// - Source maps can connect generated bundle content back to the original source modules.
// - Production builds should generally be analyzed when investigating production delivery cost.
// - Browser Network tools complement static bundle analysis by showing transfer, caching, and loading behavior.
// - Runtime profiling is separate from bundle analysis because bundle size does not describe execution cost.
// - Initial bundle size and total application JavaScript answer different performance questions.
// - Content-hashed assets can improve caching by allowing unchanged files to remain reusable across deployments.
// - Performance budgets can turn bundle analysis into an automated regression check.
// - Bundle analysis is most useful when it identifies a concrete source of unnecessary or unexpectedly delivered code.
// - Bundle size should be considered alongside loading behavior, caching, runtime work, and actual user interactions.
// - Optimization decisions should be based on measured delivery and runtime behavior rather than bundle size alone.
