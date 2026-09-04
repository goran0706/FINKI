# JavaScript Module Systems Interoperability

## Interoperability Architecture

As the JavaScript ecosystem evolved across server-side runtimes and browsers, multiple module standards emerged.
Understanding how CommonJS (CJS) and ECMAScript Modules (ESM) interact is essential for building modern packages and
full-stack applications that run seamlessly in Node.js and browser environments.

### System Comparison Matrix

| Feature              | CommonJS (CJS)                            | ECMAScript Modules (ESM)                 |
|:---------------------|:------------------------------------------|:-----------------------------------------|
| **Execution Timing** | Synchronous runtime loading               | Compile-time static analysis             |
| **Default Context**  | `module.exports` and `require()`          | `export` and `import` keywords           |
| **Top-Level `this`** | Evaluates to `module.exports`             | Evaluates to `undefined`                 |
| **Interoperability** | Can import ESM dynamically via `import()` | Can import CJS via default/named imports |

## Bridging CJS and ESM in Node.js

Node.js provides built-in mechanisms to bridge the architectural gap between legacy CommonJS packages and modern ES
modules.

* **Importing CJS into ESM:** ESM files can import CommonJS modules using default imports or static named imports (
  Node.js automatically analyzes CommonJS exports to provide named bindings).
* **Importing ESM into CJS:** CommonJS files cannot use synchronous `require()` statements to load ES modules because
  ESM requires asynchronous parsing phases; developers must use dynamic `import()` instead.
* **Package Configuration (`package.json`):** The `"type": "module"` field designates all `.js` files in a package as
  ESM, while `.cjs` extensions force CommonJS execution regardless of package settings.

## Best Practices

* **Publish Dual-Package Formats:** When authoring libraries, use build tools to output both CommonJS and ESM formats,
  configuring the `package.json` `exports` field to serve the correct format to each consumer.
* **Avoid Mixed Module Types:** Keep package file structures clean by separating CJS and ESM codebases or relying on a
  compiler to handle interop transforms automatically.
* **Use Dynamic Import for CJS Interop:** Wrap calls to load legacy CommonJS packages inside async functions using
  `await import('pkg')` if your application strictly enforces a pure ESM environment.
* **Specify File Extensions explicitly:** Always include exact file extensions in your import paths to prevent Node.js
  resolution ambiguity between CJS and ESM files.