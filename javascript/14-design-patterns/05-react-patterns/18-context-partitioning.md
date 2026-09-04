# Context Partitioning

Context Partitioning is the practice of separating independently changing or independently consumed values into multiple
React Contexts instead of placing them into one broad Context.

The purpose is to reduce coupling between consumers and unrelated state. A component that depends only on one Context
should not be forced to subscribe to changes in an unrelated Context simply because both values were placed into the
same Provider.

## Intent

Partition Context state according to meaningful dependency boundaries so that Context consumers depend only on the
values relevant to them.

The pattern addresses a common problem with broad Context objects:

```tsx
type AppContextValue = {
    user: User | null;
    theme: Theme;
    locale: string;
    notifications: Notification[];
};
```

A component that only needs the theme still consumes the entire `AppContext` value.

Instead, the concerns can be separated:

```tsx
const AuthContext = createContext<AuthContextValue | null>(null);
const ThemeContext = createContext<ThemeContextValue | null>(null);
const LocaleContext = createContext<LocaleContextValue | null>(null);
const NotificationContext =
    createContext<NotificationContextValue | null>(null);
```

The partition is not primarily about creating more files or more Providers. It is about establishing independent Context
dependency boundaries.

## The Problem with Broad Contexts

A single Context can become a container for unrelated application state:

```tsx
type AppContextValue = {
    user: User | null;
    theme: Theme;
    locale: string;
    notifications: Notification[];
    cart: Cart;
    permissions: Permissions;
};
```

A Provider might then expose everything:

```tsx
<AppContext.Provider
    value={{
        user,
        theme,
        locale,
        notifications,
        cart,
        permissions,
    }}
>
    {children}
</AppContext.Provider>
```

This creates a large dependency surface.

A consumer reading:

```tsx
const {theme} = useAppContext();
```

is conceptually interested only in the theme, but its subscription is still to `AppContext`.

When the Provider supplies a new Context value, Context consumers are evaluated according to the Context's update
semantics. Selecting a property from the returned object does not turn the Context into a property-level subscription
mechanism.

The following does not solve the underlying coupling:

```tsx
const {theme} = useAppContext();
```

The consumer still consumes `AppContext`.

## Partitioning by Domain

The most common partitioning strategy is to create separate Contexts for separate domains.

```tsx
const AuthContext =
    createContext<AuthContextValue | null>(null);

const ThemeContext =
    createContext<ThemeContextValue | null>(null);

const LocaleContext =
    createContext<LocaleContextValue | null>(null);
```

Providers can then expose those domains independently:

```tsx
<AuthProvider>
    <ThemeProvider>
        <LocaleProvider>
            <Application/>
        </LocaleProvider>
    </ThemeProvider>
</AuthProvider>
```

A component requiring only authentication consumes the authentication Context.

```tsx
const {user} = useAuth();
```

A component requiring only the theme consumes the theme Context.

```tsx
const {theme} = useTheme();
```

The dependency boundaries now correspond to the actual application concerns.

## Partitioning by Update Frequency

Domain boundaries are not the only reason to partition Context.

Values with significantly different update frequencies can also warrant separate Contexts.

Consider:

```tsx
type AppContextValue = {
    user: User;
    notifications: Notification[];
};
```

If notifications change frequently while the authenticated user changes rarely, placing both values in the same Context
creates unnecessary coupling between consumers.

Partitioning them allows:

```tsx
const UserContext = createContext<UserContextValue | null>(null);

const NotificationContext =
    createContext<NotificationContextValue | null>(null);
```

The partition reflects different change characteristics as well as different responsibilities.

Update frequency alone should not determine architecture, however. A Context should represent a meaningful dependency
boundary rather than being split mechanically whenever one property changes.

## Partitioning by Consumer Set

Another useful criterion is the set of components that consume a value.

Suppose:

```tsx
type DashboardContextValue = {
    currentUser: User;
    dashboardFilters: Filters;
    realtimeMetrics: Metrics;
};
```

If `currentUser` is required across the application while `realtimeMetrics` is used only by dashboard widgets, combining
them creates a broader dependency boundary than necessary.

The values can instead be separated according to their consumer populations:

```tsx
const UserContext = createContext<UserContextValue | null>(null);

const DashboardFiltersContext =
    createContext<DashboardFiltersContextValue | null>(null);

const MetricsContext =
    createContext<MetricsContextValue | null>(null);
```

Partitioning is therefore also a way of expressing which parts of an application depend on which state.

## Partitioning State and Actions

A Context containing both state and actions can itself become broad.

For example:

```tsx
type EditorContextValue = {
    document: Document;
    selection: Selection;
    updateDocument(document: Document): void;
    setSelection(selection: Selection): void;
};
```

If the state has different consumers and update characteristics, it can sometimes be partitioned:

```tsx
const DocumentContext =
    createContext<Document | null>(null);

const DocumentActionsContext =
    createContext<DocumentActions | null>(null);

const SelectionContext =
    createContext<Selection | null>(null);
```

This is a more advanced partitioning strategy.

It should not be applied automatically. Splitting every state value and every action into separate Contexts can make the
component tree and Provider composition unnecessarily complex.

The correct boundary is the smallest meaningful dependency boundary, not necessarily the smallest possible data unit.

## Partitioning Does Not Mean One Context per Property

This is excessive:

```tsx
const UserNameContext = createContext<string | null>(null);
const UserEmailContext = createContext<string | null>(null);
const UserAvatarContext = createContext<string | null>(null);
const UserRoleContext = createContext<string | null>(null);
```

If these values form one coherent user dependency, they generally belong together:

```tsx
type UserContextValue = {
    name: string;
    email: string;
    avatar: string;
    role: string;
};
```

The objective is not maximum fragmentation.

The objective is meaningful separation.

## Provider Composition

Partitioning naturally produces multiple Providers.

```tsx
<AuthProvider>
    <ThemeProvider>
        <LocaleProvider>
            <NotificationProvider>
                <Application/>
            </NotificationProvider>
        </LocaleProvider>
    </ThemeProvider>
</AuthProvider>
```

This is not inherently a problem. Each Provider represents an independent scoped dependency.

However, excessive partitioning can produce deeply nested Provider trees that become difficult to understand and
maintain.

Provider Composition can be used to organize independent Providers without combining their underlying Context values.

```tsx
function AppProviders({children}: Props) {
    return (
        <AuthProvider>
            <ThemeProvider>
                <LocaleProvider>
                    {children}
                </LocaleProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
```

The Providers remain independent even though their composition is centralized.

## Provider Scope

Partitioning also allows different scopes for different values.

A global authentication dependency might wrap the entire application:

```tsx
<AuthProvider>
    <Application/>
</AuthProvider>
```

A feature-specific Context can be scoped more narrowly:

```tsx
<AuthProvider>
    <Application>
        <CheckoutProvider>
            <Checkout/>
        </CheckoutProvider>
    </Application>
</AuthProvider>
```

The checkout state does not need to become part of the global application Context merely because authentication is
global.

This preserves ownership and limits the lifetime of the dependency.

## Feature-Level Partitioning

Context can be partitioned according to feature boundaries.

```tsx
function CheckoutProviders({children}: Props) {
    return (
        <CheckoutProvider>
            <PaymentProvider>
                {children}
            </PaymentProvider>
        </CheckoutProvider>
    );
}
```

The resulting Contexts belong to the checkout feature rather than to a generic application-wide state object.

This makes feature dependencies more explicit and reduces the tendency to create a universal `AppContext`.

## Context Value Identity

Partitioning is particularly useful when Context values are independently updated.

Consider:

```tsx
<AppContext.Provider
    value={{
        user,
        notifications,
    }}
>
    {children}
</AppContext.Provider>
```

When the Provider produces a new value object, consumers of the Context are subject to the Context update.

Partitioning gives separate Providers:

```tsx
<UserProvider>
    <NotificationProvider>
        {children}
    </NotificationProvider>
</UserProvider>
```

Now user consumers and notification consumers have separate Context boundaries.

This does not eliminate all rerenders or guarantee a particular rendering behavior. It establishes narrower subscription
boundaries.

Context value identity remains an important concern within each individual Context.

## Stable Context Values

Partitioning should not be used as a substitute for correctly managing Context value identity.

For example:

```tsx
<ThemeContext.Provider
    value={{
        theme,
        setTheme,
    }}
>
    {children}
</ThemeContext.Provider>
```

The object is recreated during Provider renders.

Depending on the Provider implementation, this can cause Context updates even when the underlying values have not
meaningfully changed.

The Provider's value identity and memoization strategy are separate concerns from partitioning.

Partitioning determines what belongs together. Value identity determines when a particular Context value is considered
changed.

## Partitioning and Selective Consumption

Context Partitioning and selector-based consumption solve related but different problems.

Partitioning creates multiple independent Context boundaries:

```tsx
const UserContext = createContext(...);
const ThemeContext = createContext(...);
```

Selector-based consumption keeps a Context but allows consumers to subscribe to a selected portion of its value.

```tsx
const userName = useUserSelector(
    (user) => user.name,
);
```

Partitioning is appropriate when values represent genuinely separate dependency boundaries.

Selectors can be appropriate when values belong together conceptually but consumers need finer-grained subscription
behavior.

They can also be combined.

## Partitioning and Custom Hooks

Each Context can expose its own Context Custom Hook:

```tsx
export function useUser() {
    const context = useContext(UserContext);

    if (context === null) {
        throw new Error("useUser requires UserProvider");
    }

    return context;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === null) {
        throw new Error("useTheme requires ThemeProvider");
    }

    return context;
}
```

The custom Hooks provide the consumer API.

The partitioning decision is the separation of `UserContext` and `ThemeContext`.

The two patterns are therefore complementary but distinct.

## Partitioning and Reducers

A reducer can manage a coherent domain while Context distributes its resulting state.

For example:

```tsx
function EditorProvider({children}: Props) {
    const [state, dispatch] = useReducer(
        editorReducer,
        initialEditorState,
    );

    return (
        <EditorContext.Provider value={{state, dispatch}}>
            {children}
        </EditorContext.Provider>
    );
}
```

If the reducer contains multiple unrelated domains, Context partitioning may indicate that the state itself should be
reconsidered.

However, partitioning Context does not require partitioning the underlying reducer. The two decisions concern different
boundaries.

A single reducer can produce a coherent domain value distributed through several carefully designed Contexts when that
architecture is justified.

## Partitioning and State Ownership

Context Partitioning does not determine who owns state.

A Provider might own:

```tsx
const [theme, setTheme] = useState(defaultTheme);
```

and distribute it through `ThemeContext`.

Another Provider might receive its value from a higher-level owner:

```tsx
function ThemeProvider({
                           theme,
                           children,
                       }: Props) {
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}
```

In both cases, the Context boundary is independent from the underlying state ownership model.

State Colocation and State Lifting determine where state should live.

Context Partitioning determines how independently meaningful dependencies are distributed through the tree.

## Partitioning and Dependency Direction

A broad Context can create architectural coupling between otherwise unrelated features.

For example:

```tsx
type AppContext = {
    auth: AuthState;
    checkout: CheckoutState;
    editor: EditorState;
    analytics: AnalyticsState;
};
```

Now the Context becomes an integration point between all four domains.

Partitioning creates narrower dependency directions:

```tsx
AuthContext
CheckoutContext
EditorContext
AnalyticsContext
```

A checkout component can depend on checkout state without acquiring an architectural dependency on editor state.

This makes the Context boundary closer to the domain boundary.

## Cross-Domain Dependencies

Partitioning does not mean domains can never depend on each other.

For example, checkout may legitimately require the authenticated user.

```tsx
function CheckoutProvider({children}: Props) {
    const {user} = useUser();

    // ...
}
```

The dependency is explicit.

It is preferable to combining authentication and checkout into a single Context merely because one depends on the other.

A dependency between independently owned contexts is often clearer than a single Context that merges both domains.

## Avoiding Context Fragmentation

Context should be partitioned when there is a meaningful reason.

Signs that partitioning may be appropriate include:

* unrelated state is accumulating in one Context;
* different groups of consumers use different portions of the value;
* independently changing domains are coupled to the same Context;
* a Context is becoming a global application state container;
* feature-specific state is being exposed globally;
* changes to one domain unnecessarily affect consumers of another domain;
* the Context's API is becoming difficult to understand.

Signs of excessive partitioning include:

* Contexts represent individual primitive properties rather than coherent concepts;
* Providers exist solely to avoid a theoretical rerender;
* consumers require several Contexts to reconstruct what is really one domain object;
* Provider nesting becomes difficult to understand;
* the partition provides no meaningful architectural or subscription boundary.

## A Practical Boundary

A useful Context boundary generally answers a coherent question.

Examples include:

```tsx
useAuth()
useTheme()
useLocale()
useCart()
useCheckout()
useEditor()
useNotifications()
```

Each represents a recognizable dependency.

A less useful boundary might be:

```tsx
useUserName()
useUserEmail()
useUserRole()
useUserAvatar()
```

when all four values are inherently part of the same user dependency.

The boundary should follow the semantics and lifecycle of the dependency rather than the number of properties in the
object.

## Testing

Partitioned Contexts make test dependencies more explicit.

A component that consumes only authentication can be tested with only the authentication Provider:

```tsx
render(
    <AuthProvider>
        <AccountMenu/>
    </AuthProvider>,
);
```

It does not need unrelated Providers merely because those values happen to coexist in a broad `AppContext`.

A feature that requires several independent dependencies can explicitly compose them:

```tsx
render(
    <AuthProvider>
        <CheckoutProvider>
            <Checkout/>
        </CheckoutProvider>
    </AuthProvider>,
);
```

This makes the component's Context dependencies visible in the test setup.

## Common Misuse

A common misuse is creating an `AppContext` simply because it is convenient:

```tsx
const AppContext = createContext({
    user: null,
    theme: defaultTheme,
    locale: "en",
    notifications: [],
    cart: [],
});
```

This turns Context into a general-purpose state container.

Another misuse is splitting Contexts exclusively for performance without establishing meaningful boundaries:

```tsx
const FirstNameContext = createContext("");
const LastNameContext = createContext("");
const AgeContext = createContext(0);
```

This can make the architecture more complex without producing a useful dependency model.

Another misuse is creating a large number of Contexts and then recombining them through one mega-Hook:

```tsx
function useApplication() {
    return {
        user: useUser(),
        theme: useTheme(),
        locale: useLocale(),
        cart: useCart(),
        notifications: useNotifications(),
    };
}
```

This recreates the broad dependency surface at the consumer API level.

Another misuse is assuming that destructuring solves Context subscription granularity:

```tsx
const {theme} = useAppContext();
```

Property selection after Context consumption does not itself provide selective subscription.

## Advantages

Context Partitioning establishes narrower dependency boundaries, reduces coupling between unrelated state, supports
feature-specific scope, and can reduce unnecessary Context-driven updates between independent domains.

It also makes architectural dependencies easier to understand. A component consuming `useTheme()` communicates a
different dependency from one consuming `useAuth()`.

Partitioning can improve testing because components can be provided only with the Contexts they actually require.

## Disadvantages

More Contexts generally mean more Providers, more APIs, and more architectural decisions.

Excessive partitioning can make the component tree difficult to reason about and can force consumers to coordinate many
independent dependencies.

Partitioning also does not solve every Context performance problem. Context value identity, Provider rendering, and
subscription granularity remain separate concerns.

## When to Use

Use Context Partitioning when one Context contains independently meaningful domains, when unrelated consumers are
coupled to the same Context, when values have substantially different update characteristics, when feature state is
being exposed more broadly than necessary, or when a Context is becoming a general-purpose application state container.

The strongest reason to partition is the existence of a meaningful dependency boundary. Performance improvements are a
useful consequence when they follow from that boundary, but they should not be the only architectural justification.

## When Not to Use

Do not partition a Context merely because it contains several properties.

Keep related values together when they represent one coherent dependency, have the same ownership and lifecycle, and are
normally consumed together.

Do not create one Context per property or one Provider per primitive value without a concrete architectural reason.

## Relationship to Other Patterns

The Context Provider defines how a Context value is supplied and scoped.

The Context Custom Hook defines how consumers access a Context and can enforce its provider contract.

Provider Composition organizes multiple independent Providers without merging their Context values.

State Colocation determines where state should live before Context distribution is considered.

State Lifting moves shared state to a common owner; Context Partitioning determines how independently meaningful
portions of that state are distributed.

Selector-based consumption provides finer-grained subscription semantics within a Context and is an alternative or
complement to partitioning.

External Store patterns provide subscription models outside React Context when Context is not an appropriate
state-distribution mechanism.

Dependency Injection through Context can use partitioned Contexts to represent independent dependencies.

## Summary

Context Partitioning separates independently meaningful dependencies into independent Context boundaries.

The key distinction is between:

```tsx
const AppContext = createContext({
    user,
    theme,
    notifications,
});
```

and:

```tsx
const UserContext = createContext(user);
const ThemeContext = createContext(theme);
const NotificationContext = createContext(notifications);
```

The latter allows each dependency to have its own Provider, scope, consumer set, lifecycle, and update boundary.

The objective is not to maximize the number of Contexts. It is to make Context boundaries correspond to meaningful
architectural boundaries so that components consume the dependencies they actually require.
