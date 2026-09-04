# Server-Sent Events Client API Specification

The browser-native `EventSource` API provides a specialized JavaScript interface designed to receive unidirectional text
streams pushed from a web server over standard HTTP. According to the HTML Living Standard, initiating a connection
requires instantiating the global `EventSource` constructor with a target endpoint URL. The client establishes a
persistent connection using the `text/event-stream` MIME type, automatically handling HTTP redirects, network dropouts,
and reconnection attempts without requiring manual client-side polling logic. The `EventSource` instance exposes
read-only properties that allow applications to monitor connection progression, inspect destination URLs, and configure
cross-origin credential parameters.

| API Attribute     | Return Type | Operational Description                                                                                       |
|:------------------|:------------|:--------------------------------------------------------------------------------------------------------------|
| `readyState`      | `Number`    | Holds a numeric constant representing connection status: `0` (`CONNECTING`), `1` (`OPEN`), or `2` (`CLOSED`). |
| `url`             | `String`    | Returns the absolute URL string defined during constructor instantiation.                                     |
| `withCredentials` | `Boolean`   | Specifies whether cross-origin requests transmit cookies and HTTP authorization headers.                      |
| `close()`         | `Method`    | Terminates the open HTTP connection permanently and halts further automatic reconnection attempts.            |

## Lifecycle Event Handling & Stream Processing

The `EventSource` API relies on an asynchronous event listener model to process incoming server messages and connection
state transitions. When the server pushes data, the client dispatches generic message events or custom named events
depending on the frame fields defined in the event stream. Standard event target properties manage connection lifecycle
events, while custom stream events require registering explicit event listeners using the `addEventListener()` method.

1. **Instantiation:** Instantiate the `EventSource` client object by passing an absolute destination URL string into the
   constructor.
2. **Connection Initialization:** Attach an event callback function to the `onopen` property to execute initialization
   logic when the HTTP channel opens.
3. **Event Registration:** Register targeted callbacks using `addEventListener()` to handle specific custom event names
   dispatched by the server.
4. **Stream Termination:** Call the `close()` method on the `EventSource` instance when the client no longer requires
   real-time stream updates.

## Best Practices

* **Manage Connection Cleanups:** Invoke the `close()` method explicitly when navigating away from stream components to
  prevent background HTTP connection leaks.
* **Handle Network Disruptions:** Register custom error callbacks on the `onerror` property to detect stream failures
  and update user interface indicators.
* **Configure Cross-Origin Credentials:** Set the `withCredentials` option explicitly in the configuration object when
  streaming data across distinct domain boundaries.
* **Utilize Custom Event Names:** Direct server streams using distinct event names to simplify client message handling
  and reduce parsing overhead inside event callbacks.
* **Monitor readyState transitions:** Check `readyState` states (`CONNECTING`, `OPEN`, `CLOSED`) within event listeners
  to accurately reflect real-time network statuses in user interfaces.
* **Handle reconnection state resets:** Reset application buffer or loading states appropriately when `EventSource`
  automatically recovers from transient network drops.
* **Avoid redundant connection instantiations:** Cache and share single `EventSource` instances across modular
  components instead of opening multiple streams to the same endpoint.
* **Verify server response headers:** Ensure backend endpoints explicitly return `text/event-stream` and
  `Cache-Control: no-cache` to prevent client parsing errors.
* **Sanitize incoming event data:** Validate and parse `event.data` strings safely inside message handlers to prevent
  runtime type crashes from unexpected payloads.
* **Handle missing event IDs gracefully:** Implement fallback sequence tracking on the client when servers omit `id`
  fields in event stream frames.
* **Clean up event listeners on unmount:** Remove explicit event listeners bound via `addEventListener` when components
  teardown to prevent memory leaks.
* **Guard against browser memory leaks:** Nullify `EventSource` references completely after invoking `.close()` to
  ensure proper garbage collection of stream handlers.
* **Test offline fallback behavior:** Simulate browser offline states and network drops using developer tools to verify
  `EventSource` automatic reconnection logic.
* **Configure proxy keep-alive timeouts:** Ensure intermediate reverse proxies are configured with timeout thresholds
  longer than server-side heartbeat intervals.
* **Avoid mixing SSE with binary streams:** Restrict `EventSource` consumption strictly to UTF-8 text streams and handle
  binary payloads via WebSockets or Fetch streams.
* **Throttle UI updates for rapid streams:** Batch or debounce high-frequency state updates received from `EventSource`
  messages to maintain smooth browser rendering performance.
* **Secure custom headers with polyfills:** Utilize fetch-based SSE client implementations when custom authentication
  headers cannot be passed via the native constructor.
* **Log connection errors for auditing:** Transmit stream connection error metrics to centralized monitoring platforms
  to track client-side network reliability.
* **Respect browser connection limits:** Design application architectures to stay well within browser per-domain
  HTTP/1.1 persistent connection caps.
* **Validate event origin security:** Inspect `event.origin` where applicable to ensure incoming SSE messages originate
  from trusted backend domains.
* **Document client event payload schemas:** Maintain clear TypeScript interfaces or type contracts for all data objects
  parsed from SSE message events.
* **Handle browser tab visibility changes:** Pause or close idle SSE streams using the Page Visibility API to conserve
  client battery life and server resources.