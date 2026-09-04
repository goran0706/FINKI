# Server Components

Server Components are React components whose rendering and execution occur on the server rather than in the browser.
They allow a component tree to access server-side resources directly and produce a representation that can be integrated
into the client-rendered React application without shipping the component's implementation to the browser.

The pattern separates components that need browser execution from components that can remain server-side.

A Server Component can perform server-side data access, read server-available resources, compose other Server
Components, and render their results while keeping server-only implementation details out of the client bundle.

Server Components are not the same thing as server-side rendering. Server-side rendering determines where React
rendering occurs for a particular render. Server Components determine which components belong to the server-executed
portion of the component architecture.

## Intent

Use Server Components when a component can perform its work on the server and does not require browser-side React
execution.

Typical candidates include components that:

* read server-side data
* access server-side resources
* render data-heavy content
* compose other server-rendered UI
* contain implementation details that should not be shipped to the browser
* do not require client-side interaction
* can benefit from reducing client-side JavaScript

The primary architectural boundary is between **server-executed component logic** and **client-executed component
logic**.

## Basic Pattern

A Server Component can perform server-side work and render the resulting UI:

```tsx id="4n7q1x"
async function ProductPage() {
    const product = await getProduct();

    return (
        <main>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
        </main>
    );
}
```

The component itself does not need to move the data-fetching operation into a browser-side Effect.

A Server Component can also compose another component:

```tsx id="g4e8kp"
async function ProductPage() {
    const product = await getProduct();

    return (
        <main>
            <ProductDetails product={product}/>
            <AddToCart productId={product.id}/>
        </main>
    );
}
```

Here, `ProductDetails` can remain server-side while `AddToCart` can represent an interactive client-side boundary.

## Server and Client Components

A React application using Server Components can contain both Server Components and Client Components.

The two types have different execution requirements.

A Server Component can:

* execute on the server
* access server-side resources
* perform server-side data acquisition
* render other Server Components
* pass serializable data to Client Components

A Client Component can:

* execute in the browser
* use client-side interactivity
* respond to browser events
* use browser APIs
* use client-side state and Effects

The architectural goal is not to eliminate Client Components.

The goal is to place each component on the side of the boundary where its responsibilities belong.

## Client Boundary

Frameworks that support Server Components commonly use an explicit client boundary.

For example:

```tsx id="1yd0e9"
"use client";

import {useState} from "react";

export function AddToCart({
                              productId
                          }: {
    productId: string;
}) {
    const [pending, setPending] = useState(false);

    // ...
}
```

The directive is interpreted by the framework's Server Components integration and establishes that the module belongs to
the client side of the component graph.

The exact syntax and build behavior are framework-dependent.

The architectural concept is the client boundary itself.

## The Client Boundary Is a Dependency Boundary

Once a module becomes a Client Component entry point, its dependencies must be compatible with client execution.

For example:

```tsx id="1i3d5q"
"use client";

import {createDatabaseClient} from "./database";
```

is problematic if `createDatabaseClient` depends on server-only capabilities.

The client boundary therefore establishes more than a rendering distinction.

It also establishes a dependency boundary.

Server-only modules should not leak into the client dependency graph.

## Server Components Can Render Client Components

A Server Component can include a Client Component:

```tsx id="4p9r6k"
async function ProductPage() {
    const product = await getProduct();

    return (
        <main>
            <ProductDetails product={product}/>
            <AddToCart productId={product.id}/>
        </main>
    );
}
```

The Server Component determines the composition and provides data to the Client Component.

The Client Component then handles browser-side interaction.

This allows a mostly server-rendered feature to contain small interactive islands of client behavior.

## Client Components Cannot Arbitrarily Import Server Components

The dependency relationship is intentionally asymmetric.

A Server Component can compose Client Components.

A Client Component cannot generally import a Server Component as though it were an ordinary client-side module.

The reason is architectural: the client cannot simply execute a server-only component and its dependencies in the
browser.

Server Components instead participate in the server-generated component result consumed by the client-side React
runtime.

## Passing Data Across the Boundary

Server Components can pass supported values to Client Components.

```tsx id="o4g7jw"
async function ProductPage() {
    const product = await getProduct();

    return (
        <AddToCart
            productId={product.id}
            name={product.name}
        />
    );
}
```

The boundary therefore acts as a data contract.

The values crossing the boundary must satisfy the serialization and transport constraints of the Server Components
implementation being used.

Do not treat the boundary as though arbitrary JavaScript objects can be transferred without restriction.

## Serialization

A Server Component and Client Component do not necessarily execute in the same JavaScript environment.

Consequently, the values crossing the boundary require a representation that the framework and React Server Components
protocol can transmit.

Avoid passing values that depend on server-local identity or runtime state.

For example, this is generally the wrong abstraction:

```tsx id="w0e9lr"
<ClientComponent
    databaseConnection={connection}
/>
```

The client should instead receive the data or client-safe capability it actually requires.

```tsx id="9c7d2n"
<ClientComponent
    products={products}
/>
```

Server infrastructure remains on the server.

## Server-Only Dependencies

Server Components are useful for keeping server-only dependencies out of the browser.

For example:

```tsx id="x6j0bd"
import {database} from "@/server/database";

export async function UserList() {
    const users = await database.user.findMany();

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    {user.name}
                </li>
            ))}
        </ul>
    );
}
```

The database implementation remains part of the server-side dependency graph.

A Client Component should not import that database module merely because it needs the resulting data.

## Secrets

Server Components can access server-side configuration that must not be exposed to the browser, subject to the
framework's server/client isolation guarantees.

For example, a server-side service can use a private credential:

```tsx id="a4y5kv"
async function getPrivateData() {
    return apiClient.get("/private-resource", {
        headers: {
            Authorization: process.env.API_TOKEN
        }
    });
}
```

The credential should remain inside the server-side dependency graph.

A Client Component should receive the resulting data rather than the secret.

Server Components therefore provide a useful architectural boundary for server-only capabilities, but application and
framework configuration must still enforce that those modules cannot enter the client bundle.

## Data Fetching

Server Components can acquire data directly during server execution.

```tsx id="cx9f3m"
async function UserProfile({
                               userId
                           }: {
    userId: string;
}) {
    const user = await getUser(userId);

    return (
        <section>
            <h1>{user.name}</h1>
        </section>
    );
}
```

This differs from a browser-side component that must first render, execute an Effect or client-side data-fetching
mechanism, wait for the request, and then update its state.

Server Components can therefore move data acquisition closer to the component that consumes the data.

The data-fetching strategy itself remains a separate concern.

## Request Waterfalls

Server Components do not automatically eliminate request waterfalls.

This structure can still create sequential work:

```tsx id="e8s5q2"
async function Page() {
    const user = await getUser();

    return (
        <Profile user={user}/>
    );
}

async function Profile({
                           user
                       }: {
    user: User;
}) {
    const orders = await getOrders(user.id);

    // ...
}
```

If independent data can be acquired concurrently, the implementation should model that explicitly.

```tsx id="9v5h6q"
async function Page() {
    const userPromise = getUser();
    const productsPromise = getProducts();

    const [user, products] =
        await Promise.all([
            userPromise,
            productsPromise
        ]);

    // ...
}
```

Server execution changes where the work occurs; it does not automatically optimize dependency ordering.

## Async Server Components

Server Components can naturally represent asynchronous rendering work.

```tsx id="j4f7mt"
async function ProductList() {
    const products = await getProducts();

    return (
        <ul>
            {products.map(product => (
                <li key={product.id}>
                    {product.name}
                </li>
            ))}
        </ul>
    );
}
```

The component can suspend while the server-side work completes.

The surrounding rendering architecture can determine how that suspended work is streamed or represented to the client.

## Suspense

Server Components can be composed with Suspense boundaries:

```tsx id="7d8q1n"
<Suspense fallback={<ProductListSkeleton/>}>
    <ProductList/>
</Suspense>
```

This allows independently resolving portions of the component tree to participate in progressive rendering.

Suspense remains a rendering-readiness mechanism.

Server Components determine where the component logic executes.

The two patterns are complementary rather than interchangeable.

## Streaming

Server rendering can stream progressively available output rather than waiting for the entire component tree to finish.

A Server Component architecture can therefore benefit from:

* progressive rendering
* independent asynchronous subtrees
* Suspense boundaries
* incremental delivery

The exact transport and streaming behavior depends on the framework and deployment architecture.

Streaming does not mean that every component is delivered independently as ordinary HTML. Server Components participate
in a React-specific component payload and rendering process.

## Server Components and SSR

Server Components and server-side rendering solve different problems.

SSR can render Client Components on the server to produce initial output while their component code remains part of the
client application.

Server Components instead define components that execute as server-side components and do not need their implementation
shipped to the browser.

A Client Component can therefore participate in SSR while still being a Client Component.

This distinction is fundamental.

## Server Components and Static Rendering

A Server Component can participate in statically generated output when its data and rendering requirements permit it.

Static rendering, dynamic server rendering, and Server Components are separate architectural dimensions.

A Server Component does not inherently mean:

* static
* dynamic
* cached
* uncached
* streamed

Those behaviors depend on the surrounding rendering and data architecture.

## Server State

Server Components can read server-side data, but they do not automatically define client-side server-state management.

For example:

```tsx id="3qg1t0"
async function Orders() {
    const orders = await getOrders();

    return <OrderList orders={orders}/>;
}
```

This obtains server data for rendering.

If a Client Component needs:

* client-side refetching
* mutation synchronization
* cache invalidation
* optimistic updates
* background refresh

those concerns require an appropriate client-side or server-side state architecture.

Server Components and server-state management are therefore related but distinct.

## Resource Caching

Repeated server-side requests can benefit from resource caching or request memoization where supported by the framework
or application architecture.

For example, multiple Server Components may depend on the same logical resource.

The caching layer can prevent redundant work while the components remain focused on rendering.

Caching semantics must be explicit.

Do not assume that because a function executes on the server, its result is automatically cached.

## Request Scope

Server Components execute in a server request or rendering environment.

Request-specific information may include:

* authenticated identity
* request headers
* cookies
* locale
* route parameters
* request metadata

Server-side dependencies that consume such information must be scoped appropriately.

Request-specific mutable state should not accidentally become process-global shared state.

## Authentication

Server Components can read authentication information on the server when the framework exposes the appropriate request
context.

For example:

```tsx id="8c7x9v"
async function AccountPage() {
    const user = await getCurrentUser();

    if (!user) {
        return <SignInPrompt/>;
    }

    return (
        <AccountDetails user={user}/>
    );
}
```

The server can determine whether protected content should be rendered.

Authentication and authorization remain application-level security concerns. Rendering a component on the server does
not by itself establish authorization.

Authorization should be enforced at the appropriate server-side resource boundary.

## Authorization

A Server Component should not be treated as the authorization boundary merely because it executes on the server.

For example:

```tsx id="x1v6t9"
async function AdminPanel() {
    const user = await getCurrentUser();

    if (!user?.isAdmin) {
        return <Forbidden/>;
    }

    return <SensitiveData/>;
}
```

The UI check is useful for controlling rendering.

The underlying server operation must still enforce authorization independently.

A Client Component cannot be trusted as a security boundary, and neither should presentation logic alone.

## Mutations

Server-side mutations can be coordinated with Server Components through framework-supported mechanisms.

A common architecture is:

```tsx id="g7q2mj"
async function createOrder(input: OrderInput) {
    // server-side mutation
}
```

The server performs the authoritative operation.

The Client Component can initiate the interaction, while the server remains responsible for validation, authorization,
persistence, and other security-sensitive work.

The exact mutation mechanism is framework-dependent.

## Server Functions and Actions

Frameworks built around React Server Components can provide mechanisms for invoking server-side functions from client
interactions.

Conceptually:

```tsx id="2q6w5m"
"use server";

export async function createOrder(
    input: OrderInput
) {
    // validate
    // authorize
    // persist
}
```

A client-facing component can initiate the operation through the framework's supported integration.

The important architectural distinction is that invoking server-side behavior does not turn the server function into a
client dependency.

The implementation remains server-side.

## Validation

Server-side validation remains necessary even when the client performs its own validation.

```tsx id="h7c2wq"
async function createOrder(input: OrderInput) {
    const validated = validateOrder(input);

    // authorization
    // persistence
}
```

Client validation exists primarily for user experience.

Server validation protects the actual system boundary.

Server Components do not eliminate the need for server-side validation.

## Error Handling

Server-side failures need an explicit rendering and recovery strategy.

Possible failures include:

* data access errors
* authorization failures
* unavailable services
* invalid input
* rendering failures
* server configuration failures

Error boundaries can isolate rendering failures:

```tsx id="y2x4md"
<ErrorBoundary>
    <Orders/>
</ErrorBoundary>
```

The exact server/client behavior depends on the framework.

The important separation is between:

* server operation failures
* rendering failures
* client interaction failures

They should not be conflated.

## Loading States

Loading UI can be represented through Suspense boundaries or framework-specific loading mechanisms.

```tsx id="n3k7bh"
<Suspense fallback={<OrdersSkeleton/>}>
    <Orders/>
</Suspense>
```

A Server Component does not necessarily need to manage an explicit `loading` boolean.

The rendering architecture can represent readiness independently of application state.

## Client State

A Server Component should not own browser-interaction state.

For example:

```tsx id="q5c8vd"
const [open, setOpen] = useState(false);
```

requires a Client Component.

If a component needs:

* click handlers
* browser event handlers
* local interactive state
* client-side Effects
* browser APIs

it belongs on the client side of the boundary.

A Server Component can render the surrounding structure and delegate interactive portions to Client Components.

## Browser APIs

Server Components cannot depend on browser-only APIs such as:

```tsx id="r2h6qk"
window
document
localStorage
navigator
```

unless the code executes within an appropriate client boundary.

A component that directly requires browser APIs is therefore a candidate for client execution.

Server Components should not attempt to emulate browser APIs merely to avoid introducing a Client Component.

## Effects

Server Components do not use client-side Effects for their server execution model.

Code such as:

```tsx id="s7n2cd"
useEffect(() => {
    // browser synchronization
}, []);
```

belongs to Client Components.

Server-side work should instead occur through the server execution model appropriate to the component and framework.

This avoids using browser lifecycle mechanisms for work that fundamentally belongs on the server.

## Event Handlers

Server Components cannot attach ordinary browser event handlers in the same way Client Components do.

This:

```tsx id="x0p8ry"
<button onClick={handleClick}>
    Save
</button>
```

requires client-side interaction handling.

A Server Component can render the button or compose a Client Component that owns the interaction.

## Context

Context has important boundaries in Server Component architectures.

Server and Client Components do not necessarily participate in Context in identical ways.

A provider intended for client-side interactive state generally belongs at an appropriate Client Component boundary.

For example:

```tsx id="k6r1mz"
"use client";

export function ThemeProvider({
                                  children
                              }: {
    children: React.ReactNode;
}) {
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}
```

Server Components can compose around client providers according to the framework's supported model, but client-only
state should not be forced into server-side component logic.

## Dependency Injection

Server Components can use dependency injection for server-side services.

```tsx id="u8c3pk"
async function UserProfile() {
    const repository = getUserRepository();

    const user = await repository.findById("1");

    return <Profile user={user}/>;
}
```

The repository remains server-side.

A Client Component should not receive the repository itself:

```tsx id="s4y6tw"
<ClientProfile repository={repository}/>
```

Instead, the server should perform the operation and pass client-safe data:

```tsx id="z5m8cv"
<ClientProfile user={user}/>
```

The server/client boundary therefore acts as a strong dependency isolation mechanism.

## Feature Architecture

Feature-sliced applications can place server-side feature components alongside client-side interactive components.

For example:

```text id="v6k2pz"
features/
  products/
    ProductPage.tsx
    ProductDetails.tsx
    AddToCart.tsx
```

`ProductPage` and `ProductDetails` can remain server-side while `AddToCart` crosses into the client boundary.

The feature owns the capability.

The Server Component boundary determines where individual implementation pieces execute.

## Container-Presentational Components

Server Components can participate in container-presentational decomposition, but the two patterns solve different
problems.

A Server Component can perform orchestration and render presentation directly:

```tsx id="m3x7ad"
async function UserPage() {
    const user = await getUser();

    return <UserView user={user}/>;
}
```

There is no requirement to introduce a separate container solely because data acquisition exists.

Server Components can therefore reduce the need for artificial container components when server-side orchestration and
rendering naturally belong together.

## Headless Components

A headless component can be implemented as a Client Component when its interaction requires browser execution.

For example:

```tsx id="c7w4jp"
"use client";

function useCombobox() {
    // keyboard, focus, and selection behavior
}
```

A Server Component can render the surrounding server-side data and compose the interactive headless implementation.

The server/client boundary and headless/presentation boundary remain independent concepts.

## Layout Components

Server Components can be layout components.

A layout may execute on the server while containing Client Components for interactive regions.

Layout ownership remains spatial.

Server Components determine execution location.

These dimensions can therefore be combined without conflating them.

## Forms

Forms can be rendered by Server Components while their interaction behavior is handled through server-supported mutation
mechanisms or Client Components.

A simple form may not require a Client Component merely because it is a form.

Client-side state is required only when the interaction actually needs browser-side React behavior.

This can reduce unnecessary client JavaScript.

## Progressive Enhancement

Server-oriented form architectures can support useful behavior without requiring all interaction logic to execute in the
browser.

For example, the server can remain responsible for:

* input validation
* authorization
* mutation
* persistence
* response generation

while the client enhances the experience with:

* pending indicators
* optimistic UI
* local validation
* richer interaction

The architecture should treat progressive enhancement as an intentional capability rather than assuming every form needs
a large Client Component.

## Bundle Size

One major benefit of Server Components is reducing the amount of application code that must execute in the browser.

A Server Component's implementation and its server-only dependencies do not need to become part of the browser's
interactive component bundle.

For data-heavy or dependency-heavy features, this can substantially reduce client-side JavaScript.

However, the benefit depends on where client boundaries are placed and what dependencies are reachable from those
boundaries.

## Client Boundary Size

A broad client boundary can undermine the benefits of Server Components.

For example:

```tsx id="p2f8zx"
"use client";

export function EntirePage() {
    // ...
}
```

can cause a large portion of the feature's dependency graph to become client-side.

A more focused boundary may be preferable:

```tsx id="e8k1rw"
async function ProductPage() {
    const product = await getProduct();

    return (
        <>
            <ProductDetails product={product}/>
            <AddToCart productId={product.id}/>
        </>
    );
}
```

Only the interactive region requires client execution.

The goal is not to minimize the number of Client Components at all costs. The goal is to place the boundary according to
actual execution requirements.

## Component Granularity

Server Components encourage separating interactive behavior from non-interactive rendering.

For example:

```tsx id="q3m8na"
<ProductDetails/>
<ReviewList/>
<AddToCart/>
```

may have different execution requirements.

`ProductDetails` and `ReviewList` may remain server-side, while `AddToCart` requires client execution.

Component boundaries should follow meaningful responsibilities rather than artificially fragmenting every element.

## Performance

Server Components can improve performance by reducing client-side JavaScript and moving work closer to server-side
resources.

They do not automatically make every application faster.

Potential costs include:

* server computation
* network latency
* repeated server requests
* serialization
* large rendered payloads
* excessive client boundaries
* inefficient server data access

Performance should therefore be evaluated across the complete rendering pipeline rather than only by client bundle size.

## Caching and Revalidation

Server-rendered data often requires explicit cache semantics.

Possible strategies include:

* request-level reuse
* application-level caching
* time-based revalidation
* event-driven invalidation
* no caching for highly dynamic data

The appropriate policy depends on the data's consistency requirements.

A Server Component does not inherently determine whether its data should be cached.

## Dynamic Data

Data such as:

* authenticated user information
* real-time availability
* rapidly changing prices
* request-specific configuration

may require dynamic server execution.

A Server Component can render dynamic data without turning the component into a Client Component.

Server execution and caching strategy remain separate decisions.

## Security Boundary

Server Components can keep sensitive implementation details on the server, but they are not a universal security
mechanism.

Security-sensitive operations must still enforce:

* authentication
* authorization
* input validation
* output filtering
* resource ownership
* rate limiting where appropriate

The server remains the authoritative security boundary.

A Client Component should never be trusted simply because its parent is a Server Component.

## Common Misuse

A common misuse is treating Server Components as merely a replacement for SSR.

SSR can render Client Components on the server for initial output. Server Components introduce a different component
execution model.

Another misuse is marking an entire application as client-side when only a small interaction requires browser execution.

Another is importing server-only modules into client code.

Another is assuming that all server-side data is automatically secure. Data explicitly passed to a Client Component
becomes client-visible.

Another is assuming Server Components automatically cache requests.

Another is moving every component to the server even when the component fundamentally requires browser interaction.

Another is using Server Components as an authorization substitute instead of enforcing authorization at server-side
resource boundaries.

## Advantages

Server Components can reduce client-side JavaScript.

They can keep server-only dependencies out of the browser.

They allow components to access server-side resources directly.

They can simplify server-side data acquisition.

They allow interactive Client Components to be isolated to the portions of the UI that actually require them.

They integrate naturally with asynchronous rendering and Suspense.

They can establish a strong separation between server infrastructure and browser code.

## Disadvantages

Server Components introduce a server/client execution boundary that developers must understand.

Values crossing the boundary are constrained by serialization and transport rules.

Client Components cannot arbitrarily consume server-side modules.

Debugging can involve multiple execution environments.

Caching, rendering, streaming, and request lifecycle behavior can become complex.

Framework integration is significant because the React runtime alone does not define the complete deployment
architecture.

Poorly placed client boundaries can eliminate many of the intended benefits.

## When to Use

Use Server Components when:

* a component does not require browser interaction
* server-side data access is central to the component
* server-only dependencies should remain private
* reducing client JavaScript is valuable
* the component can benefit from server-side rendering and asynchronous data access
* the application already uses a framework or runtime that supports Server Components
* server/client separation improves the architecture

## When Not to Use

Do not force a component into the server execution model when it requires:

* browser APIs
* client-side state
* browser event handlers
* client-side Effects
* interactive focus management
* client-only libraries

Do not introduce Server Components solely because they are technically available.

The component should execute where its responsibilities require it.

## Design Rules

1. Treat the server/client boundary as an architectural dependency boundary.
2. Keep server-only dependencies on the server.
3. Keep browser-dependent behavior in Client Components.
4. Pass data across the boundary rather than server infrastructure.
5. Keep client boundaries as focused as practical.
6. Do not confuse Server Components with SSR.
7. Do not assume Server Components imply static rendering.
8. Do not assume server-side data is automatically cached.
9. Perform authorization on the server independently of UI rendering.
10. Validate mutations on the server even when the client validates them first.
11. Treat serialization as an explicit boundary contract.
12. Keep request-specific state appropriately scoped.
13. Use Suspense where independently resolving server work benefits the rendering architecture.
14. Avoid unnecessary Client Components.
15. Avoid unnecessarily large Client Component entry points.
16. Keep server-state, caching, and invalidation semantics explicit.
17. Do not expose secrets or server infrastructure to Client Components.
18. Do not move interactive behavior to the server merely to reduce client code.
19. Let component responsibilities determine execution location.
20. Keep Server Components, SSR, caching, streaming, and server-state management conceptually distinct.

## Relationship to Other Patterns

Server Components define where component logic executes and what belongs in the server-side component graph.

Client Components define the browser-executed portions of the application.

Server-Side Rendering determines how a React tree is rendered on the server for delivery to the client; it is not
synonymous with Server Components.

Suspense defines rendering readiness and fallback behavior and can coordinate asynchronous Server Components.

Server State defines management of remote authoritative data; Server Components can read that data but do not replace
server-state management.

Resource Cache can optimize repeated server-side resource access used by Server Components.

Data Fetching defines how data is acquired; Server Components provide a server-side execution environment in which that
acquisition can occur.

Context and Provider Composition can establish capabilities around component trees, but server/client boundaries
constrain which capabilities can be consumed on each side.

Dependency Injection Through Context can be used for client-side dependencies, while server-side dependencies can often
be assembled directly in the server composition layer.

Headless Components commonly require Client Components when their interaction model depends on browser events, focus, or
client state.

Feature-Sliced Components can contain both Server and Client Components according to the execution requirements of
individual feature responsibilities.

Container-Presentational Components can be implemented entirely on the server, entirely on the client, or across the
server/client boundary depending on their responsibilities.

Layout Components can execute on the server while composing interactive Client Components.

## Summary

Server Components are React components whose implementation executes on the server and whose server-only dependencies do
not need to become part of the browser's client-side component graph. They allow server-side data access and composition
while reserving Client Components for browser-dependent behavior.

The pattern is not synonymous with SSR, static rendering, streaming, caching, or server-state management. Those are
separate architectural concerns that can be combined with Server Components.

The strongest architecture places the server/client boundary according to actual execution requirements: server-side
components own server-side work, Client Components own browser interaction, and the boundary between them carries an
explicit data and dependency contract.

The core principle is: **execute a component where its responsibilities belong, and cross the server/client boundary
only with the data and capabilities that the receiving environment actually requires.**
