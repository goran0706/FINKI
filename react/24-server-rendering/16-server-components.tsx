/**
 * Server Components
 * ==================
 *
 * Server Components are React components that render in a server environment separate from the
 * client application. They can access server-side resources and use async rendering without
 * sending the component implementation or its server-only dependencies to the browser.
 *
 * Server Components are a React Server Components architecture feature rather than a component
 * type that can be enabled by adding a special directive. There is no `"use server"` directive
 * for Server Components; `"use server"` is used for Server Functions.
 */

import { Suspense, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. A basic Server Component
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return (
    <section>
      <h1>Hello, {name}</h1>
      <p>Welcome to the application.</p>
    </section>
  );
};

// A Server Component can render ordinary JSX just like other React components.
// What makes it a Server Component is where the component usage is rendered,
// not a special component declaration or directive.

// ---------------------------------------------------------------------
// 2. Server Components do not use "use server"
// ---------------------------------------------------------------------

export const ServerPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Page</h1>
      <Greeting name="John Doe" />
    </main>
  );
};

// Server Components do not need `"use server"`.
// That directive is reserved for Server Functions that can be called from client code.

// ---------------------------------------------------------------------
// 3. Server Components can be asynchronous
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

const getUser = async (): Promise<User> => {
  return {
    name: "John Doe",
    email: "john.doe@example.com",
  };
};

export const UserProfile = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <section>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </section>
  );
};

// Server Components can use `async` and `await` during rendering.
// The component suspends until the awaited data is available.

// ---------------------------------------------------------------------
// 4. Server Components can access server-side data
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

const getProducts = async (): Promise<readonly Product[]> => {
  return [
    {
      id: "product-1",
      name: "Example Product",
      price: 49,
    },
    {
      id: "product-2",
      name: "Another Product",
      price: 79,
    },
  ];
};

export const ProductList = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <section>
      <h2>Products</h2>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} — ${product.price}
          </li>
        ))}
      </ul>
    </section>
  );
};

// The data source can be a database, filesystem, internal service, or other server-only resource.
// Server Components can access such resources without exposing the resource or its dependencies
// to the browser.

// ---------------------------------------------------------------------
// 5. Server-only dependencies
// ---------------------------------------------------------------------

const readServerContent = async (): Promise<string> => {
  return "Content loaded from a server-side resource.";
};

export const ServerContent = async (): Promise<ReactElement> => {
  const content = await readServerContent();

  return (
    <article>
      <h1>Server Content</h1>
      <p>{content}</p>
    </article>
  );
};

// Server-only libraries used by a Server Component do not need to become part of the client bundle
// simply because the component renders their result.

// ---------------------------------------------------------------------
// 6. Server Components are not sent to the browser
// ---------------------------------------------------------------------

export const AccountPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <h1>Account</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </main>
  );
};

// The browser receives the rendered result and the necessary information for the client tree.
// It does not receive the original Server Component implementation as client-side component code.

// ---------------------------------------------------------------------
// 7. Server Components cannot use client-only state
// ---------------------------------------------------------------------

interface StaticCounterProps {
  readonly count: number;
}

export const StaticCounter: FC<StaticCounterProps> = ({ count }): ReactElement => {
  return (
    <section>
      <p>Count: {count}</p>
    </section>
  );
};

// A Server Component cannot use interactive client APIs such as `useState`.
// Interactivity belongs in a Client Component.

// ---------------------------------------------------------------------
// 8. Composing a Server Component with a Client Component
// ---------------------------------------------------------------------

interface ExpandableProps {
  readonly children: ReactNode;
}

export const ExpandablePlaceholder: FC<ExpandableProps> = ({ children }): ReactElement => {
  return (
    <section>
      <button type="button">Toggle</button>

      {children}
    </section>
  );
};

export const NotesPage = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <main>
      <h1>Notes</h1>

      {products.map((product) => (
        <ExpandablePlaceholder key={product.id}>
          <p>{product.name}</p>
        </ExpandablePlaceholder>
      ))}
    </main>
  );
};

// In a real Server Components application, the interactive component would be defined in a
// `"use client"` module. The Server Component can render that Client Component as part of its tree.

// ---------------------------------------------------------------------
// 9. The "use client" boundary
// ---------------------------------------------------------------------

// A Client Component module begins with:
//
// "use client";
//
// import {useState} from "react";
//
// export const Expandable: FC<ExpandableProps> = ({
//     children,
// }): ReactElement => {
//     const [expanded, setExpanded] = useState(false);
//
//     return (
//         <section>
//             <button
//                 type="button"
//                 onClick={() => setExpanded((value) => !value)}
//             >
//                 {expanded ? "Collapse" : "Expand"}
//             </button>
//
//             {expanded && children}
//         </section>
//     );
// };

// `"use client"` marks a module as client code and creates a boundary between
// server-rendered code and the client-side module dependency tree.

// ---------------------------------------------------------------------
// 10. Server Components can pass data to Client Components
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly name: string;
  readonly email: string;
}

export const UserCardData: FC<UserCardProps> = ({ name, email }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>{email}</p>
    </article>
  );
};

export const UserCardPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <h1>Account</h1>
      <UserCardData name={user.name} email={user.email} />
    </main>
  );
};

// Values crossing from a Server Component into a Client Component must use values
// supported by the Server Components serialization model.

// ---------------------------------------------------------------------
// 11. Passing JSX to a Client Component
// ---------------------------------------------------------------------

interface PanelProps {
  readonly children: ReactNode;
}

export const PanelPlaceholder: FC<PanelProps> = ({ children }): ReactElement => {
  return <aside>{children}</aside>;
};

export const PanelPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <PanelPlaceholder>
      <article>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </article>
    </PanelPlaceholder>
  );
};

// A Server Component can pass JSX as `children` to a Client Component.
// The Client Component does not need to import or directly render the Server Component.

// ---------------------------------------------------------------------
// 12. The render tree matters
// ---------------------------------------------------------------------

export const ServerContentBlock: FC = (): ReactElement => {
  return <p>This component can be rendered in a Server Component tree.</p>;
};

export const ServerTree: FC = (): ReactElement => {
  return (
    <main>
      <h1>Server Tree</h1>
      <ServerContentBlock />
    </main>
  );
};

// Whether a component usage is a Server Component or Client Component depends on its
// position in the Server Components render tree and the module boundaries that lead to it.
// A component definition does not necessarily have only one execution environment.

// ---------------------------------------------------------------------
// 13. Server Components and Client Component composition
// ---------------------------------------------------------------------

interface LayoutProps {
  readonly children: ReactNode;
}

export const ServerLayout: FC<LayoutProps> = ({ children }): ReactElement => {
  return (
    <div>
      <header>
        <h1>Example Application</h1>
      </header>

      <main>{children}</main>
    </div>
  );
};

// A Server Component can compose Client Components.
// The Client Component becomes a client-side boundary while the surrounding server-rendered tree
// remains on the server.

// ---------------------------------------------------------------------
// 14. Server Components and Suspense
// ---------------------------------------------------------------------

const getRecommendations = async (): Promise<readonly string[]> => {
  return ["Example Product", "Another Product", "Recommended Product"];
};

export const Recommendations = async (): Promise<ReactElement> => {
  const recommendations = await getRecommendations();

  return (
    <section>
      <h2>Recommendations</h2>

      <ul>
        {recommendations.map((recommendation) => (
          <li key={recommendation}>{recommendation}</li>
        ))}
      </ul>
    </section>
  );
};

export const RecommendationsPage = (): ReactElement => {
  return (
    <main>
      <h1>Example Page</h1>

      <Suspense fallback={<p>Loading recommendations...</p>}>
        <Recommendations />
      </Suspense>
    </main>
  );
};

// Suspense can reveal Server Component content progressively.
// The server can render the rest of the page while an asynchronous Server Component is waiting.

// ---------------------------------------------------------------------
// 15. Passing a Promise through the server-client boundary
// ---------------------------------------------------------------------

interface MessageProps {
  readonly messagePromise: Promise<string>;
}

export const MessagePlaceholder: FC<MessageProps> = ({ messagePromise }): ReactElement => {
  return (
    <section>
      <p>A Client Component can read the promise with `use`.</p>
      <span>{String(messagePromise)}</span>
    </section>
  );
};

export const MessagePage = (): ReactElement => {
  const messagePromise = Promise.resolve("Hello from the server.");

  return (
    <Suspense fallback={<p>Loading message...</p>}>
      <MessagePlaceholder messagePromise={messagePromise} />
    </Suspense>
  );
};

// In an actual Client Component, `use(messagePromise)` can read a Promise passed from
// the server. The Promise can therefore begin on the server and be consumed deeper in the client tree.

// ---------------------------------------------------------------------
// 16. Server Components versus SSR
// ---------------------------------------------------------------------

export const ServerComponentExample = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <section>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </section>
  );
};

// Server Components and server-side rendering are related but different concepts.
// Server Components describe where components execute and how server/client boundaries work.
// SSR describes rendering a React tree into HTML for an initial response.

// ---------------------------------------------------------------------
// 17. Server Components versus static rendering
// ---------------------------------------------------------------------

export const StaticContent = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <section>
      <h1>Products</h1>

      {products.map((product) => (
        <article key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </article>
      ))}
    </section>
  );
};

// A Server Component can execute at request time or at build time, depending on the framework's
// rendering strategy. Server Components are therefore not synonymous with static rendering.

// ---------------------------------------------------------------------
// 18. Server Components and client bundle size
// ---------------------------------------------------------------------

export const FormattedProduct = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

// Server-only dependencies used to obtain or transform this data can remain outside the client
// bundle. The browser only needs the client code required by Client Components.

// ---------------------------------------------------------------------
// 19. Server Components and context
// ---------------------------------------------------------------------

export const ContextLayout = async ({ children }: LayoutProps): Promise<ReactElement> => {
  const user = await getUser();

  return <div data-user={user.name}>{children}</div>;
};

// Server Components cannot create Context.
// A Server Component can, however, render a Context imported from a Client Component module.
// This allows server-fetched data to be provided to Client Components.

// ---------------------------------------------------------------------
// 20. Server Components are not a replacement for Client Components
// ---------------------------------------------------------------------

export const ProductInformation = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <section>
      <h2>Product Information</h2>

      {products.map((product) => (
        <article key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </article>
      ))}
    </section>
  );
};

// Server Components are useful for server-side data access and rendering.
// Client Components remain necessary for state, event handlers, effects, and other client-only behavior.

// ---------------------------------------------------------------------
// 21. A mixed server and client tree
// ---------------------------------------------------------------------

interface ProductDetailsProps {
  readonly product: Product;
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </article>
  );
};

export const ProductPage = async (): Promise<ReactElement> => {
  const products = await getProducts();
  const product = products[0];

  if (!product) {
    return (
      <main>
        <p>No products found.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Product</h1>

      <ProductDetails product={product} />

      <button type="button">Add to cart</button>
    </main>
  );
};

// In a real application, the button would normally belong to a Client Component.
// The surrounding product data can still be loaded and rendered by the Server Component.

// ---------------------------------------------------------------------
// 22. Async Server Component boundaries
// ---------------------------------------------------------------------

interface AccountSectionProps {
  readonly user: User;
}

export const AccountSection: FC<AccountSectionProps> = ({ user }): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </section>
  );
};

export const AccountDashboard = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <h1>Dashboard</h1>
      <AccountSection user={user} />
    </main>
  );
};

// Awaiting data in an async Server Component makes that data available before the component
// returns its result. Suspense can then be used to control how waiting content is revealed.

// ---------------------------------------------------------------------
// 23. Server Component output crosses into the client tree
// ---------------------------------------------------------------------

export const ServerGeneratedNavigation = async (): Promise<ReactElement> => {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/products">Products</a>
      <a href="/account">Account</a>
    </nav>
  );
};

export const NavigationPage = async (): Promise<ReactElement> => {
  return (
    <main>
      <ServerGeneratedNavigation />

      <section>
        <h1>Example Page</h1>
        <p>Page content.</p>
      </section>
    </main>
  );
};

// Server Component output becomes part of the rendered application tree.
// Client Components can surround or receive that output without requiring the server component's
// implementation to become client code.

// ---------------------------------------------------------------------
// 24. Server Components and environment-specific code
// ---------------------------------------------------------------------

const getServerTimestamp = async (): Promise<string> => {
  return new Date().toISOString();
};

export const ServerTimestamp = async (): Promise<ReactElement> => {
  const timestamp = await getServerTimestamp();

  return <time dateTime={timestamp}>{timestamp}</time>;
};

// Server-only code can access server environment capabilities.
// Such code should not be placed inside a Client Component module unless it is safe to run in the browser.

// ---------------------------------------------------------------------
// 25. Complete Server Component composition
// ---------------------------------------------------------------------

interface HeaderProps {
  readonly user: User;
}

export const Header: FC<HeaderProps> = ({ user }): ReactElement => {
  return (
    <header>
      <h1>Example Application</h1>
      <p>Signed in as {user.name}</p>
    </header>
  );
};

export const Content = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <section>
      <h2>Products</h2>

      {products.map((product) => (
        <article key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </article>
      ))}
    </section>
  );
};

export const ServerApplication = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Application</title>
      </head>

      <body>
        <Header user={user} />

        <main>
          <Content />
        </main>
      </body>
    </html>
  );
};

export default ServerApplication;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Server Components render in a server environment separate from the client application.
// - Server Components do not require a `"use server"` directive.
// - `"use server"` is used for Server Functions, not to identify Server Components.
// - Server Components can be asynchronous and use `await` during rendering.
// - Server Components can access server-side resources such as databases, files, and internal services.
// - Server-only dependencies used by Server Components do not need to be included in the client bundle.
// - Server Component implementations are not sent to the browser as client-side component code.
// - Server Components cannot use client-only interactive APIs such as `useState`.
// - Client Components are introduced with the `"use client"` module directive.
// - Server Components can render Client Components and pass supported serializable values to them.
// - Server Components can also pass JSX as children to Client Components.
// - Suspense can progressively reveal asynchronous Server Component content.
// - Promises can cross a Server Component boundary and be read deeper in the tree with `use`.
// - Server Components and SSR are different concepts: Server Components define execution boundaries, while SSR produces HTML.
// - Server Components are also different from static rendering because they can participate in request-time or build-time rendering strategies.
// - Server Components and Client Components are complementary parts of a React Server Components application.
