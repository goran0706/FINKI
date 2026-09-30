/**
 * Redux Hooks
 * ===========
 *
 * React-Redux provides hooks that allow function components to interact with a Redux store.
 * The two fundamental hooks are useSelector for reading state and useDispatch for dispatching
 * actions. These hooks replace the need for the older connect-based approach in most function
 * components.
 *
 * useSelector accepts a selector function and subscribes the component to the selected portion
 * of the Redux store. When the store updates, React-Redux compares the selector result with its
 * previous result and can re-render the component when that selected value changes.
 *
 * useDispatch returns the store's dispatch function. Dispatching an action sends it through the
 * Redux update pipeline, where middleware can process it before the reducer calculates the next
 * state.
 *
 * Typed custom hooks can also be created around useSelector and useDispatch so application code
 * does not repeatedly specify the Redux state and dispatch types.
 */

import type { Dispatch } from "redux";
import { legacy_createStore as createStore } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HooksState {
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

export type HooksAction = IncrementAction | SetMessageAction | ResetAction;

export interface ReduxHooksExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialState: HooksState = {
  count: 0,
  message: "Ready",
};

export const hooksReducer = (state: HooksState = initialState, action: HooksAction): HooksState => {
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

export const hooksStore = createStore(hooksReducer);

export const UseSelectorExample: FC = (): ReactElement => {
  const count: number = useSelector((state: HooksState): number => state.count);

  return (
    <article>
      <h3>useSelector</h3>
      <p>Count: {count}</p>
    </article>
  );
};

export const UseDispatchExample: FC = (): ReactElement => {
  const dispatch: Dispatch<HooksAction> = useDispatch<Dispatch<HooksAction>>();

  const increment = (): void => {
    dispatch({
      type: "counter/incremented",
      payload: 1,
    });
  };

  return (
    <article>
      <h3>useDispatch</h3>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </article>
  );
};

export const MultipleHooksExample: FC = (): ReactElement => {
  const count: number = useSelector((state: HooksState): number => state.count);
  const message: string = useSelector((state: HooksState): string => state.message);
  const dispatch: Dispatch<HooksAction> = useDispatch<Dispatch<HooksAction>>();

  const updateState = (): void => {
    dispatch({
      type: "counter/incremented",
      payload: 1,
    });
    dispatch({
      type: "message/set",
      payload: "State updated",
    });
  };

  return (
    <article>
      <h3>Combining Redux hooks</h3>
      <p>Count: {count}</p>
      <p>Message: {message}</p>
      <button type="button" onClick={updateState}>
        Update state
      </button>
    </article>
  );
};

export const CustomHooksExample: FC = (): ReactElement => {
  const selectCount = (state: HooksState): number => state.count;

  const useAppSelector = <Selected,>(selector: (state: HooksState) => Selected): Selected => useSelector(selector);

  const useAppDispatch = (): Dispatch<HooksAction> => useDispatch<Dispatch<HooksAction>>();

  const count: number = useAppSelector(selectCount);
  const dispatch: Dispatch<HooksAction> = useAppDispatch();

  const increment = (): void => {
    dispatch({
      type: "counter/incremented",
      payload: 5,
    });
  };

  return (
    <article>
      <h3>Typed custom hooks</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Add 5
      </button>
    </article>
  );
};

export const PrimitiveSelectorExample: FC<ReduxHooksExampleProps> = ({ title }): ReactElement => {
  const message: string = useSelector((state: HooksState): string => state.message);

  return (
    <article>
      <h3>{title}</h3>
      <p>{message}</p>
      <p>Selecting a primitive value gives useSelector a stable result when that value has not changed.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxHooksDemo: FC = (): ReactElement => {
  return (
    <Provider store={hooksStore}>
      <section>
        <h2>1. Reading State with useSelector</h2>
        <UseSelectorExample />

        <h2>2. Dispatching Actions with useDispatch</h2>
        <UseDispatchExample />

        <h2>3. Combining Redux Hooks</h2>
        <MultipleHooksExample />

        <h2>4. Creating Typed Custom Hooks</h2>
        <CustomHooksExample />

        <h2>5. Selecting a Primitive Value</h2>
        <PrimitiveSelectorExample title="Stable selector result" />
      </section>
    </Provider>
  );
};

export default ReduxHooksDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// useSelector reads selected data from the Redux store.
// useSelector subscribes the component to Redux store updates.
// useSelector compares the selected result to determine whether the component should update.
// useDispatch returns the Redux store's dispatch function.
// Dispatching an action sends it through the Redux update pipeline.
// Components can call multiple Redux hooks when they need multiple pieces of store state.
// Typed custom hooks can centralize application-specific Redux types.
// Selecting primitive values can avoid unnecessary reference changes.
// Redux hooks are designed for function components.
// React-Redux hooks require the component to be rendered beneath a matching Provider.
