/**
 * Server Components
 * ==================
 *
 * Server Components are React components that render ahead of time in an environment separate from
 * the client application. They can access server-side resources, perform data fetching during render,
 * and keep their implementation and server-only dependencies out of the client bundle.
 *
 * Server Components are a React Server Components architecture feature supported by compatible
 * frameworks and bundlers. There is no `"use server"` directive for marking a component as a
 * Server Component; `"use server"` instead marks Server Functions.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Basic Server Component
// ---------------------------------------------------------------------

export const Greeting: FC = (): ReactElement => {
  return (
    <main>
      <h1>Hello, John Doe</h1>
      <p>Welcome to the example application.</p>
    </main>
  );
};

// In a React Server Components application, components are Server Components by default
// unless their usage falls within a client-marked module boundary.

// ---------------------------------------------------------------------
// 2. Server Components do not need a special directive
// ---------------------------------------------------------------------

export const ProductInformation: FC<{
  readonly name: string;
  readonly price: number;
}> = ({ name, price }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>${price}</p>
    </article>
  );
};

// There is no `"use server"` at the top of this component.
// Server Components are the default in an RSC application.
//
// `"use server"` has a different purpose: it marks a function as a Server Function.

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
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
};

// Async components are supported in the Server Components environment.
// An async Server Component can await data during rendering before returning its result.

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
            {product.name}: ${product.price}
          </li>
        ))}
      </ul>
    </section>
  );
};

// A Server Component can access a data layer directly in an RSC environment.
// This can avoid requiring a separate client-side request solely to obtain the initial data.

// ---------------------------------------------------------------------
// 5. Server Components can render other Server Components
// ---------------------------------------------------------------------

export const Header: FC<{
  readonly user: User;
}> = ({ user }): ReactElement => {
  return (
    <header>
      <h1>Example Application</h1>
      <p>Signed in as {user.name}</p>
    </header>
  );
};

export const Content: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <p>Server-rendered account content.</p>
    </section>
  );
};

export const AccountPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <Header user={user} />
      <Content />
    </main>
  );
};

// Server Components can compose other Server Components normally.
// No client boundary is required when the entire composition remains server-side.

// ---------------------------------------------------------------------
// 6. Server Components can compose Client Components
// ---------------------------------------------------------------------

interface ExpandableProps {
  readonly children: ReactNode;
}

export const Expandable: FC<ExpandableProps> = ({ children }): ReactElement => {
  return (
    <section>
      <button type="button">Toggle</button>

      {children}
    </section>
  );
};

// In an actual application, a component that uses state or event handlers like `Expandable`
// would be defined in a module marked with `"use client"`.
//
// The example above intentionally omits the directive because this file focuses on the
// Server Component side of the composition.

// ---------------------------------------------------------------------
// 7. Server Components can pass data to Client Components
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly user: User;
}

export const UserCard: FC<UserCardProps> = ({ user }): ReactElement => {
  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </article>
  );
};

export const UserCardPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <UserCard user={user} />
    </main>
  );
};

// If `UserCard` is a Client Component in the application, the Server Component can
// pass the serializable `user` data across the server-client boundary.

// ---------------------------------------------------------------------
// 8. Server Components can pass JSX as props
// ---------------------------------------------------------------------

interface PanelProps {
  readonly children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ children }): ReactElement => {
  return (
    <section>
      <h2>Panel</h2>
      {children}
    </section>
  );
};

export const PanelPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <Panel>
      <UserCard user={user} />
    </Panel>
  );
};

// A Server Component can create JSX and pass it to a Client Component through `children`.
// This allows interactive Client Components to wrap server-generated content without
// directly importing the Server Component that produced that content.

// ---------------------------------------------------------------------
// 9. Server Components cannot use client state
// ---------------------------------------------------------------------

// This is not valid as a Server Component:
//
// export const InvalidCounter: FC = (): ReactElement => {
//     const [count, setCount] = useState(0);
//
//     return (
//         <button onClick={() => setCount(count + 1)}>
//             Count: {count}
//         </button>
//     );
// };
//
// `useState` and event handlers require client-side React execution.
// The interactive portion should instead be placed in a Client Component.

// ---------------------------------------------------------------------
// 10. Server Components cannot use event handlers
// ---------------------------------------------------------------------

export const StaticButton: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// A Server Component can render a normal HTML element such as `<button>`.
// However, it cannot attach a client event handler such as `onClick`.
//
// An interactive button must be implemented through a Client Component.

// ---------------------------------------------------------------------
// 11. Server Components can use server-side modules
// ---------------------------------------------------------------------

interface Article {
  readonly title: string;
  readonly content: string;
}

const getArticle = async (): Promise<Article> => {
  return {
    title: "Example Article",
    content: "This content was loaded on the server.",
  };
};

export const ArticlePage = async (): Promise<ReactElement> => {
  const article = await getArticle();

  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </article>
  );
};

// Server Components can import server-oriented modules and use server-side resources.
// Those dependencies do not need to become part of the browser bundle when they remain
// within the Server Component portion of the module dependency graph.

// ---------------------------------------------------------------------
// 12. Server Components can read static content at build time
// ---------------------------------------------------------------------

interface DocumentationPageProps {
  readonly title: string;
  readonly content: string;
}

export const DocumentationPage: FC<DocumentationPageProps> = ({ title, content }): ReactElement => {
  return (
    <article>
      <h1>{title}</h1>
      <p>{content}</p>
    </article>
  );
};

// Server Components do not necessarily require a running web server for every render.
// Compatible tooling can render Server Components ahead of time, such as during a build,
// when the data is static enough for that strategy.

// ---------------------------------------------------------------------
// 13. Server Components can access request-time data
// ---------------------------------------------------------------------

interface RequestContext {
  readonly userName: string;
  readonly locale: string;
}

const getRequestContext = async (): Promise<RequestContext> => {
  return {
    userName: "John Doe",
    locale: "en-US",
  };
};

export const PersonalizedPage = async (): Promise<ReactElement> => {
  const context = await getRequestContext();

  return (
    <main>
      <h1>Hello, {context.userName}</h1>
      <p>Locale: {context.locale}</p>
    </main>
  );
};

// A Server Component can render again for a request and access request-specific data
// through the surrounding framework or server environment.

// ---------------------------------------------------------------------
// 14. Server Components are not the same as server-rendered HTML
// ---------------------------------------------------------------------

export const ServerComponentTree = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </main>
  );
};

// A Server Component is a component that renders in the Server Components environment.
// Server rendering is the separate process of turning a React tree into HTML.
//
// A Server Component tree can subsequently participate in server rendering to produce
// the initial HTML sent to the browser.

// ---------------------------------------------------------------------
// 15. Server Components are not automatically static
// ---------------------------------------------------------------------

export const DynamicServerPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </main>
  );
};

// A Server Component can run at build time for static output or run during requests
// for dynamic output. "Server Component" describes the execution environment and
// component architecture, not whether the result is statically generated.

// ---------------------------------------------------------------------
// 16. Server Components can start asynchronous work
// ---------------------------------------------------------------------

const getNotifications = async (): Promise<readonly string[]> => {
  return ["Example notification", "Another notification"];
};

export const NotificationPage = async (): Promise<ReactElement> => {
  const notificationsPromise = getNotifications();

  return (
    <main>
      <h1>Notifications</h1>

      <p>Notification data is being prepared on the server.</p>

      <NotificationList notificationsPromise={notificationsPromise} />
    </main>
  );
};

interface NotificationListProps {
  readonly notificationsPromise: Promise<readonly string[]>;
}

export const NotificationList: FC<NotificationListProps> = ({ notificationsPromise }): ReactElement => {
  return <p>Notifications are available through the rendering boundary.</p>;
};

// A Server Component can create a Promise without immediately awaiting it.
// That Promise can be passed through the Server/Client Component architecture
// and consumed deeper in the tree when appropriate.

// ---------------------------------------------------------------------
// 17. Server Components can use Suspense boundaries
// ---------------------------------------------------------------------

export const SlowContent = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

export const SuspensePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Products</h1>

      <section>
        <h2>Example Content</h2>
        <SlowContent />
      </section>
    </main>
  );
};

// Server Components can suspend while awaiting asynchronous work.
// A surrounding Suspense boundary can provide a loading state when the rendering
// architecture supports progressive delivery.

// ---------------------------------------------------------------------
// 18. Server Components can reduce client-side JavaScript
// ---------------------------------------------------------------------

export const ServerFormattedContent: FC<{
  readonly content: string;
}> = ({ content }): ReactElement => {
  return (
    <article>
      <p>{content}</p>
    </article>
  );
};

export const ContentPage = async (): Promise<ReactElement> => {
  const article = await getArticle();

  return <ServerFormattedContent content={article.content} />;
};

// Server Component code and its server-only dependencies are not sent to the browser
// as Client Component code. This can reduce the amount of JavaScript required on the client
// for content that does not need browser-side interactivity.

// ---------------------------------------------------------------------
// 19. Server Components can render client boundaries
// ---------------------------------------------------------------------

interface InteractivePanelProps {
  readonly children: ReactNode;
}

export const InteractivePanel: FC<InteractivePanelProps> = ({ children }): ReactElement => {
  return (
    <section>
      <button type="button">Open</button>

      {children}
    </section>
  );
};

export const InteractivePage = async (): Promise<ReactElement> => {
  const article = await getArticle();

  return (
    <InteractivePanel>
      <article>
        <h2>{article.title}</h2>
        <p>{article.content}</p>
      </article>
    </InteractivePanel>
  );
};

// In a real application, `InteractivePanel` would be a Client Component.
// The Server Component can still provide its content as JSX.
// This composition keeps the interactive behavior in the client boundary
// while the article data and rendering can remain server-side.

// ---------------------------------------------------------------------
// 20. Server Components cannot create React context
// ---------------------------------------------------------------------

// This is not valid as a Server Component:
//
// const ThemeContext = createContext("light");
//
// export const InvalidServerProvider = ({
//     children,
// }: {
//     readonly children: ReactNode;
// }): ReactElement => {
//     return (
//         <ThemeContext value="dark">
//             {children}
//         </ThemeContext>
//     );
// };
//
// Context creation and providers that use client React APIs belong in a Client Component module.
// A Server Component can render a context provider imported from a Client Component module.

// ---------------------------------------------------------------------
// 21. Server Components can render Client Component providers
// ---------------------------------------------------------------------

export const ProviderLayout = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <h1>{user.name}</h1>
      <p>Client context can wrap this server-rendered content.</p>
    </main>
  );
};

// In an actual RSC application, a Client Component module can export a context provider.
// A Server Component can import and render that provider around its children.
//
// This allows client context to be introduced without turning the entire Server Component
// into a Client Component.

// ---------------------------------------------------------------------
// 22. Server Components and Client Components have different responsibilities
// ---------------------------------------------------------------------

export const ServerResponsibilityExample = async (): Promise<ReactElement> => {
  const user = await getUser();
  const products = await getProducts();

  return (
    <main>
      <h1>{user.name}</h1>

      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </main>
  );
};

// Server Component responsibilities can include:
// - accessing server-side data
// - rendering content
// - using server-only dependencies
// - preparing data for Client Components
// - composing the application tree

// Client Component responsibilities can include:
// - state
// - event handlers
// - effects
// - refs
// - browser APIs
// - interactive behavior

// ---------------------------------------------------------------------
// 23. Server Components can pass serializable data
// ---------------------------------------------------------------------

interface AccountData {
  readonly name: string;
  readonly email: string;
  readonly lastLogin: Date;
}

const getAccountData = async (): Promise<AccountData> => {
  return {
    name: "John Doe",
    email: "john.doe@example.com",
    lastLogin: new Date("2026-09-28T12:00:00Z"),
  };
};

export const AccountDataPage = async (): Promise<ReactElement> => {
  const account = await getAccountData();

  return (
    <section>
      <h1>{account.name}</h1>
      <p>{account.email}</p>
      <p>Last login: {account.lastLogin.toISOString()}</p>
    </section>
  );
};

// When Server Component data crosses into a Client Component, its value must be supported
// by React's Server Components serialization model. React supports more than plain JSON,
// including values such as Date, Map, Set, Promises, and React elements in supported boundaries.

// ---------------------------------------------------------------------
// 24. Server Components can pass JSX to Client Components
// ---------------------------------------------------------------------

export const ServerMessage: FC = (): ReactElement => {
  return <p>This message was produced by a Server Component.</p>;
};

export const ClientShell: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  return (
    <section>
      <header>Interactive shell</header>
      {children}
    </section>
  );
};

export const ServerClientComposition = (): ReactElement => {
  return (
    <ClientShell>
      <ServerMessage />
    </ClientShell>
  );
};

// The important detail is that the Client Component does not directly import `ServerMessage`.
// The Server Component creates the JSX and passes it as `children`.

// ---------------------------------------------------------------------
// 25. Server Components can compose large server-side trees
// ---------------------------------------------------------------------

export const ProductDetails: FC<{
  readonly product: Product;
}> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </article>
  );
};

export const ProductCatalog = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <section>
      <h1>Catalog</h1>

      {products.map((product) => (
        <ProductDetails key={product.id} product={product} />
      ))}
    </section>
  );
};

export const StorePage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <Header user={user} />
      <ProductCatalog />
    </main>
  );
};

// A large portion of an application's content can remain in the Server Component tree.
// Only the parts that require client-side capabilities need to cross into Client Components.

// ---------------------------------------------------------------------
// 26. Server Components can be used with server rendering
// ---------------------------------------------------------------------

export const RenderableServerTree = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <html lang="en">
      <head>
        <title>Example Account</title>
      </head>

      <body>
        <main>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </main>
      </body>
    </html>
  );
};

// Server Components and server rendering operate at different layers.
// A framework can render the Server Component tree and then produce HTML for the browser.
// The Server Component implementation itself does not become browser JavaScript.

// ---------------------------------------------------------------------
// 27. Server Components do not persist client state
// ---------------------------------------------------------------------

export const ServerContent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Server Content</h2>
      <p>This component does not own persistent browser state.</p>
    </section>
  );
};

// Server Components are rendered in their server environment rather than remaining
// as persistent component instances in the browser. Client state therefore belongs
// to Client Components.

// ---------------------------------------------------------------------
// 28. Server Components and client-side interactivity
// ---------------------------------------------------------------------

export const StaticProduct: FC<{
  readonly product: Product;
}> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </article>
  );
};

export const ProductActions: FC<{
  readonly productId: string;
}> = ({ productId }): ReactElement => {
  return (
    <div>
      <button type="button">Add {productId}</button>
    </div>
  );
};

export const ProductDetailPage = async (): Promise<ReactElement> => {
  const products = await getProducts();
  const product = products[0];

  if (!product) {
    return (
      <main>
        <p>No product found.</p>
      </main>
    );
  }

  return (
    <main>
      <StaticProduct product={product} />
      <ProductActions productId={product.id} />
    </main>
  );
};

// The conceptual split is:
// - `StaticProduct` can remain a Server Component.
// - `ProductActions` would be a Client Component in the actual application.
//
// This keeps static product content and interactive controls in different environments.

// ---------------------------------------------------------------------
// 29. Server Components and asynchronous rendering
// ---------------------------------------------------------------------

const getComments = async (): Promise<readonly string[]> => {
  return ["Example comment", "Another comment"];
};

export const Comments = async (): Promise<ReactElement> => {
  const comments = await getComments();

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment}>{comment}</li>
      ))}
    </ul>
  );
};

export const ArticleWithComments = async (): Promise<ReactElement> => {
  const article = await getArticle();

  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <Comments />
    </article>
  );
};

// Async Server Components can await data during render.
// This allows related server-side data access to remain close to the component that consumes it.

// ---------------------------------------------------------------------
// 30. Complete Server Component example
// ---------------------------------------------------------------------

interface DashboardData {
  readonly user: User;
  readonly products: readonly Product[];
}

const getDashboardData = async (): Promise<DashboardData> => {
  const [user, products] = await Promise.all([getUser(), getProducts()]);

  return {
    user,
    products,
  };
};

export const DashboardHeader: FC<{
  readonly user: User;
}> = ({ user }): ReactElement => {
  return (
    <header>
      <h1>Welcome, {user.name}</h1>
      <p>{user.email}</p>
    </header>
  );
};

export const DashboardProducts: FC<{
  readonly products: readonly Product[];
}> = ({ products }): ReactElement => {
  return (
    <section>
      <h2>Products</h2>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> <span>${product.price}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const DashboardPage = async (): Promise<ReactElement> => {
  const data = await getDashboardData();

  return (
    <main>
      <DashboardHeader user={data.user} />
      <DashboardProducts products={data.products} />
    </main>
  );
};

// This complete example demonstrates the main Server Component model:
// - data is loaded during server rendering
// - asynchronous components can await server-side work
// - Server Components compose other Server Components
// - server-side data can be prepared before client code is involved
// - interactive behavior can be introduced later through Client Components

export default DashboardPage;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Server Components render in a server environment separate from the client application.
// - Server Components are the default component model in a React Server Components application.
// - There is no `"use server"` directive for marking a component as a Server Component.
// - `"use server"` marks Server Functions, which are a different concept.
// - Server Components can be synchronous or asynchronous.
// - Async Server Components can use `await` during rendering.
// - Server Components can access server-side data and other server-side resources.
// - Server Components can run at build time or during requests, depending on the application's rendering strategy.
// - Server Components can compose other Server Components without introducing a client boundary.
// - Server Components can render Client Components when interactive behavior is required.
// - Server Components can pass supported serializable values to Client Components.
// - Server Components can pass JSX as props, including `children`, to Client Components.
// - Client Components should own state, event handlers, effects, refs, and browser-specific behavior.
// - Server Components cannot use client state or event handlers as part of their server execution model.
// - Server Components do not remain as persistent component instances in the browser.
// - Server Component code and server-only dependencies are not sent to the browser as Client Component code.
// - Server Components and server rendering are related but distinct concepts.
// - Server Components can participate in server rendering, streaming, Suspense, hydration, and Client Component composition.
// - A Server Component application can keep large portions of its component tree on the server while sending only the required client-side code to the browser.
