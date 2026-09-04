# Feature-Sliced Components

Feature-sliced components organize React components around the feature or capability they implement rather than around
generic technical categories such as buttons, forms, containers, or layouts.

The pattern establishes a component boundary around a coherent user-facing capability. A feature component can combine
presentation, local state, interaction logic, data access, and domain operations when those concerns belong specifically
to that feature.

The defining principle is **feature ownership**: code that changes together because it implements the same product
capability should be colocated and exposed through a deliberate boundary.

## Intent

Use feature-sliced components to prevent large React applications from degenerating into collections of technically
categorized components whose relationships are difficult to understand.

Instead of organizing an application primarily as:

```text
components/
  Button/
  Modal/
  Form/
  Table/
  UserList/
  OrderForm/
  PaymentDialog/
```

the feature-oriented approach organizes code according to capabilities:

```text
features/
  authentication/
  checkout/
  search/
  profile/
  notifications/
```

The important distinction is not the directory names themselves. The pattern is about establishing ownership boundaries
around product capabilities.

A feature should expose a coherent public API while keeping implementation details internal.

## Feature Boundary

A feature represents a meaningful capability from the application's perspective.

Examples include:

* user authentication
* password reset
* product search
* shopping-cart management
* checkout
* profile editing
* notification preferences
* document uploading
* commenting
* filtering
* pagination
* account settings

A feature should be large enough to represent a meaningful capability but small enough that its responsibilities remain
understandable.

A feature is not simply a folder containing every component that happens to appear on one screen.

## Basic Pattern

A feature can contain multiple implementation layers.

```tsx
features /
checkout /
components /
CheckoutForm.tsx
PaymentMethod.tsx
OrderSummary.tsx
hooks /
useCheckout.ts
state /
checkoutReducer.ts
api /
checkoutApi.ts
model /
checkout.ts
index.ts
```

The exact physical organization is implementation-specific.

The architectural property is that these modules belong to the checkout capability and are maintained as one coherent
unit.

The feature's public entry point can expose only what consumers need:

```tsx
export {
    CheckoutForm
} from "./components/CheckoutForm";
```

Internal implementation details remain private to the feature.

## Feature API

A feature should have an explicit public boundary.

For example:

```tsx
import {CheckoutForm} from "@/features/checkout";
```

rather than allowing arbitrary consumers to depend on internal files:

```tsx
import {CheckoutReducer} from "@/features/checkout/state/checkoutReducer";
import {PaymentValidation} from "@/features/checkout/model/validation";
```

The feature's public API determines which implementation details are stable dependencies.

This makes internal refactoring possible without requiring unrelated parts of the application to change.

## Feature Ownership

The feature should own behavior that exists specifically because the feature exists.

For a checkout feature, this might include:

* payment-method selection
* shipping selection
* order submission
* checkout validation
* checkout-specific state
* checkout-specific error handling
* checkout-specific API coordination
* checkout-specific UI

Generic behavior should not be placed inside the feature merely because the feature currently uses it.

A generic dialog belongs to a reusable UI layer if it has no checkout-specific semantics.

A checkout confirmation dialog belongs to the checkout feature because its meaning and behavior are specific to
checkout.

## Feature Components

Feature components are components whose primary responsibility is implementing a feature capability.

For example:

```tsx
function PasswordResetForm() {
    const [email, setEmail] = useState("");

    const submit = async () => {
        // password-reset behavior
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* password-reset presentation */}
        </form>
    );
}
```

The component does not need to be split into container and presentational components merely because it contains both
behavior and rendering.

The feature boundary already provides a higher-level ownership boundary.

## Feature Components Are Not Necessarily Large

Feature slicing does not imply that every feature must contain a large component.

A feature may be implemented by:

```tsx
features /
search /
SearchForm.tsx
```

or by a larger collection:

```tsx
features /
checkout /
CheckoutForm.tsx
ShippingAddress.tsx
PaymentMethod.tsx
OrderReview.tsx
useCheckout.ts
```

The number of files is not the criterion.

The criterion is whether the modules form a coherent capability.

## Feature Composition

Features can be composed by higher-level application surfaces.

```tsx
function AccountPage() {
    return (
        <>
            <ProfileEditor/>
            <NotificationPreferences/>
            <SecuritySettings/>
        </>
    );
}
```

Each component belongs to its own capability.

The page coordinates their placement and composition without necessarily owning their internal behavior.

This allows features to evolve independently.

## Feature Versus Page

A page represents a navigational or screen-level composition.

A feature represents a capability.

A page can therefore contain multiple features:

```tsx
function ProductPage() {
    return (
        <>
            <ProductDetails/>
            <ProductReviews/>
            <AddToCart/>
            <WishlistToggle/>
        </>
    );
}
```

The page decides which capabilities appear together.

The features decide how their respective capabilities operate.

A feature may also appear on multiple pages.

## Feature Versus Layout

A layout defines spatial structure.

A feature defines product behavior.

For example:

```tsx
<DashboardLayout>
    <NotificationPreferences/>
    <ProfileEditor/>
</DashboardLayout>
```

The layout owns spatial arrangement.

The features own their respective capabilities.

A feature should not absorb layout responsibilities simply because it happens to be rendered inside one particular page
structure.

## Feature Versus Shared UI

Shared UI contains generic visual or interaction primitives.

Examples include:

```tsx
<Button/>
<Dialog/>
<Input/>
<Tabs/>
<Popover/>
```

A feature consumes these primitives.

```tsx
function DeleteAccount() {
    return (
        <Dialog>
            <Button>Delete account</Button>
        </Dialog>
    );
}
```

The generic components do not need to know that the feature exists.

This direction preserves dependency ownership.

## Feature Versus Domain Model

A domain model represents domain concepts and rules.

A feature represents a user-facing capability built around those concepts.

For example:

```tsx
User
Order
Payment
Product
```

may be domain concepts, while:

```tsx
EditProfile
Checkout
PlaceOrder
SearchProducts
```

are capabilities.

A feature can depend on domain models without necessarily owning those models.

The exact separation depends on the application's architecture.

## Feature-Specific State

Feature-local state should normally remain inside the feature.

For example:

```tsx
function CheckoutForm() {
    const [step, setStep] = useState<CheckoutStep>("shipping");

    // ...
}
```

There is no architectural benefit in moving this state into a global store merely because it is used by several
components inside the same feature.

The feature can instead expose a feature-level Hook or component API.

```tsx
const checkout = useCheckout();
```

State ownership should remain as close as practical to the behavior that requires it.

## Feature State and Global State

Not every feature state should become globally accessible.

A useful distinction is:

* feature-local state belongs inside the feature
* shared application state belongs in an appropriate shared or application-level state mechanism
* server state belongs in a server-state abstraction
* URL state belongs to routing/navigation
* ephemeral UI state belongs near the relevant components

A feature boundary does not justify creating a feature-global store for every piece of state.

## Feature Hooks

A feature can expose custom Hooks as part of its public API.

```tsx
export function useCheckout() {
    // feature-specific behavior
}
```

This can be useful when several components within the feature need the same behavior.

However, a Hook does not automatically become public merely because it is defined inside the feature.

Internal Hooks should remain internal when consumers do not need them.

## Feature Reducers

A feature can use a reducer to model complex local state transitions.

```tsx
type Action =
    | { type: "next-step" }
    | { type: "previous-step" }
    | { type: "set-address"; address: Address }
    | { type: "submit-start" }
    | { type: "submit-success" }
    | { type: "submit-failure"; error: Error };
```

The reducer belongs to the feature when those transitions represent feature-specific behavior.

A generic reducer utility belongs elsewhere.

## Feature Data Fetching

A feature can coordinate acquisition of data required by its capability.

```tsx
function ProductSearch() {
    const {
        data,
        loading,
        error
    } = useProductSearch(query);

    // ...
}
```

The feature determines what data the capability needs.

The underlying data-fetching mechanism may remain shared.

For example, a feature can use a common HTTP client, query library, resource cache, or server-state abstraction without
owning those infrastructure mechanisms.

## Feature Server State

Feature slicing does not imply that server state belongs to a feature-local state store.

A product-search feature might consume server state from a shared cache:

```tsx
const products = useProducts(query);
```

The feature owns the capability of searching products.

The server-state mechanism owns concerns such as:

* cache identity
* request deduplication
* freshness
* invalidation
* synchronization

These are separate responsibilities.

## Feature Events

Features can expose semantic callbacks rather than leaking implementation details.

Prefer:

```tsx
<CheckoutForm
    onCompleted={handleCheckoutCompleted}
/>
```

over exposing internal state transitions:

```tsx
<CheckoutForm
    onDispatch={dispatch}
/>
```

The feature should define a meaningful contract with its consumers.

This keeps the internal implementation replaceable.

## Feature Dependencies

A feature should have explicit dependencies.

For example:

```tsx
features /
checkout /
```

may depend on:

```tsx
shared / ui
shared / api
domain / order
domain / payment
```

but those dependencies should not be hidden through arbitrary cross-feature imports.

The dependency graph should reflect architectural ownership.

## Cross-Feature Dependencies

Cross-feature dependencies require particular care.

Suppose:

```text
checkout
  depends on
cart
```

That relationship may be legitimate if checkout genuinely requires cart behavior.

However, reciprocal dependencies are dangerous:

```text
checkout
  depends on
cart

cart
  depends on
checkout
```

This creates a cycle in the feature graph.

Cyclic feature dependencies make ownership unclear and make independent evolution difficult.

## Avoiding Feature Cycles

When two features require the same concept, several solutions are possible.

The shared concept may belong in:

* a domain module
* a shared utility
* a shared UI primitive
* an application-level orchestration layer
* a lower-level capability

The correct destination depends on the semantics of the dependency.

Do not move code into `shared` merely to break a cycle if the code still semantically belongs to one feature.

Architectural ownership is more important than directory symmetry.

## Feature Public API

A feature's entry point can provide a deliberate API:

```tsx
export {CheckoutForm} from "./components/CheckoutForm";
export {useCheckout} from "./hooks/useCheckout";
```

Internal modules remain implementation details.

This is particularly useful in large applications because it prevents consumers from coupling themselves to internal
paths.

The public API should be kept small.

## Feature Encapsulation

Encapsulation is stronger when internal modules are inaccessible by convention or tooling.

For example, a project can enforce import restrictions so that:

```tsx
import {CheckoutForm} from "@/features/checkout";
```

is allowed while:

```tsx
import {checkoutReducer} from "@/features/checkout/state/checkoutReducer";
```

is prohibited outside the feature.

The exact enforcement mechanism depends on the build system and module architecture.

The architectural principle is independent of the tooling.

## Feature-Based Code Ownership

Feature slicing aligns naturally with organizational ownership.

A team responsible for checkout can own:

```text
checkout
```

without necessarily owning:

```text
search
profile
notifications
```

This can reduce coordination overhead because feature changes remain localized.

However, organizational boundaries should not be allowed to dictate poor technical boundaries. The feature model should
first represent coherent software responsibilities.

## Feature Evolution

A feature boundary is particularly valuable when a capability changes frequently.

For example, checkout might evolve independently from profile editing.

Keeping checkout-specific code together makes it easier to:

* understand the capability
* modify its behavior
* test it
* review changes
* locate related implementation
* identify dependencies
* remove the feature if necessary

Feature slicing is therefore primarily an organizational and dependency-management technique.

## Testing

Tests should normally be colocated with the feature they validate.

A feature can contain:

```text
CheckoutForm.test.tsx
useCheckout.test.ts
checkoutReducer.test.ts
```

Tests can verify the feature's public behavior rather than its internal implementation.

For example:

```tsx
render(<CheckoutForm/>);

await user.click(
    screen.getByRole("button", {
        name: "Place order"
    })
);

expect(
    screen.getByText("Order placed")
).toBeInTheDocument();
```

The test should generally assert the capability's observable contract.

Internal implementation details should not become accidental test contracts.

## Feature Integration Tests

Feature-level integration tests are valuable when several internal components cooperate.

A checkout test might cover:

* address selection
* payment selection
* validation
* submission
* success handling
* failure handling

without requiring every internal component to be tested through its private implementation.

This complements lower-level unit tests.

## Feature Reuse

Feature reuse should be evaluated carefully.

A feature is not necessarily reusable merely because it is stored in a `features` directory.

For example:

```tsx
<PasswordResetForm/>
```

may be reusable across several pages within one application.

A highly generic form primitive should instead belong to a lower-level reusable abstraction.

If a feature becomes genuinely reusable across applications, it may eventually deserve extraction into a library.

## Feature Extraction

A feature can reveal that some internal behavior is actually generic.

For example, if several features independently implement:

```tsx
useKeyboardNavigation()
```

the behavior may belong in a shared interaction abstraction.

Extraction should follow demonstrated reuse rather than speculative generalization.

Prematurely moving feature-specific logic into shared modules often creates abstractions with unclear ownership.

## Feature Components and Headless Components

A feature component can consume a headless component:

```tsx
function ProductFilter() {
    const select = useSelect({
        options
    });

    return (
        <FilterPresentation
            select={select}
        />
    );
}
```

The feature owns the product-filter capability.

The headless component owns reusable interaction behavior.

The two boundaries operate at different levels.

A headless component should not become feature-specific merely because one feature uses it.

## Feature Components and Container-Presentational Components

Feature slicing does not replace container-presentational decomposition.

A feature can contain both:

```text
feature
  orchestration
  presentation
```

when separating those concerns improves the implementation.

However, a feature does not need a container and presentational component merely to satisfy a structural rule.

The feature boundary is about capability ownership; container-presentational decomposition is about orchestration versus
rendering.

## Feature Components and Layout Components

A feature component should generally not own page-wide layout.

For example:

```tsx
function CheckoutPage() {
    return (
        <CheckoutLayout>
            <CheckoutForm/>
        </CheckoutLayout>
    );
}
```

The layout owns spatial structure.

The checkout feature owns checkout behavior.

This keeps visual composition separate from capability ownership.

## Feature Components and Provider Composition

A feature may require several providers.

For example:

```tsx
<CheckoutProviders>
    <CheckoutPage/>
</CheckoutProviders>
```

The feature can expose a provider composition boundary when those providers collectively establish the feature's
dependencies.

Provider composition remains responsible for assembling contexts; feature slicing remains responsible for defining the
capability boundary.

## Feature Components and Dependency Injection

Feature-specific dependencies can be injected rather than imported directly when this improves testing or architectural
flexibility.

```tsx
function CheckoutForm({
                          paymentService
                      }: {
    paymentService: PaymentService;
}) {
    // ...
}
```

Alternatively, a feature may consume a dependency from Context.

The important property is that the feature's dependency boundary remains explicit.

Dependency injection should not be introduced merely to make every import configurable.

## Feature Configuration

A feature may accept configuration when the capability genuinely has multiple supported variants.

```tsx
<CheckoutForm
    allowGuestCheckout
    availablePaymentMethods={methods}
/>
```

Configuration should represent legitimate variation.

Avoid exposing internal implementation details as configuration options.

An API containing dozens of flags often indicates that several distinct feature variants have been forced into one
abstraction.

## Feature Flags

Feature flags can control whether a capability is enabled.

```tsx
{
    flags.newCheckout && (
        <CheckoutForm/>
    )
}
```

The flag mechanism itself should remain separate from the feature's internal behavior where practical.

The feature can expose a stable capability while application-level code decides whether that capability is enabled.

## Feature Removal

Feature slicing also makes feature removal easier.

If a capability is isolated behind a clear boundary, deleting it should primarily involve:

* removing the feature
* removing its consumers
* removing dependencies used exclusively by it

Poorly sliced applications tend to leave feature logic distributed across generic component directories, global stores,
and unrelated utilities.

Feature ownership therefore has value during deletion as well as creation.

## Common Misuse

A common misuse is treating every screen as a feature.

A page such as:

```tsx
DashboardPage
```

may simply be an application composition rather than a capability.

Another misuse is creating a feature for every component:

```text
features/
  button/
  input/
  card/
```

These are usually shared UI primitives rather than product features.

Another misuse is placing generic utilities inside whichever feature happens to use them first.

If the utility has no feature-specific semantics, its ownership should be reconsidered.

Another misuse is creating enormous features that contain unrelated capabilities merely because they appear on the same
page.

For example, an `account` feature containing authentication, billing, notifications, security, and profile management
may become a monolith rather than a useful boundary.

## Avoiding Feature Monoliths

A feature should represent a coherent capability, not an entire business area by default.

If a feature contains:

* unrelated state
* unrelated APIs
* unrelated UI
* unrelated domain rules
* unrelated workflows

then the boundary is probably too broad.

Split according to meaningful capability boundaries rather than arbitrary file counts.

## Avoiding Global Components

A common anti-pattern is placing feature-specific components in a global `components` directory.

For example:

```text
components/
  CheckoutForm.tsx
  PasswordResetForm.tsx
  ProductSearch.tsx
```

This makes it difficult to determine ownership.

A component that implements checkout behavior should normally live with checkout unless there is a deliberate
architectural reason otherwise.

## Avoiding Global State by Default

Feature slicing does not require a global store.

A feature can own local state:

```tsx
const [step, setStep] = useState("shipping");
```

and expose only the behavior necessary to its consumers.

Global state should be introduced when the state genuinely crosses the appropriate ownership boundary.

## Avoiding Shared Everything

Another anti-pattern is moving code into `shared` whenever multiple modules import it.

Shared code should have a coherent abstraction and stable ownership.

The fact that two features happen to use the same implementation does not automatically mean that the implementation
belongs in a generic shared layer.

Semantic ownership should determine the boundary.

## Dependency Direction

A healthy feature architecture generally favors dependencies toward lower-level or more stable abstractions.

For example, a feature may depend on:

* shared UI
* shared infrastructure
* domain models
* common interaction primitives

while shared UI should not depend on a specific product feature.

The exact dependency graph varies by architecture, but the principle remains: lower-level reusable abstractions should
not acquire dependencies on higher-level feature capabilities.

## When to Use

Feature slicing is useful when:

* the application contains many independent product capabilities
* teams need clear ownership boundaries
* components currently live in large generic directories
* features change independently
* cross-feature dependencies need to be controlled
* implementation details should be encapsulated
* capabilities need coherent public APIs
* feature removal and extraction matter

## When Not to Use

Do not force feature slicing into:

* very small applications
* isolated prototypes
* applications with little independent feature behavior
* trivial component libraries
* codebases where the additional boundary adds more complexity than value

The pattern becomes valuable as the application's capability graph becomes difficult to reason about.

## Design Rules

1. Organize around coherent capabilities rather than arbitrary component categories.
2. Give each feature a clear ownership boundary.
3. Expose a deliberate public API.
4. Keep implementation details private to the feature.
5. Keep feature-specific behavior with the feature.
6. Keep generic UI primitives outside individual features.
7. Keep layout responsibilities outside feature behavior.
8. Keep server-state infrastructure separate from feature ownership.
9. Avoid cyclic feature dependencies.
10. Do not introduce global state merely because a feature contains multiple components.
11. Do not create a feature for every component.
12. Do not create enormous business-area features containing unrelated capabilities.
13. Extract genuinely generic abstractions only when their ownership is clear.
14. Prefer semantic dependencies over directory-based symmetry.
15. Test the feature through its observable capability contract.
16. Keep the feature's public API smaller than its internal implementation.
17. Allow features to consume lower-level reusable patterns without becoming coupled to their implementation.
18. Treat feature boundaries as architectural boundaries, not merely filesystem organization.

## Relationship to Other Patterns

Feature-Sliced Components define ownership around product capabilities.

Container-Presentational Components define separation between orchestration and rendering.

Headless Components define separation between reusable UI behavior and visual presentation.

Layout Components define spatial structure.

Compound Components define cooperating component APIs.

Custom Hooks define reusable React behavior.

Context and Provider Composition define mechanisms for distributing and assembling shared capabilities.

State Colocation and State Lifting define where state should be owned relative to component structure.

External Stores define state ownership outside React.

Server State defines management of remote authoritative state.

Feature slicing can therefore contain and compose these patterns rather than replacing them.

## Summary

Feature-sliced components organize React code around coherent user-facing capabilities. A feature owns the behavior,
state, UI, and supporting implementation that exist specifically to provide that capability while exposing a deliberate
public API to the rest of the application.

The pattern is primarily about **ownership, dependency direction, encapsulation, and change locality**. It does not
require every feature to have the same internal structure, nor does it require every feature component to be split into
containers and presentational components.

The core principle is: **code that implements a coherent product capability should have a coherent ownership boundary,
and consumers should depend on that feature through an explicit API rather than its internal implementation.**
