# Build Optimization

Build optimization is the process of transforming application source code and assets into a production artifact that can be delivered efficiently to users. The goal is not simply to make the build smaller: effective optimization reduces download size, parsing and compilation work, execution cost, request overhead, and time to usable application without sacrificing correctness or maintainability.

---

## 1. What Build Optimization Means

A production build usually performs several transformations between source code and the files delivered to the browser.

```text
Source code
    ↓
Module resolution
    ↓
Compilation / transpilation
    ↓
Tree shaking
    ↓
Dead-code elimination
    ↓
Code splitting
    ↓
Minification
    ↓
Asset optimization
    ↓
Compression
    ↓
Production artifacts
```

Different optimizations address different costs.

For example:

- Tree shaking removes unused modules or exports.
- Dead-code elimination removes unreachable code.
- Minification reduces the textual size of generated files.
- Code splitting divides application code into independently loaded chunks.
- Lazy loading delays downloading code until it is needed.
- Compression reduces the bytes transferred over the network.
- Asset optimization reduces the size and delivery cost of images, fonts, and other static resources.

These mechanisms are related, but they solve different problems.

---

## 2. The Main Performance Costs

A browser does more than download JavaScript.

For a typical web application, the browser may need to:

1. Resolve network requests.
2. Download HTML.
3. Download JavaScript, CSS, fonts, and images.
4. Decompress responses.
5. Parse JavaScript and CSS.
6. Compile JavaScript.
7. Execute JavaScript.
8. Construct the DOM and CSSOM.
9. Render the page.
10. Execute additional code as the user interacts with the application.

Therefore, reducing the JavaScript file size is useful but does not automatically solve every performance problem.

A useful model is:

```text
Application performance
    =
Network cost
+ Parse cost
+ Compile cost
+ Execution cost
+ Rendering cost
+ Asset cost
```

Build optimization primarily influences the first several terms, although its effects can also influence rendering and execution.

---

## 3. Optimization Has Multiple Dimensions

A useful distinction is between the size of the artifact and the cost of using the artifact.

A bundle can be small but expensive to execute.

A bundle can also be relatively large but inexpensive to execute if much of its content is not immediately needed.

Consider:

```text
Bundle A
    200 KB
    180 KB required immediately

Bundle B
    350 KB total
    80 KB required immediately
    270 KB loaded later
```

The total size of Bundle B is larger, but its initial JavaScript requirement may be smaller.

This is why production optimization should consider at least:

```text
Initial transfer
Initial parsing
Initial compilation
Initial execution
Subsequent loading
Total application payload
```

---

## 4. Tree Shaking

Tree shaking removes code that is statically determined to be unused.

Consider:

```ts
export const formatDate = () => {
  return "date";
};

export const formatCurrency = () => {
  return "currency";
};
```

If another module imports only:

```ts
import { formatDate } from "./formatters";
```

a build tool can potentially determine that `formatCurrency` is not required.

The production artifact may therefore contain only the code needed by the application.

Tree shaking works particularly well with statically analyzable module systems such as ES modules.

```ts
import { formatDate } from "./formatters";
```

is easier to analyze than patterns where dependencies are determined dynamically.

---

## 5. Tree Shaking Requires Static Information

Tree shaking depends on the build system being able to determine which code is reachable.

Static imports provide information at build time:

```ts
import { formatDate } from "./formatters";
```

Dynamic module selection is different:

```ts
const moduleName = getModuleName();

await import(moduleName);
```

The exact module may not be statically known.

This does not mean dynamic imports are bad. Dynamic imports are an important mechanism for code splitting.

The important distinction is:

```text
Static dependency
    → easier to analyze and optimize

Dynamic dependency
    → may require runtime loading
```

---

## 6. Dead-Code Elimination

Dead-code elimination removes code that cannot affect the resulting program.

For example:

```ts
const debug = false;

if (debug) {
  console.log("Debug information");
}
```

A production build may determine that the condition is always false and remove the unreachable branch.

The same principle applies to code guarded by known build-time constants:

```ts
if (PRODUCTION) {
  startProductionMonitoring();
}
```

If the build system replaces `PRODUCTION` with a known constant, later optimization passes may remove branches that are impossible in that build.

This is one reason build-time configuration can affect the final artifact.

---

## 7. Build-Time Constants and Optimization

Build-time constants can enable optimizations that runtime configuration cannot.

Suppose a feature is selected during the build:

```ts
if (BUILD_TARGET === "admin") {
  loadAdminApplication();
} else {
  loadCustomerApplication();
}
```

If `BUILD_TARGET` is replaced with `"admin"` during the build, optimization can potentially remove the unreachable branch.

A runtime value cannot provide the same guarantee:

```ts
if (runtimeConfig.target === "admin") {
  loadAdminApplication();
} else {
  loadCustomerApplication();
}
```

The browser receives code capable of handling both cases.

Therefore:

```text
Build-time decision
    → can influence generated code

Runtime decision
    → must remain represented in generated code
```

This is one of the fundamental relationships between configuration and optimization.

---

## 8. Minification

Minification transforms generated source into a smaller representation without intentionally changing its behavior.

For example:

```ts
function calculateTotal(price: number, quantity: number) {
  return price * quantity;
}
```

may become conceptually similar to:

```js
function calculateTotal(t, q) {
  return t * q;
}
```

Minification can:

- remove unnecessary whitespace;
- shorten identifiers where safe;
- simplify expressions;
- remove certain syntactic redundancies;
- participate in dead-code elimination.

Minification primarily reduces the textual representation of code.

It does not replace tree shaking or code splitting.

---

## 9. Minification vs. Tree Shaking

These optimizations operate at different levels.

Tree shaking asks:

```text
Which code is not needed?
```

Minification asks:

```text
How can the required code be represented more compactly?
```

For example:

```ts
import { usedFunction, unusedFunction } from "./module";
```

Tree shaking may remove:

```ts
unusedFunction;
```

Minification may then compact the remaining code.

A typical production pipeline can therefore perform several optimizations sequentially.

---

## 10. Code Splitting

Code splitting divides application code into multiple output chunks rather than producing one large JavaScript bundle.

Instead of:

```text
application.js
    1.5 MB
```

the build might produce:

```text
main.js
vendor.js
dashboard.js
settings.js
reports.js
```

The browser does not necessarily need to download every chunk immediately.

Code splitting is especially useful when an application contains large areas that users do not need during the initial page load.

---

## 11. Dynamic Imports

Dynamic `import()` is a common mechanism for expressing a code-splitting boundary.

```ts
const module = await import("./reports");
```

Unlike a normal static import:

```ts
import { renderReports } from "./reports";
```

the dynamic import represents an asynchronous module-loading operation.

The build system can use that boundary to create a separate chunk.

Conceptually:

```text
Initial application
        ↓
main.js

User opens Reports
        ↓
import("./reports")
        ↓
reports.js
```

The reports code does not have to be part of the initial JavaScript download.

---

## 12. Lazy Loading

Lazy loading means delaying the loading of a resource until it is actually needed.

For JavaScript:

```ts
const loadEditor = () => import("./editor");
```

For an image, the application may similarly defer loading an image that is below the initial viewport.

The general principle is:

```text
Do not pay an initial cost for something the user does not currently need.
```

Lazy loading is therefore primarily a strategy for reducing initial work rather than necessarily reducing total application size.

---

## 13. Code Splitting and Total Size

Code splitting does not inherently reduce the total amount of JavaScript in an application.

Suppose an application contains:

```text
main.js       300 KB
editor.js     200 KB
reports.js    250 KB
settings.js   100 KB
```

The total JavaScript remains:

```text
850 KB
```

But a user visiting only the home page may initially download:

```text
main.js
300 KB
```

instead of all 850 KB.

The optimization is therefore:

```text
Initial payload ↓
```

rather than necessarily:

```text
Total application code ↓
```

---

## 14. Route-Level Code Splitting

Applications with multiple routes can often split code according to navigation boundaries.

Conceptually:

```text
/
    → home chunk

/products
    → products chunk

/account
    → account chunk

/admin
    → admin chunk
```

A user who never visits `/admin` does not necessarily need to download the administrative code.

This makes route boundaries useful natural candidates for code splitting.

---

## 15. Component-Level Code Splitting

Code splitting can also happen below the route level.

A large feature may be loaded only when a user activates it:

```text
Application
    ├── Main UI
    ├── Search
    ├── Editor
    └── Advanced reporting
             ↓
        loaded on demand
```

This is useful for expensive features such as:

- rich text editors;
- charting libraries;
- map implementations;
- PDF viewers;
- large data visualization modules;
- administrative tools.

The important question is not simply whether something is large, but whether it is required immediately.

---

## 16. Dependency Size

Application dependencies can make up a substantial portion of the generated JavaScript.

A package may provide a small feature while bringing a large dependency graph into the application.

For example:

```text
Application
    ↓
Library A
    ↓
Library B
    ↓
Library C
    ↓
Large dependency
```

Dependency analysis should therefore consider:

```text
What was imported?
What dependencies were included?
How much code became reachable?
How much of it is required initially?
```

The package's advertised size is not necessarily the same as its contribution to the final production artifact.

---

## 17. Dependency Analysis

Build tooling or bundle analyzers can visualize the generated dependency graph.

A conceptual report might show:

```text
main.js
├── application code
├── framework
├── utility library
├── chart library
└── date library
```

This can reveal unexpectedly large dependencies.

Optimization should generally target measurable contributors rather than applying arbitrary transformations.

A useful process is:

```text
Measure
    ↓
Identify expensive dependency
    ↓
Determine why it is included
    ↓
Change import or dependency strategy
    ↓
Build again
    ↓
Measure again
```

---

## 18. Import Granularity

Import style can affect what code becomes reachable.

For example:

```ts
import { formatDate } from "date-library";
```

may allow better elimination of unused exports than patterns that force a broad module into the application.

However, this depends on the package's module format and build tooling.

The correct principle is not:

```text
Always use one particular import syntax.
```

It is:

```text
Understand what code the import causes the bundler to include.
```

---

## 19. CommonJS and ES Modules

ES modules expose static import and export relationships:

```ts
import { foo } from "./module";
export { bar };
```

This structure provides useful information for static analysis.

CommonJS uses runtime-oriented constructs such as:

```js
const module = require("./module");
```

The dynamic nature of some CommonJS patterns can make fine-grained static optimization more difficult.

Modern build systems can support both formats, but package format still matters when optimizing dependency graphs.

---

## 20. Side Effects

Tree shaking must account for module side effects.

Consider:

```ts
import "./initialize";
```

There may be no imported value, but loading the module itself may intentionally execute code.

For example:

```ts
document.body.classList.add("initialized");
```

Removing such a module simply because it exports nothing could change application behavior.

Build systems therefore need information about whether modules can safely be removed.

Package metadata can communicate side-effect behavior to tooling, but incorrect side-effect declarations can cause real production bugs.

---

## 21. Production Mode

Production builds normally enable optimization behavior that is inappropriate or unnecessary during development.

Development builds commonly prioritize:

```text
Fast rebuilds
Readable output
Debugging
Detailed warnings
Source-level feedback
```

Production builds prioritize:

```text
Small artifacts
Efficient execution
Predictable output
Caching
Deployment
Runtime performance
```

The exact behavior depends on the build tool, but the distinction is fundamental.

---

## 22. Compression

After JavaScript and CSS have been minified, the resulting files can often be compressed before transmission.

Common HTTP content encodings include:

```text
gzip
Brotli
```

For text-based assets such as:

```text
JavaScript
CSS
HTML
JSON
SVG
```

compression can significantly reduce transferred bytes.

Conceptually:

```text
Uncompressed file
        ↓
Compression
        ↓
Network transfer
        ↓
Browser decompression
        ↓
Original content
```

Compression therefore reduces network transfer size without changing the logical contents of the application.

---

## 23. Minification vs. Compression

These mechanisms should not be confused.

Minification changes the source representation:

```text
Readable JavaScript
        ↓
Compact JavaScript
```

Compression encodes the resulting bytes more efficiently:

```text
Compact JavaScript
        ↓
Compressed byte stream
```

A production deployment can use both.

```text
Source
  ↓
Tree shaking
  ↓
Dead-code elimination
  ↓
Minification
  ↓
Compression
  ↓
Network
```

---

## 24. JavaScript Compression Is Not the Same as Image Optimization

Different asset types have different optimization strategies.

For JavaScript:

```text
Tree shaking
Minification
Code splitting
Compression
```

For images:

```text
Resizing
Format selection
Compression
Responsive variants
Lazy loading
```

For fonts:

```text
Subset selection
Format selection
Compression
Loading strategy
```

One optimization technique should not be treated as a universal solution for every asset.

---

## 25. Image Optimization

Images can dominate the transferred size of a web application.

A source image may be unnecessarily large:

```text
Original image
    4000 × 3000
```

while the rendered image may occupy only:

```text
800 × 600
```

Sending the original image wastes bandwidth.

Image optimization can include:

- resizing;
- appropriate compression;
- modern image formats;
- responsive image variants;
- lazy loading;
- avoiding unnecessary image resolution.

The correct target is the actual display and delivery requirement, not simply the highest available quality.

---

## 26. Responsive Images

A responsive application may serve different image resources depending on the display size.

Conceptually:

```text
Mobile
    → small image

Tablet
    → medium image

Desktop
    → large image
```

This prevents a small device from downloading a large resource that it cannot use effectively.

Responsive image delivery is therefore another form of payload optimization.

---

## 27. Font Optimization

Fonts can also contribute significantly to initial loading cost.

Potential optimizations include:

```text
Use only required font families
Use only required weights
Subset character ranges
Prefer efficient font formats
Avoid unnecessary font variants
```

For example, an application that uses one regular and one bold weight does not necessarily need to ship ten font weights.

Font loading also interacts with rendering behavior, so the objective is not simply minimizing the font file size.

---

## 28. Asset Hashing

Production assets are often emitted with content hashes:

```text
main.8f31c2.js
styles.41a92d.css
logo.92af10.svg
```

The hash changes when the asset content changes.

This enables aggressive caching.

For example:

```text
Cache-Control:
    long-lived
```

can safely be used for immutable hashed assets because a new version receives a new filename.

Conceptually:

```text
Version 1
main.a1b2c3.js

Version 2
main.d4e5f6.js
```

The browser can keep the old file while requesting the new file when the HTML references the new filename.

---

## 29. Cache-Friendly Build Output

Build optimization therefore interacts directly with deployment and caching.

A useful production model is:

```text
HTML
    → short-lived / revalidated

Hashed JavaScript
    → long-lived

Hashed CSS
    → long-lived

Hashed images
    → long-lived
```

The exact cache policy depends on the deployment architecture.

The important property is that changing application code produces new asset identities rather than silently replacing bytes behind an unchanged URL.

---

## 30. Code Splitting and Caching

Code splitting can also improve cache reuse.

Suppose an application produces:

```text
vendor.js
application.js
```

If application code changes while dependencies remain unchanged, the dependency chunk may remain cacheable.

A more granular structure could produce:

```text
framework.js
vendor.js
main.js
reports.js
admin.js
```

Changes to `reports.js` do not necessarily invalidate unrelated chunks.

However, excessive splitting can create too many requests or reduce compression efficiency.

Therefore:

```text
More chunks ≠ automatically better
```

The chunk structure should reflect actual loading and caching behavior.

---

## 31. Over-Splitting

Code splitting introduces overhead.

If an application creates dozens or hundreds of tiny chunks, the browser may need to perform many requests and coordinate many module dependencies.

Potential consequences include:

```text
More requests
More request coordination
More module-loading overhead
Reduced compression efficiency
More complicated caching behavior
```

The goal is therefore not maximum fragmentation.

The goal is an effective loading graph.

---

## 32. Preloading and Prefetching

Some resources are not required immediately but are likely to be needed soon.

Two common concepts are:

```text
Preload
    → resource is important for the current navigation

Prefetch
    → resource may be needed by a future navigation
```

For example:

```text
Current page
    ↓
User is likely to open editor
    ↓
Prefetch editor chunk
```

The browser can then potentially fetch the resource before the user explicitly requests it.

This is useful only when the prediction is reasonable. Prefetching unnecessary resources can waste bandwidth.

---

## 33. Lazy Loading and Prefetching Can Work Together

A feature can remain lazy-loaded while its chunk is prefetched based on likely future usage.

Conceptually:

```text
Initial load
    ↓
Feature is not required
    ↓
Do not block initial application
    ↓
Predict user may need feature
    ↓
Prefetch feature chunk
    ↓
User opens feature
    ↓
Chunk is already available or partially available
```

This preserves the initial loading boundary while reducing the delay when the feature is eventually needed.

---

## 34. Build-Time Optimization vs Runtime Optimization

Build optimization happens before deployment.

Runtime optimization happens while the application is executing.

Examples of build-time optimization:

```text
Tree shaking
Dead-code elimination
Minification
Code splitting
Asset optimization
```

Examples of runtime optimization:

```text
Memoization
Caching API responses
Virtualizing large lists
Avoiding unnecessary renders
Scheduling work
```

These are complementary.

A highly optimized build can still contain inefficient runtime behavior.

---

## 35. Build Optimization Cannot Fix Everything

Suppose a component performs expensive work:

```ts
const result = expensiveCalculation(data);
```

Minifying the function does not fundamentally change its algorithmic cost.

Similarly, removing whitespace from JavaScript cannot fix:

```text
O(n²)
```

work that should have been:

```text
O(n)
```

Build optimization should therefore not be used as a substitute for application-level performance engineering.

---

## 36. Source Maps and Optimization

Minified production JavaScript is difficult to debug directly.

Source maps connect generated code back to its original source.

Conceptually:

```text
Original TypeScript
        ↓
Production build
        ↓
Minified JavaScript
        +
Source map
```

The browser or an error-monitoring system can use the map to associate generated locations with source locations.

Source maps are therefore closely related to production optimization, but they are not themselves an optimization mechanism.

---

## 37. Development and Production Output

A production build should generally produce output optimized for deployment rather than debugging.

Development:

```text
Readable
Unoptimized
Detailed diagnostics
Fast incremental rebuilds
```

Production:

```text
Optimized
Minified
Split
Cacheable
Compressed
Debuggable through source maps
```

The exact transformations depend on the build system.

The important distinction is that production output should be treated as a deployable artifact rather than as an intermediate development representation.

---

## 38. Measuring Bundle Size

Bundle size should be measured after the actual production build.

Useful measurements include:

```text
Initial JavaScript
Initial CSS
Initial image payload
Total transferred bytes
Largest individual assets
Chunk sizes
Dependency contributions
```

It is useful to distinguish:

```text
Raw size
Compressed size
Transferred size
```

These numbers are not interchangeable.

A 500 KB JavaScript file does not necessarily mean 500 KB is transferred over the network if HTTP compression is enabled.

---

## 39. Measuring Runtime Cost

Bundle size alone does not fully describe the user experience.

Useful runtime measurements can include:

```text
JavaScript execution time
Long tasks
Interaction latency
Largest Contentful Paint
Cumulative Layout Shift
First Contentful Paint
Time to interactive behavior
```

The exact metrics used should match the application's performance goals.

The important principle is:

```text
Optimize measured user-facing costs,
not arbitrary build statistics.
```

---

## 40. Establishing a Baseline

Before changing the build configuration, establish a baseline.

For example:

```text
Initial JS:          620 KB
Compressed JS:       180 KB
Initial CSS:          90 KB
Largest image:       450 KB
Initial chunks:         4
```

Then make one meaningful change and measure again.

For example:

```text
Before:
Initial JS: 620 KB

After:
Initial JS: 410 KB
```

The improvement can then be evaluated together with runtime metrics.

---

## 41. Bundle Budgets

A project can define performance budgets to prevent accidental regressions.

For example:

```text
Initial JavaScript
    maximum: 500 KB

Initial CSS
    maximum: 150 KB

Largest initial image
    maximum: 300 KB
```

A CI pipeline can fail or warn when a build exceeds a defined budget.

The exact threshold should come from the application's requirements and deployment environment rather than from a universal number.

---

## 42. Build Optimization in CI

Production optimization should be reproducible in CI.

A typical pipeline may look like:

```text
Install dependencies
        ↓
Run tests
        ↓
Build production artifact
        ↓
Analyze artifact
        ↓
Check performance budgets
        ↓
Publish artifact
```

The artifact should be the result of the same production build process that will be deployed.

This reduces the risk of optimizing one build configuration while deploying another.

---

## 43. Dependency Changes Can Affect the Build

Adding a dependency can affect:

```text
Bundle size
Tree-shaking effectiveness
Number of chunks
Execution cost
Build time
Caching
```

Therefore dependency selection is part of build optimization.

A package should not be evaluated only by its API.

The production consequences of including it also matter.

---

## 44. Removing Unused Dependencies

Unused dependencies create maintenance and potentially build overhead.

A project may contain packages that are:

```text
No longer imported
Only used by obsolete code
Used only during development
Replaced by platform APIs
```

Removing them can simplify the dependency graph and reduce installation and build overhead.

However, dependency removal should be verified against the actual project rather than based solely on textual searches because some packages may be used through configuration or tooling.

---

## 45. Avoiding Premature Optimization

Not every optimization is worth implementing.

For example, splitting a 3 KB feature into another chunk may technically reduce the initial bundle but introduce unnecessary loading complexity.

Similarly, replacing a dependency solely because another library is a few kilobytes smaller may provide little user-visible benefit.

A useful optimization cycle is:

```text
Measure
    ↓
Identify bottleneck
    ↓
Change
    ↓
Measure
    ↓
Keep or revert
```

This keeps optimization evidence-driven.

---

## 46. Build Optimization Trade-Offs

Optimization techniques often trade one cost for another.

| Technique             | Primary benefit              | Potential cost                       |
| --------------------- | ---------------------------- | ------------------------------------ |
| Tree shaking          | Removes unused code          | Depends on static analyzability      |
| Dead-code elimination | Removes unreachable branches | Requires known build-time values     |
| Minification          | Smaller generated files      | Harder to debug without source maps  |
| Code splitting        | Smaller initial payload      | More chunks and loading coordination |
| Lazy loading          | Defers unnecessary work      | Delayed feature availability         |
| Prefetching           | Reduces future loading delay | May consume unnecessary bandwidth    |
| Compression           | Smaller network transfer     | Compression/decompression work       |
| Asset hashing         | Strong caching               | Requires correct cache strategy      |
| Dependency reduction  | Smaller graph                | May require replacing functionality  |
| Aggressive chunking   | Better cache granularity     | More requests and complexity         |

There is no single optimization that dominates every application.

---

## 47. A Practical Optimization Sequence

A practical build-optimization process can be organized into stages.

```text
1. Produce a production build
        ↓
2. Measure initial payload
        ↓
3. Analyze dependency graph
        ↓
4. Remove unnecessary dependencies
        ↓
5. Verify tree shaking
        ↓
6. Enable dead-code elimination
        ↓
7. Minify production output
        ↓
8. Identify large initial features
        ↓
9. Add appropriate code-splitting boundaries
        ↓
10. Optimize images and fonts
        ↓
11. Enable HTTP compression
        ↓
12. Configure cache-friendly asset names
        ↓
13. Measure runtime performance
        ↓
14. Add budgets to prevent regressions
```

The sequence is intentionally measurement-driven.

---

## 48. What Should Be Optimized First?

A useful decision process is:

```text
Is the initial download too large?
    ↓
Inspect initial chunks and dependencies.

Is a feature large but rarely used?
    ↓
Consider lazy loading or code splitting.

Are assets dominating transfer size?
    ↓
Optimize images, fonts, and other static assets.

Is transfer size large despite reasonable source size?
    ↓
Inspect compression and cache configuration.

Is the bundle small but startup slow?
    ↓
Inspect parsing, compilation, and execution.

Is navigation slow after the first load?
    ↓
Inspect chunk loading and caching.
```

This prevents unrelated optimizations from being applied to the wrong bottleneck.

---

## 49. Build Optimization and Deployment

Build optimization continues into deployment.

A highly optimized JavaScript file is less useful if the server:

```text
does not compress it;
does not cache it;
uses incorrect cache headers;
serves unoptimized assets;
prevents effective CDN caching.
```

The complete delivery path is:

```text
Source
    ↓
Build optimization
    ↓
Production artifacts
    ↓
Deployment
    ↓
CDN / server
    ↓
HTTP caching and compression
    ↓
Browser
```

The final user experience depends on the entire pipeline.

---

## 50. The Optimization Boundary

It is useful to distinguish three boundaries:

```text
Build-time
    What code and assets are generated?

Deployment-time
    How are those artifacts served?

Runtime
    How does the application execute?
```

For example:

```text
Tree shaking
    → build-time

Brotli response compression
    → deployment-time

Memoization
    → runtime
```

The boundaries interact, but they should not be conceptually mixed.

---

## 51. Build Optimization Checklist

Before shipping a production application, verify:

```text
[ ] Production mode is enabled.
[ ] Unused dependencies have been reviewed.
[ ] Tree shaking is working where expected.
[ ] Dead code is removed where possible.
[ ] JavaScript and CSS are minified.
[ ] Large features have appropriate loading boundaries.
[ ] Initial JavaScript size has been measured.
[ ] Large assets have been identified.
[ ] Images are appropriately sized and compressed.
[ ] Fonts are limited to required variants.
[ ] HTTP compression is enabled.
[ ] Production assets use cache-friendly names.
[ ] Cache headers match the asset strategy.
[ ] Source-map strategy has been defined.
[ ] Performance budgets are enforced where useful.
[ ] Production runtime performance has been measured.
```

---

## 52. Summary

Build optimization reduces the cost of delivering and starting an application by transforming source code and assets into efficient production artifacts.

The major techniques solve different problems:

```text
Tree shaking
    → removes unused module code

Dead-code elimination
    → removes unreachable code

Minification
    → reduces generated source size

Code splitting
    → divides application code into chunks

Lazy loading
    → delays code until it is needed

Compression
    → reduces bytes transferred over the network

Asset optimization
    → reduces image, font, and other resource costs

Hashing
    → enables reliable long-lived caching
```

Build-time decisions can also affect optimization. When a value is known during the build, the build system may be able to eliminate unreachable branches and exclude code that is not required by that build. Runtime configuration cannot generally provide the same static guarantees because the generated artifact must remain capable of handling the runtime value.

The objective is not to make every file as small as technically possible. The objective is to minimize the costs that matter to users while maintaining an effective loading, caching, and deployment architecture.

A sound optimization process is therefore:

```text
Measure
    ↓
Identify the actual bottleneck
    ↓
Apply the appropriate optimization
    ↓
Build and measure again
    ↓
Verify user-facing impact
    ↓
Protect the result with budgets and CI checks
```

Build optimization is most effective when treated as an evidence-driven part of the production pipeline rather than as a collection of isolated configuration tricks.
