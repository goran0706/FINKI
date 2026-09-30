/**
 * Keys and Identity
 * =================
 *
 * A React key gives an element a stable identity among its siblings. During
 * reconciliation, React uses the key together with the element type to match
 * a newly rendered element with an existing component instance. When the key
 * remains stable, React can preserve that instance and its state even when its
 * position in an array changes.
 *
 * Changing a key changes the element's identity. React treats the newly keyed
 * element as a different instance, so the previous instance is removed and a
 * new one is mounted. This can intentionally reset local state and recreate
 * the associated DOM subtree.
 *
 * Keys are especially important for dynamic lists. A stable identifier from
 * the underlying data should normally be used instead of an array index.
 * Index keys can associate preserved component state with a different logical
 * item after insertion, removal, filtering, or reordering.
 *
 * Keys are only used by React for reconciliation and are not passed to the
 * component as a normal prop. If application code needs an item's identifier,
 * that identifier should be provided through an explicit prop.
 */

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface KeyedItem {
  readonly id: string;
  readonly label: string;
}

export interface StableKeyListProps {
  readonly items: readonly KeyedItem[];
}

export interface KeyResetExampleProps {
  readonly initialVersion: number;
}

export interface IndexKeyExampleProps {
  readonly initialItems: readonly KeyedItem[];
}

export interface ExplicitIdProps {
  readonly id: string;
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const StableKeyList: FC<StableKeyListProps> = ({ items }): ReactElement => {
  const [reversed, setReversed] = useState<boolean>(false);

  const toggleOrder = (): void => {
    setReversed((previousReversed: boolean): boolean => !previousReversed);
  };

  const displayedItems: readonly KeyedItem[] = reversed ? [...items].reverse() : items;

  return (
    <section>
      <ul>
        {displayedItems.map((item: KeyedItem): ReactElement => (
          <li key={item.id}>
            <input defaultValue={item.label} />
          </li>
        ))}
      </ul>

      <button type="button" onClick={toggleOrder}>
        Reverse items
      </button>
    </section>
  );
};

export const KeyResetExample: FC<KeyResetExampleProps> = ({ initialVersion }): ReactElement => {
  const [version, setVersion] = useState<number>(initialVersion);

  const changeKey = (): void => {
    setVersion((previousVersion: number): number => previousVersion + 1);
  };

  return (
    <section>
      <KeyedStateInput key={version} />

      <button type="button" onClick={changeKey}>
        Change key and reset input
      </button>
    </section>
  );
};

const KeyedStateInput: FC = (): ReactElement => {
  const [value, setValue] = useState<string>("John Doe");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <label>
      Value
      <input value={value} onChange={handleChange} />
    </label>
  );
};

export const IndexKeyExample: FC<IndexKeyExampleProps> = ({ initialItems }): ReactElement => {
  const [items, setItems] = useState<readonly KeyedItem[]>(initialItems);

  const insertAtFront = (): void => {
    setItems((previousItems: readonly KeyedItem[]): readonly KeyedItem[] => [
      { id: "new-item", label: "New item" },
      ...previousItems,
    ]);
  };

  return (
    <section>
      <ul>
        {items.map((item: KeyedItem, index: number): ReactElement => (
          <li key={index}>
            <input defaultValue={item.label} />
          </li>
        ))}
      </ul>

      <button type="button" onClick={insertAtFront}>
        Insert item at front
      </button>
    </section>
  );
};

export const ExplicitId: FC<ExplicitIdProps> = ({ id, label }): ReactElement => {
  return (
    <article>
      <p>React identity key data is represented separately.</p>
      <p>
        Application ID: {id}; label: {label}
      </p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const KeysAndIdentityExamples: FC = (): ReactElement => {
  const items: readonly KeyedItem[] = [
    { id: "item-a", label: "First item" },
    { id: "item-b", label: "Second item" },
    { id: "item-c", label: "Third item" },
  ];

  return (
    <main>
      <h2>1. Stable keys preserve list item identity</h2>
      <StableKeyList items={items} />

      <h2>2. Changing a key creates a new component identity</h2>
      <KeyResetExample initialVersion={0} />

      <h2>3. Index keys can mismatch state with logical items</h2>
      <IndexKeyExample initialItems={items} />

      <h2>4. Application identifiers must be explicit props</h2>
      <ExplicitId id="item-a" label="First item" />
    </main>
  );
};

export default KeysAndIdentityExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A key gives an element stable identity among its siblings.
// - React uses key and element type when matching elements during
//   reconciliation.
// - Stable keys allow component instances and their state to survive list
//   reordering.
// - Changing a key intentionally creates a new component identity and can
//   reset its local state.
// - Stable data identifiers are preferable to array indexes for dynamic lists.
// - Index keys can associate preserved state with a different logical item
//   after insertion, deletion, filtering, or reordering.
// - Keys are used by React for reconciliation and are not component props.
// - Application code should receive identifiers through explicit props when
//   those identifiers are needed by the component.
