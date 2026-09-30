/**
 * Shared Test Utilities
 * ======================
 *
 * Shared test utilities centralize repeated testing infrastructure such as custom render helpers,
 * test data factories, provider wrappers, and common interaction helpers. Well-designed utilities
 * remove repetitive setup without hiding the behavior or expectations that individual tests should express.
 */

import { createContext, useContext, useMemo, useState } from "react";
import type { FC, PropsWithChildren, ReactElement, ReactNode } from "react";
import { render, screen, type RenderOptions, type RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------
// 1. Test utilities should remove repetition
// ---------------------------------------------------------------------

// Repeated test infrastructure is a good candidate for a shared utility:
//
// render(
//     <ThemeProvider>
//         <AuthProvider>
//             <UserProfile />
//         </AuthProvider>
//     </ThemeProvider>,
// );
//
// If many tests require exactly the same provider configuration, a shared
// render helper can keep that infrastructure in one place.
//
// The helper should simplify infrastructure without hiding important inputs,
// interactions, or assertions.

// ---------------------------------------------------------------------
// 2. Test data factories
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export const createUser = (overrides: Partial<User> = {}): User => {
  return {
    id: "42",
    name: "John Doe",
    email: "john.doe@example.com",
    ...overrides,
  };
};

// A factory creates predictable test data while allowing individual tests to
// override only the properties relevant to that test.
//
// const user = createUser();
//
// const admin = createUser({
//     name: "Admin User",
// });
//
// const customUser = createUser({
//     email: "custom@example.com",
// });

// ---------------------------------------------------------------------
// 3. Factory defaults should be deterministic
// ---------------------------------------------------------------------

export const createProduct = (overrides: Partial<Product> = {}): Product => {
  return {
    id: "product-1",
    name: "Example Product",
    price: 100,
    ...overrides,
  };
};

interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

// Avoid hidden randomness or current time in shared factories:
//
// id: crypto.randomUUID()
// createdAt: new Date()
//
// Deterministic defaults make failures reproducible.

// ---------------------------------------------------------------------
// 4. Factory overrides
// ---------------------------------------------------------------------

const exampleUser = createUser({
  name: "Jane Doe",
});

// Only the name changes; the other defaults remain stable.
//
// expect(exampleUser).toEqual({
//     id: "42",
//     name: "Jane Doe",
//     email: "john.doe@example.com",
// });

// Overrides keep individual tests concise without requiring a separate factory
// for every possible test scenario.

// ---------------------------------------------------------------------
// 5. Avoid overly generic factories
// ---------------------------------------------------------------------

// A factory should represent a meaningful test object:
//
// createUser({
//     name: "John Doe",
// });
//
// Avoid factories whose API exposes many unrelated configuration options:
//
// createUser({
//     randomize: false,
//     databaseMode: "mock",
//     renderMode: "compact",
//     useLegacyFormat: true,
// });
//
// When a factory becomes responsible for unrelated concerns, separate utilities
// usually provide clearer ownership.

// ---------------------------------------------------------------------
// 6. Context used by a shared render helper
// ---------------------------------------------------------------------

interface ThemeContextValue {
  readonly theme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
});

interface ThemeProviderProps extends PropsWithChildren {
  readonly theme?: "light" | "dark";
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ theme = "light", children }): ReactElement => {
  const value = useMemo(() => ({ theme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  return useContext(ThemeContext);
};

// The provider is ordinary application infrastructure.
// The shared test utility can compose it around the component under test.

// ---------------------------------------------------------------------
// 7. Authentication context
// ---------------------------------------------------------------------

interface AuthContextValue {
  readonly user: User | null;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
});

interface AuthProviderProps extends PropsWithChildren {
  readonly user?: User | null;
}

export const AuthProvider: FC<AuthProviderProps> = ({ user = null, children }): ReactElement => {
  const value = useMemo(() => ({ user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  return useContext(AuthContext);
};

// Multiple providers can be composed inside a shared wrapper.

// ---------------------------------------------------------------------
// 8. Component using the providers
// ---------------------------------------------------------------------

export const UserSummary: FC = (): ReactElement => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <section aria-label="User summary">
      <h2>{user?.name ?? "Guest"}</h2>
      <p>{theme}</p>
    </section>
  );
};

// This component has meaningful test inputs:
//
// - authenticated versus unauthenticated user
// - light versus dark theme
//
// The shared render helper should make those infrastructure options easy to configure.

// ---------------------------------------------------------------------
// 9. Provider wrapper
// ---------------------------------------------------------------------

interface ProviderOptions {
  readonly theme?: "light" | "dark";
  readonly user?: User | null;
}

export const createTestWrapper = (options: ProviderOptions = {}): FC<PropsWithChildren> => {
  const { theme = "light", user = null } = options;

  const Wrapper: FC<PropsWithChildren> = ({ children }): ReactElement => {
    return (
      <ThemeProvider theme={theme}>
        <AuthProvider user={user}>{children}</AuthProvider>
      </ThemeProvider>
    );
  };

  return Wrapper;
};

// A wrapper is useful when the same provider hierarchy is needed by many tests.

// ---------------------------------------------------------------------
// 10. Custom render helper
// ---------------------------------------------------------------------

export interface CustomRenderOptions extends Omit<RenderOptions, "wrapper">, ProviderOptions {}

export const renderWithProviders = (ui: ReactElement, options: CustomRenderOptions = {}): RenderResult => {
  const { theme = "light", user = null, ...renderOptions } = options;

  return render(ui, {
    ...renderOptions,
    wrapper: createTestWrapper({
      theme,
      user,
    }),
  });
};

// The helper preserves Testing Library's normal RenderResult while adding
// application-specific provider configuration.
//
// Example:
//
// renderWithProviders(
//     <UserSummary />,
//     {
//         theme: "dark",
//         user: createUser(),
//     },
// );
//
// The test can then continue using `screen` or the returned query methods.

// ---------------------------------------------------------------------
// 11. Preserve standard render options
// ---------------------------------------------------------------------

// Custom helpers should not unnecessarily remove Testing Library options:
//
// renderWithProviders(
//     <UserSummary />,
//     {
//         container,
//         baseElement,
//         hydrate: false,
//         theme: "dark",
//     },
// );
//
// `RenderOptions` allows the helper to remain compatible with standard render
// configuration while adding only the options owned by the helper.

// ---------------------------------------------------------------------
// 12. Do not hide important component props
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return <h1>Hello, {name}</h1>;
};

// Keep meaningful component inputs in the test:
//
// renderWithProviders(
//     <Greeting name="John Doe" />,
// );
//
// Avoid a helper such as:
//
// renderDefaultGreeting();
//
// when the name is an important part of the scenario.
//
// Shared utilities should hide infrastructure, not test intent.

// ---------------------------------------------------------------------
// 13. Shared interaction helpers
// ---------------------------------------------------------------------

export const createUserInteraction = () => {
  return userEvent.setup();
};

// A shared interaction factory can standardize interaction configuration:
//
// const user = createUserInteraction();
//
// await user.click(
//     screen.getByRole("button", {name: "Save"}),
// );
//
// Keep the returned user object test-local. Do not share one interaction instance
// between unrelated tests.

// ---------------------------------------------------------------------
// 14. Why user-event belongs in a helper
// ---------------------------------------------------------------------

// A project may need common configuration:
//
// const user = userEvent.setup({
//     advanceTimers: vi.advanceTimersByTime,
// });
//
// A project-specific helper can centralize that configuration.
//
// The important distinction is:
//
// shared configuration
//     -> good candidate for a utility
//
// test-specific interaction sequence
//     -> belongs in the individual test

// ---------------------------------------------------------------------
// 15. Assertion helpers
// ---------------------------------------------------------------------

export const expectUserName = (name: string): void => {
  expect(screen.getByRole("heading", { name })).toBeInTheDocument();
};

// Assertion helpers can be useful when the same semantic assertion appears
// repeatedly and its meaning remains obvious from the helper name.
//
// expectUserName("John Doe");
//
// Avoid helpers with vague names such as `checkSomething()`.

// ---------------------------------------------------------------------
// 16. Avoid over-abstracting assertions
// ---------------------------------------------------------------------

// This is usually less expressive:
//
// assertUserState(user, "valid");
//
// when the test actually needs to communicate:
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// A shared assertion is most useful when it represents a stable, meaningful
// domain concept that would otherwise be repeated many times.

// ---------------------------------------------------------------------
// 17. Form data helpers
// ---------------------------------------------------------------------

interface ProfileFormData {
  readonly name: string;
  readonly email: string;
}

export const createProfileFormData = (overrides: Partial<ProfileFormData> = {}): ProfileFormData => {
  return {
    name: "John Doe",
    email: "john.doe@example.com",
    ...overrides,
  };
};

// Factories for form data keep valid baseline values in one place while allowing
// tests to create invalid or edge-case values explicitly.

// ---------------------------------------------------------------------
// 18. Specialized scenario helpers
// ---------------------------------------------------------------------

export const createAuthenticatedUser = (overrides: Partial<User> = {}): User => {
  return createUser(overrides);
};

// A specialized helper can make a scenario explicit:
//
// const user = createAuthenticatedUser({
//     name: "John Doe",
// });
//
// Specialized helpers are useful when the scenario itself is meaningful.
// They should not multiply unnecessarily for every possible variation.

// ---------------------------------------------------------------------
// 19. Utility for rendering authenticated content
// ---------------------------------------------------------------------

export const renderAuthenticated = (
  ui: ReactElement,
  options: Omit<CustomRenderOptions, "user"> = {},
): RenderResult => {
  return renderWithProviders(ui, {
    ...options,
    user: createUser(),
  });
};

// This utility expresses a common test condition:
//
// renderAuthenticated(<UserSummary />);
//
// The component's own props remain visible while authentication infrastructure
// is configured by the helper.

// ---------------------------------------------------------------------
// 20. Utility for unauthenticated content
// ---------------------------------------------------------------------

export const renderAsGuest = (ui: ReactElement, options: Omit<CustomRenderOptions, "user"> = {}): RenderResult => {
  return renderWithProviders(ui, {
    ...options,
    user: null,
  });
};

// Specialized render helpers can improve readability when the authentication
// state itself is central to many tests.

// ---------------------------------------------------------------------
// 21. Avoid creating a utility for one test
// ---------------------------------------------------------------------

// Do not extract every two-line operation:
//
// const renderUser = () => {
//     return renderWithProviders(
//         <UserSummary />,
//         {
//             user: createUser(),
//         },
//     );
// };
//
// If only one test needs this behavior, local setup may be clearer.
//
// Extract a utility when repetition or a stable testing concept justifies it.

// ---------------------------------------------------------------------
// 22. Shared utilities should remain deterministic
// ---------------------------------------------------------------------

// A shared utility should not silently depend on:
//
// - Current time.
// - Random values.
// - Global mutable state.
// - Test execution order.
// - External network services.
// - Environment-specific behavior.
//
// Deterministic utilities make failures reproducible across test runs.

// ---------------------------------------------------------------------
// 23. Avoid hidden global state
// ---------------------------------------------------------------------

// This utility is problematic:
//
// let currentUser: User | null = null;
//
// export const setCurrentUser = (user: User | null) => {
//     currentUser = user;
// };
//
// Tests that use this utility can affect one another.
//
// Prefer explicit values:
//
// renderWithProviders(
//     <UserSummary />,
//     {
//         user: createUser(),
//     },
// );

// ---------------------------------------------------------------------
// 24. Utilities should compose
// ---------------------------------------------------------------------

// Good utilities can be combined:
//
// const user = createUser({
//     name: "John Doe",
// });
//
// renderWithProviders(
//     <UserSummary />,
//     {
//         theme: "dark",
//         user,
//     },
// );
//
// Each utility has one clear responsibility:
//
// createUser
//     -> creates test data
//
// renderWithProviders
//     -> configures rendering infrastructure
//
// userEvent.setup
//     -> configures interactions

// ---------------------------------------------------------------------
// 25. Avoid utility functions with unrelated responsibilities
// ---------------------------------------------------------------------

// Avoid:
//
// testHelper({
//     user,
//     theme,
//     apiResponse,
//     clickButton: true,
//     expectedText: "Saved",
//     mockDate: true,
// });
//
// This kind of helper can turn the test into a configuration language that
// obscures the scenario.
//
// Prefer small utilities that compose explicitly.

// ---------------------------------------------------------------------
// 26. Shared API response factories
// ---------------------------------------------------------------------

interface ApiUserResponse {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
}

export const createApiUserResponse = (overrides: Partial<ApiUserResponse> = {}): ApiUserResponse => {
  return {
    id: "42",
    displayName: "John Doe",
    email: "john.doe@example.com",
    ...overrides,
  };
};

// Response factories are useful when many tests need consistent API-shaped data.

// ---------------------------------------------------------------------
// 27. Separate domain data from rendering utilities
// ---------------------------------------------------------------------

// Keep these concerns separate:
//
// createUser()
// createApiUserResponse()
// renderWithProviders()
//
// A data factory should not render components.
// A rendering helper should not create arbitrary business data unless that
// behavior is the explicit purpose of the helper.

// ---------------------------------------------------------------------
// 28. Reusable provider options
// ---------------------------------------------------------------------

export interface TestProvidersOptions {
  readonly theme?: "light" | "dark";
  readonly user?: User | null;
}

export const TestProviders: FC<PropsWithChildren<TestProvidersOptions>> = ({
  theme = "light",
  user = null,
  children,
}): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider user={user}>{children}</AuthProvider>
    </ThemeProvider>
  );
};

// A named provider component can be useful when the same provider hierarchy
// appears in multiple utilities or when a test needs direct control over it.

// ---------------------------------------------------------------------
// 29. Rendering with a provider component
// ---------------------------------------------------------------------

export const renderWithTestProviders = (
  ui: ReactElement,
  options: Omit<RenderOptions, "wrapper"> & TestProvidersOptions = {},
): RenderResult => {
  const { theme, user, ...renderOptions } = options;

  const Wrapper: FC<PropsWithChildren> = ({ children }): ReactElement => {
    return (
      <TestProviders theme={theme} user={user}>
        {children}
      </TestProviders>
    );
  };

  return render(ui, {
    ...renderOptions,
    wrapper: Wrapper,
  });
};

// A provider component and render helper can be separated when both are useful
// independently.

// ---------------------------------------------------------------------
// 30. Utility return values should preserve useful APIs
// ---------------------------------------------------------------------

// Prefer:
//
// const {rerender, unmount} = renderWithProviders(
//     <UserSummary />,
// );
//
// over:
//
// renderWithProviders(...);
//
// where the helper returns `void`.
//
// Returning Testing Library's `RenderResult` preserves standard capabilities:
//
// - Query methods.
// - `rerender`.
// - `unmount`.
// - `asFragment`.
// - `debug`.

// ---------------------------------------------------------------------
// 31. Custom utilities should remain compatible with Testing Library
// ---------------------------------------------------------------------

// A custom render helper should behave like `render`:
//
// const result = renderWithProviders(
//     <UserSummary />,
// );
//
// result.rerender(
//     <UserSummary />,
// );
//
// result.unmount();
//
// Avoid wrappers that replace or discard useful Testing Library behavior.

// ---------------------------------------------------------------------
// 32. Utility naming
// ---------------------------------------------------------------------

// Prefer names that describe the operation:
//
// createUser()
// createProfileFormData()
// renderWithProviders()
// renderAuthenticated()
// renderAsGuest()
// createUserInteraction()
//
// Avoid vague names:
//
// helper()
// setup()
// common()
// utility()
// doTest()
//
// A utility's name should communicate what it provides without requiring the
// reader to inspect its implementation.

// ---------------------------------------------------------------------
// 33. Keep shared utilities close to their testing purpose
// ---------------------------------------------------------------------

// A shared test utility should generally contain testing infrastructure rather
// than application logic.
//
// Appropriate:
//
// renderWithProviders()
// createUser()
// createApiUserResponse()
//
// Usually inappropriate:
//
// calculateDiscount()
// normalizeUserName()
// formatCurrency()
//
// Business logic should normally be tested through its own public contract
// rather than moved into a testing utility merely because tests use it.

// ---------------------------------------------------------------------
// 34. Avoid duplicating production logic
// ---------------------------------------------------------------------

// A test factory should not reimplement application behavior:
//
// export const calculateExpectedTotal = (items: Item[]) => {
//     // Copies production calculation logic.
// };
//
// If both production and test code contain the same algorithm, the test may
// reproduce the same bug instead of detecting it.
//
// Prefer explicit expected values or independent test data.

// ---------------------------------------------------------------------
// 35. Shared utilities and test readability
// ---------------------------------------------------------------------

// A good test can remain understandable:
//
// const user = createUser({
//     name: "John Doe",
// });
//
// renderWithProviders(
//     <UserSummary />,
//     {
//         user,
//         theme: "dark",
//     },
// );
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// The utilities remove infrastructure while leaving the scenario and expectation
// visible.

// ---------------------------------------------------------------------
// 36. Shared utilities and explicit edge cases
// ---------------------------------------------------------------------

// Factories should make unusual values easy to express:
//
// const user = createUser({
//     name: "",
// });
//
// const product = createProduct({
//     price: 0,
// });
//
// const guest = null;
//
// Explicit overrides make edge cases visible instead of hiding them inside
// specialized magic helpers.

// ---------------------------------------------------------------------
// 37. Utility modules should avoid side effects
// ---------------------------------------------------------------------

// Avoid performing global setup simply by importing a utility:
//
// // Bad:
// server.listen();
//
// // Better:
// export const setupTestServer = () => {
//     server.listen();
// };
//
// Importing a helper should not unexpectedly modify the test environment.
//
// Lifecycle ownership should remain explicit.

// ---------------------------------------------------------------------
// 38. Utility modules and cleanup
// ---------------------------------------------------------------------

// If a helper creates a resource, its lifecycle should be clear:
//
// const createResource = () => {
//     const resource = createTestResource();
//
//     return {
//         resource,
//         cleanup: () => resource.close(),
//     };
// };
//
// The test or an explicit lifecycle utility should call `cleanup`.
//
// Hidden resources are difficult to reason about and can leak between tests.

// ---------------------------------------------------------------------
// 39. Avoid global user-event instances
// ---------------------------------------------------------------------

// Avoid:
//
// export const user = userEvent.setup();
//
// A shared interaction instance can make tests depend on shared state.
//
// Prefer:
//
// const user = userEvent.setup();
//
// inside each test, or a factory:
//
// const user = createUserInteraction();
//
// Each test owns its interaction state.

// ---------------------------------------------------------------------
// 40. Utility for repeated interaction setup
// ---------------------------------------------------------------------

export const clickButton = async (name: string): Promise<void> => {
  const user = userEvent.setup();

  await user.click(screen.getByRole("button", { name }));
};

// This can be useful if the same interaction is genuinely repeated across many
// tests, but it also hides the interaction implementation.
//
// Prefer direct `user.click(...)` when the interaction itself is important to
// understanding the test.

// ---------------------------------------------------------------------
// 41. Avoid hiding important interactions
// ---------------------------------------------------------------------

// Less explicit:
//
// await clickButton("Save");
//
// More explicit:
//
// const user = userEvent.setup();
//
// await user.click(
//     screen.getByRole("button", {name: "Save"}),
// );
//
// Shared interaction helpers are most valuable for complex, repeated workflows,
// not for trivial one-line interactions.

// ---------------------------------------------------------------------
// 42. Complex workflow utilities
// ---------------------------------------------------------------------

export const fillProfileForm = async (name: string, email: string): Promise<void> => {
  const user = userEvent.setup();

  await user.type(screen.getByRole("textbox", { name: "Name" }), name);

  await user.type(screen.getByRole("textbox", { name: "Email" }), email);
};

// A multi-step interaction can justify a helper when the same workflow appears
// repeatedly and its details are not the focus of individual tests.
//
// The helper should still have a precise name and explicit parameters.

// ---------------------------------------------------------------------
// 43. Prefer helpers with meaningful parameters
// ---------------------------------------------------------------------

// Prefer:
//
// await fillProfileForm(
//     "John Doe",
//     "john.doe@example.com",
// );
//
// over:
//
// await fillDefaultForm();
//
// Parameters keep important scenario data visible.

// ---------------------------------------------------------------------
// 44. Test utility boundaries
// ---------------------------------------------------------------------

// A useful boundary is:
//
// Test
//   -> describes behavior
//
// Shared utility
//   -> provides repetitive infrastructure
//
// Application code
//   -> provides behavior under test
//
// If a utility starts deciding what the application should do, it has crossed
// from test infrastructure into test logic.

// ---------------------------------------------------------------------
// 45. Testing utilities should not weaken assertions
// ---------------------------------------------------------------------

// Avoid helpers that make every test pass through vague checks:
//
// expectComponentToBeValid(component);
//
// Prefer precise assertions when they communicate the requirement:
//
// expect(
//     screen.getByRole("heading", {name: "John Doe"}),
// ).toBeInTheDocument();
//
// Utilities should make tests shorter without making their intent less precise.

// ---------------------------------------------------------------------
// 46. Shared utilities and accessibility
// ---------------------------------------------------------------------

// Shared query helpers should prefer semantic queries:
//
// export const getSaveButton = () => {
//     return screen.getByRole("button", {name: "Save"});
// };
//
// This is better than:
//
// export const getSaveButton = () => {
//     return screen.getByTestId("save-button");
// };
//
// when the accessible role and name are part of the component's public interface.

// ---------------------------------------------------------------------
// 47. Utility for a semantic element
// ---------------------------------------------------------------------

export const getUserSummary = (): HTMLElement => {
  return screen.getByRole("region", { name: "User summary" });
};

// A semantic query helper can be useful when the same element is accessed
// repeatedly across a suite.
//
// const summary = getUserSummary();
//
// expect(summary).toHaveTextContent("John Doe");

// ---------------------------------------------------------------------
// 48. Keep helpers discoverable
// ---------------------------------------------------------------------

// A shared utility should have:
//
// - A clear name.
// - A narrow responsibility.
// - Predictable defaults.
// - Explicit parameters.
// - No unexpected global side effects.
// - A stable return type.
//
// The goal is to make repeated test infrastructure easier to use without
// requiring every test author to understand its internal implementation.

// ---------------------------------------------------------------------
// 49. A complete shared utility pattern
// ---------------------------------------------------------------------

interface TestSetup {
  readonly user: User;
  readonly theme: "light" | "dark";
}

export const createTestSetup = (overrides: Partial<TestSetup> = {}): TestSetup => {
  return {
    user: createUser(),
    theme: "light",
    ...overrides,
  };
};

export const renderUserSummary = (overrides: Partial<TestSetup> = {}): RenderResult => {
  const setup = createTestSetup(overrides);

  return renderWithProviders(<UserSummary />, {
    user: setup.user,
    theme: setup.theme,
  });
};

// This combines a deterministic factory with a rendering helper.
//
// const user = createUser({
//     name: "John Doe",
// });
//
// renderUserSummary({
//     user,
//     theme: "dark",
// });
//
// The abstraction is useful when the same scenario setup is repeated across
// many tests. Individual tests can still override meaningful inputs.

// ---------------------------------------------------------------------
// 50. When not to create a shared utility
// ---------------------------------------------------------------------

// Keep code local when:
//
// - It appears in only one test.
// - The abstraction hides important behavior.
// - The helper has many unrelated options.
// - Its name is less clear than the original code.
// - It duplicates production logic.
// - It introduces global state.
// - It requires readers to inspect another file to understand a simple test.
//
// Shared utilities are valuable when they reduce repetition without reducing
// test clarity.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Shared test utilities centralize repetitive testing infrastructure.
// - Test data factories provide deterministic objects with explicit overrides.
// - Custom render helpers are useful for repeated provider configuration.
// - Shared wrappers should hide infrastructure while keeping important test inputs visible.
// - Custom render helpers should preserve Testing Library's useful RenderResult APIs.
// - Provider options should be explicit and configurable when different tests need different contexts.
// - Interaction factories can standardize user-event configuration while keeping interaction instances test-local.
// - Shared assertion helpers are useful when they represent stable, meaningful domain concepts.
// - Utility names should describe the operation they perform.
// - Test utilities should have narrow responsibilities and compose cleanly.
// - Shared utilities should avoid hidden global state and unexpected import-time side effects.
// - Factories should not silently introduce randomness, current time, or environment-dependent values.
// - Test utilities should not duplicate production algorithms because doing so can reproduce the same defects.
// - Important test inputs, interactions, and assertions should remain visible in individual tests.
// - Semantic query helpers are preferable when they make the application's accessible interface explicit.
// - Complex repeated workflows can justify dedicated interaction helpers.
// - A utility should be extracted when it reduces meaningful repetition without obscuring the behavior under test.
// - The purpose of shared test utilities is to improve consistency and readability, not merely to make test files shorter.
