# Render Props Pattern

The Render Props pattern is a React composition pattern in which a component receives a function whose responsibility is
to render part of the UI. The component owns or coordinates some behavior, state, or data, then passes that information
to the render function. The consumer decides how that information becomes UI.

The defining characteristic is therefore not merely that a prop contains a function. The function is specifically used
as a rendering mechanism and is invoked by the component during rendering.

## Intent

Use the Render Props pattern when a component needs to provide reusable stateful behavior or data while allowing the
consuming component to control the resulting presentation.

The pattern separates behavioral ownership from rendering ownership. The component providing the render prop determines
what information is available and when the rendering function is invoked. The consumer determines what elements are
produced from that information.

```tsx
type MousePosition = {
    x: number;
    y: number;
};

type MouseTrackerProps = {
    children: (position: MousePosition) => React.ReactNode;
};

function MouseTracker({children}: MouseTrackerProps) {
    const [position, setPosition] = React.useState<MousePosition>({
        x: 0,
        y: 0,
    });

    function handleMouseMove(event: React.MouseEvent) {
        setPosition({
            x: event.clientX,
            y: event.clientY,
        });
    }

    return (
        <div onMouseMove={handleMouseMove}>
            {children(position)}
        </div>
    );
}

function Example() {
    return (
        <MouseTracker>
            {({x, y}) => (
                <p>
                    Mouse position: {x}, {y}
                </p>
            )}
        </MouseTracker>
    );
}
```

`MouseTracker` owns the mouse-position behavior. The consumer owns the presentation.

## Core Structure

A render-prop component generally has three responsibilities:

1. Maintain or coordinate some state or behavior.
2. Expose the relevant result to a rendering function.
3. Invoke that function at the appropriate point during rendering.

The consumer supplies the rendering function.

```tsx
type DataProviderProps<T> = {
    data: T;
    render: (data: T) => React.ReactNode;
};

function DataProvider<T>({
                             data,
                             render,
                         }: DataProviderProps<T>) {
    return <>{render(data)}</>;
}
```

The render function is an inversion-of-control boundary. The provider controls the invocation, while the consumer
controls the resulting UI.

## Render Prop

The most explicit form uses a named prop such as `render`.

```tsx
type User = {
    id: string;
    name: string;
};

type UserDisplayProps = {
    user: User;
    render: (user: User) => React.ReactNode;
};

function UserDisplay({user, render}: UserDisplayProps) {
    return <section>{render(user)}</section>;
}
```

A consumer can choose any presentation without modifying `UserDisplay`.

```tsx
<UserDisplay
    user={user}
    render={(user) => (
        <article>
            <h2>{user.name}</h2>
            <span>{user.id}</span>
        </article>
    )}
/>
```

The `render` prop makes the pattern explicit. It is useful when a component has multiple independently configurable
rendering regions.

## Function as Children

The `children` prop can also be the render function.

```tsx
type ToggleProps = {
    children: (open: boolean) => React.ReactNode;
};

function Toggle({children}: ToggleProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <button onClick={() => setOpen((value) => !value)}>
                Toggle
            </button>

            {children(open)}
        </div>
    );
}
```

The consumer controls the representation of the state.

```tsx
<Toggle>
    {(open) => (
        <p>{open ? "Content is visible" : "Content is hidden"}</p>
    )}
</Toggle>
```

This is commonly called the function-as-children form of the Render Props pattern. The underlying mechanism is the same:
a component invokes a consumer-provided function to obtain renderable output.

## Data Passed to the Render Function

The render function can receive whatever information the component intentionally exposes.

```tsx
type AsyncState<T> =
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: Error };

type ResourceProps<T> = {
    state: AsyncState<T>;
    children: (state: AsyncState<T>) => React.ReactNode;
};

function Resource<T>({
                         state,
                         children,
                     }: ResourceProps<T>) {
    return <>{children(state)}</>;
}
```

A consumer can then define all relevant UI states.

```tsx
<Resource state={state}>
    {(state) => {
        if (state.status === "loading") {
            return <Spinner/>;
        }

        if (state.status === "error") {
            return <ErrorMessage error={state.error}/>;
        }

        return <UserList users={state.data}/>;
    }}
</Resource>
```

The provider exposes a rendering contract rather than prescribing a visual representation.

## State Ownership

Render Props are particularly useful when reusable behavior requires internal state.

```tsx
type DisclosureProps = {
    children: (state: {
        open: boolean;
        toggle: () => void;
    }) => React.ReactNode;
};

function Disclosure({children}: DisclosureProps) {
    const [open, setOpen] = React.useState(false);

    const toggle = React.useCallback(() => {
        setOpen((value) => !value);
    }, []);

    return <>{children({open, toggle})}</>;
}
```

The component owns the state, while the consumer owns the presentation.

```tsx
<Disclosure>
    {({open, toggle}) => (
        <section>
            <button onClick={toggle}>
                {open ? "Close" : "Open"}
            </button>

            {open && <div>Content</div>}
        </section>
    )}
</Disclosure>
```

This creates a deliberate separation between state ownership and rendering ownership.

## Inversion of Control

The defining architectural property of Render Props is inversion of control over rendering.

Without the pattern, a component generally decides both what behavior it implements and what UI it renders.

With a render prop, the component retains control over behavior but delegates the rendering decision to its consumer.

```tsx
function Hover({
                   children,
               }: {
    children: (hovered: boolean) => React.ReactNode;
}) {
    const [hovered, setHovered] = React.useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children(hovered)}
        </div>
    );
}
```

The `Hover` component determines whether the pointer is currently inside the region. It does not determine whether that
should produce a tooltip, highlight, icon, animation, or completely different representation.

## Multiple Render Props

A component may expose multiple rendering functions when different regions have independent rendering contracts.

```tsx
type ListProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    renderEmpty?: () => React.ReactNode;
};

function List<T>({
                     items,
                     renderItem,
                     renderEmpty,
                 }: ListProps<T>) {
    if (items.length === 0) {
        return <>{renderEmpty?.() ?? null}</>;
    }

    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>
                    {renderItem(item, index)}
                </li>
            ))}
        </ul>
    );
}
```

This is useful when the component owns structural behavior but allows consumers to customize specific rendering
responsibilities.

However, adding many render props can make an API difficult to understand. If every part of the component is
independently injectable, ordinary component composition or Slots may express the same design more clearly.

## Render Props with Interaction

Render Props are not restricted to data retrieval. The exposed contract can contain event handlers, state transitions,
derived values, or imperative operations.

```tsx
type MenuState = {
    open: boolean;
    openMenu: () => void;
    closeMenu: () => void;
};

type MenuControllerProps = {
    children: (state: MenuState) => React.ReactNode;
};

function MenuController({
                            children,
                        }: MenuControllerProps) {
    const [open, setOpen] = React.useState(false);

    const openMenu = React.useCallback(() => {
        setOpen(true);
    }, []);

    const closeMenu = React.useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <>
            {children({
                open,
                openMenu,
                closeMenu,
            })}
        </>
    );
}
```

The consumer decides how those operations are represented.

```tsx
<MenuController>
    {({open, openMenu, closeMenu}) => (
        <div>
            <button onClick={open ? closeMenu : openMenu}>
                {open ? "Close" : "Open"}
            </button>

            {open && <MenuItems/>}
        </div>
    )}
</MenuController>
```

The component provides a behavioral protocol without prescribing a visual implementation.

## Render Prop Contracts

A render-prop API should expose the smallest useful contract.

Poorly designed contracts often expose implementation details:

```tsx
type BadProps = {
    children: (value: {
        internalState: unknown;
        internalCache: Map<string, unknown>;
        dispatch: React.Dispatch<any>;
        forceUpdate: () => void;
    }) => React.ReactNode;
};
```

The consumer should receive capabilities and information that are meaningful to the component's public behavior.

```tsx
type GoodState = {
    value: string;
    setValue: (value: string) => void;
    reset: () => void;
};
```

A narrow contract reduces coupling and makes the implementation easier to change.

## TypeScript

Render Props work naturally with generic components.

```tsx
type CollectionProps<T> = {
    items: T[];
    children: (item: T, index: number) => React.ReactNode;
};

function Collection<T>({
                           items,
                           children,
                       }: CollectionProps<T>) {
    return (
        <>
            {items.map((item, index) => children(item, index))}
        </>
    );
}
```

The consumer receives the inferred item type.

```tsx
<Collection
    items={[1, 2, 3]}
>
    {(value, index) => (
        <span>
      {index}: {value.toFixed(2)}
    </span>
    )}
</Collection>
```

A render-prop type should describe the render function's input and return value explicitly. `React.ReactNode` is
appropriate when the function can return arbitrary renderable React content.

## Referential Stability

A render function is a function value, so its identity can change whenever the parent renders.

```tsx
<MouseTracker>
    {(position) => <Coordinates position={position}/>}
</MouseTracker>
```

The function expression creates a new function during each parent render.

This is normally harmless. React applications should not introduce `useCallback` merely because a render prop is a
function.

Referential stability becomes relevant when the receiving component performs identity-sensitive optimization or uses the
function as a dependency.

```tsx
const renderUser = React.useCallback(
    (user: User) => <UserCard user={user}/>,
    [],
);

<UserList users={users} renderItem={renderUser}/>;
```

Even then, memoization should be driven by an actual rendering or dependency-management requirement rather than by the
presence of a function alone.

## Nested Render Props

Render Props can become difficult to read when several components are nested.

```tsx
<MouseTracker>
    {(position) => (
        <Toggle>
            {(open) => (
                <UserResource>
                    {(state) => (
                        <View
                            position={position}
                            open={open}
                            state={state}
                        />
                    )}
                </UserResource>
            )}
        </Toggle>
    )}
</MouseTracker>
```

This is sometimes called render-prop nesting or callback nesting. The problem is not that the pattern is invalid; the
problem is that repeated inversion of rendering control can make the component hierarchy difficult to understand.

Custom Hooks often provide a cleaner way to reuse behavior without introducing nested rendering functions.

## Render Props and Hooks

Custom Hooks and Render Props can solve similar reuse problems, but they operate at different composition boundaries.

A Custom Hook shares stateful logic directly inside a component:

```tsx
function useMousePosition() {
    const [position, setPosition] = React.useState({
        x: 0,
        y: 0,
    });

    // synchronization logic omitted

    return position;
}
```

The consumer owns both the hook invocation and the rendering:

```tsx
function Example() {
    const position = useMousePosition();

    return (
        <p>
            {position.x}, {position.y}
        </p>
    );
}
```

A Render Prop instead packages the behavior into a component and delegates rendering through a function.

```tsx
function Example() {
    return (
        <MouseTracker>
            {(position) => (
                <p>
                    {position.x}, {position.y}
                </p>
            )}
        </MouseTracker>
    );
}
```

In modern React, Custom Hooks are often preferable when the primary requirement is reuse of stateful logic. Render Props
remain useful when the abstraction itself should remain a component-level rendering boundary or when the consumer needs
to supply a rendering function as part of the API.

## Render Props vs Children

Ordinary `children` are already a composition mechanism, but normal children are values rather than rendering functions.

```tsx
<Card>
    <UserProfile/>
</Card>
```

A render-prop child is executable by the receiving component:

```tsx
<CardState>
    {(state) => <UserProfile state={state}/>}
</CardState>
```

The distinction is whether the receiving component merely renders supplied content or invokes a supplied function to
determine content dynamically.

## Render Props vs Slots

Slots provide named insertion points for supplied content.

```tsx
<Dialog
    header={<DialogTitle/>}
    footer={<DialogActions/>}
/>
```

The component determines the structure and renders the supplied elements in predefined locations.

A render prop provides a function that the component invokes to generate content.

```tsx
<DataView
    render={(data) => <UserList data={data}/>}
/>
```

The defining difference is that a slot supplies content, while a render prop supplies a rendering operation that
receives data or behavior from the component.

Slots are generally preferable for structural customization. Render Props are more appropriate when rendering depends on
values controlled by the receiving component.

## Render Props vs Compound Components

Compound Components coordinate multiple components through a shared parent-controlled protocol.

```tsx
<Tabs>
    <Tabs.List/>
    <Tabs.Tab/>
    <Tabs.Panel/>
</Tabs>
```

Render Props instead delegate rendering through a function.

```tsx
<TabsState>
    {(state) => (
        <CustomTabs state={state}/>
    )}
</TabsState>
```

Compound Components are useful when consumers should compose a predefined family of coordinated components. Render Props
are useful when consumers should receive behavioral state and decide what UI to produce.

## Render Props vs Higher-Order Components

A Higher-Order Component transforms a component by wrapping it.

```tsx
const EnhancedComponent = withData(Component);
```

A Render Prop exposes behavior during rendering.

```tsx
<DataProvider>
    {(data) => <Component data={data}/>}
</DataProvider>
```

HOCs operate primarily through component transformation and prop injection. Render Props operate through explicit
rendering delegation.

Render Props are often easier to reason about locally because the relationship between the provider and the rendered
output is visible at the call site. HOCs can be useful when the same enhancement needs to be applied to many components
without changing their JSX structure.

## Render Props vs Context

Context provides values implicitly to descendants.

```tsx
const ThemeContext = React.createContext<Theme | null>(null);
```

A Render Prop provides values explicitly to a rendering function.

```tsx
<ThemeProvider>
    {(theme) => <Button theme={theme}/>}
</ThemeProvider>
```

Context is appropriate for values that many descendants need without explicit prop threading. Render Props are
appropriate when the consumer should explicitly control rendering based on the supplied contract.

The two patterns can also be combined. A component may obtain state from Context and expose a render-prop interface to a
local consumer.

## Accessibility

A Render Props abstraction must not delegate away accessibility responsibilities that belong to the behavior it
implements.

For example, a disclosure abstraction that manages expanded state should provide the information necessary for a
consumer to construct an accessible control.

```tsx
<Disclosure>
    {({open, toggle}) => (
        <>
            <button
                type="button"
                aria-expanded={open}
                onClick={toggle}
            >
                Details
            </button>

            {open && <section>...</section>}
        </>
    )}
</Disclosure>
```

The rendering consumer remains responsible for producing valid semantic markup, while the behavioral abstraction
provides the state and operations necessary to do so.

For reusable accessibility primitives, the render contract should expose semantic state and interaction requirements
rather than forcing consumers to reverse-engineer internal behavior.

## Testing

Render Props can be tested at two levels.

The behavioral component should verify that it maintains the expected state and supplies the correct render-prop
contract.

```tsx
render(
    <Toggle>
        {(open) => <span>{String(open)}</span>}
    </Toggle>,
);

expect(screen.getByText("false")).toBeInTheDocument();
```

The consuming rendering function should be tested according to the UI it produces.

The abstraction should not require tests for every possible rendering implementation. Its contract should be tested
independently from the consumer's presentation.

## Common Misuses

A function-valued prop is not automatically a Render Prop.

This is an ordinary callback:

```tsx
<Button onClick={handleClick}>
    Save
</Button>
```

`onClick` communicates an event to the consumer. It is not used to determine the component's rendered output.

This is a render prop:

```tsx
<DataProvider
    render={(data) => <DataView data={data}/>}
/>
```

The function is specifically responsible for producing renderable output.

Another common misuse is using a render prop when ordinary composition already expresses the requirement clearly.

```tsx
<Card>
    <UserProfile/>
</Card>
```

Introducing a render function here adds indirection without providing a meaningful rendering contract.

Excessive nesting is another failure mode. If multiple render props are required merely to share several independent
pieces of state, Custom Hooks or Context may provide a clearer abstraction.

A render-prop contract can also become too broad. Exposing every internal state variable, dispatcher, cache, and
implementation detail couples consumers to the provider's internals and makes future changes expensive.

## Advantages

Render Props provide explicit inversion of control over rendering. They allow a component to encapsulate reusable
stateful behavior while permitting consumers to choose the visual representation.

They also make the data flow explicit. The values provided to the rendering function are visible at the usage site
rather than being injected implicitly through Context or transformed into component props through a HOC.

The pattern is highly flexible because the same behavioral abstraction can support radically different presentations.

## Disadvantages

Render Props increase API and JSX complexity. The consumer must understand the rendering contract, and deeply nested
render functions can become difficult to read.

Function identity can also become relevant in optimized components, although this is not inherently a problem.

The pattern may additionally expose more rendering responsibility to consumers than is desirable. If the component must
guarantee a particular structure, accessibility behavior, or visual contract, ordinary composition, Slots, or a
dedicated component API may be more appropriate.

In modern React, many historical Render Props use cases are better represented by Custom Hooks. This does not make
Render Props obsolete; it means the pattern should be selected for its rendering inversion-of-control semantics rather
than used as a generic mechanism for sharing logic.

## When to Use

Use Render Props when:

* a component owns reusable state or behavior;
* consumers need access to that behavior during rendering;
* different consumers need substantially different presentations;
* the rendering contract should be explicit at the usage site;
* the provider should remain responsible for coordinating state or interaction;
* a component-level abstraction is more appropriate than exposing a Custom Hook.

Avoid Render Props when:

* ordinary `children` already solve the problem;
* a named slot is sufficient;
* the primary goal is simply sharing stateful logic;
* a Custom Hook provides a clearer abstraction;
* multiple nested render functions would make the component hierarchy difficult to understand;
* the component needs to enforce a fixed presentation or structural contract.

## Relationship to Other Patterns

Render Props occupy a specific position among React composition techniques.

Component Composition assembles components through supplied children and props. Render Props extend that mechanism by
making the supplied value executable and allowing the receiving component to pass state or data into it.

Slots provide named structural insertion points. Compound Components coordinate a family of child components through
shared state and a protocol. Render Props instead delegate rendering to a function.

Higher-Order Components transform components by wrapping them. Custom Hooks extract reusable stateful logic without
creating a rendering boundary. Context provides implicit descendant access to shared values. Render Props provide
explicit rendering-time access to values controlled by the component.

The central characteristic remains unchanged: the component owns the behavior or data, while a consumer-provided
function owns the rendering decision.
