/**
 * Response Normalization
 * ======================
 *
 * Response normalization converts API responses into a consistent application
 * shape before the data is consumed by components or other application layers.
 * APIs may return different property names, nested envelopes, nullable values,
 * or inconsistent representations that are inconvenient for UI code.
 *
 * Internally, a normalization function receives the transport response and
 * maps its fields into a stable domain type. For example, an API response such
 * as { user_id, full_name } can be converted into { id, name }. The normalized
 * type becomes the contract used by the rest of the application.
 *
 * Normalization is different from validation. Normalization transforms data
 * into an application shape, while validation determines whether the incoming
 * data satisfies the expected structure. A robust implementation can perform
 * both operations, but transformation alone does not prove that arbitrary
 * runtime data is valid.
 *
 * A common edge case is nullable or missing API fields. A normalizer should
 * define an explicit policy for those values instead of relying on accidental
 * JavaScript coercion. Another edge case is nested response envelopes: the
 * normalizer should remove transport-specific wrappers when those wrappers are
 * not meaningful to application code.
 *
 * Normalization should also avoid mutating the original response object.
 * Creating a new application object keeps the transport response immutable
 * from the perspective of the consuming layer and prevents unexpected changes
 * to shared data.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ApiUserResponse {
  readonly user_id: number;
  readonly full_name: string;
  readonly email_address: string;
  readonly is_active: boolean;
}

export interface ApiUserEnvelope {
  readonly data: ApiUserResponse;
}

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly active: boolean;
}

export interface UserSummary {
  readonly id: number;
  readonly displayName: string;
}

export interface ResponseNormalizationExampleProps {
  readonly response: ApiUserEnvelope;
}

export interface ResponseNormalizationListExampleProps {
  readonly responses: readonly ApiUserResponse[];
}

export interface ResponseNormalizationEdgeCaseExampleProps {
  readonly response: ApiUserResponse | null;
}

export interface ResponseNormalizationBoundaryExampleProps {
  readonly response: ApiUserEnvelope;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Converts one transport-specific user response into the application User type.
 *
 * The function creates a new object instead of mutating the API response.
 * This keeps API naming conventions isolated at the normalization boundary.
 */
export const normalizeUser = (response: ApiUserResponse): User => {
  return {
    id: response.user_id,
    name: response.full_name,
    email: response.email_address,
    active: response.is_active,
  };
};

/**
 * Removes the API response envelope and normalizes its contained resource.
 *
 * The application receives User instead of needing to know that the API wraps
 * the resource inside a data property.
 */
export const normalizeUserEnvelope = (response: ApiUserEnvelope): User => {
  return normalizeUser(response.data);
};

/**
 * Demonstrates basic response normalization.
 *
 * The component receives an API-shaped object but displays the normalized
 * application object.
 */
export const ResponseNormalizationExample: React.FC<ResponseNormalizationExampleProps> = ({
  response,
}: ResponseNormalizationExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);

  const handleNormalize = (): void => {
    const normalizedUser: User = normalizeUserEnvelope(response);

    setUser(normalizedUser);
  };

  return (
    <section>
      <button type="button" onClick={handleNormalize}>
        Normalize Response
      </button>

      {user !== null && (
        <dl>
          <dt>ID</dt>
          <dd>{user.id}</dd>

          <dt>Name</dt>
          <dd>{user.name}</dd>

          <dt>Email</dt>
          <dd>{user.email}</dd>

          <dt>Active</dt>
          <dd>{user.active ? "Yes" : "No"}</dd>
        </dl>
      )}
    </section>
  );
};

/**
 * Demonstrates normalization of multiple API records.
 *
 * Array normalization applies the same mapping function to every transport
 * record while preserving the order of the original response.
 */
export const ResponseNormalizationListExample: React.FC<ResponseNormalizationListExampleProps> = ({
  responses,
}: ResponseNormalizationListExampleProps): React.ReactElement => {
  const [users, setUsers] = useState<readonly User[]>([]);

  const handleNormalizeList = (): void => {
    const normalizedUsers: readonly User[] = responses.map((response: ApiUserResponse): User =>
      normalizeUser(response),
    );

    setUsers(normalizedUsers);
  };

  return (
    <section>
      <button type="button" onClick={handleNormalizeList}>
        Normalize User List
      </button>

      <ul>
        {users.map((user: User): React.ReactElement => (
          <li key={user.id}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Demonstrates an explicit null-response policy.
 *
 * A nullable API response is handled before normalization rather than passing
 * null into a function that requires a concrete ApiUserResponse.
 */
export const ResponseNormalizationEdgeCaseExample: React.FC<ResponseNormalizationEdgeCaseExampleProps> = ({
  response,
}: ResponseNormalizationEdgeCaseExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("No normalized user has been produced.");

  const handleNormalize = (): void => {
    if (response === null) {
      setMessage("The API returned no user.");
      return;
    }

    const user: User = normalizeUser(response);

    setMessage(`Normalized user: ${user.name}.`);
  };

  return (
    <section>
      <button type="button" onClick={handleNormalize}>
        Handle Nullable Response
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates that normalized data can be transformed again for a specific
 * application use case.
 *
 * The service boundary can expose User while a presentation-specific component
 * can derive UserSummary without depending on API field names.
 */
export const ResponseNormalizationBoundaryExample: React.FC<ResponseNormalizationBoundaryExampleProps> = ({
  response,
}: ResponseNormalizationBoundaryExampleProps): React.ReactElement => {
  const [summary, setSummary] = useState<UserSummary | null>(null);

  const handleCreateSummary = (): void => {
    const user: User = normalizeUserEnvelope(response);

    const userSummary: UserSummary = {
      id: user.id,
      displayName: user.name,
    };

    setSummary(userSummary);
  };

  return (
    <section>
      <button type="button" onClick={handleCreateSummary}>
        Create Application Summary
      </button>

      {summary !== null && (
        <p>
          {summary.id}: {summary.displayName}
        </p>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const exampleResponse: ApiUserEnvelope = {
  data: {
    user_id: 1,
    full_name: "John Doe",
    email_address: "john.doe@example.com",
    is_active: true,
  },
};

const exampleResponses: readonly ApiUserResponse[] = [
  {
    user_id: 1,
    full_name: "John Doe",
    email_address: "john.doe@example.com",
    is_active: true,
  },
  {
    user_id: 2,
    full_name: "Jane Doe",
    email_address: "jane.doe@example.com",
    is_active: false,
  },
];

const nullableResponse: ApiUserResponse | null = null;

export const ResponseNormalizationDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Response Normalization</h1>

      <h2>1. Map API Fields Into an Application Type</h2>
      <ResponseNormalizationExample response={exampleResponse} />

      <h2>2. Normalize a Collection of API Responses</h2>
      <ResponseNormalizationListExample responses={exampleResponses} />

      <h2>3. Handle Missing or Nullable API Responses Explicitly</h2>
      <ResponseNormalizationEdgeCaseExample response={nullableResponse} />

      <h2>4. Keep API Shapes Outside Application-Facing Data</h2>
      <ResponseNormalizationBoundaryExample response={exampleResponse} />
    </main>
  );
};

export default ResponseNormalizationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Response normalization maps transport-specific data into stable application types.
// - Normalizers can rename fields and remove transport-specific response envelopes.
// - Normalization should create new objects instead of mutating API responses.
// - Collection responses can be normalized with Array.prototype.map().
// - Nullable responses require an explicit handling policy before normalization.
// - Normalization transforms data but does not by itself validate arbitrary runtime input.
// - Keeping API field names at the normalization boundary reduces transport coupling.
