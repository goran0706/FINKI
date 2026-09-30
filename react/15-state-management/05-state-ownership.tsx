/**
 * State Ownership
 * ===============
 *
 * State ownership defines which component in the hierarchy holds the single source of truth for
 * a piece of data. The owner component is responsible for holding the state in memory, passing
 * read-only snapshots downward, and executing state transition updates.
 *
 * Locating state ownership correctly prevents synchronization bugs and unnecessary coupling. State
 * should be owned by the component that directly needs it, or by the lowest common ancestor when
 * multiple components depend on or modify the same piece of information.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PanelItem {
  readonly id: number;
  readonly title: string;
  readonly content: string;
}

export interface IsolatedPanelProps {
  readonly item: PanelItem;
}

export interface ManagedAccordionProps {
  readonly items: readonly PanelItem[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const IsolatedPanel: React.FC<IsolatedPanelProps> = ({ item }) => {
  // Local state ownership: Component exclusively owns its expanded state
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div>
      <div>
        <strong>{item.title} (Self-Owned State)</strong>
        <button type="button" onClick={() => setIsExpanded((prev) => !prev)}>
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>
      {isExpanded && <p>{item.content}</p>}
    </div>
  );
};

export const ManagedAccordion: React.FC<ManagedAccordionProps> = ({ items }) => {
  // Parent state ownership: Accordion owns active ID state to enforce single selection
  const [activeId, setActiveId] = useState<number | null>(items[0]?.id ?? null);

  return (
    <div>
      {items.map((item) => {
        const isExpanded = item.id === activeId;

        return (
          <div key={item.id}>
            <div>
              <strong>{item.title} (Parent-Owned State)</strong>
              <button type="button" onClick={() => setActiveId(isExpanded ? null : item.id)}>
                {isExpanded ? "Collapse" : "Expand"}
              </button>
            </div>
            {isExpanded && <p>{item.content}</p>}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StateOwnershipContainer: React.FC = () => {
  const panels: readonly PanelItem[] = [
    {
      id: 1,
      title: "Panel Alpha",
      content: "Detailed configuration settings for Alpha.",
    },
    {
      id: 2,
      title: "Panel Beta",
      content: "Detailed configuration settings for Beta.",
    },
  ];

  return (
    <div>
      <h1>05 - State Ownership</h1>

      <h2>1. Independent Self-Owned State in Isolated Components</h2>
      {panels.map((panel) => (
        <IsolatedPanel key={panel.id} item={panel} />
      ))}

      <h2>2. Centralized Parent State Ownership Controlling Children</h2>
      <ManagedAccordion items={panels} />
    </div>
  );
};

export default StateOwnershipContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State ownership dictates which component manages and updates a given piece of state.
// - Self-owned local state is ideal for components operating independently without shared dependencies.
// - Parent ownership is required when coordination or exclusive selection logic spans multiple items.
// - The state owner serves as the authoritative source of truth for downstream consumer components.
// - Clear state ownership rules prevent state duplication, race conditions, and synchronization bugs.
