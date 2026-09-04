# Dependency Through Context

Dependency through Context is a dependency-injection technique in which a component obtains a dependency from a React
Context established by an ancestor rather than receiving that dependency directly through props.

The defining property is **scoped implicit dependency delivery**. A provider establishes a dependency for a subtree, and
descendants consume that dependency without intermediate components having to transport it.

```tsx
const UserRepositoryContext =
    createContext<UserRepository | null>(null);

function UserRepositoryProvider({
                                    repository,
                                    children,
                                }: {
    repository: UserRepository;
    children: ReactNode;
}) {
    return (
        <UserRepositoryContext.Provider value={repository}>
            {children}
        </UserRepositoryContext.Provider>
    );
}
```

A descendant consumes the dependency:

```tsx
function UserProfile({userId}: { userId: string }) {
    const repository = useUserRepository();

    // ...
}
```

The intermediate components do not need to know that `repository` exists.

## Intent

Use Context to distribute a dependency to a React subtree when multiple descendants need the same capability and
explicit prop threading would create unnecessary coupling.

```tsx
<UserRepositoryProvider repository={repository}>
    <UserPage/>
</UserRepositoryProvider>
```

The provider defines the scope.

The consumer declares the dependency through its Context-based API.

The dependency does not need to appear in every intermediate component's props.

## Dependency Scope

Context-based dependency injection is fundamentally a **scope mechanism**.

A provider establishes a dependency for the portion of the React tree beneath it.

```tsx
<UserRepositoryProvider repository={repository}>
    <UserList/>
    <UserProfile/>
    <UserEditor/>
</UserRepositoryProvider>
```

All three descendants can resolve the same dependency.

A nested provider can establish a different instance:

```tsx
<UserRepositoryProvider repository={primaryRepository}>
    <UserList/>

    <UserRepositoryProvider repository={secondaryRepository}>
        <UserEditor/>
    </UserRepositoryProvider>
</UserRepositoryProvider>
```

The inner subtree receives `secondaryRepository`.

This makes Context useful for dependencies whose lifetime or configuration naturally follows a component subtree.

## Provider as Composition Boundary

The provider is part of the composition boundary.

```tsx
function Feature() {
    const repository = createRepository();

    return (
        <RepositoryProvider repository={repository}>
            <Editor/>
        </RepositoryProvider>
    );
}
```

The provider establishes the relationship between:

* the concrete dependency
* its scope
* the consumers allowed to access it

The consumer does not construct the dependency.

```tsx
function Editor() {
    const repository = useRepository();

    // ...
}
```

This separates dependency construction from dependency consumption.

## Consumer Contract

A Context consumer should expose a clear dependency contract even though the dependency is not represented as a prop.

A custom Hook is usually the cleanest API:

```tsx
function useRepository(): Repository {
    const repository = useContext(RepositoryContext);

    if (!repository) {
        throw new Error(
            "useRepository must be used within RepositoryProvider"
        );
    }

    return repository;
}
```

The consuming component then communicates its dependency through the Hook it invokes:

```tsx
function Editor() {
    const repository = useRepository();

    // ...
}
```

The Context itself can remain an implementation detail.

## Required Dependencies

A required dependency should fail clearly when the consumer is outside the appropriate provider.

Avoid silently creating an unrelated default:

```tsx
const RepositoryContext =
    createContext(createRepository());
```

This can hide a missing provider and accidentally create a dependency with the wrong scope or lifetime.

Prefer:

```tsx
const RepositoryContext =
    createContext<Repository | null>(null);
```

and validate consumption through a custom Hook.

```tsx
function useRepository() {
    const repository = useContext(RepositoryContext);

    if (repository === null) {
        throw new Error(
            "RepositoryProvider is required"
        );
    }

    return repository;
}
```

The failure occurs at the architectural boundary where the dependency contract is violated.

## Default Values

Context defaults are appropriate when a meaningful default dependency genuinely exists.

For example, a logging abstraction may intentionally have a no-op implementation:

```tsx
const LoggerContext =
    createContext<Logger>(noopLogger);
```

This is different from using a default merely to avoid provider configuration.

A default should have deliberate semantics.

It should not conceal an invalid component tree.

## Dependency Identity

Context values are references, so dependency identity matters.

Avoid unnecessarily constructing a new dependency value on every provider render:

```tsx
function Provider({children}: Props) {
    const value = {
        repository: createRepository(),
    };

    return (
        <RepositoryContext.Provider value={value}>
            {children}
        </RepositoryContext.Provider>
    );
}
```

This can recreate the dependency repeatedly and can also cause consumers to observe changed Context values.

Prefer an ownership model that gives the dependency an intentional lifetime:

```tsx
function Provider({children}: Props) {
    const repository = useMemo(
        () => createRepository(),
        []
    );

    return (
        <RepositoryContext.Provider value={repository}>
            {children}
        </RepositoryContext.Provider>
    );
}
```

However, `useMemo` should not be used as a substitute for deciding who owns the dependency or how long it should live.

If the dependency belongs outside React, it may be more appropriate to construct it at a higher composition boundary.

## Dependency Lifetime

The provider's position in the tree can define the effective lifetime of an injected dependency.

A provider at the application root can expose a long-lived dependency:

```tsx
<ApplicationRepositoryProvider
    repository={repository}
>
    <App/>
</ApplicationRepositoryProvider>
```

A provider inside a feature can scope it to that feature:

```tsx
<EditorRepositoryProvider
    repository={repository}
>
    <Editor/>
</EditorRepositoryProvider>
```

A provider inside a route can scope it to the route subtree.

Context therefore allows dependency scope to follow the ownership structure of the UI tree.

The provider does not automatically own resource cleanup. If the provider creates a resource, its lifecycle
responsibilities must be explicitly designed.

## Provider-Owned Resources

A provider can construct and own a dependency when that lifetime is appropriate.

```tsx
function RepositoryProvider({
                                children,
                            }: {
    children: ReactNode;
}) {
    const repository = useMemo(
        () => createRepository(),
        []
    );

    return (
        <RepositoryContext.Provider value={repository}>
            {children}
        </RepositoryContext.Provider>
    );
}
```

If the dependency requires cleanup, the provider may also own that lifecycle.

```tsx
function ConnectionProvider({
                                children,
                            }: {
    children: ReactNode;
}) {
    const connection = useMemo(
        () => createConnection(),
        []
    );

    useEffect(() => {
        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [connection]);

    return (
        <ConnectionContext.Provider value={connection}>
            {children}
        </ConnectionContext.Provider>
    );
}
```

This is correct only when the provider actually owns the connection.

A provider receiving an externally owned dependency should not automatically dispose it.

## Injecting Externally Owned Dependencies

A provider does not have to construct its dependency.

```tsx
function RepositoryProvider({
                                repository,
                                children,
                            }: {
    repository: Repository;
    children: ReactNode;
}) {
    return (
        <RepositoryContext.Provider value={repository}>
            {children}
        </RepositoryContext.Provider>
    );
}
```

The composition root controls construction:

```tsx
function Application() {
    const repository = createRepository();

    return (
        <RepositoryProvider repository={repository}>
            <App/>
        </RepositoryProvider>
    );
}
```

This separates:

* dependency construction
* dependency scope
* dependency consumption

The provider is responsible for establishing the Context boundary, not necessarily for constructing the object.

## Context as an Environmental Dependency

A Context-injected dependency behaves like an environmental capability from the consumer's perspective.

```tsx
function Editor() {
    const repository = useRepository();
}
```

The component does not receive `repository` directly.

Instead, it assumes an appropriate environment exists.

This is the central trade-off of Context-based dependency injection:

**dependency visibility decreases while descendant distribution becomes easier.**

A component's props no longer reveal the dependency.

Its Context usage does.

## Props Versus Context

Props:

```tsx
function Editor({
                    repository,
                }: {
    repository: Repository;
}) {
    // ...
}
```

Context:

```tsx
function Editor() {
    const repository = useRepository();

    // ...
}
```

Props make the dependency visible at the component call site.

Context makes the dependency visible in the component implementation while hiding the delivery path from intermediate
components.

Use props when direct explicit dependency flow is desirable.

Use Context when a dependency is naturally scoped to a subtree and many descendants require it.

## Prop Drilling as the Trigger

Context-based dependency injection is often justified when a dependency must pass through intermediate components that
do not consume it.

Without Context:

```tsx
function Page({
                  repository,
              }: {
    repository: Repository;
}) {
    return (
        <Layout repository={repository}/>
    );
}

function Layout({
                    repository,
                }: {
    repository: Repository;
}) {
    return (
        <Editor repository={repository}/>
    );
}
```

With Context:

```tsx
<RepositoryProvider repository={repository}>
    <Page/>
</RepositoryProvider>
```

The intermediate components no longer need to participate in dependency transport.

This can reduce structural coupling.

However, prop drilling is not automatically a reason to introduce Context. If only one or two levels are involved and
explicitness is valuable, props may remain the simpler architecture.

## Context Does Not Mean Global

A common misconception is that a Context dependency is necessarily global.

Context is scoped to a subtree.

```tsx
<FeatureProvider>
    <Feature/>
</FeatureProvider>
```

The dependency is available only to descendants within that provider boundary.

Multiple independent instances can exist:

```tsx
<EditorProvider editor={editorA}>
    <Editor/>
</EditorProvider>

<EditorProvider editor={editorB}>
    <Editor/>
</EditorProvider>
```

The two subtrees can consume different instances of the same dependency type.

This is one of the primary architectural advantages of Context over module-level singletons.

## Nested Overrides

Nested providers allow local replacement of a dependency.

```tsx
<LoggerProvider logger={productionLogger}>
    <Application/>

    <Preview
        content={
            <LoggerProvider logger={previewLogger}>
                <PreviewEditor/>
            </LoggerProvider>
        }
    />
</LoggerProvider>
```

`PreviewEditor` receives `previewLogger`.

Other descendants continue to receive `productionLogger`.

This makes Context suitable for:

* feature-specific configuration
* tenant-specific dependencies
* test overrides
* preview environments
* localized infrastructure
* isolated application instances
* temporary alternate implementations

## Testing

Context makes dependency substitution possible without modifying every consumer's props.

Production:

```tsx
<RepositoryProvider repository={productionRepository}>
    <UserProfile/>
</RepositoryProvider>
```

Test:

```tsx
render(
    <RepositoryProvider repository={fakeRepository}>
        <UserProfile/>
    </RepositoryProvider>
);
```

The component itself remains unchanged:

```tsx
function UserProfile() {
    const repository = useRepository();

    // ...
}
```

This is especially useful when many descendants consume the same dependency.

A test can replace the dependency once at the boundary instead of passing a fake through every intermediate component.

## Test Isolation

Nested providers can isolate individual tests or subtrees.

```tsx
<RepositoryProvider repository={defaultRepository}>
    <Application/>

    <TestScenario
        content={
            <RepositoryProvider repository={scenarioRepository}>
                <Editor/>
            </RepositoryProvider>
        }
    />
</RepositoryProvider>
```

The inner provider overrides the dependency only for the scenario.

This is useful for testing behavior under different implementations without changing production component APIs.

## Dependency Substitution

Context allows a stable consumer API while changing implementations.

```tsx
type Storage = {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
};
```

The consumer depends only on the contract:

```tsx
function Preferences() {
    const storage = useStorage();

    // ...
}
```

Different environments can supply:

```tsx
<StorageProvider storage={browserStorage}>
    <App/>
</StorageProvider>
```

or:

```tsx
<StorageProvider storage={memoryStorage}>
    <TestApp/>
</StorageProvider>
```

The consumer remains unchanged.

## Narrow Dependency Contracts

Context does not eliminate the need for narrow interfaces.

Avoid:

```tsx
const ServicesContext =
    createContext<ApplicationServices | null>(null);
```

when consumers only need one capability.

Prefer:

```tsx
const LoggerContext =
    createContext<Logger | null>(null);
```

and:

```tsx
function useLogger() {
    // ...
}
```

A focused Context represents a focused dependency.

A giant Context containing unrelated services recreates a service container inside React.

## Service Locator Anti-Pattern

Context can accidentally become a service locator.

For example:

```tsx
function useServices() {
    return useContext(ServicesContext);
}

function Editor() {
    const services = useServices();

    const repository = services.repositories.documents;
    const logger = services.logging.logger;
}
```

The component is still discovering dependencies from a registry.

The dependency is merely hidden behind Context.

Prefer dedicated contracts:

```tsx
function Editor() {
    const repository = useDocumentRepository();
    const logger = useLogger();
}
```

Each Context represents a meaningful capability or cohesive abstraction.

## One Context Per Dependency

There is no absolute requirement to create one Context per dependency.

A cohesive abstraction can expose several operations:

```ts
type PaymentGateway = {
    authorize(input: PaymentInput): Promise<Authorization>;
    capture(id: string): Promise<void>;
};
```

One Context can provide the gateway:

```tsx
const PaymentGatewayContext =
    createContext<PaymentGateway | null>(null);
```

The important rule is conceptual cohesion.

Group capabilities that form one meaningful dependency contract.

Do not group unrelated application services merely to reduce the number of providers.

## Context Value Objects

Sometimes several closely related values form one dependency contract:

```ts
type Localization = {
    locale: string;
    formatDate(date: Date): string;
    formatNumber(value: number): string;
};
```

A single Context can expose that abstraction.

However, changing any part of the Context value can cause consumers to observe a changed value.

The contract should therefore remain cohesive and its update characteristics should be understood.

## Context Updates

Context consumers respond when the Context value they consume changes according to React's Context semantics.

This matters when the injected dependency itself is mutable or when the provider supplies a frequently changing value.

Avoid using one Context for both:

* a long-lived dependency
* rapidly changing application state

when those concerns have different consumption patterns.

For example, a repository object and live UI state often have different architectural roles.

Separating them can make dependency scope and update behavior clearer.

## Dependency Context Versus State Context

A Context can distribute either a dependency or application state.

These are not the same design.

Dependency:

```tsx
<RepositoryProvider repository={repository}>
    <App/>
</RepositoryProvider>
```

State:

```tsx
<UserStateProvider>
    <App/>
</UserStateProvider>
```

The repository is a capability used by components.

The user state is application data whose changes are part of the state model.

A Context can technically contain both, but combining them can obscure ownership and update semantics.

## Dependency Context Versus External Store

A dependency Context can provide an external store:

```tsx
<StoreProvider store={store}>
    <UserList/>
</StoreProvider>
```

The Context establishes which store instance is available.

The external store defines:

* state ownership
* subscription semantics
* snapshot semantics
* update behavior

The two concerns should remain distinct.

Context provides the dependency.

The external store provides the state-management mechanism.

## Context and `useSyncExternalStore`

A component can obtain an external store through Context and subscribe to it independently:

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

The Context determines which store is being consumed.

`useSyncExternalStore` determines how React subscribes to that external state.

Do not treat Context itself as the external-store synchronization mechanism.

## Context and Custom Hooks

A custom Hook is usually the preferred consumer-facing API for a dependency Context.

Instead of:

```tsx
const repository =
    useContext(RepositoryContext);
```

throughout the application, expose:

```tsx
const repository = useRepository();
```

The custom Hook can enforce:

* provider presence
* dependency typing
* error messages
* future implementation changes
* normalization
* derived capabilities

The Context remains an implementation detail of the dependency-distribution mechanism.

## Provider API Design

A provider should expose the dependency boundary clearly.

```tsx
type RepositoryProviderProps = {
    repository: Repository;
    children: ReactNode;
};
```

This makes the provider's composition role explicit.

Avoid providers that simultaneously:

* construct many unrelated services
* manage unrelated state
* perform application orchestration
* expose dozens of Context values
* become responsible for the entire feature

A provider should have a coherent architectural responsibility.

## Provider Composition

Multiple dependency providers can be composed:

```tsx
<RepositoryProvider repository={repository}>
    <LoggerProvider logger={logger}>
        <PaymentGatewayProvider gateway={gateway}>
            <App/>
        </PaymentGatewayProvider>
    </LoggerProvider>
</RepositoryProvider>
```

This makes dependency boundaries explicit.

When provider nesting becomes cumbersome, provider composition can be abstracted into a dedicated composition boundary.

That does not change the underlying dependency scopes.

The provider-composition concern should remain separate from the dependency-injection concern.

## Provider Placement

Provider placement should follow dependency scope.

If only one feature requires a dependency:

```tsx
<FeatureProvider dependency={dependency}>
    <Feature/>
</FeatureProvider>
```

is generally preferable to placing the provider around the entire application.

If the dependency is genuinely shared across the entire application:

```tsx
<ApplicationDependencyProvider dependency={dependency}>
    <App/>
</ApplicationDependencyProvider>
```

may be appropriate.

The broadest possible provider scope is not automatically the best scope.

## Feature-Scoped Dependencies

Feature boundaries are often natural Context boundaries.

```tsx
function BillingFeature() {
    return (
        <PaymentGatewayProvider gateway={gateway}>
            <BillingUI/>
        </PaymentGatewayProvider>
    );
}
```

Billing descendants can consume the payment capability without knowing how it was constructed.

Another feature can use a different gateway:

```tsx
<PaymentGatewayProvider gateway={sandboxGateway}>
    <BillingPreview/>
</PaymentGatewayProvider>
```

This keeps dependency scope aligned with feature ownership.

## Route-Scoped Dependencies

A route subtree can establish a dependency specific to that route.

```tsx
function EditorRoute() {
    return (
        <EditorProvider editor={editor}>
            <EditorPage/>
        </EditorProvider>
    );
}
```

When the route leaves the tree, the provider subtree can disappear.

If the provider owns the dependency, this can naturally align resource lifetime with route lifetime.

The exact lifecycle still depends on the dependency and framework architecture.

## Request-Scoped Dependencies

In server-rendered architectures, dependency scope can correspond to a request.

For example, request-specific services may include:

* authenticated request context
* request-scoped clients
* request metadata
* tracing
* localization
* authorization capabilities

Such dependencies must not accidentally become process-global mutable state.

The Context mechanism is only one part of the architecture. Server execution models must determine the actual lifetime
and isolation guarantees.

## Server Components

Server Components introduce an execution boundary that affects Context-based dependency injection.

A server-only dependency may be appropriate for server-executed components:

```tsx
function UserProfile() {
    const repository = useUserRepository();

    // server-side work
}
```

But that dependency must not be assumed to be transferable to a Client Component.

A database connection, server credential, or other server-only object cannot simply become a browser dependency because
it was placed in Context.

Dependency scope and execution environment must remain compatible.

## Client Components

Client-side Context dependencies are useful for capabilities that belong in the browser environment.

Examples include:

* browser storage adapters
* client-side API clients
* analytics clients
* UI service abstractions
* browser event managers
* client-side feature configuration

The provider should be placed within the client-executed portion of the tree when the dependency requires browser APIs.

## Server/Client Dependency Boundaries

A dependency may have separate server and client implementations.

For example:

```ts
type Analytics = {
    track(event: AnalyticsEvent): void;
};
```

The server composition boundary can provide one implementation:

```tsx
<AnalyticsProvider analytics={serverAnalytics}>
    <ServerFeature/>
</AnalyticsProvider>
```

while the client application provides another:

```tsx
<AnalyticsProvider analytics={browserAnalytics}>
    <ClientFeature/>
</AnalyticsProvider>
```

The contract remains stable while the concrete implementation is environment-specific.

## Hydration

Context values that affect rendered output must remain consistent with the application's hydration model.

A dependency that returns different results between server and client can cause divergent rendering.

For example, a dependency that directly reads browser-only state during initial rendering may produce a different value
on the client.

The dependency abstraction should therefore respect deterministic initial rendering and appropriate client-only
initialization.

## Context and Effects

A Context-injected dependency can be used by an Effect:

```tsx
function Subscription() {
    const client = useClient();

    useEffect(() => {
        const unsubscribe =
            client.subscribe(handleEvent);

        return unsubscribe;
    }, [client]);

    // ...
}
```

The dependency belongs in the Effect's reactive dependencies when the Effect uses it.

If the provider supplies a different client, the component must synchronize its external relationship with that new
client.

Do not suppress the dependency merely because it originates from Context.

## Context and Cleanup

A consumer should clean up relationships it establishes with an injected dependency.

```tsx
function Listener() {
    const eventBus = useEventBus();

    useEffect(() => {
        return eventBus.subscribe(handleEvent);
    }, [eventBus]);

    // ...
}
```

The consumer is responsible for its subscription.

It should not necessarily dispose the entire event bus.

Resource ownership must remain distinct from dependency access.

## Context and Imperative Handles

A Context dependency can be used to implement an imperative operation exposed through a component boundary.

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

Context provides the service.

The imperative handle defines the externally exposed component API.

These are separate architectural mechanisms.

## Context and Headless Components

Headless components may use Context to distribute behavior and state among cooperating descendants.

```tsx
<ListboxProvider>
    <Listbox>
        <ListboxButton/>
        <ListboxOptions/>
    </Listbox>
</ListboxProvider>
```

The Context may provide internal capabilities such as:

* selection state
* event handlers
* keyboard interaction
* IDs
* focus management
* accessibility state

This is a legitimate use of dependency-through-context when those descendants belong to the same logical component
abstraction.

The Context should remain scoped to the abstraction rather than becoming a general application service registry.

## Context and Compound Components

Compound components are a natural consumer of Context-based dependency distribution.

```tsx
<Tabs>
    <Tabs.List>
        <Tabs.Tab/>
    </Tabs.List>

    <Tabs.Panel/>
</Tabs>
```

The compound component can establish Context containing the capabilities required by its descendants.

The Context is then an internal communication and dependency mechanism for the compound component.

This is distinct from application-level dependency injection, even though the underlying delivery mechanism is the same.

## Context and Container-Presentational Components

A container may consume dependencies through Context:

```tsx
function UserContainer() {
    const repository = useUserRepository();

    // orchestration
}
```

It can then pass presentation-specific data to a presentational component:

```tsx
<UserView
    user={user}
    onSave={saveUser}
/>
```

This keeps infrastructure dependencies out of the presentation layer.

Context should therefore not be interpreted as a reason for every component to access application services directly.

## Context and Feature Slicing

Feature-oriented architecture can use Context to establish dependencies within a feature boundary.

```tsx
<CheckoutDependencies
    paymentGateway={paymentGateway}
    analytics={analytics}
>
    <CheckoutFeature/>
</CheckoutDependencies>
```

The feature can expose focused consumer Hooks:

```tsx
const paymentGateway = usePaymentGateway();
const analytics = useAnalytics();
```

The feature remains independent of how those concrete dependencies were constructed.

The Context boundary should remain aligned with feature ownership rather than becoming an application-wide dumping
ground.

## Context and Dependency Identity

Context does not perform structural equality on dependency objects.

If a provider changes from:

```tsx
value = {repositoryA}
```

to:

```tsx
value = {repositoryB}
```

consumers observe a different dependency.

Even if the two objects expose identical methods, they are different references.

This can affect:

* Effects
* subscriptions
* memoization
* caches
* external connections
* child rendering
* resource ownership

Dependency replacement should therefore be an intentional operation.

## Context and Component Identity

Changing a Context dependency does not automatically remount consumers.

A consumer can retain its React identity while receiving a different dependency.

```tsx
<RepositoryProvider repository={repositoryA}>
    <Editor/>
</RepositoryProvider>
```

can become:

```tsx
<RepositoryProvider repository={repositoryB}>
    <Editor/>
</RepositoryProvider>
```

without changing the `Editor` identity.

The consumer must therefore correctly synchronize with the changed dependency.

If replacement should reset component state, that is a separate component-identity decision.

## Context and Keys

A dependency should not be placed in a component's `key` merely to force consumers to reset.

Avoid:

```tsx
<Editor
    key={repository.id}
/>
```

unless changing the repository is intentionally supposed to replace the editor instance.

Dependency replacement and component identity are separate concerns.

## Context and Memoization

A stable Context dependency can reduce unnecessary dependency changes.

For example:

```tsx
const repository = useMemo(
    () => createRepository(),
    []
);
```

can preserve the repository reference for the provider's lifetime.

But memoization should follow ownership semantics.

If the dependency legitimately changes, preserving its reference merely to avoid updates would be incorrect.

Memoization is an optimization.

Dependency identity is an architectural property.

## Context and Callback Dependencies

A provider may expose functions as part of a dependency:

```tsx
type UserCommands = {
    save(user: User): Promise<void>;
};
```

If the provider creates the object during every render:

```tsx
const commands = {
    save,
};
```

the Context value changes by reference.

When identity stability matters, the provider can design the dependency accordingly.

The goal is not to make every Context value permanently stable. The goal is to ensure that identity changes correspond
to meaningful dependency changes.

## Context and Resource Caches

A resource cache can be scoped through Context:

```tsx
<ResourceCacheProvider cache={cache}>
    <Feature/>
</ResourceCacheProvider>
```

Descendants consume the appropriate cache:

```tsx
const cache = useResourceCache();
```

This can provide:

* isolated caches
* feature-specific caches
* route-specific caches
* test caches
* alternate cache implementations

The cache itself remains responsible for resource identity, reuse, freshness, invalidation, and eviction.

Context only determines which cache instance is available.

## Context and Server State

A server-state client can be supplied through Context:

```tsx
<ServerStateClientProvider client={client}>
    <App/>
</ServerStateClientProvider>
```

Consumers obtain the appropriate client from their environment.

This is dependency injection, while the server-state system remains responsible for remote-state lifecycle semantics.

Do not conflate Context-based client distribution with server-state management itself.

## Context and Cancellation

An injected service may support cancellation:

```ts
type SearchService = {
    search(
        query: string,
        signal?: AbortSignal
    ): Promise<Result[]>;
};
```

The Context provides the service:

```tsx
const searchService = useSearchService();
```

The consuming Effect or event handler remains responsible for the cancellation semantics of the operation it starts.

Dependency injection does not automatically provide cancellation.

## Context and Accessibility

Application services injected through Context may support accessibility-related behavior, but Context does not itself
provide accessibility semantics.

Headless UI abstractions may use Context to distribute:

* IDs
* focus managers
* keyboard handlers
* selection state
* ARIA state

Those concerns remain part of the component abstraction.

Do not treat Context usage itself as an accessibility feature.

## Context and Progressive Enhancement

Context-based dependencies are primarily a client/application architecture mechanism.

A feature that requires a client-only dependency should still have an intentional behavior when:

* JavaScript is unavailable
* hydration has not occurred
* the client dependency cannot initialize
* the network is unavailable

Context does not replace a progressive-enhancement strategy.

The dependency boundary must fit within the application's rendering and enhancement model.

## Dependency Context and Lazy Loading

A Context provider may live inside a lazily loaded feature:

```tsx
const BillingFeature = lazy(
    () => import("./BillingFeature")
);
```

The feature can establish its own dependency scope once loaded.

Alternatively, an existing provider can surround the lazy component when the dependency is shared:

```tsx
<PaymentGatewayProvider gateway={gateway}>
    <Suspense fallback={<Loading/>}>
        <BillingFeature/>
    </Suspense>
</PaymentGatewayProvider>
```

Provider placement should follow dependency scope rather than code-splitting mechanics.

## Context and Error Boundaries

A missing provider is usually a configuration error and should fail close to the consumer.

An Error Boundary can contain rendering failures caused by that configuration error, but it does not establish the
dependency itself.

Dependency availability and rendering failure containment remain separate responsibilities.

## Context and Suspense

A dependency consumed through Context can participate in asynchronous behavior that suspends rendering.

For example, a resource abstraction supplied through Context may expose a read operation that suspends.

The Context provides the resource capability.

Suspense controls the rendering fallback boundary.

These mechanisms should not be conflated.

## Provider Scope and Component Tree Structure

Because Context follows the React tree, changing tree structure can change dependency availability.

Moving a consumer outside its provider:

```tsx
<Provider>
    <Editor/>
</Provider>
```

to:

```tsx
<>
    <Provider/>
    <Editor/>
</>
```

removes the dependency environment.

Provider placement is therefore part of component architecture, not merely configuration syntax.

## Portals

Context follows the React ownership tree rather than ordinary DOM ancestry.

A component rendered through a portal can still consume Context from its logical React ancestors.

This allows scoped dependencies to remain available to overlay components without requiring the provider to match the
DOM hierarchy.

The distinction between React tree ancestry and DOM ancestry is important when designing dependency scopes for portals,
dialogs, menus, and overlays.

## Multiple Application Roots

Separate React roots do not automatically share Context.

If two roots require the same dependency, each root needs an appropriate composition mechanism.

```tsx
createRoot(rootA).render(
    <RepositoryProvider repository={repository}>
        <AppA/>
    </RepositoryProvider>
);

createRoot(rootB).render(
    <RepositoryProvider repository={repository}>
        <AppB/>
    </RepositoryProvider>
);
```

The same instance can be supplied to both roots when shared ownership is intentional.

Context itself does not create application-wide singleton behavior.

## Context and Module Imports

Context is not automatically superior to direct imports.

A dependency that is:

* immutable
* environment-independent
* globally fixed
* pure
* not subject to substitution
* not scope-sensitive

may not need Context at all.

For example, a pure formatting utility can usually be imported directly.

Use Context when dependency scope, substitution, lifecycle, or explicit environmental configuration provides an
architectural benefit.

## Context and Module Singletons

A module singleton:

```ts
export const repository =
    createRepository();
```

provides implicit process/module-level access.

Context:

```tsx
<RepositoryProvider repository={repository}>
    <App/>
</RepositoryProvider>
```

provides subtree-scoped access.

The same singleton can technically be placed into Context, but doing so does not change its underlying lifetime.

Context changes the access boundary.

It does not automatically change the ownership model of the supplied object.

## Context and Dependency Containers

An application-level dependency container may still be useful as a construction mechanism.

```ts
const container =
    createApplicationContainer();
```

The composition root can resolve concrete dependencies:

```tsx
<RepositoryProvider
    repository={container.repository}
/>
```

The consumer does not need access to the container.

This is preferable to exposing the container itself through Context.

The container remains a construction/composition concern.

Context becomes the scoped delivery mechanism.

## Avoiding Provider Monoliths

A common misuse is a single provider containing every application capability:

```tsx
<AppProvider
    value={{
        userRepository,
        paymentGateway,
        logger,
        analytics,
        storage,
        configuration,
        featureFlags,
        notifications,
        search,
        billing,
    }}
>
    <App/>
</AppProvider>
```

This creates several problems:

* unrelated dependencies share one boundary
* consumers become coupled to a large contract
* provider values may change for unrelated reasons
* testing becomes less focused
* dependency scope becomes difficult to reason about
* the provider becomes a service registry

Prefer cohesive providers and focused consumer APIs.

## Avoiding Context for Every Dependency

The opposite extreme is also problematic.

Creating a Context for every small value can produce:

* excessive provider nesting
* fragmented dependency architecture
* difficult component setup
* unnecessary indirection
* reduced local readability

For a dependency used by one component:

```tsx
<Editor repository={repository}/>
```

is often simpler than introducing:

```tsx
<RepositoryProvider repository={repository}>
    <Editor/>
</RepositoryProvider>
```

Context should solve a distribution or scoping problem.

## Context as an API Boundary

A well-designed dependency Context can hide infrastructure implementation details.

The consumer knows:

```tsx
const repository = useUserRepository();
```

but does not need to know:

* how it was constructed
* which transport it uses
* which cache it uses
* which credentials it requires
* which environment it targets
* whether it is a test or production implementation

The Context therefore becomes part of the dependency architecture.

The custom Hook becomes the consumer-facing contract.

## Context and Encapsulation

The Context object itself should generally not become a widely imported implementation detail.

Prefer:

```tsx
const repository = useUserRepository();
```

over:

```tsx
const repository =
    useContext(UserRepositoryContext);
```

throughout the application.

The custom Hook can preserve the ability to change:

* Context representation
* validation
* derived behavior
* provider implementation
* dependency normalization

without changing consumers.

## Context and Reusability

Context-dependent components are less self-contained than components whose dependencies are supplied entirely through
props.

A component that uses:

```tsx
const repository = useRepository();
```

requires an appropriate provider environment.

This is a deliberate trade-off.

For components intended to be reusable across arbitrary environments, explicit props may provide a more portable
contract.

For components belonging to a specific application or feature environment, Context can produce a cleaner API.

## Context and Component Libraries

Reusable component libraries should be cautious about requiring application-specific Context dependencies.

A library component that silently assumes application Context can be difficult to integrate.

When a component represents a generic capability, explicit props or a library-owned Context abstraction may be more
appropriate.

For compound or headless component systems, Context can be entirely appropriate when the Context belongs to that
component abstraction.

## Common Misuse

### Using Context as a Global Variable

Context is subtree-scoped, not inherently global.

### Passing a Service Container Through Context

This hides dependency lookup behind a React Context and recreates a service locator.

### Creating One Giant Application Context

Unrelated dependencies should not automatically share one Context.

### Using Context to Avoid One Prop

A Context provider can add more machinery than the prop it replaces.

### Supplying Unstable Dependency Objects

Creating a new service or dependency object on every provider render can produce unintended identity changes.

### Using Fake Defaults

A default dependency that hides a missing provider can make configuration errors difficult to diagnose.

### Ignoring Ownership

A consumer should not dispose a resource merely because it can access it through Context.

### Treating Context as State Management

Context distributes values. It does not by itself define state ownership, update semantics, persistence, caching, or
synchronization.

### Using Context to Hide Poor Component Boundaries

If every component can access every service, the architecture has lost meaningful dependency boundaries.

### Making Infrastructure Available Everywhere

A provider at the application root should not be the default location for every dependency.

### Ignoring Server/Client Boundaries

Server-only dependencies cannot simply be exposed to browser-executed components.

### Using Context to Force Remounts

Changing a dependency and changing component identity are separate operations.

## Advantages

Context-based dependency injection removes the need to thread a dependency through unrelated intermediate components.

It allows dependencies to be scoped to a React subtree.

It supports nested overrides and independent instances.

It provides straightforward dependency substitution in tests.

It can keep component APIs focused on domain inputs rather than infrastructure dependencies.

It can align dependency lifetime with feature, route, or component-tree scope.

It allows reusable consumer APIs through custom Hooks.

It works naturally with compound and headless component architectures.

## Disadvantages

Dependencies are less visible at component call sites.

A component can require an environmental provider that is not obvious from its props.

Context can become a service locator when poorly designed.

Large provider trees can become difficult to understand.

Unstable Context values can cause unnecessary consumer updates.

Provider placement can become a significant architectural concern.

Consumers become coupled to the Context environment.

The pattern does not automatically solve resource lifetime, cancellation, caching, state management, or server/client
execution boundaries.

## When to Use

Use dependency-through-context when:

* many descendants need the same dependency
* intermediate components should not have to transport the dependency
* the dependency has a natural subtree scope
* different subtrees may require different instances
* local overrides are useful
* testing benefits from replacing the dependency at a boundary
* the dependency represents a shared capability rather than ordinary component data
* the consumer API is clearer without infrastructure props
* the dependency belongs to a feature, route, compound component, or application environment

## When Not to Use

Prefer another mechanism when:

* only one component needs the dependency
* the dependency naturally belongs in explicit props
* passing one prop is simpler than establishing a provider
* the dependency is a pure utility that does not need substitution or scope
* Context would expose an excessively broad service container
* the dependency is actually rapidly changing application state with different state-management requirements
* the component should be portable without requiring a provider environment
* provider nesting would materially reduce architectural clarity

## Relationship to Other Patterns

### Dependency Through Props

Props provide explicit point-to-point dependency delivery.

Context provides implicit descendant-scoped dependency delivery.

The two mechanisms are alternatives for dependency distribution, not mutually exclusive architectural philosophies.

A component can receive some dependencies through props while obtaining others through Context.

### Provider Composition

Dependency-through-context defines how a dependency is delivered.

Provider composition defines how multiple providers are assembled into a coherent tree.

The latter should not be used to obscure the scope or ownership decisions of the former.

### Context Provider

A Context Provider establishes a value for descendants.

Dependency-through-context specifically treats that value as an injected capability or collaborator.

Not every Context value is a dependency-injection mechanism.

### Context Custom Hook

A custom Hook is commonly the consumer-facing API for a dependency Context.

It can enforce provider presence and hide Context implementation details.

### Context Partitioning

Context partitioning concerns separating independent Context values and update domains.

Dependency-through-context should use appropriately focused boundaries rather than a monolithic Context.

### Component Composition

Composition determines which components are assembled.

Context determines which scoped dependencies are available within that assembly.

### Feature-Sliced Components

Feature boundaries are natural places to establish feature-specific dependency scopes.

### Container-Presentational Components

Containers can consume infrastructure dependencies through Context and pass presentation-oriented data and commands to
presentational components.

### Headless Components

Headless and compound components commonly use Context for internal scoped capabilities among cooperating descendants.

### External Store

Context can inject an external store instance.

The external store remains responsible for state ownership and subscription semantics.

### Server State

Context can inject a server-state client or repository.

The injected abstraction remains responsible for remote-state lifecycle semantics.

### Memoization

Dependency identity can affect whether consumers observe changed values and whether memoized descendants receive stable
props.

### Referential Stability

Context values are references. Stable or changing identity should correspond to intentional dependency semantics.

### Component Identity

Replacing a Context dependency does not inherently replace the consumer's React instance.

### Server Components

Dependency Context must respect execution boundaries and must not expose server-only capabilities to browser-executed
code.

### Client Component Boundary

Client-executed dependencies must be established in a client-compatible environment.

## Design Rules

1. Use Context for scoped dependency distribution, not merely as a replacement for ordinary props.

2. Treat the provider boundary as a dependency-scope decision.

3. Keep dependency contracts narrow and cohesive.

4. Prefer custom Hooks as consumer-facing APIs.

5. Fail clearly when a required provider is missing.

6. Do not use Context to expose an application-wide service registry.

7. Do not confuse dependency injection with state management.

8. Do not make every dependency a Context dependency.

9. Use nested providers deliberately for local overrides or independent instances.

10. Place providers at the narrowest practical scope that satisfies the consumers.

11. Keep construction, ownership, and consumption conceptually separate.

12. Dispose injected resources only when the provider actually owns their lifecycle.

13. Design Context value identity deliberately.

14. Treat dependency replacement as a synchronization event, not automatically as a remount.

15. Keep infrastructure dependencies out of presentation components when they only require data and commands.

16. Use Context to reduce structural coupling, not to hide architectural coupling.

17. Keep server-only dependencies on the server.

18. Preserve narrow contracts even when Context removes prop drilling.

19. Separate stable dependencies from rapidly changing state when their update semantics differ.

20. Prefer explicit props when they communicate a simpler and more portable contract.

21. Align dependency scope with feature, route, component, or application ownership where appropriate.

22. Do not introduce a provider merely to avoid passing a single local dependency.

## Core Principle

**Use Context when a dependency belongs to a React subtree and descendants need access to it without making unrelated
intermediate components transport it explicitly.**

The provider establishes the dependency environment:

```tsx
<RepositoryProvider repository={repository}>
    <UserPage/>
</RepositoryProvider>
```

The consumer resolves the capability from that environment:

```tsx
function UserPage() {
    const repository = useRepository();

    // ...
}
```

The intermediate hierarchy remains unaware of the dependency.

That is the essential value of dependency-through-context: **scoped capability distribution without prop threading**.

The trade-off is equally important. Because the dependency is no longer visible in the component's props, the consumer
becomes dependent on an environmental Context boundary. Context should therefore be introduced when that trade-off is
justified by scope, topology, reuse, substitution, or dependency ownership—not simply because passing a prop is
inconvenient.
