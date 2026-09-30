/**
 * Virtualized Lists
 * ==================
 *
 * Virtualization is a rendering technique that keeps only a small portion of a large list mounted
 * while the user scrolls through it. Instead of rendering every item in the dataset, a virtualized
 * list calculates which rows are near the viewport and renders only those rows.
 */

import { useMemo, useState, type CSSProperties, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Rendering every item can create many DOM nodes
// ---------------------------------------------------------------------

interface ListItem {
  readonly id: number;
  readonly name: string;
}

const items: readonly ListItem[] = Array.from({ length: 10_000 }, (_, index) => ({
  id: index + 1,
  name: `Item ${index + 1}`,
}));

const FullList: FC = (): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// This renders all 10,000 rows into the React tree and DOM.
// Even simple rows can become expensive when the number of mounted elements becomes very large.

// ---------------------------------------------------------------------
// 2. Virtualization renders only the visible portion
// ---------------------------------------------------------------------

const VirtualizationConcept: FC = (): ReactElement => {
  return (
    <section>
      <h2>Virtualized rendering</h2>
      <p>Only rows near the current viewport need to be mounted.</p>
    </section>
  );
};

// The complete dataset can remain available in JavaScript while only a small subset is rendered.
// The user still experiences the list as if every item were present.

// ---------------------------------------------------------------------
// 3. Fixed row heights make virtualization easier
// ---------------------------------------------------------------------

const ROW_HEIGHT = 40;
const VIEWPORT_HEIGHT = 400;

const FixedHeightExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Row height: {ROW_HEIGHT}px</p>
      <p>Viewport height: {VIEWPORT_HEIGHT}px</p>
    </section>
  );
};

// With a fixed row height, the position of any item can be calculated directly:
// itemPosition = itemIndex × rowHeight.
// This makes determining the visible range inexpensive.

// ---------------------------------------------------------------------
// 4. Calculate the visible range from scroll position
// ---------------------------------------------------------------------

interface VisibleRange {
  readonly startIndex: number;
  readonly endIndex: number;
}

const getVisibleRange = (
  scrollTop: number,
  viewportHeight: number,
  rowHeight: number,
  itemCount: number,
  overscan: number,
): VisibleRange => {
  const firstVisibleIndex = Math.floor(scrollTop / rowHeight);
  const visibleRowCount = Math.ceil(viewportHeight / rowHeight);

  const startIndex = Math.max(0, firstVisibleIndex - overscan);
  const endIndex = Math.min(itemCount - 1, firstVisibleIndex + visibleRowCount + overscan - 1);

  return {
    startIndex,
    endIndex,
  };
};

// The first visible index comes from the current scroll offset.
// Overscan adds extra rows before and after the viewport so that small scroll movements
// do not immediately require a completely different rendered range.

// ---------------------------------------------------------------------
// 5. Render only the calculated range
// ---------------------------------------------------------------------

const BasicVirtualizedList: FC = (): ReactElement => {
  const [scrollTop, setScrollTop] = useState(0);

  const { startIndex, endIndex } = getVisibleRange(scrollTop, VIEWPORT_HEIGHT, ROW_HEIGHT, items.length, 3);

  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      style={{
        height: VIEWPORT_HEIGHT,
        overflowY: "auto",
      }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div
        style={{
          height: items.length * ROW_HEIGHT,
          position: "relative",
        }}
      >
        {visibleItems.map((item, offset) => {
          const index = startIndex + offset;

          return (
            <div
              key={item.id}
              style={{
                height: ROW_HEIGHT,
                position: "absolute",
                top: index * ROW_HEIGHT,
                left: 0,
                right: 0,
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// The outer container provides the scrollable viewport.
// The inner element provides the total scrollable height.
// Only visibleItems are actually mounted, and each row is positioned at its logical location.

// ---------------------------------------------------------------------
// 6. The spacer represents unrendered content
// ---------------------------------------------------------------------

const SpacerExample: FC = (): ReactElement => {
  const totalHeight = items.length * ROW_HEIGHT;

  return (
    <div
      style={{
        height: VIEWPORT_HEIGHT,
        overflowY: "auto",
      }}
    >
      <div style={{ height: totalHeight }}>
        <p>Only a small range of rows needs to be mounted here.</p>
      </div>
    </div>
  );
};

// The large inner height creates the scrollbar range for the entire dataset.
// It does not require all corresponding rows to exist as DOM nodes.

// ---------------------------------------------------------------------
// 7. Position rendered rows according to their original indexes
// ---------------------------------------------------------------------

interface VirtualRowProps {
  readonly item: ListItem;
  readonly index: number;
  readonly rowHeight: number;
}

const VirtualRow: FC<VirtualRowProps> = ({ item, index, rowHeight }): ReactElement => {
  const style: CSSProperties = {
    height: rowHeight,
    position: "absolute",
    top: index * rowHeight,
    left: 0,
    right: 0,
  };

  return <div style={style}>{item.name}</div>;
};

// The rendered subset must preserve each item's logical position.
// Otherwise, scrolling would cause rows to appear at incorrect locations.

// ---------------------------------------------------------------------
// 8. Overscan renders a small buffer around the viewport
// ---------------------------------------------------------------------

const OverscanExample: FC = (): ReactElement => {
  const overscan = 5;

  const range = getVisibleRange(800, VIEWPORT_HEIGHT, ROW_HEIGHT, items.length, overscan);

  return (
    <p>
      Rendering indexes {range.startIndex} through {range.endIndex}.
    </p>
  );
};

// Overscan trades a few additional mounted rows for smoother scrolling.
// Too little overscan can expose rendering gaps during fast scrolling.
// Too much overscan reduces the benefit of virtualization.

// ---------------------------------------------------------------------
// 9. Virtualization dramatically reduces mounted rows
// ---------------------------------------------------------------------

const MountedRowCountExample: FC = (): ReactElement => {
  const visibleRowCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT);
  const overscan = 5;
  const approximateMountedRows = visibleRowCount + overscan * 2;

  return (
    <section>
      <p>Total items: {items.length}</p>
      <p>Visible rows: {visibleRowCount}</p>
      <p>Approximate rows with overscan: {approximateMountedRows}</p>
    </section>
  );
};

// A 10,000-item dataset does not need 10,000 mounted row elements.
// The mounted row count can remain close to the viewport size plus the overscan buffer.

// ---------------------------------------------------------------------
// 10. Virtualization changes mounting behavior
// ---------------------------------------------------------------------

const StatefulRow: FC<{ readonly item: ListItem }> = ({ item }): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <button type="button" onClick={() => setExpanded((value) => !value)}>
      {item.name} — {expanded ? "Expanded" : "Collapsed"}
    </button>
  );
};

// A virtualized list can unmount rows that leave the rendered range.
// Local component state therefore cannot be assumed to remain mounted indefinitely
// while an item is outside the virtualized window.

// ---------------------------------------------------------------------
// 11. Preserve important item state outside virtualized rows
// ---------------------------------------------------------------------

interface StatefulItem {
  readonly id: number;
  readonly name: string;
  readonly expanded: boolean;
}

const statefulItems: readonly StatefulItem[] = items.map((item) => ({
  ...item,
  expanded: false,
}));

const StatefulVirtualizationExample: FC = (): ReactElement => {
  const [list, setList] = useState(statefulItems);

  const toggleItem = (id: number): void => {
    setList((current) => current.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item)));
  };

  return (
    <section>
      <p>State can be stored with the data rather than only in a mounted row.</p>
      <button type="button" onClick={() => toggleItem(1)}>
        Toggle item 1
      </button>
    </section>
  );
};

// State that must survive virtualization should generally have an owner that remains mounted.
// The exact state architecture depends on the application's requirements.

// ---------------------------------------------------------------------
// 12. Keys still matter in virtualized lists
// ---------------------------------------------------------------------

const KeyedVirtualRows: FC = (): ReactElement => {
  const visibleItems = items.slice(100, 120);

  return (
    <div>
      {visibleItems.map((item) => (
        <VirtualRow key={item.id} item={item} index={items.indexOf(item)} rowHeight={ROW_HEIGHT} />
      ))}
    </div>
  );
};

// Virtualization does not remove the need for stable keys.
// The key should represent the logical identity of the item rather than its temporary position
// inside the currently rendered slice.

// ---------------------------------------------------------------------
// 13. Avoid using the visible-array index as item identity
// ---------------------------------------------------------------------

const VisibleIndexExample: FC = (): ReactElement => {
  const visibleItems = items.slice(100, 120);

  return (
    <div>
      {visibleItems.map((item, visibleIndex) => (
        <VirtualRow key={item.id} item={item} index={100 + visibleIndex} rowHeight={ROW_HEIGHT} />
      ))}
    </div>
  );
};

// The visible array starts at index zero even when the logical list starts at index 100.
// The logical index is used for positioning, while the stable item ID is used as the key.

// ---------------------------------------------------------------------
// 14. Variable-height rows are more difficult
// ---------------------------------------------------------------------

interface VariableItem {
  readonly id: number;
  readonly name: string;
  readonly description: string;
}

const variableItems: readonly VariableItem[] = [
  {
    id: 1,
    name: "Item 1",
    description: "A short description.",
  },
  {
    id: 2,
    name: "Item 2",
    description: "A longer description that may require additional vertical space.",
  },
];

// With variable heights, item position cannot be calculated with a simple index × rowHeight formula.
// The virtualization system needs additional information about row measurements and offsets.

// ---------------------------------------------------------------------
// 15. Variable-height virtualization needs measurements
// ---------------------------------------------------------------------

interface MeasuredItem extends VariableItem {
  readonly height: number;
}

const measuredItems: readonly MeasuredItem[] = variableItems.map((item) => ({
  ...item,
  height: 60,
}));

const getOffset = (index: number, measured: readonly MeasuredItem[]): number => {
  return measured.slice(0, index).reduce((total, item) => total + item.height, 0);
};

// A variable-height implementation can maintain measurements for rows.
// More sophisticated implementations avoid repeatedly summing every preceding row
// and maintain efficient offset calculations as measurements change.

// ---------------------------------------------------------------------
// 16. Virtualization can reduce browser work
// ---------------------------------------------------------------------

const BrowserWorkExample: FC = (): ReactElement => {
  return (
    <section>
      <p>
        Fewer mounted rows can reduce DOM size and the amount of layout, style calculation, and painting work associated
        with the list.
      </p>
    </section>
  );
};

// Virtualization primarily reduces the amount of UI that exists at one time.
// This can affect browser work in addition to reducing React rendering and reconciliation work.

// ---------------------------------------------------------------------
// 17. Virtualization does not make data processing free
// ---------------------------------------------------------------------

const ProcessedVirtualList: FC = (): ReactElement => {
  const processedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      normalizedName: item.name.toLowerCase(),
    }));
  }, []);

  return <p>Prepared {processedItems.length} items while rendering only a subset.</p>;
};

// Virtualization limits rendered rows, not necessarily data-processing work.
// If the application transforms the entire dataset on every update, that transformation
// can remain expensive even when only a small number of rows are mounted.

// ---------------------------------------------------------------------
// 18. Filter before virtualizing
// ---------------------------------------------------------------------

const FilteredVirtualList: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery === "") {
      return items;
    }

    return items.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search items" />

      <p>{filteredItems.length} matching items</p>
    </section>
  );
};

// Filtering can reduce the dataset before virtualization determines which rows to render.
// The filtering operation itself still scans the source collection, so its cost should be considered separately.

// ---------------------------------------------------------------------
// 19. Virtualization and pagination solve different problems
// ---------------------------------------------------------------------

const PaginationExample: FC = (): ReactElement => {
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const pageItems = items.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <section>
      <button type="button" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>
        Previous
      </button>

      <button
        type="button"
        disabled={(page + 1) * pageSize >= items.length}
        onClick={() => setPage((value) => value + 1)}
      >
        Next
      </button>

      <p>{pageItems.length} items on this page</p>
    </section>
  );
};

// Pagination changes which subset of data is displayed.
// Virtualization keeps the list scrollable as one logical collection while changing which rows are mounted.
// They can also be combined when individual pages are themselves large.

// ---------------------------------------------------------------------
// 20. Virtualization and memoization solve different problems
// ---------------------------------------------------------------------

const MemoizedVirtualRow: FC<VirtualRowProps> = ({ item, index, rowHeight }): ReactElement => {
  return <VirtualRow item={item} index={index} rowHeight={rowHeight} />;
};

// React.memo can reduce repeated rendering of mounted rows when their props are unchanged.
// Virtualization reduces how many rows are mounted in the first place.
// One technique does not replace the other.

// ---------------------------------------------------------------------
// 21. Avoid over-virtualizing small lists
// ---------------------------------------------------------------------

const SmallList: FC = (): ReactElement => {
  const smallItems = items.slice(0, 20);

  return (
    <ul>
      {smallItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

// Virtualization introduces additional scrolling, positioning, measurement, and state-management logic.
// A small list may be simpler and sufficiently fast when rendered normally.

// ---------------------------------------------------------------------
// 22. Scroll position determines the rendered window
// ---------------------------------------------------------------------

const ScrollWindowExample: FC = (): ReactElement => {
  const [scrollTop, setScrollTop] = useState(0);

  const range = getVisibleRange(scrollTop, VIEWPORT_HEIGHT, ROW_HEIGHT, items.length, 5);

  return (
    <section>
      <p>Scroll position: {scrollTop}px</p>
      <p>
        Rendered range: {range.startIndex}–{range.endIndex}
      </p>
    </section>
  );
};

// As the user scrolls, the virtualization window moves through the dataset.
// The application updates the rendered range rather than mounting the complete collection.

// ---------------------------------------------------------------------
// 23. A fixed-height virtualized list
// ---------------------------------------------------------------------

interface VirtualListProps {
  readonly items: readonly ListItem[];
  readonly height: number;
  readonly rowHeight: number;
  readonly overscan: number;
}

const VirtualList: FC<VirtualListProps> = ({ items: listItems, height, rowHeight, overscan }): ReactElement => {
  const [scrollTop, setScrollTop] = useState(0);

  const range = useMemo(() => {
    return getVisibleRange(scrollTop, height, rowHeight, listItems.length, overscan);
  }, [scrollTop, height, rowHeight, listItems.length, overscan]);

  const visibleItems = listItems.slice(range.startIndex, range.endIndex + 1);

  return (
    <div
      style={{
        height,
        overflowY: "auto",
        position: "relative",
      }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div
        style={{
          height: listItems.length * rowHeight,
          position: "relative",
        }}
      >
        {visibleItems.map((item, offset) => {
          const index = range.startIndex + offset;

          return <VirtualRow key={item.id} item={item} index={index} rowHeight={rowHeight} />;
        })}
      </div>
    </div>
  );
};

// This implementation assumes every row has the same fixed height.
// The outer element provides the viewport, while the inner element preserves the full scroll range.
// Only rows inside the calculated window plus overscan are mounted.

// ---------------------------------------------------------------------
// 24. Virtualized list with selection
// ---------------------------------------------------------------------

interface SelectableVirtualRowProps {
  readonly item: ListItem;
  readonly selected: boolean;
  readonly onSelect: (id: number) => void;
}

const SelectableVirtualRow: FC<SelectableVirtualRowProps> = ({ item, selected, onSelect }): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-pressed={selected}
      style={{
        display: "block",
        height: ROW_HEIGHT,
        width: "100%",
        textAlign: "left",
      }}
    >
      {item.name} {selected ? "(selected)" : ""}
    </button>
  );
};

// Selection state can remain in the parent so it survives when a row leaves the virtualized window.
// A row can reconstruct its visual state from the current item ID when it mounts again.

// ---------------------------------------------------------------------
// 25. Integrated example
// ---------------------------------------------------------------------

const demoItems: readonly ListItem[] = Array.from({ length: 20_000 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
}));

const VirtualizedListsDemo: FC = (): ReactElement => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number): void => {
    setSelectedId(id);
  };

  return (
    <main>
      <h1>Virtualized Lists</h1>

      <p>Selected: {selectedId === null ? "None" : (demoItems[selectedId - 1]?.name ?? "Unknown")}</p>

      <VirtualList items={demoItems} height={400} rowHeight={40} overscan={5} />
    </main>
  );
};

export default VirtualizedListsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Virtualization renders only a small range of rows near the current viewport.
// - The complete dataset can remain available without requiring every item to be mounted in the DOM.
// - Fixed row heights make visible-range and row-position calculations straightforward.
// - The scroll position determines which indexes should be rendered.
// - Overscan renders a small buffer around the viewport to reduce visible gaps during scrolling.
// - The inner spacer preserves the total scrollable height without rendering every row.
// - Each rendered row must be positioned according to its logical index in the complete list.
// - Stable item keys remain important in virtualized lists.
// - Virtualization can unmount rows that leave the rendered window, so local row state may not remain mounted.
// - State that must survive row unmounting should be owned outside the virtualized row or otherwise persisted.
// - Variable-height rows require additional measurement and offset management.
// - Virtualization can reduce React work and browser work by keeping fewer DOM nodes mounted.
// - Virtualization does not automatically reduce data-processing work performed over the entire dataset.
// - Filtering and sorting can still be expensive even when only a small number of rows are rendered.
// - Pagination and virtualization reduce rendered data in different ways and can be combined.
// - React.memo reduces repeated work for mounted rows, while virtualization reduces the number of mounted rows.
// - Virtualization introduces implementation complexity and is not automatically appropriate for small lists.
// - A practical virtualization strategy should account for row height, overscan, item identity, scrolling,
//   state ownership, and the cost of preparing the underlying data.
// - Performance should be measured with realistic data sizes and representative scrolling interactions.
