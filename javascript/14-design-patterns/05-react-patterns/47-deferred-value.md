# Deferred Value

Deferred Value allows a component to continue rendering with an older version of a value while React prepares the UI for
a newer version. In React, this is provided by `useDeferredValue`.

The pattern is useful when a component receives a value that updates frequently but some subtree consuming that value is
expensive to render. Instead of requiring the producer to classify its state update as a transition, the consumer can
derive a deferred version of the value.

The central distinction is that a Transition controls the priority of an update, while a Deferred Value controls which
version of a value a consumer uses while newer rendering work is being prepared.

## Intent

Use a Deferred Value when a component needs to consume a frequently changing value without forcing an expensive subtree
to update synchronously with every change.

The basic form is:

```tsx
import {useDeferredValue} from "react";

function SearchResults({query}: { query: string }) {
    const deferredQuery = useDeferredValue(query);

    return <Results query={deferredQuery}/>;
}
```

The component continues to receive the current `query`, while `deferredQuery` may temporarily represent the previous
value during rendering.

## Basic Pattern

Consider an expensive result tree:

```tsx
function SearchPage({query}: { query: string }) {
    return <SearchResults query={query}/>;
}
```

If `query` changes on every keystroke, the result subtree may also attempt to render on every keystroke.

A deferred value creates a lower-priority representation:

```tsx
function SearchPage({query}: { query: string }) {
    const deferredQuery = useDeferredValue(query);

    return <SearchResults query={deferredQuery}/>;
}
```

The input or parent can continue reflecting the latest value while the expensive result subtree can temporarily continue
using the previous one.

## Current Value vs Deferred Value

The distinction is easiest to understand by naming the two values explicitly:

```tsx
const currentQuery = query;
const deferredQuery = useDeferredValue(query);
```

`currentQuery` represents the latest value available to the component.

`deferredQuery` represents the value React is currently allowing the consuming subtree to use.

During a transition period they may differ.

Eventually, when the deferred rendering completes, the deferred value catches up.

## The Value Is Not Manually Delayed

`useDeferredValue` does not implement a fixed delay.

It does not mean:

```text
wait 300ms
```

or:

```text
wait until the user stops typing
```

React determines when the deferred rendering can proceed.

If the UI is able to render immediately, the deferred value may appear to update immediately.

The mechanism is therefore fundamentally different from debouncing or throttling.

## No Timer Is Created

This:

```tsx
const deferredQuery = useDeferredValue(query);
```

does not create a timer.

It does not require:

```tsx
setTimeout(...)
```

and it does not introduce a guaranteed minimum delay.

A deferred value is a rendering-priority mechanism rather than a temporal scheduling primitive.

## Consumer-Side Deferral

The defining characteristic of `useDeferredValue` is that the consumer decides which value should be deferred.

For example:

```tsx
function SearchResults({query}: Props) {
    const deferredQuery = useDeferredValue(query);

    return <ResultList query={deferredQuery}/>;
}
```

The component consuming `query` creates the deferred representation.

The producer does not need to know that this particular consumer is expensive.

This makes deferred values especially useful when a reusable component receives a value from an external parent.

## Producer-Side Transition

A Transition instead marks the state update that produces a value:

```tsx
startTransition(() => {
    setQuery(nextQuery);
});
```

A Deferred Value operates after the value already exists:

```tsx
const deferredQuery = useDeferredValue(query);
```

This gives the two mechanisms different ownership:

* Transition: the producer controls update priority.
* Deferred Value: the consumer controls consumption priority.

## Search Interfaces

Search is a common use case:

```tsx
function SearchPage() {
    const [query, setQuery] = useState("");

    const deferredQuery = useDeferredValue(query);

    return (
        <>
            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />

            <SearchResults query={deferredQuery}/>
        </>
    );
}
```

The input uses the current state and therefore responds immediately.

The results consume the deferred state and may temporarily lag behind.

This is useful when rendering the result tree is more expensive than updating the input.

## Large Lists

A large rendered list can consume a deferred filter:

```tsx
function ProductSearch({products}: Props) {
    const [filter, setFilter] = useState("");
    const deferredFilter = useDeferredValue(filter);

    return (
        <>
            <input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
            />

            <ProductList
                products={products}
                filter={deferredFilter}
            />
        </>
    );
}
```

The input remains current while the list can temporarily use the previous filter.

The deferred value does not make filtering computationally cheaper. It changes when React prioritizes the rendering work
associated with the new value.

## Expensive Child Components

A deferred value is particularly useful when a child subtree is expensive:

```tsx
function EditorPreview({document}: Props) {
    const deferredDocument = useDeferredValue(document);

    return <Preview document={deferredDocument}/>;
}
```

The parent can continue receiving the latest document while the preview catches up.

This is useful when the preview is substantially more expensive to render than the editor itself.

## Visualizing Staleness

A UI can indicate that a deferred subtree is behind the current value.

For example:

```tsx
function SearchPage() {
    const [query, setQuery] = useState("");
    const deferredQuery = useDeferredValue(query);

    const isStale = query !== deferredQuery;

    return (
        <>
            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
            />

            <div style={{opacity: isStale ? 0.6 : 1}}>
                <SearchResults query={deferredQuery}/>
            </div>
        </>
    );
}
```

The UI can therefore communicate that the displayed results correspond to an earlier input.

This should be intentional. Showing stale content without communicating the distinction may be confusing for interfaces
where freshness is important.

## Stale Content Is Not Stale Data

The word “stale” in this context describes rendering relative to the latest React value.

It does not mean that the underlying data is stale according to a server-state cache.

For example:

```tsx
const deferredQuery = useDeferredValue(query);
```

means the consuming UI may temporarily use an older query.

It does not mean that the associated server response has exceeded a freshness threshold.

Rendering deferral and data freshness are different concepts.

## Deferred Values and Referential Equality

`useDeferredValue` can be especially relevant when the deferred value is an object:

```tsx
const deferredOptions = useDeferredValue(options);
```

React compares values according to its normal identity semantics.

If a new object is created on every render:

```tsx
const options = {
    query,
    sort,
};
```

then the identity changes on every render.

This can affect how consumers perceive the deferred value.

Stable object construction may therefore matter when deferred values are objects rather than primitives.

## Primitive Values

Primitive values are straightforward:

```tsx
const deferredQuery = useDeferredValue(query);
```

If `query` changes from `"re"` to `"rea"`, the deferred value may temporarily remain `"re"` while React prepares the
rendering associated with `"rea"`.

Primitive identity is naturally stable according to JavaScript value semantics.

## Object Values

Objects require additional consideration:

```tsx
const deferredOptions = useDeferredValue({
    query,
    sort,
});
```

A new object is created on each render.

That means the value changes by reference even when its contents are equivalent.

If the object does not need to be recreated, stable construction may make the deferred boundary more meaningful:

```tsx
const options = useMemo(
    () => ({query, sort}),
    [query, sort],
);

const deferredOptions = useDeferredValue(options);
```

Memoization should only be introduced when it provides a meaningful benefit.

The deferred-value pattern itself does not require `useMemo`.

## Arrays

The same issue applies to arrays:

```tsx
const deferredItems = useDeferredValue(items);
```

If `items` is recreated unnecessarily, React sees a new reference.

If the array represents meaningful new state, that identity change is appropriate.

The goal is not to force stability at all costs. It is to ensure that the identity of the value reflects actual semantic
changes.

## Referential Stability

Deferred values depend on the identity of the value being deferred.

Referential stability can therefore influence how effectively a deferred value distinguishes meaningful updates from
unnecessary reference changes.

However, referential stability and deferred rendering remain separate concepts.

Stable identity can reduce unnecessary work. Deferred values control when a consumer catches up with a newer value.

## Deferred Values and Memoized Components

A deferred value can be combined with `memo`:

```tsx
const ResultList = memo(ResultListComponent);

function Search({query}: Props) {
    const deferredQuery = useDeferredValue(query);

    return <ResultList query={deferredQuery}/>;
}
```

The deferred value determines which query the child receives.

`memo` can then prevent rendering when the child's props are considered unchanged.

They solve different problems.

## Deferred Values and `useMemo`

`useMemo` caches a calculation:

```tsx
const results = useMemo(
    () => filterProducts(products, query),
    [products, query],
);
```

`useDeferredValue` changes which value a consumer receives:

```tsx
const deferredQuery = useDeferredValue(query);
```

The first concerns calculation reuse.

The second concerns rendering priority and value consumption.

They can be combined when both problems exist.

## Deferred Values and Selectors

A selector chooses which portion of state a component consumes:

```tsx
const selectedUser = useUserStore(selectCurrentUser);
```

A deferred value can then defer consumption of that selected value:

```tsx
const deferredUser = useDeferredValue(selectedUser);
```

The selector determines the value.

The deferred value determines whether the consumer can temporarily continue using the previous value while the new
rendering work is prepared.

## Deferred Values and External Stores

An external store can provide a frequently changing value:

```tsx
const document = useDocumentStore();
```

A consumer can defer the value it receives:

```tsx
const deferredDocument = useDeferredValue(document);
```

The external store remains responsible for its own state, subscription, snapshot, and update semantics.

The deferred value does not alter the store itself.

It only affects the value consumed by this component subtree.

## Deferred Values and Context

Context provides values to descendants:

```tsx
const theme = useContext(ThemeContext);
```

A consumer can derive a deferred representation:

```tsx
const deferredTheme = useDeferredValue(theme);
```

This does not defer the Context provider's update itself.

Other consumers may receive the current value immediately.

The deferral applies to the component that creates the deferred value and the subtree that consumes it.

## Deferred Values and State Ownership

`useDeferredValue` does not move state ownership.

For example:

```tsx
const [query, setQuery] = useState("");
```

still owns `query` in the same component.

Creating:

```tsx
const deferredQuery = useDeferredValue(query);
```

does not create a second authoritative state owner.

The deferred value is a derived rendering representation.

## Deferred Values and Controlled Inputs

A controlled input should generally consume the current value:

```tsx
<input
    value={query}
    onChange={(event) => setQuery(event.target.value)}
/>
```

The expensive result subtree can consume the deferred value:

```tsx
const deferredQuery = useDeferredValue(query);

<SearchResults query={deferredQuery}/>
```

This separation prevents the input itself from becoming visually delayed.

## Deferred Values and Uncontrolled Inputs

An uncontrolled input does not store its authoritative value in React state.

A deferred value can still be used after the input's value enters React state or another application state source.

The pattern concerns the React value being consumed, not whether the original input was controlled.

## Deferred Values and Forms

A form can use a deferred value for expensive derived UI:

```tsx
function FormPreview({values}: Props) {
    const deferredValues = useDeferredValue(values);

    return <Preview values={deferredValues}/>;
}
```

The form's authoritative values remain current.

The preview can temporarily render from the previous values.

This is useful when preview generation is expensive but immediate form interaction must remain responsive.

## Deferred Values and Validation

Deferred values should be used carefully for validation feedback.

For example:

```tsx
const deferredValue = useDeferredValue(value);
```

If validation is based on `deferredValue`, the validation UI may temporarily represent an earlier input.

That can be appropriate for expensive validation displays, but it is usually inappropriate for immediate constraints
where the user expects feedback for the exact current value.

The semantic importance of freshness should determine whether deferral is appropriate.

## Deferred Values and Data Fetching

A deferred value can influence which data a component requests:

```tsx
const deferredQuery = useDeferredValue(query);

useEffect(() => {
    fetchResults(deferredQuery);
}, [deferredQuery]);
```

However, this changes when the effect observes the query; it does not turn `fetch()` into a deferred networking
primitive.

The data-fetching mechanism remains responsible for request lifecycle, cancellation, errors, retries, and stale-result
protection.

For many applications, a server-state or resource-cache abstraction is a more appropriate place to manage request
behavior.

## Deferred Values and Server State

A deferred value can control when a consumer renders a new server-state selection:

```tsx
const deferredUserId = useDeferredValue(userId);
```

The server-state system remains responsible for obtaining and synchronizing the corresponding remote data.

The deferred value does not alter server authority, cache freshness, invalidation, or mutation semantics.

## Deferred Values and Resource Cache

A resource cache can contain data for multiple keys:

```tsx
const deferredQuery = useDeferredValue(query);
```

The consumer may therefore continue reading the resource associated with the previous query while the new resource
becomes available.

The cache remains responsible for resource identity and lifecycle.

The deferred value merely determines which key the consumer currently uses.

## Deferred Values and Suspense

Deferred values become particularly useful when the new value causes a subtree to suspend.

For example:

```tsx
function SearchResults({query}: Props) {
    const deferredQuery = useDeferredValue(query);

    return <Results query={deferredQuery}/>;
}
```

If the new query causes `Results` to suspend, the UI can continue using the previous deferred value while the new
rendering work is prepared.

This can avoid unnecessarily replacing already visible content with a loading fallback for every rapid value change.

The exact behavior depends on the Suspense boundaries surrounding the consuming subtree.

## Deferred Values and Lazy Components

A deferred value can influence whether a lazy component is rendered with a new set of props:

```tsx
const deferredMode = useDeferredValue(mode);

return (
    <Suspense fallback={<EditorSkeleton/>}>
        <Editor mode={deferredMode}/>
    </Suspense>
);
```

Lazy loading controls when the component module becomes available.

The deferred value controls how quickly the consumer catches up to a newer prop value.

They are separate mechanisms.

## Deferred Values and Transitions

Transitions and deferred values are the closest related patterns.

A Transition marks an update at its source:

```tsx
startTransition(() => {
    setQuery(nextQuery);
});
```

A Deferred Value marks a value at its point of consumption:

```tsx
const deferredQuery = useDeferredValue(query);
```

A useful rule is:

**Use a Transition when you control the state update. Use a Deferred Value when you control the consumer.**

This distinction is especially useful in reusable components. A child component cannot always control how its parent
updates a prop, but it can decide to consume that prop through `useDeferredValue`.

## Deferred Values and Multiple Consumers

Different consumers can treat the same value differently:

```tsx
function Dashboard({query}: Props) {
    const deferredQuery = useDeferredValue(query);

    return (
        <>
            <ImmediateStatus query={query}/>
            <ExpensiveResults query={deferredQuery}/>
        </>
    );
}
```

The immediate consumer sees the current value.

The expensive consumer may temporarily see the previous value.

This is one of the main advantages of consumer-side deferral.

A single producer does not need to classify the update differently for every consumer.

## Deferred Values and Component Boundaries

The usefulness of a deferred value depends partly on what consumes it.

For example:

```tsx
const deferredQuery = useDeferredValue(query);

return (
    <ExpensiveResults query={deferredQuery}/>
);
```

If `ExpensiveResults` contains a large subtree, the deferral can be meaningful.

If the consuming component is trivial, there may be little benefit.

The pattern should therefore be applied at meaningful rendering boundaries.

## Deferred Values and Component Memoization

Memoized components can make deferred boundaries more effective when unrelated props remain stable.

For example:

```tsx
const Results = memo(ResultList);

function SearchPage({query, theme}: Props) {
    const deferredQuery = useDeferredValue(query);

    return (
        <Results
            query={deferredQuery}
            theme={theme}
        />
    );
}
```

However, memoization is not required for `useDeferredValue`.

The deferred value itself determines when the consumer receives the newer value.

## Deferred Values and Expensive Calculations

A deferred value does not move calculations outside React's rendering process.

For example:

```tsx
const deferredItems = useDeferredValue(items);

const result = expensiveCalculation(deferredItems);
```

The calculation still executes during rendering.

The benefit is that React can defer the rendering associated with the newer `items` value.

If the calculation is fundamentally CPU-bound, algorithmic optimization, memoization, virtualization, or worker-based
computation may be necessary.

## Deferred Values and CPU-Bound Work

A deferred value does not create a background thread.

This:

```tsx
const deferredData = useDeferredValue(data);
```

does not cause JavaScript to execute on another thread.

If the computation itself blocks the main thread for a significant duration, the application needs a different
optimization strategy.

## Deferred Values and Network Requests

A deferred value does not control the network scheduler.

If a component performs:

```tsx
fetch(`/api/search?q=${deferredQuery}`);
```

the request still uses normal browser networking.

The deferred value only changes when the component observes the new query and therefore potentially initiates the
request.

Cancellation, retries, caching, and stale responses remain separate concerns.

## Deferred Values and Debouncing

Debouncing waits until updates stop occurring for a configured period.

A typical debounce might use:

```tsx
setTimeout(...)
```

A deferred value does not wait for inactivity.

If the user continuously changes the value, React may continue processing deferred work according to available rendering
time.

Therefore:

* debounce controls time between input and action;
* deferred value controls rendering priority.

They should not be treated as interchangeable.

## Deferred Values and Throttling

Throttling limits how frequently an operation occurs over time.

A deferred value does not impose a maximum update frequency.

React can allow a deferred value to catch up whenever rendering permits.

Throttling and deferred rendering solve different problems.

## Deferred Values and Event Handlers

Event handlers normally update current state:

```tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
}
```

The consuming component then derives a deferred value:

```tsx
const deferredQuery = useDeferredValue(query);
```

This keeps the event handler simple and avoids requiring the producer to know which consumers are expensive.

## Deferred Values and Effects

An Effect depending on a deferred value runs when the deferred value changes:

```tsx
useEffect(() => {
    synchronizePreview(deferredValue);
}, [deferredValue]);
```

This means the Effect can intentionally observe a lower-priority representation.

However, Effects are still external synchronization mechanisms. They are not transformed into deferred tasks merely
because their dependency is deferred.

## Deferred Values and Cleanup

If an Effect performs external work based on a deferred value, cleanup remains necessary:

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadPreview(deferredValue, controller.signal);

    return () => {
        controller.abort();
    };
}, [deferredValue]);
```

The deferred value may reduce how often the Effect reacts to rapidly changing values, but it does not replace
cancellation.

## Deferred Values and Errors

A deferred value does not provide error handling.

If rendering the new value causes a component to throw, an Error Boundary remains responsible for error containment.

If consuming the value causes a network request to fail, the data-fetching mechanism remains responsible for
representing and recovering from that failure.

## Deferred Values and Error Boundaries

Error boundaries operate on rendering errors.

A deferred value controls which version of a value a subtree consumes.

They can therefore coexist:

```tsx
<ErrorBoundary fallback={<PreviewError/>}>
    <Preview value={deferredValue}/>
</ErrorBoundary>
```

Neither mechanism replaces the other.

## Pending State

Unlike `useTransition`, `useDeferredValue` does not directly return an `isPending` flag.

The component can compare the current and deferred values when an application-specific stale indicator is useful:

```tsx
const deferredQuery = useDeferredValue(query);
const isStale = query !== deferredQuery;
```

This is a value comparison, not a universal definition of application loading state.

If the application needs explicit transition pending state, `useTransition` may be the more appropriate mechanism.

## Value Equality

The deferred value is based on React's value identity semantics.

For primitive values:

```tsx
useDeferredValue(query);
```

comparison is straightforward.

For objects and arrays:

```tsx
useDeferredValue(options);
```

reference identity matters.

This is another reason to avoid creating semantically identical objects unnecessarily.

## Initial Rendering

The initial render does not necessarily behave like a delayed render of the value.

The important behavior is observed when the input value changes and React can preserve the previous value for deferred
consumption while preparing the new render.

Developers should therefore reason about the relationship between current and deferred values rather than expecting an
explicit loading lifecycle from the Hook.

## Initial Value

`useDeferredValue` can accept an initial value:

```tsx
const deferredQuery = useDeferredValue(query, "");
```

This can allow the deferred representation to use a specified initial value during the initial render.

The initial value is not a general loading placeholder and should be chosen according to the semantics of the consuming
component.

## Custom Hooks

A custom Hook can encapsulate deferred consumption:

```tsx
function useDeferredSearchQuery(query: string) {
    return useDeferredValue(query);
}
```

This can be useful when an application's deferred-consumption policy is repeated across a domain.

The custom Hook should not hide unrelated data-fetching or caching semantics inside the deferred-value abstraction.

## Reusable Components

Deferred consumption is especially useful for reusable components because the component can decide how to handle an
expensive prop without requiring its parent to know the implementation cost.

For example:

```tsx
function ExpensivePreview({document}: Props) {
    const deferredDocument = useDeferredValue(document);

    return <Preview document={deferredDocument}/>;
}
```

The parent can continue passing the current document.

The reusable component determines that its own rendering can lag behind.

## Common Misuse

### Treating It as Debouncing

`useDeferredValue` does not wait for a quiet period.

If the requirement is “only execute this operation after the user stops typing,” use debouncing.

### Treating It as Throttling

It does not impose a maximum update frequency.

### Treating It as Data Caching

It does not cache results or remote data.

### Treating It as Network Scheduling

It does not directly prioritize HTTP requests.

### Treating It as a Worker

It does not move computation to another thread.

### Deferring Urgent UI

Do not defer values that must remain synchronized with direct user interaction.

A controlled input should generally use the current value, while expensive derived UI consumes the deferred value.

### Deferring Everything

Not every prop or state value needs deferred consumption.

If rendering is already cheap, adding a deferred boundary adds complexity without meaningful benefit.

### Assuming a Fixed Delay

There is no guaranteed delay duration.

### Using It to Solve Expensive Computation

A deferred value can reduce the urgency of rendering work, but it does not reduce the computation's intrinsic cost.

### Confusing Stale UI With Stale Server Data

A deferred value can represent an older React value temporarily.

That is unrelated to whether remote data is fresh or stale.

### Creating Unstable Object Values

Passing a newly created object on every render can undermine the usefulness of the deferred boundary:

```tsx
const deferredOptions = useDeferredValue({
    query,
    sort,
});
```

Stable construction should be considered when object identity is not meant to change independently.

## Advantages

Deferred values allow consumers to remain responsive to current input while expensive subtrees catch up later. They are
particularly useful for reusable components because the consumer can choose to defer a value without requiring the
producer to change its update mechanism.

They also compose naturally with Suspense, memoization, component boundaries, and expensive derived UI.

## Disadvantages

Deferred values do not make computations cheaper, reduce network latency, or provide request cancellation, caching, or
debouncing.

They also introduce the possibility that different parts of the UI temporarily represent different versions of the same
logical value. This is useful when intentional, but can be confusing when freshness is semantically important.

## When to Use

Use a Deferred Value when:

* a value changes frequently;
* a consuming subtree is expensive to render;
* the producer cannot or should not control update priority;
* different consumers need different responsiveness;
* an expensive child can safely lag behind current input;
* a new value may cause a subtree to suspend;
* the current value must remain immediately available elsewhere in the UI.

## When Not to Use

Avoid deferred values when:

* the consuming UI must always represent the latest value;
* the rendered subtree is inexpensive;
* the real problem is CPU-bound computation;
* the requirement is debouncing;
* the requirement is throttling;
* the requirement is network caching;
* the requirement is request cancellation;
* the requirement is server-state synchronization;
* the value represents an interaction that must remain immediately consistent.

## Relationship to Transition

Transition and Deferred Value are complementary.

A Transition marks the update that produces a value:

```tsx
startTransition(() => {
    setQuery(nextQuery);
});
```

A Deferred Value marks the consumer that can use an older version temporarily:

```tsx
const deferredQuery = useDeferredValue(query);
```

Use a Transition when the producer controls the update.

Use a Deferred Value when the consumer controls how quickly it needs to catch up.

## Relationship to Suspense

Suspense handles rendering that cannot currently complete and defines a fallback boundary.

A deferred value can allow a subtree to continue consuming its previous value while rendering associated with the newer
value is prepared.

The deferred value and Suspense therefore address different aspects of the same rendering problem.

## Relationship to Lazy Components

Lazy Components defer JavaScript module availability.

Deferred Values defer consumption of changing values.

A lazy component may consume a deferred value, but neither mechanism replaces the other.

## Relationship to Data Fetching

Data fetching manages acquisition of asynchronous data.

A deferred value may determine when a component observes a new query or parameter, but it does not manage the resulting
request.

## Relationship to Resource Cache

A resource cache manages resource identity, reuse, freshness, and invalidation.

A deferred value determines which version of a value a consumer uses during rendering.

A deferred value may cause a consumer to continue reading a previous cache key temporarily, but it does not define cache
semantics.

## Relationship to Server State

Server state represents authoritative remote data.

A deferred value only affects client rendering of values derived from that state.

It does not change server authority, synchronization, mutation, or freshness.

## Relationship to Memoization Hooks

`useMemo` caches calculations.

`useCallback` stabilizes function identity.

`useDeferredValue` allows a consumer to defer catching up to a newer value.

These mechanisms may be combined but solve different problems.

## Relationship to Memoized Components

`memo` can prevent unnecessary rendering when props remain equivalent.

A deferred value controls when a consumer receives the newer prop value.

Memoization and deferral can therefore complement one another.

## Relationship to Referential Stability

Deferred values depend on value identity.

Stable references can make the deferred boundary more meaningful for objects, arrays, and functions.

Referential stability is nevertheless a separate design property and should not be introduced solely to use
`useDeferredValue`.

## Relationship to Selectors

Selectors determine which state a component consumes.

Deferred values determine how quickly that consumer catches up to newer selected values.

The selector owns selection. The deferred value owns consumption priority.

## Relationship to External Stores

External stores own their state and subscription semantics.

A consumer can defer the snapshot-derived value it receives, but `useDeferredValue` does not change the store or its
update mechanism.

## Relationship to Context

Context distributes values through a subtree.

A consumer can create a deferred representation of a context value without deferring the provider's update for other
consumers.

## Relationship to State Ownership

Deferred values do not create or transfer state ownership.

The original state remains owned by its existing state owner.

The deferred value is derived rendering state rather than a second authoritative source.

## Relationship to Controlled Components

Controlled components should generally consume current values for their interactive controls.

Expensive derived UI surrounding the controlled component can consume deferred values.

This allows the control itself to remain responsive.

## Relationship to Effects

Effects depending on a deferred value run according to changes in that deferred representation.

The deferred value can therefore indirectly reduce how frequently an Effect observes rapid changes.

Effect lifecycle, cleanup, and external resource ownership remain separate concerns.

## Design Rules

1. Use `useDeferredValue` when the consumer can safely lag behind the current value.
2. Keep urgent interactive controls connected to current values.
3. Use deferred values for expensive consuming subtrees rather than indiscriminately.
4. Do not treat deferred rendering as a timer or fixed delay.
5. Do not use deferred values as a debounce or throttle mechanism.
6. Do not treat deferred values as data caches.
7. Do not expect deferred values to move computation off the main thread.
8. Remember that deferred values can temporarily represent older UI state.
9. Communicate staleness when the distinction matters to users.
10. Consider referential stability when deferring objects and arrays.
11. Use memoization separately when repeated computation or rendering is the actual problem.
12. Use Transitions when the producer controls the state update and should mark it as non-urgent.
13. Use Deferred Values when the consumer controls how quickly it needs to catch up.
14. Keep network request lifecycle separate from rendering deferral.
15. Keep server-state freshness separate from deferred rendering.
16. Preserve normal Effect cleanup and cancellation when deferred values drive external operations.
17. Test observable behavior rather than assuming a particular delay.
18. Measure whether deferral actually improves perceived responsiveness.

## Summary

A Deferred Value allows a component to continue consuming an older version of a changing value while React prepares
rendering work for the newer version. `useDeferredValue` therefore provides **consumer-side rendering deferral**.

It is particularly useful when a frequently changing value drives an expensive subtree, such as search results, large
lists, previews, or complex visualizations. The immediate UI can remain current while the expensive subtree catches up.

A Deferred Value is not a timer, debounce, throttle, cache, worker, cancellation mechanism, or data-fetching
abstraction. It does not make computation cheaper or network requests faster.

The key distinction from Transition is:

**Transition controls the priority of the update that produces a value. Deferred Value controls how quickly a consumer
catches up to that value.**
