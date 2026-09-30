/**
 * Request State
 * =============
 *
 * Request state is the set of UI-facing values that describe the lifecycle of
 * an asynchronous operation. A practical request state commonly distinguishes
 * idle, loading, success, and error conditions so rendering logic can respond
 * to the current phase without inferring state from unrelated values.
 *
 * Internally, request state changes as the asynchronous operation progresses.
 * A request starts in an idle state, transitions to loading when work begins,
 * then transitions to success with data or error with failure information.
 * Representing the lifecycle explicitly prevents contradictory combinations
 * such as displaying stale data while claiming that no request is active.
 *
 * A discriminated union is useful when the states have different required data.
 * TypeScript can narrow the state from its status property, making it impossible
 * for a success state to accidentally omit its data or for an error state to
 * require data that does not exist.
 *
 * A common edge case is a second request after a successful request. The state
 * must define whether previous data remains visible during loading or is cleared
 * immediately. Both behaviors can be valid, but the choice should be explicit.
 *
 * Another common misconception is that loading is the only request state.
 * Loading describes an active operation, but idle, success, and error provide
 * additional information needed for predictable rendering and interaction.
 */

import React, { useState } from "react";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface IdleRequestState {
  readonly status: "idle";
}

export interface LoadingRequestState {
  readonly status: "loading";
  readonly data: User | null;
}

export interface SuccessRequestState {
  readonly status: "success";
  readonly data: User;
}

export interface ErrorRequestState {
  readonly status: "error";
  readonly message: string;
  readonly data: User | null;
}

export type UserRequestState = IdleRequestState | LoadingRequestState | SuccessRequestState | ErrorRequestState;

export interface RequestStateExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestStateUnionExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestStatePreserveDataExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestStateErrorExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates explicit idle, loading, success, and error states.
 *
 * The discriminated union lets TypeScript determine which fields are available
 * from the status property.
 */
export const RequestStateExample: React.FC<RequestStateExampleProps> = ({
  client,
}: RequestStateExampleProps): React.ReactElement => {
  const [state, setState] = useState<UserRequestState>({
    status: "idle",
  });

  const handleRequest = async (): Promise<void> => {
    setState({
      status: "loading",
      data: null,
    });

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setState({
        status: "success",
        data: response.data,
      });
    } catch {
      setState({
        status: "error",
        message: "Unable to load the user.",
        data: null,
      });
    }
  };

  const renderState = (): React.ReactElement => {
    switch (state.status) {
      case "idle":
        return <p>Ready to request a user.</p>;

      case "loading":
        return <p>Loading user...</p>;

      case "success":
        return <p>Loaded {state.data.name}.</p>;

      case "error":
        return <p role="alert">{state.message}</p>;
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={state.status === "loading"}>
        {state.status === "loading" ? "Loading..." : "Load User"}
      </button>

      {renderState()}
    </section>
  );
};

/**
 * Demonstrates TypeScript narrowing with a discriminated request state.
 *
 * Each switch branch has access only to properties guaranteed by its specific
 * state variant, eliminating unsafe assumptions about data or error fields.
 */
export const RequestStateUnionExample: React.FC<RequestStateUnionExampleProps> = ({
  client,
}: RequestStateUnionExampleProps): React.ReactElement => {
  const [state, setState] = useState<UserRequestState>({
    status: "idle",
  });

  const handleRequest = async (): Promise<void> => {
    setState({
      status: "loading",
      data: null,
    });

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setState({
        status: "success",
        data: response.data,
      });
    } catch (error: unknown) {
      const message: string = axios.isAxiosError(error)
        ? (error as AxiosError).message
        : "An unexpected error occurred.";

      setState({
        status: "error",
        message,
        data: null,
      });
    }
  };

  let content: React.ReactElement;

  if (state.status === "success") {
    content = (
      <p>
        User {state.data.id}: {state.data.name}
      </p>
    );
  } else if (state.status === "error") {
    content = <p role="alert">Error: {state.message}</p>;
  } else if (state.status === "loading") {
    content = <p>Loading...</p>;
  } else {
    content = <p>Idle.</p>;
  }

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={state.status === "loading"}>
        Request With Discriminated State
      </button>

      {content}
    </section>
  );
};

/**
 * Demonstrates preserving previous data while a new request is loading.
 *
 * Keeping previous data in the loading state can prevent unnecessary visual
 * clearing when refreshing an already displayed resource.
 */
export const RequestStatePreserveDataExample: React.FC<RequestStatePreserveDataExampleProps> = ({
  client,
}: RequestStatePreserveDataExampleProps): React.ReactElement => {
  const [state, setState] = useState<UserRequestState>({
    status: "idle",
  });

  const handleRequest = async (): Promise<void> => {
    const previousData: User | null =
      state.status === "success"
        ? state.data
        : state.status === "loading" || state.status === "error"
          ? state.data
          : null;

    setState({
      status: "loading",
      data: previousData,
    });

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setState({
        status: "success",
        data: response.data,
      });
    } catch {
      setState({
        status: "error",
        message: "Refresh failed.",
        data: previousData,
      });
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={state.status === "loading"}>
        Refresh User
      </button>

      {state.status === "loading" && <p>Refreshing...</p>}

      {state.data !== null && <p>Current data: {state.data.name}</p>}

      {state.status === "error" && <p role="alert">{state.message}</p>}
    </section>
  );
};

/**
 * Demonstrates explicit error-state rendering.
 *
 * An error state can retain previous data while separately exposing the error,
 * allowing the UI to display useful stale data together with the failure.
 */
export const RequestStateErrorExample: React.FC<RequestStateErrorExampleProps> = ({
  client,
}: RequestStateErrorExampleProps): React.ReactElement => {
  const [state, setState] = useState<UserRequestState>({
    status: "idle",
  });

  const handleRequest = async (): Promise<void> => {
    setState({
      status: "loading",
      data: null,
    });

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/invalid");

      setState({
        status: "success",
        data: response.data,
      });
    } catch (error: unknown) {
      const message: string = axios.isAxiosError(error) ? error.message : "The request failed.";

      setState({
        status: "error",
        message,
        data: null,
      });
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={state.status === "loading"}>
        Trigger Error State
      </button>

      {state.status === "error" && <p role="alert">Request failed: {state.message}</p>}

      {state.status === "success" && <p>Loaded {state.data.name}.</p>}

      {state.status === "loading" && <p>Request in progress...</p>}

      {state.status === "idle" && <p>No request has started.</p>}
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

export const RequestStateDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Request State</h1>

      <h2>1. Represent Idle, Loading, Success, and Error States</h2>
      <RequestStateExample client={apiClient} />

      <h2>2. Narrow Request States With TypeScript</h2>
      <RequestStateUnionExample client={apiClient} />

      <h2>3. Preserve Existing Data During a Refresh</h2>
      <RequestStatePreserveDataExample client={apiClient} />

      <h2>4. Render Errors as an Explicit Request State</h2>
      <RequestStateErrorExample client={apiClient} />
    </main>
  );
};

export default RequestStateDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Request state describes the lifecycle of an asynchronous operation.
// - A discriminated union can model idle, loading, success, and error states safely.
// - The status field allows TypeScript to narrow state-specific properties.
// - Loading state can intentionally retain previous data during a refresh.
// - Error state can retain previous data when showing stale data is useful.
// - Explicit state transitions prevent UI code from inferring request status indirectly.
// - Loading is only one request state; idle, success, and error are also meaningful states.
