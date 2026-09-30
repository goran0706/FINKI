/**
 * Redux Middleware
 * =================
 *
 * Redux middleware is a layer between dispatching an action and the reducer processing that
 * action. Middleware can inspect actions, perform side effects, transform or delay dispatches,
 * dispatch additional actions, and then pass an action to the next middleware or reducer.
 *
 * Middleware follows a chain. Each middleware receives access to the store's dispatch and
 * getState functions, as well as a next function representing the next step in the chain.
 * Calling next(action) continues the action through the middleware chain. If middleware does
 * not call next, the action does not continue to the reducer.
 *
 * Middleware is commonly used for concerns such as logging, analytics, asynchronous workflows,
 * error reporting, and integration with external systems. Reducers remain pure because these
 * side effects are handled outside reducer functions.
 */

import { applyMiddleware, legacy_createStore as createStore, type Middleware, type UnknownAction } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface MiddlewareState {
  readonly count: number;
  readonly lastAction: string;
}

export interface IncrementAction {
  readonly type: "counter/incremented";
  readonly payload: number;
}

export interface DecrementAction {
  readonly type: "counter/decremented";
  readonly payload: number;
}

export interface ResetAction {
  readonly type: "counter/reset";
}

export interface SetLastAction {
  readonly type: "action/recorded";
  readonly payload: string;
}

export type MiddlewareAction = IncrementAction | DecrementAction | ResetAction | SetLastAction;

export interface MiddlewareExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialState: MiddlewareState = {
  count: 0,
  lastAction: "None",
};

export const middlewareReducer = (state: MiddlewareState = initialState, action: MiddlewareAction): MiddlewareState => {
  switch (action.type) {
    case "counter/incremented":
      return {
        ...state,
        count: state.count + action.payload,
      };

    case "counter/decremented":
      return {
        ...state,
        count: state.count - action.payload,
      };

    case "counter/reset":
      return {
        ...state,
        count: 0,
      };

    case "action/recorded":
      return {
        ...state,
        lastAction: action.payload,
      };

    default:
      return state;
  }
};

export const loggingMiddleware: Middleware<{}, MiddlewareState> = ({ getState }) => {
  return (next) => {
    return (action: unknown) => {
      const result: unknown = next(action);

      if (typeof action === "object" && action !== null && "type" in action && typeof action.type === "string") {
        console.log("Dispatched action:", action.type);
        console.log("Next state:", getState());
      }

      return result;
    };
  };
};

export const recordingMiddleware: Middleware<{}, MiddlewareState> = ({ dispatch }) => {
  return (next) => {
    return (action: unknown) => {
      if (
        typeof action === "object" &&
        action !== null &&
        "type" in action &&
        typeof action.type === "string" &&
        action.type !== "action/recorded"
      ) {
        dispatch({
          type: "action/recorded",
          payload: action.type,
        });
      }

      return next(action);
    };
  };
};

export const middlewareStore = createStore(middlewareReducer, applyMiddleware(loggingMiddleware, recordingMiddleware));

export const MiddlewareDispatchExample: FC<MiddlewareExampleProps> = ({ title }): ReactElement => {
  const count: number = useSelector((state: MiddlewareState): number => state.count);
  const lastAction: string = useSelector((state: MiddlewareState): string => state.lastAction);
  const dispatch = useDispatch();

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <p>Last action: {lastAction}</p>
      <button
        type="button"
        onClick={() => {
          dispatch({
            type: "counter/incremented",
            payload: 1,
          });
        }}
      >
        Increment
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch({
            type: "counter/decremented",
            payload: 1,
          });
        }}
      >
        Decrement
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch({
            type: "counter/reset",
          });
        }}
      >
        Reset
      </button>
    </article>
  );
};

export const MiddlewareChainExample: FC = (): ReactElement => {
  const dispatch = useDispatch();

  const dispatchIncrement = (): void => {
    dispatch({
      type: "counter/incremented",
      payload: 5,
    });
  };

  return (
    <article>
      <h3>Middleware chain</h3>
      <p>The action passes through the middleware chain before reaching the reducer.</p>
      <button type="button" onClick={dispatchIncrement}>
        Dispatch increment
      </button>
    </article>
  );
};

export const MiddlewareWithoutNextExample: FC = (): ReactElement => {
  const blockedActionMiddleware: Middleware<{}, MiddlewareState> = () => {
    return () => {
      return (action: unknown): unknown => {
        console.log("Action stopped by middleware:", action);
        return action;
      };
    };
  };

  return (
    <article>
      <h3>Stopping an action</h3>
      <p>Middleware can prevent an action from reaching later middleware and the reducer by not calling next.</p>
      <p>
        This pattern is useful for conditional dispatch behavior, but it should be used deliberately because the reducer
        will not receive the blocked action.
      </p>
      <p>
        Middleware created inside a component is shown here only to illustrate the concept; application middleware is
        normally configured once when the store is created.
      </p>
      <button
        type="button"
        onClick={() => {
          const action: UnknownAction = {
            type: "counter/incremented",
            payload: 1,
          };

          blockedActionMiddleware({
            getState: () => initialState,
            dispatch: () => action,
          })(() => action)(action);
        }}
      >
        Demonstrate blocked action
      </button>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxMiddlewareDemo: FC = (): ReactElement => {
  return (
    <Provider store={middlewareStore}>
      <section>
        <h2>1. Middleware Can Inspect Actions</h2>
        <MiddlewareDispatchExample title="Logging middleware" />

        <h2>2. Middleware Can Dispatch Actions</h2>
        <MiddlewareChainExample />

        <h2>3. Middleware Can Stop an Action</h2>
        <MiddlewareWithoutNextExample />
      </section>
    </Provider>
  );
};

export default ReduxMiddlewareDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Middleware runs between dispatching an action and reducer processing.
// Middleware receives access to dispatch and getState.
// The next function passes an action to the next middleware in the chain.
// Middleware can inspect actions before passing them onward.
// Middleware can inspect state through getState.
// Middleware can dispatch additional actions.
// Middleware can perform side effects outside reducers.
// Middleware can prevent an action from reaching the reducer by not calling next.
// Middleware can be composed into a chain with applyMiddleware.
// Reducers remain pure while middleware handles side effects and other cross-cutting behavior.
// Middleware is commonly used for logging, analytics, asynchronous workflows, and error reporting.
