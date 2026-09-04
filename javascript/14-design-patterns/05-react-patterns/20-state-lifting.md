# State Lifting

State Lifting is the practice of moving state from a component into a common ancestor so that multiple components can
coordinate through the same state owner.

The defining operation is a change in ownership. State that was previously local to one component is moved upward to the
lowest common ancestor that can provide the required access to all participating components.

## Intent

Establish a shared state owner when multiple components need to read or modify the same state.

Before lifting, a component may own its state locally:

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

If another component must also consume that state, the state can be moved into their common owner:

```tsx
function SearchPage() {
    const [query, setQuery] = useState("");

    return (
        <>
            <SearchBox
                query={query}
                onQueryChange={setQuery}
            />
            <SearchResults query={query}/>
        </>
    );
}
```

`SearchPage` now owns the state because both `SearchBox` and `SearchResults` require access to it.

## The Lowest Common Ancestor

The state should normally be lifted only as far as necessary.

Consider:

```tsx
function Editor() {
    return (
        <>
            <Toolbar/>
            <EditorInput/>
            <Preview/>
        </>
    );
}
```

If `EditorInput` and `Preview` need the same document value, `Editor` is the appropriate owner:

```tsx
function Editor() {
    const [document, setDocument] = useState("");

    return (
        <>
            <Toolbar/>
            <EditorInput
                value={document}
                onChange={setDocument}
            />
            <Preview value={document}/>
        </>
    );
}
```

There is no reason to move the state into `Application` if the state is only required inside `Editor`.

The lowest common ancestor rule limits the scope of the shared state.

## Why Lift State

State should be lifted when independently rendered components need a single source of truth.

Typical reasons include:

* two components must display the same value;
* one component changes a value that another component consumes;
* sibling components must coordinate their behavior;
* one component's state determines another component's rendering;
* multiple components must enforce the same state invariant;
* the state represents a workflow owned by a larger component or feature.

The key requirement is shared ownership.

If only one component needs the state, lifting it provides no sharing benefit.

## Single Source of Truth

Without lifting, two components may maintain independent copies:

```tsx
function SearchBox() {
    const [query, setQuery] = useState("");
    // ...
}

function SearchResults() {
    const [query, setQuery] = useState("");
    // ...
}
```

These states can diverge.

Lifting creates one authoritative value:

```tsx
function SearchPage() {
    const [query, setQuery] = useState("");

    return (
        <>
            <SearchBox
                query={query}
                onQueryChange={setQuery}
            />
            <SearchResults query={query}/>
        </>
    );
}
```

Both components now derive their behavior from the same state.

The goal is not merely to avoid duplicate variables. It is to establish one authoritative state representation.

## Controlled Component Boundary

State lifting commonly turns a previously self-contained component into a controlled component.

Before lifting:

```tsx
function Input() {
    const [value, setValue] = useState("");

    return (
        <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
        />
    );
}
```

After lifting:

```tsx
function Input({
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

The parent becomes the state owner:

```tsx
function Form() {
    const [value, setValue] = useState("");

    return (
        <Input
            value={value}
            onChange={setValue}
        />
    );
}
```

The component no longer decides the authoritative value. It renders according to the value supplied by its owner and
reports requested changes through its callback.

## State and Event Flow

Lifting state establishes a unidirectional relationship between owner and consumers.

The owner stores the state:

```tsx
function Parent() {
    const [value, setValue] = useState("");

    return (
        <Child
            value={value}
            onChange={setValue}
        />
    );
}
```

The child receives the current value and communicates an intended change:

```tsx
function Child({
                   value,
                   onChange,
               }: Props) {
    return (
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
        />
    );
}
```

The child does not maintain a second authoritative copy.

The parent owns the transition and provides the resulting state back to the child.

## Lifting State for Sibling Coordination

A common reason for lifting state is coordination between siblings.

For example:

```tsx
function Accordion() {
    const [openItem, setOpenItem] = useState<string | null>(null);

    return (
        <>
            <AccordionItem
                id="one"
                open={openItem === "one"}
                onOpenChange={(open) =>
                    setOpenItem(open ? "one" : null)
                }
            />

            <AccordionItem
                id="two"
                open={openItem === "two"}
                onOpenChange={(open) =>
                    setOpenItem(open ? "two" : null)
                }
            />
        </>
    );
}
```

Each child receives its current state from the parent.

The parent enforces the invariant that only one item can be open.

This is more than sharing a variable. The lifted state allows the common owner to enforce a relationship between
multiple components.

## Coordinated State

State lifting is particularly useful when components have a constraint that cannot be represented correctly by
independent local state.

For example, tabs should normally have one active tab:

```tsx
function Tabs() {
    const [activeTab, setActiveTab] =
        useState("overview");

    return (
        <>
            <TabList
                activeTab={activeTab}
                onActiveTabChange={setActiveTab}
            />

            <TabPanel activeTab={activeTab}/>
        </>
    );
}
```

The state owner controls the invariant.

If `TabList` and `TabPanel` each maintained their own `activeTab`, synchronization would become the responsibility of
two independent state owners.

## Lifting State and Derived Data

Once state is lifted, dependent values can be derived from the single source of truth.

```tsx
function Cart() {
    const [items, setItems] = useState<CartItem[]>([]);

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    return (
        <>
            <CartItems
                items={items}
                onChange={setItems}
            />
            <CartTotal total={total}/>
        </>
    );
}
```

`CartTotal` does not need its own `total` state.

The parent owns the source state and derives the value required by the child.

This avoids creating multiple synchronized representations.

## Lifting State Versus Duplicating State

Suppose two components need the same information.

Duplicating it:

```tsx
function Parent() {
    return (
        <>
            <First/>
            <Second/>
        </>
    );
}

function First() {
    const [value, setValue] = useState("");
    // ...
}

function Second() {
    const [value, setValue] = useState("");
    // ...
}
```

creates two independent sources of truth.

Lifting it:

```tsx
function Parent() {
    const [value, setValue] = useState("");

    return (
        <>
            <First value={value} onChange={setValue}/>
            <Second value={value} onChange={setValue}/>
        </>
    );
}
```

creates one source of truth.

The distinction is fundamental: shared state should normally have one authoritative owner.

## Avoiding Excessive Lifting

State lifting should stop at the lowest useful boundary.

This is unnecessarily broad:

```tsx
function Application() {
    const [isSearchOpen, setIsSearchOpen] =
        useState(false);

    return <Page/>;
}
```

when only a small feature uses the state.

Prefer:

```tsx
function SearchSection() {
    const [isSearchOpen, setIsSearchOpen] =
        useState(false);

    // ...
}
```

The fact that a parent technically could own the state does not mean that it should.

Every upward movement expands the set of components that are structurally coupled to the state.

## Prop Drilling After State Lifting

A common consequence of lifting state is additional props:

```tsx
function Page() {
    const [query, setQuery] = useState("");

    return (
        <Layout
            query={query}
            onQueryChange={setQuery}
        />
    );
}
```

If `Layout` does not use those props, the state may need to be distributed through several layers:

```tsx
function Layout(props) {
    return <Content {...props} />;
}

function Content(props) {
    return <SearchBox {...props} />;
}
```

This is prop drilling.

The existence of prop drilling does not automatically mean the state was lifted incorrectly. The state may genuinely
belong to the higher-level owner.

If the dependency needs to cross a large subtree without those intermediate components participating in the API, Context
or another state-distribution mechanism may be more appropriate.

## State Lifting Versus Context

State lifting and Context solve different parts of the problem.

State lifting determines who owns the state:

```tsx
function Checkout() {
    const [step, setStep] =
        useState<CheckoutStep>("shipping");

    // ...
}
```

Context determines how descendants access that owned value:

```tsx
<CheckoutContext.Provider value={{step, setStep}}>
    {children}
</CheckoutContext.Provider>
```

Context does not eliminate the need to decide ownership.

A common architecture is:

```tsx
function CheckoutProvider({children}: Props) {
    const [step, setStep] =
        useState<CheckoutStep>("shipping");

    return (
        <CheckoutContext.Provider
            value={{step, setStep}}
        >
            {children}
        </CheckoutContext.Provider>
    );
}
```

The state has been lifted to the feature-level Provider owner and then distributed through Context.

## When Context Is Not Necessary

If two sibling components share state and their common parent is already a natural owner, ordinary props are often the
simpler solution.

```tsx
function Editor() {
    const [value, setValue] = useState("");

    return (
        <>
            <EditorInput value={value} onChange={setValue}/>
            <Preview value={value}/>
        </>
    );
}
```

Introducing Context here would add another dependency mechanism without solving a real scope problem.

Context becomes more useful when the state must be consumed deeply or by many descendants and passing it through
intermediate components would create undesirable coupling.

## Lifting State and Custom Hooks

A custom Hook can encapsulate the state logic while the component remains its owner.

```tsx
function useEditorState() {
    const [value, setValue] = useState("");

    return {
        value,
        setValue,
    };
}

function Editor() {
    const editor = useEditorState();

    return (
        <>
            <EditorInput
                value={editor.value}
                onChange={editor.setValue}
            />
            <Preview value={editor.value}/>
        </>
    );
}
```

The Hook does not make the state shared.

Each invocation owns an independent state instance.

This is an important distinction:

```tsx
function Editor() {
    const first = useEditorState();
    const second = useEditorState();
}
```

`first` and `second` do not automatically share state.

A custom Hook can extract the implementation of lifted state, but ownership remains with the component invoking the Hook
unless the Hook uses a shared mechanism.

## Lifting State and Reducers

When coordinated state becomes complex, the lifted owner can use a reducer.

```tsx
function Editor() {
    const [state, dispatch] = useReducer(
        editorReducer,
        initialEditorState,
    );

    return (
        <>
            <Toolbar
                state={state}
                dispatch={dispatch}
            />
            <EditorInput
                value={state.value}
                dispatch={dispatch}
            />
            <Preview value={state.value}/>
        </>
    );
}
```

The reducer provides explicit transitions while the parent remains the state owner.

State lifting and the Reducer Pattern therefore address different concerns:

* state lifting determines ownership;
* the reducer determines how complex state transitions are represented.

## Lifting State and State Colocation

State Colocation establishes the default that state should remain local.

State Lifting is the deliberate exception when broader access is required.

For example, local ownership is appropriate:

```tsx
function SearchBox() {
    const [query, setQuery] = useState("");
}
```

But once another component must consume the same query:

```tsx
function SearchPage() {
    const [query, setQuery] = useState("");

    return (
        <>
            <SearchBox
                query={query}
                onQueryChange={setQuery}
            />
            <SearchResults query={query}/>
        </>
    );
}
```

The state moves to the lowest common owner.

The relationship can therefore be summarized as a decision rule:

```text
local state first;
lift only when shared ownership is required.
```

## Lifting State and Component APIs

Lifting state changes a component's API.

A self-contained component:

```tsx
function SearchBox() {
    const [query, setQuery] = useState("");

    // ...
}
```

has no external state contract.

A controlled component:

```tsx
function SearchBox({
                       query,
                       onQueryChange,
                   }: Props) {
    // ...
}
```

has an explicit state contract.

The API now specifies:

* the current state value;
* the operation through which the component requests changes;
* the fact that the parent owns the authoritative state.

This can make a component more reusable when external coordination is genuinely required.

## State Ownership and Initialization

When state is lifted, initialization moves with ownership.

Before lifting:

```tsx
function SearchBox() {
    const [query, setQuery] = useState("");
}
```

After lifting:

```tsx
function SearchPage() {
    const [query, setQuery] = useState(initialQuery);

    return (
        <SearchBox
            query={query}
            onQueryChange={setQuery}
        />
    );
}
```

The parent now decides the initial value.

This can be important when initialization depends on other state, route parameters, persisted data, or server-provided
information.

## State Ownership and Resetting

Lifting state also changes the lifecycle of that state.

If state is local to a child:

```tsx
function Form() {
    const [value, setValue] = useState("");

    // ...
}
```

removing the child from the tree can remove its state instance.

If the state is lifted:

```tsx
function Page() {
    const [value, setValue] = useState("");

    return condition ? <Form value={value}/> : null;
}
```

the state can survive while the child is absent.

This is an important consequence of changing ownership.

Lifting is therefore not merely a data-access decision. It can change the lifetime of the state.

## Resetting Lifted State

When state has been lifted, the owner may need explicit reset behavior.

```tsx
function Checkout() {
    const [step, setStep] =
        useState<CheckoutStep>("shipping");

    function reset() {
        setStep("shipping");
    }

    return (
        <>
            <CheckoutContent
                step={step}
                onStepChange={setStep}
            />
            <button onClick={reset}>
                Start over
            </button>
        </>
    );
}
```

The owner is now responsible for transitions that affect the shared state.

This is appropriate because the owner is also responsible for maintaining the shared invariant.

## Lifting State Across Component Boundaries

The owner does not need to render every consumer directly.

For example:

```tsx
function Page() {
    const [query, setQuery] = useState("");

    return (
        <Layout
            search={
                <SearchBox
                    query={query}
                    onQueryChange={setQuery}
                />
            }
            results={<SearchResults query={query}/>}
        />
    );
}
```

The state remains owned by `Page` while composition controls where the consumers appear.

This can sometimes reduce prop drilling without introducing Context.

The important architectural distinction is that composition changes how components are connected; state lifting changes
where the state is owned.

## Common Misuse

A common misuse is lifting state before any component actually needs shared access.

```tsx
function Application() {
    const [isOpen, setIsOpen] = useState(false);

    return <Dialog/>;
}
```

This expands the ownership boundary without a requirement.

Another misuse is lifting state simply because a child component "might need it later."

State ownership should respond to actual requirements rather than hypothetical consumers.

Another misuse is duplicating a lifted state value inside the child:

```tsx
function Parent() {
    const [value, setValue] = useState("");

    return <Child value={value}/>;
}

function Child({value}: Props) {
    const [localValue, setLocalValue] =
        useState(value);

    // ...
}
```

Now two values can diverge.

If the child requires an independent draft, that should be an intentional separate state model rather than an accidental
duplicate of the parent's source of truth.

Another misuse is lifting state all the way to the application root because multiple components need it even though a
smaller feature boundary could own it.

Another misuse is introducing Context solely because lifted props pass through one or two components. The dependency
mechanism should be proportional to the scope of the problem.

## Advantages

State lifting creates a single source of truth, enables sibling coordination, allows a common owner to enforce
invariants, and makes shared state transitions explicit.

It also allows independently rendered components to remain synchronized without maintaining duplicate state.

The resulting controlled component boundaries can make data ownership explicit and can increase component reuse when
external control is a real requirement.

## Disadvantages

Lifting state increases the responsibilities of the owner and can expand component APIs through additional props.

If state is lifted too far, it can produce prop drilling, unnecessary parent rerenders, broader coupling, and
harder-to-understand ownership.

Lifting can also change state lifetime and therefore alter behavior in ways that are not immediately obvious.

## When to Use

Use State Lifting when multiple components genuinely require the same authoritative state, when sibling components must
coordinate, when a common invariant must be enforced, or when external control of a component's state is required.

Place the state in the lowest common owner that satisfies those requirements.

## When Not to Use

Do not lift state when it is purely local to one component or small subtree.

Do not lift state merely to make it theoretically accessible.

Do not lift state to a global ancestor when a feature-level or component-level owner is sufficient.

Do not use State Lifting as a substitute for Context, external stores, or other distribution mechanisms when the state
genuinely has a broader scope than a convenient common ancestor.

## Relationship to Other Patterns

State Colocation establishes the default of keeping state local to the smallest valid owner.

Controlled Components expose lifted state through an explicit value-and-change API.

Context Provider distributes state through a subtree after an owner has been established.

Context Partitioning separates independently meaningful Context boundaries.

Custom Hooks can encapsulate lifted state logic without changing its ownership semantics.

Reducer Pattern can structure complex transitions within the component that owns the lifted state.

External Store provides a different ownership and subscription model for state that should not be tied to one React
component subtree.

Component Composition can reduce the need for prop drilling after state has been lifted by changing how consumers are
structurally connected.

## Summary

State Lifting moves state upward when multiple components require one authoritative owner.

The essential transformation is:

```tsx
function Child() {
    const [value, setValue] = useState("");
}
```

to:

```tsx
function Parent() {
    const [value, setValue] = useState("");

    return (
        <>
            <Child value={value} onChange={setValue}/>
            <OtherChild value={value}/>
        </>
    );
}
```

The important rule is not "move state up." It is "move state to the lowest common owner that must coordinate it."

State Colocation is therefore the starting point, while State Lifting is the mechanism used when local ownership is no
longer sufficient. The resulting owner becomes the single source of truth and distributes the current state and
state-transition interface to the components that depend on it.
