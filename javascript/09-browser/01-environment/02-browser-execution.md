# Browser Execution and Script Loading in JavaScript

## JavaScript Loading Mechanics

Browsers load JavaScript resources through `script` tags defined in HTML markup or created programmatically. When the
browser HTML parser encounters a standard script tag without special loading attributes, it halts document parsing,
sends a network request to download the script, and executes it immediately on the main thread. This blocking behavior
delays the critical rendering path, making script loading optimization essential for fast page render times.

| Script Tag Configuration           | Parser Behavior                      | Execution Timing                          |
|:-----------------------------------|:-------------------------------------|:------------------------------------------|
| Standard (`<script src="...">`)    | Blocks HTML parsing during fetch     | Executes immediately after download       |
| Defer (`<script defer src="...">`) | Fetches in background during parsing | Executes after document parsing completes |
| Async (`<script async src="...">`) | Fetches in background during parsing | Executes immediately when downloaded      |

## Dynamic Script Loading

Dynamic script loading involves creating and inserting `<script>` elements into the DOM programmatically at runtime.
This technique enables code splitting, lazy loading, and on-demand resource delivery, ensuring that applications
download heavy scripts only when required. Scripts added dynamically to the document default to asynchronous execution
behavior unless explicitly configured otherwise.

| Implementation Mechanism       | Dominant Characteristic            | Primary Advantage                           |
|:-------------------------------|:-----------------------------------|:--------------------------------------------|
| Programmatic Insertion         | `document.createElement('script')` | Loads resources on demand at runtime        |
| Dynamic Import Statement       | `import('./module.js')`            | Returns native Promise for modular code     |
| Sequential Preserved Execution | `script.async = false`             | Preserves execution order for dynamic nodes |

## Script Execution Order

Script execution order depends on how scripts are included in the DOM, their specified loading attributes, and whether
they are inline or external modules. Standard synchronous scripts execute in the exact order they appear in the HTML
source code. When using execution attributes or module specifiers, the execution sequence shifts based on network
download speeds and parser completion states.

| Script Type / Combination    | Download Dependency | Execution Order Guarantee                        |
|:-----------------------------|:--------------------|:-------------------------------------------------|
| Standard Synchronous Scripts | Sequential blocking | Strict document source order                     |
| Multiple Defer Scripts       | Parallel fetching   | Strict document source order                     |
| Multiple Async Scripts       | Parallel fetching   | Order of download completion (Non-deterministic) |
| ES Modules (`type="module"`) | Parallel fetching   | Deferred order after document parsing            |

## Defer vs Async Attributes

The `defer` and `async` attributes alter how the browser fetches and executes external JavaScript files relative to HTML
parsing. Both attributes prevent script downloads from blocking the initial HTML parser. However, they differ in how
they handle execution timing and order preservation.

| Attribute | Parsing Interruption                    | Order Preserved          | Best Use Case                                 |
|:----------|:----------------------------------------|:-------------------------|:----------------------------------------------|
| `defer`   | None during fetch or execution          | Yes (Follows DOM order)  | Critical application scripts depending on DOM |
| `async`   | Pauses parsing briefly during execution | No (Executes when ready) | Independent scripts (e.g., Analytics, Ads)    |

## Use Cases

* **Deferred Application Bootstrapping:** Using `defer` on core bundle scripts to ensure the entire DOM is parsed before
  initial script execution.
* **Non-Blocking Analytics Injection:** Applying `async` to external tracking and telemetry scripts so they execute
  without delaying main UI page renders.
* **On-Demand Route Loading:** Dynamically inserting script tags or calling `import()` when a user navigates to a new
  application view.
* **Dependency-Aware Lazy Loading:** Setting `script.async = false` on dynamically created scripts to preserve execution
  sequence across interconnected libraries.

## Best Practices

* **Default to Defer for Core Scripts:** Place application scripts in the HTML header with the `defer` attribute to
  allow unblocked HTML parsing while guaranteeing DOM availability.
* **Use Async Strictly for Independent Scripts:** Reserve `async` for third-party trackers, ads, or standalone widgets
  that do not depend on external libraries or DOM state.
* **Avoid Inline Scripts Between Deferred Files:** Keep inline script blocks minimal or move them into deferred external
  files to maintain clean execution flow.
* **Preload Critical Asynchronous Assets:** Combine `<link rel="preload">` with dynamic script loading to initiate
  high-priority downloads early in the page load cycle.
* **Handle Dynamic Script Load Failures:** Attach `onload` and `onerror` event listeners to dynamically created script
  elements to handle network errors gracefully.
* **Leverage Native ES Modules:** Use `type="module"` for modern applications, which automatically defaults to deferred
  execution behavior and isolates scope.