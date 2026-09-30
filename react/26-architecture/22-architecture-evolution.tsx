/**
 * Architecture Evolution
 * =======================
 *
 * Architecture evolves as requirements, boundaries, dependencies, teams, and operational
 * constraints change. A structure that is appropriate for a small application can become
 * restrictive as the application grows, while a highly structured architecture can introduce
 * unnecessary complexity when the actual system is still small.
 *
 * Architectural evolution is the deliberate process of changing boundaries and dependencies
 * in response to real constraints while preserving correct behavior and keeping change controlled.
 */

import { useState } from "react";
import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Architecture is not static
// ---------------------------------------------------------------------

// An application's architecture changes as:
// - features are added
// - requirements change
// - teams grow
// - integrations increase
// - deployment requirements change
// - performance constraints emerge
// - ownership becomes clearer
//
// Architecture should therefore be treated as something that can be revised
// rather than something that must be perfect from the beginning.

// ---------------------------------------------------------------------
// 2. Start with the simplest sufficient structure
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return <p>Hello, {name}.</p>;
};

// A small component does not require an elaborate architecture.
//
// Starting simply keeps the initial cognitive and maintenance cost low.

// ---------------------------------------------------------------------
// 3. Let requirements create architectural pressure
// ---------------------------------------------------------------------

interface FeatureRequirement {
  readonly description: string;
  readonly architecturalPressure: "low" | "medium" | "high";
}

const searchRequirement: FeatureRequirement = {
  description: "Search products from an external service",
  architecturalPressure: "medium",
};

// Architectural pressure appears when the current structure makes a requirement
// increasingly difficult to implement, test, deploy, or change.
//
// The pressure—not the desire to use a particular pattern—should motivate evolution.

// ---------------------------------------------------------------------
// 4. Recognize architectural signals
// ---------------------------------------------------------------------

interface ArchitectureSignal {
  readonly symptom: string;
  readonly repeated: boolean;
  readonly impact: "low" | "medium" | "high";
}

const repeatedIntegrationLogic: ArchitectureSignal = {
  symptom: "Multiple components contain transport-specific code",
  repeated: true,
  impact: "high",
};

// Useful signals include:
// - repeated logic
// - growing dependency chains
// - unclear ownership
// - difficult tests
// - frequent unrelated changes
// - duplicated state
// - unstable public APIs
// - deployment constraints
//
// One occurrence may be incidental.
// Repeated problems are stronger evidence for architectural change.

// ---------------------------------------------------------------------
// 5. Refactor toward observed boundaries
// ---------------------------------------------------------------------

interface Product {
  readonly id: string;
  readonly name: string;
}

interface ProductApi {
  readonly getProducts: () => Promise<readonly Product[]>;
}

const loadProducts = async (api: ProductApi): Promise<readonly Product[]> => {
  return api.getProducts();
};

// If many consumers depend directly on a transport implementation,
// introducing a narrow application-facing contract can isolate the change.
//
// The important part is the boundary, not the number of layers.

// ---------------------------------------------------------------------
// 6. Evolution can preserve behavior
// ---------------------------------------------------------------------

interface PriceProps {
  readonly amount: number;
}

export const Price: FC<PriceProps> = ({ amount }): ReactElement => {
  return <span>${amount.toFixed(2)}</span>;
};

// A refactoring should change structure without unintentionally changing
// externally observable behavior.
//
// Tests, type checking, and runtime verification help establish that the
// architectural change did not alter the intended behavior.

// ---------------------------------------------------------------------
// 7. Extract cohesive responsibilities
// ---------------------------------------------------------------------

interface ProductListProps {
  readonly products: readonly Product[];
}

export const ProductList: FC<ProductListProps> = ({ products }): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

// Extracting a component can be an architectural change when it establishes
// a meaningful responsibility and public contract.
//
// Extraction should improve the boundary rather than merely reduce file length.

// ---------------------------------------------------------------------
// 8. Avoid refactoring by line count
// ---------------------------------------------------------------------

// A large component is not automatically architecturally wrong.
//
// A small component can still have:
// - unclear ownership
// - excessive dependencies
// - mixed responsibilities
// - unstable contracts
//
// Architecture should respond to responsibilities and dependencies,
// not to arbitrary file or component size.

// ---------------------------------------------------------------------
// 9. Evolve state ownership
// ---------------------------------------------------------------------

interface EditorProps {
  readonly initialValue: string;
}

export const Editor: FC<EditorProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState(initialValue);

  return (
    <label>
      Value
      <input value={value} onChange={(event) => setValue(event.target.value)} />
    </label>
  );
};

// State can begin locally.
//
// As another component needs to coordinate the same state, ownership can move
// to the nearest common owner.
//
// State migration should follow actual coordination requirements.

// ---------------------------------------------------------------------
// 10. Lift state when coordination appears
// ---------------------------------------------------------------------

interface SearchControlsProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
}

export const SearchControls: FC<SearchControlsProps> = ({ query, onQueryChange }): ReactElement => {
  return <input value={query} onChange={(event) => onQueryChange(event.target.value)} />;
};

interface SearchResultsProps {
  readonly query: string;
}

export const SearchResults: FC<SearchResultsProps> = ({ query }): ReactElement => {
  return <p>Searching for: {query}</p>;
};

export const SearchPage: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  return (
    <section>
      <SearchControls onQueryChange={setQuery} query={query} />
      <SearchResults query={query} />
    </section>
  );
};

// The parent owns the state because both children depend on it.
//
// This is an architectural change in ownership, not merely a change in syntax.

// ---------------------------------------------------------------------
// 11. Move derived state out of ownership
// ---------------------------------------------------------------------

interface PriceListProps {
  readonly prices: readonly number[];
}

export const PriceList: FC<PriceListProps> = ({ prices }): ReactElement => {
  const total = prices.reduce((sum, price) => sum + price, 0);

  return <output>Total: ${total.toFixed(2)}</output>;
};

// Derived values should generally remain derived from their source.
//
// When a codebase stores both source and derived state, architectural evolution
// may involve removing duplicated state and restoring a single source of truth.

// ---------------------------------------------------------------------
// 12. Introduce a module boundary
// ---------------------------------------------------------------------

interface CatalogRepository {
  readonly findAll: () => Promise<readonly Product[]>;
}

const createCatalogRepository = (api: ProductApi): CatalogRepository => {
  return {
    findAll: api.getProducts,
  };
};

// A repository boundary can isolate data retrieval from UI code.
//
// The repository is useful when the data source or retrieval policy has become
// a meaningful architectural concern.

// ---------------------------------------------------------------------
// 13. Separate infrastructure from application logic
// ---------------------------------------------------------------------

interface ProductService {
  readonly listProducts: () => Promise<readonly Product[]>;
}

const createProductService = (repository: CatalogRepository): ProductService => {
  return {
    listProducts: () => repository.findAll(),
  };
};

// The service boundary can own application-level operations.
//
// It should not be introduced simply because "services" are a common pattern.
// It becomes useful when application behavior needs a stable boundary independent
// of the underlying infrastructure.

// ---------------------------------------------------------------------
// 14. Evolve toward dependency inversion
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
}

interface UserRepository {
  readonly findById: (id: string) => Promise<User | null>;
}

const getUserName = async (repository: UserRepository, id: string): Promise<string | null> => {
  const user = await repository.findById(id);

  return user?.name ?? null;
};

// Higher-level behavior depends on the repository contract rather than on a
// concrete database or HTTP implementation.
//
// This makes the external mechanism replaceable.

// ---------------------------------------------------------------------
// 15. Replace direct infrastructure dependencies
// ---------------------------------------------------------------------

interface HttpClient {
  readonly get: <T>(url: string) => Promise<T>;
}

const createHttpUserRepository = (client: HttpClient): UserRepository => {
  return {
    findById: (id) => client.get<User>(`/users/${id}`),
  };
};

// The HTTP client remains infrastructure.
//
// The application sees only the repository contract.
//
// This creates a stable point where infrastructure can evolve independently.

// ---------------------------------------------------------------------
// 16. Introduce adapters when external shapes leak
// ---------------------------------------------------------------------

interface ExternalProduct {
  readonly product_id: string;
  readonly product_name: string;
}

interface ProductDto {
  readonly id: string;
  readonly name: string;
}

const toProductDto = (product: ExternalProduct): ProductDto => {
  return {
    id: product.product_id,
    name: product.product_name,
  };
};

// Mapping external data at a boundary prevents external naming and structure
// from spreading throughout the application.

// ---------------------------------------------------------------------
// 17. Evolve API contracts deliberately
// ---------------------------------------------------------------------

interface ProductCardProps {
  readonly product: Product;
  readonly onSelect: (id: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onSelect }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <button onClick={() => onSelect(product.id)} type="button">
        Select
      </button>
    </article>
  );
};

// A public component API becomes an architectural boundary when multiple consumers
// depend on it.
//
// Changing the contract should therefore be deliberate and coordinated.

// ---------------------------------------------------------------------
// 18. Prefer narrow contracts during evolution
// ---------------------------------------------------------------------

interface ProductSelectorProps {
  readonly onSelect: (id: string) => void;
}

// A component that only needs an identifier should not require an entire service,
// repository, or application object.
//
// Narrowing a contract can reduce coupling without requiring a large redesign.

// ---------------------------------------------------------------------
// 19. Preserve compatibility during migration
// ---------------------------------------------------------------------

interface NewProductProps {
  readonly product: Product;
}

export const NewProductCard: FC<NewProductProps> = ({ product }): ReactElement => {
  return <article>{product.name}</article>;
};

interface LegacyProductProps {
  readonly name: string;
}

export const LegacyProductCard: FC<LegacyProductProps> = ({ name }): ReactElement => {
  return <NewProductCard product={{ id: "legacy", name }} />;
};

// A compatibility wrapper can allow consumers to migrate gradually.
//
// This is useful when changing a public boundary all at once would create
// unnecessary coordination or deployment risk.

// ---------------------------------------------------------------------
// 20. Deprecate before removing
// ---------------------------------------------------------------------

/**
 * @deprecated Prefer `NewProductCard`.
 */
export const DeprecatedProductCard: FC<LegacyProductProps> = ({ name }): ReactElement => {
  return <NewProductCard product={{ id: "legacy", name }} />;
};

// Deprecation creates a migration period.
//
// The old API can remain temporarily while consumers move to the new boundary.

// ---------------------------------------------------------------------
// 21. Use strangler-style migration
// ---------------------------------------------------------------------

interface LegacyCatalog {
  readonly list: () => readonly Product[];
}

interface NewCatalog {
  readonly list: () => readonly Product[];
}

const legacyCatalog: LegacyCatalog = {
  list: () => [
    {
      id: "product-1",
      name: "Example Product",
    },
  ],
};

const newCatalog: NewCatalog = {
  list: () => [
    {
      id: "product-1",
      name: "Example Product",
    },
  ],
};

// A migration can gradually move responsibilities from an old structure
// to a new structure instead of requiring an immediate rewrite.
//
// The old boundary can shrink as the new boundary grows.

// ---------------------------------------------------------------------
// 22. Avoid big-bang rewrites
// ---------------------------------------------------------------------

// A rewrite replaces a large portion of the system simultaneously.
//
// It can provide a clean target architecture but also creates:
// - large coordination cost
// - long periods of parallel implementation
// - difficult rollback
// - uncertain migration completeness
//
// Incremental migration often reduces the size of each individual change.

// ---------------------------------------------------------------------
// 23. Migrate one boundary at a time
// ---------------------------------------------------------------------

interface NotificationGateway {
  readonly send: (message: string) => Promise<void>;
}

interface NotificationService {
  readonly notify: (message: string) => Promise<void>;
}

const createNotificationService = (gateway: NotificationGateway): NotificationService => {
  return {
    notify: (message) => gateway.send(message),
  };
};

// One integration can move behind the gateway without requiring the entire
// application architecture to change at once.

// ---------------------------------------------------------------------
// 24. Separate structural and behavioral changes
// ---------------------------------------------------------------------

interface Profile {
  readonly name: string;
  readonly email: string;
}

const formatProfileName = (profile: Profile): string => {
  return profile.name.trim();
};

// A structural refactoring changes organization.
//
// A behavioral change changes what the software does.
//
// Keeping them separate makes failures easier to identify and reviews easier to reason about.

// ---------------------------------------------------------------------
// 25. Use characterization tests before risky refactoring
// ---------------------------------------------------------------------

interface Formatter {
  readonly format: (value: string) => string;
}

const formatter: Formatter = {
  format: (value) => value.trim(),
};

// Characterization tests document existing behavior before a structural change.
//
// They are particularly useful when the current implementation is poorly understood
// but must be preserved during migration.

// ---------------------------------------------------------------------
// 26. Use types as migration constraints
// ---------------------------------------------------------------------

interface Account {
  readonly id: string;
  readonly displayName: string;
}

const account: Account = {
  id: "account-1",
  displayName: "John Doe",
};

// Type errors can expose consumers that still depend on an old contract.
//
// A compiler can therefore become part of the migration feedback loop.

// ---------------------------------------------------------------------
// 27. Use feature flags for behavioral migration
// ---------------------------------------------------------------------

interface FeatureConfiguration {
  readonly useNewCatalog: boolean;
}

const featureConfiguration: FeatureConfiguration = {
  useNewCatalog: true,
};

// Feature flags can allow a new implementation to coexist with an old one
// while rollout and verification happen incrementally.
//
// Flags also create temporary complexity and should have a removal plan.

// ---------------------------------------------------------------------
// 28. Avoid permanent migration infrastructure
// ---------------------------------------------------------------------

interface MigrationStatus {
  readonly complete: boolean;
  readonly remainingConsumers: number;
}

const migrationStatus: MigrationStatus = {
  complete: false,
  remainingConsumers: 3,
};

// Compatibility adapters, feature flags, and transitional APIs are useful
// during migration but become architectural debt if they remain indefinitely.

// ---------------------------------------------------------------------
// 29. Track architectural debt explicitly
// ---------------------------------------------------------------------

interface ArchitectureDebt {
  readonly description: string;
  readonly owner: string;
  readonly reason: string;
}

const architectureDebt: ArchitectureDebt = {
  description: "Legacy catalog adapter",
  owner: "Catalog Team",
  reason: "Temporary migration boundary",
};

// Temporary compromises should have enough ownership and context that the team
// can distinguish intentional transitional structure from accidental neglect.

// ---------------------------------------------------------------------
// 30. Refactor toward stronger module ownership
// ---------------------------------------------------------------------

interface FeatureApi {
  readonly search: (query: string) => Promise<readonly Product[]>;
}

const featureApi: FeatureApi = {
  search: async () => [],
};

// A feature can expose a small public API while keeping internal state,
// transformations, and infrastructure private.
//
// This allows the feature to evolve without exposing every internal module.

// ---------------------------------------------------------------------
// 31. Move shared code only after reuse becomes real
// ---------------------------------------------------------------------

interface DateFormatter {
  readonly format: (date: Date) => string;
}

const dateFormatter: DateFormatter = {
  format: (date) => date.toISOString(),
};

// Code should not be moved into a shared module merely because it looks reusable.
//
// Actual reuse, stable semantics, and clear ownership provide stronger evidence
// that a shared boundary is appropriate.

// ---------------------------------------------------------------------
// 32. Split shared code when concepts diverge
// ---------------------------------------------------------------------

interface UserDisplay {
  readonly name: string;
}

interface AdminDisplay {
  readonly name: string;
  readonly permissions: readonly string[];
}

// A shared abstraction can become problematic when consumers acquire unrelated
// requirements.
//
// Splitting the abstraction can restore cohesion and reduce conditional behavior.

// ---------------------------------------------------------------------
// 33. Evolve component boundaries as responsibilities change
// ---------------------------------------------------------------------

interface ProfileHeaderProps {
  readonly name: string;
  readonly email: string;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ name, email }): ReactElement => {
  return (
    <header>
      <h1>{name}</h1>
      <p>{email}</p>
    </header>
  );
};

interface ProfilePageProps {
  readonly profile: Profile;
  readonly children: ReactNode;
}

export const ProfilePage: FC<ProfilePageProps> = ({ profile, children }): ReactElement => {
  return (
    <main>
      <ProfileHeader email={profile.email} name={profile.name} />
      {children}
    </main>
  );
};

// As the page acquires additional responsibilities, cohesive pieces can be
// extracted without forcing the entire page into unrelated abstractions.

// ---------------------------------------------------------------------
// 34. Evolve from prop drilling when necessary
// ---------------------------------------------------------------------

interface Theme {
  readonly mode: "light" | "dark";
}

interface ThemedPanelProps {
  readonly theme: Theme;
  readonly children: ReactNode;
}

export const ThemedPanel: FC<ThemedPanelProps> = ({ theme, children }): ReactElement => {
  return <section data-theme={theme.mode}>{children}</section>;
};

// If the same contextual value must pass through many unrelated layers,
// context may become an appropriate architectural evolution.
//
// The goal is not to eliminate props but to remove unnecessary wiring.

// ---------------------------------------------------------------------
// 35. Evolve from global state when ownership becomes local
// ---------------------------------------------------------------------

interface GlobalSelection {
  readonly productId: string | null;
}

const globalSelection: GlobalSelection = {
  productId: null,
};

// A state value that was once shared may later belong to one feature.
//
// Architectural evolution can therefore move state inward as well as outward.

// ---------------------------------------------------------------------
// 36. Move domain logic toward domain boundaries
// ---------------------------------------------------------------------

interface Cart {
  readonly items: readonly CartItem[];
}

const calculateCartQuantity = (cart: Cart): number => {
  return cart.items.reduce((total, item) => total + item.quantity, 0);
};

// As business rules become important, moving them away from UI components
// can make ownership clearer and prevent duplication.

// ---------------------------------------------------------------------
// 37. Introduce use-case boundaries when workflows grow
// ---------------------------------------------------------------------

interface CheckoutWorkflow {
  readonly execute: (order: Order) => Promise<void>;
}

const createCheckoutWorkflow = (paymentProvider: PaymentProvider): CheckoutWorkflow => {
  return {
    execute: async (order) => {
      await paymentProvider.charge(order.total);
    },
  };
};

// A use-case boundary can coordinate multiple operations.
//
// It becomes useful when a workflow has enough application behavior that
// embedding it directly in a component would create excessive responsibility.

// ---------------------------------------------------------------------
// 38. Keep the UI as an adapter to application behavior
// ---------------------------------------------------------------------

interface CheckoutViewProps {
  readonly workflow: CheckoutWorkflow;
  readonly order: Order;
}

export const CheckoutView: FC<CheckoutViewProps> = ({ workflow, order }): ReactElement => {
  const submit = async (): Promise<void> => {
    await workflow.execute(order);
  };

  return (
    <button onClick={() => void submit()} type="button">
      Place order
    </button>
  );
};

// The component translates user interaction into an application operation.
//
// It does not need to know how payment processing is implemented.

// ---------------------------------------------------------------------
// 39. Evolve data boundaries around external systems
// ---------------------------------------------------------------------

interface ExternalOrder {
  readonly order_id: string;
  readonly total_amount: number;
}

interface OrderData {
  readonly id: string;
  readonly total: number;
}

const toOrderData = (externalOrder: ExternalOrder): OrderData => {
  return {
    id: externalOrder.order_id,
    total: externalOrder.total_amount,
  };
};

// Data mapping is a useful evolutionary boundary when external APIs become
// unstable or when their vocabulary does not match application concepts.

// ---------------------------------------------------------------------
// 40. Evolve validation toward trust boundaries
// ---------------------------------------------------------------------

const isProduct = (value: unknown): value is Product => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.id === "string" && typeof candidate.name === "string";
};

// External input should be validated before being treated as trusted application data.
//
// As integrations increase, validation boundaries become increasingly important.

// ---------------------------------------------------------------------
// 41. Evolve error handling
// ---------------------------------------------------------------------

type LoadState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "success"; readonly products: readonly Product[] }
  | { readonly status: "error"; readonly message: string };

const initialLoadState: LoadState = {
  status: "idle",
};

// A simple operation may only need a thrown error.
//
// As asynchronous workflows become more visible to the UI, explicit state can
// make loading, success, and failure boundaries clearer.

// ---------------------------------------------------------------------
// 42. Evolve from implicit to explicit dependencies
// ---------------------------------------------------------------------

interface Analytics {
  readonly track: (event: string) => void;
}

const analytics: Analytics = {
  track: (event) => {
    console.log(event);
  },
};

// A global dependency can be convenient initially.
//
// If testing, replacement, or ownership becomes difficult, the dependency can
// evolve into an explicit parameter or injected service.

// ---------------------------------------------------------------------
// 43. Evolve package boundaries when module boundaries are insufficient
// ---------------------------------------------------------------------

interface PackageBoundary {
  readonly packageName: string;
  readonly publicApi: readonly string[];
}

const catalogPackage: PackageBoundary = {
  packageName: "catalog",
  publicApi: ["Catalog"],
};

// A package boundary can provide stronger ownership and dependency control
// than a collection of folders or internal modules.
//
// The stronger boundary should be justified by the scale and ownership needs.

// ---------------------------------------------------------------------
// 44. Evolve toward independent deployment only when required
// ---------------------------------------------------------------------

interface DeploymentBoundary {
  readonly name: string;
  readonly independentlyDeployed: boolean;
}

const applicationBoundary: DeploymentBoundary = {
  name: "Main application",
  independentlyDeployed: false,
};

// Independent deployment introduces additional operational and integration concerns.
//
// It should be driven by deployment or organizational requirements rather than
// treated as an automatic consequence of application growth.

// ---------------------------------------------------------------------
// 45. Micro-frontends are an evolutionary choice
// ---------------------------------------------------------------------

interface MicroFrontendBoundary {
  readonly owner: string;
  readonly deployment: string;
  readonly integrationContract: string;
}

const catalogMicroFrontend: MicroFrontendBoundary = {
  owner: "Catalog Team",
  deployment: "Independent",
  integrationContract: "Navigation and shared UI contracts",
};

// Moving from a monolith to micro-frontends is a substantial architectural change.
//
// It affects runtime composition, dependency sharing, deployment, observability,
// communication, testing, and team ownership.

// ---------------------------------------------------------------------
// 46. Evolve shared runtime decisions carefully
// ---------------------------------------------------------------------

interface RuntimeDependency {
  readonly name: string;
  readonly version: string;
  readonly shared: boolean;
}

const reactRuntime: RuntimeDependency = {
  name: "react",
  version: "19.x",
  shared: true,
};

// Shared runtimes can improve interoperability.
//
// Isolated runtimes can improve deployment independence.
//
// The correct decision depends on the integration model and operational constraints.

// ---------------------------------------------------------------------
// 47. Evolve design systems from repeated UI patterns
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly children: ReactNode;
  readonly onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ children, onClick }): ReactElement => {
  return (
    <button onClick={onClick} type="button">
      {children}
    </button>
  );
};

// A design-system component is often the result of repeated stable UI requirements.
//
// It should not become a dumping ground for unrelated feature behavior.

// ---------------------------------------------------------------------
// 48. Evolve design tokens from repeated visual decisions
// ---------------------------------------------------------------------

interface DesignTokens {
  readonly spacingMedium: string;
  readonly radiusMedium: string;
}

const designTokens: DesignTokens = {
  spacingMedium: "16px",
  radiusMedium: "8px",
};

// Centralized tokens can make visual changes consistent.
//
// The architectural value comes from shared ownership of visual decisions,
// not merely from moving constants into another file.

// ---------------------------------------------------------------------
// 49. Evolve architecture through deprecation
// ---------------------------------------------------------------------

/**
 * @deprecated Use `Button` with the appropriate props.
 */
export const LegacyButton: FC<ButtonProps> = ({ children, onClick }): ReactElement => {
  return <Button onClick={onClick}>{children}</Button>;
};

// Deprecation communicates that a boundary is transitional.
//
// It is useful only when the old API has a realistic migration path.

// ---------------------------------------------------------------------
// 50. Evolve through versioned contracts
// ---------------------------------------------------------------------

interface SearchApiV1 {
  readonly search: (query: string) => Promise<readonly Product[]>;
}

interface SearchApiV2 {
  readonly search: (query: string, limit: number) => Promise<readonly Product[]>;
}

// Versioned contracts can support independently evolving consumers.
//
// They also create maintenance overhead, so multiple versions should not remain
// indefinitely without a clear compatibility strategy.

// ---------------------------------------------------------------------
// 51. Avoid compatibility branches spreading everywhere
// ---------------------------------------------------------------------

const adaptSearchApiV1 = (api: SearchApiV1): SearchApiV2 => {
  return {
    search: (query, limit) => {
      void limit;
      return api.search(query);
    },
  };
};

// Compatibility logic should remain close to the migration boundary.
//
// Allowing every consumer to understand both versions multiplies migration complexity.

// ---------------------------------------------------------------------
// 52. Measure architectural improvement
// ---------------------------------------------------------------------

interface ArchitectureMetric {
  readonly name: string;
  readonly before: number;
  readonly after: number;
}

const testSetupComplexity: ArchitectureMetric = {
  name: "Test setup steps",
  before: 8,
  after: 4,
};

// Useful measurements can include:
// - number of affected modules per change
// - test setup complexity
// - dependency count
// - build time
// - deployment coordination
// - duplicated logic
// - defect frequency
//
// Measurement should reflect the problem the architectural change was intended to address.

// ---------------------------------------------------------------------
// 53. Watch for migration side effects
// ---------------------------------------------------------------------

interface MigrationRisk {
  readonly risk: string;
  readonly mitigation: string;
}

const migrationRisk: MigrationRisk = {
  risk: "Two implementations produce different results",
  mitigation: "Compare outputs before switching consumers",
};

// Every migration introduces temporary complexity.
//
// The migration itself needs architectural discipline.

// ---------------------------------------------------------------------
// 54. Keep migration paths observable
// ---------------------------------------------------------------------

interface MigrationTelemetry {
  readonly legacyCalls: number;
  readonly newCalls: number;
}

const migrationTelemetry: MigrationTelemetry = {
  legacyCalls: 20,
  newCalls: 80,
};

// When both old and new paths exist, visibility into their usage can help determine
// whether the old boundary is ready to be removed.

// ---------------------------------------------------------------------
// 55. Remove transitional code
// ---------------------------------------------------------------------

interface RemovalCandidate {
  readonly name: string;
  readonly remainingConsumers: number;
}

const oldAdapter: RemovalCandidate = {
  name: "Legacy catalog adapter",
  remainingConsumers: 0,
};

// A migration is not complete when the new implementation exists.
//
// It is complete when the old path can be removed safely and the architecture
// no longer needs to carry the transitional complexity.

// ---------------------------------------------------------------------
// 56. Avoid architecture fossilization
// ---------------------------------------------------------------------

// Architecture fossilization occurs when temporary decisions become permanent
// even after the original constraint disappears.
//
// Examples:
//
// - temporary compatibility APIs that are never removed
// - migration flags that remain forever
// - duplicated implementations kept without reason
// - abstractions created for requirements that no longer exist
//
// Periodic architectural cleanup prevents temporary structure from becoming permanent.

// ---------------------------------------------------------------------
// 57. Revisit boundaries after major changes
// ---------------------------------------------------------------------

interface BoundaryReview {
  readonly trigger: string;
  readonly question: string;
}

const featureGrowthReview: BoundaryReview = {
  trigger: "Feature now has multiple owners",
  question: "Does the current boundary still reflect ownership?",
};

// Boundaries that were correct previously may become inappropriate later.
//
// Architecture should be reviewed after significant changes in responsibility,
// ownership, deployment, or dependency structure.

// ---------------------------------------------------------------------
// 58. Architecture can become simpler as well as more complex
// ---------------------------------------------------------------------

interface Simplification {
  readonly oldBoundary: string;
  readonly newBoundary: string;
}

const simplifiedBoundary: Simplification = {
  oldBoundary: "Repository + service + adapter",
  newBoundary: "Repository",
};

// Evolution does not always mean adding layers.
//
// If multiple abstractions no longer provide meaningful isolation,
// removing them can improve cohesion and local reasoning.

// ---------------------------------------------------------------------
// 59. Consolidate unnecessary abstractions
// ---------------------------------------------------------------------

interface SimpleCatalog {
  readonly find: () => Promise<readonly Product[]>;
}

const simpleCatalog: SimpleCatalog = {
  find: async () => [],
};

// If an abstraction only forwards calls and provides no meaningful contract,
// removing it can reduce indirection.
//
// Architectural maturity includes knowing when to delete structure.

// ---------------------------------------------------------------------
// 60. Preserve useful seams
// ---------------------------------------------------------------------

interface PaymentGateway {
  readonly charge: (amount: number) => Promise<void>;
}

const paymentGateway: PaymentGateway = {
  charge: async () => undefined,
};

// A seam is a point where behavior can be replaced, tested, or evolved.
//
// Valuable seams usually exist around external systems, unstable dependencies,
// important business rules, or independently owned capabilities.

// ---------------------------------------------------------------------
// 61. Do not abstract every seam
// ---------------------------------------------------------------------

const calculateTotal = (subtotal: number, tax: number): number => {
  return subtotal + tax;
};

// A simple deterministic function does not automatically need an interface,
// factory, service, and dependency injection boundary.
//
// The cost of a seam should be justified by the value it provides.

// ---------------------------------------------------------------------
// 62. Preserve architectural intent in names
// ---------------------------------------------------------------------

interface ProductRepositoryPort {
  readonly findById: (id: string) => Promise<Product | null>;
}

interface ProductHttpClient {
  readonly get: (id: string) => Promise<Product>;
}

// Names can communicate architectural roles.
//
// `ProductRepositoryPort` and `ProductHttpClient` describe different boundaries,
// even if both ultimately retrieve product data.

// ---------------------------------------------------------------------
// 63. Evolve documentation with architecture
// ---------------------------------------------------------------------

interface ArchitectureDecision {
  readonly decision: string;
  readonly reason: string;
}

const catalogDecision: ArchitectureDecision = {
  decision: "Catalog depends on a repository contract",
  reason: "The external data source may change independently",
};

// Architectural documentation should explain important decisions and their reasons.
//
// Otherwise, future developers may remove a boundary without understanding
// the constraint that caused it to exist.

// ---------------------------------------------------------------------
// 64. Record significant architectural decisions
// ---------------------------------------------------------------------

interface DecisionRecord {
  readonly context: string;
  readonly decision: string;
  readonly consequence: string;
}

const decisionRecord: DecisionRecord = {
  context: "Multiple consumers require catalog data",
  decision: "Expose a repository contract",
  consequence: "Consumers are independent of the transport implementation",
};

// Decision records are especially useful for expensive or non-obvious choices.
//
// They preserve context that source code alone may not communicate.

// ---------------------------------------------------------------------
// 65. Architecture should follow ownership
// ---------------------------------------------------------------------

interface OwnershipBoundary {
  readonly capability: string;
  readonly owner: string;
}

const catalogOwnership: OwnershipBoundary = {
  capability: "Product search",
  owner: "Catalog",
};

// When ownership changes, dependencies and module boundaries may need to change with it.
//
// Architecture should reflect who is responsible for changing and maintaining behavior.

// ---------------------------------------------------------------------
// 66. Architecture should follow change frequency
// ---------------------------------------------------------------------

interface ChangeProfile {
  readonly component: string;
  readonly changeFrequency: "low" | "medium" | "high";
}

const paymentIntegrationChangeProfile: ChangeProfile = {
  component: "Payment integration",
  changeFrequency: "high",
};

// Components that change for unrelated reasons may benefit from stronger separation.
//
// Components that always change together may benefit from staying closer together.

// ---------------------------------------------------------------------
// 67. Architecture should follow dependency stability
// ---------------------------------------------------------------------

interface DependencyProfile {
  readonly dependency: string;
  readonly stability: "stable" | "changing";
}

const paymentProviderProfile: DependencyProfile = {
  dependency: "Payment provider",
  stability: "changing",
};

// Frequently changing dependencies are good candidates for isolation.
//
// Stable dependencies often require less architectural protection.

// ---------------------------------------------------------------------
// 68. Architecture should follow deployment constraints
// ---------------------------------------------------------------------

interface DeploymentRequirement {
  readonly independentDeploymentRequired: boolean;
  readonly reason: string;
}

const deploymentRequirement: DeploymentRequirement = {
  independentDeploymentRequired: false,
  reason: "Single coordinated release process",
};

// Deployment architecture should reflect actual operational requirements.
//
// Introducing independent deployment without a need can add significant overhead.

// ---------------------------------------------------------------------
// 69. Architecture should follow team boundaries
// ---------------------------------------------------------------------

interface TeamBoundary {
  readonly team: string;
  readonly capability: string;
}

const catalogTeamBoundary: TeamBoundary = {
  team: "Catalog Team",
  capability: "Catalog",
};

// Teams that own capabilities independently may benefit from clearer module,
// package, or deployment boundaries.
//
// Organizational structure is one input into architecture, not the only one.

// ---------------------------------------------------------------------
// 70. Architecture should follow domain boundaries
// ---------------------------------------------------------------------

interface DomainBoundary {
  readonly domain: string;
  readonly concepts: readonly string[];
}

const accountDomain: DomainBoundary = {
  domain: "Account",
  concepts: ["Profile", "Preferences"],
};

// Domain concepts that change together often form a useful boundary.
//
// Shared technical mechanisms should not automatically become shared domain ownership.

// ---------------------------------------------------------------------
// 71. Architecture should follow operational constraints
// ---------------------------------------------------------------------

interface OperationalConstraint {
  readonly constraint: string;
  readonly consequence: string;
}

const operationalConstraint: OperationalConstraint = {
  constraint: "External service has strict rate limits",
  consequence: "Caching and request coordination may become necessary",
};

// Operational realities can force architectural evolution even when the original
// component structure was otherwise reasonable.

// ---------------------------------------------------------------------
// 72. Architecture should evolve from constraints, not fashion
// ---------------------------------------------------------------------

interface ArchitectureProposal {
  readonly pattern: string;
  readonly actualConstraint: string;
}

const architectureProposal: ArchitectureProposal = {
  pattern: "Repository boundary",
  actualConstraint: "External data source changes independently",
};

// A pattern is a means of solving a problem.
//
// The existence of a familiar pattern is not itself evidence that the system needs it.

// ---------------------------------------------------------------------
// 73. Use incremental extraction
// ---------------------------------------------------------------------

interface ExtractedResponsibility {
  readonly responsibility: string;
  readonly originalOwner: string;
  readonly newOwner: string;
}

const extractedResponsibility: ExtractedResponsibility = {
  responsibility: "Product formatting",
  originalOwner: "ProductPage",
  newOwner: "Product presentation boundary",
};

// A large architectural refactoring can often be decomposed into small extractions:
//
// identify responsibility
// move responsibility
// preserve contract
// verify behavior
// remove obsolete code

// ---------------------------------------------------------------------
// 74. Use incremental dependency migration
// ---------------------------------------------------------------------

interface DependencyMigration {
  readonly oldDependency: string;
  readonly newDependency: string;
  readonly migratedConsumers: number;
}

const dependencyMigration: DependencyMigration = {
  oldDependency: "Concrete HTTP client",
  newDependency: "ProductRepository",
  migratedConsumers: 5,
};

// Consumers can migrate individually when the new boundary is compatible.
//
// This reduces the coordination required for a large architectural change.

// ---------------------------------------------------------------------
// 75. Preserve backwards compatibility when valuable
// ---------------------------------------------------------------------

interface CompatibilityPolicy {
  readonly compatibilityRequired: boolean;
  readonly reason: string;
}

const compatibilityPolicy: CompatibilityPolicy = {
  compatibilityRequired: true,
  reason: "Consumers are deployed independently",
};

// Independent deployments may require temporary compatibility.
//
// A coordinated application can sometimes make breaking changes more directly.

// ---------------------------------------------------------------------
// 76. Breaking changes can be appropriate
// ---------------------------------------------------------------------

interface BreakingChange {
  readonly contract: string;
  readonly migrationRequired: boolean;
}

const breakingChange: BreakingChange = {
  contract: "Obsolete feature API",
  migrationRequired: true,
};

// Compatibility is not free.
//
// If preserving an obsolete API creates more complexity than coordinated migration,
// a deliberate breaking change can sometimes be the simpler evolutionary path.

// ---------------------------------------------------------------------
// 77. Architecture evolution has a cost
// ---------------------------------------------------------------------

interface EvolutionCost {
  readonly implementation: string;
  readonly migration: string;
  readonly maintenance: string;
}

const evolutionCost: EvolutionCost = {
  implementation: "New repository boundary",
  migration: "Move existing consumers",
  maintenance: "Maintain the contract",
};

// Every architectural improvement has an implementation and maintenance cost.
//
// The expected benefit should justify those costs.

// ---------------------------------------------------------------------
// 78. Architecture evolution should reduce future change cost
// ---------------------------------------------------------------------

interface ChangeCost {
  readonly before: string;
  readonly after: string;
}

const providerChangeCost: ChangeCost = {
  before: "Update transport logic across UI modules",
  after: "Replace the repository implementation",
};

// The strongest reason for a boundary is often that it makes an important future
// change smaller, safer, or more localized.

// ---------------------------------------------------------------------
// 79. Complete example: evolving a catalog
// ---------------------------------------------------------------------

interface CatalogItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

interface CatalogDataSource {
  readonly getItems: () => Promise<readonly CatalogItem[]>;
}

interface CatalogServiceContract {
  readonly getItems: () => Promise<readonly CatalogItem[]>;
}

const createCatalogService = (dataSource: CatalogDataSource): CatalogServiceContract => {
  return {
    getItems: dataSource.getItems,
  };
};

interface CatalogViewProps {
  readonly service: CatalogServiceContract;
}

export const EvolvedCatalog: FC<CatalogViewProps> = ({ service }): ReactElement => {
  const [items, setItems] = useState<readonly CatalogItem[]>([]);

  const load = async (): Promise<void> => {
    const result = await service.getItems();
    setItems(result);
  };

  return (
    <section>
      <button onClick={() => void load()} type="button">
        Load catalog
      </button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} — ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </section>
  );
};

const catalogDataSource: CatalogDataSource = {
  getItems: async () => [
    {
      id: "product-1",
      name: "Example Product",
      price: 29.99,
    },
    {
      id: "product-2",
      name: "Example Notebook",
      price: 14.99,
    },
  ],
};

const evolvedCatalogService = createCatalogService(catalogDataSource);

export const ArchitectureEvolutionExample: FC = (): ReactElement => {
  return <EvolvedCatalog service={evolvedCatalogService} />;
};

// The architecture is intentionally modest:
//
// EvolvedCatalog
//   -> consumes a service contract
//
// CatalogServiceContract
//   -> defines application-facing behavior
//
// CatalogDataSource
//   -> isolates the external data mechanism
//
// This structure can evolve further if real requirements create additional pressure.

// ---------------------------------------------------------------------
// 80. Complete example: incremental migration
// ---------------------------------------------------------------------

interface LegacyProductSource {
  readonly load: () => Promise<readonly Product[]>;
}

interface ProductSource {
  readonly load: () => Promise<readonly Product[]>;
}

const migrateProductSource = (legacy: LegacyProductSource): ProductSource => {
  return {
    load: legacy.load,
  };
};

interface MigratedCatalogProps {
  readonly source: ProductSource;
}

export const MigratedCatalog: FC<MigratedCatalogProps> = ({ source }): ReactElement => {
  const [products, setProducts] = useState<readonly Product[]>([]);

  const load = async (): Promise<void> => {
    setProducts(await source.load());
  };

  return (
    <section>
      <button onClick={() => void load()} type="button">
        Load products
      </button>

      <ProductList products={products} />
    </section>
  );
};

const legacyProductSource: LegacyProductSource = {
  load: async () => [
    {
      id: "product-1",
      name: "Example Product",
    },
  ],
};

const migratedProductSource = migrateProductSource(legacyProductSource);

export const IncrementalMigrationExample: FC = (): ReactElement => {
  return <MigratedCatalog source={migratedProductSource} />;
};

// The migration introduces a new boundary without requiring every consumer
// to change simultaneously.
//
// Once all consumers use the new contract, the compatibility adapter can be removed.

// ---------------------------------------------------------------------
// 81. A practical evolution sequence
// ---------------------------------------------------------------------

// A common evolutionary sequence is:
//
// 1. Start with a simple implementation.
// 2. Observe repeated architectural pressure.
// 3. Identify the responsibility or dependency causing the pressure.
// 4. Introduce the smallest useful boundary.
// 5. Preserve behavior with tests and type checking.
// 6. Migrate consumers incrementally when necessary.
// 7. Measure whether the problem improved.
// 8. Remove transitional code.
// 9. Revisit the boundary as requirements change.
//
// The sequence is iterative rather than a one-time architecture phase.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Architecture evolves as requirements, ownership, dependencies, teams, and operational constraints change.
// - Start with the simplest structure that satisfies the current requirements.
// - Repeated architectural pain is stronger evidence for refactoring than theoretical future needs.
// - Architectural evolution can move responsibilities, state, dependencies, and data boundaries in either direction.
// - Extract responsibilities when the extraction creates a meaningful ownership and change boundary.
// - Introduce repositories, services, adapters, or package boundaries only when they solve actual architectural pressure.
// - Narrow public contracts reduce coupling and make future implementation changes more localized.
// - Compatibility wrappers, feature flags, and adapters can support incremental migration but should remain temporary.
// - Structural refactoring and behavioral changes are easier to reason about when they are separated.
// - Tests, type checking, telemetry, and measurements provide feedback during architectural migration.
// - Architecture can become simpler as well as more structured when unnecessary abstractions are removed.
// - Shared code should be extracted when concepts, ownership, and semantics are genuinely shared.
// - Boundaries should reflect meaningful changes in ownership, change frequency, dependency stability, domain, team structure, and deployment.
// - Micro-frontends, independent deployment, and stronger package boundaries are evolutionary choices driven by actual requirements.
// - Architectural decisions should be documented when their context would otherwise be difficult to recover.
// - Transitional architecture becomes technical debt when migration infrastructure remains after its purpose disappears.
// - A migration is complete when obsolete paths and compatibility mechanisms can be safely removed.
// - The purpose of architecture evolution is to keep important changes understandable, localized, testable, and practical as the system changes.
