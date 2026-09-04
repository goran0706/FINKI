# Client Component Boundary

## Intent

The Client Component Boundary defines the point in a React component tree at which execution, dependencies, and
responsibilities move from the server environment into the client environment.

The boundary is architectural, not merely a rendering optimization. A component placed on the client side becomes part
of the browser-executed application and therefore acquires access to browser capabilities such as event handlers,
client-side state, effects, refs, and browser APIs. It also introduces client-side code into the application bundle and
creates a boundary across which data and dependencies must be transferred.

The pattern is therefore concerned with deciding **where client execution begins**, not merely with deciding whether a
component happens to render on a server.

## Basic Pattern

A server-oriented component tree can contain a deliberate client boundary:

```tsx
import ProductList from "./ProductList";
import AddToCartButton from "./AddToCartButton";

export default async function ProductPage() {
    const products = await getProducts();

    return (
        <main>
            <ProductList products={products}/>

            <AddToCartButton productId={products[0].id}/>
        </main>
    );
}
```

The interactive component defines the point at which client-side behavior is required:

```tsx
"use client";

import {useState} from "react";

export default function AddToCartButton({
                                            productId,
                                        }: {
    productId: string;
}) {
    const [pending, setPending] = useState(false);

    return (
        <button
            disabled={pending}
            onClick={() => {
                setPending(true);
                addToCart(productId);
            }}
        >
            Add to cart
        </button>
    );
}
```

The important architectural decision is not the directive itself. The decision is that only the portion requiring
browser-side capabilities crosses into the client environment.

## The Boundary Is a Responsibility Boundary

The client boundary separates responsibilities according to their execution environment.

Server-side responsibilities commonly include:

* accessing databases;
* accessing private services;
* reading server-only configuration;
* performing authorization;
* preparing initial data;
* rendering non-interactive UI;
* executing server-side business logic.

Client-side responsibilities commonly include:

* responding to user events;
* maintaining transient interaction state;
* using browser APIs;
* running effects;
* managing client-side subscriptions;
* controlling focus;
* implementing immediate interactive behavior.

The boundary should therefore be placed according to **where a responsibility must execute**, rather than according to
component size or visual hierarchy.

## The Boundary Is a Dependency Boundary

Once a component becomes a Client Component, its dependency graph must be compatible with browser execution.

A client component cannot safely depend on arbitrary server-only modules:

```tsx
"use client";

import {getDatabase} from "@/server/database";

export function ProductEditor() {
    const database = getDatabase();

    // ...
}
```

The problem is architectural rather than syntactic. `getDatabase()` represents a server-side capability that does not
belong in the browser dependency graph.

A client component should instead depend on a client-safe abstraction:

```tsx
"use client";

import {useProducts} from "./useProducts";

export function ProductEditor() {
    const {products} = useProducts();

    // ...
}
```

The client-safe abstraction can communicate with the server through an appropriate application boundary.

## Boundary Propagation

A client boundary affects the component module graph beneath it.

If a component imports another component:

```tsx
"use client";

import SearchInput from "./SearchInput";
import ResultsList from "./ResultsList";

export function SearchPanel() {
    // ...
}
```

the imported components must be compatible with client execution as part of that client-side dependency graph.

This makes client boundaries substantially different from ordinary component composition. Composition describes how
components form a UI structure; the client boundary additionally determines **where the resulting dependency graph
executes**.

## Keep the Boundary Narrow

A common architectural mistake is marking a high-level component as client-side simply because one descendant requires
interactivity.

For example:

```tsx
"use client";

export function ProductPage() {
    // Large page implementation
}
```

may unnecessarily move a large portion of the component tree into the client environment.

Prefer isolating the interactive region:

```tsx
export function ProductPage() {
    return (
        <>
            <ProductDetails/>
            <ProductActions/>
        </>
    );
}
```

with only the required interactive component becoming client-side:

```tsx
"use client";

export function ProductActions() {
    // Interactive behavior
}
```

The principle is:

**Make the client boundary as small as the responsibility requires.**

## Client Boundaries and Bundle Size

A client boundary has bundle implications because client-executed code must be made available to the browser.

Moving unnecessary components and dependencies across the boundary can increase:

* JavaScript transferred to the browser;
* JavaScript parsed by the browser;
* JavaScript evaluated during startup;
* hydration work;
* client memory usage;
* dependency duplication;
* interaction startup cost.

The boundary should therefore be treated as a bundle-design decision.

A component does not become client-side merely because it is visually close to an interactive component.

## Client Boundaries and Interactivity

The strongest reason to establish a client boundary is usually browser interaction.

For example:

```tsx
"use client";

import {useState} from "react";

export function QuantitySelector() {
    const [quantity, setQuantity] = useState(1);

    return (
        <div>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                -
            </button>

            <span>{quantity}</span>

            <button onClick={() => setQuantity(q => q + 1)}>
                +
            </button>
        </div>
    );
}
```

The component requires client execution because it contains:

* client state;
* event handlers;
* immediate user interaction.

The surrounding product information does not necessarily require the same capabilities.

## Client Boundaries and Effects

Effects require a client execution environment.

```tsx
"use client";

import {useEffect} from "react";

export function DocumentTitle({title}: { title: string }) {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
}
```

The boundary should therefore remain close to the component that actually needs the effect.

A common mistake is moving an entire page into the client merely because one small effect is required.

Prefer:

```tsx
export function Page() {
    return (
        <>
            <Content/>
            <DocumentTitle title="Products"/>
        </>
    );
}
```

rather than making the entire page client-side.

## Client Boundaries and Browser APIs

Browser APIs are another direct reason for a client boundary.

```tsx
"use client";

import {useEffect, useState} from "react";

export function ViewportSize() {
    const [width, setWidth] = useState(() => window.innerWidth);

    useEffect(() => {
        const update = () => setWidth(window.innerWidth);

        window.addEventListener("resize", update);

        return () => {
            window.removeEventListener("resize", update);
        };
    }, []);

    return <span>{width}px</span>;
}
```

The component depends on `window`, an exclusively browser-side capability.

Server-oriented components should not acquire such dependencies merely to support a small interactive descendant.

## Client Boundaries and Refs

Refs are commonly used for browser-side interaction:

```tsx
"use client";

import {useRef} from "react";

export function SearchInput() {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <input ref={inputRef}/>
            <button onClick={() => inputRef.current?.focus()}>
                Focus
            </button>
        </>
    );
}
```

Focus management, DOM measurement, imperative browser APIs, and similar behaviors belong on the client side.

The general `ref` pattern is covered separately; the boundary concern here is simply that DOM interaction creates a
client-side responsibility.

## Passing Data Across the Boundary

Data crossing a client boundary must be representable in the mechanism used by the React environment and framework.

Prefer passing data:

```tsx
<ProductActions
    productId={product.id}
    price={product.price}
/>
```

rather than passing server-specific infrastructure:

```tsx
<ProductActions
    repository={productRepository}
    database={databaseConnection}
/>
```

The first establishes a data boundary. The second attempts to transfer server-side capabilities into a client component.

This distinction is fundamental:

**Pass the result of a server capability, not the capability itself.**

## Serialization

Client-boundary props generally need to satisfy the serialization constraints of the React/framework integration being
used.

Simple values are typically appropriate:

```tsx
<ProductActions
    productId="prod_123"
    quantity={2}
    enabled={true}
    labels={["Add", "Remove"]}
/>
```

Server-specific objects are not appropriate merely because JavaScript can represent them:

```tsx
<ProductActions
    database={database}
    request={request}
    socket={socket}
/>
```

A JavaScript value being representable in memory is not equivalent to being transferable across an execution boundary.

## Do Not Pass Infrastructure Across the Boundary

Infrastructure should remain owned by the environment in which it operates.

Examples include:

* database connections;
* filesystem handles;
* server request objects;
* private API clients;
* server credentials;
* process-level resources;
* server-only repositories;
* server-side service instances.

The client should receive the minimum data or capability necessary to perform its responsibility.

## Dependency Injection Across the Boundary

Dependency injection must respect execution environments.

A server-side dependency should normally be constructed and consumed on the server:

```tsx
const repository = new ProductRepository(database);

const products = await repository.findAll();
```

The resulting data can then be passed into the client boundary:

```tsx
<ProductFilters initialProducts={products}/>
```

Do not attempt to inject a server repository into browser code simply because the component needs access to product
data.

If the client needs an interactive data-access capability, provide a client-safe interface whose implementation
communicates with the server through the application's supported transport or action mechanism.

The important distinction is:

**Dependency injection distributes capabilities; the client boundary determines which capabilities are legal in the
browser environment.**

## Context Across Client Boundaries

Context is also affected by the execution environment.

A context provider containing client state generally belongs inside the client portion of the tree:

```tsx
"use client";

import {createContext, useState} from "react";

const CartContext = createContext(null);

export function CartProvider({
                                 children,
                             }: {
    children: React.ReactNode;
}) {
    const [items, setItems] = useState([]);

    return (
        <CartContext.Provider value={{items, setItems}}>
            {children}
        </CartContext.Provider>
    );
}
```

A server-rendered part of the application can contain the provider boundary while the provider itself owns client
behavior.

The provider's placement should be determined by the scope of the client state it owns.

This is an important distinction from simply making an entire application client-side.

## Provider Scope

Client providers should generally be placed as low as their consumers allow.

A provider containing interactive state at the application root can unnecessarily enlarge the client-side portion of the
application.

Prefer:

```tsx
<Page>
    <StaticContent/>

    <CartProvider>
        <Cart/>
    </CartProvider>
</Page>
```

when only the cart requires that state.

The provider-composition pattern concerns how multiple providers are structured; the client-boundary pattern concerns
whether those providers and their consumers execute in the client environment.

## Client Boundaries and Server Components

A Server Component can compose Client Components:

```tsx
export default async function Page() {
    const product = await getProduct();

    return (
        <Product>
            <ProductDetails product={product}/>
            <ProductActions productId={product.id}/>
        </Product>
    );
}
```

The server component can prepare data and include an interactive client component without becoming client-side itself.

This allows a component tree to combine:

* server-side data access;
* server-side rendering;
* client-side interaction;
* client-side state.

The boundary is therefore not necessarily a boundary between visually separate pages. It can exist deep inside a single
UI hierarchy.

## Client Boundaries and Server Component Children

A client component can receive server-rendered children in architectures that support this composition model:

```tsx
"use client";

export function InteractiveShell({
                                     children,
                                 }: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <section data-open={open}>
            {children}
        </section>
    );
}
```

This permits an interactive client shell to contain content whose implementation remains server-oriented.

The distinction is important: the client component does not automatically transform every conceptual child into
browser-executed application logic merely because the child is rendered inside it.

## Client Boundary and State Ownership

State should normally be owned by the environment that requires it.

Transient interaction state belongs naturally in the client:

```tsx
"use client";

const [isOpen, setIsOpen] = useState(false);
```

Server-authoritative data should not automatically be duplicated into client state merely because a component is
client-side.

For example, copying an entire server-provided dataset into local state creates a second source of truth:

```tsx
"use client";

const [products, setProducts] = useState(initialProducts);
```

That may be justified for an explicitly client-owned editing model, but it should not be the default.

The server/client distinction and the authoritative-state distinction are separate architectural concerns.

## Client Boundaries and Server State

Remote application data can be consumed by client components, but the client boundary does not itself define a
server-state strategy.

Client-side server-state concerns may include:

* caching;
* request deduplication;
* stale data;
* invalidation;
* optimistic updates;
* synchronization;
* retries.

Those concerns belong to the server-state architecture rather than to the boundary itself.

The boundary determines **where the consumer executes**; the server-state pattern determines **how remote authoritative
data is managed**.

## Client Boundaries and Forms

Forms frequently contain a mixture of server and client responsibilities.

A server-oriented component can render the structure and initial data:

```tsx
export default async function AccountPage() {
    const account = await getAccount();

    return <AccountForm account={account}/>;
}
```

A client component can own immediate interaction state:

```tsx
"use client";

import {useState} from "react";

export function AccountForm({
                                account,
                            }: {
    account: Account;
}) {
    const [name, setName] = useState(account.name);

    return (
        <form>
            <input
                value={name}
                onChange={event => setName(event.target.value)}
            />
        </form>
    );
}
```

The boundary should be placed around the smallest form region that actually requires client behavior.

## Client Boundaries and Headless Components

Headless components frequently require client execution because their purpose is often to coordinate:

* interaction state;
* keyboard handling;
* focus;
* accessibility state;
* event handling;
* DOM relationships.

For example, a headless combobox may expose behavior through client-side hooks or components while allowing the consumer
to control presentation.

The client boundary should surround the behavioral implementation rather than unnecessarily converting the entire
application feature into client-side code.

## Client Boundaries and Layout Components

A layout component does not inherently need to be client-side.

Static spatial composition:

```tsx
export function TwoColumnLayout({
                                    sidebar,
                                    content,
                                }: {
    sidebar: React.ReactNode;
    content: React.ReactNode;
}) {
    return (
        <div className="layout">
            <aside>{sidebar}</aside>
            <main>{content}</main>
        </div>
    );
}
```

does not require browser execution.

A layout that manages interactive behavior may require a client boundary:

```tsx
"use client";

export function ResizableLayout() {
    const [width, setWidth] = useState(320);

    // ...
}
```

The spatial role itself does not determine execution environment.

## Client Boundaries and Feature Architecture

Feature boundaries and execution boundaries are different dimensions.

A feature can contain both server and client components:

```text
feature/
  ProductDetails.tsx
  ProductActions.tsx
  ProductRepository.ts
  ProductService.ts
```

The feature boundary defines ownership of the capability. The client boundary defines which portion of that capability
must execute in the browser.

A feature should not be forced entirely into the client merely because one part of the feature is interactive.

## Client Boundary and Authentication

Authentication-sensitive information requires particular care.

Do not expose server-only authentication mechanisms or credentials to client code.

The server can establish the authenticated identity:

```tsx
export default async function AccountPage() {
    const user = await getAuthenticatedUser();

    return <AccountView user={user}/>;
}
```

The client receives only the information appropriate for browser exposure:

```tsx
<AccountView
    name={user.name}
    avatarUrl={user.avatarUrl}
/>
```

Authentication and authorization remain server-side security responsibilities even when the resulting UI is interactive.

## Client Boundary and Authorization

Client-side visibility is not authorization.

A client component may hide a control:

```tsx
{
    canDelete && <DeleteButton/>
}
```

but that does not establish permission to delete the resource.

The server must independently enforce authorization when the operation is performed.

The client boundary should therefore never be treated as a security boundary for protecting server resources.

## Client Boundary and Secrets

Private configuration must not cross into client code.

For example:

```tsx
"use client";

const apiKey = process.env.PRIVATE_API_KEY;
```

must not be treated as a mechanism for safely using server credentials in the browser.

Anything intentionally exposed to client-side code should be considered browser-visible.

The architectural rule is simple:

**A client boundary is an exposure boundary.**

## Client Boundary and Validation

Client-side validation improves interaction quality but does not replace authoritative server validation.

A client component can validate:

```tsx
"use client";

function validateEmail(value: string) {
    return /\S+@\S+\.\S+/.test(value);
}
```

The server must still validate data before performing a protected operation.

Client validation is an interaction concern; server validation is an authority concern.

## Client Boundary and Hydration

In server-rendered architectures, client components generally require client-side hydration or equivalent client
activation so that their interactive behavior becomes operational in the browser.

The resulting lifecycle should be considered when designing the boundary.

Large client boundaries can increase:

* hydration work;
* JavaScript execution;
* startup latency;
* memory consumption.

A server-rendered static region may not require equivalent client-side work.

Therefore, minimizing the client boundary can reduce not only transfer size but also client initialization work.

## Client Boundary and Rendering

A client component may participate in server rendering depending on the React/framework architecture, but its defining
property is that it is part of the client-executable component graph.

Therefore:

**Client Component does not mean “component that only renders in the browser.”**

It means the component is permitted and expected to participate in client-side execution.

This distinction prevents the common misconception that Server Components and Client Components are simply two mutually
exclusive rendering modes.

## Client Boundary and Code Splitting

A client boundary can also serve as an architectural unit for code splitting.

Large interactive capabilities can be isolated so that they do not unnecessarily become part of the initial client
bundle.

For example:

```tsx
const Editor = lazy(() => import("./Editor"));
```

can defer an expensive client capability until it is required.

Code splitting and client boundaries solve different problems:

* client boundaries determine execution environment;
* code splitting determines when client code is loaded.

They can be combined.

## Client Boundary Granularity

There are three common levels of granularity:

* application-wide client execution;
* feature-level client execution;
* component-level client execution.

Application-wide client execution is simple but often unnecessarily broad.

Feature-level boundaries can be appropriate when an entire feature is inherently interactive.

Component-level boundaries provide the narrowest client scope when only isolated interactions require browser execution.

The correct granularity depends on dependency relationships and state ownership, not on an arbitrary preference for
small components.

## Avoid Boundary Fragmentation

Making every tiny component independently client-side can also be counterproductive.

Excessive fragmentation can create:

* unnecessary architectural complexity;
* difficult dependency reasoning;
* excessive boundary management;
* duplicated client dependencies;
* harder debugging;
* unclear ownership.

The objective is not to maximize the number of boundaries.

The objective is to establish **the smallest coherent client execution regions**.

## Boundary Placement Heuristic

A useful decision sequence is:

1. Does the component require browser APIs?
2. Does it require client-side state?
3. Does it register event handlers?
4. Does it require effects?
5. Does it require DOM refs or imperative browser interaction?
6. Does one of its dependencies require client execution?
7. Can the responsibility instead remain server-side?
8. Can only a smaller descendant be moved across the boundary?

If the answer to the final question is yes, prefer the smaller boundary.

## Common Misuse

### Marking an Entire Page as Client-Side

```tsx
"use client";

export default function ProductPage() {
    // Everything becomes client-oriented.
}
```

This is often unnecessary when only a small section requires interaction.

### Making Server Dependencies Client-Safe by Accident

```tsx
"use client";

import {database} from "@/server/database";
```

Changing the component boundary does not transform a server-only dependency into a browser-safe dependency.

### Passing Server Infrastructure as Props

```tsx
<ClientComponent repository={repository}/>
```

The client should generally receive data or a client-safe capability, not the server infrastructure itself.

### Using Client Visibility as Authorization

```tsx
{
    isAdmin && <DeleteButton/>
}
```

This controls presentation, not authorization.

### Duplicating Server State

```tsx
const [data, setData] = useState(initialData);
```

This can be valid for client-owned editing state, but blindly copying authoritative server data creates synchronization
problems.

### Making Providers Global

A root-level client provider can cause a much larger portion of the application to become client-oriented than
necessary.

### Using Client State for Server Responsibilities

Moving authentication, authorization, database access, or authoritative business rules into client code because the UI
is interactive weakens the architecture.

## Advantages

A well-placed client boundary provides:

* explicit execution ownership;
* controlled browser exposure;
* smaller client dependency graphs;
* reduced client-side JavaScript;
* clearer server/client responsibilities;
* better separation of infrastructure;
* more deliberate hydration;
* improved ability to isolate interactive features;
* clearer security boundaries.

## Disadvantages

Client boundaries introduce additional architectural complexity.

The application must reason about:

* two execution environments;
* data transfer;
* serialization;
* dependency legality;
* client bundle composition;
* hydration;
* server/client state ownership;
* authentication exposure;
* caching;
* asynchronous coordination.

Poorly chosen boundaries can therefore make an application more difficult to understand rather than simpler.

## When to Use

Use a Client Component Boundary when:

* only part of a UI requires browser interaction;
* a feature needs client state;
* browser APIs are required;
* effects are required;
* refs or DOM interaction are required;
* a headless interactive component is introduced;
* a client-side subscription is required;
* client-only dependencies must be isolated;
* minimizing browser JavaScript is an architectural concern.

## When Not to Use

Do not introduce a client boundary merely because:

* a component renders visible UI;
* a component receives data;
* a component is visually complex;
* a component is part of a page;
* a component contains business data;
* a component is reusable;
* a component needs server-fetched data.

A component should become client-side because its responsibilities or dependencies require client execution.

## Design Rules

1. Place client boundaries where browser execution becomes necessary.
2. Keep client boundaries as narrow as practical.
3. Treat the boundary as a dependency boundary.
4. Never move server-only infrastructure into client code.
5. Pass data across the boundary instead of server infrastructure.
6. Treat browser-exposed values as non-secret.
7. Do not use client-side visibility as authorization.
8. Keep authoritative server validation on the server.
9. Place client state at the narrowest useful scope.
10. Avoid making an entire feature client-side when only one interaction requires it.
11. Avoid excessive fragmentation into tiny client regions.
12. Evaluate the bundle and hydration consequences of every large client boundary.
13. Keep execution responsibility aligned with capability ownership.
14. Use code splitting independently when loading timing requires it.
15. Distinguish execution boundaries from rendering, state, feature, and component-structure boundaries.

## Relationship to Other Patterns

**Server Components:** Server Components define server-executed components and provide the environment from which client
boundaries can be introduced. The Server Component pattern describes the server side; this pattern focuses specifically
on the transition into client execution.

**Component Composition:** Composition determines how components are assembled. A client boundary additionally
determines where part of that composition executes.

**State Colocation:** State colocation determines where state should be owned. When the state requires browser
execution, its owner necessarily belongs within a client boundary.

**Controlled Components:** Controlled components often require client execution because their authoritative state and
event handling occur in the client. The controlled-component pattern defines state ownership; the client boundary
defines execution environment.

**Effect Synchronization:** Effects require client execution. The effect pattern determines what external system is
synchronized; the client boundary determines where that synchronization can occur.

**Ref Pattern:** Refs that interact with DOM or browser resources require client execution. The ref pattern defines
reference usage; the boundary determines execution eligibility.

**Context Provider:** Context can distribute client state and dependencies inside a client execution region. The
provider pattern defines distribution; the client boundary defines the environment in which client capabilities can
operate.

**Dependency Injection Through Context:** Dependency injection can distribute client-safe dependencies through a client
boundary, while server dependencies remain server-side. The injection pattern defines capability distribution; the
boundary defines capability availability.

**Server State:** Server state describes remote authoritative data and its synchronization lifecycle. A client boundary
may contain the consumer of that state but does not define the server-state strategy.

**Resource Cache:** Resource caching defines resource identity, reuse, freshness, and invalidation. A client boundary
determines whether a particular cache implementation executes in the browser.

**Headless Components:** Headless components frequently require client execution for interaction and accessibility
behavior. The headless pattern defines behavior without presentation; the client boundary defines where that behavior
executes.

**Feature-Sliced Components:** Feature slicing establishes product-capability ownership. A feature can contain both
server and client components, with client boundaries separating browser-required responsibilities.

**Layout Components:** Layout is a spatial responsibility and does not inherently require client execution. Only
interactive layout behavior requires a client boundary.

**Provider Composition:** Provider composition organizes multiple context providers. Client boundaries determine which
provider scopes require browser execution.

**Lazy Components:** Lazy loading controls when client code is loaded. Client boundaries determine that the code belongs
to the client execution graph.

**Transition:** Transitions control update priority for client-side state updates. A transition therefore operates
inside a client execution region.

**Deferred Value:** Deferred values are a client-side rendering coordination mechanism and consequently belong within
client-executed components.

## Summary

The Client Component Boundary is the architectural boundary between server-oriented component execution and
browser-oriented component execution.

Its purpose is not simply to enable event handlers. It determines which portion of the component dependency graph
becomes client-executable, which dependencies can be imported, which values can cross the boundary, which capabilities
become browser-visible, and how much JavaScript must be delivered and initialized.

The most important rule is:

**Move only the responsibilities that require client execution across the boundary.**

A well-designed React application does not treat the server and client as competing rendering strategies. It treats them
as different execution environments and establishes explicit boundaries where responsibilities genuinely cross between
them.
