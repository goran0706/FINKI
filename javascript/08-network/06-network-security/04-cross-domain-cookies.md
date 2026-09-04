# Cross-Domain Cookie and Session Security Specifications

Cookies are HTTP state management headers issued via `Set-Cookie` responses and returned by user agents in `Cookie`
request headers. Because cookies were historically attached automatically to every matching request regardless of origin
context, they introduced vulnerability vectors like Cross-Site Request Forgery (CSRF) and cross-site tracking. Modern
browser specifications (RFC 6265bis) introduce strict attribute-level controls—specifically the `SameSite` directive and
Cookie Prefixes—to restrict cross-domain context availability and secure session identifiers.

| Cookie Attribute | Directive Value | Operational Security Function                                                                        |
|:-----------------|:----------------|:-----------------------------------------------------------------------------------------------------|
| `SameSite`       | `Strict`        | Prevents cookie transmission in all cross-site subresource or navigation contexts.                   |
| `SameSite`       | `Lax`           | Allows cookie transmission during top-level cross-site GET navigations; blocks subresource requests. |
| `SameSite`       | `None`          | Permits cross-site transmission; strictly requires the `Secure` attribute to be present.             |
| `Secure`         | Flag            | Ensures the cookie is stored and transmitted exclusively over encrypted HTTPS connections.           |
| `HttpOnly`       | Flag            | Blocks client-side JavaScript access (`document.cookie`), mitigating XSS session theft.              |
| `Domain`         | Domain String   | Defines explicit domain and subdomain scope for cookie availability.                                 |

## Cross-Site Cookie Processing Sequence

When a browser encounters a cross-origin interaction (such as an embedded image, iframe, or API fetch), it evaluates
cookie attributes before attaching them to outgoing requests:

1. **Header Validation:** The user agent receives a `Set-Cookie` header during an HTTP response and validates
   attributes (`Domain`, `Path`, `SameSite`, `Secure`, `HttpOnly`).
2. **Cookie Storage:** The user agent persists the cookie in browser storage, binding it to the specified domain scope
   and security flags.
3. **Request Interception:** The user agent encounters a cross-domain request targeting the cookie's domain context.
4. **Context Evaluation:** The browser evaluates the request context: if `SameSite=Strict`, the cookie is withheld; if
   `SameSite=Lax`, it is attached only for top-level GET navigations; if `SameSite=None` and `Secure` is present, the
   cookie is attached.

## Best Practices

* **Default to SameSite=Lax or Strict:** Apply `SameSite=Lax` or `SameSite=Strict` to all session identifiers and
  authentication tokens to neutralize CSRF vectors.
* **Enforce the Secure Attribute:** Always pair `SameSite=None` with the `Secure` flag to prevent plain-text cookie
  transmission across unencrypted HTTP connections.
* **Protect Session Keys with HttpOnly:** Set the `HttpOnly` attribute on session storage cookies to prevent malicious
  scripts from reading tokens via XSS.
* **Adopt Cookie Prefixes:** Use `__Host-` or `__Secure-` prefixes in cookie names to enforce strict domain binding,
  paths, and secure transport flags at the browser parsing layer.
* **Partition Cross-Site Cookies:** Utilize `SameSite=None; Secure; Partitioned` (CHIPS) for legitimate embedded
  third-party contexts to support privacy-preserving cross-site state.
* **Set explicit cookie expiration times:** Define precise `Max-Age` or `Expires` parameters on cookies to prevent
  indefinite session persistence on shared client environments.
* **Restrict cookie scope with Path attribute:** Limit cookie accessibility to specific application route paths (e.g.,
  `/api/`) rather than defaulting globally to root.
* **Validate cookie scopes carefully:** Avoid setting broad `Domain` attributes on parent domains unless cross-subdomain
  sharing is strictly necessary.
* **Rotate session identifiers on login:** Generate new session IDs immediately upon user authentication to prevent
  session fixation vulnerabilities.
* **Implement secure server-side session stores:** Store session state data securely in encrypted databases or
  distributed caches rather than raw client-side cookies.
* **Monitor cookie size constraints:** Keep individual cookie payloads minimal to prevent performance degradation on
  HTTP request headers.
* **Sanitize cookie values before processing:** Treat all incoming cookie data as untrusted input and validate formats
  on the server side.
* **Encrypt sensitive session payloads:** Apply authenticated encryption (AEAD) when storing sensitive state inside
  client-side cookies.
* **Implement sliding session timeouts:** Expire inactive user sessions automatically while refreshing tokens
  dynamically during active engagement.
* **Revoke cookies securely on logout:** Clear session cookies explicitly on the server by setting expired timestamps
  and matching attributes.
* **Test cookie policies across browsers:** Verify that modern browser privacy mechanisms handle third-party cookie
  restrictions correctly.
* **Protect against cookie poisoning:** Ensure that application code validates cookie integrity signatures before
  trusting internal state.
* **Avoid storing PII in cookies:** Keep personally identifiable information out of clear-text cookies to protect user
  privacy.
* **Configure secure partition boundaries:** Leverage partitioned cookies correctly to maintain isolated state across
  distinct embedding sites.
* **Audit application cookie inventories:** Conduct periodic reviews of all active cookies to eliminate stale, legacy,
  or insecure tokens.
* **Use short-lived refresh tokens:** Balance user convenience and security by utilizing short-lived access cookies
  paired with secure refresh flows.
* **Document cookie dependencies:** Maintain clear documentation outlining authentication and tracking cookie
  requirements for all microservices.