# HTTP Methods

HTTP methods define the semantic operations that clients can perform on resources across the World Wide Web, serving as
the foundational verbs of web architecture. Each method carries specific guarantees regarding safety, idempotency, and
caching behavior, which allow intermediate proxies, browsers, and servers to optimize network traffic and maintain data
integrity. Understanding these methods is essential for designing RESTful APIs and building robust client-server
applications that interact correctly with web infrastructure.

| HTTP Method | Safety & Idempotency      | Primary Purpose                                                       |
|:------------|:--------------------------|:----------------------------------------------------------------------|
| `GET`       | Safe and Idempotent       | Retrieves resource representations without altering server state.     |
| `HEAD`      | Safe and Idempotent       | Retrieves response headers matching a `GET` request without a body.   |
| `POST`      | Unsafe and Non-idempotent | Submits new data entities or triggers server-side actions.            |
| `PUT`       | Unsafe and Idempotent     | Replaces an existing resource entirely or creates it if missing.      |
| `PATCH`     | Unsafe and Non-idempotent | Applies partial modifications or updates to an existing resource.     |
| `DELETE`    | Unsafe and Idempotent     | Removes a targeted resource representation from the server.           |
| `OPTIONS`   | Safe and Idempotent       | Queries supported HTTP methods, capabilities, and CORS policies.      |
| `CONNECT`   | Unsafe and Non-idempotent | Establishes a transparent TCP/IP tunnel through an HTTP proxy.        |
| `TRACE`     | Safe and Idempotent       | Performs loop-back diagnostic reflection of received request headers. |
| `PROPFIND`  | Safe and Idempotent       | Retrieves metadata properties from a WebDAV resource or directory.    |
| `PROPPATCH` | Unsafe and Idempotent     | Updates or removes custom metadata properties on a WebDAV resource.   |
| `MKCOL`     | Unsafe and Idempotent     | Creates a new collection resource or folder directory structure.      |
| `COPY`      | Unsafe and Idempotent     | Duplicates a resource or collection structure to a destination URI.   |
| `MOVE`      | Unsafe and Idempotent     | Relocates a resource or collection structure to a destination URI.    |
| `LOCK`      | Unsafe and Non-idempotent | Obtains an exclusive or shared write lock on a target resource.       |
| `UNLOCK`    | Unsafe and Idempotent     | Removes an active write lock from a resource using a lock token.      |

HTTP method behavior relies on three core protocol properties: **safety**, **idempotency**, and **cacheability**. Safe
methods (`GET`, `HEAD`, `OPTIONS`, `TRACE`, `PROPFIND`) are strictly read-only and must never alter server state.
Idempotent methods (`GET`, `HEAD`, `PUT`, `DELETE`, `OPTIONS`, `TRACE`, `PROPPATCH`, `MKCOL`, `COPY`, `MOVE`, `UNLOCK`)
guarantee that executing an identical request once or multiple times sequentially yields the exact same server state,
making them safe for automatic client network retries. Non-idempotent methods (`POST`, `PATCH`, `CONNECT`, `LOCK`) can
produce cumulative side effects, requiring careful application-level validation to prevent duplicate processing or state
corruption.

## Best Practices

* **Safe Method Utilization:** Restrict `GET`, `HEAD`, and `OPTIONS` requests strictly to read-only data retrieval
  operations, avoiding state modifications or database writes during fetches.
* **Idempotency Adherence:** Design backend endpoints for `PUT`, `DELETE`, and WebDAV management methods to be fully
  idempotent to handle network retries safely.
* **Partial Update Optimization:** Prefer `PATCH` over `PUT` when updating only specific properties of a resource to
  minimize payload size and avoid accidental data overwrites.
* **POST Usage Boundaries:** Use `POST` for actions that create non-idempotent resources, process form submissions, or
  trigger complex server-side business logic workflows.
* **Diagnostic Security Enforcement:** Explicitly disable `TRACE` on public web servers to eliminate Cross-Site
  Tracing (XST) vulnerabilities, and cache `OPTIONS` preflight responses using `Access-Control-Max-Age`.
* **Validate request body schemas:** Ensure incoming payloads for `POST`, `PUT`, and `PATCH` methods are strictly
  validated against defined data models before processing.
* **Return proper status codes:** Respond with appropriate HTTP status codes (such as `201 Created` for successful posts
  and `204 No Content` for successful deletes) to convey method outcomes.
* **Handle missing resources cleanly:** Ensure `PUT` and `PATCH` methods return clear `404 Not Found` or handle resource
  creation idempotently based on API design specifications.
* **Secure CONNECT tunnels:** Restrict the `CONNECT` method on proxy servers to authorized hosts and ports to prevent
  unauthorized internal network relaying.
* **Implement proper CORS handling:** Ensure backend servers correctly evaluate and respond to `OPTIONS` preflight
  requests with appropriate `Access-Control-Allow-Origin` headers.
* **Log unsafe method executions:** Maintain secure audit logs for all non-idempotent or state-altering requests (
  `POST`, `PUT`, `PATCH`, `DELETE`) to monitor application activity.
* **Avoid query parameters for mutations:** Refrain from passing sensitive mutation parameters in `GET` query strings;
  utilize request bodies for `POST`, `PUT`, and `PATCH`.
* **Test method idempotency explicitly:** Write automated integration tests that send duplicate requests for `PUT` and
  `DELETE` endpoints to verify state consistency.
* **Optimize cache headers for GET:** Apply strong `Cache-Control` directives to `GET` endpoints to leverage browser and
  proxy caching effectively.
* **Protect against method tampering:** Validate that incoming HTTP methods align with expected controller capabilities
  to prevent unauthorized operations.
* **Support conditional requests:** Utilize `ETag` and `If-Match` headers with `PUT` and `PATCH` methods to prevent lost
  updates caused by concurrent modifications.
* **Document method constraints:** Clearly specify required headers, payload formats, and expected response codes for
  each HTTP method in API documentation.
* **Handle payload size limits:** Set appropriate maximum body size limits on `POST` and `PUT` endpoints to protect
  servers from memory exhaustion attacks.
* **Sanitize resource identifiers:** Validate and escape resource IDs present in request URL paths before executing
  database operations for `GET`, `PUT`, `PATCH`, or `DELETE`.
* **Ensure atomic transaction execution:** Wrap multi-step database changes triggered by `POST` or `PUT` methods in
  atomic transactions to prevent partial state corruption.
* **Avoid returning sensitive data on creation:** Return minimal resource representations or location headers rather
  than sensitive internal records on initial `POST` creation responses.
* **Monitor method latency metrics:** Track execution times and error rates separately across different HTTP methods to
  pinpoint specific API performance bottlenecks.