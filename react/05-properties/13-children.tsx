/**
 * Children Prop
 * =============
 *
 * The special `children` prop represents the nested content passed between the opening and
 * closing tags of a component element, enabling enclosure composition in React architecture.
 *
 * Enclosure composition allows wrapper components to decorate, layout, or manage arbitrary content
 * without tight coupling. Explicit typing via `React.ReactNode` supports all renderable nodes, while
 * utilities like `React.Children` allow container components to safely inspect, transform, and wrap
 * nested elements.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Children Prop Interface Definitions
// ---------------------------------------------------------------------

export interface ModalWrapperProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
}

export interface ListContainerProps {
  readonly title: string;
  readonly children: React.ReactNode;
}

// ---------------------------------------------------------------------
// 2. Components Consuming Children Props
// ---------------------------------------------------------------------

export const ModalWrapper: React.FC<ModalWrapperProps> = (props) => {
  const { isOpen, title, onClose, children } = props;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-window">
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export const ListContainer: React.FC<ListContainerProps> = (props) => {
  const { title, children } = props;

  return (
    <div className="list-container">
      <h4>{title}</h4>
      <ul className="wrapped-list">
        {/* Safely mapping over children nodes using React.Children utility */}
        {React.Children.map(children, (child, index) => (
          <li key={index} className="list-item-wrapper">
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Parent Container Demonstrating Children Prop Usage
// ---------------------------------------------------------------------

export const ChildrenDemoContainer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Children Prop Architecture Demonstration</h1>
      <p>Demonstrating enclosure nesting and React.Children manipulation utilities.</p>

      <button type="button" onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      {/* Enclosure composition passing nested JSX elements as children */}
      <ModalWrapper isOpen={isModalOpen} title="Account Settings" onClose={handleCloseModal}>
        <p>Manage your account preferences and security credentials below.</p>
        <input type="text" placeholder="Update Username..." />
      </ModalWrapper>

      <hr />

      {/* Wrapping multiple list elements via the children prop */}
      <ListContainer title="Featured Tasks">
        <span>Complete architectural documentation</span>
        <span>Review pull request feedback</span>
        <span>Deploy release candidate to staging</span>
      </ListContainer>
    </div>
  );
};

export default ChildrenDemoContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Enclosure Composition: The `children` prop enables clean nesting syntax, allowing containers to wrap arbitrary JSX element hierarchies.
// - Broad Type Compatibility: Typing `children` explicitly as `React.ReactNode` ensures support for all valid renderable React expressions.
// - Safe Node Inspection: Using `React.Children.map` and related utilities allows container components to inspect, wrap, or manipulate child nodes safely.
// - Design System Flexibility: Modal wrappers, panels, and layout containers rely on the children prop to remain agnostic of internal content structure.
// - Clean Architecture Compliance: Props are destructured on dedicated new lines within component bodies, maintaining standard layout conventions.
