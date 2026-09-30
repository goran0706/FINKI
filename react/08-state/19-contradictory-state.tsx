/**
 * Contradictory State
 * ===================
 *
 * Contradictory state occurs when multiple boolean state flags create impossible or conflicting
 * UI states, such as `isSending` and `isSent` both being true at the same time.
 *
 * Managing related flags independently introduces state synchronization bugs when handlers fail to
 * reset every flag correctly. Replacing multiple boolean state variables with a single status state
 * string or enum (e.g., 'typing' | 'sending' | 'sent') guarantees impossible states cannot exist.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export type FeedbackStatus = "typing" | "sending" | "sent";

export interface FeedbackFormProps {
  readonly initialMessage: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ContradictoryStateForm: React.FC<FeedbackFormProps> = ({ initialMessage }) => {
  const [text, setText] = useState<string>(initialMessage);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);

  const handleSend = async (): Promise<void> => {
    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSending(false);
    setIsSent(true);
  };

  const handleTriggerConflict = (): void => {
    // Bug-prone state update: creates contradictory state where isSending and isSent are both true
    setIsSending(true);
    setIsSent(true);
  };

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} disabled={isSending} />
      <br />
      <button type="button" onClick={handleSend} disabled={isSending}>
        Send Feedback
      </button>
      <button type="button" onClick={handleTriggerConflict}>
        Trigger Contradictory Flags
      </button>

      {isSending && <p>Sending feedback...</p>}
      {isSent && <p>Feedback sent successfully!</p>}
      {isSending && isSent && <p>Error: Impossible state detected (sending and sent both true)!</p>}
    </div>
  );
};

export const StatusEnumForm: React.FC<FeedbackFormProps> = ({ initialMessage }) => {
  const [text, setText] = useState<string>(initialMessage);
  const [status, setStatus] = useState<FeedbackStatus>("typing");

  const handleSend = async (): Promise<void> => {
    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("sent");
  };

  const isSending = status === "sending";

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} disabled={isSending} />
      <br />
      <button type="button" onClick={handleSend} disabled={isSending}>
        Send Feedback
      </button>
      <button type="button" onClick={() => setStatus("typing")}>
        Reset to Typing
      </button>

      {status === "typing" && <p>Status: Ready to edit</p>}
      {status === "sending" && <p>Status: Sending feedback...</p>}
      {status === "sent" && <p>Status: Feedback sent successfully!</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const ContradictoryStateContainer: React.FC = () => {
  return (
    <div>
      <h1>19 - Contradictory State</h1>

      <h2>1. Multiple Boolean Flags Allowing Impossible States</h2>
      <ContradictoryStateForm initialMessage="Feedback message" />

      <h2>2. Explicit Status State Preventing Contradictions</h2>
      <StatusEnumForm initialMessage="Feedback message" />
    </div>
  );
};

export default ContradictoryStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Contradictory state occurs when separate boolean flags allow impossible UI combinations.
// - Managing multiple state flags independently increases bug risks during state updates.
// - Replacing multiple boolean flags with a single status state eliminates conflicting states.
// - Derived boolean flags calculated from a single status variable ensure clean rendering logic.
// - Single status values streamline form states, network requests, and complex UI transitions.
