/**
 * Refs in Lists
 * =============
 *
 * Refs used with lists must account for the fact that a component can render
 * any number of elements from a collection. A single object ref cannot provide
 * independent access to every rendered item. Callback refs are commonly used
 * to collect individual DOM nodes into a `Map`, with each stable item identity
 * acting as the key.
 *
 * A callback ref receives the element when React attaches it and `null` when
 * React detaches it. The callback can therefore add the element to a mutable
 * collection and remove it during cleanup. A `Map` stored in `useRef` is useful
 * because its identity remains stable across renders and changing its contents
 * does not itself schedule a render.
 *
 * List keys and ref-map keys solve different problems. React keys identify
 * component instances during reconciliation, while application-level keys in
 * a ref map identify the DOM nodes that the application wants to access.
 * Using the same stable item identifier for both often keeps the two mappings
 * aligned, but a React `key` is not available through component props.
 *
 * Index-based refs can become associated with the wrong item when a list is
 * reordered, inserted into, or filtered. Stable item identifiers avoid that
 * positional mismatch. Callback refs should therefore be keyed by stable
 * identity whenever the list can change.
 */

import { type FC, type RefCallback, useCallback, useRef } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ListItem {
  readonly id: string;
  readonly label: string;
}

export interface FocusableListProps {
  readonly items: readonly ListItem[];
}

export interface MeasuredListProps {
  readonly items: readonly ListItem[];
}

export interface DynamicListProps {
  readonly items: readonly ListItem[];
}

export interface PositionalRefListProps {
  readonly items: readonly ListItem[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FocusableList: FC<FocusableListProps> = ({ items }): JSX.Element => {
  const itemNodesRef = useRef<Map<string, HTMLLIElement>>(new Map<string, HTMLLIElement>());

  const createItemRef = useCallback(
    (id: string): RefCallback<HTMLLIElement> =>
      (element: HTMLLIElement | null): void => {
        if (element === null) {
          itemNodesRef.current.delete(id);
          return;
        }

        itemNodesRef.current.set(id, element);
      },
    [],
  );

  const focusFirstItem = (): void => {
    const firstItem: ListItem | undefined = items[0];

    if (firstItem === undefined) {
      return;
    }

    itemNodesRef.current.get(firstItem.id)?.focus();
  };

  return (
    <div>
      <ul>
        {items.map((item: ListItem): JSX.Element => (
          <li key={item.id} ref={createItemRef(item.id)} tabIndex={-1}>
            {item.label}
          </li>
        ))}
      </ul>

      <button type="button" onClick={focusFirstItem}>
        Focus first item
      </button>
    </div>
  );
};

export const MeasuredList: FC<MeasuredListProps> = ({ items }): JSX.Element => {
  const itemNodesRef = useRef<Map<string, HTMLLIElement>>(new Map<string, HTMLLIElement>());

  const createItemRef = useCallback(
    (id: string): RefCallback<HTMLLIElement> =>
      (element: HTMLLIElement | null): void => {
        if (element === null) {
          itemNodesRef.current.delete(id);
          return;
        }

        itemNodesRef.current.set(id, element);
      },
    [],
  );

  const logItemHeight = (id: string): void => {
    const element: HTMLLIElement | undefined = itemNodesRef.current.get(id);

    if (element === undefined) {
      return;
    }

    const height: number = element.getBoundingClientRect().height;
    window.alert(`${id}: ${height}px`);
  };

  return (
    <ul>
      {items.map((item: ListItem): JSX.Element => (
        <li key={item.id} ref={createItemRef(item.id)}>
          <span>{item.label}</span>
          <button type="button" onClick={(): void => logItemHeight(item.id)}>
            Measure
          </button>
        </li>
      ))}
    </ul>
  );
};

export const DynamicList: FC<DynamicListProps> = ({ items }): JSX.Element => {
  const itemNodesRef = useRef<Map<string, HTMLLIElement>>(new Map<string, HTMLLIElement>());

  const createItemRef = useCallback(
    (id: string): RefCallback<HTMLLIElement> =>
      (element: HTMLLIElement | null): void => {
        if (element === null) {
          itemNodesRef.current.delete(id);
          return;
        }

        itemNodesRef.current.set(id, element);
      },
    [],
  );

  const scrollToItem = (id: string): void => {
    itemNodesRef.current.get(id)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  return (
    <div>
      <div>
        {items.map((item: ListItem): JSX.Element => (
          <button key={item.id} type="button" onClick={(): void => scrollToItem(item.id)}>
            Go to {item.label}
          </button>
        ))}
      </div>

      <ul>
        {items.map((item: ListItem): JSX.Element => (
          <li key={item.id} ref={createItemRef(item.id)}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const PositionalRefList: FC<PositionalRefListProps> = ({ items }): JSX.Element => {
  const itemNodesRef = useRef<Array<HTMLLIElement | null>>([]);

  const createItemRef = useCallback(
    (index: number): RefCallback<HTMLLIElement> =>
      (element: HTMLLIElement | null): void => {
        itemNodesRef.current[index] = element;
      },
    [],
  );

  const focusItemAtIndex = (index: number): void => {
    itemNodesRef.current[index]?.focus();
  };

  return (
    <div>
      <ul>
        {items.map((item: ListItem, index: number): JSX.Element => (
          <li key={item.id} ref={createItemRef(index)} tabIndex={-1}>
            {item.label}
          </li>
        ))}
      </ul>

      <button type="button" onClick={(): void => focusItemAtIndex(0)}>
        Focus item at index 0
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RefsInListsExamples: FC = (): JSX.Element => {
  const items: readonly ListItem[] = [
    { id: "item-1", label: "First item" },
    { id: "item-2", label: "Second item" },
    { id: "item-3", label: "Third item" },
  ];

  return (
    <main>
      <h2>1. Collecting list item nodes by stable identity</h2>
      <FocusableList items={items} />

      <h2>2. Reading measurements from individual list nodes</h2>
      <MeasuredList items={items} />

      <h2>3. Accessing dynamic list items by identifier</h2>
      <DynamicList items={items} />

      <h2>4. Using positional refs when the list is fixed</h2>
      <PositionalRefList items={items} />
    </main>
  );
};

export default RefsInListsExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A single ref cannot independently identify every DOM node in a list.
// - Callback refs can collect individual nodes into a `Map`.
// - A ref-held `Map` can be mutated without scheduling component renders.
// - Callback refs should remove detached elements from the collection.
// - Stable item identifiers are preferable to array indexes when list items
//   can be inserted, removed, filtered, or reordered.
// - React `key` values identify list elements for reconciliation, while the
//   ref map's keys identify nodes for application-level lookup.
// - A positional ref array can be appropriate for a fixed, non-reordered list.
// - Positional refs can become associated with different logical items when
//   the list changes, so stable identifiers are safer for dynamic collections.
