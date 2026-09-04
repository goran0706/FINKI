# Suspense Boundary

A Suspense Boundary is a React rendering boundary that displays fallback UI while a descendant subtree is not yet ready
to render because it has suspended.

Suspense separates the state of "not ready yet" from ordinary rendering. Instead of requiring every component involved
in asynchronous work to manually coordinate loading state, a component can suspend rendering and allow an ancestor
boundary to determine what should be displayed while the work completes.

Suspense is therefore primarily a rendering coordination mechanism. It does not itself define how data is fetched, how
resources are cached, or how server state is synchronized.

## Intent

Provide a declarative boundary for temporarily unavailable rendering content.

A Suspense Boundary defines:

* which subtree may suspend;
* what fallback should be displayed while it is suspended;
* which parts of the surrounding UI remain visible;
* how nested suspended content is revealed;
* how loading transitions are coordinated with rendering.

The central rule is:

> Suspense controls what React renders while descendant content is not ready; it does not own the asynchronous resource
> itself.

## Suspension

A descendant can suspend when the rendering process encounters work that is not yet ready.

Conceptually:

```tsx
<Suspense fallback={<Loading/>}>
    <Profile/>
</Suspense>
```

If `Profile` suspends, React can render:

```tsx
<Loading/>
```

instead of the suspended subtree until the required work becomes available.

Suspension is therefore different from rendering an ordinary loading state:

```tsx
if (isLoading) {
    return <Loading/>;
}
```

With ordinary state-based loading, the component explicitly owns and renders the loading state.

With Suspense, the readiness of descendant content is communicated through React's rendering mechanism and the nearest
applicable boundary decides what to display.

## Fallback

The `fallback` prop defines what the boundary renders while its descendant subtree is suspended.

```tsx
<Suspense fallback={<Spinner/>}>
    <Profile/>
</Suspense>
```

The fallback should represent the UI state of waiting for that particular rendering region.

A boundary around a whole page might use:

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <ProductPage/>
</Suspense>
```

while a smaller boundary might use:

```tsx
<Suspense fallback={<AvatarSkeleton/>}>
    <Avatar/>
</Suspense>
```

The appropriate fallback depends on the failure or waiting domain represented by the boundary.

## Boundary Ownership

The Suspense Boundary owns the presentation of waiting for its descendant subtree.

For example:

```tsx
<Suspense fallback={<CommentsSkeleton/>}>
    <Comments/>
</Suspense>
```

means that the boundary decides what appears when `Comments` cannot currently complete rendering.

It does not mean that the boundary owns:

* the request;
* the resource;
* the cache;
* the server state;
* the mutation;
* the asynchronous operation itself.

Those responsibilities remain with the abstraction that owns the corresponding resource.

## Nearest Boundary

When a descendant suspends, React uses the applicable Suspense boundary surrounding that subtree.

For example:

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <Page>
        <Suspense fallback={<CommentsSkeleton/>}>
            <Comments/>
        </Suspense>
    </Page>
</Suspense>
```

If `Comments` suspends, the inner boundary can display `CommentsSkeleton` without replacing the entire page.

If content outside the inner boundary suspends, the outer boundary can handle it.

Boundary placement therefore determines the granularity of the loading experience.

## Boundary Granularity

A boundary that surrounds too much content can produce an unnecessarily large fallback:

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <Header/>
    <MainContent/>
    <Sidebar/>
    <Footer/>
</Suspense>
```

If only `Sidebar` is waiting, the entire page may be replaced by the fallback depending on which descendant suspends and
the rendering state.

More localized boundaries can preserve already useful content:

```tsx
<Header/>

<Suspense fallback={<MainSkeleton/>}>
    <MainContent/>
</Suspense>

<Suspense fallback={<SidebarSkeleton/>}>
    <Sidebar/>
</Suspense>

<Footer/>
```

The goal is not to create as many boundaries as possible.

The goal is to create boundaries corresponding to meaningful loading and reveal units.

## Loading Units

A Suspense Boundary defines a useful loading unit.

For example, a product page might conceptually divide into:

* product summary;
* product images;
* recommendations;
* reviews.

These regions may have different readiness characteristics.

```tsx
<ProductSummary/>

<Suspense fallback={<ImageSkeleton/>}>
    <ProductImages/>
</Suspense>

<Suspense fallback={<RecommendationsSkeleton/>}>
    <Recommendations/>
</Suspense>

<Suspense fallback={<ReviewsSkeleton/>}>
    <Reviews/>
</Suspense>
```

This allows the page to progressively reveal independent regions.

The boundary structure is therefore part of the user-interface architecture.

## Nested Boundaries

Suspense boundaries can be nested:

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <ProductPage>
        <Suspense fallback={<ImagesSkeleton/>}>
            <ProductImages/>
        </Suspense>

        <Suspense fallback={<ReviewsSkeleton/>}>
            <Reviews/>
        </Suspense>
    </ProductPage>
</Suspense>
```

Nested boundaries allow progressively finer control over waiting states.

An inner boundary can reveal its content independently while the outer boundary continues to represent other suspended
content.

## Progressive Reveal

Suspense can support progressive rendering of a page.

For example:

```tsx
<Header/>

<Suspense fallback={<MainSkeleton/>}>
    <Main/>
</Suspense>

<Suspense fallback={<SidebarSkeleton/>}>
    <Sidebar/>
</Suspense>
```

The application does not need to wait for every region before showing any useful interface.

As each suspended region becomes ready, React can reveal it according to the boundary structure and rendering
conditions.

This is especially useful when different parts of a page have different latency characteristics.

## Suspense Lists and Reveal Coordination

Applications sometimes need multiple independently suspended regions to reveal in a coordinated order.

The exact mechanisms available depend on the React version and rendering architecture.

The general design concern is to avoid producing a visually chaotic interface in which unrelated regions repeatedly
appear and disappear at different times.

A page can instead establish deliberate reveal groups so that related content becomes visible together.

The important principle is that boundary placement determines reveal semantics.

## Suspense and Loading States

Suspense does not eliminate the concept of loading state.

A component may still have explicit loading state for an operation that does not participate in suspension:

```tsx
const {data, isLoading} = useQuery();

if (isLoading) {
    return <Loading/>;
}
```

Suspense is useful when readiness is integrated with React's rendering mechanism:

```tsx
<Suspense fallback={<Loading/>}>
    <Content/>
</Suspense>
```

The two approaches can coexist.

The distinction is:

* explicit loading state is application state exposed to the component;
* suspension is rendering coordination handled through a boundary.

## Suspense and Data Fetching

Suspense does not itself fetch data.

For example:

```tsx
<Suspense fallback={<Loading/>}>
    <User/>
</Suspense>
```

does not specify where `User` obtains its data.

A data-fetching abstraction may integrate with Suspense and suspend when data is not ready.

Conceptually:

```tsx
function User() {
    const user = resource.read();

    return <UserDetails user={user}/>;
}
```

If `resource.read()` suspends, the surrounding boundary controls the fallback.

The resource remains responsible for acquisition.

## Suspense and Resource Cache

A resource cache can provide the resource that participates in suspension.

For example:

```ts
const resource = userResource(userId);
```

The cache can determine whether the resource is:

* already available;
* currently being acquired;
* stale;
* unavailable.

Suspense then determines how React renders while that resource is not ready.

The responsibilities remain separate:

* Resource Cache manages resource representation and reuse.
* Suspense manages rendering while content is unavailable.

A cache does not require Suspense, and Suspense does not inherently require a particular cache implementation.

## Suspense and Server State

Server-state libraries can integrate with Suspense so that query consumers suspend while remote data is unavailable.

For example:

```tsx
<Suspense fallback={<UserSkeleton/>}>
    <UserPanel userId={userId}/>
</Suspense>
```

The server-state layer remains responsible for:

* acquiring remote data;
* caching;
* freshness;
* invalidation;
* retries;
* mutations;
* synchronization.

Suspense only controls the rendering response to the query not being ready.

This distinction prevents Suspense from becoming a substitute for server-state management.

## Suspense and Error Boundaries

Suspense and Error Boundaries solve different conditions.

Suspense handles:

```text
content is not ready
```

An Error Boundary handles:

```text
rendering failed
```

They can be composed:

```tsx
<ErrorBoundary>
    <Suspense fallback={<Loading/>}>
        <Profile/>
    </Suspense>
</ErrorBoundary>
```

This gives the subtree separate handling for waiting and failure.

A more localized structure is also possible:

```tsx
<Suspense fallback={<Loading/>}>
    <ErrorBoundary>
        <Profile/>
    </ErrorBoundary>
</Suspense>
```

The appropriate arrangement depends on which boundaries should govern the resulting rendering behavior.

The two patterns should not be conflated.

## Suspense and Transitions

Transitions can be used to prevent an already visible UI from being replaced too aggressively by a Suspense fallback
during an update.

For example:

```tsx
function Navigation() {
    const [isPending, startTransition] = useTransition();

    const navigate = (nextPage: string) => {
        startTransition(() => {
            setPage(nextPage);
        });
    };

    return (
        <>
            <NavigationControls onNavigate={navigate}/>
            {isPending && <ProgressIndicator/>}
            <Page/>
        </>
    );
}
```

The transition tells React that the update is non-urgent.

This can allow React to coordinate the transition to new suspended content while preserving a more useful existing
interface.

Suspense determines what to do when content suspends. Transition semantics determine how React prioritizes the update
that caused the suspension.

## Preventing Abrupt Fallbacks

Suppose a currently visible page is replaced by:

```tsx
<Loading/>
```

every time navigation begins.

This can create visual flicker.

A transition can allow the existing content to remain visible while the next content becomes ready, depending on the
rendering structure.

This is one reason Suspense and transitions are often used together.

## Suspense and Navigation

Route transitions are a natural use case for Suspense.

For example:

```tsx
function App() {
    return (
        <Suspense fallback={<PageSkeleton/>}>
            <Router/>
        </Suspense>
    );
}
```

A more granular architecture can place boundaries around route content:

```tsx
<AppShell>
    <Suspense fallback={<RouteSkeleton/>}>
        <RouteContent/>
    </Suspense>
</AppShell>
```

The shell can remain visible while the route-specific content becomes ready.

The exact routing integration depends on the router and rendering architecture.

## Suspense and Lazy Components

`React.lazy` integrates directly with Suspense.

For example:

```tsx
const SettingsPage = React.lazy(
    () => import("./SettingsPage")
);
```

The lazy component can be rendered under a boundary:

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <SettingsPage/>
</Suspense>
```

While the module is loading, the boundary provides the fallback.

This demonstrates that Suspense is not limited to data. Other rendering prerequisites can participate in suspension.

## Suspense for Code Loading

Lazy component loading creates a straightforward boundary:

```tsx
<Suspense fallback={<LoadingScreen/>}>
    <LazyDashboard/>
</Suspense>
```

The boundary does not download the module itself.

The module-loading mechanism owns the asynchronous operation. Suspense coordinates rendering while the module is
unavailable.

This same separation applies to other suspending resources.

## Suspense During Server Rendering

Suspense can participate in server rendering architectures by allowing portions of the output to become ready
independently.

A server-rendering system can use Suspense boundaries to identify regions that need not block the entire response.

The exact transport and streaming behavior depends on the rendering environment.

The architectural principle is:

> A Suspense boundary can define a unit of rendering readiness across server and client execution.

This makes boundary placement relevant to both user experience and server-rendering behavior.

## Streaming

When the rendering architecture supports streaming, Suspense boundaries can divide the output into independently
deliverable regions.

Conceptually, the server can produce immediately available content while deferred regions become available later.

For example:

```tsx
<Page>
    <Header/>

    <Suspense fallback={<RecommendationsSkeleton/>}>
        <Recommendations/>
    </Suspense>

    <Footer/>
</Page>
```

The shell does not necessarily need to wait for `Recommendations` before useful content can be rendered.

Suspense boundaries therefore act as potential streaming boundaries in compatible rendering architectures.

## Hydration

Suspense can also participate in client hydration by allowing portions of an application to have different readiness
requirements.

A server-rendered page may contain content that requires additional client-side work before it can become fully
interactive.

Suspense boundaries can provide structural units around such content.

The hydration mechanism remains responsible for hydration itself. Suspense provides the rendering boundary around
content that is not yet ready.

## Boundary Placement and User Experience

Boundary placement is not merely a technical concern.

Consider:

```tsx
<Suspense fallback={<FullPageSpinner/>}>
    <Dashboard/>
</Suspense>
```

versus:

```tsx
<Dashboard>
    <DashboardHeader/>

    <Suspense fallback={<ChartSkeleton/>}>
        <Chart/>
    </Suspense>

    <Suspense fallback={<ActivitySkeleton/>}>
        <Activity/>
    </Suspense>
</Dashboard>
```

The second structure preserves more of the existing interface while individual regions become ready.

A useful boundary usually corresponds to something the user can understand as a coherent unit.

## Avoiding Excessive Boundaries

Adding a boundary around every component is usually counterproductive:

```tsx
<Suspense fallback={<Spinner/>}>
    <A/>
</Suspense>

<Suspense fallback={<Spinner/>}>
    <B/>
</Suspense>

<Suspense fallback={<Spinner/>}>
    <C/>
</Suspense>
```

This can produce excessive visual fragmentation.

It also makes the loading behavior harder to reason about because many unrelated fallback states can appear
simultaneously.

Boundaries should represent meaningful loading or reveal units.

## Shared Boundaries

Several components can intentionally share one boundary:

```tsx
<Suspense fallback={<ProfileSkeleton/>}>
    <ProfileHeader/>
    <ProfileDetails/>
    <ProfileActions/>
</Suspense>
```

This means those pieces form one loading unit.

If the product requirement is that the profile should appear as a coherent unit, a shared boundary is appropriate.

If each region should progressively reveal itself, separate boundaries may be preferable.

The correct choice is determined by the desired rendering semantics.

## Suspense and State Preservation

When a subtree suspends during an update, React's rendering behavior determines which previously committed UI can remain
visible and which fallback is shown.

Developers should therefore distinguish suspension from forcibly unmounting a subtree.

Suspension is a rendering readiness mechanism, not simply:

```tsx
return null;
```

The underlying component identity and state semantics remain governed by React's reconciliation rules.

Boundary placement can influence whether already committed content remains part of the visible interface during a
transition.

## Suspense and Component Identity

Component identity remains independent of Suspense.

For example:

```tsx
<Suspense fallback={<Loading/>}>
    <Profile key={userId} userId={userId}/>
</Suspense>
```

Changing `userId` changes the identity of `Profile`.

The Suspense boundary does not itself determine whether `Profile` state is preserved.

This distinction matters when debugging state resets that appear to coincide with loading behavior.

Suspense determines rendering readiness. Keys and component identity determine state-instance continuity.

## Suspense and Controlled Components

Suspense does not determine whether a component is controlled or uncontrolled.

A controlled component may be rendered inside a boundary:

```tsx
<Suspense fallback={<EditorSkeleton/>}>
    <ControlledEditor value={value} onChange={setValue}/>
</Suspense>
```

The component's state ownership remains controlled by its consumer.

Suspense only determines what happens while the subtree is not ready to render.

## Suspense and Context

Context can provide resources, configuration, or services consumed by suspended descendants:

```tsx
<AppContext.Provider value={context}>
    <Suspense fallback={<Loading/>}>
        <Feature/>
    </Suspense>
</AppContext.Provider>
```

Context distribution and Suspense are separate concerns.

Context determines how values are accessed. Suspense determines how rendering behaves when descendant content is not
ready.

## Recovery

Suspense recovery normally occurs when the resource or prerequisite becomes ready and React can successfully render the
suspended subtree.

Unlike an Error Boundary, Suspense does not represent a permanent failure state.

For example:

```tsx
<Suspense fallback={<Loading/>}>
    <UserProfile/>
</Suspense>
```

may initially show:

```tsx
<Loading/>
```

and later render:

```tsx
<UserProfile/>
```

when the required resource becomes available.

If the underlying resource fails, an Error Boundary or the resource's own error-handling mechanism may be required.

## Suspense Does Not Retry Arbitrary Work

Suspending does not mean "keep retrying the operation forever."

The underlying resource determines how readiness changes.

For example, if a data source permanently fails, the application needs a failure path.

Suspense should therefore not be treated as a retry mechanism.

The distinction is:

* Suspense represents temporary unavailability of rendering content;
* retry logic determines whether and how an operation should be attempted again;
* Error Boundaries contain rendering failures;
* server-state or data-fetching layers manage remote-operation failures.

## Common Misuse

A common mistake is assuming that wrapping a component in Suspense automatically makes its asynchronous work suspend:

```tsx
<Suspense fallback={<Loading/>}>
    <ComponentThatUsesUseEffect/>
</Suspense>
```

An ordinary `useEffect` does not automatically participate in Suspense.

Another mistake is treating Suspense as a data-fetching library:

```tsx
<Suspense fallback={<Loading/>}>
    <FetchEverything/>
</Suspense>
```

Suspense does not determine request identity, caching, retries, invalidation, or synchronization.

Another mistake is using one giant boundary for the entire interface when individual regions could load independently.

Another mistake is creating excessive boundaries around trivial components, producing fragmented loading behavior.

Another mistake is using Suspense as a permanent error state. Failure should be handled through an Error Boundary or the
relevant application-state mechanism.

Another mistake is assuming that Suspense itself guarantees a particular streaming, hydration, or server-rendering
behavior regardless of the rendering environment. Those behaviors depend on the rendering architecture and framework
integration.

## Advantages

Suspense provides a declarative mechanism for coordinating rendering around unavailable content.

It allows loading behavior to be expressed at meaningful component boundaries rather than forcing every descendant to
manually propagate loading state.

Nested boundaries support progressive reveal.

It integrates naturally with lazy component loading and compatible asynchronous resource abstractions.

It can improve perceived performance by allowing already-ready content to remain visible while other regions become
ready.

It also provides a common rendering model for different kinds of asynchronous prerequisites.

## Disadvantages

Suspense introduces rendering behavior that can be difficult to understand when the source of suspension is hidden
inside another abstraction.

Poor boundary placement can produce overly broad fallback states or fragmented loading experiences.

Suspense does not provide fetching, caching, synchronization, retry, or mutation semantics.

Recovery from failed operations still requires separate error handling.

Complex nested boundaries can also make the rendering behavior harder to reason about if the loading units do not
correspond to meaningful UI structure.

## When to Use

Use Suspense when a subtree has rendering prerequisites that can participate in React's suspension model and the
application benefits from declarative loading boundaries.

Typical uses include:

* lazy-loaded components;
* route-level loading;
* asynchronous data integrations that support Suspense;
* progressive rendering;
* streaming-compatible server rendering;
* independently loading page regions;
* coordinated loading experiences.

Use multiple boundaries when independently ready regions should be revealed independently.

Use a shared boundary when several components form one coherent loading unit.

## When Not to Use

Do not use Suspense merely because an operation is asynchronous.

An asynchronous operation can remain explicitly state-driven when:

* it does not participate in Suspense;
* the operation requires custom loading semantics;
* the component needs detailed intermediate state;
* the application benefits from direct control over the operation lifecycle.

Do not use Suspense as a substitute for:

* data fetching;
* resource caching;
* server-state synchronization;
* mutation management;
* retry logic;
* error handling.

## Relationships

`21-error-boundary.md` handles supported rendering failures. Suspense handles temporary rendering unavailability. They
are complementary boundaries.

`17-data-fetching.md` owns asynchronous data acquisition. Suspense can provide the rendering response while acquisition
is incomplete when the fetching abstraction supports suspension.

`19-resource-cache.md` owns resource identity, reuse, freshness, and retention. A resource cache can provide resources
consumed through Suspense but does not itself define fallback rendering.

`20-server-state.md` owns remote-state synchronization. Server-state systems can integrate with Suspense, but Suspense
does not replace their synchronization responsibilities.

`22-memoized-components.md` and `23-memoization-hooks.md` concern render optimization. Suspense concerns rendering
readiness rather than whether a render is computationally necessary.

`30-lazy-components.md` owns lazy component loading as an application pattern. Suspense provides the rendering boundary
used while a lazy component is unavailable.

`32-transition.md` concerns update priority and transition behavior. Suspense can display fallbacks during suspended
updates, while transitions can control how those updates affect already visible UI.

`42-hydration-boundary.md` concerns hydration boundaries. Suspense can participate in hydration and streaming
architectures, but hydration remains a separate lifecycle concern.

`44-stable-keys.md` and `45-component-identity.md` determine identity and state preservation. Suspense does not redefine
component identity.

`10-context-provider.md` distributes values through a subtree. Suspense controls rendering readiness for that subtree.

## Summary

A Suspense Boundary is a declarative rendering boundary for content that is temporarily not ready.

Its responsibilities are to:

* define a loading boundary;
* render fallback UI while descendants are suspended;
* establish meaningful loading and reveal units;
* support nested and progressive rendering;
* coordinate asynchronous rendering with transitions;
* participate in compatible lazy-loading, streaming, and hydration architectures.

Suspense does not own the asynchronous resource.

It does not provide:

* fetching;
* caching;
* server-state synchronization;
* mutation handling;
* retry policy;
* general error handling.

The core rule is:

> Use Suspense to define how React renders while descendant content is not ready; keep acquisition, caching,
> synchronization, and failure handling in the abstractions that own those concerns.
