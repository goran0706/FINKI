/**
 * Compound Components
 * ====================
 *
 * Compound components are a group of components designed to work together as a single
 * component API. A parent component coordinates shared state or behavior while child
 * components provide specialized parts of the interface through a declarative structure.
 */

// ---------------------------------------------------------------------
// 1. Basic compound component structure
// ---------------------------------------------------------------------

import { createContext, useContext, useState } from "react";
import { type FC, type ReactElement, type ReactNode } from "react";

interface TabsContextValue {
  readonly activeTab: string;
  readonly setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

interface TabsProps {
  readonly defaultTab: string;
  readonly children: ReactNode;
}

const Tabs: FC<TabsProps> = ({ defaultTab, children }): ReactElement => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  readonly children: ReactNode;
}

const TabList: FC<TabListProps> = ({ children }): ReactElement => {
  return <div role="tablist">{children}</div>;
};

interface TabProps {
  readonly value: string;
  readonly children: ReactNode;
}

const Tab: FC<TabProps> = ({ value, children }): ReactElement => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tab must be used inside Tabs.");
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button type="button" role="tab" aria-selected={isActive} onClick={() => setActiveTab(value)}>
      {children}
    </button>
  );
};

interface TabPanelProps {
  readonly value: string;
  readonly children: ReactNode;
}

const TabPanel: FC<TabPanelProps> = ({ value, children }): ReactElement | null => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("TabPanel must be used inside Tabs.");
  }

  if (context.activeTab !== value) {
    return null;
  }

  return <div role="tabpanel">{children}</div>;
};

// ---------------------------------------------------------------------
// 2. Declarative composition
// ---------------------------------------------------------------------

export const BasicTabsExample: FC = (): ReactElement => {
  return (
    <Tabs defaultTab="profile">
      <TabList>
        <Tab value="profile">Profile</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>

      <TabPanel value="profile">
        <h2>Profile</h2>
        <p>John Doe's profile information.</p>
      </TabPanel>

      <TabPanel value="settings">
        <h2>Settings</h2>
        <p>Account settings and preferences.</p>
      </TabPanel>
    </Tabs>
  );
};

// ---------------------------------------------------------------------
// 3. Compound components share parent state
// ---------------------------------------------------------------------

interface AccordionContextValue {
  readonly openItem: string | null;
  readonly setOpenItem: (item: string | null) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

interface AccordionProps {
  readonly defaultOpen?: string;
  readonly children: ReactNode;
}

const Accordion: FC<AccordionProps> = ({ defaultOpen, children }): ReactElement => {
  const [openItem, setOpenItem] = useState<string | null>(defaultOpen ?? null);

  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  readonly value: string;
  readonly children: ReactNode;
}

const AccordionItem: FC<AccordionItemProps> = ({ value, children }): ReactElement => {
  return <section data-value={value}>{children}</section>;
};

interface AccordionTriggerProps {
  readonly value: string;
  readonly children: ReactNode;
}

const AccordionTrigger: FC<AccordionTriggerProps> = ({ value, children }): ReactElement => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("AccordionTrigger must be used inside Accordion.");
  }

  const isOpen = context.openItem === value;

  const handleClick = (): void => {
    context.setOpenItem(isOpen ? null : value);
  };

  return (
    <button type="button" onClick={handleClick} aria-expanded={isOpen}>
      {children}
    </button>
  );
};

interface AccordionPanelProps {
  readonly value: string;
  readonly children: ReactNode;
}

const AccordionPanel: FC<AccordionPanelProps> = ({ value, children }): ReactElement | null => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error("AccordionPanel must be used inside Accordion.");
  }

  if (context.openItem !== value) {
    return null;
  }

  return <div>{children}</div>;
};

// ---------------------------------------------------------------------
// 4. Compound components can express relationships
// ---------------------------------------------------------------------

export const AccordionExample: FC = (): ReactElement => {
  return (
    <Accordion defaultOpen="account">
      <AccordionItem value="account">
        <AccordionTrigger value="account">Account</AccordionTrigger>
        <AccordionPanel value="account">
          <p>Account information and preferences.</p>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem value="notifications">
        <AccordionTrigger value="notifications">Notifications</AccordionTrigger>
        <AccordionPanel value="notifications">
          <p>Notification preferences.</p>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

// ---------------------------------------------------------------------
// 5. Parent state can coordinate specialized child components
// ---------------------------------------------------------------------

interface MenuContextValue {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

interface MenuProps {
  readonly children: ReactNode;
}

const Menu: FC<MenuProps> = ({ children }): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div>{children}</div>
    </MenuContext.Provider>
  );
};

interface MenuButtonProps {
  readonly children: ReactNode;
}

const MenuButton: FC<MenuButtonProps> = ({ children }): ReactElement => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("MenuButton must be used inside Menu.");
  }

  return (
    <button type="button" aria-expanded={context.open} onClick={() => context.setOpen(!context.open)}>
      {children}
    </button>
  );
};

interface MenuItemsProps {
  readonly children: ReactNode;
}

const MenuItems: FC<MenuItemsProps> = ({ children }): ReactElement | null => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("MenuItems must be used inside Menu.");
  }

  if (!context.open) {
    return null;
  }

  return <div role="menu">{children}</div>;
};

interface MenuItemProps {
  readonly children: ReactNode;
  readonly onSelect: () => void;
}

const MenuItem: FC<MenuItemProps> = ({ children, onSelect }): ReactElement => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("MenuItem must be used inside Menu.");
  }

  const handleClick = (): void => {
    onSelect();
    context.setOpen(false);
  };

  return (
    <button type="button" role="menuitem" onClick={handleClick}>
      {children}
    </button>
  );
};

// ---------------------------------------------------------------------
// 6. Compound APIs can keep related behavior together
// ---------------------------------------------------------------------

export const MenuExample: FC = (): ReactElement => {
  const handleProfile = (): void => {
    console.log("Opening profile.");
  };

  const handleSettings = (): void => {
    console.log("Opening settings.");
  };

  return (
    <Menu>
      <MenuButton>Account</MenuButton>

      <MenuItems>
        <MenuItem onSelect={handleProfile}>Profile</MenuItem>
        <MenuItem onSelect={handleSettings}>Settings</MenuItem>
      </MenuItems>
    </Menu>
  );
};

// ---------------------------------------------------------------------
// 7. Compound components can expose a flexible component API
// ---------------------------------------------------------------------

interface SelectContextValue {
  readonly value: string;
  readonly setValue: (value: string) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

interface SelectProps {
  readonly defaultValue: string;
  readonly children: ReactNode;
}

const Select: FC<SelectProps> = ({ defaultValue, children }): ReactElement => {
  const [value, setValue] = useState(defaultValue);

  return (
    <SelectContext.Provider value={{ value, setValue }}>
      <div>{children}</div>
    </SelectContext.Provider>
  );
};

interface SelectValueProps {
  readonly children: ReactNode;
}

const SelectValue: FC<SelectValueProps> = ({ children }): ReactElement => {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error("SelectValue must be used inside Select.");
  }

  return (
    <div>
      {children}: {context.value}
    </div>
  );
};

interface SelectOptionProps {
  readonly value: string;
  readonly children: ReactNode;
}

const SelectOption: FC<SelectOptionProps> = ({ value, children }): ReactElement => {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error("SelectOption must be used inside Select.");
  }

  const isSelected = context.value === value;

  return (
    <button type="button" aria-pressed={isSelected} onClick={() => context.setValue(value)}>
      {children}
    </button>
  );
};

// ---------------------------------------------------------------------
// 8. Complete compound component example
// ---------------------------------------------------------------------

export const SelectExample: FC = (): ReactElement => {
  return (
    <Select defaultValue="profile">
      <SelectValue>Selected section</SelectValue>

      <div>
        <SelectOption value="profile">Profile</SelectOption>
        <SelectOption value="settings">Settings</SelectOption>
        <SelectOption value="notifications">Notifications</SelectOption>
      </div>
    </Select>
  );
};

export const CompoundComponentsDemo: FC = (): ReactElement => {
  return (
    <main>
      <BasicTabsExample />
      <AccordionExample />
      <MenuExample />
      <SelectExample />
    </main>
  );
};

export default CompoundComponentsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Compound components are a group of related components that form one coordinated API.
// - The parent component owns shared state or behavior while specialized children consume that shared context.
// - Context allows compound children to communicate without requiring state to be passed through every intermediate element.
// - The child components remain declarative, so consumers describe relationships through component structure and props.
// - Compound components are useful when an API needs flexible composition while preserving shared behavior.
// - The parent establishes the coordination boundary, while each child is responsible for its own part of the interface.
// - Compound components should enforce meaningful usage boundaries when a child requires its parent context.
