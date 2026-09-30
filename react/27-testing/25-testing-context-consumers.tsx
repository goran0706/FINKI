/**
 * Testing Context Consumers
 * ==========================
 *
 * Context consumers read shared values from a React context, either directly
 * with `useContext` or through a custom hook. Tests should verify how consumers
 * respond to provided context values, actions, and changes without depending
 * on the internal context implementation.
 */

import { createContext, type FC, type ReactElement, type ReactNode, useContext } from "react";

// ---------------------------------------------------------------------
// 1. Basic context consumer
// ---------------------------------------------------------------------

interface ThemeContextValue {
  readonly theme: "light" | "dark";
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeLabel: FC = (): ReactElement => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("ThemeLabel must be used within ThemeContext");
  }

  return <p>Theme: {context.theme}</p>;
};

// A consumer test provides the context value explicitly:
//
// render(
//     <ThemeContext.Provider value={{theme: "dark"}}>
//         <ThemeLabel />
//     </ThemeContext.Provider>,
// );
//
// expect(screen.getByText("Theme: dark")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 2. Testing different context values
// ---------------------------------------------------------------------

// Consumers should render according to the value supplied by the provider:
//
// const {rerender} = render(
//     <ThemeContext.Provider value={{theme: "light"}}>
//         <ThemeLabel />
//     </ThemeContext.Provider>,
// );
//
// expect(screen.getByText("Theme: light")).toBeInTheDocument();
//
// rerender(
//     <ThemeContext.Provider value={{theme: "dark"}}>
//         <ThemeLabel />
//     </ThemeContext.Provider>,
// );
//
// expect(screen.getByText("Theme: dark")).toBeInTheDocument();
//
// `rerender` is useful for testing how a consumer responds when the context
// value changes.

// ---------------------------------------------------------------------
// 3. Consumer with a custom hook
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserContextValue {
  readonly user: User;
}

export const UserContext = createContext<UserContextValue | null>(null);

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser must be used within UserContext");
  }

  return context;
};

export const UserGreeting: FC = (): ReactElement => {
  const { user } = useUser();

  return <p>Hello, {user.name}</p>;
};

// The consumer can be tested through its rendered result:
//
// render(
//     <UserContext.Provider value={{user: {name: "John Doe"}}}>
//         <UserGreeting />
//     </UserContext.Provider>,
// );
//
// expect(screen.getByText("Hello, John Doe")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 4. Testing multiple context values
// ---------------------------------------------------------------------

interface LocaleContextValue {
  readonly locale: "en" | "de";
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export const UserDetails: FC = (): ReactElement => {
  const { user } = useUser();
  const localeContext = useContext(LocaleContext);

  if (localeContext === null) {
    throw new Error("UserDetails must be used within LocaleContext");
  }

  return (
    <section>
      <p>User: {user.name}</p>
      <p>Locale: {localeContext.locale}</p>
    </section>
  );
};

// A component consuming multiple contexts needs both providers:
//
// render(
//     <UserContext.Provider value={{user: {name: "John Doe"}}}>
//         <LocaleContext.Provider value={{locale: "en"}}>
//             <UserDetails />
//         </LocaleContext.Provider>
//     </UserContext.Provider>,
// );
//
// expect(screen.getByText("User: John Doe")).toBeInTheDocument();
// expect(screen.getByText("Locale: en")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 5. Testing a consumer action
// ---------------------------------------------------------------------

interface PreferencesContextValue {
  readonly notificationsEnabled: boolean;
  readonly toggleNotifications: () => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export const NotificationPreference: FC = (): ReactElement => {
  const context = useContext(PreferencesContext);

  if (context === null) {
    throw new Error("NotificationPreference must be used within PreferencesContext");
  }

  return (
    <>
      <output aria-label="Notification status">{context.notificationsEnabled ? "Enabled" : "Disabled"}</output>
      <button type="button" onClick={context.toggleNotifications}>
        Toggle notifications
      </button>
    </>
  );
};

// Provide a controlled context value and callback:
//
// const toggleNotifications = vi.fn();
//
// render(
//     <PreferencesContext.Provider
//         value={{
//             notificationsEnabled: true,
//             toggleNotifications,
//         }}
//     >
//         <NotificationPreference />
//     </PreferencesContext.Provider>,
// );
//
// expect(screen.getByLabelText("Notification status")).toHaveTextContent(
//     "Enabled",
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Toggle notifications"}),
// );
//
// expect(toggleNotifications).toHaveBeenCalledTimes(1);
//
// The test verifies that the consumer invokes the action supplied by context.

// ---------------------------------------------------------------------
// 6. Testing context-driven rendering
// ---------------------------------------------------------------------

interface AccessContextValue {
  readonly canEdit: boolean;
}

export const AccessContext = createContext<AccessContextValue | null>(null);

export const EditControl: FC = (): ReactElement => {
  const context = useContext(AccessContext);

  if (context === null) {
    throw new Error("EditControl must be used within AccessContext");
  }

  if (!context.canEdit) {
    return <p>Read only</p>;
  }

  return <button type="button">Edit</button>;
};

// Context values can determine which UI is rendered:
//
// render(
//     <AccessContext.Provider value={{canEdit: false}}>
//         <EditControl />
//     </AccessContext.Provider>,
// );
//
// expect(screen.getByText("Read only")).toBeInTheDocument();
// expect(screen.queryByRole("button", {name: "Edit"})).not.toBeInTheDocument();

// ---------------------------------------------------------------------
// 7. Testing the alternative context state
// ---------------------------------------------------------------------

// Test the other branch independently:
//
// render(
//     <AccessContext.Provider value={{canEdit: true}}>
//         <EditControl />
//     </AccessContext.Provider>,
// );
//
// expect(screen.getByRole("button", {name: "Edit"})).toBeInTheDocument();
// expect(screen.queryByText("Read only")).not.toBeInTheDocument();
//
// Each test establishes the context state explicitly rather than relying
// on a provider's default configuration.

// ---------------------------------------------------------------------
// 8. Testing a consumer with nested components
// ---------------------------------------------------------------------

export const UserCard: FC = (): ReactElement => {
  return (
    <article>
      <UserGreeting />
    </article>
  );
};

// Context flows through ordinary component boundaries:
//
// render(
//     <UserContext.Provider value={{user: {name: "John Doe"}}}>
//         <UserCard />
//     </UserContext.Provider>,
// );
//
// expect(screen.getByText("Hello, John Doe")).toBeInTheDocument();
//
// The intermediate `UserCard` does not need to receive the context value as a prop.

// ---------------------------------------------------------------------
// 9. Testing missing provider behavior
// ---------------------------------------------------------------------

// If the consumer explicitly requires a provider, its missing-provider behavior
// should be tested:
//
// expect(() => render(<UserGreeting />)).toThrow(
//     "useUser must be used within UserContext",
// );
//
// This verifies the contract established by the custom hook.

// ---------------------------------------------------------------------
// 10. Testing context updates
// ---------------------------------------------------------------------

// A consumer should respond when its context value changes:
//
// const {rerender} = render(
//     <UserContext.Provider value={{user: {name: "John Doe"}}}>
//         <UserGreeting />
//     </UserContext.Provider>,
// );
//
// expect(screen.getByText("Hello, John Doe")).toBeInTheDocument();
//
// rerender(
//     <UserContext.Provider value={{user: {name: "Jane Doe"}}}>
//         <UserGreeting />
//     </UserContext.Provider>,
// );
//
// expect(screen.getByText("Hello, Jane Doe")).toBeInTheDocument();
//
// This verifies that the consumer reads the current context value rather than
// retaining an obsolete value.

// ---------------------------------------------------------------------
// 11. Testing context without testing the provider
// ---------------------------------------------------------------------

// A consumer test does not need the real provider implementation.
//
// const contextValue = {
//     user: {name: "John Doe"},
// };
//
// render(
//     <UserContext.Provider value={contextValue}>
//         <UserGreeting />
//     </UserContext.Provider>,
// );
//
// The context provider supplied by React can be used directly to isolate the
// consumer from the provider's own implementation.

// ---------------------------------------------------------------------
// 12. Testing a consumer with a test wrapper
// ---------------------------------------------------------------------

interface TestUserProviderProps {
  readonly children: ReactNode;
}

export const TestUserProvider: FC<TestUserProviderProps> = ({ children }): ReactElement => {
  return <UserContext.Provider value={{ user: { name: "John Doe" } }}>{children}</UserContext.Provider>;
};

// A reusable wrapper can simplify tests that repeatedly require the same
// context setup:
//
// render(<UserGreeting />, {wrapper: TestUserProvider});
//
// Keep the wrapper explicit and focused on the context required by the test.

// ---------------------------------------------------------------------
// 13. Testing several consumers
// ---------------------------------------------------------------------

export const AccountSummary: FC = (): ReactElement => {
  const { user } = useUser();

  return (
    <section>
      <h2>Account</h2>
      <p>{user.name}</p>
      <UserGreeting />
    </section>
  );
};

// Multiple consumers should receive the same context value:
//
// render(
//     <UserContext.Provider value={{user: {name: "John Doe"}}}>
//         <AccountSummary />
//     </UserContext.Provider>,
// );
//
// expect(screen.getByRole("heading", {name: "Account"})).toBeInTheDocument();
// expect(screen.getAllByText("John Doe")).toHaveLength(2);

// ---------------------------------------------------------------------
// 14. Testing consumer behavior instead of context internals
// ---------------------------------------------------------------------

// Avoid assertions about the internal React context object:
//
// expect(UserContext._currentValue).toEqual(...);
//
// This is an implementation detail and should not be part of a component test.
//
// Prefer:
//
// expect(screen.getByText("Hello, John Doe")).toBeInTheDocument();
//
// The test should verify what the consumer does with the context value.

// ---------------------------------------------------------------------
// 15. Testing context-driven accessibility
// ---------------------------------------------------------------------

interface DensityContextValue {
  readonly density: "comfortable" | "compact";
}

export const DensityContext = createContext<DensityContextValue | null>(null);

export const ContentPanel: FC = (): ReactElement => {
  const context = useContext(DensityContext);

  if (context === null) {
    throw new Error("ContentPanel must be used within DensityContext");
  }

  return (
    <section aria-label="Content panel" data-density={context.density}>
      Content
    </section>
  );
};

// The consumer's accessible behavior and relevant DOM state can be tested:
//
// render(
//     <DensityContext.Provider value={{density: "compact"}}>
//         <ContentPanel />
//     </DensityContext.Provider>,
// );
//
// expect(screen.getByRole("region", {name: "Content panel"})).toHaveAttribute(
//     "data-density",
//     "compact",
// );

// ---------------------------------------------------------------------
// 16. Consumer testing with user interaction
// ---------------------------------------------------------------------

// Context often supplies both state and actions:
//
// const user = userEvent.setup();
//
// render(
//     <PreferencesContext.Provider
//         value={{
//             notificationsEnabled: true,
//             toggleNotifications,
//         }}
//     >
//         <NotificationPreference />
//     </PreferencesContext.Provider>,
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Toggle notifications"}),
// );
//
// expect(toggleNotifications).toHaveBeenCalled();
//
// This verifies the consumer's interaction with the context contract.

// ---------------------------------------------------------------------
// 17. Consumer tests versus provider tests
// ---------------------------------------------------------------------

// A consumer test asks:
//
// "What does this component do with the context value it receives?"
//
// A provider test asks:
//
// "What value and behavior does this provider expose to its descendants?"
//
// For a consumer, provide controlled context values:
//
// <UserContext.Provider value={{user: {name: "John Doe"}}}>
//     <UserGreeting />
// </UserContext.Provider>
//
// This keeps the consumer test focused on the consumer.

// ---------------------------------------------------------------------
// 18. Complete consumer testing flow
// ---------------------------------------------------------------------

// A typical context-consumer test follows this sequence:
//
// 1. Define the context value required by the consumer.
// 2. Render the consumer inside the context provider.
// 3. Assert the initial rendered behavior.
// 4. Perform relevant user interactions.
// 5. Assert the resulting behavior.
//
// Example:
//
// const toggleNotifications = vi.fn();
//
// render(
//     <PreferencesContext.Provider
//         value={{
//             notificationsEnabled: true,
//             toggleNotifications,
//         }}
//     >
//         <NotificationPreference />
//     </PreferencesContext.Provider>,
// );
//
// expect(screen.getByLabelText("Notification status")).toHaveTextContent(
//     "Enabled",
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Toggle notifications"}),
// );
//
// expect(toggleNotifications).toHaveBeenCalledTimes(1);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Test consumers by providing explicit context values and observing their behavior.
// - Use the context provider directly to isolate a consumer from provider implementation.
// - Test different context values when they produce different UI behavior.
// - Test context actions through realistic user interactions.
// - Use `rerender` to verify that consumers respond to changed context values.
// - Test missing-provider behavior when the consumer explicitly requires a provider.
// - Use wrappers when the same context setup is needed across many tests.
// - Test multiple context dependencies by providing each required context.
// - Prefer rendered behavior over assertions about React context internals.
// - Keep consumer tests focused on how the component uses the context contract.
