/**
 * Function Props
 * ==============
 *
 * Function props pass executable callbacks from parent components down to child components,
 * establishing the communication channel for upward data flow, user interactions, and event notification.
 *
 * Explicit callback signatures guarantee type safety across component boundaries for simple triggers,
 * data emitters, synthetic DOM events, and predicate queries. This decouples presentation components
 * from parent business logic, allowing children to communicate state changes dynamically without
 * sacrificing compile-time contract enforcement.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Function Prop Type Definitions
// ---------------------------------------------------------------------

export type SimpleActionCallback = () => void;
export type DataEmitterCallback = (value: string) => void;
export type MouseEventCallback = (event: React.MouseEvent<HTMLButtonElement>) => void;
export type PredicateCallback = (id: number) => boolean;

// ---------------------------------------------------------------------
// 2. Component Interfaces Matching Each Function Prop Type
// ---------------------------------------------------------------------

export interface ActionButtonProps {
  readonly label: string;
  readonly onTrigger: SimpleActionCallback;
}

export interface TextInputProps {
  readonly placeholder: string;
  readonly onValueChange: DataEmitterCallback;
}

export interface EventButtonProps {
  readonly buttonText: string;
  readonly onClick: MouseEventCallback;
}

export interface ValidatorCardProps {
  readonly itemId: number;
  readonly validator: PredicateCallback;
}

// ---------------------------------------------------------------------
// 3. Specialized Components for Each Function Prop Type
// ---------------------------------------------------------------------

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { label, onTrigger } = props;

  return (
    <button type="button" onClick={onTrigger}>
      {label}
    </button>
  );
};

export const TextInput: React.FC<TextInputProps> = (props) => {
  const { placeholder, onValueChange } = props;

  const [text, setText] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value;
    setText(newValue);
    onValueChange(newValue);
  };

  return <input type="text" value={text} placeholder={placeholder} onChange={handleChange} />;
};

export const EventButton: React.FC<EventButtonProps> = (props) => {
  const { buttonText, onClick } = props;

  return (
    <button type="button" onClick={onClick}>
      {buttonText}
    </button>
  );
};

export const ValidatorCard: React.FC<ValidatorCardProps> = (props) => {
  const { itemId, validator } = props;

  const isValid = validator(itemId);

  return (
    <div>
      <span>Item ID: {itemId}</span>
      <span>Validation Result: {isValid ? "Approved" : "Rejected"}</span>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Parent Container Demonstrating All Function Prop Variants
// ---------------------------------------------------------------------

export const FunctionPropsDemoContainer: React.FC = () => {
  const [activityLog, setActivityLog] = useState<string>("System Ready");

  return (
    <div>
      <h1>Function Props Architecture Demonstration</h1>
      <p>Log Status: {activityLog}</p>

      <div>
        <h3>1. Simple Action Callback ("() =&gt; void")</h3>
        <ActionButton label="Trigger Action" onTrigger={() => setActivityLog("Simple action triggered.")} />
      </div>

      <div>
        <h3>2. Data Emitter Callback (`(value: string) &gt; void`)</h3>
        <TextInput placeholder="Type something..." onValueChange={(val) => setActivityLog(`Emitted value: ${val}`)} />
      </div>

      <div>
        <h3>3. Synthetic Event Handler (`(e: React.MouseEvent) =&gt; void`)</h3>
        <EventButton
          buttonText="Click for Coordinates"
          onClick={(e) => setActivityLog(`Clicked at X: ${e.clientX}, Y: ${e.clientY}`)}
        />
      </div>

      <div>
        <h3>4. Predicate Query Callback (`(id: number) =&gt; boolean`)</h3>
        <ValidatorCard itemId={1024} validator={(id) => id % 2 === 0} />
      </div>
    </div>
  );
};

export default FunctionPropsDemoContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Upward Communication Channels: Function props establish standard mechanisms for child components to transmit data and event notifications to parent components.
// - Precise Signature Enforcement: Explicit signatures (`() => void`, `(val: string) => void`) guarantee complete parameter type safety across component boundaries.
// - Synthetic Event Propagation: Typing handlers with React event interfaces (`React.MouseEvent`, `React.ChangeEvent`) provides secure access to standard DOM event payloads.
// - Predicate Query Callbacks: Functions with explicit return values allow child components to execute synchronous calculations or checks against parent state.
// - Clean Architectural Boundaries: Presentation components stay decoupled from application state mechanisms while maintaining strict component parameter destructuring.
