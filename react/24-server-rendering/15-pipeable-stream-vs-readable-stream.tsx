/**
 * Pipeable Stream vs. Readable Stream
 * ===================================
 *
 * React provides two streaming server-rendering APIs with the same rendering model but different
 * stream interfaces: `renderToPipeableStream` produces a Node.js pipeable stream, while
 * `renderToReadableStream` produces a Web ReadableStream. The correct API depends primarily on the
 * server runtime and its streaming primitives.
 */

import { Suspense, use, type FC, type ReactElement } from "react";
import { renderToPipeableStream, renderToReadableStream } from "react-dom/server";

// ---------------------------------------------------------------------
// 1. The two streaming APIs
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

// `renderToPipeableStream` targets Node.js Streams.
// `renderToReadableStream` targets the Web Streams API.

// ---------------------------------------------------------------------
// 2. renderToPipeableStream
// ---------------------------------------------------------------------

type PipeableDestination = Parameters<ReturnType<typeof renderToPipeableStream>["pipe"]>[0];

interface NodeResponse extends PipeableDestination {
  statusCode: number;
  setHeader(name: string, value: string): void;
}

export const streamToNodeResponse = (response: NodeResponse): void => {
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

// The Node.js API returns `pipe` and `abort`.
// `pipe(response)` writes the generated HTML directly into a Node.js Writable stream.

// ---------------------------------------------------------------------
// 3. renderToReadableStream
// ---------------------------------------------------------------------

export const streamToWebResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Application />);

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
};

// The Web Streams API returns a ReadableStream.
// A Web ReadableStream can be passed directly to the Fetch API `Response` constructor.

// ---------------------------------------------------------------------
// 4. Same React tree, different stream target
// ---------------------------------------------------------------------

export const createNodeStream = () => {
  return renderToPipeableStream(<Application />);
};

export const createWebStream = async (): Promise<ReadableStream<Uint8Array>> => {
  return renderToReadableStream(<Application />);
};

// The React tree does not change.
// The difference is the stream abstraction produced by the server-rendering API.

// ---------------------------------------------------------------------
// 5. Node.js stream model
// ---------------------------------------------------------------------

export const renderForNode = (response: NodeResponse): void => {
  const { pipe } = renderToPipeableStream(<Application />, {
    onShellReady() {
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
  });
};

// Node.js servers commonly expose response objects that implement a Writable stream.
// `pipe` connects React's generated HTML to that destination.

// ---------------------------------------------------------------------
// 6. Web Streams model
// ---------------------------------------------------------------------

export const renderForWeb = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Application />);

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// Web Streams integrate with the Fetch API.
// This makes `renderToReadableStream` natural for environments whose request handlers return `Response`.

// ---------------------------------------------------------------------
// 7. Runtime selection
// ---------------------------------------------------------------------

export const renderForRuntime = async (runtime: "node" | "web", response?: NodeResponse): Promise<Response | void> => {
  if (runtime === "node") {
    if (!response) {
      throw new Error("A Node.js response is required.");
    }

    renderForNode(response);
    return;
  }

  return renderForWeb();
};

// The choice should follow the runtime's native streaming model rather than the React component tree.
// Node.js uses the pipeable API; Web Streams environments use the readable-stream API.

// ---------------------------------------------------------------------
// 8. Suspense works with both APIs
// ---------------------------------------------------------------------

interface Profile {
  readonly name: string;
}

const profilePromise = new Promise<Profile>((resolve) => {
  setTimeout(() => {
    resolve({
      name: "John Doe",
    });
  }, 100);
});

export const Profile: FC = (): ReactElement => {
  const profile = use(profilePromise);

  return (
    <section>
      <h2>Profile</h2>
      <p>{profile.name}</p>
    </section>
  );
};

export const SuspenseApplication: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Profile</title>
      </head>
      <body>
        <main>
          <h1>Account</h1>

          <Suspense fallback={<p>Loading profile...</p>}>
            <Profile />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

// Both streaming APIs understand Suspense boundaries.
// The shell can be streamed first, followed by the resolved content.

// ---------------------------------------------------------------------
// 9. Suspense with Node.js Streams
// ---------------------------------------------------------------------

export const renderSuspenseForNode = (response: NodeResponse): void => {
  const { pipe } = renderToPipeableStream(<SuspenseApplication />, {
    onShellReady() {
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
    onError(error) {
      console.error("Server rendering error:", error);
    },
  });
};

// `onShellReady` starts Node.js streaming after the content outside Suspense boundaries is ready.

// ---------------------------------------------------------------------
// 10. Suspense with Web Streams
// ---------------------------------------------------------------------

export const renderSuspenseForWeb = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<SuspenseApplication />, {
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

// `renderToReadableStream` resolves when the shell is ready.
// Suspended content can continue streaming through the returned ReadableStream.

// ---------------------------------------------------------------------
// 11. Starting Node.js streaming
// ---------------------------------------------------------------------

export const startNodeStreaming = (response: NodeResponse): void => {
  const { pipe } = renderToPipeableStream(<SuspenseApplication />, {
    onShellReady() {
      response.statusCode = 200;
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
  });
};

// Node.js streaming is explicitly started by calling `pipe`.
// React does not automatically write to the response.

// ---------------------------------------------------------------------
// 12. Starting Web streaming
// ---------------------------------------------------------------------

export const startWebStreaming = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<SuspenseApplication />);

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
};

// Web streaming starts when the returned ReadableStream is consumed by the Response or another consumer.

// ---------------------------------------------------------------------
// 13. Aborting Node.js rendering
// ---------------------------------------------------------------------

export const createAbortableNodeStream = (response: NodeResponse): (() => void) => {
  const { pipe, abort } = renderToPipeableStream(<SuspenseApplication />, {
    onShellReady() {
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
    onError(error) {
      console.error("Server rendering error:", error);
    },
  });

  return abort;
};

// `renderToPipeableStream` exposes `abort` directly.
// Aborting flushes the remaining Suspense fallbacks and allows the client to finish rendering.

// ---------------------------------------------------------------------
// 14. Aborting Web Streams rendering
// ---------------------------------------------------------------------

export const createAbortableWebStream = async (): Promise<Response> => {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, 10_000);

  const stream = await renderToReadableStream(<SuspenseApplication />, {
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

// `renderToReadableStream` accepts an AbortSignal through `signal`.
// The two APIs expose cancellation differently because they follow different stream models.

// ---------------------------------------------------------------------
// 15. Waiting for all content
// ---------------------------------------------------------------------

export const renderCompleteWebResponse = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<SuspenseApplication />);

  await stream.allReady;

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// The Web ReadableStream exposes `allReady`.
// Waiting for it prevents progressive delivery and is useful when the complete HTML is required.

// ---------------------------------------------------------------------
// 16. Waiting for all content in Node.js
// ---------------------------------------------------------------------

export const renderCompleteNodeResponse = (response: NodeResponse): void => {
  const { pipe } = renderToPipeableStream(<SuspenseApplication />, {
    onAllReady() {
      response.statusCode = 200;
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
  });
};

// Node.js uses the `onAllReady` callback when the server should wait for the entire tree.
// Calling `pipe` from `onAllReady` produces the final HTML without progressive streaming.

// ---------------------------------------------------------------------
// 17. Shell-based streaming comparison
// ---------------------------------------------------------------------

export const renderNodeShellFirst = (response: NodeResponse): void => {
  const { pipe } = renderToPipeableStream(<SuspenseApplication />, {
    onShellReady() {
      pipe(response);
    },
  });
};

export const renderWebShellFirst = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<SuspenseApplication />);

  return new Response(stream);
};

// Both APIs can begin delivery when the shell is ready.
// The callback-based Node API signals shell readiness through `onShellReady`,
// while the Web Streams API resolves its rendering Promise with the stream.

// ---------------------------------------------------------------------
// 18. Error handling comparison
// ---------------------------------------------------------------------

export const renderNodeWithErrorHandling = (response: NodeResponse): void => {
  let didError = false;

  try {
    const { pipe } = renderToPipeableStream(<Application />, {
      onShellReady() {
        response.statusCode = didError ? 500 : 200;

        response.setHeader("content-type", "text/html");

        pipe(response);
      },
      onShellError(error) {
        didError = true;

        response.statusCode = 500;
        response.setHeader("content-type", "text/html");
        response.end("<h1>Something went wrong.</h1>");

        console.error("Shell rendering error:", error);
      },
      onError(error) {
        didError = true;

        console.error("Server rendering error:", error);
      },
    });
  } catch (error) {
    console.error("Unable to start server rendering:", error);
  }
};

export const renderWebWithErrorHandling = async (): Promise<Response> => {
  let didError = false;

  try {
    const stream = await renderToReadableStream(<Application />, {
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

// Both APIs distinguish failures during shell rendering from errors that occur after streaming begins.
// The surrounding server must decide how to report those failures to the client.

// ---------------------------------------------------------------------
// 19. Status code timing
// ---------------------------------------------------------------------

export const nodeStatusExample = (response: NodeResponse): void => {
  const { pipe } = renderToPipeableStream(<Application />, {
    onShellReady() {
      response.statusCode = 200;
      pipe(response);
    },
  });
};

export const webStatusExample = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Application />);

  return new Response(stream, {
    status: 200,
  });
};

// Streaming creates the same HTTP constraint in both models:
// once the response body has started, the HTTP status cannot be changed.

// ---------------------------------------------------------------------
// 20. Bootstrap scripts
// ---------------------------------------------------------------------

export const nodeWithBootstrapScript = (response: NodeResponse): void => {
  const { pipe } = renderToPipeableStream(<Application />, {
    bootstrapScripts: ["/client.js"],
    onShellReady() {
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
  });
};

export const webWithBootstrapScript = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Application />, {
    bootstrapScripts: ["/client.js"],
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// The rendering options are largely shared.
// `bootstrapScripts`, `bootstrapModules`, `identifierPrefix`, `onError`, and related options
// work across both streaming APIs.

// ---------------------------------------------------------------------
// 21. Runtime-specific response handling
// ---------------------------------------------------------------------

export const handleNodeRequest = (response: NodeResponse): void => {
  const { pipe } = renderToPipeableStream(<Application />, {
    bootstrapScripts: ["/client.js"],
    onShellReady() {
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
  });
};

export const handleWebRequest = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Application />, {
    bootstrapScripts: ["/client.js"],
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// The component tree and React rendering model can remain identical.
// Only the runtime-specific response integration changes.

// ---------------------------------------------------------------------
// 22. When the Web Streams API is appropriate
// ---------------------------------------------------------------------

export const edgeHandler = async (): Promise<Response> => {
  const stream = await renderToReadableStream(<Application />);

  return new Response(stream, {
    headers: {
      "content-type": "text/html",
    },
  });
};

// Web Streams are appropriate for environments such as Deno and modern edge runtimes.
// They integrate naturally with Fetch-style request and response APIs.

// ---------------------------------------------------------------------
// 23. When the Node.js Streams API is appropriate
// ---------------------------------------------------------------------

export const nodeHandler = (response: NodeResponse): void => {
  const { pipe } = renderToPipeableStream(<Application />, {
    onShellReady() {
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
  });
};

// Node.js has its own Writable stream model.
// `renderToPipeableStream` is specifically designed to connect React output to that model.

// ---------------------------------------------------------------------
// 24. Same output model, different transport
// ---------------------------------------------------------------------

export const NodeStreamingPage: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Application</title>
      </head>
      <body>
        <main>
          <h1>Example Application</h1>

          <Suspense fallback={<p>Loading...</p>}>
            <Profile />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

export const WebStreamingPage: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Application</title>
      </head>
      <body>
        <main>
          <h1>Example Application</h1>

          <Suspense fallback={<p>Loading...</p>}>
            <Profile />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

// The React markup can be identical.
// The stream type and server integration are what distinguish the two APIs.

// ---------------------------------------------------------------------
// 25. Practical decision rule
// ---------------------------------------------------------------------

export type StreamingEnvironment = "node-streams" | "web-streams";

export const chooseStreamingApi = (
  environment: StreamingEnvironment,
): "renderToPipeableStream" | "renderToReadableStream" => {
  if (environment === "node-streams") {
    return "renderToPipeableStream";
  }

  return "renderToReadableStream";
};

// Choose the API according to the stream primitive exposed by the server runtime.
// This is an API-selection decision, not a difference in React rendering semantics.

// ---------------------------------------------------------------------
// 26. Complete comparison
// ---------------------------------------------------------------------

export const ComparisonApplication: FC = (): ReactElement => {
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
          <p>The page shell can be streamed before slower content.</p>

          <Suspense fallback={<p>Loading profile...</p>}>
            <Profile />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

export const createNodeComparisonStream = (response: NodeResponse): void => {
  const { pipe } = renderToPipeableStream(<ComparisonApplication />, {
    bootstrapScripts: ["/client.js"],
    onShellReady() {
      response.statusCode = 200;
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
    onError(error) {
      console.error("Node rendering error:", error);
    },
  });
};

export const createWebComparisonResponse = async (): Promise<Response> => {
  try {
    const stream = await renderToReadableStream(<ComparisonApplication />, {
      bootstrapScripts: ["/client.js"],
      onError(error) {
        console.error("Web rendering error:", error);
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (error) {
    console.error("Web shell rendering error:", error);

    return new Response("<h1>Something went wrong.</h1>", {
      status: 500,
      headers: {
        "content-type": "text/html",
      },
    });
  }
};

// ---------------------------------------------------------------------
// 27. Summary
// ---------------------------------------------------------------------
// - `renderToPipeableStream` renders React into a pipeable Node.js Stream.
// - `renderToReadableStream` renders React into a Web `ReadableStream`.
// - The two APIs use the same server-rendering and Suspense model but target different stream primitives.
// - Use `renderToPipeableStream` for Node.js stream-based servers.
// - Use `renderToReadableStream` for Web Streams environments such as Deno and modern edge runtimes.
// - Node.js streaming starts by calling `pipe` on the returned pipeable-stream result.
// - Web streaming returns a `ReadableStream` that can be passed directly to a Fetch API `Response`.
// - `onShellReady` is used to start progressive Node.js streaming after the shell is ready.
// - `renderToReadableStream` resolves with its stream when the shell is ready.
// - Both APIs can progressively reveal content inside Suspense boundaries.
// - Both APIs support server rendering options such as `bootstrapScripts`, `bootstrapModules`, and `identifierPrefix`.
// - Node.js exposes `abort()` directly, while Web Streams rendering accepts an `AbortSignal` through `signal`.
// - Node.js uses `onAllReady` when streaming should wait for the complete tree.
// - Web Streams expose `stream.allReady` for the same wait-until-complete use case.
// - Both APIs require the HTTP status to be determined before the response body starts streaming.
// - The React component tree does not need to change when switching between the two APIs.
// - The primary distinction is the runtime's native streaming interface and how the server sends the response.
