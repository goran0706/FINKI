/**
 * Reference Identity
 * ===================
 *
 * JavaScript objects, arrays, and functions are reference values whose identity is determined by
 * the specific object in memory. Two separately created objects can contain the same data while
 * still having different identities.
 *
 * React uses reference identity in several important places, including state updates, dependency
 * arrays, memoized props, and reconciliation. Understanding identity is therefore essential when
 * diagnosing unnecessary rendering and designing stable component inputs.
 */

import { memo, useEffect, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Primitive values are compared by value
// ---------------------------------------------------------------------

const PrimitiveIdentityExample: FC = (): ReactElement => {
  const firstName = "John";
  const secondName = "John";
  const firstNumber = 30;
  const secondNumber = 30;

  console.log(firstName === secondName);
  console.log(firstNumber === secondNumber);

  return (
    <section>
      <p>Primitive values are compared by their values.</p>
    </section>
  );
};

// Primitive values such as strings and numbers do not have object reference identity.
// Two equal primitive values compare as equal with Object.is() and ===, except for
// the specific cases where those operators intentionally differ, such as NaN and signed zero.

// ---------------------------------------------------------------------
// 2. Objects have reference identity
// ---------------------------------------------------------------------

const ObjectIdentityExample: FC = (): ReactElement => {
  const firstUser = { name: "John Doe" };
  const secondUser = { name: "John Doe" };

  console.log(firstUser === secondUser);
  console.log(Object.is(firstUser, secondUser));

  return (
    <section>
      <p>Two object literals can contain the same data but have different identities.</p>
    </section>
  );
};

// Each object literal creates a distinct object.
// === and Object.is() compare the references for objects rather than recursively comparing their properties.
// Therefore, two separately created objects are not equal even when their contents are identical.

// ---------------------------------------------------------------------
// 3. Assigning an object preserves its identity
// ---------------------------------------------------------------------

const SharedReferenceExample: FC = (): ReactElement => {
  const user = { name: "John Doe" };
  const sameUser = user;

  console.log(user === sameUser);
  console.log(Object.is(user, sameUser));

  return (
    <section>
      <p>Both variables refer to the same object.</p>
    </section>
  );
};

// Assigning an object variable to another variable does not create a new object.
// Both variables refer to the same object, so their identities are equal.

// ---------------------------------------------------------------------
// 4. Arrays also have reference identity
// ---------------------------------------------------------------------

const ArrayIdentityExample: FC = (): ReactElement => {
  const firstItems = ["A", "B", "C"];
  const secondItems = ["A", "B", "C"];
  const sameItems = firstItems;

  console.log(firstItems === secondItems);
  console.log(firstItems === sameItems);

  return (
    <section>
      <p>Arrays follow the same reference-identity rules as objects.</p>
    </section>
  );
};

// Arrays are objects in JavaScript.
// Two separately created arrays have different identities even when their elements are identical.

// ---------------------------------------------------------------------
// 5. Functions have reference identity
// ---------------------------------------------------------------------

const FunctionIdentityExample: FC = (): ReactElement => {
  const firstHandler = (): void => {
    console.log("Action");
  };

  const secondHandler = (): void => {
    console.log("Action");
  };

  const sameHandler = firstHandler;

  console.log(firstHandler === secondHandler);
  console.log(firstHandler === sameHandler);

  return (
    <section>
      <p>Functions are objects with reference identity.</p>
    </section>
  );
};

// Each function expression creates a distinct function object.
// Assigning an existing function to another variable preserves the same function identity.

// ---------------------------------------------------------------------
// 6. Reference identity affects React.memo
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserCardProps {
  readonly user: User;
}

const UserCard: FC<UserCardProps> = memo(({ user }): ReactElement => {
  console.log("UserCard rendered");

  return <p>{user.name}</p>;
});

const MemoReferenceExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const user = { name: "John Doe" };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <UserCard user={user} />
    </section>
  );
};

// user is recreated every time MemoReferenceExample renders.
// The new object has the same name but a different identity.
// React.memo compares the user prop by reference, so the changing identity prevents
// the default memo comparison from treating the prop as unchanged.

// ---------------------------------------------------------------------
// 7. A stable reference can allow a memo bailout
// ---------------------------------------------------------------------

const stableUser: User = {
  name: "John Doe",
};

const StableUserCard: FC<UserCardProps> = memo(({ user }): ReactElement => {
  console.log("StableUserCard rendered");

  return <p>{user.name}</p>;
});

const StableReferenceExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <StableUserCard user={stableUser} />
    </section>
  );
};

// stableUser is created once at module scope and its reference remains the same.
// When the parent re-renders without changing that reference, StableUserCard can
// satisfy React.memo's default prop comparison and potentially bail out.

// ---------------------------------------------------------------------
// 8. Creating an equivalent object does not preserve identity
// ---------------------------------------------------------------------

interface Settings {
  readonly theme: "light" | "dark";
}

const settings: Settings = {
  theme: "light",
};

const EquivalentReferenceExample: FC = (): ReactElement => {
  const nextSettings: Settings = {
    theme: "light",
  };

  console.log(settings === nextSettings);

  return (
    <section>
      <p>Equivalent object contents do not imply equivalent object identity.</p>
    </section>
  );
};

// The two objects have equivalent property values but are different objects.
// React's shallow comparisons therefore treat their references as different.

// ---------------------------------------------------------------------
// 9. State updates depend on reference identity
// ---------------------------------------------------------------------

const StateIdentityExample: FC = (): ReactElement => {
  const [user, setUser] = useState<User>({
    name: "John Doe",
  });

  const updateWithSameReference = (): void => {
    setUser(user);
  };

  const updateWithNewReference = (): void => {
    setUser({
      name: user.name,
    });
  };

  return (
    <section>
      <p>{user.name}</p>
      <button type="button" onClick={updateWithSameReference}>
        Set same object
      </button>
      <button type="button" onClick={updateWithNewReference}>
        Create equivalent object
      </button>
    </section>
  );
};

// Setting state to the same object reference can allow React to skip the update work.
// Creating a new object produces a different state reference even when its contents are identical.
// Immutable state updates commonly rely on this behavior: changed data receives a new reference.

// ---------------------------------------------------------------------
// 10. Mutating an object preserves its reference
// ---------------------------------------------------------------------

interface Profile {
  name: string;
}

const MutationExample: FC = (): ReactElement => {
  const [profile, setProfile] = useState<Profile>({
    name: "John Doe",
  });

  const mutateProfile = (): void => {
    profile.name = "Jane Doe";
    setProfile(profile);
  };

  return (
    <section>
      <p>{profile.name}</p>
      <button type="button" onClick={mutateProfile}>
        Mutate profile
      </button>
    </section>
  );
};

// Mutating profile changes the object while preserving its reference.
// Calling setProfile with that same reference can prevent React from treating the update
// as a new state value.
// This is one reason React state should generally be updated immutably rather than mutated in place.

// ---------------------------------------------------------------------
// 11. Immutable updates create new references
// ---------------------------------------------------------------------

const ImmutableUpdateExample: FC = (): ReactElement => {
  const [profile, setProfile] = useState<Profile>({
    name: "John Doe",
  });

  const updateProfile = (): void => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      name: "Jane Doe",
    }));
  };

  return (
    <section>
      <p>{profile.name}</p>
      <button type="button" onClick={updateProfile}>
        Update profile
      </button>
    </section>
  );
};

// The spread operation creates a new object.
// The new object has a different reference from the previous state object.
// React can therefore detect that the state value changed.

// ---------------------------------------------------------------------
// 12. Nested reference identity
// ---------------------------------------------------------------------

interface Address {
  readonly city: string;
}

interface Person {
  readonly name: string;
  readonly address: Address;
}

const NestedIdentityExample: FC = (): ReactElement => {
  const [person, setPerson] = useState<Person>({
    name: "John Doe",
    address: {
      city: "Tetovo",
    },
  });

  const updateCity = (): void => {
    setPerson((currentPerson) => ({
      ...currentPerson,
      address: {
        ...currentPerson.address,
        city: "Skopje",
      },
    }));
  };

  return (
    <section>
      <p>{person.name}</p>
      <p>{person.address.city}</p>
      <button type="button" onClick={updateCity}>
        Change city
      </button>
    </section>
  );
};

// A shallow copy creates a new outer object but does not automatically clone nested objects.
// When a nested value changes, the path from the root to that value should receive new references.
// Unchanged branches can retain their existing references.

// ---------------------------------------------------------------------
// 13. Reference identity affects useEffect dependencies
// ---------------------------------------------------------------------

const EffectIdentityExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const options = {
    mode: "light",
  };

  useEffect(() => {
    console.log("Effect ran");
  }, [options]);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// options is a new object on every render.
// Because effect dependencies are compared using Object.is semantics,
// the options dependency is considered changed whenever the component renders.
// The effect therefore runs after every committed render in which this dependency is evaluated as new.

// ---------------------------------------------------------------------
// 14. Primitive dependencies can remain stable
// ---------------------------------------------------------------------

const PrimitiveDependencyExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const mode = "light";

  useEffect(() => {
    console.log("Mode changed:", mode);
  }, [mode]);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// mode is a primitive value that remains "light" across these renders.
// Its dependency comparison therefore remains equal, so the effect does not rerun
// merely because count changes.

// ---------------------------------------------------------------------
// 15. Reference identity affects function props
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly onAction: () => void;
}

const MemoButton: FC<ButtonProps> = memo(({ onAction }): ReactElement => {
  console.log("MemoButton rendered");

  return (
    <button type="button" onClick={onAction}>
      Run action
    </button>
  );
});

const FunctionPropExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = (): void => {
    console.log("Action");
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <MemoButton onAction={handleAction} />
    </section>
  );
};

// handleAction is recreated whenever FunctionPropExample renders.
// Its reference therefore changes, which can prevent MemoButton from bailing out.
// Stable callback references can matter when function props participate in memoization.

// ---------------------------------------------------------------------
// 16. Reference identity is not deep equality
// ---------------------------------------------------------------------

const DeepDataExample: FC = (): ReactElement => {
  const first = {
    user: {
      name: "John Doe",
    },
  };

  const second = {
    user: {
      name: "John Doe",
    },
  };

  console.log(first === second);
  console.log(first.user === second.user);

  return (
    <section>
      <p>Nested objects also have independent identities.</p>
    </section>
  );
};

// JavaScript's normal equality operators do not recursively compare object contents.
// Every independently created nested object has its own reference identity.
// Deep equality requires a separate comparison strategy and is not performed automatically by React.memo.

// ---------------------------------------------------------------------
// 17. Stable identity can be useful, but stability has a cost
// ---------------------------------------------------------------------

const StableObjectExample: FC = (): ReactElement => {
  const stableValue = {
    label: "Static value",
  };

  return <p>{stableValue.label}</p>;
};

// Reference stability is useful when an identity-sensitive mechanism needs it,
// but creating stable references should not become an optimization goal by itself.
// The correct question is whether reference changes are causing measurable or semantic problems.

// ---------------------------------------------------------------------
// 18. Integrated example
// ---------------------------------------------------------------------

interface SettingsCardProps {
  readonly settings: Settings;
}

const SettingsCard: FC<SettingsCardProps> = memo(({ settings }): ReactElement => {
  console.log("SettingsCard rendered");

  return <p>Theme: {settings.theme}</p>;
});

const ReferenceIdentityDemo: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const settingsValue: Settings = {
    theme: "light",
  };

  return (
    <main>
      <h1>Reference identity</h1>

      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>

      <SettingsCard settings={settingsValue} />
    </main>
  );
};

export default ReferenceIdentityDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Objects, arrays, and functions have reference identity.
// - Two separately created objects can contain identical data while having different identities.
// - Assigning an object to another variable preserves the same reference.
// - React.memo compares props using Object.is semantics by default.
// - New object and function references can prevent memoized components from bailing out.
// - State updates also depend on reference identity when state contains objects or arrays.
// - Mutating an existing state object preserves its reference and can prevent React from detecting a state change.
// - Immutable updates create new references for changed objects.
// - Nested immutable updates should create new references along the changed object path.
// - Effect dependencies are compared using Object.is semantics, making reference stability relevant there as well.
// - Reference identity is not deep equality.
// - Stable references are useful when identity-sensitive mechanisms require them, but stability itself is not an optimization goal.
