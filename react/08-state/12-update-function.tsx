/**
 * Update Function
 * ===============
 *
 * Passing an updater function `prev => next` to a state set function queues a state update rather than
 * passing a static value. React puts updater functions in a queue and processes them sequentially during
 * the next render pass.
 *
 * When updating state multiple times within a single event handler, passing an updater function ensures
 * that each update receives the pending state returned by the previous updater function in the queue,
 * rather than relying on the static state snapshot from the current render closure.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface QueueCounterProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const QueueCounter: React.FC<QueueCounterProps> = ({ initialCount }) => {
  const [count, setCount] = useState<number>(initialCount);

  const handleBatchDirect = (): void => {
    // Reads count snapshot; all three calls pass same value
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  const handleBatchUpdater = (): void => {
    // Queues updater functions; processed sequentially during re-render
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
  };

  const handleMixedUpdateQueue = (): void => {
    // Direct value followed by updater function
    setCount(count + 5);
    setCount((prevCount) => prevCount * 2);
  };

  return (
    <div>
      <p>Count Value: {count}</p>
      <button type="button" onClick={handleBatchDirect}>
        Increment Direct (+1)
      </button>
      <button type="button" onClick={handleBatchUpdater}>
        Increment Updater Queue (+3)
      </button>
      <button type="button" onClick={handleMixedUpdateQueue}>
        Mixed Update Queue (+5 then * 2)
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const UpdateFunctionContainer: React.FC = () => {
  return (
    <div>
      <h1>12 - Update Function</h1>

      <h2>1. Sequential State Updaters vs. Snapshot Passing</h2>
      <QueueCounter initialCount={0} />
    </div>
  );
};

export default UpdateFunctionContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Passing an updater function prev => next queues state calculations for the next render pass.
// - Updater functions receive the most recent pending state calculated by prior queued updaters.
// - Passing direct values uses the state snapshot captured during the current render execution frame.
// - Mixing direct value assignments and updaters evaluates in sequence during update queue processing.
// - Functional updaters prevent stale closure bugs when state updates occur inside async handlers.
