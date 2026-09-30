/**
 * Parent Form State
 * ==================
 *
 * Parent form state is form data owned by a parent component and passed to child form controls
 * through props. The parent becomes the source of truth for the form values, while child components
 * receive their current values and change handlers from the parent.
 *
 * This ownership model allows multiple child components to work with the same form state. A child
 * does not maintain a separate copy of the field value; instead, it reports changes upward through
 * a callback, and the parent updates its state before passing the new value back down.
 *
 * Keeping the state in the parent is useful when sibling components need access to the same form
 * data, when the parent needs to submit or validate the complete form, or when form state must
 * coordinate behavior across multiple child components.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ParentFormFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export interface ParentFormSummaryProps {
  readonly name: string;
  readonly email: string;
}

export interface ParentFormActionsProps {
  readonly onReset: () => void;
}

export interface ParentFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ParentNameField: React.FC<ParentFormFieldProps> = ({ value, onChange }): React.ReactElement => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <label>
      Name
      <input type="text" value={value} onChange={handleChange} />
    </label>
  );
};

export const ParentEmailField: React.FC<ParentFormFieldProps> = ({ value, onChange }): React.ReactElement => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <label>
      Email
      <input type="email" value={value} onChange={handleChange} />
    </label>
  );
};

export const ParentFormSummary: React.FC<ParentFormSummaryProps> = ({ name, email }): React.ReactElement => {
  return (
    <section>
      <h3>Current Form Data</h3>
      <p>Name: {name || "(empty)"}</p>
      <p>Email: {email || "(empty)"}</p>
    </section>
  );
};

export const ParentFormActions: React.FC<ParentFormActionsProps> = ({ onReset }): React.ReactElement => {
  return (
    <button type="button" onClick={onReset}>
      Reset
    </button>
  );
};

export const ParentForm: React.FC<ParentFormProps> = ({ initialName, initialEmail }): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [email, setEmail] = React.useState<string>(initialEmail);

  const handleNameChange = (value: string): void => {
    setName(value);
  };

  const handleEmailChange = (value: string): void => {
    setEmail(value);
  };

  const handleReset = (): void => {
    setName(initialName);
    setEmail(initialEmail);
  };

  return (
    <form>
      <ParentNameField value={name} onChange={handleNameChange} />

      <ParentEmailField value={email} onChange={handleEmailChange} />

      <ParentFormSummary name={name} email={email} />

      <ParentFormActions onReset={handleReset} />
    </form>
  );
};

export const ParentFormSharedValue: React.FC = (): React.ReactElement => {
  const [name, setName] = React.useState<string>("John Doe");

  const handleNameChange = (value: string): void => {
    setName(value);
  };

  return (
    <section>
      <ParentNameField value={name} onChange={handleNameChange} />

      <p>Preview: {name || "(empty)"}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Parent Form State</h1>

      <h2>1. Parent-Owned Field State</h2>
      <ParentForm initialName="John Doe" initialEmail="john@example.com" />

      <h2>2. Sharing Parent State with a Summary</h2>
      <ParentFormSharedValue />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Parent form state is owned by a parent component rather than an individual field component.
// - The parent passes current field values to child components through props.
// - Child components report changes through callback props instead of owning the field state.
// - The parent remains the source of truth for controlled child inputs.
// - Multiple child components can consume the same parent-owned form state.
// - Sibling components can stay synchronized because they receive values from the same state owner.
// - Resetting the form can be coordinated centrally by the parent.
// - Lifting form state to a parent is useful when multiple components need access to the same data.
// - A child should not maintain a second independent copy of a value that the parent already owns.
