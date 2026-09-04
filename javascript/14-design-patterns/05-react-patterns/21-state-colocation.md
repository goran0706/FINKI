# State Colocation

State Colocation is the practice of keeping React state as close as possible to the components that own and use it,
rather than moving state to a higher component or distributing it through Context without a concrete need.

The pattern establishes a default ownership rule: state should live at the lowest component boundary that can correctly
own it while still being accessible to every component that needs it.

Colocation is not the absence of shared state. It is a strategy for determining the appropriate scope of state
ownership.

## Intent

Keep state local to the smallest meaningful component subtree so that ownership, updates, dependencies, and lifecycle
remain close to the behavior they control.

Instead of moving every piece of state to a common ancestor:

```tsx
function Application() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState("overview");

    return (
        <Page
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
        />
    );
}
```

state is kept near the components that actually use it:

```tsx
function SearchPanel() {
    const [searchQuery, setSearchQuery] = useState("");

    // ...
}

function DetailsPanel() {
    const [selectedTab, setSelectedTab] = useState("overview");

    // ...
}

function Dialog() {
    const [isOpen, setIsOpen] = useState(false);

    // ...
}
```

The resulting component tree has narrower state ownership boundaries.

## State Ownership

The central question is not simply where state can be stored. It is where the state logically belongs.

For example, a dialog's open state generally belongs to the component responsible for that dialog:

```tsx
function DeleteDialog() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)}>
                Delete
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                ...
            </Dialog>
        </>
    );
}
```

The parent does not need to know that the dialog has an `open` state.

The state is an implementation detail of the dialog's behavior.

Moving it upward without a consumer that actually requires ownership increases the parent's responsibilities without
providing a corresponding architectural benefit.

## Lowest Common Owner

A useful rule for shared state is to place it at the lowest common ancestor of all components that genuinely need to
read or modify it.

Consider two sibling components:

```tsx
function Editor() {
    const [value, setValue] = useState("");

    return (
        <>
            <EditorInput value={value} onChange={setValue}/>
            <CharacterCount value={value}/>
        </>
    );
}
```

Both `EditorInput` and `CharacterCount` require the same state.

The state therefore belongs in their common owner:

```tsx
function Editor() {
    const [value, setValue] = useState("");

    return (
        <>
            <EditorInput value={value} onChange={setValue}/>
            <CharacterCount value={value}/>
        </>
    );
}
```

The important point is that the state is lifted only as far as required.

It does not need to move into `Application` merely because multiple components consume it.

## Avoiding Premature State Lifting

State Lifting is useful when multiple components need shared state.

It becomes unnecessary when state is moved upward before there is a concrete sharing requirement.

For example:

```tsx
function Page() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Toolbar
            isOpen={isOpen}
            onOpen={() => setIsOpen(true)}
        />
    );
}
```

If only `Toolbar` uses the state, the ownership boundary is unnecessarily high.

Instead:

```tsx
function Toolbar() {
    const [isOpen, setIsOpen] = useState(false);

    // ...
}
```

Premature lifting creates unnecessary props, dependencies, and parent rerenders.

## Prop Drilling as a Colocation Signal

Prop drilling can indicate that state has been placed too high, but it does not automatically mean Context should be
introduced.

Consider:

```tsx
function Page() {
    const [query, setQuery] = useState("");

    return <Content query={query} onQueryChange={setQuery}/>;
}

function Content(props) {
    return <SearchPanel {...props} />;
}

function SearchPanel({query, onQueryChange}) {
    // ...
}
```

If `Content` does not own or use `query`, the state may simply be located too high.

Moving the state closer to `SearchPanel` can eliminate the prop chain:

```tsx
function SearchPanel() {
    const [query, setQuery] = useState("");

    // ...
}
```

This is often preferable to introducing Context solely to avoid passing props through an otherwise simple component
hierarchy.

## Colocation and Component Boundaries

Colocation is closely related to component decomposition.

A component that owns a stateful behavior can encapsulate both the state and the UI that depends on it:

```tsx
function AccordionItem() {
    const [open, setOpen] = useState(false);

    return (
        <section>
            <button onClick={() => setOpen((value) => !value)}>
                Toggle
            </button>

            {open && <Panel/>}
        </section>
    );
}
```

The state does not need to be exposed to the rest of the application because the behavior is entirely internal to the
component.

This creates a clear boundary:

* the component owns the state;
* the component determines how the state changes;
* the component renders according to the state;
* external consumers do not depend on the internal representation.

## Colocating State with Its Behavior

State is often most maintainable when its update logic is located beside the operations that modify it.

For example:

```tsx
function SearchBox() {
    const [query, setQuery] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setQuery(event.target.value);
    }

    function clear() {
        setQuery("");
    }

    return (
        <>
            <input value={query} onChange={handleChange}/>
            <button onClick={clear}>Clear</button>
        </>
    );
}
```

The state, mutation operations, and UI remain within one ownership boundary.

This reduces the number of components that need to understand the state's representation.

## Colocating Derived State

Derived values should generally remain close to the state from which they are derived.

```tsx
function CartSummary({items}: Props) {
    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    return <span>{total}</span>;
}
```

There is no reason to lift `total` into a parent merely because multiple components might theoretically need it.

If another component independently needs the same derivation, the calculation can be extracted into a shared function:

```tsx
function calculateCartTotal(items: CartItem[]) {
    return items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
}
```

State ownership and reusable computation are separate concerns.

## Avoiding Redundant State

Colocation also helps prevent state from being introduced for values that can be derived from existing state.

Instead of:

```tsx
function UserList({users}: Props) {
    const [userCount, setUserCount] = useState(users.length);

    // ...
}
```

derive it:

```tsx
function UserList({users}: Props) {
    const userCount = users.length;

    // ...
}
```

Duplicating state creates synchronization responsibilities.

Colocation does not mean "store everything locally." It means ownership should be intentional, and values that do not
require independent state should not be promoted into state merely because they are used by a component.

## Colocating Temporary UI State

Transient UI state is a strong candidate for colocation.

Examples include:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [isHovered, setIsHovered] = useState(false);
const [isExpanded, setIsExpanded] = useState(false);
const [query, setQuery] = useState("");
const [draft, setDraft] = useState("");
```

When these values affect only one component or one small subtree, keeping them local prevents unrelated components from
becoming dependent on them.

A page should not generally own every dropdown, tooltip, input draft, or expandable section simply because those
components happen to appear on the page.

## Colocating Form State

Form state is often local to the form boundary.

```tsx
function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function submit() {
        // ...
    }

    return (
        <form onSubmit={submit}>
            <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />

            <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />

            <button type="submit">Sign in</button>
        </form>
    );
}
```

The application shell does not need to own the input values unless another part of the application genuinely requires
access to them.

Form-specific state can remain inside the form boundary and be exposed through callbacks or submission events.

## Colocating State with a Feature

State can be scoped to a feature rather than to an individual component when several components within that feature need
it.

For example:

```tsx
function Checkout() {
    const [step, setStep] = useState<CheckoutStep>("shipping");

    return (
        <CheckoutLayout>
            <CheckoutProgress step={step}/>
            <CheckoutContent step={step} onStepChange={setStep}/>
        </CheckoutLayout>
    );
}
```

The checkout feature owns its workflow state.

The application root does not need to own `step` simply because the feature is rendered from the application.

If the feature grows and multiple distant descendants require the same state, Context, a reducer, or another
shared-state mechanism may become appropriate. The initial ownership decision should still begin with the narrowest
valid scope.

## Colocation and Context

Context is not a replacement for state ownership.

A Provider can distribute state that is already correctly owned by a particular subtree:

```tsx
function CheckoutProvider({children}: Props) {
    const [step, setStep] = useState<CheckoutStep>("shipping");

    return (
        <CheckoutContext.Provider value={{step, setStep}}>
            {children}
        </CheckoutContext.Provider>
    );
}
```

The state remains colocated with the checkout feature.

Context merely changes how descendants access it.

This distinction prevents a common architectural error in which all state is moved into global Context because Context
makes it accessible.

## Context Should Follow Ownership

If state belongs to a feature, the corresponding Provider should generally be scoped to that feature:

```tsx
function Application() {
    return (
        <ApplicationShell>
            <CheckoutProvider>
                <Checkout/>
            </CheckoutProvider>
        </ApplicationShell>
    );
}
```

rather than:

```tsx
function Application() {
    return (
        <GlobalApplicationProvider>
            <ApplicationShell/>
        </GlobalApplicationProvider>
    );
}
```

with checkout state embedded in the global Provider.

The latter expands the scope of the dependency without necessity.

Colocation therefore applies to Context as well as to ordinary component state: keep the ownership boundary as narrow as
the requirements allow.

## Colocation and External Stores

An external store is appropriate when state must exist outside an individual component subtree or requires a
subscription model beyond ordinary React state and Context.

Colocation remains the default for state that is naturally component-owned.

For example, a local modal does not need an external store merely because an external store can represent it:

```tsx
function Modal() {
    const [open, setOpen] = useState(false);

    // ...
}
```

An external store becomes relevant when the state has broader ownership requirements, such as application-wide data
shared across independently mounted parts of the UI.

The existence of an external-state mechanism does not eliminate the need to determine the correct ownership scope.

## Colocation and Server State

Server state should not automatically be copied into local component state.

For example:

```tsx
function UserProfile() {
    const user = useUserQuery();

    // ...
}
```

If the user data is owned by a server-state cache, copying it into local state:

```tsx
function UserProfile() {
    const user = useUserQuery();
    const [localUser, setLocalUser] = useState(user);

    // ...
}
```

creates two representations of the same data.

The component should instead keep genuinely local UI state local while allowing server-state infrastructure to own
server data.

Colocation is about appropriate ownership, not about forcing every value into `useState`.

## Colocation and Custom Hooks

A custom Hook can preserve colocation while extracting reusable stateful behavior.

```tsx
function useSearchBox() {
    const [query, setQuery] = useState("");

    function clear() {
        setQuery("");
    }

    return {
        query,
        setQuery,
        clear,
    };
}
```

The component remains the consumer of the behavior:

```tsx
function SearchBox() {
    const {query, setQuery, clear} = useSearchBox();

    // ...
}
```

The state is still scoped to the Hook invocation.

Extracting implementation into a custom Hook does not automatically make the state global or shared between components.
Each invocation has its own state unless the Hook explicitly accesses shared state such as Context or an external store.

## Colocation and Reducers

A reducer can be colocated with the component or feature that owns the state.

```tsx
function Editor() {
    const [state, dispatch] = useReducer(
        editorReducer,
        initialEditorState,
    );

    // ...
}
```

The reducer may be extracted into a separate module for maintainability while the state remains locally owned.

```tsx
import {editorReducer} from "./editor-reducer";

function Editor() {
    const [state, dispatch] = useReducer(
        editorReducer,
        initialEditorState,
    );

    // ...
}
```

Physical file location is not the same as state ownership. The reducer can be reusable code while the state remains
scoped to one component instance.

## Colocation and Component Instances

Colocation naturally gives each component instance independent state.

```tsx
function AccordionItem() {
    const [open, setOpen] = useState(false);

    // ...
}
```

Rendering the component twice creates two independent state instances:

```tsx
<>
    <AccordionItem/>
    <AccordionItem/>
</>
```

The state belongs to each instance rather than to the component type globally.

This is one of the major benefits of local state: ownership follows component identity.

## Colocation and Component Identity

State is associated with a component position and identity in the rendered tree.

Changing the component structure or its key can therefore affect whether local state is preserved or recreated.

For example:

```tsx
<Item key={item.id}/>
```

uses the item's stable identity to determine which state instance belongs to which item.

State Colocation does not define key semantics, but colocated state makes those identity relationships particularly
visible.

Component Identity and Stable Keys are separate concerns.

## Colocation and Performance

Colocating state can reduce the rendering impact of state updates because fewer ancestors depend on the changing state.

Consider:

```tsx
function Application() {
    const [query, setQuery] = useState("");

    return (
        <Page
            query={query}
            onQueryChange={setQuery}
        />
    );
}
```

Every update originates from a high-level component.

If the state belongs only to a search component:

```tsx
function SearchBox() {
    const [query, setQuery] = useState("");

    return (
        <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
        />
    );
}
```

the state update is scoped to that component's subtree.

This can reduce unnecessary rendering work and simplify memoization requirements.

Performance is a consequence of narrower ownership, not the sole reason for colocation.

## Colocation and Effects

Effects should generally be colocated with the state and behavior they synchronize.

```tsx
function SearchBox() {
    const [query, setQuery] = useState("");

    useEffect(() => {
        // synchronize search behavior
    }, [query]);

    // ...
}
```

Moving the query state to a distant parent may also force the associated synchronization logic upward.

That expands the parent's responsibilities and can create dependencies between unrelated behavior.

Colocating state and its synchronization logic keeps the lifecycle of the behavior coherent.

## Colocation and Event Handlers

State should generally remain with the component that owns the interaction causing the state transition.

```tsx
function Disclosure() {
    const [open, setOpen] = useState(false);

    function toggle() {
        setOpen((value) => !value);
    }

    return (
        <button onClick={toggle}>
            {open ? "Close" : "Open"}
        </button>
    );
}
```

The event handler and state transition are local to the same ownership boundary.

If the state genuinely needs external control, it can be lifted and the component can become controlled. That is an
explicit change in ownership rather than an assumption that all state should begin at the parent.

## Controlled Components as an Alternative

Colocation is the natural default for internally owned state.

A controlled component deliberately transfers ownership to its parent:

```tsx
function SearchBox({
                       value,
                       onChange,
                   }: {
    value: string;
    onChange(value: string): void;
}) {
    return (
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
        />
    );
}
```

The parent owns the state because external coordination requires it.

```tsx
function SearchPage() {
    const [query, setQuery] = useState("");

    return (
        <SearchBox
            value={query}
            onChange={setQuery}
        />
    );
}
```

The Controlled Component pattern is therefore a deliberate mechanism for changing state ownership.

Colocation remains the default until the requirements justify transferring ownership.

## Uncontrolled Components

Uncontrolled components can keep transient input state inside the DOM rather than React state.

```tsx
function SearchForm() {
    return (
        <form>
            <input name="query"/>
            <button type="submit">Search</button>
        </form>
    );
}
```

This is another form of localized ownership: the input's current value is not promoted into React state.

Whether state should be owned by React, the DOM, a parent, Context, or an external store is an ownership decision based
on the requirements.

## State Lifetime

State should generally have a lifetime that matches the behavior it represents.

A temporary dialog state should disappear when its owning component instance disappears.

A feature workflow should exist while the feature exists.

Application-wide state may need to survive navigation or be shared across independently rendered areas.

Choosing a state scope that is wider than the state lifetime can create unnecessary persistence and coupling.

Choosing one that is narrower can cause state to be lost when the component is recreated.

Colocation therefore considers both access requirements and lifetime.

## Common Misuse

A common misuse is lifting all state to a page or application component "just in case."

```tsx
function Application() {
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [draft, setDraft] = useState("");

    // ...
}
```

This creates a central state owner without a corresponding requirement.

Another misuse is introducing Context whenever props must cross one intermediate component:

```tsx
<Page>
    <Layout>
        <Panel>
            <SearchBox/>
        </Panel>
    </Layout>
</Page>
```

A short prop chain is often clearer than a new Context.

Another misuse is placing every feature's state into one global Context because the application already has a Provider.

Another misuse is confusing reusable logic with shared state. Extracting a custom Hook does not mean that all components
using it share the same state.

Another misuse is optimizing exclusively for fewer rerenders while creating fragmented and semantically incoherent state
ownership. Performance should support the architectural boundary rather than replace it.

## Advantages

State Colocation keeps ownership close to the behavior it controls, reduces unnecessary dependencies, limits the scope
of updates, simplifies component APIs, and makes state lifetime easier to reason about.

It also reduces the need for prop drilling and Context when state does not actually need to be shared.

Local ownership tends to make components more self-contained and reduces the amount of application-wide state that must
be understood when modifying a feature.

## Disadvantages

State that genuinely needs to be shared cannot remain isolated indefinitely.

As requirements grow, colocated state may need to be lifted to a common owner or distributed through Context or another
shared-state mechanism.

Determining the correct boundary can also require architectural judgment. The lowest possible scope is not always the
correct scope if multiple components legitimately need coordinated ownership.

## When to Use

Use State Colocation as the default state-ownership strategy.

Keep state local when only one component or small subtree needs it, when the state represents transient UI behavior,
when its lifetime matches a particular component or feature, or when there is no concrete requirement for external
access.

Lift or distribute the state only when another component or architectural boundary genuinely requires access.

## When Not to Use

Do not force state to remain local when multiple independently owned components need coordinated access.

State should be lifted when a common owner is required, distributed through Context when a subtree needs a shared
dependency, or moved to an external store when the state requires broader ownership or subscription semantics.

Colocation is a default, not an absolute rule.

## Relationship to Other Patterns

State Lifting moves state upward when multiple components require a common owner. Colocation establishes the default
position before that lifting occurs.

Controlled Components deliberately transfer state ownership from a component to its parent.

Uncontrolled Components keep interaction state outside React's controlled state model.

Context Provider distributes an already-owned value through a subtree.

Context Partitioning separates independently meaningful distributed state into multiple Context boundaries.

Custom Hooks can extract colocated stateful behavior without making the state shared.

Reducer Pattern provides structured state transitions and can be used with colocated local state.

External Store provides shared state outside an individual React component subtree.

Component Identity determines when a colocated state instance is preserved or recreated.

## Summary

State Colocation means keeping state at the narrowest component or feature boundary that can correctly own it.

The practical rule is:

```tsx
function Feature() {
    const [state, setState] = useState(initialState);

    return (
        <>
            <PartA state={state}/>
            <PartB onChange={setState}/>
        </>
    );
}
```

Only when `state` must be shared beyond that boundary should ownership move outward.

The important distinction is between "state can be made globally accessible" and "state needs to be globally
accessible." React makes it easy to lift state, add Context, or introduce external stores. State Colocation establishes
a stronger default: do not expand the ownership boundary until the requirements justify doing so.
