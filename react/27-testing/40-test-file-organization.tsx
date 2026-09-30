/**
 * Test File Organization
 * =======================
 *
 * Well-organized test files make test intent, setup, assertions, and related scenarios easy to find.
 * A consistent structure reduces cognitive overhead and makes tests easier to maintain as a suite grows.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { useState } from "react";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. A test file has a clear subject
// ---------------------------------------------------------------------

export interface CounterProps {
  readonly initialValue?: number;
}

export const Counter: FC<CounterProps> = ({ initialValue = 0 }): ReactElement => {
  const [count, setCount] = useState(initialValue);

  return (
    <section aria-label="Counter">
      <output aria-label="Count">{count}</output>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// A focused test file normally has a clear subject:
//
// Counter
//     -> rendering
//     -> initial state
//     -> interaction
//     -> resulting state
//
// The file should not become an unrelated collection of tests for multiple
// independent components.

// ---------------------------------------------------------------------
// 2. Imports belong at the top
// ---------------------------------------------------------------------

// Keep imports together:
//
// import {describe, expect, it} from "vitest";
// import {render, screen} from "@testing-library/react";
// import type {FC, ReactElement} from "react";
//
// Do not scatter imports throughout a test file.
// Grouping imports makes dependencies immediately visible.

// ---------------------------------------------------------------------
// 3. Separate production code from test code
// ---------------------------------------------------------------------

// In a real project, the component under test is normally imported:
//
// import {Counter} from "./Counter";
//
// The test file then contains the test-specific code.
//
// This tutorial defines `Counter` above so the file remains self-contained.
// Keeping the subject and its tests together here makes the organization
// pattern directly visible.

// ---------------------------------------------------------------------
// 4. Describe the subject
// ---------------------------------------------------------------------

describe("Counter", () => {
  // Tests for the same subject belong inside one focused suite.

  it("renders the initial count", () => {
    render(<Counter initialValue={5} />);

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("5");
  });
});

// The outer `describe` should answer:
//
// "What is being tested?"

// ---------------------------------------------------------------------
// 5. Organize tests around behavior
// ---------------------------------------------------------------------

describe("Counter behavior", () => {
  it("renders the initial count", () => {
    render(<Counter initialValue={3} />);

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("3");
  });

  it("uses zero when no initial value is provided", () => {
    render(<Counter />);

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("0");
  });
});

// Organizing by observable behavior is generally more useful than organizing
// by implementation details such as internal state variables or helper methods.

// ---------------------------------------------------------------------
// 6. Group related scenarios
// ---------------------------------------------------------------------

describe("Counter interactions", () => {
  it("increments the count", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();

    render(<Counter initialValue={2} />);

    await user.click(screen.getByRole("button", { name: "Increment" }));

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("3");
  });
});

// Related tests can be grouped under a nested `describe` when that grouping
// adds meaningful structure.

// ---------------------------------------------------------------------
// 7. Avoid excessive describe nesting
// ---------------------------------------------------------------------

// Avoid structures such as:
//
// describe("Counter", () => {
//     describe("component", () => {
//         describe("rendering", () => {
//             describe("initial state", () => {
//                 describe("positive values", () => {
//                     // Test.
//                 });
//             });
//         });
//     });
// });
//
// Excessive nesting makes test names difficult to read.
//
// Prefer a small number of meaningful levels:
//
// describe("Counter", () => {
//     describe("initial state", () => {
//         // Tests.
//     });
//
//     describe("interactions", () => {
//         // Tests.
//     });
// });

// ---------------------------------------------------------------------
// 8. Use descriptive test names
// ---------------------------------------------------------------------

describe("descriptive test names", () => {
  it("renders the initial count", () => {
    render(<Counter initialValue={7} />);

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("7");
  });

  it("increments the count when the increment button is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();

    render(<Counter initialValue={7} />);

    await user.click(screen.getByRole("button", { name: "Increment" }));

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("8");
  });
});

// A useful test name describes the observable behavior and scenario.
// Avoid names such as:
//
// it("works", ...)
// it("test counter", ...)
// it("should be okay", ...)

// ---------------------------------------------------------------------
// 9. Avoid implementation-oriented names
// ---------------------------------------------------------------------

// Prefer:
//
// it("increments the count when the button is clicked", ...);
//
// over:
//
// it("calls setCount", ...);
//
// Tests should describe the behavior that matters rather than the internal
// mechanism used to produce it.

// ---------------------------------------------------------------------
// 10. Arrange, act, assert
// ---------------------------------------------------------------------

describe("arrange act assert", () => {
  it("increments the displayed count", async () => {
    // Arrange
    const user = (await import("@testing-library/user-event")).default.setup();

    render(<Counter initialValue={4} />);

    // Act
    await user.click(screen.getByRole("button", { name: "Increment" }));

    // Assert
    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("5");
  });
});

// A clear Arrange -> Act -> Assert flow makes individual tests easy to scan.

// ---------------------------------------------------------------------
// 11. Keep the test body focused
// ---------------------------------------------------------------------

// Avoid:
//
// it("increments", async () => {
//     // Create unrelated data.
//     // Configure unrelated mocks.
//     // Build unrelated providers.
//     // Render multiple unrelated components.
//     // Click the button.
//     // Assert several unrelated behaviors.
// });
//
// A test should establish only the conditions necessary for its scenario.

// ---------------------------------------------------------------------
// 12. Put shared setup in hooks carefully
// ---------------------------------------------------------------------

let sharedValue = 0;

afterEach(() => {
  sharedValue = 0;
  cleanup();
});

// Hooks are appropriate for genuine repeated lifecycle concerns.
// They should not hide important test-specific setup.

// ---------------------------------------------------------------------
// 13. Keep test-specific setup inside the test
// ---------------------------------------------------------------------

describe("test-local setup", () => {
  it("uses a specific initial value", () => {
    const initialValue = 10;

    render(<Counter initialValue={initialValue} />);

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("10");
  });
});

// Important scenario inputs are often clearer when they appear directly in the
// test instead of being hidden in a broad `beforeEach` hook.

// ---------------------------------------------------------------------
// 14. Use beforeEach for genuine repeated setup
// ---------------------------------------------------------------------

describe("repeated setup", () => {
  let value: number;

  beforeEach(() => {
    value = 10;
  });

  it("starts from the configured value", () => {
    expect(value).toBe(10);
  });

  it("can modify the value independently", () => {
    value += 5;

    expect(value).toBe(15);
  });
});

// `beforeEach` is useful when every test in the scope genuinely needs the same
// initial condition.

// ---------------------------------------------------------------------
// 15. Keep setup scoped
// ---------------------------------------------------------------------

// Prefer:
//
// describe("API behavior", () => {
//     beforeEach(() => {
//         // API-specific setup.
//     });
//
//     it(...);
// });
//
// over a file-wide hook that prepares API state for unrelated rendering tests.
//
// Narrow scope reduces hidden dependencies.

// ---------------------------------------------------------------------
// 16. Keep teardown with the setup it reverses
// ---------------------------------------------------------------------

describe("resource lifecycle", () => {
  const resource = {
    close: vi.fn(),
  };

  afterEach(() => {
    resource.close();
    vi.clearAllMocks();
  });

  it("uses a resource", () => {
    expect(resource.close).not.toHaveBeenCalled();
  });
});

// When setup changes global or shared state, place the corresponding cleanup
// close to that lifecycle configuration.

// ---------------------------------------------------------------------
// 17. Keep mocks near the tests that use them
// ---------------------------------------------------------------------

const fetchUser = vi.fn();

describe("mocked dependency", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("uses the mocked user", async () => {
    fetchUser.mockResolvedValue({
      id: "42",
      name: "John Doe",
    });

    const user = await fetchUser();

    expect(user).toEqual({
      id: "42",
      name: "John Doe",
    });
  });
});

// A mock shared across a small suite can be declared near that suite.
// Avoid placing every mock in a large global section when only one test group
// needs it.

// ---------------------------------------------------------------------
// 18. Avoid unnecessary top-level mocks
// ---------------------------------------------------------------------

// Do not create dozens of module-level mocks merely for convenience:
//
// const apiMock = vi.fn();
// const loggerMock = vi.fn();
// const analyticsMock = vi.fn();
// const storageMock = vi.fn();
// const routerMock = vi.fn();
//
// If only one test uses a mock, keep it local:
//
// it("calls the dependency", () => {
//     const dependency = vi.fn();
//
//     // Test.
// });

// Local mocks make ownership and purpose obvious.

// ---------------------------------------------------------------------
// 19. Separate rendering tests from interaction tests
// ---------------------------------------------------------------------

describe("Counter rendering", () => {
  it("renders the initial count", () => {
    render(<Counter initialValue={6} />);

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("6");
  });
});

describe("Counter interactions", () => {
  it("increments the count", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();

    render(<Counter initialValue={6} />);

    await user.click(screen.getByRole("button", { name: "Increment" }));

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("7");
  });
});

// Separate sections can make a large suite easier to navigate, but grouping
// should remain based on meaningful behavior.

// ---------------------------------------------------------------------
// 20. Avoid duplicating the same test under multiple headings
// ---------------------------------------------------------------------

// Do not create:
//
// describe("rendering", () => {
//     it("renders the count", ...);
// });
//
// describe("initial state", () => {
//     it("renders the count", ...);
// });
//
// when both tests verify exactly the same contract.
//
// One focused test is preferable to duplicated coverage.

// ---------------------------------------------------------------------
// 21. Use nested describes for meaningful scenarios
// ---------------------------------------------------------------------

interface ToggleProps {
  readonly enabled: boolean;
}

export const Toggle: FC<ToggleProps> = ({ enabled }): ReactElement => {
  return (
    <button type="button" aria-pressed={enabled}>
      {enabled ? "Enabled" : "Disabled"}
    </button>
  );
};

describe("Toggle", () => {
  describe("when enabled", () => {
    it("shows the enabled state", () => {
      render(<Toggle enabled />);

      expect(screen.getByRole("button", { name: "Enabled" })).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("when disabled", () => {
    it("shows the disabled state", () => {
      render(<Toggle enabled={false} />);

      expect(screen.getByRole("button", { name: "Disabled" })).toHaveAttribute("aria-pressed", "false");
    });
  });
});

// Scenario-based nesting can make repeated conditions easier to understand.

// ---------------------------------------------------------------------
// 22. Avoid putting assertions in describe blocks
// ---------------------------------------------------------------------

// This is invalid test organization:
//
// describe("Counter", () => {
//     expect(true).toBe(true);
// });
//
// `describe` defines a suite. Assertions belong inside executable tests or
// lifecycle hooks when there is a specific setup/teardown reason.

// ---------------------------------------------------------------------
// 23. Avoid conditionals around test definitions
// ---------------------------------------------------------------------

// Avoid dynamically deciding whether to define tests:
//
// if (process.env.TEST_MODE === "extended") {
//     it("runs an additional scenario", () => {
//         // Test.
//     });
// }
//
// Conditional test definitions make the suite structure environment-dependent.
//
// Prefer stable test definitions and conditional behavior inside the test only
// when the condition is genuinely part of the test environment.

// ---------------------------------------------------------------------
// 24. Keep test order independent
// ---------------------------------------------------------------------

// Avoid:
//
// it("creates a user", ...);
//
// it("updates the user created by the previous test", ...);
//
// The second test depends on the first test having run successfully.
//
// Prefer each test to establish its own state:
//
// it("updates an existing user", () => {
//     const user = createUser();
//
//     // Update the user.
// });

// ---------------------------------------------------------------------
// 25. Use factories for repeated test data
// ---------------------------------------------------------------------

interface TestUser {
  readonly id: string;
  readonly name: string;
}

const createTestUser = (overrides: Partial<TestUser> = {}): TestUser => {
  return {
    id: "42",
    name: "John Doe",
    ...overrides,
  };
};

describe("user data", () => {
  it("uses the default user", () => {
    expect(createTestUser()).toEqual({
      id: "42",
      name: "John Doe",
    });
  });

  it("allows relevant values to be overridden", () => {
    expect(
      createTestUser({
        name: "Jane Doe",
      }),
    ).toEqual({
      id: "42",
      name: "Jane Doe",
    });
  });
});

// Factories reduce repetitive object construction without hiding the important
// values for an individual scenario.

// ---------------------------------------------------------------------
// 26. Keep helpers out of test bodies when reused
// ---------------------------------------------------------------------

// A helper used by many tests can live near the top of the file or in a shared
// test utility:
//
// const renderCounter = (initialValue = 0) => {
//     return render(
//         <Counter initialValue={initialValue} />,
//     );
// };
//
// Then:
//
// renderCounter(5);
//
// Keep one-off helpers local to the test that needs them.

// ---------------------------------------------------------------------
// 27. Avoid helper proliferation
// ---------------------------------------------------------------------

// Too many tiny helpers can make a test harder to follow:
//
// setup()
// renderComponent()
// getElement()
// clickElement()
// assertState()
// cleanupState()
//
// If each helper contains only one obvious line, direct test code may be clearer.
//
// Extract helpers when they remove meaningful repetition or represent a stable
// testing concept.

// ---------------------------------------------------------------------
// 28. Keep assertions close to the action
// ---------------------------------------------------------------------

describe("interaction flow", () => {
  it("shows the incremented count after clicking", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();

    render(<Counter initialValue={0} />);

    await user.click(screen.getByRole("button", { name: "Increment" }));

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("1");
  });
});

// Avoid inserting large unrelated blocks between the action and its assertion.

// ---------------------------------------------------------------------
// 29. Organize asynchronous tests clearly
// ---------------------------------------------------------------------

// A typical asynchronous test remains:
//
// it("loads the user", async () => {
//     render(<UserProfile />);
//
//     expect(
//         await screen.findByRole("heading", {name: "John Doe"}),
//     ).toBeInTheDocument();
// });
//
// Keep asynchronous setup, action, and assertion easy to distinguish.

// ---------------------------------------------------------------------
// 30. Group error scenarios
// ---------------------------------------------------------------------

// Error scenarios can form their own meaningful section:
//
// describe("error states", () => {
//     it("shows validation errors", ...);
//     it("shows a request error", ...);
//     it("allows recovery", ...);
// });
//
// This is useful when a component has multiple distinct failure paths.

// ---------------------------------------------------------------------
// 31. Group accessibility behavior when appropriate
// ---------------------------------------------------------------------

// A suite can explicitly organize accessibility behavior:
//
// describe("accessibility", () => {
//     it("exposes the button by its accessible name", ...);
//     it("associates the input with its label", ...);
// });
//
// The tests should still verify actual user-facing semantics rather than
// implementation-specific accessibility attributes.

// ---------------------------------------------------------------------
// 32. Group keyboard behavior when it is substantial
// ---------------------------------------------------------------------

// If keyboard interaction is a significant part of a component:
//
// describe("keyboard interaction", () => {
//     it("moves focus with Tab", ...);
//     it("submits with Enter", ...);
// });
//
// Do not create a separate section for a single trivial test unless the grouping
// improves navigation.

// ---------------------------------------------------------------------
// 33. Keep snapshot tests with their relevant behavior
// ---------------------------------------------------------------------

// If a snapshot is part of a rendering contract:
//
// describe("rendering", () => {
//     it("matches the stable output snapshot", () => {
//         // Render and snapshot.
//     });
// });
//
// Do not isolate every snapshot into a generic "snapshots" section if the
// snapshot belongs naturally to a specific behavior.

// ---------------------------------------------------------------------
// 34. Keep test names readable when nested
// ---------------------------------------------------------------------

// Nested:
//
// describe("when loading", () => {
//     it("shows a progress indicator", ...);
// });
//
// produces a meaningful combined test name:
//
// Counter > when loading > shows a progress indicator
//
// Avoid redundant names:
//
// describe("loading state", () => {
//     it("renders the loading state", ...);
// });
//
// when the resulting name adds little information.

// ---------------------------------------------------------------------
// 35. File-level organization pattern
// ---------------------------------------------------------------------

// A practical file structure is:
//
// 1. Imports
// 2. Subject imports or local test subject
// 3. Small test data factories
// 4. Small local helpers
// 5. Main describe block
// 6. Nested behavior/scenario groups
// 7. Tests
//
// The exact order can vary when another structure is clearer, but consistency
// within a project is valuable.

// ---------------------------------------------------------------------
// 36. Keep local helpers before the suite
// ---------------------------------------------------------------------

const renderDefaultCounter = (): RenderResult => {
  return render(<Counter />);
};

// A helper used throughout the suite can be defined before the `describe` block.
// This keeps the suite focused on scenarios and expectations.

// ---------------------------------------------------------------------
// 37. Use the helper without hiding important behavior
// ---------------------------------------------------------------------

describe("Counter with a default setup", () => {
  it("starts at zero", () => {
    renderDefaultCounter();

    expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("0");
  });
});

// The helper is appropriate here because the default setup is the same across
// the focused suite and the initial value is not the scenario under test.

// ---------------------------------------------------------------------
// 38. Keep specialized helpers explicit
// ---------------------------------------------------------------------

// If a helper changes important conditions, make those conditions visible:
//
// const renderCounterWithValue = (value: number) => {
//     return render(
//         <Counter initialValue={value} />,
//     );
// };
//
// Then:
//
// renderCounterWithValue(10);
//
// The parameter keeps the scenario visible.

// ---------------------------------------------------------------------
// 39. Avoid mixing unrelated subjects
// ---------------------------------------------------------------------

// Avoid one file containing:
//
// describe("Counter", ...);
// describe("UserProfile", ...);
// describe("CheckoutForm", ...);
// describe("Modal", ...);
//
// unless the file intentionally represents a shared integration scenario.
//
// Separate unit/component subjects into focused files when they have independent
// test concerns.

// ---------------------------------------------------------------------
// 40. Integration tests have broader boundaries
// ---------------------------------------------------------------------

// A broader integration test may intentionally contain multiple components:
//
// describe("profile workflow", () => {
//     it("allows a user to edit and save their profile", async () => {
//         // Render the workflow.
//         // Interact with multiple components.
//         // Assert the resulting user-visible state.
//     });
// });
//
// In this case, multiple components belong together because the workflow itself
// is the subject of the test.

// ---------------------------------------------------------------------
// 41. Test file names should describe the subject
// ---------------------------------------------------------------------

// Common naming patterns include:
//
// component-name.test.tsx
// component-name.spec.tsx
// feature-name.test.tsx
//
// The important property is consistency.
//
// A file name such as:
//
// UserProfile.test.tsx
//
// immediately communicates the primary subject.

// ---------------------------------------------------------------------
// 42. Keep test and source naming predictable
// ---------------------------------------------------------------------

// A predictable relationship helps navigation:
//
// UserProfile.tsx
// UserProfile.test.tsx
//
// or:
//
// user-profile.tsx
// user-profile.test.tsx
//
// The exact convention is project-specific.
// Consistency matters more than the particular suffix.

// ---------------------------------------------------------------------
// 43. Avoid giant test files
// ---------------------------------------------------------------------

// A test file that grows to hundreds of unrelated scenarios may indicate that
// responsibilities should be separated.
//
// For example:
//
// Counter.test.tsx
// Counter.accessibility.test.tsx
// Counter.integration.test.tsx
//
// can be appropriate when the suite becomes large enough to justify separation.
//
// Do not split files prematurely; organization should solve a real navigation
// or maintenance problem.

// ---------------------------------------------------------------------
// 44. Keep related tests together
// ---------------------------------------------------------------------

// If tests share the same subject and setup, keeping them together can improve
// context:
//
// describe("UserProfile", () => {
//     // Rendering.
//     // Editing.
//     // Validation.
//     // Saving.
// });
//
// Moving related tests into many tiny files can make the suite harder to navigate.

// ---------------------------------------------------------------------
// 45. Separate unit and integration concerns when necessary
// ---------------------------------------------------------------------

// Unit-style test:
//
// describe("formatUserName", () => {
//     it("formats the name", ...);
// });
//
// Integration-style test:
//
// describe("profile editing workflow", () => {
//     it("saves an edited profile", ...);
// });
//
// The distinction should be based on the test boundary, not simply on the
// filename.

// ---------------------------------------------------------------------
// 46. Keep test setup predictable
// ---------------------------------------------------------------------

// A reader should be able to locate:
//
// test data
//     -> beforeEach
//         -> test
//             -> assertion
//                 -> cleanup
//
// Avoid scattering relevant setup across unrelated sections of the file.

// ---------------------------------------------------------------------
// 47. Keep comments purposeful
// ---------------------------------------------------------------------

// Comments are useful for explaining why a non-obvious setup exists:
//
// // This provider is required because the component reads the current theme.
//
// renderWithProviders(<UserSummary />, {
//     theme: "dark",
// });
//
// Avoid comments that merely restate the code:
//
// // Render the component.
// render(<Counter />);

// ---------------------------------------------------------------------
// 48. Keep test descriptions stable
// ---------------------------------------------------------------------

// Test names should describe behavior rather than implementation details that
// may change during refactoring.
//
// Prefer:
//
// it("shows the saved state after submission", ...);
//
// over:
//
// it("sets isSaving to false after handleSubmit resolves", ...);
//
// The first remains meaningful even if the implementation changes completely.

// ---------------------------------------------------------------------
// 49. A complete organized suite
// ---------------------------------------------------------------------

describe("Counter", () => {
  describe("initial rendering", () => {
    it("renders zero by default", () => {
      render(<Counter />);

      expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("0");
    });

    it("renders a supplied initial value", () => {
      render(<Counter initialValue={5} />);

      expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("5");
    });
  });

  describe("incrementing", () => {
    it("increments the count when clicked", async () => {
      const user = (await import("@testing-library/user-event")).default.setup();

      render(<Counter initialValue={5} />);

      await user.click(screen.getByRole("button", { name: "Increment" }));

      expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("6");
    });

    it("increments from zero", async () => {
      const user = (await import("@testing-library/user-event")).default.setup();

      render(<Counter />);

      await user.click(screen.getByRole("button", { name: "Increment" }));

      expect(screen.getByRole("status", { name: "Count" })).toHaveTextContent("1");
    });
  });
});

// This structure communicates:
//
// Counter
//     -> initial rendering
//         -> default value
//         -> supplied value
//     -> incrementing
//         -> increment from custom value
//         -> increment from default value

// ---------------------------------------------------------------------
// 50. Final organization checklist
// ---------------------------------------------------------------------

// A well-organized test file should make these questions easy to answer:
//
// - What is being tested?
// - Where is the test subject configured?
// - What shared setup exists?
// - What behavior does each test cover?
// - What inputs are specific to the scenario?
// - Where does the action happen?
// - Where is the expected behavior asserted?
// - What cleanup occurs?
//
// If a reader must navigate through many helpers, hooks, mocks, and nested
// suites to answer these questions, the file may be over-abstracted.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Keep each test file focused on a clear subject or workflow.
// - Keep imports together at the top of the file.
// - Organize tests around observable behavior rather than implementation details.
// - Use `describe` blocks to group genuinely related scenarios.
// - Avoid excessive nesting because deeply nested suites reduce readability.
// - Use descriptive test names that communicate the expected behavior.
// - Keep important test inputs visible in individual tests.
// - Use lifecycle hooks for genuine repeated setup and cleanup rather than hiding test intent.
// - Scope shared setup and teardown as narrowly as practical.
// - Keep mocks close to the tests or suites that actually use them.
// - Use factories for repeated deterministic test data.
// - Extract helpers when they remove meaningful repetition without obscuring behavior.
// - Keep assertions close to the actions and state they verify.
// - Avoid test-order dependencies and shared mutable state between tests.
// - Separate unrelated subjects into different files unless they form one intentional integration workflow.
// - Keep unit and integration boundaries explicit when they have different testing purposes.
// - Use semantic queries and user-facing behavior as the primary organizational focus for component tests.
// - Keep comments purposeful and explain non-obvious reasons rather than restating code.
// - Split oversized test files only when their size creates a real navigation or maintenance problem.
// - Consistent naming and structure make large test suites easier to navigate and maintain.
