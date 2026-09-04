# Lazy Components

Lazy Components defer loading a component's module until the component is needed. In React, this is primarily
implemented with `lazy()` together with dynamic `import()`, allowing the component's JavaScript module to become a
separate asynchronously loaded chunk instead of being included in the initial JavaScript payload.

The pattern separates component availability from component rendering. The component can be referenced in the
application normally, while its implementation is loaded only when React attempts to render it.

## Intent

Use lazy loading to reduce the initial JavaScript required by an application by moving infrequently needed component
implementations into asynchronously loaded modules.

The core idea is:

```tsx
import {lazy} from "react";

const SettingsPanel = lazy(() => import("./SettingsPanel"));
```

The module containing `SettingsPanel` is not loaded as part of the initial module evaluation merely because the lazy
component is declared. React obtains the module when the lazy component needs to resolve.

Lazy loading is therefore primarily a **code-loading strategy**, not a rendering optimization. It does not make the
component itself faster to render. It changes when the component's implementation becomes available.

## Basic Pattern

A lazy component is declared from a function that returns a dynamic import:

```tsx
import {lazy, Suspense} from "react";

const SettingsPanel = lazy(() => import("./SettingsPanel"));

export function SettingsPage() {
    return (
        <Suspense fallback={<div>Loading settings...</div>}>
            <SettingsPanel/>
        </Suspense>
    );
}
```

`import()` returns a promise for the module. `lazy()` converts that asynchronous module resolution into a React
component that can suspend while the module is being loaded.

The component therefore has three relevant phases: the lazy component has been declared, its module is being resolved,
and the resolved component can render.

## Dynamic Import

The JavaScript mechanism underneath lazy components is dynamic `import()`:

```js
const module = await import("./SettingsPanel");
```

The returned promise resolves to the imported module namespace:

```js
const module = await import("./SettingsPanel");

const SettingsPanel = module.default;
```

`lazy()` expects the dynamically imported module to resolve to an object whose `default` export is the component:

```tsx
const SettingsPanel = lazy(() => import("./SettingsPanel"));
```

The imported module therefore normally contains:

```tsx
export default function SettingsPanel() {
    return <section>Settings</section>;
}
```

## Named Exports

`lazy()` expects a default export, but a named export can be adapted:

```tsx
const SettingsPanel = lazy(() =>
    import("./SettingsPanel").then((module) => ({
        default: module.SettingsPanel,
    })),
);
```

The adapter converts the named export into the module shape expected by `lazy()`.

If a component is naturally the primary export of its module, a default export generally keeps the lazy declaration
simpler.

## Suspense Boundary

A lazy component may suspend while its module is loading. A `Suspense` boundary determines what React renders during
that period:

```tsx
<Suspense fallback={<Spinner/>}>
    <SettingsPanel/>
</Suspense>
```

The boundary is responsible for the rendering fallback. The lazy component is responsible for representing the
asynchronously available component.

These are separate concerns.

`lazy()` does not itself define the loading UI.

```tsx
const SettingsPanel = lazy(() => import("./SettingsPanel"));
```

and:

```tsx
<Suspense fallback={<Spinner/>}>
    <SettingsPanel/>
</Suspense>
```

form two parts of the same loading mechanism.

## Boundary Placement

The location of the `Suspense` boundary determines the amount of UI that can be replaced by the fallback while the lazy
component is unavailable.

A narrow boundary can preserve surrounding UI:

```tsx
<Header/>

<Suspense fallback={<PanelSkeleton/>}>
    <SettingsPanel/>
</Suspense>

<Footer/>
```

A broader boundary can coordinate loading of an entire section:

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <SettingsPage/>
</Suspense>
```

Boundary placement is therefore a UI composition decision rather than merely a technical requirement.

The appropriate boundary usually corresponds to a meaningful region of the interface that can tolerate being temporarily
unavailable.

## Nested Boundaries

Different independently loadable regions can use different boundaries:

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <Dashboard>
        <Suspense fallback={<ChartSkeleton/>}>
            <AnalyticsChart/>
        </Suspense>

        <Suspense fallback={<ActivitySkeleton/>}>
            <ActivityPanel/>
        </Suspense>
    </Dashboard>
</Suspense>
```

Nested boundaries allow independently loading regions to reveal themselves independently.

This is particularly useful when a page contains components with substantially different loading characteristics.

## Loading UI

A Suspense fallback should represent the UI state that is appropriate while the lazy component is unavailable.

A generic spinner is not always the best fallback:

```tsx
<Suspense fallback={<Spinner/>}>
    <UserProfile/>
</Suspense>
```

A structural placeholder can better preserve layout:

```tsx
<Suspense fallback={<UserProfileSkeleton/>}>
    <UserProfile/>
</Suspense>
```

The fallback should generally avoid unnecessary layout shifts and should communicate that the specific region is
temporarily unavailable.

## Lazy Loading Is Not Data Fetching

Lazy component loading and data fetching solve different problems.

Lazy loading obtains JavaScript required to execute a component:

```tsx
const ReportsPanel = lazy(() => import("./ReportsPanel"));
```

Data fetching obtains runtime data:

```tsx
const reports = await fetchReports();
```

A component can be lazy without fetching data, and a non-lazy component can perform data fetching.

```tsx
const ReportsPanel = lazy(() => import("./ReportsPanel"));

function ReportsPage() {
    return (
        <Suspense fallback={<ReportsSkeleton/>}>
            <ReportsPanel/>
        </Suspense>
    );
}
```

The module loading and the application's data-loading lifecycle should not be treated as the same state.

## Lazy Loading Is Not Resource Caching

A resource cache manages reusable asynchronous resources such as remote data.

Lazy component loading concerns JavaScript module availability:

```tsx
const Editor = lazy(() => import("./Editor"));
```

A resource cache might instead manage:

```text
document:123
```

These mechanisms can coexist, but their identities, lifetimes, invalidation rules, and ownership are different.

## Lazy Loading Is Not Server State

Server state represents authoritative remote data and its client-side synchronization.

Lazy components concern the availability of executable application code.

For example:

```tsx
const BillingPanel = lazy(() => import("./BillingPanel"));
```

does not mean that billing data has been loaded.

The panel may subsequently consume server state:

```tsx
function BillingPanel() {
    const billing = useBilling();

    return <BillingView billing={billing}/>;
}
```

The component module and the server data remain separate resources.

## Lazy Loading and Component State

Lazy loading does not change the semantics of the component's local state.

Once the component has been resolved and mounted:

```tsx
const Editor = lazy(() => import("./Editor"));
```

the component behaves like an ordinary React component.

Its state is still associated with its React identity:

```tsx
function Editor() {
    const [value, setValue] = useState("");

    return (
        <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
        />
    );
}
```

Lazy loading should therefore not be used as an alternative state-management mechanism.

## Lazy Loading and Component Identity

The lazy component should normally be declared at module scope:

```tsx
const SettingsPanel = lazy(() => import("./SettingsPanel"));

function App() {
    return <SettingsPanel/>;
}
```

Do not create a new lazy component definition during rendering:

```tsx
function App() {
    const SettingsPanel = lazy(() => import("./SettingsPanel"));

    return <SettingsPanel/>;
}
```

The latter creates a new component type whenever `App` renders. This can interfere with component identity and cause the
subtree to be remounted.

The lazy component definition should be stable.

## Conditional Lazy Rendering

Lazy components are particularly useful when a component is only rendered under a condition:

```tsx
const DebugPanel = lazy(() => import("./DebugPanel"));

function Application({debug}: { debug: boolean }) {
    return (
        <>
            <MainApplication/>

            {debug && (
                <Suspense fallback={<DebugPanelSkeleton/>}>
                    <DebugPanel/>
                </Suspense>
            )}
        </>
    );
}
```

The debug implementation does not need to be part of the initial application path when it is never rendered for normal
users.

## User-Initiated Features

Lazy loading is especially useful for features activated by explicit user interaction:

```tsx
const AdvancedEditor = lazy(() => import("./AdvancedEditor"));

function EditorPage() {
    const [advanced, setAdvanced] = useState(false);

    return (
        <>
            <button onClick={() => setAdvanced(true)}>
                Advanced mode
            </button>

            {advanced && (
                <Suspense fallback={<EditorSkeleton/>}>
                    <AdvancedEditor/>
                </Suspense>
            )}
        </>
    );
}
```

The application avoids loading the advanced editor until that capability is actually needed.

## Infrequently Used Components

Good candidates often include components that are:

* rarely visited;
* large enough to produce meaningful bundle savings;
* dependent on large third-party libraries;
* used only by a subset of users;
* associated with optional functionality;
* expensive enough to justify an additional network request.

Examples include:

```tsx
const MarkdownEditor = lazy(() => import("./MarkdownEditor"));
const DiagramEditor = lazy(() => import("./DiagramEditor"));
const AdminTools = lazy(() => import("./AdminTools"));
const ExportDialog = lazy(() => import("./ExportDialog"));
```

The goal is not to maximize the number of chunks. The goal is to improve the application's loading characteristics.

## Bundle Splitting

Build tooling generally turns dynamic imports into separately loadable chunks.

For example:

```tsx
const Editor = lazy(() => import("./Editor"));
```

creates an asynchronous dependency boundary from the application's perspective.

The exact chunk structure is controlled by the build system and bundler. Developers should reason about the logical
loading boundary rather than assuming that every dynamic import necessarily corresponds to exactly one physical network
request.

Bundling, compression, HTTP caching, preloading, and chunk optimization can all influence the final network behavior.

## Chunk Granularity

Making every component lazy is usually counterproductive.

This:

```tsx
const Button = lazy(() => import("./Button"));
const Card = lazy(() => import("./Card"));
const Icon = lazy(() => import("./Icon"));
const Label = lazy(() => import("./Label"));
```

can create excessive loading boundaries for components that are small, common, or immediately required.

The additional asynchronous loading overhead may outweigh the benefit of removing those components from the initial
bundle.

Lazy loading should generally correspond to meaningful feature or capability boundaries rather than arbitrary component
boundaries.

## Large Dependency Boundaries

A component can be a particularly good lazy-loading candidate when it introduces a substantial dependency:

```tsx
const DiagramEditor = lazy(() => import("./DiagramEditor"));
```

If `DiagramEditor` depends on a large diagramming library, lazy loading can prevent that dependency from contributing to
the initial application payload for users who never use the editor.

This makes the dependency boundary more important than the component's source-code size alone.

## Preloading

Some applications can determine that a lazy component is likely to be needed before it is actually rendered.

For example, an application may initiate module loading when a user expresses intent to open a feature.

The exact preloading mechanism depends on the module-loading and build environment. Conceptually, the distinction is:

```text
lazy loading: load when rendering requires the module
preloading: begin loading before rendering requires the module
```

Preloading can reduce the visible delay without forcing the module into the initial bundle.

The trade-off is that speculative loading consumes bandwidth and potentially competes with more important resources.

## Hover and Intent-Based Preloading

A feature can sometimes be preloaded when user intent becomes sufficiently likely:

```tsx
function EditorButton() {
    return (
        <button
            onMouseEnter={() => {
                void import("./Editor");
            }}
            onFocus={() => {
                void import("./Editor");
            }}
        >
            Open editor
        </button>
    );
}
```

The later render can use the same module:

```tsx
const Editor = lazy(() => import("./Editor"));
```

The preload is speculative; the lazy component remains the rendering boundary.

Intent-based preloading should be applied selectively. Triggering downloads for every hover can waste bandwidth,
especially on constrained connections.

## Route-Based Lazy Loading

Route-level code splitting is a specialized application of lazy loading.

For example:

```tsx
const SettingsPage = lazy(() => import("./SettingsPage"));
```

can be used when a route is entered.

However, route-specific organization, route matching, navigation transitions, and route-level loading boundaries belong
to the route-based lazy-loading pattern.

This file owns the general mechanism for lazy component implementations.

## Error Handling

A lazy module can fail to load.

Possible causes include:

* network failures;
* unavailable chunks;
* deployment/version mismatches;
* CDN failures;
* module evaluation failures;
* browser loading failures.

`Suspense` handles the pending state. It does not provide error recovery for rejected lazy module loading.

An Error Boundary can provide failure containment:

```tsx
<ErrorBoundary fallback={<LoadError/>}>
    <Suspense fallback={<Loading/>}>
        <SettingsPanel/>
    </Suspense>
</ErrorBoundary>
```

The two boundaries therefore have different responsibilities:

* `Suspense` handles temporary suspension;
* an Error Boundary handles rendering errors and rejected loading failures that propagate as errors.

## Retry and Recovery

A failed lazy import may require recovery appropriate to the failure.

A common production concern is a deployment mismatch where an already-open application attempts to load a chunk that no
longer exists after a deployment.

Recovery may involve:

* retrying the module request;
* refreshing the application;
* displaying a recoverable error;
* invalidating stale assets;
* coordinating deployment and asset-cache strategy.

Retry policy should not blindly retry indefinitely. Persistent failures should eventually become an explicit error
state.

## Lazy Module Evaluation

Loading a module and evaluating a module are related but distinct operations.

Dynamic import requires the runtime to obtain the module and then evaluate it according to JavaScript module semantics.

Module-level side effects therefore matter:

```tsx
// Editor.tsx
initializeEditorEnvironment();

export default function Editor() {
    return <div/>;
}
```

Loading the lazy module can trigger `initializeEditorEnvironment()` even before the component's first successful render.

Lazy loading should not be used to hide poorly controlled module-level side effects.

## Module-Level Dependencies

A lazy component may pull an entire dependency subtree into its asynchronous chunk:

```tsx
const PdfViewer = lazy(() => import("./PdfViewer"));
```

If `PdfViewer` imports a large PDF library, that library can move behind the same loading boundary.

This is one of the strongest reasons to use lazy loading: the boundary can correspond to an entire optional dependency
graph rather than merely one component file.

## Shared Dependencies

A dependency imported by both eager and lazy parts of an application may still appear in the initial bundle.

For example:

```tsx
import {formatDate} from "./date-utils";
```

and:

```tsx
const Reports = lazy(() => import("./Reports"));
```

If both the eager application and `Reports` depend on the same module, the bundler may place shared code into a common
chunk.

Therefore, lazy loading does not guarantee that every dependency below the lazy component disappears from the initial
payload.

The final bundle should be inspected rather than inferred from source structure alone.

## Lazy Components and Suspense Transitions

Replacing visible UI with a fallback during a user interaction can produce undesirable visual changes.

React transitions can be used where appropriate to distinguish urgent updates from non-urgent rendering work:

```tsx
startTransition(() => {
    setShowReports(true);
});
```

This concerns how the UI transition is presented while the lazy component becomes available. The lazy component itself
remains responsible for the asynchronous code boundary.

## State Preservation Across Loading

A lazy component that has not yet resolved has no mounted component instance.

Once it mounts, its state follows ordinary React state semantics.

If the lazy component is later removed and remounted, its state is not preserved merely because the same lazy
declaration exists.

```tsx
{
    showEditor && (
        <Suspense fallback={<EditorSkeleton/>}>
            <Editor/>
        </Suspense>
    )
}
```

Toggling `showEditor` can unmount and later remount `Editor`.

Lazy loading should therefore not be confused with component persistence or state retention.

## Lazy Components and Memoization

Lazy loading and memoization optimize different dimensions.

Lazy loading controls when implementation code becomes available:

```tsx
const Chart = lazy(() => import("./Chart"));
```

Memoization can reduce repeated calculations or preserve references:

```tsx
const Chart = memo(ChartComponent);
```

A component can use both techniques where justified, but one does not replace the other.

## Lazy Components and Memoized Components

A lazy component can resolve to a memoized component:

```tsx
const Chart = lazy(() => import("./Chart"));
```

with:

```tsx
export default memo(function Chart() {
    return <canvas/>;
});
```

The two mechanisms operate at different stages.

Lazy loading controls module availability. `memo` controls whether an already available component may skip rendering
when its props are considered unchanged.

## Lazy Components and Effects

A lazy component's Effects do not run merely because its module has been downloaded.

They run according to the component's normal lifecycle after the component is mounted:

```tsx
function Editor() {
    useEffect(() => {
        connectEditor();

        return () => disconnectEditor();
    }, []);

    return <EditorView/>;
}
```

Preloading or downloading a module therefore does not imply that its component Effects have executed.

## Lazy Components and Server Rendering

Lazy components can participate in server rendering and streaming architectures, but the exact behavior depends on the
React rendering environment and framework.

The important architectural distinction is that code availability is now part of the rendering dependency graph.

A server-rendered application may resolve lazy component boundaries as part of producing the response, while a
client-rendered application may download the corresponding module in the browser.

Framework-level server rendering, streaming, and hydration behavior should therefore be treated separately from the
basic lazy-component pattern.

## Hydration

A lazy component may also participate in hydration boundaries.

The application must ensure that the server and client can resolve compatible component implementations and that the
resulting rendered structure remains consistent.

Lazy loading does not remove the requirements imposed by server/client rendering agreement.

## Accessibility

A loading fallback should preserve appropriate semantics for the affected UI.

For example:

```tsx
<Suspense fallback={<div role="status">Loading editor...</div>}>
    <Editor/>
</Suspense>
```

The exact accessibility behavior depends on whether the loading state replaces an interactive region, overlays existing
content, or represents an entire page transition.

Loading UI should not unnecessarily remove useful accessible context from the user.

## Performance Trade-Off

Lazy loading trades initial payload size against later loading latency.

Without lazy loading:

```text
larger initial payload
less code-loading work later
```

With lazy loading:

```text
smaller initial payload
additional asynchronous loading when the feature is needed
```

The optimal choice depends on feature frequency, module size, network conditions, caching, application architecture, and
user navigation patterns.

A smaller initial bundle is not automatically a faster application if users immediately need the lazy-loaded component.

## Cache Behavior

Dynamically loaded JavaScript is generally subject to normal browser and deployment caching rules.

A successfully loaded lazy module can often be reused by subsequent renders without another application-level import
decision resulting in repeated component initialization.

Deployment systems must nevertheless account for chunk naming, cache invalidation, immutable assets, and old application
versions attempting to access newer or removed chunks.

Lazy loading therefore has an operational dimension beyond React component code.

## Testing

Tests should distinguish component behavior from loading behavior.

A component test can render the resolved component directly:

```tsx
render(<SettingsPanel/>);
```

An integration test can exercise the lazy boundary:

```tsx
render(
    <Suspense fallback={<div>Loading...</div>}>
        <SettingsPanel/>
    </Suspense>,
);
```

Loading behavior should verify:

* the fallback appears while the module is pending;
* the component appears after resolution;
* loading failures are contained appropriately;
* recovery behavior works when supported;
* the surrounding UI behaves correctly during suspension.

Tests should not depend unnecessarily on implementation-specific chunk names.

## Common Misuse

### Making Everything Lazy

Lazy-loading every component creates unnecessary asynchronous boundaries and can increase request and coordination
overhead.

Common UI primitives and components required immediately by most users are usually poor candidates.

### Declaring Lazy Components During Render

Avoid:

```tsx
function App() {
    const Panel = lazy(() => import("./Panel"));

    return <Panel/>;
}
```

Define the lazy component at module scope instead:

```tsx
const Panel = lazy(() => import("./Panel"));

function App() {
    return <Panel/>;
}
```

### Treating Suspense as Error Handling

`Suspense` represents a pending state. It is not a general error boundary.

Use an Error Boundary when loading failures need explicit containment or recovery.

### Using Lazy Loading as a State Strategy

Lazy loading does not determine where state belongs.

State ownership remains governed by the component architecture independently of whether the component is eagerly or
lazily loaded.

### Excessive Chunk Fragmentation

Creating many tiny lazy chunks can make the application harder to load rather than easier.

The loading boundary should correspond to a meaningful feature or dependency boundary.

### Speculative Loading Without Evidence

Preloading every possible feature wastes bandwidth.

Preloading is most useful when there is a strong signal that the feature is likely to be needed.

### Confusing Module Loading With Data Loading

A component being available does not mean its data is available.

Conversely, data may already be cached while the component implementation still needs to be downloaded.

These should remain independent concerns.

### Assuming One Import Equals One Network Request

The bundler may produce shared chunks, merge dependencies, preload assets, or otherwise optimize the generated module
graph.

Source-level dynamic imports do not directly specify the final network request topology.

## Advantages

Lazy components can reduce the initial JavaScript payload, defer rarely used dependencies, create meaningful feature
boundaries, and improve startup characteristics for applications with substantial optional functionality.

They can also isolate large third-party dependencies behind the features that actually require them.

## Disadvantages

Lazy loading introduces asynchronous availability, additional loading states, more complicated failure handling, and
potentially additional network latency when a deferred feature is first used.

Poorly chosen boundaries can create excessive chunks or delay components that users need immediately.

The pattern also introduces deployment and caching concerns because the application becomes dependent on asynchronously
available JavaScript assets.

## When to Use

Lazy components are appropriate when:

* a component is not needed during initial rendering;
* a feature is used by only a subset of users;
* the component introduces a large dependency;
* the component represents an optional capability;
* the component is expensive enough to justify a separate loading boundary;
* the application benefits from progressive feature availability.

## When Not to Use

Avoid lazy loading when:

* the component is required immediately by nearly every user;
* the module is extremely small;
* the component sits on the critical rendering path;
* the added asynchronous boundary provides negligible bundle savings;
* the feature is always rendered immediately after application startup;
* the resulting loading behavior would be worse than the initial payload cost.

## Relationship to Route-Based Lazy Loading

`Lazy Components` owns component-level asynchronous module loading.

`Route-Based Lazy Loading` specializes the same mechanism around navigation boundaries.

A route can therefore contain lazy components, but route-level loading introduces additional concerns such as navigation
state, route matching, route transitions, and route-specific boundaries.

Those concerns belong in the route-specific pattern rather than being duplicated here.

## Relationship to Suspense Boundaries

Suspense defines how React handles suspended rendering and what fallback is displayed.

Lazy components are one source of suspension caused by asynchronously resolving component modules.

The distinction is therefore:

```tsx
const Editor = lazy(() => import("./Editor"));
```

defines the asynchronous component dependency, while:

```tsx
<Suspense fallback={<EditorSkeleton/>}>
    <Editor/>
</Suspense>
```

defines the rendering boundary that handles its suspension.

## Relationship to Data Fetching

Data fetching obtains application data.

Lazy loading obtains component code.

A lazy component may perform data fetching after it becomes available, but neither mechanism should be used as a
substitute for the other.

## Relationship to Resource Cache

A resource cache owns reusable asynchronous resource state.

A lazy component represents asynchronously available JavaScript code.

The two can interact, but they have different resource identities and lifecycle semantics.

## Relationship to Server State

Server state is authoritative remote state synchronized into the client.

Lazy component loading concerns executable code.

A lazily loaded component can consume server state, but lazy loading does not cache, synchronize, invalidate, or mutate
server data.

## Relationship to Memoized Components

`memo` can prevent unnecessary component rendering.

Lazy loading can prevent unnecessary initial code loading.

They address different performance dimensions and can be used together.

## Relationship to Memoization Hooks

`useMemo` and `useCallback` control value and function identity within an already executing component tree.

Lazy loading controls when a component's module becomes available.

Memoization does not replace code splitting.

## Relationship to Referential Stability

The lazy component definition itself should remain stable. Defining it at module scope prevents a new component type
from being created during each parent render.

This is one place where referential stability and component identity directly affect correct lazy-component usage.

## Relationship to Component Identity

A lazy component is a React component type. Creating new lazy component types during rendering can therefore change
component identity and cause remounting.

Stable declaration is part of the pattern's correct usage.

## Design Rules

1. Use `lazy()` for meaningful asynchronous component boundaries.
2. Keep lazy component declarations at module scope.
3. Pair lazy components with an appropriate `Suspense` boundary.
4. Treat loading and error states as separate concerns.
5. Use Error Boundaries when lazy-module failures require containment.
6. Prefer feature and dependency boundaries over arbitrary component boundaries.
7. Avoid making small, universally required components lazy.
8. Preload only when there is a meaningful signal that a component will soon be needed.
9. Inspect generated bundles instead of assuming how dynamic imports become network resources.
10. Keep component code loading separate from data fetching and server-state management.
11. Account for deployment, caching, and chunk availability in production.
12. Preserve appropriate accessibility semantics in loading fallbacks.
13. Do not use lazy loading as a state-management mechanism.
14. Do not assume that downloading a module means that the component has mounted.
15. Measure whether the loading boundary actually improves the application's performance characteristics.

## Summary

The Lazy Components pattern defers a component's JavaScript module until that component is needed. React's `lazy()`
works with dynamic `import()` to represent the asynchronously available component, while `Suspense` provides the
rendering boundary for the pending state.

The primary architectural decision is where to place the asynchronous code boundary. Good boundaries usually correspond
to optional features, infrequently used capabilities, large dependencies, or meaningful UI regions. Poor boundaries
unnecessarily fragment the application or delay code that users need immediately.

Lazy loading should remain conceptually separate from data fetching, resource caching, server-state synchronization,
memoization, state ownership, and route management. Its responsibility is narrower: **control when component
implementation code becomes available to the application.**
