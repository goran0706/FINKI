/**
 * Module Public API
 * ==================
 *
 * A module public API defines the types, values, functions, and components that a module
 * intentionally exposes to its consumers. A well-designed public API keeps the exposed
 * surface small and stable while allowing internal implementation details to change freely.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Public API concept
// ---------------------------------------------------------------------

// A module can contain:
//
// - public exports
// - private implementation details
// - internal helpers
// - internal types
//
// Only intentionally exported declarations should form the module's public contract.
//
// Consumer
//     ↓
// Public API
//     ↓
// Private implementation

// ---------------------------------------------------------------------
// 2. Public versus private declarations
// ---------------------------------------------------------------------

export interface UserSummary {
  readonly id: string;
  readonly displayName: string;
}

const normalizeDisplayName = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

export const createUserSummary = (id: string, displayName: string): UserSummary => {
  return {
    id,
    displayName: normalizeDisplayName(displayName),
  };
};

// UserSummary and createUserSummary are public.
// normalizeDisplayName is private.
//
// Consumers depend on the public declarations without knowing how normalization works.

// ---------------------------------------------------------------------
// 3. Public API as a contract
// ---------------------------------------------------------------------

// Once consumers import:
//
// import {createUserSummary} from "...";
//
// the exported function becomes part of the module contract.
//
// Consumers can depend on:
//
// - its name
// - its parameters
// - its return type
// - its observable behavior
//
// Internal implementation can change as long as the contract remains valid.

// ---------------------------------------------------------------------
// 4. Explicit named exports
// ---------------------------------------------------------------------

export const formatUserName = (user: UserSummary): string => {
  return user.displayName;
};

export const isUserSummary = (value: unknown): value is UserSummary => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<UserSummary>;

  return typeof candidate.id === "string" && typeof candidate.displayName === "string";
};

// Named exports make the public surface explicit.
// Consumers can import exactly the capabilities they need.

// ---------------------------------------------------------------------
// 5. Private helpers
// ---------------------------------------------------------------------

const normalizeId = (id: string): string => {
  return id.trim().toLowerCase();
};

export const createNormalizedUser = (id: string, displayName: string): UserSummary => {
  return {
    id: normalizeId(id),
    displayName: normalizeDisplayName(displayName),
  };
};

// normalizeId is intentionally not exported.
// The implementation can be changed without requiring consumers to update imports.

// ---------------------------------------------------------------------
// 6. Small public APIs
// ---------------------------------------------------------------------

export interface Pagination {
  readonly page: number;
  readonly pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 20;

export const normalizePagination = (pagination: Pagination): Pagination => {
  return {
    page: Math.max(1, pagination.page),
    pageSize: Math.min(100, Math.max(1, pagination.pageSize)),
  };
};

// A small public surface is easier to understand, test, document, and evolve.

// ---------------------------------------------------------------------
// 7. Avoid exporting everything
// ---------------------------------------------------------------------

// Avoid:
//
// export const internalParser = ...
// export const internalValidator = ...
// export const internalFormatter = ...
// export const internalCache = ...
//
// if consumers do not actually need those declarations.
//
// Every export creates another potential dependency.

// ---------------------------------------------------------------------
// 8. Every export is a potential contract
// ---------------------------------------------------------------------

export const calculateTax = (amountInCents: number, rate: number): number => {
  return Math.round(amountInCents * rate);
};

// Once exported, calculateTax can become depended upon by multiple consumers.
// Removing or changing it may therefore require coordinated changes.

// ---------------------------------------------------------------------
// 9. Public API and implementation freedom
// ---------------------------------------------------------------------

const calculateTaxUsingIntegerMath = (amountInCents: number, rate: number): number => {
  return Math.round(amountInCents * rate);
};

export const calculateTaxV2 = (amountInCents: number, rate: number): number => {
  return calculateTaxUsingIntegerMath(amountInCents, rate);
};

// Consumers depend on calculateTaxV2.
// They do not depend on calculateTaxUsingIntegerMath.
//
// The implementation can later be replaced without changing the consumer-facing API.

// ---------------------------------------------------------------------
// 10. Public API and semantic compatibility
// ---------------------------------------------------------------------

// A public API can remain type-compatible while still breaking consumers.
//
// For example:
//
// formatPrice(1200)
//     "$12.00"
//
// changing to:
//
// formatPrice(1200)
//     "12 USD"
//
// may preserve the same TypeScript signature,
// but it changes observable behavior.
//
// Public APIs therefore include semantics, not only types.

// ---------------------------------------------------------------------
// 11. Public type design
// ---------------------------------------------------------------------

export interface ProductSummary {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

// Public types should expose the information consumers actually need.
// Avoid exposing internal fields merely because they currently exist.

// ---------------------------------------------------------------------
// 12. Internal implementation types
// ---------------------------------------------------------------------

interface ProductRecord {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
  readonly internalVersion: number;
}

const toProductSummary = (record: ProductRecord): ProductSummary => {
  return {
    id: record.id,
    name: record.name,
    priceInCents: record.priceInCents,
  };
};

export const getProductSummary = (record: ProductRecord): ProductSummary => {
  return toProductSummary(record);
};

// The public result does not expose internalVersion.
// Internal representation can therefore evolve independently.

// ---------------------------------------------------------------------
// 13. Public API versus implementation representation
// ---------------------------------------------------------------------

// Public representation:
//
// ProductSummary
// ├── id
// ├── name
// └── priceInCents
//
// Internal representation:
//
// ProductRecord
// ├── id
// ├── name
// ├── priceInCents
// └── internalVersion
//
// The public API does not need to mirror internal storage.

// ---------------------------------------------------------------------
// 14. Public functions should express intent
// ---------------------------------------------------------------------

export const findProduct = (products: readonly ProductSummary[], productId: string): ProductSummary | null => {
  return products.find((product) => product.id === productId) ?? null;
};

// findProduct expresses what consumers need.
// Consumers do not need to know how the search is implemented.

// ---------------------------------------------------------------------
// 15. Hide implementation algorithms
// ---------------------------------------------------------------------

const findProductByLinearSearch = (products: readonly ProductSummary[], productId: string): ProductSummary | null => {
  for (const product of products) {
    if (product.id === productId) {
      return product;
    }
  }

  return null;
};

export const lookupProduct = (products: readonly ProductSummary[], productId: string): ProductSummary | null => {
  return findProductByLinearSearch(products, productId);
};

// The algorithm is private.
// It can later change to a map, index, cache, or another strategy
// without changing the public lookupProduct contract.

// ---------------------------------------------------------------------
// 16. Public API and dependency direction
// ---------------------------------------------------------------------

// Consumers should depend on the public API:
//
// Feature
//    ↓
// Public API
//    ↓
// Private implementation
//
// They should not reach into internal implementation files merely because
// those files happen to be accessible in the source tree.

// ---------------------------------------------------------------------
// 17. Internal modules
// ---------------------------------------------------------------------

// A module can be internally decomposed:
//
// products/
// ├── index.ts
// ├── parser.ts
// ├── validation.ts
// ├── formatting.ts
// └── repository.ts
//
// The public entry point can expose only the declarations intended for consumers.
//
// Internal source organization should not automatically become public architecture.

// ---------------------------------------------------------------------
// 18. Public entry point
// ---------------------------------------------------------------------

// Conceptually:
//
// products/index.ts
//
// export {ProductCard} from "./ProductCard";
// export {findProduct} from "./findProduct";
// export type {ProductSummary} from "./types";
//
// Consumers import from the public entry point instead of private implementation files.

// ---------------------------------------------------------------------
// 19. Public API with explicit re-exports
// ---------------------------------------------------------------------

export interface ProductCardData {
  readonly id: string;
  readonly name: string;
}

export const getProductCardLabel = (product: ProductCardData): string => {
  return product.name;
};

// An entry module can selectively re-export these declarations:
//
// export {
//     getProductCardLabel
// } from "./product-card";
//
// export type {
//     ProductCardData
// } from "./product-card";

// ---------------------------------------------------------------------
// 20. Type-only public exports
// ---------------------------------------------------------------------

export interface UserId {
  readonly value: string;
}

export type UserRole = "admin" | "editor" | "viewer";

// Types can be part of the public API without creating runtime exports.
// Consumers can depend on these compile-time contracts.

// ---------------------------------------------------------------------
// 21. Type-only imports by consumers
// ---------------------------------------------------------------------

// A consumer can use:
//
// import {
//     type UserId,
//     type UserRole
// } from "...";
//
// when it only needs the types.
//
// This communicates that the dependency is compile-time only.

// ---------------------------------------------------------------------
// 22. Public API and React components
// ---------------------------------------------------------------------

export interface ButtonProps {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
  readonly type?: "button" | "submit" | "reset";
}

export const Button: FC<ButtonProps> = ({ children, disabled = false, onClick, type = "button" }): ReactElement => {
  return (
    <button type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

// ButtonProps and Button form a public React component API.
// Their implementation details remain private to the module.

// ---------------------------------------------------------------------
// 23. Component API surface
// ---------------------------------------------------------------------

// A component's public API includes:
//
// - props
// - children behavior
// - callback semantics
// - supported variants
// - accessibility behavior
// - rendered interaction behavior
//
// It is not limited to the TypeScript interface.

// ---------------------------------------------------------------------
// 24. Narrow component props
// ---------------------------------------------------------------------

export interface AlertProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly tone?: "info" | "warning" | "error";
}

export const Alert: FC<AlertProps> = ({ title, children, tone = "info" }): ReactElement => {
  return (
    <aside data-tone={tone}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
};

// The component exposes only the inputs that consumers actually need.
// Internal rendering decisions remain private.

// ---------------------------------------------------------------------
// 25. Avoid implementation-oriented props
// ---------------------------------------------------------------------

// Avoid exposing props such as:
//
// readonly internalClassNameGenerator: ...
// readonly rendererImplementation: ...
// readonly parser: ...
//
// when consumers only need:
//
// readonly className?: string
// readonly children: ReactNode
//
// Public props should represent consumer intent rather than implementation structure.

// ---------------------------------------------------------------------
// 26. Public callbacks
// ---------------------------------------------------------------------

export interface ProductSelectorProps {
  readonly products: readonly ProductSummary[];
  readonly onSelect: (product: ProductSummary) => void;
}

export const ProductSelector: FC<ProductSelectorProps> = ({ products, onSelect }): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <button type="button" onClick={() => onSelect(product)}>
            {product.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

// The callback is part of the public contract.
// The component does not need to know what selection means to the consumer.

// ---------------------------------------------------------------------
// 27. Public API and composition
// ---------------------------------------------------------------------

export interface PanelProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ title, children }): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

// A composition-oriented API allows consumers to provide content
// without exposing internal layout implementation.

// ---------------------------------------------------------------------
// 28. Public API and controlled components
// ---------------------------------------------------------------------

export interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

export const SearchInput: FC<SearchInputProps> = ({ value, onChange, placeholder }): ReactElement => {
  return <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
};

// The public API exposes state and the state transition contract.
// The component implementation remains free to change.

// ---------------------------------------------------------------------
// 29. Public API and uncontrolled components
// ---------------------------------------------------------------------

export interface UncontrolledSearchInputProps {
  readonly defaultValue?: string;
  readonly placeholder?: string;
  readonly onSearch?: (value: string) => void;
}

export const UncontrolledSearchInput: FC<UncontrolledSearchInputProps> = ({
  defaultValue = "",
  placeholder,
  onSearch,
}): ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const value = String(formData.get("query") ?? "");

    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" defaultValue={defaultValue} placeholder={placeholder} />
      <Button type="submit">Search</Button>
    </form>
  );
};

// Controlled and uncontrolled components expose different public contracts.
// The API should make the ownership model explicit.

// ---------------------------------------------------------------------
// 30. Public API and generic components
// ---------------------------------------------------------------------

export interface ListProps<T> {
  readonly items: readonly T[];
  readonly getKey: (item: T) => string;
  readonly renderItem: (item: T) => ReactNode;
}

export const List = <T,>({ items, getKey, renderItem }: ListProps<T>): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};

// Generic APIs can remain reusable without exposing knowledge of
// any particular feature type.

// ---------------------------------------------------------------------
// 31. Public API and optional properties
// ---------------------------------------------------------------------

export interface AvatarProps {
  readonly name: string;
  readonly src?: string;
  readonly size?: "small" | "medium" | "large";
}

export const Avatar: FC<AvatarProps> = ({ name, src, size = "medium" }): ReactElement => {
  if (src) {
    return <img src={src} alt={name} data-size={size} />;
  }

  return <span data-size={size}>{name.charAt(0)}</span>;
};

// Optional properties are part of the public API contract.
// Their defaults and behavior should therefore be deliberate.

// ---------------------------------------------------------------------
// 32. Public API and defaults
// ---------------------------------------------------------------------

export interface PaginationOptions {
  readonly page?: number;
  readonly pageSize?: number;
}

export const resolvePagination = ({ page = 1, pageSize = DEFAULT_PAGE_SIZE }: PaginationOptions): Pagination => {
  return normalizePagination({
    page,
    pageSize,
  });
};

// Defaults are observable behavior.
// Changing them can affect every consumer of the public API.

// ---------------------------------------------------------------------
// 33. Public API and discriminated unions
// ---------------------------------------------------------------------

export type RequestState<T> =
  | {
      readonly status: "idle";
    }
  | {
      readonly status: "loading";
    }
  | {
      readonly status: "success";
      readonly data: T;
    }
  | {
      readonly status: "error";
      readonly message: string;
    };

// A discriminated union can provide a precise public state contract
// while allowing internal state management to change.

// ---------------------------------------------------------------------
// 34. Public API and domain types
// ---------------------------------------------------------------------

export interface ProductPrice {
  readonly amountInCents: number;
  readonly currency: string;
}

export const createProductPrice = (amountInCents: number, currency: string): ProductPrice => {
  if (amountInCents < 0) {
    throw new Error("Price cannot be negative.");
  }

  return {
    amountInCents,
    currency: currency.trim().toUpperCase(),
  };
};

// A public factory can enforce invariants while keeping construction details controlled.

// ---------------------------------------------------------------------
// 35. Public factory versus raw object construction
// ---------------------------------------------------------------------

// Direct construction:
//
// const price: ProductPrice = {
//     amountInCents: -100,
//     currency: ""
// };
//
// can satisfy the structural type even though the values are invalid.
//
// A factory can establish runtime invariants:
//
// createProductPrice(1200, "USD");

// ---------------------------------------------------------------------
// 36. Public API and invariants
// ---------------------------------------------------------------------

export interface EmailAddress {
  readonly value: string;
}

export const createEmailAddress = (value: string): EmailAddress => {
  const normalized = value.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error("Invalid email address.");
  }

  return {
    value: normalized,
  };
};

// The factory provides a controlled construction boundary.
// The internal validation strategy can change without changing the public API.

// ---------------------------------------------------------------------
// 37. Public API and encapsulation
// ---------------------------------------------------------------------

export class Cart {
  private readonly items = new Map<string, number>();

  public add(productId: string, quantity: number): void {
    const current = this.items.get(productId) ?? 0;

    this.items.set(productId, current + quantity);
  }

  public getQuantity(productId: string): number {
    return this.items.get(productId) ?? 0;
  }
}

// The public API exposes add and getQuantity.
// The internal Map is private.
//
// Consumers depend on behavior rather than storage representation.

// ---------------------------------------------------------------------
// 38. Public API and class internals
// ---------------------------------------------------------------------

// A class can change from:
//
// private Map
//
// to:
//
// private array
//
// or:
//
// private external store
//
// without requiring consumers to change,
// as long as the public behavior remains compatible.

// ---------------------------------------------------------------------
// 39. Public API and read-only exposure
// ---------------------------------------------------------------------

export interface UserProfile {
  readonly id: string;
  readonly displayName: string;
}

export const getUserProfile = (): UserProfile => {
  return {
    id: "user-1",
    displayName: "John Doe",
  };
};

// readonly communicates that consumers should not mutate the returned contract.
// It also clarifies ownership of the values.

// ---------------------------------------------------------------------
// 40. Public API and mutable collections
// ---------------------------------------------------------------------

const internalProducts: ProductSummary[] = [];

export const getProducts = (): readonly ProductSummary[] => {
  return internalProducts;
};

// Returning readonly prevents consumers from mutating the collection
// through the public type.
//
// The implementation retains ownership of the mutable array.

// ---------------------------------------------------------------------
// 41. Public API and defensive copying
// ---------------------------------------------------------------------

export const getProductsSnapshot = (): readonly ProductSummary[] => {
  return [...internalProducts];
};

// A defensive copy provides stronger runtime isolation than readonly alone.
// readonly protects the TypeScript view, while copying protects the underlying array.

// ---------------------------------------------------------------------
// 42. Public API and asynchronous contracts
// ---------------------------------------------------------------------

export interface ProductRepository {
  readonly findById: (productId: string) => Promise<ProductSummary | null>;
}

export const createProductRepository = (products: readonly ProductSummary[]): ProductRepository => {
  return {
    findById: async (productId: string): Promise<ProductSummary | null> => {
      return products.find((product) => product.id === productId) ?? null;
    },
  };
};

// Promise-based behavior is part of the public API.
// Consumers can depend on the asynchronous contract without knowing its implementation.

// ---------------------------------------------------------------------
// 43. Public API and error semantics
// ---------------------------------------------------------------------

export class ProductNotFoundError extends Error {
  public constructor(productId: string) {
    super(`Product ${productId} was not found.`);

    this.name = "ProductNotFoundError";
  }
}

export const requireProduct = (products: readonly ProductSummary[], productId: string): ProductSummary => {
  const product = findProduct(products, productId);

  if (!product) {
    throw new ProductNotFoundError(productId);
  }

  return product;
};

// Whether a function returns null or throws is part of its public behavior.
// Consumers depend on that semantic contract.

// ---------------------------------------------------------------------
// 44. Public API and error stability
// ---------------------------------------------------------------------

// If consumers catch ProductNotFoundError,
// replacing it with an unrelated error type can be a breaking behavioral change.
//
// Error classes and error codes can therefore become part of the public contract.

// ---------------------------------------------------------------------
// 45. Public API and configuration
// ---------------------------------------------------------------------

export interface ClientOptions {
  readonly baseUrl: string;
  readonly timeoutMilliseconds?: number;
}

export const createClient = (options: ClientOptions) => {
  const timeout = options.timeoutMilliseconds ?? 5000;

  return {
    getTimeout: (): number => timeout,
    getBaseUrl: (): string => options.baseUrl,
  };
};

// Configuration objects are public contracts too.
// Defaults and accepted values should be intentionally designed.

// ---------------------------------------------------------------------
// 46. Public API and environment details
// ---------------------------------------------------------------------

// Avoid exposing configuration that only exists because of an internal library:
//
// interface ClientOptions {
//     readonly internalAxiosInstance: unknown;
// }
//
// Prefer exposing application-level concepts:
//
// interface ClientOptions {
//     readonly baseUrl: string;
//     readonly timeoutMilliseconds?: number;
// }
//
// The public API should not force consumers to understand implementation dependencies.

// ---------------------------------------------------------------------
// 47. Public API and third-party types
// ---------------------------------------------------------------------

// Be careful when exposing third-party types directly:
//
// export interface ApiProps {
//     readonly client: SomeExternalLibraryClient;
// }
//
// This makes the external library part of your public contract.
//
// If that dependency changes, consumers may also need to change.

// ---------------------------------------------------------------------
// 48. Wrap third-party dependencies when appropriate
// ---------------------------------------------------------------------

export interface HttpClient {
  readonly get: <T>(url: string) => Promise<T>;
}

export const createHttpProductRepository = (client: HttpClient): ProductRepository => {
  return {
    findById: async (productId: string): Promise<ProductSummary | null> => {
      return client.get<ProductSummary>(`/products/${productId}`);
    },
  };
};

// The repository API depends on HttpClient rather than a specific HTTP library.
// This keeps the public contract independent from that library.

// ---------------------------------------------------------------------
// 49. Public API and dependency leakage
// ---------------------------------------------------------------------

// A dependency leaks through a public API when consumers must understand
// an implementation-specific dependency to use the module.
//
// Examples:
//
// public prop typed with a third-party client
// public return type exposing internal database records
// public error type tied to HTTP status objects
// public configuration containing infrastructure objects
//
// Such leakage increases coupling.

// ---------------------------------------------------------------------
// 50. Public API and module cohesion
// ---------------------------------------------------------------------

// A public API should represent one coherent capability.
//
// Weak:
//
// shared/
//     export everything related to users, products, dates, HTTP, forms...
//
// Stronger:
//
// users/
// products/
// formatting/
// ui/
//
// Each public entry point has a clearer purpose.

// ---------------------------------------------------------------------
// 51. Public API and barrel modules
// ---------------------------------------------------------------------

// A barrel can provide a stable public entry point:
//
// export {Button} from "./button";
// export {Alert} from "./alert";
// export {Panel} from "./panel";
//
// export type {
//     ButtonProps,
//     AlertProps,
//     PanelProps
// } from "./types";
//
// Consumers import from the public entry point instead of implementation files.

// ---------------------------------------------------------------------
// 52. Selective re-exporting
// ---------------------------------------------------------------------

// Avoid:
//
// export * from "./internal";
// export * from "./implementation";
// export * from "./helpers";
//
// Prefer explicit exports:
//
// export {Button} from "./button";
// export {Alert} from "./alert";
// export type {ButtonProps} from "./button";
// export type {AlertProps} from "./alert";
//
// Explicit exports make the public surface auditable.

// ---------------------------------------------------------------------
// 53. Public API and export *
// ---------------------------------------------------------------------

// export * can unintentionally expand a public API when new declarations
// are later added to the source module.
//
// Explicit re-exports make API growth deliberate.
//
// This matters especially for shared packages consumed by many applications.

// ---------------------------------------------------------------------
// 54. Public API and internal modules
// ---------------------------------------------------------------------

// A source tree might contain:
//
// package/
// ├── index.ts
// ├── button.tsx
// ├── parser.ts
// ├── validation.ts
// └── internal.ts
//
// index.ts defines the public boundary.
// The remaining files can remain implementation details.

// ---------------------------------------------------------------------
// 55. Public API and deep imports
// ---------------------------------------------------------------------

// Avoid encouraging consumers to depend on:
//
// package/internal/parser
//
// when the intended API is:
//
// package
//
// Deep imports bypass the designed public boundary and make internal
// refactoring more difficult.

// ---------------------------------------------------------------------
// 56. Public API and package exports
// ---------------------------------------------------------------------

// Package-level export maps can reinforce the boundary:
//
// package
//     ↓
// public entry point
//
// internal files
//     ✕
// not exposed to consumers
//
// The package configuration can therefore enforce architectural intent
// in addition to source-code conventions.

// ---------------------------------------------------------------------
// 57. Public API and versioning
// ---------------------------------------------------------------------

// Changes to public APIs can require coordinated versioning.
//
// Potentially breaking changes include:
//
// - removing an export
// - renaming an export
// - removing a required prop
// - changing a return type
// - changing error semantics
// - changing default behavior
// - changing observable component behavior

// ---------------------------------------------------------------------
// 58. Additive versus breaking changes
// ---------------------------------------------------------------------

export interface ButtonOptions {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly size?: "small" | "medium" | "large";
}

// Adding an optional property is often less disruptive:
//
// size?: ...
//
// than changing an existing required property:
//
// children: ...
//
// Public API evolution should consider both type compatibility
// and behavioral compatibility.

// ---------------------------------------------------------------------
// 59. Public API and deprecation
// ---------------------------------------------------------------------

/**
 * Formats a user name for display.
 *
 * @deprecated Use `formatUserName` instead.
 */
export const formatDisplayName = (user: UserSummary): string => {
  return formatUserName(user);
};

// Deprecation can provide a migration path instead of immediately removing
// an existing public API.

// ---------------------------------------------------------------------
// 60. Public API and compatibility wrappers
// ---------------------------------------------------------------------

export const formatName = (user: UserSummary): string => {
  return formatUserName(user);
};

// A compatibility wrapper can preserve an older API while directing
// implementation toward the newer public capability.

// ---------------------------------------------------------------------
// 61. Public API and ownership
// ---------------------------------------------------------------------

// Every meaningful public API should have an owner responsible for:
//
// - contract design
// - documentation
// - compatibility
// - tests
// - deprecation
// - migration
//
// Public code without ownership tends to accumulate accidental contracts.

// ---------------------------------------------------------------------
// 62. Public API and documentation
// ---------------------------------------------------------------------

/**
 * Creates a normalized user summary.
 *
 * The returned object contains the stable user information needed by consumers.
 */
export const createDocumentedUserSummary = (id: string, displayName: string): UserSummary => {
  return createUserSummary(id, displayName);
};

// Documentation should describe behavior and constraints that consumers
// need to use the API correctly.

// ---------------------------------------------------------------------
// 63. Public API and examples
// ---------------------------------------------------------------------

export const PublicApiExample: FC = (): ReactElement => {
  const user = createDocumentedUserSummary("user-1", "John Doe");

  return (
    <Panel title="User">
      <p>{formatUserName(user)}</p>
    </Panel>
  );
};

// The public API can be composed without exposing its private implementation details.

// ---------------------------------------------------------------------
// 64. Public API and testing
// ---------------------------------------------------------------------

export const createTestProductRepository = (products: readonly ProductSummary[]): ProductRepository => {
  return {
    findById: async (productId: string): Promise<ProductSummary | null> => {
      return findProduct(products, productId);
    },
  };
};

// Public APIs should be tested through their observable contracts.
// Tests should not require knowledge of private implementation details.

// ---------------------------------------------------------------------
// 65. Public API and implementation replacement
// ---------------------------------------------------------------------

const productIndex = new Map<string, ProductSummary>();

export const findIndexedProduct = (productId: string): ProductSummary | null => {
  return productIndex.get(productId) ?? null;
};

// The implementation can change from a Map to another indexing strategy.
// Consumers continue using findIndexedProduct.

// ---------------------------------------------------------------------
// 66. Public API and stable abstractions
// ---------------------------------------------------------------------

export interface ProductReader {
  readonly findById: (productId: string) => Promise<ProductSummary | null>;
}

export const createProductReader = (repository: ProductRepository): ProductReader => {
  return {
    findById: (productId: string): Promise<ProductSummary | null> => {
      return repository.findById(productId);
    },
  };
};

// The reader abstraction exposes exactly the capability required by its consumers.
// It does not expose unrelated repository operations.

// ---------------------------------------------------------------------
// 67. Public API and dependency inversion
// ---------------------------------------------------------------------

// A public API can serve as an architectural abstraction:
//
// Consumer
//     ↓
// Public contract
//     ↑
// Implementation
//
// This is especially useful when the implementation is volatile
// and the consumer-facing requirement is stable.

// ---------------------------------------------------------------------
// 68. Public API and feature boundaries
// ---------------------------------------------------------------------

// A feature can expose:
//
// Feature public API
//     ├── public components
//     ├── public hooks
//     ├── public types
//     └── public commands
//
// while keeping:
//
// internal components
// internal helpers
// infrastructure details
// feature-private state
//
// outside the public boundary.

// ---------------------------------------------------------------------
// 69. Feature public API
// ---------------------------------------------------------------------

export interface ProductFeatureProps {
  readonly productId: string;
  readonly onComplete?: () => void;
}

export const ProductFeature: FC<ProductFeatureProps> = ({ productId, onComplete }): ReactElement => {
  return (
    <Panel title="Product">
      <p>{productId}</p>
      <Button onClick={onComplete}>Complete</Button>
    </Panel>
  );
};

// The feature's public component contract does not expose how the feature
// retrieves, validates, or transforms its product data.

// ---------------------------------------------------------------------
// 70. Internal feature implementation
// ---------------------------------------------------------------------

const resolveProductTitle = (productId: string): string => {
  return `Product ${productId}`;
};

export const ProductFeatureView: FC<ProductFeatureProps> = ({ productId, onComplete }): ReactElement => {
  return (
    <Panel title={resolveProductTitle(productId)}>
      <Button onClick={onComplete}>Complete</Button>
    </Panel>
  );
};

// resolveProductTitle remains private.
// Consumers do not depend on the naming strategy.

// ---------------------------------------------------------------------
// 71. Public API and accidental coupling
// ---------------------------------------------------------------------

// A public API becomes problematic when consumers start depending on:
//
// - internal object fields
// - implementation-specific classes
// - private module paths
// - undocumented side effects
// - incidental DOM structure
// - unstable configuration
//
// Once consumers rely on these details, implementation freedom decreases.

// ---------------------------------------------------------------------
// 72. Public API and minimal surface area
// ---------------------------------------------------------------------

// Prefer exposing:
//
// createProduct()
// Product
// ProductRepository
//
// over exposing:
//
// createProduct()
// Product
// ProductRepository
// ProductParser
// ProductNormalizer
// ProductCache
// ProductStorage
// ProductHttpClient
// ProductInternalState
//
// unless consumers genuinely require those additional capabilities.

// ---------------------------------------------------------------------
// 73. Public API review checklist
// ---------------------------------------------------------------------

// Before exporting a declaration, ask:
//
// 1. Does a consumer need this?
// 2. Is this part of the module's responsibility?
// 3. Can it remain private?
// 4. Is the name meaningful outside the implementation?
// 5. Is the type stable?
// 6. Are its semantics clear?
// 7. Does it leak an implementation dependency?
// 8. Can it be tested through observable behavior?
// 9. Who owns its evolution?
// 10. What happens if it changes later?

// ---------------------------------------------------------------------
// 74. Complete module public API
// ---------------------------------------------------------------------

export interface ProductCatalog {
  readonly getProduct: (productId: string) => Promise<ProductSummary | null>;
}

const normalizeProductId = (productId: string): string => {
  return productId.trim().toLowerCase();
};

const createCatalogRepository = (products: readonly ProductSummary[]): ProductRepository => {
  return createProductRepository(products);
};

export const createProductCatalog = (products: readonly ProductSummary[]): ProductCatalog => {
  const repository = createCatalogRepository(products);

  return {
    getProduct: (productId: string): Promise<ProductSummary | null> => {
      return repository.findById(normalizeProductId(productId));
    },
  };
};

interface ProductCatalogViewProps {
  readonly catalog: ProductCatalog;
}

export const ProductCatalogView: FC<ProductCatalogViewProps> = ({ catalog }): ReactElement => {
  void catalog;

  return (
    <Panel title="Product catalog">
      <p>Catalog API is available.</p>
    </Panel>
  );
};

export const ModulePublicApiExample: FC = (): ReactElement => {
  const catalog = createProductCatalog([
    {
      id: "product-1",
      name: "Notebook",
      priceInCents: 1200,
    },
  ]);

  return <ProductCatalogView catalog={catalog} />;
};

// The public surface is:
//
// Product
// ProductSummary
// ProductRepository
// ProductCatalog
// createProductCatalog
// ProductCatalogView
//
// Internal details:
//
// normalizeProductId
// createCatalogRepository
//
// Consumers depend on the public capabilities.
// The module remains free to change its private implementation.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A module public API is the set of declarations intentionally exposed to consumers.
// - Every export can become a dependency, so every export should be treated as a potential contract.
// - A small public API provides fewer points of coupling and preserves more implementation freedom.
// - Public APIs include types, functions, values, classes, React components, props, callbacks, defaults, and observable behavior.
// - Private helpers should remain unexported when consumers do not need them.
// - Public APIs should describe consumer intent rather than expose implementation structure.
// - Public types do not need to mirror internal storage or transport representations.
// - Public factories can enforce runtime invariants while hiding construction details.
// - readonly and defensive copying can help preserve ownership of mutable data exposed by a module.
// - React component props form a public API and should expose only the inputs and behaviors consumers actually need.
// - Callbacks, children, and controlled state are all part of a component's public contract.
// - Named exports and explicit re-exports make public surfaces easier to audit than indiscriminate export-* patterns.
// - Barrel modules can provide stable entry points, but they should expose intentional public declarations rather than every internal symbol.
// - Deep imports into internal implementation files bypass the intended public boundary and increase coupling.
// - Public APIs should avoid leaking third-party libraries, transport models, infrastructure details, or internal representations unless those dependencies are intentionally part of the contract.
// - Public API compatibility includes semantic behavior, not only TypeScript type compatibility.
// - Defaults, error behavior, asynchronous behavior, accessibility behavior, and observable component behavior can all become public contracts.
// - Public APIs benefit from clear ownership, documentation, testing, versioning, and deliberate deprecation strategies.
// - Feature modules can expose focused public APIs while keeping internal components, helpers, state, and infrastructure private.
// - A strong module public API lets consumers depend on stable capabilities while allowing internal implementation details to evolve independently.
