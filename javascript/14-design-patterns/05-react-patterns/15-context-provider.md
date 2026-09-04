# Context Provider

The Context Provider pattern uses React Context to make a value available to a subtree of components without requiring
that value to be passed explicitly through every intermediate component.

The provider establishes the scope in which the value is available:

```tsx
const ThemeContext = createContext<Theme>("light");

function App() {
    return (
        <ThemeContext.Provider value="dark">
            <Page/>
        </ThemeContext.Provider>
    );
}
```

Any descendant that consumes `ThemeContext` can access the provider's current value regardless of how many intermediate
components exist between the provider and the consumer.

The defining characteristic is scoped propagation through the React component tree. The provider establishes ownership
and availability of the contextual value; consumption is a separate concern.

## Intent

Use the Context Provider pattern when a value must be available to multiple descendants and explicit prop passing would
create unnecessary intermediary dependencies.

Typical provider values include:

* Application configuration.
* Localization settings.
* Theme configuration.
* Authentication/session information.
* Dependency objects.
* Feature configuration.
* Shared UI state.
* Service instances.
* Domain-specific state and operations.
* Environment-specific capabilities.

The provider creates a dependency boundary around the subtree that requires the value.

## Context as a Scoped Dependency

A Context is a mechanism for declaring that a subtree depends on a particular value.

```tsx
const ApiClientContext = createContext<ApiClient | null>(null);

function App() {
    const apiClient = createApiClient();

    return (
        <ApiClientContext.Provider value={apiClient}>
            <Application/>
        </ApiClientContext.Provider>
    );
}
```

`Application` and its descendants can depend on the API client without receiving it as an explicit prop through every
component.

The provider therefore acts as a dependency composition boundary.

This is particularly useful when the dependency is infrastructure rather than component-specific data.

## Provider Scope

A provider affects only its descendants.

```tsx
function App() {
    return (
        <>
            <ThemeContext.Provider value="dark">
                <DarkSection/>
            </ThemeContext.Provider>

            <LightSection/>
        </>
    );
}
```

`DarkSection` receives the contextual value established by the provider. `LightSection` does not.

This lexical-tree scope is one of the most important properties of Context.

A provider does not create a globally accessible variable. It creates a value available to consumers within a particular
React subtree.

## Nearest Provider Wins

When multiple providers for the same Context exist, a consumer receives the value from the nearest provider above it in
the tree.

```tsx
function App() {
    return (
        <ThemeContext.Provider value="dark">
            <Page/>

            <ThemeContext.Provider value="light">
                <Modal/>
            </ThemeContext.Provider>
        </ThemeContext.Provider>
    );
}
```

`Page` observes `"dark"`.

`Modal` observes `"light"` because the nested provider shadows the outer provider for that subtree.

This allows Context to model nested scopes.

## Provider as a Boundary

A provider can be treated as a boundary around a specific dependency or state domain.

```tsx
function CheckoutPage() {
    const checkout = createCheckout();

    return (
        <CheckoutContext.Provider value={checkout}>
            <CheckoutHeader/>
            <CheckoutForm/>
            <CheckoutSummary/>
        </CheckoutContext.Provider>
    );
}
```

The provider communicates an architectural fact:

"Everything inside this subtree may depend on the checkout context."

Components outside the boundary do not implicitly depend on it.

This makes providers useful for expressing ownership and dependency scope.

## Context Value

The value supplied by a provider can be any JavaScript value.

```tsx
const ConfigContext = createContext<Config | null>(null);
```

A provider can supply:

```tsx
<ConfigContext.Provider value={config}>
    <Application/>
</ConfigContext.Provider>
```

It can also supply an object containing state and operations:

```tsx
<UserContext.Provider
    value={{
        user,
        login,
        logout,
    }}
>
    <Application/>
</UserContext.Provider>
```

The value should represent a coherent dependency or state domain rather than becoming an arbitrary container for
unrelated application data.

## Provider with State

Context is frequently combined with React state.

```tsx
type CartContextValue = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function CartProvider({children}: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    function addItem(item: CartItem) {
        setItems((items) => [...items, item]);
    }

    const value = {
        items,
        addItem,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
```

The provider owns the state while Context distributes access to that state through the subtree.

This creates a common architecture:

* Provider owns state.
* Context defines the dependency contract.
* Consumers access the contract.

The state ownership and Context distribution mechanisms remain conceptually distinct.

## Provider with Reducer

A provider can also own reducer-based state.

```tsx
type CartAction =
    | { type: "add"; item: CartItem }
    | { type: "remove"; id: string };

function cartReducer(
    state: CartItem[],
    action: CartAction,
): CartItem[] {
    switch (action.type) {
        case "add":
            return [...state, action.item];

        case "remove":
            return state.filter((item) => item.id !== action.id);
    }
}

const CartContext = createContext<{
    items: CartItem[];
    dispatch: React.Dispatch<CartAction>;
} | null>(null);

function CartProvider({children}: { children: React.ReactNode }) {
    const [items, dispatch] = useReducer(cartReducer, []);

    return (
        <CartContext.Provider value={{items, dispatch}}>
            {children}
        </CartContext.Provider>
    );
}
```

The reducer defines state transitions. The provider defines the scope in which that state and dispatch capability are
available.

The Provider Pattern therefore complements the Reducer Pattern rather than replacing it.

## Provider as Dependency Injection

Context Provider is particularly useful as a React-specific dependency injection mechanism.

```tsx
const PaymentServiceContext =
    createContext<PaymentService | null>(null);

function Application() {
    const paymentService = createPaymentService();

    return (
        <PaymentServiceContext.Provider value={paymentService}>
            <Checkout/>
        </PaymentServiceContext.Provider>
    );
}
```

The consumer depends on the abstraction exposed by the Context rather than constructing the service itself.

This provides:

* Explicit dependency scope.
* Runtime substitution.
* Test-time replacement.
* Environment-specific implementations.
* Separation between component logic and infrastructure construction.

Context is not required for all dependency injection. Plain JavaScript dependency injection, constructor parameters,
factory arguments, and module composition remain valid alternatives.

## Provider Ownership

The component that creates a provider value should generally own the lifetime and configuration of that value.

```tsx
function Application() {
    const apiClient = useMemo(
        () => createApiClient(),
        [],
    );

    return (
        <ApiClientContext.Provider value={apiClient}>
            <Routes/>
        </ApiClientContext.Provider>
    );
}
```

The provider establishes where the dependency is available.

If the dependency itself requires setup and teardown, its lifecycle should be managed deliberately rather than hidden
inside the provider value expression.

For example, a provider can combine resource ownership with synchronization:

```tsx
function ConnectionProvider({
                                children,
                            }: {
    children: React.ReactNode;
}) {
    const connection = useConnectionResource();

    return (
        <ConnectionContext.Provider value={connection}>
            {children}
        </ConnectionContext.Provider>
    );
}
```

The exact lifecycle mechanism belongs to the resource abstraction rather than to Context itself.

## Provider Value Identity

Context propagation is affected by the identity of the provider's value.

Consider:

```tsx
function Provider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const value = {
        user,
        setUser,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
```

The `value` object is recreated on every render.

If the provider re-renders for reasons unrelated to the semantic Context value, consumers may receive a new value
identity and re-render.

A provider can stabilize the value when that improves the actual update behavior:

```tsx
function Provider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const value = useMemo(
        () => ({
            user,
            setUser,
        }),
        [user],
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
```

Memoization is not required for Context to function correctly. It is an optimization concerning value identity and
consumer updates.

## Provider Value Design

The Context value should have a deliberate API.

Avoid turning one Context into an unrestricted application container:

```tsx
<AppContext.Provider
    value={{
        user,
        theme,
        cart,
        notifications,
        settings,
        products,
        search,
        modal,
        permissions,
    }}
>
    <Application/>
</AppContext.Provider>
```

This creates a broad dependency surface. Components may become coupled to unrelated domains and updates may propagate
more widely than necessary.

Prefer contexts representing coherent domains:

```tsx
<UserContext.Provider value={userValue}>
    <ThemeContext.Provider value={themeValue}>
        <CartContext.Provider value={cartValue}>
            <Application/>
        </CartContext.Provider>
    </ThemeContext.Provider>
</UserContext.Provider>
```

Context partitioning is a separate optimization and architectural pattern, but the provider's value design is the first
boundary to consider.

## Provider Composition

Applications often require multiple providers.

```tsx
function ApplicationProviders({
                                  children,
                              }: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
```

This creates a provider hierarchy.

The hierarchy itself is not necessarily problematic. The important consideration is whether the nesting accurately
represents dependency scope.

A provider should exist at the lowest level that can satisfy all consumers that legitimately require it, unless the
dependency intentionally has broader application scope.

## Provider Placement

Provider placement determines dependency visibility and often resource lifetime.

A provider placed too high can make a narrowly scoped dependency available throughout the entire application.

```tsx
function App() {
    return (
        <EditorProvider>
            <EntireApplication/>
        </EditorProvider>
    );
}
```

If only one route needs the editor, a narrower boundary may be preferable:

```tsx
function App() {
    return (
        <Routes>
            <Route
                path="/editor"
                element={
                    <EditorProvider>
                        <Editor/>
                    </EditorProvider>
                }
            />
        </Routes>
    );
}
```

Provider placement should therefore be based on dependency scope rather than convenience alone.

## Nested Providers

Nested providers are useful when a subtree needs a specialized version of a dependency.

```tsx
<LocaleProvider locale="en">
    <Application/>

    <LocaleProvider locale="de">
        <GermanSection/>
    </LocaleProvider>
</LocaleProvider>
```

The nested provider changes the contextual environment for its descendants without changing the outer environment.

This makes Context suitable for scoped configuration and overrides.

## Default Context Values

A Context can define a default value:

```tsx
const ThemeContext = createContext<Theme>("light");
```

The default is used when no matching provider exists above the consumer.

Default values should be chosen deliberately.

For required dependencies, a nullable default can make missing providers explicit:

```tsx
const ApiClientContext =
    createContext<ApiClient | null>(null);
```

The consumer can then enforce the provider requirement.

Alternatively, the context can be initialized with a deliberately failing default:

```tsx
const ApiClientContext = createContext<ApiClient>({
    request() {
        throw new Error("ApiClientProvider is missing");
    },
});
```

The exact strategy depends on whether a context is conceptually optional or mandatory.

## Required Providers

For mandatory dependencies, it is often useful to make the provider boundary explicit.

```tsx
const ApiClientContext =
    createContext<ApiClient | null>(null);

function ApiClientProvider({
                               client,
                               children,
                           }: {
    client: ApiClient;
    children: React.ReactNode;
}) {
    return (
        <ApiClientContext.Provider value={client}>
            {children}
        </ApiClientContext.Provider>
    );
}
```

The provider establishes the dependency contract.

A dedicated consumer abstraction can enforce that the provider exists. That consumer abstraction belongs to the Context
Custom Hook pattern rather than this provider pattern.

## Provider as an Architectural Boundary

A provider can separate infrastructure from application components.

```tsx
function Application() {
    const repository = createUserRepository();

    return (
        <UserRepositoryContext.Provider value={repository}>
            <UserRoutes/>
        </UserRepositoryContext.Provider>
    );
}
```

The components below the boundary depend on the repository abstraction.

The composition root decides which implementation is supplied:

```tsx
const repository =
    process.env.NODE_ENV === "test"
        ? createFakeUserRepository()
        : createUserRepository();
```

This allows the component tree to remain independent of concrete construction details.

## Testing Providers

Providers make dependencies replaceable during tests.

```tsx
function renderWithApi(
    ui: React.ReactNode,
    api: ApiClient,
) {
    return render(
        <ApiClientContext.Provider value={api}>
            {ui}
        </ApiClientContext.Provider>,
    );
}
```

A test can supply a fake implementation:

```tsx
const api = {
    getUser: vi.fn(),
};

renderWithApi(<UserProfile/>, api);
```

This avoids requiring the test to initialize production infrastructure.

The provider therefore acts as a runtime composition boundary.

## Provider and State Ownership

A provider does not inherently mean that the provider owns mutable state.

A provider can distribute an immutable dependency:

```tsx
<ConfigContext.Provider value={config}>
    <Application/>
</ConfigContext.Provider>
```

It can distribute a service:

```tsx
<ApiClientContext.Provider value={apiClient}>
    <Application/>
</ApiClientContext.Provider>
```

Or it can distribute state:

```tsx
<CartContext.Provider value={cartState}>
    <Application/>
</CartContext.Provider>
```

The important architectural distinction is:

* Context determines distribution.
* State determines reactivity and ownership.
* The Provider determines scope.

These concepts can be combined but should not be conflated.

## Context and Prop Drilling

Context is often introduced to eliminate prop drilling.

Consider:

```tsx
function App() {
    const user = useUser();

    return <Page user={user}/>;
}

function Page({user}: { user: User }) {
    return <Layout user={user}/>;
}

function Layout({user}: { user: User }) {
    return <Header user={user}/>;
}

function Header({user}: { user: User }) {
    return <UserMenu user={user}/>;
}
```

If `Page` and `Layout` do not actually depend on `user`, they are merely transporting it.

Context can remove those intermediary dependencies:

```tsx
function App() {
    const user = useUser();

    return (
        <UserContext.Provider value={user}>
            <Page/>
        </UserContext.Provider>
    );
}

function Page() {
    return <Layout/>;
}

function Layout() {
    return <Header/>;
}
```

This is useful when the dependency genuinely belongs to the subtree.

Context should not automatically replace ordinary props. Props make dependencies explicit at the component boundary,
which is often desirable for local relationships.

## Context and Component Composition

Composition can sometimes eliminate the need for Context.

Instead of:

```tsx
function Page() {
    return (
        <UserContext.Provider value={user}>
            <Layout/>
        </UserContext.Provider>
    );
}
```

a component can sometimes receive already-composed children:

```tsx
function Page() {
    return (
        <Layout
            header={<UserMenu user={user}/>}
        />
    );
}
```

Composition is preferable when the dependency only needs to cross a small structural boundary.

Context becomes more appropriate when many descendants at different levels need the same dependency.

## Context and Dependency Direction

A provider establishes a dependency direction from the provider boundary toward its descendants.

```tsx
<PaymentProvider>
    <Checkout/>
</PaymentProvider>
```

The checkout subtree depends on the payment capability.

The reverse dependency should generally be avoided. A low-level component should not require knowledge of which
application-level provider constructs it.

This makes providers useful for maintaining architectural boundaries.

## Context and Server Components

Context behavior depends on the React rendering architecture being used, particularly when Server Components and Client
Components are involved.

A provider that contains client-side state or client-only behavior establishes a client-side boundary where those
semantics are required.

For example:

```tsx
"use client";

const ThemeContext = createContext<Theme>("light");

export function ThemeProvider({
                                  children,
                              }: {
    children: React.ReactNode;
}) {
    const [theme, setTheme] = useState<Theme>("light");

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}
```

The provider's placement must therefore account for the rendering environment and whether its value depends on
client-only capabilities.

Server/client boundaries are a separate architectural concern from the Context Provider pattern.

## Common Misuse

The most common misuse is putting every shared value into one global Context.

```tsx
<AppContext.Provider
    value={{
        user,
        cart,
        theme,
        notifications,
        settings,
    }}
>
    <Application/>
</AppContext.Provider>
```

This creates a broad dependency boundary and makes unrelated state changes harder to isolate.

Another misuse is using Context for values that only need to pass through one or two components. Ordinary props or
composition are often clearer.

Another misuse is creating a provider at the application root simply because it is convenient, even when the dependency
is only required by a narrow subtree.

Another misuse is constructing unstable Context values unnecessarily:

```tsx
<Context.Provider
    value={{
        state,
        update,
    }}
>
```

If the provider re-renders frequently, the value identity changes even when the semantic dependency has not changed.
Memoization or a different value design may be appropriate.

Another misuse is treating Context as global mutable storage.

Context is scoped to a React tree and distributes a value. It does not provide the complete semantics of a global
state-management system.

Another misuse is hiding all dependencies behind Context. Components can become difficult to understand when their
inputs are invisible except through implicit contextual access.

## Advantages

The Context Provider pattern eliminates unnecessary prop threading across intermediate components.

It establishes explicit dependency scope, supports nested overrides, enables runtime dependency substitution, and works
naturally with React state and reducer-based state.

Providers are also useful composition boundaries for infrastructure dependencies, configuration, and application-wide
capabilities.

## Disadvantages

Context creates implicit dependencies. A component consuming a Context can no longer be understood solely from its
explicit props.

Broad contexts can increase the number of consumers affected by updates and can create large dependency surfaces.

Provider hierarchies can also become difficult to understand when too many unrelated providers accumulate.

Context is therefore most effective when each provider represents a coherent dependency or state domain with a
deliberate scope.

## When to Use

Use the Context Provider pattern when:

* Many descendants require the same dependency.
* Passing the dependency through intermediate components would create unnecessary prop drilling.
* The dependency has a meaningful subtree scope.
* A service or infrastructure dependency needs runtime substitution.
* Configuration needs to be overridden for a subtree.
* Shared state belongs to a specific component subtree.
* Tests need to replace a production dependency.
* Nested scopes require different values.

Prefer ordinary props when:

* The dependency is local.
* The relationship is direct.
* Explicit data flow improves clarity.
* Only a small number of components need the value.

Prefer composition when:

* The dependency only needs to cross a structural boundary.
* The receiving component does not need to understand the dependency itself.

Prefer a dedicated external state mechanism when:

* State must be shared outside a single React subtree.
* Complex subscription semantics are required.
* The state is owned by an external store.

## Relationship to Other React Patterns

The Context Provider Pattern establishes a scoped value and makes it available to descendants.

The Context Custom Hook Pattern provides a dedicated API for consuming that Context. The provider owns the distribution
boundary; the custom hook owns the consumer-facing access abstraction.

Context Partitioning divides broad contextual state into multiple contexts to reduce dependency coupling and unnecessary
updates. It is an optimization and structural refinement of provider design.

Provider Composition combines multiple providers into a coherent application boundary. It concerns provider hierarchy
rather than the semantics of an individual Context.

Dependency Injection Through Context specializes the provider mechanism for dependency injection. The Context Provider
is the underlying React mechanism; DI through Context focuses specifically on supplying services or capabilities.

State Lifting moves shared state upward to a common React owner. A provider can then distribute that state downward, but
lifting and Context solve different problems: lifting determines ownership, while Context determines distribution.

State Colocation keeps state close to the components that use it. A provider placed too high can violate that principle
by broadening state scope unnecessarily.

Controlled Components receive their state from an external owner through props. Context can be the distribution
mechanism for that owner, but controlled state semantics remain separate.

Compound Components frequently use Context to coordinate shared state between parent and child components. In that case,
Context is an implementation mechanism supporting the compound-component protocol.

Custom Hooks can encapsulate provider setup, state ownership, and synchronization logic. The Hook abstraction and
Context distribution boundary remain separate concerns.

## Summary

The Context Provider pattern establishes a scoped dependency or state value for a React subtree.

Its defining characteristics are:

* A provider establishes the value's scope.
* Descendants can access the value without explicit prop threading.
* Nested providers create nested scopes.
* The nearest matching provider determines the value observed by a consumer.
* The provider can distribute configuration, services, state, reducers, or other values.
* Provider placement determines dependency visibility and often resource lifetime.
* Context values should represent coherent dependency domains.
* Provider value identity affects consumer update behavior.
* Context should not automatically replace props or composition.
* Context is scoped React dependency distribution, not unrestricted global storage.

The core mental model is: **a Context Provider establishes a dependency boundary and supplies one value to every
descendant that belongs to that scope.**
