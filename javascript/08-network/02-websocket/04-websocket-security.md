# WebSocket Security Specifications

Securing WebSocket traffic requires protecting frame payloads against eavesdropping, interception, and middlebox
tampering using Transport Layer Security (TLS). Initiating a connection via the `wss://` scheme establishes an encrypted
TLS tunnel prior to the HTTP upgrade handshake. In addition to securing data confidentiality, TLS encryption helps
bypass restrictive network proxies and firewalls that frequently drop or misroute unencrypted HTTP upgrade requests on
port 80.

## Origin Verification & Authentication

Because WebSockets are initiated via standard HTTP requests, browsers automatically include ambient authentication
credentials like cookies during the initial handshake without enforcing standard Same-Origin Policy restrictions. This
architecture leaves endpoints vulnerable to Cross-Site WebSocket Hijacking (CSWSH) attacks if authentication relies
solely on cookies without origin verification. Servers must explicitly validate incoming `Origin` request headers during
the HTTP upgrade phase and employ explicit token-based authentication mechanisms.

| Security Layer           | Potential Threat       | Mitigation Mechanism                                                                               |
|:-------------------------|:-----------------------|:---------------------------------------------------------------------------------------------------|
| **Transport Layer**      | Plaintext Interception | Enforce `wss://` TLS encryption across all production endpoints.                                   |
| **Handshake Layer**      | Cross-Site Hijacking   | Inspect and validate the `Origin` header on the server during the HTTP upgrade.                    |
| **Authentication Layer** | Unauthorized Access    | Require short-lived authentication tokens passed via query parameters or headers during handshake. |
| **Application Layer**    | Denial of Service      | Enforce maximum message size limits and frame rate limiting per connection.                        |

## Security Enforcement Sequence

Backend security controls must execute in a strict sequential order before allowing a socket connection to upgrade. The
server evaluates transport metadata, origin credentials, and token validity before granting socket access:

1. **Request Interception:** Intercept the incoming HTTP upgrade request on the server before processing the socket
   connection.
2. **Origin Verification:** Extract the `Origin` header from the request and compare it against an explicit whitelist of
   trusted domain origins.
3. **Token Validation:** Validate the single-use authentication token provided within the request URI parameters or
   connection subprotocol headers.
4. **Access Rejection:** Reject the upgrade with an `HTTP 403 Forbidden` status code if the origin check or token
   validation fails.

## Best Practices

* **Enforce TLS Exclusively:** Terminate all plain `wss://` connections at secure load balancers or application gateways
  in production environments.
* **Verify Origin Strictness:** Reject any upgrade request containing missing, mismatched, or unauthorized `Origin`
  headers on the backend server.
* **Enforce Message Size Limits:** Disconnect sockets immediately if incoming frame length exceeds maximum allowed
  payload buffers to prevent buffer overflow attacks.
* **Sanitize Deserialized Payloads:** Validate and sanitize all parsed message data before passing it to core
  application services or database query layers.
* **Use short-lived auth tokens:** Pass cryptographically signed JWTs or temporary session tickets during the handshake
  rather than long-term passwords.
* **Implement rate limiting on connections:** Restrict the frequency of new WebSocket connection attempts per IP address
  to mitigate denial-of-service floods.
* **Protect against message flooding:** Enforce strict application-layer message rate limits per client socket to
  prevent resource exhaustion.
* **Avoid passing secrets in query strings:** Transmit sensitive tokens via subprotocols or secure cookie contexts when
  server logs might expose request URLs.
* **Validate frame masking explicitly:** Ensure servers drop unmasked client-to-server frames immediately to prevent
  cache poisoning vulnerabilities.
* **Disable unnecessary extensions:** Turn off vulnerable or unused WebSocket compression extensions to protect against
  Oracle-style attacks like CRIME.
* **Sanitize logging streams:** Strip sensitive user credentials, tokens, and PII from real-time message logging and
  debugging interfaces.
* **Implement strict CORS policies for fallback transports:** Secure HTTP long-polling endpoints identically to primary
  WebSocket upgrade routes.
* **Audit dependency security regularly:** Keep WebSocket server libraries and TLS termination modules updated to patch
  critical vulnerabilities.
* **Isolate multi-tenant channel rooms:** Enforce strict authorization checks before permitting clients to subscribe to
  specific room broadcasts or private streams.
* **Monitor suspicious connection patterns:** Track abrupt disconnect rates, rapid handshake failures, and invalid
  origin headers in security event logs.
* **Enforce strict content security policies:** Configure CSP headers on web clients to restrict where real-time socket
  connections can be initiated.
* **Protect against cross-site scripting:** Ensure all data broadcasted through WebSockets and rendered on client UIs is
  properly escaped to prevent XSS.
* **Implement connection timeouts for handshakes:** Terminate pending HTTP upgrade requests that fail to complete
  authentication within a strict window.
* **Restrict subprotocol acceptance:** Validate and accept only explicitly supported application subprotocols during the
  handshake negotiation phase.
* **Encrypt sensitive payload fields:** Apply application-layer encryption to highly confidential data frames even over
  TLS connections when zero-trust requirements apply.
* **Review proxy compatibility configurations:** Ensure intermediate security proxies and web application firewalls
  correctly inspect WebSocket traffic without dropping frames.
* **Maintain incident response playbooks:** Document immediate server-side teardown and client-side lockout procedures
  for compromised socket connections.