/**
 * user-event
 * ===========
 *
 * user-event simulates browser interactions in a way that is closer to how users interact
 * with a web application. It builds on Testing Library's DOM environment and performs
 * higher-level interactions such as clicking, typing, tabbing, selecting, and uploading files.
 */

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. What user-event provides
// ---------------------------------------------------------------------

// user-event provides interaction APIs such as:
//
// const user = userEvent.setup();
//
// await user.click(button);
// await user.type(input, "John Doe");
// await user.clear(input);
// await user.tab();
//
// These interactions model sequences of browser events rather than simply
// changing a DOM property directly.

// ---------------------------------------------------------------------
// 2. userEvent.setup()
// ---------------------------------------------------------------------

// A test normally creates one user-event instance for the interaction sequence:
//
// const user = userEvent.setup();
//
// The instance maintains interaction state and should generally be created
// inside the test rather than shared globally between tests.

// ---------------------------------------------------------------------
// 3. Interactions are asynchronous
// ---------------------------------------------------------------------

// user-event APIs commonly return Promises:
//
// await user.click(button);
// await user.type(input, "Hello");
// await user.tab();
//
// Tests should await the interaction before making assertions that depend
// on the interaction having completed.

// ---------------------------------------------------------------------
// 4. Clicking
// ---------------------------------------------------------------------

export const SaveButton: FC = (): ReactElement => <button type="button">Save</button>;

// Typical interaction:
//
// const user = userEvent.setup();
// const button = screen.getByRole("button", {name: "Save"});
//
// await user.click(button);
//
// expect(button).toBeEnabled();
//
// `click` models the interaction more closely than directly calling
// an element's click method.

// ---------------------------------------------------------------------
// 5. Clicking changes application state
// ---------------------------------------------------------------------

interface CounterProps {
  readonly initialValue?: number;
}

export const Counter: FC<CounterProps> = ({ initialValue = 0 }): ReactElement => {
  const [count, setCount] = useState(initialValue);

  return (
    <button type="button" onClick={() => setCount((current) => current + 1)}>
      Count: {count}
    </button>
  );
};

// A test can interact with the component:
//
// const user = userEvent.setup();
// const button = screen.getByRole("button", {name: "Count: 0"});
//
// await user.click(button);
//
// expect(screen.getByRole("button", {name: "Count: 1"})).toBeInTheDocument();

// ---------------------------------------------------------------------
// 6. Typing text
// ---------------------------------------------------------------------

export const NameField: FC = (): ReactElement => (
  <label>
    Name
    <input type="text" />
  </label>
);

// user.type simulates typing into a form control:
//
// const user = userEvent.setup();
// const input = screen.getByRole("textbox", {name: "Name"});
//
// await user.type(input, "John Doe");
//
// expect(input).toHaveValue("John Doe");

// ---------------------------------------------------------------------
// 7. Clearing an input
// ---------------------------------------------------------------------

export const SearchField: FC = (): ReactElement => (
  <label>
    Search
    <input type="search" defaultValue="example" />
  </label>
);

// clear removes the current value:
//
// const user = userEvent.setup();
// const input = screen.getByRole("searchbox", {name: "Search"});
//
// await user.clear(input);
//
// expect(input).toHaveValue("");

// ---------------------------------------------------------------------
// 8. Keyboard input
// ---------------------------------------------------------------------

export const ShortcutInput: FC = (): ReactElement => (
  <label>
    Search
    <input type="text" />
  </label>
);

// user.keyboard can simulate keyboard input:
//
// const user = userEvent.setup();
// const input = screen.getByRole("textbox", {name: "Search"});
//
// await user.click(input);
// await user.keyboard("hello");
//
// expect(input).toHaveValue("hello");

// ---------------------------------------------------------------------
// 9. Special keyboard keys
// ---------------------------------------------------------------------

// user-event supports keyboard tokens for special keys:
//
// await user.keyboard("{Enter}");
// await user.keyboard("{Escape}");
// await user.keyboard("{Tab}");
//
// Modifier keys can also be represented:
//
// await user.keyboard("{Control>}a{/Control}");
//
// These interactions can be combined with ordinary characters.

// ---------------------------------------------------------------------
// 10. Keyboard shortcuts
// ---------------------------------------------------------------------

export const SearchShortcut: FC = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label>
        Search
        <input type="search" />
      </label>
      <button type="submit">Search</button>
      {submitted && <p role="status">Search submitted</p>}
    </form>
  );
};

// A test can exercise the keyboard interaction:
//
// const user = userEvent.setup();
// const input = screen.getByRole("searchbox", {name: "Search"});
//
// await user.click(input);
// await user.keyboard("{Enter}");
//
// expect(screen.getByRole("status")).toHaveTextContent("Search submitted");

// ---------------------------------------------------------------------
// 11. Tabbing
// ---------------------------------------------------------------------

export const Navigation: FC = (): ReactElement => (
  <nav aria-label="Main navigation">
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
    <button type="button">Sign out</button>
  </nav>
);

// user.tab moves keyboard focus:
//
// const user = userEvent.setup();
//
// await user.tab();
//
// expect(screen.getByRole("link", {name: "Profile"})).toHaveFocus();
//
// await user.tab();
//
// expect(screen.getByRole("link", {name: "Settings"})).toHaveFocus();

// ---------------------------------------------------------------------
// 12. Shift + Tab
// ---------------------------------------------------------------------

// user.tab accepts options for reverse navigation:
//
// await user.tab({shift: true});
//
// This simulates Shift + Tab and moves focus backward through
// focusable elements.

// ---------------------------------------------------------------------
// 13. Hovering
// ---------------------------------------------------------------------

export const HelpButton: FC = (): ReactElement => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <button type="button" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        Help
      </button>
      {visible && <p role="tooltip">Additional information</p>}
    </div>
  );
};

// user.hover and user.unhover simulate pointer movement:
//
// const user = userEvent.setup();
// const button = screen.getByRole("button", {name: "Help"});
//
// await user.hover(button);
//
// expect(screen.getByRole("tooltip")).toBeVisible();
//
// await user.unhover(button);
//
// expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

// ---------------------------------------------------------------------
// 14. Selecting options
// ---------------------------------------------------------------------

export const CountrySelect: FC = (): ReactElement => (
  <label>
    Country
    <select defaultValue="">
      <option value="" disabled>
        Select a country
      </option>
      <option value="mk">North Macedonia</option>
      <option value="de">Germany</option>
    </select>
  </label>
);

// user.selectOptions selects one or more options:
//
// const user = userEvent.setup();
// const select = screen.getByRole("combobox", {name: "Country"});
//
// await user.selectOptions(select, "mk");
//
// expect(select).toHaveValue("mk");

// ---------------------------------------------------------------------
// 15. Deselecting options
// ---------------------------------------------------------------------

// For a multiple-select control:
//
// const user = userEvent.setup();
// const select = screen.getByRole("listbox", {name: "Countries"});
//
// await user.deselectOptions(select, "mk");
//
// This models removing a selected option from a multiple-selection control.

// ---------------------------------------------------------------------
// 16. Uploading files
// ---------------------------------------------------------------------

// user.upload can simulate selecting a file through a file input:
//
// const user = userEvent.setup();
// const file = new File(["file contents"], "example.txt", {
//     type: "text/plain",
// });
//
// const input = screen.getByLabelText("Upload file");
//
// await user.upload(input, file);
//
// expect(input.files).toHaveLength(1);
//
// The test can then assert how the application responds to the selected file.

// ---------------------------------------------------------------------
// 17. Pointer interactions
// ---------------------------------------------------------------------

export const ToggleButton: FC = (): ReactElement => {
  const [pressed, setPressed] = useState(false);

  return (
    <button type="button" aria-pressed={pressed} onClick={() => setPressed((current) => !current)}>
      Notifications
    </button>
  );
};

// user.click is usually sufficient for ordinary activation:
//
// await user.click(screen.getByRole("button", {name: "Notifications"}));
//
// More detailed pointer sequences can be modeled with user.pointer when
// the test specifically needs pointer behavior.

// ---------------------------------------------------------------------
// 18. Avoid direct DOM manipulation
// ---------------------------------------------------------------------

// Prefer:
//
// await user.clear(input);
// await user.type(input, "John Doe");
// await user.click(button);
//
// over:
//
// input.value = "John Doe";
// button.click();
//
// user-event exercises the interaction path rather than manually modifying
// the DOM to reach the desired state.

// ---------------------------------------------------------------------
// 19. user-event vs fireEvent
// ---------------------------------------------------------------------

// fireEvent dispatches individual DOM events directly:
//
// fireEvent.click(button);
//
// user-event models a higher-level user interaction:
//
// await user.click(button);
//
// A real click can involve several browser events and interaction checks.
// user-event is generally preferred for realistic user interactions,
// while fireEvent remains useful when a test specifically needs to dispatch
// an individual low-level event.

// ---------------------------------------------------------------------
// 20. user-event and Testing Library queries
// ---------------------------------------------------------------------

// A typical interaction follows this pattern:
//
// const user = userEvent.setup();
//
// const input = screen.getByRole("textbox", {name: "Name"});
// const button = screen.getByRole("button", {name: "Save"});
//
// await user.clear(input);
// await user.type(input, "John Doe");
// await user.click(button);
//
// expect(...).to...;
//
// Queries locate the elements through their user-facing semantics.
// user-event performs the interaction.
// jest-dom matchers express the resulting DOM state.

// ---------------------------------------------------------------------
// 21. Keep interactions realistic
// ---------------------------------------------------------------------

// Prefer complete user interactions:
//
// await user.click(submitButton);
//
// rather than manually setting the state that the click is supposed to
// produce.
//
// The purpose of an interaction test is to verify that the application
// responds correctly to actions available to a real user.

// ---------------------------------------------------------------------
// 22. Interaction order matters
// ---------------------------------------------------------------------

// Interaction sequences should normally be written in the same order
// a user would perform them:
//
// await user.click(input);
// await user.type(input, "John Doe");
// await user.tab();
// await user.click(submitButton);
//
// Keeping the sequence explicit makes the test easier to understand
// and helps expose focus and interaction problems.

// ---------------------------------------------------------------------
// 23. Await every interaction
// ---------------------------------------------------------------------

// Do not omit await:
//
// user.click(button);
// user.type(input, "John Doe");
//
// Prefer:
//
// await user.click(button);
// await user.type(input, "John Doe");
//
// This ensures the test waits for each user-event operation before
// continuing to the next interaction or assertion.

// ---------------------------------------------------------------------
// 24. One user instance per test
// ---------------------------------------------------------------------

// A common test structure is:
//
// test("submits the form", async () => {
//     const user = userEvent.setup();
//
//     // render component
//     // locate elements
//     // interact with the UI
// });
//
// Creating the instance inside the test keeps interaction state isolated
// between tests.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - user-event simulates higher-level user interactions.
// - Create an interaction instance with userEvent.setup().
// - Await user-event interactions such as click, type, tab, and selectOptions.
// - Use user.type for realistic text entry and user.clear to remove existing values.
// - Use user.keyboard and user.tab for keyboard interaction and focus movement.
// - Use user.hover and user.unhover for pointer hover behavior.
// - Use user.selectOptions and user.deselectOptions for select controls.
// - Use user.upload to simulate selecting files.
// - Prefer user-event for realistic interactions and fireEvent for targeted low-level events.
// - Combine Testing Library queries, user-event interactions, and jest-dom assertions.
// - Avoid directly manipulating DOM state when the test can reproduce the same state through user interaction.
