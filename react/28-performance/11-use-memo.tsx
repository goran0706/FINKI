/**
 * useMemo
 * =======
 *
 * useMemo is a React Hook that caches the result of a calculation between renders until
 * its dependencies change. It is primarily a performance optimization and can also preserve
 * the reference identity of objects and arrays that are passed to identity-sensitive consumers.
 */

import { useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic useMemo syntax
// ---------------------------------------------------------------------

const BasicUseMemoExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const doubled = useMemo(() => {
    return count * 2;
  }, [count]);

  return (
    <section>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// The calculation function runs during rendering when React needs to calculate the memoized value.
// The returned value is reused on later renders while count remains unchanged.
// When count changes, React recalculates the value.

// ---------------------------------------------------------------------
// 2. useMemo stores a calculated value
// ---------------------------------------------------------------------

const CalculatedValueExample: FC = (): ReactElement => {
  const [number, setNumber] = useState(10);

  const squared = useMemo(() => number * number, [number]);

  return (
    <section>
      <p>Number: {number}</p>
      <p>Squared: {squared}</p>
      <button type="button" onClick={() => setNumber((value) => value + 1)}>
        Increase number
      </button>
    </section>
  );
};

// useMemo returns the result of the calculation, not the calculation function itself.
// squared is therefore a number rather than a callback.

// ---------------------------------------------------------------------
// 3. Dependencies control recalculation
// ---------------------------------------------------------------------

const DependencyExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John Doe");

  const greeting = useMemo(() => {
    console.log("Greeting calculated");
    return `Hello, ${name}.`;
  }, [name]);

  return (
    <section>
      <p>{greeting}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment count
      </button>
      <button type="button" onClick={() => setName("Jane Doe")}>
        Change name
      </button>
    </section>
  );
};

// count is not a dependency of the calculation.
// Changing count can therefore re-render the component without recalculating greeting.
// Changing name causes the calculation to run again.

// ---------------------------------------------------------------------
// 4. Every reactive value used by the calculation belongs in dependencies
// ---------------------------------------------------------------------

interface PriceProps {
  readonly price: number;
  readonly quantity: number;
}

const TotalPriceExample: FC<PriceProps> = ({ price, quantity }): ReactElement => {
  const total = useMemo(() => {
    return price * quantity;
  }, [price, quantity]);

  return <p>Total: {total}</p>;
};

// Both price and quantity are read by the calculation.
// Both therefore belong in the dependency array.
// The memoized value is recalculated when either value changes.

// ---------------------------------------------------------------------
// 5. useMemo can avoid repeated expensive calculations
// ---------------------------------------------------------------------

const calculateTotal = (count: number): number => {
  let total = 0;

  for (let index = 0; index < count; index += 1) {
    total += index;
  }

  return total;
};

const ExpensiveCalculationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(100_000);
  const [otherState, setOtherState] = useState(0);

  const total = useMemo(() => {
    return calculateTotal(count);
  }, [count]);

  return (
    <section>
      <p>Total: {total}</p>
      <p>Other state: {otherState}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increase calculation input
      </button>
      <button type="button" onClick={() => setOtherState((value) => value + 1)}>
        Change unrelated state
      </button>
    </section>
  );
};

// calculateTotal can be expensive enough that avoiding unnecessary recalculation is useful.
// Changing otherState does not change count, so the memoized result can be reused.

// ---------------------------------------------------------------------
// 6. useMemo does not make the calculation itself faster
// ---------------------------------------------------------------------

const CalculationExample: FC = (): ReactElement => {
  const [value, setValue] = useState(100_000);

  const result = useMemo(() => {
    return calculateTotal(value);
  }, [value]);

  return (
    <section>
      <p>Result: {result}</p>
      <button type="button" onClick={() => setValue((currentValue) => currentValue + 1)}>
        Recalculate
      </button>
    </section>
  );
};

// useMemo does not optimize the calculation algorithm.
// When value changes, calculateTotal still runs.
// The optimization comes from avoiding the calculation when its dependencies have not changed.

// ---------------------------------------------------------------------
// 7. useMemo can preserve object identity
// ---------------------------------------------------------------------

interface Settings {
  readonly theme: "light" | "dark";
}

interface SettingsPanelProps {
  readonly settings: Settings;
}

const SettingsPanel: FC<SettingsPanelProps> = ({ settings }): ReactElement => {
  return <p>Theme: {settings.theme}</p>;
};

const ObjectMemoExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const settings = useMemo<Settings>(
    () => ({
      theme: "light",
    }),
    [],
  );

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

// The object created by the useMemo calculation keeps the same reference while its dependencies
// remain unchanged.
// This can be useful when the object is passed to a memoized child or used as an effect dependency.

// ---------------------------------------------------------------------
// 8. useMemo can support React.memo
// ---------------------------------------------------------------------

import { memo } from "react";

const MemoizedSettingsPanel: FC<SettingsPanelProps> = memo(({ settings }): ReactElement => {
  console.log("MemoizedSettingsPanel rendered");

  return <p>Theme: {settings.theme}</p>;
});

const MemoChildExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const settings = useMemo<Settings>(
    () => ({
      theme: "light",
    }),
    [],
  );

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <MemoizedSettingsPanel settings={settings} />
    </section>
  );
};

// React.memo compares the settings prop by reference.
// useMemo keeps that reference stable, allowing the child to potentially skip renders
// caused only by changes to count.

// ---------------------------------------------------------------------
// 9. Without useMemo, the object reference changes
// ---------------------------------------------------------------------

const UnstableObjectExample: FC = (): ReactElement => {
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
      <MemoizedSettingsPanel settings={settings} />
    </section>
  );
};

// settings is recreated on every render.
// The new object has the same contents but a different reference.
// MemoizedSettingsPanel therefore receives a changed prop on every parent render.

// ---------------------------------------------------------------------
// 10. useMemo can preserve array identity
// ---------------------------------------------------------------------

interface ItemListProps {
  readonly items: readonly string[];
}

const MemoizedItemList: FC<ItemListProps> = memo(({ items }): ReactElement => {
  console.log("MemoizedItemList rendered");

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
});

const ArrayMemoExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const items = useMemo(() => ["A", "B", "C"], []);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <MemoizedItemList items={items} />
    </section>
  );
};

// The array reference remains stable while the dependency list remains unchanged.
// This can allow a memoized child to skip work when unrelated parent state changes.

// ---------------------------------------------------------------------
// 11. useMemo can depend on changing values
// ---------------------------------------------------------------------

const FilteredItemsExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const items = ["Apple", "Banana", "Orange", "Pear"];

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return items.filter((item) => item.toLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter items" />
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <ul>
        {filteredItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

// filteredItems is recalculated when query changes.
// Changing count does not change the filtering criteria, so the previous filtered array can be reused.
// The calculation should still correctly reflect every value it reads from reactive scope.

// ---------------------------------------------------------------------
// 12. useMemo can memoize derived data
// ---------------------------------------------------------------------

interface Product {
  readonly name: string;
  readonly price: number;
}

const products: readonly Product[] = [
  { name: "Keyboard", price: 80 },
  { name: "Mouse", price: 40 },
  { name: "Monitor", price: 300 },
];

const DerivedDataExample: FC = (): ReactElement => {
  const [minimumPrice, setMinimumPrice] = useState(50);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => product.price >= minimumPrice);
  }, [minimumPrice]);

  return (
    <section>
      <p>Minimum price: {minimumPrice}</p>
      <button type="button" onClick={() => setMinimumPrice(100)}>
        Set minimum to 100
      </button>
      <ul>
        {visibleProducts.map((product) => (
          <li key={product.name}>
            {product.name}: {product.price}
          </li>
        ))}
      </ul>
    </section>
  );
};

// Derived data is often a suitable use case when its calculation is meaningfully expensive
// or when preserving its reference is useful to a memoized consumer.

// ---------------------------------------------------------------------
// 13. useMemo can return objects with changing dependencies
// ---------------------------------------------------------------------

interface SearchOptions {
  readonly query: string;
  readonly limit: number;
}

const SearchOptionsExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(10);

  const options = useMemo<SearchOptions>(
    () => ({
      query,
      limit,
    }),
    [query, limit],
  );

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
      <p>Limit: {options.limit}</p>
      <button type="button" onClick={() => setLimit((value) => value + 10)}>
        Increase limit
      </button>
    </section>
  );
};

// The memoized object remains stable until query or limit changes.
// When either dependency changes, a new SearchOptions object is created.

// ---------------------------------------------------------------------
// 14. Move object creation into the calculation when possible
// ---------------------------------------------------------------------

const SearchExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(10);

  const results = useMemo(() => {
    const options: SearchOptions = {
      query,
      limit,
    };

    return `Searching for "${options.query}" with limit ${options.limit}`;
  }, [query, limit]);

  return (
    <section>
      <p>{results}</p>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
      <button type="button" onClick={() => setLimit((value) => value + 10)}>
        Increase limit
      </button>
    </section>
  );
};

// Creating an object inside the calculation keeps the dependency list based on the primitive values
// actually used by the calculation.
// This can be simpler than creating an object outside useMemo and then depending on that object.

// ---------------------------------------------------------------------
// 15. Object dependencies can defeat memoization
// ---------------------------------------------------------------------

const ObjectDependencyExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const options: SearchOptions = {
    query: "example",
    limit: 10,
  };

  const result = useMemo(() => {
    console.log("Calculation ran");
    return `${options.query}:${options.limit}`;
  }, [options]);

  return (
    <section>
      <p>{result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// options is a new object on every render.
// Because its reference changes, the dependency is considered changed.
// The calculation therefore runs again even though the object's property values are unchanged.

// ---------------------------------------------------------------------
// 16. Primitive dependencies can avoid unnecessary identity changes
// ---------------------------------------------------------------------

const PrimitiveDependencyExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const query = "example";
  const limit = 10;

  const result = useMemo(() => {
    console.log("Calculation ran");
    return `${query}:${limit}`;
  }, [query, limit]);

  return (
    <section>
      <p>{result}</p>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// Primitive dependencies remain equal when their values do not change.
// The memoized calculation can therefore be reused when count changes.

// ---------------------------------------------------------------------
// 17. useMemo calculations should be pure
// ---------------------------------------------------------------------

const PureCalculationExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const doubled = useMemo(() => count * 2, [count]);

  return (
    <section>
      <p>Doubled: {doubled}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// The calculation should derive its result from its inputs without causing side effects.
// Side effects belong in the appropriate effect or event-handler mechanisms rather than inside useMemo.

// ---------------------------------------------------------------------
// 18. useMemo should not be used for side effects
// ---------------------------------------------------------------------

const SideEffectOutsideMemoExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const doubled = useMemo(() => count * 2, [count]);

  const handleLog = (): void => {
    console.log("Doubled:", doubled);
  };

  return (
    <section>
      <p>Doubled: {doubled}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <button type="button" onClick={handleLog}>
        Log result
      </button>
    </section>
  );
};

// The memoized calculation only derives a value.
// The logging side effect occurs in an event handler instead of during the calculation.

// ---------------------------------------------------------------------
// 19. useMemo is not a semantic guarantee
// ---------------------------------------------------------------------

const MemoizedValueExample: FC = (): ReactElement => {
  const value = useMemo(() => {
    return {
      label: "Example",
    };
  }, []);

  return <p>{value.label}</p>;
};

// React treats useMemo as a performance optimization and may discard a memoized value in
// specific situations, such as development edits or when a component suspends during initial mount.
// Code should therefore remain correct even if the calculation runs again.

// ---------------------------------------------------------------------
// 20. useMemo does not replace state
// ---------------------------------------------------------------------

const DerivedValueExample: FC = (): ReactElement => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");

  const fullName = useMemo(() => {
    return `${firstName} ${lastName}`;
  }, [firstName, lastName]);

  return (
    <section>
      <p>{fullName}</p>
      <button type="button" onClick={() => setFirstName("Jane")}>
        Change first name
      </button>
      <button type="button" onClick={() => setLastName("Smith")}>
        Change last name
      </button>
    </section>
  );
};

// fullName is derived entirely from existing state.
// useMemo caches that derived value; it does not make fullName independent state.
// Derived values generally should not be duplicated as separate state when they can be calculated
// from existing state and props.

// ---------------------------------------------------------------------
// 21. useMemo is different from useCallback
// ---------------------------------------------------------------------

const HookDifferenceExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const calculatedValue = useMemo(() => count * 2, [count]);

  const handleAction = () => {
    console.log("Count:", count);
  };

  return (
    <section>
      <p>Calculated value: {calculatedValue}</p>
      <button type="button" onClick={handleAction}>
        Log count
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// useMemo caches the result of a calculation.
// useCallback caches a function reference.
// These hooks solve different identity and caching problems.

// ---------------------------------------------------------------------
// 22. Integrated example
// ---------------------------------------------------------------------

interface ProductListProps {
  readonly products: readonly Product[];
}

const ProductList: FC<ProductListProps> = memo(({ products }): ReactElement => {
  console.log("ProductList rendered");

  return (
    <ul>
      {products.map((product) => (
        <li key={product.name}>
          {product.name}: {product.price}
        </li>
      ))}
    </ul>
  );
});

const UseMemoDemo: FC = (): ReactElement => {
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [count, setCount] = useState(0);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => product.price >= minimumPrice);
  }, [minimumPrice]);

  return (
    <main>
      <h1>useMemo</h1>

      <p>Minimum price: {minimumPrice}</p>
      <p>Count: {count}</p>

      <button type="button" onClick={() => setMinimumPrice(100)}>
        Filter from 100
      </button>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment count
      </button>

      <ProductList products={visibleProducts} />
    </main>
  );
};

export default UseMemoDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - useMemo caches the result of a calculation between renders.
// - The calculation runs again when one of its dependencies changes.
// - Dependencies should include the reactive values used by the calculation.
// - useMemo can avoid repeated expensive calculations when unrelated state changes.
// - useMemo does not make the underlying calculation algorithm faster.
// - useMemo can preserve object and array reference identity.
// - Stable references can help memoized children avoid unnecessary rendering.
// - Creating a new object or array dependency on every render can defeat memoization.
// - Primitive dependencies can often make dependency relationships simpler and more stable.
// - useMemo calculations should be pure and should not perform side effects.
// - useMemo does not replace state and should not be used to store independently changing data.
// - useMemo caches values, while useCallback caches function references.
// - useMemo is a performance optimization, not a semantic guarantee that a value will never be recalculated.
// - Components should remain correct even when a memoized calculation runs again.
