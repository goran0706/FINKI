/**
 * Client Rendering
 * ================
 *
 * Client rendering is the process of creating and updating a React component tree in the browser.
 * React renders the component tree into a DOM container, and the browser displays the resulting UI.
 *
 * Client rendering is commonly started with `createRoot` from `react-dom/client`. The root provides
 * React with a container whose DOM content becomes managed by React for the lifetime of that root.
 */

// ---------------------------------------------------------------------
// 1. A component can be rendered into a browser container
// ---------------------------------------------------------------------

import { type FC, type ReactElement } from "react";
import { createRoot } from "react-dom/client";

export const Greeting: FC = (): ReactElement => {
  return (
    <main>
      <h1>Hello, John Doe</h1>
      <p>Welcome to the application.</p>
    </main>
  );
};

// A browser document must contain an element that will serve as the React root.
// For example:
//
// <div id="root"></div>
//
// The application can then create a React root for that container.

// ---------------------------------------------------------------------
// 2. `createRoot` creates a client-side React root
// ---------------------------------------------------------------------

export const renderApplication = (): void => {
  const container = document.getElementById("root");

  if (container === null) {
    throw new Error("React root container was not found.");
  }

  const root = createRoot(container);

  root.render(<Greeting />);
};

// `createRoot` connects React to the existing DOM container.
// `root.render` tells React which component tree should be displayed there.

// ---------------------------------------------------------------------
// 3. The root manages the rendered component tree
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

export const renderUserProfile = (container: HTMLElement, user: User): void => {
  const root = createRoot(container);

  root.render(<UserProfile user={user} />);
};

// The root can render any React element tree, not only a single simple component.
// React manages the resulting component tree inside the root container.

// ---------------------------------------------------------------------
// 4. Rendering can use component composition
// ---------------------------------------------------------------------

interface PageProps {
  readonly user: User;
}

export const Header: FC = (): ReactElement => {
  return (
    <header>
      <h1>Account</h1>
    </header>
  );
};

export const AccountPage: FC<PageProps> = ({ user }): ReactElement => {
  return (
    <main>
      <Header />
      <UserProfile user={user} />
    </main>
  );
};

export const renderAccountPage = (container: HTMLElement, user: User): void => {
  const root = createRoot(container);

  root.render(<AccountPage user={user} />);
};

// Client rendering begins with a root, but the root can contain an arbitrarily
// large component tree created through normal React composition.

// ---------------------------------------------------------------------
// 5. Rendering is not limited to the initial component
// ---------------------------------------------------------------------

interface CounterProps {
  readonly count: number;
}

export const Counter: FC<CounterProps> = ({ count }): ReactElement => {
  return <p>Count: {count}</p>;
};

export const renderCounter = (container: HTMLElement, count: number): void => {
  const root = createRoot(container);

  root.render(<Counter count={count} />);
};

// Calling `render` on the same root with another element updates the React tree.
// A real application normally keeps the root reference rather than creating a
// new root for every update.

// ---------------------------------------------------------------------
// 6. Keep the root reference when rendering updates
// ---------------------------------------------------------------------

interface StatusProps {
  readonly status: "idle" | "loading" | "success";
}

export const Status: FC<StatusProps> = ({ status }): ReactElement => {
  return <p data-status={status}>Status: {status}</p>;
};

export const createStatusRenderer = (container: HTMLElement): ((status: StatusProps["status"]) => void) => {
  const root = createRoot(container);

  return (status): void => {
    root.render(<Status status={status} />);
  };
};

export const rootReferenceExample = (container: HTMLElement): void => {
  const renderStatus = createStatusRenderer(container);

  renderStatus("idle");
  renderStatus("loading");
  renderStatus("success");
};

// The root is created once for the container.
// Subsequent calls update the component tree managed by that root.

// ---------------------------------------------------------------------
// 7. React manages the container after the root is created
// ---------------------------------------------------------------------

export const ManagedContainerExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>React-managed content</h2>
      <p>This content belongs to the React component tree.</p>
    </section>
  );
};

export const renderManagedContainer = (container: HTMLElement): void => {
  const root = createRoot(container);

  root.render(<ManagedContainerExample />);
};

// Once React owns a container through a root, application code should not
// independently manipulate the same DOM subtree as if React did not manage it.

// ---------------------------------------------------------------------
// 8. Client rendering starts from browser APIs
// ---------------------------------------------------------------------

export const browserRenderingExample = (): void => {
  const container = document.querySelector<HTMLElement>("#root");

  if (container === null) {
    throw new Error("React root container was not found.");
  }

  const root = createRoot(container);

  root.render(<Greeting />);
};

// `document` and `HTMLElement` are browser APIs. Client rendering therefore
// assumes that a browser environment provides the DOM container.

// ---------------------------------------------------------------------
// 9. A component tree can receive application data
// ---------------------------------------------------------------------

interface DashboardProps {
  readonly user: User;
  readonly notifications: number;
}

export const Dashboard: FC<DashboardProps> = ({ user, notifications }): ReactElement => {
  return (
    <main>
      <Header />
      <UserProfile user={user} />
      <p>Notifications: {notifications}</p>
    </main>
  );
};

export const renderDashboard = (container: HTMLElement): void => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  createRoot(container).render(<Dashboard user={user} notifications={3} />);
};

// The root does not determine application data.
// It receives a React element tree, and that tree receives data through props
// and other React mechanisms.

// ---------------------------------------------------------------------
// 10. Client rendering can mount different application roots
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

export const renderWidgets = (): void => {
  const headerContainer = document.getElementById("header-root");
  const notificationContainer = document.getElementById("notification-root");

  if (headerContainer === null || notificationContainer === null) {
    throw new Error("Widget root container was not found.");
  }

  createRoot(headerContainer).render(<HeaderWidget />);

  createRoot(notificationContainer).render(<NotificationWidget />);
};

// Multiple independent roots can exist when an application intentionally
// mounts separate React trees into separate DOM containers.

// ---------------------------------------------------------------------
// 11. Unmounting removes React's ownership of a root
// ---------------------------------------------------------------------

export const createUnmountableRoot = (
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

export const unmountExample = (container: HTMLElement): void => {
  const application = createUnmountableRoot(container);

  application.render();
  application.unmount();
};

// `unmount` tells React to remove the component tree and release the root's
// React-managed resources associated with that container.

// ---------------------------------------------------------------------
// 12. Client rendering can start a complete application
// ---------------------------------------------------------------------

export const Application: FC = (): ReactElement => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return <Dashboard user={user} notifications={3} />;
};

export const startApplication = (): void => {
  const container = document.getElementById("root");

  if (container === null) {
    throw new Error("Application root container was not found.");
  }

  const root = createRoot(container);

  root.render(<Application />);
};

// A typical client-rendered application creates one root for its main
// container and renders the application's top-level component into that root.

// ---------------------------------------------------------------------
// 13. Client rendering and DOM ownership
// ---------------------------------------------------------------------

export const DomOwnershipExample: FC = (): ReactElement => {
  return (
    <div>
      <h2>Application content</h2>
      <p>React renders this component tree into its root container.</p>
    </div>
  );
};

export const renderDomOwnershipExample = (container: HTMLElement): void => {
  const root = createRoot(container);

  root.render(<DomOwnershipExample />);
};

// The container itself belongs to the host environment, while the React tree
// rendered inside it is managed by React.

// ---------------------------------------------------------------------
// 14. Complete demonstration
// ---------------------------------------------------------------------

export const ClientRenderingDemo: FC = (): ReactElement => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <main>
      <Greeting />
      <AccountPage user={user} />
      <Counter count={3} />
      <Status status="success" />
      <ManagedContainerExample />
      <Dashboard user={user} notifications={3} />
      <HeaderWidget />
      <NotificationWidget />
      <DomOwnershipExample />
    </main>
  );
};

export default ClientRenderingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Client rendering creates and updates a React component tree in the browser.
// - `createRoot` from `react-dom/client` creates a React root for a DOM container.
// - `root.render` renders a React element tree into the root.
// - A root should normally be created once for a container and reused for subsequent renders.
// - React manages the component tree inside a root, so application code should not independently manipulate the same DOM subtree.
// - Client rendering relies on browser APIs such as `document` and DOM elements.
// - The root receives a component tree; application data is passed through that tree using normal React mechanisms.
// - Multiple independent roots can be used when separate React trees intentionally mount into separate containers.
// - `root.unmount` removes the React tree and releases React's ownership of that root.
// - A client-rendered application commonly creates a root for its main DOM container and renders its top-level component into it.
