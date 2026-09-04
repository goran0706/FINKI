# Compound Components

Compound Components are a React component composition pattern in which a parent component and a set of related child
components form a coordinated component API. The parent owns shared state and behavior, while its descendants
participate in that behavior through an implicit or explicit protocol.

The pattern allows consumers to control the structure of a component while the component family maintains the
relationships and invariants that make the structure work. Instead of exposing a large collection of configuration
props, the API exposes several semantically related components that can be composed together.

A typical compound component API looks like this:

```jsx
<Tabs>
    <Tabs.List>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="security">Security</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="profile">
        Profile settings
    </Tabs.Panel>

    <Tabs.Panel value="security">
        Security settings
    </Tabs.Panel>
</Tabs>
```

The consumer controls the arrangement and contents of the children, while `Tabs` controls the shared state and
coordination between them.

## Intent

Use Compound Components when several components represent different parts of one conceptual UI control and those parts
need to coordinate through shared state, behavior, or context.

The pattern is useful when:

* a component has multiple semantic regions;
* consumers should control the composition of those regions;
* descendants need access to shared state;
* the parent must coordinate interactions between descendants;
* the relationship between the parts is meaningful;
* a large configuration-prop API would become difficult to use;
* the component should expose a declarative API that resembles the conceptual structure of the UI.

The pattern is particularly useful for reusable controls such as tabs, accordions, menus, dialogs, select components,
forms, tables, navigation systems, and multi-part input controls.

## Structure

A compound component family normally consists of a parent component and several related child components.

The parent generally owns:

* shared state;
* state transitions;
* registration or coordination;
* context;
* shared identifiers;
* accessibility relationships;
* behavior that spans multiple descendants.

The child components generally own:

* their local presentation;
* their role within the compound component;
* interaction with the shared protocol;
* content specific to that child.

The consumer determines which child components are present and how they are arranged within the supported composition
model.

## Basic Implementation

Context is one of the most common mechanisms for implementing compound components.

```jsx
const TabsContext = createContext(null);

function Tabs({children, defaultValue}) {
    const [value, setValue] = useState(defaultValue);

    const context = {
        value,
        setValue
    };

    return (
        <TabsContext.Provider value={context}>
            <div>{children}</div>
        </TabsContext.Provider>
    );
}

function useTabsContext() {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error("Tabs components must be used inside Tabs");
    }

    return context;
}

function Tab({value, children}) {
    const {value: activeValue, setValue} = useTabsContext();

    return (
        <button
            type="button"
            aria-selected={activeValue === value}
            onClick={() => setValue(value)}
        >
            {children}
        </button>
    );
}

function Panel({value, children}) {
    const {value: activeValue} = useTabsContext();

    if (activeValue !== value) {
        return null;
    }

    return <div>{children}</div>;
}

Tabs.Tab = Tab;
Tabs.Panel = Panel;
```

Consumers can then use the components as a single conceptual API.

```jsx
<Tabs defaultValue="profile">
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="security">Security</Tabs.Tab>

    <Tabs.Panel value="profile">
        Profile settings
    </Tabs.Panel>

    <Tabs.Panel value="security">
        Security settings
    </Tabs.Panel>
</Tabs>
```

The important property is not the use of static properties such as `Tabs.Tab`. The essential property is that the
components participate in a shared protocol controlled by the parent.

## Shared Context

Context allows descendants to access state owned by the compound component without requiring every intermediate
component to receive and forward that state.

```jsx
const MenuContext = createContext(null);

function Menu({children}) {
    const [open, setOpen] = useState(false);

    return (
        <MenuContext.Provider value={{open, setOpen}}>
            {children}
        </MenuContext.Provider>
    );
}

function Trigger({children}) {
    const {open, setOpen} = useContext(MenuContext);

    return (
        <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(value => !value)}
        >
            {children}
        </button>
    );
}
```

The context establishes the communication channel between the parent and participating descendants.

A compound component should normally hide the context implementation behind an internal Hook.

```jsx
function useMenuContext() {
    const context = useContext(MenuContext);

    if (!context) {
        throw new Error("Menu components must be used inside Menu");
    }

    return context;
}
```

This provides a single place to validate the relationship and prevents child components from depending directly on the
context implementation.

## Explicit Child Protocol

The child components form a protocol with the parent.

For example, a tab component might require:

```jsx
<Tabs.Tab value="profile">
    Profile
</Tabs.Tab>
```

while a panel requires:

```jsx
<Tabs.Panel value="profile">
    Profile content
</Tabs.Panel>
```

The `value` establishes the relationship between the two parts.

The parent can enforce the semantic relationship through its state model rather than requiring the consumer to manually
coordinate the components.

The protocol should be small and meaningful. A compound component becomes difficult to use when consumers must
understand numerous undocumented internal requirements.

## State Ownership

The parent should generally own state that coordinates multiple descendants.

For a tabs component, the selected tab belongs naturally to the parent because both the tab triggers and panels depend
on it.

```jsx
function Tabs({children, value, onValueChange}) {
    const context = {
        value,
        onValueChange
    };

    return (
        <TabsContext.Provider value={context}>
            {children}
        </TabsContext.Provider>
    );
}
```

The same compound component can support controlled and uncontrolled usage.

```jsx
<Tabs
    value={activeTab}
    onValueChange={setActiveTab}
>
    ...
</Tabs>
```

or:

```jsx
<Tabs defaultValue="profile">
    ...
</Tabs>
```

The controlled/uncontrolled distinction belongs to state ownership and component API design, while the compound
component pattern determines how the related descendants coordinate.

## Local Child State

Not every piece of state should be placed in the parent.

A child can own state that is entirely local to itself.

```jsx
function SearchInput() {
    const [focused, setFocused] = useState(false);

    return (
        <input
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label={focused ? "Search" : undefined}
        />
    );
}
```

Moving every child state value into the parent creates unnecessary coupling and can increase the amount of state
propagated through the compound component context.

The parent should own shared state; descendants should own state that does not participate in the compound protocol.

## Declarative Structure

One of the primary benefits of Compound Components is that the consumer expresses the conceptual structure directly.

Instead of:

```jsx
<Select
    options={options}
    placeholder="Select a user"
    searchable
    clearable
    loading
    emptyMessage="No users"
    renderOption={renderOption}
    renderValue={renderValue}
/>
```

a compound API might expose:

```jsx
<Select>
    <Select.Trigger/>
    <Select.Content>
        <Select.Search/>
        <Select.Options>
            <Select.Option value="alice">Alice</Select.Option>
            <Select.Option value="bob">Bob</Select.Option>
        </Select.Options>
    </Select.Content>
</Select>
```

The latter exposes structure directly.

This does not mean that compound components are always better than a configuration-prop API. If the structure is fixed
and customization is limited, ordinary props may be simpler.

## Flexibility

The consumer can often omit, reorder, or customize supported children.

```jsx
<Tabs defaultValue="overview">
    <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="overview">
        Overview
    </Tabs.Panel>

    <Tabs.Panel value="activity">
        Activity
    </Tabs.Panel>
</Tabs>
```

The parent does not need to know the exact JSX arrangement in advance as long as the required protocol is respected.

This is one of the major differences between compound components and a single monolithic component whose internal
structure is controlled entirely by props.

## Structural Validation

A compound component can validate its child relationships.

For example, a `Tabs.Panel` may require a `value` that corresponds to a tab.

The implementation can detect invalid configurations and report them early.

```jsx
function Panel({value, children}) {
    const {value: activeValue} = useTabsContext();

    if (typeof value !== "string") {
        throw new Error("Tabs.Panel requires a value");
    }

    if (activeValue !== value) {
        return null;
    }

    return <div>{children}</div>;
}
```

More sophisticated compound components may register descendants with the parent so that the parent can validate
uniqueness, ordering, or relationships.

Validation should enforce genuine invariants rather than implementation preferences.

## Registration

Some compound components need descendants to register themselves with the parent.

This is common when the parent must know:

* which children exist;
* their order;
* their identifiers;
* their DOM elements;
* their disabled state;
* their focusability;
* their relationships to other children.

A registration mechanism can be implemented through context.

```jsx
const ListContext = createContext(null);

function List({children}) {
    const [items, setItems] = useState([]);

    const register = item => {
        setItems(current => [...current, item]);

        return () => {
            setItems(current =>
                current.filter(existing => existing.id !== item.id)
            );
        };
    };

    return (
        <ListContext.Provider value={{items, register}}>
            {children}
        </ListContext.Provider>
    );
}
```

Registration introduces lifecycle complexity because descendants mount and unmount dynamically.

The parent must therefore define whether registration order matters, whether identifiers must be unique, and how stale
registrations are removed.

## DOM References

Compound components sometimes need to coordinate DOM elements.

A menu may need to focus its trigger. A tab list may need to focus a particular tab. A listbox may need to manage the
active option.

Context can distribute references or registration functions.

```jsx
function Option({value, children}) {
    const ref = useRef(null);

    useEffect(() => {
        // Register the option and its DOM reference.
    }, [value]);

    return (
        <div ref={ref} role="option">
            {children}
        </div>
    );
}
```

DOM coordination should remain an implementation detail unless consumers genuinely need access to the references.

The compound component API should expose semantic operations where possible rather than forcing consumers to understand
the internal DOM structure.

## Accessibility

Compound components are particularly useful for accessible composite widgets because the parent can coordinate
relationships between descendants.

For tabs, for example, the implementation may need to establish:

* the relationship between a tab and its panel;
* the selected state;
* keyboard navigation;
* focus behavior;
* appropriate ARIA roles and attributes;
* unique identifiers.

A simplified example is:

```jsx
function Tab({id, panelId, selected, onSelect, children}) {
    return (
        <button
            id={id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            onClick={onSelect}
        >
            {children}
        </button>
    );
}
```

The parent can generate or coordinate identifiers so that consumers do not have to manually maintain the relationships.

Accessibility requirements are part of the compound component's contract. They should not be delegated entirely to
consumers.

## Keyboard Interaction

Many compound widgets require coordinated keyboard behavior.

Examples include:

* arrow-key navigation between tabs;
* arrow-key navigation between menu items;
* Escape to close an open popup;
* Home and End navigation;
* focus management;
* roving `tabIndex`.

The parent or a dedicated internal behavior layer can coordinate this state.

A child should generally expose semantic intent rather than requiring consumers to manually implement the interaction
protocol.

## Nested Compound Components

Compound components can contain other compound components.

```jsx
<Form>
    <Form.Field>
        <Form.Label/>
        <Form.Control/>
        <Form.Description/>
    </Form.Field>

    <Form.Field>
        <Form.Label/>
        <Form.Control/>
    </Form.Field>
</Form>
```

Each compound component can establish its own context boundary.

This allows state and dependencies to remain scoped to the relevant subtree.

Nested contexts must nevertheless be designed carefully because similarly named providers can make ownership difficult
to understand.

## Context Scope

A compound component should generally consume the nearest provider belonging to its family.

```jsx
function useDialogContext() {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error(
            "Dialog components must be used inside Dialog"
        );
    }

    return context;
}
```

This prevents accidental use outside the required parent.

Nested instances should also be isolated.

```jsx
<Dialog>
    <Dialog.Trigger>Outer</Dialog.Trigger>

    <Dialog>
        <Dialog.Trigger>Inner</Dialog.Trigger>
    </Dialog>
</Dialog>
```

Each `Dialog` instance should normally maintain independent state.

This is one reason instance-specific context is generally preferable to module-level mutable state.

## Context Value Identity

The context value can cause all consuming descendants to rerender when its identity changes.

```jsx
function Tabs({children, value, onValueChange}) {
    const context = {
        value,
        onValueChange
    };

    return (
        <TabsContext.Provider value={context}>
            {children}
        </TabsContext.Provider>
    );
}
```

The object above is recreated on every render.

For large compound components, context value design can become a performance concern. Context can be partitioned so that
descendants subscribe only to the state they require, or the context can be structured to reduce unnecessary updates.

Memoization may help in some cases, but it should not be used as a substitute for a well-designed state and context
boundary.

## Context Partitioning

A large compound component may expose separate contexts for independent concerns.

For example:

```jsx
const TabsStateContext = createContext(null);
const TabsActionsContext = createContext(null);
```

A component that only needs actions does not necessarily need to consume state.

This can reduce unnecessary rendering and make dependency boundaries clearer.

The trade-off is increased implementation complexity. Context partitioning is justified when the compound component has
enough state or rendering pressure to make the distinction meaningful.

## Static Subcomponents

A common API style attaches subcomponents to the parent.

```jsx
Tabs.List = List;
Tabs.Tab = Tab;
Tabs.Panel = Panel;
```

This produces a discoverable namespace-like API:

```jsx
<Tabs>
    <Tabs.List>
        <Tabs.Tab/>
    </Tabs.List>
</Tabs>
```

The static properties are primarily an API organization mechanism. They are not what makes the pattern a Compound
Component.

The same pattern can be implemented using separately exported components.

```jsx
<Tabs>
    <TabList>
        <Tab/>
    </TabList>

    <TabPanel/>
</Tabs>
```

What matters is the shared protocol and coordination.

## TypeScript

Compound components can be typed using component interfaces and explicit context types.

```tsx
interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);
```

The child components can then consume the typed context.

```tsx
function Tab({
                 value,
                 children
             }: {
    value: string;
    children: React.ReactNode;
}) {
    const context = useTabsContext();

    return (
        <button
            type="button"
            aria-selected={context.value === value}
            onClick={() => context.onValueChange(value)}
        >
            {children}
        </button>
    );
}
```

Static subcomponent APIs can also be represented with an explicit component type.

```tsx
interface TabsComponent {
    (props: TabsProps): React.ReactElement;

    Tab: typeof Tab;
    Panel: typeof Panel;
}
```

The exact typing strategy depends on the public API and whether the components need to support generic values.

## Generic Values

A compound component may need to support values other than strings.

For example, a selection component might use numeric or domain-specific identifiers.

```tsx
interface OptionProps<T> {
    value: T;
    children: React.ReactNode;
}
```

Generic compound APIs can become difficult to type when the parent and descendants must share the same generic
parameter.

The API should therefore avoid unnecessary generic complexity. If a stable string identifier is sufficient, using a
generic domain value may provide little practical benefit.

## Controlled and Uncontrolled Compound Components

A compound component can support both controlled and uncontrolled state.

```jsx
<Tabs
    defaultValue="profile"
>
    ...
</Tabs>
```

and:

```jsx
<Tabs
    value={activeTab}
    onValueChange={setActiveTab}
>
    ...
</Tabs>
```

In uncontrolled mode, the parent component owns the internal state.

In controlled mode, the consuming application owns the state while the compound component coordinates its descendants.

This allows the same compound API to support both self-contained and externally coordinated use cases.

## Event Handling

Child components commonly communicate user actions to the parent through context-provided callbacks.

```jsx
function Trigger() {
    const {open, setOpen} = useMenuContext();

    return (
        <button
            type="button"
            onClick={() => setOpen(value => !value)}
        >
            Menu
        </button>
    );
}
```

The child does not need to know how the parent stores its state.

The parent therefore controls the state transition while the child expresses the user's interaction.

This separation becomes important when state transitions involve validation, side effects, asynchronous work, or
multiple coordinated descendants.

## Asynchronous State

Compound components may coordinate asynchronous operations.

A dialog might contain a form whose submission affects whether the dialog can close.

```jsx
function Dialog({children}) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    const context = {
        open,
        setOpen,
        pending,
        setPending
    };

    return (
        <DialogContext.Provider value={context}>
            {children}
        </DialogContext.Provider>
    );
}
```

The compound component should clearly define whether asynchronous operations belong to the parent, a specific child, or
an external application owner.

Do not put every asynchronous operation into the parent merely because the parent provides context.

## Error Handling

A compound component should fail clearly when its child components are used outside their required parent.

```jsx
function useMenuContext() {
    const context = useContext(MenuContext);

    if (!context) {
        throw new Error(
            "Menu.Item must be rendered inside Menu"
        );
    }

    return context;
}
```

This produces a useful developer error rather than an unrelated `null` or `undefined` failure later in the component.

The compound component should also define behavior for invalid child combinations where those combinations violate a
real invariant.

## Composition Rules

A compound component may define structural rules.

For example:

```jsx
<Tabs>
    <Tabs.List/>
    <Tabs.Panel/>
</Tabs>
```

might be valid, while:

```jsx
<Tabs.Panel/>
```

outside `Tabs` is invalid.

The rules should be documented as part of the public API.

The more structural constraints a component imposes, the more important clear errors and documentation become.

## Children Inspection

A compound component does not necessarily need to inspect its children directly.

Context allows descendants to participate without the parent traversing the child tree.

This is often preferable because it preserves normal React composition.

Direct child inspection can still be useful when the parent must understand structural information such as ordering or
supported child types.

However, APIs based heavily on `React.Children`, `cloneElement`, and child-type inspection tend to become more tightly
coupled to the exact JSX structure.

## `cloneElement` Versus Context

A compound component can distribute information by cloning its children.

```jsx
function List({children}) {
    return React.Children.map(children, child =>
        React.cloneElement(child, {
            active: true
        })
    );
}
```

Context provides a different mechanism.

```jsx
function List({children}) {
    return (
        <ListContext.Provider value={{active: true}}>
            {children}
        </ListContext.Provider>
    );
}
```

Context is generally more scalable when descendants can be nested through arbitrary intermediate components.

`cloneElement` is more tightly coupled to direct children and their expected props.

Neither mechanism defines the Compound Components pattern itself. They are implementation techniques for establishing
the shared protocol.

## Performance

Compound components introduce shared state and often shared context, so the performance characteristics depend heavily
on context design.

Potential sources of unnecessary work include:

* broad context values;
* frequently changing context state;
* large descendant trees;
* unstable context values;
* high-frequency state updates;
* excessive registration;
* unnecessary DOM measurements;
* excessive synchronization between descendants.

Performance strategies can include state colocation, context partitioning, external stores, selector-based
subscriptions, and memoization where measurement justifies them.

The component API should not be made substantially more complex solely to optimize a problem that has not been measured.

## State and Context Boundaries

A compound component should have a clearly defined state boundary.

For example, a `Menu` might own:

* whether the menu is open;
* the active item;
* registered items;
* focus state.

The application might own:

* the data displayed by the menu;
* server-side state;
* application-level selection;
* persistence.

The compound component should not become an application state container simply because its descendants communicate
through context.

## Resource Ownership

Compound components may acquire resources such as event listeners, observers, timers, or DOM subscriptions.

The component that establishes the resource should normally own its cleanup.

```jsx
useEffect(() => {
    const handleKeyDown = event => {
        if (event.key === "Escape") {
            close();
        }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
        document.removeEventListener("keydown", handleKeyDown);
    };
}, [close]);
```

If the resource is specific to one child, that child should generally own it. If it coordinates the entire compound
component, the parent or a dedicated internal behavior layer may own it.

Clear ownership prevents leaks and stale subscriptions.

## Server Rendering and Hydration

Compound components must remain consistent between server rendering and client hydration.

Generated identifiers, initial state, and conditional rendering must produce compatible output across environments.

If a compound component generates IDs for relationships between controls and panels, it should use a stable identifier
mechanism appropriate to the React rendering environment rather than relying on process-local counters that can diverge
between server and client.

Hydration is a rendering concern rather than a defining characteristic of Compound Components, but compound widgets
frequently depend on generated IDs and therefore must account for it.

## Accessibility as an Invariant

For reusable component libraries, accessibility should be enforced by the compound component rather than treated as
optional consumer configuration whenever possible.

For example, a tabs implementation should maintain the correct relationships between triggers and panels instead of
expecting consumers to manually supply every ARIA attribute.

This makes the component safer to reuse and reduces the possibility of inconsistent implementations.

The consumer should primarily provide semantic content and configuration while the component enforces the behavior and
structural requirements of the widget.

## Testing

Compound components should be tested as a coordinated system.

Tests should verify:

* descendants can access the correct parent state;
* multiple instances remain isolated;
* child interactions update shared state;
* controlled and uncontrolled modes behave correctly;
* invalid usage produces useful errors;
* required accessibility relationships are present;
* keyboard interactions work correctly;
* descendants can be mounted and unmounted safely;
* registration and cleanup behave correctly;
* state transitions remain valid under rapid interaction;
* asynchronous operations do not leave stale state or resources.

Tests should focus on the public component protocol rather than internal context implementation details.

## Common Misuse

### Using Compound Components for a Fixed Structure

If the component always has exactly the same structure, a normal component with explicit props is usually simpler.

```jsx
<Card
    title="Profile"
    description="Account information"
/>
```

There is little benefit in forcing consumers to write:

```jsx
<Card>
    <Card.Title>Profile</Card.Title>
    <Card.Description>Account information</Card.Description>
</Card>
```

unless those regions genuinely need independent composition.

### Excessive Child Types

A compound component with dozens of specialized descendants can become difficult to learn.

```jsx
<Component>
    <Component.Header/>
    <Component.Toolbar/>
    <Component.ToolbarButton/>
    <Component.ToolbarMenu/>
    <Component.ToolbarMenuItem/>
    <Component.Filter/>
    <Component.FilterGroup/>
    <Component.FilterOption/>
    <Component.Content/>
    <Component.EmptyState/>
    <Component.LoadingState/>
    <Component.ErrorState/>
</Component>
```

The API may have become a framework rather than a focused component.

### Hidden Structural Requirements

If a component silently depends on a specific child order or nesting structure, consumers can easily misuse it.

Structural requirements should be explicit and, where possible, validated.

### Excessive Context

Putting all component state into one context can cause broad rerendering and make dependencies opaque.

Context should contain the state and operations that actually form the compound component protocol.

### Turning Context Into a Global Store

The context should normally be scoped to a particular compound component instance.

Using module-level mutable state to coordinate all instances destroys instance isolation.

### Overengineering

A compound component does not need registration systems, multiple contexts, external stores, DOM measurement, or
sophisticated state machines merely because those mechanisms are available.

The implementation should match the complexity of the component's coordination requirements.

## Compound Components Versus Ordinary Composition

Ordinary component composition means combining components.

Compound Components add a shared protocol between those components.

For example:

```jsx
<Card>
    <Avatar/>
    <UserName/>
</Card>
```

is ordinary composition if `Avatar` and `UserName` are independently rendered.

By contrast:

```jsx
<Tabs>
    <Tabs.List>
        <Tabs.Tab value="one"/>
    </Tabs.List>
    <Tabs.Panel value="one"/>
</Tabs>
```

is a compound component because `Tabs`, `Tabs.Tab`, and `Tabs.Panel` coordinate through a shared protocol.

The distinction is important because ordinary composition should remain the default. Compound Components are justified
when the components need coordinated behavior or state.

## Compound Components Versus Slots

Slots expose named regions where consumers can provide content.

```jsx
<Layout
    header={<Header/>}
    sidebar={<Sidebar/>}
    content={<Content/>}
/>
```

The supplied regions do not necessarily participate in a shared state protocol.

Compound Components are different because the child components are active participants in the parent's behavior.

A compound component can use slot-like structure, but the defining characteristic is coordinated behavior between the
members of the component family.

## Compound Components Versus Render Props

Render Props provide a function through which a component exposes data or behavior to a consumer.

```jsx
<DataProvider
    render={data => <View data={data}/>}
/>
```

Compound Components instead expose a family of components that consume a shared protocol.

Both patterns allow consumers to control rendering, but they establish different APIs.

## Compound Components Versus Higher-Order Components

Higher-Order Components compose behavior by transforming a component.

```jsx
const Enhanced = withFeature(Component);
```

Compound Components compose a family of related rendered components.

HOCs operate primarily at the component abstraction level. Compound Components operate primarily at the rendered
component-tree level.

## Compound Components Versus Custom Hooks

Custom Hooks share reusable React behavior between components.

```jsx
function UserForm() {
    const form = useUserForm();

    // ...
}
```

Compound Components provide a declarative component API for coordinating related UI elements.

A compound component can internally use Custom Hooks, but the two patterns solve different API problems.

## Compound Components Versus Context

Context is an implementation mechanism for distributing values through a component subtree.

Compound Components are a higher-level component API pattern.

A compound component often uses context, but using context does not automatically make an API a compound component.

## Compound Components Versus State Machines

A state machine defines states, events, transitions, and potentially guards and effects.

A compound component defines a coordinated UI component API.

A complex compound component may use a state machine internally when its interaction model requires explicit transition
semantics.

The two concepts should not be conflated.

## Compound Components Versus Controlled Components

Controlled components receive their important state from the parent.

A compound component can be controlled, uncontrolled, or support both modes.

Controlled state describes ownership of state. Compound Components describe the coordination model between related
components.

## Architectural Benefits

Compound Components can provide a strong boundary between a reusable UI primitive and its consumers.

The reusable component owns interaction semantics, accessibility requirements, shared state, and internal coordination.

The consumer owns content, ordering, optional regions, and application-specific presentation within the supported
protocol.

This allows a component library to expose expressive APIs without exposing its internal implementation.

## Architectural Costs

The pattern introduces an implicit protocol that consumers must understand.

There can also be:

* context complexity;
* hidden dependencies;
* more difficult static analysis;
* more complex TypeScript definitions;
* more complicated testing;
* increased implementation size;
* accessibility coordination requirements;
* registration and lifecycle complexity.

Compound Components should therefore be introduced when coordinated composition provides more value than a simpler
prop-based API.

## Design Criteria

Compound Components are a strong fit when:

* multiple UI pieces form one conceptual control;
* those pieces need shared state;
* descendants need coordinated behavior;
* consumers need structural control;
* the component has meaningful semantic subcomponents;
* accessibility relationships must be coordinated;
* a large configuration-prop API would be cumbersome.

Ordinary composition is generally preferable when the components are independent and do not require a shared protocol.

A simpler prop-based API is generally preferable when the structure is fixed and variation is limited.

Render Props or Custom Hooks may be preferable when the primary requirement is exposing reusable behavior rather than
coordinating a component family.

## Summary

Compound Components are a specialized React composition pattern in which a parent component and related descendants
cooperate through a shared protocol.

The parent normally owns shared state and coordination, while descendants expose semantic pieces of the UI and consume
the parent's state and operations.

Context is the most common implementation mechanism, but the pattern does not depend on Context. Static subcomponents,
registration, explicit props, child inspection, and other mechanisms can also participate in the implementation.

The defining property is coordinated composition. The consumer controls the structure within the supported API, while
the compound component family maintains the state, behavior, accessibility relationships, and invariants that connect
its parts.

Compound Components should remain distinct from ordinary composition, Slots, Render Props, Higher-Order Components,
Custom Hooks, Context, controlled components, and state machines. Those mechanisms can be used to implement or
complement a compound component, but none of them alone defines the pattern.
