/**
 * Component Encapsulation
 * =======================
 *
 * Encapsulation in React shields internal state, implementation details, and DOM mechanics
 * from external consumers by establishing clean declarative prop boundaries. Components function
 * as complete black boxes that conceal internal complexity, ensuring that local memory, state
 * setters, and validation logic remain strictly private while data flows upward solely through
 * designated callback functions.
 *
 * Beyond state privacy, architectural encapsulation leverages composition via children to manage
 * container behaviors like expansion toggles and layout mechanics without tightly coupling content.
 * Semantic wrappers and structural fragments further streamline presentation layers, organizing
 * grouped elements cleanly while preventing unnecessary DOM pollution and extraneous container nodes.
 */

import React, { Fragment, useState } from "react";

export interface EncapsulatedInputProps {
  readonly label: string;
  readonly placeholder?: string;
  readonly maxLength?: number;
  readonly onValueSubmit?: (value: string) => void;
}

export const EncapsulatedInput: React.FC<EncapsulatedInputProps> = (props) => {
  const { label, placeholder = "Type here...", maxLength = 50, onValueSubmit } = props;

  const [text, setText] = useState<string>("");

  const remainingChars = maxLength - text.length;
  const isValid = text.trim().length > 0;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const nextValue = event.target.value;
    if (nextValue.length <= maxLength) {
      setText(nextValue);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!isValid) return;

    if (onValueSubmit) {
      onValueSubmit(text.trim());
    }
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>{label}</label>
      <input type="text" value={text} placeholder={placeholder} onChange={handleChange} />
      <span>Characters remaining: {remainingChars}</span>
      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};

export interface EncapsulatedCardProps {
  readonly title: string;
  readonly defaultExpanded?: boolean;
  readonly children: React.ReactNode;
}

export const EncapsulatedCard: React.FC<EncapsulatedCardProps> = (props) => {
  const { title, defaultExpanded = true, children } = props;

  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const handleToggle = (): void => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <header>
        <h3>{title}</h3>
        <button type="button" onClick={handleToggle}>
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </header>
      {isExpanded && <div>{children}</div>}
    </div>
  );
};

export const EncapsulatingComponent: React.FC = () => {
  const [fragmentState] = useState<boolean>(true);

  if (fragmentState) {
    return (
      <Fragment>
        <p>EncapsulatingComponent</p>
        <p>This is an encapsulated component</p>
      </Fragment>
    );
  }

  return (
    <section>
      <p>EncapsulatingComponent</p>
      <p>This is an encapsulated component</p>
    </section>
  );
};

export default EncapsulatingComponent;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Encapsulated Input: Internal text state, validation rules, and character counting remain completely private; only submitted data is emitted via `onValueSubmit`.
// - Encapsulated Card: Manages its own expansion state and toggle logic while accepting arbitrary child markup via `children`.
// - Structural Fragments: Uses fragments or semantic wrappers to encapsulate grouped UI elements without introducing extraneous DOM container nodes.
// - Strict Structural Compliance: Follows explicit arrow syntax, export isolation, and dedicated-line body destructuring rules without layout comment clutter.
