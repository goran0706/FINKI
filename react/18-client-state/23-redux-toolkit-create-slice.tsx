/**
 * Redux Toolkit createSlice
 * ==========================
 *
 * createSlice is a Redux Toolkit API for defining a feature's state and reducer logic in one
 * place. It automatically generates the slice reducer, action creators, and action type strings
 * from the slice name and reducer definitions.
 *
 * A createSlice configuration contains a name, an initialState value, and a reducers object.
 * Each key in reducers describes one state transition. Redux Toolkit uses the key together
 * with the slice name to generate the corresponding action type and action creator.
 *
 * Reducers created with createSlice use Immer internally. This allows reducer code to use
 * mutation-style statements such as state.value += 1 while preserving Redux's requirement
 * that state updates are immutable.
 */

import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CreateSliceState {
  readonly count: number;
  readonly label: string;
}

export interface CreateSliceExampleProps {
  readonly title: string;
}

export interface UpdateLabelPayload {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialState: CreateSliceState = {
  count: 0,
  label: "Counter",
};

export const createSliceCounter = createSlice({
  name: "createSliceCounter",
  initialState,
  reducers: {
    increment(state): void {
      state.count += 1;
    },
    decrement(state): void {
      state.count -= 1;
    },
    incrementByAmount(state, action: PayloadAction<number>): void {
      state.count += action.payload;
    },
    updateLabel(state, action: PayloadAction<UpdateLabelPayload>): void {
      state.label = action.payload.label;
    },
    reset(): CreateSliceState {
      return initialState;
    },
  },
});

export const createSliceStore = configureStore({
  reducer: {
    counter: createSliceCounter.reducer,
  },
});

export type CreateSliceRootState = ReturnType<typeof createSliceStore.getState>;

export type CreateSliceAppDispatch = typeof createSliceStore.dispatch;

export const CreateSliceCounterExample: FC = (): ReactElement => {
  const count: number = useSelector((state: CreateSliceRootState): number => state.counter.count);
  const label: string = useSelector((state: CreateSliceRootState): string => state.counter.label);
  const dispatch: CreateSliceAppDispatch = useDispatch();

  return (
    <article>
      <h3>{label}</h3>
      <p>Count: {count}</p>
      <button
        type="button"
        onClick={() => {
          dispatch(createSliceCounter.actions.increment());
        }}
      >
        Increment
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch(createSliceCounter.actions.decrement());
        }}
      >
        Decrement
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch(createSliceCounter.actions.incrementByAmount(5));
        }}
      >
        Add 5
      </button>
      <button
        type="button"
        onClick={() => {
          dispatch(createSliceCounter.actions.reset());
        }}
      >
        Reset
      </button>
    </article>
  );
};

export const CreateSliceActionCreatorExample: FC = (): ReactElement => {
  const dispatch: CreateSliceAppDispatch = useDispatch();

  const increment = (): void => {
    dispatch(createSliceCounter.actions.increment());
  };

  const addTen = (): void => {
    dispatch(createSliceCounter.actions.incrementByAmount(10));
  };

  return (
    <article>
      <h3>Generated action creators</h3>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={addTen}>
        Add 10
      </button>
    </article>
  );
};

export const CreateSlicePayloadExample: FC = (): ReactElement => {
  const label: string = useSelector((state: CreateSliceRootState): string => state.counter.label);
  const dispatch: CreateSliceAppDispatch = useDispatch();

  const updateLabel = (nextLabel: string): void => {
    dispatch(
      createSliceCounter.actions.updateLabel({
        label: nextLabel,
      }),
    );
  };

  return (
    <article>
      <h3>Payload action</h3>
      <p>Current label: {label}</p>
      <button
        type="button"
        onClick={() => {
          updateLabel("Primary counter");
        }}
      >
        Set primary label
      </button>
      <button
        type="button"
        onClick={() => {
          updateLabel("Secondary counter");
        }}
      >
        Set secondary label
      </button>
    </article>
  );
};

export const CreateSliceImmerExample: FC<CreateSliceExampleProps> = ({ title }): ReactElement => {
  const count: number = useSelector((state: CreateSliceRootState): number => state.counter.count);
  const dispatch: CreateSliceAppDispatch = useDispatch();

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <p>
        The reducer can write state.count += 1 because Immer translates the mutation-style code into an immutable state
        update.
      </p>
      <button
        type="button"
        onClick={() => {
          dispatch(createSliceCounter.actions.increment());
        }}
      >
        Increment
      </button>
    </article>
  );
};

export const CreateSliceDefinitionExample: FC = (): ReactElement => {
  const action = createSliceCounter.actions.incrementByAmount(25);

  return (
    <article>
      <h3>Slice definition</h3>
      <p>Slice name: {createSliceCounter.name}</p>
      <p>Generated action type: {action.type}</p>
      <p>createSlice exposes the generated reducer through reducer and generated action creators through actions.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxToolkitCreateSliceDemo: FC = (): ReactElement => {
  return (
    <Provider store={createSliceStore}>
      <section>
        <h2>1. Creating a Slice</h2>
        <CreateSliceDefinitionExample />

        <h2>2. Using Generated Action Creators</h2>
        <CreateSliceActionCreatorExample />

        <h2>3. Handling Payloads</h2>
        <CreateSlicePayloadExample />

        <h2>4. Updating State with Immer</h2>
        <CreateSliceImmerExample title="Mutation-style reducer syntax" />

        <h2>5. Complete createSlice Counter</h2>
        <CreateSliceCounterExample />
      </section>
    </Provider>
  );
};

export default ReduxToolkitCreateSliceDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// createSlice defines a feature's state and reducer logic together.
// createSlice requires a name, initialState, and reducers configuration.
// Each reducer definition describes a state transition.
// createSlice generates action creators from reducer definitions.
// createSlice generates action type strings from the slice name and reducer names.
// The generated reducer is exposed through the slice's reducer property.
// Generated action creators are exposed through the slice's actions property.
// PayloadAction<T> can type the payload received by a slice reducer.
// Slice reducers use Immer internally for immutable state updates.
// Mutation-style reducer code does not mutate the actual Redux state directly.
// A slice can contain multiple related state transitions.
