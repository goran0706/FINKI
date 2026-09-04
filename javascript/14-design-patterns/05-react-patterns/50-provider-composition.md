# Provider Composition

Provider Composition is the pattern of structuring multiple React Context providers into a deliberate composition
boundary so that consumers can access several independently defined dependencies or application capabilities without
forcing provider nesting to be repeated throughout the application.

The pattern addresses the structural problem created when an application accumulates several providers around the same
subtree. Instead of allowing provider nesting to become scattered across entry points and feature components, the
providers can be composed into one explicit boundary.

The pattern is about **composition of providers**, not about combining the values of different contexts into one
context.

## Intent

Use Provider Composition when multiple independent providers must consistently surround the same subtree.

Typical examples include providers for:

* application configuration;
* authentication;
* theming;
* localization;
* routing;
* query or server-state management;
* feature configuration;
* UI state;
* dependency injection;
* testing infrastructure.

The goal is to establish a predictable provider boundary while preserving the independent ownership and contracts of the
underlying contexts.

## Basic Pattern

Without composition, an application root may contain deeply nested providers:

```tsx
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router}/>
                </QueryClientProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
```

Provider Composition extracts that structure into a dedicated component:

```tsx
function AppProviders({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router}/>
                </QueryClientProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
```

The application entry point can then express the architectural boundary directly:

```tsx
function App() {
    return (
        <AppProviders>
            <Application/>
        </AppProviders>
    );
}
```

The providers remain separate. Only their composition is centralized.

## Provider Independence

Provider Composition does not require providers to share a state model.

For example:

```tsx
<ThemeProvider>
    <AuthProvider>
        <Application/>
    </AuthProvider>
</ThemeProvider>
```

The theme provider owns theme-related state.

The authentication provider owns authentication-related state.

Their composition does not merge those responsibilities.

This distinction is fundamental. Provider Composition organizes independently owned capabilities; it does not create a
single shared state container.

## Why Provider Composition Exists

React Context providers naturally produce nested JSX.

As the number of application-wide capabilities increases, the root can become dominated by structural nesting:

```tsx
<A>
    <B>
        <C>
            <D>
                <E>
                    <Application/>
                </E>
            </D>
        </C>
    </B>
</A>
```

The problem is not the nesting itself. React requires the providers to establish their respective context scopes.

The problem is allowing this structural concern to be repeated or embedded in unrelated components.

A provider-composition boundary gives the nesting a single architectural owner.

## Explicit Composition

A straightforward implementation is usually the easiest to understand.

```tsx
function AppProviders({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <QueryProvider>
                    {children}
                </QueryProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
```

This approach makes provider order explicit.

It also makes the dependency relationship between providers visible in the source code.

## Provider Order

Provider order is semantically significant whenever one provider consumes another provider's context.

For example:

```tsx
function AuthProvider({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    const config = React.useContext(ConfigContext);

    // ...
    return children;
}
```

`ConfigProvider` must be outside `AuthProvider`:

```tsx
<ConfigProvider>
    <AuthProvider>
        {children}
    </AuthProvider>
</ConfigProvider>
```

The reverse ordering would place `AuthProvider` outside the configuration context and therefore prevent it from
consuming that context.

Provider Composition must therefore preserve dependency order.

## Independent Providers

When providers do not depend on one another, their relative order may not matter semantically.

```tsx
<ThemeProvider>
    <LocaleProvider>
        <Application/>
    </LocaleProvider>
</ThemeProvider>
```

and:

```tsx
<LocaleProvider>
    <ThemeProvider>
        <Application/>
    </ThemeProvider>
</LocaleProvider>
```

may provide equivalent capabilities.

Even when order is semantically interchangeable, consistency matters. An application should establish a predictable
ordering convention rather than allowing each entry point to arrange providers differently.

## Provider Dependency Graph

Provider order can be understood as a dependency relationship.

If provider `B` consumes context supplied by provider `A`, `A` must be an ancestor of `B`.

This makes provider composition structurally similar to dependency ordering.

For example:

```tsx
<ConfigurationProvider>
    <FeatureProvider>
        <Application/>
    </FeatureProvider>
</ConfigurationProvider>
```

is appropriate if `FeatureProvider` consumes configuration.

The important point is not merely that both providers exist. Their nesting establishes a runtime dependency boundary.

## Providers That Consume Other Providers

A provider can itself consume Context.

```tsx
const ConfigContext = React.createContext<Config | null>(null);

function FeatureProvider({
                             children,
                         }: {
    children: React.ReactNode;
}) {
    const config = React.useContext(ConfigContext);

    return (
        <FeatureContext.Provider value={createFeature(config)}>
            {children}
        </FeatureContext.Provider>
    );
}
```

Composition can therefore create a dependency chain.

```tsx
function AppProviders({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    return (
        <ConfigProvider>
            <FeatureProvider>
                {children}
            </FeatureProvider>
        </ConfigProvider>
    );
}
```

This should be intentional because provider order becomes part of the architecture.

## Provider Composition Is Not Context Partitioning

Context Partitioning separates Context boundaries according to independent consumers, update patterns, or ownership.

Provider Composition does something different.

Provider Composition answers:

**How should several existing providers be assembled around a subtree?**

Context Partitioning answers:

**How should context values and provider boundaries be divided?**

They can be used together.

For example, an application may have separate contexts for theme, authentication, permissions, and notifications, and
then compose their providers into one root boundary.

## Provider Composition Is Not Context Provider

The Context Provider pattern establishes and supplies a Context value.

Provider Composition combines multiple provider components into one composition boundary.

For example:

```tsx
<ThemeProvider>
    <AuthProvider>
        {children}
    </AuthProvider>
</ThemeProvider>
```

uses Context Providers.

A component such as:

```tsx
function AppProviders({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    // ...
}
```

implements Provider Composition.

The latter does not replace the former.

## Composition Without Merging Contexts

Avoid creating one enormous context merely to eliminate provider nesting.

Instead of:

```tsx
type AppContextValue = {
    theme: Theme;
    user: User | null;
    locale: string;
    permissions: Permission[];
    notifications: Notification[];
};
```

prefer independently scoped contexts when these values have different ownership, update behavior, or consumer sets.

```tsx
<ThemeProvider>
    <AuthProvider>
        <LocaleProvider>
            <NotificationProvider>
                {children}
            </NotificationProvider>
        </LocaleProvider>
    </AuthProvider>
</ThemeProvider>
```

Provider Composition allows these contexts to remain independent without making the application tree responsible for
manually repeating the nesting everywhere.

## Provider Composition and Value Ownership

Provider Composition does not determine who owns the underlying state.

For example:

```tsx
function ThemeProvider({
                           children,
                       }: {
    children: React.ReactNode;
}) {
    const [theme, setTheme] = React.useState("light");

    // ...
}
```

The theme provider owns theme state.

The composition component only determines where `ThemeProvider` appears in the tree.

This distinction prevents Provider Composition from becoming confused with State Colocation or State Lifting.

## Provider Composition and State Colocation

State Colocation determines the narrowest appropriate owner for state.

Provider Composition determines how providers are structurally assembled.

A provider may be colocated at a feature boundary:

```tsx
function BillingFeature() {
    return (
        <BillingProvider>
            <Billing/>
        </BillingProvider>
    );
}
```

while global providers are composed at the application boundary:

```tsx
function AppProviders({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </AuthProvider>
    );
}
```

Provider Composition should not be used as an argument for making every provider global.

## Global vs Local Providers

Not every provider belongs in the root composition.

A provider should be placed at the narrowest subtree that requires its capability.

For example:

```tsx
function EditorPage() {
    return (
        <EditorProvider>
            <Editor/>
        </EditorProvider>
    );
}
```

There is little benefit in moving `EditorProvider` to the application root if only the editor feature uses it.

A root provider composition should contain genuinely cross-application capabilities.

## Feature-Level Provider Composition

Provider Composition can also be used within a feature.

```tsx
function EditorProviders({
                             children,
                         }: {
    children: React.ReactNode;
}) {
    return (
        <EditorStateProvider>
            <EditorSettingsProvider>
                <EditorHistoryProvider>
                    {children}
                </EditorHistoryProvider>
            </EditorSettingsProvider>
        </EditorStateProvider>
    );
}
```

Then:

```tsx
function EditorFeature() {
    return (
        <EditorProviders>
            <Editor/>
        </EditorProviders>
    );
}
```

This keeps feature-specific provider structure inside the feature boundary.

## Multiple Composition Boundaries

Large applications may have several provider-composition components.

```tsx
function AppProviders({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    return (
        <PlatformProviders>
            <ApplicationProviders>
                {children}
            </ApplicationProviders>
        </PlatformProviders>
    );
}
```

This is useful when different architectural layers own different provider groups.

The objective is not to create one provider component containing every provider in the application.

The objective is to establish meaningful composition boundaries.

## Provider Composition and Dependency Injection

React Context is frequently used as a dependency-injection mechanism.

For example:

```tsx
function ApiProvider({
                         api,
                         children,
                     }: {
    api: ApiClient;
    children: React.ReactNode;
}) {
    return (
        <ApiContext.Provider value={api}>
            {children}
        </ApiContext.Provider>
    );
}
```

Provider Composition can then assemble infrastructure dependencies:

```tsx
function AppProviders({
                          api,
                          children,
                      }: {
    api: ApiClient;
    children: React.ReactNode;
}) {
    return (
        <ApiProvider api={api}>
            <AuthProvider>
                <ApplicationConfigProvider>
                    {children}
                </ApplicationConfigProvider>
            </AuthProvider>
        </ApiProvider>
    );
}
```

The providers remain the dependency-injection mechanism.

The composition component determines their structural assembly.

## Provider Composition and Testing

Provider Composition is particularly useful for tests because the same provider structure can be reused.

```tsx
function TestProviders({
                           children,
                       }: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ApplicationConfigProvider>
                    {children}
                </ApplicationConfigProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
```

A test can then use:

```tsx
render(
    <TestProviders>
        <ComponentUnderTest/>
    </TestProviders>
);
```

However, production and testing provider compositions do not necessarily need to be identical.

Tests often replace infrastructure providers with deterministic implementations.

## Provider Overrides

A test provider can override a production dependency.

```tsx
function TestProviders({
                           children,
                       }: {
    children: React.ReactNode;
}) {
    return (
        <ApiProvider api={fakeApi}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ApiProvider>
    );
}
```

This works because the provider boundary is explicit.

The component under test does not need to know whether it is running against a production or test implementation.

## Provider Composition and Server Rendering

Provider composition can be used around server-rendered React trees, but provider lifetime and request isolation must be
considered.

Request-specific state should not accidentally be stored in process-wide mutable singletons.

For example, a provider that receives request-specific data can be composed per request:

```tsx
function RequestProviders({
                              request,
                              children,
                          }: {
    request: RequestContext;
    children: React.ReactNode;
}) {
    return (
        <RequestContextProvider value={request}>
            <ApplicationProviders>
                {children}
            </ApplicationProviders>
        </RequestContextProvider>
    );
}
```

The provider composition should reflect the intended lifetime of the data.

## Provider Lifetime

The location of a provider determines the lifetime of its state.

A provider placed near the application root can survive navigation between many screens.

A provider placed inside a route or feature subtree may be mounted and unmounted as that subtree changes.

Provider Composition therefore has lifecycle consequences.

Moving a provider upward is not merely a JSX refactor if doing so changes:

* state lifetime;
* initialization timing;
* cleanup timing;
* subscription lifetime;
* cache lifetime;
* resource ownership;
* state persistence across navigation.

## Provider Remounting

Changing the position or identity of a provider can reset its internal state.

For example:

```tsx
function Feature() {
    return (
        <FeatureProvider>
            <Editor/>
        </FeatureProvider>
    );
}
```

If `FeatureProvider` is repeatedly mounted as part of changing component identity, its internal state is recreated.

Provider Composition should therefore establish stable boundaries rather than dynamically reconstructing provider trees
without reason.

## Conditional Providers

Providers can technically be rendered conditionally:

```tsx
function AppProviders({
                          enabled,
                          children,
                      }: {
    enabled: boolean;
    children: React.ReactNode;
}) {
    if (enabled) {
        return (
            <FeatureProvider>
                {children}
            </FeatureProvider>
        );
    }

    return children;
}
```

This can be appropriate when the capability genuinely exists only under certain conditions.

However, conditional provider structure changes the Context environment of the subtree.

Consumers must therefore tolerate the absence of the provider or be guaranteed to render only when the provider exists.

## Optional Providers

A consumer can explicitly support an optional provider:

```tsx
const FeatureContext =
    React.createContext<FeatureState | null>(null);

function useOptionalFeature() {
    return React.useContext(FeatureContext);
}
```

Alternatively, a custom Hook can require the provider:

```tsx
function useFeature() {
    const value = React.useContext(FeatureContext);

    if (!value) {
        throw new Error(
            "useFeature must be used within FeatureProvider"
        );
    }

    return value;
}
```

Provider Composition should make required provider relationships predictable rather than relying on consumers to
discover missing providers accidentally.

## Provider Composition and Custom Hooks

Custom Hooks frequently hide Context consumption.

```tsx
function useAuth() {
    const context = React.useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}
```

Provider Composition can establish the required provider boundary:

```tsx
function AppProviders({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
```

The custom Hook provides the consumer API.

The provider composition provides the surrounding infrastructure.

These are complementary responsibilities.

## Provider Composition and Context Custom Hooks

A Context Custom Hook typically provides the intended consumption interface for one Context.

Provider Composition provides the assembly interface for multiple providers.

For example:

```tsx
function useAuth() {
    return React.useContext(AuthContext);
}

function useTheme() {
    return React.useContext(ThemeContext);
}
```

and:

```tsx
function AppProviders({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </AuthProvider>
    );
}
```

The consumer API and provider assembly API remain separate.

## Provider Composition and Context Partitioning

If several contexts update independently, keeping them independent can reduce unnecessary consumer invalidation and
preserve clear ownership.

```tsx
<ThemeProvider>
    <AuthProvider>
        <NotificationProvider>
            {children}
        </NotificationProvider>
    </AuthProvider>
</ThemeProvider>
```

Provider Composition does not eliminate the need to partition Context appropriately.

It simply gives the resulting providers a reusable composition boundary.

## Provider Value Stability

Provider Composition does not automatically solve unstable Context values.

A provider may still produce:

```tsx
const value = {
    user,
    logout,
};
```

on every render.

Whether that matters depends on the provider's consumers and update behavior.

Value identity remains the responsibility of the individual Context Provider.

The composition component should not attempt to memoize provider values that it does not own.

## Provider Composition and Referential Stability

Provider nesting does not inherently create referential instability.

The relevant identity boundaries remain inside the providers and their consumers.

For example:

```tsx
<AuthProvider>
    <ThemeProvider>
        {children}
    </ThemeProvider>
</AuthProvider>
```

does not require `AppProviders` itself to be memoized.

The composition component primarily establishes structure.

## Provider Composition and External Stores

An external store can be supplied through Context:

```tsx
function StoreProvider({
                           store,
                           children,
                       }: {
    store: Store;
    children: React.ReactNode;
}) {
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
}
```

Provider Composition can then establish the store dependency alongside other providers.

The external store remains responsible for state ownership and subscriptions.

The provider exposes access to it.

The composition component organizes the providers.

## Provider Composition and Server State

A server-state library may require a provider for a query client or equivalent cache infrastructure.

That provider can participate in application-level composition:

```tsx
function AppProviders({
                          children,
                      }: {
    children: React.ReactNode;
}) {
    return (
        <QueryProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </QueryProvider>
    );
}
```

The provider composition does not become the owner of server state.

The server-state system remains responsible for cache identity, synchronization, invalidation, refetching, and
mutations.

## Provider Composition and Resource Caches

Resource caches may have different intended scopes.

A cache intended to survive across the application may be created outside a root provider and passed into it.

A request-scoped cache may instead be created for each request.

Provider Composition should preserve the intended cache lifetime rather than assuming every provider represents global
state.

## Provider Composition and Layout Components

A layout component and a provider-composition component solve different structural problems.

A layout determines spatial arrangement:

```tsx
<AppShell>
    <Application/>
</AppShell>
```

Provider Composition determines contextual infrastructure:

```tsx
<AppProviders>
    <Application/>
</AppProviders>
```

They can surround one another:

```tsx
<AppProviders>
    <AppShell>
        <Application/>
    </AppShell>
</AppProviders>
```

Neither pattern replaces the other.

## Provider Composition and Feature Boundaries

Provider composition can reinforce feature boundaries.

```tsx
function BillingFeature() {
    return (
        <BillingProviders>
            <BillingPage/>
        </BillingProviders>
    );
}
```

This allows a feature to declare the contextual infrastructure it requires.

The feature remains self-contained without forcing those providers into the global application boundary.

## Provider Composition and Routing

Providers can be placed above or below routing depending on their required scope.

A global provider can surround the router:

```tsx
<AppProviders>
    <Router/>
</AppProviders>
```

A route-specific provider can surround a particular route subtree.

```tsx
<Route
    path="/editor"
    element={
        <EditorProviders>
            <EditorPage/>
        </EditorProviders>
    }
/>
```

The correct location depends on lifetime and consumer scope.

Provider Composition should not dictate routing architecture.

## Provider Composition and Suspense

Providers can appear above or below Suspense boundaries depending on which components require them.

```tsx
<AppProviders>
    <React.Suspense fallback={<Loading/>}>
        <Application/>
    </React.Suspense>
</AppProviders>
```

A provider placed above the boundary remains available to the suspended subtree.

A provider inside the boundary participates in the subtree's rendering lifecycle.

This is another reason provider placement should be deliberate.

## Provider Composition and Error Boundaries

The placement of an Error Boundary relative to providers affects what failures it can contain.

```tsx
<AppProviders>
    <ErrorBoundary>
        <Application/>
    </ErrorBoundary>
</AppProviders>
```

A provider itself may be outside the boundary.

Alternatively:

```tsx
<ErrorBoundary>
    <AppProviders>
        <Application/>
    </AppProviders>
</ErrorBoundary>
```

The choice depends on which failures should be contained.

Provider Composition should not implicitly decide error-containment architecture.

## Provider Composition and Transitions

Provider Composition itself is not a scheduling mechanism.

A provider can contain state updates initiated through transitions, but `startTransition` and `useTransition` remain
responsible for update priority.

Provider composition should therefore not be used as a performance abstraction for transitions.

## Provider Composition and Deferred Values

Likewise, deferred values concern consumer-side rendering of newer values.

Provider Composition only determines which providers surround a subtree.

A provider may expose a value that consumers defer, but the two patterns remain independent.

## Dynamic Provider Composition

Some applications need providers selected dynamically.

For example:

```tsx
function ApplicationProviders({
                                  mode,
                                  children,
                              }: {
    mode: "production" | "test";
    children: React.ReactNode;
}) {
    const ApiProvider =
        mode === "test"
            ? TestApiProvider
            : ProductionApiProvider;

    return (
        <ApiProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </ApiProvider>
    );
}
```

This can be useful for environment-specific infrastructure.

However, the provider contract should remain compatible across implementations.

## Generic Provider Composition Utilities

It is possible to create a utility that accepts providers as components.

```tsx
type Provider = React.ComponentType<{
    children: React.ReactNode;
}>;

function composeProviders(
    providers: Provider[],
): Provider {
    return function ComposedProviders({children}) {
        return providers.reduceRight(
            (acc, Provider) => (
                <Provider>{acc}</Provider>
            ),
            children,
        );
    };
}
```

Usage:

```tsx
const AppProviders = composeProviders([
    ThemeProvider,
    AuthProvider,
    FeatureProvider,
]);
```

This reduces visual nesting but also hides provider order and dependencies.

Generic composition utilities should therefore be used carefully.

Explicit JSX is often preferable when provider relationships are architecturally meaningful.

## Provider Props

Providers frequently require configuration.

```tsx
function AppProviders({
                          api,
                          children,
                      }: {
    api: ApiClient;
    children: React.ReactNode;
}) {
    return (
        <ApiProvider api={api}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ApiProvider>
    );
}
```

The composition component can serve as the boundary through which infrastructure dependencies enter the application.

It should not unnecessarily duplicate or reinterpret the configuration APIs of every provider.

## Provider Composition and Dependency Ownership

The composition component should not construct every dependency by default.

Prefer:

```tsx
const api = createApiClient(config);

root.render(
    <AppProviders api={api}>
        <App/>
    </AppProviders>
);
```

when the application bootstrap owns infrastructure creation.

Then:

```tsx
function AppProviders({
                          api,
                          children,
                      }: {
    api: ApiClient;
    children: React.ReactNode;
}) {
    return (
        <ApiProvider api={api}>
            {children}
        </ApiProvider>
    );
}
```

This keeps construction and composition as separate concerns when the architecture benefits from that distinction.

## Provider Composition and Resource Ownership

Provider placement can define resource ownership.

A provider may own:

* subscriptions;
* sockets;
* caches;
* event listeners;
* workers;
* timers;
* service clients;
* other external resources.

When the provider unmounts, those resources may be created or destroyed.

Therefore, changing provider composition can change resource lifetimes even if the rendered JSX appears equivalent.

## Avoiding Provider Monoliths

A provider-composition component should not become a monolithic application service.

Avoid:

```tsx
function AppProviders({children}) {
    // authentication
    // analytics
    // billing
    // notifications
    // editor state
    // search state
    // feature state
    // persistence
    // business rules

    return (
        // enormous provider tree
    );
}
```

A root composition boundary can legitimately contain many global providers, but feature-specific providers should remain
near their feature when possible.

## Avoiding Hidden Provider Dependencies

Provider dependencies should be discoverable.

If `FeatureProvider` requires `ConfigProvider`, the composition should make that relationship visible:

```tsx
<ConfigProvider>
    <FeatureProvider>
        {children}
    </FeatureProvider>
</ConfigProvider>
```

Avoid designs where provider dependencies are hidden behind dynamic resolution or undocumented global state.

Explicit structural dependencies are easier to test and maintain.

## Avoiding Duplicate Providers

Accidentally mounting the same provider multiple times can create separate state scopes.

For example:

```tsx
<AuthProvider>
    <Application>
        <AuthProvider>
            <Feature/>
        </AuthProvider>
    </Application>
</AuthProvider>
```

The inner provider may shadow the outer provider.

Consumers below the inner provider will receive a different context value.

Duplicate providers can be intentional, but they should never be accidental.

## Nested Provider Scope

Multiple instances of the same provider can be useful when independent scopes are required.

For example:

```tsx
<EditorProvider>
    <Editor/>
</EditorProvider>

<EditorProvider>
    <AnotherEditor/>
</EditorProvider>
```

Each editor can have independent state.

Provider Composition should preserve this ability rather than assuming every provider is singleton-like.

## Performance Considerations

Provider Composition itself is generally not a performance optimization.

Performance depends primarily on:

* provider value identity;
* provider state updates;
* consumer subscriptions;
* Context partitioning;
* subtree size;
* component rendering cost;
* external-store subscription behavior.

Extracting providers into `AppProviders` does not automatically reduce rendering work.

It primarily improves structural organization.

## Testing Provider Order

Provider dependencies should be tested when order is significant.

A provider that requires another provider should fail clearly when its dependency is absent.

```tsx
function useConfig() {
    const value = React.useContext(ConfigContext);

    if (!value) {
        throw new Error(
            "useConfig must be used within ConfigProvider"
        );
    }

    return value;
}
```

This makes invalid provider composition fail close to the actual architectural error.

## Advantages

Provider Composition centralizes repeated provider nesting, makes application infrastructure boundaries explicit,
preserves independent Context ownership, provides reusable test setup, and makes provider configuration easier to manage
consistently.

It can also reinforce feature boundaries by allowing groups of related providers to be composed at the appropriate
architectural scope.

## Disadvantages

Provider Composition can hide provider order if implemented too generically. A large root provider component can become
difficult to understand and may encourage every provider to become global.

It can also obscure lifecycle changes when providers are moved between boundaries. Since provider placement determines
context scope and often state/resource lifetime, composition is not merely cosmetic JSX abstraction.

## When to Use

Use Provider Composition when:

* several providers consistently surround the same subtree;
* provider nesting is repeated across application entry points;
* global infrastructure needs one explicit composition boundary;
* a feature has several providers that belong to the same feature boundary;
* tests require a reusable provider environment;
* provider order represents meaningful dependency relationships.

## When Not to Use

Do not use Provider Composition to merge unrelated contexts into one state object.

Do not move every provider into the application root merely to reduce JSX nesting.

Do not hide important provider dependencies behind an unnecessarily generic utility.

Do not use it as a replacement for Context Partitioning.

Do not use it as a state-management strategy.

Do not use it as a performance optimization without an independent performance reason.

## Design Rules

1. Compose providers without merging their ownership responsibilities.
2. Preserve provider dependency order.
3. Place providers at the narrowest subtree that requires them.
4. Keep global provider composition limited to genuinely global capabilities.
5. Keep feature-specific provider composition inside the feature boundary.
6. Treat provider placement as a lifecycle and resource-lifetime decision.
7. Make required provider dependencies explicit.
8. Avoid accidental duplicate providers.
9. Do not hide meaningful provider order behind generic composition utilities.
10. Keep provider value stability and Context performance concerns inside the individual providers.
11. Use composition to organize providers, not to determine state ownership.
12. Use independent Contexts when values have different ownership or update characteristics.
13. Allow multiple provider instances when independent scopes are intentional.
14. Reuse provider composition in tests when doing so reflects the required environment.
15. Keep provider composition declarative and structurally predictable.

## Relationships

**Context Provider:** The Context Provider establishes and supplies one context. Provider Composition assembles multiple
providers into a reusable boundary.

**Context Custom Hook:** A custom Hook provides the consumer-facing API for a Context. Provider Composition establishes
the provider environment in which that Hook is valid.

**Context Partitioning:** Partitioning determines how Context values and boundaries are separated. Provider Composition
organizes the resulting providers.

**State Colocation:** Colocation determines where state should live. Provider Composition determines how providers
containing state or dependencies are assembled.

**State Lifting:** Lifting changes state ownership when multiple consumers require a common owner. Provider Composition
does not itself lift state.

**Controlled Components:** A provider can expose externally controlled state, but Provider Composition does not
determine whether a component is controlled.

**Custom Hooks:** Hooks can encapsulate provider consumption or provider-related behavior. Composition organizes the
providers themselves.

**Dependency Injection Through Context:** Context can provide dependencies. Provider Composition assembles the
dependency providers.

**External Store:** An external store can be supplied through Context. The store owns the state and subscription
mechanism; the provider exposes access to it.

**Server State:** Server-state infrastructure can require a provider. Provider Composition determines where that
infrastructure is available but does not own server-state synchronization.

**Resource Cache:** A cache may be supplied by a provider. Provider placement determines cache scope when the provider
owns or creates the cache.

**Layout Components:** Layout determines spatial structure. Provider Composition determines contextual infrastructure.
They can be composed independently.

**Error Boundary:** Error boundaries contain rendering failures. Provider placement relative to the boundary determines
which provider failures or descendants are contained.

**Suspense Boundary:** Suspense controls rendering readiness. Providers can be placed above or below the boundary
depending on scope and lifecycle requirements.

**Transition:** Transitions control update priority. Provider Composition does not provide scheduling semantics.

**Deferred Value:** Deferred values control consumer-side adoption of newer values. Provider Composition only
establishes the context environment.

**Referential Stability:** Provider value identity can affect Context consumers. Provider Composition itself is not the
mechanism responsible for value stability.

## Summary

Provider Composition is the structural pattern of assembling multiple React providers into an explicit, reusable
composition boundary.

Its purpose is not to merge contexts, centralize all application state, or make every provider global. Each provider
should retain its own state ownership, value contract, lifecycle, and consumer scope.

The most important design consideration is provider placement. Provider order determines dependency availability,
provider scope determines which consumers receive a value, and provider lifetime can determine the lifetime of state and
external resources.

A good provider-composition boundary therefore makes infrastructure structure explicit while preserving independent
responsibilities:

**providers own capabilities; composition owns their assembly.**
