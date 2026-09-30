/**
 * Event vs Effect
 * ===============
 *
 * Event handlers and Effects both execute code outside the render calculation,
 * but they represent different causes. An event handler responds to a specific
 * interaction, such as a click, form submission, or keyboard action. An Effect
 * synchronizes the committed UI with an external system when the component's
 * reactive values change.
 *
 * Event-driven logic should generally stay in the event handler that caused the
 * action. Moving such logic into an Effect can make the code indirect: the
 * handler changes state, another render occurs, and the Effect infers that the
 * original interaction must have happened.
 *
 * Effects are appropriate when synchronization should happen because the
 * rendered state or props changed, including changes that can occur without a
 * particular user interaction. For example, synchronizing the document title
 * with a state value belongs in an Effect because the title should track that
 * value regardless of which code caused it to change.
 *
 * A useful distinction is cause versus synchronization: event handlers are
 * caused by interactions, while Effects are caused by committed reactive
 * changes. This distinction also prevents unnecessary Effects that merely
 * transform one piece of state into another or perform an action that belongs
 * directly in an interaction handler.
 */

import { type ChangeEvent, type FC, type FormEvent, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface EventHandlerActionProps {
  readonly initialMessage: string;
}

export interface EffectSynchronizationProps {
  readonly initialTitle: string;
}

export interface FormSubmissionProps {
  readonly initialName: string;
}

export interface EventAndEffectProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const EventHandlerAction: FC<EventHandlerActionProps> = ({ initialMessage }): ReactElement => {
  const [message, setMessage] = useState<string>(initialMessage);
  const [savedMessage, setSavedMessage] = useState<string>(initialMessage);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  const saveMessage = (): void => {
    setSavedMessage(message);
  };

  return (
    <section>
      <label htmlFor="event-handler-message">Message</label>
      <input id="event-handler-message" value={message} onChange={handleChange} />

      <button type="button" onClick={saveMessage}>
        Save message
      </button>

      <p>Saved message: {savedMessage}</p>
    </section>
  );
};

export const EffectSynchronization: FC<EffectSynchronizationProps> = ({ initialTitle }): ReactElement => {
  const [title, setTitle] = useState<string>(initialTitle);

  useEffect((): void => {
    document.title = title;
  }, [title]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  return (
    <section>
      <label htmlFor="effect-synchronization-title">Title</label>
      <input id="effect-synchronization-title" value={title} onChange={handleChange} />

      <p>Document title is synchronized with the current value.</p>
    </section>
  );
};

export const FormSubmission: FC<FormSubmissionProps> = ({ initialName }): ReactElement => {
  const [name, setName] = useState<string>(initialName);
  const [submittedName, setSubmittedName] = useState<string>(initialName);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmittedName(name);
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <label htmlFor="event-vs-effect-name">Name</label>
        <input id="event-vs-effect-name" value={name} onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>

      <p>Submitted name: {submittedName}</p>
    </section>
  );
};

export const EventAndEffect: FC<EventAndEffectProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);
  const [status, setStatus] = useState<string>("Ready");

  useEffect((): void => {
    document.title = `Value: ${value}`;
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleReset = (): void => {
    setValue(initialValue);
    setStatus("Reset by interaction");
  };

  return (
    <section>
      <label htmlFor="event-and-effect-value">Value</label>
      <input id="event-and-effect-value" value={value} onChange={handleChange} />

      <button type="button" onClick={handleReset}>
        Reset
      </button>

      <p>Status: {status}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EventVsEffectExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Put interaction-specific actions in event handlers</h2>
      <EventHandlerAction initialMessage="John Doe" />

      <h2>2. Use an Effect for synchronization with an external system</h2>
      <EffectSynchronization initialTitle="John Doe" />

      <h2>3. Handle form submission directly from the submit event</h2>
      <FormSubmission initialName="John Doe" />

      <h2>4. Separate interaction logic from reactive synchronization</h2>
      <EventAndEffect initialValue="example.com" />
    </main>
  );
};

export default EventVsEffectExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Event handlers respond to specific interactions such as clicks, changes,
//   and form submissions.
// - Effects synchronize the committed UI with external systems.
// - Interaction-specific actions generally belong directly in their event
//   handlers.
// - An Effect should not be used merely to detect that an interaction happened
//   by observing a state change caused by that interaction.
// - An Effect is appropriate when synchronization should occur whenever its
//   reactive dependencies change, regardless of what caused the change.
// - State updates from an event can trigger a later Effect, but that does not
//   make the Effect an event handler.
// - Separating event-driven logic from synchronization logic makes the cause of
//   each operation explicit.
// - Derived values and ordinary state transformations usually belong in render
//   logic or event handlers rather than in Effects.
