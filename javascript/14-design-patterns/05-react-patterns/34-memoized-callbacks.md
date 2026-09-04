# Memoized Callbacks

Memoized callbacks are function values whose identity can be preserved across renders when their dependencies remain
unchanged.

In React, the primary mechanism for memoizing a callback is `useCallback`. It allows a component to retain the same
function reference between renders until one of its dependencies changes.

The purpose is not to make the function execute faster. It is to stabilize the function's identity so that
identity-sensitive consumers can avoid unnecessary work or so that a dependency relationship remains stable.

## Intent

Use memoized callbacks when the identity of a function is meaningful to another part of the component architecture.

Typical uses include:

* passing a callback to a memoized child component
* providing a stable callback to a Hook dependency
* exposing a stable callback through a custom Hook
* maintaining referential stability for an external API
* preventing unnecessary subscription or teardown caused by callback identity changes

The primary concern is function identity, not function execution performance.

## Basic Pattern

```tsx
import {useCallback} from "react";

function Editor({documentId}: { documentId: string }) {
    const handleSave = useCallback(() => {
        saveDocument(documentId);
    }, [documentId]);

    return <SaveButton onSave={handleSave}/>;
}
```

The callback is recreated when `documentId` changes.

When `documentId` remains unchanged, React can reuse the previous function reference.

Conceptually, the dependency list describes when the callback's captured inputs require a new function identity.

## Callback Identity

Functions are reference values.

Two separately created functions are different references even when their implementation is identical.

```tsx
const first = () => console.log("save");
const second = () => console.log("save");

console.log(first === second); // false
```

Likewise, a function declared directly inside a component is normally a new function value on every render.

```tsx
function Editor() {
    const handleSave = () => {
        saveDocument();
    };

    return <SaveButton onSave={handleSave}/>;
}
```

The callback may behave identically on every render, but its reference changes.

`useCallback` allows that reference to remain stable when its dependencies remain unchanged.

## What `useCallback` Actually Memoizes

`useCallback` memoizes the function reference.

```tsx
const handleClick = useCallback(() => {
    submit(id);
}, [id]);
```

It does not execute the function.

It does not cache the function's return value.

It does not memoize the component that owns the callback.

It does not make the callback computationally faster.

It provides stable identity for the function value.

## Memoized Callback Versus Memoized Value

`useCallback` and `useMemo` are closely related but express different intent.

A memoized value:

```tsx
const result = useMemo(
    () => calculate(data),
    [data]
);
```

represents a cached result.

A memoized callback:

```tsx
const handleSubmit = useCallback(
    () => submit(data),
    [data]
);
```

represents a stable function reference.

A function is technically a value, and callback memoization can be expressed in terms of value memoization, but
`useCallback` makes the function-identity intent explicit.

Avoid using `useMemo` merely to manufacture a stable callback when `useCallback` communicates the design more directly.

## Callback Dependencies

The callback must declare the reactive values it reads.

```tsx
function Editor({documentId}: { documentId: string }) {
    const handleSave = useCallback(() => {
        saveDocument(documentId);
    }, [documentId]);

    return <SaveButton onSave={handleSave}/>;
}
```

`documentId` is captured by the callback and therefore participates in its dependency relationship.

If the dependency changes, the callback must be updated so that it uses the current value.

An incorrect dependency list can produce stale behavior.

```tsx
const handleSave = useCallback(() => {
    saveDocument(documentId);
}, []);
```

This incorrectly prevents the callback from updating when `documentId` changes.

Memoization does not remove React's normal closure semantics.

## Closures and Memoized Callbacks

A memoized callback is still a closure.

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    const logCount = useCallback(() => {
        console.log(count);
    }, [count]);

    return <button onClick={logCount}>Log count</button>;
}
```

When `count` changes, the callback is recreated so that it closes over the current value.

The dependency list is therefore not merely a performance configuration. It defines which values determine the
callback's current closure.

## Functional State Updates

Functional state updates can reduce callback dependencies.

Instead of:

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    const increment = useCallback(() => {
        setCount(count + 1);
    }, [count]);

    return <button onClick={increment}>{count}</button>;
}
```

the callback can express the update in terms of the previous state:

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    const increment = useCallback(() => {
        setCount(current => current + 1);
    }, []);

    return <button onClick={increment}>{count}</button>;
}
```

The callback no longer needs to capture the current `count` value.

This can make the callback identity stable across all renders while preserving correct state-update semantics.

## Memoized Callbacks and Memoized Components

One of the most common uses of `useCallback` is passing a callback to a memoized child.

```tsx
const SaveButton = memo(function SaveButton({
                                                onSave,
                                            }: {
    onSave: () => void;
}) {
    return <button onClick={onSave}>Save</button>;
});
```

Without callback memoization:

```tsx
function Editor() {
    const handleSave = () => {
        saveDocument();
    };

    return <SaveButton onSave={handleSave}/>;
}
```

the child receives a new function reference whenever `Editor` renders.

With:

```tsx
function Editor() {
    const handleSave = useCallback(() => {
        saveDocument();
    }, []);

    return <SaveButton onSave={handleSave}/>;
}
```

the callback reference can remain stable.

This can allow the memoized child to treat the callback prop as unchanged.

The optimization only matters if the child can otherwise benefit from avoiding the render.

Memoizing every callback passed to every child is therefore unnecessary.

## Memoized Callbacks Do Not Prevent Parent Renders

`useCallback` does not prevent the component containing the callback from rendering.

```tsx
function Parent({value}: { value: number }) {
    const handleClick = useCallback(() => {
        performAction();
    }, []);

    return <Child onClick={handleClick} value={value}/>;
}
```

When `value` changes, `Parent` still renders.

The callback simply retains its identity because its dependencies did not change.

Preventing component renders is the responsibility of component-level memoization or other architectural techniques.

## Memoized Callbacks and Effects

A callback can be a dependency of an Effect.

```tsx
function Connection({roomId}: { roomId: string }) {
    const createOptions = useCallback(() => {
        return {
            roomId,
        };
    }, [roomId]);

    useEffect(() => {
        const options = createOptions();
        connect(options);

        return () => disconnect(options);
    }, [createOptions]);

    return null;
}
```

Here callback identity participates in the Effect's dependency relationship.

When `roomId` changes, `createOptions` changes, which causes the Effect to synchronize again.

However, callback memoization should not be used merely to silence dependency analysis.

If the callback exists only to support an Effect and can be expressed directly inside the Effect, that may be simpler:

```tsx
function Connection({roomId}: { roomId: string }) {
    useEffect(() => {
        const options = {roomId};

        connect(options);

        return () => disconnect(options);
    }, [roomId]);

    return null;
}
```

The correct design is to make the dependency relationship explicit rather than introduce memoization solely to
manipulate it.

## Memoized Callbacks and Custom Hooks

Custom Hooks often expose callback APIs.

```tsx
function useEditor(documentId: string) {
    const save = useCallback(() => {
        saveDocument(documentId);
    }, [documentId]);

    return {
        save,
    };
}
```

A consumer can then receive a stable callback identity.

```tsx
function Editor({documentId}: Props) {
    const {save} = useEditor(documentId);

    return <SaveButton onSave={save}/>;
}
```

Whether a custom Hook should guarantee stable callback identity is an API-design decision.

If consumers are expected to place the callback in dependency arrays or pass it to memoized components, stable identity
can be part of the Hook's contract.

If identity is irrelevant, forcing every returned function through `useCallback` may add unnecessary complexity.

## Callback Identity as an API Contract

A custom Hook can intentionally expose stable callbacks.

```tsx
function usePagination() {
    const [page, setPage] = useState(1);

    const nextPage = useCallback(() => {
        setPage(current => current + 1);
    }, []);

    const previousPage = useCallback(() => {
        setPage(current => Math.max(1, current - 1));
    }, []);

    return {
        page,
        nextPage,
        previousPage,
    };
}
```

The Hook's consumers can rely on these callbacks retaining identity while their dependencies remain stable.

If stable identity is part of the intended API, it should be treated as an explicit design property rather than an
accidental implementation detail.

## Memoized Callbacks and Context

Callbacks are frequently exposed through Context.

```tsx
function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            logout,
        }),
        [user, logout]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
```

Here `useCallback` stabilizes the function while `useMemo` stabilizes the containing object.

The two optimizations solve different identity problems.

If `logout` were recreated on every render, the provider's memoized `value` would also change whenever the provider
rendered, defeating part of the value memoization.

This pattern is useful only when context value identity materially affects consumer updates.

Context partitioning can be more important than memoizing a large context value.

## Memoized Callbacks and External APIs

Some APIs use function identity to register and unregister handlers.

```tsx
function Component() {
    const handleResize = useCallback(() => {
        updateLayout();
    }, []);

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [handleResize]);

    return null;
}
```

The callback provides a stable handler identity for the subscription lifecycle.

However, the callback does not itself establish the subscription. The Effect owns synchronization with the external
system.

This distinction is important.

`useCallback` provides function identity.

The Effect provides external synchronization and cleanup.

## Memoized Callbacks and Event Listeners

Stable callback identity can be useful when an external API requires the same function reference for removal.

```tsx
const handler = useCallback((event: Event) => {
    handleEvent(event);
}, []);

useEffect(() => {
    target.addEventListener("event", handler);

    return () => {
        target.removeEventListener("event", handler);
    };
}, [target, handler]);
```

The identity relationship between registration and cleanup is explicit.

Nevertheless, callback memoization should not be introduced blindly. If the callback can be safely defined within the
Effect and does not need to exist elsewhere, the simpler design may be preferable.

## Memoized Callbacks and Stale Closures

A common error is deliberately minimizing dependencies to preserve identity.

```tsx
const handleSubmit = useCallback(() => {
    submit(formData);
}, []);
```

If `formData` changes, this callback can continue using an old value.

The desire for a stable callback must not override correctness.

Correctness comes first.

If the callback depends on changing data, that data belongs in the dependency relationship unless the callback can be
redesigned to obtain the current data through another correct mechanism.

## Reducing Dependencies Through Design

Sometimes a callback can be redesigned so that it requires fewer dependencies.

Instead of capturing state:

```tsx
const addItem = useCallback(() => {
    setItems([...items, createItem()]);
}, [items]);
```

use a functional update:

```tsx
const addItem = useCallback(() => {
    setItems(currentItems => [...currentItems, createItem()]);
}, []);
```

The callback no longer depends on the current `items` reference.

This is not merely a memoization trick. It is a more precise expression of the state transition.

The callback says that the new state depends on the previous state rather than on a particular render's captured state.

## Memoized Callbacks and Objects

A callback may depend on an object.

```tsx
const handleSearch = useCallback(() => {
    search(query, options);
}, [query, options]);
```

If `options` is recreated every render, the callback will also be recreated every render.

```tsx
const options = {
    caseSensitive: true,
};
```

If stable identity is actually required, the underlying object identity may need to be stabilized or the callback
dependency structure simplified.

Memoizing the callback cannot compensate for an intentionally unstable dependency.

## Memoized Callbacks and Primitive Dependencies

Primitive dependencies generally provide straightforward identity semantics.

```tsx
const handleSelect = useCallback(() => {
    selectItem(itemId);
}, [itemId]);
```

When `itemId` remains equal according to React's dependency comparison, the callback can retain its identity.

This makes primitive identifiers particularly convenient callback dependencies.

## Memoized Callbacks and Function Dependencies

Callbacks can themselves depend on other functions.

```tsx
function Component({onSave}: { onSave: (id: string) => void }) {
    const handleSave = useCallback(() => {
        onSave("document-1");
    }, [onSave]);

    return <button onClick={handleSave}>Save</button>;
}
```

If `onSave` changes identity, `handleSave` must also change because its behavior depends on the new function.

This demonstrates that callback stability is transitive through dependencies.

If an upstream callback is unstable, downstream memoized callbacks can also become unstable.

## Memoized Callbacks and Referential Stability

Referential stability is the broader property of preserving a value's identity across renders when its semantic inputs
have not changed.

`useCallback` is one mechanism for achieving referential stability specifically for functions.

Other mechanisms include:

* module-level functions
* stable functions supplied by React
* functions provided by stable external objects
* architectural changes that eliminate unnecessary function creation

Memoization should therefore not be treated as the only possible source of stable identity.

## Callback Memoization and Module-Level Functions

A function that does not depend on component-local values can sometimes be defined outside the component.

```tsx
function handleStaticAction() {
    performStaticAction();
}

function Component() {
    return <Button onClick={handleStaticAction}/>;
}
```

The function reference is shared rather than recreated by each component render.

This can be simpler than:

```tsx
function Component() {
    const handleAction = useCallback(() => {
        performStaticAction();
    }, []);

    return <Button onClick={handleAction}/>;
}
```

The module-level design is appropriate only when the function does not require component-local state, props, or
instance-specific resources.

Do not move a function outside the component merely to force stability if doing so obscures its required dependencies or
changes its intended ownership.

## Memoized Callbacks and Component Instance Ownership

A callback created with `useCallback` belongs to the component instance that created it.

```tsx
function Editor({id}: { id: string }) {
    const save = useCallback(() => {
        saveDocument(id);
    }, [id]);

    return <SaveButton onSave={save}/>;
}
```

Different instances of `Editor` have different callback references.

```tsx
<Editor id="a"/>
<Editor id="b"/>
```

The callback is therefore not a global singleton function.

Its identity and closure are local to its component instance.

## Memoized Callbacks and Component Identity

Because callback state belongs to the component instance, changing component identity can discard the previous memoized
callback.

If a component is replaced because its React identity changes, its Hook state and memoized values are also replaced.

Callback memoization therefore depends on component lifetime.

It should not be used as a mechanism for preserving a callback across unrelated component instances.

## Memoized Callbacks and Refs

Refs can sometimes provide stable access to changing values without recreating a callback, but this is a separate design
mechanism.

For example, a callback may need to remain stable while reading the latest mutable value through a ref.

```tsx
function Component({value}: { value: string }) {
    const valueRef = useRef(value);

    valueRef.current = value;

    const handleEvent = useCallback(() => {
        console.log(valueRef.current);
    }, []);

    return <Button onClick={handleEvent}/>;
}
```

This can be appropriate for specific event or integration architectures, but it changes the data-flow model.

The callback no longer captures a render-specific `value`; it reads mutable state through the ref.

This should be used deliberately because refs bypass React's normal reactive dependency model.

## Memoized Callbacks and External Stores

A callback can dispatch operations to an external store.

```tsx
function Component() {
    const increment = useCallback(() => {
        store.increment();
    }, []);

    return <button onClick={increment}>Increment</button>;
}
```

The callback does not own the external state.

The store remains the state owner.

The callback is merely a stable command function exposed to the component tree.

## Memoized Callbacks and Dependency Injection

Callbacks can also be created from injected dependencies.

```tsx
function Editor({documentService}: Props) {
    const save = useCallback(() => {
        documentService.save();
    }, [documentService]);

    return <SaveButton onSave={save}/>;
}
```

The callback depends on the injected service identity.

If the dependency changes, the callback changes.

This is particularly relevant when Context-based dependency injection provides scoped service instances.

Memoization does not change the ownership or lifetime of the injected dependency.

## Memoized Callbacks and Event Handlers

Not every event handler needs `useCallback`.

```tsx
function Button() {
    function handleClick() {
        console.log("clicked");
    }

    return <button onClick={handleClick}>Click</button>;
}
```

This is often the best implementation.

The function only needs to be memoized when its identity has a concrete consequence.

Do not introduce `useCallback` simply because a function is passed to an event prop.

React does not require event handlers to have stable identity.

## Memoized Callbacks and Performance

`useCallback` itself has a cost.

It introduces:

* dependency tracking
* retained function references
* additional Hook semantics
* additional code complexity
* another identity relationship to reason about

Therefore, replacing every inline function with `useCallback` does not automatically improve performance.

A callback optimization is meaningful when the stabilized identity prevents a more expensive downstream operation.

## Memoized Callbacks and Memory

A memoized callback retains the values captured by its closure.

```tsx
const handleAction = useCallback(() => {
    process(largeObject);
}, [largeObject]);
```

The callback's closure can keep the relevant captured references reachable while the callback remains retained.

This does not mean every callback creates a significant memory problem. It means that callback memoization is not free
and should be considered as a retention mechanism as well as an identity mechanism.

## Memoized Callbacks and Concurrent Rendering

React's rendering model allows rendering work to be started, interrupted, restarted, or abandoned.

A memoized callback should therefore be treated as a rendering value, not as an externally guaranteed execution event.

The callback itself should remain safe to create during rendering.

It should not perform side effects merely because the function is constructed.

Side effects belong to event handlers when they are event-driven, or to Effects when they represent external
synchronization.

## Memoized Callbacks and Server Rendering

A callback created during server rendering should not be treated as a persistent server-side function object.

Component-local Hook state and memoized references belong to the rendering instance.

They should not be used as application-wide registries, caches, or durable server state.

## Memoized Callbacks and Server Components

In architectures that distinguish server-executed and client-executed components, browser event handlers belong to the
client-interactive portion of the tree.

A server-rendered component cannot simply turn a server-local callback closure into a browser event handler.

The callback must belong to an appropriate client-side boundary when browser interaction is required.

The important distinction is between function identity inside a React rendering environment and the serialization or
transfer boundary between execution environments.

## Common Misuse

A common misuse is wrapping every callback in `useCallback`.

```tsx
const handleClick = useCallback(() => {
    console.log("clicked");
}, []);
```

If no consumer benefits from stable identity, this adds unnecessary complexity.

Another misuse is using an empty dependency array to force stability while the callback reads changing values.

```tsx
const handleSubmit = useCallback(() => {
    submit(formData);
}, []);
```

This prioritizes identity over correctness.

Another misuse is using `useCallback` to prevent the component itself from rendering. It does not do that.

Another is using `useCallback` to make a function execute faster. It does not.

Another is using callback memoization merely to satisfy an Effect dependency without understanding the underlying
synchronization model.

Another is assuming that stable callback identity is inherently beneficial. Stability matters only when a consumer uses
identity in a meaningful way.

Another is creating chains of memoized callbacks whose only purpose is to stabilize other memoized callbacks. This can
produce an unnecessarily complicated dependency graph.

## Advantages

Memoized callbacks can provide stable function identity across renders.

They can prevent unnecessary updates in memoized child components when callback props would otherwise change identity.

They can stabilize callback dependencies used by Effects and custom Hooks.

They can provide predictable identity guarantees as part of a reusable Hook or component API.

They can reduce unnecessary subscription churn when an external API requires stable handler identity.

## Disadvantages

Memoization adds dependency-management complexity.

Incorrect dependencies can create stale closures and incorrect behavior.

Memoizing callbacks that have no identity-sensitive consumers provides little or no benefit.

Callbacks retain their captured values, so unnecessary memoization can increase reference retention.

Large callback dependency graphs can make component behavior harder to reason about.

`useCallback` does not improve the computational complexity or execution speed of the callback itself.

## When to Use

Use memoized callbacks when:

* a memoized child receives the callback as a prop
* callback identity affects whether downstream work occurs
* a custom Hook intentionally exposes stable callback identity
* an external integration requires stable handler identity
* a callback participates in a dependency relationship where stable identity is meaningful
* a provider needs stable callback references as part of a carefully designed context value

## When Not to Use

Do not use `useCallback` merely because:

* a function is defined inside a component
* a function is an event handler
* a function is passed as a prop
* a component renders frequently
* the function is short
* you want to make the function execute faster
* you want to prevent the parent component from rendering
* you want to avoid declaring a real dependency
* you want to make stale data appear current

If callback identity has no meaningful downstream consequence, a normal function is generally clearer.

## Relationship to Other Patterns

Memoized callbacks are distinct from memoized values. `useCallback` preserves function identity, while `useMemo` caches
a calculated result.

They are distinct from memoized components. `useCallback` does not prevent its owner from rendering; `memo` can allow a
component to skip rendering when its props remain equivalent.

They are closely related to referential stability because callback memoization is specifically a mechanism for
stabilizing function references.

They interact with custom Hooks because Hook APIs may intentionally guarantee stable callback identity.

They interact with Context because stable callback references can contribute to stable provider values, although context
partitioning remains a separate architectural concern.

They interact with Effects because callback identity can participate in Effect dependencies, but callback memoization
does not replace Effect synchronization.

They interact with external stores and dependency injection because callbacks can dispatch operations through externally
owned dependencies, while those dependencies remain responsible for their own state and lifecycle.

They interact with component identity because a memoized callback belongs to the component instance that created it and
is therefore discarded when that instance is replaced.

They interact with refs because refs can provide another way to access changing values from a stable callback, but this
changes the reactive data-flow model.

They interact with event handling because event handlers are common callback values, but event handlers do not
inherently require memoization.

## Design Rules

Treat callback memoization as an identity optimization, not an execution optimization.

Keep callbacks correct before making them stable.

Declare the values that determine the callback's behavior.

Use functional state updates when they naturally eliminate unnecessary state dependencies.

Memoize callbacks when a concrete consumer benefits from stable identity.

Do not use `useCallback` to prevent component renders.

Do not use an empty dependency list to conceal changing dependencies.

Do not memoize callbacks merely to satisfy tooling without understanding why the dependency exists.

Consider whether moving a dependency or calculation inside an Effect produces a simpler design.

Consider module-level functions when a callback has no component-local dependencies.

Treat stable callback identity as an explicit API property when consumers are expected to rely on it.

Avoid chains of unnecessary callback memoization.

## Summary

A memoized callback is a function whose reference can remain stable across renders while its dependencies remain
unchanged.

React's `useCallback` provides this mechanism. Its purpose is to preserve function identity, not to cache return values
or make function execution faster.

The primary use cases are identity-sensitive consumers such as memoized child components, custom Hook APIs, Effects,
context values, and external integrations that register handlers by reference.

The correct design is to use ordinary functions by default, introduce `useCallback` when stable identity has a concrete
architectural or performance consequence, maintain accurate dependencies, and never sacrifice behavioral correctness
merely to preserve a function reference.
