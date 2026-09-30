/**
 * Event Delegation
 * =================
 *
 * Event delegation is a pattern where an event handler is attached to a common ancestor instead
 * of registering separate handlers on each descendant. When a descendant interaction bubbles to
 * that ancestor, the handler can inspect `event.target` and determine which descendant initiated
 * the event.
 *
 * Delegation relies on event bubbling. The ancestor receives the same event after it propagates
 * from the originating descendant, while `event.currentTarget` identifies the ancestor containing
 * the delegated handler. This allows one handler to coordinate interactions from multiple child
 * elements.
 *
 * In React, event delegation can be implemented directly with a parent handler. The handler should
 * narrow `event.target` before accessing element-specific properties, because `target` is typed as
 * `EventTarget`. A `data-*` attribute is a useful way to associate delegated DOM elements with
 * application-specific actions.
 */

import React, { type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DelegatedButtonListProps {
  readonly labels: readonly string[];
}

export interface DelegatedActionListProps {
  readonly labels: readonly string[];
}

export interface DelegatedTargetNarrowingProps {
  readonly label: string;
}

export interface DelegatedCurrentTargetProps {
  readonly labels: readonly string[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * One parent handler can respond to clicks originating from multiple child
 * buttons because the clicks bubble to their common ancestor.
 */
export const DelegatedButtonList: React.FC<DelegatedButtonListProps> = ({ labels }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target instanceof HTMLButtonElement) {
      console.log("Clicked button:", event.target.textContent);
    }
  };

  return (
    <div onClick={handleClick}>
      {labels.map((label: string) => (
        <button key={label} type="button">
          {label}
        </button>
      ))}
    </div>
  );
};

/**
 * Delegated elements can carry application-specific information through
 * `data-*` attributes, allowing one handler to identify the requested action.
 */
export const DelegatedActionList: React.FC<DelegatedActionListProps> = ({ labels }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const action: string | undefined = event.target.dataset.action;

    if (action !== undefined) {
      console.log("Requested action:", action);
    }
  };

  return (
    <div onClick={handleClick}>
      {labels.map((label: string) => {
        const action: string = label.toLowerCase().replaceAll(" ", "-");

        return (
          <button key={action} type="button" data-action={action}>
            {label}
          </button>
        );
      })}
    </div>
  );
};

/**
 * Delegation requires narrowing the event target before accessing DOM-specific
 * properties. An arbitrary EventTarget does not guarantee element properties.
 */
export const DelegatedTargetNarrowing: React.FC<DelegatedTargetNarrowingProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.target instanceof HTMLButtonElement) {
      console.log("Button value:", event.target.value);
    }
  };

  return (
    <div onClick={handleClick}>
      <button type="button" value="selected">
        <span>{label}</span>
      </button>
    </div>
  );
};

/**
 * In a delegated handler, `currentTarget` is the element containing the
 * delegated handler, while `target` identifies the descendant that was clicked.
 */
export const DelegatedCurrentTarget: React.FC<DelegatedCurrentTargetProps> = ({ labels }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (!(event.target instanceof HTMLButtonElement)) {
      return;
    }

    console.log("Clicked:", event.target.textContent);
    console.log("Handler container:", event.currentTarget);
  };

  return (
    <div onClick={handleClick}>
      {labels.map((label: string) => (
        <button key={label} type="button">
          {label}
        </button>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventDelegationDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. One Handler for Multiple Buttons</h2>
      <DelegatedButtonList labels={["First", "Second", "Third"]} />

      <h2>2. Identifying Delegated Actions</h2>
      <DelegatedActionList labels={["Edit", "Delete", "Archive"]} />

      <h2>3. Narrowing a Delegated Event Target</h2>
      <DelegatedTargetNarrowing label="Click Nested Content" />

      <h2>4. Target Versus Delegated Handler Element</h2>
      <DelegatedCurrentTarget labels={["One", "Two", "Three"]} />
    </div>
  );
};

export default EventDelegationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Event delegation attaches one handler to a common ancestor instead of
//   separate handlers on every descendant.
// - Delegation relies on event propagation, normally through bubbling.
// - `event.target` identifies the descendant that originally received the event.
// - `event.currentTarget` identifies the ancestor containing the delegated handler.
// - `event.target` should be narrowed before accessing element-specific properties.
// - `data-*` attributes can associate delegated elements with application-specific actions.
// - One delegated handler can coordinate interactions from many descendants.
