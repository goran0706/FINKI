/**
 * Large Lists
 * ============
 *
 * Large lists can become expensive when many items are rendered, reconciled, measured, and painted.
 * Performance depends on the amount of data, the complexity of each row, the frequency of updates,
 * and how many DOM nodes are kept mounted at the same time.
 */

import { memo, useCallback, useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. A large list contains many rendered items
// ---------------------------------------------------------------------

interface ListItem {
  readonly id: number;
  readonly name: string;
}

const largeItems: readonly ListItem[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
}));

const LargeList: FC = (): ReactElement => {
  return (
    <ul>
      {largeItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// Every rendered item contributes React elements and DOM nodes.
// A list with 1,000 items is different from a list with 20 items because substantially more work
// may be required during rendering, reconciliation, layout, and painting.

// ---------------------------------------------------------------------
// 2. List size alone does not determine performance
// ---------------------------------------------------------------------

const SimpleRow: FC<{ readonly item: ListItem }> = ({ item }): ReactElement => {
  return <li>{item.name}</li>;
};

const ComplexRow: FC<{ readonly item: ListItem }> = ({ item }): ReactElement => {
  return (
    <li>
      <article>
        <header>
          <strong>{item.name}</strong>
        </header>
        <p>Description for {item.name}</p>
        <small>Additional information</small>
      </article>
    </li>
  );
};

// Two lists with the same number of items can have very different costs.
// Row complexity, descendant count, calculations, effects, and browser rendering work all matter.

// ---------------------------------------------------------------------
// 3. Rendering every item keeps every DOM node mounted
// ---------------------------------------------------------------------

const MountedRowsExample: FC = (): ReactElement => {
  return (
    <div>
      <ul>
        {largeItems.map((item) => (
          <SimpleRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
};

// All 1,000 rows are represented in the rendered tree.
// Keeping many DOM nodes mounted can increase memory usage and browser rendering work,
// especially when each row contains substantial markup.

// ---------------------------------------------------------------------
// 4. Stable keys preserve row identity
// ---------------------------------------------------------------------

const StableKeyList: FC = (): ReactElement => {
  return (
    <ul>
      {largeItems.map((item) => (
        <SimpleRow key={item.id} item={item} />
      ))}
    </ul>
  );
};

// Stable keys allow React to match items across renders.
// This is especially important for large lists because unnecessary remounting can multiply work.

// ---------------------------------------------------------------------
// 5. Avoid unstable keys
// ---------------------------------------------------------------------

const UnstableKeyList: FC = (): ReactElement => {
  return (
    <ul>
      {largeItems.map((item) => (
        <SimpleRow key={`${item.name}-${Math.random()}`} item={item} />
      ))}
    </ul>
  );
};

// A newly generated key does not represent stable item identity.
// React cannot match the previous row with the new row when its key changes,
// which can cause unnecessary unmounting and mounting.

// ---------------------------------------------------------------------
// 6. Memoize rows when parent updates are frequent
// ---------------------------------------------------------------------

interface RowProps {
  readonly item: ListItem;
}

const MemoizedRow: FC<RowProps> = memo(({ item }): ReactElement => {
  console.log("Rendering row:", item.id);

  return <li>{item.name}</li>;
});

const UpdatingParent: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Count: {count}
      </button>

      <ul>
        {largeItems.map((item) => (
          <MemoizedRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

// A parent update causes React to revisit the list.
// React.memo can allow unchanged rows to skip their component render when their props remain equivalent.
// The list itself and the parent's rendering work still occur.

// ---------------------------------------------------------------------
// 7. Preserve item object references
// ---------------------------------------------------------------------

const StableObjectRows: FC = (): ReactElement => {
  return (
    <ul>
      {largeItems.map((item) => (
        <MemoizedRow key={item.id} item={item} />
      ))}
    </ul>
  );
};

// Reusing the existing item objects preserves their references.
// This allows memoized rows to observe unchanged item props when the parent renders again.

// ---------------------------------------------------------------------
// 8. Avoid recreating every item object
// ---------------------------------------------------------------------

const RecreatedObjectRows: FC = (): ReactElement => {
  return (
    <ul>
      {largeItems.map((item) => (
        <MemoizedRow key={item.id} item={{ id: item.id, name: item.name }} />
      ))}
    </ul>
  );
};

// Each object literal creates a new object.
// Even when the fields contain the same values, the object reference differs,
// so React.memo cannot treat the item prop as unchanged based on reference equality.

// ---------------------------------------------------------------------
// 9. Keep expensive calculations outside individual rows
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

const products: readonly Product[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  price: (index + 1) * 5,
}));

const ProductRow: FC<{ readonly product: Product }> = memo(({ product }): ReactElement => {
  return (
    <li>
      {product.name}: ${product.price}
    </li>
  );
});

const ProductList: FC = (): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </ul>
  );
};

// A simple row keeps the per-item rendering work small.
// When expensive calculations are necessary, consider whether they can be performed once
// for the collection instead of repeatedly inside every row.

// ---------------------------------------------------------------------
// 10. Prepare derived data once when it is reused
// ---------------------------------------------------------------------

interface PreparedProduct extends Product {
  readonly formattedPrice: string;
}

const PreparedProductList: FC = (): ReactElement => {
  const preparedProducts = useMemo<readonly PreparedProduct[]>(() => {
    return products.map((product) => ({
      ...product,
      formattedPrice: `$${product.price.toFixed(2)}`,
    }));
  }, []);

  return (
    <ul>
      {preparedProducts.map((product) => (
        <li key={product.id}>
          {product.name}: {product.formattedPrice}
        </li>
      ))}
    </ul>
  );
};

// Preparing shared derived values once can avoid repeating the same transformation for every render.
// useMemo is useful when the calculation is sufficiently expensive or when stable identity matters.

// ---------------------------------------------------------------------
// 11. Filtering a large list can itself be expensive
// ---------------------------------------------------------------------

const FilterableLargeList: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const filteredItems = largeItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search items" />

      <ul>
        {filteredItems.map((item) => (
          <MemoizedRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

// Filtering scans the collection whenever the component renders.
// With a large dataset, the filtering operation can become a measurable part of the update cost.

// ---------------------------------------------------------------------
// 12. Memoize expensive filtering when unrelated state changes
// ---------------------------------------------------------------------

const MemoizedFilterableList: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery === "") {
      return largeItems;
    }

    return largeItems.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <section>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Unrelated count: {count}
      </button>

      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search items" />

      <ul>
        {filteredItems.map((item) => (
          <MemoizedRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

// The filtering calculation now reruns when query changes rather than when unrelated count changes.
// Memoization should be based on measured work rather than list size alone.

// ---------------------------------------------------------------------
// 13. Callback identity can affect memoized rows
// ---------------------------------------------------------------------

interface SelectableRowProps {
  readonly item: ListItem;
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

const SelectableLargeList: FC = (): ReactElement => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = useCallback((id: number): void => {
    setSelectedId(id);
  }, []);

  return (
    <section>
      <p>Selected: {selectedId ?? "None"}</p>

      <ul>
        {largeItems.map((item) => (
          <SelectableRow key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </ul>
    </section>
  );
};

// A stable callback reference can help memoized rows bail out when their other props are unchanged.
// Without useCallback, a new function could be created whenever the parent renders.

// ---------------------------------------------------------------------
// 14. Avoid unnecessary callback creation when memoization is not needed
// ---------------------------------------------------------------------

const SimpleSelectableList: FC = (): ReactElement => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <section>
      <p>Selected: {selectedId ?? "None"}</p>

      <ul>
        {largeItems.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => setSelectedId(item.id)}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

// useCallback is not automatically beneficial for every large list.
// If rows are inexpensive or are not memoized, the additional memoization machinery may provide no meaningful benefit.

// ---------------------------------------------------------------------
// 15. Update only the item that changed
// ---------------------------------------------------------------------

const editableItems: readonly ListItem[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
}));

const EditableRow: FC<{
  readonly item: ListItem;
  readonly onRename: (id: number, name: string) => void;
}> = memo(({ item, onRename }): ReactElement => {
  return (
    <li>
      <input value={item.name} onChange={(event) => onRename(item.id, event.target.value)} />
    </li>
  );
});

const EditableLargeList: FC = (): ReactElement => {
  const [list, setList] = useState<readonly ListItem[]>(editableItems);

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

// The immutable update creates a new object only for the changed item.
// Existing item objects retain their references, allowing memoized unchanged rows to bail out.

// ---------------------------------------------------------------------
// 16. Avoid filtering or sorting when the input did not change
// ---------------------------------------------------------------------

const SortableLargeList: FC = (): ReactElement => {
  const [ascending, setAscending] = useState(true);
  const [count, setCount] = useState(0);

  const sortedItems = useMemo(() => {
    return [...largeItems].sort((first, second) => (ascending ? first.id - second.id : second.id - first.id));
  }, [ascending]);

  return (
    <section>
      <button type="button" onClick={() => setAscending((value) => !value)}>
        Reverse order
      </button>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Unrelated count: {count}
      </button>

      <ul>
        {sortedItems.map((item) => (
          <MemoizedRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

// Sorting creates a new array and performs work across the collection.
// Memoization can prevent that work when unrelated state changes without changing the sort requirement.

// ---------------------------------------------------------------------
// 17. Reduce the number of elements rendered when appropriate
// ---------------------------------------------------------------------

const CompactRow: FC<{ readonly item: ListItem }> = ({ item }): ReactElement => {
  return <li>{item.name}</li>;
};

const LimitedList: FC = (): ReactElement => {
  const visibleItems = largeItems.slice(0, 50);

  return (
    <ul>
      {visibleItems.map((item) => (
        <CompactRow key={item.id} item={item} />
      ))}
    </ul>
  );
};

// Rendering only a subset of the collection reduces the number of mounted DOM nodes.
// Pagination, filtering, search, and other UI constraints can naturally reduce visible work.

// ---------------------------------------------------------------------
// 18. Pagination limits the rendered subset
// ---------------------------------------------------------------------

const PaginationExample: FC = (): ReactElement => {
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const pageItems = useMemo(() => {
    const start = page * pageSize;
    return largeItems.slice(start, start + pageSize);
  }, [page]);

  return (
    <section>
      <button type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>
        Previous
      </button>

      <button
        type="button"
        disabled={(page + 1) * pageSize >= largeItems.length}
        onClick={() => setPage((value) => value + 1)}
      >
        Next
      </button>

      <ul>
        {pageItems.map((item) => (
          <MemoizedRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

// Pagination keeps only the current page in the rendered list.
// This reduces the number of mounted rows compared with rendering the entire collection.

// ---------------------------------------------------------------------
// 19. Virtualization addresses a different scale problem
// ---------------------------------------------------------------------

const VirtualizationConcept: FC = (): ReactElement => {
  return (
    <section>
      <h2>Virtualized rendering</h2>
      <p>
        A virtualized list renders only the rows needed for the current viewport instead of mounting every row in the
        collection.
      </p>
    </section>
  );
};

// Virtualization is useful when the dataset is too large to keep every row mounted efficiently.
// It requires additional logic for viewport measurement, scrolling, item positioning, and overscan.
// It is a rendering strategy, not simply another memoization technique.

// ---------------------------------------------------------------------
// 20. Avoid confusing data size with rendered size
// ---------------------------------------------------------------------

const LargeDatasetSmallView: FC = (): ReactElement => {
  const dataset = useMemo(
    () =>
      Array.from({ length: 100_000 }, (_, index) => ({
        id: index + 1,
        name: `Item ${index + 1}`,
      })),
    [],
  );

  const visibleItems = dataset.slice(0, 50);

  return (
    <ul>
      {visibleItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// A large in-memory dataset does not necessarily mean that the same number of DOM nodes must be rendered.
// Separating data management from rendering strategy is important when working with very large collections.

// ---------------------------------------------------------------------
// 21. Effects inside every row can multiply work
// ---------------------------------------------------------------------

const EffectFreeRow: FC<{ readonly item: ListItem }> = memo(({ item }): ReactElement => {
  return <li>{item.name}</li>;
});

const EffectFreeLargeList: FC = (): ReactElement => {
  return (
    <ul>
      {largeItems.map((item) => (
        <EffectFreeRow key={item.id} item={item} />
      ))}
    </ul>
  );
};

// An effect in every row creates one effect lifecycle per mounted row.
// Large lists should avoid unnecessary per-row effects and expensive effect work when the same result
// can be derived during rendering or handled at a higher level.

// ---------------------------------------------------------------------
// 22. Browser layout can become part of the cost
// ---------------------------------------------------------------------

const LayoutHeavyRow: FC<{ readonly item: ListItem }> = ({ item }): ReactElement => {
  return (
    <li>
      <div>
        <span>{item.name}</span>
        <span>Additional content</span>
        <span>More content</span>
      </div>
    </li>
  );
};

const LayoutHeavyList: FC = (): ReactElement => {
  return (
    <ul>
      {largeItems.map((item) => (
        <LayoutHeavyRow key={item.id} item={item} />
      ))}
    </ul>
  );
};

// React rendering is only one part of list performance.
// The browser may also spend time on style calculation, layout, painting, and compositing.

// ---------------------------------------------------------------------
// 23. Measure large-list performance
// ---------------------------------------------------------------------

const MeasuredLargeList: FC = (): ReactElement => {
  const start = performance.now();

  const elements = largeItems.map((item) => <li key={item.id}>{item.name}</li>);

  const elapsed = performance.now() - start;

  console.log(`Prepared ${elements.length} list elements in ${elapsed.toFixed(2)} ms`);

  return <ul>{elements}</ul>;
};

// This measurement captures JavaScript work involved in creating the element collection.
// It does not represent the complete browser rendering cost.
// React DevTools Profiler and browser performance tools can help identify the remaining work.

// ---------------------------------------------------------------------
// 24. Measure representative interactions
// ---------------------------------------------------------------------

const MeasuredInteractionList: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const handleChange = (value: string): void => {
    const start = performance.now();

    setQuery(value);

    const elapsed = performance.now() - start;

    console.log(`State update requested in ${elapsed.toFixed(2)} ms`);
  };

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.toLowerCase();

    return largeItems.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <section>
      <input value={query} onChange={(event) => handleChange(event.target.value)} placeholder="Search items" />

      <p>Matches: {filteredItems.length}</p>
    </section>
  );
};

// Timing the setState call itself does not measure the complete time until the UI is committed.
// Interaction performance should be measured with tools that can observe the relevant rendering and browser work.

// ---------------------------------------------------------------------
// 25. Do not optimize a large list by default
// ---------------------------------------------------------------------

const StraightforwardLargeList: FC = (): ReactElement => {
  return (
    <ul>
      {largeItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// A straightforward implementation can be appropriate when the list is small enough in practice
// or when profiling shows that its rendering cost is not a problem.
// Optimization should address an observed bottleneck rather than list size alone.

// ---------------------------------------------------------------------
// 26. Integrated example
// ---------------------------------------------------------------------

interface CatalogItem {
  readonly id: number;
  readonly name: string;
  readonly category: string;
}

const catalogItems: readonly CatalogItem[] = Array.from({ length: 2000 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  category: index % 2 === 0 ? "Input" : "Display",
}));

interface CatalogRowProps {
  readonly item: CatalogItem;
  readonly onSelect: (id: number) => void;
}

const CatalogRow: FC<CatalogRowProps> = memo(({ item, onSelect }): ReactElement => {
  return (
    <li>
      <button type="button" onClick={() => onSelect(item.id)}>
        {item.name} — {item.category}
      </button>
    </li>
  );
});

const LargeListsDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const pageSize = 50;

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery === "") {
      return catalogItems;
    }

    return catalogItems.filter(
      (item) =>
        item.name.toLowerCase().includes(normalizedQuery) || item.category.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const pageCount = Math.ceil(filteredItems.length / pageSize);

  const visibleItems = useMemo(() => {
    const start = page * pageSize;

    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page]);

  const handleSelect = useCallback((id: number): void => {
    setSelectedId(id);
  }, []);

  const handleQueryChange = (value: string): void => {
    setQuery(value);
    setPage(0);
  };

  return (
    <main>
      <h1>Large Lists</h1>

      <input value={query} onChange={(event) => handleQueryChange(event.target.value)} placeholder="Search products" />

      <p>
        Selected:{" "}
        {selectedId === null ? "None" : (catalogItems.find((item) => item.id === selectedId)?.name ?? "Unknown")}
      </p>

      <button type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>
        Previous
      </button>

      <button type="button" disabled={page + 1 >= pageCount} onClick={() => setPage((value) => value + 1)}>
        Next
      </button>

      <p>
        Page {page + 1} of {Math.max(pageCount, 1)}
      </p>

      <ul>
        {visibleItems.map((item) => (
          <CatalogRow key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </ul>
    </main>
  );
};

export default LargeListsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Large lists can increase JavaScript, React, DOM, layout, and painting work.
// - List size is only one performance factor; row complexity and update frequency also matter.
// - Stable keys preserve item identity and help React reconcile dynamic lists efficiently.
// - Unstable keys can cause unnecessary unmounting and mounting of rows.
// - React.memo can reduce row rendering work when unchanged row props remain equivalent.
// - Preserving object references helps memoized rows recognize unchanged items.
// - Newly created object or function props can prevent memoized rows from bailing out.
// - Expensive collection transformations can be moved out of individual rows or memoized when useful.
// - Filtering and sorting a large collection can themselves become measurable sources of work.
// - useMemo can avoid repeating expensive derived-data calculations when dependencies are unchanged.
// - useCallback can preserve callback identity for memoized rows when that identity affects rendering.
// - Immutable updates can preserve references for unchanged rows.
// - Pagination reduces the number of rows mounted at one time.
// - Virtualization reduces the number of rows rendered to those needed around the viewport.
// - A large data collection does not require rendering every item into the DOM.
// - Per-row effects and expensive row logic can multiply work across a large list.
// - Browser layout and painting are separate costs from React rendering.
// - Performance should be measured with realistic data sizes and representative interactions.
// - Memoization and virtualization solve different problems and should not be treated as interchangeable.
// - A straightforward large-list implementation can be appropriate when measurement shows that its cost is acceptable.
