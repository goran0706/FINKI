# Route-Based Code Splitting

Route-based code splitting divides an application's JavaScript into independently loadable chunks according to its
navigational boundaries. Instead of requiring the initial page to download the code for every route, the application
loads the code needed for the current route and fetches additional route code when navigation requires it.

The route becomes the architectural boundary for code delivery.

A route-based split is therefore not merely a different way to write `lazy()`. It is a deployment and loading strategy
in which route boundaries determine which component modules belong to which JavaScript chunks and when those chunks
become necessary.

## Intent

The intent of route-based code splitting is to reduce the JavaScript required to make the initial route usable while
loading additional route-specific code only when that route is needed.

For an application with routes such as:

```tsx
const routes = {
    "/": Home,
    "/products": Products,
    "/settings": Settings,
    "/admin": Admin,
};
```

the application does not necessarily need to ship all four route implementations in the initial JavaScript payload.

Instead, route modules can become separate loading units:

```tsx
const Home = lazy(() => import("./routes/Home"));
const Products = lazy(() => import("./routes/Products"));
const Settings = lazy(() => import("./routes/Settings"));
const Admin = lazy(() => import("./routes/Admin"));
```

The exact chunk structure is determined by the bundler and framework, but the architectural intent is the same:
navigation determines which route code becomes necessary.

## Route as a Loading Boundary

A route is a natural code-splitting boundary because navigation already establishes a meaningful change in application
responsibility.

A user visiting:

```text
/settings
```

typically does not need the implementation of:

```text
/admin
```

to render the settings route.

Route-based splitting exploits that relationship.

The route boundary can therefore determine:

* which component modules are loaded
* which dependencies belong to the route
* when additional JavaScript is requested
* which loading UI represents route-code loading
* which route-specific dependencies remain out of the initial bundle

The route boundary does not automatically guarantee that every route receives exactly one independent chunk. Bundlers
may share dependencies or create additional chunks.

## Basic React Pattern

With React's lazy loading:

```tsx
import {lazy, Suspense} from "react";

const Home = lazy(() => import("./routes/Home"));
const Settings = lazy(() => import("./routes/Settings"));

function App() {
    const path = window.location.pathname;

    return (
        <Suspense fallback={<p>Loading route...</p>}>
            {path === "/settings" ? <Settings/> : <Home/>}
        </Suspense>
    );
}
```

The dynamic imports create asynchronous module boundaries.

When `Settings` is rendered, React needs the module returned by:

```tsx
import("./routes/Settings")
```

If it has not already been loaded, the component suspends while the module becomes available.

In a real application, a routing library or framework normally determines the active route rather than inspecting
`window.location.pathname` directly.

## Route-Level Dynamic Imports

The essential operation is the dynamic import:

```tsx
const Settings = lazy(() => import("./routes/Settings"));
```

The static module dependency graph does not require the settings implementation to be included in the same initial
JavaScript chunk as the current route.

The bundler can identify the dynamic import as a separate loading boundary.

This is different from:

```tsx
import Settings from "./routes/Settings";
```

which establishes a normal static dependency.

A static import may still be optimized by the bundler, but it does not express route-driven asynchronous loading in the
same way.

## Route Mapping

A router can associate route definitions with lazy route modules:

```tsx
const routes = [
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "/settings",
        element: <Settings/>,
    },
];
```

where the route components are defined as:

```tsx
const Home = lazy(() => import("./routes/Home"));
const Settings = lazy(() => import("./routes/Settings"));
```

The router determines which route matches the current location, and rendering that route causes its module to be
requested when necessary.

Framework-specific routers may provide a more integrated mechanism in which the route definition itself controls
loading, data fetching, prefetching, error handling, and rendering.

## Route Boundaries and Bundle Boundaries

A route boundary is not necessarily identical to a JavaScript chunk boundary.

For example:

```tsx
const Account = lazy(() => import("./routes/Account"));
const Settings = lazy(() => import("./routes/Settings"));
```

Both routes may depend on:

```tsx
import {formatDate} from "./shared/date";
```

A bundler can extract that shared dependency into another chunk.

The resulting deployment may therefore contain:

* an initial application chunk
* a shared dependency chunk
* an account route chunk
* a settings route chunk

The architectural boundary is the route-level dynamic dependency. The final physical chunk graph is a bundler concern.

## Shared Dependencies

Route splitting is most effective when route-specific dependencies remain route-specific.

Consider:

```tsx
const Admin = lazy(() => import("./routes/Admin"));
```

If `Admin` imports a large charting library used nowhere else, that dependency can remain associated with the admin
route.

If the dependency is imported by many routes, the bundler may extract it into a shared chunk.

Shared dependencies therefore create an important tradeoff.

Aggressive sharing can avoid duplicate downloads but can also cause a dependency to become part of an earlier loading
path.

The goal is not to maximize the number of chunks. The goal is to create useful loading boundaries.

## Initial Bundle Reduction

The primary benefit of route-based code splitting is reducing the JavaScript required by the initial route.

Without route splitting:

```tsx
import Home from "./routes/Home";
import Admin from "./routes/Admin";
import Reports from "./routes/Reports";
import Settings from "./routes/Settings";
```

the initial dependency graph can include all of these modules.

With route splitting:

```tsx
const Home = lazy(() => import("./routes/Home"));
const Admin = lazy(() => import("./routes/Admin"));
const Reports = lazy(() => import("./routes/Reports"));
const Settings = lazy(() => import("./routes/Settings"));
```

the browser can initially load only the modules required for the route being rendered.

This can reduce:

* transferred JavaScript
* JavaScript parsing
* compilation work
* module evaluation
* memory pressure
* startup work

The exact improvement depends on the application's dependency graph and the browser's caching state.

## Route Navigation

Route-based splitting shifts some loading cost from initial startup to navigation.

When the user navigates to a route whose code has not yet been downloaded:

```tsx
navigate("/reports");
```

the browser may need to fetch the corresponding route chunk before the route can become interactive.

The application therefore exchanges:

```text
larger initial download
```

for:

```text
smaller initial download + additional navigation-time download
```

The correct tradeoff depends on user behavior.

If most users visit only one or two routes, splitting can substantially reduce unnecessary initial work.

If users reliably visit every route during a session, aggressive splitting can increase the number of network requests
and navigation waits.

## Loading UI

A lazy route requires a loading strategy.

```tsx
<Suspense fallback={<RouteLoading/>}>
    <Settings/>
</Suspense>
```

The fallback represents the period during which the route's code is not yet available.

The fallback should be designed around the actual route transition.

A generic:

```tsx
<p>Loading...</p>
```

may be technically correct but provide poor continuity.

A route-level skeleton can preserve the structural shape of the destination:

```tsx
<Suspense fallback={<SettingsSkeleton/>}>
    <Settings/>
</Suspense>
```

The loading UI is part of the route-loading experience, not merely an implementation detail of `lazy()`.

## Route-Level Suspense Boundaries

A route can have a dedicated Suspense boundary:

```tsx
function SettingsRoute() {
    return (
        <Suspense fallback={<SettingsSkeleton/>}>
            <Settings/>
        </Suspense>
    );
}
```

Alternatively, the application shell can provide a broader boundary:

```tsx
<Suspense fallback={<ApplicationLoading/>}>
    <Router/>
</Suspense>
```

The boundary placement determines which part of the UI is replaced while route code loads.

A broad boundary can cause the entire application shell to disappear.

A narrower boundary can preserve navigation, headers, and persistent UI while the route content loads.

Route-based code splitting and Suspense boundary placement should therefore be designed together.

## Persistent Application Shells

A common architecture keeps the application shell outside the route split:

```tsx
function ApplicationLayout() {
    return (
        <>
            <Header/>
            <Navigation/>
            <main>
                <Suspense fallback={<RouteSkeleton/>}>
                    <RouteContent/>
                </Suspense>
            </main>
        </>
    );
}
```

The header and navigation remain available while route-specific code loads.

This improves continuity because only the part of the interface that actually depends on the new route is suspended.

The route component should not unnecessarily contain application-wide infrastructure that prevents the shell from
remaining available.

## Nested Routes

Nested routes can provide multiple code-splitting boundaries.

```tsx
const AccountLayout = lazy(
    () => import("./routes/account/AccountLayout")
);

const Billing = lazy(
    () => import("./routes/account/Billing")
);

const Security = lazy(
    () => import("./routes/account/Security")
);
```

The application can load:

1. account infrastructure when entering `/account`
2. billing-specific code when entering `/account/billing`
3. security-specific code when entering `/account/security`

This can produce finer-grained loading but also increases complexity.

Nested boundaries should reflect meaningful navigational or ownership boundaries rather than being introduced solely to
maximize chunk count.

## Route Layouts

A parent route layout can be loaded separately from child route implementations.

```tsx
const AccountLayout = lazy(
    () => import("./routes/account/AccountLayout")
);
```

The layout may contain:

* navigation
* route-level context
* shared UI
* authorization presentation
* child route outlet

Child routes can then be independently loaded.

This allows the parent route structure to remain available while a child route is being fetched.

## Route Prefetching

A route does not necessarily need to wait until navigation to begin loading its code.

The application can prefetch a likely destination:

```tsx
function preloadSettings() {
    import("./routes/Settings");
}
```

For example:

```tsx
<button
    onMouseEnter={preloadSettings}
    onFocus={preloadSettings}
>
    Settings
</button>
```

The navigation can then reuse the already requested module.

Prefetching changes the loading policy from:

```text
load only after navigation
```

to:

```text
load when navigation becomes likely
```

Prefetching should be based on meaningful signals rather than indiscriminately loading every route.

## Link-Based Prefetching

Applications can prefetch route code when a navigation link becomes likely to be used.

Possible signals include:

* pointer proximity
* focus
* viewport visibility
* explicit user intent
* recent navigation patterns
* framework-managed route prefetching

The objective is to hide navigation-time latency without returning to an unnecessarily large initial download.

## Prefetching and Bandwidth

Prefetching is not free.

A prefetched route still consumes:

* network bandwidth
* browser cache space
* connection resources
* parsing and evaluation resources if executed
* device resources

Prefetching every route can effectively undermine the reason for route splitting.

Use route splitting to defer unnecessary work and prefetch selectively when the probability of navigation justifies the
cost.

## Route Code and Route Data

Route code and route data are separate loading concerns.

A route may require:

```tsx
const Reports = lazy(() => import("./routes/Reports"));
```

and also:

```tsx
const data = await fetchReports();
```

The route's JavaScript module can be split independently from its server data.

A route can therefore have multiple asynchronous dependencies:

* route code
* route data
* images
* fonts
* other resources

Route-based code splitting should not be treated as a general solution for data fetching.

## Route Code and Server State

A route can use server-state management after its code loads.

```tsx
const Reports = lazy(() => import("./routes/Reports"));
```

The `Reports` component can then access its server-state layer.

The code-splitting boundary determines when the component implementation becomes available.

The server-state layer determines how remote data is fetched, cached, synchronized, and invalidated.

These concerns should remain separate.

## Route Code and Resource Caches

A resource cache may allow route data or other resources to begin loading before the route component itself renders.

For example, a navigation system may initiate:

```tsx
import("./routes/Reports");
```

and:

```tsx
preloadReports();
```

at approximately the same time.

This can reduce waterfalls between route-code loading and route-data loading.

However, route code splitting itself does not guarantee parallel resource loading.

The application must intentionally coordinate the relevant loading operations.

## Avoiding Waterfalls

A poor route-loading architecture can create sequential waits:

```text
route navigation
then route JavaScript
then data request
then secondary component JavaScript
```

A better architecture can begin independent work earlier.

For example, route navigation can trigger both route-code loading and known route-data loading.

The exact mechanism depends on the router and application architecture.

The principle is:

> Split code by route, but avoid making every dependency wait unnecessarily for the previous dependency.

## Route-Specific Dependencies

A route is a useful place to isolate dependencies that have little relevance elsewhere.

For example:

```tsx
const Editor = lazy(() => import("./routes/Editor"));
```

where `Editor` depends on:

```tsx
import "large-editor-library";
import "syntax-highlighting-library";
```

Users who never visit the editor route do not need those dependencies during initial startup.

This is one of the strongest use cases for route-based splitting.

## Heavy Feature Dependencies

Large libraries are often particularly suitable for route-local loading.

Examples include:

* rich text editors
* spreadsheet engines
* visualization libraries
* mapping libraries
* PDF viewers
* advanced code editors
* administrative dashboards

Keeping these dependencies behind route boundaries prevents unrelated routes from paying their startup cost.

However, if a dependency is required by nearly every route, moving it behind arbitrary dynamic imports can create
unnecessary loading complexity.

## Authentication and Protected Routes

A protected route can still be code-split:

```tsx
const Admin = lazy(() => import("./routes/Admin"));
```

Authorization should determine whether the user is allowed to access the route.

Code splitting does not provide authorization.

Do not rely on the fact that an admin chunk is not initially downloaded as a security boundary.

A determined client can request or inspect route code if the application exposes it.

The server must enforce authorization independently.

## Route-Based Splitting and Security

Route splitting is a performance and delivery mechanism, not a security mechanism.

This:

```tsx
const Admin = lazy(() => import("./routes/Admin"));
```

does not protect:

* privileged APIs
* confidential data
* authorization rules
* server resources
* secrets

Sensitive operations must be enforced at an authoritative server boundary.

The absence of a route chunk from the initial download does not mean its implementation is secret.

## Error Handling

A route chunk can fail to load.

Possible causes include:

* network interruption
* offline state
* server failure
* CDN failure
* deleted or unavailable deployment assets
* stale cached HTML referencing old chunk names
* deployment inconsistency

The application should provide an error recovery strategy.

A route-level Error Boundary can contain failures:

```tsx
<ErrorBoundary fallback={<RouteLoadError/>}>
    <Suspense fallback={<RouteSkeleton/>}>
        <Settings/>
    </Suspense>
</ErrorBoundary>
```

The Error Boundary handles failure.

The Suspense boundary handles waiting.

These are separate states.

## Chunk Load Failures After Deployment

A common deployment failure occurs when an old application document references a JavaScript chunk that is no longer
available after a deployment.

For example, the client may request an old:

```text
settings-abc123.js
```

while the server now serves a deployment containing:

```text
settings-def456.js
```

A robust deployment architecture should preserve asset availability long enough for existing clients or otherwise
provide a recovery mechanism.

The exact strategy depends on the hosting and deployment system.

## Retry Strategies

A failed route import may be retried in some architectures.

```tsx
function retryImport<T>(
    importer: () => Promise<T>
) {
    return importer().catch(error => {
        // Apply an appropriate retry policy.
        throw error;
    });
}
```

Retries should not blindly repeat indefinitely.

A transient network failure and a permanently missing asset require different handling.

The UI should also provide an actionable recovery path when retrying cannot resolve the problem.

## Error Boundary Placement

An Error Boundary around the entire application can prevent a route loading failure from crashing the whole React tree,
but it may provide a poor recovery experience.

A route-specific boundary can isolate the failure:

```tsx
<ErrorBoundary fallback={<RouteError/>}>
    <Suspense fallback={<RouteLoading/>}>
        <Route/>
    </Suspense>
</ErrorBoundary>
```

The application shell can remain mounted while the failed route is replaced with an error state.

This is often preferable for route-local failures.

## Browser Caching

Route chunks are static assets and can be cached by the browser.

After the first visit to:

```text
/settings
```

the corresponding route module may already be cached.

Subsequent navigation can therefore avoid the original network cost.

This means route splitting should be evaluated across realistic navigation patterns, not only first-load behavior.

## Cache Busting

Production builds commonly produce content-hashed filenames:

```text
settings-8f3a1c.js
```

When the module content changes, the filename changes.

This allows long-lived caching without accidentally reusing an outdated asset.

The HTML or runtime manifest must still reference the correct generated chunk.

## Deployment Consistency

Route splitting increases the number of deployable JavaScript assets.

A deployment should maintain consistency between:

* HTML
* runtime bundles
* route chunks
* shared chunks
* asset manifests

If those versions become inconsistent, route navigation can fail even though the initial application loaded
successfully.

This makes deployment and asset lifecycle part of the operational design of route-based code splitting.

## Source Maps

Split bundles also affect debugging.

Production source maps should preserve meaningful module attribution so failures in route chunks can be traced back to
their source modules.

The application should also distinguish between:

* route chunk failures
* application runtime errors
* server failures
* data-fetching failures

This makes operational diagnosis substantially easier.

## Testing

Tests should verify both application behavior and route-loading behavior.

A route component can be tested independently:

```tsx
render(<Settings/>);
```

The router can be tested for correct route selection.

The lazy-loading boundary can be tested by simulating delayed module resolution and verifying that the expected fallback
appears.

Error handling should also be tested:

```tsx
render(<SettingsRoute/>);
```

with the route module or network layer configured to fail.

Tests should not assume that route splitting changes the semantic behavior of the route itself.

## Performance Measurement

The value of route-based code splitting should be measured using actual loading metrics rather than chunk count.

Useful measurements include:

* initial JavaScript transfer
* JavaScript execution time
* route navigation latency
* time until route content becomes usable
* cache-hit behavior
* route chunk size
* shared chunk size
* frequency of route visits
* prefetch effectiveness

A design with fifty tiny chunks is not automatically better than one with ten well-chosen chunks.

The relevant objective is reducing unnecessary work while preserving acceptable navigation latency.

## Over-Splitting

A component does not necessarily deserve its own asynchronous boundary simply because it can be dynamically imported.

Excessive splitting can create:

* many network requests
* increased request coordination
* additional loading states
* more complex caching
* more complicated error handling
* navigation latency
* fragmented dependency graphs

Route boundaries are usually stronger candidates than arbitrary component boundaries because navigation provides a
meaningful user-level loading boundary.

## Under-Splitting

The opposite problem is keeping large route-specific dependencies in the initial bundle.

For example, an application may have:

```tsx
import Editor from "./routes/Editor";
import Reports from "./routes/Reports";
import Admin from "./routes/Admin";
```

even though most users never visit those routes.

The initial application then pays the cost of code that may never execute.

Route-based splitting addresses this by moving those dependencies behind navigation boundaries.

## Route Granularity

Not every URL needs a separate code-splitting boundary.

For example, several closely related routes can intentionally share an implementation:

```tsx
/account/
profile
/ account / preferences
/ account / security
```

A parent account module can contain common infrastructure while child routes split only where their dependencies become
meaningfully different.

The correct granularity depends on:

* dependency size
* navigation frequency
* shared code
* route relationships
* expected user journeys
* loading performance
* operational complexity

## Route Groups

Some routers and frameworks provide route-grouping mechanisms that affect code organization without necessarily
producing separate runtime chunks.

Do not assume that a directory structure or route-grouping syntax automatically creates a browser-level code-splitting
boundary.

A real code-splitting boundary requires an asynchronous module dependency or framework mechanism that produces
equivalent behavior.

## Framework Integration

Frameworks can integrate route-based code splitting directly into their routing systems.

Such systems may automatically handle:

* dynamic route imports
* route manifests
* prefetching
* chunk generation
* route loading
* nested layouts
* data dependencies
* error boundaries
* streaming
* caching

The underlying architectural principle remains the same: route navigation determines which code needs to become
available.

Framework-specific behavior should be treated as an implementation of the broader route-based loading strategy rather
than as the definition of the pattern itself.

## React Server Components

In architectures using Server Components, route-based code splitting interacts with the server/client component
boundary.

A route may contain substantial server-executed component code that does not become browser JavaScript at all.

Client Components, by contrast, contribute browser-side code and can participate in client-side route splitting.

Therefore, reducing client JavaScript may sometimes be achieved by moving appropriate responsibilities to Server
Components rather than merely creating more client-side chunks.

These mechanisms solve different problems:

* Server Components reduce the amount of component implementation shipped to the browser.
* Route-based code splitting defers browser code until a route requires it.

They can be combined.

## Client Component Boundaries

A route containing a Client Component can pull browser-side dependencies into its client bundle.

Route-based splitting can prevent that bundle from being required for unrelated routes.

The boundary should therefore be considered together with the application's client component architecture.

A route that imports a large client-side dependency may remain relatively cheap for the initial application if the
entire route is deferred.

## Hydration

Route-based code splitting can affect when client-side code required for a route becomes available for hydration.

In a server-rendered application, the server may produce route markup while the browser still needs the corresponding
client modules.

The application must ensure that the relevant client chunks are discoverable and loadable when hydration requires them.

Route splitting therefore interacts with hydration but does not replace hydration boundaries.

## Streaming

Server rendering and streaming can allow route content to begin arriving before all client-side JavaScript has finished
loading.

Route code splitting still controls browser-side module delivery.

These are separate dimensions:

* streaming controls delivery of rendered output
* code splitting controls delivery of JavaScript modules

A route can use both.

## Transitions

Navigation updates can be coordinated with React transitions:

```tsx
startTransition(() => {
    navigate("/settings");
});
```

This can allow the UI to remain responsive while the destination is prepared.

The transition does not download route code by itself.

The route's asynchronous module loading remains a separate concern.

A good navigation architecture can combine:

* route-based code splitting
* Suspense
* transitions
* route prefetching

to provide a smoother navigation experience.

## Stable Route Identity

Route changes can replace one route component with another.

Component identity determines whether state is preserved or reset within the resulting tree.

Code splitting does not alter React's identity rules.

A lazy-loaded route that resolves to the same component type can participate in normal React reconciliation. A route
change that produces a different identity can replace the previous component instance.

Loading behavior and component identity should therefore not be conflated.

## Accessibility

Route loading must preserve accessible navigation behavior.

When a route transition occurs, the application should provide appropriate:

* focus management
* navigation announcements where necessary
* loading status communication
* error communication
* keyboard accessibility

A route loading fallback should not trap focus or make the application appear unresponsive.

Code splitting is an implementation strategy; it does not automatically produce an accessible navigation experience.

## Common Misuse

### Splitting Every Component

Dynamic-importing every component creates excessive asynchronous boundaries.

Route boundaries are generally a stronger default because they correspond to user navigation.

### Treating Chunks as Security Boundaries

A deferred admin chunk is not an authorization mechanism.

The server must enforce access control.

### Assuming One Route Equals One Chunk

Bundlers can extract shared dependencies and create additional chunks.

The architectural boundary is the route-driven dynamic import, not a guaranteed physical one-file-per-route result.

### Prefetching Everything

Prefetching every route defeats much of the purpose of deferring route code.

Prefetch based on meaningful navigation probability.

### Ignoring Loading UI

A route can suspend while its module loads.

Without an appropriate Suspense strategy, the resulting experience can be abrupt or confusing.

### Ignoring Chunk Failures

Dynamic imports can fail in production.

Route loading needs an Error Boundary and an appropriate recovery strategy.

### Hiding Large Dependencies in Shared Modules

Moving a large route-specific library into a broadly imported shared module can cause it to enter the initial bundle.

Dependency placement matters as much as route definitions.

### Confusing Code Splitting with Data Fetching

Loading a route module does not automatically load its remote data efficiently.

Code and data have separate loading lifecycles.

### Over-Splitting Nested Routes

Every nested route does not necessarily require an independent asynchronous boundary.

Split where the loading benefit justifies the additional complexity.

## Advantages

Route-based code splitting reduces the initial JavaScript required for applications with multiple substantial routes.

It defers route-specific dependencies until they become relevant.

It can substantially reduce initial parsing, compilation, and evaluation work.

It provides natural boundaries for loading UI and error handling.

It works well with route prefetching to trade unused initial work for likely future work.

It can isolate large feature dependencies such as editors, dashboards, and visualization libraries.

It aligns code delivery with a meaningful user-level navigation boundary.

## Disadvantages

Route navigation can incur additional latency when the destination code is not cached or prefetched.

More chunks increase deployment and caching complexity.

Poorly chosen boundaries can create waterfalls.

Aggressive splitting can produce excessive network overhead and fragmented dependencies.

Prefetching can recover navigation performance at the cost of bandwidth and cache resources.

Shared dependencies can make the resulting chunk graph less predictable than the source route structure suggests.

Route chunk failures introduce an additional operational failure mode.

## When to Use

Use route-based code splitting when:

* the application has multiple substantial routes
* route-specific dependencies are large
* users commonly visit only a subset of routes
* initial JavaScript is a performance bottleneck
* certain features are rarely used
* route navigation already provides a meaningful loading boundary
* a route contains expensive client-side libraries
* the framework or router supports route-level loading and prefetching

It is particularly valuable for large applications where administrative, reporting, editing, or specialized
functionality would otherwise inflate the initial bundle.

## When Not to Use

Do not introduce route splitting solely because an application has multiple URLs.

A small application with a tiny JavaScript payload may receive little benefit.

Do not split extremely small routes when the resulting network and loading complexity outweighs the savings.

Do not use route splitting as a substitute for reducing unnecessary dependencies.

Do not use it as an authorization mechanism.

Do not assume that creating more chunks automatically improves performance.

## Relationships to Other Patterns

### Lazy Components

Lazy components establish asynchronous component loading.

Route-based code splitting applies the same mechanism at a navigational boundary.

The broader pattern is component-level lazy loading; route-based splitting chooses routes as the primary loading
boundary.

### Nested Suspense Boundaries

Suspense determines how asynchronous route loading is represented in the UI.

Nested boundaries allow the application to preserve persistent route shells while more specific route content loads.

### Data Fetching

Data fetching retrieves route data.

Route-based code splitting retrieves the JavaScript required to execute the route.

The two loading processes can be coordinated but should remain conceptually distinct.

### Resource Cache

A resource cache can preload or reuse route data and other asynchronous resources.

It does not determine the JavaScript chunk structure.

### Server State

Server state concerns remote authoritative data.

Route splitting concerns browser code delivery.

A route can use server state after its code is loaded.

### Client Component Boundary

Client Component boundaries determine which components require browser-side JavaScript.

Route-based splitting determines when route-specific browser code becomes necessary.

### Server Components

Server Components can reduce the amount of component implementation shipped to the browser.

Route splitting defers the remaining browser-side code by navigation.

### Hydration Boundary

Hydration determines where server-rendered output becomes client-owned.

Route splitting determines when the JavaScript needed by a route can be loaded.

### Suspense Boundary

Suspense represents asynchronous readiness in the UI.

A route-level Suspense boundary can represent the wait for route code, while nested boundaries can independently
represent other asynchronous dependencies.

### Error Boundary

Error Boundaries contain failures.

A route-level Error Boundary can isolate dynamic-import failures from the rest of the application shell.

### Transition

Transitions coordinate the priority of navigation-related updates.

They do not themselves perform code splitting or prefetching.

### Progressive Enhancement

Progressive enhancement concerns making core functionality available without depending entirely on client-side
JavaScript.

Route-based code splitting assumes a JavaScript-capable application architecture and therefore should be considered
alongside, not as a replacement for, progressive enhancement strategies.

## Design Rules

1. Treat navigation boundaries as the primary unit of route-based code splitting.

2. Use asynchronous module loading for route implementations rather than static imports when deferral is intended.

3. Keep route-specific heavy dependencies behind the route boundary.

4. Do not assume that one route produces exactly one physical chunk.

5. Preserve persistent application shells outside route-specific Suspense boundaries when appropriate.

6. Provide deliberate loading UI for route-code loading.

7. Provide Error Boundary recovery for route chunk failures.

8. Do not confuse code splitting with data fetching.

9. Coordinate route code and route data when independent loading can avoid waterfalls.

10. Prefetch routes when there is meaningful evidence that navigation is likely.

11. Do not prefetch every route indiscriminately.

12. Evaluate split granularity using real loading and navigation measurements.

13. Keep shared dependencies intentional because they influence the resulting chunk graph.

14. Do not use route splitting as a security boundary.

15. Enforce authorization independently of which route code is loaded.

16. Account for deployment consistency between route chunks, shared chunks, and the application runtime.

17. Consider browser caching when evaluating the cost of route navigation.

18. Combine route splitting with Server Components when reducing browser JavaScript requires architectural rather than
    merely loading-level changes.

19. Use route splitting to defer meaningful feature dependencies, not to maximize chunk count.

20. Treat loading, failure, and successful route rendering as separate states.

## Core Principle

Route-based code splitting makes navigation a JavaScript delivery boundary.

The route determines when a portion of the application's browser code becomes necessary:

```tsx
const Reports = lazy(
    () => import("./routes/Reports")
);
```

The initial application does not need to eagerly execute the implementation of every route. When navigation requires
`Reports`, its module can be loaded, rendered through an appropriate Suspense boundary, and reused from the browser
cache on subsequent visits.

The objective is not to create as many chunks as possible. The objective is to align code delivery with actual user
journeys so that users do not pay the startup cost of route-specific code they do not yet need, while navigation remains
responsive when that code does become necessary.
