# Dependency Through Props

Passing dependencies through props is a dependency-injection technique in which a component receives the services,
functions, configuration, or other collaborators it needs from its parent rather than importing or constructing those
dependencies itself.

The defining property is **explicit dependency flow**. The component declares its collaborators as part of its input
contract, and the parent supplies the concrete implementation.

```tsx
type UserRepository = {
    getUser(id: string): Promise<User>;
};

type UserProfileProps = {
    userId: string;
    userRepository: UserRepository;
};

function UserProfile({userId, userRepository}: UserProfileProps) {
    // The component depends on the abstraction supplied through props.
}
```

The component does not need to know where `userRepository` came from, how it was constructed, or which concrete
implementation is being used. Its dependency is visible in its API.

## Intent

Use props to make component dependencies explicit, locally scoped, replaceable, and testable.

```tsx
function CheckoutForm({
                          paymentGateway,
                          analytics,
                      }: {
    paymentGateway: PaymentGateway;
    analytics: Analytics;
}) {
    // ...
}
```

The parent controls the concrete collaborators:

```tsx
function CheckoutPage() {
    return (
        <CheckoutForm
            paymentGateway={paymentGateway}
            analytics={analytics}
        />
    );
}
```

This creates a direct dependency relationship:

```text
CheckoutPage supplies dependencies
CheckoutForm declares dependencies
```

The important property is not merely that values are passed as props. The pattern is useful when those values represent
**capabilities or collaborators** that the component requires to perform its responsibility.

## Explicit Dependency Flow

A component that receives a dependency through props has an explicit contract.

```tsx
type SearchProps = {
    searchService: SearchService;
};

function Search({searchService}: SearchProps) {
    // ...
}
```

The dependency is visible at the component boundary:

```tsx
<Search searchService={searchService}/>
```

This makes several architectural properties immediately observable:

* which dependencies the component requires
* which component supplies them
* where the concrete implementation enters the tree
* which dependencies are scoped to a particular subtree
* which dependencies can be replaced for testing
* which dependencies are optional
* whether a component has accumulated too many collaborators

There is no hidden lookup operation inside the component.

## Dependencies Versus Data

Not every prop is a dependency-injection concern.

Ordinary component data:

```tsx
<UserCard
    name="Alice"
    avatarUrl="/alice.png"
/>
```

Dependency:

```tsx
<UserCard
    userRepository={userRepository}
/>
```

The distinction is conceptual rather than syntactic.

A prop is typically a dependency when it represents something the component **uses to perform work**, rather than
information the component merely renders.

Common injected dependencies include:

* service objects
* repositories
* API clients
* storage adapters
* logging interfaces
* analytics interfaces
* formatters
* validators
* feature-policy objects
* environment abstractions
* command functions
* navigation abstractions
* clock abstractions
* configuration objects
* factories
* render strategies

A function can therefore be a dependency just as an object can.

```tsx
type UserEditorProps = {
    saveUser: (user: User) => Promise<void>;
};
```

The component depends on the capability represented by `saveUser`, rather than on a particular implementation.

## Dependency Contracts

The component should depend on the smallest interface required for its responsibility.

Prefer:

```tsx
type UserLoader = {
    load(id: string): Promise<User>;
};

type UserProfileProps = {
    userLoader: UserLoader;
};
```

over exposing an entire application service:

```tsx
type UserProfileProps = {
    applicationServices: ApplicationServices;
};
```

Narrow contracts reduce coupling.

A component that only needs `load()` should not depend on an object containing unrelated operations such as:

```ts
type UserService = {
    load(id: string): Promise<User>;
    create(user: User): Promise<void>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    exportUsers(): Promise<Blob>;
    synchronize(): Promise<void>;
};
```

The dependency contract should describe the capability actually required by the component.

## Dependency Construction

Dependency injection through props does not require the receiving component to construct its dependency.

Avoid:

```tsx
function UserProfile({userId}: { userId: string }) {
    const repository = new UserRepository();
}
```

Prefer:

```tsx
function UserProfile({
                         userId,
                         userRepository,
                     }: {
    userId: string;
    userRepository: UserRepository;
}) {
    // ...
}
```

Construction can happen at a higher architectural boundary:

```tsx
function UserPage() {
    const userRepository = createUserRepository();

    return (
        <UserProfile
            userId="42"
            userRepository={userRepository}
        />
    );
}
```

The component therefore consumes a dependency instead of owning its construction policy.

## Composition as the Injection Point

The parent that supplies a dependency acts as a composition boundary.

```tsx
function UserPage() {
    const repository = createUserRepository();

    return (
        <UserProfile
            userRepository={repository}
            userId="42"
        />
    );
}
```

The parent decides:

* which implementation to use
* which instance to provide
* how long the instance should live
* which configuration it receives
* whether multiple components share the same instance
* whether a test or development implementation should be substituted

This keeps construction and consumption separate.

The component tree itself can therefore act as a dependency graph.

## Passing the Same Dependency Downward

A dependency can be passed through several component layers when the intermediate components legitimately participate in
the contract.

```tsx
function Page() {
    return (
        <EditorShell
            documentRepository={documentRepository}
        />
    );
}

function EditorShell({
                         documentRepository,
                     }: {
    documentRepository: DocumentRepository;
}) {
    return (
        <Editor
            documentRepository={documentRepository}
        />
    );
}
```

This is explicit but can become cumbersome when an intermediate component does not actually use the dependency.

That problem is commonly called **prop drilling**.

Prop drilling is not automatically an architectural failure. It becomes problematic when dependency propagation creates
coupling between components that are otherwise unrelated to the dependency.

## Prop Drilling

Consider:

```tsx
function App() {
    return (
        <Layout
            userRepository={userRepository}
        />
    );
}

function Layout({
                    userRepository,
                }: {
    userRepository: UserRepository;
}) {
    return (
        <Page
            userRepository={userRepository}
        />
    );
}

function Page({
                  userRepository,
              }: {
    userRepository: UserRepository;
}) {
    return (
        <UserProfile
            userRepository={userRepository}
        />
    );
}
```

`Layout` and `Page` may not use `userRepository` themselves. They merely transport it.

This creates an important trade-off.

Props provide excellent visibility of dependency flow, but visibility comes at the cost of explicitly threading
dependencies through every relevant component boundary.

The correct response is not automatically to replace props with Context. First determine whether the dependency
genuinely belongs at the receiving component boundary and whether the intermediate structure is architecturally
meaningful.

## Explicitness Versus Prop Drilling

There are two different concerns:

**Explicit dependency flow** means the receiving component clearly declares what it needs.

**Prop drilling** means an intermediate hierarchy is required to transport that dependency to a descendant that actually
consumes it.

The first is generally desirable.

The second may or may not be desirable depending on the tree structure.

A short chain:

```tsx
<Page repository={repository}>
    <Editor repository={repository}/>
</Page>
```

may be clearer than introducing another dependency-distribution mechanism.

A deeply nested tree with many unrelated intermediate components may justify another mechanism.

## Dependency Identity

Injected dependencies are values, so their identity can affect React behavior.

Consider:

```tsx
function Page() {
    const service = {
        load: loadUsers,
    };

    return <UserList service={service}/>;
}
```

A new object is created on every render.

If `UserList` is memoized:

```tsx
const UserList = memo(function UserList({
                                            service,
                                        }: {
    service: UserService;
}) {
    // ...
});
```

the changing `service` reference can invalidate the memoization.

A stable dependency can instead be created outside the component:

```tsx
const userService = createUserService();

function Page() {
    return <UserList service={userService}/>;
}
```

or according to an appropriate lifecycle:

```tsx
function Page() {
    const userService = useMemo(
        () => createUserService(),
        []
    );

    return <UserList service={userService}/>;
}
```

The correct lifetime depends on what the dependency represents. Memoization should not be added merely to conceal an
unclear ownership model.

## Dependency Lifetime

The component supplying a dependency should have an appropriate ownership relationship with that dependency.

A dependency may be:

* application-wide
* feature-scoped
* route-scoped
* page-scoped
* component-instance-scoped
* request-scoped in server environments
* test-scoped

For example:

```tsx
function Feature() {
    const repository = createFeatureRepository();

    return (
        <FeatureEditor repository={repository}/>
    );
}
```

The repository is associated with that feature instance.

By contrast:

```tsx
const repository = createFeatureRepository();
```

creates a module-level dependency whose lifetime is tied to the module rather than to a particular React subtree.

Dependency-through-props does not determine lifetime by itself. It merely makes ownership and delivery explicit.

## Shared Versus Independent Instances

The parent can intentionally provide the same instance to multiple components:

```tsx
function Dashboard() {
    const repository = getRepository();

    return (
        <>
            <UserList repository={repository}/>
            <UserSummary repository={repository}/>
        </>
    );
}
```

Both components receive the same collaborator.

The parent can also provide different instances:

```tsx
function Dashboard() {
    return (
        <>
            <UserList repository={createRepository()}/>
            <UserSummary repository={createRepository()}/>
        </>
    );
}
```

Whether that is correct depends on the dependency's semantics.

This makes dependency scope an explicit composition decision rather than an accidental consequence of a hidden global.

## Function Dependencies

Functions are often the simplest form of dependency injection through props.

```tsx
type SearchBoxProps = {
    search: (query: string) => Promise<Result[]>;
};

function SearchBox({search}: SearchBoxProps) {
    // ...
}
```

The component does not need to know whether `search` is implemented using:

* an HTTP request
* a local database
* an in-memory collection
* a cache
* a mock
* a server action
* another abstraction

The function defines the capability boundary.

This is particularly useful when the component needs one operation rather than an entire service abstraction.

## Command Dependencies

Callback props can represent commands:

```tsx
type DeleteButtonProps = {
    deleteUser: () => Promise<void>;
};
```

The component invokes the supplied capability:

```tsx
function DeleteButton({deleteUser}: DeleteButtonProps) {
    return (
        <button onClick={() => void deleteUser()}>
            Delete
        </button>
    );
}
```

The button does not need to know:

* which API endpoint is called
* how authentication is performed
* whether optimistic state is updated
* whether analytics are recorded
* whether the operation is retried
* where the resulting state is stored

Those concerns remain outside the component.

## Configuration Versus Dependencies

Configuration and dependencies are related but should not automatically be treated as the same concept.

Configuration:

```tsx
<DateFormatter
    locale="en-US"
    timeZone="UTC"
/>
```

Dependency:

```tsx
<DateFormatter
    formatter={dateFormatter}
/>
```

A configuration value describes how a component should behave.

A dependency supplies an external capability used by the component.

Sometimes configuration is used to construct a dependency:

```tsx
function Feature({
                     apiBaseUrl,
                 }: {
    apiBaseUrl: string;
}) {
    const api = createApiClient(apiBaseUrl);

    return <Editor api={api}/>;
}
```

This keeps construction at the composition boundary rather than inside `Editor`.

## Testing

Explicit props make dependency substitution straightforward.

Production:

```tsx
<UserProfile
    userRepository={productionRepository}
/>
```

Test:

```tsx
const repository = {
    getUser: async () => ({
        id: "1",
        name: "Test User",
    }),
};

render(
    <UserProfile
        userId="1"
        userRepository={repository}
    />
);
```

No global replacement is required.

No module mocking is required merely to replace the collaborator.

The test can provide exactly the behavior required by the scenario.

This also allows tests to verify the component against a narrow contract rather than a production implementation.

## Dependency Substitution

Dependency-through-props is particularly useful when multiple implementations are legitimate.

```ts
interface Storage {
    get(key: string): Promise<string | null>;

    set(key: string, value: string): Promise<void>;
}
```

The component can consume the abstraction:

```tsx
function Preferences({
                         storage,
                     }: {
    storage: Storage;
}) {
    // ...
}
```

Different composition roots can provide:

```tsx
<Preferences storage={localStorageAdapter}/>
```

or:

```tsx
<Preferences storage={remoteStorageAdapter}/>
```

or:

```tsx
<Preferences storage={memoryStorage}/>
```

The component remains independent of those concrete implementations.

## Dependency Direction

Dependency injection is useful because dependency direction becomes explicit.

A component should generally depend on an abstraction or capability rather than on the construction mechanism of that
capability.

Prefer:

```tsx
function Report({
                    reportLoader,
                }: {
    reportLoader: ReportLoader;
}) {
    // ...
}
```

over:

```tsx
function Report() {
    const loader = new HttpReportLoader();
}
```

The first arrangement separates:

* composition
* dependency construction
* component behavior

The second combines them.

## Avoiding Application-Service Props

Passing an entire application service object can technically implement dependency injection while still producing poor
architecture.

Avoid:

```tsx
<App
    services={services}
/>
```

when the descendants then receive the same object:

```tsx
<Component services={services}/>
```

This recreates a service locator in prop form.

A component should normally receive the narrow capability it requires:

```tsx
<Component
    userLoader={services.userLoader}
/>
```

rather than:

```tsx
<Component
    services={services}
/>
```

The former exposes the dependency contract.

The latter exposes an unrelated collection of potential dependencies.

## Dependency Objects and Interfaces

A dependency object can group operations that form a coherent abstraction.

```ts
type PaymentGateway = {
    authorize(input: PaymentInput): Promise<Authorization>;
    capture(id: string): Promise<void>;
};
```

A component can depend on that contract:

```tsx
function PaymentForm({
                         paymentGateway,
                     }: {
    paymentGateway: PaymentGateway;
}) {
    // ...
}
```

The abstraction should remain cohesive.

If unrelated capabilities accumulate:

```ts
type Services = {
    payments: PaymentGateway;
    analytics: Analytics;
    users: UserRepository;
    logging: Logger;
    configuration: Configuration;
};
```

then the object has become a dependency container rather than a focused dependency.

Passing the container through props should generally be avoided.

## Dependency Props and Component Composition

Dependency-through-props works naturally with component composition.

A parent can supply a dependency to one child while another child receives a different capability:

```tsx
function Feature() {
    return (
        <Editor
            documentRepository={documentRepository}
        />
    );
}
```

The dependency boundary therefore follows the component's actual responsibility.

This is often preferable to making every descendant capable of accessing every application dependency.

## Dependency Props and Custom Hooks

A custom Hook can itself accept an injected dependency.

```tsx
function useUser({
                     userId,
                     userRepository,
                 }: {
    userId: string;
    userRepository: UserRepository;
}) {
    // ...
}
```

The component remains responsible for supplying the dependency:

```tsx
function UserProfile({
                         userId,
                         userRepository,
                     }: Props) {
    const user = useUser({
        userId,
        userRepository,
    });

    // ...
}
```

This keeps the reusable behavior independent of a particular global implementation.

The Hook is therefore reusable across different composition environments.

## Dependency Props and Effects

An injected dependency can be used inside an Effect.

```tsx
function UserProfile({
                         userId,
                         userRepository,
                     }: Props) {
    useEffect(() => {
        let cancelled = false;

        userRepository.getUser(userId).then(user => {
            if (!cancelled) {
                // ...
            }
        });

        return () => {
            cancelled = true;
        };
    }, [userId, userRepository]);

    // ...
}
```

The dependency belongs in the reactive dependency model when the Effect uses it.

This has an important architectural consequence: changing the injected dependency can cause the Effect to synchronize
against a different external system.

The dependency should therefore not be excluded from the dependency list merely because its presence makes the Effect
rerun.

## Dependency Props and Event Handlers

Injected functions can be invoked from event handlers.

```tsx
function SaveButton({
                        save,
                    }: {
    save: () => Promise<void>;
}) {
    return (
        <button onClick={() => void save()}>
            Save
        </button>
    );
}
```

The button owns the interaction behavior but does not own the persistence mechanism.

This creates a clean separation between:

* UI interaction
* application operation
* infrastructure implementation

The callback itself may be produced by a parent, a custom Hook, a service adapter, or another abstraction.

## Dependency Props and Context

Props and Context solve related but different dependency-distribution problems.

Props provide **explicit point-to-point dependency delivery**:

```tsx
<Editor repository={repository}/>
```

Context provides **implicit descendant-scoped dependency delivery**:

```tsx
<RepositoryProvider repository={repository}>
    <Editor/>
</RepositoryProvider>
```

With props, the dependency appears in the receiving component's public API.

With Context, the dependency is obtained from the surrounding React tree.

Use props when explicit dependency flow is valuable and the number of affected boundaries is manageable.

Use Context when a dependency needs to be consumed by many descendants and threading it through intermediate components
would create unnecessary coupling.

Context does not make dependency injection inherently better. It changes the dependency-distribution mechanism and hides
the delivery path from the consumer's props.

## Dependency Props and Dependency Injection Through Context

These patterns should remain conceptually separate.

Dependency through props:

```tsx
function Editor({
                    repository,
                }: {
    repository: DocumentRepository;
}) {
    // ...
}
```

Dependency through Context:

```tsx
function Editor() {
    const repository = useDocumentRepository();
    // ...
}
```

The first makes the dependency part of the component's explicit input contract.

The second makes the dependency part of the component's environmental context.

The choice should be based on scope, topology, and API clarity rather than a blanket preference for one mechanism.

## Dependency Props and External Stores

A component may receive an external store through props:

```tsx
function UserList({
                      store,
                  }: {
    store: UserStore;
}) {
    const users = useSyncExternalStore(
        store.subscribe,
        store.getSnapshot
    );

    // ...
}
```

The component does not construct or globally locate the store.

This can be useful when different subtrees need different store instances or when tests require isolated stores.

The store's subscription semantics remain the responsibility of the external-store abstraction.

## Dependency Props and Resource Caches

A resource cache can also be injected:

```tsx
function UserProfile({
                         cache,
                         userId,
                     }: {
    cache: UserCache;
    userId: string;
}) {
    // ...
}
```

This makes cache ownership and scope explicit.

For example, separate feature instances can receive separate caches, while a higher-level composition boundary can
intentionally share one.

Dependency injection does not itself define cache semantics such as freshness, invalidation, deduplication, or eviction.
Those belong to the cache abstraction.

## Dependency Props and Server State

Server-state infrastructure can be supplied as a dependency when a component needs a specific client or adapter.

```tsx
function Orders({
                    orderClient,
                }: {
    orderClient: OrderClient;
}) {
    // ...
}
```

The component remains independent of how the client was configured.

The distinction remains important: dependency-through-props concerns **how the component obtains a capability**.
Server-state architecture concerns **how remote authoritative state is acquired, cached, synchronized, invalidated, and
represented**.

## Dependency Props and Feature Boundaries

Feature-oriented architecture can use dependency-through-props to define explicit boundaries.

```tsx
function BillingFeature({
                            paymentGateway,
                        }: {
    paymentGateway: PaymentGateway;
}) {
    return (
        <PaymentForm
            paymentGateway={paymentGateway}
        />
    );
}
```

The feature receives the capability it requires without importing infrastructure directly.

This can prevent feature code from becoming coupled to application-wide service construction.

The feature's public API can therefore expose the capabilities required by the feature while keeping implementation
details internal.

## Dependency Props and Headless Components

Headless components commonly receive behavior-related dependencies or callbacks through props.

```tsx
<Listbox
    options={options}
    onChange={onChange}
/>
```

However, not every callback or prop is automatically dependency injection.

The architectural distinction is whether the prop represents an external capability required to perform the component's
responsibility or simply forms part of the component's normal UI contract.

Headless components may use dependency-through-props as one mechanism among several, including Context, custom Hooks,
render props, and composition.

## Dependency Props and Container-Presentational Design

Dependency-through-props can reinforce a container-presentational boundary.

A container can acquire or receive infrastructure dependencies:

```tsx
function UserContainer({
                           userRepository,
                       }: {
    userRepository: UserRepository;
}) {
    // orchestration
}
```

and pass only presentation data and interaction callbacks to the presentational component:

```tsx
<UserView
    user={user}
    onSave={handleSave}
/>
```

The presentation component does not necessarily need the repository itself.

This prevents infrastructure dependencies from leaking into components whose responsibility is only rendering.

Dependency-through-props is therefore compatible with, but not equivalent to, the container-presentational pattern.

## Dependency Props and Feature Composition

A composition root can assemble the concrete implementations required by a feature.

```tsx
function Application() {
    const dependencies = createApplicationDependencies();

    return (
        <BillingFeature
            paymentGateway={dependencies.paymentGateway}
            analytics={dependencies.analytics}
        />
    );
}
```

The feature receives only the dependencies it actually requires.

This is generally preferable to passing the entire dependency registry:

```tsx
<BillingFeature dependencies={dependencies}/>
```

because the feature's contract remains explicit and narrow.

## Optional Dependencies

A dependency can be optional when the component has a meaningful default behavior.

```tsx
type LoggerProps = {
    logger?: Logger;
};
```

However, optional dependencies should not become a mechanism for hiding architectural requirements.

If the component fundamentally requires a logger, making the prop optional merely to avoid updating callers weakens the
contract.

Prefer a required dependency when the dependency is part of the component's essential responsibility.

## Default Implementations

A default implementation can be supplied by the composition boundary:

```tsx
function Application() {
    return (
        <Feature
            logger={productionLogger}
        />
    );
}
```

This keeps the component contract explicit.

Alternatively, a component may provide a default:

```tsx
function Feature({
                     logger = noopLogger,
                 }: {
    logger?: Logger;
}) {
    // ...
}
```

This can be appropriate for genuinely optional capabilities, but defaults should not obscure meaningful dependency
differences.

## Dependency Ownership

The receiving component should not silently assume ownership of an injected dependency.

If a parent supplies:

```tsx
<Editor repository={repository}/>
```

the editor should generally not:

* replace the repository
* mutate its configuration unexpectedly
* dispose it without an ownership contract
* create a second hidden instance
* store it globally

Ownership must be explicit.

If the component is responsible for creating and disposing a resource, it may be better modeled as the owner rather than
merely a consumer of an injected dependency.

## Cleanup and Injected Resources

Injected dependencies can have lifecycles that require cleanup.

For example:

```tsx
function ConnectionView({
                            connection,
                        }: {
    connection: Connection;
}) {
    useEffect(() => {
        connection.connect();

        return () => {
            connection.disconnect();
        };
    }, [connection]);

    // ...
}
```

Whether this is correct depends on ownership.

If the parent owns the connection and the child merely uses it, the child should generally not dispose it.

Instead:

```tsx
function ConnectionView({
                            connection,
                        }: {
    connection: Connection;
}) {
    useEffect(() => {
        connection.subscribe();
        return () => connection.unsubscribe();
    }, [connection]);

    // ...
}
```

The child cleans up the relationship it established rather than destroying a resource owned elsewhere.

## Dependency Replacement and React Identity

Changing a dependency object can affect component behavior without necessarily changing the component's React identity.

```tsx
<Editor
    key="editor"
    repository={repositoryA}
/>
```

followed by:

```tsx
<Editor
    key="editor"
    repository={repositoryB}
/>
```

preserves the component identity while changing one of its inputs.

The component must therefore correctly handle dependency replacement.

Effects, subscriptions, caches, and other external relationships may need to synchronize with the new dependency.

Changing the dependency is not equivalent to remounting the component.

## Dependency Props and Keys

A dependency should not be forced into a React `key` merely to trigger replacement.

Avoid:

```tsx
<Editor
    key={repository.id}
    repository={repository}
/>
```

unless replacing the component instance is actually part of the intended semantics.

If the requirement is to synchronize the component with a changed dependency, model that synchronization directly.

Use a key when component identity should change, not as a generic dependency-update mechanism.

## Dependency Props and Memoization

Injected dependencies interact with memoization through reference identity.

```tsx
const Editor = memo(function Editor({
                                        repository,
                                    }: {
    repository: Repository;
}) {
    // ...
});
```

If the repository reference remains stable, `memo` can treat that prop as unchanged.

If the parent creates a new dependency object on every render:

```tsx
<Editor repository={createRepository()}/>
```

the reference changes every time.

Memoization cannot treat the dependency as stable merely because its contents are equivalent.

Dependency identity should therefore be designed deliberately when identity-sensitive consumers exist.

## Dependency Props and `useCallback`

Function dependencies have the same identity considerations.

```tsx
function Page() {
    const save = useCallback(
        (user: User) => saveUser(user),
        []
    );

    return <Editor save={save}/>;
}
```

The callback may remain stable across renders.

However, `useCallback` should not be added merely because a function is passed as a dependency. It is useful when a
consumer has a concrete reason to depend on stable function identity.

The function's dependency list must remain correct.

## Dependency Props and Server Components

In architectures that distinguish Server Components from Client Components, dependency-through-props must respect the
boundary between execution environments.

A server-only object such as a database connection cannot generally be passed as an ordinary client-facing prop.

For example, a server-side dependency:

```ts
const database = createDatabaseConnection();
```

should remain on the server.

A Client Component should instead receive client-safe data or an appropriate client-side capability through the
framework's supported boundary.

Dependency injection through props does not bypass server/client execution constraints.

The dependency must be valid in the environment in which the receiving component executes.

## Dependency Props and Client Component Boundaries

A dependency supplied to a Client Component must be compatible with what the framework allows across the server/client
boundary.

Infrastructure objects containing:

* functions
* sockets
* database handles
* class instances
* credentials
* server-only state

are not automatically suitable as cross-boundary props.

The architecture should instead place dependency construction on the appropriate side of the boundary and expose a
client-safe contract.

This is a deployment and execution-boundary concern rather than a limitation of dependency injection itself.

## Dependency Props and Hydration

Dependencies that affect rendered output can influence hydration correctness.

A server-rendered component and its client counterpart must produce compatible output for the same initial inputs.

Avoid injecting environment-dependent values into rendering without controlling their determinism.

For example, a dependency that directly reads browser-only state may produce different output between server and client.

The dependency boundary should therefore respect the rendering environment and hydration model.

## Dependency Props and Progressive Enhancement

A dependency supplied through props can represent an enhanced capability while the underlying feature remains available
through a more fundamental mechanism.

For example, a component may receive a client-side enhancement function:

```tsx
<ShareButton
    share={clientShare}
/>
```

while the application's primary operation remains available through a native navigation or form submission path.

Dependency injection can therefore support progressive enhancement, but it does not itself establish
progressive-enhancement behavior.

## Dependency Props and Testing Boundaries

The strongest testing benefit comes from replacing the dependency at the component boundary.

```tsx
render(
    <CheckoutForm
        paymentGateway={fakeGateway}
    />
);
```

This allows tests to control:

* successful operations
* failures
* delays
* retries
* returned values
* side effects
* exceptional conditions

The test does not need to reproduce the entire application's dependency graph.

This is particularly useful for components that otherwise would directly depend on infrastructure.

## Dependency Props and Storybook-Like Environments

Component isolation environments can supply deterministic dependencies through props.

```tsx
<UserProfile
    userId="1"
    userRepository={storybookRepository}
/>
```

This allows the component to run without the production application environment.

The same technique can support:

* visual testing
* interaction testing
* accessibility testing
* failure scenarios
* loading scenarios
* deterministic fixtures

The component's dependency contract becomes part of its isolation boundary.

## Dependency Props and Module Imports

Importing a dependency directly is not inherently wrong.

```tsx
import {userRepository} from "./repositories";

function UserProfile() {
    // ...
}
```

This can be appropriate when the dependency is genuinely fixed and does not need substitution or scope variation.

Dependency-through-props becomes more valuable when:

* implementations vary
* tests need substitution
* multiple instances are required
* ownership should be explicit
* features need isolation
* application composition should control infrastructure
* the component is intended for reuse

Dependency injection should therefore solve an actual coupling problem rather than become a rule that every imported
value must be converted into a prop.

## Dependency Props and Module-Level Singletons

A module singleton:

```ts
export const repository = createRepository();
```

provides implicit global access.

A prop:

```tsx
<Editor repository={repository}/>
```

provides explicit local access.

The same concrete object can therefore be used with either architecture.

The difference is dependency visibility and scope.

Passing a singleton through props does not magically make the underlying singleton scoped or independently instantiated.
The lifetime and ownership remain those of the singleton.

## Avoiding the Service Locator Pattern

A service locator hides dependency lookup:

```tsx
function Editor() {
    const repository = services.get("repository");
}
```

Passing a service registry is only superficially better:

```tsx
function Editor({
                    services,
                }: {
    services: ServiceRegistry;
}) {
    const repository = services.get("repository");
}
```

The component still performs dependency lookup.

Prefer:

```tsx
function Editor({
                    repository,
                }: {
    repository: DocumentRepository;
}) {
    // ...
}
```

The dependency is now explicit and statically visible in the component contract.

## Too Many Dependency Props

A component receiving many dependencies can indicate that its responsibility is too broad.

```tsx
function ApplicationFeature({
                                userRepository,
                                paymentGateway,
                                analytics,
                                logger,
                                storage,
                                notificationService,
                                featureFlags,
                                configuration,
                            }: Props) {
    // ...
}
```

The problem is not the number alone. The important question is whether the component genuinely owns a responsibility
requiring all of them.

A large dependency surface can indicate:

* excessive orchestration
* insufficient decomposition
* a feature boundary that is too broad
* a missing abstraction
* infrastructure leaking into presentation
* an inappropriate container boundary

Do not solve excessive dependency count by automatically hiding everything behind Context.

First reconsider component responsibilities and dependency ownership.

## Dependency Props and Component API Size

Dependencies are part of the component's API.

This can be beneficial for reusable components because the API communicates what the component needs.

However, exposing infrastructure dependencies on a widely reused presentational component can make that component
unnecessarily coupled to application architecture.

Prefer to keep infrastructure dependencies at orchestration boundaries when the presentation component only needs the
resulting data and commands.

For example:

```tsx
<UserEditor
    user={user}
    onSave={saveUser}
/>
```

may be preferable to:

```tsx
<UserEditor
    userRepository={userRepository}
/>
```

when the editor is fundamentally a presentation component.

## Dependency Props and Reusability

Explicit dependencies can increase reuse because the component does not assume a particular implementation.

```tsx
function FilePreview({
                         loader,
                     }: {
    loader: FileLoader;
}) {
    // ...
}
```

The same component can operate with:

* a local loader
* a remote loader
* a cached loader
* a test loader
* a worker-backed loader

The component's portability comes from depending on a contract rather than a concrete infrastructure source.

## Dependency Props and Encapsulation

Explicit dependency injection does not mean exposing internal implementation details.

The public contract should expose the smallest stable abstraction:

```ts
type UserLoader = {
    load(id: string): Promise<User>;
};
```

rather than:

```ts
type InternalUserInfrastructure = {
    httpClient: HttpClient;
    cache: Cache;
    retryPolicy: RetryPolicy;
    metrics: Metrics;
    logger: Logger;
    load(id: string): Promise<User>;
};
```

The component should know only what it needs to know.

Dependency injection and encapsulation therefore reinforce one another when the injected contract is intentionally
narrow.

## Common Misuse

### Passing a Dependency Registry

```tsx
<Component services={services}/>
```

This hides the actual dependency and recreates service-location behavior.

### Injecting Every Imported Function

Turning every utility function into a prop produces unnecessary API surface and indirection.

Stable pure utilities often do not require injection.

### Using Context Only to Avoid One Prop

Introducing a provider and custom Hook for a dependency used by one nearby component can be more complex than passing
the dependency directly.

### Creating Dependencies During Every Render

```tsx
<Component
    service={createService()}
/>
```

can unintentionally create a new instance on every render.

### Injecting Infrastructure Into Pure Presentation

A presentational component that only needs `onSave` should not necessarily receive an entire repository.

### Treating Prop Drilling as Always Bad

Explicit propagation is sometimes the simplest and clearest solution.

### Passing the Entire Application Container

```tsx
<Component container={applicationContainer}/>
```

exposes excessive coupling and weakens the dependency contract.

### Using Dependency Changes to Force Remounts

A changed dependency should not automatically imply a changed React identity.

### Ignoring Dependency Identity

Objects and functions passed as dependencies have reference identity, which can affect Effects, memoization,
subscriptions, and child rendering.

### Hiding Required Dependencies Behind Optional Props

Making an essential dependency optional merely to preserve an old call site weakens the architectural contract.

## Advantages

Dependency-through-props provides explicit dependency contracts.

It makes dependency flow visible in component APIs and component composition.

It supports straightforward substitution in tests.

It allows different implementations or instances to be supplied to different subtrees.

It keeps dependency construction outside components that merely consume the dependency.

It reduces direct coupling to global service registries and module-level lookup mechanisms.

It works naturally with component composition and feature boundaries.

It makes component behavior easier to reason about because required capabilities are visible at the call site.

## Disadvantages

Explicit dependencies increase prop surface area.

Dependencies may need to be threaded through intermediate components.

Deep trees can develop significant prop drilling.

Changing a dependency contract can require updates to many call sites.

Passing many infrastructure dependencies can make a component API overly coupled to application architecture.

Dependency identity can interact with Effects and memoization.

The pattern does not automatically solve dependency lifetime, resource ownership, caching, cancellation, or
server/client execution boundaries.

## When to Use

Use dependency-through-props when:

* the dependency is local to a component or feature
* explicit dependency flow is valuable
* only a small number of components consume the dependency
* different implementations need to be supplied
* tests need simple dependency substitution
* dependency ownership should remain visible
* the component is intended to be reusable
* the dependency is naturally part of the component's contract
* passing the dependency does not create excessive prop drilling

It is particularly effective at composition boundaries where a parent already coordinates the required collaborators.

## When Not to Use

Avoid dependency-through-props when:

* a dependency is consumed deeply by many unrelated descendants
* threading the dependency through numerous intermediate components creates substantial coupling
* the dependency is inherently environmental and naturally scoped through Context
* the dependency is not actually a component responsibility
* the component would become coupled to infrastructure merely by exposing the dependency
* the dependency is globally fixed and explicit injection provides no meaningful architectural benefit
* a large service container would need to be passed instead of a focused capability

These cases may justify Context, a different composition boundary, or a different architectural abstraction.

## Relationship to Other Patterns

### Dependency Injection Through Context

Props provide explicit point-to-point injection.

Context provides descendant-scoped environmental injection.

The two patterns can coexist. A feature may receive a dependency through props and establish a Context boundary for
descendants that need the same dependency.

### Provider Composition

Provider composition concerns assembling multiple Context providers into a coherent tree.

Dependency-through-props does not require providers at all.

### Component Composition

Composition determines which components are assembled together.

Dependency-through-props determines how external capabilities are supplied to those components.

### Container-Presentational Components

A container may receive infrastructure dependencies and translate them into data and commands for a presentational
component.

Dependency-through-props is therefore a mechanism that can support the boundary, not the boundary itself.

### Feature-Sliced Components

Feature boundaries can expose dependencies explicitly through their public component APIs.

This can prevent features from importing application infrastructure directly.

### Custom Hooks

Custom Hooks can consume injected dependencies passed as arguments, allowing reusable behavior to remain independent of
a concrete implementation.

### External Store

An external store can be supplied through props when its ownership and scope should be controlled by the composition
boundary.

### Server State

Server-state abstractions can be injected as clients or repositories, but dependency injection does not itself define
server-state lifecycle semantics.

### Memoized Components

Stable dependency identity can affect whether memoized components receive equivalent props.

### Memoized Callbacks

Function dependencies may require stable references when consumers explicitly depend on callback identity.

### Referential Stability

Injected objects and functions are references. Their stability can therefore affect React's rendering and
synchronization behavior.

### Component Identity

Changing an injected dependency does not by itself change component identity. Identity changes only when React's
identity rules determine that the component instance has changed.

## Design Rules

1. Make dependencies explicit when explicitness improves the component contract.

2. Inject capabilities rather than infrastructure containers.

3. Define narrow dependency interfaces.

4. Construct dependencies outside components that merely consume them.

5. Keep dependency ownership explicit.

6. Thread dependencies through props when the resulting API remains clear and local.

7. Do not treat every prop as dependency injection.

8. Do not treat prop drilling as inherently wrong.

9. Introduce Context when dependency propagation becomes structurally expensive, not merely because one prop feels
   inconvenient.

10. Do not pass an application-wide service registry when a focused dependency can be passed instead.

11. Design dependency lifetime independently from dependency delivery.

12. Respect dependency identity when Effects, subscriptions, or memoization depend on reference equality.

13. Replace dependencies at the composition boundary for isolated tests.

14. Keep infrastructure dependencies out of presentation components when those components only require data and
    commands.

15. Do not use dependency changes as an implicit remount mechanism.

16. Keep server-only dependencies on the server and client-compatible dependencies on the client.

17. Treat the dependency contract as part of the component's public API.

18. Prefer the simplest dependency-distribution mechanism that preserves the required architectural properties.

## Core Principle

**Pass a component the capabilities it needs instead of making the component discover or construct those capabilities
itself.**

Dependency-through-props makes the relationship explicit:

```tsx
function Editor({
                    documentRepository,
                    logger,
                }: {
    documentRepository: DocumentRepository;
    logger: Logger;
}) {
    // The component consumes explicitly supplied capabilities.
}
```

The composition boundary decides which concrete implementations to provide:

```tsx
<Editor
    documentRepository={repository}
    logger={logger}
/>
```

The component remains responsible for its own behavior while its collaborators remain controlled by the surrounding
architecture.

The pattern is strongest when the dependency is local, the contract is narrow, and explicit data flow is preferable to
hidden environmental lookup. When many deeply nested descendants require the same capability, Context may provide a more
appropriate distribution mechanism. The architectural goal is not to maximize injection or minimize props; it is to make
dependency ownership, scope, and direction deliberate.
