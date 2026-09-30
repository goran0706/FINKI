/**
 * Form Submit Event
 * ==================
 *
 * React represents a form submission through `React.FormEvent<HTMLFormElement>`. The event is
 * delivered to the form's `onSubmit` handler when the browser dispatches the form's `submit`
 * event after the form's submission conditions have been satisfied.
 *
 * The React event exposes `currentTarget` as the form element whose handler is executing and
 * `target` as the original event target. For a submit event, the target is normally the form,
 * while `currentTarget` is the form associated with the currently executing handler.
 *
 * The event also provides methods such as `preventDefault()` and `stopPropagation()`. Its
 * `nativeEvent` property exposes the underlying browser event. In browsers that provide a native
 * `SubmitEvent`, that native event can expose the `submitter`, which identifies the submit button
 * that initiated the submission.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormSubmitEventBasicProps {
  readonly initialName: string;
}

export interface FormSubmitEventTargetProps {
  readonly initialName: string;
}

export interface FormSubmitEventDefaultProps {
  readonly initialName: string;
}

export interface FormSubmitEventSubmitterProps {
  readonly initialName: string;
}

export interface FormSubmitEventPropagationProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormSubmitEventBasic: React.FC<FormSubmitEventBasicProps> = ({ initialName }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log("Submit event received.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const FormSubmitEventTarget: React.FC<FormSubmitEventTargetProps> = ({ initialName }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const form: HTMLFormElement = event.currentTarget;

    const target: EventTarget = event.target;

    console.log("currentTarget:", form);
    console.log("target:", target);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const FormSubmitEventDefault: React.FC<FormSubmitEventDefaultProps> = ({ initialName }): React.ReactElement => {
  const [message, setMessage] = React.useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setMessage("The browser's default submission was prevented.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Submit</button>

      {message !== "" && <p>{message}</p>}
    </form>
  );
};

export const FormSubmitEventSubmitter: React.FC<FormSubmitEventSubmitterProps> = ({
  initialName,
}): React.ReactElement => {
  const [message, setMessage] = React.useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const nativeEvent: Event = event.nativeEvent;

    if (nativeEvent instanceof SubmitEvent) {
      const submitter: HTMLElement | null = nativeEvent.submitter;

      setMessage(
        submitter instanceof HTMLButtonElement
          ? `Submitted with: ${submitter.textContent ?? ""}`
          : "Submitted without a button element.",
      );

      return;
    }

    setMessage("The native event is not a SubmitEvent.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Save</button>

      <button type="submit">Continue</button>

      {message !== "" && <p>{message}</p>}
    </form>
  );
};

export const FormSubmitEventPropagation: React.FC<FormSubmitEventPropagationProps> = ({
  initialName,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    console.log("Submit event propagation stopped.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Form Submit Event</h1>

      <h2>1. Receiving a React Form Submit Event</h2>
      <FormSubmitEventBasic initialName="John Doe" />

      <h2>2. Reading currentTarget and target</h2>
      <FormSubmitEventTarget initialName="John Doe" />

      <h2>3. Preventing the Default Submit Behavior</h2>
      <FormSubmitEventDefault initialName="John Doe" />

      <h2>4. Identifying the Native Submitter</h2>
      <FormSubmitEventSubmitter initialName="John Doe" />

      <h2>5. Stopping Submit Event Propagation</h2>
      <FormSubmitEventPropagation initialName="John Doe" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React form submission handlers receive `React.FormEvent<HTMLFormElement>`.
// - `event.currentTarget` is the form whose submit handler is currently executing.
// - `event.target` identifies the original target associated with the event.
// - `event.preventDefault()` prevents the browser's default form submission behavior.
// - `event.stopPropagation()` prevents the event from continuing through the propagation path.
// - `event.nativeEvent` provides access to the underlying browser event.
// - A native `SubmitEvent` can expose the `submitter` that initiated the submission.
// - `submitter` identifies the submitting control, which is useful when a form has multiple submit buttons.
// - React's `FormEvent` type does not directly expose `submitter`; it belongs to the native `SubmitEvent`.
// - Native browser constraint validation can prevent the submit event from being dispatched for an invalid form.
