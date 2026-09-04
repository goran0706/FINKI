# Container-Presentational Components

The Container-Presentational pattern separates a component that coordinates data, state, behavior, or external
dependencies from a component that primarily renders the resulting UI.

The distinction is architectural rather than syntactic. A container is responsible for obtaining or coordinating what
the UI needs, while a presentational component is responsible for describing how that information is rendered.

The pattern is most useful when the separation creates a meaningful boundary between orchestration and rendering. It
should not be applied mechanically to every component.

## Intent

Use the Container-Presentational pattern to separate:

* data acquisition from rendering;
* state coordination from visual representation;
* event orchestration from UI structure;
* external dependencies from reusable UI;
* feature-specific behavior from generic presentation.

The goal is to make presentation components easier to reuse, test, and reason about without forcing every component into
an artificial two-component structure.

## Basic Pattern

A container obtains the required data and behavior:

```tsx
function UserProfileContainer({
                                  userId,
                              }: {
    userId: string;
}) {
    const user = useUser(userId);

    return (
        <UserProfile
            user={user}
            loading={user.loading}
            error={user.error}
        />
    );
}
```

The presentational component renders that state:

```tsx
type UserProfileProps = {
    user: User | null;
    loading: boolean;
    error: Error | null;
};

function UserProfile({
                         user,
                         loading,
                         error,
                     }: UserProfileProps) {
    if (loading) {
        return <UserProfileSkeleton/>;
    }

    if (error) {
        return <UserProfileError error={error}/>;
    }

    if (!user) {
        return <UserNotFound/>;
    }

    return (
        <section>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </section>
    );
}
```

The container decides what data and behavior the presentation receives.

The presentational component decides how that information is rendered.

## Container Responsibilities

A container can coordinate application concerns such as:

* obtaining data;
* reading Context;
* reading an external store;
* invoking custom Hooks;
* coordinating local state;
* dispatching actions;
* handling mutations;
* transforming domain data into view data;
* connecting event handlers to application behavior;
* coordinating loading and error state;
* selecting dependencies;
* integrating feature-level infrastructure.

The exact responsibilities depend on the application architecture.

A container should not automatically become a dumping ground for every piece of business logic.

## Presentational Responsibilities

A presentational component generally focuses on:

* rendering props;
* arranging visual elements;
* exposing UI events;
* expressing visual states;
* rendering accessibility semantics;
* rendering loading, empty, and error states;
* delegating interactions through callbacks.

For example:

```tsx
type UserCardProps = {
    name: string;
    email: string;
    onSelect?: () => void;
};

function UserCard({
                      name,
                      email,
                      onSelect,
                  }: UserCardProps) {
    return (
        <article>
            <h2>{name}</h2>
            <p>{email}</p>

            {onSelect && (
                <button onClick={onSelect}>
                    Select
                </button>
            )}
        </article>
    );
}
```

The component does not need to know where the user came from or what selecting the user means to the application.

## Presentation Does Not Mean Stateless

A presentational component can have local state.

For example:

```tsx
function PasswordField({
                           value,
                           onChange,
                       }: {
    value: string;
    onChange: (value: string) => void;
}) {
    const [visible, setVisible] = React.useState(false);

    return (
        <div>
            <input
                type={visible ? "text" : "password"}
                value={value}
                onChange={event => onChange(event.target.value)}
            />

            <button onClick={() => setVisible(value => !value)}>
                {visible ? "Hide" : "Show"}
            </button>
        </div>
    );
}
```

The field's value is externally controlled, while the visibility state is local UI state.

Therefore, "presentational" does not mean "contains no state."

The important distinction is which state and behavior the component owns.

## Containers Do Not Have to Be Class Components

The pattern predates Hooks and was historically often implemented using class components connected to state-management
libraries.

Modern React commonly implements containers as function components using Hooks.

```tsx
function UserProfileContainer({
                                  userId,
                              }: {
    userId: string;
}) {
    const user = useUser(userId);
    const permissions = usePermissions();

    return (
        <UserProfile
            user={user}
            permissions={permissions}
        />
    );
}
```

The architectural distinction remains even though the implementation mechanism has changed.

## Containers and Custom Hooks

A custom Hook can absorb much of what historically would have required a container component.

For example:

```tsx
function useUserProfile(userId: string) {
    const user = useUser(userId);
    const permissions = usePermissions();

    return {
        user,
        permissions,
    };
}
```

A component can then consume the Hook directly:

```tsx
function UserProfile({
                         userId,
                     }: {
    userId: string;
}) {
    const profile = useUserProfile(userId);

    return (
        <UserProfileView
            user={profile.user}
            permissions={profile.permissions}
        />
    );
}
```

This means the Container-Presentational pattern and Custom Hooks are not mutually exclusive.

A custom Hook can extract orchestration while a container component can provide an explicit component-level boundary.

## Container as Orchestration Boundary

A useful container boundary exists when orchestration has independent architectural meaning.

```tsx
function DashboardContainer() {
    const dashboard = useDashboardData();
    const filters = useDashboardFilters();

    return (
        <DashboardView
            data={dashboard.data}
            filters={filters.value}
            onFilterChange={filters.setValue}
        />
    );
}
```

The container coordinates several sources of behavior.

The presentational component receives the resulting contract:

```tsx
function DashboardView({
                           data,
                           filters,
                           onFilterChange,
                       }: DashboardViewProps) {
    // render dashboard
}
```

The separation can make the view independent from the application's data-access mechanisms.

## View Models

Containers often transform application data into a presentation-oriented model.

```tsx
function UserContainer({
                           userId,
                       }: {
    userId: string;
}) {
    const user = useUser(userId);

    const viewModel = user.data
        ? {
            name: user.data.displayName,
            avatarUrl: user.data.avatarUrl,
            memberSince: formatDate(user.data.createdAt),
        }
        : null;

    return (
        <UserView
            loading={user.loading}
            error={user.error}
            user={viewModel}
        />
    );
}
```

The presentational component does not need to understand the domain model's internal representation.

This can be particularly valuable when backend or domain models are not suitable as direct UI contracts.

## Avoiding Domain Logic in Presentational Components

A presentational component should generally avoid deciding application-wide business rules.

Prefer:

```tsx
<UserCard
    user={user}
    canDelete={permissions.canDelete}
    onDelete={handleDelete}
/>
```

over:

```tsx
function UserCard({user}) {
    const permissions = usePermissions();
    const account = useAccount();

    // determine authorization
    // perform mutation
    // update cache
    // navigate
}
```

The latter creates coupling between the visual component and multiple application services.

However, presentation-specific decisions remain valid inside the component.

For example, deciding whether to display an icon for a status is presentation logic, not necessarily business logic.

## Presentation Logic vs Business Logic

The pattern does not require presentational components to contain no logic.

This is presentation logic:

```tsx
const label =
    status === "active"
        ? "Active"
        : "Inactive";
```

This may also be presentation logic:

```tsx
const formattedAmount = formatCurrency(amount);
```

By contrast, a rule such as:

```tsx
const canCancel =
    order.status === "processing" &&
    user.permissions.includes("cancel_order") &&
    !order.hasShipment;
```

may represent application or domain policy and may be better determined outside the presentation component.

The correct boundary depends on whether the logic describes rendering or application behavior.

## Event Handling

Presentational components can emit user interactions through callbacks.

```tsx
function UserCard({
                      user,
                      onDelete,
                  }: {
    user: User;
    onDelete: () => void;
}) {
    return (
        <article>
            <h2>{user.name}</h2>
            <button onClick={onDelete}>
                Delete
            </button>
        </article>
    );
}
```

The container connects the callback to application behavior:

```tsx
function UserCardContainer({
                               userId,
                           }: {
    userId: string;
}) {
    const user = useUser(userId);
    const deleteUser = useDeleteUser();

    return (
        <UserCard
            user={user.data}
            onDelete={() => deleteUser(userId)}
        />
    );
}
```

The view expresses the interaction.

The container determines what that interaction means to the application.

## Callback Contracts

Presentational components should expose callbacks according to their UI semantics.

Prefer:

```tsx
<DataTable
    rows={rows}
    onRowSelect={handleRowSelect}
/>
```

when selection is the relevant UI event.

Avoid forcing the presentation layer to know that the application will dispatch a particular action:

```tsx
<DataTable
    dispatch={dispatch}
/>
```

A callback contract keeps the presentational component independent of the application's state-management mechanism.

## Dependency Inversion

The pattern can invert dependencies between presentation and infrastructure.

A presentational component can depend on a small UI-oriented contract:

```tsx
type ProductCardProps = {
    name: string;
    price: string;
    onAddToCart: () => void;
};
```

The container adapts application services to that contract:

```tsx
function ProductCardContainer({
                                  productId,
                              }: {
    productId: string;
}) {
    const product = useProduct(productId);
    const cart = useCart();

    return (
        <ProductCard
            name={product.name}
            price={formatCurrency(product.price)}
            onAddToCart={() => cart.add(productId)}
        />
    );
}
```

The presentation component does not depend directly on the cart service.

## Containers and Context

A container commonly consumes Context:

```tsx
function AccountContainer() {
    const account = useAccountContext();
    const permissions = usePermissionsContext();

    return (
        <AccountView
            account={account}
            permissions={permissions}
        />
    );
}
```

This keeps Context dependencies out of the presentation component.

However, consuming Context directly in a presentational component is not inherently incorrect. The separation is useful
when Context represents application infrastructure that the view should not need to know about.

## Containers and Context Custom Hooks

Context custom Hooks can make container orchestration clearer.

```tsx
function AccountContainer() {
    const account = useAccount();
    const permissions = usePermissions();

    return (
        <AccountView
            account={account}
            permissions={permissions}
        />
    );
}
```

The container becomes the boundary where application dependencies enter the presentation layer.

## Containers and Provider Composition

Provider Composition establishes the contextual environment.

Container-Presentational Components determine where those dependencies are consumed.

For example:

```tsx
<AppProviders>
    <Application/>
</AppProviders>
```

may establish the providers, while:

```tsx
function AccountContainer() {
    const account = useAccount();

    return <AccountView account={account}/>;
}
```

consumes them.

Provider Composition and Container-Presentational separation therefore solve different structural problems.

## Containers and State Ownership

A container often becomes the owner of feature-specific state.

```tsx
function SearchContainer() {
    const [query, setQuery] = React.useState("");

    return (
        <SearchView
            query={query}
            onQueryChange={setQuery}
        />
    );
}
```

The view receives controlled state and events.

However, the container does not automatically become the correct owner merely because it is called a container.

State ownership should still follow the application's ownership requirements.

## Containers and State Colocation

If state is only needed by the presentation component, placing it in a separate container may be unnecessary.

For example:

```tsx
function PasswordField() {
    const [visible, setVisible] = React.useState(false);

    // ...
}
```

Creating:

```tsx
function PasswordFieldContainer() {
    const [visible, setVisible] = React.useState(false);

    return <PasswordField visible={visible}/>;
}
```

does not necessarily improve architecture.

State should remain close to the behavior that needs it when no independent orchestration boundary exists.

## Containers and State Lifting

A container can become the lowest common owner when several presentational components need the same state.

```tsx
function CheckoutContainer() {
    const [coupon, setCoupon] = React.useState("");

    return (
        <>
            <CouponInput
                value={coupon}
                onChange={setCoupon}
            />

            <OrderSummary coupon={coupon}/>
        </>
    );
}
```

The state is lifted to the container because multiple UI regions require the same authoritative value.

State Lifting is the ownership operation.

Container-Presentational separation is the architectural organization of orchestration and rendering.

## Containers and Controlled Components

Presentational components are frequently controlled:

```tsx
<SearchInput
    value={query}
    onChange={setQuery}
/>
```

The container owns the value.

This is a common combination, but the patterns remain conceptually distinct.

Controlled Components define who owns the component's state.

Container-Presentational Components define the separation between orchestration and presentation.

## Containers and Uncontrolled Components

A presentational component can also remain uncontrolled.

```tsx
<SearchForm
    defaultValue=""
    onSubmit={handleSearch}
/>
```

The container may handle the resulting submission without owning every intermediate input value.

Therefore, a presentational component does not have to be controlled.

## Containers and Forms

A container may coordinate form submission:

```tsx
function RegistrationContainer() {
    const register = useRegister();

    return (
        <RegistrationForm
            submitting={register.pending}
            error={register.error}
            onSubmit={register.execute}
        />
    );
}
```

The form component can remain focused on rendering fields and collecting user input.

The container coordinates the application-level submission operation.

Form State remains a separate concern and may itself be implemented through controlled state, uncontrolled fields, a
reducer, or a form library.

## Containers and Reducers

A container may own a reducer:

```tsx
function EditorContainer() {
    const [state, dispatch] = React.useReducer(
        editorReducer,
        initialEditorState
    );

    return (
        <EditorView
            state={state}
            onAction={dispatch}
        />
    );
}
```

The reducer owns transition mechanics.

The container owns or coordinates the state lifecycle.

The presentational component renders the resulting state.

## Containers and Custom Hooks

A custom Hook can hide the container's orchestration details.

```tsx
function useEditor() {
    const [state, dispatch] = React.useReducer(
        editorReducer,
        initialEditorState
    );

    return {
        state,
        dispatch,
    };
}
```

The container becomes small:

```tsx
function EditorContainer() {
    const editor = useEditor();

    return (
        <EditorView
            state={editor.state}
            onAction={editor.dispatch}
        />
    );
}
```

This is often a useful modern form of the pattern.

## Containers and External Stores

A container can consume an external store and pass selected state to a presentational component.

```tsx
function CartContainer() {
    const itemCount = useCartStore(
        state => state.itemCount
    );

    return (
        <CartIndicator count={itemCount}/>
    );
}
```

The external store owns the state.

The container coordinates consumption.

The presentational component renders the result.

An external store is therefore not synonymous with the container pattern.

## Containers and Selectors

Selectors can be used at the orchestration boundary to transform or reduce consumed state.

```tsx
function AccountContainer() {
    const displayName = useAccountStore(
        state => state.profile.displayName
    );

    return <AccountName name={displayName}/>;
}
```

The selector determines what state is consumed.

The container determines how that consumed value is supplied to presentation.

These concerns should not be conflated.

## Containers and Server State

A container can consume server state:

```tsx
function ProductContainer({
                              productId,
                          }: {
    productId: string;
}) {
    const product = useProductQuery(productId);

    return (
        <ProductView
            product={product.data}
            loading={product.isLoading}
            error={product.error}
        />
    );
}
```

The server-state system remains responsible for:

* cache identity;
* freshness;
* refetching;
* invalidation;
* synchronization;
* mutation reconciliation.

The container coordinates that data with the view.

It does not become the owner of the server's authoritative state.

## Containers and Data Fetching

A container can perform or invoke data fetching:

```tsx
function UserContainer({
                           userId,
                       }: {
    userId: string;
}) {
    const result = useUser(userId);

    return (
        <UserView
            user={result.data}
            loading={result.loading}
            error={result.error}
        />
    );
}
```

The data-fetching pattern defines the acquisition lifecycle.

The container-presentational pattern defines where acquisition and rendering are separated.

## Containers and Resource Caches

A container may read from a resource cache:

```tsx
function ProductContainer({
                              productId,
                          }: {
    productId: string;
}) {
    const product = productResource.read(productId);

    return <ProductView product={product}/>;
}
```

The resource cache owns resource identity and reuse.

The container adapts the resource to the presentation boundary.

## Containers and Effects

A container may use Effects when application orchestration requires synchronization with an external system.

```tsx
function PresenceContainer({
                               userId,
                           }: {
    userId: string;
}) {
    const [online, setOnline] = React.useState(false);

    React.useEffect(() => {
        return subscribeToPresence(userId, setOnline);
    }, [userId]);

    return <PresenceView online={online}/>;
}
```

The Effect owns synchronization with the external system.

The container coordinates the resulting state with the view.

The pattern does not imply that containers should contain Effects. Effects remain justified only when synchronization
with an external system is required.

## Containers and Memoized Components

A presentational component can be memoized:

```tsx
const UserView = React.memo(function UserView({
                                                  user,
                                              }: UserViewProps) {
    return <div>{user.name}</div>;
});
```

The container can then provide props.

Whether this provides a performance benefit depends on prop identity and rendering cost.

Container-Presentational separation should not be introduced merely to enable `memo`.

## Containers and Referential Stability

Container components frequently create callbacks:

```tsx
<UserView
    onDelete={() => deleteUser(userId)}
/>
```

The callback is recreated on each render.

This is not inherently a problem.

If the presentation component is memoized and callback identity is relevant to its render bailout, the container may
need to consider referential stability.

The optimization should follow an actual performance requirement rather than becoming a mandatory property of every
container.

## Containers and Layout Components

Layout Components determine spatial structure.

Container-Presentational Components determine orchestration versus rendering responsibility.

For example:

```tsx
function DashboardContainer() {
    const data = useDashboard();

    return (
        <DashboardLayout>
            <DashboardView data={data}/>
        </DashboardLayout>
    );
}
```

`DashboardContainer` coordinates data.

`DashboardLayout` coordinates spatial structure.

`DashboardView` renders content.

These boundaries can coexist without requiring all three to be separate in every feature.

## Containers and Compound Components

Compound Components expose multiple cooperating components around a shared abstraction.

A container can coordinate the state used by a compound component, but the two patterns solve different problems.

A compound component defines a component API and internal cooperation model.

A container defines an orchestration boundary around presentation.

## Containers and Higher-Order Components

Historically, higher-order components were frequently used to create container components.

For example:

```tsx
const ConnectedUser =
    connect(selectUser)(UserView);
```

The generated component acts as a container around `UserView`.

Modern React commonly uses Hooks instead, but the architectural separation remains possible.

Higher-Order Components are a mechanism for producing component wrappers.

Container-Presentational is the architectural distinction between orchestration and rendering.

## Containers and Render Props

Render Props can also separate orchestration from rendering.

```tsx
<DataProvider>
    {data => (
        <UserView user={data.user}/>
    )}
</DataProvider>
```

The provider or render-prop component coordinates behavior.

The rendered component handles presentation.

Again, Render Props are an implementation mechanism; Container-Presentational is the responsibility boundary.

## Presentational Components and Domain Models

Passing domain objects directly into a presentation component can be appropriate:

```tsx
<UserView user={user}/>
```

It becomes problematic when the presentation component becomes tightly coupled to a large domain model.

A smaller view contract can be preferable:

```tsx
<UserView
    name={user.displayName}
    email={user.email}
    avatarUrl={user.avatarUrl}
/>
```

The correct choice depends on reuse and stability requirements.

The goal is not to eliminate domain objects from presentation at all costs.

## Presentational API Design

A presentational component should expose the smallest contract that adequately represents its rendering requirements.

Prefer:

```tsx
type UserViewProps = {
    name: string;
    email: string;
    avatarUrl?: string;
    onSelect?: () => void;
};
```

over exposing an entire service object:

```tsx
type UserViewProps = {
    userService: UserService;
};
```

The smaller API reduces coupling and makes the component easier to reuse.

## Generic Presentational Components

A presentation component becomes especially reusable when its API describes UI concepts rather than domain-specific
infrastructure.

For example:

```tsx
<DataTable
    columns={columns}
    rows={rows}
    onRowSelect={handleSelect}
/>
```

The table does not need to know whether the rows represent users, invoices, products, or transactions.

This makes the component independent of the data source.

## Domain-Specific Presentational Components

A presentational component does not have to be generic.

```tsx
function InvoiceSummary({
                            invoice,
                        }: {
    invoice: InvoiceViewModel;
}) {
    // ...
}
```

It can remain domain-specific while still being presentation-focused.

The pattern is about separating orchestration from rendering, not about forcing all presentation into a generic design
system.

## Loading States

A presentational component can render loading state when loading is explicitly part of its UI contract.

```tsx
function UserView({
                      user,
                      loading,
                  }: UserViewProps) {
    if (loading) {
        return <UserSkeleton/>;
    }

    return <UserDetails user={user}/>;
}
```

Alternatively, a container can select among distinct presentation states:

```tsx
function UserContainer() {
    const result = useUser();

    if (result.loading) {
        return <UserSkeleton/>;
    }

    if (result.error) {
        return <UserError error={result.error}/>;
    }

    return <UserView user={result.data}/>;
}
```

Both are valid.

The choice depends on whether loading/error state is considered part of the view's reusable presentation contract or
part of the orchestration boundary.

## Error States

Error handling should remain aligned with the type of error involved.

A container may translate a data-access failure into a presentation state:

```tsx
<UserView
    error={result.error}
/>
```

An Error Boundary handles rendering failures differently.

A container-presentational boundary should not be confused with an Error Boundary.

## Empty States

Empty states are commonly presentation concerns:

```tsx
function UserListView({
                          users,
                      }: {
    users: UserViewModel[];
}) {
    if (users.length === 0) {
        return <EmptyUsers/>;
    }

    return users.map(user => (
        <UserCard key={user.id} user={user}/>
    ));
}
```

The container can determine that the list is empty, but the visual representation of emptiness belongs naturally to the
view.

## Feature Orchestration

A container can coordinate several independent presentation components:

```tsx
function CheckoutContainer() {
    const cart = useCart();
    const payment = usePayment();

    return (
        <>
            <CartView cart={cart}/>
            <PaymentView
                state={payment.state}
                onSubmit={payment.submit}
            />
        </>
    );
}
```

The container is valuable because it coordinates the feature.

Neither view needs to understand the complete checkout workflow.

## Avoiding God Containers

A container can become the inverse of a presentation-only component: a massive component containing every application
concern.

Avoid:

```tsx
function ApplicationContainer() {
    // authentication
    // routing
    // persistence
    // analytics
    // data fetching
    // business rules
    // form state
    // notifications
    // feature state
    // rendering
}
```

The existence of a container boundary does not justify centralizing unrelated responsibilities.

Containers should remain aligned with meaningful orchestration scopes.

## Container Granularity

A container can operate at different scales.

A small container may coordinate one data source:

```tsx
function UserContainer() {
    // ...
}
```

A feature container may coordinate an entire workflow:

```tsx
function CheckoutContainer() {
    // ...
}
```

An application shell may coordinate cross-feature infrastructure.

The correct granularity is determined by responsibility boundaries rather than an arbitrary component size.

## Container Placement

A container should generally be placed near the feature or boundary whose dependencies it coordinates.

Avoid placing all containers at the application root.

For example:

```tsx
function BillingPage() {
    return (
        <BillingContainer>
            <BillingView/>
        </BillingContainer>
    );
}
```

can be more appropriate than moving billing-specific orchestration into the global application component.

## Container Reuse

A container is reusable when its orchestration contract itself is reusable.

A container tightly coupled to a single route, authentication state, and feature configuration may intentionally be
application-specific.

A presentational component often has greater reuse potential because it has fewer dependencies.

The pattern does not require containers to be reusable.

## Testing Containers

Container tests should focus on orchestration behavior.

Useful tests include:

* dependencies are consumed correctly;
* loading states are mapped correctly;
* errors are translated correctly;
* callbacks invoke the correct application behavior;
* state transitions produce the correct presentation props;
* external dependencies are integrated correctly.

For example, a container test can verify that selecting a user invokes the appropriate operation without asserting every
DOM detail of the user card.

## Testing Presentational Components

Presentational component tests should focus on rendering and user interaction.

Useful tests include:

* supplied data appears correctly;
* loading and empty states render correctly;
* accessible semantics are present;
* callbacks are emitted under the correct interaction;
* disabled states are respected;
* keyboard interactions work;
* visual-state contracts are preserved.

These tests can use simple props without reproducing the application's data infrastructure.

## Advantages

The pattern can reduce coupling between UI rendering and application infrastructure. Presentational components become
easier to reuse and test because they can receive plain props rather than requiring application-wide dependencies.

Containers can also provide a clear orchestration boundary, making feature data flow and dependency usage easier to
locate.

The separation can be particularly valuable for complex features where multiple sources of state, data, and behavior
must be coordinated.

## Disadvantages

The pattern can introduce unnecessary wrapper components and indirection.

A trivial container such as:

```tsx
function UserContainer() {
    const user = useUser();

    return <UserView user={user}/>;
}
```

may add little value if there is no meaningful separation requirement.

The pattern can also encourage an outdated assumption that all presentation must be stateless and all logic must live
outside the UI.

Modern React allows state, Hooks, Context, and effects to coexist naturally within components, so the boundary should be
introduced when it improves architecture rather than followed as a rigid rule.

## When to Use

Use Container-Presentational separation when:

* a feature has substantial orchestration logic;
* a reusable view should remain independent of data infrastructure;
* multiple dependencies need coordination;
* application state needs to be mapped into a stable view contract;
* a presentation component should be testable without application infrastructure;
* different data sources may drive the same presentation;
* a feature has a clear orchestration boundary.

## When Not to Use

Do not create a container for every presentational component.

Do not extract trivial state merely to satisfy the pattern.

Do not interpret "presentational" as "must have no state."

Do not put all application logic into one global container.

Do not move domain logic into containers simply because it is inconvenient to model.

Do not use the pattern as a substitute for Custom Hooks, State Colocation, Context, External Stores, or Server State
when those patterns solve the actual problem.

## Design Rules

1. Separate orchestration from rendering when the separation provides an architectural benefit.
2. Keep presentational APIs focused on UI requirements.
3. Keep infrastructure dependencies out of reusable views when practical.
4. Allow presentational components to own genuinely local UI state.
5. Do not make containers the default owner of every state value.
6. Keep application and domain logic at the appropriate architectural boundary.
7. Use callbacks to express UI events rather than exposing application dispatch mechanisms directly.
8. Transform domain data into view models when doing so reduces coupling.
9. Keep containers scoped to meaningful orchestration boundaries.
10. Do not create wrappers solely to follow the pattern mechanically.
11. Use Custom Hooks when behavior can be reused without requiring a component boundary.
12. Keep data-fetching and server-state lifecycle responsibilities in their respective abstractions.
13. Keep layout responsibility in Layout Components.
14. Keep Context ownership and distribution in Context Providers.
15. Test containers for orchestration and views for presentation contracts.
16. Prefer the smallest boundary that creates meaningful independence.

## Relationships

**Component Composition:** Container-Presentational separation can be implemented through ordinary composition.

**Custom Hooks:** Hooks can extract orchestration logic without requiring a separate container component.

**Context Provider:** Providers establish dependencies; containers often consume them and translate them into view
props.

**Context Custom Hook:** Custom Hooks can provide the container's application-facing dependency API.

**Context Partitioning:** Partitioning determines Context boundaries; containers may consume only the contexts they
require.

**State Colocation:** State should remain near the component that correctly owns it. A container should not become a
state owner solely because it is a container.

**State Lifting:** A container can be the common owner when several presentation components need shared state.

**Controlled Components:** Containers frequently control presentational components by supplying values and callbacks,
but controlled state ownership is a separate pattern.

**Uncontrolled Components:** Presentational components may remain uncontrolled when local or DOM-owned state is
appropriate.

**Reducer Pattern:** A container may coordinate a reducer, while the reducer defines state transitions.

**Form State:** A container can coordinate form submission and application behavior, while form state remains the
responsibility of the form architecture.

**External Store:** A container can consume external-store state and map it into presentation props; the store remains
the state owner.

**Selector Pattern:** Selectors determine which state is consumed or projected; containers coordinate that result with
presentation.

**Data Fetching:** Data fetching obtains remote data; a container may adapt its lifecycle to a view contract.

**Resource Cache:** The cache owns resource reuse and identity; the container consumes or coordinates cached data.

**Server State:** Server-state infrastructure owns synchronization with remote state; containers connect that state to
presentation.

**Layout Components:** Layout components determine spatial structure; containers determine orchestration. A feature may
use both.

**Compound Components:** Compound components define cooperating component APIs; containers can coordinate the state or
dependencies used by those components.

**Higher-Order Components:** HOCs can implement container-like wrappers, but HOCs are an implementation mechanism rather
than the architectural pattern itself.

**Render Props:** Render Props can separate behavior from rendering through a callback API and can therefore implement a
container-like boundary.

**Memoized Components:** Presentational components can be memoized when rendering cost and prop identity justify it.

**Referential Stability:** Container-generated objects and callbacks can affect memoized views, but stability should be
optimized only where it matters.

**Error Boundary:** Error boundaries contain rendering failures; container-presentational separation concerns
orchestration versus rendering responsibility.

**Suspense Boundary:** Suspense represents rendering readiness; a container may coordinate data while Suspense handles
suspended rendering.

## Summary

The Container-Presentational pattern separates application orchestration from UI rendering when that separation provides
a useful architectural boundary.

A container may acquire data, consume dependencies, coordinate state, invoke mutations, select external state, and
transform application data into a view-oriented contract. A presentational component primarily renders that contract and
communicates user interactions through UI-oriented callbacks.

The pattern should not be treated as a requirement that every component be divided into two components. Modern React
makes many forms of orchestration possible directly through Hooks, Context, external stores, and local state. The
correct question is whether separating orchestration from presentation reduces coupling and creates a meaningful
reusable or testable boundary.

The central design principle is:

**the container coordinates what the UI needs; the presentational component defines how that UI is rendered.**
