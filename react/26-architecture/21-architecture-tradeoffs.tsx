/**
 * Architecture Tradeoffs
 * =======================
 *
 * Software architecture is a set of decisions about how responsibilities, dependencies, state,
 * data, and components are organized. Architectural choices always involve tradeoffs: improving
 * one property such as isolation, reuse, or flexibility can increase complexity, indirection,
 * duplication, or maintenance cost elsewhere.
 *
 * Good architecture therefore depends on context rather than on applying one structure everywhere.
 * The goal is to make important tradeoffs explicit and choose boundaries that support the current
 * requirements while remaining practical to evolve.
 */

import { useState } from "react";
import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Architecture is a set of tradeoffs
// ---------------------------------------------------------------------

// Architecture affects properties such as:
// - coupling
// - cohesion
// - reuse
// - testability
// - flexibility
// - simplicity
// - performance
// - team ownership
// - change isolation
//
// Improving one property can make another property worse.
//
// For example, more abstraction can improve replaceability,
// but excessive abstraction can make a simple feature harder to understand.

// ---------------------------------------------------------------------
// 2. Simplicity vs. abstraction
// ---------------------------------------------------------------------

// A small component can often be simpler when it contains the behavior it needs directly.

interface SimpleGreetingProps {
  readonly name: string;
}

export const SimpleGreeting: FC<SimpleGreetingProps> = ({ name }): ReactElement => {
  return <p>Hello, {name}.</p>;
};

// A generic abstraction is useful when the same behavior genuinely appears in multiple places.
//
// The abstraction itself has a maintenance cost, so reuse should justify that cost.

interface FormatterProps {
  readonly value: string;
  readonly format: (value: string) => string;
}

export const FormattedValue: FC<FormatterProps> = ({ value, format }): ReactElement => {
  return <span>{format(value)}</span>;
};

// ---------------------------------------------------------------------
// 3. Duplication vs. premature abstraction
// ---------------------------------------------------------------------

// Some duplication is acceptable when two pieces of code may evolve differently.
//
// Extracting them too early can create an abstraction whose API must satisfy
// requirements that are not actually shared.

interface ProductLabelProps {
  readonly name: string;
  readonly price: number;
}

export const ProductLabel: FC<ProductLabelProps> = ({ name, price }): ReactElement => {
  return (
    <span>
      {name} — ${price.toFixed(2)}
    </span>
  );
};

interface ServiceLabelProps {
  readonly name: string;
  readonly monthlyPrice: number;
}

export const ServiceLabel: FC<ServiceLabelProps> = ({ name, monthlyPrice }): ReactElement => {
  return (
    <span>
      {name} — ${monthlyPrice.toFixed(2)}/month
    </span>
  );
};

// The similar markup does not automatically mean these components should share one abstraction.
// Their concepts and future requirements may be different.

// ---------------------------------------------------------------------
// 4. Reuse vs. specialization
// ---------------------------------------------------------------------

// Generic components can support many consumers through flexible props.

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

// Specialized components can expose a smaller and more meaningful API.

interface AccountSummaryProps {
  readonly name: string;
  readonly email: string;
}

export const AccountSummary: FC<AccountSummaryProps> = ({ name, email }): ReactElement => {
  return (
    <Panel title="Account">
      <strong>{name}</strong>
      <span>{email}</span>
    </Panel>
  );
};

// Reuse is valuable when the abstraction represents a stable concept.
// Specialization is valuable when consumers have different responsibilities.

// ---------------------------------------------------------------------
// 5. Flexibility vs. complexity
// ---------------------------------------------------------------------

// A flexible API can support more use cases, but each option becomes part of the
// component's contract and increases the number of possible states.

interface FlexibleButtonProps {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly fullWidth?: boolean;
  readonly compact?: boolean;
  readonly onClick?: () => void;
}

export const FlexibleButton: FC<FlexibleButtonProps> = ({
  children,
  disabled = false,
  loading = false,
  fullWidth = false,
  compact = false,
  onClick,
}): ReactElement => {
  const className = [fullWidth ? "full-width" : "", compact ? "compact" : ""].filter(Boolean).join(" ");

  return (
    <button className={className} disabled={disabled || loading} onClick={onClick} type="button">
      {loading ? "Loading..." : children}
    </button>
  );
};

// Multiple independent boolean options can create many combinations.
// The tradeoff should be considered before adding every possible customization.

// ---------------------------------------------------------------------
// 6. Configuration vs. convention
// ---------------------------------------------------------------------

interface ConfigurableCardProps {
  readonly title: string;
  readonly padding?: "small" | "medium" | "large";
  readonly alignment?: "start" | "center" | "end";
  readonly children: ReactNode;
}

export const ConfigurableCard: FC<ConfigurableCardProps> = ({
  title,
  padding = "medium",
  alignment = "start",
  children,
}): ReactElement => {
  return (
    <section data-padding={padding} data-alignment={alignment}>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

// More configuration gives callers control.
// More convention gives the architecture fewer states to support.
//
// A useful API exposes decisions that consumers genuinely need to control
// and keeps incidental implementation details private.

// ---------------------------------------------------------------------
// 7. Local state vs. shared state
// ---------------------------------------------------------------------

// Local state keeps ownership close to the component that uses it.

export const LocalCounter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((current) => current + 1)} type="button">
      Count: {count}
    </button>
  );
};

// Shared state can coordinate multiple consumers, but introduces a broader dependency.
//
// The tradeoff is not "local is always better" or "global is always better".
// The appropriate scope depends on who needs to read and change the state.

// ---------------------------------------------------------------------
// 8. Prop drilling vs. shared context
// ---------------------------------------------------------------------

interface ToolbarProps {
  readonly username: string;
}

interface HeaderProps {
  readonly username: string;
}

interface PageProps {
  readonly username: string;
}

export const Toolbar: FC<ToolbarProps> = ({ username }): ReactElement => {
  return <button type="button">Signed in as {username}</button>;
};

export const Header: FC<HeaderProps> = ({ username }): ReactElement => {
  return (
    <header>
      <Toolbar username={username} />
    </header>
  );
};

export const Page: FC<PageProps> = ({ username }): ReactElement => {
  return <Header username={username} />;
};

// Passing data explicitly makes dependencies visible.
//
// Context can reduce repeated prop passing when many descendants need the same
// cross-cutting value, but it also makes the dependency less explicit at call sites.

// ---------------------------------------------------------------------
// 9. Composition vs. configuration
// ---------------------------------------------------------------------

interface LayoutProps {
  readonly header: ReactNode;
  readonly content: ReactNode;
  readonly footer?: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ header, content, footer }): ReactElement => {
  return (
    <div>
      <header>{header}</header>
      <main>{content}</main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
};

// Composition lets callers provide structure rather than requiring the layout
// to know every possible feature it might contain.
//
// This often reduces boolean configuration props and keeps responsibilities separate.

// ---------------------------------------------------------------------
// 10. Centralization vs. decentralization
// ---------------------------------------------------------------------

// Centralized logic is easier to find and can enforce consistency.

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Multiple components can use the same formatting rule without implementing
// slightly different versions of the same behavior.

// Decentralizing unrelated behavior can instead keep features independent.
//
// The tradeoff depends on whether the rule is truly shared and stable.

// ---------------------------------------------------------------------
// 11. Shared utility vs. feature-owned logic
// ---------------------------------------------------------------------

// A generic utility should represent a concept that is meaningful outside
// one specific feature.

export const capitalize = (value: string): string => {
  if (value.length === 0) {
    return value;
  }

  return value[0].toUpperCase() + value.slice(1);
};

// A feature-specific transformation can remain inside that feature when
// extracting it would create a dependency without meaningful reuse.

// ---------------------------------------------------------------------
// 12. Layering vs. direct dependencies
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
}

interface UserRepository {
  readonly findById: (id: string) => Promise<User | null>;
}

const loadUser = async (repository: UserRepository, id: string): Promise<User | null> => {
  return repository.findById(id);
};

// A layer between UI and infrastructure can isolate implementation details.
//
// The cost is additional types, modules, and indirection.
//
// For a very small feature, a direct dependency may be easier to understand.
// For a large or changing system, the isolation may justify the additional structure.

// ---------------------------------------------------------------------
// 13. Dependency injection vs. direct construction
// ---------------------------------------------------------------------

interface Clock {
  readonly now: () => Date;
}

const systemClock: Clock = {
  now: () => new Date(),
};

const createGreeting = (clock: Clock): string => {
  const hour = clock.now().getHours();

  return hour < 12 ? "Good morning." : "Good afternoon.";
};

// Dependency injection makes external behavior replaceable and testable.
//
// Direct construction is simpler when the dependency is stable and there is
// no meaningful reason for callers to replace it.

// ---------------------------------------------------------------------
// 14. Abstraction vs. indirection
// ---------------------------------------------------------------------

interface Logger {
  readonly info: (message: string) => void;
}

const logger: Logger = {
  info: (message) => {
    console.log(message);
  },
};

export const reportStatus = (message: string): void => {
  logger.info(message);
};

// An abstraction can protect consumers from a concrete implementation.
//
// But every abstraction adds another name and another place to navigate.
//
// The question is whether the boundary isolates a meaningful source of change.

// ---------------------------------------------------------------------
// 15. Testability vs. production simplicity
// ---------------------------------------------------------------------

interface UserService {
  readonly getUserName: (id: string) => Promise<string>;
}

interface UserNameProps {
  readonly userService: UserService;
  readonly userId: string;
}

export const UserName: FC<UserNameProps> = ({ userService, userId }): ReactElement => {
  const [name, setName] = useState<string | null>(null);

  const load = async (): Promise<void> => {
    const nextName = await userService.getUserName(userId);
    setName(nextName);
  };

  return (
    <div>
      <span>{name ?? "Not loaded"}</span>
      <button onClick={() => void load()} type="button">
        Load
      </button>
    </div>
  );
};

// Injecting the service allows tests to provide a deterministic implementation.
//
// The tradeoff is that the component now depends on an explicit abstraction.

// ---------------------------------------------------------------------
// 16. Performance vs. simplicity
// ---------------------------------------------------------------------

interface ExpensiveListProps {
  readonly items: readonly string[];
}

export const ExpensiveList: FC<ExpensiveListProps> = ({ items }): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

// Performance-oriented architecture may introduce memoization, caching,
// virtualization, code splitting, or more specialized state boundaries.
//
// Those mechanisms can reduce work but also increase conceptual complexity.
//
// Performance decisions should be based on an actual requirement or measured bottleneck.

// ---------------------------------------------------------------------
// 17. Optimization vs. maintainability
// ---------------------------------------------------------------------

const normalizeSearchTerm = (value: string): string => {
  return value.trim().toLowerCase();
};

export const SearchExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const normalizedQuery = normalizeSearchTerm(query);

  return (
    <label>
      Search
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <span>Normalized: {normalizedQuery}</span>
    </label>
  );
};

// A simple transformation is easy to understand.
//
// Replacing it with multiple caches, selectors, memoization layers, and
// synchronization mechanisms is only worthwhile when the additional complexity
// solves a real performance problem.

// ---------------------------------------------------------------------
// 18. Runtime validation vs. static typing
// ---------------------------------------------------------------------

interface ApiUser {
  readonly id: string;
  readonly name: string;
}

// TypeScript describes values during development, but external data can violate
// those expectations at runtime.
//
// Runtime validation creates a boundary between unknown external data and trusted
// application data.

const isApiUser = (value: unknown): value is ApiUser => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.id === "string" && typeof candidate.name === "string";
};

// Runtime validation has a cost, but the cost is often justified at trust boundaries
// such as network responses, persisted data, or external integrations.

// ---------------------------------------------------------------------
// 19. Feature isolation vs. shared infrastructure
// ---------------------------------------------------------------------

interface FeatureRepository {
  readonly save: (value: string) => Promise<void>;
}

const createFeature = (repository: FeatureRepository): FeatureRepository => {
  return repository;
};

// Shared infrastructure can prevent duplicated low-level concerns.
//
// Feature isolation can prevent unrelated features from becoming tightly coupled.
//
// The useful boundary depends on whether the dependency represents infrastructure
// or actual business ownership.

// ---------------------------------------------------------------------
// 20. Monolith vs. micro-frontends
// ---------------------------------------------------------------------

// A single application can keep:
// - navigation simple
// - shared dependencies straightforward
// - component composition direct
// - deployment centralized
//
// A micro-frontend architecture can provide:
// - stronger organizational boundaries
// - independent deployment
// - team-level ownership
// - technology isolation where necessary
//
// It can also introduce:
// - duplicated dependencies
// - integration complexity
// - runtime coordination
// - cross-application communication
//
// Micro-frontends therefore solve organizational and deployment problems as much
// as technical problems. They should not be introduced merely because the system
// contains many components.

// ---------------------------------------------------------------------
// 21. Shared runtime vs. runtime isolation
// ---------------------------------------------------------------------

// Sharing one React runtime can simplify:
// - context identity
// - hook behavior
// - component interoperability
// - dependency management
//
// Runtime isolation can provide stronger independence between separately deployed
// applications, but requires more deliberate integration boundaries.
//
// The appropriate choice depends on deployment and ownership requirements.

// ---------------------------------------------------------------------
// 22. Build-time coupling vs. runtime coupling
// ---------------------------------------------------------------------

// A package dependency creates a build-time relationship.

interface SharedFormatter {
  readonly format: (value: number) => string;
}

const sharedFormatter: SharedFormatter = {
  format: (value) => value.toFixed(2),
};

// Runtime integration can instead happen through a protocol or separately deployed
// boundary.
//
// Build-time coupling is often easier to reason about.
// Runtime coupling can support independent deployment but requires stronger contracts.

// ---------------------------------------------------------------------
// 23. Type sharing vs. implementation sharing
// ---------------------------------------------------------------------

interface ProductDto {
  readonly id: string;
  readonly title: string;
}

// Sharing a type can communicate a stable data contract without forcing consumers
// to share implementation details.
//
// Sharing implementation can reduce duplication when the behavior is genuinely common.
//
// These are separate decisions and do not need to happen together.

// ---------------------------------------------------------------------
// 24. Domain model richness vs. plain data
// ---------------------------------------------------------------------

interface Money {
  readonly amount: number;
  readonly currency: string;
}

const addMoney = (left: Money, right: Money): Money => {
  if (left.currency !== right.currency) {
    throw new Error("Currencies must match.");
  }

  return {
    amount: left.amount + right.amount,
    currency: left.currency,
  };
};

// Rich domain behavior can keep business invariants close to the concepts they protect.
//
// Plain data structures can be simpler when the domain rules are minimal.
//
// The tradeoff is between stronger encapsulation and additional modeling complexity.

// ---------------------------------------------------------------------
// 25. State machine vs. boolean state
// ---------------------------------------------------------------------

interface RequestState {
  readonly status: "idle" | "loading" | "success" | "error";
}

// A single state value can express mutually exclusive states.

const requestState: RequestState = {
  status: "loading",
};

// Multiple independent booleans can accidentally represent impossible combinations:
//
// isLoading = true
// isSuccess = true
// isError = true
//
// A state machine can make valid states explicit.
//
// The tradeoff is additional modeling overhead in exchange for stronger state invariants.

// ---------------------------------------------------------------------
// 26. Explicit state transitions
// ---------------------------------------------------------------------

type RequestAction = { readonly type: "start" } | { readonly type: "success" } | { readonly type: "error" };

const transitionRequest = (state: RequestState, action: RequestAction): RequestState => {
  switch (action.type) {
    case "start":
      return { status: "loading" };
    case "success":
      return { status: "success" };
    case "error":
      return { status: "error" };
  }
};

// Reducers and explicit transitions improve traceability when state behavior is complex.
//
// For trivial state, direct setters are often easier to read.

// ---------------------------------------------------------------------
// 27. Colocation vs. centralized organization
// ---------------------------------------------------------------------

// Colocating related UI, state, types, and feature behavior can improve cohesion.
//
// Centralizing shared infrastructure can make cross-cutting concerns easier to discover.
//
// Neither organization is universally superior.
//
// A useful rule is to colocate code according to ownership and change patterns,
// while centralizing genuinely shared infrastructure.

// ---------------------------------------------------------------------
// 28. Module boundaries vs. file boundaries
// ---------------------------------------------------------------------

// A file boundary alone does not create architectural isolation.
//
// A meaningful module boundary also controls:
// - what can be imported
// - what is publicly exported
// - which dependencies are allowed
// - which implementation details remain private

interface PublicCatalogApi {
  readonly findById: (id: string) => Promise<ProductDto | null>;
}

// The interface can be the public contract while the implementation remains private.

// ---------------------------------------------------------------------
// 29. API stability vs. implementation freedom
// ---------------------------------------------------------------------

// A narrow public API allows the implementation to change without requiring
// every consumer to change.

interface NotificationService {
  readonly notify: (message: string) => void;
}

const notificationService: NotificationService = {
  notify: (message) => {
    console.log(message);
  },
};

// Exposing only `notify` is less constraining than exposing internal queues,
// storage, transport clients, and implementation-specific data structures.

// ---------------------------------------------------------------------
// 30. Encapsulation vs. observability
// ---------------------------------------------------------------------

// Encapsulation hides implementation details.
//
// Observability requires enough information to understand runtime behavior.
//
// A system can preserve encapsulation while exposing deliberate diagnostics,
// metrics, logs, and tracing interfaces.
//
// Hiding everything can make production debugging difficult.
// Exposing everything creates unnecessary coupling.

// ---------------------------------------------------------------------
// 31. Consistency vs. local optimization
// ---------------------------------------------------------------------

// A shared architectural convention can make a large codebase easier to navigate.
//
// A local exception may be justified when a different structure clearly matches
// the problem better.
//
// The tradeoff is between predictable organization and problem-specific optimization.
//
// Conventions should guide decisions without becoming rules that ignore context.

// ---------------------------------------------------------------------
// 32. Standardization vs. autonomy
// ---------------------------------------------------------------------

interface FeatureConfiguration {
  readonly pageSize: number;
}

const defaultFeatureConfiguration: FeatureConfiguration = {
  pageSize: 20,
};

// Standardized infrastructure can reduce duplicated decisions.
//
// Independent teams may need autonomy to optimize their own feature boundaries.
//
// Strong centralization can slow teams down; excessive autonomy can create
// inconsistent conventions and duplicated infrastructure.

// ---------------------------------------------------------------------
// 33. Short-term delivery vs. long-term flexibility
// ---------------------------------------------------------------------

// A simple implementation can minimize immediate delivery cost.
//
// A more structured implementation may reduce future migration cost.
//
// Architecture should therefore consider:
// - expected change
// - expected lifespan
// - number of consumers
// - team ownership
// - operational constraints
// - cost of being wrong
//
// Not every possible future needs to be designed for.

// ---------------------------------------------------------------------
// 34. Reversibility of architectural decisions
// ---------------------------------------------------------------------

// Some decisions are cheap to change later.

const localConstant = "example";

// Other decisions can affect many modules, packages, teams, or deployments.
//
// Expensive-to-reverse decisions deserve more analysis than easily reversible ones.
//
// This helps avoid spending equal effort on decisions with very different consequences.

// ---------------------------------------------------------------------
// 35. Architecture as an optimization problem
// ---------------------------------------------------------------------

interface ArchitectureContext {
  readonly teamCount: number;
  readonly deploymentCount: number;
  readonly featureCount: number;
  readonly expectedChangeRate: "low" | "medium" | "high";
}

const architectureContext: ArchitectureContext = {
  teamCount: 2,
  deploymentCount: 1,
  featureCount: 8,
  expectedChangeRate: "medium",
};

// Architectural decisions should be evaluated against the actual constraints:
//
// team structure
// deployment model
// product requirements
// performance requirements
// security requirements
// operational capabilities
// expected change
//
// The same architecture can be appropriate in one context and inappropriate in another.

// ---------------------------------------------------------------------
// 36. Architecture should optimize for change
// ---------------------------------------------------------------------

// A useful architectural boundary separates things that are likely to change
// independently.
//
// For example, a payment provider integration can be isolated so that changing
// the provider does not require rewriting UI components.

interface PaymentProvider {
  readonly charge: (amount: number) => Promise<void>;
}

const checkout = async (provider: PaymentProvider, amount: number): Promise<void> => {
  await provider.charge(amount);
};

// The abstraction is justified because the external provider is a potential
// source of change and should not define the rest of the application.

// ---------------------------------------------------------------------
// 37. Architecture should optimize for ownership
// ---------------------------------------------------------------------

interface AccountFeature {
  readonly render: () => ReactElement;
}

const accountFeature: AccountFeature = {
  render: () => <section>Account</section>,
};

// A boundary can make ownership clearer:
//
// Account feature
//   -> owns account-specific behavior
//
// Shared UI
//   -> owns reusable visual primitives
//
// Infrastructure
//   -> owns external integrations
//
// Ownership reduces ambiguity about where changes belong.

// ---------------------------------------------------------------------
// 38. Architecture should optimize for failure isolation
// ---------------------------------------------------------------------

interface SearchResult {
  readonly items: readonly string[];
}

const emptySearchResult: SearchResult = {
  items: [],
};

// A boundary can prevent an external failure from spreading through the entire
// component tree by translating infrastructure failures into application-level states.
//
// Failure isolation is particularly valuable around networks, storage,
// third-party services, and asynchronous operations.

// ---------------------------------------------------------------------
// 39. Architecture should optimize for understandable dependencies
// ---------------------------------------------------------------------

interface CatalogService {
  readonly search: (query: string) => Promise<readonly ProductDto[]>;
}

interface CatalogViewProps {
  readonly service: CatalogService;
}

export const CatalogView: FC<CatalogViewProps> = ({ service }): ReactElement => {
  return (
    <button onClick={() => void service.search("example")} type="button">
      Search catalog
    </button>
  );
};

// The dependency is explicit:
//
// CatalogView -> CatalogService
//
// Explicit dependencies are easier to inspect, test, and replace than hidden
// dependencies through globals or implicit module state.

// ---------------------------------------------------------------------
// 40. Architecture should avoid accidental complexity
// ---------------------------------------------------------------------

// Accidental complexity is complexity caused by the chosen solution rather than
// by the problem itself.
//
// Examples include:
// - unnecessary abstraction layers
// - excessive configuration
// - duplicated state synchronization
// - overly generic APIs
// - unnecessary package boundaries
// - infrastructure introduced before it is needed
//
// Architecture should solve real constraints rather than create theoretical ones.

// ---------------------------------------------------------------------
// 41. Architecture should preserve local reasoning
// ---------------------------------------------------------------------

interface StatusMessageProps {
  readonly status: "success" | "error";
  readonly message: string;
}

export const StatusMessage: FC<StatusMessageProps> = ({ status, message }): ReactElement => {
  return <p data-status={status}>{message}</p>;
};

// A component with a small explicit contract can often be understood locally.
//
// If understanding a small component requires tracing many providers,
// registries, factories, global stores, and indirection layers,
// the architecture may be increasing cognitive load unnecessarily.

// ---------------------------------------------------------------------
// 42. Architecture should preserve replaceability where it matters
// ---------------------------------------------------------------------

interface Storage {
  readonly get: (key: string) => string | null;
  readonly set: (key: string, value: string) => void;
}

const savePreference = (storage: Storage, key: string, value: string): void => {
  storage.set(key, value);
};

// Replaceability is most valuable at boundaries where implementation changes
// are plausible or where deterministic testing is important.
//
// It is less useful to create interfaces for every trivial local function.

// ---------------------------------------------------------------------
// 43. Architecture should preserve cohesion
// ---------------------------------------------------------------------

interface Invoice {
  readonly subtotal: number;
  readonly tax: number;
}

const calculateInvoiceTotal = (invoice: Invoice): number => {
  return invoice.subtotal + invoice.tax;
};

// Related behavior should stay close to the data or concept it serves when that
// improves understanding and protects the concept's invariants.
//
// Splitting every function into separate modules can reduce cohesion rather than improve it.

// ---------------------------------------------------------------------
// 44. Architecture should minimize unnecessary coupling
// ---------------------------------------------------------------------

interface ProductFilter {
  readonly category?: string;
  readonly query?: string;
}

const applyProductFilter = (products: readonly ProductDto[], filter: ProductFilter): readonly ProductDto[] => {
  return products.filter((product) => {
    const matchesQuery = filter.query === undefined || product.title.toLowerCase().includes(filter.query.toLowerCase());

    return matchesQuery;
  });
};

// A narrow data contract keeps filtering independent from UI-specific concerns.
//
// The function does not need to know about React, routing, or browser state.

// ---------------------------------------------------------------------
// 45. Architecture should distinguish policy from mechanism
// ---------------------------------------------------------------------

interface RetryPolicy {
  readonly maxAttempts: number;
}

const retryPolicy: RetryPolicy = {
  maxAttempts: 3,
};

// Policy answers what the system should do.
//
// Mechanism answers how the system performs it.
//
// Keeping these concerns separate can allow infrastructure mechanisms to change
// without rewriting business policy.

// ---------------------------------------------------------------------
// 46. Architecture should distinguish domain from infrastructure
// ---------------------------------------------------------------------

interface Order {
  readonly total: number;
}

const canPlaceOrder = (order: Order): boolean => {
  return order.total > 0;
};

// This rule does not need to know whether the order came from:
//
// HTTP
// database
// local storage
// React state
//
// Keeping domain decisions independent from infrastructure makes them easier to
// test and reuse.

// ---------------------------------------------------------------------
// 47. Architecture should distinguish UI from business rules
// ---------------------------------------------------------------------

interface CheckoutProps {
  readonly order: Order;
}

export const Checkout: FC<CheckoutProps> = ({ order }): ReactElement => {
  const allowed = canPlaceOrder(order);

  return (
    <button disabled={!allowed} type="button">
      Place order
    </button>
  );
};

// The component presents the business decision.
//
// The business rule itself does not depend on the component.

// ---------------------------------------------------------------------
// 48. Architecture should distinguish data ownership from data usage
// ---------------------------------------------------------------------

interface CartItem {
  readonly productId: string;
  readonly quantity: number;
}

interface CartProps {
  readonly items: readonly CartItem[];
}

export const Cart: FC<CartProps> = ({ items }): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.productId}>
          {item.productId}: {item.quantity}
        </li>
      ))}
    </ul>
  );
};

// A component can consume data without owning its lifecycle.
//
// Confusing usage with ownership often leads to duplicated state and unclear
// update responsibilities.

// ---------------------------------------------------------------------
// 49. Architecture should distinguish source of truth from derived data
// ---------------------------------------------------------------------

interface PriceSummaryProps {
  readonly prices: readonly number[];
}

export const PriceSummary: FC<PriceSummaryProps> = ({ prices }): ReactElement => {
  const total = prices.reduce((sum, price) => sum + price, 0);

  return <output>Total: ${total.toFixed(2)}</output>;
};

// `prices` is the source data.
// `total` is derived from that source.
//
// Storing both independently would introduce synchronization cost.

// ---------------------------------------------------------------------
// 50. Architecture should distinguish read models from write models
// ---------------------------------------------------------------------

interface ProductReadModel {
  readonly id: string;
  readonly displayName: string;
  readonly formattedPrice: string;
}

interface ProductCommand {
  readonly productId: string;
  readonly quantity: number;
}

// A read model can be optimized for presentation.
//
// A command can represent an operation rather than a complete domain object.
//
// They do not need to have identical shapes.

// ---------------------------------------------------------------------
// 51. Architecture should distinguish synchronous from asynchronous boundaries
// ---------------------------------------------------------------------

interface AsyncCatalog {
  readonly find: (query: string) => Promise<readonly ProductDto[]>;
}

const findProducts = async (catalog: AsyncCatalog, query: string): Promise<readonly ProductDto[]> => {
  return catalog.find(query);
};

// Asynchronous boundaries introduce states such as loading, success, and failure.
//
// Treating asynchronous work as if it were always synchronous often produces
// unclear ownership and error handling.

// ---------------------------------------------------------------------
// 52. Architecture should distinguish technical and organizational boundaries
// ---------------------------------------------------------------------

interface FeatureOwnership {
  readonly team: string;
  readonly feature: string;
}

const accountOwnership: FeatureOwnership = {
  team: "Account Team",
  feature: "Account",
};

// A technically clean module boundary can also provide an ownership boundary.
//
// Conversely, an organizational boundary does not automatically justify a
// technically independent application.

// ---------------------------------------------------------------------
// 53. Architecture should distinguish scale dimensions
// ---------------------------------------------------------------------

interface ScaleProfile {
  readonly users: number;
  readonly developers: number;
  readonly deployments: number;
  readonly integrations: number;
}

const scaleProfile: ScaleProfile = {
  users: 1000,
  developers: 4,
  deployments: 1,
  integrations: 2,
};

// "Scale" can mean different things:
//
// user scale
// team scale
// deployment scale
// data scale
// integration scale
//
// Architecture should respond to the dimension that actually creates pressure.

// ---------------------------------------------------------------------
// 54. Architecture should use the cheapest sufficient boundary
// ---------------------------------------------------------------------

interface SearchBoundary {
  readonly search: (query: string) => readonly ProductDto[];
}

const localSearchBoundary: SearchBoundary = {
  search: (query) => {
    return [
      {
        id: "product-1",
        title: query,
      },
    ];
  },
};

// A function boundary may be enough.
//
// A component boundary may be enough.
//
// A module boundary may be enough.
//
// A package boundary may be enough.
//
// A separately deployed service may be necessary only when the problem requires it.
//
// Stronger boundaries generally cost more to maintain.

// ---------------------------------------------------------------------
// 55. Architecture evolves with evidence
// ---------------------------------------------------------------------

interface ArchitectureSignal {
  readonly problem: string;
  readonly repeated: boolean;
  readonly cost: "low" | "medium" | "high";
}

const signal: ArchitectureSignal = {
  problem: "Repeated integration logic",
  repeated: true,
  cost: "medium",
};

// Repeated pain is evidence that a boundary or abstraction may be useful.
//
// Architecture can evolve incrementally:
//
// 1. Observe a recurring problem.
// 2. Identify the actual source of coupling or complexity.
// 3. Introduce the smallest useful boundary.
// 4. Measure whether the change improves the system.
// 5. Keep or revise the boundary based on evidence.

// ---------------------------------------------------------------------
// 56. Example: choosing a component boundary
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly name: string;
  readonly email: string;
}

export const UserCard: FC<UserCardProps> = ({ name, email }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>{email}</p>
    </article>
  );
};

interface UserListProps {
  readonly users: readonly UserCardProps[];
}

export const UserList: FC<UserListProps> = ({ users }): ReactElement => {
  return (
    <section>
      {users.map((user) => (
        <UserCard email={user.email} key={user.email} name={user.name} />
      ))}
    </section>
  );
};

// The boundary is useful because `UserCard` has a clear visual responsibility
// and can be reused without knowing how the list obtains its data.

// ---------------------------------------------------------------------
// 57. Example: choosing not to create an abstraction
// ---------------------------------------------------------------------

interface EmptyStateProps {
  readonly message: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ message }): ReactElement => {
  return <p>{message}</p>;
};

export const EmptySearchResult: FC = (): ReactElement => {
  return <EmptyState message="No results found." />;
};

export const EmptyNotifications: FC = (): ReactElement => {
  return <EmptyState message="No notifications." />;
};

// The shared `EmptyState` abstraction is small because the concepts are genuinely
// shared. It does not attempt to encode every possible empty-state behavior.

// ---------------------------------------------------------------------
// 58. Example: choosing a feature-specific component
// ---------------------------------------------------------------------

interface CheckoutSummaryProps {
  readonly subtotal: number;
  readonly tax: number;
}

export const CheckoutSummary: FC<CheckoutSummaryProps> = ({ subtotal, tax }): ReactElement => {
  const total = subtotal + tax;

  return (
    <section>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>Tax: ${tax.toFixed(2)}</p>
      <strong>Total: ${total.toFixed(2)}</strong>
    </section>
  );
};

// This component is intentionally specific to checkout terminology and behavior.
//
// Making it a generic "FinancialSummary" component would only be beneficial
// if multiple domains actually share the same concept and contract.

// ---------------------------------------------------------------------
// 59. Example: choosing an application boundary
// ---------------------------------------------------------------------

interface CheckoutService {
  readonly submit: (order: Order) => Promise<void>;
}

interface CheckoutPageProps {
  readonly service: CheckoutService;
  readonly order: Order;
}

export const CheckoutPage: FC<CheckoutPageProps> = ({ service, order }): ReactElement => {
  const submit = async (): Promise<void> => {
    await service.submit(order);
  };

  return (
    <section>
      <CheckoutSummary subtotal={order.total} tax={0} />
      <button onClick={() => void submit()} type="button">
        Submit order
      </button>
    </section>
  );
};

// The page coordinates the workflow while the service owns the application operation.
//
// This creates a useful boundary without requiring every piece of the application
// to have its own abstraction.

// ---------------------------------------------------------------------
// 60. Example: choosing an infrastructure boundary
// ---------------------------------------------------------------------

interface ProductClient {
  readonly get: (id: string) => Promise<ProductDto | null>;
}

interface ProductRepository {
  readonly findById: (id: string) => Promise<ProductDto | null>;
}

const createProductRepository = (client: ProductClient): ProductRepository => {
  return {
    findById: (id) => client.get(id),
  };
};

// The repository boundary prevents the rest of the application from depending
// directly on the transport client's API shape.
//
// If there is no meaningful infrastructure variation or isolation requirement,
// the additional boundary may not be necessary.

// ---------------------------------------------------------------------
// 61. Example: architecture decision matrix
// ---------------------------------------------------------------------

interface ArchitectureDecision {
  readonly option: string;
  readonly benefit: string;
  readonly cost: string;
  readonly appropriateWhen: string;
}

const componentBoundaryDecision: ArchitectureDecision = {
  option: "Extract a component",
  benefit: "Separates a cohesive UI responsibility",
  cost: "Adds another component API",
  appropriateWhen: "The responsibility has a meaningful boundary",
};

// A decision matrix does not identify one universally correct architecture.
// It makes the relevant tradeoffs explicit.

// ---------------------------------------------------------------------
// 62. Example: evaluating a proposed abstraction
// ---------------------------------------------------------------------

interface AbstractionEvaluation {
  readonly sharedConcept: boolean;
  readonly stableContract: boolean;
  readonly meaningfulIsolation: boolean;
  readonly addedComplexity: "low" | "medium" | "high";
}

const evaluateAbstraction = (evaluation: AbstractionEvaluation): boolean => {
  return (
    evaluation.sharedConcept &&
    evaluation.stableContract &&
    evaluation.meaningfulIsolation &&
    evaluation.addedComplexity !== "high"
  );
};

const abstractionEvaluation: AbstractionEvaluation = {
  sharedConcept: true,
  stableContract: true,
  meaningfulIsolation: true,
  addedComplexity: "low",
};

const abstractionIsJustified = evaluateAbstraction(abstractionEvaluation);

// The example illustrates a decision process rather than a universal formula.
// Architectural judgment still depends on context.

// ---------------------------------------------------------------------
// 63. Example: architecture review questions
// ---------------------------------------------------------------------

interface ArchitectureReview {
  readonly responsibility: string;
  readonly owner: string;
  readonly dependencies: readonly string[];
  readonly likelyChanges: readonly string[];
}

const review: ArchitectureReview = {
  responsibility: "Catalog search",
  owner: "Catalog feature",
  dependencies: ["CatalogService"],
  likelyChanges: ["Search provider", "Search presentation"],
};

// Useful review questions include:
//
// - Who owns this behavior?
// - What does this code depend on?
// - What depends on this code?
// - Which changes should remain isolated?
// - Is this abstraction solving an observed problem?
// - Does the boundary improve cohesion?
// - Does it reduce meaningful coupling?
// - Is the API smaller than the implementation?
// - Can the decision be reversed cheaply?
// - Is the added complexity justified?

// ---------------------------------------------------------------------
// 64. Complete example: balanced architecture
// ---------------------------------------------------------------------

interface CatalogProduct {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

interface CatalogRepository {
  readonly search: (query: string) => Promise<readonly CatalogProduct[]>;
}

interface CatalogViewModel {
  readonly id: string;
  readonly label: string;
}

const toCatalogViewModel = (product: CatalogProduct): CatalogViewModel => {
  return {
    id: product.id,
    label: `${product.name} — $${product.price.toFixed(2)}`,
  };
};

const createCatalogRepository = (products: readonly CatalogProduct[]): CatalogRepository => {
  return {
    search: async (query) => {
      const normalizedQuery = query.trim().toLowerCase();

      return products.filter((product) => product.name.toLowerCase().includes(normalizedQuery));
    },
  };
};

interface CatalogProps {
  readonly repository: CatalogRepository;
}

export const Catalog: FC<CatalogProps> = ({ repository }): ReactElement => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<readonly CatalogProduct[]>([]);

  const search = async (): Promise<void> => {
    const result = await repository.search(query);
    setProducts(result);
  };

  return (
    <section>
      <label>
        Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>

      <button onClick={() => void search()} type="button">
        Search
      </button>

      <ul>
        {products.map(toCatalogViewModel).map((product) => (
          <li key={product.id}>{product.label}</li>
        ))}
      </ul>
    </section>
  );
};

const catalogRepository = createCatalogRepository([
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
]);

export const ArchitectureTradeoffsExample: FC = (): ReactElement => {
  return <Catalog repository={catalogRepository} />;
};

// This example deliberately uses only a few boundaries:
//
// Catalog
//   -> owns UI state and interaction
//
// CatalogRepository
//   -> owns product retrieval
//
// CatalogProduct
//   -> represents application data
//
// CatalogViewModel
//   -> owns presentation transformation
//
// Additional layers could be introduced later if actual requirements justify them.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Architecture is a collection of tradeoffs rather than a collection of universally correct patterns.
// - More abstraction can improve isolation and replaceability while increasing indirection and complexity.
// - Some duplication is preferable when similar code represents concepts that may evolve independently.
// - Reuse is valuable when an abstraction represents a stable shared concept and contract.
// - Local state is usually simpler, while shared state is useful when multiple consumers genuinely coordinate around it.
// - Explicit props make dependencies visible; context can reduce repeated wiring but makes some dependencies less explicit.
// - Composition can provide flexibility without creating large configuration-heavy component APIs.
// - Dependency injection improves replaceability and testability, but adds an explicit dependency boundary.
// - Performance mechanisms such as memoization, caching, and virtualization should solve measured or concrete performance requirements.
// - Runtime validation protects application code at boundaries where external data cannot be trusted by TypeScript alone.
// - Stronger boundaries cost more, so the boundary should be no stronger than the problem requires.
// - Architecture should optimize for meaningful change, ownership, failure isolation, cohesion, and understandable dependencies.
// - The appropriate architecture depends on product requirements, team structure, deployment model, scale, and expected change.
// - Architectural decisions should evolve from observed constraints rather than from applying patterns for their own sake.
// - Good architecture makes important tradeoffs explicit while keeping the resulting system understandable and practical to change.
