/**
 * Dependency Direction
 * ====================
 *
 * Dependency direction describes which architectural layers, modules, or components
 * are allowed to depend on one another. A healthy dependency graph keeps dependencies
 * flowing toward stable abstractions and prevents higher-level business behavior from
 * becoming coupled to lower-level implementation details.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Dependency direction
// ---------------------------------------------------------------------

// If module A imports module B, A depends on B:
//
// A ───→ B
//
// Changes to B can potentially affect A.
// Architectural dependency direction therefore determines how changes propagate
// through the system.

// ---------------------------------------------------------------------
// 2. Dependency graphs
// ---------------------------------------------------------------------

// A simple dependency graph:
//
// ProductPage
//     ↓
// ProductService
//     ↓
// ProductRepository
//     ↓
// ApiClient
//
// Each arrow represents a dependency.
// The graph should reflect architectural responsibilities rather than convenience.

// ---------------------------------------------------------------------
// 3. Dependency direction versus execution order
// ---------------------------------------------------------------------

// Dependency direction:
//
// UI → application → domain
//
// Execution can happen in another direction:
//
// UI event
//     ↓
// application operation
//     ↓
// domain behavior
//     ↓
// infrastructure
//
// The direction of imports does not necessarily describe runtime execution order.

// ---------------------------------------------------------------------
// 4. High-level and low-level modules
// ---------------------------------------------------------------------

// A high-level module usually expresses:
//
// - business workflows
// - application behavior
// - domain rules
//
// A low-level module usually provides:
//
// - HTTP
// - databases
// - browser APIs
// - filesystem access
// - concrete infrastructure
//
// The architectural goal is to prevent high-level behavior from becoming
// directly coupled to replaceable implementation details.

// ---------------------------------------------------------------------
// 5. Direct dependency
// ---------------------------------------------------------------------

interface ApiProduct {
  readonly id: string;
  readonly name: string;
}

const fetchProduct = async (productId: string): Promise<ApiProduct> => {
  const response = await fetch(`/api/products/${productId}`);

  if (!response.ok) {
    throw new Error("Failed to load product.");
  }

  return response.json() as Promise<ApiProduct>;
};

export const loadProduct = async (productId: string): Promise<ApiProduct> => {
  return fetchProduct(productId);
};

// loadProduct directly depends on fetch.
// This is a concrete dependency on a particular infrastructure mechanism.

// ---------------------------------------------------------------------
// 6. Why direct dependencies matter
// ---------------------------------------------------------------------

// Direct dependency:
//
// ProductService ───→ fetch()
//
// The service now knows that data comes from HTTP.
//
// If the source changes to:
//
// ProductService ───→ database
// ProductService ───→ cache
// ProductService ───→ local fixture
//
// the service must change.

// ---------------------------------------------------------------------
// 7. Dependency direction through abstraction
// ---------------------------------------------------------------------

export interface Product {
  readonly id: string;
  readonly name: string;
}

export interface ProductRepository {
  readonly findById: (productId: string) => Promise<Product | null>;
}

// The application depends on the repository contract:
//
// ProductService ───→ ProductRepository
//
// A concrete repository implementation can depend on the contract
// and provide the infrastructure-specific behavior.

// ---------------------------------------------------------------------
// 8. Concrete implementation
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

// The concrete repository implements the abstraction.
// The application layer does not need to import this class.

// ---------------------------------------------------------------------
// 9. Application service
// ---------------------------------------------------------------------

export class ProductService {
  public constructor(private readonly repository: ProductRepository) {}

  public async getProduct(productId: string): Promise<Product | null> {
    return this.repository.findById(productId);
  }
}

// The service depends on ProductRepository rather than ApiProductRepository.
//
// ProductService
//       ↓
// ProductRepository
//       ↑
// ApiProductRepository
//
// The implementation depends on the abstraction it implements.

// ---------------------------------------------------------------------
// 10. Dependency inversion
// ---------------------------------------------------------------------

// Without inversion:
//
// ProductService ───→ ApiProductRepository
//
// With inversion:
//
// ProductService ───→ ProductRepository ←─── ApiProductRepository
//
// The application-level abstraction becomes the stable boundary.
// The concrete infrastructure implementation points toward that boundary.

// ---------------------------------------------------------------------
// 11. Dependency direction in React
// ---------------------------------------------------------------------

interface ProductDetailsProps {
  readonly product: Product;
}

export const ProductDetails: FC<ProductDetailsProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>Product ID: {product.id}</p>
    </article>
  );
};

// A presentation component depends on a data contract.
// It does not need to know where the product came from.

// ---------------------------------------------------------------------
// 12. UI should not own infrastructure
// ---------------------------------------------------------------------

// Avoid:
//
// ProductDetails
//     ↓
// fetch()
//     ↓
// API endpoint
//
// when the component itself becomes responsible for transport, transformation,
// error handling, and domain behavior.
//
// A component should normally depend on a UI-oriented contract or application
// operation instead of owning the entire infrastructure pipeline.

// ---------------------------------------------------------------------
// 13. Application boundary
// ---------------------------------------------------------------------

export interface ProductLoader {
  readonly load: (productId: string) => Promise<Product | null>;
}

export const createProductLoader = (service: ProductService): ProductLoader => {
  return {
    load: (productId: string): Promise<Product | null> => {
      return service.getProduct(productId);
    },
  };
};

// The UI can depend on ProductLoader rather than knowing about
// ProductService or ApiProductRepository.

// ---------------------------------------------------------------------
// 14. Dependency direction through props
// ---------------------------------------------------------------------

interface ProductPageProps {
  readonly productLoader: ProductLoader;
  readonly productId: string;
}

export const ProductPage: FC<ProductPageProps> = ({ productLoader, productId }): ReactElement => {
  return <ProductContainer loader={productLoader} productId={productId} />;
};

interface ProductContainerProps {
  readonly loader: ProductLoader;
  readonly productId: string;
}

export const ProductContainer: FC<ProductContainerProps> = ({ loader, productId }): ReactElement => {
  return (
    <section>
      <p>Product: {productId}</p>
      <ProductLoaderStatus loader={loader} />
    </section>
  );
};

interface ProductLoaderStatusProps {
  readonly loader: ProductLoader;
}

export const ProductLoaderStatus: FC<ProductLoaderStatusProps> = ({ loader }): ReactElement => {
  void loader;

  return <p>Ready to load product data.</p>;
};

// Explicit dependencies make the direction visible at the component boundary.
// The component does not silently construct infrastructure.

// ---------------------------------------------------------------------
// 15. Dependency direction and composition roots
// ---------------------------------------------------------------------

// Concrete implementations should often be assembled near the application's
// composition root:
//
// ApiProductRepository
//        ↓
// ProductService
//        ↓
// ProductLoader
//        ↓
// ProductPage
//
// The composition root knows the concrete implementations.
// Lower-level components can remain dependent on abstractions.

// ---------------------------------------------------------------------
// 16. Composition root
// ---------------------------------------------------------------------

interface ApplicationProps {
  readonly children: ReactNode;
}

export const Application: FC<ApplicationProps> = ({ children }): ReactElement => {
  const repository = new ApiProductRepository();
  const service = new ProductService(repository);
  const loader = createProductLoader(service);

  return <ProductApplication loader={loader}>{children}</ProductApplication>;
};

interface ProductApplicationProps {
  readonly loader: ProductLoader;
  readonly children: ReactNode;
}

export const ProductApplication: FC<ProductApplicationProps> = ({ loader, children }): ReactElement => {
  void loader;

  return <div>{children}</div>;
};

// The composition root is allowed to know concrete infrastructure details.
// The components below it can receive stable contracts.

// ---------------------------------------------------------------------
// 17. Dependency direction by layer
// ---------------------------------------------------------------------

// A common layered direction is:
//
// Presentation
//      ↓
// Application
//      ↓
// Domain
//
// Infrastructure implements contracts required by the inner layers:
//
// Presentation
//      ↓
// Application
//      ↓
// Domain
//      ↑
// Infrastructure
//
// The exact layering can vary, but the dependency graph should be deliberate.

// ---------------------------------------------------------------------
// 18. Presentation dependencies
// ---------------------------------------------------------------------

// Presentation code can depend on:
//
// - UI contracts
// - application operations
// - view models
// - shared presentation components
//
// It should avoid depending directly on low-level infrastructure when
// an application boundary already exists.

// ---------------------------------------------------------------------
// 19. Application dependencies
// ---------------------------------------------------------------------

export interface SaveProduct {
  readonly execute: (product: Product) => Promise<void>;
}

export const createSaveProduct = (repository: ProductRepository): SaveProduct => {
  return {
    execute: async (product: Product): Promise<void> => {
      await repository.save(product);
    },
  };
};

// The application operation depends on the repository abstraction.

// ---------------------------------------------------------------------
// 20. Repository contract
// ---------------------------------------------------------------------

// Extend the contract when the domain actually needs persistence behavior.
// The abstraction belongs at the boundary required by the application behavior.
//
// ProductRepository
// ├── findById()
// └── save()

// ---------------------------------------------------------------------
// 21. Complete repository contract
// ---------------------------------------------------------------------

export interface WritableProductRepository extends ProductRepository {
  readonly save: (product: Product) => Promise<void>;
}

export const createSaveProductOperation = (repository: WritableProductRepository): SaveProduct => {
  return {
    execute: async (product: Product): Promise<void> => {
      await repository.save(product);
    },
  };
};

// The application depends on the smallest repository contract it actually needs.

// ---------------------------------------------------------------------
// 22. Interface segregation and direction
// ---------------------------------------------------------------------

export interface ProductReader {
  readonly findById: (productId: string) => Promise<Product | null>;
}

export interface ProductWriter {
  readonly save: (product: Product) => Promise<void>;
}

// A consumer that only reads products does not need to depend on write operations.
//
// Reader consumer ───→ ProductReader
//
// rather than:
//
// Reader consumer ───→ ProductRepository with every possible operation.

// ---------------------------------------------------------------------
// 23. Narrow dependency contracts
// ---------------------------------------------------------------------

export const createProductReader = (repository: ProductReader): ProductLoader => {
  return {
    load: (productId: string): Promise<Product | null> => {
      return repository.findById(productId);
    },
  };
};

// Narrow contracts reduce the number of implementation details
// that can propagate through a dependency boundary.

// ---------------------------------------------------------------------
// 24. Dependency direction and domain logic
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

// Pure domain behavior has no dependency on React, fetch, browser APIs,
// or infrastructure modules.
//
// That makes the dependency direction simple:
//
// UI / application ───→ domain logic

// ---------------------------------------------------------------------
// 25. Domain should not depend on presentation
// ---------------------------------------------------------------------

// Avoid:
//
// domain → React
// domain → JSX
// domain → button
//
// Prefer:
//
// React/UI ───→ domain
//
// The domain should express business concepts without requiring a particular
// presentation technology.

// ---------------------------------------------------------------------
// 26. Infrastructure should implement abstractions
// ---------------------------------------------------------------------

export class InMemoryProductRepository implements WritableProductRepository {
  private readonly products = new Map<string, Product>();

  public async findById(productId: string): Promise<Product | null> {
    return this.products.get(productId) ?? null;
  }

  public async save(product: Product): Promise<void> {
    this.products.set(product.id, product);
  }
}

// The in-memory implementation can replace the HTTP implementation:
//
// ProductReader ←── InMemoryProductRepository
// ProductReader ←── ApiProductRepository
//
// Both implementations satisfy the same consumer-facing contract.

// ---------------------------------------------------------------------
// 27. Dependency direction and testing
// ---------------------------------------------------------------------

export const createTestProductRepository = (products: readonly Product[]): ProductReader => {
  const productMap = new Map(products.map((product) => [product.id, product]));

  return {
    findById: async (productId: string): Promise<Product | null> => {
      return productMap.get(productId) ?? null;
    },
  };
};

// Tests can provide a lightweight implementation.
// The application does not need to know whether the dependency is real,
// in-memory, mocked, or otherwise.

// ---------------------------------------------------------------------
// 28. Dependency direction and module imports
// ---------------------------------------------------------------------

// Consider these modules:
//
// ui/ProductPage
// application/ProductService
// domain/Product
// infrastructure/ApiProductRepository
//
// A preferred dependency graph is:
//
// ui ───────────────→ application
// application ──────→ domain
// infrastructure ───→ domain
//
// The UI does not need to import the infrastructure implementation directly.

// ---------------------------------------------------------------------
// 29. Shared modules and dependency direction
// ---------------------------------------------------------------------

// Shared modules can sit beneath multiple consumers:
//
// feature-a ─┐
// feature-b ─┼──→ shared
// feature-c ─┘
//
// The shared module should not import:
//
// shared ───→ feature-a
//
// because that would make the supposed lower-level dependency depend
// on one of its consumers.

// ---------------------------------------------------------------------
// 30. Dependency direction and utility modules
// ---------------------------------------------------------------------

export const capitalize = (value: string): string => {
  if (value.length === 0) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

// A low-level generic utility should not import high-level feature modules.
// Keeping its dependency set small makes its position in the graph clear.

// ---------------------------------------------------------------------
// 31. Dependency direction and React component composition
// ---------------------------------------------------------------------

interface LayoutProps {
  readonly sidebar: ReactNode;
  readonly children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ sidebar, children }): ReactElement => {
  return (
    <div>
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
};

// Layout depends on ReactNode and its own presentation contract.
// It does not need to know which feature supplies sidebar or page content.

// ---------------------------------------------------------------------
// 32. Dependency direction through composition
// ---------------------------------------------------------------------

export const ProductScreen: FC = (): ReactElement => {
  return (
    <Layout sidebar={<p>Navigation</p>}>
      <ProductDetails
        product={{
          id: "product-1",
          name: "Notebook",
        }}
      />
    </Layout>
  );
};

// Composition lets higher-level code provide concrete behavior to lower-level
// components without forcing lower-level components to import higher-level modules.

// ---------------------------------------------------------------------
// 33. Dependency direction and callbacks
// ---------------------------------------------------------------------

interface SelectableProductProps {
  readonly product: Product;
  readonly onSelect: (product: Product) => void;
}

export const SelectableProduct: FC<SelectableProductProps> = ({ product, onSelect }): ReactElement => {
  return (
    <button type="button" onClick={() => onSelect(product)}>
      {product.name}
    </button>
  );
};

// The child depends on an interaction contract.
// The parent owns what selecting the product actually means.

// ---------------------------------------------------------------------
// 34. Avoid upward imports
// ---------------------------------------------------------------------

// Avoid a low-level component importing:
//
// features/products/ProductService
//
// just because the component needs to trigger product behavior.
//
// Instead, the feature can pass a callback:
//
// <SelectableProduct onSelect={handleProductSelect} />
//
// The dependency then flows through the component boundary rather than
// through an upward module import.

// ---------------------------------------------------------------------
// 35. Dependency direction and inversion of control
// ---------------------------------------------------------------------

// Inversion of control means a component or service receives something
// it needs instead of constructing that dependency itself.
//
// Construction:
//
// ProductService creates ApiProductRepository
//
// Injection:
//
// ProductService receives ProductRepository
//
// The second arrangement keeps construction responsibility outside the service.

// ---------------------------------------------------------------------
// 36. Dependency direction and factories
// ---------------------------------------------------------------------

export const createProductService = (repository: ProductRepository): ProductService => {
  return new ProductService(repository);
};

// The factory accepts the dependency.
// It does not hide the dependency inside the service.

// ---------------------------------------------------------------------
// 37. Dependency direction and hidden dependencies
// ---------------------------------------------------------------------

// Hidden dependency:
//
// export const saveProduct = async (product: Product): Promise<void> => {
//     const repository = new ApiProductRepository();
//     await repository.save(product);
// };
//
// Explicit dependency:
//
// export const saveProduct = async (
//     repository: WritableProductRepository,
//     product: Product
// ): Promise<void> => {
//     await repository.save(product);
// };
//
// Explicit dependencies make architectural coupling visible.

// ---------------------------------------------------------------------
// 38. Dependency direction and module initialization
// ---------------------------------------------------------------------

// Be careful with module-level construction:
//
// const repository = new ApiProductRepository();
// const service = new ProductService(repository);
//
// This creates the dependency immediately when the module is evaluated.
//
// Construction at a composition boundary can provide clearer lifecycle control.

// ---------------------------------------------------------------------
// 39. Dependency direction and environment boundaries
// ---------------------------------------------------------------------

// Browser-specific infrastructure:
//
// BrowserStorage
//      ↑
// Application
//
// Server-specific infrastructure:
//
// ServerRepository
//      ↑
// Application
//
// The application should depend on a contract that can be implemented
// differently for each environment.

// ---------------------------------------------------------------------
// 40. Environment-specific implementation
// ---------------------------------------------------------------------

export interface Storage {
  readonly get: (key: string) => string | null;
  readonly set: (key: string, value: string) => void;
}

export const browserStorage: Storage = {
  get: (key: string): string | null => {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  },
  set: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  },
};

// Consumers depend on Storage.
// BrowserStorage is one concrete implementation.

// ---------------------------------------------------------------------
// 41. Dependency direction and framework boundaries
// ---------------------------------------------------------------------

// Framework code can be an infrastructure dependency:
//
// Application logic
//      ↓
// framework adapter
//
// Avoid spreading framework-specific APIs through every domain module
// when a narrower abstraction can isolate them.

// ---------------------------------------------------------------------
// 42. Dependency direction and external libraries
// ---------------------------------------------------------------------

// A feature that directly imports a large external library creates:
//
// Feature → external library
//
// This can be appropriate when the feature genuinely owns that dependency.
//
// A shared abstraction should not wrap every external library automatically.
// An abstraction is useful when it provides a meaningful architectural boundary.

// ---------------------------------------------------------------------
// 43. Dependency direction and adapters
// ---------------------------------------------------------------------

export interface Analytics {
  readonly track: (event: string) => void;
}

export class ConsoleAnalytics implements Analytics {
  public track(event: string): void {
    console.log(`Analytics event: ${event}`);
  }
}

// Application code can depend on Analytics.
// ConsoleAnalytics is an adapter that satisfies the contract.

// ---------------------------------------------------------------------
// 44. Adapter direction
// ---------------------------------------------------------------------

// The dependency direction is:
//
// Application → Analytics ← ConsoleAnalytics
//
// The application knows the abstraction.
// The adapter knows the concrete implementation.
//
// This avoids:
//
// Application → ConsoleAnalytics

// ---------------------------------------------------------------------
// 45. Dependency direction and stable abstractions
// ---------------------------------------------------------------------

// An abstraction should not exist merely to reverse an import arrow.
//
// Good abstraction:
//
// ProductService needs to retrieve products.
// ProductRepository expresses that requirement.
//
// Weak abstraction:
//
// Everything has an interface even when there is only one stable implementation
// and no meaningful architectural boundary.
//
// Dependency direction should improve the design rather than add ceremony.

// ---------------------------------------------------------------------
// 46. Dependency direction and abstraction ownership
// ---------------------------------------------------------------------

// The consumer should generally define the smallest abstraction it requires.
//
// Consumer:
//     "I need to find one product."
//
// Contract:
//
// interface ProductReader {
//     findById(...)
// }
//
// This is often more useful than importing a large infrastructure interface
// containing unrelated operations.

// ---------------------------------------------------------------------
// 47. Dependency direction and data transformation
// ---------------------------------------------------------------------

export interface ProductDto {
  readonly product_id: string;
  readonly display_name: string;
}

export const mapProductDto = (dto: ProductDto): Product => {
  return {
    id: dto.product_id,
    name: dto.display_name,
  };
};

// Infrastructure-specific transport shapes can be converted at the boundary.
// Domain and application code then depend on Product rather than ProductDto.

// ---------------------------------------------------------------------
// 48. Transformation boundary
// ---------------------------------------------------------------------

// External API:
//
// ProductDto
//      ↓
// adapter
//      ↓
// Product
//      ↓
// application
//      ↓
// UI
//
// This prevents transport-specific naming and structure from propagating
// throughout the application.

// ---------------------------------------------------------------------
// 49. Dependency direction and error boundaries
// ---------------------------------------------------------------------

export interface ProductError {
  readonly code: "not-found" | "unavailable";
  readonly message: string;
}

export const createProductError = (code: ProductError["code"], message: string): ProductError => {
  return {
    code,
    message,
  };
};

// Infrastructure errors can be translated into application-level errors
// so higher layers do not need to understand transport-specific failures.

// ---------------------------------------------------------------------
// 50. Dependency direction and React data fetching
// ---------------------------------------------------------------------

interface ProductViewProps {
  readonly productLoader: ProductLoader;
  readonly productId: string;
}

export const ProductView: FC<ProductViewProps> = ({ productLoader, productId }): ReactElement => {
  void productLoader;

  return (
    <section>
      <h2>Product</h2>
      <p>{productId}</p>
    </section>
  );
};

// The component depends on the operation it needs.
// It does not need to know whether the operation uses fetch, a database,
// a cache, or an in-memory implementation.

// ---------------------------------------------------------------------
// 51. Dependency direction and server/client boundaries
// ---------------------------------------------------------------------

// In an application with server/client boundaries:
//
// Client UI
//      ↓
// client-safe contract
//      ↓
// server-side operation
//      ↓
// infrastructure
//
// The exact mechanism depends on the framework architecture,
// but the principle remains the same: do not leak server-only dependencies
// into client modules.

// ---------------------------------------------------------------------
// 52. Dependency direction and serializable boundaries
// ---------------------------------------------------------------------

interface ProductViewModel {
  readonly id: string;
  readonly name: string;
}

export const toProductViewModel = (product: Product): ProductViewModel => {
  return {
    id: product.id,
    name: product.name,
  };
};

// A boundary can transform a rich internal model into a stable,
// transport-safe view model before passing it to another runtime or layer.

// ---------------------------------------------------------------------
// 53. Dependency direction and circular dependencies
// ---------------------------------------------------------------------

// A cycle looks like:
//
// module-a → module-b
//    ↑          ↓
//    └──────────┘
//
// Circular dependencies make initialization, reasoning, and refactoring harder.
//
// If a cycle appears, possible solutions include:
//
// - extracting a shared contract
// - moving a type to a lower-level module
// - inverting a dependency
// - introducing composition
// - removing an unnecessary dependency

// ---------------------------------------------------------------------
// 54. Breaking a circular dependency
// ---------------------------------------------------------------------

export interface ProductSelection {
  readonly productId: string;
}

export const createProductSelection = (productId: string): ProductSelection => {
  return { productId };
};

// A small stable contract can sometimes replace a dependency between
// two otherwise independent feature modules.

// ---------------------------------------------------------------------
// 55. Dependency direction and barrel files
// ---------------------------------------------------------------------

// Barrel files can accidentally create cycles:
//
// feature-a → index
// feature-b → index
// index → feature-a
// index → feature-b
//
// A public entry point should not indiscriminately re-export modules
// that also depend on that same entry point.

// ---------------------------------------------------------------------
// 56. Dependency direction and type imports
// ---------------------------------------------------------------------

// Type-only dependencies can reduce runtime coupling:
//
// import type {Product} from "./product";
//
// The dependency remains relevant to TypeScript,
// but no runtime module import is emitted for the type.

// ---------------------------------------------------------------------
// 57. Dependency direction and runtime dependencies
// ---------------------------------------------------------------------

// Distinguish:
//
// compile-time dependency
// runtime dependency
//
// A type import may establish only a compile-time relationship,
// while importing a function, class, or value establishes a runtime dependency.
//
// Architectural analysis should consider both.

// ---------------------------------------------------------------------
// 58. Dependency direction and dependency weight
// ---------------------------------------------------------------------

// Not all dependencies have the same architectural cost.
//
// A small type contract:
//
// Feature → Product
//
// is different from:
//
// Feature → large infrastructure package
//
// Dependency direction should therefore consider both direction and dependency weight.

// ---------------------------------------------------------------------
// 59. Dependency direction and change propagation
// ---------------------------------------------------------------------

// If:
//
// UI → Application → Domain
//
// then a change in Domain may affect Application and UI.
//
// If infrastructure changes behind an abstraction:
//
// Infrastructure → Domain abstraction
//
// the application can remain unchanged.
//
// Good boundaries reduce unnecessary change propagation.

// ---------------------------------------------------------------------
// 60. Dependency direction and volatility
// ---------------------------------------------------------------------

// Volatile implementation:
//
// HTTP client
// browser storage
// database adapter
//
// Stable requirement:
//
// ProductRepository
//
// The dependency graph should avoid forcing stable business behavior
// to depend directly on volatile infrastructure.

// ---------------------------------------------------------------------
// 61. Dependency direction and component libraries
// ---------------------------------------------------------------------

// A shared UI library should normally not import feature modules:
//
// shared-ui → products   // problematic
//
// Instead:
//
// products → shared-ui
//
// The consuming feature supplies the domain-specific behavior and content.

// ---------------------------------------------------------------------
// 62. Dependency direction and design systems
// ---------------------------------------------------------------------

interface DesignSystemButtonProps {
  readonly children: ReactNode;
  readonly onClick?: () => void;
}

export const DesignSystemButton: FC<DesignSystemButtonProps> = ({ children, onClick }): ReactElement => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

// The design-system component provides generic presentation.
// It does not import product, order, account, or other feature modules.

// ---------------------------------------------------------------------
// 63. Dependency direction and feature composition
// ---------------------------------------------------------------------

export const ProductAction: FC = (): ReactElement => {
  const handleSelect = (): void => {
    console.log("Product selected.");
  };

  return <DesignSystemButton onClick={handleSelect}>Select product</DesignSystemButton>;
};

// Feature code depends on the shared UI abstraction.
// The shared UI component remains independent of the feature.

// ---------------------------------------------------------------------
// 64. Dependency direction and dependency injection
// ---------------------------------------------------------------------

export interface ProductDependencies {
  readonly repository: ProductRepository;
  readonly analytics: Analytics;
}

export const createProductController = (dependencies: ProductDependencies) => {
  return {
    load: (productId: string): Promise<Product | null> => {
      return dependencies.repository.findById(productId);
    },
    trackSelection: (): void => {
      dependencies.analytics.track("product_selected");
    },
  };
};

// Dependencies are supplied from outside.
// The controller does not need to know how those dependencies are constructed.

// ---------------------------------------------------------------------
// 65. Composition root example
// ---------------------------------------------------------------------

export const createApplicationDependencies = (): ProductDependencies => {
  return {
    repository: new ApiProductRepository(),
    analytics: new ConsoleAnalytics(),
  };
};

// The composition root knows concrete implementations.
// Consumers receive ProductDependencies rather than constructing them themselves.

// ---------------------------------------------------------------------
// 66. Dependency direction checklist
// ---------------------------------------------------------------------

// Before introducing a dependency, ask:
//
// - Which module needs the capability?
// - Which module owns the capability?
// - Is the dependency pointing toward a stable boundary?
// - Is the dependency feature-specific or generic?
// - Can the dependency be expressed through a smaller contract?
// - Does the dependency create a cycle?
// - Does it expose infrastructure details unnecessarily?
// - Does it increase change propagation?
// - Should the dependency be injected instead of constructed?
//
// These questions make dependency direction an explicit design decision.

// ---------------------------------------------------------------------
// 67. Complete dependency-direction example
// ---------------------------------------------------------------------

export interface ProductApplication {
  readonly getProduct: (productId: string) => Promise<Product | null>;
}

export const createProductApplication = (repository: ProductReader): ProductApplication => {
  return {
    getProduct: (productId: string): Promise<Product | null> => {
      return repository.findById(productId);
    },
  };
};

interface ProductApplicationViewProps {
  readonly application: ProductApplication;
}

export const ProductApplicationView: FC<ProductApplicationViewProps> = ({ application }): ReactElement => {
  void application;

  return (
    <section>
      <h1>Product application</h1>
      <p>Application dependency received.</p>
    </section>
  );
};

export const DependencyDirectionExample: FC = (): ReactElement => {
  const repository = new InMemoryProductRepository();

  const application = createProductApplication(repository);

  return <ProductApplicationView application={application} />;
};

// The complete dependency direction is:
//
// React view
//     ↓
// application contract
//     ↓
// repository contract
//     ↑
// infrastructure implementation
//
// Concrete infrastructure is assembled outside the application behavior.
// The application depends on capabilities rather than implementation details.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A dependency exists when one module, component, or layer relies on another capability.
// - Dependency direction describes which architectural parts are allowed to depend on which others.
// - Import direction and runtime execution order are related concepts but are not the same thing.
// - High-level business behavior should avoid unnecessary direct dependencies on volatile infrastructure.
// - Abstractions can reverse dependency direction when the consumer owns the requirement and infrastructure implements it.
// - Dependency inversion commonly produces a graph where both the consumer and implementation point toward a stable contract.
// - Composition roots are appropriate places to assemble concrete implementations.
// - Dependency injection makes construction responsibility explicit and keeps consumers independent of concrete implementations.
// - Narrow contracts reduce the number of details that can propagate across a dependency boundary.
// - Domain logic should not depend on React, browser APIs, HTTP clients, or other presentation and infrastructure details.
// - Presentation components should depend on UI or application contracts rather than owning low-level infrastructure when a boundary exists.
// - Shared modules can be depended on by multiple features but should not depend back on those features.
// - Callbacks and composition can express dependencies without introducing upward module imports.
// - Repository, storage, analytics, and other infrastructure contracts allow application code to remain independent of concrete implementations.
// - Transport-specific DTOs should be transformed at boundaries so infrastructure details do not spread through the application.
// - Circular dependencies make initialization, reasoning, and refactoring harder and should be removed through extraction, inversion, or composition.
// - Type-only imports create compile-time relationships without necessarily creating runtime dependencies.
// - Dependency direction should be evaluated together with dependency weight, volatility, ownership, and change propagation.
// - An abstraction should provide a meaningful architectural boundary rather than merely exist to reverse an import arrow.
// - A healthy dependency graph makes stable requirements easier to preserve while allowing volatile implementations to change behind explicit boundaries.
