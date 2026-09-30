/**
 * State Machine
 * =============
 *
 * A state machine restricts an application or component to a finite number of explicit states and
 * defines valid transition rules between them. State machines prevent impossible or invalid UI states
 * (such as simultaneously loading and displaying an error screen) by guaranteeing that state changes
 * occur strictly through defined triggers.
 *
 * Modeling state with a finite state machine using `useReducer` enforces rigid state transitions,
 * eliminating Boolean flag proliferation and making complex state flows predictable and testable.
 */

import React, { useReducer } from "react";

// ---------------------------------------------------------------------
// 1. Interface & State Machine Types
// ---------------------------------------------------------------------

export type FetchState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "success"; readonly data: string }
  | { readonly status: "error"; readonly error: string };

export type FetchEvent =
  | { readonly type: "FETCH" }
  | { readonly type: "RESOLVE"; readonly data: string }
  | { readonly type: "REJECT"; readonly error: string }
  | { readonly type: "RESET" };

// ---------------------------------------------------------------------
// 2. Finite State Machine Reducer Function
// ---------------------------------------------------------------------

export const initialFetchState: FetchState = { status: "idle" };

export const fetchStateMachineReducer = (state: FetchState, event: FetchEvent): FetchState => {
  switch (state.status) {
    case "idle":
      if (event.type === "FETCH") {
        return { status: "loading" };
      }
      return state;

    case "loading":
      if (event.type === "RESOLVE") {
        return { status: "success", data: event.data };
      }
      if (event.type === "REJECT") {
        return { status: "error", error: event.error };
      }
      return state;

    case "success":
      if (event.type === "RESET") {
        return { status: "idle" };
      }
      if (event.type === "FETCH") {
        return { status: "loading" };
      }
      return state;

    case "error":
      if (event.type === "FETCH") {
        return { status: "loading" };
      }
      if (event.type === "RESET") {
        return { status: "idle" };
      }
      return state;

    default:
      return state;
  }
};

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const StateMachineDataFetcher: React.FC = () => {
  const [state, send] = useReducer(fetchStateMachineReducer, initialFetchState);

  const handleFetchSuccess = (): void => {
    send({ type: "FETCH" });
    setTimeout(() => {
      send({
        type: "RESOLVE",
        data: "Payload retrieved successfully from API server.",
      });
    }, 1000);
  };

  const handleFetchFailure = (): void => {
    send({ type: "FETCH" });
    setTimeout(() => {
      send({
        type: "REJECT",
        error: "500 Internal Server Error: Connection failed.",
      });
    }, 1000);
  };

  return (
    <div>
      <h4>Finite State Machine Data Fetcher</h4>

      <div>
        <button type="button" onClick={handleFetchSuccess} disabled={state.status === "loading"}>
          Simulate Successful Fetch
        </button>
        <button type="button" onClick={handleFetchFailure} disabled={state.status === "loading"}>
          Simulate Failed Fetch
        </button>
        <button
          type="button"
          onClick={() => send({ type: "RESET" })}
          disabled={state.status === "loading" || state.status === "idle"}
        >
          Reset Machine
        </button>
      </div>

      <div>
        <p>
          <strong>Current State:</strong> {state.status.toUpperCase()}
        </p>
        {state.status === "loading" && <p>Fetching requested data...</p>}
        {state.status === "success" && <p>Data: {state.data}</p>}
        {state.status === "error" && <p>Error: {state.error}</p>}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const StateMachineContainer: React.FC = () => {
  return (
    <div>
      <h1>29 - State Machine</h1>

      <h2>1. Finite State Transitions Eliminating Invalid UI States</h2>
      <StateMachineDataFetcher />
    </div>
  );
};

export default StateMachineContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State machines enforce explicit finite states and strict transition pathways.
// - Discriminated unions represent state machine nodes, making impossible states unrepresentable.
// - Reducers process state events, rejecting invalid transitions for the current state.
// - Eliminating boolean flags prevents state synchronization bugs across complex UI flows.
// - Modeling component flows with state machines increases reliability and testability.
