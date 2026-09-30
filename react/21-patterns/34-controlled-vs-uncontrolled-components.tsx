/**
 * Controlled vs. Uncontrolled Components
 * =======================================
 *
 * Controlled and uncontrolled components differ primarily in state ownership. A controlled component
 * receives its current value from React state through props, while an uncontrolled component lets the
 * DOM maintain its current value and uses initial values, refs, or form APIs when access is needed.
 */

// ---------------------------------------------------------------------
// 1. Controlled input
// ---------------------------------------------------------------------

import { useRef, useState, type ChangeEvent, type FC, type FormEvent, type ReactElement } from "react";

interface ControlledInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

export const ControlledInput: FC<ControlledInputProps> = ({ value, onChange, placeholder }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return <input value={value} onChange={handleChange} placeholder={placeholder} />;
};

export const ControlledInputExample: FC = (): ReactElement => {
  const [name, setName] = useState("John Doe");

  return (
    <div>
      <ControlledInput value={name} onChange={setName} placeholder="Enter a name" />
      <p>Current value: {name}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 2. Uncontrolled input
// ---------------------------------------------------------------------

interface UncontrolledInputProps {
  readonly defaultValue?: string;
  readonly placeholder?: string;
}

export const UncontrolledInput: FC<UncontrolledInputProps> = ({ defaultValue = "", placeholder }): ReactElement => {
  return <input defaultValue={defaultValue} placeholder={placeholder} />;
};

export const UncontrolledInputExample: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRead = (): void => {
    console.log("Current value:", inputRef.current?.value);
  };

  return (
    <div>
      <input ref={inputRef} defaultValue="John Doe" placeholder="Enter a name" />
      <button type="button" onClick={handleRead}>
        Read value
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Controlled checkbox
// ---------------------------------------------------------------------

interface ControlledCheckboxProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly label: string;
}

export const ControlledCheckbox: FC<ControlledCheckboxProps> = ({ checked, onChange, label }): ReactElement => {
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
      <ControlledCheckbox checked={enabled} onChange={setEnabled} label="Enable notifications" />
      <p>Notifications: {enabled ? "enabled" : "disabled"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Uncontrolled checkbox
// ---------------------------------------------------------------------

interface UncontrolledCheckboxProps {
  readonly defaultChecked?: boolean;
  readonly label: string;
}

export const UncontrolledCheckbox: FC<UncontrolledCheckboxProps> = ({
  defaultChecked = false,
  label,
}): ReactElement => {
  return (
    <label>
      <input type="checkbox" defaultChecked={defaultChecked} />
      {label}
    </label>
  );
};

export const UncontrolledCheckboxExample: FC = (): ReactElement => {
  return <UncontrolledCheckbox defaultChecked label="Enable notifications" />;
};

// ---------------------------------------------------------------------
// 5. State ownership comparison
// ---------------------------------------------------------------------

interface AccountState {
  readonly name: string;
  readonly email: string;
}

interface ControlledAccountFormProps {
  readonly values: AccountState;
  readonly onChange: (values: AccountState) => void;
}

export const ControlledAccountForm: FC<ControlledAccountFormProps> = ({ values, onChange }): ReactElement => {
  return (
    <div>
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
          value={values.email}
          onChange={(event) =>
            onChange({
              ...values,
              email: event.target.value,
            })
          }
        />
      </label>
    </div>
  );
};

export const StateOwnershipExample: FC = (): ReactElement => {
  const [account, setAccount] = useState<AccountState>({
    name: "John Doe",
    email: "john.doe@example.com",
  });

  return (
    <div>
      <ControlledAccountForm values={account} onChange={setAccount} />
      <pre>{JSON.stringify(account, null, 2)}</pre>

      <UncontrolledAccountForm defaultName="John Doe" defaultEmail="john.doe@example.com" />
    </div>
  );
};

// ---------------------------------------------------------------------
// 6. Uncontrolled form with FormData
// ---------------------------------------------------------------------

interface UncontrolledAccountFormProps {
  readonly defaultName?: string;
  readonly defaultEmail?: string;
}

export const UncontrolledAccountForm: FC<UncontrolledAccountFormProps> = ({
  defaultName = "",
  defaultEmail = "",
}): ReactElement => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log("Name:", formData.get("name"));
    console.log("Email:", formData.get("email"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" defaultValue={defaultName} />
      </label>

      <label>
        Email
        <input name="email" type="email" defaultValue={defaultEmail} />
      </label>

      <button type="submit">Save</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 7. Controlled state enables derived UI
// ---------------------------------------------------------------------

interface CharacterCounterProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly maxLength: number;
}

export const CharacterCounter: FC<CharacterCounterProps> = ({ value, onChange, maxLength }): ReactElement => {
  const remaining = maxLength - value.length;

  return (
    <div>
      <textarea value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} />
      <p>{remaining} characters remaining.</p>
    </div>
  );
};

export const DerivedStateExample: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return <CharacterCounter value={message} onChange={setMessage} maxLength={100} />;
};

// ---------------------------------------------------------------------
// 8. Uncontrolled state can still be read when needed
// ---------------------------------------------------------------------

export const ReadOnDemandExample: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePreview = (): void => {
    const value = inputRef.current?.value ?? "";

    console.log("Preview:", value);
  };

  return (
    <div>
      <input ref={inputRef} defaultValue="John Doe" />
      <button type="button" onClick={handlePreview}>
        Preview
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 9. Shared state favors controlled components
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

interface SearchSummaryProps {
  readonly query: string;
}

export const SearchSummary: FC<SearchSummaryProps> = ({ query }): ReactElement => {
  return <p>Searching for: {query || "nothing"}</p>;
};

export const SharedStateComparisonExample: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      <SearchSummary query={query} />
    </div>
  );
};

// ---------------------------------------------------------------------
// 10. Choosing controlled or uncontrolled state
// ---------------------------------------------------------------------

interface SelectionProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onChange?: (value: string) => void;
}

export const Selection: FC<SelectionProps> = ({ value, defaultValue = "user", onChange }): ReactElement => {
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : defaultValue;

  return (
    <select value={selectedValue} onChange={(event) => onChange?.(event.target.value)}>
      <option value="user">User</option>
      <option value="editor">Editor</option>
      <option value="admin">Admin</option>
    </select>
  );
};

export const SelectionModeExample: FC = (): ReactElement => {
  const [role, setRole] = useState("user");

  return (
    <div>
      <Selection value={role} onChange={setRole} />

      <Selection defaultValue="editor" />
    </div>
  );
};

// ---------------------------------------------------------------------
// 11. Complete comparison
// ---------------------------------------------------------------------

export const ControlledVsUncontrolledDemo: FC = (): ReactElement => {
  return (
    <main>
      <ControlledInputExample />
      <UncontrolledInputExample />
      <ControlledCheckboxExample />
      <UncontrolledCheckboxExample />
      <StateOwnershipExample />
      <DerivedStateExample />
      <ReadOnDemandExample />
      <SharedStateComparisonExample />
      <SelectionModeExample />
    </main>
  );
};

export default ControlledVsUncontrolledDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Controlled components receive their current state through props, with the parent acting as the source of truth.
// - Uncontrolled components maintain their current form state internally, typically through the DOM.
// - `value` and `checked` establish controlled inputs, while `defaultValue` and `defaultChecked` establish initial uncontrolled values.
// - Controlled state is useful when multiple components need to coordinate around the same value.
// - Controlled state also makes derived UI, validation, conditional rendering, and persistence straightforward.
// - Uncontrolled state can be read on demand with refs or through browser form APIs such as `FormData`.
// - Uncontrolled components can reduce parent state management when the current value does not need to participate in rendering.
// - A component should have clear state ownership rather than switching unpredictably between controlled and uncontrolled modes.
// - APIs that support both modes should distinguish current-value props from initial-value props and define their behavior clearly.
// - The appropriate model depends on whether the parent needs to own and coordinate the component's current state.
