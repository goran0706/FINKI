/**
 * Render To Pipeable Stream
 * =========================
 *
 * `renderToPipeableStream` renders a React tree into a Node.js Writable stream instead of returning
 * the entire result as one string. It supports progressive server rendering with Suspense, allowing
 * the shell to be sent first and additional content to be streamed as it becomes ready.
 */

import { Suspense, use, type FC, type ReactElement } from "react";
import { renderToPipeableStream } from "react-dom/server";

// ---------------------------------------------------------------------
// 1. Basic renderToPipeableStream usage
// ---------------------------------------------------------------------

export const Application: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Application</title>
      </head>
      <body>
        <main>
          <h1>Example Application</h1>
          <p>Server-rendered content.</p>
        </main>
      </body>
    </html>
  );
};

export const createApplicationStream = () => {
  return renderToPipeableStream(<Application />, {});
};

// `renderToPipeableStream` returns an object containing `pipe` and `abort`.
// `pipe` sends the generated HTML into a Node.js Writable stream.

// ---------------------------------------------------------------------
// 2. The returned stream controls
// ---------------------------------------------------------------------

export const createControlledStream = () => {
  const stream = renderToPipeableStream(<Application />, {});

  return {
    pipe: stream.pipe,
    abort: stream.abort,
  };
};

const controlledStream = createControlledStream();

console.log(typeof controlledStream.pipe); // function
console.log(typeof controlledStream.abort); // function

// `pipe` starts sending the rendered HTML to a destination.
// `abort` stops waiting for pending server rendering work.

// ---------------------------------------------------------------------
// 3. Streaming into a Node.js response
// ---------------------------------------------------------------------

interface HttpResponse {
  readonly setHeader: (name: string, value: string) => void;
  readonly statusCode: number;
  readonly end: (body?: string) => void;
}

type WritableStreamDestination = Parameters<ReturnType<typeof renderToPipeableStream>["pipe"]>[0];

type HttpWritableResponse = HttpResponse & WritableStreamDestination;

export const streamApplication = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<Application />, {
    onShellReady() {
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
  });
};

// The HTTP response is a Node.js Writable stream.
// Calling `pipe(response)` sends React's generated HTML directly into the response.

// ---------------------------------------------------------------------
// 4. The shell
// ---------------------------------------------------------------------

export const Shell: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Application</title>
      </head>
      <body>
        <header>
          <h1>Example Application</h1>
        </header>

        <main>
          <p>Page layout is ready.</p>

          <Suspense fallback={<p>Loading account...</p>}>
            <Account />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

// The shell is the part of the tree outside Suspense boundaries.
// It determines the earliest HTML React can send when streaming begins.

// ---------------------------------------------------------------------
// 5. Suspended content
// ---------------------------------------------------------------------

interface AccountData {
  readonly name: string;
  readonly email: string;
}

const accountPromise = new Promise<AccountData>((resolve) => {
  setTimeout(() => {
    resolve({
      name: "John Doe",
      email: "john.doe@example.com",
    });
  }, 100);
});

export const Account: FC = (): ReactElement => {
  const account = use(accountPromise);

  return (
    <section>
      <h2>{account.name}</h2>
      <p>{account.email}</p>
    </section>
  );
};

// `use` suspends while the Promise is pending.
// The surrounding Suspense boundary allows the shell to stream without waiting for this content.

// ---------------------------------------------------------------------
// 6. Starting the stream when the shell is ready
// ---------------------------------------------------------------------

export const createShellStream = () => {
  return renderToPipeableStream(<Shell />, {
    onShellReady() {
      console.log("The shell is ready.");
    },
  });
};

// `onShellReady` fires after the initial shell has rendered.
// This is normally where a server begins piping the response.

// ---------------------------------------------------------------------
// 7. Streaming a Suspense boundary
// ---------------------------------------------------------------------

export const ProfilePage: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Profile</title>
      </head>
      <body>
        <main>
          <h1>Profile</h1>
          <p>Profile layout is ready.</p>

          <Suspense fallback={<p>Loading account...</p>}>
            <Account />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

export const streamProfilePage = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<ProfilePage />, {
    onShellReady() {
      response.statusCode = 200;
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
  });
};

// React can send the shell first and later send the completed Suspense content.
// The browser can progressively reveal the page as additional HTML arrives.

// ---------------------------------------------------------------------
// 8. Multiple Suspense boundaries
// ---------------------------------------------------------------------

const profilePromise = new Promise<string>((resolve) => {
  setTimeout(() => {
    resolve("John Doe");
  }, 100);
});

const notificationsPromise = new Promise<number>((resolve) => {
  setTimeout(() => {
    resolve(3);
  }, 200);
});

export const Profile: FC = (): ReactElement => {
  const name = use(profilePromise);

  return (
    <section>
      <h2>Profile</h2>
      <p>{name}</p>
    </section>
  );
};

export const Notifications: FC = (): ReactElement => {
  const count = use(notificationsPromise);

  return (
    <section>
      <h2>Notifications</h2>
      <p>{count} notifications</p>
    </section>
  );
};

export const Dashboard: FC = (): ReactElement => {
  return (
    <main>
      <h1>Dashboard</h1>

      <Suspense fallback={<p>Loading profile...</p>}>
        <Profile />
      </Suspense>

      <Suspense fallback={<p>Loading notifications...</p>}>
        <Notifications />
      </Suspense>
    </main>
  );
};

// Each Suspense boundary can reveal its content independently.
// A slower boundary does not require React to wait before sending the shell or other ready content.

// ---------------------------------------------------------------------
// 9. Nested Suspense boundaries
// ---------------------------------------------------------------------

export const NestedDashboard: FC = (): ReactElement => {
  return (
    <main>
      <h1>Dashboard</h1>

      <Suspense fallback={<p>Loading dashboard...</p>}>
        <section>
          <Profile />

          <Suspense fallback={<p>Loading notifications...</p>}>
            <Notifications />
          </Suspense>
        </section>
      </Suspense>
    </main>
  );
};

// Nested boundaries provide more granular loading states.
// The outer boundary can represent a larger section while the inner boundary handles a smaller one.

// ---------------------------------------------------------------------
// 10. The shell and fallback content
// ---------------------------------------------------------------------

export const ShellWithFallback: FC = (): ReactElement => {
  return (
    <main>
      <header>
        <h1>Example Application</h1>
      </header>

      <Suspense fallback={<p>Loading profile...</p>}>
        <Profile />
      </Suspense>
    </main>
  );
};

// The shell includes the header and the Suspense fallback.
// The fallback can therefore be sent as part of the first streamed HTML.

// ---------------------------------------------------------------------
// 11. Bootstrap scripts
// ---------------------------------------------------------------------

export const HydratableApplication: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Application</title>
      </head>
      <body>
        <main>
          <h1>Example Application</h1>

          <button type="button">Continue</button>
        </main>
      </body>
    </html>
  );
};

export const createHydratableStream = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<HydratableApplication />, {
    bootstrapScripts: ["/client.js"],
    onShellReady() {
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
  });
};

// `bootstrapScripts` adds script tags to the generated HTML.
// The client script can call `hydrateRoot` to make the streamed HTML interactive.

// ---------------------------------------------------------------------
// 12. Bootstrap modules
// ---------------------------------------------------------------------

export const ModuleApplication: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Application</title>
      </head>
      <body>
        <main>
          <h1>Example Application</h1>
          <p>Module-based client entry point.</p>
        </main>
      </body>
    </html>
  );
};

export const createModuleStream = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<ModuleApplication />, {
    bootstrapModules: ["/client.js"],
    onShellReady() {
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
  });
};

// `bootstrapModules` emits module scripts instead of classic script tags.

// ---------------------------------------------------------------------
// 13. Inline bootstrap script content
// ---------------------------------------------------------------------

export const createInlineBootstrapStream = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<Application />, {
    bootstrapScriptContent: "window.__EXAMPLE_READY__ = true;",
    onShellReady() {
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
  });
};

// `bootstrapScriptContent` places the supplied JavaScript into an inline script.
// Only trusted, server-generated content should be embedded this way.

// ---------------------------------------------------------------------
// 14. Matching server and client data
// ---------------------------------------------------------------------

interface AssetMap {
  readonly mainScript: string;
  readonly stylesheet: string;
}

interface AssetApplicationProps {
  readonly assets: AssetMap;
}

export const AssetApplication: FC<AssetApplicationProps> = ({ assets }): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="stylesheet" href={assets.stylesheet} />
        <title>Example Application</title>
      </head>
      <body>
        <main>
          <h1>Example Application</h1>
        </main>
      </body>
    </html>
  );
};

export const createAssetStream = (response: HttpWritableResponse, assets: AssetMap): void => {
  const { pipe } = renderToPipeableStream(<AssetApplication assets={assets} />, {
    bootstrapScripts: [assets.mainScript],
    onShellReady() {
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
  });
};

// When the server-rendered tree depends on asset data, the client must use
// equivalent data during hydration so that the initial render remains consistent.

// ---------------------------------------------------------------------
// 15. identifierPrefix
// ---------------------------------------------------------------------

export const IdentifiedApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <p>Content with React-generated IDs.</p>
    </main>
  );
};

export const createIdentifiedStream = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<IdentifiedApplication />, {
    identifierPrefix: "example-",
    onShellReady() {
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
  });
};

// `identifierPrefix` prefixes IDs generated by React's `useId`.
// The same prefix should be supplied to `hydrateRoot` on the client.

// ---------------------------------------------------------------------
// 16. Error logging
// ---------------------------------------------------------------------

export const createErrorAwareStream = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<Application />, {
    onShellReady() {
      response.statusCode = 200;
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
    onError(error) {
      console.error("Server rendering error:", error);
    },
  });
};

// `onError` is called when React encounters an error during server rendering.
// If it is overridden, the server should still log the error or report it appropriately.

// ---------------------------------------------------------------------
// 17. Recovering from a shell error
// ---------------------------------------------------------------------

export const createShellErrorAwareStream = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<Application />, {
    onShellReady() {
      response.statusCode = 200;
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
    onShellError(error) {
      console.error("Shell rendering error:", error);

      response.statusCode = 500;
      response.setHeader("content-type", "text/html");
      response.end("<h1>Something went wrong.</h1>");
    },
    onError(error) {
      console.error("Server rendering error:", error);
    },
  });
};

// `onShellError` fires before any bytes have been emitted when React cannot render the shell.
// The server can still send a fallback response and choose an appropriate status code.

// ---------------------------------------------------------------------
// 18. Setting the response status
// ---------------------------------------------------------------------

export const createStatusAwareStream = (response: HttpWritableResponse): void => {
  let didError = false;

  const { pipe } = renderToPipeableStream(<Application />, {
    onShellReady() {
      response.statusCode = didError ? 500 : 200;

      response.setHeader("content-type", "text/html");

      pipe(response);
    },
    onShellError(error) {
      console.error("Shell rendering error:", error);

      response.statusCode = 500;
      response.setHeader("content-type", "text/html");
      response.end("<h1>Something went wrong.</h1>");
    },
    onError(error) {
      didError = true;

      console.error("Server rendering error:", error);
    },
  });
};

// The status code should be decided before streaming starts.
// Once the response has begun streaming, changing the HTTP status is no longer possible.

// ---------------------------------------------------------------------
// 19. Waiting for all content
// ---------------------------------------------------------------------

export const createCompleteStream = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<Dashboard />, {
    onAllReady() {
      response.statusCode = 200;
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
  });
};

// `onAllReady` fires after the shell and all Suspense content have finished rendering.
// Starting the pipe here produces the complete HTML rather than progressive loading.

// ---------------------------------------------------------------------
// 20. Streaming for crawlers
// ---------------------------------------------------------------------

interface Request {
  readonly userAgent: string;
}

export const isCrawler = (request: Request): boolean => {
  return request.userAgent.includes("ExampleCrawler");
};

export const createCrawlerAwareStream = (request: Request, response: HttpWritableResponse): void => {
  const crawler = isCrawler(request);
  let didError = false;

  const { pipe } = renderToPipeableStream(<Dashboard />, {
    onShellReady() {
      if (!crawler) {
        response.statusCode = didError ? 500 : 200;

        response.setHeader("content-type", "text/html");

        pipe(response);
      }
    },
    onAllReady() {
      if (crawler) {
        response.statusCode = didError ? 500 : 200;

        response.setHeader("content-type", "text/html");

        pipe(response);
      }
    },
    onShellError(error) {
      console.error("Shell rendering error:", error);

      response.statusCode = 500;
      response.setHeader("content-type", "text/html");
      response.end("<h1>Something went wrong.</h1>");
    },
    onError(error) {
      didError = true;

      console.error("Server rendering error:", error);
    },
  });
};

// A regular visitor can receive progressive HTML from `onShellReady`.
// A crawler can instead wait for `onAllReady` and receive the completed HTML.

// ---------------------------------------------------------------------
// 21. Aborting a stream
// ---------------------------------------------------------------------

export const createAbortableStream = (response: HttpWritableResponse): (() => void) => {
  const { pipe, abort } = renderToPipeableStream(<Dashboard />, {
    onShellReady() {
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
  });

  const timeout = setTimeout(() => {
    abort();
  }, 10_000);

  return (): void => {
    clearTimeout(timeout);
    abort();
  };
};

// `abort` stops waiting for pending server rendering work.
// React can flush the remaining Suspense fallbacks and allow the client to finish rendering.

// ---------------------------------------------------------------------
// 22. Progressive rendering and client hydration
// ---------------------------------------------------------------------

export const InteractivePage: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Interactive Application</title>
      </head>
      <body>
        <main>
          <h1>Example Application</h1>

          <button type="button">Continue</button>

          <Suspense fallback={<p>Loading account...</p>}>
            <Account />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

export const createInteractiveStream = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<InteractivePage />, {
    bootstrapScripts: ["/client.js"],
    onShellReady() {
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
  });
};

// The streamed HTML can be displayed before client JavaScript loads.
// `hydrateRoot` later attaches React behavior to the server-rendered document.

// ---------------------------------------------------------------------
// 23. Streaming does not require hydration
// ---------------------------------------------------------------------

export const StaticStreamApplication: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Document</title>
      </head>
      <body>
        <main>
          <h1>Example Document</h1>
          <p>This document does not require client-side React.</p>
        </main>
      </body>
    </html>
  );
};

export const createStaticStream = (response: HttpWritableResponse): void => {
  const { pipe } = renderToPipeableStream(<StaticStreamApplication />, {
    onShellReady() {
      response.setHeader("content-type", "text/html");
      pipe(response);
    },
  });
};

// Streaming is an HTML delivery mechanism.
// Client hydration is optional and depends on whether the generated page needs React interactivity.

// ---------------------------------------------------------------------
// 24. renderToPipeableStream versus renderToString
// ---------------------------------------------------------------------

export const StringApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <p>Rendered as one complete string.</p>
    </main>
  );
};

export const StreamApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <p>Rendered progressively through a Node.js stream.</p>
    </main>
  );
};

// `renderToString` returns one HTML string immediately.
// `renderToPipeableStream` writes HTML into a Node.js Writable stream and supports
// progressive Suspense rendering.

// ---------------------------------------------------------------------
// 25. renderToPipeableStream versus renderToReadableStream
// ---------------------------------------------------------------------

export const NodeStreamingApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Node.js Stream</h1>
      <p>This example uses a Node.js Writable stream.</p>
    </main>
  );
};

// `renderToPipeableStream` is the Node.js streaming API.
// `renderToReadableStream` is the corresponding API for environments using Web Streams.

// ---------------------------------------------------------------------
// 26. Complete demonstration
// ---------------------------------------------------------------------

export const RenderToPipeableStreamDemo: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Streaming Application</title>
      </head>
      <body>
        <header>
          <h1>Example Application</h1>
        </header>

        <main>
          <p>The page shell can stream before slower content is ready.</p>

          <Suspense fallback={<p>Loading profile...</p>}>
            <Profile />
          </Suspense>

          <Suspense fallback={<p>Loading notifications...</p>}>
            <Notifications />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

export const streamDemo = (response: HttpWritableResponse): void => {
  let didError = false;

  const { pipe } = renderToPipeableStream(<RenderToPipeableStreamDemo />, {
    bootstrapScripts: ["/client.js"],
    onShellReady() {
      response.statusCode = didError ? 500 : 200;

      response.setHeader("content-type", "text/html");

      pipe(response);
    },
    onShellError(error) {
      console.error("Shell rendering error:", error);

      response.statusCode = 500;
      response.setHeader("content-type", "text/html");
      response.end("<h1>Something went wrong.</h1>");
    },
    onError(error) {
      didError = true;

      console.error("Server rendering error:", error);
    },
  });
};

export default RenderToPipeableStreamDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `renderToPipeableStream` renders React into a pipeable Node.js Writable stream.
// - It is imported from `react-dom/server` and is specifically designed for Node.js streams.
// - The returned object provides `pipe` for sending HTML and `abort` for stopping pending server work.
// - `onShellReady` fires when the initial shell has rendered and is normally where streaming begins.
// - The shell is the portion of the React tree outside Suspense boundaries.
// - Suspense boundaries allow React to stream fallback content first and reveal completed content later.
// - Multiple and nested Suspense boundaries allow progressively granular loading sequences.
// - `bootstrapScripts` adds client scripts that can later hydrate the streamed HTML.
// - `bootstrapModules` adds module scripts for client-side startup.
// - `bootstrapScriptContent` can embed trusted inline initialization data or code.
// - `onAllReady` waits until the entire tree has finished rendering and can be used when progressive streaming is not desired.
// - `onError` reports server rendering errors, while `onShellError` handles failures before the shell can be streamed.
// - The HTTP status should be decided before streaming begins because it cannot be changed after the response has started.
// - `abort` can stop waiting for pending server rendering and allow the client to finish pending content.
// - Streaming HTML does not require hydration; hydration is only needed when the page must become an interactive React application.
// - `renderToPipeableStream` is the Node.js counterpart to `renderToReadableStream` for Web Streams environments.
