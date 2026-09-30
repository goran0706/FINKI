/**
 * "use client"
 * ============
 *
 * The `"use client"` directive marks a module as a Client Component module in a React Server
 * Components application. It creates a boundary in the module dependency graph: the module and
 * its transitive dependencies are treated as client code and can use client-only React APIs such
 * as state, event handlers, effects, refs, and browser APIs.
 *
 * The directive does not mean that the component can never participate in initial server rendering.
 * It identifies which module code belongs to the client side of the Server-Client boundary.
 */

"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Basic "use client" directive
// ---------------------------------------------------------------------

export const InteractiveGreeting: FC = (): ReactElement => {
  const [visible, setVisible] = useState(true);

  return (
    <section>
      <button type="button" onClick={() => setVisible((value) => !value)}>
        {visible ? "Hide greeting" : "Show greeting"}
      </button>

      {visible && <p>Hello, John Doe.</p>}
    </section>
  );
};

// The `"use client"` directive at the top of this module allows the component
// to use client-side interactivity such as state and event handlers.

// ---------------------------------------------------------------------
// 2. The directive must appear before imports and executable code
// ---------------------------------------------------------------------

// Correct:
//
// "use client";
//
// import {useState} from "react";
//
// The directive is a JavaScript directive prologue.
// It must appear before imports and other executable statements.

// ---------------------------------------------------------------------
// 3. "use client" enables state
// ---------------------------------------------------------------------

export const Counter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>

      <button type="button" onClick={() => setCount((value) => value - 1)}>
        Decrement
      </button>
    </section>
  );
};

// `useState` requires client-side React behavior.
// A Client Component can own state and update it in response to interaction.

// ---------------------------------------------------------------------
// 4. "use client" enables event handlers
// ---------------------------------------------------------------------

export const ActionButton: FC = (): ReactElement => {
  const handleClick = (): void => {
    console.log("Button clicked.");
  };

  return (
    <button type="button" onClick={handleClick}>
      Click
    </button>
  );
};

// Event handlers such as `onClick` require client-side execution.
// A Server Component cannot define an ordinary browser event handler for its output.

// ---------------------------------------------------------------------
// 5. Event handlers can receive typed events
// ---------------------------------------------------------------------

export const NameInput: FC = (): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log(event.target.value);
  };

  return (
    <label>
      Name
      <input type="text" onChange={handleChange} />
    </label>
  );
};

// The event object is created during browser interaction.
// Client Components can declare the appropriate React event type for the element.

// ---------------------------------------------------------------------
// 6. "use client" enables effects
// ---------------------------------------------------------------------

export const EffectExample: FC = (): ReactElement => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    setMessage("Ready.");
  }, []);

  return <p>{message}</p>;
};

// Effects run after a component is committed in a client environment.
// A Server Component cannot use `useEffect`.

// ---------------------------------------------------------------------
// 7. Effects can synchronize with browser-side behavior
// ---------------------------------------------------------------------

export const DocumentTitle: FC<{
  readonly title: string;
}> = ({ title }): ReactElement => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <h1>{title}</h1>;
};

// Browser APIs such as `document` are appropriate inside client-side effects.
// Keeping browser-dependent work inside an effect also avoids accessing the browser
// during the server-side rendering phase.

// ---------------------------------------------------------------------
// 8. "use client" enables refs
// ---------------------------------------------------------------------

export const FocusedInput: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  return (
    <section>
      <input ref={inputRef} type="text" placeholder="Enter a name" />

      <button type="button" onClick={handleFocus}>
        Focus input
      </button>
    </section>
  );
};

// Refs can hold client-side DOM references and mutable values.
// Browser DOM references are available when the component has been mounted in the browser.

// ---------------------------------------------------------------------
// 9. "use client" enables browser APIs
// ---------------------------------------------------------------------

export const BrowserInformation: FC = (): ReactElement => {
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

// Browser globals such as `window` should be accessed from client-side code.
// The effect runs after the component is mounted in the browser.

// ---------------------------------------------------------------------
// 10. Client modules can contain non-interactive components
// ---------------------------------------------------------------------

export const StaticMessage: FC<{
  readonly message: string;
}> = ({ message }): ReactElement => {
  return <p>{message}</p>;
};

// A component does not need to use state, effects, or browser APIs simply because
// it is defined inside a module marked with `"use client"`.

// ---------------------------------------------------------------------
// 11. Imported dependencies become part of the client subtree
// ---------------------------------------------------------------------

export const formatName = (name: string): string => {
  return name.trim();
};

export const FormattedName: FC<{
  readonly name: string;
}> = ({ name }): ReactElement => {
  return <p>{formatName(name)}</p>;
};

// `formatName` does not use a React client API.
// Because it is imported and used from this client-marked module,
// it belongs to the client module subtree as well.

// ---------------------------------------------------------------------
// 12. Transitive dependencies also belong to the client subtree
// ---------------------------------------------------------------------

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const ProductPrice: FC<{
  readonly price: number;
}> = ({ price }): ReactElement => {
  return <p>{formatPrice(price)}</p>;
};

// If `formatPrice` imported another module, that dependency could also become part
// of the client module subtree. The boundary therefore follows the dependency graph.

// ---------------------------------------------------------------------
// 13. A client module can render normal HTML
// ---------------------------------------------------------------------

export const ArticlePreview: FC<{
  readonly title: string;
  readonly description: string;
}> = ({ title, description }): ReactElement => {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
};

// `"use client"` does not require every component to be interactive.
// Normal JSX and HTML elements remain valid.

// ---------------------------------------------------------------------
// 14. Client Components can receive serializable props
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

// A Server Component can pass supported data values into this Client Component.
// The Client Component receives the values as props at the Server-Client boundary.

// ---------------------------------------------------------------------
// 15. Client Components can receive children
// ---------------------------------------------------------------------

export const ClientPanel: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <button type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Hide" : "Show"}
      </button>

      {open && children}
    </section>
  );
};

// `children` is useful for composing a Client Component with JSX generated elsewhere.
// A Server Component can provide server-generated JSX as `children` without the Client Component
// directly importing the Server Component module.

// ---------------------------------------------------------------------
// 16. Client Components can render server-generated JSX
// ---------------------------------------------------------------------

export const InteractiveShell: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
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

// Conceptually, a Server Component can render:
//
// <InteractiveShell>
//     <ServerContent />
// </InteractiveShell>
//
// `InteractiveShell` owns the client-side interaction.
// `ServerContent` can remain a Server Component because its JSX was created on the server.

// ---------------------------------------------------------------------
// 17. Client Components cannot directly import Server Components
// ---------------------------------------------------------------------

// The following dependency direction is invalid:
//
// "use client";
//
// import {ServerProfile} from "./ServerProfile";
//
// export const ClientPage: FC = (): ReactElement => {
//     return <ServerProfile />;
// };
//
// A Client Component should not directly import a Server Component module.
// The server side should compose the two sides and pass supported values or JSX
// across the boundary.

// ---------------------------------------------------------------------
// 18. A Server Component can import a Client Component
// ---------------------------------------------------------------------

// The opposite dependency direction is supported:
//
// Server Component
//       |
//       v
// Client Component
//
// For example, a Server Component can conceptually render:
//
// <Counter />
//
// The Server Component remains a Server Component.
// Rendering a Client Component does not turn the parent module into client code.

// ---------------------------------------------------------------------
// 19. "use client" does not mean "browser-only execution"
// ---------------------------------------------------------------------

export const ClientComponent: FC = (): ReactElement => {
  const [active, setActive] = useState(false);

  return (
    <button type="button" onClick={() => setActive((value) => !value)}>
      {active ? "Active" : "Inactive"}
    </button>
  );
};

// `"use client"` identifies this module as client code in the RSC module graph.
// It does not simply mean that this component can never participate in initial server rendering.
// Frameworks can render Client Component output as part of the initial response and then
// load the client code needed for its interactive behavior.

// ---------------------------------------------------------------------
// 20. "use client" is different from hydration
// ---------------------------------------------------------------------

export const HydratableButton: FC = (): ReactElement => {
  const [clicked, setClicked] = useState(false);

  return (
    <button type="button" onClick={() => setClicked(true)}>
      {clicked ? "Clicked" : "Click me"}
    </button>
  );
};

// `"use client"` defines a client module boundary.
// Hydration is the process of attaching React behavior to existing server-generated HTML.
// They are related concepts, but they are not interchangeable.

// ---------------------------------------------------------------------
// 21. "use client" is different from "use server"
// ---------------------------------------------------------------------

// `"use client"`:
//
// "use client";
//
// marks a module as client code.
//
// `"use server"`:
//
// "use server";
//
// is used for Server Functions and does not mark a module as a Server Component.
//
// Server Components do not need a `"use server"` directive.

// ---------------------------------------------------------------------
// 22. Client Components can use forms and controlled state
// ---------------------------------------------------------------------

export const NameForm: FC = (): ReactElement => {
  const [name, setName] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  return (
    <form>
      <label>
        Name
        <input type="text" value={name} onChange={handleChange} />
      </label>

      <p>Current value: {name || "Empty"}</p>
    </form>
  );
};

// Controlled inputs require client-side state and event handling.
// `"use client"` makes those APIs available in this module.

// ---------------------------------------------------------------------
// 23. Client Components can use multiple client-only APIs together
// ---------------------------------------------------------------------

export const SearchBox: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  return (
    <section>
      <input ref={inputRef} type="search" value={query} onChange={handleChange} placeholder="Search" />

      <p>Query: {query || "None"}</p>
    </section>
  );
};

// State, refs, effects, DOM interaction, and event handlers can all coexist
// inside a Client Component.

// ---------------------------------------------------------------------
// 24. Browser storage belongs on the client side
// ---------------------------------------------------------------------

export const SavedPreference: FC = (): ReactElement => {
  const [preference, setPreference] = useState("");

  useEffect(() => {
    const savedValue = window.localStorage.getItem("preference");

    if (savedValue !== null) {
      setPreference(savedValue);
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;

    setPreference(value);
    window.localStorage.setItem("preference", value);
  };

  return (
    <label>
      Preference
      <input type="text" value={preference} onChange={handleChange} />
    </label>
  );
};

// `localStorage` is a browser API.
// Access it from client-side execution rather than assuming that it exists during server rendering.

// ---------------------------------------------------------------------
// 25. Client Components can use client-side lifecycle behavior
// ---------------------------------------------------------------------

export const ConnectionStatus: FC = (): ReactElement => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const handleOnline = (): void => {
      setOnline(true);
    };

    const handleOffline = (): void => {
      setOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return <p>{online ? "Online" : "Offline"}</p>;
};

// Effects can subscribe to browser events and clean them up when the component unmounts.

// ---------------------------------------------------------------------
// 26. Keep server-only implementation outside the client module
// ---------------------------------------------------------------------

interface ProductData {
  readonly name: string;
  readonly price: number;
}

export const ProductControls: FC<ProductData> = ({ name, price }): ReactElement => {
  const [quantity, setQuantity] = useState(1);

  return (
    <section>
      <h2>{name}</h2>
      <p>{price.toFixed(2)}</p>

      <button type="button" onClick={() => setQuantity((value) => value + 1)}>
        Quantity: {quantity}
      </button>
    </section>
  );
};

// A Server Component can obtain `ProductData` from a server-side data source
// and pass the required values to `ProductControls`.
// The database client, filesystem access, private credentials, or other server-only
// implementation details should remain on the server side.

// ---------------------------------------------------------------------
// 27. Client Components can receive Date values
// ---------------------------------------------------------------------

export const Timestamp: FC<{
  readonly createdAt: Date;
}> = ({ createdAt }): ReactElement => {
  return <time dateTime={createdAt.toISOString()}>{createdAt.toISOString()}</time>;
};

// React's Server Components serialization model supports Date values.
// The Client Component receives the reconstructed value rather than the server's
// internal implementation that produced it.

// ---------------------------------------------------------------------
// 28. Ordinary functions are not regular serializable props
// ---------------------------------------------------------------------

// This pattern is not a normal Server-to-Client prop:
//
// interface Props {
//     readonly onSave: () => void;
// }
//
// A Server Component cannot simply create an ordinary function and pass it as a prop
// to a Client Component.
//
// Server Functions provide a separate mechanism when server-side callable behavior
// must be exposed to client code.

// ---------------------------------------------------------------------
// 29. Server Functions are different from client event handlers
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly action: () => Promise<void>;
}

export const SaveButton: FC<SaveButtonProps> = ({ action }): ReactElement => {
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

// The `onClick` handler itself runs in the browser.
// `action` can represent a supported Server Function reference that performs work on the server.
//
// This distinction separates browser event handling from server-side function execution.

// ---------------------------------------------------------------------
// 30. A Client Component can contain nested Client Components
// ---------------------------------------------------------------------

export const Toggle: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return (
    <button type="button" onClick={() => setEnabled((value) => !value)}>
      {enabled ? "Enabled" : "Disabled"}
    </button>
  );
};

export const SettingsPanel: FC = (): ReactElement => {
  return (
    <section>
      <h2>Settings</h2>
      <Toggle />
    </section>
  );
};

// Both components are inside the same client module subtree.
// The nested component does not need a separate `"use client"` directive.

// ---------------------------------------------------------------------
// 31. A client boundary can be kept small
// ---------------------------------------------------------------------

export const StaticHeader: FC<{
  readonly title: string;
}> = ({ title }): ReactElement => {
  return (
    <header>
      <h1>{title}</h1>
    </header>
  );
};

export const InteractiveToolbar: FC = (): ReactElement => {
  const [active, setActive] = useState(false);

  return (
    <nav>
      <button type="button" onClick={() => setActive((value) => !value)}>
        {active ? "Active" : "Inactive"}
      </button>
    </nav>
  );
};

// In a larger application, static content can remain in Server Components while
// a small interactive region is placed behind a client boundary.
// The goal is not to mark every component as client code.

// ---------------------------------------------------------------------
// 32. Client boundaries affect the client module graph
// ---------------------------------------------------------------------

export const ClientApplication: FC = (): ReactElement => {
  return (
    <main>
      <StaticHeader title="Example Application" />
      <InteractiveToolbar />
    </main>
  );
};

// A `"use client"` boundary causes the module's dependencies to participate in the client graph.
// Therefore, placing the directive high in a large dependency tree can make substantially more
// code part of the client side than placing the boundary around a smaller interactive region.

// ---------------------------------------------------------------------
// 33. Complete interactive component
// ---------------------------------------------------------------------

interface ProfileEditorProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export const ProfileEditor: FC<ProfileEditorProps> = ({ initialName, initialEmail }): ReactElement => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [saved, setSaved] = useState(false);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
    setSaved(false);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
    setSaved(false);
  };

  const handleSave = (): void => {
    setSaved(true);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      <label>
        Name
        <input type="text" value={name} onChange={handleNameChange} />
      </label>

      <label>
        Email
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>

      <button type="submit">Save</button>

      {saved && <p>Changes saved.</p>}
    </form>
  );
};

// This component demonstrates the primary reason for a client boundary:
// local state, browser events, controlled inputs, and interactive updates.

// ---------------------------------------------------------------------
// 34. Complete Server-Client composition
// ---------------------------------------------------------------------

export const ClientAccountPanel: FC<{
  readonly name: string;
  readonly email: string;
}> = ({ name, email }): ReactElement => {
  const [editing, setEditing] = useState(false);

  return (
    <section>
      <h2>{name}</h2>
      <p>{email}</p>

      <button type="button" onClick={() => setEditing((value) => !value)}>
        {editing ? "Cancel" : "Edit"}
      </button>

      {editing && <p>Editing is enabled.</p>}
    </section>
  );
};

// A Server Component can conceptually do the following:
//
// const account = await getAccount();
//
// return (
//     <ClientAccountPanel
//         name={account.name}
//         email={account.email}
//     />
// );
//
// The Server Component owns server-side data access.
// `ClientAccountPanel` owns interactive browser behavior.
// `"use client"` defines the module boundary that separates those responsibilities.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `"use client"` marks a module as part of the client side of the Server-Client module graph.
// - The directive must appear before imports and other executable statements.
// - A Client Component can use state, event handlers, effects, refs, and browser APIs.
// - A component does not need to be interactive merely because it is defined in a client-marked module.
// - The directive affects the module dependency graph, including transitive dependencies.
// - A Server Component can import and render a Client Component.
// - A Client Component cannot directly import a Server Component module.
// - Client Components can receive supported values from Server Components through props.
// - Server-generated JSX can be passed to Client Components through supported props such as `children`.
// - Ordinary JavaScript functions are not normal serializable Server-to-Client props.
// - Server Functions provide a separate supported mechanism for callable server-side behavior.
// - `"use client"` is different from `"use server"`; `"use server"` is used for Server Functions.
// - `"use client"` is different from hydration; it defines a client module boundary rather than performing hydration itself.
// - `"use client"` does not simply mean that the component can never participate in initial server rendering.
// - Keeping client boundaries focused can limit the amount of code that belongs to the client module subtree.
// - The primary purpose of `"use client"` is to identify code that requires client-side React capabilities such as interactivity and browser APIs.
