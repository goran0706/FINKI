# Route-Based Lazy Loading

Route-Based Lazy Loading defers loading the implementation of a route until navigation requires that route. Instead of
including every page and route-specific dependency in the initial JavaScript payload, the application establishes
asynchronous loading boundaries around navigable features.

The pattern combines routing with code splitting. The route remains part of the application's navigation model, while
its component implementation is loaded only when the route becomes relevant.

The central concern is therefore not merely lazy components, but **aligning JavaScript loading boundaries with
navigation boundaries**.

## Intent

Use route-based lazy loading to prevent routes that users may never visit from contributing their complete
implementation and dependency graph to the initial JavaScript payload.

A typical route definition looks conceptually like:

```tsx
const SettingsPage = lazy(() => import("./SettingsPage"));

const routes = [
    {
        path: "/settings",
        element: <SettingsPage/>,
    },
];
```

The routing system still knows that `/settings` exists. The implementation of that route is loaded asynchronously when
the route needs to render.

## Route as a Loading Boundary

A route is often a natural code-splitting boundary because navigation already establishes a meaningful transition in
application usage.

For example:

```tsx
const DashboardPage = lazy(() => import("./DashboardPage"));
const ReportsPage = lazy(() => import("./ReportsPage"));
const SettingsPage = lazy(() => import("./SettingsPage"));
```

A user visiting the dashboard does not necessarily need the implementation of reports or settings.

The resulting loading boundaries correspond to application capabilities rather than arbitrary component boundaries.

## Basic Pattern

Using React Router as an example:

```tsx
import {lazy, Suspense} from "react";
import {Routes, Route} from "react-router-dom";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

export function ApplicationRoutes() {
    return (
        <Suspense fallback={<PageSkeleton/>}>
            <Routes>
                <Route path="/dashboard" element={<DashboardPage/>}/>
                <Route path="/reports" element={<ReportsPage/>}/>
                <Route path="/settings" element={<SettingsPage/>}/>
            </Routes>
        </Suspense>
    );
}
```

The exact router API varies by routing library. The architectural pattern does not depend on a particular router.

## Route Resolution vs Module Resolution

Routing and module loading solve different problems.

The router determines which route matches the current location:

```text
current URL
route matching
route selection
```

The module system determines whether the implementation required by that route is available:

```text
selected route
dynamic import
module resolution
component rendering
```

A route can therefore be known to the router even though its component implementation has not yet been downloaded.

This distinction is important because routing is application navigation, while dynamic import is JavaScript resource
loading.

## Suspense Boundary Placement

A route-based lazy-loading strategy requires an appropriate rendering boundary for the pending route.

A global boundary is simple:

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <Routes/>
</Suspense>
```

However, a single global boundary means navigating to one lazy route can replace the entire routed region with the same
fallback.

A more granular architecture can place boundaries around specific route regions:

```tsx
<Layout>
    <Header/>

    <Suspense fallback={<PageSkeleton/>}>
        <Routes/>
    </Suspense>

    <Footer/>
</Layout>
```

The boundary should generally correspond to the portion of the interface that is actually unavailable while the
destination route loads.

## Navigation Loading State

Route navigation introduces a state that ordinary component lazy loading does not necessarily have: the user has
explicitly requested a different application location.

A useful route transition can therefore distinguish:

* current route;
* navigation in progress;
* destination route loading;
* destination route rendered;
* navigation failure.

The exact representation depends on the routing framework.

The loading UI should communicate that navigation is occurring rather than appearing as an unrelated application-wide
loading state.

## Preserving the Application Shell

The application shell often does not need to disappear while a route loads.

For example:

```tsx
function Application() {
    return (
        <AppShell>
            <Navigation/>

            <Suspense fallback={<PageSkeleton/>}>
                <ApplicationRoutes/>
            </Suspense>
        </AppShell>
    );
}
```

The navigation remains interactive and visually stable while the destination page is being loaded.

This usually produces a better navigation experience than replacing the entire document with a generic spinner.

## Route-Level Skeletons

A route-specific fallback can preserve the expected layout of the destination:

```tsx
<Suspense fallback={<ReportsPageSkeleton/>}>
    <ReportsPage/>
</Suspense>
```

The fallback should approximate the structural shape of the destination when possible.

This reduces layout movement and allows users to understand where the destination content will appear.

## Nested Routes

Nested routing creates additional opportunities for code splitting.

For example:

```tsx
const AccountLayout = lazy(() => import("./account/AccountLayout"));
const ProfilePage = lazy(() => import("./account/ProfilePage"));
const SecurityPage = lazy(() => import("./account/SecurityPage"));
```

The parent route and child routes can have separate loading boundaries.

A user entering the account area may need the account layout immediately, while a specific child page can remain
separately loadable.

The correct boundary depends on whether the nested route implementations share enough functionality to justify loading
them together.

## Parent and Child Route Dependencies

A nested route may depend on a parent route's implementation:

```tsx
<AccountLayout>
    <ProfilePage/>
</AccountLayout>
```

If both are independently lazy-loaded, navigation can involve multiple asynchronous dependencies.

This can be beneficial when child routes are large and independently visited, but excessive fragmentation can create
unnecessary loading stages.

The route hierarchy should therefore be considered together with the dependency graph.

## Route Groups

Related routes can sometimes share a loading boundary.

For example, an administrative section may contain:

```tsx
const AdminApplication = lazy(() => import("./admin/AdminApplication"));
```

and internally provide:

```tsx
/admin/us
ers
/ admin / audit
/ admin / settings
```

This creates a larger feature-level boundary rather than a separate chunk for every route.

This can be preferable when users who enter the administrative area are highly likely to navigate among its routes.

The correct granularity depends on actual navigation behavior and dependency overlap.

## Route Granularity

There is no universal rule that every route should become a separate lazy chunk.

Fine-grained splitting:

```tsx
const Users = lazy(() => import("./Users"));
const Orders = lazy(() => import("./Orders"));
const Reports = lazy(() => import("./Reports"));
```

can minimize unused code per route.

But coarse-grained splitting:

```tsx
const Admin = lazy(() => import("./Admin"));
```

can reduce asynchronous boundaries and improve transitions between closely related features.

The optimal boundary is determined by:

* route frequency;
* module size;
* dependency overlap;
* navigation patterns;
* caching;
* network conditions;
* application startup requirements.

## Initial Route

The initial route deserves special consideration.

Lazy-loading the first route can reduce the eagerly executed application bundle, but the application must then perform
an additional asynchronous module resolution before the initial page can render.

If a route is required by nearly every user immediately, making it lazy may provide little benefit.

The initial route should therefore be evaluated as part of the critical rendering path rather than automatically treated
as a candidate for splitting.

## Critical Routes

A route that is almost universally visited may be better kept eagerly available.

For example, if nearly every user starts at `/dashboard`, moving the entire dashboard implementation behind a lazy
boundary can introduce unnecessary startup latency.

Route-based lazy loading is most valuable for routes whose implementation is not part of the common critical path.

## Authentication and Protected Routes

Protected routes are particularly useful candidates for route-level code splitting.

For example:

```tsx
const AdminPage = lazy(() => import("./AdminPage"));
```

If only authorized users can reach the route, most users may never need its implementation.

However, lazy loading is not an authorization mechanism.

The server must still enforce authorization independently of whether the client downloads the route module.

Client-side route protection controls navigation and presentation. It does not establish a security boundary.

## Role-Specific Features

The same principle applies to role-specific application areas:

```tsx
const Accounting = lazy(() => import("./Accounting"));
const Administration = lazy(() => import("./Administration"));
```

A user who never accesses those features does not need their implementation during normal application startup.

Again, this is a performance optimization, not a security mechanism.

## Navigation Prefetching

Route-based lazy loading can be combined with preloading.

If the application can determine that a user is likely to navigate to a destination, it can begin loading that route's
module before navigation completes.

Conceptually:

```tsx
function ReportsLink() {
    return (
        <a
            href="/reports"
            onMouseEnter={() => {
                void import("./pages/ReportsPage");
            }}
        >
            Reports
        </a>
    );
}
```

The preload begins before the route is rendered.

This can reduce the visible delay after navigation, but it consumes bandwidth before the route is actually required.

## Link-Based Prefetching

Navigation links provide particularly useful signals for speculative loading.

Possible signals include:

* pointer interaction;
* keyboard focus;
* viewport visibility;
* explicit user intent;
* recent navigation behavior.

A framework may provide its own route prefetching mechanism. When available, that mechanism should generally be
preferred over manually duplicating router internals.

## Prefetching Trade-Offs

Prefetching trades bandwidth for latency.

Aggressive prefetching can cause:

* unnecessary downloads;
* competition with critical resources;
* increased mobile data consumption;
* cache pollution;
* wasted work when users do not navigate.

Prefetching should therefore be based on a sufficiently strong prediction of future navigation.

## Route Data vs Route Code

A route may require both its implementation and its data.

For example:

```tsx
const ProductPage = lazy(() => import("./ProductPage"));
```

and:

```tsx
const product = await fetchProduct(productId);
```

represent different resources.

The route code defines how the page executes.

The route data defines what the page displays.

Route-based lazy loading should not be used as a substitute for route data management.

## Route Data Loaders

Some routing systems associate data loaders with routes.

Conceptually, a route may have:

```text
route implementation
route data
```

Both can be asynchronous, but they have different lifecycle semantics.

Route code is a JavaScript module resource.

Route data is application data and may require caching, revalidation, invalidation, authentication, cancellation, and
synchronization.

These concerns should remain separate even when the routing framework coordinates them.

## Route Loading vs Server State

Server state belongs to the server and is consumed through client-side synchronization mechanisms.

A lazy route module is executable application code.

For example:

```tsx
const OrdersPage = lazy(() => import("./OrdersPage"));
```

does not represent the orders themselves.

The page may consume server state through a query or external data layer after it loads.

The route-loading boundary should therefore not become the owner of server-state semantics.

## Route Loading vs Resource Cache

A resource cache may cache data resources according to resource identity, freshness, and invalidation rules.

Route code is generally managed by the module loader, browser cache, bundler output, and deployment infrastructure.

Although both involve asynchronous resources, their identities and lifecycle policies differ.

The application should not treat a downloaded route module as though it were a data-cache entry.

## Route Loading and Component State

Changing routes commonly causes route components to mount and unmount according to route identity.

Their local state therefore follows normal React component identity rules.

For example:

```tsx
const EditorPage = lazy(() => import("./EditorPage"));
```

does not imply that editor state survives navigation away from the route.

If state must survive route changes, its ownership must be placed at an appropriate persistent boundary rather than
relying on lazy loading.

## Route Parameters

Route parameters can determine which data a route displays without necessarily changing which route module is loaded.

For example:

```tsx
const ProductPage = lazy(() => import("./ProductPage"));
```

can serve:

```text
/products/1
/products/2
/products/3
```

The product ID is route data or route state. It does not necessarily justify a separate module for every parameter
value.

Code splitting should normally occur at the structural route or feature level, not at the individual resource-instance
level.

## Dynamic Route Imports

Some systems construct import paths dynamically:

```tsx
const page = await import(`./pages/${pageName}.tsx`);
```

This can complicate bundler analysis and may cause the bundler to include a broader set of possible modules.

Static import boundaries are generally easier for build tooling to analyze:

```tsx
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
```

When dynamic imports are required, the application's bundler behavior should be verified rather than assumed.

## Route Configuration Stability

Route definitions should generally remain stable.

For example:

```tsx
const ReportsPage = lazy(() => import("./pages/ReportsPage"));

const routes = [
    {
        path: "/reports",
        element: <ReportsPage/>,
    },
];
```

Creating route-specific lazy component types repeatedly during rendering can interfere with component identity and can
cause unnecessary remounting.

The route configuration and lazy component declarations should be designed as stable application structure.

## Error Handling

A route module can fail to load.

Possible causes include:

* network failure;
* unavailable chunk;
* stale deployment references;
* CDN failure;
* module evaluation failure;
* incompatible or corrupted assets.

Suspense represents the pending state, while an Error Boundary or router-level error mechanism can handle failure.

For example:

```tsx
<ErrorBoundary fallback={<RouteLoadError/>}>
    <Suspense fallback={<PageSkeleton/>}>
        <ApplicationRoutes/>
    </Suspense>
</ErrorBoundary>
```

The routing system may provide more specific navigation-error mechanisms, which can be preferable when available.

## Chunk Load Failures

A particularly important production failure occurs when an application version references an asynchronously loaded chunk
that is no longer available after deployment.

For example:

```text
application version A
route chunk from version A
deployment
application version B
old application requests obsolete chunk
```

The exact failure mechanism varies by deployment and bundler configuration, but the general problem is a mismatch
between the application shell and asynchronously loaded assets.

Production systems should therefore use appropriate asset versioning, cache policies, immutable filenames, and recovery
behavior.

## Retry Strategy

Transient loading failures may be retried.

A retry mechanism should distinguish transient failures from persistent deployment or asset failures.

Blindly retrying a permanently unavailable chunk can leave the user stuck in an indefinite loading state.

A practical recovery strategy may eventually offer:

* retry;
* navigation elsewhere;
* application refresh;
* an explicit error message.

The appropriate strategy depends on the deployment environment and application requirements.

## Navigation Cancellation

Navigation can change before a lazy route has finished loading.

For example, a user may:

1. navigate to `/reports`;
2. begin loading the reports module;
3. immediately navigate to `/settings`.

The router must determine which navigation is current.

Importing a JavaScript module is not equivalent to cancelling the network request. The browser and module loader may
continue resolving the module even when the user no longer needs the route.

This is an important distinction from cancellable application data requests.

## Stale Navigation

A route module may resolve after the user has already navigated elsewhere.

The routing system must ensure that stale navigation results do not replace the currently active route.

This is primarily a routing concern rather than a `lazy()` concern.

The route-loading architecture should therefore rely on the router's navigation lifecycle rather than implementing
independent route identity tracking unnecessarily.

## Navigation Transitions

Route changes can be coordinated with React transitions when appropriate.

A transition can allow a navigation-related update to be treated as non-urgent work:

```tsx
startTransition(() => {
    navigate("/reports");
});
```

The exact interaction depends on the routing framework.

The important architectural distinction is that code loading, route matching, and transition priority are separate
mechanisms that can be composed.

## Layout Persistence

Many applications have layouts that persist across route changes:

```tsx
<AppLayout>
    <Navigation/>
    <RouteContent/>
</AppLayout>
```

The layout can remain mounted while route-specific implementations are lazy-loaded.

This allows persistent state such as navigation state, selected workspace, or other shell-level state to remain
available while destination pages change.

The placement of the lazy boundary should respect which parts of the route hierarchy are intended to persist.

## Nested Suspense Boundaries

Nested route structures can use multiple boundaries:

```tsx
<Suspense fallback={<AccountSkeleton/>}>
    <AccountLayout>
        <Suspense fallback={<ProfileSkeleton/>}>
            <ProfilePage/>
        </Suspense>
    </AccountLayout>
</Suspense>
```

This allows the parent feature and child page to reveal independently.

However, excessive nesting can make loading behavior difficult to reason about. Boundaries should represent meaningful
UX states rather than being introduced merely because multiple imports exist.

## Route-Level Error Boundaries

Errors can also be scoped according to route boundaries.

A route-level error UI can preserve the rest of the application shell:

```tsx
<AppLayout>
    <RouteErrorBoundary>
        <Suspense fallback={<PageSkeleton/>}>
            <ApplicationRoutes/>
        </Suspense>
    </RouteErrorBoundary>
</AppLayout>
```

This prevents a failure in one destination from necessarily destroying unrelated persistent application UI.

The exact mechanism depends on the routing framework.

## SEO and Initial Rendering

For applications that depend on server rendering or search-engine discoverability, route-based code splitting must be
integrated with the rendering architecture.

A route being lazy on the client does not automatically imply that its server-rendered representation is unavailable.

Frameworks can resolve route modules during server rendering and stream or serialize the appropriate output.

The important architectural requirement is that the server and client agree on the route's implementation and hydration
behavior.

## Server Rendering

Server-rendered applications often need route-aware module resolution.

A server may need to load the route implementation to produce the initial HTML, while the client subsequently needs the
corresponding JavaScript for hydration.

This means that route-based lazy loading does not necessarily eliminate the server's need to know about the route
implementation.

Instead, it changes how the implementation is organized and delivered.

## Hydration

Hydration introduces another consideration: the client must be able to obtain the code required to hydrate the rendered
route.

A route that was rendered on the server still requires an appropriate client-side module boundary.

The routing, bundling, server-rendering, and hydration systems therefore need compatible module resolution.

## Accessibility

Navigation loading states should preserve understandable semantics.

A route transition should not leave users with an unexplained blank region or inaccessible loading indicator.

For example:

```tsx
<Suspense fallback={<div role="status">Loading reports...</div>}>
    <ReportsPage/>
</Suspense>
```

The precise semantics depend on whether the loading state represents an entire page transition or only a subsection of
the current page.

The application's navigation state should remain understandable to keyboard and assistive-technology users.

## Performance Measurement

Route-based lazy loading should be evaluated using actual application performance rather than bundle-size reduction
alone.

Relevant measurements can include:

* initial JavaScript transferred;
* initial JavaScript execution;
* initial render latency;
* route navigation latency;
* destination module transfer time;
* destination rendering time;
* cache hit rate;
* chunk failure rate;
* prefetch effectiveness.

A reduction in initial bundle size is useful only if it improves meaningful user-facing performance.

## Bundle Analysis

The source code does not completely determine the final chunk structure.

Bundlers may:

* extract shared dependencies;
* merge modules;
* split vendor dependencies;
* preload chunks;
* duplicate small dependencies;
* optimize chunk boundaries.

Bundle analysis should therefore be used to verify whether route boundaries actually produce useful output.

## Shared Route Dependencies

Multiple routes may depend on the same library:

```tsx
const ReportsPage = lazy(() => import("./ReportsPage"));
const AnalyticsPage = lazy(() => import("./AnalyticsPage"));
```

If both depend on the same substantial library, the bundler may extract that library into shared output.

This can be beneficial because the dependency only needs to be downloaded once.

It can also mean that the initial bundle or another route chunk contains shared code that developers did not expect from
looking only at individual route files.

## Caching Across Navigation

Once a route's JavaScript has been successfully loaded and cached, subsequent visits can be substantially cheaper.

This means route-based lazy loading is not necessarily a repeated network cost for every navigation.

The browser's HTTP cache and the bundler's asset strategy determine the actual behavior.

The application should therefore distinguish first navigation from repeat navigation when evaluating performance.

## Prefetch vs Eager Loading

Prefetching and eager loading are not identical.

Eager loading includes code in the initial loading path.

Prefetching starts loading code before it is immediately required but does not necessarily make it part of the critical
path.

Lazy loading waits until the route requires the module.

These are different points on the spectrum between immediate availability and deferred availability.

## Testing

Route-based lazy loading should be tested at the navigation level rather than only by rendering individual components.

Tests should verify:

* the correct route is selected;
* the loading state appears when appropriate;
* the destination renders after module resolution;
* navigation away from a pending route behaves correctly;
* loading failures are handled;
* protected routes do not expose unauthorized UI;
* route state behaves correctly across navigation;
* persistent layouts remain mounted where intended.

Example:

```tsx
render(<Application/>);

await user.click(screen.getByRole("link", {name: "Reports"}));

expect(screen.getByText("Loading reports...")).toBeInTheDocument();

expect(
    await screen.findByRole("heading", {name: "Reports"}),
).toBeInTheDocument();
```

Tests should avoid coupling themselves to generated chunk filenames or bundler-specific output.

## Common Misuse

### Lazy-Loading Every Route

Every route does not necessarily deserve an independent chunk.

Routes that are tiny, universally visited, or tightly coupled may be better grouped.

### Lazy-Loading the Critical Initial Route Without Measuring

Moving the primary entry route behind a lazy boundary can add startup latency while producing little practical benefit.

### Treating Lazy Loading as Security

A route that has not been downloaded is not a protected resource.

Authorization must be enforced by the server and appropriate application security mechanisms.

### Confusing Route Code With Route Data

A route component and the data it displays have separate lifecycles.

Code splitting does not provide data caching, synchronization, or invalidation.

### Excessive Route Fragmentation

Creating a separate asynchronous boundary for every nested route can produce too many loading stages.

Related routes should sometimes share a feature-level boundary.

### Over-Prefetching

Prefetching every link wastes bandwidth and can compete with more important resources.

### Declaring Lazy Components During Render

Avoid:

```tsx
function RouterView() {
    const ReportsPage = lazy(() => import("./ReportsPage"));

    return <ReportsPage/>;
}
```

Prefer:

```tsx
const ReportsPage = lazy(() => import("./ReportsPage"));

function RouterView() {
    return <ReportsPage/>;
}
```

### Implementing Custom Navigation Cancellation for Module Imports

Route identity and navigation cancellation should normally be delegated to the routing system.

The fact that a dynamic import is still resolving does not by itself mean that its result is unsafe to cache or reuse.

## Advantages

Route-based lazy loading can reduce initial JavaScript, isolate optional application areas, defer large route-specific
dependencies, and align code-loading boundaries with user navigation.

It also provides a natural basis for route-level loading and error states and can work well with prefetching and
persistent application shells.

## Disadvantages

It introduces asynchronous navigation dependencies, additional loading states, chunk failure modes, deployment
complexity, and potentially increased first-navigation latency.

Poorly chosen boundaries can create excessive chunks or unnecessary loading stages.

The pattern also requires coordination between routing, bundling, caching, server rendering, and deployment
infrastructure.

## When to Use

Use route-based lazy loading when:

* the application contains multiple substantial routes;
* some routes are rarely visited;
* routes introduce large dependencies;
* authenticated or role-specific areas are optional for many users;
* route boundaries correspond to meaningful feature boundaries;
* initial JavaScript size is a significant performance concern.

## When Not to Use

Avoid or limit route-based lazy loading when:

* the application is small;
* nearly all routes are immediately visited;
* route modules are extremely small;
* the additional loading latency outweighs the initial bundle savings;
* the route structure does not correspond to useful code boundaries;
* the application's deployment environment cannot reliably serve versioned asynchronous assets.

## Relationship to Lazy Components

`Lazy Components` defines the general component-level mechanism for asynchronously loading component modules.

`Route-Based Lazy Loading` applies that mechanism to navigation boundaries.

This file therefore owns route-specific concerns such as navigation loading, route granularity, route prefetching,
nested routes, protected routes, persistent layouts, navigation failures, and route-level performance.

## Relationship to Suspense Boundaries

Suspense provides the rendering mechanism for suspended route components.

Route-based lazy loading determines where asynchronous component loading occurs in relation to navigation.

A route-level Suspense boundary is therefore a rendering concern attached to a navigation-oriented loading boundary.

## Relationship to Data Fetching

Data fetching obtains remote or local application data.

Route-based lazy loading obtains route implementation code.

A route may perform both operations during navigation, but they should retain independent lifecycle and failure
semantics.

## Relationship to Server State

Server state is authoritative data maintained by a server and synchronized into the client.

Route modules are executable code.

A route may consume server state, but route loading does not define server-state ownership, caching, synchronization,
invalidation, or mutation behavior.

## Relationship to Resource Cache

Resource caching manages reusable asynchronous resources, generally with explicit resource identity and freshness
semantics.

Route modules are managed by the module loader, bundler, browser cache, and deployment infrastructure.

These are distinct resource systems.

## Relationship to Server Components

In architectures that use Server Components, route boundaries may intersect with server/client component boundaries.

A route can contain server-rendered or server-executed components as well as client components requiring browser
JavaScript.

Route-based lazy loading should therefore not be treated as synonymous with server/client component splitting.

The server/client boundary determines where code executes. Route-based lazy loading determines when route implementation
resources are made available.

## Relationship to State Ownership

Navigating between routes commonly changes which components are mounted.

State that should persist across navigation belongs at a persistent owner such as a layout or higher-level application
boundary.

Route-based lazy loading does not determine state ownership.

## Relationship to Component Identity

Lazy route components are still React component types.

Stable lazy declarations are therefore important for preserving expected component identity.

Creating lazy component types during render can cause remounting and unintended state loss.

## Relationship to Memoization

Memoization reduces unnecessary computation or rendering.

Route-based lazy loading reduces unnecessary code loading.

They address different performance problems and should not be substituted for one another.

## Design Rules

1. Align lazy route boundaries with meaningful navigation or feature boundaries.
2. Keep lazy route component declarations stable and outside render functions.
3. Place Suspense boundaries around UI regions that can meaningfully display route-loading states.
4. Preserve persistent application shells when possible.
5. Do not treat lazy loading as an authorization or security mechanism.
6. Keep route code loading separate from route data loading.
7. Avoid splitting every small route into an independent chunk.
8. Group closely related routes when their dependency and navigation patterns justify it.
9. Prefetch routes only when there is a meaningful signal that navigation is likely.
10. Account for first navigation separately from repeat navigation when measuring performance.
11. Handle asynchronous chunk failures explicitly in production.
12. Use deployment and caching strategies that support asynchronously loaded assets across application versions.
13. Let the router own navigation identity and navigation lifecycle.
14. Do not assume dynamic imports map one-to-one to network requests.
15. Verify generated chunk structure with bundle analysis.
16. Preserve accessibility semantics during route loading.
17. Keep route-level code splitting separate from server-state and resource-cache concerns.
18. Measure user-facing navigation performance rather than optimizing bundle size in isolation.

## Summary

Route-Based Lazy Loading places asynchronous JavaScript loading boundaries around application navigation. A route
remains part of the routing model, but its implementation is loaded when navigation requires it.

The strongest route boundaries usually correspond to substantial or optional application areas: reports, administration,
advanced editors, account management, or other features that are not required by every user during startup.

The pattern extends ordinary lazy components with navigation-specific concerns such as route loading states, nested
routes, persistent layouts, route prefetching, protected routes, navigation races, chunk failures, deployment
compatibility, and route-level performance measurement.

The key design principle is simple: **make navigation boundaries meaningful code-loading boundaries without allowing
code splitting to become confused with routing, authorization, data fetching, or state management.**
