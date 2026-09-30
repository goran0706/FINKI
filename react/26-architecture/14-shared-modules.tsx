/**
 * Shared Modules
 * ==============
 *
 * Shared modules contain reusable code that is intentionally consumed by multiple parts
 * of an application or by multiple applications. A shared module should expose a small,
 * stable public API while keeping implementation details private and avoiding dependencies
 * on feature-specific modules.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Shared module concept
// ---------------------------------------------------------------------

// A shared module provides reusable capabilities:
//
// Feature A ─┐
// Feature B ─┼──→ Shared Module
// Feature C ─┘
//
// The module can contain:
//
// - functions
// - types
// - constants
// - configuration
// - React components
// - adapters
//
// The important architectural property is intentional reuse through a stable boundary.

// ---------------------------------------------------------------------
// 2. Module public API
// ---------------------------------------------------------------------

export interface CurrencyAmount {
  readonly amountInCents: number;
  readonly currency: string;
}

export const formatCurrency = (amount: CurrencyAmount): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: amount.currency,
  }).format(amount.amountInCents / 100);
};

// The exported declarations form the module's public API.
// Consumers should depend on these contracts rather than private implementation details.

// ---------------------------------------------------------------------
// 3. Private module implementation
// ---------------------------------------------------------------------

const normalizeCurrencyCode = (currency: string): string => {
  return currency.trim().toUpperCase();
};

export const createCurrencyAmount = (amountInCents: number, currency: string): CurrencyAmount => {
  return {
    amountInCents,
    currency: normalizeCurrencyCode(currency),
  };
};

// normalizeCurrencyCode is intentionally private.
// Consumers only need the public createCurrencyAmount contract.

// ---------------------------------------------------------------------
// 4. Named exports
// ---------------------------------------------------------------------

export const calculatePercentage = (value: number, percentage: number): number => {
  return value * (percentage / 100);
};

// Named exports make the public surface explicit.
// Consumers can depend on individual capabilities rather than an opaque module object.

// ---------------------------------------------------------------------
// 5. Exported types
// ---------------------------------------------------------------------

export interface Pagination {
  readonly page: number;
  readonly pageSize: number;
}

export interface PageResult<T> {
  readonly items: readonly T[];
  readonly pagination: Pagination;
  readonly total: number;
}

// Shared modules often expose types alongside implementation.
// These types become part of the contract consumed by other modules.

// ---------------------------------------------------------------------
// 6. Shared utility module
// ---------------------------------------------------------------------

export const clamp = (value: number, minimum: number, maximum: number): number => {
  return Math.min(Math.max(value, minimum), maximum);
};

export const isNonEmptyString = (value: string): boolean => {
  return value.trim().length > 0;
};

// Small utilities are appropriate for sharing when their semantics are generic,
// stable, and useful across multiple consumers.

// ---------------------------------------------------------------------
// 7. Shared constants
// ---------------------------------------------------------------------

export const DEFAULT_PAGE_SIZE = 20;

export const MAX_PAGE_SIZE = 100;

// Constants can establish shared application conventions.
// They should represent stable concepts rather than feature-specific configuration.

// ---------------------------------------------------------------------
// 8. Shared configuration
// ---------------------------------------------------------------------

export interface PaginationConfig {
  readonly defaultPageSize: number;
  readonly maxPageSize: number;
}

export const paginationConfig: PaginationConfig = {
  defaultPageSize: DEFAULT_PAGE_SIZE,
  maxPageSize: MAX_PAGE_SIZE,
};

// Shared configuration should have a clear owner.
// A shared configuration module should not become an unstructured global settings container.

// ---------------------------------------------------------------------
// 9. Shared modules versus feature modules
// ---------------------------------------------------------------------

// Shared module:
//
// @app/shared/date
// @app/shared/format
// @app/shared/ui
//
// Feature module:
//
// @app/products
// @app/orders
// @app/profile
//
// Shared modules provide capabilities used across boundaries.
// Feature modules own behavior specific to one business capability.

// ---------------------------------------------------------------------
// 10. Shared modules should be domain-neutral when appropriate
// ---------------------------------------------------------------------

export const normalizeWhitespace = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

// This utility does not know about products, users, orders, or other features.
// That makes its behavior broadly reusable.

// ---------------------------------------------------------------------
// 11. Avoid feature-specific shared utilities
// ---------------------------------------------------------------------

// Avoid placing:
//
// calculateOrderShippingCost()
//
// into a generic shared utility module merely because another feature might
// eventually use it.
//
// If the operation represents order-specific business behavior,
// it should remain owned by the order domain or feature until there is
// a genuine shared domain boundary.

// ---------------------------------------------------------------------
// 12. Shared domain module
// ---------------------------------------------------------------------

export interface Money {
  readonly amountInCents: number;
  readonly currency: string;
}

export const addMoney = (first: Money, second: Money): Money => {
  if (first.currency !== second.currency) {
    throw new Error("Currencies must match.");
  }

  return {
    amountInCents: first.amountInCents + second.amountInCents,
    currency: first.currency,
  };
};

// A domain-oriented shared module can be appropriate when multiple features
// genuinely depend on the same domain concept and rules.

// ---------------------------------------------------------------------
// 13. Shared module ownership
// ---------------------------------------------------------------------

// A shared module should have:
//
// - a clear owner
// - a defined public API
// - stable semantics
// - documented usage
// - appropriate tests
//
// Without ownership, shared modules tend to become dumping grounds for unrelated code.

// ---------------------------------------------------------------------
// 14. The shared module as a dependency boundary
// ---------------------------------------------------------------------

// A healthy dependency direction is:
//
// Feature A ─┐
// Feature B ─┼──→ Shared Module
// Feature C ─┘
//
// The shared module should not depend back on Feature A, Feature B, or Feature C.
//
// Otherwise the shared layer becomes coupled to its consumers.

// ---------------------------------------------------------------------
// 15. Avoid circular dependencies
// ---------------------------------------------------------------------

// Avoid:
//
// shared → feature
// feature → shared
//
// This creates:
//
// feature → shared → feature
//
// Shared modules should normally sit below their consumers in the dependency graph.

// ---------------------------------------------------------------------
// 16. Shared module dependency direction
// ---------------------------------------------------------------------

export interface Logger {
  readonly info: (message: string) => void;
  readonly error: (message: string) => void;
}

export const createConsoleLogger = (): Logger => {
  return {
    info: (message: string): void => {
      console.log(message);
    },
    error: (message: string): void => {
      console.error(message);
    },
  };
};

// A generic logging contract can be shared without knowing which feature consumes it.

// ---------------------------------------------------------------------
// 17. Dependency injection through shared contracts
// ---------------------------------------------------------------------

export interface Clock {
  readonly now: () => Date;
}

export const systemClock: Clock = {
  now: (): Date => new Date(),
};

// The shared module defines a stable contract.
// Features can depend on the contract rather than constructing infrastructure themselves.

// ---------------------------------------------------------------------
// 18. Shared module versus singleton
// ---------------------------------------------------------------------

export const applicationClock: Clock = {
  now: (): Date => new Date(),
};

// A module-level object is shared because the module exports one instance.
// This does not mean every shared module should become a singleton.
//
// Shared state introduces lifecycle and coupling concerns and should be intentional.

// ---------------------------------------------------------------------
// 19. Shared stateless utilities
// ---------------------------------------------------------------------

export const toSlug = (value: string): string => {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
};

// Stateless utilities are generally easier to share because they do not require
// coordination over mutable module-level state.

// ---------------------------------------------------------------------
// 20. Shared mutable state
// ---------------------------------------------------------------------

let requestCount = 0;

export const recordRequest = (): number => {
  requestCount += 1;
  return requestCount;
};

// Module-level mutable state is shared by every consumer of this module instance.
// That makes its lifecycle and concurrency semantics part of the module contract.
//
// Shared mutable state should therefore be used deliberately rather than accidentally.

// ---------------------------------------------------------------------
// 21. Shared state should have explicit ownership
// ---------------------------------------------------------------------

// Before placing state in a shared module, determine:
//
// - who owns the state?
// - who can modify it?
// - who observes it?
// - when is it initialized?
// - when is it reset?
// - what happens across tests?
// - what happens across application instances?
//
// If those answers are unclear, the state probably does not belong in a generic shared module.

// ---------------------------------------------------------------------
// 22. Shared React module
// ---------------------------------------------------------------------

interface CardProps {
  readonly title?: string;
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ title, children }): ReactElement => {
  return (
    <article>
      {title && <h2>{title}</h2>}
      <div>{children}</div>
    </article>
  );
};

// A shared module can expose React components when the module's responsibility
// is reusable presentation rather than feature-specific behavior.

// ---------------------------------------------------------------------
// 23. Shared React module boundaries
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ children, disabled = false, onClick }): ReactElement => {
  return (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

// The shared module owns the button's generic presentation and interaction contract.
// It does not own the business operation performed by the caller.

// ---------------------------------------------------------------------
// 24. Shared module with React and non-React exports
// ---------------------------------------------------------------------

export const formatCount = (count: number): string => {
  return new Intl.NumberFormat("en-US").format(count);
};

// A module can expose both React and non-React capabilities,
// but the module should still have one coherent responsibility.
//
// Avoid combining unrelated utilities merely because they are all "shared."

// ---------------------------------------------------------------------
// 25. Avoid the catch-all shared module
// ---------------------------------------------------------------------

// Avoid:
//
// shared/
// ├── dates.ts
// ├── products.ts
// ├── auth.ts
// ├── orders.ts
// ├── random.ts
// └── everything-else.ts
//
// A shared directory is not a substitute for architectural boundaries.

// ---------------------------------------------------------------------
// 26. Cohesive shared modules
// ---------------------------------------------------------------------

// Prefer focused modules such as:
//
// shared/formatting
// shared/validation
// shared/date
// shared/ui
// shared/http
//
// Each module groups closely related capabilities under one responsibility.

// ---------------------------------------------------------------------
// 27. Shared validation module
// ---------------------------------------------------------------------

export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const isValidRequiredText = (value: string): boolean => {
  return value.trim().length > 0;
};

// Generic validation can be shared when the validation rule itself is broadly applicable.

// ---------------------------------------------------------------------
// 28. Domain-specific validation
// ---------------------------------------------------------------------

export interface ProductInput {
  readonly name: string;
  readonly priceInCents: number;
}

export const validateProductInput = (input: ProductInput): readonly string[] => {
  const errors: string[] = [];

  if (!isValidRequiredText(input.name)) {
    errors.push("Product name is required.");
  }

  if (input.priceInCents < 0) {
    errors.push("Product price cannot be negative.");
  }

  return errors;
};

// This validation is product-specific.
// It should not automatically be placed into a generic validation utility module
// simply because validation utilities are shared.

// ---------------------------------------------------------------------
// 29. Shared module and domain boundary
// ---------------------------------------------------------------------

// A useful distinction:
//
// Generic shared module
//   → reusable technical or UI capability
//
// Shared domain module
//   → reusable business concept or rule
//
// Feature module
//   → behavior specific to one business capability
//
// These categories should not be collapsed into one "shared" abstraction.

// ---------------------------------------------------------------------
// 30. Shared API contracts
// ---------------------------------------------------------------------

export interface ApiResponse<T> {
  readonly data: T;
  readonly requestId: string;
}

export interface ApiError {
  readonly code: string;
  readonly message: string;
}

// Stable transport contracts can be shared by multiple API-consuming features.

// ---------------------------------------------------------------------
// 31. Shared HTTP client contract
// ---------------------------------------------------------------------

export interface HttpClient {
  readonly get: <T>(url: string) => Promise<T>;
  readonly post: <T>(url: string, body: unknown) => Promise<T>;
}

// The shared module can define an infrastructure contract without coupling
// consumers to one concrete HTTP implementation.

// ---------------------------------------------------------------------
// 32. Shared module and infrastructure
// ---------------------------------------------------------------------

export const createHttpClient = (fetchImplementation: typeof fetch): HttpClient => {
  return {
    get: async function <T>(url: string): Promise<T> {
      const response = await fetchImplementation(url);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`);
      }

      return response.json() as Promise<T>;
    },

    post: async function <T>(url: string, body: unknown): Promise<T> {
      const response = await fetchImplementation(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`);
      }

      return response.json() as Promise<T>;
    },
  };
};

// The shared HTTP abstraction owns transport mechanics.
// Features decide which endpoints and domain operations to perform.

// ---------------------------------------------------------------------
// 33. Shared modules and environment-specific code
// ---------------------------------------------------------------------

// A shared module should define whether it is safe for:
//
// - browser
// - server
// - both
//
// A module that accesses window, document, or browser storage should not
// be treated as universally usable server-side code.

// ---------------------------------------------------------------------
// 34. Browser-specific shared module
// ---------------------------------------------------------------------

export const readStoredValue = (key: string): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
};

// The runtime guard makes the function safe to call when window is unavailable.
// The module's environment expectations should still be documented.

// ---------------------------------------------------------------------
// 35. Shared module and React context
// ---------------------------------------------------------------------

export interface Theme {
  readonly surface: string;
  readonly foreground: string;
}

export const defaultTheme: Theme = {
  surface: "white",
  foreground: "black",
};

// A shared theme contract can live in a shared module.
// A separate React context module can own provider and consumer behavior.

// ---------------------------------------------------------------------
// 36. Shared module and context identity
// ---------------------------------------------------------------------

// If multiple features need one context, the context itself should have one canonical owner:
//
// shared/theme
//     └── ThemeContext
//
// Feature A
//     └── consumes ThemeContext
//
// Feature B
//     └── consumes ThemeContext
//
// Creating separate contexts with identical types does not create one shared context.

// ---------------------------------------------------------------------
// 37. Shared type-only modules
// ---------------------------------------------------------------------

export interface UserSummary {
  readonly id: string;
  readonly displayName: string;
}

export interface ProductSummary {
  readonly id: string;
  readonly name: string;
}

// Type-only shared modules can reduce coupling when consumers only need
// compile-time contracts and not runtime implementations.

// ---------------------------------------------------------------------
// 38. Shared module and barrel exports
// ---------------------------------------------------------------------

// A barrel module can provide a stable public entry point:
//
// shared/ui/index.ts
//
// export {Button} from "./button";
// export {Card} from "./card";
//
// Consumers then depend on:
//
// shared/ui
//
// rather than private file paths.
//
// The barrel should expose intentional public APIs rather than every internal symbol.

// ---------------------------------------------------------------------
// 39. Public API versus internal files
// ---------------------------------------------------------------------

// A package can conceptually have:
//
// public/
//   index.ts
//
// internal/
//   implementation.ts
//
// Consumers should depend on the public entry point.
// Internal file paths should remain free to change when they are not part of the contract.

// ---------------------------------------------------------------------
// 40. Avoid exporting implementation details
// ---------------------------------------------------------------------

const internalPrefix = "shared";

export const createIdentifier = (value: string): string => {
  return `${internalPrefix}-${value}`;
};

// internalPrefix remains private.
// Consumers depend only on createIdentifier rather than its implementation details.

// ---------------------------------------------------------------------
// 41. Shared module API size
// ---------------------------------------------------------------------

// A large public API increases the number of contracts consumers can depend on.
//
// Prefer:
//
// export {formatCurrency, createCurrencyAmount}
//
// over exposing every helper:
//
// export {normalizeCurrencyCode, internalFormatter, ...}
//
// A smaller API provides more freedom to evolve the implementation.

// ---------------------------------------------------------------------
// 42. Shared module API stability
// ---------------------------------------------------------------------

export interface RetryPolicy {
  readonly maxAttempts: number;
  readonly delayMilliseconds: number;
}

export const defaultRetryPolicy: RetryPolicy = {
  maxAttempts: 3,
  delayMilliseconds: 500,
};

// Shared contracts should evolve deliberately because multiple consumers
// can depend on their exact shape and semantics.

// ---------------------------------------------------------------------
// 43. Shared module and semantic compatibility
// ---------------------------------------------------------------------

// API compatibility is not only about TypeScript compiling.
//
// A change from:
//
// formatCurrency(1200) → "$12.00"
//
// to:
//
// formatCurrency(1200) → "12 USD"
//
// may preserve the TypeScript signature while changing observable behavior.
//
// Shared modules therefore need semantic stability as well as type stability.

// ---------------------------------------------------------------------
// 44. Shared module and dependency minimization
// ---------------------------------------------------------------------

// A shared module should avoid unnecessary dependencies.
//
// Every dependency adds:
//
// - installation requirements
// - bundle impact
// - version constraints
// - upgrade coordination
// - possible runtime coupling
//
// Small shared modules are easier to reuse across architectural boundaries.

// ---------------------------------------------------------------------
// 45. Shared module and dependency inversion
// ---------------------------------------------------------------------

export interface UserRepository {
  readonly findById: (userId: string) => Promise<User | null>;
}

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

// The shared contract can describe an abstraction.
// A feature can provide a concrete implementation without the shared module
// importing the feature's infrastructure.

// ---------------------------------------------------------------------
// 46. Shared contracts versus shared implementations
// ---------------------------------------------------------------------

// Sometimes the reusable boundary should be a type or interface:
//
// shared/contracts
//      └── UserRepository
//
// while the implementation belongs elsewhere:
//
// infrastructure
//      └── ApiUserRepository
//
// Sharing the contract does not require sharing the implementation.

// ---------------------------------------------------------------------
// 47. Shared module and testing
// ---------------------------------------------------------------------

export const createFixedClock = (value: Date): Clock => {
  return {
    now: (): Date => new Date(value.getTime()),
  };
};

// A shared contract can make consumers easier to test.
// A fixed implementation is useful for deterministic tests without requiring
// production infrastructure.

// ---------------------------------------------------------------------
// 48. Shared module and test helpers
// ---------------------------------------------------------------------

export const createTestUser = (overrides: Partial<User> = {}): User => {
  return {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    ...overrides,
  };
};

// Test helpers can be shared when they represent stable testing conventions.
// They should normally remain separate from production runtime modules.

// ---------------------------------------------------------------------
// 49. Shared modules and package boundaries
// ---------------------------------------------------------------------

// In a larger system, shared modules can become packages:
//
// @app/shared-types
// @app/shared-ui
// @app/shared-formatting
// @app/shared-http
//
// Each package should have a clear responsibility and public API.

// ---------------------------------------------------------------------
// 50. Shared package versus shared folder
// ---------------------------------------------------------------------

// A shared folder is a source-code organization mechanism.
//
// A shared package is an architectural dependency boundary.
//
// When modules need independent versioning, ownership, publishing, or deployment,
// a package boundary may be more appropriate than a directory alone.

// ---------------------------------------------------------------------
// 51. Shared module and monorepo packages
// ---------------------------------------------------------------------

// A monorepo can organize shared packages:
//
// packages/
// ├── shared-types
// ├── shared-ui
// └── shared-http
//
// apps/
// ├── products
// └── profile
//
// Applications consume shared packages through explicit dependency relationships.

// ---------------------------------------------------------------------
// 52. Shared module dependency graph
// ---------------------------------------------------------------------

// A healthy graph might look like:
//
// shared-types
//      ↑
// shared-domain
//      ↑
// feature modules
//
// shared-ui
//      ↑
// feature modules
//
// Infrastructure can implement shared contracts without forcing
// shared modules to depend on feature modules.

// ---------------------------------------------------------------------
// 53. Shared modules and feature coupling
// ---------------------------------------------------------------------

// A shared module becomes problematic when every feature must understand
// its internal assumptions.
//
// For example:
//
// Feature A
//      ↓
// Shared module
//      ↓
// Feature B
//
// If changes for Feature A repeatedly require changes to Feature B,
// the shared module may contain multiple unrelated responsibilities.

// ---------------------------------------------------------------------
// 54. Shared module extraction
// ---------------------------------------------------------------------

// A capability can be extracted into a shared module when:
//
// 1. multiple consumers genuinely need it
// 2. its responsibility is coherent
// 3. its public API can remain narrow
// 4. its dependencies are acceptable
// 5. ownership is clear
//
// Extraction should follow stable reuse rather than speculative reuse.

// ---------------------------------------------------------------------
// 55. Shared module duplication
// ---------------------------------------------------------------------

// Temporary duplication can be preferable when two implementations:
//
// - have different ownership
// - have different change rates
// - have different domain semantics
// - only happen to look similar
//
// Sharing creates coupling, so removing duplication is not automatically an improvement.

// ---------------------------------------------------------------------
// 56. Shared module and change frequency
// ---------------------------------------------------------------------

// A highly unstable module can be a poor shared dependency.
//
// If many consumers depend on code that changes constantly:
//
// Consumer A ─┐
// Consumer B ─┼──→ frequently changing shared module
// Consumer C ─┘
//
// every change can propagate through the dependency graph.
//
// Stable concepts are better candidates for broad sharing.

// ---------------------------------------------------------------------
// 57. Shared module and change ownership
// ---------------------------------------------------------------------

// Before sharing a module, determine:
//
// Who decides its API?
// Who reviews changes?
// Who handles breaking changes?
// Who maintains tests?
// Who coordinates consumers?
//
// Shared code without clear ownership tends to accumulate incompatible requirements.

// ---------------------------------------------------------------------
// 58. Shared module example
// ---------------------------------------------------------------------

export interface Notification {
  readonly id: string;
  readonly message: string;
  readonly severity: "info" | "success" | "warning" | "error";
}

export const getNotificationLabel = (notification: Notification): string => {
  return `${notification.severity}: ${notification.message}`;
};

// The shared module owns the generic notification contract and formatting behavior.
// A feature decides when a notification should be created or displayed.

// ---------------------------------------------------------------------
// 59. Shared module composition
// ---------------------------------------------------------------------

interface NotificationListProps {
  readonly notifications: readonly Notification[];
}

export const NotificationList: FC<NotificationListProps> = ({ notifications }): ReactElement => {
  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>{getNotificationLabel(notification)}</li>
      ))}
    </ul>
  );
};

// The React component and non-React notification logic can coexist when they form
// one coherent shared responsibility.

// ---------------------------------------------------------------------
// 60. Shared module and application-specific composition
// ---------------------------------------------------------------------

interface ProductPageProps {
  readonly product: ProductInput;
}

export const ProductPage: FC<ProductPageProps> = ({ product }): ReactElement => {
  const errors = validateProductInput(product);

  return (
    <Card title={product.name}>
      {errors.length > 0 ? (
        <Alert title="Invalid product" tone="error">
          {errors.join(" ")}
        </Alert>
      ) : (
        <p>
          {formatCurrency({
            amountInCents: product.priceInCents,
            currency: "USD",
          })}
        </p>
      )}
    </Card>
  );
};

// ProductPage is feature-specific because it combines product semantics.
// It composes reusable shared capabilities rather than making those capabilities
// responsible for the product feature.

// ---------------------------------------------------------------------
// 61. Shared module anti-patterns
// ---------------------------------------------------------------------

// Common problems include:
//
// - catch-all utility modules
// - feature-specific logic in generic modules
// - uncontrolled mutable state
// - circular dependencies
// - huge public APIs
// - unclear ownership
// - unnecessary third-party dependencies
// - unstable abstractions shared too early
//
// These problems increase coupling rather than reducing it.

// ---------------------------------------------------------------------
// 62. Shared module design checklist
// ---------------------------------------------------------------------

// Before creating a shared module, ask:
//
// 1. Who are the consumers?
// 2. What exact capability is shared?
// 3. Is the responsibility cohesive?
// 4. What is the public API?
// 5. Which implementation details should remain private?
// 6. Which dependencies are required?
// 7. Who owns the module?
// 8. Can the module depend on its consumers?
// 9. Does it contain mutable state?
// 10. Is the abstraction stable enough to share?

// ---------------------------------------------------------------------
// 63. Complete shared-module composition
// ---------------------------------------------------------------------

interface ProductSummaryCardProps {
  readonly product: ProductInput;
}

export const ProductSummaryCard: FC<ProductSummaryCardProps> = ({ product }): ReactElement => {
  const amount = createCurrencyAmount(product.priceInCents, "USD");

  return (
    <Card title={product.name}>
      <Stack>
        <p>{formatCurrency(amount)}</p>
        <Badge variant="success">Available</Badge>
      </Stack>
    </Card>
  );
};

export const SharedModulesExample: FC = (): ReactElement => {
  const product: ProductInput = {
    name: "Notebook",
    priceInCents: 1200,
  };

  return (
    <Stack gap={16}>
      <ProductSummaryCard product={product} />
      <NotificationList
        notifications={[
          {
            id: "notification-1",
            message: "Product loaded.",
            severity: "success",
          },
        ]}
      />
    </Stack>
  );
};

// The feature-level composition uses shared modules without making those modules
// depend on the feature itself.
//
// Shared capabilities:
// - formatting
// - validation
// - UI primitives
// - notification contracts
//
// Feature-specific composition:
// - ProductSummaryCard
// - ProductPage

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A shared module provides a reusable capability through an explicit public API.
// - Shared modules can contain functions, types, constants, configuration, React components, or infrastructure contracts.
// - The public API should be smaller and more stable than the internal implementation.
// - Private implementation details should remain unexported when consumers do not need them.
// - Shared modules should have one coherent responsibility rather than becoming catch-all utility containers.
// - Shared modules normally sit below their consumers in the dependency graph.
// - Shared modules should not depend back on feature modules because that creates coupling and circular dependencies.
// - Generic technical, UI, and domain capabilities can be shared when their semantics are genuinely common.
// - Feature-specific business behavior should remain owned by the appropriate feature or domain boundary.
// - Shared mutable state requires explicit ownership, lifecycle, initialization, and testing semantics.
// - Shared contracts can be more appropriate than shared implementations when consumers need an abstraction rather than a concrete dependency.
// - React components can live in shared modules when their responsibility is reusable presentation rather than feature-specific behavior.
// - Barrel exports can provide stable public entry points, but should expose intentional APIs rather than every internal symbol.
// - Shared module dependencies should be minimized because every dependency increases coupling and coordination cost.
// - Shared modules can become packages when independent ownership, versioning, publishing, or deployment boundaries are needed.
// - Duplication is sometimes preferable to premature abstraction when similar code represents different responsibilities.
// - Stable concepts with multiple genuine consumers are stronger candidates for shared ownership than speculative abstractions.
// - Clear ownership, narrow APIs, cohesive responsibilities, and explicit dependency direction are the foundation of maintainable shared modules.
