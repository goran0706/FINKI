# Ref Forwarding

Ref forwarding is the pattern of allowing a component to expose a reference to an underlying DOM node or imperative
component instance to its parent or another consumer.

A ref normally belongs to the component that creates it. Ref forwarding changes the ownership boundary by allowing a
component that renders another element or component to explicitly expose that underlying ref target through its own API.

This is useful when a component is intended to be a transparent wrapper around a focusable, measurable, scrollable, or
otherwise imperative target.

## Intent

The intent of ref forwarding is to preserve imperative access to an underlying target across a component boundary.

Without ref forwarding:

```tsx
function TextInput() {
    return <input/>;
}
```

A parent cannot attach a ref to the internal `<input>` and expect that ref to point to it through the component
abstraction.

With ref forwarding:

```tsx
const TextInput = forwardRef<HTMLInputElement, Props>(
    function TextInput(props, ref) {
        return <input {...props} ref={ref}/>;
    }
);
```

The parent can write:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

<TextInput ref={inputRef}/>;
```

The ref now terminates at the DOM node selected by the component.

## The Ref Boundary

A ref attached to a custom function component is not automatically forwarded to an element rendered inside that
component.

```tsx
function TextInput() {
    return <input/>;
}
```

This does not establish:

```tsx
<TextInput ref={inputRef}/>
```

as a ref to the `<input>`.

The component itself is a separate abstraction boundary.

Ref forwarding explicitly defines what lies on the other side of that boundary.

```tsx
const TextInput = forwardRef<HTMLInputElement, Props>(
    function TextInput(props, ref) {
        return <input {...props} ref={ref}/>;
    }
);
```

The component therefore exposes an imperative target as part of its API.

## Basic Pattern

The traditional `forwardRef` API receives the ref separately from ordinary props.

```tsx
import {forwardRef} from "react";

type Props = {
    placeholder?: string;
};

const TextInput = forwardRef<HTMLInputElement, Props>(
    function TextInput({placeholder}, ref) {
        return (
            <input
                ref={ref}
                placeholder={placeholder}
            />
        );
    }
);
```

A consumer can then use:

```tsx
function Form() {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <TextInput ref={inputRef}/>
            <button onClick={() => inputRef.current?.focus()}>
                Focus
            </button>
        </>
    );
}
```

The component remains responsible for deciding which underlying target receives the ref.

## Ref Forwarding Is Explicit

Forwarding is not the same as passing a ref through props under an arbitrary name.

```tsx
type Props = {
    inputRef: React.Ref<HTMLInputElement>;
};
```

This is simply a normal prop:

```tsx
<TextInput inputRef={inputRef}/>
```

The component can use it:

```tsx
function TextInput({inputRef}: Props) {
    return <input ref={inputRef}/>;
}
```

This can be a valid API, but it is not the same abstraction as exposing the component's ref interface.

A standard `ref` communicates that the component participates in React's ref mechanism.

## Ref Targets

The forwarded ref can target different kinds of objects depending on what the component exposes.

A DOM component can forward a DOM element:

```tsx
const Button = forwardRef<HTMLButtonElement, Props>(
    function Button(props, ref) {
        return <button {...props} ref={ref}/>;
    }
);
```

A component can instead expose an imperative handle:

```tsx
const Input = forwardRef<InputHandle, Props>(
    function Input(props, ref) {
        useImperativeHandle(ref, () => ({
            focus() {
                inputRef.current?.focus();
            },
        }));

        return <input ref={inputRef}/>;
    }
);
```

These are related but distinct patterns.

Ref forwarding determines how the ref crosses the component boundary.

Imperative handles determine which imperative API is exposed through that ref.

## DOM Ref Forwarding

The simplest use case is forwarding to a DOM node.

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button({children, ...props}, ref) {
        return (
            <button ref={ref} {...props}>
                {children}
            </button>
        );
    }
);
```

The consumer receives the actual DOM element:

```tsx
const buttonRef = useRef<HTMLButtonElement>(null);

<Button ref={buttonRef}>Save</Button>;

buttonRef.current?.focus();
```

This allows consumers to perform imperative operations supported by the DOM element.

Typical examples include:

* focus
* selection
* measurement
* scrolling
* imperative browser APIs
* integration with third-party DOM libraries

## Wrapper Components

Ref forwarding is especially important for components that visually or structurally wrap another element.

```tsx
const Input = forwardRef<HTMLInputElement, Props>(
    function Input({label, ...props}, ref) {
        return (
            <label>
                {label}
                <input ref={ref} {...props} />
            </label>
        );
    }
);
```

The wrapper can introduce structure without preventing the consumer from reaching the actual input.

```tsx
const ref = useRef<HTMLInputElement>(null);

<Input ref={ref}/>
```

The ref points to the `<input>`, not the surrounding `<label>`.

This is an API decision and should be intentional.

## Ref Forwarding and Component Abstraction

A component abstraction can hide implementation details while still exposing a deliberately selected imperative target.

```tsx
const SearchInput = forwardRef<HTMLInputElement, Props>(
    function SearchInput(props, ref) {
        return (
            <div className="search-input">
                <input ref={ref} {...props} />
            </div>
        );
    }
);
```

The consumer does not need to know about the wrapper.

However, exposing a ref also creates a dependency on the selected imperative target.

Changing the implementation from:

```tsx
<input ref={ref}/>
```

to:

```tsx
<div>
    <input/>
</div>
```

changes the meaning of the component's ref API if the ref no longer points to the input.

Ref behavior is therefore part of the component's public contract.

## Ref Forwarding and TypeScript

The generic parameters of `forwardRef` commonly specify the exposed target and props.

```tsx
type Props = {
    disabled?: boolean;
};

const Button = forwardRef<HTMLButtonElement, Props>(
    function Button({disabled}, ref) {
        return (
            <button
                ref={ref}
                disabled={disabled}
            />
        );
    }
);
```

The first generic parameter describes the ref target:

```tsx
HTMLButtonElement
```

The second describes the component props:

```tsx
Props
```

This gives consumers appropriate type checking:

```tsx
const buttonRef = useRef<HTMLButtonElement>(null);

<Button ref={buttonRef}/>;
```

An incompatible ref target should be rejected by the type system.

## Nullable Refs

DOM refs are nullable because the target does not necessarily exist at all times.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

Consumers must account for:

* initial render
* conditional rendering
* unmounting
* component replacement

For example:

```tsx
inputRef.current?.focus();
```

The ref should not be treated as permanently populated.

## Callback Refs

Ref forwarding supports callback refs as well as object refs.

```tsx
const setInput = (node: HTMLInputElement | null) => {
    if (node) {
        node.focus();
    }
};

<TextInput ref={setInput}/>;
```

The forwarded component should generally pass the received ref directly to its target:

```tsx
<input ref={ref}/>
```

rather than assuming that the ref is always a mutable object.

## Ref Composition

A component sometimes needs its own internal ref while also forwarding a consumer ref.

```tsx
const Input = forwardRef<HTMLInputElement, Props>(
    function Input(props, forwardedRef) {
        const internalRef = useRef<HTMLInputElement>(null);

        return (
            <input
                ref={node => {
                    internalRef.current = node;

                    if (typeof forwardedRef === "function") {
                        forwardedRef(node);
                    } else if (forwardedRef) {
                        forwardedRef.current = node;
                    }
                }}
                {...props}
            />
        );
    }
);
```

This is commonly called ref composition.

The component must preserve both ref contracts.

If the component replaces the consumer's ref with its own ref, the forwarding contract is broken.

In production code, a reusable `mergeRefs` utility can centralize this behavior.

## Ref Forwarding Through Multiple Components

A ref can pass through several wrapper components.

```tsx
const Field = forwardRef<HTMLInputElement, Props>(
    function Field(props, ref) {
        return <Input {...props} ref={ref}/>;
    }
);

const Input = forwardRef<HTMLInputElement, Props>(
    function Input(props, ref) {
        return <input {...props} ref={ref}/>;
    }
);
```

The consumer can use:

```tsx
const ref = useRef<HTMLInputElement>(null);

<Field ref={ref}/>;
```

Each intermediate component must intentionally preserve the ref.

A single component that fails to forward it terminates the chain.

## Ref Forwarding and Conditional Targets

A component may render different targets depending on props.

```tsx
const Field = forwardRef<
    HTMLInputElement | HTMLTextAreaElement,
    Props
>(function Field({multiline, ...props}, ref) {
    if (multiline) {
        return <textarea ref={ref} {...props} />;
    }

    return <input ref={ref} {...props} />;
});
```

This makes the ref target contract less precise.

The consumer now has to account for multiple possible target types.

If possible, use separate components or a stable target type when the imperative API should remain predictable.

## Ref Forwarding and Polymorphic Components

Polymorphic components render different element types based on a prop such as `as`.

```tsx
<Button as="a" href="/settings"/>
```

Ref forwarding becomes more complex because the ref type depends on the rendered element.

A robust polymorphic component needs its TypeScript API to correlate:

* the `as` value
* permitted props
* ref target

Otherwise the type system can claim that a ref is valid for an element that the component does not actually render.

The important principle is that the ref type must describe the actual imperative target.

## Ref Forwarding and Props

The forwarded ref is not part of the ordinary props object in the traditional `forwardRef` API.

```tsx
const Input = forwardRef<HTMLInputElement, Props>(
    function Input(props, ref) {
        console.log(props);
        console.log(ref);

        return <input {...props} ref={ref}/>;
    }
);
```

The ref is supplied through the dedicated ref mechanism.

This distinction prevents ordinary prop spreading from accidentally treating `ref` as normal application data.

## Ref Forwarding and Prop Spreading

The ref should be attached deliberately.

```tsx
<input {...props} ref={ref}/>
```

is clearer than relying on a generic object to determine the target.

Be particularly careful when composing props and internal configuration:

```tsx
const inputProps = {
    ...props,
    ref,
};
```

The ref should still be understood as an imperative API boundary rather than an ordinary serializable prop.

## Ref Forwarding and Higher-Order Components

Higher-order components introduce another wrapper boundary.

```tsx
function withLogging(Component) {
    return function LoggedComponent(props) {
        return <Component {...props} />;
    };
}
```

A ref attached to the returned component does not automatically reach the wrapped component.

A ref-aware HOC must explicitly handle ref forwarding:

```tsx
function withLogging(Component) {
    return forwardRef(function LoggedComponent(props, ref) {
        return <Component {...props} ref={ref}/>;
    });
}
```

This makes ref behavior part of HOC composition.

A library HOC that transparently wraps components should document whether refs are preserved.

## Ref Forwarding and HOC Composition

When multiple HOCs are composed, every wrapper that participates in the ref path must preserve the ref.

If one wrapper terminates the ref, downstream forwarding cannot recover it.

Ref transparency is therefore a composition property.

A component can be transparent with respect to rendering props while not being transparent with respect to refs.

These are separate contracts.

## Ref Forwarding and Memoization

A memoized component can still participate in ref forwarding.

```tsx
const Input = memo(
    forwardRef<HTMLInputElement, Props>(
        function Input(props, ref) {
            return <input {...props} ref={ref}/>;
        }
    )
);
```

Memoization affects rendering behavior.

Ref forwarding affects imperative access.

They solve different problems and should not be treated as interchangeable optimization mechanisms.

## Ref Forwarding and Component Identity

A ref points to the currently committed target associated with the component tree.

If the target is replaced because component identity changes, the ref can change accordingly.

```tsx
const ref = useRef<HTMLInputElement>(null);
```

If:

```tsx
<input key="a" ref={ref}/>
```

becomes:

```tsx
<input key="b" ref={ref}/>
```

the underlying DOM node is replaced.

The ref lifecycle therefore follows the target's identity and mounting lifecycle.

Ref forwarding does not preserve an imperative target across remounts.

## Ref Forwarding and Conditional Rendering

A forwarded ref can become `null` when its target is conditionally removed.

```tsx
const Input = forwardRef<HTMLInputElement, Props>(
    function Input({visible}, ref) {
        return visible ? <input ref={ref}/> : null;
    }
);
```

When the input is not rendered:

```tsx
ref.current === null
```

Consumers should therefore not assume that forwarding guarantees permanent access to an element.

## Ref Forwarding and Effects

A consumer can use the forwarded ref in an Effect:

```tsx
function Form() {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return <TextInput ref={inputRef}/>;
}
```

The Effect runs after the target has been committed, making the ref available for imperative synchronization.

The ref itself does not cause a component render when `.current` changes.

## Ref Forwarding and Event Handlers

Refs are useful when an imperative operation must happen in response to an event.

```tsx
function Toolbar() {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSearch() {
        inputRef.current?.focus();
    }

    return (
        <>
            <TextInput ref={inputRef}/>
            <button onClick={handleSearch}>
                Search
            </button>
        </>
    );
}
```

The ref provides access to the imperative target while event handlers determine when the operation occurs.

A ref should not replace ordinary declarative props when the behavior can be represented declaratively.

## Ref Forwarding and Imperative Handles

Forwarding exposes a target.

`useImperativeHandle` can instead expose a constrained interface.

```tsx
type InputHandle = {
    focus(): void;
    clear(): void;
};

const Input = forwardRef<InputHandle, Props>(
    function Input(props, ref) {
        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => ({
            focus() {
                inputRef.current?.focus();
            },
            clear() {
                if (inputRef.current) {
                    inputRef.current.value = "";
                }
            },
        }));

        return <input ref={inputRef} {...props} />;
    }
);
```

The consumer no longer receives the raw DOM node.

```tsx
const ref = useRef<InputHandle>(null);

<Input ref={ref}/>;

ref.current?.focus();
```

This can provide a more stable abstraction when exposing the entire DOM element would unnecessarily couple consumers to
implementation details.

## Ref Forwarding and DOM Encapsulation

Exposing a raw DOM node creates an implementation dependency.

If consumers receive:

```tsx
HTMLInputElement
```

they can access all of its DOM API.

If the component instead exposes:

```tsx
type InputHandle = {
    focus(): void;
};
```

the component controls the imperative surface.

This is particularly useful for reusable component libraries where implementation flexibility matters.

Ref forwarding and imperative handles therefore exist on a spectrum:

* forward the underlying target when direct access is part of the component contract
* expose a constrained imperative handle when only specific operations should be supported

## Ref Forwarding and Accessibility

Refs frequently support accessibility behavior such as moving focus to the correct target.

```tsx
dialogInputRef.current?.focus();
```

A wrapper component that prevents access to the actual focusable target can make focus management unnecessarily
difficult.

Reusable components that participate in keyboard navigation, dialogs, menus, comboboxes, and form controls should
deliberately define how imperative focus access is exposed.

Ref forwarding should support the component's accessibility contract rather than exist merely for convenience.

## Ref Forwarding and Third-Party Libraries

Some libraries require a DOM node for integration.

```tsx
useEffect(() => {
    if (!containerRef.current) {
        return;
    }

    const instance = createLibraryInstance(
        containerRef.current
    );

    return () => {
        instance.destroy();
    };
}, []);
```

A wrapper component can preserve this integration point:

```tsx
const ChartContainer = forwardRef<HTMLDivElement, Props>(
    function ChartContainer(props, ref) {
        return <div ref={ref} {...props} />;
    }
);
```

This allows consumers or integration layers to attach the external library without requiring the wrapper to expose every
possible library-specific operation.

## Ref Forwarding and Measurement

A forwarded DOM ref can be used for measurement:

```tsx
const ref = useRef<HTMLDivElement>(null);

useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
        return;
    }

    const rect = element.getBoundingClientRect();

    console.log(rect.width, rect.height);
}, []);
```

This is a consumer-side imperative concern.

The component's responsibility is to expose the correct target.

The measurement mechanism itself belongs to the consuming behavior.

## Ref Forwarding and Portals

A component can render its visible UI through a portal while exposing a ref to a specific target.

The ref points to the actual target receiving the ref, not automatically to the logical component abstraction.

Portal rendering therefore does not make refs represent the React component itself.

When designing a portal-based component, explicitly define which DOM node, if any, its ref represents.

## Ref Forwarding and Server Rendering

Refs are inherently client-side imperative mechanisms.

Server rendering can produce the component's markup, but there is no mounted DOM target for a ref during server
rendering.

Ref-dependent behavior therefore occurs after the relevant client-side commit.

Components intended to work in server-rendered environments should not make their server rendering depend on the
presence of a populated ref.

## Ref Forwarding and Server Components

Refs cannot be treated as serializable data passed across a server/client boundary.

A ref represents a client-side imperative connection to a mounted target.

A component that needs to expose a DOM ref therefore belongs on the client side of an architecture that separates
server-executed and client-executed components.

The boundary is architectural: server-rendered data can describe what should be rendered, while refs provide imperative
access to an already mounted client-side target.

## Ref Forwarding and Custom Hooks

A custom Hook can create and consume refs, but Hooks do not automatically forward refs through component boundaries.

```tsx
function useAutoFocus() {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        ref.current?.focus();
    }, []);

    return ref;
}
```

A component using the Hook may still need to forward an externally supplied ref if consumers need access to the same
target.

Reusable ref behavior and ref forwarding therefore solve different problems.

## Common Misuse

### Assuming Refs Automatically Pass Through Components

```tsx
function Input() {
    return <input/>;
}
```

The component does not automatically expose the internal input through `ref`.

Forwarding must be explicit.

### Forwarding to the Wrong Element

```tsx
const Input = forwardRef<HTMLInputElement, Props>(
    function Input(props, ref) {
        return (
            <label ref={ref}>
                <input {...props} />
            </label>
        );
    }
);
```

The declared API says the ref points to an `HTMLInputElement`, but the implementation forwards it to a label.

The target and type contract must agree.

### Exposing Too Much Imperative API

If consumers only need:

```tsx
focus()
```

exposing an entire DOM node can unnecessarily couple them to implementation details.

Use an imperative handle when a narrower contract is more appropriate.

### Using Refs for Declarative State

Do not use refs as a replacement for state when changes need to affect rendering.

```tsx
const countRef = useRef(0);
```

Changing:

```tsx
countRef.current++;
```

does not cause a render.

If the value determines what the UI should display, it generally belongs in state.

### Reading Refs During Render

Avoid relying on a populated DOM ref during rendering.

```tsx
function Component() {
    const ref = useRef(null);

    const width = ref.current?.offsetWidth;

    return <div ref={ref}>{width}</div>;
}
```

The DOM node has not been established for the current render in the way this code assumes.

Imperative DOM reads belong in appropriate post-commit mechanisms.

### Replacing a Consumer Ref with an Internal Ref

```tsx
const Input = forwardRef<HTMLInputElement, Props>(
    function Input(props, ref) {
        const internalRef = useRef<HTMLInputElement>(null);

        return <input ref={internalRef} {...props} />;
    }
);
```

The consumer's ref is ignored.

If forwarding is part of the API, the consumer ref must be preserved.

### Assuming the Ref Is Always an Object Ref

A forwarded ref can be a callback ref.

Code should handle both forms when manually composing refs.

### Treating Ref Forwarding as Performance Optimization

Ref forwarding does not make rendering faster.

It establishes an imperative access path.

### Using Ref Forwarding Everywhere

Not every component needs to expose an imperative target.

Exposing a ref creates API surface and can increase coupling between consumers and implementation details.

Forward a ref when imperative access is an intentional part of the component contract.

## Advantages

Ref forwarding preserves imperative access across component abstraction boundaries.

It allows reusable wrapper components to remain compatible with focus, measurement, scrolling, and third-party DOM
integrations.

It provides a standard `ref` API for reusable components.

It can preserve ref transparency through wrapper and higher-order component layers.

Combined with imperative handles, it allows a component to expose a deliberately constrained imperative API.

## Disadvantages

Ref forwarding exposes an imperative API that can couple consumers to implementation details.

Changing the forwarded target can become a breaking behavioral change.

Multiple wrapper layers can make ref composition more complex.

Conditional or polymorphic targets can make ref typing and semantics harder to maintain.

Refs encourage imperative access and can be misused as a replacement for declarative state or props.

Ref forwarding does not automatically solve ref composition, lifecycle, cancellation, or target identity concerns.

## When to Use

Use ref forwarding when a reusable component should intentionally expose access to:

* a focusable DOM element
* a scroll container
* a measurable DOM node
* a third-party integration target
* a browser API requiring an element reference
* a specific imperative component interface

It is particularly useful for low-level UI components that are intended to behave like transparent wrappers around
native elements.

## When Not to Use

Do not forward a ref merely because a component accepts many props.

Do not expose a DOM node when the component's contract can be represented more cleanly through declarative props.

Do not use a ref to communicate information that should affect rendering.

Do not forward a ref when the underlying target is an accidental implementation detail and consumers have no legitimate
imperative need for it.

Do not use ref forwarding as a substitute for component composition, state management, or event callbacks.

## Relationships to Other Patterns

### Imperative Handle

Ref forwarding establishes the ref boundary.

An imperative handle defines a custom imperative interface exposed through that boundary.

Ref forwarding can expose a DOM node directly; an imperative handle can expose only selected operations.

### Component Composition

Composition determines how components are combined declaratively.

Ref forwarding preserves an imperative access path through that composition boundary.

### Higher-Order Components

Higher-order components add wrapper boundaries.

If the resulting component is expected to preserve ref access, the HOC must explicitly participate in ref forwarding.

### Memoized Components

Memoization concerns rendering optimization.

Ref forwarding concerns imperative access.

They can be combined, but neither replaces the other.

### Component Identity

The lifetime of a ref target follows the identity and mounting lifecycle of the underlying target.

Changing identity can detach the previous ref and attach the new target.

### Effect Cleanup

Consumers that use a forwarded ref to establish an external resource may need Effect cleanup when the target changes or
disappears.

The ref exposes the target; cleanup governs resources associated with that target.

### Accessibility

Forwarded refs commonly support focus management and keyboard interaction.

The component should expose the target that actually participates in the relevant accessibility behavior.

### Custom Hooks

Custom Hooks can encapsulate reusable imperative behavior around refs.

They do not themselves cause refs to cross component boundaries.

## Design Rules

1. Forward refs only when imperative access is part of the component's public contract.

2. Make the forwarded target explicit and predictable.

3. Keep the ref type synchronized with the actual target.

4. Preserve consumer refs when the component also needs an internal ref.

5. Support callback refs when manually composing refs.

6. Use an imperative handle when exposing the entire underlying DOM node would create unnecessary coupling.

7. Do not use refs as a replacement for state or declarative props.

8. Do not rely on populated DOM refs during render.

9. Account for `null` when the target is absent or unmounted.

10. Treat the forwarded target as part of the component API.

11. Define ref behavior explicitly for polymorphic and conditional components.

12. Ensure every wrapper in a ref-forwarding chain preserves the ref when transparency is required.

13. Keep ref forwarding separate from rendering optimization.

14. Use refs for imperative integration rather than for ordinary data flow.

15. Ensure focus and other imperative APIs operate on the actual semantic target.

16. Keep server/client boundaries in mind because DOM refs are client-side imperative mechanisms.

## Core Principle

Ref forwarding is an explicit imperative contract across a component boundary.

The component decides what target the consumer's ref represents:

```tsx
const Input = forwardRef<HTMLInputElement, Props>(
    function Input(props, ref) {
        return <input {...props} ref={ref}/>;
    }
);
```

The consumer can then access that target without knowing the component's internal wrapper structure:

```tsx
const ref = useRef<HTMLInputElement>(null);

<Input ref={ref}/>;

ref.current?.focus();
```

The important design decision is not merely whether a component can forward a ref, but whether imperative access to the
selected target is actually part of the component's public contract.

When direct DOM access is appropriate, forward the target. When consumers should receive only a controlled set of
imperative operations, forward the ref into an imperative handle instead. In both cases, the ref boundary should be
deliberate, typed, stable in meaning, and limited to imperative responsibilities.
