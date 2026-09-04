# Function as Children

## Intent

Function as Children is a React composition pattern in which the `children` prop is a function rather than rendered
React content.

The component invokes that function and supplies values, state, or behavior as arguments. The function determines what
React elements should be rendered.

This allows a component to own behavior while delegating the rendering decision to its consumer.

```jsx
function MousePosition({children}) {
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        function handleMove(event) {
            setPosition({
                x: event.clientX,
                y: event.clientY,
            });
        }

        window.addEventListener("mousemove", handleMove);

        return () => {
            window.removeEventListener("mousemove", handleMove);
        };
    }, []);

    return children(position);
}
```

The consumer supplies a function:

```jsx
<MousePosition>
    {({x, y}) => (
        <p>
            Cursor: {x}, {y}
        </p>
    )}
</MousePosition>
```

The component owns the behavior and state required to track the mouse position. The consumer owns the rendering.

## Basic Pattern

The fundamental structure is:

```jsx
function Component({children}) {
    const value = getValue();

    return children(value);
}
```

The consumer provides a function as `children`:

```jsx
<Component>
    {value => (
        <View value={value}/>
    )}
</Component>
```

The function can receive one value or an object containing several values.

```jsx
<Component>
    {({data, loading, error, retry}) => (
        <View
            data={data}
            loading={loading}
            error={error}
            onRetry={retry}
        />
    )}
</Component>
```

The component therefore establishes a behavioral contract while the child function establishes the rendering contract.

## Children Is a Prop

React's `children` is simply a prop with conventional JSX syntax.

These two forms are equivalent in principle:

```jsx
<Component>
    {render}
</Component>
```

and:

```jsx
<Component children={render}/>
```

When `render` is a function, the component receives that function through its `children` prop.

```jsx
function Component({children}) {
    return children();
}
```

Function as Children therefore does not require a special React primitive. It is a convention built on the normal
`children` prop.

## Rendering Contract

The component defines what information it makes available to the child function.

```jsx
function Toggle({children}) {
    const [on, setOn] = useState(false);

    return children({
        on,
        toggle: () => setOn(value => !value),
    });
}
```

The consumer decides how that contract becomes UI.

```jsx
<Toggle>
    {({on, toggle}) => (
        <button onClick={toggle}>
            {on ? "Enabled" : "Disabled"}
        </button>
    )}
</Toggle>
```

The component does not prescribe the button, text, styling, or surrounding markup.

## Behavior Ownership

The primary architectural separation is between behavior and rendering.

The Function-as-Children component can own:

* state;
* event handling;
* subscriptions;
* asynchronous state;
* accessibility state;
* interaction logic;
* resource lifecycle;
* calculations;
* reusable behavioral rules.

The child function can own:

* element selection;
* visual structure;
* content;
* styling;
* layout;
* presentation-specific behavior.

For example:

```jsx
function Disclosure({children}) {
    const [open, setOpen] = useState(false);

    function toggle() {
        setOpen(value => !value);
    }

    return children({
        open,
        toggle,
    });
}
```

A consumer can render the same behavior as a button:

```jsx
<Disclosure>
    {({open, toggle}) => (
        <button onClick={toggle}>
            {open ? "Hide details" : "Show details"}
        </button>
    )}
</Disclosure>
```

Another consumer can render it differently:

```jsx
<Disclosure>
    {({open, toggle}) => (
        <div>
            <a href="#" onClick={toggle}>
                Details
            </a>

            {open && <section>Additional information</section>}
        </div>
    )}
</Disclosure>
```

The behavioral implementation is shared while the presentation remains consumer-controlled.

## Multiple Values

The child function can receive a structured API.

```jsx
function FetchState({children}) {
    const [state, setState] = useState({
        status: "idle",
        data: null,
        error: null,
    });

    function retry() {
        // ...
    }

    return children({
        status: state.status,
        data: state.data,
        error: state.error,
        retry,
    });
}
```

The object form is generally easier to evolve than positional arguments.

Prefer:

```jsx
children({
    data,
    loading,
    error,
    retry,
});
```

over:

```jsx
children(data, loading, error, retry);
```

A named object communicates the contract more clearly and allows additional values to be added without changing the
positional structure.

## Consumer-Controlled Rendering

The child function determines the returned React node.

```jsx
<DataProvider>
    {data => <List items={data}/>}
</DataProvider>
```

The provider cannot assume that the consumer wants a particular presentation.

The same behavior can therefore support different representations.

```jsx
<DataProvider>
    {data => <Table rows={data}/>}
</DataProvider>
```

or:

```jsx
<DataProvider>
    {data => <CardGrid items={data}/>}
</DataProvider>
```

or:

```jsx
<DataProvider>
    {data => <Summary data={data}/>}
</DataProvider>
```

This is the principal reason to use the pattern.

## Function as Children Versus Ordinary Children

Ordinary children are React nodes:

```jsx
<Panel>
    <Content/>
</Panel>
```

A component normally renders them directly:

```jsx
function Panel({children}) {
    return <section>{children}</section>;
}
```

Function as Children changes the contract:

```jsx
<Panel>
    {value => <Content value={value}/>}
</Panel>
```

The component must invoke the function:

```jsx
function Panel({children}) {
    const value = getValue();

    return children(value);
}
```

Therefore, a Function-as-Children component is not merely a component that happens to receive children. Its contract
specifically requires callable children.

## Runtime Validation

A component expecting Function as Children should treat `children` as a function.

```jsx
function Component({children}) {
    if (typeof children !== "function") {
        throw new Error(
            "Component requires function children."
        );
    }

    return children(value);
}
```

In TypeScript, the contract can be expressed statically.

```tsx
type ToggleRenderProps = {
    on: boolean;
    toggle: () => void;
};

type ToggleProps = {
    children: (props: ToggleRenderProps) => React.ReactNode;
};

function Toggle({children}: ToggleProps) {
    const [on, setOn] = useState(false);

    return children({
        on,
        toggle: () => setOn(value => !value),
    });
}
```

The type system makes the intended usage explicit.

## Return Value

The child function normally returns a React node.

```jsx
<Provider>
    {value => <Display value={value}/>}
</Provider>
```

The component can return the result directly:

```jsx
return children(value);
```

The returned value can also be conditionally used:

```jsx
return children({
    loading,
    data,
    error,
});
```

The component should not unnecessarily wrap the result in additional markup if doing so would interfere with the
consumer's rendering control.

## Conditional Rendering

The child function can decide how different behavioral states should be represented.

```jsx
<DataLoader>
    {({loading, data, error}) => {
        if (loading) {
            return <Spinner/>;
        }

        if (error) {
            return <ErrorMessage error={error}/>;
        }

        return <Results data={data}/>;
    }}
</DataLoader>
```

The behavior component exposes the state. The consumer determines the presentation of each state.

This can be useful when different consumers need materially different loading, error, empty, or success UI.

## Passing Actions

The component can expose operations alongside state.

```jsx
function Counter({children}) {
    const [count, setCount] = useState(0);

    return children({
        count,
        increment: () => setCount(value => value + 1),
        decrement: () => setCount(value => value - 1),
        reset: () => setCount(0),
    });
}
```

The consumer chooses how those operations are presented.

```jsx
<Counter>
    {({count, increment, decrement, reset}) => (
        <div>
            <button onClick={decrement}>−</button>
            <span>{count}</span>
            <button onClick={increment}>+</button>
            <button onClick={reset}>Reset</button>
        </div>
    )}
</Counter>
```

The component exposes behavior rather than prescribing controls.

## Headless Behavior

Function as Children can be used to build headless components.

A headless component encapsulates behavior while leaving visual rendering to its consumer.

```jsx
<Listbox>
    {({
          options,
          selected,
          open,
          getOptionProps,
          getTriggerProps,
      }) => (
        // consumer-defined markup
    )}
</Listbox>
```

The component can manage selection, keyboard interaction, focus behavior, accessibility attributes, and state while the
consumer determines the visual structure.

Function as Children is therefore one possible implementation technique for a headless component.

A headless component does not require Function as Children. It can instead expose a custom Hook, compound components,
slots, or another API.

## State Ownership

The Function-as-Children component generally owns the behavioral state it exposes.

```jsx
function Toggle({children}) {
    const [open, setOpen] = useState(false);

    return children({
        open,
        toggle: () => setOpen(value => !value),
    });
}
```

The child function does not own `open`. It receives the current value and operations through the rendering contract.

The component therefore remains the state owner while allowing the consumer to determine the representation.

This is distinct from a controlled component, where the state owner exists outside the component.

## Controlled Function-as-Children Components

Function as Children can also expose a controlled state contract.

```jsx
function Selection({
                       value,
                       onChange,
                       children,
                   }) {
    return children({
        value,
        select: onChange,
    });
}
```

Usage:

```jsx
<Selection
    value={selected}
    onChange={setSelected}
>
    {({value, select}) => (
        <List
            selected={value}
            onSelect={select}
        />
    )}
</Selection>
```

The rendering remains consumer-controlled, while the state itself is externally controlled.

Therefore, Function as Children and controlled/uncontrolled ownership describe different dimensions of component design.

## Composition

Function as Children can be nested.

```jsx
<MousePosition>
    {position => (
        <Toggle>
            {({on, toggle}) => (
                <View
                    position={position}
                    active={on}
                    onToggle={toggle}
                />
            )}
        </Toggle>
    )}
</MousePosition>
```

Each behavioral component exposes its own contract.

However, deeply nested Function-as-Children components can make JSX difficult to read.

When multiple behavioral concerns must be combined, custom Hooks or another composition mechanism may provide a clearer
API.

## Function Identity

The child function is created by the parent render.

```jsx
<Component>
    {value => <View value={value}/>}
</Component>
```

The function therefore commonly receives a new identity on each parent render.

This can matter when the Function-as-Children implementation treats the child function as an identity-sensitive value.

A component should not generally depend on the identity of the child function for correctness.

Memoization can technically stabilize the function, but doing so solely to compensate for a poorly designed
child-rendering architecture may add unnecessary complexity.

## Render Cost

Function as Children introduces an invocation during rendering.

```jsx
return children(value);
```

The function executes as part of the component's render process.

This is normally inexpensive. The important performance consideration is the resulting render structure, not the
function call itself.

Because the child function is invoked whenever the parent component renders, consumers should avoid expensive rendering
work that is unrelated to actual changes in the exposed behavioral state.

Memoization can be considered when profiling demonstrates a real rendering bottleneck.

## Function as Children and Memoization

A child function can prevent some straightforward memoization strategies because the parent creates the function during
rendering.

For example:

```jsx
<Component>
    {value => <ExpensiveView value={value}/>}
</Component>
```

If optimization becomes necessary, the expensive visual component can be extracted:

```jsx
function View({value}) {
    return <ExpensiveView value={value}/>;
}

<Component>
    {value => <View value={value}/>}
</Component>
```

The relevant optimization should target actual rendering costs rather than attempting to memoize every function
indiscriminately.

Function identity itself is not a performance problem unless it participates in a meaningful identity-sensitive
operation.

## Function as Children and Custom Hooks

A custom Hook can often implement the same behavioral logic more directly.

Function as Children:

```jsx
<MousePosition>
    {position => (
        <Cursor position={position}/>
    )}
</MousePosition>
```

Custom Hook:

```jsx
function Cursor() {
    const position = useMousePosition();

    return <CursorView position={position}/>;
}
```

The custom Hook allows the consumer to access behavior directly inside the component's rendering logic.

Function as Children can be preferable when the behavioral component should remain a distinct composition boundary or
when the consumer needs a localized render callback.

Custom Hooks are often preferable when the primary requirement is reusable logic rather than a distinct render-time
component boundary.

## Function as Children and Render Props

Function as Children is a specific form of the broader render-props technique.

General render props:

```jsx
<Component
    render={value => <View value={value}/>}
/>
```

Function as Children:

```jsx
<Component>
    {value => <View value={value}/>}
</Component>
```

Both pass a function from the consumer to the component so that the component can provide values to the rendering
function.

The difference is where the function is stored in the component API.

A render prop is an explicitly named prop such as `render`, `children`, or another domain-specific name.

Function as Children specifically uses the conventional `children` prop.

Therefore, this pattern should not be treated as an entirely separate behavioral mechanism from render props. It is a
specific API shape and composition convention.

## Choosing Between Function as Children and a Named Render Prop

Function as Children is concise when the component has one primary rendering contract.

```jsx
<Fetcher>
    {state => <Results state={state}/>}
</Fetcher>
```

A named render prop can be clearer when the component also has meaningful ordinary children.

```jsx
<Component
    header={<Header/>}
    render={state => <Results state={state}/>}
/>
```

A named function prop can also make an API clearer when multiple rendering functions exist.

```jsx
<Component
    renderItem={item => <Item item={item}/>}
    renderEmpty={() => <Empty/>}
/>
```

The choice is an API-design decision.

## Function as Children and Slots

Slots provide named insertion points.

```jsx
<Card>
    <Card.Header/>
    <Card.Body/>
</Card>
```

Function as Children instead provides a callable rendering contract.

```jsx
<Data>
    {data => <Card data={data}/>}
</Data>
```

Slots are appropriate when consumers provide structural content for predefined locations.

Function as Children is appropriate when the component must provide runtime behavioral data to determine the rendered
result.

The two techniques can also be combined.

## Function as Children and Compound Components

Compound components expose several cooperating components around shared behavior.

```jsx
<Tabs>
    <Tabs.List/>
    <Tabs.Panel/>
</Tabs>
```

Function as Children exposes behavior through a rendering function.

```jsx
<Tabs>
    {({activeTab, selectTab}) => (
        <CustomTabs
            activeTab={activeTab}
            onSelect={selectTab}
        />
    )}
</Tabs>
```

Compound components are generally better when the API should be expressed as a declarative family of components.

Function as Children is better when consumers need direct access to the behavior contract during rendering.

## Function as Children and Component Composition

Function as Children is a composition mechanism rather than a state-management system.

It allows a component to provide capabilities to a consumer-controlled rendering function.

The component can therefore be composed around behavior:

```jsx
<Feature>
    {featureState => (
        <CustomPresentation state={featureState}/>
    )}
</Feature>
```

The consumer can replace the presentation without replacing the underlying behavior.

## Accessibility

A behavior component can expose accessibility-related information through the child function.

```jsx
function Disclosure({children}) {
    const [open, setOpen] = useState(false);

    return children({
        open,
        triggerProps: {
            "aria-expanded": open,
            onClick: () => setOpen(value => !value),
        },
    });
}
```

The consumer can apply the supplied behavior:

```jsx
<Disclosure>
    {({open, triggerProps}) => (
        <button {...triggerProps}>
            {open ? "Hide" : "Show"}
        </button>
    )}
</Disclosure>
```

For complex accessible widgets, the behavioral contract may include:

* ARIA attributes;
* keyboard handlers;
* focus-management functions;
* IDs;
* relationships between elements;
* selection state;
* disabled state;
* interaction handlers.

The component should expose a contract that is sufficiently precise to preserve the behavioral invariants it owns.

## Avoiding Leaky Contracts

A Function-as-Children component should not expose every internal implementation detail.

Avoid:

```jsx
children({
    state,
    setState,
    dispatch,
    reducer,
    internalRef,
    effectStatus,
    internalCache,
    // ...
});
```

Prefer a semantic API:

```jsx
children({
    selected,
    select,
    clear,
});
```

The consumer should depend on the behavior the component promises rather than on its internal state representation.

This makes the component easier to evolve.

## Error Handling

Behavioral state can expose errors through the child function.

```jsx
<DataLoader>
    {({status, data, error, retry}) => {
        if (status === "error") {
            return (
                <ErrorState
                    error={error}
                    onRetry={retry}
                />
            );
        }

        if (status === "loading") {
            return <Spinner/>;
        }

        return <Results data={data}/>;
    }}
</DataLoader>
```

The consumer determines the presentation of the error.

The behavioral component remains responsible for defining the error contract.

For rendering failures themselves, Error Boundaries remain the appropriate containment mechanism.

## Async Behavior

Function as Children can expose asynchronous state without prescribing its UI.

```jsx
function Resource({children}) {
    const [state, setState] = useState({
        status: "idle",
        data: null,
        error: null,
    });

    async function load() {
        setState({
            status: "loading",
            data: null,
            error: null,
        });

        try {
            const data = await fetchData();

            setState({
                status: "success",
                data,
                error: null,
            });
        } catch (error) {
            setState({
                status: "error",
                data: null,
                error,
            });
        }
    }

    return children({
        ...state,
        load,
    });
}
```

The pattern can therefore separate asynchronous behavior from presentation.

However, a component should not implement shared resource caching or server-state synchronization merely because it
exposes asynchronous state through Function as Children. Those concerns have different ownership requirements.

## Ref and Imperative Behavior

A Function-as-Children component can expose imperative capabilities when those capabilities are genuinely part of its
behavioral contract.

```jsx
function FocusManager({children}) {
    const inputRef = useRef(null);

    function focus() {
        inputRef.current?.focus();
    }

    return children({
        focus,
        inputRef,
    });
}
```

The exposed imperative interface should remain narrow.

Function as Children should not become a mechanism for leaking arbitrary internal refs or mutable implementation state.

## Testing

The behavioral component can be tested independently from a particular visual design.

```jsx
render(
    <Toggle>
        {({on, toggle}) => (
            <button onClick={toggle}>
                {on ? "On" : "Off"}
            </button>
        )}
    </Toggle>
);
```

Tests can verify:

* the initial contract;
* state transitions;
* exposed operations;
* callbacks;
* accessibility data;
* loading and error states;
* cleanup behavior;
* behavior across rerenders.

Consumer rendering can be tested separately.

This separation can be useful when the same behavior is consumed by several presentations.

## Server Rendering

Function as Children is compatible with server rendering when the component and child function can execute in the
relevant rendering environment.

The behavioral implementation must still respect the distinction between server-executable and browser-only code.

Browser APIs, Effects, event subscriptions, and other client-only behavior cannot simply be introduced into a
server-rendered component because the rendering contract happens to be a function.

The pattern itself does not determine whether a component executes on the server or client.

## Common Misuse

### Using a Function When No Runtime Data Is Needed

Avoid:

```jsx
<Panel>
    {() => <Content/>}
</Panel>
```

when the component does not provide meaningful behavior or data.

Ordinary children are simpler:

```jsx
<Panel>
    <Content/>
</Panel>
```

### Exposing Internal State Instead of a Semantic Contract

Avoid making consumers dependent on implementation details.

```jsx
children({
    internalState,
    dispatch,
    setInternalState,
});
```

Expose the behavior the consumer actually needs.

### Using Function as Children Everywhere

The pattern introduces an additional abstraction boundary.

If ordinary composition is sufficient, ordinary children are clearer.

### Deep Render-Function Nesting

This can become difficult to read:

```jsx
<A>
    {a => (
        <B>
            {b => (
                <C>
                    {c => (
                        <View a={a} b={b} c={c}/>
                    )}
                </C>
            )}
        </B>
    )}
</A>
```

When several independent behaviors must be composed, custom Hooks or another API can provide a flatter structure.

### Recreating Custom Hooks

If the only requirement is reusable stateful logic, a custom Hook may provide a simpler abstraction.

### Treating Children as Ordinary Nodes

A Function-as-Children component must explicitly invoke its child function.

```jsx
return children;
```

does not execute the contract.

The intended implementation is:

```jsx
return children(value);
```

### Passing Too Many Values

A large rendering contract indicates that the component may be exposing too much implementation detail or combining too
many responsibilities.

Keep the contract focused.

### Returning Fixed Markup Around Consumer Output

If the purpose of the component is to delegate rendering, unnecessary wrappers can undermine that responsibility split.

Only impose structural markup when it is part of the component's actual contract.

## Advantages

Function as Children separates behavior from presentation while keeping the behavioral contract explicit.

It allows consumers to completely control the rendered structure.

It can expose state and operations without requiring a large component hierarchy.

It works naturally for headless behavior.

It can support multiple presentations of the same behavior.

It allows the behavioral implementation to remain encapsulated while exposing a semantic render-time API.

It can provide a convenient alternative to named render props when there is one primary rendering contract.

## Disadvantages

The JSX syntax can become nested and difficult to read.

The child function is executed during rendering, which can make the component's control flow less obvious to developers
unfamiliar with the pattern.

The pattern can complicate straightforward memoization in some architectures.

Large rendering contracts can expose too much implementation detail.

Many nested render functions can become more cumbersome than custom Hooks.

It is often unnecessary when ordinary children or direct component composition already express the required
relationship.

## When to Use

Use Function as Children when:

* a component owns reusable behavior but should not prescribe its presentation;
* the consumer needs runtime state or operations during rendering;
* there is one primary rendering contract;
* a headless behavior API is useful;
* multiple presentations should consume the same behavior;
* the behavior needs to remain encapsulated behind a component boundary;
* a render-time callback provides a clearer API than a collection of individual props.

Typical examples include:

* headless interactive widgets;
* mouse or pointer tracking;
* reusable selection behavior;
* disclosure behavior;
* drag-and-drop behavior;
* asynchronous state presenters;
* permission or capability checks;
* responsive or environmental state;
* reusable interaction state.

## When Not to Use

Do not use Function as Children when:

* ordinary children already express the composition;
* no meaningful runtime value needs to be supplied;
* a custom Hook provides a substantially simpler API;
* compound components provide a clearer declarative interface;
* slots are the actual requirement;
* the component needs a named render function alongside ordinary children;
* nested render functions would make the resulting API harder to understand.

## Relationship to Other Patterns

`04-render-props.md` defines the general render-props pattern, where a component accepts a function-valued prop to
control rendering. Function as Children is the specific case where that function is supplied through `children`.

`01-component-composition.md` provides the broader composition model. Function as Children is a specialized composition
technique for passing runtime behavior or state into consumer-controlled rendering.

`03-slots.md` provides named structural insertion points. Function as Children instead provides a callable rendering
contract.

`02-compound-components.md` provides a family of cooperating components around shared behavior or state. Function as
Children provides direct access to a behavior contract through a render function.

`06-custom-hooks.md` provides reusable React logic without requiring a render-function component boundary. A custom Hook
is often the simpler alternative when the consumer primarily needs behavior rather than a distinct component
abstraction.

`09-ref-pattern.md` and `27-imperative-handle.md` are relevant when the behavior contract includes refs or constrained
imperative operations.

`25-external-store.md` and `19-server-state.md` concern state and resource ownership. Function as Children does not
define where the underlying state or resource comes from; it defines how that behavior is exposed to rendering.

`38-headless-components.md` describes the broader headless-component architecture. Function as Children is one possible
API mechanism for implementing a headless component.

`20-local-state.md` and `25-controlled-uncontrolled-components.md` define state ownership. A Function-as-Children
component can own local state, expose controlled state, or expose behavior backed by another state owner.

## Design Rules

1. Treat `children` as a function only when the function is an intentional part of the component contract.

2. Define a small, semantic render-function API.

3. Prefer named objects over long positional argument lists.

4. Keep behavioral ownership inside the component that owns the behavior.

5. Let the consumer control presentation when presentation is not part of the component's responsibility.

6. Do not expose internal state or implementation mechanisms unnecessarily.

7. Use ordinary children when no runtime behavior or data needs to be supplied.

8. Prefer custom Hooks when reusable logic does not require a component-level rendering boundary.

9. Prefer named render props when multiple rendering functions or ordinary children need to coexist.

10. Avoid deeply nested Function-as-Children composition.

11. Do not confuse the rendering mechanism with state ownership.

12. Treat Function as Children as a specific form of render-prop composition rather than as an independent
    state-management mechanism.

## Summary

Function as Children is a React composition pattern in which `children` is a function that receives runtime values,
state, or operations from its parent component and returns the consumer-defined UI.

The component owns the behavior:

```jsx
function Toggle({children}) {
    const [on, setOn] = useState(false);

    return children({
        on,
        toggle: () => setOn(value => !value),
    });
}
```

The consumer owns the presentation:

```jsx
<Toggle>
    {({on, toggle}) => (
        <button onClick={toggle}>
            {on ? "On" : "Off"}
        </button>
    )}
</Toggle>
```

The pattern is especially useful for headless behavior and consumer-controlled rendering. It is a specific form of
render props, distinguished by using the `children` prop as the rendering function.

Its primary value is the separation of reusable behavior from presentation without forcing the consumer into a
predefined visual structure.
