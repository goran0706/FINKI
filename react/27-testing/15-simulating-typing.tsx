/**
 * Simulating Typing
 * =================
 *
 * user-event provides keyboard and text-input interactions that model how users type into
 * form controls. `user.type` is the primary API for entering text, while `user.keyboard`
 * provides lower-level control over individual keys and keyboard sequences.
 */

import userEvent from "@testing-library/user-event";
import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Basic typing
// ---------------------------------------------------------------------

export const NameField: FC = (): ReactElement => (
  <label>
    Name
    <input type="text" />
  </label>
);

// A typical test:
//
// const user = userEvent.setup();
// const input = screen.getByRole("textbox", {name: "Name"});
//
// await user.type(input, "John Doe");
//
// expect(input).toHaveValue("John Doe");

// ---------------------------------------------------------------------
// 2. Typing into a controlled input
// ---------------------------------------------------------------------

export const ControlledNameField: FC = (): ReactElement => {
  const [name, setName] = useState("");

  return (
    <label>
      Name
      <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
    </label>
  );
};

// user.type triggers the input interaction, allowing React's onChange
// handler to update controlled state:
//
// await user.type(input, "John Doe");
//
// expect(input).toHaveValue("John Doe");

// ---------------------------------------------------------------------
// 3. Typing into an existing value
// ---------------------------------------------------------------------

export const ExistingValueField: FC = (): ReactElement => (
  <label>
    Name
    <input type="text" defaultValue="John" />
  </label>
);

// Typing normally adds characters at the current insertion point:
//
// await user.type(input, " Doe");
//
// The resulting value is:
//
// "John Doe"

// ---------------------------------------------------------------------
// 4. Clearing before typing
// ---------------------------------------------------------------------

// When a test needs to replace an existing value, clear it first:
//
// await user.clear(input);
// await user.type(input, "Jane Doe");
//
// This models selecting the existing input content and replacing it
// rather than simply appending text.

// ---------------------------------------------------------------------
// 5. Typing into different input types
// ---------------------------------------------------------------------

export const ContactForm: FC = (): ReactElement => (
  <form>
    <label>
      Name
      <input type="text" />
    </label>
    <label>
      Email
      <input type="email" />
    </label>
    <label>
      Search
      <input type="search" />
    </label>
  </form>
);

// user.type can be used with different text-entry controls:
//
// await user.type(nameInput, "John Doe");
// await user.type(emailInput, "john@example.com");
// await user.type(searchInput, "products");

// ---------------------------------------------------------------------
// 6. Typing special keyboard keys
// ---------------------------------------------------------------------

// user.type accepts keyboard tokens for special keys:
//
// await user.type(input, "John{Enter}");
//
// This types "John" and then presses Enter.
//
// Other special keys include:
//
// await user.type(input, "John{Tab}");
// await user.type(input, "John{Escape}");

// ---------------------------------------------------------------------
// 7. user.keyboard
// ---------------------------------------------------------------------

// user.keyboard provides more direct keyboard control:
//
// await user.click(input);
// await user.keyboard("John Doe");
//
// It is useful when the test needs to model specific key presses,
// modifier keys, or keyboard sequences rather than simply entering text.

// ---------------------------------------------------------------------
// 8. Individual special keys
// ---------------------------------------------------------------------

// Special keys can be sent explicitly:
//
// await user.keyboard("{Enter}");
// await user.keyboard("{Escape}");
// await user.keyboard("{Tab}");
//
// Ordinary characters can be mixed with special keys:
//
// await user.keyboard("John{Enter}");

// ---------------------------------------------------------------------
// 9. Modifier keys
// ---------------------------------------------------------------------

// Modifier keys can be held while another key is pressed:
//
// await user.keyboard("{Control>}a{/Control}");
//
// The `>` starts the held-key sequence.
// The closing token releases the modifier.
//
// On macOS, tests may need to model Meta rather than Control when
// testing platform-specific shortcuts.

// ---------------------------------------------------------------------
// 10. Keyboard shortcuts
// ---------------------------------------------------------------------

export const SearchField: FC = (): ReactElement => {
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
      {submitted && <p role="status">Search submitted</p>}
    </form>
  );
};

// A keyboard interaction can exercise the form:
//
// await user.click(searchInput);
// await user.keyboard("products{Enter}");
//
// expect(screen.getByRole("status")).toHaveTextContent("Search submitted");

// ---------------------------------------------------------------------
// 11. Typing and focus
// ---------------------------------------------------------------------

// user.type requires an appropriate target and interacts with the control
// as a user would.
//
// A common sequence is:
//
// await user.click(input);
// await user.type(input, "John Doe");
//
// The explicit click is useful when the test is intentionally verifying
// focus-related behavior.

// ---------------------------------------------------------------------
// 12. Typing and event handlers
// ---------------------------------------------------------------------

export const CharacterCounter: FC = (): ReactElement => {
  const [value, setValue] = useState("");

  return (
    <div>
      <label>
        Message
        <textarea value={value} onChange={(event) => setValue(event.target.value)} />
      </label>
      <p>{value.length} characters</p>
    </div>
  );
};

// Typing exercises the component's normal input path:
//
// await user.type(messageInput, "Hello");
//
// expect(screen.getByText("5 characters")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 13. Typing into a textarea
// ---------------------------------------------------------------------

export const CommentField: FC = (): ReactElement => (
  <label>
    Comment
    <textarea />
  </label>
);

// user.type works with textareas as well:
//
// await user.type(commentInput, "This is a comment.");
//
// expect(commentInput).toHaveValue("This is a comment.");

// ---------------------------------------------------------------------
// 14. Delayed typing
// ---------------------------------------------------------------------

// userEvent can introduce a delay between characters:
//
// const user = userEvent.setup({delay: 100});
//
// await user.type(input, "John");
//
// The delay is useful when testing behavior that depends on the passage
// of time between individual keystrokes.
//
// Most tests do not need an artificial delay.

// ---------------------------------------------------------------------
// 15. Typing and validation
// ---------------------------------------------------------------------

export const RequiredEmail: FC = (): ReactElement => (
  <form>
    <label>
      Email
      <input type="email" required />
    </label>
    <button type="submit">Submit</button>
  </form>
);

// Typing can be combined with form interaction:
//
// await user.type(emailInput, "john@example.com");
// await user.click(submitButton);
//
// expect(emailInput).toBeValid();

// ---------------------------------------------------------------------
// 16. Typing versus directly changing value
// ---------------------------------------------------------------------

// Avoid manually changing the value when the purpose of the test is
// to simulate typing:
//
// input.value = "John Doe";
//
// Prefer:
//
// await user.type(input, "John Doe");
//
// user.type exercises the browser interaction path and the application's
// input event handling rather than only changing the DOM property.

// ---------------------------------------------------------------------
// 17. user.type versus user.keyboard
// ---------------------------------------------------------------------

// Use user.type when the intent is text entry:
//
// await user.type(input, "John Doe");
//
// Use user.keyboard when the intent is keyboard behavior:
//
// await user.keyboard("{Control>}a{/Control}");
// await user.keyboard("{Enter}");
//
// `user.type` is higher-level; `user.keyboard` gives more precise control
// over keyboard input.

// ---------------------------------------------------------------------
// 18. Await typing interactions
// ---------------------------------------------------------------------

// user.type returns a Promise, so await it:
//
// await user.type(input, "John Doe");
//
// Do not start an assertion before the interaction has completed:
//
// await user.type(input, "John Doe");
// expect(input).toHaveValue("John Doe");

// ---------------------------------------------------------------------
// 19. A complete typing interaction
// ---------------------------------------------------------------------

export const ProfileForm: FC = (): ReactElement => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form>
      <label>
        Name
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

// A complete interaction can therefore be:
//
// const user = userEvent.setup();
//
// const nameInput = screen.getByRole("textbox", {name: "Name"});
// const emailInput = screen.getByRole("textbox", {name: "Email"});
//
// await user.type(nameInput, "John Doe");
// await user.type(emailInput, "john@example.com");
//
// expect(nameInput).toHaveValue("John Doe");
// expect(emailInput).toHaveValue("john@example.com");

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - user.type is the primary user-event API for simulating text entry.
// - user.type works with inputs and textareas and triggers the normal input interaction path.
// - Use user.clear before typing when replacing an existing value.
// - user.keyboard provides lower-level control over keyboard input.
// - Special keys such as Enter, Tab, and Escape can be represented with keyboard tokens.
// - Modifier keys can be held and released with user.keyboard.
// - Typing interactions are asynchronous and should be awaited.
// - Use user.type for text-entry intent and user.keyboard for detailed keyboard behavior.
// - Prefer simulated typing over directly assigning to an input's value.
// - Typing can exercise React controlled state, validation, event handlers, and keyboard behavior.
