/**
 * End-to-End Testing
 * ==================
 *
 * End-to-end (E2E) testing verifies an application through a complete user workflow,
 * from the user interface through the application's real integration boundaries. E2E tests
 * typically exercise a running application in a real or browser-like environment and verify
 * behavior across multiple layers rather than testing an isolated component or function.
 *
 * E2E tests are useful for validating critical workflows such as authentication, navigation,
 * form submission, and interactions that depend on multiple application components working together.
 */

// ---------------------------------------------------------------------
// 1. What end-to-end testing means
// ---------------------------------------------------------------------

// An E2E test verifies a complete workflow from the user's perspective.
//
// A simplified workflow might be:
//
// browser
//     ↓
// user interaction
//     ↓
// React application
//     ↓
// routing
//     ↓
// API request
//     ↓
// backend
//     ↓
// database
//     ↓
// response
//     ↓
// updated UI
//
// The test verifies the behavior across these boundaries rather than
// isolating one function or component.

// ---------------------------------------------------------------------
// 2. Unit tests vs. integration tests vs. E2E tests
// ---------------------------------------------------------------------

// Unit test:
//
// Tests one small unit in isolation.
//
// Example:
//
// expect(calculateTotal(10, 2)).toBe(20);
//
// Integration test:
//
// Tests multiple application units working together.
//
// Example:
//
// render(<ProfileForm />);
// await user.type(...);
// await user.click(...);
// expect(...).toBeInTheDocument();
//
// E2E test:
//
// Starts the application and interacts with it through a browser:
//
// await page.goto("/profile");
// await page.getByLabel("Name").fill("John Doe");
// await page.getByRole("button", {name: "Save"}).click();
// await expect(page.getByText("Profile saved")).toBeVisible();

// ---------------------------------------------------------------------
// 3. E2E tests focus on user workflows
// ---------------------------------------------------------------------

// E2E tests should usually represent meaningful workflows.
//
// Examples:
//
// - a user signs in;
// - a user navigates to a page;
// - a user creates a record;
// - a user edits a record;
// - a user submits a form;
// - a user completes checkout;
// - a user signs out.
//
// The test should verify what the user can observe and accomplish rather
// than internal implementation details.

// ---------------------------------------------------------------------
// 4. A complete workflow
// ---------------------------------------------------------------------

// A conceptual profile workflow:
//
// 1. Open the application.
// 2. Navigate to the profile page.
// 3. Enter a name.
// 4. Submit the form.
// 5. Wait for the save operation.
// 6. Verify the success message.
// 7. Reload the page.
// 8. Verify that the saved name is still displayed.
//
// Example with a browser automation API:
//
// test("user can update their profile", async ({page}) => {
//     await page.goto("/profile");
//
//     await page.getByLabel("Name").fill("John Doe");
//     await page.getByRole("button", {name: "Save"}).click();
//
//     await expect(page.getByText("Profile saved")).toBeVisible();
//
//     await page.reload();
//
//     await expect(page.getByLabel("Name")).toHaveValue("John Doe");
// });
//
// The exact API depends on the E2E framework.

// ---------------------------------------------------------------------
// 5. E2E tests need a running application
// ---------------------------------------------------------------------

// Unlike most unit tests, E2E tests generally interact with an application
// that has been started as a real process or test server.
//
// A typical workflow is:
//
// install dependencies
//     ↓
// build or start application
//     ↓
// start browser
//     ↓
// navigate to application
//     ↓
// execute workflow
//     ↓
// collect results
//     ↓
// shut down application
//
// The exact lifecycle is controlled by the chosen E2E framework and project
// configuration.

// ---------------------------------------------------------------------
// 6. Browser automation
// ---------------------------------------------------------------------

// E2E frameworks automate browsers or browser-like environments.
//
// Common capabilities include:
//
// - navigating to URLs;
// - clicking elements;
// - entering text;
// - selecting options;
// - uploading files;
// - submitting forms;
// - reading visible content;
// - waiting for UI state;
// - capturing screenshots;
// - intercepting network requests;
// - managing browser contexts.
//
// The browser is the boundary through which the test interacts with the
// application.

// ---------------------------------------------------------------------
// 7. User-oriented selectors
// ---------------------------------------------------------------------

// Prefer selectors that correspond to how a user identifies an element.
//
// Good:
//
// page.getByRole("button", {name: "Save"})
// page.getByLabel("Email")
// page.getByText("Profile saved")
//
// More fragile:
//
// page.locator(".button-primary")
// page.locator("#internal-save-button")
// page.locator("div:nth-child(3)")
//
// Semantic selectors generally survive internal markup and CSS refactoring
// better than implementation-specific selectors.

// ---------------------------------------------------------------------
// 8. Accessible names
// ---------------------------------------------------------------------

// Accessible names are particularly useful for E2E selectors.
//
// Example:
//
// <button type="submit">Save</button>
//
// A browser automation framework can locate the control by its role and name:
//
// page.getByRole("button", {name: "Save"})
//
// This connects the test to the same semantic information that assistive
// technologies use.

// ---------------------------------------------------------------------
// 9. Stable test identifiers
// ---------------------------------------------------------------------

// Sometimes an element does not have a useful semantic selector.
//
// A dedicated test identifier can provide a stable fallback:
//
// <div data-testid="order-summary">
//
// Example:
//
// page.getByTestId("order-summary")
//
// Test IDs should be used intentionally rather than replacing semantic
// selectors everywhere.
//
// The goal is a stable contract, not a selector that mirrors implementation
// details unnecessarily.

// ---------------------------------------------------------------------
// 10. Avoid arbitrary waits
// ---------------------------------------------------------------------

// Fragile:
//
// await page.waitForTimeout(2_000);
// await expect(page.getByText("Saved")).toBeVisible();
//
// The fixed delay assumes the application will finish within exactly that
// amount of time.
//
// Prefer waiting for the observable condition:
//
// await expect(page.getByText("Saved")).toBeVisible();
//
// Condition-based waiting allows the test to continue as soon as the expected
// state exists and avoids dependence on arbitrary timing.

// ---------------------------------------------------------------------
// 11. Waiting for navigation
// ---------------------------------------------------------------------

// Navigation should be observed through its resulting state.
//
// Example:
//
// await page.getByRole("link", {name: "Profile"}).click();
//
// await expect(page).toHaveURL(/\/profile$/);
//
// await expect(
//     page.getByRole("heading", {name: "Profile"}),
// ).toBeVisible();
//
// The exact URL and assertion APIs depend on the E2E framework.

// ---------------------------------------------------------------------
// 12. Test isolation
// ---------------------------------------------------------------------

// Each E2E test should establish the state it needs.
//
// Avoid:
//
// test A creates an account
// test B assumes that account exists
// test C assumes test B already modified it
//
// This creates test-order dependencies.
//
// Prefer:
//
// test A creates its own account
// test B creates its own account
// test C creates its own account
//
// Tests can share infrastructure while keeping application state isolated.

// ---------------------------------------------------------------------
// 13. Test data
// ---------------------------------------------------------------------

// E2E tests require predictable data.
//
// A test can create dedicated data:
//
// const user = {
//     email: "john.doe@example.com",
//     name: "John Doe",
// };
//
// await createTestUser(user);
//
// The exact mechanism may be:
//
// - an API;
// - a database fixture;
// - a test-only endpoint;
// - a setup script;
// - a framework fixture.
//
// Test data should be deterministic and should not depend on production
// accounts or mutable shared records.

// ---------------------------------------------------------------------
// 14. Authentication
// ---------------------------------------------------------------------

// Authentication can make E2E suites significantly slower if every test
// performs a complete login workflow.
//
// A common strategy is:
//
// 1. Perform authentication during setup.
// 2. Persist the authenticated browser state.
// 3. Reuse that state for tests that require the same authenticated role.
//
// Conceptually:
//
// authenticated state
//     ↓
// browser context
//     ↓
// E2E test
//
// The actual implementation depends on the framework and authentication
// architecture.

// ---------------------------------------------------------------------
// 15. Test the authentication workflow separately
// ---------------------------------------------------------------------

// Reusing authenticated state does not mean authentication should never be
// tested.
//
// A dedicated authentication test can verify:
//
// 1. The login page renders.
// 2. Valid credentials are accepted.
// 3. The user reaches the authenticated application.
// 4. Invalid credentials produce the expected error.
// 5. Logout ends the authenticated session.
//
// Other tests can reuse authenticated state when authentication itself is not
// the behavior under test.

// ---------------------------------------------------------------------
// 16. Network dependencies
// ---------------------------------------------------------------------

// E2E tests can exercise real network requests when the goal is to verify
// the complete application stack.
//
// Example:
//
// browser
//     ↓
// frontend
//     ↓
// real API
//     ↓
// test database
//
// This gives strong integration coverage but introduces additional
// infrastructure and potential sources of failure.
//
// For workflows where a particular backend response is not the subject of
// the test, network interception can make the test more deterministic.

// ---------------------------------------------------------------------
// 17. Network interception
// ---------------------------------------------------------------------

// A browser automation framework may allow requests to be intercepted.
//
// Example:
//
// await page.route("**/api/profile", async (route) => {
//     await route.fulfill({
//         status: 200,
//         contentType: "application/json",
//         body: JSON.stringify({
//             name: "John Doe",
//         }),
//     });
// });
//
// This can isolate the browser workflow from an unstable or unavailable
// external service.
//
// Use real backend integration when the backend interaction itself is part
// of the behavior being verified.

// ---------------------------------------------------------------------
// 18. E2E assertions should be observable
// ---------------------------------------------------------------------

// Prefer assertions about what the user can observe:
//
// - visible text;
// - accessible roles;
// - input values;
// - URLs;
// - navigation state;
// - enabled or disabled controls;
// - validation messages;
// - success or error states.
//
// Avoid asserting internal React state:
//
// expect(component.state.count).toBe(1);
//
// E2E tests should generally remain independent of component implementation.

// ---------------------------------------------------------------------
// 19. Forms are useful E2E workflows
// ---------------------------------------------------------------------

// A form workflow can verify multiple layers:
//
// 1. The form renders.
// 2. Labels identify inputs.
// 3. User input is accepted.
// 4. Client-side validation runs.
// 5. Submission occurs.
// 6. The backend receives the request.
// 7. The UI displays the result.
//
// Example:
//
// await page.getByLabel("Name").fill("John Doe");
// await page.getByLabel("Email").fill("john.doe@example.com");
// await page.getByRole("button", {name: "Submit"}).click();
//
// await expect(page.getByText("Form submitted")).toBeVisible();

// ---------------------------------------------------------------------
// 20. Navigation workflows
// ---------------------------------------------------------------------

// E2E tests can verify that different parts of an application work together.
//
// Example:
//
// await page.goto("/");
//
// await page.getByRole("link", {name: "Products"}).click();
//
// await expect(page).toHaveURL(/\/products$/);
// await expect(
//     page.getByRole("heading", {name: "Products"}),
// ).toBeVisible();
//
// await page.getByRole("link", {name: "Product details"}).click();
//
// await expect(page).toHaveURL(/\/products\/.+/);
//
// This validates routing, navigation, and rendered application state together.

// ---------------------------------------------------------------------
// 21. Error workflows
// ---------------------------------------------------------------------

// E2E tests should also verify important failure paths.
//
// Examples:
//
// - invalid form input;
// - unauthorized access;
// - expired session;
// - unavailable backend;
// - failed save operation;
// - missing resource.
//
// Example:
//
// await page.getByLabel("Email").fill("invalid");
// await page.getByRole("button", {name: "Submit"}).click();
//
// await expect(
//     page.getByText("Enter a valid email address."),
// ).toBeVisible();
//
// Error paths are often part of the product contract and should not be
// represented only by successful workflows.

// ---------------------------------------------------------------------
// 22. Responsive behavior
// ---------------------------------------------------------------------

// Browser automation can test behavior at different viewport sizes.
//
// Examples:
//
// desktop
// tablet
// mobile
//
// A responsive test might verify that:
//
// - navigation remains accessible;
// - controls remain usable;
// - content does not disappear unexpectedly;
// - mobile navigation opens;
// - important actions remain reachable.
//
// Example:
//
// await page.setViewportSize({
//     width: 390,
//     height: 844,
// });
//
// await page.getByRole("button", {name: "Open menu"}).click();
//
// await expect(
//     page.getByRole("navigation"),
// ).toBeVisible();
//
// The exact viewport API depends on the E2E framework.

// ---------------------------------------------------------------------
// 23. Cross-browser testing
// ---------------------------------------------------------------------

// Browser automation frameworks can often execute the same workflow against
// multiple browser engines.
//
// A project may test:
//
// - Chromium-based browsers;
// - Firefox;
// - WebKit-based browsers.
//
// Cross-browser testing can reveal differences in:
//
// - rendering;
// - browser APIs;
// - input behavior;
// - navigation;
// - CSS;
// - event handling.
//
// The required browser matrix should reflect the application's supported
// browser population.

// ---------------------------------------------------------------------
// 24. Screenshots and traces
// ---------------------------------------------------------------------

// E2E frameworks commonly provide debugging artifacts such as:
//
// - screenshots;
// - videos;
// - traces;
// - browser console logs;
// - network information.
//
// These artifacts can help identify why a browser workflow failed.
//
// A screenshot can show the rendered state at failure time.
//
// A trace can provide a timeline of navigation, interactions, network
// activity, and browser state.

// ---------------------------------------------------------------------
// 25. Debugging a failed E2E test
// ---------------------------------------------------------------------

// A useful debugging process is:
//
// 1. Identify the exact failing workflow.
// 2. Determine which step failed.
// 3. Inspect the browser state at that point.
// 4. Check console and network errors.
// 5. Inspect screenshots or traces when available.
// 6. Determine whether the failure is application behavior,
//    test synchronization, environment setup, or test data.
// 7. Reproduce the smallest relevant workflow.
// 8. Fix the underlying problem rather than adding arbitrary delays.

// ---------------------------------------------------------------------
// 26. Flaky E2E tests
// ---------------------------------------------------------------------

// E2E tests are particularly susceptible to flakiness because they involve
// more layers and external state.
//
// Common causes include:
//
// - arbitrary waits;
// - race conditions;
// - shared test data;
// - external services;
// - network instability;
// - incomplete cleanup;
// - environment differences;
// - animations or transitions;
// - time-dependent behavior.
//
// Prefer deterministic test data and condition-based waiting.

// ---------------------------------------------------------------------
// 27. Avoid test-order dependencies
// ---------------------------------------------------------------------

// Fragile:
//
// test("creates a profile", ...);
// test("edits the profile created by the previous test", ...);
//
// The second test depends on the first.
//
// Better:
//
// test("edits a profile", async ({page}) => {
//     const profile = await createTestProfile();
//
//     await page.goto(`/profiles/${profile.id}`);
//     ...
// });
//
// Each test owns the state it requires.

// ---------------------------------------------------------------------
// 28. E2E test boundaries
// ---------------------------------------------------------------------

// Not every behavior should be tested through E2E.
//
// Unit tests are generally better suited to:
//
// - pure functions;
// - complex calculations;
// - isolated utilities;
// - individual validation rules.
//
// Integration tests are useful for:
//
// - component interactions;
// - providers;
// - forms;
// - hooks;
// - multiple application modules.
//
// E2E tests are useful for:
//
// - critical user workflows;
// - routing;
// - authentication;
// - important cross-layer behavior;
// - browser-specific behavior.
//
// Use each level where it provides useful coverage.

// ---------------------------------------------------------------------
// 29. The testing pyramid
// ---------------------------------------------------------------------

// A typical strategy contains:
//
//              E2E
//             /   \
//            /     \
//       Integration
//          /     \
//         /       \
//        Unit tests
//
// Unit tests are usually fast and numerous.
//
// Integration tests exercise larger portions of the application.
//
// E2E tests exercise complete workflows and are generally more expensive to
// run and maintain.
//
// The exact distribution should reflect the application rather than a fixed
// numerical rule.

// ---------------------------------------------------------------------
// 30. Critical-path E2E tests
// ---------------------------------------------------------------------

// E2E suites should prioritize workflows whose failure has significant
// user-facing consequences.
//
// Examples:
//
// - signing in;
// - creating an important record;
// - completing a primary transaction;
// - submitting a critical form;
// - navigating a central workflow.
//
// The test suite should remain focused enough that failures are actionable.

// ---------------------------------------------------------------------
// 31. Page objects
// ---------------------------------------------------------------------

// A page object can encapsulate selectors and common interactions for a page.
//
// Example:
//
// class ProfilePage {
//     constructor(private readonly page: Page) {}
//
//     readonly nameInput = this.page.getByLabel("Name");
//     readonly saveButton = this.page.getByRole("button", {name: "Save"});
//
//     async save(): Promise<void> {
//         await this.saveButton.click();
//     }
// }
//
// The exact Page type and APIs depend on the selected E2E framework.
//
// Page objects can reduce duplication, but they should not hide the actual
// behavior being verified behind excessively abstract helpers.

// ---------------------------------------------------------------------
// 32. Fixtures
// ---------------------------------------------------------------------

// Fixtures provide reusable test setup.
//
// A fixture can provide:
//
// - an authenticated page;
// - test data;
// - a configured API client;
// - a temporary resource;
// - a browser context.
//
// Conceptually:
//
// test("profile workflow", async ({authenticatedPage}) => {
//     await authenticatedPage.goto("/profile");
//     ...
// });
//
// Framework-specific fixture systems can make repeated setup concise while
// preserving test isolation.

// ---------------------------------------------------------------------
// 33. Cleanup
// ---------------------------------------------------------------------

// E2E tests should clean up resources they create.
//
// Possible resources include:
//
// - database records;
// - uploaded files;
// - temporary accounts;
// - browser contexts;
// - test servers.
//
// Cleanup can happen:
//
// - after each test;
// - after a test suite;
// - through isolated test databases;
// - through automatically generated temporary data.
//
// Cleanup strategy depends on the application's architecture.

// ---------------------------------------------------------------------
// 34. Environment configuration
// ---------------------------------------------------------------------

// E2E tests often require environment-specific configuration:
//
// - application URL;
// - API URL;
// - test credentials;
// - database configuration;
// - feature flags.
//
// Keep secrets out of source code.
//
// Example:
//
// const baseUrl = process.env.TEST_BASE_URL;
//
// The exact configuration mechanism depends on the test framework and
// deployment environment.

// ---------------------------------------------------------------------
// 35. CI execution
// ---------------------------------------------------------------------

// E2E tests are commonly executed in CI:
//
// source changes
//     ↓
// build application
//     ↓
// start test environment
//     ↓
// run E2E suite
//     ↓
// collect artifacts
//     ↓
// report result
//
// CI environments should reproduce the dependencies required by the tests,
// including the application server, browser binaries, and backend services.

// ---------------------------------------------------------------------
// 36. Parallel execution
// ---------------------------------------------------------------------

// E2E frameworks can often run tests in parallel.
//
// Parallel execution reduces total test time but requires isolation.
//
// Tests that share:
//
// - accounts;
// - database records;
// - files;
// - ports;
// - global configuration;
//
// can interfere with one another.
//
// Parallelization should therefore be introduced together with appropriate
// isolation rather than assuming every test is independent.

// ---------------------------------------------------------------------
// 37. Authentication state and parallel tests
// ---------------------------------------------------------------------

// Reusing one mutable authenticated account across parallel tests can cause
// interference.
//
// For example:
//
// test A changes the user's profile
// test B expects the original profile
//
// The tests can race.
//
// Prefer isolated users or isolated application state when tests modify
// persistent data.

// ---------------------------------------------------------------------
// 38. Real backend versus mocked backend
// ---------------------------------------------------------------------

// Real backend:
//
// browser
//   ↓
// frontend
//   ↓
// API
//   ↓
// database
//
// Advantages:
// - validates more integration boundaries;
// - exercises realistic behavior;
// - can catch contract mismatches.
//
// Costs:
// - more infrastructure;
// - slower execution;
// - more state management;
// - more potential failure sources.
//
// Mocked backend:
//
// browser
//   ↓
// frontend
//   ↓
// intercepted response
//
// Advantages:
// - deterministic responses;
// - faster execution;
// - easier failure-path testing.
//
// Costs:
// - does not validate the real backend interaction.
//
// Both approaches can be useful for different E2E scenarios.

// ---------------------------------------------------------------------
// 39. E2E tests and accessibility
// ---------------------------------------------------------------------

// E2E workflows are an opportunity to exercise accessible interaction paths.
//
// Prefer:
//
// page.getByRole("button", {name: "Save"});
// page.getByLabel("Email");
//
// These selectors encourage tests to use semantic interfaces.
//
// However, E2E tests do not replace dedicated accessibility testing.
// Accessibility requirements can include many concerns beyond whether a
// particular selector can locate an element.

// ---------------------------------------------------------------------
// 40. E2E tests and implementation details
// ---------------------------------------------------------------------

// Avoid assertions such as:
//
// expect(page.locator(".react-component-instance")).toHaveAttribute(...);
//
// or assumptions about:
//
// - React component names;
// - internal state variables;
// - CSS class names that have no user-facing meaning;
// - DOM nesting that is not part of the interface.
//
// Prefer the public behavior:
//
// - visible content;
// - accessible controls;
// - navigation;
// - submitted data;
// - resulting UI state.

// ---------------------------------------------------------------------
// 41. Example critical workflow
// ---------------------------------------------------------------------

// A complete workflow might look like:
//
// test("user can create a profile", async ({page}) => {
//     await page.goto("/profile/new");
//
//     await page.getByLabel("Name").fill("John Doe");
//     await page.getByLabel("Email").fill("john.doe@example.com");
//
//     await page.getByRole("button", {name: "Create profile"}).click();
//
//     await expect(
//         page.getByRole("heading", {name: "Profile created"}),
//     ).toBeVisible();
//
//     await expect(
//         page.getByText("John Doe"),
//     ).toBeVisible();
// });
//
// The test verifies the complete workflow rather than individual React
// components in isolation.

// ---------------------------------------------------------------------
// 42. Keep E2E tests maintainable
// ---------------------------------------------------------------------

// Maintainable E2E tests generally:
//
// - use stable selectors;
// - avoid arbitrary delays;
// - isolate test data;
// - wait for observable conditions;
// - keep workflows focused;
// - reuse setup carefully;
// - clean up created state;
// - capture useful debugging artifacts;
// - avoid implementation-specific assertions.
//
// E2E tests are more expensive than unit tests, so every workflow should
// justify its maintenance cost.

// ---------------------------------------------------------------------
// 43. E2E test naming
// ---------------------------------------------------------------------

// Test names should describe the user behavior:
//
// "user can sign in with valid credentials"
// "user sees a validation message for an invalid email"
// "user can create a profile"
// "user can navigate from the dashboard to profile settings"
//
// Avoid names that describe implementation:
//
// "click handler works"
// "component state changes"
// "API function is called"
//
// The E2E level is concerned with the resulting application behavior.

// ---------------------------------------------------------------------
// 44. Choosing an E2E framework
// ---------------------------------------------------------------------

// Common browser E2E frameworks include:
//
// - Playwright;
// - Cypress.
//
// They overlap substantially in their ability to automate browser workflows,
// but differ in architecture, APIs, debugging tools, browser support details,
// configuration, and execution model.
//
// The appropriate choice depends on project requirements and existing tooling.

// ---------------------------------------------------------------------
// 45. E2E versus browser component testing
// ---------------------------------------------------------------------

// Browser component testing renders an individual component in a browser
// environment.
//
// E2E testing navigates through the complete application.
//
// Component testing:
//
// browser
//   ↓
// one component
//
// E2E:
//
// browser
//   ↓
// application
//   ↓
// routes
//   ↓
// APIs
//   ↓
// persistent state
//
// These approaches can complement each other.

// ---------------------------------------------------------------------
// 46. E2E test reliability
// ---------------------------------------------------------------------

// A reliable E2E test should control or isolate:
//
// - application state;
// - test data;
// - authentication;
// - external services;
// - timing;
// - randomness;
// - browser state;
// - environment configuration.
//
// It should then wait for observable conditions and assert meaningful
// user-facing outcomes.

// ---------------------------------------------------------------------
// 47. Practical E2E workflow
// ---------------------------------------------------------------------

// A practical workflow for creating an E2E test is:
//
// 1. Identify a meaningful user workflow.
// 2. Define the starting application state.
// 3. Establish deterministic test data.
// 4. Navigate to the relevant page.
// 5. Interact through accessible user-facing controls.
// 6. Wait for observable application state.
// 7. Assert the expected outcome.
// 8. Clean up persistent state when necessary.
// 9. Capture debugging artifacts on failure.
// 10. Run the workflow independently and in CI.
//
// The resulting test should verify a user-visible behavior across the
// application boundary.

// ---------------------------------------------------------------------
// 48. What E2E testing does not guarantee
// ---------------------------------------------------------------------

// Passing E2E tests do not prove that:
//
// - every function is covered;
// - every conditional branch is tested;
// - every component state is exercised;
// - every API endpoint is correct;
// - every browser is supported;
// - every accessibility requirement is satisfied.
//
// E2E tests provide evidence about the workflows they actually exercise.
//
// Other testing levels remain necessary for broader coverage.

// ---------------------------------------------------------------------
// 49. E2E testing in a complete test strategy
// ---------------------------------------------------------------------

// A layered test strategy can look like:
//
// Unit
//   ↓
// validates isolated logic
//
// Integration
//   ↓
// validates interactions between application units
//
// E2E
//   ↓
// validates critical user workflows across the application
//
// Each layer answers different questions.
//
// E2E tests should complement, not replace, lower-level tests.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - End-to-end testing verifies complete user workflows through a running application.
// - E2E tests can exercise the browser, React application, routing, APIs, and persistent state together.
// - E2E tests should focus on meaningful user behavior rather than implementation details.
// - Accessible selectors such as roles and labels generally provide stable user-facing test contracts.
// - Condition-based waiting is preferable to arbitrary timeouts.
// - Each E2E test should establish and isolate the application state it requires.
// - Authentication, test data, network dependencies, and persistent state require deliberate isolation strategies.
// - Real backend integration and network interception serve different testing purposes and can both be useful.
// - Screenshots, traces, videos, and logs can help diagnose browser-level failures.
// - Parallel execution requires isolation of mutable accounts, data, files, and other shared resources.
// - Unit, integration, and E2E tests serve different purposes and should complement one another.
// - Playwright and Cypress are common browser E2E frameworks with overlapping capabilities and different tooling models.
// - E2E tests provide evidence about specific workflows rather than guaranteeing complete application correctness.
