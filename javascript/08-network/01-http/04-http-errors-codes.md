# HTTP Errors

HTTP status codes in the 4xx and 5xx ranges represent error responses returned by a server when a request cannot be
completed successfully. Standardized under IETF RFC 7231, RFC 9110, and related specifications, client error status
codes (4xx) indicate issues originating from the request itself, whereas server error status codes (5xx) indicate
failures occurring within the backend processing environment or network infrastructure.

| Status Code                           | Code Class | Error Category       | Primary Operational Meaning                                                         |
|:--------------------------------------|:-----------|:---------------------|:------------------------------------------------------------------------------------|
| `400 Bad Request`                     | 4xx Client | Syntax / Validation  | Malformed request syntax, invalid parameters, or unparseable payload.               |
| `401 Unauthorized`                    | 4xx Client | Authentication       | Missing or invalid authentication credentials for the targeted resource.            |
| `402 Payment Required`                | 4xx Client | Commerce / Quota     | Reserved for digital payment systems or experimental paywall restrictions.          |
| `403 Forbidden`                       | 4xx Client | Authorization        | Valid authentication provided, but insufficient permissions to access the resource. |
| `404 Not Found`                       | 4xx Client | Resource Existence   | No matching representation exists for the requested target URI.                     |
| `405 Method Not Allowed`              | 4xx Client | Protocol / Routing   | Target resource exists, but the requested HTTP verb is disallowed.                  |
| `406 Not Acceptable`                  | 4xx Client | Content Negotiation  | Server cannot produce a response matching the client's `Accept` headers.            |
| `407 Proxy Authentication Required`   | 4xx Client | Proxy Auth           | Client must first authenticate itself with an intermediate proxy.                   |
| `408 Request Timeout`                 | 4xx Client | Connection           | Server timed out waiting for the client to complete sending the request.            |
| `409 Conflict`                        | 4xx Client | State Management     | Request state collision, such as duplicate keys or resource version conflicts.      |
| `410 Gone`                            | 4xx Client | Resource Lifetime    | Target resource was permanently deleted with no forwarding address.                 |
| `411 Length Required`                 | 4xx Client | Header Validation    | Request rejected because `Content-Length` header is missing or invalid.             |
| `412 Precondition Failed`             | 4xx Client | Conditional Requests | One or more preconditions in request headers (`If-Match`, etc.) evaluated to false. |
| `413 Payload Too Large`               | 4xx Client | Capacity Guardrails  | Request body size exceeds server processing limits.                                 |
| `414 URI Too Long`                    | 4xx Client | Request Guardrails   | Target URI length exceeds the server's maximum parsing limits.                      |
| `415 Unsupported Media Type`          | 4xx Client | Content Negotiation  | Payload `Content-Type` format is unsupported by the target endpoint.                |
| `416 Range Not Satisfiable`           | 4xx Client | Range Requests       | Client requested a byte range (`Range` header) that cannot be fulfilled.            |
| `417 Expectation Failed`              | 4xx Client | Header Validation    | Expectation given in `Expect` request header could not be met by the server.        |
| `418 I'm a teapot`                    | 4xx Client | Easter Egg / HTCPCP  | Hyper Text Coffee Pot Control Protocol (RFC 2324/2325) joke code.                   |
| `421 Misdirected Request`             | 4xx Client | Routing / TLS        | Request was directed at a server that is not able to produce a response.            |
| `422 Unprocessable Content`           | 4xx Client | Business Logic       | Syntactically valid payload that violates semantic domain rules.                    |
| `423 Locked`                          | 4xx Client | WebDAV               | Target resource or directory is currently locked against modification.              |
| `424 Failed Dependency`               | 4xx Client | WebDAV               | Request failed because it depended on another action that failed.                   |
| `425 Too Early`                       | 4xx Client | Security / TLS       | Server is unwilling to risk processing a request that might be replayed.            |
| `426 Upgrade Required`                | 4xx Client | Protocol State       | Client should switch to a different protocol (e.g., TLS/1.3, WebSockets).           |
| `428 Precondition Required`           | 4xx Client | Conditional Requests | Origin server requires the request to be conditional to avoid race conditions.      |
| `429 Too Many Requests`               | 4xx Client | Rate Limiting        | Request rate limits or quota thresholds have been exceeded.                         |
| `431 Request Header Fields Too Large` | 4xx Client | Request Guardrails   | Individual header field or total header block size exceeds server limits.           |
| `451 Unavailable For Legal Reasons`   | 4xx Client | Compliance / Legal   | Access denied as a result of legal demands, censorship, or court orders.            |
| `500 Internal Server Error`           | 5xx Server | Application Failure  | Unhandled exception, crash, or unexpected runtime failure on the backend.           |
| `501 Not Implemented`                 | 5xx Server | Capability Deficit   | Server lacks the core capability required to fulfill the request.                   |
| `502 Bad Gateway`                     | 5xx Server | Proxy / Gateway      | Edge proxy or load balancer received an invalid upstream response.                  |
| `503 Service Unavailable`             | 5xx Server | System Capacity      | Server is temporarily unable to handle requests due to overload or maintenance.     |
| `504 Gateway Timeout`                 | 5xx Server | Proxy Timeout        | Upstream application server failed to respond within gateway time limits.           |
| `505 HTTP Version Not Supported`      | 5xx Server | Protocol Version     | Server refuses to support the HTTP protocol version used in the request line.       |
| `506 Variant Also Negotiates`         | 5xx Server | Content Negotiation  | Internal server configuration error during transparent content negotiation.         |
| `507 Insufficient Storage`            | 5xx Server | WebDAV / System      | Server is unable to store the representation needed to complete the request.        |
| `508 Loop Detected`                   | 5xx Server | WebDAV / Routing     | Server terminated an infinite loop while processing a WebDAV request.               |
| `510 Not Extended`                    | 5xx Server | Protocol Extensions  | Further extensions to the request are required for the server to fulfill it.        |
| `511 Network Authentication Required` | 5xx Server | Network / Captive    | Client needs to authenticate to gain network access (e.g., captive portals).        |

## Client Error Codes (4xx)

Client error responses indicate that the request contains invalid syntax, missing authentication, unauthorized
permissions, or semantic violations that prevent processing. Authentication failures (`401 Unauthorized`) demand valid
credentials via `WWW-Authenticate` headers, whereas permission refusals (`403 Forbidden`) reject access regardless of
credentials. Data formatting issues are split between raw syntax failures (`400 Bad Request`), unsupported media
formats (`415 Unsupported Media Type`), and syntactically sound payloads that break domain logic (
`422 Unprocessable Content`). Resource tracking uses `404 Not Found` for missing targets, `409 Conflict` for state
collisions, and `410 Gone` to signal permanent deletion for indexing crawlers. Precondition validation relies on
`412 Precondition Failed` (preventing lost updates with `If-Match` ETags) and `428 Precondition Required`. Traffic
control and security guardrails are enforced via `405 Method Not Allowed` (returning supported verbs in `Allow`
headers), `413 Payload Too Large` for strict body size caps, `431 Request Header Fields Too Large`, and
`429 Too Many Requests` for rate limiting.

## Server Error Codes (5xx)

Server error responses indicate that the client request was valid, but the server encountered an internal failure,
capacity bottleneck, or upstream proxy failure while attempting execution. Unhandled backend runtime exceptions yield
`500 Internal Server Error`, while missing server features trigger `501 Not Implemented`. Intermediate infrastructure
failures surface through `502 Bad Gateway` when an edge proxy receives corrupted data from a backend application,
`504 Gateway Timeout` when an upstream process or database hangs, and `503 Service Unavailable` when system capacity
limits are exceeded or scheduled maintenance is underway. Specialized protocol failures include
`506 Variant Also Negotiates` for content negotiation misconfigurations and `511 Network Authentication Required` for
network-level access control.

## Best Practices

* **Semantic Status Code Usage:** Ensure servers return accurate 4xx and 5xx status codes rather than masking errors
  behind `200 OK` status lines.
* **Appropriate Error Classification:** Distinguish between client-side validation failures (4xx) and backend service
  bugs (5xx) to simplify debugging and monitoring.
* **Header-Driven Guidance:** Include actionable response headers like `Allow` for `405` responses, `WWW-Authenticate`
  for `401` responses, and `Retry-After` for `429` and `503` responses.
* **Rate-Limit Visibility:** Supply transparent quota headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`) alongside
  `429 Too Many Requests` status responses.
* **Sanitize error payloads:** Strip internal database queries, file paths, and raw stack traces from 500 error
  responses sent to production clients.
* **Handle 404 gracefully:** Design custom, user-friendly 404 error pages that provide navigation links back to valid
  sections of the web application.
* **Support conditional updates with 412:** Utilize `If-Match` headers and return `412 Precondition Failed` to prevent
  race conditions during concurrent resource modifications.
* **Return descriptive error bodies:** Accompany error status codes with standardized JSON error payloads containing
  machine-readable error codes and human-readable explanations.
* **Monitor 5xx error spikes:** Set up real-time alerting for sudden increases in `500`, `502`, and `504` status
  responses to detect infrastructure degradation quickly.
* **Handle gateway timeouts gracefully:** Configure reverse proxies and load balancers with reasonable timeout
  thresholds before returning a `504 Gateway Timeout`.
* **Differentiate 401 and 403 responses:** Return `401 Unauthorized` when authentication credentials are missing or
  invalid, and `403 Forbidden` when authenticated users lack required permissions.
* **Enforce payload size limits with 413:** Reject oversized incoming uploads early at the server gateway level with a
  `413 Payload Too Large` status to preserve memory.
* **Validate media types rigorously:** Return `415 Unsupported Media Type` when clients submit payloads with unparseable
  or disallowed `Content-Type` headers.
* **Implement robust retry logic for 429 and 503:** Configure client-side HTTP clients to respect `Retry-After` headers
  and employ exponential backoff when encountering rate limits or maintenance states.
* **Log client errors selectively:** Avoid flooding production logging systems with repetitive `404 Not Found` entries
  from routine web crawlers and broken links.
* **Handle 409 conflict states:** Return `409 Conflict` when resource updates clash with current server states,
  prompting clients to fetch the latest version before retrying.
* **Test error handling paths:** Write comprehensive unit and integration tests verifying that client applications
  handle all expected 4xx and 5xx error responses smoothly.
* **Verify proxy configurations:** Ensure `502 Bad Gateway` errors are diagnosed by checking upstream application server
  health, socket permissions, and process statuses.
* **Return Location headers on 201 vs handling 400:** Ensure requests failing structural validation receive clean
  `400 Bad Request` payloads detailing exact field validation errors.
* **Prevent information leakage on 401:** Avoid disclosing whether a specific username exists in the system when
  returning authentication failure responses.
* **Track client error patterns:** Monitor frequent `400` and `422` errors in analytics to identify confusing user
  interface forms or broken client-side data serialization.
* **Maintain protocol compliance:** Ensure custom error responses adhere strictly to standard HTTP specifications
  regarding header formatting and body structure.