/**
 * Form State Ownership
 * =====================
 *
 * Form state ownership describes which component is responsible for storing and updating a piece
 * of form data. The component that owns the state is the source of truth: it holds the state value,
 * performs updates, and determines which other components receive that value through props.
 *
 * State ownership should follow the needs of the data. State that is meaningful to one component
 * can remain local to that component. State that must coordinate multiple components should be
 * owned by their closest common ancestor and passed downward through props and callbacks.
 *
 * A common source of bugs is allowing multiple components to independently store the same logical
 * value. Those copies can diverge because updating one state value does not automatically update
 * another. A single owner avoids that ambiguity.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface OwnedFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export interface OwnedPreviewProps {
  readonly value: string;
}

export interface OwnedFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface DuplicateStateFieldProps {
  readonly initialValue: string;
}

export interface DerivedStateFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const OwnedNameField: React.FC<OwnedFieldProps> = ({ value, onChange }): React.ReactElement => {
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

export const OwnedEmailField: React.FC<OwnedFieldProps> = ({ value, onChange }): React.ReactElement => {
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

export const OwnedPreview: React.FC<OwnedPreviewProps> = ({ value }): React.ReactElement => {
  return (
    <section>
      <h3>Current Name</h3>
      <p>{value || "(empty)"}</p>
    </section>
  );
};

export const OwnedForm: React.FC<OwnedFormProps> = ({ initialName, initialEmail }): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [email, setEmail] = React.useState<string>(initialEmail);

  const handleNameChange = (value: string): void => {
    setName(value);
  };

  const handleEmailChange = (value: string): void => {
    setEmail(value);
  };

  return (
    <form>
      <OwnedNameField value={name} onChange={handleNameChange} />

      <OwnedEmailField value={email} onChange={handleEmailChange} />

      <OwnedPreview value={name} />
    </form>
  );
};

export const DuplicateStateField: React.FC<DuplicateStateFieldProps> = ({ initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <label>
        Field with Its Own State
        <input type="text" value={value} onChange={handleChange} />
      </label>

      <p>This component owns its value independently.</p>
    </section>
  );
};

export const DerivedStateForm: React.FC<DerivedStateFormProps> = ({
  initialName,
  initialEmail,
}): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [email, setEmail] = React.useState<string>(initialEmail);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const isComplete: boolean = name.trim().length > 0 && email.trim().length > 0;

  return (
    <form>
      <label>
        Name
        <input type="text" value={name} onChange={handleNameChange} />
      </label>

      <label>
        Email
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>

      <p>{isComplete ? "Both fields are complete." : "Complete both fields."}</p>
    </form>
  );
};

export const IndependentFormInstances: React.FC = (): React.ReactElement => {
  const [firstName, setFirstName] = React.useState<string>("John");
  const [secondName, setSecondName] = React.useState<string>("Jane");

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstName(event.target.value);
  };

  const handleSecondNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSecondName(event.target.value);
  };

  return (
    <section>
      <label>
        First Form
        <input type="text" value={firstName} onChange={handleFirstNameChange} />
      </label>

      <label>
        Second Form
        <input type="text" value={secondName} onChange={handleSecondNameChange} />
      </label>

      <p>First value: {firstName}</p>
      <p>Second value: {secondName}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Form State Ownership</h1>

      <h2>1. A Parent Owns State Used by Multiple Children</h2>
      <OwnedForm initialName="John Doe" initialEmail="john@example.com" />

      <h2>2. Independent State Has an Independent Owner</h2>
      <DuplicateStateField initialValue="Local value" />

      <h2>3. Derived Values Do Not Need Separate Ownership</h2>
      <DerivedStateForm initialName="John Doe" initialEmail="john@example.com" />

      <h2>4. Separate Form Instances Have Separate State</h2>
      <IndependentFormInstances />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Form state ownership identifies which component is the source of truth for a value.
// - The owner stores the state and controls how that state changes.
// - Child components can receive owned state through props and report changes through callbacks.
// - State needed by multiple components should be owned by a component that can coordinate those consumers.
// - Duplicating the same logical form value in multiple state variables can create inconsistent sources of truth.
// - Derived values should normally be calculated from the state they depend on instead of stored separately.
// - A component can independently own state when its value does not need to be shared.
// - Separate rendered instances of a stateful component have separate state ownership.
// - State ownership is determined by who needs the data, not by which component visually renders the input.
