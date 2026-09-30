/**
 * Event Propagation
 * =================
 *
 * Event propagation describes how a DOM event travels through the document
 * tree from its originating target to other elements. It includes three phases:
 * capturing, target, and bubbling.
 */

// ---------------------------------------------------------------------
// 1. Propagation phases (Capturing, Target, Bubbling)
// ---------------------------------------------------------------------

const outer = document.querySelector("#outer");
const middle = document.querySelector("#middle");
const inner = document.querySelector("#inner");

// Capturing phase (travels from ancestors down to target when capture: true)
outer.addEventListener(
  "click",
  () => {
    // Runs during capturing phase
  },
  { capture: true },
);

// Target phase & Bubbling phase (travels from target back up to ancestors)
inner.addEventListener("click", () => {
  // Target phase
});

outer.addEventListener("click", () => {
  // Bubbling phase (default behaviour)
});

// ---------------------------------------------------------------------
// 2. target versus currentTarget
// ---------------------------------------------------------------------

outer.addEventListener("click", (event) => {
  event.target; // The original element where the event occurred (e.g., inner)
  event.currentTarget; // The element whose listener is currently executing (outer)
  event.eventPhase; // Event.CAPTURING_PHASE, Event.AT_TARGET, or Event.BUBBLING_PHASE
});

// ---------------------------------------------------------------------
// 3. Stopping propagation
// ---------------------------------------------------------------------

middle.addEventListener("click", (event) => {
  event.stopPropagation(); // Stops the event from moving to other targets in the tree
});

middle.addEventListener("click", (event) => {
  event.stopImmediatePropagation(); // Stops propagation AND prevents other listeners on the same target
});

// ---------------------------------------------------------------------
// 4. preventDefault() vs. stopPropagation()
// ---------------------------------------------------------------------

const link = document.querySelector("#link");

link.addEventListener("click", (event) => {
  event.preventDefault(); // Cancels the browser's default action (e.g., link navigation)
  event.stopPropagation(); // Stops the event from traveling up the DOM tree
});

// ---------------------------------------------------------------------
// 5. Event delegation
// ---------------------------------------------------------------------

const list = document.querySelector("#list");

list.addEventListener("click", (event) => {
  const item = event.target.closest("[data-item]");

  if (!item || !list.contains(item)) {
  }

  // Handle the clicked list item efficiently via bubbling
});

// ---------------------------------------------------------------------
// 6. Event propagation in React
// ---------------------------------------------------------------------

// React event handlers follow familiar propagation patterns:
//
// <div onClick={handleParentClick}>
//   <button onClick={(e) => e.stopPropagation()}>Save</button>
// </div>
//
// React exposes `stopPropagation()` and `preventDefault()` on its synthetic event object.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Event propagation flows through capturing, target, and bubbling phases.
// - `event.target` identifies where the event originated, while `event.currentTarget` refers to the element running the listener.
// - `stopPropagation()` halts tree traversal; `stopImmediatePropagation()` also halts other listeners on the same element.
// - `preventDefault()` cancels browser actions separately from tree propagation.
// - Event delegation relies heavily on bubbling and `element.closest()` to manage nested interactive items.
