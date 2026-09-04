# State Hooks

## Intent

State Hooks provide React components with state that persists across renders and a mechanism for scheduling updates to
that state.

The primary State Hook is `useState`. It is appropriate when a component owns state whose next value can be expressed
directly or through a state transition derived from the previous value.

State Hooks establish local state ownership. They do not determine whether state should be local, lifted, shared through
Context, stored externally, or managed by a reducer. Those are separate architectural decisions.

The central principle is that state belongs to the component instance that owns the behavior represented by that state,
and State Hooks provide the mechanism through which that component retains and updates it across renders.

## Basic Pattern

The simplest State Hook is `useState`.

```tsx
import {useState} from "react";

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    );
}
```

`useState` returns two values:

1. The current state value.
2. A state setter used to request an update.

The state value belongs to the current render.

Calling the setter schedules another render with the updated state.

## State Persists Across Renders

Local variables do not persist their values between renders.

```tsx
function Counter() {
    let count = 0;

    return (
        <button onClick={() => {
            count += 1;
        }}>
            {count}
        </button>
    );
}
```

The local variable is recreated during every render.

State created with `useState` is different:

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    );
}
```

React associates the state with the component instance and preserves it across renders while that instance retains its
identity.

## State Belongs to the Component Instance

State is associated with a particular React component instance.

Two instances of the same component have independent State Hook values:

```tsx
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

The two counters do not share `count`.

Each component instance owns its own state.

Sharing state requires a different ownership model.

## Initial State

The argument passed to `useState` defines the initial state.

```tsx
const [count, setCount] = useState(0);
```

The initial value is used when the component instance is initialized.

Subsequent renders do not reset the state simply because the `useState` call is evaluated again.

```tsx
function Example({initialCount}: { initialCount: number }) {
    const [count, setCount] = useState(initialCount);

    return
...
    ;
}
```

Changing `initialCount` after the component has mounted does not automatically replace `count`.

The value passed to `useState` is initialization input, not a continuously synchronized source of state.

## Lazy Initial State

When calculating the initial state is expensive, the initializer can be provided as a function.

```tsx
const [items, setItems] = useState(() => createInitialItems());
```

The initializer allows React to obtain the initial state without requiring the initialization calculation to be
expressed as an eagerly computed value during every render.

This is useful when initialization involves meaningful computation.

Do not use lazy initialization merely because it is syntactically available. A trivial initializer does not need
unnecessary indirection.

## State Is a Snapshot

The state variable returned by `useState` represents the state associated with the current render.

Consider:

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
        console.log(count);
    }

    return <button onClick={handleClick}>{count}</button>;
}
```

The `console.log` observes the `count` value captured by the current render.

Calling `setCount` does not mutate the local `count` variable in place.

Instead, it schedules a new render in which React provides the next state value.

This snapshot model is fundamental to understanding State Hooks.

## State Updates Schedule Rendering

Calling a setter requests a state update.

```tsx
setCount(10);
```

React processes the update and, when appropriate, renders the component again.

The setter should therefore be understood as an update mechanism rather than a direct assignment operation.

Do not reason about:

```tsx
setCount(10);
```

as equivalent to:

```tsx
count = 10;
```

The former participates in React's rendering model. The latter is merely mutation of a local variable.

## Direct State Updates

When the next state does not depend on the previous state, a direct value is often sufficient.

```tsx
setOpen(true);
setOpen(false);
setName("Alice");
setSelectedId("item-42");
```

This expresses the desired next state directly.

## Functional State Updates

When the next state depends on the previous state, use the functional updater form.

```tsx
setCount(previousCount => previousCount + 1);
```

This is especially important when multiple updates are scheduled before React renders the next state.

For example:

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    function incrementThreeTimes() {
        setCount(value => value + 1);
        setCount(value => value + 1);
        setCount(value => value + 1);
    }

    return (
        <>
            <p>{count}</p>
            <button onClick={incrementThreeTimes}>
                +3
            </button>
        </>
    );
}
```

Each updater receives the state produced by the previous update in the sequence.

This makes the dependency on previous state explicit.

## Prefer Functional Updates for Derived State

When an update is mathematically or logically derived from the previous state, the functional form communicates the
correct dependency.

Prefer:

```tsx
setCount(count => count + 1);
```

over:

```tsx
setCount(count + 1);
```

when the update is being expressed as a transformation of previous state.

The functional form is particularly important for asynchronous callbacks, queued updates, and other situations where
relying on a render's captured value can produce stale updates.

## Multiple Updates

React may process multiple state updates together.

Therefore code should not depend on a setter immediately changing the state variable available to the current render.

For example:

```tsx
function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
}
```

Both expressions use the same `count` value from the current render.

When the intention is to increment twice, use:

```tsx
function handleClick() {
    setCount(value => value + 1);
    setCount(value => value + 1);
}
```

The updater form describes the sequence of state transformations rather than repeatedly calculating from one captured
snapshot.

## State Equality and Bailouts

React can avoid unnecessary work when an update does not produce a different state value according to its state
comparison semantics.

For primitive values:

```tsx
setCount(10);
setCount(10);
```

does not represent a meaningful state change after `count` is already `10`.

For objects and arrays, identity matters.

```tsx
const [user, setUser] = useState({
    name: "Alice",
});
```

Creating a new object produces a different reference:

```tsx
setUser({
    name: "Alice",
});
```

Even though the contents may be equivalent, the object identity is different.

State design should therefore distinguish value equality from object identity.

## Object State

State Hooks can hold objects.

```tsx
const [user, setUser] = useState({
    name: "",
    email: "",
});
```

When updating an object state value, create the intended next object rather than mutating the existing state object.

```tsx
setUser(previous => ({
    ...previous,
    name: "Alice",
}));
```

The previous state remains conceptually immutable from the component's perspective.

## Do Not Mutate State

Avoid:

```tsx
user.name = "Alice";
setUser(user);
```

The existing state object has been mutated.

Instead:

```tsx
setUser(previous => ({
    ...previous,
    name: "Alice",
}));
```

The new object represents the next state.

This creates a clear distinction between the previous state and the next state and allows React's identity-based update
model to work correctly.

## Nested State

For nested objects, update each affected level immutably.

```tsx
const [profile, setProfile] = useState({
    name: "",
    address: {
        city: "",
        country: "",
    },
});
```

Updating `city` can be expressed as:

```tsx
setProfile(previous => ({
    ...previous,
    address: {
        ...previous.address,
        city: "Tetovo",
    },
}));
```

The unchanged portions can retain their existing references while the modified path receives new objects.

For deeply nested state with many related transitions, a reducer can provide a clearer state-transition model.

## Array State

Arrays held in state should likewise be replaced rather than mutated.

Add an item:

```tsx
setItems(previous => [
    ...previous,
    newItem,
]);
```

Remove an item:

```tsx
setItems(previous =>
    previous.filter(item => item.id !== itemId)
);
```

Update an item:

```tsx
setItems(previous =>
    previous.map(item =>
        item.id === itemId
            ? {...item, completed: true}
            : item
    )
);
```

Avoid mutating the existing array with operations such as `push`, `pop`, or `splice` on the state value itself.

## Primitive State

Primitive state is often the simplest form of local state.

```tsx
const [isOpen, setIsOpen] = useState(false);
const [name, setName] = useState("");
const [page, setPage] = useState(1);
const [selectedId, setSelectedId] = useState<string | null>(null);
```

Separate primitives are often clearer when the values represent independent pieces of state.

## Multiple State Hooks

A component can use multiple State Hooks.

```tsx
function Form() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    return
...
    ;
}
```

Separate state variables can make independent updates explicit.

They also allow each state value to have its own update semantics.

## Grouping Related State

Multiple State Hooks are not always the best representation.

Consider:

```tsx
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
```

This can be appropriate when each field changes independently.

A related state object can also be appropriate:

```tsx
const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
});
```

The decision should be based on the conceptual relationship between the values and how they change.

State should not be grouped merely because the values happen to be rendered by the same component.

## Avoid Contradictory State

Separate State Hooks can accidentally represent the same underlying fact multiple times.

For example:

```tsx
const [selectedId, setSelectedId] = useState<string | null>(null);
const [hasSelection, setHasSelection] = useState(false);
```

These values can become inconsistent.

If `hasSelection` is completely determined by `selectedId`, it should normally be derived:

```tsx
const hasSelection = selectedId !== null;
```

Store the minimal authoritative state and derive values that can be calculated from it.

## Avoid Redundant State

Do not store values that can be derived directly from existing state or props.

Instead of:

```tsx
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [fullName, setFullName] = useState("");
```

derive:

```tsx
const fullName = `${firstName} ${lastName}`;
```

Duplicating derived values creates additional synchronization responsibilities and additional opportunities for
inconsistent state.

## State Versus Props

Props represent values supplied by a parent.

State represents values owned by the component instance.

```tsx
function Counter({initialCount}: { initialCount: number }) {
    const [count, setCount] = useState(initialCount);

    return
...
    ;
}
```

`initialCount` is an input.

`count` is local state.

The two concepts should not be conflated.

A prop does not automatically become synchronized local state merely because it is passed to `useState`.

## Initial Props Are Not Continuous State

This pattern:

```tsx
const [value, setValue] = useState(props.value);
```

means that `props.value` initializes the state.

It does not mean:

```tsx
props.value === value
```

for the lifetime of the component.

If the component must continuously reflect the parent's value, local state may be the wrong ownership model.

A controlled component or lifted state may be more appropriate.

## Resetting State

State can be reset by explicitly assigning a new value:

```tsx
setCount(0);
```

This resets the value but does not necessarily reset the entire component instance.

React component identity provides another reset mechanism.

Changing a component's key can cause React to treat it as a different instance:

```tsx
<UserForm key={userId} userId={userId}/>
```

That causes the previous instance's state to be discarded and a new state lifecycle to begin.

State resetting through component identity is distinct from updating a State Hook value.

## State and Component Identity

State persistence depends on React preserving the component instance.

For example:

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    return
...
    ;
}
```

If React preserves that component's identity, its state is preserved.

If the component is replaced with a different identity, the State Hook belongs to the old instance and does not transfer
automatically.

State therefore depends on the component identity model rather than merely the component function's source code.

## Hook Call Order

Hooks must be called consistently.

Correct:

```tsx
function Example({enabled}: { enabled: boolean }) {
    const [count, setCount] = useState(0);

    if (!enabled) {
        return null;
    }

    return
...
    ;
}
```

Incorrect:

```tsx
function Example({enabled}: { enabled: boolean }) {
    if (enabled) {
        const [count, setCount] = useState(0);
    }

    return
...
    ;
}
```

The Hook call order must remain stable between renders.

Do not conditionally call State Hooks.

## State Hooks in Loops

Do not create State Hook calls dynamically inside loops.

Incorrect:

```tsx
function Example({items}: { items: Item[] }) {
    return items.map(item => {
        const [value, setValue] = useState("");

        return
    ...
        ;
    });
}
```

If each item requires independent state, extract an actual component:

```tsx
function ItemRow({item}: { item: Item }) {
    const [value, setValue] = useState("");

    return
...
    ;
}

function List({items}: { items: Item[] }) {
    return items.map(item => (
        <ItemRow key={item.id} item={item}/>
    ));
}
```

Each `ItemRow` then owns its own State Hook.

## State and Event Handlers

State updates are commonly initiated by event handlers.

```tsx
function Toggle() {
    const [enabled, setEnabled] = useState(false);

    function handleClick() {
        setEnabled(value => !value);
    }

    return (
        <button onClick={handleClick}>
            {enabled ? "Enabled" : "Disabled"}
        </button>
    );
}
```

The event handler expresses the user-driven state transition.

This is distinct from using an Effect to react to the resulting state change.

## State and Effects

State Hooks and Effects solve different problems.

State stores React-owned information:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

An Effect synchronizes with an external system:

```tsx
useEffect(() => {
    document.body.classList.toggle("modal-open", isOpen);
}, [isOpen]);
```

The State Hook does not require an Effect simply because its value changes.

An Effect is appropriate when the state change must synchronize with something outside React.

## State and Derived Values

State should represent authoritative information rather than every value that appears in the UI.

For example:

```tsx
const [items, setItems] = useState<Item[]>([]);
const [query, setQuery] = useState("");
```

A filtered list can be derived:

```tsx
const filteredItems = items.filter(item =>
    item.name.includes(query)
);
```

There is normally no need to maintain a third state value for `filteredItems`.

This reduces synchronization complexity.

## State and Memoization

Derived values do not automatically need state.

For an inexpensive calculation:

```tsx
const total = items.reduce(
    (sum, item) => sum + item.price,
    0
);
```

Use ordinary computation.

If a calculation is expensive and its inputs change infrequently, memoization may be appropriate:

```tsx
const total = useMemo(
    () => calculateTotal(items),
    [items]
);
```

The distinction is:

* State represents information that persists and changes over time.
* Derived computation calculates a value from existing inputs.
* Memoization controls recomputation.
* Effects synchronize with external systems.

These mechanisms should not be substituted for one another.

## State and Reducers

`useState` is appropriate for straightforward state transitions.

```tsx
const [isOpen, setIsOpen] = useState(false);
```

When state transitions become numerous, interdependent, or event-oriented, `useReducer` may provide a clearer model.

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

The distinction is not that `useReducer` is more powerful state and `useState` is primitive state.

Both manage React-owned state.

The reducer pattern is primarily about expressing state transitions explicitly and centralizing transition logic.

## Choosing Between Multiple State Hooks and a Reducer

Prefer separate State Hooks when:

* Values are independent.
* Updates are simple.
* There are few transition rules.
* Each value has a straightforward setter.

Consider a reducer when:

* Multiple values change together.
* Many actions can affect the same state.
* Transition rules are becoming complex.
* State transitions need explicit names.
* The transition logic benefits from centralized testing.

Do not introduce a reducer simply because an object contains several fields.

## State Ownership

A State Hook should normally live at the component level that owns the state.

If only one component needs the state:

```tsx
function SearchBox() {
    const [query, setQuery] = useState("");

    return
...
    ;
}
```

local state is appropriate.

If two sibling components need the same authoritative value, moving the state to their common owner may be appropriate.

```tsx
function SearchPage() {
    const [query, setQuery] = useState("");

    return (
        <>
            <SearchInput query={query} onQueryChange={setQuery}/>
            <SearchResults query={query}/>
        </>
    );
}
```

This is a state-ownership decision, not a limitation of State Hooks.

## State Colocation

State should generally be placed at the narrowest component scope that can correctly own it.

Avoid moving every State Hook to a high-level component merely because centralized state appears convenient.

Local ownership can reduce:

* Prop propagation.
* Unnecessary rendering dependencies.
* Shared mutable state.
* Coupling between unrelated components.

State should be lifted when multiple consumers genuinely require shared ownership.

## State Lifting

When state needs to coordinate multiple components, move it to their lowest common owner.

```tsx
function Tabs() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <>
            <TabList
                activeTab={activeTab}
                onChange={setActiveTab}
            />
            <TabPanel activeTab={activeTab}/>
        </>
    );
}
```

The State Hook remains local to `Tabs`, but the state is now owned at a level that can coordinate both children.

State lifting does not change the mechanics of `useState`; it changes where the Hook is placed.

## Controlled State

A component can expose state through props and callbacks rather than owning the authoritative state internally.

```tsx
function Dialog({
                    open,
                    onOpenChange,
                }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return
...
    ;
}
```

The parent may use:

```tsx
const [open, setOpen] = useState(false);

<Dialog
    open={open}
    onOpenChange={setOpen}
/>
```

The State Hook belongs to the parent because the parent owns the state.

This is a state ownership pattern rather than a different kind of State Hook.

## Uncontrolled State

A component may own its own state internally:

```tsx
function Dialog() {
    const [open, setOpen] = useState(false);

    return
...
    ;
}
```

Consumers do not directly control the authoritative value.

This can simplify APIs when external coordination is unnecessary.

The controlled/uncontrolled distinction concerns ownership of state, not the underlying `useState` primitive.

## Initial State and Controlled Components

A common API design is to support an initial value for uncontrolled usage:

```tsx
function Dialog({
                    defaultOpen = false,
                }: {
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return
...
    ;
}
```

`defaultOpen` initializes internal state.

It should not be interpreted as a continuously synchronized value.

A controlled version instead receives the current value:

```tsx
function Dialog({
                    open,
                    onOpenChange,
                }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return
...
    ;
}
```

These are different ownership contracts.

## State Initialization From Props

Initializing state from a prop is sometimes appropriate when the prop is explicitly a default.

```tsx
function Editor({
                    defaultValue,
                }: {
    defaultValue: string;
}) {
    const [value, setValue] = useState(defaultValue);

    return
...
    ;
}
```

The naming communicates the ownership transition.

`defaultValue` initializes local state.

A prop named `value` generally implies that the parent remains authoritative.

## State and Refs

State and refs both persist values across renders, but they serve different purposes.

State:

```tsx
const [count, setCount] = useState(0);
```

changes cause React to render again.

Refs:

```tsx
const countRef = useRef(0);
```

provide mutable storage whose changes do not themselves trigger rendering.

Use state when a value participates in the rendered output or React state model.

Use refs for mutable values that need to persist across renders without being rendered as state.

## State and Instance Variables

Function components do not have traditional mutable instance fields.

This:

```tsx
let value = 0;
```

is a render-local variable.

This:

```tsx
const [value, setValue] = useState(0);
```

is React-managed state.

This:

```tsx
const value = useRef(0);
```

is persistent mutable storage associated with the component instance.

These mechanisms have different lifecycle and rendering semantics.

## State and Asynchronous Callbacks

Asynchronous callbacks can observe state from the render in which the callback was created.

For state transitions based on the latest previous value, use functional updates.

```tsx
setCount(value => value + 1);
```

This is particularly important for:

* Timers.
* Promises.
* Event subscriptions.
* Deferred callbacks.
* External event sources.

If a callback needs the latest value without triggering a state update, a ref or another appropriate abstraction may be
necessary.

Do not treat a State Hook variable as mutable shared storage.

## State and Automatic Batching

React can batch multiple state updates so that multiple updates do not necessarily cause separate renders.

Code should therefore focus on expressing the intended state transitions rather than depending on immediate rendering
after every setter call.

For related sequential updates, functional updaters make the intended transformation explicit:

```tsx
setCount(value => value + 1);
setCount(value => value + 1);
```

The batching behavior is an implementation optimization and scheduling mechanism; the State Hook contract remains that
updates request new state.

## State Setter Identity

The setter returned by `useState` has stable identity across renders.

This allows it to be safely passed to child components or used in dependency relationships where the stable setter
identity matters.

For example:

```tsx
const [value, setValue] = useState("");

<Child onChange={setValue}/>
```

The setter does not need to be recreated manually.

## Passing Setters to Children

Passing a State Hook setter can be appropriate when a child is intentionally allowed to update parent-owned state.

```tsx
function Parent() {
    const [name, setName] = useState("");

    return (
        <NameInput
            value={name}
            onChange={setName}
        />
    );
}
```

However, exposing a raw setter is not always the best component API.

A semantic callback can make the allowed operation clearer:

```tsx
<NameInput
    value={name}
    onNameChange={setName}
/>
```

The API should communicate the ownership and capability the child is expected to use.

## State Setter as Functional API

The setter accepts either a next state value or an updater function.

```tsx
setValue(nextValue);
```

or:

```tsx
setValue(previousValue => deriveNextValue(previousValue));
```

The updater function is particularly valuable when multiple updates can be queued or when the current render's captured
value may not represent the state against which the transition should be applied.

## State Types in TypeScript

Type inference usually handles straightforward state:

```tsx
const [count, setCount] = useState(0);
```

The state is inferred as a number.

When the initial value does not fully express the intended type, provide a generic:

```tsx
const [selectedId, setSelectedId] = useState<string | null>(null);
```

For collections:

```tsx
const [items, setItems] = useState<Item[]>([]);
```

Explicit typing is especially useful when the initial value is structurally narrower than the eventual state.

## Nullable State

Nullable state is common when a value may not yet exist.

```tsx
const [user, setUser] = useState<User | null>(null);
```

Consumers must account for both states:

```tsx
if (user === null) {
    return <Loading/>;
}

return <Profile user={user}/>;
```

The type expresses the state machine directly rather than using an invalid placeholder value.

## Discriminated State

When state has distinct modes, a discriminated union can make those modes explicit.

```tsx
type RequestState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: User }
    | { status: "error"; error: Error };

const [state, setState] = useState<RequestState>({
    status: "idle",
});
```

This can be clearer than maintaining independent flags:

```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
const [data, setData] = useState<User | null>(null);
```

If the possible states have meaningful transition rules, a reducer may eventually provide an even clearer model.

## State as a Minimal Model

A strong State Hook design stores the smallest set of values required to represent the component's authoritative state.

For example:

```tsx
const [items, setItems] = useState<Item[]>([]);
const [query, setQuery] = useState("");
```

and:

```tsx
const visibleItems = items.filter(item =>
    item.name.includes(query)
);
```

is generally preferable to storing:

```tsx
const [items, setItems] = useState<Item[]>([]);
const [query, setQuery] = useState("");
const [visibleItems, setVisibleItems] = useState<Item[]>([]);
```

The latter introduces another state value that must remain synchronized.

## State Normalization

Complex object state can sometimes benefit from normalized representations.

For example:

```tsx
const [entities, setEntities] = useState<Record<string, User>>({});
const [selectedId, setSelectedId] = useState<string | null>(null);
```

The selected user is derived:

```tsx
const selectedUser =
    selectedId === null
        ? null
        : entities[selectedId];
```

This can prevent duplicated representations of the same entity.

However, normalization should solve an actual state-model problem rather than being introduced automatically.

## State Transition Cohesion

State values that frequently change together may belong to one coherent state model.

For example:

```tsx
type UploadState =
    | { status: "idle" }
    | { status: "uploading"; progress: number }
    | { status: "complete" }
    | { status: "error"; error: Error };
```

This expresses mutually exclusive states more precisely than independent booleans.

When transitions between these states become substantial, `useReducer` may provide a more explicit transition boundary.

## Avoid Boolean Explosion

A collection of booleans can produce impossible combinations:

```tsx
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [error, setError] = useState(false);
```

This allows states such as:

```text
loading = true
success = true
error = true
```

when the domain may require these states to be mutually exclusive.

A discriminated state model is often more precise.

```tsx
type Status =
    | "idle"
    | "loading"
    | "success"
    | "error";
```

Then:

```tsx
const [status, setStatus] = useState<Status>("idle");
```

## State and Persistence

A State Hook by itself does not persist state across page reloads.

```tsx
const [theme, setTheme] = useState("light");
```

The state exists for the lifetime of the React component instance.

If state must survive reloads, another persistence mechanism is required, such as:

* `localStorage`.
* `sessionStorage`.
* IndexedDB.
* Server-side persistence.
* An external store.

An Effect may synchronize State Hook values with such a persistence system, but persistence is not a property of
`useState` itself.

## State and External Stores

A State Hook is appropriate when React owns the authoritative state.

An external store is more appropriate when the authoritative state exists outside React and may be shared independently
of individual component instances.

For example:

```tsx
const [value, setValue] = useState(0);
```

means the component owns the value.

An external store instead has its own lifecycle and subscription mechanism, with React subscribing to it.

Do not use local State Hooks merely to duplicate state that is already authoritatively maintained elsewhere.

## State and Context

Context can distribute state to descendants, but Context does not itself replace State Hooks.

A provider may own state:

```tsx
function ThemeProvider({children}: PropsWithChildren) {
    const [theme, setTheme] = useState("light");

    return (
        <ThemeContext value={{theme, setTheme}}>
            {children}
        </ThemeContext>
    );
}
```

The State Hook owns the actual state.

Context provides access to it.

These are separate responsibilities.

## State and Server State

Server state is authoritative data owned by a remote system.

A State Hook can temporarily represent server-derived data, but using `useState` alone does not provide:

* Cache identity.
* Request deduplication.
* Invalidation.
* Freshness tracking.
* Background revalidation.
* Shared ownership.
* Retry policy.

When those capabilities are required, a server-state or resource abstraction may be more appropriate.

Local State Hooks remain useful for UI state surrounding server data.

## State and Async Requests

A State Hook can represent request status:

```tsx
const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
);
```

But State Hooks do not themselves perform or coordinate asynchronous work.

The request lifecycle belongs to another abstraction, such as an Effect, resource cache, or server-state manager.

Do not interpret:

```tsx
const [data, setData] = useState<Data | null>(null);
```

as a complete data-fetching architecture.

It is merely local state.

## State and Transitions

State updates can participate in React's scheduling model.

An update can be marked as a transition when it represents non-urgent UI work:

```tsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
    setSearchResults(nextResults);
});
```

The State Hook still owns the state.

The transition mechanism affects the scheduling priority of the update.

State Hooks and transitions therefore address different concerns.

## State and Deferred Values

`useDeferredValue` can provide a deferred representation of a value:

```tsx
const deferredQuery = useDeferredValue(query);
```

The original query remains the authoritative state:

```tsx
const [query, setQuery] = useState("");
```

The deferred value is derived scheduling behavior, not an additional authoritative state value that the component must
synchronize manually.

## State and Memoized Components

State updates can cause the component that owns the state to render again.

Memoized child components may still avoid unnecessary rendering when their props have not meaningfully changed.

For example:

```tsx
function Parent() {
    const [count, setCount] = useState(0);

    return (
        <>
            <button onClick={() => setCount(value => value + 1)}>
                {count}
            </button>

            <MemoizedChild/>
        </>
    );
}
```

The state update belongs to `Parent`.

Whether `MemoizedChild` renders depends on its own props and React's memoization behavior.

State ownership and component memoization are separate concerns.

## State and Component Keys

Changing a component's key can intentionally create a new component identity.

```tsx
<Editor key={documentId} documentId={documentId}/>
```

When React treats this as a different instance, the new instance receives its initial State Hook values.

This can be useful when the desired semantics are “new entity, new local state.”

Do not use keys as an arbitrary substitute for explicit state updates.

## Common Misuse: Mutating State

Incorrect:

```tsx
items.push(newItem);
setItems(items);
```

Correct:

```tsx
setItems(previous => [
    ...previous,
    newItem,
]);
```

The state value should be treated as immutable from the component's perspective.

## Common Misuse: Storing Derived Values

Avoid:

```tsx
const [items, setItems] = useState<Item[]>([]);
const [count, setCount] = useState(0);
```

when `count` is simply:

```tsx
const count = items.length;
```

Duplicated state creates synchronization problems without providing additional authoritative information.

## Common Misuse: Mirroring Props

Avoid automatically mirroring a prop into state:

```tsx
const [value, setValue] = useState(props.value);
```

when the component is expected to remain synchronized with `props.value`.

Either keep the prop as the authoritative value or explicitly define the prop as initialization/default input.

## Common Misuse: Using State for Every Variable

Not every changing value needs to be state.

A value that can be calculated during rendering should generally remain a derived value:

```tsx
const total = price * quantity;
```

There is no reason to create:

```tsx
const [total, setTotal] = useState(price * quantity);
```

unless `total` has independent state semantics.

## Common Misuse: Using Effects to Derive State

Avoid:

```tsx
const [fullName, setFullName] = useState("");

useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

If `fullName` is simply derived from `firstName` and `lastName`, calculate it directly:

```tsx
const fullName = `${firstName} ${lastName}`;
```

The Effect introduces an unnecessary synchronization cycle.

## Common Misuse: Using State as a Mutable Instance Field

Do not treat state as imperative storage:

```tsx
setValue(nextValue);
doSomethingImmediatelyWith(value);
```

The `value` variable remains the snapshot from the current render.

If an operation needs to execute immediately in response to an event, use the value already available to that event or
perform the operation directly rather than expecting the State Hook setter to mutate the current render.

## Common Misuse: State for Shared Mutable Data

If many unrelated components need to read and mutate the same authoritative data, creating separate State Hooks in each
component does not create shared state.

Each Hook creates state for its own component instance.

Use an appropriate shared ownership mechanism when state must actually be shared.

## Common Misuse: Excessive State Granularity

This:

```tsx
const [x, setX] = useState(0);
const [y, setY] = useState(0);
const [z, setZ] = useState(0);
const [mode, setMode] = useState("idle");
```

is not inherently wrong.

But if all four values always change together as one conceptual transition, a single state model or reducer may
communicate the relationship more clearly.

State structure should follow domain relationships rather than arbitrary stylistic rules.

## Common Misuse: Excessive State Aggregation

The opposite can also be problematic.

This:

```tsx
const [state, setState] = useState({
    firstName: "",
    lastName: "",
    isModalOpen: false,
    selectedTheme: "light",
    currentPage: 1,
});
```

groups unrelated state simply because it belongs to the same component.

Independent state often becomes easier to reason about when represented independently.

## Common Misuse: Using `useState` for Resource Ownership

A State Hook can store a reference to a resource:

```tsx
const [connection, setConnection] = useState<Connection | null>(null);
```

but storing a resource in state does not automatically manage its lifecycle.

If the component creates and destroys an external resource, an Effect or dedicated resource abstraction must own setup
and cleanup.

State can represent resource-related information without becoming the resource lifecycle mechanism.

## Common Misuse: State as an Event Bus

Do not use state merely to signal arbitrary events:

```tsx
setRefreshToken(token => token + 1);
```

when the value itself has no meaningful state semantics.

Sometimes such a pattern is legitimate, but it can indicate that event-driven behavior is being modeled as state.

If the operation represents an event rather than persistent UI state, an event handler or explicit command mechanism may
be clearer.

## Design Rules

A sound State Hook design follows these rules:

1. Use `useState` for React-owned state that persists across renders.
2. Treat state values as snapshots, not mutable variables.
3. Use functional updates when the next state depends on the previous state.
4. Treat state objects and arrays as immutable values.
5. Store authoritative information rather than redundant derived values.
6. Keep state at the narrowest component scope that can correctly own it.
7. Lift state when multiple components require shared ownership.
8. Use controlled state when a parent must remain authoritative.
9. Use default or initial values when a component should initialize local state without continuous synchronization.
10. Keep independent state independent when its transitions are unrelated.
11. Consider a reducer when state transitions become complex or strongly coupled.
12. Do not conditionally call State Hooks.
13. Do not use local state to duplicate authoritative external or server state unnecessarily.
14. Do not use Effects merely to derive values from existing state.
15. Do not treat state setters as synchronous assignments.
16. Use refs when persistent mutable storage is required without rendering.
17. Use memoization for expensive derived computation rather than converting the result into state.
18. Make state types represent valid domain states and avoid impossible combinations.
19. Use component identity deliberately when a complete local-state reset is required.
20. Keep state ownership separate from state distribution mechanisms such as Context.

## When to Use

Use State Hooks when:

* A component needs information to persist across renders.
* The component owns the information.
* Changes to the information should participate in rendering.
* State transitions are simple enough for direct setters.
* Local UI state does not need an external owner.
* A value cannot simply be derived from existing props or state.

Typical examples include:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [query, setQuery] = useState("");
const [selectedId, setSelectedId] = useState<string | null>(null);
const [page, setPage] = useState(1);
```

## When Not to Use

Do not use State Hooks when:

* The value can be derived directly during rendering.
* The value is merely a mutable reference that does not affect rendering.
* The state is already authoritatively maintained by an external store.
* The state represents server data requiring cache and synchronization semantics.
* The value represents an event rather than persistent state.
* An Effect is being used solely to keep redundant state synchronized.
* A reducer would provide a substantially clearer transition model.
* The state belongs to a different component and should be lifted or controlled.

## Summary

`useState` provides persistent, React-owned state for a component instance.

```tsx
const [value, setValue] = useState(initialValue);
```

The returned value is a snapshot for the current render, while the setter schedules a state update.

For transitions based on previous state:

```tsx
setValue(previous => deriveNextValue(previous));
```

For object and array state, produce new values rather than mutating existing state.

Store authoritative state and derive everything that can be derived. Keep state local when possible, lift it when shared
ownership is required, and use controlled or external ownership when the component should not be authoritative.

State Hooks provide the mechanism for local React state. They do not by themselves solve state architecture, external
synchronization, server-state management, resource ownership, or complex state-transition modeling. Those concerns
should be handled by the corresponding architectural patterns.
