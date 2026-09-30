/**
 * Context Default Value
 * =====================
 *
 * The default value argument passed to createContext is used exclusively when a component consumes
 * context without a matching Provider ancestor in the component tree. It provides a reliable fallback
 * that allows components to render safely in isolation or during unit testing.
 *
 * Passing an explicit object as the default value establishes a fallback state payload. Provider
 * components override this default value for all downstream descendant components within their tree.
 */

import React, { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UserSettings {
  readonly theme: string;
  readonly notificationsEnabled: boolean;
}

// ---------------------------------------------------------------------
// 2. Context Creation with Default Value
// ---------------------------------------------------------------------

export const defaultSettings: UserSettings = {
  theme: "system-default",
  notificationsEnabled: true,
};

export const SettingsContext = createContext<UserSettings>(defaultSettings);

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const SettingsCard: React.FC = () => {
  // Consumes context: Falls back to defaultSettings if no Provider ancestor exists
  const settings = useContext(SettingsContext);

  return (
    <div>
      <h4>User Settings Panel</h4>
      <p>Theme: {settings.theme}</p>
      <p>Notifications: {settings.notificationsEnabled ? "Enabled" : "Disabled"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const ContextDefaultValueContainer: React.FC = () => {
  const [customSettings, setCustomSettings] = useState<UserSettings>({
    theme: "dark-mode",
    notificationsEnabled: false,
  });

  const handleToggleNotifications = (): void => {
    setCustomSettings((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  };

  return (
    <div>
      <h1>15 - Context Default Value</h1>

      <h2>1. Unwrapped Consumer Component (Using Context Default Value)</h2>
      <SettingsCard />

      <h2>2. Wrapped Consumer Component (Overriding Default via Provider)</h2>
      <SettingsContext.Provider value={customSettings}>
        <SettingsCard />
      </SettingsContext.Provider>

      <button type="button" onClick={handleToggleNotifications}>
        Toggle Provider Notification Setting
      </button>
    </div>
  );
};

export default ContextDefaultValueContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Context default values are used only when no matching Provider exists above the consumer.
// - Default values enable components to render safely in isolation without Provider wrappers.
// - Passing explicit value props to a Provider overrides the context default value entirely.
// - Passing undefined as a Provider value does not trigger fallback to the default value.
// - Default context values facilitate unit testing and decoupled component development.
