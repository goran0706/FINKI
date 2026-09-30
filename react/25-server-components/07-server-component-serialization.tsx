/**
 * Server Component Serialization
 * ==============================
 *
 * Values passed from Server Components to Client Components cross the Server-Client boundary and
 * therefore must use React's supported serialization model. React supports primitives, iterables
 * containing serializable values, Date, plain objects, Server Functions, React elements, and
 * Promises, while ordinary functions, classes, and unsupported class instances cannot cross the
 * boundary as Client Component props.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Serializable primitive values
// ---------------------------------------------------------------------

interface PrimitiveProps {
  readonly text: string;
  readonly count: number;
  readonly enabled: boolean;
  readonly value: bigint;
  readonly empty: null;
  readonly missing: undefined;
}

const primitiveProps: PrimitiveProps = {
  text: "Hello",
  count: 42,
  enabled: true,
  value: 123n,
  empty: null,
  missing: undefined,
};

// Strings, numbers, bigint, booleans, undefined, and null are supported
// values when passed from a Server Component to a Client Component.

// ---------------------------------------------------------------------
// 2. Globally registered symbols
// ---------------------------------------------------------------------

const registeredSymbol = Symbol.for("example");

interface SymbolProps {
  readonly value: symbol;
}

const symbolProps: SymbolProps = {
  value: registeredSymbol,
};

// Symbols registered through `Symbol.for` are supported.
// The symbol must belong to the global symbol registry.

// ---------------------------------------------------------------------
// 3. Local symbols are not serializable
// ---------------------------------------------------------------------

const localSymbol = Symbol("example");

// This value is not supported:
//
// const invalidSymbolProps = {
//     value: localSymbol,
// };
//
// `Symbol("example")` creates a symbol that is not registered in the global symbol registry.

// ---------------------------------------------------------------------
// 4. Arrays of serializable values
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

const products: readonly Product[] = [
  {
    id: "product-001",
    name: "Example Product",
    price: 49.99,
  },
  {
    id: "product-002",
    name: "Another Product",
    price: 79.99,
  },
];

interface ProductListProps {
  readonly products: readonly Product[];
}

const productListProps: ProductListProps = {
  products,
};

// Arrays are supported when their contents are themselves serializable.

// ---------------------------------------------------------------------
// 5. Nested plain objects
// ---------------------------------------------------------------------

interface Address {
  readonly city: string;
  readonly country: string;
}

interface Customer {
  readonly name: string;
  readonly email: string;
  readonly address: Address;
}

const customer: Customer = {
  name: "John Doe",
  email: "john@example.com",
  address: {
    city: "Tetovo",
    country: "North Macedonia",
  },
};

// Plain objects can contain nested serializable values.
// Every nested property must also use a supported value.

// ---------------------------------------------------------------------
// 6. Plain objects are different from class instances
// ---------------------------------------------------------------------

const plainProduct = {
  id: "product-003",
  name: "Example Product",
  price: 29.99,
};

// Objects created with object initializers and serializable properties are supported.
//
// A class instance is different:
//
// class ProductRecord {
//     constructor(
//         readonly id: string,
//         readonly name: string,
//     ) {}
// }
//
// const productRecord = new ProductRecord(
//     "product-004",
//     "Example Product",
// );
//
// `productRecord` is not a supported Server-to-Client prop value.

// ---------------------------------------------------------------------
// 7. Date values
// ---------------------------------------------------------------------

interface EventDetails {
  readonly name: string;
  readonly startsAt: Date;
}

const eventDetails: EventDetails = {
  name: "Example Event",
  startsAt: new Date("2026-10-01T10:00:00Z"),
};

// `Date` is a supported built-in value.
// React preserves it as a Date when the value crosses the Server-Client boundary.

// ---------------------------------------------------------------------
// 8. Map values
// ---------------------------------------------------------------------

const productMap = new Map<string, number>([
  ["product-001", 49.99],
  ["product-002", 79.99],
]);

interface ProductMapProps {
  readonly products: Map<string, number>;
}

const productMapProps: ProductMapProps = {
  products: productMap,
};

// Map is supported when its keys and values are serializable.

// ---------------------------------------------------------------------
// 9. Set values
// ---------------------------------------------------------------------

const categorySet = new Set<string>(["technology", "design", "development"]);

interface CategoryProps {
  readonly categories: Set<string>;
}

const categoryProps: CategoryProps = {
  categories: categorySet,
};

// Set is supported when its values are serializable.

// ---------------------------------------------------------------------
// 10. Typed arrays
// ---------------------------------------------------------------------

const scores = new Uint8Array([10, 20, 30]);

interface ScoreProps {
  readonly scores: Uint8Array;
}

const scoreProps: ScoreProps = {
  scores,
};

// TypedArray values are supported by the Server Components serialization model.
// ArrayBuffer is also supported.

// ---------------------------------------------------------------------
// 11. ArrayBuffer
// ---------------------------------------------------------------------

const buffer = new ArrayBuffer(8);

interface BufferProps {
  readonly buffer: ArrayBuffer;
}

const bufferProps: BufferProps = {
  buffer,
};

// ArrayBuffer is a supported serializable built-in value.

// ---------------------------------------------------------------------
// 12. Strings are also iterable
// ---------------------------------------------------------------------

interface LabelProps {
  readonly label: string;
}

const labelProps: LabelProps = {
  label: "Example",
};

// A string is already supported as a primitive.
// The iterable serialization rule also covers supported iterable values.

// ---------------------------------------------------------------------
// 13. Iterables must contain serializable values
// ---------------------------------------------------------------------

const validEntries = new Map<
  string,
  {
    readonly label: string;
  }
>([
  [
    "first",
    {
      label: "Example",
    },
  ],
]);

// `Map` is supported because both its keys and values are serializable.
//
// An iterable containing unsupported values is not made valid merely because
// the outer iterable itself is supported.

// ---------------------------------------------------------------------
// 14. React elements can cross the boundary
// ---------------------------------------------------------------------

const serverGeneratedElement: ReactElement = (
  <article>
    <h2>Example Article</h2>
    <p>This JSX was created by a Server Component.</p>
  </article>
);

interface ContentProps {
  readonly content: ReactNode;
}

const contentProps: ContentProps = {
  content: serverGeneratedElement,
};

// React elements are supported values across the Server-Client boundary.
// This enables Server Components to provide JSX to Client Components.

// ---------------------------------------------------------------------
// 15. JSX can be passed through children
// ---------------------------------------------------------------------

const serverGeneratedContent = (
  <section>
    <h2>Server Content</h2>
    <p>This content was generated on the server.</p>
  </section>
);

interface ShellProps {
  readonly children: ReactNode;
}

const shellProps: ShellProps = {
  children: serverGeneratedContent,
};

// A Server Component can conceptually render:
//
// <ClientShell>
//     <ServerContent />
// </ClientShell>
//
// The resulting JSX can cross the boundary as a supported React element value.

// ---------------------------------------------------------------------
// 16. Server Components can pass JSX as named props
// ---------------------------------------------------------------------

interface LayoutProps {
  readonly header: ReactNode;
  readonly content: ReactNode;
}

const layoutProps: LayoutProps = {
  header: (
    <header>
      <h1>Example Application</h1>
    </header>
  ),
  content: (
    <main>
      <p>Example content.</p>
    </main>
  ),
};

// JSX does not have to be passed only through `children`.
// A React element can be supplied through another supported prop.

// ---------------------------------------------------------------------
// 17. Promises can cross the boundary
// ---------------------------------------------------------------------

const messagePromise: Promise<string> = Promise.resolve("Hello from the server.");

interface MessageProps {
  readonly message: Promise<string>;
}

const messageProps: MessageProps = {
  message: messagePromise,
};

// Promises are supported values.
// A Client Component can receive the Promise and read it with `use`,
// typically within a Suspense boundary.

// ---------------------------------------------------------------------
// 18. A Server Component can start async work without awaiting it
// ---------------------------------------------------------------------

async function getComments(): Promise<readonly string[]> {
  return ["First comment", "Second comment"];
}

export const CommentsPage = async (): Promise<ReactElement> => {
  const commentsPromise = getComments();

  return (
    <section>
      <h1>Comments</h1>

      {/* A Client Component could receive `commentsPromise` as a prop. */}
    </section>
  );
};

// This pattern can allow a Server Component to start asynchronous work and pass the Promise
// to a Client Component, which can consume it with `use` while Suspense controls the UI.

// ---------------------------------------------------------------------
// 19. Server Functions are supported function values
// ---------------------------------------------------------------------

// In an application using Server Functions, a supported Server Function can cross
// the Server-Client boundary:
//
// async function saveMessage(message: string): Promise<void> {
//     "use server";
//
//     // Server-side mutation.
// }
//
// <ClientForm action={saveMessage} />
//
// A Server Function is a special React-supported function reference.
// It is not equivalent to an ordinary JavaScript function.

// ---------------------------------------------------------------------
// 20. Ordinary functions are not serializable
// ---------------------------------------------------------------------

const formatName = (name: string): string => {
  return name.trim();
};

// This cannot be passed as a normal Server-to-Client prop:
//
// const invalidProps = {
//     formatName,
// };
//
// Ordinary JavaScript functions are not supported as Server Component props.
// A function crossing the boundary must be a supported Server Function.

// ---------------------------------------------------------------------
// 21. Component functions are not serializable
// ---------------------------------------------------------------------

const ExampleComponent: FC = (): ReactElement => {
  return <p>Example</p>;
};

// This component function itself cannot be passed as a normal prop:
//
// const invalidComponentProp = {
//     component: ExampleComponent,
// };
//
// React elements are serializable.
// Component function objects are not normal serializable prop values.

// ---------------------------------------------------------------------
// 22. Classes are not serializable
// ---------------------------------------------------------------------

class UserRecord {
  public constructor(
    public readonly name: string,
    public readonly email: string,
  ) {}
}

const userRecord = new UserRecord("John Doe", "john@example.com");

// `UserRecord` is a class instance and cannot be passed as a normal
// Server-to-Client prop.
//
// Convert it to a supported plain object instead:
//
// const serializableUser = {
//     name: userRecord.name,
//     email: userRecord.email,
// };

// ---------------------------------------------------------------------
// 23. Custom class instances are different from supported built-ins
// ---------------------------------------------------------------------

class Money {
  public constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {}
}

const price = new Money(49.99, "USD");

// `Money` is not a supported serializable value.
// Supported built-ins such as Date, Map, Set, ArrayBuffer, and TypedArray
// have explicit support, while arbitrary class instances do not.

// ---------------------------------------------------------------------
// 24. Null-prototype objects are not supported
// ---------------------------------------------------------------------

const nullPrototypeObject = Object.create(null) as {
  readonly name: string;
};

nullPrototypeObject.name = "John Doe";

// Objects with a null prototype are not supported as normal Server-to-Client props.
//
// Prefer a normal object initializer:
//
// const supportedObject = {
//     name: "John Doe",
// };

// ---------------------------------------------------------------------
// 25. Serialization is recursive
// ---------------------------------------------------------------------

interface Profile {
  readonly name: string;
  readonly createdAt: Date;
  readonly tags: readonly string[];
}

const profile: Profile = {
  name: "John Doe",
  createdAt: new Date("2026-09-29T00:00:00Z"),
  tags: ["react", "typescript"],
};

// The outer object, Date, array, and strings are all supported.
// Serialization therefore works recursively through the complete value.

// ---------------------------------------------------------------------
// 26. One unsupported nested value makes the structure invalid
// ---------------------------------------------------------------------

const invalidProfile = {
  name: "John Doe",
  createdAt: new Date(),
  formatName,
};

// The outer object is plain, but `formatName` is an ordinary function.
// The complete value is therefore not valid as a Server-to-Client prop.

// ---------------------------------------------------------------------
// 27. Serialization is a boundary requirement
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly name: string;
  readonly email: string;
}

const userCardProps: UserCardProps = {
  name: "John Doe",
  email: "john@example.com",
};

// Conceptually:
//
// Server Component
//       |
//       | supported serialized props
//       v
// Client Component
//
// The requirement applies specifically when values cross the Server-Client boundary.
// A purely server-side function call does not require Server Component prop serialization.

// ---------------------------------------------------------------------
// 28. Server-only values can remain server-side
// ---------------------------------------------------------------------

interface ServerRecord {
  readonly id: string;
  readonly name: string;
}

async function getServerRecord(): Promise<ServerRecord> {
  return {
    id: "record-001",
    name: "Example Record",
  };
}

export const ServerRecordPage = async (): Promise<ReactElement> => {
  const record = await getServerRecord();

  return (
    <article>
      <h1>{record.name}</h1>
    </article>
  );
};

// Not every value used by a Server Component needs to cross the boundary.
// Server-only implementation data can remain entirely on the server.

// ---------------------------------------------------------------------
// 29. Select only values that need to cross the boundary
// ---------------------------------------------------------------------

interface PrivateAccountRecord {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly internalNote: string;
}

async function getPrivateAccount(): Promise<PrivateAccountRecord> {
  return {
    id: "account-001",
    name: "John Doe",
    email: "john@example.com",
    internalNote: "Internal example note.",
  };
}

export const AccountPage = async (): Promise<ReactElement> => {
  const account = await getPrivateAccount();

  const publicAccount = {
    name: account.name,
    email: account.email,
  };

  return (
    <section>
      <h1>{publicAccount.name}</h1>
      <p>{publicAccount.email}</p>
    </section>
  );
};

// Serialization determines what can cross the boundary.
// Application design determines what should cross the boundary.
// Sensitive server-side values should not be passed to the client merely because
// their types happen to be serializable.

// ---------------------------------------------------------------------
// 30. Serialization does not make data public by itself
// ---------------------------------------------------------------------

interface PublicProfile {
  readonly name: string;
  readonly email: string;
}

const publicProfile: PublicProfile = {
  name: "John Doe",
  email: "john@example.com",
};

// If a value is passed to a Client Component, it becomes part of the data available
// to client-side code. Serialization support is therefore not a security boundary.

// ---------------------------------------------------------------------
// 31. Dates preserve their semantic type
// ---------------------------------------------------------------------

interface EventProps {
  readonly startsAt: Date;
}

const eventProps: EventProps = {
  startsAt: new Date("2026-10-01T12:00:00Z"),
};

const eventElement = <time dateTime={eventProps.startsAt.toISOString()}>{eventProps.startsAt.toISOString()}</time>;

// A Date is supported directly.
// There is no requirement to convert every Date to a string solely for
// Server Component serialization.

// ---------------------------------------------------------------------
// 32. Map and Set preserve their collection types
// ---------------------------------------------------------------------

const permissions = new Set(["read", "write"]);

const permissionLabels = new Map([
  ["read", "Read access"],
  ["write", "Write access"],
]);

interface PermissionProps {
  readonly permissions: Set<string>;
  readonly labels: Map<string, string>;
}

const permissionProps: PermissionProps = {
  permissions,
  labels: permissionLabels,
};

// Map and Set are explicitly supported built-in collection types.
// Their contained values must also be serializable.

// ---------------------------------------------------------------------
// 33. Typed arrays preserve their supported representation
// ---------------------------------------------------------------------

interface BinaryDataProps {
  readonly bytes: Uint8Array;
  readonly buffer: ArrayBuffer;
}

const binaryDataProps: BinaryDataProps = {
  bytes: new Uint8Array([1, 2, 3]),
  buffer: new ArrayBuffer(4),
};

// TypedArray and ArrayBuffer values are supported by the serialization model.

// ---------------------------------------------------------------------
// 34. React elements can contain serializable props
// ---------------------------------------------------------------------

const productElement = (
  <article>
    <h2>Example Product</h2>
    <p>$49.99</p>
  </article>
);

interface ProductContentProps {
  readonly content: ReactElement;
}

const productContentProps: ProductContentProps = {
  content: productElement,
};

// The React element itself is a supported boundary value.
// Its own props must also be valid for the way that element crosses the boundary.

// ---------------------------------------------------------------------
// 35. Client Components can consume serialized data
// ---------------------------------------------------------------------

// A Client Component could conceptually receive:
//
// "use client";
//
// interface ProductCardProps {
//     readonly product: {
//         readonly id: string;
//         readonly name: string;
//         readonly price: number;
//     };
// }
//
// export const ProductCard = ({
//     product,
// }: ProductCardProps): ReactElement => {
//     return (
//         <article>
//             <h2>{product.name}</h2>
//             <p>${product.price.toFixed(2)}</p>
//         </article>
//     );
// };
//
// The Server Component can then pass:
//
// <ProductCard product={product} />

// ---------------------------------------------------------------------
// 36. Client Components can consume Promise values
// ---------------------------------------------------------------------

// A Client Component could conceptually receive:
//
// "use client";
//
// import {use, type FC, type ReactElement} from "react";
//
// interface CommentsProps {
//     readonly comments: Promise<readonly string[]>;
// }
//
// export const Comments = ({
//     comments,
// }: CommentsProps): ReactElement => {
//     const values = use(comments);
//
//     return (
//         <ul>
//             {values.map((comment) => (
//                 <li key={comment}>
//                     {comment}
//                 </li>
//             ))}
//         </ul>
//     );
// };
//
// The Promise can be created on the server and passed to the Client Component.
// The Client Component uses `use` to read the resolved value.

// ---------------------------------------------------------------------
// 37. Serialization does not mean JSON serialization
// ---------------------------------------------------------------------

const richValue = {
  createdAt: new Date(),
  categories: new Set(["react", "server"]),
  scores: new Uint8Array([10, 20]),
};

// React's Server Components serialization model supports values such as Date, Set,
// and TypedArray directly. This is broader than JSON serialization, which would
// represent these values differently.

// ---------------------------------------------------------------------
// 38. JSON-compatible values are only a subset
// ---------------------------------------------------------------------

const jsonCompatibleValue = {
  name: "John Doe",
  age: 30,
  active: true,
  tags: ["react", "typescript"],
};

// JSON-compatible plain data is naturally suitable for the boundary.
// However, the React serialization model supports additional values such as Date,
// Map, Set, TypedArray, ArrayBuffer, Promise, JSX, and Server Functions.

// ---------------------------------------------------------------------
// 39. Unsupported values should be converted deliberately
// ---------------------------------------------------------------------

interface SerializableUser {
  readonly name: string;
  readonly email: string;
}

const userRecordForBoundary = new UserRecord("John Doe", "john@example.com");

const serializableUser: SerializableUser = {
  name: userRecordForBoundary.name,
  email: userRecordForBoundary.email,
};

// Instead of passing a custom class instance, extract the supported data
// required by the Client Component.

// ---------------------------------------------------------------------
// 40. Serialization and Server Functions are related but distinct
// ---------------------------------------------------------------------

// Server Component props support:
//
// - serializable data
// - Server Functions
// - React elements
// - Promises
//
// Server Function arguments have a related but not identical serialization model.
// For example, FormData is supported as a Server Function argument, while React elements
// are not supported as Server Function arguments.
//
// Do not treat the two serialization lists as interchangeable.

// ---------------------------------------------------------------------
// 41. Serialization and Server Component rendering
// ---------------------------------------------------------------------

export const SerializationExample = async (): Promise<ReactElement> => {
  const user = await getUser();

  const data = {
    name: user.name,
    email: user.email,
    registeredAt: new Date(),
  };

  return (
    <article>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
      <time dateTime={data.registeredAt.toISOString()}>{data.registeredAt.toISOString()}</time>
    </article>
  );
};

// The Server Component can freely use ordinary server-side values internally.
// Serialization becomes relevant when values are transferred across the
// Server-Client boundary.

// ---------------------------------------------------------------------
// 42. Complete boundary example
// ---------------------------------------------------------------------

interface DashboardData {
  readonly user: {
    readonly name: string;
    readonly email: string;
  };
  readonly products: readonly {
    readonly id: string;
    readonly name: string;
    readonly price: number;
  }[];
  readonly generatedAt: Date;
}

export const DashboardPage = async (): Promise<ReactElement> => {
  const [user, products] = await Promise.all([getUser(), getProducts()]);

  const dashboardData: DashboardData = {
    user: {
      name: user.name,
      email: user.email,
    },
    products,
    generatedAt: new Date(),
  };

  return (
    <main>
      <h1>{dashboardData.user.name}</h1>

      <p>{dashboardData.user.email}</p>

      <time dateTime={dashboardData.generatedAt.toISOString()}>{dashboardData.generatedAt.toISOString()}</time>

      <ul>
        {dashboardData.products.map((product) => (
          <li key={product.id}>
            {product.name}: ${product.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </main>
  );
};

// A real Server Component could pass `dashboardData` to a Client Component if the
// receiving props are designed around the supported serialization model.

// ---------------------------------------------------------------------
// 43. Serialization rules at a glance
// ---------------------------------------------------------------------

const supportedValues = {
  primitives: ["string", "number", "bigint", "boolean", "undefined", "null", "Symbol.for(...)"],
  iterables: ["String", "Array", "Map", "Set", "TypedArray", "ArrayBuffer"],
  builtIns: ["Date"],
  specialValues: ["Server Function", "React element", "Promise"],
};

// This object is only a readable summary of the categories.
// The actual value must still satisfy React's recursive serialization rules.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Values passed from Server Components to Client Components must use React's supported serialization model.
// - Supported primitives include string, number, bigint, boolean, undefined, null, and globally registered symbols.
// - `Symbol.for(...)` is supported, while `Symbol(...)` is not.
// - Arrays are supported when their contents are serializable.
// - Map and Set are supported when their contained values are serializable.
// - TypedArray and ArrayBuffer values are supported.
// - Date is a supported built-in value.
// - Plain objects with serializable properties are supported.
// - React elements and JSX are supported boundary values.
// - Promises can cross the Server-Client boundary and can be consumed by Client Components with `use`.
// - Server Functions are supported callable values across the Server-Client boundary.
// - Ordinary JavaScript functions are not serializable Server-to-Client props.
// - Component function objects are not ordinary serializable prop values.
// - Classes and arbitrary class instances are not supported.
// - Objects with a null prototype are not supported.
// - Serialization is recursive, so every nested value must satisfy the supported value rules.
// - A value being serializable does not mean it should be exposed to client-side code.
// - Sensitive server-side data should remain on the server even when its type is technically serializable.
// - Serialization at the Server-Client boundary is broader than JSON serialization.
// - Server Component prop serialization and Server Function argument serialization are related but have different supported-value sets.
