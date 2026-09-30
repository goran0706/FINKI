/**
 * Server-Client Component Composition
 * ====================================
 *
 * React Server Components applications combine Server Components and Client Components by placing
 * a client boundary around interactive code while keeping server-side data access and rendering on
 * the server. A Server Component can render a Client Component and pass data or JSX to it, while a
 * Client Component cannot directly import a Server Component module.
 */

import { useState, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Server Components and Client Components have different roles
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

// This function represents server-side data access.
// In a real React Server Components application, the component that calls it can remain server-side.

// ---------------------------------------------------------------------
// 2. A Client Component boundary
// ---------------------------------------------------------------------

interface ExpandableProps {
  readonly children: ReactNode;
}

export const Expandable: FC<ExpandableProps> = ({ children }): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Collapse" : "Expand"}
      </button>

      {expanded && <div>{children}</div>}
    </section>
  );
};

// In a real Server Components application, the module containing `Expandable` would begin with:
//
// "use client";
//
// That directive creates the client module boundary.
// The component itself can then use state and event handlers.

// ---------------------------------------------------------------------
// 3. Server Component rendering a Client Component
// ---------------------------------------------------------------------

export const AccountPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <h1>Account</h1>

      <Expandable>
        <p>{user.name}</p>
        <p>{user.email}</p>
      </Expandable>
    </main>
  );
};

// The Server Component performs the server-side data access.
// The Client Component provides the interactive boundary.

// ---------------------------------------------------------------------
// 4. Passing serializable data to a Client Component
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

export const UserPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <h1>Account</h1>

      <UserCard user={user} />
    </main>
  );
};

// Values passed from a Server Component to a Client Component must use the
// values supported by React's Server Components serialization model.

// ---------------------------------------------------------------------
// 5. Passing JSX to a Client Component
// ---------------------------------------------------------------------

export const ExpandableAccount = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <Expandable>
      <UserCard user={user} />
    </Expandable>
  );
};

// The Server Component creates the JSX and passes it as `children`.
// The Client Component does not need to import or directly execute `UserCard`.

// ---------------------------------------------------------------------
// 6. Server-rendered children inside a Client Component
// ---------------------------------------------------------------------

interface PanelProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ title, children }): ReactElement => {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <header>
        <h2>{title}</h2>

        <button type="button" onClick={() => setOpen((value) => !value)}>
          {open ? "Hide" : "Show"}
        </button>
      </header>

      {open && <div>{children}</div>}
    </section>
  );
};

export const AccountPanel = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <Panel title="Account">
      <UserCard user={user} />
    </Panel>
  );
};

// `Panel` owns the interactive behavior.
// `UserCard` can remain server-rendered because it is passed into `Panel` as JSX.

// ---------------------------------------------------------------------
// 7. Why children composition matters
// ---------------------------------------------------------------------

export const ServerContent = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </article>
  );
};

export const InteractiveContainer: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  const [visible, setVisible] = useState(true);

  return (
    <section>
      <button type="button" onClick={() => setVisible((value) => !value)}>
        {visible ? "Hide content" : "Show content"}
      </button>

      {visible && children}
    </section>
  );
};

export const CompositionPage = async (): Promise<ReactElement> => {
  return (
    <main>
      <InteractiveContainer>
        <ServerContent />
      </InteractiveContainer>
    </main>
  );
};

// The Client Component controls whether its `children` are shown.
// It does not need to know how those children were produced.

// ---------------------------------------------------------------------
// 8. Server Components can pass multiple JSX slots
// ---------------------------------------------------------------------

interface LayoutProps {
  readonly header: ReactNode;
  readonly children: ReactNode;
  readonly footer: ReactNode;
}

export const InteractiveLayout: FC<LayoutProps> = ({ header, children, footer }): ReactElement => {
  const [compact, setCompact] = useState(false);

  return (
    <div>
      <header>
        {header}

        <button type="button" onClick={() => setCompact((value) => !value)}>
          {compact ? "Normal view" : "Compact view"}
        </button>
      </header>

      <main>{children}</main>

      <footer>{footer}</footer>
    </div>
  );
};

export const DashboardPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <InteractiveLayout header={<h1>{user.name}'s Dashboard</h1>} footer={<small>Example Company</small>}>
      <section>
        <h2>Account</h2>
        <p>{user.email}</p>
      </section>
    </InteractiveLayout>
  );
};

// JSX can be passed through several named props, not only `children`.
// The Client Component controls the interactive layout without needing to own the server data access.

// ---------------------------------------------------------------------
// 9. A Server Component can pass server-fetched data directly
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

interface ProductListProps {
  readonly products: readonly Product[];
}

export const ProductList: FC<ProductListProps> = ({ products }): ReactElement => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section>
      <h2>Products</h2>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <button type="button" onClick={() => setSelectedId(product.id)}>
              {product.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedId && <p>Selected: {selectedId}</p>}
    </section>
  );
};

export const ProductPage = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <main>
      <h1>Products</h1>
      <ProductList products={products} />
    </main>
  );
};

// The server performs the data access.
// The Client Component receives the resulting data and manages local interaction.

// ---------------------------------------------------------------------
// 10. Keeping server-only data access outside the client boundary
// ---------------------------------------------------------------------

const getAccountBalance = async (): Promise<number> => {
  return 1250;
};

interface BalanceProps {
  readonly amount: number;
}

export const Balance: FC<BalanceProps> = ({ amount }): ReactElement => {
  return <p>Balance: ${amount}</p>;
};

export const BalancePage = async (): Promise<ReactElement> => {
  const amount = await getAccountBalance();

  return (
    <main>
      <h1>Account</h1>
      <Balance amount={amount} />
    </main>
  );
};

// The Client Component receives the result rather than importing the server-only data source.
// This keeps server-only dependencies out of the client module subtree.

// ---------------------------------------------------------------------
// 11. A Client Component cannot directly import a Server Component
// ---------------------------------------------------------------------

// The following relationship is invalid:
//
// "use client";
//
// import {ServerContent} from "./ServerContent";
//
// export const ClientPanel: FC = (): ReactElement => {
//     return (
//         <section>
//             <ServerContent />
//         </section>
//     );
// };
//
// A Client Component cannot directly import a Server Component module.
// Instead, the Server Component should render the Client Component and pass the
// Server Component's output through props such as `children`.

// ---------------------------------------------------------------------
// 12. The correct inversion of the dependency
// ---------------------------------------------------------------------

export const ServerArticle = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </article>
  );
};

export const ClientArticleFrame: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  const [highlighted, setHighlighted] = useState(false);

  return (
    <article data-highlighted={highlighted}>
      <button type="button" onClick={() => setHighlighted((value) => !value)}>
        {highlighted ? "Remove highlight" : "Highlight"}
      </button>

      {children}
    </article>
  );
};

export const ArticlePage = async (): Promise<ReactElement> => {
  return (
    <ClientArticleFrame>
      <ServerArticle />
    </ClientArticleFrame>
  );
};

// The dependency direction is now correct:
// Server Component -> Client Component -> server-generated JSX as children.

// ---------------------------------------------------------------------
// 13. Client Components can compose client components
// ---------------------------------------------------------------------

export const ToggleButton: FC<{
  readonly active: boolean;
  readonly onToggle: () => void;
}> = ({ active, onToggle }): ReactElement => {
  return (
    <button type="button" onClick={onToggle}>
      {active ? "Active" : "Inactive"}
    </button>
  );
};

export const ClientToolbar: FC = (): ReactElement => {
  const [active, setActive] = useState(false);

  return (
    <div>
      <ToggleButton active={active} onToggle={() => setActive((value) => !value)} />
    </div>
  );
};

// Client Components can import and compose other Client Components normally.
// The client boundary includes their client-side module dependencies.

// ---------------------------------------------------------------------
// 14. Server Components can compose Server Components
// ---------------------------------------------------------------------

export const Header: FC<{
  readonly user: User;
}> = ({ user }): ReactElement => {
  return (
    <header>
      <h1>Example Application</h1>
      <p>{user.name}</p>
    </header>
  );
};

export const Content: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <p>Server-rendered content.</p>
    </section>
  );
};

export const ServerCompositionPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <Header user={user} />
      <Content />
    </main>
  );
};

// Server Components can freely compose other Server Components.
// The client boundary is only introduced when a Client Component enters the tree.

// ---------------------------------------------------------------------
// 15. A mixed component tree
// ---------------------------------------------------------------------

export const MixedPage = async (): Promise<ReactElement> => {
  const user = await getUser();
  const products = await getProducts();

  return (
    <main>
      <Header user={user} />

      <ProductList products={products} />

      <Expandable>
        <section>
          <h2>Account</h2>
          <p>{user.email}</p>
        </section>
      </Expandable>
    </main>
  );
};

// Conceptually, the tree contains both environments:
//
// ServerPage
// ├── Header             Server Component
// ├── ProductList        Client Component
// └── Expandable         Client Component
//     └── server JSX     passed through `children`
//
// The parent-child relationship alone does not determine the execution environment.
// Module boundaries and the resulting render tree determine which usages are client or server.

// ---------------------------------------------------------------------
// 16. Render-tree versus module-tree boundaries
// ---------------------------------------------------------------------

export const SharedPresentation: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  return <div>{children}</div>;
};

// A component module without `"use client"` can participate in either environment depending
// on how it is reached in the application.
//
// For example, a component imported directly by a Server Component can be server-rendered.
// The same component can also have a Client Component usage when imported into client code.
//
// The module boundary and render-tree usage must therefore be considered separately.

// ---------------------------------------------------------------------
// 17. Server Components can render Client Components with server data
// ---------------------------------------------------------------------

interface UserControlsProps {
  readonly userName: string;
}

export const UserControls: FC<UserControlsProps> = ({ userName }): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <section>
      <h2>Hello, {userName}</h2>

      <button type="button" onClick={() => setMessage("Action completed.")}>
        Perform action
      </button>

      {message && <p>{message}</p>}
    </section>
  );
};

export const UserControlsPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <main>
      <UserControls userName={user.name} />
    </main>
  );
};

// The Server Component determines the data.
// The Client Component determines the interactive behavior.

// ---------------------------------------------------------------------
// 18. Server Components can pass JSX and data together
// ---------------------------------------------------------------------

interface InteractiveCardProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const InteractiveCard: FC<InteractiveCardProps> = ({ title, children }): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article>
      <header>
        <h2>{title}</h2>

        <button type="button" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Collapse" : "Expand"}
        </button>
      </header>

      {expanded && children}
    </article>
  );
};

export const ServerCardPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <InteractiveCard title="Account">
      <UserCard user={user} />
    </InteractiveCard>
  );
};

// A Client Component can receive both serializable data and server-generated JSX.
// This lets the client own behavior without forcing all content into the client bundle.

// ---------------------------------------------------------------------
// 19. Suspense around mixed server-client composition
// ---------------------------------------------------------------------

const getSlowProfile = async (): Promise<User> => {
  return {
    name: "John Doe",
    email: "john.doe@example.com",
  };
};

export const SlowProfile = async (): Promise<ReactElement> => {
  const user = await getSlowProfile();

  return <UserCard user={user} />;
};

export const SuspenseClientShell: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  const [visible, setVisible] = useState(true);

  return (
    <section>
      <button type="button" onClick={() => setVisible((value) => !value)}>
        {visible ? "Hide" : "Show"}
      </button>

      {visible && children}
    </section>
  );
};

export const SuspenseCompositionPage = (): ReactElement => {
  return (
    <SuspenseClientShell>
      <SlowProfile />
    </SuspenseClientShell>
  );
};

// Suspense and Server Components can work together with Client Components.
// The exact loading behavior depends on the surrounding rendering architecture and Suspense boundaries.

// ---------------------------------------------------------------------
// 20. Server-created Promise passed to a Client Component
// ---------------------------------------------------------------------

const getNotifications = async (): Promise<readonly string[]> => {
  return ["Example notification", "Another notification"];
};

interface NotificationsProps {
  readonly notificationsPromise: Promise<readonly string[]>;
}

export const Notifications: FC<NotificationsProps> = ({ notificationsPromise }): ReactElement => {
  const notifications = use(notificationsPromise);

  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification}>{notification}</li>
      ))}
    </ul>
  );
};

export const NotificationsPage = (): ReactElement => {
  const notificationsPromise = getNotifications();

  return (
    <section>
      <h1>Notifications</h1>

      <Notifications notificationsPromise={notificationsPromise} />
    </section>
  );
};

// A Server Component can create a Promise and pass it to a Client Component.
// The Client Component can read that Promise with `use` and suspend while it is pending.

// ---------------------------------------------------------------------
// 21. Server Functions provide a different composition mechanism
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly onSave: () => Promise<void>;
}

export const SaveButton: FC<SaveButtonProps> = ({ onSave }): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        void onSave();
      }}
    >
      Save
    </button>
  );
};

// An ordinary function cannot cross the Server Component boundary as a normal serialized prop.
// A Server Function can cross that boundary as a special server reference.
//
// Example:
//
// async function saveData(): Promise<void> {
//     "use server";
//     // Perform a server-side mutation.
// }
//
// <SaveButton onSave={saveData} />
//
// The `"use server"` directive marks the function as a Server Function.
// It does not mark a component as a Server Component.

// ---------------------------------------------------------------------
// 22. Composition preserves server-side data access
// ---------------------------------------------------------------------

interface AccountSummaryProps {
  readonly name: string;
  readonly email: string;
}

export const AccountSummary: FC<AccountSummaryProps> = ({ name, email }): ReactElement => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  return (
    <section>
      <h2>{name}</h2>

      <button type="button" onClick={() => setDetailsVisible((value) => !value)}>
        {detailsVisible ? "Hide details" : "Show details"}
      </button>

      {detailsVisible && <p>{email}</p>}
    </section>
  );
};

export const AccountSummaryPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return <AccountSummary name={user.name} email={user.email} />;
};

// Only the required data crosses the boundary.
// The server-side data source itself does not need to become part of the client dependency tree.

// ---------------------------------------------------------------------
// 23. Composition boundary design
// ---------------------------------------------------------------------

export const StaticProductInformation: FC<{
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
  const [added, setAdded] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setAdded(true)}>
        {added ? "Added" : `Add ${productId}`}
      </button>
    </section>
  );
};

export const ProductCompositionPage = async (): Promise<ReactElement> => {
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
      <StaticProductInformation product={product} />

      <ProductActions productId={product.id} />
    </main>
  );
};

// Server-side product data and client-side product actions can remain separate.
// The composition boundary should be placed around the behavior that actually requires the client.

// ---------------------------------------------------------------------
// 24. Composition with a client wrapper
// ---------------------------------------------------------------------

export const ClientWrapper: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  const [active, setActive] = useState(false);

  return (
    <div data-active={active}>
      <button type="button" onClick={() => setActive((value) => !value)}>
        Toggle state
      </button>

      {children}
    </div>
  );
};

export const ServerWrapperPage = async (): Promise<ReactElement> => {
  const products = await getProducts();

  return (
    <ClientWrapper>
      <section>
        {products.map((product) => (
          <article key={product.id}>
            <h2>{product.name}</h2>
            <p>${product.price}</p>
          </article>
        ))}
      </section>
    </ClientWrapper>
  );
};

// This pattern is useful when the interactive behavior is small but the content inside the wrapper
// is produced by Server Components.

// ---------------------------------------------------------------------
// 25. Composition does not make every descendant client code
// ---------------------------------------------------------------------

export const ServerFooter: FC = (): ReactElement => {
  return (
    <footer>
      <small>Example Company</small>
    </footer>
  );
};

export const ServerPageWithClientBoundary = async (): Promise<ReactElement> => {
  return (
    <main>
      <ClientWrapper>
        <section>
          <h1>Example Page</h1>
        </section>
      </ClientWrapper>

      <ServerFooter />
    </main>
  );
};

// A Client Component can receive Server Component output as props.
// A Server Component elsewhere in the tree can remain server-rendered.
// A parent-child relationship alone does not determine the environment of every component usage.

// ---------------------------------------------------------------------
// 26. Complete composition example
// ---------------------------------------------------------------------

export const UserHeader: FC<{
  readonly user: User;
}> = ({ user }): ReactElement => {
  return (
    <header>
      <h1>Welcome, {user.name}</h1>
      <p>{user.email}</p>
    </header>
  );
};

export const InteractiveAccount: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setShowDetails((value) => !value)}>
        {showDetails ? "Hide account details" : "Show account details"}
      </button>

      {showDetails && <div>{children}</div>}
    </section>
  );
};

export const CompleteCompositionPage = async (): Promise<ReactElement> => {
  const user = await getUser();
  const products = await getProducts();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Account</title>
      </head>

      <body>
        <UserHeader user={user} />

        <main>
          <InteractiveAccount>
            <section>
              <h2>Products</h2>

              {products.map((product) => (
                <article key={product.id}>
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                </article>
              ))}
            </section>
          </InteractiveAccount>
        </main>

        <ServerFooter />
      </body>
    </html>
  );
};

export default CompleteCompositionPage;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Server Components and Client Components can be composed into the same React application.
// - A Server Component can render a Client Component and pass supported data as props.
// - A Server Component can pass JSX to a Client Component through `children` or other JSX props.
// - Passing JSX allows a Client Component to provide interactive behavior around server-generated content.
// - A Client Component cannot directly import a Server Component module.
// - The dependency direction should therefore generally be Server Component -> Client Component.
// - Client Components can freely import and compose other Client Components within the client module subtree.
// - A Client Component can receive Server Component output as props without directly importing the Server Component.
// - Ordinary functions are not normal serializable props across the Server Component boundary.
// - Server Functions provide a special mechanism for passing callable server references to Client Components.
// - Server Components can fetch server-side data and pass the resulting values to Client Components.
// - A Client Component can own interaction while server-rendered content remains outside its client dependency tree.
// - Suspense can be combined with mixed Server and Client Component composition.
// - Promises created on the server can be passed to Client Components and read with `use`.
// - The `"use client"` directive defines a module dependency boundary; it does not mean every component relationship in the render tree has the same environment.
// - A parent-child relationship alone does not determine whether a component usage is a Server Component or Client Component.
// - Good composition keeps server-side data access on the server and places client boundaries around behavior that requires browser execution.
