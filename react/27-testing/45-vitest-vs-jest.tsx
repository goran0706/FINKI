/**
 * Vitest vs. Jest
 * ===============
 *
 * Vitest and Jest are JavaScript and TypeScript test runners that provide test execution,
 * assertions, mocks, spies, fake timers, lifecycle hooks, and other testing features.
 * Their APIs are intentionally similar in many areas, but they differ in configuration,
 * module transformation, ecosystem integration, and the way projects typically adopt them.
 *
 * The choice between them depends on the project's build tooling, existing test infrastructure,
 * ecosystem requirements, and migration constraints rather than on the test syntax alone.
 */

// ---------------------------------------------------------------------
// 1. Core responsibilities
// ---------------------------------------------------------------------

// Both Vitest and Jest can provide:
//
// - test discovery and execution;
// - describe / it / test;
// - expect assertions;
// - mock functions;
// - spies;
// - fake timers;
// - lifecycle hooks;
// - snapshot testing;
// - coverage integration.
//
// React projects commonly combine either test runner with Testing Library.
//
// Vitest:
//
// Vitest
//   ├── test runner
//   ├── assertions
//   ├── mocks and spies
//   ├── timers
//   └── Vite-oriented tooling
//
// Jest:
//
// Jest
//   ├── test runner
//   ├── assertions
//   ├── mocks and spies
//   ├── timers
//   └── Jest-specific configuration and tooling

// ---------------------------------------------------------------------
// 2. Similar test syntax
// ---------------------------------------------------------------------

// The basic structure is intentionally similar.
//
// Vitest:
//
// import {describe, expect, it} from "vitest";
//
// describe("add", () => {
//     it("adds two numbers", () => {
//         expect(2 + 3).toBe(5);
//     });
// });
//
// Jest:
//
// import {describe, expect, it} from "@jest/globals";
//
// describe("add", () => {
//     it("adds two numbers", () => {
//         expect(2 + 3).toBe(5);
//     });
// });
//
// The conceptual structure is the same:
// - group the behavior;
// - execute the test;
// - assert the result.

// ---------------------------------------------------------------------
// 3. Test declarations
// ---------------------------------------------------------------------

// Both runners support describe, it, and test-style declarations.
//
// Vitest:
//
// describe("calculator", () => {
//     it("adds numbers", () => {
//         expect(2 + 3).toBe(5);
//     });
// });
//
// Jest:
//
// describe("calculator", () => {
//     test("adds numbers", () => {
//         expect(2 + 3).toBe(5);
//     });
// });
//
// Vitest and Jest both support it and test as test declarations.
//
// The practical difference is usually the imported or globally configured
// test API, not the structure of the test itself.

// ---------------------------------------------------------------------
// 4. Assertions
// ---------------------------------------------------------------------

// Both runners provide an expect API with many equivalent matchers.
//
// Vitest:
//
// import {expect} from "vitest";
//
// expect(value).toBe(expected);
//
// Jest:
//
// import {expect} from "@jest/globals";
//
// expect(value).toBe(expected);
//
// Common matchers include:
//
// - toBe
// - toEqual
// - toStrictEqual
// - toContain
// - toHaveLength
// - toThrow
// - toBeTruthy
// - toBeFalsy
// - toBeNull
// - toBeUndefined
//
// The assertion style is therefore highly portable between the two runners.

// ---------------------------------------------------------------------
// 5. Mock functions
// ---------------------------------------------------------------------

// Both runners provide mock-function APIs.
//
// Vitest:
//
// import {vi} from "vitest";
//
// const callback = vi.fn();
//
// Jest:
//
// import {jest} from "@jest/globals";
//
// const callback = jest.fn();
//
// The main naming difference is:
//
// Vitest -> vi
// Jest   -> jest
//
// The underlying testing concept is the same: create a controllable function
// that records calls, arguments, return values, and invocation behavior.

// ---------------------------------------------------------------------
// 6. Mock return values
// ---------------------------------------------------------------------

// Vitest:
//
// const getName = vi.fn().mockReturnValue("John Doe");
// const getUser = vi.fn().mockResolvedValue({
//     id: "user-1",
//     name: "John Doe",
// });
//
// Jest:
//
// const getName = jest.fn().mockReturnValue("John Doe");
// const getUser = jest.fn().mockResolvedValue({
//     id: "user-1",
//     name: "John Doe",
// });
//
// The APIs are intentionally very similar.
//
// This makes many mock-based tests straightforward to migrate between
// Vitest and Jest.

// ---------------------------------------------------------------------
// 7. Spies
// ---------------------------------------------------------------------

// Vitest:
//
// const spy = vi.spyOn(console, "log");
//
// Jest:
//
// const spy = jest.spyOn(console, "log");
//
// Both can observe calls to an existing method and can optionally replace
// its implementation.
//
// The primary syntax difference is again the mocking namespace:
//
// vi.spyOn(...)
// jest.spyOn(...)

// ---------------------------------------------------------------------
// 8. Fake timers
// ---------------------------------------------------------------------

// Both runners provide fake timers.
//
// Vitest:
//
// vi.useFakeTimers();
// vi.advanceTimersByTime(1_000);
// vi.useRealTimers();
//
// Jest:
//
// jest.useFakeTimers();
// jest.advanceTimersByTime(1_000);
// jest.useRealTimers();
//
// Both approaches allow tests to control timer-based behavior without
// waiting for real wall-clock time.

// ---------------------------------------------------------------------
// 9. System time
// ---------------------------------------------------------------------

// Both runners can control the system clock used by application code.
//
// Vitest:
//
// vi.useFakeTimers();
// vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));
//
// Jest:
//
// jest.useFakeTimers();
// jest.setSystemTime(new Date("2026-01-15T12:00:00Z"));
//
// This is useful when application behavior depends on Date.now(),
// timers, or other clock-related behavior.

// ---------------------------------------------------------------------
// 10. Lifecycle hooks
// ---------------------------------------------------------------------

// Both runners provide:
//
// - beforeEach
// - afterEach
// - beforeAll
// - afterAll
//
// Vitest:
//
// import {afterEach, beforeEach} from "vitest";
//
// Jest:
//
// import {afterEach, beforeEach} from "@jest/globals";
//
// The lifecycle model is therefore familiar when moving between the runners.

// ---------------------------------------------------------------------
// 11. Module mocking
// ---------------------------------------------------------------------

// Both runners support module mocking, but their module systems and mocking
// behavior are not identical.
//
// Vitest:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn(),
// }));
//
// Jest:
//
// jest.mock("./user-service", () => ({
//     getUser: jest.fn(),
// }));
//
// Although the surface syntax is similar, module mocking can require
// migration work because the runners use different transformation,
// module-loading, and mocking mechanisms.

// ---------------------------------------------------------------------
// 12. React component testing
// ---------------------------------------------------------------------

// Neither runner is a React-specific testing library.
//
// A typical React stack can use:
//
// Test runner
//     Vitest OR Jest
//
// UI testing
//     React Testing Library
//
// User interactions
//     user-event
//
// DOM assertions
//     jest-dom
//
// The runner executes the test and provides core test infrastructure.
// Testing Library provides the React and DOM testing model.

// ---------------------------------------------------------------------
// 13. React test example
// ---------------------------------------------------------------------

// The same React Testing Library test can usually be written with either
// runner with only the test-runner-specific imports changing.
//
// Vitest:
//
// import {describe, expect, it} from "vitest";
// import {render, screen} from "@testing-library/react";
//
// it("renders a greeting", () => {
//     render(<Greeting name="John Doe" />);
//
//     expect(screen.getByText("Hello, John Doe.")).toBeInTheDocument();
// });
//
// Jest:
//
// import {describe, expect, it} from "@jest/globals";
// import {render, screen} from "@testing-library/react";
//
// it("renders a greeting", () => {
//     render(<Greeting name="John Doe" />);
//
//     expect(screen.getByText("Hello, John Doe.")).toBeInTheDocument();
// });
//
// The React component and Testing Library interaction remain unchanged.

// ---------------------------------------------------------------------
// 14. Vite integration
// ---------------------------------------------------------------------

// Vitest is designed around Vite's tooling model.
//
// This can make it convenient for projects already using Vite because
// development and testing can share concepts such as:
//
// - module resolution;
// - aliases;
// - transformations;
// - plugins;
// - environment configuration.
//
// Example conceptual configuration:
//
// import {defineConfig} from "vitest/config";
//
// export default defineConfig({
//     test: {
//         environment: "jsdom",
//     },
// });
//
// The exact configuration depends on the project's Vite setup.

// ---------------------------------------------------------------------
// 15. Jest configuration
// ---------------------------------------------------------------------

// Jest has its own configuration model.
//
// A conceptual configuration can look like:
//
// export default {
//     testEnvironment: "jsdom",
//     setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
// };
//
// Jest can be configured through supported configuration files or package
// configuration.
//
// Its configuration model is independent of Vite's configuration model.

// ---------------------------------------------------------------------
// 16. Build tool relationship
// ---------------------------------------------------------------------

// A useful architectural distinction is:
//
// Vitest:
//
// Vite-based application
//        ↓
//      Vite
//        ↓
//     Vitest tests
//
// Jest:
//
// Application build tooling
//        ↓
//     Jest tests
//
// Jest can certainly be used in Vite projects, and Vitest can be used with
// projects that have more complex tooling. The diagram represents their
// typical integration model rather than a technical requirement.

// ---------------------------------------------------------------------
// 17. TypeScript
// ---------------------------------------------------------------------

// Both runners can be used with TypeScript test files.
//
// Example:
//
// interface User {
//     readonly id: string;
//     readonly name: string;
// }
//
// const user: User = {
//     id: "user-1",
//     name: "John Doe",
// };
//
// expect(user.name).toBe("John Doe");
//
// Running TypeScript tests and type-checking the project are separate concerns.
//
// A test runner may transform or execute TypeScript without replacing the
// project's dedicated TypeScript type-checking workflow.

// ---------------------------------------------------------------------
// 18. ESM and module behavior
// ---------------------------------------------------------------------

// Modern JavaScript projects commonly use ES modules:
//
// import {getUser} from "./user-service";
//
// Module behavior can differ between Vitest and Jest because their
// transformation and runtime integration models are different.
//
// This matters especially when migrating a project that uses:
//
// - native ESM;
// - CommonJS;
// - mixed module formats;
// - dynamic imports;
// - module mocking;
// - custom transformations.
//
// Tests that use only ordinary imports and dependency injection are generally
// less sensitive to these differences than heavily module-mocked tests.

// ---------------------------------------------------------------------
// 19. Globals versus explicit imports
// ---------------------------------------------------------------------

// Both runners can be configured so test APIs are available globally.
//
// Without globals, APIs can be imported explicitly.
//
// Vitest:
//
// import {describe, expect, it} from "vitest";
//
// Jest:
//
// import {describe, expect, it} from "@jest/globals";
//
// Explicit imports make the dependencies of a test file visible and can
// improve editor and TypeScript tooling behavior.
//
// Global configuration can reduce import noise but makes test APIs implicit.

// ---------------------------------------------------------------------
// 20. Coverage
// ---------------------------------------------------------------------

// Both runners support code coverage workflows.
//
// Vitest:
//
// vitest run --coverage
//
// Jest:
//
// jest --coverage
//
// Coverage can measure:
//
// - statements;
// - branches;
// - functions;
// - lines.
//
// The exact coverage provider, report formats, thresholds, and configuration
// depend on the project's setup.

// ---------------------------------------------------------------------
// 21. Snapshot testing
// ---------------------------------------------------------------------

// Both runners support snapshot testing.
//
// Vitest:
//
// expect(value).toMatchSnapshot();
//
// Jest:
//
// expect(value).toMatchSnapshot();
//
// The purpose is the same: serialize a value and compare it with a stored
// snapshot.
//
// Snapshot strategy should remain behavior-focused regardless of the runner.

// ---------------------------------------------------------------------
// 22. Test filtering
// ---------------------------------------------------------------------

// Both runners can filter tests during development.
//
// Examples:
//
// Vitest:
//
// vitest run -t "renders the greeting"
//
// Jest:
//
// jest -t "renders the greeting"
//
// Both also support running specific test files.
//
// The exact CLI flags available depend on the installed version and
// configuration, so project documentation should be used for advanced options.

// ---------------------------------------------------------------------
// 23. Watch mode
// ---------------------------------------------------------------------

// Both runners support watch-oriented development workflows.
//
// Vitest:
//
// vitest
//
// Jest:
//
// jest --watch
//
// Watch mode is useful when repeatedly modifying application code and
// immediately rerunning affected tests.

// ---------------------------------------------------------------------
// 24. Test isolation
// ---------------------------------------------------------------------

// Both runners provide mechanisms for test isolation, but the details of
// module state, workers, environments, and module mocking can differ.
//
// Regardless of runner, tests should avoid accidental shared mutable state:
//
// describe("isolated behavior", () => {
//     it("creates its own state", () => {
//         const values: string[] = [];
//
//         values.push("first");
//
//         expect(values).toEqual(["first"]);
//     });
// });
//
// Good test design reduces dependence on runner-specific isolation behavior.

// ---------------------------------------------------------------------
// 25. Migration from Jest to Vitest
// ---------------------------------------------------------------------

// Many straightforward Jest tests have close Vitest equivalents.
//
// Typical mechanical changes include:
//
// Jest:
//
// import {jest} from "@jest/globals";
// const mock = jest.fn();
// jest.spyOn(object, "method");
// jest.useFakeTimers();
//
// Vitest:
//
// import {vi} from "vitest";
// const mock = vi.fn();
// vi.spyOn(object, "method");
// vi.useFakeTimers();
//
// However, migration is not always a simple global replacement.
//
// Projects should also review:
//
// - module mocking;
// - configuration;
// - setup files;
// - environment configuration;
// - Jest-specific APIs;
// - custom transformers;
// - coverage configuration;
// - custom reporters;
// - test utilities;
// - CI commands.

// ---------------------------------------------------------------------
// 26. Migration from Vitest to Jest
// ---------------------------------------------------------------------

// The reverse migration has the same general pattern.
//
// Vitest:
//
// vi.fn();
// vi.spyOn(object, "method");
// vi.mock("./module");
//
// Jest:
//
// jest.fn();
// jest.spyOn(object, "method");
// jest.mock("./module");
//
// Again, a complete migration requires more than replacing vi with jest.
//
// Configuration and module behavior need to be reviewed as part of the move.

// ---------------------------------------------------------------------
// 27. Testing Library remains mostly unchanged
// ---------------------------------------------------------------------

// When a project uses React Testing Library, most component tests can remain
// conceptually identical.
//
// The following concerns belong to Testing Library:
//
// render(<Component />);
// screen.getByRole(...);
// screen.getByLabelText(...);
//
// The runner mainly changes the surrounding infrastructure:
//
// Vitest -> vi, Vitest configuration, Vitest CLI
// Jest   -> jest, Jest configuration, Jest CLI

// ---------------------------------------------------------------------
// 28. Mocking is a major migration concern
// ---------------------------------------------------------------------

// Tests that rely heavily on mocking imported modules require particular
// attention during a runner migration.
//
// For example:
//
// vi.mock("./api", () => ({
//     fetchUser: vi.fn(),
// }));
//
// and:
//
// jest.mock("./api", () => ({
//     fetchUser: jest.fn(),
// }));
//
// look similar but should not be assumed to have identical module-loading
// semantics in every situation.
//
// Dependency injection can reduce this migration cost:
//
// interface UserClient {
//     getUser: (id: string) => Promise<User>;
// }
//
// A component or function can receive UserClient as a dependency rather than
// relying on module-level mocking.

// ---------------------------------------------------------------------
// 29. When the choice is mostly about tooling
// ---------------------------------------------------------------------

// If a project's tests are mostly composed of:
//
// - describe / it;
// - expect;
// - Testing Library;
// - user-event;
// - straightforward mocks;
//
// the test code itself may look very similar in both runners.
//
// In that situation, the larger distinction may be the surrounding tooling:
//
// - existing build system;
// - configuration;
// - module handling;
// - CI setup;
// - plugins;
// - coverage tooling;
// - established project conventions.

// ---------------------------------------------------------------------
// 30. When existing Jest infrastructure matters
// ---------------------------------------------------------------------

// A project with substantial existing Jest infrastructure may have dependencies
// on Jest-specific behavior such as:
//
// - custom Jest configuration;
// - Jest-specific setup files;
// - module mocking patterns;
// - custom reporters;
// - Jest plugins;
// - Jest-specific utilities;
// - existing CI commands.
//
// Those dependencies should be inventoried before replacing the runner.

// ---------------------------------------------------------------------
// 31. When Vite integration matters
// ---------------------------------------------------------------------

// A Vite-based project may benefit from keeping the test tooling aligned with
// the Vite development environment.
//
// Vitest is designed specifically around this integration model.
//
// This does not mean Jest cannot test a Vite application. It means the project
// should account for the additional configuration needed when the application
// and test transformation environments differ.

// ---------------------------------------------------------------------
// 32. Performance considerations
// ---------------------------------------------------------------------

// Test performance depends on many factors:
//
// - number of tests;
// - test environment;
// - setup work;
// - module graph size;
// - transformation cost;
// - worker configuration;
// - mocking strategy;
// - filesystem access;
// - external services.
//
// Therefore, runner choice should not be reduced to a blanket claim that
// one runner is always faster.
//
// Measure representative project workloads when performance is important.

// ---------------------------------------------------------------------
// 33. Ecosystem considerations
// ---------------------------------------------------------------------

// Jest has a long-established ecosystem and extensive adoption across
// JavaScript projects.
//
// Vitest has strong integration with the Vite ecosystem and is commonly
// chosen by projects already using Vite.
//
// Ecosystem compatibility should be evaluated against the actual project's
// dependencies rather than treated as an abstract ranking.

// ---------------------------------------------------------------------
// 34. API comparison
// ---------------------------------------------------------------------

// The following table summarizes common conceptual equivalents:
//
// Concept              Vitest                    Jest
// ---------------------------------------------------------------------
// Test runner          Vitest                    Jest
// Mock function        vi.fn()                   jest.fn()
// Spy                  vi.spyOn()                jest.spyOn()
// Module mock          vi.mock()                 jest.mock()
// Fake timers          vi.useFakeTimers()        jest.useFakeTimers()
// Real timers          vi.useRealTimers()        jest.useRealTimers()
// Advance timers       vi.advanceTimersByTime()  jest.advanceTimersByTime()
// System time          vi.setSystemTime()        jest.setSystemTime()
// Restore spies        vi.restoreAllMocks()      jest.restoreAllMocks()
// Clear mocks          vi.clearAllMocks()        jest.clearAllMocks()
// Reset mocks          vi.resetAllMocks()        jest.resetAllMocks()
// Assertions           expect()                  expect()
// Group tests          describe()               describe()
// Test case            it() / test()             it() / test()

// The APIs are similar enough that test concepts transfer well between them.

// ---------------------------------------------------------------------
// 35. The important differences
// ---------------------------------------------------------------------

// The main differences to investigate for a real project are:
//
// 1. Build-tool integration
//    Vitest is designed around Vite; Jest has its own transformation/configuration model.
//
// 2. Module behavior
//    ESM, CommonJS, transformation, and module mocking can behave differently.
//
// 3. Configuration
//    Vitest and Jest use different configuration systems and option names.
//
// 4. Existing ecosystem
//    A project may already depend heavily on Jest-specific or Vite-specific tooling.
//
// 5. Migration cost
//    Simple tests can migrate easily, while heavily mocked or customized suites
//    may require substantial changes.
//
// 6. Project conventions
//    Existing team tooling and CI workflows can be more important than small
//    differences in test syntax.

// ---------------------------------------------------------------------
// 36. Choosing based on project constraints
// ---------------------------------------------------------------------

// Instead of treating one runner as universally preferable, evaluate:
//
// - Which build tool does the application already use?
// - Does the project already have Jest infrastructure?
// - Does the project already have Vite infrastructure?
// - How heavily does the suite depend on module mocking?
// - Are there Jest-specific utilities or plugins?
// - How complex is the test configuration?
// - What does the CI environment already support?
// - What migration work would actually be required?
// - Which runner fits the project's existing conventions?

// These questions produce a project-specific decision rather than a generic
// ranking between the two tools.

// ---------------------------------------------------------------------
// 37. A portable testing style
// ---------------------------------------------------------------------

export interface User {
  readonly id: string;
  readonly name: string;
}

export const getUserName = (user: User): string => user.name;

// Tests that focus on behavior and use dependency injection tend to be easier
// to move between test runners:
//
// describe("getUserName", () => {
//     it("returns the user's name", () => {
//         const user: User = {
//             id: "user-1",
//             name: "John Doe",
//         };
//
//         expect(getUserName(user)).toBe("John Doe");
//     });
// });
//
// The test depends on very little runner-specific behavior.

// ---------------------------------------------------------------------
// 38. Practical comparison
// ---------------------------------------------------------------------

// Vitest:
//
// - closely integrated with Vite;
// - familiar Jest-like API;
// - uses the vi namespace for mocks and spies;
// - uses Vite-oriented configuration;
// - often convenient in Vite-based applications.
//
// Jest:
//
// - mature standalone test framework;
// - broad existing adoption and ecosystem;
// - uses the jest namespace for mocks and spies;
// - uses Jest-specific configuration;
// - established in many existing React and JavaScript codebases.
//
// These are descriptive differences, not an overall quality ranking.

// ---------------------------------------------------------------------
// 39. Migration checklist
// ---------------------------------------------------------------------

// Before switching between Vitest and Jest, review:
//
// - test scripts;
// - test configuration;
// - setup files;
// - test environment;
// - globals versus explicit imports;
// - mocks and spies;
// - module mocking;
// - fake timers;
// - snapshots;
// - coverage;
// - custom reporters;
// - test utilities;
// - CI commands;
// - TypeScript configuration;
// - path aliases;
// - ESM and CommonJS behavior.
//
// Run the complete suite after migration and investigate failures individually
// rather than assuming that every failure represents an application defect.

// ---------------------------------------------------------------------
// 40. Conceptual conclusion
// ---------------------------------------------------------------------

// Vitest and Jest solve the same broad testing problem:
//
// source code
//     ↓
// test runner
//     ↓
// test execution
//     ↓
// assertions and reports
//
// Their test syntax is similar, but their surrounding tooling and module
// behavior can differ significantly.
//
// The practical comparison should therefore consider the whole testing stack,
// not just the number of characters required to write a mock function.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Vitest and Jest are test runners that provide many of the same core testing capabilities.
// - Their describe, it, expect, mock, spy, timer, and lifecycle concepts are highly similar.
// - Vitest uses vi for mocks and spies, while Jest uses jest.
// - Vitest is designed around the Vite tooling model, while Jest has its own configuration and transformation model.
// - React Testing Library and user-event can be used with either runner.
// - Module mocking, ESM/CommonJS behavior, configuration, and setup are important migration considerations.
// - Existing Jest infrastructure can make migration more involved than replacing vi with jest or vice versa.
// - Vite integration can be an important consideration for projects already built around Vite.
// - Test performance depends on the project's workload and configuration rather than a universal runner ranking.
// - Behavior-focused tests and dependency injection tend to reduce runner-specific coupling.
// - The appropriate comparison should consider the project's build tooling, existing infrastructure, dependencies, and migration requirements.
