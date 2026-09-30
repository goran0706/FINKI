/**
 * API Client Configuration
 * ========================
 *
 * API client configuration centralizes the transport settings shared by
 * requests made through an API client. Typical configuration includes the
 * API base URL, timeout, default headers, and request behavior.
 *
 * An Axios instance stores these defaults and applies them to requests made
 * through that instance. Request-specific configuration can override
 * applicable defaults without changing the instance configuration itself.
 *
 * Configuration can also be separated by responsibility. For example, a
 * public API client and an administrative API client can use different base
 * URLs, timeouts, and default headers while remaining independent Axios
 * instances.
 *
 * A common misconception is that configuration values are automatically
 * environment-specific. A client only receives the values explicitly supplied
 * to it. Applications commonly construct configuration from their runtime
 * environment, but the configuration object itself does not automatically
 * discover deployment settings.
 *
 * Another edge case concerns credentials and secrets. Browser-side client
 * configuration should not contain credentials that must remain secret,
 * because values included in frontend JavaScript can be inspected by users.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ApiClientConfiguration {
  readonly baseURL: string;
  readonly timeout: number;
  readonly headers: Readonly<Record<string, string>>;
}

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface ApiClientConfigurationExampleProps {
  readonly client: AxiosInstance;
}

export interface ApiClientConfigurationOverrideExampleProps {
  readonly client: AxiosInstance;
}

export interface ApiClientConfigurationIsolationExampleProps {
  readonly publicClient: AxiosInstance;
  readonly adminClient: AxiosInstance;
}

export interface ApiClientConfigurationDisplayExampleProps {
  readonly configuration: ApiClientConfiguration;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates an Axios client from explicit application configuration.
 *
 * Keeping configuration creation in one function makes the relationship
 * between application configuration and the Axios instance explicit.
 */
export const createApiClient = (configuration: ApiClientConfiguration): AxiosInstance => {
  return axios.create({
    baseURL: configuration.baseURL,
    timeout: configuration.timeout,
    headers: configuration.headers,
  });
};

/**
 * Demonstrates shared client configuration.
 *
 * The request does not repeat the base URL or default Accept header because
 * those values belong to the Axios instance configuration.
 */
export const ApiClientConfigurationExample: React.FC<ApiClientConfigurationExampleProps> = ({
  client,
}: ApiClientConfigurationExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    setMessage("");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
    } catch {
      setUser(null);
      setMessage("The configured API client could not complete the request.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Request With Client Defaults
      </button>

      {user !== null && (
        <p>
          {user.name} — {user.email}
        </p>
      )}

      {message !== "" && <p role="alert">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates request-level configuration overriding an instance default.
 *
 * The timeout supplied directly to the request applies only to that request.
 * It does not mutate the timeout stored in client.defaults.
 */
export const ApiClientConfigurationOverrideExample: React.FC<ApiClientConfigurationOverrideExampleProps> = ({
  client,
}: ApiClientConfigurationOverrideExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    const requestConfig: AxiosRequestConfig = {
      timeout: 1000,
    };

    try {
      await client.get<User>("/users/1", requestConfig);

      setMessage("Request completed using its request-specific timeout.");
    } catch {
      setMessage("The request failed or exceeded its timeout.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Override Request Timeout
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates independent client configurations.
 *
 * Separate instances prevent configuration intended for one API from being
 * silently inherited by another API client.
 */
export const ApiClientConfigurationIsolationExample: React.FC<ApiClientConfigurationIsolationExampleProps> = ({
  publicClient,
  adminClient,
}: ApiClientConfigurationIsolationExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleInspectConfiguration = (): void => {
    const publicBaseURL: string = publicClient.defaults.baseURL ?? "No base URL";

    const adminBaseURL: string = adminClient.defaults.baseURL ?? "No base URL";

    setMessage(`Public API: ${publicBaseURL}; Admin API: ${adminBaseURL}`);
  };

  return (
    <section>
      <button type="button" onClick={handleInspectConfiguration}>
        Inspect Separate Client Configuration
      </button>

      {message !== "" && <p>{message}</p>}
    </section>
  );
};

/**
 * Demonstrates displaying configuration without exposing mutable Axios
 * configuration directly to a presentation component.
 *
 * The readonly configuration interface communicates that this example treats
 * configuration as application data rather than something the component should
 * mutate.
 */
export const ApiClientConfigurationDisplayExample: React.FC<ApiClientConfigurationDisplayExampleProps> = ({
  configuration,
}: ApiClientConfigurationDisplayExampleProps): React.ReactElement => {
  return (
    <section>
      <p>Base URL: {configuration.baseURL}</p>
      <p>Timeout: {configuration.timeout} ms</p>
      <p>Accept header: {configuration.headers.Accept ?? "Not configured"}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const publicApiConfiguration: ApiClientConfiguration = {
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
};

const adminApiConfiguration: ApiClientConfiguration = {
  baseURL: "https://admin.example.com",
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "X-Client-Type": "admin",
  },
};

const publicApiClient: AxiosInstance = createApiClient(publicApiConfiguration);

const adminApiClient: AxiosInstance = createApiClient(adminApiConfiguration);

export const ApiClientConfigurationDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>API Client Configuration</h1>

      <h2>1. Apply Shared Configuration to an API Client</h2>
      <ApiClientConfigurationExample client={publicApiClient} />

      <h2>2. Override Configuration for One Request</h2>
      <ApiClientConfigurationOverrideExample client={publicApiClient} />

      <h2>3. Keep Different API Clients Independently Configured</h2>
      <ApiClientConfigurationIsolationExample publicClient={publicApiClient} adminClient={adminApiClient} />

      <h2>4. Represent Client Configuration as Typed Application Data</h2>
      <ApiClientConfigurationDisplayExample configuration={publicApiConfiguration} />
    </main>
  );
};

export default ApiClientConfigurationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - API client configuration centralizes shared transport settings.
// - Axios instances apply defaults such as baseURL, timeout, and headers.
// - Request-specific configuration can override applicable instance defaults.
// - Request-level overrides do not change the instance's stored defaults.
// - Separate Axios instances can isolate configuration for different APIs.
// - Frontend configuration must not contain secrets that need to remain private.
// - Typed configuration objects make client construction explicit and predictable.
