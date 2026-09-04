# Http Headers

HTTP headers serve as the core metadata mechanism for HTTP requests and responses, allowing clients and servers to pass
critical configuration parameters, authentication credentials, caching directives, and content type information across
network connections. Headers consist of case-insensitive key-value pairs formatted according to protocol specifications,
separating metadata from the primary request or response body payload. Understanding how to configure, inspect, and
manage request and response headers is essential for establishing secure communication channels, negotiating data
formats, and controlling intermediate caching behavior.

Request headers accompany outgoing client messages, providing servers with contextual details about the user agent,
accepted data formats, and authorization credentials. Common request headers include `User-Agent` to identify the client
software, `Accept` to specify preferred response MIME types, and `Authorization` to transmit credentials such as Bearer
tokens or API keys. Conversely, response headers are sent back by servers in reply messages, detailing server software
information, data caching policies via `Cache-Control`, and the exact structure of the returned payload.

| Header Category          | Common Examples                           | Primary Function                                                          |
|:-------------------------|:------------------------------------------|:--------------------------------------------------------------------------|
| Request Headers          | `User-Agent`, `Accept`, `Authorization`   | Provides server context, preferences, and client authentication tokens.   |
| Response Headers         | `Content-Type`, `Cache-Control`, `Server` | Describes response payload format, caching rules, and server metadata.    |
| Entity / Payload Headers | `Content-Length`, `Content-Encoding`      | Defines size, compression, and encoding specifications for body payloads. |

The `Content-Type` header plays a vital role in content negotiation by explicitly defining the media type of the
resource or data payload being transmitted. For instance, setting `Content-Type: application/json` informs the receiving
server or client that the accompanying body payload consists of serialized JSON text, allowing the parser to decode the
data accurately. Mismatching or omitting the `Content-Type` header frequently leads to parsing failures or server-side
rejection of incoming requests.

Authorization headers enable secure access control by transmitting authentication credentials—such as JSON Web Tokens (
JWT) or Basic Auth credentials—from the client to protected server endpoints. Typically formatted as
`Authorization: Bearer <token>`, this header accompanies requests to verified routes, allowing backend servers to
validate user permissions and grant or deny access to sensitive resources without relying exclusively on session
cookies.

## Best Practices

* **Content-Type Validation:** Always set matching `Content-Type` headers when transmitting data payloads to ensure
  servers and clients parse formats correctly.
* **Secure Token Transmission:** Transmit sensitive credentials strictly via `Authorization` headers over encrypted
  HTTPS connections to prevent credential interception.
* **Caching Control:** Leverage `Cache-Control` headers appropriately to optimize performance for static assets while
  ensuring dynamic data remains fresh.
* **Header Case Awareness:** Remember that HTTP header keys are case-insensitive by protocol definition, though standard
  convention uses capitalized hyphenated formatting.
* **Sanitize outgoing header values:** Prevent header injection vulnerabilities by validating and escaping user-supplied
  input before appending it to custom outgoing headers.
* **Minimize header payload sizes:** Avoid bloating HTTP requests with excessive custom cookies or redundant tracking
  metadata to optimize network transfer speeds.
* **Implement strong CORS headers:** Configure precise `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`,
  and `Access-Control-Allow-Headers` directives to enforce secure cross-origin resource sharing.
* **Strip internal server headers:** Remove revealing server version headers (such as `X-Powered-By`) from HTTP
  responses to reduce the attack surface against automated fingerprinting.
* **Validate Accept headers on servers:** Ensure backend endpoints inspect incoming `Accept` headers and return
  appropriate 406 Not Acceptable status codes if the requested media type is unsupported.
* **Utilize Vary header correctly:** Include the `Vary` header in caching responses when content changes based on
  request headers like `Accept-Encoding` or `Authorization` to prevent serving stale caches.
* **Enforce strict transport security:** Send the `Strict-Transport-Security` (HSTS) response header to mandate secure
  HTTPS connections and prevent protocol downgrade attacks.
* **Set robust content security policies:** Implement comprehensive `Content-Security-Policy` response headers to
  mitigate cross-site scripting (XSS) and data injection exploits.
* **Handle large header limits:** Configure web servers and reverse proxies with appropriate maximum header size buffers
  to prevent denial-of-service failures from bloated requests.
* **Cache static assets immutably:** Combine `Cache-Control: public, max-age=31536000, immutable` headers with
  content-hashed filenames for efficient long-term client-side asset caching.
* **Trace requests with correlation IDs:** Inject unique request ID headers (`X-Request-ID`) at API gateways to trace
  transactions seamlessly across distributed microservice logs.
* **Avoid storing secrets in custom headers:** Never transmit sensitive encryption keys, passwords, or personal
  identifiable information within unencrypted custom HTTP headers.
* **Use Accept-Encoding for compression:** Leverage standard `Accept-Encoding` and `Content-Encoding` headers to enable
  gzip, deflate, or Brotli payload compression over the network.
* **Expire dynamic content immediately:** Set `Cache-Control: no-store, no-cache, must-revalidate` on sensitive or
  frequently changing financial and user account API responses.
* **Test header compliance:** Write integration test assertions that verify expected response headers (such as security
  policies and content types) are correctly returned by endpoints.
* **Manage proxy header forwarding:** Ensure reverse proxies and load balancers correctly populate `X-Forwarded-For` and
  `X-Forwarded-Proto` headers to preserve client connection context.
* **Validate authorization header format:** Parse and verify the schema prefix (e.g., ensuring the `Bearer ` string
  precedes the token) before decoding authentication credentials on the backend.
* **Document custom header contracts:** Clearly specify all custom request and response headers required by API
  integrations in public developer documentation.