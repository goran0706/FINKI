/**
 * Server Component Constraints
 * ============================
 *
 * Server Components have a different execution model from Client Components. They can access
 * server-side resources and perform asynchronous rendering, but they cannot use browser-only
 * capabilities such as client state, effects, event handlers, or browser APIs.
 *
 * These constraints exist because Server Components are rendered outside the browser and their
 * implementation is not sent to the client as Client Component code.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Server Components cannot use client state
// ---------------------------------------------------------------------

// This is invalid as a Server Component:
//
// import {useState} from "react";
//
// export const InvalidCounter: FC = (): ReactElement => {
//     const [count, setCount] = useState(0);
//
//     return (
//         <button
//             type="button"
//             onClick={() => setCount((value) => value + 1)}
//         >
//             Count: {count}
//         </button>
//     );
// };
//
// `useState` requires a Client Component boundary.

// ---------------------------------------------------------------------
// 2. Server Components cannot use effects
// ---------------------------------------------------------------------

// This is invalid as a Server Component:
//
// import {useEffect} from "react";
//
// export const InvalidEffect: FC = (): ReactElement => {
//     useEffect(() => {
//         console.log("Effect");
//     }, []);
//
//     return <p>Example content</p>;
// };
//
// Effects run on the client after rendering and therefore do not belong in Server Components.

// ---------------------------------------------------------------------
// 3. Server Components cannot use event handlers
// ---------------------------------------------------------------------

export const StaticButton: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// Rendering a button is valid.
// Attaching an event handler is not:
//
// <button onClick={handleClick}>Save</button>
//
// Event handlers require client-side JavaScript and therefore belong in Client Components.

// ---------------------------------------------------------------------
// 4. Server Components cannot use browser APIs
// ---------------------------------------------------------------------

// These browser APIs are unavailable during Server Component rendering:
//
// window
// document
// localStorage
// sessionStorage
// navigator
// location
//
// For example:
//
// export const InvalidBrowserComponent: FC = (): ReactElement => {
//     const width = window.innerWidth;
//     return <p>Width: {width}</p>;
// };
//
// Browser APIs must be accessed from Client Components.

// ---------------------------------------------------------------------
// 5. Server Components can render browser elements without using browser APIs
// ---------------------------------------------------------------------

export const Form: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="email">Email</label>

      <input id="email" name="email" type="email" />

      <button type="submit">Submit</button>
    </form>
  );
};

// Creating HTML elements does not require access to the browser DOM.
// The constraint concerns browser APIs and client-side behavior, not HTML syntax.

// ---------------------------------------------------------------------
// 6. Server Components cannot use refs for client interaction
// ---------------------------------------------------------------------

// This is not valid as a Server Component:
//
// import {useRef} from "react";
//
// export const InvalidInput: FC = (): ReactElement => {
//     const inputRef = useRef<HTMLInputElement>(null);
//
//     return <input ref={inputRef} />;
// };
//
// Refs that depend on browser-side React behavior belong in Client Components.

// ---------------------------------------------------------------------
// 7. Server Components can pass content through props
// ---------------------------------------------------------------------

interface PanelProps {
  readonly children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ children }): ReactElement => {
  return (
    <section>
      <h2>Panel</h2>
      {children}
    </section>
  );
};

export const PanelPage: FC = (): ReactElement => {
  return (
    <Panel>
      <p>Server-rendered content.</p>
    </Panel>
  );
};

// Passing JSX through props is valid.
// The limitation is on client-specific behavior, not ordinary component composition.

// ---------------------------------------------------------------------
// 8. Server Components cannot depend on Client Component APIs
// ---------------------------------------------------------------------

// A Server Component cannot import a Client Component's internal hooks or state.
// It can, however, render the Client Component itself.
//
// Conceptually:
//
// Server Component
//      |
//      v
// Client Component
//      |
//      v
// useState / useEffect / browser APIs
//
// The Client Component defines the boundary where client-side behavior begins.

// ---------------------------------------------------------------------
// 9. Server Components can render Client Components
// ---------------------------------------------------------------------

interface InteractivePanelProps {
  readonly children: ReactNode;
}

export const InteractivePanel: FC<InteractivePanelProps> = ({ children }): ReactElement => {
  return (
    <section>
      <button type="button">Open</button>

      {children}
    </section>
  );
};

export const ServerPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Page</h1>

      <InteractivePanel>
        <p>Server-generated content.</p>
      </InteractivePanel>
    </main>
  );
};

// In an actual application, `InteractivePanel` would be defined in a Client Component module.
// The Server Component can render it without becoming a Client Component itself.

// ---------------------------------------------------------------------
// 10. Server Components cannot directly import Server Component modules into Client Components
// ---------------------------------------------------------------------

// The following dependency direction is invalid:
//
// Client Component
//      |
//      v
// Server Component
//
// For example:
//
// "use client";
//
// import {ServerContent} from "./ServerContent";
//
// export const ClientPage: FC = (): ReactElement => {
//     return <ServerContent />;
// };
//
// Instead, the Server Component should render the Client Component and pass
// server-generated JSX through `children` or another supported prop.

// ---------------------------------------------------------------------
// 11. Correct composition through children
// ---------------------------------------------------------------------

export const ServerContent: FC = (): ReactElement => {
  return (
    <article>
      <h2>Server Content</h2>
      <p>This content can remain on the server.</p>
    </article>
  );
};

export const ClientShell: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  return (
    <section>
      <button type="button">Toggle</button>

      {children}
    </section>
  );
};

export const ComposedPage: FC = (): ReactElement => {
  return (
    <ClientShell>
      <ServerContent />
    </ClientShell>
  );
};

// The Server Component creates the composition.
// The Client Component receives the already-created JSX as `children`.

// ---------------------------------------------------------------------
// 12. Server Components cannot use client-only hooks
// ---------------------------------------------------------------------

// Hooks that require client-side execution include:
//
// - useState
// - useEffect
// - useLayoutEffect
// - useInsertionEffect
// - useReducer
// - useRef
//
// These APIs require a Client Component boundary when used for client behavior.
//
// Server Components can use React APIs that are supported by the Server Components model,
// but not APIs that require persistent browser-side component state or effects.

// ---------------------------------------------------------------------
// 13. Server Components can use `use` for supported asynchronous resources
// ---------------------------------------------------------------------

import { use } from "react";

interface MessageProps {
  readonly messagePromise: Promise<string>;
}

export const ServerMessage: FC<MessageProps> = ({ messagePromise }): ReactElement => {
  const message = use(messagePromise);

  return <p>{message}</p>;
};

// `use` is different from client state or effects.
// It can read a supported Promise during rendering and allow the component to suspend
// while the value is unavailable.

// ---------------------------------------------------------------------
// 14. Server Components can perform asynchronous data fetching
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

const getUser = async (): Promise<User> => {
  return {
    name: "John Doe",
    email: "john.doe@example.com",
  };
};

export const UserProfile = async (): Promise<ReactElement> => {
  const user = await getUser();

  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
};

// Async Server Components are allowed to await server-side work directly.
// This is one of the major differences between Server Components and ordinary Client Components.

// ---------------------------------------------------------------------
// 15. Server Components should not rely on browser globals
// ---------------------------------------------------------------------

// Avoid patterns such as:
//
// typeof window !== "undefined"
// typeof document !== "undefined"
// navigator.language
// localStorage.getItem("theme")
//
// Even when a conditional prevents execution on the server, browser-dependent rendering
// can produce different server and client output and create hydration problems.
//
// Browser-dependent behavior should normally be moved into a Client Component.

// ---------------------------------------------------------------------
// 16. Server Components can receive request-specific values
// ---------------------------------------------------------------------

interface RequestData {
  readonly userName: string;
  readonly locale: string;
}

const getRequestData = async (): Promise<RequestData> => {
  return {
    userName: "John Doe",
    locale: "en-US",
  };
};

export const PersonalizedPage = async (): Promise<ReactElement> => {
  const request = await getRequestData();

  return (
    <main>
      <h1>Hello, {request.userName}</h1>
      <p>Locale: {request.locale}</p>
    </main>
  );
};

// Request-specific data can be read in the server environment through the surrounding framework.
// This does not require access to `window`, `document`, or other browser globals.

// ---------------------------------------------------------------------
// 17. Server Components cannot use client context directly
// ---------------------------------------------------------------------

// A Server Component cannot create or consume ordinary client-side context in the same way
// a Client Component does:
//
// const ThemeContext = createContext("light");
// const theme = useContext(ThemeContext);
//
// Client-side context APIs belong to Client Components.
//
// A Client Component provider can wrap Server Component output through composition.

// ---------------------------------------------------------------------
// 18. Server Components can render client context providers
// ---------------------------------------------------------------------

export const ProviderBoundary: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  return <section>{children}</section>;
};

export const ProviderPage: FC = (): ReactElement => {
  return (
    <ProviderBoundary>
      <p>Server-generated content.</p>
    </ProviderBoundary>
  );
};

// In a real application, `ProviderBoundary` can be a Client Component that provides context.
// The Server Component can render that provider around its children.

// ---------------------------------------------------------------------
// 19. Server Components cannot use client-only event objects
// ---------------------------------------------------------------------

// This is invalid:
//
// export const InvalidInput: FC = (): ReactElement => {
//     const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
//         console.log(event.target.value);
//     };
//
//     return <input onChange={handleChange} />;
// };
//
// The event handler requires client-side React behavior.
// The input element itself can be rendered by a Server Component, but the event behavior
// must be implemented in a Client Component.

// ---------------------------------------------------------------------
// 20. Server Components can render forms without client handlers
// ---------------------------------------------------------------------

export const ContactForm: FC = (): ReactElement => {
  return (
    <form method="post">
      <label htmlFor="name">Name</label>

      <input id="name" name="name" type="text" />

      <label htmlFor="message">Message</label>

      <textarea id="message" name="message" />

      <button type="submit">Send</button>
    </form>
  );
};

// A Server Component can produce normal form markup.
// Whether the form uses a browser-side event handler or a Server Function is a separate concern.

// ---------------------------------------------------------------------
// 21. Server Components cannot use layout effects
// ---------------------------------------------------------------------

// This is invalid:
//
// import {useLayoutEffect} from "react";
//
// export const InvalidLayoutEffect: FC = (): ReactElement => {
//     useLayoutEffect(() => {
//         // Browser layout work.
//     }, []);
//
//     return <div>Example</div>;
// };
//
// Layout effects require a client environment because they interact with the rendered browser DOM.

// ---------------------------------------------------------------------
// 22. Server Components cannot access the DOM
// ---------------------------------------------------------------------

// These operations are browser-only:
//
// document.querySelector("#app");
// document.createElement("div");
// element.getBoundingClientRect();
//
// A Server Component should instead produce JSX describing the desired UI.
// DOM manipulation belongs to Client Components or other client-side code.

// ---------------------------------------------------------------------
// 23. Server Components can render deterministic output
// ---------------------------------------------------------------------

export const DeterministicContent: FC<{
  readonly name: string;
}> = ({ name }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>Stable server-rendered content.</p>
    </article>
  );
};

// Deterministic output is particularly useful when the resulting tree participates in
// server-rendered HTML and later hydration.

// ---------------------------------------------------------------------
// 24. Server Components should avoid client-only rendering conditions
// ---------------------------------------------------------------------

// Avoid:
//
// const isMobile = window.innerWidth < 768;
//
// or:
//
// const isDarkMode = localStorage.getItem("theme") === "dark";
//
// These values are browser-specific.
// A Client Component can determine them after running in the browser when necessary.

// ---------------------------------------------------------------------
// 25. Server Components can pass data to Client Components
// ---------------------------------------------------------------------

interface AccountProps {
  readonly name: string;
  readonly email: string;
}

export const AccountCard: FC<AccountProps> = ({ name, email }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>{email}</p>
    </article>
  );
};

export const AccountPage = async (): Promise<ReactElement> => {
  const user = await getUser();

  return <AccountCard name={user.name} email={user.email} />;
};

// In the actual application, `AccountCard` could be a Client Component.
// Only the required data crosses the Server/Client boundary.

// ---------------------------------------------------------------------
// 26. Server Components can pass JSX to Client Components
// ---------------------------------------------------------------------

export const ServerDetails: FC = (): ReactElement => {
  return (
    <section>
      <h2>Details</h2>
      <p>Generated by the server.</p>
    </section>
  );
};

export const ClientContainer: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  return (
    <div>
      <button type="button">Interact</button>

      {children}
    </div>
  );
};

export const CompositionExample: FC = (): ReactElement => {
  return (
    <ClientContainer>
      <ServerDetails />
    </ClientContainer>
  );
};

// JSX composition allows the client boundary to control interaction without requiring
// the Server Component itself to become client code.

// ---------------------------------------------------------------------
// 27. Server Components cannot pass arbitrary server objects to Client Components
// ---------------------------------------------------------------------

interface UserRecord {
  readonly name: string;
  readonly email: string;
}

const getUserRecord = async (): Promise<UserRecord> => {
  return {
    name: "John Doe",
    email: "john.doe@example.com",
  };
};

export const SerializableUserPage = async (): Promise<ReactElement> => {
  const user = await getUserRecord();

  return <AccountCard name={user.name} email={user.email} />;
};

// The Server/Client boundary has a defined serialization model.
// Server-only objects such as database connections, request objects, or arbitrary class instances
// should not be passed as ordinary Client Component props.

// ---------------------------------------------------------------------
// 28. Server Components can use server-only resources
// ---------------------------------------------------------------------

interface ProductRepository {
  readonly findAll: () => Promise<readonly Product[]>;
}

const repository: ProductRepository = {
  findAll: async () => {
    return [
      {
        id: "product-1",
        name: "Example Product",
        price: 49,
      },
    ];
  },
};

export const RepositoryPage = async (): Promise<ReactElement> => {
  const products = await repository.findAll();

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

// Server-side resources can remain on the server when they are consumed by Server Components.
// They should not be imported into a Client Component module.

// ---------------------------------------------------------------------
// 29. Server Components can suspend during rendering
// ---------------------------------------------------------------------

const getReport = async (): Promise<string> => {
  return "Example report";
};

export const Report = async (): Promise<ReactElement> => {
  const report = await getReport();

  return (
    <article>
      <h2>Report</h2>
      <p>{report}</p>
    </article>
  );
};

export const ReportPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Dashboard</h1>

      <Report />
    </main>
  );
};

// An async Server Component can suspend while its Promise is pending.
// A surrounding Suspense boundary can coordinate the loading state when supported
// by the application's rendering architecture.

// ---------------------------------------------------------------------
// 30. Server Components can be combined with Client Components
// ---------------------------------------------------------------------

export const StaticSummary: FC = (): ReactElement => {
  return (
    <section>
      <h2>Summary</h2>
      <p>Server-rendered summary content.</p>
    </section>
  );
};

export const InteractiveSummary: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">Refresh</button>
    </section>
  );
};

export const Dashboard: FC = (): ReactElement => {
  return (
    <main>
      <StaticSummary />
      <InteractiveSummary />
    </main>
  );
};

// In an actual RSC application, `InteractiveSummary` would be placed in a Client Component module.
// `StaticSummary` can remain a Server Component.
// This lets the application keep client-side JavaScript limited to interactive portions.

// ---------------------------------------------------------------------
// 31. Server Component constraints versus Client Component capabilities
// ---------------------------------------------------------------------

export const ConstraintComparison: FC = (): ReactElement => {
  return (
    <table>
      <thead>
        <tr>
          <th>Capability</th>
          <th>Server Component</th>
          <th>Client Component</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Server-side data access</td>
          <td>Yes</td>
          <td>Not directly through server-only modules</td>
        </tr>

        <tr>
          <td>useState</td>
          <td>No</td>
          <td>Yes</td>
        </tr>

        <tr>
          <td>useEffect</td>
          <td>No</td>
          <td>Yes</td>
        </tr>

        <tr>
          <td>Event handlers</td>
          <td>No</td>
          <td>Yes</td>
        </tr>

        <tr>
          <td>Browser APIs</td>
          <td>No</td>
          <td>Yes</td>
        </tr>

        <tr>
          <td>Async component render</td>
          <td>Yes</td>
          <td>Not by making the component itself `async`</td>
        </tr>
      </tbody>
    </table>
  );
};

// The distinction is based on execution environment and React's supported component model.
// Client Components are used when browser-side capabilities are required.

// ---------------------------------------------------------------------
// 32. Complete constraint example
// ---------------------------------------------------------------------

interface DashboardData {
  readonly user: User;
  readonly products: readonly Product[];
}

const getDashboardData = async (): Promise<DashboardData> => {
  const [user, products] = await Promise.all([getUser(), repository.findAll()]);

  return {
    user,
    products,
  };
};

export const DashboardHeader: FC<{
  readonly user: User;
}> = ({ user }): ReactElement => {
  return (
    <header>
      <h1>Welcome, {user.name}</h1>
      <p>{user.email}</p>
    </header>
  );
};

export const DashboardProducts: FC<{
  readonly products: readonly Product[];
}> = ({ products }): ReactElement => {
  return (
    <section>
      <h2>Products</h2>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> <span>${product.price}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const CompleteDashboard = async (): Promise<ReactElement> => {
  const data = await getDashboardData();

  return (
    <main>
      <DashboardHeader user={data.user} />
      <DashboardProducts products={data.products} />
    </main>
  );
};

// The complete example stays within the Server Component constraints:
// - server-side data is accessed during rendering
// - asynchronous work is awaited on the server
// - no browser globals are required
// - no client state is used
// - no event handlers are attached
// - interactive behavior can be introduced later through a Client Component boundary

export default CompleteDashboard;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Server Components cannot use client state such as `useState`.
// - Server Components cannot use client effects such as `useEffect` or `useLayoutEffect`.
// - Server Components cannot attach event handlers such as `onClick` or `onChange`.
// - Server Components cannot access browser APIs such as `window`, `document`, `localStorage`, or `navigator`.
// - Server Components cannot use browser DOM operations or browser-dependent layout APIs.
// - Refs used for browser-side interaction belong in Client Components.
// - Server Components can render ordinary HTML elements without accessing the browser DOM.
// - Server Components can use asynchronous rendering and await server-side data.
// - Server Components can access server-side resources that should remain outside the client bundle.
// - Server Components can render Client Components when client-side behavior is required.
// - Server Components can pass supported serializable values to Client Components.
// - Server Components can pass JSX through `children` or other supported JSX props.
// - A Client Component should not directly import a Server Component module; composition should flow from the server side into the client boundary.
// - Browser-dependent conditions should generally be handled inside Client Components rather than during Server Component rendering.
// - Server-only resources such as database connections should remain on the server and should not cross the Client Component boundary as ordinary props.
// - Server Components can use supported asynchronous resources and suspend during rendering.
// - Server Components can be combined with Client Components so that only the interactive portions require client-side React behavior.
