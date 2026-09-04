# Effect Encapsulation

## Intent

Effect Encapsulation hides the implementation details of an Effect-driven synchronization behind a small declarative
interface.

A component should describe the synchronization capability it needs rather than repeatedly implementing the lifecycle
mechanics required to establish, update, and tear down that synchronization. The encapsulating abstraction owns the
Effect, its dependencies, cleanup, cancellation where applicable, and interaction with the external system.

The component therefore depends on a behavioral contract instead of depending directly on the synchronization mechanism.

This is particularly useful when the same Effect logic would otherwise appear across multiple components or when an
Effect interacts with an external API whose lifecycle should not be exposed to every consumer.

## Basic Pattern

An Effect is encapsulated inside a custom Hook or another component abstraction.

```tsx
function useDocumentTitle(title: string) {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = title;

        return () => {
            document.title = previousTitle;
        };
    }, [title]);
}

function ProfilePage({userName}: { userName: string }) {
    useDocumentTitle(`${userName} — Profile`);

    return <main>...</main>;
}
```

The component expresses the desired behavior:

```tsx
useDocumentTitle(`${userName} — Profile`);
```

It does not need to know how `document.title` is manipulated, what cleanup is required, or which dependency set controls
synchronization.

The abstraction owns those details.

## Encapsulation Boundary

The central boundary is between the consumer of a synchronization capability and the Effect that implements it.

```tsx
function ChatRoom({roomId}: { roomId: string }) {
    useChatConnection(roomId);

    return <ChatMessages roomId={roomId}/>;
}
```

The consumer knows that the component should be connected to a room.

The encapsulated Hook owns details such as:

```tsx
function useChatConnection(roomId: string) {
    useEffect(() => {
        const connection = createChatConnection(roomId);

        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [roomId]);
}
```

The boundary prevents synchronization mechanics from leaking into unrelated rendering logic.

The abstraction should expose what the consumer needs to express, not the internal lifecycle steps required to implement
that behavior.

## What the Abstraction Owns

An Effect-encapsulating abstraction can own several related responsibilities.

It can own:

* Effect setup.
* Effect cleanup.
* Dependency management.
* Subscription registration.
* Event listener registration.
* Timer creation and disposal.
* External connection lifecycle.
* Browser API synchronization.
* Cancellation of component-owned asynchronous work.
* Resource acquisition and release.
* Conversion between React values and external-system APIs.
* Normalization of external API behavior.
* Stable callback or handler mechanics required by the synchronization.
* Error handling appropriate to the synchronization boundary.

The consumer should not have to reproduce these mechanics.

For example:

```tsx
function useOnlineStatus(onChange: (online: boolean) => void) {
    useEffect(() => {
        const handleOnline = () => onChange(true);
        const handleOffline = () => onChange(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [onChange]);
}
```

A consumer can then use the synchronization capability without managing browser event registration itself.

## Declarative Consumer Interface

The strongest form of Effect Encapsulation gives consumers a declarative interface.

Prefer:

```tsx
useDocumentTitle(title);
```

over exposing lifecycle operations:

```tsx
const controller = useDocumentTitleController();

useEffect(() => {
    controller.start(title);

    return () => controller.stop();
}, [controller, title]);
```

The second form leaks the lifecycle model back to the consumer.

The purpose of the abstraction is not merely to move code into another file. It is to establish ownership of
synchronization.

A useful encapsulation allows the consumer to state the desired relationship and leaves the abstraction responsible for
maintaining that relationship as React renders change.

## Inputs Define Synchronization

The inputs to the abstraction should represent the external state that determines the synchronization.

```tsx
function useElementClassName(
    element: HTMLElement | null,
    className: string
) {
    useEffect(() => {
        if (!element) {
            return;
        }

        element.classList.add(className);

        return () => {
            element.classList.remove(className);
        };
    }, [element, className]);
}
```

Both `element` and `className` participate in the synchronization contract.

When either changes, the previous synchronization is no longer necessarily correct and the Effect must reconcile the
external system with the new inputs.

The consumer therefore supplies state describing the desired external relationship rather than manually deciding when to
update it.

## Hide Lifecycle Mechanics

Effect Encapsulation is especially valuable when the synchronization lifecycle has several steps.

Consider a subscription:

```tsx
function useResizeObserver(
    element: Element | null,
    onResize: (entry: ResizeObserverEntry) => void
) {
    useEffect(() => {
        if (!element) {
            return;
        }

        const observer = new ResizeObserver(([entry]) => {
            onResize(entry);
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [element, onResize]);
}
```

The consumer does not need to know that the implementation:

1. Creates a `ResizeObserver`.
2. Registers the target.
3. Receives callbacks.
4. Disconnects the observer during cleanup.
5. Repeats the synchronization when its dependencies change.

Those are implementation details of the synchronization abstraction.

## Encapsulation Versus Extraction

Moving an Effect into a custom Hook is not automatically meaningful encapsulation.

This:

```tsx
function useEffectWrapper(
    callback: () => void | (() => void),
    dependencies: unknown[]
) {
    useEffect(callback, dependencies);
}
```

does not establish a meaningful abstraction.

It merely renames `useEffect`.

A useful abstraction represents a domain or infrastructure capability:

```tsx
useDocumentTitle(title);
useChatConnection(roomId);
useMediaQuery("(prefers-reduced-motion: reduce)");
useWindowEvent("resize", handleResize);
useIntersectionObserver(element, handleIntersection);
```

The consumer receives a meaningful operation rather than a generic lifecycle primitive.

## Encapsulation Versus Custom Hooks

Effect Encapsulation frequently uses Custom Hooks, but the concepts are not identical.

A Custom Hook is a mechanism for encapsulating reusable React logic.

Effect Encapsulation is specifically concerned with hiding synchronization implementation behind an abstraction.

A custom Hook may contain no Effect:

```tsx
function usePrevious<T>(value: T) {
    const ref = useRef<T>();

    const previous = ref.current;
    ref.current = value;

    return previous;
}
```

Conversely, an Effect can be encapsulated by a component abstraction rather than directly exposed as a Hook.

The important property is the ownership boundary around synchronization, not the particular abstraction mechanism.

## One Synchronization Responsibility

An encapsulated Effect should generally represent one coherent synchronization relationship.

Prefer:

```tsx
function useChatConnection(roomId: string) {
    useEffect(() => {
        const connection = createChatConnection(roomId);

        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [roomId]);
}
```

over an abstraction that combines unrelated synchronization concerns:

```tsx
function useEverything(userId: string) {
    useEffect(() => {
        // connect to chat
        // subscribe to notifications
        // update document title
        // register keyboard shortcuts
        // synchronize analytics
        // start polling
    }, [userId]);
}
```

The second abstraction creates a large lifecycle boundary with unrelated responsibilities.

Changes to one concern can unintentionally affect another.

Effect Encapsulation should reduce lifecycle coupling rather than hide it inside a larger abstraction.

## Internal Effects Can Be Multiple

One encapsulating Hook can legitimately contain multiple Effects when those Effects represent separate synchronization
relationships.

```tsx
function useEditorIntegration(
    editor: Editor | null,
    documentId: string
) {
    useEffect(() => {
        if (!editor) {
            return;
        }

        editor.openDocument(documentId);

        return () => {
            editor.closeDocument();
        };
    }, [editor, documentId]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        const handleChange = () => {
            notifyDocumentChanged(documentId);
        };

        editor.on("change", handleChange);

        return () => {
            editor.off("change", handleChange);
        };
    }, [editor, documentId]);
}
```

The abstraction remains coherent because both synchronizations belong to the editor integration capability.

The criterion is conceptual cohesion, not an arbitrary one-Effect-per-Hook rule.

## Stable Public Contracts

The public interface should be smaller and more stable than the implementation.

For example:

```tsx
useKeyboardShortcut("Escape", closeDialog);
```

is a more useful contract than:

```tsx
useKeyboardListener({
    target: window,
    type: "keydown",
    capture: true,
    passive: false,
    handler: closeDialog,
});
```

The latter exposes implementation-level configuration that may unnecessarily couple consumers to the underlying
mechanism.

This does not mean configuration should never be exposed. Configuration should be exposed when it represents a
legitimate part of the abstraction's contract.

The goal is to expose meaningful policy rather than incidental mechanics.

## Encapsulating Browser APIs

Browser APIs are common candidates for Effect Encapsulation because their imperative lifecycle does not naturally belong
in render logic.

Examples include:

```tsx
useWindowEvent("resize", handleResize);
useDocumentTitle(title);
useBodyScrollLock(locked);
useMediaQuery(query);
useIntersectionObserver(element, callback);
useOnlineStatus();
```

The abstraction translates declarative React inputs into imperative browser operations.

For example:

```tsx
function useBodyScrollLock(locked: boolean) {
    useEffect(() => {
        if (!locked) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [locked]);
}
```

The component declares:

```tsx
useBodyScrollLock(isDialogOpen);
```

The browser lifecycle remains internal.

## Encapsulating Subscriptions

Subscriptions are another natural boundary.

```tsx
function useWindowEvent<K extends keyof WindowEventMap>(
    type: K,
    handler: (event: WindowEventMap[K]) => void
) {
    useEffect(() => {
        window.addEventListener(type, handler);

        return () => {
            window.removeEventListener(type, handler);
        };
    }, [type, handler]);
}
```

The consumer does not directly manage registration and deregistration.

However, the abstraction must still have a correct identity model for `handler`.

If the consumer supplies a new function every render and the abstraction uses that function directly as an Effect
dependency, the subscription may be repeatedly removed and re-added.

Whether that behavior is acceptable depends on the contract.

If handler identity should not determine subscription lifetime, the abstraction needs an appropriate internal design
rather than forcing every consumer to understand the subscription implementation.

## Encapsulating External Resources

Effect Encapsulation is useful when React controls the lifetime of an external resource.

Examples include:

* WebSocket connections.
* DOM observers.
* Event subscriptions.
* Timers.
* Media playback integrations.
* Third-party widget instances.
* Maps.
* Editors.
* Charts.
* Browser APIs.
* External event sources.

For example:

```tsx
function useMapInstance(
    container: HTMLElement | null,
    options: MapOptions
) {
    useEffect(() => {
        if (!container) {
            return;
        }

        const map = new MapLibrary(container, options);

        return () => {
            map.destroy();
        };
    }, [container, options]);
}
```

The Hook owns the external object's lifecycle.

The component owns the declarative inputs.

## Resource Lifetime

The abstraction must define who owns the external resource.

A component-owned resource can usually be created and destroyed by the encapsulating Effect:

```tsx
function usePlayer(src: string) {
    useEffect(() => {
        const player = createPlayer(src);

        player.start();

        return () => {
            player.stop();
            player.destroy();
        };
    }, [src]);
}
```

A shared resource should not be created and destroyed independently by every consumer.

For shared resources, ownership normally belongs to another abstraction such as a resource cache, external store, or
dedicated service.

Effect Encapsulation does not imply that every Effect owns the underlying resource itself.

## Shared Resources

A common mistake is to hide a shared resource inside a component Effect.

```tsx
function useCurrentUser() {
    useEffect(() => {
        const connection = createGlobalConnection();

        return () => {
            connection.destroy();
        };
    }, []);

    // ...
}
```

If multiple consumers use this Hook, each consumer may create its own resource.

If the resource is intended to be shared, the ownership model is wrong.

A shared resource should instead have an owner capable of managing:

* Resource identity.
* Sharing.
* Reference counting where appropriate.
* Caching.
* In-flight work.
* Invalidation.
* Eviction.
* Global or application scope.

The Effect abstraction should then synchronize the component with that owner rather than pretending the component owns
the shared resource.

## Async Work

Effect Encapsulation can also hide asynchronous synchronization.

```tsx
function useUserProfile(userId: string) {
    const [state, setState] = useState<ProfileState>({
        status: "idle",
    });

    useEffect(() => {
        const controller = new AbortController();

        setState({status: "loading"});

        fetchUserProfile(userId, {
            signal: controller.signal,
        })
            .then((profile) => {
                setState({
                    status: "success",
                    profile,
                });
            })
            .catch((error) => {
                if (error.name === "AbortError") {
                    return;
                }

                setState({
                    status: "error",
                    error,
                });
            });

        return () => {
            controller.abort();
        };
    }, [userId]);

    return state;
}
```

The component consumes the state:

```tsx
const profile = useUserProfile(userId);
```

It does not manage the asynchronous lifecycle directly.

For complex cancellation and shared remote data, however, a dedicated resource or server-state abstraction may be more
appropriate than a component-owned Effect.

## Cancellation Boundary

When an encapsulated Effect starts asynchronous work that belongs to that Effect, the abstraction should normally own
its cancellation.

```tsx
function useSearchResults(query: string) {
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        search(query, {
            signal: controller.signal,
        }).then((nextResults) => {
            setResults(nextResults);
        });

        return () => {
            controller.abort();
        };
    }, [query]);

    return results;
}
```

The consumer should not have to manually abort the previous request when `query` changes.

The abstraction owns that synchronization boundary.

Detailed cancellation semantics belong to the abortable asynchronous Effect pattern rather than to Effect Encapsulation
itself.

## Avoiding Leaky Abstractions

An abstraction is leaky when consumers still need to understand its internal lifecycle to use it correctly.

For example:

```tsx
const subscription = useSomething();

useEffect(() => {
    subscription.connect();
    return () => subscription.disconnect();
}, [subscription]);
```

If the Hook was intended to manage the subscription lifecycle, exposing `connect()` and `disconnect()` defeats that
purpose.

A better API might be:

```tsx
useSomething();
```

or:

```tsx
useSomething({enabled});
```

The abstraction should make invalid lifecycle usage difficult.

## Enabled State

An encapsulated synchronization may expose whether it should be active.

```tsx
function useChatConnection(
    roomId: string,
    enabled: boolean
) {
    useEffect(() => {
        if (!enabled) {
            return;
        }

        const connection = createChatConnection(roomId);

        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [roomId, enabled]);
}
```

The consumer controls policy:

```tsx
useChatConnection(roomId, isChatEnabled);
```

The abstraction controls lifecycle.

This distinction is useful because it allows consumers to express when a capability should exist without knowing how
activation and deactivation are implemented.

## Imperative Escape Hatches

Effect Encapsulation does not prohibit imperative APIs.

Some external systems inherently expose imperative operations.

For example:

```tsx
const player = useVideoPlayer(videoRef, source);

player.play();
player.pause();
```

The important distinction is between imperative operations that are part of the capability and imperative lifecycle
management that should remain internal.

The abstraction can expose:

```tsx
play()
pause()
seek()
```

while keeping:

```tsx
create()
connect()
subscribe()
cleanup()
destroy()
```

under its ownership.

The public imperative API should represent intentional capabilities, not resource-lifecycle plumbing.

## Callback Boundaries

Callbacks require particular care because their identity can accidentally become part of the synchronization lifecycle.

Consider:

```tsx
function useSubscription(
    source: Source,
    onMessage: (message: Message) => void
) {
    useEffect(() => {
        return source.subscribe(onMessage);
    }, [source, onMessage]);
}
```

If `onMessage` changes identity on every render, the subscription may be recreated on every render.

Whether that is correct depends on the abstraction's semantics.

There are two different contracts:

```text
subscription lifetime depends on callback identity
```

and:

```text
subscription lifetime depends on source identity,
callback implementation may change independently
```

The abstraction must choose deliberately.

If callback changes should not recreate the external subscription, the implementation should separate the callback's
current behavior from the subscription's lifetime using an appropriate React pattern.

The consumer should not be forced to stabilize every callback merely to compensate for an accidentally leaky
abstraction.

## Dependency Management

Effect Encapsulation does not eliminate dependency correctness.

The Effect inside the abstraction still needs to synchronize with every reactive value whose change affects its
synchronization.

For example:

```tsx
function useRoomConnection(roomId: string, serverUrl: string) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);

        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [serverUrl, roomId]);
}
```

Both inputs are part of the synchronization contract.

An abstraction should not hide a dependency merely to prevent re-execution.

If a value affects the external relationship, its changes must be represented correctly in the implementation.

## Avoiding Dependency Tunneling

An abstraction becomes difficult to reason about when it accepts arbitrary Effect dependencies from its consumer.

Avoid APIs such as:

```tsx
useExternalSynchronization({
    setup,
    dependencies: [a, b, c],
});
```

This exposes the underlying Effect model.

The abstraction should instead accept semantic inputs:

```tsx
useChatConnection({
    roomId,
    serverUrl,
});
```

The abstraction determines which inputs participate in its synchronization.

This preserves ownership of the Effect's dependency semantics.

## Configuration Versus Dependencies

Configuration values and Effect dependencies are related but not identical concepts.

A Hook may accept:

```tsx
usePolling({
    url,
    interval: 5000,
});
```

The implementation determines that `url` and `interval` affect the lifecycle.

The consumer should not have to separately specify:

```tsx
dependencies: [url, interval]
```

The abstraction owns the mapping between its API and its synchronization dependencies.

## Testing the Encapsulation

The abstraction should be testable independently of the components that consume it.

For a subscription abstraction, tests should verify:

* Subscription is established when enabled.
* Correct external resource is used.
* Relevant input changes update the subscription.
* Cleanup removes the subscription.
* Disabled state does not establish the resource.
* Errors are handled according to the contract.
* Callback behavior remains correct.
* Repeated setup and cleanup are safe.

For example, a test should be able to assert that:

```tsx
renderHook(() => useChatConnection("room-1"));
```

creates the expected connection and that unmounting the Hook disconnects it.

The implementation details can then evolve without requiring every consumer test to understand them.

## Testing Consumers

Consumers should generally test their own behavioral contract rather than the internal Effect implementation.

If a component uses:

```tsx
useDocumentTitle(title);
```

its tests should primarily verify that the document title has the expected value.

They should not normally assert that a particular internal `useEffect` exists or that a specific cleanup function was
written.

This keeps tests aligned with the abstraction boundary.

## Server Rendering

Effect Encapsulation is inherently client-side when its implementation depends on React Effects.

Effects do not execute during server rendering.

Therefore an encapsulated Effect must not be treated as the mechanism for producing required server-rendered output.

For example:

```tsx
function useDocumentTitle(title: string) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}
```

This can synchronize the browser document after client execution, but it does not establish a server-side document title
during server rendering.

If a value is required for server-rendered HTML, it should be represented through the appropriate server-rendering or
framework mechanism instead.

## Client Boundaries

In architectures that distinguish Server Components from Client Components, an Effect-encapsulating Hook belongs on the
client side.

For example:

```tsx
"use client";

function useOnlineStatus() {
    useEffect(() => {
        // browser synchronization
    }, []);
}
```

The abstraction may be consumed by a Client Component, while a Server Component can provide data that eventually becomes
an input to the client-side synchronization.

The boundary is architectural:

* Server-side code can determine data and configuration.
* Client-side code owns browser Effects.
* The Effect abstraction owns the browser synchronization lifecycle.

Effect Encapsulation should not be used to blur that boundary.

## Hydration

An Effect executes after the component has rendered on the client.

Therefore an encapsulated Effect should not be required to make the initial server-rendered markup structurally valid.

For example, a Hook that installs a browser event listener can safely establish that listener after hydration because
the listener is an external synchronization concern.

A Hook that changes the rendered structure required for the initial UI should generally not rely on an Effect as its
only mechanism.

The encapsulation boundary does not change React's rendering and hydration semantics.

## Strict Mode

In development Strict Mode, React may perform additional setup and cleanup cycles to expose lifecycle bugs.

Effect encapsulations therefore need setup and cleanup that tolerate repeated lifecycle execution.

For example:

```tsx
function useWindowResize(handler: () => void) {
    useEffect(() => {
        window.addEventListener("resize", handler);

        return () => {
            window.removeEventListener("resize", handler);
        };
    }, [handler]);
}
```

The abstraction must correctly establish and release the external subscription each time React requires it.

An encapsulated Effect should not rely on setup running exactly once for the lifetime of the application.

## Idempotent Lifecycle Operations

Where possible, setup and cleanup should be safe when repeated according to React's lifecycle semantics.

Good encapsulations establish a clear ownership relationship:

```tsx
useEffect(() => {
    const resource = acquire();

    return () => {
        resource.release();
    };
}, [dependency]);
```

The resource acquired by one Effect instance is released by that same Effect instance.

This makes lifecycle ownership explicit and reduces accidental cross-instance cleanup.

## Avoid Hidden Global Mutation

Effect Encapsulation can accidentally make global mutation harder to detect.

For example:

```tsx
function useGlobalConfiguration(config: Config) {
    useEffect(() => {
        globalConfiguration = config;
    }, [config]);
}
```

The Hook may appear clean at the call site while hiding a globally shared mutable dependency.

Before encapsulating an Effect, determine whether the external system is:

* Component-scoped.
* Feature-scoped.
* Application-scoped.
* Request-scoped.
* Shared across consumers.

The abstraction should reflect that ownership model.

## Context and Effect Encapsulation

Context can provide dependencies used by an encapsulated Effect.

For example:

```tsx
const AnalyticsContext = createContext<AnalyticsClient | null>(null);

function useAnalytics() {
    const client = useContext(AnalyticsContext);

    if (!client) {
        throw new Error("AnalyticsProvider is missing");
    }

    return client;
}

function usePageView(pathname: string) {
    const analytics = useAnalytics();

    useEffect(() => {
        analytics.trackPageView(pathname);
    }, [analytics, pathname]);
}
```

The Hook owns the synchronization.

Context owns dependency distribution.

The two patterns therefore solve different problems and can be composed.

## Dependency Injection

Effect Encapsulation works well with dependency injection.

Instead of hard-coding an external service:

```tsx
function useAnalytics() {
    useEffect(() => {
        globalAnalytics.track(...);
    }, []);
}
```

the abstraction can consume an injected dependency:

```tsx
function usePageView(pathname: string) {
    const analytics = useAnalytics();

    useEffect(() => {
        analytics.trackPageView(pathname);
    }, [analytics, pathname]);
}
```

This makes the synchronization testable and allows different environments to provide different implementations.

The Effect remains responsible for synchronization while the dependency-injection boundary remains responsible for
supplying the capability.

## Feature Boundaries

Effect Encapsulation is particularly useful inside feature boundaries.

A feature can expose:

```tsx
useCheckoutPaymentStatus(orderId);
```

while internally managing:

* External subscriptions.
* Polling.
* Cancellation.
* Event listeners.
* Resource cleanup.
* Service interaction.

Other features should not need to know how the synchronization is implemented.

This keeps Effect implementation details inside the feature that owns the capability.

## Abstraction Granularity

An abstraction should be large enough to provide meaningful reuse but small enough to preserve a comprehensible
contract.

Too small:

```tsx
useAddEventListener(...);
useRemoveEventListener(...);
```

This may merely relocate primitive lifecycle operations.

Too large:

```tsx
useApplicationLifecycle();
```

This may hide dozens of unrelated synchronization relationships.

A useful abstraction usually corresponds to one recognizable capability or integration.

Examples include:

```tsx
useChatConnection(roomId);
useDocumentTitle(title);
useBodyScrollLock(locked);
useIntersectionObserver(target, callback);
useOnlineStatus();
usePageView(pathname);
```

## Common Misuse: Generic Effect Wrapper

A generic wrapper does not create useful encapsulation:

```tsx
function useSynchronization(
    effect: () => void | (() => void),
    dependencies: unknown[]
) {
    useEffect(effect, dependencies);
}
```

This merely moves the API one level away.

It also preserves all the lifecycle knowledge that the consumer was supposed to be insulated from.

Encapsulation requires a meaningful contract.

## Common Misuse: Hiding Incorrect Dependencies

Do not omit dependencies merely because an abstraction is intended to be convenient.

Incorrect:

```tsx
function useConnection(serverUrl: string, roomId: string) {
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);

        connection.connect();

        return () => connection.disconnect();
    }, []);
}
```

The Hook now contains stale synchronization semantics.

Changing either input does not update the external connection.

The abstraction is convenient but incorrect.

## Common Misuse: Exposing Internal Lifecycle

Avoid forcing consumers to manually reproduce the lifecycle:

```tsx
const resource = useResource();

useEffect(() => {
    resource.connect();

    return () => resource.disconnect();
}, [resource]);
```

If the abstraction owns the resource lifecycle, the lifecycle should remain internal.

Expose capabilities, not internal lifecycle operations.

## Common Misuse: One Hook for the Entire Application

A single Hook containing every application Effect is not effective encapsulation.

```tsx
useApplicationEffects();
```

Such an abstraction tends to accumulate:

* Authentication synchronization.
* Analytics.
* WebSocket connections.
* Keyboard shortcuts.
* Notifications.
* Timers.
* DOM integration.
* Persistence.
* Polling.

The result is a hidden global lifecycle manager.

Prefer independently owned synchronization capabilities.

## Common Misuse: Turning Event Logic Into Effects

Not every imperative operation belongs inside an Effect abstraction.

If an operation happens because the user explicitly performs an action, an event handler is often the correct location.

For example:

```tsx
function SaveButton() {
    const handleClick = async () => {
        await saveDocument();
    };

    return <button onClick={handleClick}>Save</button>;
}
```

Wrapping this in an Effect because it involves an asynchronous operation would incorrectly model an event as
synchronization.

Effect Encapsulation applies when the abstraction is maintaining a relationship with an external system, not merely
hiding arbitrary imperative code.

## Common Misuse: Effect as Business Logic Container

An abstraction such as:

```tsx
useProcessEverything();
```

may hide business rules rather than encapsulating synchronization.

Business logic should not automatically become Effect logic.

The question is whether the behavior exists to synchronize React state with an external system.

If not, an Effect may be the wrong mechanism.

## Common Misuse: Accidental Resource Sharing

Two consumers using the same Hook do not automatically share the Hook's state or external resource.

```tsx
function useWebSocket(url: string) {
    useEffect(() => {
        const socket = new WebSocket(url);

        return () => socket.close();
    }, [url]);
}
```

Two components calling this Hook can create two sockets.

If the requirement is one shared socket, the Hook must consume a shared resource owner rather than instantiate an
independent resource for each consumer.

This distinction is fundamental to resource ownership.

## Common Misuse: Premature Abstraction

An Effect should not necessarily be encapsulated immediately.

If synchronization is genuinely local to one component and has no meaningful reusable contract, extracting it may make
the code harder to understand.

For example:

```tsx
function Tooltip() {
    useEffect(() => {
        // synchronization specific to this component
    }, []);

    return
...
    ;
}
```

There is no requirement to create:

```tsx
useTooltipSynchronization();
```

merely because the component contains an Effect.

Encapsulation is valuable when it establishes a meaningful ownership or reuse boundary.

## Relationship to Effect Synchronization

Effect Synchronization defines the underlying lifecycle relationship between React and an external system.

Effect Encapsulation defines where that synchronization implementation should live and how consumers should access it.

The former answers:

> What synchronization relationship does this Effect maintain?

The latter answers:

> Which abstraction owns that synchronization relationship, and what contract does it expose?

An encapsulated Effect must still obey correct synchronization semantics.

## Relationship to Effect Cleanup

Effect Cleanup concerns releasing the resources established by an Effect.

Effect Encapsulation can hide that cleanup from consumers.

For example:

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

The cleanup belongs to the Effect, while the ownership of that cleanup belongs to the encapsulating abstraction.

Cleanup therefore remains an internal lifecycle responsibility.

## Relationship to Abortable Async Effects

Abortable Async Effects specialize in cancellation of asynchronous work started by an Effect.

Effect Encapsulation can contain that cancellation:

```tsx
function useSearch(query: string) {
    useEffect(() => {
        const controller = new AbortController();

        search(query, {
            signal: controller.signal,
        });

        return () => {
            controller.abort();
        };
    }, [query]);
}
```

The consumer uses:

```tsx
useSearch(query);
```

The cancellation mechanism remains internal.

The two patterns therefore compose rather than compete.

## Relationship to Custom Hooks

Custom Hooks are a primary implementation mechanism for Effect Encapsulation.

```tsx
function useDocumentTitle(title: string) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}
```

However, the abstraction should be named and designed around the capability it provides.

The important architectural boundary is not “this code is inside a Hook.”

It is:

```text
consumer depends on synchronization capability
implementation owns synchronization lifecycle
```

## Relationship to External Stores

An external store should own state that is independently maintained outside React and shared across consumers.

An Effect-encapsulating Hook can synchronize a component with such a store, but it should not recreate the store
independently for every consumer.

For example:

```tsx
function useClock() {
    return useSyncExternalStore(
        clockStore.subscribe,
        clockStore.getSnapshot
    );
}
```

The store owns the shared state.

The Hook provides the React-facing subscription contract.

This is different from:

```tsx
function useClock() {
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const id = setInterval(() => {
            setTime(Date.now());
        }, 1000);

        return () => clearInterval(id);
    }, []);

    return time;
}
```

The second implementation creates component-local state and a component-owned timer.

Neither is universally better; they represent different ownership models.

## Relationship to Server State

Remote server state often has sharing, caching, invalidation, retry, and freshness semantics that exceed the
responsibility of a component-owned Effect.

An encapsulated Hook can provide a convenient interface:

```tsx
const user = useUser(userId);
```

but the underlying implementation may be backed by a dedicated resource cache or server-state manager rather than an
independent Fetch Effect.

Effect Encapsulation should therefore not become a reason to rebuild a server-state system inside every component.

## Relationship to Component Identity

The lifetime of a component-owned Effect is tied to the lifetime of its React component instance.

If component identity changes, the old Effect is cleaned up and a new Effect is established for the new instance.

Therefore an encapsulated Effect must not assume that its resource survives component identity changes unless the
resource is owned elsewhere.

For example, a component-scoped connection belongs to the component's synchronization lifecycle.

A shared application connection should have an owner whose lifetime is independent of an individual component instance.

## Relationship to Stable Keys

Keys determine React component identity in collections.

If a key changes and React replaces the component instance, an Effect encapsulated by that instance is also torn down
and re-established.

Therefore stable identity can directly affect the lifetime of external synchronization.

The key itself does not control the Effect.

React component identity controls the Effect instance, and the key contributes to that identity.

## Relationship to Referential Stability

Referential stability can influence whether an encapsulated Effect re-synchronizes.

For example:

```tsx
function useSubscription(source: Source, options: Options) {
    useEffect(() => {
        return source.subscribe(options);
    }, [source, options]);
}
```

If `options` is recreated on every render, the Effect may re-run on every render.

This does not mean consumers should blindly memoize everything.

The abstraction should define which values are semantically meaningful inputs and should avoid exposing implementation
details that create unnecessary synchronization churn.

Referential stability is therefore an implementation concern that can affect the behavior of the encapsulated
synchronization.

## Design Rules

An effective Effect Encapsulation follows these rules:

1. Give the abstraction a meaningful capability-oriented contract.
2. Keep Effect lifecycle mechanics inside the abstraction.
3. Let semantic inputs determine synchronization.
4. Own setup and cleanup together.
5. Do not expose internal lifecycle operations unless they are genuine public capabilities.
6. Keep unrelated synchronization concerns in separate abstractions.
7. Make resource ownership explicit.
8. Do not recreate shared resources inside component-local Effects.
9. Preserve correct dependency semantics.
10. Treat cancellation as part of the abstraction when the abstraction owns asynchronous work.
11. Use dependency injection when external services should be replaceable or testable.
12. Keep browser-only synchronization on the client side.
13. Do not use Effects to model ordinary user events or arbitrary business logic.
14. Avoid generic wrappers around `useEffect`.
15. Avoid abstractions so large that they become hidden application lifecycle managers.
16. Do not extract a local Effect unless the resulting boundary provides meaningful value.
17. Test the abstraction according to its externally observable synchronization contract.
18. Keep consumers dependent on capabilities rather than implementation mechanics.

## When to Use

Use Effect Encapsulation when:

* The same synchronization logic is needed by multiple components.
* An Effect interacts with a reusable browser API.
* An external resource has a recognizable lifecycle.
* Subscription setup and cleanup should not be repeated by consumers.
* Cancellation should be consistently owned by one abstraction.
* A third-party imperative API needs a React-facing interface.
* An external dependency should be injected.
* A feature needs to hide integration details behind a stable API.
* The lifecycle mechanics are complex enough to distract from the component's primary responsibility.

## When Not to Use

Do not introduce a dedicated abstraction merely because an Effect exists.

Avoid it when:

* The Effect is genuinely component-specific.
* The extracted API would only rename `useEffect`.
* The abstraction would expose all underlying Effect configuration anyway.
* The behavior is actually an event handler.
* The behavior is ordinary computation rather than synchronization.
* Resource ownership is unclear.
* The abstraction would combine unrelated synchronization responsibilities.
* Extraction would make a simple local lifecycle harder to understand.

## Summary

Effect Encapsulation establishes an ownership boundary around synchronization with external systems.

The consumer expresses a capability:

```tsx
useChatConnection(roomId);
```

The abstraction owns the lifecycle:

```tsx
useEffect(() => {
    const connection = createConnection(roomId);

    connection.connect();

    return () => {
        connection.disconnect();
    };
}, [roomId]);
```

The important property is not simply that the Effect has been moved into another file. The important property is that
the consumer no longer needs to understand or manage the synchronization lifecycle.

A good abstraction exposes semantic inputs and capabilities while hiding setup, dependency management, cleanup,
cancellation, and other lifecycle mechanics.

Effect Encapsulation therefore turns imperative synchronization from an implementation detail of individual components
into an explicitly owned capability with a stable React-facing contract.
