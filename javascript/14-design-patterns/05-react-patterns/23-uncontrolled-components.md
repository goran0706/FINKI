# Uncontrolled Components

An uncontrolled component is a component that owns its current state internally rather than receiving that state as an
authoritative value from its consumer. The consumer may provide an initial value or configuration, but the component
remains responsible for subsequent state changes.

The defining property is ownership: the component is the source of truth for its state.

## Intent

Use an uncontrolled component when the component can independently manage its state and consumers do not need to govern
every state transition.

A simple uncontrolled component may accept an initial value:

```tsx
interface InputProps {
    defaultValue?: string;
}

function Input({defaultValue}: InputProps) {
    return <input defaultValue={defaultValue}/>;
}
```

The consumer supplies the initial value, but does not continuously control the current value.

For a native form control, the DOM itself can be the state owner:

```tsx
function Form() {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSubmit() {
        const value = inputRef.current?.value ?? "";
        console.log(value);
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
            }}
        >
            <input ref={inputRef} defaultValue=""/>
            <button type="submit">Submit</button>
        </form>
    );
}
```

The current input value is not maintained as React state. The DOM owns it.

## Source of Truth

The defining characteristic of an uncontrolled component is that the component's internal state is authoritative.

```tsx
function Counter({defaultValue = 0}) {
    const [count, setCount] = useState(defaultValue);

    return (
        <button onClick={() => setCount((value) => value + 1)}>
            {count}
        </button>
    );
}
```

`defaultValue` initializes the state.

After initialization, `count` belongs to `Counter`.

The consumer does not provide the current count on every render.

This differs fundamentally from:

```tsx
<Counter
    value={count}
    onChange={setCount}
/>
```

where the consumer owns the current value.

## `defaultValue`

The most common uncontrolled API uses `defaultValue`.

```tsx
<Input defaultValue="initial"/>
```

The default establishes initial state rather than ongoing state.

If the consumer later renders:

```tsx
<Input defaultValue="different"/>
```

the component should not generally interpret this as an instruction to replace its current state.

This distinction is fundamental to uncontrolled component APIs:

```text
defaultValue = initial state
value = current authoritative state
```

`defaultValue` is therefore not merely an optional version of `value`. It communicates a different ownership model.

## Internal State

An uncontrolled component normally stores state internally.

```tsx
function Disclosure({
                        defaultOpen = false,
                    }: {
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <section>
            <button onClick={() => setOpen((value) => !value)}>
                {open ? "Close" : "Open"}
            </button>

            {open && <div>Content</div>}
        </section>
    );
}
```

The component decides when `open` changes.

The consumer does not need to participate in every transition.

This makes the component self-contained when external coordination is unnecessary.

## DOM-Owned State

Uncontrolled components are particularly common with native form elements.

```tsx
function Form() {
    return (
        <form>
            <input name="email" defaultValue=""/>
            <textarea name="message" defaultValue=""/>
            <button type="submit">Submit</button>
        </form>
    );
}
```

The DOM maintains the current values.

React can read them when needed, for example during form submission.

```tsx
function Form() {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);

        console.log(data.get("email"));
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="email" defaultValue=""/>
            <button type="submit">Submit</button>
        </form>
    );
}
```

There is no React state representing every keystroke.

## Refs as an Access Boundary

A ref can provide access to uncontrolled DOM state without transferring ownership to React state.

```tsx
function SearchForm() {
    const inputRef = useRef<HTMLInputElement>(null);

    function submit() {
        const query = inputRef.current?.value ?? "";
        console.log(query);
    }

    return (
        <>
            <input ref={inputRef} defaultValue=""/>
            <button onClick={submit}>Search</button>
        </>
    );
}
```

The ref provides imperative access.

It does not make the value controlled.

The DOM remains authoritative.

## Imperative Access

Uncontrolled components are often useful when interaction is naturally imperative.

For example:

```tsx
function VideoPlayer() {
    const videoRef = useRef<HTMLVideoElement>(null);

    function play() {
        videoRef.current?.play();
    }

    return (
        <>
            <video ref={videoRef}/>
            <button onClick={play}>Play</button>
        </>
    );
}
```

The playback state is primarily managed by the browser's media element rather than mirrored into React state.

React can issue commands and observe selected events without becoming the authoritative owner of every aspect of the
media element's state.

## Initialization Versus Synchronization

An uncontrolled component can receive configuration used during initialization.

```tsx
function Editor({
                    defaultText,
                }: {
    defaultText: string;
}) {
    const [text, setText] = useState(defaultText);

    return (
        <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
        />
    );
}
```

`defaultText` initializes local state.

If the parent later changes `defaultText`, that does not automatically mean that the current editor content should
change.

This is often desirable because an uncontrolled component has explicitly accepted ownership of the current state.

If external changes must replace the current state, the component should instead expose a controlled API or an explicit
reset mechanism.

## Resetting

Uncontrolled components can provide explicit commands for resetting their internal state.

A simple local-state implementation might expose a reset callback through component behavior:

```tsx
function Form() {
    const [name, setName] = useState("");

    function reset() {
        setName("");
    }

    return (
        <>
            <input
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <button onClick={reset}>Reset</button>
        </>
    );
}
```

For DOM-owned forms, the native form reset mechanism can restore default values:

```tsx
function Form() {
    return (
        <form>
            <input name="name" defaultValue="Initial"/>
            <button type="reset">Reset</button>
        </form>
    );
}
```

The important distinction is that reset changes the internally owned state. It does not require the consumer to supply
every intermediate value.

## Validation

Uncontrolled components can still participate in validation.

Native validation can be delegated to the browser:

```tsx
function Form() {
    return (
        <form>
            <input
                name="email"
                type="email"
                required
            />

            <button type="submit">
                Submit
            </button>
        </form>
    );
}
```

Application code can read the value at a boundary such as submission:

```tsx
function Form() {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email = String(data.get("email") ?? "");

        if (!email) {
            return;
        }

        // Submit data.
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="email" type="email" required/>
            <button type="submit">Submit</button>
        </form>
    );
}
```

The application does not need to maintain React state for every keystroke merely to validate the final submission.

## Form State

Uncontrolled inputs can be useful when the application primarily cares about the submitted form rather than every
intermediate value.

```tsx
function LoginForm() {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const username = String(formData.get("username") ?? "");
        const password = String(formData.get("password") ?? "");

        login(username, password);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="username"/>
            <input name="password" type="password"/>
            <button type="submit">Log in</button>
        </form>
    );
}
```

The DOM owns the current input values until the form is submitted.

This can significantly simplify forms where intermediate state does not need to participate in application rendering.

## File Inputs

File inputs are a common case where uncontrolled behavior is appropriate.

```tsx
function UploadForm() {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSubmit() {
        const files = inputRef.current?.files;

        if (!files?.length) {
            return;
        }

        upload(files[0]);
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
            />

            <button onClick={handleSubmit}>
                Upload
            </button>
        </>
    );
}
```

The browser owns the selected files. Application code reads them when required.

This avoids trying to model browser-managed file-selection state as ordinary React-controlled input state.

## Uncontrolled Compound Components

A compound component can internally own coordination state while exposing only initialization and semantic callbacks.

```tsx
<Accordion defaultValue="first">
    <Accordion.Item value="first">
        <Accordion.Trigger>
            First
        </Accordion.Trigger>

        <Accordion.Content>
            Content
        </Accordion.Content>
    </Accordion.Item>
</Accordion>
```

The `Accordion` owns the current selection.

The consumer specifies the initial state through `defaultValue`.

The individual compound components participate in the internal behavior without requiring the consumer to manage the
current value.

Context may be used internally to distribute that state, but Context is not what makes the component uncontrolled.

## Uncontrolled State and Context

Context can distribute internally owned state among descendants.

```tsx
function Provider({children}: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <MenuContext.Provider value={{open, setOpen}}>
            {children}
        </MenuContext.Provider>
    );
}
```

The state is still owned by the provider's component tree.

Context is only the distribution mechanism.

This distinction matters because uncontrolled ownership and Context distribution are separate concerns.

## Uncontrolled State and Custom Hooks

A custom Hook can encapsulate state for an uncontrolled component.

```tsx
function useDisclosure(defaultOpen = false) {
    const [open, setOpen] = useState(defaultOpen);

    return {
        open,
        toggle: () => setOpen((value) => !value),
    };
}
```

A component can use it:

```tsx
function Disclosure() {
    const {open, toggle} = useDisclosure();

    return (
        <>
            <button onClick={toggle}>
                {open ? "Close" : "Open"}
            </button>

            {open && <div>Content</div>}
        </>
    );
}
```

The Hook encapsulates reusable behavior, but the component remains the state owner.

A custom Hook does not inherently make state controlled or uncontrolled. Ownership is determined by how the state enters
and leaves the component boundary.

## Uncontrolled State and Reducers

An uncontrolled component can use a reducer when its internal state transitions are sufficiently complex.

```tsx
function Editor() {
    const [state, dispatch] = useReducer(
        editorReducer,
        initialEditorState
    );

    // ...
}
```

The reducer structures internal transitions.

It does not change ownership.

The component remains uncontrolled if the current state remains internally authoritative.

## Component Identity

Uncontrolled state is tied to the lifetime of the component instance.

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount((value) => value + 1)}>
            {count}
        </button>
    );
}
```

If React preserves the component's identity, its state is preserved.

If the component is remounted, its uncontrolled state is initialized again.

This means keys and component identity can affect uncontrolled state lifetime, but they do not define the ownership
model itself.

## External Reset Through Identity

A consumer can sometimes intentionally recreate an uncontrolled component to restore its initial state.

```tsx
function EditorContainer() {
    const [version, setVersion] = useState(0);

    return (
        <>
            <Editor key={version} defaultText="Initial"/>

            <button onClick={() => setVersion((value) => value + 1)}>
                Reset
            </button>
        </>
    );
}
```

Changing the key creates a new component instance and therefore a new internal state lifetime.

This is an identity-based reset, not controlled state.

It should be used deliberately because remounting also resets other state and lifecycle associated with that component
subtree.

## Controlled and Uncontrolled Modes

Reusable components sometimes support both models.

```tsx
interface InputProps {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
}
```

Controlled usage:

```tsx
<Input
    value={value}
    onChange={setValue}
/>
```

Uncontrolled usage:

```tsx
<Input
    defaultValue="Initial"
/>
```

The component must clearly determine which state source is authoritative.

A simplified implementation is:

```tsx
function Input({
                   value,
                   defaultValue = "",
                   onChange,
               }: InputProps) {
    const [internalValue, setInternalValue] = useState(defaultValue);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    function handleChange(nextValue: string) {
        if (!isControlled) {
            setInternalValue(nextValue);
        }

        onChange?.(nextValue);
    }

    return (
        <input
            value={currentValue}
            onChange={(event) => {
                handleChange(event.target.value);
            }}
        />
    );
}
```

When uncontrolled, `internalValue` is authoritative.

When controlled, `value` is authoritative.

The component should not switch modes during its lifetime.

## Mode Stability

A dual-mode component should establish its ownership mode consistently.

Starting uncontrolled:

```tsx
<Input defaultValue="hello"/>
```

and later changing to:

```tsx
<Input value={value}/>
```

changes the ownership model.

Likewise, starting controlled and later removing `value` changes the source of truth in the opposite direction.

Such transitions can produce ambiguous state because the component must decide which state should win.

Reusable component implementations should therefore detect and warn about controlled/uncontrolled transitions when
appropriate.

## External Observation

Uncontrolled does not mean inaccessible.

A component can expose events that notify consumers about changes without transferring ownership.

```tsx
<Input
    defaultValue=""
    onChange={(value) => {
        analytics.track("input_changed", {value});
    }}
/>
```

The callback observes a change.

The component still owns the current state.

This distinction is important:

```text
notification != ownership
```

A consumer can observe an uncontrolled component without controlling it.

## External Side Effects

An uncontrolled component can report state changes so that the consumer can perform side effects.

```tsx
function SearchInput() {
    const [query, setQuery] = useState("");

    return (
        <input
            value={query}
            onChange={(event) => {
                const nextQuery = event.target.value;
                setQuery(nextQuery);
                analytics.track("query_changed");
            }}
        />
    );
}
```

The existence of an external callback does not by itself make the state controlled.

The determining question remains: who supplies the authoritative current state?

## Performance

Uncontrolled components can reduce the amount of application state that participates in frequent renders.

For example, a text input whose value is only needed on submission does not necessarily need to update React state on
every keystroke.

```tsx
function Form() {
    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        // Process submitted values.
    }

    return (
        <form onSubmit={submit}>
            <input name="query"/>
            <button type="submit">Search</button>
        </form>
    );
}
```

This can be useful for large forms or high-frequency input.

Performance alone should not determine ownership, however. If intermediate state must affect rendering or application
behavior, controlled state may be the correct model despite the additional renders.

## Testing

Testing uncontrolled components should focus on their externally observable behavior rather than requiring direct access
to their internal state.

Important behaviors include:

* applying the initial default value;
* maintaining state after initialization;
* changing state in response to interaction;
* ignoring subsequent changes to initialization-only props;
* exposing the expected callbacks or events;
* resetting correctly;
* preserving state while the component identity is preserved;
* resetting state when intentionally remounted.

For DOM-owned forms, tests should verify the submitted values rather than attempting to inspect React state that does
not exist.

## Common Misuse

A common misuse is treating `defaultValue` as a controlled value.

```tsx
<Input defaultValue={value}/>
```

This does not mean that the component should follow `value` after initialization.

Another misuse is mirroring uncontrolled state into React state solely to observe every update:

```tsx
const [value, setValue] = useState("");

<input
    defaultValue={value}
    onChange={(event) => {
        setValue(event.target.value);
    }}
/>
```

If React state must remain authoritative, the component should use a controlled `value` instead.

Another misuse is choosing uncontrolled state when the parent actually needs to coordinate the value with other
components. In that case, keeping the state local creates an ownership boundary that is too low.

Another misuse is exposing numerous imperative methods simply because the component is uncontrolled. Uncontrolled
ownership should simplify the API, not replace declarative state with an unnecessarily large imperative surface.

## Advantages

Uncontrolled components encapsulate their own state and can produce simpler APIs when external ownership is unnecessary.
They reduce the amount of state that consumers must manage, work naturally with native DOM behavior, and can be useful
for forms and interactions where only initialization and final values matter.

They can also avoid unnecessary application-level updates for rapidly changing state that does not need to affect
rendering.

## Disadvantages

Uncontrolled components make external coordination more difficult because consumers do not own the current state.
Reading current state may require callbacks, refs, submission boundaries, or other APIs.

They are therefore less suitable when other components need to react immediately to every state change or when
application logic must validate and govern each transition.

Overuse can also make important application state difficult to observe because ownership remains hidden inside a
component.

## When to Use

Use an uncontrolled component when:

* the state is naturally local to the component;
* the consumer only needs to provide initial state;
* the current state does not need to drive unrelated rendering;
* the component can encapsulate its own interaction behavior;
* native DOM state is already an appropriate source of truth;
* the consumer mainly needs the final value at a boundary such as form submission;
* imperative browser APIs naturally own the state;
* external coordination would add unnecessary complexity.

## When Not to Use

Do not use uncontrolled state when multiple components need one authoritative value.

Do not use it when the parent must validate, transform, reject, or coordinate every state transition.

Do not use it when current state must immediately drive other application rendering.

Do not use it when application state must be persisted or synchronized continuously with another state owner.

In those cases, a controlled component or an external state owner is generally more appropriate.

## Relationships

Uncontrolled Components is the ownership counterpart to Controlled Components. Controlled Components delegate
authoritative state to the consumer; uncontrolled components retain authoritative state internally.

State Colocation provides the broader ownership principle that local state should remain local when no broader owner is
required.

State Lifting moves state ownership upward when multiple consumers need coordination. That decision often produces
controlled child components.

Context Provider can distribute internally owned state to descendants, but Context is a distribution mechanism rather
than an ownership model.

Custom Hooks can encapsulate uncontrolled state logic without changing its ownership.

Reducer Pattern can structure complex uncontrolled state transitions without changing who owns the state.

Ref Pattern provides imperative access to DOM or component instances and is frequently useful with uncontrolled
components, but a ref itself does not determine ownership.

Stable Keys and Component Identity influence the lifetime of uncontrolled state because internal state belongs to
component instances.

Form State concerns the organization of form state; uncontrolled components are one possible ownership model for that
state.

## Summary

An uncontrolled component owns its current state internally. The consumer can provide initial state through properties
such as `defaultValue` or `defaultOpen`, but those values do not become ongoing authoritative inputs.

The essential distinction is:

```tsx
// Controlled
<Component
    value={value}
    onChange={setValue}
/>

// Uncontrolled
<Component
    defaultValue="initial"
/>
```

Controlled state is supplied continuously by an external owner. Uncontrolled state is initialized externally but
subsequently owned by the component.

The central rule is: **use uncontrolled state when the component can be the authoritative owner without requiring
external coordination.**
