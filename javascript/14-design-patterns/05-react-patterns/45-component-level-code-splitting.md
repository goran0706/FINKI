# Component-Level Code Splitting

Component-level code splitting divides browser JavaScript according to individual component or feature boundaries rather
than loading the entire component tree as part of the initial application bundle.

A component can be loaded asynchronously when the application reaches a state in which that component is required. In
React, this is commonly implemented with `lazy()` and dynamic `import()`.

Component-level code splitting is therefore a code-delivery strategy: the component's implementation becomes a
separately loadable module and is fetched only when its rendering path requires it.

## Intent

The intent of component-level code splitting is to defer JavaScript for components that are not immediately required.

```tsx
import {lazy, Suspense} from "react";

const Editor = lazy(() => import("./Editor"));
```

The `Editor` implementation is no longer an ordinary eager dependency of the module containing the parent component.

When React attempts to render:

```tsx
<Editor/>
```

the module can be loaded asynchronously.

This is useful when a component is:

* expensive to download
* expensive to parse or evaluate
* conditionally rendered
* rarely used
* hidden behind a user interaction
* dependent on a large specialized library
* unnecessary for the initial screen

## Basic Pattern

The standard React mechanism is:

```tsx
import {lazy, Suspense} from "react";

const Chart = lazy(() => import("./Chart"));

function Dashboard() {
    return (
        <Suspense fallback={<p>Loading chart...</p>}>
            <Chart/>
        </Suspense>
    );
}
```

The dynamic import:

```tsx
import("./Chart")
```

creates the asynchronous module dependency.

`lazy()` adapts that promise-based module loading mechanism to React component rendering.

`Suspense` provides the UI behavior while the component module is unavailable.

These are three separate responsibilities:

* `import()` defines asynchronous module loading
* `lazy()` defines a lazy React component
* `Suspense` defines how suspension is represented in the UI

## Dynamic Imports

Component-level splitting depends on dynamic imports.

An eager dependency looks like:

```tsx
import Chart from "./Chart";
```

A deferred dependency looks like:

```tsx
const Chart = lazy(() => import("./Chart"));
```

The bundler can use the dynamic import as a boundary when constructing the application's module graph.

The resulting physical chunk structure is bundler-dependent.

A dynamic import does not guarantee that the resulting component will exist in exactly one isolated JavaScript file.

## Component Loading Boundary

The dynamic import establishes a module-loading boundary.

```tsx
const Editor = lazy(() => import("./Editor"));
```

The component can therefore remain outside the initial JavaScript execution path until it becomes necessary.

The boundary should represent a meaningful loading decision.

Good candidates include:

* rich editors
* large charts
* maps
* complex data grids
* advanced media viewers
* rarely used dialogs
* optional administration controls
* expensive visualization components

The goal is not to make every component asynchronous.

## Conditional Components

Conditional rendering is one of the strongest use cases.

```tsx
function Settings() {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <>
            <SettingsForm/>

            {showAdvanced && (
                <AdvancedSettings/>
            )}
        </>
    );
}
```

If `AdvancedSettings` is expensive, it can be split:

```tsx
const AdvancedSettings = lazy(
    () => import("./AdvancedSettings")
);
```

The initial settings screen does not need to load the implementation of the advanced section when it is never rendered.

## Interaction-Driven Loading

A component can be loaded when a user explicitly requests functionality.

```tsx
const HelpDialog = lazy(
    () => import("./HelpDialog")
);
```

```tsx
function HelpButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)}>
                Help
            </button>

            {open && (
                <Suspense fallback={<p>Loading help...</p>}>
                    <HelpDialog/>
                </Suspense>
            )}
        </>
    );
}
```

The dialog's implementation is unnecessary until the user requests it.

This is particularly useful for large optional interfaces.

## Suspense

A lazy component suspends while its module is being loaded.

```tsx
<Suspense fallback={<ComponentSkeleton/>}>
    <Editor/>
</Suspense>
```

The Suspense boundary determines which part of the UI is replaced while the component is unavailable.

A component-level boundary can preserve surrounding UI:

```tsx
function Dashboard() {
    return (
        <>
            <DashboardHeader/>

            <Suspense fallback={<ChartSkeleton/>}>
                <Chart/>
            </Suspense>

            <DashboardFooter/>
        </>
    );
}
```

Only the chart region needs to wait.

A broader boundary could instead replace the entire dashboard subtree.

Boundary placement is therefore part of the loading design.

## Nested Suspense Boundaries

Multiple lazy components can have independent loading boundaries.

```tsx
<Suspense fallback={<ChartSkeleton/>}>
    <Chart/>
</Suspense>

<Suspense fallback={<MapSkeleton/>}>
    <Map/>
</Suspense>
```

The chart and map can resolve independently.

A nested boundary can provide a more specific fallback:

```tsx
<Suspense fallback={<DashboardSkeleton/>}>
    <Dashboard>
        <Suspense fallback={<ChartSkeleton/>}>
            <Chart/>
        </Suspense>
    </Dashboard>
</Suspense>
```

Component-level code splitting does not require a particular Suspense hierarchy. The hierarchy determines how
asynchronous readiness is presented.

## Loading UI

The fallback should reflect the component being loaded.

A generic fallback:

```tsx
<Suspense fallback={<p>Loading...</p>}>
```

may be sufficient for small components.

For substantial UI, a structural skeleton is often more appropriate:

```tsx
<Suspense fallback={<EditorSkeleton/>}>
    <Editor/>
</Suspense>
```

The fallback should not create unnecessary layout shifts.

A good fallback generally preserves:

* approximate dimensions
* surrounding structure
* meaningful loading semantics
* keyboard accessibility
* stable layout

## Component-Level Splitting Versus Route-Based Splitting

Component-level and route-based code splitting differ primarily in the boundary chosen for deferred code.

Component-level splitting:

```tsx
const Editor = lazy(() => import("./Editor"));
```

defers one component or feature.

Route-based splitting:

```tsx
const ReportsRoute = lazy(
    () => import("./routes/Reports")
);
```

defers an entire navigational destination.

A route can contain several independently lazy-loaded components.

Conversely, a route can contain no additional component-level splits if its entire implementation is already deferred.

The two strategies can be combined.

## When Component-Level Splitting Is More Appropriate

Component-level splitting is particularly useful when a large component is not tied to navigation.

Examples include:

```tsx
const ColorPicker = lazy(
    () => import("./ColorPicker")
);
```

```tsx
const RichTextEditor = lazy(
    () => import("./RichTextEditor")
);
```

```tsx
const ExportDialog = lazy(
    () => import("./ExportDialog")
);
```

These components may appear conditionally within an otherwise already-loaded route.

Splitting them at the component boundary avoids making the entire route pay their JavaScript cost.

## When Route Splitting Is More Appropriate

If an entire feature is associated with a navigational destination, route-level splitting is usually the stronger
boundary.

For example:

```tsx
const ReportsRoute = lazy(
    () => import("./routes/Reports")
);
```

This can defer the complete reports feature.

Adding independent lazy imports to every child component inside the reports route may provide little additional value if
most of those components are always rendered together.

The route boundary should generally be established before introducing finer-grained component boundaries.

## Large Optional Dependencies

Component splitting is especially valuable when the component introduces a dependency that is otherwise irrelevant.

```tsx
const PdfViewer = lazy(
    () => import("./PdfViewer")
);
```

If `PdfViewer` imports a large PDF rendering library, the dependency can remain behind the component boundary.

Users who never open the viewer do not need to download its implementation.

The same principle applies to:

* editors
* charting systems
* maps
* syntax highlighters
* spreadsheet engines
* specialized media controls
* large visualization libraries

## Shared Dependencies

A lazy component can depend on modules used elsewhere.

```tsx
const Chart = lazy(() => import("./Chart"));
```

Suppose `Chart` imports:

```tsx
import {formatNumber} from "./format";
```

and another eager component also imports `formatNumber`.

The bundler may place that shared dependency in a common chunk.

The source-level component boundary therefore does not imply complete dependency isolation.

This is expected.

The important question is whether the expensive component-specific dependencies remain deferred.

## Chunk Graph

The browser receives chunks according to the bundler's dependency graph.

A component split can produce:

* an application chunk
* a component chunk
* shared dependency chunks
* additional nested dynamic chunks

The physical result depends on:

* static imports
* dynamic imports
* shared dependencies
* bundler optimization
* tree shaking
* minification
* framework behavior

Do not design an application around an assumption that each `lazy()` call produces exactly one chunk.

## Component Preloading

A component does not necessarily need to wait until it is rendered before loading begins.

The module can be imported earlier:

```tsx
const loadEditor = () => import("./Editor");
```

A component can then use:

```tsx
const Editor = lazy(loadEditor);
```

Application code can trigger `loadEditor()` when the component becomes likely to be needed.

For example:

```tsx
function EditorButton() {
    return (
        <button
            onMouseEnter={() => {
                loadEditor();
            }}
        >
            Open editor
        </button>
    );
}
```

The navigation or interaction can then reuse the already requested module.

Preloading changes the loading strategy from strictly demand-driven loading to anticipation of likely demand.

## Preloading Versus Eager Loading

These approaches have different timing.

Eager loading:

```tsx
import Editor from "./Editor";
```

includes the dependency in the normal static module graph.

Lazy loading:

```tsx
const Editor = lazy(() => import("./Editor"));
```

defers it until required.

Preloading:

```tsx
import("./Editor");
```

can begin loading before rendering requires the component while retaining the asynchronous boundary.

Preloading is useful when there is a strong signal that the component will soon be needed.

## Preloading and Bandwidth

Preloading is still network work.

If the user never opens the editor, the prefetched code may have been unnecessary.

Therefore, preloading should be based on meaningful signals such as:

* explicit user intent
* focus
* pointer interaction
* viewport visibility
* predictable workflow progression
* application-specific usage patterns

Do not preload every lazy component indiscriminately.

## Component-Level Splitting and Effects

A lazy component's Effects do not execute until the component has actually been loaded, rendered, and committed.

This can reduce not only the component's JavaScript transfer but also the initialization of its runtime behavior.

For example, a lazily loaded editor may establish:

* event listeners
* subscriptions
* observers
* third-party library instances
* timers

only after the component is rendered.

Code splitting therefore can defer both code delivery and associated initialization work.

## Component-Level Splitting and Server State

A lazy component may perform data fetching after it loads:

```tsx
const AnalyticsPanel = lazy(
    () => import("./AnalyticsPanel")
);
```

The component might then access server state.

Code splitting does not itself provide:

* data fetching
* caching
* invalidation
* synchronization
* request deduplication

Those concerns belong to the application's data architecture.

Code and data can be loaded independently or coordinated intentionally.

## Avoiding Loading Waterfalls

A component can introduce a sequence of asynchronous operations:

```tsx
const Editor = lazy(() => import("./Editor"));
```

then, after loading:

```tsx
useEffect(() => {
    fetchEditorData();
}, []);
```

This can create:

1. component code loads
2. component renders
3. data request starts
4. data loads
5. content becomes available

If the data requirement is known before the component renders, the application may be able to initiate both operations
earlier.

The component-level code split should not automatically become a prerequisite for every other resource.

## Component-Level Splitting and Resource Loading

A lazily loaded component may also import assets or initiate resource loading.

```tsx
const Map = lazy(() => import("./Map"));
```

The map implementation might require:

* map tiles
* fonts
* images
* worker scripts
* configuration
* remote data

Code splitting controls the JavaScript module boundary.

It does not automatically optimize these other resources.

## Error Handling

A lazy component can fail to load.

```tsx
<ErrorBoundary fallback={<ComponentLoadError/>}>
    <Suspense fallback={<ComponentSkeleton/>}>
        <Editor/>
    </Suspense>
</ErrorBoundary>
```

Suspense handles the pending state.

The Error Boundary handles an error.

These states should remain distinct.

Potential failures include:

* network interruption
* unavailable asset
* stale deployment
* CDN failure
* offline state
* corrupted response

The UI should provide an appropriate recovery mechanism where practical.

## Retrying Failed Components

An application can retry a failed dynamic import when the failure is plausibly transient.

The retry strategy should be bounded.

Repeatedly retrying a permanently missing asset only increases latency and network traffic.

For deployment-related failures, a full page reload may sometimes be the appropriate recovery mechanism, depending on
the deployment architecture.

## Component Identity

Lazy loading does not replace React's identity model.

Once the component has resolved, React still determines whether its rendered component identity is preserved or replaced
according to the normal reconciliation rules.

Changing keys can remount the component:

```tsx
<Editor key={version}/>
```

even though the component implementation came from the same lazy module.

Code loading and component identity are independent concerns.

## State Preservation

Loading a component does not inherently reset its state.

Once mounted, the component behaves according to normal React state and identity rules.

However, changing the component tree or key can cause the instance to be replaced.

For example:

```tsx
{
    showEditor && (
        <Suspense fallback={<EditorSkeleton/>}>
            <Editor/>
        </Suspense>
    )
}
```

unmounts the editor when `showEditor` becomes false.

When it becomes true again, a new instance is mounted.

This is a component identity decision, not a code-splitting behavior.

## Lazy Components and Memoization

A lazy component can also be memoized:

```tsx
const Chart = lazy(() => import("./Chart"));
```

and the loaded component itself can use `memo`.

These solve different problems.

Code splitting controls when the implementation becomes available.

Memoization can avoid unnecessary rendering when the component is already loaded and its props satisfy the memoization
comparison.

Memoization does not reduce the initial transfer of the component module.

## Lazy Components and `useMemo`

`useMemo` caches a calculated value during a component's lifetime.

It does not create a code-splitting boundary.

This:

```tsx
const data = useMemo(
    () => expensiveCalculation(input),
    [input]
);
```

does not defer the JavaScript implementation of the component or calculation to a later network request.

Dynamic import is the relevant mechanism for code delivery.

## Lazy Components and `useCallback`

`useCallback` preserves a function reference when dependencies remain stable.

It does not split JavaScript.

```tsx
const handleOpen = useCallback(() => {
    setOpen(true);
}, []);
```

This has no direct relationship to whether the component implementation is loaded eagerly or lazily.

## Component-Level Splitting and Context

A lazy component can consume Context after it loads:

```tsx
const SettingsPanel = lazy(
    () => import("./SettingsPanel")
);
```

The provider can remain outside the lazy boundary:

```tsx
<SettingsProvider>
    <Suspense fallback={<PanelSkeleton/>}>
        <SettingsPanel/>
    </Suspense>
</SettingsProvider>
```

The provider is loaded eagerly while the optional consumer is deferred.

Context itself does not create a code-splitting boundary.

## Component-Level Splitting and Dependency Injection

A lazily loaded component can receive dependencies through props or Context.

```tsx
<ServicesProvider>
    <Suspense fallback={<EditorSkeleton/>}>
        <Editor/>
    </Suspense>
</ServicesProvider>
```

The dependency injection boundary and code-splitting boundary are separate.

A component can be dynamically loaded while receiving the same scoped services as eagerly loaded components.

## Component-Level Splitting and Client Components

In an architecture that distinguishes server-executed and client-executed React components, component-level code
splitting is primarily concerned with browser-side code.

A server-executed component does not need to be shipped to the browser merely because it is part of a rendered component
tree.

For Client Components, however, their browser JavaScript can participate in dynamic loading boundaries.

The two mechanisms should not be confused:

* server/client boundaries determine where component code executes
* code-splitting boundaries determine when browser JavaScript is delivered

## Component-Level Splitting and Hydration

In server-rendered applications, a component may have server-rendered output while its browser-side implementation is
loaded separately.

The application must ensure that the necessary client module becomes available when hydration requires it.

Component-level code splitting can therefore influence when a particular interactive component becomes hydrated and
operational.

This is architecture-dependent and should be coordinated with the framework's rendering and hydration model.

## Component-Level Splitting and Progressive Enhancement

A component that is optional or enhancement-oriented can often be loaded only when the enhanced interaction is
requested.

For example:

```tsx
const AdvancedEditor = lazy(
    () => import("./AdvancedEditor")
);
```

A basic form can remain available while the advanced editor is loaded.

This can complement progressive enhancement by avoiding unnecessary JavaScript for functionality that the user never
requests.

However, the application's core functionality should not become unusable merely because an optional enhancement chunk
fails.

## Component-Level Splitting and Accessibility

Loading states must remain accessible.

A component fallback should communicate meaningful progress where necessary:

```tsx
<Suspense
    fallback={
        <div aria-busy="true">
            Loading editor...
        </div>
    }
>
    <Editor/>
</Suspense>
```

Focus management also matters when the loaded component is an interactive overlay such as a dialog.

Code splitting should not cause:

* inaccessible loading states
* unexpected focus loss
* keyboard traps
* layout changes that disrupt navigation

The loading boundary is part of the user interface and should be designed accordingly.

## Component-Level Splitting and Third-Party Libraries

Large third-party dependencies are strong candidates for component-level splitting when they are used by only one
optional component.

```tsx
const MarkdownEditor = lazy(
    () => import("./MarkdownEditor")
);
```

If the editor imports a large parsing and syntax-highlighting stack, those dependencies can remain behind the dynamic
boundary.

This prevents unrelated components from paying the cost of those dependencies.

## Measuring Effectiveness

The effectiveness of a component split should be evaluated using actual performance data.

Useful measurements include:

* initial JavaScript transfer
* initial JavaScript execution
* component chunk size
* time from interaction to component readiness
* cache-hit rate
* frequency of component usage
* prefetch effectiveness
* CPU cost of initialization

A split is useful when the deferred cost is meaningful relative to the cost introduced by asynchronous loading.

## Over-Splitting

Component-level splitting becomes counterproductive when too many small components are made asynchronous.

For example:

```tsx
const Button = lazy(() => import("./Button"));
const Label = lazy(() => import("./Label"));
const Icon = lazy(() => import("./Icon"));
```

This introduces asynchronous boundaries for components that are usually tiny and immediately required.

Potential consequences include:

* more chunks
* more network coordination
* more loading states
* increased complexity
* delayed rendering
* weaker cache efficiency

Small universally used components generally should remain eagerly available.

## Under-Splitting

The opposite problem is keeping large optional components in the initial bundle.

For example:

```tsx
import RichTextEditor from "./RichTextEditor";
```

may unnecessarily load a large editor implementation for users who never open it.

A component-level boundary can isolate the optional functionality:

```tsx
const RichTextEditor = lazy(
    () => import("./RichTextEditor")
);
```

The correct boundary depends on whether the component is genuinely optional and whether its implementation is
sufficiently expensive to justify deferred loading.

## Shared Component Libraries

Reusable component libraries need to be careful about their loading contracts.

A library component that is used throughout an application should generally not be lazily loaded solely because it is
technically possible.

A component used on nearly every screen provides little benefit from being deferred.

Optional library components with substantial dependencies are stronger candidates.

Libraries should also avoid unexpectedly pulling large dependencies into common entry points.

## Deployment and Asset Versioning

Component chunks are deployed assets.

A new deployment can change the generated filename:

```text
Editor-a13f2c.js
```

to:

```text
Editor-b81d4e.js
```

Existing clients can therefore encounter situations where the application runtime expects an asset that is no longer
available.

Production deployments should maintain appropriate asset availability and version consistency.

The exact solution depends on the deployment architecture.

## Browser Caching

Once a component chunk has been downloaded, later renders can often reuse the cached module.

This means a component may incur a network cost on first use but little or no network cost on subsequent use.

Performance evaluation should therefore consider both:

* first-use latency
* repeat-use behavior

A frequently used component may benefit less from aggressive splitting than a component that is rarely visited.

## Common Misuse

### Lazy-Loading Every Component

Making every component asynchronous creates unnecessary loading boundaries.

Use component-level splitting for meaningful optional or expensive code.

### Splitting Tiny Components

Small buttons, labels, icons, and layout primitives usually do not justify independent loading boundaries.

### Using Code Splitting as Security

A component that is not initially downloaded is not secret.

Any browser-accessible chunk should be considered accessible to the client.

### Confusing Lazy Loading with Memoization

Lazy loading defers module delivery.

Memoization optimizes rendering or calculated values.

They address different costs.

### Ignoring the Fallback

A lazy component can suspend.

The surrounding UI needs an appropriate Suspense boundary and loading state.

### Ignoring Load Errors

Dynamic imports can fail.

A production application should have an error-handling strategy for important lazy components.

### Creating Waterfalls

Do not unnecessarily make data, code, and other resources load strictly one after another when they can be initiated
independently.

### Preloading Everything

Preloading every lazy component defeats the purpose of deferral and consumes bandwidth.

### Using Dynamic Imports Without a Meaningful Boundary

A dynamic import should correspond to a real loading decision.

If the component is always rendered immediately, splitting it may only add latency without providing a meaningful
benefit.

### Treating Chunk Count as a Performance Metric

More chunks do not automatically mean better performance.

Evaluate actual transfer, execution, loading latency, and user behavior.

## Advantages

Component-level code splitting reduces the initial JavaScript required for optional or expensive functionality.

It can defer large third-party dependencies until they are actually needed.

It can reduce initial parsing, compilation, evaluation, and initialization work.

It provides a natural loading boundary around optional interface functionality.

It can be combined with preloading to hide latency when future use is predictable.

It allows large features embedded within a route to be deferred independently from the route itself.

## Disadvantages

The first use of a lazy component can incur additional loading latency.

Every asynchronous boundary introduces loading and error-handling complexity.

Over-splitting can produce too many chunks and unnecessary network coordination.

Poorly designed boundaries can create loading waterfalls.

Prefetching can reduce latency while consuming bandwidth that may ultimately be wasted.

Dynamic imports add deployment and asset-versioning considerations.

The physical chunk structure remains dependent on the bundler and can be more complicated than the component structure
suggests.

## When to Use

Use component-level code splitting when:

* a component is large
* a component has expensive dependencies
* the component is rarely used
* the component is conditionally rendered
* the component is opened after explicit user interaction
* the component is an optional enhancement
* a route contains a particularly expensive feature that should load independently
* deferring its JavaScript materially reduces initial application cost

Good candidates often include editors, charts, maps, complex dialogs, specialized viewers, and administrative widgets.

## When Not to Use

Do not split components that are:

* tiny
* universally used
* immediately rendered
* required for the initial application shell
* unlikely to produce meaningful initial-load savings

Do not use component-level splitting simply to increase the number of generated chunks.

Do not use it as a substitute for dependency reduction, tree shaking, server-side execution, or route-based splitting
when those mechanisms address the actual problem more directly.

## Relationships to Other Patterns

### Lazy Components

`lazy()` is the React mechanism commonly used to represent a dynamically imported component.

Component-level code splitting is the broader code-delivery strategy that uses this mechanism.

### Route-Based Code Splitting

Route-based splitting chooses navigation boundaries for deferred code.

Component-level splitting chooses individual component or feature boundaries.

Route splitting is generally the stronger coarse-grained boundary; component splitting provides finer-grained deferral
inside a route.

### Suspense Boundary

Suspense controls how an asynchronous component's pending state is represented.

The dynamic import creates the loading requirement; Suspense determines the UI behavior while that requirement is
unresolved.

### Nested Suspense Boundaries

Nested Suspense boundaries allow independently lazy-loaded components to reveal at different times.

They control presentation of multiple asynchronous boundaries rather than defining the JavaScript chunk graph
themselves.

### Error Boundary

An Error Boundary handles component-loading failures.

Suspense represents waiting; Error Boundaries represent failure.

### Memoized Components

Memoization can reduce unnecessary rendering after a lazy component has loaded.

It does not defer the component's JavaScript.

### Memoized Values

`useMemo` caches calculated values.

It does not create asynchronous module boundaries.

### Memoized Callbacks

`useCallback` stabilizes function references.

It does not split or defer JavaScript.

### Resource Cache

Resource caches can preload or reuse asynchronous data and other resources.

They do not replace module code splitting.

### Data Fetching

Data fetching retrieves remote resources.

Component-level splitting retrieves component implementation code.

The two operations can be coordinated but are distinct.

### Server Components

Server Components can prevent component implementation from being shipped to the browser at all.

Component-level code splitting defers browser-side code that still needs to execute on the client.

### Client Component Boundary

The Client Component boundary determines which component code needs browser execution.

Component-level splitting determines when that browser code is delivered.

### Hydration Boundary

Hydration determines when server-rendered output becomes client-owned.

Component-level splitting can affect when the JavaScript necessary for a client component becomes available for
hydration.

### Progressive Enhancement

Progressive enhancement can use deferred components to add optional client-side functionality without making the core
experience depend on the optional code.

### Component Identity

Code loading does not determine whether a component instance is preserved.

Identity, keys, and tree structure determine whether state and refs survive.

## Design Rules

1. Split at meaningful component or feature boundaries.

2. Use dynamic imports for components whose JavaScript should be deferred.

3. Use `lazy()` when the deferred module represents a React component.

4. Provide an intentional Suspense fallback.

5. Provide Error Boundary recovery for important dynamically loaded components.

6. Prefer route-level splitting as the coarse-grained default for route-specific code.

7. Use component-level splitting when a substantial feature remains optional within an already-loaded route.

8. Keep small universally used components eagerly available.

9. Keep expensive optional dependencies behind the relevant component boundary.

10. Do not assume one dynamic import produces exactly one physical chunk.

11. Evaluate the resulting dependency graph rather than only the source-level import structure.

12. Preload when there is meaningful evidence that a component will soon be needed.

13. Do not preload every lazy component.

14. Avoid unnecessary waterfalls between component code, data, and other resources.

15. Keep code-splitting concerns separate from data fetching and caching.

16. Do not treat deferred code as a security boundary.

17. Ensure deployment infrastructure can serve the required generated chunks consistently.

18. Measure first-use latency as well as initial-load savings.

19. Do not create asynchronous boundaries solely to maximize chunk count.

20. Combine component-level splitting with Server Components and route-level splitting when those boundaries solve
    different delivery problems.

## Core Principle

Component-level code splitting makes an individual component or feature a browser JavaScript delivery boundary.

```tsx
const Editor = lazy(
    () => import("./Editor")
);
```

The component implementation and its route-independent dependencies can remain outside the initial loading path until
the application actually requires the component.

The objective is not to make components lazy by default. It is to defer meaningful amounts of browser work when the user
does not immediately need that functionality.

Route-based splitting provides the larger navigational boundary. Component-level splitting provides a finer-grained
boundary inside that navigation structure. Used together, they allow JavaScript delivery to follow the actual structure
of application usage rather than forcing every user to load and initialize every feature at startup.
