/**
 * Sibling to Sibling Communication
 * ================================
 *
 * Direct sibling-to-sibling communication is not possible in React because data flows strictly
 * top-down. To share data or coordinate state changes between sibling components, state must be
 * lifted to their closest common parent component.
 *
 * The common parent maintains the authoritative state, passing the state value down to one
 * sibling as a read-only prop and a state update callback down to the other sibling. When one
 * sibling executes the callback, the parent updates its state, triggering a re-render that
 * propagates updated props down to the target sibling.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SiblingSenderProps {
  readonly onSendMessage: (message: string) => void;
}

export interface SiblingReceiverProps {
  readonly message: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const SiblingSender: React.FC<SiblingSenderProps> = ({ onSendMessage }) => {
  const [draft, setDraft] = useState<string>("");

  const handleSend = (): void => {
    if (!draft.trim()) {
      return;
    }
    onSendMessage(draft.trim());
    setDraft("");
  };

  return (
    <div>
      <h3>Sender Sibling</h3>
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Type message for sibling..."
      />
      <button type="button" onClick={handleSend}>
        Send To Sibling
      </button>
    </div>
  );
};

export const SiblingReceiver: React.FC<SiblingReceiverProps> = ({ message }) => {
  return (
    <div>
      <h3>Receiver Sibling</h3>
      <p>Message Received: {message || "No messages received yet."}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const SiblingToSiblingCommunicationContainer: React.FC = () => {
  // Parent maintains shared state to facilitate communication between siblings
  const [sharedMessage, setSharedMessage] = useState<string>("");

  const handleSendMessage = (message: string): void => {
    setSharedMessage(message);
  };

  return (
    <div>
      <h1>04 - Sibling to Sibling Communication</h1>

      <h2>1. Communicating Between Siblings via Common Parent State</h2>
      <SiblingSender onSendMessage={handleSendMessage} />
      <SiblingReceiver message={sharedMessage} />
    </div>
  );
};

export default SiblingToSiblingCommunicationContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Direct communication between sibling components is impossible due to unidirectional flow.
// - Sibling interaction is enabled by lifting shared state to their closest common parent.
// - One sibling receives state update callbacks while the other receives the state as props.
// - Invoking state callbacks in the sender sibling causes the parent state to re-render.
// - Lifting state to a common ancestor guarantees synchronized UI updates across siblings.
