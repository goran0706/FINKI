/**
 * Render Props
 * ============
 *
 * The render props pattern allows a component to share behavior or state by receiving a function
 * prop that determines what should be rendered. The component owns the reusable behavior, while
 * the caller owns the UI produced from the values supplied to that function.
 */

import { useState, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Basic render prop
// ---------------------------------------------------------------------

interface CounterRenderProps {
  readonly count: number;
  readonly increment: () => void;
}

interface CounterProps {
  readonly render: (props: CounterRenderProps) => ReactNode;
}

export const Counter: FC<CounterProps> = ({ render }): ReactElement => {
  const [count, setCount] = useState(0);

  const increment = (): void => {
    setCount((currentCount) => currentCount + 1);
  };

  return <>{render({ count, increment })}</>;
};

// The component owns the counter state.
// The render function decides how that state is displayed.

// ---------------------------------------------------------------------
// 2. Using the render prop
// ---------------------------------------------------------------------

export const CounterExample: FC = (): ReactElement => (
  <Counter
    render={({ count, increment }) => (
      <section>
        <p>Count: {count}</p>
        <button type="button" onClick={increment}>
          Increment
        </button>
      </section>
    )}
  />
);

// ---------------------------------------------------------------------
// 3. Render prop with reusable data
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

interface UserProviderProps {
  readonly render: (users: readonly User[]) => ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ render }): ReactElement => {
  const users: readonly User[] = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Doe", email: "jane@example.com" },
  ];

  return <>{render(users)}</>;
};

// ---------------------------------------------------------------------
// 4. Different renderers for the same data
// ---------------------------------------------------------------------

export const UserListExample: FC = (): ReactElement => (
  <UserProvider
    render={(users) => (
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    )}
  />
);

export const UserSummaryExample: FC = (): ReactElement => (
  <UserProvider render={(users) => <p>Total users: {users.length}</p>} />
);

// The provider determines what data is available.
// Each caller can decide how that data should be rendered.

// ---------------------------------------------------------------------
// 5. Render prop with interaction state
// ---------------------------------------------------------------------

interface ToggleRenderProps {
  readonly isOpen: boolean;
  readonly toggle: () => void;
}

interface ToggleProps {
  readonly render: (props: ToggleRenderProps) => ReactNode;
}

export const Toggle: FC<ToggleProps> = ({ render }): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (): void => {
    setIsOpen((currentValue) => !currentValue);
  };

  return <>{render({ isOpen, toggle })}</>;
};

// ---------------------------------------------------------------------
// 6. Using the toggle render prop
// ---------------------------------------------------------------------

export const ToggleExample: FC = (): ReactElement => (
  <Toggle
    render={({ isOpen, toggle }) => (
      <section>
        <button type="button" onClick={toggle}>
          {isOpen ? "Close" : "Open"}
        </button>

        {isOpen && <p>Additional content is visible.</p>}
      </section>
    )}
  />
);

// ---------------------------------------------------------------------
// 7. Render prop with a component-level contract
// ---------------------------------------------------------------------

interface ResourceState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
}

interface ResourceProps<T> {
  readonly resource: ResourceState<T>;
  readonly render: (state: ResourceState<T>) => ReactNode;
}

export const Resource = <T,>({ resource, render }: ResourceProps<T>): ReactElement => <>{render(resource)}</>;

// The generic type preserves the relationship between the supplied resource
// and the value received by the render function.

// ---------------------------------------------------------------------
// 8. Rendering different resource states
// ---------------------------------------------------------------------

interface Profile {
  readonly name: string;
  readonly email: string;
}

const profileResource: ResourceState<Profile> = {
  data: {
    name: "John Doe",
    email: "john@example.com",
  },
  loading: false,
  error: null,
};

export const ResourceExample: FC = (): ReactElement => (
  <Resource
    resource={profileResource}
    render={({ data, loading, error }) => {
      if (loading) {
        return <p>Loading profile...</p>;
      }

      if (error) {
        return <p>{error}</p>;
      }

      if (!data) {
        return <p>No profile available.</p>;
      }

      return (
        <article>
          <h2>{data.name}</h2>
          <p>{data.email}</p>
        </article>
      );
    }}
  />
);

// ---------------------------------------------------------------------
// 9. Complete render props example
// ---------------------------------------------------------------------

export const RenderPropsDemo: FC = (): ReactElement => (
  <div>
    <CounterExample />
    <UserListExample />
    <UserSummaryExample />
    <ToggleExample />
    <ResourceExample />
  </div>
);

// Render props are useful when the behavior is reusable but the rendered UI should remain flexible.
// Multiple callers can consume the same behavior while producing completely different UI.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The render props pattern shares behavior or state through a function prop.
// - The component providing the render prop owns the reusable behavior or state.
// - The caller controls the UI returned by the render function.
// - Render functions can receive one value or a structured object containing several values and callbacks.
// - The same behavior can support multiple visual representations.
// - Generic render props can preserve strong relationships between input data and rendered values.
// - Render props separate reusable behavior from the specific UI that consumes it.
