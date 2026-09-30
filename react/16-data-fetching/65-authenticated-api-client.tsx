/**
 * Authenticated API Client
 * ========================
 *
 * An authenticated API client is an HTTP client configured to attach an
 * authentication credential to protected requests. With Axios, an instance can
 * centralize the base URL, request defaults, and authentication behavior so
 * individual components do not need to construct authentication headers for
 * every request.
 *
 * An Axios instance created with axios.create() maintains its own defaults.
 * Request configuration is merged with instance configuration when a request is
 * dispatched. A request-specific Authorization header can therefore override
 * an instance-level authentication header for that individual request.
 *
 * A common authenticated-client design stores the current access token outside
 * individual request components and uses an interceptor or request wrapper to
 * read the current credential immediately before dispatch. Reading the token at
 * request time avoids permanently capturing an outdated token when credentials
 * can change during the application's lifetime.
 *
 * Authentication behavior should be separated from presentation. Components
 * can call an authenticated client without knowing how the Authorization header
 * is constructed. The client is responsible for transport configuration, while
 * the authentication system remains responsible for issuing, refreshing, and
 * invalidating credentials.
 *
 * A common edge case occurs when the token changes after an Axios instance was
 * created. A token copied into instance defaults remains the old value until
 * those defaults are explicitly updated. Reading the current token when each
 * request is prepared avoids that stale-default problem.
 *
 * Another edge case is a missing token. An authenticated client should not send
 * an Authorization header containing an empty bearer credential. Protected
 * requests should either be prevented or allowed to fail according to the
 * application's authentication contract.
 *
 * Authentication headers contain sensitive credentials. They should be sent
 * over HTTPS and should not be rendered into the DOM, included in URLs, or
 * logged unnecessarily.
 */

import React, { useMemo, useRef, useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AuthenticatedUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface AuthenticatedApiClientProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface DynamicAuthenticatedClientProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AuthenticatedClientMissingTokenProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AuthenticatedClientOverrideProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AuthenticatedClientRefreshProps {
  readonly client: AxiosInstance;
  readonly initialAccessToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates an Axios instance that attaches a known access token to
 * protected requests through an instance request interceptor.
 *
 * The interceptor executes when the request is prepared, allowing the current
 * token value held by the component to be used for the request.
 */
export const AuthenticatedApiClient: React.FC<AuthenticatedApiClientProps> = ({
  client,
  accessToken,
}: AuthenticatedApiClientProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const tokenRef = useRef<string | null>(accessToken);

  tokenRef.current = accessToken;

  const authenticatedClient: AxiosInstance = useMemo((): AxiosInstance => {
    const instance: AxiosInstance = axios.create({
      baseURL: client.defaults.baseURL,
      timeout: client.defaults.timeout,
      headers: {
        Accept: "application/json",
      },
    });

    instance.interceptors.request.use((config) => {
      const token: string = tokenRef.current?.trim() ?? "";

      if (token !== "") {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      return config;
    });

    return instance;
  }, [client.defaults.baseURL, client.defaults.timeout]);

  const handleRequest = async (): Promise<void> => {
    if (accessToken?.trim() === "") {
      setMessage("An access token is required.");

      return;
    }

    setLoading(true);
    setMessage("Sending through the authenticated client...");

    try {
      const response: AxiosResponse<AuthenticatedUser> = await authenticatedClient.get<AuthenticatedUser>("/users/me");

      setMessage(`Authenticated request succeeded for ${response.data.name}.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send Authenticated Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates reading the current token when a request is dispatched.
 *
 * Keeping the latest token in a ref lets the interceptor use the current
 * credential without recreating the Axios instance whenever the token changes.
 */
export const DynamicAuthenticatedClient: React.FC<DynamicAuthenticatedClientProps> = ({
  client,
  accessToken,
}: DynamicAuthenticatedClientProps): React.ReactElement => {
  const tokenRef = useRef<string | null>(accessToken);

  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  tokenRef.current = accessToken;

  const authenticatedClient: AxiosInstance = useMemo((): AxiosInstance => {
    const instance: AxiosInstance = axios.create({
      baseURL: client.defaults.baseURL,
      timeout: client.defaults.timeout,
      headers: {
        Accept: "application/json",
      },
    });

    instance.interceptors.request.use((config) => {
      const token: string = tokenRef.current?.trim() ?? "";

      if (token !== "") {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      return config;
    });

    return instance;
  }, [client.defaults.baseURL, client.defaults.timeout]);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Reading the current credential and sending the request...");

    try {
      await authenticatedClient.get<AuthenticatedUser>("/users/me");

      setMessage("Request completed with the current authentication credential.");
    } catch (error: unknown) {
      setMessage(
        axios.isAxiosError(error)
          ? `Request failed with HTTP ${error.response?.status ?? "unknown"}.`
          : "Request failed unexpectedly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Use Current Token"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates preventing a protected request when no access token exists.
 *
 * The client does not construct an Authorization header when the credential is
 * absent. This avoids sending a misleading "Bearer " value to the server.
 */
export const AuthenticatedClientMissingToken: React.FC<AuthenticatedClientMissingTokenProps> = ({
  client,
  accessToken,
}: AuthenticatedClientMissingTokenProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("Request blocked because authentication is unavailable.");

      return;
    }

    setLoading(true);

    try {
      const response: AxiosResponse<AuthenticatedUser> = await client.get<AuthenticatedUser>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(`Request succeeded for ${response.data.name}.`);
    } catch (error: unknown) {
      setMessage(
        axios.isAxiosError(error)
          ? `Request failed with HTTP ${error.response?.status ?? "unknown"}.`
          : "Request failed unexpectedly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Authentication available: {accessToken?.trim() !== "" ? "Yes" : "No"}</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Request Protected Data"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates overriding an instance-level authentication header for one
 * request.
 *
 * Axios request configuration can provide a different Authorization header for
 * an individual operation. The override applies only to that request and does
 * not permanently change the instance's authentication configuration.
 */
export const AuthenticatedClientOverride: React.FC<AuthenticatedClientOverrideProps> = ({
  client,
  accessToken,
}: AuthenticatedClientOverrideProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("An access token is required.");

      return;
    }

    const authenticatedClient: AxiosInstance = axios.create({
      baseURL: client.defaults.baseURL,
      timeout: client.defaults.timeout,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer instance-token",
      },
    });

    setLoading(true);
    setMessage("Sending a request with a request-level authentication override...");

    try {
      await authenticatedClient.get<AuthenticatedUser>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Request completed with the request-level credential.");
    } catch (error: unknown) {
      setMessage(
        axios.isAxiosError(error)
          ? `Request failed with HTTP ${error.response?.status ?? "unknown"}.`
          : "Request failed unexpectedly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Override Authentication"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates keeping the authenticated client's access token synchronized
 * after a credential replacement.
 *
 * The mutable token reference changes without requiring the Axios instance to be
 * recreated. This pattern is useful when a refresh operation replaces the
 * access token while the application remains mounted.
 */
export const AuthenticatedClientRefresh: React.FC<AuthenticatedClientRefreshProps> = ({
  client,
  initialAccessToken,
}: AuthenticatedClientRefreshProps): React.ReactElement => {
  const tokenRef = useRef<string | null>(initialAccessToken);

  const [accessToken, setAccessToken] = useState<string | null>(initialAccessToken);
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const authenticatedClient: AxiosInstance = useMemo((): AxiosInstance => {
    const instance: AxiosInstance = axios.create({
      baseURL: client.defaults.baseURL,
      timeout: client.defaults.timeout,
      headers: {
        Accept: "application/json",
      },
    });

    instance.interceptors.request.use((config) => {
      const token: string = tokenRef.current?.trim() ?? "";

      if (token !== "") {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      return config;
    });

    return instance;
  }, [client.defaults.baseURL, client.defaults.timeout]);

  const handleReplaceToken = (): void => {
    const replacementToken: string = "replacement-access-token";

    tokenRef.current = replacementToken;

    setAccessToken(replacementToken);

    setMessage("The authenticated client will use the replacement token for its next request.");
  };

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending with the currently stored access token...");

    try {
      await authenticatedClient.get<AuthenticatedUser>("/users/me");

      setMessage("Authenticated request succeeded.");
    } catch (error: unknown) {
      setMessage(
        axios.isAxiosError(error)
          ? `Request failed with HTTP ${error.response?.status ?? "unknown"}.`
          : "Request failed unexpectedly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Current credential available: {accessToken !== null ? "Yes" : "No"}</p>

      <button type="button" onClick={handleReplaceToken}>
        Replace Access Token
      </button>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send With Current Token"}
      </button>

      <p role="status">{message}</p>
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

const exampleAccessToken: string = "example-access-token";

export const AuthenticatedApiClientDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Authenticated API Client</h1>

      <h2>1. Attach Authentication Through an Axios Client</h2>
      <AuthenticatedApiClient client={apiClient} accessToken={exampleAccessToken} />

      <h2>2. Read the Current Token When the Request Is Dispatched</h2>
      <DynamicAuthenticatedClient client={apiClient} accessToken={exampleAccessToken} />

      <h2>3. Prevent Protected Requests Without Authentication</h2>
      <AuthenticatedClientMissingToken client={apiClient} accessToken={exampleAccessToken} />

      <h2>4. Override Authentication for One Request</h2>
      <AuthenticatedClientOverride client={apiClient} accessToken={exampleAccessToken} />

      <h2>5. Synchronize the Client After Replacing an Access Token</h2>
      <AuthenticatedClientRefresh client={apiClient} initialAccessToken={exampleAccessToken} />
    </main>
  );
};

export default AuthenticatedApiClientDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An authenticated API client centralizes authentication behavior for protected HTTP requests.
// - An Axios request interceptor can attach the current bearer token when a request is dispatched.
// - Reading the current credential at request time helps avoid stale authentication headers.
// - Missing credentials should not produce an empty Authorization header.
// - Request configuration can override an instance-level Authorization header for one operation.
// - A mutable token reference can keep an existing authenticated client synchronized after token replacement.
// - Authentication transport and token issuance or renewal are separate responsibilities.
// - Authentication credentials should be transmitted over HTTPS and should not be rendered, placed in URLs, or logged unnecessarily.
