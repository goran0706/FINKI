/**
 * State Updates Batching
 * ======================
 *
 * React batches state updates to reduce unnecessary re-renders. Batching means React groups multiple
 * state updates triggered within event handlers, promises, timeouts, or native event listeners into a
 * single re-render pass before updating the screen.
 *
 * Automatic batching ensures components perform a single render pass even if multiple state setters
 * are dispatched sequentially. To force React to apply an update immediately and flush DOM changes
 * synchronously, `flushSync` from `react-dom` can be invoked around specific update callbacks.
 */

import React, { useState } from "react";
import { flushSync } from "react-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BatchingDemoProps {
  readonly initialStep: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const AutomaticBatching: React.FC<BatchingDemoProps> = ({ initialStep }) => {
  const [count, setCount] = useState<number>(0);
  const [flag, setFlag] = useState<boolean>(false);
  const [renderCount, setRenderCount] = useState<number>(1);

  // Track render passes
  const currentRender = renderCount;

  const handleBatchInEventHandler = (): void => {
    // Both updates are batched into a single re-render
    setCount((prev) => prev + initialStep);
    setFlag((prev) => !prev);
    setRenderCount((prev) => prev + 1);
  };

  const handleBatchInAsync = (): void => {
    setTimeout(() => {
      // Automatic batching applies inside timeouts and promises in React 18+
      setCount((prev) => prev + initialStep);
      setFlag((prev) => !prev);
      setRenderCount((prev) => prev + 1);
    }, 100);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <p>Flag: {flag ? "True" : "False"}</p>
      <p>Component Render Pass Count: {currentRender}</p>
      <button type="button" onClick={handleBatchInEventHandler}>
        Update Multiple States (Event Handler)
      </button>
      <button type="button" onClick={handleBatchInAsync}>
        Update Multiple States (Timeout)
      </button>
    </div>
  );
};

export const FlushSyncBatching: React.FC = () => {
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [stateMessage, setStateMessage] = useState<string>("Normal Mode");

  const handleSyncUpdate = (): void => {
    // Forces React to synchronously re-render and flush DOM updates immediately
    flushSync(() => {
      setIsPrinting(true);
      setStateMessage("Printing Mode Active");
    });

    // Executed immediately after DOM has been synchronously updated
    console.log("DOM updated synchronously with message:", stateMessage);
  };

  return (
    <div>
      <p>Message: {stateMessage}</p>
      <p>Is Printing: {isPrinting ? "Yes" : "No"}</p>
      <button type="button" onClick={handleSyncUpdate}>
        Bypass Batching with flushSync
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StateUpdatesBatchingContainer: React.FC = () => {
  return (
    <div>
      <h1>11 - State Updates Batching</h1>

      <h2>1. Automatic Batching Across Event Handlers and Async Tasks</h2>
      <AutomaticBatching initialStep={1} />

      <h2>2. Opting Out of Batching with flushSync</h2>
      <FlushSyncBatching />
    </div>
  );
};

export default StateUpdatesBatchingContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React automatically batches multiple state updates into a single re-render pass for better performance.
// - State updates scheduled inside promises, timeouts, and native handlers are batched automatically.
// - Grouping state updates prevents incomplete intermediate renders from flashing on screen.
// - Calling flushSync forces React to synchronously re-render and flush pending DOM updates immediately.
// - Using flushSync should be reserved for rare cases where immediate DOM measurement is required.
