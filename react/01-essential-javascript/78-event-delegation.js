/**
 * Event Delegation
 * ================
 *
 * Event delegation is a pattern where a single event listener is attached
 * to an ancestor element to manage events for multiple current or future
 * descendants, relying on event bubbling and propagation.
 */

// ---------------------------------------------------------------------
// 1. Basic Event Delegation
// ---------------------------------------------------------------------

const list = document.querySelector("#list");

list.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
  }

  // A single parent listener handles clicks from all descendant buttons.
});

// ---------------------------------------------------------------------
// 2. target vs. currentTarget in Delegation
// ---------------------------------------------------------------------

const container = document.querySelector("#container");

container.addEventListener("click", (event) => {
  event.target; // The exact descendant element where the click originated
  event.currentTarget; // The ancestor element hosting the listener (container)
});

// ---------------------------------------------------------------------
// 3. Using element.closest() for Nested Elements
// ---------------------------------------------------------------------

const toolbar = document.querySelector("#toolbar");

toolbar.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  // Safely resolves the target even if the user clicks a nested child (e.g., a span or icon)
  const button = target.closest("button[data-action]");
  if (!button || !toolbar.contains(button)) {
    return;
  }

  const action = button.dataset.action;
  // Handle action (e.g., "save", "delete")
});

// ---------------------------------------------------------------------
// 4. Handling Dynamic Elements
// ---------------------------------------------------------------------

// Because the listener is registered on a stable ancestor, newly inserted
// elements automatically participate in delegation without extra listener bindings.
const dynamicList = document.querySelector("#dynamic-list");

dynamicList.addEventListener("click", (event) => {
  const item = event.target.closest("li");
  if (item && dynamicList.contains(item)) {
    // Handles both existing and newly added items seamlessly
  }
});

// ---------------------------------------------------------------------
// 5. Limitations and Caveats
// ---------------------------------------------------------------------

// - Non-bubbling events (such as `focus` or `blur`) will not trigger standard delegation.
//   Use bubbling alternatives (`focusin`, `focusout`) or capture-phase listeners (`{ capture: true }`).
// - If a descendant calls `event.stopPropagation()`, the event will not reach the delegated ancestor.

// ---------------------------------------------------------------------
// 6. Event Delegation in React
// ---------------------------------------------------------------------

// React delegates events globally through its own synthetic event system,
// but you can implement manual delegation patterns within components:
//
// function ActionList() {
//   return (
//     <ul onClick={(e) => {
//       const button = e.target.closest("[data-action]");
//       if (button) {
//         const action = button.dataset.action;
//         // Handle action
//       }
//     }}>
//       <li><button data-action="edit">Edit</button></li>
//       <li><button data-action="delete">Delete</button></li>
//     </ul>
//   );
// }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Event delegation centralizes logic by attaching one listener to a common ancestor.
// - `event.target` pinpoints the origin, while `event.currentTarget` reflects the listener's owner.
// - `element.closest()` is essential for handling nested element structures correctly.
// - Supports dynamic content automatically without re-binding listeners.
// - Requires event bubbling; `stopPropagation()` on a child will break the delegation chain.
