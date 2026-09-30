/**
 * Server Component Data
 * =====================
 *
 * Server Components can access server-side data sources directly because their code executes in
 * the server environment. They can perform asynchronous work during rendering, including database
 * queries, filesystem operations, and network requests, without sending those data-access
 * implementation details to the browser.
 *
 * Data is typically loaded in the Server Component and only the values required by Client
 * Components are passed across the Server-Client boundary.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic asynchronous Server Component
// ---------------------------------------------------------------------

export const UserPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </main>
  );
};

// Server Components can be asynchronous.
// The component can wait for server-side data before returning its JSX.

// ---------------------------------------------------------------------
// 2. Server-side data source
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

async function getUser(): Promise<User> {
  return {
    id: "user-001",
    name: "John Doe",
    email: "john@example.com",
  };
}

// This represents a server-side data source.
// In a real application, the function could query a database or another server-side service.

// ---------------------------------------------------------------------
// 3. Server Components can query a database
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

async function getProducts(): Promise<readonly Product[]> {
  return [
    {
      id: "product-001",
      name: "Example Product",
      price: 49.99,
    },
    {
      id: "product-002",
      name: "Another Product",
      price: 79.99,
    },
  ];
}

export const ProductListPage = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <main>
      <h1>Products</h1>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name}: ${product.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </main>
  );
};

// The database access remains on the server.
// Only the resulting rendered output needs to participate in the response.

// ---------------------------------------------------------------------
// 4. Server Components can access server-side files
// ---------------------------------------------------------------------

async function readApplicationContent(): Promise<string> {
  // A real implementation could use a server-side filesystem API here.
  return "Example application content.";
}

export const DocumentPage = async (): Promise<ReactElement> => {
  const content = await readApplicationContent();

  return (
    <article>
      <h1>Document</h1>
      <p>{content}</p>
    </article>
  );
};

// Server-only resources such as filesystems should be accessed by server-side code.
// Browser code does not need to receive the implementation used to obtain the content.

// ---------------------------------------------------------------------
// 5. Server Components can fetch remote data
// ---------------------------------------------------------------------

interface Article {
  readonly id: string;
  readonly title: string;
}

async function getArticles(): Promise<readonly Article[]> {
  // A real implementation could call a remote API with `fetch`.
  return [
    {
      id: "article-001",
      title: "Introduction to React",
    },
    {
      id: "article-002",
      title: "Rendering Server Components",
    },
  ];
}

export const ArticleList = async (): Promise<ReactElement> => {
  const articles = await getArticles();

  return (
    <section>
      <h2>Articles</h2>

      <ul>
        {articles.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </section>
  );
};

// Network requests can be performed during Server Component rendering.
// The exact caching and revalidation behavior of `fetch` is controlled by the
// surrounding framework and runtime rather than by Server Components alone.

// ---------------------------------------------------------------------
// 6. Server Components can compose data sources
// ---------------------------------------------------------------------

interface Account {
  readonly id: string;
  readonly name: string;
}

interface Notification {
  readonly id: string;
  readonly message: string;
}

async function getAccount(): Promise<Account> {
  return {
    id: "account-001",
    name: "John Doe",
  };
}

async function getNotifications(): Promise<readonly Notification[]> {
  return [
    {
      id: "notification-001",
      message: "Your profile was updated.",
    },
    {
      id: "notification-002",
      message: "You have a new message.",
    },
  ];
}

export const AccountPage = async (): Promise<ReactElement> => {
  const account = await getAccount();
  const notifications = await getNotifications();

  return (
    <main>
      <h1>{account.name}</h1>

      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>{notification.message}</li>
        ))}
      </ul>
    </main>
  );
};

// A Server Component can coordinate multiple server-side data sources
// before constructing its rendered output.

// ---------------------------------------------------------------------
// 7. Independent data requests can run concurrently
// ---------------------------------------------------------------------

export const DashboardPage = async (): Promise<ReactElement> => {
  const accountPromise = getAccount();
  const notificationsPromise = getNotifications();

  const [account, notifications] = await Promise.all([accountPromise, notificationsPromise]);

  return (
    <main>
      <h1>{account.name}</h1>

      <p>Notifications: {notifications.length}</p>
    </main>
  );
};

// When data sources are independent, starting both operations before awaiting them
// can avoid unnecessary sequential waiting.

// ---------------------------------------------------------------------
// 8. Sequential requests can be necessary
// ---------------------------------------------------------------------

async function getAccountProjects(accountId: string): Promise<readonly string[]> {
  return [`${accountId}-project-001`, `${accountId}-project-002`];
}

export const ProjectPage = async (): Promise<ReactElement> => {
  const account = await getAccount();
  const projects = await getAccountProjects(account.id);

  return (
    <main>
      <h1>{account.name}</h1>

      <ul>
        {projects.map((project) => (
          <li key={project}>{project}</li>
        ))}
      </ul>
    </main>
  );
};

// Here the second operation depends on the first result,
// so the requests naturally occur in sequence.

// ---------------------------------------------------------------------
// 9. Data can be transformed on the server
// ---------------------------------------------------------------------

interface ProductSummary {
  readonly id: string;
  readonly label: string;
}

async function getProductSummaries(): Promise<readonly ProductSummary[]> {
  const products = await getProducts();

  return products.map((product) => ({
    id: product.id,
    label: `${product.name} — $${product.price.toFixed(2)}`,
  }));
}

export const ProductSummaryList = async (): Promise<ReactElement> => {
  const products = await getProductSummaries();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.label}</li>
      ))}
    </ul>
  );
};

// Server Components can perform formatting and data transformation before
// producing their JSX. The browser does not need to reproduce those transformations.

// ---------------------------------------------------------------------
// 10. Server Components can select only required data
// ---------------------------------------------------------------------

interface CustomerRecord {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly internalNotes: string;
}

async function getCustomer(): Promise<CustomerRecord> {
  return {
    id: "customer-001",
    name: "John Doe",
    email: "john@example.com",
    internalNotes: "Internal example data.",
  };
}

export const CustomerProfile = async (): Promise<ReactElement> => {
  const customer = await getCustomer();

  return (
    <section>
      <h1>{customer.name}</h1>
      <p>{customer.email}</p>
    </section>
  );
};

// The component can select only the fields needed for the rendered UI.
// Server-side implementation details do not need to become part of client props.

// ---------------------------------------------------------------------
// 11. Server-side validation can happen before rendering
// ---------------------------------------------------------------------

function requireUser(user: User | null): User {
  if (user === null) {
    throw new Error("User not found.");
  }

  return user;
}

export const RequiredUserPage = async (): Promise<ReactElement> => {
  const user = requireUser(await getUser());

  return (
    <main>
      <h1>{user.name}</h1>
    </main>
  );
};

// Server-side validation can happen before the component constructs its output.
// A real application would normally translate expected missing-data cases into
// an appropriate framework-level response rather than exposing raw errors.

// ---------------------------------------------------------------------
// 12. Request-specific data can be used during rendering
// ---------------------------------------------------------------------

interface RequestContext {
  readonly userId: string;
}

async function getRequestContext(): Promise<RequestContext> {
  return {
    userId: "user-001",
  };
}

export const RequestUserPage = async (): Promise<ReactElement> => {
  const context = await getRequestContext();
  const user = await getUserById(context.userId);

  return (
    <main>
      <h1>{user.name}</h1>
    </main>
  );
};

async function getUserById(userId: string): Promise<User> {
  return {
    id: userId,
    name: "John Doe",
    email: "john@example.com",
  };
}

// In a real application, request context might come from authentication,
// cookies, headers, route parameters, or another framework-provided source.
// The mechanism for obtaining that context is framework-specific.

// ---------------------------------------------------------------------
// 13. Server Components can render different output from server-side data
// ---------------------------------------------------------------------

interface Order {
  readonly id: string;
  readonly status: "pending" | "completed";
}

async function getOrder(): Promise<Order> {
  return {
    id: "order-001",
    status: "completed",
  };
}

export const OrderStatus = async (): Promise<ReactElement> => {
  const order = await getOrder();

  return (
    <section>
      <h2>Order {order.id}</h2>

      {order.status === "completed" ? <p>Completed</p> : <p>Pending</p>}
    </section>
  );
};

// The rendered result can depend directly on server-side data.

// ---------------------------------------------------------------------
// 14. Server Components can use async helper functions
// ---------------------------------------------------------------------

async function getGreeting(): Promise<string> {
  const user = await getUser();

  return `Hello, ${user.name}.`;
}

export const GreetingPage = async (): Promise<ReactElement> => {
  const greeting = await getGreeting();

  return <h1>{greeting}</h1>;
};

// Data-access logic can be separated into server-side helper functions
// while the Server Component remains responsible for constructing the UI.

// ---------------------------------------------------------------------
// 15. Server-side data does not require useEffect
// ---------------------------------------------------------------------

export const ServerDataPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </main>
  );
};

// Server Components can await data during rendering.
// A client-side effect is not required simply to retrieve initial server-side data.

// ---------------------------------------------------------------------
// 16. Client-side fetching is a different architecture
// ---------------------------------------------------------------------

// A Client Component might instead:
//
// "use client";
//
// import {useEffect, useState} from "react";
//
// and fetch data after mounting.
//
// That approach can be appropriate when data depends on browser-only interaction,
// but it is not required for data that can be loaded by a Server Component.

// ---------------------------------------------------------------------
// 17. Server Components can prepare props for Client Components
// ---------------------------------------------------------------------

interface ProfileControlsProps {
  readonly name: string;
  readonly email: string;
}

export const ProfileControls = ({ name, email }: ProfileControlsProps): ReactElement => {
  return (
    <section>
      <h2>{name}</h2>
      <p>{email}</p>
    </section>
  );
};

export const ProfilePage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <ProfileControls name={user.name} email={user.email} />
    </main>
  );
};

// In an actual application, `ProfileControls` would be a Client Component when it
// requires client-only APIs. The Server Component can fetch the data and pass only
// the values required by the client boundary.

// ---------------------------------------------------------------------
// 18. Server Components can pass prepared data to interactive UI
// ---------------------------------------------------------------------

interface ProductControlsProps {
  readonly productId: string;
  readonly name: string;
  readonly price: number;
}

export const ProductControls = ({ productId, name, price }: ProductControlsProps): ReactElement => {
  return (
    <section>
      <h2>{name}</h2>
      <p>{price.toFixed(2)}</p>
      <p>Product: {productId}</p>
    </section>
  );
};

export const ProductPageWithControls = async (): Promise<ReactElement> => {
  const products = await getProducts();
  const product = products[0];

  if (product === undefined) {
    throw new Error("Product not found.");
  }

  return <ProductControls productId={product.id} name={product.name} price={product.price} />;
};

// The server can perform the data lookup and send a minimal data shape
// to the interactive client-side part of the tree.

// ---------------------------------------------------------------------
// 19. Server Components can pass JSX through children
// ---------------------------------------------------------------------

interface ContentShellProps {
  readonly children: ReactElement;
}

export const ContentShell = ({ children }: ContentShellProps): ReactElement => {
  return <section>{children}</section>;
};

export const ServerContentPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <ContentShell>
      <article>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </article>
    </ContentShell>
  );
};

// In an actual application, `ContentShell` can be a Client Component.
// The server-generated JSX can be passed as `children`, allowing the Client Component
// to provide interactive behavior around server-generated content.

// ---------------------------------------------------------------------
// 20. Server Components can fetch data for multiple sections
// ---------------------------------------------------------------------

async function getFeaturedProduct(): Promise<Product> {
  const products = await getProducts();
  const product = products[0];

  if (product === undefined) {
    throw new Error("Featured product not found.");
  }

  return product;
}

export const StorePage = async (): Promise<ReactElement> => {
  const [user, products, featuredProduct] = await Promise.all([getUser(), getProducts(), getFeaturedProduct()]);

  return (
    <main>
      <header>
        <h1>Welcome, {user.name}</h1>
      </header>

      <section>
        <h2>Featured</h2>
        <p>{featuredProduct.name}</p>
      </section>

      <section>
        <h2>Products</h2>

        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

// Independent data sources can be initiated together.
// The resulting values can then be composed into one Server Component tree.

// ---------------------------------------------------------------------
// 21. Data loading can be delegated to nested Server Components
// ---------------------------------------------------------------------

export const UserSection = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
};

export const ProductSection = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <section>
      <h2>Products</h2>

      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </section>
  );
};

export const Dashboard = (): ReactElement => {
  return (
    <main>
      <UserSection />
      <ProductSection />
    </main>
  );
};

// Nested Server Components can own their own data requirements.
// In a framework supporting streaming and Suspense, independently resolving
// parts of the tree can be revealed progressively.

// ---------------------------------------------------------------------
// 22. Data loading and Suspense
// ---------------------------------------------------------------------

export const DeferredProductSection = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <section>
      <h2>Products</h2>

      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </section>
  );
};

// A framework can combine asynchronous Server Components with Suspense boundaries
// to control how parts of a rendered tree are revealed.
// Suspense itself does not fetch data; the suspended work comes from the component
// or resource being awaited.

// ---------------------------------------------------------------------
// 23. Server Components can avoid exposing data-access libraries to the client
// ---------------------------------------------------------------------

async function getPrivateReport(): Promise<{
  readonly title: string;
  readonly summary: string;
}> {
  return {
    title: "Private Report",
    summary: "Example server-side report.",
  };
}

export const PrivateReport = async (): Promise<ReactElement> => {
  const report = await getPrivateReport();

  return (
    <article>
      <h1>{report.title}</h1>
      <p>{report.summary}</p>
    </article>
  );
};

// A database client, filesystem library, or private API client can remain in server-only
// implementation code instead of becoming part of the browser's client module graph.

// ---------------------------------------------------------------------
// 24. Server Components can access environment configuration
// ---------------------------------------------------------------------

async function getApplicationName(): Promise<string> {
  // A real implementation could read non-secret server configuration here.
  return "Example Application";
}

export const ApplicationHeader = async (): Promise<ReactElement> => {
  const applicationName = await getApplicationName();

  return (
    <header>
      <h1>{applicationName}</h1>
    </header>
  );
};

// Server-side configuration can be read where it is needed.
// Sensitive configuration should never be rendered or returned to untrusted clients.

// ---------------------------------------------------------------------
// 25. Data can determine whether content exists
// ---------------------------------------------------------------------

async function getOptionalNotification(): Promise<Notification | null> {
  return {
    id: "notification-003",
    message: "Example notification.",
  };
}

export const OptionalNotification = async (): Promise<ReactElement> => {
  const notification = await getOptionalNotification();

  if (notification === null) {
    return <p>No notifications.</p>;
  }

  return <aside>{notification.message}</aside>;
};

// Server-side data can determine which part of the component tree is rendered.

// ---------------------------------------------------------------------
// 26. Server Components can combine data with route parameters
// ---------------------------------------------------------------------

async function getArticleById(articleId: string): Promise<Article> {
  return {
    id: articleId,
    title: "Example Article",
  };
}

interface ArticlePageProps {
  readonly articleId: string;
}

export const ArticlePage = async ({ articleId }: ArticlePageProps): Promise<ReactElement> => {
  const article = await getArticleById(articleId);

  return (
    <article>
      <h1>{article.title}</h1>
    </article>
  );
};

// A framework can provide route parameters to a Server Component.
// The component can use those parameters to load the corresponding server-side data.

// ---------------------------------------------------------------------
// 27. Server Components can construct derived view models
// ---------------------------------------------------------------------

interface OrderSummary {
  readonly id: string;
  readonly label: string;
  readonly statusLabel: string;
}

async function getOrderSummary(): Promise<OrderSummary> {
  const order = await getOrder();

  return {
    id: order.id,
    label: `Order ${order.id}`,
    statusLabel: order.status === "completed" ? "Completed" : "Pending",
  };
}

export const OrderSummaryView = async (): Promise<ReactElement> => {
  const summary = await getOrderSummary();

  return (
    <article>
      <h2>{summary.label}</h2>
      <p>{summary.statusLabel}</p>
    </article>
  );
};

// A server-side view model can contain only the information required by the rendered UI.

// ---------------------------------------------------------------------
// 28. Server Components can handle missing data
// ---------------------------------------------------------------------

async function findProduct(productId: string): Promise<Product | null> {
  const products = await getProducts();

  return products.find((product) => product.id === productId) ?? null;
}

export const ProductDetails = async ({ productId }: { readonly productId: string }): Promise<ReactElement> => {
  const product = await findProduct(productId);

  if (product === null) {
    return (
      <section>
        <h1>Product not found</h1>
      </section>
    );
  }

  return (
    <section>
      <h1>{product.name}</h1>
      <p>${product.price.toFixed(2)}</p>
    </section>
  );
};

// The appropriate missing-data behavior depends on the application and framework.
// The Server Component can make the rendering decision after the data lookup.

// ---------------------------------------------------------------------
// 29. Server-side errors should be handled deliberately
// ---------------------------------------------------------------------

async function loadDashboardData(): Promise<{
  readonly user: User;
}> {
  const user = await getUser();

  return {
    user,
  };
}

export const SafeDashboard = async (): Promise<ReactElement> => {
  try {
    const data = await loadDashboardData();

    return (
      <main>
        <h1>{data.user.name}</h1>
      </main>
    );
  } catch {
    return (
      <main>
        <h1>Unable to load dashboard.</h1>
      </main>
    );
  }
};

// In a real application, framework-level error boundaries and error handling mechanisms
// may provide a more appropriate place for rendering failures.

// ---------------------------------------------------------------------
// 30. Data fetching belongs close to the Server Component that needs it
// ---------------------------------------------------------------------

export const AccountSummary = async (): Promise<ReactElement> => {
  const account = await getAccount();

  return (
    <section>
      <h2>{account.name}</h2>
    </section>
  );
};

export const NotificationSummary = async (): Promise<ReactElement> => {
  const notifications = await getNotifications();

  return (
    <section>
      <h2>Notifications</h2>
      <p>{notifications.length}</p>
    </section>
  );
};

// Keeping data requirements close to the component that consumes them can make
// the server-side component tree easier to compose and reason about.

// ---------------------------------------------------------------------
// 31. Server data and client interactivity have separate responsibilities
// ---------------------------------------------------------------------

interface ShoppingProductProps {
  readonly name: string;
  readonly price: number;
}

export const ShoppingProduct = ({ name, price }: ShoppingProductProps): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>${price.toFixed(2)}</p>
    </article>
  );
};

export const ShoppingPage = async (): Promise<ReactElement> => {
  const product = await getFeaturedProduct();

  return (
    <main>
      <ShoppingProduct name={product.name} price={product.price} />
    </main>
  );
};

// In an actual application, `ShoppingProduct` could be a Client Component if it
// needed interactive behavior. The Server Component would still own the data lookup
// and pass the required values across the boundary.

// ---------------------------------------------------------------------
// 32. Complete server-side dashboard example
// ---------------------------------------------------------------------

interface DashboardData {
  readonly user: User;
  readonly products: readonly Product[];
  readonly notifications: readonly Notification[];
}

async function getDashboardData(): Promise<DashboardData> {
  const [user, products, notifications] = await Promise.all([getUser(), getProducts(), getNotifications()]);

  return {
    user,
    products,
    notifications,
  };
}

export const CompleteDashboard = async (): Promise<ReactElement> => {
  const { user, products, notifications } = await getDashboardData();

  return (
    <main>
      <header>
        <h1>Welcome, {user.name}</h1>
        <p>{user.email}</p>
      </header>

      <section>
        <h2>Products</h2>

        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name}: ${product.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Notifications</h2>

        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>{notification.message}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

// This example combines the main Server Component data patterns:
// asynchronous data loading, concurrent requests, server-side composition,
// transformation into JSX, and rendering the resulting data.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Server Components can access server-side data sources directly during rendering.
// - Server Components can be asynchronous and await data before returning JSX.
// - Data can come from databases, filesystems, remote services, or other server-side resources.
// - Server Components can perform server-side validation and data transformation.
// - Independent data requests can be started concurrently with `Promise.all`.
// - Dependent requests may need to run sequentially when one result is required by another.
// - Server Components can select only the data required by the rendered UI.
// - Server-only implementation details such as database clients and private configuration can remain on the server.
// - Server Components do not need `useEffect` merely to load initial server-side data.
// - Server Components can pass prepared data to Client Components across the Server-Client boundary.
// - Server-generated JSX can be passed to Client Components through supported props such as `children`.
// - Nested Server Components can own their own data requirements.
// - Asynchronous Server Components can participate in Suspense-based rendering and streaming.
// - Request-specific values can be used to determine which server-side data is loaded.
// - Route parameters can be used as inputs to server-side data queries.
// - Server-side authentication and authorization should be performed using trusted server information.
// - TypeScript types do not replace runtime validation of external or client-provided input.
// - Missing data and server errors should be handled deliberately according to the application's requirements.
// - Server-side data access and client-side interactivity are separate responsibilities that can be composed at the Server-Client boundary.
