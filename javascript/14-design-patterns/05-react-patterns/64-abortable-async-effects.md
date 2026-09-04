# Abortable Async Effects

Abortable async Effects are Effects that associate asynchronous work with the lifecycle of the synchronization that
initiated it and provide a mechanism for cancelling that work when it is no longer relevant.

A common example is a network request:

```tsx
useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, {
        signal: controller.signal,
    });

    return () => {
        controller.abort();
    };
}, [userId]);
```

When `userId` changes, the previous request is no longer associated with the current synchronization. Cleanup aborts
that request before the Effect establishes the new synchronization.

The important distinction is between an asynchronous operation continuing to execute and its result remaining valid.
Cancellation attempts to stop the underlying operation. Invalidation prevents an obsolete result from affecting the
current component state. Some asynchronous APIs support cancellation directly; others do not.

## Intent

Associate asynchronous work with the lifecycle of the Effect that created it.

When an Effect becomes obsolete, cancel the underlying operation when the API supports cancellation. When cancellation
is unavailable, invalidate the obsolete operation so that its result cannot update current state.

The core pattern is:

```tsx
useEffect(() => {
    const controller = new AbortController();

    startAsyncWork({
        signal: controller.signal,
    });

    return () => {
        controller.abort();
    };
}, [dependencies]);
```

The Effect owns the operation it starts, and cleanup terminates or invalidates that operation.

## Why Async Effects Need Lifecycle Ownership

Asynchronous operations can outlive the render that started them.

```tsx
useEffect(() => {
    fetchUser(userId).then(user => {
        setUser(user);
    });
}, [userId]);
```

Suppose the Effect starts a request for user `A`, then `userId` changes to `B`.

The request for `A` may complete after the request for `B`.

The application now has two operations with different semantic relevance. The old request is still executing even though
the component has moved to a new synchronization.

Without cancellation or invalidation, an obsolete result can interfere with the current state.

## AbortController

`AbortController` is the standard browser mechanism for signalling cancellation to APIs that support `AbortSignal`.

```tsx
useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, {
        signal: controller.signal,
    });

    return () => {
        controller.abort();
    };
}, [userId]);
```

The controller belongs to this Effect instance.

The corresponding signal is passed to the asynchronous operation.

Cleanup aborts the controller when the operation becomes obsolete.

## One Controller Per Effect Synchronization

The controller should normally be created inside the Effect.

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadData({
        signal: controller.signal,
    });

    return () => {
        controller.abort();
    };
}, [query]);
```

Each synchronization gets its own cancellation scope.

Do not unnecessarily share one controller across unrelated Effect instances.

A shared controller makes cancellation ownership ambiguous because one cleanup can accidentally cancel work belonging to
another synchronization.

## Cleanup Owns Cancellation

The cancellation operation should normally be returned as part of Effect cleanup.

```tsx
useEffect(() => {
    const controller = new AbortController();

    request({
        signal: controller.signal,
    });

    return () => {
        controller.abort();
    };
}, [request]);
```

This establishes a direct relationship between acquisition and release:

* the Effect starts the operation;
* the operation receives the Effect's cancellation signal;
* cleanup signals cancellation.

This is the asynchronous equivalent of unsubscribing from a subscription or disconnecting a socket.

## Cancellation on Dependency Changes

Dependencies determine when asynchronous work becomes obsolete.

```tsx
useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
    });

    return () => {
        controller.abort();
    };
}, [query]);
```

When `query` changes, the previous request belongs to the previous synchronization.

The cleanup aborts it before the new synchronization starts its request.

This prevents unnecessary requests from continuing after their associated query is no longer current.

## Cancellation on Unmount

The same mechanism applies when the component is removed.

```tsx
function User({userId}: Props) {
    useEffect(() => {
        const controller = new AbortController();

        fetch(`/api/users/${userId}`, {
            signal: controller.signal,
        });

        return () => {
            controller.abort();
        };
    }, [userId]);

    return null;
}
```

If the component is removed before the request finishes, cleanup aborts the request.

This prevents the component from retaining an unnecessary asynchronous operation after its synchronization has ended.

## Cancellation Is Not Automatic

React does not automatically cancel arbitrary asynchronous operations started inside an Effect.

```tsx
useEffect(() => {
    doSomethingAsync();
}, []);
```

Removing the component does not magically terminate `doSomethingAsync()`.

Cancellation must be supported by the operation or implemented through an explicit invalidation mechanism.

Promises themselves do not provide general cancellation merely because they are created inside an Effect.

## Cancellation Versus Invalidation

Cancellation and invalidation solve related but different problems.

Cancellation attempts to stop the underlying operation:

```tsx
controller.abort();
```

Invalidation allows the operation to finish but prevents its result from being applied:

```tsx
useEffect(() => {
    let active = true;

    loadUser(userId).then(user => {
        if (active) {
            setUser(user);
        }
    });

    return () => {
        active = false;
    };
}, [userId]);
```

Cancellation is preferable when the underlying operation supports it because it can release resources and avoid
unnecessary work.

Invalidation is still necessary for operations that cannot be cancelled or where cancellation does not guarantee that no
completion callback will execute.

## Abort Does Not Mean No Callback

Aborting an operation does not mean that every piece of already-scheduled JavaScript disappears.

For example:

```tsx
useEffect(() => {
    const controller = new AbortController();

    fetch(url, {
        signal: controller.signal,
    })
        .then(response => response.json())
        .then(data => {
            setData(data);
        })
        .catch(error => {
            setError(error);
        });

    return () => {
        controller.abort();
    };
}, [url]);
```

The Promise chain still needs to handle the rejection caused by cancellation appropriately.

Cancellation is a state transition of the underlying operation. It is not a general mechanism for terminating arbitrary
JavaScript execution.

## Handling Abort Errors

An aborted `fetch` commonly rejects with an abort-related error.

```tsx
useEffect(() => {
    const controller = new AbortController();

    fetch(url, {
        signal: controller.signal,
    })
        .then(response => response.json())
        .then(setData)
        .catch(error => {
            if (error.name === "AbortError") {
                return;
            }

            setError(error);
        });

    return () => {
        controller.abort();
    };
}, [url]);
```

Cancellation should normally not be presented to the user as an application failure when it represents an intentional
lifecycle transition.

For example, changing search queries can legitimately cancel the previous request.

## Prefer Signal State When Available

When working with abortable APIs, the signal itself can be used to identify cancellation.

```tsx
useEffect(() => {
    const controller = new AbortController();

    doWork(controller.signal)
        .catch(error => {
            if (controller.signal.aborted) {
                return;
            }

            reportError(error);
        });

    return () => {
        controller.abort();
    };
}, []);
```

This avoids relying exclusively on a particular error class or error-name representation.

The exact error handling should still follow the contract of the underlying API.

## Passing Signals Through Abstraction Layers

Cancellation should remain available when asynchronous work is wrapped by application services.

```tsx
function loadUser(
    userId: string,
    signal?: AbortSignal
) {
    return fetch(`/api/users/${userId}`, {
        signal,
    }).then(response => response.json());
}
```

The Effect can then provide its cancellation scope:

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadUser(userId, controller.signal)
        .then(setUser)
        .catch(handleError);

    return () => {
        controller.abort();
    };
}, [userId]);
```

The service does not need to know that React is using it.

It simply accepts a cancellation contract.

This keeps the React lifecycle boundary at the component while allowing cancellation to propagate into lower-level
infrastructure.

## Cancellation as a Dependency Contract

An asynchronous dependency can explicitly expose cancellation support.

```tsx
interface UserRepository {
    findById(
        id: string,
        signal?: AbortSignal
    ): Promise<User>;
}
```

The React Effect can provide the signal:

```tsx
useEffect(() => {
    const controller = new AbortController();

    repository
        .findById(userId, controller.signal)
        .then(setUser);

    return () => {
        controller.abort();
    };
}, [repository, userId]);
```

The repository owns the implementation of cancellation.

The Effect owns the lifetime of the particular operation.

This separation is especially useful when using dependency injection.

## Cancellation Through Dependency Injection

An injected service can expose abortable operations without knowing anything about React.

```tsx
interface SearchService {
    search(
        query: string,
        signal: AbortSignal
    ): Promise<Result[]>;
}
```

The component creates the lifecycle scope:

```tsx
function Search({service, query}: Props) {
    useEffect(() => {
        const controller = new AbortController();

        service
            .search(query, controller.signal)
            .then(setResults)
            .catch(handleError);

        return () => {
            controller.abort();
        };
    }, [service, query]);

    return null;
}
```

This keeps cancellation ownership aligned with the consumer's operation rather than making the service globally aware of
component lifetimes.

## Cancellation and Request Identity

Cancellation is especially useful when a changing value determines which asynchronous result is current.

```tsx
useEffect(() => {
    const controller = new AbortController();

    search(query, controller.signal)
        .then(results => {
            setResults(results);
        })
        .catch(handleError);

    return () => {
        controller.abort();
    };
}, [query]);
```

Each query receives its own request lifecycle.

When the query changes, the previous request is cancelled.

The new query establishes a new request.

This is a direct correspondence between application state and asynchronous operation identity.

## Cancellation and Race Conditions

Consider two requests:

```tsx
request("A");
request("B");
```

If request `A` finishes after request `B`, its result can overwrite the newer state unless the lifecycle prevents it.

Abortable Effects reduce this race:

```tsx
useEffect(() => {
    const controller = new AbortController();

    request(query, controller.signal)
        .then(result => {
            setResult(result);
        })
        .catch(error => {
            if (!controller.signal.aborted) {
                setError(error);
            }
        });

    return () => {
        controller.abort();
    };
}, [query]);
```

The previous request is told that its operation is no longer relevant.

For APIs where abort does not guarantee that every downstream callback is suppressed, an explicit validity check can
still be useful.

## Cancellation and Invalidation Together

The strongest pattern can combine cancellation and result invalidation.

```tsx
useEffect(() => {
    const controller = new AbortController();
    let active = true;

    loadData(controller.signal)
        .then(data => {
            if (active) {
                setData(data);
            }
        })
        .catch(error => {
            if (active && !controller.signal.aborted) {
                setError(error);
            }
        });

    return () => {
        active = false;
        controller.abort();
    };
}, []);
```

Cancellation attempts to stop the operation.

The `active` flag protects the component from an obsolete result even if the underlying operation reaches completion.

Whether both mechanisms are necessary depends on the asynchronous API and its guarantees.

## Avoid Mutable Global Cancellation State

Do not use a shared mutable variable for cancellation across Effect instances.

```tsx
let cancelled = false;

useEffect(() => {
    cancelled = false;

    doWork().then(result => {
        if (!cancelled) {
            setResult(result);
        }
    });

    return () => {
        cancelled = true;
    };
}, [query]);
```

A later Effect instance can reset the same global variable before an earlier operation completes.

The old operation can then incorrectly appear valid again.

Keep cancellation state inside the Effect closure:

```tsx
useEffect(() => {
    let cancelled = false;

    doWork().then(result => {
        if (!cancelled) {
            setResult(result);
        }
    });

    return () => {
        cancelled = true;
    };
}, [query]);
```

Each asynchronous operation receives its own lifecycle state.

## One Operation, One Lifecycle Scope

An Effect should generally establish a clear cancellation scope for the asynchronous operation it starts.

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadProfile(userId, controller.signal);

    return () => {
        controller.abort();
    };
}, [userId]);
```

This prevents cancellation ownership from becoming ambiguous.

If several operations intentionally belong to the same synchronization, they can share the controller:

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadUser(userId, controller.signal);
    loadPermissions(userId, controller.signal);

    return () => {
        controller.abort();
    };
}, [userId]);
```

Changing `userId` cancels both operations because both belong to the same synchronization lifecycle.

## Independent Operations Should Have Independent Lifetimes

If two asynchronous operations have unrelated lifetimes, they should not necessarily share a cancellation scope.

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadUser(userId, controller.signal);

    return () => {
        controller.abort();
    };
}, [userId]);

useEffect(() => {
    const controller = new AbortController();

    loadRecommendations(controller.signal);

    return () => {
        controller.abort();
    };
}, []);
```

Changing `userId` cancels only the user request.

The recommendations request remains active.

This is one reason unrelated synchronization concerns should generally be represented by separate Effects.

## Cancellation and Timeouts

Cancellation can also be used to impose a maximum lifetime.

```tsx
useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 5000);

    fetch(url, {
        signal: controller.signal,
    }).finally(() => {
        clearTimeout(timeout);
    });

    return () => {
        clearTimeout(timeout);
        controller.abort();
    };
}, [url]);
```

The request can therefore terminate either because the Effect is replaced or because its maximum duration is reached.

Where supported, an API-specific timeout or `AbortSignal.timeout()` can provide a more direct implementation.

The architectural principle remains the same: the asynchronous operation receives an explicit lifetime.

## Cancellation and User-Initiated Abort

Cancellation does not have to originate exclusively from Effect cleanup.

```tsx
function Search() {
    const [query, setQuery] = useState("");
    const controllerRef = useRef<AbortController | null>(null);

    function cancel() {
        controllerRef.current?.abort();
    }

    // ...
}
```

However, user-triggered cancellation and Effect lifecycle cancellation represent different responsibilities.

A user action may explicitly terminate an operation while the Effect cleanup terminates it because the synchronization
is obsolete.

If both mechanisms are required, they should share a clear cancellation model rather than competing through unrelated
mutable state.

## Cleanup Should Remain the Lifecycle Backstop

Even when an operation can be cancelled manually, the Effect should still clean it up when its synchronization ends.

```tsx
useEffect(() => {
    const controller = new AbortController();

    startOperation(controller.signal);

    return () => {
        controller.abort();
    };
}, [dependency]);
```

This ensures that the operation cannot outlive the Effect merely because the user did not explicitly cancel it.

The component lifecycle remains the final ownership boundary.

## Cancellation and Loading State

Cancellation should not automatically be treated as an error.

```tsx
useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    loadData(controller.signal)
        .then(data => {
            setData(data);
        })
        .catch(error => {
            if (!controller.signal.aborted) {
                setError(error);
            }
        })
        .finally(() => {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        });

    return () => {
        controller.abort();
    };
}, [query]);
```

When a request is intentionally aborted because the query changed, the UI may not need to display an error or transition
through a visible failure state.

The exact state machine depends on the application.

The important distinction is that cancellation represents lifecycle invalidation, not necessarily failure.

## Cancellation and Error Boundaries

An aborted asynchronous request should generally not be treated as an application rendering failure merely because its
Promise rejected.

```tsx
.
catch(error => {
    if (error.name !== "AbortError") {
        setError(error);
    }
});
```

Error boundaries handle rendering errors and related React error propagation.

They are not a replacement for handling expected cancellation of asynchronous operations.

Cancellation belongs to the asynchronous operation's lifecycle.

## Cancellation and Suspense

Suspense can coordinate rendering with asynchronous readiness, but Suspense itself does not automatically provide
general cancellation for arbitrary asynchronous operations created elsewhere.

An asynchronous resource abstraction may define its own cancellation semantics.

When an Effect starts the operation directly, its cleanup remains responsible for cancelling or invalidating that
operation where appropriate.

Suspense and abortable Effects therefore solve different lifecycle problems.

## Cancellation and Transitions

A transition can cause the application to request new data while an earlier request is still running.

```tsx
startTransition(() => {
    setQuery(nextQuery);
});
```

The resulting Effect can associate each query with its own abort controller.

```tsx
useEffect(() => {
    const controller = new AbortController();

    search(query, controller.signal);

    return () => {
        controller.abort();
    };
}, [query]);
```

The transition determines update priority.

The Effect determines the lifecycle of the asynchronous operation.

Neither mechanism replaces the other.

## Cancellation and Deferred Values

A deferred value can intentionally allow asynchronous work to continue using an older value while a newer value is being
processed elsewhere.

```tsx
const deferredQuery = useDeferredValue(query);

useEffect(() => {
    const controller = new AbortController();

    search(deferredQuery, controller.signal);

    return () => {
        controller.abort();
    };
}, [deferredQuery]);
```

Cancellation therefore follows the value actually used by the Effect.

The deferred value determines when the Effect receives a new input; the cleanup determines when the previous
asynchronous operation is cancelled.

## Cancellation and Server State

Applications using server-state abstractions may already have request cancellation, deduplication, caching, and
invalidation mechanisms.

An individual Effect should not independently recreate an entire server-state management system.

```tsx
useEffect(() => {
    const controller = new AbortController();

    fetch(url, {
        signal: controller.signal,
    });

    return () => {
        controller.abort();
    };
}, [url]);
```

This is appropriate when the Effect directly owns the request.

When a dedicated server-state abstraction owns the request lifecycle, cancellation should generally be delegated to that
abstraction.

The ownership boundary must remain explicit.

## Cancellation and Resource Caches

A resource cache can have multiple consumers for the same asynchronous operation.

In that situation, one component unmounting should not necessarily cancel the shared operation.

For example, if three components consume the same cached request, cancellation by one consumer could incorrectly
terminate work needed by the other two.

The cache therefore may need its own resource-lifetime policy.

Component cleanup should cancel operations that the component actually owns, not shared operations merely because the
component is one consumer.

## Cancellation and Shared Requests

Shared asynchronous operations require a distinction between:

* operation ownership;
* consumer ownership;
* cache ownership.

A component may own a subscription to a shared request without owning the request itself.

```tsx
useEffect(() => {
    const unsubscribe = resource.subscribe(handleResult);

    return unsubscribe;
}, [resource]);
```

In this case, cleanup should unsubscribe.

It should not automatically abort the shared resource unless the resource contract explicitly makes that consumer
responsible for cancellation.

## Cancellation and Reference Counting

Shared cancellable resources may require reference counting.

Conceptually:

```tsx
const release = resource.acquire(key);

return () => {
    release();
};
```

The last consumer can trigger cancellation when the resource is no longer needed.

This is an infrastructure concern rather than something every component should implement independently.

The key principle is that cancellation should follow actual ownership.

## Cancellation and React Server Components

Server Components do not use client-side Effects for their server-side lifecycle.

```tsx
async function UserPage() {
    const user = await loadUser();

    return <UserView user={user}/>;
}
```

Cancellation of server-side work belongs to the server request and framework/runtime lifecycle rather than to a client
`useEffect` cleanup function.

Client Effects are appropriate for browser-side asynchronous synchronization.

Do not transfer the client Effect cancellation model directly into server execution.

## Cancellation and Client Boundaries

Abortable Effects require a client-side Effect environment.

```tsx
"use client";

function SearchResults({query}: Props) {
    useEffect(() => {
        const controller = new AbortController();

        search(query, controller.signal);

        return () => {
            controller.abort();
        };
    }, [query]);

    return null;
}
```

The client boundary determines where browser-side Effect logic can execute.

The cancellation contract itself remains ordinary JavaScript and Web API behavior.

## Cancellation and Hydration

Hydration establishes client-side behavior around server-rendered output.

An Effect can begin its asynchronous synchronization once it participates in the client lifecycle.

If the component is replaced or removed afterward, its cleanup can cancel the operation.

Hydration does not itself define the cancellation mechanism.

## Cancellation and Strict Mode

Development-time Strict Mode can expose asynchronous Effects that do not correctly handle repeated setup and cleanup.

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadData(controller.signal);

    return () => {
        controller.abort();
    };
}, []);
```

If setup is followed by cleanup and another setup during development, the first operation should be correctly cancelled
and the second should receive its own controller.

Avoid global cancellation flags or shared controllers that assume only one lifecycle instance can exist.

## Cancellation and Component Identity

Component identity determines the lifetime of the Effect instance that owns the asynchronous operation.

```tsx
<Search key={searchMode} query={query}/>
```

Changing the key can replace the component identity.

The old Effect is then cleaned up, causing its cancellation mechanism to execute.

This means identity changes can indirectly cancel asynchronous work.

Do not use identity changes merely to obtain cancellation when changing a dependency would correctly express the actual
synchronization lifecycle.

## Cancellation and AbortSignal Composition

Complex systems may need cancellation from multiple sources.

For example, an operation may need to stop when:

* the component unmounts;
* the request times out;
* the user cancels;
* the application shuts down.

Modern Web APIs provide mechanisms for composing abort signals.

```tsx
useEffect(() => {
    const controller = new AbortController();

    const signal = AbortSignal.any([
        controller.signal,
        AbortSignal.timeout(5000),
    ]);

    loadData(signal);

    return () => {
        controller.abort();
    };
}, []);
```

The component remains responsible for its own lifecycle signal while other cancellation conditions can be combined with
it.

The exact APIs available depend on the execution environment.

## Cancellation and Generators or Custom Async Runtimes

Not every asynchronous system uses Promises or `fetch`.

A custom asynchronous abstraction may expose its own cancellation contract:

```tsx
useEffect(() => {
    const operation = worker.run(task);

    return () => {
        operation.cancel();
    };
}, [worker, task]);
```

The mechanism does not need to be `AbortController`.

The architectural requirement is that the operation expose a lifecycle-compatible cancellation or invalidation
mechanism.

## Cancellation and Async Iteration

Long-running asynchronous iterators can also require cancellation.

```tsx
useEffect(() => {
    const controller = new AbortController();

    consumeStream({
        signal: controller.signal,
        onValue: handleValue,
    });

    return () => {
        controller.abort();
    };
}, []);
```

Streaming operations are particularly important because they can remain active indefinitely.

Cleanup should terminate the stream or unsubscribe from it when the Effect no longer owns the operation.

## Cancellation and WebSockets

WebSockets are long-lived rather than one-shot asynchronous requests.

```tsx
useEffect(() => {
    const socket = new WebSocket(url);

    socket.addEventListener("message", handleMessage);

    return () => {
        socket.close();
    };
}, [url]);
```

The lifecycle mechanism is not `AbortController`, but the design is the same.

The operation exposes a termination method, and cleanup invokes it when the synchronization ends.

Abortable async Effects therefore means lifecycle-bound asynchronous work, not specifically `AbortController`.

## Cancellation and Workers

Workers similarly expose explicit termination:

```tsx
useEffect(() => {
    const worker = new Worker("/worker.js");

    worker.postMessage(task);

    return () => {
        worker.terminate();
    };
}, [task]);
```

The Effect establishes ownership of the worker.

Cleanup terminates it.

The same principle applies regardless of the underlying asynchronous primitive.

## Cancellation and Third-Party APIs

Third-party libraries may expose:

* `cancel()`;
* `abort()`;
* `unsubscribe()`;
* `close()`;
* `dispose()`;
* `destroy()`;
* `terminate()`.

Use the API's actual lifecycle contract.

```tsx
useEffect(() => {
    const operation = library.startOperation(options);

    return () => {
        operation.cancel();
    };
}, [options]);
```

Do not invent cancellation semantics where the library does not support them.

If cancellation is impossible, use invalidation where necessary.

## Cancellation Without Cancellation Support

Some asynchronous functions cannot be cancelled.

```tsx
function calculate(): Promise<Result> {
    return expensiveOperation();
}
```

The Effect can still prevent obsolete results from being applied:

```tsx
useEffect(() => {
    let active = true;

    calculate().then(result => {
        if (active) {
            setResult(result);
        }
    });

    return () => {
        active = false;
    };
}, [input]);
```

This does not stop `calculate()`.

It only defines whether the result remains relevant.

That distinction should be documented clearly when the underlying operation can be expensive or resource-intensive.

## Cancellation Does Not Solve Every Race

Cancellation reduces races but does not automatically make asynchronous state management correct.

Consider:

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadData(controller.signal)
        .then(data => transform(data))
        .then(setData);

    return () => {
        controller.abort();
    };
}, [query]);
```

The request may be abortable, but `transform(data)` is ordinary JavaScript work that may occur after the request
resolves.

If the component's synchronization becomes obsolete after the request completes but before later processing finishes,
additional invalidation logic may still be necessary.

Cancellation contracts should therefore be understood across the complete asynchronous pipeline.

## Cancellation and Promise Chains

A cancellation signal does not automatically propagate through arbitrary Promise transformations.

```tsx
loadData(signal)
    .then(transform)
    .then(saveResult);
```

Only operations that understand the signal can respond to it.

If `transform` or another stage performs its own asynchronous work, that stage may require the signal explicitly:

```tsx
loadData(signal)
    .then(data => transform(data, signal))
    .then(result => saveResult(result, signal));
```

Cancellation must be propagated through the layers that support it.

## Cancellation and Async Functions

An asynchronous helper can explicitly accept a signal:

```tsx
async function loadUser(
    userId: string,
    signal: AbortSignal
) {
    const response = await fetch(
        `/api/users/${userId}`,
        {signal}
    );

    return response.json();
}
```

The Effect supplies the signal:

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadUser(userId, controller.signal)
        .then(setUser)
        .catch(handleError);

    return () => {
        controller.abort();
    };
}, [userId]);
```

This keeps the asynchronous function reusable outside React while making its cancellation contract explicit.

## Cancellation and Error Classification

Not every rejected Promise represents a cancellation.

```tsx
.
catch(error => {
    if (isAbortError(error)) {
        return;
    }

    setError(error);
});
```

Application error handling should distinguish:

* expected cancellation;
* network failure;
* authorization failure;
* validation failure;
* server failure;
* programming errors.

Treating every rejected Promise as cancellation can hide real failures.

Treating intentional cancellation as an application error can produce noisy or incorrect UI.

## Cancellation and Loading State Races

Loading indicators can themselves become subject to stale asynchronous updates.

```tsx
useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    loadData(controller.signal)
        .then(setData)
        .catch(handleError)
        .finally(() => {
            setLoading(false);
        });

    return () => {
        controller.abort();
    };
}, [query]);
```

If the old operation reaches `finally` after a new operation has started, it may incorrectly set the current loading
state.

A validity check may be required:

```tsx
useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);

    loadData(controller.signal)
        .then(data => {
            if (active) {
                setData(data);
            }
        })
        .catch(error => {
            if (active && !controller.signal.aborted) {
                setError(error);
            }
        })
        .finally(() => {
            if (active) {
                setLoading(false);
            }
        });

    return () => {
        active = false;
        controller.abort();
    };
}, [query]);
```

Whether this complexity is necessary depends on the exact operation and state-management architecture.

## Cancellation and State Machines

Complex asynchronous workflows are often easier to reason about as explicit state machines.

For example, an operation may transition through:

* idle;
* loading;
* succeeded;
* failed;
* cancelled.

Cancellation should be represented as a meaningful lifecycle event when the UI needs to distinguish it from failure.

Do not automatically add a separate `cancelled` UI state when cancellation is merely an internal mechanism for replacing
obsolete requests.

## Cancellation and Server-State Libraries

When using a server-state library or resource abstraction, cancellation should generally remain inside that abstraction.

A component should not independently abort requests that the cache may still need for other consumers.

The correct boundary is:

```text
component lifecycle
resource consumer lifecycle
shared resource lifecycle
```

Each layer should own only the lifecycle it controls.

The exact implementation depends on the server-state architecture.

## Cancellation and Caching

Cancellation can interact with caching.

If a request is cancelled because one consumer no longer needs it, a cache may still retain the partial or in-flight
operation for other consumers.

Therefore:

* consumer cancellation does not necessarily imply cache cancellation;
* cache eviction does not necessarily imply consumer unmounting;
* request cancellation does not necessarily mean the data is invalid.

Cancellation is one part of resource lifecycle management, not a substitute for cache policy.

## Cancellation and Retry

Retries require careful cancellation semantics.

```tsx
async function retryingRequest(
    signal: AbortSignal
) {
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            return await request(signal);
        } catch (error) {
            if (signal.aborted) {
                throw error;
            }

            if (attempt === 2) {
                throw error;
            }
        }
    }
}
```

The same signal should generally propagate through retry attempts when they belong to the same operation.

If the Effect is cleaned up, the entire retry sequence should become obsolete rather than starting another attempt after
cancellation.

## Cancellation and Backoff

Retry delays must also respect cancellation.

```tsx
async function retry(
    signal: AbortSignal
) {
    await wait(1000, signal);

    return request(signal);
}
```

Otherwise an operation may remain alive during its backoff period even after the component no longer needs it.

Cancellation must therefore propagate through both the work and the waiting periods.

## Cancellation and Resource Ownership

A useful rule is:

**The owner of an asynchronous operation owns the decision to cancel it.**

If the component creates the request directly, the component's Effect normally owns its lifecycle.

If a cache owns a shared request, the cache owns the underlying request lifecycle.

If a service creates a long-lived worker, the service may own the worker while the component owns only a subscription to
its results.

Confusing these ownership levels causes accidental cancellation.

## Cancellation and Testing

Abortable Effects should be tested through observable cancellation behavior.

```tsx
const abort = vi.fn();

const controller = {
    signal: {},
    abort,
};
```

The exact test implementation depends on the abstraction being tested.

Useful tests include:

* operation receives a cancellation signal;
* cleanup cancels the operation;
* dependency changes cancel the previous operation;
* obsolete results do not update current state;
* cancellation does not appear as an application error when it is expected;
* independent operations do not cancel one another;
* shared resources are not cancelled by an unrelated consumer.

## Common Misuse

Common mistakes include:

* assuming Promises are automatically cancellable;
* assuming React cancels asynchronous work;
* creating a single global `AbortController`;
* sharing a controller across unrelated operations;
* ignoring obsolete results after an uncancellable operation;
* treating cancellation as a network or application failure;
* cancelling shared resources from individual consumers;
* failing to propagate `AbortSignal` through service layers;
* cancelling the request but not later asynchronous processing;
* allowing retry loops to continue after cancellation;
* using remounting solely as a cancellation mechanism;
* using cleanup state to hide incorrect dependencies.

## Advantages

Abortable async Effects prevent obsolete asynchronous work from unnecessarily continuing when the associated
synchronization has ended.

They reduce resource consumption and network activity when the underlying API supports cancellation.

They reduce race conditions by coupling asynchronous operations to the lifecycle of the state or dependency that
initiated them.

They also establish a clean ownership contract between React Effects and asynchronous infrastructure.

## Disadvantages

Not every asynchronous operation supports cancellation.

Cancellation APIs differ across libraries and environments.

Aborting an operation does not automatically cancel arbitrary Promise chains or JavaScript work that has already
started.

Shared requests introduce additional ownership complexity because one consumer may not own the underlying operation.

Incorrect cancellation handling can also hide real errors if every rejected operation is interpreted as an expected
abort.

## When to Use

Use abortable async Effects when an Effect starts asynchronous work whose relevance is tied to its dependencies or
component lifetime.

Typical cases include:

* `fetch` requests;
* search requests;
* autocomplete requests;
* asynchronous validation;
* streaming operations;
* worker tasks;
* long-running computations with cancellation support;
* subscription-like asynchronous APIs;
* third-party operations exposing cancellation;
* request retries and backoff;
* operations whose results become obsolete when inputs change.

## When Not to Use

Do not add an artificial cancellation mechanism when:

* the operation has no meaningful lifecycle relationship to the component;
* a shared resource is owned by another abstraction;
* a server-state library already owns the request lifecycle;
* the operation is intentionally application-global;
* there is nothing meaningful to cancel or invalidate.

In these cases, use the appropriate ownership abstraction rather than forcing component-level cancellation.

## Design Rules

1. Associate asynchronous work with the Effect synchronization that owns it.
2. Create a cancellation scope inside the Effect when the Effect owns the operation.
3. Pass the cancellation signal into APIs that support cancellation.
4. Abort or otherwise terminate the operation during cleanup.
5. Distinguish cancellation from invalidation.
6. Use invalidation when the underlying operation cannot be cancelled.
7. Keep cancellation state local to the Effect instance.
8. Do not share cancellation controllers across unrelated lifecycles.
9. Propagate cancellation through service and infrastructure layers.
10. Propagate cancellation through retry and backoff logic.
11. Do not treat expected cancellation as an application error.
12. Do not treat every rejected asynchronous operation as cancellation.
13. Do not cancel resources that the component does not own.
14. Distinguish consumer lifetime from shared-resource lifetime.
15. Consider downstream Promise processing in addition to the initial asynchronous operation.
16. Use component identity changes only when replacing the component lifecycle is actually intended.
17. Prefer explicit cancellation contracts in reusable asynchronous APIs.
18. Test both cancellation and protection against obsolete results.

## Relationship to Other Patterns

`effect-synchronization.md` defines why Effects exist and how they synchronize React with external systems. This file
specializes that lifecycle to asynchronous operations that need cancellation or invalidation.

`effect-cleanup.md` defines the general teardown mechanism. Abortable async Effects use that cleanup mechanism to cancel
or invalidate asynchronous work.

`component-identity.md` determines the lifetime of the component instance that owns the Effect. Replacing that identity
causes the corresponding asynchronous Effect lifecycle to end.

`stable-keys.md` defines stable identity for collections. Changing a key can indirectly cause an async Effect to clean
up, but keys are not an asynchronous cancellation mechanism.

`server-state.md` defines ownership and lifecycle of remote application state. When a server-state abstraction owns
requests, component-level Effects should not independently assume ownership of those requests.

`resource-cache.md` defines shared resource identity, reuse, in-flight work, and cache lifecycle. A consumer leaving the
tree does not necessarily mean that a cached or shared asynchronous operation should be cancelled.

`external-store.md` defines subscriptions to external state. Cleanup of those subscriptions is related to lifecycle
management, but an external store generally owns its underlying state rather than the consuming component.

`dependency-injection-through-context.md` defines how asynchronous services can be supplied through React Context. An
injected service can expose an `AbortSignal`-accepting contract while the consuming Effect owns the lifetime of the
specific operation.

`transition.md` defines update priority. A transition can cause different asynchronous work to become relevant, but
cancellation remains the responsibility of the asynchronous lifecycle.

`deferred-value.md` defines consumer-side value deferral. An async Effect can synchronize against a deferred value and
cancel work when that deferred value changes.

`suspense-boundary.md` concerns rendering readiness. Suspense and cancellation can coexist, but Suspense is not a
general-purpose cancellation mechanism.

`server-components.md` defines server-side component execution. Server-side asynchronous work follows server request and
runtime lifecycles rather than client Effect cleanup.

`client-component-boundary.md` defines where browser-side React behavior can execute. Abortable Effects are client-side
lifecycle mechanisms when implemented through browser APIs such as `AbortController`.

## Summary

Abortable async Effects bind asynchronous work to the lifecycle of the Effect that owns it.

The fundamental implementation is:

```tsx
useEffect(() => {
    const controller = new AbortController();

    performAsyncWork(controller.signal);

    return () => {
        controller.abort();
    };
}, [dependencies]);
```

The cancellation signal establishes a lifecycle contract between the Effect and the asynchronous operation.

Cancellation should be distinguished from invalidation. Cancellation attempts to terminate the underlying operation;
invalidation prevents an obsolete result from affecting current state when termination is unavailable or insufficient.

The most important architectural rule is ownership. The component should cancel operations it owns, while shared caches,
services, and external resources should retain control over resources they own.

Abortable async Effects are therefore not merely about avoiding warnings or preventing stale state updates. They are
about giving asynchronous work a precise lifetime that corresponds to the lifecycle of the synchronization that made
that work relevant.
