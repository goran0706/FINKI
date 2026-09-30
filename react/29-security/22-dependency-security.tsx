/**
 * Dependency Security
 * ====================
 *
 * Dependency security is the practice of managing third-party packages, libraries, frameworks,
 * build tools, and transitive dependencies so that they do not introduce known vulnerabilities,
 * malicious code, unsupported components, or unexpected supply-chain risks into an application.
 *
 * A dependency is part of the application's trusted computing base once its code executes as part
 * of the application or build process. Security therefore requires inventorying dependencies,
 * reviewing changes, auditing known vulnerabilities, verifying package integrity where supported,
 * keeping dependencies maintained, and treating dependency updates as security-sensitive changes.
 */

import { useState, type FC, type FormEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What a dependency is
// ---------------------------------------------------------------------

// A dependency is software that another part of the application relies on.
//
// Examples include:
//
// - runtime libraries
// - UI libraries
// - validation libraries
// - HTTP clients
// - build tools
// - test frameworks
// - development utilities
// - deployment tooling
//
// Dependency security applies to more than packages imported directly by
// application source code.

// ---------------------------------------------------------------------
// 2. Direct dependencies
// ---------------------------------------------------------------------

export interface DirectDependency {
  readonly name: string;
  readonly purpose: string;
}

export const directDependencies: readonly DirectDependency[] = [
  {
    name: "example-ui-library",
    purpose: "User interface components",
  },
  {
    name: "example-validation-library",
    purpose: "Runtime input validation",
  },
];

// A direct dependency is intentionally selected by the application.
//
// Direct dependencies should have a clear purpose rather than being added
// simply because they are convenient.

// ---------------------------------------------------------------------
// 3. Transitive dependencies
// ---------------------------------------------------------------------

export interface TransitiveDependency {
  readonly name: string;
  readonly requiredBy: string;
}

export const transitiveDependencies: readonly TransitiveDependency[] = [
  {
    name: "example-parser",
    requiredBy: "example-validation-library",
  },
  {
    name: "example-helper",
    requiredBy: "example-parser",
  },
];

// A transitive dependency is brought into the project by another
// dependency.
//
// Transitive dependencies matter because vulnerabilities can exist in
// packages the application never imported directly.

// ---------------------------------------------------------------------
// 4. The dependency tree
// ---------------------------------------------------------------------

export interface DependencyNode {
  readonly name: string;
  readonly dependencies: readonly DependencyNode[];
}

export const dependencyTree: DependencyNode = {
  name: "application",
  dependencies: [
    {
      name: "example-library",
      dependencies: [
        {
          name: "example-helper",
          dependencies: [],
        },
      ],
    },
  ],
};

// Security review must consider the resolved dependency tree, not only the
// small list of packages written in package.json.

// ---------------------------------------------------------------------
// 5. Dependencies become part of the application
// ---------------------------------------------------------------------

// Once dependency code executes in the application, its behavior can affect
// the application's security boundary.
//
// A malicious or compromised dependency may be able to:
//
// - read data available to its process
// - modify application behavior
// - access browser APIs when bundled into client code
// - access server resources when executed on the server
// - execute during a build or installation step
//
// The impact depends on where and how the dependency runs.

// ---------------------------------------------------------------------
// 6. Browser dependencies
// ---------------------------------------------------------------------

export interface BrowserDependency {
  readonly name: string;
  readonly executesInBrowser: boolean;
}

export const browserDependency: BrowserDependency = {
  name: "example-browser-library",
  executesInBrowser: true,
};

// A dependency bundled into browser JavaScript executes in the user's
// browser and should therefore be treated as part of the client-side
// application's security surface.

// ---------------------------------------------------------------------
// 7. Server dependencies
// ---------------------------------------------------------------------

export interface ServerDependency {
  readonly name: string;
  readonly executesOnServer: boolean;
}

export const serverDependency: ServerDependency = {
  name: "example-server-library",
  executesOnServer: true,
};

// Server-side dependencies can potentially access resources available to
// the server process.
//
// Their compromise can therefore have consequences beyond the browser.

// ---------------------------------------------------------------------
// 8. Build-time dependencies
// ---------------------------------------------------------------------

export interface BuildDependency {
  readonly name: string;
  readonly runsDuringBuild: boolean;
}

export const buildDependency: BuildDependency = {
  name: "example-build-tool",
  runsDuringBuild: true,
};

// Build and development dependencies can still be security-sensitive.
//
// A compromised build tool may alter generated artifacts, source code,
// configuration, or other outputs before deployment.

// ---------------------------------------------------------------------
// 9. Dependency risk is context-dependent
// ---------------------------------------------------------------------

export type DependencyExecutionContext = "browser" | "server" | "build" | "test" | "development";

export const dependencyContexts: readonly DependencyExecutionContext[] = [
  "browser",
  "server",
  "build",
  "test",
  "development",
];

// The same package can have different consequences depending on where its
// code executes and what privileges that environment provides.

// ---------------------------------------------------------------------
// 10. Known vulnerabilities
// ---------------------------------------------------------------------

export interface DependencyVulnerability {
  readonly packageName: string;
  readonly severity: "low" | "moderate" | "high" | "critical";
  readonly patchedVersion: string | null;
}

export const exampleVulnerability: DependencyVulnerability = {
  packageName: "example-package",
  severity: "high",
  patchedVersion: "2.4.1",
};

// A known vulnerability means that a package version has a documented
// security issue.
//
// The presence of an advisory requires investigation, not automatic
// assumptions about the exact impact on every application.

// ---------------------------------------------------------------------
// 11. A vulnerable dependency is not automatically an exploitable app
// ---------------------------------------------------------------------

export interface VulnerabilityAssessment {
  readonly affectedVersion: boolean;
  readonly vulnerableCodePathUsed: boolean;
  readonly exposedAttackSurface: boolean;
}

export const vulnerabilityAssessment: VulnerabilityAssessment = {
  affectedVersion: true,
  vulnerableCodePathUsed: false,
  exposedAttackSurface: false,
};

// Security advisories should be reviewed in application context.
//
// Relevant questions include:
//
// - Is the installed version affected?
// - Is the vulnerable feature actually used?
// - Is the vulnerable code reachable?
// - Is the affected component exposed to an attacker?
// - Is a compensating control present?
//
// This does not mean known vulnerabilities should simply be ignored.

// ---------------------------------------------------------------------
// 12. Dependency advisories
// ---------------------------------------------------------------------

export interface SecurityAdvisory {
  readonly identifier: string;
  readonly packageName: string;
  readonly affectedVersions: readonly string[];
  readonly fixedVersion: string | null;
}

export const exampleAdvisory: SecurityAdvisory = {
  identifier: "EXAMPLE-2026-0001",
  packageName: "example-package",
  affectedVersions: ["2.0.0", "2.1.0"],
  fixedVersion: "2.1.1",
};

// Advisories provide information needed to determine affected versions,
// fixed versions, severity, and remediation options.

// ---------------------------------------------------------------------
// 13. Dependency inventory
// ---------------------------------------------------------------------

export interface DependencyInventoryEntry {
  readonly name: string;
  readonly version: string;
  readonly direct: boolean;
  readonly environment: DependencyExecutionContext;
}

export const dependencyInventory: readonly DependencyInventoryEntry[] = [
  {
    name: "example-ui-library",
    version: "4.2.0",
    direct: true,
    environment: "browser",
  },
  {
    name: "example-parser",
    version: "3.1.2",
    direct: false,
    environment: "server",
  },
];

// An accurate inventory makes it possible to determine what software is
// actually present in the application and where it executes.

// ---------------------------------------------------------------------
// 14. Lockfiles
// ---------------------------------------------------------------------

export interface LockfilePurpose {
  readonly recordsResolvedVersions: boolean;
  readonly recordsDependencyRelationships: boolean;
}

export const lockfilePurpose: LockfilePurpose = {
  recordsResolvedVersions: true,
  recordsDependencyRelationships: true,
};

// Package managers use lockfiles to record a resolved dependency graph.
//
// The exact format depends on the package manager.
//
// Lockfiles are important for reproducible installations and dependency
// visibility.

// ---------------------------------------------------------------------
// 15. Commit lockfiles when appropriate
// ---------------------------------------------------------------------

export const trackedDependencyFiles = ["package.json", "package-lock.json"] as const;

// Applications using npm commonly commit package.json and package-lock.json
// so the declared dependencies and resolved tree can be reviewed together.
//
// Other package managers use different manifest and lockfile names.

// ---------------------------------------------------------------------
// 16. Reproducible dependency installation
// ---------------------------------------------------------------------

export type InstallationMode = "reproducible" | "floating";

export const preferredInstallationMode: InstallationMode = "reproducible";

// Production and CI installations should use a reproducible dependency
// resolution strategy appropriate to the package manager.
//
// Reproducibility makes unexpected dependency changes easier to detect.

// ---------------------------------------------------------------------
// 17. Semver ranges
// ---------------------------------------------------------------------

export interface DependencySpecification {
  readonly packageName: string;
  readonly requestedVersion: string;
}

export const dependencySpecification: DependencySpecification = {
  packageName: "example-package",
  requestedVersion: "^2.4.0",
};

// A manifest can specify a version range rather than one exact version.
//
// The package manager resolves that range to a concrete version, normally
// recorded in the lockfile.

// ---------------------------------------------------------------------
// 18. Version ranges do not replace lockfiles
// ---------------------------------------------------------------------

// A declaration such as:
//
// "example-package": "^2.4.0"
//
// expresses which versions are acceptable according to the declared range.
//
// The lockfile records the concrete dependency tree selected for an
// installation.
//
// Both pieces of information are useful for dependency management.

// ---------------------------------------------------------------------
// 19. Updating dependencies
// ---------------------------------------------------------------------

export interface DependencyUpdate {
  readonly packageName: string;
  readonly fromVersion: string;
  readonly toVersion: string;
  readonly reason: "security" | "bug-fix" | "feature" | "maintenance";
}

export const securityUpdate: DependencyUpdate = {
  packageName: "example-package",
  fromVersion: "2.4.0",
  toVersion: "2.4.1",
  reason: "security",
};

// Dependency updates should be reviewed as code changes.
//
// A security update can also change APIs, behavior, generated output, or
// transitive dependencies.

// ---------------------------------------------------------------------
// 20. Security patches can be breaking changes
// ---------------------------------------------------------------------

export const majorSecurityUpdate: DependencyUpdate = {
  packageName: "example-package",
  fromVersion: "2.9.0",
  toVersion: "3.0.0",
  reason: "security",
};

// A security fix can sometimes require a major-version upgrade.
//
// The appropriate response is to assess the upgrade, test it, and address
// compatibility issues rather than assuming that a security update can
// always be applied without application changes.

// ---------------------------------------------------------------------
// 21. Dependency auditing
// ---------------------------------------------------------------------

export const npmAuditCommands = ["npm audit", "npm audit --audit-level=high"] as const;

// npm audit checks the dependency tree against known vulnerability data.
//
// Audit tooling should be part of a broader dependency-management process,
// not treated as the only supply-chain control.

// ---------------------------------------------------------------------
// 22. Automated dependency auditing
// ---------------------------------------------------------------------

export interface DependencyAuditPolicy {
  readonly localAudit: boolean;
  readonly continuousIntegrationAudit: boolean;
  readonly scheduledReview: boolean;
}

export const dependencyAuditPolicy: DependencyAuditPolicy = {
  localAudit: true,
  continuousIntegrationAudit: true,
  scheduledReview: true,
};

// Regular auditing helps identify newly disclosed vulnerabilities in
// dependencies that were previously considered safe.

// ---------------------------------------------------------------------
// 23. Audit failures in CI
// ---------------------------------------------------------------------

export interface AuditFailurePolicy {
  readonly threshold: "low" | "moderate" | "high" | "critical";
  readonly blocksDeployment: boolean;
}

export const auditFailurePolicy: AuditFailurePolicy = {
  threshold: "high",
  blocksDeployment: true,
};

// Teams can configure CI to fail when vulnerabilities meet a chosen
// severity threshold.
//
// The threshold should reflect the application's risk tolerance and
// remediation process.

// ---------------------------------------------------------------------
// 24. npm audit fix
// ---------------------------------------------------------------------

export const npmRemediationCommands = ["npm audit fix", "npm audit fix --package-lock-only"] as const;

// Automated fixes can be useful, but their resulting dependency changes
// still need review and testing.
//
// A remediation may involve a semver-major upgrade or other behavior change.

// ---------------------------------------------------------------------
// 25. Dependency update review
// ---------------------------------------------------------------------

export interface DependencyReview {
  readonly packageName: string;
  readonly versionChangeReviewed: boolean;
  readonly changelogReviewed: boolean;
  readonly testsPassed: boolean;
}

export const exampleDependencyReview: DependencyReview = {
  packageName: "example-package",
  versionChangeReviewed: true,
  changelogReviewed: true,
  testsPassed: true,
};

// A dependency pull request should be reviewed like any other potentially
// security-sensitive code change.

// ---------------------------------------------------------------------
// 26. Dependency review in pull requests
// ---------------------------------------------------------------------

// Dependency changes should make it possible to answer:
//
// - Which package changed?
// - Why did it change?
// - Which version is now installed?
// - Which transitive dependencies changed?
// - Are vulnerabilities introduced or removed?
// - Did package behavior change?
// - Did generated artifacts change?

// ---------------------------------------------------------------------
// 27. Dependency provenance
// ---------------------------------------------------------------------

export interface PackageProvenance {
  readonly packageName: string;
  readonly source: string;
  readonly releaseVersion: string;
}

export const packageProvenance: PackageProvenance = {
  packageName: "example-package",
  source: "example-registry",
  releaseVersion: "2.4.1",
};

// Knowing where a package came from helps establish the trust chain for
// software entering the application.

// ---------------------------------------------------------------------
// 28. Package integrity
// ---------------------------------------------------------------------

export interface PackageIntegrity {
  readonly integrityVerified: boolean;
  readonly sourceVerified: boolean;
}

export const packageIntegrity: PackageIntegrity = {
  integrityVerified: true,
  sourceVerified: true,
};

// Package managers can provide integrity mechanisms for downloaded
// artifacts.
//
// Integrity verification helps detect unexpected changes to package
// contents, but it does not prove that the original package itself is
// benign.

// ---------------------------------------------------------------------
// 29. Integrity is not trustworthiness
// ---------------------------------------------------------------------

// A package can be:
//
// correctly signed
// correctly hashed
// successfully downloaded
//
// and still contain malicious code if the published release itself was
// malicious.
//
// Integrity controls and source/reputation/release-review controls address
// different parts of the supply chain.

// ---------------------------------------------------------------------
// 30. Package signing and provenance
// ---------------------------------------------------------------------

export interface ReleaseVerification {
  readonly signatureVerified: boolean;
  readonly provenanceAvailable: boolean;
}

export const releaseVerification: ReleaseVerification = {
  signatureVerified: true,
  provenanceAvailable: true,
};

// Where the package ecosystem supports signatures or provenance
// attestations, organizations can incorporate those signals into their
// supply-chain verification process.

// ---------------------------------------------------------------------
// 31. Typosquatting
// ---------------------------------------------------------------------

export const intendedPackageName = "example-package";

// Typosquatting uses a package name that resembles a legitimate package.
//
// An attacker may publish a malicious package under a deceptively similar
// name.
//
// Verify package names carefully before installing them.

// ---------------------------------------------------------------------
// 32. Dependency confusion
// ---------------------------------------------------------------------

export interface PackageRegistryPolicy {
  readonly allowedRegistries: readonly string[];
}

export const packageRegistryPolicy: PackageRegistryPolicy = {
  allowedRegistries: ["https://registry.example.com"],
};

// Dependency confusion can occur when a package manager resolves a package
// from an unintended registry or source.
//
// Organizations using private packages should define explicit registry and
// scope policies appropriate to their package manager.

// ---------------------------------------------------------------------
// 33. Private packages
// ---------------------------------------------------------------------

export interface PrivatePackage {
  readonly name: string;
  readonly private: boolean;
}

export const privatePackage: PrivatePackage = {
  name: "@example/internal-package",
  private: true,
};

// Private packages require controlled access to their registries.
//
// Authentication credentials for private registries should be stored using
// secure credential mechanisms rather than committed to source control.

// ---------------------------------------------------------------------
// 34. Registry credentials
// ---------------------------------------------------------------------

export const registryCredentialName = "PACKAGE_REGISTRY_TOKEN";

// Registry credentials should not be embedded in:
//
// - source code
// - package.json
// - lockfiles
// - client bundles
// - public logs
//
// CI systems should provide them through protected secret mechanisms.

// ---------------------------------------------------------------------
// 35. Dependency lifecycle
// ---------------------------------------------------------------------

export type DependencyLifecycleStage =
  "selection" | "installation" | "review" | "build" | "deployment" | "monitoring" | "removal";

export const dependencyLifecycle: readonly DependencyLifecycleStage[] = [
  "selection",
  "installation",
  "review",
  "build",
  "deployment",
  "monitoring",
  "removal",
];

// Dependency security is a lifecycle problem rather than a one-time
// installation check.

// ---------------------------------------------------------------------
// 36. Selecting a dependency
// ---------------------------------------------------------------------

export interface DependencySelectionCriteria {
  readonly maintained: boolean;
  readonly securityHistoryReviewed: boolean;
  readonly unnecessaryFunctionalityAvoided: boolean;
}

export const dependencySelectionCriteria: DependencySelectionCriteria = {
  maintained: true,
  securityHistoryReviewed: true,
  unnecessaryFunctionalityAvoided: true,
};

// Before adding a package, consider whether:
//
// - the package is actively maintained
// - its purpose is necessary
// - its security history is acceptable
// - its dependency tree is reasonable
// - its license is compatible
// - the application can safely operate with it

// ---------------------------------------------------------------------
// 37. Minimize dependencies
// ---------------------------------------------------------------------

export const dependencyDecision: "add" | "do-not-add" = "add";

// A dependency should provide enough value to justify the additional
// attack surface and maintenance burden.
//
// Fewer dependencies are not automatically safer, but unnecessary
// dependencies increase the amount of third-party software that must be
// maintained and trusted.

// ---------------------------------------------------------------------
// 38. Dependency maintenance
// ---------------------------------------------------------------------

export interface MaintenanceStatus {
  readonly activelyMaintained: boolean;
  readonly latestReleaseReviewed: boolean;
  readonly unsupported: boolean;
}

export const maintenanceStatus: MaintenanceStatus = {
  activelyMaintained: true,
  latestReleaseReviewed: true,
  unsupported: false,
};

// Unmaintained or obsolete components can remain exposed to unresolved
// vulnerabilities and compatibility problems.

// ---------------------------------------------------------------------
// 39. Vulnerability remediation
// ---------------------------------------------------------------------

export type RemediationAction = "upgrade" | "replace" | "remove" | "mitigate" | "accept-with-documentation";

export const remediationAction: RemediationAction = "upgrade";

// The response to a vulnerability should be based on the actual exposure,
// available fixes, exploitability, business impact, and operational
// constraints.

// ---------------------------------------------------------------------
// 40. When no patch exists
// ---------------------------------------------------------------------

export interface UnpatchedVulnerabilityPlan {
  readonly vulnerableDependency: string;
  readonly patchAvailable: boolean;
  readonly replacementConsidered: boolean;
  readonly mitigationDocumented: boolean;
}

export const unpatchedVulnerabilityPlan: UnpatchedVulnerabilityPlan = {
  vulnerableDependency: "example-package",
  patchAvailable: false,
  replacementConsidered: true,
  mitigationDocumented: true,
};

// If no fixed release exists, possible actions include:
//
// - applying a documented mitigation
// - replacing the dependency
// - removing the functionality
// - isolating the vulnerable component
// - monitoring for a future fix
//
// The decision should be documented and periodically revisited.

// ---------------------------------------------------------------------
// 41. Transitive vulnerability remediation
// ---------------------------------------------------------------------

export interface TransitiveRemediation {
  readonly vulnerablePackage: string;
  readonly directParent: string;
  readonly upgradeParent: boolean;
}

export const transitiveRemediation: TransitiveRemediation = {
  vulnerablePackage: "example-parser",
  directParent: "example-library",
  upgradeParent: true,
};

// If the vulnerable package is transitive, upgrading its direct parent may
// be the correct remediation path.

// ---------------------------------------------------------------------
// 42. Dependency overrides
// ---------------------------------------------------------------------

export interface DependencyOverride {
  readonly packageName: string;
  readonly forcedVersion: string;
  readonly temporary: boolean;
}

export const dependencyOverride: DependencyOverride = {
  packageName: "example-parser",
  forcedVersion: "3.1.3",
  temporary: true,
};

// Package-manager-specific overrides can sometimes provide a temporary
// remediation while waiting for an upstream dependency to update.
//
// Overrides should be reviewed because they can introduce compatibility
// problems and should not become unexplained permanent configuration.

// ---------------------------------------------------------------------
// 43. Direct dependency pinning
// ---------------------------------------------------------------------

export interface PinnedDependency {
  readonly packageName: string;
  readonly version: string;
}

export const pinnedDependency: PinnedDependency = {
  packageName: "example-package",
  version: "2.4.1",
};

// Exact versions can improve reproducibility, while lockfiles generally
// provide the resolved versions for the entire dependency tree.
//
// Pinning alone does not remove the need for vulnerability monitoring.

// ---------------------------------------------------------------------
// 44. Automated updates
// ---------------------------------------------------------------------

export interface AutomatedUpdatePolicy {
  readonly securityUpdates: boolean;
  readonly regularVersionUpdates: boolean;
  readonly testsRequired: boolean;
}

export const automatedUpdatePolicy: AutomatedUpdatePolicy = {
  securityUpdates: true,
  regularVersionUpdates: true,
  testsRequired: true,
};

// Automated tools can create update pull requests and reduce the time
// dependencies remain outdated.
//
// Automated updates still require appropriate CI and review controls.

// ---------------------------------------------------------------------
// 45. Dependency bots are not trusted blindly
// ---------------------------------------------------------------------

// An automated dependency update changes code that will execute in the
// application or build.
//
// Review the resulting:
//
// - manifest changes
// - lockfile changes
// - package scripts
// - transitive dependency changes
// - generated artifacts
// - test results

// ---------------------------------------------------------------------
// 46. Installation scripts
// ---------------------------------------------------------------------

export interface PackageScriptPolicy {
  readonly scriptsCanExecuteDuringInstall: boolean;
  readonly scriptsReviewed: boolean;
}

export const packageScriptPolicy: PackageScriptPolicy = {
  scriptsCanExecuteDuringInstall: true,
  scriptsReviewed: true,
};

// Some package ecosystems allow packages to execute lifecycle scripts
// during installation.
//
// Such scripts can have significant privileges in the installation
// environment.
//
// Organizations should understand and control this behavior where their
// package manager supports doing so.

// ---------------------------------------------------------------------
// 47. Build scripts
// ---------------------------------------------------------------------

export const buildScripts = ["build", "test", "lint"] as const;

// Build scripts and tooling can execute with access to source code,
// environment variables, credentials, and generated artifacts.
//
// CI permissions should therefore follow least privilege.

// ---------------------------------------------------------------------
// 48. CI secret exposure
// ---------------------------------------------------------------------

export interface CiSecretPolicy {
  readonly secretsAvailableToTests: boolean;
  readonly secretsAvailableToBuild: boolean;
  readonly leastPrivilegeApplied: boolean;
}

export const ciSecretPolicy: CiSecretPolicy = {
  secretsAvailableToTests: false,
  secretsAvailableToBuild: false,
  leastPrivilegeApplied: true,
};

// Avoid exposing production credentials to dependency installation,
// testing, or build steps unless they are genuinely required.
//
// A compromised dependency can potentially access secrets available to the
// process executing it.

// ---------------------------------------------------------------------
// 49. Pull request workflows
// ---------------------------------------------------------------------

export interface PullRequestSecurity {
  readonly untrustedCodeRunsWithProductionSecrets: boolean;
  readonly protectedEnvironmentsUsed: boolean;
}

export const pullRequestSecurity: PullRequestSecurity = {
  untrustedCodeRunsWithProductionSecrets: false,
  protectedEnvironmentsUsed: true,
};

// Pull requests can contain dependency or build-script changes.
//
// CI should avoid giving untrusted pull-request code unnecessary access to
// sensitive credentials or production environments.

// ---------------------------------------------------------------------
// 50. Dependency scanning
// ---------------------------------------------------------------------

export interface DependencyScanning {
  readonly knownVulnerabilities: boolean;
  readonly outdatedPackages: boolean;
  readonly licenseIssues: boolean;
}

export const dependencyScanning: DependencyScanning = {
  knownVulnerabilities: true,
  outdatedPackages: true,
  licenseIssues: true,
};

// Security scanning can cover different dimensions.
//
// Vulnerability scanning and license review answer different questions and
// should not be treated as interchangeable.

// ---------------------------------------------------------------------
// 51. Dependency review
// ---------------------------------------------------------------------

export interface DependencyChange {
  readonly added: readonly string[];
  readonly removed: readonly string[];
  readonly updated: readonly string[];
}

export const dependencyChange: DependencyChange = {
  added: ["example-package"],
  removed: [],
  updated: ["example-parser"],
};

// Reviewing dependency diffs before merging helps identify unexpected
// package additions and transitive changes.

// ---------------------------------------------------------------------
// 52. Software bill of materials
// ---------------------------------------------------------------------

export interface SoftwareBillOfMaterials {
  readonly generated: boolean;
  readonly includesTransitiveDependencies: boolean;
}

export const softwareBillOfMaterials: SoftwareBillOfMaterials = {
  generated: true,
  includesTransitiveDependencies: true,
};

// An SBOM provides a machine-readable inventory of software components.
//
// It can support vulnerability response, asset inventory, and compliance
// processes.

// ---------------------------------------------------------------------
// 53. Dependency graph
// ---------------------------------------------------------------------

export interface DependencyGraph {
  readonly direct: readonly string[];
  readonly transitive: readonly string[];
}

export const dependencyGraph: DependencyGraph = {
  direct: ["example-ui-library"],
  transitive: ["example-parser", "example-helper"],
};

// A dependency graph makes relationships visible:
//
// application
//     |
//     +-- direct dependency
//             |
//             +-- transitive dependency
//
// This is important when a vulnerability is reported in a package that the
// application never declared directly.

// ---------------------------------------------------------------------
// 54. Vulnerability alerts
// ---------------------------------------------------------------------

export interface VulnerabilityAlert {
  readonly packageName: string;
  readonly severity: "low" | "moderate" | "high" | "critical";
  readonly status: "open" | "fixed" | "dismissed";
}

export const vulnerabilityAlert: VulnerabilityAlert = {
  packageName: "example-package",
  severity: "high",
  status: "open",
};

// Alerting systems can notify maintainers when known vulnerabilities are
// discovered in the dependency graph.

// ---------------------------------------------------------------------
// 55. Dependency update cadence
// ---------------------------------------------------------------------

export type UpdateCadence = "continuous" | "weekly" | "monthly";

export const updateCadence: UpdateCadence = "weekly";

// The appropriate cadence depends on the application's exposure and
// operational capacity.
//
// Security advisories should be handled according to their urgency rather
// than waiting for a routine update cycle.

// ---------------------------------------------------------------------
// 56. Emergency dependency updates
// ---------------------------------------------------------------------

export interface EmergencyUpdate {
  readonly advisory: string;
  readonly immediateReviewRequired: boolean;
  readonly deploymentExpedited: boolean;
}

export const emergencyUpdate: EmergencyUpdate = {
  advisory: "EXAMPLE-2026-0001",
  immediateReviewRequired: true,
  deploymentExpedited: true,
};

// Critical vulnerabilities may require an accelerated remediation process.
//
// Emergency changes should still be tested and documented to the extent
// practical.

// ---------------------------------------------------------------------
// 57. Dependency replacement
// ---------------------------------------------------------------------

export interface DependencyReplacement {
  readonly oldPackage: string;
  readonly newPackage: string;
  readonly migrationRequired: boolean;
}

export const dependencyReplacement: DependencyReplacement = {
  oldPackage: "example-old-library",
  newPackage: "example-maintained-library",
  migrationRequired: true,
};

// Replacement may be appropriate when a dependency is:
//
// - abandoned
// - repeatedly vulnerable
// - incompatible with security requirements
// - unnecessarily large
// - no longer needed

// ---------------------------------------------------------------------
// 58. Removing unused dependencies
// ---------------------------------------------------------------------

export const unusedDependencies: readonly string[] = ["example-unused-package"];

// Unused dependencies should be removed.
//
// Keeping unnecessary packages increases the dependency graph and can
// create avoidable maintenance and security exposure.

// ---------------------------------------------------------------------
// 59. Avoid duplicate functionality
// ---------------------------------------------------------------------

export interface DependencyChoice {
  readonly existingCapability: string;
  readonly proposedPackage: string;
  readonly justification: string;
}

export const dependencyChoice: DependencyChoice = {
  existingCapability: "URL parsing",
  proposedPackage: "example-url-library",
  justification: "Required behavior is not provided by the existing platform API.",
};

// Before adding a package, determine whether the platform or an existing
// trusted dependency already provides the required functionality.
//
// Avoiding unnecessary dependencies reduces maintenance overhead.

// ---------------------------------------------------------------------
// 60. Dependency source review
// ---------------------------------------------------------------------

export interface SourceReview {
  readonly repositoryReviewed: boolean;
  readonly releaseHistoryReviewed: boolean;
  readonly maintenanceStatusReviewed: boolean;
}

export const sourceReview: SourceReview = {
  repositoryReviewed: true,
  releaseHistoryReviewed: true,
  maintenanceStatusReviewed: true,
};

// Package selection can include review of the project's repository,
// release history, maintenance activity, and published security
// information.

// ---------------------------------------------------------------------
// 61. Suspicious dependency behavior
// ---------------------------------------------------------------------

export const suspiciousDependencySignals = [
  "Unexpected install scripts",
  "Unexpected network access",
  "Unexpected native binaries",
  "Unexpected credential access",
  "Unexpected large dependency tree",
] as const;

// Unexpected behavior should trigger investigation before the package is
// introduced into a sensitive environment.

// ---------------------------------------------------------------------
// 62. Native modules
// ---------------------------------------------------------------------

export interface NativeDependency {
  readonly packageName: string;
  readonly containsNativeCode: boolean;
}

export const nativeDependency: NativeDependency = {
  packageName: "example-native-module",
  containsNativeCode: true,
};

// Native dependencies can introduce additional platform-specific build and
// runtime behavior.
//
// They should be reviewed according to the privileges and capabilities
// required by the native component.

// ---------------------------------------------------------------------
// 63. Dependency isolation
// ---------------------------------------------------------------------

export interface DependencyIsolation {
  readonly restrictedProcess: boolean;
  readonly restrictedNetwork: boolean;
  readonly restrictedCredentials: boolean;
}

export const dependencyIsolation: DependencyIsolation = {
  restrictedProcess: true,
  restrictedNetwork: true,
  restrictedCredentials: true,
};

// Highly sensitive or untrusted processing can sometimes be isolated into
// a separate process or service with reduced privileges.
//
// Isolation is an architectural control, not a replacement for dependency
// maintenance.

// ---------------------------------------------------------------------
// 64. Least privilege for build environments
// ---------------------------------------------------------------------

export interface BuildPrivileges {
  readonly productionCredentials: boolean;
  readonly deploymentCredentials: boolean;
  readonly broadNetworkAccess: boolean;
}

export const buildPrivileges: BuildPrivileges = {
  productionCredentials: false,
  deploymentCredentials: false,
  broadNetworkAccess: false,
};

// Build environments should receive only the permissions they actually
// require.
//
// This limits the impact if a dependency or build tool is compromised.

// ---------------------------------------------------------------------
// 65. Dependency security and secrets
// ---------------------------------------------------------------------

export interface SecretExposureRisk {
  readonly dependencyCanReadEnvironment: boolean;
  readonly sensitiveSecretsPresent: boolean;
}

export const secretExposureRisk: SecretExposureRisk = {
  dependencyCanReadEnvironment: true,
  sensitiveSecretsPresent: false,
};

// A server-side dependency can potentially access environment variables
// available to its process.
//
// Avoid making secrets available to processes that do not need them.

// ---------------------------------------------------------------------
// 66. Client bundle inspection
// ---------------------------------------------------------------------

export interface ClientBundleDependency {
  readonly packageName: string;
  readonly includedInBrowserBundle: boolean;
}

export const clientBundleDependency: ClientBundleDependency = {
  packageName: "example-browser-library",
  includedInBrowserBundle: true,
};

// Browser bundles should be treated as public artifacts.
//
// Dependencies included in them should not receive confidential data or
// credentials merely because the package is considered "trusted."

// ---------------------------------------------------------------------
// 67. Dependency security and XSS
// ---------------------------------------------------------------------

// A compromised browser dependency can potentially introduce malicious
// client-side behavior.
//
// Therefore dependency security contributes directly to the application's
// XSS and client-side security posture.
//
// Content Security Policy and other browser defenses are additional layers,
// not substitutes for reviewing dependencies.

// ---------------------------------------------------------------------
// 68. Dependency security and server-side impact
// ---------------------------------------------------------------------

export interface ServerDependencyImpact {
  readonly canAccessDatabase: boolean;
  readonly canAccessFilesystem: boolean;
  readonly canAccessNetwork: boolean;
}

export const serverDependencyImpact: ServerDependencyImpact = {
  canAccessDatabase: true,
  canAccessFilesystem: true,
  canAccessNetwork: true,
};

// Server-side dependency compromise can be especially significant because
// the dependency executes inside a process that may have access to internal
// systems and credentials.

// ---------------------------------------------------------------------
// 69. Dependency security testing
// ---------------------------------------------------------------------

export interface DependencySecurityTest {
  readonly test: string;
  readonly expectedResult: string;
}

export const dependencySecurityTests: readonly DependencySecurityTest[] = [
  {
    test: "Dependency audit",
    expectedResult: "No unresolved prohibited vulnerabilities",
  },
  {
    test: "Production installation",
    expectedResult: "Resolved dependency tree matches approved lockfile",
  },
  {
    test: "Client bundle inspection",
    expectedResult: "No confidential dependency configuration is exposed",
  },
];

// Dependency security should be included in CI and release validation.

// ---------------------------------------------------------------------
// 70. Dependency incident response
// ---------------------------------------------------------------------

export type DependencyIncidentStep = "identify" | "assess" | "contain" | "upgrade" | "rotate" | "verify" | "document";

export const dependencyIncidentResponse: readonly DependencyIncidentStep[] = [
  "identify",
  "assess",
  "contain",
  "upgrade",
  "rotate",
  "verify",
  "document",
];

// If a dependency compromise is suspected, remediation may require more
// than upgrading the package.
//
// Secrets potentially exposed to the compromised code may also need to be
// rotated.

// ---------------------------------------------------------------------
// 71. Dependency compromise assessment
// ---------------------------------------------------------------------

export interface CompromiseAssessment {
  readonly affectedVersionsIdentified: boolean;
  readonly affectedArtifactsIdentified: boolean;
  readonly deploymentExposureIdentified: boolean;
  readonly credentialExposureAssessed: boolean;
}

export const compromiseAssessment: CompromiseAssessment = {
  affectedVersionsIdentified: true,
  affectedArtifactsIdentified: true,
  deploymentExposureIdentified: true,
  credentialExposureAssessed: true,
};

// Incident investigation should determine which versions, builds,
// deployments, and credentials were potentially exposed.

// ---------------------------------------------------------------------
// 72. Build artifact verification
// ---------------------------------------------------------------------

export interface BuildArtifactVerification {
  readonly sourceCommitKnown: boolean;
  readonly dependencyTreeKnown: boolean;
  readonly artifactReviewed: boolean;
}

export const buildArtifactVerification: BuildArtifactVerification = {
  sourceCommitKnown: true,
  dependencyTreeKnown: true,
  artifactReviewed: true,
};

// Supply-chain assurance should connect:
//
// source
//   -> dependency tree
//   -> build
//   -> artifact
//   -> deployment
//
// Unexpected changes at any stage deserve investigation.

// ---------------------------------------------------------------------
// 73. Dependency changes should be traceable
// ---------------------------------------------------------------------

export interface DependencyChangeRecord {
  readonly packageName: string;
  readonly previousVersion: string;
  readonly newVersion: string;
  readonly reviewedBy: string;
}

export const dependencyChangeRecord: DependencyChangeRecord = {
  packageName: "example-package",
  previousVersion: "2.4.0",
  newVersion: "2.4.1",
  reviewedBy: "maintainer-example",
};

// Change tracking supports both security investigation and operational
// accountability.

// ---------------------------------------------------------------------
// 74. Dependency security policy
// ---------------------------------------------------------------------

export interface DependencySecurityPolicy {
  readonly inventoryRequired: boolean;
  readonly lockfileTracked: boolean;
  readonly vulnerabilityScanningEnabled: boolean;
  readonly dependencyChangesReviewed: boolean;
  readonly unusedDependenciesRemoved: boolean;
  readonly buildPrivilegesMinimized: boolean;
}

export const dependencySecurityPolicy: DependencySecurityPolicy = {
  inventoryRequired: true,
  lockfileTracked: true,
  vulnerabilityScanningEnabled: true,
  dependencyChangesReviewed: true,
  unusedDependenciesRemoved: true,
  buildPrivilegesMinimized: true,
};

// A written policy makes dependency security an ongoing engineering
// responsibility rather than an occasional manual task.

// ---------------------------------------------------------------------
// 75. Integrated dependency workflow
// ---------------------------------------------------------------------

export const dependencySecurityWorkflow = [
  "Choose only necessary dependencies",
  "Review package maintenance and security information",
  "Install from approved sources",
  "Record the resolved dependency tree",
  "Review dependency changes",
  "Scan for known vulnerabilities",
  "Test security-sensitive updates",
  "Verify production dependency installation",
  "Monitor advisories after deployment",
  "Remediate or remove vulnerable dependencies",
] as const;

// The workflow should operate continuously because new vulnerabilities can
// be disclosed after a package has already been installed.

// ---------------------------------------------------------------------
// 76. React dependency example
// ---------------------------------------------------------------------

export interface DependencyAwareFormProps {
  readonly submit: (email: string) => Promise<void>;
}

export const DependencyAwareForm: FC<DependencyAwareFormProps> = ({ submit }): ReactElement => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!email.includes("@")) {
      setMessage("Enter a valid email address.");
      return;
    }

    try {
      await submit(email);
      setMessage("Request submitted.");
    } catch {
      setMessage("The request could not be completed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>

      <button type="submit">Submit</button>

      {message && <p role="status">{message}</p>}
    </form>
  );
};

// React itself does not make third-party packages safe.
//
// A dependency used for validation, state management, rendering, HTTP
// requests, or other functionality remains part of the application's
// dependency and supply-chain surface.

// ---------------------------------------------------------------------
// 77. Dependency security checklist
// ---------------------------------------------------------------------

export const dependencySecurityChecklist = [
  "Know which direct and transitive dependencies are installed.",
  "Track the resolved dependency tree with the appropriate lockfile.",
  "Use maintained dependencies for security-sensitive functionality.",
  "Remove dependencies that are no longer required.",
  "Review dependency changes before merging them.",
  "Monitor known vulnerability advisories.",
  "Run dependency audits regularly.",
  "Configure appropriate CI thresholds for vulnerability findings.",
  "Investigate whether vulnerable code paths are actually exposed.",
  "Prefer patched releases when available.",
  "Review breaking security upgrades instead of ignoring them.",
  "Use approved package registries and scopes.",
  "Verify package integrity and provenance where supported.",
  "Treat installation and build scripts as security-sensitive code.",
  "Keep CI credentials to the minimum required scope.",
  "Avoid exposing production secrets to untrusted build or test code.",
  "Maintain an inventory of dependencies and versions.",
  "Consider generating an SBOM when appropriate.",
  "Investigate suspicious dependency behavior.",
  "Rotate credentials when a dependency compromise may have exposed them.",
] as const;

// ---------------------------------------------------------------------
// 78. Dependency security is supply-chain security
// ---------------------------------------------------------------------

export const supplyChainSecurityLayers = [
  "Package selection",
  "Package source",
  "Package integrity",
  "Dependency resolution",
  "Code review",
  "Build environment",
  "Artifact creation",
  "Deployment",
  "Vulnerability monitoring",
  "Incident response",
] as const;

// Dependency security is one part of the broader software supply chain.
//
// A secure application requires controls across the entire chain rather
// than relying on a package scanner alone.

// ---------------------------------------------------------------------
// 79. Dependency security and least privilege
// ---------------------------------------------------------------------

export interface DependencyPrivilegeModel {
  readonly browserAccess: boolean;
  readonly serverAccess: boolean;
  readonly buildSecretAccess: boolean;
  readonly productionInfrastructureAccess: boolean;
}

export const dependencyPrivilegeModel: DependencyPrivilegeModel = {
  browserAccess: true,
  serverAccess: false,
  buildSecretAccess: false,
  productionInfrastructureAccess: false,
};

// Dependencies should receive only the capabilities their execution
// context requires.
//
// Least privilege reduces the potential impact of a compromised package.

// ---------------------------------------------------------------------
// 80. Final integrated example
// ---------------------------------------------------------------------

export interface SecureDependencyConfiguration {
  readonly packageName: string;
  readonly version: string;
  readonly purpose: string;
  readonly maintained: boolean;
  readonly audited: boolean;
  readonly lockfileTracked: boolean;
}

export const secureDependencyConfiguration: SecureDependencyConfiguration = {
  packageName: "example-validation-library",
  version: "2.4.1",
  purpose: "Runtime request validation",
  maintained: true,
  audited: true,
  lockfileTracked: true,
};

// The secure dependency model is:
//
// necessary dependency
//        |
//        v
// approved source
//        |
//        v
// integrity / provenance checks
//        |
//        v
// locked dependency tree
//        |
//        v
// vulnerability monitoring
//        |
//        v
// reviewed updates
//        |
//        v
// least-privileged execution
//        |
//        v
// continuous monitoring and remediation
//
// No individual layer guarantees that a dependency is safe. The goal is to
// reduce the likelihood and impact of dependency compromise through
// defense in depth.

export default DependencyAwareForm;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Dependencies are part of the application's software supply chain and can affect application security.
// - Security review must include direct, transitive, runtime, server, browser, build, and development dependencies where relevant.
// - A dependency vulnerability does not automatically mean the application is exploitable, but every relevant advisory should be assessed and tracked.
// - Lockfiles record resolved dependency versions and relationships and support reproducible dependency installation.
// - Dependency manifests and lockfiles should be reviewed together when dependency changes are introduced.
// - Regular vulnerability auditing helps identify newly disclosed issues in previously installed dependencies.
// - Automated audit fixes can help with remediation, but dependency changes still require testing and review.
// - Dependency maintenance status matters because unsupported components may remain exposed to unresolved security problems.
// - Unnecessary dependencies increase the amount of third-party software that must be maintained and trusted.
// - Package integrity mechanisms can detect unexpected artifact changes but do not prove that a package is benign.
// - Package provenance and release verification provide additional supply-chain signals where the ecosystem supports them.
// - Typosquatting and dependency-confusion risks make package names, registries, scopes, and sources important security considerations.
// - Installation scripts and build tools can execute with significant privileges and should be treated as security-sensitive.
// - CI environments should not expose production credentials to dependency installation, testing, or untrusted pull-request code unless strictly required.
// - Dependency changes should be reviewed for direct and transitive changes, vulnerabilities, behavior, and generated artifacts.
// - Dependency graphs and SBOMs can provide useful inventories of the software components present in an application.
// - Vulnerable dependencies should generally be upgraded, replaced, removed, or mitigated according to their actual exposure and available remediation.
// - If no patch exists, the organization should document mitigations and continue monitoring rather than treating the vulnerability as permanently resolved.
// - A suspected dependency compromise may require credential rotation in addition to replacing the affected package.
// - Browser dependencies become part of the client-side security surface, while server dependencies may inherit access to server-side resources.
// - React does not make third-party dependencies trustworthy; dependency security remains a software supply-chain responsibility.
// - Dependency security is defense in depth across package selection, source verification, dependency resolution, build security, deployment, monitoring, and incident response.
