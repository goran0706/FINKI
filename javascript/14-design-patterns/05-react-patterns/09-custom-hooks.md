# Custom Hooks Pattern

Custom Hooks are a React composition pattern for extracting and reusing stateful logic from function components. A
Custom Hook is a JavaScript function whose name begins with `use` and which may call other Hooks according to the Rules
of Hooks.

The defining characteristic is that the abstraction shares behavior and stateful logic without sharing a component
instance or prescribing a rendered UI.

```tsx
function useToggle(initialValue = false) {
    const [value, setValue] = React.useState(initialValue);

    const toggle = React.useCallback(() => {
        setValue((current) => !current);
    }, []);

    return {
        value,
        toggle,
    };
}
```

A component consumes the Hook and remains responsible for rendering:

```tsx
function Example() {
    const {value, toggle} = useToggle();

    return (
        <button onClick={toggle}>
            {value ? "Enabled" : "Disabled"}
        </button>
    );
}
```

The Hook contains the reusable behavior. The component contains the presentation.

## Intent

Use the Custom Hooks pattern when multiple components need the same stateful behavior, synchronization logic, event
handling, derived state, or other React-specific logic without requiring them to share a rendered component structure.

The primary separation is between behavior and presentation.

A Custom Hook can encapsulate:

* local state;
* derived state;
* effects;
* subscriptions;
* event handling;
* browser APIs;
* asynchronous operations;
* reusable interaction logic;
* coordination between multiple Hooks.

The Hook should expose a deliberate behavioral API rather than the implementation details of its internal Hooks.

## Core Structure

A Custom Hook is an ordinary function that composes React Hooks.

```tsx
function useCounter(initialValue = 0) {
    const [count, setCount] = React.useState(initialValue);

    const increment = React.useCallback(() => {
        setCount((value) => value + 1);
    }, []);

    const decrement = React.useCallback(() => {
        setCount((value) => value - 1);
    }, []);

    return {
        count,
        increment,
        decrement,
    };
}
```

The Hook does not render anything.

```tsx
function Counter() {
    const {
        count,
        increment,
        decrement,
    } = useCounter();

    return (
        <div>
            <button onClick={decrement}>-</button>
            <span>{count}</span>
            <button onClick={increment}>+</button>
        </div>
    );
}
```

Another component can reuse exactly the same behavior with completely different presentation.

```tsx
function CompactCounter() {
    const {count, increment} = useCounter();

    return (
        <button onClick={increment}>
            Count: {count}
        </button>
    );
}
```

The two components do not share state. Each invocation of the Hook creates state associated with the component instance
that invoked it.

## Hook Invocation Creates Independent State

Calling the same Custom Hook from different components does not create a shared singleton.

```tsx
function FirstCounter() {
    const counter = useCounter();

    // independent state
}

function SecondCounter() {
    const counter = useCounter();

    // independent state
}
```

Each component receives its own Hook state.

This distinction is fundamental. Custom Hooks provide code reuse and stateful behavior reuse, not automatic state
sharing.

If state itself must be shared between components, use an appropriate state-sharing mechanism such as lifted state,
Context, or an external store.

## Rules of Hooks

Custom Hooks are subject to the same Rules of Hooks as built-in Hooks.

Hooks must be called:

* at the top level of a function component;
* at the top level of a Custom Hook;
* in a consistent order across renders.

Do not call Hooks conditionally:

```tsx
function useUser(enabled: boolean) {
    if (enabled) {
        const user = useCurrentUser();
        return user;
    }

    return null;
}
```

Instead, keep Hook invocation unconditional and move the conditional behavior into the Hook's logic.

```tsx
function useUser(enabled: boolean) {
    const user = useCurrentUser();

    return enabled ? user : null;
}
```

The important property is that the Hook call sequence remains stable.

## Naming

Custom Hook names must begin with `use`.

```tsx
function useOnlineStatus() {
    // ...
}
```

The naming convention communicates that the function participates in the Rules of Hooks.

A function that does not call Hooks does not need to be a Custom Hook simply because it is reusable.

```tsx
function formatUserName(user: User) {
    return `${user.firstName} ${user.lastName}`;
}
```

This is an ordinary utility function, not a Hook.

Avoid unnecessarily wrapping pure functions in Custom Hooks.

## Encapsulating State

Custom Hooks are useful when state and its associated transitions form a reusable behavioral abstraction.

```tsx
function useDisclosure(initialOpen = false) {
    const [open, setOpen] = React.useState(initialOpen);

    const openDisclosure = React.useCallback(() => {
        setOpen(true);
    }, []);

    const closeDisclosure = React.useCallback(() => {
        setOpen(false);
    }, []);

    const toggleDisclosure = React.useCallback(() => {
        setOpen((value) => !value);
    }, []);

    return {
        open,
        openDisclosure,
        closeDisclosure,
        toggleDisclosure,
    };
}
```

The Hook establishes the state model and exposes meaningful operations.

The consumer does not need to know whether the implementation uses `useState`, a reducer, or another mechanism.

## Encapsulating Effects

A Custom Hook can isolate synchronization with an external system.

```tsx
function useDocumentTitle(title: string) {
    React.useEffect(() => {
        document.title = title;
    }, [title]);
}
```

The component only expresses its intent:

```tsx
function UserPage({user}: { user: User }) {
    useDocumentTitle(user.name);

    return <Profile user={user}/>;
}
```

This keeps synchronization logic out of the component while preserving the component's responsibility for deciding when
and why the behavior is needed.

Custom Hooks are therefore useful for creating semantic interfaces over Effects.

## Encapsulating Event Subscriptions

Browser and application event subscriptions are another natural use case.

```tsx
function useWindowSize() {
    const [size, setSize] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    React.useEffect(() => {
        function handleResize() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return size;
}
```

The component consuming the Hook does not need to manage the subscription lifecycle itself.

```tsx
function Layout() {
    const {width, height} = useWindowSize();

    return (
        <p>
            {width} × {height}
        </p>
    );
}
```

The Hook owns the subscription resource and its cleanup.

## Encapsulating External Systems

Custom Hooks can provide React-facing interfaces to imperative browser or application APIs.

```tsx
function useGeolocation() {
    const [position, setPosition] =
        React.useState<GeolocationPosition | null>(null);

    const [error, setError] =
        React.useState<GeolocationPositionError | null>(null);

    React.useEffect(() => {
        const watchId =
            navigator.geolocation.watchPosition(
                setPosition,
                setError,
            );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return {
        position,
        error,
    };
}
```

The Hook acts as an integration boundary between React's rendering model and an external imperative system.

The external system remains the source of truth for the behavior being synchronized.

## Derived State

A Custom Hook can expose values derived from internal or supplied state.

```tsx
function usePagination(
    totalItems: number,
    pageSize: number,
) {
    const [page, setPage] = React.useState(0);

    const pageCount = Math.ceil(
        totalItems / pageSize,
    );

    const canGoPrevious = page > 0;
    const canGoNext = page < pageCount - 1;

    return {
        page,
        pageCount,
        canGoPrevious,
        canGoNext,
        nextPage: () =>
            setPage((value) => value + 1),
        previousPage: () =>
            setPage((value) => value - 1),
    };
}
```

Derived values should generally be calculated directly rather than stored as independent state when they can be derived
reliably from existing state.

A Custom Hook can enforce that invariant for all consumers.

## Encapsulating Asynchronous Behavior

Custom Hooks can coordinate asynchronous state.

```tsx
type AsyncState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: Error };

function useAsync<T>(
    operation: () => Promise<T>,
) {
    const [state, setState] =
        React.useState<AsyncState<T>>({
            status: "idle",
        });

    const execute = React.useCallback(async () => {
        setState({status: "loading"});

        try {
            const data = await operation();

            setState({
                status: "success",
                data,
            });
        } catch (error) {
            setState({
                status: "error",
                error:
                    error instanceof Error
                        ? error
                        : new Error(String(error)),
            });
        }
    }, [operation]);

    return {
        state,
        execute,
    };
}
```

The Hook can encapsulate the state machine surrounding the asynchronous operation while the component decides how the
states are rendered.

Production implementations may additionally require cancellation, request identity, race handling, retries, caching, or
integration with a server-state library. Those concerns should not be hidden behind an overly generic `useAsync`
abstraction unless they are genuinely part of its contract.

## Composing Custom Hooks

Custom Hooks can compose other Custom Hooks.

```tsx
function useAuthenticatedUser() {
    const user = useCurrentUser();
    const permissions = usePermissions(user);

    return {
        user,
        permissions,
        authenticated: user !== null,
    };
}
```

A higher-level Hook can therefore establish a reusable behavioral abstraction from lower-level Hooks.

```tsx
function Dashboard() {
    const {
        user,
        permissions,
    } = useAuthenticatedUser();

    return (
        <DashboardView
            user={user}
            permissions={permissions}
        />
    );
}
```

This composition allows domain-specific Hooks to be built from smaller behavioral primitives.

## Returning State and Operations

A Hook's return value should form a coherent API.

For simple state:

```tsx
function useToggle() {
    const [enabled, setEnabled] = React.useState(false);

    return [enabled, setEnabled] as const;
}
```

For more complex behavior, an object can communicate the API more explicitly:

```tsx
function useModal() {
    const [open, setOpen] = React.useState(false);

    return {
        open,
        openModal: () => setOpen(true),
        closeModal: () => setOpen(false),
    };
}
```

The API should expose domain-level operations where appropriate.

Returning raw setters everywhere can leak the implementation model:

```tsx
return {
    state,
    setState,
};
```

A domain-specific operation can better preserve invariants:

```tsx
return {
    state,
    submit,
    reset,
    retry,
};
```

The appropriate choice depends on whether the Hook is intended to be a low-level primitive or a higher-level domain
abstraction.

## API Design

A Custom Hook should have a narrow and stable contract.

Avoid returning internal implementation details simply because they are available.

```tsx
function useFeature() {
    const [state, setState] = React.useState(...);
    const internalRef = React.useRef(...);

    return {
        state,
        setState,
        internalRef,
    };
}
```

Prefer exposing only what consumers actually need.

```tsx
function useFeature() {
    // internal implementation

    return {
        value,
        reset,
        submit,
    };
}
```

This reduces coupling between consumers and the Hook's implementation.

## Input Stability

Hook arguments can affect effects, memoization, subscriptions, and asynchronous operations.

Consider:

```tsx
function useSearch(options: SearchOptions) {
    React.useEffect(() => {
        // perform search
    }, [options]);
}
```

If the consumer creates a new object on every render:

```tsx
useSearch({
    query,
    limit: 20,
});
```

the object identity changes on every render.

The Hook should therefore define its input contract carefully. Depending on the API, primitive arguments may be
preferable:

```tsx
useSearch(query, 20);
```

or the Hook can intentionally derive the relevant values:

```tsx
function useSearch({
                       query,
                       limit,
                   }: SearchOptions) {
    React.useEffect(() => {
        // perform search
    }, [query, limit]);
}
```

A Hook should not rely on referential stability unless that stability is explicitly part of its contract.

## Callback Stability

Custom Hooks frequently return functions.

```tsx
function useCounter() {
    const [count, setCount] = React.useState(0);

    const increment = React.useCallback(() => {
        setCount((value) => value + 1);
    }, []);

    return {
        count,
        increment,
    };
}
```

`useCallback` can make the returned function identity stable.

However, stable identity is not inherently required for every returned callback. Memoization should be introduced when
it provides a meaningful benefit or is required by the Hook's API contract.

Overusing `useCallback` adds complexity without necessarily improving performance.

## Resource Ownership

When a Custom Hook acquires an external resource, it should generally own the corresponding lifecycle.

```tsx
function useSubscription(
    subscribe: (listener: () => void) => () => void,
) {
    React.useEffect(() => {
        const unsubscribe = subscribe(() => {
            // handle update
        });

        return unsubscribe;
    }, [subscribe]);
}
```

The Hook establishes the subscription and returns its cleanup through the Effect.

This principle applies to:

* event listeners;
* timers;
* observers;
* subscriptions;
* sockets;
* workers;
* external connections.

The consumer should not need to know how the resource is acquired or released unless ownership is intentionally part of
the public API.

## Cleanup

A Hook that creates an Effect resource must clean it up when appropriate.

```tsx
function useInterval(
    callback: () => void,
    delay: number | null,
) {
    React.useEffect(() => {
        if (delay === null) {
            return;
        }

        const id = window.setInterval(
            callback,
            delay,
        );

        return () => {
            window.clearInterval(id);
        };
    }, [callback, delay]);
}
```

Cleanup prevents resources from surviving beyond the lifecycle for which they are needed.

The Hook should also account for changing dependencies. Cleanup is not only about unmounting; React may clean up an
existing Effect before re-running it with new dependencies.

## Cancellation

Asynchronous Custom Hooks may need cancellation semantics.

```tsx
function useUser(userId: string) {
    const [user, setUser] =
        React.useState<User | null>(null);

    React.useEffect(() => {
        const controller = new AbortController();

        fetch(`/api/users/${userId}`, {
            signal: controller.signal,
        })
            .then((response) => response.json())
            .then(setUser)
            .catch((error) => {
                if (error.name !== "AbortError") {
                    throw error;
                }
            });

        return () => {
            controller.abort();
        };
    }, [userId]);

    return user;
}
```

The important design issue is not simply aborting the request. The Hook must define what happens when the operation is
cancelled, superseded, or completes after the consuming component no longer needs the result.

For complex asynchronous coordination, a dedicated state machine or data-fetching/cache abstraction may be more
appropriate than a generic Hook.

## State Machines Inside Hooks

A Custom Hook can encapsulate a state machine when a behavior has multiple mutually exclusive states and explicit
transitions.

```tsx
type State =
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success" }
    | { status: "error"; error: Error };
```

The Hook can then expose operations while hiding the transition implementation.

```tsx
function useSubmission() {
    const [state, dispatch] =
        React.useReducer(reducer, {
            status: "idle",
        });

    async function submit() {
        dispatch({type: "submit"});

        try {
            await save();
            dispatch({type: "success"});
        } catch (error) {
            dispatch({
                type: "error",
                error: error instanceof Error
                    ? error
                    : new Error(String(error)),
            });
        }
    }

    return {
        state,
        submit,
    };
}
```

The Hook provides a domain-specific interface while the reducer owns transition logic.

## Context Integration

Custom Hooks can provide a safer API over Context.

```tsx
const UserContext =
    React.createContext<User | null>(null);

function useUser() {
    const user = React.useContext(UserContext);

    if (user === null) {
        throw new Error(
            "useUser must be used within UserProvider",
        );
    }

    return user;
}
```

Consumers now use:

```tsx
function Profile() {
    const user = useUser();

    return <h1>{user.name}</h1>;
}
```

This is a useful pattern because the Hook centralizes the Context consumption contract and can enforce provider
requirements.

The Context Provider itself remains a separate concern.

## External Store Integration

A Custom Hook can encapsulate access to an external state store.

```tsx
function useCartTotal() {
    return useSyncExternalStore(
        cartStore.subscribe,
        cartStore.getTotal,
    );
}
```

Consumers do not need to understand the underlying subscription mechanism.

```tsx
function CartSummary() {
    const total = useCartTotal();

    return <span>{total}</span>;
}
```

This creates a React-facing abstraction over an external source of truth.

For complex stores, selector semantics, subscription behavior, and consistency guarantees should be defined explicitly
rather than hidden behind arbitrary Hook wrappers.

## TypeScript

Custom Hooks should expose precise input and output types.

```tsx
type UseToggleResult = {
    value: boolean;
    toggle: () => void;
    enable: () => void;
    disable: () => void;
};

function useToggle(
    initialValue = false,
): UseToggleResult {
    const [value, setValue] =
        React.useState(initialValue);

    return {
        value,
        toggle: () =>
            setValue((current) => !current),
        enable: () => setValue(true),
        disable: () => setValue(false),
    };
}
```

Generic Hooks can preserve type information across their API.

```tsx
function usePrevious<T>(value: T): T | undefined {
    const ref = React.useRef<T>();

    React.useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}
```

The generic type is inferred from the argument.

For domain-specific Hooks, explicit result types can improve API documentation and make contract changes easier to
detect.

## Testing

Custom Hooks should be tested according to their observable behavior.

A Hook test should verify:

* initial state;
* state transitions;
* returned operations;
* effect synchronization;
* cleanup;
* error behavior;
* asynchronous behavior;
* interaction with external resources where applicable.

The exact testing mechanism depends on the React testing stack, but the fundamental principle is to test the Hook as a
consumer-facing behavioral abstraction rather than testing its internal Hook calls.

For example, a toggle Hook should be tested by observing the returned state after invoking `toggle`, not by asserting
that it internally called `useState`.

## Custom Hooks and Component Composition

Component Composition combines rendered components.

```tsx
<Card>
    <UserProfile/>
</Card>
```

Custom Hooks compose behavior.

```tsx
function UserProfile() {
    const user = useUser();
    const permissions = usePermissions(user);

    return (
        <Profile
            user={user}
            permissions={permissions}
        />
    );
}
```

Composition determines how UI pieces are assembled. Custom Hooks determine how reusable React behavior is assembled.

The two patterns are complementary rather than competing.

## Custom Hooks and Render Props

Render Props share behavior through a component that invokes a consumer-provided rendering function.

```tsx
<MouseTracker>
    {(position) => (
        <Coordinates position={position}/>
    )}
</MouseTracker>
```

A Custom Hook shares the behavior directly:

```tsx
function Coordinates() {
    const position = useMousePosition();

    return <CoordinatesView position={position}/>;
}
```

Custom Hooks are generally preferable when the reusable concern is primarily stateful logic.

Render Props remain useful when the rendering function itself is an important part of the API and the abstraction should
explicitly control when and with what values rendering occurs.

## Custom Hooks and Higher-Order Components

A Higher-Order Component transforms a component:

```tsx
const Enhanced = withAuthentication(Component);
```

A Custom Hook provides reusable behavior to a component:

```tsx
function Component() {
    const authentication = useAuthentication();

    // ...
}
```

HOCs introduce a wrapper component and therefore a component transformation boundary.

Custom Hooks do not introduce another rendered component. They compose behavior inside the component that invokes them.

For modern function-component code, this often makes Hooks the simpler choice for behavior reuse.

## Custom Hooks and Context

Context provides shared values through the component tree.

A Custom Hook can consume Context but does not itself create shared state merely by existing.

```tsx
function useTheme() {
    return React.useContext(ThemeContext);
}
```

The Provider establishes the shared value. The Hook provides a convenient consumer API.

This distinction matters because a Hook should not be mistaken for a state-sharing mechanism.

## Common Misuses

Do not use a Custom Hook for a pure calculation that does not require React state or lifecycle semantics.

Do not use a Custom Hook merely to shorten a component by moving arbitrary JSX-related code into another function. If
the abstraction produces UI, a component may be the more appropriate boundary.

Do not assume that invoking a Hook shares state between callers. Each invocation is associated with the component
instance performing that invocation.

Do not expose every internal state value and setter. Define a deliberate behavioral contract.

Do not hide substantial unrelated responsibilities inside a single "god Hook." A Hook should have a coherent purpose.

Do not use Effects simply because a behavior is reusable. Effects are appropriate for synchronization with external
systems, not as a generic mechanism for derived computations.

Do not overuse memoization. Stable function or object identity should be introduced when it has an identifiable purpose.

Do not create asynchronous abstractions without defining cancellation, race, error, and ownership semantics when those
concerns are relevant.

## Advantages

Custom Hooks provide direct composition of reusable React behavior without introducing additional component layers.

They allow each consumer to retain control over its rendering while sharing the same stateful implementation.

They also provide a natural abstraction boundary around Effects, subscriptions, browser APIs, external stores, and
domain-specific state transitions.

Because Hooks are ordinary functions from the perspective of JavaScript composition, they can be combined into
higher-level behavioral abstractions.

## Disadvantages

Custom Hooks are coupled to React's Hook execution model and therefore cannot be treated as arbitrary reusable utility
functions.

They can also become difficult to understand when a single Hook coordinates too many unrelated effects, state variables,
subscriptions, and asynchronous operations.

Poorly designed Hooks can hide important lifecycle behavior from consumers. A Hook that silently performs network
requests, subscribes to external resources, mutates global state, and manages local state simultaneously has an overly
broad contract.

Hooks can additionally make dependency management more subtle because Effects and memoized values depend on the
identities of their inputs.

## When to Use

Use a Custom Hook when:

* multiple components need the same stateful behavior;
* reusable logic depends on React state or lifecycle semantics;
* browser or external-system integration needs a React-facing abstraction;
* subscription setup and cleanup should be encapsulated;
* domain-specific state transitions should be reused;
* consumers should retain complete control over rendering.

Prefer a component when:

* the abstraction primarily defines UI structure;
* the behavior is inseparable from a specific rendered representation;
* composition through children or Slots is clearer.

Prefer a Render Prop when:

* the rendering callback itself is a deliberate part of the abstraction;
* the provider must explicitly control rendering through a supplied function.

Prefer a Higher-Order Component when:

* the desired abstraction is component transformation;
* a reusable enhancement should be applied declaratively to existing components.

Prefer Context or an external store when:

* the state itself must be shared across component instances;
* multiple descendants need access to the same source of truth.

## Relationship to the React Architecture

Custom Hooks occupy the behavioral composition layer of a React application.

A component owns rendering. A Custom Hook can own reusable stateful behavior and synchronization logic. Context or
external stores can provide shared state. Components then combine those behaviors into a concrete UI.

The important boundary is that a Custom Hook does not define a visual component. It defines a reusable React behavior
contract.

```tsx
function UserPanel() {
    const user = useUser();
    const online = useOnlineStatus();
    const {
        open,
        openModal,
        closeModal,
    } = useModal();

    return (
        <Panel>
            <UserStatus
                user={user}
                online={online}
            />

            <button onClick={openModal}>
                Details
            </button>

            {open && (
                <UserModal
                    user={user}
                    onClose={closeModal}
                />
            )}
        </Panel>
    );
}
```

Each Hook encapsulates a coherent behavioral concern. The component remains responsible for deciding how those concerns
become UI.

The defining property of the Custom Hooks pattern is therefore behavioral composition without component transformation
or shared rendering.
