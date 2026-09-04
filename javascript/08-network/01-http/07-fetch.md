# Fetch API

The `fetch()` API provides a modern, promise-based interface for issuing HTTP requests and handling responses directly
within web browsers, serving as the standard replacement for legacy `XMLHttpRequest` implementations. Designed around
native JavaScript promises, `fetch()` simplifies asynchronous network communication by eliminating cumbersome event
listener boilerplate and enabling clean integration with `async` and `await` syntax. The global `fetch()` method accepts
a resource path or URL and an optional configuration object specifying HTTP methods, custom headers, request bodies, and
caching credentials, returning a promise that resolves to a `Response` object.

Creating and sending `GET` requests using the `fetch()` API requires minimal configuration, as `GET` serves as the
default HTTP method when no options object is provided. To retrieve data, developers pass a target URL string to
`fetch()`, await the returned promise to obtain the `Response` object, and subsequently call response methods like
`.json()` or `.text()` to parse the underlying payload. Because `fetch()` does not automatically reject on HTTP error
statuses such as 404 or 500—treating any completed network exchange as a successful resolution—developers must
explicitly check the `response.ok` boolean property to detect server errors.

| Fetch Operation | Implementation Approach                                      | Response Processing                                     |
|:----------------|:-------------------------------------------------------------|:--------------------------------------------------------|
| `GET` Requests  | `fetch(url)`                                                 | Awaits response and parses body via `.json()`.          |
| `POST` Requests | `fetch(url, { method: 'POST', body: JSON.stringify(data) })` | Transmits serialized payloads with appropriate headers. |
| Error Handling  | Inspecting `response.ok` boolean flag                        | Manually throws errors for non-2xx HTTP status codes.   |

Sending `POST` requests and transmitting data payloads requires configuring the options parameter passed to the
`fetch()` function with an explicit `method` property set to `'POST'`, along with a properly formatted `body` and
matching `headers`. When sending structured data such as JSON objects, developers must serialize the payload using
`JSON.stringify()` and explicitly set the `Content-Type` header to `application/json` so the server can correctly
interpret the incoming stream. The server's response can then be awaited, parsed, and integrated into the application's
state flow seamlessly.

Error handling with the `fetch()` API requires a dual-layer strategy to capture both network-level failures and
HTTP-level status errors. Network-level failures—such as complete connection drops, DNS resolution failures, or CORS
blocks—cause the `fetch()` promise to reject outright, which can be intercepted using a `try-catch` block or `.catch()`
handler. Conversely, HTTP-level failures where the server responds with a 400 or 500 status code result in a fulfilled
promise, requiring developers to evaluate `response.ok` and manually throw an error if the status falls outside the
successful range.

## Best Practices

* **HTTP Status Checking:** Always check `response.ok` after a fetch call to handle 4xx and 5xx server errors, as
  `fetch()` does not reject on HTTP error codes.
* **Content-Type Heading:** Explicitly set appropriate `Content-Type` headers when transmitting serialized JSON bodies
  via `POST` or `PUT` requests.
* **Try-Catch Integration:** Wrap `fetch()` calls in `try-catch` blocks to gracefully intercept network disconnections
  and DNS resolution failures.
* **Response Body Consumption:** Consume response bodies exactly once using `.json()` or `.text()`, as stream readers
  cannot be read multiple times.
* **Cancel Requests with AbortController:** Use `AbortController` and `AbortSignal` to cancel pending fetch requests
  when components unmount or user interactions change.
* **Handle Stream Parsing Safely:** Wrap `.json()` parsing in try-catch blocks to prevent syntax errors when servers
  return malformed payloads or empty responses.
* **Configure Credentials Explicitly:** Set the `credentials` property (e.g., `'include'`, `'same-origin'`) in fetch
  options when cross-origin requests require cookies or authorization tokens.
* **Avoid Nested Fetch Calls:** Flatten asynchronous fetch dependencies using `Promise.all()` or sequential
  `async/await` flows instead of nesting requests inside `.then()` handlers.
* **Set Request Timeouts:** Combine `AbortController` with `setTimeout` to implement reliable request timeouts for slow
  network connections.
* **Stream Large Payloads:** Utilize response body reader streams (`response.body.getReader()`) when downloading or
  processing large files to monitor download progress.
* **Validate Response Headers:** Inspect `response.headers.get('content-type')` before parsing response bodies to ensure
  the incoming data matches expected formats.
* **Avoid Memory Leaks with Readers:** Ensure stream readers are locked and released properly if response processing is
  aborted or encounters runtime errors.
* **Cache Fetch Responses Cautiously:** Configure the `cache` option appropriately (`'no-cache'`, `'reload'`, etc.) to
  control browser caching behavior for dynamic endpoints.
* **Isolate Fetch Logic into Services:** Encapsulate fetch calls and base URLs into modular API service functions to
  promote code reusability and maintainability.
* **Test Fetch with Mocks:** Use tools like `vi.stubGlobal('fetch', ...)` or network mocking libraries to write robust
  unit tests for API integration logic.
* **Log Request Metrics:** Measure and track fetch execution durations to identify slow network endpoints and monitor
  application performance.
* **Handle CORS Restrictive Environments:** Ensure backend servers provide proper CORS headers when cross-origin fetch
  requests require custom headers or credentials.
* **Sanitize Query Parameters:** Use `URLSearchParams` to format and encode URL query strings safely before appending
  them to fetch target endpoints.
* **Normalize Error Responses:** Standardize error objects thrown after failed `response.ok` checks to maintain
  consistent error handling across the application.
* **Use Relative URLs Wisely:** Ensure fetch paths leverage appropriate base configurations or environment variables to
  prevent broken routing in different deployment stages.
* **Prevent Duplicate Submissions:** Disable form submit buttons or use loading states during active `POST` fetches to
  prevent accidental duplicate requests.
* **Document API Contracts:** Maintain clear documentation of request body schemas and response structures for all
  fetch-based endpoints.