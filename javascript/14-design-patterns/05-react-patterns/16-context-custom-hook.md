# Context Custom Hook

A Context Custom Hook is a custom React Hook that provides the consumer-facing API for a Context value. It encapsulates
`useContext`, centralizes access to the Context, and can enforce the Context's provider contract.

The pattern separates the mechanism used to consume a Context from the API exposed to application code. Consumers call a
domain-specific Hook such as `useAuth()`, `useTheme()`, or `useCart()` instead of importing and reading the underlying
Context directly.

## Intent

Provide a stable, domain-specific consumption API for a React Context while keeping the Context implementation detail
out of consumers.

A Context Custom Hook is particularly useful when Context access has a contract that should be enforced consistently.
The Hook can validate that a provider exists, normalize the returned value, expose only the intended consumer API, or
combine several closely related Context values.

## Structure

The pattern has three primary elements:

* a Context containing the shared value;
* a Provider responsible for supplying that value;
* a custom Hook responsible for consuming and validating the Context.

```tsx
import {createContext, useContext} from "react";

type AuthContextValue = {
    user: User | null;
    signIn(): void;
    signOut(): void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const value = useAuthValue();

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
```

Consumers now depend on `useAuth()` rather than on `AuthContext`.

```tsx
function AccountMenu() {
    const {user, signOut} = useAuth();

    if (!user) {
        return null;
    }

    return (
        <button onClick={signOut}>
            Sign out {user.name}
        </button>
    );
}
```

The consumer knows that it needs authentication context, but does not need to know how that dependency is represented or
retrieved.

## Context Encapsulation

Direct Context consumption exposes the Context object as part of the application API.

```tsx
const user = useContext(UserContext);
```

Every consumer must then know:

* which Context to import;
* how the Context is typed;
* whether the value can be `null` or `undefined`;
* whether a Provider is required;
* what error should occur when the Provider is missing;
* whether the raw Context value should be transformed before use.

A Context Custom Hook centralizes those decisions.

```tsx
const user = useUser();
```

The consumer API becomes semantic rather than infrastructural. The consumer requests the dependency it needs instead of
interacting with the Context mechanism directly.

## Required Contexts

A common use of the pattern is enforcing that a Context must have a Provider.

A Context can use `null` as a sentinel value:

```tsx
const ThemeContext = createContext<ThemeContextValue | null>(null);
```

The custom Hook validates the sentinel:

```tsx
export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);

    if (context === null) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}
```

This converts an invalid component-tree configuration into an immediate, descriptive failure.

Without the custom Hook, every consumer might need to handle the nullable type:

```tsx
const theme = useContext(ThemeContext);

if (!theme) {
    // What should happen here?
}
```

The required-provider contract instead becomes part of the Context's consumer API.

## Why Use `null` as the Sentinel

A required Context should generally have a default value that cannot be confused with a legitimate Context value.

```tsx
const AuthContext = createContext<AuthContextValue | null>(null);
```

The distinction is important because the Context's default value is returned when no matching Provider exists.

Using a fabricated default object can hide configuration errors:

```tsx
const AuthContext = createContext<AuthContextValue>({
    user: null,
    signIn() {
    },
    signOut() {
    },
});
```

A component rendered outside `AuthProvider` now appears to have a valid authentication dependency even though the
provider is missing.

A `null` sentinel makes the invalid configuration observable.

## Provider and Consumer Responsibilities

The Provider and Context Custom Hook have different responsibilities.

The Provider owns value creation and distribution.

```tsx
function CartProvider({children}: Props) {
    const [items, dispatch] = useReducer(cartReducer, []);

    const value = {
        items,
        dispatch,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
```

The Context Custom Hook owns consumer access.

```tsx
function useCart() {
    const context = useContext(CartContext);

    if (context === null) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
}
```

The distinction is important. The custom Hook should not become responsible for constructing the shared state merely
because it consumes that state.

## Hiding the Context Object

A Context Custom Hook can keep the Context object module-private.

```tsx
const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({children}: Props) {
    // ...
}

export function useUser() {
    const context = useContext(UserContext);

    if (context === null) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}
```

The module exports the Provider and Hook but does not need to export `UserContext`.

This creates a deliberate public API:

```tsx
<UserProvider>
    <Application/>
</UserProvider>
```

and:

```tsx
const user = useUser();
```

Rather than:

```tsx
const user = useContext(UserContext);
```

The underlying Context implementation can therefore change without requiring every consumer to change with it.

## Domain-Specific APIs

The Hook name should describe the dependency represented by the Context.

```tsx
useAuth();
useTheme();
useLocale();
useCart();
useCurrentUser();
usePermissions();
useFormContext();
```

The consumer should not need to understand the implementation mechanism.

Poor abstraction:

```tsx
useContextWrapper(AuthContext);
```

Better abstraction:

```tsx
useAuth();
```

The Hook becomes part of the domain API rather than merely a generic wrapper around a React primitive.

## Returning the Context Value

The simplest Context Custom Hook returns the Context value unchanged.

```tsx
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
```

This is appropriate when the Context value already represents the intended consumer API.

The Hook does not need to transform a value merely to justify its existence. Provider validation and Context
encapsulation are already useful responsibilities.

## Returning a Restricted API

The Hook can expose only the operations consumers should use.

```tsx
type InternalAuthContext = {
    user: User | null;
    setUser(user: User | null): void;
    signIn(): Promise<void>;
    signOut(): Promise<void>;
};

const AuthContext = createContext<InternalAuthContext | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return {
        user: context.user,
        signIn: context.signIn,
        signOut: context.signOut,
    };
}
```

This can be useful when the Provider needs internal operations that should not become part of the consumer contract.

However, the restriction should represent a meaningful boundary. Arbitrarily copying or reshaping every property adds
maintenance without necessarily improving encapsulation.

## Returning Individual Values

A Context Custom Hook can expose a focused value rather than the entire Context object.

```tsx
export function useCurrentUser(): User | null {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error("useCurrentUser must be used within an AuthProvider");
    }

    return context.user;
}
```

This can produce a convenient API:

```tsx
const user = useCurrentUser();
```

However, multiple Hooks that independently consume the same Context do not provide Context-level subscription isolation.
Components using any of them still consume the underlying Context value.

If the goal is render isolation through selective subscriptions, that is a separate concern belonging to Context
partitioning or selector-based state access.

## Optional Contexts

Not every Context requires a Provider.

An optional Context can intentionally expose `undefined`:

```tsx
const TooltipContext = createContext<TooltipContextValue | undefined>(
    undefined,
);

export function useOptionalTooltip() {
    return useContext(TooltipContext);
}
```

The consumer can then handle absence explicitly:

```tsx
const tooltip = useOptionalTooltip();

if (tooltip) {
    tooltip.register(element);
}
```

This is different from a required Context.

A required Hook should fail when the Provider is absent:

```tsx
useTooltip();
```

An optional Hook should represent absence as a legitimate state:

```tsx
useOptionalTooltip();
```

The API should make this distinction intentional rather than forcing every consumer to discover the Provider requirement
through runtime behavior.

## Separate Required and Optional Hooks

When both access modes are useful, they can be exposed explicitly.

```tsx
export function useOptionalModal() {
    return useContext(ModalContext);
}

export function useModal(): ModalContextValue {
    const context = useContext(ModalContext);

    if (context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }

    return context;
}
```

This avoids ambiguity.

A consumer that requires the dependency expresses that requirement directly:

```tsx
const modal = useModal();
```

A consumer that can function without it expresses that explicitly:

```tsx
const modal = useOptionalModal();
```

## TypeScript

The Context Custom Hook is particularly valuable for removing nullable or optional Context types from consumers.

```tsx
type SettingsContextValue = {
    locale: string;
    timezone: string;
};

const SettingsContext =
    createContext<SettingsContextValue | undefined>(undefined);

export function useSettings(): SettingsContextValue {
    const context = useContext(SettingsContext);

    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }

    return context;
}
```

Consumers receive the non-nullable type:

```tsx
function DateDisplay() {
    const {timezone} = useSettings();

    return <span>{timezone}</span>;
}
```

The invalid state has been handled at the boundary instead of propagated through the application.

## Generic Required-Context Utility

Projects with many required Contexts can centralize the repeated validation logic.

```tsx
import {
    createContext,
    useContext,
    type Context,
    type Provider,
    type ReactNode,
} from "react";

function createRequiredContext<T>() {
    const context = createContext<T | undefined>(undefined);

    function useRequiredContext(): T {
        const value = useContext(context);

        if (value === undefined) {
            throw new Error("Context Provider is missing");
        }

        return value;
    }

    return [context, useRequiredContext] as const;
}
```

A domain module can then define its Context and Hook together:

```tsx
const [AuthContext, useAuth] =
    createRequiredContext<AuthContextValue>();
```

The domain-specific Hook remains the consumer API.

The generic utility should remain an implementation mechanism. It should not force every Context to use the same error
message, optionality semantics, or public API shape when those differences matter.

## Custom Error Messages

A generic helper can accept a descriptive name:

```tsx
function createRequiredContext<T>(name: string) {
    const context = createContext<T | undefined>(undefined);

    function useRequiredContext(): T {
        const value = useContext(context);

        if (value === undefined) {
            throw new Error(`${name} must be used within its Provider`);
        }

        return value;
    }

    return [context, useRequiredContext] as const;
}
```

Then:

```tsx
const [AuthContext, useAuth] =
    createRequiredContext<AuthContextValue>("useAuth");
```

The resulting failure identifies the consumer API rather than exposing implementation details.

## Combining Contexts

A Context Custom Hook can consume multiple related Contexts when those dependencies form one coherent domain API.

```tsx
const SessionContext =
    createContext<SessionContextValue | null>(null);

const PermissionsContext =
    createContext<PermissionsContextValue | null>(null);

export function useSession() {
    const session = useContext(SessionContext);
    const permissions = useContext(PermissionsContext);

    if (session === null) {
        throw new Error("useSession requires SessionProvider");
    }

    if (permissions === null) {
        throw new Error("useSession requires PermissionsProvider");
    }

    return {
        user: session.user,
        signOut: session.signOut,
        can: permissions.can,
    };
}
```

This can provide a useful domain facade when the contexts are intrinsically related.

It should not become a mechanism for collecting unrelated dependencies:

```tsx
useApplicationContext();
```

that internally consumes authentication, routing, localization, feature flags, notifications, forms, analytics, and
every other application service.

Such a Hook creates a large implicit dependency surface and couples consumers to unrelated providers.

## Multiple Contexts and Provider Ordering

When a custom Hook consumes multiple Contexts, the required Provider relationships become part of its contract.

```tsx
function useCheckout() {
    const cart = useCart();
    const user = useUser();
    const payment = usePayment();

    return {
        cart,
        user,
        payment,
    };
}
```

The consumer sees a single semantic dependency:

```tsx
const checkout = useCheckout();
```

But the component now requires all three underlying providers.

This is appropriate when the combination represents a meaningful domain abstraction. Otherwise, consumers should request
individual dependencies directly.

## Context Custom Hook and Provider Nesting

`useContext` resolves the nearest matching Provider in the component ancestry.

```tsx
function Component() {
    const theme = useTheme();

    // ...
}
```

The custom Hook does not alter that resolution behavior. It simply provides the consumer-side abstraction around it.

This makes the Hook work naturally with nested providers:

```tsx
<ThemeProvider value={outerTheme}>
    <Page/>

    <ThemeProvider value={innerTheme}>
        <EmbeddedApplication/>
    </ThemeProvider>
</ThemeProvider>
```

A component inside `EmbeddedApplication` calling `useTheme()` receives the nearest applicable Context value.

Provider scope remains a responsibility of the Provider architecture. The custom Hook should not attempt to manually
determine or manage provider hierarchy.

## Context Custom Hook and State Ownership

The custom Hook does not inherently own state.

For example:

```tsx
function useCart() {
    const context = useContext(CartContext);

    if (context === null) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
}
```

The state is owned by the Provider:

```tsx
function CartProvider({children}: Props) {
    const [items, dispatch] = useReducer(cartReducer, []);

    return (
        <CartContext.Provider value={{items, dispatch}}>
            {children}
        </CartContext.Provider>
    );
}
```

This distinction prevents a common misunderstanding: wrapping `useContext` in a custom Hook does not make the Context
state local to each consumer.

Every consumer of the same Provider reads the same distributed value.

## Context Custom Hook and Custom Hooks

A Context Custom Hook is a specialization of the broader Custom Hook technique.

A generic custom Hook can compose arbitrary React behavior:

```tsx
function useWindowSize() {
    // ...
}
```

A Context Custom Hook specifically provides access to an existing Context:

```tsx
function useAuth() {
    return useContext(AuthContext);
}
```

The distinguishing dependency is therefore the Context.

The broader Custom Hook pattern owns the abstraction of reusable React behavior. The Context Custom Hook pattern owns
the abstraction of Context consumption.

## Context Custom Hook and Provider

The two patterns are complementary rather than interchangeable.

The Provider defines:

* where the value exists;
* how the value is created;
* how long the value lives;
* which subtree receives it;
* how the value changes.

The custom Hook defines:

* how consumers access the value;
* whether provider presence is required;
* what consumer-facing API is exposed;
* what validation occurs at the consumption boundary.

A Provider can exist without a custom Hook, but the custom Hook is useful when direct Context consumption would
otherwise leak implementation details or repeat validation logic.

## Context Custom Hook and Context Partitioning

Wrapping Context consumption in a custom Hook does not partition Context state.

For example:

```tsx
function useUser() {
    const context = useContext(UserContext);

    if (context === null) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}
```

This is a consumer abstraction.

Partitioning Context means deliberately separating independently changing values into different Contexts so that
unrelated consumers are not coupled to the same Context update.

These concerns can be combined:

```tsx
const useUser = /* consumer API for UserContext */;
const usePermissions = /* consumer API for PermissionsContext */;
```

But the partitioning itself is a separate architectural decision.

## Context Custom Hook and Selector APIs

A custom Hook can expose a convenient domain-specific value:

```tsx
const user = useUser();
```

It does not, by itself, provide selective Context subscriptions.

A Hook such as:

```tsx
const name = useUserSelector((user) => user.name);
```

introduces a selector-based consumption mechanism with different subscription semantics.

That is a separate pattern. The Context Custom Hook should not be described as a selector merely because it returns one
property from a Context.

## Testing

The custom Hook provides a natural boundary for testing Context consumers.

A component can be rendered with the real Provider:

```tsx
render(
    <AuthProvider>
        <AccountMenu/>
    </AuthProvider>,
);
```

A test can also provide a specialized Provider configuration when the Provider supports it:

```tsx
render(
    <AuthContext.Provider value={mockAuth}>
        <AccountMenu/>
    </AuthContext.Provider>,
);
```

If the Context object is intentionally private, tests should generally use the Provider's public test configuration
rather than reaching into implementation details.

The missing-provider contract should also be tested.

```tsx
expect(() => renderHook(() => useAuth())).toThrow(
    "useAuth must be used within an AuthProvider",
);
```

The exact testing API depends on the project's React testing stack, but the important contract is that invalid provider
placement fails predictably.

## Test Providers

For complex Context values, a dedicated test wrapper can simplify consumer tests.

```tsx
function TestAuthProvider({
                              children,
                              value = defaultAuth,
                          }: {
    children: React.ReactNode;
    value?: AuthContextValue;
}) {
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
```

Tests then express the dependency directly:

```tsx
render(
    <TestAuthProvider value={mockAuth}>
        <AccountMenu/>
    </TestAuthProvider>,
);
```

The test provider is useful when it represents a legitimate public or test-facing boundary. It should not become a
second implementation of the Provider's production behavior.

## Error Handling

Missing-provider errors should identify both the Hook and the required Provider.

Prefer:

```tsx
throw new Error(
    "useAuth must be used within an AuthProvider",
);
```

over:

```tsx
throw new Error("Context error");
```

The former identifies the violated contract immediately.

This is especially valuable in applications containing many Contexts because the error appears at the consumer boundary
rather than somewhere deep inside a component tree.

## Performance

The custom Hook itself does not make Context consumption more efficient.

```tsx
function useTheme() {
    return useContext(ThemeContext);
}
```

has the same underlying Context subscription behavior as directly calling:

```tsx
useContext(ThemeContext);
```

The abstraction improves API design, validation, encapsulation, and consistency. It should not be presented as a
performance optimization.

Performance concerns such as Context value identity, provider updates, Context partitioning, and selector-based
subscriptions belong to their respective patterns and mechanisms.

## Common Misuse

A Context Custom Hook becomes counterproductive when it merely renames `useContext` without providing a meaningful
abstraction.

This is technically valid:

```tsx
function useFoo() {
    return useContext(FooContext);
}
```

But if the Context is public, optional, trivial, and has no validation or domain semantics, the wrapper may add little
value.

Another misuse is hiding a required Provider behind a Hook that silently manufactures fallback state:

```tsx
function useAuth() {
    return useContext(AuthContext) ?? createAnonymousAuth();
}
```

This can transform a configuration error into incorrect application behavior.

Another misuse is turning one Hook into a global application dependency container:

```tsx
function useApplication() {
    // auth
    // router
    // theme
    // notifications
    // analytics
    // feature flags
    // data services
}
```

This produces a large coupling surface and makes component dependencies less precise.

Another misuse is using a Context Custom Hook as a substitute for proper Context partitioning:

```tsx
function useAppState() {
    const context = useContext(AppStateContext);

    return {
        user: context.user,
        theme: context.theme,
        notifications: context.notifications,
    };
}
```

Consumers may appear to have focused APIs while remaining coupled to a single broad Context.

## Advantages

A Context Custom Hook provides a consistent consumer API, hides the Context implementation detail, centralizes provider
validation, improves TypeScript ergonomics, and gives Context consumers domain-specific names.

It also establishes a natural place for consumer-side normalization or API shaping when such behavior is genuinely
required.

The pattern reduces repetitive code such as null checks and repeated error messages across consumers.

## Disadvantages

The pattern introduces another abstraction layer around an already simple React primitive. For trivial optional
Contexts, that abstraction may not provide enough value to justify itself.

A custom Hook can also create a false impression that Context consumption has different subscription or performance
semantics. It does not.

Poorly designed Hooks can additionally conceal dependencies, combine unrelated contexts, or expose an overly broad
application-level API.

## When to Use

Use a Context Custom Hook when Context consumers should have a domain-specific API, when a Context requires a Provider,
when missing-provider failures should be explicit, when the raw Context should remain an implementation detail, or when
consumer-side normalization provides a meaningful abstraction.

It is especially appropriate for Contexts representing stable application concepts such as authentication, localization,
theme, permissions, forms, or domain-specific shared state.

## When Not to Use

Direct `useContext` can be appropriate when the Context is intentionally part of the local module API, when the Context
is optional and trivial, or when wrapping it would provide no meaningful validation, abstraction, or API improvement.

Do not introduce a custom Hook solely because every Context must mechanically have one.

## Relationship to Other Patterns

Component Composition distributes dependencies through component structure rather than Context.

The Context Provider establishes the scope and supplies the shared value.

The Context Custom Hook establishes the consumer-facing access API.

Context Partitioning separates independently changing Context values to reduce coupling.

Provider Composition organizes multiple Providers into a coherent component-tree boundary.

Custom Hooks provide the general mechanism for reusable React behavior; the Context Custom Hook is specifically
concerned with consuming Context.

Dependency Injection through Context uses Context as an infrastructure-level dependency distribution mechanism; the
Context Custom Hook can provide the consumer-facing API for that dependency.

Selector-based Context access introduces selective consumption semantics and should not be conflated with merely
wrapping `useContext`.

## Summary

The Context Custom Hook pattern places a deliberate abstraction around Context consumption.

The fundamental implementation is small:

```tsx
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
```

Its architectural value comes from the boundary it establishes. Consumers depend on `useAuth()` rather than on the
representation of authentication as a React Context. The Hook centralizes the provider contract, keeps Context
implementation details private, improves type safety, and provides a stable domain-level API without changing the
underlying Context semantics.
