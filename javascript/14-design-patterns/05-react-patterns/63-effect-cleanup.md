# Effect Cleanup

Effect cleanup is the mechanism by which a React Effect releases or reverses the external resources and synchronization
established by that Effect.

An Effect can return a cleanup function:

```tsx
useEffect(() => {
    const connection = createConnection(serverUrl, roomId);

    connection.connect();

    return () => {
        connection.disconnect();
    };
}, [serverUrl, roomId]);
```

The cleanup function belongs to the Effect instance created by that render. React invokes it when that Effect is no
longer applicable, before the Effect is re-established with changed dependencies, and when the component is removed from
the React tree.

Cleanup is therefore not a generic component destructor and should not be treated as a mechanism for resetting ordinary
React state. Its purpose is to undo, unsubscribe, disconnect, cancel, or otherwise release what the corresponding Effect
established.

## Intent

Use Effect cleanup to maintain a correct lifecycle for external synchronization.

Every Effect that acquires or establishes an external resource should define how that resource is released when the
synchronization becomes obsolete.

The fundamental relationship is:

```tsx
useEffect(() => {
    const resource = acquire();

    return () => {
        release(resource);
    };
}, [dependencies]);
```

The cleanup should correspond directly to the setup performed by the Effect.

## Setup and Cleanup

An Effect normally consists of two complementary operations:

```tsx
useEffect(() => {
    const subscription = store.subscribe(handleChange);

    return () => {
        subscription.unsubscribe();
    };
}, []);
```

The setup establishes the external relationship.

The cleanup terminates that relationship.

This symmetry is important because an Effect may execute more than once during the lifetime of a component. Cleanup must
therefore be capable of correctly reversing the specific setup that preceded it.

## Cleanup Is Returned From the Effect

Cleanup is returned from the Effect callback itself.

```tsx
useEffect(() => {
    const timer = setInterval(refresh, 1000);

    return () => {
        clearInterval(timer);
    };
}, []);
```

The returned function is not an arbitrary callback that React invokes whenever convenient. It is the teardown operation
associated with that particular Effect synchronization.

Do not place cleanup outside the Effect and expect React to associate it with the Effect lifecycle.

## Cleanup Runs Before Re-Synchronization

When an Effect's dependencies change, React must stop the previous synchronization before establishing the new one.

```tsx
useEffect(() => {
    const connection = connect(roomId);

    return () => {
        connection.disconnect();
    };
}, [roomId]);
```

If `roomId` changes, the previous connection must be disconnected before the Effect establishes the connection for the
new room.

Conceptually, the lifecycle is:

```text
setup(room A)
cleanup(room A)
setup(room B)
```

The exact scheduling of Effects is governed by React's Effect semantics, but the important invariant is that the
previous synchronization is cleaned up before the replacement synchronization is established.

## Cleanup Runs on Unmount

When a component is removed from the React tree, its active Effects are cleaned up.

```tsx
function Subscription({topic}: { topic: string }) {
    useEffect(() => {
        const subscription = subscribe(topic);

        return () => {
            subscription.unsubscribe();
        };
    }, [topic]);

    return null;
}
```

When `Subscription` is removed, the active subscription must be released.

This prevents the external resource from continuing to reference a component that no longer exists.

## Cleanup Is About External Resources

The strongest use case for cleanup is releasing something outside React's ordinary rendering model.

Typical resources include:

* event listeners;
* timers;
* subscriptions;
* WebSocket connections;
* browser observers;
* external-store subscriptions;
* media listeners;
* third-party library instances;
* network-related resources that support cancellation;
* DOM event registrations;
* resources acquired from imperative APIs.

For example:

```tsx
useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
    };
}, []);
```

The cleanup reverses exactly what setup established.

## Cleanup Must Match Setup

A useful rule is that cleanup should undo the specific operation performed by setup.

```tsx
useEffect(() => {
    element.addEventListener("click", handleClick);

    return () => {
        element.removeEventListener("click", handleClick);
    };
}, [element]);
```

The listener registered during setup must be the listener removed during cleanup.

Incorrect cleanup can leave the old resource active:

```tsx
useEffect(() => {
    element.addEventListener("click", handleClick);

    return () => {
        element.removeEventListener("click", differentHandler);
    };
}, [element]);
```

The cleanup runs, but it does not correctly reverse the setup.

The existence of a cleanup function is not sufficient. The cleanup must be semantically correct.

## Cleanup and Dependency Changes

Dependencies define when the synchronization represented by an Effect becomes obsolete.

```tsx
useEffect(() => {
    const socket = connect(roomId);

    return () => {
        socket.close();
    };
}, [roomId]);
```

The cleanup closes the socket associated with the previous `roomId`.

If `roomId` changes, retaining the old socket would violate the Effect's synchronization contract.

Dependencies and cleanup therefore work together:

* dependencies identify when synchronization must change;
* setup establishes the new synchronization;
* cleanup removes the previous synchronization.

## Cleanup and Resource Ownership

The Effect that acquires a resource should normally own its cleanup.

```tsx
useEffect(() => {
    const observer = new ResizeObserver(handleResize);

    observer.observe(element);

    return () => {
        observer.disconnect();
    };
}, [element]);
```

The component does not merely request an observer. It establishes an observer relationship and owns the responsibility
for ending that relationship.

This makes resource ownership explicit.

A useful design test is:

**If this Effect establishes it, what operation reverses it?**

That operation generally belongs in the returned cleanup function.

## Cleanup and Event Listeners

Event listeners are a common cleanup requirement.

```tsx
useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            close();
        }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };
}, [close]);
```

Without cleanup, each new synchronization can leave an old listener registered.

This can produce:

* duplicate event handling;
* stale closures;
* memory retention;
* unexpected updates after the component changes;
* behavior that appears to become progressively worse.

Cleanup ensures that only the current synchronization remains active.

## Cleanup and Timers

Timers should be cleared when their owning Effect becomes obsolete.

```tsx
useEffect(() => {
    const timeout = setTimeout(() => {
        refresh();
    }, delay);

    return () => {
        clearTimeout(timeout);
    };
}, [delay, refresh]);
```

Similarly:

```tsx
useEffect(() => {
    const interval = setInterval(refresh, intervalMs);

    return () => {
        clearInterval(interval);
    };
}, [intervalMs, refresh]);
```

Otherwise an old timer can continue invoking callbacks after the Effect's intended synchronization has changed.

## Cleanup and Subscriptions

Subscriptions should generally be unsubscribed during cleanup.

```tsx
useEffect(() => {
    const unsubscribe = store.subscribe(handleChange);

    return unsubscribe;
}, [store, handleChange]);
```

Returning the unsubscribe function directly is valid when it matches the cleanup contract.

The important property is that the subscription established by the Effect has a corresponding teardown operation.

## Cleanup and WebSockets

Long-lived connections require explicit ownership.

```tsx
useEffect(() => {
    const socket = new WebSocket(url);

    socket.addEventListener("message", handleMessage);

    return () => {
        socket.close();
    };
}, [url, handleMessage]);
```

When the URL changes, the old connection should not remain active alongside the new one unless the architecture
explicitly requires multiple connections.

Cleanup establishes the lifecycle boundary of the connection.

## Cleanup and Observers

Browser observer APIs commonly require cleanup.

```tsx
useEffect(() => {
    const observer = new IntersectionObserver(entries => {
        setVisible(entries[0]?.isIntersecting ?? false);
    });

    observer.observe(element);

    return () => {
        observer.disconnect();
    };
}, [element]);
```

The observer is an external resource. Its lifetime should correspond to the Effect's synchronization lifetime.

The same principle applies to `MutationObserver`, `ResizeObserver`, and similar APIs.

## Cleanup and Third-Party Libraries

Imperative libraries often expose explicit destruction APIs.

```tsx
useEffect(() => {
    const editor = createEditor(container);

    return () => {
        editor.destroy();
    };
}, [container]);
```

The React component establishes ownership of the imperative instance through the Effect.

Cleanup calls the library's corresponding lifecycle operation.

If the library has a documented `destroy`, `dispose`, `close`, `disconnect`, or `unsubscribe` operation, that operation
is usually the natural cleanup.

## Cleanup and AbortController

Abortable asynchronous operations can be associated with an Effect lifecycle.

```tsx
useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, {
        signal: controller.signal,
    }).catch(error => {
        if (error.name !== "AbortError") {
            throw error;
        }
    });

    return () => {
        controller.abort();
    };
}, [userId]);
```

When the Effect becomes obsolete, the controller aborts the operation associated with the previous synchronization.

Cancellation is particularly useful when the external operation supports abort semantics.

Cleanup does not magically cancel arbitrary asynchronous JavaScript. The underlying operation must provide a
cancellation mechanism or the application must otherwise ignore obsolete results.

## Cleanup Is Not the Same as Ignoring Results

Consider:

```tsx
useEffect(() => {
    let active = true;

    fetchUser(userId).then(user => {
        if (active) {
            setUser(user);
        }
    });

    return () => {
        active = false;
    };
}, [userId]);
```

The cleanup prevents the callback from applying an obsolete result, but it does not necessarily cancel the underlying
request.

This distinction matters.

There are two different operations:

* cancellation stops or interrupts the external operation;
* invalidation prevents an obsolete result from affecting current state.

If the underlying API supports cancellation, cleanup can often perform both.

## Cleanup and Race Conditions

Cleanup can participate in preventing stale asynchronous results.

```tsx
useEffect(() => {
    let cancelled = false;

    loadUser(userId).then(user => {
        if (!cancelled) {
            setUser(user);
        }
    });

    return () => {
        cancelled = true;
    };
}, [userId]);
```

When `userId` changes, the previous Effect's cleanup invalidates its callback.

The request may still complete, but its result no longer belongs to the current synchronization.

For operations that support true cancellation, an abort mechanism is generally preferable because it can also release
external resources.

## Cleanup and Async Effects

The Effect callback itself should not be made `async` merely to perform asynchronous setup and cleanup.

Do not write:

```tsx
useEffect(async () => {
    // ...
}, []);
```

An Effect callback is expected to return either nothing or a cleanup function, not a Promise.

Instead, define the asynchronous operation inside the Effect:

```tsx
useEffect(() => {
    let cancelled = false;

    async function load() {
        const result = await fetchData();

        if (!cancelled) {
            setData(result);
        }
    }

    load();

    return () => {
        cancelled = true;
    };
}, []);
```

If the operation supports cancellation, combine the lifecycle with an appropriate cancellation primitive.

## Cleanup Must Be Synchronous

The cleanup function itself is expected to perform synchronous teardown.

```tsx
useEffect(() => {
    const resource = acquire();

    return () => {
        resource.release();
    };
}, []);
```

Do not return a Promise as cleanup:

```tsx
useEffect(() => {
    const resource = acquire();

    return async () => {
        await resource.release();
    };
}, []);
```

If an external API has asynchronous shutdown semantics, the architecture must account for that separately rather than
assuming React will await the cleanup.

Cleanup should initiate the necessary teardown without making the React Effect lifecycle depend on an asynchronously
returned Promise.

## Cleanup Should Be Idempotent

Cleanup should ideally be safe if its teardown operation is encountered more than once or if the underlying resource is
already inactive.

```tsx
return () => {
    subscription.unsubscribe();
};
```

If the subscription implementation can safely tolerate repeated `unsubscribe` calls, the lifecycle becomes more robust.

Likewise:

```tsx
return () => {
    controller.abort();
};
```

Aborting an already-aborted controller is safe.

Idempotence is valuable because development-time lifecycle behavior can expose incorrect assumptions about setup and
teardown.

## Cleanup and Strict Mode

Development behavior under Strict Mode can expose Effect implementations that are not correctly symmetrical.

An Effect may be subjected to an additional setup-and-cleanup cycle during development to help reveal unsafe side
effects.

```tsx
useEffect(() => {
    const connection = connect();

    return () => {
        connection.disconnect();
    };
}, []);
```

A correctly implemented Effect should tolerate this lifecycle.

The correct response is not to add flags that suppress cleanup or hide the additional setup. The correct response is to
make setup and cleanup correctly mirror each other.

Strict Mode can therefore be useful for finding lifecycle bugs that would otherwise remain hidden.

## Cleanup and Component Identity

Effect cleanup is directly affected by component identity.

If a component identity is preserved, an Effect can remain associated with the same component instance while
dependencies determine whether its synchronization must be replaced.

If the component identity is replaced, the old component's active Effects are cleaned up and the new instance
establishes its own Effects.

```tsx
<Editor key={documentId} documentId={documentId}/>
```

Changing the key can therefore cause the old editor's Effects to clean up even if the new editor uses identical
implementation code.

Component identity determines instance lifetime; Effect dependencies determine synchronization lifetime within that
instance.

## Cleanup and Remounting

A deliberate remount can therefore be used to reset an entire Effect lifecycle.

```tsx
<Chat key={conversationId} conversationId={conversationId}/>
```

Changing `conversationId` can replace the `Chat` instance.

Its existing connections, subscriptions, observers, and other Effect-owned resources are cleaned up with the old
instance.

This can be correct when changing conversations represents a genuinely new lifecycle.

It is not a substitute for correctly expressing dependencies when the same component instance should simply synchronize
with changed inputs.

## Cleanup and State

Cleanup should generally not be used to perform ordinary state resets.

```tsx
useEffect(() => {
    return () => {
        setValue("");
    };
}, []);
```

This is usually a sign that component lifecycle and state ownership are being conflated.

If the value belongs to the component and should reset when the component is replaced, component identity already
provides that reset.

If the value needs to change because application state changed, an explicit state transition or synchronization
mechanism is usually more appropriate.

Cleanup exists primarily to release external resources.

## Cleanup and State Updates

A cleanup function can technically execute code that interacts with state, but state updates during teardown require
careful justification.

For example, cleanup should not normally be used as a generic notification that a component is disappearing.

```tsx
return () => {
    setOpen(false);
};
```

If the component itself is being removed, updating its own state provides no useful lifecycle continuity because that
instance is already being discarded.

Cleanup should instead terminate external relationships established by the Effect.

## Cleanup and Stale Closures

Cleanup closes over the values available to the Effect that created it.

```tsx
useEffect(() => {
    const connection = connect(roomId);

    return () => {
        connection.disconnect();
    };
}, [roomId]);
```

The cleanup for the old Effect retains the `connection` created by that Effect.

This is precisely what makes the setup and teardown pair correct. The cleanup does not need to discover which connection
is current; it already owns the connection established by its corresponding setup.

Avoid mutable global variables that cause cleanup to accidentally target a newer resource.

## Avoid Shared Mutable Resource References

This pattern is dangerous:

```tsx
let connection: Connection | null = null;

useEffect(() => {
    connection = connect(roomId);

    return () => {
        connection?.disconnect();
    };
}, [roomId]);
```

The cleanup can potentially operate on a resource that was established by a later synchronization rather than the
resource created by the Effect instance being cleaned up.

Prefer lexical ownership:

```tsx
useEffect(() => {
    const connection = connect(roomId);

    return () => {
        connection.disconnect();
    };
}, [roomId]);
```

Each Effect instance owns the resource it created.

## Cleanup and Resource Leaks

A missing cleanup can create resource leaks.

```tsx
useEffect(() => {
    const unsubscribe = subscribe(handleChange);

    // Missing cleanup
}, []);
```

Repeated mounting or synchronization can accumulate subscriptions.

The resulting leak may manifest as:

* multiple callbacks;
* stale data;
* retained component references;
* unnecessary network activity;
* unnecessary CPU usage;
* memory growth;
* duplicate side effects.

The cleanup function establishes a clear ownership boundary that prevents these resources from outliving their intended
synchronization.

## Cleanup and Duplicate Resources

Incorrect dependency management can also create overlapping resources.

```tsx
useEffect(() => {
    const socket = new WebSocket(url);

    socket.addEventListener("message", handleMessage);

    return () => {
        socket.close();
    };
}, [url]);
```

The cleanup ensures that when `url` changes, the previous socket is closed before the new synchronization takes over.

Without cleanup, multiple sockets could remain active simultaneously.

## Cleanup and Dependency Completeness

Cleanup does not compensate for incorrect dependencies.

```tsx
useEffect(() => {
    const connection = connect(roomId);

    return () => {
        connection.disconnect();
    };
}, []);
```

If `roomId` is intended to control the connection, omitting it means the Effect does not synchronize with changes to
`roomId`.

The cleanup will still clean up the connection when the component is removed, but the Effect can remain connected to
obsolete external state during the component's lifetime.

Cleanup and dependency correctness are separate requirements.

## Cleanup and Stable Callbacks

Callback identity can influence when an Effect is recreated.

```tsx
useEffect(() => {
    const unsubscribe = subscribe(handleChange);

    return unsubscribe;
}, [handleChange]);
```

If `handleChange` receives a new reference on every render, the Effect may repeatedly unsubscribe and resubscribe.

This does not necessarily make the code incorrect, but it may produce unnecessary synchronization.

The solution should be based on the actual dependency semantics rather than arbitrarily suppressing dependencies.

Memoization or alternative Effect design may be appropriate when stable callback identity is genuinely required.

## Cleanup and Event Handler Freshness

Cleanup must remove the same listener that setup registered.

```tsx
useEffect(() => {
    const handler = (event: Event) => {
        handleEvent(event);
    };

    target.addEventListener("event", handler);

    return () => {
        target.removeEventListener("event", handler);
    };
}, [handleEvent]);
```

Defining the handler inside the Effect gives setup and cleanup a shared lexical reference.

This makes listener ownership explicit and avoids accidentally attempting to remove a different function object.

## Cleanup and DOM Manipulation

Effects that imperatively manipulate DOM resources should reverse their work when appropriate.

```tsx
useEffect(() => {
    const observer = new MutationObserver(handleMutations);

    observer.observe(element, {
        childList: true,
        subtree: true,
    });

    return () => {
        observer.disconnect();
    };
}, [element]);
```

Not every DOM operation requires cleanup. For example, setting a property that React or the browser naturally owns does
not automatically imply that a cleanup function is necessary.

Cleanup is required when the Effect establishes a persistent external relationship or resource that otherwise survives
beyond the intended synchronization.

## Cleanup and Third-Party Instance Replacement

When an Effect creates an imperative instance from an input, changing that input may require destruction and recreation.

```tsx
useEffect(() => {
    const chart = createChart(container, options);

    return () => {
        chart.destroy();
    };
}, [container, options]);
```

If `options` changes frequently, this can destroy and recreate the chart frequently.

That may be correct if the external library's API requires reconstruction, but it may also indicate that the Effect
should synchronize the existing chart instance incrementally.

Cleanup is not inherently a signal that the entire external resource must be recreated for every update. The correct
lifecycle depends on the external system's API.

## Cleanup and Incremental Synchronization

Some resources should remain alive while their configuration changes.

```tsx
useEffect(() => {
    const chart = createChart(container);

    return () => {
        chart.destroy();
    };
}, [container]);

useEffect(() => {
    chart.setOptions(options);
}, [chart, options]);
```

The exact implementation depends on how the external library exposes its lifecycle.

The architectural principle is to distinguish resource lifetime from resource configuration.

A connection may remain alive while its subscriptions change. A chart instance may remain alive while its data changes.
An observer may remain alive while its observed target changes.

Cleanup should correspond to the resource lifetime, not automatically to every value change.

## Cleanup and Multiple Effects

A component can have multiple independent Effects.

```tsx
useEffect(() => {
    const unsubscribe = subscribe(handleStoreChange);

    return unsubscribe;
}, [handleStoreChange]);

useEffect(() => {
    const timer = setInterval(refresh, 1000);

    return () => {
        clearInterval(timer);
    };
}, [refresh]);
```

Each Effect owns its own synchronization and cleanup.

Do not combine unrelated resources merely because they happen to belong to the same component.

Separate Effects can make resource ownership and lifecycle boundaries clearer.

## Cleanup and Effect Separation

An Effect should ideally represent one coherent synchronization relationship.

For example:

```tsx
useEffect(() => {
    const connection = connect(roomId);

    return () => {
        connection.disconnect();
    };
}, [roomId]);
```

A separate Effect can own an unrelated browser listener.

This makes it possible for one dependency change to replace one synchronization without unnecessarily tearing down
unrelated resources.

Cleanup is consequently easier to reason about when Effects have narrow responsibilities.

## Cleanup and Error Handling

Cleanup should also account for resources that may fail during setup.

```tsx
useEffect(() => {
    const resource = createResource();

    resource.start();

    return () => {
        resource.stop();
    };
}, []);
```

If setup can throw before the resource is fully established, the cleanup strategy should be compatible with the
resource's actual lifecycle.

External libraries may expose partially initialized resources, asynchronous initialization, or failure states. Cleanup
should follow the library's contract rather than assuming that every setup operation completed successfully.

## Cleanup and Cancellation

Cancellation is a resource-lifecycle concern.

For example:

```tsx
useEffect(() => {
    const controller = new AbortController();

    requestData({
        signal: controller.signal,
    });

    return () => {
        controller.abort();
    };
}, []);
```

The cleanup says that the request is no longer relevant to this Effect lifecycle.

Cancellation is particularly important for:

* network requests;
* streaming operations;
* observers;
* subscriptions;
* worker communication;
* long-running external computations.

The external API must actually support cancellation for cleanup to terminate the underlying operation.

## Cleanup and Workers

Worker resources can be terminated from cleanup when their lifetime belongs to the component.

```tsx
useEffect(() => {
    const worker = new Worker("/worker.js");

    worker.onmessage = handleMessage;

    return () => {
        worker.terminate();
    };
}, []);
```

Without cleanup, the worker can continue consuming resources after the component is removed.

The same ownership principle applies: the Effect creates the worker and therefore owns its lifecycle.

## Cleanup and Global Resources

Global resources require special care.

```tsx
useEffect(() => {
    globalRegistry.register(id, handler);

    return () => {
        globalRegistry.unregister(id);
    };
}, [id, handler]);
```

The cleanup must remove only the registration belonging to the current component instance.

Global mutable systems increase the risk of cleanup accidentally removing another component's resource.

Resource identifiers should therefore be scoped and ownership should be explicit.

## Cleanup and Shared Resources

Not every resource should be destroyed by every component that uses it.

Consider a shared connection:

```tsx
const connection = sharedConnection();

useEffect(() => {
    const unsubscribe = connection.subscribe(handleMessage);

    return unsubscribe;
}, [connection, handleMessage]);
```

The component owns its subscription, not necessarily the shared connection itself.

Destroying the shared connection from every consumer's cleanup would violate resource ownership.

This distinction is important for caches, shared clients, singleton-like services, and external stores.

The component should clean up the resource it actually owns.

## Cleanup and Reference Counting

Shared resources may require a higher-level ownership mechanism.

```tsx
const release = acquireSharedResource(key);

return () => {
    release();
};
```

The component acquires a reference and cleanup releases that reference.

The resource itself can remain alive while other consumers still depend on it.

This separates consumer lifetime from shared-resource lifetime.

## Cleanup and Context-Based Dependencies

When an Effect consumes a dependency through Context, cleanup remains the responsibility of the component or abstraction
that established the particular external relationship.

```tsx
function Component() {
    const client = useApiClient();

    useEffect(() => {
        const unsubscribe = client.subscribe(handleChange);

        return unsubscribe;
    }, [client, handleChange]);

    return null;
}
```

The component owns the subscription.

It does not necessarily own the client.

The distinction prevents consumers from destroying provider-owned resources during their own cleanup.

## Cleanup and Dependency Injection

A dependency injected into an Effect can have a lifecycle independent from the Effect.

```tsx
function Feature() {
    const service = useService();

    useEffect(() => {
        const handle = service.startFeature();

        return () => {
            handle.stop();
        };
    }, [service]);

    return null;
}
```

The service may be provider-owned, while the feature-specific operation is Effect-owned.

Cleanup should terminate the feature operation rather than destroy the service itself.

## Cleanup and Server Rendering

Effects do not run during server rendering in the same way they do in the browser because Effects are tied to
client-side synchronization.

Consequently, cleanup is a client lifecycle mechanism.

Server-side resource management should not be modeled as though an Effect will eventually execute and clean it up.

Server resources require the lifecycle mechanisms of the server execution environment.

This distinction is particularly important in applications using Server Components, where server-side execution and
browser-side Effects belong to different lifecycle domains.

## Cleanup and Hydration

Hydration establishes client-side React behavior around server-rendered output.

Effects become part of the client lifecycle after the relevant component is active on the client.

Cleanup therefore belongs to the client-side Effect lifecycle rather than the server-rendering phase.

Hydration and cleanup should not be treated as interchangeable lifecycle mechanisms.

## Cleanup and Suspense

Suspense controls rendering readiness and fallback behavior.

An Effect's cleanup concerns external synchronization associated with a committed component lifecycle.

Suspending during rendering should not be interpreted as ordinary Effect cleanup.

Likewise, displaying a Suspense fallback should not be treated as equivalent to manually unmounting every suspended
component in application-level reasoning.

The precise lifecycle depends on the React rendering model and the component's committed state.

## Cleanup and Visibility

A component becoming visually hidden is not necessarily equivalent to being unmounted.

```tsx
<div hidden={hidden}>
    <Panel/>
</div>
```

The `Panel` component may remain mounted and its Effects may remain active.

If an external resource should stop while the UI is merely hidden, that requirement must be represented explicitly.

Do not assume that visual disappearance automatically triggers cleanup.

## Cleanup and Conditional Rendering

Conditional rendering can remove a component from the tree:

```tsx
{
    showChat && <Chat/>
}
```

When `showChat` becomes false and the `Chat` instance is removed, its active Effects are cleaned up.

If the component remains present but changes behavior:

```tsx
<Chat paused={paused}/>
```

the component identity can remain intact and the Effect should synchronize according to its dependencies.

These are different lifecycle semantics.

## Cleanup and Component Identity Reset

A key change can deliberately replace a component:

```tsx
<Chat key={conversationId} conversationId={conversationId}/>
```

This can cause the previous instance's Effect cleanup to run and the new instance's Effects to establish new external
relationships.

This is one reason deliberate remounting should be used carefully. It can tear down every Effect owned by the replaced
subtree, not merely reset one piece of state.

## Cleanup and Testing

Effect cleanup should be directly testable through observable resource behavior.

For example, a subscription can be mocked:

```tsx
const unsubscribe = vi.fn();

subscribe.mockReturnValue(unsubscribe);
```

After the component is removed or the relevant dependency changes, the test can verify that the subscription was
released.

Tests should verify lifecycle behavior rather than merely asserting that a cleanup function exists.

Useful test cases include:

* resource is released on unmount;
* previous resource is released before replacement;
* changing relevant dependencies replaces the resource;
* unrelated renders do not unnecessarily recreate the resource;
* obsolete asynchronous results are ignored or cancelled;
* cleanup does not remove another consumer's resource.

## Common Misuse

Common cleanup mistakes include:

* forgetting to return cleanup for a persistent external resource;
* removing a different event-handler function than the one registered;
* closing a shared resource owned by another component;
* using cleanup to reset ordinary React state;
* assuming cleanup cancels every Promise automatically;
* returning an async cleanup function;
* hiding dependency problems with cleanup logic;
* using mutable global references to identify resources;
* recreating expensive resources when incremental synchronization would suffice;
* assuming visual hiding triggers cleanup;
* using remounting when explicit state synchronization is more appropriate;
* making cleanup responsible for resources it does not own.

## Advantages

Correct Effect cleanup prevents resource leaks and stale subscriptions.

It gives external resources a lifecycle that corresponds to React's synchronization lifecycle.

It allows Effects to safely respond to dependency changes by replacing obsolete external relationships.

It also makes ownership explicit: the code that establishes a resource defines how that resource is released.

## Disadvantages

Effect cleanup introduces lifecycle complexity because the same Effect can be established and cleaned up multiple times.

Incorrect cleanup can be worse than missing cleanup because it can terminate resources belonging to another
synchronization or consumer.

Asynchronous operations also require additional reasoning because cleanup cannot automatically cancel arbitrary
Promises.

Shared resources require clear ownership boundaries so that consumer cleanup does not accidentally destroy
provider-owned infrastructure.

## When to Use

Use cleanup whenever an Effect establishes a persistent external relationship or acquires a resource whose lifetime
should correspond to that Effect.

Typical cases include:

* event listeners;
* timers;
* subscriptions;
* sockets;
* observers;
* workers;
* abortable requests;
* imperative library instances;
* external registrations;
* resource handles;
* feature-specific subscriptions to shared services.

## When Not to Use Cleanup

Do not add cleanup merely because an Effect exists.

An Effect that performs a one-way operation without establishing a persistent external relationship may not require
cleanup.

For example:

```tsx
useEffect(() => {
    analytics.track("page-view");
}, []);
```

There may be nothing meaningful to undo.

Likewise, do not use cleanup as a general-purpose component destructor or state-reset mechanism.

The correct question is whether the Effect established something that must be stopped, removed, cancelled, disconnected,
unsubscribed, or released.

## Design Rules

1. Every persistent resource established by an Effect should have a corresponding teardown strategy.
2. Make cleanup directly reverse the setup performed by the same Effect.
3. Keep resource ownership local to the Effect that acquires the resource.
4. Do not destroy resources owned by another component or provider.
5. Include the values that determine synchronization in the Effect's dependency model.
6. Do not use cleanup to compensate for incorrect dependencies.
7. Prefer true cancellation when the underlying asynchronous operation supports it.
8. Distinguish cancellation from merely ignoring an obsolete result.
9. Keep cleanup synchronous from React's perspective.
10. Make teardown operations as idempotent as practical.
11. Separate independent resource lifecycles into separate Effects when doing so improves ownership clarity.
12. Distinguish resource lifetime from resource configuration.
13. Do not assume hiding a component causes Effect cleanup.
14. Remember that identity replacement can tear down an entire subtree's Effects.
15. Use remounting only when replacing the component lifecycle is actually intended.
16. Do not use cleanup as a generic mechanism for resetting React state.
17. Ensure cleanup targets the resource created by its corresponding setup.
18. Test cleanup through observable external behavior.

## Relationship to Other Patterns

`effect-synchronization.md` defines the broader purpose and design of Effects: synchronizing React with external
systems. This file focuses specifically on the teardown side of that synchronization.

`component-identity.md` determines when a component instance continues or is replaced. Replacing an identity causes the
old instance's active Effects to leave their lifecycle, making cleanup relevant.

`stable-keys.md` defines stable identity for rendered collections. Deliberately changing a key can indirectly cause
Effect cleanup by replacing the corresponding component instance.

`referential-stability.md` concerns stable JavaScript references. Changing a dependency reference can cause an Effect
synchronization to be replaced, but referential stability itself is not cleanup.

`memoization-hooks.md` covers `useMemo` and `useCallback`. Memoization can affect dependency identity and therefore
Effect frequency, but memoization is not a resource-lifecycle mechanism.

`external-store.md` covers subscriptions to external state through React's external-store integration. Cleanup remains
part of subscription lifecycle management, although the subscription contract is encapsulated by the external-store API.

`server-state.md` covers remote state synchronization and cache lifecycle. Effect cleanup may cancel or invalidate
individual client-side operations, but it does not define server-state ownership or cache policy.

`dependency-injection-through-context.md` covers dependency distribution and ownership boundaries. An injected service
may be provider-owned while a particular subscription or operation created through that service is Effect-owned.

`server-components.md` and `client-component-boundary.md` define server/client execution boundaries. Effect cleanup
belongs to the client-side Effect lifecycle and should not be used as a model for server-side resource management.

## Summary

Effect cleanup is the teardown mechanism associated with React's Effect synchronization lifecycle.

An Effect establishes an external relationship or resource, and its returned cleanup function releases or reverses that
relationship when the synchronization becomes obsolete or the component instance is removed.

The strongest pattern is simple:

```tsx
useEffect(() => {
    const resource = acquire();

    return () => {
        release(resource);
    };
}, [dependencies]);
```

The critical requirements are correct ownership, correct dependency semantics, and symmetrical setup and teardown.

Cleanup should not be treated as a generic component destructor, state-reset mechanism, or automatic Promise
cancellation mechanism. It exists to ensure that external resources do not outlive the synchronization or component
instance that owns them.
