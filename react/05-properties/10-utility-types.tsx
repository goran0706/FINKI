/**
 * Utility Types
 * =============
 *
 * TypeScript utility types enable developers to transform and derive new prop interfaces from
 * existing base models without code duplication, preserving a DRY component architecture.
 *
 * Structural modifiers, subsetting tools, and dictionary mapping primitives dynamically alter or
 * filter base property contracts. Deriving component interfaces directly from a single domain source
 * guarantees application-wide type synchronization and eliminates manual interface maintenance.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Base Domain Model & Comprehensive Utility Definitions
// ---------------------------------------------------------------------

export interface UserEntity {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly role: "admin" | "editor" | "viewer" | null;
}

// 1. Partial<T>: Makes all properties optional
export type PartialUserProps = Partial<UserEntity>;

// 2. Required<T>: Makes all properties mandatory
export type RequiredUserProps = Required<UserEntity>;

// 3. Readonly<T>: Makes all properties immutable
export type ReadonlyUserProps = Readonly<UserEntity>;

// 4. Pick<T, K>: Selects a specific subset of properties
export type UserIdentityProps = Pick<UserEntity, "id" | "name">;

// 5. Omit<T, K>: Excludes specified properties
export type PublicUserProps = Omit<UserEntity, "email" | "role">;

// 6. Record<K, T>: Creates a dictionary map type
export type PermissionsMap = Record<string, boolean>;

// 7. Extract<T, U>: Extracts union members assignable to U
export type ActiveRoles = Extract<UserEntity["role"], "admin" | "editor">;

// 8. Exclude<T, U>: Excludes union members assignable from U
export type NonAdminRoles = Exclude<UserEntity["role"], "admin">;

// 9. NonNullable<T>: Removes null and undefined from types
export type StrictRole = NonNullable<UserEntity["role"]>;

// ---------------------------------------------------------------------
// 2. Specialized Components for Each Utility Type
// ---------------------------------------------------------------------

export const PartialUserCard: React.FC<PartialUserProps> = (props) => {
  const { id, name, email, role } = props;
  return (
    <div>
      <h4>Partial Card</h4>
      <p>ID: {id ?? "N/A"}</p>
      <p>Name: {name ?? "Guest"}</p>
      <p>Email: {email ?? "Not provided"}</p>
      <p>Role: {role ?? "None"}</p>
    </div>
  );
};

export const RequiredUserCard: React.FC<RequiredUserProps> = (props) => {
  const { id, name, email, role } = props;
  return (
    <div>
      <h4>Required Card</h4>
      <p>ID: {id}</p>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Role: {role}</p>
    </div>
  );
};

export const ReadonlyUserCard: React.FC<ReadonlyUserProps> = (props) => {
  const { id, name, email, role } = props;
  return (
    <div>
      <h4>Readonly Card</h4>
      <p>ID: {id}</p>
      <p>Name: {name}</p>
      <p>Email: {email ?? "N/A"}</p>
      <p>Role: {role ?? "None"}</p>
    </div>
  );
};

export const UserIdentityCard: React.FC<UserIdentityProps> = (props) => {
  const { id, name } = props;
  return (
    <div>
      <h4>Picked Identity</h4>
      <p>
        ID: {id} | Name: {name}
      </p>
    </div>
  );
};

export const PublicUserCard: React.FC<PublicUserProps> = (props) => {
  const { id, name } = props;
  return (
    <div>
      <h4>Omitted Public Card</h4>
      <p>
        ID: {id} | Name: {name}
      </p>
    </div>
  );
};

export interface PermissionsListProps {
  readonly permissions: PermissionsMap;
}

export const PermissionsList: React.FC<PermissionsListProps> = (props) => {
  const { permissions } = props;
  return (
    <div>
      <h4>Permissions Map (`Record`)</h4>
      <ul>
        {Object.entries(permissions).map(([key, value]) => (
          <li key={key}>
            {key}: {value ? "Allowed" : "Denied"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export interface RoleBadgeProps {
  readonly role: StrictRole;
}

export const RoleBadge: React.FC<RoleBadgeProps> = (props) => {
  const { role } = props;
  return <span>Role Badge: {role.toUpperCase()}</span>;
};

// ---------------------------------------------------------------------
// 3. Parent Container Demonstrating All Utility Types
// ---------------------------------------------------------------------

export const UtilityTypesContainer: React.FC = () => {
  const samplePermissions: PermissionsMap = {
    canRead: true,
    canWrite: false,
    canDelete: false,
  };

  return (
    <div>
      <h1>TypeScript Utility Types Architecture</h1>
      <p>Demonstrating prop derivation and transformation utility types.</p>

      <PartialUserCard name="Alice" />
      <hr />
      <RequiredUserCard id="usr_1" name="Bob" email="bob@example.com" role="admin" />
      <hr />
      <ReadonlyUserCard id="usr_2" name="Charlie" role="editor" />
      <hr />
      <UserIdentityCard id="usr_3" name="Diana" />
      <hr />
      <PublicUserCard id="usr_4" name="Evan" />
      <hr />
      <PermissionsList permissions={samplePermissions} />
      <hr />
      <RoleBadge role="viewer" />
    </div>
  );
};

export default UtilityTypesContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Utility Type Derivation: Uses transformation operators to generate exact contracts from domain interfaces.
// - Structural Flexibility: Modifiers dynamically adapt base models to match unique component requirements cleanly.
// - Strict Subsetting: Picking and omitting properties limits component access securely to essential domain fields.
// - Dictionary Mapping: The `Record` type enforces typed key-value structures across configuration interfaces.
// - Single Source Synchronization: Deriving props directly from base types preserves global structural consistency.
