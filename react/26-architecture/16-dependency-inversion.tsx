/**
 * Dependency Inversion
 * =====================
 *
 * Dependency inversion is an architectural principle in which high-level policy
 * depends on abstractions rather than concrete low-level implementations. The
 * concrete implementation then depends on the abstraction, allowing infrastructure
 * details to change without forcing changes in higher-level application behavior.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Dependency inversion
// ---------------------------------------------------------------------

// Without dependency inversion:
//
// Application Service ─────────→ API Client
//
// The high-level application service directly depends on a low-level
// infrastructure implementation.
//
// With dependency inversion:
//
// Application Service ─────────→ ProductRepository ←──────── API Repository
//
// The application depends on an abstraction.
// The infrastructure implementation satisfies that abstraction.

// ---------------------------------------------------------------------
// 2. High-level policy versus low-level detail
// ---------------------------------------------------------------------

// High-level policy answers:
//
// "What does the application need to accomplish?"
//
// Low-level detail answers:
//
// "How is that capability implemented?"
//
// Example:
//
// High-level:
//     Load a product.
//
// Low-level:
//     Fetch JSON from an HTTP endpoint.
//
// Dependency inversion separates these concerns.

// ---------------------------------------------------------------------
// 3. Direct concrete dependency
// ---------------------------------------------------------------------

export interface Product {
  readonly id: string;
  readonly name: string;
}

export class HttpProductRepository {
  public async findById(productId: string): Promise<Product | null> {
    const response = await fetch(`/api/products/${productId}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to load product.");
    }

    return response.json() as Promise<Product>;
  }
}

export class ProductService {
  private readonly repository = new HttpProductRepository();

  public async getProduct(productId: string): Promise<Product | null> {
    return this.repository.findById(productId);
  }
}

// ProductService creates and depends directly on HttpProductRepository.
// Changing the data source requires changing ProductService.

// ---------------------------------------------------------------------
// 4. Why the concrete dependency is restrictive
// ---------------------------------------------------------------------

// The service is now coupled to:
//
// ProductService
//      ↓
// HttpProductRepository
//      ↓
// fetch()
//
// This makes it harder to replace the repository with:
//
// - an in-memory implementation
// - a database implementation
// - a cache
// - a test implementation
// - another API client

// ---------------------------------------------------------------------
// 5. Introduce an abstraction
// ---------------------------------------------------------------------

export interface ProductRepository {
  readonly findById: (productId: string) => Promise<Product | null>;
}

// The interface describes the capability required by the application.
//
// It does not describe HTTP, databases, caches, or other implementation details.

// ---------------------------------------------------------------------
// 6. Depend on the abstraction
// ---------------------------------------------------------------------

export class InvertedProductService {
  public constructor(private readonly repository: ProductRepository) {}

  public async getProduct(productId: string): Promise<Product | null> {
    return this.repository.findById(productId);
  }
}

// The service now depends on ProductRepository.
//
// InvertedProductService ───→ ProductRepository

// ---------------------------------------------------------------------
// 7. Concrete implementation depends on the abstraction
// ---------------------------------------------------------------------

export class ApiProductRepository implements ProductRepository {
  public async findById(productId: string): Promise<Product | null> {
    const response = await fetch(`/api/products/${productId}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to load product.");
    }

    return response.json() as Promise<Product>;
  }
}

// The dependency graph is now:
//
// InvertedProductService ───→ ProductRepository
//                                  ↑
//                                  │
//                       ApiProductRepository
//
// The concrete implementation points toward the abstraction.

// ---------------------------------------------------------------------
// 8. The abstraction belongs to the consumer's requirement
// ---------------------------------------------------------------------

// ProductService does not care that the implementation is called
// ApiProductRepository.
//
// Its requirement is:
//
// "I need something that can find a product by ID."
//
// ProductRepository expresses that requirement.

// ---------------------------------------------------------------------
// 9. Dependency inversion versus dependency injection
// ---------------------------------------------------------------------

// Dependency inversion:
//
// A high-level module depends on an abstraction instead of a concrete detail.
//
// Dependency injection:
//
// A dependency is supplied from outside rather than constructed internally.
//
// They often appear together:
//
// ProductService
//      ↓
// ProductRepository
//
// ProductRepository is injected into ProductService.

// ---------------------------------------------------------------------
// 10. Constructor injection
// ---------------------------------------------------------------------

export class ProductApplicationService {
  public constructor(private readonly repository: ProductRepository) {}

  public async loadProduct(productId: string): Promise<Product | null> {
    return this.repository.findById(productId);
  }
}

// Constructor injection makes the dependency explicit and required.

// ---------------------------------------------------------------------
// 11. Composition root
// ---------------------------------------------------------------------

export const createProductApplicationService = (): ProductApplicationService => {
  const repository = new ApiProductRepository();

  return new ProductApplicationService(repository);
};

// Concrete implementation selection happens outside the high-level service.
//
// Composition root:
//
//     ApiProductRepository
//             ↓
//     ProductApplicationService

// ---------------------------------------------------------------------
// 12. Replacing the implementation
// ---------------------------------------------------------------------

export class InMemoryProductRepository implements ProductRepository {
  private readonly products = new Map<string, Product>();

  public async findById(productId: string): Promise<Product | null> {
    return this.products.get(productId) ?? null;
  }

  public add(product: Product): void {
    this.products.set(product.id, product);
  }
}

// The same service can now use:
//
// new ProductApplicationService(
//     new InMemoryProductRepository()
// );
//
// No service implementation change is required.

// ---------------------------------------------------------------------
// 13. Multiple implementations
// ---------------------------------------------------------------------

export class CachedProductRepository implements ProductRepository {
  public constructor(private readonly fallback: ProductRepository) {}

  private readonly cache = new Map<string, Product>();

  public async findById(productId: string): Promise<Product | null> {
    const cached = this.cache.get(productId);

    if (cached) {
      return cached;
    }

    const product = await this.fallback.findById(productId);

    if (product) {
      this.cache.set(productId, product);
    }

    return product;
  }
}

// CachedProductRepository also depends on the abstraction.
//
// CachedProductRepository
//      ↓
// ProductRepository
//
// It can therefore wrap any compatible implementation.

// ---------------------------------------------------------------------
// 14. Dependency inversion with decorators
// ---------------------------------------------------------------------

export class LoggingProductRepository implements ProductRepository {
  public constructor(private readonly repository: ProductRepository) {}

  public async findById(productId: string): Promise<Product | null> {
    console.log(`Loading product ${productId}.`);

    const product = await this.repository.findById(productId);

    console.log(product ? `Loaded ${product.name}.` : "Product not found.");

    return product;
  }
}

// Cross-cutting behavior can be added without changing the
// high-level service or the underlying repository.

// ---------------------------------------------------------------------
// 15. Dependency inversion and React
// ---------------------------------------------------------------------

interface ProductViewProps {
  readonly product: Product;
}

export const ProductView: FC<ProductViewProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>{product.id}</p>
    </article>
  );
};

// ProductView depends on the Product abstraction.
// It does not need to know how the product was retrieved.

// ---------------------------------------------------------------------
// 16. UI should not construct infrastructure
// ---------------------------------------------------------------------

// Avoid:
//
// export const ProductPage: FC = () => {
//     const repository = new ApiProductRepository();
//     ...
// };
//
// The component now owns infrastructure construction.
//
// Prefer:
//
// ProductPage
//      ↓
// ProductApplicationService
//      ↓
// ProductRepository
//
// with the concrete repository assembled outside the component.

// ---------------------------------------------------------------------
// 17. Inject application behavior into the UI
// ---------------------------------------------------------------------

export interface ProductLoader {
  readonly load: (productId: string) => Promise<Product | null>;
}

export const createProductLoader = (service: ProductApplicationService): ProductLoader => {
  return {
    load: (productId: string): Promise<Product | null> => {
      return service.loadProduct(productId);
    },
  };
};

interface ProductLoaderViewProps {
  readonly loader: ProductLoader;
  readonly productId: string;
}

export const ProductLoaderView: FC<ProductLoaderViewProps> = ({ loader, productId }): ReactElement => {
  void loader;

  return (
    <section>
      <h2>Product</h2>
      <p>{productId}</p>
    </section>
  );
};

// The component depends on the capability it needs rather than
// the infrastructure that happens to implement that capability.

// ---------------------------------------------------------------------
// 18. Function-based dependency injection
// ---------------------------------------------------------------------

export type ProductLoaderFunction = (productId: string) => Promise<Product | null>;

export const createProductLoaderFunction = (repository: ProductRepository): ProductLoaderFunction => {
  return (productId: string): Promise<Product | null> => {
    return repository.findById(productId);
  };
};

// Dependency inversion does not require classes.
// Functions and interfaces can provide the same architectural boundary.

// ---------------------------------------------------------------------
// 19. Injecting a function
// ---------------------------------------------------------------------

interface ProductSearchProps {
  readonly loadProduct: ProductLoaderFunction;
}

export const ProductSearch: FC<ProductSearchProps> = ({ loadProduct }): ReactElement => {
  void loadProduct;

  return (
    <section>
      <h2>Product search</h2>
      <p>Loader dependency received.</p>
    </section>
  );
};

// A component can depend on a function contract without knowing its implementation.

// ---------------------------------------------------------------------
// 20. Domain logic should remain independent
// ---------------------------------------------------------------------

export interface ProductPrice {
  readonly amountInCents: number;
  readonly currency: string;
}

export const applyDiscount = (price: ProductPrice, percentage: number): ProductPrice => {
  const multiplier = 1 - percentage / 100;

  return {
    amountInCents: Math.round(price.amountInCents * multiplier),
    currency: price.currency,
  };
};

// This function does not depend on:
//
// - React
// - fetch
// - browser APIs
// - repositories
// - databases
//
// Its dependencies are entirely domain-level values.

// ---------------------------------------------------------------------
// 21. Domain logic should not depend on infrastructure
// ---------------------------------------------------------------------

// Avoid:
//
// calculateDiscount()
//      ↓
// fetch()
//      ↓
// discount configuration API
//
// The domain operation should receive the information it needs:
//
// calculateDiscount(price, percentage)
//
// Infrastructure can obtain the percentage before invoking the domain logic.

// ---------------------------------------------------------------------
// 22. Passing data across the boundary
// ---------------------------------------------------------------------

export interface DiscountPolicy {
  readonly percentage: number;
}

export const calculateDiscountedPrice = (price: ProductPrice, policy: DiscountPolicy): ProductPrice => {
  return applyDiscount(price, policy.percentage);
};

// The domain operation receives a policy.
// It does not need to know where that policy came from.

// ---------------------------------------------------------------------
// 23. High-level policy
// ---------------------------------------------------------------------

export interface PricingService {
  readonly calculatePrice: (price: ProductPrice, policy: DiscountPolicy) => ProductPrice;
}

export const createPricingService = (): PricingService => {
  return {
    calculatePrice: (price: ProductPrice, policy: DiscountPolicy): ProductPrice => {
      return calculateDiscountedPrice(price, policy);
    },
  };
};

// PricingService expresses application/domain behavior.
// It does not know which storage or network implementation supplied the policy.

// ---------------------------------------------------------------------
// 24. Low-level detail
// ---------------------------------------------------------------------

export interface DiscountPolicyRepository {
  readonly getPolicy: () => Promise<DiscountPolicy>;
}

export class ApiDiscountPolicyRepository implements DiscountPolicyRepository {
  public async getPolicy(): Promise<DiscountPolicy> {
    const response = await fetch("/api/discount-policy");

    if (!response.ok) {
      throw new Error("Failed to load discount policy.");
    }

    return response.json() as Promise<DiscountPolicy>;
  }
}

// The API implementation is a detail.
// The high-level pricing behavior does not depend directly on it.

// ---------------------------------------------------------------------
// 25. Application service combining the boundaries
// ---------------------------------------------------------------------

export class ProductPricingApplication {
  public constructor(
    private readonly policyRepository: DiscountPolicyRepository,
    private readonly pricingService: PricingService,
  ) {}

  public async calculatePrice(price: ProductPrice): Promise<ProductPrice> {
    const policy = await this.policyRepository.getPolicy();

    return this.pricingService.calculatePrice(price, policy);
  }
}

// Dependency direction:
//
// ProductPricingApplication
//      ↓
// DiscountPolicyRepository
//      ↑
// ApiDiscountPolicyRepository
//
// ProductPricingApplication
//      ↓
// PricingService
//
// The high-level application behavior remains independent of the API implementation.

// ---------------------------------------------------------------------
// 26. Dependency inversion and storage
// ---------------------------------------------------------------------

export interface Storage {
  readonly get: (key: string) => string | null;
  readonly set: (key: string, value: string) => void;
}

export const createMemoryStorage = (): Storage => {
  const values = new Map<string, string>();

  return {
    get: (key: string): string | null => {
      return values.get(key) ?? null;
    },
    set: (key: string, value: string): void => {
      values.set(key, value);
    },
  };
};

// Storage is the abstraction.
// The memory implementation is one detail.

// ---------------------------------------------------------------------
// 27. Browser storage implementation
// ---------------------------------------------------------------------

export const browserStorage: Storage = {
  get: (key: string): string | null => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(key);
  },
  set: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  },
};

// The same consumer can work with memory storage or browser storage.

// ---------------------------------------------------------------------
// 28. Consumer of the storage abstraction
// ---------------------------------------------------------------------

export const createUserPreferenceStore = (storage: Storage) => {
  return {
    getTheme: (): string | null => {
      return storage.get("theme");
    },
    setTheme: (theme: string): void => {
      storage.set("theme", theme);
    },
  };
};

// The preference store does not know whether storage is backed by
// localStorage, memory, a test double, or another mechanism.

// ---------------------------------------------------------------------
// 29. Dependency inversion and clocks
// ---------------------------------------------------------------------

export interface Clock {
  readonly now: () => Date;
}

export const systemClock: Clock = {
  now: (): Date => new Date(),
};

export const createFixedClock = (value: Date): Clock => {
  return {
    now: (): Date => new Date(value.getTime()),
  };
};

// Time is an external dependency.
// Injecting a clock keeps time-dependent logic deterministic.

// ---------------------------------------------------------------------
// 30. Consumer of the clock abstraction
// ---------------------------------------------------------------------

export const createTimestampProvider = (clock: Clock) => {
  return {
    getTimestamp: (): number => {
      return clock.now().getTime();
    },
  };
};

// The consumer depends on Clock rather than directly calling new Date().

// ---------------------------------------------------------------------
// 31. Dependency inversion and analytics
// ---------------------------------------------------------------------

export interface Analytics {
  readonly track: (eventName: string) => void;
}

export class ConsoleAnalytics implements Analytics {
  public track(eventName: string): void {
    console.log(`Analytics event: ${eventName}`);
  }
}

export class MemoryAnalytics implements Analytics {
  public readonly events: string[] = [];

  public track(eventName: string): void {
    this.events.push(eventName);
  }
}

// Both implementations satisfy the same abstraction.

// ---------------------------------------------------------------------
// 32. Consumer of analytics
// ---------------------------------------------------------------------

export const createProductAnalytics = (analytics: Analytics) => {
  return {
    trackProductSelected: (): void => {
      analytics.track("product_selected");
    },
  };
};

// Product analytics depends on the capability.
// It does not depend on ConsoleAnalytics or MemoryAnalytics.

// ---------------------------------------------------------------------
// 33. Dependency inversion and notifications
// ---------------------------------------------------------------------

export interface Notifier {
  readonly notify: (message: string) => void;
}

export class ConsoleNotifier implements Notifier {
  public notify(message: string): void {
    console.log(message);
  }
}

export class MemoryNotifier implements Notifier {
  public readonly messages: string[] = [];

  public notify(message: string): void {
    this.messages.push(message);
  }
}

export const createProductNotifier = (notifier: Notifier) => {
  return {
    productCreated: (product: Product): void => {
      notifier.notify(`Created ${product.name}.`);
    },
  };
};

// Again, the consumer depends on the abstraction,
// while concrete notification mechanisms point toward it.

// ---------------------------------------------------------------------
// 34. Dependency inversion and UI notifications
// ---------------------------------------------------------------------

interface ProductNotificationProps {
  readonly notifier: Notifier;
}

export const ProductNotification: FC<ProductNotificationProps> = ({ notifier }): ReactElement => {
  const handleNotify = (): void => {
    notifier.notify("Product action completed.");
  };

  return (
    <button type="button" onClick={handleNotify}>
      Notify
    </button>
  );
};

// The component receives the capability.
// It does not construct the notification implementation.

// ---------------------------------------------------------------------
// 35. Dependency inversion and callbacks
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly onSave: () => Promise<void>;
}

export const SaveButton: FC<SaveButtonProps> = ({ onSave }): ReactElement => {
  const handleClick = (): void => {
    void onSave();
  };

  return (
    <button type="button" onClick={handleClick}>
      Save
    </button>
  );
};

// A callback is a very small abstraction.
// The button does not need to know whether saving means:
//
// - an API request
// - local storage
// - a server action
// - an in-memory update

// ---------------------------------------------------------------------
// 36. Dependency inversion through composition
// ---------------------------------------------------------------------

interface ProductEditorProps {
  readonly onSave: (product: Product) => Promise<void>;
}

export const ProductEditor: FC<ProductEditorProps> = ({ onSave }): ReactElement => {
  const product: Product = {
    id: "product-1",
    name: "Notebook",
  };

  const handleSave = (): Promise<void> => {
    return onSave(product);
  };

  return <SaveButton onSave={handleSave} />;
};

// The feature composes the concrete operation.
// The generic button depends only on its callback contract.

// ---------------------------------------------------------------------
// 37. Dependency inversion and children
// ---------------------------------------------------------------------

interface PanelProps {
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

// Composition through children is another way to keep a reusable component
// independent of the content it renders.

// ---------------------------------------------------------------------
// 38. Dependency inversion and React context
// ---------------------------------------------------------------------

export interface Theme {
  readonly surface: string;
  readonly foreground: string;
}

export const defaultTheme: Theme = {
  surface: "white",
  foreground: "black",
};

// A shared context can expose an abstraction to descendants.
// The consuming component should depend on the context contract rather than
// constructing a concrete provider implementation.

// ---------------------------------------------------------------------
// 39. Dependency inversion and context boundaries
// ---------------------------------------------------------------------

// Context can invert a dependency:
//
// Component
//     ↓
// ThemeContext
//     ↑
// ThemeProvider
//
// The component does not need to know how the theme value was constructed.

// ---------------------------------------------------------------------
// 40. Dependency inversion and module boundaries
// ---------------------------------------------------------------------

// A useful module structure can be:
//
// domain/
//   Product.ts
//   Pricing.ts
//
// application/
//   ProductService.ts
//   ProductRepository.ts
//
// infrastructure/
//   ApiProductRepository.ts
//
// presentation/
//   ProductPage.tsx
//
// The important property is not the folder names.
// The important property is that dependency direction follows the intended boundaries.

// ---------------------------------------------------------------------
// 41. Dependency inversion and repository placement
// ---------------------------------------------------------------------

// A repository interface can be defined near the application/domain requirement:
//
// application/
//   ProductRepository.ts
//
// while its implementation lives in infrastructure:
//
// infrastructure/
//   ApiProductRepository.ts
//
// This keeps the abstraction independent from the implementation detail.

// ---------------------------------------------------------------------
// 42. Dependency inversion and domain contracts
// ---------------------------------------------------------------------

export interface ProductPricingPolicy {
  readonly getDiscountPercentage: (product: Product) => Promise<number>;
}

export const calculateProductPrice = async (
  product: Product,
  basePrice: ProductPrice,
  policy: ProductPricingPolicy,
): Promise<ProductPrice> => {
  const percentage = await policy.getDiscountPercentage(product);

  return applyDiscount(basePrice, percentage);
};

// The pricing calculation depends on the policy capability,
// not on the system that stores or retrieves the policy.

// ---------------------------------------------------------------------
// 43. Concrete policy implementation
// ---------------------------------------------------------------------

export class ApiPricingPolicy implements ProductPricingPolicy {
  public async getDiscountPercentage(product: Product): Promise<number> {
    const response = await fetch(`/api/products/${product.id}/discount`);

    if (!response.ok) {
      throw new Error("Failed to load discount.");
    }

    const data = (await response.json()) as {
      readonly percentage: number;
    };

    return data.percentage;
  }
}

// The API implementation points toward the policy abstraction.

// ---------------------------------------------------------------------
// 44. Dependency inversion and external services
// ---------------------------------------------------------------------

export interface EmailSender {
  readonly send: (recipient: string, message: string) => Promise<void>;
}

export class ApiEmailSender implements EmailSender {
  public async send(recipient: string, message: string): Promise<void> {
    await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient,
        message,
      }),
    });
  }
}

// Application behavior can depend on EmailSender rather than ApiEmailSender.

// ---------------------------------------------------------------------
// 45. Consumer of the email abstraction
// ---------------------------------------------------------------------

export const createProductEmailService = (emailSender: EmailSender) => {
  return {
    sendCreatedNotification: async (product: Product, recipient: string): Promise<void> => {
      await emailSender.send(recipient, `Product ${product.name} was created.`);
    },
  };
};

// The high-level operation is independent of the transport mechanism.

// ---------------------------------------------------------------------
// 46. Dependency inversion and testing
// ---------------------------------------------------------------------

export class TestEmailSender implements EmailSender {
  public readonly messages: Array<{
    readonly recipient: string;
    readonly message: string;
  }> = [];

  public async send(recipient: string, message: string): Promise<void> {
    this.messages.push({
      recipient,
      message,
    });
  }
}

// A test implementation can satisfy the same abstraction without
// sending real external requests.

// ---------------------------------------------------------------------
// 47. Dependency inversion and deterministic tests
// ---------------------------------------------------------------------

export const createTestPricingPolicy = (percentage: number): ProductPricingPolicy => {
  return {
    getDiscountPercentage: async (): Promise<number> => {
      return percentage;
    },
  };
};

// The same production code can now receive a deterministic policy
// during tests.

// ---------------------------------------------------------------------
// 48. Dependency inversion and implementation replacement
// ---------------------------------------------------------------------

// Production:
//
// ProductService
//      ↓
// ProductRepository
//      ↑
// ApiProductRepository
//
// Test:
//
// ProductService
//      ↓
// ProductRepository
//      ↑
// InMemoryProductRepository
//
// The high-level code remains unchanged.

// ---------------------------------------------------------------------
// 49. Dependency inversion and feature boundaries
// ---------------------------------------------------------------------

// A feature should not need to know the internal implementation
// of another feature's infrastructure.
//
// Prefer:
//
// Feature A
//    ↓
// Feature B public contract
//
// over:
//
// Feature A
//    ↓
// Feature B internal repository
//
// Public contracts preserve boundaries.

// ---------------------------------------------------------------------
// 50. Dependency inversion and shared components
// ---------------------------------------------------------------------

interface ConfirmationDialogProps {
  readonly title: string;
  readonly message: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      <p>{message}</p>
      <button type="button" onClick={onConfirm}>
        Confirm
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </section>
  );
};

// The dialog depends on behavior contracts rather than feature modules.
// A feature supplies what confirmation actually means.

// ---------------------------------------------------------------------
// 51. Dependency inversion and generic components
// ---------------------------------------------------------------------

interface ListProps<T> {
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

// The generic List component depends only on its rendering contracts.
// It does not depend on any feature-specific item type.

// ---------------------------------------------------------------------
// 52. Dependency inversion and application ports
// ---------------------------------------------------------------------

export interface ProductCatalogPort {
  readonly getProduct: (productId: string) => Promise<Product | null>;
}

export interface ProductNotificationPort {
  readonly notifyProductLoaded: (product: Product) => Promise<void>;
}

// Ports describe capabilities required by application behavior.
// Infrastructure adapters can implement those ports.

// ---------------------------------------------------------------------
// 53. Dependency inversion and adapters
// ---------------------------------------------------------------------

export class ProductCatalogAdapter implements ProductCatalogPort {
  public constructor(private readonly repository: ProductRepository) {}

  public getProduct(productId: string): Promise<Product | null> {
    return this.repository.findById(productId);
  }
}

export class ProductNotificationAdapter implements ProductNotificationPort {
  public constructor(private readonly notifier: Notifier) {}

  public async notifyProductLoaded(product: Product): Promise<void> {
    this.notifier.notify(`Loaded ${product.name}.`);
  }
}

// Adapters translate infrastructure capabilities into application-facing contracts.

// ---------------------------------------------------------------------
// 54. Dependency inversion and application orchestration
// ---------------------------------------------------------------------

export class ProductWorkflow {
  public constructor(
    private readonly catalog: ProductCatalogPort,
    private readonly notifications: ProductNotificationPort,
  ) {}

  public async loadProduct(productId: string): Promise<Product | null> {
    const product = await this.catalog.getProduct(productId);

    if (product) {
      await this.notifications.notifyProductLoaded(product);
    }

    return product;
  }
}

// ProductWorkflow depends on ports.
// It does not depend on HTTP, local storage, or a specific notification mechanism.

// ---------------------------------------------------------------------
// 55. Dependency inversion and React application composition
// ---------------------------------------------------------------------

interface ProductWorkflowViewProps {
  readonly workflow: ProductWorkflow;
}

export const ProductWorkflowView: FC<ProductWorkflowViewProps> = ({ workflow }): ReactElement => {
  void workflow;

  return (
    <section>
      <h2>Product workflow</h2>
      <p>Workflow dependency received.</p>
    </section>
  );
};

// The UI can depend on the application workflow boundary
// without importing infrastructure implementations.

// ---------------------------------------------------------------------
// 56. Composition root for the complete workflow
// ---------------------------------------------------------------------

export const createProductWorkflow = (): ProductWorkflow => {
  const repository = new ApiProductRepository();

  const notifier = new ConsoleNotifier();

  const catalog = new ProductCatalogAdapter(repository);

  const notifications = new ProductNotificationAdapter(notifier);

  return new ProductWorkflow(catalog, notifications);
};

// Concrete dependencies are assembled here.
// ProductWorkflow itself remains independent of their implementations.

// ---------------------------------------------------------------------
// 57. Dependency inversion and over-abstraction
// ---------------------------------------------------------------------

// Dependency inversion does not mean:
//
// "Create an interface for every class."
//
// An abstraction is valuable when it represents a meaningful boundary:
//
// - replaceable infrastructure
// - external service
// - persistence mechanism
// - clock
// - storage
// - messaging
// - application capability
//
// A stable concrete value object does not necessarily need an interface.

// ---------------------------------------------------------------------
// 58. Dependency inversion and unnecessary interfaces
// ---------------------------------------------------------------------

// Weak:
//
// interface ProductNameFormatter {
//     format(name: string): string;
// }
//
// class ProductNameFormatterImpl
//     implements ProductNameFormatter { ... }
//
// If there is no meaningful boundary or replacement requirement,
// this can add ceremony without reducing coupling.

// ---------------------------------------------------------------------
// 59. Dependency inversion and abstraction ownership
// ---------------------------------------------------------------------

// The most useful abstraction usually expresses what the consumer needs:
//
// ProductApplication
//      ↓
// ProductReader
//
// rather than exposing every capability of a concrete infrastructure service:
//
// ProductApplication
//      ↓
// MassiveApiClient
//
// Smaller consumer-oriented abstractions reduce coupling.

// ---------------------------------------------------------------------
// 60. Dependency inversion and stable abstractions
// ---------------------------------------------------------------------

// A useful abstraction should remain stable while implementations evolve.
//
// Stable:
//
// ProductRepository.findById()
//
// Volatile:
//
// fetch()
// REST endpoint details
// HTTP headers
// response JSON shape
//
// The abstraction protects high-level code from those implementation details.

// ---------------------------------------------------------------------
// 61. Dependency inversion and data transfer objects
// ---------------------------------------------------------------------

export interface ProductResponseDto {
  readonly product_id: string;
  readonly display_name: string;
}

export const mapProductResponse = (response: ProductResponseDto): Product => {
  return {
    id: response.product_id,
    name: response.display_name,
  };
};

// The API-specific DTO remains at the infrastructure boundary.
// Product is the application-facing model.

// ---------------------------------------------------------------------
// 62. Dependency inversion and error translation
// ---------------------------------------------------------------------

export type ProductLookupError =
  | {
      readonly type: "not-found";
    }
  | {
      readonly type: "unavailable";
    };

export const mapRepositoryError = (status: number): ProductLookupError => {
  if (status === 404) {
    return { type: "not-found" };
  }

  return { type: "unavailable" };
};

// High-level code can depend on meaningful application errors
// rather than transport-specific status codes.

// ---------------------------------------------------------------------
// 63. Dependency inversion and external APIs
// ---------------------------------------------------------------------

// External system:
//
// Payment Provider
//      ↑
// PaymentGateway abstraction
//      ↑
// Application service
//
// The application should depend on the capability it requires,
// while the provider-specific adapter handles the external API.

// ---------------------------------------------------------------------
// 64. Dependency inversion and browser APIs
// ---------------------------------------------------------------------

export interface Clipboard {
  readonly writeText: (value: string) => Promise<void>;
}

export const browserClipboard: Clipboard = {
  writeText: async (value: string): Promise<void> => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      throw new Error("Clipboard API is unavailable.");
    }

    await navigator.clipboard.writeText(value);
  },
};

// The application can depend on Clipboard rather than navigator.clipboard directly.

// ---------------------------------------------------------------------
// 65. Dependency inversion and server/client isolation
// ---------------------------------------------------------------------

// A client component should not directly depend on server-only infrastructure:
//
// Client Component
//      ✕
// Server-only database
//
// Instead, a supported application boundary can expose the required capability:
//
// Client Component
//      ↓
// Application boundary
//      ↓
// Server implementation
//
// The exact mechanism depends on the application's framework architecture.

// ---------------------------------------------------------------------
// 66. Dependency inversion and module boundaries
// ---------------------------------------------------------------------

// Good dependency direction:
//
// UI
//  ↓
// Application
//  ↓
// Domain
//  ↑
// Infrastructure
//
// Shared contracts can sit at the boundary required by their consumers.
//
// The goal is to make volatile details depend on stable requirements,
// not the other way around.

// ---------------------------------------------------------------------
// 67. Dependency inversion checklist
// ---------------------------------------------------------------------

// Before introducing a concrete dependency, ask:
//
// 1. Is this dependency a high-level policy or a low-level detail?
// 2. Does the consumer actually need the concrete implementation?
// 3. What capability does the consumer require?
// 4. Can that capability be represented by a smaller abstraction?
// 5. Who should own the abstraction?
// 6. Where should the concrete implementation be assembled?
// 7. Would dependency injection improve replacement or testing?
// 8. Does the abstraction reduce coupling or only add ceremony?
// 9. Are infrastructure details leaking across the boundary?
// 10. Does the resulting dependency graph point toward stable requirements?

// ---------------------------------------------------------------------
// 68. Complete dependency inversion example
// ---------------------------------------------------------------------

export interface ProductReaderPort {
  readonly find: (productId: string) => Promise<Product | null>;
}

export interface ProductAnalyticsPort {
  readonly track: (event: string) => void;
}

export class ProductUseCase {
  public constructor(
    private readonly reader: ProductReaderPort,
    private readonly analytics: ProductAnalyticsPort,
  ) {}

  public async execute(productId: string): Promise<Product | null> {
    const product = await this.reader.find(productId);

    if (product) {
      this.analytics.track("product_loaded");
    }

    return product;
  }
}

export class ApiProductReader implements ProductReaderPort {
  public async find(productId: string): Promise<Product | null> {
    const response = await fetch(`/api/products/${productId}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Product request failed.");
    }

    return response.json() as Promise<Product>;
  }
}

export class ConsoleProductAnalytics implements ProductAnalyticsPort {
  public track(event: string): void {
    console.log(event);
  }
}

interface ProductUseCaseViewProps {
  readonly useCase: ProductUseCase;
}

export const ProductUseCaseView: FC<ProductUseCaseViewProps> = ({ useCase }): ReactElement => {
  void useCase;

  return (
    <section>
      <h2>Product</h2>
      <p>Application use case is ready.</p>
    </section>
  );
};

export const DependencyInversionExample: FC = (): ReactElement => {
  const reader = new ApiProductReader();

  const analytics = new ConsoleProductAnalytics();

  const useCase = new ProductUseCase(reader, analytics);

  return <ProductUseCaseView useCase={useCase} />;
};

// The complete dependency graph is:
//
// React UI
//      ↓
// ProductUseCase
//      ↓
// ProductReaderPort ←── ApiProductReader
//
// ProductUseCase
//      ↓
// ProductAnalyticsPort ←── ConsoleProductAnalytics
//
// High-level application behavior depends on capabilities.
// Concrete infrastructure implementations depend on those capabilities.
// The composition root decides which implementations are used.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Dependency inversion keeps high-level policy independent from low-level implementation details.
// - High-level modules should depend on abstractions when concrete infrastructure would create unnecessary coupling.
// - Low-level implementations can depend on and implement abstractions required by higher-level behavior.
// - Dependency inversion commonly produces a graph in which both consumers and implementations point toward stable contracts.
// - Dependency injection is a common mechanism for applying dependency inversion because dependencies are supplied instead of constructed internally.
// - A composition root is an appropriate place to select and assemble concrete implementations.
// - Repository, storage, clock, analytics, notification, and external-service abstractions are common dependency-inversion boundaries.
// - React components can receive capabilities through props, callbacks, context, or application-level contracts instead of constructing infrastructure.
// - Domain logic should remain independent from React, HTTP, browser APIs, databases, and other infrastructure concerns.
// - Consumer-oriented interfaces should expose the smallest capability required by the consumer.
// - Multiple concrete implementations can satisfy the same abstraction, including production, in-memory, cached, and test implementations.
// - Adapters translate concrete infrastructure APIs into abstractions understood by application code.
// - DTOs and infrastructure-specific errors should be translated at boundaries instead of leaking into higher-level policy.
// - Dependency inversion can improve testability because deterministic implementations can replace external dependencies.
// - Dependency inversion does not mean every class needs an interface; abstractions should represent meaningful architectural boundaries.
// - A useful abstraction should reduce coupling and isolate volatile implementation details rather than merely add ceremony.
// - Dependency inversion and dependency injection are related but distinct: inversion describes the dependency relationship, while injection describes how a dependency is supplied.
// - The goal is a dependency graph in which stable requirements are protected from unnecessary dependence on volatile implementation details.
