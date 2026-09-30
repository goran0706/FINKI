/**
 * Higher-Order Components
 * =======================
 *
 * A higher-order component (HOC) is a function that receives a component and returns a new
 * component with additional behavior, data, or rendering logic. HOCs compose behavior around
 * existing components without modifying the original component.
 */

import { useState, type ComponentType, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic higher-order component
// ---------------------------------------------------------------------

interface UserProps {
  readonly name: string;
}

export const UserProfile: FC<UserProps> = ({ name }): ReactElement => (
  <section>
    <h2>{name}</h2>
  </section>
);

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

// The HOC adds loading behavior around the original component.
// The original `UserProfile` component remains unchanged.

// ---------------------------------------------------------------------
// 2. Using the higher-order component
// ---------------------------------------------------------------------

export const UserProfileWithLoading = withLoading(UserProfile);

export const LoadingExample: FC = (): ReactElement => (
  <div>
    <UserProfileWithLoading name="John Doe" isLoading={false} />
    <UserProfileWithLoading name="Jane Doe" isLoading />
  </div>
);

// ---------------------------------------------------------------------
// 3. Higher-order component with injected data
// ---------------------------------------------------------------------

interface UserData {
  readonly name: string;
  readonly email: string;
}

interface UserViewProps {
  readonly user: UserData;
}

export const UserView: FC<UserViewProps> = ({ user }): ReactElement => (
  <article>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </article>
);

export const withUser = <Props extends object>(
  Component: ComponentType<Props & { readonly user: UserData }>,
): FC<Props> => {
  const WithUser: FC<Props> = (props): ReactElement => {
    const user: UserData = {
      name: "John Doe",
      email: "john@example.com",
    };

    return <Component {...props} user={user} />;
  };

  return WithUser;
};

// The wrapped component requires `user`.
// The HOC supplies that prop, so callers of the enhanced component do not provide it.

// ---------------------------------------------------------------------
// 4. Using injected data
// ---------------------------------------------------------------------

export const ConnectedUserView = withUser(UserView);

export const InjectedDataExample: FC = (): ReactElement => <ConnectedUserView />;

// ---------------------------------------------------------------------
// 5. Higher-order component with stateful behavior
// ---------------------------------------------------------------------

interface CounterProps {
  readonly count: number;
}

export const CounterDisplay: FC<CounterProps> = ({ count }): ReactElement => <p>Count: {count}</p>;

interface CounterControlsProps {
  readonly count: number;
  readonly increment: () => void;
}

export const CounterControls: FC<CounterControlsProps> = ({ count, increment }): ReactElement => (
  <section>
    <CounterDisplay count={count} />
    <button type="button" onClick={increment}>
      Increment
    </button>
  </section>
);

export const withCounter = <Props extends object>(
  Component: ComponentType<Props & CounterControlsProps>,
): FC<Props> => {
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
// 6. Using stateful behavior
// ---------------------------------------------------------------------

export const ConnectedCounter = withCounter(CounterControls);

export const StatefulExample: FC = (): ReactElement => <ConnectedCounter />;

// The HOC owns the state.
// The wrapped component owns the presentation of that state.

// ---------------------------------------------------------------------
// 7. HOCs should not modify the wrapped component
// ---------------------------------------------------------------------

interface LabelProps {
  readonly label: string;
}

export const Label: FC<LabelProps> = ({ label }): ReactElement => <span>{label}</span>;

export const withPrefix = <Props extends LabelProps>(
  Component: ComponentType<Props>,
): FC<Omit<Props, "label"> & { readonly label: string }> => {
  const WithPrefix: FC<Omit<Props, "label"> & { readonly label: string }> = (props): ReactElement => (
    <Component {...(props as Props)} label={`User: ${props.label}`} />
  );

  return WithPrefix;
};

export const PrefixedLabel = withPrefix(Label);

export const CompositionExample: FC = (): ReactElement => <PrefixedLabel label="John Doe" />;

// `Label` itself still renders the original label.
// The transformed behavior exists only in the returned component.

// ---------------------------------------------------------------------
// 8. HOC responsibility boundary
// ---------------------------------------------------------------------

interface TimestampProps {
  readonly timestamp: string;
}

export const Timestamp: FC<TimestampProps> = ({ timestamp }): ReactElement => <time>{timestamp}</time>;

export const withTimestamp = <Props extends object>(Component: ComponentType<Props & TimestampProps>): FC<Props> => {
  const WithTimestamp: FC<Props> = (props): ReactElement => {
    const timestamp = new Date().toISOString();

    return <Component {...props} timestamp={timestamp} />;
  };

  return WithTimestamp;
};

export const TimestampedLabel = withTimestamp(Timestamp);

export const TimestampExample: FC = (): ReactElement => <TimestampedLabel />;

// ---------------------------------------------------------------------
// 9. Complete higher-order component example
// ---------------------------------------------------------------------

export const HigherOrderComponentsDemo: FC = (): ReactElement => (
  <div>
    <LoadingExample />
    <InjectedDataExample />
    <StatefulExample />
    <CompositionExample />
    <TimestampExample />
  </div>
);

// HOCs are useful when the same behavior needs to be applied to multiple components.
// The returned component becomes the boundary through which the additional behavior is composed.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A higher-order component is a function that receives a component and returns an enhanced component.
// - HOCs can add behavior, inject props, provide data, or control rendering around an existing component.
// - The original wrapped component should remain unchanged.
// - TypeScript generics can preserve the relationship between wrapped component props and injected props.
// - HOCs can encapsulate state and pass the resulting values and callbacks to wrapped components.
// - Multiple HOCs can be composed when different reusable behaviors need to be combined.
// - HOCs are a composition pattern rather than a special React component type.
