/**
 * React Buttons
 * =============
 *
 * React buttons use the native HTML `<button>` element with React event handlers to respond to
 * user interaction. The `onClick` prop receives a function that React invokes when the button is
 * activated by a pointer or keyboard interaction. React's event system provides a `MouseEvent`
 * object containing information about the interaction and the originating button element.
 *
 * A button's behavior is determined by its native HTML attributes as well as its React props.
 * `type="button"` explicitly creates a non-submitting button, while `disabled` prevents user
 * interaction and causes the browser to omit the button from normal activation behavior. A
 * button can also be controlled through state, allowing its label, disabled state, or other
 * rendered properties to change when the component re-renders.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ClickButtonProps {
  readonly label: string;
  readonly onClick: () => void;
}

export interface EventButtonProps {
  readonly label: string;
  readonly onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface DisabledButtonProps {
  readonly label: string;
  readonly disabled: boolean;
}

export interface StatefulButtonProps {
  readonly initialCount: number;
}

export interface SubmitButtonProps {
  readonly label: string;
  readonly onSubmit: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ClickButton: React.FC<ClickButtonProps> = ({ label, onClick }): React.ReactElement => {
  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
};

export const EventButton: React.FC<EventButtonProps> = ({ label, onClick }): React.ReactElement => {
  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
};

export const DisabledButton: React.FC<DisabledButtonProps> = ({ label, disabled }): React.ReactElement => {
  const handleClick = (): void => {
    console.log("This handler runs only when the button is enabled.");
  };

  return (
    <button type="button" disabled={disabled} onClick={handleClick}>
      {label}
    </button>
  );
};

export const StatefulButton: React.FC<StatefulButtonProps> = ({ initialCount }): React.ReactElement => {
  const [count, setCount] = React.useState<number>(initialCount);

  const handleClick = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <button type="button" onClick={handleClick}>
      Clicked {count} times
    </button>
  );
};

export const SubmitButton: React.FC<SubmitButtonProps> = ({ label, onSubmit }): React.ReactElement => {
  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <button type="submit" onClick={handleSubmit}>
      {label}
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  const handleClick = (): void => {
    console.log("Button clicked.");
  };

  const handleEventClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    console.log(`Clicked element: ${event.currentTarget.tagName}`);
  };

  const handleSubmit = (): void => {
    console.log("Submit action triggered.");
  };

  return (
    <main>
      <h1>React Buttons</h1>

      <h2>1. Handling a Button Click</h2>
      <ClickButton label="Click me" onClick={handleClick} />

      <h2>2. Accessing the Click Event</h2>
      <EventButton label="Inspect event" onClick={handleEventClick} />

      <h2>3. Disabling a Button</h2>
      <DisabledButton label="Disabled button" disabled={true} />

      <h2>4. Updating State from a Click</h2>
      <StatefulButton initialCount={0} />

      <h2>5. Explicit Submit Button Behavior</h2>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <SubmitButton label="Submit" onSubmit={handleSubmit} />
      </form>
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React buttons use `onClick` to respond to user activation.
// - `MouseEvent<HTMLButtonElement>` provides the event type for button click handlers.
// - `currentTarget` identifies the element whose handler is currently executing.
// - `disabled` prevents a button from being activated by the user.
// - Functional state updates use the previous state when the next state depends on it.
// - `type="button"` prevents a button from acting as a form submitter.
// - `type="submit"` gives a button native form-submission behavior.
// - `preventDefault()` prevents the browser's default action for the event.
// - A button's `onClick` handler is not the same thing as a form's `onSubmit` handler.
