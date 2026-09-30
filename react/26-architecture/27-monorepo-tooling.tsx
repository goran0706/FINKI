/**
 * Monorepo Tooling
 * ================
 *
 * A monorepo stores multiple applications, libraries, or packages in a single repository
 * while allowing those projects to maintain separate ownership, build targets, and dependency
 * boundaries. Monorepo tooling provides the mechanisms needed to discover projects, resolve
 * dependencies, run tasks efficiently, enforce boundaries, and coordinate changes across packages.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What a monorepo is
// ---------------------------------------------------------------------

// A monorepo contains multiple related projects in one version-controlled repository.
//
// A frontend monorepo might contain:
// - an application
// - shared React components
// - design tokens
// - feature packages
// - utility packages
// - configuration packages

export interface WorkspaceProject {
  readonly name: string;
  readonly type: "application" | "library" | "configuration";
  readonly path: string;
}

export const workspaceProjects: readonly WorkspaceProject[] = [
  {
    name: "web-app",
    type: "application",
    path: "apps/web-app",
  },
  {
    name: "admin-app",
    type: "application",
    path: "apps/admin-app",
  },
  {
    name: "ui",
    type: "library",
    path: "packages/ui",
  },
  {
    name: "design-tokens",
    type: "library",
    path: "packages/design-tokens",
  },
];

// ---------------------------------------------------------------------
// 2. Monorepo vs polyrepo
// ---------------------------------------------------------------------

export interface RepositoryModel {
  readonly model: "monorepo" | "polyrepo";
  readonly repositoryCount: string;
  readonly sourceCoordination: string;
}

export const monorepoModel: RepositoryModel = {
  model: "monorepo",
  repositoryCount: "One",
  sourceCoordination: "Centralized",
};

export const polyrepoModel: RepositoryModel = {
  model: "polyrepo",
  repositoryCount: "Multiple",
  sourceCoordination: "Distributed",
};

// A monorepo centralizes source management.
// A polyrepo separates projects at the repository level.
//
// Neither model automatically determines whether projects are modular,
// independently deployed, or architecturally well-bounded.

// ---------------------------------------------------------------------
// 3. Workspace
// ---------------------------------------------------------------------

// A workspace is a package-manager concept for managing multiple packages
// from one repository.
//
// Common workspace mechanisms include:
// - npm workspaces
// - pnpm workspaces
// - Yarn workspaces
//
// The exact configuration depends on the package manager.

export interface Workspace {
  readonly root: string;
  readonly packagePatterns: readonly string[];
}

export const workspace: Workspace = {
  root: ".",
  packagePatterns: ["apps/*", "packages/*"],
};

// ---------------------------------------------------------------------
// 4. Workspace packages
// ---------------------------------------------------------------------

export interface WorkspacePackage {
  readonly name: string;
  readonly version: string;
  readonly private: boolean;
}

export const uiPackage: WorkspacePackage = {
  name: "@example/ui",
  version: "1.0.0",
  private: true,
};

// A workspace package can be consumed by another workspace project
// without requiring a separate repository.

// ---------------------------------------------------------------------
// 5. Internal package dependencies
// ---------------------------------------------------------------------

export interface PackageDependency {
  readonly packageName: string;
  readonly dependency: string;
  readonly version: string;
}

export const internalDependency: PackageDependency = {
  packageName: "@example/web-app",
  dependency: "@example/ui",
  version: "workspace:*",
};

// Workspace protocols allow package managers to represent dependencies
// between packages in the same workspace.

// ---------------------------------------------------------------------
// 6. Package boundaries
// ---------------------------------------------------------------------

export interface PackageBoundary {
  readonly packageName: string;
  readonly publicApi: readonly string[];
  readonly privateImplementation: readonly string[];
}

export const uiPackageBoundary: PackageBoundary = {
  packageName: "@example/ui",
  publicApi: ["Button", "Dialog", "TextField"],
  privateImplementation: ["internal styling helpers", "internal component utilities"],
};

// A package boundary should expose intentional public APIs rather than
// allowing consumers to depend on arbitrary internal files.

// ---------------------------------------------------------------------
// 7. Package.json as a project contract
// ---------------------------------------------------------------------

export interface PackageScripts {
  readonly build: string;
  readonly test: string;
  readonly lint: string;
  readonly typecheck: string;
}

export const uiPackageScripts: PackageScripts = {
  build: "tsc -p tsconfig.build.json",
  test: "vitest run",
  lint: "eslint .",
  typecheck: "tsc --noEmit",
};

// Standard scripts make workspace projects easier for tooling to discover
// and execute consistently.

// ---------------------------------------------------------------------
// 8. Task runners
// ---------------------------------------------------------------------

export interface TaskRunner {
  readonly task: string;
  readonly responsibility: string;
}

export const taskRunnerResponsibilities: readonly TaskRunner[] = [
  {
    task: "build",
    responsibility: "Build projects and their required dependencies",
  },
  {
    task: "test",
    responsibility: "Run project tests",
  },
  {
    task: "lint",
    responsibility: "Validate source according to lint rules",
  },
  {
    task: "typecheck",
    responsibility: "Validate TypeScript programs",
  },
];

// A task runner coordinates commands across many workspace projects.

// ---------------------------------------------------------------------
// 9. Task graph
// ---------------------------------------------------------------------

export interface TaskDependency {
  readonly task: string;
  readonly dependsOn: readonly string[];
}

export const taskGraph: readonly TaskDependency[] = [
  {
    task: "@example/web-app#build",
    dependsOn: ["@example/ui#build", "@example/design-tokens#build"],
  },
  {
    task: "@example/ui#build",
    dependsOn: [],
  },
  {
    task: "@example/design-tokens#build",
    dependsOn: [],
  },
];

// The graph describes which tasks must be completed before another task
// can safely execute.

// ---------------------------------------------------------------------
// 10. Topological task ordering
// ---------------------------------------------------------------------

export const buildOrder: readonly string[] = [
  "@example/design-tokens#build",
  "@example/ui#build",
  "@example/web-app#build",
];

// A task graph allows tooling to determine valid execution order.
// Independent tasks can often execute concurrently.

// ---------------------------------------------------------------------
// 11. Parallel execution
// ---------------------------------------------------------------------

export interface ParallelTaskGroup {
  readonly tasks: readonly string[];
  readonly reason: string;
}

export const parallelTasks: readonly ParallelTaskGroup[] = [
  {
    tasks: ["@example/ui#test", "@example/design-tokens#test"],
    reason: "They do not depend on one another",
  },
];

// Parallel execution can reduce CI time when the dependency graph
// contains independent branches.

// ---------------------------------------------------------------------
// 12. Affected projects
// ---------------------------------------------------------------------

export interface ChangedFile {
  readonly path: string;
  readonly packageName: string;
}

export const changedFiles: readonly ChangedFile[] = [
  {
    path: "packages/ui/src/Button.tsx",
    packageName: "@example/ui",
  },
];

// If a shared package changes, applications depending on that package
// may also need validation.

// ---------------------------------------------------------------------
// 13. Dependency-aware affected analysis
// ---------------------------------------------------------------------

export interface AffectedAnalysis {
  readonly changedProject: string;
  readonly affectedProjects: readonly string[];
}

export const affectedUiChange: AffectedAnalysis = {
  changedProject: "@example/ui",
  affectedProjects: ["@example/ui", "@example/web-app", "@example/admin-app"],
};

// Affected analysis can avoid running unrelated tasks across the entire repository.

// ---------------------------------------------------------------------
// 14. Change detection
// ---------------------------------------------------------------------

export interface ChangeDetection {
  readonly mechanism: string;
  readonly purpose: string;
}

export const changeDetectionMechanisms: readonly ChangeDetection[] = [
  {
    mechanism: "Version-control diff",
    purpose: "Identify changed source files",
  },
  {
    mechanism: "Dependency graph",
    purpose: "Identify projects affected by those changes",
  },
  {
    mechanism: "Task graph",
    purpose: "Identify required validation tasks",
  },
];

// Efficient monorepo tooling combines file changes with project relationships.

// ---------------------------------------------------------------------
// 15. Caching
// ---------------------------------------------------------------------

export interface TaskCache {
  readonly task: string;
  readonly cacheable: boolean;
  readonly reason: string;
}

export const cacheableTasks: readonly TaskCache[] = [
  {
    task: "TypeScript compilation",
    cacheable: true,
    reason: "Same inputs can produce the same output",
  },
  {
    task: "Lint",
    cacheable: true,
    reason: "Result depends on source and configuration inputs",
  },
  {
    task: "Tests",
    cacheable: true,
    reason: "Deterministic tests can reuse prior results",
  },
];

// Caching avoids repeating work when relevant inputs have not changed.

// ---------------------------------------------------------------------
// 16. Cache keys
// ---------------------------------------------------------------------

export interface CacheKeyInput {
  readonly input: string;
  readonly purpose: string;
}

export const cacheKeyInputs: readonly CacheKeyInput[] = [
  {
    input: "Source files",
    purpose: "Detect implementation changes",
  },
  {
    input: "Lockfile",
    purpose: "Detect dependency changes",
  },
  {
    input: "Configuration",
    purpose: "Detect task behavior changes",
  },
  {
    input: "Environment inputs",
    purpose: "Detect relevant execution changes",
  },
];

// A cache is correct only when its key represents all meaningful inputs
// that can affect the task result.

// ---------------------------------------------------------------------
// 17. Local cache vs remote cache
// ---------------------------------------------------------------------

export interface CacheStrategy {
  readonly strategy: "local" | "remote";
  readonly availability: string;
}

export const localCache: CacheStrategy = {
  strategy: "local",
  availability: "One developer machine or CI worker",
};

export const remoteCache: CacheStrategy = {
  strategy: "remote",
  availability: "Shared across developers and CI workers",
};

// Remote caching can allow one environment to reuse work produced elsewhere.

// ---------------------------------------------------------------------
// 18. Cache correctness
// ---------------------------------------------------------------------

export interface CacheRisk {
  readonly problem: string;
  readonly consequence: string;
}

export const cacheRisks: readonly CacheRisk[] = [
  {
    problem: "Missing an input from the cache key",
    consequence: "Stale output may be reused incorrectly",
  },
  {
    problem: "Non-deterministic task",
    consequence: "Cached output may not represent a valid result",
  },
];

// Caching is an optimization layered on top of deterministic task behavior.

// ---------------------------------------------------------------------
// 19. Incremental builds
// ---------------------------------------------------------------------

export interface IncrementalBuild {
  readonly unchangedProject: string;
  readonly action: string;
}

export const incrementalBuildExample: IncrementalBuild = {
  unchangedProject: "@example/design-tokens",
  action: "Reuse its previous build result",
};

// Incremental execution avoids rebuilding projects whose relevant inputs
// have not changed.

// ---------------------------------------------------------------------
// 20. Dependency graph
// ---------------------------------------------------------------------

export interface DependencyGraphNode {
  readonly packageName: string;
  readonly dependencies: readonly string[];
}

export const dependencyGraph: readonly DependencyGraphNode[] = [
  {
    packageName: "@example/design-tokens",
    dependencies: [],
  },
  {
    packageName: "@example/ui",
    dependencies: ["@example/design-tokens"],
  },
  {
    packageName: "@example/web-app",
    dependencies: ["@example/ui"],
  },
];

// The dependency graph is central to affected analysis, build ordering,
// caching, and architectural validation.

// ---------------------------------------------------------------------
// 21. Circular dependencies
// ---------------------------------------------------------------------

export interface CircularDependency {
  readonly firstPackage: string;
  readonly secondPackage: string;
}

export const circularDependencyExample: CircularDependency = {
  firstPackage: "@example/catalog",
  secondPackage: "@example/checkout",
};

// A cycle makes dependency direction harder to reason about and can
// prevent clean task ordering.

// ---------------------------------------------------------------------
// 22. Dependency constraints
// ---------------------------------------------------------------------

export interface DependencyConstraint {
  readonly source: string;
  readonly allowedDependency: string;
  readonly rule: string;
}

export const dependencyConstraint: DependencyConstraint = {
  source: "application",
  allowedDependency: "shared UI package",
  rule: "Application may depend on shared UI",
};

// Monorepo tooling can enforce architectural dependency rules automatically.

// ---------------------------------------------------------------------
// 23. Tagging projects
// ---------------------------------------------------------------------

export interface ProjectTag {
  readonly project: string;
  readonly tags: readonly string[];
}

export const catalogProjectTags: ProjectTag = {
  project: "@example/catalog",
  tags: ["feature:catalog", "scope:frontend"],
};

// Tags can provide metadata that tooling uses for dependency constraints
// and project classification.

// ---------------------------------------------------------------------
// 24. Dependency direction
// ---------------------------------------------------------------------

export interface DependencyDirection {
  readonly layer: string;
  readonly allowedDirection: string;
}

export const dependencyDirections: readonly DependencyDirection[] = [
  {
    layer: "Application",
    allowedDirection: "Application -> shared libraries",
  },
  {
    layer: "UI library",
    allowedDirection: "UI library -> design tokens",
  },
  {
    layer: "Design tokens",
    allowedDirection: "Design tokens -> no application packages",
  },
];

// Explicit dependency direction makes architecture enforceable rather than
// relying only on developer convention.

// ---------------------------------------------------------------------
// 25. TypeScript project references
// ---------------------------------------------------------------------

export interface TypeScriptProjectReference {
  readonly project: string;
  readonly referencedProject: string;
}

export const typeScriptProjectReferences: readonly TypeScriptProjectReference[] = [
  {
    project: "apps/web-app",
    referencedProject: "packages/ui",
  },
  {
    project: "packages/ui",
    referencedProject: "packages/design-tokens",
  },
];

// TypeScript project references can model relationships between separate
// TypeScript projects and support incremental compilation.

// ---------------------------------------------------------------------
// 26. Composite projects
// ---------------------------------------------------------------------

export interface CompositeProject {
  readonly project: string;
  readonly composite: boolean;
}

export const uiCompositeProject: CompositeProject = {
  project: "@example/ui",
  composite: true,
};

// Composite TypeScript projects participate in project-reference builds.

// ---------------------------------------------------------------------
// 27. Path aliases
// ---------------------------------------------------------------------

export interface PathAlias {
  readonly alias: string;
  readonly target: string;
}

export const pathAlias: PathAlias = {
  alias: "@example/ui/*",
  target: "packages/ui/src/*",
};

// Path aliases improve source readability, but the runtime and build tooling
// must understand the resulting module resolution strategy.

// ---------------------------------------------------------------------
// 28. Package exports
// ---------------------------------------------------------------------

export interface PackageExport {
  readonly entryPoint: string;
  readonly target: string;
}

export const uiPackageExport: PackageExport = {
  entryPoint: "@example/ui",
  target: "./dist/index.js",
};

// Package exports define which module paths are public.
// Consumers should generally import through the package's public entry point.

// ---------------------------------------------------------------------
// 29. Internal entry points
// ---------------------------------------------------------------------

export interface InternalModule {
  readonly path: string;
  readonly public: boolean;
}

export const internalUiModule: InternalModule = {
  path: "@example/ui/internal/button-utils",
  public: false,
};

// Preventing consumers from depending on internal modules makes refactoring safer.

// ---------------------------------------------------------------------
// 30. Shared configuration packages
// ---------------------------------------------------------------------

export interface ConfigurationPackage {
  readonly packageName: string;
  readonly purpose: string;
}

export const configurationPackages: readonly ConfigurationPackage[] = [
  {
    packageName: "@example/eslint-config",
    purpose: "Shared lint rules",
  },
  {
    packageName: "@example/tsconfig",
    purpose: "Shared TypeScript configuration",
  },
];

// Configuration packages can standardize tooling without sharing application logic.

// ---------------------------------------------------------------------
// 31. Shared ESLint configuration
// ---------------------------------------------------------------------

export interface LintConfiguration {
  readonly packageName: string;
  readonly ruleCategories: readonly string[];
}

export const sharedLintConfiguration: LintConfiguration = {
  packageName: "@example/eslint-config",
  ruleCategories: ["TypeScript", "React", "Accessibility"],
};

// Centralized configuration can reduce configuration drift.

// ---------------------------------------------------------------------
// 32. Shared TypeScript configuration
// ---------------------------------------------------------------------

export interface TypeScriptConfiguration {
  readonly strict: boolean;
  readonly noEmit: boolean;
  readonly moduleResolution: string;
}

export const sharedTypeScriptConfiguration: TypeScriptConfiguration = {
  strict: true,
  noEmit: false,
  moduleResolution: "bundler",
};

// Shared configuration should provide defaults while allowing projects
// to make justified project-specific adjustments.

// ---------------------------------------------------------------------
// 33. Build configuration
// ---------------------------------------------------------------------

export interface BuildConfiguration {
  readonly project: string;
  readonly outputDirectory: string;
  readonly declarationOutput: boolean;
}

export const uiBuildConfiguration: BuildConfiguration = {
  project: "@example/ui",
  outputDirectory: "dist",
  declarationOutput: true,
};

// Libraries often produce JavaScript and declaration files,
// while applications may have different output requirements.

// ---------------------------------------------------------------------
// 34. Test configuration
// ---------------------------------------------------------------------

export interface TestConfiguration {
  readonly project: string;
  readonly environment: "node" | "browser";
  readonly coverage: boolean;
}

export const uiTestConfiguration: TestConfiguration = {
  project: "@example/ui",
  environment: "browser",
  coverage: true,
};

// Test environments should match the runtime assumptions of each project.

// ---------------------------------------------------------------------
// 35. Formatting
// ---------------------------------------------------------------------

export interface FormattingConfiguration {
  readonly tool: string;
  readonly scope: string;
}

export const formattingConfiguration: FormattingConfiguration = {
  tool: "Prettier",
  scope: "All workspace projects",
};

// Shared formatting reduces style differences between packages.

// ---------------------------------------------------------------------
// 36. Pre-commit validation
// ---------------------------------------------------------------------

export interface PreCommitTask {
  readonly task: string;
  readonly purpose: string;
}

export const preCommitTasks: readonly PreCommitTask[] = [
  {
    task: "Format changed files",
    purpose: "Keep source consistently formatted",
  },
  {
    task: "Lint changed projects",
    purpose: "Catch local static-analysis problems",
  },
];

// Local validation should remain fast enough to support frequent commits.

// ---------------------------------------------------------------------
// 37. Continuous integration
// ---------------------------------------------------------------------

export interface CiStage {
  readonly order: number;
  readonly task: string;
}

export const ciPipeline: readonly CiStage[] = [
  {
    order: 1,
    task: "Install dependencies",
  },
  {
    order: 2,
    task: "Determine affected projects",
  },
  {
    order: 3,
    task: "Run affected validation",
  },
  {
    order: 4,
    task: "Build affected applications and packages",
  },
];

// Affected CI avoids treating every commit as a repository-wide full rebuild.

// ---------------------------------------------------------------------
// 38. CI caching
// ---------------------------------------------------------------------

export interface CiCache {
  readonly cachedData: readonly string[];
  readonly purpose: string;
}

export const ciCache: CiCache = {
  cachedData: ["Package-manager store", "Task outputs"],
  purpose: "Reduce repeated CI work",
};

// Dependency caches and task-output caches solve different problems.

// ---------------------------------------------------------------------
// 39. Lockfile
// ---------------------------------------------------------------------

export interface LockfileRole {
  readonly role: string;
  readonly purpose: string;
}

export const lockfileRole: LockfileRole = {
  role: "Dependency resolution record",
  purpose: "Reproduce the selected dependency versions",
};

// A single workspace lockfile can coordinate dependency resolution
// across all workspace packages.

// ---------------------------------------------------------------------
// 40. Dependency version consistency
// ---------------------------------------------------------------------

export interface DependencyVersionPolicy {
  readonly dependency: string;
  readonly policy: string;
}

export const reactVersionPolicy: DependencyVersionPolicy = {
  dependency: "react",
  policy: "Use one compatible workspace version",
};

// Consistent dependency versions can reduce duplication and runtime conflicts,
// although some architectures intentionally permit multiple versions.

// ---------------------------------------------------------------------
// 41. Dependency constraints
// ---------------------------------------------------------------------

export interface DependencyPolicy {
  readonly packageName: string;
  readonly allowedVersions: string;
}

export const reactDependencyPolicy: DependencyPolicy = {
  packageName: "react",
  allowedVersions: "19.x",
};

// Dependency constraints can prevent accidental version drift across projects.

// ---------------------------------------------------------------------
// 42. Package graph visualization
// ---------------------------------------------------------------------

export interface GraphVisualization {
  readonly nodes: number;
  readonly edges: number;
  readonly purpose: string;
}

export const packageGraphVisualization: GraphVisualization = {
  nodes: 6,
  edges: 5,
  purpose: "Inspect package relationships",
};

// Visualizing the dependency graph can expose unexpectedly broad dependencies
// and architectural cycles.

// ---------------------------------------------------------------------
// 43. Code ownership
// ---------------------------------------------------------------------

export interface CodeOwnership {
  readonly path: string;
  readonly owner: string;
}

export const codeOwnership: readonly CodeOwnership[] = [
  {
    path: "apps/catalog/**",
    owner: "Catalog Team",
  },
  {
    path: "packages/ui/**",
    owner: "Frontend Platform Team",
  },
];

// Ownership rules make responsibility explicit in a large repository.

// ---------------------------------------------------------------------
// 44. Versioning strategies
// ---------------------------------------------------------------------

export interface VersioningStrategy {
  readonly strategy: string;
  readonly characteristic: string;
}

export const versioningStrategies: readonly VersioningStrategy[] = [
  {
    strategy: "Independent versioning",
    characteristic: "Packages release at their own versions",
  },
  {
    strategy: "Fixed versioning",
    characteristic: "Packages share a coordinated version",
  },
];

// The versioning model should match how packages are consumed and released.

// ---------------------------------------------------------------------
// 45. Changesets
// ---------------------------------------------------------------------

export interface ReleaseMetadata {
  readonly packageName: string;
  readonly releaseType: "patch" | "minor" | "major";
  readonly reason: string;
}

export const uiReleaseMetadata: ReleaseMetadata = {
  packageName: "@example/ui",
  releaseType: "minor",
  reason: "Add a new public component",
};

// Release metadata can describe which packages require version changes
// and why those changes are necessary.

// ---------------------------------------------------------------------
// 46. Atomic changes
// ---------------------------------------------------------------------

export interface AtomicChange {
  readonly change: string;
  readonly affectedPackages: readonly string[];
}

export const atomicChange: AtomicChange = {
  change: "Update UI component API and migrate its consumers",
  affectedPackages: ["@example/ui", "@example/web-app", "@example/admin-app"],
};

// A monorepo allows related package changes to be committed together,
// which can simplify cross-package refactoring.

// ---------------------------------------------------------------------
// 47. Cross-package refactoring
// ---------------------------------------------------------------------

export interface Refactoring {
  readonly oldApi: string;
  readonly newApi: string;
  readonly packagesChanged: readonly string[];
}

export const componentRefactoring: Refactoring = {
  oldApi: "Button label prop",
  newApi: "Button children",
  packagesChanged: ["@example/ui", "@example/web-app"],
};

// One commit can update both the provider and its consumers.

// ---------------------------------------------------------------------
// 48. Code search
// ---------------------------------------------------------------------

export interface SearchCapability {
  readonly target: string;
  readonly purpose: string;
}

export const repositorySearch: readonly SearchCapability[] = [
  {
    target: "Package imports",
    purpose: "Find consumers of a public API",
  },
  {
    target: "Component names",
    purpose: "Find affected call sites",
  },
  {
    target: "Configuration references",
    purpose: "Find tooling dependencies",
  },
];

// Repository-wide search is particularly useful when changing shared packages.

// ---------------------------------------------------------------------
// 49. Dependency-aware commands
// ---------------------------------------------------------------------

export interface WorkspaceCommand {
  readonly command: string;
  readonly scope: string;
}

export const workspaceCommands: readonly WorkspaceCommand[] = [
  {
    command: "build",
    scope: "All required projects",
  },
  {
    command: "test",
    scope: "Affected projects",
  },
  {
    command: "lint",
    scope: "Changed projects",
  },
];

// Tooling should allow developers to choose an appropriate scope rather
// than always running every task.

// ---------------------------------------------------------------------
// 50. Task naming
// ---------------------------------------------------------------------

export interface TaskName {
  readonly packageName: string;
  readonly task: string;
  readonly fullName: string;
}

export const uiBuildTask: TaskName = {
  packageName: "@example/ui",
  task: "build",
  fullName: "@example/ui#build",
};

// Stable task identifiers allow task runners and caches to address
// individual project operations.

// ---------------------------------------------------------------------
// 51. Environment variables
// ---------------------------------------------------------------------

export interface EnvironmentInput {
  readonly name: string;
  readonly purpose: string;
  readonly cacheRelevant: boolean;
}

export const environmentInputs: readonly EnvironmentInput[] = [
  {
    name: "NODE_ENV",
    purpose: "Select runtime behavior",
    cacheRelevant: true,
  },
  {
    name: "CI",
    purpose: "Identify CI execution",
    cacheRelevant: false,
  },
];

// Environment variables that affect task output must be represented
// appropriately in task configuration and caching.

// ---------------------------------------------------------------------
// 52. Generated files
// ---------------------------------------------------------------------

export interface GeneratedArtifact {
  readonly source: string;
  readonly generatedFile: string;
}

export const generatedArtifacts: readonly GeneratedArtifact[] = [
  {
    source: "packages/ui/src",
    generatedFile: "packages/ui/dist",
  },
  {
    source: "packages/design-tokens/src",
    generatedFile: "packages/design-tokens/dist",
  },
];

// Generated output should generally be separated from source and handled
// consistently by build tooling.

// ---------------------------------------------------------------------
// 53. Package publishing
// ---------------------------------------------------------------------

export interface PublishablePackage {
  readonly packageName: string;
  readonly publishable: boolean;
  readonly registry: string;
}

export const publishableUiPackage: PublishablePackage = {
  packageName: "@example/ui",
  publishable: true,
  registry: "npm-compatible registry",
};

// A monorepo can contain both publishable libraries and private applications.

// ---------------------------------------------------------------------
// 54. Private packages
// ---------------------------------------------------------------------

export interface PrivatePackage {
  readonly packageName: string;
  readonly reason: string;
}

export const privateApplicationPackage: PrivatePackage = {
  packageName: "@example/web-app",
  reason: "Deployable application rather than reusable library",
};

// `private` packages can still participate fully in workspace dependency graphs.

// ---------------------------------------------------------------------
// 55. Package API validation
// ---------------------------------------------------------------------

export interface ApiValidation {
  readonly packageName: string;
  readonly check: string;
}

export const apiValidation: readonly ApiValidation[] = [
  {
    packageName: "@example/ui",
    check: "Only documented entry points are imported",
  },
  {
    packageName: "@example/design-tokens",
    check: "Consumers use public token exports",
  },
];

// API validation helps prevent accidental dependencies on internal files.

// ---------------------------------------------------------------------
// 56. Boundary linting
// ---------------------------------------------------------------------

export interface BoundaryRule {
  readonly sourceTag: string;
  readonly targetTag: string;
  readonly allowed: boolean;
}

export const boundaryRules: readonly BoundaryRule[] = [
  {
    sourceTag: "feature:catalog",
    targetTag: "scope:shared",
    allowed: true,
  },
  {
    sourceTag: "scope:shared",
    targetTag: "feature:catalog",
    allowed: false,
  },
];

// Tooling can turn dependency-direction decisions into automated checks.

// ---------------------------------------------------------------------
// 57. Monorepo tooling layers
// ---------------------------------------------------------------------

export interface ToolingLayer {
  readonly layer: string;
  readonly responsibility: string;
}

export const monorepoToolingLayers: readonly ToolingLayer[] = [
  {
    layer: "Package manager",
    responsibility: "Workspace dependency management",
  },
  {
    layer: "Task runner",
    responsibility: "Project task orchestration",
  },
  {
    layer: "Compiler",
    responsibility: "Language and module validation",
  },
  {
    layer: "Linter",
    responsibility: "Static code analysis",
  },
  {
    layer: "Test runner",
    responsibility: "Automated test execution",
  },
  {
    layer: "Release tooling",
    responsibility: "Versioning and publishing",
  },
];

// These layers solve different problems and can be combined.

// ---------------------------------------------------------------------
// 58. Tooling should remain explicit
// ---------------------------------------------------------------------

export interface ToolingResponsibility {
  readonly tool: string;
  readonly responsibility: string;
}

export const toolingResponsibilities: readonly ToolingResponsibility[] = [
  {
    tool: "Package manager",
    responsibility: "Install and link dependencies",
  },
  {
    tool: "Task runner",
    responsibility: "Schedule project tasks",
  },
  {
    tool: "TypeScript",
    responsibility: "Type-check TypeScript projects",
  },
];

// Separating responsibilities makes the repository easier to understand
// and reduces dependence on one tool's internal abstractions.

// ---------------------------------------------------------------------
// 59. Monorepo architecture example
// ---------------------------------------------------------------------

export interface MonorepoArchitecture {
  readonly applications: readonly string[];
  readonly sharedPackages: readonly string[];
  readonly toolingPackages: readonly string[];
}

export const monorepoArchitecture: MonorepoArchitecture = {
  applications: ["apps/web-app", "apps/admin-app"],
  sharedPackages: ["packages/ui", "packages/design-tokens"],
  toolingPackages: ["packages/eslint-config", "packages/tsconfig"],
};

// This layout separates applications, reusable packages, and repository tooling.

// ---------------------------------------------------------------------
// 60. React application consuming a shared package
// ---------------------------------------------------------------------

export interface ProductCardProps {
  readonly title: string;
  readonly price: string;
}

export const ProductCard: FC<ProductCardProps> = ({ title, price }): ReactElement => {
  return (
    <article>
      <h2>{title}</h2>
      <p>{price}</p>
    </article>
  );
};

// A shared package can expose React components while keeping the
// application's feature implementation outside the shared package.

// ---------------------------------------------------------------------
// 61. Application composition
// ---------------------------------------------------------------------

export const ProductCatalogPage: FC = (): ReactElement => {
  return (
    <main>
      <ProductCard price="$19.99" title="Example Product" />
    </main>
  );
};

// The application consumes the public component API rather than its
// internal implementation files.

// ---------------------------------------------------------------------
// 62. Monorepo and micro-frontends
// ---------------------------------------------------------------------

export interface MonorepoMicroFrontendRelationship {
  readonly repositoryModel: string;
  readonly deploymentModel: string;
  readonly relationship: string;
}

export const monorepoMicroFrontendRelationship: MonorepoMicroFrontendRelationship = {
  repositoryModel: "Monorepo",
  deploymentModel: "Independent applications",
  relationship: "Compatible architectural choices",
};

// A monorepo can contain multiple independently deployed frontend applications.
// Repository structure and runtime deployment strategy are separate decisions.

// ---------------------------------------------------------------------
// 63. Shared runtime package
// ---------------------------------------------------------------------

export interface RuntimePackage {
  readonly packageName: string;
  readonly purpose: string;
}

export const sharedReactRuntimePackage: RuntimePackage = {
  packageName: "react",
  purpose: "Shared React runtime dependency",
};

// A monorepo can make runtime dependency versions easier to coordinate,
// but actual runtime composition still depends on the build and deployment model.

// ---------------------------------------------------------------------
// 64. Workspace dependency graph
// ---------------------------------------------------------------------

export interface WorkspaceGraph {
  readonly nodes: readonly string[];
  readonly edges: readonly string[];
}

export const workspaceGraph: WorkspaceGraph = {
  nodes: ["web-app", "admin-app", "ui", "design-tokens"],
  edges: ["web-app -> ui", "admin-app -> ui", "ui -> design-tokens"],
};

// This graph represents source-level workspace relationships.

// ---------------------------------------------------------------------
// 65. Tooling does not replace architecture
// ---------------------------------------------------------------------

export interface ToolingLimit {
  readonly capability: string;
  readonly limitation: string;
}

export const toolingLimits: readonly ToolingLimit[] = [
  {
    capability: "Dependency graph",
    limitation: "Cannot determine whether a business boundary is conceptually correct",
  },
  {
    capability: "Task caching",
    limitation: "Cannot make a non-deterministic task deterministic",
  },
  {
    capability: "Boundary linting",
    limitation: "Cannot define the correct domain architecture automatically",
  },
];

// Tooling enforces explicit rules.
// It does not replace architectural decisions.

// ---------------------------------------------------------------------
// 66. Avoid excessive workspace packages
// ---------------------------------------------------------------------

export interface PackageGranularity {
  readonly strategy: string;
  readonly consequence: string;
}

export const packageGranularity: readonly PackageGranularity[] = [
  {
    strategy: "Package every component separately",
    consequence: "Large dependency graph and maintenance overhead",
  },
  {
    strategy: "Group cohesive components",
    consequence: "Fewer packages and broader local boundaries",
  },
];

// Package boundaries should represent useful ownership or reuse boundaries,
// not merely minimize file size.

// ---------------------------------------------------------------------
// 67. Shared package extraction
// ---------------------------------------------------------------------

export interface ExtractionCriteria {
  readonly criterion: string;
}

export const sharedPackageExtractionCriteria: readonly ExtractionCriteria[] = [
  {
    criterion: "The code has multiple legitimate consumers",
  },
  {
    criterion: "The API can be kept narrow",
  },
  {
    criterion: "Ownership is clear",
  },
  {
    criterion: "The package has a stable conceptual purpose",
  },
];

// Extraction should follow an architectural need rather than speculative reuse.

// ---------------------------------------------------------------------
// 68. Monorepo migration
// ---------------------------------------------------------------------

export interface MonorepoMigrationStep {
  readonly order: number;
  readonly action: string;
}

export const monorepoMigration: readonly MonorepoMigrationStep[] = [
  {
    order: 1,
    action: "Identify applications and reusable packages",
  },
  {
    order: 2,
    action: "Introduce workspace configuration",
  },
  {
    order: 3,
    action: "Define package boundaries",
  },
  {
    order: 4,
    action: "Centralize shared tooling where appropriate",
  },
  {
    order: 5,
    action: "Introduce dependency-aware task execution",
  },
  {
    order: 6,
    action: "Add affected analysis and caching",
  },
];

// Migration can begin with repository organization before introducing
// more sophisticated task orchestration.

// ---------------------------------------------------------------------
// 69. Complete tooling model
// ---------------------------------------------------------------------

export interface MonorepoToolingModel {
  readonly repository: string;
  readonly packageManagement: string;
  readonly taskExecution: string;
  readonly dependencyAnalysis: string;
  readonly caching: string;
  readonly architectureChecks: string;
}

export const completeMonorepoToolingModel: MonorepoToolingModel = {
  repository: "One repository",
  packageManagement: "Workspace-based",
  taskExecution: "Dependency-aware",
  dependencyAnalysis: "Project graph",
  caching: "Local and remote",
  architectureChecks: "Dependency constraints",
};

// The tooling model connects repository management, task execution,
// dependency analysis, performance optimization, and architecture enforcement.

// ---------------------------------------------------------------------
// 70. Complete application example
// ---------------------------------------------------------------------

export const MonorepoApplicationExample: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example Application</h1>
      <ProductCatalogPage />
    </main>
  );
};

// The application consumes shared packages through stable public APIs.
// Monorepo tooling can then determine dependencies, schedule tasks,
// cache results, and validate architectural constraints.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A monorepo stores multiple related projects in one version-controlled repository.
// - Workspace tooling manages dependencies between packages inside the repository.
// - Package boundaries define reusable and private implementation surfaces.
// - Package managers, task runners, compilers, linters, test runners, and release tools solve different problems.
// - A project graph represents relationships between applications, libraries, and configuration packages.
// - A task graph represents dependencies between operations such as build, test, lint, and typecheck.
// - Independent tasks can often execute in parallel.
// - Affected analysis identifies projects that need validation after a change.
// - Dependency-aware affected analysis can avoid unnecessary repository-wide work.
// - Caching allows deterministic task results to be reused when relevant inputs have not changed.
// - Cache keys must include all meaningful inputs that can affect task output.
// - Local caches are machine-specific, while remote caches can be shared across developers and CI workers.
// - Incremental builds reuse results for projects whose relevant inputs remain unchanged.
// - Circular dependencies make dependency direction and task ordering harder to reason about.
// - Dependency constraints can turn architectural rules into automated checks.
// - Tags can classify projects and support dependency-boundary enforcement.
// - TypeScript project references can model relationships between separate TypeScript projects and support incremental compilation.
// - Path aliases improve source readability but must remain compatible with the actual module-resolution and build strategy.
// - Package exports define intentional public module entry points and protect internal implementation details.
// - Shared configuration packages can reduce linting, formatting, and TypeScript configuration drift.
// - A monorepo lockfile can coordinate dependency resolution across workspace packages.
// - Dependency version policies can reduce accidental runtime and package-version divergence.
// - Atomic changes allow related package and consumer changes to be committed together.
// - Cross-package refactoring is often easier when all affected consumers are visible in one repository.
// - CI can combine affected analysis, task graphs, and caching to reduce repeated work.
// - Release tooling can manage independent or coordinated package versioning.
// - Monorepos can contain both private applications and publishable libraries.
// - A monorepo can also contain independently deployed applications, including micro-frontends.
// - Repository structure and runtime deployment architecture are separate decisions.
// - Shared React dependencies can be coordinated more easily in a monorepo, but runtime composition still depends on the deployment architecture.
// - Tooling can enforce dependency direction, but it cannot determine the correct business architecture automatically.
// - Creating too many tiny packages can produce unnecessary dependency and maintenance overhead.
// - Shared packages should represent cohesive, stable concepts with clear ownership and useful consumers.
// - Monorepo tooling improves the efficiency and enforceability of a repository architecture; it does not replace architectural design.
