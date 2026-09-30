/**
 * Redux Provider
 * ==============
 *
 * React-Redux Provider makes a Redux store available to a React component tree through React
 * context. Components rendered anywhere beneath Provider can access that store with React-Redux
 * hooks such as useSelector and useDispatch.
 *
 * Provider does not create Redux state and does not replace the Redux store. It establishes the
 * React context connection between an existing Redux store and its descendant components. The
 * store prop identifies which Redux store the component tree should use.
 *
 * A Provider is normally placed near the root of an application so that all components requiring
 * Redux state can access the same store. Multiple Providers can also be used when separate parts
 * of an application intentionally need different stores.
 */

import type { Dispatch } from "redux";
import { legacy_createStore as createStore } from "redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import type { FC, ReactElement, ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ProviderState {
  readonly count: number;
}

export interface IncrementAction {
  readonly type: "counter/incremented";
  readonly payload: number;
}

export interface ResetAction {
  readonly type: "counter/reset";
}

export type ProviderAction = IncrementAction | ResetAction;

export interface ProviderBoundaryProps {
  readonly children: ReactNode;
}

export interface ProviderExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialState: ProviderState = {
  count: 0,
};

export const providerReducer = (state: ProviderState = initialState, action: ProviderAction): ProviderState => {
  switch (action.type) {
    case "counter/incremented":
      return {
        count: state.count + action.payload,
      };

    case "counter/reset":
      return initialState;

    default:
      return state;
  }
};

export const providerStore = createStore(providerReducer);

export const ProviderChild: FC<ProviderExampleProps> = ({ title }): ReactElement => {
  const count: number = useSelector((state: ProviderState): number => state.count);

  return (
    <article>
      <h3>{title}</h3>
      <p>Count read from the Redux store: {count}</p>
    </article>
  );
};

export const ProviderDispatchChild: FC = (): ReactElement => {
  const dispatch: Dispatch<ProviderAction> = useDispatch<Dispatch<ProviderAction>>();

  const increment = (): void => {
    dispatch({
      type: "counter/incremented",
      payload: 1,
    });
  };

  return (
    <article>
      <h3>Dispatching from a descendant</h3>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </article>
  );
};

export const ProviderBoundary: FC<ProviderBoundaryProps> = ({ children }): ReactElement => {
  return <Provider store={providerStore}>{children}</Provider>;
};

export const ProviderAccessExample: FC = (): ReactElement => {
  return (
    <ProviderBoundary>
      <ProviderChild title="Nested component access" />
      <ProviderDispatchChild />
    </ProviderBoundary>
  );
};

export const ProviderOutsideExample: FC = (): ReactElement => {
  return (
    <article>
      <h3>Provider defines the access boundary</h3>
      <p>Components using useSelector or useDispatch must be rendered beneath a matching React-Redux Provider.</p>
      <p>
        Provider makes the configured store available through React context; it does not copy the store state into each
        component.
      </p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxProviderDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Provider Makes the Store Available</h2>
      <ProviderAccessExample />

      <h2>2. Descendants Can Read Store State</h2>
      <ProviderBoundary>
        <ProviderChild title="Store access through Provider" />
      </ProviderBoundary>

      <h2>3. Descendants Can Dispatch Actions</h2>
      <ProviderBoundary>
        <ProviderDispatchChild />
      </ProviderBoundary>

      <h2>4. Provider Defines the Access Boundary</h2>
      <ProviderOutsideExample />
    </section>
  );
};

export default ReduxProviderDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Provider makes a Redux store available to descendant React components.
// Provider uses React context to establish the React-Redux store connection.
// Provider does not create the Redux store.
// The store is supplied through the Provider store prop.
// Descendants can use useSelector to read state from the provided store.
// Descendants can use useDispatch to dispatch actions to the provided store.
// Components that use React-Redux hooks must be beneath a matching Provider.
// A Provider establishes an access boundary for the store.
// A Provider can wrap a large application tree near its root.
// Multiple Providers can provide different stores to separate component subtrees.
