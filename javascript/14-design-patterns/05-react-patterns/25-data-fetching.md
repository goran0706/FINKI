# Data Fetching

Data fetching is the pattern of obtaining asynchronous data from an external source and integrating the result into a
React component's rendering lifecycle.

The external source may be an HTTP API, database-backed service, GraphQL endpoint, browser API, or another asynchronous
data provider.

The core problem is not the transport mechanism itself. The problem is coordinating asynchronous work with React
rendering while correctly representing loading, success, and failure states.

## Intent

Use a data-fetching pattern when a component or feature needs to obtain data asynchronously and render according to the
current request lifecycle.

A minimal implementation can use an Effect and local state:

```tsx
function UserProfile({userId}: { userId: string }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);
        setError(null);

        fetchUser(userId)
            .then((result) => {
                if (!cancelled) {
                    setUser(result);
                }
            })
            .catch((reason) => {
                if (!cancelled) {
                    setError(toError(reason));
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [userId]);

    if (loading) {
        return <Spinner/>;
    }

    if (error) {
        return <ErrorMessage error={error}/>;
    }

    if (!user) {
        return null;
    }

    return <Profile user={user}/>;
}
```

The component renders from the current asynchronous state rather than assuming that the requested data is immediately
available.

## Request Lifecycle

A data-fetching operation normally has several meaningful states:

```tsx
type RequestState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: Error };
```

These states represent the lifecycle of the request rather than the shape of the fetched data.

A component can then render explicitly:

```tsx
function UserProfile({
                         state,
                     }: {
    state: RequestState<User>;
}) {
    switch (state.status) {
        case "idle":
            return null;

        case "loading":
            return <Spinner/>;

        case "error":
            return <ErrorMessage error={state.error}/>;

        case "success":
            return <Profile user={state.data}/>;
    }
}
```

Explicit request states prevent ambiguous combinations such as `loading === false` with neither data nor an error.

## Loading State

Loading is a state of the request, not necessarily a state of the data.

A component may need to distinguish between:

* no request has started;
* a request is currently loading;
* an existing result is being refreshed;
* a request succeeded;
* a request failed.

A simple boolean can be sufficient for straightforward fetching:

```tsx
const [loading, setLoading] = useState(false);
```

More complex components often benefit from a richer state model.

```tsx
type Status = "idle" | "loading" | "success" | "error";
```

The appropriate representation depends on how many lifecycle distinctions the UI actually needs.

## Initial Loading Versus Refreshing

A request can be loading while no data exists:

```tsx
if (loading && data === null) {
    return <Spinner/>;
}
```

It can also be loading while previous data remains available:

```tsx
if (loading && data !== null) {
    return (
        <>
            <Profile user={data}/>
            <RefreshingIndicator/>
        </>
    );
}
```

These are different user experiences.

Replacing already available content with a full-page loading state during every refresh can create unnecessary visual
disruption.

The distinction becomes especially important once request coordination and caching are introduced, but the underlying
lifecycle distinction belongs to data fetching itself.

## Fetching in an Effect

A common client-side implementation starts the request from an Effect.

```tsx
function UserProfile({userId}: { userId: string }) {
    const [state, setState] =
        useState<RequestState<User>>({
            status: "idle",
        });

    useEffect(() => {
        let active = true;

        setState({status: "loading"});

        fetchUser(userId)
            .then((user) => {
                if (active) {
                    setState({
                        status: "success",
                        data: user,
                    });
                }
            })
            .catch((error) => {
                if (active) {
                    setState({
                        status: "error",
                        error: toError(error),
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [userId]);

    // ...
}
```

The Effect establishes synchronization between the component lifecycle and an external asynchronous operation.

The dependency array determines when the request should be restarted.

## Dependency-Driven Fetching

A request usually depends on one or more inputs.

```tsx
useEffect(() => {
    fetchUser(userId);
}, [userId]);
```

When `userId` changes, the component needs data corresponding to the new identifier.

The dependency list therefore expresses which rendered inputs determine the request.

Missing a request dependency can leave the component displaying data for an obsolete input.

Including unstable values that do not semantically define the request can cause unnecessary requests.

The request dependency should correspond to the actual query identity.

## Query Parameters

Fetching often depends on multiple parameters.

```tsx
function SearchResults({
                           query,
                           page,
                       }: {
    query: string;
    page: number;
}) {
    useEffect(() => {
        fetchResults({
            query,
            page,
        });
    }, [query, page]);

    // ...
}
```

All values that determine the requested resource should participate in request identity.

A useful conceptual model is that:

```tsx
{
    query,
        page,
}
```

defines which resource is being requested.

This becomes the foundation for request deduplication and caching in later patterns.

## Race Conditions

Asynchronous requests can complete in a different order from the order in which they were started.

Suppose the component requests:

```text
userId = "1"
```

and then quickly requests:

```text
userId = "2"
```

If the request for `"1"` completes after the request for `"2"`, blindly committing both results can display stale data.

A simple guard can prevent an obsolete request from updating state:

```tsx
useEffect(() => {
    let active = true;

    fetchUser(userId).then((user) => {
        if (active) {
            setUser(user);
        }
    });

    return () => {
        active = false;
    };
}, [userId]);
```

The cleanup invalidates the previous request's ability to commit its result.

This prevents stale state commits, but it does not necessarily stop the underlying network operation.

## Cancellation

When the underlying API supports cancellation, the request should often be actively cancelled when it becomes
irrelevant.

For `fetch`, `AbortController` provides a standard mechanism:

```tsx
useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, {
        signal: controller.signal,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Request failed");
            }

            return response.json();
        })
        .then((user) => {
            setUser(user);
        })
        .catch((error) => {
            if (error.name !== "AbortError") {
                setError(error);
            }
        });

    return () => {
        controller.abort();
    };
}, [userId]);
```

Cancellation addresses resource ownership: when the component no longer needs a request, it can signal that the
operation should stop.

Cancellation and stale-result prevention are related but distinct concerns. A request can be cancelled unsuccessfully,
and a request that cannot be cancelled can still be prevented from committing stale results.

## Request Ownership

A component should not assume that it owns a request simply because it initiated one.

The appropriate owner depends on the lifetime of the data.

If data exists only for one component instance, local fetching can be appropriate.

If several components need the same request or result, fetching separately from each component may cause duplicate work
and inconsistent state.

At that point, the request may belong at a higher application boundary or in a shared data-management mechanism.

This distinction is the beginning of the separation between local data fetching and server-state management.

## Cleanup

Asynchronous work can outlive the render that initiated it.

Cleanup should therefore release or invalidate work that is no longer relevant.

For cancellable requests:

```tsx
useEffect(() => {
    const controller = new AbortController();

    loadData({
        signal: controller.signal,
    });

    return () => {
        controller.abort();
    };
}, []);
```

For non-cancellable promises:

```tsx
useEffect(() => {
    let active = true;

    loadData().then((data) => {
        if (active) {
            setData(data);
        }
    });

    return () => {
        active = false;
    };
}, []);
```

The cleanup strategy should match the actual capabilities of the asynchronous dependency.

## Error Handling

Network requests can fail for many reasons:

* transport failure;
* timeout;
* cancellation;
* authentication failure;
* authorization failure;
* server error;
* malformed response;
* client-side parsing failure.

A fetching component should distinguish expected request failures from cancellation when the underlying API provides
that distinction.

```tsx
fetch(url, {signal})
    .then(parseResponse)
    .then(setData)
    .catch((error) => {
        if (error.name === "AbortError") {
            return;
        }

        setError(error);
    });
```

Errors should become explicit rendering state when the component is responsible for presenting the request result.

Error Boundary is a separate concern. An Error Boundary handles rendering errors; it does not automatically replace
ordinary asynchronous request-state handling.

## HTTP Response Validation

`fetch()` resolving does not necessarily mean that the HTTP request succeeded.

For example:

```tsx
const response = await fetch(url);

if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
}

const data = await response.json();
```

The fetching layer should define what constitutes a successful response before exposing the resulting data to the
component.

This keeps transport-level interpretation separate from rendering.

## Response Parsing

Fetching raw transport data is not always equivalent to obtaining application data.

```tsx
const response = await fetch(url);

if (!response.ok) {
    throw new Error("Request failed");
}

const payload = await response.json();
const user = parseUser(payload);
```

Parsing or validation can establish an application-level data contract.

The component should preferably consume meaningful domain data rather than understand transport-specific response
structures.

## Loading Multiple Resources

A component may need multiple independent resources.

```tsx
function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Fetch both resources.
}
```

If both resources are required before rendering the main view, the component needs to represent their combined
lifecycle.

For independent resources, fetching can often occur concurrently:

```tsx
const [user, notifications] = await Promise.all([
    fetchUser(userId),
    fetchNotifications(userId),
]);
```

Sequentially fetching independent resources unnecessarily increases latency.

The request structure should reflect actual dependency relationships.

## Dependent Requests

Some requests genuinely depend on earlier results.

```tsx
const user = await fetchUser(userId);
const permissions = await fetchPermissions(user.organizationId);
```

The second request cannot begin until the first has produced the required identifier.

Dependency-driven sequencing is appropriate in this case.

Do not introduce sequential fetching merely because the requests happen to be written one after another.

## Parallel Requests

Independent resources should generally be requested concurrently.

```tsx
const userPromise = fetchUser(userId);
const settingsPromise = fetchSettings(userId);

const [user, settings] = await Promise.all([
    userPromise,
    settingsPromise,
]);
```

This reduces total waiting time when both operations can execute independently.

A data-fetching implementation should distinguish actual data dependencies from incidental code ordering.

## Request Functions

The transport operation should usually be isolated from the component.

```tsx
async function fetchUser(userId: string): Promise<User> {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch user");
    }

    return response.json();
}
```

The component then coordinates the lifecycle:

```tsx
useEffect(() => {
    fetchUser(userId)
        .then(setUser)
        .catch(setError);
}, [userId]);
```

This separation prevents components from becoming responsible for every detail of HTTP communication.

The fetching function can contain request construction, response parsing, and transport-specific handling while the
component owns the rendering lifecycle.

## Encapsulating Fetching Logic

Repeated lifecycle logic can be extracted into a custom Hook.

```tsx
function useUser(userId: string) {
    const [state, setState] =
        useState<RequestState<User>>({
            status: "idle",
        });

    useEffect(() => {
        const controller = new AbortController();

        setState({status: "loading"});

        fetchUser(userId, controller.signal)
            .then((user) => {
                setState({
                    status: "success",
                    data: user,
                });
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    setState({
                        status: "error",
                        error: toError(error),
                    });
                }
            });

        return () => {
            controller.abort();
        };
    }, [userId]);

    return state;
}
```

The Hook can then be consumed by multiple components.

```tsx
function UserProfile({userId}: { userId: string }) {
    const state = useUser(userId);

    // Render according to state.
}
```

The Hook encapsulates fetching behavior but does not automatically provide shared caching or deduplication.

If multiple Hook instances independently fetch the same resource, each instance may still perform its own request.

## Avoiding Waterfalls

A common performance problem is initiating data fetching only after a child component mounts.

```tsx
function Parent() {
    return <Child/>;
}

function Child() {
    useEffect(() => {
        fetchData();
    }, []);

    // ...
}
```

If several nested components perform their own dependent fetching, data acquisition can become sequential across the
component tree.

The application can often reduce this by moving data requirements toward an appropriate boundary or by starting
independent requests earlier.

The correct solution depends on ownership and rendering architecture rather than simply moving every request into one
component.

## Fetching and Rendering

Fetching should be modeled as asynchronous input to rendering.

```tsx
function UserProfile({userId}: Props) {
    const state = useUser(userId);

    switch (state.status) {
        case "loading":
            return <Spinner/>;

        case "error":
            return <ErrorMessage error={state.error}/>;

        case "success":
            return <Profile user={state.data}/>;
    }
}
```

The render function should not assume that asynchronous data is immediately available.

This keeps rendering deterministic with respect to the current request state.

## Fetching and Effects

An Effect is one mechanism for connecting a client component to asynchronous external work.

It is not synonymous with data fetching.

The same data requirement can be implemented through other architectures, including framework-level loaders, server
rendering, server components, Suspense-based resource mechanisms, or dedicated data-fetching libraries.

Therefore the pattern is broader than:

```tsx
useEffect(() => {
    fetch(...);
}, []);
```

The essential concern is coordinating asynchronous data acquisition with the application's rendering architecture.

## Client-Side Fetching

Client-side fetching is appropriate when the browser must obtain data after the application has loaded or when the data
depends on client-only information.

Examples include:

* user interaction;
* browser state;
* client-only authentication context;
* search queries;
* progressively loaded application data;
* data that should not block initial rendering.

The component can initiate the request when the relevant client-side conditions are available.

## Server-Side Data Acquisition

Some data requirements are better satisfied before or during server rendering.

For example, a server-rendering architecture may obtain data before producing the initial UI.

The resulting component may receive the data as input rather than initiate the request itself.

```tsx
function UserProfile({user}: { user: User }) {
    return <Profile user={user}/>;
}
```

The component is still displaying fetched data, but the fetching responsibility exists outside the component.

This is important because data fetching is an architectural concern, not necessarily a component-local Effect.

## Suspense Integration

Suspense-based architectures can represent asynchronous data dependencies without manually rendering a loading branch
inside every component.

A conceptual component may consume data that an external resource system coordinates:

```tsx
function UserProfile() {
    const user = resource.read();

    return <Profile user={user}/>;
}
```

The loading UI can then be supplied by a surrounding Suspense boundary.

```tsx
<Suspense fallback={<Spinner/>}>
    <UserProfile/>
</Suspense>
```

Suspense changes how asynchronous rendering is coordinated. It does not itself define request caching, deduplication, or
server-state ownership.

Those concerns belong to the resource and server-state patterns.

## Avoiding Fetches During Render

Ordinary asynchronous side effects should not be started directly during rendering.

Avoid:

```tsx
function UserProfile({userId}: Props) {
    const promise = fetchUser(userId);

    return <Profile/>;
}
```

A render can execute multiple times, be abandoned, or be restarted.

Starting unmanaged side effects during render can therefore create duplicate requests and lifecycle problems.

The asynchronous operation should be coordinated by an architecture designed for render-time data dependencies or by an
appropriate lifecycle mechanism.

## Stale Data

Data can become stale between the time it is fetched and the time it is displayed.

For a purely local one-shot request, the component may simply retain the result until its lifetime ends.

For application-wide data, freshness becomes a more substantial concern.

That concern belongs to server-state management and resource caching rather than basic request initiation.

The important boundary is:

* Data fetching obtains data.
* Resource caching determines whether and how fetched data is reused.
* Server-state management determines how remote state is synchronized, invalidated, refreshed, and shared.

## Deduplication

Two components may request the same resource independently:

```tsx
useUser("123");
useUser("123");
```

A simple custom Hook may execute two network requests.

Preventing this requires shared request coordination or caching.

Deduplication is therefore not an inherent property of data fetching itself. It is a responsibility of the
resource/cache layer when multiple consumers need shared request identity.

## Retries

A failed request may sometimes be retried.

```tsx
async function retry<T>(
    operation: () => Promise<T>,
    attempts: number,
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < attempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError;
}
```

Retry policy should not be applied indiscriminately.

The operation must be safe to retry, and the failure should be appropriate for retrying.

Authentication failures, validation errors, and many client errors generally require different handling from transient
network or service failures.

For production applications, retry policy often belongs in the shared data-access or server-state layer rather than
individual components.

## Request Cancellation and Retries

Cancellation should take precedence over automatic retry.

If the consumer no longer needs a request, continuing to retry it defeats the purpose of cancellation.

A request abstraction should therefore distinguish:

* operation failure;
* intentional cancellation;
* obsolete request;
* retryable failure.

These states should not all be treated as ordinary errors.

## Request Timeouts

Network operations can remain pending longer than the UI should wait.

A timeout can be implemented using `AbortController`:

```tsx
async function fetchWithTimeout(
    url: string,
    timeout: number,
) {
    const controller = new AbortController();

    const timer = setTimeout(
        () => controller.abort(),
        timeout,
    );

    try {
        const response = await fetch(url, {
            signal: controller.signal,
        });

        return response;
    } finally {
        clearTimeout(timer);
    }
}
```

Timeout behavior is part of the asynchronous dependency contract.

The component should distinguish a timeout from other failures when the UI needs to present different recovery behavior.

## Authentication

Data fetching often depends on authentication state.

```tsx
useEffect(() => {
    if (!session) {
        return;
    }

    fetchUser(session.userId);
}, [session]);
```

The request should not begin before required authentication information exists.

Authentication itself is not part of the data-fetching pattern. It is an external prerequisite that determines whether
and how a request can be made.

## Authorization

A successful request does not guarantee that the requested resource is available to the current user.

Authorization failures should be represented as appropriate application errors rather than interpreted as ordinary
loading states.

The data-fetching layer should preserve enough information for the application to distinguish relevant failure
categories.

## Empty Results

Successful fetching does not necessarily produce useful content.

```tsx
type UsersState =
    | { status: "loading" }
    | { status: "success"; users: User[] }
    | { status: "error"; error: Error };
```

An empty array is still a successful result:

```tsx
{
    status: "success",
        users
:
    [],
}
```

The UI can then distinguish:

```tsx
if (state.users.length === 0) {
    return <EmptyState/>;
}
```

Empty data should not be conflated with request failure.

## Data Transformation

Transformation can occur after fetching and before rendering.

```tsx
const users = payload.users.map(toUserViewModel);
```

The component should consume the representation appropriate for its rendering responsibility.

However, transformation should not become a hidden state-management mechanism. The fetched result and its lifecycle
should remain conceptually distinct from derived presentation data.

## Testing

Data-fetching behavior should be tested around observable lifecycle outcomes.

Important cases include:

* initial loading;
* successful response;
* empty successful response;
* request failure;
* changing request parameters;
* obsolete requests not overwriting newer results;
* cancellation;
* timeout behavior when supported;
* retry behavior when supported;
* rendering while refreshing existing data;
* cleanup when the component is removed.

Tests should not depend unnecessarily on implementation details such as a particular Effect structure.

The important contract is that the correct data and lifecycle state become observable under the relevant asynchronous
conditions.

## Common Misuse

A common misuse is treating data fetching as a simple one-line `fetch()` call and ignoring request lifecycle state.

Another is starting asynchronous side effects directly during rendering.

Another is failing to account for changing request parameters, allowing an old request to overwrite a newer result.

Another is confusing cancellation with error handling and displaying an error whenever a request is intentionally
aborted.

Another is independently fetching identical data from multiple components when the application actually requires shared
request coordination.

Another is placing caching, invalidation, retry policy, and synchronization logic directly into individual components.
Once these concerns become shared application requirements, a dedicated resource or server-state abstraction is usually
more appropriate.

Another is fetching independent resources sequentially and creating avoidable request waterfalls.

## Advantages

Data fetching provides a straightforward way to connect asynchronous external data sources to application rendering. It
makes request lifecycle state explicit, allows components to respond to success and failure, and can be implemented at
different architectural boundaries depending on where the data requirement belongs.

A simple local implementation can also be sufficient for isolated data requirements without introducing a full
server-state system.

## Disadvantages

Client-side data fetching introduces asynchronous lifecycle complexity. Requests can race, fail, become obsolete,
require cancellation, and produce loading states that must be represented correctly.

Repeated local fetching can also cause duplicate network requests and inconsistent results when multiple components need
the same resource.

These problems are the reason dedicated caching and server-state patterns exist. Basic data fetching should not
gradually become an ad hoc implementation of those systems.

## When to Use

Use a data-fetching pattern when:

* a component or feature needs asynchronous external data;
* the data requirement is tied to client-side interaction or lifecycle;
* a request has a clear owner and lifetime;
* the application needs explicit loading and error handling;
* a simple request lifecycle is sufficient;
* shared caching and synchronization are not yet required.

## When Not to Use

Do not implement independent component-local fetching when the same remote resource is consumed broadly across the
application and needs shared caching or synchronization.

Do not use an Effect merely because data is asynchronous if the rendering architecture already provides a more
appropriate server-side or Suspense-based data-loading mechanism.

Do not introduce a custom fetching abstraction when a framework or established server-state system already owns the
relevant data lifecycle.

## Relationships

State Colocation determines where local request state can live when the request is meaningful only to one component or
feature.

State Lifting can move request-related state upward when multiple components need to coordinate the result, although
shared remote data often eventually belongs in a dedicated server-state abstraction.

Controlled Components and Uncontrolled Components describe ownership of component state and are not data-fetching
mechanisms.

Effect Synchronization provides the React lifecycle mechanism commonly used for client-side fetching, but data fetching
is broader than Effects.

Effect Cleanup handles cancellation and invalidation of asynchronous work when the owning lifecycle ends or changes.

Abortable Async Effects provides a more specific treatment of cancellation for asynchronous Effects.

Resource Cache adds request identity, reuse, deduplication, freshness, and cache lifetime to fetched resources.

Server State addresses remote data as shared application state, including synchronization, invalidation, refetching, and
lifecycle management.

Suspense Boundary coordinates rendering around asynchronous dependencies but does not itself define how remote data is
fetched or cached.

Error Boundary handles rendering errors and is distinct from ordinary request failure handling.

## Summary

Data fetching is the process of coordinating asynchronous external data with application rendering.

A robust fetching implementation must account for the request lifecycle, changing request parameters, stale results,
cancellation, errors, cleanup, and the distinction between initial loading and refreshing existing data.

The simplest conceptual model is:

```tsx
useEffect(() => {
    const controller = new AbortController();

    fetchData({
        signal: controller.signal,
    })
        .then(setData)
        .catch(handleError);

    return () => {
        controller.abort();
    };
}, [requestParameters]);
```

The exact implementation can vary substantially depending on the rendering architecture.

The central rule is: **treat asynchronous data acquisition as a lifecycle with explicit ownership, cancellation, and
failure semantics rather than as an isolated `fetch()` call.**
