# Local State

## Intent

Local state is state whose authoritative owner is a React component instance and whose value is primarily needed by that
component or its immediate implementation. The state is created, updated, and retained as part of the component's own
lifecycle rather than being owned by a parent, a shared Context, or an external state system.

Local state is the default state-ownership strategy for component-specific behavior. State should remain local when no
other component or subsystem needs to directly own or coordinate it.

Local state is an ownership decision, not a particular API. It can be implemented with `useState`, `useReducer`, or
another component-local mechanism.

## Basic Pattern

A component declares the state it owns and updates that state in response to events or other state transitions.

```jsx
import {useState} from "react";

function Counter() {
    const [count, setCount] = useState(0);

    function increment() {
        setCount(count + 1);
    }

    return (
        <button onClick={increment}>
            Count: {count}
        </button>
    );
}
```

The `Counter` component owns `count`. A different component cannot directly mutate that state. Another component can
influence it only through an explicit interface exposed by `Counter`, such as props, callbacks, or another shared
mechanism.

## Ownership

The defining characteristic of local state is ownership.

The owner is responsible for:

* storing the authoritative value;
* defining how the value changes;
* determining when the value is reset;
* deciding how the value is exposed to descendants;
* coordinating the state with the component's other responsibilities;
* ensuring that updates preserve the invariants of that state.

For example, an accordion can locally own which section is expanded.

```jsx
function Accordion() {
    const [expanded, setExpanded] = useState("details");

    function toggle(section) {
        setExpanded(current =>
            current === section ? null : section
        );
    }

    return (
        <>
            <Section
                expanded={expanded === "details"}
                onToggle={() => toggle("details")}
            />
            <Section
                expanded={expanded === "shipping"}
                onToggle={() => toggle("shipping")}
            />
        </>
    );
}
```

The expanded section is implementation state of the accordion. It does not need to become application-wide state merely
because multiple elements participate in the behavior.

## State Belongs to the Component Instance

Local state belongs to a particular React component instance.

Two instances of the same component type have independent local state.

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    );
}

function App() {
    return (
        <>
            <Counter/>
            <Counter/>
        </>
    );
}
```

Each `Counter` has its own `count`. Updating one instance does not update the other.

This independence is one of the primary reasons to prefer local state for component-specific behavior.

## State Identity

Local state is associated with the identity of the component instance in the rendered tree.

If React preserves the component's identity across renders, its local state is preserved.

```jsx
function Panel() {
    const [open, setOpen] = useState(false);

    return (
        <section>
            <button onClick={() => setOpen(value => !value)}>
                Toggle
            </button>

            {open && <div>Content</div>}
        </section>
    );
}
```

A normal re-render does not recreate `open`. The state survives because the component instance remains the same.

If the component's identity changes, React can replace the instance and therefore discard its local state.

```jsx
{
    showEditor ? (
        <Editor key="editor"/>
    ) : (
        <Editor key="preview"/>
    )
}
```

These two keys identify different component instances. Switching between them causes the corresponding local state to
belong to different instances.

State identity is therefore related to component identity rather than to the JavaScript function invocation itself.

## Multiple Local State Values

A component can own several independent pieces of local state.

```jsx
function SearchForm() {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // ...
}
```

Each state value can represent a distinct piece of information with its own update semantics.

State should be split when the values have substantially different ownership, transition, or reset behavior.

Conversely, related state can be represented together when the values form a single coherent state model.

```jsx
const [form, setForm] = useState({
    query: "",
    category: "all",
});
```

The choice should reflect the domain of the state rather than an arbitrary preference for either many primitive states
or one large object.

## Functional State Updates

When the next value depends on the previous value, use the functional updater form.

```jsx
setCount(current => current + 1);
```

This expresses the update as a transition from the previous state rather than calculating the result from a potentially
stale value captured by the current render.

Multiple dependent updates can therefore be expressed safely.

```jsx
function incrementTwice() {
    setCount(current => current + 1);
    setCount(current => current + 1);
}
```

Each updater receives the state value resulting from the preceding update in the same update sequence.

## Local State and Render Snapshots

A render observes a particular snapshot of state.

```jsx
function Counter() {
    const [count, setCount] = useState(0);

    function handleClick() {
        console.log(count);

        setCount(count + 1);

        console.log(count);
    }

    return <button onClick={handleClick}>{count}</button>;
}
```

Both reads of `count` belong to the same render snapshot. Calling the setter schedules an update; it does not mutate the
`count` binding captured by the current render.

This distinction is important when local state is used inside event handlers, asynchronous callbacks, Effects, and other
closures.

## Derived Values

Not every value used by a component should become local state.

If a value can be deterministically calculated from existing state or props, it is usually derived during rendering.

```jsx
function Cart({items}) {
    const [discount, setDiscount] = useState(0);

    const subtotal = items.reduce(
        (total, item) => total + item.price,
        0
    );

    const total = subtotal - discount;

    return (
        <div>
            <p>Subtotal: {subtotal}</p>
            <p>Total: {total}</p>
        </div>
    );
}
```

`subtotal` and `total` do not need independent state because they are functions of other values.

Duplicating derived values in state creates synchronization obligations.

```jsx
const [subtotal, setSubtotal] = useState(0);
```

If `subtotal` is already derivable from `items`, storing both `items` and `subtotal` creates two representations of the
same information that can diverge.

A useful rule is:

> Store the minimum authoritative state necessary to represent the component's mutable information.

## State Versus Constants

A value should not become state merely because it is used during rendering.

```jsx
const pageSize = 20;
```

A constant does not need React state if changing it is not part of the component's runtime behavior.

State is appropriate when a change in the value must cause the component to render according to the new value.

## State Versus Props

Props are inputs supplied by a component's parent. Local state is owned by the component itself.

```jsx
function Editor({initialValue}) {
    const [value, setValue] = useState(initialValue);

    // ...
}
```

Here `initialValue` is an input used to initialize local state. After initialization, `value` is independently owned by
`Editor`.

This does not mean that every prop should be copied into state.

```jsx
function Profile({user}) {
    const [name, setName] = useState(user.name);
}
```

Copying a prop into state establishes two potentially independent sources of truth. If the component is intended to
track the prop continuously, the prop should generally remain the authoritative value instead.

Local state is appropriate when the component intentionally establishes its own mutable representation.

## Initial State

The initial state establishes the value for a component instance when that state is created.

```jsx
const [count, setCount] = useState(0);
```

For expensive initialization, a lazy initializer can defer the calculation to state initialization.

```jsx
const [value, setValue] = useState(() => createInitialValue());
```

The initializer is not a mechanism for recalculating the state on every render.

If the component needs to reset the state in response to an explicit event, that reset should be modeled as an
intentional state transition.

```jsx
function Form() {
    const initialState = {
        name: "",
        email: "",
    };

    const [form, setForm] = useState(initialState);

    function reset() {
        setForm(initialState);
    }

    // ...
}
```

## State Reset

Local state can be reset by explicitly changing the state value.

```jsx
setValue("");
```

A component can also be remounted by changing its identity, which creates a new local-state instance.

```jsx
<Editor key={documentId} documentId={documentId}/>
```

Changing `documentId` in this example changes the key and therefore gives `Editor` a new identity.

Explicit state transitions should generally be preferred when only particular values need to reset. Identity changes are
appropriate when the semantic requirement is to create a new component instance with fresh local state.

## Objects and Arrays

Local state containing objects or arrays should be updated immutably.

```jsx
const [user, setUser] = useState({
    name: "Ada",
    role: "admin",
});

setUser(current => ({
    ...current,
    role: "editor",
}));
```

Do not mutate the existing state object in place.

```jsx
user.role = "editor";
```

Instead, create the appropriate next representation.

```jsx
setUser(current => ({
    ...current,
    role: "editor",
}));
```

The same principle applies to arrays.

```jsx
setItems(current => [
    ...current,
    newItem,
]);
```

Immutable updates make state transitions explicit and preserve the assumptions used by React's rendering model and
equality-based optimizations.

## State Granularity

Local state should have a granularity that matches the component's responsibilities.

Overly fragmented state can make related transitions difficult to coordinate.

```jsx
const [status, setStatus] = useState("idle");
const [error, setError] = useState(null);
const [data, setData] = useState(null);
```

If these values always change together according to a well-defined state machine, a reducer can provide a clearer
representation.

```jsx
const [state, dispatch] = useReducer(reducer, {
    status: "idle",
    data: null,
    error: null,
});
```

The decision concerns state modeling and transition semantics. The local ownership of the state remains the same.

## Local State With Reducers

A reducer is useful when local state contains multiple related values or complex transitions.

```jsx
function reducer(state, action) {
    switch (action.type) {
        case "increment":
            return {
                ...state,
                count: state.count + 1,
            };

        case "reset":
            return {
                ...state,
                count: 0,
            };

        default:
            return state;
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, {
        count: 0,
    });

    return (
        <button onClick={() => dispatch({type: "increment"})}>
            {state.count}
        </button>
    );
}
```

The reducer defines transitions; the component still owns the resulting state.

The reducer pattern is therefore a state-transition mechanism, while local state is an ownership boundary.

## State and Event Handlers

User interactions commonly update local state.

```jsx
function MenuButton() {
    const [open, setOpen] = useState(false);

    function handleClick() {
        setOpen(current => !current);
    }

    return (
        <button onClick={handleClick}>
            {open ? "Close" : "Open"}
        </button>
    );
}
```

Event handlers are appropriate places to initiate state transitions caused by user actions.

State should not be updated merely because an event happened if the event can instead directly perform the required side
effect or operation.

State exists when the result must persist as part of the component's rendered state model.

## Local State and Effects

An Effect can synchronize local state with an external system, but Effects should not be used simply to derive one local
state value from another.

Avoid:

```jsx
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [fullName, setFullName] = useState("");

useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

Prefer deriving the value during rendering:

```jsx
const fullName = `${firstName} ${lastName}`;
```

An Effect is appropriate when the local state participates in synchronization with something outside React.

```jsx
useEffect(() => {
    document.title = `Count: ${count}`;
}, [count]);
```

The state remains local; the Effect synchronizes its consequence with an external system.

## Local State and Context

Context is not inherently a replacement for local state.

A component can own local state and expose selected state through Context when descendants need access without explicit
prop passing.

```jsx
function ThemeProvider({children}) {
    const [theme, setTheme] = useState("light");

    return (
        <ThemeContext value={{theme, setTheme}}>
            {children}
        </ThemeContext>
    );
}
```

The state is still owned by the provider component instance. Context changes the distribution mechanism, not the
fundamental ownership of that state.

When only the component itself needs the state, Context introduces an unnecessary dependency boundary.

## Local State and External Stores

An external store is appropriate when state must have an owner outside a particular React component instance or must be
shared independently of the component tree.

Local state is preferable when the state naturally belongs to one component instance.

For example, the open/closed state of an individual disclosure is typically local.

The authenticated user's session, application-wide preferences, or a shared domain cache may require a broader ownership
model.

The distinction is ownership, not merely the number of components that currently read the value.

## Local State and Controlled Components

A controlled component receives its authoritative value from outside.

```jsx
function SearchInput({value, onChange}) {
    return (
        <input
            value={value}
            onChange={event => onChange(event.target.value)}
        />
    );
}
```

An uncontrolled component can instead own its current value internally.

```jsx
function SearchInput() {
    const [value, setValue] = useState("");

    return (
        <input
            value={value}
            onChange={event => setValue(event.target.value)}
        />
    );
}
```

The difference is ownership.

Local state is the mechanism by which a component can implement internally owned state. Controlled versus uncontrolled
describes where the authoritative value resides relative to the component's public API.

## Local State and Component Composition

Local state does not prevent composition.

A component can keep internal state while exposing behavior through composed children.

```jsx
function Tabs({children}) {
    const [activeId, setActiveId] = useState("overview");

    return (
        <TabsContext value={{activeId, setActiveId}}>
            {children}
        </TabsContext>
    );
}
```

The state remains private to the owning component while descendants participate through an explicit interface.

Composition therefore affects how behavior is structured, whereas local state describes who owns the mutable value.

## Local State and Custom Hooks

A custom Hook can encapsulate local state logic.

```jsx
function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    function toggle() {
        setValue(current => !current);
    }

    return {
        value,
        toggle,
    };
}
```

Each component that calls `useToggle` receives its own Hook state.

```jsx
function Dialog() {
    const dialog = useToggle();
    // ...
}

function Menu() {
    const menu = useToggle();
    // ...
}
```

Calling the same custom Hook does not automatically create shared state. The state remains associated with the component
instance invoking the Hook.

A custom Hook is therefore an encapsulation mechanism; local state is the ownership model underneath it.

## State Colocation

Local state should generally be placed at the narrowest component boundary that can correctly own it.

For example, a tooltip's open state should normally remain within the tooltip or its immediate behavior boundary rather
than being stored in an application-level store.

This reduces:

* the number of consumers that can affect the state;
* the number of components coupled to the state;
* unnecessary render propagation;
* synchronization requirements;
* the public API required to manipulate the state.

When another component genuinely needs to coordinate the state, ownership can move to an appropriate common ancestor or
another state boundary.

## Avoiding Premature State Promotion

State should not be moved to a broader scope merely because doing so makes it technically accessible.

A component-local value does not become global state because another component might eventually need it.

Promotion should be driven by an actual ownership requirement.

For example, if two sibling components must coordinate the selected item, their common parent may need to own that
selection. Until that coordination exists, keeping selection local to the relevant component is usually simpler.

## Local State as an Encapsulation Boundary

Local state is also an encapsulation mechanism.

Consumers of a component should interact with its behavior through its public interface rather than depending on the
internal state representation.

```jsx
function Disclosure() {
    const [open, setOpen] = useState(false);

    return (
        <section>
            <button onClick={() => setOpen(current => !current)}>
                {open ? "Hide" : "Show"}
            </button>
        </section>
    );
}
```

The component exposes behavior without exposing `open` itself.

If the internal representation later changes from a boolean to a more complex state model, consumers can remain
unaffected as long as the component's public contract remains stable.

## Local State and Asynchronous Work

Local state can represent the status of asynchronous work owned by a component.

```jsx
function Search() {
    const [status, setStatus] = useState("idle");
    const [results, setResults] = useState([]);

    // ...
}
```

However, state ownership and asynchronous resource ownership are separate concerns.

If multiple components need to share a server resource, request deduplication, caching, invalidation, or synchronization
semantics, representing that resource purely as local component state can produce duplicated requests and inconsistent
copies.

In that case, a resource cache or server-state abstraction may be a more appropriate owner.

Local state remains appropriate for UI state surrounding that resource, such as whether a local panel is expanded or
which temporary input value is currently being edited.

## Common Misuse

### Storing Derived Data

Do not create state for values that can be calculated from existing state or props.

```jsx
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);
```

If `count` is always `items.length`, store only `items`.

```jsx
const count = items.length;
```

### Copying Props Without an Ownership Reason

Do not copy props into local state simply because the component needs to read them.

```jsx
function User({name}) {
    const [localName, setLocalName] = useState(name);
}
```

Use local state when the component intentionally establishes an independent mutable value.

### Making Everything Local

Local state is not automatically correct simply because it is convenient.

If several components must coordinate authoritative state, keeping separate local copies creates synchronization
problems.

### Making Everything Global

The opposite mistake is moving component-specific state into Context or an external store.

This expands the dependency surface and couples unrelated components to state that has no reason to be shared.

### Using State as an Event Bus

State represents persistent rendered information. It should not be used as a general-purpose command channel.

For example, setting a state value solely so an Effect notices the change and performs an action often indicates that
the event should have directly initiated the operation.

### Mutating State

Mutating an object or array stored in local state breaks the intended state transition model.

Always produce the appropriate next value rather than mutating the existing representation.

### Resetting State Accidentally

Changing component identity can discard local state.

This is particularly relevant when keys or component structure change. Identity should therefore be treated as part of
state lifetime rather than as an unrelated rendering detail.

### Excessive State Splitting

Creating many independent state variables for a tightly coupled state machine can obscure valid transitions.

When state values have coordinated transitions and invariants, a reducer or another explicit state model can provide a
clearer representation.

## Advantages

Local state provides strong encapsulation because the owning component controls its mutable implementation details.

It naturally provides independent state for each component instance.

It limits the dependency surface because unrelated components do not need to know about the state.

It avoids unnecessary global synchronization.

It works directly with React's rendering and component identity model.

It allows state to evolve internally without requiring a broader application-level API.

It is usually the simplest correct ownership model for transient UI state.

## Disadvantages

Local state is not inherently suitable for shared authoritative state.

Multiple local copies of the same logical value can diverge.

State may need to be lifted when multiple components must coordinate it.

State may need to move to Context or an external store when its ownership exceeds a component subtree.

Complex local state can become difficult to reason about when transitions are numerous or highly interdependent.

Component-local asynchronous state can duplicate server resources when resource ownership should instead be shared.

## When to Use

Use local state when:

* one component instance is the natural owner;
* the value represents transient UI state;
* the state does not need independent external ownership;
* other components do not need to coordinate the value directly;
* the state can remain encapsulated behind the component's API;
* broader state management would introduce unnecessary coupling.

Typical examples include:

* open/closed state;
* selected tab within an isolated component;
* temporary input state;
* hover or focus-related UI state;
* local editing state;
* disclosure state;
* temporary wizard-step state;
* component-specific display preferences;
* transient interaction state.

## When Not to Use

Do not keep state local when:

* multiple components require one authoritative value;
* unrelated branches need to coordinate the state;
* the state represents a shared application domain;
* the state must survive independently of a particular component instance;
* multiple components need shared caching or synchronization semantics;
* separate local copies would require continual synchronization.

In these cases, consider state lifting, Context, an external store, a resource cache, or another ownership mechanism
appropriate to the domain.

## Relationship to Other Patterns

`20-local-state.md` defines state ownership at the component-instance level.

`11-state-hooks.md` covers the React Hooks mechanisms used to implement component state, including `useState` and
`useReducer`. Local State answers who owns the state; State Hooks answer how component-local state is implemented.

`13-state-colocation.md` focuses on placing state at the narrowest appropriate ownership boundary. Local State describes
the resulting ownership model.

`14-state-lifting.md` describes moving state upward when multiple components need a common owner.

`15-controlled-components.md` describes externally owned component state. A component with local state can instead
expose a controlled API when ownership needs to move outside the component.

`16-uncontrolled-components.md` describes components that retain authoritative state internally, including cases where
local state or the DOM owns that value.

`07-reducer-pattern.md` describes explicit state-transition modeling. A reducer can be used to implement local state
without changing its local ownership.

`06-custom-hooks.md` describes reusable Hook-based behavior. Custom Hooks can encapsulate local state, but invoking the
same Hook in different components does not share that state.

`10-context-provider.md` describes distributing state or other values through Context. A Context provider can own local
state and expose it to descendants, but Context is a distribution mechanism rather than a requirement for local state.

`12-context-partitioning.md` addresses how Context boundaries can separate independent state domains.

`25-external-store.md` describes state whose authoritative owner exists outside an individual React component instance.

`18-resource-cache.md` addresses shared resource ownership, reuse, deduplication, freshness, and invalidation. Those
concerns should not be recreated by duplicating asynchronous state in individual components.

`19-server-state.md` addresses remote authoritative state and its synchronization lifecycle. Local UI state surrounding
server data should remain distinct from ownership of the server resource itself.

`46-component-identity.md` defines component instance identity and therefore the lifetime boundary within which local
state is preserved.

`45-stable-keys.md` explains how stable keys participate in preserving identity for collections. Keys can therefore
affect whether local state is preserved or discarded.

## Design Rules

1. Keep state at the narrowest boundary that can correctly own it.

2. Store authoritative mutable information, not values that can be derived during rendering.

3. Use functional updates when the next state depends on the previous state.

4. Treat state as immutable data and produce new object or array representations when updating them.

5. Do not copy props into local state without an intentional ownership transition.

6. Do not promote local state to Context or an external store without a concrete sharing or ownership requirement.

7. Do not duplicate shared authoritative state across multiple component instances.

8. Use reducers when related local state has complex transitions or invariants.

9. Treat component identity as part of local-state lifetime.

10. Keep local UI state distinct from ownership of external resources and server data.

11. Expose behavior through component contracts rather than exposing internal state representation unnecessarily.

12. Prefer the simplest ownership model that satisfies the actual coordination requirements.

## Summary

Local state is mutable state owned by a React component instance. It is preserved with that component's identity and is
independent between separate instances.

The important decision is not whether `useState` or `useReducer` is used. The important decision is whether the
component is the correct authoritative owner.

Local state is the default for isolated, transient, component-specific behavior. State should move to a broader boundary
only when coordination, sharing, persistence, external ownership, or resource-management requirements justify that
change.
