# Controlled Components

A controlled component is a component whose current state is owned by its consumer rather than by the component itself.
The consumer provides the current value through props and receives state-change requests through callbacks. The
component renders from the supplied value and does not maintain a competing authoritative copy of that state.

Controlled components establish an explicit ownership boundary: the component owns behavior and presentation, while the
parent or another external owner owns the state.

## Intent

Use a controlled component when the component's state must be coordinated, observed, validated, transformed, persisted,
or otherwise governed by code outside the component.

The fundamental contract is:

```tsx
interface ControlledInputProps {
    value: string;
    onChange: (value: string) => void;
}
```

The component receives the authoritative value and reports requested changes. The parent decides whether and how that
change becomes the next value.

```tsx
function Input({value, onChange}: ControlledInputProps) {
    return (
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
        />
    );
}
```

The component does not independently decide what its value is.

## Source of Truth

The defining property of a controlled component is a single authoritative source of truth.

```tsx
function SearchForm() {
    const [query, setQuery] = useState("");

    return (
        <Input
            value={query}
            onChange={setQuery}
        />
    );
}
```

`query` belongs to `SearchForm`. `Input` receives the current value and requests updates.

The important distinction is not whether `useState` exists somewhere in the application. The distinction is which object
or component is authoritative for the controlled state.

A component that receives `value` but also maintains an independent `value` state has two potential sources of truth:

```tsx
function BadInput({value, onChange}) {
    const [internalValue, setInternalValue] = useState(value);

    // ...
}
```

This creates synchronization problems because `value` and `internalValue` can diverge.

A controlled component should generally derive its rendered state directly from the controlled prop.

## Value and Change Contract

The most common controlled API consists of a value prop and a change callback.

```tsx
interface SelectProps {
    value: string;
    onChange: (value: string) => void;
}
```

The component reads:

```tsx
value
```

and reports:

```tsx
onChange(nextValue)
```

The callback does not necessarily mean that the component has changed its own state. It means that the component is
requesting that its owner adopt a different value.

```tsx
function Select({value, onChange, options}: SelectProps) {
    return (
        <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}
```

The owner remains responsible for deciding what happens next.

## Controlled State Flow

Controlled state follows a predictable cycle.

```tsx
function Example() {
    const [value, setValue] = useState("");

    return (
        <Input
            value={value}
            onChange={setValue}
        />
    );
}
```

The component receives `value`.

The user interacts with the component.

The component invokes `onChange` with the requested value.

The owner updates its state.

React renders the component again with the new `value`.

The component therefore does not need to synchronize internal state with the external value. The external value is
already authoritative.

## State Ownership

Controlled components are primarily an ownership mechanism.

Suppose two components need to coordinate one value:

```tsx
function Editor() {
    const [value, setValue] = useState("");

    return (
        <>
            <Input value={value} onChange={setValue}/>
            <Preview value={value}/>
        </>
    );
}
```

Both components consume the same authoritative state.

`Input` does not own the value. `Preview` does not own the value. `Editor` owns it and distributes it to both.

This is the API-level consequence of moving state ownership to a common owner.

State Lifting concerns the decision to move ownership. Controlled Components concern how a component exposes and
consumes externally owned state.

## Controlled Versus Uncontrolled

A controlled component receives its current state from outside.

```tsx
<Input
    value={value}
    onChange={setValue}
/>
```

An uncontrolled component maintains its own state and may expose only an initial value.

```tsx
<Input defaultValue="initial"/>
```

The distinction is about ownership, not whether the component happens to use React state internally.

Controlled:

```tsx
value
onChange
```

Uncontrolled:

```tsx
defaultValue
```

The controlled form makes the owner authoritative after initialization. The uncontrolled form gives the component
ownership of subsequent state changes.

## `defaultValue` Versus `value`

`defaultValue` normally describes initialization.

```tsx
<Input defaultValue="hello"/>
```

Changing the `defaultValue` later does not normally mean that the current value should change.

`value` describes current authoritative state.

```tsx
<Input
    value={value}
    onChange={setValue}
/>
```

Changing `value` means the component should render according to the new value.

This distinction is especially important for reusable components that support both controlled and uncontrolled usage.

## Dual-Mode Components

Reusable components often support both controlled and uncontrolled operation.

```tsx
interface DialogProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}
```

Controlled usage:

```tsx
<Dialog
    open={open}
    onOpenChange={setOpen}
/>
```

Uncontrolled usage:

```tsx
<Dialog
    defaultOpen={false}
/>
```

A dual-mode component must determine whether the state is externally controlled and consistently use that mode.

A simplified implementation is:

```tsx
function Dialog({
                    open: controlledOpen,
                    defaultOpen = false,
                    onOpenChange,
                }: DialogProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    function setOpen(nextOpen: boolean) {
        if (!isControlled) {
            setUncontrolledOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
    }

    return (
        <div data-open={open}>
            {/* ... */}
        </div>
    );
}
```

When controlled, the external `open` value is authoritative. When uncontrolled, the internal state is authoritative.

A component should not silently switch between these modes during its lifetime. Such a transition makes ownership
ambiguous and can cause state inconsistencies.

## Controlled State Must Be Rendered From Props

A common error is to treat the controlled prop merely as an initialization value.

Incorrect:

```tsx
function Input({value, onChange}) {
    const [internalValue, setInternalValue] = useState(value);

    return (
        <input
            value={internalValue}
            onChange={(event) => {
                const nextValue = event.target.value;

                setInternalValue(nextValue);
                onChange(nextValue);
            }}
        />
    );
}
```

This implementation has effectively created an uncontrolled internal state machine while pretending to be controlled.

If the parent changes `value` externally, the component may continue rendering `internalValue`.

Correct controlled behavior is simpler:

```tsx
function Input({value, onChange}) {
    return (
        <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
        />
    );
}
```

The component always renders from the authoritative external state.

## Change Callbacks Are Requests

A controlled component should generally treat its callback as a request to change state, not as permission to mutate the
owner's state directly.

```tsx
function Toggle({checked, onChange}: ToggleProps) {
    return (
        <button
            aria-pressed={checked}
            onClick={() => onChange(!checked)}
        >
            {checked ? "On" : "Off"}
        </button>
    );
}
```

The component calculates a proposed next state and reports it.

The owner decides whether to accept it.

```tsx
function Settings() {
    const [enabled, setEnabled] = useState(false);

    return (
        <Toggle
            checked={enabled}
            onChange={setEnabled}
        />
    );
}
```

This distinction becomes important when the owner applies validation, authorization, normalization, or business rules.

## Validation Before Acceptance

A parent can reject a requested state transition.

```tsx
function AccountForm() {
    const [name, setName] = useState("");

    function handleNameChange(nextName: string) {
        if (nextName.length <= 50) {
            setName(nextName);
        }
    }

    return (
        <Input
            value={name}
            onChange={handleNameChange}
        />
    );
}
```

The child proposes the next value. The owner determines whether that value becomes authoritative.

This is one of the primary reasons to use controlled state: state transitions can be governed outside the component.

## Normalization

The owner can normalize incoming values before storing them.

```tsx
function UsernameField() {
    const [username, setUsername] = useState("");

    function handleChange(nextValue: string) {
        setUsername(nextValue.trim().toLowerCase());
    }

    return (
        <Input
            value={username}
            onChange={handleChange}
        />
    );
}
```

The component remains responsible for reporting user intent. The owner remains responsible for determining the canonical
state.

The same model applies to parsing, validation, formatting, deduplication, and other domain-specific policies.

## Derived Controlled Values

Not every value exposed by a component needs to be stored independently.

```tsx
function SearchPanel() {
    const [query, setQuery] = useState("");

    const hasQuery = query.length > 0;

    return (
        <>
            <Input value={query} onChange={setQuery}/>
            <ClearButton disabled={!hasQuery}/>
        </>
    );
}
```

The controlled state is `query`. `hasQuery` is derived from it.

A controlled component should not require consumers to maintain redundant state merely because the component exposes
multiple representations of the same information.

## Controlled Boolean State

Boolean state commonly uses `checked` and `onChange` or `open` and `onOpenChange`.

```tsx
interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}
```

```tsx
function Checkbox({checked, onChange}: CheckboxProps) {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
        />
    );
}
```

For disclosure-like components:

```tsx
interface AccordionItemProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
```

The naming should communicate that the component is receiving the current state rather than an initial configuration.

## Controlled Collections

Controlled state can represent collections rather than scalar values.

```tsx
interface MultiSelectProps {
    selected: string[];
    onSelectedChange: (selected: string[]) => void;
}
```

The component can propose a new collection:

```tsx
function MultiSelect({
                         selected,
                         onSelectedChange,
                     }: MultiSelectProps) {
    function toggle(value: string) {
        const next = selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value];

        onSelectedChange(next);
    }

    // ...
}
```

The owner still determines the authoritative collection.

For large or complex collections, the API should define whether values are compared by identity, keys, or another
semantic representation.

## Controlled Compound Components

Compound components can expose controlled state at the group level.

```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
    <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="overview">
        Overview
    </Tabs.Content>

    <Tabs.Content value="settings">
        Settings
    </Tabs.Content>
</Tabs>
```

The parent owns the active tab while the compound component coordinates the internal consumers.

This is distinct from Context itself. Context can distribute the controlled value among the compound components, but the
controlled-state contract determines who owns the state.

## Partial Control

A component can expose multiple independently controllable pieces of state.

```tsx
interface PanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    query: string;
    onQueryChange: (query: string) => void;
}
```

The component does not have to be entirely controlled or entirely uncontrolled as one indivisible unit.

Each externally controllable state variable should have a clear owner and contract.

However, partial control should be introduced only when the independently controlled state has a meaningful API
boundary. Exposing every internal implementation detail as a controlled prop produces an unnecessarily complex component
contract.

## Callback API Design

Controlled components should expose semantic callbacks rather than leak implementation details.

Prefer:

```tsx
onOpenChange(nextOpen)
```

over:

```tsx
onInternalStateMutation(...)
```

Prefer:

```tsx
onValueChange(nextValue)
```

over exposing the component's internal reducer actions.

The callback should communicate the state transition the consumer needs to govern.

For some components, richer event information is useful:

```tsx
interface SelectProps {
    value: string;
    onValueChange: (
        value: string,
        context: { reason: "user" | "programmatic" }
    ) => void;
}
```

The API should expose information that is meaningful to the consumer without exposing internal implementation structure.

## Controlled Components and Effects

A controlled component generally should not use an effect merely to synchronize internal state with the controlled prop.

Avoid:

```tsx
useEffect(() => {
    setInternalValue(value);
}, [value]);
```

when `internalValue` exists only to mirror `value`.

The controlled prop is already available during rendering.

Effects become appropriate when the component must synchronize the controlled state with an external imperative system,
such as a DOM API, browser API, or third-party widget.

The distinction is important: rendering from controlled state is not an effect-driven synchronization problem.

## Resetting Controlled State

Resetting controlled state is the responsibility of the state owner.

```tsx
function Form() {
    const [name, setName] = useState("");

    function reset() {
        setName("");
    }

    return (
        <>
            <Input value={name} onChange={setName}/>
            <button onClick={reset}>Reset</button>
        </>
    );
}
```

The component does not need a special internal reset mechanism because the owner can provide the desired state.

This makes reset behavior predictable and allows multiple consumers to respond to the same reset operation.

## Initialization

Controlled components should not reinterpret `value` as an initialization-only value.

```tsx
<Input value={value} onChange={setValue}/>
```

If the owner changes `value`, the component must reflect that change.

For initialization-only behavior, use an uncontrolled API:

```tsx
<Input defaultValue="initial"/>
```

The distinction should be explicit in the component API.

## Performance

Controlled state introduces a render dependency between the owner and the controlled component. Every accepted state
update causes the owner to render and may cause descendants to render.

This is not inherently a problem. It becomes relevant when high-frequency updates occur across large subtrees.

Possible responses include:

* colocating unrelated state lower in the tree;
* splitting components so unrelated descendants do not participate in the update;
* memoizing components when referential stability permits it;
* separating independently changing controlled values;
* using an external store when state ownership and subscription requirements justify one.

Performance optimization should not be used as a reason to duplicate authoritative state inside the controlled
component.

## State Ownership Versus State Distribution

Controlled state answers:

> Who owns the state?

Context answers:

> How is an already-owned value distributed to descendants?

For example:

```tsx
function Editor() {
    const [value, setValue] = useState("");

    return (
        <EditorContext.Provider value={{value, setValue}}>
            <EditorInput/>
            <EditorPreview/>
        </EditorContext.Provider>
    );
}
```

The Context provider may distribute the state, but the architectural question of ownership still exists independently.

Context is not what makes a component controlled. A component can be controlled through ordinary props, Context, or
another explicit state interface.

## Controlled Components Versus State Lifting

These concepts are related but not identical.

State lifting changes where state is owned:

```tsx
function Parent() {
    const [value, setValue] = useState("");

    return (
        <>
            <Input value={value} onChange={setValue}/>
            <Preview value={value}/>
        </>
    );
}
```

The resulting `Input` is controlled because its value is owned externally.

Therefore:

* State lifting is an ownership decision.
* Controlled components are an API and ownership contract.
* A controlled component can be the result of state lifting.
* A component can be controlled by state that was not literally lifted from that component.

This distinction prevents the two patterns from becoming duplicate documentation.

## Controlled Components Versus Uncontrolled Components

Controlled components delegate authority to the consumer.

Uncontrolled components retain authority internally.

Controlled:

```tsx
<Input
    value={value}
    onChange={setValue}
/>
```

Uncontrolled:

```tsx
<Input
    defaultValue="hello"
/>
```

Controlled components are preferable when the consumer needs direct authority over current state. Uncontrolled
components are often preferable when the component can encapsulate its state and external code only needs initialization
or occasional access.

Neither model is universally superior.

## Controlled Components and Reducers

A controlled component can use a reducer internally for behavior that is not externally controlled.

For example, a complex widget may have externally controlled `open` state while maintaining internal transient
interaction state.

```tsx
function Menu({
                  open,
                  onOpenChange,
              }: MenuProps) {
    const [highlightedIndex, dispatch] = useReducer(
        reducer,
        0
    );

    // ...
}
```

The existence of an internal reducer does not make `open` uncontrolled. Different pieces of state can have different
owners.

The ownership of each state variable should be explicit.

## Controlled Components and Custom Hooks

A custom Hook can encapsulate the owner-side state logic:

```tsx
function useSearch() {
    const [query, setQuery] = useState("");

    return {
        query,
        setQuery,
    };
}
```

The resulting state can control a component:

```tsx
function Search() {
    const {query, setQuery} = useSearch();

    return (
        <Input
            value={query}
            onChange={setQuery}
        />
    );
}
```

The Hook provides reusable stateful behavior. The `Input` component remains controlled because its current value is
externally owned.

A custom Hook does not itself define controlled-component semantics.

## TypeScript API Design

Controlled props should make ownership explicit in the type system.

A simple component can require both props:

```tsx
interface InputProps {
    value: string;
    onChange: (value: string) => void;
}
```

A component supporting both controlled and uncontrolled modes can model the alternatives explicitly:

```tsx
interface ControlledProps {
    value: string;
    onChange: (value: string) => void;
}

interface UncontrolledProps {
    defaultValue?: string;
    onChange?: (value: string) => void;
}

type InputProps = ControlledProps | UncontrolledProps;
```

For more complex APIs, discriminated unions can make invalid combinations harder to express.

```tsx
type DialogProps =
    | {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultOpen?: never;
}
    | {
    defaultOpen?: boolean;
    open?: never;
    onOpenChange?: (open: boolean) => void;
};
```

The exact type design depends on whether the component intentionally permits optional callbacks or partially controlled
operation.

## Testing

Controlled components should be tested by verifying their contract with the owner.

The important behaviors include:

* rendering the supplied controlled value;
* invoking the change callback with the correct next value;
* reflecting external changes to the controlled value;
* not maintaining a competing authoritative value;
* respecting externally rejected updates;
* correctly handling controlled and uncontrolled modes when both are supported;
* preserving the controlled value when unrelated internal events occur.

For example:

```tsx
function ControlledExample() {
    const [value, setValue] = useState("initial");

    return (
        <Input
            value={value}
            onChange={setValue}
        />
    );
}
```

A useful test should verify both directions: user interaction produces a callback, and an external state change produces
the corresponding rendered state.

## Common Misuse

The most common misuse is duplicating controlled state internally.

```tsx
const [internalValue, setInternalValue] = useState(value);
```

This is usually a synchronization smell when `internalValue` represents the same logical state as `value`.

Another misuse is treating `defaultValue` as if it were a controlled value. `defaultValue` is generally an
initialization mechanism, not an ongoing source of truth.

Another misuse is exposing every internal state variable as a controlled prop. A reusable component should expose
control only over state for which external ownership has meaningful value.

Another misuse is making the callback contract too implementation-specific. Consumers should interact with semantic
state transitions rather than internal state machinery.

## Advantages

Controlled components provide a clear source of truth and make state externally observable and governable. They allow
parents to coordinate multiple consumers, validate transitions, normalize values, synchronize state with other
application state, implement centralized reset behavior, and integrate component state with application workflows.

They also make externally driven state changes straightforward because the component always renders from the supplied
value.

## Disadvantages

Controlled components increase coupling between the component and its consumer because the consumer must provide the
current value and change handler. They can also increase rendering work when rapidly changing state is owned high in the
component tree.

Poorly designed controlled APIs can become verbose, expose implementation details, or create unnecessary synchronization
responsibilities.

These costs are primarily API and ownership costs. They should be accepted when external control provides real
architectural value.

## When to Use

Use a controlled component when:

* multiple components need the same state;
* the parent must validate or reject changes;
* application state must remain synchronized with the component;
* the component's state affects other application behavior;
* the consumer needs to reset or programmatically change the state;
* the component is part of a larger controlled composition;
* state persistence or synchronization is owned outside the component;
* deterministic external control is more important than local encapsulation.

## When Not to Use

Do not make a component controlled merely because it is technically possible.

An uncontrolled component is often simpler when its state is entirely local, external consumers do not need to
coordinate it, and initialization is the only external requirement.

Do not expose controlled props for implementation details that have no meaningful external ownership boundary.

Do not duplicate controlled state internally just to make the component appear self-contained.

## Relationships

Controlled Components has a direct relationship with State Lifting. Lifting moves state ownership to a common owner;
controlled components provide the child API through which that owner governs the state.

Controlled Components is the externally owned counterpart to Uncontrolled Components. The distinction is which side owns
the authoritative current state.

State Colocation provides the default alternative: keep state local until another owner genuinely needs it.

Context Provider and Context Partitioning can distribute controlled state to descendants, but they do not define
controlled semantics themselves.

Custom Hooks can encapsulate the state owned by the parent, while controlled components consume that state through an
explicit API.

Reducer Pattern can structure transitions inside the owner or component, but it does not determine ownership.

External Store becomes relevant when authoritative state should exist outside the React component tree or requires
subscription semantics beyond ordinary parent-to-child control.

Stable Keys and Component Identity determine whether component instances and their internal state are preserved or
recreated. They do not determine who owns controlled state.

## Summary

A controlled component delegates ownership of its current state to an external consumer. The component receives the
authoritative value through props and reports requested changes through callbacks.

The essential contract is:

```tsx
<Component
    value={value}
    onChange={setValue}
/>
```

The component renders from `value`; the consumer decides what the next authoritative value should be.

The central rule is simple: **if a component is controlled, its controlled state must have one external source of
truth.**
