# Imperative Handle

The Imperative Handle pattern exposes a deliberately constrained imperative API from a React component through a ref.
Instead of exposing the component's internal DOM node or implementation details, the component defines the specific
commands a parent is allowed to invoke.

The pattern is implemented primarily with `useImperativeHandle`. The parent retains a ref, while the child determines
what value is assigned to that ref.

```tsx
import {forwardRef, useImperativeHandle, useRef} from "react";

export interface InputHandle {
    focus(): void;

    clear(): void;
}

const Input = forwardRef<InputHandle, { placeholder?: string }>(
    ({placeholder}, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(
            ref,
            () => ({
                focus() {
                    inputRef.current?.focus();
                },

                clear() {
                    if (inputRef.current) {
                        inputRef.current.value = "";
                    }
                },
            }),
            []
        );

        return <input ref={inputRef} placeholder={placeholder}/>;
    }
);
```

The parent interacts with the public handle rather than the component's internal DOM structure.

```tsx
function Form() {
    const inputRef = useRef<InputHandle>(null);

    return (
        <>
            <Input ref={inputRef}/>
            <button onClick={() => inputRef.current?.focus()}>
                Focus
            </button>
            <button onClick={() => inputRef.current?.clear()}>
                Clear
            </button>
        </>
    );
}
```

## Intent

The intent is to provide a small imperative interface for operations that are naturally expressed as commands rather
than as persistent declarative state.

The component owns its implementation and exposes only the operations that consumers legitimately need.

The essential design distinction is:

```text
ref to DOM node
```

versus:

```text
ref to component-defined API
```

With a direct DOM ref, the consumer knows which DOM element exists and how it must be manipulated. With an imperative
handle, the component defines the abstraction boundary and can change its internal implementation without changing the
public API.

## Basic Pattern

A component receives a ref from its parent and uses `useImperativeHandle` to define the value visible through that ref.

```tsx
interface DialogHandle {
    open(): void;

    close(): void;

    focus(): void;
}

const Dialog = forwardRef<DialogHandle>((props, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(
        ref,
        () => ({
            open() {
                dialogRef.current?.showModal();
            },

            close() {
                dialogRef.current?.close();
            },

            focus() {
                dialogRef.current?.focus();
            },
        }),
        []
    );

    return <dialog ref={dialogRef}>Content</dialog>;
});
```

The parent sees the `DialogHandle` contract rather than the internal `<dialog>` element.

```tsx
const dialogRef = useRef<DialogHandle>(null);

dialogRef.current?.open();
dialogRef.current?.close();
```

The handle is therefore an explicit imperative component API.

## Public API Design

An imperative handle should expose operations rather than internal representation.

Prefer:

```tsx
interface EditorHandle {
    focus(): void;

    selectAll(): void;

    clear(): void;
}
```

over:

```tsx
interface EditorHandle {
    input: HTMLInputElement;
    container: HTMLDivElement;
    internalState: unknown;
}
```

The first API expresses capabilities. The second exposes implementation details.

A capability-based handle provides stronger encapsulation because consumers do not need to know how the operation is
implemented.

The component can later replace an `<input>` with a custom editor, multiple DOM elements, or another implementation
while retaining the same public methods.

## Imperative Commands

Methods exposed through a handle should generally represent meaningful commands.

Typical examples include:

```tsx
interface PlayerHandle {
    play(): void;

    pause(): void;

    seek(time: number): void;
}

interface CarouselHandle {
    next(): void;

    previous(): void;

    goTo(index: number): void;
}

interface FormHandle {
    focusFirstInvalidField(): void;

    reset(): void;

    validate(): boolean;
}
```

The method names should describe the component's behavior rather than its internal mechanics.

A handle such as:

```tsx
interface EditorHandle {
    setInputValue(value: string): void;
}
```

may be appropriate when the operation is genuinely part of the component's public contract. However, if the component's
state should normally be controlled by its parent, exposing imperative setters can create a second state-management
mechanism and weaken the declarative API.

## Encapsulation

The primary architectural benefit is encapsulation.

Without an imperative handle:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

inputRef.current?.focus();
```

the parent knows that the component contains an input and that the input is the element that should receive focus.

With an imperative handle:

```tsx
const inputRef = useRef<InputHandle>(null);

inputRef.current?.focus();
```

the parent only knows that the component supports focusing.

The component owns the mapping between the public command and its implementation.

This makes the ref a boundary between the consumer and the component's internal representation.

## Ref Ownership

The parent owns the ref object, but the child owns the value exposed through that ref when `useImperativeHandle` is
used.

```tsx
const ref = useRef<InputHandle>(null);

<Input ref={ref}/>
```

The parent decides which ref object is passed.

The child decides what `ref.current` represents.

Conceptually, the child is defining the public contract represented by that ref.

The child should therefore not expose arbitrary internal objects merely because they are available.

## `useImperativeHandle`

The API has the form:

```tsx
useImperativeHandle(ref, createHandle, dependencies ?)
```

The `createHandle` function returns the value assigned to the ref.

```tsx
useImperativeHandle(
    ref,
    () => ({
        focus() {
            inputRef.current?.focus();
        },
    }),
    []
);
```

The optional dependency list controls when React recreates the handle.

If the handle depends on reactive values, those values belong in the dependency list.

```tsx
useImperativeHandle(
    ref,
    () => ({
        getValue() {
            return value;
        },
    }),
    [value]
);
```

The dependency semantics therefore matter for both handle identity and closure correctness.

## Handle Identity

The object returned by `useImperativeHandle` has an identity.

For example:

```tsx
useImperativeHandle(
    ref,
    () => ({
        focus() {
            inputRef.current?.focus();
        },
    }),
    []
);
```

creates a handle whose identity can remain stable across renders when its dependencies remain unchanged.

If dependencies change:

```tsx
useImperativeHandle(
    ref,
    () => ({
        submit() {
            submitForm(configuration);
        },
    }),
    [configuration]
);
```

the handle may be recreated.

This matters when consumers or other code retain references to the handle itself.

The handle should therefore have a deliberate identity policy rather than accidentally being recreated because the
implementation constructs a new object on every render.

## Stale Closures

Imperative methods are functions and therefore can close over component state and props.

```tsx
useImperativeHandle(
    ref,
    () => ({
        getValue() {
            return value;
        },
    }),
    [value]
);
```

The dependency list ensures that the handle reflects the current `value`.

Omitting a reactive dependency can cause the method to retain an outdated value.

```tsx
useImperativeHandle(
    ref,
    () => ({
        getValue() {
            return value;
        },
    }),
    []
);
```

If `value` changes, this implementation can expose stale state through the method.

An alternative is to read current mutable data from a ref when appropriate.

```tsx
const valueRef = useRef(value);

valueRef.current = value;

useImperativeHandle(
    ref,
    () => ({
        getValue() {
            return valueRef.current;
        },
    }),
    []
);
```

This technique should be used intentionally. It trades reactive closure semantics for explicit mutable storage.

## Stable Handles

A stable handle is often useful when the API does not depend on changing reactive values.

```tsx
useImperativeHandle(
    ref,
    () => ({
        focus() {
            inputRef.current?.focus();
        },

        clear() {
            inputRef.current?.value = "";
        },
    }),
    []
);
```

The methods access a stable ref rather than capturing changing state.

This allows the public handle to remain stable while the methods operate on the current implementation.

However, handle stability is not inherently the objective. The objective is a correct and well-defined imperative API.
Stability matters when consumers depend on object identity.

## DOM Encapsulation

Imperative handles are particularly useful for wrapping DOM behavior.

```tsx
interface VideoHandle {
    play(): Promise<void>;

    pause(): void;

    restart(): void;
}

const Video = forwardRef<VideoHandle>((props, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useImperativeHandle(
        ref,
        () => ({
            play() {
                return videoRef.current?.play() ?? Promise.resolve();
            },

            pause() {
                videoRef.current?.pause();
            },

            restart() {
                if (!videoRef.current) {
                    return;
                }

                videoRef.current.currentTime = 0;
                void videoRef.current.play();
            },
        }),
        []
    );

    return <video ref={videoRef}/>;
});
```

The parent does not need to know that the implementation uses an `HTMLVideoElement`.

This is useful for components wrapping browser APIs whose operations are inherently imperative.

## Focus Management

Focus is one of the clearest use cases.

```tsx
interface SearchBoxHandle {
    focus(): void;
}

const SearchBox = forwardRef<SearchBoxHandle>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
        ref,
        () => ({
            focus() {
                inputRef.current?.focus();
            },
        }),
        []
    );

    return <input ref={inputRef}/>;
});
```

Focus is an interaction command rather than persistent application state.

A parent can therefore request the operation without owning the underlying DOM element.

## Scrolling

Scrolling is another natural imperative operation.

```tsx
interface PanelHandle {
    scrollToTop(): void;

    scrollToBottom(): void;
}

const Panel = forwardRef<PanelHandle>((props, ref) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
        ref,
        () => ({
            scrollToTop() {
                panelRef.current?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            },

            scrollToBottom() {
                const element = panelRef.current;

                if (!element) {
                    return;
                }

                element.scrollTo({
                    top: element.scrollHeight,
                    behavior: "smooth",
                });
            },
        }),
        []
    );

    return <div ref={panelRef}>{props.children}</div>;
});
```

The consumer asks for a semantic operation rather than manipulating scroll coordinates directly.

## Animation and Media Control

Imperative handles can expose operations whose natural API is command-oriented.

```tsx
interface AnimationHandle {
    start(): void;

    pause(): void;

    reset(): void;
}
```

```tsx
interface AudioHandle {
    play(): Promise<void>;

    pause(): void;

    stop(): void;
}
```

These operations correspond directly to external imperative APIs.

The component remains responsible for connecting those commands to the actual implementation.

## Validation and Form Integration

A form-like component can expose a small imperative API when an external coordinator needs to trigger a component-owned
operation.

```tsx
interface FormHandle {
    validate(): boolean;

    focusFirstInvalidField(): void;
}

const FormSection = forwardRef<FormHandle>((props, ref) => {
    useImperativeHandle(
        ref,
        () => ({
            validate() {
                return true;
            },

            focusFirstInvalidField() {
                // Focus the appropriate field.
            },
        }),
        []
    );

    return <section>{props.children}</section>;
});
```

This can be appropriate when validation or focus management belongs to the component but a parent workflow needs to
trigger it.

It should not automatically replace declarative form state. If the parent needs to own the form's values and validation
state, a controlled API may be more appropriate.

## Imperative API vs Declarative API

Declarative APIs describe desired state.

```tsx
<Dialog open={isOpen}/>
```

Imperative APIs issue commands.

```tsx
dialogRef.current?.open();
```

The distinction is architectural.

A declarative API expresses what the UI should represent. An imperative handle expresses an operation that should occur.

Use a declarative API when the behavior can naturally be modeled as state or props.

Use an imperative handle when the operation is transient, interaction-oriented, or inherently imperative.

For example, visibility can often be declarative:

```tsx
<Modal open={open}/>
```

while focus is naturally imperative:

```tsx
modalRef.current?.focusFirstField();
```

The two approaches can coexist.

## Imperative Handle vs Direct DOM Ref

A direct DOM ref exposes an element.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

<Input ref={inputRef}/>
```

The consumer can then perform arbitrary DOM operations:

```tsx
inputRef.current?.focus();
inputRef.current?.select();
inputRef.current?.scrollIntoView();
```

An imperative handle exposes a defined contract:

```tsx
interface InputHandle {
    focus(): void;

    clear(): void;
}
```

The consumer can only use the capabilities intentionally exposed by the component.

This provides stronger encapsulation and makes the component's public imperative API explicit.

## Imperative Handle vs Callback Props

A callback prop can also express an operation.

```tsx
<Input onRequestFocus={requestFocus}/>
```

However, callback props generally represent communication as part of the component's declarative/event interface.

An imperative handle allows the consumer to directly invoke a capability on the child:

```tsx
inputRef.current?.focus();
```

Use callback props when the operation is naturally part of event flow or declarative composition.

Use an imperative handle when a consumer genuinely needs to command a child component.

## Imperative Handle vs State

State represents information that participates in rendering and React's reactive model.

A handle represents commands or capabilities.

For example:

```tsx
<Accordion open={open}/>
```

is state-oriented.

```tsx
accordionRef.current?.expand();
```

is command-oriented.

A common design error is using an imperative handle to manipulate state that should instead be represented
declaratively.

If a parent needs to know whether an accordion is open, that state may belong in the component's normal state/prop
contract rather than being hidden behind:

```tsx
accordionRef.current?.isOpen();
```

Imperative handles should not become a substitute for state ownership.

## Imperative Handle vs Controlled Components

A controlled component receives authoritative state from its parent.

```tsx
<Input value={value} onChange={setValue}/>
```

An imperative handle exposes commands.

```tsx
inputRef.current?.clear();
```

These are different mechanisms and can coexist.

```tsx
<Editor
    value={value}
    onChange={setValue}
    ref={editorRef}
/>
```

The parent may declaratively own the editor's value while using the imperative API for operations such as:

```tsx
editorRef.current?.focus();
editorRef.current?.selectAll();
```

This combination is often preferable to exposing imperative setters for ordinary application state.

## Imperative Handle vs Uncontrolled Components

An uncontrolled component owns its current value internally.

An imperative handle can provide commands over that internal state.

```tsx
interface InputHandle {
    clear(): void;

    getValue(): string;
}
```

This can be appropriate for encapsulated widgets.

However, exposing a large imperative API over uncontrolled state can effectively recreate a hidden state-management
protocol. The handle should remain small and purposeful.

## Avoiding State Synchronization Through Handles

A problematic API looks like:

```tsx
interface ComponentHandle {
    setValue(value: string): void;

    setLoading(value: boolean): void;

    setError(value: string | null): void;

    setDisabled(value: boolean): void;
}
```

This turns the parent into an imperative controller of the child's internal state.

A declarative interface is generally clearer:

```tsx
<Component
    value={value}
    loading={loading}
    error={error}
    disabled={disabled}
/>
```

The imperative handle should generally expose actions, not a parallel imperative version of every prop.

## Encapsulation of Implementation Changes

A useful handle allows internal implementation changes without changing the consumer contract.

For example:

```tsx
interface TooltipHandle {
    show(): void;

    hide(): void;
}
```

The implementation could use:

```tsx
const elementRef = useRef<HTMLDivElement>(null);
```

or an entirely different internal mechanism.

The consumer does not depend on that implementation detail.

This is one of the strongest reasons to prefer a component-defined handle over exposing internal DOM nodes.

## Multiple Refs

A component can internally use several refs while exposing one public handle.

```tsx
interface EditorHandle {
    focus(): void;

    scrollToLine(line: number): void;

    selectAll(): void;
}

const Editor = forwardRef<EditorHandle>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
        ref,
        () => ({
            focus() {
                inputRef.current?.focus();
            },

            scrollToLine(line) {
                const container = containerRef.current;

                if (!container) {
                    return;
                }

                // Locate and scroll to the requested line.
            },

            selectAll() {
                inputRef.current?.select();
            },
        }),
        []
    );

    return (
        <div ref={containerRef}>
            <input ref={inputRef}/>
        </div>
    );
});
```

The handle therefore acts as a facade over several internal elements.

The consumer receives a semantic interface rather than the underlying object graph.

## Error Handling

Imperative methods should define their behavior when the underlying resource is unavailable.

For example:

```tsx
focus()
{
    inputRef.current?.focus();
}
```

is naturally tolerant of the element not currently being mounted.

Other methods may need explicit failure semantics.

```tsx
async
play()
:
Promise < void > {
    const video = videoRef.current;

    if(!
video
)
{
    throw new Error("Video is not mounted.");
}

await video.play();
}
```

The handle contract should make meaningful failure behavior predictable.

Avoid silently swallowing failures when the operation's success matters to the caller.

## Lifecycle and Cleanup

An imperative handle does not itself own external resources merely because it exposes methods for them.

For example, if a component exposes:

```tsx
interface PlayerHandle {
    play(): void;

    stop(): void;
}
```

the component may still need Effects or another lifecycle mechanism to manage event listeners, timers, subscriptions, or
external resources.

The handle is the command interface. Resource ownership and cleanup remain lifecycle concerns.

The imperative handle should therefore not become a hidden resource-management mechanism.

## Handle Methods and Effects

A method exposed by an imperative handle can interact with Effects indirectly, but the two mechanisms solve different
problems.

Effects synchronize the component with external systems.

Imperative handles expose commands to external consumers.

For example, a media component may use an Effect to synchronize event listeners while exposing:

```tsx
interface PlayerHandle {
    play(): void;

    pause(): void;
}
```

The handle does not replace the Effect that manages the external subscription.

## Handle Methods and Referential Stability

The identity of the handle and the identity of the functions contained within it are related to referential stability.

If the handle is recreated, its methods are recreated with it.

A stable implementation can be achieved by using stable refs and an appropriate dependency list:

```tsx
useImperativeHandle(
    ref,
    () => ({
        focus() {
            inputRef.current?.focus();
        },
    }),
    []
);
```

However, forcing stability through excessive memoization is unnecessary if consumers do not depend on handle identity.

The primary concern is correctness of the public API.

## TypeScript API Contracts

Imperative handles benefit substantially from explicit TypeScript interfaces.

```tsx
export interface DialogHandle {
    open(): void;

    close(): void;

    isOpen(): boolean;
}
```

The interface becomes part of the component's public contract.

A parent can then declare:

```tsx
const dialogRef = useRef<DialogHandle>(null);
```

The compiler prevents access to operations that are not part of the contract.

This is particularly valuable because the whole purpose of an imperative handle is to define a constrained capability
surface.

## `forwardRef`

In React versions where ref forwarding is required for function components, `forwardRef` is used to receive the parent's
ref.

```tsx
const Input = forwardRef<InputHandle, Props>((props, ref) => {
    useImperativeHandle(ref, () => ({
        focus() {
            // ...
        },
    }));

    return <input/>;
});
```

The important architectural concept is not `forwardRef` itself. It is that the component accepts a ref and deliberately
defines what the ref exposes.

React versions that provide ref access to function components without the historical `forwardRef` wrapper can change the
mechanics, but the imperative-handle pattern remains the same: the component defines the public imperative value
associated with the ref.

## Ref Nullability

A parent should normally treat the ref as nullable.

```tsx
const inputRef = useRef<InputHandle>(null);

inputRef.current?.focus();
```

The handle may be unavailable before mounting or after unmounting.

Code should therefore not assume that `ref.current` always contains a live handle.

If an imperative operation must only occur while the component is mounted, the optional nature of the ref naturally
expresses that lifecycle boundary.

## Parent-Child Coupling

Imperative handles create a deliberate coupling between parent and child.

The parent must know the child exposes a particular API:

```tsx
inputRef.current?.focus();
```

That coupling is not automatically bad. It is the purpose of the abstraction.

The problem occurs when the handle exposes too much internal behavior or becomes a general-purpose control channel.

A good handle establishes a narrow coupling around meaningful capabilities.

## Avoiding Internal Object Exposure

Avoid exposing mutable implementation objects:

```tsx
useImperativeHandle(ref, () => ({
    inputRef,
    internalState,
    cache,
}));
```

This makes the consumer dependent on internal representation and allows external code to mutate component internals.

Prefer methods:

```tsx
useImperativeHandle(ref, () => ({
    focus() {
        inputRef.current?.focus();
    },

    clear() {
        inputRef.current?.value = "";
    },
}));
```

Methods establish a controlled boundary.

## Testing

Tests should verify the public imperative contract rather than internal implementation details.

For example, a test can obtain the handle and invoke:

```tsx
ref.current?.focus();
```

and verify the observable result.

The test should not need to know whether the component implemented focus through one DOM element, several elements, or
another mechanism.

This keeps tests aligned with the component's public API.

The handle itself can also be tested for API shape when the contract is important.

## Common Misuse

A common misuse is exposing the entire DOM node when only a small capability is needed.

```tsx
useImperativeHandle(ref, () => inputRef.current);
```

This weakens encapsulation.

Another misuse is exposing every internal operation:

```tsx
interface Handle {
    setValue(): void;

    setError(): void;

    setLoading(): void;

    setDisabled(): void;

    updateInternalState(): void;
}
```

This creates an imperative control surface that duplicates the component's declarative state model.

Another misuse is using an imperative handle where ordinary props and events are sufficient.

```tsx
ref.current?.setOpen(true);
```

is generally less declarative than:

```tsx
<Dialog open={true}/>
```

when the parent should own the open state.

A final misuse is allowing methods to depend on stale closures by omitting required dependencies.

## Advantages

Imperative handles provide several useful properties.

* They expose a narrow imperative API.
* They preserve component encapsulation.
* They hide DOM and implementation details.
* They support interaction-oriented commands such as focus, scroll, play, pause, reset, and selection.
* They provide a natural boundary around inherently imperative browser APIs.
* They can combine with controlled components without replacing their declarative state model.
* They provide explicit TypeScript contracts for imperative capabilities.
* They allow internal implementation changes without necessarily affecting consumers.

## Disadvantages

Imperative handles also introduce costs.

* They create parent-child coupling.
* They bypass some of React's declarative data-flow model.
* Large handles can become hidden state-management APIs.
* Incorrect dependency management can produce stale closures.
* Excessive handle recreation can introduce unnecessary identity changes.
* Imperative commands can make application behavior harder to trace than declarative state transitions.
* Testing may require explicit command invocation and lifecycle awareness.
* An imperative API can become difficult to evolve if it exposes too many implementation-specific operations.

## When to Use

Use an imperative handle when a component needs to expose a small set of commands that are naturally imperative.

Typical cases include:

* Focus management.
* Selection.
* Scrolling.
* Media playback.
* Animation control.
* Opening or closing an intrinsically imperative browser primitive.
* Reset operations.
* Exposing a specialized widget API.
* Triggering component-owned validation or interaction behavior.
* Encapsulating multiple DOM elements behind one semantic API.
* Wrapping third-party imperative libraries.

## When Not to Use

Do not use an imperative handle merely because a parent needs to control ordinary component state.

Prefer props and callbacks when the behavior is naturally declarative.

Avoid imperative handles when the only purpose is to expose a DOM node that could safely be passed directly as a ref.

Avoid large handles that expose setters for every piece of component state.

Avoid using a handle as an escape hatch for poor state ownership. If multiple components genuinely require the same
authoritative state, use an appropriate state-ownership strategy instead.

## Relationship to Ref Pattern

The Ref Pattern is the broader mechanism for retaining references to DOM nodes, component-defined values, and mutable
values across renders.

Imperative Handle is a specialized application of refs in which a component deliberately defines the public value
exposed through the ref.

Therefore:

```text
Ref Pattern
```

concerns the reference mechanism, while:

```text
Imperative Handle
```

concerns the API exposed through that reference.

The general ref mechanism belongs in the Ref Pattern documentation. This file focuses on designing the imperative
interface itself.

## Relationship to Controlled Components

Controlled Components determine who owns authoritative component state.

Imperative Handles determine which commands a component exposes through a ref.

They solve different problems.

A component can be controlled while still exposing imperative operations:

```tsx
<Editor
    value={value}
    onChange={setValue}
    ref={editorRef}
/>
```

The parent owns the value, while the child exposes commands such as:

```tsx
editorRef.current?.focus();
```

## Relationship to Uncontrolled Components

Uncontrolled Components retain their authoritative state internally.

An imperative handle can expose limited operations over that internal state.

This can be useful for self-contained widgets, but the imperative surface should remain small enough that the component
remains genuinely encapsulated.

## Relationship to State Colocation and State Lifting

State Colocation determines where state should normally live.

State Lifting changes ownership when multiple consumers need one authoritative state owner.

Imperative Handle does not determine state ownership.

It provides an imperative command boundary after ownership decisions have already been made.

Using an imperative handle to avoid making a necessary state-ownership decision is a design smell.

## Relationship to Effects

Effects synchronize React with external systems.

Imperative Handles expose commands to component consumers.

An imperative handle may invoke code that interacts with an external system, but it does not replace the lifecycle
synchronization responsibilities of Effects.

## Relationship to Referential Stability

An imperative handle has an identity and contains function values.

Referential Stability therefore affects handle recreation and method identity.

The handle's dependency list should be designed according to its actual reactive dependencies. Stability should be
treated as a consequence of a sound API design, not as an optimization target by itself.

## Relationship to Memoized Components

Component memoization concerns whether React can skip rendering a component based on props.

Imperative handles concern the value exposed through refs.

They are independent mechanisms.

A memoized component can expose an imperative handle, and an imperative handle does not inherently require component
memoization.

## Relationship to Context

Context is appropriate for distributing values or capabilities through a component subtree without explicit prop
passing.

An imperative handle is a direct parent-child ref-based API.

If many unrelated consumers need access to the same capability, a Context-based design may be more appropriate than
passing refs through component boundaries.

If one parent needs a narrowly scoped command interface to one child, an imperative handle is usually more direct.

## Relationship to Dependency Injection

A handle can expose capabilities, but it is not itself a general dependency-injection mechanism.

The component still owns the implementation behind the handle.

Dependency Injection concerns supplying dependencies to a component or subsystem. Imperative Handle concerns exposing
commands from a component to its consumer.

## Relationship to External Stores

External Stores manage state whose authoritative ownership exists outside React component state.

An imperative handle does not move state ownership outside React. It merely exposes commands through a ref.

A component may consume an external store and expose imperative operations, but these remain separate architectural
concerns.

## Relationship to Server State

Server State represents remote authoritative data and its local synchronized representation.

Imperative handles are generally inappropriate for representing server-state ownership or synchronization.

A method such as:

```tsx
ref.current?.refetch();
```

can be a legitimate widget-level command, but the handle should not become the primary server-state management model.

The synchronization and cache semantics belong to the server-state layer.

## API Design Rules

A well-designed imperative handle should follow a few constraints.

1. Expose capabilities, not implementation details.
2. Prefer semantic commands over DOM-specific operations.
3. Keep the API small.
4. Do not duplicate ordinary declarative props with imperative setters.
5. Define the TypeScript contract explicitly when the API is public.
6. Include reactive dependencies required by handle methods.
7. Use stable refs when methods need access to current mutable resources without recreating the handle.
8. Define failure behavior for operations that may not be available.
9. Preserve lifecycle correctness when the component mounts and unmounts.
10. Treat parent-child coupling as intentional and keep it narrow.
11. Use imperative APIs primarily for genuinely imperative behavior.
12. Do not use an imperative handle to avoid solving state ownership correctly.

## Summary

The Imperative Handle pattern gives a React component a controlled imperative interface through a ref.

The component defines the handle:

```tsx
useImperativeHandle(ref, () => ({
    focus() {
        inputRef.current?.focus();
    },

    clear() {
        inputRef.current?.value = "";
    },
}));
```

The parent consumes the capabilities:

```tsx
inputRef.current?.focus();
inputRef.current?.clear();
```

The important property is not simply that the parent can call methods. It is that the component controls which methods
exist and hides the implementation behind them.

Imperative handles are therefore most valuable at boundaries where commands such as focus, scroll, play, pause, reset,
selection, or specialized widget operations are more natural than declarative state.

They should remain narrow. They should not become a second, imperative state-management system. State ownership belongs
to state-management patterns; lifecycle synchronization belongs to Effects; ref mechanics belong to the Ref Pattern; and
the Imperative Handle pattern owns the design of a constrained imperative API exposed through a ref.
