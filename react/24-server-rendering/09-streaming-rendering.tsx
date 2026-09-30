/**
 * Streaming Rendering
 * ====================
 *
 * Streaming rendering allows React to send server-rendered HTML to the client progressively instead
 * of waiting for the entire React tree to finish rendering. Suspense boundaries let React send the
 * completed shell first and reveal additional content as asynchronous rendering work becomes ready.
 */

// ---------------------------------------------------------------------
// 1. Importing the streaming server API
// ---------------------------------------------------------------------

import { renderToPipeableStream } from "react-dom/server";
import { Suspense, use, type FC, type ReactElement } from "react";

// `renderToPipeableStream` is the Node.js streaming API.
// For environments that use Web Streams, React provides `renderToReadableStream` instead.

// ---------------------------------------------------------------------
// 2. A basic streaming application
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
          <p>The page is being rendered on the server.</p>
        </main>
      </body>
    </html>
  );
};

export const createApplicationStream = () => {
  return renderToPipeableStream(<Application />, {});
};

const applicationStream = createApplicationStream();

console.log(typeof applicationStream.pipe); // function
console.log(typeof applicationStream.abort); // function

// The returned object provides `pipe` for sending HTML to a Node.js writable stream
// and `abort` for stopping the server render.

// ---------------------------------------------------------------------
// 3. Starting the stream when the shell is ready
// ---------------------------------------------------------------------

export const StreamingApplication: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Application</title>
      </head>
      <body>
        <main>
          <h1>Example Application</h1>
          <p>Initial content is ready.</p>
        </main>
      </body>
    </html>
  );
};

export const createStreamingApplication = () => {
  return renderToPipeableStream(<StreamingApplication />, {
    onShellReady() {
      console.log("The shell is ready.");
    },
  });
};

// `onShellReady` fires when the part of the tree outside pending Suspense boundaries
// has finished rendering. This is normally the point where streaming begins.

// ---------------------------------------------------------------------
// 4. The shell
// ---------------------------------------------------------------------

export const ShellApplication: FC = (): ReactElement => {
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
          <p>This content belongs to the initial shell.</p>
          <Suspense fallback={<p>Loading account...</p>}>
            <AccountContent />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

// Content outside Suspense boundaries belongs to the shell.
// Pending Suspense content can be streamed later without blocking the shell.

// ---------------------------------------------------------------------
// 5. A component that suspends during server rendering
// ---------------------------------------------------------------------

interface Account {
  readonly name: string;
  readonly email: string;
}

const accountPromise = new Promise<Account>((resolve) => {
  setTimeout(() => {
    resolve({
      name: "John Doe",
      email: "john.doe@example.com",
    });
  }, 100);
});

export const AccountContent: FC = (): ReactElement => {
  const account = use(accountPromise);

  return (
    <section>
      <h2>{account.name}</h2>
      <p>{account.email}</p>
    </section>
  );
};

// `use` suspends the component while the Promise is pending.
// A surrounding Suspense boundary can therefore provide fallback content
// while React continues rendering the rest of the page.

// ---------------------------------------------------------------------
// 6. Streaming a Suspense boundary
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
            <AccountContent />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

export const createProfileStream = () => {
  return renderToPipeableStream(<ProfilePage />, {
    onShellReady() {
      console.log("Profile shell is ready.");
    },
    onAllReady() {
      console.log("All profile content is ready.");
    },
  });
};

// The server can start streaming the shell while `AccountContent` is still pending.
// React later sends the completed Suspense content and the instructions needed to reveal it.

// ---------------------------------------------------------------------
// 7. `onShellReady` and `onAllReady`
// ---------------------------------------------------------------------

export const createLifecycleAwareStream = () => {
  return renderToPipeableStream(<ProfilePage />, {
    onShellReady() {
      console.log("Initial shell is ready.");
    },
    onAllReady() {
      console.log("All content is ready.");
    },
  });
};

// `onShellReady` is appropriate when progressive streaming should begin as soon as possible.
// `onAllReady` waits until the complete React tree has finished rendering.

// ---------------------------------------------------------------------
// 8. Piping the HTML to a Node.js response
// ---------------------------------------------------------------------

type PipeDestination = Parameters<ReturnType<typeof renderToPipeableStream>["pipe"]>[0];

interface HttpResponse {
  readonly setHeader: (name: string, value: string) => void;
  readonly end: (body?: string) => void;
}

export const streamToResponse = (response: HttpResponse & PipeDestination): void => {
  const { pipe } = renderToPipeableStream(<StreamingApplication />, {
    onShellReady() {
      response.setHeader("content-type", "text/html");

      pipe(response);
    },
  });
};

// In a real Node.js HTTP handler, the HTTP response is a writable stream.
// Calling `pipe(response)` transfers React's generated HTML into that response.

// ---------------------------------------------------------------------
// 9. Bootstrap scripts for hydration
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

export const createHydratableStream = () => {
  return renderToPipeableStream(<HydratableApplication />, {
    bootstrapScripts: ["/client.js"],
    onShellReady() {
      console.log("Hydratable shell is ready.");
    },
  });
};

// `bootstrapScripts` tells React which client scripts should be included in the streamed HTML.
// The client script can call `hydrateRoot` to make the server-rendered application interactive.

// ---------------------------------------------------------------------
// 10. Streaming without client JavaScript
// ---------------------------------------------------------------------

export const StaticStreamingApplication: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Document</title>
      </head>
      <body>
        <main>
          <h1>Example Document</h1>
          <p>This page does not require client-side React.</p>
        </main>
      </body>
    </html>
  );
};

export const createStaticStream = () => {
  return renderToPipeableStream(<StaticStreamingApplication />, {
    onShellReady() {
      console.log("Static shell is ready.");
    },
  });
};

// Streaming does not require hydration.
// A server can stream HTML for content that never becomes an interactive React application.

// ---------------------------------------------------------------------
// 11. Multiple Suspense boundaries
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

export const MultipleBoundaries: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>

      <Suspense fallback={<p>Loading profile...</p>}>
        <Profile />
      </Suspense>

      <Suspense fallback={<p>Loading notifications...</p>}>
        <Notifications />
      </Suspense>
    </main>
  );
};

// Each Suspense boundary can have its own loading state.
// React can progressively reveal the boundaries as their suspended content becomes ready.

// ---------------------------------------------------------------------
// 12. Nested Suspense boundaries
// ---------------------------------------------------------------------

export const NestedBoundaries: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>

      <Suspense fallback={<p>Loading account...</p>}>
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

// Nested boundaries allow the loading sequence to become more granular.
// A parent boundary can provide a broader fallback while an inner boundary handles
// a smaller section of the page independently.

// ---------------------------------------------------------------------
// 13. Streaming more content as it becomes available
// ---------------------------------------------------------------------

export const ProgressivePage: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Progressive Page</title>
      </head>
      <body>
        <header>
          <h1>Example Application</h1>
        </header>

        <main>
          <p>Page layout is available immediately.</p>

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

export const createProgressiveStream = () => {
  return renderToPipeableStream(<ProgressivePage />, {
    onShellReady() {
      console.log("Progressive shell is ready.");
    },
  });
};

// The user can receive the page structure and fallback content before
// slower sections finish rendering on the server.

// ---------------------------------------------------------------------
// 14. Handling server errors
// ---------------------------------------------------------------------

export const createErrorAwareStream = () => {
  return renderToPipeableStream(<StreamingApplication />, {
    onShellReady() {
      console.log("Shell ready.");
    },
    onShellError(error) {
      console.error("Shell rendering failed:", error);
    },
    onError(error) {
      console.error("Server rendering error:", error);
    },
  });
};

// `onShellError` is used when React cannot render the initial shell.
// `onError` is called for server rendering errors and can be used for logging
// or adjusting the response before the response has been committed.

// ---------------------------------------------------------------------
// 15. Waiting for all content
// ---------------------------------------------------------------------

export const createCompleteStream = () => {
  return renderToPipeableStream(<ProgressivePage />, {
    onAllReady() {
      console.log("The complete page is ready.");
    },
  });
};

// Starting the stream in `onAllReady` waits for all Suspense content.
// This removes progressive delivery and produces the complete HTML stream at once.

// ---------------------------------------------------------------------
// 16. Aborting a server render
// ---------------------------------------------------------------------

export const createAbortableStream = () => {
  const stream = renderToPipeableStream(<ProgressivePage />, {
    onShellReady() {
      console.log("Shell ready.");
    },
  });

  const timeout = setTimeout(() => {
    stream.abort();
  }, 10_000);

  return {
    stream,
    cancelTimeout: (): void => {
      clearTimeout(timeout);
    },
  };
};

// `abort` stops waiting for pending server rendering work.
// React can send the remaining Suspense fallbacks and allow the browser
// to finish rendering the pending content after hydration.

// ---------------------------------------------------------------------
// 17. Streaming and hydration work together
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

          <Suspense fallback={<p>Loading account...</p>}>
            <AccountContent />
          </Suspense>

          <button type="button">Continue</button>
        </main>
      </body>
    </html>
  );
};

export const createInteractiveStream = () => {
  return renderToPipeableStream(<InteractivePage />, {
    bootstrapScripts: ["/client.js"],
    onShellReady() {
      console.log("Interactive shell is ready.");
    },
  });
};

// Streaming HTML can become interactive through hydration.
// The HTML can begin arriving before the client JavaScript has finished loading.

// ---------------------------------------------------------------------
// 18. Streaming does not wait for client JavaScript
// ---------------------------------------------------------------------

export const ClientScriptIndependentPage: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Page</title>
      </head>
      <body>
        <main>
          <h1>Example Page</h1>
          <p>This content can be displayed before React loads in the browser.</p>
        </main>
      </body>
    </html>
  );
};

export const createClientIndependentStream = () => {
  return renderToPipeableStream(<ClientScriptIndependentPage />, {
    onShellReady() {
      console.log("HTML shell is ready.");
    },
  });
};

// Server streaming is an HTML delivery mechanism.
// The browser can display streamed HTML before the client JavaScript loads.

// ---------------------------------------------------------------------
// 19. Streaming and static prerendering are different
// ---------------------------------------------------------------------

export const StreamingContent: FC = (): ReactElement => {
  return (
    <main>
      <h1>Streaming Content</h1>
      <p>Content can be delivered progressively.</p>
    </main>
  );
};

export const createStreamingContent = () => {
  return renderToPipeableStream(<StreamingContent />, {
    onShellReady() {
      console.log("Streaming can begin.");
    },
  });
};

// Streaming rendering can send the shell before all Suspense content is ready.
// Static prerendering instead waits for all content to become ready before producing
// the final static output.

// ---------------------------------------------------------------------
// 20. Complete demonstration
// ---------------------------------------------------------------------

export const StreamingRenderingDemo: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Streaming Rendering</title>
      </head>
      <body>
        <header>
          <h1>Example Application</h1>
        </header>

        <main>
          <p>Initial page content is available immediately.</p>

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

export const createDemoStream = () => {
  return renderToPipeableStream(<StreamingRenderingDemo />, {
    bootstrapScripts: ["/client.js"],
    onShellReady() {
      console.log("Demo shell is ready.");
    },
    onAllReady() {
      console.log("Demo rendering is complete.");
    },
    onError(error) {
      console.error("Demo rendering error:", error);
    },
  });
};

export default StreamingRenderingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Streaming rendering sends server-generated HTML progressively instead of waiting for the entire tree.
// - `renderToPipeableStream` is the Node.js streaming API for React server rendering.
// - `renderToReadableStream` is the corresponding API for Web Streams environments.
// - `onShellReady` fires when the initial shell is ready to stream.
// - `onAllReady` waits until the entire React tree has finished rendering.
// - Suspense boundaries allow pending content to be replaced by fallback HTML while rendering continues.
// - Multiple Suspense boundaries can reveal different sections independently as their content becomes ready.
// - `pipe` sends the generated HTML into a Node.js writable stream such as an HTTP response.
// - `bootstrapScripts` can include client scripts that later hydrate the streamed HTML.
// - Streaming HTML can be displayed before client JavaScript loads or the application becomes interactive.
// - `onShellError` handles failures while rendering the initial shell, while `onError` reports server rendering errors.
// - `abort` stops waiting for pending server rendering work and allows the browser to finish pending content.
// - Streaming describes progressive delivery, while static prerendering waits for all content before producing final output.
