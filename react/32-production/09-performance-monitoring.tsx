/**
 * Performance Monitoring
 * =======================
 *
 * Performance monitoring measures how quickly and reliably a web application loads, responds,
 * renders, and completes important operations. Production monitoring combines browser performance
 * APIs, user-centric metrics, application measurements, and real-user data to identify regressions
 * and understand the experience of actual users.
 */

import { useEffect, useRef, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Performance monitoring
// ---------------------------------------------------------------------

const performanceMonitoring = {
  loading: true,
  responsiveness: true,
  visualStability: true,
  applicationOperations: true,
};

console.log(performanceMonitoring);

// Performance monitoring measures behavior instead of relying only on subjective impressions.

// ---------------------------------------------------------------------
// 2. Performance measurement
// ---------------------------------------------------------------------

interface PerformanceMeasurement {
  readonly name: string;
  readonly value: number;
  readonly unit: string;
}

const performanceMeasurement: PerformanceMeasurement = {
  name: "example-operation",
  value: 240,
  unit: "ms",
};

console.log(performanceMeasurement);

// A performance measurement should identify what was measured, its value, and its unit.

// ---------------------------------------------------------------------
// 3. Performance API
// ---------------------------------------------------------------------

const performanceApiConcepts = [
  "Performance",
  "PerformanceEntry",
  "PerformanceObserver",
  "PerformanceNavigationTiming",
  "PerformanceResourceTiming",
  "PerformanceMark",
  "PerformanceMeasure",
];

console.log(performanceApiConcepts);

// The browser Performance API exposes timing information and custom measurements.

// ---------------------------------------------------------------------
// 4. Performance entries
// ---------------------------------------------------------------------

interface PerformanceEntryModel {
  readonly name: string;
  readonly entryType: string;
  readonly startTime: number;
  readonly duration: number;
}

const performanceEntry: PerformanceEntryModel = {
  name: "example-operation",
  entryType: "measure",
  startTime: 100,
  duration: 240,
};

console.log(performanceEntry);

// Performance entries describe measurements recorded in the browser's performance timeline.

// ---------------------------------------------------------------------
// 5. PerformanceObserver
// ---------------------------------------------------------------------

const performanceObserverConcept = {
  observesEntries: true,
  receivesNewEntries: true,
  canReadBufferedEntries: true,
};

console.log(performanceObserverConcept);

// PerformanceObserver can receive performance entries as they are recorded and can request buffered entries.

// ---------------------------------------------------------------------
// 6. Browser support
// ---------------------------------------------------------------------

const supportedPerformanceTypes =
  typeof PerformanceObserver !== "undefined" ? PerformanceObserver.supportedEntryTypes : [];

console.log(supportedPerformanceTypes);

// Browser support for individual performance entry types can vary, so applications should check before observing optional types.

// ---------------------------------------------------------------------
// 7. Performance marks
// ---------------------------------------------------------------------

const performanceMarks = {
  start: "application-start",
  ready: "application-ready",
};

console.log(performanceMarks);

// Performance marks represent named points in an application's execution.

// ---------------------------------------------------------------------
// 8. Performance measures
// ---------------------------------------------------------------------

const performanceMeasure = {
  name: "application-startup",
  startMark: "application-start",
  endMark: "application-ready",
};

console.log(performanceMeasure);

// A performance measure represents elapsed time between two named marks.

// ---------------------------------------------------------------------
// 9. Creating a mark
// ---------------------------------------------------------------------

const createPerformanceMark = (name: string): void => {
  if (typeof performance === "undefined") {
    return;
  }

  performance.mark(name);
};

createPerformanceMark("example-operation-start");

// Browser performance APIs should be accessed only when the browser environment exists.

// ---------------------------------------------------------------------
// 10. Measuring an operation
// ---------------------------------------------------------------------

const measureOperation = (operation: () => void): number => {
  if (typeof performance === "undefined") {
    return 0;
  }

  const start = performance.now();

  operation();

  return performance.now() - start;
};

const operationDuration = measureOperation(() => {
  console.log("Example operation.");
});

console.log(operationDuration);

// performance.now() provides a high-resolution monotonic clock suitable for elapsed-time measurements.

// ---------------------------------------------------------------------
// 11. Navigation timing
// ---------------------------------------------------------------------

const navigationTimingConcept = {
  entryType: "navigation",
  measuresDocumentNavigation: true,
};

console.log(navigationTimingConcept);

// Navigation Timing exposes measurements for the loading lifecycle of the current document.

// ---------------------------------------------------------------------
// 12. Reading navigation timing
// ---------------------------------------------------------------------

const getNavigationTiming = (): PerformanceNavigationTiming | null => {
  if (typeof performance === "undefined") {
    return null;
  }

  const entry = performance.getEntriesByType("navigation")[0];

  return entry instanceof PerformanceNavigationTiming ? entry : null;
};

console.log(getNavigationTiming);

// Navigation timing can be read after the browser has recorded the relevant navigation entry.

// ---------------------------------------------------------------------
// 13. Navigation duration
// ---------------------------------------------------------------------

const getNavigationDuration = (entry: PerformanceNavigationTiming): number => {
  return entry.duration;
};

console.log(getNavigationDuration);

// Navigation duration provides one measurement of the document navigation lifecycle.

// ---------------------------------------------------------------------
// 14. Time to first byte
// ---------------------------------------------------------------------

const calculateTimeToFirstByte = (entry: PerformanceNavigationTiming): number => {
  return entry.responseStart - entry.requestStart;
};

console.log(calculateTimeToFirstByte);

// TTFB can be derived from navigation timing and represents the elapsed time between request start and response start.

// ---------------------------------------------------------------------
// 15. DOM content loaded timing
// ---------------------------------------------------------------------

const calculateDomContentLoaded = (entry: PerformanceNavigationTiming): number => {
  return entry.domContentLoadedEventEnd - entry.startTime;
};

console.log(calculateDomContentLoaded);

// Navigation timing exposes timestamps that can be used to derive document lifecycle measurements.

// ---------------------------------------------------------------------
// 16. Load event timing
// ---------------------------------------------------------------------

const calculateLoadEventDuration = (entry: PerformanceNavigationTiming): number => {
  return entry.loadEventEnd - entry.startTime;
};

console.log(calculateLoadEventDuration);

// Load-event timing is one browser-level measurement and should not be treated as a complete measure of user-perceived readiness.

// ---------------------------------------------------------------------
// 17. Navigation type
// ---------------------------------------------------------------------

const getNavigationType = (entry: PerformanceNavigationTiming): string => {
  return entry.type;
};

console.log(getNavigationType);

// Navigation type distinguishes navigations such as normal navigation, reload, and back-forward traversal.

// ---------------------------------------------------------------------
// 18. Resource timing
// ---------------------------------------------------------------------

const resourceTimingConcept = {
  entryType: "resource",
  measures: ["scripts", "stylesheets", "images", "fonts", "network requests"],
};

console.log(resourceTimingConcept);

// Resource Timing provides detailed timing information for resources loaded by the document.

// ---------------------------------------------------------------------
// 19. Resource duration
// ---------------------------------------------------------------------

const getResourceDuration = (entry: PerformanceResourceTiming): number => {
  return entry.duration;
};

console.log(getResourceDuration);

// Resource duration measures the time represented by an individual resource timing entry.

// ---------------------------------------------------------------------
// 20. Resource request timing
// ---------------------------------------------------------------------

const calculateResourceRequestDuration = (entry: PerformanceResourceTiming): number => {
  return entry.responseStart - entry.requestStart;
};

console.log(calculateResourceRequestDuration);

// Resource timing can separate network request phases for individual resources.

// ---------------------------------------------------------------------
// 21. Resource analysis
// ---------------------------------------------------------------------

interface ResourceMeasurement {
  readonly name: string;
  readonly durationMs: number;
}

const resourceMeasurement: ResourceMeasurement = {
  name: "example-script.js",
  durationMs: 180,
};

console.log(resourceMeasurement);

// Resource measurements can identify assets that contribute significantly to loading cost.

// ---------------------------------------------------------------------
// 22. PerformanceObserver for resources
// ---------------------------------------------------------------------

const observeResources = (callback: (entry: PerformanceResourceTiming) => void): (() => void) | null => {
  if (typeof PerformanceObserver === "undefined") {
    return null;
  }

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry instanceof PerformanceResourceTiming) {
        callback(entry);
      }
    });
  });

  observer.observe({
    type: "resource",
    buffered: true,
  });

  return (): void => {
    observer.disconnect();
  };
};

console.log(observeResources);

// PerformanceObserver can collect resource timing entries without repeatedly polling the performance timeline.

// ---------------------------------------------------------------------
// 23. Buffered entries
// ---------------------------------------------------------------------

const bufferedObservation = {
  type: "resource",
  buffered: true,
};

console.log(bufferedObservation);

// The buffered option allows an observer to receive entries that were recorded before the observer was created.

// ---------------------------------------------------------------------
// 24. Observer cleanup
// ---------------------------------------------------------------------

const observerLifecycle = ["create", "observe", "process entries", "disconnect"];

console.log(observerLifecycle);

// Observers should be disconnected when their application lifecycle ends.

// ---------------------------------------------------------------------
// 25. First Contentful Paint
// ---------------------------------------------------------------------

const firstContentfulPaint = {
  metric: "FCP",
  meaning: "time until the first piece of page content is rendered",
};

console.log(firstContentfulPaint);

// FCP measures an early visual milestone during page loading.

// ---------------------------------------------------------------------
// 26. Largest Contentful Paint
// ---------------------------------------------------------------------

const largestContentfulPaint = {
  metric: "LCP",
  meaning: "time until the largest relevant content element is rendered",
};

console.log(largestContentfulPaint);

// LCP is a Core Web Vital focused on loading performance and the rendering of the largest relevant content element.

// ---------------------------------------------------------------------
// 27. Interaction to Next Paint
// ---------------------------------------------------------------------

const interactionToNextPaint = {
  metric: "INP",
  meaning: "responsiveness across user interactions",
};

console.log(interactionToNextPaint);

// INP evaluates interaction latency throughout the page lifetime rather than only the first interaction.

// ---------------------------------------------------------------------
// 28. Cumulative Layout Shift
// ---------------------------------------------------------------------

const cumulativeLayoutShift = {
  metric: "CLS",
  meaning: "visual stability",
};

console.log(cumulativeLayoutShift);

// CLS measures unexpected layout movement over the page experience.

// ---------------------------------------------------------------------
// 29. Core Web Vitals
// ---------------------------------------------------------------------

const coreWebVitals = ["LCP", "INP", "CLS"];

console.log(coreWebVitals);

// LCP, INP, and CLS currently form the Core Web Vitals used to represent loading, responsiveness, and visual stability.

// ---------------------------------------------------------------------
// 30. LCP target
// ---------------------------------------------------------------------

const lcpThresholdMs = 2500;

console.log(lcpThresholdMs);

// The recommended LCP threshold for a good experience is 2.5 seconds or less at the 75th percentile.

// ---------------------------------------------------------------------
// 31. INP target
// ---------------------------------------------------------------------

const inpThresholdMs = 200;

console.log(inpThresholdMs);

// The recommended INP threshold for a good experience is 200 milliseconds or less at the 75th percentile.

// ---------------------------------------------------------------------
// 32. CLS target
// ---------------------------------------------------------------------

const clsThreshold = 0.1;

console.log(clsThreshold);

// The recommended CLS threshold for a good experience is 0.1 or less at the 75th percentile.

// ---------------------------------------------------------------------
// 33. Field data
// ---------------------------------------------------------------------

const fieldData = {
  source: "real users",
  environment: "production",
  measuresActualExperiences: true,
};

console.log(fieldData);

// Field data measures experiences from actual users in their real environments.

// ---------------------------------------------------------------------
// 34. Real User Monitoring
// ---------------------------------------------------------------------

const realUserMonitoring = {
  abbreviation: "RUM",
  usesFieldData: true,
  observesProductionExperience: true,
};

console.log(realUserMonitoring);

// RUM collects performance information from real user sessions rather than controlled test environments.

// ---------------------------------------------------------------------
// 35. Lab data
// ---------------------------------------------------------------------

const labData = {
  source: "controlled environment",
  usefulFor: ["development", "CI", "regression testing"],
};

console.log(labData);

// Lab measurements provide repeatable conditions that are useful for development and automated performance testing.

// ---------------------------------------------------------------------
// 36. Field versus lab
// ---------------------------------------------------------------------

const fieldAndLab = {
  field: "real variability",
  lab: "controlled conditions",
};

console.log(fieldAndLab);

// Field and lab measurements answer different questions and should not be treated as interchangeable.

// ---------------------------------------------------------------------
// 37. INP and lab testing
// ---------------------------------------------------------------------

const inpLabLimitation = {
  metric: "INP",
  requiresUserInteractions: true,
  labProxy: "TBT",
};

console.log(inpLabLimitation);

// INP depends on real user interactions; lab tools can instead use related diagnostics such as Total Blocking Time.

// ---------------------------------------------------------------------
// 38. Measuring at the 75th percentile
// ---------------------------------------------------------------------

interface PercentileTarget {
  readonly metric: string;
  readonly percentile: number;
}

const percentileTarget: PercentileTarget = {
  metric: "LCP",
  percentile: 75,
};

console.log(percentileTarget);

// Core Web Vitals targets are evaluated at the 75th percentile of page loads, commonly segmented by device type.

// ---------------------------------------------------------------------
// 39. Segmenting performance data
// ---------------------------------------------------------------------

const performanceSegments = ["mobile", "desktop", "route", "country", "connection"];

console.log(performanceSegments);

// Segmentation can reveal performance problems hidden by aggregate measurements.

// ---------------------------------------------------------------------
// 40. Route-level performance
// ---------------------------------------------------------------------

interface RoutePerformance {
  readonly route: string;
  readonly lcpMs: number;
  readonly inpMs: number;
  readonly cls: number;
}

const routePerformance: RoutePerformance = {
  route: "/products",
  lcpMs: 2100,
  inpMs: 180,
  cls: 0.04,
};

console.log(routePerformance);

// Route-level measurements can identify pages whose performance differs from the overall application.

// ---------------------------------------------------------------------
// 41. Device segmentation
// ---------------------------------------------------------------------

interface DevicePerformance {
  readonly deviceClass: string;
  readonly lcpMs: number;
}

const devicePerformance: readonly DevicePerformance[] = [
  {
    deviceClass: "mobile",
    lcpMs: 2800,
  },
  {
    deviceClass: "desktop",
    lcpMs: 1900,
  },
];

console.log(devicePerformance);

// Device segmentation can expose differences caused by hardware, network, or browser conditions.

// ---------------------------------------------------------------------
// 42. Connection context
// ---------------------------------------------------------------------

interface ConnectionContext {
  readonly effectiveType: string;
  readonly downlinkMbps?: number;
}

const connectionContext: ConnectionContext = {
  effectiveType: "4g",
  downlinkMbps: 10,
};

console.log(connectionContext);

// Connection information can provide useful context when interpreting field performance data where supported.

// ---------------------------------------------------------------------
// 43. Avoid over-segmentation
// ---------------------------------------------------------------------

const segmentationPolicy = {
  usefulDimensions: ["route", "device class", "release"],
  excessiveDimensions: ["unique request identifier", "every individual user"],
};

console.log(segmentationPolicy);

// Excessive segmentation can produce sparse data and make aggregated measurements less useful.

// ---------------------------------------------------------------------
// 44. Performance budgets
// ---------------------------------------------------------------------

interface PerformanceBudget {
  readonly metric: string;
  readonly maximum: number;
  readonly unit: string;
}

const performanceBudget: PerformanceBudget = {
  metric: "JavaScript transfer size",
  maximum: 300,
  unit: "KB",
};

console.log(performanceBudget);

// Performance budgets define measurable constraints that can be checked during development and deployment.

// ---------------------------------------------------------------------
// 45. Bundle size monitoring
// ---------------------------------------------------------------------

interface BundleMeasurement {
  readonly asset: string;
  readonly compressedKb: number;
}

const bundleMeasurement: BundleMeasurement = {
  asset: "application.js",
  compressedKb: 180,
};

console.log(bundleMeasurement);

// Bundle-size measurements help detect changes in the amount of code delivered to users.

// ---------------------------------------------------------------------
// 46. Long tasks
// ---------------------------------------------------------------------

const longTaskConcept = {
  entryType: "longtask",
  indicates: "long main-thread task",
};

console.log(longTaskConcept);

// Long tasks can indicate main-thread work that delays rendering or user interaction.

// ---------------------------------------------------------------------
// 47. Long animation frames
// ---------------------------------------------------------------------

const longAnimationFrameConcept = {
  entryType: "long-animation-frame",
  usefulFor: "diagnosing long rendering frames",
};

console.log(longAnimationFrameConcept);

// Long animation frame measurements can provide additional information about rendering and interaction slowdowns where supported.

// ---------------------------------------------------------------------
// 48. Custom application timing
// ---------------------------------------------------------------------

const applicationTiming = {
  operation: "load-products",
  start: "products-load-start",
  end: "products-load-end",
};

console.log(applicationTiming);

// Application-specific timings capture operations that generic browser metrics cannot describe directly.

// ---------------------------------------------------------------------
// 49. Custom marks
// ---------------------------------------------------------------------

const markApplicationStart = (): void => {
  if (typeof performance === "undefined") {
    return;
  }

  performance.mark("products-load-start");
};

const markApplicationEnd = (): void => {
  if (typeof performance === "undefined") {
    return;
  }

  performance.mark("products-load-end");
};

console.log(markApplicationStart, markApplicationEnd);

// Custom marks define application-specific timing boundaries.

// ---------------------------------------------------------------------
// 50. Custom measure
// ---------------------------------------------------------------------

const measureApplicationOperation = (): number => {
  if (typeof performance === "undefined") {
    return 0;
  }

  try {
    const measure = performance.measure("products-load", "products-load-start", "products-load-end");

    return measure.duration;
  } catch {
    return 0;
  }
};

console.log(measureApplicationOperation);

// A custom measure calculates the elapsed time between application-specific marks.

// ---------------------------------------------------------------------
// 51. Measuring user flows
// ---------------------------------------------------------------------

interface UserFlowMeasurement {
  readonly flow: string;
  readonly durationMs: number;
  readonly outcome: "success" | "failure";
}

const userFlowMeasurement: UserFlowMeasurement = {
  flow: "checkout",
  durationMs: 820,
  outcome: "success",
};

console.log(userFlowMeasurement);

// User-flow measurements connect performance with meaningful application operations.

// ---------------------------------------------------------------------
// 52. Performance and errors
// ---------------------------------------------------------------------

const performanceAndErrors = {
  performance: "operation duration",
  errors: "operation failure",
};

console.log(performanceAndErrors);

// Performance and error telemetry together can show whether failures are associated with degraded execution.

// ---------------------------------------------------------------------
// 53. Performance and releases
// ---------------------------------------------------------------------

interface ReleasePerformance {
  readonly release: string;
  readonly p75LcpMs: number;
}

const releasePerformance: readonly ReleasePerformance[] = [
  {
    release: "example-release-a",
    p75LcpMs: 1900,
  },
  {
    release: "example-release-b",
    p75LcpMs: 2300,
  },
];

console.log(releasePerformance);

// Release-aware performance measurements help identify regressions associated with deployments.

// ---------------------------------------------------------------------
// 54. Performance regression
// ---------------------------------------------------------------------

const regressionSignals = ["higher LCP", "higher INP", "higher CLS", "longer API duration", "larger bundles"];

console.log(regressionSignals);

// A regression is identified by comparing a measurement against an established baseline or target.

// ---------------------------------------------------------------------
// 55. Baselines
// ---------------------------------------------------------------------

interface PerformanceBaseline {
  readonly metric: string;
  readonly expectedValue: number;
}

const performanceBaseline: PerformanceBaseline = {
  metric: "product-search-duration",
  expectedValue: 250,
};

console.log(performanceBaseline);

// Baselines provide a reference against which future performance measurements can be compared.

// ---------------------------------------------------------------------
// 56. Performance distributions
// ---------------------------------------------------------------------

interface PerformanceDistribution {
  readonly p50: number;
  readonly p75: number;
  readonly p95: number;
}

const performanceDistribution: PerformanceDistribution = {
  p50: 140,
  p75: 220,
  p95: 620,
};

console.log(performanceDistribution);

// Distributions reveal slow-tail behavior that averages can hide.

// ---------------------------------------------------------------------
// 57. Averages
// ---------------------------------------------------------------------

const averageDuration = 210;

console.log(averageDuration);

// Averages can summarize a dataset but should not be the only performance statistic used for user-experience analysis.

// ---------------------------------------------------------------------
// 58. Performance telemetry payload
// ---------------------------------------------------------------------

interface PerformanceTelemetry {
  readonly metric: string;
  readonly value: number;
  readonly route: string;
  readonly release: string;
}

const performanceTelemetry: PerformanceTelemetry = {
  metric: "LCP",
  value: 2100,
  route: "/products",
  release: "example-release",
};

console.log(performanceTelemetry);

// Performance telemetry should contain enough context to analyze the measurement without collecting unnecessary data.

// ---------------------------------------------------------------------
// 59. Telemetry minimization
// ---------------------------------------------------------------------

const telemetryPolicy = {
  collectMetric: true,
  collectRoute: true,
  collectRelease: true,
  collectSensitivePayload: false,
};

console.log(telemetryPolicy);

// Performance telemetry should avoid collecting unrelated personal or sensitive application data.

// ---------------------------------------------------------------------
// 60. Sampling
// ---------------------------------------------------------------------

interface SamplingConfiguration {
  readonly performanceSampleRate: number;
}

const samplingConfiguration: SamplingConfiguration = {
  performanceSampleRate: 0.1,
};

console.log(samplingConfiguration);

// Sampling can control telemetry volume while still providing a representative dataset.

// ---------------------------------------------------------------------
// 61. Sampling interpretation
// ---------------------------------------------------------------------

const sampledMeasurement = {
  value: 2100,
  sampleRate: 0.1,
};

console.log(sampledMeasurement);

// A telemetry system should retain enough sampling context to interpret collected measurements correctly.

// ---------------------------------------------------------------------
// 62. Batching
// ---------------------------------------------------------------------

const performanceBatch = {
  metrics: ["LCP", "INP", "CLS"],
  sentTogether: true,
};

console.log(performanceBatch);

// Performance measurements can be batched to reduce network overhead when immediate delivery is unnecessary.

// ---------------------------------------------------------------------
// 63. Beacon delivery
// ---------------------------------------------------------------------

const performanceDelivery = {
  preferredMechanism: "sendBeacon when appropriate",
  fallback: "fetch with keepalive when appropriate",
};

console.log(performanceDelivery);

// Background delivery mechanisms can help send telemetry without unnecessarily blocking application work.

// ---------------------------------------------------------------------
// 64. Navigation observer
// ---------------------------------------------------------------------

const observeNavigation = (callback: (entry: PerformanceNavigationTiming) => void): (() => void) | null => {
  if (typeof PerformanceObserver === "undefined") {
    return null;
  }

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry instanceof PerformanceNavigationTiming) {
        callback(entry);
      }
    });
  });

  observer.observe({
    type: "navigation",
    buffered: true,
  });

  return (): void => {
    observer.disconnect();
  };
};

console.log(observeNavigation);

// Navigation observers can capture navigation timing entries that were already recorded and those recorded later.

// ---------------------------------------------------------------------
// 65. Paint observer
// ---------------------------------------------------------------------

const observePaint = (callback: (entry: PerformanceEntry) => void): (() => void) | null => {
  if (typeof PerformanceObserver === "undefined") {
    return null;
  }

  const supported = PerformanceObserver.supportedEntryTypes.includes("paint");

  if (!supported) {
    return null;
  }

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(callback);
  });

  observer.observe({
    type: "paint",
    buffered: true,
  });

  return (): void => {
    observer.disconnect();
  };
};

console.log(observePaint);

// Optional performance entry types should be checked before they are observed.

// ---------------------------------------------------------------------
// 66. Observer support checks
// ---------------------------------------------------------------------

const supportsEntryType = (entryType: string): boolean => {
  if (typeof PerformanceObserver === "undefined") {
    return false;
  }

  return PerformanceObserver.supportedEntryTypes.includes(entryType);
};

console.log(supportsEntryType("resource"));
console.log(supportsEntryType("example-entry"));

// Support checks make instrumentation more portable across browsers.

// ---------------------------------------------------------------------
// 67. React effect instrumentation
// ---------------------------------------------------------------------

export const PerformanceObserverExample: FC = (): ReactElement => {
  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log({
          name: entry.name,
          duration: entry.duration,
          type: entry.entryType,
        });
      }
    });

    if (PerformanceObserver.supportedEntryTypes.includes("measure")) {
      observer.observe({
        type: "measure",
        buffered: true,
      });
    }

    return (): void => {
      observer.disconnect();
    };
  }, []);

  return (
    <section>
      <h2>Performance observer</h2>

      <p>Performance entries can be observed while the component is mounted.</p>
    </section>
  );
};

// React effects are an appropriate place to establish and clean up browser performance observers.

// ---------------------------------------------------------------------
// 68. Avoiding duplicate observers
// ---------------------------------------------------------------------

export const StablePerformanceMonitor: FC = (): ReactElement => {
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") {
      return;
    }

    if (observerRef.current !== null) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      console.log(list.getEntries());
    });

    observer.observe({
      type: "resource",
      buffered: true,
    });

    observerRef.current = observer;

    return (): void => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  return <p>Performance monitoring is active.</p>;
};

// A ref can hold an observer instance so the component does not create duplicate observers unnecessarily.

// ---------------------------------------------------------------------
// 69. Strict Mode and cleanup
// ---------------------------------------------------------------------

const observerLifecyclePolicy = {
  createInsideEffect: true,
  disconnectOnCleanup: true,
};

console.log(observerLifecyclePolicy);

// Correct effect cleanup prevents stale observers and duplicate instrumentation during development lifecycle checks.

// ---------------------------------------------------------------------
// 70. Server-side rendering
// ---------------------------------------------------------------------

const browserOnlyPerformanceApi = {
  performance: "browser",
  PerformanceObserver: "browser",
  serverSafeAtModuleScope: false,
};

console.log(browserOnlyPerformanceApi);

// Browser performance APIs should not be assumed to exist during server-side rendering.

// ---------------------------------------------------------------------
// 71. Hydration
// ---------------------------------------------------------------------

const hydrationPerformance = {
  serverRender: "HTML generation",
  clientHydration: "browser work",
};

console.log(hydrationPerformance);

// Client-side hydration performance is separate from server rendering time and should be measured in the appropriate environment.

// ---------------------------------------------------------------------
// 72. Server Timing
// ---------------------------------------------------------------------

const serverTimingConcept = {
  header: "Server-Timing",
  clientAccess: "navigation and resource timing entries",
};

console.log(serverTimingConcept);

// Server-Timing can expose selected backend timing information through browser performance entries.

// ---------------------------------------------------------------------
// 73. Server Timing privacy
// ---------------------------------------------------------------------

const serverTimingPolicy = {
  exposeOnlyNecessaryMetrics: true,
  exposeSensitiveInfrastructureDetails: false,
};

console.log(serverTimingPolicy);

// Server timing can reveal infrastructure information, so exposed metrics should be intentionally selected.

// ---------------------------------------------------------------------
// 74. Performance endpoint
// ---------------------------------------------------------------------

interface PerformanceEndpoint {
  readonly path: string;
  readonly method: string;
}

const performanceEndpoint: PerformanceEndpoint = {
  path: "/performance",
  method: "POST",
};

console.log(performanceEndpoint);

// A dedicated telemetry endpoint can receive selected performance measurements from the browser.

// ---------------------------------------------------------------------
// 75. Failed telemetry requests
// ---------------------------------------------------------------------

const telemetryFailurePolicy = {
  applicationContinues: true,
  retryIndefinitely: false,
};

console.log(telemetryFailurePolicy);

// Performance telemetry failures should not interfere with the application's primary functionality.

// ---------------------------------------------------------------------
// 76. Performance dashboards
// ---------------------------------------------------------------------

const performanceDashboard = ["LCP p75", "INP p75", "CLS p75", "route duration", "resource duration", "release"];

console.log(performanceDashboard);

// Dashboards should expose user-centric metrics alongside diagnostic application measurements.

// ---------------------------------------------------------------------
// 77. Performance alerts
// ---------------------------------------------------------------------

interface PerformanceAlert {
  readonly metric: string;
  readonly threshold: number;
  readonly unit: string;
}

const performanceAlert: PerformanceAlert = {
  metric: "product-search-duration",
  threshold: 1000,
  unit: "ms",
};

console.log(performanceAlert);

// Alerts should use application-specific thresholds that reflect meaningful operational degradation.

// ---------------------------------------------------------------------
// 78. Performance regression workflow
// ---------------------------------------------------------------------

const performanceRegressionWorkflow = [
  "measure",
  "segment",
  "compare baseline",
  "identify affected release",
  "inspect underlying resources",
  "profile the slow operation",
  "optimize",
  "measure again",
];

console.log(performanceRegressionWorkflow);

// Performance monitoring is useful when measurements lead to investigation, optimization, and verification.

// ---------------------------------------------------------------------
// 79. Complete performance monitoring example
// ---------------------------------------------------------------------

interface PerformanceMonitorProps {
  readonly release: string;
}

export const PerformanceMonitor: FC<PerformanceMonitorProps> = ({ release }): ReactElement => {
  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") {
      return;
    }

    const supported = PerformanceObserver.supportedEntryTypes.includes("navigation");

    if (!supported) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry instanceof PerformanceNavigationTiming) {
          console.log({
            metric: "navigation",
            duration: entry.duration,
            release,
            navigationType: entry.type,
          });
        }
      }
    });

    observer.observe({
      type: "navigation",
      buffered: true,
    });

    return (): void => {
      observer.disconnect();
    };
  }, [release]);

  return (
    <section>
      <h2>Performance monitoring</h2>

      <p>Release: {release}</p>

      <p>Browser performance entries are monitored when supported.</p>
    </section>
  );
};

// The integrated example observes browser navigation timing while associating measurements with a release.

// ---------------------------------------------------------------------
// 80. Final performance-monitoring model
// ---------------------------------------------------------------------

const finalPerformanceMonitoringModel = {
  measure: [
    "navigation timing",
    "resource timing",
    "paint timing",
    "custom marks",
    "custom measures",
    "application operations",
  ],
  userExperience: ["LCP", "INP", "CLS"],
  analyze: ["field data", "lab data", "percentiles", "segments", "baselines", "releases"],
  operate: ["sampling", "batching", "telemetry delivery", "dashboards", "alerts"],
};

console.log(finalPerformanceMonitoringModel);

export default PerformanceMonitor;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Performance monitoring measures loading, rendering, responsiveness, visual stability, and application operations.
// - The browser Performance API exposes standardized performance entries and custom timing mechanisms.
// - PerformanceObserver can observe performance entries as they are recorded and can request buffered entries.
// - Browser support for individual performance entry types should be checked before optional instrumentation is enabled.
// - Navigation Timing measures the lifecycle of the current document navigation.
// - Resource Timing provides detailed measurements for resources such as scripts, stylesheets, images, fonts, and network requests.
// - performance.now() provides a high-resolution monotonic clock for measuring elapsed time.
// - Performance marks represent named points, while performance measures represent elapsed time between marks.
// - LCP measures loading performance and is a Core Web Vital.
// - INP measures responsiveness across qualifying user interactions throughout the page lifecycle.
// - CLS measures unexpected visual layout instability.
// - The current Core Web Vitals are LCP, INP, and CLS.
// - Recommended good thresholds are LCP at 2.5 seconds or less, INP at 200 milliseconds or less, and CLS at 0.1 or less.
// - Core Web Vitals are commonly evaluated at the 75th percentile and segmented by device type.
// - Real User Monitoring collects performance data from actual users in their production environments.
// - Lab measurements provide controlled conditions that are useful for development, CI, and regression testing.
// - Lab and field measurements answer different questions and should not be treated as interchangeable.
// - INP requires user interaction, so lab tools use related metrics such as Total Blocking Time for diagnostics.
// - Custom application timings measure operations that generic browser metrics cannot describe directly.
// - Performance distributions reveal slow-tail behavior that averages can hide.
// - Route, device, connection, and release segmentation can reveal regressions hidden by aggregate measurements.
// - Excessive segmentation can produce sparse data and reduce the usefulness of aggregated measurements.
// - Performance budgets provide measurable constraints for assets, operations, and user-facing metrics.
// - Release-aware measurements help associate performance regressions with deployments.
// - Server-Timing can expose selected backend timing information through browser performance entries.
// - Server timing should avoid exposing unnecessary infrastructure or sensitive information.
// - Performance telemetry should minimize collected data and avoid unrelated personal or sensitive information.
// - Sampling and batching can reduce telemetry overhead while retaining useful measurements.
// - Performance telemetry failures should not prevent the application from functioning.
// - Browser performance APIs should be accessed only in browser-safe execution paths when server-side rendering is possible.
// - React effects provide a suitable lifecycle for creating and cleaning up PerformanceObserver instances.
// - Performance monitoring is most useful when measurements are compared against baselines, investigated, optimized, and measured again.
