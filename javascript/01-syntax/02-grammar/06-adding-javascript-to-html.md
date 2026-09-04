# Adding JavaScript to HTML

* **External Scripts:** JavaScript files loaded through a `<script>` element using the `src` attribute. External scripts
  can be hosted locally or remotely and allow resources to be cached independently by the browser. Each external script
  element creates a separate loading and execution process determined by its attributes, loading behavior, and position
  within the document.


* **Internal Scripts:** JavaScript source code embedded directly inside a `<script>` element without a `src` attribute.
  Classic internal scripts are parser-blocking; when the HTML parser encounters the element, it pauses HTML parsing and
  allows the JavaScript engine to parse and execute the script before continuing. The ECMAScript specification does not
  define the engine's compilation strategy, so parsing, interpretation, compilation, and optimization behavior depend on
  the JavaScript engine implementation.


* **Inline Scripts:** JavaScript code embedded directly inside HTML attributes or URL contexts, such as event-handler
  attributes (`onclick="..."`, `onload="..."`) or `javascript:` URLs. Inline event handlers are converted into functions
  associated with DOM elements and execute only when the corresponding event is dispatched. `javascript:` URLs execute
  when activated and are not registered as event listeners. Inline scripts are restricted only when a Content Security
  Policy (CSP) is configured; under CSP restrictions, execution requires explicit permission through mechanisms such as
  `'unsafe-inline'`, nonces, or hashes.

## Script Loading & Execution Configurations

| Configuration Type      | Network Fetch Behavior                          | Execution Behavior                                       | DOM Parsing Impact                             |
|:------------------------|:------------------------------------------------|:---------------------------------------------------------|:-----------------------------------------------|
| **Default Synchronous** | Fetches the script while blocking HTML parsing. | Executes immediately after the script is available.      | HTML parsing pauses during fetching/execution. |
| **`async` Attribute**   | Fetches asynchronously while parsing continues. | Executes immediately after download completion.          | HTML parsing pauses during execution.          |
| **`defer` Attribute**   | Fetches asynchronously while parsing continues. | Executes after HTML parsing completes in document order. | Does not block HTML parsing.                   |

**The `async` and `defer` Combination Behavior:** If a script defines both attributes
(`<script async defer src="..."></script>`), the browser applies `async` behavior. The script is downloaded
asynchronously and executed as soon as it becomes available. The `defer` behavior is ignored. Browsers that do not
support `async` ignore the unsupported attribute and process the script according to their normal script-loading
behavior.

## Correct Script Placement Strategies

* **The Head + Defer Pattern (recommended default):** Placing external scripts within the document `<head>` using the
  `defer` attribute is a common recommended pattern. The browser can discover and download the script early while
  continuing HTML parsing. Script execution is delayed until HTML parsing completes, and deferred scripts execute in the
  order they appear in the document. This allows scripts to access the fully constructed DOM without blocking document
  parsing.

  ```html
  <!doctype html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Document</title>
      <script defer src="script.js"></script>
  </head>
  <body>
      content...
  </body>
  </html>
  ```

* **The Head + Async Pattern (for independent scripts):** Placing scripts within the document `<head>` using the `async`
  attribute is intended for independent scripts that do not rely on DOM availability or execution order. The script
  downloads in parallel with HTML parsing and executes immediately after it becomes available, meaning multiple async
  scripts may execute in an unpredictable order.

  ```html
  <!doctype html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Document</title>
      <script async src="script.js"></script>
  </head>
  <body>
      content...
  </body>
  </html>
  ```

* **The Body Footer Placement Pattern (legacy pattern):** Placing traditional synchronous scripts at the bottom of the
  `<body>` was a historical technique used to avoid blocking HTML parsing during the initial document construction.
  Because the browser encounters the script later, the download starts later compared with scripts discovered in the
  `<head>` using `defer`. Modern browsers can use speculative parsing mechanisms to discover resources earlier, but
  placing scripts at the end of the document can still delay script loading.

  *Note:* Adding the `defer` attribute to scripts already placed at the bottom of the `<body>` provides no practical
  advantage because the document parser has already reached the end of the document when the script is encountered. Even
  for a single script at the very end, async is usually unnecessary. There's no meaningful parsing left to overlap with
  the download.

  ```html
  <!doctype html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Document</title>
  </head>
  <body>
      content...
      <script async src="script.js"></script>
  </body>
  </html>
  ```
