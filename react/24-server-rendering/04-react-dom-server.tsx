/**
 * React DOM Server
 * ================
 *
 * `react-dom/server` provides APIs for rendering React components into HTML on the server.
 * These APIs are used when React needs to produce HTML outside the browser, such as for an
 * initial document response, server-side rendering, static markup, or streaming output.
 */

// ---------------------------------------------------------------------
// 1. Importing server rendering APIs
// ---------------------------------------------------------------------

import { renderToPipeableStream, renderToReadableStream, renderToStaticMarkup, renderToString } from "react-dom/server";
import { type FC, type ReactElement } from "react";

// Server rendering does not require a browser DOM or `createRoot`.
// The result is server-generated HTML rather than a live browser DOM tree.

// ---------------------------------------------------------------------
// 2. Basic server rendering with `renderToString`
// ---------------------------------------------------------------------

export const Greeting: FC = (): ReactElement => {
  return (
    <main>
      <h1>Hello, John Doe</h1>
      <p>Welcome to the application.</p>
    </main>
  );
};

export const renderGreeting = (): string => {
  return renderToString(<Greeting />);
};

const greetingMarkup = renderGreeting();

console.log(greetingMarkup);

// `renderToString` synchronously produces an HTML string representing the React tree.
// The string can then be included in a larger server response.

// ---------------------------------------------------------------------
// 3. Rendering composed component trees
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

export const AccountPage: FC<AccountPageProps> = ({ user }): ReactElement => {
  return (
    <main>
      <h1>Account</h1>
      <UserProfile user={user} />
    </main>
  );
};

export const renderAccountPage = (user: User): string => {
  return renderToString(<AccountPage user={user} />);
};

const accountMarkup = renderAccountPage({
  name: "John Doe",
  email: "john.doe@example.com",
});

console.log(accountMarkup);

// Server rendering follows the same component composition model as normal React rendering.
// The difference is that the result is serialized HTML rather than browser-managed elements.

// ---------------------------------------------------------------------
// 4. Server rendering does not create browser DOM nodes
// ---------------------------------------------------------------------

export const Dashboard: FC = (): ReactElement => {
  return (
    <section>
      <h1>Dashboard</h1>
      <p>Account information is ready.</p>
    </section>
  );
};

export const renderDashboard = (): string => {
  const markup = renderToString(<Dashboard />);

  return markup;
};

const dashboardMarkup = renderDashboard();

console.log(typeof dashboardMarkup); // string
console.log(dashboardMarkup);

// `renderToString` returns text containing HTML markup.
// It does not return an `HTMLElement` and does not attach anything to a browser document.

// ---------------------------------------------------------------------
// 5. Server rendering can use request-specific data
// ---------------------------------------------------------------------

interface Product {
  readonly name: string;
  readonly price: string;
}

interface ProductPageProps {
  readonly product: Product;
}

export const ProductPage: FC<ProductPageProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h1>{product.name}</h1>
      <p>Price: {product.price}</p>
    </article>
  );
};

export const renderProductPage = (product: Product): string => {
  return renderToString(<ProductPage product={product} />);
};

const productMarkup = renderProductPage({
  name: "Example Product",
  price: "$49.99",
});

console.log(productMarkup);

// The server can obtain request-specific data and pass it into the React tree before rendering.

// ---------------------------------------------------------------------
// 6. Rendering a complete document structure
// ---------------------------------------------------------------------

interface DocumentProps {
  readonly title: string;
  readonly children: ReactElement;
}

export const Document: FC<DocumentProps> = ({ title, children }): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{title}</title>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
};

export const renderDocument = (): string => {
  return renderToString(
    <Document title="Example Application">
      <Greeting />
    </Document>,
  );
};

const documentMarkup = renderDocument();

console.log(documentMarkup);

// A server response can contain a complete HTML document.
// Applications can also use framework-specific document handling instead of constructing the document manually.

// ---------------------------------------------------------------------
// 7. Server rendering does not attach browser event handlers
// ---------------------------------------------------------------------

export const SaveButton: FC = (): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        console.log("Saved");
      }}
    >
      Save
    </button>
  );
};

export const renderSaveButton = (): string => {
  return renderToString(<SaveButton />);
};

const saveButtonMarkup = renderSaveButton();

console.log(saveButtonMarkup);

// The event handler participates in the React component definition,
// but server rendering does not execute it or attach a browser listener.
// Hydration is responsible for making server-rendered markup interactive.

// ---------------------------------------------------------------------
// 8. Server rendering can produce initial application HTML
// ---------------------------------------------------------------------

export const Application: FC = (): ReactElement => {
  return (
    <main>
      <header>
        <h1>Example Application</h1>
      </header>
      <section>
        <p>Initial content was rendered on the server.</p>
      </section>
    </main>
  );
};

export const renderApplication = (): string => {
  return renderToString(<Application />);
};

const initialApplicationMarkup = renderApplication();

console.log(initialApplicationMarkup);

// The resulting HTML can be sent to the browser as part of the initial response.
// If the application is intended to become interactive, the client can later hydrate the markup.

// ---------------------------------------------------------------------
// 9. `renderToStaticMarkup` produces non-hydratable static HTML
// ---------------------------------------------------------------------

export const StaticContent: FC = (): ReactElement => {
  return (
    <article>
      <h1>Example Article</h1>
      <p>This content is intended to remain static.</p>
    </article>
  );
};

export const renderStaticContent = (): string => {
  return renderToStaticMarkup(<StaticContent />);
};

const staticMarkup = renderStaticContent();

console.log(staticMarkup);

// `renderToStaticMarkup` is intended for HTML that does not need to be hydrated.
// It produces static markup rather than output intended to become an interactive React tree.

// ---------------------------------------------------------------------
// 10. `renderToString` and static rendering have different purposes
// ---------------------------------------------------------------------

export const InteractiveContent: FC = (): ReactElement => {
  return <button type="button">Continue</button>;
};

export const renderInteractiveContent = (): string => {
  return renderToString(<InteractiveContent />);
};

export const renderNonInteractiveContent = (): string => {
  return renderToStaticMarkup(<StaticContent />);
};

const interactiveMarkup = renderInteractiveContent();
const nonInteractiveMarkup = renderNonInteractiveContent();

console.log(interactiveMarkup);
console.log(nonInteractiveMarkup);

// `renderToString` is intended for React-rendered HTML that can participate in hydration.
// `renderToStaticMarkup` is intended when the resulting HTML does not need React hydration.

// ---------------------------------------------------------------------
// 11. Server rendering can be streamed
// ---------------------------------------------------------------------

export const StreamingApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Streaming Application</h1>
      <p>HTML can be delivered progressively.</p>
    </main>
  );
};

// Node.js environments can use `renderToPipeableStream`.
// It produces a Node.js-compatible stream that can be piped into an HTTP response.

export const createNodeStream = () => {
  return renderToPipeableStream(<StreamingApplication />, {});
};

// Web Streams environments can use `renderToReadableStream`.
// It produces a Web ReadableStream containing the rendered output.

export const createWebStream = async () => {
  return renderToReadableStream(<StreamingApplication />);
};

// Streaming APIs allow the server to begin delivering HTML before the entire
// response has necessarily been assembled into one string.

// ---------------------------------------------------------------------
// 12. Server rendering can represent loading boundaries
// ---------------------------------------------------------------------

export const LoadingBoundaryExample: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>
      <p>Account information is available.</p>
    </main>
  );
};

export const renderLoadingBoundaryExample = (): string => {
  return renderToString(<LoadingBoundaryExample />);
};

const loadingBoundaryMarkup = renderLoadingBoundaryExample();

console.log(loadingBoundaryMarkup);

// React's server rendering APIs can work with Suspense boundaries.
// Streaming APIs are particularly important when server-rendered content
// needs to be delivered progressively as asynchronous work becomes available.

// ---------------------------------------------------------------------
// 13. Server rendering is separate from hydration
// ---------------------------------------------------------------------

export const HydratableApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <button type="button">Continue</button>
    </main>
  );
};

export const createInitialMarkup = (): string => {
  return renderToString(<HydratableApplication />);
};

// Server rendering produces the initial HTML.
// A client-side hydration step is responsible for attaching React behavior
// to that existing HTML in the browser.

// ---------------------------------------------------------------------
// 14. Server rendering does not require `window` or `document`
// ---------------------------------------------------------------------

export const ServerSafeComponent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Server-safe content</h2>
      <p>This component does not access browser-only APIs while rendering.</p>
    </section>
  );
};

export const renderServerSafeComponent = (): string => {
  return renderToString(<ServerSafeComponent />);
};

const serverSafeMarkup = renderServerSafeComponent();

console.log(serverSafeMarkup);

// Components rendered on the server should avoid assuming browser globals such as
// `window` and `document` are available during the server rendering operation.

// ---------------------------------------------------------------------
// 15. Complete demonstration
// ---------------------------------------------------------------------

export const ReactDomServerDemo: FC = (): ReactElement => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <main>
      <Greeting />
      <AccountPage user={user} />
      <Dashboard />
      <ProductPage
        product={{
          name: "Example Product",
          price: "$49.99",
        }}
      />
      <SaveButton />
      <Application />
      <StaticContent />
      <StreamingApplication />
      <LoadingBoundaryExample />
      <HydratableApplication />
      <ServerSafeComponent />
      <InteractiveContent />
    </main>
  );
};

export default ReactDomServerDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `react-dom/server` provides APIs for rendering React trees into server-generated HTML.
// - Server rendering produces HTML markup rather than creating or managing browser DOM nodes.
// - `renderToString` synchronously produces an HTML string from a React tree.
// - `renderToStaticMarkup` produces static HTML intended for content that does not need hydration.
// - `renderToPipeableStream` provides streaming output for Node.js-compatible stream environments.
// - `renderToReadableStream` provides streaming output through the Web Streams API.
// - Server-rendered event handlers are not attached to browser elements during server rendering.
// - Hydration is a separate client-side operation that makes compatible server-rendered markup interactive.
// - Server-rendered components should not assume browser globals such as `window` or `document` exist.
// - Streaming rendering can progressively deliver HTML instead of waiting for one complete HTML string.
