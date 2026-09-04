# XMLHttpRequest (XHR)

The `XMLHttpRequest` (XHR) API is the foundational browser interface that introduced asynchronous HTTP request
capability to JavaScript, enabling client-side scripts to transfer data to and from a web server without requiring full
page reloads. Operating on an event-driven model, XHR provides granular control over network requests, allowing web
applications to configure HTTP methods, inspect transport headers, monitor real-time upload/download progress, and
handle incoming response payloads across diverse data formats.

| API Property / Method       | Type / Signature     | Primary Operational Function                                                                  |
|:----------------------------|:---------------------|:----------------------------------------------------------------------------------------------|
| `readyState`                | Property (Read-Only) | Returns an integer (0–4) representing the current state of the request lifecycle.             |
| `status` / `statusText`     | Property (Read-Only) | Contains the HTTP status code (e.g., `200`, `404`) and status message returned by the server. |
| `responseText` / `response` | Property (Read-Only) | Contains the raw text payload or processed response data based on `responseType`.             |
| `open()`                    | Method               | Initializes a request by specifying the HTTP method, target URL, and async flag.              |
| `send()`                    | Method               | Dispatches the HTTP request to the server, optionally accepting a payload body.               |
| `setRequestHeader()`        | Method               | Injects a custom HTTP header name/value pair into the pending request.                        |
| `abort()`                   | Method               | Immediately terminates the pending request and resets the object instance.                    |
| `onload` / `onerror`        | Event Handler        | Fires when the request successfully completes or encounters a network-level failure.          |

Executing an XHR request relies on tracking the object's `readyState` property through five distinct lifecycle stages.
When instantiated via `new XMLHttpRequest()`, the request starts at state `0` (`UNSENT`). Calling `.open()` transitions
it to state `1` (`OPENED`), establishing the request configuration. Executing `.send()` transmits the request over the
network; upon receiving the response headers from the server, the state advances to `2` (`HEADERS_RECEIVED`). As the
response body streams in, the state becomes `3` (`LOADING`). Finally, when the entire payload is fully received and
processed, the state reaches `4` (`DONE`).

```
[0: UNSENT] ──.open()──> [1: OPENED] ──.send()──> [2: HEADERS_RECEIVED] ──> [3: LOADING] ──> [4: DONE]
```

To handle incoming responses, developers configure event listeners rather than synchronously blocking execution threads.
While legacy XHR implementations monitored state changes via the `onreadystatechange` callback (verifying
`readyState === 4` and `status === 200`), modern XHR uses dedicated event listeners such as `onload`, `onerror`,
`ontimeout`, and `onprogress`. Setting the `responseType` property (such as `'json'`, `'blob'`, or `'arraybuffer'`)
instructs the browser to parse incoming payloads automatically before raising the `onload` event, eliminating manual
string parsing in application logic.

For data uploads and POST operations, request payloads are passed directly to `.send()`. When transmitting structured
data such as JSON, client applications must explicitly invoke `.setRequestHeader('Content-Type', 'application/json')`
prior to dispatching `.send(JSON.stringify(payload))` so the receiving server correctly parses the incoming body.
Additionally, XHR supports cross-origin requests governed by Cross-Origin Resource Sharing (CORS) policies and provides
fine-grained control over credential transmission via the `withCredentials` boolean flag.

## Best Practices

* **Migrate to Modern APIs:** Prefer `fetch()` or third-party abstractions like `axios` for new feature development, as
  XHR relies on callback/event patterns rather than native Promises.
* **Use Modern Event Listeners:** Utilize `onload`, `onerror`, and `ontimeout` event handlers instead of manually
  checking `readyState` inside `onreadystatechange`.
* **Explicitly Define Request Timeouts:** Always set the `timeout` property (in milliseconds) and handle the `ontimeout`
  event to prevent hanging socket connections.
* **Leverage Native Response Parsing:** Set `xhr.responseType = 'json'` before sending requests so the browser
  automatically parses JSON payloads, avoiding manual parsing errors.
* **Always handle network errors:** Attach an `onerror` listener to capture DNS failures, offline status, or connection
  drops that prevent XHR execution.
* **Verify HTTP status codes manually:** Remember that XHR treats HTTP error responses (such as 404 or 500) as
  successful network completions, requiring explicit checks against `xhr.status`.
* **Clean up event listeners:** Remove active event listeners or discard XHR instances properly when components unmount
  to prevent browser memory leaks.
* **Manage request cancellation:** Use `xhr.abort()` to cancel long-running or obsolete requests when users navigate
  away or trigger conflicting actions.
* **Set appropriate Content-Type headers:** Always specify matching request headers like `application/json` before
  dispatching serialized payloads via `.send()`.
* **Configure credentials securely:** Set `xhr.withCredentials = true` only when cross-origin requests explicitly
  require cookies or HTTP authentication headers.
* **Monitor upload and download progress:** Utilize the `onprogress` event on `xhr` and `xhr.upload` to render real-time
  progress bars for large file transfers.
* **Avoid synchronous XHR requests:** Never pass `false` as the third argument to `.open()`, as synchronous XHR locks
  the main browser thread and causes UI freezing.
* **Sanitize request payloads:** Ensure all data passed to `.send()` is properly serialized and validated to prevent
  runtime type exceptions during transmission.
* **Handle legacy browser quirks:** Implement proper feature detection or fallbacks when using XHR properties across
  diverse enterprise browser environments.
* **Isolate XHR utility logic:** Wrap XHR calls inside reusable service functions or Promise wrappers to maintain clean
  architecture separation.
* **Test network failure scenarios:** Write integration tests mocking various XHR error states and timeout thresholds to
  verify frontend resilience.
* **Protect against XSRF vulnerabilities:** Implement anti-forgery tokens alongside custom headers when performing
  state-altering XHR operations.
* **Monitor header size limits:** Avoid sending excessively large custom headers via `.setRequestHeader()` to prevent
  server rejection.
* **Reuse XHR instances cautiously:** Prefer instantiating a fresh `new XMLHttpRequest()` for each request rather than
  reusing stateful objects.
* **Log XHR lifecycle metrics:** Track request durations and failure codes in monitoring tools to diagnose network
  performance issues.
* **Handle MIME type sniffing risks:** Ensure servers return strict `Content-Type` headers to prevent browsers from
  misinterpreting raw XHR response bodies.
* **Document API integration dependencies:** Clearly outline required request configurations and expected response types
  for all legacy XHR modules.