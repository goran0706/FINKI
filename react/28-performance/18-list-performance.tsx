/**
 * List Performance
 * =================
 *
 * Rendering a list means creating React elements and reconciling the corresponding component
 * subtrees. List performance depends on how many items render, how much work each item performs,
 * how often the list updates, and whether unchanged rows can be reused efficiently.
 */

import { memo, useCallback, useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Rendering a list has a cost
// ---------------------------------------------------------------------

interface Item {
  readonly id: number;
  readonly name: string;
}

const items: readonly Item[] = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
  { id: 4, name: "Item 4" },
];

const BasicList: FC = (): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// Each mapped item creates an element and contributes to reconciliation.
// A small list is usually inexpensive, but the same work can become significant at larger scales.

// ---------------------------------------------------------------------
// 2. List size affects rendering cost
// ---------------------------------------------------------------------

const LargeList: FC = (): ReactElement => {
  const largeItems = Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
  }));

  return (
    <ul>
      {largeItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// Rendering more rows generally means more JavaScript work and more React reconciliation work.
// The DOM also contains more rendered elements, which can increase browser layout and painting work.

// ---------------------------------------------------------------------
// 3. Row complexity matters
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

const products: readonly Product[] = [
  { id: 1, name: "Keyboard", price: 80 },
  { id: 2, name: "Mouse", price: 40 },
  { id: 3, name: "Monitor", price: 300 },
];

const ProductRow: FC<{ readonly product: Product }> = ({ product }): ReactElement => {
  return (
    <li>
      <strong>{product.name}</strong>
      <span> — ${product.price}</span>
    </li>
  );
};

const ProductList: FC = (): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </ul>
  );
};

// A row that performs substantial calculations, renders many descendants, or runs expensive
// effects costs more than a simple row. List performance therefore depends on row complexity as well as list size.

// ---------------------------------------------------------------------
// 4. Stable keys preserve item identity
// ---------------------------------------------------------------------

const KeyedList: FC = (): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </ul>
  );
};

// A key identifies an item among its siblings during reconciliation.
// Stable keys allow React to match existing items when the list changes.

// ---------------------------------------------------------------------
// 5. Array indexes are not always appropriate keys
// ---------------------------------------------------------------------

const IndexKeyExample: FC = (): ReactElement => {
  return (
    <ul>
      {products.map((product, index) => (
        <ProductRow key={index} product={product} />
      ))}
    </ul>
  );
};

// An index key can be acceptable when the list is static and items are never reordered,
// inserted, or removed. For dynamic lists, a stable item identifier is generally more appropriate.

// ---------------------------------------------------------------------
// 6. Unstable keys can cause unnecessary remounting
// ---------------------------------------------------------------------

const UnstableKeyExample: FC = (): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <ProductRow key={Math.random()} product={product} />
      ))}
    </ul>
  );
};

// A key that changes between renders prevents React from matching the old row with the new row.
// React may therefore discard existing rows and mount new ones.
// Keys should represent stable item identity, not a value generated during rendering.

// ---------------------------------------------------------------------
// 7. Row components can be memoized
// ---------------------------------------------------------------------

interface RowProps {
  readonly item: Item;
}

const MemoizedRow: FC<RowProps> = memo(({ item }): ReactElement => {
  console.log("Rendering row:", item.id);

  return <li>{item.name}</li>;
});

const MemoizedList: FC = (): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <MemoizedRow key={item.id} item={item} />
      ))}
    </ul>
  );
};

// React.memo can allow a row to skip rendering when its props are unchanged according to React's
// memo comparison. This is useful when the parent renders frequently but individual rows do not change.

// ---------------------------------------------------------------------
// 8. Parent state can cause every row to be considered for rendering
// ---------------------------------------------------------------------

const ListWithParentState: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Parent count: {count}
      </button>

      <ul>
        {items.map((item) => (
          <MemoizedRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

// When the parent renders again, React still traverses the list.
// Memoized rows can bail out when their item props remain unchanged.
// This reduces row rendering work but does not eliminate the parent's render work.

// ---------------------------------------------------------------------
// 9. Stable primitive props are easy to compare
// ---------------------------------------------------------------------

interface NameRowProps {
  readonly id: number;
  readonly name: string;
}

const NameRow: FC<NameRowProps> = memo(({ id, name }): ReactElement => {
  console.log("Rendering name row:", id);

  return <li>{name}</li>;
});

const StablePrimitiveList: FC = (): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <NameRow key={item.id} id={item.id} name={item.name} />
      ))}
    </ul>
  );
};

// Primitive props such as strings and numbers have value-based equality.
// Keeping row props simple can make memoization boundaries easier to reason about.

// ---------------------------------------------------------------------
// 10. New object props can defeat memoization
// ---------------------------------------------------------------------

const ObjectPropRow: FC<{ readonly item: Item }> = memo(({ item }): ReactElement => {
  console.log("Rendering object-prop row:", item.id);

  return <li>{item.name}</li>;
});

const NewObjectPropList: FC = (): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <ObjectPropRow key={item.id} item={{ id: item.id, name: item.name }} />
      ))}
    </ul>
  );
};

// The object passed to each row is newly created during every render.
// Even when its fields contain the same values, its reference is different.
// React.memo compares the prop reference, so the row cannot bail out based on that prop.

// ---------------------------------------------------------------------
// 11. Preserve item object identity when appropriate
// ---------------------------------------------------------------------

const StableObjectList: FC = (): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <ObjectPropRow key={item.id} item={item} />
      ))}
    </ul>
  );
};

// Reusing the existing item objects preserves their references between renders.
// If the parent renders without changing items, memoized rows can observe unchanged object props.

// ---------------------------------------------------------------------
// 12. Derived arrays can also change identity
// ---------------------------------------------------------------------

const DerivedList: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter items" />

      <ul>
        {filteredItems.map((item) => (
          <MemoizedRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

// Filtering creates a new array, but the individual item objects remain the same references.
// Row memoization can therefore still help when unchanged item objects are passed to the rows.

// ---------------------------------------------------------------------
// 13. Memoize expensive derived list data when useful
// ---------------------------------------------------------------------

const MemoizedDerivedList: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <section>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Unrelated count: {count}
      </button>

      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter items" />

      <ul>
        {filteredItems.map((item) => (
          <MemoizedRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

// useMemo can avoid repeating the filtering calculation when unrelated state changes.
// It is useful when the calculation has a meaningful cost or when the resulting reference
// needs to remain stable for another optimization boundary.

// ---------------------------------------------------------------------
// 14. Stable callbacks can matter for memoized rows
// ---------------------------------------------------------------------

interface SelectableRowProps {
  readonly item: Item;
  readonly onSelect: (id: number) => void;
}

const SelectableRow: FC<SelectableRowProps> = memo(({ item, onSelect }): ReactElement => {
  return (
    <li>
      <button type="button" onClick={() => onSelect(item.id)}>
        {item.name}
      </button>
    </li>
  );
});

const CallbackList: FC = (): ReactElement => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  const handleSelect = useCallback((id: number): void => {
    setSelectedId(id);
  }, []);

  return (
    <section>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Unrelated count: {count}
      </button>

      <p>Selected: {selectedId ?? "None"}</p>

      <ul>
        {items.map((item) => (
          <SelectableRow key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </ul>
    </section>
  );
};

// A new callback created during each parent render is a new function reference.
// useCallback can preserve the callback reference when its dependencies remain unchanged,
// allowing a memoized row to compare the callback prop as unchanged.

// ---------------------------------------------------------------------
// 15. Avoid unnecessary work inside every row
// ---------------------------------------------------------------------

const WorkHeavyRow: FC<{ readonly item: Item }> = memo(({ item }): ReactElement => {
  const normalizedName = item.name.trim().toLowerCase();
  const displayName = normalizedName.replace(/\b\w/g, (character) => character.toUpperCase());

  return <li>{displayName}</li>;
});

// Work performed by every row is multiplied by the number of rendered items.
// Moving reusable or expensive calculations outside the row, deriving them once, or simplifying
// the row can reduce total list work when measurement shows that row computation is significant.

// ---------------------------------------------------------------------
// 16. Keep row rendering focused
// ---------------------------------------------------------------------

const FocusedRow: FC<{ readonly item: Item }> = memo(({ item }): ReactElement => {
  return (
    <li>
      <span>{item.name}</span>
    </li>
  );
});

// A focused row should primarily render the information needed for that item.
// Large amounts of unrelated state or expensive work inside each row increase the cost of the list.

// ---------------------------------------------------------------------
// 17. Avoid unnecessary list-wide transformations
// ---------------------------------------------------------------------

const PreparedList: FC = (): ReactElement => {
  const preparedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      displayName: item.name.toUpperCase(),
    }));
  }, []);

  return (
    <ul>
      {preparedItems.map((item) => (
        <li key={item.id}>{item.displayName}</li>
      ))}
    </ul>
  );
};

// If the same transformation is needed by many rows, preparing the data once can avoid repeating
// identical work inside every row. Whether this matters depends on the size and complexity of the data.

// ---------------------------------------------------------------------
// 18. List updates should change only the affected data
// ---------------------------------------------------------------------

const EditableRow: FC<{
  readonly item: Item;
  readonly onRename: (id: number, name: string) => void;
}> = memo(({ item, onRename }): ReactElement => {
  return (
    <li>
      <input value={item.name} onChange={(event) => onRename(item.id, event.target.value)} />
    </li>
  );
});

const EditableList: FC = (): ReactElement => {
  const [list, setList] = useState<readonly Item[]>(items);

  const handleRename = useCallback((id: number, name: string): void => {
    setList((current) => current.map((item) => (item.id === id ? { ...item, name } : item)));
  }, []);

  return (
    <ul>
      {list.map((item) => (
        <EditableRow key={item.id} item={item} onRename={handleRename} />
      ))}
    </ul>
  );
};

// Immutable updates preserve the existing object reference for rows that did not change.
// Combined with memoized rows, this can allow unchanged rows to bail out while the changed row renders again.

// ---------------------------------------------------------------------
// 19. Avoid creating unnecessary row data during every render
// ---------------------------------------------------------------------

const PreparedRowList: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const rowData = useMemo(() => {
    return items.map((item) => ({
      item,
      label: item.name,
    }));
  }, []);

  return (
    <section>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Count: {count}
      </button>

      <ul>
        {rowData.map(({ item, label }) => (
          <li key={item.id}>{label}</li>
        ))}
      </ul>
    </section>
  );
};

// Stable derived data can reduce repeated allocation when it is genuinely reused across renders.
// Memoization should still be justified by the work and the resulting identity requirements.

// ---------------------------------------------------------------------
// 20. Do not assume every list needs memoization
// ---------------------------------------------------------------------

const SimpleList: FC = (): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// A small list of inexpensive rows may not benefit meaningfully from React.memo, useMemo, or useCallback.
// These mechanisms also add comparison, dependency, and code-complexity costs.

// ---------------------------------------------------------------------
// 21. Large rendered lists can require a different rendering strategy
// ---------------------------------------------------------------------

const ManyRows: FC = (): ReactElement => {
  const rows = Array.from({ length: 5000 }, (_, index) => <li key={index}>Item {index + 1}</li>);

  return <ul>{rows}</ul>;
};

// Rendering thousands of DOM nodes can become expensive even when each row is simple.
// At sufficiently large scales, reducing the number of mounted rows can matter more than optimizing
// individual row renders. Techniques such as list virtualization address that separate problem.

// ---------------------------------------------------------------------
// 22. Measure the actual list bottleneck
// ---------------------------------------------------------------------

const MeasuredList: FC = (): ReactElement => {
  const start = performance.now();

  const renderedItems = items.map((item) => <li key={item.id}>{item.name}</li>);

  const elapsed = performance.now() - start;

  console.log(`Prepared ${renderedItems.length} rows in ${elapsed.toFixed(2)} ms`);

  return <ul>{renderedItems}</ul>;
};

// Measuring data preparation can identify JavaScript work before React reconciles the elements.
// React DevTools Profiler can separately show rendering work performed by React components.
// Measurements should use realistic list sizes and representative workloads.

// ---------------------------------------------------------------------
// 23. Integrated example
// ---------------------------------------------------------------------

interface PerformanceListItem {
  readonly id: number;
  readonly name: string;
  readonly category: string;
}

const performanceItems: readonly PerformanceListItem[] = [
  { id: 1, name: "Keyboard", category: "Input" },
  { id: 2, name: "Mouse", category: "Input" },
  { id: 3, name: "Monitor", category: "Display" },
  { id: 4, name: "Webcam", category: "Camera" },
  { id: 5, name: "Headphones", category: "Audio" },
];

interface PerformanceRowProps {
  readonly item: PerformanceListItem;
  readonly onSelect: (id: number) => void;
}

const PerformanceRow: FC<PerformanceRowProps> = memo(({ item, onSelect }): ReactElement => {
  console.log("Rendering:", item.id);

  return (
    <li>
      <button type="button" onClick={() => onSelect(item.id)}>
        {item.name} — {item.category}
      </button>
    </li>
  );
});

const ListPerformanceDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery === "") {
      return performanceItems;
    }

    return performanceItems.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) || item.category.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const handleSelect = useCallback((id: number): void => {
    setSelectedId(id);
  }, []);

  return (
    <main>
      <h1>List Performance</h1>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Unrelated count: {count}
      </button>

      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter items" />

      <p>
        Selected:{" "}
        {selectedId === null ? "None" : (performanceItems.find((item) => item.id === selectedId)?.name ?? "Unknown")}
      </p>

      <ul>
        {filteredItems.map((item) => (
          <PerformanceRow key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </ul>
    </main>
  );
};

export default ListPerformanceDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Rendering a list has a cost that grows with the number and complexity of its rows.
// - Large lists can increase JavaScript, React reconciliation, DOM, layout, and painting work.
// - Stable keys allow React to preserve item identity during reconciliation.
// - Dynamic lists should generally use stable item identifiers rather than array indexes.
// - Unstable keys can cause rows to be discarded and remounted instead of reused.
// - React.memo can allow unchanged row components to bail out when their props remain equivalent.
// - Primitive props are straightforward to compare because they use value-based equality.
// - Newly created object and function props can prevent memoized rows from bailing out.
// - Preserving object identity can make row-level memoization more effective.
// - useMemo can stabilize expensive derived data or derived references when dependencies are unchanged.
// - useCallback can stabilize callback references passed to memoized rows.
// - Immutable updates can preserve references for unchanged rows.
// - Expensive work inside every row is multiplied by the number of rendered items.
// - Preparing shared derived data once can reduce repeated per-row computation.
// - Memoization is not automatically beneficial for small or inexpensive lists.
// - When a list contains thousands of rendered DOM nodes, reducing the number of mounted rows can
//   matter more than optimizing individual row renders.
// - List virtualization is a separate strategy that reduces the number of rows rendered at once.
// - Performance decisions should be based on measured rendering and computation costs using realistic workloads.
