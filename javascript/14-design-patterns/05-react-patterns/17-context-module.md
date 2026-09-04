# Context Module

## Intent

The Context Module pattern encapsulates a React Context and the implementation surrounding it inside a single module
boundary.

Instead of exposing the raw Context object, provider implementation, state management, and consumer mechanics
independently, the module defines one cohesive public API for a particular capability.

The module owns the internal Context infrastructure while consumers depend on the capability it represents.

A Context Module commonly contains:

* The Context object.
* The Provider component.
* Provider-specific state or dependencies.
* The consumer Hook.
* Validation for missing providers.
* The public value shape.
* Internal implementation details.

A consumer should normally interact with the module through its exported Provider and consumer API rather than importing
the raw Context object.

## Basic Pattern

A simple Context Module can be structured as:

```tsx
import {
    createContext,
    useContext,
    useState,
    type PropsWithChildren,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({children}: PropsWithChildren) {
    const [theme, setTheme] = useState<Theme>("light");

    return (
        <ThemeContext value={{theme, setTheme}}>
            {children}
        </ThemeContext>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === null) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return context;
}
```

The module exposes:

```tsx
<ThemeProvider>
    <App/>
</ThemeProvider>
```

and:

```tsx
const {theme, setTheme} = useTheme();
```

The raw `ThemeContext` remains an implementation detail.

## Module Boundary

The important boundary is not merely the physical file.

The Context Module establishes an ownership boundary around a capability.

For example:

```text
theme capability
```

may be represented by:

```tsx
ThemeProvider
useTheme
```

while the following remain internal:

```tsx
ThemeContext
```

and any provider-specific implementation details.

The consumer therefore depends on the module's public contract rather than on the Context mechanism itself.

## Public API

A Context Module should expose only what consumers need.

A typical public API is:

```tsx
export {ThemeProvider};
export {useTheme};
```

while keeping:

```tsx
const ThemeContext = createContext(...);
```

private to the module.

This prevents consumers from bypassing the intended abstraction.

A consumer should not normally need to know:

* Which Context object is used.
* How the value is constructed.
* Whether state is stored with `useState`.
* Whether a reducer is used internally.
* Whether dependencies are injected through another provider.
* How missing-provider errors are implemented.

Those are implementation details of the module.

## Why Hide the Context Object

Exporting the raw Context object exposes the implementation mechanism:

```tsx
export const ThemeContext = createContext(...);
```

Consumers can then write:

```tsx
const value = useContext(ThemeContext);
```

This is not inherently invalid, but it allows every consumer to become coupled to the Context itself.

The module API:

```tsx
const value = useTheme();
```

provides a stronger abstraction boundary.

The consumer depends on the capability rather than on the storage and distribution mechanism.

## Consumer Contract

The consumer Hook should expose the semantic contract of the module.

Prefer:

```tsx
const {theme, setTheme} = useTheme();
```

over exposing an implementation-oriented structure such as:

```tsx
const context = useContext(ThemeContext);
```

The consumer API can also expose domain operations instead of raw state setters.

For example:

```tsx
type CartContextValue = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clear: () => void;
};
```

Consumers then depend on:

```tsx
const {items, addItem, removeItem} = useCart();
```

rather than depending on the internal representation of cart state.

## Provider as Module Boundary

The Provider establishes where the capability exists.

```tsx
<ThemeProvider>
    <Application/>
</ThemeProvider>
```

Every descendant within that boundary can consume the module.

The provider therefore determines the scope of the capability.

A Context Module can be instantiated multiple times:

```tsx
<ThemeProvider>
    <Application/>
</ThemeProvider>

<ThemeProvider>
    <Preview/>
</ThemeProvider>
```

Each provider instance establishes its own Context value.

The module therefore defines the capability, while each Provider instance defines its runtime scope.

## Provider Ownership

The Provider normally owns the construction of the Context value.

```tsx
function ThemeProvider({children}: PropsWithChildren) {
    const [theme, setTheme] = useState<Theme>("light");

    const value = {
        theme,
        setTheme,
    };

    return (
        <ThemeContext value={value}>
            {children}
        </ThemeContext>
    );
}
```

The provider is therefore the natural ownership boundary for state that is intended to be distributed through that
Context.

The Context object itself does not own the state.

The Provider creates the value.

## Context Module With Reducer

A Context Module can encapsulate reducer-managed state.

```tsx
import {
    createContext,
    useContext,
    useReducer,
    type PropsWithChildren,
} from "react";

type State = {
    count: number;
};

type Action =
    | { type: "increment" }
    | { type: "decrement" };

type CounterContextValue = {
    state: State;
    dispatch: React.Dispatch<Action>;
};

const CounterContext = createContext<CounterContextValue | null>(null);

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "increment":
            return {
                count: state.count + 1,
            };

        case "decrement":
            return {
                count: state.count - 1,
            };
    }
}

export function CounterProvider({children}: PropsWithChildren) {
    const [state, dispatch] = useReducer(reducer, {
        count: 0,
    });

    return (
        <CounterContext value={{state, dispatch}}>
            {children}
        </CounterContext>
    );
}

export function useCounter() {
    const context = useContext(CounterContext);

    if (context === null) {
        throw new Error("useCounter must be used within CounterProvider");
    }

    return context;
}
```

The reducer is an implementation detail of the Context Module unless dispatch itself is intentionally part of the public
contract.

## Prefer Semantic Operations

A Context Module does not have to expose its reducer or dispatcher.

Instead of:

```tsx
const {state, dispatch} = useCart();
```

it can expose:

```tsx
const {
    items,
    addItem,
    removeItem,
    clearCart,
} = useCart();
```

The provider can keep the reducer private:

```tsx
function addItem(item: CartItem) {
    dispatch({
        type: "addItem",
        item,
    });
}
```

This creates a more stable public API.

Internal state transitions can then change without requiring consumers to know about the reducer's action structure.

## Raw Context Versus Semantic API

Consider:

```tsx
const UserContext = createContext<UserContextValue | null>(null);
```

and:

```tsx
export function useUser() {
    const value = useContext(UserContext);

    if (value === null) {
        throw new Error("useUser must be used within UserProvider");
    }

    return value;
}
```

The public API is:

```tsx
useUser();
```

not:

```tsx
useContext(UserContext);
```

This distinction becomes important as the module evolves.

The implementation can change from:

```tsx
useState
```

to:

```tsx
useReducer
```

or from local state to an external service without necessarily changing the consumer API.

## Context Module and Encapsulation

The Context Module is primarily an encapsulation boundary.

It combines several implementation mechanisms behind one public module:

```tsx
Context
Provider
state
consumer
Hook
validation
```

Consumers depend on:

```tsx
Provider
consumer
API
```

This reduces the number of implementation details that must be understood across the application.

## Module-Level Context Identity

The Context object should normally be created once at module scope.

Prefer:

```tsx
const ThemeContext = createContext<ThemeContextValue | null>(null);
```

at module scope.

Do not create the Context inside the Provider:

```tsx
function ThemeProvider() {
    const Context = createContext(...);

    return (
        <Context value={...}>
            ...
        </Context>
    );
}
```

Creating a new Context object during Provider execution destroys the stable Context identity required for consumers to
reference the same Context.

The Context definition belongs to the module.

The Provider creates values for that Context.

## Context Identity

Context identity is determined by the Context object itself.

For a consumer to read the value supplied by a Provider, both must refer to the same Context object.

This is one reason the Context object belongs inside a dedicated module.

```tsx
const ThemeContext = createContext(...);
```

Both:

```tsx
ThemeProvider
```

and:

```tsx
useTheme
```

import or close over the same module-level Context.

## Missing Provider Errors

A Context Module can provide an explicit failure when its consumer is used outside its required Provider.

```tsx
export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === null) {
        throw new Error(
            "useTheme must be used within ThemeProvider"
        );
    }

    return context;
}
```

This is generally preferable to allowing consumers to receive `null` and requiring every consumer to perform the same
validation.

The module owns the invariant:

```text
useTheme requires ThemeProvider
```

The consumer receives a non-null semantic API.

## Nullable Context Values

Using `null` as the Context's default value can make provider requirements explicit.

```tsx
const ThemeContext =
    createContext<ThemeContextValue | null>(null);
```

The consumer Hook validates the invariant.

Alternatively, a meaningful default value can be supplied:

```tsx
const ThemeContext = createContext<ThemeContextValue>({
    theme: "light",
    setTheme: () => {
    },
});
```

However, this can hide a missing Provider because the consumer receives a seemingly valid value even when no Provider
exists.

For required Providers, an explicit missing-provider failure is often easier to reason about.

## Context Default Value

The default value passed to `createContext` is used when no matching Provider supplies a value.

It should therefore represent an intentional API decision.

A default value is appropriate when consumers genuinely have a valid behavior without a Provider.

For example:

```tsx
const LocaleContext = createContext("en");
```

may be reasonable if English is a legitimate fallback.

For required application capabilities, `null` plus an explicit invariant check can make configuration errors easier to
detect.

## Context Module With Dependencies

A Context Module can consume other dependencies.

```tsx
const AnalyticsContext =
    createContext<AnalyticsClient | null>(null);

export function AnalyticsProvider({
                                      client,
                                      children,
                                  }: {
    client: AnalyticsClient;
    children: React.ReactNode;
}) {
    return (
        <AnalyticsContext value={client}>
            {children}
        </AnalyticsContext>
    );
}
```

Another Context Module can consume that capability:

```tsx
function useAnalytics() {
    const client = useContext(AnalyticsContext);

    if (client === null) {
        throw new Error("AnalyticsProvider is missing");
    }

    return client;
}
```

The module can then expose higher-level operations:

```tsx
export function usePageAnalytics() {
    const analytics = useAnalytics();

    return {
        trackPageView: analytics.trackPageView,
    };
}
```

This creates explicit dependency relationships between modules.

## Context Module as Dependency Boundary

A Context Module can represent an injected capability rather than application state.

For example:

```tsx
type Logger = {
    info(message: string): void;
    error(message: string): void;
};
```

The Context Module can expose:

```tsx
<LoggerProvider logger={logger}>
    <Application/>
</LoggerProvider>
```

and:

```tsx
const logger = useLogger();
```

The consumer does not need to know how the logger is constructed.

This makes Context useful as a scoped dependency-distribution mechanism.

## Context Module Versus Global Singleton

A Context Module does not inherently create global state.

The Provider determines scope.

For example:

```tsx
<Provider value={a}>
    <AreaA/>
</Provider>

<Provider value={b}>
    <AreaB/>
</Provider>
```

`AreaA` and `AreaB` can receive different values.

This differs from a module-level singleton:

```tsx
export const service = createService();
```

A singleton has one module-level instance unless additional mechanisms are introduced.

Context provides scoped dependency resolution through the component tree.

## Multiple Provider Instances

Multiple instances of a Context Module can coexist.

```tsx
<ThemeProvider>
    <MainApplication/>
</ThemeProvider>

<ThemeProvider>
    <EmbeddedPreview/>
</ThemeProvider>
```

The two subtrees have independent Context values.

The nearest matching Provider determines the value consumed by descendants.

This allows the same capability to be scoped independently to different subtrees.

## Nested Providers

A Context Module can be nested:

```tsx
<ThemeProvider>
    <Application/>

    <ThemeProvider>
        <Preview/>
    </ThemeProvider>
</ThemeProvider>
```

The nested Provider overrides the value for its subtree.

This can be useful for scoped overrides, testing, embedded applications, or feature-specific configuration.

However, excessive nesting can make dependency scope difficult to understand.

## Context Module and Provider Composition

Multiple Context Modules can be composed:

```tsx
function ApplicationProviders({
                                  children,
                              }: PropsWithChildren) {
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

Each module remains responsible for its own Context and Provider.

Provider composition combines independently owned modules without merging their state or APIs.

The composition layer is therefore distinct from the Context Modules themselves.

## Avoid the Mega Context

A Context Module should represent a coherent capability.

Avoid creating one module such as:

```tsx
AppContext
```

containing:

```tsx
user
theme
cart
notifications
featureFlags
analytics
routing
permissions
settings
```

This creates an oversized dependency boundary.

Consumers become coupled to unrelated concerns, and updates to one concern can affect consumers of another.

Prefer independent modules:

```tsx
useAuth()
useTheme()
useCart()
useNotifications()
useFeatureFlags()
```

with separate Providers when their ownership and lifecycle differ.

## Context Value Shape

The value exposed by a Context Module should represent the public contract.

For stateful capabilities:

```tsx
type CartContextValue = {
    items: CartItem[];
    addItem(item: CartItem): void;
    removeItem(id: string): void;
};
```

For dependencies:

```tsx
type AnalyticsContextValue = {
    track(event: AnalyticsEvent): void;
};
```

For configuration:

```tsx
type FeatureFlagsContextValue = {
    isEnabled(name: string): boolean;
};
```

The value shape should be designed around consumer needs rather than around the Provider's internal state structure.

## Avoid Exposing Implementation State

Suppose the Provider internally uses:

```tsx
const [state, dispatch] = useReducer(...);
```

There is no requirement to expose:

```tsx
{
    state,
        dispatch
}
```

The module can instead expose:

```tsx
{
    items,
        addItem,
        removeItem,
        clear,
}
```

This is especially valuable when the reducer's representation is an implementation detail.

The public API should remain stable while internal state representation evolves.

## Context Value Identity

A Provider creates the value consumed through Context.

For example:

```tsx
function ThemeProvider({children}: PropsWithChildren) {
    const [theme, setTheme] = useState<Theme>("light");

    const value = {
        theme,
        setTheme,
    };

    return (
        <ThemeContext value={value}>
            {children}
        </ThemeContext>
    );
}
```

The object is recreated during rendering.

That means consumers can observe Context value identity changes when the Provider creates a new object.

If the value contains expensive or frequently changing structures, its identity and update behavior may need deliberate
design.

This is a performance concern of the Provider implementation, not a reason to expose the raw Context.

## Context Value Memoization

A Context Module may memoize its public value when doing so meaningfully reduces unnecessary identity changes.

```tsx
const value = useMemo(
    () => ({
        theme,
        setTheme,
    }),
    [theme]
);
```

However, memoizing every Context value automatically is not a universal requirement.

If `theme` changes, consumers depending on that Context value must update regardless.

Memoization is useful when it prevents meaningful identity churn, not as a substitute for correct Context architecture.

## Partitioning Context Modules

A single capability may benefit from multiple Contexts.

For example, separating state and actions can sometimes reduce consumer updates:

```tsx
const CartStateContext = createContext<CartState | null>(null);
const CartActionsContext = createContext<CartActions | null>(null);
```

The module can expose:

```tsx
useCartState();
useCartActions();
```

while keeping both Context objects private.

This allows the module to control how consumers subscribe to its data.

The Context Module therefore remains the public abstraction even when multiple internal Contexts are used.

## Context Module With Selective Consumption

A Context Module can provide specialized consumer Hooks:

```tsx
useCurrentUser();
useUserPermissions();
useLogout();
```

instead of one broad:

```tsx
useAuth();
```

This can make consumer dependencies more explicit.

The internal Context representation can remain unchanged.

The module controls the projection from its internal value to its public consumer APIs.

## Context Module and Selectors

A module may expose selector-oriented APIs when selective consumption is required.

For example:

```tsx
const name = useUserSelector(
    user => user.profile.name
);
```

The exact implementation can vary.

The important architectural distinction is that selection behavior belongs to the module's consumption boundary when the
module chooses to provide it.

Do not introduce selector APIs merely because Context exists. They are useful when the module contains state where
consumers should depend on smaller projections.

## Context Module and External Stores

A Context Module can provide access to an external store rather than storing all state directly inside the Provider.

For example:

```tsx
const StoreContext =
    createContext<Store | null>(null);
```

The Provider supplies the store:

```tsx
function StoreProvider({
                           store,
                           children,
                       }: {
    store: Store;
    children: React.ReactNode;
}) {
    return (
        <StoreContext value={store}>
            {children}
        </StoreContext>
    );
}
```

A consumer Hook can then subscribe using the appropriate external-store mechanism.

The Context Module owns dependency distribution.

The external store owns the external state.

These responsibilities should not be conflated.

## Context Module and Server State

A Context Module can expose a server-state client or resource manager, but Context itself does not provide server-state
semantics.

It does not automatically provide:

* Cache invalidation.
* Request deduplication.
* Freshness.
* Retry.
* Revalidation.
* Resource identity.

If those capabilities are required, they belong to the server-state or resource abstraction.

The Context Module can provide access to that abstraction.

## Context Module and Effects

A Provider may contain Effects when the capability requires synchronization with an external system.

```tsx
function PresenceProvider({
                              userId,
                              children,
                          }: PropsWithChildren<{ userId: string }>) {
    useEffect(() => {
        presence.connect(userId);

        return () => {
            presence.disconnect(userId);
        };
    }, [userId]);

    return (
        <PresenceContext value={...}>
            {children}
        </PresenceContext>
    );
}
```

The Context Module owns the capability.

The Effect owns synchronization with the external system.

The Context itself remains a distribution mechanism.

These concerns can coexist without becoming the same pattern.

## Context Module and Dependency Injection

Context Modules are particularly effective for scoped dependency injection.

For example:

```tsx
type PaymentClient = {
    charge(request: ChargeRequest): Promise<ChargeResult>;
};

const PaymentContext =
    createContext<PaymentClient | null>(null);

export function PaymentProvider({
                                    client,
                                    children,
                                }: {
    client: PaymentClient;
    children: React.ReactNode;
}) {
    return (
        <PaymentContext value={client}>
            {children}
        </PaymentContext>
    );
}

export function usePaymentClient() {
    const client = useContext(PaymentContext);

    if (client === null) {
        throw new Error(
            "usePaymentClient must be used within PaymentProvider"
        );
    }

    return client;
}
```

The consumer depends on the contract:

```tsx
const paymentClient = usePaymentClient();
```

rather than constructing or importing a concrete implementation.

This makes the dependency replaceable at the Provider boundary.

## Testing Overrides

A major benefit of Context Modules is the ability to replace dependencies or state at a subtree boundary.

For example:

```tsx
render(
    <PaymentProvider client={fakePaymentClient}>
        <Checkout/>
    </PaymentProvider>
);
```

The test does not need to modify module-level globals.

It provides a different implementation through the same public dependency boundary.

This is especially valuable for:

* API clients.
* Authentication services.
* Feature flags.
* Analytics.
* Clocks.
* Storage.
* Configuration.
* External integrations.

## Context Module and Feature Boundaries

A Context Module can belong entirely to a feature.

For example:

```text
checkout/
  CheckoutProvider.tsx
  CheckoutContext.ts
  useCheckout.ts
```

The feature can expose:

```tsx
CheckoutProvider
useCheckout
```

while keeping its internal Context private.

This prevents other features from depending directly on internal Context infrastructure.

The module boundary therefore reinforces feature encapsulation.

## Module File Organization

A small Context Module can live in one file:

```tsx
theme - context.tsx
```

A larger capability may separate implementation files while maintaining one public module boundary:

```text
theme/
  context.ts
  provider.tsx
  hooks.ts
  types.ts
  index.ts
```

The physical organization is not the pattern.

The important property is that the exported surface remains intentional.

Consumers should depend on the module's public entry point rather than reaching into internal files.

## Public Entry Points

A feature can expose:

```tsx
export {
    ThemeProvider,
    useTheme,
} from "./theme";
```

while keeping:

```tsx
ThemeContext
```

private.

This creates an explicit module API.

Consumers should not import:

```tsx
"./theme/context"
```

if that file is an implementation detail.

Public entry points make the architectural boundary enforceable through project structure and module exports.

## Context Module and Type Encapsulation

Types can also be kept internal.

For example, the Provider may use:

```tsx
type ThemeState = {
    theme: Theme;
    systemPreference: Theme;
};
```

while exposing only:

```tsx
type Theme = "light" | "dark";
```

The public type surface should contain only concepts that consumers need.

Internal state representations should not leak simply because TypeScript makes them easy to export.

## Context Module and API Evolution

Encapsulation allows the implementation to evolve.

A module might initially use:

```tsx
useState
```

then later use:

```tsx
useReducer
```

and eventually consume an external store.

If the public API remains:

```tsx
useCart()
```

consumers do not need to change.

Without encapsulation, consumers may depend directly on the original Context value shape and implementation.

The Context Module therefore creates a stable seam for architectural evolution.

## Common Misuse: Exporting Everything

Avoid:

```tsx
export {
    ThemeContext,
    ThemeProvider,
    useTheme,
    ThemeContextValue,
    ThemeState,
    ThemeActions,
};
```

unless consumers genuinely need every part of that API.

Every export becomes a potential dependency.

A smaller public surface is easier to evolve.

Prefer exposing the capabilities that consumers actually require.

## Common Misuse: Generic Context Factory

A generic factory can be useful infrastructure:

```tsx
createContextModule(...)
```

but excessive abstraction can make simple Context Modules harder to understand.

If every module requires understanding a generic factory's lifecycle, typing rules, and conventions, the abstraction may
obscure rather than improve the architecture.

Use shared infrastructure when it removes genuine repetition without hiding important semantics.

## Common Misuse: Context for Everything

Not every value should become a Context Module.

Props are often preferable when:

* Only one component needs the value.
* The dependency relationship is direct.
* The value has a narrow consumer set.
* Explicit data flow is clearer.

Context becomes useful when a capability must be consumed by many descendants or when passing it through intermediate
components would create unnecessary coupling.

## Common Misuse: Context as Global State

Context is not inherently global state.

A Context value is scoped to the Provider tree.

Calling a module:

```tsx
GlobalContext
```

does not make it architecturally global, but placing one Provider at the application root may effectively give the
capability application-wide scope.

Scope should be intentional.

## Common Misuse: Provider Monolith

A Provider should not become a general application service container merely because Context makes dependency
distribution convenient.

Avoid:

```tsx
<ApplicationProvider>
    ...
</ApplicationProvider>
```

containing every unrelated capability.

Prefer independently owned modules and compose their Providers at an appropriate application boundary.

## Common Misuse: Exposing Raw Dispatch

Exposing:

```tsx
const {dispatch} = useCart();
```

can tightly couple consumers to internal reducer actions.

If consumers genuinely need an event-oriented command API, explicit operations are often clearer:

```tsx
addItem(item);
removeItem(id);
clearCart();
```

Keep dispatch private when it is an implementation detail.

## Common Misuse: Context Value as Arbitrary Bag

Avoid creating a Context value merely as a collection of unrelated values:

```tsx
{
    user,
        theme,
        cart,
        modal,
        locale,
        notifications,
        analytics
}
```

This weakens the semantic meaning of the Context.

A Context Module should represent a coherent capability or dependency boundary.

## Common Misuse: Hidden Dependencies

A consumer should not unexpectedly require a Provider that is difficult to discover.

If:

```tsx
usePaymentClient();
```

requires:

```tsx
<PaymentProvider>
```

the module should make that relationship explicit through naming, documentation, and preferably a useful runtime error.

The module should own the invariant rather than allowing consumers to fail with an obscure null dereference.

## Common Misuse: Circular Context Dependencies

Context Modules can depend on one another.

However, dependencies should remain directional.

For example:

```text
Checkout
  depends on
Payment
```

is easier to reason about than:

```text
Checkout
  depends on
Payment
  depends on
Checkout
```

Circular dependencies can indicate that capabilities have been grouped incorrectly or that ownership boundaries need to
be reconsidered.

## Common Misuse: Provider Order Accidents

If one Context Module depends on another, Provider ordering matters.

For example:

```tsx
<AnalyticsProvider>
    <AuthProvider>
        <Application/>
    </AuthProvider>
</AnalyticsProvider>
```

may be required if `AuthProvider` consumes analytics.

Changing the order can invalidate the dependency.

Provider composition should therefore reflect actual dependency direction rather than arbitrary nesting.

## Relationship to Context Provider

The Context Provider pattern focuses on establishing and supplying a Context value.

The Context Module pattern goes one architectural level higher.

It groups:

* Context creation.
* Provider implementation.
* Consumer API.
* Validation.
* Public exports.

A Context Provider can exist without a Context Module.

A Context Module normally contains a Context Provider as one of its internal components.

## Relationship to Context Custom Hook

A Context Custom Hook provides a convenient consumer API:

```tsx
const theme = useTheme();
```

The Context Module uses that Hook as part of its public boundary.

Therefore:

```text
Context Custom Hook = consumer mechanism
Context Module = complete encapsulated capability
```

The module can contain one or several consumer Hooks.

## Relationship to Provider Composition

Provider Composition combines multiple Providers:

```tsx
<ThemeProvider>
    <AuthProvider>
        <CartProvider>
            {children}
        </CartProvider>
    </AuthProvider>
</ThemeProvider>
```

The Context Module defines each Provider's individual ownership boundary.

Provider Composition defines how those independently owned capabilities are assembled.

They solve different levels of the architecture.

## Relationship to Context Partitioning

Context Partitioning controls how a capability is divided across Context subscriptions.

A Context Module can internally use multiple Contexts:

```tsx
StateContext
ActionsContext
```

while exposing:

```tsx
useStatePart()
useActionsPart()
```

The partitioning strategy remains an implementation detail unless the module intentionally makes those APIs public.

## Relationship to Dependency Injection Through Context

Dependency Injection Through Context uses Context to distribute a dependency such as:

```tsx
PaymentClient
Logger
Clock
Storage
```

A Context Module is an appropriate encapsulation mechanism for such dependencies.

The distinction is conceptual:

* Dependency Injection defines why a dependency is supplied externally.
* Context defines how the dependency is distributed through the React tree.
* Context Module defines how that Context-based dependency boundary is packaged and exposed.

## Relationship to Feature-Sliced Components

Feature slicing defines ownership boundaries around coherent product capabilities.

A Context Module can live inside such a feature:

```tsx
checkout /
context /
components /
hooks /
services /
```

The module can expose the feature's shared client-side state or dependencies without exposing internal implementation
details.

The Context Module therefore supports feature encapsulation but does not itself define feature slicing.

## Relationship to External Store

An External Store owns state outside React.

A Context Module can distribute the store instance:

```tsx
<StoreProvider store={store}>
```

while consumers subscribe through the appropriate React integration.

The Context Module owns dependency distribution.

The external store owns state.

## Relationship to State Hooks

A Context Module may internally use State Hooks:

```tsx
const [theme, setTheme] = useState("light");
```

State Hooks provide the local state mechanism.

The Context Module determines how that state is exposed to descendants.

A Context Module therefore does not replace State Hooks; it packages their state behind a scoped Context API.

## Relationship to Reducer Pattern

A Context Module may internally use a reducer:

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

The reducer defines state transitions.

The Context Module defines how the resulting capability is distributed and consumed.

A reducer does not require Context, and Context does not require a reducer.

## Relationship to Effect Encapsulation

A Context Module may contain Effects when its Provider must synchronize with an external system.

Effect Encapsulation concerns ownership of the synchronization lifecycle.

Context Module concerns ownership and distribution of the capability.

The two can therefore coexist:

```tsx
Provider
owns
capability
Effect
owns
synchronization
Context
distributes
capability
```

The Context itself remains independent of Effect lifecycle semantics.

## Relationship to Server Components

A Context Module containing client-side state, Effects, browser APIs, or other client-only behavior belongs on the
client side of a Server/Client Component architecture.

A Server Component should not be treated as a consumer of arbitrary client-only Context infrastructure.

A Context Module may still represent server-safe configuration or framework-supported context concepts, but
client-specific behavior must remain within the appropriate client boundary.

The module's public API should therefore reflect whether the capability is client-only or usable across the relevant
rendering environments.

## Relationship to Hydration

A Context Module does not itself perform hydration.

If its Provider contains client state, consumers receive that state as part of the client React tree.

The initial client state must be compatible with the surrounding rendering and hydration architecture.

Hydration correctness is therefore a rendering concern; Context Module encapsulation determines how the capability is
distributed after the React tree is established.

## Design Rules

A strong Context Module follows these rules:

1. Create the Context once at module scope.
2. Keep the raw Context private unless consumers genuinely require it.
3. Expose a semantic consumer API.
4. Keep Provider implementation inside the module boundary.
5. Let the Provider own construction of the Context value.
6. Use explicit missing-provider validation when the Provider is required.
7. Keep the Context value focused on one coherent capability.
8. Do not combine unrelated application concerns into one Context Module.
9. Prefer semantic operations over exposing internal reducer dispatch.
10. Keep internal state representations private where possible.
11. Treat Provider scope as an intentional architectural decision.
12. Allow multiple Provider instances when independent scopes are meaningful.
13. Compose independent modules rather than creating one mega-provider.
14. Keep dependency direction between Context Modules explicit.
15. Use Context for distribution, not merely because a value exists.
16. Use props when direct explicit data flow is simpler.
17. Use external stores when state ownership belongs outside React.
18. Use dependency injection when consumers should depend on replaceable capabilities.
19. Keep browser-only behavior inside appropriate client boundaries.
20. Design the exported API for long-term stability.

## When to Use

Use a Context Module when:

* A capability must be consumed by multiple descendants.
* The capability has a clear ownership boundary.
* Provider and consumer logic should evolve together.
* The raw Context object should remain an implementation detail.
* A feature needs scoped client-side state.
* A dependency needs to be injected through the React tree.
* The consumer API should be semantic rather than tied to Context mechanics.
* Multiple consumer Hooks belong to the same capability.
* The implementation may evolve independently of consumers.

Typical examples include:

```tsx
useAuth()
useTheme()
useCart()
useFeatureFlags()
useAnalytics()
usePaymentClient()
useEditor()
```

provided each represents a coherent capability.

## When Not to Use

Do not introduce a Context Module when:

* A value has only one direct consumer.
* Props provide clearer ownership and data flow.
* The abstraction would merely wrap one trivial value.
* There is no meaningful shared capability.
* A module-level constant is sufficient.
* An external store already provides the correct ownership model.
* The Context would become a container for unrelated application state.
* The abstraction would hide dependencies rather than clarify them.

## Summary

The Context Module pattern packages a Context-based capability behind a coherent module boundary.

A typical module contains:

```tsx
const Context = createContext(...);

export function Provider(...) {
    // construct capability
}

export function useCapability() {
    // consume capability
}
```

Consumers depend on:

```tsx
<Provider>
    <Application/>
</Provider>
```

and:

```tsx
const capability = useCapability();
```

rather than directly depending on the raw Context object.

The Provider owns the value, the Context distributes it through the React tree, and the consumer Hook exposes the public
API.

The pattern is valuable because it turns Context from a low-level React mechanism into an encapsulated architectural
capability. It provides a stable boundary around state, dependencies, configuration, and other scoped values while
keeping their construction and distribution details private.

The Context Module should remain cohesive, narrowly scoped, and explicit about ownership. It should not become a generic
global-state container or a mega-provider. Its purpose is to package a meaningful capability behind a controlled
React-facing API.
