# Effect Synchronization

The Effect Synchronization pattern uses React Effects to synchronize a component with systems that exist outside React's
rendering model. An Effect is appropriate when rendering the component must be followed by an interaction with an
external system such as a browser API, DOM API, subscription, timer, network connection, third-party library, or other
imperative resource.

The central idea is that rendering describes the desired React UI, while an Effect reconciles that rendered state with
something React does not control directly.

```tsx
function ChatRoom({roomId}: { roomId: string }) {
    useEffect(() => {
        const connection = createConnection(roomId);

        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [roomId]);

    return <div>Chat room: {roomId}</div>;
}
```

The Effect does not exist to calculate the rendered output. React already performs that work during rendering. The
Effect exists because the component has an external synchronization obligation.

## Intent

Use an Effect when a component needs to synchronize an external system with the current committed React state or props.

The pattern separates two responsibilities:

1. Rendering determines what React should display.
2. Effects synchronize external state with the result of rendering.

An Effect therefore represents a synchronization relationship rather than a generic post-render callback.

## The External System

The defining characteristic of an Effect is the presence of something outside React's declarative rendering model.

Common external systems include:

* DOM APIs not represented directly by JSX.
* Browser APIs such as `document.title`, media APIs, observers, and event targets.
* Timers and intervals.
* WebSocket or other persistent connections.
* Third-party imperative UI libraries.
* External stores and subscriptions.
* Network synchronization when it is genuinely tied to an external resource lifecycle.
* Browser capabilities such as geolocation or notifications.
* Non-React resources that require setup and teardown.

For example:

```tsx
function DocumentTitle({title}: { title: string }) {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
}
```

`document.title` is not React state and React does not manage it through JSX. The Effect bridges the declarative React
state and the imperative browser API.

By contrast, this does not require an Effect:

```tsx
function Greeting({name}: { name: string }) {
    return <h1>Hello, {name}</h1>;
}
```

There is no external system to synchronize. The value can be derived during rendering.

## Synchronization Rather Than Lifecycle

Effects are frequently described as lifecycle mechanisms because they execute after React commits an update. That
description is incomplete and often leads to incorrect designs.

An Effect should primarily be understood as a synchronization process.

```tsx
useEffect(() => {
    externalSystem.setValue(value);
}, [value]);
```

The dependency array describes which reactive values determine the synchronization. When those values change, React
re-runs the synchronization.

The important question is therefore not:

> "Which lifecycle event should this code run after?"

The more useful question is:

"Which external system needs to be synchronized with which reactive values?"

This framing prevents Effects from becoming arbitrary containers for application logic.

## Render Phase and Effect Phase

React rendering is intended to remain free of side effects that mutate external systems.

```tsx
function Component({value}: { value: string }) {
    externalSystem.setValue(value);

    return <div>{value}</div>;
}
```

This is problematic because rendering may occur without the result being committed, may be restarted, or may occur more
than once during development.

The synchronization belongs in an Effect:

```tsx
function Component({value}: { value: string }) {
    useEffect(() => {
        externalSystem.setValue(value);
    }, [value]);

    return <div>{value}</div>;
}
```

The distinction is:

```text
render -> describe UI
commit -> React commits the UI
effect -> synchronize external system
```

The exact execution scheduling depends on the type of Effect and React's rendering environment, but the architectural
distinction remains: rendering computes React output; Effects interact with external systems.

## Reactive Dependencies

An Effect closes over values from its component scope. Those values determine when the synchronization may need to be
recalculated.

```tsx
function ChatRoom({
                      roomId,
                      serverUrl,
                  }: {
    roomId: string;
    serverUrl: string;
}) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);

        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [serverUrl, roomId]);

    return <div>Connected to {roomId}</div>;
}
```

Both `serverUrl` and `roomId` participate in the synchronization. If either changes, the existing synchronization is no
longer necessarily valid.

A dependency is not merely a scheduling preference. It expresses the reactive values on which the Effect's
synchronization logic depends.

## Dependency Correctness

An Effect should account for the reactive values it reads.

This is incomplete:

```tsx
function ChatRoom({
                      serverUrl,
                      roomId,
                  }: {
    serverUrl: string;
    roomId: string;
}) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);

        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [roomId]);

    return <div>{roomId}</div>;
}
```

The Effect reads `serverUrl`, but the dependency list does not represent that dependency.

The synchronization may therefore continue using an obsolete server URL.

The correct relationship is:

```tsx
useEffect(() => {
    const connection = createConnection(serverUrl, roomId);

    connection.connect();

    return () => {
        connection.disconnect();
    };
}, [serverUrl, roomId]);
```

React's Hooks linting rules can detect many cases where dependencies are omitted.

## Empty Dependency Arrays

An empty dependency array means that the Effect does not react to changing values from the component scope.

```tsx
useEffect(() => {
    initializeAnalytics();
}, []);
```

This is appropriate only when the synchronization genuinely has no changing reactive inputs.

It should not be used merely to force code to execute once.

For example:

```tsx
function UserProfile({userId}: { userId: string }) {
    useEffect(() => {
        loadUser(userId);
    }, []);
}
```

This incorrectly treats `userId` as though it were constant.

The relevant question is not "Do I want this to run once?" but "Does this synchronization have any reactive
dependencies?"

## Effects and Derived Data

Derived values should generally be calculated during rendering rather than stored through an Effect.

Avoid:

```tsx
function UserName({
                      firstName,
                      lastName,
                  }: {
    firstName: string;
    lastName: string;
}) {
    const [fullName, setFullName] = useState("");

    useEffect(() => {
        setFullName(`${firstName} ${lastName}`);
    }, [firstName, lastName]);

    return <div>{fullName}</div>;
}
```

The value is entirely derived from props.

Prefer:

```tsx
function UserName({
                      firstName,
                      lastName,
                  }: {
    firstName: string;
    lastName: string;
}) {
    const fullName = `${firstName} ${lastName}`;

    return <div>{fullName}</div>;
}
```

Using an Effect here introduces an unnecessary render and creates an intermediate state in which the stored value can
lag behind the inputs.

Effects are for synchronization with external systems, not for ordinary data derivation.

## Effects and Event Handlers

Event handlers are appropriate when an operation is caused by a specific user interaction.

```tsx
function CheckoutButton({orderId}: { orderId: string }) {
    const handleClick = () => {
        submitOrder(orderId);
    };

    return <button onClick={handleClick}>Checkout</button>;
}
```

Moving this into an Effect is usually a semantic mistake:

```tsx
useEffect(() => {
    if (submitted) {
        submitOrder(orderId);
    }
}, [submitted, orderId]);
```

The operation is caused by a user action, not by the component entering a particular synchronization state.

The distinction is:

* Event handler: "the user performed this action."
* Effect: "the external system must be synchronized with this committed reactive state."

Effects should not be used as indirect event handlers.

## Synchronizing a Subscription

Subscriptions are a canonical Effect use case.

```tsx
function OnlineStatus() {
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return <div>{online ? "Online" : "Offline"}</div>;
}
```

The Effect establishes a relationship with the browser's event system. The cleanup removes that relationship when the
synchronization is no longer active.

For external stores, React provides `useSyncExternalStore`, which is specifically designed for integrating external
state stores with React. Such integration should generally use that API rather than implementing a store subscription
manually through an Effect.

## Synchronizing an Imperative Library

Effects can establish synchronization with libraries that expose imperative APIs.

```tsx
function MapView({
                     center,
                     zoom,
                 }: {
    center: [number, number];
    zoom: number;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const map = createMap(containerRef.current);

        return () => {
            map.destroy();
        };
    }, []);

    useEffect(() => {
        map.setCenter(center);
        map.setZoom(zoom);
    }, [center, zoom]);

    return <div ref={containerRef}/>;
}
```

The first Effect establishes the external resource. The second synchronizes its mutable state.

This separation is useful when resource lifetime and resource configuration have different dependencies.

## Resource Lifetime and Synchronization

An Effect may both establish a resource and synchronize it.

```tsx
useEffect(() => {
    const connection = createConnection(roomId);

    connection.connect();

    return () => {
        connection.disconnect();
    };
}, [roomId]);
```

When `roomId` changes, React conceptually performs:

1. Cleanup of the previous synchronization.
2. Setup of the new synchronization.

The old resource must no longer represent the current `roomId`.

This makes Effect cleanup part of synchronization correctness rather than merely an optimization.

## Cleanup

An Effect can return a cleanup function:

```tsx
useEffect(() => {
    const subscription = subscribe();

    return () => {
        subscription.unsubscribe();
    };
}, []);
```

Cleanup should undo or invalidate what the Effect established.

Typical cleanup operations include:

* Removing event listeners.
* Unsubscribing from subscriptions.
* Disconnecting sockets.
* Disconnecting observers.
* Clearing timers.
* Destroying third-party resources.
* Releasing resource handles.
* Cancelling or invalidating asynchronous work when appropriate.

Cleanup belongs to the Effect that establishes the corresponding resource relationship.

Detailed resource cleanup and cancellation are separate concerns from the basic synchronization pattern and should be
treated independently when the lifecycle semantics become complex.

## Re-Synchronization

Effects may execute multiple times during a component's lifetime.

Consider:

```tsx
function VideoPlayer({
                         src,
                         playing,
                     }: {
    src: string;
    playing: boolean;
}) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = ref.current;

        if (!video) {
            return;
        }

        if (playing) {
            video.play();
        } else {
            video.pause();
        }
    }, [playing]);

    return <video ref={ref} src={src}/>;
}
```

The Effect does not represent a one-time lifecycle event. It establishes the relationship:

"Whenever `playing` changes, synchronize the video element's playback state with it."

If `playing` changes from `true` to `false`, the synchronization runs again.

## Idempotent Synchronization

Effect logic should ideally tolerate being established, cleaned up, and established again without accumulating
unintended external state.

For example:

```tsx
useEffect(() => {
    const handleResize = () => {
        updateLayout();
    };

    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
    };
}, []);
```

The setup adds exactly one listener and cleanup removes exactly that listener.

A problematic Effect might instead continually accumulate resources:

```tsx
useEffect(() => {
    window.addEventListener("resize", updateLayout);
}, []);
```

There is no corresponding teardown.

Synchronization logic should have a well-defined setup and teardown boundary.

## Strict Mode and Effect Correctness

Development Strict Mode can expose Effects that do not correctly model resource ownership by intentionally exercising
setup and cleanup behavior more aggressively.

An Effect should therefore not rely on "this only happens once" as an implicit correctness guarantee.

For example:

```tsx
useEffect(() => {
    const connection = createConnection(roomId);

    connection.connect();

    return () => {
        connection.disconnect();
    };
}, [roomId]);
```

This is robust because every setup has a corresponding cleanup.

By contrast:

```tsx
useEffect(() => {
    globalConnections.push(createConnection(roomId));
}, [roomId]);
```

creates accumulating external state without defining ownership or teardown.

The solution is not to suppress Effect execution. The solution is to make the synchronization correctly reversible.

## Referential Dependencies

Objects, arrays, and functions created during rendering may have a new identity on every render.

```tsx
function Component({roomId}: { roomId: string }) {
    const options = {
        roomId,
    };

    useEffect(() => {
        connect(options);
    }, [options]);

    return null;
}
```

`options` may be a new object every render, causing the Effect to re-synchronize unnecessarily.

If the external system only depends on `roomId`, synchronize directly from that value:

```tsx
useEffect(() => {
    const options = {roomId};

    connect(options);
}, [roomId]);
```

The dependency should represent the semantic synchronization inputs rather than incidental object identity.

Memoization can sometimes stabilize identities, but it should not be used merely to conceal an incorrectly structured
Effect.

## Stable External APIs

Some external APIs require stable callback identities.

```tsx
function Component() {
    const handleMessage = useCallback((message: Message) => {
        processMessage(message);
    }, []);

    useEffect(() => {
        socket.on("message", handleMessage);

        return () => {
            socket.off("message", handleMessage);
        };
    }, [handleMessage]);

    return null;
}
```

The callback identity used for subscription and unsubscription is the same.

However, callback stabilization should follow the subscription contract rather than being applied mechanically. If the
callback genuinely depends on reactive values, those dependencies must remain represented correctly.

## Stale Closures

An Effect captures values from the render in which it was created.

```tsx
function Counter() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            console.log(count);
        }, 1000);

        return () => clearInterval(id);
    }, []);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

The callback captures the `count` value from the Effect's setup. An empty dependency list means the Effect is not
re-established when `count` changes.

Whether this is correct depends on the desired synchronization semantics.

If the external system must always observe the current value, the design needs to account for that requirement rather
than simply omitting the dependency.

Possible solutions include:

```tsx
useEffect(() => {
    const id = setInterval(() => {
        console.log(count);
    }, 1000);

    return () => clearInterval(id);
}, [count]);
```

or, when appropriate, using a ref or another React mechanism designed to provide access to current mutable information
without forcing the external subscription to restart.

The important point is that stale closures are usually a symptom of an incorrect synchronization model, not merely a
dependency-array problem.

## Effect Splitting

A single Effect should not synchronize unrelated external systems when those systems have different dependencies or
lifetimes.

Avoid:

```tsx
useEffect(() => {
    connectToChat(roomId);
    document.title = title;
    window.addEventListener("resize", handleResize);

    return () => {
        disconnectFromChat();
        window.removeEventListener("resize", handleResize);
    };
}, [roomId, title, handleResize]);
```

A change to `title` unnecessarily reconnects the chat. A change to `roomId` unnecessarily updates the document title.

Separate the synchronization processes:

```tsx
useEffect(() => {
    const connection = createConnection(roomId);

    connection.connect();

    return () => {
        connection.disconnect();
    };
}, [roomId]);

useEffect(() => {
    document.title = title;
}, [title]);

useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
    };
}, [handleResize]);
```

Each Effect now has a clear synchronization purpose and dependency boundary.

## Effect Ordering

Multiple Effects should not be designed around an assumed global execution order.

If one operation must logically precede another, that dependency should be represented explicitly through state,
resource ownership, or a single synchronization process where appropriate.

Avoid relying on incidental Effect ordering as an architectural coordination mechanism.

Effects are best understood as independent synchronization processes rather than a procedural script distributed across
a component.

## Choosing Between useEffect and useLayoutEffect

`useEffect` is the default Effect mechanism for synchronization that does not need to occur before browser paint.

`useLayoutEffect` is appropriate when synchronization must happen after React commits DOM mutations but before the
browser paints the result, typically for layout measurement or synchronous DOM adjustments that would otherwise produce
visible flicker.

```tsx
function Tooltip() {
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!ref.current) {
            return;
        }

        const rect = ref.current.getBoundingClientRect();

        positionTooltip(rect);
    }, []);

    return <div ref={ref}>Tooltip</div>;
}
```

The choice is about timing requirements of the external synchronization, not preference.

`useLayoutEffect` should not be used by default for ordinary synchronization because it can block painting.

## Effects and Server Rendering

Effects are tied to client-side execution and do not provide server-rendered output.

This has architectural consequences for applications that perform server rendering.

An Effect should not be the sole mechanism required to produce content that must exist in the initial server-rendered
HTML.

For example:

```tsx
function Profile({user}: { user: User }) {
    useEffect(() => {
        document.title = user.name;
    }, [user.name]);

    return <h1>{user.name}</h1>;
}
```

The heading is available during rendering. The document title is synchronized on the client.

This distinction is important when deciding whether a value belongs in rendering, server data loading, client state, or
an Effect.

## Effects and Data Fetching

Network requests can be synchronized through Effects in some client-side architectures:

```tsx
function UserProfile({userId}: { userId: string }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        let active = true;

        fetch(`/api/users/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                if (active) {
                    setUser(data);
                }
            });

        return () => {
            active = false;
        };
    }, [userId]);

    return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

However, data fetching has additional concerns involving caching, deduplication, race conditions, server rendering,
preloading, retries, cancellation, and ownership.

For nontrivial applications, a dedicated data-fetching or resource-cache abstraction is often more appropriate than
manually managing these concerns in component Effects.

The Effect pattern itself is about synchronization. It is not a complete data-fetching architecture.

## Effects and State Updates

An Effect can update React state when an external system produces information.

```tsx
function WindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return <div>{width}px</div>;
}
```

Here the browser is the external source. The Effect subscribes to it, and the subscription callback feeds external
changes back into React state.

For standardized external-store semantics, however, `useSyncExternalStore` is generally preferable.

## Avoiding Effect Chains

Effects should not be used to construct a procedural chain of state updates when the transitions can be represented
directly.

Avoid:

```tsx
useEffect(() => {
    if (items.length > 0) {
        setHasItems(true);
    }
}, [items]);

useEffect(() => {
    if (hasItems) {
        setStatus("ready");
    }
}, [hasItems]);
```

This introduces derived state and indirect sequencing.

Prefer deriving the state:

```tsx
const hasItems = items.length > 0;
const status = hasItems ? "ready" : "empty";
```

Or, if an external system must be notified:

```tsx
useEffect(() => {
    externalSystem.setStatus(items.length > 0 ? "ready" : "empty");
}, [items]);
```

Effects should model external synchronization rather than act as a general-purpose state-transition pipeline.

## Synchronization Contracts

An Effect can be viewed as implementing a synchronization contract.

For example:

```tsx
useEffect(() => {
    const connection = createConnection(roomId);

    connection.connect();

    return () => {
        connection.disconnect();
    };
}, [roomId]);
```

The contract is:

* The external connection represents the current `roomId`.
* A change to `roomId` invalidates the existing connection.
* The old connection is disconnected.
* A new connection is established for the new room.
* Unmounting terminates the synchronization.

Thinking in terms of contracts makes Effect behavior easier to reason about than thinking in terms of lifecycle
callbacks.

## Encapsulating Synchronization

When the same synchronization behavior is required in multiple components, it can be encapsulated in a custom Hook.

```tsx
function useChatConnection(roomId: string) {
    useEffect(() => {
        const connection = createConnection(roomId);

        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [roomId]);
}
```

The custom Hook owns the synchronization implementation while exposing a domain-specific API.

The Hook does not change the underlying Effect semantics. It packages the synchronization process into reusable
behavior.

## Testing Effect Synchronization

Effect tests should verify the external synchronization contract rather than implementation details.

For a subscription:

```tsx
render(<OnlineStatus/>);

expect(addEventListener).toHaveBeenCalledWith(
    "online",
    expect.any(Function),
);
```

Cleanup should also be tested when resource ownership is important.

For a connection:

```tsx
const connection = createConnectionMock();

render(<ChatRoom roomId="general"/>);

expect(connection.connect).toHaveBeenCalled();

rerender(<ChatRoom roomId="support"/>);

expect(connection.disconnect).toHaveBeenCalled();
```

The important assertions are about the relationship between React state and the external system.

## Common Misuse

The most common misuse is using Effects for calculations that can happen during rendering.

```tsx
useEffect(() => {
    setTotal(price * quantity);
}, [price, quantity]);
```

Prefer:

```tsx
const total = price * quantity;
```

Another misuse is using an Effect as an event handler.

```tsx
useEffect(() => {
    if (submitted) {
        sendAnalytics();
    }
}, [submitted]);
```

If the operation is directly caused by a user interaction, the event handler is usually the correct location.

Another misuse is creating an Effect without a cleanup path for a resource that requires ownership.

```tsx
useEffect(() => {
    const subscription = subscribe();
}, []);
```

If the subscription remains active after the component stops owning it, the synchronization is incomplete.

Another misuse is combining unrelated synchronization processes into one Effect. This creates unnecessarily broad
dependencies and causes unrelated systems to re-synchronize.

Another misuse is treating the dependency array as an instruction to React about when the developer wants code to run
rather than as a declaration of the synchronization's reactive inputs.

## Advantages

Effect synchronization provides a clear boundary between React's declarative rendering model and imperative external
systems.

It allows components to own external resource lifetimes, react to changing props and state, and cleanly establish and
tear down subscriptions, connections, observers, and imperative integrations.

When Effects are structured around explicit synchronization contracts, they also make external interactions easier to
test and reason about.

## Disadvantages

Effects introduce temporal behavior into an otherwise declarative component model. Incorrect dependencies can produce
stale closures, unnecessary synchronization, or synchronization with obsolete resources.

Effects can also become difficult to reason about when they are used for derived state, event handling, procedural state
transitions, or unrelated operations.

Manual Effect-based implementations of asynchronous resources can additionally require substantial handling for
cancellation, race conditions, retries, caching, and ownership.

## When to Use

Use Effect Synchronization when:

* A component must interact with an external system.
* A browser API must be synchronized with React state.
* A subscription must follow component ownership.
* An imperative third-party library must be initialized or updated.
* A connection must correspond to current props or state.
* An external resource requires setup and teardown.
* A DOM operation must occur after React commits the relevant UI.

Do not use it merely because some code needs to execute after rendering.

## Relationship to Other React Patterns

Effect Synchronization is closely related to several other React patterns but has a distinct responsibility.

Custom Hooks encapsulate reusable stateful behavior and may internally use Effects. They own the reusable abstraction;
Effect Synchronization describes the synchronization mechanism itself.

The Ref Pattern provides stable mutable references to DOM nodes or non-reactive values. Effects frequently use refs to
reach external objects, but refs do not themselves perform synchronization.

Effect Cleanup handles the teardown side of Effect-owned resources. It is part of synchronization correctness but
focuses specifically on releasing or invalidating resources.

Abortable Async Effects specialize synchronization for asynchronous operations that support cancellation or
invalidation. They address the additional problem of preventing obsolete asynchronous work from affecting current state.

External Store integration addresses synchronization with externally owned reactive state. React's
`useSyncExternalStore` provides semantics specifically designed for that case.

Data Fetching concerns obtaining remote data and managing its lifecycle. Effect Synchronization can implement a simple
client-side fetch, but it does not by itself provide caching, deduplication, preloading, or complete server-state
management.

## Summary

The Effect Synchronization pattern uses React Effects to reconcile committed React state with systems outside React's
rendering model.

Its defining principles are:

* Rendering describes React UI rather than performing external mutations.
* Effects synchronize external systems with reactive values.
* Dependencies describe the values that determine the synchronization.
* Cleanup terminates or reverses the synchronization.
* Separate external systems should generally have separate synchronization processes.
* Derived values should normally be calculated during rendering.
* User actions should normally be handled by event handlers.
* Effects should be designed around resource ownership and synchronization contracts.
* Asynchronous synchronization requires additional cancellation and race-condition handling.
* `useEffect` is the default mechanism; `useLayoutEffect` is reserved for synchronization requiring pre-paint timing.

The core mental model is simple: **rendering describes what React should produce; Effects synchronize everything React
does not own.**
