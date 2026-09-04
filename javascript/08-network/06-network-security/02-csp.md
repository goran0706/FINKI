# Content Security Policy (CSP) Specifications

Content Security Policy (CSP) is an HTTP response header security layer standardized by the W3C to detect and mitigate
client-side code injection vulnerabilities, primarily Cross-Site Scripting (XSS) and Clickjacking. Delivered via the
`Content-Security-Policy` header, CSP allows server administrators to restrict the resources (such as JavaScript, CSS,
images, and frames) that the browser is permitted to load and execute for a given page context. Resources not explicitly
permitted by the policy are blocked by the user agent, and policy violations can be reported to a designated telemetry
endpoint.

| CSP Directive     | Resource Category | Operational Function                                                                                 |
|:------------------|:------------------|:-----------------------------------------------------------------------------------------------------|
| `default-src`     | Fallback          | Defines default loading policies for resource types not explicitly specified.                        |
| `script-src`      | JavaScript        | Restricts valid sources for JavaScript execution, inline scripts, and worker threads.                |
| `style-src`       | CSS Stylesheets   | Controls permitted origins for external stylesheets and inline element styling.                      |
| `img-src`         | Images            | Specifies valid origins for loading static images, favicons, and vector graphics.                    |
| `connect-src`     | Networking        | Restricts fetch, XMLHttpRequest, WebSocket, EventSource, and WebTransport destinations.              |
| `frame-ancestors` | Framing           | Specifies valid parents that may embed the current page inside `<frame>`, `<iframe>`, or `<object>`. |
| `report-to`       | Telemetry         | Configures a reporting group endpoint where browser violation reports are dispatched.                |

## Nonce-Based Execution Sequence

To allow safe inline scripts while maintaining strict XSS protections, modern CSP implementations employ cryptographic
nonces (number used once) generated per HTTP request:

1. **Nonce Generation:** The backend server generates a cryptographically secure pseudo-random string (nonce) for every
   incoming page request.
2. **Policy Configuration:** The server attaches the `Content-Security-Policy` header to the response, specifying
   `script-src 'nonce-<base64-value>'`.
3. **Element Attribution:** The server injects the matching `nonce="<base64-value>"` attribute into legitimate inline
   `<script>` elements within the HTML body.
4. **Script Verification:** The browser parses the document, executing only inline scripts whose nonce matches the token
   defined in the response header and blocking all un-credentialed or injected scripts.

## Best Practices

* **Eliminate Unsafe Directives:** Avoid using `'unsafe-inline'` or `'unsafe-eval'` in `script-src` directives to
  maintain strong protection against reflected and stored XSS attacks.
* **Implement Nonce or Hash Controls:** Adopt dynamic nonce-based or hash-based script execution policies to support
  modern single-page applications without compromising security.
* **Prevent Clickjacking with Frame Ancestors:** Set `frame-ancestors 'none'` or `frame-ancestors 'self'` to prevent
  malicious cross-origin framing and UI redressing attacks.
* **Deploy Report-Only Mode First:** Test new policies using `Content-Security-Policy-Report-Only` headers to identify
  broken dependencies before enforcing strict blocking rules.
* **Restrict Object and Base Directives:** Set `object-src 'none'` to block legacy browser plugins and `base-uri 'self'`
  to prevent attackers from altering relative URL resolution via `<base>` tags.
* **Validate connect-src domains strictly:** Restrict API endpoints, WebSockets, and EventSource connections to explicit
  trusted domains to prevent data exfiltration.
* **Rotate nonces per request:** Ensure that cryptographic nonces are freshly generated for every HTTP response and
  never reused to prevent replay vulnerabilities.
* **Avoid wildcard sources in production:** Eliminate broad wildcards (`*`) from sensitive directives like `script-src`,
  `style-src`, and `object-src`.
* **Monitor violation telemetry continuously:** Analyze reports sent to `report-to` or `report-uri` endpoints to detect
  ongoing injection attempts or misconfigured assets.
* **Restrict worker thread execution sources:** Use `worker-src` and `child-src` directives to prevent untrusted scripts
  from spinning up malicious web workers or service workers.
* **Secure image and media loading:** Limit `img-src` and `media-src` to trusted content delivery networks to prevent
  pixel-tracking and malicious resource injection.
* **Enforce HTTPS across all directives:** Require secure protocols (`https:`) for external resource allocations to
  prevent man-in-the-middle script tampering.
* **Restrict form submission targets:** Use the `form-action` directive to specify authorized endpoints where user form
  data can be submitted.
* **Sanitize dynamic style injections:** Avoid using `'unsafe-inline'` for stylesheets by adopting nonce-based style
  tags or trusted CSS-in-JS libraries.
* **Review policy inheritance in iframes:** Utilize the `sandbox` attribute alongside CSP to enforce rigorous constraint
  sandboxing on untrusted iframe contents.
* **Test CSP compatibility across browsers:** Verify that security header implementations behave consistently across all
  target client user agents.
* **Audit third-party script integrations:** Review third-party analytics and widget scripts to ensure they comply with
  strict domain and nonce policies.
* **Protect against data URI sniffing:** Prevent attackers from smuggling executable payloads via inline `data:` or
  `blob:` URI schemes in script contexts.
* **Keep CSP policies modular:** Structure complex policies cleanly across multiple directives to maintain readability
  and simplify maintenance over time.
* **Implement upgrade-insecure-requests:** Utilize the `upgrade-insecure-requests` directive to automatically force
  legacy HTTP asset requests over secure TLS channels.
* **Avoid deprecated reporting directives:** Migrate legacy `report-uri` declarations to the standardized `report-to`
  API group configurations.
* **Document policy exceptions and rationale:** Maintain clear documentation outlining why specific exemptions or
  relaxed rules exist within production CSP configurations.