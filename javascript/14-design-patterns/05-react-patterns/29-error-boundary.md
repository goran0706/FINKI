# Error Boundary

An Error Boundary is a React component boundary that catches errors thrown during rendering, lifecycle execution, and
other React-managed work in a descendant subtree and replaces the failed subtree with fallback UI.

The pattern establishes an error-containment boundary between a potentially failing subtree and the rest of the
component tree.

An Error Boundary is therefore not a general JavaScript `try/catch` mechanism. Its purpose is to prevent a rendering
failure in one part of the React tree from necessarily bringing down the entire rendered interface.

## Intent

Contain rendering failures within a defined React subtree and provide a controlled fallback or recovery path.

The boundary establishes a failure boundary:

* descendants may fail;
* the boundary catches supported React errors;
* the failed subtree is replaced or suppressed;
* unrelated parts of the application can continue rendering;
* the user can potentially recover without leaving the surrounding application.

## Error Containment

Without an error boundary, an uncaught rendering error can propagate through the React tree and prevent the affected
application tree from rendering correctly.

An Error Boundary introduces an explicit containment point:

```tsx
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
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

        return this.props.children;
    }
}
```

The boundary does not repair the descendant that failed. It changes what the boundary renders after the failure.

## Boundary Ownership

An Error Boundary owns the failure behavior of its descendant subtree.

For example:

```tsx
<ErrorBoundary>
    <Dashboard/>
</ErrorBoundary>
```

means that the boundary is responsible for failures occurring within `Dashboard` and its supported descendants.

A more localized boundary can isolate only a feature:

```tsx
<Page>
    <Header/>

    <ErrorBoundary>
        <Recommendations/>
    </ErrorBoundary>

    <Footer/>
</Page>
```

If `Recommendations` fails, the surrounding page can remain available.

The placement of the boundary therefore determines the blast radius of a rendering failure.

## Boundary Granularity

A single application-wide boundary provides a final safety net:

```tsx
<ErrorBoundary>
    <App/>
</ErrorBoundary>
```

but it should not necessarily be the only boundary.

Feature-level boundaries can isolate independently recoverable parts of the interface:

```tsx
<ErrorBoundary>
    <Comments/>
</ErrorBoundary>

<ErrorBoundary>
    <Recommendations/>
</ErrorBoundary>

<ErrorBoundary>
    <ActivityFeed/>
</ErrorBoundary>
```

The appropriate granularity depends on whether the subtrees can meaningfully fail and recover independently.

A boundary should generally surround a meaningful failure domain rather than every individual component.

## Fallback UI

The fallback is the UI rendered after a supported error is captured.

```tsx
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
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
            return (
                <section>
                    <h2>Something went wrong.</h2>
                    <button onClick={() => this.setState({hasError: false})}>
                        Try again
                    </button>
                </section>
            );
        }

        return this.props.children;
    }
}
```

Fallback UI should represent the failure domain.

A page-level boundary may render a page-level recovery interface. A small widget boundary may render only a compact
error state.

The fallback should not assume that the failed subtree remains usable.

## Error Reporting

An Error Boundary can report captured errors to an external monitoring system.

For example:

```tsx
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        reportError(error, {
            componentStack: info.componentStack,
        });
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback/>;
        }

        return this.props.children;
    }
}
```

Error reporting and error presentation are separate concerns.

`getDerivedStateFromError` is appropriate for determining fallback rendering state. `componentDidCatch` is appropriate
for side effects such as logging.

Reporting should avoid exposing sensitive application data and should account for duplicate reports when the same
failure is observed through multiple mechanisms.

## Error Information

The boundary can receive the thrown error and React's component-stack information:

```tsx
componentDidCatch(error, info)
{
    console.error(error);
    console.error(info.componentStack);
}
```

The error object describes the thrown failure.

The component stack provides React-specific information about where the failure occurred in the rendered tree.

This information is useful for diagnostics and telemetry.

## Class-Based Boundary

React's built-in Error Boundary mechanism is implemented through class component lifecycle APIs.

The minimal form is:

```tsx
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
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

        return this.props.children;
    }
}
```

A boundary can additionally implement:

```tsx
componentDidCatch(error, info)
{
    reportError(error, info);
}
```

The boundary's state determines whether the normal subtree or fallback is rendered.

## Functional Components

A function component cannot itself become an Error Boundary merely by using a Hook.

This does not create a boundary:

```tsx
function ErrorBoundary({children}: Props) {
    const [hasError, setHasError] = useState(false);

    // This does not make the component a React Error Boundary.
}
```

Error Boundary semantics are provided by React's supported boundary mechanism, not by the existence of local state.

A functional fallback component can still be rendered by a class-based boundary:

```tsx
function ErrorFallback() {
    return <p>Unable to render this section.</p>;
}
```

Third-party abstractions can also provide function-oriented APIs while implementing the underlying boundary behavior
appropriately.

## Errors That Boundaries Catch

Error boundaries are intended to catch errors arising from React rendering and supported React lifecycle work in
descendant components.

For example:

```tsx
function UserCard() {
    throw new Error("Failed to render user card");
}
```

When rendered beneath a boundary:

```tsx
<ErrorBoundary>
    <UserCard/>
</ErrorBoundary>
```

the boundary can replace the failed subtree with its fallback.

Errors thrown while React is rendering descendants are the primary use case.

## Errors That Boundaries Do Not Catch

Error boundaries are not universal exception handlers.

They do not automatically catch every asynchronous or event-driven error.

For example:

```tsx
function Button() {
    const handleClick = () => {
        throw new Error("Click failed");
    };

    return <button onClick={handleClick}>Run</button>;
}
```

An Error Boundary should not be treated as a replacement for handling errors in event handlers.

Similarly, an arbitrary asynchronous operation:

```tsx
useEffect(() => {
    fetchData().then(() => {
        throw new Error("Async failure");
    });
}, []);
```

should not be assumed to become an Error Boundary failure merely because the effect belongs to the boundary's subtree.

Application code must explicitly handle asynchronous failures.

This distinction is important:

* rendering failure is a boundary concern;
* event-handler failure requires event-level handling;
* asynchronous operation failure requires asynchronous error handling;
* server-state failure belongs to the server-state lifecycle;
* process-level failures require infrastructure-level handling.

## Event Handler Errors

Event handlers should handle their own failures:

```tsx
function SaveButton() {
    const handleClick = async () => {
        try {
            await save();
        } catch (error) {
            showSaveError(error);
        }
    };

    return <button onClick={handleClick}>Save</button>;
}
```

An Error Boundary is not a substitute for this logic.

The event handler owns the operation and therefore should determine how an operation failure is represented.

## Asynchronous Errors

Asynchronous failures should be represented as state or handled through the abstraction that owns the asynchronous
operation.

For example:

```tsx
function SearchResults() {
    const {data, error} = useSearchResults();

    if (error) {
        return <SearchError/>;
    }

    return <Results data={data}/>;
}
```

The server-state or data-fetching layer can expose the error as part of its lifecycle.

An Error Boundary may still be useful if rendering the resulting error state itself fails, but that is a different
failure.

## Error Boundary vs Server-State Error

A failed network request is not automatically a rendering error.

For example:

```ts
const response = await fetch("/api/users");
```

returning a `500` response represents a remote operation failure.

The server-state layer can expose:

```ts
{
    data: undefined,
        error
}
```

The component can then render an appropriate state:

```tsx
if (error) {
    return <UserError/>;
}
```

The Error Boundary has a different role: it catches a failure in the React rendering path.

This separation prevents remote failures from being confused with component failures.

## Throwing Errors for Boundary Handling

A component can deliberately throw an error during rendering so that a boundary can provide the fallback.

For example:

```tsx
function UserPanel({user}: { user: User | undefined }) {
    if (!user) {
        throw new Error("User data is unavailable");
    }

    return <UserDetails user={user}/>;
}
```

This can be useful when the appropriate handling is to abandon rendering of the current subtree and delegate the failure
to a boundary.

Some asynchronous and server-state abstractions also provide mechanisms that surface asynchronous failures as
render-time errors specifically so that an Error Boundary can handle them.

That is an explicit integration between the asynchronous state abstraction and the boundary rather than an inherent
property of Error Boundaries.

## Fallback as a Component Boundary

The fallback itself renders outside the failed descendant subtree from the perspective of the boundary's normal
children.

For example:

```tsx
class ErrorBoundary extends React.Component<Props, State> {
    // ...

    render() {
        if (this.state.hasError) {
            return <ErrorFallback/>;
        }

        return this.props.children;
    }
}
```

The failed children are no longer rendered while the boundary remains in its fallback state.

This makes the fallback a replacement view rather than an overlay on top of the failed subtree.

## Recovery

An Error Boundary does not automatically retry the failed subtree successfully.

Recovery requires a new render in which the underlying failure no longer occurs.

A simple reset can be:

```tsx
<button
    onClick={() => this.setState({hasError: false})}
>
    Try again
</button>
```

However, this only works if the underlying failure was transient or has otherwise been resolved.

If the same component continues to throw:

```tsx
function BrokenComponent() {
    throw new Error("Still broken");
}
```

resetting the boundary simply causes the failure again.

Recovery therefore requires an actual change in the conditions that caused the failure.

## Reset by Key

A common recovery mechanism is to recreate the failed subtree by changing its identity.

For example:

```tsx
function UserScreen({userId}: { userId: string }) {
    return (
        <ErrorBoundary key={userId}>
            <UserPanel userId={userId}/>
        </ErrorBoundary>
    );
}
```

When `userId` changes, React can treat the boundary instance as a different component identity.

This can be useful when changing the resource or route should naturally reset the error state.

Keys therefore can participate in boundary recovery, but their primary semantic role remains component identity.

## Explicit Reset Conditions

A reusable boundary can expose a reset condition:

```tsx
type ErrorBoundaryProps = {
    resetKey: string;
    children: React.ReactNode;
};
```

The boundary can reset when the relevant external condition changes.

For example:

```tsx
<ErrorBoundary resetKey={userId}>
    <UserPanel userId={userId}/>
</ErrorBoundary>
```

The reset condition should correspond to a meaningful change in the failed subtree's inputs.

Arbitrarily resetting on unrelated changes can hide persistent failures rather than recover from them.

## Resetting Related State

Recovery may require more than resetting the boundary.

Suppose the failure resulted from invalid local state:

```tsx
function Editor() {
    const [draft, setDraft] = useState(invalidInitialValue);

    // Rendering fails because draft has an invalid shape.
}
```

Resetting the boundary without resetting the invalid state may reproduce the same failure.

A complete recovery mechanism may therefore need to reset:

* boundary state;
* component identity;
* local state;
* resource state;
* server-state queries;
* external store state.

The boundary is responsible for containment, not for deciding how every underlying subsystem should recover.

## Nested Boundaries

Error Boundaries can be nested:

```tsx
<ErrorBoundary>
    <Page>
        <ErrorBoundary>
            <Comments/>
        </ErrorBoundary>

        <ErrorBoundary>
            <Recommendations/>
        </ErrorBoundary>
    </Page>
</ErrorBoundary>
```

If `Comments` fails, the inner boundary can handle it.

If the inner boundary itself cannot handle the failure, the error can propagate to an outer boundary.

Nested boundaries allow different failure domains to have different fallback and recovery strategies.

## Boundary Failure

The boundary itself can fail.

For example:

```tsx
function ErrorFallback({error}: { error: Error }) {
    return <BrokenFallback error={error}/>;
}
```

If the fallback throws, the original boundary cannot provide reliable containment for its own fallback.

An outer boundary can provide another containment layer:

```tsx
<ErrorBoundary>
    <ErrorBoundary>
        <Application/>
    </ErrorBoundary>
</ErrorBoundary>
```

This can create a final safety net around a more specialized boundary.

The outer fallback should be simpler and more defensive than ordinary application UI.

## Page-Level Boundaries

Page-level boundaries are useful when a route or page represents a coherent failure domain.

```tsx
<ErrorBoundary>
    <AccountPage/>
</ErrorBoundary>
```

The fallback might allow:

* retrying;
* navigating elsewhere;
* returning to a known-good route;
* reporting the problem.

The rest of the application shell can remain available when the architecture places the boundary below it.

## Widget-Level Boundaries

A widget-level boundary isolates independently useful functionality.

```tsx
<Dashboard>
    <ErrorBoundary>
        <AnalyticsWidget/>
    </ErrorBoundary>

    <ErrorBoundary>
        <RecentOrdersWidget/>
    </ErrorBoundary>
</Dashboard>
```

If analytics fails, recent orders can still render.

This is particularly useful for dashboards, portals, administration interfaces, and other compositions containing
multiple independently sourced features.

## Route Boundaries

Routing systems often provide route-level error boundaries or equivalent mechanisms.

Conceptually:

```tsx
<Route
    path="/settings"
    element={
        <ErrorBoundary>
            <Settings/>
        </ErrorBoundary>
    }
/>
```

A route boundary limits failures to the route's rendering domain.

Route-level error handling and Error Boundaries are complementary when the routing system has additional semantics for
navigation, loader errors, or server responses.

## Suspense and Error Boundaries

Suspense and Error Boundaries solve different failure states.

Suspense handles waiting for something that is not yet ready:

```tsx
<Suspense fallback={<Loading/>}>
    <Profile/>
</Suspense>
```

An Error Boundary handles a supported failure:

```tsx
<ErrorBoundary>
    <Suspense fallback={<Loading/>}>
        <Profile/>
    </Suspense>
</ErrorBoundary>
```

The two can be composed so that the UI has separate representations for:

* waiting;
* successfully rendered;
* failed.

Their responsibilities should remain distinct.

## Error Boundary and Loading State

An error fallback should not be treated as a loading state.

Loading means:

```text
The required operation has not completed yet.
```

Error means:

```text
The required operation failed or rendering could not continue.
```

These states can transition independently.

For example:

```tsx
if (isLoading) {
    return <Loading/>;
}

if (error) {
    return <ErrorMessage/>;
}

return <Content/>;
```

A boundary becomes relevant when a rendering failure needs containment, not merely because data acquisition has an error
state.

## Error Boundary and Retry

Retrying a failed operation and resetting a failed rendering subtree are separate operations.

For example:

```tsx
function UserFallback() {
    return (
        <button onClick={() => refetch()}>
            Retry
        </button>
    );
}
```

may retry a server request.

By contrast:

```tsx
resetBoundary();
```

re-attempts rendering of the subtree.

A robust application may need both:

```tsx
<ErrorBoundary>
    <UserPage/>
</ErrorBoundary>
```

with the page handling remote retry and the boundary handling rendering failure.

## Logging and Observability

An Error Boundary is an important observability boundary.

A production implementation can report:

```tsx
componentDidCatch(error, info)
{
    errorReporter.capture(error, {
        componentStack: info.componentStack,
    });
}
```

Useful diagnostic context can include:

* error type;
* error message;
* component stack;
* route;
* application version;
* relevant non-sensitive feature context;
* correlation identifiers;
* environment.

Sensitive data should not be blindly included in telemetry.

## Development and Production Behavior

Development environments can provide detailed diagnostics that are inappropriate for production users.

The boundary can therefore separate:

```tsx
<DevelopmentErrorDetails error={error}/>
```

from:

```tsx
<ProductionErrorMessage/>
```

The production fallback should communicate enough information for the user to understand what happened without exposing
internal implementation details.

## Error Boundaries and State Preservation

When a boundary enters its fallback state, the failed subtree is no longer rendered normally.

Its local state should not be assumed to remain interactable or usable while the fallback is active.

If recovery recreates the subtree, its state may be initialized again depending on component identity and the recovery
mechanism.

This makes error recovery closely related to component identity.

A reset that preserves the same identity and simply changes boundary state can have different consequences from a reset
that deliberately recreates the subtree.

## Error Boundaries and Component Identity

Component identity determines whether React preserves or recreates component state.

For example:

```tsx
<ErrorBoundary key={resourceId}>
    <ResourceView id={resourceId}/>
</ErrorBoundary>
```

Changing `resourceId` can recreate the boundary and its descendants.

This is useful when the resource itself defines the recovery boundary.

However, keys should represent actual identity rather than being changed merely to force arbitrary resets.

## Error Boundaries and Effects

Effects can fail for reasons unrelated to rendering.

For example:

```tsx
useEffect(() => {
    initializeExternalSystem();
}, []);
```

If `initializeExternalSystem` fails asynchronously, the application should handle that failure according to the effect's
operation semantics.

The Error Boundary should not be treated as a universal effect-error handler.

If the effect failure must become a render-time failure, the effect can update state and the component can deliberately
throw during rendering:

```tsx
function Widget() {
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        initialize().catch(setError);
    }, []);

    if (error) {
        throw error;
    }

    return <WidgetContent/>;
}
```

The conversion is explicit: the effect records the failure, and rendering throws it into the boundary.

## Error Boundaries and Event-Driven Recovery

A fallback often provides user-driven recovery:

```tsx
function Fallback({
                      onRetry,
                  }: {
    onRetry: () => void;
}) {
    return (
        <section>
            <p>Unable to display this section.</p>
            <button onClick={onRetry}>Try again</button>
        </section>
    );
}
```

The callback can:

* reset the boundary;
* refetch data;
* reset local state;
* navigate;
* invalidate server state;
* recreate the affected feature.

The correct action depends on the failure domain.

## Common Misuse

A common mistake is wrapping the entire application in one boundary and considering error handling complete.

```tsx
<ErrorBoundary>
    <App/>
</ErrorBoundary>
```

This is useful as a final safety net, but it creates a large failure domain.

Another mistake is assuming that an Error Boundary catches arbitrary asynchronous errors.

```tsx
setTimeout(() => {
    throw new Error("Failure");
}, 1000);
```

A boundary should not be used as the mechanism for handling arbitrary JavaScript exceptions outside React's supported
error-boundary semantics.

Another mistake is using boundaries for ordinary validation:

```tsx
function Form() {
    if (!emailIsValid) {
        throw new Error("Invalid email");
    }
}
```

Validation failure is normally expected application state, not an exceptional rendering failure.

Another mistake is using an Error Boundary to represent normal server errors instead of handling those through the
data-fetching or server-state lifecycle.

Another mistake is automatically resetting the boundary on every render or state change. This can cause repeated
failures and make the fallback impossible to observe.

Another mistake is placing the boundary too high when the failure can be isolated more narrowly.

Finally, a boundary should not conceal every error without reporting or otherwise making the failure diagnosable in
production.

## Advantages

Error Boundaries prevent a rendering failure in one subtree from necessarily destroying the entire interface.

They provide explicit failure domains and allow different parts of an application to have different fallback
experiences.

They support production error reporting through React's component-stack information.

They allow recovery mechanisms to be attached to meaningful UI boundaries.

They also provide a clean separation between rendering failures and ordinary application states such as loading,
validation, and remote-operation errors.

## Disadvantages

Error Boundaries add another component boundary and another state transition to the rendering architecture.

Poorly placed boundaries can produce either excessive fragmentation or excessively large failure domains.

A boundary does not automatically solve the underlying error. It only contains the failure and renders an alternative
state.

Recovery can require coordination with local state, server state, external stores, navigation, or component identity.

Error Boundaries also have a limited capture scope and therefore cannot replace general JavaScript error handling.

## When to Use

Use an Error Boundary when a subtree represents a meaningful failure domain and a rendering failure should not
necessarily take down its surrounding interface.

Typical candidates include:

* application shells;
* routes;
* pages;
* dashboard widgets;
* third-party components;
* independently developed features;
* complex visualization components;
* plugin-provided UI;
* components whose rendering depends on potentially unstable data or code.

A top-level boundary should generally exist as a final containment mechanism even when more localized boundaries are
present.

## When Not to Use

Do not use an Error Boundary for normal control flow.

Do not use it as a replacement for:

* form validation;
* loading states;
* ordinary server errors;
* event-handler error handling;
* asynchronous operation handling;
* retry policies;
* authorization logic;
* business-rule validation.

Use those mechanisms at the layer that owns the corresponding operation.

## Relationships

`08-effect-synchronization.md` concerns synchronization with external systems. Errors originating from those operations
require their own handling; an Error Boundary is only relevant if the failure is deliberately surfaced as a render-time
error.

`17-data-fetching.md` owns asynchronous data acquisition and request lifecycle. Data-fetching failures should normally
be represented by that lifecycle rather than assumed to be caught by an Error Boundary.

`20-server-state.md` manages remote-state synchronization, including query and mutation errors. Error Boundaries can
provide a rendering-level safety net around components consuming server state, but they do not replace server-state
error handling.

`21-suspense-boundary.md` is concerned with suspending rendering while work is incomplete. Suspense handles waiting;
Error Boundary handles supported failure.

`45-component-identity.md` determines whether stateful component instances are preserved or recreated. Boundary recovery
can deliberately use identity changes to reset failed subtrees.

`44-stable-keys.md` governs stable list identity. Keys can also be used as an intentional reset mechanism when a
boundary's subtree genuinely represents a different identity, but boundary recovery should not misuse keys as an
arbitrary force-remount mechanism.

`25-external-store.md` can provide external state consumed by a boundary's descendants. External-store failures and
synchronization errors remain the responsibility of the store or consuming layer unless explicitly surfaced as rendering
errors.

`16-uncontrolled-components.md` and `15-controlled-components.md` define component state ownership. A boundary does not
change who owns descendant state; it controls what happens when rendering that subtree fails.

`40-server-components.md` and `42-hydration-boundary.md` introduce additional execution and rendering boundaries. Error
handling may exist at those boundaries as well, but the semantics of a React Error Boundary remain specifically
concerned with React rendering failures within its supported scope.

## Summary

An Error Boundary is a React failure-containment mechanism for a descendant rendering subtree.

Its responsibility is to establish a meaningful failure boundary:

* capture supported React rendering errors;
* replace the failed subtree with fallback UI;
* report diagnostic information;
* isolate failures;
* provide a path toward recovery.

It is not a universal exception handler and should not be used for ordinary application states.

The core rule is:

> Use Error Boundaries to contain rendering failures at meaningful UI failure domains, while handling operational,
> asynchronous, validation, and server-state failures at the layer that owns those operations.
