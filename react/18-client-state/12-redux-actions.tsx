/**
 * Redux Actions
 * =============
 *
 * A Redux action is a plain JavaScript object that describes an event that occurred in an
 * application. Actions provide an explicit way for UI code or other application logic to
 * communicate that the Redux state should change.
 *
 * Every Redux action must have a type property that identifies the event. An action can also
 * contain a payload with the data required to process that event. The payload is application-defined
 * and can contain any serializable data appropriate for the action.
 *
 * Actions do not modify state themselves. They are dispatched to the Redux store, which passes
 * them to the reducer. The reducer interprets the action and calculates the next state.
 *
 * Action creators are functions that construct action objects. They are useful for centralizing
 * action construction, keeping action shapes consistent, and avoiding repeated object literals
 * throughout the application.
 */

import { useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";
import type { Dispatch } from "redux";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ReduxActionState {
  readonly count: number;
  readonly message: string;
}

export interface IncrementAction {
  readonly type: "counter/incremented";
  readonly payload: number;
}

export interface SetMessageAction {
  readonly type: "message/set";
  readonly payload: string;
}

export interface ResetAction {
  readonly type: "state/reset";
}

export type ReduxAction = IncrementAction | SetMessageAction | ResetAction;

export interface ActionButtonProps {
  readonly label: string;
}

export interface ActionDescriptionProps {
  readonly title: string;
  readonly description: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialState: ReduxActionState = {
  count: 0,
  message: "Initial message",
};

const increment = (amount: number): IncrementAction => ({
  type: "counter/incremented",
  payload: amount,
});

const setMessage = (message: string): SetMessageAction => ({
  type: "message/set",
  payload: message,
});

const resetState = (): ResetAction => ({
  type: "state/reset",
});

const actionReducer = (state: ReduxActionState = initialState, action: ReduxAction): ReduxActionState => {
  switch (action.type) {
    case "counter/incremented":
      return {
        ...state,
        count: state.count + action.payload,
      };

    case "message/set":
      return {
        ...state,
        message: action.payload,
      };

    case "state/reset":
      return initialState;

    default:
      return state;
  }
};

const actionStore = {
  state: initialState,
  dispatch(action: ReduxAction): void {
    this.state = actionReducer(this.state, action);
  },
};

export const ActionButton: FC<ActionButtonProps> = ({ label }): ReactElement => {
  const dispatch: Dispatch<ReduxAction> = useDispatch();

  return (
    <button
      type="button"
      onClick={() => {
        dispatch(increment(1));
      }}
    >
      {label}
    </button>
  );
};

export const ReduxActionExample: FC = (): ReactElement => {
  const count: number = useSelector((state: ReduxActionState): number => state.count);
  const message: string = useSelector((state: ReduxActionState): string => state.message);
  const dispatch: Dispatch<ReduxAction> = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <p>Message: {message}</p>
      <ActionButton label="Increment" />
      <button
        type="button"
        onClick={() => {
          dispatch(setMessage("The message was updated."));
        }}
      >
        Set message
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch(resetState());
        }}
      >
        Reset
      </button>
    </div>
  );
};

export const ActionDescription: FC<ActionDescriptionProps> = ({ title, description }): ReactElement => {
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

const ReduxActionsDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Action Type</h2>
      <ActionDescription
        title="Identifying an event"
        description='The type property identifies what happened. A value such as "counter/incremented" describes an event rather than directly describing the resulting state.'
      />

      <h2>2. Action Payload</h2>
      <ActionDescription
        title="Providing event data"
        description="The payload contains data needed to process the event. Its shape is defined by the application's action type."
      />

      <h2>3. Action Creators</h2>
      <ActionDescription
        title="Constructing actions"
        description="Action creators are functions that return correctly shaped action objects. They centralize action construction and can accept parameters used to create the payload."
      />

      <h2>4. Dispatching Actions</h2>
      <ReduxActionExample />

      <h2>5. Actions Do Not Change State Directly</h2>
      <ActionDescription
        title="Events are interpreted by reducers"
        description="Dispatching an action sends an event through the Redux update flow. The action itself does not mutate the current state; the reducer determines the next state."
      />
    </section>
  );
};

export default ReduxActionsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A Redux action is a plain object that describes an event.
// Every Redux action must contain a type property.
// An action can contain a payload with data associated with the event.
// Actions describe what happened rather than directly changing Redux state.
// Actions are dispatched to the Redux store.
// The reducer receives the dispatched action and calculates the next state.
// Action creators are functions that construct action objects.
// Action creators help keep action shapes consistent across an application.
// Different action types can carry different payload types.
// An action can contain no payload when the event does not require additional data.
// Actions should remain serializable in typical Redux application design.
// Dispatching an action does not mutate the existing Redux state.
