/**
 * Object Identity
 * ================
 *
 * Objects, arrays, and functions are reference values whose identity is determined by the
 * specific object instance. Object identity explains why two objects with identical properties
 * are not equal, why mutating an object preserves its identity, and why creating new objects
 * can affect React state, props, memoization, and effect dependencies.
 */

import { memo, useEffect, useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Object identity is based on the object instance
// ---------------------------------------------------------------------

const firstUser = { name: "John Doe" };
const secondUser = { name: "John Doe" };

console.log(firstUser === secondUser); // false
console.log(Object.is(firstUser, secondUser)); // false

// Each object literal creates a separate object instance.
// The objects contain the same property values, but their identities are different.

// ---------------------------------------------------------------------
// 2. Assigning an object preserves its identity
// ---------------------------------------------------------------------

const user = { name: "John Doe" };
const sameUser = user;

console.log(user === sameUser); // true
console.log(Object.is(user, sameUser)); // true

// Assigning an object to another variable copies the reference, not the object.
// Both variables therefore refer to the same object instance.

// ---------------------------------------------------------------------
// 3. Object identity is different from object contents
// ---------------------------------------------------------------------

const original = {
  name: "John Doe",
  age: 30,
};

const equivalent = {
  name: "John Doe",
  age: 30,
};

console.log(original === equivalent); // false
console.log(original.name === equivalent.name); // true
console.log(original.age === equivalent.age); // true

// === does not perform a deep comparison of object properties.
// Comparing individual properties can produce equal primitive values even when the objects themselves
// have different identities.

// ---------------------------------------------------------------------
// 4. Objects are reference values
// ---------------------------------------------------------------------

const profile = {
  name: "John Doe",
};

const alias = profile;

alias.name = "Jane Doe";

console.log(profile.name); // "Jane Doe"
console.log(profile === alias); // true

// Both variables refer to the same object.
// Mutating the object through one reference is therefore visible through the other reference.

// ---------------------------------------------------------------------
// 5. Arrays also have object identity
// ---------------------------------------------------------------------

const firstItems = ["A", "B", "C"];
const secondItems = ["A", "B", "C"];
const sameItems = firstItems;

console.log(firstItems === secondItems); // false
console.log(firstItems === sameItems); // true

// Arrays are objects, so they follow the same identity rules.
// Two separately created arrays have different identities even when their elements are equal.

// ---------------------------------------------------------------------
// 6. Nested objects have their own identities
// ---------------------------------------------------------------------

const firstPerson = {
  name: "John Doe",
  address: {
    city: "Tetovo",
  },
};

const secondPerson = {
  name: "John Doe",
  address: {
    city: "Tetovo",
  },
};

console.log(firstPerson === secondPerson); // false
console.log(firstPerson.address === secondPerson.address); // false

// Every independently created nested object is a separate object instance.
// Object identity therefore exists at every level of an object structure.

// ---------------------------------------------------------------------
// 7. Shallow copies create a new outer object
// ---------------------------------------------------------------------

const sourceUser = {
  name: "John Doe",
  age: 30,
};

const copiedUser = {
  ...sourceUser,
};

console.log(sourceUser === copiedUser); // false
console.log(sourceUser.name === copiedUser.name); // true

// The spread syntax creates a new outer object.
// Primitive property values are copied into the new object, while object-valued properties
// would retain their existing references.

// ---------------------------------------------------------------------
// 8. Shallow copies preserve nested object references
// ---------------------------------------------------------------------

const sourceProfile = {
  name: "John Doe",
  address: {
    city: "Tetovo",
  },
};

const copiedProfile = {
  ...sourceProfile,
};

console.log(sourceProfile === copiedProfile); // false
console.log(sourceProfile.address === copiedProfile.address); // true

// The outer objects have different identities.
// The nested address object is shared because object spread performs a shallow copy.

// ---------------------------------------------------------------------
// 9. Immutable nested updates create new identities along the changed path
// ---------------------------------------------------------------------

interface Address {
  readonly city: string;
}

interface UserProfile {
  readonly name: string;
  readonly address: Address;
}

const initialProfile: UserProfile = {
  name: "John Doe",
  address: {
    city: "Tetovo",
  },
};

const updatedProfile: UserProfile = {
  ...initialProfile,
  address: {
    ...initialProfile.address,
    city: "Skopje",
  },
};

console.log(initialProfile === updatedProfile); // false
console.log(initialProfile.address === updatedProfile.address); // false

// The root object receives a new identity because the profile changed.
// The nested address also receives a new identity because its city changed.
// Unchanged properties can continue using their existing references.

// ---------------------------------------------------------------------
// 10. Object identity affects React state
// ---------------------------------------------------------------------

interface CounterState {
  readonly value: number;
}

const StateIdentityExample: FC = (): ReactElement => {
  const [state, setState] = useState<CounterState>({
    value: 0,
  });

  const setSameObject = (): void => {
    setState(state);
  };

  const setEquivalentObject = (): void => {
    setState({
      value: state.value,
    });
  };

  return (
    <section>
      <p>Value: {state.value}</p>
      <button type="button" onClick={setSameObject}>
        Set same object
      </button>
      <button type="button" onClick={setEquivalentObject}>
        Set equivalent object
      </button>
    </section>
  );
};

// setSameObject passes the existing object reference back to React.
// setEquivalentObject creates a new object with the same contents but a different identity.
// React can use the identity of the state value when determining whether an update changes it.

// ---------------------------------------------------------------------
// 11. Mutating state preserves object identity
// ---------------------------------------------------------------------

interface MutableProfile {
  name: string;
}

const MutationExample: FC = (): ReactElement => {
  const [profile, setProfile] = useState<MutableProfile>({
    name: "John Doe",
  });

  const changeName = (): void => {
    profile.name = "Jane Doe";
    setProfile(profile);
  };

  return (
    <section>
      <p>{profile.name}</p>
      <button type="button" onClick={changeName}>
        Change name
      </button>
    </section>
  );
};

// profile.name is changed directly, but profile itself remains the same object.
// Passing that same reference to setProfile does not provide React with a new state object.
// This is why state objects should generally be updated immutably.

// ---------------------------------------------------------------------
// 12. Immutable state updates create a new object identity
// ---------------------------------------------------------------------

const ImmutableStateExample: FC = (): ReactElement => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    address: {
      city: "Tetovo",
    },
  });

  const changeCity = (): void => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      address: {
        ...currentProfile.address,
        city: "Skopje",
      },
    }));
  };

  return (
    <section>
      <p>{profile.name}</p>
      <p>{profile.address.city}</p>
      <button type="button" onClick={changeCity}>
        Change city
      </button>
    </section>
  );
};

// The update creates a new profile object and a new address object.
// React can therefore observe new identities for the objects whose data changed.

// ---------------------------------------------------------------------
// 13. Object identity affects React.memo
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly user: UserProfile;
}

const UserCard: FC<UserCardProps> = memo(({ user }): ReactElement => {
  console.log("UserCard rendered");

  return (
    <article>
      <p>{user.name}</p>
      <p>{user.address.city}</p>
    </article>
  );
});

const MemoObjectExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const user: UserProfile = {
    name: "John Doe",
    address: {
      city: "Tetovo",
    },
  };

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

// user is recreated whenever MemoObjectExample renders.
// Its property values can remain unchanged while its object identity changes.
// React.memo's default prop comparison sees the new user reference and cannot bail out on that prop.

// ---------------------------------------------------------------------
// 14. Stable object identity can support memoization
// ---------------------------------------------------------------------

const stableProfile: UserProfile = {
  name: "John Doe",
  address: {
    city: "Tetovo",
  },
};

const StableUserCard: FC<UserCardProps> = memo(({ user }): ReactElement => {
  console.log("StableUserCard rendered");

  return (
    <article>
      <p>{user.name}</p>
      <p>{user.address.city}</p>
    </article>
  );
});

const StableObjectExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <StableUserCard user={stableProfile} />
    </section>
  );
};

// stableProfile keeps the same object identity between renders of this component.
// A memoized child receiving that reference can therefore potentially bail out when unrelated
// parent state changes.

// ---------------------------------------------------------------------
// 15. useMemo can preserve object identity between renders
// ---------------------------------------------------------------------

const MemoizedObjectExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John Doe");

  const user: UserProfile = useMemo(
    () => ({
      name,
      address: {
        city: "Tetovo",
      },
    }),
    [name],
  );

  return (
    <section>
      <p>Count: {count}</p>
      <p>{user.name}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <button type="button" onClick={() => setName("Jane Doe")}>
        Change name
      </button>
      <StableUserCard user={user} />
    </section>
  );
};

// useMemo returns the previously memoized object when its dependencies have not changed.
// count can change without creating a new user object.
// When name changes, the memoized calculation runs again and produces a new object identity.

// ---------------------------------------------------------------------
// 16. Object identity affects effect dependencies
// ---------------------------------------------------------------------

interface Options {
  readonly mode: "light" | "dark";
}

const EffectObjectExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const options: Options = {
    mode: "light",
  };

  useEffect(() => {
    console.log("Effect ran for options");
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
// The dependency therefore receives a new identity on every render.
// The effect runs after each committed render because React sees the object dependency as changed.

// ---------------------------------------------------------------------
// 17. Memoizing an object can stabilize an effect dependency
// ---------------------------------------------------------------------

const StableEffectObjectExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const options: Options = useMemo(
    () => ({
      mode: "light",
    }),
    [],
  );

  useEffect(() => {
    console.log("Effect ran for options");
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

// options retains the same object identity while its dependencies remain unchanged.
// Changing count alone therefore does not make the options dependency appear changed.

// ---------------------------------------------------------------------
// 18. Object identity matters for dependency design
// ---------------------------------------------------------------------

const PrimitiveEffectExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const mode: Options["mode"] = "light";

  useEffect(() => {
    console.log("Mode:", mode);
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

// If an effect only needs a primitive property, depending directly on that property
// can avoid unnecessary object-identity changes.
// The dependency should represent the value the effect actually uses.

// ---------------------------------------------------------------------
// 19. Object identity does not imply deep equality
// ---------------------------------------------------------------------

const DeepComparisonExample: FC = (): ReactElement => {
  const first = {
    settings: {
      theme: "light",
    },
  };

  const second = {
    settings: {
      theme: "light",
    },
  };

  const sameSettings = first.settings;

  console.log(first === second); // false
  console.log(first.settings === second.settings); // false
  console.log(first.settings === sameSettings); // true

  return (
    <section>
      <p>Object identity is checked at each reference.</p>
    </section>
  );
};

// Object identity comparisons do not recursively inspect nested properties.
// Deep equality is a separate operation that requires explicitly comparing object contents.

// ---------------------------------------------------------------------
// 20. Reference reuse can preserve unchanged branches
// ---------------------------------------------------------------------

interface Account {
  readonly name: string;
  readonly preferences: {
    readonly theme: "light" | "dark";
  };
}

const account: Account = {
  name: "John Doe",
  preferences: {
    theme: "light",
  },
};

const renamedAccount: Account = {
  ...account,
  name: "Jane Doe",
};

console.log(account === renamedAccount); // false
console.log(account.preferences === renamedAccount.preferences); // true

// The account object receives a new identity because its name changed.
// The preferences object can retain its identity because its data did not change.
// This structural sharing is a key property of immutable update patterns.

// ---------------------------------------------------------------------
// 21. Object identity is not a guarantee of component rendering behavior
// ---------------------------------------------------------------------

const IdentityDoesNotGuaranteeRender: FC = (): ReactElement => {
  const object = {
    value: "Example",
  };

  return <p>{object.value}</p>;
};

// A stable object reference can enable optimizations in identity-sensitive code,
// but object identity alone does not determine whether a React component renders.
// State, context, parent rendering, reconciliation, and other mechanisms also affect rendering.

// ---------------------------------------------------------------------
// 22. Integrated example
// ---------------------------------------------------------------------

interface Product {
  readonly name: string;
  readonly price: number;
}

interface ProductCardProps {
  readonly product: Product;
}

const ProductCard: FC<ProductCardProps> = memo(({ product }): ReactElement => {
  console.log("ProductCard rendered");

  return (
    <article>
      <h2>{product.name}</h2>
      <p>Price: {product.price}</p>
    </article>
  );
});

const ObjectIdentityDemo: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const [price, setPrice] = useState(100);

  const product: Product = useMemo(
    () => ({
      name: "Example product",
      price,
    }),
    [price],
  );

  return (
    <main>
      <h1>Object identity</h1>

      <p>Count: {count}</p>
      <p>Price: {product.price}</p>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment count
      </button>
      <button type="button" onClick={() => setPrice((value) => value + 10)}>
        Increase price
      </button>

      <ProductCard product={product} />
    </main>
  );
};

export default ObjectIdentityDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Every object has its own reference identity.
// - Two separately created objects can contain identical data while having different identities.
// - Assigning an object to another variable preserves the same identity.
// - Arrays are objects and follow the same identity rules.
// - Object identity is not the same as object contents or deep equality.
// - Object spread creates a new outer object but performs only a shallow copy.
// - Nested objects retain their references unless they are explicitly copied.
// - Immutable updates create new identities for objects whose data changes.
// - Unchanged nested branches can safely retain their existing references.
// - React state updates can depend on whether the state object has a new identity.
// - Mutating an existing state object preserves its identity and can prevent React from detecting the intended change.
// - React.memo uses Object.is-based prop comparison by default, making object identity relevant to memoization.
// - useMemo can preserve an object reference between renders when its dependencies remain unchanged.
// - Effect dependencies are compared using Object.is semantics, so object identity can determine when an effect runs.
// - Stable object identity is useful when an identity-sensitive mechanism needs it, but stability alone is not a performance goal.
