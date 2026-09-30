/**
 * FormData
 * ========
 *
 * `FormData` is a browser API for collecting form control values into a key-value data structure.
 * It can be constructed from an HTML form element, which causes successful form controls to be
 * included according to normal HTML form submission rules.
 *
 * `FormData` stores values as strings or `File` objects. Text inputs, email inputs, selects, and
 * other successful controls contribute string values, while file inputs can contribute `File`
 * objects. Controls without a `name` attribute are not included, and disabled controls are also
 * excluded.
 *
 * `get()` returns the first value associated with a key, while `getAll()` returns every value for
 * that key. This distinction matters for controls such as checkbox groups or multiple-select
 * fields where several values can share the same field name.
 *
 * `FormData` is useful when form values need to be inspected or submitted as a multipart/form-data
 * request. It represents a snapshot of the form data at the time it is constructed; changing the
 * form afterward does not automatically update an existing `FormData` object.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormDataBasicProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface FormDataCheckboxProps {
  readonly initialInterests: readonly string[];
}

export interface FormDataFileProps {
  readonly accept: string;
}

export interface FormDataSnapshotProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormDataBasic: React.FC<FormDataBasicProps> = ({ initialName, initialEmail }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const form: HTMLFormElement = event.currentTarget;
    const formData: FormData = new FormData(form);

    const name: FormDataEntryValue | null = formData.get("name");

    const email: FormDataEntryValue | null = formData.get("email");

    console.log("Name:", name);
    console.log("Email:", email);
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

      <button type="submit">Read FormData</button>
    </form>
  );
};

export const FormDataMultipleValues: React.FC<FormDataCheckboxProps> = ({ initialInterests }): React.ReactElement => {
  const interests: readonly string[] = ["JavaScript", "TypeScript", "React"];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const selectedInterests: FormDataEntryValue[] = formData.getAll("interest");

    console.log("Selected interests:", selectedInterests);
  };

  return (
    <form onSubmit={handleSubmit}>
      {interests.map((interest: string): React.ReactElement => (
        <label key={interest}>
          <input
            type="checkbox"
            name="interest"
            value={interest}
            defaultChecked={initialInterests.includes(interest)}
          />
          {interest}
        </label>
      ))}

      <button type="submit">Read Interests</button>
    </form>
  );
};

export const FormDataFile: React.FC<FormDataFileProps> = ({ accept }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const file: FormDataEntryValue | null = formData.get("document");

    if (file instanceof File) {
      console.log("File name:", file.name);
      console.log("File size:", file.size);
      console.log("File type:", file.type);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Document
        <input type="file" name="document" accept={accept} />
      </label>

      <button type="submit">Read File</button>
    </form>
  );
};

export const FormDataMissingName: React.FC = (): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const unnamedValue: FormDataEntryValue | null = formData.get("unnamed");

    console.log("Unnamed control value:", unnamedValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Included field
        <input type="text" name="included" defaultValue="Included" />
      </label>

      <label>
        No name attribute
        <input type="text" defaultValue="Not included" />
      </label>

      <button type="submit">Inspect FormData</button>
    </form>
  );
};

export const FormDataSnapshot: React.FC<FormDataSnapshotProps> = ({ initialName }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const form: HTMLFormElement = event.currentTarget;
    const formData: FormData = new FormData(form);

    const originalName: FormDataEntryValue | null = formData.get("name");

    form.elements.namedItem("name");

    console.log("FormData snapshot:", originalName);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Create Snapshot</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>FormData</h1>

      <h2>1. Reading Basic Form Values with FormData</h2>
      <FormDataBasic initialName="John Doe" initialEmail="john@example.com" />

      <h2>2. Reading Multiple Values with getAll()</h2>
      <FormDataMultipleValues initialInterests={["JavaScript", "React"]} />

      <h2>3. Reading File Values</h2>
      <FormDataFile accept=".pdf,.txt" />

      <h2>4. Controls without a name Are Not Included</h2>
      <FormDataMissingName />

      <h2>5. FormData Represents a Snapshot</h2>
      <FormDataSnapshot initialName="John Doe" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `FormData` collects successful form control values from an HTML form.
// - Constructing `new FormData(form)` reads the form's current values at that moment.
// - `get()` returns the first value associated with a field name.
// - `getAll()` returns every value associated with a field name.
// - Form controls generally need a `name` attribute to contribute data to `FormData`.
// - Disabled controls and controls without a `name` are not included in the constructed data.
// - Textual form values are represented as strings.
// - File inputs can produce `File` objects.
// - `FormDataEntryValue` is the TypeScript union of `string | File`.
// - An existing `FormData` object does not automatically update when the form changes afterward.
