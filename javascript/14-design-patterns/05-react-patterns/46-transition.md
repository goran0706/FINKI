# Transition

A Transition marks a state update as non-urgent work. React can prioritize urgent updates, such as responding to direct
user input, while rendering the UI associated with a transition in the background.

Transitions are primarily a rendering-priority mechanism. They do not defer JavaScript execution arbitrarily, cancel
asynchronous operations, create a scheduler for application tasks, or cache data.

The pattern is useful when an update can take noticeable rendering time but should not block the interface from
responding immediately to more urgent interaction.

## Intent

Use a Transition when a state update represents non-urgent UI work and the application should remain responsive to
urgent interactions while React renders the resulting UI.

The primary APIs are `startTransition` and `useTransition`.

```tsx
import {startTransition, useState} from "react";

function SearchResults() {
    const [query, setQuery] = useState("");
    const [resultsQuery, setResultsQuery] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const nextQuery = event.target.value;

        setQuery(nextQuery);

        startTransition(() => {
            setResultsQuery(nextQuery);
        });
    }

    return (
        <>
            <input value={query} onChange={handleChange}/>
            <Results query={resultsQuery}/>
        </>
    );
}
```

The input update is urgent because it directly represents user interaction. The results update is non-urgent because
rendering a potentially expensive result tree can happen after the input remains responsive.

## Urgent and Non-Urgent Updates

A transition exists because not every state update has the same interaction priority.

An urgent update is typically required to immediately reflect direct interaction:

```tsx
setInputValue(nextValue);
```

A transition update represents work that can be interrupted:

```tsx
startTransition(() => {
    setSelectedTab(nextTab);
});
```

React can prioritize the urgent update while working on the transition.

The distinction is about the importance of the resulting UI update, not about whether the operation itself is
computationally expensive.

## Basic `startTransition`

`startTransition` marks synchronous state updates performed within its callback as transitions:

```tsx
import {startTransition} from "react";

function selectTab(tab: string) {
    startTransition(() => {
        setTab(tab);
    });
}
```

The callback itself is synchronous.

`startTransition` does not make arbitrary JavaScript inside the callback asynchronous:

```tsx
startTransition(() => {
    expensiveJavaScript();
    setTab("reports");
});
```

The JavaScript function still executes synchronously. The transition changes how React treats the resulting state
update.

## `useTransition`

`useTransition` provides both a transition function and an indication that transition work is pending:

```tsx
const [isPending, startTransition] = useTransition();

function selectTab(tab: string) {
    startTransition(() => {
        setTab(tab);
    });
}
```

The pending state can be used to communicate transition progress:

```tsx
<button
    disabled={isPending}
    onClick={() => {
        startTransition(() => {
            setTab("reports");
        });
    }}
>
    Reports
</button>
```

`useTransition` is therefore useful when the UI needs to know that transition work is currently pending.

## `startTransition` vs `useTransition`

`startTransition` is useful when the application only needs to mark an update as non-urgent:

```tsx
startTransition(() => {
    setPage(nextPage);
});
```

`useTransition` is useful when the component also needs transition status:

```tsx
const [isPending, startTransition] = useTransition();
```

Both mark React state updates as transitions. The distinction is whether the component needs the pending state exposed
by the Hook.

## Transition Does Not Mean Delay

A transition does not mean:

```text
wait for a fixed amount of time
```

It means:

```text
this update is non-urgent and may be interrupted by more urgent work
```

React determines when the transition work can progress based on the rendering workload and higher-priority updates.

There is no fixed transition duration.

## Interruptible Rendering

Transition work is designed to be interruptible.

For example, if a user starts typing while React is rendering a large transition update, React can prioritize the newer
urgent input update rather than forcing the user to wait for the previous rendering work to finish.

This is particularly useful for large rendered trees, expensive filtering, tab changes, navigation, and other updates
where the new UI is useful but not required to respond to the immediate interaction.

## Restarting Transition Work

If newer updates arrive while a transition is rendering, React may abandon or restart rendering work.

This means rendering code participating in a transition should remain pure.

Do not rely on a render function executing exactly once:

```tsx
function Results({items}: Props) {
    const filtered = items.filter(matchesCurrentFilter);

    return <List items={filtered}/>;
}
```

Rendering should calculate the next UI from current inputs rather than producing external side effects.

## Render Purity

Transitions do not change React's requirement that rendering remain pure.

Avoid:

```tsx
function Component() {
    externalStore.write("rendered");

    return <div/>;
}
```

Instead, side effects belong in the appropriate Effect, event handler, external system integration, or state-management
mechanism.

A transition can cause rendering work to be interrupted or restarted, making render purity especially important.

## Transition and Event Handlers

A common pattern is to divide one event into urgent and non-urgent updates:

```tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setInput(value);

    startTransition(() => {
        setFilter(value);
    });
}
```

The input remains controlled by the urgent state, while the expensive result tree follows the transition state.

This creates two intentionally different update priorities.

## Search Interfaces

Transitions are useful for interfaces where typing should remain responsive while the resulting UI is expensive to
render:

```tsx
function Search() {
    const [text, setText] = useState("");
    const [query, setQuery] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const nextText = event.target.value;

        setText(nextText);

        startTransition(() => {
            setQuery(nextText);
        });
    }

    return (
        <>
            <input value={text} onChange={handleChange}/>
            <SearchResults query={query}/>
        </>
    );
}
```

The input reflects every keystroke immediately. The result view can lag behind temporarily without blocking the input.

The pattern is particularly useful when rendering the result tree is expensive.

## Filtering Large Lists

A transition can mark a large list update as non-urgent:

```tsx
function ProductSearch({products}: Props) {
    const [text, setText] = useState("");
    const [filter, setFilter] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const nextValue = event.target.value;

        setText(nextValue);

        startTransition(() => {
            setFilter(nextValue);
        });
    }

    const visibleProducts = products.filter((product) =>
        product.name.includes(filter),
    );

    return (
        <>
            <input value={text} onChange={handleChange}/>
            <ProductList products={visibleProducts}/>
        </>
    );
}
```

The transition does not make `filter()` itself execute asynchronously. It tells React that the state update causing the
new rendered list is non-urgent.

If the filtering computation itself is expensive enough to block JavaScript execution, a transition alone does not move
that computation off the main thread.

## Tab Switching

Transitions are useful when changing tabs can produce a substantial rendering workload:

```tsx
const [tab, setTab] = useState("overview");

function selectTab(nextTab: string) {
    startTransition(() => {
        setTab(nextTab);
    });
}
```

The user interaction that selects the tab remains urgent, while rendering the destination tab can be treated as
transition work.

## Navigation

Client-side navigation can often be represented as a transition:

```tsx
function navigateToReports() {
    startTransition(() => {
        setRoute("/reports");
    });
}
```

The router may provide its own transition-aware APIs, so applications should use the router's integration when
appropriate.

Route-based lazy loading can also suspend during a transition:

```tsx
startTransition(() => {
    setRoute("/reports");
});
```

If the destination route requires a lazy module, the route can suspend while the module becomes available.

Transition, routing, and lazy loading remain separate mechanisms.

## Transitions and Suspense

Transitions interact naturally with Suspense.

Suppose a state update causes a component to suspend:

```tsx
startTransition(() => {
    setTab("reports");
});
```

and the reports view suspends:

```tsx
<Suspense fallback={<ReportsSkeleton/>}>
    <Reports/>
</Suspense>
```

The transition allows React to treat the update as non-urgent while the new UI becomes ready.

This is particularly useful for avoiding unnecessarily disruptive loading behavior during non-urgent UI changes.

Suspense owns suspended rendering and fallback behavior. Transition owns update priority.

## Avoiding Unwanted Fallback Replacement

A transition can allow React to keep already visible content while new transition content is being prepared, depending
on the surrounding Suspense structure.

This can produce a less disruptive experience than immediately replacing the current interface with a fallback for every
non-urgent update.

The exact result depends on boundary placement and the rendering tree.

Transitions therefore work together with Suspense boundaries rather than replacing them.

## Transition Pending State

`useTransition` exposes whether transition work is pending:

```tsx
const [isPending, startTransition] = useTransition();
```

This can be used to provide lightweight feedback:

```tsx
return (
    <>
        <button
            onClick={() => {
                startTransition(() => {
                    setTab("reports");
                });
            }}
        >
            Reports
        </button>

        {isPending && <span>Updating...</span>}
    </>
);
```

The pending indicator should generally complement the existing UI rather than unnecessarily replacing the entire
interface.

## Pending State Is Not Request State

`isPending` indicates pending transition work.

It does not inherently mean:

* an HTTP request is running;
* server data is being fetched;
* a mutation is pending;
* a resource-cache entry is loading;
* a promise is unresolved for an arbitrary operation.

For example:

```tsx
const [isPending, startTransition] = useTransition();
```

does not turn `isPending` into a general-purpose asynchronous operation status.

Network state should be represented by the mechanism responsible for that network operation.

## Transition and Async Functions

A transition primarily marks React state updates.

Consider:

```tsx
startTransition(async () => {
    const result = await fetchResults();

    setResults(result);
});
```

The asynchronous operation itself is not made non-urgent merely because it appears inside the callback.

The important distinction is between the asynchronous operation and the React state update produced by it.

Where asynchronous actions are involved, the application's data-fetching and server-state mechanisms remain responsible
for request lifecycle, cancellation, errors, retries, and consistency.

## Transition and `await`

When asynchronous work is involved, developers must be careful about which state updates are actually associated with
the transition.

The transition concept is about React updates, not arbitrary asynchronous execution.

If a state update occurs after an asynchronous boundary, the application should use the transition APIs according to the
React version and async-action model it targets rather than assuming that every update originating from the callback
remains automatically classified in the same way.

The important architectural rule is to treat asynchronous request lifecycle and React update priority as separate
concerns.

## Transition and Data Fetching

A transition does not fetch data.

This:

```tsx
startTransition(() => {
    setQuery(nextQuery);
});
```

may cause a component to request data because the component responds to `query`, but the transition itself does not
perform or manage that request.

Data fetching remains responsible for:

* request initiation;
* cancellation;
* retries;
* errors;
* response handling;
* stale-result protection.

Transition determines how the resulting React update is prioritized.

## Transition and Server State

Server state remains authoritative on the server.

A transition can mark the React rendering caused by a server-state update as non-urgent:

```tsx
startTransition(() => {
    setSelectedProject(project);
});
```

But it does not change server-state ownership, freshness, cache invalidation, mutation semantics, or synchronization.

A server-state library may integrate transitions internally, but those are separate responsibilities.

## Transition and Resource Cache

A resource cache controls asynchronous resource reuse and lifecycle.

A transition controls React update priority.

For example:

```tsx
startTransition(() => {
    setResourceKey(nextKey);
});
```

may cause the UI to consume a different cached resource, but the transition does not determine whether that resource is
cached, stale, fresh, invalidated, or evicted.

## Transition and Deferred Value

Transitions and deferred values are related but solve different problems.

A Transition marks a state update as non-urgent:

```tsx
startTransition(() => {
    setQuery(value);
});
```

`useDeferredValue` instead allows a component to consume a deferred version of an existing value:

```tsx
const deferredQuery = useDeferredValue(query);
```

The conceptual distinction is:

* Transition: defer the update that produces a state value.
* Deferred Value: defer consumption of a value by a subtree.

A component may use either mechanism depending on where control over the update exists.

## Transition and Memoization

Transitions do not make expensive calculations intrinsically cheaper.

If a component performs expensive work during rendering:

```tsx
const results = expensiveFilter(items, query);
```

a transition may allow the render to be deprioritized, but the calculation still has to execute.

Memoization may reduce repeated calculations:

```tsx
const results = useMemo(
    () => expensiveFilter(items, query),
    [items, query],
);
```

The two techniques therefore optimize different dimensions.

## Transition and Memoized Components

`memo` can prevent unnecessary component rendering when its props remain equivalent.

A transition changes the priority of a state update that causes rendering work.

They can complement each other:

```tsx
const ResultList = memo(ResultListComponent);
```

while:

```tsx
startTransition(() => {
    setQuery(nextQuery);
});
```

marks the relevant update as non-urgent.

Memoization can reduce the amount of work React performs. Transitions can influence when remaining work is performed.

## Transition and Referential Stability

Transition scheduling does not make unstable references stable.

For example:

```tsx
startTransition(() => {
    setOptions({query: value});
});
```

still creates a new object.

Referential stability remains a separate design property.

Stable references can reduce unnecessary rendering work, while transitions determine the priority of the update that
does occur.

## Transition and Effects

An Effect caused by a transition-rendered state update still follows ordinary Effect semantics.

```tsx
useEffect(() => {
    synchronizeWithExternalSystem(tab);
}, [tab]);
```

The transition does not turn the Effect into a background task or alter its fundamental lifecycle.

If the Effect performs external work, its cancellation and cleanup behavior remain the responsibility of that Effect and
the external system.

## Transition and State Ownership

A transition does not determine where state belongs.

The state may remain local:

```tsx
const [tab, setTab] = useState("overview");
```

be lifted:

```tsx
const [tab, setTab] = useState("overview");
```

or belong to an external store.

The transition only changes how a React update to that state is prioritized.

## Transition and Controlled Components

A controlled input often requires its displayed value to update urgently:

```tsx
<input value={value} onChange={handleChange}/>
```

The input state should generally not be placed behind a transition when doing so would make direct typing lag.

Instead, the expensive derived UI can be updated as transition work.

```tsx
setInputValue(nextValue);

startTransition(() => {
    setSearchQuery(nextValue);
});
```

This preserves immediate control of the input while allowing expensive results to lag behind.

## Transition and Uncontrolled Components

Uncontrolled inputs maintain their value outside React state ownership.

A transition may still be useful for React state updates triggered by an uncontrolled input:

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(() => {
        setSubmittedData(formData);
    });
}
```

The transition concerns the React update, not the DOM's ownership of the input value.

## Transition and External Stores

Transitions have important boundaries around external stores.

React's external-store integration has specific consistency requirements because external stores can change
independently of React rendering.

A transition does not turn arbitrary external-store mutations into transition work.

If an external store is updated directly:

```tsx
store.setState(nextState);
```

the store update remains an external-store operation.

The React integration determines how consumers observe it.

## Transition and Selectors

Selectors determine which portion of state a consumer reads.

A transition determines the priority of a React state update.

They can therefore be combined:

```tsx
startTransition(() => {
    setSelectedId(nextId);
});
```

while a selector limits which part of a larger state source the component consumes.

Neither mechanism replaces the other.

## Transition and Context

Context determines how a value is distributed through a component subtree.

A context value update can participate in a transition when the update is caused by a transition-marked React state
update:

```tsx
startTransition(() => {
    setTheme(nextTheme);
});
```

However, Context does not itself provide transition semantics.

The state update and its consumers remain subject to normal React rendering behavior.

## Transition and Forms

Transitions can be useful for non-urgent UI resulting from form interaction.

For example:

```tsx
function Form() {
    const [value, setValue] = useState("");
    const [preview, setPreview] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const nextValue = event.target.value;

        setValue(nextValue);

        startTransition(() => {
            setPreview(nextValue);
        });
    }

    return (
        <>
            <input value={value} onChange={handleChange}/>
            <Preview value={preview}/>
        </>
    );
}
```

The input remains responsive while the preview can be rendered as lower-priority work.

A transition does not replace form-state management or submission-state management.

## Transition and Optimistic UI

Transitions and optimistic updates can coexist but represent different concepts.

An optimistic update changes what state the UI displays before the authoritative operation completes.

A transition changes the priority of rendering work.

For example, an application may optimistically update a list and mark the resulting non-urgent rendering work as a
transition.

The transition itself does not provide rollback, reconciliation, or server consistency.

## Transition and Lazy Components

Lazy components can suspend while their modules load:

```tsx
const Reports = lazy(() => import("./Reports"));
```

A navigation or state update that reveals the component can be marked as a transition:

```tsx
startTransition(() => {
    setShowReports(true);
});
```

This can produce a smoother transition into the asynchronously available UI.

Lazy loading owns module availability. Suspense owns suspended rendering. Transition owns update priority.

## Transition and Error Boundaries

A transition does not provide error handling.

If transition work causes a component to throw, an appropriate Error Boundary remains responsible for containment and
recovery.

Similarly, a transition does not automatically recover from failed network requests or failed lazy-module loads.

## Transition and Event Priority

React distinguishes different categories of work according to interaction urgency.

A direct interaction such as typing or clicking may require immediate feedback, while a resulting large render can be
treated as transition work.

The purpose is not to manually assign arbitrary numeric priorities to application operations.

Developers should express the semantic distinction between urgent and non-urgent UI updates and allow React to schedule
the work.

## Transition Does Not Move Work Off the Main Thread

A transition does not create a worker, thread, or separate JavaScript execution context.

This is an important limitation.

If a calculation blocks JavaScript execution for a long period:

```tsx
const result = extremelyExpensiveCalculation(data);
```

marking the state update as a transition does not move `extremelyExpensiveCalculation` to another thread.

For genuinely CPU-intensive work, techniques such as Web Workers or algorithmic optimization may be required.

## Transition and CPU-Bound Work

A transition can make rendering work interruptible, but JavaScript execution inside a single render remains subject to
the browser's execution model.

If the application performs a very large synchronous calculation during rendering, that calculation still consumes
main-thread time.

Possible solutions include:

* reducing the computational complexity;
* memoizing repeated calculations;
* virtualizing large lists;
* moving computation to a worker;
* reducing rendered output;
* restructuring state and component boundaries.

A transition should not be presented as a general CPU-performance solution.

## Transition and Network Latency

Transitions do not reduce network latency.

A transition can coordinate UI updates around an asynchronous operation, but it does not make the network request
faster.

Network performance remains governed by:

* request initiation;
* server latency;
* network conditions;
* caching;
* payload size;
* connection reuse;
* application data architecture.

## Pending Indicators

A pending indicator should be designed according to the scope and duration of the transition.

For a small region:

```tsx
{
    isPending && <InlineSpinner/>
}
```

may be appropriate.

For a larger destination:

```tsx
{
    isPending && <PageProgress/>
}
```

may provide better feedback.

The indicator should not automatically replace all existing UI. The purpose of transition-aware feedback is to
communicate progress without making the application feel blocked.

## Avoiding Disabled Interfaces

It is tempting to disable an entire interface whenever `isPending` is true:

```tsx
<button disabled={isPending}>Save</button>
```

This is sometimes appropriate, but it should not become the default.

Transition work is specifically designed to coexist with urgent interaction.

If the user can safely perform another action while the transition is pending, disabling unrelated controls
unnecessarily reduces responsiveness.

## Multiple Transitions

Applications can have several transition-producing interactions.

React manages transition work as part of its scheduling model rather than requiring application code to construct an
explicit queue of transition objects.

The application should focus on marking meaningful non-urgent updates rather than manually coordinating internal
rendering priority.

## Transition and Race Conditions

Transitions do not automatically solve application-level races.

For example, asynchronous requests triggered by changing a search query can complete out of order.

```tsx
query = "re"
request
A

query = "react"
request
B
```

If request A resolves after request B, the application still needs appropriate stale-result protection.

Possible mechanisms include:

* request cancellation;
* request identity;
* server-state libraries;
* resource caches;
* current-request checks.

The transition only affects the priority of React updates.

## Transition and Cancellation

A transition is not a cancellation mechanism.

When a newer update supersedes older transition rendering, React can discard rendering work that is no longer needed.

That does not mean an external network request, timer, worker operation, or subscription is automatically cancelled.

External resources require their own cleanup and cancellation mechanisms.

## Transition and Resource Ownership

A component that starts an external operation remains responsible for appropriate ownership and cleanup.

For example:

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadData(query, controller.signal);

    return () => controller.abort();
}, [query]);
```

Whether the state update that changed `query` was urgent or a transition does not remove the need for correct resource
lifecycle management.

## Testing

Tests should verify observable behavior rather than React's internal scheduling details.

For example:

```tsx
await user.type(input, "react");

expect(input).toHaveValue("react");

expect(
    await screen.findByText("Results for react"),
).toBeInTheDocument();
```

Tests can also verify pending UI where it is part of the intended user experience:

```tsx
expect(screen.getByText("Updating...")).toBeInTheDocument();
```

Avoid tests that depend on an implementation-specific assumption about exactly how many times React starts, interrupts,
or restarts a render.

## Common Misuse

### Marking Direct Input Updates as Transitions

Avoid putting controlled input state behind a transition when immediate feedback is required:

```tsx
startTransition(() => {
    setValue(event.target.value);
});
```

The input itself should generally remain responsive.

Instead, keep the immediate value urgent and transition the expensive derived UI.

### Treating Transition as `setTimeout`

A transition does not mean “run this later after a delay.”

Do not use it as a replacement for timers.

### Treating Transition as a Worker

A transition does not move JavaScript execution to another thread.

### Treating `isPending` as Network Loading State

`isPending` describes transition work, not arbitrary request state.

### Expecting Cancellation

A superseded transition does not automatically cancel external asynchronous operations.

### Transitioning Everything

Not every state update should be marked as a transition.

If an update is required for immediate interaction feedback, it should remain urgent.

### Using Transitions to Hide Expensive Algorithms

If a synchronous computation is intrinsically too expensive, changing update priority does not eliminate its CPU cost.

### Using Transitions Instead of Memoization

A transition does not reduce the number of calculations.

Memoization, component memoization, selectors, and better state boundaries may still be necessary.

### Using Transitions as Server-State Management

Transitions do not provide caching, invalidation, retries, synchronization, or optimistic reconciliation.

## Advantages

Transitions allow React to distinguish urgent interaction updates from non-urgent rendering work. They can preserve
input responsiveness, make expensive UI updates interruptible, integrate naturally with Suspense, and provide
pending-state feedback when needed.

They also allow applications to express interaction intent declaratively rather than manually implementing
rendering-priority queues.

## Disadvantages

Transitions do not reduce the intrinsic CPU cost of JavaScript, network latency, or data processing. They also introduce
more nuanced rendering behavior that developers must understand when working with Suspense, asynchronous operations, and
pending UI.

Incorrectly marking urgent updates as transitions can make interfaces feel laggy rather than responsive.

## When to Use

Use transitions when:

* an update is not required for immediate interaction feedback;
* rendering the resulting UI may be substantial;
* an input should remain responsive while derived UI updates;
* switching tabs or views causes significant rendering work;
* navigation produces non-urgent UI changes;
* a state update may cause Suspense to occur;
* the application benefits from exposing transition-pending feedback.

## When Not to Use

Do not use transitions when:

* the update must immediately reflect direct user interaction;
* the operation is primarily CPU-bound and needs off-main-thread execution;
* the goal is to delay arbitrary JavaScript;
* the goal is to cancel a request;
* the goal is to cache data;
* the goal is to manage server state;
* the goal is to debounce or throttle an event;
* the update does not benefit from being treated as non-urgent.

## Relationship to Deferred Value

Transition and Deferred Value are complementary mechanisms.

A Transition marks the state update that produces a value as non-urgent.

A Deferred Value allows a consumer to continue using an older value while a newer value is prepared.

Use a Transition when the producer controls the update. Use a Deferred Value when the consumer needs a deferred
representation of an existing value.

## Relationship to Lazy Components

Lazy Components defer JavaScript module loading.

A transition can mark the React update that reveals a lazy component as non-urgent.

The mechanisms therefore operate at different levels:

* Lazy Component: when component code becomes available.
* Transition: how the resulting React update is prioritized.

## Relationship to Suspense

Suspense handles components that cannot currently complete rendering and provides fallback UI.

Transitions can coordinate non-urgent updates that cause suspension.

Suspense owns the boundary. Transition owns the update priority.

## Relationship to Data Fetching

Data fetching obtains asynchronous data.

Transitions can mark React updates caused by data availability or selection as non-urgent, but they do not manage the
request lifecycle.

## Relationship to Server State

Server-state management handles synchronization with authoritative remote data.

Transitions control rendering priority for React updates involving that data.

They are independent concerns.

## Relationship to Resource Cache

Resource caches control reusable asynchronous resources.

Transitions control the priority of React updates that consume those resources.

A transition does not establish resource identity, freshness, invalidation, or eviction.

## Relationship to Memoization Hooks

`useMemo` and `useCallback` reduce repeated calculations or stabilize references.

Transitions do not reduce the computational cost of a render. They influence when React schedules the associated update.

## Relationship to Memoized Components

`memo` can prevent unnecessary component rendering.

Transitions classify updates as non-urgent.

They can complement one another but solve different performance problems.

## Relationship to Referential Stability

Stable object, array, function, and JSX references can reduce unnecessary rendering work.

A transition does not create referential stability.

Both may be useful in the same performance-sensitive component tree.

## Relationship to Effects

Effects synchronize with external systems after rendering.

Transitions do not change the fundamental ownership or cleanup rules of Effects.

An Effect triggered by transition state remains an ordinary Effect.

## Relationship to State Ownership

Transitions do not determine where state is owned.

Local state, lifted state, Context state, and external-store state can all participate in transition-driven rendering.

The state-ownership strategy remains independent.

## Design Rules

1. Mark genuinely non-urgent React updates as transitions.
2. Keep direct interaction feedback urgent.
3. Use `useTransition` when the UI needs transition-pending state.
4. Use `startTransition` when only update priority is required.
5. Do not treat transitions as timers, workers, or cancellation mechanisms.
6. Do not treat transition pending state as generic network-loading state.
7. Keep render functions pure because transition rendering may be interrupted or restarted.
8. Separate React rendering priority from asynchronous request lifecycle.
9. Use Suspense when transition work can suspend and a meaningful fallback is required.
10. Use memoization or algorithmic optimization when the actual problem is excessive computation.
11. Use workers when computation must move off the main thread.
12. Keep controlled input state responsive and transition expensive derived UI instead.
13. Do not use transitions as a substitute for server-state management.
14. Do not use transitions as a substitute for resource caching.
15. Do not assume superseded transition work cancels external operations.
16. Let routing libraries provide their own transition integration when appropriate.
17. Test observable UI behavior rather than React's internal scheduling sequence.
18. Measure whether transition boundaries actually improve perceived responsiveness.

## Summary

A Transition marks a React state update as non-urgent work. React can then prioritize more urgent interaction updates
while rendering the transition in the background and can interrupt or restart that rendering when newer work becomes
more important.

The pattern is particularly useful for expensive UI updates caused by typing, filtering, tab changes, navigation, and
other interactions where immediate feedback should remain responsive.

A transition does not make arbitrary JavaScript asynchronous, move computation to another thread, fetch or cache data,
cancel network operations, or manage server state. Its responsibility is narrower: **express that a React update can
yield to more urgent work.**
