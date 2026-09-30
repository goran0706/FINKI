/**
 * Static Rendering
 * ================
 *
 * Static rendering produces HTML for a React tree when the result does not need to become
 * an interactive React application immediately. It is useful for content such as documents,
 * pre-rendered pages, emails, and other output where React's client-side behavior is unnecessary.
 */

// ---------------------------------------------------------------------
// 1. Importing static rendering APIs
// ---------------------------------------------------------------------

import { prerender, prerenderToNodeStream, renderToStaticMarkup } from "react-dom/static";
import { type FC, type ReactElement } from "react";

// Static rendering APIs produce HTML without creating a browser DOM.
// The resulting markup is intended to represent the rendered content itself.

// ---------------------------------------------------------------------
// 2. Basic static markup
// ---------------------------------------------------------------------

export const Article: FC = (): ReactElement => {
  return (
    <article>
      <h1>Example Article</h1>
      <p>This content is rendered as static HTML.</p>
    </article>
  );
};

export const renderArticleMarkup = (): string => {
  return renderToStaticMarkup(<Article />);
};

const articleMarkup = renderArticleMarkup();

console.log(articleMarkup);

// `renderToStaticMarkup` synchronously returns an HTML string.
// The output is intended for content that does not need React to hydrate it.

// ---------------------------------------------------------------------
// 3. Static rendering with data
// ---------------------------------------------------------------------

interface Product {
  readonly name: string;
  readonly price: string;
}

interface ProductCardProps {
  readonly product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>Price: {product.price}</p>
    </article>
  );
};

export const renderProductCard = (product: Product): string => {
  return renderToStaticMarkup(<ProductCard product={product} />);
};

const productMarkup = renderProductCard({
  name: "Example Product",
  price: "$49.99",
});

console.log(productMarkup);

// Static rendering can use normal React props and component composition.
// The difference is in how the resulting output is intended to be consumed.

// ---------------------------------------------------------------------
// 4. Static rendering produces HTML, not DOM nodes
// ---------------------------------------------------------------------

export const Information: FC = (): ReactElement => {
  return (
    <section>
      <h1>Information</h1>
      <p>Static rendering produces HTML output.</p>
    </section>
  );
};

export const renderInformation = (): string => {
  return renderToStaticMarkup(<Information />);
};

const informationMarkup = renderInformation();

console.log(typeof informationMarkup); // string
console.log(informationMarkup);

// The server receives a string representation of the rendered HTML.
// It does not receive an `HTMLElement` or a browser-managed React tree.

// ---------------------------------------------------------------------
// 5. Static output can contain ordinary HTML elements
// ---------------------------------------------------------------------

export const StaticDocument: FC = (): ReactElement => {
  return (
    <main>
      <header>
        <h1>Example Document</h1>
      </header>
      <section>
        <h2>Introduction</h2>
        <p>This document contains static React-rendered content.</p>
      </section>
      <footer>
        <small>Example footer</small>
      </footer>
    </main>
  );
};

export const renderStaticDocument = (): string => {
  return renderToStaticMarkup(<StaticDocument />);
};

const staticDocumentMarkup = renderStaticDocument();

console.log(staticDocumentMarkup);

// Static rendering can represent complete sections of HTML using ordinary React components.

// ---------------------------------------------------------------------
// 6. Static rendering can produce a complete document
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
      <body>{children}</body>
    </html>
  );
};

export const renderDocument = (): string => {
  return renderToStaticMarkup(
    <Document title="Example Document">
      <StaticDocument />
    </Document>,
  );
};

const documentMarkup = renderDocument();

console.log(documentMarkup);

// Static rendering can be used to generate complete HTML documents when React
// is only responsible for producing the final markup.

// ---------------------------------------------------------------------
// 7. Static rendering does not attach event handlers
// ---------------------------------------------------------------------

export const StaticButton: FC = (): ReactElement => {
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

export const renderStaticButton = (): string => {
  return renderToStaticMarkup(<StaticButton />);
};

const staticButtonMarkup = renderStaticButton();

console.log(staticButtonMarkup);

// The React event handler is part of the component definition,
// but static HTML output does not contain an attached React event listener.
// There is no client-side hydration step for this output.

// ---------------------------------------------------------------------
// 8. Static rendering is different from hydratable server rendering
// ---------------------------------------------------------------------

export const HydratableContent: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <button type="button">Continue</button>
    </main>
  );
};

export const renderHydratableContent = (): string => {
  return renderToStaticMarkup(<HydratableContent />);
};

const nonHydratableMarkup = renderHydratableContent();

console.log(nonHydratableMarkup);

// Static output is not intended to be passed to `hydrateRoot`.
// If the markup needs to become a React application in the browser,
// it should be rendered using a server rendering API intended for hydration.

// ---------------------------------------------------------------------
// 9. Static rendering can be used for content that never becomes interactive
// ---------------------------------------------------------------------

interface SearchResult {
  readonly title: string;
  readonly description: string;
}

interface SearchResultsProps {
  readonly results: readonly SearchResult[];
}

export const SearchResults: FC<SearchResultsProps> = ({ results }): ReactElement => {
  return (
    <section>
      <h1>Search Results</h1>
      <ul>
        {results.map((result) => (
          <li key={result.title}>
            <h2>{result.title}</h2>
            <p>{result.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const renderSearchResults = (results: readonly SearchResult[]): string => {
  return renderToStaticMarkup(<SearchResults results={results} />);
};

const searchResultsMarkup = renderSearchResults([
  {
    title: "Example Result",
    description: "An example search result.",
  },
  {
    title: "Another Result",
    description: "Another example search result.",
  },
]);

console.log(searchResultsMarkup);

// Static rendering is suitable when the output is consumed as HTML
// and does not require a React client runtime.

// ---------------------------------------------------------------------
// 10. `prerender` produces static output after waiting for data
// ---------------------------------------------------------------------

interface Account {
  readonly name: string;
  readonly email: string;
}

interface AccountPageProps {
  readonly account: Account;
}

export const AccountPage: FC<AccountPageProps> = ({ account }): ReactElement => {
  return (
    <main>
      <h1>{account.name}</h1>
      <p>{account.email}</p>
    </main>
  );
};

export const prerenderAccountPage = async (account: Account): Promise<Awaited<ReturnType<typeof prerender>>> => {
  return prerender(<AccountPage account={account} />);
};

const accountPrerender = prerenderAccountPage({
  name: "John Doe",
  email: "john.doe@example.com",
});

console.log(accountPrerender);

// `prerender` is an asynchronous static rendering API.
// Unlike synchronous string rendering, it is designed to wait for data
// that suspends during rendering before producing the static output.

// ---------------------------------------------------------------------
// 11. Reading the output produced by `prerender`
// ---------------------------------------------------------------------

export const renderPrerenderedPage = async (account: Account): Promise<string> => {
  const result = await prerender(<AccountPage account={account} />);

  return await new Response(result.pre).text();
};

const prerenderedPage = renderPrerenderedPage({
  name: "John Doe",
  email: "john.doe@example.com",
});

console.log(prerenderedPage);

// `prerender` returns a result containing a Web ReadableStream.
// The stream can be consumed using standard Web Streams APIs.

// ---------------------------------------------------------------------
// 12. `prerender` can render Suspense-based content
// ---------------------------------------------------------------------

export const AsyncContent: FC = (): ReactElement => {
  return (
    <section>
      <h1>Account Information</h1>
      <p>Content is ready for static output.</p>
    </section>
  );
};

export const prerenderAsyncContent = async (): Promise<string> => {
  const result = await prerender(<AsyncContent />);

  return await new Response(result.pre).text();
};

// The asynchronous prerendering API is designed for static generation where
// React may need to wait for suspended content before producing the final output.

// ---------------------------------------------------------------------
// 13. Node.js environments can use `prerenderToNodeStream`
// ---------------------------------------------------------------------

export const createNodePrerenderStream = (account: Account) => {
  return prerenderToNodeStream(<AccountPage account={account} />);
};

// `prerenderToNodeStream` provides the Node.js stream equivalent of `prerender`.
// It is useful when the server environment uses Node.js stream APIs.

// ---------------------------------------------------------------------
// 14. Static rendering is useful for generated documents
// ---------------------------------------------------------------------

interface EmailProps {
  readonly recipientName: string;
  readonly message: string;
}

export const Email: FC<EmailProps> = ({ recipientName, message }): ReactElement => {
  return (
    <main>
      <h1>Hello, {recipientName}</h1>
      <p>{message}</p>
      <p>Thank you for your time.</p>
    </main>
  );
};

export const renderEmail = (recipientName: string, message: string): string => {
  return renderToStaticMarkup(<Email recipientName={recipientName} message={message} />);
};

const emailMarkup = renderEmail("John Doe", "This is an example message.");

console.log(emailMarkup);

// Generated email or document content often does not need a React runtime
// after the HTML has been produced, making static rendering appropriate.

// ---------------------------------------------------------------------
// 15. Static rendering can be combined with server data preparation
// ---------------------------------------------------------------------

export const buildStaticPage = async (): Promise<string> => {
  const product: Product = {
    name: "Example Product",
    price: "$49.99",
  };

  const result = await prerender(<ProductCard product={product} />);

  return await new Response(result.pre).text();
};

const staticPage = buildStaticPage();

console.log(staticPage);

// Data can be prepared before rendering, while `prerender` handles
// asynchronous React rendering and produces static output.

// ---------------------------------------------------------------------
// 16. Choosing between synchronous and asynchronous static rendering
// ---------------------------------------------------------------------

export const renderSimpleStaticPage = (): string => {
  return renderToStaticMarkup(<StaticDocument />);
};

export const renderAsyncStaticPage = async (): Promise<string> => {
  const result = await prerender(<AsyncContent />);

  return await new Response(result.pre).text();
};

const simpleStaticPage = renderSimpleStaticPage();
const asyncStaticPage = renderAsyncStaticPage();

console.log(simpleStaticPage);
console.log(asyncStaticPage);

// `renderToStaticMarkup` is synchronous and useful for immediately available content.
// `prerender` is asynchronous and is designed for static rendering that can involve suspended work.

// ---------------------------------------------------------------------
// 17. Complete demonstration
// ---------------------------------------------------------------------

export const StaticRenderingDemo: FC = (): ReactElement => {
  const product: Product = {
    name: "Example Product",
    price: "$49.99",
  };

  const results: readonly SearchResult[] = [
    {
      title: "Example Result",
      description: "An example search result.",
    },
    {
      title: "Another Result",
      description: "Another example search result.",
    },
  ];

  return (
    <main>
      <Article />
      <ProductCard product={product} />
      <Information />
      <StaticDocument />
      <StaticButton />
      <SearchResults results={results} />
      <AccountPage
        account={{
          name: "John Doe",
          email: "john.doe@example.com",
        }}
      />
      <AsyncContent />
      <Email recipientName="John Doe" message="This is an example message." />
    </main>
  );
};

export default StaticRenderingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Static rendering produces HTML intended to represent content without requiring a React client runtime.
// - `renderToStaticMarkup` synchronously produces static HTML markup.
// - `prerender` asynchronously produces static output and can wait for suspended content.
// - `prerenderToNodeStream` provides asynchronous static rendering through a Node.js stream.
// - Static output is not intended to be hydrated into an interactive React application.
// - Static rendering can still use normal React components, props, composition, and data.
// - Event handlers defined in components are not attached to static HTML output.
// - `renderToStaticMarkup` is useful for immediately available static content.
// - `prerender` is useful when static generation can involve asynchronous or suspended rendering work.
// - Static rendering is appropriate for documents and other HTML that does not need React interactivity.
