/**
 * React.memo
 * ==========
 *
 * React.memo is a higher-order component that lets React skip re-rendering a component when its
 * props have not changed. By default, React compares each prop with Object.is semantics, so
 * reference identity is especially important for object, array, and function props.
 *
 * memo is a performance optimization rather than a correctness mechanism. A memoized component
 * can still render when its own state or consumed context changes, and memoization is only useful
 * when skipping the component's work provides a measurable benefit.
 */

import { memo, useCallback, useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic React.memo usage
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

const Greeting: FC<GreetingProps> = memo(({ name }): ReactElement => {
  console.log("Greeting rendered");

  return <p>Hello, {name}.</p>;
});

// memo wraps a component and returns a memoized component.
// When its parent renders, React compares the new props with the previous props before
// deciding whether the memoized component needs to render again.

// ---------------------------------------------------------------------
// 2. Primitive props can remain equal
// ---------------------------------------------------------------------

const PrimitivePropsExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const name = "John Doe";

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <Greeting name={name} />
    </section>
  );
};

// name is a string primitive.
// When the parent re-renders because count changes, the name prop still compares equal.
// Greeting can therefore skip its render when its other relevant conditions have not changed.

// ---------------------------------------------------------------------
// 3. memo uses Object.is semantics for props
// ---------------------------------------------------------------------

interface ScoreProps {
  readonly score: number;
}

const Score: FC<ScoreProps> = memo(({ score }): ReactElement => {
  console.log("Score rendered");

  return <p>Score: {score}</p>;
});

const ObjectIsExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <Score score={100} />
    </section>
  );
};

// The score prop remains the same primitive value.
// React.memo's default comparison treats the previous and next values as equal using Object.is semantics.
// This allows Score to bail out when the parent changes only its count state.

// ---------------------------------------------------------------------
// 4. Object props depend on reference identity
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

const ObjectPropExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const user: User = {
    name: "John Doe",
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

// user is a new object on every render.
// Even though user.name remains the same, the object reference changes.
// The default memo comparison therefore sees a changed prop and cannot bail out on user.

// ---------------------------------------------------------------------
// 5. useMemo can stabilize an object prop
// ---------------------------------------------------------------------

const MemoizedObjectPropExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const user = useMemo<User>(
    () => ({
      name: "John Doe",
    }),
    [],
  );

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

// useMemo preserves the user object reference while its dependencies remain unchanged.
// count can change without creating a new user object.
// This can allow UserCard to bail out when count changes.

// ---------------------------------------------------------------------
// 6. Function props also depend on reference identity
// ---------------------------------------------------------------------

interface ActionButtonProps {
  readonly onAction: () => void;
}

const ActionButton: FC<ActionButtonProps> = memo(({ onAction }): ReactElement => {
  console.log("ActionButton rendered");

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
      <ActionButton onAction={handleAction} />
    </section>
  );
};

// handleAction is recreated whenever FunctionPropExample renders.
// Its new reference causes the onAction prop to compare as changed.
// React.memo therefore cannot skip ActionButton's render based on the default comparison.

// ---------------------------------------------------------------------
// 7. useCallback can stabilize a function prop
// ---------------------------------------------------------------------

const MemoizedFunctionPropExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const handleAction = useCallback((): void => {
    console.log("Action");
  }, []);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <ActionButton onAction={handleAction} />
    </section>
  );
};

// handleAction keeps the same reference between renders because its dependency list is empty.
// When count changes, ActionButton can therefore receive the same onAction reference
// and potentially bail out.

// ---------------------------------------------------------------------
// 8. memo does not prevent the component from updating its own state
// ---------------------------------------------------------------------

interface CounterProps {
  readonly label: string;
}

const MemoizedCounter: FC<CounterProps> = memo(({ label }): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("MemoizedCounter rendered");

  return (
    <section>
      <p>{label}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
});

// memo only compares props when determining whether a parent-driven render can be skipped.
// The component's own state updates still cause it to render.

// ---------------------------------------------------------------------
// 9. memo does not block context updates
// ---------------------------------------------------------------------

import { createContext, useContext } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<Theme>("light");

const ThemedLabel: FC = memo((): ReactElement => {
  const theme = useContext(ThemeContext);

  console.log("ThemedLabel rendered");

  return <p>Theme: {theme}</p>;
});

// A memoized component that reads context still updates when the context value it consumes changes.
// memo does not prevent context-driven updates.

// ---------------------------------------------------------------------
// 10. Context changes can reach memoized descendants
// ---------------------------------------------------------------------

const ContextExample: FC = (): ReactElement => {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = (): void => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={theme}>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
      <ThemedLabel />
    </ThemeContext.Provider>
  );
};

// ThemedLabel has no explicit theme prop.
// It reads the context directly, so changing the provider value causes the component to update
// even though it is wrapped in memo.

// ---------------------------------------------------------------------
// 11. memo does not compare nested object properties
// ---------------------------------------------------------------------

interface Settings {
  readonly theme: Theme;
}

interface SettingsPanelProps {
  readonly settings: Settings;
}

const SettingsPanel: FC<SettingsPanelProps> = memo(({ settings }): ReactElement => {
  console.log("SettingsPanel rendered");

  return <p>Theme: {settings.theme}</p>;
});

const NestedObjectExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const settings: Settings = {
    theme: "light",
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <SettingsPanel settings={settings} />
    </section>
  );
};

// React.memo does not perform a deep comparison of settings.
// The settings prop itself is compared by reference.
// A new settings object therefore counts as a changed prop even when settings.theme is unchanged.

// ---------------------------------------------------------------------
// 12. Custom comparison functions
// ---------------------------------------------------------------------

interface Product {
  readonly name: string;
  readonly price: number;
}

interface ProductCardProps {
  readonly product: Product;
}

const areProductsEqual = (previousProps: ProductCardProps, nextProps: ProductCardProps): boolean => {
  return (
    previousProps.product.name === nextProps.product.name && previousProps.product.price === nextProps.product.price
  );
};

const ProductCard: FC<ProductCardProps> = memo(({ product }): ReactElement => {
  console.log("ProductCard rendered");

  return (
    <article>
      <h2>{product.name}</h2>
      <p>Price: {product.price}</p>
    </article>
  );
}, areProductsEqual);

// A custom comparison function can define when the component's props should be considered equal.
// Here, two different product objects can be treated as equivalent when their relevant
// property values are equal.

// ---------------------------------------------------------------------
// 13. Custom comparisons must compare every relevant prop
// ---------------------------------------------------------------------

interface ProductDetailsProps {
  readonly product: Product;
  readonly onSelect: () => void;
}

const areProductDetailsEqual = (previousProps: ProductDetailsProps, nextProps: ProductDetailsProps): boolean => {
  return (
    previousProps.product.name === nextProps.product.name &&
    previousProps.product.price === nextProps.product.price &&
    previousProps.onSelect === nextProps.onSelect
  );
};

const ProductDetails: FC<ProductDetailsProps> = memo(({ product, onSelect }): ReactElement => {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>Price: {product.price}</p>
      <button type="button" onClick={onSelect}>
        Select
      </button>
    </article>
  );
}, areProductDetailsEqual);

// A custom comparator must account for every prop that can affect rendering.
// Ignoring a changed function prop, for example, can cause the component to retain behavior
// based on an older function closure.

// ---------------------------------------------------------------------
// 14. memo does not make children automatically stable
// ---------------------------------------------------------------------

interface PanelProps {
  readonly children: ReactElement;
}

const Panel: FC<PanelProps> = memo(({ children }): ReactElement => {
  console.log("Panel rendered");

  return <div>{children}</div>;
});

const ChildrenExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <Panel>
        <p>Static content</p>
      </Panel>
    </section>
  );
};

// JSX passed through children creates a React element object.
// When that JSX is recreated by the parent, the children prop can receive a new reference.
// memo compares the children prop like any other prop; it does not recursively compare the rendered tree.

// ---------------------------------------------------------------------
// 15. memo is not required for correctness
// ---------------------------------------------------------------------

const CorrectWithoutMemo: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// A component behaves correctly without memo.
// memo changes when React may skip rendering based on props; it does not change the component's
// fundamental state, event, or rendering semantics.

// ---------------------------------------------------------------------
// 16. memo does not guarantee a component never renders
// ---------------------------------------------------------------------

const MemoizedLabel: FC<{ readonly value: string }> = memo(({ value }): ReactElement => {
  console.log("MemoizedLabel rendered");

  return <p>{value}</p>;
});

const RenderGuaranteeExample: FC = (): ReactElement => {
  return <MemoizedLabel value="Example" />;
};

// memo is a performance optimization, not a promise that a component will never render.
// React may still render a memoized component when its own state or consumed context changes,
// and development behavior can also involve additional renders for reasons unrelated to prop changes.

// ---------------------------------------------------------------------
// 17. Avoid unnecessary memoization
// ---------------------------------------------------------------------

const SimpleLabel: FC<{ readonly text: string }> = ({ text }): ReactElement => {
  return <p>{text}</p>;
};

const SimpleLabelExample: FC = (): ReactElement => {
  return <SimpleLabel text="Example text" />;
};

// For a small component with inexpensive rendering, adding memo may provide little or no benefit.
// Memoization should be considered in the context of the component's rendering cost and update frequency.

// ---------------------------------------------------------------------
// 18. Memoization is most useful when work is expensive
// ---------------------------------------------------------------------

interface ItemListProps {
  readonly items: readonly string[];
}

const ItemList: FC<ItemListProps> = memo(({ items }): ReactElement => {
  console.log("ItemList rendered");

  const renderedItems = items.map((item) => <li key={item}>{item}</li>);

  return <ul>{renderedItems}</ul>;
});

const ExpensiveWorkExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const items = useMemo(() => Array.from({ length: 1000 }, (_, index) => `Item ${index + 1}`), []);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <ItemList items={items} />
    </section>
  );
};

// ItemList performs work proportional to the number of items.
// The items reference remains stable, so memo can allow ItemList to skip that work
// when only count changes.

// ---------------------------------------------------------------------
// 19. Memoization depends on stable props
// ---------------------------------------------------------------------

const UnstableItemsExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const items = ["A", "B", "C"];

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <ItemList items={items} />
    </section>
  );
};

// The items array is recreated whenever UnstableItemsExample renders.
// Its new reference causes ItemList's props to compare as changed.
// memo cannot provide the intended bailout for this prop without a stable items reference.

// ---------------------------------------------------------------------
// 20. Memoization does not replace good state placement
// ---------------------------------------------------------------------

const StatePlacementExample: FC = (): ReactElement => {
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);

  return (
    <section>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Keeping state close to the components that need it can reduce the amount of the tree
// that needs to respond to updates.
// memo can complement good state placement, but it does not replace it.

// ---------------------------------------------------------------------
// 21. memo and changing dependencies
// ---------------------------------------------------------------------

interface SearchResultProps {
  readonly query: string;
}

const SearchResult: FC<SearchResultProps> = memo(({ query }): ReactElement => {
  console.log("SearchResult rendered");

  return <p>Results for: {query}</p>;
});

const SearchExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <SearchResult query={query} />
    </section>
  );
};

// SearchResult can skip renders caused only by count changes because its query prop remains equal.
// When query changes, SearchResult receives a different prop and needs to render.

// ---------------------------------------------------------------------
// 22. Integrated example
// ---------------------------------------------------------------------

interface ProfileCardProps {
  readonly name: string;
  readonly onSelect: () => void;
}

const ProfileCard: FC<ProfileCardProps> = memo(({ name, onSelect }): ReactElement => {
  console.log("ProfileCard rendered");

  return (
    <article>
      <h2>{name}</h2>
      <button type="button" onClick={onSelect}>
        Select profile
      </button>
    </article>
  );
});

const ReactMemoDemo: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John Doe");

  const handleSelect = useCallback((): void => {
    console.log("Selected:", name);
  }, [name]);

  return (
    <main>
      <h1>React.memo</h1>

      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment count
      </button>

      <button type="button" onClick={() => setName("Jane Doe")}>
        Change name
      </button>

      <ProfileCard name={name} onSelect={handleSelect} />
    </main>
  );
};

export default ReactMemoDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React.memo can skip a component's parent-driven render when its props are considered unchanged.
// - By default, memo compares each prop using Object.is semantics.
// - Primitive props can remain equal across renders when their values do not change.
// - Object, array, and function props depend on reference identity during the default comparison.
// - Recreating object or function props can prevent a memoized component from bailing out.
// - useMemo can stabilize object or array references when their dependencies remain unchanged.
// - useCallback can stabilize function references when its dependencies remain unchanged.
// - A memoized component can still update because of its own state.
// - A memoized component that consumes context can still update when that context changes.
// - memo does not perform deep equality checks on objects.
// - Custom comparison functions can define prop equality but must account for every prop that affects rendering.
// - children is a prop and is compared like other props.
// - memo is a performance optimization, not a correctness requirement or a guarantee that a component never renders.
// - Memoization is most useful when it prevents meaningful rendering work under realistic update patterns.
// - Stable props, appropriate state placement, and measurement are important when evaluating memoization.
