# Memoized Values

Memoized values are computed values whose previously produced result can be reused when the inputs required to produce
that result have not changed.

In React, the primary mechanism for memoizing a value inside a component is `useMemo`. It associates a computed result
with a component instance and a dependency list. React can reuse the previous result when the dependencies are unchanged
and recompute it when they change.

Memoization is an optimization. It does not change the semantic meaning of the computation and should not be required
for the component to produce the correct result.

## Intent

Use memoized values when a derived computation is sufficiently expensive to justify avoiding repeated computation, or
when preserving the identity of a derived value is important to another optimization or API contract.

Typical uses include:

* expensive filtering or transformation
* expensive sorting
* computationally intensive derived data
* constructing a derived object passed to a memoized child
* constructing a derived array whose identity participates in another optimization
* stabilizing a value consumed by an API that relies on referential equality

The goal is to avoid unnecessary recomputation or unnecessary creation of equivalent reference values when doing so
provides a meaningful benefit.

## Basic Pattern

```tsx
import {useMemo} from "react";

function ProductList({
                         products,
                         query,
                     }: {
    products: Product[];
    query: string;
}) {
    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [products, query]);

    return <List products={filteredProducts}/>;
}
```

The function passed to `useMemo` computes the value.

The dependency list describes the reactive inputs that determine the computation.

When the dependencies are unchanged according to React's dependency comparison, React can reuse the previously
calculated value instead of invoking the calculation again.

When a dependency changes, React can recalculate the value.

## Memoization Is an Optimization

Memoization should not be treated as a semantic requirement.

This:

```tsx
const total = useMemo(() => calculateTotal(items), [items]);
```

should have the same logical result as:

```tsx
const total = calculateTotal(items);
```

The difference is that the first version permits React to reuse a previous calculation.

If removing `useMemo` changes the application's correctness, the underlying design is relying on memoization for
behavior that should not depend on an optimization.

Memoization should therefore be introduced because repeated computation or reference creation has a meaningful cost, not
because every derived value must be memoized.

## Derived Values

A memoized value is normally derived from props, state, context, or other inputs available during rendering.

```tsx
const visibleItems = useMemo(
    () => items.filter(item => item.visible),
    [items]
);
```

The result is not independent state.

It should not be treated as another authoritative source of application state.

The source values remain authoritative, while the memoized value is a cached computation derived from them.

## Memoized Values Versus State

Do not use `useMemo` as a replacement for state.

Incorrect:

```tsx
const selectedItem = useMemo(
    () => items.find(item => item.id === selectedId),
    [items, selectedId]
);
```

This is perfectly valid when `selectedItem` is a derived value.

But this would be conceptually wrong:

```tsx
const value = useMemo(() => {
    return someValueThatChangesOverTime;
}, []);
```

A memoized value does not become state merely because its computation produces a value.

State represents information whose current value is owned by a state mechanism and can change independently of its
derivation.

Memoization represents a cached result of a computation.

## Memoized Values Versus Effects

Do not use an Effect merely to calculate a value that can be derived during rendering.

Avoid:

```tsx
const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

useEffect(() => {
    setFilteredProducts(
        products.filter(product => product.category === category)
    );
}, [products, category]);
```

Prefer:

```tsx
const filteredProducts = useMemo(
    () => products.filter(product => product.category === category),
    [products, category]
);
```

Or, if the computation is cheap:

```tsx
const filteredProducts = products.filter(
    product => product.category === category
);
```

The derived value does not need an additional render cycle merely to synchronize it with its inputs.

`useMemo` is therefore sometimes useful for expensive derived calculations, but the more fundamental design principle is
to avoid redundant state and synchronization.

## Dependency List

The dependency list identifies the reactive values used by the calculation.

```tsx
const visibleProducts = useMemo(
    () => products.filter(product => product.category === category),
    [products, category]
);
```

Both `products` and `category` participate in the calculation and therefore belong in the dependency list.

An omitted dependency can cause the memoized calculation to reuse a result that was produced from stale inputs.

Memoization does not change the dependency model of React rendering.

The calculation must still accurately describe which values it reads.

## Dependency Equality

React compares dependency values using its dependency comparison semantics.

For primitive values, this generally behaves as expected:

```tsx
const label = useMemo(
    () => formatCount(count),
    [count]
);
```

For objects, arrays, and functions, identity matters.

```tsx
const result = useMemo(
    () => process(options),
    [options]
);
```

If `options` is recreated on every render, the dependency changes by reference even when its contents are equivalent.

```tsx
const options = {
    sort: "name",
};
```

This creates a new object on each render.

Consequently, memoizing a calculation that depends on that object may provide no reuse.

## Referential Equality

Memoized values can preserve object or array identity across renders.

```tsx
const options = useMemo(
    () => ({
        sort: "name",
        direction: "ascending",
    }),
    []
);
```

When the dependencies remain unchanged, React can reuse the same object reference.

This can matter when the value is passed to another component or API that uses referential equality.

For example:

```tsx
const options = useMemo(
    () => ({
        sort,
        direction,
    }),
    [sort, direction]
);

return <DataTable options={options}/>;
```

If `DataTable` is memoized, preserving `options` identity can allow its props to remain equal when the logical values
have not changed.

However, memoizing an object solely because it looks cleaner does not provide a meaningful benefit unless the identity
is actually relevant.

## Memoized Values and Memoized Components

`useMemo` and `memo` solve different problems.

`useMemo` memoizes a value produced during rendering.

`memo` can allow a component to skip rendering when its props remain equivalent according to its comparison rules.

They can be used together.

```tsx
const visibleItems = useMemo(
    () => filterItems(items, query),
    [items, query]
);

return <Results items={visibleItems}/>;
```

If `Results` is memoized:

```tsx
const Results = memo(function Results({
                                          items,
                                      }: {
    items: Item[];
}) {
    return <List items={items}/>;
});
```

Then the stable `items` reference can help `Results` determine that its prop has not changed.

The two optimizations should not be conflated.

Memoizing the value does not automatically memoize the consuming component.

Memoizing the component does not automatically memoize values passed to it.

## Memoized Values and Callback Memoization

A function is also a value.

`useCallback` is the specialized mechanism for memoizing a function reference.

Conceptually:

```tsx
const handleClick = useCallback(() => {
    submit(id);
}, [id]);
```

Whereas:

```tsx
const result = useMemo(() => calculate(data), [data]);
```

memoizes a calculated result.

Do not use `useMemo` to obscure function memoization when `useCallback` communicates the intent more directly.

```tsx
const handleClick = useMemo(
    () => () => submit(id),
    [id]
);
```

Although this can produce a memoized function reference, `useCallback` is the purpose-specific API.

The conceptual ownership remains distinct:

* memoized values represent cached calculation results
* memoized callbacks represent stable function identity

## Memoized Values and Referential Stability

Memoization can be one mechanism for achieving referential stability.

```tsx
const configuration = useMemo(
    () => ({
        pageSize,
        sort,
    }),
    [pageSize, sort]
);
```

The identity of `configuration` can remain stable while `pageSize` and `sort` remain unchanged.

Referential stability is the broader design property.

Memoization is one technique for achieving it.

A value does not necessarily need to be memoized to be stable. Primitive values are already compared by value, and some
objects can be created at a stable scope outside the component when appropriate.

## Expensive Computation

The strongest direct use case for `useMemo` is avoiding expensive repeated computation.

```tsx
const statistics = useMemo(
    () => calculateStatistics(largeDataset),
    [largeDataset]
);
```

If `calculateStatistics` is computationally expensive and `largeDataset` frequently remains unchanged while the
component renders for other reasons, memoization can avoid unnecessary work.

The cost should be considered relative to the cost of:

* performing the computation
* maintaining the memoization machinery
* comparing dependencies
* retaining the previous result
* increasing conceptual complexity

Memoization is most useful when the avoided work is materially more expensive than the overhead and complexity
introduced by caching it.

## Cheap Computations

Cheap calculations generally do not require memoization.

```tsx
const fullName = `${firstName} ${lastName}`;
```

Adding:

```tsx
const fullName = useMemo(
    () => `${firstName} ${lastName}`,
    [firstName, lastName]
);
```

usually adds complexity without producing a meaningful benefit.

The existence of `useMemo` does not imply that every derived value should use it.

Prefer straightforward rendering code until there is a concrete reason to introduce memoization.

## Memoization and Large Collections

Filtering, sorting, grouping, and transforming large collections can be reasonable memoization candidates.

```tsx
const groupedItems = useMemo(() => {
    return groupByCategory(items);
}, [items]);
```

The value of memoization increases when:

* the collection is large
* the transformation is expensive
* renders occur frequently
* the inputs often remain unchanged
* the resulting value is reused
* the result's identity matters to another optimization

The collection size alone does not establish that memoization is necessary.

Actual computational cost and rendering frequency matter.

## Sorting

Sorting can mutate arrays if the native operation is used incorrectly.

Avoid:

```tsx
const sortedItems = useMemo(() => {
    return items.sort(compareItems);
}, [items]);
```

This mutates the source array.

Prefer:

```tsx
const sortedItems = useMemo(() => {
    return [...items].sort(compareItems);
}, [items]);
```

Or use a non-mutating sorting operation where the environment supports it.

Memoization does not make an otherwise unsafe mutation safe.

The calculation should preserve the immutability assumptions of React state and props.

## Object Construction

Memoization can stabilize a derived object.

```tsx
const pagination = useMemo(
    () => ({
        page,
        pageSize,
        total,
    }),
    [page, pageSize, total]
);
```

This is useful when the object is passed to a consumer for which object identity is meaningful.

It is not automatically useful simply because creating an object allocates memory.

Object allocation is usually cheap enough that unnecessary memoization can be worse for maintainability than the
allocation it avoids.

## Array Construction

The same principle applies to arrays.

```tsx
const selectedIds = useMemo(
    () => items.filter(item => item.selected).map(item => item.id),
    [items]
);
```

The returned array can retain its identity across renders when the dependency remains unchanged.

This matters when downstream consumers use referential equality.

If the array is used only locally for a trivial operation, memoization may provide no meaningful benefit.

## Memoization and Context Values

Memoized values can be useful when constructing context values.

```tsx
const value = useMemo(
    () => ({
        user,
        logout,
    }),
    [user, logout]
);

return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
);
```

Without memoization, a new object may be created on every render.

That can cause context consumers to observe a changed provider value even when the logical contents remain unchanged.

However, memoizing the provider value does not eliminate all context updates. If one dependency changes, the value
changes, and consumers observing that context can update accordingly.

For large contexts, partitioning state and context responsibilities can be more important than memoizing a single large
value.

## Memoization and External APIs

Memoized values can stabilize configuration objects passed to APIs that use identity to determine whether configuration
has changed.

```tsx
const config = useMemo(
    () => ({
        endpoint,
        retryCount,
    }),
    [endpoint, retryCount]
);

useSomeExternalIntegration(config);
```

This does not make the external API itself memoized.

It merely ensures that the configuration reference changes when its relevant inputs change.

The external integration remains responsible for interpreting that identity.

## Memoization Does Not Freeze a Value

A memoized object is not immutable merely because its reference is reused.

```tsx
const settings = useMemo(
    () => ({
        enabled: true,
    }),
    []
);

settings.enabled = false;
```

The object can still be mutated.

Memoization controls reuse of the calculated reference; it does not provide immutability.

Mutating a memoized value can therefore introduce subtle bugs because later renders may reuse the same mutated object.

Treat memoized values as immutable results of a calculation.

## Memoization Does Not Mean Permanent Caching

A `useMemo` value is associated with React's rendering model.

It should not be treated as a permanent application-wide cache.

Do not use `useMemo` as the architecture for:

* server response caching
* resource deduplication
* application-wide data caching
* persistence
* cross-component state
* durable storage
* cache invalidation policies

Those concerns require mechanisms with explicit ownership and lifecycle semantics.

A memoized value is a component-local optimization.

## Memoization and Component Lifetime

A memoized value belongs to the component instance using the Hook.

```tsx
function Component({id}: { id: string }) {
    const value = useMemo(() => calculate(id), [id]);

    return <View value={value}/>;
}
```

If the component instance is replaced, the associated memoized value does not represent a persistent cache entry for the
new instance.

This is another reason not to use `useMemo` as a general resource cache.

Its lifetime follows the component's React lifecycle and rendering architecture.

## Memoization and Strict Mode

Development behavior can cause calculations to be invoked more than once in situations intended to help detect impure
rendering logic.

Therefore, the calculation passed to `useMemo` must be pure.

Avoid:

```tsx
const value = useMemo(() => {
    performSideEffect();
    return calculateValue();
}, []);
```

The calculation should derive and return a value without performing external side effects.

This makes it safe for React to evaluate rendering logic according to its development and concurrent rendering
semantics.

## Memoized Calculations Must Be Pure

A memoized calculation should behave as a pure function of its dependencies.

Good:

```tsx
const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
);
```

Bad:

```tsx
const total = useMemo(() => {
    metrics.increment("total-calculated");
    return calculateTotal(items);
}, [items]);
```

The calculation itself is part of rendering.

External synchronization belongs in the appropriate Effect or event-driven mechanism.

## Memoization and Stale Values

Incorrect dependencies can cause stale results.

```tsx
const result = useMemo(
    () => calculate(items, query),
    [items]
);
```

If `query` changes while `items` remains unchanged, the calculation can reuse a result derived from an older query.

The correct dependency list is:

```tsx
const result = useMemo(
    () => calculate(items, query),
    [items, query]
);
```

Memoization does not protect against stale closures or incorrect dependency declarations.

It makes those mistakes potentially less obvious because an old value can continue to be reused.

## Memoization and Dependency Objects

Sometimes a dependency is itself an object created during rendering.

```tsx
const options = {
    caseSensitive,
    limit,
};

const result = useMemo(
    () => search(items, options),
    [items, options]
);
```

Because `options` is recreated on every render, the memoization can be invalidated every time.

One solution is to memoize the object:

```tsx
const options = useMemo(
    () => ({
        caseSensitive,
        limit,
    }),
    [caseSensitive, limit]
);

const result = useMemo(
    () => search(items, options),
    [items, options]
);
```

Another is to construct the object inside the calculation:

```tsx
const result = useMemo(
    () =>
        search(items, {
            caseSensitive,
            limit,
        }),
    [items, caseSensitive, limit]
);
```

The second form often has a simpler dependency relationship because the object exists only for the calculation.

## Nested Memoization

Avoid memoizing every intermediate value without a concrete reason.

```tsx
const filtered = useMemo(() => filter(items, query), [items, query]);

const sorted = useMemo(() => sort(filtered, order), [filtered]);

const grouped = useMemo(() => group(sorted), [sorted]);
```

This can be valid when each operation is expensive and independently reused.

But unnecessary memoization creates multiple caches and additional dependency relationships.

Sometimes one memoized calculation is clearer:

```tsx
const grouped = useMemo(() => {
    const filtered = filter(items, query);
    const sorted = sort(filtered, order);
    return group(sorted);
}, [items, query, order]);
```

The appropriate structure depends on computational cost, reuse, and readability.

## Memoization and Cache Retention

Memoizing a large value retains the previous result for reuse.

```tsx
const transformed = useMemo(
    () => transform(largeDataset),
    [largeDataset]
);
```

If the result is large, retaining it has a memory cost.

Memoization is therefore a space-for-time tradeoff.

The relevant question is not simply whether recomputation can be avoided, but whether retaining the result is worth the
memory and complexity cost.

## Memoization and Primitive Values

Primitive values generally do not benefit from referential-stability concerns because their equality is value-based.

```tsx
const count = useMemo(
    () => items.length,
    [items]
);
```

This usually provides little value.

Prefer:

```tsx
const count = items.length;
```

Memoization becomes more interesting when the calculation is expensive or the result is a reference value whose identity
matters.

## Memoization and Child Components

Consider:

```tsx
function Parent({items}: Props) {
    const visibleItems = items.filter(item => item.visible);

    return <MemoizedChild items={visibleItems}/>;
}
```

Even when `items` does not change, the `filter` call creates a new array.

A memoized child may therefore receive a different array reference.

If the filtering operation is expensive or the child relies on referential equality, memoization can be appropriate:

```tsx
const visibleItems = useMemo(
    () => items.filter(item => item.visible),
    [items]
);

return <MemoizedChild items={visibleItems}/>;
```

The important point is that `useMemo` is not being used merely because arrays exist. It is being used because the
resulting identity has a downstream consequence.

## Memoization and `Object.is`

React's dependency and memoization behavior relies on equality semantics based on `Object.is` for dependency comparison.

This means values such as `NaN`, `0`, and `-0` follow `Object.is` semantics rather than ordinary `===` semantics.

For ordinary application objects and arrays, the practical implication is that reference identity determines whether the
dependency is considered changed.

```tsx
const value = useMemo(
    () => calculate(input),
    [input]
);
```

A newly created object with equivalent properties is still a different dependency value.

## Memoization and Re-rendering

A memoized value does not prevent its component from rendering.

```tsx
function Component({data, count}: Props) {
    const expensiveValue = useMemo(
        () => expensiveCalculation(data),
        [data]
    );

    return (
        <>
            <Counter count={count}/>
            <Result value={expensiveValue}/>
        </>
    );
}
```

When `count` changes, the component still renders.

`useMemo` only allows the calculation of `expensiveValue` to be reused if `data` remains unchanged.

Preventing component rendering is a separate concern handled by mechanisms such as component memoization.

## Memoization and Concurrent Rendering

React's rendering architecture permits rendering work to be started, interrupted, abandoned, or restarted.

Therefore, code inside a memoized calculation must not rely on the calculation being executed exactly once.

The calculation should be pure and free from externally observable side effects.

Memoization should be understood as a rendering optimization rather than as a guarantee of a particular number of
function invocations.

## Memoization and Server Rendering

Memoized values are local to the rendering environment and component instance.

They should not be treated as a cross-request cache.

A server-rendered component may be rendered in separate requests or rendering contexts, and a `useMemo` value should not
be used as durable server-side shared state.

For server-side resource reuse, request caching, or application-level caching, use mechanisms designed for those
lifetimes.

## Memoization and Server Components

Memoization concepts must be distinguished from server-side resource caching.

A calculation performed during rendering and a cached server resource have different ownership and lifecycle semantics.

Do not use component-local memoization as a replacement for a server resource cache.

Likewise, server-side caching should not be modeled merely as `useMemo` at the component level.

The correct mechanism depends on the lifetime and sharing requirements of the resource.

## Common Misuse

A common misuse is wrapping every calculation in `useMemo`.

```tsx
const name = useMemo(() => user.name, [user]);
const count = useMemo(() => items.length, [items]);
const enabled = useMemo(() => status === "ready", [status]);
```

These calculations are trivial and memoization adds noise.

Another misuse is using `useMemo` to avoid fixing an unstable object dependency.

If an object is recreated unnecessarily, first determine whether the object itself should be stable or whether the
dependency relationship can be simplified.

Another misuse is treating `useMemo` as a cache for data fetched from a server.

Another is performing side effects inside the memoized calculation.

Another is using an empty dependency array merely to make a value "run once."

```tsx
const value = useMemo(() => calculate(props.value), []);
```

This freezes the calculation against future prop changes and is generally incorrect if the calculation depends on those
props.

Another misuse is relying on memoization to guarantee object identity forever. The memoized value is associated with
React's component rendering semantics and should not be treated as a permanent identity guarantee.

## Advantages

Memoized values can substantially reduce repeated expensive computation.

They can preserve reference identity for derived objects and arrays when that identity matters to downstream consumers.

They can support other performance optimizations such as memoized child components and stable context values.

They also allow expensive derivations to remain declarative instead of moving them into Effects or redundant state.

## Disadvantages

Memoization introduces dependency management and additional conceptual complexity.

It can retain potentially large values in memory.

It does not prevent component renders.

It does not automatically improve performance.

Incorrect dependencies can produce stale results.

Overuse can make simple rendering logic harder to understand and maintain.

Memoization can also obscure the distinction between actual application state and derived values if it is used
indiscriminately.

## When to Use

Use memoized values when:

* a calculation is demonstrably expensive
* the inputs frequently remain unchanged across renders
* the calculated result is reused across rendering work
* preserving reference identity has a concrete downstream benefit
* a memoized object or array is consumed by a memoized component
* a context value needs stable identity and its dependencies are well defined
* profiling or architecture indicates that repeated computation is materially costly

## When Not to Use

Do not use memoization merely because:

* a value is derived
* an object is being created
* an array is being created
* a component renders frequently
* `useMemo` exists
* a value "looks important"
* you want to store application state
* you want to perform an operation only once
* you want a persistent cache
* you want to prevent a component from rendering

For cheap calculations, direct derivation is generally clearer.

## Relationship to Other Patterns

Memoized values are distinct from memoized components. `useMemo` caches a calculated value, while `memo` can prevent a
component from rendering when its props remain equivalent.

They are distinct from memoized callbacks. `useCallback` specifically expresses stable function identity, while
`useMemo` primarily expresses cached calculation results.

They are related to referential stability because memoization can preserve the identity of objects and arrays across
renders.

They are related to selector patterns because selectors can produce derived values from state, while memoization can
optimize the computation or identity of those derived results. A selector architecture may have its own cache and
ownership semantics and should not automatically be reduced to `useMemo`.

They are related to local state because memoized values are derived from state rather than being state themselves.

They are related to external stores because derived snapshots or selectors may use memoization to avoid unnecessary
computation, but the store remains responsible for state ownership and subscription semantics.

They are related to Context because memoized provider values can reduce unnecessary identity changes, but context
partitioning remains the more fundamental mechanism for controlling update scope.

They are related to conditional rendering because conditions can consume memoized values, but memoization does not
determine which branch should render.

They are related to server-state and resource caches but are not replacements for them. Component-local memoization does
not provide application-level resource ownership, invalidation, freshness, deduplication, or persistence.

## Design Rules

Treat memoized values as derived values, not state.

Keep memoized calculations pure.

Declare every reactive input required by the calculation.

Do not memoize trivial calculations without a concrete reason.

Use memoization when computational cost or referential identity justifies it.

Do not use `useMemo` as a persistent or application-wide cache.

Do not use memoization to hide redundant state.

Do not rely on memoization for correctness.

Consider both computation cost and memory retention.

When stabilizing an object or array, identify the downstream consumer that benefits from stable identity.

Prefer a simpler dependency structure when equivalent designs are available.

Measure meaningful performance problems rather than assuming memoization is beneficial.

## Summary

A memoized value is a cached result of a render-time computation.

In React, `useMemo` allows a component to reuse a previously calculated value when its dependencies have not changed. It
is useful for expensive calculations and for preserving reference identity when that identity has a meaningful
downstream effect.

Memoization is not state, not an Effect, not a component-render bailout, and not a general-purpose cache.

The correct design is to derive values directly when computation is cheap, introduce memoization when computation or
referential identity makes it worthwhile, keep calculations pure, maintain accurate dependencies, and treat the memoized
result as an optimization whose lifetime follows the component's rendering model.
