/**
 * Authorization
 * ==============
 *
 * Authorization is the process of determining whether an authenticated identity is permitted
 * to perform a particular action on a particular resource. Authentication establishes identity,
 * while authorization evaluates permissions, roles, relationships, resource ownership, and other
 * policy conditions for each protected operation.
 *
 * React can represent authorization state and hide or show interface elements, but client-side
 * checks are not a security boundary. The server must enforce authorization for protected resources
 * and operations.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Authentication versus authorization
// ---------------------------------------------------------------------

// Authentication asks:
//
// "Who is making this request?"
//
// Authorization asks:
//
// "Is that identity allowed to perform this action on this resource?"
//
// A user can be authenticated without being authorized to perform a particular
// operation.

// ---------------------------------------------------------------------
// 2. Authorization flow
// ---------------------------------------------------------------------

// A simplified authorization flow is:
//
// request
//    ↓
// authenticate requester
//    ↓
// identify subject
//    ↓
// identify requested action
//    ↓
// identify requested resource
//    ↓
// evaluate authorization policy
//    ↓
// allow or deny
//
// Authorization therefore depends on more than simply knowing that a user is
// signed in.

// ---------------------------------------------------------------------
// 3. Permissions
// ---------------------------------------------------------------------

type Permission = "profile:read" | "profile:update" | "orders:read" | "orders:cancel" | "users:read" | "users:delete";

interface UserPermissions {
  readonly userId: string;
  readonly permissions: readonly Permission[];
}

const userPermissions: UserPermissions = {
  userId: "user-123",
  permissions: ["profile:read", "profile:update", "orders:read"],
};

// Permissions describe specific actions an identity may perform.
//
// Keeping permissions explicit makes authorization policies easier to reason
// about than relying on a single boolean such as:
//
// isAdmin: true

// ---------------------------------------------------------------------
// 4. Checking a permission
// ---------------------------------------------------------------------

const hasPermission = (permissions: readonly Permission[], requiredPermission: Permission): boolean => {
  return permissions.includes(requiredPermission);
};

const PermissionExample: FC = (): ReactElement => {
  const canUpdateProfile = hasPermission(userPermissions.permissions, "profile:update");

  return <p>Profile update: {canUpdateProfile ? "Allowed" : "Denied"}</p>;
};

// This function can help the UI determine which controls to display.
//
// The same authorization rule must still be enforced by the server when the
// actual operation is requested.

// ---------------------------------------------------------------------
// 5. Client-side authorization is not a security boundary
// ---------------------------------------------------------------------

interface DeleteButtonProps {
  readonly canDelete: boolean;
  readonly onDelete: () => void;
}

const DeleteButton: FC<DeleteButtonProps> = ({ canDelete, onDelete }): ReactElement => {
  if (!canDelete) {
    return <p>Delete action unavailable.</p>;
  }

  return (
    <button type="button" onClick={onDelete}>
      Delete
    </button>
  );
};

// Hiding a button does not prevent an unauthorized request.
//
// An attacker can bypass the React interface and call an API directly:
//
// DELETE /api/users/user-123
//
// The server must perform the authorization check independently.

// ---------------------------------------------------------------------
// 6. Server-side authorization
// ---------------------------------------------------------------------

// A protected operation should conceptually follow:
//
// DELETE /api/users/user-123
//        ↓
// authenticate request
//        ↓
// identify requester
//        ↓
// authorize "users:delete"
//        ↓
// verify access to user-123
//        ↓
// perform deletion
//
// Every protected request needs an appropriate authorization decision.

// ---------------------------------------------------------------------
// 7. Deny by default
// ---------------------------------------------------------------------

type AuthorizationDecision = "allow" | "deny";

const evaluatePermission = (
  permissions: readonly Permission[],
  requiredPermission: Permission,
): AuthorizationDecision => {
  return permissions.includes(requiredPermission) ? "allow" : "deny";
};

const DenyByDefaultExample: FC = (): ReactElement => {
  const decision = evaluatePermission(userPermissions.permissions, "users:delete");

  return <p>Authorization decision: {decision}</p>;
};

// A deny-by-default policy means that access is denied unless an explicit
// authorization rule permits the requested operation.
//
// This prevents newly introduced resources or operations from accidentally
// becoming accessible without a corresponding permission.

// ---------------------------------------------------------------------
// 8. Least privilege
// ---------------------------------------------------------------------

interface RolePermissions {
  readonly role: string;
  readonly permissions: readonly Permission[];
}

const customerRole: RolePermissions = {
  role: "customer",
  permissions: ["profile:read", "profile:update", "orders:read"],
};

// Least privilege means granting only the permissions required for a user's
// responsibilities.
//
// A customer does not need administrative permissions merely because the
// application contains administrative functionality.

// ---------------------------------------------------------------------
// 9. Role-based access control
// ---------------------------------------------------------------------

type Role = "customer" | "support" | "admin";

interface UserRole {
  readonly userId: string;
  readonly role: Role;
}

const currentUserRole: UserRole = {
  userId: "user-123",
  role: "customer",
};

const RoleExample: FC = (): ReactElement => {
  return <p>Current role: {currentUserRole.role}</p>;
};

// Role-Based Access Control (RBAC) associates permissions with roles.
//
// For example:
//
// customer
//     → profile:read
//     → orders:read
//
// support
//     → profile:read
//     → orders:read
//
// admin
//     → additional administrative permissions
//
// Roles are useful when permissions naturally correspond to organizational
// responsibilities.

// ---------------------------------------------------------------------
// 10. Role checks are not always sufficient
// ---------------------------------------------------------------------

interface Order {
  readonly id: string;
  readonly ownerId: string;
  readonly total: number;
}

const order: Order = {
  id: "order-123",
  ownerId: "user-123",
  total: 49.99,
};

const canReadOrder = (userId: string, requestedOrder: Order): boolean => {
  return userId === requestedOrder.ownerId;
};

const OwnershipExample: FC = (): ReactElement => {
  const allowed = canReadOrder("user-123", order);

  return <p>Order access: {allowed ? "Allowed" : "Denied"}</p>;
};

// An authorization decision may depend on the relationship between the
// requester and the resource.
//
// A customer may be allowed to read their own order but not another user's
// order, even though both users have the same role.

// ---------------------------------------------------------------------
// 11. Object-level authorization
// ---------------------------------------------------------------------

interface OrderAccessProps {
  readonly userId: string;
  readonly order: Order;
}

const OrderAccess: FC<OrderAccessProps> = ({ userId, order }): ReactElement => {
  const allowed = canReadOrder(userId, order);

  return (
    <section>
      <h2>Order {order.id}</h2>
      <p>Access: {allowed ? "Allowed" : "Denied"}</p>
    </section>
  );
};

// Authorization must apply to the specific object being accessed.
//
// Checking only that:
//
// user has "orders:read"
//
// is not enough if the policy also requires:
//
// user owns this order

// ---------------------------------------------------------------------
// 12. Insecure direct object references
// ---------------------------------------------------------------------

interface AccountRequestProps {
  readonly accountId: string;
}

const AccountRequest: FC<AccountRequestProps> = ({ accountId }): ReactElement => {
  return <p>Requested account: {accountId}</p>;
};

// A URL such as:
//
// /api/accounts/user-456
//
// may expose an object identifier.
//
// The identifier itself is not the authorization decision.
//
// If user-123 changes the identifier from:
//
// user-123
//
// to:
//
// user-456
//
// the server must still verify whether user-123 is authorized to access
// user-456.

// ---------------------------------------------------------------------
// 13. Function-level authorization
// ---------------------------------------------------------------------

interface FunctionAccessProps {
  readonly role: Role;
}

const AdminControls: FC<FunctionAccessProps> = ({ role }): ReactElement => {
  if (role !== "admin") {
    return <p>Administrative controls unavailable.</p>;
  }

  return (
    <section>
      <h2>Administration</h2>
      <button type="button">Manage users</button>
    </section>
  );
};

// Administrative functionality requires explicit authorization.
//
// Hiding administrative navigation in React is useful for the interface, but
// the corresponding server endpoint must enforce the same requirement.

// ---------------------------------------------------------------------
// 14. Field-level authorization
// ---------------------------------------------------------------------

interface UserProfile {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly internalNotes: string;
}

const UserProfileView: FC<{ readonly profile: UserProfile }> = ({ profile }): ReactElement => {
  return (
    <section>
      <p>Name: {profile.displayName}</p>
      <p>Email: {profile.email}</p>
    </section>
  );
};

// Authorization can apply to individual fields, not only entire resources.
//
// A user may be allowed to read a profile while being prohibited from reading
// internal administrative fields.
//
// The server should avoid returning fields that the requester is not allowed
// to access.

// ---------------------------------------------------------------------
// 15. Resource-level versus field-level access
// ---------------------------------------------------------------------

interface ResourcePermissions {
  readonly canReadProfile: boolean;
  readonly canReadInternalNotes: boolean;
}

const resourcePermissions: ResourcePermissions = {
  canReadProfile: true,
  canReadInternalNotes: false,
};

const ResourceAuthorizationExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Profile: {resourcePermissions.canReadProfile ? "Allowed" : "Denied"}</li>
      <li>Internal notes: {resourcePermissions.canReadInternalNotes ? "Allowed" : "Denied"}</li>
    </ul>
  );
};

// A server response should be shaped according to the caller's authorized
// access rather than returning sensitive fields and relying on the client to
// hide them.

// ---------------------------------------------------------------------
// 16. Attribute-based access control
// ---------------------------------------------------------------------

interface AuthorizationSubject {
  readonly role: Role;
  readonly department: string;
}

interface AuthorizationResource {
  readonly department: string;
  readonly classification: "public" | "internal" | "restricted";
}

const canAccessResource = (subject: AuthorizationSubject, resource: AuthorizationResource): boolean => {
  if (resource.classification === "public") {
    return true;
  }

  return subject.role === "admin" || subject.department === resource.department;
};

const AttributeBasedExample: FC = (): ReactElement => {
  const subject: AuthorizationSubject = {
    role: "support",
    department: "sales",
  };

  const resource: AuthorizationResource = {
    department: "sales",
    classification: "internal",
  };

  return <p>Resource access: {canAccessResource(subject, resource) ? "Allowed" : "Denied"}</p>;
};

// Attribute-Based Access Control (ABAC) evaluates attributes of the subject,
// resource, action, and potentially the environment.
//
// This can express policies that cannot be represented cleanly by a single
// role check.

// ---------------------------------------------------------------------
// 17. Relationship-based access control
// ---------------------------------------------------------------------

type Relationship = "owner" | "member" | "viewer";

interface ResourceRelationship {
  readonly userId: string;
  readonly resourceId: string;
  readonly relationship: Relationship;
}

const relationship: ResourceRelationship = {
  userId: "user-123",
  resourceId: "document-123",
  relationship: "owner",
};

const RelationshipExample: FC = (): ReactElement => {
  return <p>Relationship: {relationship.relationship}</p>;
};

// Relationship-Based Access Control (ReBAC) evaluates how the requester is
// related to the requested resource.
//
// Examples:
//
// owner
//     → can modify
//
// member
//     → can collaborate
//
// viewer
//     → can read
//
// The relationship itself becomes part of the authorization decision.

// ---------------------------------------------------------------------
// 18. Authorization is action-specific
// ---------------------------------------------------------------------

type OrderAction = "read" | "update" | "cancel";

interface OrderAuthorizationInput {
  readonly userId: string;
  readonly order: Order;
  readonly action: OrderAction;
}

const canPerformOrderAction = ({ userId, order, action }: OrderAuthorizationInput): boolean => {
  if (userId !== order.ownerId) {
    return false;
  }

  return action === "read" || action === "update" || action === "cancel";
};

const ActionAuthorizationExample: FC = (): ReactElement => {
  const allowed = canPerformOrderAction({
    userId: "user-123",
    order,
    action: "cancel",
  });

  return <p>Cancel order: {allowed ? "Allowed" : "Denied"}</p>;
};

// Authorization should consider the requested action.
//
// Being authorized to read an object does not automatically mean the requester
// may modify or delete it.

// ---------------------------------------------------------------------
// 19. Authentication is not authorization
// ---------------------------------------------------------------------

interface AuthenticatedUser {
  readonly id: string;
  readonly role: Role;
}

const authenticatedUser: AuthenticatedUser = {
  id: "user-123",
  role: "customer",
};

const AuthenticatedButRestricted: FC = (): ReactElement => {
  return <p>Signed in as {authenticatedUser.id}, but administrative access is restricted.</p>;
};

// The following is an incorrect security assumption:
//
// isAuthenticated === true
//     ↓
// allow everything
//
// Authentication establishes an identity. Authorization determines what that
// identity may do.

// ---------------------------------------------------------------------
// 20. Authorization middleware
// ---------------------------------------------------------------------

// A protected server request can conceptually pass through:
//
// request
//    ↓
// authentication middleware
//    ↓
// authorization middleware/policy
//    ↓
// resource handler
//
// Centralizing common authorization enforcement reduces the risk that an
// individual endpoint accidentally omits a required check.

// ---------------------------------------------------------------------
// 21. Authorization on every request
// ---------------------------------------------------------------------

// Consider:
//
// GET /api/orders/order-123
//
// PATCH /api/orders/order-123
//
// DELETE /api/orders/order-123
//
// Each operation needs an authorization decision.
//
// A successful authorization check for one request should not be assumed to
// authorize a later request with a different action.

// ---------------------------------------------------------------------
// 22. Rechecking authorization
// ---------------------------------------------------------------------

interface AuthorizationContext {
  readonly userId: string;
  readonly role: Role;
}

const canDeleteUser = (context: AuthorizationContext, targetUserId: string): boolean => {
  return context.role === "admin" && context.userId !== targetUserId;
};

const RecheckAuthorizationExample: FC = (): ReactElement => {
  const context: AuthorizationContext = {
    userId: "admin-123",
    role: "admin",
  };

  return <p>Delete user: {canDeleteUser(context, "user-456") ? "Allowed" : "Denied"}</p>;
};

// Authorization should be evaluated using trusted server-side information.
//
// Do not rely on a permission value that was supplied by the client and can be
// changed before the request reaches the server.

// ---------------------------------------------------------------------
// 23. Never trust client-provided roles
// ---------------------------------------------------------------------

interface ClientControlledRoleProps {
  readonly role: string;
}

const ClientControlledRoleExample: FC<ClientControlledRoleProps> = ({ role }): ReactElement => {
  return <p>Client-provided role: {role}</p>;
};

// This is unsafe as an authorization mechanism:
//
// POST /api/admin/delete
//
// {
//     "role": "admin"
// }
//
// The server must derive the caller's effective permissions from trusted
// authentication and authorization data rather than accepting the client's
// claim that it is an administrator.

// ---------------------------------------------------------------------
// 24. HTTP 401 versus 403
// ---------------------------------------------------------------------

interface AuthorizationResponseProps {
  readonly status: 401 | 403;
}

const AuthorizationResponse: FC<AuthorizationResponseProps> = ({ status }): ReactElement => {
  return <p>Server response: HTTP {status}</p>;
};

// 401 generally indicates that the request lacks valid authentication
// credentials.
//
// 403 indicates that the server understood the request but refuses it because
// the requester does not have sufficient permission.
//
// APIs should apply these responses consistently with their authentication and
// authorization architecture.

// ---------------------------------------------------------------------
// 25. Hiding resources versus returning 403
// ---------------------------------------------------------------------

interface ResourceNotFoundProps {
  readonly visible: boolean;
}

const ResourceNotFound: FC<ResourceNotFoundProps> = ({ visible }): ReactElement => {
  if (!visible) {
    return <p>Resource unavailable.</p>;
  }

  return <p>Resource available.</p>;
};

// In some cases an application may intentionally return a 404-style response
// instead of revealing that a protected resource exists.
//
// This can reduce information disclosure about resources that the requester
// should not be able to discover.
//
// The appropriate response depends on the application's security and API
// requirements.

// ---------------------------------------------------------------------
// 26. Authorization failure handling
// ---------------------------------------------------------------------

interface AuthorizationFailureProps {
  readonly reason: string;
}

const AuthorizationFailure: FC<AuthorizationFailureProps> = ({ reason }): ReactElement => {
  return (
    <section>
      <h2>Access denied</h2>
      <p>{reason}</p>
    </section>
  );
};

// Authorization failures should terminate the protected operation safely.
//
// A failed authorization check must not leave the application in a partially
// modified or otherwise insecure state.

// ---------------------------------------------------------------------
// 27. Do not authorize after performing the operation
// ---------------------------------------------------------------------

// Incorrect conceptual flow:
//
// performSensitiveOperation()
//      ↓
// checkPermission()
//
// Correct conceptual flow:
//
// authenticate()
//      ↓
// authorize()
//      ↓
// performSensitiveOperation()
//
// Authorization must be part of the decision to perform the protected
// operation, not an after-the-fact check.

// ---------------------------------------------------------------------
// 28. Authorization and database queries
// ---------------------------------------------------------------------

interface AuthorizedOrderQueryProps {
  readonly userId: string;
}

const AuthorizedOrderQueryExample: FC<AuthorizedOrderQueryProps> = ({ userId }): ReactElement => {
  return <p>Loading orders authorized for {userId}</p>;
};

// A secure server can incorporate authorization requirements into the data
// access operation.
//
// Instead of:
//
// load every order
//      ↓
// filter unauthorized orders in application code
//
// the data-access layer can often constrain the query to resources the
// authenticated user is permitted to access.
//
// The exact implementation depends on the data model and authorization model.

// ---------------------------------------------------------------------
// 29. Ownership checks
// ---------------------------------------------------------------------

const isOwner = (userId: string, resourceOwnerId: string): boolean => {
  return userId === resourceOwnerId;
};

const OwnershipCheckExample: FC = (): ReactElement => {
  const allowed = isOwner("user-123", "user-123");

  return <p>Ownership: {allowed ? "Confirmed" : "Not confirmed"}</p>;
};

// Ownership is a common authorization relationship.
//
// It should be evaluated against trusted server-side identity and the actual
// resource being accessed.

// ---------------------------------------------------------------------
// 30. Privilege escalation
// ---------------------------------------------------------------------

// Vertical privilege escalation:
//
// ordinary user
//      ↓
// gains administrative capability
//
// Horizontal privilege escalation:
//
// user A
//      ↓
// accesses user B's resources
//
// Authorization controls should prevent both forms of unauthorized access.

// ---------------------------------------------------------------------
// 31. Privilege escalation through identifiers
// ---------------------------------------------------------------------

interface ResourceIdentifierProps {
  readonly resourceId: string;
}

const ResourceIdentifierExample: FC<ResourceIdentifierProps> = ({ resourceId }): ReactElement => {
  return <p>Resource identifier: {resourceId}</p>;
};

// Changing an identifier must never be sufficient to cross an authorization
// boundary.
//
// For example:
//
// /api/orders/order-123
//
// changing the URL to:
//
// /api/orders/order-456
//
// must trigger a new object-level authorization decision.

// ---------------------------------------------------------------------
// 32. Privileged administrative interfaces
// ---------------------------------------------------------------------

interface AdminPanelProps {
  readonly role: Role;
}

const AdminPanel: FC<AdminPanelProps> = ({ role }): ReactElement => {
  if (role !== "admin") {
    return <p>Administrative access denied.</p>;
  }

  return (
    <section>
      <h2>Administration</h2>
      <p>Administrative functionality is available.</p>
    </section>
  );
};

// Administrative interfaces should follow least privilege.
//
// A user should receive administrative capabilities only when the
// authorization policy explicitly permits them.

// ---------------------------------------------------------------------
// 33. Permission changes
// ---------------------------------------------------------------------

interface PermissionChange {
  readonly userId: string;
  readonly permissions: readonly Permission[];
}

const permissionChange: PermissionChange = {
  userId: "user-123",
  permissions: ["profile:read", "orders:read"],
};

const PermissionChangeExample: FC = (): ReactElement => {
  return <p>Permissions assigned: {permissionChange.permissions.length}</p>;
};

// Authorization can change during a user's session.
//
// Examples include:
//
// - a role being removed,
// - an account being suspended,
// - membership being revoked,
// - a resource changing ownership.
//
// Protected requests should therefore evaluate current authorization data
// rather than assuming permissions remain permanently valid.

// ---------------------------------------------------------------------
// 34. Time-based authorization
// ---------------------------------------------------------------------

interface TimeBasedPolicy {
  readonly enabled: boolean;
  readonly validUntil: number;
}

const temporaryPolicy: TimeBasedPolicy = {
  enabled: true,
  validUntil: Date.now() + 300_000,
};

const TimeBasedAuthorizationExample: FC = (): ReactElement => {
  const active = temporaryPolicy.enabled && Date.now() < temporaryPolicy.validUntil;

  return <p>Temporary permission: {active ? "Active" : "Expired"}</p>;
};

// Some policies depend on environmental conditions such as time.
//
// More complex policies can consider additional trusted attributes.
//
// Client-side time checks can improve UI behavior, but server-side policy
// evaluation remains authoritative for protected operations.

// ---------------------------------------------------------------------
// 35. Authorization and sensitive actions
// ---------------------------------------------------------------------

interface SensitiveActionProps {
  readonly authorized: boolean;
}

const SensitiveAction: FC<SensitiveActionProps> = ({ authorized }): ReactElement => {
  if (!authorized) {
    return <p>Additional authorization is required.</p>;
  }

  return <button type="button">Confirm sensitive action</button>;
};

// Sensitive operations may require stronger authorization controls than
// ordinary reads.
//
// Depending on the application, this can include:
//
// - recent authentication,
// - multi-factor authentication,
// - explicit transaction confirmation,
// - narrower permissions,
// - additional policy conditions.

// ---------------------------------------------------------------------
// 36. Authorization scopes
// ---------------------------------------------------------------------

type Scope = "profile.read" | "profile.write" | "orders.read" | "orders.write";

interface AccessTokenScope {
  readonly scopes: readonly Scope[];
}

const accessTokenScope: AccessTokenScope = {
  scopes: ["profile.read", "orders.read"],
};

const ScopeExample: FC = (): ReactElement => {
  const canWriteOrders = accessTokenScope.scopes.includes("orders.write");

  return <p>Order write scope: {canWriteOrders ? "Granted" : "Not granted"}</p>;
};

// A scope can constrain what an access token is permitted to access.
//
// Scopes should be treated as one input to an authorization policy rather than
// as a replacement for all resource-level authorization checks.

// ---------------------------------------------------------------------
// 37. Token scope does not replace object authorization
// ---------------------------------------------------------------------

interface ScopedOrderRequest {
  readonly scopes: readonly Scope[];
  readonly order: Order;
  readonly userId: string;
}

const canUpdateScopedOrder = ({ scopes, order, userId }: ScopedOrderRequest): boolean => {
  return scopes.includes("orders.write") && order.ownerId === userId;
};

const ScopedAuthorizationExample: FC = (): ReactElement => {
  const allowed = canUpdateScopedOrder({
    scopes: ["orders.write"],
    order,
    userId: "user-123",
  });

  return <p>Update order: {allowed ? "Allowed" : "Denied"}</p>;
};

// Having an "orders.write" scope does not necessarily mean that every order
// can be modified.
//
// The authorization policy may still require ownership, membership, role,
// tenant, or other resource-specific conditions.

// ---------------------------------------------------------------------
// 38. Multi-tenant authorization
// ---------------------------------------------------------------------

interface TenantResource {
  readonly tenantId: string;
  readonly resourceId: string;
}

const tenantResource: TenantResource = {
  tenantId: "tenant-123",
  resourceId: "resource-456",
};

const canAccessTenantResource = (userTenantId: string, resource: TenantResource): boolean => {
  return userTenantId === resource.tenantId;
};

const TenantAuthorizationExample: FC = (): ReactElement => {
  const allowed = canAccessTenantResource("tenant-123", tenantResource);

  return <p>Tenant access: {allowed ? "Allowed" : "Denied"}</p>;
};

// In a multi-tenant application, authorization must prevent one tenant from
// accessing another tenant's resources.
//
// Tenant isolation should be enforced server-side for every relevant
// operation.

// ---------------------------------------------------------------------
// 39. Client-side authorization for user experience
// ---------------------------------------------------------------------

interface UserInterfacePermissions {
  readonly canEdit: boolean;
  readonly canDelete: boolean;
}

const AuthorizedActions: FC<UserInterfacePermissions> = ({ canEdit, canDelete }): ReactElement => {
  return (
    <div>
      {canEdit && <button type="button">Edit</button>}

      {canDelete && <button type="button">Delete</button>}
    </div>
  );
};

// Client-side authorization state is useful for:
//
// - hiding unavailable controls,
// - reducing confusing interactions,
// - improving navigation,
// - showing appropriate messages.
//
// It is not sufficient to protect the underlying resource or operation.

// ---------------------------------------------------------------------
// 40. Centralized authorization policy
// ---------------------------------------------------------------------

interface AuthorizationRequest {
  readonly subject: AuthenticatedUser;
  readonly action: string;
  readonly resourceOwnerId?: string;
}

const authorize = ({ subject, action, resourceOwnerId }: AuthorizationRequest): boolean => {
  if (subject.role === "admin") {
    return true;
  }

  if (action === "read-profile" && resourceOwnerId === subject.id) {
    return true;
  }

  return false;
};

const CentralizedPolicyExample: FC = (): ReactElement => {
  const allowed = authorize({
    subject: authenticatedUser,
    action: "read-profile",
    resourceOwnerId: authenticatedUser.id,
  });

  return <p>Policy decision: {allowed ? "Allowed" : "Denied"}</p>;
};

// Centralizing authorization policy can make access rules easier to audit,
// test, and apply consistently.
//
// The actual policy should live in the security-enforcing layer rather than
// relying on a React component as the final authority.

// ---------------------------------------------------------------------
// 41. Authorization policy should use trusted data
// ---------------------------------------------------------------------

interface TrustedAuthorizationData {
  readonly userId: string;
  readonly role: Role;
  readonly tenantId: string;
}

const trustedAuthorizationData: TrustedAuthorizationData = {
  userId: "user-123",
  role: "customer",
  tenantId: "tenant-123",
};

const TrustedDataExample: FC = (): ReactElement => {
  return <p>Authorization subject: {trustedAuthorizationData.userId}</p>;
};

// Authorization decisions should be based on trusted identity, role,
// relationship, resource, and policy data.
//
// Client-provided claims such as:
//
// role=admin
// userId=user-123
// tenantId=tenant-123
//
// must not become trusted merely because they were supplied in a request.

// ---------------------------------------------------------------------
// 42. Authorization logging
// ---------------------------------------------------------------------

interface AuthorizationEvent {
  readonly action: string;
  readonly resourceId: string;
  readonly decision: AuthorizationDecision;
}

const authorizationEvent: AuthorizationEvent = {
  action: "orders.read",
  resourceId: "order-123",
  decision: "allow",
};

const AuthorizationLoggingExample: FC = (): ReactElement => {
  return <p>Authorization decision: {authorizationEvent.decision}</p>;
};

// Authorization events can be useful for security monitoring and auditing.
//
// Logs should be designed carefully so they do not expose unnecessary
// sensitive information or credentials.

// ---------------------------------------------------------------------
// 43. Testing authorization
// ---------------------------------------------------------------------

interface AuthorizationTestCase {
  readonly description: string;
  readonly expected: AuthorizationDecision;
}

const authorizationTests: readonly AuthorizationTestCase[] = [
  {
    description: "Owner reads own order",
    expected: "allow",
  },
  {
    description: "Customer reads another user's order",
    expected: "deny",
  },
  {
    description: "Non-admin deletes a user",
    expected: "deny",
  },
  {
    description: "Admin performs an administrative action",
    expected: "allow",
  },
];

const AuthorizationTestingExample: FC = (): ReactElement => {
  return (
    <ul>
      {authorizationTests.map((test) => (
        <li key={test.description}>
          {test.description}: {test.expected}
        </li>
      ))}
    </ul>
  );
};

// Authorization tests should cover both permitted and denied cases.
//
// Important cases include:
//
// - unauthenticated requests,
// - authenticated users without permission,
// - resource owners,
// - non-owners,
// - privileged roles,
// - revoked permissions,
// - cross-tenant access,
// - manipulated resource identifiers,
// - and unexpected policy inputs.

// ---------------------------------------------------------------------
// 44. Fail securely
// ---------------------------------------------------------------------

type PolicyEvaluationResult =
  { readonly status: "allowed" } | { readonly status: "denied" } | { readonly status: "policy-unavailable" };

const failSecurely = (result: PolicyEvaluationResult): AuthorizationDecision => {
  return result.status === "allowed" ? "allow" : "deny";
};

const FailSecurelyExample: FC = (): ReactElement => {
  const result: PolicyEvaluationResult = {
    status: "policy-unavailable",
  };

  return <p>Fallback decision: {failSecurely(result)}</p>;
};

// If an authorization system cannot safely determine whether an operation is
// permitted, it should fail closed rather than accidentally granting access.
//
// This principle is particularly important when authorization depends on
// external policy or security configuration.

// ---------------------------------------------------------------------
// 45. Authorization boundaries
// ---------------------------------------------------------------------

const AuthorizationBoundary: FC = (): ReactElement => {
  return (
    <section>
      <h2>Authorization boundary</h2>
      <p>Protected operations require a server-side authorization decision.</p>
    </section>
  );
};

// A useful architectural boundary is:
//
// browser
//    ↓
// request
//    ↓
// server
//    ↓
// authentication
//    ↓
// authorization
//    ↓
// protected resource
//
// React exists primarily on the browser side of this boundary.

// ---------------------------------------------------------------------
// 46. Integrated authorization example
// ---------------------------------------------------------------------

interface Account {
  readonly id: string;
  readonly ownerId: string;
  readonly displayName: string;
}

const account: Account = {
  id: "account-123",
  ownerId: "user-123",
  displayName: "John Doe",
};

interface AccountActionsProps {
  readonly currentUserId: string;
  readonly account: Account;
}

const AccountActions: FC<AccountActionsProps> = ({ currentUserId, account }): ReactElement => {
  const isOwner = currentUserId === account.ownerId;

  return (
    <section>
      <h2>{account.displayName}</h2>

      {isOwner ? <button type="button">Edit account</button> : <p>You do not have permission to edit this account.</p>}
    </section>
  );
};

const AuthorizationDemo: FC = (): ReactElement => {
  return <AccountActions currentUserId="user-123" account={account} />;
};

// The component can use authorization information to create an appropriate
// interface.
//
// A corresponding server endpoint must independently verify:
//
// 1. the requester's authenticated identity,
// 2. the requested account,
// 3. the relationship between the requester and account,
// 4. and whether the requested action is permitted.

// ---------------------------------------------------------------------
// 47. Authorization security checklist
// ---------------------------------------------------------------------

// When reviewing authorization, ask:
//
// 1. Are authorization decisions enforced server-side?
// 2. Are protected requests checked consistently?
// 3. Does the system deny access by default?
// 4. Does each identity receive only the permissions it needs?
// 5. Are object-level permissions checked for each requested resource?
// 6. Are function-level administrative operations protected?
// 7. Are sensitive fields protected when necessary?
// 8. Are client-provided roles and permissions treated as untrusted?
// 9. Are authorization decisions based on trusted identity and policy data?
// 10. Are ownership and tenant boundaries enforced?
// 11. Can changing an object identifier bypass authorization?
// 12. Are different actions authorized independently?
// 13. Are authorization failures handled safely?
// 14. Does the system fail closed when authorization policy cannot be evaluated?
// 15. Are authorization decisions tested for both allowed and denied cases?
// 16. Are relevant authorization events logged without exposing sensitive data?
// 17. Are permission changes reflected in subsequent authorization decisions?
// 18. Are client-side checks treated only as user-interface behavior?

// ---------------------------------------------------------------------
// 48. Practical guidance
// ---------------------------------------------------------------------

// Treat authorization as a server-side security boundary.
//
// React should:
//
// - display controls appropriate to the current authorization state,
// - hide unavailable actions when useful,
// - show access-denied states,
// - coordinate navigation,
// - and provide clear user feedback.
//
// The authorization-enforcing layer should:
//
// - authenticate the requester,
// - determine the effective identity,
// - evaluate permissions,
// - enforce resource ownership and relationships,
// - enforce tenant boundaries,
// - protect administrative operations,
// - deny by default,
// - and validate authorization on protected requests.
//
// Never treat a hidden React button, protected route, disabled control, or
// client-side permission flag as sufficient protection for a server resource.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Authorization determines whether an identity may perform a particular action on a particular resource.
// - Authentication establishes identity; authorization determines permissions.
// - Authorization must be enforced server-side and must not depend on React UI checks.
// - Client-side authorization improves user experience but is not a security boundary.
// - Authorization should deny access by default unless an explicit policy allows the operation.
// - Least privilege means granting only the permissions required for a user's responsibilities.
// - RBAC associates permissions with roles.
// - ABAC evaluates attributes of subjects, resources, actions, and potentially environmental conditions.
// - ReBAC evaluates relationships between identities and resources.
// - Authorization can depend on the specific object being accessed, not only its resource type.
// - Ownership checks can prevent users from accessing another user's resources.
// - Changing a resource identifier must never bypass object-level authorization.
// - Function-level authorization protects operations such as administrative actions.
// - Field-level authorization can restrict individual sensitive properties within an otherwise accessible resource.
// - Authorization must be evaluated for the requested action, not assumed from permission to perform a different action.
// - Client-provided roles, permissions, user IDs, and tenant IDs must not be trusted as authorization authority.
// - A 401 response generally indicates missing or invalid authentication, while 403 indicates insufficient permission.
// - An application may intentionally use 404 responses when revealing a protected resource's existence is undesirable.
// - Authorization failures must terminate protected operations safely.
// - Authorization checks should occur before sensitive operations are performed.
// - Authorization policies should use trusted server-side identity and resource information.
// - Multi-tenant applications must enforce tenant isolation for protected resources.
// - Scope-based permissions can constrain access but do not necessarily replace object-level authorization.
// - Authorization should fail closed when the policy cannot safely establish that access is allowed.
// - Authorization events can support auditing and security monitoring when logged without unnecessary sensitive information.
// - Authorization logic should be tested for both allowed and denied cases.
// - React represents authorization state in the interface; the server remains the authority for protected resources and operations.

export default AuthorizationDemo;
