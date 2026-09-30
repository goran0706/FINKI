/**
 * Uncontrolled Components
 * ========================
 *
 * An uncontrolled component keeps its current state in the DOM or in the component itself instead
 * of receiving that state value from its parent on every render. The parent can provide initial
 * values and use refs or events to read the current value when it needs to interact with the component.
 */

// ---------------------------------------------------------------------
// 1. Basic uncontrolled input
// ---------------------------------------------------------------------

import { useRef, type FC, type ReactElement } from "react";

export const BasicUncontrolledInputExample: FC = (): ReactElement => {
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
// 2. `defaultValue` sets the initial value
// ---------------------------------------------------------------------

interface NameFieldProps {
  readonly defaultValue?: string;
}

export const NameField: FC<NameFieldProps> = ({ defaultValue = "" }): ReactElement => {
  return <input defaultValue={defaultValue} placeholder="Enter a name" />;
};

export const DefaultValueExample: FC = (): ReactElement => {
  return <NameField defaultValue="John Doe" />;
};

// ---------------------------------------------------------------------
// 3. Changing the default does not control the current value
// ---------------------------------------------------------------------

export const InitialValueExample: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRead = (): void => {
    console.log("Current value:", inputRef.current?.value);
  };

  return (
    <div>
      <input ref={inputRef} defaultValue="Initial value" />
      <button type="button" onClick={handleRead}>
        Read current value
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Uncontrolled checkbox
// ---------------------------------------------------------------------

interface NotificationCheckboxProps {
  readonly defaultChecked?: boolean;
}

export const NotificationCheckbox: FC<NotificationCheckboxProps> = ({ defaultChecked = false }): ReactElement => {
  return (
    <label>
      <input type="checkbox" defaultChecked={defaultChecked} />
      Enable notifications
    </label>
  );
};

export const UncontrolledCheckboxExample: FC = (): ReactElement => {
  return <NotificationCheckbox defaultChecked />;
};

// ---------------------------------------------------------------------
// 5. Reading an uncontrolled checkbox with a ref
// ---------------------------------------------------------------------

export const CheckboxRefExample: FC = (): ReactElement => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const handleRead = (): void => {
    console.log("Notifications enabled:", checkboxRef.current?.checked);
  };

  return (
    <div>
      <label>
        <input ref={checkboxRef} type="checkbox" defaultChecked />
        Enable notifications
      </label>

      <button type="button" onClick={handleRead}>
        Read state
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 6. Uncontrolled select
// ---------------------------------------------------------------------

type AccountRole = "user" | "editor" | "admin";

interface RoleSelectProps {
  readonly defaultValue?: AccountRole;
}

export const RoleSelect: FC<RoleSelectProps> = ({ defaultValue = "user" }): ReactElement => {
  return (
    <select defaultValue={defaultValue}>
      <option value="user">User</option>
      <option value="editor">Editor</option>
      <option value="admin">Admin</option>
    </select>
  );
};

export const UncontrolledSelectExample: FC = (): ReactElement => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleRead = (): void => {
    console.log("Selected role:", selectRef.current?.value);
  };

  return (
    <div>
      <select ref={selectRef} defaultValue="user">
        <option value="user">User</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>

      <button type="button" onClick={handleRead}>
        Read role
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 7. Uncontrolled form
// ---------------------------------------------------------------------

export const UncontrolledFormExample: FC = (): ReactElement => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log("Name:", formData.get("name"));
    console.log("Email:", formData.get("email"));
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" defaultValue="John Doe" />
      </label>

      <label>
        Email
        <input name="email" type="email" defaultValue="john.doe@example.com" />
      </label>

      <button type="submit">Save</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 8. Reading several uncontrolled fields with refs
// ---------------------------------------------------------------------

export const MultipleRefsExample: FC = (): ReactElement => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleRead = (): void => {
    console.log("Name:", nameRef.current?.value);
    console.log("Email:", emailRef.current?.value);
  };

  return (
    <div>
      <label>
        Name
        <input ref={nameRef} defaultValue="John Doe" />
      </label>

      <label>
        Email
        <input ref={emailRef} type="email" defaultValue="john.doe@example.com" />
      </label>

      <button type="button" onClick={handleRead}>
        Read values
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 9. Uncontrolled file input
// ---------------------------------------------------------------------

export const FileInputExample: FC = (): ReactElement => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRead = (): void => {
    const file = fileInputRef.current?.files?.[0];

    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <div>
      <input ref={fileInputRef} type="file" />
      <button type="button" onClick={handleRead}>
        Read selected file
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 10. Resetting uncontrolled fields
// ---------------------------------------------------------------------

export const ResettableFormExample: FC = (): ReactElement => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleReset = (): void => {
    formRef.current?.reset();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log("Name:", formData.get("name"));
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" defaultValue="John Doe" />
      </label>

      <button type="submit">Save</button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 11. Uncontrolled components can still report events
// ---------------------------------------------------------------------

export const EventReportingInputExample: FC = (): ReactElement => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    console.log("Current value:", event.target.value);
  };

  return <input defaultValue="John Doe" onChange={handleChange} />;
};

// ---------------------------------------------------------------------
// 12. Controlled and uncontrolled ownership models
// ---------------------------------------------------------------------

interface ControlledNameProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const ControlledName: FC<ControlledNameProps> = ({ value, onChange }): ReactElement => {
  return <input value={value} onChange={(event) => onChange(event.target.value)} />;
};

interface UncontrolledNameProps {
  readonly defaultValue?: string;
}

export const UncontrolledName: FC<UncontrolledNameProps> = ({ defaultValue = "" }): ReactElement => {
  return <input defaultValue={defaultValue} />;
};

export const OwnershipComparisonExample: FC = (): ReactElement => {
  const controlledRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <ControlledName value="John Doe" onChange={(value) => console.log("Controlled:", value)} />

      <UncontrolledName defaultValue="John Doe" />

      <input ref={controlledRef} defaultValue="John Doe" />
    </div>
  );
};

// ---------------------------------------------------------------------
// 13. Complete demonstration
// ---------------------------------------------------------------------

export const UncontrolledComponentsDemo: FC = (): ReactElement => {
  return (
    <main>
      <BasicUncontrolledInputExample />
      <DefaultValueExample />
      <InitialValueExample />
      <UncontrolledCheckboxExample />
      <CheckboxRefExample />
      <UncontrolledSelectExample />
      <UncontrolledFormExample />
      <MultipleRefsExample />
      <FileInputExample />
      <ResettableFormExample />
      <EventReportingInputExample />
      <OwnershipComparisonExample />
    </main>
  );
};

export default UncontrolledComponentsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An uncontrolled component keeps its current form state in the DOM instead of receiving that state on every render.
// - `defaultValue` and `defaultChecked` provide initial values without making the parent the source of truth.
// - Refs can read the current value of uncontrolled inputs when imperative access is required.
// - `FormData` provides a convenient way to read multiple uncontrolled form fields during submission.
// - Uncontrolled checkboxes and selects use `defaultChecked` and `defaultValue` for their initial state.
// - File inputs are naturally treated as uncontrolled because their selected files are exposed through the DOM.
// - Uncontrolled fields can still report events; using `onChange` does not by itself make a component controlled.
// - Form reset operations can be performed directly through the native form API.
// - The main distinction is state ownership: controlled components receive current state from props, while uncontrolled components let the DOM maintain it.
// - Uncontrolled components are useful when the parent does not need to coordinate the current value on every render.
