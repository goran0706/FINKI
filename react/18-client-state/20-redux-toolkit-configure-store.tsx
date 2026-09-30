/**
 * Redux Toolkit configureStore
 * =============================
 *
 * configureStore is the standard Redux Toolkit API for creating a Redux store. It accepts a
 * configuration object instead of the positional arguments used by the lower-level createStore
 * API and provides sensible defaults for middleware, development checks, and Redux DevTools.
 *
 * The reducer option can receive either a single root reducer function or an object containing
 * slice reducers. When an object is provided, configureStore combines those reducers into the
 * root reducer automatically. The resulting store also provides strong TypeScript inference for
 * the root state and dispatch types.
 *
 * configureStore can additionally accept preloadedState, middleware, enhancers, and devTools
 * configuration. When customizing middleware, getDefaultMiddleware can be used to preserve the
 * default middleware while adding application-specific middleware.
 */

import { configureStore, createSlice, type Middleware, type PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CounterState {
  readonly value: number;
}

export interface MessageState {
  readonly text: string;
}

export interface ConfigureStoreExampleProps {
  readonly title: string;
}

export interface PreloadedStateExampleProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  } satisfies CounterState,
  reducers: {
    increment(state): void {
      state.value += 1;
    },
    incrementByAmount(state, action: PayloadAction<number>): void {
      state.value += action.payload;
    },
  },
});

const messageSlice = createSlice({
  name: "message",
  initialState: {
    text: "Ready",
  } satisfies MessageState,
  reducers: {
    setMessage(state, action: PayloadAction<string>): void {
      state.text = action.payload;
    },
  },
});

export const configureStoreExampleMiddleware: Middleware = () => (next) => (action) => {
  console.log("Custom middleware received:", action);
  return next(action);
};

export const configureStoreExample = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    message: messageSlice.reducer,
  },
});

export type ConfigureStoreRootState = ReturnType<typeof configureStoreExample.getState>;

export type ConfigureStoreAppDispatch = typeof configureStoreExample.dispatch;

export const preloadedConfigureStore = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    message: messageSlice.reducer,
  },
  preloadedState: {
    counter: {
      value: 10,
    },
    message: {
      text: "Preloaded state",
    },
  },
});

export const customizedConfigureStore = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    message: messageSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(configureStoreExampleMiddleware),
});

export const ConfigureStoreBasicExample: FC = (): ReactElement => {
  const count: number = useSelector((state: ConfigureStoreRootState): number => state.counter.value);
  const dispatch: ConfigureStoreAppDispatch = useDispatch();

  return (
    <article>
      <h3>Basic configureStore setup</h3>
      <p>Count: {count}</p>
      <button
        type="button"
        onClick={() => {
          dispatch(counterSlice.actions.increment());
        }}
      >
        Increment
      </button>
    </article>
  );
};

export const ConfigureStoreReducerMapExample: FC = (): ReactElement => {
  const count: number = useSelector((state: ConfigureStoreRootState): number => state.counter.value);
  const message: string = useSelector((state: ConfigureStoreRootState): string => state.message.text);

  return (
    <article>
      <h3>Reducer map</h3>
      <p>Counter value: {count}</p>
      <p>Message: {message}</p>
      <p>configureStore combines the reducer map into a root reducer with matching state keys.</p>
    </article>
  );
};

export const PreloadedStateExample: FC<PreloadedStateExampleProps> = ({ initialCount }): ReactElement => {
  const storeCount: number = preloadedConfigureStore.getState().counter.value;

  return (
    <article>
      <h3>Preloaded state</h3>
      <p>Requested initial count: {initialCount}</p>
      <p>Store count: {storeCount}</p>
      <p>preloadedState supplies the initial state used when the store is created.</p>
    </article>
  );
};

export const DefaultMiddlewareExample: FC<ConfigureStoreExampleProps> = ({ title }): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>configureStore adds Redux Toolkit's default middleware when the middleware option is not customized.</p>
      <p>The defaults include thunk middleware and development checks for common Redux mistakes.</p>
    </article>
  );
};

export const CustomMiddlewareExample: FC = (): ReactElement => {
  const dispatch: ConfigureStoreAppDispatch = useDispatch();

  const updateMessage = (): void => {
    dispatch(messageSlice.actions.setMessage("Updated through the configured store"));
  };

  return (
    <article>
      <h3>Custom middleware</h3>
      <p>A middleware callback can preserve the defaults and append application-specific middleware.</p>
      <button type="button" onClick={updateMessage}>
        Update message
      </button>
    </article>
  );
};

export const InferredTypesExample: FC = (): ReactElement => {
  const state: ConfigureStoreRootState = configureStoreExample.getState();
  const dispatch: ConfigureStoreAppDispatch = configureStoreExample.dispatch;

  const increment = (): void => {
    dispatch(counterSlice.actions.increment());
  };

  return (
    <article>
      <h3>Inferred store types</h3>
      <p>Current count: {state.counter.value}</p>
      <button type="button" onClick={increment}>
        Dispatch increment
      </button>
      <p>RootState can be inferred from store.getState, while AppDispatch can be inferred from store.dispatch.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxToolkitConfigureStoreDemo: FC = (): ReactElement => {
  return (
    <Provider store={configureStoreExample}>
      <section>
        <h2>1. Basic configureStore Setup</h2>
        <ConfigureStoreBasicExample />

        <h2>2. Combining Slice Reducers</h2>
        <ConfigureStoreReducerMapExample />

        <h2>3. Preloading Initial State</h2>
        <PreloadedStateExample initialCount={10} />

        <h2>4. Default Middleware</h2>
        <DefaultMiddlewareExample title="configureStore defaults" />

        <h2>5. Adding Custom Middleware</h2>
        <CustomMiddlewareExample />

        <h2>6. Type Inference from the Store</h2>
        <InferredTypesExample />
      </section>
    </Provider>
  );
};

export default ReduxToolkitConfigureStoreDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// configureStore is the standard Redux Toolkit API for creating a Redux store.
// configureStore accepts a named configuration object.
// The reducer option can receive a single reducer or a map of slice reducers.
// A reducer map is automatically combined into a root reducer.
// configureStore adds useful default middleware when middleware is not customized.
// The default middleware includes thunk and development checks.
// Custom middleware can be added with the middleware callback.
// getDefaultMiddleware preserves the default middleware when customization is needed.
// preloadedState provides the initial state for a newly created store.
// Redux DevTools integration is enabled by default.
// The store can provide RootState and AppDispatch types through TypeScript inference.
// configureStore reduces the manual setup required by the lower-level Redux store API.
