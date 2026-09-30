/**
 * Testing Portals
 * ===============
 *
 * React portals render a component into a DOM node outside its parent's normal DOM hierarchy.
 * Testing Library renders into a container while queries operate on the document by default, so
 * portal content can usually be tested through the same user-facing queries as regular content.
 */

import { useState, type FC, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------
// 1. Basic portal
// ---------------------------------------------------------------------

interface ModalProps {
  readonly children: ReactElement;
  readonly onClose: () => void;
}

export const Modal: FC<ModalProps> = ({ children, onClose }): ReactElement => {
  const portalRoot = document.getElementById("modal-root");

  if (portalRoot === null) {
    throw new Error("Modal root was not found");
  }

  return createPortal(
    <div role="presentation">
      <div role="dialog" aria-modal="true" aria-label="Modal">
        {children}
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    portalRoot,
  );
};

// A portal changes where the element is mounted in the DOM.
// It does not change how the component participates in the React tree.

// ---------------------------------------------------------------------
// 2. Creating the portal root for a test
// ---------------------------------------------------------------------

export const createPortalRoot = (): HTMLDivElement => {
  const portalRoot = document.createElement("div");

  portalRoot.setAttribute("id", "modal-root");
  document.body.appendChild(portalRoot);

  return portalRoot;
};

// A test can create the DOM node required by the portal:
//
// const portalRoot = createPortalRoot();
//
// render(<Modal onClose={vi.fn()}>...</Modal>);
//
// The portal now has a real DOM destination during the test.

// ---------------------------------------------------------------------
// 3. Testing portal content
// ---------------------------------------------------------------------

export const ModalExample: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <h2>Account settings</h2>
          <p>Update your account settings.</p>
        </Modal>
      )}
    </>
  );
};

// A typical test:
//
// const user = userEvent.setup();
// const portalRoot = createPortalRoot();
//
// render(<ModalExample />);
//
// await user.click(screen.getByRole("button", {name: "Open modal"}));
//
// expect(
//     screen.getByRole("dialog", {name: "Modal"}),
// ).toBeInTheDocument();
//
// expect(
//     screen.getByRole("heading", {name: "Account settings"}),
// ).toBeInTheDocument();
//
// portalRoot.remove();
//
// The test queries the rendered UI rather than inspecting the implementation
// details of `createPortal`.

// ---------------------------------------------------------------------
// 4. Testing portal interaction
// ---------------------------------------------------------------------

// Portal content remains interactive:
//
// const user = userEvent.setup();
// const portalRoot = createPortalRoot();
//
// render(<ModalExample />);
//
// await user.click(screen.getByRole("button", {name: "Open modal"}));
// await user.click(screen.getByRole("button", {name: "Close"}));
//
// expect(screen.queryByRole("dialog", {name: "Modal"})).not.toBeInTheDocument();
//
// portalRoot.remove();

// ---------------------------------------------------------------------
// 5. Queries use the document by default
// ---------------------------------------------------------------------

// Testing Library's `screen` queries search the document:
//
// screen.getByRole("dialog", {name: "Modal"});
//
// This is useful for portals because the portal content is mounted elsewhere
// in the document but is still part of the rendered page.

// ---------------------------------------------------------------------
// 6. Querying a specific portal root
// ---------------------------------------------------------------------

// A test can also query a specific DOM node when the test needs to scope its
// search:
//
// const portalRoot = createPortalRoot();
// const {within} = await import("@testing-library/dom");
//
// const modal = within(portalRoot).getByRole("dialog", {name: "Modal"});
//
// portalRoot.remove();
//
// Scoping queries to the portal root is useful when several independent
// portal containers exist.

// ---------------------------------------------------------------------
// 7. Portal events still reach the React tree
// ---------------------------------------------------------------------

interface PortalButtonProps {
  readonly onClick: () => void;
}

export const PortalButton: FC<PortalButtonProps> = ({ onClick }): ReactElement => {
  const portalRoot = document.getElementById("modal-root");

  if (portalRoot === null) {
    throw new Error("Modal root was not found");
  }

  return createPortal(
    <button type="button" onClick={onClick}>
      Portal action
    </button>,
    portalRoot,
  );
};

// A portal changes the DOM location, but the portal remains part of the
// React component tree. React events therefore propagate through the React
// tree rather than following the portal's DOM ancestry.
//
// const handleClick = vi.fn();
// const portalRoot = createPortalRoot();
//
// render(<PortalButton onClick={handleClick} />);
//
// await user.click(screen.getByRole("button", {name: "Portal action"}));
//
// expect(handleClick).toHaveBeenCalledTimes(1);
//
// portalRoot.remove();

// ---------------------------------------------------------------------
// 8. Testing parent-child interactions
// ---------------------------------------------------------------------

interface PortalContainerProps {
  readonly onPortalClick: () => void;
}

export const PortalContainer: FC<PortalContainerProps> = ({ onPortalClick }): ReactElement => {
  const portalRoot = document.getElementById("modal-root");

  if (portalRoot === null) {
    throw new Error("Modal root was not found");
  }

  return createPortal(
    <button type="button" onClick={onPortalClick}>
      Confirm
    </button>,
    portalRoot,
  );
};

// The test should verify observable behavior:
//
// const onPortalClick = vi.fn();
// const portalRoot = createPortalRoot();
//
// render(<PortalContainer onPortalClick={onPortalClick} />);
//
// await user.click(screen.getByRole("button", {name: "Confirm"}));
//
// expect(onPortalClick).toHaveBeenCalledTimes(1);
//
// portalRoot.remove();

// ---------------------------------------------------------------------
// 9. Testing a modal with application state
// ---------------------------------------------------------------------

export const ConfirmDialog: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const portalRoot = document.getElementById("modal-root");

  if (portalRoot === null) {
    throw new Error("Modal root was not found");
  }

  const dialog = open ? (
    <div role="dialog" aria-modal="true" aria-label="Confirmation">
      <p>Are you sure?</p>
      <button
        type="button"
        onClick={() => {
          setConfirmed(true);
          setOpen(false);
        }}
      >
        Confirm
      </button>
      <button type="button" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </div>
  ) : null;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Delete
      </button>

      <output aria-label="Confirmation status">{confirmed ? "Confirmed" : "Not confirmed"}</output>

      {dialog !== null && createPortal(dialog, portalRoot)}
    </>
  );
};

// The important behavior can be tested through the UI:
//
// const user = userEvent.setup();
// const portalRoot = createPortalRoot();
//
// render(<ConfirmDialog />);
//
// await user.click(screen.getByRole("button", {name: "Delete"}));
//
// expect(
//     screen.getByRole("dialog", {name: "Confirmation"}),
// ).toBeInTheDocument();
//
// await user.click(screen.getByRole("button", {name: "Confirm"}));
//
// expect(
//     screen.getByRole("status", {name: "Confirmation status"}),
// ).toHaveTextContent("Confirmed");
//
// portalRoot.remove();

// ---------------------------------------------------------------------
// 10. Portal cleanup
// ---------------------------------------------------------------------

// Portal tests should clean up any DOM nodes that they create manually:
//
// const portalRoot = createPortalRoot();
//
// // ...test...
//
// portalRoot.remove();
//
// Testing Library automatically cleans up its rendered React tree after each
// test when the configured test environment enables automatic cleanup.
// Manually created DOM nodes are separate from that rendered React tree and
// should be removed by the test setup that created them.

// ---------------------------------------------------------------------
// 11. Reusable portal-root setup
// ---------------------------------------------------------------------

export const setupPortalRoot = (): (() => void) => {
  const portalRoot = createPortalRoot();

  return () => {
    portalRoot.remove();
  };
};

// A test can use a setup helper:
//
// const cleanupPortal = setupPortalRoot();
//
// render(<ModalExample />);
//
// // ...test...
//
// cleanupPortal();

// ---------------------------------------------------------------------
// 12. Multiple portal roots
// ---------------------------------------------------------------------

// Applications sometimes use separate containers for different portal types:
//
// <div id="modal-root"></div>
// <div id="toast-root"></div>
//
// Each portal can target a different container:
//
// createPortal(modal, modalRoot);
// createPortal(toast, toastRoot);
//
// Tests can create the required containers and query the resulting UI.
// The important distinction is the user-visible behavior, not the fact that
// `createPortal` was used internally.

// ---------------------------------------------------------------------
// 13. Avoid implementation-detail assertions
// ---------------------------------------------------------------------

// Prefer:
//
// expect(screen.getByRole("dialog", {name: "Modal"})).toBeInTheDocument();
//
// over assertions about React internals:
//
// expect(componentInstance.portalRoot).toBe(...);
//
// Portal tests should verify what the user can see and interact with.

// ---------------------------------------------------------------------
// 14. Testing disappearance
// ---------------------------------------------------------------------

// Portal content that is conditionally removed can be tested with the same
// asynchronous utilities used for ordinary DOM content:
//
// const user = userEvent.setup();
// const portalRoot = createPortalRoot();
//
// render(<ModalExample />);
//
// await user.click(screen.getByRole("button", {name: "Open modal"}));
// expect(screen.getByRole("dialog", {name: "Modal"})).toBeInTheDocument();
//
// await user.click(screen.getByRole("button", {name: "Close"}));
//
// await waitForElementToBeRemoved(
//     screen.getByRole("dialog", {name: "Modal"}),
// );
//
// portalRoot.remove();

// ---------------------------------------------------------------------
// 15. Portal accessibility
// ---------------------------------------------------------------------

// Portals are not exempt from accessibility requirements.
// A modal should expose an appropriate dialog role, accessible name, and
// modal state when those semantics match the component's behavior:
//
// <div role="dialog" aria-modal="true" aria-label="Modal">
//
// Tests should query these accessible semantics rather than relying on CSS
// selectors or generated class names.

// ---------------------------------------------------------------------
// 16. Complete portal testing pattern
// ---------------------------------------------------------------------

// A typical portal test follows this sequence:
//
// 1. Create the DOM node required by the portal.
// 2. Render the component.
// 3. Interact with the component through user-facing queries.
// 4. Query portal content through `screen` or a scoped query.
// 5. Assert the observable result.
// 6. Remove manually created portal containers.
//
// This keeps portal tests consistent with ordinary component tests while
// accounting for the portal's separate DOM destination.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React portals render content into a DOM node outside the parent's normal DOM hierarchy.
// - Portal content can usually be queried with `screen` because it is still part of the document.
// - `createPortal` changes the DOM location without removing the portal from the React tree.
// - Portal content remains interactive and participates in React event propagation.
// - Create required portal containers explicitly when the test environment does not provide them.
// - Remove manually created portal containers during test cleanup.
// - Use `within` when a test needs to scope queries to a specific portal root.
// - Test portal behavior through accessible roles, names, text, and user interactions.
// - Avoid assertions about `createPortal` implementation details or internal React structures.
// - Portals should be tested for accessibility just like content rendered in the normal DOM hierarchy.
