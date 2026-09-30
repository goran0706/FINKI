/**
 * Domain-Oriented Architecture
 * =============================
 *
 * Domain-oriented architecture organizes application code around the business concepts, rules,
 * and behaviors that define the problem domain. The domain model should express business meaning
 * independently from UI, transport, persistence, and other infrastructure concerns.
 */

import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Domain concepts
// ---------------------------------------------------------------------

// A domain model represents concepts that have meaning within the business.
// These concepts should not depend on React components or transport formats.
interface Product {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

// The domain model describes the product itself.
// A UI component can consume this model without owning its business rules.

// ---------------------------------------------------------------------
// 2. Domain behavior
// ---------------------------------------------------------------------

interface CartItem {
  readonly productId: string;
  readonly quantity: number;
  readonly priceInCents: number;
}

const calculateCartItemTotal = (item: CartItem): number => {
  return item.quantity * item.priceInCents;
};

const calculateCartTotal = (items: readonly CartItem[]): number => {
  return items.reduce((total, item) => total + calculateCartItemTotal(item), 0);
};

export const CartTotalExample: FC = (): ReactElement => {
  const items: readonly CartItem[] = [
    { productId: "product-1", quantity: 2, priceInCents: 1200 },
    { productId: "product-2", quantity: 1, priceInCents: 500 },
  ];

  return <p>Total: ${(calculateCartTotal(items) / 100).toFixed(2)}</p>;
};

// Business behavior belongs with the domain concept it describes,
// rather than being scattered across unrelated UI components.

// ---------------------------------------------------------------------
// 3. Domain invariants
// ---------------------------------------------------------------------

const validateQuantity = (quantity: number): void => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }
};

const createCartItem = (productId: string, quantity: number, priceInCents: number): CartItem => {
  if (!productId) {
    throw new Error("Product ID is required.");
  }

  if (priceInCents < 0) {
    throw new Error("Price cannot be negative.");
  }

  validateQuantity(quantity);

  return {
    productId,
    quantity,
    priceInCents,
  };
};

export const CartItemExample: FC = (): ReactElement => {
  const item = createCartItem("product-1", 2, 1200);

  return <p>Quantity: {item.quantity}</p>;
};

// An invariant is a condition that must remain true for a valid domain object.
// Protecting invariants at the domain boundary prevents invalid states from spreading.

// ---------------------------------------------------------------------
// 4. Domain models versus transport models
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

export const ProductMappingExample: FC = (): ReactElement => {
  const response: ProductResponse = {
    product_id: "product-1",
    product_name: "Notebook",
    price: 1200,
  };

  const product = toProduct(response);

  return <p>{product.name}</p>;
};

// Transport models describe external representations.
// Domain models describe concepts used by the application's business logic.

// ---------------------------------------------------------------------
// 5. Value objects
// ---------------------------------------------------------------------

interface Money {
  readonly amountInCents: number;
  readonly currency: "USD" | "EUR";
}

const createMoney = (amountInCents: number, currency: Money["currency"]): Money => {
  if (!Number.isInteger(amountInCents) || amountInCents < 0) {
    throw new Error("Money amount must be a non-negative integer.");
  }

  return {
    amountInCents,
    currency,
  };
};

const formatMoney = (money: Money): string => {
  return `${money.currency} ${(money.amountInCents / 100).toFixed(2)}`;
};

export const MoneyExample: FC = (): ReactElement => {
  const price = createMoney(1200, "USD");

  return <p>{formatMoney(price)}</p>;
};

// A value object represents a domain value through its meaning and invariants.
// It does not need a database identity of its own.

// ---------------------------------------------------------------------
// 6. Domain-specific types
// ---------------------------------------------------------------------

type ProductId = string & { readonly __brand: "ProductId" };

const createProductId = (value: string): ProductId => {
  if (!value) {
    throw new Error("Product ID cannot be empty.");
  }

  return value as ProductId;
};

interface IdentifiedProduct {
  readonly id: ProductId;
  readonly name: string;
  readonly price: Money;
}

export const ProductIdExample: FC = (): ReactElement => {
  const productId = createProductId("product-1");

  const product: IdentifiedProduct = {
    id: productId,
    name: "Notebook",
    price: createMoney(1200, "USD"),
  };

  return <p>{product.name}</p>;
};

// Domain-specific types make important distinctions explicit.
// A ProductId should not accidentally be confused with an unrelated string.

// ---------------------------------------------------------------------
// 7. Entities
// ---------------------------------------------------------------------

interface Customer {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

const renameCustomer = (customer: Customer, name: string): Customer => {
  if (!name.trim()) {
    throw new Error("Customer name cannot be empty.");
  }

  return {
    ...customer,
    name,
  };
};

export const CustomerExample: FC = (): ReactElement => {
  const customer: Customer = {
    id: "customer-1",
    name: "John Doe",
    email: "john@example.com",
  };

  const renamedCustomer = renameCustomer(customer, "Jane Doe");

  return <p>{renamedCustomer.name}</p>;
};

// An entity has an identity that distinguishes it from other instances.
// Domain behavior can operate on the entity while preserving its identity.

// ---------------------------------------------------------------------
// 8. Aggregates
// ---------------------------------------------------------------------

interface OrderLine {
  readonly productId: string;
  readonly quantity: number;
  readonly unitPriceInCents: number;
}

interface Order {
  readonly id: string;
  readonly customerId: string;
  readonly lines: readonly OrderLine[];
  readonly status: "draft" | "submitted" | "cancelled";
}

const calculateOrderTotal = (order: Order): number => {
  return order.lines.reduce((total, line) => total + line.quantity * line.unitPriceInCents, 0);
};

// An aggregate groups related domain state under a consistency boundary.
// Operations on the aggregate should preserve its invariants.

// ---------------------------------------------------------------------
// 9. Aggregate invariants
// ---------------------------------------------------------------------

const submitOrder = (order: Order): Order => {
  if (order.lines.length === 0) {
    throw new Error("An order must contain at least one line.");
  }

  if (order.status !== "draft") {
    throw new Error("Only draft orders can be submitted.");
  }

  return {
    ...order,
    status: "submitted",
  };
};

export const OrderExample: FC = (): ReactElement => {
  const order: Order = {
    id: "order-1",
    customerId: "customer-1",
    lines: [
      {
        productId: "product-1",
        quantity: 2,
        unitPriceInCents: 1200,
      },
    ],
    status: "draft",
  };

  const submittedOrder = submitOrder(order);

  return <p>Status: {submittedOrder.status}</p>;
};

// The aggregate operation enforces rules instead of leaving every caller
// responsible for remembering those rules.

// ---------------------------------------------------------------------
// 10. Domain services
// ---------------------------------------------------------------------

interface DiscountPolicyInput {
  readonly subtotalInCents: number;
  readonly customerType: "regular" | "member";
}

const calculateDiscount = (input: DiscountPolicyInput): Money => {
  if (input.customerType === "member" && input.subtotalInCents >= 5000) {
    return createMoney(Math.round(input.subtotalInCents * 0.1), "USD");
  }

  return createMoney(0, "USD");
};

export const DiscountExample: FC = (): ReactElement => {
  const discount = calculateDiscount({
    subtotalInCents: 6000,
    customerType: "member",
  });

  return <p>Discount: {formatMoney(discount)}</p>;
};

// A domain service is useful when business behavior does not naturally belong
// to one entity or value object but still represents domain logic.

// ---------------------------------------------------------------------
// 11. Domain services should remain domain-focused
// ---------------------------------------------------------------------

interface ShippingQuote {
  readonly amountInCents: number;
  readonly currency: "USD" | "EUR";
}

const calculateShippingQuote = (itemCount: number, destination: "domestic" | "international"): ShippingQuote => {
  if (destination === "international") {
    return {
      amountInCents: 2500 + itemCount * 300,
      currency: "USD",
    };
  }

  return {
    amountInCents: 500 + itemCount * 100,
    currency: "USD",
  };
};

export const ShippingExample: FC = (): ReactElement => {
  const quote = calculateShippingQuote(3, "domestic");

  return <p>Shipping: {formatMoney(quote)}</p>;
};

// The service expresses a business rule.
// It does not perform HTTP requests, render components, or access browser APIs.

// ---------------------------------------------------------------------
// 12. Repositories represent domain-facing persistence contracts
// ---------------------------------------------------------------------

interface OrderRepository {
  readonly findById: (orderId: string) => Promise<Order | null>;
  readonly save: (order: Order) => Promise<void>;
}

const createOrderRepository = (): OrderRepository => {
  return {
    findById: async (): Promise<Order | null> => null,
    save: async (): Promise<void> => undefined,
  };
};

// The domain or application layer depends on what persistence can do,
// not on a specific database driver or HTTP client.

// ---------------------------------------------------------------------
// 13. Repository implementations stay outside the domain model
// ---------------------------------------------------------------------

interface DatabaseClient {
  readonly query: (sql: string) => Promise<readonly unknown[]>;
}

const createDatabaseOrderRepository = (database: DatabaseClient): OrderRepository => {
  return {
    findById: async (orderId: string): Promise<Order | null> => {
      const rows = await database.query(`SELECT * FROM orders WHERE id = '${orderId}'`);

      void rows;

      return null;
    },
    save: async (order: Order): Promise<void> => {
      void order;
    },
  };
};

// The repository implementation may use a database.
// The domain-facing contract does not need to know which database is used.

// ---------------------------------------------------------------------
// 14. Application services coordinate domain behavior
// ---------------------------------------------------------------------

interface SubmitOrderDependencies {
  readonly orders: OrderRepository;
}

const submitOrderApplication = async (orderId: string, dependencies: SubmitOrderDependencies): Promise<Order> => {
  const order = await dependencies.orders.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  const submittedOrder = submitOrder(order);

  await dependencies.orders.save(submittedOrder);

  return submittedOrder;
};

// The application service coordinates:
// - loading the aggregate
// - invoking domain behavior
// - persisting the result
//
// The business rule itself remains in submitOrder.

// ---------------------------------------------------------------------
// 15. Domain logic versus application orchestration
// ---------------------------------------------------------------------

const canCancelOrder = (order: Order): boolean => {
  return order.status === "draft" || order.status === "submitted";
};

const cancelOrder = (order: Order): Order => {
  if (!canCancelOrder(order)) {
    throw new Error("Order cannot be cancelled.");
  }

  return {
    ...order,
    status: "cancelled",
  };
};

// Domain logic answers business questions and performs business transitions.
// Application orchestration decides when and in what sequence those operations occur.

// ---------------------------------------------------------------------
// 16. UI should consume domain behavior, not duplicate it
// ---------------------------------------------------------------------

interface OrderActionsProps {
  readonly order: Order;
  readonly onSubmit: () => void;
  readonly onCancel: () => void;
}

export const OrderActions: FC<OrderActionsProps> = ({ order, onSubmit, onCancel }): ReactElement => {
  return (
    <div>
      {order.status === "draft" && (
        <button type="button" onClick={onSubmit}>
          Submit
        </button>
      )}
      {canCancelOrder(order) && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  );
};

// The UI can use domain-level predicates to decide what actions are available.
// It should not independently reimplement the business rule in another form.

// ---------------------------------------------------------------------
// 17. Domain models should not depend on React
// ---------------------------------------------------------------------

interface Address {
  readonly street: string;
  readonly city: string;
  readonly postalCode: string;
}

const formatAddress = (address: Address): string => {
  return `${address.street}, ${address.city}, ${address.postalCode}`;
};

// This domain model does not import React.
// It can be used by a component, a server process, a test, or another application layer.

// ---------------------------------------------------------------------
// 18. React adapts domain data for presentation
// ---------------------------------------------------------------------

interface AddressProps {
  readonly address: Address;
}

export const AddressView: FC<AddressProps> = ({ address }): ReactElement => {
  return <address>{formatAddress(address)}</address>;
};

export const AddressExample: FC = (): ReactElement => {
  const address: Address = {
    street: "100 Main Street",
    city: "Example City",
    postalCode: "10000",
  };

  return <AddressView address={address} />;
};

// The component is an adapter from domain data to a visual representation.

// ---------------------------------------------------------------------
// 19. Domain-oriented architecture separates concerns by meaning
// ---------------------------------------------------------------------

// Domain layer:
// - entities
// - value objects
// - aggregates
// - domain services
// - business rules
//
// Application layer:
// - workflows
// - orchestration
// - transaction coordination
// - use-case execution
//
// Infrastructure layer:
// - databases
// - HTTP clients
// - external services
// - persistence implementations
//
// Presentation layer:
// - React components
// - event handling
// - visual formatting
//
// The exact number of layers can vary.
// The important distinction is which layer owns each responsibility.

// ---------------------------------------------------------------------
// 20. Domain events
// ---------------------------------------------------------------------

type OrderEvent =
  | {
      readonly type: "order-submitted";
      readonly orderId: string;
    }
  | {
      readonly type: "order-cancelled";
      readonly orderId: string;
    };

const createOrderSubmittedEvent = (order: Order): OrderEvent => {
  return {
    type: "order-submitted",
    orderId: order.id,
  };
};

export const OrderEventExample: FC = (): ReactElement => {
  const order: Order = {
    id: "order-1",
    customerId: "customer-1",
    lines: [
      {
        productId: "product-1",
        quantity: 1,
        unitPriceInCents: 1200,
      },
    ],
    status: "submitted",
  };

  const event = createOrderSubmittedEvent(order);

  return <p>Event: {event.type}</p>;
};

// A domain event represents something meaningful that happened in the domain.
// Consumers can react to the event without changing the operation that produced it.

// ---------------------------------------------------------------------
// 21. Domain events versus UI events
// ---------------------------------------------------------------------

interface DomainEventHandler {
  readonly handle: (event: OrderEvent) => void;
}

const createOrderEventHandler = (): DomainEventHandler => {
  return {
    handle: (event: OrderEvent): void => {
      console.log(`Handled domain event: ${event.type}`);
    },
  };
};

export const DomainEventHandlerExample: FC = (): ReactElement => {
  const handler = createOrderEventHandler();

  handler.handle({
    type: "order-cancelled",
    orderId: "order-1",
  });

  return <p>Domain event handled.</p>;
};

// A click event describes a user interaction.
// An order-submitted event describes a domain occurrence.
// They belong to different architectural boundaries.

// ---------------------------------------------------------------------
// 22. Domain policies
// ---------------------------------------------------------------------

interface PricingContext {
  readonly customerType: "regular" | "member";
  readonly subtotalInCents: number;
}

interface PricingPolicy {
  readonly calculateDiscount: (context: PricingContext) => Money;
}

const memberPricingPolicy: PricingPolicy = {
  calculateDiscount: (context): Money => {
    if (context.customerType === "member" && context.subtotalInCents >= 5000) {
      return createMoney(Math.round(context.subtotalInCents * 0.1), "USD");
    }

    return createMoney(0, "USD");
  },
};

export const PricingPolicyExample: FC = (): ReactElement => {
  const discount = memberPricingPolicy.calculateDiscount({
    customerType: "member",
    subtotalInCents: 6000,
  });

  return <p>{formatMoney(discount)}</p>;
};

// Policies can make variable business rules explicit and replaceable.

// ---------------------------------------------------------------------
// 23. Domain errors
// ---------------------------------------------------------------------

class InvalidOrderError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidOrderError";
  }
}

const validateOrder = (order: Order): void => {
  if (order.lines.length === 0) {
    throw new InvalidOrderError("An order must contain at least one line.");
  }
};

export const DomainErrorExample: FC = (): ReactElement => {
  const order: Order = {
    id: "order-1",
    customerId: "customer-1",
    lines: [
      {
        productId: "product-1",
        quantity: 1,
        unitPriceInCents: 1200,
      },
    ],
    status: "draft",
  };

  validateOrder(order);

  return <p>Order is valid.</p>;
};

// Domain-specific errors can communicate business failures without exposing
// database, HTTP, or framework-specific error types.

// ---------------------------------------------------------------------
// 24. Domain-oriented validation
// ---------------------------------------------------------------------

const validateProduct = (product: Product): void => {
  if (!product.id) {
    throw new Error("Product ID is required.");
  }

  if (!product.name.trim()) {
    throw new Error("Product name is required.");
  }

  if (product.priceInCents < 0) {
    throw new Error("Product price cannot be negative.");
  }
};

export const ProductValidationExample: FC = (): ReactElement => {
  const product: Product = {
    id: "product-1",
    name: "Notebook",
    priceInCents: 1200,
  };

  validateProduct(product);

  return <p>{product.name} is valid.</p>;
};

// Domain validation protects rules that must hold regardless of which UI or API invokes them.

// ---------------------------------------------------------------------
// 25. Domain behavior should be reusable across entry points
// ---------------------------------------------------------------------

const calculateOrderTotalWithDiscount = (order: Order, discount: Money): Money => {
  const total = calculateOrderTotal(order);
  const discountedTotal = Math.max(0, total - discount.amountInCents);

  return createMoney(discountedTotal, discount.currency);
};

export const OrderPricingExample: FC = (): ReactElement => {
  const order: Order = {
    id: "order-1",
    customerId: "customer-1",
    lines: [
      {
        productId: "product-1",
        quantity: 2,
        unitPriceInCents: 3000,
      },
    ],
    status: "draft",
  };

  const discount = createMoney(500, "USD");
  const total = calculateOrderTotalWithDiscount(order, discount);

  return <p>{formatMoney(total)}</p>;
};

// The same domain calculation can be reused by a React UI, a server workflow,
// a background process, or another application entry point.

// ---------------------------------------------------------------------
// 26. Avoid UI-specific domain logic
// ---------------------------------------------------------------------

interface CheckoutViewProps {
  readonly order: Order;
}

export const CheckoutView: FC<CheckoutViewProps> = ({ order }): ReactElement => {
  const total = calculateOrderTotal(order);

  return (
    <section>
      <h2>Checkout</h2>
      <p>Total: ${(total / 100).toFixed(2)}</p>
    </section>
  );
};

// Formatting is presentation logic.
// Calculating the order total is domain logic.
// Keeping those responsibilities separate allows the business rule to be reused.

// ---------------------------------------------------------------------
// 27. Avoid infrastructure-specific domain logic
// ---------------------------------------------------------------------

interface PaymentGateway {
  readonly charge: (amountInCents: number, currency: string) => Promise<string>;
}

const createPaymentApplicationService = (gateway: PaymentGateway) => {
  return async (order: Order): Promise<string> => {
    const total = calculateOrderTotal(order);

    return gateway.charge(total, "USD");
  };
};

// The payment gateway is infrastructure.
// The amount being charged comes from domain behavior.
// The application service coordinates the two.

// ---------------------------------------------------------------------
// 28. Domain-oriented dependency direction
// ---------------------------------------------------------------------

// A useful dependency direction is:
//
// Presentation
//      ↓
// Application
//      ↓
// Domain
//
// Infrastructure can implement contracts required by the application or domain-facing ports.
//
// The domain should not depend on React, browser APIs, database drivers, or HTTP clients.

// ---------------------------------------------------------------------
// 29. Ports and adapters
// ---------------------------------------------------------------------

interface PaymentPort {
  readonly charge: (amountInCents: number, currency: "USD" | "EUR") => Promise<string>;
}

interface PaymentProvider {
  readonly createCharge: (amountInCents: number, currency: string) => Promise<string>;
}

const createPaymentAdapter = (provider: PaymentProvider): PaymentPort => {
  return {
    charge: (amountInCents, currency): Promise<string> => {
      return provider.createCharge(amountInCents, currency);
    },
  };
};

// A port expresses what the application or domain needs.
// An adapter translates that contract to a specific infrastructure implementation.

// ---------------------------------------------------------------------
// 30. Domain-oriented testing
// ---------------------------------------------------------------------

export const DomainCalculationExample: FC = (): ReactElement => {
  const order: Order = {
    id: "order-1",
    customerId: "customer-1",
    lines: [
      {
        productId: "product-1",
        quantity: 2,
        unitPriceInCents: 1500,
      },
    ],
    status: "draft",
  };

  const total = calculateOrderTotal(order);

  return <p>Total: {total} cents</p>;
};

// Domain functions with explicit inputs and outputs are straightforward to test.
// Their tests do not require React rendering, browser APIs, or database connections.

// ---------------------------------------------------------------------
// 31. Domain model versus feature model
// ---------------------------------------------------------------------

interface ProductSearchResult {
  readonly id: string;
  readonly displayName: string;
  readonly formattedPrice: string;
}

// Product is a domain concept.
// ProductSearchResult is a presentation-oriented model.
//
// They can legitimately be different:
//
// Product
//   id
//   name
//   priceInCents
//
// ProductSearchResult
//   id
//   displayName
//   formattedPrice
//
// A feature model should not be mistaken for the canonical domain model.

// ---------------------------------------------------------------------
// 32. Domain-oriented architecture does not mean one giant domain object
// ---------------------------------------------------------------------

// A domain can contain multiple concepts:
//
// Customer
// Product
// Order
// Payment
// Shipment
//
// Each concept can have focused data and behavior.
//
// The architecture should preserve meaningful boundaries between concepts
// rather than creating one universal ApplicationState or DomainModel.

// ---------------------------------------------------------------------
// 33. Bounded contexts
// ---------------------------------------------------------------------

interface CatalogProduct {
  readonly id: string;
  readonly name: string;
}

interface InventoryProduct {
  readonly productId: string;
  readonly availableQuantity: number;
}

// Two parts of an application can use different models for related concepts.
// Catalog cares about presentation and product identity.
// Inventory cares about stock availability.
//
// They may share identifiers without requiring one universal Product type.

// ---------------------------------------------------------------------
// 34. Domain-oriented React composition
// ---------------------------------------------------------------------

interface OrderSummaryProps {
  readonly order: Order;
}

export const OrderSummary: FC<OrderSummaryProps> = ({ order }): ReactElement => {
  const total = calculateOrderTotal(order);

  return (
    <article>
      <h2>Order {order.id}</h2>
      <p>Total: ${(total / 100).toFixed(2)}</p>
      <p>Status: {order.status}</p>
    </article>
  );
};

export const OrderPage: FC = (): ReactElement => {
  const order: Order = {
    id: "order-1",
    customerId: "customer-1",
    lines: [
      {
        productId: "product-1",
        quantity: 2,
        unitPriceInCents: 1200,
      },
    ],
    status: "draft",
  };

  return <OrderSummary order={order} />;
};

// React acts as the presentation layer.
// The domain model remains independent from the component implementation.

// ---------------------------------------------------------------------
// 35. Domain boundary smells
// ---------------------------------------------------------------------

// Common warning signs include:
// - domain objects importing React or browser APIs
// - business rules implemented only inside components
// - database models used directly as domain models
// - HTTP response shapes spreading throughout the domain
// - infrastructure exceptions becoming business concepts
// - large universal models representing unrelated concepts
// - domain rules duplicated across multiple features
// - application workflows mixed into low-level domain calculations
//
// These signals suggest that architectural responsibilities are crossing boundaries.

// ---------------------------------------------------------------------
// 36. Complete domain-oriented example
// ---------------------------------------------------------------------

interface PurchaseItem {
  readonly productId: ProductId;
  readonly quantity: number;
  readonly unitPrice: Money;
}

interface Purchase {
  readonly id: string;
  readonly customerId: string;
  readonly items: readonly PurchaseItem[];
  readonly status: "draft" | "submitted";
}

const calculatePurchaseTotal = (purchase: Purchase): Money => {
  const total = purchase.items.reduce((sum, item) => sum + item.quantity * item.unitPrice.amountInCents, 0);

  return createMoney(total, "USD");
};

const submitPurchase = (purchase: Purchase): Purchase => {
  if (purchase.items.length === 0) {
    throw new InvalidOrderError("A purchase must contain at least one item.");
  }

  if (purchase.status !== "draft") {
    throw new InvalidOrderError("Only draft purchases can be submitted.");
  }

  return {
    ...purchase,
    status: "submitted",
  };
};

interface PurchaseViewProps {
  readonly purchase: Purchase;
}

export const PurchaseView: FC<PurchaseViewProps> = ({ purchase }): ReactElement => {
  const total = calculatePurchaseTotal(purchase);

  return (
    <article>
      <h2>Purchase {purchase.id}</h2>
      <p>Total: {formatMoney(total)}</p>
      <p>Status: {purchase.status}</p>
    </article>
  );
};

export const PurchaseExample: FC = (): ReactElement => {
  const productId = createProductId("product-1");

  const purchase: Purchase = {
    id: "purchase-1",
    customerId: "customer-1",
    items: [
      {
        productId,
        quantity: 2,
        unitPrice: createMoney(1500, "USD"),
      },
    ],
    status: "draft",
  };

  const submittedPurchase = submitPurchase(purchase);

  return <PurchaseView purchase={submittedPurchase} />;
};

// The example separates the architectural concerns:
//
// Domain:
// - Purchase
// - PurchaseItem
// - Money
// - ProductId
// - calculatePurchaseTotal
// - submitPurchase
//
// Presentation:
// - PurchaseView
//
// The domain concepts and business rules do not depend on React.
// The React component consumes the domain model and renders its state.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Domain-oriented architecture organizes code around business concepts and rules.
// - Domain models should express business meaning independently from React and infrastructure.
// - Entities have identity, while value objects represent meaningful values and invariants.
// - Aggregates establish consistency boundaries around related domain state.
// - Domain services hold business behavior that does not naturally belong to one entity or value object.
// - Domain invariants should be protected close to the domain boundary.
// - Transport models and domain models should remain distinct when their purposes differ.
// - Repositories can expose persistence capabilities without coupling domain logic to a database.
// - Application services coordinate workflows while domain objects perform business behavior.
// - Domain events represent meaningful occurrences in the business domain.
// - Ports and adapters can isolate domain/application contracts from infrastructure implementations.
// - React components should adapt domain data for presentation rather than becoming the source of business rules.
// - Domain logic should be reusable independently of a particular UI or transport mechanism.
// - Bounded contexts may use different models for related concepts when their responsibilities differ.
// - Strong domain boundaries make business rules explicit, testable, and independent from technical infrastructure.
