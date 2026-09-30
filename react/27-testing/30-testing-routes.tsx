/**
 * Testing Routes
 * ==============
 *
 * Route tests verify the behavior of a component tree when the application's location
 * changes. The test should exercise navigation through user-facing interactions and
 * assert the rendered route content rather than testing the router's internal state.
 */

import { type FC, type ReactElement } from "react";
import { Link, MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------
// 1. Basic route rendering
// ---------------------------------------------------------------------

export const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Home</h1>
      <p>Welcome to the home page.</p>
    </main>
  );
};

export const AboutPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>About</h1>
      <p>Learn more about this application.</p>
    </main>
  );
};

export const BasicRoutes: FC = (): ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
};

// `MemoryRouter` provides an in-memory history implementation:
//
// render(
//     <MemoryRouter initialEntries={["/"]}>
//         <BasicRoutes />
//     </MemoryRouter>,
// );
//
// expect(
//     screen.getByRole("heading", {name: "Home"}),
// ).toBeInTheDocument();
//
// Tests can choose the initial location without depending on the browser URL.

// ---------------------------------------------------------------------
// 2. Testing an initial route
// ---------------------------------------------------------------------

// `initialEntries` controls the locations stored in the memory history:
//
// render(
//     <MemoryRouter initialEntries={["/about"]}>
//         <BasicRoutes />
//     </MemoryRouter>,
// );
//
// expect(
//     screen.getByRole("heading", {name: "About"}),
// ).toBeInTheDocument();
//
// This is useful when a test needs to begin at a specific route.

// ---------------------------------------------------------------------
// 3. Testing navigation with links
// ---------------------------------------------------------------------

export const Navigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
};

export const AppRoutes: FC = (): ReactElement => {
  return (
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
};

// Navigation should be tested as a user interaction:
//
// const user = userEvent.setup();
//
// render(
//     <MemoryRouter initialEntries={["/"]}>
//         <AppRoutes />
//     </MemoryRouter>,
// );
//
// expect(
//     screen.getByRole("heading", {name: "Home"}),
// ).toBeInTheDocument();
//
// await user.click(screen.getByRole("link", {name: "About"}));
//
// expect(
//     screen.getByRole("heading", {name: "About"}),
// ).toBeInTheDocument();
//
// The test verifies the route change through the resulting UI.

// ---------------------------------------------------------------------
// 4. Testing route parameters
// ---------------------------------------------------------------------

interface UserPageProps {
  readonly userId: string;
}

export const UserPage: FC<UserPageProps> = ({ userId }): ReactElement => {
  return (
    <main>
      <h1>User profile</h1>
      <p>User ID: {userId}</p>
    </main>
  );
};

export const UserRoute: FC = (): ReactElement => {
  return (
    <Routes>
      <Route path="/users/:userId" element={<UserRouteContent />} />
    </Routes>
  );
};

export const UserRouteContent: FC = (): ReactElement => {
  const location = useLocation();
  const userId = location.pathname.split("/").at(-1) ?? "";

  return <UserPage userId={userId} />;
};

// A route parameter should be tested using a realistic URL:
//
// render(
//     <MemoryRouter initialEntries={["/users/42"]}>
//         <UserRoute />
//     </MemoryRouter>,
// );
//
// expect(
//     screen.getByText("User ID: 42"),
// ).toBeInTheDocument();
//
// In application code, `useParams` is normally preferable to manually parsing
// the pathname. This example keeps the route behavior visible without introducing
// additional application-specific abstractions.

// ---------------------------------------------------------------------
// 5. Testing route parameters with useParams
// ---------------------------------------------------------------------

import { useParams } from "react-router-dom";

export const UserDetailsPage: FC = (): ReactElement => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <main>
      <h1>User profile</h1>
      <p>User ID: {userId}</p>
    </main>
  );
};

export const UserDetailsRoutes: FC = (): ReactElement => {
  return (
    <Routes>
      <Route path="/users/:userId" element={<UserDetailsPage />} />
    </Routes>
  );
};

// The route parameter is supplied by the router:
//
// render(
//     <MemoryRouter initialEntries={["/users/42"]}>
//         <UserDetailsRoutes />
//     </MemoryRouter>,
// );
//
// expect(screen.getByText("User ID: 42")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 6. Testing nested routes
// ---------------------------------------------------------------------

export const SettingsPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Settings</h1>
      <p>Account settings.</p>
    </main>
  );
};

export const AccountPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>
      <Link to="/account/settings">Settings</Link>
    </main>
  );
};

export const NestedRoutes: FC = (): ReactElement => {
  return (
    <Routes>
      <Route path="/account" element={<AccountPage />} />
      <Route path="/account/settings" element={<SettingsPage />} />
    </Routes>
  );
};

// Nested or hierarchical paths can be tested through normal navigation:
//
// const user = userEvent.setup();
//
// render(
//     <MemoryRouter initialEntries={["/account"]}>
//         <NestedRoutes />
//     </MemoryRouter>,
// );
//
// await user.click(screen.getByRole("link", {name: "Settings"}));
//
// expect(
//     screen.getByRole("heading", {name: "Settings"}),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 7. Testing a not-found route
// ---------------------------------------------------------------------

export const NotFoundPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The requested page does not exist.</p>
    </main>
  );
};

export const RoutesWithNotFound: FC = (): ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// A not-found route can be tested by starting at an unknown location:
//
// render(
//     <MemoryRouter initialEntries={["/does-not-exist"]}>
//         <RoutesWithNotFound />
//     </MemoryRouter>,
// );
//
// expect(
//     screen.getByRole("heading", {name: "Page not found"}),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 8. Testing programmatic navigation
// ---------------------------------------------------------------------

export const NavigateToAboutButton: FC = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        navigate("/about");
      }}
    >
      Open about
    </button>
  );
};

export const ProgrammaticRoutes: FC = (): ReactElement => {
  return (
    <>
      <NavigateToAboutButton />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
};

// Programmatic navigation is tested through the triggering interaction:
//
// const user = userEvent.setup();
//
// render(
//     <MemoryRouter initialEntries={["/"]}>
//         <ProgrammaticRoutes />
//     </MemoryRouter>,
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Open about"}),
// );
//
// expect(
//     screen.getByRole("heading", {name: "About"}),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 9. Testing navigation with history entries
// ---------------------------------------------------------------------

// `MemoryRouter` can receive multiple initial entries:
//
// render(
//     <MemoryRouter
//         initialEntries={["/", "/about"]}
//         initialIndex={1}
//     >
//         <BasicRoutes />
//     </MemoryRouter>,
// );
//
// expect(
//     screen.getByRole("heading", {name: "About"}),
// ).toBeInTheDocument();
//
// `initialIndex` selects which entry is active when the router starts.

// ---------------------------------------------------------------------
// 10. Testing back navigation
// ---------------------------------------------------------------------

export const BackButton: FC = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => {
        navigate(-1);
      }}
    >
      Go back
    </button>
  );
};

// A back-navigation test can use multiple memory-history entries:
//
// const user = userEvent.setup();
//
// render(
//     <MemoryRouter initialEntries={["/", "/about"]} initialIndex={1}>
//         <BackButton />
//         <BasicRoutes />
//     </MemoryRouter>,
// );
//
// expect(screen.getByRole("heading", {name: "About"})).toBeInTheDocument();
//
// await user.click(screen.getByRole("button", {name: "Go back"}));
//
// expect(screen.getByRole("heading", {name: "Home"})).toBeInTheDocument();

// ---------------------------------------------------------------------
// 11. Testing query parameters
// ---------------------------------------------------------------------

export const SearchPage: FC = (): ReactElement => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");

  return (
    <main>
      <h1>Search</h1>
      <p>Query: {query ?? "none"}</p>
    </main>
  );
};

export const SearchRoutes: FC = (): ReactElement => {
  return (
    <Routes>
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
};

// Query parameters can be supplied directly in the initial location:
//
// render(
//     <MemoryRouter initialEntries={["/search?query=react"]}>
//         <SearchRoutes />
//     </MemoryRouter>,
// );
//
// expect(
//     screen.getByText("Query: react"),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 12. Testing route state
// ---------------------------------------------------------------------

export const StateNavigation: FC = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          navigate("/about", {
            state: { source: "home" },
          });
        }}
      >
        Open about
      </button>

      <output aria-label="Navigation source">
        {String((location.state as { source?: string } | null)?.source ?? "none")}
      </output>
    </>
  );
};

// Route state can be tested through the resulting UI:
//
// const user = userEvent.setup();
//
// render(
//     <MemoryRouter initialEntries={["/"]}>
//         <StateNavigation />
//     </MemoryRouter>,
// );
//
// await user.click(
//     screen.getByRole("button", {name: "Open about"}),
// );
//
// expect(
//     screen.getByRole("status", {name: "Navigation source"}),
// ).toHaveTextContent("home");

// ---------------------------------------------------------------------
// 13. Testing redirects
// ---------------------------------------------------------------------

export const ProtectedPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Protected content</h1>
    </main>
  );
};

export const LoginPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Login</h1>
    </main>
  );
};

// A protected route can redirect unauthenticated users:
//
// const ProtectedRoute: FC = (): ReactElement => {
//     const isAuthenticated = false;
//
//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }
//
//     return <ProtectedPage />;
// };
//
// The test should assert the resulting route:
//
// render(
//     <MemoryRouter initialEntries={["/protected"]}>
//         <Routes>
//             <Route path="/protected" element={<ProtectedRoute />} />
//             <Route path="/login" element={<LoginPage />} />
//         </Routes>
//     </MemoryRouter>,
// );
//
// expect(
//     screen.getByRole("heading", {name: "Login"}),
// ).toBeInTheDocument();
//
// The redirect mechanism itself is less important than the route the user ends
// up seeing.

// ---------------------------------------------------------------------
// 14. Testing route-aware components
// ---------------------------------------------------------------------

export const CurrentPath: FC = (): ReactElement => {
  const location = useLocation();

  return <output aria-label="Current path">{location.pathname}</output>;
};

// A route-aware component can be tested with a realistic initial location:
//
// render(
//     <MemoryRouter initialEntries={["/account/settings"]}>
//         <CurrentPath />
//     </MemoryRouter>,
// );
//
// expect(
//     screen.getByRole("status", {name: "Current path"}),
// ).toHaveTextContent("/account/settings");

// ---------------------------------------------------------------------
// 15. Testing a complete navigation flow
// ---------------------------------------------------------------------

export const NavigationFlow: FC = (): ReactElement => {
  return (
    <>
      <nav aria-label="Primary navigation">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/search?query=react">Search</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  );
};

// A complete flow should follow the same actions a user would perform:
//
// const user = userEvent.setup();
//
// render(
//     <MemoryRouter initialEntries={["/"]}>
//         <NavigationFlow />
//     </MemoryRouter>,
// );
//
// await user.click(screen.getByRole("link", {name: "About"}));
//
// expect(
//     screen.getByRole("heading", {name: "About"}),
// ).toBeInTheDocument();
//
// await user.click(screen.getByRole("link", {name: "Search"}));
//
// expect(
//     screen.getByRole("heading", {name: "Search"}),
// ).toBeInTheDocument();
//
// expect(screen.getByText("Query: react")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 16. Avoid testing router internals
// ---------------------------------------------------------------------

// Prefer:
//
// expect(
//     screen.getByRole("heading", {name: "About"}),
// ).toBeInTheDocument();
//
// over inspecting:
//
// - Internal history objects.
// - Router implementation details.
// - Private route state.
// - Generated component instances.
//
// The route test should establish that navigation produces the expected
// application state and rendered UI.

// ---------------------------------------------------------------------
// 17. Avoid using real browser navigation in unit tests
// ---------------------------------------------------------------------

// `MemoryRouter` is generally preferable for isolated component tests because
// it keeps navigation in memory:
//
// render(
//     <MemoryRouter initialEntries={["/about"]}>
//         <BasicRoutes />
//     </MemoryRouter>,
// );
//
// Browser-specific URL behavior belongs in tests that intentionally exercise
// the browser environment or the application's integration layer.

// ---------------------------------------------------------------------
// 18. Testing route accessibility
// ---------------------------------------------------------------------

// Route tests should continue using accessible queries:
//
// screen.getByRole("heading", {name: "Home"});
// screen.getByRole("link", {name: "About"});
// screen.getByRole("button", {name: "Open about"});
//
// This keeps navigation tests focused on the interface users actually interact
// with rather than CSS selectors or implementation-specific DOM structures.

// ---------------------------------------------------------------------
// 19. Route test setup
// ---------------------------------------------------------------------

export const renderWithRouter = (ui: ReactElement, initialEntries: string[] = ["/"]): void => {
  render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
};

// A small helper can reduce repeated router setup:
//
// renderWithRouter(<AppRoutes />, ["/about"]);
//
// expect(
//     screen.getByRole("heading", {name: "About"}),
// ).toBeInTheDocument();
//
// Keep such helpers simple. They should make the test environment explicit
// rather than hide important routing configuration.

// ---------------------------------------------------------------------
// 20. Complete testing pattern
// ---------------------------------------------------------------------

// A route test generally follows this sequence:
//
// 1. Choose the initial location.
// 2. Render the route tree inside a router suitable for the test.
// 3. Interact through links, buttons, or other user-facing controls.
// 4. Assert the resulting route content.
// 5. Include parameters, search parameters, or navigation state when relevant.
//
// This tests the application's routing behavior without coupling the test to
// the router's internal implementation.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Use an in-memory router such as `MemoryRouter` for isolated route tests.
// - `initialEntries` controls the starting location.
// - `initialIndex` selects the active entry when multiple history entries exist.
// - Test navigation through links and other user-facing interactions.
// - Test route parameters with realistic paths such as `/users/42`.
// - Test query parameters by providing them in the initial location.
// - Test redirects by asserting the destination UI.
// - Test programmatic navigation through the interaction that triggers it.
// - Use accessible queries to verify the rendered result of navigation.
// - Avoid assertions against router internals or private history implementation details.
// - Small router helpers can reduce repetition without hiding important test configuration.
