# Dependency Through Custom Hooks

Dependency through custom Hooks is a dependency-injection technique in which a component obtains a capability through a
custom Hook rather than directly importing, constructing, or locating the underlying implementation.

The custom Hook acts as the **consumer-facing dependency boundary**.

```tsx
function UserProfile() {
    const userRepository = useUserRepository();

    // ...
}
```

The component depends on the capability returned by `useUserRepository`, while the Hook controls how that capability is
obtained.

The underlying implementation might come from:

* Context
* another Hook
* an external store
* a module
* a service registry
* a framework API
* a combination of dependencies
* a locally constructed implementation

The important architectural property is that the component depends on the **Hook contract**, rather than directly
depending on the mechanism used to obtain the capability.

## Intent

Use a custom Hook as a stable dependency-consumption API when multiple components need a capability and the details of
how that capability is resolved should remain outside those components.

```tsx
function Editor() {
    const repository = useDocumentRepository();

    // ...
}
```

The component does not need to know whether the repository comes from:

```tsx
const repository = useContext(RepositoryContext);
```

or:

```tsx
const repository = applicationContainer.repository;
```

or:

```tsx
const repository = createRepository();
```

The Hook encapsulates that resolution mechanism.

## The Hook as a Dependency Boundary

A dependency Hook can expose a focused capability:

```tsx
function useLogger(): Logger {
    // dependency resolution
}
```

Consumers depend on that contract:

```tsx
function SaveButton() {
    const logger = useLogger();

    // ...
}
```

The Hook therefore becomes an architectural boundary between:

* component behavior
* dependency resolution
* dependency implementation

The consumer does not need to know where the dependency originates.

## Dependency Resolution

A custom Hook can resolve a dependency from Context:

```tsx
const RepositoryContext =
    createContext<Repository | null>(null);

function useRepository(): Repository {
    const repository = useContext(RepositoryContext);

    if (repository === null) {
        throw new Error(
            "RepositoryProvider is required"
        );
    }

    return repository;
}
```

The component consumes only:

```tsx
function Editor() {
    const repository = useRepository();

    // ...
}
```

In this architecture, Context performs the scoped delivery while the custom Hook defines the consumer API.

The two mechanisms should therefore not be conflated.

## Context Is Not Required

A custom Hook can expose a dependency without Context.

For example:

```tsx
const analytics: Analytics = createAnalytics();

function useAnalytics(): Analytics {
    return analytics;
}
```

The consumer remains:

```tsx
function Checkout() {
    const analytics = useAnalytics();

    // ...
}
```

The dependency is still accessed through a custom Hook even though no Context is involved.

This can be appropriate for a dependency that is intentionally application-scoped and does not require subtree-specific
instances.

## Hook-Based Dependency Injection

A custom Hook can also receive dependencies as arguments.

```tsx
function useUser(
    repository: UserRepository,
    userId: string
) {
    // ...
}
```

A component supplies the dependency:

```tsx
function UserProfile({
                         repository,
                         userId,
                     }: Props) {
    const user = useUser(repository, userId);

    // ...
}
```

Here the Hook does not resolve the dependency. It consumes an explicitly injected dependency.

This is still dependency through custom Hooks because the reusable behavior is expressed through the Hook abstraction.

## Resolved Versus Passed Dependencies

There are two distinct forms.

Resolved dependency:

```tsx
function useUserRepository() {
    return useContext(UserRepositoryContext);
}
```

Passed dependency:

```tsx
function useUser(
    repository: UserRepository
) {
    // ...
}
```

The first hides dependency delivery behind the Hook.

The second keeps dependency delivery explicit while encapsulating behavior inside the Hook.

Both are valid.

The architectural choice is whether dependency resolution itself belongs inside the Hook boundary.

## Why Use a Custom Hook

A custom Hook can provide a stable consumer API while allowing the dependency mechanism to change.

Today:

```tsx
function useRepository() {
    return useContext(RepositoryContext);
}
```

Later:

```tsx
function useRepository() {
    return useRepositoryFromFramework();
}
```

The consumer remains:

```tsx
function Editor() {
    const repository = useRepository();
}
```

This isolates infrastructure changes from component implementations.

## Narrow Dependency Contracts

A dependency Hook should expose the smallest useful capability.

Prefer:

```tsx
function useUserRepository(): UserRepository {
    // ...
}
```

over:

```tsx
function useApplicationServices(): ApplicationServices {
    // ...
}
```

A consumer that needs one repository should not gain access to every application service.

Narrow contracts improve:

* coupling
* discoverability
* testing
* replacement
* ownership
* architectural boundaries

## Avoiding the Service Locator Pattern

A Hook can accidentally become a service locator.

Avoid:

```tsx
function useServices() {
    return services;
}
```

followed by:

```tsx
function Editor() {
    const services = useServices();

    const repository =
        services.repositories.documents;

    const logger =
        services.logging.logger;
}
```

The component is still performing dependency lookup.

The lookup has merely been moved behind a Hook.

Prefer focused Hooks:

```tsx
function Editor() {
    const repository = useDocumentRepository();
    const logger = useLogger();

    // ...
}
```

Each Hook communicates a specific dependency.

## Consumer API

A dependency Hook should make the required capability obvious.

```tsx
function usePaymentGateway(): PaymentGateway {
    // ...
}
```

The consumer:

```tsx
function PaymentForm() {
    const paymentGateway = usePaymentGateway();

    // ...
}
```

The component's API no longer contains infrastructure props, but the dependency remains visible in the implementation.

This is particularly useful when the dependency is environmental rather than component-specific.

## Provider Errors

When a dependency Hook is backed by Context, it should generally detect a missing provider when the dependency is
required.

```tsx
function usePaymentGateway() {
    const gateway = useContext(PaymentGatewayContext);

    if (gateway === null) {
        throw new Error(
            "usePaymentGateway must be used within PaymentGatewayProvider"
        );
    }

    return gateway;
}
```

This creates a clear architectural invariant:

```tsx
<PaymentGatewayProvider gateway={gateway}>
    <PaymentForm/>
</PaymentGatewayProvider>
```

A consumer outside the provider fails immediately rather than silently receiving an invalid implementation.

## Default Dependencies

A dependency Hook may intentionally provide a default implementation.

```tsx
function useLogger(): Logger {
    return useContext(LoggerContext) ?? noopLogger;
}
```

This is appropriate only when absence of an injected implementation has meaningful semantics.

For required dependencies, silently falling back to a default can hide configuration errors.

The Hook should reflect whether the dependency is:

* required
* optional
* environment-dependent
* intentionally defaulted

## Dependency Lifetime

The Hook does not automatically determine dependency lifetime.

Consider:

```tsx
function useRepository() {
    return useContext(RepositoryContext);
}
```

The repository's lifetime is determined by the provider or composition boundary.

A module-level Hook:

```tsx
function useRepository() {
    return repository;
}
```

uses a dependency whose lifetime is determined by the module.

A Hook that constructs an instance:

```tsx
function useRepository() {
    return useMemo(
        () => createRepository(),
        []
    );
}
```

makes the Hook's component instance part of the dependency lifetime.

These are materially different ownership models.

## Hook-Owned Dependencies

A Hook can own a dependency when that is appropriate.

```tsx
function useWebSocket(url: string) {
    const socket = useMemo(
        () => new WebSocket(url),
        [url]
    );

    // ...
}
```

The Hook now participates in dependency construction and lifecycle.

This is different from a pure dependency accessor:

```tsx
function useWebSocketClient() {
    return useContext(WebSocketClientContext);
}
```

The first creates or manages the capability.

The second consumes an already-established capability.

Do not blur these responsibilities without a deliberate ownership model.

## Dependency Ownership

A dependency Hook should make ownership semantics understandable.

If:

```tsx
const client = useApiClient();
```

returns a shared application client, the consumer should generally not dispose it.

If:

```tsx
const connection = useConnection(url);
```

creates and manages a connection for the component, the Hook may own its lifecycle.

The Hook's name and contract should correspond to the ownership model.

## Dependency Identity

The identity of the dependency returned by a Hook can affect React behavior.

```tsx
function useRepository() {
    return useContext(RepositoryContext);
}
```

If the provider supplies a new repository object, consumers receive a new reference.

This can affect:

* Effects
* subscriptions
* memoization
* caches
* child props
* resource ownership

A dependency Hook should not hide meaningful identity changes.

## Dependency Identity as an API Property

A custom Hook can implicitly establish a stability contract.

For example:

```tsx
const logger = useLogger();
```

may be expected to return the same logger instance for the lifetime of the provider.

By contrast:

```tsx
const request = useRequest();
```

might intentionally return changing state or a changing operation object.

The Hook's identity semantics should be deliberate.

If consumers rely on stable identity, that stability becomes part of the Hook's effective contract.

## Hooks Returning Functions

A dependency Hook can expose a capability as a function:

```tsx
function useSaveUser(): (
    user: User
) => Promise<void> {
    const repository = useUserRepository();

    return useCallback(
        user => repository.save(user),
        [repository]
    );
}
```

The consumer receives:

```tsx
function UserEditor() {
    const saveUser = useSaveUser();

    // ...
}
```

The Hook hides the repository dependency while exposing the specific command required by the component.

The returned function's identity should be considered part of the API if consumers use it in dependency arrays or
memoized props.

## Stable Hook APIs

A custom Hook can deliberately expose stable capabilities.

```tsx
function useUserCommands() {
    const repository = useUserRepository();

    const save = useCallback(
        (user: User) => repository.save(user),
        [repository]
    );

    const remove = useCallback(
        (id: string) => repository.remove(id),
        [repository]
    );

    return useMemo(
        () => ({
            save,
            remove,
        }),
        [save, remove]
    );
}
```

This creates a structured command API.

The stability is useful only when consumers benefit from it.

Memoization should not be added merely because the Hook returns an object.

## Dependency Hooks and Effects

A dependency Hook can provide a dependency used by an Effect:

```tsx
function UserProfile({userId}: Props) {
    const repository = useUserRepository();

    useEffect(() => {
        let cancelled = false;

        repository.getUser(userId).then(user => {
            if (!cancelled) {
                // ...
            }
        });

        return () => {
            cancelled = true;
        };
    }, [repository, userId]);

    // ...
}
```

The Hook does not remove the dependency from the Effect's reactive model.

If the dependency changes, the Effect may need to synchronize with the new dependency.

A dependency Hook should therefore not be used to conceal reactive dependencies.

## Dependency Hooks and Cleanup

When a Hook establishes a relationship with a dependency, the Hook may own the cleanup.

```tsx
function useEventSubscription(
    eventBus: EventBus,
    event: string,
    handler: Handler
) {
    useEffect(() => {
        return eventBus.subscribe(
            event,
            handler
        );
    }, [eventBus, event, handler]);
}
```

The Hook encapsulates the relationship lifecycle.

The event bus itself remains owned elsewhere.

This distinction is important:

* the Hook can own the subscription
* the Hook does not necessarily own the event bus

## Dependency Hooks and Cancellation

A dependency Hook can encapsulate cancellation-aware behavior.

```tsx
function useSearchService() {
    const service = useContext(SearchServiceContext);

    if (!service) {
        throw new Error("SearchServiceProvider is required");
    }

    return service;
}
```

The consumer can then manage cancellation:

```tsx
function SearchResults({query}: Props) {
    const searchService = useSearchService();

    useEffect(() => {
        const controller = new AbortController();

        searchService.search(
            query,
            controller.signal
        );

        return () => {
            controller.abort();
        };
    }, [searchService, query]);

    // ...
}
```

Alternatively, a specialized Hook can own the entire request lifecycle.

The architectural distinction is whether the Hook exposes a dependency or encapsulates behavior using that dependency.

## Dependency Hook Versus Behavior Hook

These can look similar but have different responsibilities.

Dependency Hook:

```tsx
const repository = useUserRepository();
```

It supplies a capability.

Behavior Hook:

```tsx
const {user, loading, error} =
    useUser(userId);
```

It performs reusable behavior using one or more capabilities.

A dependency Hook should not become a general-purpose state-management Hook merely because it has access to the
dependency.

Keeping the layers distinct improves composability.

## Dependency Hook Versus Custom Hook

Not every custom Hook is dependency injection.

For example:

```tsx
function useToggle() {
    const [enabled, setEnabled] = useState(false);

    return {
        enabled,
        toggle: () => setEnabled(value => !value),
    };
}
```

This is reusable stateful behavior.

It is not dependency injection.

Dependency-through-custom-hooks specifically concerns using a Hook as the boundary through which a component obtains an
external capability or collaborator.

## Dependency Hook Versus Context Hook

A custom Hook backed by Context is a common implementation:

```tsx
function useRepository() {
    return useContext(RepositoryContext);
}
```

But the concepts remain distinct.

**Context** determines how a value is distributed through the React tree.

**The custom Hook** determines how consumers access that capability.

A dependency Hook may use Context, but a Context consumer is not automatically dependency injection.

## Dependency Hook Versus Props

Explicit props:

```tsx
function Editor({
                    repository,
                }: Props) {
    // ...
}
```

Dependency Hook:

```tsx
function Editor() {
    const repository = useRepository();

    // ...
}
```

Props expose the dependency in the component's public input contract.

A dependency Hook hides dependency delivery behind the Hook API.

The trade-off is therefore the same as with Context-based injection:

* props maximize explicitness
* dependency Hooks reduce API plumbing
* Hooks can hide environmental requirements
* props make substitution visible at the call site
* Hooks can centralize dependency resolution

## Combining Props and Dependency Hooks

A component can use both mechanisms.

```tsx
function UserEditor({
                        userId,
                    }: {
    userId: string;
}) {
    const repository = useUserRepository();

    // ...
}
```

`userId` is ordinary component input.

`repository` is an environmental dependency.

This can be a clean distinction when the repository is shared across a subtree while the user ID varies per instance.

## Dependency Hooks and Component Reuse

A component that calls a dependency Hook is reusable only within an environment that satisfies that Hook's contract.

```tsx
function Editor() {
    const repository = useDocumentRepository();
}
```

The component requires the corresponding dependency environment.

For highly generic components, explicit dependency props may be more portable:

```tsx
function Editor({
                    repository,
                }: {
    repository: DocumentRepository;
}) {
    // ...
}
```

For application or feature components, the Hook-based contract may be cleaner.

The correct choice depends on whether environmental coupling is intentional.

## Dependency Hooks and Testing

A Context-backed dependency Hook makes testing straightforward when the test can replace the provider:

```tsx
render(
    <RepositoryProvider repository={fakeRepository}>
        <UserProfile/>
    </RepositoryProvider>
);
```

The consumer remains unchanged:

```tsx
function UserProfile() {
    const repository = useUserRepository();

    // ...
}
```

This is especially useful when many components consume the same dependency.

For a dependency Hook that directly imports a module singleton, testing may require module-level replacement or another
indirection mechanism.

The testing characteristics therefore depend on the Hook's implementation.

## Dependency Hooks and Test Hooks

A test-specific implementation can be supplied through the same dependency contract:

```tsx
const fakeRepository: UserRepository = {
    getUser: async () => ({
        id: "1",
        name: "Test User",
    }),
};
```

The production component remains unaware of the substitution.

This allows tests to control:

* success
* failure
* latency
* returned data
* exceptional behavior
* side effects

without changing component logic.

## Dependency Hooks and Story Isolation

Component isolation environments can establish dependency providers around components:

```tsx
<RepositoryProvider repository={fixtureRepository}>
    <UserProfile/>
</RepositoryProvider>
```

The component can run without the application's complete infrastructure.

This supports:

* deterministic stories
* interaction testing
* visual testing
* accessibility testing
* failure scenarios
* alternate implementations

The dependency Hook acts as the stable consumer API.

## Dependency Hooks and External Stores

A dependency Hook can provide an external store:

```tsx
function useUserStore() {
    const store = useContext(UserStoreContext);

    if (!store) {
        throw new Error("UserStoreProvider is required");
    }

    return store;
}
```

A consumer can then subscribe:

```tsx
function UserList() {
    const store = useUserStore();

    const users = useSyncExternalStore(
        store.subscribe,
        store.getSnapshot
    );

    // ...
}
```

The dependency Hook resolves the store.

The external-store mechanism defines the state subscription semantics.

These are separate concerns.

## Dependency Hooks and Resource Caches

A resource cache can be exposed through a custom Hook:

```tsx
function useUserCache() {
    const cache = useContext(UserCacheContext);

    if (!cache) {
        throw new Error("UserCacheProvider is required");
    }

    return cache;
}
```

Consumers can then use the appropriate cache instance without knowing its construction mechanism.

The cache remains responsible for:

* resource identity
* reuse
* deduplication
* freshness
* invalidation
* eviction

The Hook only establishes the dependency-access boundary.

## Dependency Hooks and Server State

A custom Hook can expose a server-state client:

```tsx
function useServerStateClient() {
    return useContext(ServerStateClientContext);
}
```

A higher-level Hook can use that client:

```tsx
function useUser(userId: string) {
    const client = useServerStateClient();

    // server-state behavior
}
```

This creates a useful layering:

* dependency Hook exposes infrastructure
* behavior Hook implements reusable state behavior
* component consumes the resulting behavior

The dependency Hook should not absorb all server-state responsibilities merely because it provides the client.

## Dependency Hooks and Feature Boundaries

A feature can expose dependency Hooks as part of its internal architecture.

```tsx
function usePaymentGateway(): PaymentGateway {
    // ...
}

function useAnalytics(): Analytics {
    // ...
}
```

Feature components consume:

```tsx
function CheckoutForm() {
    const paymentGateway = usePaymentGateway();
    const analytics = useAnalytics();

    // ...
}
```

This prevents feature components from directly importing infrastructure implementations.

The feature composition boundary determines which concrete dependencies are available.

## Dependency Hooks and Headless Components

Headless components can use dependency Hooks to obtain behavior services without prescribing visual structure.

For example:

```tsx
function useListboxController() {
    // ...
}
```

A headless component may consume the controller:

```tsx
function Listbox() {
    const controller = useListboxController();

    // ...
}
```

The Hook can encapsulate behavior while the component remains responsible for exposing an unopinionated rendering
contract.

Dependency-through-custom-hooks is therefore compatible with headless component design, but it is not equivalent to it.

## Dependency Hooks and Container-Presentational Components

A container can resolve infrastructure through dependency Hooks:

```tsx
function UserContainer() {
    const repository = useUserRepository();

    // orchestration
}
```

The container can then pass only presentation-oriented inputs:

```tsx
<UserView
    user={user}
    onSave={saveUser}
/>
```

The presentational component does not need the dependency Hook.

This prevents infrastructure access from spreading throughout the rendering layer.

## Dependency Hooks and Feature Slicing

A feature can define dependency Hooks around its infrastructure contracts:

```tsx
function useBillingRepository() {
    return useContext(BillingRepositoryContext);
}
```

Feature components can consume the abstraction without importing the concrete repository.

This helps enforce feature boundaries.

However, dependency Hooks should not become a mechanism through which every feature can access every application
service.

## Dependency Hooks and Provider Scope

When a dependency Hook is Context-backed, provider placement determines which implementation the component receives.

```tsx
<RepositoryProvider repository={repositoryA}>
    <Editor/>
</RepositoryProvider>
```

and:

```tsx
<RepositoryProvider repository={repositoryB}>
    <Editor/>
</RepositoryProvider>
```

produce the same consumer code with different dependency environments.

This is one of the strongest reasons to place dependency resolution behind a custom Hook.

## Nested Overrides

Context-backed dependency Hooks naturally support nested overrides.

```tsx
<PaymentGatewayProvider gateway={productionGateway}>
    <Checkout/>

    <Preview>
        <PaymentGatewayProvider gateway={sandboxGateway}>
            <Checkout/>
        </PaymentGatewayProvider>
    </Preview>
</PaymentGatewayProvider>
```

Both components use:

```tsx
const gateway = usePaymentGateway();
```

but receive different implementations.

The consumer API remains unchanged.

## Dependency Hooks and Multiple Instances

A dependency Hook can allow the same component implementation to operate with different dependency instances.

```tsx
<RepositoryProvider repository={repositoryA}>
    <Editor/>
</RepositoryProvider>

<RepositoryProvider repository={repositoryB}>
    <Editor/>
</RepositoryProvider>
```

This is useful for:

* isolated feature instances
* multi-tenant interfaces
* previews
* tests
* embedded applications
* independent editors
* parallel environments

The Hook itself does not create the instances. The surrounding composition architecture does.

## Dependency Hooks and Server Components

Dependency Hooks must obey the execution environment in which they are used.

A Hook that accesses:

* browser storage
* browser events
* DOM APIs
* client-side services

belongs in the client-executed portion of the application.

A Hook that resolves a server-only dependency must remain within an environment where that dependency is valid.

A custom Hook does not erase the server/client boundary.

## Dependency Hooks and Client Boundaries

A dependency Hook used by a Client Component must resolve a client-compatible capability.

For example:

```tsx
function useBrowserStorage() {
    return useContext(BrowserStorageContext);
}
```

is appropriate for a browser-side dependency.

A Hook should not expose a server-only object to browser code merely because the object is reachable through Context or
another abstraction.

Dependency contracts must respect the execution environment.

## Dependency Hooks and Hydration

A dependency Hook can affect initial rendering.

If:

```tsx
const preferences = usePreferences();
```

returns environment-specific information that differs between server and client, the resulting markup can diverge.

Dependency Hooks should therefore distinguish between:

* deterministic initial dependencies
* client-only dependencies
* deferred initialization
* post-hydration state

The Hook abstraction does not eliminate hydration requirements.

## Dependency Hooks and Progressive Enhancement

A dependency Hook may provide an enhanced client capability:

```tsx
const share = useShareCapability();
```

but the feature should not assume that the client capability is the only way to perform the underlying operation.

When progressive enhancement is required, the application's fundamental behavior should remain available through the
appropriate non-JavaScript or server mechanism.

Dependency Hooks can provide enhancement capabilities without defining the entire enhancement strategy.

## Dependency Hooks and Lazy Loading

A dependency Hook may live inside a lazily loaded feature.

```tsx
const BillingFeature = lazy(
    () => import("./BillingFeature")
);
```

The feature can use:

```tsx
const gateway = usePaymentGateway();
```

The dependency provider can either exist above the lazy boundary or inside the loaded feature.

Provider placement should follow dependency scope.

Code splitting determines when code is loaded.

Dependency injection determines how the loaded component obtains its collaborators.

These are separate concerns.

## Dependency Hooks and Error Boundaries

A dependency Hook can throw when its required environment is missing.

```tsx
function useRepository() {
    const repository = useContext(RepositoryContext);

    if (!repository) {
        throw new Error("RepositoryProvider is required");
    }

    return repository;
}
```

An Error Boundary may contain the resulting rendering failure.

However, the Error Boundary does not repair the dependency architecture.

The provider boundary remains responsible for establishing the required environment.

## Dependency Hooks and Suspense

A dependency Hook can expose an asynchronous resource or service that participates in Suspense.

The Hook provides the capability:

```tsx
const userResource = useUserResource();
```

The resource determines whether reading it suspends.

Suspense determines where the fallback is displayed.

The dependency Hook should not be treated as the Suspense mechanism itself.

## Dependency Hooks and Imperative Handles

A component can use a dependency Hook to obtain an imperative service and expose a narrower imperative API through a
ref.

```tsx
function Editor({
                    ref,
                }: {
    ref: React.Ref<EditorHandle>;
}) {
    const editorService = useEditorService();

    useImperativeHandle(
        ref,
        () => ({
            focus() {
                editorService.focus();
            },
        }),
        [editorService]
    );

    // ...
}
```

The dependency Hook supplies the capability.

The imperative handle defines the external component API.

These responsibilities should remain separate.

## Dependency Hooks and Referential Stability

A dependency Hook can provide stable references as part of its effective API.

For example:

```tsx
const analytics = useAnalytics();
```

may return the same instance while the provider remains unchanged.

A Hook returning a newly created object on every render:

```tsx
function useCommands() {
    return {
        save,
        remove,
    };
}
```

creates a changing reference.

If consumers use that object in dependency arrays or memoized props, the changing identity may have consequences.

The Hook author should understand whether returned identity is significant.

## Dependency Hooks and Memoized Callbacks

A dependency Hook may use `useCallback` when exposing commands whose stable identity matters.

```tsx
function useUserCommands() {
    const repository = useUserRepository();

    return useCallback(
        (id: string) => repository.remove(id),
        [repository]
    );
}
```

The callback is stable while `repository` is stable.

This is useful when a consumer passes the command to a memoized component or uses it as a reactive dependency.

The Hook should not memoize functions indiscriminately.

## Dependency Hooks and Memoized Values

A dependency Hook may use `useMemo` to create a derived dependency object:

```tsx
function useUserCommands() {
    const repository = useUserRepository();

    const commands = useMemo(
        () => ({
            save: (user: User) => repository.save(user),
            remove: (id: string) => repository.remove(id),
        }),
        [repository]
    );

    return commands;
}
```

The memoized object is a derived API value.

This is different from using `useMemo` as a dependency-injection mechanism itself.

The dependency contract should remain clear.

## Dependency Hooks and Component Identity

Changing the dependency returned by a Hook does not inherently remount the component.

```tsx
function Editor() {
    const repository = useRepository();

    // ...
}
```

If the provider changes from one repository instance to another, `Editor` can remain the same React instance.

The component must therefore correctly respond to dependency changes.

If state should reset when the dependency changes, that should be modeled explicitly through component identity or state
logic.

## Dependency Hooks and Keys

Do not use a dependency identifier as a `key` merely to force dependency synchronization.

```tsx
<Editor key={repository.id}/>
```

should only be used when changing the key intentionally means replacing the component instance.

Dependency replacement and component identity are separate concepts.

## Dependency Hooks and Resource Ownership

A Hook can expose a resource without owning it:

```tsx
function useDatabase() {
    return useContext(DatabaseContext);
}
```

A consumer should not assume it can dispose the database.

By contrast, a Hook that creates a resource for the component may own it:

```tsx
function useConnection(url: string) {
    // create, connect, and clean up according to the Hook's contract
}
```

The Hook's abstraction should communicate whether it is:

* a dependency accessor
* a dependency factory
* a lifecycle manager
* a behavior abstraction

Combining these roles should be intentional.

## Dependency Hooks and Dependency Containers

A Hook can hide a dependency container, but that does not automatically make the architecture good.

Avoid:

```tsx
function useApplicationContainer() {
    return container;
}
```

followed by arbitrary resolution:

```tsx
function Component() {
    const container = useApplicationContainer();

    const service = container.resolve("service");
}
```

This simply moves the service locator behind a Hook.

Prefer focused dependency APIs:

```tsx
function Component() {
    const service = useService();
}
```

The consumer should depend on a meaningful capability, not on the mechanism used to locate it.

## Dependency Hooks and Direct Imports

A custom Hook is not necessary for every imported dependency.

A pure utility:

```ts
import {formatCurrency} from "./formatCurrency";
```

usually does not need:

```tsx
const formatCurrency = useCurrencyFormatter();
```

unless there is a meaningful reason for environmental configuration, substitution, or lifecycle.

Introducing a Hook solely to wrap a direct import adds indirection without necessarily creating architectural value.

## Dependency Hooks and Module Singletons

A Hook can provide access to a module-level singleton:

```tsx
const analytics = createAnalytics();

function useAnalytics() {
    return analytics;
}
```

This gives the consumer a stable API but does not change the singleton's scope.

The dependency remains module-scoped.

This can be appropriate when the dependency is intentionally application-wide and immutable in scope.

It should not be mistaken for subtree-scoped dependency injection.

## Dependency Hooks and Context

Context-backed dependency Hooks provide both a scoped implementation and a stable consumer API.

```tsx
function useRepository() {
    const repository = useContext(RepositoryContext);

    if (!repository) {
        throw new Error("RepositoryProvider is required");
    }

    return repository;
}
```

This combination is often useful because:

* Context provides scope
* the Hook provides the consumer API
* the provider controls implementation
* consumers remain independent of Context representation

The Context and Hook therefore solve complementary problems.

## Dependency Hooks and Provider Composition

A provider tree may establish multiple dependency environments:

```tsx
<RepositoryProvider repository={repository}>
    <LoggerProvider logger={logger}>
        <PaymentGatewayProvider gateway={gateway}>
            <App/>
        </PaymentGatewayProvider>
    </LoggerProvider>
</RepositoryProvider>
```

Consumers access focused dependencies:

```tsx
const repository = useRepository();
const logger = useLogger();
const gateway = usePaymentGateway();
```

Provider composition determines how those environments are assembled.

The dependency Hooks determine how consumers access them.

## Avoiding Hook Monoliths

Avoid a Hook that exposes every application capability:

```tsx
const {
    repository,
    logger,
    analytics,
    storage,
    paymentGateway,
    notificationService,
    featureFlags,
} = useApplicationServices();
```

This recreates the application service container problem.

Focused Hooks communicate narrower contracts:

```tsx
const repository = useUserRepository();
const logger = useLogger();
const analytics = useAnalytics();
```

The consumer's dependencies remain visible and meaningful.

## Dependency Hooks and Feature APIs

A feature can expose internal dependency Hooks without exposing concrete infrastructure.

For example:

```tsx
function useBillingRepository() {
    // internal dependency resolution
}
```

Feature components consume the abstraction:

```tsx
function InvoiceEditor() {
    const repository = useBillingRepository();

    // ...
}
```

The concrete repository implementation can change without requiring every component to change.

This can create a clean dependency boundary within a feature.

## Dependency Hooks and Public Libraries

A reusable component library should be cautious about hidden environmental dependencies.

A component that requires:

```tsx
const repository = useApplicationRepository();
```

cannot be rendered independently without the corresponding environment.

For application-specific components this may be appropriate.

For generic library components, explicit props may provide a more portable contract.

A library can still define its own Context-backed dependency Hooks when the dependency is part of the library's own
abstraction.

## Common Misuse

### Wrapping Every Import in a Hook

A pure utility does not become more injectable merely because it is returned from a custom Hook.

### Creating a Service Locator Hook

```tsx
const services = useServices();
```

followed by arbitrary service lookup hides rather than removes coupling.

### Returning a Giant Object

A Hook that returns every application capability creates a broad dependency contract.

### Hiding Required Environment

A component can appear self-contained while actually requiring several providers.

### Ignoring Provider Scope

A dependency Hook backed by Context inherits the scope defined by its provider.

### Ignoring Dependency Identity

Changing the object returned by a Hook can affect Effects, memoization, subscriptions, and child rendering.

### Constructing Resources During Every Render

A Hook that creates a new resource without an intentional lifetime can produce unnecessary instances and leaks.

### Disposing Shared Dependencies

A consumer should not destroy a dependency merely because a Hook gave it access to that dependency.

### Using Hooks to Force Remounts

Changing a dependency returned by a Hook does not imply that the component should receive a different React identity.

### Hiding Reactive Dependencies

A custom Hook does not justify omitting returned dependencies from Effects that use them.

### Mixing Dependency Resolution With Unrelated State

A dependency Hook should not become a general application-state Hook simply because it can access other infrastructure.

### Using Context Without a Consumer API

Direct `useContext` calls throughout the application can couple consumers to the Context implementation unnecessarily.

## Advantages

Dependency Hooks provide a stable consumer-facing API.

They can hide dependency-resolution mechanisms from components.

They work naturally with Context-based subtree scoping.

They can expose focused capabilities rather than entire service containers.

They allow infrastructure implementations to change without changing component consumers.

They can centralize provider validation and dependency normalization.

They can establish stable dependency contracts for reusable component logic.

They work well with feature boundaries and application composition.

They can make tests independent of production dependency implementations when the underlying dependency can be
substituted.

## Disadvantages

Dependencies can become less visible than ordinary props.

A component may require an environmental provider that is not obvious from its call site.

Poorly designed Hooks can become service locators.

Hook APIs can hide dependency scope and lifetime.

A Hook may accidentally couple generic components to application-specific infrastructure.

Returned objects and functions can have unintended identity changes.

The Hook abstraction can add indirection when direct imports or props would be simpler.

The pattern does not automatically solve resource ownership, state management, caching, cancellation, or server/client
boundaries.

## When to Use

Use dependency-through-custom-hooks when:

* components should consume capabilities without knowing their resolution mechanism
* a dependency has a stable conceptual API
* dependency resolution should be centralized
* Context is used and direct Context access should remain encapsulated
* multiple components need the same environmental dependency
* dependency implementation may change
* feature infrastructure should remain hidden from feature components
* provider validation should be centralized
* a capability should be exposed through a semantic API
* the dependency is naturally environmental rather than ordinary component input

## When Not to Use

Avoid dependency-through-custom-hooks when:

* a dependency is naturally an explicit component input
* only one component needs the value and passing a prop is simpler
* the value is a pure utility that does not require substitution or scope
* the Hook would merely wrap a direct import without adding an architectural boundary
* the Hook would become a service locator
* a generic component would become unnecessarily coupled to an application environment
* dependency construction and ownership would become ambiguous
* hiding the dependency would make the component contract materially harder to understand

## Relationship to Other Patterns

### Dependency Through Props

Props provide explicit dependency delivery:

```tsx
<Editor repository={repository}/>
```

A dependency Hook hides delivery behind a consumer API:

```tsx
function Editor() {
    const repository = useRepository();
}
```

Props are generally more explicit.

Dependency Hooks are generally more convenient when the dependency is environmental or shared across a subtree.

### Dependency Through Context

Context provides scoped dependency distribution.

A custom Hook can encapsulate that Context:

```tsx
function useRepository() {
    return useContext(RepositoryContext);
}
```

Context answers **where the dependency comes from**.

The Hook answers **how consumers access the dependency**.

### Custom Hooks

A dependency Hook is a specialized form of custom Hook whose primary responsibility is exposing or resolving an external
capability.

Not every custom Hook is dependency injection.

### Context Custom Hook

A Context custom Hook is the common implementation of dependency-through-context.

The dependency Hook can therefore sit on top of Context without exposing the Context object to consumers.

### Provider Composition

Provider composition assembles dependency environments.

Dependency Hooks consume the resulting capabilities.

### Feature-Sliced Components

Feature-specific dependency Hooks can keep infrastructure resolution inside a feature boundary.

### Container-Presentational Components

Containers can consume dependencies through Hooks and pass presentation-oriented data and commands to presentational
components.

### Headless Components

Headless abstractions can use dependency Hooks to obtain internal behavior services while leaving rendering decisions to
consumers.

### External Store

A dependency Hook can provide an external store, while the external-store API defines subscription and snapshot
semantics.

### Resource Cache

A dependency Hook can expose a cache instance, while the cache defines resource identity and lifecycle semantics.

### Server State

A dependency Hook can expose a server-state client or repository, while the server-state layer defines remote-state
lifecycle.

### Effect Cleanup

Hooks that establish subscriptions or external relationships can encapsulate their cleanup, while dependency-access
Hooks should generally not assume ownership of the supplied resource.

### Abortable Async Effects

A dependency Hook can expose a cancellation-aware service, while the operation's owner remains responsible for
cancellation and invalidation semantics.

### Memoized Callbacks

A dependency Hook may use `useCallback` when the identity of an exposed function is part of its useful contract.

### Referential Stability

The identity of values returned from dependency Hooks can affect React synchronization and optimization behavior.

### Component Identity

Changing a dependency returned by a Hook does not inherently change the identity of the component consuming it.

### Server Components

Dependency Hooks must respect the execution environment and cannot bypass server/client architectural boundaries.

## Design Rules

1. Use custom Hooks as semantic dependency APIs, not arbitrary wrappers around imports.

2. Expose focused capabilities rather than application service registries.

3. Keep dependency contracts narrow.

4. Centralize Context access behind custom Hooks when Context is an implementation detail.

5. Fail clearly when a required dependency environment is missing.

6. Distinguish dependency resolution from reusable behavior.

7. Distinguish dependency access from dependency ownership.

8. Define dependency lifetime independently from the Hook's API.

9. Do not assume a Hook owns a resource merely because it returns that resource.

10. Respect dependency identity when consumers use the result in Effects, subscriptions, or memoized props.

11. Use stable returned functions or objects only when their identity has a concrete purpose.

12. Do not use custom Hooks to hide service-locator behavior.

13. Prefer explicit props when dependency visibility is more valuable than environmental convenience.

14. Prefer dependency Hooks when the dependency is naturally scoped to an environment or subtree.

15. Keep generic components independent from application-specific dependency environments when portability matters.

16. Keep server-only capabilities within server-compatible execution boundaries.

17. Do not use dependency Hooks as a substitute for state-management architecture.

18. Do not use dependency Hooks as a substitute for resource caching, server-state management, or cancellation
    architecture.

19. Treat the Hook's returned value and identity semantics as part of its effective API.

20. Keep dependency resolution close to the composition architecture rather than scattering construction throughout
    consumers.

## Core Principle

**A custom Hook can serve as the semantic boundary through which a component obtains a capability without knowing how
that capability is resolved.**

The consumer sees:

```tsx
function Editor() {
    const repository = useDocumentRepository();

    // ...
}
```

The dependency architecture determines what `useDocumentRepository()` means:

```tsx
function useDocumentRepository() {
    const repository = useContext(DocumentRepositoryContext);

    if (repository === null) {
        throw new Error(
            "DocumentRepositoryProvider is required"
        );
    }

    return repository;
}
```

The component does not need to know whether the repository is supplied through Context, constructed elsewhere, selected
from an environment, or replaced for testing.

The essential architectural boundary is therefore:

**component behavior depends on a capability; the custom Hook owns the mechanism by which that capability is resolved.**

When explicit dependency visibility is more important, use props. When subtree-scoped distribution is the primary
requirement, Context provides the delivery mechanism. When consumers should not depend directly on that Context
representation, place a custom Hook over it. The Hook is the semantic dependency API; Context, props, containers, or
other mechanisms are implementation details of dependency delivery.
