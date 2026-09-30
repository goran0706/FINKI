/**
 * Function as Children
 * ====================
 *
 * The function-as-children pattern is a variation of render props where the reusable behavior
 * is exposed through the `children` prop instead of a separately named render prop. The component
 * owns the state or behavior, while the child function receives that data and determines the UI.
 */

import { useState, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Basic function as children
// ---------------------------------------------------------------------

interface CounterChildProps {
  readonly count: number;
  readonly increment: () => void;
}

interface CounterProps {
  readonly children: (props: CounterChildProps) => ReactNode;
}

export const Counter: FC<CounterProps> = ({ children }): ReactElement => {
  const [count, setCount] = useState(0);

  const increment = (): void => {
    setCount((currentCount) => currentCount + 1);
  };

  return <>{children({ count, increment })}</>;
};

// The component owns the counter state.
// The child function receives the state and decides what should be rendered.

// ---------------------------------------------------------------------
// 2. Using the function as children
// ---------------------------------------------------------------------

export const CounterExample: FC = (): ReactElement => (
  <Counter>
    {({ count, increment }) => (
      <section>
        <p>Count: {count}</p>
        <button type="button" onClick={increment}>
          Increment
        </button>
      </section>
    )}
  </Counter>
);

// ---------------------------------------------------------------------
// 3. Reusable data through children
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

interface UserProviderProps {
  readonly children: (users: readonly User[]) => ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }): ReactElement => {
  const users: readonly User[] = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Doe", email: "jane@example.com" },
  ];

  return <>{children(users)}</>;
};

// ---------------------------------------------------------------------
// 4. Different consumers of the same data
// ---------------------------------------------------------------------

export const UserListExample: FC = (): ReactElement => (
  <UserProvider>
    {(users) => (
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    )}
  </UserProvider>
);

export const UserCountExample: FC = (): ReactElement => (
  <UserProvider>{(users) => <p>Total users: {users.length}</p>}</UserProvider>
);

// The provider determines what data is available.
// Each child function determines how that data is represented.

// ---------------------------------------------------------------------
// 5. Function children with interaction state
// ---------------------------------------------------------------------

interface ToggleChildProps {
  readonly isOpen: boolean;
  readonly toggle: () => void;
}

interface ToggleProps {
  readonly children: (props: ToggleChildProps) => ReactNode;
}

export const Toggle: FC<ToggleProps> = ({ children }): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (): void => {
    setIsOpen((currentValue) => !currentValue);
  };

  return <>{children({ isOpen, toggle })}</>;
};

// ---------------------------------------------------------------------
// 6. Using the toggle behavior
// ---------------------------------------------------------------------

export const ToggleExample: FC = (): ReactElement => (
  <Toggle>
    {({ isOpen, toggle }) => (
      <section>
        <button type="button" onClick={toggle}>
          {isOpen ? "Close" : "Open"}
        </button>

        {isOpen && <p>Additional content is visible.</p>}
      </section>
    )}
  </Toggle>
);

// ---------------------------------------------------------------------
// 7. Generic function children
// ---------------------------------------------------------------------

interface ResourceState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
}

interface ResourceProps<T> {
  readonly resource: ResourceState<T>;
  readonly children: (state: ResourceState<T>) => ReactNode;
}

export const Resource = <T,>({ resource, children }: ResourceProps<T>): ReactElement => <>{children(resource)}</>;

// ---------------------------------------------------------------------
// 8. Rendering typed resource data
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
  <Resource resource={profileResource}>
    {({ data, loading, error }) => {
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
  </Resource>
);

// ---------------------------------------------------------------------
// 9. Function children versus ordinary children
// ---------------------------------------------------------------------

interface MessageProps {
  readonly children: ReactNode;
}

export const Message: FC<MessageProps> = ({ children }): ReactElement => <section>{children}</section>;

export const StaticMessageExample: FC = (): ReactElement => (
  <Message>
    <p>This is static child content.</p>
  </Message>
);

export const DynamicMessageExample: FC = (): ReactElement => (
  <Counter>
    {({ count }) => (
      <Message>
        <p>The current count is {count}.</p>
      </Message>
    )}
  </Counter>
);

// Ordinary children provide content directly.
// Function children provide a callback that receives values from the parent component.

// ---------------------------------------------------------------------
// 10. Complete function-as-children example
// ---------------------------------------------------------------------

export const FunctionAsChildrenDemo: FC = (): ReactElement => (
  <div>
    <CounterExample />
    <UserListExample />
    <UserCountExample />
    <ToggleExample />
    <ResourceExample />
    <StaticMessageExample />
    <DynamicMessageExample />
  </div>
);

// The function-as-children pattern is useful when callers need access to reusable behavior
// while retaining complete control over the UI produced from that behavior.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Function-as-children uses the `children` prop as a render function.
// - The parent component owns reusable state or behavior and invokes the child function with its values.
// - The child function determines what React elements should be rendered.
// - The pattern is a specialized form of render props where `children` is the render prop.
// - Function children can receive structured values such as state, data, and callbacks.
// - Generic function children can preserve strong TypeScript relationships between data and consumers.
// - Ordinary children provide static React content, while function children allow the parent to supply values dynamically.
