/**
 * Rendering Strategy Comparison
 * ==============================
 *
 * React applications can use different rendering strategies depending on where rendering happens,
 * when data is resolved, whether the output needs hydration, and whether the response should be
 * delivered progressively. Client rendering, server rendering, static rendering, streaming,
 * hydration, and Server Components solve different parts of the rendering problem and can also
 * be combined within the same application.
 */

import { Suspense, useState, type FC, type ReactElement, type ReactNode } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { renderToString, renderToStaticMarkup, renderToPipeableStream } from "react-dom/server";

// ---------------------------------------------------------------------
// 1. Client rendering
// ---------------------------------------------------------------------

interface ClientApplicationProps {
  readonly name: string;
}

export const ClientApplication: FC<ClientApplicationProps> = ({ name }): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Hello, {name}</h1>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Count: {count}
      </button>
    </main>
  );
};

export const renderClientApplication = (container: HTMLElement): void => {
  const root = createRoot(container);
  root.render(<ClientApplication name="John Doe" />);
};

// Client rendering starts with JavaScript in the browser.
// React creates the UI directly inside the browser DOM.
// There is no server-generated HTML that must be hydrated.

// ---------------------------------------------------------------------
// 2. Server rendering
// ---------------------------------------------------------------------

export const ServerApplication: FC<{
  readonly name: string;
}> = ({ name }): ReactElement => {
  return (
    <main>
      <h1>Hello, {name}</h1>
      <p>Initial content was rendered on the server.</p>
    </main>
  );
};

export const renderServerApplication = (name: string): string => {
  return renderToString(<ServerApplication name={name} />);
};

// Server rendering produces HTML on the server.
// The resulting HTML can be sent to the browser before client JavaScript has finished loading.

// ---------------------------------------------------------------------
// 3. Hydrating server-rendered HTML
// ---------------------------------------------------------------------

export const HydratableApplication: FC<{
  readonly name: string;
}> = ({ name }): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Hello, {name}</h1>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Count: {count}
      </button>
    </main>
  );
};

export const hydrateApplication = (container: HTMLElement, name: string): void => {
  hydrateRoot(container, <HydratableApplication name={name} />);
};

// Server rendering and hydration are complementary:
// 1. The server produces initial HTML.
// 2. The browser displays that HTML.
// 3. React hydrates the existing markup.
// 4. Event handlers and client state become active.

// ---------------------------------------------------------------------
// 4. Static markup rendering
// ---------------------------------------------------------------------

export const StaticApplication: FC<{
  readonly title: string;
}> = ({ title }): ReactElement => {
  return (
    <article>
      <h1>{title}</h1>
      <p>This output does not need React interactivity.</p>
    </article>
  );
};

export const renderStaticApplication = (title: string): string => {
  return renderToStaticMarkup(<StaticApplication title={title} />);
};

// `renderToStaticMarkup` produces non-hydratable HTML.
// It is appropriate when the result is intended to remain static,
// such as generated documents or other HTML that does not need React on the client.

// ---------------------------------------------------------------------
// 5. Non-streaming server rendering
// ---------------------------------------------------------------------

export const renderCompletePage = (): string => {
  return renderToString(
    <html lang="en">
      <head>
        <title>Example Page</title>
      </head>

      <body>
        <main>
          <h1>Example Page</h1>
          <p>The complete HTML result is produced as a string.</p>
        </main>
      </body>
    </html>,
  );
};

// `renderToString` produces one complete string before the result is sent.
// It does not progressively deliver HTML as rendering work becomes available.

// ---------------------------------------------------------------------
// 6. Streaming server rendering
// ---------------------------------------------------------------------

const readProduct = async (): Promise<string> => {
  return "Example Product";
};

export const StreamingProduct: FC = (): ReactElement => {
  const [status] = useState("Ready");

  return (
    <section>
      <h2>Product</h2>
      <p>{status}</p>
    </section>
  );
};

export const StreamingApplication: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <title>Example Store</title>
      </head>

      <body>
        <main>
          <h1>Example Store</h1>

          <Suspense fallback={<p>Loading product...</p>}>
            <StreamingProduct />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

export const createStreamingResponse = (
  destination: Parameters<ReturnType<typeof renderToPipeableStream>["pipe"]>[0],
): void => {
  const stream = renderToPipeableStream(<StreamingApplication />, {
    onShellReady() {
      stream.pipe(destination);
    },
    onError(error) {
      console.error(error);
    },
  });
};

// Streaming rendering can send the initial shell before every part of the
// application has finished rendering. Suspense boundaries allow slower content
// to be revealed progressively.

// ---------------------------------------------------------------------
// 7. Static, server, and streaming rendering produce different output behavior
// ---------------------------------------------------------------------

export const RenderingModes: FC = (): ReactElement => {
  return (
    <section>
      <h1>Rendering Modes</h1>

      <p>Server rendering can produce hydratable HTML.</p>

      <p>Static markup produces non-hydratable HTML.</p>

      <p>Streaming rendering can progressively deliver hydratable HTML.</p>
    </section>
  );
};

// The rendering API determines how output is produced.
// It does not by itself determine whether an application uses Server Components.

// ---------------------------------------------------------------------
// 8. Client rendering versus server rendering
// ---------------------------------------------------------------------

interface MessageProps {
  readonly message: string;
}

export const Message: FC<MessageProps> = ({ message }): ReactElement => {
  return <p>{message}</p>;
};

export const ClientOnlyPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Client Rendered Page</h1>
      <Message message="Rendered in the browser." />
    </main>
  );
};

export const ServerPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Server Rendered Page</h1>
      <Message message="Rendered on the server." />
    </main>
  );
};

// Client rendering requires the browser to execute React before the React UI exists.
// Server rendering can provide HTML before the client React bundle has completed execution.

// ---------------------------------------------------------------------
// 9. Server rendering does not automatically mean interactive
// ---------------------------------------------------------------------

export const ServerRenderedCounter: FC = (): ReactElement => {
  return <button type="button">Count: 0</button>;
};

export const InteractiveCounter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
};

// A server-rendered button can appear in the initial HTML without having
// an active client event handler. Hydration is what connects the client
// React behavior to server-generated markup.

// ---------------------------------------------------------------------
// 10. Hydration requires matching initial output
// ---------------------------------------------------------------------

export const MatchingApplication: FC<{
  readonly name: string;
}> = ({ name }): ReactElement => {
  return (
    <main>
      <h1>Hello, {name}</h1>
      <p>Stable initial output.</p>
    </main>
  );
};

// The server and initial client render should produce matching output.
// A mismatch can cause React to regenerate part of the tree or report a hydration warning.

// ---------------------------------------------------------------------
// 11. Static rendering versus hydratable server rendering
// ---------------------------------------------------------------------

export const HydratableDocument = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <title>Example Document</title>
      </head>

      <body>
        <main>
          <h1>Example Document</h1>
        </main>
      </body>
    </html>
  );
};

export const StaticDocument = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <title>Example Document</title>
      </head>

      <body>
        <main>
          <h1>Example Document</h1>
        </main>
      </body>
    </html>
  );
};

export const renderHydratableDocument = (): string => {
  return renderToString(<HydratableDocument />);
};

export const renderNonHydratableDocument = (): string => {
  return renderToStaticMarkup(<StaticDocument />);
};

// `renderToString` is intended for HTML that can participate in hydration.
// `renderToStaticMarkup` intentionally omits the React-specific information needed for hydration.

// ---------------------------------------------------------------------
// 12. Streaming versus non-streaming server rendering
// ---------------------------------------------------------------------

export const NonStreamingPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Page</h1>
      <p>All output is collected into one string.</p>
    </main>
  );
};

export const StreamingPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Page</h1>

      <Suspense fallback={<p>Loading...</p>}>
        <p>Progressively rendered content.</p>
      </Suspense>
    </main>
  );
};

export const renderNonStreamingPage = (): string => {
  return renderToString(<NonStreamingPage />);
};

// `renderToString` returns a string.
// `renderToPipeableStream` returns a Node.js pipeable stream.
// `renderToReadableStream` is the corresponding Web Streams API.

// ---------------------------------------------------------------------
// 13. Streaming can improve progressive delivery
// ---------------------------------------------------------------------

interface SlowSectionProps {
  readonly children: ReactNode;
}

export const SlowSection: FC<SlowSectionProps> = ({ children }): ReactElement => {
  return <section>{children}</section>;
};

export const ProgressivePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Dashboard</h1>

      <section>
        <h2>Important content</h2>
        <p>This content can be part of the initial shell.</p>
      </section>

      <Suspense fallback={<p>Loading secondary content...</p>}>
        <SlowSection>
          <p>Secondary content can arrive later.</p>
        </SlowSection>
      </Suspense>
    </main>
  );
};

// Streaming is particularly useful when different parts of a page have different rendering times.
// Suspense boundaries provide points where slower content can be revealed later.

// ---------------------------------------------------------------------
// 14. Dynamic rendering is a data strategy, not a single React API
// ---------------------------------------------------------------------

interface RequestData {
  readonly userName: string;
  readonly productName: string;
}

const getRequestData = async (): Promise<RequestData> => {
  return {
    userName: "John Doe",
    productName: "Example Product",
  };
};

export const DynamicPage = async (): Promise<ReactElement> => {
  const data = await getRequestData();

  return (
    <main>
      <h1>Hello, {data.userName}</h1>
      <p>Product: {data.productName}</p>
    </main>
  );
};

// Dynamic rendering means the result depends on data determined at render time,
// such as request-specific data, authentication, cookies, headers, or changing data.
// It is an architectural strategy rather than a separate React DOM rendering function.

// ---------------------------------------------------------------------
// 15. Static and dynamic rendering can coexist
// ---------------------------------------------------------------------

export const StaticHeader: FC = (): ReactElement => {
  return (
    <header>
      <h1>Example Store</h1>
    </header>
  );
};

export const DynamicAccountSection: FC<{
  readonly userName: string;
}> = ({ userName }): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <p>Signed in as {userName}</p>
    </section>
  );
};

export const MixedStrategyPage = async (): Promise<ReactElement> => {
  const data = await getRequestData();

  return (
    <main>
      <StaticHeader />

      <DynamicAccountSection userName={data.userName} />
    </main>
  );
};

// A page can contain content that is conceptually stable and content that depends on request-time data.
// The application can choose an appropriate caching and rendering strategy for each part.

// ---------------------------------------------------------------------
// 16. Server Components are different from server rendering
// ---------------------------------------------------------------------

export const ServerComponentExample = async (): Promise<ReactElement> => {
  const data = await getRequestData();

  return (
    <article>
      <h2>{data.productName}</h2>
      <p>{data.userName}</p>
    </article>
  );
};

// Server Components are a component architecture.
// Server rendering is a process that produces HTML.
// A Server Component application can optionally also be server-rendered into HTML.
// These concepts should not be treated as synonyms.

// ---------------------------------------------------------------------
// 17. Client Components can participate in server-rendered applications
// ---------------------------------------------------------------------

export const InteractiveWidget: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Close" : "Open"}
      </button>

      {open && <p>Interactive client state.</p>}
    </section>
  );
};

export const ServerPageWithClientWidget = async (): Promise<ReactElement> => {
  const data = await getRequestData();

  return (
    <main>
      <h1>{data.productName}</h1>
      <InteractiveWidget />
    </main>
  );
};

// Server Components and Client Components can coexist.
// A framework or compatible bundler determines the Server/Client Component boundaries.
// The application can then use server rendering to produce the initial HTML.

// ---------------------------------------------------------------------
// 18. Rendering strategies can be combined
// ---------------------------------------------------------------------

export const CombinedPage = async (): Promise<ReactElement> => {
  const data = await getRequestData();

  return (
    <main>
      <h1>{data.productName}</h1>

      <Suspense fallback={<p>Loading account...</p>}>
        <DynamicAccountSection userName={data.userName} />
      </Suspense>

      <InteractiveWidget />
    </main>
  );
};

// One application can combine:
// - Server Components for server-side composition and data access.
// - Server rendering for initial HTML.
// - Streaming for progressive delivery.
// - Suspense for loading boundaries.
// - Client Components for interaction.
// - Hydration for activating client behavior.

// ---------------------------------------------------------------------
// 19. Choosing client rendering
// ---------------------------------------------------------------------

export const ClientRenderingExample: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  return (
    <main>
      <h1>Interactive Application</h1>

      <button type="button" onClick={() => setValue((current) => current + 1)}>
        Value: {value}
      </button>
    </main>
  );
};

// Client rendering is useful when the application is primarily an interactive browser application
// and the initial UI does not need to come from server-generated HTML.

// ---------------------------------------------------------------------
// 20. Choosing server rendering
// ---------------------------------------------------------------------

export const ServerRenderingExample = (): ReactElement => {
  return (
    <main>
      <h1>Example Article</h1>
      <p>This content can be included in the initial HTML.</p>
    </main>
  );
};

// Server rendering is useful when the application benefits from producing HTML on the server before
// the browser finishes loading and executing the client JavaScript.

// ---------------------------------------------------------------------
// 21. Choosing static rendering
// ---------------------------------------------------------------------

export const StaticRenderingExample = (): ReactElement => {
  return (
    <article>
      <h1>Example Documentation</h1>
      <p>This document does not require React interactivity after generation.</p>
    </article>
  );
};

// Static rendering is useful when the generated output does not need to become an interactive
// React application in the browser.

// ---------------------------------------------------------------------
// 22. Choosing streaming rendering
// ---------------------------------------------------------------------

export const StreamingRenderingExample: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Dashboard</h1>

      <Suspense fallback={<p>Loading report...</p>}>
        <section>
          <h2>Report</h2>
          <p>Report content can be revealed progressively.</p>
        </section>
      </Suspense>
    </main>
  );
};

// Streaming is useful when the server can produce an initial shell while other parts of the
// application are still rendering, particularly when Suspense boundaries divide the work.

// ---------------------------------------------------------------------
// 23. Choosing hydration
// ---------------------------------------------------------------------

export const HydrationExample: FC = (): ReactElement => {
  const [active, setActive] = useState(false);

  return (
    <button type="button" onClick={() => setActive((value) => !value)}>
      {active ? "Active" : "Inactive"}
    </button>
  );
};

// Hydration is not an alternative to server rendering.
// It is the process of attaching React behavior to existing server-generated HTML.

// ---------------------------------------------------------------------
// 24. Rendering strategy comparison
// ---------------------------------------------------------------------

interface StrategyDescriptionProps {
  readonly name: string;
  readonly description: string;
}

export const StrategyDescription: FC<StrategyDescriptionProps> = ({ name, description }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>{description}</p>
    </article>
  );
};

export const StrategyComparison: FC = (): ReactElement => {
  return (
    <section>
      <StrategyDescription name="Client rendering" description="React creates the application UI in the browser." />

      <StrategyDescription name="Server rendering" description="The server produces HTML that can later be hydrated." />

      <StrategyDescription name="Static rendering" description="The server produces non-hydratable HTML." />

      <StrategyDescription name="Streaming rendering" description="The server progressively sends rendered HTML." />

      <StrategyDescription name="Hydration" description="React activates server-generated HTML in the browser." />

      <StrategyDescription
        name="Server Components"
        description="Components can render in a server environment separate from the client application."
      />
    </section>
  );
};

// These terms describe different dimensions:
//
// Client rendering       -> where the UI is rendered.
// Server rendering       -> where HTML is generated.
// Static rendering       -> whether the generated HTML is intended to remain static.
// Streaming rendering    -> how server output is delivered.
// Hydration              -> how server HTML becomes interactive.
// Server Components      -> where component code and data access can execute.

// ---------------------------------------------------------------------
// 25. A practical strategy matrix
// ---------------------------------------------------------------------

export const StrategyMatrix: FC = (): ReactElement => {
  return (
    <table>
      <thead>
        <tr>
          <th>Strategy</th>
          <th>HTML generated on server</th>
          <th>Hydratable</th>
          <th>Progressive delivery</th>
          <th>React client code</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Client rendering</td>
          <td>No</td>
          <td>Not applicable</td>
          <td>No</td>
          <td>Yes</td>
        </tr>

        <tr>
          <td>Server rendering</td>
          <td>Yes</td>
          <td>Yes</td>
          <td>No</td>
          <td>Optional, if hydration is used</td>
        </tr>

        <tr>
          <td>Static markup</td>
          <td>Yes</td>
          <td>No</td>
          <td>No</td>
          <td>No</td>
        </tr>

        <tr>
          <td>Streaming rendering</td>
          <td>Yes</td>
          <td>Yes, when hydratable output is used</td>
          <td>Yes</td>
          <td>Optional, if hydration is used</td>
        </tr>
      </tbody>
    </table>
  );
};

// The matrix describes rendering behavior rather than application architecture.
// Server Components are intentionally not a row because they are not an HTML delivery mechanism.

// ---------------------------------------------------------------------
// 26. Rendering strategy and application requirements
// ---------------------------------------------------------------------

export const RequirementExample: FC = (): ReactElement => {
  return (
    <section>
      <h1>Example Application</h1>

      <ul>
        <li>Initial HTML may be generated on the server.</li>
        <li>Slow sections may stream later.</li>
        <li>Interactive controls require client code.</li>
        <li>Stable documents may be generated as static markup.</li>
      </ul>
    </section>
  );
};

// The rendering strategy should follow the application's requirements.
// Questions to consider include:
//
// - Does the initial UI need to exist before client JavaScript loads?
// - Does the output need React interactivity?
// - Does data depend on each request?
// - Can content be generated ahead of time?
// - Are some parts significantly slower than others?
// - Which parts actually need client-side JavaScript?

// ---------------------------------------------------------------------
// 27. Complete combined example
// ---------------------------------------------------------------------

interface ApplicationData {
  readonly userName: string;
  readonly title: string;
}

const getApplicationData = async (): Promise<ApplicationData> => {
  return {
    userName: "John Doe",
    title: "Example Dashboard",
  };
};

export const DashboardHeader: FC<{
  readonly title: string;
  readonly userName: string;
}> = ({ title, userName }): ReactElement => {
  return (
    <header>
      <h1>{title}</h1>
      <p>Signed in as {userName}</p>
    </header>
  );
};

export const DashboardControls: FC = (): ReactElement => {
  const [compact, setCompact] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setCompact((value) => !value)}>
        {compact ? "Normal view" : "Compact view"}
      </button>

      <p>{compact ? "Compact layout" : "Normal layout"}</p>
    </section>
  );
};

export const DashboardContent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Dashboard Content</h2>
      <p>This content can be included in the initial rendered output.</p>
    </section>
  );
};

export const CompleteRenderingExample = async (): Promise<ReactElement> => {
  const data = await getApplicationData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{data.title}</title>
      </head>

      <body>
        <main>
          <DashboardHeader title={data.title} userName={data.userName} />

          <DashboardControls />

          <Suspense fallback={<p>Loading content...</p>}>
            <DashboardContent />
          </Suspense>
        </main>
      </body>
    </html>
  );
};

// This example can be understood as a combination of strategies:
// - Application data is resolved during server-side rendering.
// - The initial page can be rendered to HTML.
// - Suspense can provide a boundary for progressive rendering.
// - DashboardControls requires client-side React behavior.
// - Hydration can activate that client behavior after the HTML reaches the browser.

// ---------------------------------------------------------------------
// 28. Strategy selection is contextual
// ---------------------------------------------------------------------

export const RenderingStrategyGuidance: FC = (): ReactElement => {
  return (
    <section>
      <h1>Rendering Strategy</h1>

      <p>Use client rendering when the application is primarily created and managed in the browser.</p>

      <p>
        Use server rendering when producing initial HTML on the server is useful and the result should be hydratable.
      </p>

      <p>Use static rendering when generated HTML does not need React interactivity.</p>

      <p>Use streaming when server-rendered content can be delivered progressively.</p>

      <p>Use hydration when server-generated HTML needs to become interactive React UI.</p>

      <p>
        Use Server Components when the application architecture benefits from rendering component logic and accessing
        data in a server environment separate from the client application.
      </p>
    </section>
  );
};

export default CompleteRenderingExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Client rendering creates the React UI in the browser.
// - Server rendering produces HTML on the server and can provide content before client JavaScript finishes loading.
// - `renderToString` produces a hydratable HTML string but does not progressively stream the result.
// - `renderToStaticMarkup` produces non-hydratable static HTML.
// - Streaming rendering progressively delivers server-rendered HTML and can work with Suspense boundaries.
// - Hydration activates React behavior on existing server-generated HTML; it is complementary to server rendering rather than an alternative to it.
// - Dynamic rendering describes when render-time data is determined; it is an architectural strategy rather than one specific React rendering API.
// - Server Components describe where component logic can execute and how server/client module boundaries are composed.
// - Server Components and server rendering are related but represent different concepts.
// - Server Components can be combined with server rendering, streaming, Suspense, Client Components, and hydration.
// - Client Components provide browser-side interaction such as state, event handlers, effects, and browser APIs.
// - Static markup is appropriate when the generated result should remain plain HTML rather than become an interactive React tree.
// - Streaming is useful when an application can show an initial shell while slower content continues rendering.
// - Hydratable server output requires compatible initial server and client rendering so React can attach to the existing markup correctly.
// - Rendering strategy should be selected according to data requirements, interactivity, delivery behavior, and where the application needs code to execute.
