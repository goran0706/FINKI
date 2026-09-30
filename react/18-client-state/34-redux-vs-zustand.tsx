/**
 * Redux vs. Zustand
 * ==================
 *
 * Redux and Zustand are external state-management solutions that allow application state to be
 * shared across React components without requiring the state to be passed through component props.
 * Both can provide centralized state, actions, and subscriptions, but they differ substantially
 * in their APIs, architecture, and amount of explicit structure.
 *
 * Redux commonly models state changes through actions and reducers and uses a store as the central
 * state container. React applications typically connect to Redux through React-Redux, while modern
 * Redux applications commonly use Redux Toolkit to define slices, configure stores, and reduce
 * repetitive boilerplate.
 *
 * Zustand uses a store created with a hook-based API. State and actions can be defined together,
 * and components subscribe directly to the state they need, commonly through selectors. A Zustand
 * store does not require a Provider component for ordinary React consumption.
 *
 * Neither library is inherently a replacement for every use case of the other. The relevant
 * differences are their state-update models, subscription APIs, architectural conventions,
 * and the amount of explicit infrastructure surrounding state changes.
 */

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { create } from "zustand";
import type { FC, ReactElement } from "react";

export interface CounterState {
  readonly count: number;
}

export interface ZustandCounterState {
  readonly count: number;
  readonly increment: () => void;
}

export interface ComparisonExampleProps {
  readonly title: string;
}

const reduxCounterSlice = createSlice({
  name: "counter",
  initialState: {
    count: 0,
  } satisfies CounterState,
  reducers: {
    increment: (state: CounterState): void => {
      state.count += 1;
    },
    incrementBy: (state: CounterState, action: PayloadAction<number>): void => {
      state.count += action.payload;
    },
  },
});

const reduxStore = configureStore({
  reducer: {
    counter: reduxCounterSlice.reducer,
  },
});

type ReduxRootState = ReturnType<typeof reduxStore.getState>;
type ReduxDispatch = typeof reduxStore.dispatch;

const useReduxDispatch = (): ReduxDispatch => useDispatch<ReduxDispatch>();

const useReduxCount = (): number => useSelector((state: ReduxRootState): number => state.counter.count);

export const useZustandCounter = create<ZustandCounterState>((set): ZustandCounterState => ({
  count: 0,
  increment: (): void => {
    set((state: ZustandCounterState): Pick<ZustandCounterState, "count"> => ({
      count: state.count + 1,
    }));
  },
}));

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ReduxActionExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  const dispatch: ReduxDispatch = useReduxDispatch();

  return (
    <article>
      <h3>{title}</h3>
      <button
        type="button"
        onClick={(): void => {
          dispatch(reduxCounterSlice.actions.increment());
        }}
      >
        Dispatch Redux Action
      </button>
    </article>
  );
};

export const ZustandActionExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  const increment: () => void = useZustandCounter((state: ZustandCounterState): (() => void) => state.increment);

  return (
    <article>
      <h3>{title}</h3>
      <button type="button" onClick={increment}>
        Call Zustand Action
      </button>
    </article>
  );
};

export const ReduxReducerExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  const count: number = useReduxCount();

  return (
    <article>
      <h3>{title}</h3>
      <p>Redux count: {count}</p>
      <p>The Redux slice reducer defines how dispatched actions produce the next state.</p>
    </article>
  );
};

export const ZustandStateExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  const count: number = useZustandCounter((state: ZustandCounterState): number => state.count);

  return (
    <article>
      <h3>{title}</h3>
      <p>Zustand count: {count}</p>
      <p>Zustand stores state and update functions together and exposes them through its generated hook.</p>
    </article>
  );
};

export const ReduxSelectorExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  const count: number = useReduxCount();

  return (
    <article>
      <h3>{title}</h3>
      <p>Selected Redux value: {count}</p>
      <p>useSelector subscribes the component to the selected portion of the Redux store.</p>
    </article>
  );
};

export const ZustandSelectorExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  const count: number = useZustandCounter((state: ZustandCounterState): number => state.count);

  return (
    <article>
      <h3>{title}</h3>
      <p>Selected Zustand value: {count}</p>
      <p>The Zustand hook can subscribe directly to a selected portion of the external store.</p>
    </article>
  );
};

export const ReduxStructureExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>Redux commonly separates the store, slices, actions, reducers, and React bindings into explicit concepts.</p>
    </article>
  );
};

export const ZustandStructureExample: FC<ComparisonExampleProps> = ({
  title,
}: ComparisonExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>Zustand can define state and its actions together in a compact external store accessed through a hook.</p>
    </article>
  );
};

export const ReduxProviderExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>React-Redux normally makes a Redux store available to descendant components through a Provider.</p>
    </article>
  );
};

export const ZustandProviderExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>The Zustand store used here does not require a Provider surrounding its React consumers.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxVsZustandDemo: FC = (): ReactElement => {
  return (
    <Provider store={reduxStore}>
      <section>
        <h2>1. Redux Updates Through Dispatched Actions</h2>
        <ReduxActionExample title="Redux Action" />

        <h2>2. Zustand Updates Through Store Actions</h2>
        <ZustandActionExample title="Zustand Action" />

        <h2>3. Redux Uses Reducers to Define State Transitions</h2>
        <ReduxReducerExample title="Redux Reducer" />

        <h2>4. Zustand Stores State and Actions Together</h2>
        <ZustandStateExample title="Zustand Store" />

        <h2>5. Redux Components Select Store State</h2>
        <ReduxSelectorExample title="Redux Selector" />

        <h2>6. Zustand Components Select Store State</h2>
        <ZustandSelectorExample title="Zustand Selector" />

        <h2>7. Redux Commonly Uses Explicit State Structure</h2>
        <ReduxStructureExample title="Redux Structure" />

        <h2>8. Zustand Can Keep Store Structure Compact</h2>
        <ZustandStructureExample title="Zustand Structure" />

        <h2>9. Redux Uses React-Redux Provider Integration</h2>
        <ReduxProviderExample title="Redux Provider" />

        <h2>10. Zustand Does Not Require a Provider</h2>
        <ZustandProviderExample title="Zustand Without Provider" />
      </section>
    </Provider>
  );
};

export default ReduxVsZustandDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Redux commonly models state changes through dispatched actions and reducers.
// Modern Redux applications commonly use Redux Toolkit to define slices and configure stores.
// React-Redux provides the React bindings that connect components to a Redux store.
// Zustand combines state and actions in an external store accessed through a generated hook.
// Both Redux and Zustand support subscribing React components to selected state.
// Redux commonly introduces more explicit structure around state transitions and store configuration.
// Zustand can express shared state with a smaller API surface and without a Provider.
// These differences describe architectural trade-offs rather than a universal hierarchy between the libraries.
