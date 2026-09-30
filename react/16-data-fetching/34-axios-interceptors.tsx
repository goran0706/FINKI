/**
 * Axios Interceptors
 * ==================
 *
 * Axios interceptors are middleware-like handlers that run before a request is
 * sent or after a response is received. Request interceptors can inspect or
 * modify request configuration, while response interceptors can transform
 * successful responses or process rejected responses.
 *
 * Interceptors are registered on an Axios instance with interceptors.request.use()
 * or interceptors.response.use(). Each registration returns an identifier that
 * can later be passed to eject() to remove that interceptor. Interceptors added
 * to an instance affect requests made through that instance.
 *
 * Request interceptors execute as part of Axios's request pipeline before the
 * adapter performs the network operation. Response interceptors execute after
 * the adapter produces a response or rejection. Multiple interceptors therefore
 * form an ordered processing pipeline rather than independent callbacks.
 *
 * A common use case is attaching shared headers, such as a request identifier,
 * without repeating the logic at every call site. Response interceptors can
 * similarly normalize successful responses or centralize error processing.
 *
 * Interceptors are not automatically scoped to a React component lifecycle.
 * Registering one during every render or every effect execution without proper
 * cleanup can create duplicate handlers. When an interceptor is registered
 * dynamically, its returned identifier should be retained and the interceptor
 * should be ejected when it is no longer needed.
 */

import React, { useEffect, useState } from "react";
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface AxiosRequestInterceptorExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosResponseInterceptorExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosInterceptorCleanupExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosInterceptorErrorExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a request interceptor that adds a request header.
 *
 * The interceptor receives InternalAxiosRequestConfig because Axios has
 * already normalized the request configuration by the time it reaches the
 * request interceptor pipeline.
 */
export const AxiosRequestInterceptorExample: React.FC<AxiosRequestInterceptorExampleProps> = ({
  client,
}: AxiosRequestInterceptorExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  useEffect((): (() => void) => {
    const interceptorId: number = client.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        config.headers.set("X-Client-Type", "react-example");

        return config;
      },
    );

    return (): void => {
      client.interceptors.request.eject(interceptorId);
    };
  }, [client]);

  const handleRequest = async (): Promise<void> => {
    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setMessage(`Loaded ${response.data.name}.`);
    } catch {
      setMessage("The request failed.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Send Request With Interceptor
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates a response interceptor that transforms successful responses.
 *
 * The interceptor receives AxiosResponse and returns the same response after
 * updating its data. The component still receives the resulting AxiosResponse.
 */
export const AxiosResponseInterceptorExample: React.FC<AxiosResponseInterceptorExampleProps> = ({
  client,
}: AxiosResponseInterceptorExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);

  useEffect((): (() => void) => {
    const interceptorId: number = client.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
      if (response.data !== null && typeof response.data === "object" && "name" in response.data) {
        const data: Record<string, unknown> = response.data as Record<string, unknown>;

        if (typeof data.name === "string") {
          data.name = data.name.trim();
        }
      }

      return response;
    });

    return (): void => {
      client.interceptors.response.eject(interceptorId);
    };
  }, [client]);

  const handleRequest = async (): Promise<void> => {
    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
    } catch {
      setUser(null);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Send Request Through Response Interceptor
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
 * Demonstrates interceptor cleanup.
 *
 * eject() removes the exact interceptor identified by the registration ID.
 * Cleanup is important for dynamically registered interceptors because an
 * Axios instance otherwise retains the handler for future requests.
 */
export const AxiosInterceptorCleanupExample: React.FC<AxiosInterceptorCleanupExampleProps> = ({
  client,
}: AxiosInterceptorCleanupExampleProps): React.ReactElement => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Interceptor is disabled.");

  useEffect((): (() => void) | undefined => {
    if (!enabled) {
      return undefined;
    }

    const interceptorId: number = client.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        config.headers.set("X-Debug-Interceptor", "enabled");

        return config;
      },
    );

    setMessage("Interceptor is enabled.");

    return (): void => {
      client.interceptors.request.eject(interceptorId);
    };
  }, [client, enabled]);

  const handleToggle = (): void => {
    setEnabled((previous: boolean): boolean => !previous);
  };

  return (
    <section>
      <button type="button" onClick={handleToggle}>
        {enabled ? "Disable Interceptor" : "Enable Interceptor"}
      </button>

      <p>{message}</p>
    </section>
  );
};

/**
 * Demonstrates a response error interceptor.
 *
 * The second callback supplied to response.use() receives rejected responses.
 * Returning Promise.reject(error) preserves the rejection for the calling code
 * instead of silently converting the failed request into a successful result.
 */
export const AxiosInterceptorErrorExample: React.FC<AxiosInterceptorErrorExampleProps> = ({
  client,
}: AxiosInterceptorErrorExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  useEffect((): (() => void) => {
    const interceptorId: number = client.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => response,
      (error: AxiosError): Promise<never> => {
        if (error.response !== undefined) {
          setMessage(`API error: HTTP ${error.response.status}`);
        }

        return Promise.reject(error);
      },
    );

    return (): void => {
      client.interceptors.response.eject(interceptorId);
    };
  }, [client]);

  const handleRequest = async (): Promise<void> => {
    try {
      await client.get<User>("/users/invalid");
      setMessage("Request succeeded.");
    } catch {
      setMessage((previous: string): string => (previous.startsWith("API error:") ? previous : "Request failed."));
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Test Response Error Interceptor
      </button>

      {message !== "" && <p role="alert">{message}</p>}
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

export const AxiosInterceptorsDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Axios Interceptors</h1>

      <h2>1. Modify Requests With a Request Interceptor</h2>
      <AxiosRequestInterceptorExample client={apiClient} />

      <h2>2. Process Successful Responses With a Response Interceptor</h2>
      <AxiosResponseInterceptorExample client={apiClient} />

      <h2>3. Register and Remove Interceptors Dynamically</h2>
      <AxiosInterceptorCleanupExample client={apiClient} />

      <h2>4. Process Errors Without Swallowing Rejections</h2>
      <AxiosInterceptorErrorExample client={apiClient} />
    </main>
  );
};

export default AxiosInterceptorsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Request interceptors can inspect or modify request configuration before
//   the network adapter sends the request.
// - Response interceptors can process successful responses or rejected errors.
// - Every interceptor registration returns an identifier that can be passed
//   to eject() when the interceptor should be removed.
// - Dynamically registered interceptors should be cleaned up to prevent
//   duplicate handlers and unintended behavior.
// - Error interceptors should preserve rejected promises when callers still
//   need to handle the original request failure.
// - Interceptors belong to the Axios instance on which they are registered.
