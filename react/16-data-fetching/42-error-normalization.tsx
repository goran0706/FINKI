/**
 * Error Normalization
 * ===================
 *
 * Error normalization converts different failure representations into one
 * predictable application-level error shape. HTTP clients can produce errors
 * containing status codes, response bodies, network failures, configuration
 * failures, or generic JavaScript errors. Exposing those transport-specific
 * structures throughout an application makes error handling inconsistent.
 *
 * Internally, a normalization function inspects an unknown thrown value and
 * maps it into a stable application error type. The resulting error can contain
 * information such as a machine-readable code, optional HTTP status, and a
 * user-safe message without requiring UI components to understand Axios or
 * another transport library.
 *
 * Error normalization should accept unknown rather than Error because JavaScript
 * allows any value to be thrown. A thrown string, object, null value, or custom
 * error therefore needs to be handled safely before properties are accessed.
 *
 * A common edge case is an HTTP error whose response body does not contain the
 * expected error fields. The normalizer must fall back to a safe message rather
 * than assuming the server returned a particular structure. Network errors
 * should likewise be distinguished from responses that contain an HTTP status.
 *
 * Error normalization is not the same as error presentation. The normalizer
 * establishes a stable application contract, while a component can decide how
 * that normalized error should be displayed.
 */

import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ApiErrorResponse {
  readonly code?: string;
  readonly message?: string;
}

export interface NormalizedError {
  readonly code: string;
  readonly message: string;
  readonly status: number | null;
  readonly kind: "http" | "network" | "unknown";
}

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface ErrorNormalizationHttpExampleProps {
  readonly error: unknown;
}

export interface ErrorNormalizationUnknownExampleProps {
  readonly error: unknown;
}

export interface ErrorNormalizationBoundaryExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Error Normalization
// ---------------------------------------------------------------------

/**

* Converts an unknown thrown value into a stable application error.
*
* Axios errors are inspected with axios.isAxiosError() instead of relying on
* instanceof AxiosError, which is safer across package boundaries and follows
* Axios's runtime type guard.
  */
export const normalizeError = (error: unknown): NormalizedError => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const axiosError: AxiosError<ApiErrorResponse> = error;
    const response: AxiosResponse<ApiErrorResponse> | undefined = axiosError.response;

    if (response !== undefined) {
      const responseData: ApiErrorResponse | undefined = response.data;

      return {
        code: responseData?.code ?? "HTTP_ERROR",
        message: responseData?.message ?? axiosError.message ?? "The request failed.",
        status: response.status,
        kind: "http",
      };
    }

    return {
      code: "NETWORK_ERROR",
      message: "The server could not be reached.",
      status: null,
      kind: "network",
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
      status: null,
      kind: "unknown",
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred.",
    status: null,
    kind: "unknown",
  };
};

// ---------------------------------------------------------------------
// 3. HTTP Error Normalization
// ---------------------------------------------------------------------

/**

* Demonstrates normalization of an HTTP error.
*
* The component receives an unknown error and uses the normalized contract
* instead of accessing Axios-specific response properties directly.
  */
export const ErrorNormalizationHttpExample: FC<ErrorNormalizationHttpExampleProps> = ({ error }): ReactElement => {
  const [normalized, setNormalized] = useState<NormalizedError | null>(null);

  const handleNormalize = (): void => {
    const result: NormalizedError = normalizeError(error);
    setNormalized(result);
  };

  return (
    <section>
      {" "}
      <button type="button" onClick={handleNormalize}>
        Normalize HTTP Error{" "}
      </button>
      {normalized !== null && (
        <dl>
          <dt>Kind</dt>
          <dd>{normalized.kind}</dd>

          <dt>Code</dt>
          <dd>{normalized.code}</dd>

          <dt>Status</dt>
          <dd>{normalized.status ?? "None"}</dd>

          <dt>Message</dt>
          <dd>{normalized.message}</dd>
        </dl>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 4. Unknown Error Normalization
// ---------------------------------------------------------------------

/**

* Demonstrates the unknown-value edge case.
*
* JavaScript permits values other than Error to be thrown, so the normalizer
* must safely handle values such as strings without reading Error properties
* from them.
  */
export const ErrorNormalizationUnknownExample: FC<ErrorNormalizationUnknownExampleProps> = ({
  error,
}): ReactElement => {
  const [message, setMessage] = useState<string>("No error has been normalized.");

  const handleNormalize = (): void => {
    const normalized: NormalizedError = normalizeError(error);

    setMessage(`${normalized.code}: ${normalized.message}`);
  };

  return (
    <section>
      {" "}
      <button type="button" onClick={handleNormalize}>
        Normalize Unknown Error{" "}
      </button>
      <p role="status">{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 5. Application Boundary Normalization
// ---------------------------------------------------------------------

/**

* Demonstrates normalization at an application boundary.
*
* The request handler converts transport failures into NormalizedError before
* updating component state, keeping transport-specific error inspection out of
* the rendering logic.
  */
export const ErrorNormalizationBoundaryExample: FC<ErrorNormalizationBoundaryExampleProps> = ({
  client,
}): ReactElement => {
  const [error, setError] = useState<NormalizedError | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleRequest = async (): Promise<void> => {
    setError(null);
    setUser(null);

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/999999");
      setUser(response.data);
    } catch (requestError: unknown) {
      const normalized: NormalizedError = normalizeError(requestError);
      setError(normalized);
    }
  };

  return (
    <section>
      {" "}
      <button type="button" onClick={handleRequest}>
        Request and Normalize Errors{" "}
      </button>
      {user !== null && <p>{user.name}</p>}
      {error !== null && (
        <p role="alert">
          {error.code}: {error.message}
        </p>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 6. Main Container Component
// ---------------------------------------------------------------------

const httpError: AxiosError<ApiErrorResponse> = new AxiosError<ApiErrorResponse>(
  "Request failed",
  "ERR_BAD_REQUEST",
  undefined,
  undefined,
  {
    data: {
      code: "USER_NOT_FOUND",
      message: "The requested user does not exist.",
    },
    status: 404,
    statusText: "Not Found",
    headers: {},
    config: {} as AxiosError<ApiErrorResponse>["config"],
  },
);

const unknownThrownValue: unknown = "A non-Error value was thrown.";

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
});

export const ErrorNormalizationDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Error Normalization</h1>

      <h2>1. Convert HTTP Errors Into a Stable Error Shape</h2>
      <ErrorNormalizationHttpExample error={httpError} />

      <h2>2. Safely Handle Values That Are Not Error Objects</h2>
      <ErrorNormalizationUnknownExample error={unknownThrownValue} />

      <h2>3. Normalize Errors at the Application Boundary</h2>
      <ErrorNormalizationBoundaryExample client={apiClient} />
    </main>
  );
};

export default ErrorNormalizationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Error normalization converts transport failures into a stable application error shape.
// - Normalizers should accept unknown because JavaScript permits any thrown value.
// - axios.isAxiosError() provides a runtime-safe way to identify Axios errors.
// - HTTP errors can expose a status and server-provided error information.
// - Network failures may have no HTTP response and should be handled separately.
// - Unknown or malformed errors should receive safe fallback codes and messages.
// - Error normalization establishes an application contract; presentation remains a UI concern.
