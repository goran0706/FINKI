/**
 * Headless Components
 * ====================
 *
 * A headless component provides behavior, state management, and interaction logic without
 * imposing a specific visual presentation. Consumers control the rendered markup and styling
 * while the headless component exposes the state and behavior required to build the interface.
 */

// ---------------------------------------------------------------------
// 1. Basic headless component
// ---------------------------------------------------------------------

import { useState } from "react";
import { type FC, type ReactElement, type ReactNode } from "react";

interface ToggleState {
  readonly isOn: boolean;
  readonly toggle: () => void;
}

interface ToggleProps {
  readonly children: (state: ToggleState) => ReactNode;
}

const Toggle: FC<ToggleProps> = ({ children }): ReactElement => {
  const [isOn, setIsOn] = useState(false);

  const toggle = (): void => {
    setIsOn((current) => !current);
  };

  return <>{children({ isOn, toggle })}</>;
};

export const ToggleExample: FC = (): ReactElement => {
  return (
    <Toggle>
      {({ isOn, toggle }) => (
        <button type="button" onClick={toggle}>
          {isOn ? "Enabled" : "Disabled"}
        </button>
      )}
    </Toggle>
  );
};

// ---------------------------------------------------------------------
// 2. Behavior without presentation
// ---------------------------------------------------------------------

interface DisclosureState {
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
  readonly toggle: () => void;
}

interface DisclosureProps {
  readonly children: (state: DisclosureState) => ReactNode;
}

const Disclosure: FC<DisclosureProps> = ({ children }): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const open = (): void => {
    setIsOpen(true);
  };

  const close = (): void => {
    setIsOpen(false);
  };

  const toggle = (): void => {
    setIsOpen((current) => !current);
  };

  return <>{children({ isOpen, open, close, toggle })}</>;
};

export const DisclosureExample: FC = (): ReactElement => {
  return (
    <Disclosure>
      {({ isOpen, toggle }) => (
        <section>
          <button type="button" onClick={toggle} aria-expanded={isOpen}>
            {isOpen ? "Hide details" : "Show details"}
          </button>

          {isOpen && <p>Additional account details are visible.</p>}
        </section>
      )}
    </Disclosure>
  );
};

// ---------------------------------------------------------------------
// 3. Headless component with reusable selection behavior
// ---------------------------------------------------------------------

interface Option {
  readonly value: string;
  readonly label: string;
}

interface SelectState {
  readonly value: string;
  readonly select: (value: string) => void;
}

interface HeadlessSelectProps {
  readonly options: readonly Option[];
  readonly defaultValue: string;
  readonly children: (state: SelectState) => ReactNode;
}

const HeadlessSelect: FC<HeadlessSelectProps> = ({ options, defaultValue, children }): ReactElement => {
  const [value, setValue] = useState(defaultValue);

  const select = (nextValue: string): void => {
    const optionExists = options.some((option) => option.value === nextValue);

    if (optionExists) {
      setValue(nextValue);
    }
  };

  return <>{children({ value, select })}</>;
};

export const SelectExample: FC = (): ReactElement => {
  const options: readonly Option[] = [
    { value: "profile", label: "Profile" },
    { value: "settings", label: "Settings" },
    { value: "notifications", label: "Notifications" },
  ];

  return (
    <HeadlessSelect options={options} defaultValue="profile">
      {({ value, select }) => (
        <div>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={value === option.value}
              onClick={() => select(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </HeadlessSelect>
  );
};

// ---------------------------------------------------------------------
// 4. Headless behavior can support different presentations
// ---------------------------------------------------------------------

interface CounterState {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

interface CounterProps {
  readonly initialValue?: number;
  readonly children: (state: CounterState) => ReactNode;
}

const Counter: FC<CounterProps> = ({ initialValue = 0, children }): ReactElement => {
  const [count, setCount] = useState(initialValue);

  const increment = (): void => {
    setCount((current) => current + 1);
  };

  const decrement = (): void => {
    setCount((current) => current - 1);
  };

  const reset = (): void => {
    setCount(initialValue);
  };

  return <>{children({ count, increment, decrement, reset })}</>;
};

export const ButtonCounter: FC = (): ReactElement => {
  return (
    <Counter initialValue={0}>
      {({ count, increment, decrement, reset }) => (
        <div>
          <strong>{count}</strong>
          <button type="button" onClick={increment}>
            +
          </button>
          <button type="button" onClick={decrement}>
            -
          </button>
          <button type="button" onClick={reset}>
            Reset
          </button>
        </div>
      )}
    </Counter>
  );
};

export const TextCounter: FC = (): ReactElement => {
  return (
    <Counter initialValue={10}>
      {({ count, increment, decrement }) => (
        <p>
          Current value: {count}
          <span>
            <button type="button" onClick={increment}>
              Increase
            </button>
            <button type="button" onClick={decrement}>
              Decrease
            </button>
          </span>
        </p>
      )}
    </Counter>
  );
};

// ---------------------------------------------------------------------
// 5. Headless components can expose interaction state
// ---------------------------------------------------------------------

interface MenuItem {
  readonly id: string;
  readonly label: string;
}

interface MenuState {
  readonly open: boolean;
  readonly highlightedId: string | null;
  readonly toggle: () => void;
  readonly highlight: (id: string) => void;
}

interface HeadlessMenuProps {
  readonly items: readonly MenuItem[];
  readonly children: (state: MenuState) => ReactNode;
}

const HeadlessMenu: FC<HeadlessMenuProps> = ({ items, children }): ReactElement => {
  const [open, setOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const toggle = (): void => {
    setOpen((current) => !current);
  };

  const highlight = (id: string): void => {
    const itemExists = items.some((item) => item.id === id);

    if (itemExists) {
      setHighlightedId(id);
    }
  };

  return <>{children({ open, highlightedId, toggle, highlight })}</>;
};

export const MenuExample: FC = (): ReactElement => {
  const items: readonly MenuItem[] = [
    { id: "profile", label: "Profile" },
    { id: "settings", label: "Settings" },
    { id: "logout", label: "Log out" },
  ];

  return (
    <HeadlessMenu items={items}>
      {({ open, highlightedId, toggle, highlight }) => (
        <div>
          <button type="button" onClick={toggle} aria-expanded={open}>
            Account
          </button>

          {open && (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={highlightedId === item.id}
                    onMouseEnter={() => highlight(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </HeadlessMenu>
  );
};

// ---------------------------------------------------------------------
// 6. Headless components can provide accessibility state
// ---------------------------------------------------------------------

interface DialogState {
  readonly isOpen: boolean;
  readonly open: () => void;
  readonly close: () => void;
  readonly triggerProps: {
    readonly "aria-haspopup": "dialog";
    readonly "aria-expanded": boolean;
    readonly onClick: () => void;
  };
  readonly dialogProps: {
    readonly role: "dialog";
    readonly "aria-modal": true;
  };
}

interface HeadlessDialogProps {
  readonly children: (state: DialogState) => ReactNode;
}

const HeadlessDialog: FC<HeadlessDialogProps> = ({ children }): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const open = (): void => {
    setIsOpen(true);
  };

  const close = (): void => {
    setIsOpen(false);
  };

  const triggerProps: DialogState["triggerProps"] = {
    "aria-haspopup": "dialog",
    "aria-expanded": isOpen,
    onClick: open,
  };

  const dialogProps: DialogState["dialogProps"] = {
    role: "dialog",
    "aria-modal": true,
  };

  return (
    <>
      {children({
        isOpen,
        open,
        close,
        triggerProps,
        dialogProps,
      })}
    </>
  );
};

export const DialogExample: FC = (): ReactElement => {
  return (
    <HeadlessDialog>
      {({ isOpen, close, triggerProps, dialogProps }) => (
        <div>
          <button type="button" {...triggerProps}>
            Open account dialog
          </button>

          {isOpen && (
            <div {...dialogProps}>
              <h2>Account</h2>
              <p>Account details are displayed here.</p>
              <button type="button" onClick={close}>
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </HeadlessDialog>
  );
};

// ---------------------------------------------------------------------
// 7. Headless components separate behavior from styling
// ---------------------------------------------------------------------

interface SearchState {
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly clear: () => void;
}

interface SearchProps {
  readonly initialQuery?: string;
  readonly children: (state: SearchState) => ReactNode;
}

const HeadlessSearch: FC<SearchProps> = ({ initialQuery = "", children }): ReactElement => {
  const [query, setQuery] = useState(initialQuery);

  const clear = (): void => {
    setQuery("");
  };

  return <>{children({ query, setQuery, clear })}</>;
};

export const SearchExample: FC = (): ReactElement => {
  return (
    <HeadlessSearch>
      {({ query, setQuery, clear }) => (
        <div>
          <label>
            Search
            <input value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>

          <button type="button" onClick={clear}>
            Clear
          </button>

          <p>Searching for: {query || "nothing"}</p>
        </div>
      )}
    </HeadlessSearch>
  );
};

// ---------------------------------------------------------------------
// 8. Complete headless component example
// ---------------------------------------------------------------------

export const HeadlessComponentsDemo: FC = (): ReactElement => {
  return (
    <main>
      <ToggleExample />
      <DisclosureExample />
      <SelectExample />
      <ButtonCounter />
      <TextCounter />
      <MenuExample />
      <DialogExample />
      <SearchExample />
    </main>
  );
};

export default HeadlessComponentsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A headless component provides behavior and state without prescribing a visual implementation.
// - Consumers control the rendered markup, styling, layout, and visual design.
// - The headless component exposes the state and actions needed to implement its behavior.
// - Render-prop children are one way to expose headless behavior directly to consumers.
// - Headless components can centralize interaction logic and accessibility-related state.
// - The same headless behavior can support multiple visual presentations.
// - Headless components are useful when behavior should be reusable while presentation needs to remain flexible.
// - A headless component should expose a focused API rather than leaking unnecessary implementation details.
