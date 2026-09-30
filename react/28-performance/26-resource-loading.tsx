/**
 * Resource Loading
 * ================
 *
 * Resource loading is the process of obtaining external resources such as JavaScript, CSS, images,
 * fonts, and data before or during an application's execution. Performance depends not only on how
 * much code is loaded, but also on when resources are requested, how large they are, and whether
 * they are needed for the current user experience.
 */

import { useEffect, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Resource loading has multiple stages
// ---------------------------------------------------------------------

const ResourceLoadingStages: FC = (): ReactElement => {
  const stages = ["Request", "Transfer", "Decode or parse", "Evaluation", "Use by the application"];

  return (
    <ol>
      {stages.map((stage) => (
        <li key={stage}>{stage}</li>
      ))}
    </ol>
  );
};

// Loading a resource is not a single operation.
// Network transfer, browser processing, and application usage can all contribute to the final cost.

// ---------------------------------------------------------------------
// 2. Different resources have different costs
// ---------------------------------------------------------------------

interface ResourceCost {
  readonly resource: string;
  readonly cost: string;
}

const resourceCosts: readonly ResourceCost[] = [
  { resource: "JavaScript", cost: "Download, parse, compile, and execute" },
  { resource: "CSS", cost: "Download, parse, and apply" },
  { resource: "Images", cost: "Download and decode" },
  { resource: "Fonts", cost: "Download, decode, and font rendering" },
  { resource: "Data", cost: "Download, parse, and application processing" },
];

const ResourceCostExample: FC = (): ReactElement => {
  return (
    <ul>
      {resourceCosts.map((item) => (
        <li key={item.resource}>
          {item.resource}: {item.cost}
        </li>
      ))}
    </ul>
  );
};

// A resource's transferred size is only one part of its performance cost.
// The browser and application may perform additional work after the bytes arrive.

// ---------------------------------------------------------------------
// 3. Critical resources affect the initial experience
// ---------------------------------------------------------------------

const CriticalResourceExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Initial application</h2>
      <p>Critical JavaScript and CSS are needed for the first interface.</p>
      <p>Non-critical resources can often be deferred.</p>
    </section>
  );
};

// Critical resources are resources required to produce the desired initial experience.
// Delaying them can delay rendering or interaction.

// ---------------------------------------------------------------------
// 4. Non-critical resources can be deferred
// ---------------------------------------------------------------------

const DeferredResourceExample: FC = (): ReactElement => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setShowDetails((value) => !value)}>
        {showDetails ? "Hide" : "Show"} details
      </button>

      {showDetails && <p>Additional resources can be requested when this feature becomes relevant.</p>}
    </section>
  );
};

// Deferring a resource avoids spending network and processing capacity before the resource is needed.
// The deferred work still exists and must be considered when the feature is eventually activated.

// ---------------------------------------------------------------------
// 5. Images can be expensive resources
// ---------------------------------------------------------------------

interface ImageResource {
  readonly name: string;
  readonly width: number;
  readonly height: number;
}

const imageResources: readonly ImageResource[] = [
  { name: "Hero image", width: 1600, height: 900 },
  { name: "Product thumbnail", width: 320, height: 320 },
  { name: "Avatar", width: 96, height: 96 },
];

const ImageResourceExample: FC = (): ReactElement => {
  return (
    <ul>
      {imageResources.map((image) => (
        <li key={image.name}>
          {image.name}: {image.width} × {image.height}
        </li>
      ))}
    </ul>
  );
};

// An image can require substantial transfer and decoding work.
// Serving an image close to the dimensions and quality actually needed avoids unnecessary resource cost.

// ---------------------------------------------------------------------
// 6. Responsive images can reduce unnecessary transfer
// ---------------------------------------------------------------------

const ResponsiveImageExample: FC = (): ReactElement => {
  return (
    <img
      src="/images/product-800.jpg"
      srcSet="
                /images/product-400.jpg 400w,
                /images/product-800.jpg 800w,
                /images/product-1200.jpg 1200w
            "
      sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
      alt="Product"
    />
  );
};

// `srcSet` provides multiple image candidates.
// `sizes` tells the browser how much layout space the image is expected to occupy so it can choose an appropriate candidate.

// ---------------------------------------------------------------------
// 7. Image dimensions help prevent layout shifts
// ---------------------------------------------------------------------

const StableImageExample: FC = (): ReactElement => {
  return <img src="/images/product.jpg" width={800} height={600} alt="Product" />;
};

// Explicit dimensions provide the browser with an intrinsic aspect ratio before the image finishes loading.
// Reserving that space can reduce unexpected layout movement.

// ---------------------------------------------------------------------
// 8. Native lazy loading can defer off-screen images
// ---------------------------------------------------------------------

const NativeImageLazyLoading: FC = (): ReactElement => {
  return (
    <section>
      <img src="/images/product.jpg" width={800} height={600} loading="lazy" alt="Product" />

      <p>Images outside the immediate viewport can be candidates for lazy loading.</p>
    </section>
  );
};

// `loading="lazy"` lets the browser defer loading an image when appropriate.
// It is generally more suitable for non-critical images than for an image required immediately for the initial view.

// ---------------------------------------------------------------------
// 9. Do not lazy load every image automatically
// ---------------------------------------------------------------------

const ImagePriorityExample: FC = (): ReactElement => {
  return (
    <section>
      <img src="/images/hero.jpg" width={1600} height={900} alt="Hero" />

      <img src="/images/recommendation.jpg" width={400} height={300} loading="lazy" alt="Recommendation" />
    </section>
  );
};

// An above-the-fold image can be important to the initial experience.
// Applying lazy loading indiscriminately can delay resources that should be available early.

// ---------------------------------------------------------------------
// 10. Fonts are also network resources
// ---------------------------------------------------------------------

interface FontResource {
  readonly family: string;
  readonly format: string;
  readonly weight: number;
}

const fontResources: readonly FontResource[] = [
  { family: "Example Sans", format: "woff2", weight: 400 },
  { family: "Example Sans", format: "woff2", weight: 700 },
];

const FontResourceExample: FC = (): ReactElement => {
  return (
    <ul>
      {fontResources.map((font) => (
        <li key={`${font.family}-${font.weight}`}>
          {font.family} {font.weight}: {font.format}
        </li>
      ))}
    </ul>
  );
};

// Fonts can block or change text rendering depending on how they are configured.
// Limiting font families, weights, and character ranges can reduce unnecessary font resources.

// ---------------------------------------------------------------------
// 11. Font formats and subsets affect transfer size
// ---------------------------------------------------------------------

const FontSubsetExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Full font: contains many glyphs.</p>
      <p>Subset font: contains only the glyphs required by a defined character range.</p>
    </section>
  );
};

// A font subset can reduce transfer size when an application only needs a particular character set.
// The appropriate strategy depends on the application's languages and typography requirements.

// ---------------------------------------------------------------------
// 12. CSS is a rendering resource
// ---------------------------------------------------------------------

const CssResourceExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Styled content</h2>
      <p>CSS affects how the browser constructs and paints the interface.</p>
    </section>
  );
};

// CSS can affect rendering because the browser needs style information to determine presentation.
// Reducing unnecessary CSS can reduce both transfer and browser processing work.

// ---------------------------------------------------------------------
// 13. JavaScript is both a network and CPU resource
// ---------------------------------------------------------------------

interface JavaScriptCost {
  readonly stage: string;
  readonly cost: string;
}

const javaScriptCosts: readonly JavaScriptCost[] = [
  { stage: "Download", cost: "Network transfer" },
  { stage: "Parse", cost: "JavaScript parsing" },
  { stage: "Compile", cost: "Engine preparation" },
  { stage: "Execute", cost: "Runtime CPU work" },
];

const JavaScriptResourceExample: FC = (): ReactElement => {
  return (
    <ul>
      {javaScriptCosts.map((item) => (
        <li key={item.stage}>
          {item.stage}: {item.cost}
        </li>
      ))}
    </ul>
  );
};

// A smaller JavaScript payload can reduce more than network transfer.
// It can also reduce the amount of parsing, compilation, and execution work required by the browser.

// ---------------------------------------------------------------------
// 14. Data resources have application processing costs
// ---------------------------------------------------------------------

const DataResourceExample: FC = (): ReactElement => {
  const [status, setStatus] = useState("No data requested");

  const loadData = (): void => {
    setStatus("Data requested");
  };

  return (
    <section>
      <p>{status}</p>

      <button type="button" onClick={loadData}>
        Request data
      </button>
    </section>
  );
};

// A data request can involve transfer, response parsing, validation, transformation, and state updates.
// Measuring only network time can therefore miss significant client-side work.

// ---------------------------------------------------------------------
// 15. Fetching data after rendering can defer non-critical work
// ---------------------------------------------------------------------

const DeferredDataExample: FC = (): ReactElement => {
  const [status, setStatus] = useState("Waiting");

  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<void> => {
      await Promise.resolve();

      if (!cancelled) {
        setStatus("Additional data loaded");
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return <p>{status}</p>;
};

// Effects can be used for client-side data loading when that architecture is appropriate.
// Cleanup prevents this example from updating state after the component has been removed.

// ---------------------------------------------------------------------
// 16. Request waterfalls can delay dependent resources
// ---------------------------------------------------------------------

const RequestWaterfallExample: FC = (): ReactElement => {
  return (
    <ol>
      <li>Load application.</li>
      <li>Execute application.</li>
      <li>Discover feature.</li>
      <li>Request feature resource.</li>
      <li>Render feature.</li>
    </ol>
  );
};

// A waterfall occurs when one request cannot begin until another resource finishes enough work to discover it.
// Reducing unnecessary sequential dependencies can improve loading latency.

// ---------------------------------------------------------------------
// 17. Parallel requests can reduce waiting
// ---------------------------------------------------------------------

const ParallelResourceExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Resource A ────────┐</p>
      <p>Resource B ────────┼─→ feature ready</p>
      <p>Resource C ────────┘</p>
    </section>
  );
};

// Independent resources can sometimes be requested concurrently.
// Parallelism does not make the resources free; it can reduce the time spent waiting for independent work.

// ---------------------------------------------------------------------
// 18. Resource dependencies determine loading order
// ---------------------------------------------------------------------

interface ResourceDependency {
  readonly resource: string;
  readonly dependsOn: readonly string[];
}

const resourceDependencies: readonly ResourceDependency[] = [
  { resource: "Application", dependsOn: [] },
  { resource: "Dashboard data", dependsOn: ["Application"] },
  { resource: "Dashboard chart", dependsOn: ["Dashboard data"] },
];

const DependencyExample: FC = (): ReactElement => {
  return (
    <ul>
      {resourceDependencies.map((item) => (
        <li key={item.resource}>
          {item.resource} depends on {item.dependsOn.length > 0 ? item.dependsOn.join(", ") : "nothing"}
        </li>
      ))}
    </ul>
  );
};

// Some resources genuinely depend on earlier work.
// The performance goal is not to eliminate every dependency, but to avoid dependencies that are unnecessary.

// ---------------------------------------------------------------------
// 19. Preconnect can reduce connection setup cost
// ---------------------------------------------------------------------

const PreconnectConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Preconnect can establish a connection to an origin before a later resource request needs it.</p>
    </section>
  );
};

// Connection establishment can involve DNS lookup, TCP setup, and TLS negotiation.
// A preconnect hint can be useful when an external origin is known to be important and will be contacted soon.

// ---------------------------------------------------------------------
// 20. DNS prefetching can resolve an origin early
// ---------------------------------------------------------------------

const DnsPrefetchConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>
        DNS prefetching can ask the browser to resolve an origin before the application needs to request a resource from
        it.
      </p>
    </section>
  );
};

// DNS resolution is one part of establishing communication with an external origin.
// DNS prefetching is a hint rather than a guarantee that every later request will be faster.

// ---------------------------------------------------------------------
// 21. Preload is intended for important resources needed soon
// ---------------------------------------------------------------------

const PreloadConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Preload can tell the browser that a particular resource is important and expected soon.</p>
    </section>
  );
};

// Preload should be used deliberately.
// Preloading resources that are not actually needed soon can compete with genuinely important resources.

// ---------------------------------------------------------------------
// 22. Prefetch is intended for resources that may be needed later
// ---------------------------------------------------------------------

const PrefetchConcept: FC = (): ReactElement => {
  return (
    <section>
      <p>Prefetch can provide a lower-priority hint for a resource that may be useful in the future.</p>
    </section>
  );
};

// Prefetching can prepare for likely future navigation or interaction.
// It consumes bandwidth and should therefore be based on a reasonable expectation of future use.

// ---------------------------------------------------------------------
// 23. Resource priority affects competition
// ---------------------------------------------------------------------

interface ResourcePriority {
  readonly resource: string;
  readonly priority: "high" | "normal" | "low";
}

const resourcePriorities: readonly ResourcePriority[] = [
  { resource: "Critical stylesheet", priority: "high" },
  { resource: "Primary image", priority: "high" },
  { resource: "Feature image", priority: "normal" },
  { resource: "Off-screen image", priority: "low" },
];

const ResourcePriorityExample: FC = (): ReactElement => {
  return (
    <ul>
      {resourcePriorities.map((item) => (
        <li key={item.resource}>
          {item.resource}: {item.priority}
        </li>
      ))}
    </ul>
  );
};

// Browsers schedule competing resources according to their own loading and priority mechanisms.
// Application hints can influence resource discovery and priority, but they do not guarantee an exact scheduling order.

// ---------------------------------------------------------------------
// 24. Cacheability changes repeated loading cost
// ---------------------------------------------------------------------

interface CacheScenario {
  readonly scenario: string;
  readonly transferred: number;
}

const cacheScenarios: readonly CacheScenario[] = [
  { scenario: "Cold cache", transferred: 240 },
  { scenario: "Warm cache", transferred: 0 },
];

const CacheExample: FC = (): ReactElement => {
  return (
    <ul>
      {cacheScenarios.map((scenario) => (
        <li key={scenario.scenario}>
          {scenario.scenario}: {scenario.transferred} KB transferred
        </li>
      ))}
    </ul>
  );
};

// A cached resource may require little or no network transfer on a later visit.
// Performance tests should specify whether they represent a cold-cache or warm-cache scenario.

// ---------------------------------------------------------------------
// 25. Content hashing improves long-term caching
// ---------------------------------------------------------------------

interface AssetVersion {
  readonly filename: string;
  readonly version: string;
}

const assetVersions: readonly AssetVersion[] = [
  { filename: "app.a1b2c3.js", version: "a1b2c3" },
  { filename: "app.d4e5f6.js", version: "d4e5f6" },
];

const ContentHashExample: FC = (): ReactElement => {
  return (
    <ul>
      {assetVersions.map((asset) => (
        <li key={asset.filename}>
          {asset.filename} — version {asset.version}
        </li>
      ))}
    </ul>
  );
};

// Content-hashed filenames allow different versions of an asset to coexist in caches.
// When the content changes, the generated filename can change and the browser can request the new asset.

// ---------------------------------------------------------------------
// 26. Compression reduces transferred bytes
// ---------------------------------------------------------------------

interface CompressionResult {
  readonly resource: string;
  readonly original: number;
  readonly transferred: number;
}

const compressionResults: readonly CompressionResult[] = [
  { resource: "JavaScript", original: 500, transferred: 150 },
  { resource: "CSS", original: 120, transferred: 30 },
  { resource: "JSON", original: 300, transferred: 80 },
];

const CompressionExample: FC = (): ReactElement => {
  return (
    <ul>
      {compressionResults.map((result) => (
        <li key={result.resource}>
          {result.resource}: {result.original} KB → {result.transferred} KB
        </li>
      ))}
    </ul>
  );
};

// Compression reduces transfer size but does not remove the browser's need to process the decompressed resource.
// Transfer size and uncompressed resource size should therefore be considered separately.

// ---------------------------------------------------------------------
// 27. Resource size is different from transfer size
// ---------------------------------------------------------------------

const ResourceSizeExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Uncompressed resource: 500 KB</p>
      <p>Compressed transfer: 150 KB</p>
      <p>Browser processing: based on the resource after decompression</p>
    </section>
  );
};

// Network tools commonly expose both transferred and resource sizes.
// These measurements answer different questions and should not be treated as interchangeable.

// ---------------------------------------------------------------------
// 28. Resource loading competes for limited bandwidth
// ---------------------------------------------------------------------

interface NetworkLoad {
  readonly resource: string;
  readonly size: number;
}

const networkLoads: readonly NetworkLoad[] = [
  { resource: "Application", size: 320 },
  { resource: "Hero image", size: 180 },
  { resource: "Font", size: 70 },
  { resource: "Analytics", size: 40 },
];

const NetworkCompetitionExample: FC = (): ReactElement => {
  return (
    <ul>
      {networkLoads.map((resource) => (
        <li key={resource.resource}>
          {resource.resource}: {resource.size} KB
        </li>
      ))}
    </ul>
  );
};

// Multiple simultaneous requests share network capacity.
// Removing or deferring low-value requests can leave more capacity for resources that affect the current experience.

// ---------------------------------------------------------------------
// 29. Third-party resources can add independent costs
// ---------------------------------------------------------------------

const ThirdPartyResourceExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Application resources: controlled by the application.</p>
      <p>Third-party resources: controlled partly by external services.</p>
    </section>
  );
};

// Third-party scripts, fonts, analytics, embeds, and other resources can add network and execution work.
// Their cost should be measured as part of the complete page experience.

// ---------------------------------------------------------------------
// 30. Resource loading can be observed with Performance APIs
// ---------------------------------------------------------------------

const PerformanceResourceExample: FC = (): ReactElement => {
  const [resourceCount, setResourceCount] = useState(0);

  const measureResources = (): void => {
    if (typeof performance === "undefined") {
      setResourceCount(0);
      return;
    }

    setResourceCount(performance.getEntriesByType("resource").length);
  };

  return (
    <section>
      <p>Observed resource entries: {resourceCount}</p>

      <button type="button" onClick={measureResources}>
        Measure resources
      </button>
    </section>
  );
};

// `performance.getEntriesByType("resource")` exposes browser performance entries for loaded resources.
// These entries can help identify resource timing patterns during development and profiling.

// ---------------------------------------------------------------------
// 31. Resource timing can reveal slow resources
// ---------------------------------------------------------------------

interface ResourceTiming {
  readonly name: string;
  readonly duration: number;
}

const resourceTimings: readonly ResourceTiming[] = [
  { name: "app.js", duration: 120 },
  { name: "hero.jpg", duration: 180 },
  { name: "font.woff2", duration: 90 },
];

const ResourceTimingExample: FC = (): ReactElement => {
  return (
    <ul>
      {resourceTimings.map((resource) => (
        <li key={resource.name}>
          {resource.name}: {resource.duration} ms
        </li>
      ))}
    </ul>
  );
};

// Resource timing can show which requests consumed significant elapsed time.
// A slow request should be investigated in context rather than optimized solely because its duration is large.

// ---------------------------------------------------------------------
// 32. Loading strategy should match resource importance
// ---------------------------------------------------------------------

interface LoadingStrategy {
  readonly resource: string;
  readonly strategy: string;
}

const loadingStrategies: readonly LoadingStrategy[] = [
  { resource: "Critical CSS", strategy: "Load early" },
  { resource: "Primary image", strategy: "Prioritize when appropriate" },
  { resource: "Off-screen images", strategy: "Defer when appropriate" },
  { resource: "Rare feature code", strategy: "Load on demand" },
  { resource: "Likely next route", strategy: "Consider prefetching" },
];

const LoadingStrategyExample: FC = (): ReactElement => {
  return (
    <ul>
      {loadingStrategies.map((item) => (
        <li key={item.resource}>
          {item.resource}: {item.strategy}
        </li>
      ))}
    </ul>
  );
};

// There is no single loading strategy that is optimal for every resource.
// Resource importance, timing, size, usage frequency, and network conditions all affect the appropriate strategy.

// ---------------------------------------------------------------------
// 33. Avoid loading resources that are never used
// ---------------------------------------------------------------------

const UnusedResourceExample: FC = (): ReactElement => {
  const resources = [
    { name: "Dashboard", used: true },
    { name: "Editor", used: false },
    { name: "Reports", used: false },
  ];

  return (
    <ul>
      {resources.map((resource) => (
        <li key={resource.name}>
          {resource.name}: {resource.used ? "used" : "not used"}
        </li>
      ))}
    </ul>
  );
};

// An unused resource consumes bandwidth and possibly processing capacity without contributing to the current experience.
// Removing unnecessary dependencies can therefore be more effective than optimizing how those resources are loaded.

// ---------------------------------------------------------------------
// 34. Resource loading and code splitting work together
// ---------------------------------------------------------------------

const CodeSplittingResourceExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Initial chunk: application code needed immediately.</p>
      <p>Deferred chunk: feature code requested later.</p>
      <p>Both are JavaScript resources with different loading times.</p>
    </section>
  );
};

// Code splitting creates separate JavaScript resources.
// Resource-loading strategy then determines when those resources are discovered, requested, and transferred.

// ---------------------------------------------------------------------
// 35. Resource loading and lazy loading are related but broader
// ---------------------------------------------------------------------

const LazyLoadingRelationship: FC = (): ReactElement => {
  return (
    <section>
      <p>Lazy loading: defer selected resources until needed.</p>
      <p>Resource loading: the broader process governing all external resources.</p>
    </section>
  );
};

// Lazy loading is one resource-loading strategy.
// Resource loading also includes prioritization, caching, compression, connection setup, and resource discovery.

// ---------------------------------------------------------------------
// 36. Measure before changing loading behavior
// ---------------------------------------------------------------------

interface Measurement {
  readonly metric: string;
  readonly before: number;
  readonly after: number;
}

const measurements: readonly Measurement[] = [
  { metric: "Initial transfer", before: 560, after: 360 },
  { metric: "Feature transfer", before: 0, after: 200 },
  { metric: "Initial request count", before: 18, after: 14 },
];

const BeforeAfterMeasurement: FC = (): ReactElement => {
  return (
    <ul>
      {measurements.map((measurement) => (
        <li key={measurement.metric}>
          {measurement.metric}: {measurement.before} → {measurement.after}
        </li>
      ))}
    </ul>
  );
};

// A loading optimization should be evaluated against the metric it is intended to improve.
// Moving bytes from the initial load to a later request can improve one metric while worsening another.

// ---------------------------------------------------------------------
// 37. Test loading under realistic conditions
// ---------------------------------------------------------------------

const RealisticLoadingExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Test different network conditions.</p>
      <p>Test cold and warm caches when relevant.</p>
      <p>Test representative devices.</p>
      <p>Measure the actual user-facing interaction.</p>
    </section>
  );
};

// A resource strategy that looks effective on a fast development machine may behave differently on slower devices or networks.
// Representative testing is necessary before drawing conclusions about the user experience.

// ---------------------------------------------------------------------
// 38. Integrated resource-loading example
// ---------------------------------------------------------------------

const ResourceLoadingDemo: FC = (): ReactElement => {
  const [showReports, setShowReports] = useState(false);
  const [status, setStatus] = useState("Initial resources loaded");

  const requestReports = (): void => {
    setShowReports(true);
    setStatus("Reports feature requested");
  };

  return (
    <main>
      <h1>Resource Loading</h1>

      <section>
        <p>{status}</p>
        <p>
          Critical resources can be loaded early while less important resources can be deferred until they become
          useful.
        </p>

        <button type="button" onClick={requestReports}>
          Open reports
        </button>
      </section>

      {showReports && (
        <section>
          <h2>Reports</h2>
          <p>This feature represents work that can be requested when the user needs it.</p>
        </section>
      )}
    </main>
  );
};

export default ResourceLoadingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Resource loading includes obtaining and processing JavaScript, CSS, images, fonts, data, and other external resources.
// - Resource cost includes more than transferred bytes; parsing, decoding, evaluation, and application processing can also be significant.
// - Critical resources affect the initial user experience and should not be delayed without a reason.
// - Non-critical resources can often be deferred until they become relevant.
// - Responsive images can prevent unnecessarily large image transfers.
// - Explicit image dimensions can reserve layout space and reduce layout movement.
// - Native image lazy loading can defer appropriate off-screen images.
// - Fonts can contribute network, rendering, and processing costs.
// - Limiting unnecessary font weights, families, and glyph ranges can reduce font resources.
// - CSS contributes to both transfer and browser rendering work.
// - JavaScript contributes network, parsing, compilation, and execution costs.
// - Data loading can include transfer, parsing, validation, transformation, and state-update work.
// - Request waterfalls can delay resources when unnecessary sequential dependencies exist.
// - Independent resources can sometimes be requested in parallel.
// - Preconnect can prepare a connection to an important external origin.
// - DNS prefetching can resolve an external origin before it is needed.
// - Preload is intended for resources that are important and expected soon.
// - Prefetch is intended for resources that may be useful later.
// - Resource priority determines how competing requests are scheduled, although browser scheduling is not completely controlled by application code.
// - Caching can substantially reduce repeated transfer costs.
// - Content-hashed filenames help browsers cache generated assets across visits and deployments.
// - Compression reduces transfer size but does not eliminate browser processing costs.
// - Multiple resources compete for limited network capacity.
// - Third-party resources can introduce additional network and execution costs.
// - Performance Resource Timing APIs can help identify resource-loading behavior.
// - Code splitting creates separate JavaScript resources that can be loaded at different times.
// - Lazy loading is one resource-loading strategy rather than the entire resource-loading model.
// - Avoiding unused resources can be more effective than optimizing resources that should not have been loaded.
// - Resource-loading decisions should be based on resource importance, size, usage patterns, dependencies, and measured user-facing performance.
// - Loading strategies should be tested under representative network, device, and cache conditions.
