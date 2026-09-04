# Ref Pattern

The Ref Pattern uses a React ref as a stable container for a value whose identity must persist across renders without
that value participating in React's rendering data flow.

A ref provides a stable object whose `.current` property can be mutated without causing a re-render:

```tsx
function Component() {
    const ref = useRef<Value | null>(null);

    ref.current = value;

    return <div/>;
}
```

The defining property is not simply persistence. React state also persists across renders. The distinction is that
changing a ref does not schedule a render and React does not use the ref's current value to determine the rendered
output.

Refs are therefore appropriate for information that must survive renders but does not itself determine what the
component renders.

## Intent

Use a ref when a component needs stable mutable storage or stable access to an object whose identity must survive across
renders without participating in React's reactive update model.

Typical uses include:

* Holding a DOM node.
* Holding an imperative resource instance.
* Storing a timer or subscription handle.
* Retaining mutable values between renders.
* Tracking previous values.
* Maintaining instance-like data that should not trigger rendering.
* Bridging React with imperative APIs.
* Preserving object identity across renders.

A ref is not a replacement for state. It is a different form of storage with different reactivity semantics.

## Stable Identity

Calling `useRef` returns a stable ref object for the lifetime of the component instance.

```tsx
function Component() {
    const ref = useRef<number>(0);

    console.log(ref);

    return <div/>;
}
```

Across renders, the ref object remains the same:

```tsx
const first = ref;

render();

const second = ref;

first === second;
```

The identity of the ref persists while `.current` can change.

This makes refs useful for maintaining mutable information across renders without introducing a state transition.

## Non-Reactive Mutation

Changing `.current` does not cause React to render again.

```tsx
function Component() {
    const countRef = useRef(0);

    function increment() {
        countRef.current += 1;
    }

    return <button onClick={increment}>Increment</button>;
}
```

The value changes, but the displayed UI does not automatically update.

If the UI needs to reflect the value, it belongs in state:

```tsx
function Component() {
    const [count, setCount] = useState(0);

    function increment() {
        setCount((count) => count + 1);
    }

    return <button onClick={increment}>{count}</button>;
}
```

The distinction is fundamental:

* State represents reactive data.
* Ref represents persistent non-reactive data.

## DOM References

One of the most common uses of refs is obtaining access to a DOM element.

```tsx
function SearchInput() {
    const inputRef = useRef<HTMLInputElement>(null);

    return <input ref={inputRef}/>;
}
```

After the element has been committed, React assigns the corresponding DOM node to `.current`.

An imperative operation can then use the reference:

```tsx
function SearchInput() {
    const inputRef = useRef<HTMLInputElement>(null);

    function focusInput() {
        inputRef.current?.focus();
    }

    return (
        <>
            <input ref={inputRef}/>
            <button onClick={focusInput}>Focus</button>
        </>
    );
}
```

The ref provides identity and access to the DOM node without putting the DOM node itself into React state.

## Refs as Resource Handles

Refs can hold handles to imperative resources.

```tsx
function Component() {
    const connectionRef = useRef<Connection | null>(null);

    function connect() {
        const connection = createConnection();
        connection.connect();

        connectionRef.current = connection;
    }

    function disconnect() {
        connectionRef.current?.disconnect();
        connectionRef.current = null;
    }

    return (
        <>
            <button onClick={connect}>Connect</button>
            <button onClick={disconnect}>Disconnect</button>
        </>
    );
}
```

The ref stores the identity of the external resource without making that resource part of the rendered state.

Resource ownership and synchronization remain separate concerns. A ref provides storage for the resource handle; it does
not automatically establish, synchronize, or clean up the resource.

## Refs and Effects

Refs and Effects are frequently used together.

A ref can provide access to an imperative object while an Effect performs synchronization:

```tsx
function Video({
                   playing,
               }: {
    playing: boolean;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        if (playing) {
            video.play();
        } else {
            video.pause();
        }
    }, [playing]);

    return <video ref={videoRef}/>;
}
```

The responsibilities are distinct:

* The ref identifies the DOM node.
* The Effect synchronizes the DOM node with React state.

A ref does not replace an Effect when synchronization is required.

## Mutable Instance Data

Refs can emulate a limited form of instance field found in class-based components.

```tsx
function Component() {
    const renderCount = useRef(0);

    renderCount.current += 1;

    return <div>Render count: {renderCount.current}</div>;
}
```

The ref persists across renders and can hold mutable data associated with the component instance.

However, mutating refs during rendering requires care. The render phase should remain free from externally visible side
effects, and ref mutation should not be used to create hidden dependencies between renders.

Refs are most useful when the mutation is an implementation detail that does not affect the current render result.

## Previous Value Pattern

A ref can retain a value from a previous render.

```tsx
function Component({value}: { value: string }) {
    const previousValue = useRef<string | undefined>(undefined);

    useEffect(() => {
        previousValue.current = value;
    }, [value]);

    return (
        <div>
            Previous: {previousValue.current}
        </div>
    );
}
```

The ref provides persistent storage across renders.

The timing matters. Updating the ref in an Effect means the value represents information from the previous committed
synchronization point rather than an arbitrary previous invocation of the component function.

## Timer Handles

Refs are useful for storing timer handles.

```tsx
function Timer() {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function start() {
        timeoutRef.current = setTimeout(() => {
            console.log("done");
        }, 1000);
    }

    function cancel() {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }

    return (
        <>
            <button onClick={start}>Start</button>
            <button onClick={cancel}>Cancel</button>
        </>
    );
}
```

The timer handle does not need to appear in the UI. It only needs to persist so that later code can access the same
timer resource.

A ref is therefore more appropriate than state.

## Previous Resource Identity

Refs can also preserve the identity of an external resource between operations.

```tsx
function Component({resource}: { resource: Resource }) {
    const resourceRef = useRef<Resource | null>(null);

    useEffect(() => {
        resourceRef.current = resource;

        return () => {
            if (resourceRef.current === resource) {
                resourceRef.current = null;
            }
        };
    }, [resource]);

    return null;
}
```

This type of identity tracking is useful when correctness depends on distinguishing the currently owned resource from an
obsolete resource.

The broader lifecycle and cancellation semantics belong to the synchronization or cleanup design rather than to the ref
itself.

## Callback Storage

A ref can hold a callback without changing the identity of the storage container.

```tsx
function Component({
                       onMessage,
                   }: {
    onMessage: (message: Message) => void;
}) {
    const callbackRef = useRef(onMessage);

    useEffect(() => {
        callbackRef.current = onMessage;
    }, [onMessage]);

    return null;
}
```

An external callback can then read the current callback from the ref without requiring the external resource itself to
be recreated.

This technique can be useful when an external subscription has a long lifetime but its behavior needs access to current
React values.

It should not be used to hide legitimate reactive dependencies from React. The ref is appropriate only when the intended
semantics are explicitly non-reactive.

## Refs and Event Handlers

Refs are particularly useful when an event handler needs access to mutable information that should not itself cause
rendering.

```tsx
function Component() {
    const latestValue = useRef("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        latestValue.current = event.target.value;
    }

    function submit() {
        sendValue(latestValue.current);
    }

    return (
        <>
            <input onChange={handleChange}/>
            <button onClick={submit}>Submit</button>
        </>
    );
}
```

This avoids using React state when the value does not need to participate in rendering.

However, if the input value must control rendered UI, validation, conditional content, or other reactive behavior, state
is the appropriate mechanism.

## Ref Callback

A ref does not have to be created with `useRef`. React also supports callback refs.

```tsx
function Component() {
    const handleRef = (node: HTMLDivElement | null) => {
        if (node) {
            initialize(node);
        }
    };

    return <div ref={handleRef}/>;
}
```

A callback ref receives the underlying value when React attaches it and `null` when React detaches it.

Callback refs are useful when attachment and detachment themselves need to trigger imperative logic.

They are particularly useful when the logic cannot conveniently be represented by storing the node and reacting
separately.

## Object Refs and Callback Refs

Object refs provide stable mutable storage:

```tsx
const ref = useRef<HTMLDivElement>(null);

return <div ref={ref}/>;
```

Callback refs provide explicit attachment behavior:

```tsx
const ref = (node: HTMLDivElement | null) => {
    if (node) {
        initialize(node);
    }
};
```

Use an object ref when the primary requirement is stable access to the referenced value.

Use a callback ref when attachment or detachment itself has imperative semantics.

## Ref Identity and Component Identity

A ref belongs to a particular component instance.

When React preserves a component's identity across renders, its ref state persists:

```tsx
function Component() {
    const valueRef = useRef(0);

    return <div/>;
}
```

If React replaces that component instance with another instance, the ref does not migrate to the new instance.

This means refs participate indirectly in React's component identity model. A ref should not be treated as globally
persistent storage.

## Refs and Keys

Keys determine component identity in lists. Because refs belong to component instances, changing keys can cause the
component instance—and therefore its refs—to be replaced.

```tsx
function Item({id}: { id: string }) {
    const ref = useRef<HTMLDivElement>(null);

    return <div ref={ref}>{id}</div>;
}
```

If React treats the element as a different component instance because its key changes, the previous ref state is not
preserved as though it were the same instance.

This is one reason ref-backed state should be considered instance-local rather than globally persistent.

## Lazy Ref Initialization

A ref can be used for lazy initialization of an expensive object when the object should remain stable for the
component's lifetime.

```tsx
function Component() {
    const cacheRef = useRef<Cache | null>(null);

    if (cacheRef.current === null) {
        cacheRef.current = new Cache();
    }

    return <div/>;
}
```

This specific initialization pattern can be appropriate when the initialization is deterministic and has no externally
visible side effects.

It should not be used to perform arbitrary resource acquisition during rendering.

For resources that require external setup, teardown, or synchronization, an Effect or another resource-management
abstraction is usually more appropriate.

## Ref Mutation During Rendering

Refs are mutable, but that does not mean arbitrary mutation during rendering is safe.

This is particularly problematic:

```tsx
function Component() {
    const ref = useRef<number[]>([]);

    ref.current.push(Date.now());

    return <div/>;
}
```

Rendering may be invoked without committing the result, may be restarted, or may be evaluated multiple times.

Mutation that has observable consequences should therefore not be performed during rendering.

A ref can safely support deterministic initialization in carefully constrained cases, but it should not become a hidden
side-effect channel.

## Ref Versus State

The choice between state and refs should be based on whether the value participates in rendering.

Use state when:

```tsx
const [value, setValue] = useState(initialValue);
```

and changes to the value should cause React to render again.

Use a ref when:

```tsx
const valueRef = useRef(initialValue);
```

and the value must persist across renders but changes should not cause rendering.

For example:

```tsx
function Component() {
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    return (
        <button
            onClick={() => {
                setVisible(true);

                timerRef.current = setTimeout(() => {
                    setVisible(false);
                }, 1000);
            }}
        >
            {visible ? "Visible" : "Hidden"}
        </button>
    );
}
```

`visible` belongs in state because it affects rendering. The timer handle belongs in a ref because it is an
implementation detail used to control an external resource.

## Ref Versus Memoization

Refs and memoization solve different problems.

`useMemo` caches a computed value according to reactive dependencies:

```tsx
const result = useMemo(() => expensiveCalculation(input), [input]);
```

A ref provides stable mutable storage:

```tsx
const valueRef = useRef<Value | null>(null);
```

Memoization answers:

"Can this computation be reused when its dependencies have not changed?"

A ref answers:

"Where can this mutable value persist without participating in rendering?"

A ref should not be used as a manual memoization cache unless the application explicitly needs mutable cache semantics.

## Ref Versus Context

Context distributes values through the React component tree.

A ref stores a value locally within a component instance.

```tsx
const valueRef = useRef<Resource | null>(null);
```

versus:

```tsx
const ResourceContext = createContext<Resource | null>(null);
```

Context is appropriate when descendants need access to a shared value.

A ref is appropriate when the value is an implementation detail of one component instance.

## Ref Versus State Machine

Refs can hold mutable implementation details, but they do not provide transition semantics.

For example:

```tsx
const stateRef = useRef<"idle" | "running">("idle");
```

does not provide the explicit transition model of a reducer or state machine.

If changes to the value represent meaningful application state and should be observable by rendering or other reactive
logic, a state-oriented abstraction is more appropriate.

Refs should not become an untracked state machine.

## Forwarding Refs

A component can expose a ref to an underlying DOM node or component boundary.

In React APIs that support forwarded refs, the component can connect the consumer's ref to an internal element:

```tsx
const Input = forwardRef<HTMLInputElement, Props>(
    function Input(props, ref) {
        return <input {...props} ref={ref}/>;
    },
);
```

The ref crosses a component boundary so the parent can access the underlying imperative target.

This is useful when the abstraction represents a DOM-like control whose imperative identity is part of its public
contract.

Exposing refs should be deliberate. Once a component exposes an imperative target, consumers can become coupled to that
implementation detail.

## Ref Encapsulation

A component should generally expose the smallest imperative surface necessary.

Instead of exposing a large internal object:

```tsx
ref.current = internalWidget;
```

an abstraction can expose only the specific operations that consumers require.

That design is handled by the Imperative Handle pattern, which builds on refs while restricting the externally visible
imperative API.

The Ref Pattern itself concerns persistent reference storage and identity; imperative handle design concerns what a
component deliberately exposes through that reference.

## Ref Safety

A ref may be `null` when the referenced resource has not yet been attached or has already been detached.

```tsx
inputRef.current?.focus();
```

Code that uses a ref must therefore account for its lifecycle.

This is particularly important for DOM refs because the component may render before the corresponding node exists and
because React may later detach it.

Refs should never be assumed to contain a valid resource merely because a ref object exists.

## TypeScript

TypeScript types for refs should represent the actual lifecycle of the referenced value.

For a DOM node:

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

For a mutable value:

```tsx
const countRef = useRef(0);
```

For a resource that may not yet exist:

```tsx
const connectionRef = useRef<Connection | null>(null);
```

The type should reflect whether `.current` can be `null`.

This makes resource acquisition and access boundaries explicit.

## Testing Refs

Refs are implementation details unless the component deliberately exposes an imperative API.

Tests should therefore usually verify observable behavior rather than inspect internal ref values.

For example, rather than asserting that a component's internal timer ref contains a particular handle, test the behavior
produced by the timer.

For a component that deliberately exposes an imperative ref API, tests should verify the public imperative contract.

This keeps tests coupled to behavior rather than storage mechanics.

## Common Misuse

The most common misuse is storing rendered state in a ref.

```tsx
function Component() {
    const countRef = useRef(0);

    function increment() {
        countRef.current += 1;
    }

    return <div>{countRef.current}</div>;
}
```

The displayed value will not update when the ref changes.

Use state when the value is part of the UI.

Another misuse is using refs to bypass React's reactive data flow:

```tsx
const valueRef = useRef(value);
valueRef.current = value;
```

and then reading the ref everywhere instead of declaring actual reactive dependencies.

This can hide data dependencies and make synchronization difficult to reason about.

Another misuse is using refs as global storage:

```tsx
const globalRef = useRef<Cache>();
```

Refs are component-instance-local. Application-wide state or resources require an appropriate shared abstraction.

Another misuse is storing derived values that can simply be calculated:

```tsx
const totalRef = useRef(price * quantity);
```

If the value is derived from current reactive inputs, it normally belongs in rendering:

```tsx
const total = price * quantity;
```

Another misuse is performing resource acquisition through ref initialization:

```tsx
const resourceRef = useRef(createResource());
```

This invokes the initializer during rendering and can create unintended resources during renders that do not commit.

Resource acquisition should use an appropriate lifecycle or resource-management mechanism.

## Advantages

Refs provide stable identity across renders without introducing re-renders.

They are useful for DOM access, imperative resources, timer handles, mutable instance data, previous values, and other
information that must persist but does not itself belong to the rendered state.

They also provide a controlled bridge between React's declarative model and imperative APIs.

## Disadvantages

Refs are non-reactive, so changing them does not update the UI.

Because React does not track ref mutations as state transitions, excessive use can create hidden mutable state and make
data flow harder to understand.

Refs can also bypass useful dependency tracking when used to conceal values that should actually participate in reactive
synchronization.

They therefore require stronger discipline than ordinary state for determining ownership, mutation, and observation.

## When to Use

Use the Ref Pattern when:

* A DOM node must be accessed imperatively.
* An imperative resource handle must persist across renders.
* A timer or observer handle must be retained.
* A mutable value must survive renders without causing rendering.
* A previous value must be retained for comparison.
* A stable identity must be maintained for an imperative object.
* A callback or mutable implementation detail must persist independently of rendering.
* A component intentionally exposes an imperative API.

Do not use a ref when:

* The value determines rendered output.
* Changes to the value should trigger rendering.
* The value is simply derived from props or state.
* Context or shared state is the actual requirement.
* A reactive external store abstraction is more appropriate.
* A ref is being used only to circumvent dependency correctness.

## Relationship to Other React Patterns

The Ref Pattern provides stable mutable storage and imperative identity.

Effect Synchronization uses Effects to synchronize external systems. Refs often provide the target that an Effect
operates on, but the two patterns have separate responsibilities.

Effect Cleanup handles releasing resources established by Effects. A ref may store the resource handle, but it does not
perform cleanup by itself.

Abortable Async Effects use cancellation or invalidation to control asynchronous work. A ref can sometimes store a
cancellation handle, but the cancellation strategy is a separate concern.

Imperative Handle builds an intentionally constrained public API on top of refs. It answers what a component exposes
imperatively rather than merely how a component stores a reference.

Controlled Components use React state owned outside the component to determine behavior and rendering. Refs represent
non-reactive internal storage and therefore provide fundamentally different state ownership semantics.

Uncontrolled Components commonly use refs to access DOM-owned state. The uncontrolled pattern concerns state ownership;
the ref pattern provides the mechanism for accessing the underlying DOM or imperative value.

External Store integration provides reactive subscriptions to state owned outside React. Refs are not a substitute for
that reactive subscription model.

## Summary

The Ref Pattern uses a stable ref object to retain mutable information across renders without making that information
part of React's reactive rendering model.

Its defining characteristics are:

* The ref object has stable identity for the component instance.
* `.current` can be mutated without scheduling a render.
* Refs are appropriate for non-reactive information.
* DOM refs provide access to imperative DOM identity.
* Refs can hold resource and timer handles.
* Refs can retain previous values and other instance-local data.
* Refs frequently cooperate with Effects but do not replace them.
* Refs should not be used to hide state that should participate in rendering.
* Ref mutation should not become an uncontrolled side-effect channel.
* Imperative APIs exposed through refs require deliberate encapsulation.

The core mental model is: **state tells React what needs to render; a ref remembers something the component needs to
access without asking React to render.**
