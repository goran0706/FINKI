/**
 * Pure Components
 * ===============
 *
 * Pure components are components whose rendered output is determined solely by their current
 * props and state. Given the same inputs, a pure component should produce the same output
 * without causing side effects during rendering.
 *
 * React provides `React.PureComponent` and `React.memo` as optimization mechanisms that can
 * skip unnecessary renders by performing shallow comparisons of component inputs. These
 * mechanisms are related to pure rendering, but shallow comparison itself does not define
 * what makes a component pure.
 */

import React, { memo, PureComponent, useState } from "react";

// ---------------------------------------------------------------------
// Component Props & State Interfaces
// ---------------------------------------------------------------------

export interface PureComponentProps {
  readonly title: string;
  readonly count: number;
}

export interface PureComponentState {
  readonly count: number;
}

// ---------------------------------------------------------------------
// 1. Pure Rendering
// ---------------------------------------------------------------------

export const PureFunctionComponent: React.FC<PureComponentProps> = ({ title, count }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
    </div>
  );
};

// The same props always produce the same rendered structure.
export const firstRender = <PureFunctionComponent title="Counter" count={5} />;
export const secondRender = <PureFunctionComponent title="Counter" count={5} />;

// ---------------------------------------------------------------------
// 2. Component Rendering Should Be Free of Side Effects
// ---------------------------------------------------------------------

export const SideEffectFreeComponent: React.FC<PureComponentProps> = ({ title, count }) => {
  const message = `${title}: ${count}`;

  return (
    <div>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
};

// Side effects such as API calls, subscriptions, timers, or DOM manipulation
// should not be performed directly during the render phase.

// ---------------------------------------------------------------------
// 3. Pure Components Can Have State
// ---------------------------------------------------------------------

export const StatefulPureComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </div>
  );
};

// "Pure" does not mean "stateless". A component can use state while keeping
// its render logic pure: the rendered output is derived from current inputs.

// ---------------------------------------------------------------------
// 4. React.PureComponent
// ---------------------------------------------------------------------

export class PureClassComponent extends PureComponent<PureComponentProps, PureComponentState> {
  public override state: PureComponentState = {
    count: 0,
  };

  public override render(): React.ReactNode {
    const { title, count } = this.props;

    return (
      <div>
        <h2>{title}</h2>
        <p>Prop Count: {count}</p>
        <p>State Count: {this.state.count}</p>
        <button type="button" onClick={this.handleIncrement}>
          Increment State
        </button>
      </div>
    );
  }

  private handleIncrement = (): void => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  };
}

// `PureComponent` provides a shallow comparison optimization for props and state.
// It can skip a render when the relevant top-level values have not changed.

// ---------------------------------------------------------------------
// 5. React.memo
// ---------------------------------------------------------------------

export const MemoizedFunctionComponent = memo(PureFunctionComponent);

// `memo` creates a memoized component that normally skips rendering when its
// props are shallowly equal to the props from the previous render.

// ---------------------------------------------------------------------
// 6. Shallow Comparison
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserComponentProps {
  readonly user: User;
}

export const UserComponent: React.FC<UserComponentProps> = ({ user }) => {
  return <p>{user.name}</p>;
};

export const MemoizedUserComponent = memo(UserComponent);

const user: User = {
  name: "John",
};

export const memoizedUser = <MemoizedUserComponent user={user} />;

// Passing the same object reference preserves shallow equality.
export const sameUserReference = user;

// Creating a new object produces a different reference, even when
// the contained values are identical.
export const equivalentUser = {
  name: "John",
};

// `user === equivalentUser` is false because these are different objects.

// ---------------------------------------------------------------------
// 7. Immutability & Reference Changes
// ---------------------------------------------------------------------

interface Profile {
  readonly name: string;
  readonly settings: {
    readonly theme: string;
  };
}

export const profile: Profile = {
  name: "John",
  settings: {
    theme: "dark",
  },
};

// Create new references when changing immutable data.
export const updatedProfile: Profile = {
  ...profile,
  settings: {
    ...profile.settings,
    theme: "light",
  },
};

// `updatedProfile !== profile`
// `updatedProfile.settings !== profile.settings`

// Immutable updates make changed data visible to shallow comparison.

// ---------------------------------------------------------------------
// 8. Pure Components vs. Memoization
// ---------------------------------------------------------------------

export const PureComponentExample: React.FC<PureComponentProps> = ({ title, count }) => {
  return (
    <div>
      <h2>{title}</h2> <p>{count}</p>
    </div>
  );
};

export const MemoizedComponentExample = memo(PureComponentExample);

// The component above can be pure without being memoized.
// `memo` adds a rendering optimization; it does not make an impure
// component conceptually pure.

// ---------------------------------------------------------------------
// 9. Pure Components vs. Stateless Components
// ---------------------------------------------------------------------

export const StatelessComponent: React.FC<{ title: string }> = ({ title }) => {
  return <h2>{title}</h2>;
};

// A stateless component does not use its own React state.
// Statelessness and purity describe different properties.
//
// A component can be:
// - Stateless and pure.
// - Stateful and pure.
// - Stateless but contain problematic render-time side effects.
// - Stateful and contain problematic render-time side effects.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Pure Component: Rendering is determined by current props and state without render-time side effects.
// - Deterministic Rendering: The same inputs should produce the same rendered output.
// - Stateful Does Not Mean Impure: A component can use state and still have pure render logic.
// - `React.PureComponent`: Class-component optimization based on shallow comparison of props and state.
// - `React.memo`: Function-component optimization based on shallow comparison of props by default.
// - Shallow Comparison: Nested objects and arrays are compared by their references rather than their contents.
// - Immutability: Creating new references for changed data allows shallow comparison to detect changes.
// - Memoization: An optimization mechanism; it is not the definition of component purity.
// - Statelessness: Describes the absence of component state and is independent of whether rendering is pure.
