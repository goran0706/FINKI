/**
 * FormData Types
 * ==============
 *
 * `FormData` is a browser API whose entries are typed as `string | File`. TypeScript exposes this
 * union through `FormDataEntryValue`, because a form field can produce either textual data or a
 * file value.
 *
 * Methods such as `get()` and `getAll()` therefore require appropriate type handling before a value
 * can be used as a specific type. `get()` returns `FormDataEntryValue | null` because the requested
 * field name might not exist, while `getAll()` always returns an array and can contain strings or
 * files.
 *
 * TypeScript does not infer a more specific type from the HTML field name. A field named `email`
 * is still returned as `FormDataEntryValue | null`, so application code must validate or narrow
 * the value before treating it as a string or `File`.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormDataTypesBasicProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface FormDataTypesFileProps {
  readonly accept: string;
}

export interface FormDataTypesMultipleProps {
  readonly initialRoles: readonly string[];
}

export interface FormDataTypesHelpersProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormDataTypesBasic: React.FC<FormDataTypesBasicProps> = ({
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

      <button type="submit">Read Values</button>
    </form>
  );
};

export const FormDataTypesFile: React.FC<FormDataTypesFileProps> = ({ accept }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const document: FormDataEntryValue | null = formData.get("document");

    if (document instanceof File) {
      console.log("File name:", document.name);
      console.log("File size:", document.size);
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

export const FormDataTypesMultiple: React.FC<FormDataTypesMultipleProps> = ({ initialRoles }): React.ReactElement => {
  const roles: readonly string[] = ["Developer", "Designer", "Manager"];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const values: FormDataEntryValue[] = formData.getAll("role");

    const strings: string[] = values.filter((value: FormDataEntryValue): value is string => typeof value === "string");

    console.log("Selected roles:", strings);
  };

  return (
    <form onSubmit={handleSubmit}>
      {roles.map((role: string): React.ReactElement => (
        <label key={role}>
          <input type="checkbox" name="role" value={role} defaultChecked={initialRoles.includes(role)} />
          {role}
        </label>
      ))}

      <button type="submit">Read Roles</button>
    </form>
  );
};

export const FormDataTypesHelpers: React.FC<FormDataTypesHelpersProps> = ({ initialName }): React.ReactElement => {
  const getFormString = (formData: FormData, name: string): string | null => {
    const value: FormDataEntryValue | null = formData.get(name);

    return typeof value === "string" ? value : null;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const name: string | null = getFormString(formData, "name");

    console.log("Name:", name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Read String</button>
    </form>
  );
};

export const FormDataTypesMissingValue: React.FC = (): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const value: FormDataEntryValue | null = formData.get("missing");

    if (value === null) {
      console.log("The field does not exist.");
      return;
    }

    console.log("Field value:", value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue="John Doe" />
      </label>

      <button type="submit">Read Missing Field</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>FormData Types</h1>

      <h2>1. Narrowing FormDataEntryValue to a String</h2>
      <FormDataTypesBasic initialName="John Doe" initialEmail="john@example.com" />

      <h2>2. Narrowing FormDataEntryValue to a File</h2>
      <FormDataTypesFile accept=".pdf,.txt" />

      <h2>3. Narrowing Multiple FormData Values</h2>
      <FormDataTypesMultiple initialRoles={["Developer"]} />

      <h2>4. Creating a Typed String Helper</h2>
      <FormDataTypesHelpers initialName="John Doe" />

      <h2>5. Handling a Missing FormData Value</h2>
      <FormDataTypesMissingValue />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `FormDataEntryValue` is the TypeScript type `string | File`.
// - `FormData.get()` returns `FormDataEntryValue | null` because the requested key may be absent.
// - `FormData.getAll()` returns `FormDataEntryValue[]` and can contain multiple values for one key.
// - TypeScript does not infer a specific value type from an HTML field's `name` attribute.
// - `typeof value === "string"` narrows a `FormDataEntryValue` to `string`.
// - `value instanceof File` narrows a `FormDataEntryValue` to `File`.
// - A user-defined type predicate can narrow arrays of `FormDataEntryValue` to `string[]`.
// - Missing values should be handled explicitly before using a value returned by `get()`.
// - A helper function can centralize string extraction and null handling for repeated form fields.
