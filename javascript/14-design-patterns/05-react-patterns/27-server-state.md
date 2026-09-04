# Server State

Server State is the pattern of treating data owned by a remote system as a distinct state category from local UI state.
The application does not own the authoritative value; the server does. The client maintains a local representation of
that remote state and is responsible for keeping that representation sufficiently synchronized with the authoritative
source.

This distinction changes how the state should be modeled. A local UI value can generally be treated as authoritative
within the application, while server state can change independently of the current component tree. A record may be
modified by another user, a background process, an administrator, a scheduled job, or another client. The local
representation can therefore become stale even when the application itself has performed no state transition.

Server State is consequently not simply "data returned by `fetch`." It is a synchronization problem involving remote
ownership, freshness, invalidation, refetching, mutations, reconciliation, retries, and consistency.

## Intent

Treat remotely owned data as a separate state category with explicit synchronization semantics.

The pattern is useful when an application needs to represent resources that live outside the current React component
tree and whose authoritative state can change independently of the client.

The central rule is:

> The server owns the state; the client owns a representation of that state and the policy for synchronizing it.

## What Server State Is

Server state is state whose authoritative source exists outside the current client application.

Typical examples include:

* authenticated user data
* product records
* orders
* inventory
* permissions
* comments
* notifications
* search results
* analytics data
* configuration retrieved from an API
* records shared between multiple clients
* data produced by background jobs

The important characteristic is ownership, not transport.

A value does not become server state merely because it was obtained over HTTP. Conversely, a value can remain server
state after it has been transformed, cached, normalized, or stored locally.

For example:

```tsx
const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
```

`selectedProductId` is client state.

By contrast:

```tsx
const product = useProduct(productId);
```

The product may be represented locally, but its authoritative value belongs to the server.

## Server Authority

The defining property of server state is that the client is not the ultimate authority over the value.

Consider:

```text
GET /api/products/42
```

The response gives the client a representation of product `42`. The client may retain that representation, display it,
transform it, and even update its local copy optimistically. None of those operations transfer authoritative ownership
from the server to the client.

The server may subsequently return a different representation.

This creates a fundamental asymmetry:

* client state is changed by client-side state transitions;
* server state can change without the client doing anything.

That distinction is the foundation for freshness, refetching, invalidation, and reconciliation.

## Client Representation

The client normally maintains a local representation of remote state.

For example:

```tsx
type User = {
    id: string;
    name: string;
    email: string;
};

const user = useUser(userId);
```

The `user` object is locally available, but it should not automatically be treated as the authoritative user record.

The representation can have additional client metadata:

```ts
type QueryState<T> = {
    data: T | undefined;
    status: "pending" | "success" | "error";
    updatedAt: number | undefined;
    error: Error | undefined;
};
```

The metadata describes the client's knowledge about the remote resource rather than changing ownership of that resource.

## Resource Identity

Server-state management requires a stable identity for each remote resource.

For example:

```ts
["user", userId]
```

can identify one user resource, while:

```ts
["orders", {userId, status}]
```

can identify a particular representation of an order collection.

Identity determines which consumers refer to the same remote resource and therefore which consumers can share
synchronization state.

The identity must contain every parameter that materially changes the result.

For example, this is insufficient:

```ts
["products"]
```

when the actual request depends on:

```ts
{
    category,
        search,
        page,
        sort
}
```

A resource identity that omits relevant parameters can cause unrelated representations to be treated as the same server
state.

Resource identity and cache implementation are related but not identical concerns. The identity answers what remote
resource is being represented; a resource cache determines how that representation is retained and reused.

## Query State

A server-state query normally has more information than simply "data or no data."

A useful conceptual model is:

```ts
type QueryStatus = "pending" | "success" | "error";

type QueryState<T> = {
    status: QueryStatus;
    data?: T;
    error?: unknown;
    updatedAt?: number;
};
```

The client may additionally distinguish whether a successful representation is currently being refreshed:

```ts
type QueryState<T> = {
    status: "pending" | "success" | "error";
    data?: T;
    error?: unknown;
    isFetching: boolean;
    updatedAt?: number;
};
```

This distinction matters because existing data does not necessarily disappear when a refresh begins.

A UI can therefore represent:

```text
existing data + background synchronization
```

instead of:

```text
no data + loading screen
```

The exact state model is implementation-specific, but the conceptual distinction between initial acquisition and
synchronization is important.

## Freshness

A server-state representation has a temporal dimension.

A representation retrieved recently may be considered fresh according to the application's consistency policy. After
some period it may be considered stale.

For example:

```ts
const isFresh = Date.now() - updatedAt < freshnessWindow;
```

Freshness is a client-side judgment. It does not prove that the server has not changed.

A resource can become stale immediately after the server changes while the client still considers it fresh according to
its configured policy.

Therefore:

* fresh means the client currently accepts the representation as sufficiently recent;
* stale means the representation should no longer be trusted as sufficiently recent under the client's policy;
* invalidated means the client has explicit knowledge that the representation should be refreshed.

These concepts should not be conflated.

## Stale Does Not Mean Invalid

A stale representation can still be useful.

For example:

```tsx
function ProductPage({id}: { id: string }) {
    const {data, isFetching} = useProduct(id);

    return (
        <>
            <ProductView product={data}/>
            {isFetching && <RefreshingIndicator/>}
        </>
    );
}
```

The application can continue displaying stale data while obtaining a newer representation.

This is often preferable to replacing useful content with a loading state every time synchronization occurs.

Whether stale data may be displayed depends on the consistency requirements of the feature.

## Synchronization

Server-state management coordinates the client's representation with the remote authority.

Synchronization may involve:

* initial acquisition
* background refetching
* invalidation
* mutation reconciliation
* polling
* reconnect-triggered refetching
* focus-triggered refetching
* explicit refresh
* subscription-driven updates
* server push
* optimistic updates followed by reconciliation

The goal is not necessarily perfect real-time equality.

The appropriate synchronization policy depends on the domain.

An analytics dashboard may tolerate stale data for several minutes. A trading interface may require substantially
stronger freshness guarantees. An administrative settings screen may require refetching after a mutation but not
continuous polling.

## Refetching

Refetching obtains a newer representation of a remote resource.

```ts
await queryClient.refetch({
    key: ["user", userId],
});
```

The exact API varies by implementation. The important operation is conceptual: obtain a new representation from the
authoritative source.

Refetching may be triggered by:

* component subscription
* explicit user action
* expiration of a freshness interval
* invalidation
* browser focus
* network reconnection
* polling interval
* mutation completion
* dependent-resource changes

Refetching should not automatically imply that the UI has no usable data.

## Background Refresh

Background refresh allows existing data to remain visible while synchronization occurs.

```tsx
function Dashboard() {
    const {data, isFetching} = useDashboard();

    return (
        <section>
            <DashboardView data={data}/>
            {isFetching && <RefreshIndicator/>}
        </section>
    );
}
```

This produces a different user experience from replacing the entire view with a loading state.

Background refresh is particularly useful when:

* data remains meaningful while being refreshed;
* network latency is non-trivial;
* the user should not lose context;
* the resource is frequently revisited;
* eventual consistency is acceptable.

## Invalidation

Invalidation tells the client that an existing representation should no longer be considered sufficiently current.

For example:

```ts
queryClient.invalidate(["user", userId]);
```

Invalidation is not itself a network request.

It changes the client's knowledge about the representation and can cause a subsequent or immediate refetch depending on
policy.

A mutation may invalidate related resources:

```ts
await updateUser(userId, changes);

queryClient.invalidate(["user", userId]);
queryClient.invalidate(["users"]);
```

The first invalidation targets the individual resource. The second targets a collection whose contents may also have
changed.

Invalidation is therefore a synchronization mechanism rather than merely a cache operation.

## Mutations

Queries primarily represent remote state. Mutations change remote state.

Examples include:

```ts
await createOrder(input);
await updateUser(userId, changes);
await deleteComment(commentId);
```

A mutation introduces additional concerns:

* request state
* validation
* authorization
* retries
* duplicate submission
* optimistic updates
* rollback
* response reconciliation
* invalidation
* dependent resource updates
* side effects

A mutation should not be modeled merely as another query with a different HTTP method. Its semantic purpose is to cause
a state transition in the remote system.

## Mutation State

A mutation can have its own lifecycle:

```ts
type MutationState<T> = {
    status: "idle" | "pending" | "success" | "error";
    data?: T;
    error?: unknown;
};
```

The lifecycle is useful for controlling interaction:

```tsx
<button disabled={mutation.isPending}>
    Save
</button>
```

The application should also determine what happens after success or failure.

For example:

```ts
const result = await updateUser(userId, changes);

queryClient.setData(["user", userId], result);
```

If the mutation response contains the authoritative updated representation, it may be possible to reconcile the local
representation directly rather than immediately performing another request.

## Optimistic Updates

An optimistic update changes the local representation before the server confirms the mutation.

For example:

```ts
const previous = queryClient.getData(["todos"]);

queryClient.setData(["todos"], current => [
    ...current,
    optimisticTodo,
]);

try {
    const created = await createTodo(input);

    queryClient.setData(["todos"], current =>
        current?.map(todo =>
            todo.id === optimisticTodo.id ? created : todo
        )
    );
} catch (error) {
    queryClient.setData(["todos"], previous);
    throw error;
}
```

The purpose is to reduce perceived latency.

Optimistic updates require explicit failure handling because the local representation temporarily differs from the
authoritative server state.

A robust optimistic update therefore needs:

1. the previous representation;
2. an optimistic representation;
3. a mutation request;
4. success reconciliation;
5. rollback or error reconciliation.

Optimistic state should not be treated as confirmed server state.

## Reconciliation

Reconciliation is the process of bringing the local representation back into alignment with the authoritative remote
representation.

For example:

```ts
const optimistic = {
    id: temporaryId,
    title: "New task",
};

const confirmed = await createTask(optimistic);
```

The server may return:

```ts
{
    id: "server-generated-id",
        title
:
    "New task",
        createdAt
:
    "...",
}
```

The local representation must replace the optimistic record with the authoritative result.

Reconciliation is also necessary when server-side processing changes the submitted value.

For example, the server may:

* normalize text;
* calculate derived fields;
* assign identifiers;
* apply permissions;
* add timestamps;
* apply business rules;
* reject part of a request;
* update related records.

The mutation response can therefore contain information that the client could not know independently.

## Mutation Side Effects

A mutation can affect more resources than the resource explicitly targeted.

For example:

```ts
await createOrder(input);
```

may change:

* the order collection;
* the user's order count;
* inventory;
* account balance;
* notifications;
* dashboard statistics.

The client therefore needs a policy for affected representations.

Possible strategies include:

* update known affected representations directly;
* invalidate affected resources;
* refetch affected resources;
* rely on server push;
* reconcile from the mutation response.

The correct choice depends on the server API and consistency requirements.

## Query Dependencies

Some remote resources depend on other remote resources.

For example:

```tsx
const {data: user} = useUser();

const {data: projects} = useProjects(user?.id);
```

The second resource cannot be requested until the identifier required by the first resource is available.

The dependency should be explicit:

```ts
useProjects({
    userId: user?.id,
    enabled: user != null,
});
```

This avoids issuing requests with incomplete parameters.

## Parallel Queries

Independent server-state resources should normally be acquired independently.

```tsx
const user = useUser(userId);
const notifications = useNotifications(userId);
const settings = useSettings(userId);
```

If the resources do not depend on each other, there is no reason to serialize their acquisition merely because they
appear in the same component.

This reduces unnecessary request waterfalls.

## Dependent Queries

When one resource genuinely depends on another, the dependency should control activation.

```tsx
const user = useUser(userId);

const projects = useProjects(user.data?.id, {
    enabled: user.data != null,
});
```

The dependency is part of the query's lifecycle rather than an incidental condition inside rendering logic.

## Pagination

Paginated server state represents a sequence of related remote resources.

For example:

```ts
["products", {page: 1}]
    ["products", {page: 2}]
    ["products", {page: 3}]
```

Each page has an identity, but the application may need to coordinate them as one logical collection.

Pagination concerns include:

* page identity
* total count
* next-page availability
* previous-page availability
* transitions between pages
* retaining previous data
* prefetching adjacent pages
* invalidation after mutations

Pagination should not be confused with ordinary local array state. Each page represents remote data with its own
freshness and synchronization semantics.

## Infinite and Incremental Data

Infinite or incremental queries accumulate multiple remote segments:

```ts
type Page<T> = {
    items: T[];
    nextCursor?: string;
};
```

The client may retain:

```ts
Page < T > []
```

while continuing to retrieve additional pages.

The state-management problem includes both the identity of the overall query and the identity of each page or cursor.

Appending data locally does not necessarily mean the remote collection itself has changed. It may simply mean the client
has acquired another representation segment.

## Polling

Polling periodically refetches a remote resource:

```ts
useJobStatus(jobId, {
    refetchInterval: 5000,
});
```

Polling is appropriate when:

* the server does not provide push notifications;
* eventual updates are acceptable;
* the resource changes predictably;
* a bounded delay is acceptable.

Polling should be bounded or conditional where possible.

For example, a completed job should generally stop being polled:

```ts
const shouldPoll = job?.status === "running";
```

Unconditional polling can create unnecessary network and server load.

## Focus and Reconnection

Server-state systems may refetch when the application regains focus or network connectivity.

The rationale is that the local representation may have become stale while the application was inactive or disconnected.

For example:

```ts
window.addEventListener("focus", refresh);
```

The actual implementation may be centralized rather than attached directly to individual components.

These triggers are synchronization policies, not properties of React rendering itself.

## Retry and Backoff

Transient network failures do not necessarily mean that a remote resource is permanently unavailable.

A server-state system may retry failed operations:

```ts
retry: 3
```

with increasing delays:

```ts
delay = baseDelay * 2 ** attempt
```

Retries must consider operation semantics.

Retrying a read is usually safer than automatically retrying an arbitrary mutation.

A mutation that creates a resource may have succeeded on the server even if the response was lost. Retrying it blindly
can create a duplicate resource.

Therefore retry policy should account for:

* idempotency;
* operation type;
* server guarantees;
* error classification;
* maximum attempts;
* backoff;
* user expectations.

## Cancellation

Remote operations may need cancellation.

For example:

```ts
const controller = new AbortController();

fetch("/api/search?q=react", {
    signal: controller.signal,
});

controller.abort();
```

Cancellation can prevent obsolete work from consuming resources or updating state after it is no longer relevant.

However, cancellation is not equivalent to rollback.

Aborting a client request does not guarantee that the server did not process the operation. This distinction is
especially important for mutations.

## Error Semantics

Server-state errors should be classified according to their meaning.

Examples include:

* network failure;
* authentication failure;
* authorization failure;
* validation failure;
* rate limiting;
* server failure;
* timeout;
* cancellation;
* malformed response;
* stale or conflicting mutation.

A query failure means that the client failed to obtain or validate a representation.

A mutation failure may mean that the requested remote state transition was rejected.

The UI should not necessarily treat every error identically.

For example:

```ts
if (error.status === 401) {
    // authentication flow
}

if (error.status === 403) {
    // authorization failure
}

if (error.status === 422) {
    // validation feedback
}
```

The server-state layer can classify errors while the presentation layer determines how they should be displayed.

## Shared Consumption

Multiple components may consume the same remote resource:

```tsx
function Header() {
    const user = useUser(userId);
    // ...
}

function AccountPanel() {
    const user = useUser(userId);
    // ...
}
```

The components should not necessarily maintain independent copies with independent synchronization policies.

A server-state layer can allow consumers to subscribe to the same logical resource representation.

This provides:

* shared freshness state;
* coordinated refetching;
* shared mutation results;
* consistent invalidation;
* reduced duplicate acquisition.

This is one of the major reasons server state deserves its own abstraction.

## Server State vs Client State

Server state and client state solve different problems.

Client state:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

is owned by the client.

Server state:

```tsx
const {data: user} = useUser(userId);
```

is owned remotely.

A UI can derive client state from server state:

```tsx
const canEdit = user?.permissions.includes("edit") ?? false;
```

but that does not transfer ownership of `user` to the component.

A useful distinction is:

* client state answers "what does this application currently want or remember?";
* server state answers "what does the authoritative remote system currently represent?"

## Server State vs Resource Cache

A Resource Cache primarily answers:

> Can this resource representation be reused?

Server State additionally answers:

> How should this remote resource be synchronized with its authoritative owner?

A resource cache may provide:

* resource identity;
* stored representations;
* in-flight deduplication;
* freshness metadata;
* eviction;
* invalidation.

Server-state management adds broader lifecycle semantics:

* query subscriptions;
* background synchronization;
* mutation coordination;
* optimistic updates;
* reconciliation;
* dependent queries;
* polling;
* refetch triggers;
* retry policy;
* consistency rules.

A server-state implementation will often contain a cache, but the concepts are not equivalent.

## Server State vs Data Fetching

Data Fetching concerns the acquisition operation:

```ts
const response = await fetch("/api/users/42");
```

Server State concerns the lifecycle of the remote resource after considering acquisition as part of a larger
synchronization system.

Data fetching answers:

> How do I obtain this data?

Server state answers:

> How should the client represent, synchronize, update, and reconcile this remotely owned data?

A simple application may need only data fetching.

A larger application may need a server-state abstraction because the same resources are consumed across multiple
features and must remain synchronized.

## Server State vs External Store

An external store is a state-ownership and subscription mechanism.

Server state is a category of remotely owned data.

An external store can be used to implement server-state management:

```ts
const store = createServerStateStore();
```

but the two concepts should not be conflated.

An external store can contain entirely local client state. Conversely, server state can be managed without a generic
external store abstraction.

The important distinction is ownership and synchronization semantics.

## Server State vs Context

Context distributes a value through a React subtree.

It does not inherently provide:

* freshness;
* invalidation;
* retries;
* background refetching;
* optimistic updates;
* mutation reconciliation.

For example:

```tsx
<UserContext.Provider value={user}>
    {children}
</UserContext.Provider>
```

can distribute a user representation, but Context does not determine whether that representation is current.

Context can provide access to a server-state client or query service, but the synchronization model belongs to the
server-state layer.

## Server State vs Local Derived State

Remote data often produces values that can be derived locally:

```tsx
const total = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
);
```

`total` does not need to become another server-state resource merely because it originated from server data.

If a value can be deterministically derived from the current representation, derive it rather than introducing another
independently synchronized state value.

This avoids unnecessary synchronization problems.

## Normalization

Normalization represents related remote entities in a shared identity-based structure.

For example:

```ts
type EntityStore = {
    users: Record<string, User>;
    projects: Record<string, Project>;
};
```

A project can then reference:

```ts
type Project = {
    id: string;
    ownerId: string;
};
```

Normalization can make updates to shared entities easier to propagate.

However, normalization is not inherently required for server-state management. Many applications can work effectively
with resource-oriented representations without maintaining a normalized entity graph.

Normalization becomes more valuable when:

* entities appear in many independent resources;
* partial updates are common;
* relationships are extensive;
* consistency across representations matters;
* large datasets would otherwise contain many duplicated copies.

## Consistency Models

Server-state design should explicitly recognize the application's consistency requirements.

Possible policies include:

* eventual consistency;
* bounded staleness;
* read-after-write consistency;
* strong consistency where supported by the backend;
* optimistic local consistency followed by reconciliation.

For example, after:

```ts
await updateProfile(changes);
```

the application may require the next profile read to reflect the mutation immediately.

Alternatively, it may accept temporary divergence while the server processes the change asynchronously.

The appropriate model is determined by the domain and backend guarantees rather than by React itself.

## Read-After-Write

A common requirement is that a successful mutation should immediately affect subsequent reads.

For example:

```ts
await updateUser(userId, changes);
```

may need to make:

```ts
useUser(userId)
```

reflect the updated user immediately.

Possible approaches include:

```ts
queryClient.setData(["user", userId], updatedUser);
```

or:

```ts
queryClient.invalidate(["user", userId]);
```

The first uses the known mutation result. The second asks the server for a fresh representation.

If the mutation response is authoritative and complete, directly reconciling it can avoid an unnecessary request.

## Server Push

Polling is not the only synchronization strategy.

A server may push changes through:

* WebSockets;
* Server-Sent Events;
* subscriptions;
* other application-level messaging mechanisms.

A push event can update or invalidate a resource:

```ts
socket.on("user.updated", event => {
    queryClient.invalidate(["user", event.userId]);
});
```

The server-push transport and the server-state synchronization policy remain separate concerns.

The push mechanism tells the client that something changed. The server-state layer decides how that event affects local
representations.

## Authentication and Authorization

Authentication and authorization affect server-state acquisition and mutation.

A query may fail because the user is unauthenticated:

```ts
401
Unauthorized
```

or authenticated but forbidden:

```ts
403
Forbidden
```

Server-state management should distinguish these outcomes from ordinary transient failures.

Authorization also means that the representation available to one user may differ from the representation available to
another.

Therefore resource identity may sometimes need to account for the authenticated principal or permission context.

A cached representation must never be reused across security boundaries merely because the nominal resource identifier
is the same.

## SSR and Hydration

Server state can participate in server-side rendering and hydration.

A server-rendered application may acquire remote data before producing HTML:

```ts
const user = await getUser(userId);
```

The resulting representation can then be transferred to the client so that hydration does not immediately repeat the
same request.

The important concern is that the client must understand:

* which remote resources were prefetched;
* their resource identities;
* when they were obtained;
* whether they should be considered fresh;
* whether they should be refetched after hydration.

This is a synchronization concern rather than merely a rendering optimization.

## Prefetching

Prefetching acquires server state before it is immediately required.

For example:

```ts
await queryClient.prefetch(["product", productId]);
```

A product detail page can then consume an already available representation.

Prefetching is particularly useful for predictable navigation:

```tsx
function ProductLink({id}: { id: string }) {
    const prefetch = () => {
        queryClient.prefetch(["product", id]);
    };

    return (
        <a href={`/products/${id}`} onMouseEnter={prefetch}>
            View product
        </a>
    );
}
```

Prefetching belongs to the synchronization strategy because it changes when the client obtains remote state, while the
resource cache determines how the acquired representation is retained.

## Request Scope

Server-state representations may need different lifetimes depending on execution environment.

In a browser application, state may intentionally survive across component mounts.

In server-side rendering, request-specific server state must generally remain isolated between incoming requests.

A server-rendered request must not accidentally expose one user's representation to another request through shared
mutable state.

Therefore server-state infrastructure needs an explicit scope model:

* component scope;
* application scope;
* browser session scope;
* server request scope;
* process scope where safe.

Scope is particularly important when server-state infrastructure is reused during SSR.

## Testing

Server-state testing should test synchronization semantics rather than only rendering.

Important cases include:

* initial loading;
* successful acquisition;
* stale data;
* background refresh;
* refetch failure;
* retry behavior;
* cancellation;
* invalidation;
* mutation success;
* mutation failure;
* optimistic update;
* rollback;
* reconciliation;
* dependent queries;
* pagination;
* authorization failure;
* reconnect behavior.

For example:

```ts
it("rolls back an optimistic update when the mutation fails", async () => {
    const initial = [{id: "1", title: "Existing"}];

    store.setData(["todos"], initial);

    await expect(
        mutateTodo({
            id: "1",
            title: "Updated",
        })
    ).rejects.toThrow();

    expect(store.getData(["todos"])).toEqual(initial);
});
```

The test verifies the synchronization contract rather than a specific UI implementation.

## Common Misuse

One common mistake is treating server state as ordinary React state:

```tsx
const [users, setUsers] = useState<User[]>([]);

useEffect(() => {
    fetchUsers().then(setUsers);
}, []);
```

This can be perfectly adequate for a simple one-off request, but it becomes problematic when the same resource requires
shared caching, invalidation, background refresh, mutations, retries, or coordination across multiple consumers.

Another mistake is treating the client representation as authoritative:

```ts
setUser(updatedUser);
```

does not prove that the server accepted or persisted `updatedUser`.

A third mistake is invalidating everything after every mutation:

```ts
invalidateAll();
```

This can produce unnecessary requests and unpredictable synchronization behavior.

Invalidation should target resources whose representations may actually have changed.

Another mistake is retrying non-idempotent mutations without considering duplicate effects.

A further mistake is treating every stale representation as unusable. Stale data may still be valuable while a
background refresh occurs.

Finally, server state should not be duplicated unnecessarily into local component state:

```tsx
const {data: user} = useUser(userId);
const [localUser, setLocalUser] = useState(user);
```

This creates two representations with independent lifecycles and can cause them to diverge.

## Advantages

Server-state management provides a clear conceptual boundary between remotely owned data and locally owned UI state.

It allows applications to coordinate shared remote resources across multiple consumers.

It supports explicit freshness and synchronization policies instead of treating remote data as permanently current.

It provides a natural place for invalidation, background refresh, retries, mutation handling, optimistic updates, and
reconciliation.

It can reduce duplicated network work when multiple parts of an application consume the same resources.

It also makes consistency decisions explicit rather than leaving them implicit inside individual components.

## Disadvantages

Server-state management introduces additional concepts and infrastructure.

Applications must define resource identity, freshness, invalidation, retry, mutation, and synchronization policies.

Incorrect policies can cause excessive network traffic, stale interfaces, unnecessary refetching, or inconsistent local
representations.

Optimistic updates add rollback and reconciliation complexity.

Shared server-state infrastructure can also become difficult to reason about if resource ownership and invalidation
boundaries are poorly defined.

For very small applications, a full server-state abstraction may provide more machinery than the application requires.

## When to Use

Use Server State when remote resources are shared or long-lived enough that synchronization semantics matter.

Typical signals include:

* the same remote resource is consumed by multiple components;
* remote data can change independently of the current UI;
* background refresh is required;
* mutations must update related representations;
* optimistic updates are useful;
* stale data needs explicit treatment;
* queries have dependencies or pagination;
* the application needs coordinated retries and invalidation;
* server-rendered data must be hydrated into the client;
* the application has many independent remote resources.

## When Not to Use

Do not introduce a dedicated server-state abstraction merely because an application performs one simple request.

A component may reasonably perform a small, isolated acquisition operation when:

* the result has a single consumer;
* no sharing is required;
* no mutation coordination is required;
* no meaningful caching or synchronization policy exists;
* the resource lifecycle is simple.

For example:

```tsx
function Greeting() {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/greeting")
            .then(response => response.json())
            .then(setMessage);
    }, []);

    return <p>{message}</p>;
}
```

The pattern becomes more valuable as the remote resource lifecycle becomes more complex.

## Relationships

Server State builds on several other patterns without replacing them.

`18-data-fetching.md` owns the mechanics and lifecycle of obtaining asynchronous external data. Server State uses those
acquisition operations as part of a larger synchronization model.

`19-resource-cache.md` owns resource reuse, identity-based storage, freshness retention, eviction, and related cache
mechanics. Server State uses caching as one mechanism for maintaining a client representation but adds synchronization
and mutation semantics.

`13-state-colocation.md` remains the default strategy for locally owned React state. Server state should not be copied
into local component state merely to make it appear colocated.

`14-state-lifting.md` coordinates client-owned state through a shared owner. Server state does not become client-owned
simply because multiple components consume it.

`15-controlled-components.md` concerns externally owned component state and component APIs. Server state can supply
controlled values, but controlledness is a component API concern.

`17-uncontrolled-components.md` concerns internally owned component state and DOM state. It is orthogonal to
server-state synchronization.

`07-reducer-pattern.md` can structure local transitions or server-state transitions, but a reducer does not itself
provide remote synchronization.

`10-context-provider.md` can provide access to a server-state client or service, but Context does not implement
server-state synchronization.

`25-external-store.md` can provide the subscription mechanism used by a server-state implementation, but an external
store is not inherently server state.

`40-server-components.md` and `42-hydration-boundary.md` can participate in server-state acquisition and transfer, but
rendering location does not change the ownership of the remote resource.

## Summary

Server State is the pattern of treating remotely owned data as a distinct state category with explicit synchronization
semantics.

The server remains authoritative. The client maintains a representation that may be fresh, stale, invalidated,
optimistic, or temporarily unavailable.

The important responsibilities are not limited to obtaining the data. A complete server-state model must account for
resource identity, freshness, synchronization, refetching, invalidation, mutations, optimistic updates, reconciliation,
retries, cancellation, dependent queries, pagination, background refresh, and consistency.

The distinction from the surrounding patterns is deliberate:

* Data Fetching obtains remote data.
* Resource Cache stores and reuses resource representations.
* Server State manages the lifecycle and synchronization of remotely owned data.

The core rule is:

> Treat remote data as a synchronized representation of externally owned state, not as ordinary local component state.
