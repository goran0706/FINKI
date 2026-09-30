/**
 * Shared React Runtime
 * ====================
 *
 * A shared React runtime means independently loaded frontend modules use a compatible React
 * runtime rather than bundling unrelated copies of React. This matters when federated modules
 * exchange React components, hooks, context, or other React runtime objects across boundaries.
 *
 * Sharing React can reduce duplicate runtime code and preserve React-specific interoperability,
 * but it also introduces a compatibility requirement between the applications that share it.
 */

import { createContext, useContext, useMemo, useState, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. What a shared React runtime means
// ---------------------------------------------------------------------

// A shared React runtime means multiple independently built applications
// resolve React to a compatible runtime instance.
//
// In a federated architecture, this commonly means the host and remotes
// coordinate how `react` and `react-dom` are provided and consumed.

export interface ReactRuntimeStrategy {
  readonly packageName: string;
  readonly strategy: "shared" | "isolated";
}

export const reactRuntimeStrategy: ReactRuntimeStrategy = {
  packageName: "react",
  strategy: "shared",
};

// ---------------------------------------------------------------------
// 2. Why runtime identity matters
// ---------------------------------------------------------------------

// React is not only a collection of functions.
//
// Runtime identity can matter for:
// - hooks
// - context
// - React elements
// - internal renderer coordination
// - library interoperability

export interface RuntimeIdentity {
  readonly packageName: string;
  readonly copies: number;
  readonly compatible: boolean;
}

export const sharedReactIdentity: RuntimeIdentity = {
  packageName: "react",
  copies: 1,
  compatible: true,
};

// ---------------------------------------------------------------------
// 3. Shared React vs duplicated React
// ---------------------------------------------------------------------

export interface ReactRuntimeComparison {
  readonly strategy: string;
  readonly runtimeCopies: number;
  readonly consequence: string;
}

export const sharedRuntimeComparison: ReactRuntimeComparison = {
  strategy: "Shared React runtime",
  runtimeCopies: 1,
  consequence: "React-specific integration can use the same runtime identity",
};

export const isolatedRuntimeComparison: ReactRuntimeComparison = {
  strategy: "Independent React runtimes",
  runtimeCopies: 2,
  consequence: "Each application owns its own React runtime",
};

// Neither strategy is universally appropriate.
//
// The correct choice depends on the integration boundary.

// ---------------------------------------------------------------------
// 4. ReactDOM is a separate dependency
// ---------------------------------------------------------------------

export const reactDomRuntimeStrategy: ReactRuntimeStrategy = {
  packageName: "react-dom",
  strategy: "shared",
};

// `react` and `react-dom` serve different purposes.
//
// React provides the component/runtime model, while ReactDOM provides
// browser rendering and DOM-specific integration.

// ---------------------------------------------------------------------
// 5. Shared runtime in a federated application
// ---------------------------------------------------------------------

export interface FederatedRuntime {
  readonly host: string;
  readonly remotes: readonly string[];
  readonly sharedPackages: readonly string[];
}

export const applicationRuntime: FederatedRuntime = {
  host: "Application Shell",
  remotes: ["Catalog", "Account", "Checkout"],
  sharedPackages: ["react", "react-dom"],
};

// The host and remotes can agree to share compatible runtime dependencies.

// ---------------------------------------------------------------------
// 6. Sharing is a compatibility contract
// ---------------------------------------------------------------------

export interface DependencyCompatibility {
  readonly packageName: string;
  readonly hostRequirement: string;
  readonly remoteRequirement: string;
}

export const reactCompatibility: DependencyCompatibility = {
  packageName: "react",
  hostRequirement: "^19.0.0",
  remoteRequirement: "^19.0.0",
};

// A shared dependency requires an explicit compatibility strategy.
//
// Version ranges should be chosen and tested deliberately.

// ---------------------------------------------------------------------
// 7. Singleton strategy
// ---------------------------------------------------------------------

export interface SharedDependency {
  readonly packageName: string;
  readonly singleton: boolean;
}

export const reactSharedDependency: SharedDependency = {
  packageName: "react",
  singleton: true,
};

export const reactDomSharedDependency: SharedDependency = {
  packageName: "react-dom",
  singleton: true,
};

// A singleton configuration expresses that the application expects
// one shared runtime instance rather than unrelated copies.
//
// Exact configuration depends on the federation implementation.

// ---------------------------------------------------------------------
// 8. Singleton does not mean "any version"
// ---------------------------------------------------------------------

export interface SingletonCompatibility {
  readonly packageName: string;
  readonly singleton: boolean;
  readonly versionPolicy: string;
}

export const reactSingletonPolicy: SingletonCompatibility = {
  packageName: "react",
  singleton: true,
  versionPolicy: "Compatible versions required",
};

// A singleton arrangement still needs version compatibility.
//
// "One instance" does not make incompatible releases compatible.

// ---------------------------------------------------------------------
// 9. Version negotiation
// ---------------------------------------------------------------------

export interface VersionPolicy {
  readonly packageName: string;
  readonly policy: string;
}

export const reactVersionPolicy: VersionPolicy = {
  packageName: "react",
  policy: "Accept only versions satisfying the application's compatibility requirements",
};

// The exact negotiation behavior depends on the Module Federation runtime
// and its configuration.

// ---------------------------------------------------------------------
// 10. Why duplicate React can be problematic
// ---------------------------------------------------------------------

export interface DuplicateRuntimeRisk {
  readonly risk: string;
  readonly explanation: string;
}

export const duplicateReactRisks: readonly DuplicateRuntimeRisk[] = [
  {
    risk: "Context identity",
    explanation:
      "Providers and consumers can fail to share the same context object when they are not using the same React context instance.",
  },
  {
    risk: "Runtime interoperability",
    explanation: "React-specific objects and behavior may not integrate as intended across independent runtime copies.",
  },
  {
    risk: "Bundle duplication",
    explanation: "Each runtime adds code and associated initialization work.",
  },
];

// The exact consequences depend on how the applications are composed.
// Duplicate runtimes are not automatically equivalent to a broken application,
// but they can prevent assumptions required by shared React composition.

// ---------------------------------------------------------------------
// 11. Context identity
// ---------------------------------------------------------------------

export interface UserContextValue {
  readonly displayName: string;
}

export const UserContext = createContext<UserContextValue | null>(null);

// Context consumers need the context object created by the corresponding
// provider.
//
// Sharing the React runtime alone does not make two separately created
// context objects identical.

// ---------------------------------------------------------------------
// 12. Context provider
// ---------------------------------------------------------------------

export const UserProvider: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  const value = useMemo<UserContextValue>(
    () => ({
      displayName: "John Doe",
    }),
    [],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// The provider owns the context value and exposes it through the context contract.

// ---------------------------------------------------------------------
// 13. Context consumer
// ---------------------------------------------------------------------

export const UserDisplay: FC = (): ReactElement => {
  const user = useContext(UserContext);

  return <p>{user?.displayName ?? "Guest"}</p>;
};

// A provider and consumer must use the same context object:
//
// UserContext.Provider
// UserContext
//
// Sharing React does not replace this requirement.

// ---------------------------------------------------------------------
// 14. Context across a federated boundary
// ---------------------------------------------------------------------

export interface ContextIntegrationRequirement {
  readonly requirement: string;
  readonly reason: string;
}

export const contextIntegrationRequirements: readonly ContextIntegrationRequirement[] = [
  {
    requirement: "Shared compatible React runtime",
    reason: "React-specific runtime integration must be compatible",
  },
  {
    requirement: "Same context object",
    reason: "Context identity is tied to the context object itself",
  },
  {
    requirement: "Compatible provider composition",
    reason: "The provider must actually be present in the rendered tree",
  },
];

// A federated remote can consume a host-provided context when the runtime
// and module composition are intentionally designed to support that contract.

// ---------------------------------------------------------------------
// 15. Shared context is stronger coupling
// ---------------------------------------------------------------------

export interface ContextCoupling {
  readonly context: string;
  readonly coupling: "explicit" | "implicit";
}

export const authenticationContextCoupling: ContextCoupling = {
  context: "AuthenticationContext",
  coupling: "explicit",
};

// The existence of a context contract is explicit, but its runtime identity
// and provider placement create stronger coupling than plain serialized data.

// ---------------------------------------------------------------------
// 16. Passing data instead of context
// ---------------------------------------------------------------------

export interface UserDisplayProps {
  readonly displayName: string;
}

export const UserDisplayByProps: FC<UserDisplayProps> = ({ displayName }): ReactElement => {
  return <p>{displayName}</p>;
};

// Passing a narrow value through props can reduce runtime coupling
// when a full shared context is unnecessary.

// ---------------------------------------------------------------------
// 17. Shared runtime and hooks
// ---------------------------------------------------------------------

export interface CounterProps {
  readonly initialValue?: number;
}

export const Counter: FC<CounterProps> = ({ initialValue = 0 }): ReactElement => {
  const [count, setCount] = useState(initialValue);

  return (
    <button onClick={() => setCount((current) => current + 1)} type="button">
      Count: {count}
    </button>
  );
};

// Hooks execute against the React runtime associated with the rendered tree.
//
// A compatible shared runtime is therefore important when React components
// are composed directly across federated boundaries.

// ---------------------------------------------------------------------
// 18. React elements
// ---------------------------------------------------------------------

export interface ElementContract {
  readonly element: ReactElement;
}

export const exampleElementContract: ElementContract = {
  element: <p>Example content</p>,
};

// React elements are runtime-level values, not ordinary serialized data.
//
// Passing them across a compatible React composition boundary is different
// from passing JSON between unrelated applications.

// ---------------------------------------------------------------------
// 19. ReactNode as a composition boundary
// ---------------------------------------------------------------------

export interface ContentBoundaryProps {
  readonly children: ReactNode;
}

export const ContentBoundary: FC<ContentBoundaryProps> = ({ children }): ReactElement => {
  return <section>{children}</section>;
};

// `children` is a useful composition contract when host and remote share
// a compatible React rendering environment.

// ---------------------------------------------------------------------
// 20. Shared runtime and component libraries
// ---------------------------------------------------------------------

export interface ComponentLibraryDependency {
  readonly library: string;
  readonly reactDependency: string;
}

export const componentLibraryDependency: ComponentLibraryDependency = {
  library: "@example/ui",
  reactDependency: "Peer dependency",
};

// Shared React component libraries commonly declare React as a peer dependency
// so the consuming application supplies the runtime.

// ---------------------------------------------------------------------
// 21. Why peer dependencies matter
// ---------------------------------------------------------------------

export interface DependencyRole {
  readonly packageName: string;
  readonly role: "dependency" | "peerDependency";
}

export const reactDependencyRole: DependencyRole = {
  packageName: "react",
  role: "peerDependency",
};

// A peer dependency expresses that the library expects the application
// to provide a compatible React runtime.

// ---------------------------------------------------------------------
// 22. Avoid bundling React into a shared component library
// ---------------------------------------------------------------------

export interface LibraryRuntimePolicy {
  readonly packageName: string;
  readonly policy: string;
}

export const sharedUiRuntimePolicy: LibraryRuntimePolicy = {
  packageName: "react",
  policy: "Resolve from the consuming application",
};

// This helps prevent a component library from silently introducing
// another independent React runtime.

// ---------------------------------------------------------------------
// 23. Shared hooks
// ---------------------------------------------------------------------

export interface UseDisclosureResult {
  readonly open: boolean;
  readonly openDialog: () => void;
  readonly closeDialog: () => void;
}

export const useDisclosure = (initialOpen = false): UseDisclosureResult => {
  const [open, setOpen] = useState(initialOpen);

  return {
    open,
    openDialog: () => setOpen(true),
    closeDialog: () => setOpen(false),
  };
};

// A shared hook depends directly on React's hook runtime.
//
// It therefore has a stronger runtime relationship than a framework-neutral utility.

// ---------------------------------------------------------------------
// 24. Shared utility vs shared React hook
// ---------------------------------------------------------------------

export interface SharedModuleComparison {
  readonly module: string;
  readonly runtimeDependency: string;
}

export const sharedUtilityComparison: SharedModuleComparison = {
  module: "formatCurrency",
  runtimeDependency: "None",
};

export const sharedHookComparison: SharedModuleComparison = {
  module: "useDisclosure",
  runtimeDependency: "React",
};

// Framework-neutral utilities generally have fewer runtime assumptions
// than React-specific hooks.

// ---------------------------------------------------------------------
// 25. React version alignment
// ---------------------------------------------------------------------

export interface ReactVersionAlignment {
  readonly host: string;
  readonly catalog: string;
  readonly account: string;
}

export const applicationReactVersions: ReactVersionAlignment = {
  host: "19.x",
  catalog: "19.x",
  account: "19.x",
};

// Matching major versions reduce compatibility risk, but version compatibility
// should still be evaluated according to the actual runtime and federation setup.

// ---------------------------------------------------------------------
// 26. Version drift
// ---------------------------------------------------------------------

export interface VersionDrift {
  readonly packageName: string;
  readonly versions: readonly string[];
}

export const reactVersionDrift: VersionDrift = {
  packageName: "react",
  versions: ["19.x", "19.x", "18.x"],
};

// Version drift does not automatically mean failure, but it requires an explicit
// strategy for whether and how the runtimes can coexist.

// ---------------------------------------------------------------------
// 27. Sharing strategy choices
// ---------------------------------------------------------------------

export interface RuntimeSharingChoice {
  readonly choice: string;
  readonly consequence: string;
}

export const runtimeSharingChoices: readonly RuntimeSharingChoice[] = [
  {
    choice: "Share compatible React runtime",
    consequence: "Better React interoperability and less duplication",
  },
  {
    choice: "Isolate React runtimes",
    consequence: "More runtime independence and potentially more duplication",
  },
];

// The architecture should choose deliberately based on the boundary requirements.

// ---------------------------------------------------------------------
// 28. Shared runtime and framework-neutral remotes
// ---------------------------------------------------------------------

export interface FrameworkNeutralBoundary {
  readonly mechanism: string;
  readonly ReactRuntimeRequired: boolean;
}

export const customElementBoundary: FrameworkNeutralBoundary = {
  mechanism: "Custom element",
  ReactRuntimeRequired: false,
};

// A custom-element boundary does not require the consumer and producer
// to share React simply because the producer happens to use React internally.

// ---------------------------------------------------------------------
// 29. React-specific federation boundary
// ---------------------------------------------------------------------

export const reactComponentBoundary: FrameworkNeutralBoundary = {
  mechanism: "Federated React component",
  ReactRuntimeRequired: true,
};

// A React component exposed for direct React composition creates a stronger
// runtime requirement than a browser-native integration boundary.

// ---------------------------------------------------------------------
// 30. Shared runtime and custom elements
// ---------------------------------------------------------------------

export interface CustomElementIntegration {
  readonly producer: string;
  readonly consumer: string;
  readonly sharedReactRequired: boolean;
}

export const catalogCustomElementIntegration: CustomElementIntegration = {
  producer: "Catalog",
  consumer: "Application Shell",
  sharedReactRequired: false,
};

// Framework-neutral boundaries can reduce runtime coupling when
// technology independence is an architectural requirement.

// ---------------------------------------------------------------------
// 31. Shared runtime and iframes
// ---------------------------------------------------------------------

export interface IframeIntegration {
  readonly producer: string;
  readonly consumer: string;
  readonly sharedReactRequired: boolean;
}

export const accountIframeIntegration: IframeIntegration = {
  producer: "Account",
  consumer: "Application Shell",
  sharedReactRequired: false,
};

// An iframe has its own document and JavaScript environment,
// so the applications do not need to share a React runtime.

// ---------------------------------------------------------------------
// 32. Shared runtime is not runtime isolation
// ---------------------------------------------------------------------

export interface RuntimeIsolationComparison {
  readonly strategy: string;
  readonly isolation: string;
}

export const sharedRuntimeIsolation: RuntimeIsolationComparison = {
  strategy: "Shared React",
  isolation: "Low",
};

export const iframeIsolation: RuntimeIsolationComparison = {
  strategy: "Iframe",
  isolation: "High",
};

// Sharing React favors integration.
//
// Iframes favor stronger isolation.

// ---------------------------------------------------------------------
// 33. Shared runtime and design systems
// ---------------------------------------------------------------------

export interface DesignSystemRuntime {
  readonly packageName: string;
  readonly ReactCompatibility: string;
}

export const designSystemRuntime: DesignSystemRuntime = {
  packageName: "@example/ui",
  ReactCompatibility: "Requires a compatible consuming React runtime",
};

// A React-based design system participates in the React runtime contract.

// ---------------------------------------------------------------------
// 34. Shared runtime and package boundaries
// ---------------------------------------------------------------------

export interface PackageBoundary {
  readonly packageName: string;
  readonly publicSurface: readonly string[];
}

export const sharedUiPackageBoundary: PackageBoundary = {
  packageName: "@example/ui",
  publicSurface: ["Button", "Dialog", "TextField"],
};

// The package boundary should expose stable UI capabilities rather than
// implementation-specific React internals.

// ---------------------------------------------------------------------
// 35. Avoid exporting runtime internals
// ---------------------------------------------------------------------

export interface InternalRuntimeDetail {
  readonly detail: string;
  readonly public: boolean;
}

export const internalRuntimeDetails: readonly InternalRuntimeDetail[] = [
  {
    detail: "React internal fiber structures",
    public: false,
  },
  {
    detail: "Renderer internals",
    public: false,
  },
];

// Applications should depend on supported React APIs rather than internals.

// ---------------------------------------------------------------------
// 36. Shared React and server rendering
// ---------------------------------------------------------------------

export interface RenderingRuntime {
  readonly packageName: string;
  readonly role: string;
}

export const serverRenderingRuntime: RenderingRuntime = {
  packageName: "react-dom/server",
  role: "Server-side React rendering",
};

// Server rendering has its own runtime entry points and should be treated
// separately from browser rendering dependencies.

// ---------------------------------------------------------------------
// 37. Shared React and hydration
// ---------------------------------------------------------------------

export interface HydrationRuntime {
  readonly packageName: string;
  readonly requirement: string;
}

export const hydrationRuntime: HydrationRuntime = {
  packageName: "react-dom/client",
  requirement: "Compatible client-side React runtime",
};

// Hydration requires the client application to interpret the server-generated
// React output consistently with the client runtime and rendered tree.

// ---------------------------------------------------------------------
// 38. Shared runtime does not solve hydration mismatches
// ---------------------------------------------------------------------

export interface HydrationMismatch {
  readonly cause: string;
  readonly solvedBySharedReact: boolean;
}

export const hydrationMismatch: HydrationMismatch = {
  cause: "Server and client render different output",
  solvedBySharedReact: false,
};

// Sharing React cannot correct application-level differences between
// server-rendered and client-rendered output.

// ---------------------------------------------------------------------
// 39. Shared runtime and state ownership
// ---------------------------------------------------------------------

export interface StateOwnership {
  readonly state: string;
  readonly owner: string;
}

export const catalogStateOwnership: StateOwnership = {
  state: "Catalog search query",
  owner: "Catalog",
};

// A shared React runtime does not imply shared application state.
//
// State should remain with the capability that owns its behavior.

// ---------------------------------------------------------------------
// 40. Cross-boundary state
// ---------------------------------------------------------------------

export interface CrossBoundaryState {
  readonly mechanism: string;
  readonly data: string;
}

export const selectedProductCommunication: CrossBoundaryState = {
  mechanism: "Semantic event",
  data: "Product identifier",
};

// Explicit events can communicate state changes without exposing
// another application's internal state store.

// ---------------------------------------------------------------------
// 41. Shared runtime and context vs events
// ---------------------------------------------------------------------

export interface CommunicationComparison {
  readonly mechanism: string;
  readonly coupling: string;
}

export const contextCommunication: CommunicationComparison = {
  mechanism: "React context",
  coupling: "Strong React runtime coupling",
};

export const eventCommunication: CommunicationComparison = {
  mechanism: "Application event",
  coupling: "Looser runtime coupling",
};

// Context is useful when React composition is intentional.
//
// Events can be more appropriate when boundaries should remain less React-specific.

// ---------------------------------------------------------------------
// 42. Platform context
// ---------------------------------------------------------------------

export interface PlatformContextValue {
  readonly userId: string | null;
}

export const PlatformContext = createContext<PlatformContextValue>({
  userId: null,
});

// A platform context can provide application-wide information,
// but its use across independently loaded remotes should be intentional.

// ---------------------------------------------------------------------
// 43. Context provider at the host
// ---------------------------------------------------------------------

export const PlatformProvider: FC<{
  readonly children: ReactNode;
}> = ({ children }): ReactElement => {
  const value = useMemo<PlatformContextValue>(
    () => ({
      userId: "user-1",
    }),
    [],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};

// The provider belongs to the application composition layer.

// ---------------------------------------------------------------------
// 44. Context consumer in a remote
// ---------------------------------------------------------------------

export const RemoteUserLabel: FC = (): ReactElement => {
  const { userId } = useContext(PlatformContext);

  return <span>User: {userId ?? "Guest"}</span>;
};

// This composition works when the remote actually receives the same
// PlatformContext object and compatible React runtime.

// ---------------------------------------------------------------------
// 45. Context module identity
// ---------------------------------------------------------------------

export interface ContextModuleIdentity {
  readonly module: string;
  readonly requirement: string;
}

export const platformContextIdentity: ContextModuleIdentity = {
  module: "@example/platform-context",
  requirement: "Host and remote must resolve the intended shared context module",
};

// Even with one React runtime, loading two separate copies of the context
// module creates two distinct context objects.

// ---------------------------------------------------------------------
// 46. Shared context package
// ---------------------------------------------------------------------

export interface SharedContextPackage {
  readonly packageName: string;
  readonly contents: readonly string[];
}

export const sharedContextPackage: SharedContextPackage = {
  packageName: "@example/platform-context",
  contents: ["PlatformContext", "PlatformProvider", "PlatformContextValue"],
};

// A shared context package can establish a common module identity
// for host and remotes.

// ---------------------------------------------------------------------
// 47. Context package versioning
// ---------------------------------------------------------------------

export interface ContextPackageCompatibility {
  readonly packageName: string;
  readonly compatibilityPolicy: string;
}

export const contextPackageCompatibility: ContextPackageCompatibility = {
  packageName: "@example/platform-context",
  compatibilityPolicy: "Compatible public context contract",
};

// Shared context packages become part of the runtime integration contract.

// ---------------------------------------------------------------------
// 48. Avoid putting feature state in platform context
// ---------------------------------------------------------------------

export interface PlatformContextBoundary {
  readonly allowedState: readonly string[];
  readonly excludedState: readonly string[];
}

export const platformContextBoundary: PlatformContextBoundary = {
  allowedState: ["Authenticated user identity"],
  excludedState: ["Catalog search query", "Checkout cart internals"],
};

// Platform context should not become a global feature-state container.

// ---------------------------------------------------------------------
// 49. Shared runtime and dependency direction
// ---------------------------------------------------------------------

export interface RuntimeDependencyDirection {
  readonly application: string;
  readonly runtime: string;
}

export const runtimeDependencyDirection: RuntimeDependencyDirection = {
  application: "Catalog",
  runtime: "Shared React runtime",
};

// The capability depends on the runtime.
//
// The runtime should not depend on the capability's business logic.

// ---------------------------------------------------------------------
// 50. Shared runtime and architecture boundaries
// ---------------------------------------------------------------------

export interface ArchitectureBoundary {
  readonly capability: string;
  readonly runtimeShared: boolean;
  readonly stateShared: boolean;
  readonly implementationShared: boolean;
}

export const catalogArchitectureBoundary: ArchitectureBoundary = {
  capability: "Catalog",
  runtimeShared: true,
  stateShared: false,
  implementationShared: false,
};

// Sharing a runtime does not require sharing business state or implementation.

// ---------------------------------------------------------------------
// 51. Shared runtime and independent deployment
// ---------------------------------------------------------------------

export interface DeploymentContract {
  readonly capability: string;
  readonly independentlyDeployable: boolean;
  readonly runtimeCompatibilityRequired: boolean;
}

export const catalogDeploymentContract: DeploymentContract = {
  capability: "Catalog",
  independentlyDeployable: true,
  runtimeCompatibilityRequired: true,
};

// Independent deployment remains possible while sharing React,
// but React compatibility becomes part of the deployment contract.

// ---------------------------------------------------------------------
// 52. Runtime upgrade coordination
// ---------------------------------------------------------------------

export interface RuntimeUpgrade {
  readonly packageName: string;
  readonly change: string;
  readonly coordinationRequired: boolean;
}

export const reactUpgrade: RuntimeUpgrade = {
  packageName: "react",
  change: "Upgrade shared runtime version",
  coordinationRequired: true,
};

// A shared runtime makes runtime upgrades a cross-application concern.

// ---------------------------------------------------------------------
// 53. Runtime upgrade without shared deployment
// ---------------------------------------------------------------------

export interface GradualRuntimeUpgrade {
  readonly oldVersion: string;
  readonly newVersion: string;
  readonly compatibilityWindow: boolean;
}

export const gradualReactUpgrade: GradualRuntimeUpgrade = {
  oldVersion: "19.x",
  newVersion: "19.x",
  compatibilityWindow: true,
};

// A compatibility window can allow applications to upgrade independently,
// provided the actual versions remain compatible.

// ---------------------------------------------------------------------
// 54. Runtime upgrade testing
// ---------------------------------------------------------------------

export interface RuntimeCompatibilityTest {
  readonly test: string;
  readonly purpose: string;
}

export const runtimeCompatibilityTests: readonly RuntimeCompatibilityTest[] = [
  {
    test: "Host renders remote component",
    purpose: "Verify React component interoperability",
  },
  {
    test: "Remote consumes shared context",
    purpose: "Verify context identity and provider composition",
  },
  {
    test: "Shared UI renders in host and remote",
    purpose: "Verify component-library compatibility",
  },
];

// Runtime upgrades should be validated against the actual integration scenarios.

// ---------------------------------------------------------------------
// 55. Shared runtime and testing
// ---------------------------------------------------------------------

export interface RuntimeTestEnvironment {
  readonly runtime: string;
  readonly requirement: string;
}

export const runtimeTestEnvironment: RuntimeTestEnvironment = {
  runtime: "React",
  requirement: "Use the same compatibility assumptions as production",
};

// Tests that use a fundamentally different runtime arrangement can miss
// integration problems that appear only in the federated application.

// ---------------------------------------------------------------------
// 56. Shared runtime and Storybook-style isolation
// ---------------------------------------------------------------------

export interface IsolatedComponentEnvironment {
  readonly purpose: string;
  readonly runtime: string;
}

export const componentDevelopmentEnvironment: IsolatedComponentEnvironment = {
  purpose: "Develop shared UI components",
  runtime: "Compatible React runtime",
};

// Component development environments should reproduce relevant runtime
// assumptions without requiring the complete production application.

// ---------------------------------------------------------------------
// 57. Avoid accidental runtime duplication
// ---------------------------------------------------------------------

export interface DuplicationControl {
  readonly dependency: string;
  readonly control: string;
}

export const reactDuplicationControl: DuplicationControl = {
  dependency: "react",
  control: "Explicit federation sharing configuration",
};

// Runtime duplication should be a deliberate architecture decision,
// not an accidental consequence of package configuration.

// ---------------------------------------------------------------------
// 58. Runtime duplication can be intentional
// ---------------------------------------------------------------------

export interface IntentionalIsolation {
  readonly useCase: string;
  readonly reason: string;
}

export const isolatedRuntimeUseCase: IntentionalIsolation = {
  useCase: "Strongly isolated legacy application",
  reason: "The application does not require direct React composition",
};

// An isolated runtime can be reasonable when the integration boundary
// does not require shared React identity.

// ---------------------------------------------------------------------
// 59. Choose the boundary first
// ---------------------------------------------------------------------

export interface BoundaryDecision {
  readonly requirement: string;
  readonly suitableMechanism: string;
}

export const boundaryDecision: readonly BoundaryDecision[] = [
  {
    requirement: "Direct React component composition",
    suitableMechanism: "Shared compatible React runtime",
  },
  {
    requirement: "Framework-neutral DOM integration",
    suitableMechanism: "Custom element or similar browser contract",
  },
  {
    requirement: "Strong runtime isolation",
    suitableMechanism: "Iframe",
  },
];

// The desired integration boundary should determine the runtime strategy,
// rather than choosing runtime sharing first.

// ---------------------------------------------------------------------
// 60. Complete shared-runtime architecture
// ---------------------------------------------------------------------

export interface SharedRuntimeArchitecture {
  readonly host: string;
  readonly remotes: readonly string[];
  readonly sharedRuntime: readonly string[];
  readonly sharedPlatformModules: readonly string[];
  readonly privateState: readonly string[];
}

export const sharedRuntimeArchitecture: SharedRuntimeArchitecture = {
  host: "Application Shell",
  remotes: ["Catalog", "Account", "Checkout"],
  sharedRuntime: ["react", "react-dom"],
  sharedPlatformModules: ["@example/platform-context", "@example/ui"],
  privateState: ["Catalog search state", "Account form state", "Checkout workflow state"],
};

// This architecture shares the React runtime and selected platform contracts
// while preserving feature-level state and implementation ownership.

// ---------------------------------------------------------------------
// 61. Complete composition example
// ---------------------------------------------------------------------

export const SharedReactRuntimeExample: FC = (): ReactElement => {
  return (
    <PlatformProvider>
      <HostCompositionExample />
    </PlatformProvider>
  );
};

const HostCompositionExample: FC = (): ReactElement => {
  return (
    <main>
      <UserDisplay />
      <RemoteUserLabel />
      <ContentBoundary>
        <Counter />
      </ContentBoundary>
    </main>
  );
};

// The important distinction is:
//
// Shared runtime:
// - React
// - ReactDOM
//
// Shared platform contracts:
// - selected context modules
// - shared UI
//
// Private capability state:
// - Catalog state
// - Account state
// - Checkout state

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A shared React runtime allows independently loaded React applications to use a compatible React runtime instance.
// - React and ReactDOM are separate packages and should be treated as separate runtime dependencies.
// - Sharing React can reduce duplicated runtime code and support direct React component composition.
// - Shared runtime configuration creates a compatibility contract between the host and remotes.
// - Singleton configuration expresses an expectation of one shared runtime instance but does not make incompatible versions compatible.
// - Version policy, compatibility testing, and deliberate upgrade coordination are required when React is shared.
// - Duplicate React runtimes can create problems around context identity, React-specific interoperability, and bundle duplication.
// - Sharing React alone does not make separately created React contexts identical.
// - A shared context requires both compatible React runtime behavior and the same context object/module identity.
// - Shared context packages can provide a common context object for host and remote applications when that coupling is intentional.
// - Passing narrow props or serialized values can create a weaker runtime contract than sharing React context.
// - React-specific hooks and components create stronger runtime coupling than framework-neutral utilities.
// - React component libraries commonly use React as a peer dependency so the consuming application supplies the runtime.
// - Shared UI packages should have explicit ownership because their changes can affect multiple independently deployed applications.
// - Shared business logic should be evaluated carefully because it can create dependency coupling between supposedly independent capabilities.
// - Module Federation is a runtime module-loading mechanism, not a state-management system or a substitute for domain boundaries.
// - A shared React runtime does not require shared feature state, shared repositories, or shared implementation details.
// - Independent deployment remains possible with a shared React runtime, but runtime compatibility becomes part of the deployment contract.
// - Iframes provide stronger runtime isolation and therefore do not require a shared React runtime.
// - Framework-neutral mechanisms such as custom elements can reduce React-specific runtime coupling.
// - The choice between shared and isolated runtimes should follow the required integration boundary.
// - Shared runtime upgrades should be tested against real host-remote composition scenarios.
// - A strong federated architecture shares only the runtime and platform contracts that genuinely need to cross boundaries while preserving feature ownership and private state.
