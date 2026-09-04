# Hydration Boundary

## Intent

The Hydration Boundary defines the portion of a server-rendered React application that must be activated on the client
so that previously produced UI becomes interactive.

Server rendering can produce HTML that the browser can display immediately, but the HTML alone does not provide
React-managed client behavior. Hydration connects the client React tree to the existing server-produced DOM and
establishes the runtime required for interaction.

The boundary is therefore concerned with the transition from **server-produced markup to client-managed UI**.

A hydration boundary is related to, but distinct from, a Client Component Boundary. A Client Component Boundary
determines which component code belongs in the client execution environment. A Hydration Boundary determines where
client-side React activation occurs.

## Basic Pattern

A server-rendered application can produce initial UI:

```tsx
export default function ProductPage() {
    return (
        <main>
            <ProductDetails/>
            <AddToCartButton/>
        </main>
    );
}
```

The browser initially receives HTML representing that UI.

A client-side React runtime then hydrates the interactive portion:

```tsx
"use client";

import {useState} from "react";

export function AddToCartButton() {
    const [added, setAdded] = useState(false);

    return (
        <button onClick={() => setAdded(true)}>
            {added ? "Added" : "Add to cart"}
        </button>
    );
}
```

Hydration does not mean rendering the page from scratch solely for visual output. Its purpose is to attach the
client-side React behavior to the existing server-produced result.

## Rendering and Hydration Are Different Operations

Server rendering and hydration solve different problems.

Server rendering produces output that can be displayed by the browser:

```text
Server component tree
→
HTML response
```

Hydration establishes client-side React behavior:

```text
Existing HTML
→
Client React tree
→
Interactive UI
```

The important distinction is that server rendering answers:

**What should the initial UI look like?**

Hydration answers:

**How does the browser take ownership of that UI as an interactive React application?**

## Hydration Does Not Mean Recreating the Entire UI

Hydration works against the DOM that already exists.

React must establish correspondence between the client-rendered component structure and the server-produced DOM.

For example:

```tsx
function Greeting() {
    return <h1>Hello</h1>;
}
```

The server can produce:

```html
<h1>Hello</h1>
```

The client then hydrates that existing structure rather than requiring the user to wait for a completely separate
client-rendered page before seeing the heading.

The exact reconciliation and optimization behavior depends on the React rendering architecture, but the architectural
distinction remains: hydration activates server-produced UI.

## Hydration Boundary

A hydration boundary identifies a region that requires client-side activation.

For example, a page can contain predominantly server-produced content with an interactive region:

```tsx
export function ProductPage() {
    return (
        <main>
            <ProductInformation/>

            <ProductActions/>
        </main>
    );
}
```

`ProductInformation` may remain server-oriented while `ProductActions` requires client activation.

The hydration scope should correspond to the smallest coherent region that requires client behavior.

## Hydration and Client Components

Client Components are eligible to participate in client-side execution, but the concepts should not be conflated.

A Client Component defines a client-executable component boundary.

Hydration concerns the process by which the client runtime attaches to server-produced UI.

A useful distinction is:

* Client Component Boundary: where client execution is required.
* Hydration Boundary: where server-produced UI becomes client-managed.
* Server Rendering: how initial UI is produced.
* Client Rendering: how UI is subsequently rendered by the browser.

These mechanisms interact, but they are not interchangeable concepts.

## Hydration Requires Compatible Output

The server and client must produce compatible initial UI.

For example:

```tsx
function Greeting() {
    return <p>Hello</p>;
}
```

should produce equivalent initial output on both sides.

If the server produces:

```html
<p>Hello</p>
```

while the client initially expects:

```html
<p>Goodbye</p>
```

React encounters a hydration mismatch.

The problem is not that the UI eventually cannot be rendered. The problem is that the server-produced DOM and the client
React tree disagree during hydration.

## Hydration Mismatch

A hydration mismatch occurs when the initial client render does not correspond to the server-rendered result.

For example:

```tsx
function CurrentTime() {
    return <span>{new Date().toLocaleTimeString()}</span>;
}
```

The server and browser can execute this code at different times and produce different values.

The server might produce:

```html
<span>10:30:00</span>
```

while the client initially produces:

```html
<span>10:30:02</span>
```

The resulting disagreement can cause a hydration mismatch.

The fundamental problem is nondeterministic initial output.

## Sources of Mismatch

Common causes include:

* current timestamps;
* random values;
* browser-only state;
* viewport-dependent rendering;
* locale differences;
* timezone differences;
* environment-dependent formatting;
* browser extensions modifying DOM;
* invalid HTML nesting;
* different data between server and client;
* conditional rendering based on client-only APIs;
* asynchronous data resolving differently;
* external mutable state changing between render phases.

The first client render should be deterministic relative to the server-produced result.

## Browser APIs During Initial Render

Browser-only APIs are a frequent source of mismatches.

Avoid:

```tsx
"use client";

function ThemeLabel() {
    const theme = localStorage.getItem("theme");

    return <span>{theme}</span>;
}
```

The server cannot necessarily access the same browser storage value.

Instead, establish a deterministic initial render and read browser state after client activation:

```tsx
"use client";

import {useEffect, useState} from "react";

function ThemeLabel() {
    const [theme, setTheme] = useState<string | null>(null);

    useEffect(() => {
        setTheme(localStorage.getItem("theme"));
    }, []);

    return <span>{theme ?? "Loading..."}</span>;
}
```

The initial client output can now correspond to the server output, with browser-specific information applied after
activation.

## `window`, `document`, and `navigator`

The same principle applies to browser globals:

```tsx
const mobile = window.innerWidth < 768;
```

or:

```tsx
const language = navigator.language;
```

or:

```tsx
const title = document.title;
```

These values can differ between environments or may not exist during server execution.

Browser-specific reads should not be allowed to produce an incompatible initial component tree.

## Deterministic Initial Rendering

A hydration-safe component should have a deterministic initial state.

For example:

```tsx
"use client";

function Counter() {
    const [count, setCount] = useState(0);

    return <button>{count}</button>;
}
```

The server and client can both initially produce:

```html

<button>0</button>
```

After hydration, client interaction can change the state.

The important property is not that the component never changes. It is that its **initial client output agrees with the
server output**.

## Hydration and Effects

Effects execute on the client after rendering.

This makes them appropriate for operations that must occur only after client activation.

```tsx
"use client";

useEffect(() => {
    document.title = "Products";
}, []);
```

The effect does not need to produce different initial markup.

This creates a useful architectural distinction:

* rendering establishes the initial UI;
* effects synchronize with client-only external systems after activation.

The Effect Synchronization pattern owns the synchronization logic; hydration owns the timing relationship between server
output and client activation.

## Hydration and Event Handlers

Server-produced HTML can display a button:

```html

<button>Add to cart</button>
```

but the HTML itself does not contain the React event behavior.

After hydration, the client React runtime can establish the corresponding interaction:

```tsx
<button onClick={addToCart}>
    Add to cart
</button>
```

This is why a page can appear visually complete before its interactive behavior is fully active.

The distinction is particularly important for applications where JavaScript loading or hydration is delayed.

## Progressive Interactivity

Hydration can be treated as an incremental activation concern.

A page may contain:

* immediately visible static content;
* interactive controls;
* secondary interactive regions;
* expensive widgets;
* components that are only needed after user interaction.

Not every region necessarily needs identical hydration timing or scope.

The architecture should avoid requiring the entire page to become equally interactive before any interaction is
possible.

## Hydration and Suspense

Suspense boundaries can partition asynchronous rendering and client activation behavior.

For example:

```tsx
<Suspense fallback={<ProductSkeleton/>}>
    <ProductRecommendations/>
</Suspense>
```

The boundary can allow React to coordinate incomplete or delayed rendering without requiring the entire surrounding UI
to wait.

Suspense and hydration are distinct concepts:

* Suspense represents rendering readiness and fallback behavior.
* Hydration represents client activation of server-produced UI.

They can cooperate to control when different regions become usable.

## Hydration and Streaming

Streaming allows server-rendered content to arrive incrementally.

A server-rendered application can therefore expose useful UI before the entire component tree has completed.

Hydration can then activate client-required regions as the necessary output and client code become available.

This means the application does not necessarily have one monolithic:

```text
render everything
→
send everything
→
hydrate everything
```

lifecycle.

Modern React architectures can coordinate rendering, streaming, loading, and hydration at finer granularity.

## Hydration and Server Components

Server Components do not require client hydration simply because they participate in the React tree.

Their purpose is to execute on the server and contribute to the resulting UI.

Client Components are the regions that require client-side React capabilities.

Therefore:

```tsx
export default async function Page() {
    const product = await getProduct();

    return (
        <>
            <ProductDetails product={product}/>
            <ProductActions productId={product.id}/>
        </>
    );
}
```

does not imply that `ProductDetails` and `ProductActions` have identical hydration requirements.

`ProductDetails` can remain server-oriented while `ProductActions` becomes interactive on the client.

## Hydration and Static HTML

Static HTML is displayable without React being active.

This provides an important resilience property.

If the initial document is already meaningful HTML, users can potentially see useful content before client-side
activation completes.

However, interactive behavior may remain unavailable until the relevant client code has loaded and hydration has
occurred.

Therefore, visual readiness and interactive readiness are different performance dimensions.

## Hydration Delay

A component can be visible before it is interactive.

For example:

```tsx
<button>Buy now</button>
```

may appear immediately while the client JavaScript responsible for its interaction is still loading.

This creates a period during which the UI is visually present but not yet fully operational.

Large client bundles, slow networks, expensive JavaScript execution, and broad hydration scopes can increase this
period.

## Hydration Cost

Hydration has a client-side cost.

The browser may need to:

* download JavaScript;
* parse JavaScript;
* evaluate modules;
* construct client component state;
* reconcile the existing DOM;
* establish event handling;
* initialize effects;
* initialize subscriptions;
* allocate application state.

Consequently, reducing unnecessary client code can improve hydration performance.

Hydration optimization is therefore not simply about making the server render faster.

## Hydration and Bundle Size

Hydration and bundle size are directly related but not identical.

Bundle size determines how much client code must be delivered and processed.

Hydration determines how that client runtime activates the corresponding UI.

A large client bundle can make hydration expensive even if the server rendered the page quickly.

Conversely, a well-scoped client bundle can reduce the amount of work required before interaction becomes available.

The Client Component Boundary owns the decision about which code belongs on the client. Hydration owns the activation of
that client-side UI.

## Hydration and Client Boundary Granularity

A broad client boundary can increase hydration work.

For example:

```tsx
"use client";

export function EntirePage() {
    return (
        <>
            <Header/>
            <ProductDetails/>
            <Reviews/>
            <Recommendations/>
            <ProductActions/>
        </>
    );
}
```

If only `ProductActions` requires interactivity, making the entire page client-side may cause unnecessary client work.

A narrower architecture is preferable:

```tsx
export function ProductPage() {
    return (
        <>
            <Header/>
            <ProductDetails/>
            <Reviews/>
            <Recommendations/>
            <ProductActions/>
        </>
    );
}
```

The interactive portion can then establish the required client boundary.

## Hydration and State Initialization

Client state must be initialized consistently with the server output.

Problematic:

```tsx
"use client";

function CartCount() {
    const [count] = useState(() => {
        return Number(localStorage.getItem("cart-count") ?? 0);
    });

    return <span>{count}</span>;
}
```

The server may not have access to the same value, producing different initial output.

A safer approach is to establish a deterministic initial state:

```tsx
"use client";

function CartCount() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(Number(localStorage.getItem("cart-count") ?? 0));
    }, []);

    return <span>{count}</span>;
}
```

Whether this is the ideal UX depends on the application, but it illustrates the architectural requirement: client-only
state should not silently alter the initial server/client render agreement.

## Hydration and External Stores

External stores require particular care because their values can change independently of React rendering.

A client component consuming an external store should use the appropriate React subscription mechanism rather than
reading mutable state arbitrarily during rendering.

The external-store pattern owns:

* subscription;
* snapshot consistency;
* update notification.

Hydration adds another requirement:

**The initial client snapshot must be compatible with the server-produced UI.**

If the external store changes between server rendering and hydration, the application must have a strategy for handling
that transition without producing inconsistent UI.

## Hydration and Context

Context values can influence rendered output.

For example:

```tsx
"use client";

const ThemeContext = createContext("light");

function ThemeLabel() {
    const theme = useContext(ThemeContext);

    return <span>{theme}</span>;
}
```

If the server produces the component with `"light"` while the client initially resolves `"dark"`, the rendered output
can differ.

Context providers that affect initial markup therefore need deterministic initial values across the server/client
transition.

## Hydration and Authentication State

Authentication state is another common source of mismatches.

A client component should not assume that its browser-side authentication state is necessarily identical to the server's
authenticated request context.

For example:

```tsx
const user = useClientAuth();

return user ? <Account/> : <Login/>;
```

If the server rendered `<Login />` but the client immediately renders `<Account />`, the initial trees disagree.

A robust architecture establishes a consistent initial authentication state and then updates it when client-side
information becomes available.

## Hydration and Responsive UI

Using browser dimensions directly during initial rendering can create mismatches:

```tsx
const mobile = window.innerWidth < 768;
```

Prefer CSS for purely presentational responsive behavior when possible.

For example, responsive layout should generally be expressed through CSS rather than requiring React to render entirely
different initial trees based on viewport width.

When behavior genuinely depends on viewport information, initialize deterministically and synchronize browser state
after client activation.

## Hydration and Randomness

Random values should not normally be generated independently on the server and client when they affect rendered output.

Problematic:

```tsx
function Avatar() {
    const color = Math.random();

    return <div data-color={color}/>;
}
```

The server and client can generate different values.

If randomness is part of the rendered result, the value should instead have a stable source that both environments can
agree on.

## Hydration and IDs

Generated identifiers must remain consistent across server and client rendering.

This is particularly important for accessibility relationships:

```tsx
<label htmlFor={inputId}>Email</label>
<input id={inputId}/>
```

The label and input must retain corresponding identifiers after hydration.

React provides mechanisms for generating IDs that are designed to remain consistent across server and client rendering.

The architectural principle is that identifiers participating in the initial DOM relationship must be hydration-safe.

## Invalid HTML

Hydration problems are not always caused by application state.

Invalid HTML nesting can cause the browser to construct a DOM that differs from the structure React expects.

For example, incorrect nesting of elements can be normalized by the browser before React attempts hydration.

The result is a mismatch between:

* the DOM actually constructed by the browser;
* the DOM structure React expects.

Valid HTML structure is therefore part of hydration correctness.

## Third-Party DOM Mutation

External scripts, browser extensions, analytics integrations, and other systems can modify the DOM independently of
React.

If those modifications occur before or during hydration, React may encounter a DOM that no longer corresponds to its
expected tree.

DOM ownership should therefore be explicit.

A React-managed subtree should not be casually mutated by unrelated code.

## Escape Hatches

There are cases where the server and client output are intentionally different.

React provides mechanisms for suppressing certain hydration warnings in narrowly controlled situations.

For example:

```tsx
<time suppressHydrationWarning>
    {new Date().toLocaleTimeString()}
</time>
```

This should be treated as an escape hatch rather than a general mismatch solution.

Suppressing a warning does not make inconsistent application state correct.

Use it only when the difference is intentional, localized, and semantically acceptable.

## Hydration and Error Recovery

Hydration mismatches can range from localized differences to substantial structural divergence.

When the initial trees cannot be reconciled as expected, React may need to recover by discarding or regenerating
portions of the client tree.

The exact recovery behavior depends on the React version and rendering architecture.

The architectural objective should not be to rely on recovery.

The objective is to produce deterministic server/client initial output wherever possible.

## Hydration Errors as Architectural Signals

Repeated hydration mismatches often indicate deeper architectural problems.

Typical causes include:

* unclear server/client ownership;
* browser state being read during rendering;
* duplicated state sources;
* nondeterministic rendering;
* inconsistent data loading;
* environment-specific formatting;
* uncontrolled DOM mutation;
* incorrect component boundaries.

A hydration warning should therefore not automatically be treated as a cosmetic problem.

It can indicate that the execution model of the component is poorly defined.

## Hydration and Data Fetching

Data used during initial rendering should be consistent between server output and client activation.

Problematic architectures can fetch different data independently:

```tsx
// Server
const products = await getProducts();
```

and then:

```tsx
// Client
const products = await fetch("/api/products");
```

If those requests return different results, the server HTML and initial client tree may disagree.

Prefer establishing a clear ownership model for initial data.

The client can subsequently refresh or revalidate data according to the application's server-state strategy.

## Hydration and Server State

Hydration does not replace server-state management.

Server state can change between:

1. server rendering;
2. HTML delivery;
3. JavaScript loading;
4. hydration;
5. subsequent client interaction.

A correct architecture must therefore tolerate normal data evolution after the initial render.

The initial hydration contract concerns consistency of the initial UI. Server-state management concerns what happens as
authoritative remote data changes afterward.

## Hydration and Caching

Caching can affect hydration indirectly.

If the server renders from one cached version of data and the client immediately fetches another version, the initial
outputs may differ.

The resource cache and server-state layers should therefore have clearly defined freshness semantics.

Hydration should not be responsible for hiding inconsistent data ownership.

## Hydration and Forms

Forms are especially sensitive to server/client disagreement.

For example:

```tsx
<input defaultValue={user.name}/>
```

can provide a deterministic initial value.

A controlled input:

```tsx
<input
    value={name}
    onChange={event => setName(event.target.value)}
/>
```

must also receive an initial value compatible with the server-rendered output.

Transitions between uncontrolled and controlled states should be avoided because they introduce a separate consistency
problem.

## Hydration and Progressive Enhancement

A server-rendered form can remain meaningful as HTML even before client JavaScript is active.

Client behavior can then enhance the interaction once hydration occurs.

This creates a useful separation:

* server output establishes baseline functionality or content;
* hydration adds richer client behavior.

Not every interaction must depend on JavaScript if the underlying platform can provide an adequate server-oriented
fallback.

## Hydration and Accessibility

Accessibility relationships must remain stable through hydration.

Important examples include:

* label/input relationships;
* `aria-labelledby`;
* `aria-describedby`;
* dialog relationships;
* menu relationships;
* focus targets;
* generated IDs.

A mismatch can do more than create a console warning. It can temporarily or permanently break accessibility
relationships.

Hydration correctness is therefore also an accessibility concern.

## Hydration and Event Timing

An interactive element may become visible before its event handlers are active.

Applications should avoid designs where a critical user action can silently disappear during the hydration window.

For high-value interactions, consider:

* progressive enhancement;
* server-supported fallbacks;
* minimizing client bundle size;
* reducing hydration scope;
* prioritizing critical client code.

The objective is not merely to make hydration complete eventually. It is to make important interactions available at an
appropriate time.

## Hydration and Performance

Hydration performance should be evaluated alongside:

* server response time;
* HTML delivery;
* JavaScript transfer;
* JavaScript parsing;
* JavaScript evaluation;
* hydration work;
* interaction readiness.

A fast server response does not guarantee a fast interactive experience.

Likewise, minimizing server-rendered HTML does not automatically minimize client work.

The architecture should optimize the complete rendering-to-interaction path.

## Hydration Boundary Placement

A useful decision process is:

1. Does this region need client-side React behavior?
2. Does it have event handlers, state, effects, refs, or browser dependencies?
3. Can the behavior be isolated to a smaller descendant?
4. Can the surrounding UI remain server-rendered?
5. Does the region need to be interactive immediately?
6. Can the region be progressively activated?
7. Does its initial client output deterministically match the server output?
8. Are its dependencies and state compatible with client execution?

The result should be a coherent hydration region rather than an arbitrary collection of components.

## Common Misuse

### Treating Hydration as Server Rendering

Hydration does not produce the initial server HTML.

It activates the client-side React application against already-produced UI.

### Making Everything Client-Side to Avoid Hydration Problems

Moving the entire application into client rendering may avoid some server/client mismatch scenarios, but it sacrifices
the architectural benefits of server rendering and does not solve the underlying state-design problem.

### Reading Browser State During Initial Render

```tsx
const theme = localStorage.getItem("theme");
```

can produce a different client result from the server.

### Using Current Time in Rendered Output

```tsx
<span>{new Date().toISOString()}</span>
```

can produce different values during server and client rendering.

### Using Random Values in Initial Markup

```tsx
const id = Math.random();
```

can create incompatible server/client output.

### Hiding Mismatches with Warning Suppression

Suppressing warnings without understanding the mismatch hides symptoms rather than correcting the architectural
inconsistency.

### Hydrating Large Static Regions

Making large amounts of static content client-managed increases client work without providing corresponding interaction
value.

### Assuming Visual Readiness Means Interactive Readiness

HTML can be visible before the corresponding React behavior has hydrated.

Critical interactions should account for this interval.

## Advantages

A well-designed hydration architecture provides:

* immediate server-rendered UI;
* progressive activation;
* controlled client execution;
* smaller interactive regions;
* better startup performance;
* clearer server/client responsibilities;
* opportunities for progressive enhancement;
* reduced unnecessary client work;
* more predictable initial rendering.

## Disadvantages

Hydration introduces additional architectural constraints:

* server and client output must remain compatible;
* initial state must be deterministic;
* browser-only state requires careful handling;
* client JavaScript must be delivered and executed;
* hydration can consume significant CPU;
* third-party DOM mutation can interfere;
* data can change between rendering and activation;
* debugging mismatches can be difficult.

Hydration is therefore not free merely because server rendering is used.

## When to Use

Hydration is appropriate when:

* server-rendered UI needs client-side React behavior;
* interactive components are rendered as part of the initial document;
* progressive enhancement is desired;
* server-produced HTML should become interactive without discarding the initial document.

## When Not to Rely on Hydration

Do not make hydration responsible for:

* authorization;
* server-side security;
* authoritative validation;
* server-only infrastructure;
* permanent client/server state synchronization;
* correcting nondeterministic rendering;
* hiding inconsistent data ownership.

Hydration is an activation mechanism, not an application architecture by itself.

## Design Rules

1. Keep the initial server and client output compatible.
2. Make initial rendering deterministic whenever possible.
3. Do not read browser-only state as an uncontrolled source of initial markup.
4. Keep hydration regions as small as practical.
5. Avoid hydrating static UI that does not require client behavior.
6. Treat hydration scope as a performance decision.
7. Do not confuse hydration with server rendering.
8. Do not confuse hydration with the Client Component Boundary.
9. Keep server-only dependencies outside the client execution graph.
10. Treat browser-visible state as distinct from server-authoritative state.
11. Use effects for client-only synchronization when appropriate.
12. Avoid random and time-dependent values in initial markup unless their values are explicitly coordinated.
13. Preserve stable IDs and accessibility relationships.
14. Avoid uncontrolled DOM mutation inside React-managed regions.
15. Treat hydration warnings as potential architectural defects rather than merely cosmetic messages.
16. Use warning-suppression mechanisms only for deliberate, localized differences.
17. Account for the period between visual rendering and interactive readiness.
18. Optimize the complete path from server rendering through client interactivity.

## Relationship to Other Patterns

**Client Component Boundary:** The Client Component Boundary determines where code must execute on the client. Hydration
concerns the activation of server-produced UI within that client-executable region.

**Server Components:** Server Components can produce UI without requiring client hydration for their server-side
responsibilities. Client-required descendants create the regions where client activation becomes relevant.

**Suspense Boundary:** Suspense coordinates rendering readiness and fallback behavior. Hydration concerns client
activation. They can be nested and coordinated but represent different lifecycle concerns.

**Streaming:** Streaming controls incremental delivery of server-rendered output. Hydration can progressively activate
client-required regions as the necessary output becomes available.

**Effect Synchronization:** Effects provide client-side synchronization with external systems. Hydration determines when
those client-side effects can begin participating in the application lifecycle.

**State Colocation:** State should remain owned by the narrowest component that needs it. Hydration adds the requirement
that client-owned initial state must be compatible with server-rendered output.

**Controlled Components:** Controlled inputs must receive compatible initial values during server rendering and
hydration. Controlled state ownership remains the responsibility of the controlled-component pattern.

**Uncontrolled Components:** Uncontrolled DOM state can sometimes provide useful progressive-enhancement behavior, but
hydration must still account for the relationship between existing DOM state and React's expected initial tree.

**External Store:** External stores introduce mutable state outside React. Their hydration strategy must provide a
compatible initial snapshot.

**Server State:** Server state can change after server rendering. Hydration establishes initial consistency;
server-state management handles subsequent synchronization.

**Resource Cache:** Resource caches affect which data is available during rendering and hydration. Cache semantics
remain separate from hydration mechanics.

**Client Component:** A Client Component identifies client-executable component code. Hydration activates the
corresponding server-produced UI in the browser.

**Client Component Boundary:** The client boundary determines the scope of browser execution. The hydration boundary
determines the scope of client activation.

## Summary

The Hydration Boundary defines where server-produced React UI becomes client-managed and interactive.

Its central requirement is **initial consistency**. The server must produce output that the client React tree can
correctly adopt. Browser-only state, randomness, time-dependent values, inconsistent data, invalid markup, and
uncontrolled DOM mutation can violate that contract.

Hydration should therefore be treated as an architectural phase rather than an invisible implementation detail.

The core rule is:

**Server rendering establishes the initial UI; hydration establishes client ownership of the UI. Keep the transition
deterministic, scoped, and no broader than the required client behavior.**
