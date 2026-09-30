/**
 * Feature-Oriented Architecture
 * ==============================
 *
 * Feature-oriented architecture organizes application code around user-facing capabilities or
 * business features rather than primarily around technical layers. Each feature groups the
 * components, state, data access, and domain behavior required to implement a coherent capability.
 */

import { useState } from "react";
import type { FC, ReactElement, ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Organize around features
// ---------------------------------------------------------------------

// A feature represents a meaningful capability of the application.
// Examples include:
// - authentication
// - product search
// - checkout
// - profile management
// - notifications
//
// A feature-oriented structure keeps code that changes for the same reason close together.

// Conceptually:
//
// features/
//   products/
//   checkout/
//   profile/
//   notifications/
//
// The exact directory structure is a project decision.
// The architectural principle is that feature ownership drives organization.

// ---------------------------------------------------------------------
// 2. Feature boundaries
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

interface ProductCardProps {
  readonly product: Product;
  readonly onSelect: (productId: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onSelect }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${(product.priceInCents / 100).toFixed(2)}</p>
      <button type="button" onClick={() => onSelect(product.id)}>
        Select
      </button>
    </article>
  );
};

// ProductCard belongs to the product feature because its responsibility is
// specifically connected to presenting a product and selecting one.

// ---------------------------------------------------------------------
// 3. Feature-specific state
// ---------------------------------------------------------------------

interface ProductListProps {
  readonly products: readonly Product[];
}

export const ProductList: FC<ProductListProps> = ({ products }): ReactElement => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleSelect = (productId: string): void => {
    setSelectedProductId(productId);
  };

  return (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={handleSelect} />
      ))}
      <p>Selected: {selectedProductId ?? "None"}</p>
    </section>
  );
};

// State that exists only to support product selection can remain within
// the product feature rather than becoming application-wide state.

// ---------------------------------------------------------------------
// 4. Feature composition
// ---------------------------------------------------------------------

interface ProductPageProps {
  readonly products: readonly Product[];
}

export const ProductPage: FC<ProductPageProps> = ({ products }): ReactElement => {
  return (
    <section>
      <h1>Products</h1>
      <ProductList products={products} />
    </section>
  );
};

// A feature entry component composes the components that implement the feature.
// Consumers do not need to know the internal component structure.

// ---------------------------------------------------------------------
// 5. Feature-owned data access
// ---------------------------------------------------------------------

interface ProductRepository {
  readonly list: () => Promise<readonly Product[]>;
  readonly findById: (productId: string) => Promise<Product | null>;
}

const createProductRepository = (): ProductRepository => {
  const products: readonly Product[] = [
    { id: "product-1", name: "Notebook", priceInCents: 1200 },
    { id: "product-2", name: "Pen", priceInCents: 500 },
  ];

  return {
    list: async (): Promise<readonly Product[]> => products,
    findById: async (productId: string): Promise<Product | null> => {
      return products.find((product) => product.id === productId) ?? null;
    },
  };
};

// The product feature can own its data-access contract.
// The UI does not need to know whether products come from HTTP, a database,
// a cache, or another implementation.
export const ProductRepositoryExample: FC = (): ReactElement => {
  const repository = createProductRepository();

  void repository;

  return <ProductPage products={[]} />;
};

// ---------------------------------------------------------------------
// 6. Feature-specific transformation
// ---------------------------------------------------------------------

interface ProductResponse {
  readonly product_id: string;
  readonly product_name: string;
  readonly price: number;
}

const toProduct = (response: ProductResponse): Product => {
  return {
    id: response.product_id,
    name: response.product_name,
    priceInCents: response.price,
  };
};

export const ProductTransformationExample: FC = (): ReactElement => {
  const response: ProductResponse = {
    product_id: "product-1",
    product_name: "Notebook",
    price: 1200,
  };

  return <ProductCard product={toProduct(response)} onSelect={console.log} />;
};

// Transformation logic can remain close to the feature that understands
// the external representation and the feature's internal model.

// ---------------------------------------------------------------------
// 7. Feature-specific domain behavior
// ---------------------------------------------------------------------

interface CartItem {
  readonly productId: string;
  readonly quantity: number;
  readonly priceInCents: number;
}

const calculateCartTotal = (items: readonly CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity * item.priceInCents, 0);
};

export const CartTotalExample: FC = (): ReactElement => {
  const items: readonly CartItem[] = [
    { productId: "product-1", quantity: 2, priceInCents: 1200 },
    { productId: "product-2", quantity: 1, priceInCents: 500 },
  ];

  return <p>Total: ${(calculateCartTotal(items) / 100).toFixed(2)}</p>;
};

// Domain behavior belongs with the feature when it exists specifically
// to support that feature's business rules.

// ---------------------------------------------------------------------
// 8. Feature entry points
// ---------------------------------------------------------------------

interface SearchFeatureProps {
  readonly products: readonly Product[];
}

export const SearchFeature: FC<SearchFeatureProps> = ({ products }): ReactElement => {
  const [query, setQuery] = useState("");

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section>
      <h1>Search</h1>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
      <ProductList products={filteredProducts} />
    </section>
  );
};

// A feature entry point provides a coherent public surface.
// Internal components and helpers do not need to be exposed individually.

// ---------------------------------------------------------------------
// 9. Feature-specific hooks
// ---------------------------------------------------------------------

const useProductSearch = (
  products: readonly Product[],
): {
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly results: readonly Product[];
} => {
  const [query, setQuery] = useState("");

  const results = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));

  return {
    query,
    setQuery,
    results,
  };
};

export const ProductSearchWithHook: FC<SearchFeatureProps> = ({ products }): ReactElement => {
  const { query, setQuery, results } = useProductSearch(products);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" />
      <ProductList products={results} />
    </section>
  );
};

// A feature hook can group state and behavior that belong to the same feature.
// It does not need to become a global hook merely because it is reusable inside that feature.

// ---------------------------------------------------------------------
// 10. Feature state versus shared application state
// ---------------------------------------------------------------------

interface AuthenticationState {
  readonly userId: string | null;
  readonly isAuthenticated: boolean;
}

export const AuthenticationExample: FC = (): ReactElement => {
  const state: AuthenticationState = {
    userId: "user-1",
    isAuthenticated: true,
  };

  return <p>{state.isAuthenticated ? "Signed in" : "Signed out"}</p>;
};

// Authentication state may affect many features and therefore can legitimately
// have a broader application boundary.
//
// By contrast, product-search query state usually belongs only to the search feature.

// ---------------------------------------------------------------------
// 11. Feature-specific UI state
// ---------------------------------------------------------------------

interface FilterState {
  readonly category: string;
  readonly query: string;
}

interface ProductFiltersProps {
  readonly state: FilterState;
  readonly onChange: (state: FilterState) => void;
}

export const ProductFilters: FC<ProductFiltersProps> = ({ state, onChange }): ReactElement => {
  return (
    <section>
      <input
        value={state.query}
        onChange={(event) =>
          onChange({
            ...state,
            query: event.target.value,
          })
        }
        placeholder="Search"
      />
      <select
        value={state.category}
        onChange={(event) =>
          onChange({
            ...state,
            category: event.target.value,
          })
        }
      >
        <option value="all">All</option>
        <option value="office">Office</option>
        <option value="books">Books</option>
      </select>
    </section>
  );
};

// Filter state is meaningful within the product-search capability.
// It does not need to become a generic application state object.

// ---------------------------------------------------------------------
// 12. Feature composition over technical composition
// ---------------------------------------------------------------------

interface CheckoutItem {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly priceInCents: number;
}

interface CheckoutSummaryProps {
  readonly items: readonly CheckoutItem[];
  readonly onSubmit: () => void;
}

export const CheckoutSummary: FC<CheckoutSummaryProps> = ({ items, onSubmit }): ReactElement => {
  const totalInCents = items.reduce((total, item) => total + item.quantity * item.priceInCents, 0);

  return (
    <section>
      <p>Items: {items.length}</p>
      <p>Total: ${(totalInCents / 100).toFixed(2)}</p>
      <button type="button" onClick={onSubmit}>
        Place order
      </button>
    </section>
  );
};

// CheckoutSummary is organized around checkout behavior,
// not around a generic "summary components" technical category.

// ---------------------------------------------------------------------
// 13. Shared components versus feature components
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly children: ReactNode;
  readonly onClick: () => void;
}

export const Button: FC<ButtonProps> = ({ children, onClick }): ReactElement => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

// A generic Button has no product or checkout-specific knowledge.
// It can therefore serve as a shared UI primitive.
export const SharedButtonExample: FC = (): ReactElement => {
  return <Button onClick={() => console.log("Clicked")}>Continue</Button>;
};

// ---------------------------------------------------------------------
// 14. Do not prematurely extract feature code
// ---------------------------------------------------------------------

interface ProductBadgeProps {
  readonly product: Product;
}

export const ProductBadge: FC<ProductBadgeProps> = ({ product }): ReactElement => {
  return <span>{product.name}</span>;
};

// A component should not be moved into a shared area simply because it
// technically could be rendered by another component.
//
// Shared extraction is more useful when:
// - the abstraction has a clear generic contract
// - multiple features genuinely need the same behavior
// - the abstraction has stable semantics

// ---------------------------------------------------------------------
// 15. Feature APIs
// ---------------------------------------------------------------------

interface ProductFeatureProps {
  readonly products: readonly Product[];
  readonly onProductSelected: (productId: string) => void;
}

export const ProductFeature: FC<ProductFeatureProps> = ({ products, onProductSelected }): ReactElement => {
  return (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onSelect={onProductSelected} />
      ))}
    </section>
  );
};

// A feature can expose a small API:
// - inputs
// - outputs
// - entry components
//
// Internal helpers, data transformations, and implementation details can remain private.

// ---------------------------------------------------------------------
// 16. Feature-to-feature dependencies
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
}

interface CheckoutCustomerProps {
  readonly customer: User;
}

export const CheckoutCustomer: FC<CheckoutCustomerProps> = ({ customer }): ReactElement => {
  return <p>Customer: {customer.name}</p>;
};

// A checkout feature may need customer information from another feature.
// The dependency should cross the boundary through an explicit contract.
export const CheckoutCustomerExample: FC = (): ReactElement => {
  const customer: User = {
    id: "user-1",
    name: "John Doe",
  };

  return <CheckoutCustomer customer={customer} />;
};

// ---------------------------------------------------------------------
// 17. Avoid importing feature internals
// ---------------------------------------------------------------------

// Conceptually:
//
// features/
//   products/
//     ProductFeature.tsx
//     ProductCard.tsx
//     productRepository.ts
//
//   checkout/
//     CheckoutFeature.tsx
//
// Checkout should depend on the public product feature contract when possible,
// rather than reaching directly into private product implementation files.
//
// This keeps feature boundaries explicit and makes internal refactoring safer.

// ---------------------------------------------------------------------
// 18. Feature public APIs
// ---------------------------------------------------------------------

interface ProductSummaryProps {
  readonly product: Product;
}

export const ProductSummary: FC<ProductSummaryProps> = ({ product }): ReactElement => {
  return <span>{product.name}</span>;
};

// A feature can intentionally expose only selected components or functions.
// An architectural public API can conceptually look like:
//
// export {ProductFeature} from "./ProductFeature";
// export {ProductSummary} from "./ProductSummary";
//
// Internal components and helpers remain implementation details.

// ---------------------------------------------------------------------
// 19. Feature-specific validation
// ---------------------------------------------------------------------

interface CheckoutInput {
  readonly productId: string;
  readonly quantity: number;
}

const validateCheckoutInput = (input: CheckoutInput): string | null => {
  if (!input.productId) {
    return "A product is required.";
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    return "Quantity must be a positive integer.";
  }

  return null;
};

export const CheckoutValidationExample: FC = (): ReactElement => {
  const input: CheckoutInput = {
    productId: "product-1",
    quantity: 2,
  };

  const error = validateCheckoutInput(input);

  return <p>{error ?? "Checkout input is valid."}</p>;
};

// Validation rules that exist specifically for checkout belong to the checkout feature.
// Generic validation utilities can remain shared when they have genuinely generic semantics.

// ---------------------------------------------------------------------
// 20. Feature-specific business rules
// ---------------------------------------------------------------------

interface DiscountInput {
  readonly subtotalInCents: number;
  readonly customerType: "regular" | "member";
}

const calculateDiscount = (input: DiscountInput): number => {
  if (input.customerType === "member" && input.subtotalInCents >= 5000) {
    return Math.round(input.subtotalInCents * 0.1);
  }

  return 0;
};

export const DiscountExample: FC = (): ReactElement => {
  const discount = calculateDiscount({
    subtotalInCents: 6000,
    customerType: "member",
  });

  return <p>Discount: ${(discount / 100).toFixed(2)}</p>;
};

// The discount rule is a checkout/domain concern rather than a generic UI concern.

// ---------------------------------------------------------------------
// 21. Feature-level data loading state
// ---------------------------------------------------------------------

type ProductLoadState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "success"; readonly products: readonly Product[] }
  | { readonly status: "error"; readonly message: string };

interface ProductFeatureStateProps {
  readonly state: ProductLoadState;
}

export const ProductFeatureState: FC<ProductFeatureStateProps> = ({ state }): ReactElement => {
  switch (state.status) {
    case "idle":
      return <p>Ready to load products.</p>;
    case "loading":
      return <p>Loading products...</p>;
    case "error":
      return <p>{state.message}</p>;
    case "success":
      return <ProductList products={state.products} />;
  }
};

// The feature can expose a meaningful state model without exposing
// transport-specific request or response objects.

// ---------------------------------------------------------------------
// 22. Feature-level workflows
// ---------------------------------------------------------------------

interface CheckoutWorkflowProps {
  readonly items: readonly CheckoutItem[];
}

export const CheckoutWorkflow: FC<CheckoutWorkflowProps> = ({ items }): ReactElement => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (): void => {
    setSubmitted(true);
  };

  if (submitted) {
    return <p>Order submitted.</p>;
  }

  return <CheckoutSummary items={items} onSubmit={handleSubmit} />;
};

// A workflow component coordinates multiple steps belonging to one feature.
// The workflow state does not need to be globally accessible.

// ---------------------------------------------------------------------
// 23. Feature boundaries and routing
// ---------------------------------------------------------------------

interface RouteFeatureProps {
  readonly path: string;
}

export const RouteFeature: FC<RouteFeatureProps> = ({ path }): ReactElement => {
  if (path === "/products") {
    return <ProductPage products={[]} />;
  }

  if (path === "/checkout") {
    return <CheckoutWorkflow items={[]} />;
  }

  return <p>Page not found.</p>;
};

// Routing can select a feature entry point.
// The feature itself remains responsible for its internal composition and behavior.

// ---------------------------------------------------------------------
// 24. Feature-level testing boundaries
// ---------------------------------------------------------------------

interface PriceDisplayProps {
  readonly priceInCents: number;
}

export const PriceDisplay: FC<PriceDisplayProps> = ({ priceInCents }): ReactElement => {
  return <span>${(priceInCents / 100).toFixed(2)}</span>;
};

// Tests for a feature can exercise its public behavior without requiring knowledge
// of every internal component or helper.
//
// For example, a product feature test can verify that selecting a product produces
// the expected feature-level callback.

// ---------------------------------------------------------------------
// 25. Feature-specific infrastructure
// ---------------------------------------------------------------------

interface Analytics {
  readonly track: (eventName: string) => void;
}

interface ProductSelectionProps {
  readonly analytics: Analytics;
}

export const ProductSelectionWithAnalytics: FC<ProductSelectionProps> = ({ analytics }): ReactElement => {
  const handleSelect = (): void => {
    analytics.track("product_selected");
  };

  return (
    <button type="button" onClick={handleSelect}>
      Select product
    </button>
  );
};

// Feature infrastructure can be injected through narrow contracts.
// The component does not need to know which analytics provider implements the contract.
export const AnalyticsExample: FC = (): ReactElement => {
  const analytics: Analytics = {
    track: (eventName) => console.log(eventName),
  };

  return <ProductSelectionWithAnalytics analytics={analytics} />;
};

// ---------------------------------------------------------------------
// 26. Avoid a feature becoming a monolith
// ---------------------------------------------------------------------

// Feature-oriented architecture does not mean putting every line of a feature
// into one component or one file.
//
// A feature can contain several focused units:
//
// Product feature
//   - entry component
//   - feature-specific components
//   - state and hooks
//   - data-access contract
//   - transformations
//   - business rules
//
// The important boundary is the feature's ownership, not the physical size of one file.

// ---------------------------------------------------------------------
// 27. Feature cohesion
// ---------------------------------------------------------------------

interface Notification {
  readonly id: string;
  readonly message: string;
  readonly read: boolean;
}

interface NotificationListProps {
  readonly notifications: readonly Notification[];
  readonly onMarkRead: (notificationId: string) => void;
}

export const NotificationList: FC<NotificationListProps> = ({ notifications, onMarkRead }): ReactElement => {
  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>
          <span>{notification.message}</span>
          {!notification.read && (
            <button type="button" onClick={() => onMarkRead(notification.id)}>
              Mark as read
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

// A cohesive notification feature keeps notification-specific behavior together.
// Product code should not need to know how notification state or presentation works.

// ---------------------------------------------------------------------
// 28. Feature dependencies should point toward stable contracts
// ---------------------------------------------------------------------

interface PaymentMethod {
  readonly id: string;
  readonly label: string;
}

interface PaymentSelectorProps {
  readonly methods: readonly PaymentMethod[];
  readonly selectedId: string | null;
  readonly onSelect: (methodId: string) => void;
}

export const PaymentSelector: FC<PaymentSelectorProps> = ({ methods, selectedId, onSelect }): ReactElement => {
  return (
    <select value={selectedId ?? ""} onChange={(event) => onSelect(event.target.value)}>
      <option value="">Select payment method</option>
      {methods.map((method) => (
        <option key={method.id} value={method.id}>
          {method.label}
        </option>
      ))}
    </select>
  );
};

// The checkout feature can depend on the PaymentMethod contract without depending
// on the internal implementation of a payment-provider integration.

// ---------------------------------------------------------------------
// 29. Feature duplication versus premature sharing
// ---------------------------------------------------------------------

// Two features may initially have similar code.
//
// Similarity alone does not prove that they have the same responsibility.
// If their business rules, ownership, or reasons for change differ,
// keeping the implementations separate can preserve clearer boundaries.
//
// Sharing becomes more appropriate when the behavior has stable,
// genuinely common semantics.

// ---------------------------------------------------------------------
// 30. Feature-oriented architecture and reuse
// ---------------------------------------------------------------------

interface EmptyStateProps {
  readonly message: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ message }): ReactElement => {
  return <p>{message}</p>;
};

// Generic UI primitives can remain shared while feature-specific behavior stays local.
// Feature-oriented architecture does not eliminate shared code;
// it makes the ownership of shared versus feature-specific code explicit.

// ---------------------------------------------------------------------
// 31. Feature boundary smells
// ---------------------------------------------------------------------

// Common warning signs include:
// - one feature importing many private internals from another feature
// - feature components depending on unrelated application state
// - generic components containing feature-specific business rules
// - data-access code scattered across unrelated features
// - duplicated business rules with inconsistent behavior
// - a feature exposing every internal component as public API
// - a feature becoming responsible for several unrelated capabilities
//
// These signals suggest reviewing ownership and dependency direction.

// ---------------------------------------------------------------------
// 32. Complete feature example
// ---------------------------------------------------------------------

interface CatalogProduct {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

interface CatalogProps {
  readonly products: readonly CatalogProduct[];
}

const CatalogCard: FC<{
  readonly product: CatalogProduct;
  readonly onAdd: (productId: string) => void;
}> = ({ product, onAdd }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>${(product.priceInCents / 100).toFixed(2)}</p>
      <button type="button" onClick={() => onAdd(product.id)}>
        Add to cart
      </button>
    </article>
  );
};

const Catalog: FC<CatalogProps> = ({ products }): ReactElement => {
  const [addedProductIds, setAddedProductIds] = useState<readonly string[]>([]);

  const handleAdd = (productId: string): void => {
    setAddedProductIds((currentIds) => (currentIds.includes(productId) ? currentIds : [...currentIds, productId]));
  };

  return (
    <section>
      <h1>Product Catalog</h1>
      {products.map((product) => (
        <CatalogCard key={product.id} product={product} onAdd={handleAdd} />
      ))}
      <p>Added items: {addedProductIds.length}</p>
    </section>
  );
};

export const CatalogFeatureExample: FC = (): ReactElement => {
  const products: readonly CatalogProduct[] = [
    { id: "product-1", name: "Notebook", priceInCents: 1200 },
    { id: "product-2", name: "Pen", priceInCents: 500 },
  ];

  return <Catalog products={products} />;
};

// The catalog feature owns:
// - catalog-specific presentation
// - product selection behavior
// - feature-specific UI state
//
// The feature exposes a focused entry point.
// Its internal components and state-management details do not need to become
// dependencies of unrelated parts of the application.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Feature-oriented architecture organizes code around capabilities and business features.
// - A feature groups the components, state, data access, and behavior required by that capability.
// - Feature boundaries should expose focused public contracts rather than implementation details.
// - Feature-specific state should remain local unless other features genuinely need to coordinate it.
// - Feature-specific data access can isolate transport and persistence details.
// - Transformations and validation can protect feature models from external data representations.
// - Domain rules that exist specifically for a feature should remain close to that feature.
// - Shared UI primitives should be generic rather than containing feature-specific business behavior.
// - Feature-to-feature dependencies should cross explicit and stable contracts.
// - Public feature APIs should expose only the parts other features actually need.
// - Feature-oriented architecture does not require every feature to be contained in one component or file.
// - Similar code should not be shared automatically when the underlying responsibilities differ.
// - Feature cohesion is strengthened when code that changes for the same capability remains together.
// - Feature boundaries should prevent unrelated application concerns from becoming tightly coupled.
// - The goal is to make ownership, dependencies, and reasons for change visible in the architecture.
