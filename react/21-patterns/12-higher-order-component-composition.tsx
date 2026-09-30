/**
 * Higher-Order Component Composition
 * ==================================
 *
 * Higher-order components can be composed by passing the result of one HOC into another HOC.
 * Each HOC contributes a separate behavior, allowing multiple concerns to be layered around
 * the same component without placing all of those responsibilities inside the component itself.
 */

import { useState, type ComponentType, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Base component
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserProfileProps {
  readonly user: User;
}

export const UserProfile: FC<UserProfileProps> = ({ user }): ReactElement => (
  <article>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </article>
);

// ---------------------------------------------------------------------
// 2. First higher-order component
// ---------------------------------------------------------------------

interface WithUserProps {
  readonly user: User;
}

export const withUser = <Props extends object>(Component: ComponentType<Props & WithUserProps>): FC<Props> => {
  const WithUser: FC<Props> = (props): ReactElement => {
    const user: User = {
      name: "John Doe",
      email: "john@example.com",
    };

    return <Component {...props} user={user} />;
  };

  return WithUser;
};

// The HOC supplies the user data required by the wrapped component.
// The returned component no longer requires callers to provide `user`.

// ---------------------------------------------------------------------
// 3. Second higher-order component
// ---------------------------------------------------------------------

interface WithLoadingProps {
  readonly isLoading: boolean;
}

export const withLoading = <Props extends object>(Component: ComponentType<Props>): FC<Props & WithLoadingProps> => {
  const WithLoading: FC<Props & WithLoadingProps> = ({ isLoading, ...props }): ReactElement => {
    if (isLoading) {
      return <p>Loading...</p>;
    }

    return <Component {...(props as Props)} />;
  };

  return WithLoading;
};

// This HOC controls whether the wrapped component should be rendered.
// It does not need to know anything about the component's domain-specific UI.

// ---------------------------------------------------------------------
// 4. Composing two HOCs
// ---------------------------------------------------------------------

const UserProfileWithUser = withUser(UserProfile);
export const UserProfileWithLoading = withLoading(UserProfileWithUser);

// The composition is applied from the inside outward:
//
// UserProfile
//     ↓
// withUser(UserProfile)
//     ↓
// withLoading(withUser(UserProfile))
//
// Each HOC adds one independent layer of behavior.

// ---------------------------------------------------------------------
// 5. Using the composed component
// ---------------------------------------------------------------------

export const ComposedProfileExample: FC = (): ReactElement => (
  <div>
    <UserProfileWithLoading isLoading={false} />
    <UserProfileWithLoading isLoading />
  </div>
);

// The caller only supplies the props that remain required after composition.
// `user` is supplied by `withUser`, while `isLoading` is supplied by the caller.

// ---------------------------------------------------------------------
// 6. Composing reusable state behavior
// ---------------------------------------------------------------------

interface CounterProps {
  readonly count: number;
  readonly increment: () => void;
}

export const CounterDisplay: FC<CounterProps> = ({ count, increment }): ReactElement => (
  <section>
    <p>Count: {count}</p>
    <button type="button" onClick={increment}>
      Increment
    </button>
  </section>
);

export const withCounter = <Props extends object>(Component: ComponentType<Props & CounterProps>): FC<Props> => {
  const WithCounter: FC<Props> = (props): ReactElement => {
    const [count, setCount] = useState(0);

    const increment = (): void => {
      setCount((currentCount) => currentCount + 1);
    };

    return <Component {...props} count={count} increment={increment} />;
  };

  return WithCounter;
};

// ---------------------------------------------------------------------
// 7. Composing state and loading behavior
// ---------------------------------------------------------------------

const CounterWithState = withCounter(CounterDisplay);
export const CounterWithStateAndLoading = withLoading(CounterWithState);

export const ComposedCounterExample: FC = (): ReactElement => <CounterWithStateAndLoading isLoading={false} />;

// `withCounter` supplies state and behavior.
// `withLoading` adds rendering control.
// `CounterDisplay` remains responsible only for displaying the counter.

// ---------------------------------------------------------------------
// 8. A composition helper
// ---------------------------------------------------------------------

type HOC<Props> = (Component: ComponentType<Props>) => ComponentType<Props>;

export const compose = <Props extends object>(...hocs: readonly HOC<Props>[]): HOC<Props> => {
  return (Component: ComponentType<Props>): ComponentType<Props> =>
    hocs.reduceRight((currentComponent, hoc) => hoc(currentComponent), Component);
};

// `reduceRight` applies the HOCs from right to left:
//
// compose(first, second)(Component)
// becomes:
// first(second(Component))

// ---------------------------------------------------------------------
// 9. Composing compatible HOCs
// ---------------------------------------------------------------------

interface LabelProps {
  readonly label: string;
}

export const Label: FC<LabelProps> = ({ label }): ReactElement => <span>{label}</span>;

interface WithPrefixProps {
  readonly prefix: string;
}

export const withPrefix = <Props extends LabelProps>(Component: ComponentType<Props>): FC<Props & WithPrefixProps> => {
  const WithPrefix: FC<Props & WithPrefixProps> = ({ prefix, ...props }): ReactElement => (
    <Component {...(props as Props)} label={`${prefix}: ${(props as Props).label}`} />
  );

  return WithPrefix;
};

// ---------------------------------------------------------------------
// 10. Complete composition example
// ---------------------------------------------------------------------

export const HigherOrderComponentCompositionDemo: FC = (): ReactElement => (
  <div>
    <ComposedProfileExample />
    <ComposedCounterExample />
    <Label label="John Doe" />
  </div>
);

// Composition is useful when several HOCs each provide a distinct, reusable concern.
// The resulting component represents the combined behavior while the original component remains unchanged.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - HOC composition combines multiple higher-order components around a single component.
// - Each HOC can contribute one independent behavior or responsibility.
// - The output of one HOC can become the input to another HOC.
// - Composition allows behavior to be layered without modifying the original component.
// - A composition helper can apply multiple HOCs in a predictable order.
// - HOCs used together must have compatible prop contracts.
// - Composition is most useful when individual HOCs represent distinct reusable concerns.
