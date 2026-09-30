/**
 * React DOM Client
 * ================
 *
 * `react-dom/client` provides the client-side APIs used to render React components into browser DOM
 * containers. Its primary APIs are `createRoot` for client rendering and `hydrateRoot` for attaching
 * React behavior to HTML that was previously rendered by React on the server.
 */

// ---------------------------------------------------------------------
// 1. Importing client rendering APIs
// ---------------------------------------------------------------------

import { hydrateRoot, createRoot } from "react-dom/client";
import { type FC, type ReactElement } from "react";

export const Greeting: FC = (): ReactElement => {
  return (
    <main>
      <h1>Hello, John Doe</h1>
      <p>Welcome to the application.</p>
    </main>
  );
};

// `createRoot` is used when React should create the client-rendered tree.
// `hydrateRoot` is used when the container already contains server-rendered React HTML.

// ---------------------------------------------------------------------
// 2. `createRoot` creates a client-rendered React root
// ---------------------------------------------------------------------

export const createApplicationRoot = (container: HTMLElement): void => {
  const root = createRoot(container);

  root.render(<Greeting />);
};

// The container must be a DOM element available in the browser.
// React manages the component tree rendered into that container.

// ---------------------------------------------------------------------
// 3. A root can render a complete component tree
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

export const renderAccountPage = (container: HTMLElement, user: User): void => {
  const root = createRoot(container);

  root.render(<AccountPage user={user} />);
};

// The root does not need to represent only one component.
// It can manage an entire composed React tree.

// ---------------------------------------------------------------------
// 4. Keep the root reference for later updates
// ---------------------------------------------------------------------

interface StatusProps {
  readonly status: "idle" | "loading" | "success";
}

export const Status: FC<StatusProps> = ({ status }): ReactElement => {
  return <p data-status={status}>Status: {status}</p>;
};

export const createStatusRoot = (
  container: HTMLElement,
): {
  readonly renderStatus: (status: StatusProps["status"]) => void;
  readonly unmount: () => void;
} => {
  const root = createRoot(container);

  return {
    renderStatus: (status): void => {
      root.render(<Status status={status} />);
    },
    unmount: (): void => {
      root.unmount();
    },
  };
};

export const statusRootExample = (container: HTMLElement): void => {
  const application = createStatusRoot(container);

  application.renderStatus("idle");
  application.renderStatus("loading");
  application.renderStatus("success");
};

// A root is normally created once for a container.
// Calling `render` again updates the tree managed by that root.

// ---------------------------------------------------------------------
// 5. `root.render` updates the existing React tree
// ---------------------------------------------------------------------

interface CounterProps {
  readonly count: number;
}

export const Counter: FC<CounterProps> = ({ count }): ReactElement => {
  return <p>Count: {count}</p>;
};

export const updateCounter = (container: HTMLElement, count: number): void => {
  const root = createRoot(container);

  root.render(<Counter count={count} />);
};

// In an actual application, the root should not be recreated for every update.
// The root returned by `createRoot` should be retained and reused.

// ---------------------------------------------------------------------
// 6. `hydrateRoot` attaches React to existing server-rendered HTML
// ---------------------------------------------------------------------

export const HydratableGreeting: FC = (): ReactElement => {
  return (
    <main>
      <h1>Hello, John Doe</h1>
      <button type="button">Save</button>
    </main>
  );
};

export const hydrateApplication = (container: HTMLElement): void => {
  hydrateRoot(container, <HydratableGreeting />);
};

// `hydrateRoot` expects the container to already contain HTML generated from
// the same React tree. React can then attach its client-side behavior to that markup.

// ---------------------------------------------------------------------
// 7. `createRoot` and `hydrateRoot` have different starting conditions
// ---------------------------------------------------------------------

export const ClientOnlyApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Client application</h1>
      <p>React creates this tree in the browser.</p>
    </main>
  );
};

export const ServerRenderedApplication: FC = (): ReactElement => {
  return (
    <main>
      <h1>Server application</h1>
      <p>This markup was already produced by React on the server.</p>
    </main>
  );
};

export const clientOnlyExample = (container: HTMLElement): void => {
  createRoot(container).render(<ClientOnlyApplication />);
};

export const hydratedExample = (container: HTMLElement): void => {
  hydrateRoot(container, <ServerRenderedApplication />);
};

// `createRoot` starts with a container that React should render into.
// `hydrateRoot` starts with HTML that React has already rendered into that container.

// ---------------------------------------------------------------------
// 8. Hydration expects matching server and client output
// ---------------------------------------------------------------------

interface AccountProps {
  readonly name: string;
}

export const Account: FC<AccountProps> = ({ name }): ReactElement => {
  return (
    <section>
      <h2>{name}</h2>
      <p>john.doe@example.com</p>
    </section>
  );
};

export const hydrateAccount = (container: HTMLElement): void => {
  hydrateRoot(container, <Account name="John Doe" />);
};

// The client should render the same logical tree and data that produced the
// server HTML. Differences between server and client output can produce hydration mismatches.

// ---------------------------------------------------------------------
// 9. The root object provides lifecycle control
// ---------------------------------------------------------------------

export const createManagedRoot = (
  container: HTMLElement,
): {
  readonly render: () => void;
  readonly unmount: () => void;
} => {
  const root = createRoot(container);

  return {
    render: (): void => {
      root.render(<Greeting />);
    },
    unmount: (): void => {
      root.unmount();
    },
  };
};

export const rootLifecycleExample = (container: HTMLElement): void => {
  const application = createManagedRoot(container);

  application.render();
  application.unmount();
};

// `render` updates the root's component tree.
// `unmount` removes the React tree and releases React's management of the root.

// ---------------------------------------------------------------------
// 10. Client APIs require a browser DOM container
// ---------------------------------------------------------------------

export const browserContainerExample = (): void => {
  const container = document.getElementById("root");

  if (container === null) {
    throw new Error("Root container was not found.");
  }

  createRoot(container).render(<Greeting />);
};

// `react-dom/client` APIs operate on browser DOM containers.
// Code calling these APIs therefore runs in a browser environment.

// ---------------------------------------------------------------------
// 11. Multiple roots can be created for separate containers
// ---------------------------------------------------------------------

export const HeaderWidget: FC = (): ReactElement => {
  return (
    <header>
      <strong>Account</strong>
    </header>
  );
};

export const NotificationWidget: FC = (): ReactElement => {
  return (
    <aside>
      <span>3 notifications</span>
    </aside>
  );
};

export const renderIndependentRoots = (): void => {
  const headerContainer = document.getElementById("header-root");
  const notificationContainer = document.getElementById("notification-root");

  if (headerContainer === null || notificationContainer === null) {
    throw new Error("Widget root container was not found.");
  }

  createRoot(headerContainer).render(<HeaderWidget />);

  createRoot(notificationContainer).render(<NotificationWidget />);
};

// Separate containers can have separate React roots.
// Each root manages its own React tree.

// ---------------------------------------------------------------------
// 12. Do not create multiple roots for the same container
// ---------------------------------------------------------------------

export const incorrectRootCreation = (container: HTMLElement): void => {
  const firstRoot = createRoot(container);

  firstRoot.render(<Greeting />);

  // Creating another root for the same container is not the intended API usage.
  // A single container should have one React root.
};

// Keep one root reference when the application needs to render updates into
// the same container.

// ---------------------------------------------------------------------
// 13. Hydration can be followed by normal root updates
// ---------------------------------------------------------------------

interface MessageProps {
  readonly message: string;
}

export const Message: FC<MessageProps> = ({ message }): ReactElement => {
  return <p>{message}</p>;
};

export const createHydratedApplication = (
  container: HTMLElement,
): {
  readonly update: (message: string) => void;
  readonly unmount: () => void;
} => {
  const root = hydrateRoot(container, <Message message="Account loaded." />);

  return {
    update: (message): void => {
      root.render(<Message message={message} />);
    },
    unmount: (): void => {
      root.unmount();
    },
  };
};

// After hydration, the returned root can be used to update the hydrated
// application with normal React rendering behavior.

// ---------------------------------------------------------------------
// 14. Client APIs can render components with state
// ---------------------------------------------------------------------

import { useState } from "react";

export const InteractiveCounter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((current) => current + 1)}>
      Count: {count}
    </button>
  );
};

export const renderInteractiveCounter = (container: HTMLElement): void => {
  createRoot(container).render(<InteractiveCounter />);
};

// `createRoot` establishes the client-side React tree in which interactive
// state and event handling can operate.

// ---------------------------------------------------------------------
// 15. Complete demonstration
// ---------------------------------------------------------------------

export const ReactDomClientDemo: FC = (): ReactElement => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <main>
      <Greeting />
      <AccountPage user={user} />
      <Status status="success" />
      <Counter count={3} />
      <HydratableGreeting />
      <ClientOnlyApplication />
      <ServerRenderedApplication />
      <Account name="John Doe" />
      <HeaderWidget />
      <NotificationWidget />
      <Message message="Account loaded." />
      <InteractiveCounter />
    </main>
  );
};

export default ReactDomClientDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `react-dom/client` provides the browser APIs for client rendering and hydration.
// - `createRoot` creates a React root for a DOM container that React should render into.
// - `root.render` renders or updates the component tree managed by an existing root.
// - A root should normally be created once for a given container and then reused for updates.
// - `hydrateRoot` is used when the container already contains HTML rendered by React on the server.
// - Hydration expects the client-rendered tree to correspond to the existing server-rendered HTML.
// - `root.unmount` removes a React tree and releases React's management of that root.
// - Multiple roots can exist when separate DOM containers intentionally host independent React trees.
// - Client rendering requires a browser DOM container because the APIs operate on browser DOM elements.
// - After hydration, the returned root can be used for normal React updates and lifecycle management.
