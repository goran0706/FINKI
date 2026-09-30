/**
 * Dynamic Fields
 * ==============
 *
 * Dynamic fields are form controls whose number or structure can change at runtime. Common
 * examples include adding multiple phone numbers, addresses, contacts, or items to a form.
 *
 * The important implementation detail is that dynamic fields should be represented as data in
 * component state. Rendering is then derived from that state, while each rendered field receives
 * a stable key that identifies the logical item rather than its current array position.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DynamicFieldItem {
  readonly id: number;
  readonly value: string;
}

export interface DynamicFieldsBasicProps {
  readonly initialValues: readonly string[];
}

export interface DynamicFieldsObjectsProps {
  readonly initialContacts: readonly DynamicFieldItem[];
}

export interface DynamicFieldsRemoveProps {
  readonly initialValues: readonly string[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const DynamicFieldsBasic: React.FC<DynamicFieldsBasicProps> = ({ initialValues }): React.ReactElement => {
  const [fields, setFields] = React.useState<DynamicFieldItem[]>((): DynamicFieldItem[] =>
    initialValues.map((value: string, index: number): DynamicFieldItem => ({
      id: index + 1,
      value,
    })),
  );

  const handleAdd = (): void => {
    setFields((currentFields: DynamicFieldItem[]): DynamicFieldItem[] => {
      const nextId: number =
        currentFields.length === 0
          ? 1
          : Math.max(...currentFields.map((field: DynamicFieldItem): number => field.id)) + 1;

      return [
        ...currentFields,
        {
          id: nextId,
          value: "",
        },
      ];
    });
  };

  const handleChange = (id: number, value: string): void => {
    setFields((currentFields: DynamicFieldItem[]): DynamicFieldItem[] =>
      currentFields.map((field: DynamicFieldItem): DynamicFieldItem =>
        field.id === id
          ? {
              ...field,
              value,
            }
          : field,
      ),
    );
  };

  return (
    <div>
      {fields.map((field: DynamicFieldItem): React.ReactElement => (
        <label key={field.id}>
          Field {field.id}
          <input
            type="text"
            value={field.value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              handleChange(field.id, event.target.value);
            }}
          />
        </label>
      ))}

      <button type="button" onClick={handleAdd}>
        Add field
      </button>

      <p>Number of fields: {fields.length}</p>
    </div>
  );
};

export const DynamicFieldsObjects: React.FC<DynamicFieldsObjectsProps> = ({ initialContacts }): React.ReactElement => {
  const [contacts, setContacts] = React.useState<DynamicFieldItem[]>((): DynamicFieldItem[] =>
    initialContacts.map((contact: DynamicFieldItem): DynamicFieldItem => ({
      ...contact,
    })),
  );

  const handleAdd = (): void => {
    setContacts((currentContacts: DynamicFieldItem[]): DynamicFieldItem[] => {
      const nextId: number =
        currentContacts.length === 0
          ? 1
          : Math.max(...currentContacts.map((contact: DynamicFieldItem): number => contact.id)) + 1;

      return [
        ...currentContacts,
        {
          id: nextId,
          value: "",
        },
      ];
    });
  };

  const handleChange = (id: number, value: string): void => {
    setContacts((currentContacts: DynamicFieldItem[]): DynamicFieldItem[] =>
      currentContacts.map((contact: DynamicFieldItem): DynamicFieldItem =>
        contact.id === id
          ? {
              ...contact,
              value,
            }
          : contact,
      ),
    );
  };

  return (
    <div>
      {contacts.map((contact: DynamicFieldItem, index: number): React.ReactElement => (
        <div key={contact.id}>
          <label>
            Contact {index + 1}
            <input
              type="text"
              value={contact.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handleChange(contact.id, event.target.value);
              }}
            />
          </label>
        </div>
      ))}

      <button type="button" onClick={handleAdd}>
        Add contact
      </button>
    </div>
  );
};

export const DynamicFieldsRemove: React.FC<DynamicFieldsRemoveProps> = ({ initialValues }): React.ReactElement => {
  const [fields, setFields] = React.useState<DynamicFieldItem[]>((): DynamicFieldItem[] =>
    initialValues.map((value: string, index: number): DynamicFieldItem => ({
      id: index + 1,
      value,
    })),
  );

  const handleAdd = (): void => {
    setFields((currentFields: DynamicFieldItem[]): DynamicFieldItem[] => {
      const nextId: number =
        currentFields.length === 0
          ? 1
          : Math.max(...currentFields.map((field: DynamicFieldItem): number => field.id)) + 1;

      return [
        ...currentFields,
        {
          id: nextId,
          value: "",
        },
      ];
    });
  };

  const handleRemove = (id: number): void => {
    setFields((currentFields: DynamicFieldItem[]): DynamicFieldItem[] =>
      currentFields.filter((field: DynamicFieldItem): boolean => field.id !== id),
    );
  };

  const handleChange = (id: number, value: string): void => {
    setFields((currentFields: DynamicFieldItem[]): DynamicFieldItem[] =>
      currentFields.map((field: DynamicFieldItem): DynamicFieldItem =>
        field.id === id
          ? {
              ...field,
              value,
            }
          : field,
      ),
    );
  };

  return (
    <div>
      {fields.map((field: DynamicFieldItem, index: number): React.ReactElement => (
        <div key={field.id}>
          <label>
            Item {index + 1}
            <input
              type="text"
              value={field.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                handleChange(field.id, event.target.value);
              }}
            />
          </label>

          <button
            type="button"
            onClick={(): void => {
              handleRemove(field.id);
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={handleAdd}>
        Add item
      </button>

      {fields.length === 0 && <p>No dynamic fields remain.</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Dynamic Fields</h1>

      <h2>1. Adding Fields to a Form at Runtime</h2>
      <DynamicFieldsBasic initialValues={[""]} />

      <h2>2. Representing Dynamic Fields as Objects</h2>
      <DynamicFieldsObjects
        initialContacts={[
          {
            id: 1,
            value: "Primary contact",
          },
        ]}
      />

      <h2>3. Adding and Removing Individual Fields</h2>
      <DynamicFieldsRemove initialValues={["First item", "Second item"]} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Dynamic fields are form controls whose number or structure can change at runtime.
// - The collection of fields should be represented in React state when the UI needs to change it.
// - Adding a field should create a new item rather than mutating the existing state array.
// - Updating one dynamic field should preserve the other items in the collection.
// - Removing a field can be implemented by filtering its item out of the state array.
// - Each dynamic item should have a stable identity that can be used as its React `key`.
// - Array indexes are positions, not stable identities, so they are generally unsuitable as keys for removable or reorderable fields.
// - Removing an item changes array positions, but it should not change the identity of the remaining logical fields.
// - Dynamic field state can contain simple values or objects when each field needs additional metadata.
// - A dynamic field collection can legitimately become empty, so rendering should handle the zero-item case.
