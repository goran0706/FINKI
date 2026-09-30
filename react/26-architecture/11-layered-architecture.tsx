/**
 * Layered Architecture
 * =====================
 *
 * Layered architecture organizes an application into layers with distinct responsibilities
 * and explicit dependency directions. Each layer focuses on a particular concern while
 * collaborating with adjacent layers through well-defined interfaces.
 */

import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Layered architecture
// ---------------------------------------------------------------------

// A typical layered React application can be divided into:
//
// Presentation
//     ↓
// Application
//     ↓
// Domain
//     ↓
// Infrastructure
//
// Each layer has a primary responsibility.
// The exact number and names of layers can vary between applications.

// ---------------------------------------------------------------------
// 2. Presentation layer
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

interface ProductCardProps {
  readonly product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${(product.priceInCents / 100).toFixed(2)}</p>
    </article>
  );
};

// The presentation layer is responsible for rendering and user interaction.
// It should not contain persistence details or low-level infrastructure code.

// ---------------------------------------------------------------------
// 3. Presentation responsibilities
// ---------------------------------------------------------------------

interface ProductListProps {
  readonly products: readonly Product[];
  readonly onSelect: (productId: string) => void;
}

export const ProductList: FC<ProductListProps> = ({ products, onSelect }): ReactElement => {
  return (
    <section>
      {products.map((product) => (
        <button key={product.id} type="button" onClick={() => onSelect(product.id)}>
          {product.name}
        </button>
      ))}
    </section>
  );
};

// Presentation responsibilities commonly include:
// - rendering
// - user interaction
// - accessibility
// - visual state
// - formatting for display
//
// It should delegate business workflows to lower layers.

// ---------------------------------------------------------------------
// 4. Domain layer
// ---------------------------------------------------------------------

const calculateProductTotal = (product: Product, quantity: number): number => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }

  return product.priceInCents * quantity;
};

const isProductAvailable = (availableQuantity: number, requestedQuantity: number): boolean => {
  return requestedQuantity > 0 && requestedQuantity <= availableQuantity;
};

// Domain logic represents business rules.
// It should not depend on React components or database clients.

// ---------------------------------------------------------------------
// 5. Application layer
// ---------------------------------------------------------------------

interface ProductRepository {
  readonly findById: (productId: string) => Promise<Product | null>;
}

interface AddToCartResult {
  readonly product: Product;
  readonly quantity: number;
  readonly totalInCents: number;
}

const createAddToCartService = (products: ProductRepository) => {
  return async (productId: string, quantity: number): Promise<AddToCartResult> => {
    const product = await products.findById(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    return {
      product,
      quantity,
      totalInCents: calculateProductTotal(product, quantity),
    };
  };
};

// The application layer coordinates a use case.
// It decides which domain operations and infrastructure contracts are needed.

// ---------------------------------------------------------------------
// 6. Infrastructure layer
// ---------------------------------------------------------------------

interface DatabaseClient {
  readonly query: (statement: string, parameters: readonly string[]) => Promise<readonly Product[]>;
}

const createProductRepository = (database: DatabaseClient): ProductRepository => {
  return {
    findById: async (productId: string): Promise<Product | null> => {
      const products = await database.query("SELECT id, name, priceInCents FROM products WHERE id = ?", [productId]);

      return products[0] ?? null;
    },
  };
};

// Infrastructure contains technical implementations such as:
// - database access
// - HTTP clients
// - filesystem access
// - external service integrations
//
// Infrastructure should implement contracts required by higher-level layers.

// ---------------------------------------------------------------------
// 7. Layer responsibilities
// ---------------------------------------------------------------------

// Presentation:
// - renders UI
// - handles interaction
// - displays loading and error states
//
// Application:
// - coordinates use cases
// - manages workflow sequencing
// - controls application-level transactions
//
// Domain:
// - expresses business rules
// - protects business invariants
// - models business concepts
//
// Infrastructure:
// - communicates with technical systems
// - implements persistence and external integrations

// ---------------------------------------------------------------------
// 8. Dependency direction
// ---------------------------------------------------------------------

// A common dependency direction is:
//
// Presentation
//      ↓
// Application
//      ↓
// Domain
//
// Infrastructure implements contracts consumed by the application.
//
// The important rule is that higher-level business concerns should not become
// dependent on low-level technical details merely because those details are convenient.

// ---------------------------------------------------------------------
// 9. Domain dependencies
// ---------------------------------------------------------------------

interface Order {
  readonly id: string;
  readonly customerId: string;
  readonly totalInCents: number;
  readonly status: "draft" | "submitted";
}

const submitOrder = (order: Order): Order => {
  if (order.status !== "draft") {
    throw new Error("Only draft orders can be submitted.");
  }

  if (order.totalInCents <= 0) {
    throw new Error("An order must have a positive total.");
  }

  return {
    ...order,
    status: "submitted",
  };
};

// The domain function has no dependency on:
// - React
// - fetch
// - a database driver
// - localStorage
// - routing
//
// That keeps the business rule independent from implementation details.

// ---------------------------------------------------------------------
// 10. Application dependencies
// ---------------------------------------------------------------------

interface OrderRepository {
  readonly findById: (orderId: string) => Promise<Order | null>;
  readonly save: (order: Order) => Promise<void>;
}

const submitOrder = async (orderId: string, repository: OrderRepository): Promise<Order> => {
  const order = await repository.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  const submittedOrder = submitOrder(order);

  await repository.save(submittedOrder);

  return submittedOrder;
};

// The application layer depends on the repository contract,
// not on a particular persistence implementation.

// ---------------------------------------------------------------------
// 11. Infrastructure implementation
// ---------------------------------------------------------------------

interface OrderDatabase {
  readonly findOrder: (orderId: string) => Promise<Order | null>;
  readonly saveOrder: (order: Order) => Promise<void>;
}

const createDatabaseOrderRepository = (database: OrderDatabase): OrderRepository => {
  return {
    findById: database.findOrder,
    save: database.saveOrder,
  };
};

// The database implementation is an adapter.
// The application does not need to know how persistence works internally.

// ---------------------------------------------------------------------
// 12. Composition root
// ---------------------------------------------------------------------

const createApplication = (database: OrderDatabase) => {
  const orders = createDatabaseOrderRepository(database);

  return {
    submitOrder: (orderId: string): Promise<Order> => submitOrder(orderId, orders),
  };
};

// Composition connects concrete implementations to application contracts.
// This is commonly called the composition root because dependencies are assembled here.

// ---------------------------------------------------------------------
// 13. Presentation calling an application use case
// ---------------------------------------------------------------------

interface SubmitOrderButtonProps {
  readonly orderId: string;
  readonly onSubmit: (orderId: string) => Promise<void>;
}

export const SubmitOrderButton: FC<SubmitOrderButtonProps> = ({ orderId, onSubmit }): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        void onSubmit(orderId);
      }}
    >
      Submit order
    </button>
  );
};

// The component knows that submitting an order is an application operation.
// It does not need to know how the order is loaded or persisted.

// ---------------------------------------------------------------------
// 14. Presentation should not access infrastructure directly
// ---------------------------------------------------------------------

// Avoid:
//
// Component
//    ↓
// DatabaseClient
//
// Prefer:
//
// Component
//    ↓
// Application use case
//    ↓
// Repository contract
//    ↓
// Database adapter
//
// This keeps the presentation layer independent from persistence technology.

// ---------------------------------------------------------------------
// 15. Application services
// ---------------------------------------------------------------------

interface CreateProductInput {
  readonly name: string;
  readonly priceInCents: number;
}

const createProduct = (input: CreateProductInput): Product => {
  if (!input.name.trim()) {
    throw new Error("Product name is required.");
  }

  if (input.priceInCents < 0) {
    throw new Error("Product price cannot be negative.");
  }

  return {
    id: crypto.randomUUID(),
    name: input.name,
    priceInCents: input.priceInCents,
  };
};

// The application can invoke domain behavior while coordinating the use case.
// In a real application, ID generation could itself be abstracted behind a dependency.

// ---------------------------------------------------------------------
// 16. Separating application and domain logic
// ---------------------------------------------------------------------

const calculateDiscount = (subtotalInCents: number, customerType: "regular" | "member"): number => {
  if (customerType === "member" && subtotalInCents >= 5000) {
    return Math.round(subtotalInCents * 0.1);
  }

  return 0;
};

const calculateCheckoutTotal = async (
  orderId: string,
  repository: OrderRepository,
  customerType: "regular" | "member",
): Promise<number> => {
  const order = await repository.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  const discount = calculateDiscount(order.totalInCents, customerType);

  return order.totalInCents - discount;
};

// calculateDiscount is domain logic.
// calculateCheckoutTotal is application orchestration.
// Separating the two keeps workflow concerns from business calculations.

// ---------------------------------------------------------------------
// 17. Layered data flow
// ---------------------------------------------------------------------

// A typical request can move through the layers like this:
//
// User interaction
//      ↓
// React component
//      ↓
// Application use case
//      ↓
// Domain operation
//      ↓
// Repository contract
//      ↓
// Infrastructure adapter
//      ↓
// Database
//
// The response then travels back toward the presentation layer.

// ---------------------------------------------------------------------
// 18. Mapping between layers
// ---------------------------------------------------------------------

interface ProductRecord {
  readonly id: string;
  readonly name: string;
  readonly price_cents: number;
}

const mapProductRecord = (record: ProductRecord): Product => {
  return {
    id: record.id,
    name: record.name,
    priceInCents: record.price_cents,
  };
};

const mapProductForView = (
  product: Product,
): {
  readonly id: string;
  readonly name: string;
  readonly price: string;
} => {
  return {
    id: product.id,
    name: product.name,
    price: `$${(product.priceInCents / 100).toFixed(2)}`,
  };
};

// Mapping prevents external representations from spreading across every layer.

// ---------------------------------------------------------------------
// 19. View models
// ---------------------------------------------------------------------

interface ProductViewModel {
  readonly id: string;
  readonly name: string;
  readonly price: string;
}

const toProductViewModel = (product: Product): ProductViewModel => {
  return {
    id: product.id,
    name: product.name,
    price: `$${(product.priceInCents / 100).toFixed(2)}`,
  };
};

interface ProductViewProps {
  readonly product: ProductViewModel;
}

export const ProductView: FC<ProductViewProps> = ({ product }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>{product.price}</p>
    </article>
  );
};

// A view model is shaped for presentation.
// It does not need to be identical to the domain model.

// ---------------------------------------------------------------------
// 20. Avoid leaking database models
// ---------------------------------------------------------------------

interface UserRecord {
  readonly user_id: string;
  readonly display_name: string;
  readonly email_address: string;
}

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

const mapUserRecord = (record: UserRecord): User => {
  return {
    id: record.user_id,
    name: record.display_name,
    email: record.email_address,
  };
};

// Passing UserRecord throughout the application would couple unrelated layers
// to database naming conventions such as user_id and email_address.

// ---------------------------------------------------------------------
// 21. Layered validation
// ---------------------------------------------------------------------

interface RegistrationInput {
  readonly name: string;
  readonly email: string;
}

// Presentation validation improves user experience.
const hasRequiredRegistrationFields = (input: RegistrationInput): boolean => {
  return Boolean(input.name.trim() && input.email.trim());
};

// Domain/application validation protects the actual business operation.
const validateRegistration = (input: RegistrationInput): void => {
  if (!input.name.trim()) {
    throw new Error("Name is required.");
  }

  if (!input.email.includes("@")) {
    throw new Error("A valid email address is required.");
  }
};

// Client-side validation should not be treated as the authoritative business boundary.
// Important rules must remain enforced where the operation is actually executed.

// ---------------------------------------------------------------------
// 22. Layered error handling
// ---------------------------------------------------------------------

class ProductNotFoundError extends Error {
  public constructor(productId: string) {
    super(`Product ${productId} was not found.`);
    this.name = "ProductNotFoundError";
  }
}

const findProductOrThrow = (product: Product | null): Product => {
  if (!product) {
    throw new ProductNotFoundError("unknown");
  }

  return product;
};

// Lower layers can expose meaningful errors.
// The presentation layer can translate those errors into user-facing messages.

// ---------------------------------------------------------------------
// 23. Presentation error handling
// ---------------------------------------------------------------------

interface ErrorMessageProps {
  readonly message: string;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ message }): ReactElement => {
  return <p role="alert">{message}</p>;
};

// The presentation layer decides how an error should appear.
// It should not need to know whether the original failure came from SQL,
// HTTP, filesystem access, or another infrastructure implementation.

// ---------------------------------------------------------------------
// 24. Infrastructure errors should be translated
// ---------------------------------------------------------------------

class DatabaseError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

const loadProduct = async (repository: ProductRepository, productId: string): Promise<Product> => {
  try {
    const product = await repository.findById(productId);

    if (!product) {
      throw new ProductNotFoundError(productId);
    }

    return product;
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      throw error;
    }

    throw new DatabaseError("Unable to load product.");
  }
};

// Translating low-level failures prevents infrastructure-specific errors
// from becoming part of every higher-level interface.

// ---------------------------------------------------------------------
// 25. Layered state ownership
// ---------------------------------------------------------------------

interface ProductPageState {
  readonly selectedProductId: string | null;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
}

// UI state belongs to the presentation layer when it exists only to control the UI.
//
// Business state belongs to the domain/application model when it represents
// information or rules that exist independently of the UI.

// ---------------------------------------------------------------------
// 26. Server data versus UI state
// ---------------------------------------------------------------------

interface ProductPageProps {
  readonly product: Product;
}

export const ProductPage: FC<ProductPageProps> = ({ product }): ReactElement => {
  return (
    <section>
      <ProductCard product={product} />
    </section>
  );
};

// Product is application/domain data.
// Whether a dialog is open, which tab is selected, or whether a button is focused
// is presentation state and does not belong in the domain model.

// ---------------------------------------------------------------------
// 27. Layered dependency injection
// ---------------------------------------------------------------------

interface Clock {
  readonly now: () => Date;
}

interface OrderServiceDependencies {
  readonly repository: OrderRepository;
  readonly clock: Clock;
}

const createOrderService = (dependencies: OrderServiceDependencies) => {
  return {
    getOrder: async (orderId: string): Promise<Order> => {
      const order = await dependencies.repository.findById(orderId);

      if (!order) {
        throw new Error("Order not found.");
      }

      void dependencies.clock.now();

      return order;
    },
  };
};

// Dependencies can be injected at layer boundaries.
// This avoids hard-coding infrastructure implementations into application services.

// ---------------------------------------------------------------------
// 28. Testing layered components
// ---------------------------------------------------------------------

const inMemoryProductRepository: ProductRepository = {
  findById: async (productId: string): Promise<Product | null> => {
    if (productId !== "product-1") {
      return null;
    }

    return {
      id: "product-1",
      name: "Notebook",
      priceInCents: 1200,
    };
  },
};

export const TestableProductExample: FC = (): ReactElement => {
  const product = {
    id: "product-1",
    name: "Notebook",
    priceInCents: 1200,
  };

  const total = calculateProductTotal(product, 2);

  void inMemoryProductRepository;

  return <p>Total: ${(total / 100).toFixed(2)}</p>;
};

// Layer boundaries make dependencies replaceable.
// An in-memory repository can replace a real database during application-level tests.

// ---------------------------------------------------------------------
// 29. Avoid anemic layers
// ---------------------------------------------------------------------

// A weak layered design can produce:
//
// Controller → Service → Repository → Database
//
// where the service merely forwards calls and all meaningful behavior
// remains scattered throughout controllers and components.
//
// Layers should represent actual responsibilities rather than existing only
// because a diagram contains four boxes.

// ---------------------------------------------------------------------
// 30. Avoid overly thick layers
// ---------------------------------------------------------------------

// A layer becomes too thick when it accumulates responsibilities belonging elsewhere.
//
// For example:
//
// Presentation:
// - database queries
// - business rules
// - data transformation
// - HTTP authentication
// - persistence retries
//
// Application:
// - JSX rendering
// - CSS decisions
//
// Domain:
// - SQL statements
//
// Infrastructure:
// - business policy
//
// Layering works when responsibilities remain coherent.

// ---------------------------------------------------------------------
// 31. Layer boundaries should expose narrow contracts
// ---------------------------------------------------------------------

interface ProductReader {
  readonly findById: (productId: string) => Promise<Product | null>;
}

const loadProductForDisplay = async (productId: string, reader: ProductReader): Promise<ProductViewModel> => {
  const product = await reader.findById(productId);

  if (!product) {
    throw new ProductNotFoundError(productId);
  }

  return toProductViewModel(product);
};

// The application does not need the entire infrastructure API.
// It only receives the capability required for this operation.

// ---------------------------------------------------------------------
// 32. Layered feature composition
// ---------------------------------------------------------------------

interface ProductPageContainerProps {
  readonly productReader: ProductReader;
}

export const ProductPageContainer: FC<ProductPageContainerProps> = ({ productReader }): ReactElement => {
  // In a real application, asynchronous loading would usually be handled
  // by the surrounding application framework or data-fetching layer.
  void productReader;

  return (
    <section>
      <h1>Product</h1>
      <p>Product data is supplied by the application layer.</p>
    </section>
  );
};

// The container coordinates application data.
// The presentational component can remain focused on rendering.

// ---------------------------------------------------------------------
// 33. Layering and module boundaries
// ---------------------------------------------------------------------

// A directory structure might conceptually look like:
//
// presentation/
//   ProductPage
//   ProductCard
//   ErrorMessage
//
// application/
//   loadProduct
//   submitOrder
//   createProduct
//
// domain/
//   Product
//   Order
//   pricing rules
//   validation
//
// infrastructure/
//   database repositories
//   HTTP clients
//   external service adapters
//
// The exact directory structure is less important than maintaining clear responsibilities.

// ---------------------------------------------------------------------
// 34. Layered architecture and React Server Components
// ---------------------------------------------------------------------

// In a React application that uses Server Components:
//
// Presentation
//     ↓
// Server-side application logic
//     ↓
// Domain
//     ↓
// Infrastructure
//
// Server Components can participate in the presentation layer while accessing
// server-side application capabilities through appropriate architectural boundaries.
//
// Client Components remain responsible for interactive client behavior.

// ---------------------------------------------------------------------
// 35. Client-side presentation boundary
// ---------------------------------------------------------------------

interface QuantitySelectorProps {
  readonly quantity: number;
  readonly onChange: (quantity: number) => void;
}

export const QuantitySelector: FC<QuantitySelectorProps> = ({ quantity, onChange }): ReactElement => {
  return (
    <div>
      <button type="button" onClick={() => onChange(Math.max(1, quantity - 1))}>
        -
      </button>
      <span>{quantity}</span>
      <button type="button" onClick={() => onChange(quantity + 1)}>
        +
      </button>
    </div>
  );
};

// This component manages interaction semantics.
// It does not decide whether a product may actually be purchased.
// That rule belongs to the appropriate business/application boundary.

// ---------------------------------------------------------------------
// 36. Layered transaction boundaries
// ---------------------------------------------------------------------

interface Transaction {
  readonly run: <T>(operation: () => Promise<T>) => Promise<T>;
}

interface OrderApplicationDependencies {
  readonly orders: OrderRepository;
  readonly transaction: Transaction;
}

const createOrderApplication = (dependencies: OrderApplicationDependencies) => {
  return {
    submit: async (orderId: string): Promise<Order> => {
      return dependencies.transaction.run(async () => {
        const order = await dependencies.orders.findById(orderId);

        if (!order) {
          throw new Error("Order not found.");
        }

        const submitted = submitOrder(order);

        await dependencies.orders.save(submitted);

        return submitted;
      });
    },
  };
};

// Transaction coordination belongs to the application/infrastructure boundary,
// rather than being embedded inside a presentation component.

// ---------------------------------------------------------------------
// 37. Layered architecture and external APIs
// ---------------------------------------------------------------------

interface ProductApiClient {
  readonly getProduct: (productId: string) => Promise<ProductResponse>;
}

const createApiProductRepository = (client: ProductApiClient): ProductRepository => {
  return {
    findById: async (productId: string): Promise<Product | null> => {
      const response = await client.getProduct(productId);

      return toProduct(response);
    },
  };
};

// The API client remains an infrastructure concern.
// The application receives a ProductRepository rather than an API response shape.

// ---------------------------------------------------------------------
// 38. When layers should communicate
// ---------------------------------------------------------------------

// Good communication:
//
// Presentation → Application
// Application → Domain
// Application → Repository contract
// Infrastructure → Repository contract
//
// Risky communication:
//
// Presentation → Database
// Domain → React
// Domain → HTTP client
// Domain → browser storage
// Presentation → SQL
//
// Direct communication across multiple layers can bypass important boundaries.

// ---------------------------------------------------------------------
// 39. Layered architecture tradeoffs
// ---------------------------------------------------------------------

// Benefits:
// - responsibilities are explicit
// - dependencies can be controlled
// - infrastructure can be replaced
// - business logic can be tested independently
// - teams can reason about ownership
//
// Costs:
// - more interfaces and mappings
// - more files and abstractions
// - simple features can require several layers
// - incorrect layering can create unnecessary indirection
//
// Layering should be proportional to the complexity of the application.

// ---------------------------------------------------------------------
// 40. Avoid layering by ceremony
// ---------------------------------------------------------------------

// Not every function needs:
//
// Controller
// → Service
// → Manager
// → Repository
// → Adapter
// → Provider
//
// If a feature has no meaningful distinction between responsibilities,
// adding layers can make the design harder to understand.
//
// Use layers where they provide an architectural boundary.

// ---------------------------------------------------------------------
// 41. Layered architecture versus component boundaries
// ---------------------------------------------------------------------

// A component boundary and an architectural layer solve different problems.
//
// Component boundary:
// - defines a React component's public interface
// - controls rendering responsibility
// - manages component-level state
//
// Architectural layer:
// - defines responsibility across the application
// - controls dependency direction
// - separates technical and business concerns
//
// A single layer can contain many components and modules.

// ---------------------------------------------------------------------
// 42. Complete layered example
// ---------------------------------------------------------------------

interface CatalogRepository {
  readonly findById: (productId: string) => Promise<Product | null>;
}

const createCatalogApplication = (repository: CatalogRepository) => {
  return {
    getProduct: async (productId: string): Promise<ProductViewModel> => {
      const product = await repository.findById(productId);

      if (!product) {
        throw new ProductNotFoundError(productId);
      }

      return toProductViewModel(product);
    },
  };
};

interface CatalogPageProps {
  readonly product: ProductViewModel;
}

export const CatalogPage: FC<CatalogPageProps> = ({ product }): ReactElement => {
  return (
    <main>
      <h1>Catalog</h1>
      <ProductView product={product} />
    </main>
  );
};

// The complete flow is:
//
// Presentation:
//   CatalogPage
//
// Application:
//   createCatalogApplication().getProduct()
//
// Domain:
//   Product
//   product validation and business rules
//
// Infrastructure:
//   CatalogRepository implementation
//
// Each layer has a distinct responsibility while participating in one workflow.

// ---------------------------------------------------------------------
// 43. Layered architecture checklist
// ---------------------------------------------------------------------

// When defining a layer, ask:
//
// 1. What responsibility belongs here?
// 2. Which concepts should this layer know about?
// 3. Which concepts should it not know about?
// 4. Which direction may dependencies flow?
// 5. Does this layer expose a narrow contract?
// 6. Can its implementation be replaced without changing higher layers?
// 7. Is business logic located where it can be reused?
// 8. Is the layer providing a real boundary or only adding ceremony?

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Layered architecture separates an application into responsibilities with explicit dependency directions.
// - Presentation handles rendering and interaction rather than persistence or core business rules.
// - Application services coordinate use cases and workflows across domain and infrastructure boundaries.
// - The domain layer contains business concepts, rules, invariants, and behavior.
// - Infrastructure implements technical concerns such as databases, APIs, and external services.
// - Higher-level layers should depend on narrow contracts instead of concrete infrastructure implementations.
// - Mapping between database, transport, domain, and view models prevents representations from leaking across layers.
// - Application services should coordinate domain behavior rather than duplicate or replace it.
// - Domain logic should remain independent from React, databases, HTTP clients, and browser APIs.
// - React components should consume application or domain data through explicit presentation boundaries.
// - Dependency injection makes infrastructure replaceable and improves testability.
// - Layered architecture is useful when the boundaries provide meaningful separation of responsibility.
// - Adding layers purely for ceremony can create unnecessary indirection and complexity.
// - The goal is not a fixed number of layers but clear ownership, controlled dependencies, and coherent responsibilities.
