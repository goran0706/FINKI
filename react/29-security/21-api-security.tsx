/**
 * API Security
 * ============
 *
 * API security is the practice of protecting application programming interfaces from unauthorized
 * access, manipulation, data exposure, resource abuse, and unsafe interactions with other systems.
 * APIs are trust boundaries: requests, headers, parameters, bodies, and responses must be treated
 * according to their actual trust level rather than assuming that a request came from a legitimate
 * frontend.
 *
 * Secure APIs require multiple controls working together, including HTTPS, authentication,
 * authorization, input validation, resource limits, secure configuration, inventory management,
 * safe error handling, monitoring, and careful treatment of third-party API responses.
 */

import { useState, type FC, type FormEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. API security is a server-side responsibility
// ---------------------------------------------------------------------

// A React application can help users interact with an API, but the browser
// is not a trusted enforcement point.
//
// Security decisions such as:
// - authentication
// - authorization
// - ownership
// - role checks
// - rate limits
// - resource limits
// - validation
//
// must be enforced by the API or another trusted server-side component.

// ---------------------------------------------------------------------
// 2. API trust boundaries
// ---------------------------------------------------------------------

export type ApiTrustBoundary =
  "browser-to-api" | "service-to-service" | "api-to-database" | "api-to-third-party-service";

export const apiTrustBoundaries: readonly ApiTrustBoundary[] = [
  "browser-to-api",
  "service-to-service",
  "api-to-database",
  "api-to-third-party-service",
];

// Every boundary introduces assumptions about the data crossing it.
//
// Those assumptions should be explicit and validated rather than relying
// on the identity of the system that produced the data.

// ---------------------------------------------------------------------
// 3. HTTPS for APIs
// ---------------------------------------------------------------------

export const secureApiUrl = "https://api.example.com";

// API traffic containing credentials, tokens, personal data, or other
// sensitive information should use HTTPS.
//
// TLS protects data in transit and allows the client to authenticate the
// server through certificate validation.
//
// HTTP should not be treated as an acceptable production transport for
// sensitive API communication.

// ---------------------------------------------------------------------
// 4. Authentication
// ---------------------------------------------------------------------

export interface AuthenticationState {
  readonly authenticated: boolean;
  readonly subjectId: string | null;
}

export const authenticatedRequest: AuthenticationState = {
  authenticated: true,
  subjectId: "user-example",
};

// Authentication answers:
//
// "Who is making this request?"
//
// Authentication can use sessions, bearer tokens, OAuth/OIDC flows, API
// credentials, or other mechanisms appropriate to the architecture.
//
// Authentication alone does not determine what the caller may access.

// ---------------------------------------------------------------------
// 5. Authorization
// ---------------------------------------------------------------------

export interface AuthorizationContext {
  readonly subjectId: string;
  readonly action: "read" | "create" | "update" | "delete";
  readonly resourceId: string;
}

export const exampleAuthorizationContext: AuthorizationContext = {
  subjectId: "user-example",
  action: "read",
  resourceId: "resource-example",
};

// Authorization answers:
//
// "Is this authenticated caller allowed to perform this action on this
// resource?"
//
// Every sensitive endpoint should enforce authorization on the server.

// ---------------------------------------------------------------------
// 6. Authentication is not authorization
// ---------------------------------------------------------------------

export const authenticatedUser = {
  id: "user-example",
};

// Knowing that the caller is "user-example" does not prove that the caller
// can access every resource.
//
// The API must evaluate permissions for the requested operation and
// resource.

// ---------------------------------------------------------------------
// 7. Object-level authorization
// ---------------------------------------------------------------------

export interface UserResource {
  readonly id: string;
  readonly ownerId: string;
}

export const canReadResource = (resource: UserResource, subjectId: string): boolean => {
  return resource.ownerId === subjectId;
};

// An endpoint such as:
//
// GET /api/users/{id}
//
// must not assume that possession of the identifier grants access.
//
// The API should verify that the authenticated caller is authorized to
// access the specific object.

// ---------------------------------------------------------------------
// 8. Broken object-level authorization
// ---------------------------------------------------------------------

// An insecure pattern is:
//
// 1. authenticate the user
// 2. accept an object ID
// 3. fetch the object
// 4. return it without checking ownership or permission
//
// An attacker may change:
//
// /api/orders/order-a
//
// into:
//
// /api/orders/order-b
//
// and receive another user's data if the server does not perform an
// object-level authorization check.

// ---------------------------------------------------------------------
// 9. Function-level authorization
// ---------------------------------------------------------------------

export type ApiRole = "user" | "admin";

export const canPerformAdminAction = (role: ApiRole): boolean => {
  return role === "admin";
};

// Endpoint access should be based on server-side authorization rules.
//
// A client-side check such as:
//
// if (user.role === "admin")
//
// can hide an interface element, but it cannot protect the API endpoint.

// ---------------------------------------------------------------------
// 10. Property-level authorization
// ---------------------------------------------------------------------

export interface UserProfile {
  readonly id: string;
  readonly displayName: string;
  readonly role: ApiRole;
}

export const publicUserProfile = (user: UserProfile): Pick<UserProfile, "id" | "displayName"> => {
  return {
    id: user.id,
    displayName: user.displayName,
  };
};

// APIs should return only properties the caller is permitted to receive.
//
// Similarly, update endpoints should accept only properties the caller is
// permitted to modify.
//
// Do not automatically bind every request property onto a privileged
// internal object.

// ---------------------------------------------------------------------
// 11. Mass assignment
// ---------------------------------------------------------------------

export interface UserUpdateInput {
  readonly displayName?: string;
}

export const createSafeUserUpdate = (input: Record<string, unknown>): UserUpdateInput => {
  if (typeof input.displayName !== "string") {
    return {};
  }

  return {
    displayName: input.displayName,
  };
};

// Do not accept security-sensitive properties merely because they appear
// in the request body.
//
// For example, a normal user should not be able to change their own role
// simply by submitting:
//
// { "role": "admin" }

// ---------------------------------------------------------------------
// 12. Validate API request bodies
// ---------------------------------------------------------------------

export interface CreateProfileRequest {
  readonly displayName: string;
  readonly email: string;
}

export const isCreateProfileRequest = (value: unknown): value is CreateProfileRequest => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.displayName === "string" && typeof candidate.email === "string";
};

// TypeScript interfaces do not validate JSON received over HTTP.
//
// Runtime validation is required at the API boundary.

// ---------------------------------------------------------------------
// 13. Validate query parameters
// ---------------------------------------------------------------------

export const parseLimit = (value: string | null): number | null => {
  if (value === null || !/^\d+$/.test(value)) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed)) {
    return null;
  }

  return parsed >= 1 && parsed <= 100 ? parsed : null;
};

// Query parameters are attacker-controlled input just like JSON bodies.
//
// Limits should prevent unexpectedly expensive queries.

// ---------------------------------------------------------------------
// 14. Validate path parameters
// ---------------------------------------------------------------------

export const isValidResourceId = (value: string): boolean => {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(value);
};

// Path parameters should be parsed and validated according to the
// application's identifier format.
//
// Validation does not replace authorization.

// ---------------------------------------------------------------------
// 15. Validate headers
// ---------------------------------------------------------------------

export const getCorrelationId = (headers: Headers): string | null => {
  const value = headers.get("X-Correlation-ID");

  if (value === null || value.length === 0 || value.length > 100) {
    return null;
  }

  return value;
};

// Request headers are also untrusted input.
//
// Even headers normally generated by a frontend can be constructed
// manually by an attacker.

// ---------------------------------------------------------------------
// 16. Do not trust client identity fields
// ---------------------------------------------------------------------

export interface UnsafeIdentityInput {
  readonly userId: string;
}

export const unsafeIdentityInput: UnsafeIdentityInput = {
  userId: "user-example",
};

// A client-provided:
//
// userId
//
// should not be used as the authoritative identity of the authenticated
// caller.
//
// The server should derive identity from its authenticated security
// context.

// ---------------------------------------------------------------------
// 17. Secure authentication tokens
// ---------------------------------------------------------------------

export interface BearerRequest {
  readonly authorization: string;
}

export const bearerRequest: BearerRequest = {
  authorization: "Bearer <access-token>",
};

// Bearer tokens grant authority to whoever possesses them.
//
// They should be transmitted only over HTTPS and handled according to the
// application's authentication architecture.
//
// Never log bearer tokens.

// ---------------------------------------------------------------------
// 18. Authorization header
// ---------------------------------------------------------------------

export const createAuthorizationHeader = (accessToken: string): string => {
  return `Bearer ${accessToken}`;
};

// An Authorization header is commonly used for bearer-token APIs.
//
// The API must validate the token, establish the authenticated subject,
// verify its validity and expiration, and then perform authorization.

// ---------------------------------------------------------------------
// 19. Cookie-based API authentication
// ---------------------------------------------------------------------

export interface CookieAuthenticationPolicy {
  readonly secure: boolean;
  readonly httpOnly: boolean;
  readonly sameSite: "strict" | "lax" | "none";
}

export const cookieAuthenticationPolicy: CookieAuthenticationPolicy = {
  secure: true,
  httpOnly: true,
  sameSite: "lax",
};

// Cookie-based authentication changes the threat model because browsers
// can attach cookies automatically.
//
// Applications using cookie authentication need appropriate CSRF
// protections for state-changing operations.

// ---------------------------------------------------------------------
// 20. CSRF and APIs
// ---------------------------------------------------------------------

// CSRF is especially relevant when authentication credentials are
// automatically attached by the browser, such as cookies.
//
// An API using explicit bearer credentials supplied by JavaScript has a
// different CSRF exposure model.
//
// The authentication mechanism must therefore be considered when choosing
// CSRF protections.

// ---------------------------------------------------------------------
// 21. CORS is not authentication
// ---------------------------------------------------------------------

export interface CorsPolicy {
  readonly allowedOrigins: readonly string[];
  readonly allowCredentials: boolean;
}

export const corsPolicy: CorsPolicy = {
  allowedOrigins: ["https://example.com"],
  allowCredentials: true,
};

// CORS controls whether browser scripts from another origin are permitted
// to read responses.
//
// It does not replace authentication or authorization.
//
// The API must still enforce access control for every request.

// ---------------------------------------------------------------------
// 22. Restrictive CORS
// ---------------------------------------------------------------------

export const allowedApiOrigin = "https://example.com";

// Credentialed cross-origin access should be restricted to explicitly
// trusted origins.
//
// Do not blindly reflect an arbitrary Origin header into
// Access-Control-Allow-Origin when credentials are involved.
//
// Public, non-credentialed APIs can use broader policies when that is
// intentionally part of the API design.

// ---------------------------------------------------------------------
// 23. CORS and preflight requests
// ---------------------------------------------------------------------

export type CorsMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const allowedCorsMethods: readonly CorsMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

// Browsers may send an OPTIONS preflight before certain cross-origin
// requests.
//
// The server should validate the requested origin, method, and headers
// against the API's actual policy.

// ---------------------------------------------------------------------
// 24. API error status codes
// ---------------------------------------------------------------------

export type ApiErrorStatus = 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 502 | 503;

export const unauthorizedStatus: ApiErrorStatus = 401;
export const forbiddenStatus: ApiErrorStatus = 403;

// A 401 response generally indicates that authentication is missing or
// invalid.
//
// A 403 response generally indicates that the request is understood but
// the authenticated caller is not permitted to perform the operation.
//
// Exact status-code conventions should remain consistent within an API.

// ---------------------------------------------------------------------
// 25. Avoid verbose API errors
// ---------------------------------------------------------------------

export interface SafeApiError {
  readonly code: string;
  readonly message: string;
}

export const safeApiError: SafeApiError = {
  code: "INVALID_REQUEST",
  message: "The request could not be processed.",
};

// Do not expose:
//
// - stack traces
// - database errors
// - filesystem paths
// - internal service names
// - credentials
// - SQL statements
// - implementation details
//
// in production API responses.

// ---------------------------------------------------------------------
// 26. Stable error codes
// ---------------------------------------------------------------------

export const validationError: SafeApiError = {
  code: "INVALID_REQUEST",
  message: "One or more request fields are invalid.",
};

// Stable machine-readable error codes let clients handle failures without
// depending on fragile internal exception messages.

// ---------------------------------------------------------------------
// 27. Rate limiting
// ---------------------------------------------------------------------

export interface RateLimitPolicy {
  readonly requests: number;
  readonly windowSeconds: number;
}

export const loginRateLimit: RateLimitPolicy = {
  requests: 10,
  windowSeconds: 60,
};

// Rate limiting can reduce brute-force attacks, abusive automation, and
// excessive resource consumption.
//
// The appropriate limit depends on the endpoint and business context.

// ---------------------------------------------------------------------
// 28. Rate limiting is not authorization
// ---------------------------------------------------------------------

// A rate limit controls how frequently an action can occur.
//
// It does not answer whether the caller is allowed to perform that action.
//
// Both controls may be required:
//
// authentication
//       |
//       v
// authorization
//       |
//       v
// rate/resource controls
//       |
//       v
// operation

// ---------------------------------------------------------------------
// 29. Resource consumption limits
// ---------------------------------------------------------------------

export interface ResourceLimits {
  readonly maximumBodyBytes: number;
  readonly maximumArrayItems: number;
  readonly maximumPageSize: number;
}

export const resourceLimits: ResourceLimits = {
  maximumBodyBytes: 1_000_000,
  maximumArrayItems: 100,
  maximumPageSize: 100,
};

// APIs should limit resource-intensive inputs such as:
//
// - request body size
// - array length
// - pagination size
// - expensive query parameters
// - upload size
// - batch operation size
//
// Resource limits help reduce denial-of-service and cost-amplification
// risks.

// ---------------------------------------------------------------------
// 30. Pagination limits
// ---------------------------------------------------------------------

export const validatePageSize = (value: number): boolean => {
  return Number.isInteger(value) && value >= 1 && value <= 100;
};

// Never assume that clients will voluntarily use reasonable page sizes.
//
// The server should enforce limits regardless of what the frontend UI
// permits.

// ---------------------------------------------------------------------
// 31. Batch endpoint limits
// ---------------------------------------------------------------------

export const validateBatchSize = (items: readonly unknown[]): boolean => {
  return items.length <= 100;
};

// Batch endpoints should constrain the amount of work represented by one
// request.
//
// A single request that triggers thousands of expensive operations can
// bypass per-request assumptions.

// ---------------------------------------------------------------------
// 32. Sensitive business flows
// ---------------------------------------------------------------------

export interface PurchaseRequest {
  readonly productId: string;
  readonly quantity: number;
}

export const validatePurchaseRequest = (request: PurchaseRequest): boolean => {
  return (
    isValidResourceId(request.productId) &&
    Number.isSafeInteger(request.quantity) &&
    request.quantity >= 1 &&
    request.quantity <= 20
  );
};

// Some API flows are sensitive even when the request is technically valid.
//
// Examples include:
//
// - purchasing
// - password recovery
// - sending messages
// - creating accounts
// - issuing invitations
// - triggering expensive operations
//
// These flows may require rate limits, quotas, confirmation steps, or
// additional fraud controls.

// ---------------------------------------------------------------------
// 33. Idempotency
// ---------------------------------------------------------------------

export interface IdempotencyRequest {
  readonly idempotencyKey: string;
}

export const isValidIdempotencyKey = (value: string): boolean => {
  return value.length >= 16 && value.length <= 255;
};

// Idempotency mechanisms can prevent accidental duplicate processing for
// operations such as payments or order creation.
//
// The server must define how keys are scoped, stored, expired, and
// associated with request results.

// ---------------------------------------------------------------------
// 34. HTTP method semantics
// ---------------------------------------------------------------------

export const safeReadMethods = ["GET", "HEAD", "OPTIONS"] as const;

// State-changing operations should not be hidden behind methods intended
// for retrieval.
//
// For example, using:
//
// GET /api/delete-account
//
// creates dangerous semantics because browsers and other clients may issue
// GET requests in contexts where a state change is not expected.

// ---------------------------------------------------------------------
// 35. Avoid state changes through GET
// ---------------------------------------------------------------------

export interface DeleteAccountOperation {
  readonly method: "DELETE";
  readonly path: "/api/account";
}

export const deleteAccountOperation: DeleteAccountOperation = {
  method: "DELETE",
  path: "/api/account",
};

// Use HTTP methods that accurately represent the intended operation and
// apply authentication, authorization, CSRF protection where relevant,
// and additional confirmation requirements as appropriate.

// ---------------------------------------------------------------------
// 36. SSRF
// ---------------------------------------------------------------------

export const userSuppliedUrl = "https://example.com";

// Server-side request forgery can occur when an API retrieves a remote
// resource using a user-controlled URL without adequate validation.
//
// The attacker may attempt to make the server connect to an unintended
// destination.
//
// SSRF protection is primarily a server-side concern.

// ---------------------------------------------------------------------
// 37. SSRF allowlisting
// ---------------------------------------------------------------------

export const isAllowedRemoteHost = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === "https:" && url.hostname === "example.com";
  } catch {
    return false;
  }
};

// When an API only needs to contact known external services, explicit
// allowlisting is preferable to accepting arbitrary destinations.

// ---------------------------------------------------------------------
// 38. SSRF is more than URL syntax
// ---------------------------------------------------------------------

// Checking:
//
// url.protocol === "https:"
//
// does not prove that the destination is safe.
//
// Depending on the architecture, SSRF defenses may also require:
//
// - destination allowlists
// - controlled DNS resolution
// - private-network protections
// - redirect restrictions
// - egress network controls
// - response-size limits
// - connection timeouts
//
// URL parsing is only one layer of defense.

// ---------------------------------------------------------------------
// 39. API security configuration
// ---------------------------------------------------------------------

export interface ApiSecurityConfiguration {
  readonly httpsOnly: boolean;
  readonly productionDebugMode: boolean;
  readonly detailedErrors: boolean;
}

export const productionApiConfiguration: ApiSecurityConfiguration = {
  httpsOnly: true,
  productionDebugMode: false,
  detailedErrors: false,
};

// Secure configuration should be explicit and reviewed.
//
// Debug endpoints, development credentials, permissive CORS, verbose
// errors, and unnecessary services should not accidentally remain enabled
// in production.

// ---------------------------------------------------------------------
// 40. Debug endpoints
// ---------------------------------------------------------------------

export const productionRoutes = ["/api/users", "/api/orders"] as const;

// Internal diagnostic endpoints should not be exposed merely because they
// were convenient during development.
//
// If an operational endpoint must exist, protect it with appropriate
// authentication, authorization, network controls, and monitoring.

// ---------------------------------------------------------------------
// 41. API inventory
// ---------------------------------------------------------------------

export interface ApiEndpointInventoryEntry {
  readonly method: string;
  readonly path: string;
  readonly owner: string;
  readonly version: string;
}

export const apiInventory: readonly ApiEndpointInventoryEntry[] = [
  {
    method: "GET",
    path: "/api/users",
    owner: "accounts",
    version: "v1",
  },
  {
    method: "POST",
    path: "/api/users",
    owner: "accounts",
    version: "v1",
  },
];

// Security depends on knowing which endpoints actually exist.
//
// Inventory should account for:
//
// - production hosts
// - API versions
// - deprecated endpoints
// - administrative endpoints
// - debug endpoints
// - internal services
//
// Forgotten endpoints can remain vulnerable after the main API is
// updated.

// ---------------------------------------------------------------------
// 42. API versioning
// ---------------------------------------------------------------------

export type ApiVersion = "v1" | "v2";

export const supportedApiVersions: readonly ApiVersion[] = ["v1", "v2"];

// Old API versions should have an explicit lifecycle.
//
// If a deprecated version remains reachable, it still needs appropriate
// security controls until it is actually removed.

// ---------------------------------------------------------------------
// 43. Authentication on every protected endpoint
// ---------------------------------------------------------------------

export interface ProtectedEndpointPolicy {
  readonly requiresAuthentication: boolean;
  readonly requiresAuthorization: boolean;
}

export const protectedUserEndpoint: ProtectedEndpointPolicy = {
  requiresAuthentication: true,
  requiresAuthorization: true,
};

// Authentication should not be assumed merely because another endpoint
// already authenticated the user.
//
// Each protected request needs its own valid security context.

// ---------------------------------------------------------------------
// 44. Authorization on every sensitive operation
// ---------------------------------------------------------------------

export interface AuthorizationDecision {
  readonly allowed: boolean;
  readonly reason: "owner" | "role" | "permission" | "denied";
}

export const denyByDefault: AuthorizationDecision = {
  allowed: false,
  reason: "denied",
};

// Secure authorization commonly follows a deny-by-default approach:
//
// if no explicit rule grants the operation,
// the operation is denied.

// ---------------------------------------------------------------------
// 45. Object ownership
// ---------------------------------------------------------------------

export const canModifyResource = (resourceOwnerId: string, subjectId: string): boolean => {
  return resourceOwnerId === subjectId;
};

// Object ownership must be evaluated using trusted server-side state.
//
// Never determine ownership from a client-controlled property such as:
//
// { "ownerId": "user-example" }

// ---------------------------------------------------------------------
// 46. Multi-tenant APIs
// ---------------------------------------------------------------------

export interface TenantContext {
  readonly tenantId: string;
  readonly subjectId: string;
}

export const belongsToTenant = (resourceTenantId: string, context: TenantContext): boolean => {
  return resourceTenantId === context.tenantId;
};

// Multi-tenant APIs must enforce tenant isolation at the server.
//
// A valid user in one tenant must not gain access to another tenant merely
// by changing a tenant identifier in a request.

// ---------------------------------------------------------------------
// 47. API response minimization
// ---------------------------------------------------------------------

export interface InternalAccount {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly passwordHash: string;
  readonly internalFlags: readonly string[];
}

export const toPublicAccount = (account: InternalAccount): Omit<InternalAccount, "passwordHash" | "internalFlags"> => {
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
  };
};

// API responses should contain only the data the client needs and is
// authorized to receive.
//
// Internal database models should not automatically become API response
// schemas.

// ---------------------------------------------------------------------
// 48. Do not return password hashes
// ---------------------------------------------------------------------

export interface PublicAccount {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
}

// Password hashes are authentication data and should not be returned to
// browser clients.
//
// The same principle applies to API secrets, private keys, internal
// security metadata, and other sensitive fields.

// ---------------------------------------------------------------------
// 49. API secrets belong on the server
// ---------------------------------------------------------------------

export interface ServerApiCredential {
  readonly service: string;
  readonly credential: string;
}

export const serverCredentialReference: Pick<ServerApiCredential, "service"> = {
  service: "example-service",
};

// Confidential API credentials must not be embedded in browser bundles.
//
// Anything delivered to browser JavaScript should be considered accessible
// to the user and potentially to malicious code executing in that
// environment.

// ---------------------------------------------------------------------
// 50. Public API keys
// ---------------------------------------------------------------------

export interface PublicApiConfiguration {
  readonly clientIdentifier: string;
}

export const publicApiConfiguration: PublicApiConfiguration = {
  clientIdentifier: "example-public-client",
};

// Some APIs intentionally use identifiers that are safe to expose.
//
// Whether a key is public depends on what authority it grants and how the
// provider defines its security model.
//
// A value being called an "API key" does not automatically make it safe
// for browser exposure.

// ---------------------------------------------------------------------
// 51. Backend-for-frontend pattern
// ---------------------------------------------------------------------

export interface BrowserApiResponse {
  readonly data: readonly string[];
}

export const browserApiResponse: BrowserApiResponse = {
  data: ["example"],
};

// A backend-for-frontend can keep confidential upstream credentials on the
// server:
//
// Browser
//    |
//    v
// BFF
//    |
//    v
// Third-party API
//
// The browser receives only the data and capabilities it is authorized to
// use.

// ---------------------------------------------------------------------
// 52. Third-party API responses are untrusted
// ---------------------------------------------------------------------

export interface ExternalProduct {
  readonly name: string;
  readonly description: string;
}

export const isExternalProduct = (value: unknown): value is ExternalProduct => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.name === "string" && typeof candidate.description === "string";
};

// Data received from a third-party API should not automatically be treated
// as trusted simply because it came from another service.
//
// Validate and constrain external responses before using them in security-
// sensitive processing.

// ---------------------------------------------------------------------
// 53. Unsafe consumption of APIs
// ---------------------------------------------------------------------

// An application can become vulnerable through an integrated service even
// when its own endpoint is correctly implemented.
//
// Risks include:
//
// - unexpected response structures
// - malicious or compromised upstream data
// - unsafe redirects
// - excessive response sizes
// - weak TLS configuration
// - missing authentication
// - insufficient validation
//
// External API boundaries require their own security assumptions.

// ---------------------------------------------------------------------
// 54. Third-party response size
// ---------------------------------------------------------------------

export const maximumExternalResponseBytes = 5_000_000;

// External services can return unexpectedly large responses.
//
// Where supported, enforce response-size and timeout limits before
// performing expensive parsing or processing.

// ---------------------------------------------------------------------
// 55. Third-party request timeouts
// ---------------------------------------------------------------------

export const externalRequestTimeoutMs = 5_000;

// Network requests should not wait indefinitely.
//
// Timeouts reduce resource exhaustion and improve failure containment when
// an upstream service becomes unavailable or unresponsive.

// ---------------------------------------------------------------------
// 56. API request timeouts
// ---------------------------------------------------------------------

export const apiOperationTimeoutMs = 10_000;

// Server-side operations should have appropriate deadlines, especially
// when requests can trigger database queries or calls to other services.

// ---------------------------------------------------------------------
// 57. Prevent excessive nesting
// ---------------------------------------------------------------------

export const maximumBatchDepth = 5;

// APIs that accept nested JSON or recursive structures should define
// practical limits on nesting and collection sizes where deeply nested
// structures could cause expensive processing.

// ---------------------------------------------------------------------
// 58. Graph-like API complexity
// ---------------------------------------------------------------------

export interface QueryComplexityPolicy {
  readonly maximumDepth: number;
  readonly maximumNodes: number;
}

export const queryComplexityPolicy: QueryComplexityPolicy = {
  maximumDepth: 10,
  maximumNodes: 500,
};

// Query-oriented APIs may require explicit complexity controls.
//
// The exact strategy depends on the protocol and query language.

// ---------------------------------------------------------------------
// 59. API documentation
// ---------------------------------------------------------------------

export interface ApiDocumentationEntry {
  readonly path: string;
  readonly authentication: "required" | "public";
  readonly authorization: "required" | "not-applicable";
}

export const documentedEndpoint: ApiDocumentationEntry = {
  path: "/api/profile",
  authentication: "required",
  authorization: "required",
};

// Accurate API documentation helps developers understand:
//
// - authentication requirements
// - authorization requirements
// - accepted input
// - output schemas
// - error behavior
// - rate limits
// - deprecation status
//
// Documentation should not expose secrets or unnecessary internal
// infrastructure details.

// ---------------------------------------------------------------------
// 60. OpenAPI schemas do not enforce security by themselves
// ---------------------------------------------------------------------

// An OpenAPI document can describe:
//
// - request schemas
// - response schemas
// - authentication schemes
// - endpoints
//
// but documentation alone does not enforce those rules.
//
// Runtime enforcement remains the responsibility of the API implementation
// and its security infrastructure.

// ---------------------------------------------------------------------
// 61. Security headers on API responses
// ---------------------------------------------------------------------

export interface ApiSecurityHeaders {
  readonly contentType: string;
  readonly cacheControl: string;
}

export const sensitiveApiHeaders: ApiSecurityHeaders = {
  contentType: "application/json",
  cacheControl: "no-store",
};

// Security headers should be selected according to the type of API
// response.
//
// Sensitive responses should not accidentally become publicly cached.

// ---------------------------------------------------------------------
// 62. Cache control for sensitive responses
// ---------------------------------------------------------------------

export const sensitiveResponseCacheControl = "no-store";

// Authentication data, private account information, and other sensitive
// responses may require explicit cache-control directives.
//
// Browser caches, intermediary caches, and application-level caches should
// be considered in the threat model.

// ---------------------------------------------------------------------
// 63. Logging API requests
// ---------------------------------------------------------------------

export interface ApiAuditEvent {
  readonly event: "api_request";
  readonly method: string;
  readonly path: string;
  readonly status: number;
  readonly subjectId?: string;
}

export const exampleAuditEvent: ApiAuditEvent = {
  event: "api_request",
  method: "GET",
  path: "/api/profile",
  status: 200,
  subjectId: "user-example",
};

// API logs can support detection, investigation, and auditing.
//
// Logging should avoid credentials, session tokens, passwords, and other
// sensitive request data.

// ---------------------------------------------------------------------
// 64. Correlation IDs
// ---------------------------------------------------------------------

export interface RequestContext {
  readonly correlationId: string;
}

export const requestContext: RequestContext = {
  correlationId: "request-example",
};

// Correlation identifiers help trace a request across services.
//
// They should be treated as identifiers rather than authentication
// credentials.

// ---------------------------------------------------------------------
// 65. Do not trust correlation IDs for authorization
// ---------------------------------------------------------------------

export const isAuthorizedByCorrelationId = (correlationId: string): boolean => {
  void correlationId;
  return false;
};

// A correlation ID identifies a request for observability.
//
// It must never be treated as proof of identity, ownership, or permission.

// ---------------------------------------------------------------------
// 66. API replay considerations
// ---------------------------------------------------------------------

export interface ReplaySensitiveRequest {
  readonly operation: "transfer" | "purchase";
  readonly idempotencyKey: string;
}

export const replaySensitiveRequest: ReplaySensitiveRequest = {
  operation: "purchase",
  idempotencyKey: "example-idempotency-key",
};

// Sensitive operations may require replay-resistant design, idempotency,
// expiration, nonce handling, or server-side state depending on the
// authentication and protocol being used.

// ---------------------------------------------------------------------
// 67. Authorization before expensive work
// ---------------------------------------------------------------------

export const shouldProcessRequest = (authenticated: boolean, authorized: boolean): boolean => {
  return authenticated && authorized;
};

// Authorization should happen before unnecessary expensive processing when
// the required authorization information is already available.
//
// This can reduce both resource consumption and information leakage.

// ---------------------------------------------------------------------
// 68. Fail closed
// ---------------------------------------------------------------------

export const authorizationDecision = (permission: boolean | null): boolean => {
  return permission === true;
};

// If an authorization dependency fails or produces an indeterminate
// result, security-sensitive operations should not silently become
// authorized.
//
// The exact failure behavior depends on the architecture, but accidental
// authorization should be avoided.

// ---------------------------------------------------------------------
// 69. API security testing
// ---------------------------------------------------------------------

export interface ApiSecurityTest {
  readonly endpoint: string;
  readonly test: string;
}

export const securityTests: readonly ApiSecurityTest[] = [
  {
    endpoint: "/api/users/example",
    test: "Reject access to another user's resource",
  },
  {
    endpoint: "/api/admin",
    test: "Reject unauthorized roles",
  },
  {
    endpoint: "/api/search",
    test: "Enforce pagination limits",
  },
];

// Security tests should verify authorization and resource constraints, not
// merely successful responses.
//
// Important tests include:
//
// - unauthenticated access
// - authenticated but unauthorized access
// - object ownership
// - property restrictions
// - malformed input
// - oversized input
// - rate limits
// - deprecated endpoints
// - CORS policy
// - error handling

// ---------------------------------------------------------------------
// 70. Test direct API access
// ---------------------------------------------------------------------

// Do not test only through the React UI.
//
// Security tests should call the API boundary directly because an attacker
// can bypass the browser application entirely.

// ---------------------------------------------------------------------
// 71. Test object-level authorization
// ---------------------------------------------------------------------

export interface ObjectAuthorizationTest {
  readonly caller: string;
  readonly resourceOwner: string;
  readonly expected: boolean;
}

export const objectAuthorizationTests: readonly ObjectAuthorizationTest[] = [
  {
    caller: "user-example",
    resourceOwner: "user-example",
    expected: true,
  },
  {
    caller: "user-example",
    resourceOwner: "other-user",
    expected: false,
  },
];

// Authorization tests should explicitly include cross-user and
// cross-tenant cases.

// ---------------------------------------------------------------------
// 72. Test function-level authorization
// ---------------------------------------------------------------------

export interface FunctionAuthorizationTest {
  readonly role: ApiRole;
  readonly canAccessAdminEndpoint: boolean;
}

export const functionAuthorizationTests: readonly FunctionAuthorizationTest[] = [
  {
    role: "user",
    canAccessAdminEndpoint: false,
  },
  {
    role: "admin",
    canAccessAdminEndpoint: true,
  },
];

// Administrative endpoints should be tested against every relevant
// privilege level.

// ---------------------------------------------------------------------
// 73. React API client boundary
// ---------------------------------------------------------------------

export interface ApiClient {
  readonly getProfile: () => Promise<PublicAccount>;
}

export const createApiClient = (fetchImplementation: typeof fetch): ApiClient => {
  return {
    getProfile: async (): Promise<PublicAccount> => {
      const response = await fetchImplementation("/api/profile", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load profile.");
      }

      return response.json() as Promise<PublicAccount>;
    },
  };
};

// The client is responsible for making the request.
//
// The API remains responsible for authentication, authorization,
// validation, and other security controls.

// ---------------------------------------------------------------------
// 74. Handle API failures without leaking internals
// ---------------------------------------------------------------------

export const getSafeApiMessage = (status: number): string => {
  if (status === 401) {
    return "Please sign in.";
  }

  if (status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (status === 429) {
    return "Too many requests. Try again later.";
  }

  return "The request could not be completed.";
};

// Client applications should present useful messages without exposing
// server-side exception details.

// ---------------------------------------------------------------------
// 75. React authentication state is not authorization
// ---------------------------------------------------------------------

export interface ClientUser {
  readonly id: string;
  readonly role: ApiRole;
}

export const clientUser: ClientUser = {
  id: "user-example",
  role: "user",
};

// Client-side role information can control presentation:
//
// show/hide navigation
// disable optional UI
//
// It cannot protect an endpoint.
//
// The server must independently enforce the permission.

// ---------------------------------------------------------------------
// 76. API request form
// ---------------------------------------------------------------------

export const ApiRequestForm: FC = (): ReactElement => {
  const [resourceId, setResourceId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!isValidResourceId(resourceId)) {
      setMessage("Enter a valid resource identifier.");
      return;
    }

    setMessage("The request can be sent to the API for server-side authorization.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Resource ID
        <input value={resourceId} maxLength={64} onChange={(event) => setResourceId(event.target.value)} />
      </label>

      <button type="submit">Load resource</button>

      {message && <p role="status">{message}</p>}
    </form>
  );
};

// This client-side check improves usability.
//
// It does not establish that the current user is allowed to access the
// resource.

// ---------------------------------------------------------------------
// 77. Secure API request lifecycle
// ---------------------------------------------------------------------

export const secureApiLifecycle = [
  "Receive request",
  "Authenticate caller",
  "Validate request structure",
  "Authorize requested operation",
  "Apply resource and rate limits",
  "Perform business logic",
  "Minimize response data",
  "Return safe response",
  "Record appropriate security events",
] as const;

// The exact implementation varies by framework and architecture, but
// security should be considered throughout the request lifecycle rather
// than added only at the frontend.

// ---------------------------------------------------------------------
// 78. Integrated secure API policy
// ---------------------------------------------------------------------

export interface SecureApiPolicy {
  readonly httpsOnly: boolean;
  readonly authenticationRequired: boolean;
  readonly authorizationRequired: boolean;
  readonly inputValidationRequired: boolean;
  readonly resourceLimitsEnabled: boolean;
  readonly sensitiveErrorsHidden: boolean;
  readonly thirdPartyResponsesValidated: boolean;
}

export const secureApiPolicy: SecureApiPolicy = {
  httpsOnly: true,
  authenticationRequired: true,
  authorizationRequired: true,
  inputValidationRequired: true,
  resourceLimitsEnabled: true,
  sensitiveErrorsHidden: true,
  thirdPartyResponsesValidated: true,
};

// A secure API is not created by one mechanism.
//
// It is the combination of transport security, identity, authorization,
// validation, resource controls, safe configuration, observability, and
// secure integration boundaries.

// ---------------------------------------------------------------------
// 79. API security checklist
// ---------------------------------------------------------------------

export const apiSecurityChecklist = [
  "Use HTTPS for sensitive API communication.",
  "Authenticate protected requests.",
  "Authorize every sensitive operation.",
  "Check authorization at the object level.",
  "Restrict writable object properties.",
  "Validate request bodies, parameters, and headers.",
  "Limit request and response resource consumption.",
  "Protect sensitive business flows against automation and abuse.",
  "Validate server-side outbound destinations against SSRF risks.",
  "Configure CORS narrowly when cross-origin browser access is required.",
  "Do not expose confidential server credentials to browser code.",
  "Maintain an inventory of deployed APIs and versions.",
  "Remove or protect deprecated and debug endpoints.",
  "Avoid verbose production error responses.",
  "Validate data received from third-party APIs.",
  "Use appropriate timeouts and size limits.",
  "Avoid logging passwords, tokens, and secrets.",
  "Test API authorization directly rather than only through the UI.",
] as const;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - API security protects endpoints, data, business operations, and integrations from unauthorized or abusive use.
// - HTTPS protects API traffic in transit and helps clients authenticate the server.
// - Authentication identifies the caller; authorization determines what that caller may do.
// - Authorization should be enforced at the object, property, function, and tenant levels where applicable.
// - Client-side authentication or role checks cannot protect an API because the browser is not a trusted enforcement point.
// - Request bodies, query parameters, path parameters, and headers must be treated as untrusted input and validated at runtime.
// - TypeScript interfaces and type assertions do not validate data received over HTTP.
// - API responses should expose only the properties the caller is authorized to receive.
// - Mass assignment can occur when client-controlled properties are copied into privileged server-side objects without explicit field authorization.
// - CORS controls browser cross-origin access; it is not a replacement for authentication or authorization.
// - Cookie-authenticated APIs require appropriate CSRF protections for state-changing requests.
// - Rate limits, quotas, body-size limits, pagination limits, and batch limits help control resource consumption.
// - Sensitive business flows may require additional anti-automation, idempotency, confirmation, or fraud controls.
// - State-changing operations should not be hidden behind HTTP methods intended for safe retrieval.
// - Server-side URL fetching requires SSRF defenses when destinations are influenced by users.
// - Secure API configuration includes controlled CORS, protected administrative endpoints, safe production errors, and removal of unnecessary services.
// - API inventory should cover hosts, versions, deprecated endpoints, administrative endpoints, and other deployed interfaces.
// - Third-party API responses are external data and should be validated rather than automatically trusted.
// - Confidential upstream credentials should remain on trusted server-side components rather than browser bundles.
// - API logs and audit events should support investigation without exposing passwords, tokens, or other sensitive data.
// - Security testing should exercise the API directly and include unauthorized object access, privilege boundaries, malformed input, resource limits, and integration failures.
// - React improves the client experience but does not provide server-side API security controls.
// - API security is defense in depth across transport, authentication, authorization, validation, resource protection, configuration, inventory, integration, and monitoring.
