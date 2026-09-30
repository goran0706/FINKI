/**
 * Testing Context Providers
 * ==========================
 *
 * Context providers make shared values available to components through the React
 * context API. Provider tests should verify the value exposed to consumers and
 * the behavior of the provider when its inputs or state change.
 */

import { createContext, type FC, type ReactElement, type ReactNode, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Basic context
// ---------------------------------------------------------------------

interface ThemeContextValue {
  readonly theme: "light" | "dark";
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};

// ---------------------------------------------------------------------
// 2. Basic provider
// ---------------------------------------------------------------------

interface ThemeProviderProps {
  readonly theme: ThemeContextValue["theme"];
  readonly children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ theme, children }): ReactElement => {
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

// A provider test should usually verify what a consumer receives:
//
// const Consumer = (): ReactElement => {
//     const {theme} = useTheme();
//
//     return <output aria-label="Current theme">{theme}</output>;
// };
//
// render(
//     <ThemeProvider theme="dark">
//         <Consumer />
//     </ThemeProvider>,
// );
//
// expect(screen.getByLabelText("Current theme")).toHaveTextContent("dark");

// ---------------------------------------------------------------------
// 3. Testing provider props
// ---------------------------------------------------------------------

// Provider props should be reflected in the consumer:
//
// const {rerender} = render(
//     <ThemeProvider theme="light">
//         <Consumer />
//     </ThemeProvider>,
// );
//
// expect(screen.getByLabelText("Current theme")).toHaveTextContent("light");
//
// rerender(
//     <ThemeProvider theme="dark">
//         <Consumer />
//     </ThemeProvider>,
// );
//
// expect(screen.getByLabelText("Current theme")).toHaveTextContent("dark");

// ---------------------------------------------------------------------
// 4. Provider with state
// ---------------------------------------------------------------------

interface PreferencesContextValue {
  readonly notificationsEnabled: boolean;
  readonly toggleNotifications: () => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export const usePreferences = (): PreferencesContextValue => {
  const context = useContext(PreferencesContext);

  if (context === null) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }

  return context;
};

interface PreferencesProviderProps {
  readonly children: ReactNode;
}

export const PreferencesProvider: FC<PreferencesProviderProps> = ({ children }): ReactElement => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = (): void => {
    setNotificationsEnabled((enabled) => !enabled);
  };

  return (
    <PreferencesContext.Provider value={{ notificationsEnabled, toggleNotifications }}>
      {children}
    </PreferencesContext.Provider>
  );
};

// A provider with internal state should be tested through a consumer:
//
// const Consumer = (): ReactElement => {
//     const {notificationsEnabled, toggleNotifications} = usePreferences();
//
//     return (
//         <>
//             <output aria-label="Notification status">
//                 {notificationsEnabled ? "Enabled" : "Disabled"}
//             </output>
//             <button type="button" onClick={toggleNotifications}>
//                 Toggle notifications
//             </button>
//         </>
//     );
// };
//
// render(
//     <PreferencesProvider>
//         <Consumer />
//     </PreferencesProvider>,
// );
//
// expect(screen.getByLabelText("Notification status")).toHaveTextContent("Enabled");
//
// await user.click(
//     screen.getByRole("button", {name: "Toggle notifications"}),
// );
//
// expect(screen.getByLabelText("Notification status")).toHaveTextContent("Disabled");

// ---------------------------------------------------------------------
// 5. Testing provider state transitions
// ---------------------------------------------------------------------

// The test should verify the externally observable transition:
//
// initial context value
//        ↓
// user interaction
//        ↓
// provider state update
//        ↓
// consumer receives new context value
//
// This tests the provider without accessing its internal `useState` call.

// ---------------------------------------------------------------------
// 6. Provider with derived values
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserContextValue {
  readonly user: User;
  readonly displayName: string;
}

export const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  readonly user: User;
  readonly children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ user, children }): ReactElement => {
  const value: UserContextValue = {
    user,
    displayName: user.name,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
};

// Test derived context values through the consumer:
//
// const Consumer = (): ReactElement => {
//     const {displayName} = useUser();
//
//     return <p>{displayName}</p>;
// };
//
// render(
//     <UserProvider user={{name: "John Doe"}}>
//         <Consumer />
//     </UserProvider>,
// );
//
// expect(screen.getByText("John Doe")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 7. Testing nested consumers
// ---------------------------------------------------------------------

// Context values should be available to descendants at any depth:
//
// const NestedConsumer = (): ReactElement => {
//     const {theme} = useTheme();
//
//     return <output>{theme}</output>;
// };
//
// const Container = (): ReactElement => {
//     return (
//         <section>
//             <div>
//                 <NestedConsumer />
//             </div>
//         </section>
//     );
// };
//
// render(
//     <ThemeProvider theme="dark">
//         <Container />
//     </ThemeProvider>,
// );
//
// expect(screen.getByRole("status")).toHaveTextContent("dark");

// ---------------------------------------------------------------------
// 8. Testing provider boundaries
// ---------------------------------------------------------------------

// A consumer outside the provider should not silently receive a valid value
// when the custom hook is designed to require the provider.
//
// expect(() => render(<Consumer />)).toThrow(
//     "useTheme must be used within ThemeProvider",
// );
//
// Testing this boundary verifies that the provider is required when that
// requirement is part of the hook's contract.

// ---------------------------------------------------------------------
// 9. Testing multiple providers
// ---------------------------------------------------------------------

interface LocaleContextValue {
  readonly locale: "en" | "de";
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  readonly locale: LocaleContextValue["locale"];
  readonly children: ReactNode;
}

const LocaleProvider: FC<LocaleProviderProps> = ({ locale, children }): ReactElement => {
  return <LocaleContext.Provider value={{ locale }}>{children}</LocaleContext.Provider>;
};

// Providers can be composed when a component depends on several contexts:
//
// render(
//     <ThemeProvider theme="dark">
//         <LocaleProvider locale="en">
//             <Consumer />
//         </LocaleProvider>
//     </ThemeProvider>,
// );
//
// The test should provide the same relevant environment that the component
// expects in the application.

// ---------------------------------------------------------------------
// 10. Provider wrapper helper
// ---------------------------------------------------------------------

interface TestProvidersProps {
  readonly children: ReactNode;
}

export const TestProviders: FC<TestProvidersProps> = ({ children }): ReactElement => {
  return (
    <ThemeProvider theme="dark">
      <PreferencesProvider>{children}</PreferencesProvider>
    </ThemeProvider>
  );
};

// A shared wrapper can simplify tests for components that always require the
// same provider environment:
//
// render(<Component />, {wrapper: TestProviders});
//
// The wrapper should represent a meaningful application or test environment.
// It should not hide which providers a test actually depends on.

// ---------------------------------------------------------------------
// 11. Testing configurable providers
// ---------------------------------------------------------------------

interface AppProviderProps {
  readonly theme: ThemeContextValue["theme"];
  readonly children: ReactNode;
}

export const AppProvider: FC<AppProviderProps> = ({ theme, children }): ReactElement => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

// Configurable providers make different context states explicit:
//
// render(
//     <AppProvider theme="light">
//         <Consumer />
//     </AppProvider>,
// );
//
// expect(screen.getByLabelText("Current theme")).toHaveTextContent("light");
//
// rerender(
//     <AppProvider theme="dark">
//         <Consumer />
//     </AppProvider>,
// );
//
// expect(screen.getByLabelText("Current theme")).toHaveTextContent("dark");

// ---------------------------------------------------------------------
// 12. Testing context actions
// ---------------------------------------------------------------------

// If a provider exposes actions, test the action through a user interaction:
//
// const user = userEvent.setup();
//
// render(
//     <PreferencesProvider>
//         <Consumer />
//     </PreferencesProvider>,
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Toggle notifications"}),
// );
//
// expect(screen.getByLabelText("Notification status")).toHaveTextContent(
//     "Disabled",
// );
//
// The test verifies the complete path from interaction to provider state
// to the consumer's rendered result.

// ---------------------------------------------------------------------
// 13. Testing provider updates
// ---------------------------------------------------------------------

// A provider may receive changing props from its parent:
//
// const {rerender} = render(
//     <UserProvider user={{name: "John Doe"}}>
//         <Consumer />
//     </UserProvider>,
// );
//
// expect(screen.getByText("John Doe")).toBeInTheDocument();
//
// rerender(
//     <UserProvider user={{name: "Jane Doe"}}>
//         <Consumer />
//     </UserProvider>,
// );
//
// expect(screen.getByText("Jane Doe")).toBeInTheDocument();
//
// This verifies that the provider publishes updated context values when its
// inputs change.

// ---------------------------------------------------------------------
// 14. Testing providers with renderHook
// ---------------------------------------------------------------------

// Context-dependent hooks can also be tested directly with `renderHook`:
//
// const wrapper = ({children}: {children: ReactNode}): ReactElement => (
//     <ThemeProvider theme="dark">{children}</ThemeProvider>
// );
//
// const {result} = renderHook(() => useTheme(), {wrapper});
//
// expect(result.current.theme).toBe("dark");
//
// This is useful when the custom hook itself is the subject of the test.
// Component tests remain useful when the context value affects rendered UI.

// ---------------------------------------------------------------------
// 15. Avoid testing context implementation details
// ---------------------------------------------------------------------

// Avoid testing internal provider variables:
//
// expect(providerState.notificationsEnabled).toBe(true);
//
// The state variable is not part of the provider's public contract.
//
// Prefer testing what consumers receive:
//
// expect(screen.getByLabelText("Notification status")).toHaveTextContent(
//     "Enabled",
// );
//
// Context tests should focus on the provider-consumer contract and observable
// behavior rather than the provider's internal implementation.

// ---------------------------------------------------------------------
// 16. Complete provider testing flow
// ---------------------------------------------------------------------

// A typical provider test follows this structure:
//
// 1. Create or render a consumer.
// 2. Wrap it with the required provider.
// 3. Assert the initial context value.
// 4. Perform relevant user interactions.
// 5. Assert the resulting consumer behavior.
//
// Example:
//
// render(
//     <PreferencesProvider>
//         <Consumer />
//     </PreferencesProvider>,
// );
//
// expect(screen.getByLabelText("Notification status")).toHaveTextContent("Enabled");
//
// await user.click(
//     screen.getByRole("button", {name: "Toggle notifications"}),
// );
//
// expect(screen.getByLabelText("Notification status")).toHaveTextContent("Disabled");

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Test providers through the values and actions exposed to consumers.
// - Render consumers inside the provider to verify the context contract.
// - Use `rerender` to test provider responses to changing props.
// - Test provider state through observable consumer behavior.
// - Use wrapper components when a hook or component requires provider context.
// - Test missing-provider behavior when the custom hook explicitly requires a provider.
// - Compose multiple providers when the component depends on multiple contexts.
// - `renderHook` is useful when the context-consuming hook itself is the test subject.
// - Avoid assertions against internal provider state or implementation details.
