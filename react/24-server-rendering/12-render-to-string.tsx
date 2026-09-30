/**
 * Render To String
 * =================
 *
 * `renderToString` renders a React tree into an HTML string on the server. The generated HTML can
 * be sent as the initial response and later hydrated with `hydrateRoot` to make the application
 * interactive in the browser.
 */

import { Suspense, use, type FC, type ReactElement } from "react";
import { renderToString } from "react-dom/server";

// ---------------------------------------------------------------------
// 1. Basic renderToString usage
// ---------------------------------------------------------------------

export const Greeting: FC = (): ReactElement => {
  return (
    <section>
      <h1>Hello, John Doe</h1>
      <p>Welcome to the example application.</p>
    </section>
  );
};

export const renderGreeting = (): string => {
  return renderToString(<Greeting />);
};

const greetingMarkup = renderGreeting();

console.log(greetingMarkup);

// `renderToString` evaluates the React tree and returns the generated HTML as a string.
// The returned string is not a browser DOM node.

// ---------------------------------------------------------------------
// 2. Rendering component props
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly name: string;
  readonly email: string;
}

export const UserCard: FC<UserCardProps> = ({ name, email }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>{email}</p>
    </article>
  );
};

export const renderUserCard = (name: string, email: string): string => {
  return renderToString(<UserCard name={name} email={email} />);
};

const userCardMarkup = renderUserCard("John Doe", "john.doe@example.com");

console.log(userCardMarkup);

// Component props are resolved during the server render.
// The resulting HTML can contain the values produced by those props.

// ---------------------------------------------------------------------
// 3. Rendering a component tree
// ---------------------------------------------------------------------

export const Header: FC = (): ReactElement => {
  return (
    <header>
      <h1>Example Website</h1>
    </header>
  );
};

export const Article: FC = (): ReactElement => {
  return (
    <article>
      <h2>Example Article</h2>
      <p>This article was rendered on the server.</p>
    </article>
  );
};

export const Footer: FC = (): ReactElement => {
  return (
    <footer>
      <small>Example Company</small>
    </footer>
  );
};

export const Application: FC = (): ReactElement => {
  return (
    <main>
      <Header />

      <Article />

      <Footer />
    </main>
  );
};

export const renderApplication = (): string => {
  return renderToString(<Application />);
};

// `renderToString` renders the complete React component tree into one HTML string.

// ---------------------------------------------------------------------
// 4. Rendering a complete document
// ---------------------------------------------------------------------

export const Document: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Example Document</title>
      </head>
      <body>
        <Application />
      </body>
    </html>
  );
};

export const renderDocument = (): string => {
  return renderToString(<Document />);
};

// The rendered React tree can represent the entire document, including `<html>`, `<head>`, and `<body>`.
// The server can send the resulting HTML string as the initial document response.

// ---------------------------------------------------------------------
// 5. Server-rendered HTML is initially non-interactive
// ---------------------------------------------------------------------

export const InteractiveButton: FC = (): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        console.log("Clicked");
      }}
    >
      Continue
    </button>
  );
};

export const renderInteractiveButton = (): string => {
  return renderToString(<InteractiveButton />);
};

const buttonMarkup = renderInteractiveButton();

console.log(buttonMarkup);

// The `onClick` function is part of the React tree but is not serialized as an HTML event listener.
// The resulting HTML is initially non-interactive until it is hydrated in the browser.

// ---------------------------------------------------------------------
// 6. Hydrating renderToString output
// ---------------------------------------------------------------------

export const HydratableApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <button type="button">Continue</button>
    </main>
  );
};

export const renderHydratableApplication = (): string => {
  return renderToString(<HydratableApplication />);
};

// The client can pass the same component tree to `hydrateRoot`.
// The initial client render must match the server-rendered output.

// ---------------------------------------------------------------------
// 7. Request-specific rendering
// ---------------------------------------------------------------------

interface RequestData {
  readonly userName: string;
  readonly theme: "light" | "dark";
}

interface RequestPageProps {
  readonly data: RequestData;
}

export const RequestPage: FC<RequestPageProps> = ({ data }): ReactElement => {
  return (
    <main data-theme={data.theme}>
      <h1>Hello, {data.userName}</h1>
      <p>Welcome back.</p>
    </main>
  );
};

export const renderRequestPage = (data: RequestData): string => {
  return renderToString(<RequestPage data={data} />);
};

const requestMarkup = renderRequestPage({
  userName: "John Doe",
  theme: "light",
});

console.log(requestMarkup);

// A server can use request-specific data to determine the HTML returned for each request.

// ---------------------------------------------------------------------
// 8. Rendering lists
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: string;
}

interface ProductListProps {
  readonly products: readonly Product[];
}

export const ProductList: FC<ProductListProps> = ({ products }): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <strong>{product.name}</strong>
          {" — "}
          <span>{product.price}</span>
        </li>
      ))}
    </ul>
  );
};

export const renderProductList = (products: readonly Product[]): string => {
  return renderToString(<ProductList products={products} />);
};

const productMarkup = renderProductList([
  {
    id: 1,
    name: "Example Product",
    price: "$19.99",
  },
  {
    id: 2,
    name: "Another Product",
    price: "$29.99",
  },
]);

console.log(productMarkup);

// Server rendering can produce HTML from ordinary JavaScript data structures such as arrays.

// ---------------------------------------------------------------------
// 9. Attributes and HTML output
// ---------------------------------------------------------------------

export const AccessibleContent: FC = (): ReactElement => {
  return (
    <article aria-labelledby="content-title" data-section="example">
      <h2 id="content-title">Example Content</h2>
      <p>Server rendering preserves normal HTML attributes.</p>
    </article>
  );
};

export const renderAccessibleContent = (): string => {
  return renderToString(<AccessibleContent />);
};

// JSX attributes are converted into the corresponding HTML attributes in the returned string.

// ---------------------------------------------------------------------
// 10. Forms and server-rendered HTML
// ---------------------------------------------------------------------

export const ContactForm: FC = (): ReactElement => {
  return (
    <form action="/contact" method="post">
      <label htmlFor="name">Name</label>
      <input id="name" name="name" type="text" />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" />

      <button type="submit">Send</button>
    </form>
  );
};

export const renderContactForm = (): string => {
  return renderToString(<ContactForm />);
};

// Native browser behavior can work with the generated HTML.
// React-specific event handlers still require hydration to become active.

// ---------------------------------------------------------------------
// 11. React-generated IDs
// ---------------------------------------------------------------------

export const IdentifiedContent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Example Section</h2>
      <p>This section contains server-rendered content.</p>
    </section>
  );
};

export const renderIdentifiedContent = (): string => {
  return renderToString(<IdentifiedContent />);
};

// React can generate IDs with `useId` during server rendering.
// When those IDs are also generated during hydration, the server and client need matching configuration.

// ---------------------------------------------------------------------
// 12. The identifierPrefix option
// ---------------------------------------------------------------------

export const IdentifiedApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <p>Content with React-generated identifiers.</p>
    </main>
  );
};

export const renderWithIdentifierPrefix = (): string => {
  return renderToString(<IdentifiedApplication />, {
    identifierPrefix: "example-",
  });
};

// `identifierPrefix` prefixes IDs generated by React's `useId`.
// When hydrating this output, the same prefix must be passed to `hydrateRoot`.

// ---------------------------------------------------------------------
// 13. Suspense fallback behavior
// ---------------------------------------------------------------------

const profilePromise = new Promise<string>(() => {
  // This Promise intentionally remains pending.
});

export const Profile: FC = (): ReactElement => {
  const name = use(profilePromise);

  return (
    <section>
      <h2>{name}</h2>
      <p>Profile content.</p>
    </section>
  );
};

export const ProfilePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Profile</h1>

      <Suspense fallback={<p>Loading profile...</p>}>
        <Profile />
      </Suspense>
    </main>
  );
};

export const renderProfilePage = (): string => {
  return renderToString(<ProfilePage />);
};

// `renderToString` has limited Suspense support.
// If a component suspends, React immediately renders the nearest Suspense fallback into the HTML.

// ---------------------------------------------------------------------
// 14. renderToString does not wait for suspended content
// ---------------------------------------------------------------------

const accountPromise = new Promise<string>(() => {
  // This Promise intentionally remains pending.
});

export const Account: FC = (): ReactElement => {
  const name = use(accountPromise);

  return (
    <section>
      <h2>{name}</h2>
      <p>Account content.</p>
    </section>
  );
};

export const AccountPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>

      <Suspense fallback={<p>Loading account...</p>}>
        <Account />
      </Suspense>
    </main>
  );
};

export const renderAccountPage = (): string => {
  return renderToString(<AccountPage />);
};

// Unlike the streaming server APIs, `renderToString` does not wait for suspended content.
// The fallback is included immediately in the returned HTML.

// ---------------------------------------------------------------------
// 15. renderToString does not stream
// ---------------------------------------------------------------------

export const StreamingComparisonPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Page</h1>
      <p>This entire tree is returned as one string.</p>
    </main>
  );
};

export const renderWithoutStreaming = (): string => {
  return renderToString(<StreamingComparisonPage />);
};

// `renderToString` always returns one complete string.
// It cannot progressively send HTML as different parts of the tree become ready.

// ---------------------------------------------------------------------
// 16. Rendering changing data
// ---------------------------------------------------------------------

interface ProductPageProps {
  readonly product: Product;
}

export const ProductPage: FC<ProductPageProps> = ({ product }): ReactElement => {
  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.price}</p>
    </main>
  );
};

export const renderProductPage = (product: Product): string => {
  return renderToString(<ProductPage product={product} />);
};

const firstProductMarkup = renderProductPage({
  id: 1,
  name: "Example Product",
  price: "$19.99",
});

const secondProductMarkup = renderProductPage({
  id: 2,
  name: "Another Product",
  price: "$29.99",
});

console.log(firstProductMarkup);
console.log(secondProductMarkup);

// The same component can produce different HTML for different server requests
// because the input data can change between renders.

// ---------------------------------------------------------------------
// 17. Rendering a complete HTTP response body
// ---------------------------------------------------------------------

export const ResponseDocument: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Application</title>
      </head>
      <body>
        <main>
          <h1>Example Application</h1>
          <p>This document was rendered on the server.</p>
        </main>
      </body>
    </html>
  );
};

export const createResponseBody = (): string => {
  const html = renderToString(<ResponseDocument />);

  return `<!DOCTYPE html>${html}`;
};

// The returned string can be used as an HTTP response body.
// The exact response handling depends on the server framework.

// ---------------------------------------------------------------------
// 18. renderToString is a server API
// ---------------------------------------------------------------------

export const ServerOnlyApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Server-Rendered Application</h1>
      <p>This component tree is rendered into HTML on the server.</p>
    </main>
  );
};

export const renderServerApplication = (): string => {
  return renderToString(<ServerOnlyApplication />);
};

// `renderToString` belongs at the server entry point of an application.
// Individual React components normally do not need to import or call this API.

// ---------------------------------------------------------------------
// 19. renderToString versus static markup
// ---------------------------------------------------------------------

export const HydratableContent: FC = (): ReactElement => {
  return (
    <main>
      <h1>Hydratable Content</h1>
      <p>This HTML can become an interactive React application.</p>
    </main>
  );
};

export const renderHydratableContent = (): string => {
  return renderToString(<HydratableContent />);
};

// `renderToString` is intended for server-rendered HTML that may later be hydrated.
// `renderToStaticMarkup` is intended for static HTML that will not be hydrated.

// ---------------------------------------------------------------------
// 20. renderToString versus streaming rendering
// ---------------------------------------------------------------------

export const RenderingStrategyExample: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>

      <section>
        <h2>Primary Content</h2>
        <p>Initial application content.</p>
      </section>

      <Suspense fallback={<p>Loading additional content...</p>}>
        <section>
          <h2>Additional Content</h2>
          <p>Content may suspend during rendering.</p>
        </section>
      </Suspense>
    </main>
  );
};

export const renderWithString = (): string => {
  return renderToString(<RenderingStrategyExample />);
};

// `renderToString` is a non-streaming API with limited Suspense support.
// For progressive server rendering, React recommends `renderToPipeableStream` in Node.js
// or `renderToReadableStream` in environments that use Web Streams.

// ---------------------------------------------------------------------
// 21. Rendering and hydration must match
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const HydrationGreeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return (
    <main>
      <h1>Hello, {name}</h1>
      <p>Welcome to the application.</p>
    </main>
  );
};

export const renderHydrationGreeting = (name: string): string => {
  return renderToString(<HydrationGreeting name={name} />);
};

// The client must use the same initial data and component output when calling `hydrateRoot`.
// Different server and client output can produce hydration mismatches.

// ---------------------------------------------------------------------
// 22. Complete demonstration
// ---------------------------------------------------------------------

export const RenderToStringDemo: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Example Application</title>
      </head>
      <body>
        <header>
          <h1>Example Application</h1>
        </header>

        <main>
          <section>
            <h2>Products</h2>

            <ProductList
              products={[
                {
                  id: 1,
                  name: "Example Product",
                  price: "$19.99",
                },
                {
                  id: 2,
                  name: "Another Product",
                  price: "$29.99",
                },
              ]}
            />
          </section>

          <section>
            <h2>Contact</h2>
            <ContactForm />
          </section>
        </main>

        <footer>
          <small>Example Company</small>
        </footer>
      </body>
    </html>
  );
};

export const generateDemoMarkup = (): string => {
  return renderToString(<RenderToStringDemo />);
};

export default RenderToStringDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `renderToString` renders a React tree into an HTML string.
// - It is imported from `react-dom/server` and is primarily used at the server entry point.
// - The returned HTML is initially non-interactive and can later be hydrated with `hydrateRoot`.
// - The initial client render must match the server-rendered output for successful hydration.
// - `renderToString` returns one string and does not progressively stream HTML.
// - `renderToString` does not wait for suspended content to resolve.
// - When a component suspends, `renderToString` renders the nearest Suspense fallback into the HTML.
// - `identifierPrefix` controls the prefix used for IDs generated by React's `useId`.
// - The same `identifierPrefix` must be passed to `hydrateRoot` when hydrating the generated HTML.
// - `renderToString` can render a complete React document, including `<html>`, `<head>`, and `<body>`.
// - `renderToString` is different from `renderToStaticMarkup`, which produces output that cannot be hydrated.
// - For progressive server rendering, React recommends `renderToPipeableStream` or `renderToReadableStream`.
// - For static HTML generation that needs to wait for data, React recommends the `prerender` APIs.
