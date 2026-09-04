# HTTP Client Libraries Architecture and Specifications

Modern web applications execute network requests using either browser-native APIs or third-party client abstraction
libraries. Standardized in the WHATWG HTML and API specifications, the native `fetch()` interface provides a low-level
Promise-based mechanism for fetching resources over HTTP. Unlike legacy `XMLHttpRequest`, `fetch()` exposes streaming
`Request` and `Response` objects built upon the WHATWG Streams API. However, native `fetch()` does not reject its
returned Promise on HTTP error status codes like 404 or 500, requiring manual verification of the `response.ok` boolean
property. Higher-level libraries such as Axios abstract these low-level mechanics, providing automatic JSON payload
serialization and deserialization, client-side request and response interceptor pipelines, built-in request
cancellation, and automatic HTTP error rejection for non-2xx status codes.

| Client Feature             | Native Fetch API                    | Axios Library                        | Node.js Native HTTP             |
|:---------------------------|:------------------------------------|:-------------------------------------|:--------------------------------|
| **Execution Environment**  | Browsers, Node.js 18+, Deno, Bun    | Browsers, Node.js                    | Node.js Runtime Only            |
| **Automatic JSON Parsing** | Manual (`response.json()`)          | Automatic                            | Manual Buffer Concatenation     |
| **Error Handling**         | Rejects strictly on network failure | Rejects on non-2xx HTTP status codes | Emits stream error events       |
| **Request Interceptors**   | Manual wrapper functions            | Built-in `interceptors.request`      | Requires custom module wrappers |
| **Request Cancellation**   | `AbortController` / `AbortSignal`   | `AbortController` or `CancelToken`   | `ClientRequest.destroy()`       |

## Request Cancellation & Timeout Management

Managing long-running or obsolete HTTP requests requires explicit cancellation signals to free up system memory and
prevent race conditions in asynchronous user interfaces. Standardized across browser DOM and Node.js environments, the
`AbortController` interface provides a unified cancellation mechanism. When instantiated, an `AbortController` exposes
an `AbortSignal` object that is passed into client HTTP request configuration options. Calling `controller.abort()`
dispatches an abort event to the signal, immediately terminating underlying TCP socket operations and rejecting the
pending request promise with an `AbortError`:

1. **Controller Instantiation:** Instantiate an `AbortController` instance before triggering an asynchronous HTTP
   network request.
2. **Signal Assignment:** Pass the `controller.signal` property into the fetch options object or client library
   configuration.
3. **Timer Configuration:** Configure a timeout timer using `setTimeout()` or `AbortSignal.timeout()` to enforce maximum
   request duration bounds.
4. **Signal Dispatch:** Invoke `controller.abort()` when the execution timer elapses or when user interaction renders
   the pending request obsolete.

## Best Practices

* **Explicitly Verify Response Status in Fetch:** Always check `response.ok` or `response.status` when using native
  `fetch()` to handle 4xx and 5xx HTTP responses correctly.
* **Enforce Global Request Timeouts:** Attach `AbortSignal.timeout()` signals to every outgoing network request to
  prevent hanging sockets and unhandled memory leaks.
* **Centralize Authentication via Interceptors:** Utilize request interceptors in client libraries to inject fresh OAuth
  tokens or `Authorization` headers dynamically before requests leave the client process.
* **Leverage Streaming for Large Payloads:** Process high-volume HTTP response bodies using `response.body`
  `ReadableStream` interfaces rather than buffering entire payloads into memory at once.