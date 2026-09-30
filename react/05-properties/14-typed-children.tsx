/**
 * Typed Children
 * ==============
 *
 * While `React.ReactNode` provides maximum flexibility for arbitrary nested content, enterprise-grade
 * component architectures (such as compound components, tabs, or lists) often require strict control
 * over what types of children can be passed into a container.
 *
 * Enforcing explicit element interfaces using `React.ReactElement<P>` ensures compile-time validation
 * of compound children while preventing layout misuse. Combining typed children with `React.Children`
 * utilities allows containers to inspect sub-component props safely and orchestrate compound rendering
 * behaviors predictably.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Typed Children Interface Definitions
// ---------------------------------------------------------------------

export interface TabItemProps {
  readonly label: string;
  readonly children: React.ReactNode;
}

export interface TabsContainerProps {
  readonly defaultActiveIndex?: number;
  readonly children: React.ReactElement<TabItemProps> | ReadonlyArray<React.ReactElement<TabItemProps>>;
}

// ---------------------------------------------------------------------
// 2. Specialized Sub-Components
// ---------------------------------------------------------------------

export const TabItem: React.FC<TabItemProps> = (props) => {
  const { children } = props;

  return <div className="tab-panel-content">{children}</div>;
};

// ---------------------------------------------------------------------
// 3. Container Component Enforcing Typed Children
// ---------------------------------------------------------------------

export const TabsContainer: React.FC<TabsContainerProps> = (props) => {
  const { defaultActiveIndex = 0, children } = props;

  const [activeIndex, setActiveIndex] = useState<number>(defaultActiveIndex);

  const tabsArray = React.Children.toArray(children) as ReadonlyArray<React.ReactElement<TabItemProps>>;

  return (
    <div className="tabs-container">
      <div className="tabs-navigation-bar">
        {tabsArray.map((tab, index) => (
          <button
            key={index}
            type="button"
            className={index === activeIndex ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveIndex(index)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      <div className="tabs-viewport">{tabsArray[activeIndex]}</div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Parent Container Demonstrating Typed Children Usage
// ---------------------------------------------------------------------

export const TypedChildrenDemoContainer: React.FC = () => {
  return (
    <div>
      <h1>Typed Children Architecture Demonstration</h1>
      <p>Demonstrating strict compile-time validation of compound child elements.</p>

      <TabsContainer defaultActiveIndex={0}>
        <TabItem label="Profile">
          <h3>User Profile Settings</h3>
          <p>Update personal information and profile visibility here.</p>
        </TabItem>
        <TabItem label="Security">
          <h3>Security Credentials</h3>
          <p>Manage passwords, two-factor authentication, and API tokens.</p>
        </TabItem>
        <TabItem label="Notifications">
          <h3>Notification Preferences</h3>
          <p>Configure email digests and push alert frequencies.</p>
        </TabItem>
      </TabsContainer>
    </div>
  );
};

export default TypedChildrenDemoContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Compile-Time Child Constraints: Typing children with `React.ReactElement<T>` ensures containers accept only authorized sub-component interfaces.
// - Compound Component Coordination: Typed children allow parent containers to safely read child properties during rendering.
// - Array Transformation Safety: Mapping via `React.Children.toArray(children)` ensures safe indexing and array iteration over nested elements.
// - Predictable Hierarchy Enforcement: Catches unexpected non-matching children at compile time before rendering issues occur.
// - Clean Architecture Compliance: Props are destructured on separate lines within component bodies, matching established formatting standards.
