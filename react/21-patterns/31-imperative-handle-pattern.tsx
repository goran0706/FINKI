/**
 * Imperative Handle Pattern
 * =========================
 *
 * The imperative handle pattern allows a component to expose a deliberately limited set of
 * imperative methods through a ref. `useImperativeHandle` customizes the value received by the
 * parent ref, allowing the component to hide its internal DOM nodes and expose only supported actions.
 *
 * In React 19, function components can receive `ref` directly as a prop, so `forwardRef` is not
 * required for new components. React recommends using imperative handles only for behaviors that
 * cannot be expressed naturally through props.
 */

// ---------------------------------------------------------------------
// 1. Basic imperative handle
// ---------------------------------------------------------------------

import { useImperativeHandle, useRef, type FC, type ReactElement, type Ref } from "react";

export interface InputHandle {
  focus: () => void;
}

interface ImperativeInputProps {
  readonly label: string;
  readonly ref?: Ref<InputHandle>;
}

export const ImperativeInput: FC<ImperativeInputProps> = ({ label, ref }): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    [],
  );

  return (
    <label>
      {label}
      <input ref={inputRef} />
    </label>
  );
};

export const BasicImperativeHandleExample: FC = (): ReactElement => {
  const inputRef = useRef<InputHandle>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <ImperativeInput ref={inputRef} label="Name" />
      <button type="button" onClick={handleFocus}>
        Focus input
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 2. Exposing multiple imperative methods
// ---------------------------------------------------------------------

export interface InputActions {
  focus: () => void;
  select: () => void;
  clear: () => void;
}

interface InputActionsProps {
  readonly ref?: Ref<InputActions>;
  readonly defaultValue?: string;
}

export const InputWithActions: FC<InputActionsProps> = ({ ref, defaultValue = "" }): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      select: () => {
        inputRef.current?.select();
      },
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
    }),
    [],
  );

  return <input ref={inputRef} defaultValue={defaultValue} />;
};

export const MultipleMethodsExample: FC = (): ReactElement => {
  const inputRef = useRef<InputActions>(null);

  const handleSelect = (): void => {
    inputRef.current?.select();
  };

  const handleClear = (): void => {
    inputRef.current?.clear();
  };

  return (
    <div>
      <InputWithActions ref={inputRef} defaultValue="John Doe" />
      <button type="button" onClick={handleSelect}>
        Select
      </button>
      <button type="button" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Hiding the underlying DOM node
// ---------------------------------------------------------------------

export interface SearchInputHandle {
  focus: () => void;
  selectText: () => void;
}

interface SearchInputProps {
  readonly ref?: Ref<SearchInputHandle>;
  readonly placeholder?: string;
}

export const SearchInput: FC<SearchInputProps> = ({ ref, placeholder }): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      selectText: () => {
        inputRef.current?.select();
      },
    }),
    [],
  );

  return <input ref={inputRef} type="search" placeholder={placeholder} />;
};

export const RestrictedHandleExample: FC = (): ReactElement => {
  const searchRef = useRef<SearchInputHandle>(null);

  const handleFocus = (): void => {
    searchRef.current?.focus();
  };

  return (
    <div>
      <SearchInput ref={searchRef} placeholder="Search" />
      <button type="button" onClick={handleFocus}>
        Focus search
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Exposing component-specific behavior
// ---------------------------------------------------------------------

export interface FormFieldHandle {
  focus: () => void;
  clear: () => void;
}

interface FormFieldProps {
  readonly label: string;
  readonly ref?: Ref<FormFieldHandle>;
}

export const FormField: FC<FormFieldProps> = ({ label, ref }): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
    }),
    [],
  );

  return (
    <label>
      {label}
      <input ref={inputRef} />
    </label>
  );
};

export const FormFieldExample: FC = (): ReactElement => {
  const fieldRef = useRef<FormFieldHandle>(null);

  const handleReset = (): void => {
    fieldRef.current?.clear();
    fieldRef.current?.focus();
  };

  return (
    <div>
      <FormField ref={fieldRef} label="Email" />
      <button type="button" onClick={handleReset}>
        Reset field
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. Imperative methods can coordinate internal elements
// ---------------------------------------------------------------------

export interface SearchFormHandle {
  focusInput: () => void;
  clearInput: () => void;
}

interface SearchFormProps {
  readonly ref?: Ref<SearchFormHandle>;
}

export const SearchForm: FC<SearchFormProps> = ({ ref }): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focusInput: () => {
        inputRef.current?.focus();
      },
      clearInput: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
          inputRef.current.focus();
        }
      },
    }),
    [],
  );

  return (
    <form>
      <input ref={inputRef} type="search" placeholder="Search" />
      <button ref={buttonRef} type="submit">
        Search
      </button>
    </form>
  );
};

export const CoordinatedElementsExample: FC = (): ReactElement => {
  const searchRef = useRef<SearchFormHandle>(null);

  const handleFocus = (): void => {
    searchRef.current?.focusInput();
  };

  const handleClear = (): void => {
    searchRef.current?.clearInput();
  };

  return (
    <div>
      <SearchForm ref={searchRef} />
      <button type="button" onClick={handleFocus}>
        Focus search
      </button>
      <button type="button" onClick={handleClear}>
        Clear search
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 6. Imperative handles can expose semantic operations
// ---------------------------------------------------------------------

export interface DialogHandle {
  focusPrimaryAction: () => void;
}

interface DialogProps {
  readonly ref?: Ref<DialogHandle>;
  readonly title: string;
}

export const Dialog: FC<DialogProps> = ({ ref, title }): ReactElement => {
  const primaryActionRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focusPrimaryAction: () => {
        primaryActionRef.current?.focus();
      },
    }),
    [],
  );

  return (
    <section role="dialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">{title}</h2>
      <p>Account settings are available here.</p>
      <button ref={primaryActionRef} type="button">
        Save
      </button>
    </section>
  );
};

export const SemanticHandleExample: FC = (): ReactElement => {
  const dialogRef = useRef<DialogHandle>(null);

  const handleFocusAction = (): void => {
    dialogRef.current?.focusPrimaryAction();
  };

  return (
    <div>
      <Dialog ref={dialogRef} title="Account settings" />
      <button type="button" onClick={handleFocusAction}>
        Focus save action
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 7. Imperative handles can expose higher-level actions
// ---------------------------------------------------------------------

export interface EditorHandle {
  focusEditor: () => void;
  selectAll: () => void;
  clear: () => void;
}

interface EditorProps {
  readonly ref?: Ref<EditorHandle>;
}

export const Editor: FC<EditorProps> = ({ ref }): ReactElement => {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focusEditor: () => {
        editorRef.current?.focus();
      },
      selectAll: () => {
        editorRef.current?.select();
      },
      clear: () => {
        if (editorRef.current) {
          editorRef.current.value = "";
        }
      },
    }),
    [],
  );

  return <textarea ref={editorRef} defaultValue="Example content" rows={4} />;
};

export const HigherLevelActionExample: FC = (): ReactElement => {
  const editorRef = useRef<EditorHandle>(null);

  const handleSelectAll = (): void => {
    editorRef.current?.selectAll();
  };

  const handleClear = (): void => {
    editorRef.current?.clear();
  };

  return (
    <div>
      <Editor ref={editorRef} />
      <button type="button" onClick={handleSelectAll}>
        Select all
      </button>
      <button type="button" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 8. Imperative handles should remain narrowly scoped
// ---------------------------------------------------------------------

export interface InputHandleWithLimitedAPI {
  focus: () => void;
}

interface LimitedInputProps {
  readonly ref?: Ref<InputHandleWithLimitedAPI>;
}

export const LimitedInput: FC<LimitedInputProps> = ({ ref }): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }),
    [],
  );

  return <input ref={inputRef} />;
};

export const LimitedApiExample: FC = (): ReactElement => {
  const inputRef = useRef<InputHandleWithLimitedAPI>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <LimitedInput ref={inputRef} />
      <button type="button" onClick={handleFocus}>
        Focus input
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 9. Prefer props when behavior is declarative
// ---------------------------------------------------------------------

interface DeclarativeDialogProps {
  readonly isOpen: boolean;
  readonly title: string;
}

export const DeclarativeDialog: FC<DeclarativeDialogProps> = ({ isOpen, title }): ReactElement | null => {
  if (!isOpen) {
    return null;
  }

  return (
    <section role="dialog">
      <h2>{title}</h2>
      <p>Account settings are available here.</p>
    </section>
  );
};

interface ImperativeDialogHandle {
  open: () => void;
  close: () => void;
}

interface ImperativeDialogProps {
  readonly ref?: Ref<ImperativeDialogHandle>;
  readonly title: string;
}

export const ImperativeDialog: FC<ImperativeDialogProps> = ({ ref, title }): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        dialogRef.current?.showModal();
      },
      close: () => {
        dialogRef.current?.close();
      },
    }),
    [],
  );

  return (
    <dialog ref={dialogRef}>
      <h2>{title}</h2>
      <p>Account settings are available here.</p>
      <button type="button" onClick={() => dialogRef.current?.close()}>
        Close
      </button>
    </dialog>
  );
};

export const DeclarativeVsImperativeExample: FC = (): ReactElement => {
  const dialogRef = useRef<ImperativeDialogHandle>(null);

  const handleOpen = (): void => {
    dialogRef.current?.open();
  };

  const handleClose = (): void => {
    dialogRef.current?.close();
  };

  return (
    <div>
      <DeclarativeDialog isOpen title="Declarative dialog" />

      <ImperativeDialog ref={dialogRef} title="Imperative dialog" />

      <button type="button" onClick={handleOpen}>
        Open imperative dialog
      </button>
      <button type="button" onClick={handleClose}>
        Close imperative dialog
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 10. Complete demonstration
// ---------------------------------------------------------------------

export const ImperativeHandlePatternDemo: FC = (): ReactElement => {
  return (
    <main>
      <BasicImperativeHandleExample />
      <MultipleMethodsExample />
      <RestrictedHandleExample />
      <FormFieldExample />
      <CoordinatedElementsExample />
      <SemanticHandleExample />
      <HigherLevelActionExample />
      <LimitedApiExample />
      <DeclarativeVsImperativeExample />
    </main>
  );
};

export default ImperativeHandlePatternDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useImperativeHandle` customizes the value exposed through a component's ref.
// - An imperative handle usually exposes a small object containing specific methods.
// - The component can keep its internal DOM refs private while exposing only supported operations.
// - Imperative methods can represent semantic actions such as `focusInput`, `selectAll`, or `clear`.
// - A single imperative method can coordinate multiple internal DOM elements.
// - A narrow handle reduces coupling between the parent and the component's internal implementation.
// - In React 19, function components receive `ref` directly as a prop; older React versions required `forwardRef`.
// - Imperative handles should be reserved for behaviors that cannot be expressed naturally through props.
// - Declarative state such as whether a dialog is open should generally be controlled through props rather than imperative methods.
