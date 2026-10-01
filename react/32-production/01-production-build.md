# Production Builds

A production build transforms application source code into optimized assets intended for deployment. The build process typically performs transformations such as TypeScript and JSX compilation, module bundling, dead-code elimination, minification, and asset optimization.

## 1. Development and production builds

Development and production builds serve different purposes.

A development build prioritizes:

- Fast startup and rebuilds
- Useful error messages
- Debugging
- Source readability
- Hot module replacement or fast refresh
- Development diagnostics

A production build prioritizes:

- Smaller assets
- Optimized execution
- Efficient loading
- Caching
- Deployment stability
- Removal of development-only code

Production mode is a build concern. It describes how the application is transformed and optimized before deployment.

## 2. Source code is not the production output

A React application may contain TypeScript, TSX, JSX, CSS, images, fonts, and many separate modules.

The browser does not normally receive this source tree directly.

A production build transforms the source into generated assets such as:

```text
src/
├── main.tsx
├── App.tsx
├── components/
└── styles.css

        ↓ production build

dist/
├── index.html
└── assets/
    ├── application.a1b2c3.js
    ├── application.a1b2c3.css
    └── ...
```

The generated `dist` directory is an example of a deployment artifact. The exact directory name and output structure depend on the build tool.

## 3. TypeScript compilation

TypeScript provides static type information during development and compilation.

For example:

```ts
const add = (first: number, second: number): number => {
  return first + second;
};
```

The browser does not execute the TypeScript type annotations.

A build pipeline transforms TypeScript into JavaScript that can be executed by the target environment.

The transformation can be conceptually represented as:

```text
TypeScript
    ↓
JavaScript
```

Type checking and JavaScript generation are related but distinct concerns. Depending on the toolchain, a build may use a separate type-checking step while another tool performs the actual transformation.

## 4. JSX transformation

React applications commonly contain JSX or TSX:

```tsx
const Application = () => {
  return <h1>Hello, world.</h1>;
};
```

The build pipeline transforms JSX into JavaScript.

Conceptually:

```text
TSX
 ↓
JavaScript
```

The exact transformation depends on the configured compiler and React setup.

The browser receives generated JavaScript rather than raw TSX source.

## 5. Module bundling

Modern applications are divided into modules:

```ts
import { formatName } from "./format-name";
import { createGreeting } from "./create-greeting";
```

A bundler follows these relationships and constructs a dependency graph.

Conceptually:

```text
Application
    │
    ├── formatName
    │
    ├── createGreeting
    │
    └── other dependencies
```

The bundler uses this graph to determine which modules belong in generated assets.

A production application may produce:

```text
application.js
```

or multiple chunks:

```text
application.js
products.js
settings.js
```

The exact output depends on the application and build configuration.

## 6. Dead-code elimination

Production optimizers can remove code that is provably unreachable or unused.

For example:

```ts
const usedFunction = (): string => {
  return "used";
};

const unusedFunction = (): string => {
  return "unused";
};

console.log(usedFunction());
```

If the build system can prove that `unusedFunction` has no required effects, it may remove that code from the generated production asset.

The exact result depends on module structure, side effects, and the optimizer.

Dead-code elimination is therefore not simply:

> "Delete every function that is never called."

The optimizer must be able to prove that removing the code does not change observable application behavior.

## 7. Tree shaking

Tree shaking is a form of dead-code elimination that works particularly well with statically analyzable ES modules.

Consider a module:

```ts
export const formatName = (name: string): string => {
  return name.trim();
};

export const formatDate = (date: Date): string => {
  return date.toISOString();
};
```

If another module imports only:

```ts
import { formatName } from "./utilities";
```

a compatible production build may determine that `formatDate` is not required and remove it from the generated asset.

Tree shaking depends on the structure of the modules and whether the bundler can safely determine that unused exports have no required side effects.

## 8. Side effects matter

Consider:

```ts
console.log("Application initialized.");
```

This has an observable effect.

The result is not merely a value that can be discarded.

Similarly, a module might register an event listener:

```ts
window.addEventListener("resize", handleResize);
```

Removing that code changes application behavior.

Build tools therefore need to understand module side effects before safely eliminating apparently unused code.

This is one reason package metadata and module structure matter for effective tree shaking.

## 9. Minification

Minification reduces the textual size of generated JavaScript and CSS while preserving their intended behavior.

For example, readable source:

```js
const calculateTotal = (price, quantity) => {
  return price * quantity;
};
```

can be transformed into a significantly more compact representation.

Minification can:

- Remove unnecessary whitespace
- Remove comments that are not required
- Shorten local identifiers
- Simplify expressions
- Remove unreachable code

Minification operates on generated assets rather than making the original source code itself unreadable.

## 10. Compression is different from minification

Minification and network compression solve different problems.

Minification changes the representation of the generated source:

```text
Source
  ↓
Minified source
```

Compression reduces the bytes transferred over the network:

```text
Minified asset
  ↓
gzip / Brotli
  ↓
Network transfer
```

For example, an asset might conceptually have:

```text
Original source:       180 KB
Minified asset:        120 KB
Compressed transfer:    35 KB
```

The exact numbers depend on the application and content.

Compression is normally performed by the server, CDN, or hosting infrastructure rather than by the JavaScript minifier itself.

## 11. Code splitting

A production build does not necessarily have to produce one JavaScript file.

Code splitting divides the dependency graph into multiple chunks.

For example:

```text
Initial application
        │
        ├── shared code
        ├── home page
        │
        └── products chunk
```

The initial page can load only the code required to start the application.

Additional code can be downloaded when it becomes necessary.

This can reduce the initial JavaScript payload without removing functionality from the application.

## 12. Dynamic imports

JavaScript provides dynamic imports:

```ts
const loadProducts = async (): Promise<unknown> => {
  return import("./products");
};
```

A compatible bundler can treat the dynamic import as an asynchronous boundary.

Conceptually:

```text
application.js
     │
     └──── dynamic import ────> products.js
```

The products module does not necessarily have to be included in the initial JavaScript asset.

This is one mechanism used to implement code splitting.

## 13. Asset hashing

Production builds commonly generate content-hashed filenames:

```text
application.a1b2c3.js
application.7f8e9d.css
```

The hash is derived from the content or build output.

If the asset changes, its generated filename changes:

```text
application.a1b2c3.js
```

becomes:

```text
application.f4e5d6.js
```

This makes aggressive caching possible because an unchanged URL represents unchanged content.

## 14. Long-lived caching

An immutable, content-hashed asset can generally be cached for a long period.

A server might use a policy conceptually equivalent to:

```http
Cache-Control: public, max-age=31536000, immutable
```

If the asset changes, its URL changes as well.

The browser can therefore continue using the old asset without preventing a newer deployment from introducing a new asset URL.

## 15. HTML and asset caching are different

The HTML entry point often references the current generated asset filenames:

```html
<script src="/assets/application.a1b2c3.js"></script>
```

After a new deployment, the HTML might reference:

```html
<script src="/assets/application.f4e5d6.js"></script>
```

This means HTML generally requires a different caching strategy from immutable hashed assets.

A simplified model is:

```text
HTML
    ↓
references current asset names
    ↓
hashed JavaScript / CSS
    ↓
long-lived cache
```

The exact cache policy depends on the deployment architecture.

## 16. Source maps

Source maps connect generated code back to original source locations.

Without a source map, an error in a minified asset might appear as:

```text
application.a1b2c3.js:1:483921
```

With an appropriate source map, an error-monitoring system can associate that location with something closer to:

```text
src/components/UserProfile.tsx:42:18
```

Source maps are primarily a debugging mechanism.

They are particularly valuable for production error investigation because production JavaScript is commonly bundled and minified.

## 17. Production source-map strategy

Source maps do not necessarily need to be publicly served.

A deployment can keep them private and upload them directly to an error-monitoring system.

For example:

```text
Browser
   │
   └── receives application.js

Build system
   │
   └── produces application.js.map
              │
              └── private error-monitoring system
```

This can provide production debugging information without making the original source mapping files directly accessible to every browser request.

The appropriate strategy depends on the application's security, debugging, and operational requirements.

## 18. Build-time constants

Build tools can replace configured constants during compilation.

For example, source code might contain a build-time value:

```ts
const BUILD_MODE = "production";
```

If the build tool statically replaces that value, an optimizer can reason about branches based on it.

For example:

```ts
if (BUILD_MODE === "production") {
  initializeProductionMonitoring();
} else {
  enableDevelopmentDiagnostics();
}
```

After static replacement, the optimizer may be able to remove the branch that cannot execute.

This is one mechanism through which development-only code can disappear from a production bundle.

## 19. Production-only and development-only code

Consider:

```ts
if (BUILD_MODE === "development") {
  enableDetailedDiagnostics();
}
```

If `BUILD_MODE` is statically known to be `"production"` during the build, the production optimizer may determine that the condition is always false.

The resulting production asset can therefore omit the development-only code.

This requires the build system to expose the value in a way that the optimizer can statically analyze.

## 20. Build-time configuration is not runtime configuration

A build-time value is known while generating the assets.

A runtime value is read when the already-built application executes.

This distinction matters.

For example:

```text
Build-time configuration
        ↓
Production build
        ↓
Generated JavaScript
        ↓
Browser
```

Changing the build-time value normally requires generating new assets.

Runtime configuration follows a different model:

```text
Generated application
        ↓
Runtime environment
        ↓
Configuration loaded during execution
```

Whether runtime configuration is possible and how it is implemented depends on the deployment architecture.

## 21. Client-side values are public

Anything embedded into JavaScript delivered to the browser should be considered public.

For example:

```ts
const configuration = {
  apiBaseUrl: "https://example.com/api",
};
```

The endpoint can be exposed because the browser needs to know where to send requests.

A secret should not be treated the same way.

This is unsafe:

```ts
const configuration = {
  apiSecret: "super-secret-value",
};
```

Once that value is included in the browser bundle, a user can inspect it.

Minification does not turn a client-side value into a secret.

## 22. Build artifacts

The output of a production build is a set of generated artifacts.

A typical application might produce:

```text
dist/
├── index.html
└── assets/
    ├── application.a1b2c3.js
    ├── application.a1b2c3.css
    ├── products.d4e5f6.js
    └── logo.123abc.svg
```

These files are what the deployment environment serves.

The exact output structure is tool-specific.

## 23. Build and deployment are separate concerns

The build process creates deployable artifacts.

The deployment process makes those artifacts available to users.

Conceptually:

```text
Source code
    ↓
Build
    ↓
Production artifacts
    ↓
Validation
    ↓
Deployment
    ↓
Users
```

The build does not inherently determine where the application is hosted.

The generated artifacts can potentially be served by:

- A traditional web server
- Static hosting
- A CDN
- Cloud object storage
- A platform-specific hosting service

## 24. Build once, deploy consistently

A useful CI/CD pattern is to build once and promote the resulting artifact.

For example:

```text
Source revision
      ↓
Production build
      ↓
Validated artifact
      ↓
Staging
      ↓
Production
```

The same artifact is promoted rather than rebuilding separately for each environment.

This reduces the possibility that staging and production contain different generated code because of differences in build inputs.

## 25. Reproducible builds

A production build should ideally be reproducible from controlled inputs.

Important inputs include:

- Source revision
- Dependency versions
- Lockfile
- Build configuration
- Build environment
- Environment-specific build values

For example:

```text
Source revision
        +
Lockfile
        +
Build configuration
        +
Build environment
        ↓
Production artifact
```

Controlling these inputs makes production artifacts easier to audit, debug, and regenerate.

## 26. Dependency lockfiles

A package manager lockfile records resolved dependency versions.

For example:

```text
package.json
    +
package-lock.json
    ↓
resolved dependency tree
```

The lockfile helps ensure that the build does not silently resolve different dependency versions on different machines.

The exact lockfile format depends on the package manager.

## 27. Production dependency installation

Development dependencies are often unnecessary after the production build has been generated.

A CI/CD pipeline may therefore use separate stages:

```text
Install dependencies
        ↓
Build
        ↓
Test
        ↓
Produce artifacts
        ↓
Deploy only required artifacts
```

Alternatively, a deployment environment may install only production dependencies.

The appropriate approach depends on whether the deployment requires the source tree and runtime dependencies or only generated static assets.

## 28. Build validation

A production build should normally be validated before deployment.

Validation can include:

- Type checking
- Unit tests
- Integration tests
- Linting
- Build completion
- Artifact existence checks
- Bundle-size analysis
- Dependency checks

A simplified pipeline might be:

```text
Type check
    ↓
Test
    ↓
Build
    ↓
Validate artifacts
    ↓
Deploy
```

A failed validation should prevent an invalid artifact from being deployed.

## 29. Production builds and React

React itself is only one part of the production build.

A React application typically contains several layers:

```text
React components
       ↓
TypeScript / JSX
       ↓
Build tool
       ↓
Bundler / optimizer
       ↓
JavaScript / CSS / asset files
       ↓
Web server or CDN
       ↓
Browser
```

The production build therefore concerns the entire frontend asset pipeline rather than React components alone.

## 30. Production optimization is broader than minification

Production optimization can involve several independent techniques:

```text
Production optimization
├── Dead-code elimination
├── Tree shaking
├── Code splitting
├── Lazy loading
├── Minification
├── Compression
├── Asset hashing
├── Dependency optimization
├── CSS optimization
└── Image optimization
```

No single optimization is responsible for production performance.

The result depends on the complete path from source code to bytes downloaded and executed by the browser.

## 31. Optimization should be measured

Optimization should be based on measured behavior rather than assumptions.

Useful measurements can include:

- Initial JavaScript size
- Total JavaScript size
- CSS size
- Image sizes
- Number of requests
- Network transfer size
- JavaScript execution time
- Build time
- Page-load metrics
- Runtime performance

For example:

```text
Before optimization
    Initial JavaScript: 320 KB

After optimization
    Initial JavaScript: 190 KB
```

The actual effect should be verified using the application's build output and runtime measurements.

## 32. The production build pipeline

A simplified production pipeline can be represented as:

```text
Source code
    ↓
Type checking
    ↓
TypeScript / JSX transformation
    ↓
Module resolution
    ↓
Bundling
    ↓
Dead-code elimination
    ↓
Tree shaking
    ↓
Code splitting
    ↓
Minification
    ↓
Asset generation
    ↓
Source-map generation
    ↓
Artifact validation
    ↓
Deployment
```

The exact stages and ordering vary between build tools and frameworks.

The important distinction is that a production build is a pipeline of transformations and validations, not simply a switch that makes the application smaller.

## 33. Production build responsibilities

A production build is responsible for preparing application source code for deployment.

Its responsibilities commonly include:

- Transforming source code into executable assets
- Resolving module dependencies
- Optimizing generated code
- Producing static assets
- Generating appropriate asset names
- Producing source maps according to the debugging strategy
- Detecting build-time errors
- Producing artifacts suitable for deployment

Runtime responsibilities are different.

The deployed application still requires infrastructure responsible for:

- Serving assets
- HTTP caching
- Compression
- TLS
- CDN delivery
- Monitoring
- Logging
- Error collection

## 34. Final model

The overall relationship can be summarized as:

```text
Application source
        │
        ▼
┌─────────────────────┐
│ Production build    │
│                     │
│ TypeScript / JSX    │
│ Bundling            │
│ Tree shaking        │
│ Code splitting      │
│ Minification        │
│ Asset optimization  │
└──────────┬──────────┘
           │
           ▼
   Production artifacts
           │
           ▼
┌─────────────────────┐
│ Deployment          │
│                     │
│ Web server / CDN    │
│ Compression         │
│ HTTP caching        │
└──────────┬──────────┘
           │
           ▼
        Browser
```

A production build transforms the application's source tree into deployable assets. The build system optimizes those assets, while the deployment infrastructure is responsible for delivering them efficiently to the browser.
