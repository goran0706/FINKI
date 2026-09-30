/**
 * Render To Readable Stream
 * =========================
 *
 * `renderToReadableStream` renders a React tree into a Web ReadableStream on the server. It is
 * designed for environments that use Web Streams, such as modern edge runtimes, and supports
 * progressive rendering with Suspense while allowing the resulting stream to be returned directly
 * from a Web Response.
 */

import { Suspense, use, type FC, type ReactElement } from "react";
import { renderToReadableStream } from "react-dom/server";

// ---------------------------------------------------------------------
// 1. Basic renderToReadableStream usage
// ---------------------------------------------------------------------

export const Application: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

export const createApplicationStream = async (): Promise<ReadableStream<Uint8Array>> => {
  return renderToReadableStream(<Application />);
};

// `renderToReadableStream` returns a Promise that resolves to a ReadableStream.
// The stream contains the generated HTML and can be passed directly to a Web Response.

// ---------------------------------------------------------------------
// 2. Returning the stream from a Web Response
// ---------------------------------------------------------------------

export const createResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Application />);

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// Web Streams integrate directly with the Fetch API `Response` constructor.
// This is a natural pattern for edge runtimes and other Web Streams environments.

// ---------------------------------------------------------------------
// 3. Rendering the complete document
// ---------------------------------------------------------------------

export const Document: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content="Example document" />
        <title>Example Document</title>
      </head>
      <body>
        <header>
          <h1>Example Website</h1>
        </header>

        <main>
          <p>This document was rendered by React on the server.</p>
        </main>

        <footer>
          <small>Example Company</small>
        </footer>
      </body>
    </html>
  );
};

export const createDocumentResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Document />);

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// The root React component should normally represent the entire HTML document.
// React can inject the doctype and bootstrap script tags into the streamed output.

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
          <p>The page layout is ready.</p>

          <Suspense fallback={<p>Loading account...</p>}>
            <Account />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

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

// The shell is the portion of the tree outside Suspense boundaries.
// `renderToReadableStream` resolves once the shell has finished rendering,
// even when nested Suspense content is still loading.

// ---------------------------------------------------------------------
// 5. Streaming Suspense content
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

export const createProfileResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<ProfilePage />);

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// React can send the shell and Suspense fallback first.
// When the suspended content becomes ready, React adds the remaining HTML and
// the instructions needed to replace the fallback in the browser.

// ---------------------------------------------------------------------
// 6. Multiple Suspense boundaries
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

export const createDashboardResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Dashboard />);

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// Each Suspense boundary can reveal its content independently.
// A slower boundary does not prevent other ready content from being streamed.

// ---------------------------------------------------------------------
// 7. Nested Suspense boundaries
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

export const createNestedDashboardResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<NestedDashboard />);

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// Nested boundaries allow the loading sequence to become more granular.
// The outer boundary can represent a larger section while the inner boundary
// can reveal a smaller section independently.

// ---------------------------------------------------------------------
// 8. Bootstrap scripts
// ---------------------------------------------------------------------

export const HydratableApplication: FC = (): ReactElement => {
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
        </main>
      </body>
    </html>
  );
};

export const createHydratableResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<HydratableApplication />, {
    bootstrapScripts: ["/client.js"],
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// `bootstrapScripts` adds script tags to the generated HTML.
// The client script can call `hydrateRoot` to make the streamed HTML interactive.

// ---------------------------------------------------------------------
// 9. Bootstrap modules
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

export const createModuleResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<ModuleApplication />, {
    bootstrapModules: ["/client.js"],
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// `bootstrapModules` emits module scripts instead of classic script tags.

// ---------------------------------------------------------------------
// 10. Inline bootstrap script content
// ---------------------------------------------------------------------

export const createInlineBootstrapResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Application />, {
    bootstrapScriptContent: "window.__EXAMPLE_READY__ = true;",
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// `bootstrapScriptContent` places trusted JavaScript into an inline script.
// It can be useful for passing small pieces of server-generated initialization data to the client.

// ---------------------------------------------------------------------
// 11. Asset maps
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

export const createAssetResponse = async (assets: AssetMap): Promise<Response> => {
  const stream = await renderToReadableStream(<AssetApplication assets={assets} />, {
    bootstrapScripts: [assets.mainScript],
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// The same asset map must be available to the client during hydration.
// Otherwise the server and client can render different initial markup.

// ---------------------------------------------------------------------
// 12. identifierPrefix
// ---------------------------------------------------------------------

export const IdentifiedApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <p>Content with React-generated IDs.</p>
    </main>
  );
};

export const createIdentifiedResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<IdentifiedApplication />, {
    identifierPrefix: "example-",
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// `identifierPrefix` prefixes IDs generated by React's `useId`.
// The same prefix must be passed to `hydrateRoot` on the client.

// ---------------------------------------------------------------------
// 13. Handling server errors
// ---------------------------------------------------------------------

export const createErrorAwareResponse = async (): Promise<Response> => {
  try {
    const stream = await renderToReadableStream(<Application />, {
      onError(error) {
        console.error("Server rendering error:", error);
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (error) {
    console.error("Shell rendering error:", error);

    return new Response("<h1>Something went wrong.</h1>", {
      status: 500,
      headers: {
        "content-type": "text/html",
      },
    });
  }
};

// The Promise returned by `renderToReadableStream` rejects when React cannot render the shell.
// The surrounding `try...catch` can then produce a fallback response with an error status.

// ---------------------------------------------------------------------
// 14. Errors outside the shell
// ---------------------------------------------------------------------

export const ErrorProneContent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Additional Content</h2>
      <p>This content is rendered inside a Suspense boundary.</p>
    </section>
  );
};

export const ErrorHandlingPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>

      <Suspense fallback={<p>Loading additional content...</p>}>
        <ErrorProneContent />
      </Suspense>
    </main>
  );
};

export const createErrorHandlingResponse = async (): Promise<Response> => {
  let didError = false;

  try {
    const stream = await renderToReadableStream(<ErrorHandlingPage />, {
      onError(error) {
        didError = true;

        console.error("Server rendering error:", error);
      },
    });

    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (error) {
    console.error("Shell rendering error:", error);

    return new Response("<h1>Something went wrong.</h1>", {
      status: 500,
      headers: {
        "content-type": "text/html",
      },
    });
  }
};

// Errors that occur outside the shell can be reported through `onError` while React
// continues rendering the stream. The server can use the error state when deciding the status.

// ---------------------------------------------------------------------
// 15. Setting the response status
// ---------------------------------------------------------------------

export const createStatusAwareResponse = async (): Promise<Response> => {
  let didError = false;

  try {
    const stream = await renderToReadableStream(<Dashboard />, {
      onError(error) {
        didError = true;

        console.error("Server rendering error:", error);
      },
    });

    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (error) {
    console.error("Shell rendering error:", error);

    return new Response("<h1>Something went wrong.</h1>", {
      status: 500,
      headers: {
        "content-type": "text/html",
      },
    });
  }
};

// The response status must be selected before the stream is returned.
// Once streaming has begun, the HTTP status can no longer be changed.

// ---------------------------------------------------------------------
// 16. Waiting for all content
// ---------------------------------------------------------------------

export const createCompleteResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Dashboard />);

  await stream.allReady;

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// `stream.allReady` resolves when the shell and all additional Suspense content
// have finished rendering. Awaiting it removes progressive delivery.

// ---------------------------------------------------------------------
// 17. Waiting for crawlers
// ---------------------------------------------------------------------

interface RequestInfo {
  readonly userAgent: string;
}

export const isCrawler = (request: RequestInfo): boolean => {
  return request.userAgent.includes("ExampleCrawler");
};

export const createCrawlerAwareResponse = async (request: RequestInfo): Promise<Response> => {
  let didError = false;

  try {
    const stream = await renderToReadableStream(<Dashboard />, {
      onError(error) {
        didError = true;

        console.error("Server rendering error:", error);
      },
    });

    if (isCrawler(request)) {
      await stream.allReady;
    }

    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (error) {
    console.error("Shell rendering error:", error);

    return new Response("<h1>Something went wrong.</h1>", {
      status: 500,
      headers: {
        "content-type": "text/html",
      },
    });
  }
};

// A regular visitor can receive progressive HTML.
// A crawler can wait for `allReady` and receive the complete rendered stream.

// ---------------------------------------------------------------------
// 18. Aborting server rendering
// ---------------------------------------------------------------------

export const createAbortableResponse = async (): Promise<Response> => {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, 10_000);

  const stream = await renderToReadableStream(<Dashboard />, {
    signal: controller.signal,
    onError(error) {
      console.error("Server rendering error:", error);
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// Passing an AbortSignal lets the server stop waiting for rendering work.
// React can flush the remaining Suspense fallbacks and allow the client to finish rendering.

// ---------------------------------------------------------------------
// 19. Streaming without hydration
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

export const createStaticResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<StaticStreamApplication />);

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// Streaming is an HTML delivery mechanism.
// Hydration is only necessary when the generated page needs to become an interactive React application.

// ---------------------------------------------------------------------
// 20. Reading the Web Stream manually
// ---------------------------------------------------------------------

export const readApplicationStream = async (): Promise<string> => {
  const stream = await renderToReadableStream(<Application />);

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(
      decoder.decode(value, {
        stream: true,
      }),
    );
  }

  chunks.push(decoder.decode());

  return chunks.join("");
};

// A Web ReadableStream can be consumed through its reader.
// In normal HTTP handling, manual consumption is unnecessary because the stream
// can be passed directly to the `Response` constructor.

// ---------------------------------------------------------------------
// 21. Web Streams versus Node.js Streams
// ---------------------------------------------------------------------

export const WebStreamApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Web Stream Application</h1>
      <p>This application uses a ReadableStream.</p>
    </main>
  );
};

// `renderToReadableStream` produces a Web ReadableStream.
// `renderToPipeableStream` produces a Node.js-specific pipeable stream.
// The appropriate API depends on the server's streaming model.

// ---------------------------------------------------------------------
// 22. Progressive rendering and client JavaScript
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

export const createInteractiveResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<InteractivePage />, {
    bootstrapScripts: ["/client.js"],
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// The browser can display streamed HTML before the client JavaScript loads.
// The bootstrap script can later hydrate the document and attach React behavior.

// ---------------------------------------------------------------------
// 23. A complete Web Stream handler
// ---------------------------------------------------------------------

interface HandlerRequest {
  readonly userAgent: string;
}

export const handleRequest = async (request: HandlerRequest): Promise<Response> => {
  let didError = false;

  try {
    const stream = await renderToReadableStream(<Dashboard />, {
      bootstrapScripts: ["/client.js"],
      onError(error) {
        didError = true;

        console.error("Server rendering error:", error);
      },
    });

    if (isCrawler(request)) {
      await stream.allReady;
    }

    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (error) {
    console.error("Shell rendering error:", error);

    return new Response("<h1>Something went wrong.</h1>", {
      status: 500,
      headers: {
        "content-type": "text/html",
      },
    });
  }
};

// This pattern combines the main pieces of a Web Stream server handler:
// rendering, error handling, optional waiting for all content, and returning the stream.

// ---------------------------------------------------------------------
// 24. renderToReadableStream versus renderToString
// ---------------------------------------------------------------------

export const StringApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <p>Rendered as one HTML string.</p>
    </main>
  );
};

export const ReadableStreamApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <p>Rendered through a Web ReadableStream.</p>
    </main>
  );
};

// `renderToString` returns one HTML string.
// `renderToReadableStream` progressively delivers HTML through a Web ReadableStream.

// ---------------------------------------------------------------------
// 25. renderToReadableStream versus renderToPipeableStream
// ---------------------------------------------------------------------

export const WebStreamingApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Web Streams</h1>
      <p>This output uses the Web Streams API.</p>
    </main>
  );
};

export const createWebStream = async (): Promise<ReadableStream<Uint8Array>> => {
  return renderToReadableStream(<WebStreamingApplication />);
};

// `renderToReadableStream` is intended for environments using Web Streams.
// `renderToPipeableStream` is the dedicated Node.js Streams API.
// React's documentation recommends the Node.js API in Node environments.

// ---------------------------------------------------------------------
// 26. Complete demonstration
// ---------------------------------------------------------------------

export const RenderToReadableStreamDemo: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Readable Stream Application</title>
      </head>
      <body>
        <header>
          <h1>Example Application</h1>
        </header>

        <main>
          <p>The shell can stream before slower content is ready.</p>

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

export const streamDemo = async (): Promise<Response> => {
  let didError = false;

  try {
    const stream = await renderToReadableStream(<RenderToReadableStreamDemo />, {
      bootstrapScripts: ["/client.js"],
      onError(error) {
        didError = true;

        console.error("Server rendering error:", error);
      },
    });

    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (error) {
    console.error("Shell rendering error:", error);

    return new Response("<h1>Something went wrong.</h1>", {
      status: 500,
      headers: {
        "content-type": "text/html",
      },
    });
  }
};

export default RenderToReadableStreamDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `renderToReadableStream` renders a React tree into a Web `ReadableStream`.
// - It is imported from `react-dom/server` and is intended for Web Streams environments.
// - The function returns a Promise that resolves when the shell has finished rendering.
// - The resulting stream can be passed directly to the Fetch API `Response` constructor.
// - Suspense boundaries allow React to stream fallback content first and reveal completed content later.
// - Multiple and nested Suspense boundaries allow progressively granular loading sequences.
// - `bootstrapScripts` adds client scripts that can later hydrate the streamed HTML.
// - `bootstrapModules` adds module scripts for client-side startup.
// - `bootstrapScriptContent` can embed trusted inline initialization code or data.
// - `identifierPrefix` controls the prefix used for IDs generated by React's `useId`.
// - `onError` reports server rendering errors, while shell errors cause the rendering Promise to reject.
// - The HTTP status should be selected before the response stream begins.
// - `stream.allReady` resolves after the shell and all Suspense content have finished rendering.
// - Awaiting `allReady` removes progressive delivery and is useful for crawlers or static generation.
// - An `AbortSignal` can stop pending server rendering and allow the client to finish the remaining work.
// - The streamed HTML can be displayed before client JavaScript loads or hydration begins.
// - `renderToReadableStream` is the Web Streams counterpart to `renderToPipeableStream`.
// - In Node.js, React recommends the dedicated Node.js streaming API rather than Web Streams.
