/**
 * Client State
 * ============
 *
 * Client state is application data that is created, changed, and consumed within the client
 * application itself. It represents information the UI needs to remember or coordinate locally,
 * rather than data whose authoritative source is a remote server.
 *
 * Common examples include whether a dialog is open, which tab is selected, the current value of
 * a form field, a selected item, a user's local display preferences, and application-wide state
 * such as a theme or authenticated UI session. Client state can exist at different scopes: inside
 * one component, shared by a component subtree, or stored in a global state store.
 *
 * Client state differs from server state in ownership and lifecycle. Client state is generally
 * owned by the application and can be changed directly by client-side interactions. Server state
 * is owned by a remote system and requires synchronization with that system. A value can also
 * represent client state even when it originated from a server, if the application maintains a
 * separate local value that controls how the UI behaves.
 *
 * The important distinction is not simply where the data is stored. It is who owns the data and
 * whether the application is responsible for synchronizing it with an external source.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ClientStateExampleProps {
  readonly initialCount: number;
}

export interface ClientStateDisplayProps {
  readonly count: number;
}

export interface ToggleStateProps {
  readonly initialOpen: boolean;
}

export interface SelectionStateProps {
  readonly options: readonly string[];
  readonly initialSelection: string;
}

export interface ClientStateCategoryProps {
  readonly title: string;
  readonly description: string;
  readonly examples: readonly string[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ClientStateDisplay: FC<ClientStateDisplayProps> = ({ count }): ReactElement => {
  return <p>Current local count: {count}</p>;
};

export const CounterStateExample: FC<ClientStateExampleProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((currentCount: number): number => currentCount + 1);
  };

  const reset = (): void => {
    setCount(initialCount);
  };

  return (
    <div>
      <ClientStateDisplay count={count} />
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </div>
  );
};

export const ToggleStateExample: FC<ToggleStateProps> = ({ initialOpen }): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);

  const toggle = (): void => {
    setIsOpen((currentIsOpen: boolean): boolean => !currentIsOpen);
  };

  return (
    <div>
      <p>Panel: {isOpen ? "open" : "closed"}</p>
      <button type="button" onClick={toggle}>
        {isOpen ? "Close" : "Open"} panel
      </button>
      {isOpen && <p>This visibility is controlled by client state.</p>}
    </div>
  );
};

export const SelectionStateExample: FC<SelectionStateProps> = ({ options, initialSelection }): ReactElement => {
  const [selection, setSelection] = useState<string>(initialSelection);

  return (
    <div>
      <p>Selected: {selection}</p>
      <div>
        {options.map((option: string) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSelection(option);
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export const ClientStateCategory: FC<ClientStateCategoryProps> = ({ title, description, examples }): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {examples.map((example: string) => (
          <li key={example}>{example}</li>
        ))}
      </ul>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ClientStateDemo: FC = (): ReactElement => {
  const localStateExamples: readonly string[] = [
    "Counter values",
    "Dialog visibility",
    "Selected tab",
    "Form input values",
  ];

  const sharedStateExamples: readonly string[] = [
    "Theme preference",
    "Current application language",
    "Shared UI selections",
    "Application-level preferences",
  ];

  return (
    <section>
      <h2>1. Local Client State</h2>
      <CounterStateExample initialCount={0} />

      <h2>2. Boolean UI State</h2>
      <ToggleStateExample initialOpen={false} />

      <h2>3. Selection State</h2>
      <SelectionStateExample options={["Overview", "Details", "Settings"]} initialSelection="Overview" />

      <h2>4. Local Client-State Examples</h2>
      <ClientStateCategory
        title="Component-local state"
        description="State used primarily by one component to control its own behavior or presentation."
        examples={localStateExamples}
      />

      <h2>5. Shared Client-State Examples</h2>
      <ClientStateCategory
        title="Shared application state"
        description="State that multiple components need to read or update within an application."
        examples={sharedStateExamples}
      />
    </section>
  );
};

export default ClientStateDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Client state is application-owned data used to control client-side behavior and UI.
// Examples include dialog visibility, selected tabs, form values, and local preferences.
// Client state can be local to one component or shared across multiple components.
// React useState is one mechanism for storing component-local client state.
// Functional state updates are useful when the next state depends on the previous state.
// Client state is different from server state because the client generally owns its lifecycle.
// Server state is owned by a remote system and must be synchronized with that system.
// The physical storage location alone does not determine whether data is client state.
// The important distinction is ownership and whether synchronization with an external source is required.
// Client-state architecture determines how state is scoped, shared, persisted, and updated.
