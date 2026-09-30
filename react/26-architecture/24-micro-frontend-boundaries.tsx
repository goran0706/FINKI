/**
 * Micro-Frontend Boundaries
 * =========================
 *
 * Micro-frontend boundaries define how independently owned frontend capabilities are separated
 * from one another and how they communicate. A useful boundary limits the knowledge, state,
 * implementation details, and dependencies that one micro-frontend needs about another.
 *
 * Strong boundaries make ownership and independent delivery possible. Weak boundaries create
 * hidden coupling, shared state, synchronized releases, and a distributed monolith.
 */

import { useState } from "react";
import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. What a micro-frontend boundary is
// ---------------------------------------------------------------------

// A micro-frontend boundary separates one independently owned capability
// from another.
//
// A useful boundary defines:
// - what the capability owns
// - what it exposes
// - what it consumes
// - how other capabilities communicate with it
// - which implementation details remain private

interface MicroFrontendBoundary {
  readonly name: string;
  readonly responsibility: string;
  readonly owner: string;
}

const catalogBoundary: MicroFrontendBoundary = {
  name: "Catalog",
  responsibility: "Product discovery and browsing",
  owner: "Catalog Team",
};

// ---------------------------------------------------------------------
// 2. Capability boundaries
// ---------------------------------------------------------------------

interface Capability {
  readonly name: string;
  readonly responsibilities: readonly string[];
}

const catalogCapability: Capability = {
  name: "Catalog",
  responsibilities: ["Search products", "Display products", "Select products"],
};

// A boundary should normally follow a cohesive business capability rather
// than an arbitrary collection of UI components.

// ---------------------------------------------------------------------
// 3. Ownership defines the boundary
// ---------------------------------------------------------------------

interface CapabilityOwnership {
  readonly capability: string;
  readonly owner: string;
  readonly deploymentOwner: string;
}

const checkoutOwnership: CapabilityOwnership = {
  capability: "Checkout",
  owner: "Checkout Team",
  deploymentOwner: "Checkout Team",
};

// A boundary is stronger when one team can make decisions about the code,
// behavior, data, and deployment inside that boundary.

// ---------------------------------------------------------------------
// 4. Internal implementation stays private
// ---------------------------------------------------------------------

interface CatalogProduct {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

interface CatalogProps {
  readonly products: readonly CatalogProduct[];
}

const CatalogProductCard: FC<{
  readonly product: CatalogProduct;
}> = ({ product }): ReactElement => {
  return (
    <li>
      {product.name} — ${product.price.toFixed(2)}
    </li>
  );
};

export const Catalog: FC<CatalogProps> = ({ products }): ReactElement => {
  return (
    <section>
      <h2>Catalog</h2>
      <ul>
        {products.map((product) => (
          <CatalogProductCard key={product.id} product={product} />
        ))}
      </ul>
    </section>
  );
};

// CatalogProductCard is an implementation detail.
//
// Other micro-frontends should not need to know that this component exists.

// ---------------------------------------------------------------------
// 5. Public boundary
// ---------------------------------------------------------------------

interface CatalogPublicApi {
  readonly render: (products: readonly CatalogProduct[]) => ReactElement;
}

export const catalogApi: CatalogPublicApi = {
  render: (products) => <Catalog products={products} />,
};

// A public API exposes only the capabilities required by consumers.
//
// Internal components, hooks, repositories, and state should remain private.

// ---------------------------------------------------------------------
// 6. Narrow public contracts
// ---------------------------------------------------------------------

interface ProductReference {
  readonly id: string;
}

interface ProductSelectionApi {
  readonly selectProduct: (product: ProductReference) => void;
}

// A narrow contract communicates only the information needed by the consumer.
//
// Passing an entire internal product model would expose more of the producer's
// implementation than necessary.

// ---------------------------------------------------------------------
// 7. Contract ownership
// ---------------------------------------------------------------------

interface ContractOwnership {
  readonly contract: string;
  readonly owner: string;
  readonly consumers: readonly string[];
}

const productSelectionContract: ContractOwnership = {
  contract: "ProductSelection",
  owner: "Catalog",
  consumers: ["Checkout"],
};

// A cross-boundary contract needs clear ownership.
//
// Without ownership, every consumer may assume it can change the contract.

// ---------------------------------------------------------------------
// 8. Producer and consumer
// ---------------------------------------------------------------------

interface BoundaryRelationship {
  readonly producer: string;
  readonly consumer: string;
  readonly contract: string;
}

const catalogToCheckoutRelationship: BoundaryRelationship = {
  producer: "Catalog",
  consumer: "Checkout",
  contract: "ProductSelection",
};

// The producer owns the meaning of the contract.
//
// The consumer depends on the contract rather than on the producer's internals.

// ---------------------------------------------------------------------
// 9. Avoid internal imports
// ---------------------------------------------------------------------

interface PublicCatalogNavigation {
  readonly openProduct: (productId: string) => void;
}

const catalogNavigation: PublicCatalogNavigation = {
  openProduct: (productId) => {
    console.log(`Opening product: ${productId}`);
  },
};

// A consumer should depend on a public API such as catalogNavigation.
//
// Importing internal files from another micro-frontend bypasses the boundary.

// ---------------------------------------------------------------------
// 10. Explicit inputs
// ---------------------------------------------------------------------

interface SearchInputProps {
  readonly initialQuery?: string;
  readonly onSearch: (query: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({ initialQuery = "", onSearch }): ReactElement => {
  const [query, setQuery] = useState(initialQuery);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(query);
      }}
    >
      <input onChange={(event) => setQuery(event.target.value)} value={query} />
      <button type="submit">Search</button>
    </form>
  );
};

// Explicit props create a visible input boundary.
//
// The parent does not need to know how the input stores or submits its local state.

// ---------------------------------------------------------------------
// 11. Explicit outputs
// ---------------------------------------------------------------------

interface ProductSelectorProps {
  readonly productId: string;
  readonly onSelected: (productId: string) => void;
}

export const ProductSelector: FC<ProductSelectorProps> = ({ productId, onSelected }): ReactElement => {
  return (
    <button onClick={() => onSelected(productId)} type="button">
      Select
    </button>
  );
};

// Callback contracts provide explicit output from a capability.
//
// The consumer decides what should happen after the event.

// ---------------------------------------------------------------------
// 12. Semantic callbacks
// ---------------------------------------------------------------------

interface CartActionsProps {
  readonly onCheckoutRequested: () => void;
}

export const CartActions: FC<CartActionsProps> = ({ onCheckoutRequested }): ReactElement => {
  return (
    <button onClick={onCheckoutRequested} type="button">
      Continue to checkout
    </button>
  );
};

// A semantic callback such as onCheckoutRequested communicates intent.
//
// A generic callback such as onClick exposes less meaning at the boundary.

// ---------------------------------------------------------------------
// 13. Composition through children
// ---------------------------------------------------------------------

interface CapabilityShellProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const CapabilityShell: FC<CapabilityShellProps> = ({ title, children }): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

// Composition through children can preserve ownership of the child content.
//
// The shell controls layout while the capability controls its own implementation.

// ---------------------------------------------------------------------
// 14. Slots instead of internal knowledge
// ---------------------------------------------------------------------

interface ApplicationRegionProps {
  readonly children: ReactNode;
}

export const ApplicationRegion: FC<ApplicationRegionProps> = ({ children }): ReactElement => {
  return <div>{children}</div>;
};

// A slot allows the host to compose independently owned content without
// requiring knowledge of its internal component hierarchy.

// ---------------------------------------------------------------------
// 15. Application shell boundary
// ---------------------------------------------------------------------

interface ApplicationShellProps {
  readonly catalog: ReactNode;
  readonly account: ReactNode;
  readonly checkout: ReactNode;
}

export const ApplicationShell: FC<ApplicationShellProps> = ({ catalog, account, checkout }): ReactElement => {
  return (
    <main>
      <section>{catalog}</section>
      <section>{account}</section>
      <section>{checkout}</section>
    </main>
  );
};

// The application shell can own global composition.
//
// It should not become the owner of every micro-frontend's business behavior.

// ---------------------------------------------------------------------
// 16. Shell responsibilities
// ---------------------------------------------------------------------

interface ShellResponsibility {
  readonly name: string;
  readonly appropriateForShell: boolean;
}

const shellResponsibilities: readonly ShellResponsibility[] = [
  {
    name: "Application bootstrap",
    appropriateForShell: true,
  },
  {
    name: "Top-level navigation",
    appropriateForShell: true,
  },
  {
    name: "Global error handling",
    appropriateForShell: true,
  },
  {
    name: "Catalog pricing rules",
    appropriateForShell: false,
  },
];

// Global responsibilities belong in the shell only when they genuinely
// span the entire application.

// ---------------------------------------------------------------------
// 17. Feature-specific logic stays inside the boundary
// ---------------------------------------------------------------------

interface PricingRule {
  readonly calculateTotal: (price: number, quantity: number) => number;
}

const checkoutPricing: PricingRule = {
  calculateTotal: (price, quantity) => price * quantity,
};

// Checkout-specific pricing should remain inside the Checkout boundary.
//
// Moving it into the shell would make the shell depend on Checkout internals.

// ---------------------------------------------------------------------
// 18. Data ownership
// ---------------------------------------------------------------------

interface DataOwnership {
  readonly data: string;
  readonly owner: string;
}

const catalogData: DataOwnership = {
  data: "Product catalog",
  owner: "Catalog Team",
};

// Data ownership should generally follow capability ownership.

// ---------------------------------------------------------------------
// 19. Avoid shared database access
// ---------------------------------------------------------------------

interface DatabaseAccess {
  readonly consumer: string;
  readonly databaseOwner: string;
  readonly directAccess: boolean;
}

const checkoutCatalogAccess: DatabaseAccess = {
  consumer: "Checkout",
  databaseOwner: "Catalog",
  directAccess: false,
};

// Directly accessing another micro-frontend's private database bypasses
// the application boundary and creates hidden coupling.

// ---------------------------------------------------------------------
// 20. API-based data access
// ---------------------------------------------------------------------

interface CatalogDataApi {
  readonly getProduct: (id: string) => Promise<ProductReference>;
}

const catalogDataApi: CatalogDataApi = {
  async getProduct(id) {
    return { id };
  },
};

// APIs provide an explicit boundary for data access.
//
// The consumer depends on the contract rather than the database schema.

// ---------------------------------------------------------------------
// 21. Backend-for-frontend boundary
// ---------------------------------------------------------------------

interface BackendForFrontend {
  readonly capability: string;
  readonly responsibility: string;
}

const catalogBff: BackendForFrontend = {
  capability: "Catalog",
  responsibility: "Adapt backend data for catalog UI",
};

// A backend-for-frontend can isolate frontend-specific API composition
// from both the micro-frontend and unrelated backend services.

// ---------------------------------------------------------------------
// 22. URL as a boundary
// ---------------------------------------------------------------------

interface RouteState {
  readonly pathname: string;
  readonly search: string;
}

const catalogRoute: RouteState = {
  pathname: "/catalog",
  search: "?query=example",
};

// The URL can be a useful cross-boundary contract for navigation,
// filters, selected resources, and deep links.

// ---------------------------------------------------------------------
// 23. Route ownership
// ---------------------------------------------------------------------

interface RouteOwnership {
  readonly route: string;
  readonly owner: string;
}

const routeOwnership: readonly RouteOwnership[] = [
  {
    route: "/catalog",
    owner: "Catalog",
  },
  {
    route: "/account",
    owner: "Account",
  },
  {
    route: "/checkout",
    owner: "Checkout",
  },
];

// Explicit route ownership prevents multiple micro-frontends from
// independently claiming the same navigation space.

// ---------------------------------------------------------------------
// 24. Deep-link boundaries
// ---------------------------------------------------------------------

interface DeepLink {
  readonly route: string;
  readonly capability: string;
}

const productDeepLink: DeepLink = {
  route: "/catalog/product-1",
  capability: "Catalog",
};

// A capability should own the meaning of its own resource routes.

// ---------------------------------------------------------------------
// 25. Events as a boundary
// ---------------------------------------------------------------------

interface ProductSelectedEvent {
  readonly type: "product-selected";
  readonly productId: string;
}

const productSelectedEvent: ProductSelectedEvent = {
  type: "product-selected",
  productId: "product-1",
};

// Events communicate that something happened without requiring consumers
// to know the producer's internal state.

// ---------------------------------------------------------------------
// 26. Event contracts
// ---------------------------------------------------------------------

type ApplicationEvent =
  | ProductSelectedEvent
  | {
      readonly type: "checkout-completed";
      readonly orderId: string;
    };

const applicationEvent: ApplicationEvent = {
  type: "checkout-completed",
  orderId: "order-1",
};

// A shared event type can make cross-boundary communication explicit
// and discoverable.

// ---------------------------------------------------------------------
// 27. Event ownership
// ---------------------------------------------------------------------

interface EventOwnership {
  readonly type: string;
  readonly producer: string;
  readonly consumers: readonly string[];
}

const productSelectedOwnership: EventOwnership = {
  type: "product-selected",
  producer: "Catalog",
  consumers: ["Checkout"],
};

// Events should have clear ownership just like APIs.

// ---------------------------------------------------------------------
// 28. Commands vs. events
// ---------------------------------------------------------------------

interface AddToCartCommand {
  readonly productId: string;
  readonly quantity: number;
}

interface CartItemAddedEvent {
  readonly type: "cart-item-added";
  readonly productId: string;
  readonly quantity: number;
}

// A command requests an operation.
//
// An event describes an operation that already happened.
//
// Confusing the two can make ownership and control flow harder to understand.

// ---------------------------------------------------------------------
// 29. Avoid shared mutable state
// ---------------------------------------------------------------------

interface SharedApplicationState {
  readonly selectedProductId: string | null;
}

const sharedApplicationState: SharedApplicationState = {
  selectedProductId: null,
};

// A shared state object can become a hidden integration contract.
//
// Every consumer becomes coupled to its structure and update semantics.

// ---------------------------------------------------------------------
// 30. Prefer explicit state ownership
// ---------------------------------------------------------------------

interface OwnedState {
  readonly owner: string;
  readonly state: string;
}

const catalogSearchState: OwnedState = {
  owner: "Catalog",
  state: "Current search query",
};

// State should live with the capability that owns the behavior associated with it.

// ---------------------------------------------------------------------
// 31. Cross-boundary commands
// ---------------------------------------------------------------------

interface CheckoutRequest {
  readonly productId: string;
  readonly quantity: number;
}

const checkoutRequest: CheckoutRequest = {
  productId: "product-1",
  quantity: 1,
};

// A narrow command can cross the boundary without exposing the Checkout
// implementation or state model.

// ---------------------------------------------------------------------
// 32. Avoid bidirectional dependencies
// ---------------------------------------------------------------------

interface DependencyRelationship {
  readonly from: string;
  readonly to: string;
}

const checkoutDependency: DependencyRelationship = {
  from: "Checkout",
  to: "Catalog",
};

// One-directional relationships are generally easier to understand.
//
// Bidirectional dependencies often indicate that ownership has not been
// separated clearly enough.

// ---------------------------------------------------------------------
// 33. Dependency cycles
// ---------------------------------------------------------------------

interface DependencyGraph {
  readonly catalogDependsOnCheckout: boolean;
  readonly checkoutDependsOnCatalog: boolean;
}

const dependencyGraph: DependencyGraph = {
  catalogDependsOnCheckout: false,
  checkoutDependsOnCatalog: true,
};

// If both values become true, the two capabilities directly depend on each other.
//
// A cycle makes independent deployment and independent reasoning more difficult.

// ---------------------------------------------------------------------
// 34. Orchestration boundary
// ---------------------------------------------------------------------

interface PurchaseWorkflow {
  readonly begin: (productId: string) => void;
}

const purchaseWorkflow: PurchaseWorkflow = {
  begin: (productId) => {
    console.log(`Starting purchase for ${productId}`);
  },
};

// Multi-capability workflows may need an orchestration boundary.
//
// The orchestrator coordinates capabilities without taking ownership
// of their internal implementation.

// ---------------------------------------------------------------------
// 35. Avoid shell orchestration of every detail
// ---------------------------------------------------------------------

interface WorkflowResponsibility {
  readonly workflow: string;
  readonly shellOwnsBusinessDetails: boolean;
}

const purchaseWorkflowResponsibility: WorkflowResponsibility = {
  workflow: "Purchase",
  shellOwnsBusinessDetails: false,
};

// The shell can initiate a workflow without implementing every domain rule
// belonging to Catalog, Account, or Checkout.

// ---------------------------------------------------------------------
// 36. Cross-boundary serialization
// ---------------------------------------------------------------------

interface SerializableProduct {
  readonly id: string;
  readonly name: string;
}

const serializedProduct: SerializableProduct = {
  id: "product-1",
  name: "Example Product",
};

// Serialized data makes the boundary explicit.
//
// Avoid depending on framework-specific object identity across independently
// loaded applications.

// ---------------------------------------------------------------------
// 37. Avoid leaking internal models
// ---------------------------------------------------------------------

interface InternalCatalogProduct {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly supplierCost: number;
  readonly internalCategoryId: string;
}

// The complete internal model should not automatically become a public contract.
//
// Consumers should receive only the information required for their task.

// ---------------------------------------------------------------------
// 38. Public DTOs
// ---------------------------------------------------------------------

interface CatalogProductSummary {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

const productSummary: CatalogProductSummary = {
  id: "product-1",
  name: "Example Product",
  price: 29.99,
};

// A public DTO can protect the internal domain model from cross-boundary coupling.

// ---------------------------------------------------------------------
// 39. Boundary translation
// ---------------------------------------------------------------------

interface CheckoutProduct {
  readonly id: string;
  readonly displayName: string;
}

const toCheckoutProduct = (product: CatalogProductSummary): CheckoutProduct => {
  return {
    id: product.id,
    displayName: product.name,
  };
};

// Translation at the boundary prevents internal representations
// from spreading through the application.

// ---------------------------------------------------------------------
// 40. Versioned contracts
// ---------------------------------------------------------------------

interface CatalogApiV1 {
  readonly getProduct: (id: string) => Promise<CatalogProductSummary>;
}

interface CatalogApiV2 {
  readonly getProduct: (id: string) => Promise<CatalogProductSummary>;
  readonly getAvailability: (id: string) => Promise<boolean>;
}

// Independent deployment may require temporary compatibility between versions.
//
// Versioning should be intentional rather than accidental.

// ---------------------------------------------------------------------
// 41. Compatibility adapters
// ---------------------------------------------------------------------

const adaptCatalogApiV1 = (api: CatalogApiV1): CatalogApiV2 => {
  return {
    getProduct: api.getProduct,
    getAvailability: async () => true,
  };
};

// Compatibility logic should remain near the boundary rather than being
// duplicated throughout consumers.

// ---------------------------------------------------------------------
// 42. Breaking changes
// ---------------------------------------------------------------------

interface ContractChange {
  readonly change: string;
  readonly breaking: boolean;
}

const contractChanges: readonly ContractChange[] = [
  {
    change: "Add an optional field",
    breaking: false,
  },
  {
    change: "Remove a required field",
    breaking: true,
  },
  {
    change: "Change the meaning of an existing field",
    breaking: true,
  },
];

// Structural compatibility and semantic compatibility are both important.
//
// A type-compatible change can still break consumers if its meaning changes.

// ---------------------------------------------------------------------
// 43. Consumer-driven requirements
// ---------------------------------------------------------------------

interface ConsumerRequirement {
  readonly consumer: string;
  readonly requirement: string;
}

const checkoutRequirement: ConsumerRequirement = {
  consumer: "Checkout",
  requirement: "Needs product id and display name",
};

// The producer should expose the smallest contract that satisfies
// actual consumer requirements.

// ---------------------------------------------------------------------
// 44. Contract testing
// ---------------------------------------------------------------------

interface ContractTest {
  readonly producer: string;
  readonly consumer: string;
  readonly contract: string;
}

const catalogCheckoutContractTest: ContractTest = {
  producer: "Catalog",
  consumer: "Checkout",
  contract: "ProductSelection",
};

// Contract tests verify that independently developed boundaries continue
// to agree on the expected integration contract.

// ---------------------------------------------------------------------
// 45. Loading boundaries
// ---------------------------------------------------------------------

interface LoadingBoundaryProps {
  readonly loading: boolean;
  readonly children: ReactNode;
}

export const LoadingBoundary: FC<LoadingBoundaryProps> = ({ loading, children }): ReactElement => {
  if (loading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
};

// Loading is part of the boundary when a micro-frontend is loaded independently.

// ---------------------------------------------------------------------
// 46. Failure boundaries
// ---------------------------------------------------------------------

interface FailureBoundaryProps {
  readonly failed: boolean;
  readonly name: string;
  readonly children: ReactNode;
}

export const FailureBoundary: FC<FailureBoundaryProps> = ({ failed, name, children }): ReactElement => {
  if (failed) {
    return (
      <section>
        <h2>{name}</h2>
        <p>This section is temporarily unavailable.</p>
      </section>
    );
  }

  return <>{children}</>;
};

// Failure isolation allows unrelated capabilities to remain usable
// when one micro-frontend cannot load or render.

// ---------------------------------------------------------------------
// 47. Error ownership
// ---------------------------------------------------------------------

interface ErrorOwnership {
  readonly capability: string;
  readonly handlesInternalErrors: boolean;
  readonly shellHandlesGlobalFailure: boolean;
}

const catalogErrorOwnership: ErrorOwnership = {
  capability: "Catalog",
  handlesInternalErrors: true,
  shellHandlesGlobalFailure: true,
};

// The capability should handle errors within its own domain.
//
// The shell can handle application-level failures such as an unavailable
// remote or broken top-level navigation.

// ---------------------------------------------------------------------
// 48. Runtime isolation
// ---------------------------------------------------------------------

interface RuntimeIsolation {
  readonly capability: string;
  readonly isolatedRuntime: boolean;
}

const accountRuntime: RuntimeIsolation = {
  capability: "Account",
  isolatedRuntime: false,
};

// Runtime isolation can protect one application from another,
// but stronger isolation usually increases integration complexity.

// ---------------------------------------------------------------------
// 49. Shared React runtime
// ---------------------------------------------------------------------

interface RuntimeDependency {
  readonly packageName: string;
  readonly sharing: "shared" | "isolated";
}

const reactRuntime: RuntimeDependency = {
  packageName: "react",
  sharing: "shared",
};

// Sharing a compatible React runtime generally simplifies React-specific
// composition and context interoperability.

// ---------------------------------------------------------------------
// 50. Framework-neutral boundary
// ---------------------------------------------------------------------

interface FrameworkNeutralMount {
  readonly mount: (element: HTMLElement) => void;
}

// A DOM-oriented contract can allow independently implemented applications
// to communicate without requiring a shared React component API.

// ---------------------------------------------------------------------
// 51. Iframe boundary
// ---------------------------------------------------------------------

interface IframeBoundary {
  readonly source: string;
  readonly isolated: boolean;
}

const accountIframe: IframeBoundary = {
  source: "https://example.com/account",
  isolated: true,
};

// An iframe provides strong runtime isolation.
//
// Navigation, sizing, communication, accessibility, and styling become
// explicit integration concerns.

// ---------------------------------------------------------------------
// 52. Custom-element boundary
// ---------------------------------------------------------------------

interface CustomElementBoundary {
  readonly elementName: string;
  readonly communication: string;
}

const catalogElement: CustomElementBoundary = {
  elementName: "catalog-widget",
  communication: "Attributes and DOM events",
};

// Custom elements provide a browser-native boundary that can be useful
// when different frameworks must coexist.

// ---------------------------------------------------------------------
// 53. Styling boundary
// ---------------------------------------------------------------------

interface StylingBoundary {
  readonly capability: string;
  readonly strategy: string;
}

const catalogStylingBoundary: StylingBoundary = {
  capability: "Catalog",
  strategy: "Scoped styles",
};

// Global CSS can cross micro-frontend boundaries accidentally.
//
// Scoped styling mechanisms can reduce this form of coupling.

// ---------------------------------------------------------------------
// 54. Design-system boundary
// ---------------------------------------------------------------------

interface DesignSystemContract {
  readonly component: string;
  readonly sharedRequirement: string;
}

const buttonContract: DesignSystemContract = {
  component: "Button",
  sharedRequirement: "Consistent keyboard and focus behavior",
};

// A design system can provide shared behavior and visual language
// without sharing feature-specific business logic.

// ---------------------------------------------------------------------
// 55. Shared package boundary
// ---------------------------------------------------------------------

interface SharedPackage {
  readonly name: string;
  readonly purpose: string;
}

const sharedUiPackage: SharedPackage = {
  name: "Shared UI",
  purpose: "Accessible visual primitives",
};

// Shared packages should expose stable, generic capabilities.
//
// They should avoid importing feature-specific code from consuming applications.

// ---------------------------------------------------------------------
// 56. Shared business logic is a warning sign
// ---------------------------------------------------------------------

interface SharedBusinessLogic {
  readonly capability: string;
  readonly consumers: readonly string[];
}

const sharedCheckoutRules: SharedBusinessLogic = {
  capability: "Checkout rules",
  consumers: ["Checkout"],
};

// Business rules generally belong to the capability that owns them.
//
// A shared business package can create a dependency that undermines
// independent ownership.

// ---------------------------------------------------------------------
// 57. Platform boundaries
// ---------------------------------------------------------------------

interface PlatformCapability {
  readonly name: string;
  readonly consumers: readonly string[];
}

const authenticationPlatform: PlatformCapability = {
  name: "Authentication",
  consumers: ["Catalog", "Account", "Checkout"],
};

// Authentication, telemetry, feature flags, and similar infrastructure
// may legitimately be shared platform capabilities.

// ---------------------------------------------------------------------
// 58. Platform must remain stable
// ---------------------------------------------------------------------

interface PlatformContract {
  readonly capability: string;
  readonly stabilityRequirement: string;
}

const authenticationContract: PlatformContract = {
  capability: "Authentication",
  stabilityRequirement: "Backward-compatible consumer API",
};

// A heavily shared platform capability becomes a major coordination point.
//
// Its public API should therefore evolve deliberately.

// ---------------------------------------------------------------------
// 59. Dependency direction
// ---------------------------------------------------------------------

interface DependencyDirection {
  readonly from: string;
  readonly to: string;
}

const dependencyDirection: readonly DependencyDirection[] = [
  {
    from: "Application Shell",
    to: "Catalog",
  },
  {
    from: "Application Shell",
    to: "Account",
  },
  {
    from: "Application Shell",
    to: "Checkout",
  },
];

// The shell can depend on capabilities for composition.
//
// Capabilities should not depend on the shell's internal implementation.

// ---------------------------------------------------------------------
// 60. Avoid shell-to-feature-to-shell cycles
// ---------------------------------------------------------------------

interface ShellCycle {
  readonly featureDependsOnShellInternals: boolean;
  readonly shellDependsOnFeature: boolean;
}

const shellCycle: ShellCycle = {
  featureDependsOnShellInternals: false,
  shellDependsOnFeature: true,
};

// If a feature imports shell internals while the shell imports that feature,
// the intended boundary becomes cyclic.

// ---------------------------------------------------------------------
// 61. Explicit platform interfaces
// ---------------------------------------------------------------------

interface PlatformServices {
  readonly authentication: {
    readonly getUserId: () => string | null;
  };
  readonly telemetry: {
    readonly track: (event: string) => void;
  };
}

const platformServices: PlatformServices = {
  authentication: {
    getUserId: () => "user-1",
  },
  telemetry: {
    track: (event) => {
      console.log(event);
    },
  },
};

// A capability can depend on a narrow platform interface instead of
// importing implementation-specific platform modules.

// ---------------------------------------------------------------------
// 62. Authentication boundary
// ---------------------------------------------------------------------

interface AuthState {
  readonly userId: string | null;
  readonly authenticated: boolean;
}

const authState: AuthState = {
  userId: "user-1",
  authenticated: true,
};

// Authentication identifies the user.
//
// Authorization for capability-specific operations should still be enforced
// by the capability or its backend.

// ---------------------------------------------------------------------
// 63. Authorization boundary
// ---------------------------------------------------------------------

interface AuthorizationRequirement {
  readonly capability: string;
  readonly permission: string;
}

const checkoutAuthorization: AuthorizationRequirement = {
  capability: "Checkout",
  permission: "purchase",
};

// A micro-frontend should not rely solely on the shell to decide whether
// an operation is allowed.

// ---------------------------------------------------------------------
// 64. Localization boundary
// ---------------------------------------------------------------------

interface LocalizationOwnership {
  readonly capability: string;
  readonly translationOwnership: string;
}

const catalogLocalization: LocalizationOwnership = {
  capability: "Catalog",
  translationOwnership: "Catalog Team",
};

// Localization can be centralized or capability-owned.
//
// The important architectural property is that ownership remains explicit.

// ---------------------------------------------------------------------
// 65. Browser storage boundary
// ---------------------------------------------------------------------

interface StorageKeyOwnership {
  readonly key: string;
  readonly owner: string;
}

const catalogStorageKey: StorageKeyOwnership = {
  key: "catalog.preferences",
  owner: "Catalog",
};

// Namespaced storage keys reduce accidental collisions between capabilities.

// ---------------------------------------------------------------------
// 66. Avoid undocumented storage communication
// ---------------------------------------------------------------------

interface StorageCommunication {
  readonly documented: boolean;
  readonly consumers: readonly string[];
}

const undocumentedStorageCommunication: StorageCommunication = {
  documented: false,
  consumers: ["Checkout"],
};

// Using localStorage as an undocumented message bus creates an implicit
// contract that is difficult to discover and evolve.

// ---------------------------------------------------------------------
// 67. Observability boundary
// ---------------------------------------------------------------------

interface TelemetryContext {
  readonly application: string;
  readonly capability: string;
}

const catalogTelemetry: TelemetryContext = {
  application: "Example Application",
  capability: "Catalog",
};

// Logs and metrics should preserve capability identity so failures
// can be attributed to the correct owner.

// ---------------------------------------------------------------------
// 68. Correlation identifiers
// ---------------------------------------------------------------------

interface RequestContext {
  readonly requestId: string;
}

const requestContext: RequestContext = {
  requestId: "request-1",
};

// Correlation identifiers can trace a workflow across multiple boundaries.

// ---------------------------------------------------------------------
// 69. Performance boundary
// ---------------------------------------------------------------------

interface PerformanceBoundary {
  readonly capability: string;
  readonly loadingStrategy: string;
}

const catalogPerformance: PerformanceBoundary = {
  capability: "Catalog",
  loadingStrategy: "Load on catalog navigation",
};

// Independent loading can improve initial delivery for some applications,
// but every additional boundary introduces loading and runtime overhead.

// ---------------------------------------------------------------------
// 70. Bundle duplication
// ---------------------------------------------------------------------

interface BundleDependency {
  readonly packageName: string;
  readonly copies: number;
}

const frameworkBundle: BundleDependency = {
  packageName: "react",
  copies: 1,
};

// Shared dependencies can reduce duplication.
//
// Over-sharing, however, can create version coupling between deployments.

// ---------------------------------------------------------------------
// 71. Independent deployment
// ---------------------------------------------------------------------

interface DeploymentBoundary {
  readonly capability: string;
  readonly independentlyDeployable: boolean;
}

const catalogDeployment: DeploymentBoundary = {
  capability: "Catalog",
  independentlyDeployable: true,
};

// Independent deployment is meaningful only when the boundary is sufficiently
// stable that consumers do not require synchronized changes.

// ---------------------------------------------------------------------
// 72. Compatibility across deployments
// ---------------------------------------------------------------------

interface DeploymentCompatibility {
  readonly producerVersion: string;
  readonly consumerVersion: string;
  readonly compatible: boolean;
}

const deploymentCompatibility: DeploymentCompatibility = {
  producerVersion: "2.0",
  consumerVersion: "3.0",
  compatible: true,
};

// Independent deployment moves compatibility checks from release coordination
// into explicit contracts and runtime or CI validation.

// ---------------------------------------------------------------------
// 73. Rollback boundary
// ---------------------------------------------------------------------

interface RollbackPolicy {
  readonly capability: string;
  readonly rollbackAvailable: boolean;
}

const catalogRollback: RollbackPolicy = {
  capability: "Catalog",
  rollbackAvailable: true,
};

// Independent deployments should have a recovery strategy that does not
// require rolling back unrelated capabilities.

// ---------------------------------------------------------------------
// 74. Testing the boundary
// ---------------------------------------------------------------------

interface BoundaryTest {
  readonly boundary: string;
  readonly verifies: readonly string[];
}

const catalogBoundaryTest: BoundaryTest = {
  boundary: "Catalog",
  verifies: ["Public API shape", "Event payloads", "Failure behavior"],
};

// Boundary tests should verify the contract rather than implementation details.

// ---------------------------------------------------------------------
// 75. End-to-end boundary testing
// ---------------------------------------------------------------------

interface WorkflowTest {
  readonly name: string;
  readonly capabilities: readonly string[];
}

const purchaseWorkflowTest: WorkflowTest = {
  name: "Purchase a product",
  capabilities: ["Catalog", "Checkout"],
};

// End-to-end tests verify that separately owned capabilities still cooperate
// correctly in important user workflows.

// ---------------------------------------------------------------------
// 76. Failure testing
// ---------------------------------------------------------------------

interface FailureScenario {
  readonly failedCapability: string;
  readonly expectedBehavior: string;
}

const catalogFailure: FailureScenario = {
  failedCapability: "Catalog",
  expectedBehavior: "Account remains usable",
};

// A boundary is stronger when failure of one capability does not unnecessarily
// destroy unrelated capabilities.

// ---------------------------------------------------------------------
// 77. Accessibility ownership
// ---------------------------------------------------------------------

interface AccessibilityBoundary {
  readonly responsibility: string;
  readonly owner: string;
}

const catalogAccessibility: AccessibilityBoundary = {
  responsibility: "Keyboard-accessible catalog controls",
  owner: "Catalog Team",
};

// Each micro-frontend owns the accessibility of the UI it renders.

// ---------------------------------------------------------------------
// 78. Avoid global assumptions
// ---------------------------------------------------------------------

interface GlobalAssumption {
  readonly assumption: string;
  readonly explicitContract: boolean;
}

const reactVersionAssumption: GlobalAssumption = {
  assumption: "Every micro-frontend uses the same React version",
  explicitContract: false,
};

// Hidden assumptions are boundary leaks.
//
// Important runtime assumptions should be documented and managed explicitly.

// ---------------------------------------------------------------------
// 79. Boundary stability
// ---------------------------------------------------------------------

interface BoundaryStability {
  readonly boundary: string;
  readonly changeFrequency: "low" | "medium" | "high";
}

const catalogBoundaryStability: BoundaryStability = {
  boundary: "Catalog public API",
  changeFrequency: "low",
};

// A frequently changing boundary creates continuous coordination cost.
//
// Stable boundaries make independent development more practical.

// ---------------------------------------------------------------------
// 80. Avoid overly granular micro-frontends
// ---------------------------------------------------------------------

interface GranularitySignal {
  readonly capability: string;
  readonly independentlyOwned: boolean;
  readonly meaningfulBoundary: boolean;
}

const productCardSignal: GranularitySignal = {
  capability: "Product Card",
  independentlyOwned: false,
  meaningfulBoundary: false,
};

// A single button, card, or form field usually does not need to become
// an independently deployed micro-frontend.

// ---------------------------------------------------------------------
// 81. Avoid overly broad micro-frontends
// ---------------------------------------------------------------------

const overlyBroadBoundary: MicroFrontendBoundary = {
  name: "Everything",
  responsibility: "All product behavior",
  owner: "Frontend Team",
};

// A boundary that owns almost the entire application does not provide
// meaningful decomposition.

// ---------------------------------------------------------------------
// 82. Cohesion within a boundary
// ---------------------------------------------------------------------

interface BoundaryCohesion {
  readonly capability: string;
  readonly relatedResponsibilities: readonly string[];
}

const catalogCohesion: BoundaryCohesion = {
  capability: "Catalog",
  relatedResponsibilities: ["Search", "Browse", "Product discovery"],
};

// A micro-frontend should contain responsibilities that naturally belong together.

// ---------------------------------------------------------------------
// 83. Coupling across boundaries
// ---------------------------------------------------------------------

interface BoundaryCoupling {
  readonly producer: string;
  readonly consumer: string;
  readonly couplingPoints: number;
}

const catalogCheckoutCoupling: BoundaryCoupling = {
  producer: "Catalog",
  consumer: "Checkout",
  couplingPoints: 1,
};

// Fewer, clearer integration points generally make a boundary easier to evolve.

// ---------------------------------------------------------------------
// 84. Explicit integration points
// ---------------------------------------------------------------------

interface IntegrationPoint {
  readonly name: string;
  readonly contract: string;
}

const integrationPoints: readonly IntegrationPoint[] = [
  {
    name: "Product selection",
    contract: "ProductSelectionApi",
  },
  {
    name: "Navigation",
    contract: "URL route",
  },
];

// Explicit integration points make cross-boundary relationships visible.

// ---------------------------------------------------------------------
// 85. Avoid integration through implementation details
// ---------------------------------------------------------------------

interface ImplementationLeak {
  readonly detail: string;
  readonly crossesBoundary: boolean;
}

const repositoryLeak: ImplementationLeak = {
  detail: "Catalog repository instance",
  crossesBoundary: true,
};

// A repository implementation is an internal detail.
//
// Consumers should depend on an API or contract representing the capability.

// ---------------------------------------------------------------------
// 86. Boundary adapters
// ---------------------------------------------------------------------

interface ExternalProduct {
  readonly id: string;
  readonly title: string;
}

interface InternalProduct {
  readonly id: string;
  readonly name: string;
}

const adaptProduct = (externalProduct: ExternalProduct): InternalProduct => {
  return {
    id: externalProduct.id,
    name: externalProduct.title,
  };
};

// Adapters isolate representation differences at the boundary.

// ---------------------------------------------------------------------
// 87. Avoid leaking third-party dependencies
// ---------------------------------------------------------------------

interface PublicDateRange {
  readonly start: Date;
  readonly end: Date;
}

// Public contracts should avoid exposing implementation-specific abstractions
// when a simpler stable representation is sufficient.
//
// Third-party library types can create hidden dependency coupling.

// ---------------------------------------------------------------------
// 88. Boundary documentation
// ---------------------------------------------------------------------

interface BoundaryDocumentation {
  readonly owner: string;
  readonly inputs: readonly string[];
  readonly outputs: readonly string[];
  readonly communication: readonly string[];
}

const catalogDocumentation: BoundaryDocumentation = {
  owner: "Catalog Team",
  inputs: ["Search query"],
  outputs: ["Product selection"],
  communication: ["URL", "ProductSelected event"],
};

// Boundary documentation should describe the contract and ownership,
// not the entire internal implementation.

// ---------------------------------------------------------------------
// 89. Migration from internal imports
// ---------------------------------------------------------------------

interface MigrationStep {
  readonly step: number;
  readonly action: string;
}

const boundaryMigration: readonly MigrationStep[] = [
  {
    step: 1,
    action: "Identify cross-feature internal imports",
  },
  {
    step: 2,
    action: "Define public contracts",
  },
  {
    step: 3,
    action: "Introduce boundary adapters",
  },
  {
    step: 4,
    action: "Remove internal imports",
  },
];

// Strong boundaries can be introduced incrementally before independent
// deployment is introduced.

// ---------------------------------------------------------------------
// 90. Migration from shared state
// ---------------------------------------------------------------------

const stateMigration: readonly MigrationStep[] = [
  {
    step: 1,
    action: "Identify shared state ownership",
  },
  {
    step: 2,
    action: "Move state to its owning capability",
  },
  {
    step: 3,
    action: "Expose narrow commands or events",
  },
  {
    step: 4,
    action: "Remove direct state access",
  },
];

// State boundaries should be established before runtime decomposition.

// ---------------------------------------------------------------------
// 91. Modular monolith as a boundary foundation
// ---------------------------------------------------------------------

interface ModularArchitecture {
  readonly deploymentUnit: string;
  readonly boundaryStyle: string;
}

const modularArchitecture: ModularArchitecture = {
  deploymentUnit: "One application",
  boundaryStyle: "Explicit feature contracts",
};

// A modular monolith can establish strong ownership and dependency boundaries
// without immediately introducing independently deployed micro-frontends.

// ---------------------------------------------------------------------
// 92. Distributed monolith warning
// ---------------------------------------------------------------------

interface DistributedMonolithSignal {
  readonly synchronizedReleases: boolean;
  readonly sharedInternalState: boolean;
  readonly directInternalImports: boolean;
}

const distributedMonolithWarning: DistributedMonolithSignal = {
  synchronizedReleases: true,
  sharedInternalState: true,
  directInternalImports: true,
};

// Independent runtime pieces with strong hidden dependencies can become
// a distributed monolith rather than truly independent micro-frontends.

// ---------------------------------------------------------------------
// 93. Boundary review
// ---------------------------------------------------------------------

interface BoundaryReview {
  readonly question: string;
}

const boundaryReviewQuestions: readonly BoundaryReview[] = [
  {
    question: "Who owns this capability?",
  },
  {
    question: "What does it expose?",
  },
  {
    question: "What does it consume?",
  },
  {
    question: "Which state is private?",
  },
  {
    question: "Which data is private?",
  },
  {
    question: "How do other capabilities communicate with it?",
  },
  {
    question: "Can it be deployed without unrelated capabilities?",
  },
];

// These questions expose boundary weaknesses before they become runtime problems.

// ---------------------------------------------------------------------
// 94. Complete example: catalog boundary
// ---------------------------------------------------------------------

interface CatalogBoundaryProps {
  readonly products: readonly CatalogProduct[];
  readonly onProductSelected: (productId: string) => void;
}

export const CatalogBoundaryComponent: FC<CatalogBoundaryProps> = ({ products, onProductSelected }): ReactElement => {
  return (
    <section>
      <h2>Catalog</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <span>
              {product.name} — ${product.price.toFixed(2)}
            </span>
            <button onClick={() => onProductSelected(product.id)} type="button">
              Select
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

// The public boundary exposes:
// - product data required for rendering
// - a semantic product-selection callback
//
// It does not expose:
// - internal component structure
// - internal state
// - repositories
// - implementation-specific hooks

// ---------------------------------------------------------------------
// 95. Complete example: host composition
// ---------------------------------------------------------------------

export const MicroFrontendBoundaryExample: FC = (): ReactElement => {
  const products: readonly CatalogProduct[] = [
    {
      id: "product-1",
      name: "Example Product",
      price: 29.99,
    },
  ];

  const handleProductSelected = (productId: string): void => {
    console.log(`Selected product: ${productId}`);
  };

  return (
    <ApplicationShell
      account={
        <CapabilityShell title="Account">
          <p>John Doe</p>
        </CapabilityShell>
      }
      catalog={<CatalogBoundaryComponent onProductSelected={handleProductSelected} products={products} />}
      checkout={
        <CapabilityShell title="Checkout">
          <p>Ready for checkout.</p>
        </CapabilityShell>
      }
    />
  );
};

// The host composes capabilities through explicit public contracts.
//
// It does not need to know how Catalog internally implements product cards,
// search state, data fetching, or other feature-specific behavior.

// ---------------------------------------------------------------------
// 96. Complete boundary model
// ---------------------------------------------------------------------

interface MicroFrontendBoundaryModel {
  readonly name: string;
  readonly owns: readonly string[];
  readonly exposes: readonly string[];
  readonly consumes: readonly string[];
  readonly privateState: readonly string[];
}

const catalogBoundaryModel: MicroFrontendBoundaryModel = {
  name: "Catalog",
  owns: ["Product discovery", "Search state", "Catalog presentation"],
  exposes: ["Product selection", "Catalog routes"],
  consumes: ["Authentication", "Design system"],
  privateState: ["Search input state", "Catalog UI state"],
};

// A strong micro-frontend boundary makes ownership, public contracts,
// dependencies, and private implementation explicit.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A micro-frontend boundary separates an independently owned capability from other capabilities.
// - Strong boundaries define ownership, public contracts, dependencies, communication, and private implementation.
// - Business capabilities usually produce more meaningful boundaries than arbitrary UI fragments.
// - Internal components, hooks, repositories, state, and data models should remain private unless they are intentionally part of the public contract.
// - Public APIs should be narrow and expose capabilities rather than implementation details.
// - Semantic callbacks communicate intent more clearly than generic implementation-oriented callbacks.
// - The application shell can own global composition without owning every feature's business logic.
// - Data ownership should follow capability ownership, and direct access to another capability's private database weakens the boundary.
// - URL state can provide a durable boundary for navigation, filters, selected resources, and deep links.
// - Events, commands, APIs, and composition slots provide explicit mechanisms for cross-boundary communication.
// - Shared mutable state creates hidden coupling because multiple capabilities become dependent on the same state model.
// - Cross-boundary events and APIs need explicit ownership, stable schemas, and migration strategies.
// - Bidirectional dependencies and dependency cycles make independent evolution and deployment more difficult.
// - Boundary adapters can translate external representations without leaking internal models across capabilities.
// - Public DTOs should expose only the data consumers actually require.
// - Runtime mechanisms such as iframes, custom elements, and runtime module loading provide different isolation and integration characteristics.
// - Shared React runtimes can simplify React-specific composition, while framework-neutral boundaries can support stronger technology independence.
// - Shared UI and platform capabilities can provide consistency, but widely shared packages become coordination points.
// - Styling, localization, accessibility, authentication, authorization, storage, and observability responsibilities should have explicit ownership.
// - Loading and failure isolation are part of a runtime micro-frontend boundary, not merely deployment concerns.
// - Independent deployment requires compatibility contracts, rollback strategies, and observability.
// - Contract tests verify that independently developed capabilities continue to agree on their integration boundaries.
// - A boundary that is too granular creates unnecessary operational overhead, while a boundary that is too broad provides little independence.
// - A modular monolith can establish strong boundaries before independently deployed micro-frontends are introduced.
// - A distributed monolith emerges when independently deployed pieces still depend on shared internal state, internal imports, or synchronized releases.
// - The goal of a micro-frontend boundary is not maximum isolation; it is a deliberate separation that makes ownership and change more independent.
