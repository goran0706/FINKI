/**
 * Redux
 * =====
 *
 * Redux is a predictable state-management library for managing shared application state. It
 * centralizes client state in a store and defines a one-way data flow in which the UI dispatches
 * actions, reducers calculate the next state, and subscribed UI code renders from that state.
 *
 * The core Redux model is built around three concepts: state, actions, and reducers. State
 * describes the current condition of the application, an action describes what happened, and a
 * reducer calculates the next state from the previous state and the action.
 *
 * Redux itself is independent of React. When Redux is used with React, React-Redux provides the
 * integration layer that lets React components subscribe to store state and dispatch actions.
 * Modern Redux applications normally use Redux Toolkit for store setup and reducer logic. This
 * example focuses on the underlying Redux model so that the responsibilities of the core pieces
 * remain explicit.
 *
 * Redux state should be treated as read-only by application code. State changes happen by
 * dispatching actions, and reducers must calculate new state without mutating the existing state.
 * This predictable update model makes state changes explicit and traceable.
 */

import type { Action, Dispatch, Reducer } from "redux";
import { legacy_createStore as createStore } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ReduxState {
  readonly count: number;
  readonly theme: "light" | "dark";
}

export interface IncrementAction extends Action<"counter/incremented"> {
  readonly payload: number;
}

export interface ToggleThemeAction extends Action<"theme/toggled"> {
  readonly payload?: undefined;
}

export type ReduxAction = IncrementAction | ToggleThemeAction;

export interface ReduxCounterProps {
  readonly label: string;
}

export interface ReduxThemeProps {
  readonly label: string;
}

export interface ReduxConceptProps {
  readonly title: string;
  readonly description: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialState: ReduxState = {
  count: 0,
  theme: "light",
};

const reduxReducer: Reducer<ReduxState, ReduxAction> = (
  state: ReduxState = initialState,
  action: ReduxAction,
): ReduxState => {
  switch (action.type) {
    case "counter/incremented":
      return {
        ...state,
        count: state.count + action.payload,
      };

    case "theme/toggled":
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };

    default:
      return state;
  }
};

const reduxStore = createStore(reduxReducer);

export const ReduxCounter: FC<ReduxCounterProps> = ({ label }): ReactElement => {
  const count: number = useSelector((state: ReduxState): number => state.count);
  const dispatch: Dispatch<ReduxAction> = useDispatch();

  const increment = (): void => {
    dispatch({
      type: "counter/incremented",
      payload: 1,
    });
  };

  return (
    <div>
      <p>
        {label}: {count}
      </p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </div>
  );
};

export const ReduxTheme: FC<ReduxThemeProps> = ({ label }): ReactElement => {
  const theme: ReduxState["theme"] = useSelector((state: ReduxState): ReduxState["theme"] => state.theme);
  const dispatch: Dispatch<ReduxAction> = useDispatch();

  const toggleTheme = (): void => {
    dispatch({
      type: "theme/toggled",
    });
  };

  return (
    <div>
      <p>
        {label}: {theme}
      </p>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
    </div>
  );
};

export const ReduxConcept: FC<ReduxConceptProps> = ({ title, description }): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxDemo: FC = (): ReactElement => {
  return (
    <Provider store={reduxStore}>
      <section>
        <h2>1. Redux State</h2>
        <ReduxConcept
          title="Centralized state"
          description="The Redux store contains the application's shared Redux state. Components read the current state instead of maintaining separate copies of the same shared value."
        />

        <h2>2. Redux Actions</h2>
        <ReduxConcept
          title="Actions describe events"
          description="An action is a plain object that describes something that happened. The UI dispatches an action instead of directly changing the Redux state."
        />

        <h2>3. Redux Reducers</h2>
        <ReduxConcept
          title="Reducers calculate the next state"
          description="The reducer receives the current state and dispatched action and returns the next state. It does not mutate the existing state or perform side effects."
        />

        <h2>4. React Components Reading Redux State</h2>
        <ReduxCounter label="Counter A" />
        <ReduxCounter label="Counter B" />

        <h2>5. React Components Dispatching Redux Actions</h2>
        <ReduxTheme label="Application theme" />
        <ReduxTheme label="Theme in another component" />
      </section>
    </Provider>
  );
};

export default ReduxDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Redux is a state-management library for predictable shared application state.
// A Redux store holds the current Redux state tree.
// Actions are plain objects that describe events that happened in the application.
// Dispatching an action is the mechanism used to request a Redux state update.
// Reducers calculate the next state from the previous state and the dispatched action.
// Reducers must not mutate the existing state or perform side effects.
// Redux follows a one-way data-flow model from state to UI to action to reducer and back to state.
// React-Redux provides the integration between Redux stores and React components.
// useSelector allows a React component to read selected Redux state.
// useDispatch allows a React component to dispatch Redux actions.
// Modern Redux applications normally use Redux Toolkit rather than the low-level Redux APIs.
// This example uses the low-level store API to make the underlying Redux model explicit.
