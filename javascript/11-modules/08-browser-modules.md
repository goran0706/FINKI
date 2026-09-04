# Browser Modules & Native Execution

## Native ESM in the Browser

Modern web browsers support ECMAScript modules natively via the standard HTML script tag configuration. Unlike legacy
script execution that pollutes the global scope, browser modules operate under strict module scoping rules, enforce CORS
policies, and execute asynchronously by default.

### Native Browser Module Characteristics

| Feature              | Legacy Script (`<script>`)        | Browser Module (`<script type="module">`) |
|:---------------------|:----------------------------------|:------------------------------------------|
| **Scope**            | Shares global `window` namespace  | Isolated file-level module scope          |
| **Execution Timing** | Synchronous blocking by default   | Deferred execution (similar to `defer`)   |
| **Strict Mode**      | Optional (`"use strict"`)         | Always enforced automatically             |
| **CORS Policy**      | Bypassed for cross-origin scripts | Enforced for cross-origin script loading  |

## Mechanics of Browser Module Loading

Executing modules natively in the browser requires understanding how URLs, paths, and security policies are handled by
the engine.

* **Explicit Path Resolution:** Browser modules require absolute paths, root-relative paths starting with `/`, or
  relative paths starting with `./` or `../`. Bare module specifiers (e.g., `import { html } from 'lit'`) are invalid
  without an import map.
* **Import Maps (`<script type="importmap">`):** A JSON standard that allows developers to map bare module specifiers to
  absolute URLs or file paths, enabling clean package imports directly in the browser.
* **CORS Requirements:** Modules loaded from external domains must include appropriate CORS headers (e.g.,
  `Access-Control-Allow-Origin: *`), otherwise the browser blocks execution for security reasons.

## Best Practices

* **Use Import Maps for Bare Specifiers:** Implement `<script type="importmap">` to manage third-party dependencies
  cleanly without relying on a bundler for simple browser applications.
* **Leverage Deferred Execution:** Rely on the default deferred behavior of module scripts to ensure the DOM is fully
  parsed before script execution begins.
* **Mind MIME Types:** Ensure your web server serves `.js` or `.mjs` module files with the correct MIME type (
  `text/javascript`), as misconfigured servers will reject the script.
* **Combine with Build Tools for Production:** While native browser modules work well for modern development, use
  bundlers like Vite or Rollup for production builds to minimize HTTP request overhead and compress assets.