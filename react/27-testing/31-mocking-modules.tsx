/**
 * Mocking Modules
 * ===============
 *
 * Module mocking replaces a module's imported behavior during a test so the test can
 * control external dependencies without executing their real implementation. Vitest
 * provides `vi.mock` and related APIs for replacing modules and controlling mocked exports.
 */

import { vi } from "vitest";

// ---------------------------------------------------------------------
// 1. Why mock a module
// ---------------------------------------------------------------------

// A component or function may depend on another module:
//
// import {getUser} from "./user-service";
//
// export const UserProfile = async (): Promise<ReactElement> => {
//     const user = await getUser();
//
//     return <p>{user.name}</p>;
// };
//
// A module mock allows the test to control `getUser` without making a real
// network request or executing the service's production implementation.

// ---------------------------------------------------------------------
// 2. Basic module mocking
// ---------------------------------------------------------------------

// `vi.mock` replaces the specified module for the test:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn(),
// }));
//
// Imports of `./user-service` in the test module now receive the mocked module.
//
// The mock factory should return the exports that the tested code expects.

// ---------------------------------------------------------------------
// 3. Mocking a named export
// ---------------------------------------------------------------------

// Suppose the production module exports:
//
// export const getUser = async (id: string): Promise<User> => {
//     // Real implementation.
// };
//
// The test can replace that module:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn(),
// }));
//
// The imported `getUser` is now a mock function and can be configured:
//
// import {getUser} from "./user-service";
//
// vi.mocked(getUser).mockResolvedValue({
//     id: "42",
//     name: "John Doe",
// });
//
// The tested code receives the controlled result instead of calling the real
// implementation.

// ---------------------------------------------------------------------
// 4. TypeScript-aware mocked imports
// ---------------------------------------------------------------------

interface User {
  readonly id: string;
  readonly name: string;
}

// `vi.mocked` provides TypeScript-aware access to a mocked import:
//
// import {getUser} from "./user-service";
//
// vi.mocked(getUser).mockResolvedValue({
//     id: "42",
//     name: "John Doe",
// });
//
// This is preferable to manually casting the imported function to a mock type.

// ---------------------------------------------------------------------
// 5. Mocking an entire module
// ---------------------------------------------------------------------

// A complete module replacement can provide several mocked exports:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn(),
//     saveUser: vi.fn(),
//     deleteUser: vi.fn(),
// }));
//
// Every import of the mocked module within the test's module graph receives
// the replacement exports.

// ---------------------------------------------------------------------
// 6. Mocking one function while preserving other exports
// ---------------------------------------------------------------------

// `importOriginal` allows a mock factory to load the original module and replace
// only selected exports:
//
// vi.mock("./user-service", async (importOriginal) => {
//     const actual = await importOriginal<typeof import("./user-service")>();
//
//     return {
//         ...actual,
//         getUser: vi.fn(),
//     };
// });
//
// This is useful when most of a module should retain its real behavior while
// one dependency needs to be controlled.

// ---------------------------------------------------------------------
// 7. Configuring a mocked function
// ---------------------------------------------------------------------

// Once the module is mocked, its function can be configured per test:
//
// import {getUser} from "./user-service";
//
// vi.mocked(getUser).mockResolvedValue({
//     id: "42",
//     name: "John Doe",
// });
//
// The mock can also return different values on successive calls:
//
// vi.mocked(getUser)
//     .mockResolvedValueOnce({
//         id: "42",
//         name: "John Doe",
//     })
//     .mockResolvedValueOnce({
//         id: "43",
//         name: "Jane Doe",
//     });
//
// This makes the dependency's behavior deterministic.

// ---------------------------------------------------------------------
// 8. Mocking rejected Promises
// ---------------------------------------------------------------------

// Async module functions can be configured to reject:
//
// vi.mocked(getUser).mockRejectedValue(
//     new Error("User request failed"),
// );
//
// A component or function that depends on `getUser` can then be tested against
// its error-handling path without causing a real service failure.

// ---------------------------------------------------------------------
// 9. Mocking synchronous exports
// ---------------------------------------------------------------------

// Module mocks are not limited to asynchronous functions:
//
// vi.mock("./feature-flags", () => ({
//     isEnabled: vi.fn(),
// }));
//
// import {isEnabled} from "./feature-flags";
//
// vi.mocked(isEnabled).mockReturnValue(true);
//
// The tested code sees the configured value whenever it calls `isEnabled`.

// ---------------------------------------------------------------------
// 10. Mocking default exports
// ---------------------------------------------------------------------

// A module with a default export can be mocked by returning `default`:
//
// vi.mock("./analytics", () => ({
//     default: {
//         track: vi.fn(),
//     },
// }));
//
// If the production module contains:
//
// export default analytics;
//
// the test replacement provides the mocked default export.

// ---------------------------------------------------------------------
// 11. Mocking a module with both default and named exports
// ---------------------------------------------------------------------

// Both forms can be supplied:
//
// vi.mock("./analytics", () => ({
//     default: {
//         track: vi.fn(),
//     },
//     flush: vi.fn(),
// }));
//
// The mock factory must preserve the export shape expected by the importing code.

// ---------------------------------------------------------------------
// 12. Mocking before importing dependent code
// ---------------------------------------------------------------------

// Vitest transforms `vi.mock` calls so module mocking can be established before
// the affected module is evaluated:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn(),
// }));
//
// import {UserController} from "./user-controller";
//
// The controller receives the mocked `user-service` dependency.
//
// The important concept is that module mocking operates on the module graph,
// not merely on an already-created local variable.

// ---------------------------------------------------------------------
// 13. Module mock hoisting
// ---------------------------------------------------------------------

// `vi.mock` is hoisted by Vitest:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn(),
// }));
//
// const testValue = "example";
//
// Because the mock is hoisted, do not assume that ordinary top-level variables
// declared after `vi.mock` are available inside the mock factory.
//
// When a mock factory needs dynamically created values, use a mechanism designed
// for that purpose rather than relying on ordinary declaration order.

// ---------------------------------------------------------------------
// 14. `vi.doMock` for non-hoisted mocking
// ---------------------------------------------------------------------

// `vi.doMock` is not hoisted in the same way:
//
// vi.doMock("./user-service", () => ({
//     getUser: vi.fn(),
// }));
//
// const {getUser} = await import("./user-service");
//
// `doMock` is useful when the mock must be established dynamically before a
// subsequent dynamic import.
//
// Static imports are evaluated before ordinary runtime statements, so dynamic
// importing is important when the mock needs to affect that import.

// ---------------------------------------------------------------------
// 15. Mocking different implementations in one test file
// ---------------------------------------------------------------------

// A dynamic import can be used when separate tests require different module
// implementations:
//
// vi.doMock("./feature-flags", () => ({
//     isEnabled: () => true,
// }));
//
// const firstModule = await import("./feature-flags");
//
// vi.doUnmock("./feature-flags");
//
// vi.doMock("./feature-flags", () => ({
//     isEnabled: () => false,
// }));
//
// const secondModule = await import("./feature-flags");
//
// Each dynamic import occurs after its corresponding mock configuration.

// ---------------------------------------------------------------------
// 16. Restoring a mock's implementation
// ---------------------------------------------------------------------

// `mockRestore` restores a spy's original implementation:
//
// const spy = vi.spyOn(object, "method");
//
// spy.mockImplementation(() => "mocked");
//
// spy.mockRestore();
//
// This is different from replacing an entire module with `vi.mock`.
// Module mocking and spies should not be treated as interchangeable mechanisms.

// ---------------------------------------------------------------------
// 17. Resetting mock state
// ---------------------------------------------------------------------

// `mockClear` removes recorded calls while preserving the current implementation:
//
// vi.mocked(getUser).mockClear();
//
// `mockReset` clears calls and resets the mock implementation:
//
// vi.mocked(getUser).mockReset();
//
// `mockRestore` restores the original implementation when the mock is a spy:
//
// vi.spyOn(object, "method").mockRestore();
//
// Choose the operation according to whether the implementation itself should
// remain mocked.

// ---------------------------------------------------------------------
// 18. Clearing module mocks between tests
// ---------------------------------------------------------------------

// Test configuration can enable automatic mock cleanup:
//
// // vitest.config.ts
// export default defineConfig({
//     test: {
//         clearMocks: true,
//     },
// });
//
// Clearing mocks prevents call history from leaking between tests.
//
// Resetting and restoring mocks are separate configuration concerns and should
// be enabled only when their corresponding behavior is desired.

// ---------------------------------------------------------------------
// 19. Mocking a dependency used by a React component
// ---------------------------------------------------------------------

// Suppose a component imports:
//
// import {getUser} from "./user-service";
//
// export const UserProfile = async (): Promise<ReactElement> => {
//     const user = await getUser("42");
//
//     return <p>{user.name}</p>;
// };
//
// The test can replace the service:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn(),
// }));
//
// import {getUser} from "./user-service";
//
// vi.mocked(getUser).mockResolvedValue({
//     id: "42",
//     name: "John Doe",
// });
//
// The component test can now focus on how the component behaves with that
// service result rather than testing the service implementation itself.

// ---------------------------------------------------------------------
// 20. Mocking browser-facing modules
// ---------------------------------------------------------------------

// Browser-facing dependencies can also be replaced:
//
// vi.mock("./analytics", () => ({
//     trackPageView: vi.fn(),
// }));
//
// A component can import and call `trackPageView` normally:
//
// import {trackPageView} from "./analytics";
//
// The test can verify the integration:
//
// expect(trackPageView).toHaveBeenCalledWith("/profile");
//
// The mock keeps the test from sending real analytics events.

// ---------------------------------------------------------------------
// 21. Mocking a module while preserving its public API
// ---------------------------------------------------------------------

// A partial mock should retain the original module's other exports:
//
// vi.mock("./formatters", async (importOriginal) => {
//     const actual = await importOriginal<typeof import("./formatters")>();
//
//     return {
//         ...actual,
//         formatCurrency: vi.fn(() => "$100"),
//     };
// });
//
// This approach is useful when only one export needs to behave differently.

// ---------------------------------------------------------------------
// 22. Avoiding overly broad mocks
// ---------------------------------------------------------------------

// Avoid mocking large portions of the application when a smaller dependency
// can be controlled:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn(),
// }));
//
// A narrow mock keeps the rest of the application behavior real and makes the
// test's dependency boundary explicit.
//
// Over-mocking can make tests pass against behavior that differs from the real
// module graph.

// ---------------------------------------------------------------------
// 23. Mocking modules versus testing real integrations
// ---------------------------------------------------------------------

// Module mocking is appropriate when a dependency:
//
// - Performs network requests.
// - Reads external system state.
// - Sends analytics.
// - Depends on unavailable infrastructure.
// - Has behavior that must be deterministic for a specific test.
//
// It is less useful when the real implementation is fast, deterministic, and
// part of the behavior the test is intended to verify.

// ---------------------------------------------------------------------
// 24. Mocking does not replace integration testing
// ---------------------------------------------------------------------

// A mocked service test:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn(),
// }));
//
// verifies how the consumer behaves with a controlled dependency.
//
// A separate integration test can exercise the real service and consumer
// together.
//
// These tests answer different questions and should not be treated as
// interchangeable.

// ---------------------------------------------------------------------
// 25. Testing the mock interaction
// ---------------------------------------------------------------------

// A module mock can verify that the dependency was called correctly:
//
// vi.mocked(getUser).mockResolvedValue({
//     id: "42",
//     name: "John Doe",
// });
//
// await renderUserProfile();
//
// expect(getUser).toHaveBeenCalledWith("42");
//
// This assertion is appropriate when the interaction with the dependency is
// part of the consumer's contract. Avoid asserting incidental implementation
// calls that users do not care about.

// ---------------------------------------------------------------------
// 26. Avoiding mock leakage
// ---------------------------------------------------------------------

// A mock configured for one test should not accidentally affect another:
//
// beforeEach(() => {
//     vi.clearAllMocks();
// });
//
// afterEach(() => {
//     vi.restoreAllMocks();
// });
//
// `clearAllMocks` clears call history.
// `restoreAllMocks` restores spies and other restorable mocks.
//
// For module mocks, use explicit reset or unmock behavior when the test suite
// needs the real module again.

// ---------------------------------------------------------------------
// 27. Unmocking a module
// ---------------------------------------------------------------------

// `vi.unmock` removes a module from Vitest's automatic mock configuration:
//
// vi.unmock("./user-service");
//
// This is useful when a test file or suite needs to stop automatically mocking
// a module.
//
// For dynamically controlled mocking, `vi.doUnmock` can be used without the
// hoisting behavior of `vi.unmock`.

// ---------------------------------------------------------------------
// 28. Mocking modules in a setup file
// ---------------------------------------------------------------------

// Some modules need the same mock across many test files:
//
// // test/setup.ts
// vi.mock("./analytics", () => ({
//     trackPageView: vi.fn(),
// }));
//
// Shared setup can be appropriate for stable infrastructure dependencies.
// Avoid placing application-specific behavior in global setup when individual
// tests need different implementations.

// ---------------------------------------------------------------------
// 29. Common module-mocking mistakes
// ---------------------------------------------------------------------

// Common mistakes include:
//
// - Mocking after a static import and expecting runtime order to control it.
// - Returning the wrong export shape from a mock factory.
// - Forgetting `default` when mocking a default export.
// - Sharing mutable mock data between tests.
// - Using broad mocks that hide integration problems.
// - Testing mock implementation details instead of consumer behavior.
// - Confusing `vi.clearAllMocks()` with restoring the original implementation.
//
// Understanding the module graph is essential when diagnosing unexpected mocks.

// ---------------------------------------------------------------------
// 30. Complete module-mocking pattern
// ---------------------------------------------------------------------

// A typical Vitest module-mocking test follows this structure:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn(),
// }));
//
// import {getUser} from "./user-service";
//
// beforeEach(() => {
//     vi.clearAllMocks();
// });
//
// it("renders the user returned by the service", async () => {
//     vi.mocked(getUser).mockResolvedValue({
//         id: "42",
//         name: "John Doe",
//     });
//
//     render(<UserProfile />);
//
//     expect(
//         await screen.findByText("John Doe"),
//     ).toBeInTheDocument();
// });
//
// The module is replaced at the module boundary, while each test controls the
// behavior of the mocked export.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `vi.mock` replaces a module's exports for tests.
// - Mock factories should return the export shape expected by the consumer.
// - `vi.mocked` provides TypeScript-aware access to mocked imports.
// - `importOriginal` allows partial module mocks that preserve real exports.
// - `vi.doMock` provides runtime, non-hoisted module mocking for dynamic imports.
// - `mockClear` clears call history without changing the implementation.
// - `mockReset` clears call history and resets the mock implementation.
// - `mockRestore` restores the original implementation for restorable mocks and spies.
// - Module mocks should isolate external dependencies without hiding the behavior being tested.
// - Narrow mocks are generally easier to reason about than broad application-wide mocks.
// - Module mocking complements integration testing; it does not replace it.
// - Tests should verify the consumer's behavior and meaningful dependency interactions rather than mock internals.
