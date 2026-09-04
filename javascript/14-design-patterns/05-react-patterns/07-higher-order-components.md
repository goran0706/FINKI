# Higher-Order Components Pattern

The Higher-Order Component (HOC) pattern is a React composition pattern in which a function accepts a component and
returns a new component with additional behavior, data, or capabilities.

The defining characteristic is component transformation. A HOC does not modify the original component directly. Instead,
it creates a new component that wraps or otherwise enhances the supplied component.

```tsx
type WithLoadingProps = {
    loading: boolean;
};

function withLoading<P extends object>(
    Component: React.ComponentType<P>,
) {
    return function WithLoading(
        props: P & WithLoadingProps,
    ) {
        if (props.loading) {
            return <Spinner/>;
        }

        return <Component {...props} />;
    };
}
```

The original component remains unchanged:

```tsx
function UserList({users}: { users: User[] }) {
    return (
        <ul>
            {users.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}

const UserListWithLoading = withLoading(UserList);
```

The HOC creates a new component whose responsibility includes the additional behavior.

## Intent

Use a Higher-Order Component when a reusable concern should be applied by transforming one or more existing components
into enhanced components.

The pattern is particularly useful when the concern is orthogonal to the component's primary rendering responsibility
and can be expressed as a reusable wrapper.

Common concerns include:

* authorization;
* feature gating;
* subscription or entitlement checks;
* instrumentation;
* analytics;
* error handling;
* loading behavior;
* environment-specific behavior;
* legacy lifecycle integration;
* prop injection;
* external data subscription.

The central abstraction is:

```tsx
const EnhancedComponent = enhance(Component);
```

The function `enhance` is the HOC.

## Core Structure

A HOC has a higher-order function shape:

```tsx
type HOC = <P>(
    Component: React.ComponentType<P>,
) => React.ComponentType<P>;
```

A real HOC may change the component's external prop contract:

```tsx
type HOC = <InnerProps>(
    Component: React.ComponentType<InnerProps>,
) => React.ComponentType<OuterProps>;
```

The wrapper receives the consumer-facing props, performs its own logic, and decides how the wrapped component
participates in rendering.

```tsx
function withAuthentication<P extends object>(
    Component: React.ComponentType<P>,
) {
    return function AuthenticatedComponent(
        props: P,
    ) {
        const authenticated = useAuthentication();

        if (!authenticated) {
            return <Login/>;
        }

        return <Component {...props} />;
    };
}
```

The wrapped component remains responsible for its own UI. The HOC is responsible for the additional concern.

## Component Transformation

The most important distinction from ordinary component composition is that the HOC transforms a component definition
into another component.

```tsx
const Enhanced = withFeature(Component);
```

The transformation can be understood as producing a new component contract around the existing one.

The original component can still be used independently:

```tsx
<Component/>
```

while the enhanced version provides additional behavior:

```tsx
<Enhanced/>
```

This allows the same base component to participate in different enhancement pipelines.

## Prop Injection

A HOC can obtain information itself and inject it into the wrapped component.

```tsx
type InjectedProps = {
    currentUser: User;
};

function withCurrentUser<P extends InjectedProps>(
    Component: React.ComponentType<P>,
) {
    return function CurrentUserComponent(
        props: Omit<P, keyof InjectedProps>,
    ) {
        const currentUser = useCurrentUser();

        return (
            <Component
                {...props as P}
                currentUser={currentUser}
            />
        );
    };
}
```

The wrapped component requires `currentUser`, but the consumer of the enhanced component does not need to provide it.

```tsx
type ProfileProps = {
    currentUser: User;
};

function Profile({currentUser}: ProfileProps) {
    return <h1>{currentUser.name}</h1>;
}

const EnhancedProfile = withCurrentUser(Profile);

<EnhancedProfile/>;
```

This creates a distinction between internal component props and externally required props.

## Prop Transformation

A HOC can transform incoming props before passing them to the wrapped component.

```tsx
function withUppercaseName<P extends { name: string }>(
    Component: React.ComponentType<P>,
) {
    return function UppercaseName(
        props: P,
    ) {
        return (
            <Component
                {...props}
                name={props.name.toUpperCase()}
            />
        );
    };
}
```

The HOC should only transform props when that transformation is part of the abstraction's contract. Arbitrary prop
mutation makes HOCs difficult to reason about.

## Prop Consumption

A wrapper can consume props instead of forwarding them.

```tsx
type FeatureProps = {
    featureEnabled: boolean;
};

function withFeature<P extends object>(
    Component: React.ComponentType<P>,
) {
    return function FeatureComponent(
        props: P & FeatureProps,
    ) {
        if (!props.featureEnabled) {
            return null;
        }

        const {featureEnabled, ...componentProps} = props;

        return (
            <Component
                {...componentProps as P}
            />
        );
    };
}
```

This is useful when a prop exists specifically for the HOC and should not become part of the wrapped component's API.

Prop consumption should be deliberate. Accidentally swallowing props can create subtle integration failures.

## Pass-Through Props

A well-designed HOC generally forwards unrelated props unchanged.

```tsx
function withLoading<P extends object>(
    Component: React.ComponentType<P>,
) {
    return function LoadingComponent(
        props: P & { loading: boolean },
    ) {
        if (props.loading) {
            return <Spinner/>;
        }

        const {loading, ...rest} = props;

        return <Component {...rest as P} />;
    };
}
```

Consumers should not have to understand the HOC's internal implementation in order to pass normal component props.

## Display Names

HOCs can make React component trees difficult to identify during debugging.

A wrapper should therefore generally receive a descriptive display name.

```tsx
function withLoading<P extends object>(
    Component: React.ComponentType<P>,
) {
    function WithLoading(
        props: P & { loading: boolean },
    ) {
        if (props.loading) {
            return <Spinner/>;
        }

        const {loading, ...rest} = props;

        return <Component {...rest as P} />;
    }

    WithLoading.displayName =
        `WithLoading(${Component.displayName || Component.name || "Component"})`;

    return WithLoading;
}
```

Modern development tooling reduces some of the historical inconvenience, but descriptive component identity remains
useful for debugging and profiling.

## Composition of HOCs

HOCs can be composed so that multiple cross-cutting concerns are applied to the same component.

```tsx
const EnhancedComponent =
    withAuthentication(
        withAnalytics(
            withErrorHandling(Component),
        ),
    );
```

Each HOC receives the result of the previous transformation.

The order can matter.

```tsx
withAuthentication(
    withFeatureGate(Component),
);
```

is not necessarily equivalent to:

```tsx
withFeatureGate(
    withAuthentication(Component),
);
```

If one wrapper prevents rendering, supplies props, establishes context, or changes lifecycle behavior, the surrounding
HOC may observe different conditions depending on the composition order.

For larger pipelines, a composition helper can make the transformation more readable.

```tsx
const enhance = compose(
    withAuthentication,
    withAnalytics,
    withErrorHandling,
);

const EnhancedComponent = enhance(Component);
```

The composition function must define its application order explicitly.

## HOCs Should Be Pure Transformations

A HOC should generally behave as a component transformation rather than modifying the component it receives.

Avoid:

```tsx
function withFeature(Component: React.ComponentType<any>) {
    Component.prototype.someMethod = function () {
        // mutation
    };

    return Component;
}
```

Prefer:

```tsx
function withFeature<P extends object>(
    Component: React.ComponentType<P>,
) {
    return function EnhancedComponent(props: P) {
        // enhancement
        return <Component {...props} />;
    };
}
```

Mutating the supplied component introduces shared global behavior and makes the transformation difficult to reason
about.

A HOC should normally be composable, predictable, and safe to apply without changing the identity or behavior of the
original component.

## Do Not Create HOCs During Rendering

HOCs should generally be created outside a component's render function.

Avoid:

```tsx
function Page() {
    const Enhanced = withAuthentication(PageContent);

    return <Enhanced/>;
}
```

Each render creates a new component type.

React uses component identity as part of reconciliation. Repeatedly creating a new wrapper can cause the wrapped subtree
to be treated as a different component, leading to unnecessary remounting and loss of local state.

Create the enhanced component at module scope:

```tsx
const AuthenticatedPage =
    withAuthentication(PageContent);

function Page() {
    return <AuthenticatedPage/>;
}
```

The same principle applies to dynamically constructing HOC pipelines. Component transformation should normally happen
outside rendering.

## Ref Forwarding

Refs are not ordinary props. A HOC that wraps a component can therefore interrupt ref access unless it explicitly
supports ref forwarding.

```tsx
const InputWithFeature = withFeature(Input);
```

A consumer cannot automatically assume that:

```tsx
<InputWithFeature ref={inputRef}/>
```

will reference the underlying `Input`.

A HOC that needs to preserve ref behavior must explicitly use React's ref-forwarding mechanism.

```tsx
function withFocus<P extends object>(
    Component: React.ComponentType<P>,
) {
    return React.forwardRef<HTMLElement, P>(
        function WithFocus(props, ref) {
            return (
                <Component
                    {...props}
                    ref={ref}
                />
            );
        },
    );
}
```

The exact type and implementation depend on the wrapped component's ref contract.

Ref handling is therefore an important part of the HOC's public API rather than an implementation detail.

## Static Properties

Wrapping a component does not automatically copy static properties from the wrapped component.

```tsx
function Component() {
    return null;
}

Component.someStatic = value;

const Enhanced = withFeature(Component);
```

`Enhanced.someStatic` is not automatically equivalent to `Component.someStatic`.

If a codebase relies on static properties, the HOC must explicitly preserve or expose the required static API. Blindly
copying every property is unsafe because React and JavaScript objects can contain properties that should not be
transferred.

Modern React code generally favors ordinary functions and Hooks over static component APIs, but legacy and library code
can still encounter this issue.

## TypeScript

The simplest HOCs preserve the wrapped component's props.

```tsx
function withLogging<P extends object>(
    Component: React.ComponentType<P>,
): React.ComponentType<P> {
    return function LoggedComponent(props: P) {
        console.log(props);

        return <Component {...props} />;
    };
}
```

When the HOC injects props, the external contract should omit those injected properties.

```tsx
type InjectedProps = {
    user: User;
};

function withUser<P extends InjectedProps>(
    Component: React.ComponentType<P>,
): React.ComponentType<Omit<P, keyof InjectedProps>> {
    return function UserComponent(
        props: Omit<P, keyof InjectedProps>,
    ) {
        const user = useCurrentUser();

        return (
            <Component
                {...props as P}
                user={user}
            />
        );
    };
}
```

The type relationship is important because the purpose of prop injection is to change what the consumer must supply
without weakening the wrapped component's internal contract.

Complex HOCs can become difficult to type when they transform multiple prop groups, preserve refs, support generics, or
manipulate static properties. In those cases, the type complexity itself can be evidence that a different abstraction
would be clearer.

## Generic Wrapped Components

Generic component types can be difficult to preserve through HOC transformations.

```tsx
function List<T>({
                     items,
                     renderItem,
                 }: {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
}) {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>
                    {renderItem(item)}
                </li>
            ))}
        </ul>
    );
}
```

Wrapping such a component may cause generic inference to become less precise depending on the HOC's type signature.

This is one reason HOCs can introduce TypeScript complexity that does not exist when the reusable behavior is
represented as a Custom Hook.

## Hooks Inside HOCs

A HOC can use Hooks inside the component it returns.

```tsx
function withUser<P extends { user: User }>(
    Component: React.ComponentType<P>,
) {
    return function WithUser(
        props: Omit<P, "user">,
    ) {
        const user = useCurrentUser();

        return (
            <Component
                {...props as P}
                user={user}
            />
        );
    };
}
```

The Hooks belong to the generated wrapper component and therefore follow the Rules of Hooks normally.

The HOC itself is not a Hook. A naming convention such as `withUser` distinguishes the component-transforming API from a
hook such as `useUser`.

## HOCs and Hooks

HOCs and Custom Hooks can both encapsulate reusable behavior, but they operate at different abstraction levels.

A Custom Hook extracts stateful logic:

```tsx
function useAuthentication() {
    const user = useCurrentUser();

    return {
        user,
        authenticated: user !== null,
    };
}
```

A component consumes that logic directly:

```tsx
function Page() {
    const {authenticated} = useAuthentication();

    if (!authenticated) {
        return <Login/>;
    }

    return <Dashboard/>;
}
```

A HOC instead transforms the component:

```tsx
const ProtectedPage =
    withAuthentication(Page);
```

Custom Hooks generally provide more direct composition of behavior within function components. HOCs remain useful when
the desired abstraction is specifically component transformation, particularly in library code, compatibility layers, or
systems where enhancements are selected declaratively.

## HOCs and Render Props

Both patterns can separate reusable behavior from presentation, but they invert control differently.

A Render Prop receives a function that determines rendered output:

```tsx
<DataProvider>
    {(data) => <DataView data={data}/>}
</DataProvider>
```

A HOC receives a component and returns an enhanced component:

```tsx
const EnhancedDataView =
    withData(DataView);
```

Render Props expose the rendering decision at the usage site. HOCs encapsulate the enhancement into a new component
definition.

Render Props are therefore more explicit about the rendering relationship, while HOCs can make repeated enhancement
pipelines more declarative.

## HOCs and Component Composition

A HOC is itself built using ordinary component composition, but the two concepts are not equivalent.

Ordinary composition supplies components or elements as part of another component's API:

```tsx
<Card>
    <UserProfile/>
</Card>
```

A HOC transforms a component:

```tsx
const EnhancedProfile =
    withAuthentication(Profile);
```

Composition assembles a particular component tree. A HOC defines a reusable transformation that can be applied to many
component types.

## HOCs and Decorators

The terminology can overlap with the Decorator pattern because both involve wrapping an existing object or component
with additional behavior.

The React HOC pattern is specifically a higher-order function over components:

```tsx
const Enhanced = enhance(Component);
```

The resulting component has a React rendering contract.

The broader Decorator pattern is not inherently React-specific and is concerned with dynamically attaching
responsibilities while preserving an interface. A React HOC can therefore be understood as a React-specific component
transformation technique that has similarities to decoration without being identical to every use of the Decorator
pattern.

## HOCs and Context

A HOC can consume Context and use the resulting value to control or enhance a component.

```tsx
function withTheme<P extends object>(
    Component: React.ComponentType<P>,
) {
    return function ThemedComponent(props: P) {
        const theme = React.useContext(ThemeContext);

        return (
            <Component
                {...props}
                theme={theme}
            />
        );
    };
}
```

This allows a component that does not directly consume Context to receive the value through props.

The HOC therefore acts as an adapter between implicit Context access and an explicit component prop contract.

## Error Handling

A HOC can provide a reusable error-handling boundary around components.

For example, a HOC can transform a component into one that participates in an Error Boundary implementation.

```tsx
function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
) {
    return class WithErrorBoundary
        extends React.Component<P> {

        state = {
            hasError: false,
        };

        static getDerivedStateFromError() {
            return {
                hasError: true,
            };
        }

        render() {
            if (this.state.hasError) {
                return <ErrorFallback/>;
            }

            return <Component {...this.props} />;
        }
    };
}
```

The exact Error Boundary implementation is a separate concern. The HOC is responsible for applying that boundary as a
reusable component transformation.

## Authorization and Feature Gating

Authorization is a natural HOC use case when many components require the same rendering gate.

```tsx
function withAuthorization<P extends object>(
    Component: React.ComponentType<P>,
) {
    return function AuthorizedComponent(props: P) {
        const {authenticated, canAccess} =
            useAuthorization();

        if (!authenticated) {
            return <Login/>;
        }

        if (!canAccess) {
            return <Forbidden/>;
        }

        return <Component {...props} />;
    };
}
```

The same transformation can then be applied to multiple components.

```tsx
const ProtectedDashboard =
    withAuthorization(Dashboard);

const ProtectedReports =
    withAuthorization(Reports);
```

This is useful when the authorization policy is a cross-cutting component concern rather than something each component
should implement independently.

## Instrumentation

A HOC can surround a component with instrumentation logic.

```tsx
function withAnalytics<P extends object>(
    Component: React.ComponentType<P>,
) {
    return function AnalyticsComponent(props: P) {
        React.useEffect(() => {
            analytics.track("component-mounted", {
                component: Component.displayName ??
                    Component.name,
            });
        }, []);

        return <Component {...props} />;
    };
}
```

This allows instrumentation to be applied consistently without embedding analytics code into every component.

Care must be taken with effects, component identity, Strict Mode behavior, and the semantics of the instrumentation
system.

## Testing

A HOC should be tested independently from the components it enhances.

Tests should verify that:

* the wrapped component receives the expected props;
* injected props have the expected values;
* consumed props are not forwarded when they should remain internal;
* gating conditions render the correct fallback;
* ordinary props are preserved;
* ref behavior is preserved when supported;
* the wrapped component is rendered under the expected conditions.

For example:

```tsx
function Greeting({name}: { name: string }) {
    return <div>Hello {name}</div>;
}

const EnhancedGreeting =
    withLoading(Greeting);

render(
    <EnhancedGreeting
        name="Ada"
        loading={false}
    />,
);

expect(
    screen.getByText("Hello Ada"),
).toBeInTheDocument();
```

The wrapped component itself should continue to have its own focused tests. HOC tests should concentrate on the behavior
introduced by the transformation.

## Performance

A HOC introduces an additional component layer.

This can affect:

* component tree depth;
* debugging complexity;
* render boundaries;
* profiling visibility;
* prop propagation;
* memoization behavior.

The additional wrapper is not automatically a meaningful performance problem. The architectural benefit should determine
whether the layer is justified.

A HOC can also be combined with memoization:

```tsx
const Enhanced = withFeature(
    React.memo(Component),
);
```

or:

```tsx
const Enhanced = React.memo(
    withFeature(Component),
);
```

These are not necessarily equivalent because the memoization boundary is in a different position in the component
transformation.

Memoization should therefore be placed according to the intended prop comparison and rendering boundary rather than
applied mechanically.

## Common Misuses

Do not mutate the wrapped component.

Do not create HOCs during rendering.

Do not silently consume or overwrite unrelated props.

Do not expose injected implementation details as unnecessary public API.

Do not stack large numbers of opaque HOCs merely because each individual concern can technically be expressed as one.

Do not use a HOC solely because a component needs a small reusable piece of stateful logic when a Custom Hook provides a
simpler abstraction.

Do not assume refs or static properties automatically survive wrapping.

Do not hide substantial component-specific behavior inside a generic HOC. If the enhancement is meaningful only for one
component, a normal component abstraction may be clearer.

## Advantages

HOCs provide reusable component transformations. One enhancement can be applied consistently to many unrelated
components.

They are particularly effective for cross-cutting concerns that naturally surround a component, such as authorization,
instrumentation, compatibility behavior, and legacy integration.

They also allow enhancement pipelines to be defined once and reused:

```tsx
const enhance = compose(
    withAuthentication,
    withAnalytics,
    withErrorBoundary,
);
```

The original component remains available independently from the enhanced version.

## Disadvantages

HOCs introduce additional component layers and can obscure where behavior originates.

Composed HOCs can make prop ownership difficult to trace:

```tsx
const Enhanced =
    withA(
        withB(
            withC(Component),
        ),
    );
```

It may become unclear which wrapper injected a particular prop, consumed a value, or prevented rendering.

TypeScript becomes more complex when HOCs inject, remove, transform, or preserve generic props and refs.

HOCs can also create naming and debugging complexity because the component visible to React DevTools may be several
layers removed from the underlying component.

For many modern React use cases, Custom Hooks provide a more direct mechanism for sharing stateful behavior without
introducing wrapper components.

## When to Use

Use a Higher-Order Component when:

* the reusable abstraction is naturally a component transformation;
* the same cross-cutting concern applies to many components;
* the concern should surround the wrapped component;
* enhancement should be reusable and declaratively applied;
* compatibility with an existing HOC-oriented API is required;
* library or infrastructure code benefits from a component-level enhancement boundary.

Prefer another pattern when:

* only stateful logic needs to be shared;
* a Custom Hook can express the behavior directly;
* rendering needs to be explicitly controlled by the consumer;
* named insertion points are sufficient;
* a single ordinary wrapper component is clearer;
* the HOC would require complicated prop transformations or type machinery without providing a corresponding
  architectural benefit.

## Relationship to Other Patterns

Higher-Order Components are a React-specific form of component transformation. They accept a component and return
another component.

Component Composition assembles existing components. Render Props delegate rendering to a consumer-provided function.
Custom Hooks extract reusable stateful logic. Context provides implicit values to descendants. Slots provide named
structural insertion points.

The HOC's defining property is different from all of these: the abstraction is a reusable function that transforms a
component into an enhanced component.

```tsx
const EnhancedComponent = withFeature(Component);
```

The original component is not modified. The returned component carries the additional behavior.
