/**
 * Event Capturing
 * ===============
 *
 * Event capturing is the phase in which a DOM event travels from the
 * document toward the element where the event originated, occurring
 * before the target and bubbling phases.
 */

// ---------------------------------------------------------------------
// 1. The Capture Phase and Propagation Order
// ---------------------------------------------------------------------

const root = document.querySelector("#root");
const section = document.querySelector("#section");
const button = document.querySelector("#button");

// Registering a listener for the capture phase
root.addEventListener(
  "click",
  (event) => {
    event.eventPhase; // Event.CAPTURING_PHASE (1)
  },
  { capture: true },
);

button.addEventListener("click", (event) => {
  event.eventPhase; // Event.AT_TARGET (2)
});

root.addEventListener("click", (event) => {
  event.eventPhase; // Event.BUBBLING_PHASE (3)
});

// Full propagation order:
// root (capture) -> section (capture) -> button (target) -> section (bubble) -> root (bubble)

// ---------------------------------------------------------------------
// 2. Event Properties During Capture
// ---------------------------------------------------------------------

root.addEventListener(
  "click",
  (event) => {
    event.target; // The original element where the event originated (remains stable)
    event.currentTarget; // The element whose listener is currently executing (root)
    event.eventPhase; // Event.CAPTURING_PHASE
  },
  { capture: true },
);

// ---------------------------------------------------------------------
// 3. Stopping Propagation During Capture
// ---------------------------------------------------------------------

root.addEventListener(
  "click",
  (event) => {
    event.stopPropagation(); // Halts propagation immediately, preventing it from reaching descendants
  },
  { capture: true },
);

// ---------------------------------------------------------------------
// 4. Observing Non-Bubbling Events
// ---------------------------------------------------------------------

const focusInput = document.querySelector("#input");

// Events like `focus` and `blur` do not bubble, but ancestor capture listeners can observe them
document.addEventListener(
  "focus",
  (event) => {
    // Observed as the event travels downward toward the target
  },
  { capture: true },
);

// ---------------------------------------------------------------------
// 5. Event Capturing in React
// ---------------------------------------------------------------------

// React uses a `Capture` suffix for handlers that run during the capture phase:
//
// function CaptureExample() {
//   return (
//     <div onClickCapture={() => console.log("Capture phase")}>
//       <button onClick={() => console.log("Target/Bubble phase")}>Click</button>
//     </div>
//   );
// }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Event capturing travels downward from the document/ancestors toward the target before the bubbling phase.
// - Register capture listeners by passing `{ capture: true }` to `addEventListener()`.
// - `event.eventPhase` reflects the phase (`Event.CAPTURING_PHASE`, `Event.AT_TARGET`, `Event.BUBBLING_PHASE`).
// - `event.target` remains the origin element, while `event.currentTarget` tracks the active listener's element.
// - Capturing allows ancestors to observe non-bubbling events (like `focus`) and run logic before descendants process them.
// - React mirrors this behavior using props like `onClickCapture`.
