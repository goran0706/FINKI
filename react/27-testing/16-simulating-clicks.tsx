/**
 * Simulating Clicks
 * =================
 *
 * user-event provides APIs for simulating pointer and click interactions in a way that is
 * closer to real browser behavior. `user.click` is the primary API for activating controls,
 * while related APIs support double clicks, pointer interactions, and modified clicks.
 */

import userEvent from "@testing-library/user-event";
import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Basic clicking
// ---------------------------------------------------------------------

export const SaveButton: FC = (): ReactElement => <button type="button">Save</button>;

// A typical test:
//
// const user = userEvent.setup();
// const button = screen.getByRole("button", {name: "Save"});
//
// await user.click(button);
//
// user.click models the interaction rather than directly calling
// the element's click method.

// ---------------------------------------------------------------------
// 2. Clicking a button changes state
// ---------------------------------------------------------------------

export const Counter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

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
// 3. Clicking links
// ---------------------------------------------------------------------

export const ProfileLink: FC = (): ReactElement => <a href="/profile">Profile</a>;

// Links can also be activated through user.click:
//
// const user = userEvent.setup();
// const link = screen.getByRole("link", {name: "Profile"});
//
// await user.click(link);
//
// The test can then assert the application's response to the interaction.

// ---------------------------------------------------------------------
// 4. Clicking form controls
// ---------------------------------------------------------------------

export const Preferences: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return (
    <label>
      <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
      Receive updates
    </label>
  );
};

// Clicking a checkbox models the user interaction:
//
// const user = userEvent.setup();
// const checkbox = screen.getByRole("checkbox", {name: "Receive updates"});
//
// await user.click(checkbox);
//
// expect(checkbox).toBeChecked();

// ---------------------------------------------------------------------
// 5. Clicking radio buttons
// ---------------------------------------------------------------------

export const ShippingOptions: FC = (): ReactElement => (
  <fieldset>
    <legend>Shipping</legend>
    <label>
      <input type="radio" name="shipping" value="standard" defaultChecked />
      Standard
    </label>
    <label>
      <input type="radio" name="shipping" value="express" />
      Express
    </label>
  </fieldset>
);

// A radio option can be selected with user.click:
//
// await user.click(screen.getByRole("radio", {name: "Express"}));
//
// expect(screen.getByRole("radio", {name: "Express"})).toBeChecked();
// expect(screen.getByRole("radio", {name: "Standard"})).not.toBeChecked();

// ---------------------------------------------------------------------
// 6. Clicking disabled controls
// ---------------------------------------------------------------------

export const DisabledAction: FC = (): ReactElement => (
  <button type="button" disabled>
    Delete
  </button>
);

// A disabled control cannot be activated through a normal user click:
//
// const user = userEvent.setup();
// const button = screen.getByRole("button", {name: "Delete"});
//
// await user.click(button);
//
// The click does not invoke the button's normal activation behavior.

// ---------------------------------------------------------------------
// 7. Double clicking
// ---------------------------------------------------------------------

export const EditableItem: FC = (): ReactElement => {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <button type="button" onDoubleClick={() => setEditing(true)}>
        Edit item
      </button>
      {editing && <p role="status">Editing</p>}
    </div>
  );
};

// user.dblClick simulates a double click:
//
// const user = userEvent.setup();
// const button = screen.getByRole("button", {name: "Edit item"});
//
// await user.dblClick(button);
//
// expect(screen.getByRole("status")).toHaveTextContent("Editing");

// ---------------------------------------------------------------------
// 8. Clicking with keyboard modifiers
// ---------------------------------------------------------------------

// user.click accepts modifier options:
//
// await user.click(button, {ctrlKey: true});
// await user.click(button, {shiftKey: true});
// await user.click(button, {altKey: true});
// await user.click(button, {metaKey: true});
//
// This is useful when application behavior depends on modifier keys
// being held during a pointer interaction.

// ---------------------------------------------------------------------
// 9. Checking modifier state
// ---------------------------------------------------------------------

export const ModifierAwareButton: FC = (): ReactElement => {
  const [message, setMessage] = useState("No modifier");

  return (
    <button
      type="button"
      onClick={(event) => {
        if (event.ctrlKey) {
          setMessage("Control pressed");
          return;
        }

        setMessage("No modifier");
      }}
    >
      {message}
    </button>
  );
};

// A test can simulate the modifier:
//
// const user = userEvent.setup();
// const button = screen.getByRole("button", {name: "No modifier"});
//
// await user.click(button, {ctrlKey: true});
//
// expect(screen.getByRole("button")).toHaveTextContent("Control pressed");

// ---------------------------------------------------------------------
// 10. Clicking and focus
// ---------------------------------------------------------------------

export const FocusableButton: FC = (): ReactElement => <button type="button">Continue</button>;

// A click also participates in focus behavior:
//
// const user = userEvent.setup();
// const button = screen.getByRole("button", {name: "Continue"});
//
// await user.click(button);
//
// expect(button).toHaveFocus();

// ---------------------------------------------------------------------
// 11. Clicking an input
// ---------------------------------------------------------------------

export const SearchInput: FC = (): ReactElement => (
  <label>
    Search
    <input type="search" />
  </label>
);

// Clicking an input can establish focus before typing:
//
// const user = userEvent.setup();
// const input = screen.getByRole("searchbox", {name: "Search"});
//
// await user.click(input);
// await user.type(input, "products");

// ---------------------------------------------------------------------
// 12. Clicking labels
// ---------------------------------------------------------------------

export const LabeledCheckbox: FC = (): ReactElement => (
  <label>
    <input type="checkbox" />
    Receive notifications
  </label>
);

// Clicking the label can activate its associated control:
//
// const user = userEvent.setup();
// const label = screen.getByText("Receive notifications");
//
// await user.click(label);
//
// expect(screen.getByRole("checkbox", {name: "Receive notifications"}))
//     .toBeChecked();
//
// This models a user activating the visible label rather than directly
// manipulating the checkbox state.

// ---------------------------------------------------------------------
// 13. Clicking a submit button
// ---------------------------------------------------------------------

export const LoginForm: FC = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <button type="submit">Sign in</button>
      {submitted && <p role="status">Signed in</p>}
    </form>
  );
};

// A submit interaction can be tested through the button:
//
// const user = userEvent.setup();
//
// await user.click(screen.getByRole("button", {name: "Sign in"}));
//
// expect(screen.getByRole("status")).toHaveTextContent("Signed in");

// ---------------------------------------------------------------------
// 14. Clicking multiple times
// ---------------------------------------------------------------------

export const ClickCounter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onClick={() => setCount((current) => current + 1)}>
      Clicked {count} times
    </button>
  );
};

// Multiple clicks can be represented by multiple awaited interactions:
//
// await user.click(button);
// await user.click(button);
// await user.click(button);
//
// expect(button).toHaveTextContent("Clicked 3 times");

// ---------------------------------------------------------------------
// 15. Click versus dblClick
// ---------------------------------------------------------------------

// Use click when testing a single activation:
//
// await user.click(button);
//
// Use dblClick when the application specifically responds to a double click:
//
// await user.dblClick(button);
//
// A double-click interaction is distinct from simply calling click twice,
// because the browser interaction sequence includes double-click semantics.

// ---------------------------------------------------------------------
// 16. Click versus direct DOM methods
// ---------------------------------------------------------------------

// Prefer:
//
// await user.click(button);
//
// over:
//
// button.click();
//
// user-event performs the interaction through its user-interaction model,
// including relevant pointer and focus behavior.

// ---------------------------------------------------------------------
// 17. Click versus fireEvent
// ---------------------------------------------------------------------

// fireEvent can dispatch a specific event directly:
//
// fireEvent.click(button);
//
// user-event is intended for higher-level user interactions:
//
// await user.click(button);
//
// Use user-event when the test is about what a user does.
// Use fireEvent when deliberately testing a lower-level event dispatch.

// ---------------------------------------------------------------------
// 18. Await click interactions
// ---------------------------------------------------------------------

// user.click is asynchronous:
//
// await user.click(button);
//
// Always await the interaction before making assertions that depend on it:
//
// await user.click(button);
// expect(screen.getByRole("status")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 19. A complete click interaction
// ---------------------------------------------------------------------

export const NotificationSettings: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return (
    <section aria-label="Notifications">
      <h2>Notifications</h2>
      <button type="button" aria-pressed={enabled} onClick={() => setEnabled((current) => !current)}>
        {enabled ? "Disable notifications" : "Enable notifications"}
      </button>
    </section>
  );
};

// A complete test interaction might be:
//
// const user = userEvent.setup();
//
// const button = screen.getByRole("button", {
//     name: "Enable notifications",
// });
//
// await user.click(button);
//
// expect(button).toHaveAttribute("aria-pressed", "true");
// expect(button).toHaveTextContent("Disable notifications");

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - user.click simulates a user activating an element through a click.
// - Click interactions should normally be awaited.
// - user.click works with buttons, links, checkboxes, radio buttons, inputs, and other interactive elements.
// - user.dblClick simulates a double-click interaction.
// - Click options can model modifier keys such as Control, Shift, Alt, and Meta.
// - Clicking participates in normal focus and form-control interaction behavior.
// - Disabled controls do not perform their normal activation behavior when clicked.
// - Prefer user-event over direct DOM manipulation when testing user interactions.
// - user-event is higher-level than dispatching an isolated fireEvent.click.
// - Combine user-facing queries, user-event interactions, and DOM assertions to test behavior.
