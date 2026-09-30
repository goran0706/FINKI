/**
 * Dynamic Field Arrays
 * ====================
 *
 * Dynamic field arrays represent collections of related form values where each item contains
 * multiple fields and the number of items can change at runtime. Unlike a collection of independent
 * inputs, each array item is a structured object whose fields must be updated without mutating the
 * existing state.
 *
 * Each item should have a stable identity separate from its array position. This identity is used
 * for React keys and for targeted updates or removal. The array index represents the item's current
 * position, while the item's identifier represents the logical item itself.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DynamicFieldArrayItem {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface DynamicFieldArrayBasicProps {
  readonly initialItems: readonly DynamicFieldArrayItem[];
}

export interface DynamicFieldArrayNestedProps {
  readonly initialItems: readonly DynamicFieldArrayItem[];
}

export interface DynamicFieldArrayReorderProps {
  readonly initialItems: readonly DynamicFieldArrayItem[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const DynamicFieldArrayBasic: React.FC<DynamicFieldArrayBasicProps> = ({ initialItems }): React.ReactElement => {
  const [items, setItems] = React.useState<DynamicFieldArrayItem[]>((): DynamicFieldArrayItem[] =>
    initialItems.map((item: DynamicFieldArrayItem): DynamicFieldArrayItem => ({
      ...item,
    })),
  );

  const handleAdd = (): void => {
    setItems((currentItems: DynamicFieldArrayItem[]): DynamicFieldArrayItem[] => {
      const nextId: number =
        currentItems.length === 0
          ? 1
          : Math.max(...currentItems.map((item: DynamicFieldArrayItem): number => item.id)) + 1;

      return [
        ...currentItems,
        {
          id: nextId,
          name: "",
          email: "",
        },
      ];
    });
  };

  const handleNameChange = (id: number, name: string): void => {
    setItems((currentItems: DynamicFieldArrayItem[]): DynamicFieldArrayItem[] =>
      currentItems.map((item: DynamicFieldArrayItem): DynamicFieldArrayItem =>
        item.id === id
          ? {
              ...item,
              name,
            }
          : item,
      ),
    );
  };

  const handleEmailChange = (id: number, email: string): void => {
    setItems((currentItems: DynamicFieldArrayItem[]): DynamicFieldArrayItem[] =>
      currentItems.map((item: DynamicFieldArrayItem): DynamicFieldArrayItem =>
        item.id === id
          ? {
              ...item,
              email,
            }
          : item,
      ),
    );
  };

  return (
    <div>
      {items.map((item: DynamicFieldArrayItem, index: number): React.ReactElement => (
        <fieldset key={item.id}>
          <legend>Person {index + 1}</legend>

          <label>
            Name
            <input
              type="text"
              value={item.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handleNameChange(item.id, event.target.value);
              }}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={item.email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handleEmailChange(item.id, event.target.value);
              }}
            />
          </label>
        </fieldset>
      ))}

      <button type="button" onClick={handleAdd}>
        Add person
      </button>
    </div>
  );
};

export const DynamicFieldArrayNested: React.FC<DynamicFieldArrayNestedProps> = ({
  initialItems,
}): React.ReactElement => {
  const [items, setItems] = React.useState<DynamicFieldArrayItem[]>((): DynamicFieldArrayItem[] =>
    initialItems.map((item: DynamicFieldArrayItem): DynamicFieldArrayItem => ({
      ...item,
    })),
  );

  const handleFieldChange = (id: number, field: "name" | "email", value: string): void => {
    setItems((currentItems: DynamicFieldArrayItem[]): DynamicFieldArrayItem[] =>
      currentItems.map((item: DynamicFieldArrayItem): DynamicFieldArrayItem =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const handleRemove = (id: number): void => {
    setItems((currentItems: DynamicFieldArrayItem[]): DynamicFieldArrayItem[] =>
      currentItems.filter((item: DynamicFieldArrayItem): boolean => item.id !== id),
    );
  };

  return (
    <div>
      {items.map((item: DynamicFieldArrayItem, index: number): React.ReactElement => (
        <fieldset key={item.id}>
          <legend>Contact {index + 1}</legend>

          <label>
            Name
            <input
              type="text"
              value={item.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handleFieldChange(item.id, "name", event.target.value);
              }}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={item.email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handleFieldChange(item.id, "email", event.target.value);
              }}
            />
          </label>

          <button
            type="button"
            onClick={(): void => {
              handleRemove(item.id);
            }}
          >
            Remove
          </button>
        </fieldset>
      ))}

      {items.length === 0 && <p>No contacts have been added.</p>}
    </div>
  );
};

export const DynamicFieldArrayReorder: React.FC<DynamicFieldArrayReorderProps> = ({
  initialItems,
}): React.ReactElement => {
  const [items, setItems] = React.useState<DynamicFieldArrayItem[]>((): DynamicFieldArrayItem[] =>
    initialItems.map((item: DynamicFieldArrayItem): DynamicFieldArrayItem => ({
      ...item,
    })),
  );

  const handleMoveUp = (index: number): void => {
    if (index <= 0) {
      return;
    }

    setItems((currentItems: DynamicFieldArrayItem[]): DynamicFieldArrayItem[] => {
      const nextItems: DynamicFieldArrayItem[] = [...currentItems];

      const previousItem: DynamicFieldArrayItem = nextItems[index - 1];
      const currentItem: DynamicFieldArrayItem = nextItems[index];

      nextItems[index - 1] = currentItem;
      nextItems[index] = previousItem;

      return nextItems;
    });
  };

  const handleMoveDown = (index: number): void => {
    if (index >= items.length - 1) {
      return;
    }

    setItems((currentItems: DynamicFieldArrayItem[]): DynamicFieldArrayItem[] => {
      const nextItems: DynamicFieldArrayItem[] = [...currentItems];

      const currentItem: DynamicFieldArrayItem = nextItems[index];
      const nextItem: DynamicFieldArrayItem = nextItems[index + 1];

      nextItems[index] = nextItem;
      nextItems[index + 1] = currentItem;

      return nextItems;
    });
  };

  return (
    <div>
      {items.map((item: DynamicFieldArrayItem, index: number): React.ReactElement => (
        <fieldset key={item.id}>
          <legend>{item.name}</legend>

          <input type="email" value={item.email} readOnly />

          <button
            type="button"
            disabled={index === 0}
            onClick={(): void => {
              handleMoveUp(index);
            }}
          >
            Move up
          </button>

          <button
            type="button"
            disabled={index === items.length - 1}
            onClick={(): void => {
              handleMoveDown(index);
            }}
          >
            Move down
          </button>
        </fieldset>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Dynamic Field Arrays</h1>

      <h2>1. Managing an Array of Structured Form Fields</h2>
      <DynamicFieldArrayBasic
        initialItems={[
          {
            id: 1,
            name: "",
            email: "",
          },
        ]}
      />

      <h2>2. Updating, Removing, and Handling Multiple Fields per Item</h2>
      <DynamicFieldArrayNested
        initialItems={[
          {
            id: 1,
            name: "Alice",
            email: "alice@example.com",
          },
          {
            id: 2,
            name: "Bob",
            email: "bob@example.com",
          },
        ]}
      />

      <h2>3. Reordering Items Without Changing Their Identity</h2>
      <DynamicFieldArrayReorder
        initialItems={[
          {
            id: 1,
            name: "First",
            email: "first@example.com",
          },
          {
            id: 2,
            name: "Second",
            email: "second@example.com",
          },
          {
            id: 3,
            name: "Third",
            email: "third@example.com",
          },
        ]}
      />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A dynamic field array stores multiple related form fields as structured objects.
// - Each array item should have a stable identity separate from its array index.
// - Updating one property should preserve the other properties of the same item.
// - Updating a dynamic array should create new arrays and objects rather than mutating existing state.
// - The array index describes an item's current position and can change when items are removed or reordered.
// - A stable item identifier should be used as the React `key` for dynamic field arrays.
// - Removing an item should target its stable identity rather than its current position.
// - Reordering changes item positions without changing the logical identity of the items.
// - Dynamic field arrays can become empty, so the zero-item state should be handled explicitly.
// - Computed property names can update one known field while preserving the remaining properties of an array item.
