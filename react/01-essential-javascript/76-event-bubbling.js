/**
 * Event Bubbling
 * ==============
 *
 * Event bubbling is the phase in which a DOM event moves from the event's
 * target element upward through its ancestors, allowing parent elements
 * to respond to events originating from their descendants.
 */

// ---------------------------------------------------------------------
// 1. Basic event bubbling order
// ---------------------------------------------------------------------

const outer = document.querySelector("#outer");
const middle = document.querySelector("#middle");
const inner = document.querySelector("#inner");

// Order: inner (target) -> middle -> outer -> document -> window
inner.addEventListener("click", () => {
  // Target listener runs first
});

middle.addEventListener("click", () => {
  // Bubbles to middle
});

outer.addEventListener("click", () => {
  // Bubbles to outer
});

// ---------------------------------------------------------------------
// 2. target vs. currentTarget during bubbling
// ---------------------------------------------------------------------

outer.addEventListener("click", (event) => {
  event.target; // The original element where the click occurred (e.g., inner)
  event.currentTarget; // The element whose listener is executing (outer)
});

// ---------------------------------------------------------------------
// 3. Stopping bubbling and default behavior
// ---------------------------------------------------------------------

middle.addEventListener("click", (event) => {
  event.stopPropagation(); // Stops the event from traveling further up the DOM tree
  // Note: Does not cancel the browser's default action (use preventDefault() for that)
});

// ---------------------------------------------------------------------
// 4. Event delegation using bubbling and closest()
// ---------------------------------------------------------------------

const list = document.querySelector("#list");

list.addEventListener("click", (event) => {
  const item = event.target.closest("[data-action]");

  if (!item || !list.contains(item)) {
    return;
  }

  const action = item.dataset.action;
  // Handle delegated action efficiently for current and dynamically added items
});

// ---------------------------------------------------------------------
// 5. Non-bubbling events vs. bubbling counterparts
// ---------------------------------------------------------------------

// Some events like `focus` and `blur` do not bubble.
// Use their bubbling counterparts (`focusin` and `focusout`) when ancestor tracking is needed.

// ---------------------------------------------------------------------
// 6. Custom events and bubbling
// ---------------------------------------------------------------------

const customEvent = new CustomEvent("user-selected", {
  bubbles: true, // Must be explicitly set to true for custom events to bubble
  detail: { userId: 42 },
});
// childElement.dispatchEvent(customEvent);

// ---------------------------------------------------------------------
// 7. Event bubbling in React
// ---------------------------------------------------------------------

// React's event system mirrors DOM bubbling:
//
// function App() {
//   return (
//     <ul onClick={(e) => console.log(e.target)}>
//       <li><button onClick={(e) => e.stopPropagation()}>Click</button></li>
//     </ul>
//   );
// }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Event bubbling travels upward from the target element through all ancestors.
// - `event.target` remains the origin element, while `event.currentTarget` matches the running listener's element.
// - `stopPropagation()` prevents the event from reaching further ancestors, distinct from `preventDefault()`.
// - Event delegation leverages bubbling and `element.closest()` to handle multiple or dynamic descendants efficiently.
// - Custom events require `{ bubbles: true }` to participate in bubbling, and React components utilize the same model.
