/**
 * Redux Selectors
 * ================
 *
 * A Redux selector is a function that receives the Redux state and returns a specific piece
 * of information derived from that state. Selectors provide a consistent way for components
 * and other application logic to read the state without depending on the entire state tree.
 *
 * A selector can return a stored value directly or derive a value by combining multiple state
 * fields. Selectors are especially useful when components only need a small part of the state,
 * because useSelector subscribes the component to the selected result rather than requiring
 * the component to read the entire state object.
 *
 * Selectors can also be parameterized by accepting additional arguments outside the Redux state.
 * More advanced selector libraries can memoize derived results, but a selector does not need
 * memoization to be a valid Redux selector.
 */

import { useSelector } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: string;
  readonly name: string;
  readonly active: boolean;
}

export interface SelectorState {
  readonly count: number;
  readonly user: User;
  readonly items: readonly string[];
}

export interface SelectorExampleProps {
  readonly title: string;
}

export interface UserSelectorProps {
  readonly userId: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialState: SelectorState = {
  count: 5,
  user: {
    id: "user-1",
    name: "John Doe",
    active: true,
  },
  items: ["React", "TypeScript", "Redux"],
};

export const selectCount = (state: SelectorState): number => state.count;

export const selectUser = (state: SelectorState): User => state.user;

export const selectUserName = (state: SelectorState): string => state.user.name;

export const selectActiveUserName = (state: SelectorState): string =>
  state.user.active ? state.user.name : "Inactive user";

export const selectItemCount = (state: SelectorState): number => state.items.length;

export const BasicSelectorExample: FC = (): ReactElement => {
  const count: number = useSelector(selectCount);

  return (
    <article>
      <h3>Reading one state value</h3>
      <p>Count: {count}</p>
    </article>
  );
};

export const DerivedSelectorExample: FC = (): ReactElement => {
  const itemCount: number = useSelector(selectItemCount);
  const activeUserName: string = useSelector(selectActiveUserName);

  return (
    <article>
      <h3>Derived state values</h3>
      <p>Items: {itemCount}</p>
      <p>User: {activeUserName}</p>
    </article>
  );
};

export const ObjectSelectorExample: FC = (): ReactElement => {
  const user: User = useSelector(selectUser);

  return (
    <article>
      <h3>Selecting an object</h3>
      <p>Name: {user.name}</p>
      <p>Active: {user.active ? "Yes" : "No"}</p>
    </article>
  );
};

export const ParameterizedSelectorExample: FC<UserSelectorProps> = ({ userId }): ReactElement => {
  const user: User = useSelector((state: SelectorState): User =>
    state.user.id === userId
      ? state.user
      : {
          id: "",
          name: "User not found",
          active: false,
        },
  );

  return (
    <article>
      <h3>Parameterized selection</h3>
      <p>Requested ID: {userId}</p>
      <p>User: {user.name}</p>
    </article>
  );
};

export const SelectorReferenceExample: FC = (): ReactElement => {
  const userName: string = useSelector(selectUserName);

  return (
    <article>
      <h3>Selecting the smallest required value</h3>
      <p>User name: {userName}</p>
      <p>Selecting a primitive value avoids creating a new object on every selector call.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReduxSelectorsDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Selecting a Basic State Value</h2>
      <BasicSelectorExample />

      <h2>2. Selecting Derived Data</h2>
      <DerivedSelectorExample />

      <h2>3. Selecting an Object</h2>
      <ObjectSelectorExample />

      <h2>4. Parameterized Selection</h2>
      <ParameterizedSelectorExample userId="user-1" />

      <h2>5. Selecting a Primitive Value</h2>
      <SelectorReferenceExample />

      <script type="application/json">{JSON.stringify(initialState)}</script>
    </section>
  );
};

export default ReduxSelectorsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A selector is a function that reads information from Redux state.
// A selector can return a stored state value directly.
// A selector can derive a value from one or more state fields.
// useSelector runs a selector against the Redux store state.
// Components can subscribe to only the state values they need.
// Selectors can return objects, arrays, primitives, or other derived values.
// Selector results are compared by reference by default.
// Returning a newly created object can cause additional component renders.
// Selecting a primitive value avoids object-reference changes for unchanged data.
// Parameterized selectors can use values from component props or other inputs.
// More advanced selectors can use memoization for expensive derived calculations.
