/**
 * Axios Response
 * ==============
 *
 * An Axios response represents the result of a completed HTTP request. The
 * response object contains the parsed response body in data, the HTTP status
 * code in status, status text in statusText, response headers in headers, the
 * original request configuration in config, and the underlying request object
 * in request when available.
 *
 * Axios resolves a request promise with an AxiosResponse when the response
 * status satisfies the configured validateStatus function. The response body
 * is transformed according to Axios's response transformation pipeline before
 * becoming available through response.data.
 *
 * The generic parameter supplied to Axios methods such as get<TResponse>()
 * describes the expected type of response.data. It does not validate the
 * server response at runtime. A server can return data that does not match
 * the TypeScript type, so runtime validation is required when untrusted
 * external data must be guaranteed to have a particular shape.
 *
 * A common misconception is that response.data contains the complete HTTP
 * response. It contains only the response body. Metadata such as the status
 * code and headers remains on the AxiosResponse object itself.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface AxiosResponseExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosResponseMetadataExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosResponseDataExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosResponseTypeSafetyExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the response body through response.data.
 *
 * The generic argument User tells TypeScript what the application expects to
 * receive in response.data.
 */
export const AxiosResponseDataExample: React.FC<AxiosResponseDataExampleProps> = ({
  client,
}: AxiosResponseDataExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoadUser = async (): Promise<void> => {
    setLoading(true);

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleLoadUser} disabled={loading}>
        {loading ? "Loading..." : "Read response.data"}
      </button>

      {user !== null && (
        <p>
          {user.name} — {user.email}
        </p>
      )}
    </section>
  );
};

/**
 * Demonstrates response metadata.
 *
 * The response body and HTTP metadata are separate parts of AxiosResponse.
 * This is useful when application behavior depends on status codes or headers.
 */
export const AxiosResponseMetadataExample: React.FC<AxiosResponseMetadataExampleProps> = ({
  client,
}: AxiosResponseMetadataExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleInspectResponse = async (): Promise<void> => {
    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      const contentType: string = response.headers["content-type"] ?? "Unknown content type";

      setMessage(`Status: ${response.status}; Content-Type: ${contentType}`);
    } catch {
      setMessage("The response could not be inspected.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleInspectResponse}>
        Inspect Response Metadata
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates that the response generic describes expected data rather than
 * performing runtime validation.
 *
 * TypeScript uses the declared User type during compilation, but Axios does
 * not independently verify that the server returned every User property.
 */
export const AxiosResponseTypeSafetyExample: React.FC<AxiosResponseTypeSafetyExampleProps> = ({
  client,
}: AxiosResponseTypeSafetyExampleProps): React.ReactElement => {
  const [userName, setUserName] = useState<string>("");

  const handleReadUser = async (): Promise<void> => {
    const response: AxiosResponse<User> = await client.get<User>("/users/1");

    setUserName(response.data.name);
  };

  return (
    <section>
      <button type="button" onClick={handleReadUser}>
        Read Typed Response
      </button>

      {userName !== "" && <p>User name: {userName}</p>}
    </section>
  );
};

/**
 * Demonstrates an edge case where a successful HTTP response contains an empty
 * body. AxiosResponse.data can therefore be empty or otherwise different from
 * the application's expected domain representation depending on the endpoint.
 */
export const AxiosResponseEmptyBodyExample: React.FC<AxiosResponseExampleProps> = ({
  client,
}: AxiosResponseExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    try {
      const response: AxiosResponse<void> = await client.delete<void>("/users/1");

      setMessage(`Request completed with HTTP ${response.status}.`);
    } catch {
      setMessage("The request failed.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Handle Empty Response Body
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
});

export const AxiosResponseDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Axios Response</h1>

      <h2>1. Read the Response Body With data</h2>
      <AxiosResponseDataExample client={apiClient} />

      <h2>2. Read HTTP Status and Headers</h2>
      <AxiosResponseMetadataExample client={apiClient} />

      <h2>3. Understand TypeScript Response Types</h2>
      <AxiosResponseTypeSafetyExample client={apiClient} />

      <h2>4. Handle Responses With Empty Bodies</h2>
      <AxiosResponseEmptyBodyExample client={apiClient} />
    </main>
  );
};

export default AxiosResponseDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - AxiosResponse contains response data and HTTP response metadata.
// - response.data contains the parsed response body.
// - response.status contains the HTTP status code.
// - response.headers contains response header values.
// - The generic passed to an Axios method describes the expected data type.
// - TypeScript response types do not perform runtime validation.
// - Some successful HTTP operations intentionally return an empty response body.
