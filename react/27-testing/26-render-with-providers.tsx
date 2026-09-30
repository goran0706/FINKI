/**
 * Render With Providers
 * ======================
 *
 * A shared `renderWithProviders` helper can wrap components with the providers
 * required by an application's tests. It centralizes common test setup while
 * allowing individual tests to override provider configuration when necessary.
 */

import { createContext, type FC, type ReactElement, type ReactNode, useContext } from "react";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";

// ---------------------------------------------------------------------
// 1. Application contexts
// ---------------------------------------------------------------------

interface ThemeContextValue {
  readonly theme: "light" | "dark";
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within ThemeContext");
  }

  return context;
};

interface LocaleContextValue {
  readonly locale: "en" | "de";
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export const useLocale = (): LocaleContextValue => {
  const context = useContext(LocaleContext);

  if (context === null) {
    throw new Error("useLocale must be used within LocaleContext");
  }

  return context;
};

// ---------------------------------------------------------------------
// 2. Component requiring providers
// ---------------------------------------------------------------------

export const AccountSummary: FC = (): ReactElement => {
  const { theme } = useTheme();
  const { locale } = useLocale();

  return (
    <section aria-label="Account summary">
      <p>Theme: {theme}</p>
      <p>Locale: {locale}</p>
    </section>
  );
};

// Without the required providers, this component cannot access its context:
//
// render(<AccountSummary />);
//
// The custom hooks throw because the required provider values are missing.

// ---------------------------------------------------------------------
// 3. Basic renderWithProviders
// ---------------------------------------------------------------------

interface ProviderOptions {
  readonly theme?: ThemeContextValue["theme"];
  readonly locale?: LocaleContextValue["locale"];
}

interface WrapperProps {
  readonly children: ReactNode;
}

export const renderWithProviders = (
  ui: ReactElement,
  options: ProviderOptions & Omit<RenderOptions, "wrapper"> = {},
): RenderResult => {
  const { theme = "light", locale = "en", ...renderOptions } = options;

  const Wrapper: FC<WrapperProps> = ({ children }): ReactElement => {
    return (
      <ThemeContext.Provider value={{ theme }}>
        <LocaleContext.Provider value={{ locale }}>{children}</LocaleContext.Provider>
      </ThemeContext.Provider>
    );
  };

  return render(ui, {
    ...renderOptions,
    wrapper: Wrapper,
  });
};

// The helper can now provide the complete test environment:
//
// renderWithProviders(<AccountSummary />);
//
// expect(screen.getByRole("region", {name: "Account summary"})).toHaveTextContent(
//     "Theme: light",
// );

// ---------------------------------------------------------------------
// 4. Configuring provider values
// ---------------------------------------------------------------------

// Individual tests can override the default configuration:
//
// renderWithProviders(<AccountSummary />, {
//     theme: "dark",
//     locale: "de",
// });
//
// expect(screen.getByText("Theme: dark")).toBeInTheDocument();
// expect(screen.getByText("Locale: de")).toBeInTheDocument();
//
// Provider configuration belongs in the test when the specific value is
// relevant to the behavior being tested.

// ---------------------------------------------------------------------
// 5. Keeping render options separate
// ---------------------------------------------------------------------

// `RenderOptions` can still be passed through to Testing Library:
//
// renderWithProviders(<AccountSummary />, {
//     theme: "dark",
//     container: document.body,
// });
//
// The helper should preserve useful Testing Library options instead of
// replacing the underlying `render` API with a completely different contract.

// ---------------------------------------------------------------------
// 6. Testing the wrapper itself
// ---------------------------------------------------------------------

// A component using several providers can be tested through the helper:
//
// renderWithProviders(<AccountSummary />, {
//     theme: "dark",
//     locale: "de",
// });
//
// expect(screen.getByText("Theme: dark")).toBeInTheDocument();
// expect(screen.getByText("Locale: de")).toBeInTheDocument();
//
// This verifies that the helper supplies the context values expected by
// components under test.

// ---------------------------------------------------------------------
// 7. Shared provider setup
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserContextValue {
  readonly user: User | null;
}

export const UserContext = createContext<UserContextValue | null>(null);

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser must be used within UserContext");
  }

  return context;
};

// A larger application may require several providers:
//
// ThemeContext.Provider
//     ↓
// LocaleContext.Provider
//     ↓
// UserContext.Provider
//     ↓
// Component under test
//
// A shared render helper can establish this environment consistently.

// ---------------------------------------------------------------------
// 8. Extending the provider helper
// ---------------------------------------------------------------------

interface ExtendedProviderOptions extends ProviderOptions {
  readonly user?: User | null;
}

export const renderWithAllProviders = (
  ui: ReactElement,
  options: ExtendedProviderOptions & Omit<RenderOptions, "wrapper"> = {},
): RenderResult => {
  const { theme = "light", locale = "en", user = null, ...renderOptions } = options;

  const Wrapper: FC<WrapperProps> = ({ children }): ReactElement => {
    return (
      <ThemeContext.Provider value={{ theme }}>
        <LocaleContext.Provider value={{ locale }}>
          <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
        </LocaleContext.Provider>
      </ThemeContext.Provider>
    );
  };

  return render(ui, {
    ...renderOptions,
    wrapper: Wrapper,
  });
};

// The extended helper can provide all common application dependencies:
//
// renderWithAllProviders(<AccountSummary />, {
//     theme: "dark",
//     locale: "de",
//     user: {name: "John Doe"},
// });

// ---------------------------------------------------------------------
// 9. Avoid hiding test-specific dependencies
// ---------------------------------------------------------------------

// A shared helper is useful when providers are genuinely common.
//
// Prefer:
//
// renderWithProviders(<AccountSummary />, {theme: "dark"});
//
// over manually repeating the same provider tree in every test.
//
// However, do not put every possible provider into one global wrapper merely
// for convenience. Tests should remain clear about the environment they need.

// ---------------------------------------------------------------------
// 10. Provider defaults
// ---------------------------------------------------------------------

// Defaults should represent the normal test environment:
//
// renderWithProviders(<AccountSummary />);
//
// The test receives:
//
// theme  -> "light"
// locale -> "en"
//
// A test only needs to specify an override when the alternative value matters:
//
// renderWithProviders(<AccountSummary />, {theme: "dark"});

// ---------------------------------------------------------------------
// 11. Testing a provider-dependent interaction
// ---------------------------------------------------------------------

export const ThemeToggle: FC = (): ReactElement => {
  const { theme } = useTheme();

  return <button type="button">Current theme: {theme}</button>;
};

// The helper can make interaction tests concise:
//
// renderWithProviders(<ThemeToggle />, {theme: "dark"});
//
// expect(
//     screen.getByRole("button", {name: "Current theme: dark"}),
// ).toBeInTheDocument();
//
// The test does not need to repeat unrelated provider setup.

// ---------------------------------------------------------------------
// 12. Using wrapper directly
// ---------------------------------------------------------------------

// Testing Library's `render` also accepts a `wrapper` option:
//
// const wrapper: FC<WrapperProps> = ({children}): ReactElement => (
//     <ThemeContext.Provider value={{theme: "dark"}}>
//         {children}
//     </ThemeContext.Provider>
// );
//
// render(<ThemeToggle />, {wrapper});
//
// A custom `renderWithProviders` helper is primarily useful when the same
// wrapper configuration is needed repeatedly across a test suite.

// ---------------------------------------------------------------------
// 13. Provider configuration should remain explicit
// ---------------------------------------------------------------------

// Avoid helpers with hidden mutable global state:
//
// setTestTheme("dark");
// renderWithProviders(<Component />);
//
//
// Prefer passing configuration:
//
// renderWithProviders(<Component />, {theme: "dark"});
//
// Explicit options make each test's environment visible at the call site.

// ---------------------------------------------------------------------
// 14. Preserving Testing Library queries
// ---------------------------------------------------------------------

// The custom helper should return the normal `RenderResult`:
//
// const {container, rerender, unmount} = renderWithProviders(
//     <AccountSummary />,
// );
//
// `renderWithProviders` should add provider setup, not replace Testing Library's
// normal rendering and query behavior.

// ---------------------------------------------------------------------
// 15. Rerendering through the helper
// ---------------------------------------------------------------------

// The returned `rerender` can still be used:
//
// const {rerender} = renderWithProviders(
//     <AccountSummary />,
//     {theme: "light"},
// );
//
// rerender(<AccountSummary />);
//
// The provider wrapper remains around the rendered component.
//
// If provider configuration itself must change, it is usually clearer to
// call the helper again or design the wrapper options to support that use case.

// ---------------------------------------------------------------------
// 16. Using the helper with component props
// ---------------------------------------------------------------------

interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  const { locale } = useLocale();

  return (
    <p>
      {locale}: Hello, {name}
    </p>
  );
};

// Provider configuration and component props can be tested independently:
//
// renderWithProviders(
//     <Greeting name="John Doe" />,
//     {locale: "de"},
// );
//
// expect(screen.getByText("de: Hello, John Doe")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 17. When not to use a custom render helper
// ---------------------------------------------------------------------

// A simple component with no provider dependencies should use ordinary render:
//
// render(<GreetingWithoutContext name="John Doe" />);
//
// A custom helper is useful only when it reduces meaningful repetition.
// It should not become mandatory for every component test.

// ---------------------------------------------------------------------
// 18. Complete testing pattern
// ---------------------------------------------------------------------

// A practical test suite can use:
//
// renderWithProviders(<AccountSummary />);
//
// renderWithProviders(<ThemeToggle />, {
//     theme: "dark",
// });
//
// renderWithAllProviders(<UserProfile />, {
//     theme: "dark",
//     locale: "de",
//     user: {name: "John Doe"},
// });
//
// Each test remains focused on the behavior it is verifying while common
// provider setup stays centralized.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A custom render helper centralizes common provider setup.
// - Keep the helper compatible with Testing Library's normal `render` behavior.
// - Return the normal `RenderResult` so queries and lifecycle methods remain available.
// - Provide sensible defaults for common provider values.
// - Allow individual tests to override provider configuration explicitly.
// - Preserve useful `RenderOptions` instead of hiding Testing Library functionality.
// - Avoid putting every possible provider into one global wrapper.
// - Keep test-specific dependencies visible through explicit helper options.
// - Use ordinary `render` when a component does not need shared provider setup.
// - The purpose of `renderWithProviders` is to reduce meaningful repetition, not hide test dependencies.
