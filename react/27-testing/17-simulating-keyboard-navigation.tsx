/**
 * Simulating Keyboard Navigation
 * ==============================
 *
 * user-event can simulate keyboard navigation through focusable elements, including Tab,
 * Shift + Tab, Enter, Escape, and other keyboard interactions. These interactions allow tests
 * to verify focus management and keyboard-accessible behavior from a user's perspective.
 */

import userEvent from "@testing-library/user-event";
import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Basic Tab navigation
// ---------------------------------------------------------------------

export const Navigation: FC = (): ReactElement => (
  <nav aria-label="Main navigation">
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
    <button type="button">Sign out</button>
  </nav>
);

// user.tab moves focus to the next focusable element:
//
// const user = userEvent.setup();
//
// await user.tab();
// expect(screen.getByRole("link", {name: "Profile"})).toHaveFocus();
//
// await user.tab();
// expect(screen.getByRole("link", {name: "Settings"})).toHaveFocus();
//
// await user.tab();
// expect(screen.getByRole("button", {name: "Sign out"})).toHaveFocus();

// ---------------------------------------------------------------------
// 2. Shift + Tab
// ---------------------------------------------------------------------

// user.tab can move focus backward:
//
// await user.tab({shift: true});
//
// This simulates Shift + Tab and moves focus to the previous focusable
// element in the navigation order.

// ---------------------------------------------------------------------
// 3. Focus starts outside the component
// ---------------------------------------------------------------------

export const FormNavigation: FC = (): ReactElement => (
  <form aria-label="Profile">
    <label>
      Name
      <input type="text" />
    </label>
    <label>
      Email
      <input type="email" />
    </label>
    <button type="submit">Save</button>
  </form>
);

// When the test starts without a focused control:
//
// await user.tab();
//
// focus moves to the first focusable element:
//
// expect(screen.getByRole("textbox", {name: "Name"})).toHaveFocus();
//
// Subsequent Tab interactions move through the remaining controls.

// ---------------------------------------------------------------------
// 4. Keyboard navigation order
// ---------------------------------------------------------------------

// Keyboard navigation follows the document's focus order.
//
// const user = userEvent.setup();
//
// await user.tab();
// await user.tab();
// await user.tab();
//
// The test should assert the actual intended focus order rather than
// assuming that DOM order and visual layout are always identical.

// ---------------------------------------------------------------------
// 5. Enter activates controls
// ---------------------------------------------------------------------

export const SubmitForm: FC = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <button type="submit">Submit</button>
      {submitted && <p role="status">Submitted</p>}
    </form>
  );
};

// A focused button can be activated with Enter:
//
// const user = userEvent.setup();
// const button = screen.getByRole("button", {name: "Submit"});
//
// button.focus();
// await user.keyboard("{Enter}");
//
// expect(screen.getByRole("status")).toHaveTextContent("Submitted");

// ---------------------------------------------------------------------
// 6. Space activates buttons
// ---------------------------------------------------------------------

export const ToggleButton: FC = (): ReactElement => {
  const [pressed, setPressed] = useState(false);

  return (
    <button type="button" aria-pressed={pressed} onClick={() => setPressed((current) => !current)}>
      Notifications
    </button>
  );
};

// A focused button can also be activated with Space:
//
// const user = userEvent.setup();
// const button = screen.getByRole("button", {name: "Notifications"});
//
// button.focus();
// await user.keyboard(" ");
//
// expect(button).toHaveAttribute("aria-pressed", "true");

// ---------------------------------------------------------------------
// 7. Keyboard navigation through a form
// ---------------------------------------------------------------------

export const AccountForm: FC = (): ReactElement => (
  <form aria-label="Account">
    <label>
      Name
      <input type="text" />
    </label>
    <label>
      Email
      <input type="email" />
    </label>
    <button type="submit">Save</button>
  </form>
);

// A test can model a keyboard-only interaction:
//
// const user = userEvent.setup();
//
// await user.tab();
// await user.type(screen.getByRole("textbox", {name: "Name"}), "John Doe");
//
// await user.tab();
// await user.type(screen.getByRole("textbox", {name: "Email"}), "john@example.com");
//
// await user.tab();
// await user.keyboard("{Enter}");

// ---------------------------------------------------------------------
// 8. Escape closes an interactive element
// ---------------------------------------------------------------------

export const DialogTrigger: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      {open && (
        <div role="dialog" aria-label="Settings">
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      )}
    </>
  );
};

// If the component implements Escape handling, user.keyboard can exercise it:
//
// const user = userEvent.setup();
//
// await user.click(screen.getByRole("button", {name: "Open dialog"}));
// await user.keyboard("{Escape}");
//
// expect(screen.queryByRole("dialog", {name: "Settings"}))
//     .not.toBeInTheDocument();

// ---------------------------------------------------------------------
// 9. Focus management
// ---------------------------------------------------------------------

export const FocusManagedDialog: FC = (): ReactElement => (
  <div role="dialog" aria-label="Confirmation">
    <h2>Confirmation</h2>
    <button type="button">Cancel</button>
    <button type="button">Confirm</button>
  </div>
);

// Tests can assert where focus is placed:
//
// const user = userEvent.setup();
//
// await user.tab();
//
// expect(screen.getByRole("button", {name: "Cancel"})).toHaveFocus();
//
// await user.tab();
//
// expect(screen.getByRole("button", {name: "Confirm"})).toHaveFocus();

// ---------------------------------------------------------------------
// 10. Reverse navigation
// ---------------------------------------------------------------------

export const Toolbar: FC = (): ReactElement => (
  <div role="toolbar" aria-label="Formatting">
    <button type="button">Bold</button>
    <button type="button">Italic</button>
    <button type="button">Underline</button>
  </div>
);

// Shift + Tab reverses keyboard traversal:
//
// const user = userEvent.setup();
//
// await user.tab();
// await user.tab();
// await user.tab({shift: true});
//
// expect(screen.getByRole("button", {name: "Italic"})).toHaveFocus();

// ---------------------------------------------------------------------
// 11. Skipping disabled controls
// ---------------------------------------------------------------------

export const AccountActions: FC = (): ReactElement => (
  <div>
    <button type="button">Edit</button>
    <button type="button" disabled>
      Delete
    </button>
    <button type="button">Cancel</button>
  </div>
);

// Disabled controls are not normally keyboard-focusable:
//
// await user.tab();
// expect(screen.getByRole("button", {name: "Edit"})).toHaveFocus();
//
// await user.tab();
// expect(screen.getByRole("button", {name: "Cancel"})).toHaveFocus();

// ---------------------------------------------------------------------
// 12. Keyboard navigation and links
// ---------------------------------------------------------------------

export const MainMenu: FC = (): ReactElement => (
  <nav aria-label="Main menu">
    <a href="/home">Home</a>
    <a href="/products">Products</a>
    <a href="/contact">Contact</a>
  </nav>
);

// Keyboard navigation can verify that every link is reachable:
//
// await user.tab();
// expect(screen.getByRole("link", {name: "Home"})).toHaveFocus();
//
// await user.tab();
// expect(screen.getByRole("link", {name: "Products"})).toHaveFocus();
//
// await user.tab();
// expect(screen.getByRole("link", {name: "Contact"})).toHaveFocus();

// ---------------------------------------------------------------------
// 13. Keyboard navigation and checkboxes
// ---------------------------------------------------------------------

export const Settings: FC = (): ReactElement => (
  <label>
    <input type="checkbox" />
    Enable notifications
  </label>
);

// A checkbox can be reached with Tab and activated with Space:
//
// await user.tab();
// const checkbox = screen.getByRole("checkbox", {name: "Enable notifications"});
//
// expect(checkbox).toHaveFocus();
//
// await user.keyboard(" ");
//
// expect(checkbox).toBeChecked();

// ---------------------------------------------------------------------
// 14. Keyboard navigation and radio groups
// ---------------------------------------------------------------------

export const ThemeSelector: FC = (): ReactElement => (
  <fieldset>
    <legend>Theme</legend>
    <label>
      <input type="radio" name="theme" value="light" defaultChecked />
      Light
    </label>
    <label>
      <input type="radio" name="theme" value="dark" />
      Dark
    </label>
  </fieldset>
);

// Radio groups have browser-defined keyboard behavior.
// Tests should verify the interaction supported by the actual control:
//
// await user.tab();
// await user.keyboard("{ArrowDown}");
//
// The exact focus and selection behavior should be asserted according
// to the component and browser interaction being tested.

// ---------------------------------------------------------------------
// 15. Keyboard-only interaction
// ---------------------------------------------------------------------

export const SearchForm: FC = (): ReactElement => {
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

// A test can avoid mouse interaction entirely:
//
// const user = userEvent.setup();
//
// await user.tab();
// await user.type(
//     screen.getByRole("searchbox", {name: "Search"}),
//     "products",
// );
// await user.tab();
// await user.keyboard("{Enter}");
//
// expect(screen.getByRole("status")).toHaveTextContent("Search submitted");

// ---------------------------------------------------------------------
// 16. Focus assertions
// ---------------------------------------------------------------------

// toHaveFocus is useful when testing keyboard navigation:
//
// expect(element).toHaveFocus();
//
// It verifies the element that currently owns document focus.
//
// Focus assertions should describe an intended keyboard interaction,
// such as moving to the next field or placing focus inside an opened dialog.

// ---------------------------------------------------------------------
// 17. Keyboard navigation should follow user intent
// ---------------------------------------------------------------------

// Prefer a test such as:
//
// await user.tab();
// expect(screen.getByRole("button", {name: "Save"})).toHaveFocus();
//
// over directly calling:
//
// saveButton.focus();
//
// Direct focus is useful when setting up a specific starting state.
// user.tab is more appropriate when the test is verifying keyboard navigation.

// ---------------------------------------------------------------------
// 18. Await keyboard interactions
// ---------------------------------------------------------------------

// Keyboard interactions are asynchronous:
//
// await user.tab();
// await user.keyboard("{Enter}");
// await user.type(input, "John Doe");
//
// Await each interaction before asserting the resulting state or focus.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - user.tab simulates keyboard focus navigation.
// - user.tab({shift: true}) simulates Shift + Tab for reverse navigation.
// - Keyboard navigation can verify the intended focus order of interactive controls.
// - Enter and Space can activate appropriate focused controls.
// - user.keyboard can simulate keys such as Enter, Escape, Tab, and Space.
// - Keyboard-only tests can verify that an interface is usable without pointer interaction.
// - Disabled controls are normally skipped during sequential keyboard navigation.
// - toHaveFocus is useful for asserting the element that currently owns focus.
// - Focus management is especially important for dialogs, forms, menus, and other interactive components.
// - Prefer simulated keyboard navigation over directly calling focus when navigation itself is being tested.
// - Keyboard interactions should be awaited before dependent assertions.
