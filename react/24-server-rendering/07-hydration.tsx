/**
 * Hydration
 * =========
 *
 * Hydration is the process of attaching React to HTML that was already generated on the server.
 * `hydrateRoot` reuses the existing server-rendered DOM, connects it to the corresponding React
 * tree, and makes the application interactive in the browser.
 */

// ---------------------------------------------------------------------
// 1. Importing `hydrateRoot`
// ---------------------------------------------------------------------

import { hydrateRoot } from "react-dom/client";
import { useState, type FC, type ReactElement } from "react";

// Hydration starts with HTML that already exists in the browser.
// `hydrateRoot` connects that HTML to a React component tree.

// ---------------------------------------------------------------------
// 2. Basic hydration
// ---------------------------------------------------------------------

export const Greeting: FC = (): ReactElement => {
  return (
    <main>
      <h1>Hello, John Doe</h1>
      <p>Welcome to the application.</p>
    </main>
  );
};

export const hydrateApplication = (container: HTMLElement): void => {
  hydrateRoot(container, <Greeting />);
};

// The container is expected to contain HTML produced from the same React tree.
// React reuses that existing HTML instead of starting with an empty container.

// ---------------------------------------------------------------------
// 3. Hydration reuses server-rendered HTML
// ---------------------------------------------------------------------

export const AccountPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>
      <p>John Doe</p>
      <p>john.doe@example.com</p>
    </main>
  );
};

export const hydrateAccountPage = (container: HTMLElement): void => {
  hydrateRoot(container, <AccountPage />);
};

// `hydrateRoot` is different from `createRoot`.
// `createRoot` starts a new client-rendered tree, while `hydrateRoot` starts
// from HTML that React has already rendered on the server.

// ---------------------------------------------------------------------
// 4. Hydration makes server-rendered content interactive
// ---------------------------------------------------------------------

export const InteractiveCounter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((current) => current + 1)}>
      Count: {count}
    </button>
  );
};

export const hydrateInteractiveCounter = (container: HTMLElement): void => {
  hydrateRoot(container, <InteractiveCounter />);
};

// Before hydration, the browser can display the server-generated button.
// After hydration, React connects the component logic and event handling to it.

// ---------------------------------------------------------------------
// 5. The server and client must render the same initial output
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
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </section>
  );
};

export const hydrateUserProfile = (container: HTMLElement, user: User): void => {
  hydrateRoot(container, <UserProfile user={user} />);
};

const user: User = {
  name: "John Doe",
  email: "john.doe@example.com",
};

// The `user` data used here must correspond to the data that produced
// the HTML already present inside `container`.

// ---------------------------------------------------------------------
// 6. Hydration mismatches
// ---------------------------------------------------------------------

export const StableContent: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <p>Stable initial content.</p>
    </main>
  );
};

export const hydrateStableContent = (container: HTMLElement): void => {
  hydrateRoot(container, <StableContent />);
};

// A mismatch occurs when the React tree passed to `hydrateRoot` does not
// produce the same initial output as the server-rendered React tree.
// Hydration mismatches should generally be treated as bugs and fixed.

// ---------------------------------------------------------------------
// 7. Common mismatch source: different render-time data
// ---------------------------------------------------------------------

interface TimestampProps {
  readonly timestamp: string;
}

export const Timestamp: FC<TimestampProps> = ({ timestamp }): ReactElement => {
  return <p>Generated at: {timestamp}</p>;
};

export const hydrateTimestamp = (container: HTMLElement, timestamp: string): void => {
  hydrateRoot(container, <Timestamp timestamp={timestamp} />);
};

// If the server renders one timestamp and the client independently creates
// another timestamp during its initial render, the text can differ.
// The initial client render should instead use the same value as the server.

// ---------------------------------------------------------------------
// 8. Browser-only APIs can cause mismatches
// ---------------------------------------------------------------------

export const BrowserAwareContent: FC = (): ReactElement => {
  return (
    <section>
      <h1>Example Application</h1>
      <p>Browser-specific behavior should not change the initial markup.</p>
    </section>
  );
};

export const hydrateBrowserAwareContent = (container: HTMLElement): void => {
  hydrateRoot(container, <BrowserAwareContent />);
};

// Rendering different markup based directly on browser-only APIs can cause
// the client output to differ from the server output during hydration.

// ---------------------------------------------------------------------
// 9. Use an Effect for an intentional client-only second pass
// ---------------------------------------------------------------------

export const ClientAwareContent: FC = (): ReactElement => {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return <p>{isClient ? "Running in the browser." : "Initial server-compatible content."}</p>;
};

// The initial render produces the same content that the server can produce.
// The Effect runs after hydration and then updates the content for the browser.

// ---------------------------------------------------------------------
// 10. `suppressHydrationWarning` for unavoidable differences
// ---------------------------------------------------------------------

export const CurrentTime: FC = (): ReactElement => {
  return <p suppressHydrationWarning={true}>{new Date().toLocaleTimeString()}</p>;
};

export const hydrateCurrentTime = (container: HTMLElement): void => {
  hydrateRoot(container, <CurrentTime />);
};

// `suppressHydrationWarning` is an escape hatch for an unavoidable difference,
// such as a timestamp. It should not be used to hide ordinary hydration bugs.
// It only suppresses the warning one level deep.

// ---------------------------------------------------------------------
// 11. Hydrating an entire document
// ---------------------------------------------------------------------

export const DocumentApplication: FC = (): ReactElement => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Example Application</title>
      </head>
      <body>
        <main>
          <h1>Example Application</h1>
          <p>Entire document hydration.</p>
        </main>
      </body>
    </html>
  );
};

export const hydrateDocument = (): void => {
  hydrateRoot(document, <DocumentApplication />);
};

// An application that renders the entire document can pass `document`
// directly to `hydrateRoot` instead of selecting a separate root element.

// ---------------------------------------------------------------------
// 12. The returned root can update the hydrated tree
// ---------------------------------------------------------------------

interface MessageProps {
  readonly message: string;
}

export const Message: FC<MessageProps> = ({ message }): ReactElement => {
  return <p>{message}</p>;
};

export const createHydratedMessageRoot = (container: HTMLElement) => {
  const root = hydrateRoot(container, <Message message="Initial message." />);

  return root;
};

export const updateHydratedMessage = (root: ReturnType<typeof createHydratedMessageRoot>): void => {
  root.render(<Message message="Updated message." />);
};

// `hydrateRoot` returns a root object with `render` and `unmount` methods.
// In normal applications, component state is usually used for updates instead.

// ---------------------------------------------------------------------
// 13. Avoid rendering before hydration finishes
// ---------------------------------------------------------------------

export const HydratedApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <p>Hydration can reuse this existing HTML.</p>
    </main>
  );
};

export const createHydratedApplication = (container: HTMLElement) => {
  return hydrateRoot(container, <HydratedApplication />);
};

// Calling `root.render` before hydration finishes can cause React to clear
// the existing server-rendered HTML and switch the root to client rendering.
// Let hydration complete before performing such an explicit root update.

// ---------------------------------------------------------------------
// 14. Hydration is normally performed once per application root
// ---------------------------------------------------------------------

export const Application: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <InteractiveCounter />
    </main>
  );
};

export const startApplication = (container: HTMLElement): void => {
  hydrateRoot(container, <Application />);
};

// A fully React-built application will normally call `hydrateRoot` once
// for its main root. Frameworks often perform this initialization automatically.

// ---------------------------------------------------------------------
// 15. Hydration and multiple independent roots
// ---------------------------------------------------------------------

export const Header: FC = (): ReactElement => {
  return (
    <header>
      <strong>Example Application</strong>
    </header>
  );
};

export const Notifications: FC = (): ReactElement => {
  return (
    <aside>
      <span>3 notifications</span>
    </aside>
  );
};

export const hydrateIndependentRoots = (): void => {
  const headerContainer = document.getElementById("header-root");
  const notificationContainer = document.getElementById("notification-root");

  if (headerContainer === null || notificationContainer === null) {
    throw new Error("Hydration container was not found.");
  }

  hydrateRoot(headerContainer, <Header />);

  hydrateRoot(notificationContainer, <Notifications />);
};

// Multiple hydrated roots are possible when a page intentionally contains
// separate React applications. Most fully React-built applications use one root.

// ---------------------------------------------------------------------
// 16. `identifierPrefix` keeps generated IDs consistent
// ---------------------------------------------------------------------

export const IdentifiedApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <p>IDs can be generated consistently across server and client.</p>
    </main>
  );
};

export const hydrateIdentifiedApplication = (container: HTMLElement): void => {
  hydrateRoot(container, <IdentifiedApplication />, {
    identifierPrefix: "example-app-",
  });
};

// When `useId` is used with multiple React roots, `identifierPrefix` can help
// avoid ID collisions. The same prefix must be used by the corresponding
// server rendering and client hydration APIs.

// ---------------------------------------------------------------------
// 17. Hydration preserves the server-rendered initial experience
// ---------------------------------------------------------------------

export const InitialPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Product</h1>
      <p>This content is visible before the client JavaScript finishes loading.</p>
      <button type="button">Continue</button>
    </main>
  );
};

export const hydrateInitialPage = (container: HTMLElement): void => {
  hydrateRoot(container, <InitialPage />);
};

// Server rendering allows users to see the initial HTML before the client
// JavaScript has loaded. Hydration then connects that HTML to the React application.

// ---------------------------------------------------------------------
// 18. Complete hydration demonstration
// ---------------------------------------------------------------------

export const HydrationDemo: FC = (): ReactElement => {
  return (
    <main>
      <Greeting />
      <AccountPage />
      <InteractiveCounter />
      <UserProfile user={user} />
      <StableContent />
      <BrowserAwareContent />
      <ClientAwareContent />
      <CurrentTime />
      <Message message="Initial message." />
      <HydratedApplication />
      <Application />
      <Header />
      <Notifications />
      <IdentifiedApplication />
      <InitialPage />
    </main>
  );
};

export default HydrationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Hydration attaches React to HTML that was already rendered on the server.
// - `hydrateRoot` is the React client API used to hydrate server-rendered HTML.
// - Hydration reuses the existing server-rendered DOM instead of starting with an empty container.
// - The initial client React tree must produce the same output as the server-rendered tree.
// - Different render-time data, browser-only APIs, and environment-dependent output can cause mismatches.
// - `suppressHydrationWarning` is an escape hatch for unavoidable one-level differences such as timestamps.
// - An Effect can be used when content intentionally needs to change after the initial hydration pass.
// - The root returned by `hydrateRoot` supports `render` and `unmount`.
// - Calling `root.render` before hydration finishes can cause React to switch the root to client rendering.
// - A fully React-built application will normally call `hydrateRoot` once for its main root.
// - `identifierPrefix` can keep generated IDs consistent when multiple React roots are used.
