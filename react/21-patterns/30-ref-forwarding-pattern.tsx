/**
 * Ref Forwarding Pattern
 * ======================
 *
 * Ref forwarding allows a parent component to obtain a reference to a DOM node or another
 * ref-aware component rendered by a child. In React 19, function components can receive `ref`
 * directly as a prop, so `forwardRef` is no longer necessary for new components; `forwardRef`
 * remains relevant when working with older React versions or existing code that uses the pattern.
 */

// ---------------------------------------------------------------------
// 1. Passing a ref to a DOM element
// ---------------------------------------------------------------------

import { forwardRef, useRef, type FC, type ReactElement, type Ref } from "react";

export const DirectRefExample: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Enter a name" />
      <button type="button" onClick={handleFocus}>
        Focus input
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 2. Why a regular function component does not forward a ref
// ---------------------------------------------------------------------

interface InputProps {
  readonly label: string;
}

const RegularInput: FC<InputProps> = ({ label }): ReactElement => {
  return (
    <label>
      {label}
      <input />
    </label>
  );
};

export const RegularComponentExample: FC = (): ReactElement => {
  return <RegularInput label="Name" />;
};

// ---------------------------------------------------------------------
// 3. Ref forwarding with `forwardRef`
// ---------------------------------------------------------------------

interface ForwardedInputProps {
  readonly label: string;
}

export const ForwardedInput = forwardRef<HTMLInputElement, ForwardedInputProps>(function ForwardedInput(
  { label },
  ref,
): ReactElement {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});

export const ForwardRefExample: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <ForwardedInput label="Name" ref={inputRef} />
      <button type="button" onClick={handleFocus}>
        Focus input
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Forwarding a ref through multiple components
// ---------------------------------------------------------------------

interface FieldProps {
  readonly label: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field({ label }, ref): ReactElement {
  return (
    <label>
      {label}
      <ForwardedInput ref={ref} label="" />
    </label>
  );
});

export const MultiLevelForwardingExample: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <Field label="Username" ref={inputRef} />
      <button type="button" onClick={handleFocus}>
        Focus field
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. Forwarding refs to other DOM elements
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly children: string;
  readonly onClick?: () => void;
}

export const FocusableButton = forwardRef<HTMLButtonElement, ButtonProps>(function FocusableButton(
  { children, onClick },
  ref,
): ReactElement {
  return (
    <button type="button" ref={ref} onClick={onClick}>
      {children}
    </button>
  );
});

export const ButtonRefExample: FC = (): ReactElement => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleFocus = (): void => {
    buttonRef.current?.focus();
  };

  return (
    <div>
      <FocusableButton ref={buttonRef}>Save</FocusableButton>
      <button type="button" onClick={handleFocus}>
        Focus save button
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 6. React 19: receiving `ref` as a prop
// ---------------------------------------------------------------------

interface ModernInputProps {
  readonly label: string;
  readonly ref?: Ref<HTMLInputElement>;
}

export const ModernInput: FC<ModernInputProps> = ({ label, ref }): ReactElement => {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
};

export const ModernRefExample: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <ModernInput label="Name" ref={inputRef} />
      <button type="button" onClick={handleFocus}>
        Focus input
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 7. Forwarding additional native input props
// ---------------------------------------------------------------------

interface InputFieldProps extends Omit<React.ComponentPropsWithoutRef<"input">, "children"> {
  readonly label: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
  { label, ...inputProps },
  ref,
): ReactElement {
  return (
    <label>
      {label}
      <input {...inputProps} ref={ref} />
    </label>
  );
});

export const NativePropsWithRefExample: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <InputField ref={inputRef} label="Email" type="email" placeholder="john.doe@example.com" autoComplete="email" />
  );
};

// ---------------------------------------------------------------------
// 8. Ref forwarding does not change the component's public behavior
// ---------------------------------------------------------------------

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onChange },
  ref,
): ReactElement {
  return <input ref={ref} type="search" value={value} onChange={(event) => onChange(event.target.value)} />;
});

export const SearchInputExample: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (value: string): void => {
    console.log("Search value:", value);
  };

  const handleClear = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <SearchInput ref={inputRef} value="" onChange={handleChange} />
      <button type="button" onClick={handleClear}>
        Focus search
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 9. Ref forwarding exposes an implementation boundary
// ---------------------------------------------------------------------

interface AccountInputProps {
  readonly label: string;
}

export const AccountInput = forwardRef<HTMLInputElement, AccountInputProps>(function AccountInput(
  { label },
  ref,
): ReactElement {
  return (
    <label>
      {label}
      <input ref={ref} name="account" />
    </label>
  );
});

export const AccountForm: FC = (): ReactElement => {
  const accountInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (): void => {
    accountInputRef.current?.focus();
  };

  return (
    <form>
      <AccountInput ref={accountInputRef} label="Account" />
      <button type="button" onClick={handleEdit}>
        Edit account
      </button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 10. Complete demonstration
// ---------------------------------------------------------------------

export const RefForwardingPatternDemo: FC = (): ReactElement => {
  return (
    <main>
      <DirectRefExample />
      <RegularComponentExample />
      <ForwardRefExample />
      <MultiLevelForwardingExample />
      <ButtonRefExample />
      <ModernRefExample />
      <NativePropsWithRefExample />
      <SearchInputExample />
      <AccountForm />
    </main>
  );
};

export default RefForwardingPatternDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A ref gives a component access to a DOM node or another ref-exposed value for imperative operations.
// - A regular function component does not automatically expose its internal DOM nodes through a ref.
// - `forwardRef` historically allowed a function component to receive a ref and pass it to a child.
// - In React 19, function components can receive `ref` directly as a prop, so new components do not need `forwardRef`.
// - A ref can be forwarded through multiple component layers until it reaches the intended ref target.
// - Ref forwarding is useful for imperative operations such as focusing, scrolling, selecting, or measuring DOM elements.
// - Forwarding a ref creates an intentional public boundary around an internal DOM node or ref-aware component.
// - Exposing a ref should be deliberate because consumers become coupled to the exposed implementation detail.
// - Props should remain the preferred mechanism when a behavior can be expressed declaratively.
