# Performance Object in JavaScript

## Performance Architecture and Core Capabilities

The `performance` object provides access to high-resolution performance timing data, allowing web applications to
measure script execution speeds, network request latencies, and rendering milestones with microsecond precision.
Attached to `window.performance`, the performance interface integrates the High Resolution Time API, User Timing API,
Resource Timing API, and PerformanceObserver infrastructure, enabling robust frontend telemetry and optimization
analysis.

| Capability Feature        | Target Property / Interface      | Operational Role                                           |
|:--------------------------|:---------------------------------|:-----------------------------------------------------------|
| **High-Resolution Clock** | `performance.now()`              | Measuring sub-millisecond elapsed execution time           |
| **Resource Timings**      | `performance.getEntriesByType()` | Inspecting network resource fetch metrics                  |
| **Performance Observer**  | `PerformanceObserver`            | Asynchronously listening for telemetry performance entries |

## High-Resolution Timing and Time Origins

Unlike `Date.now()`, which returns system clock timestamps vulnerable to user clock adjustments, `performance.now()`
returns a high-resolution monotonic timestamp representing milliseconds elapsed since the performance time origin (
navigation start).

| Timing Method              | Functional Signature     | Primary Purpose                                        |
|:---------------------------|:-------------------------|:-------------------------------------------------------|
| **Monotonic Clock**        | `performance.now()`      | Acquiring precise relative timestamps for benchmarking |
| **Time Origin Inspection** | `performance.timeOrigin` | Absolute high-resolution epoch start time              |

## User Timing and Memory Introspection

The Performance interface allows developers to mark custom timeline milestones and measure intervals between them using
named performance marks and measures.

| Telemetry Sub-System     | Access Method / Property   | Operational Target                                     |
|:-------------------------|:---------------------------|:-------------------------------------------------------|
| **Custom Milestones**    | `performance.mark(name)`   | Creating timestamp markers on the timeline             |
| **Interval Measurement** | `performance.measure(...)` | Calculating durations between custom performance marks |
| **Memory Heap Usage**    | `performance.memory`       | Inspecting JS memory heap size (browser-specific)      |

## Use Cases

* **Frontend Code Benchmarking:** Measuring execution durations of complex algorithms using `performance.now()` start
  and end stamps.
* **Network Latency Auditing:** Analyzing `performance.getEntriesByType('resource')` to identify slow-loading scripts or
  API endpoints.
* **Real User Monitoring (RUM):** Capturing performance metrics and dispatching telemetry payloads to analytics
  collectors.
* **Long Animation Frame Detection:** Monitoring rendering frame drops to maintain smooth 60fps UI interactions.

## Best Practices

* **Prefer performance.now() Over Date.now():** Use `performance.now()` for benchmarking script execution durations to
  avoid inaccuracies caused by system clock adjustments.
* **Leverage PerformanceObserver:** Observe performance entries asynchronously via `PerformanceObserver` rather than
  polling `performance.getEntries()` repeatedly.
* **Clean Up Performance Buffers:** Clear custom marks and measures using `performance.clearMarks()` when profiling
  sessions conclude to prevent memory accumulation.
* **Sample Telemetry Data:** Implement client-side sampling rates when collecting performance telemetry at scale to
  avoid overwhelming analytics ingestion servers.
