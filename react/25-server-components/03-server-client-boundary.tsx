/**
 * Server-Client Boundary
 * =======================
 *
 * The Server-Client boundary separates code that runs in the Server Components environment from
 * code that runs in the client. In React Server Components applications, the `"use client"` directive
 * marks a module and its transitive dependencies as client code, while values crossing the boundary
 * must follow React's supported serialization model.
 *
 * The boundary is defined by the module dependency graph, while Server and Client Component
 * terminology describes component usages in the resulting render tree.
 */

"use client";

import { useState, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. A Client Component module creates a client boundary
// ---------------------------------------------------------------------

export const Counter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// `"use client"` must appear before imports and other executable code.
// It marks this module as part of the client module subtree.

// ---------------------------------------------------------------------
// 2. The boundary belongs to the module dependency graph
// ---------------------------------------------------------------------

export const ClientToolbar: FC = (): ReactElement => {
  return (
    <div>
      <Counter />
    </div>
  );
};

// Conceptually:
//
// Server module
//      |
//      v
// ClientToolbar       <- `"use client"` boundary
//      |
//      v
// Counter
//
// Imports reachable through a client-marked module become part of the client module subtree.

// ---------------------------------------------------------------------
// 3. Transitive dependencies become client code
// ---------------------------------------------------------------------

export const formatLabel = (value: string): string => {
  return value.trim().toUpperCase();
};

export const FormattedLabel: FC<{
  readonly value: string;
}> = ({ value }): ReactElement => {
  return <p>{formatLabel(value)}</p>;
};

// `formatLabel` does not need its own `"use client"` directive.
// Because this module imports and uses it from client-marked code,
// it becomes part of the client module subtree.

// ---------------------------------------------------------------------
// 4. A client boundary does not mean every component definition is permanently client-only
// ---------------------------------------------------------------------

export const Presentation: FC<{
  readonly title: string;
}> = ({ title }): ReactElement => {
  return <h2>{title}</h2>;
};

// A component definition without `"use client"` can be used from different environments.
// Its component usage is what is classified as a Server or Client Component.
//
// When `Presentation` is used from this client-marked module, this usage is client-side.
// The same component definition can have a Server Component usage elsewhere.

// ---------------------------------------------------------------------
// 5. Server Components can import Client Components
// ---------------------------------------------------------------------

// A Server Component can conceptually import:
//
// import {Counter} from "./Counter";
//
// and render:
//
// <Counter />
//
// The import establishes the boundary between the server module and the client module.
// The Server Component does not become a Client Component merely because it renders `Counter`.

// ---------------------------------------------------------------------
// 6. Client Components cannot directly import Server Components
// ---------------------------------------------------------------------

// The following dependency direction is not supported:
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
// import {ServerProfile} from "./ServerProfile";
//
// export const InvalidClientPage: FC = (): ReactElement => {
//     return <ServerProfile />;
// };
//
// A Server Component should instead render the Client Component and pass server-generated
// JSX through a supported prop such as `children`.

// ---------------------------------------------------------------------
// 7. Server-to-client data crossing
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

// A Server Component can pass a serializable `user` value to this Client Component.
//
// Conceptually:
//
// Server Component
//      |
//      | user
//      v
// UserCard
//
// The value crosses the Server-Client boundary as data rather than as a direct module dependency.

// ---------------------------------------------------------------------
// 8. Primitive values can cross the boundary
// ---------------------------------------------------------------------

interface MessageProps {
  readonly message: string;
  readonly count: number;
  readonly enabled: boolean;
}

export const Message: FC<MessageProps> = ({ message, count, enabled }): ReactElement => {
  return (
    <section>
      <p>{message}</p>
      <p>Count: {count}</p>
      <p>Status: {enabled ? "Enabled" : "Disabled"}</p>
    </section>
  );
};

// Strings, numbers, booleans, null, undefined, and other supported primitive values
// can be passed through the Server-Client boundary.

// ---------------------------------------------------------------------
// 9. Plain objects can cross the boundary
// ---------------------------------------------------------------------

interface Profile {
  readonly name: string;
  readonly email: string;
}

interface ProfileCardProps {
  readonly profile: Profile;
}

export const ProfileCard: FC<ProfileCardProps> = ({ profile }): ReactElement => {
  return (
    <article>
      <h2>{profile.name}</h2>
      <p>{profile.email}</p>
    </article>
  );
};

// Plain objects whose properties are themselves supported values can be serialized
// across the boundary.

// ---------------------------------------------------------------------
// 10. Arrays can cross the boundary
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
}

interface ProductListProps {
  readonly products: readonly Product[];
}

export const ProductList: FC<ProductListProps> = ({ products }): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

// Arrays and their serializable contents are supported boundary values.

// ---------------------------------------------------------------------
// 11. Date values can cross the boundary
// ---------------------------------------------------------------------

interface ActivityProps {
  readonly createdAt: Date;
}

export const Activity: FC<ActivityProps> = ({ createdAt }): ReactElement => {
  return <time dateTime={createdAt.toISOString()}>{createdAt.toISOString()}</time>;
};

// `Date` is one of the built-in values supported by React's Server Components
// serialization model.

// ---------------------------------------------------------------------
// 12. Functions cannot normally cross the boundary
// ---------------------------------------------------------------------

interface InvalidActionProps {
  readonly onSave: () => void;
}

// This prop shape is valid TypeScript, but an ordinary function is not a serializable
// Server-to-Client prop:
//
// export const InvalidActionButton: FC<InvalidActionProps> = ({
//     onSave,
// }): ReactElement => {
//     return (
//         <button
//             type="button"
//             onClick={onSave}
//         >
//             Save
//         </button>
//     );
// };
//
// A normal server-side function cannot simply be passed as `onSave` from a Server Component.

// ---------------------------------------------------------------------
// 13. Server Functions are a special case for callable values
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

// A Server Function is a special React-supported server reference.
// It is different from an ordinary JavaScript function.
//
// A Server Function can be marked with `"use server"` in an appropriate server module
// and then passed to a Client Component as a supported callable value.

// ---------------------------------------------------------------------
// 14. JSX can cross the boundary
// ---------------------------------------------------------------------

interface ShellProps {
  readonly children: ReactNode;
}

export const Shell: FC<ShellProps> = ({ children }): ReactElement => {
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

// JSX elements are supported values across the Server-Client boundary.
// This enables Server Components to provide content to a Client Component
// without the Client Component directly importing those Server Components.

// ---------------------------------------------------------------------
// 15. Server-generated children can remain server-side
// ---------------------------------------------------------------------

export const ServerContent: FC = (): ReactElement => {
  return (
    <article>
      <h2>Server Content</h2>
      <p>This JSX was created by a Server Component.</p>
    </article>
  );
};

export const ClientShell: FC<ShellProps> = ({ children }): ReactElement => {
  const [visible, setVisible] = useState(true);

  return (
    <section>
      <button type="button" onClick={() => setVisible((value) => !value)}>
        {visible ? "Hide content" : "Show content"}
      </button>

      {visible && children}
    </section>
  );
};

// Conceptually, a Server Component can render:
//
// <ClientShell>
//     <ServerContent />
// </ClientShell>
//
// `ClientShell` owns the client-side interaction.
// `ServerContent` can remain a Server Component because the server created its JSX
// and passed that JSX through `children`.

// ---------------------------------------------------------------------
// 16. The render tree and module tree are different
// ---------------------------------------------------------------------

export const SharedComponent: FC<{
  readonly title: string;
}> = ({ title }): ReactElement => {
  return <h2>{title}</h2>;
};

// `"use client"` defines a boundary in the module dependency tree.
// Server/Client Component classification describes component usages in the render tree.
//
// Therefore, a component definition without `"use client"` can have:
// - a Server Component usage when reached from server code
// - a Client Component usage when reached from client code

// ---------------------------------------------------------------------
// 17. Parent-child relationships do not automatically determine the environment
// ---------------------------------------------------------------------

export const ClientContainer: FC<ShellProps> = ({ children }): ReactElement => {
  return <section>{children}</section>;
};

export const ClientChildExample: FC = (): ReactElement => {
  return (
    <ClientContainer>
      <SharedComponent title="Example" />
    </ClientContainer>
  );
};

// A Client Component can receive Server Component JSX through props.
// The fact that the JSX appears as a child in the Client Component's output
// does not automatically turn that Server Component usage into client code.

// ---------------------------------------------------------------------
// 18. Client modules include their transitive dependencies
// ---------------------------------------------------------------------

export const normalizeName = (name: string): string => {
  return name.trim();
};

export const NameEditor: FC<{
  readonly initialName: string;
}> = ({ initialName }): ReactElement => {
  const [name, setName] = useState(normalizeName(initialName));

  return (
    <label>
      Name
      <input value={name} onChange={(event) => setName(event.target.value)} />
    </label>
  );
};

// `normalizeName` is not itself interactive.
// Nevertheless, because it is imported into client-marked code,
// it belongs to the client module subtree.

// ---------------------------------------------------------------------
// 19. The boundary also affects dependencies of dependencies
// ---------------------------------------------------------------------

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const ProductEditor: FC<{
  readonly price: number;
}> = ({ price }): ReactElement => {
  const [quantity, setQuantity] = useState(1);

  return (
    <section>
      <p>{formatPrice(price)}</p>

      <button type="button" onClick={() => setQuantity((value) => value + 1)}>
        Quantity: {quantity}
      </button>
    </section>
  );
};

// If `ProductEditor` imports another module, and that module imports another module,
// those transitive dependencies can become part of the client module subtree as well.

// ---------------------------------------------------------------------
// 20. Keep server-only dependencies outside the client subtree
// ---------------------------------------------------------------------

// A Server Component might import a server-only module:
//
// import {readFile} from "node:fs/promises";
//
// export const ServerDocument = async (): Promise<ReactElement> => {
//     const content = await readFile("/example/content.txt", "utf8");
//
//     return <article>{content}</article>;
// };
//
// That server-only dependency should not be imported by a Client Component module.
//
// Once a server-only module is pulled into a client dependency subtree,
// the application can no longer treat that dependency as server-only.

// ---------------------------------------------------------------------
// 21. Server Components can prepare client props
// ---------------------------------------------------------------------

interface DashboardData {
  readonly userName: string;
  readonly itemCount: number;
}

export const DashboardControls: FC<DashboardData> = ({ userName, itemCount }): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <h2>{userName}</h2>
      <p>Items: {itemCount}</p>

      <button type="button" onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Collapse" : "Expand"}
      </button>
    </section>
  );
};

// A Server Component can perform data access and pass only the values required by
// the Client Component. This keeps server-only data sources outside the client subtree.

// ---------------------------------------------------------------------
// 22. Passing a server-side object does not expose its implementation
// ---------------------------------------------------------------------

interface Account {
  readonly name: string;
  readonly email: string;
}

interface AccountPanelProps {
  readonly account: Account;
}

export const AccountPanel: FC<AccountPanelProps> = ({ account }): ReactElement => {
  return (
    <section>
      <h2>{account.name}</h2>
      <p>{account.email}</p>
    </section>
  );
};

// The serialized value crosses the boundary.
// The Server Component's local variables, imports, database connections,
// and other server-only implementation details do not become Client Component props.

// ---------------------------------------------------------------------
// 23. Promises can cross the boundary
// ---------------------------------------------------------------------

interface MessageProps {
  readonly messagePromise: Promise<string>;
}

export const MessageReader: FC<MessageProps> = ({ messagePromise }): ReactElement => {
  return <p>A Promise can be passed across the boundary and read with `use`.</p>;
};

// React supports Promises as Server-to-Client values.
// A Client Component can pass the Promise to `use`, usually within a Suspense boundary,
// to read its resolved value.

// ---------------------------------------------------------------------
// 24. Context is different from passing serializable props
// ---------------------------------------------------------------------

export const ClientContextConsumer: FC = (): ReactElement => {
  return (
    <section>
      <p>Client context is managed inside the client component tree.</p>
    </section>
  );
};

// A Client Component can use client-side context.
// Server Components should not depend on ordinary client-side context APIs for their
// server execution model.

// ---------------------------------------------------------------------
// 25. Third-party Client Components can establish boundaries
// ---------------------------------------------------------------------

export const ThirdPartyWrapper: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  return <div>{children}</div>;
};

// A third-party component that uses client-only React APIs can itself be marked
// with `"use client"` by the library author.
//
// If a library does not provide an appropriate client boundary, an application
// can introduce a small Client Component wrapper around the library component.

// ---------------------------------------------------------------------
// 26. A Client Component module does not need `"use client"` on every dependency
// ---------------------------------------------------------------------

export const ButtonLabel: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  return <span>{children}</span>;
};

export const ActionButton: FC = (): ReactElement => {
  const [active, setActive] = useState(false);

  return (
    <button type="button" onClick={() => setActive((value) => !value)}>
      <ButtonLabel>{active ? "Active" : "Inactive"}</ButtonLabel>
    </button>
  );
};

// `ButtonLabel` does not need its own directive.
// It is already within the client module subtree because `ActionButton` imports it
// from the same client-marked module.

// ---------------------------------------------------------------------
// 27. Keep the client boundary as close as practical to interactivity
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

export const InteractiveControls: FC = (): ReactElement => {
  const [active, setActive] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setActive((value) => !value)}>
        {active ? "Enabled" : "Disabled"}
      </button>
    </section>
  );
};

// A common architecture is:
//
// Server Component
// ├── static content
// └── Client Component
//     └── interactive behavior
//
// This can keep the client module subtree focused on code that actually requires
// browser-side execution.

// ---------------------------------------------------------------------
// 28. A large client boundary can pull in unnecessary dependencies
// ---------------------------------------------------------------------

export const LargeClientPage: FC = (): ReactElement => {
  return (
    <main>
      <StaticHeader title="Example Application" />
      <InteractiveControls />
    </main>
  );
};

// If a large module tree is marked as client code merely because one small part is interactive,
// more code can become part of the client bundle than necessary.
//
// Splitting server and client responsibilities can keep the client dependency subtree smaller.

// ---------------------------------------------------------------------
// 29. The boundary is not the same as hydration
// ---------------------------------------------------------------------

export const HydratableCounter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
};

// `"use client"` identifies client code in an RSC module graph.
// Hydration is a separate process that activates React behavior on existing server-generated HTML.
//
// An application can use Client Components without reducing the concepts to the same thing as hydration.

// ---------------------------------------------------------------------
// 30. The boundary is not the same as server rendering
// ---------------------------------------------------------------------

export const ClientRenderableContent: FC = (): ReactElement => {
  return (
    <p>
      This component is client-marked but can still participate in initial server rendering within an RSC application.
    </p>
  );
};

// `"use client"` marks the module as client code.
// It does not simply mean that the component can never appear in server-produced initial output.
// The framework can render the surrounding application and coordinate the client boundary.

// ---------------------------------------------------------------------
// 31. Complete server-client boundary example
// ---------------------------------------------------------------------

interface AccountData {
  readonly name: string;
  readonly email: string;
  readonly itemCount: number;
}

export const AccountControls: FC<AccountData> = ({ name, email, itemCount }): ReactElement => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  return (
    <section>
      <h2>{name}</h2>
      <p>{email}</p>
      <p>Items: {itemCount}</p>

      <button type="button" onClick={() => setDetailsVisible((value) => !value)}>
        {detailsVisible ? "Hide details" : "Show details"}
      </button>

      {detailsVisible && <p>Additional interactive content.</p>}
    </section>
  );
};

// A Server Component could conceptually provide:
//
// const account = await getAccount();
//
// return (
//     <AccountControls
//         name={account.name}
//         email={account.email}
//         itemCount={account.itemCount}
//     />
// );
//
// The server owns data access.
// The client owns interactive state.
// The boundary carries only the supported values required by the client component.

// ---------------------------------------------------------------------
// 32. Complete composition with server-generated children
// ---------------------------------------------------------------------

export const InteractiveFrame: FC<{
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

export const ServerGeneratedContent: FC = (): ReactElement => {
  return (
    <article>
      <h2>Example Article</h2>
      <p>This content can be generated by the Server Component side.</p>
    </article>
  );
};

export const CompleteComposition: FC = (): ReactElement => {
  return (
    <InteractiveFrame>
      <ServerGeneratedContent />
    </InteractiveFrame>
  );
};

// The server creates the JSX for `ServerGeneratedContent`.
// The client boundary receives that JSX through `children`.
// The client does not need to import the server module.

// ---------------------------------------------------------------------
// 33. Boundary rules
// ---------------------------------------------------------------------

export const BoundaryRules: FC = (): ReactElement => {
  return (
    <ul>
      <li>Server Components can render Client Components.</li>

      <li>Client Components cannot directly import Server Components.</li>

      <li>Supported values can cross from server to client.</li>

      <li>Server-generated JSX can cross as a supported React element value.</li>

      <li>Ordinary server-side functions cannot cross as normal props.</li>

      <li>Client module dependencies belong to the client subtree.</li>
    </ul>
  );
};

// These rules describe the direction and contents of the Server-Client boundary.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The Server-Client boundary separates server-run code from client-run code in an RSC application.
// - `"use client"` marks a module and its transitive dependencies as client code.
// - `"use client"` must appear before imports and other executable code.
// - A Client Component can import other client-marked or transitive client dependencies normally.
// - A Server Component can import and render a Client Component.
// - A Client Component cannot directly import a Server Component module.
// - Server Components can pass supported serializable values to Client Components.
// - Supported boundary values include primitives, arrays, plain objects, Date, supported iterables, Promises, JSX, and Server Functions.
// - Ordinary JavaScript functions are not normal serializable Server-to-Client props.
// - Server Functions are a special supported mechanism for passing callable server references.
// - Server-generated JSX can be passed to Client Components through `children` or other supported JSX props.
// - The module dependency graph determines the client code subtree created by `"use client"`.
// - The render tree determines whether a particular component usage is considered a Server or Client Component.
// - A component definition without `"use client"` can have both Server Component and Client Component usages in different parts of an application.
// - A parent-child relationship in the render tree does not by itself determine whether both usages run in the same environment.
// - Server-only dependencies should remain outside the client module subtree.
// - Keeping client boundaries focused can reduce the amount of code that must be bundled and evaluated by the browser.
// - The Server-Client boundary is distinct from server rendering and hydration.
