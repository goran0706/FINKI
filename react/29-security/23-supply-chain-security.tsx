/**
 * Supply Chain Security
 * ======================
 *
 * Software supply chain security protects the path from source code and third-party dependencies
 * through development, build, packaging, release, distribution, and deployment. The goal is to
 * prevent unauthorized changes, compromised tooling, malicious dependencies, leaked credentials,
 * and other attacks that can cause untrusted code or artifacts to enter an application.
 *
 * Supply chain security extends beyond dependency scanning. It includes source control, developer
 * access, CI/CD isolation, dependency integrity, build provenance, artifact verification, release
 * controls, and incident response.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What the software supply chain is
// ---------------------------------------------------------------------

// A software supply chain is the collection of people, systems, code,
// dependencies, tools, processes, and artifacts involved in producing and
// delivering software.
//
// A simplified flow is:
//
// source code
//     |
//     v
// dependencies
//     |
//     v
// build environment
//     |
//     v
// build artifact
//     |
//     v
// release
//     |
//     v
// deployment

// ---------------------------------------------------------------------
// 2. Supply chain security is broader than dependency security
// ---------------------------------------------------------------------

export interface SupplyChainLayers {
  readonly source: boolean;
  readonly dependencies: boolean;
  readonly build: boolean;
  readonly artifacts: boolean;
  readonly release: boolean;
  readonly deployment: boolean;
}

export const supplyChainLayers: SupplyChainLayers = {
  source: true,
  dependencies: true,
  build: true,
  artifacts: true,
  release: true,
  deployment: true,
};

// Dependency security protects one part of the chain.
//
// Supply chain security considers the complete path by which software
// becomes something users eventually execute.

// ---------------------------------------------------------------------
// 3. The trust chain
// ---------------------------------------------------------------------

export const trustChain = [
  "Source repository",
  "Dependency sources",
  "Build configuration",
  "Build platform",
  "Build inputs",
  "Build artifact",
  "Release process",
  "Distribution channel",
  "Deployment environment",
] as const;

// Each stage introduces trust assumptions.
//
// Security controls should make those assumptions explicit and reduce the
// number of places where unauthorized changes can occur.

// ---------------------------------------------------------------------
// 4. Supply chain integrity
// ---------------------------------------------------------------------

export interface IntegrityProperty {
  readonly property: string;
  readonly goal: string;
}

export const integrityProperties: readonly IntegrityProperty[] = [
  {
    property: "Authenticity",
    goal: "Know which trusted source or system produced an artifact.",
  },
  {
    property: "Integrity",
    goal: "Detect or prevent unauthorized modification.",
  },
  {
    property: "Traceability",
    goal: "Connect an artifact to its source and build inputs.",
  },
];

// A secure supply chain should make it possible to answer:
//
// "What is this artifact, where did it come from, and how was it produced?"

// ---------------------------------------------------------------------
// 5. Threat model
// ---------------------------------------------------------------------

export type SupplyChainThreat =
  | "compromised-dependency"
  | "malicious-package"
  | "dependency-confusion"
  | "typosquatting"
  | "compromised-account"
  | "compromised-build"
  | "artifact-tampering"
  | "stolen-signing-key"
  | "ci-credential-theft"
  | "malicious-release";

export const supplyChainThreats: readonly SupplyChainThreat[] = [
  "compromised-dependency",
  "malicious-package",
  "dependency-confusion",
  "typosquatting",
  "compromised-account",
  "compromised-build",
  "artifact-tampering",
  "stolen-signing-key",
  "ci-credential-theft",
  "malicious-release",
];

// Threats can occur at different points in the lifecycle.
//
// Defense therefore needs multiple independent controls.

// ---------------------------------------------------------------------
// 6. Source repositories are security boundaries
// ---------------------------------------------------------------------

export interface RepositorySecurity {
  readonly branchProtection: boolean;
  readonly protectedReleaseBranches: boolean;
  readonly reviewedChanges: boolean;
}

export const repositorySecurity: RepositorySecurity = {
  branchProtection: true,
  protectedReleaseBranches: true,
  reviewedChanges: true,
};

// Source control contains the instructions from which software is built.
//
// Unauthorized source changes can therefore become unauthorized software
// changes.

// ---------------------------------------------------------------------
// 7. Protect source changes
// ---------------------------------------------------------------------

export interface SourceChangePolicy {
  readonly reviewRequired: boolean;
  readonly statusChecksRequired: boolean;
  readonly directPushToProtectedBranch: boolean;
}

export const sourceChangePolicy: SourceChangePolicy = {
  reviewRequired: true,
  statusChecksRequired: true,
  directPushToProtectedBranch: false,
};

// Controls such as protected branches, required reviews, and required CI
// checks can reduce the chance that an unauthorized change reaches a
// protected branch.

// ---------------------------------------------------------------------
// 8. Least privilege for repository access
// ---------------------------------------------------------------------

export interface RepositoryAccess {
  readonly readAccess: boolean;
  readonly writeAccess: boolean;
  readonly administrativeAccess: boolean;
}

export const repositoryAccess: RepositoryAccess = {
  readAccess: true,
  writeAccess: false,
  administrativeAccess: false,
};

// Most contributors do not need administrative permissions.
//
// Access should be granted according to the minimum capability required.

// ---------------------------------------------------------------------
// 9. Developer account security
// ---------------------------------------------------------------------

export interface DeveloperAccountSecurity {
  readonly multiFactorAuthentication: boolean;
  readonly strongAuthentication: boolean;
  readonly staleAccountsRemoved: boolean;
}

export const developerAccountSecurity: DeveloperAccountSecurity = {
  multiFactorAuthentication: true,
  strongAuthentication: true,
  staleAccountsRemoved: true,
};

// A compromised developer account can become a supply chain compromise if
// the account can modify source, releases, or build configuration.

// ---------------------------------------------------------------------
// 10. CI/CD accounts are high-value identities
// ---------------------------------------------------------------------

export interface CiIdentity {
  readonly sourceAccess: boolean;
  readonly deploymentAccess: boolean;
  readonly signingAccess: boolean;
}

export const ciIdentity: CiIdentity = {
  sourceAccess: true,
  deploymentAccess: true,
  signingAccess: false,
};

// CI identities should receive only the permissions required by their job.
//
// Signing and deployment permissions should be separated where practical.

// ---------------------------------------------------------------------
// 11. CI/CD is part of the security boundary
// ---------------------------------------------------------------------

// CI/CD systems can:
//
// - fetch source code
// - install dependencies
// - execute scripts
// - access build secrets
// - create artifacts
// - publish packages
// - deploy applications
//
// A compromised CI environment can therefore affect software before it
// reaches production.

// ---------------------------------------------------------------------
// 12. Isolate build jobs
// ---------------------------------------------------------------------

export interface BuildIsolation {
  readonly isolatedWorkers: boolean;
  readonly workspaceIsolation: boolean;
  readonly crossJobStateBlocked: boolean;
}

export const buildIsolation: BuildIsolation = {
  isolatedWorkers: true,
  workspaceIsolation: true,
  crossJobStateBlocked: true,
};

// Build jobs should not be able to unexpectedly influence unrelated jobs.
//
// Isolation reduces the impact of compromised build steps and prevents
// unintended state from crossing trust boundaries.

// ---------------------------------------------------------------------
// 13. Untrusted pull requests
// ---------------------------------------------------------------------

export interface PullRequestBuildPolicy {
  readonly untrustedCodeCanRun: boolean;
  readonly productionSecretsExposed: boolean;
  readonly deploymentPermissionsGranted: boolean;
}

export const pullRequestBuildPolicy: PullRequestBuildPolicy = {
  untrustedCodeCanRun: true,
  productionSecretsExposed: false,
  deploymentPermissionsGranted: false,
};

// Pull-request code can contain arbitrary changes, including changes to
// package scripts and build configuration.
//
// Do not automatically treat pull-request code as trusted code.

// ---------------------------------------------------------------------
// 14. CI secrets
// ---------------------------------------------------------------------

export interface CiSecretPolicy {
  readonly productionSecretsAvailableByDefault: boolean;
  readonly secretsScopedToJobs: boolean;
  readonly secretsRotatable: boolean;
}

export const ciSecretPolicy: CiSecretPolicy = {
  productionSecretsAvailableByDefault: false,
  secretsScopedToJobs: true,
  secretsRotatable: true,
};

// Secrets should be available only to jobs that genuinely require them.
//
// A compromised build step should not automatically receive every secret
// used by the deployment system.

// ---------------------------------------------------------------------
// 15. Dependency sources
// ---------------------------------------------------------------------

export interface DependencySource {
  readonly registry: string;
  readonly approved: boolean;
}

export const dependencySource: DependencySource = {
  registry: "example-registry",
  approved: true,
};

// Dependencies should come from known and controlled sources.
//
// Private package registries should have explicit authentication, scope,
// and access policies.

// ---------------------------------------------------------------------
// 16. Dependency confusion
// ---------------------------------------------------------------------

export interface RegistryPolicy {
  readonly privateScopes: readonly string[];
  readonly approvedRegistries: readonly string[];
}

export const registryPolicy: RegistryPolicy = {
  privateScopes: ["@example"],
  approvedRegistries: ["example-registry"],
};

// Dependency confusion can occur when a package manager resolves a package
// from an unintended source.
//
// Explicit registry and scope configuration can reduce this risk.

// ---------------------------------------------------------------------
// 17. Typosquatting
// ---------------------------------------------------------------------

export const packageSelectionChecks = [
  "Verify the exact package name",
  "Verify the intended registry",
  "Review package ownership",
  "Review release history",
  "Review package purpose",
] as const;

// A package with a name similar to a legitimate package may be malicious or
// simply unrelated to the intended software.
//
// Package selection is therefore a security decision.

// ---------------------------------------------------------------------
// 18. Dependency integrity
// ---------------------------------------------------------------------

export interface DependencyIntegrity {
  readonly lockfileTracked: boolean;
  readonly integrityMetadataVerified: boolean;
  readonly unexpectedChangesDetected: boolean;
}

export const dependencyIntegrity: DependencyIntegrity = {
  lockfileTracked: true,
  integrityMetadataVerified: true,
  unexpectedChangesDetected: false,
};

// Lockfiles and package-integrity mechanisms help establish what was
// resolved and whether downloaded package contents match expected data.
//
// They do not prove that the package itself is trustworthy.

// ---------------------------------------------------------------------
// 19. Dependency graph
// ---------------------------------------------------------------------

export interface DependencyGraphNode {
  readonly name: string;
  readonly version: string;
  readonly dependencies: readonly DependencyGraphNode[];
}

export const dependencyGraph: DependencyGraphNode = {
  name: "example-application",
  version: "1.0.0",
  dependencies: [
    {
      name: "example-library",
      version: "2.4.1",
      dependencies: [
        {
          name: "example-parser",
          version: "3.1.3",
          dependencies: [],
        },
      ],
    },
  ],
};

// The complete dependency graph matters because a compromised or vulnerable
// transitive dependency can affect an application without appearing as a
// direct dependency.

// ---------------------------------------------------------------------
// 20. Build inputs
// ---------------------------------------------------------------------

export interface BuildInputs {
  readonly sourceRevision: string;
  readonly dependencyLockfile: string;
  readonly buildConfiguration: string;
}

export const buildInputs: BuildInputs = {
  sourceRevision: "example-commit",
  dependencyLockfile: "example-lockfile",
  buildConfiguration: "example-build-config",
};

// A build should have identifiable inputs.
//
// Knowing the inputs makes an artifact easier to reproduce, investigate,
// and verify.

// ---------------------------------------------------------------------
// 21. Build provenance
// ---------------------------------------------------------------------

export interface BuildProvenance {
  readonly sourceRevision: string;
  readonly builder: string;
  readonly buildCommand: string;
  readonly artifactDigest: string;
}

export const buildProvenance: BuildProvenance = {
  sourceRevision: "example-commit",
  builder: "example-build-service",
  buildCommand: "npm run build",
  artifactDigest: "sha256:example-digest",
};

// Provenance describes how an artifact was produced and connects the
// resulting artifact to relevant build inputs.
//
// Modern supply-chain frameworks such as SLSA use provenance as a central
// mechanism for establishing this relationship.

// ---------------------------------------------------------------------
// 22. Artifact digests
// ---------------------------------------------------------------------

export interface ArtifactIdentity {
  readonly artifactName: string;
  readonly digestAlgorithm: "sha256";
  readonly digest: string;
}

export const artifactIdentity: ArtifactIdentity = {
  artifactName: "example-application.tar",
  digestAlgorithm: "sha256",
  digest: "example-digest",
};

// A cryptographic digest identifies the exact bytes of an artifact.
//
// A digest does not by itself establish who created the artifact.

// ---------------------------------------------------------------------
// 23. Integrity versus authenticity
// ---------------------------------------------------------------------

export interface ArtifactTrust {
  readonly integrityVerified: boolean;
  readonly publisherAuthenticated: boolean;
}

export const artifactTrust: ArtifactTrust = {
  integrityVerified: true,
  publisherAuthenticated: true,
};

// Integrity answers:
//
// "Are these the same bytes?"
//
// Authenticity answers:
//
// "Did the expected trusted party or system produce them?"
//
// Strong supply-chain controls consider both properties.

// ---------------------------------------------------------------------
// 24. Artifact signing
// ---------------------------------------------------------------------

export interface ArtifactSignature {
  readonly algorithm: string;
  readonly signatureVerified: boolean;
  readonly signer: string;
}

export const artifactSignature: ArtifactSignature = {
  algorithm: "example-signature-algorithm",
  signatureVerified: true,
  signer: "example-release-system",
};

// Signing can provide evidence about the identity associated with an
// artifact or attestation.
//
// Signing keys must themselves be protected because a stolen signing key
// can undermine the trust placed in signed artifacts.

// ---------------------------------------------------------------------
// 25. Protect signing keys
// ---------------------------------------------------------------------

export interface SigningKeySecurity {
  readonly storedOutsideSourceCode: boolean;
  readonly accessRestricted: boolean;
  readonly rotationSupported: boolean;
}

export const signingKeySecurity: SigningKeySecurity = {
  storedOutsideSourceCode: true,
  accessRestricted: true,
  rotationSupported: true,
};

// Signing keys should not be committed to source control.
//
// Access to signing keys should be restricted to the release operations
// that genuinely require signing.

// ---------------------------------------------------------------------
// 26. Build provenance verification
// ---------------------------------------------------------------------

export interface ProvenanceVerification {
  readonly sourceMatchesExpected: boolean;
  readonly builderMatchesExpected: boolean;
  readonly inputsMatchExpected: boolean;
  readonly artifactMatchesDigest: boolean;
}

export const provenanceVerification: ProvenanceVerification = {
  sourceMatchesExpected: true,
  builderMatchesExpected: true,
  inputsMatchExpected: true,
  artifactMatchesDigest: true,
};

// Provenance is useful only when consumers verify the properties they care
// about.
//
// A provenance record that nobody checks provides limited security value.

// ---------------------------------------------------------------------
// 27. SLSA
// ---------------------------------------------------------------------

export type SlsaTrack = "build" | "source";

export const slsaTracks: readonly SlsaTrack[] = ["build", "source"];

// SLSA 1.2 defines separate Build and Source tracks.
//
// The Build track focuses on increasing confidence in artifact provenance
// and protection against build-related tampering.

// ---------------------------------------------------------------------
// 28. SLSA build levels
// ---------------------------------------------------------------------

export interface SlsaBuildLevel {
  readonly level: "L0" | "L1" | "L2" | "L3";
  readonly focus: string;
}

export const slsaBuildLevels: readonly SlsaBuildLevel[] = [
  {
    level: "L0",
    focus: "No SLSA build guarantees",
  },
  {
    level: "L1",
    focus: "Provenance exists",
  },
  {
    level: "L2",
    focus: "Hosted build platform with authenticated provenance",
  },
  {
    level: "L3",
    focus: "Hardened build platform",
  },
];

// These levels represent increasing guarantees around build provenance and
// build integrity.
//
// A SLSA level is not a universal security score for an entire application.

// ---------------------------------------------------------------------
// 29. SLSA is not a guarantee that every dependency is safe
// ---------------------------------------------------------------------

export interface SlsaDependencyBoundary {
  readonly artifactProvenanceAvailable: boolean;
  readonlyDependencySecurityAutomaticallyGuaranteed: boolean;
}

export const slsaDependencyBoundary: SlsaDependencyBoundary = {
  artifactProvenanceAvailable: true,
  readonlyDependencySecurityAutomaticallyGuaranteed: false,
};

// Supply-chain controls address specific threats.
//
// Provenance for one artifact does not automatically establish the security
// of every dependency included in that artifact.

// ---------------------------------------------------------------------
// 30. Reproducible builds
// ---------------------------------------------------------------------

export interface ReproducibleBuild {
  readonly sameInputs: boolean;
  readonly sameExpectedOutput: boolean;
  readonly independentVerificationPossible: boolean;
}

export const reproducibleBuild: ReproducibleBuild = {
  sameInputs: true,
  sameExpectedOutput: true,
  independentVerificationPossible: true,
};

// Reproducible builds can make it easier to independently verify that an
// artifact corresponds to expected source and build inputs.
//
// Reproducibility and provenance provide related but distinct controls.

// ---------------------------------------------------------------------
// 31. Hermetic builds
// ---------------------------------------------------------------------

export interface HermeticBuild {
  readonly undeclaredNetworkInputsBlocked: boolean;
  readonly undeclaredFilesystemInputsBlocked: boolean;
  readonly declaredInputsKnown: boolean;
}

export const hermeticBuild: HermeticBuild = {
  undeclaredNetworkInputsBlocked: true,
  undeclaredFilesystemInputsBlocked: true,
  declaredInputsKnown: true,
};

// A hermetic build limits unexpected external inputs.
//
// Reducing undeclared inputs makes the build process easier to reason about
// and verify.

// ---------------------------------------------------------------------
// 32. Build environment security
// ---------------------------------------------------------------------

export interface BuildEnvironment {
  readonly isolated: boolean;
  readonly patched: boolean;
  readonly minimal: boolean;
  readonly monitored: boolean;
}

export const buildEnvironment: BuildEnvironment = {
  isolated: true,
  patched: true,
  minimal: true,
  monitored: true,
};

// The build environment itself is part of the trusted computing base.
//
// Compromise of the build environment can affect every artifact produced
// there.

// ---------------------------------------------------------------------
// 33. Build contamination
// ---------------------------------------------------------------------

export interface BuildContamination {
  readonly previousWorkspaceStateCanPersist: boolean;
  readonly jobsCanShareWritableState: boolean;
}

export const buildContamination: BuildContamination = {
  previousWorkspaceStateCanPersist: false,
  jobsCanShareWritableState: false,
};

// Reusing mutable build state can allow one build to influence another.
//
// Clean and isolated workspaces reduce this class of risk.

// ---------------------------------------------------------------------
// 34. Build-time dependencies
// ---------------------------------------------------------------------

export interface BuildDependency {
  readonly name: string;
  readonly executesDuringBuild: boolean;
  readonly accessToSource: boolean;
}

export const buildDependency: BuildDependency = {
  name: "example-build-tool",
  executesDuringBuild: true,
  accessToSource: true,
};

// Build-time dependencies are part of the supply chain even when they are
// never shipped to end users.

// ---------------------------------------------------------------------
// 35. Installation scripts
// ---------------------------------------------------------------------

export interface InstallationScriptRisk {
  readonly packageCanExecuteInstallScript: boolean;
  readonly scriptReviewRequired: boolean;
}

export const installationScriptRisk: InstallationScriptRisk = {
  packageCanExecuteInstallScript: true,
  scriptReviewRequired: true,
};

// Package installation can execute package-defined lifecycle behavior in
// ecosystems that support installation scripts.
//
// CI and developer environments should account for this execution.

// ---------------------------------------------------------------------
// 36. Minimize CI privileges
// ---------------------------------------------------------------------

export interface CiPrivileges {
  readonly sourceWrite: boolean;
  readonly deploymentWrite: boolean;
  readonly signingWrite: boolean;
  readonly productionSecretRead: boolean;
}

export const ciPrivileges: CiPrivileges = {
  sourceWrite: false,
  deploymentWrite: true,
  signingWrite: false,
  productionSecretRead: false,
};

// A build job should not automatically receive every permission required
// by the overall software delivery system.

// ---------------------------------------------------------------------
// 37. Separate build and deployment
// ---------------------------------------------------------------------

export interface PipelineSeparation {
  readonly buildCreatesArtifact: boolean;
  readonly deploymentConsumesArtifact: boolean;
  readonly buildCanDirectlyModifyProduction: boolean;
}

export const pipelineSeparation: PipelineSeparation = {
  buildCreatesArtifact: true,
  deploymentConsumesArtifact: true,
  buildCanDirectlyModifyProduction: false,
};

// Separating artifact creation from deployment can reduce the number of
// systems that require production permissions.

// ---------------------------------------------------------------------
// 38. Promote immutable artifacts
// ---------------------------------------------------------------------

export interface ArtifactPromotion {
  readonly builtOnce: boolean;
  readonly sameArtifactPromoted: boolean;
  readonly rebuiltForProduction: boolean;
}

export const artifactPromotion: ArtifactPromotion = {
  builtOnce: true,
  sameArtifactPromoted: true,
  rebuiltForProduction: false,
};

// Promoting the same verified artifact between environments avoids
// silently changing software by rebuilding it differently for production.

// ---------------------------------------------------------------------
// 39. Release authorization
// ---------------------------------------------------------------------

export interface ReleaseAuthorization {
  readonly releaseRequiresApproval: boolean;
  readonly releaseIdentityProtected: boolean;
  readonly releaseArtifactVerified: boolean;
}

export const releaseAuthorization: ReleaseAuthorization = {
  releaseRequiresApproval: true,
  releaseIdentityProtected: true,
  releaseArtifactVerified: true,
};

// Release permissions should be separated from ordinary development
// permissions where practical.

// ---------------------------------------------------------------------
// 40. Package publishing
// ---------------------------------------------------------------------

export interface PackagePublishing {
  readonly publishingAccountProtected: boolean;
  readonly publicationRequiresTrustedWorkflow: boolean;
  readonly publishedArtifactVerified: boolean;
}

export const packagePublishing: PackagePublishing = {
  publishingAccountProtected: true,
  publicationRequiresTrustedWorkflow: true,
  publishedArtifactVerified: true,
};

// Publishing credentials are high-value supply-chain credentials.
//
// Compromise can allow attackers to distribute malicious versions to
// downstream consumers.

// ---------------------------------------------------------------------
// 41. Release provenance
// ---------------------------------------------------------------------

export interface ReleaseRecord {
  readonly sourceRevision: string;
  readonly artifactDigest: string;
  readonly releaseIdentity: string;
  readonly releaseTime: string;
}

export const releaseRecord: ReleaseRecord = {
  sourceRevision: "example-commit",
  artifactDigest: "sha256:example-digest",
  releaseIdentity: "example-release-system",
  releaseTime: "2026-09-29T00:00:00Z",
};

// Release records should connect a published artifact to its source,
// identity, and relevant build information.

// ---------------------------------------------------------------------
// 42. Artifact repository security
// ---------------------------------------------------------------------

export interface ArtifactRepository {
  readonly writeAccessRestricted: boolean;
  readonly immutableReleases: boolean;
  readonly accessAudited: boolean;
}

export const artifactRepository: ArtifactRepository = {
  writeAccessRestricted: true,
  immutableReleases: true,
  accessAudited: true,
};

// Once a release artifact has been approved, allowing arbitrary replacement
// of the same release can undermine integrity expectations.

// ---------------------------------------------------------------------
// 43. Distribution security
// ---------------------------------------------------------------------

export interface DistributionChannel {
  readonly transportProtected: boolean;
  readonly artifactIntegrityVerified: boolean;
  readonly sourceAuthenticated: boolean;
}

export const distributionChannel: DistributionChannel = {
  transportProtected: true,
  artifactIntegrityVerified: true,
  sourceAuthenticated: true,
};

// Distribution is another trust boundary.
//
// Consumers need a way to determine whether the artifact they received is
// the artifact that was intended for release.

// ---------------------------------------------------------------------
// 44. Deployment verification
// ---------------------------------------------------------------------

export interface DeploymentVerification {
  readonly expectedArtifactDigest: string;
  readonly deployedArtifactDigest: string;
  readonly digestMatches: boolean;
}

export const deploymentVerification: DeploymentVerification = {
  expectedArtifactDigest: "sha256:example-digest",
  deployedArtifactDigest: "sha256:example-digest",
  digestMatches: true,
};

// Deployment systems can verify that the artifact being deployed matches
// the approved artifact identity.

// ---------------------------------------------------------------------
// 45. Environment separation
// ---------------------------------------------------------------------

export interface EnvironmentSeparation {
  readonly development: boolean;
  readonly staging: boolean;
  readonly production: boolean;
  readonly credentialsSeparated: boolean;
}

export const environmentSeparation: EnvironmentSeparation = {
  development: true,
  staging: true,
  production: true,
  credentialsSeparated: true,
};

// Development and test environments should not automatically have access to
// production credentials or infrastructure.

// ---------------------------------------------------------------------
// 46. Secret rotation after compromise
// ---------------------------------------------------------------------

export interface CompromiseResponse {
  readonly affectedDependencyRemoved: boolean;
  readonly affectedArtifactsRebuilt: boolean;
  readonly credentialsRotated: boolean;
  readonly deploymentsReviewed: boolean;
}

export const compromiseResponse: CompromiseResponse = {
  affectedDependencyRemoved: true,
  affectedArtifactsRebuilt: true,
  credentialsRotated: true,
  deploymentsReviewed: true,
};

// If malicious code may have executed in a privileged environment, replacing
// the package alone may not be sufficient.
//
// Credentials available to the compromised process may also require
// rotation.

// ---------------------------------------------------------------------
// 47. Software bill of materials
// ---------------------------------------------------------------------

export interface SoftwareBillOfMaterials {
  readonly generated: boolean;
  readonly includesDependencies: boolean;
  readonly associatedWithArtifact: boolean;
}

export const softwareBillOfMaterials: SoftwareBillOfMaterials = {
  generated: true,
  includesDependencies: true,
  associatedWithArtifact: true,
};

// An SBOM provides an inventory of software components associated with an
// artifact.
//
// It can support vulnerability response and software inventory management.

// ---------------------------------------------------------------------
// 48. SBOM does not prove security
// ---------------------------------------------------------------------

export interface SbomLimitation {
  readonly componentsIdentified: boolean;
  readonly componentsAutomaticallySafe: boolean;
}

export const sbomLimitation: SbomLimitation = {
  componentsIdentified: true,
  componentsAutomaticallySafe: false,
};

// An SBOM tells you what components are present.
//
// It does not prove that those components are secure, maintained, or free
// from malicious behavior.

// ---------------------------------------------------------------------
// 49. Vulnerability monitoring
// ---------------------------------------------------------------------

export interface SupplyChainMonitoring {
  readonly dependencyAdvisories: boolean;
  readonly compromisedReleaseAlerts: boolean;
  readonly buildFailures: boolean;
  readonly deploymentAnomalies: boolean;
}

export const supplyChainMonitoring: SupplyChainMonitoring = {
  dependencyAdvisories: true,
  compromisedReleaseAlerts: true,
  buildFailures: true,
  deploymentAnomalies: true,
};

// Monitoring should continue after software has been released because a
// vulnerability or compromise can become known later.

// ---------------------------------------------------------------------
// 50. Security response workflow
// ---------------------------------------------------------------------

export type SupplyChainIncidentStep =
  "detect" | "identify" | "contain" | "verify" | "rebuild" | "rotate" | "redeploy" | "document";

export const supplyChainIncidentWorkflow: readonly SupplyChainIncidentStep[] = [
  "detect",
  "identify",
  "contain",
  "verify",
  "rebuild",
  "rotate",
  "redeploy",
  "document",
];

// Incident response should account for both the affected artifact and the
// systems and credentials that could have been exposed while producing it.

// ---------------------------------------------------------------------
// 51. Detecting unauthorized source changes
// ---------------------------------------------------------------------

export interface SourceIntegrityCheck {
  readonly expectedRevision: string;
  readonly observedRevision: string;
  readonly matches: boolean;
}

export const sourceIntegrityCheck: SourceIntegrityCheck = {
  expectedRevision: "example-commit",
  observedRevision: "example-commit",
  matches: true,
};

// Release automation should know which source revision it is expected to
// build.

// ---------------------------------------------------------------------
// 52. Detecting unauthorized artifact changes
// ---------------------------------------------------------------------

export interface ArtifactIntegrityCheck {
  readonly expectedDigest: string;
  readonly observedDigest: string;
  readonly matches: boolean;
}

export const artifactIntegrityCheck: ArtifactIntegrityCheck = {
  expectedDigest: "sha256:example-digest",
  observedDigest: "sha256:example-digest",
  matches: true,
};

// A digest mismatch means the observed artifact is not byte-for-byte
// identical to the expected artifact.

// ---------------------------------------------------------------------
// 53. Audit logs
// ---------------------------------------------------------------------

export interface SupplyChainAuditLog {
  readonly sourceChangesLogged: boolean;
  readonly buildEventsLogged: boolean;
  readonly releaseEventsLogged: boolean;
  readonly deploymentEventsLogged: boolean;
}

export const supplyChainAuditLog: SupplyChainAuditLog = {
  sourceChangesLogged: true,
  buildEventsLogged: true,
  releaseEventsLogged: true,
  deploymentEventsLogged: true,
};

// Audit logs provide evidence for investigating who or what changed a
// supply-chain component and when.

// ---------------------------------------------------------------------
// 54. Alert on sensitive actions
// ---------------------------------------------------------------------

export const sensitiveSupplyChainActions = [
  "Change protected build configuration",
  "Modify release workflow",
  "Change signing configuration",
  "Publish a package",
  "Deploy a production artifact",
  "Change production deployment credentials",
] as const;

// Sensitive supply-chain actions deserve stronger monitoring and access
// controls than ordinary development activity.

// ---------------------------------------------------------------------
// 55. Review build configuration
// ---------------------------------------------------------------------

export interface BuildConfigurationReview {
  readonly dependenciesReviewed: boolean;
  readonly scriptsReviewed: boolean;
  readonly permissionsReviewed: boolean;
  readonly secretUsageReviewed: boolean;
}

export const buildConfigurationReview: BuildConfigurationReview = {
  dependenciesReviewed: true,
  scriptsReviewed: true,
  permissionsReviewed: true,
  secretUsageReviewed: true,
};

// Build configuration is executable security-sensitive infrastructure.
//
// Changes to CI workflows and build scripts should receive appropriate
// review.

// ---------------------------------------------------------------------
// 56. Prevent unauthorized workflow changes
// ---------------------------------------------------------------------

export interface WorkflowProtection {
  readonly workflowChangesReviewed: boolean;
  readonly protectedBranchesUsed: boolean;
  readonly deploymentPermissionsRestricted: boolean;
}

export const workflowProtection: WorkflowProtection = {
  workflowChangesReviewed: true,
  protectedBranchesUsed: true,
  deploymentPermissionsRestricted: true,
};

// A malicious workflow change can bypass application-level controls by
// changing how the software is built or released.

// ---------------------------------------------------------------------
// 57. Third-party build actions and tools
// ---------------------------------------------------------------------

export interface BuildTool {
  readonly name: string;
  readonly trustedSource: boolean;
  readonly versionControlled: boolean;
}

export const buildTool: BuildTool = {
  name: "example-build-action",
  trustedSource: true,
  versionControlled: true,
};

// Third-party build actions execute inside the CI trust boundary.
//
// Their source, version, permissions, and update process should therefore
// be reviewed.

// ---------------------------------------------------------------------
// 58. Pinning build dependencies
// ---------------------------------------------------------------------

export interface BuildToolReference {
  readonly tool: string;
  readonly reference: string;
  readonly mutableReference: boolean;
}

export const buildToolReference: BuildToolReference = {
  tool: "example-build-action",
  reference: "example-immutable-reference",
  mutableReference: false,
};

// Referencing a mutable tag can allow the code executed by CI to change
// without an obvious change to the workflow file.
//
// Immutable references can improve reproducibility and reviewability.

// ---------------------------------------------------------------------
// 59. Build network access
// ---------------------------------------------------------------------

export interface BuildNetworkPolicy {
  readonly unrestrictedOutboundNetwork: boolean;
  readonly approvedEndpoints: readonly string[];
}

export const buildNetworkPolicy: BuildNetworkPolicy = {
  unrestrictedOutboundNetwork: false,
  approvedEndpoints: ["example-package-registry"],
};

// Limiting unnecessary build-time network access can reduce the ability of
// compromised build steps to retrieve additional payloads or exfiltrate
// sensitive data.

// ---------------------------------------------------------------------
// 60. Build output validation
// ---------------------------------------------------------------------

export interface BuildOutputValidation {
  readonly artifactExists: boolean;
  readonly expectedFilesPresent: boolean;
  readonly unexpectedFilesRejected: boolean;
}

export const buildOutputValidation: BuildOutputValidation = {
  artifactExists: true,
  expectedFilesPresent: true,
  unexpectedFilesRejected: true,
};

// The build system should validate that generated artifacts contain what
// is expected and do not unexpectedly contain sensitive or executable
// material.

// ---------------------------------------------------------------------
// 61. Prevent secrets from entering artifacts
// ---------------------------------------------------------------------

export interface ArtifactSecretCheck {
  readonly sourceSecretsScanned: boolean;
  readonly bundleSecretsScanned: boolean;
  readonly artifactsReviewed: boolean;
}

export const artifactSecretCheck: ArtifactSecretCheck = {
  sourceSecretsScanned: true,
  bundleSecretsScanned: true,
  artifactsReviewed: true,
};

// Build pipelines should prevent credentials and other confidential
// configuration from being embedded into distributable artifacts.

// ---------------------------------------------------------------------
// 62. Source maps and release artifacts
// ---------------------------------------------------------------------

export interface ReleaseArtifactPolicy {
  readonly publicSourceMapsReviewed: boolean;
  readonly privateArtifactsControlled: boolean;
}

export const releaseArtifactPolicy: ReleaseArtifactPolicy = {
  publicSourceMapsReviewed: true,
  privateArtifactsControlled: true,
};

// Generated artifacts can contain information that was not present in the
// final application UI.
//
// Release contents should therefore be reviewed as part of the supply chain.

// ---------------------------------------------------------------------
// 63. Release channels
// ---------------------------------------------------------------------

export type ReleaseChannel = "development" | "staging" | "production";

export const releaseChannels: readonly ReleaseChannel[] = ["development", "staging", "production"];

// Separate release channels can provide controlled promotion paths between
// environments.

// ---------------------------------------------------------------------
// 64. Production deployment approval
// ---------------------------------------------------------------------

export interface ProductionApproval {
  readonly required: boolean;
  readonly artifactAlreadyVerified: boolean;
}

export const productionApproval: ProductionApproval = {
  required: true,
  artifactAlreadyVerified: true,
};

// Approval should apply to the specific artifact being deployed rather than
// merely approving an arbitrary rebuild.

// ---------------------------------------------------------------------
// 65. Rollback capability
// ---------------------------------------------------------------------

export interface RollbackCapability {
  readonly previousArtifactKnown: boolean;
  readonly previousArtifactVerified: boolean;
  readonly rollbackAutomated: boolean;
}

export const rollbackCapability: RollbackCapability = {
  previousArtifactKnown: true,
  previousArtifactVerified: true,
  rollbackAutomated: true,
};

// Supply-chain incidents can require rapid removal of a compromised
// artifact.
//
// A verified previous artifact provides a known deployment target.

// ---------------------------------------------------------------------
// 66. Dependency compromise example
// ---------------------------------------------------------------------

export interface DependencyCompromise {
  readonly dependency: string;
  readonly compromisedVersion: string;
  readonly affectedBuilds: readonly string[];
}

export const dependencyCompromise: DependencyCompromise = {
  dependency: "example-package",
  compromisedVersion: "4.2.0",
  affectedBuilds: ["example-build-101", "example-build-102"],
};

// An incident investigation should identify which builds consumed the
// affected dependency rather than assuming every release was affected.

// ---------------------------------------------------------------------
// 67. Build compromise example
// ---------------------------------------------------------------------

export interface BuildCompromise {
  readonly buildSystem: string;
  readonly affectedArtifacts: readonly string[];
  readonly credentialReviewRequired: boolean;
}

export const buildCompromise: BuildCompromise = {
  buildSystem: "example-build-service",
  affectedArtifacts: ["example-artifact-1"],
  credentialReviewRequired: true,
};

// If the build environment itself was compromised, the investigation scope
// may include every artifact produced during the affected period.

// ---------------------------------------------------------------------
// 68. Release compromise example
// ---------------------------------------------------------------------

export interface ReleaseCompromise {
  readonly publishedArtifact: string;
  readonly expectedDigest: string;
  readonly observedDigest: string;
}

export const releaseCompromise: ReleaseCompromise = {
  publishedArtifact: "example-application.tar",
  expectedDigest: "sha256:expected",
  observedDigest: "sha256:unexpected",
};

// A mismatch between expected and observed artifact identity should trigger
// investigation before deployment or distribution continues.

// ---------------------------------------------------------------------
// 69. Security boundaries in a React application
// ---------------------------------------------------------------------

export interface ReactSupplyChainBoundary {
  readonly browserCodeIsPublic: boolean;
  readonly serverDependenciesCanBePrivileged: boolean;
  readonly buildToolsCanAffectArtifacts: boolean;
}

export const reactSupplyChainBoundary: ReactSupplyChainBoundary = {
  browserCodeIsPublic: true,
  serverDependenciesCanBePrivileged: true,
  buildToolsCanAffectArtifacts: true,
};

// React does not define the complete supply chain.
//
// Browser bundles, server-side code, build tooling, and deployment systems
// each have different security properties.

// ---------------------------------------------------------------------
// 70. Browser bundle trust
// ---------------------------------------------------------------------

export interface BrowserArtifact {
  readonly publiclyAccessible: boolean;
  readonly containsConfidentialCredentials: boolean;
}

export const browserArtifact: BrowserArtifact = {
  publiclyAccessible: true,
  containsConfidentialCredentials: false,
};

// Anything shipped to the browser should be treated as observable by the
// user.
//
// Confidential server credentials must remain outside browser artifacts.

// ---------------------------------------------------------------------
// 71. Server dependency trust
// ---------------------------------------------------------------------

export interface ServerDependencyBoundary {
  readonly databaseAccess: boolean;
  readonly filesystemAccess: boolean;
  readonly networkAccess: boolean;
}

export const serverDependencyBoundary: ServerDependencyBoundary = {
  databaseAccess: true,
  filesystemAccess: true,
  networkAccess: true,
};

// A compromised server dependency may inherit the privileges of the server
// process.
//
// Least privilege therefore applies to the server environment as well.

// ---------------------------------------------------------------------
// 72. Build dependency trust
// ---------------------------------------------------------------------

export interface BuildDependencyBoundary {
  readonly sourceAccess: boolean;
  readonly artifactWriteAccess: boolean;
  readonly secretAccess: boolean;
}

export const buildDependencyBoundary: BuildDependencyBoundary = {
  sourceAccess: true,
  artifactWriteAccess: true,
  secretAccess: false,
};

// Build dependencies should receive only the environment capabilities they
// actually require.

// ---------------------------------------------------------------------
// 73. Supply chain security testing
// ---------------------------------------------------------------------

export interface SupplyChainTest {
  readonly name: string;
  readonly expectedResult: string;
}

export const supplyChainTests: readonly SupplyChainTest[] = [
  {
    name: "Dependency resolution",
    expectedResult: "Approved lockfile produces the expected tree",
  },
  {
    name: "Artifact integrity",
    expectedResult: "Artifact digest matches the approved digest",
  },
  {
    name: "Provenance verification",
    expectedResult: "Build provenance matches expected source and builder",
  },
  {
    name: "Secret scanning",
    expectedResult: "No confidential credentials are embedded",
  },
];

// Security controls should be continuously tested rather than merely
// configured once.

// ---------------------------------------------------------------------
// 74. Supply chain security policy
// ---------------------------------------------------------------------

export interface SupplyChainSecurityPolicy {
  readonly sourceProtection: boolean;
  readonly dependencyMonitoring: boolean;
  readonly buildIsolation: boolean;
  readonly artifactVerification: boolean;
  readonly releaseAuthorization: boolean;
  readonly incidentResponse: boolean;
}

export const supplyChainSecurityPolicy: SupplyChainSecurityPolicy = {
  sourceProtection: true,
  dependencyMonitoring: true,
  buildIsolation: true,
  artifactVerification: true,
  releaseAuthorization: true,
  incidentResponse: true,
};

// A policy should define controls across the complete software lifecycle.

// ---------------------------------------------------------------------
// 75. Integrated secure pipeline
// ---------------------------------------------------------------------

export interface SecurePipeline {
  readonly sourceRevision: string;
  readonly dependencyLockfile: string;
  readonly artifactDigest: string;
  readonly provenanceVerified: boolean;
  readonly releaseApproved: boolean;
}

export const securePipeline: SecurePipeline = {
  sourceRevision: "example-commit",
  dependencyLockfile: "example-lockfile",
  artifactDigest: "sha256:example-digest",
  provenanceVerified: true,
  releaseApproved: true,
};

// A simplified secure flow is:
//
// protected source
//       |
//       v
// reviewed dependency graph
//       |
//       v
// isolated build
//       |
//       v
// generated provenance
//       |
//       v
// verified artifact
//       |
//       v
// authorized release
//       |
//       v
// verified deployment
//
// Each stage provides a separate opportunity to detect or prevent
// unauthorized changes.

// ---------------------------------------------------------------------
// 76. React example: artifact metadata display
// ---------------------------------------------------------------------

export interface BuildMetadataProps {
  readonly revision: string;
  readonly artifactDigest: string;
  readonly verified: boolean;
}

export const BuildMetadata: FC<BuildMetadataProps> = ({ revision, artifactDigest, verified }): ReactElement => {
  return (
    <section aria-labelledby="build-metadata-title">
      <h2 id="build-metadata-title">Build metadata</h2>
      <dl>
        <div>
          <dt>Revision</dt>
          <dd>{revision}</dd>
        </div>
        <div>
          <dt>Artifact digest</dt>
          <dd>{artifactDigest}</dd>
        </div>
        <div>
          <dt>Provenance verified</dt>
          <dd>{verified ? "Yes" : "No"}</dd>
        </div>
      </dl>
    </section>
  );
};

// Displaying build metadata in an application can improve operational
// traceability.
//
// The UI itself is not the security control; verification must happen in
// trusted release or deployment infrastructure.

// ---------------------------------------------------------------------
// 77. What supply chain security does not guarantee
// ---------------------------------------------------------------------

export const supplyChainLimitations = [
  "A verified artifact can still contain intentionally vulnerable code.",
  "A known publisher can release compromised code.",
  "A provenance record does not automatically prove that dependencies are safe.",
  "An SBOM does not prove that listed components are secure.",
  "A cryptographic digest does not prove who produced the artifact.",
  "A signed artifact can be unsafe if the signing identity was compromised.",
] as const;

// Supply-chain controls provide evidence and resistance against specific
// threats.
//
// They do not turn software into something that is universally guaranteed
// to be safe.

// ---------------------------------------------------------------------
// 78. Supply chain incident checklist
// ---------------------------------------------------------------------

export const supplyChainIncidentChecklist = [
  "Identify the affected component or system.",
  "Determine the affected versions and time window.",
  "Identify artifacts produced from affected inputs.",
  "Identify deployments containing affected artifacts.",
  "Review build and release logs.",
  "Determine which credentials were available to affected processes.",
  "Rotate potentially exposed credentials.",
  "Remove or replace compromised components.",
  "Rebuild affected artifacts from trusted inputs.",
  "Verify the rebuilt artifacts.",
  "Redeploy verified artifacts.",
  "Document the incident and corrective actions.",
] as const;

// Incident response should cover the complete chain rather than stopping at
// the first compromised package.

// ---------------------------------------------------------------------
// 79. Supply chain security checklist
// ---------------------------------------------------------------------

export const supplyChainSecurityChecklist = [
  "Protect source repositories and release branches.",
  "Require appropriate review for security-sensitive changes.",
  "Protect developer and CI identities with strong authentication.",
  "Apply least privilege to repository, build, signing, and deployment access.",
  "Treat CI/CD systems as security boundaries.",
  "Isolate build jobs and workspaces.",
  "Do not expose production secrets to untrusted build code.",
  "Use approved dependency sources and registry policies.",
  "Track direct and transitive dependencies.",
  "Use lockfiles and reproducible installation practices.",
  "Monitor dependencies for known vulnerabilities.",
  "Review build-time dependencies and installation scripts.",
  "Generate and verify build provenance where practical.",
  "Protect artifact and package publishing credentials.",
  "Verify artifact integrity before release and deployment.",
  "Separate artifact creation from production deployment where practical.",
  "Promote verified artifacts rather than silently rebuilding them.",
  "Maintain artifact inventories and SBOMs where appropriate.",
  "Monitor the supply chain after deployment.",
  "Have a documented response process for dependency and build compromise.",
] as const;

// ---------------------------------------------------------------------
// 80. Final integrated model
// ---------------------------------------------------------------------

export interface SecureSupplyChain {
  readonly sourceTrusted: boolean;
  readonly dependenciesKnown: boolean;
  readonly buildIsolated: boolean;
  readonly provenanceAvailable: boolean;
  readonly artifactVerified: boolean;
  readonly releaseAuthorized: boolean;
  readonly deploymentVerified: boolean;
}

export const secureSupplyChain: SecureSupplyChain = {
  sourceTrusted: true,
  dependenciesKnown: true,
  buildIsolated: true,
  provenanceAvailable: true,
  artifactVerified: true,
  releaseAuthorized: true,
  deploymentVerified: true,
};

// The complete model is:
//
// source
//   -> dependencies
//   -> build configuration
//   -> isolated build
//   -> provenance
//   -> artifact
//   -> artifact verification
//   -> authorized release
//   -> verified deployment
//
// Supply chain security is therefore a system of controls rather than one
// security feature. The strongest approach connects identity, integrity,
// provenance, least privilege, isolation, monitoring, and incident response
// across the entire software delivery lifecycle.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Supply chain security protects the complete path from source code and dependencies to build, release, distribution, and deployment.
// - Dependency security is only one part of the broader software supply chain.
// - Source repositories, CI/CD systems, package registries, build environments, artifact repositories, and deployment systems are security boundaries.
// - Developer, CI, release, signing, and deployment identities should follow least-privilege principles.
// - Protected branches, reviewed changes, strong authentication, and restricted release permissions reduce unauthorized source and release changes.
// - CI/CD systems should be treated as security-sensitive infrastructure because they can execute code and access source, artifacts, credentials, and deployment systems.
// - Untrusted pull-request code should not automatically receive production credentials or deployment permissions.
// - Build jobs should use isolated workspaces and avoid unnecessary shared state.
// - Build-time dependencies and installation scripts are part of the supply chain even when they are not shipped to end users.
// - Dependency sources, package names, registries, scopes, lockfiles, and integrity metadata all contribute to dependency trust.
// - Artifact integrity and artifact authenticity are different properties and should be considered separately.
// - Cryptographic digests identify exact artifact bytes but do not establish who produced them.
// - Signatures can associate artifacts or attestations with a signing identity, but signing keys must themselves be protected.
// - Build provenance connects an artifact with information about its source, builder, process, and inputs.
// - Provenance is useful only when its relevant properties are actually verified.
// - SLSA provides incremental supply-chain security guarantees through its Build and Source tracks; its Build track focuses on artifact provenance and build integrity.
// - A SLSA level or provenance record does not automatically prove that every dependency contained in an artifact is safe.
// - Reproducible and hermetic builds can improve the ability to independently reason about and verify build inputs and outputs.
// - Artifact creation and production deployment can be separated so that build systems do not automatically require production privileges.
// - Promoting the same verified artifact between environments avoids silently changing software through a second build.
// - Artifact repositories and package publishing systems should restrict write access and protect release identities.
// - SBOMs provide component inventories but do not prove that listed components are secure.
// - Monitoring must continue after release because new vulnerabilities and supply-chain compromises can be discovered later.
// - A suspected supply-chain compromise may require rebuilding artifacts, reviewing deployments, and rotating credentials in addition to replacing a dependency.
// - React does not provide supply-chain security by itself; browser code, server code, build tooling, dependencies, and deployment infrastructure have different security boundaries.
// - Supply chain security is defense in depth across source protection, dependency management, build isolation, provenance, artifact verification, release authorization, deployment verification, monitoring, and incident response.
