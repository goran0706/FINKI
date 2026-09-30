/**
 * Controlled Components
 * ======================
 *
 * A controlled component receives its current state from its parent through props and reports
 * requested changes through callbacks. The parent owns the source of truth, while the component
 * is responsible for rendering the provided value and notifying the parent about user actions.
 */

// ---------------------------------------------------------------------
// 1. Basic controlled input
// ---------------------------------------------------------------------

import { useState, type ChangeEvent, type FC, type ReactElement } from "react";

interface TextInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

export const TextInput: FC<TextInputProps> = ({ value, onChange, placeholder }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return <input value={value} placeholder={placeholder} onChange={handleChange} />;
};

export const BasicControlledInputExample: FC = (): ReactElement => {
  const [name, setName] = useState("John Doe");

  return <TextInput value={name} onChange={setName} placeholder="Enter a name" />;
};

// ---------------------------------------------------------------------
// 2. The parent owns the source of truth
// ---------------------------------------------------------------------

interface UserNameEditorProps {
  readonly name: string;
  readonly onNameChange: (name: string) => void;
}

export const UserNameEditor: FC<UserNameEditorProps> = ({ name, onNameChange }): ReactElement => {
  return (
    <label>
      Name
      <input value={name} onChange={(event) => onNameChange(event.target.value)} />
    </label>
  );
};

export const ParentOwnedStateExample: FC = (): ReactElement => {
  const [name, setName] = useState("John Doe");

  return (
    <div>
      <UserNameEditor name={name} onNameChange={setName} />
      <p>Current name: {name}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Controlled checkbox
// ---------------------------------------------------------------------

interface CheckboxProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly label: string;
}

export const Checkbox: FC<CheckboxProps> = ({ checked, onChange, label }): ReactElement => {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
};

export const ControlledCheckboxExample: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div>
      <Checkbox checked={enabled} onChange={setEnabled} label="Enable notifications" />
      <p>Notifications: {enabled ? "enabled" : "disabled"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Controlled select
// ---------------------------------------------------------------------

type AccountRole = "user" | "admin" | "editor";

interface RoleSelectProps {
  readonly value: AccountRole;
  readonly onChange: (role: AccountRole) => void;
}

export const RoleSelect: FC<RoleSelectProps> = ({ value, onChange }): ReactElement => {
  return (
    <label>
      Role
      <select value={value} onChange={(event) => onChange(event.target.value as AccountRole)}>
        <option value="user">User</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>
    </label>
  );
};

export const ControlledSelectExample: FC = (): ReactElement => {
  const [role, setRole] = useState<AccountRole>("user");

  return (
    <div>
      <RoleSelect value={role} onChange={setRole} />
      <p>Selected role: {role}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. Controlled toggle
// ---------------------------------------------------------------------

interface ToggleProps {
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
  readonly label: string;
}

export const Toggle: FC<ToggleProps> = ({ value, onChange, label }): ReactElement => {
  return (
    <button type="button" aria-pressed={value} onClick={() => onChange(!value)}>
      {label}: {value ? "On" : "Off"}
    </button>
  );
};

export const ControlledToggleExample: FC = (): ReactElement => {
  const [darkMode, setDarkMode] = useState(false);

  return <Toggle value={darkMode} onChange={setDarkMode} label="Dark mode" />;
};

// ---------------------------------------------------------------------
// 6. Controlled components with derived output
// ---------------------------------------------------------------------

interface CharacterCounterProps {
  readonly value: string;
  readonly maxLength: number;
  readonly onChange: (value: string) => void;
}

export const CharacterCounter: FC<CharacterCounterProps> = ({ value, maxLength, onChange }): ReactElement => {
  const remaining = maxLength - value.length;

  return (
    <div>
      <textarea value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} />
      <p>{remaining} characters remaining.</p>
    </div>
  );
};

export const DerivedOutputExample: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return <CharacterCounter value={message} maxLength={100} onChange={setMessage} />;
};

// ---------------------------------------------------------------------
// 7. Controlled form
// ---------------------------------------------------------------------

interface AccountFormValues {
  readonly name: string;
  readonly email: string;
}

interface AccountFormProps {
  readonly values: AccountFormValues;
  readonly onChange: (values: AccountFormValues) => void;
  readonly onSubmit: (values: AccountFormValues) => void;
}

export const AccountForm: FC<AccountFormProps> = ({ values, onChange, onSubmit }): ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input
          value={values.name}
          onChange={(event) =>
            onChange({
              ...values,
              name: event.target.value,
            })
          }
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={values.email}
          onChange={(event) =>
            onChange({
              ...values,
              email: event.target.value,
            })
          }
        />
      </label>

      <button type="submit">Save</button>
    </form>
  );
};

export const ControlledFormExample: FC = (): ReactElement => {
  const [values, setValues] = useState<AccountFormValues>({
    name: "John Doe",
    email: "john.doe@example.com",
  });

  const handleSubmit = (submittedValues: AccountFormValues): void => {
    console.log("Submitted:", submittedValues);
  };

  return (
    <div>
      <AccountForm values={values} onChange={setValues} onSubmit={handleSubmit} />
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </div>
  );
};

// ---------------------------------------------------------------------
// 8. Controlled components can expose state transitions
// ---------------------------------------------------------------------

type DisclosureState = "open" | "closed";

interface DisclosureProps {
  readonly state: DisclosureState;
  readonly onStateChange: (state: DisclosureState) => void;
  readonly title: string;
}

export const Disclosure: FC<DisclosureProps> = ({ state, onStateChange, title }): ReactElement => {
  const isOpen = state === "open";

  const handleToggle = (): void => {
    onStateChange(isOpen ? "closed" : "open");
  };

  return (
    <section>
      <button type="button" aria-expanded={isOpen} onClick={handleToggle}>
        {title}
      </button>

      {isOpen && (
        <div>
          <p>Additional account information.</p>
        </div>
      )}
    </section>
  );
};

export const ControlledDisclosureExample: FC = (): ReactElement => {
  const [state, setState] = useState<DisclosureState>("closed");

  return <Disclosure state={state} onStateChange={setState} title="Account details" />;
};

// ---------------------------------------------------------------------
// 9. Multiple controlled components can share state
// ---------------------------------------------------------------------

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({ value, onChange }): ReactElement => {
  return (
    <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search users" />
  );
};

interface FilterSummaryProps {
  readonly query: string;
}

export const FilterSummary: FC<FilterSummaryProps> = ({ query }): ReactElement => {
  return <p>Search query: {query || "none"}</p>;
};

export const SharedStateExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      <FilterSummary query={query} />
    </div>
  );
};

// ---------------------------------------------------------------------
// 10. Controlled and uncontrolled APIs can be combined
// ---------------------------------------------------------------------

interface SelectionProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
}

export const Selection: FC<SelectionProps> = ({ value, defaultValue = "user", onChange }): ReactElement => {
  const isControlled = value !== undefined;
  const selectedValue = value ?? defaultValue;

  const handleChange = (nextValue: string): void => {
    onChange?.(nextValue);
  };

  return (
    <select value={selectedValue} onChange={(event) => handleChange(event.target.value)}>
      <option value="user">User</option>
      <option value="editor">Editor</option>
      <option value="admin">Admin</option>
    </select>
  );
};

export const ControlledApiExample: FC = (): ReactElement => {
  const [role, setRole] = useState("user");

  return (
    <div>
      <Selection value={role} onChange={setRole} />
      <p>Controlled role: {role}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 11. Complete demonstration
// ---------------------------------------------------------------------

export const ControlledComponentsDemo: FC = (): ReactElement => {
  return (
    <main>
      <BasicControlledInputExample />
      <ParentOwnedStateExample />
      <ControlledCheckboxExample />
      <ControlledSelectExample />
      <ControlledToggleExample />
      <DerivedOutputExample />
      <ControlledFormExample />
      <ControlledDisclosureExample />
      <SharedStateExample />
      <ControlledApiExample />
    </main>
  );
};

export default ControlledComponentsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A controlled component receives its current state through props.
// - The parent owns the source of truth and decides what value the component should display.
// - Callback props communicate requested state changes from the component back to the parent.
// - Controlled inputs, checkboxes, selects, toggles, and forms all follow the same ownership model.
// - Because the parent owns the state, multiple components can share and derive information from the same value.
// - Controlled components make state transitions explicit and predictable through props and callbacks.
// - Derived UI can be calculated directly from controlled values instead of maintaining duplicate state.
// - A component can expose a controlled API with a `value` and `onChange` pair.
// - Components that support both controlled and uncontrolled usage must define clear ownership semantics.
// - Controlled state is generally preferable when the parent needs to coordinate, validate, derive, or persist the component's state.
