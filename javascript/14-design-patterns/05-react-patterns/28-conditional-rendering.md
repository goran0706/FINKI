# Conditional Rendering

Conditional rendering is the use of JavaScript control flow and expressions to determine which React elements or
components are included in the rendered tree. A component does not have to render the same element structure on every
render; it can select different UI based on props, state, context, application state, or other runtime conditions.

The essential principle is that rendering is a function of the current inputs. When a condition changes, React evaluates
the component again and produces a potentially different element tree.

## Intent

Use conditional rendering when different runtime conditions require different UI states, structures, or components.

Typical conditions include:

* whether data exists
* whether an operation is loading
* whether an error occurred
* whether a user is authenticated
* whether a feature is enabled
* whether a component is expanded
* whether a value is valid
* whether an item is selected
* whether a component should be displayed at all
* whether different components should represent different application states

Conditional rendering should express a meaningful UI state transition rather than merely hide implementation details.

## Basic Pattern

The simplest form is a conditional expression that chooses between two renderable values.

```tsx
function Status({online}: { online: boolean }) {
    return online ? <OnlineIndicator/> : <OfflineIndicator/>;
}
```

The condition determines which React element is returned as part of the rendered tree.

The alternatives do not have to be different component types. They can be different elements, text values, fragments, or
combinations of elements.

```tsx
function Greeting({authenticated}: { authenticated: boolean }) {
    return authenticated ? <h1>Welcome back</h1> : <h1>Please sign in</h1>;
}
```

A condition can also determine whether a particular subtree is included.

```tsx
function Panel({expanded}: { expanded: boolean }) {
    return (
        <section>
            <PanelHeader/>
            {expanded ? <PanelContent/> : null}
        </section>
    );
}
```

Returning `null` from the conditional expression explicitly represents the absence of that subtree.

## Conditional Branches

Conditional rendering commonly represents mutually exclusive UI states.

```tsx
function Account({status}: { status: "loading" | "authenticated" | "anonymous" }) {
    if (status === "loading") {
        return <Loading/>;
    }

    if (status === "authenticated") {
        return <AccountDetails/>;
    }

    return <SignInPrompt/>;
}
```

This form is useful when each branch represents a substantial rendering state.

Early returns are often clearer than deeply nested conditional expressions because the component's state space becomes
explicit.

```tsx
function Profile({user}: { user: User | null }) {
    if (!user) {
        return <SignInPrompt/>;
    }

    return <ProfileDetails user={user}/>;
}
```

The important distinction is between choosing a UI branch and performing application logic. Conditional rendering should
determine the rendered result; unrelated business operations should not be embedded into render branches merely because
the branch happens to exist.

## Multiple Conditions

A component can represent more than two rendering states.

```tsx
function RequestState({
                          loading,
                          error,
                          data,
                      }: {
    loading: boolean;
    error: Error | null;
    data: Data | null;
}) {
    if (loading) {
        return <Loading/>;
    }

    if (error) {
        return <ErrorMessage error={error}/>;
    }

    if (!data) {
        return <EmptyState/>;
    }

    return <DataView data={data}/>;
}
```

This is generally preferable to deeply nested ternary expressions when the conditions represent distinct semantic
states.

The ordering of conditions matters when multiple conditions can simultaneously be true. The first matching branch
determines the rendered result.

## Conditional Expressions

JavaScript expressions can directly select rendered content.

```tsx
function UserMenu({authenticated}: { authenticated: boolean }) {
    return (
        <nav>
            {authenticated ? <UserMenuItems/> : <SignInButton/>}
        </nav>
    );
}
```

This is useful when the condition is local to a particular part of the returned structure.

Conditional expressions are particularly appropriate when both alternatives are small and the relationship between them
is immediately obvious.

## Conditional Inclusion

A condition can control whether a subtree exists at all.

```tsx
function Dialog({open}: { open: boolean }) {
    return (
        <>
            <PageContent/>
            {open ? <DialogContent/> : null}
        </>
    );
}
```

When the condition becomes false, the corresponding element is no longer present in the rendered tree.

This is different from rendering the subtree and merely making it visually invisible.

```tsx
function Dialog({open}: { open: boolean }) {
    return (
        <div hidden={!open}>
            <DialogContent/>
        </div>
    );
}
```

Here the element remains part of the rendered tree while its visibility is controlled by an attribute.

The choice between omission and visibility affects component identity, state lifetime, effects, DOM state,
accessibility, layout, and performance.

## Conditional Rendering Versus CSS Visibility

Conditional rendering changes the React tree.

```tsx
{
    open ? <Menu/> : null
}
```

CSS-based hiding keeps the relevant element rendered.

```tsx
<div hidden={!open}>
    <Menu/>
</div>
```

These approaches have different semantics.

Conditional rendering can cause the component instance to be removed and later created again. Its local state, effects,
and DOM state therefore follow normal React identity and mounting rules.

Keeping the component rendered preserves its instance while changing how it is presented.

Neither approach is universally correct.

Use conditional rendering when the subtree should genuinely not exist while inactive. Keep it rendered when preserving
component state or DOM state while changing visibility is part of the intended behavior.

Accessibility requirements must also be considered. Visually hiding content is not automatically equivalent to removing
it from the accessibility tree.

## Conditional Rendering and `null`

React allows a component to return `null`.

```tsx
function AdminPanel({isAdmin}: { isAdmin: boolean }) {
    if (!isAdmin) {
        return null;
    }

    return <Panel/>;
}
```

Returning `null` means that the component contributes no rendered host content for that render.

This is useful for components whose entire purpose is conditional participation in the UI.

A component returning `null` is still a React component instance. Returning `null` does not necessarily mean that the
component has been unmounted.

```tsx
function Status({visible}: { visible: boolean }) {
    if (!visible) {
        return null;
    }

    return <StatusIndicator/>;
}
```

When `visible` changes from `true` to `false`, the `Status` component itself can remain mounted while its rendered child
disappears.

This distinction matters for component state and Effects.

## Conditional Rendering and Component Identity

Conditional branches can change which component occupies a position in the rendered tree.

```tsx
function Editor({preview}: { preview: boolean }) {
    return preview ? <Preview/> : <EditorForm/>;
}
```

When the branch changes, React reconciles the resulting element trees. If the relevant element identity changes, the
previous component instance can be replaced by another instance.

This affects:

* local state
* refs
* Effects
* DOM state
* imperative handles
* component lifetime

Conditional rendering therefore participates directly in React's identity model.

The branch itself does not inherently imply a remount. If equivalent element identity is preserved, React can preserve
the associated instance state.

Keys can also explicitly influence identity when multiple alternatives need independent identities.

```tsx
function Editor({mode}: { mode: "create" | "edit" }) {
    return mode === "create"
        ? <Form key="create"/>
        : <Form key="edit"/>;
}
```

The explicit keys cause the two modes to represent distinct component identities.

## Conditional Rendering and State Preservation

Consider:

```tsx
function CounterPanel({visible}: { visible: boolean }) {
    return visible ? <Counter/> : null;
}
```

When `Counter` is removed from the tree, its component instance is no longer present at that position. When it is
subsequently rendered again, a new instance is created.

By contrast:

```tsx
function CounterPanel({visible}: { visible: boolean }) {
    return (
        <div hidden={!visible}>
            <Counter/>
        </div>
    );
}
```

The `Counter` remains rendered, so its local state can remain associated with the same component instance.

Conditional rendering therefore provides one mechanism for controlling component lifetime.

The decision should be based on the intended lifecycle semantics rather than only on visual appearance.

## Conditional Rendering and Falsy Values

JavaScript's logical operators can be used to conditionally include elements.

```tsx
{
    isLoggedIn && <AccountMenu/>
}
```

This is concise, but React's rendering behavior means that not every falsy JavaScript value behaves identically.

For example:

```tsx
{
    count && <Results/>
}
```

If `count` is `0`, the expression evaluates to `0`.

Depending on the rendering position and intended UI, that can produce an unintended visible `0`.

Prefer an explicit boolean condition when a numeric or string value can legitimately be falsy.

```tsx
{
    count > 0 && <Results/>
}
```

Or use a ternary when the empty case needs to be explicit.

```tsx
{
    count > 0 ? <Results/> : null
}
```

This is particularly important when conditions are based on values such as:

* `0`
* `""`
* `NaN`
* nullable values
* optional numeric fields

The JavaScript truthiness model should not be confused with React's treatment of renderable values.

## Conditional Rendering of Collections

Conditional rendering can also determine whether a collection is rendered.

```tsx
function Results({items}: { items: Item[] }) {
    if (items.length === 0) {
        return <EmptyState/>;
    }

    return (
        <ul>
            {items.map(item => (
                <ResultItem key={item.id} item={item}/>
            ))}
        </ul>
    );
}
```

The collection itself is not the conditional-rendering pattern. The condition determines which UI state represents an
empty collection, while the collection rendering mechanism handles the individual items.

Avoid conflating these responsibilities.

An empty-state branch answers the question "what should the UI show when there are no items?" The mapping operation
answers "how should each available item be represented?"

## Conditional Rendering of Loading, Error, Empty, and Success States

A common application of conditional rendering is representing the state of an asynchronous request.

```tsx
function UserList({
                      status,
                      users,
                  }: {
    status: "loading" | "error" | "success";
    users: User[];
}) {
    if (status === "loading") {
        return <LoadingState/>;
    }

    if (status === "error") {
        return <ErrorState/>;
    }

    if (users.length === 0) {
        return <EmptyState/>;
    }

    return <UserListContent users={users}/>;
}
```

The important architectural property is that the rendering branches correspond to explicit UI states.

A state model that allows impossible combinations can make conditional rendering unnecessarily complicated.

For example, independently tracking `loading`, `error`, and `success` booleans can create ambiguous combinations such as
both `loading` and `error` being true. A discriminated state representation can make the valid rendering states
explicit.

```tsx
type RequestState<T> =
    | { status: "loading" }
    | { status: "error"; error: Error }
    | { status: "success"; data: T };
```

The conditional rendering logic can then directly follow the state model.

## Nested Conditional Rendering

Conditional rendering can become difficult to understand when conditions are deeply nested.

```tsx
return isAuthenticated
    ? hasPermission
        ? enabled
            ? <Feature/>
            : <Disabled/>
        : <Forbidden/>
    : <SignIn/>;
```

The problem is not that nested conditional expressions are inherently invalid. The problem is that the rendering state
space becomes difficult to inspect and modify.

Prefer named predicates, early returns, or explicit state modeling when the conditions represent meaningful application
states.

```tsx
if (!isAuthenticated) {
    return <SignIn/>;
}

if (!hasPermission) {
    return <Forbidden/>;
}

if (!enabled) {
    return <Disabled/>;
}

return <Feature/>;
```

The result is easier to extend and less likely to contain contradictory branches.

## Conditional Rendering and Derived Conditions

Conditions should generally be derived from existing state and props rather than stored as redundant state.

Avoid:

```tsx
const [hasItems, setHasItems] = useState(false);

useEffect(() => {
    setHasItems(items.length > 0);
}, [items]);
```

Prefer:

```tsx
const hasItems = items.length > 0;
```

Then render from the derived value.

```tsx
return hasItems ? <Results items={items}/> : <EmptyState/>;
```

This avoids synchronization between the source state and a duplicated representation of that state.

## Conditional Rendering and Event Handlers

Rendering conditions should not be used as a substitute for event-driven behavior.

Avoid performing an action merely because a condition is true during rendering.

```tsx
function Component({shouldSave}: Props) {
    if (shouldSave) {
        saveData();
    }

    return <View/>;
}
```

Rendering must remain free of unintended side effects.

If an operation should occur in response to a user interaction, place it in the relevant event handler.

```tsx
function Component() {
    function handleSave() {
        saveData();
    }

    return <button onClick={handleSave}>Save</button>;
}
```

If an operation represents synchronization with an external system, it belongs to the appropriate Effect-based
synchronization mechanism rather than directly inside a rendering branch.

## Conditional Rendering and Effects

Conditional rendering can determine whether an Effect-bearing component exists.

```tsx
function Screen({connected}: { connected: boolean }) {
    return connected ? <ConnectionStatus/> : null;
}
```

If `ConnectionStatus` owns an Effect, removing that component can terminate its component lifecycle and trigger the
corresponding cleanup.

This is one reason conditional rendering should be considered an architectural decision rather than merely a visual
convenience.

The conditional branch determines whether a particular subtree participates in the component tree, while the Effect
determines synchronization behavior for the component instance that exists.

## Conditional Rendering and Hooks

Hooks must not be conditionally invoked.

Incorrect:

```tsx
function Component({enabled}: { enabled: boolean }) {
    if (enabled) {
        const [value, setValue] = useState(0);
    }

    return <View/>;
}
```

Hooks must be called in the same order on every render.

The condition belongs around the rendered result or around behavior inside the Hook, not around the Hook invocation
itself.

Correct:

```tsx
function Component({enabled}: { enabled: boolean }) {
    const [value, setValue] = useState(0);

    return enabled ? <View value={value}/> : null;
}
```

Or, when the state is meaningful only for the conditional subtree, move that subtree into its own component.

```tsx
function Component({enabled}: { enabled: boolean }) {
    return enabled ? <EnabledView/> : null;
}

function EnabledView() {
    const [value, setValue] = useState(0);

    return <View value={value}/>;
}
```

The second design also gives the conditional subtree an explicit lifecycle boundary.

## Conditional Rendering and Component Extraction

When a conditional branch becomes substantial, extract it into a component.

Instead of:

```tsx
function Dashboard({user}: Props) {
    return (
        <main>
            {user
                ? (
                    <section>
                        <h1>{user.name}</h1>
                        <AccountSummary user={user}/>
                        <RecentActivity user={user}/>
                        <Recommendations user={user}/>
                    </section>
                )
                : (
                    <section>
                        <h1>Welcome</h1>
                        <SignInPrompt/>
                        <RegistrationPrompt/>
                    </section>
                )}
        </main>
    );
}
```

Use:

```tsx
function Dashboard({user}: Props) {
    return (
        <main>
            {user ? <AuthenticatedDashboard user={user}/> : <AnonymousDashboard/>}
        </main>
    );
}
```

The conditional decision remains in the parent while each branch owns its own rendering concerns.

This is ordinary component composition, not a separate conditional-rendering mechanism.

## Conditional Rendering and Permissions

Authorization-related UI often uses conditional rendering.

```tsx
function AdminActions({canManage}: { canManage: boolean }) {
    if (!canManage) {
        return null;
    }

    return <ManagementActions/>;
}
```

Conditional rendering controls what the user interface exposes. It is not a security boundary.

A hidden or omitted UI element does not prevent a caller from invoking an API directly. Authorization must be enforced
at the appropriate server or service boundary.

Conditional rendering should therefore be treated as presentation behavior, even when its condition originates from
authorization state.

## Conditional Rendering and Feature Flags

Feature flags are another common source of rendering conditions.

```tsx
function Checkout({newCheckout}: { newCheckout: boolean }) {
    return newCheckout ? <NewCheckout/> : <LegacyCheckout/>;
}
```

The flag determines which implementation participates in the rendered tree.

For larger features, it is usually preferable to isolate each branch behind a component boundary rather than distribute
the same feature flag throughout many unrelated components.

```tsx
function Checkout(props: CheckoutProps) {
    return isNewCheckoutEnabled()
        ? <NewCheckout {...props} />
        : <LegacyCheckout {...props} />;
}
```

This keeps the conditional decision close to the architectural boundary that changes.

## Conditional Rendering and Server Rendering

Conditional rendering also occurs during server rendering.

The server must produce markup based on the same relevant inputs that determine the initial client render when hydration
is expected.

A branch that produces different markup on the server and during the initial client render can produce a hydration
mismatch.

For example, directly using browser-only state during rendering can create inconsistent branches.

```tsx
function Component() {
    const mobile = window.innerWidth < 768;

    return mobile ? <MobileView/> : <DesktopView/>;
}
```

The browser-specific value is not available in the same way during server rendering.

Responsive layout is generally better expressed through CSS, while genuinely client-only conditions should be handled
using an appropriate client boundary or post-hydration synchronization strategy.

## Conditional Rendering and Accessibility

Removing a component and hiding a component are not equivalent accessibility operations.

For interactive UI, consider:

* whether the element remains in the accessibility tree
* whether keyboard users can reach it
* whether focus should move when a branch appears or disappears
* whether focus becomes invalid when the active element is removed
* whether screen readers receive the appropriate state information
* whether hidden content should remain available to assistive technologies
* whether an alternative branch provides equivalent semantics

Conditional rendering should therefore be designed together with semantic HTML and accessibility behavior rather than
treated as purely visual logic.

## Conditional Rendering and Performance

Conditional rendering can reduce work by excluding unnecessary subtrees from the rendered tree.

However, conditional rendering is not automatically a performance optimization.

Creating and destroying a component subtree can also have costs, including:

* mounting and unmounting components
* running Effect setup and cleanup
* creating and removing DOM nodes
* losing local state
* rebuilding expensive component state
* losing DOM state

If a subtree is inexpensive and genuinely inactive, conditional rendering is usually straightforward.

If a subtree is expensive to recreate but must preserve state, keeping it mounted and controlling visibility may be more
appropriate.

Performance decisions should follow actual lifecycle and rendering requirements rather than assuming that "not
rendering" is always faster.

## Conditional Rendering and Transitions

A condition can determine whether a transition-related UI state is rendered.

```tsx
function SearchResults({query, results}: Props) {
    return query
        ? <Results query={query} results={results}/>
        : <SearchPrompt/>;
}
```

When rendering updates are scheduled as transitions, the important distinction is between the condition itself and the
priority of the update that changes the condition.

Conditional rendering answers which UI tree should be produced. Transition APIs influence how React schedules the update
that causes that tree to change.

These are separate concerns.

## Conditional Rendering and Suspense

Suspense provides a specialized mechanism for rendering fallback content while a subtree is not ready.

```tsx
<Suspense fallback={<Loading/>}>
    <Profile/>
</Suspense>
```

This should not be confused with ordinary conditional rendering.

Ordinary conditional rendering explicitly selects a branch:

```tsx
{
    loading ? <Loading/> : <Profile/>
}
```

Suspense allows a subtree to suspend and lets React coordinate the fallback according to Suspense semantics.

Both can represent loading-like UI, but they have different ownership and runtime behavior.

## Conditional Rendering and Error Boundaries

Error boundaries provide another specialized form of alternative UI, but they do not replace ordinary conditions.

```tsx
<ErrorBoundary fallback={<ErrorState/>}>
    <Dashboard/>
</ErrorBoundary>
```

The fallback is selected because rendering of the protected subtree encountered an error.

A conditional branch, by contrast, selects UI based on application state or another explicit condition.

These mechanisms solve different problems.

## Common Misuse

A common misuse is using conditional rendering to encode complicated business logic directly inside JSX.

```tsx
return (
    <div>
        {user &&
        user.account &&
        user.account.subscription &&
        user.account.subscription.active &&
        !user.account.subscription.expired
            ? <PremiumFeature/>
            : <UpgradePrompt/>}
    </div>
);
```

The rendering condition is difficult to read because the domain rule is embedded directly into the view.

Derive the semantic condition first.

```tsx
const canUsePremiumFeature =
    user?.account?.subscription?.active === true &&
    user?.account?.subscription?.expired !== true;
```

Then render from the named condition.

```tsx
return (
    <div>
        {canUsePremiumFeature ? <PremiumFeature/> : <UpgradePrompt/>}
    </div>
);
```

Another misuse is storing a value that can already be derived from props or state.

```tsx
const [showEmptyState, setShowEmptyState] = useState(false);
```

If the empty state is determined by `items.length === 0`, storing a second boolean creates unnecessary synchronization.

Another misuse is using conditional rendering to imply security. Removing an administrative button does not enforce
administrative authorization.

Another misuse is using CSS hiding when the intended semantics are actual removal, or removing a subtree when preserving
its component state is required.

## Advantages

Conditional rendering provides a direct mapping between application state and UI state. It allows components to
represent loading, error, empty, authenticated, unauthorized, enabled, disabled, selected, expanded, and other states
without requiring a single static tree.

It also allows inactive subtrees to be excluded entirely when their presence is not required, which can simplify
lifecycle ownership and avoid retaining unnecessary component instances.

Because conditions are ordinary JavaScript expressions and control flow, conditional rendering integrates naturally with
existing language constructs and TypeScript's type narrowing.

## Disadvantages

Complex conditions can make JSX difficult to read. Deeply nested branches can obscure the actual UI state model and make
future changes error-prone.

Removing and recreating conditional subtrees can also destroy component state, DOM state, refs, and Effect lifetimes
when that behavior is not intended.

Conditional rendering can additionally become misleading when presentation conditions are used to represent security,
business rules, or data synchronization responsibilities that actually belong elsewhere.

## When to Use

Use conditional rendering when:

* different application states require different UI
* a subtree should exist only under a particular condition
* mutually exclusive components represent different modes
* loading, error, empty, and success states need explicit representation
* permissions or feature flags determine presentation
* a component should return no UI under a specific condition
* component lifetime should follow a particular UI state

## When Not to Use

Do not use conditional rendering as:

* a security mechanism
* a replacement for server-side authorization
* a way to perform side effects during render
* a substitute for event handlers
* a substitute for Effect-based synchronization
* a reason to duplicate derived state
* a replacement for CSS when the requirement is purely responsive presentation
* a way to conditionally call Hooks
* a substitute for Suspense when the actual requirement is asynchronous rendering readiness
* a substitute for Error Boundaries when the actual requirement is render-error containment

## Relationship to Other Patterns

Conditional rendering is a fundamental rendering technique rather than an independent state-management architecture.

It works with component composition because each branch can render a composed subtree.

It works with controlled and uncontrolled components because either state ownership model can determine which UI branch
is rendered.

It works with local state because state changes frequently determine rendering conditions.

It works with Context because context values can influence which branch is rendered.

It works with state lifting and state colocation because the location of state ownership determines where the rendering
decision can be made.

It works with component identity and stable keys because changing conditional branches can preserve or replace component
instances depending on the resulting element identity.

It works with Effect cleanup because removing a conditional subtree can end the lifetime of the components and Effects
within that subtree.

It works with Suspense and Error Boundaries, but those mechanisms represent different reasons for alternative UI.

It works with transitions and deferred values because those mechanisms influence update scheduling and value
availability rather than defining the conditional-rendering mechanism itself.

## Design Rules

Prefer explicit rendering states over collections of loosely related boolean flags when the states are mutually
exclusive.

Use early returns for substantial or mutually exclusive branches.

Use inline conditional expressions when the condition and both alternatives are small and immediately understandable.

Use `null` when a component or subtree should contribute no rendered output.

Distinguish removing a subtree from hiding a subtree. They have different lifecycle, state, DOM, accessibility, and
performance consequences.

Do not perform side effects inside rendering conditions.

Do not conditionally invoke Hooks.

Derive rendering conditions from authoritative state instead of storing redundant booleans.

Extract large branches into components rather than allowing a single JSX expression to become a complete application
state machine.

Treat authorization conditions as presentation decisions, not security enforcement.

When conditional branches represent materially different component modes, explicitly consider their identity and
state-preservation requirements.

Model asynchronous UI states explicitly enough that loading, error, empty, and success conditions are deterministic and
understandable.

## Summary

Conditional rendering determines which React elements or components participate in the rendered tree for the current
render.

Its essential forms are conditional branches, conditional expressions, early returns, and explicit `null` rendering. The
technique is ordinary JavaScript control flow applied to React's declarative rendering model.

The important architectural question is not simply whether something should be shown. It is whether the corresponding
subtree should exist, whether its component state should survive the condition changing, whether its Effects should
remain active, and what accessibility semantics the resulting UI should have.

Use conditional rendering to represent UI state clearly, keep rendering conditions derived from authoritative data, and
preserve the distinction between rendering decisions, application logic, side effects, scheduling, and lifecycle
management.
