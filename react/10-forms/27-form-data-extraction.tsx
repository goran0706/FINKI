/**
 * FormData Extraction
 * ====================
 *
 * `FormData` provides several methods for extracting values from the data collected from an HTML
 * form. `get()` retrieves the first value associated with a field name, `getAll()` retrieves every
 * value associated with that name, `has()` checks whether a field exists, and `entries()` allows
 * all name-value pairs to be iterated.
 *
 * Form controls with repeated names can produce multiple entries, making `getAll()` important for
 * checkbox groups and other multi-value controls. `get()` should be used when a field is expected
 * to have one value, while `getAll()` preserves every submitted value.
 *
 * Extraction should also account for missing fields and the `string | File` value type represented
 * by `FormDataEntryValue`. A field name alone does not tell TypeScript whether the resulting value
 * is a string or a file.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormDataExtractionBasicProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface FormDataExtractionMultipleProps {
  readonly initialOptions: readonly string[];
}

export interface FormDataExtractionEntriesProps {
  readonly initialName: string;
}

export interface FormDataExtractionFileProps {
  readonly accept: string;
}

export interface FormDataExtractionMissingProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormDataExtractionGet: React.FC<FormDataExtractionBasicProps> = ({
  initialName,
  initialEmail,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const name: FormDataEntryValue | null = formData.get("name");

    const email: FormDataEntryValue | null = formData.get("email");

    if (typeof name === "string") {
      console.log("Name:", name);
    }

    if (typeof email === "string") {
      console.log("Email:", email);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <label>
        Email
        <input type="email" name="email" defaultValue={initialEmail} />
      </label>

      <button type="submit">Extract Values</button>
    </form>
  );
};

export const FormDataExtractionGetAll: React.FC<FormDataExtractionMultipleProps> = ({
  initialOptions,
}): React.ReactElement => {
  const options: readonly string[] = ["JavaScript", "TypeScript", "React"];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const values: FormDataEntryValue[] = formData.getAll("option");

    const selectedOptions: string[] = values.filter(
      (value: FormDataEntryValue): value is string => typeof value === "string",
    );

    console.log("Selected options:", selectedOptions);
  };

  return (
    <form onSubmit={handleSubmit}>
      {options.map((option: string): React.ReactElement => (
        <label key={option}>
          <input type="checkbox" name="option" value={option} defaultChecked={initialOptions.includes(option)} />
          {option}
        </label>
      ))}

      <button type="submit">Extract All Values</button>
    </form>
  );
};

export const FormDataExtractionHas: React.FC = (): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const hasEmail: boolean = formData.has("email");

    console.log("Has email:", hasEmail);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue="John Doe" />
      </label>

      <button type="submit">Check Field</button>
    </form>
  );
};

export const FormDataExtractionEntries: React.FC<FormDataExtractionEntriesProps> = ({
  initialName,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    for (const [name, value] of formData.entries()) {
      if (typeof value === "string") {
        console.log(`${name}:`, value);
      } else {
        console.log(`${name}:`, value.name);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <label>
        Document
        <input type="file" name="document" />
      </label>

      <button type="submit">Read Entries</button>
    </form>
  );
};

export const FormDataExtractionMissing: React.FC<FormDataExtractionMissingProps> = ({
  initialName,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const value: FormDataEntryValue | null = formData.get("email");

    if (value === null) {
      console.log("Email field was not submitted.");
      return;
    }

    if (typeof value === "string") {
      console.log("Email:", value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Extract Missing Field</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>FormData Extraction</h1>

      <h2>1. Extracting a Single Value with get()</h2>
      <FormDataExtractionGet initialName="John Doe" initialEmail="john@example.com" />

      <h2>2. Extracting Multiple Values with getAll()</h2>
      <FormDataExtractionGetAll initialOptions={["JavaScript", "React"]} />

      <h2>3. Checking for a Field with has()</h2>
      <FormDataExtractionHas />

      <h2>4. Iterating over FormData Entries</h2>
      <FormDataExtractionEntries initialName="John Doe" />

      <h2>5. Handling a Missing Field</h2>
      <FormDataExtractionMissing initialName="John Doe" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `FormData.get()` returns the first value associated with a field name.
// - `FormData.getAll()` returns every value associated with a field name.
// - `FormData.has()` checks whether at least one value exists for a field name.
// - `FormData.entries()` provides an iterator over all name-value pairs.
// - Repeated field names should generally be read with `getAll()` when every value is needed.
// - `FormData.get()` can return `null` when the requested field does not exist.
// - Extracted values have the type `string | File` and should be narrowed before specific use.
// - A field name does not guarantee that its value is a string.
// - File values can be handled separately after narrowing with `instanceof File`.
