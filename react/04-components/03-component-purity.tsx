/**
 * Component Purity
 * ================
 *
 * Component purity guarantees that rendering depends strictly on inputs without side effects,
 * enabling powerful performance optimizations through shallow and deep comparisons. Purity
 * does not imply zero state; components can manage internal memory provided their render
 * output remains completely deterministic: f(props, state) = JSX.
 *
 * Render phases must never mutate external variables, trigger side effects, or modify
 * the DOM directly. React supports these guarantees through built-in mechanisms like class
 * `React.PureComponent` and functional memoization wrappers (`React.memo`) with custom comparators
 * to handle nested reference equality.
 */

import React, { memo, PureComponent, useState } from "react";

// ---------------------------------------------------------------------
// Component Props & State Interfaces
// ---------------------------------------------------------------------

export interface UserMetaData {
  readonly settings: {
    readonly theme: string;
    readonly notificationsEnabled: boolean;
  };
}

export interface ComponentPurityProps {
  readonly id: string;
  readonly label: string;
  readonly metaData: UserMetaData;
}

export interface ComponentPurityState {
  readonly clickCount: number;
}

// ---------------------------------------------------------------------
// 1. Class Pure Component
// ---------------------------------------------------------------------

export class ClassPureComponent extends PureComponent<ComponentPurityProps, ComponentPurityState> {
  public override state: ComponentPurityState = {
    clickCount: 0,
  };

  public override render(): React.ReactNode {
    const { id, label, metaData } = this.props;
    const { clickCount } = this.state;
    const formattedLabel = `${id}: ${label.toUpperCase()}`;

    return (
      <div>
        <h3>Class Pure Component</h3>
        <p>{formattedLabel}</p>
        <p>Theme: {metaData.settings.theme}</p>
        <p>Clicks: {clickCount}</p>
        <button type="button" onClick={this.handleIncrement}>
          Increment State
        </button>
      </div>
    );
  }

  private handleIncrement = (): void => {
    this.setState((prevState) => ({
      clickCount: prevState.clickCount + 1,
    }));
  };
}

// ---------------------------------------------------------------------
// 2. Function Pure Component
// ---------------------------------------------------------------------

export const FunctionPureComponent: React.FC<ComponentPurityProps> = (props) => {
  const { id, label, metaData } = props;
  const [clickCount, setClickCount] = useState<number>(0);

  const handleIncrement = (): void => {
    setClickCount((prev) => prev + 1);
  };

  const formattedLabel = `${id}: ${label.toUpperCase()}`;

  return (
    <div>
      <h3>Function Pure Component</h3>
      <p>{formattedLabel}</p>
      <p>Theme: {metaData.settings.theme}</p>
      <p>Clicks: {clickCount}</p>
      <button type="button" onClick={handleIncrement}>
        Increment State
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Level 1 Optimization: Default Shallow Memoization (`React.memo`)
// ---------------------------------------------------------------------

export const MemoizedShallowPureComponent = memo(FunctionPureComponent);

// ---------------------------------------------------------------------
// 4. Level 2 Optimization: Custom Deep Comparison (`React.memo` + Comparator)
// ---------------------------------------------------------------------

const arePropsEqual = (
  prevProps: Readonly<ComponentPurityProps>,
  nextProps: Readonly<ComponentPurityProps>,
): boolean => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.label === nextProps.label &&
    prevProps.metaData.settings.theme === nextProps.metaData.settings.theme &&
    prevProps.metaData.settings.notificationsEnabled === nextProps.metaData.settings.notificationsEnabled
  );
};

export const MemoizedCustomCompareComponent = memo(FunctionPureComponent, arePropsEqual);

export default FunctionPureComponent;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Class Pure Component: Extends `React.PureComponent`, automatically handling shallow comparisons for both props and state.
// - Function Pure Component: Purely maps props and local state to JSX without side effects.
// - Level 1 Optimization: `React.memo` shallowly checks top-level prop references (`===`).
// - Level 2 Optimization: `React.memo` with custom comparator performs deep comparison on nested object attributes (`metaData.settings`).
