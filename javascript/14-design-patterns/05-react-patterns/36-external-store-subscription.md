# External Store

An external store is a state container whose authoritative state exists outside React component state.

React components read a snapshot of that state and subscribe to changes so that React can render the component again
when the relevant external state changes.

The external store pattern separates state ownership from component ownership:

```tsx
const value = useExternalStore(
    subscribe,
    getSnapshot
);
```

The important property is that React does not own the state. The store does.

This makes external stores appropriate when state must be shared across unrelated component subtrees, survive
independently of a particular component instance, or be integrated with a non-React state system.

## Intent

Provide React components with a consistent subscription interface to state that is owned outside the React component
tree.

An external store typically provides:

* authoritative state outside React;
* a read operation for the current snapshot;
* a subscription mechanism;
* notification when the snapshot changes;
* optional mutation or dispatch operations;
* optional derived-state or selector support.

The React integration layer connects this external state to rendering without transferring ownership of the state into
React.

## External State Ownership

With local state:

```tsx
const [count, setCount] = useState(0);
```

React owns the state associated with the component instance.

With an external store:

```tsx
const count = useExternalStore(
    subscribe,
    getSnapshot
);
```

the store owns `count`.

The component is a consumer of the store.

This distinction determines the lifecycle, sharing model, persistence model, and synchronization model of the state.

## Basic Store

A minimal store can be implemented with a value and a collection of listeners:

```js
let state = {
    count: 0,
};

const listeners = new Set();

function getSnapshot() {
    return state;
}

function subscribe(listener) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}

function setState(nextState) {
    state = nextState;

    for (const listener of listeners) {
        listener();
    }
}
```

The store owns the state.

`getSnapshot()` reads it.

`subscribe()` registers a consumer.

`setState()` changes the state and notifies subscribers.

React can then integrate these operations through its external-store subscription mechanism.

## React Integration

React provides `useSyncExternalStore` for subscribing to external stores:

```tsx
const state = useSyncExternalStore(
    subscribe,
    getSnapshot
);
```

The basic arguments are:

```tsx
useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
);
```

The optional third argument provides the snapshot used during server rendering.

The Hook establishes the contract between React and the external store.

## The Store Contract

An external store integration needs three fundamental capabilities:

```text
subscribe
getSnapshot
optional getServerSnapshot
```

`subscribe` tells React how to register for changes.

`getSnapshot` tells React what the current state is.

`getServerSnapshot` provides the appropriate server-rendering snapshot when server rendering is involved.

The store remains responsible for managing the underlying state.

## Subscription

A subscription establishes a relationship between the component and the external store:

```tsx
const value = useSyncExternalStore(
    subscribe,
    getSnapshot
);
```

React can subscribe while the component is mounted and unsubscribe when the subscription is no longer needed.

The subscription should return a cleanup function:

```js
function subscribe(listener) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}
```

The cleanup is part of the subscription contract.

## Subscription Identity

The identity of `subscribe` matters.

For example:

```tsx
useSyncExternalStore(
    () => store.subscribe(listener),
    store.getSnapshot
);
```

creates a new subscription function on every render.

A better integration uses stable store methods or stable wrappers:

```tsx
const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
);
```

The exact implementation depends on the store API, but the subscription mechanism should not be unnecessarily recreated.

This is an application of referential stability to subscription APIs.

## Snapshot

The snapshot represents the state React reads from the store:

```js
function getSnapshot() {
    return state;
}
```

React uses the snapshot to determine what the component should render.

The snapshot must have coherent semantics.

If the store's state has not changed, repeated reads should return the same snapshot identity when identity comparison
is used to detect changes.

## Stable Snapshots

A critical requirement is snapshot stability.

This is problematic:

```js
function getSnapshot() {
    return {
        ...state,
    };
}
```

Every call produces a new object.

Even when `state` has not changed:

```text
previous snapshot !== current snapshot
```

The integration can therefore continuously observe apparent changes.

Instead, the store should preserve the snapshot reference until the underlying state actually changes:

```js
let state = {
    count: 0,
};

function getSnapshot() {
    return state;
}
```

When state changes, replace the snapshot:

```js
state = {
    ...state,
    count: state.count + 1,
};
```

This gives reference identity useful change-detection semantics.

## Immutable Store Updates

External stores commonly benefit from immutable state updates:

```js
state = {
    ...state,
    user: {
        ...state.user,
        name: nextName,
    },
};
```

The changed objects receive new references.

Unchanged objects can retain their previous references.

This structural sharing makes identity-based change detection efficient.

## Mutable Stores

An external store can internally use mutable data structures, but React still needs a coherent snapshot contract.

For example, mutating an existing object:

```js
state.count += 1;
```

while returning the same reference:

```js
function getSnapshot() {
    return state;
}
```

can make reference-based change detection unable to observe the update.

The problem is not that mutation is categorically impossible.

The problem is that the mutation must be compatible with the snapshot semantics expected by React.

Immutable replacement is usually the simpler model.

## Snapshot and Render Consistency

React may render components at different times and may perform concurrent rendering work.

An external store therefore cannot assume that reading its state and rendering from it are equivalent to a synchronous,
uninterrupted operation.

`useSyncExternalStore` exists specifically to provide React with an integration contract for external mutable sources.

The store should expose a coherent snapshot rather than exposing uncontrolled reads directly to rendering logic.

## Why Direct Reads Are Not Enough

A component could technically read a global variable:

```tsx
const value = store.state;
```

but this does not establish a React subscription.

The component has no automatic mechanism to know that the value changed.

It may therefore render stale data.

An external-store integration adds the missing subscription relationship.

## External Store Versus Global Variable

A global variable is simply globally accessible state:

```js
let currentUser;
```

An external store is a structured state ownership mechanism with defined read and subscription behavior.

A store normally provides:

* state ownership;
* snapshot access;
* subscriptions;
* updates;
* lifecycle-independent state;
* optional selectors;
* optional persistence;
* optional middleware or plugins.

Global accessibility alone does not constitute an external-store architecture.

## External Store Versus Local State

Local state:

```tsx
const [value, setValue] = useState(initialValue);
```

is owned by a component instance.

External state:

```tsx
const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
);
```

is owned by the store.

Local state is generally preferable when the state naturally belongs to one component or subtree.

An external store becomes useful when ownership needs to exist independently of that subtree.

## External Store Versus Context

Context distributes values through the React tree.

An external store owns state outside the React tree.

These mechanisms can be combined:

```tsx
const StoreContext = createContext(store);
```

A Context can distribute the store instance while the store itself remains the state owner.

The distinction is therefore:

```text
Context
```

controls how a dependency is made available.

```text
External store
```

controls where the state is owned and how consumers subscribe to it.

Context does not inherently make state external.

## External Store and Context

A common architecture is:

```tsx
function App() {
    return (
        <StoreContext.Provider value={store}>
            <Application/>
        </StoreContext.Provider>
    );
}
```

A custom Hook can then obtain the store:

```tsx
function useAppStore() {
    const store = useContext(StoreContext);

    return useSyncExternalStore(
        store.subscribe,
        store.getSnapshot
    );
}
```

Context provides dependency access.

The external store provides state ownership and subscription.

## External Store and Context Partitioning

Context partitioning and external stores solve different problems.

Context partitioning creates independent Context boundaries.

An external store can provide more selective subscriptions through selectors:

```tsx
const userName = useAppStore(
    state => state.user.name
);
```

The external store can therefore allow consumers to subscribe to specific portions of a larger state model.

The appropriate solution depends on the ownership and subscription requirements.

## Selective Subscription

A large external store does not necessarily require every component to rerender for every state change.

A selector can narrow the observed value:

```tsx
const name = useStore(
    state => state.user.name
);
```

The selector determines the portion of state consumed by the component.

The external store owns the complete state.

The selector determines the consumer's projection.

`27-selector-pattern.md` covers selector design in detail.

## Selector Equality

Consider:

```tsx
const user = useStore(
    state => state.user
);
```

If `state.user` retains the same reference when unrelated state changes, the selected value remains stable.

This allows identity-based equality to efficiently detect that the selected value has not changed.

If the selector instead constructs a new object:

```tsx
const user = useStore(
    state => ({
        name: state.user.name,
        email: state.user.email,
    })
);
```

the selector produces a new reference each time it executes.

The store integration may therefore need an explicit equality strategy or a different selector design.

## Primitive Selectors

Selectors returning primitives are often straightforward:

```tsx
const userId = useStore(
    state => state.user.id
);
```

If the identifier does not change, the selected value does not change.

This makes primitive selections naturally compatible with identity/value-based change detection.

## Derived Selectors

Selectors can compute derived data:

```tsx
const completedCount = useStore(
    state => state.todos.filter(todo => todo.completed).length
);
```

This is conceptually valid, but the calculation executes whenever the selector is evaluated.

If the calculation is expensive, the selector itself may need memoization or a more sophisticated derived-data strategy.

Selector optimization is therefore separate from the fundamental external-store subscription mechanism.

## External Store and Referential Stability

External stores depend heavily on referential stability.

A well-designed store generally follows this rule:

```text
unchanged state
→ unchanged relevant references
```

and:

```text
changed state
→ changed references for affected values
```

This allows identity comparisons to act as efficient change signals.

`25-referential-stability.md` covers the general identity concept.

The external-store pattern applies that concept to externally owned state.

## External Store and State Colocation

External stores should not replace state colocation by default.

Consider a dropdown used by one component:

```tsx
const [open, setOpen] = useState(false);
```

Moving this state into a global store creates a larger ownership boundary without a corresponding requirement.

Local state is usually the more appropriate design.

An external store is justified when the state genuinely needs external ownership.

## External Store and State Lifting

State lifting moves ownership upward within the React tree.

An external store moves ownership outside the React component hierarchy.

If two sibling components need shared state, lifting to their lowest common ancestor may be sufficient.

If many unrelated parts of an application need the same independently managed state, an external store may be more
appropriate.

These are different ownership strategies.

## External Store and Controlled Components

A controlled component receives authoritative state from an external owner:

```tsx
<Input
    value={value}
    onChange={setValue}
/>
```

That external owner can be:

* a parent component;
* a Context-backed state model;
* an external store.

The controlled-component pattern concerns the component API.

The external-store pattern concerns where the authoritative state is maintained.

They can therefore be combined without being the same pattern.

## External Store and Reducers

A reducer can be used inside an external store:

```js
function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return {
                ...state,
                count: state.count + 1,
            };

        default:
            return state;
    }
}
```

The reducer determines how state transitions occur.

The external store determines where that state is owned and how consumers subscribe.

A reducer therefore does not inherently make state external.

## External Store and Effects

Effects can be used to synchronize an external system:

```tsx
useEffect(() => {
    store.setValue(value);
}, [value]);
```

However, Effects should not be used as the primary mechanism for making React observe external store state.

Reading and subscribing to an external store should use the dedicated external-store integration.

Effects remain appropriate for imperative synchronization with external systems.

## External Store and Event Emitters

An event emitter can provide notification:

```js
emitter.on("change", listener);
```

But an event emitter alone is not necessarily an external store.

A store needs a coherent state-reading model in addition to notification.

The combination can form a store:

```js
function subscribe(listener) {
    return emitter.on("change", listener);
}

function getSnapshot() {
    return currentState;
}
```

The emitter handles notification.

The store defines the state and snapshot contract.

## External Store and Web APIs

External stores are useful for wrapping browser APIs or other mutable external sources.

Examples include:

* browser storage;
* media queries;
* online/offline status;
* browser history;
* WebSocket state;
* shared workers;
* native application state;
* third-party state containers.

For example, a media-query store can expose:

```text
subscribe
getSnapshot
```

while the underlying browser API remains responsible for detecting changes.

React then consumes the external source through the store contract.

## Browser Storage

Browser storage can be treated as an external state source:

```js
localStorage.setItem("theme", "dark");
```

Reading directly from storage during rendering does not automatically cause React to update.

An adapter can maintain a snapshot and notify subscribers when the underlying value changes.

The store therefore acts as the React integration boundary around the imperative browser API.

## WebSocket State

A WebSocket connection has state that exists independently of a React component:

```text
connecting
open
closing
closed
```

An external store can expose a snapshot representing the connection:

```js
{
    status: "open",
        messages,
}
```

Components subscribe to that snapshot without owning the underlying connection lifecycle themselves.

The connection may therefore survive component mounting and unmounting according to application-level ownership.

## External Store Lifetime

One of the main reasons to use an external store is that its lifetime can differ from component lifetimes.

A component can mount:

```text
component subscribes
```

and later unmount:

```text
component unsubscribes
```

while the store remains alive.

This is fundamentally different from component-local state, whose lifetime is associated with the component instance.

## Store Lifetime and Resource Ownership

External state and external resources should not automatically be given the same lifetime.

A store may remain alive for the duration of an application while a network connection managed by the store may need
independent lifecycle rules.

The architecture should explicitly determine:

* who creates the store;
* who destroys it;
* whether it is singleton or scoped;
* whether resources are lazy;
* whether resources are released when the last subscriber leaves.

The external-store pattern does not prescribe these policies.

## Scoped External Stores

Not every external store should be global.

A store can be created for a particular application boundary:

```tsx
const store = createStore(initialState);
```

and passed to a subtree through Context.

This provides external ownership relative to the consuming components while avoiding a process-wide singleton.

Scoped stores can be useful for:

* independently mounted applications;
* isolated workflows;
* multi-instance components;
* tests;
* server requests;
* embedded application modules.

## Multiple Store Instances

An application can have multiple store instances:

```tsx
const editorStore = createStore();
const sessionStore = createStore();
const notificationStore = createStore();
```

Each store represents a distinct ownership boundary.

This can reduce coupling compared with one global store containing every category of state.

The number of stores should follow meaningful ownership boundaries rather than arbitrary fragmentation.

## Singleton Stores

A singleton store can be appropriate when the state represents one application-wide resource:

```js
export const sessionStore = createSessionStore();
```

Every consumer can subscribe to the same state source.

However, singleton ownership can make testing, isolation, server rendering, and multiple application instances more
difficult.

Global state should therefore be global because the domain requires it, not merely because sharing is convenient.

## Server Rendering

Server rendering introduces an important external-store requirement.

A server-rendered component must obtain a consistent server snapshot:

```tsx
const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
);
```

The server snapshot must correspond to the state represented by the generated HTML.

The client must then hydrate against compatible initial state.

## Server Request Isolation

A singleton mutable store is particularly dangerous in server environments.

Multiple requests can execute concurrently.

If request-specific state is stored in one process-wide mutable store, one request can observe another request's data.

A safer architecture creates request-scoped stores:

```js
function createRequestStore(initialState) {
    return createStore(initialState);
}
```

Each server request receives its own state ownership boundary.

This is a lifecycle and isolation concern rather than a React rendering optimization.

## Hydration

When an external store participates in server rendering, the client must start from state compatible with the server
snapshot.

For example:

```js
const initialState = window.__INITIAL_STATE__;
const store = createStore(initialState);
```

The exact serialization and transport mechanism varies by application.

The important requirement is that the server and client agree on the initial snapshot used for hydration.

## External Store and Suspense

An external store provides state subscription.

Suspense provides rendering coordination for suspended content.

An external store does not automatically become Suspense-aware.

For example, a store containing:

```js
{
    status: "loading",
}
```

can be consumed through ordinary rendering:

```tsx
if (state.status === "loading") {
    return <Loading/>;
}
```

Suspense requires a separate suspension mechanism.

The two patterns can coexist but solve different problems.

## External Store and Error Boundaries

External stores can contain error state:

```js
{
    status: "error",
        error,
}
```

A component can render that state explicitly.

An Error Boundary instead provides containment for rendering errors.

A store therefore should not be treated as a replacement for error boundaries.

## External Store and Server State

An external store can hold server data:

```js
{
    users,
        loading,
        error,
}
```

but storing remote data in an external store does not automatically provide server-state semantics.

Server state requires concerns such as:

* freshness;
* invalidation;
* refetching;
* mutation reconciliation;
* stale data;
* background synchronization;
* optimistic updates;
* request deduplication.

An external store can be the implementation mechanism, but it is not itself the server-state pattern.

## External Store and Resource Cache

A resource cache answers:

> Which resource can be reused?

An external store answers:

> Where is state owned, and how do React consumers subscribe to it?

A cache can be implemented using an external store when consumers need reactive cache updates.

The concepts remain distinct.

## External Store and Data Fetching

Fetching data and storing state are different concerns.

A request function may perform:

```js
const response = await fetch("/api/users");
```

An external store may then retain the resulting state and notify subscribers.

The store does not inherently define:

* how requests are made;
* how retries work;
* how requests are cancelled;
* how stale responses are handled.

Those concerns belong to the data-fetching or server-state layer.

## Update Model

A store needs a defined update mechanism.

A simple store might expose:

```js
store.setState(nextState);
```

Another might expose actions:

```js
store.dispatch({
    type: "add-item",
    item,
});
```

Another might expose domain operations:

```js
store.addItem(item);
```

The update API is independent from the React subscription mechanism.

The store can therefore have sophisticated domain logic while exposing a simple snapshot/subscription interface to
React.

## Notifications

The store must notify subscribers when a relevant snapshot changes.

A simple implementation can notify all listeners:

```js
for (const listener of listeners) {
    listener();
}
```

The React integration then determines whether the snapshot relevant to a particular consumer has changed.

More sophisticated stores can use selective subscriptions, dependency tracking, or selectors to reduce unnecessary work.

## Notification Does Not Mean Rerender

A store notification does not necessarily mean every subscriber must produce a changed UI.

A notification means:

```text
the store may have changed
```

React can read the current snapshot and determine whether the consumer's observed value changed.

This distinction allows a store to have broad notification mechanisms while consumers remain selective.

## Batching and Multiple Updates

A store may perform several state updates during one logical operation.

For example:

```js
store.setState(firstState);
store.setState(secondState);
```

The integration must be designed so that React observes coherent snapshots rather than inconsistent intermediate state
where the application requires atomicity.

Stores often therefore provide transaction-like or batched update mechanisms.

The appropriate strategy depends on the store's consistency requirements.

## Atomic Updates

If multiple fields represent one logical state transition:

```js
{
    startDate,
        endDate,
}
```

the store should update them coherently:

```js
state = {
    ...state,
    startDate: nextStartDate,
    endDate: nextEndDate,
};
```

rather than exposing an intermediate state where only one field has changed.

External stores are therefore responsible for defining their own state-transition atomicity.

## Derived State

A store can maintain derived values:

```js
{
    items,
        completedCount,
}
```

or derive them dynamically:

```js
function getSnapshot() {
    return {
        items: state.items,
        completedCount: countCompleted(state.items),
    };
}
```

The second approach becomes problematic if `getSnapshot()` creates a new object on every call.

Derived snapshots should preserve stable identity when the underlying relevant state has not changed.

Alternatively, derived values can be exposed through selectors or memoized derivation.

## Store Normalization

Large stores may normalize relational data:

```js
{
    usersById,
        postsById,
        commentsById,
}
```

Normalization can reduce duplicated entities and make updates more targeted.

However, normalization is not a fundamental requirement of the external-store pattern.

A small store may use a simple object structure.

The architecture should match the state domain.

## Persistence

An external store can synchronize with persistent storage:

```text
store state
localStorage
IndexedDB
server
```

Persistence changes the store's lifecycle and consistency requirements.

It may need to handle:

* initialization;
* serialization;
* migration;
* storage failures;
* cross-tab updates;
* conflict resolution.

These concerns are store-specific and are not required for every external store.

## Cross-Tab Synchronization

A browser application can synchronize external state between tabs using mechanisms such as `BroadcastChannel` or storage
events.

The external store can receive external updates and notify its subscribers.

This is a natural extension of the external-store model because the authoritative source already exists outside the
component tree.

## Testing

External stores can often be tested independently from React.

For example:

```js
const store = createStore();

store.setState({
    count: 1,
});

expect(store.getSnapshot().count).toBe(1);
```

Subscription behavior can be tested independently:

```js
let notified = 0;

const unsubscribe = store.subscribe(() => {
    notified += 1;
});

store.setState({
    count: 1,
});

expect(notified).toBe(1);

unsubscribe();
```

React integration can then be tested separately.

This separation is one advantage of external ownership.

## Common Misuse

A common mistake is putting every application value into an external store.

Another is using an external store for state that belongs naturally to one component.

Another is creating a new snapshot object every time `getSnapshot()` runs.

Another is mutating the snapshot while relying on reference equality to detect changes.

Another is using Context merely to recreate global mutable state without defining a subscription model.

Another is reading store state directly during rendering without subscribing.

Another is creating one enormous global store containing unrelated domains.

Another is assuming an external store automatically provides server-state synchronization.

Another is treating an event emitter as a complete state store.

Another is using an application-wide singleton for request-specific server state.

Another is recreating subscriptions unnecessarily because the `subscribe` function is unstable.

## Advantages

External stores provide state ownership independent of component instances.

They allow unrelated component subtrees to share state.

They can integrate React with non-React state systems.

They can survive component unmounting.

They support selective subscriptions and derived views.

They can provide a clean separation between domain state and UI rendering.

They can be tested independently from React.

They can integrate with browser APIs, native systems, sockets, workers, and other external sources.

They can support application-wide state when that scope is genuinely required.

## Disadvantages

External stores introduce additional architectural complexity.

State ownership becomes less local and therefore potentially harder to trace.

Global stores can create hidden coupling.

Subscription correctness becomes an explicit concern.

Snapshot identity and update semantics must be designed carefully.

Server rendering requires explicit isolation and snapshot handling.

Large stores can become difficult to modularize if unrelated domains are combined.

An external store can also become an inappropriate substitute for proper state colocation.

## When to Use

Use an external store when:

* state must be shared across unrelated React subtrees;
* state must outlive individual component instances;
* a non-React system already owns the state;
* browser or native APIs provide the authoritative state;
* application state requires independent lifecycle management;
* selective subscriptions are important;
* multiple application surfaces need one shared state source;
* the state belongs to an application or domain boundary rather than one component subtree.

## When Not to Use

Do not use an external store merely because multiple components need state.

If the components share a natural ancestor, state lifting may be simpler.

Do not use an external store for transient component-local UI state.

Do not use one global store for unrelated state domains without a clear ownership reason.

Do not use an external store as a replacement for a resource cache.

Do not use it as a replacement for server-state synchronization.

Do not use it merely to avoid passing a prop a few levels through a component tree.

Do not introduce external state ownership when Context plus local state provides the required semantics.

## Relationships

`13-state-colocation.md` defines the preferred local ownership strategy. External stores are appropriate when state
needs an ownership boundary outside the local React subtree.

`14-state-lifting.md` moves ownership upward within the React tree. An external store moves ownership outside that
hierarchy.

`15-controlled-components.md` defines components whose authoritative state is owned externally. An external store can be
that owner.

`10-context-provider.md` distributes values through the React tree. Context can distribute an external store instance
without becoming the state owner itself.

`12-context-partitioning.md` separates Context dependency boundaries. External stores can instead provide selective
subscriptions within one state source.

`06-custom-hooks.md` provides reusable behavior. A custom Hook is often the React-facing API for an external store.

`07-reducer-pattern.md` structures state transitions. A reducer can be used internally by an external store but does not
determine where state is owned.

`24-memoization-hooks.md` provides memoization mechanisms. Memoization can optimize derived store values but does not
create external ownership.

`25-referential-stability.md` explains the identity semantics on which efficient snapshot and selector comparison often
depend.

`27-selector-pattern.md` narrows the portion of external state observed by a consumer.

`17-data-fetching.md` concerns asynchronous data acquisition. An external store can retain fetched data but does not
inherently define fetching behavior.

`18-resource-cache.md` manages reusable asynchronous resources. An external store can expose cache state reactively, but
cache identity and lifetime remain separate concerns.

`19-server-state.md` manages synchronization with remotely authoritative state. An external store can implement or host
server-state data but does not provide those synchronization semantics automatically.

`21-error-boundary.md` contains rendering failures. An external store may represent application errors but does not
replace rendering error containment.

`22-suspense-boundary.md` coordinates rendering while content is suspended. An external store provides state
subscription and does not itself provide Suspense semantics.

`44-stable-keys.md` and `45-component-identity.md` concern React component identity. External stores deliberately allow
state to exist independently of those component lifetimes.

## Summary

An external store moves authoritative state outside React component state while providing React with a consistent
snapshot and subscription interface.

The essential model is:

```tsx
const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
);
```

The store owns the state.

`getSnapshot` exposes the current state.

`subscribe` establishes the update relationship.

React remains responsible for rendering components from the state it observes.

A well-designed external store therefore has:

* explicit ownership;
* coherent snapshots;
* stable snapshot identity;
* predictable updates;
* correct subscription cleanup;
* appropriate lifecycle scope;
* selective consumption where necessary;
* server-rendering isolation when required.

The external-store pattern should be introduced because state genuinely needs to live outside the React component
hierarchy, not merely because sharing state is possible.

The core rule is:

> Use an external store when the state has an ownership and lifecycle boundary independent of the consuming React
> components, and expose that state through a coherent snapshot/subscription contract.
