# Network Performance Monitoring and Telemetry Specifications

The W3C Resource Timing API provides detailed latency metrics for every network resource fetched by a web application,
including scripts, stylesheets, images, and asynchronous fetch or XHR requests. Exposed via
`performance.getEntriesByType('resource')` and the `PerformanceObserver` interface, the API records high-resolution
timestamps (accurate to microseconds) marking key phases of the network transport pipeline. By measuring phase
transitions, applications can isolate performance bottlenecks occurring during DNS resolution, TCP handshake, TLS
negotiation, request dispatch, and response payload downloading.

| Timing Phase           | Metric Name                             | Operational Description                                                                      |
|:-----------------------|:----------------------------------------|:---------------------------------------------------------------------------------------------|
| **Redirection**        | `redirectStart` / `redirectEnd`         | Measures duration spent processing HTTP redirects before contacting the target host.         |
| **DNS Lookup**         | `domainLookupStart` / `domainLookupEnd` | Records timestamps for domain name resolution over DNS infrastructure.                       |
| **TCP Handshake**      | `connectStart` / `connectEnd`           | Captures duration required to establish the initial TCP socket connection.                   |
| **TLS Negotiation**    | `secureConnectionStart`                 | Marks the initiation of the TLS cryptographic handshake over an active socket.               |
| **Time to First Byte** | `requestStart` / `responseStart`        | Measures duration from request dispatch until the arrival of the first response byte (TTFB). |
| **Payload Transfer**   | `responseStart` / `responseEnd`         | Captures duration spent streaming the remaining response payload bytes over the wire.        |

## Real User Monitoring & Telemetry

Real User Monitoring (RUM) relies on collecting client-side network performance data and transmitting it back to
analytics collectors without negatively impacting ongoing user interactions or page navigation. The
`PerformanceObserver` API allows asynchronous observation of network performance entries as they occur, avoiding
high-overhead polling of the performance timeline. To transmit collected telemetry logs safely during page unloads or
visibility changes, applications utilize `navigator.sendBeacon()`, which enqueues non-blocking HTTP POST requests that
the user agent guarantees to deliver even if the browser tab or document context terminates:

1. **Observer Initialization:** Instantiate a `PerformanceObserver` object targeting `resource` and `navigation`
   performance entry types.
2. **Latency Calculation:** Calculate individual phase latencies by subtracting phase start timestamps from phase end
   timestamps.
3. **Initiator Filtering:** Filter entries by resource initiator type (`fetch`, `xmlhttprequest`, `script`) to isolate
   specific API bottlenecks.
4. **Telemetry Dispatch:** Serialize performance metrics into lightweight JSON payloads and dispatch them using
   `navigator.sendBeacon()`.

## Best Practices

* **Transmit Telemetry with sendBeacon:** Use `navigator.sendBeacon()` or `fetch()` with `keepalive: true` to send
  performance telemetry without blocking page navigation.
* **Serve Timing-Allow-Origin Headers:** Configure backend servers to return `Timing-Allow-Origin` headers on
  cross-origin resources to expose detailed TCP, TLS, and DNS metrics to client scripts.
* **Use PerformanceObserver Over Static Queries:** Observe performance entries asynchronously using
  `PerformanceObserver` instead of periodically polling `performance.getEntries()`.
* **Isolate Network Latency from Render Time:** Separate Time to First Byte (TTFB) and network transport durations from
  client-side DOM parsing and rendering metrics to pinpoint root causes accurately.
* **Filter telemetry entries efficiently:** Discard irrelevant third-party analytics or static asset pings early within
  `PerformanceObserver` callbacks to minimize CPU overhead.
* **Monitor Cumulative Layout Shift (CLS):** Track visual stability metrics alongside network performance entries to
  understand how slow-loading assets affect page rendering.
* **Sample high-frequency telemetry data:** Implement client-side sampling rates for performance metrics to prevent
  overwhelming analytics ingestion endpoints at scale.
* **Sanitize telemetry payload metadata:** Strip query parameters, sensitive user identifiers, and authorization tokens
  from resource URLs before transmitting telemetry.
* **Measure interaction to next paint (INP):** Audit user responsiveness metrics alongside network latency to diagnose
  main-thread bottlenecks during data fetches.
* **Audit timing precision limits:** Account for browser security mitigations (such as timing coarse-graining) when
  analyzing microsecond performance entries.
* **Leverage server-timing headers:** Inject `Server-Timing` headers in API responses to correlate client-side network
  metrics with backend database and service processing times.
* **Track resource transfer size inflation:** Monitor encoded body sizes versus decoded body sizes to identify
  opportunities for asset compression and optimization.
* **Observe long animation frames (LoAF):** Utilize the Long Animation Frame API to detect heavy script evaluations
  triggered by incoming network payloads.
* **Buffer performance entries safely:** Utilize performance entry buffers effectively or configure appropriate buffered
  flags when observing startup resources.
* **Correlate errors with performance drops:** Combine network latency telemetry with client-side exception logs to
  diagnose failures during slow connection states.
* **Monitor connection reuse efficiency:** Audit the frequency of reused persistent connections versus new handshakes to
  optimize server keep-alive policies.
* **Test RUM scripts on low-end devices:** Verify that client-side performance monitoring scripts do not introduce
  memory leaks or jank on mobile hardware.
* **Establish performance baseline budgets:** Set automated CI/CD performance budgets based on Resource Timing metrics
  to catch latency regressions early.
* **Configure reporting endpoints securely:** Ensure telemetry ingestion servers implement rate limiting, CORS
  restrictions, and robust payload validation.
* **Track DNS lookup duration trends:** Monitor regional DNS resolution latencies to evaluate global CDN and DNS
  provider performance.
* **Analyze TTFB across distinct geographies:** Segment Time to First Byte telemetry by user region to identify edge
  server and routing bottlenecks.
* **Review resource caching effectiveness:** Inspect transfer sizes and caching headers to ensure static resources
  leverage browser caches properly.