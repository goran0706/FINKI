/**
 * Reconciliation
 * ==============
 *
 * Reconciliation is React's process of comparing the element tree produced by
 * a new render with the previously rendered tree and determining what should
 * be preserved, updated, inserted, or removed. React uses element types and
 * keys as important identity signals when matching corresponding elements.
 *
 * When corresponding elements have compatible identity, React can preserve
 * the associated component instance and DOM node while updating its props.
 * When identity changes, React may remove the previous subtree and create a
 * new one. For host elements, the element type is significant: changing an
 * `input` to a `textarea`, for example, changes the host element being
 * represented.
 *
 * Keys provide stable identity among siblings. They are especially important
 * for dynamic lists because inserting, removing, or reordering items can
 * otherwise cause React to match elements by position. A stable key should
 * represent the logical identity of the item rather than its current array
 * index.
 *
 * Reconciliation does not mean React compares every arbitrary JavaScript
 * object property recursively. React works with the element structure produced
 * by rendering and uses element type, key, and props to determine the required
 * update work. A component can re-render while React still preserves its
 * existing DOM node.
 */

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ElementTypeIdentityProps {
  readonly showInput: boolean;
}

export interface StableKeyItem {
  readonly id: string;
  readonly label: string;
}

export interface KeyedListProps {
  readonly initialItems: readonly StableKeyItem[];
}

export interface IndexKeyListProps {
  readonly initialItems: readonly StableKeyItem[];
}

export interface PreservedDomProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ElementTypeIdentity: FC<ElementTypeIdentityProps> = ({ showInput }): ReactElement => {
  const [inputVisible, setInputVisible] = useState<boolean>(showInput);

  const toggleElement = (): void => {
    setInputVisible((previousVisible: boolean): boolean => !previousVisible);
  };

  return (
    <section>
      {inputVisible ? <input defaultValue="John Doe" /> : <textarea defaultValue="John Doe" />}

      <button type="button" onClick={toggleElement}>
        Change element type
      </button>
    </section>
  );
};

export const KeyedList: FC<KeyedListProps> = ({ initialItems }): ReactElement => {
  const [items, setItems] = useState<readonly StableKeyItem[]>(initialItems);

  const reverseItems = (): void => {
    setItems((previousItems: readonly StableKeyItem[]): readonly StableKeyItem[] => [...previousItems].reverse());
  };

  return (
    <section>
      <ul>
        {items.map((item: StableKeyItem): ReactElement => (
          <li key={item.id}>
            <input defaultValue={item.label} />
          </li>
        ))}
      </ul>

      <button type="button" onClick={reverseItems}>
        Reverse keyed items
      </button>
    </section>
  );
};

export const IndexKeyList: FC<IndexKeyListProps> = ({ initialItems }): ReactElement => {
  const [items, setItems] = useState<readonly StableKeyItem[]>(initialItems);

  const addItemToFront = (): void => {
    setItems((previousItems: readonly StableKeyItem[]): readonly StableKeyItem[] => [
      { id: "new-item", label: "New item" },
      ...previousItems,
    ]);
  };

  return (
    <section>
      <ul>
        {items.map((item: StableKeyItem, index: number): ReactElement => (
          <li key={index}>
            <input defaultValue={item.label} />
          </li>
        ))}
      </ul>

      <button type="button" onClick={addItemToFront}>
        Insert item at front
      </button>
    </section>
  );
};

export const PreservedDom: FC<PreservedDomProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);

  const updateValue = (): void => {
    setValue((previousValue: string): string => `${previousValue}!`);
  };

  return (
    <section>
      <input
        value={value}
        onChange={(event): void => {
          setValue(event.target.value);
        }}
      />

      <button type="button" onClick={updateValue}>
        Update value
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReconciliationExamples: FC = (): ReactElement => {
  const items: readonly StableKeyItem[] = [
    { id: "item-a", label: "First item" },
    { id: "item-b", label: "Second item" },
    { id: "item-c", label: "Third item" },
  ];

  return (
    <main>
      <h2>1. Changing an element type changes its host identity</h2>
      <ElementTypeIdentity showInput={true} />

      <h2>2. Stable keys preserve identity when list order changes</h2>
      <KeyedList initialItems={items} />

      <h2>3. Index keys can mismatch identity after insertion</h2>
      <IndexKeyList initialItems={items} />

      <h2>4. Reconciliation can update a DOM node instead of recreating it</h2>
      <PreservedDom initialValue="John Doe" />
    </main>
  );
};

export default ReconciliationExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Reconciliation compares the element tree from a new render with the
//   previously rendered tree to determine the required update work.
// - Element type is an important part of identity during reconciliation.
// - Stable keys identify logical list items among their siblings.
// - Stable keys are important when list items can be inserted, removed, or
//   reordered.
// - Array indexes are fragile keys when the order or membership of a list can
//   change because position does not represent stable item identity.
// - Reconciliation can preserve an existing DOM node while updating its props
//   or other rendered properties.
// - A component re-render does not automatically mean that every DOM node in
//   its output is recreated.
// - Keys are identity information for reconciliation; they are not ordinary
//   component props and should not be used as application data.
