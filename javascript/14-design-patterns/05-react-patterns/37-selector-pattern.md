# Selector Pattern

The Selector Pattern is a state-consumption pattern in which a consumer reads a specific projection of a larger state
source rather than consuming the entire state.

A selector maps state to the value a consumer actually needs:

```tsx
const value = useStore(state => state.user.name);
```

The store may contain substantially more state:

```js
{
    user,
        settings,
        notifications,
        orders,
        products,
}
```

The component only depends on:

```text
user.name
```

The selector therefore establishes a narrower dependency boundary between the state source and the consumer.

The core rule is:

> Select the smallest meaningful portion of state required by the consumer, and preserve or define equality semantics so
> unrelated state changes do not appear as relevant changes.

## Intent

Reduce unnecessary state consumption by allowing a component or other consumer to observe a projection of a larger state
model.

A selector can:

* narrow the state a component observes;
* derive a specific value;
* prevent unrelated state changes from affecting a consumer;
* encapsulate state-access logic;
* create reusable domain-level views;
* work with external stores;
* support normalized state;
* provide a stable interface over changing internal state structure.

The selector itself does not own the state.

It defines what a consumer observes.

## Basic Selector

A selector is fundamentally a function:

```js
const selectUserName = state => state.user.name;
```

A consumer applies it:

```js
const userName = useStore(selectUserName);
```

The state source remains responsible for storing and updating state.

The selector determines which value is relevant to the consumer.

## Selecting a Primitive

The simplest selectors return primitive values:

```js
const selectUserId = state => state.user.id;
```

```js
const selectTheme = state => state.settings.theme;
```

```js
const selectUnreadCount = state => state.notifications.unreadCount;
```

Primitive values are particularly straightforward because their equality semantics are simple.

If `user.id` does not change, the selected value does not change.

## Selecting an Object

A selector can return an object:

```js
const selectUser = state => state.user;
```

This is effective when the state model preserves the identity of `state.user` when the user has not changed.

Structural sharing therefore makes selectors more efficient.

If unrelated state changes:

```js
state.notifications
```

but:

```js
state.user
```

retains its reference, the selected value remains stable.

## Selecting an Array

Selectors can return arrays:

```js
const selectTodos = state => state.todos;
```

Again, stable references are important.

If an unrelated portion of state changes while `state.todos` retains its existing reference, a consumer can determine
that the selected value has not changed.

If the store recreates the array unnecessarily, the selector observes a new reference even when its logical contents are
unchanged.

## Selector as a Projection

A selector can be understood as a projection:

```text
state
→ relevant value
```

For example:

```js
const selectCartTotal = state => state.cart.total;
```

The selector hides irrelevant state from the consumer.

This is valuable both for performance and for architectural decoupling.

A component does not need to know the complete structure of the store merely to obtain one value.

## Selector Dependency Boundary

Suppose a store contains:

```js
{
    user,
        cart,
        notifications,
        settings,
}
```

A component that reads the entire state:

```js
const state = useStore(state => state);
```

implicitly depends on everything.

A component that reads:

```js
const cartTotal = useStore(
    state => state.cart.total
);
```

depends only on the selected value.

The selector therefore narrows the dependency boundary.

## Whole-State Consumption

This is generally the opposite of selective subscription:

```js
const state = useStore(state => state);
```

Any relevant state replacement can cause the selected value to appear changed.

Whole-state consumption can be appropriate for components that genuinely need the complete state.

It becomes problematic when used merely because it is convenient.

## Narrow Selection

Prefer:

```js
const userName = useStore(
    state => state.user.name
);
```

over:

```js
const user = useStore(
    state => state.user
);

const userName = user.name;
```

when the component only needs the name and the store's subscription mechanism can efficiently select the primitive.

The second version observes the entire `user` object.

The first expresses the narrower dependency directly.

## Selector Composition

Selectors can be composed:

```js
const selectUser = state => state.user;

const selectUserName = state =>
    selectUser(state).name;
```

This allows domain-level selectors to be reused:

```js
const selectUserId = state =>
    selectUser(state).id;
```

Composition can keep state-access logic centralized without forcing consumers to understand the complete state
structure.

## Reusable Selectors

Selectors can be defined outside components:

```js
export const selectCurrentUser = state =>
    state.session.user;

export const selectCurrentUserId = state =>
    state.session.user?.id;
```

Consumers can then use them consistently:

```tsx
const userId = useStore(selectCurrentUserId);
```

This can provide:

* reuse;
* testability;
* consistent state access;
* reduced knowledge of store internals;
* easier state-model refactoring.

## Parameterized Selectors

Selectors can accept parameters:

```js
const selectTodoById = (state, id) =>
    state.todosById[id];
```

A component can provide the identifier:

```tsx
const todo = useStore(
    state => selectTodoById(state, todoId)
);
```

The parameter becomes part of the selector's logical dependency.

Parameterized selectors are particularly useful with normalized state.

## Selector Factories

When a parameterized selector has its own memoization state, a selector factory can create a selector instance:

```js
function createSelectTodoById(id) {
    return state => state.todosById[id];
}
```

The component can retain the selector instance:

```tsx
const selectTodo = useMemo(
    () => createSelectTodoById(todoId),
    [todoId]
);
```

The selector factory creates a selector specialized for one consumer or parameter set.

The memoization mechanism remains separate from the selector concept.

## Selector Equality

Selecting a value is only half of the problem.

The consumer also needs a way to determine whether the selected result changed.

For primitive values:

```js
state => state.user.id
```

ordinary equality is generally sufficient.

For objects:

```js
state => state.user
```

reference equality can be effective when structural sharing is maintained.

For newly created objects:

```js
state => ({
    name: state.user.name,
    email: state.user.email,
})
```

reference equality will report a new value whenever the selector executes.

An explicit equality strategy may therefore be required.

## Equality Function

Some external-store abstractions allow an equality function:

```js
const selected = useStore(
    selectUserSummary,
    areUserSummariesEqual
);
```

The selector determines the result.

The equality function determines whether the previous and current results should be considered equivalent.

These are separate responsibilities.

## Reference Equality

The simplest equality strategy is reference equality:

```js
previous === current
```

This is fast and predictable.

It works especially well with immutable state and structural sharing.

It does not detect structural equivalence between different objects.

## Shallow Equality

Shallow equality compares an object's immediate properties:

```js
{
    name: "Alice",
        age
:
    30,
}
```

against:

```js
{
    name: "Alice",
        age
:
    30,
}
```

A shallow comparison can determine that their immediate values are equivalent even though the objects themselves are
different references.

This can be useful for selectors returning small composite objects.

However, shallow equality is still an additional comparison cost.

## Deep Equality

Deep equality recursively compares object contents.

For example:

```js
{
    user: {
        name: "Alice",
            preferences
    :
        {
            theme: "dark",
        }
    ,
    }
,
}
```

can be compared recursively.

Deep equality can be expensive for large or deeply nested values.

It can also obscure the underlying state-update problem if used merely to compensate for unnecessary object creation.

Structural sharing and narrow selectors are generally preferable when they can solve the same problem more directly.

## Selector Result Stability

Consider:

```js
const selectSummary = state => ({
    name: state.user.name,
    email: state.user.email,
});
```

Every execution creates a new object.

Even when neither property changed:

```text
previous result !== current result
```

The selector is therefore referentially unstable.

A memoized selector can preserve its result when its inputs remain unchanged.

The exact memoization strategy depends on the state library and usage model.

## Memoized Selectors

A memoized selector can cache a derived result:

```js
const selectVisibleTodos = createSelector(
    [selectTodos, selectFilter],
    (todos, filter) =>
        todos.filter(todo => matchesFilter(todo, filter))
);
```

When the selector inputs remain unchanged, the previous result can be reused.

This is particularly useful for expensive derived data.

Memoized selectors therefore combine two concepts:

* selective state consumption;
* memoized derivation.

They should not be confused with React's `useMemo`.

## Selector Memoization Versus useMemo

`useMemo` is component-instance-local memoization:

```tsx
const visibleTodos = useMemo(
    () => todos.filter(todo => todo.visible),
    [todos]
);
```

A memoized selector can be shared or scoped according to the selector implementation:

```js
const selectVisibleTodos = createSelector(
    [selectTodos],
    todos => todos.filter(todo => todo.visible)
);
```

The scope and lifetime are different.

`useMemo` is tied to a React component's rendering lifecycle.

Selector memoization belongs to the state-consumption layer.

## Selector Memoization Versus Resource Caching

A selector cache stores derived state calculations.

A resource cache stores reusable asynchronous resources.

For example:

```js
selectVisibleTodos(state)
```

produces derived application data.

A resource cache might store:

```text
users:42
```

along with its asynchronous lifecycle.

These are different cache domains.

Selector memoization does not provide request deduplication, freshness, invalidation, or asynchronous resource
ownership.

## Derived State

Selectors are a natural place to derive values:

```js
const selectCompletedCount = state =>
    state.todos.filter(todo => todo.completed).length;
```

The underlying state remains:

```js
state.todos
```

The selector produces:

```js
completedCount
```

Derived data should generally remain derived when it can be calculated reliably from authoritative state.

Storing the same derived value separately can introduce synchronization problems.

## Avoiding Redundant State

Consider:

```js
{
    todos,
        completedCount,
}
```

If `completedCount` is completely determined by `todos`, maintaining both values introduces two representations of the
same fact.

A selector can instead derive it:

```js
const selectCompletedCount = state =>
    state.todos.filter(todo => todo.completed).length;
```

This establishes one authoritative source.

Memoization can then be introduced if the calculation is sufficiently expensive.

## Selector and State Ownership

A selector does not change who owns state.

If an external store owns:

```js
state.todos
```

then:

```js
const selectTodos = state => state.todos;
```

does not transfer ownership to the component.

The component only receives a projection.

This distinction is important because selectors are consumers, not state containers.

## Selector and State Colocation

Selectors are generally associated with larger shared state models.

If a value belongs naturally to one component:

```tsx
const [query, setQuery] = useState("");
```

a selector is unnecessary.

State colocation is usually simpler when the state does not need external ownership.

Selectors become valuable when consumers need controlled access to a broader state source.

## Selector and State Lifting

State lifting moves state ownership to a common React ancestor.

A selector does not move ownership.

For example:

```tsx
const value = useStore(
    state => state.editor.selection
);
```

only determines what the consumer reads.

The external store remains the owner.

## Selector and Context

Context consumers generally receive the Context value associated with the provider.

A selector pattern can provide more selective consumption when the underlying state source supports it.

For example, instead of consuming:

```tsx
const state = useContext(AppContext);
```

and reading:

```tsx
state.user.name
```

a store-backed architecture can expose:

```tsx
const name = useAppStore(
    state => state.user.name
);
```

The selector creates a more precise dependency boundary.

Context and selectors can also coexist, with Context providing access to a store instance and the selector determining
the consumed slice.

## Selector and Context Partitioning

Context partitioning separates state into different Context values:

```tsx
<UserContext.Provider value={user}>
    <ThemeContext.Provider value={theme}>
        {children}
    </ThemeContext.Provider>
</UserContext.Provider>
```

Selectors instead provide selective reads from a shared state source:

```tsx
const theme = useStore(state => state.theme);
```

Partitioning changes the provider/subscription boundary.

Selection changes the consumer's projection.

Both can reduce unnecessary propagation, but at different architectural levels.

## Selector and External Store

Selectors are especially useful with external stores.

The external store answers:

> What state exists, and how can consumers subscribe to it?

The selector answers:

> Which part of that state does this consumer need?

The two patterns therefore complement each other.

An external store without selectors can still be valid.

Selectors become valuable when consumers need independent views of a larger state source.

## Selector and Referential Stability

Selector design depends heavily on referential stability.

This selector:

```js
state => state.user
```

can be stable if `state.user` retains its reference when unchanged.

This selector:

```js
state => ({
    name: state.user.name,
})
```

is unstable if it creates a new object every time.

`25-referential-stability.md` covers the broader identity concept.

The selector pattern applies that concept to state projections.

## Selector and Structural Sharing

Structural sharing allows selectors to cheaply identify unchanged branches:

```js
const nextState = {
    ...previousState,
    notifications: nextNotifications,
};
```

If `user` is unchanged:

```js
nextState.user === previousState.user
```

A selector for `user` can therefore continue returning the same reference.

Structural sharing is one of the main foundations for efficient selector-based state consumption.

## Normalized State

Selectors become particularly useful with normalized state:

```js
{
    usersById: {
        "1"
    :
        user1,
            "2"
    :
        user2,
    }
,
    postsById: {
        "10"
    :
        post10,
    }
,
}
```

A selector can target one entity:

```js
const selectUserById = (state, id) =>
    state.usersById[id];
```

A component does not need to consume the entire entity collection.

When one user changes, other users can retain their references.

This can produce highly targeted updates.

## Entity Selectors

A normalized store commonly exposes selectors such as:

```js
const selectUserById = (state, id) =>
    state.usersById[id];

const selectPostById = (state, id) =>
    state.postsById[id];
```

This creates a clear state-access API.

The underlying representation can later change without requiring every consumer to understand the storage structure.

## Selector Composition Over Store Structure

Prefer:

```js
const selectCurrentUserId = state =>
    state.session.userId;
```

over exposing the complete storage layout throughout the application:

```tsx
const userId = useStore(
    state => state.session.userId
);
```

The difference becomes important when the state structure changes.

If consumers use domain selectors:

```tsx
const userId = useStore(selectCurrentUserId);
```

the internal state representation can change without rewriting every consumer.

Selectors can therefore act as a state-access abstraction.

## Selector API Design

Selectors should usually have names that describe the value they return:

```js
selectCurrentUser
selectCurrentUserId
selectCartTotal
selectVisibleTodos
selectUnreadNotifications
```

Avoid selectors whose names expose unnecessary storage details:

```js
selectSessionObjectField
selectInternalArrayIndex
```

A good selector describes domain meaning rather than implementation structure.

## Selector Granularity

A selector can be too broad:

```js
state => state
```

or:

```js
state => state.user
```

when only:

```js
state.user.name
```

is required.

It can also be too granular.

For example, selecting ten individual fields separately may create unnecessary selector complexity when the consumer
genuinely needs them as one coherent domain object.

The correct granularity follows the consumer's actual dependency.

## Selecting Multiple Values

A component may need multiple values:

```tsx
const user = useStore(state => state.user);
const theme = useStore(state => state.theme);
```

This provides two independent selections.

Alternatively, a selector can return a composite object:

```tsx
const view = useStore(state => ({
    user: state.user,
    theme: state.theme,
}));
```

The latter requires an appropriate equality strategy if the selector creates a new object.

The choice should follow the state library's subscription semantics and the component's actual needs.

## Coherent Multi-Value Selection

Sometimes several values must be observed as one logical snapshot:

```js
{
    startDate,
        endDate,
}
```

A composite selector can communicate that relationship.

The advantage is that the consumer receives one coherent derived value.

The disadvantage is that a new object may be produced on each evaluation.

Memoization or equality handling may therefore be appropriate.

## Selector Purity

Selectors should normally be pure:

```js
const selectTotal = state =>
    state.items.reduce(
        (total, item) => total + item.price,
        0
    );
```

A selector should not modify the store.

It should not perform network requests.

It should not mutate selected objects.

It should describe a projection from state to a result.

## Selector Side Effects

This is inappropriate:

```js
const selectUser = state => {
    analytics.track("user-selected");
    return state.user;
};
```

Selectors can be evaluated more frequently than a developer expects.

Side effects make evaluation order and frequency significant and can produce incorrect behavior.

Side effects belong in the appropriate event or Effect lifecycle, not in state selection.

## Selector Error Handling

A selector can fail if its assumptions about state are invalid:

```js
const selectName = state =>
    state.user.name;
```

If `user` can legitimately be absent, the selector should represent that state:

```js
const selectName = state =>
    state.user?.name ?? null;
```

Selectors should reflect the actual state domain rather than relying on impossible-state assumptions.

## Selector and Server State

Selectors can provide views over server-state data:

```js
const selectActiveUsers = state =>
    state.users.filter(user => user.active);
```

The selector does not own the remote data.

The server-state layer remains responsible for:

* fetching;
* freshness;
* synchronization;
* invalidation;
* mutation reconciliation;
* background updates.

The selector only derives the consumer's view.

## Selector and Resource Cache

A selector can read from cached resources:

```js
const selectUser = state =>
    state.resources.users["42"];
```

The selector does not determine:

* cache lifetime;
* freshness;
* eviction;
* invalidation;
* request deduplication.

Those remain cache concerns.

## Selector and Memoized Components

A selector can reduce the props or state consumed by a component:

```tsx
const name = useStore(state => state.user.name);

return <MemoizedUserName name={name}/>;
```

If the selected primitive does not change, the component's relevant input remains stable.

The selector therefore complements component memoization.

Component memoization remains a separate concern.

## Selector and Memoization Hooks

A selector itself may be memoized:

```tsx
const selectVisibleItems = useMemo(
    () => createVisibleItemsSelector(filter),
    [filter]
);
```

But this is only useful when selector identity or selector-local memoization requires it.

The selector pattern does not imply that selectors must be memoized.

## Selector and Effects

A selector can narrow an Effect's dependency:

```tsx
const userId = useStore(
    state => state.user.id
);

useEffect(() => {
    loadPreferences(userId);
}, [userId]);
```

The Effect depends on the specific value it needs rather than the entire store state.

This can prevent unrelated store changes from affecting the Effect.

The selector does not replace the Effect.

It narrows the data relationship.

## Selector and Subscription Frequency

A selector can reduce how often a component needs to react to store changes.

Suppose the store updates:

```js
{
    user,
        cart,
        notifications,
}
```

A component selecting:

```js
state => state.user.name
```

does not logically depend on changes to `cart` or `notifications`.

If the subscription system compares the selected result correctly, those unrelated changes do not require the component
to update.

This is the primary performance value of selective subscription.

## Selector Correctness

A selector must represent all state that determines its result.

For example:

```js
const selectLabel = state =>
    `${state.user.name} (${state.user.role})`;
```

depends on both:

```js
state.user.name
state.user.role
```

A memoized selector that tracks only one of these inputs can return stale data.

Selector dependencies therefore have the same fundamental correctness requirement as other derived computations.

## Selector Result Ownership

The consumer should normally treat selector results as read-only views of state.

For example:

```tsx
const user = useStore(selectUser);
```

does not mean the component owns `user`.

The store remains the authority.

Mutating the selected object:

```js
user.name = "Changed";
```

can violate the store's update model and break referential change detection.

Updates should go through the store's defined mutation or dispatch API.

## Selector and Actions

A clean store API can separate reads and writes:

```js
const selectCartTotal = state =>
    state.cart.total;

store.dispatch({
    type: "add-item",
    item,
});
```

The selector describes what is read.

The action describes how state changes.

Selectors should not become hidden mutation mechanisms.

## Testing Selectors

Pure selectors are easy to test:

```js
const state = {
    user: {
        name: "Alice",
    },
};

expect(selectUserName(state)).toBe("Alice");
```

Derived selectors can be tested independently:

```js
expect(selectCompletedCount(state)).toBe(3);
```

This makes selectors useful as a testable boundary around state representation.

## Testing Selector Stability

If stable identity is part of the design, identity can be tested:

```js
const first = selectUser(state);
const second = selectUser(state);

expect(second).toBe(first);
```

This is meaningful for selectors returning stored references.

For selectors producing derived objects, stability should only be tested if memoization or stable identity is explicitly
part of the contract.

## Common Misuse

A common mistake is selecting the entire store because it is convenient:

```js
state => state
```

Another is selecting a broad object when only one primitive field is needed.

Another is returning a new object from every selector evaluation without an appropriate equality strategy.

Another is using deep equality everywhere instead of designing stable state and narrow selectors.

Another is putting side effects inside selectors.

Another is mutating selector results.

Another is treating selectors as state ownership mechanisms.

Another is memoizing every selector regardless of calculation cost.

Another is creating selector layers so complicated that the state model becomes harder to understand than the original
store.

Another is using selectors to compensate for an incorrectly designed state boundary.

## Advantages

Selectors create narrow state-consumption boundaries.

They reduce unnecessary coupling to store structure.

They can reduce unnecessary component updates.

They support derived values without duplicating authoritative state.

They work naturally with normalized state.

They can improve testability.

They can encapsulate domain-specific state access.

They can combine with structural sharing and referential stability for efficient change detection.

They can provide a stable API even when the internal state representation changes.

## Disadvantages

Selectors introduce another abstraction layer.

Poor selector granularity can reduce clarity.

Derived selectors can become computationally expensive.

Selectors returning new objects require appropriate equality or memoization strategies.

Overly aggressive selector abstraction can obscure simple state access.

Incorrect memoization can produce stale results.

Deep equality can introduce substantial comparison costs.

Selectors do not solve state ownership, persistence, synchronization, or resource caching.

## When to Use

Use selectors when:

* a component needs only part of a larger state source;
* unrelated state changes should not affect a consumer;
* state access should be centralized;
* derived values can be computed from authoritative state;
* normalized state needs entity-level access;
* multiple consumers share the same domain-level projection;
* an external store supports selective subscriptions;
* a state representation should be hidden behind a stable domain API.

## When Not to Use

Do not use selectors for simple local state that already has an appropriate owner.

Do not create selectors merely to wrap trivial values without providing reuse or a meaningful abstraction boundary.

Do not select the entire state when only a small portion is required.

Do not use deep equality as the default solution to unstable selector results.

Do not put side effects in selectors.

Do not mutate selector results.

Do not use selectors as a replacement for state ownership.

Do not use selectors as a replacement for resource caches or server-state synchronization.

## Relationships

`26-external-store.md` defines the state ownership and subscription mechanism. Selectors define what a consumer reads
from that store.

`25-referential-stability.md` explains the identity semantics that make reference-based selector comparison effective.

`24-memoization-hooks.md` provides React-local memoization mechanisms. Selectors may use memoization, but selector
design is a broader state-consumption concern.

`23-memoized-components.md` concerns component render bailouts. Selectors can reduce the changes reaching a component,
while component memoization can reduce rendering after props are received.

`13-state-colocation.md` defines local state ownership. Selectors become more relevant when state exists in a broader
shared store.

`14-state-lifting.md` moves state ownership upward within React. Selectors do not move ownership.

`10-context-provider.md` distributes dependencies and values through the component tree. A Context can provide access to
a store that consumers query through selectors.

`12-context-partitioning.md` creates separate Context boundaries. Selectors create selective projections within a state
source.

`07-reducer-pattern.md` structures state transitions. Selectors structure state consumption.

`17-data-fetching.md` acquires asynchronous data. Selectors derive views from the resulting state.

`18-resource-cache.md` manages reusable resources. Selectors can derive views from cached data but do not define cache
behavior.

`19-server-state.md` manages synchronization with remote authoritative state. Selectors provide local projections of
that state but do not manage synchronization.

`44-stable-keys.md` and `45-component-identity.md` concern React component identity. Selectors concern state consumption
and do not determine component instance identity.

## Summary

The Selector Pattern narrows the state consumed by a component or other consumer:

```tsx
const userName = useStore(
    state => state.user.name
);
```

The state source remains authoritative.

The selector defines the consumer's projection.

Effective selector design depends on:

* narrow dependency boundaries;
* correct derived-data dependencies;
* appropriate equality semantics;
* referential stability;
* structural sharing;
* pure computations;
* deliberate selector granularity.

Selectors are particularly powerful with external stores because they allow a large state source to support targeted
consumers without requiring every component to observe the entire store.

The core rule is:

> Select the smallest meaningful state projection that represents the consumer's actual dependency, and make the
> result's equality semantics explicit when reference identity alone is insufficient.
