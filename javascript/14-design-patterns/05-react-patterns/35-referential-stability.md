# Referential Stability

Referential stability is the property of a value retaining the same object identity across renders when its logical
meaning has not changed.

In JavaScript, objects, arrays, and functions are reference values. Two separately created values can contain identical
data while still having different identities:

```js
const first = {enabled: true};
const second = {enabled: true};

console.log(first === second); // false
```

React and surrounding APIs frequently observe identity rather than performing deep structural comparison. A value whose
identity changes unnecessarily can therefore cause additional rendering, Effect execution, subscription work,
memoization invalidation, or cache misses.

The core rule is:

> Preserve referential identity when consumers use identity as a meaningful change signal. Do not preserve identity
> merely for its own sake.

## Referential Identity

Primitive values are compared by value:

```js
const a = 42;
const b = 42;

console.log(a === b); // true
```

Objects are compared by reference identity:

```js
const a = {};
const b = {};

console.log(a === b); // false
```

The same applies to arrays:

```js
const first = [];
const second = [];

console.log(first === second); // false
```

and functions:

```js
const first = () => {
};
const second = () => {
};

console.log(first === second); // false
```

Creating a new reference therefore constitutes an observable change for identity-sensitive consumers even when the
contained data is equivalent.

## Why Referential Stability Matters in React

React uses identity comparisons in several important places.

Identity can affect:

* component memoization;
* Hook dependency comparison;
* Context value propagation;
* external-store subscriptions;
* selector results;
* derived props;
* Effect execution;
* callback registration;
* cache lookup;
* structural sharing;
* reconciliation-related optimization.

Referential stability is therefore not a React-specific concept. It is a general JavaScript property that becomes
particularly important because React's rendering model uses identity extensively as a change-detection mechanism.

## Stable Primitives

Primitive values are naturally stable when their value does not change:

```tsx
const enabled = true;
const count = 10;
const name = "Alice";
```

Re-rendering the component does not create a new identity in the same sense as creating a new object or function.

This makes primitives useful inputs for identity-sensitive APIs.

For example:

```tsx
const value = useMemo(
    () => createConfiguration(enabled, count),
    [enabled, count]
);
```

The primitive dependencies remain unchanged when their values remain unchanged.

## Unstable Object Creation

Consider:

```tsx
function Component({userId}: { userId: string }) {
    const options = {
        userId,
        enabled: true,
    };

    return <Child options={options}/>;
}
```

Every render creates a new `options` object.

Even when `userId` has not changed:

```text
previous options !== current options
```

A consumer observing object identity sees a change.

This can invalidate memoization or cause dependency-driven work.

## Stable Object Identity

An object can instead be preserved when its meaningful inputs have not changed:

```tsx
const options = useMemo(
    () => ({
        userId,
        enabled: true,
    }),
    [userId]
);
```

Now the object can retain its identity while `userId` remains unchanged.

The important property is not that the object was memoized. The important property is that consumers can rely on its
identity remaining stable under the specified conditions.

## Stability Is a Consumer Contract

Referential stability only matters when some consumer observes identity.

For example:

```tsx
const configuration = {
    enabled: true,
};
```

Creating a new object may be completely harmless if it is consumed only by a function that immediately reads its
properties and does not compare references.

By contrast:

```tsx
<MemoizedComponent configuration={configuration}/>
```

makes identity potentially significant because the receiving component may use prop identity as part of its
render-bailout decision.

The question should therefore be:

> Who observes this identity, and what does a changed identity cause?

Without an identity-sensitive consumer, stability may provide no meaningful benefit.

## Stable Function Identity

Functions are also reference values:

```tsx
function Component() {
    const handleSave = () => {
        save();
    };

    return <Button onSave={handleSave}/>;
}
```

Each render creates a new function object.

A consumer can therefore observe:

```js
previousOnSave !== currentOnSave
```

If the consumer treats function identity as a change signal, unnecessary work can result.

Stable callback identity can be established when needed:

```tsx
const handleSave = useCallback(() => {
    save();
}, [save]);
```

The mechanics of `useCallback` belong to `24-memoization-hooks.md`.

This file concerns the broader design property: whether the callback identity should remain stable and why.

## Stable Array Identity

Arrays have the same behavior:

```tsx
const visibleItems = items.filter(item => item.visible);
```

A new array is created whenever the calculation executes.

Even when the resulting contents are equivalent, the identity differs:

```js
previousVisibleItems !== visibleItems
```

A stable array can matter when it is passed to a memoized component, used as a dependency, or consumed by an
identity-sensitive API.

## Structural Sharing

Structural sharing is one of the most important ways to preserve useful referential stability.

When immutable data is updated, unchanged portions can retain their previous references:

```js
const nextState = {
    ...previousState,
    user: {
        ...previousState.user,
        name: "New Name",
    },
};
```

The root object changes because the state changed.

The modified `user` object changes because its contents changed.

Unrelated nested values can retain their existing references.

This allows consumers to determine that some parts of the structure did not change without performing deep comparisons.

## Structural Sharing and Selectors

Suppose state contains:

```js
const state = {
    user,
    settings,
    notifications,
};
```

An update to `notifications` does not necessarily require `user` or `settings` to receive new references.

A selector can then observe:

```tsx
const user = useStore(state => state.user);
```

If the `user` reference remains unchanged, an identity-sensitive selector mechanism can determine that the selected
value did not change.

Referential stability and selectors therefore work together.

The selector determines what is observed.

Structural sharing helps preserve the identity of values that did not change.

## Referential Stability and Immutability

Mutation can destroy the usefulness of reference identity as a change signal.

For example:

```js
state.user.name = "Alice";
```

The `user` reference remains the same even though its contents changed.

An identity-based consumer may therefore incorrectly conclude that nothing changed.

Immutable updates instead create a new reference for changed data:

```js
const nextUser = {
    ...state.user,
    name: "Alice",
};
```

Reference identity can then correspond more reliably to semantic change.

Referential stability therefore depends on disciplined data updates.

## Identity as a Change Signal

A useful model is:

```text
same reference
```

can communicate:

```text
this value has not changed
```

while:

```text
new reference
```

can communicate:

```text
this value may have changed
```

The second statement is deliberately weaker.

A new reference does not prove that the contents are meaningfully different:

```js
const first = {enabled: true};
const second = {enabled: true};
```

The references differ, but the values are structurally equivalent.

Identity-based systems generally use reference changes as an efficient signal rather than attempting to establish
semantic equality.

## Referential Stability Is Not Deep Equality

Consider:

```js
const first = {
    enabled: true,
};

const second = {
    enabled: true,
};
```

Deep comparison might conclude that they contain equivalent data.

Reference comparison concludes:

```js
first !== second
```

React generally does not perform arbitrary deep comparisons of application objects.

This is intentional.

Deep comparison can be expensive, unpredictable, and difficult to reason about for large object graphs.

Stable identity and structural sharing provide a cheaper change-detection strategy.

## Referential Stability and Component Memoization

A memoized component can use prop identity as part of its decision to skip rendering:

```tsx
const List = memo(function List({
                                    items,
                                }: {
    items: Item[];
}) {
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
});
```

If the parent recreates `items` unnecessarily:

```tsx
const visibleItems = items.filter(item => item.visible);

<List items={visibleItems}/>
```

the child receives a new array reference.

If the parent instead preserves the derived array when its inputs are unchanged, the memoized component can potentially
avoid unnecessary work.

The component memoization mechanism belongs to `23-memoized-components.md`.

Referential stability explains why stable props make that mechanism effective.

## Referential Stability and Effect Dependencies

Effect dependencies are identity-sensitive:

```tsx
useEffect(() => {
    connect(options);
}, [options]);
```

If `options` is recreated on every render:

```tsx
const options = {
    endpoint,
    mode,
};
```

the Effect can observe a changed dependency on every render.

This can cause repeated setup and cleanup.

Stable identity can prevent that when the logical options have not changed.

However, stability should not be used to hide actual dependencies. If `endpoint` or `mode` changes, the resulting
dependency should change accordingly.

## Referential Stability and Context

Context values are another important identity boundary.

Consider:

```tsx
<ThemeContext.Provider
    value={{
        theme,
        setTheme,
    }}
>
    {children}
</ThemeContext.Provider>
```

A new object is created whenever the provider renders.

Consumers can therefore receive a new Context value identity even when the contained values have not changed.

A stable value can be constructed:

```tsx
const contextValue = useMemo(
    () => ({
        theme,
        setTheme,
    }),
    [theme, setTheme]
);
```

The broader architectural question remains separate.

If unrelated values are combined into one Context, stabilizing the object does not create independent subscription
boundaries.

Context partitioning addresses that problem.

## Referential Stability and Context Partitioning

Suppose one Context contains:

```tsx
{
    user,
        theme,
        notifications
}
```

Memoizing the object preserves its identity until any dependency changes.

If `notifications` changes, the complete Context value changes.

Consumers concerned only with `theme` can still be invalidated by that Context update.

Partitioning the Context changes the dependency boundary:

```tsx
<UserContext.Provider value={user}>
    <ThemeContext.Provider value={theme}>
        <NotificationContext.Provider value={notifications}>
            {children}
        </NotificationContext.Provider>
</UserContext.Provider>
</UserContext.Provider>
```

Referential stability optimizes identity within a boundary.

Context partitioning determines the boundary itself.

## Referential Stability and External Stores

External stores frequently rely on identity to determine whether a subscribed value has changed.

For example:

```tsx
const user = useStore(state => state.user);
```

If the store preserves `state.user` when unrelated state changes, the selected value can remain referentially stable.

If every update reconstructs the entire object graph unnecessarily, subscribers may observe changes that do not
represent meaningful changes to their selected data.

This makes structural sharing an important part of external-store design.

## Referential Stability and Selectors

A selector can return a primitive:

```tsx
const name = useStore(state => state.user.name);
```

or an object:

```tsx
const user = useStore(state => state.user);
```

The primitive naturally provides value-based stability.

The object requires the producer to preserve its reference when its contents remain unchanged.

Selectors therefore often depend on referential stability in the data they return.

## Derived Objects

Derived objects are a common source of accidental instability.

Consider:

```tsx
const result = {
    total,
    count,
};
```

If this object is recreated every render, any consumer observing its identity sees a change.

There are several possible solutions:

```tsx
const result = useMemo(
    () => ({
        total,
        count,
    }),
    [total, count]
);
```

or passing the primitive values independently:

```tsx
<Summary
    total={total}
    count={count}
/>
```

The second design can sometimes be better because it removes the object identity problem entirely.

Referential stability is therefore not always solved by memoizing the reference. Sometimes the better API is to avoid
the aggregate reference.

## Narrow APIs

Passing the smallest meaningful values often reduces identity problems.

Instead of:

```tsx
<Profile user={user}/>
```

a component may only need:

```tsx
<Profile
    name={user.name}
    avatarUrl={user.avatarUrl}
/>
```

This makes the dependency boundary explicit.

It also prevents unrelated changes to the `user` object from necessarily becoming relevant to the component.

Referential stability and narrow component interfaces therefore reinforce each other.

## Stable Values Through Ownership

State ownership can naturally produce stable references.

If a component owns an object in state:

```tsx
const [settings, setSettings] = useState(initialSettings);
```

the same object reference can persist across renders until the state is replaced.

This is different from reconstructing an equivalent object during every render:

```tsx
const settings = {
    enabled,
    mode,
};
```

The first represents retained state.

The second represents a derived value.

Referential stability should therefore be considered together with the distinction between state and derived data.

## Referential Stability and State Colocation

State colocation can reduce the importance of referential stability.

If a frequently changing value is moved into the component subtree that actually needs it, unrelated ancestors may stop
rendering because of that state change.

This can eliminate an entire class of unnecessary identity churn.

Therefore, before introducing extensive memoization or identity management, examine whether the state is owned at the
correct boundary.

## Referential Stability and State Lifting

When state is lifted to a common ancestor, changes to that state can cause a broader subtree to render.

Stable props can then become more valuable because memoized descendants may be able to avoid work when their relevant
inputs remain unchanged.

State lifting determines ownership.

Referential stability determines whether unchanged downstream values continue to look unchanged.

These are separate concerns.

## Referential Stability and Component Identity

Stable references do not determine whether React preserves a component instance.

Component identity is affected by factors such as:

* element type;
* position;
* keys;
* reconciliation structure.

A stable callback does not preserve a component instance.

A stable object does not preserve component state.

A new key can cause a component to be recreated even when its props are referentially stable.

Component identity therefore has its own architectural role.

## Referential Stability and Keys

Keys identify component instances within collections.

For example:

```tsx
items.map(item => (
    <Row
        key={item.id}
        item={item}
    />
))
```

The key determines whether React can associate the current element with a previous component instance.

The `item` reference determines whether the component receives a changed prop value.

These mechanisms should not be conflated.

Stable keys preserve instance identity.

Stable references can reduce unnecessary work within an existing instance.

## Referential Stability and JSX Values

JSX expressions produce React element objects.

For example:

```tsx
const child = <Child/>;
```

Creating equivalent JSX again can produce a different element object.

In most situations, this does not need manual stabilization.

Memoizing JSX merely to preserve its identity is generally unnecessary unless a specific consumer or rendering structure
makes that identity relevant.

Referential stability should therefore be applied selectively rather than to every object created during rendering.

## Referential Stability and Children

Consider:

```tsx
<Wrapper>
    <Child/>
</Wrapper>
```

The child element is newly produced as part of rendering.

Trying to stabilize every `children` value can create more complexity than it removes.

The meaningful question is whether the receiving component actually observes the identity of `children` and whether
preserving it prevents measurable work.

Not every new reference is a performance problem.

## Referential Stability and Event Handlers

An event handler may be recreated on every render:

```tsx
<button onClick={() => save(id)}>
    Save
</button>
```

This is not inherently incorrect or inefficient.

The identity becomes relevant when the function is passed through an identity-sensitive boundary.

For example:

```tsx
const Button = memo(function Button({
                                        onSave,
                                    }: {
    onSave: () => void;
}) {
    return <button onClick={onSave}>Save</button>;
});
```

In this case, callback identity can affect whether the child can reuse its previous render.

The presence of a function reference alone is not sufficient justification for stabilizing it.

## Referential Stability and Event Systems

Some external APIs explicitly use function identity for registration:

```js
target.addEventListener("click", handler);
target.removeEventListener("click", handler);
```

The same function reference is required for removal.

In such systems, identity is not merely an optimization. It is part of correctness.

This distinction is important.

Some consumers observe identity for performance.

Others observe identity as part of their API contract.

## Referential Stability and Subscription APIs

The same principle applies to subscriptions:

```js
subscribe(listener);
unsubscribe(listener);
```

If a listener is recreated unnecessarily, an external system may treat it as a different subscription.

A stable callback can therefore be required for correct lifecycle management.

The identity requirement comes from the consumer's contract rather than from React itself.

## Referential Stability and Caches

Caches often use identity or serialized keys to determine whether two requests or resources refer to the same entry.

For object-based keys:

```js
cache.get(options);
```

these are different keys:

```js
cache.get({userId: "1"});
cache.get({userId: "1"});
```

because the objects have different identities.

A resource cache generally requires a deliberate resource-identity strategy rather than relying accidentally on object
identity.

Referential stability can help when an API intentionally uses reference identity as its key, but resource caches should
generally define stable logical keys explicitly.

## Referential Stability and Server State

Server-state systems frequently represent remote resources through stable query or resource identities.

A changing object used as a query descriptor can accidentally create unnecessary identity changes.

A stable representation of query identity can improve reuse and prevent unnecessary invalidation.

However, referential stability is not equivalent to server-state management.

Server-state concerns include:

* synchronization;
* freshness;
* invalidation;
* refetching;
* mutation reconciliation;
* optimistic updates;
* background updates.

Referential stability only concerns identity.

## Referential Stability and Resource Caches

Resource caches need stable resource identity.

For example, the conceptual resource:

```text
user:42
```

should continue to identify the same resource regardless of which component requests it.

That is different from component-local object identity.

A component can be recreated while the cached resource remains the same.

Resource identity therefore generally needs a broader scope than component identity.

## Memoization Is a Mechanism

`useMemo` and `useCallback` are mechanisms for preserving identity.

They are not the definition of referential stability.

Other mechanisms can provide stable references:

* state retention;
* props;
* immutable state updates;
* structural sharing;
* external stores;
* caches;
* module-level constants;
* stable object ownership;
* stable API objects.

This distinction prevents the concept from collapsing into a discussion of two specific Hooks.

## Module-Level Constants

Values that never depend on component state can often be defined outside the component:

```tsx
const defaultOptions = {
    enabled: true,
    mode: "compact",
};

function Component() {
    return <Child options={defaultOptions}/>;
}
```

The same object can then be reused by every component instance.

This can provide stronger stability than component-local memoization when shared immutable data is actually intended.

The object must not be mutated.

## Stable Factory Results

Factories can intentionally produce stable values when ownership requires it.

For example:

```js
function createConfiguration() {
    return Object.freeze({
        mode: "compact",
    });
}

const configuration = createConfiguration();
```

The value can then be reused wherever that immutable configuration is appropriate.

Referential stability can therefore be established by architecture rather than by React Hooks.

## Avoiding Accidental Instability

Common sources of unnecessary identity changes include:

```tsx
const options = {...};
```

```tsx
const items = [...source];
```

```tsx
const filtered = source.filter(...);
```

```tsx
const callback = () => {
};
```

```tsx
const value = {
    state,
    dispatch,
};
```

None of these operations is inherently wrong.

They become problematic when the resulting identity is observed by a consumer for which identity changes cause
meaningful work.

## Avoiding Artificial Stability

The opposite problem also exists.

Code can become unnecessarily complicated when every value is aggressively stabilized:

```tsx
const a = useMemo(...);
const b = useMemo(...);
const c = useMemo(...);

const onA = useCallback(...);
const onB = useCallback(...);
const onC = useCallback(...);
```

If no identity-sensitive consumer benefits from these references, the additional machinery has no meaningful purpose.

Stable identity is not inherently better than unstable identity.

The correct identity policy depends on the consumer.

## Stability Versus Freshness

Stable identity and current data are separate properties.

A value can have stable identity because its contents have not changed.

A callback can have stable identity while correctly capturing the values it depends on.

An incorrectly memoized callback can also have stable identity while containing stale data.

Therefore:

```text
stable identity
```

must never be treated as equivalent to:

```text
current value
```

Correct dependency modeling remains necessary.

## Stability Versus Equality

Referential stability means:

```js
previous === current
```

Equality of contents means something stronger and potentially more expensive.

Two references can be different while representing equivalent data.

Two references can be identical while mutable contents have changed.

This is why immutable data and disciplined ownership are important when identity is used as a change signal.

## Testing Referential Stability

Tests can explicitly verify identity when identity is part of an API contract:

```tsx
const first = renderHook(() => useConfiguration());

const firstValue = first.result.current;

first.rerender();

const secondValue = first.result.current;

expect(secondValue).toBe(firstValue);
```

Such tests should only be added when stable identity is intentionally part of the contract.

Testing every reference for stability can over-constrain implementation details and prevent legitimate refactoring.

## Performance Measurement

Referential stability should ultimately be evaluated through observable consequences.

Useful questions include:

* Did a memoized component stop rendering unnecessarily?
* Did an Effect stop repeatedly reconnecting?
* Did a subscription stop being recreated?
* Did a selector stop producing unnecessary updates?
* Did an expensive calculation stop repeating?
* Did a cache reuse an existing resource?
* Did memory usage remain acceptable?

The existence of stable references is not itself a performance metric.

## Common Misuse

A common mistake is assuming every object should be memoized.

Another is assuming every callback should use `useCallback`.

Another is using deep comparison everywhere to compensate for unstable references.

Another is mutating objects while relying on reference equality to detect changes.

Another is stabilizing a Context value while leaving an overly broad Context boundary intact.

Another is using memoization to compensate for incorrectly colocated state.

Another is confusing stable component identity with stable value identity.

Another is using object identity as a cache key when the intended identity is actually a logical resource key.

Another is treating stable identity as a guarantee that a value is immutable.

Identity stability and immutability are related but distinct properties.

## Advantages

Referential stability enables efficient identity-based change detection.

It supports component memoization.

It can reduce unnecessary Effect setup and cleanup.

It can reduce subscription churn.

It works naturally with structural sharing and immutable updates.

It allows selectors and external stores to distinguish changed and unchanged portions of state efficiently.

It can improve cache reuse when identity is intentionally part of the cache contract.

It can make API contracts explicit when stable callback or value identity is required.

## Disadvantages

Maintaining stable identity can add implementation complexity.

Over-memoization can make ordinary code harder to understand.

Incorrect stabilization can produce stale values or stale closures.

Reference equality can produce false positives when equivalent objects are recreated.

Mutation can produce false negatives when changed data retains the same reference.

Identity-sensitive designs can also become overly coupled to implementation details when stability is exposed as an
unnecessary contract.

## When to Use

Design for referential stability when:

* a consumer explicitly compares references;
* a memoized component benefits from stable props;
* an Effect depends on an object or function identity;
* an external API requires stable listener identity;
* a subscription API uses callback identity;
* a selector benefits from structural sharing;
* an external store uses reference equality to detect changes;
* a Context value needs stable identity;
* a cache deliberately uses reference identity;
* stable identity is part of a reusable API contract.

## When Not to Use

Do not stabilize every object or function automatically.

Do not introduce memoization solely because a value is a reference.

Do not use deep comparison as a universal replacement for good identity design.

Do not mutate data while expecting reference equality to detect changes.

Do not expose stable identity as an API guarantee unless consumers actually need it.

Do not use referential stability to compensate for incorrect state ownership.

Do not confuse stable identity with immutable contents.

Do not confuse stable identity with component instance preservation.

## Relationships

`24-memoization-hooks.md` covers the React mechanisms used to preserve memoized values and callback identities. This
file covers the broader concept and its consequences.

`23-memoized-components.md` uses prop identity as part of component-level render optimization. Referential stability
explains why stable props can make that optimization effective.

`13-state-colocation.md` can reduce the need for identity optimization by keeping frequently changing state close to the
components that consume it.

`14-state-lifting.md` can broaden the rendering scope and make stable downstream values more valuable.

`15-controlled-components.md` concerns ownership of component state. Referential stability concerns the identity of
values crossing the resulting boundaries.

`10-context-provider.md` distributes values. Referential stability can prevent a provider from producing a new value
identity unnecessarily.

`12-context-partitioning.md` determines independent Context boundaries. Referential stability optimizes identity within
those boundaries.

`06-custom-hooks.md` provides reusable behavior. A custom Hook may expose stable values or callbacks when identity is
part of its consumer contract.

`25-external-store.md` concerns externally owned state and subscriptions. Referential stability and structural sharing
can reduce unnecessary subscriber updates.

`26-selector-pattern.md` determines which portion of state a consumer observes. Referential stability allows unchanged
selected values to remain unchanged by identity.

`17-data-fetching.md` concerns acquiring asynchronous data. Referential stability may affect request descriptors or
dependencies but does not perform fetching.

`18-resource-cache.md` concerns stable resource identity, reuse, invalidation, and lifetime. Referential stability is
one mechanism that can participate in cache behavior but is not itself a cache.

`19-server-state.md` concerns synchronization with remote authoritative state. Referential stability can optimize local
representations but does not provide synchronization.

`44-stable-keys.md` concerns identity of component instances in collections. Referential stability concerns identity of
values.

`45-component-identity.md` concerns preservation and recreation of component instances. Stable references do not
determine component identity.

## Summary

Referential stability means preserving the identity of a value when its logical meaning has not changed.

It matters because React and JavaScript APIs frequently use identity as an efficient change signal.

Stable identity can reduce:

* unnecessary component rendering;
* Effect execution;
* subscription churn;
* selector updates;
* cache misses;
* derived-value invalidation.

The most reliable foundation for referential stability is not indiscriminate memoization. It is appropriate ownership,
immutable updates, structural sharing, narrow APIs, explicit dependency boundaries, and deliberate identity contracts.

`useMemo` and `useCallback` are mechanisms for establishing stability when required. They are not the concept itself.

The core rule is:

> Preserve identity when identity has a meaningful consumer. Otherwise, prefer the simplest correct implementation.
