# Cross-Origin Security: CORS, SOP Restrictions, and Preflight Requests

While the Same-Origin Policy (SOP) provides essential isolation between distinct websites, modern web architectures
frequently require legitimate cross-origin communication. Applications often consume APIs hosted on separate domains,
load third-party analytics scripts, or fetch assets from distributed Content Delivery Networks (CDNs). Cross-Origin
Resource Sharing (CORS) is the standardized HTTP-header mechanism that safely relaxes SOP restrictions under controlled
conditions.

## Same-Origin Policy Restrictions and Exemptions

By default, the Same-Origin Policy restricts scripts from reading responses or interacting with data fetched from a
different origin. However, certain HTML tags are permitted to load cross-origin resources for embedding purposes:

* **Permitted Cross-Origin Embeds:** `<script src="...">`, `<link rel="stylesheet" href="...">`, `<img src="...">`, and
  `<video>` tags can load assets across origins, but scripts cannot directly read the raw binary or text content of
  those responses without explicit CORS authorization.
* **Restricted API Calls:** `fetch()` and `XMLHttpRequest` calls are strictly governed by SOP and require explicit
  server-side CORS headers to permit cross-origin data access.

## Cross-Origin Resource Sharing (CORS)

CORS enables a server to explicitly declare which external origins are authorized to read response data by returning
specific HTTP response headers.

* **Access-Control-Allow-Origin:** Specifies which domains are permitted to access the response (e.g.,
  `https://trusted-client.com` or `*` for public APIs).
* **Access-Control-Allow-Credentials:** Indicates whether the browser should include credentials (such as cookies or
  HTTP authentication headers) in cross-origin requests.

```http
// Example CORS Response Headers from an authorized API server
HTTP/1.1 200 OK
Access-Control-Allow-Origin: [https://app.example.com](https://app.example.com)
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## Preflight Requests

For complex HTTP requests that may cause side effects on server data (such as `PUT`, `DELETE`, or requests featuring
custom headers like `Content-Type: application/json`), the browser automatically initiates a **preflight request** using
the HTTP `OPTIONS` method before sending the actual payload.

1. **The OPTIONS Probe:** The browser asks the server if the upcoming cross-origin request is permitted by transmitting
   the intended method and headers.
2. **Server Validation:** The server responds with allowed methods and headers. If authorized, the browser proceeds with
   the actual primary request.

## Architectural Trade-Offs

Configuring cross-origin security introduces specific engineering trade-offs:

* **Advantages:** Enables secure, granular microservice integration across disparate domains without disabling
  fundamental browser isolation protections.
* **Disadvantages:** Misconfigured CORS headers (such as combining `Access-Control-Allow-Origin: *` with
  `Access-Control-Allow-Credentials: true`) introduce severe security vulnerabilities, allowing malicious websites to
  steal sensitive user data.

## Best Practices

* **Avoid wildcards with credentials:** Never combine `Access-Control-Allow-Origin: *` with credentials enabled;
  explicitly whitelist trusted client domains.
* **Minimize exposed methods:** Restrict CORS `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` strictly
  to the specific HTTP methods and headers required by your application.