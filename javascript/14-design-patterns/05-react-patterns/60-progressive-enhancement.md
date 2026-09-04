# Progressive Enhancement

## Intent

Progressive Enhancement is the practice of designing a web interface around a functional baseline and then adding richer
capabilities when the execution environment supports them.

In a React application, this commonly means that server-rendered HTML, native browser behavior, and server-side
operations establish useful baseline functionality, while client-side React behavior enhances that baseline with richer
interaction, validation, navigation, optimistic updates, transitions, and other capabilities.

The central principle is:

**The enhanced experience should build on a functional baseline rather than making the baseline depend entirely on the
enhancement.**

Progressive enhancement is therefore an architectural strategy for separating essential functionality from optional
client-side behavior.

## Basic Pattern

A server-rendered form can establish the baseline:

```tsx
export function ContactForm() {
    return (
        <form method="post" action="/contact">
            <label>
                Email
                <input
                    name="email"
                    type="email"
                    required
                />
            </label>

            <label>
                Message
                <textarea
                    name="message"
                    required
                />
            </label>

            <button type="submit">
                Send
            </button>
        </form>
    );
}
```

The browser already understands:

* forms;
* inputs;
* validation attributes;
* submission;
* navigation;
* HTTP requests.

Client-side React can then enhance the same interaction:

```tsx
"use client";

import {useState} from "react";

export function ContactForm() {
    const [pending, setPending] = useState(false);

    return (
        <form
            action="/contact"
            onSubmit={() => {
                setPending(true);
            }}
        >
            <input
                name="email"
                type="email"
                required
            />

            <textarea
                name="message"
                required
            />

            <button disabled={pending}>
                {pending ? "Sending..." : "Send"}
            </button>
        </form>
    );
}
```

The client behavior improves the experience, but the underlying operation should remain meaningful independently of the
enhancement when the application architecture supports that model.

## Baseline and Enhancement

Progressive enhancement separates two levels of functionality.

The baseline contains functionality required for the application to remain useful.

The enhancement adds capabilities such as:

* immediate feedback;
* richer validation;
* client-side state;
* optimistic updates;
* animated transitions;
* partial updates;
* client-side navigation;
* keyboard shortcuts;
* richer widgets;
* background synchronization.

The baseline should not be confused with an intentionally impoverished experience.

A baseline can be fully functional while the enhanced experience is faster, smoother, or more interactive.

## HTML as the Baseline

The browser platform already provides substantial functionality.

Native HTML provides:

* links;
* forms;
* buttons;
* inputs;
* labels;
* validation;
* semantic structure;
* accessibility semantics;
* browser navigation;
* focus behavior.

React applications should preserve these capabilities where they remain appropriate.

For example, a navigation action can begin with a normal link:

```tsx
<a href="/products">
    Products
</a>
```

Client-side routing can subsequently enhance the navigation experience.

The client router should not be the only reason the link works.

## Native Browser Behavior

Progressive enhancement favors using browser capabilities as primitives rather than unnecessarily reproducing them in
JavaScript.

For example:

```tsx
<input
    type="email"
    required
/>
```

already provides browser-level validation behavior.

Client-side validation can provide richer feedback:

```tsx
"use client";

function validateEmail(value: string) {
    return /\S+@\S+\.\S+/.test(value);
}
```

The client implementation should enhance the native contract rather than accidentally replacing it with a less reliable
duplicate.

## Server-Side Operations

A server should remain capable of performing authoritative operations independently of client-side presentation.

For example:

```tsx
<form action="/checkout" method="post">
    <button type="submit">
        Complete purchase
    </button>
</form>
```

The server receives the request and performs:

* authentication;
* authorization;
* validation;
* business-rule enforcement;
* transaction processing.

Client-side behavior can add:

* pending indicators;
* optimistic feedback;
* confirmation UI;
* transition effects;
* improved error presentation.

The server remains the authority.

## Progressive Enhancement and React

React can provide progressively enhanced behavior without requiring every operation to be implemented as an entirely
client-owned workflow.

For example, a server-oriented page can contain a client-enhanced control:

```tsx
export function ProductPage() {
    return (
        <main>
            <ProductDetails/>
            <AddToCart/>
        </main>
    );
}
```

The product details can remain server-oriented while the cart interaction gains client behavior.

This preserves a useful separation between baseline content and enhanced interaction.

## Progressive Enhancement and Server Components

Server Components naturally support progressive enhancement because they can produce UI without requiring every
component to execute in the browser.

A server-oriented component can render:

```tsx
export default async function ProductPage() {
    const product = await getProduct();

    return (
        <main>
            <ProductDetails product={product}/>
            <ProductActions productId={product.id}/>
        </main>
    );
}
```

The page can establish its server-produced baseline while only `ProductActions` requires client-side capabilities.

Server Components and progressive enhancement are therefore complementary:

* Server Components reduce unnecessary browser execution.
* Progressive enhancement defines how richer browser behavior is layered onto a baseline.

Neither concept replaces the other.

## Progressive Enhancement and Client Component Boundaries

The Client Component Boundary determines where browser execution begins.

Progressive enhancement determines what the browser-side layer adds to the baseline.

For example:

```tsx
<ProductDetails/>
<ProductActions/>
```

can leave `ProductDetails` server-oriented while making `ProductActions` client-interactive.

The client boundary is therefore one implementation mechanism through which progressive enhancement can be achieved.

## Progressive Enhancement and Hydration

Hydration activates client-side React behavior against server-produced UI.

Progressive enhancement describes the architectural purpose of that activation: adding richer client behavior without
making the initial server-produced experience inherently dependent on it.

The distinction is:

**Hydration is a lifecycle mechanism. Progressive enhancement is a design strategy.**

A hydrated component is not automatically progressively enhanced.

For example, if the application produces no useful baseline behavior and requires JavaScript for every operation,
hydration alone does not constitute progressive enhancement.

## Baseline Functionality

The baseline should be defined explicitly.

For an article page, the baseline may be:

* readable content;
* normal links;
* accessible headings;
* server-rendered navigation.

For a form, the baseline may be:

* native input controls;
* submission;
* server-side validation;
* server-side error reporting.

For a search page, the baseline may be:

* a normal GET form;
* server-side search;
* server-rendered results.

For an interactive dashboard, the baseline may be more limited because some functionality inherently depends on client
execution.

Progressive enhancement does not require every application feature to work without JavaScript.

It requires the architecture to distinguish **essential functionality** from **optional enhancement**.

## Essential and Optional Capabilities

Not every capability has the same architectural importance.

Consider a search interface.

Essential:

```tsx
<form method="get" action="/search">
    <input name="q"/>
    <button type="submit">
        Search
    </button>
</form>
```

Enhanced:

```tsx
<SearchBox
    onSuggestions={showSuggestions}
    onInstantResults={updateResults}
/>
```

Autocomplete may improve usability, but search itself should remain conceptually independent of autocomplete.

This distinction makes failure behavior easier to reason about.

## Graceful Degradation

Progressive enhancement and graceful degradation are related but begin from different directions.

Progressive enhancement starts with a baseline and adds capabilities.

Graceful degradation often starts with a richer system and defines how it behaves when capabilities are unavailable.

In practice, a robust web architecture frequently uses both:

* define a functional baseline;
* add enhancements when available;
* degrade individual enhancements when they fail.

The terms should not be treated as interchangeable.

## JavaScript Failure

Progressive enhancement is particularly valuable when JavaScript is unavailable, delayed, blocked, or fails to
initialize.

A server-rendered link:

```html
<a href="/products">Products</a>
```

can remain functional without client JavaScript.

A form:

```html

<form action="/checkout" method="post">
    <button type="submit">Checkout</button>
</form>
```

can similarly use normal browser submission.

Client JavaScript can enhance those interactions but should not be the only possible path unless the functionality
fundamentally requires it.

## Slow JavaScript

JavaScript does not have to be completely unavailable to cause a degraded experience.

The application can be affected by:

* slow network transfer;
* large bundles;
* delayed parsing;
* delayed execution;
* long main-thread tasks;
* delayed hydration;
* code-splitting boundaries.

A useful server-rendered baseline can therefore improve the experience even when JavaScript eventually becomes
available.

## Offline and Intermittent Connectivity

Progressive enhancement does not automatically make an application offline-capable.

Offline behavior requires additional architecture such as:

* local persistence;
* service workers;
* client-side caches;
* synchronization queues;
* conflict resolution.

However, applications designed around a server-supported baseline can often fail more predictably when connectivity is
lost.

Offline-first architecture is a separate concern.

## Progressive Enhancement and Navigation

A normal link provides a strong baseline:

```tsx
<a href="/account">
    Account
</a>
```

Client-side navigation can enhance it:

```tsx
<Link href="/account">
    Account
</Link>
```

The exact routing API depends on the framework, but the architectural principle remains.

Navigation should have a valid destination independent of client-side transition behavior when the application can
support it.

This provides:

* deep-linkability;
* refreshability;
* shareable URLs;
* browser history integration;
* accessibility;
* resilience to client-side failures.

## Progressive Enhancement and Forms

Forms are one of the strongest examples of progressive enhancement because the browser already provides a complete
baseline interaction model.

A baseline form:

```tsx
<form method="post" action="/login">
    <label>
        Email
        <input name="email" type="email" required/>
    </label>

    <label>
        Password
        <input name="password" type="password" required/>
    </label>

    <button type="submit">
        Sign in
    </button>
</form>
```

can be enhanced with:

* pending state;
* inline validation;
* optimistic UI where appropriate;
* improved error display;
* client-side field state;
* transitions;
* richer submission feedback.

The server must remain responsible for authoritative authentication and validation.

## Progressive Enhancement and Form Actions

Modern React architectures can enhance form submission with client-side behavior while retaining a server-oriented
operation.

Conceptually:

```tsx
<form action={submitOrder}>
    <input name="quantity"/>
    <button type="submit">
        Place order
    </button>
</form>
```

The enhanced client experience can display pending state or update the UI without requiring the developer to reimplement
the complete HTTP form model.

The exact API for server actions or server functions depends on the React framework and version.

The architectural principle remains independent of the specific API:

**Keep the operation authoritative on the server while allowing the client to enhance how the operation is initiated and
represented.**

## Progressive Enhancement and Validation

Validation should exist at the appropriate authority level.

Client validation can provide immediate feedback:

```tsx
"use client";

function validateQuantity(value: string) {
    const quantity = Number(value);

    return quantity >= 1 && quantity <= 10;
}
```

Server validation must still enforce:

```text id="e3m2v9"
authentication
authorization
input validity
business constraints
resource availability
transaction rules
```

Client validation is an enhancement.

Server validation is authoritative.

## Progressive Enhancement and Optimistic UI

Optimistic UI is an enhancement that assumes an operation will succeed and updates the interface before confirmation.

For example:

```tsx
"use client";

function LikeButton() {
    const [liked, setLiked] = useState(false);

    return (
        <button
            onClick={() => setLiked(value => !value)}
        >
            {liked ? "Liked" : "Like"}
        </button>
    );
}
```

A production implementation must reconcile the optimistic state with the server result.

Progressive enhancement does not imply that optimistic state is correct. It means that optimistic behavior can improve
the experience while the server remains authoritative.

## Progressive Enhancement and Pending State

Pending indicators are a common client enhancement.

Baseline:

```tsx
<button type="submit">
    Save
</button>
```

Enhanced:

```tsx
<button type="submit" disabled={pending}>
    {pending ? "Saving..." : "Save"}
</button>
```

The enhanced version gives the user immediate feedback about the operation's state.

The underlying server operation remains the same.

## Progressive Enhancement and Transitions

Transitions can enhance perceived responsiveness without changing the application's fundamental operation.

For example, a client application can mark non-urgent UI updates as transitions:

```tsx
startTransition(() => {
    setQuery(nextQuery);
});
```

This is a client-side scheduling enhancement.

It should not become a requirement for the application to perform its fundamental server operation.

The Transition pattern owns update priority; progressive enhancement owns the relationship between baseline behavior and
optional client capabilities.

## Progressive Enhancement and Accessibility

Progressive enhancement should preserve semantic and accessible baseline behavior.

Prefer:

```tsx
<button type="button">
    Delete
</button>
```

over:

```tsx
<div onClick={deleteItem}>
    Delete
</div>
```

The native button already provides:

* keyboard activation;
* focus behavior;
* semantic meaning;
* accessibility integration.

Client behavior can enhance the button without replacing its semantic foundation.

Likewise, normal links should generally remain links rather than being replaced with generic clickable containers.

## Progressive Enhancement and Headless Components

Headless components often provide sophisticated client-side interaction behavior.

A headless menu may add:

* keyboard navigation;
* focus management;
* open/close state;
* ARIA state;
* active-item management.

The underlying interaction should still use appropriate semantic elements where possible.

Headless architecture defines behavior without prescribing visual presentation.

Progressive enhancement defines how richer behavior is layered onto a functional baseline.

The concepts are complementary rather than interchangeable.

## Progressive Enhancement and Accessibility Semantics

Client enhancement should preserve semantic relationships established by the baseline.

For example:

```tsx
<label htmlFor="email">
    Email
</label>

<input id="email" name="email"/>
```

A client-side enhancement should not replace this relationship with an arbitrary visual interaction that loses the
native semantics.

When JavaScript fails, accessibility should not collapse merely because the enhancement disappears.

## Progressive Enhancement and SEO

Server-rendered content can make important information available to crawlers without requiring client-side application
execution.

This can be useful for:

* public content;
* product information;
* documentation;
* articles;
* search pages;
* navigational structures.

SEO is not synonymous with progressive enhancement, however.

An application can be progressively enhanced without having SEO requirements, and a server-rendered application is not
automatically progressively enhanced.

## Progressive Enhancement and Deep Links

A progressively enhanced application should preserve meaningful URLs.

For example:

```tsx
<a href="/products/42">
    Product
</a>
```

allows direct navigation to the resource.

Client-side behavior can improve navigation performance without eliminating the underlying URL.

This supports:

* bookmarks;
* sharing;
* browser history;
* refresh;
* external navigation;
* non-JavaScript access.

## Progressive Enhancement and Error Handling

Enhanced behavior can fail independently from the baseline.

For example:

1. the server operation succeeds;
2. the client enhancement fails to update local UI;
3. the browser remains on the current page.

The architecture should define how the application recovers.

A server response, redirect, or subsequent navigation can provide a robust fallback.

This is preferable to assuming that every client-side state transition will always execute successfully.

## Progressive Enhancement and Server Errors

Server errors remain authoritative.

Client-side code should not hide a failed server operation by permanently displaying a successful state.

For example:

```tsx
setSaved(true);
```

should not be treated as proof that the server accepted the operation.

A robust enhancement reconciles client state with the actual server result.

## Progressive Enhancement and Security

Progressive enhancement does not change the application's security model.

Never rely on client-side behavior for:

* authorization;
* authentication;
* permission enforcement;
* input trust;
* transaction integrity;
* access control.

The server must enforce security constraints regardless of whether the request originated from:

* a native form;
* client-side React;
* an API client;
* another service.

The enhanced client is an untrusted execution environment from the server's perspective.

## Progressive Enhancement and State Ownership

The baseline should not create unnecessary duplicate state merely so that the enhanced client can reproduce the same
behavior.

For example, a server-rendered form does not necessarily need a complete client-side representation of every field
merely because React is available.

Client state should be introduced when it provides a concrete interaction benefit.

This keeps the enhanced layer smaller and reduces synchronization problems.

## Progressive Enhancement and Server State

Server state remains authoritative even when the client provides a rich interactive experience.

A client cache can improve:

* perceived latency;
* repeated access;
* background revalidation;
* optimistic interactions.

But the cache does not become the authority merely because the UI is client-side.

The Server State pattern owns synchronization with remote authoritative data.

## Progressive Enhancement and Resource Caching

Resource caches can make enhanced experiences faster by reusing previously acquired data.

For example, client-side navigation can reuse cached data rather than waiting for a complete new request.

However, caching is an optimization and lifecycle mechanism.

Progressive enhancement determines whether the cached client behavior is an enhancement over a baseline operation.

## Progressive Enhancement and Code Splitting

Client enhancements can be loaded only when necessary.

For example:

```tsx
const Editor = lazy(() => import("./Editor"));
```

can defer an expensive interactive feature.

This allows the baseline application to remain lightweight while advanced functionality is loaded when needed.

Code splitting determines loading strategy; progressive enhancement determines the architectural role of the client
capability.

## Progressive Enhancement and Lazy Interaction

A feature that is not needed immediately can be activated later.

Examples include:

* rich text editors;
* advanced filtering;
* charts;
* image editors;
* command palettes;
* secondary dialogs.

The baseline can expose a simpler representation or navigation path while the richer capability becomes available on
demand.

## Progressive Enhancement and JavaScript Availability

The application should explicitly classify which functionality requires JavaScript.

Some functionality is inherently client-side:

* WebGL rendering;
* real-time pointer interaction;
* complex drag-and-drop;
* browser media APIs;
* local device APIs.

For such features, the baseline may be limited to:

* explanatory content;
* server-rendered configuration;
* accessible fallback controls;
* alternative navigation;
* server-supported operations.

Progressive enhancement does not require pretending that every browser capability can be reproduced without JavaScript.

## Progressive Enhancement and Non-JavaScript Baselines

A no-JavaScript baseline can be useful, but it is not an absolute requirement.

The stronger architectural requirement is to define what the system considers essential.

For example, a collaborative canvas may fundamentally require JavaScript. Its baseline can still provide:

* document metadata;
* access information;
* static preview;
* downloadable representation;
* server-side export.

The enhanced canvas then provides the full interactive experience.

## Progressive Enhancement and Browser Capabilities

The enhancement layer can progressively use capabilities based on browser support.

Examples include:

* Web APIs;
* client-side storage;
* Web Workers;
* streaming APIs;
* intersection observers;
* view transitions;
* device APIs.

Feature detection should be used where browser support is not guaranteed.

The application should not assume that every client has identical capabilities.

## Feature Detection

Prefer capability detection over environment assumptions.

For example:

```tsx
if ("geolocation" in navigator) {
    // Use geolocation enhancement.
}
```

The baseline remains available when the capability is absent.

Feature detection should not be confused with user-agent detection, which is generally less reliable for determining
actual capabilities.

## Progressive Enhancement and Device Constraints

Client enhancement should consider device resources.

The same enhancement may behave differently on:

* low-end mobile devices;
* desktop systems;
* slow networks;
* high-latency connections;
* battery-constrained devices.

An architecture that assumes unlimited client resources can produce a poor experience despite technically successful
hydration.

Progressive enhancement provides a conceptual mechanism for keeping expensive capabilities optional.

## Progressive Enhancement and Performance

Progressive enhancement can improve performance by keeping the initial experience useful before all client code is
available.

Relevant performance dimensions include:

* time to first response;
* HTML delivery;
* first contentful paint;
* largest contentful paint;
* JavaScript transfer;
* hydration;
* interaction readiness;
* subsequent client transitions.

A fast initial document is valuable only if it provides meaningful content or functionality.

## Progressive Enhancement and Interaction Readiness

A visible interface is not necessarily ready for interaction.

A button may appear before its client event handler is active.

Progressive enhancement should therefore distinguish:

* content availability;
* baseline functionality;
* enhanced functionality;
* interactive readiness.

The goal is to avoid designing an interface whose essential actions depend on a large amount of optional JavaScript
becoming ready first.

## Progressive Enhancement and Failure Isolation

Enhancements should fail locally where possible.

For example, if a recommendation carousel fails to initialize, the core product page should remain usable.

This suggests a useful architectural rule:

**Optional enhancements should have limited failure domains.**

A failure in a nonessential client feature should not unnecessarily take down the baseline experience.

## Progressive Enhancement and Error Boundaries

Error boundaries can contain failures in client-side enhancements.

For example:

```tsx
<ErrorBoundary fallback={<BasicRecommendations/>}>
    <EnhancedRecommendations/>
</ErrorBoundary>
```

The exact implementation depends on the error-boundary architecture, but the principle is that optional client behavior
can have an explicit fallback.

Error boundaries own rendering failure containment; progressive enhancement defines why a fallback can preserve baseline
functionality.

## Progressive Enhancement and Suspense

Suspense can provide a fallback while an enhanced capability becomes ready:

```tsx
<Suspense fallback={<BasicSearch/>}>
    <EnhancedSearch/>
</Suspense>
```

This can allow the application to preserve a useful UI while richer functionality becomes available.

Suspense owns rendering readiness and fallback coordination.

Progressive enhancement owns the baseline-versus-enhancement relationship.

## Progressive Enhancement and Progressive Loading

Progressive loading controls when application resources become available.

Progressive enhancement controls what the application can do before those resources are available.

They can be combined:

1. render baseline content;
2. load the enhancement;
3. activate the enhancement;
4. preserve the baseline if enhancement activation fails.

This produces a more resilient execution model than requiring all functionality before any useful UI can operate.

## Progressive Enhancement and Progressive Disclosure

Progressive disclosure is a UX technique for revealing complexity gradually.

Progressive enhancement is an implementation and architecture strategy for layering capabilities.

They may be used together but should not be confused.

A menu that reveals advanced options is progressive disclosure.

A server-rendered menu that gains keyboard navigation and client-side transitions is progressive enhancement.

## Progressive Enhancement and Progressive Hydration

Progressive hydration describes activating client-side React behavior in stages or at appropriate boundaries.

Progressive enhancement is broader.

It can exist without React hydration at all because ordinary HTML and server behavior can be progressively enhanced by
many technologies.

Therefore:

**Progressive hydration is an implementation technique; progressive enhancement is the broader architectural
principle.**

## Common Misuse

### Making JavaScript the Baseline

```tsx
"use client";

function Application() {
    // Entire application requires client execution.
}
```

This may be valid for an inherently client-side application, but it should not be assumed to be progressive enhancement
merely because the UI eventually becomes interactive.

### Replacing Native Controls

```tsx
<div onClick={submit}>
    Submit
</div>
```

This removes native button behavior instead of enhancing it.

### Client Validation as Security

```tsx
if (!isValid) {
    return;
}

sendRequest();
```

Client validation does not establish server-side validity or authorization.

### Client State as Server Authority

```tsx
setSaved(true);
```

does not prove that the server successfully persisted the change.

### Requiring Hydration for Static Content

Static content should not become dependent on client activation merely because React is available.

### Hiding the Baseline

A client enhancement should not intentionally make the underlying functionality inaccessible whenever JavaScript is
delayed or unavailable unless the feature genuinely requires client execution.

### Excessive JavaScript

Adding client behavior to every interaction can increase bundle size, hydration cost, and failure surface without
providing meaningful user value.

### Confusing Progressive Enhancement with SSR

Server-side rendering can provide initial HTML without being progressively enhanced.

Progressive enhancement concerns the relationship between the baseline and additional capabilities.

### Confusing Progressive Enhancement with Graceful Degradation

Graceful degradation and progressive enhancement overlap but represent different design directions.

The important architectural concern is whether the application has a useful baseline and whether enhancements remain
optional.

## Advantages

Progressive enhancement provides:

* resilient baseline functionality;
* reduced dependence on JavaScript;
* improved behavior under slow loading;
* better accessibility foundations;
* stronger use of native browser capabilities;
* clearer server/client responsibilities;
* smaller mandatory client code;
* improved failure isolation;
* meaningful behavior before full client activation;
* better compatibility with direct navigation and browser primitives.

## Disadvantages

Progressive enhancement can require additional design effort.

The application may need to maintain:

* server-side baseline behavior;
* client-side enhanced behavior;
* consistent validation rules;
* consistent error semantics;
* multiple interaction states;
* fallback paths;
* synchronization between enhanced and baseline representations.

For highly interactive applications, maintaining a meaningful non-enhanced path may also provide little practical value
if the core functionality fundamentally requires client execution.

## When to Use

Use progressive enhancement when:

* the browser already provides a useful baseline capability;
* server-side operations can remain authoritative;
* client-side behavior provides optional usability improvements;
* JavaScript may be delayed or unavailable;
* accessibility and resilience are important;
* public content benefits from server-rendered availability;
* forms and navigation can use native browser primitives;
* expensive client capabilities should remain optional;
* the application should remain useful before full client activation.

## When Not to Force It

Do not force a non-JavaScript implementation when the feature fundamentally requires client capabilities.

Examples include:

* complex graphical editors;
* WebGL applications;
* advanced real-time collaboration interfaces;
* applications requiring device APIs;
* highly interactive client-side workspaces.

In such cases, progressive enhancement can still apply to surrounding functionality and fallback experiences, but the
core feature may legitimately require client execution.

## Design Rules

1. Establish a useful baseline before adding optional enhancement.
2. Prefer native browser capabilities when they already satisfy the baseline requirement.
3. Keep server-side operations authoritative.
4. Treat client validation as an enhancement, not a security mechanism.
5. Do not replace semantic HTML unnecessarily with JavaScript abstractions.
6. Preserve meaningful URLs and native navigation where appropriate.
7. Keep essential functionality independent from optional client behavior when practical.
8. Isolate failures in optional enhancements.
9. Keep expensive client capabilities optional when possible.
10. Use feature detection for optional browser capabilities.
11. Do not confuse progressive enhancement with server rendering.
12. Do not confuse progressive enhancement with hydration.
13. Do not confuse progressive enhancement with progressive disclosure.
14. Do not create duplicate client state without a concrete reason.
15. Reconcile optimistic client state with authoritative server results.
16. Preserve accessibility semantics through enhancement.
17. Design the baseline according to actual product requirements rather than treating “no JavaScript” as an absolute
    rule.
18. Let inherently client-side features remain client-side while progressively enhancing the surrounding application.

## Relationship to Other Patterns

**Client Component Boundary:** The client boundary determines where browser execution begins. Progressive enhancement
determines what additional behavior is layered onto the baseline.

**Hydration Boundary:** Hydration activates client-side React behavior against server-produced UI. Progressive
enhancement describes why that activation should enhance rather than unnecessarily replace the baseline.

**Server Components:** Server Components can provide server-oriented UI and data preparation while client components add
interaction. Progressive enhancement uses this separation to keep browser execution focused on actual enhancements.

**Server State:** Server state remains authoritative even when the client provides optimistic or cached behavior.
Progressive enhancement defines the client behavior as an enhancement rather than a replacement for server authority.

**Resource Cache:** Client caching can make enhanced interactions faster. The cache is an implementation mechanism for
reuse and freshness; progressive enhancement defines its role relative to the baseline.

**Form State:** Form state manages values, validation, submission state, and related metadata. Progressive enhancement
determines which of those capabilities must exist in the baseline and which can be added through client behavior.

**Controlled Components:** Controlled inputs can provide richer client interaction. Progressive enhancement does not
require every form input to become controlled.

**Uncontrolled Components:** Native browser-managed form behavior can often provide a strong baseline. Client behavior
can enhance it when additional state management is justified.

**Transition:** Transitions can improve the responsiveness of client-side updates. They are an enhancement mechanism
rather than the baseline operation itself.

**Deferred Value:** Deferred values can improve responsiveness for expensive client rendering. They optimize an enhanced
client experience rather than defining the baseline.

**Lazy Components:** Lazy loading can delay optional client capabilities until needed. This supports progressive
enhancement by keeping advanced behavior out of the initial client workload.

**Error Boundary:** Error boundaries can isolate failures in enhanced regions and preserve fallback UI. Error
containment is the mechanism; progressive enhancement defines the fallback relationship.

**Suspense Boundary:** Suspense can coordinate readiness of enhanced UI and display fallbacks. Progressive enhancement
determines whether that fallback represents a useful baseline.

**Headless Components:** Headless components provide reusable interaction and accessibility behavior without prescribing
presentation. Progressive enhancement determines whether that behavior is an optional layer over a baseline.

**Layout Components:** Layout defines spatial organization and does not inherently imply client enhancement. A layout
can remain entirely server-rendered unless interactive behavior requires otherwise.

**Feature-Sliced Components:** Feature slicing defines ownership boundaries. A feature can contain a baseline
implementation and one or more enhanced client capabilities without making the entire feature client-side.

## Summary

Progressive Enhancement is the architectural strategy of establishing useful functionality first and layering richer
capabilities on top.

In a React application, this commonly means using server rendering, semantic HTML, native browser behavior, and
server-side operations as the baseline while adding client-side state, interaction, transitions, optimistic behavior,
enhanced validation, client navigation, and other capabilities where they provide concrete value.

The strategy does not require every application to work without JavaScript. Some features inherently require client
execution. The important distinction is between **what the application fundamentally needs** and **what JavaScript can
improve**.

The core rule is:

**Make the baseline functional, make enhancements additive, and keep the authoritative operation independent of the
enhancement whenever practical.**
