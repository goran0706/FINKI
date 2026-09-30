/**
 * Client Components
 * ==================
 *
 * Client Components are components that run in the browser and can use interactive React features
 * such as state, event handlers, effects, browser APIs, and client-side context. In a React Server
 * Components application, the `"use client"` directive marks a module as client code and creates a
 * boundary between the server and client module dependency trees.
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FC,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------
// 1. A basic Client Component
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return (
    <section>
      <h1>Hello, {name}</h1>
      <p>Welcome to the application.</p>
    </section>
  );
};

// A component in a module marked with `"use client"` is part of the client module subtree.
// The directive is a module-level boundary, not a replacement for React component syntax.

// ---------------------------------------------------------------------
// 2. The "use client" directive
// ---------------------------------------------------------------------

// `"use client"` must appear before imports or other executable code.
// Comments may appear before the directive.
//
// The directive tells a compatible React Server Components bundler to treat this module
// and its transitive dependencies as client code.
//
// A Client Component can therefore use browser and interactive React APIs.

// ---------------------------------------------------------------------
// 3. Client state
// ---------------------------------------------------------------------

interface CounterProps {
  readonly initialValue?: number;
}

export const Counter: FC<CounterProps> = ({ initialValue = 0 }): ReactElement => {
  const [count, setCount] = useState(initialValue);

  return (
    <section>
      <h2>Count: {count}</h2>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>

      <button type="button" onClick={() => setCount((value) => value - 1)}>
        Decrement
      </button>
    </section>
  );
};

// Client Components can use `useState` because their state lives in the browser.
// The component can respond to user interaction without another server render for every update.

// ---------------------------------------------------------------------
// 4. Event handlers
// ---------------------------------------------------------------------

export const ActionButton: FC = (): ReactElement => {
  const handleClick = (): void => {
    console.log("Button clicked.");
  };

  return (
    <button type="button" onClick={handleClick}>
      Continue
    </button>
  );
};

// Event handlers require client-side JavaScript.
// A Server Component cannot directly define an `onClick` handler for browser execution.

// ---------------------------------------------------------------------
// 5. Event handler parameters
// ---------------------------------------------------------------------

export const SearchField: FC = (): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log(event.currentTarget.value);
  };

  return (
    <label>
      Search
      <input type="search" onChange={handleChange} />
    </label>
  );
};

// Client Components can receive browser event objects because the handlers execute in the browser.

// ---------------------------------------------------------------------
// 6. Form interaction
// ---------------------------------------------------------------------

export const ContactForm: FC = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" />
        </label>

        <button type="submit">Submit</button>
      </form>

      {submitted && <p>The form was submitted.</p>}
    </section>
  );
};

// Browser events, local state, and client-side form behavior all belong naturally in Client Components.

// ---------------------------------------------------------------------
// 7. Effects
// ---------------------------------------------------------------------

export const DocumentTitle: FC = (): ReactElement => {
  useEffect(() => {
    document.title = "Example Application";

    return () => {
      document.title = "Example";
    };
  }, []);

  return <p>The document title is managed on the client.</p>;
};

// Effects run after the component is committed on the client.
// Browser-only APIs such as `document` can therefore be used inside the Effect.

// ---------------------------------------------------------------------
// 8. Browser APIs
// ---------------------------------------------------------------------

export const BrowserStorage: FC = (): ReactElement => {
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = window.localStorage.getItem("example-name");

    if (storedName) {
      setName(storedName);
    }
  }, []);

  const saveName = (): void => {
    window.localStorage.setItem("example-name", name);
  };

  return (
    <section>
      <label>
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>

      <button type="button" onClick={saveName}>
        Save
      </button>
    </section>
  );
};

// Browser APIs such as localStorage, window, and document require client execution.
// They should not be accessed during Server Component rendering.

// ---------------------------------------------------------------------
// 9. Refs and DOM access
// ---------------------------------------------------------------------

export const FocusInput: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  return (
    <section>
      <input ref={inputRef} type="text" placeholder="Example" />

      <button type="button" onClick={focusInput}>
        Focus input
      </button>
    </section>
  );
};

// Refs can point to browser DOM nodes and are therefore commonly used by Client Components
// for imperative operations such as focusing an input.

// ---------------------------------------------------------------------
// 10. Client-only interaction
// ---------------------------------------------------------------------

interface ExpandableProps {
  readonly children: ReactNode;
}

export const Expandable: FC<ExpandableProps> = ({ children }): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Collapse" : "Expand"}
      </button>

      {expanded && children}
    </section>
  );
};

// This is a typical Client Component boundary.
// The component owns interactive state while its `children` can come from the surrounding tree.

// ---------------------------------------------------------------------
// 11. Client Components can receive children
// ---------------------------------------------------------------------

interface PanelProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ title, children }): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
};

// A Client Component does not need to know where its `children` originated.
// In a Server Components application, a Server Component can pass server-rendered JSX as children.

// ---------------------------------------------------------------------
// 12. Server Component composition
// ---------------------------------------------------------------------

// A Server Component can render a Client Component:
//
// async function Page(): Promise<ReactElement> {
//     const user = await getUser();
//
//     return (
//         <main>
//             <h1>Account</h1>
//             <Counter initialValue={user.count} />
//         </main>
//     );
// }
//
// The Server Component remains server-rendered.
// `Counter` is the client boundary because it comes from this `"use client"` module.

// ---------------------------------------------------------------------
// 13. Passing serializable props
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserCardProps {
  readonly user: User;
}

export const UserCard: FC<UserCardProps> = ({ user }): ReactElement => {
  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </article>
  );
};

// Props crossing from Server Components into Client Components must use values supported
// by the React Server Components serialization model.

// ---------------------------------------------------------------------
// 14. Supported prop values
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

interface ProductCardProps {
  readonly product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${product.price}</p>
    </article>
  );
};

interface DateDisplayProps {
  readonly createdAt: Date;
}

export const DateDisplay: FC<DateDisplayProps> = ({ createdAt }): ReactElement => {
  return <time dateTime={createdAt.toISOString()}>{createdAt.toLocaleDateString()}</time>;
};

// Serializable values can cross a Server Component boundary.
// React supports values such as primitives, arrays, plain objects, Date, Map, Set,
// typed arrays, component elements, and Promises, subject to the Server Components protocol.

// ---------------------------------------------------------------------
// 15. Functions are not ordinary serializable props
// ---------------------------------------------------------------------

interface ActionButtonProps {
  readonly label: string;
}

export const ActionButtonWithLabel: FC<ActionButtonProps> = ({ label }): ReactElement => {
  return <button type="button">{label}</button>;
};

// An ordinary function cannot be passed from a Server Component to a Client Component as a
// normal serialized prop. Functions require a client-side definition or a Server Function reference.

// ---------------------------------------------------------------------
// 16. Server Functions as an exception
// ---------------------------------------------------------------------

interface ServerActionButtonProps {
  readonly action: () => Promise<void>;
}

export const ServerActionButton: FC<ServerActionButtonProps> = ({ action }): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        void action();
      }}
    >
      Save
    </button>
  );
};

// A Server Function created with `"use server"` can be passed to a Client Component.
// The framework represents the function as a server reference rather than serializing its implementation.
//
// Example Server Component:
//
// async function SavePage(): Promise<ReactElement> {
//     async function save(): Promise<void> {
//         "use server";
//         // Save data on the server.
//     }
//
//     return <ServerActionButton action={save} />;
// }

// ---------------------------------------------------------------------
// 17. Promises and the `use` API
// ---------------------------------------------------------------------

interface MessageProps {
  readonly messagePromise: Promise<string>;
}

export const Message: FC<MessageProps> = ({ messagePromise }): ReactElement => {
  const message = use(messagePromise);

  return <p>{message}</p>;
};

// A Promise can cross a Server Component boundary.
// A Client Component cannot use `await` during render, so it can read the Promise with `use`.

// ---------------------------------------------------------------------
// 18. Suspense with a Promise
// ---------------------------------------------------------------------

interface DeferredMessageProps {
  readonly messagePromise: Promise<string>;
}

export const DeferredMessage: FC<DeferredMessageProps> = ({ messagePromise }): ReactElement => {
  const message = use(messagePromise);

  return <p>{message}</p>;
};

export const DeferredMessagePanel: FC<DeferredMessageProps> = ({ messagePromise }): ReactElement => {
  return <SuspenseFallback messagePromise={messagePromise} />;
};

interface SuspenseFallbackProps {
  readonly messagePromise: Promise<string>;
}

const SuspenseFallback: FC<SuspenseFallbackProps> = ({ messagePromise }): ReactElement => {
  return <DeferredMessage messagePromise={messagePromise} />;
};

// A Suspense boundary should normally surround a component that reads a pending Promise.
// When the Promise is unresolved, React can show the fallback until the value is available.

// ---------------------------------------------------------------------
// 19. Client-side context
// ---------------------------------------------------------------------

interface ThemeContextValue {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  readonly children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }): ReactElement => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = (): void => {
    setTheme((value) => (value === "light" ? "dark" : "light"));
  };

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
};

export const ThemeButton: FC = (): ReactElement => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("ThemeButton must be rendered inside ThemeProvider.");
  }

  return (
    <button type="button" onClick={context.toggleTheme}>
      Theme: {context.theme}
    </button>
  );
};

// Client Components can create and consume interactive context.
// A Server Component cannot create context, but it can render a provider imported from client code.

// ---------------------------------------------------------------------
// 20. A Client Component can render Server Component children
// ---------------------------------------------------------------------

interface InteractivePanelProps {
  readonly children: ReactNode;
}

export const InteractivePanel: FC<InteractivePanelProps> = ({ children }): ReactElement => {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <button type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Hide" : "Show"}
      </button>

      {open && <div>{children}</div>}
    </section>
  );
};

// A Server Component can pass JSX as `children` to this Client Component.
// This is an important composition pattern because the Client Component does not need to import
// the Server Component module directly.

// ---------------------------------------------------------------------
// 21. Client Component dependency boundaries
// ---------------------------------------------------------------------

// If this client module imported another module:
//
// import {formatDate} from "./format-date";
//
// then that dependency would also be part of the client module subtree.
// The imported module does not need its own `"use client"` directive.
//
// The boundary is created by the module that contains `"use client"`.

// ---------------------------------------------------------------------
// 22. A dependency can run in different environments
// ---------------------------------------------------------------------

// A module without `"use client"` can be evaluated in different environments depending on
// where it is imported.
//
// For example:
//
// export function formatPrice(
//     price: number,
// ): string {
//     return `$${price.toFixed(2)}`;
// }
//
// If imported by a Client Component, the function becomes part of the client dependency subtree.
// If imported only by Server Components, it can remain server-side.
//
// `"use client"` therefore defines a module dependency boundary rather than permanently
// changing the source file itself.

// ---------------------------------------------------------------------
// 23. Browser-specific APIs
// ---------------------------------------------------------------------

export const WindowSize: FC = (): ReactElement => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = (): void => {
      setWidth(window.innerWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return <p>Browser width: {width}px</p>;
};

// Browser-specific behavior is a common reason to create a Client Component.
// The browser API is accessed after the component mounts rather than during server rendering.

// ---------------------------------------------------------------------
// 24. Third-party client libraries
// ---------------------------------------------------------------------

// A third-party component that uses client-only React APIs can be used from a Client Component.
//
// Example:
//
// import {InteractiveWidget} from "example-widget";
//
// export const WidgetPanel: FC = (): ReactElement => {
//     return <InteractiveWidget />;
// };
//
// If the library is already marked as client-compatible, its own boundary can be used directly.
// Otherwise, a Client Component wrapper can provide the boundary.

// ---------------------------------------------------------------------
// 25. Client Components and bundle boundaries
// ---------------------------------------------------------------------

export const InteractiveSearch: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  return (
    <section>
      <label>
        Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>

      <p>Query: {query || "Nothing entered"}</p>
    </section>
  );
};

// Marking a module with `"use client"` can cause the module and its transitive dependencies
// to become part of the client bundle. Client boundaries should therefore be placed where
// interactive behavior actually begins.

// ---------------------------------------------------------------------
// 26. Client Components are not necessarily client-only on every render
// ---------------------------------------------------------------------

export const ClientBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h1>Example Application</h1>
      <InteractiveSearch />
    </section>
  );
};

// In a Server Components application, the server can render the surrounding application and
// establish the Client Component boundary. The Client Component code is then available to the browser.
// "Client Component" describes the component's role in the render tree, not simply whether HTML
// was initially generated by the server.

// ---------------------------------------------------------------------
// 27. Client Component state survives client updates
// ---------------------------------------------------------------------

export const PersistentCounter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Current count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Once hydrated and running in the browser, Client Component state is managed by React on the client.
// Re-rendering the component does not recreate its state from scratch.

// ---------------------------------------------------------------------
// 28. Client Components and effects
// ---------------------------------------------------------------------

export const OnlineStatus: FC = (): ReactElement => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const updateStatus = (): void => {
      setOnline(navigator.onLine);
    };

    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return <p>Status: {online ? "Online" : "Offline"}</p>;
};

// Effects can subscribe to browser events and synchronize Client Component state with browser state.

// ---------------------------------------------------------------------
// 29. Client Component composition
// ---------------------------------------------------------------------

export const AccountControls: FC = (): ReactElement => {
  return (
    <div>
      <Counter initialValue={1} />
      <ThemeButton />
    </div>
  );
};

export const ClientApplication: FC = (): ReactElement => {
  return (
    <ThemeProvider>
      <main>
        <h1>Example Application</h1>

        <Greeting name="John Doe" />
        <AccountControls />
        <SearchField />
        <OnlineStatus />
      </main>
    </ThemeProvider>
  );
};

// Client Components can freely compose other Client Components.
// Their shared client module subtree can use state, effects, events, context, and browser APIs.

// ---------------------------------------------------------------------
// 30. Complete Client Component example
// ---------------------------------------------------------------------

export const Application: FC = (): ReactElement => {
  return (
    <ThemeProvider>
      <main>
        <header>
          <h1>Example Application</h1>
          <ThemeButton />
        </header>

        <section>
          <Greeting name="John Doe" />
          <Counter initialValue={0} />
          <SearchField />
          <FocusInput />
          <OnlineStatus />
        </section>
      </main>
    </ThemeProvider>
  );
};

export default Application;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A Client Component is a component usage that runs as client code in a React Server Components application.
// - `"use client"` marks a module and its transitive dependencies as client code.
// - `"use client"` must appear at the beginning of the file before imports or executable code.
// - Client Components can use state, event handlers, effects, refs, context, and browser APIs.
// - Server Components cannot use interactive APIs such as `useState` or browser event handlers.
// - Client Components can receive supported serializable values from Server Components.
// - Ordinary JavaScript functions are not serializable props across a Server Component boundary.
// - Server Functions can cross that boundary as special server references.
// - Promises can cross the boundary and can be read in Client Components with `use`.
// - Suspense can coordinate Client Components that suspend while reading asynchronous data.
// - Client Components can render `children` supplied by Server Components.
// - A Client Component does not need to import a Server Component directly to render its server-generated children.
// - A dependency imported by a Client Component becomes part of the client module subtree.
// - A module without `"use client"` can be evaluated on either side depending on where it is imported.
// - Client-specific third-party libraries can be used from Client Components when their APIs require client execution.
// - Client boundaries can increase the amount of JavaScript sent to the browser, so they should be placed around the interactive parts that require client execution.
// - Client Components and Server Components are complementary: server code handles server-side work, while client code handles browser interaction and state.
