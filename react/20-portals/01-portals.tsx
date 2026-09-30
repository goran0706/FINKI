/**
 * Portals
 * =======
 *
 * React portals provide a way to render a React element into a DOM node that
 * exists outside the DOM hierarchy of the component that created it. The
 * `createPortal` API from `react-dom` changes the physical DOM placement of
 * the rendered elements while preserving their position in the React tree.
 *
 * Because the portal remains part of the same React tree, context continues
 * to flow through the portal and events propagate according to the React
 * component hierarchy rather than simply following the DOM containment
 * relationship. Portals are commonly used when UI needs to escape an
 * ancestor's layout or stacking context, such as dialogs, tooltips, and
 * overlays.
 */

import { type FC, type ReactElement, type ReactNode, useState } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PortalContainerProps {
  readonly children: ReactNode;
}

export interface PortalExampleProps {
  readonly container: Element;
  readonly title: string;
  readonly description: string;
}

export interface PortalButtonProps {
  readonly onClick: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic purpose of a portal.
 *
 * `createPortal` renders the supplied React node into a different DOM node
 * while keeping that node within the same React component tree.
 */
export const BasicPortalExample: FC<PortalExampleProps> = ({ container, title, description }): ReactElement => {
  return createPortal(
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>This section is physically rendered inside the supplied DOM container.</p>
    </section>,
    container,
  );
};

/**
 * Demonstrates that a portal changes DOM placement rather than React-tree
 * ownership.
 *
 * The portal content is not moved into an unrelated React tree. React still
 * treats the portal as a descendant of the component that created it.
 */
export const PortalPreservesReactTreeExample: FC<PortalExampleProps> = ({
  container,
  title,
  description,
}): ReactElement => {
  return createPortal(
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>The DOM location changes, but the React parent-child relationship remains.</p>
    </section>,
    container,
  );
};

/**
 * Demonstrates that portal content can be rendered into a DOM node outside
 * the component's normal DOM subtree.
 *
 * This is the fundamental distinction between ordinary rendering and portal
 * rendering.
 */
export const ExternalDomContainerExample: FC<PortalExampleProps> = ({
  container,
  title,
  description,
}): ReactElement => {
  return createPortal(
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>The destination container can exist outside the component's normal DOM subtree.</p>
    </section>,
    container,
  );
};

/**
 * Demonstrates that context can continue through a portal.
 *
 * The portal changes the DOM destination, not the React tree through which
 * context is resolved.
 */
export const PortalContextExample: FC<PortalExampleProps> = ({ container, title, description }): ReactElement => {
  return createPortal(
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>React context can remain available to portal descendants.</p>
    </section>,
    container,
  );
};

/**
 * Demonstrates the typical overlay use case for portals.
 *
 * An overlay can be rendered near the document body instead of being constrained
 * by an ancestor's overflow, stacking, or positioning context.
 */
export const PortalOverlayExample: FC<PortalExampleProps> = ({ container, title, description }): ReactElement => {
  return createPortal(
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        padding: "2rem",
      }}
    >
      <section role="dialog" aria-labelledby="portal-overlay-title">
        <h2 id="portal-overlay-title">{title}</h2>
        <p>{description}</p>
        <p>Portals are useful when an overlay should escape an ancestor's layout constraints.</p>
      </section>
    </div>,
    container,
  );
};

/**
 * Demonstrates that a portal does not automatically create a new React root.
 *
 * `createPortal` inserts React-rendered content into an existing DOM node;
 * it is different from creating an independent React application root.
 */
export const PortalIsNotANewRootExample: FC<PortalExampleProps> = ({ container, title, description }): ReactElement => {
  return createPortal(
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>A portal is still managed by the existing React tree.</p>
    </section>,
    container,
  );
};

/**
 * Demonstrates conditional portal rendering.
 *
 * A component can decide whether the portal exists just as it can conditionally
 * render any other React element.
 */
export const ConditionalPortalExample: FC<PortalExampleProps> = ({ container, title, description }): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <button type="button" onClick={() => setIsOpen((current) => !current)}>
        {isOpen ? "Close portal" : "Open portal"}
      </button>

      {isOpen
        ? createPortal(
            <div role="status">
              <p>{description}</p>
            </div>,
            container,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates the relationship between portal content and its React parent.
 *
 * State can be owned by the parent component while the resulting UI is
 * physically rendered somewhere else in the DOM.
 */
export const PortalWithParentStateExample: FC<PortalExampleProps> = ({
  container,
  title,
  description,
}): ReactElement => {
  const [count, setCount] = useState<number>(0);

  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment parent state
      </button>

      {createPortal(
        <div>
          <p>Portal content sees the parent's state: {count}</p>
        </div>,
        container,
      )}
    </section>
  );
};

/**
 * Demonstrates the important distinction between the React tree and the DOM
 * tree when working with portals.
 *
 * The portal destination determines where the nodes appear in the DOM, but
 * React relationships such as context and event propagation remain based on
 * the React tree.
 */
export const ReactTreeVsDomTreeExample: FC<PortalExampleProps> = ({ container, title, description }): ReactElement => {
  return createPortal(
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>React-tree relationships and DOM containment are not identical when a portal is involved.</p>
    </section>,
    container,
  );
};

/**
 * Demonstrates a portal destination that is unavailable.
 *
 * `createPortal` requires an existing DOM node as its destination. A component
 * should therefore obtain or create its container before attempting to render
 * the portal.
 */
export const PortalContainerRequirementExample: FC<PortalExampleProps> = ({
  container,
  title,
  description,
}): ReactElement => {
  return createPortal(
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>The destination must be a valid DOM node when the portal is created.</p>
    </section>,
    container,
  );
};

/**
 * Demonstrates a common misconception about portals.
 *
 * A portal does not make its content independent from React. The content is
 * still mounted, updated, and unmounted as part of the React tree that owns it.
 */
export const PortalIsNotIndependentReactExample: FC<PortalExampleProps> = ({
  container,
  title,
  description,
}): ReactElement => {
  return createPortal(
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>Unmounting the owning React tree also removes its portal content.</p>
    </section>,
    container,
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PortalContainer: FC<PortalContainerProps> = ({ children }): ReactElement => {
  return (
    <div id="portal-root" data-portal-container="true">
      {children}
    </div>
  );
};

const PortalDemo: FC = (): ReactElement => {
  const portalContainer: HTMLElement | null =
    typeof document !== "undefined" ? document.getElementById("portal-root") : null;

  if (!portalContainer) {
    return (
      <main>
        <h1>Portals</h1>
        <p>The portal destination is not available.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Portals</h1>

      <section>
        <h2>1. Basic portal</h2>
        <BasicPortalExample
          container={portalContainer}
          title="Basic portal"
          description="React content can be rendered into a different DOM container."
        />
      </section>

      <section>
        <h2>2. React tree preservation</h2>
        <PortalPreservesReactTreeExample
          container={portalContainer}
          title="React tree preservation"
          description="A portal changes the DOM destination without creating a separate React tree."
        />
      </section>

      <section>
        <h2>3. External DOM container</h2>
        <ExternalDomContainerExample
          container={portalContainer}
          title="External DOM container"
          description="The portal destination can exist outside the component's normal DOM subtree."
        />
      </section>

      <section>
        <h2>4. Context through a portal</h2>
        <PortalContextExample
          container={portalContainer}
          title="Context through a portal"
          description="Portal descendants remain part of the React tree and can receive React context."
        />
      </section>

      <section>
        <h2>5. Overlay use case</h2>
        <PortalOverlayExample
          container={portalContainer}
          title="Portal overlay"
          description="Overlays can use a portal to escape ancestor layout constraints."
        />
      </section>

      <section>
        <h2>6. Portal versus new root</h2>
        <PortalIsNotANewRootExample
          container={portalContainer}
          title="Portal is not a new root"
          description="createPortal renders into another DOM node without creating an independent React root."
        />
      </section>

      <section>
        <h2>7. Conditional portal</h2>
        <ConditionalPortalExample
          container={portalContainer}
          title="Conditional portal"
          description="Portal content can be mounted and unmounted conditionally."
        />
      </section>

      <section>
        <h2>8. Parent state</h2>
        <PortalWithParentStateExample
          container={portalContainer}
          title="Portal with parent state"
          description="Portal content remains connected to the state owned by its React parent."
        />
      </section>

      <section>
        <h2>9. React tree versus DOM tree</h2>
        <ReactTreeVsDomTreeExample
          container={portalContainer}
          title="React tree versus DOM tree"
          description="Portals demonstrate that React hierarchy and DOM containment can differ."
        />
      </section>

      <section>
        <h2>10. Portal container requirement</h2>
        <PortalContainerRequirementExample
          container={portalContainer}
          title="Portal container requirement"
          description="createPortal requires a valid destination DOM node."
        />
      </section>

      <section>
        <h2>11. Portal lifecycle</h2>
        <PortalIsNotIndependentReactExample
          container={portalContainer}
          title="Portal lifecycle"
          description="Portal content remains managed by the React tree that owns it."
        />
      </section>

      <section>
        <h2>12. Portal destination</h2>
        <p>
          The portal destination used by these demonstrations is: <code>#portal-root</code>
        </p>
      </section>
    </main>
  );
};

export default function PortalsDemo(): ReactElement {
  return (
    <>
      <PortalDemo />
      <PortalContainer>
        <span />
      </PortalContainer>
    </>
  );
}

// ---------------------------------------------------------------------
// Summary
// `createPortal` renders React content into a different DOM node.
// A portal changes DOM placement without creating an independent React tree.
// Portal descendants remain connected to their React parent.
// React context can continue through a portal.
// React state can remain owned by a component while its UI is rendered elsewhere in the DOM.
// Portals are commonly useful for overlays, dialogs, tooltips, and other UI that must escape layout constraints.
// A portal is different from creating a separate React root.
// The portal destination must be a valid DOM node.
// Conditional rendering can mount and unmount portal content normally.
// Portal content remains managed by the React tree that owns it.
// The React tree and DOM tree can have different structures when portals are used.
// ---------------------------------------------------------------------
