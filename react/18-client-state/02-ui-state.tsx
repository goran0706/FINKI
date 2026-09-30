/**
 * UI State
 * ========
 *
 * UI state is client-side state that directly controls how an interface is displayed or behaves.
 * It describes transient presentation concerns such as whether a dialog is open, which tab is
 * active, whether a menu is expanded, which item is selected, or whether a control is disabled.
 *
 * UI state is usually local to the component or feature that owns the corresponding interface.
 * It should generally contain the minimum information needed to derive the rendered UI rather than
 * duplicating values that can already be derived from other state or props.
 *
 * UI state is distinct from server data. A dialog's open state, selected tab, and expanded menu
 * are owned by the client and can change immediately in response to user interaction without
 * requiring a request to a remote server.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DialogStateExampleProps {
  readonly title: string;
}

export interface TabsStateExampleProps {
  readonly tabs: readonly string[];
  readonly initialTab: string;
}

export interface MenuStateExampleProps {
  readonly items: readonly string[];
}

export interface DisclosureStateExampleProps {
  readonly title: string;
  readonly content: string;
}

export interface LoadingStateExampleProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const DialogStateExample: FC<DialogStateExampleProps> = ({ title }): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDialog = (): void => {
    setIsOpen(true);
  };

  const closeDialog = (): void => {
    setIsOpen(false);
  };

  return (
    <div>
      <p>Dialog: {isOpen ? "open" : "closed"}</p>
      <button type="button" onClick={openDialog}>
        Open dialog
      </button>

      {isOpen && (
        <div role="dialog" aria-modal="true">
          <h3>{title}</h3>
          <p>This dialog is controlled entirely by UI state.</p>
          <button type="button" onClick={closeDialog}>
            Close dialog
          </button>
        </div>
      )}
    </div>
  );
};

export const TabsStateExample: FC<TabsStateExampleProps> = ({ tabs, initialTab }): ReactElement => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  return (
    <div>
      <div role="tablist" aria-label="Example tabs">
        {tabs.map((tab: string) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => {
              setActiveTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <p>Active tab: {activeTab}</p>
    </div>
  );
};

export const MenuStateExample: FC<MenuStateExampleProps> = ({ items }): ReactElement => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsExpanded((currentIsExpanded: boolean): boolean => !currentIsExpanded);
  };

  return (
    <div>
      <button type="button" aria-expanded={isExpanded} onClick={toggleMenu}>
        Menu
      </button>

      {isExpanded && (
        <ul>
          {items.map((item: string) => (
            <li key={item}>
              <button type="button">{item}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const DisclosureStateExample: FC<DisclosureStateExampleProps> = ({ title, content }): ReactElement => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => {
          setIsExpanded((currentIsExpanded: boolean): boolean => !currentIsExpanded);
        }}
      >
        {title}
      </button>

      {isExpanded && <p>{content}</p>}
    </div>
  );
};

export const LoadingStateExample: FC<LoadingStateExampleProps> = ({ label }): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleLoading = (): void => {
    setIsLoading((currentIsLoading: boolean): boolean => !currentIsLoading);
  };

  return (
    <div>
      <p>Status: {isLoading ? "loading" : "idle"}</p>
      <button type="button" onClick={toggleLoading} disabled={isLoading}>
        {isLoading ? `${label}...` : label}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UiStateDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Dialog Visibility UI State</h2>
      <DialogStateExample title="Example dialog" />

      <h2>2. Active Tab UI State</h2>
      <TabsStateExample tabs={["Overview", "Details", "Settings"]} initialTab="Overview" />

      <h2>3. Expandable Menu UI State</h2>
      <MenuStateExample items={["Profile", "Preferences", "Sign out"]} />

      <h2>4. Disclosure UI State</h2>
      <DisclosureStateExample
        title="Show details"
        content="This content is displayed when the disclosure is expanded."
      />

      <h2>5. Loading UI State</h2>
      <LoadingStateExample label="Start loading" />
    </section>
  );
};

export default UiStateDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// UI state is client-side state that controls presentation or interaction behavior.
// Common UI state includes dialog visibility, active tabs, expanded menus, and loading indicators.
// UI state is usually transient and belongs to the component or feature that uses it.
// A boolean state value is appropriate when the UI has two meaningful states.
// A selected value can represent mutually exclusive UI choices such as active tabs.
// Functional state updates are useful when toggling a boolean from its previous value.
// UI state should contain the minimum information necessary to represent the interface.
// Values that can be derived from existing state do not need to be stored as additional state.
// UI state is client-owned and does not require server synchronization simply to change the interface.
