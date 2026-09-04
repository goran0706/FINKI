# Cross-Origin Resource Sharing (CORS) Specification

Cross-Origin Resource Sharing (CORS) is an HTTP-header-based security mechanism defined by the W3C and HTML Living
Standard that relaxes the browser's strict Same-Origin Policy (SOP). An origin is defined by the triple combination of
URI scheme, hostname, and port number (e.g., `https://example.com:443`). Under SOP, user agents restrict web
applications from issuing cross-origin HTTP requests unless the receiving server explicitly grants permission via CORS
response headers. For requests that alter state or use non-simple HTTP methods, headers, or media types, the browser
automatically dispatches an HTTP `OPTIONS` preflight request prior to sending the actual request to verify server
permissions and prevent unauthorized cross-site operations.

| CORS Header                        | Header Type | Functional Description                                                                                  |
|:-----------------------------------|:------------|:--------------------------------------------------------------------------------------------------------|
| `Access-Control-Allow-Origin`      | `Response`  | Specifies permitted origins, taking an explicit domain URI or a wildcard (`*`).                         |
| `Access-Control-Allow-Methods`     | `Response`  | Lists HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) permitted during cross-origin requests.             |
| `Access-Control-Allow-Headers`     | `Response`  | Specifies HTTP request headers allowed during the actual cross-origin request.                          |
| `Access-Control-Allow-Credentials` | `Response`  | Indicates whether the browser should expose the response when credentials (cookies/TLS certs) are sent. |
| `Access-Control-Max-Age`           | `Response`  | Defines the duration in seconds that preflight request results can be cached locally.                   |
| `Access-Control-Request-Headers`   | `Request`   | Sent by the browser in preflight `OPTIONS` requests to list custom headers the client intends to send.  |

## CORS Preflight Execution Sequence

When an application executes a cross-origin request containing non-simple headers or methods (such as `PUT`, `DELETE`,
or `application/json` content types), the browser initiates a preflight exchange:

1. **Preflight Interception:** The browser intercepts the outgoing fetch or XHR request and dispatches an HTTP `OPTIONS`
   preflight request to the target origin containing `Origin`, `Access-Control-Request-Method`, and
   `Access-Control-Request-Headers`.
2. **Header Inspection:** The destination server inspects the preflight headers against its cross-origin access control
   rules.
3. **Preflight Response:** The server returns an HTTP `204 No Content` or `200 OK` response containing
   `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and optional caching parameters.
4. **Main Request Evaluation:** The browser evaluates the preflight response headers; if approved, it executes the main
   HTTP request and exposes the payload to the calling script.

## Best Practices

* **Enforce Explicit Origin Whitelists:** Validate incoming `Origin` headers on the server against a strict whitelist
  rather than reflecting the request origin or returning wildcard `*` headers.
* **Never Pair Wildcards with Credentials:** Avoid returning `Access-Control-Allow-Origin: *` alongside
  `Access-Control-Allow-Credentials: true` to prevent credential exposure vulnerabilities.
* **Cache Preflight Responses:** Set an optimal `Access-Control-Max-Age` header value (e.g., 600 to 86,400 seconds) to
  reduce latency and server load from repeated preflight options requests.
* **Restrict Exposed Response Headers:** Define explicit headers in `Access-Control-Expose-Headers` to expose only safe
  custom headers to client-side scripts while hiding internal metadata.
* **Isolate Sensitive Endpoints:** Keep administrative or state-modifying API endpoints completely free from permissive
  CORS rules to guard against unauthorized cross-site interactions.
* **Handle preflight method routing correctly:** Ensure backend web servers or router middleware properly handle HTTP
  `OPTIONS` requests without triggering authentication blocks or 404 errors.
* **Avoid dynamic origin reflection vulnerabilities:** Prevent vulnerable server implementations from blindly echoing
  back the incoming `Origin` header value without proper allowlist validation.
* **Limit allowed headers to essentials:** Restrict `Access-Control-Allow-Headers` definitions strictly to required
  custom headers instead of using overly broad wildcards.
* **Restrict allowed methods explicitly:** Declare only the specific HTTP methods (`GET`, `POST`, etc.) required by
  individual resource endpoints rather than blanket permissions.
* **Secure credentials with explicit origins:** Return the exact matching origin string in `Access-Control-Allow-Origin`
  when `Access-Control-Allow-Credentials: true` is enabled, as wildcards are invalid.
* **Test CORS behavior across browsers:** Verify cross-origin request configurations across multiple user agents to
  ensure consistent preflight and caching compliance.
* **Monitor preflight traffic volume:** Track the ratio of `OPTIONS` requests to actual application traffic to ensure
  client caching and `Access-Control-Max-Age` policies are operating effectively.
* **Avoid leaking sensitive headers:** Review all custom response headers to ensure proprietary tokens or internal
  server configurations are not unintentionally exposed to client scripts.
* **Configure API gateways correctly:** Ensure reverse proxies and API management layers forward and inject CORS headers
  accurately without duplication or corruption.
* **Handle CORS errors gracefully in UI:** Catch network and CORS policy failure exceptions cleanly in client
  applications to provide informative feedback without exposing stack traces.
* **Keep CORS middleware updated:** Maintain up-to-date framework-level CORS modules and packages to incorporate
  security patches and standard updates automatically.
* **Audit wildcard usage regularly:** Conduct periodic security reviews of backend routing definitions to eliminate
  accidental wildcards on authenticated or sensitive routes.
* **Validate credentials policy consistency:** Ensure that client-side `fetch` or `XMLHttpRequest` requests explicitly
  set `credentials: 'include'` when interacting with credential-dependent APIs.
* **Document cross-origin API boundaries:** Maintain clear documentation outlining which third-party domains or
  front-end applications are authorized to consume specific microservices.
* **Restrict custom header injections:** Prevent unauthorized clients from injecting arbitrary headers that bypass basic
  proxy filters during preflight handshakes.
* **Test OPTIONS response caching:** Verify that intermediate load balancers and CDNs respect `Access-Control-Max-Age`
  preflight caching directives.
* **Separate public and private CORS policies:** Apply strict, isolated CORS configurations for internal administrative
  APIs compared to public-facing data endpoints.