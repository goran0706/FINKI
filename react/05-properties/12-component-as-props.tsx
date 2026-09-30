/**
 * Component Props
 * ===============
 *
 * In advanced component architecture, props are not restricted to primitive data types or plain
 * objects. React allows components to accept React elements (`React.ReactNode`), component types,
 * or custom render functions as props, forming the foundation of React's composition model.
 *
 * Accepting elements, component references, or render functions allows container components to remaining
 * agnostic of their wrapped layout structures. This enables explicit multi-slot injection zones,
 * controlled delegation of rendering decisions, and compile-time type safety via `React.ReactNode`
 * and `React.ComponentType<P>`.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Component Prop Interface Definitions
// ---------------------------------------------------------------------

export interface PanelHeaderProps {
  readonly title: string;
}

export interface CardContainerProps {
  readonly headerText: string;
  readonly badgeNode?: React.ReactNode;
  readonly footerComponent?: React.ComponentType<PanelHeaderProps>;
  readonly renderContent: (isExpanded: boolean) => React.ReactNode;
}

// ---------------------------------------------------------------------
// 2. Supporting Injected Component
// ---------------------------------------------------------------------

export const PanelFooter: React.FC<PanelHeaderProps> = (props) => {
  const { title } = props;

  return (
    <div className="panel-footer-inner">
      <small>Footer Context: {title}</small>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Component Implementing Component Props
// ---------------------------------------------------------------------

export const CardContainer: React.FC<CardContainerProps> = (props) => {
  const { headerText, badgeNode, footerComponent: FooterComponent, renderContent } = props;

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const handleToggle = (): void => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="card-container">
      <div className="card-header">
        <h3>{headerText}</h3>
        {badgeNode}
        <button type="button" onClick={handleToggle}>
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="card-body">{renderContent(isExpanded)}</div>

      {FooterComponent && (
        <div className="card-footer-slot">
          <FooterComponent title={headerText} />
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Parent Container Demonstrating Component Prop Variations
// ---------------------------------------------------------------------

export const ComponentPropsDemoContainer: React.FC = () => {
  return (
    <div>
      <h1>Component Props Architecture Demonstration</h1>
      <p>Demonstrating ReactNode injection, ComponentType references, and render props.</p>

      <CardContainer
        headerText="System Diagnostics Dashboard"
        badgeNode={<span className="badge-live">LIVE</span>}
        footerComponent={PanelFooter}
        renderContent={(isExpanded) =>
          isExpanded ? (
            <div>
              <p>CPU Load: 14%</p>
              <p>Memory Usage: 4.2GB / 16GB</p>
            </div>
          ) : (
            <p>Content collapsed.</p>
          )
        }
      />
    </div>
  );
};

export default ComponentPropsDemoContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Composition Over Inheritance: Passing components, elements, or render functions via props allows container components to remain completely agnostic of inner UI structures.
// - Multi-Slot Injection: Defining named properties typed as `React.ReactNode` creates explicit injection zones for parent components to plug in custom layouts.
// - Render Functions & Render Props: Executable functions passing state back to parent consumers allow child components to delegate rendering decisions cleanly.
// - Component Type Safety: Leveraging `React.ComponentType<P>` guarantees compile-time correctness when injecting uninstantiated component references.
// - Clean Architecture Compliance: Component parameters maintain clean multi-line destructuring within component bodies without extraneous boilerplate.
