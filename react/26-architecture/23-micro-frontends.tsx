/**
 * Micro-Frontends
 * ===============
 *
 * Micro-frontends apply microservice-style organizational and deployment ideas to frontend
 * applications. A large frontend can be divided into independently owned parts that communicate
 * through explicit boundaries while still contributing to one user-facing product.
 *
 * Micro-frontends are an architectural choice rather than a requirement for large applications.
 * They introduce meaningful benefits around team ownership and independent delivery, but also add
 * integration, runtime, dependency, testing, and operational complexity.
 */

import { useState } from "react";
import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. What a micro-frontend is
// ---------------------------------------------------------------------

// A micro-frontend is an independently owned frontend capability that participates
// in a larger application.
//
// A micro-frontend commonly has:
// - a clear business or product responsibility
// - an owning team
// - a defined integration boundary
// - its own internal implementation
// - an independently managed delivery lifecycle
//
// The exact runtime architecture can vary.

// ---------------------------------------------------------------------
// 2. Micro-frontend boundaries
// ---------------------------------------------------------------------

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

// A boundary should represent a meaningful capability rather than an arbitrary
// visual fragment such as a single button or input.

// ---------------------------------------------------------------------
// 3. Business boundaries vs. technical boundaries
// ---------------------------------------------------------------------

interface BusinessCapability {
  readonly name: string;
  readonly concepts: readonly string[];
}

const accountCapability: BusinessCapability = {
  name: "Account",
  concepts: ["Profile", "Preferences"],
};

// Business capabilities often provide stronger boundaries because their state,
// behavior, ownership, and change patterns can remain internally cohesive.
//
// Technical boundaries alone may not provide the same isolation.

// ---------------------------------------------------------------------
// 4. Example product decomposition
// ---------------------------------------------------------------------

interface ProductArea {
  readonly name: string;
  readonly responsibility: string;
}

const productAreas: readonly ProductArea[] = [
  {
    name: "Catalog",
    responsibility: "Browse and search products",
  },
  {
    name: "Account",
    responsibility: "Manage profile and preferences",
  },
  {
    name: "Checkout",
    responsibility: "Complete purchases",
  },
];

// The boundaries are examples of product capabilities, not requirements
// for every application.

// ---------------------------------------------------------------------
// 5. A micro-frontend owns its internal implementation
// ---------------------------------------------------------------------

interface CatalogProduct {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

interface CatalogProps {
  readonly products: readonly CatalogProduct[];
}

export const Catalog: FC<CatalogProps> = ({ products }): ReactElement => {
  return (
    <section>
      <h2>Catalog</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} — ${product.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </section>
  );
};

// The catalog can keep its own components, state, data access, and implementation
// details private while exposing only the integration contract.

// ---------------------------------------------------------------------
// 6. Public contracts
// ---------------------------------------------------------------------

interface CatalogPublicApi {
  readonly render: (products: readonly CatalogProduct[]) => ReactElement;
}

const catalogPublicApi: CatalogPublicApi = {
  render: (products) => <Catalog products={products} />,
};

// A public API should expose only what other parts of the application genuinely need.
//
// Internal component trees, hooks, repositories, and implementation details
// should remain private to the micro-frontend.

// ---------------------------------------------------------------------
// 7. Composition at the application shell
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

// A shell can compose separately owned capabilities.
//
// The shell should avoid becoming the owner of every micro-frontend's internal logic.

// ---------------------------------------------------------------------
// 8. Static composition
// ---------------------------------------------------------------------

// Static composition means the application is assembled during build time.
//
// Typical characteristics:
// - shared build pipeline
// - compile-time dependency relationships
// - straightforward module imports
// - simpler runtime integration
//
// It can provide micro-frontend-like ownership boundaries without requiring
// independently loaded runtime applications.

// ---------------------------------------------------------------------
// 9. Runtime composition
// ---------------------------------------------------------------------

// Runtime composition loads or connects micro-frontends independently at runtime.
//
// Possible mechanisms include:
// - module federation
// - dynamically loaded JavaScript
// - custom element integration
// - iframe-based isolation
// - server-side composition
//
// Each mechanism has different dependency and operational tradeoffs.

// ---------------------------------------------------------------------
// 10. Server-side composition
// ---------------------------------------------------------------------

interface ServerComposition {
  readonly region: string;
  readonly owner: string;
}

const serverComposition: ServerComposition = {
  region: "Catalog region",
  owner: "Catalog Team",
};

// A server can compose independently produced frontend fragments before
// sending the final response.
//
// This can reduce some client-side integration complexity while introducing
// server-side composition requirements.

// ---------------------------------------------------------------------
// 11. Client-side composition
// ---------------------------------------------------------------------

interface ClientCompositionProps {
  readonly children: ReactNode;
}

export const ClientComposition: FC<ClientCompositionProps> = ({ children }): ReactElement => {
  return <div>{children}</div>;
};

// Client-side composition allows separately loaded capabilities to participate
// in one browser application.
//
// It also means the browser must coordinate loading, execution, dependencies,
// navigation, and failures.

// ---------------------------------------------------------------------
// 12. Iframes as a boundary
// ---------------------------------------------------------------------

interface EmbeddedApplicationProps {
  readonly src: string;
  readonly title: string;
}

export const EmbeddedApplication: FC<EmbeddedApplicationProps> = ({ src, title }): ReactElement => {
  return <iframe src={src} title={title} />;
};

// An iframe provides strong runtime isolation.
//
// The cost is a more difficult integration model for:
// - navigation
// - sizing
// - styling
// - accessibility
// - communication
// - shared state
//
// It is therefore a deliberate isolation mechanism rather than a default solution.

// ---------------------------------------------------------------------
// 13. Custom elements as an integration boundary
// ---------------------------------------------------------------------

interface CustomElementBoundary {
  readonly elementName: string;
  readonly contract: string;
}

const customElementBoundary: CustomElementBoundary = {
  elementName: "catalog-widget",
  contract: "HTML attributes and DOM events",
};

// Custom elements can provide framework-independent integration boundaries.
//
// The host and embedded application can remain relatively independent,
// but React-specific composition patterns may no longer apply directly.

// ---------------------------------------------------------------------
// 14. Module Federation as a runtime mechanism
// ---------------------------------------------------------------------

interface RemoteModule {
  readonly name: string;
  readonly exposedModule: string;
}

const catalogRemote: RemoteModule = {
  name: "catalog",
  exposedModule: "./Catalog",
};

// Module federation is one possible runtime composition mechanism.
//
// It can support independently built and deployed modules, but introduces
// runtime dependency resolution and version-sharing concerns.

// ---------------------------------------------------------------------
// 15. Micro-frontends are not the same as modules
// ---------------------------------------------------------------------

interface InternalModule {
  readonly name: string;
  readonly independentlyDeployed: boolean;
}

const catalogModule: InternalModule = {
  name: "Catalog",
  independentlyDeployed: false,
};

// A module is a code organization boundary.
//
// A micro-frontend generally implies a stronger ownership and delivery boundary.
//
// A large application can have many modules without being a micro-frontend architecture.

// ---------------------------------------------------------------------
// 16. Micro-frontends are not simply large components
// ---------------------------------------------------------------------

interface ComponentBoundary {
  readonly name: string;
  readonly responsibility: string;
}

const productCardBoundary: ComponentBoundary = {
  name: "ProductCard",
  responsibility: "Display one product",
};

// A component boundary is usually too small to justify independent deployment,
// team ownership, infrastructure, and runtime integration.
//
// Micro-frontends normally represent larger capabilities.

// ---------------------------------------------------------------------
// 17. Independent ownership
// ---------------------------------------------------------------------

interface TeamOwnership {
  readonly capability: string;
  readonly team: string;
}

const checkoutOwnership: TeamOwnership = {
  capability: "Checkout",
  team: "Checkout Team",
};

// Ownership is one of the main architectural motivations for micro-frontends.
//
// A team can own a capability from implementation through deployment and operation.

// ---------------------------------------------------------------------
// 18. Independent deployment
// ---------------------------------------------------------------------

interface DeploymentPolicy {
  readonly capability: string;
  readonly independentlyDeployable: boolean;
}

const catalogDeployment: DeploymentPolicy = {
  capability: "Catalog",
  independentlyDeployable: true,
};

// Independent deployment can reduce coordination between teams.
//
// It also requires compatibility contracts, deployment observability,
// rollback strategies, and runtime integration discipline.

// ---------------------------------------------------------------------
// 19. Independent technology choices
// ---------------------------------------------------------------------

interface TechnologyBoundary {
  readonly capability: string;
  readonly framework: string;
}

const accountTechnology: TechnologyBoundary = {
  capability: "Account",
  framework: "React",
};

// Micro-frontends can technically permit different frameworks.
//
// That does not mean multiple frameworks are automatically desirable.
//
// Different technologies increase bundle size, operational complexity,
// developer learning requirements, and integration complexity.

// ---------------------------------------------------------------------
// 20. Shared technology is often simpler
// ---------------------------------------------------------------------

interface SharedRuntimeDependency {
  readonly name: string;
  readonly version: string;
}

const sharedReactRuntime: SharedRuntimeDependency = {
  name: "react",
  version: "19.x",
};

// Sharing the same framework and runtime can simplify:
//
// - component interoperability
// - dependency management
// - debugging
// - bundle size
// - developer experience
//
// Technology independence should be justified by an actual requirement.

// ---------------------------------------------------------------------
// 21. Shared runtime identity
// ---------------------------------------------------------------------

interface RuntimeIdentity {
  readonly package: string;
  readonly singleton: boolean;
}

const reactRuntimeIdentity: RuntimeIdentity = {
  package: "react",
  singleton: true,
};

// Multiple React runtimes in one application can create interoperability problems,
// particularly around context and renderer/runtime identity.
//
// Runtime sharing therefore becomes an important integration concern when
// independently built applications are combined.

// ---------------------------------------------------------------------
// 22. Dependency version alignment
// ---------------------------------------------------------------------

interface DependencyContract {
  readonly packageName: string;
  readonly requiredVersion: string;
  readonly sharingPolicy: "shared" | "isolated";
}

const reactDependencyContract: DependencyContract = {
  packageName: "react",
  requiredVersion: "19.x",
  sharingPolicy: "shared",
};

// Shared dependencies require compatible versions and a deliberate loading policy.
//
// Independently deployed applications make version coordination more important.

// ---------------------------------------------------------------------
// 23. Shared UI libraries
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly children: ReactNode;
  readonly onClick?: () => void;
}

export const SharedButton: FC<ButtonProps> = ({ children, onClick }): ReactElement => {
  return (
    <button onClick={onClick} type="button">
      {children}
    </button>
  );
};

// A shared component library can establish consistent visual and interaction patterns.
//
// It should expose stable primitives rather than importing feature-specific business logic
// into every micro-frontend.

// ---------------------------------------------------------------------
// 24. Shared design tokens
// ---------------------------------------------------------------------

interface DesignTokens {
  readonly spacingMedium: string;
  readonly radiusMedium: string;
}

const designTokens: DesignTokens = {
  spacingMedium: "16px",
  radiusMedium: "8px",
};

// Shared tokens can provide visual consistency without requiring every
// micro-frontend to share its entire implementation.

// ---------------------------------------------------------------------
// 25. Shared domain types
// ---------------------------------------------------------------------

interface ProductReference {
  readonly id: string;
}

// A narrow shared type can communicate a cross-boundary contract.
//
// Sharing a large domain model can create stronger coupling than necessary.

// ---------------------------------------------------------------------
// 26. Avoid shared business state by default
// ---------------------------------------------------------------------

interface CartState {
  readonly items: readonly string[];
}

const cartState: CartState = {
  items: [],
};

// Shared global state across independently owned micro-frontends creates coupling.
//
// Prefer explicit events, APIs, or narrow shared contracts when cross-boundary
// coordination is genuinely required.

// ---------------------------------------------------------------------
// 27. URL state as a coordination mechanism
// ---------------------------------------------------------------------

interface CatalogRoute {
  readonly pathname: string;
  readonly search: string;
}

const catalogRoute: CatalogRoute = {
  pathname: "/catalog",
  search: "?query=example",
};

// The URL can provide a durable coordination boundary for concerns such as:
//
// - navigation
// - filters
// - selected resources
// - deep links
//
// It is not a replacement for all application state.

// ---------------------------------------------------------------------
// 28. Cross-micro-frontend events
// ---------------------------------------------------------------------

interface ProductSelectedEvent {
  readonly type: "product-selected";
  readonly productId: string;
}

const productSelectedEvent: ProductSelectedEvent = {
  type: "product-selected",
  productId: "product-1",
};

// Events can reduce direct knowledge between micro-frontends.
//
// They also introduce an implicit contract around event names and payloads,
// so event schemas should be treated as public APIs.

// ---------------------------------------------------------------------
// 29. Typed event contracts
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

// Explicit event unions can make supported cross-boundary messages discoverable
// and type-safe inside a shared TypeScript contract.

// ---------------------------------------------------------------------
// 30. Event ownership
// ---------------------------------------------------------------------

interface EventOwnership {
  readonly eventType: string;
  readonly producer: string;
  readonly consumers: readonly string[];
}

const productSelectionOwnership: EventOwnership = {
  eventType: "product-selected",
  producer: "Catalog",
  consumers: ["Checkout"],
};

// Every cross-boundary event should have clear ownership.
//
// Otherwise, changing an event becomes difficult because no team knows
// which consumers are responsible for migration.

// ---------------------------------------------------------------------
// 31. Avoid direct internal imports
// ---------------------------------------------------------------------

interface PublicModuleApi {
  readonly openProduct: (id: string) => void;
}

const catalogApi: PublicModuleApi = {
  openProduct: (id) => {
    console.log(id);
  },
};

// Consumers should depend on the public contract rather than reaching into
// another micro-frontend's internal files.
//
// Internal imports destroy the intended boundary.

// ---------------------------------------------------------------------
// 32. Stable public APIs
// ---------------------------------------------------------------------

interface CatalogNavigationApi {
  readonly openProduct: (id: string) => void;
  readonly openSearch: (query: string) => void;
}

const catalogNavigationApi: CatalogNavigationApi = {
  openProduct: (id) => {
    console.log(`Open product: ${id}`);
  },
  openSearch: (query) => {
    console.log(`Search: ${query}`);
  },
};

// A small API is easier to version and evolve than exposing an entire
// component tree or internal state model.

// ---------------------------------------------------------------------
// 33. API versioning
// ---------------------------------------------------------------------

interface CatalogApiV1 {
  readonly openProduct: (id: string) => void;
}

interface CatalogApiV2 {
  readonly openProduct: (id: string, source?: string) => void;
}

// Independent deployments may require temporary support for multiple contract versions.
//
// Versioning increases maintenance cost, so old versions should have a migration path.

// ---------------------------------------------------------------------
// 34. Compatibility adapters
// ---------------------------------------------------------------------

const adaptCatalogApiV1 = (api: CatalogApiV1): CatalogApiV2 => {
  return {
    openProduct: (id) => api.openProduct(id),
  };
};

// Compatibility logic should remain close to the boundary.
//
// Consumers should not each implement their own translation between versions.

// ---------------------------------------------------------------------
// 35. Navigation ownership
// ---------------------------------------------------------------------

interface NavigationBoundary {
  readonly owner: string;
  readonly routes: readonly string[];
}

const catalogNavigation: NavigationBoundary = {
  owner: "Catalog",
  routes: ["/catalog", "/catalog/:id"],
};

// Navigation can be centralized or distributed.
//
// A distributed model can give each capability ownership over its routes,
// while a shell may still own top-level application navigation.

// ---------------------------------------------------------------------
// 36. Application shell responsibilities
// ---------------------------------------------------------------------

interface ShellResponsibilities {
  readonly responsibilities: readonly string[];
}

const shellResponsibilities: ShellResponsibilities = {
  responsibilities: [
    "Application bootstrap",
    "Top-level navigation",
    "Authentication integration",
    "Global error handling",
  ],
};

// The shell should coordinate global concerns rather than absorb every
// micro-frontend's business behavior.

// ---------------------------------------------------------------------
// 37. Avoid the shell becoming a monolith
// ---------------------------------------------------------------------

interface ShellDependency {
  readonly capability: string;
  readonly implementationOwnedByShell: boolean;
}

const catalogShellDependency: ShellDependency = {
  capability: "Catalog search",
  implementationOwnedByShell: false,
};

// If the shell contains business logic for every micro-frontend,
// the architecture can become a distributed system with a centralized monolith.

// ---------------------------------------------------------------------
// 38. Authentication as a cross-cutting concern
// ---------------------------------------------------------------------

interface AuthContext {
  readonly userId: string | null;
  readonly authenticated: boolean;
}

const authContext: AuthContext = {
  userId: "user-1",
  authenticated: true,
};

// Authentication can be integrated at the shell or platform level.
//
// Individual micro-frontends should still enforce authorization for their
// own operations rather than trusting UI visibility alone.

// ---------------------------------------------------------------------
// 39. Authorization remains capability-specific
// ---------------------------------------------------------------------

interface Permission {
  readonly capability: string;
  readonly allowed: boolean;
}

const checkoutPermission: Permission = {
  capability: "checkout",
  allowed: true,
};

// Authentication answers who the user is.
//
// Authorization answers what the user is allowed to do.
//
// Each capability should enforce its own authorization requirements at the
// appropriate server or application boundary.

// ---------------------------------------------------------------------
// 40. Data ownership
// ---------------------------------------------------------------------

interface DataOwnership {
  readonly data: string;
  readonly owner: string;
}

const catalogDataOwnership: DataOwnership = {
  data: "Product catalog",
  owner: "Catalog",
};

// A micro-frontend boundary is stronger when the team also owns the
// behavior and data associated with its capability.
//
// Shared databases can weaken this independence.

// ---------------------------------------------------------------------
// 41. Avoid shared database coupling
// ---------------------------------------------------------------------

interface DatabaseDependency {
  readonly consumer: string;
  readonly databaseOwnedBy: string;
}

const checkoutDatabaseDependency: DatabaseDependency = {
  consumer: "Checkout",
  databaseOwnedBy: "Catalog",
};

// Directly reading another capability's private database creates coupling
// below the intended application boundary.
//
// Prefer explicit APIs or events for cross-capability data access.

// ---------------------------------------------------------------------
// 42. Backend-for-frontend boundaries
// ---------------------------------------------------------------------

interface BackendForFrontend {
  readonly capability: string;
  readonly responsibility: string;
}

const catalogBff: BackendForFrontend = {
  capability: "Catalog",
  responsibility: "Adapt backend data for catalog frontend needs",
};

// A backend-for-frontend can isolate frontend-specific data aggregation
// and API adaptation.
//
// It also introduces another deployable service and operational responsibility.

// ---------------------------------------------------------------------
// 43. API composition
// ---------------------------------------------------------------------

interface CatalogApi {
  readonly products: () => Promise<readonly ProductReference[]>;
}

interface AccountApi {
  readonly profile: () => Promise<{ readonly id: string; readonly name: string }>;
}

// A shell or gateway can compose data from multiple capabilities.
//
// Composition should not automatically move domain ownership into the shell.

// ---------------------------------------------------------------------
// 44. Loading boundaries
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

// Independently loaded micro-frontends need explicit loading states.
//
// The shell can provide a general loading boundary while the micro-frontend
// remains responsible for its own internal asynchronous state.

// ---------------------------------------------------------------------
// 45. Failure boundaries
// ---------------------------------------------------------------------

interface FailureBoundaryProps {
  readonly failed: boolean;
  readonly children: ReactNode;
}

export const FailureBoundary: FC<FailureBoundaryProps> = ({ failed, children }): ReactElement => {
  if (failed) {
    return <p>Unable to load this section.</p>;
  }

  return <>{children}</>;
};

// One micro-frontend failing should not necessarily prevent unrelated capabilities
// from rendering.
//
// Isolation therefore has an operational as well as organizational dimension.

// ---------------------------------------------------------------------
// 46. Error isolation
// ---------------------------------------------------------------------

interface MicroFrontendHealth {
  readonly name: string;
  readonly available: boolean;
}

const catalogHealth: MicroFrontendHealth = {
  name: "Catalog",
  available: true,
};

// Health monitoring can help distinguish a local capability failure
// from a failure affecting the whole application.

// ---------------------------------------------------------------------
// 47. Observability boundaries
// ---------------------------------------------------------------------

interface TelemetryContext {
  readonly application: string;
  readonly capability: string;
}

const catalogTelemetry: TelemetryContext = {
  application: "Example Application",
  capability: "Catalog",
};

// Logs, metrics, and traces should preserve enough context to identify
// which micro-frontend generated an event or failure.

// ---------------------------------------------------------------------
// 48. Correlation identifiers
// ---------------------------------------------------------------------

interface RequestContext {
  readonly requestId: string;
}

const requestContext: RequestContext = {
  requestId: "request-1",
};

// Shared correlation identifiers can help trace a user interaction across
// multiple frontend and backend boundaries.

// ---------------------------------------------------------------------
// 49. Performance costs
// ---------------------------------------------------------------------

interface PerformanceProfile {
  readonly bundleCount: number;
  readonly independentlyLoaded: boolean;
}

const performanceProfile: PerformanceProfile = {
  bundleCount: 3,
  independentlyLoaded: true,
};

// Micro-frontends can increase:
// - JavaScript payloads
// - network requests
// - startup work
// - duplicated dependencies
// - runtime initialization
//
// Independent deployment does not automatically mean better browser performance.

// ---------------------------------------------------------------------
// 50. Bundle duplication
// ---------------------------------------------------------------------

interface BundleDependency {
  readonly packageName: string;
  readonly copies: number;
}

const reactBundleDependency: BundleDependency = {
  packageName: "react",
  copies: 1,
};

// Shared dependencies can reduce duplication.
//
// But aggressive sharing can create version coupling.
//
// The architecture must balance payload efficiency against deployment independence.

// ---------------------------------------------------------------------
// 51. Code splitting vs. micro-frontends
// ---------------------------------------------------------------------

interface DeliveryTechnique {
  readonly technique: string;
  readonly primaryGoal: string;
}

const codeSplitting: DeliveryTechnique = {
  technique: "Code splitting",
  primaryGoal: "Load code when needed",
};

// Code splitting solves delivery and loading problems.
//
// Micro-frontends primarily address ownership, deployment, and organizational boundaries.
//
// They can be used together but solve different problems.

// ---------------------------------------------------------------------
// 52. Monorepos and micro-frontends
// ---------------------------------------------------------------------

interface RepositoryStrategy {
  readonly strategy: "monorepo" | "multirepo";
  readonly independentDeployment: boolean;
}

const repositoryStrategy: RepositoryStrategy = {
  strategy: "monorepo",
  independentDeployment: true,
};

// A monorepo does not prevent independent deployment.
//
// Repository structure and deployment structure are separate architectural decisions.

// ---------------------------------------------------------------------
// 53. Shared packages
// ---------------------------------------------------------------------

interface SharedPackage {
  readonly name: string;
  readonly purpose: string;
}

const sharedUiPackage: SharedPackage = {
  name: "Shared UI",
  purpose: "Reusable accessible visual primitives",
};

// Shared packages can provide consistency while allowing micro-frontends
// to keep feature-specific implementation private.

// ---------------------------------------------------------------------
// 54. Shared packages can become coupling points
// ---------------------------------------------------------------------

interface PackageDependency {
  readonly packageName: string;
  readonly consumers: readonly string[];
}

const sharedPackageDependency: PackageDependency = {
  packageName: "Shared UI",
  consumers: ["Catalog", "Account", "Checkout"],
};

// A widely shared package becomes a coordination point.
//
// Frequent breaking changes in shared packages can undermine independent delivery.

// ---------------------------------------------------------------------
// 55. Avoid a shared business-logic package
// ---------------------------------------------------------------------

interface SharedBusinessPackage {
  readonly capability: string;
  readonly consumers: readonly string[];
}

const sharedCheckoutLogic: SharedBusinessPackage = {
  capability: "Checkout rules",
  consumers: ["Checkout"],
};

// Business logic should generally remain owned by the capability responsible for it.
//
// Sharing domain behavior across unrelated micro-frontends can create hidden coupling.

// ---------------------------------------------------------------------
// 56. Shared contracts should remain narrow
// ---------------------------------------------------------------------

interface ProductSelectionContract {
  readonly productId: string;
}

// A narrow contract communicates exactly what another capability needs.
//
// Passing complete internal models across boundaries exposes more implementation
// than necessary and makes changes harder.

// ---------------------------------------------------------------------
// 57. Serialization boundaries
// ---------------------------------------------------------------------

interface SerializableProduct {
  readonly id: string;
  readonly name: string;
}

const serializedProduct: SerializableProduct = {
  id: "product-1",
  name: "Example Product",
};

// Cross-runtime boundaries should use data formats with clear serialization semantics.
//
// Avoid depending on framework-specific object identity across independent applications.

// ---------------------------------------------------------------------
// 58. Cross-boundary React elements
// ---------------------------------------------------------------------

interface ShellSlotProps {
  readonly children: ReactNode;
}

export const ShellSlot: FC<ShellSlotProps> = ({ children }): ReactElement => {
  return <div>{children}</div>;
};

// React elements can be composed naturally when micro-frontends share
// a compatible React runtime and integration model.
//
// Strong runtime isolation may instead require framework-neutral boundaries.

// ---------------------------------------------------------------------
// 59. Framework-neutral boundaries
// ---------------------------------------------------------------------

interface FrameworkNeutralContract {
  readonly mount: (element: HTMLElement) => void;
}

// A DOM-based contract can allow independently implemented applications
// to integrate without sharing React component APIs.
//
// The cost is that richer React composition semantics are no longer available
// across the boundary.

// ---------------------------------------------------------------------
// 60. Contract ownership
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

// One team should own the meaning and evolution of a cross-boundary contract.
//
// Consumers should participate in migration planning when the contract changes.

// ---------------------------------------------------------------------
// 61. Consumer-driven compatibility
// ---------------------------------------------------------------------

interface ConsumerRequirement {
  readonly consumer: string;
  readonly requirement: string;
}

const checkoutRequirement: ConsumerRequirement = {
  consumer: "Checkout",
  requirement: "Needs product identifier and selected quantity",
};

// Contract changes should be evaluated against actual consumer requirements.
//
// A producer should not expose unrelated internal data merely because it exists.

// ---------------------------------------------------------------------
// 62. Avoid distributed shared state
// ---------------------------------------------------------------------

interface SharedSelection {
  readonly productId: string | null;
  readonly quantity: number;
}

const sharedSelection: SharedSelection = {
  productId: null,
  quantity: 0,
};

// If multiple micro-frontends directly mutate the same state model,
// ownership becomes ambiguous.
//
// Explicit commands, events, or capability APIs can provide clearer boundaries.

// ---------------------------------------------------------------------
// 63. Commands across boundaries
// ---------------------------------------------------------------------

interface AddToCartCommand {
  readonly productId: string;
  readonly quantity: number;
}

const addToCartCommand: AddToCartCommand = {
  productId: "product-1",
  quantity: 1,
};

// A command communicates an intended operation without exposing the receiving
// capability's internal state representation.

// ---------------------------------------------------------------------
// 64. Events vs. commands
// ---------------------------------------------------------------------

interface EventVsCommand {
  readonly event: string;
  readonly command: string;
}

const eventVsCommand: EventVsCommand = {
  event: "product-selected",
  command: "add-to-cart",
};

// Events describe something that happened.
//
// Commands request that another capability perform an operation.
//
// Choosing between them affects coupling and ownership.

// ---------------------------------------------------------------------
// 65. Avoid bidirectional dependencies
// ---------------------------------------------------------------------

interface DependencyGraph {
  readonly catalogDependsOnCheckout: boolean;
  readonly checkoutDependsOnCatalog: boolean;
}

const dependencyGraph: DependencyGraph = {
  catalogDependsOnCheckout: false,
  checkoutDependsOnCatalog: true,
};

// A directional dependency is easier to reason about than two capabilities
// directly depending on each other's internals.
//
// Bidirectional relationships often indicate an unclear ownership boundary.

// ---------------------------------------------------------------------
// 66. Use an orchestration boundary when workflows span capabilities
// ---------------------------------------------------------------------

interface CheckoutOrchestrator {
  readonly begin: (productId: string) => void;
}

const checkoutOrchestrator: CheckoutOrchestrator = {
  begin: (productId) => {
    console.log(`Begin checkout for ${productId}`);
  },
};

// A shell, workflow service, or backend may orchestrate a multi-capability flow.
//
// Individual micro-frontends should not each know every detail of the entire workflow.

// ---------------------------------------------------------------------
// 67. Routing between micro-frontends
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

// Route ownership can make responsibility explicit.
//
// The application shell can delegate route rendering while retaining top-level
// navigation and fallback behavior.

// ---------------------------------------------------------------------
// 68. Deep links
// ---------------------------------------------------------------------

interface DeepLink {
  readonly route: string;
  readonly resourceId: string;
}

const productDeepLink: DeepLink = {
  route: "/catalog/product-1",
  resourceId: "product-1",
};

// Independently owned routes should remain directly navigable when the product
// requires deep linking and browser refresh support.

// ---------------------------------------------------------------------
// 69. Authentication redirects
// ---------------------------------------------------------------------

interface AuthRedirect {
  readonly returnTo: string;
}

const authRedirect: AuthRedirect = {
  returnTo: "/checkout",
};

// Authentication flows should preserve enough navigation context to return
// users to the capability they were trying to access.

// ---------------------------------------------------------------------
// 70. Deployment coordination
// ---------------------------------------------------------------------

interface DeploymentCompatibility {
  readonly catalogVersion: string;
  readonly shellVersion: string;
  readonly compatible: boolean;
}

const deploymentCompatibility: DeploymentCompatibility = {
  catalogVersion: "2.0",
  shellVersion: "3.0",
  compatible: true,
};

// Independent deployment does not eliminate compatibility requirements.
//
// It changes when and how compatibility must be managed.

// ---------------------------------------------------------------------
// 71. Rollback strategy
// ---------------------------------------------------------------------

interface RollbackPlan {
  readonly capability: string;
  readonly rollbackAvailable: boolean;
}

const catalogRollbackPlan: RollbackPlan = {
  capability: "Catalog",
  rollbackAvailable: true,
};

// Independently deployed capabilities should have rollback or recovery strategies
// appropriate to their operational risk.

// ---------------------------------------------------------------------
// 72. Release independence vs. release safety
// ---------------------------------------------------------------------

interface ReleasePolicy {
  readonly independentRelease: boolean;
  readonly compatibilityChecks: boolean;
}

const releasePolicy: ReleasePolicy = {
  independentRelease: true,
  compatibilityChecks: true,
};

// Independent releases increase autonomy.
//
// Compatibility checks, observability, and rollback mechanisms preserve safety
// when releases happen asynchronously.

// ---------------------------------------------------------------------
// 73. Testing micro-frontends independently
// ---------------------------------------------------------------------

interface TestableCatalogProps {
  readonly products: readonly CatalogProduct[];
}

export const TestableCatalog: FC<TestableCatalogProps> = ({ products }): ReactElement => {
  return <Catalog products={products} />;
};

// A micro-frontend should be testable as a capability rather than requiring
// the entire application to run for every component-level test.

// ---------------------------------------------------------------------
// 74. Contract testing
// ---------------------------------------------------------------------

interface ContractTest {
  readonly contract: string;
  readonly producer: string;
  readonly consumer: string;
}

const productContractTest: ContractTest = {
  contract: "ProductSelection",
  producer: "Catalog",
  consumer: "Checkout",
};

// Contract tests can verify that independently deployed producers and consumers
// agree on the shape and semantics of their integration.

// ---------------------------------------------------------------------
// 75. End-to-end testing
// ---------------------------------------------------------------------

interface EndToEndScenario {
  readonly name: string;
  readonly capabilities: readonly string[];
}

const purchaseScenario: EndToEndScenario = {
  name: "Purchase product",
  capabilities: ["Catalog", "Checkout"],
};

// End-to-end tests remain useful for cross-boundary workflows.
//
// They should complement, rather than replace, isolated component and contract tests.

// ---------------------------------------------------------------------
// 76. Failure testing
// ---------------------------------------------------------------------

interface FailureScenario {
  readonly capability: string;
  readonly expectedBehavior: string;
}

const catalogFailureScenario: FailureScenario = {
  capability: "Catalog",
  expectedBehavior: "Checkout remains available",
};

// Micro-frontend isolation should be validated under failure conditions,
// not only under successful loading.

// ---------------------------------------------------------------------
// 77. Accessibility across boundaries
// ---------------------------------------------------------------------

interface AccessibilityContract {
  readonly requirement: string;
  readonly owner: string;
}

const navigationAccessibility: AccessibilityContract = {
  requirement: "Keyboard-accessible top-level navigation",
  owner: "Application Shell",
};

// Accessibility responsibilities must remain clear when multiple applications
// contribute to one page.
//
// A capability should not assume another team will fix accessibility problems
// inside its own rendered UI.

// ---------------------------------------------------------------------
// 78. Styling isolation
// ---------------------------------------------------------------------

interface StylingStrategy {
  readonly capability: string;
  readonly strategy: string;
}

const catalogStyling: StylingStrategy = {
  capability: "Catalog",
  strategy: "Scoped component styles",
};

// Shared global CSS can create accidental coupling between independently owned
// applications.
//
// Styling isolation can be achieved through scoped CSS, CSS Modules,
// Shadow DOM, conventions, or other mechanisms.

// ---------------------------------------------------------------------
// 79. Design consistency vs. implementation independence
// ---------------------------------------------------------------------

interface VisualContract {
  readonly component: string;
  readonly sharedRequirement: string;
}

const buttonVisualContract: VisualContract = {
  component: "Button",
  sharedRequirement: "Consistent focus and interaction states",
};

// Micro-frontends can remain independently implemented while following
// shared design-system contracts.

// ---------------------------------------------------------------------
// 80. Localization boundaries
// ---------------------------------------------------------------------

interface LocalizationBoundary {
  readonly owner: string;
  readonly localeSource: string;
}

const catalogLocalization: LocalizationBoundary = {
  owner: "Catalog",
  localeSource: "Catalog translations",
};

// Localization can be centralized or capability-owned.
//
// The decision depends on translation workflows, runtime loading,
// shared terminology, and ownership requirements.

// ---------------------------------------------------------------------
// 81. Browser storage ownership
// ---------------------------------------------------------------------

interface StorageOwnership {
  readonly key: string;
  readonly owner: string;
}

const catalogStorage: StorageOwnership = {
  key: "catalog.preferences",
  owner: "Catalog",
};

// Shared local-storage keys create an implicit contract.
//
// Capability-specific namespaces can reduce accidental collisions and coupling.

// ---------------------------------------------------------------------
// 82. Communication should remain explicit
// ---------------------------------------------------------------------

interface CommunicationContract {
  readonly mechanism: "event" | "api" | "url" | "shared-state";
  readonly purpose: string;
}

const catalogToCheckoutCommunication: CommunicationContract = {
  mechanism: "event",
  purpose: "Notify checkout that a product was selected",
};

// Explicit communication mechanisms make cross-boundary relationships visible.
//
// Hidden communication through globals or undocumented storage keys is harder to evolve.

// ---------------------------------------------------------------------
// 83. Avoid an integration bus for every interaction
// ---------------------------------------------------------------------

interface IntegrationBusDecision {
  readonly interactionCount: number;
  readonly useBus: boolean;
}

const integrationBusDecision: IntegrationBusDecision = {
  interactionCount: 2,
  useBus: false,
};

// A generic event bus can become a global dependency graph that is difficult
// to understand.
//
// Direct APIs or narrowly scoped events may be simpler when relationships are known.

// ---------------------------------------------------------------------
// 84. Platform capabilities
// ---------------------------------------------------------------------

interface PlatformCapability {
  readonly name: string;
  readonly shared: boolean;
}

const platformCapabilities: readonly PlatformCapability[] = [
  {
    name: "Authentication",
    shared: true,
  },
  {
    name: "Observability",
    shared: true,
  },
  {
    name: "Feature flags",
    shared: true,
  },
];

// Platform capabilities are appropriate when multiple micro-frontends genuinely
// need the same infrastructure and consistent operational behavior.

// ---------------------------------------------------------------------
// 85. Platform coupling
// ---------------------------------------------------------------------

interface PlatformDependency {
  readonly capability: string;
  readonly platformDependency: string;
}

const catalogPlatformDependency: PlatformDependency = {
  capability: "Catalog",
  platformDependency: "Authentication",
};

// A platform should provide stable capabilities rather than become the owner
// of every feature-specific behavior.

// ---------------------------------------------------------------------
// 86. Organizational scaling
// ---------------------------------------------------------------------

interface TeamScale {
  readonly teams: number;
  readonly independentlyOwnedCapabilities: number;
}

const teamScale: TeamScale = {
  teams: 4,
  independentlyOwnedCapabilities: 4,
};

// Micro-frontends can become more useful when many teams need to deliver
// capabilities independently.
//
// Team scale alone does not prove that micro-frontends are necessary.

// ---------------------------------------------------------------------
// 87. Coordination cost
// ---------------------------------------------------------------------

interface CoordinationCost {
  readonly teamsInvolved: number;
  readonly releaseDependencies: number;
}

const coordinationCost: CoordinationCost = {
  teamsInvolved: 3,
  releaseDependencies: 2,
};

// If teams repeatedly block each other because unrelated capabilities must
// be released together, stronger ownership and deployment boundaries may help.

// ---------------------------------------------------------------------
// 88. Micro-frontends can increase coordination
// ---------------------------------------------------------------------

interface IntegrationCost {
  readonly integrationPoints: number;
  readonly operationalSystems: number;
}

const integrationCost: IntegrationCost = {
  integrationPoints: 8,
  operationalSystems: 4,
};

// Micro-frontends replace some centralized coordination with distributed coordination.
//
// The architecture can reduce one type of coupling while creating another.

// ---------------------------------------------------------------------
// 89. Avoid distributing a monolith
// ---------------------------------------------------------------------

interface DistributedMonolithSignal {
  readonly independentDeployment: boolean;
  readonly sharedReleaseRequired: boolean;
  readonly sharedRuntimeAssumptions: boolean;
}

const distributedMonolithSignal: DistributedMonolithSignal = {
  independentDeployment: false,
  sharedReleaseRequired: true,
  sharedRuntimeAssumptions: true,
};

// If separately deployed pieces still require synchronized releases and
// extensive shared assumptions, the architecture may have distributed
// deployment without achieving meaningful independence.

// ---------------------------------------------------------------------
// 90. Complete example: application shell
// ---------------------------------------------------------------------

interface AccountSummaryProps {
  readonly name: string;
}

export const AccountSummary: FC<AccountSummaryProps> = ({ name }): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <p>{name}</p>
    </section>
  );
};

interface CheckoutSummaryProps {
  readonly total: number;
}

export const CheckoutSummary: FC<CheckoutSummaryProps> = ({ total }): ReactElement => {
  return (
    <section>
      <h2>Checkout</h2>
      <p>Total: ${total.toFixed(2)}</p>
    </section>
  );
};

export const MicroFrontendApplication: FC = (): ReactElement => {
  const products: readonly CatalogProduct[] = [
    {
      id: "product-1",
      name: "Example Product",
      price: 29.99,
    },
  ];

  return (
    <ApplicationShell
      account={<AccountSummary name="John Doe" />}
      catalog={<Catalog products={products} />}
      checkout={<CheckoutSummary total={29.99} />}
    />
  );
};

// The shell composes capabilities:
//
// Application Shell
//   ├── Catalog
//   ├── Account
//   └── Checkout
//
// Each capability can own its internal implementation while the shell owns
// application-level composition.

// ---------------------------------------------------------------------
// 91. Complete example: explicit cross-boundary contract
// ---------------------------------------------------------------------

interface ProductSelectionApi {
  readonly selectProduct: (productId: string) => void;
}

interface CatalogWithIntegrationProps {
  readonly onProductSelected: (productId: string) => void;
}

export const CatalogWithIntegration: FC<CatalogWithIntegrationProps> = ({ onProductSelected }): ReactElement => {
  return (
    <button onClick={() => onProductSelected("product-1")} type="button">
      Select product
    </button>
  );
};

export const IntegratedCatalogExample: FC = (): ReactElement => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const selectionApi: ProductSelectionApi = {
    selectProduct: setSelectedProductId,
  };

  return (
    <section>
      <CatalogWithIntegration onProductSelected={selectionApi.selectProduct} />
      <p>Selected product: {selectedProductId ?? "None"}</p>
    </section>
  );
};

// The catalog exposes a narrow integration contract.
//
// The consumer does not need to know how the catalog manages its internal state.

// ---------------------------------------------------------------------
// 92. Complete example: event-based integration
// ---------------------------------------------------------------------

interface ProductSelectedDetail {
  readonly productId: string;
}

export const ProductEventPublisher: FC = (): ReactElement => {
  const publish = (): void => {
    const event = new CustomEvent<ProductSelectedDetail>("product-selected", {
      detail: {
        productId: "product-1",
      },
    });

    window.dispatchEvent(event);
  };

  return (
    <button onClick={publish} type="button">
      Publish selection
    </button>
  );
};

// DOM events can provide a framework-neutral communication mechanism.
//
// The event name and payload become part of the integration contract.

// ---------------------------------------------------------------------
// 93. Complete example: capability failure isolation
// ---------------------------------------------------------------------

interface CapabilityRegionProps {
  readonly name: string;
  readonly available: boolean;
  readonly children: ReactNode;
}

export const CapabilityRegion: FC<CapabilityRegionProps> = ({ name, available, children }): ReactElement => {
  if (!available) {
    return (
      <section>
        <h2>{name}</h2>
        <p>This section is temporarily unavailable.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>{name}</h2>
      {children}
    </section>
  );
};

export const FailureIsolationExample: FC = (): ReactElement => {
  return (
    <main>
      <CapabilityRegion available name="Catalog">
        <Catalog
          products={[
            {
              id: "product-1",
              name: "Example Product",
              price: 29.99,
            },
          ]}
        />
      </CapabilityRegion>

      <CapabilityRegion available={false} name="Account">
        <AccountSummary name="John Doe" />
      </CapabilityRegion>
    </main>
  );
};

// One capability can report its own failure without requiring unrelated
// capabilities to disappear.

// ---------------------------------------------------------------------
// 94. When micro-frontends may be appropriate
// ---------------------------------------------------------------------

interface MicroFrontendFit {
  readonly condition: string;
  readonly present: boolean;
}

const microFrontendFit: readonly MicroFrontendFit[] = [
  {
    condition: "Multiple teams need independent ownership",
    present: true,
  },
  {
    condition: "Independent deployment provides meaningful value",
    present: true,
  },
  {
    condition: "Capabilities have clear boundaries",
    present: true,
  },
  {
    condition: "The organization can operate distributed frontend systems",
    present: true,
  },
];

// These conditions provide evidence for considering micro-frontends.
//
// They are not a checklist that automatically determines the architecture.

// ---------------------------------------------------------------------
// 95. When simpler architecture may be sufficient
// ---------------------------------------------------------------------

interface SimplerArchitectureSignal {
  readonly condition: string;
  readonly present: boolean;
}

const simplerArchitectureSignals: readonly SimplerArchitectureSignal[] = [
  {
    condition: "One small team owns the application",
    present: true,
  },
  {
    condition: "Coordinated deployment is inexpensive",
    present: true,
  },
  {
    condition: "Capabilities are tightly integrated",
    present: true,
  },
  {
    condition: "Runtime independence provides little value",
    present: true,
  },
];

// A modular monolith can provide strong internal boundaries without
// introducing the operational cost of independently deployed frontends.

// ---------------------------------------------------------------------
// 96. Micro-frontends vs. modular monolith
// ---------------------------------------------------------------------

interface ArchitectureComparison {
  readonly concern: string;
  readonly modularMonolith: string;
  readonly microFrontends: string;
}

const architectureComparison: readonly ArchitectureComparison[] = [
  {
    concern: "Deployment",
    modularMonolith: "Usually coordinated",
    microFrontends: "Can be independent",
  },
  {
    concern: "Runtime integration",
    modularMonolith: "Direct module composition",
    microFrontends: "May require runtime composition",
  },
  {
    concern: "Team ownership",
    modularMonolith: "Can still be feature-oriented",
    microFrontends: "Often stronger operational separation",
  },
  {
    concern: "Operational complexity",
    modularMonolith: "Usually lower",
    microFrontends: "Usually higher",
  },
];

// The comparison illustrates tradeoffs rather than declaring one architecture
// universally preferable.

// ---------------------------------------------------------------------
// 97. Migration path from modular monolith
// ---------------------------------------------------------------------

interface MigrationStep {
  readonly step: number;
  readonly action: string;
}

const migrationSteps: readonly MigrationStep[] = [
  {
    step: 1,
    action: "Establish feature boundaries",
  },
  {
    step: 2,
    action: "Define public contracts",
  },
  {
    step: 3,
    action: "Remove internal cross-feature imports",
  },
  {
    step: 4,
    action: "Assign clear ownership",
  },
  {
    step: 5,
    action: "Introduce independent deployment only where justified",
  },
];

// Micro-frontends do not need to be introduced as the first step.
//
// Strong modular boundaries can establish much of the organizational structure first.

// ---------------------------------------------------------------------
// 98. Architecture should preserve reversibility
// ---------------------------------------------------------------------

interface ReversibleDecision {
  readonly decision: string;
  readonly reversalCost: "low" | "medium" | "high";
}

const runtimeCompositionDecision: ReversibleDecision = {
  decision: "Adopt runtime composition",
  reversalCost: "high",
};

// Expensive-to-reverse architectural decisions deserve stronger evidence.
//
// This is particularly important for deployment and runtime integration choices.

// ---------------------------------------------------------------------
// 99. Micro-frontends are an organizational architecture
// ---------------------------------------------------------------------

interface OrganizationalArchitecture {
  readonly technicalBoundary: string;
  readonly organizationalBoundary: string;
}

const catalogOrganizationalArchitecture: OrganizationalArchitecture = {
  technicalBoundary: "Catalog application boundary",
  organizationalBoundary: "Catalog Team ownership",
};

// The strongest value of micro-frontends often comes from aligning
// technical boundaries with team ownership and delivery responsibility.

// ---------------------------------------------------------------------
// 100. Complete architecture model
// ---------------------------------------------------------------------

interface MicroFrontendArchitecture {
  readonly shell: string;
  readonly capabilities: readonly string[];
  readonly sharedInfrastructure: readonly string[];
  readonly communication: readonly string[];
  readonly ownership: readonly string[];
}

const architecture: MicroFrontendArchitecture = {
  shell: "Application shell",
  capabilities: ["Catalog", "Account", "Checkout"],
  sharedInfrastructure: ["Authentication", "Observability", "Design System"],
  communication: ["URL", "Explicit APIs", "Typed events"],
  ownership: ["Catalog Team", "Account Team", "Checkout Team"],
};

export const MicroFrontendArchitectureExample: FC = (): ReactElement => {
  return (
    <ApplicationShell
      account={<AccountSummary name="John Doe" />}
      catalog={
        <Catalog
          products={[
            {
              id: "product-1",
              name: "Example Product",
              price: 29.99,
            },
          ]}
        />
      }
      checkout={<CheckoutSummary total={29.99} />}
    />
  );
};

// This model keeps the major architectural responsibilities explicit:
//
// Application shell
//   -> global composition and platform concerns
//
// Micro-frontends
//   -> capability-specific behavior and ownership
//
// Shared infrastructure
//   -> deliberately shared technical capabilities
//
// Cross-boundary contracts
//   -> explicit APIs, events, and navigation
//
// The architecture remains useful only while these boundaries provide more
// value than the complexity required to maintain them.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Micro-frontends divide a large frontend into independently owned capabilities with explicit boundaries.
// - A micro-frontend is stronger than an ordinary module or component because ownership and delivery are part of the boundary.
// - Business capabilities usually provide more meaningful boundaries than arbitrary technical fragments.
// - Independent deployment is a major benefit but introduces compatibility, rollback, observability, and operational requirements.
// - Runtime composition can use several mechanisms, including module federation, custom elements, iframes, or server-side composition.
// - Sharing one React runtime can simplify interoperability, while runtime isolation can provide stronger independence at additional cost.
// - Shared UI and design tokens can provide consistency without exposing feature-specific implementation.
// - Shared business state should be minimized because it can create hidden coupling between independently owned capabilities.
// - Explicit APIs, commands, events, and URL state provide clearer cross-boundary communication than undocumented global state.
// - Cross-boundary contracts need clear ownership, versioning strategy, and migration paths.
// - The application shell should coordinate global concerns without becoming a centralized owner of every feature's business logic.
// - Data ownership should follow capability ownership; direct access to another capability's private data weakens the boundary.
// - Failure, loading, accessibility, styling, localization, and observability responsibilities must remain explicit across boundaries.
// - Micro-frontends can increase bundle size, runtime complexity, dependency coordination, and testing requirements.
// - Code splitting solves loading concerns, while micro-frontends primarily address ownership and delivery boundaries.
// - A monorepo and independent deployment are separate decisions and can coexist.
// - Shared packages can reduce duplication but become coordination points when many capabilities depend on them.
// - A distributed frontend can become a distributed monolith if independent pieces still require synchronized releases and extensive shared assumptions.
// - A modular monolith can provide strong feature boundaries without the operational complexity of independently deployed micro-frontends.
// - Micro-frontends are most useful when their ownership, deployment, and organizational benefits justify the additional integration complexity.
