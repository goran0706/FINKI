/**
 * Server Rendering
 * =================
 *
 * Server rendering is the process of rendering a React component tree in a server environment
 * to produce HTML before that HTML is sent to the browser. Unlike client rendering, server
 * rendering does not require a browser DOM or `createRoot` to produce the initial markup.
 *
 * Server rendering is commonly used to send an initial HTML representation of an application
 * to the browser, where the resulting document can later be hydrated to make it interactive.
 */

// ---------------------------------------------------------------------
// 1. A component can be rendered in a server environment
// ---------------------------------------------------------------------

import { type FC, type ReactElement } from "react";
import { renderToString } from "react-dom/server";

export const Greeting: FC = (): ReactElement => {
  return (
    <main>
      <h1>Hello, John Doe</h1>
      <p>Welcome to the application.</p>
    </main>
  );
};

// Server rendering does not require `document`, `window`, or a browser DOM.
// The component tree can be rendered to an HTML representation directly.

// ---------------------------------------------------------------------
// 2. `renderToString` produces an HTML string
// ---------------------------------------------------------------------

export const renderGreeting = (): string => {
  return renderToString(<Greeting />);
};

// The returned string contains HTML representing the rendered React tree.
// A server can use that HTML as part of an HTTP response.

// ---------------------------------------------------------------------
// 3. Server rendering can render composed component trees
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserProfileProps {
  readonly user: User;
}

export const UserProfile: FC<UserProfileProps> = ({ user }): ReactElement => {
  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
};

interface AccountPageProps {
  readonly user: User;
}

export const Header: FC = (): ReactElement => {
  return (
    <header>
      <h1>Account</h1>
    </header>
  );
};

export const AccountPage: FC<AccountPageProps> = ({ user }): ReactElement => {
  return (
    <main>
      <Header />
      <UserProfile user={user} />
    </main>
  );
};

export const renderAccountPage = (user: User): string => {
  return renderToString(<AccountPage user={user} />);
};

// The server renders the complete component tree.
// Composition works the same way conceptually as it does during client rendering.

// ---------------------------------------------------------------------
// 4. Server rendering can include application data
// ---------------------------------------------------------------------

interface DashboardProps {
  readonly user: User;
  readonly notifications: number;
}

export const Dashboard: FC<DashboardProps> = ({ user, notifications }): ReactElement => {
  return (
    <main>
      <h1>Dashboard</h1>
      <UserProfile user={user} />
      <p>Notifications: {notifications}</p>
    </main>
  );
};

export const renderDashboard = (user: User, notifications: number): string => {
  return renderToString(<Dashboard user={user} notifications={notifications} />);
};

// Data can be resolved by server-side application code and passed to the
// component tree before the tree is rendered to HTML.

// ---------------------------------------------------------------------
// 5. Server rendering produces markup, not a browser DOM
// ---------------------------------------------------------------------

export const serverMarkupExample = (): string => {
  const markup = renderToString(<Greeting />);

  return markup;
};

// The result is a string representation of HTML.
// There is no browser `HTMLElement` or live DOM tree on the server.

// ---------------------------------------------------------------------
// 6. Server rendering can be used to build an HTML document
// ---------------------------------------------------------------------

export const renderDocument = (): string => {
  const applicationMarkup = renderToString(<Greeting />);

  return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Account</title>
    </head>
    <body>
        <div id="root">${applicationMarkup}</div>
    </body>
</html>`;
};

// The server can place the rendered React markup inside a larger HTML document.
// The browser receives the resulting document as the initial page content.

// ---------------------------------------------------------------------
// 7. Server rendering can produce initial visible content
// ---------------------------------------------------------------------

export const AccountContent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <p>John Doe</p>
      <p>john.doe@example.com</p>
    </section>
  );
};

export const renderInitialContent = (): string => {
  return renderToString(<AccountContent />);
};

// The browser can receive this HTML before client-side React code has
// established an interactive React tree.

// ---------------------------------------------------------------------
// 8. Server rendering does not make components interactive by itself
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly children: string;
}

export const Button: FC<ButtonProps> = ({ children }): ReactElement => {
  return <button type="button">{children}</button>;
};

export const InteractiveMarkupExample: FC = (): ReactElement => {
  return <Button>Save</Button>;
};

export const renderButtonMarkup = (): string => {
  return renderToString(<InteractiveMarkupExample />);
};

// Server rendering can produce the button's HTML, but rendering the markup on
// the server does not by itself attach browser event handlers to that HTML.

// ---------------------------------------------------------------------
// 9. Event handlers are part of the component definition, not server-side DOM behavior
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly onSave: () => void;
}

export const SaveButton: FC<SaveButtonProps> = ({ onSave }): ReactElement => {
  return (
    <button type="button" onClick={onSave}>
      Save
    </button>
  );
};

export const ServerRenderedButton: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  return <SaveButton onSave={handleSave} />;
};

export const renderServerButton = (): string => {
  return renderToString(<ServerRenderedButton />);
};

// The server can render the button element, but the browser does not receive
// a live JavaScript event handler merely from the generated HTML.

// ---------------------------------------------------------------------
// 10. Server rendering and client rendering have different environments
// ---------------------------------------------------------------------

export const ServerSafeComponent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Server-rendered content</h2>
      <p>This component does not require browser-only APIs during rendering.</p>
    </section>
  );
};

export const renderServerSafeComponent = (): string => {
  return renderToString(<ServerSafeComponent />);
};

// Code that executes during server rendering must respect the server environment.
// Browser-only APIs such as `window` and `document` are not available by default.

// ---------------------------------------------------------------------
// 11. Server data can be passed into the rendered tree
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

interface ProductPageProps {
  readonly product: Product;
}

export const ProductPage: FC<ProductPageProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
    </article>
  );
};

export const renderProductPage = (product: Product): string => {
  return renderToString(<ProductPage product={product} />);
};

export const serverDataExample = (): string => {
  const product: Product = {
    id: 1,
    name: "Example Product",
    price: 49.99,
  };

  return renderProductPage(product);
};

// Server application code can obtain data and provide it to React as props
// before rendering the component tree.

// ---------------------------------------------------------------------
// 12. Server rendering can render a complete application tree
// ---------------------------------------------------------------------

export const Application: FC = (): ReactElement => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return <Dashboard user={user} notifications={3} />;
};

export const renderApplication = (): string => {
  return renderToString(<Application />);
};

// The top-level application component is still an ordinary React component.
// The difference is the environment and rendering target.

// ---------------------------------------------------------------------
// 13. Server rendering can produce different output for different requests
// ---------------------------------------------------------------------

interface RequestPageProps {
  readonly user: User;
}

export const RequestPage: FC<RequestPageProps> = ({ user }): ReactElement => {
  return (
    <main>
      <h1>Welcome, {user.name}</h1>
      <p>{user.email}</p>
    </main>
  );
};

export const renderRequestPage = (user: User): string => {
  return renderToString(<RequestPage user={user} />);
};

export const requestRenderingExample = (): string => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return renderRequestPage(user);
};

// Server application code can construct a different React tree or provide
// different props for each request before producing the response.

// ---------------------------------------------------------------------
// 14. Server rendering is a rendering strategy, not a component type
// ---------------------------------------------------------------------

export const SharedComponent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <p>John Doe</p>
    </section>
  );
};

export const renderSharedComponentOnServer = (): string => {
  return renderToString(<SharedComponent />);
};

// The same React component can participate in different rendering environments.
// Server rendering describes where and how the tree is rendered, not a special component syntax.

// ---------------------------------------------------------------------
// 15. Server rendering can provide the initial HTML for hydration
// ---------------------------------------------------------------------

export const HydratableApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>
      <p>John Doe</p>
      <button type="button">Save</button>
    </main>
  );
};

export const renderInitialApplication = (): string => {
  return renderToString(<HydratableApplication />);
};

// The generated HTML can become the initial document content.
// A later hydration step can attach React's client-side behavior to the existing markup.

// ---------------------------------------------------------------------
// 16. Complete demonstration
// ---------------------------------------------------------------------

export const ServerRenderingDemo: FC = (): ReactElement => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <main>
      <Greeting />
      <AccountPage user={user} />
      <Dashboard user={user} notifications={3} />
      <AccountContent />
      <InteractiveMarkupExample />
      <ServerSafeComponent />
      <ProductPage
        product={{
          id: 1,
          name: "Example Product",
          price: 49.99,
        }}
      />
      <Application />
      <RequestPage user={user} />
      <SharedComponent />
      <HydratableApplication />
    </main>
  );
};

export default ServerRenderingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Server rendering renders a React component tree in a server environment.
// - Server rendering does not require a browser DOM, `window`, or `document`.
// - `renderToString` produces an HTML string representing a React tree.
// - The generated HTML can be incorporated into a larger document and sent to a browser.
// - Server-rendered markup provides initial content but does not by itself attach browser event handlers.
// - Server-side application code can obtain data and pass that data to React through props.
// - Components rendered on the server must account for the server environment and avoid unavailable browser APIs during rendering.
// - Server rendering can produce different markup for different requests by using request-specific data.
// - Server rendering describes the rendering environment and strategy rather than a special type of React component.
// - Server-rendered HTML can provide the initial markup that a later hydration step makes interactive.
