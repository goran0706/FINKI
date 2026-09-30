/**
 * createPortal
 * ============
 *
 * `createPortal` from `react-dom` renders React children into a DOM node that
 * exists outside the DOM hierarchy of the component that created them. The
 * portal remains part of the same React tree even though its DOM nodes are
 * inserted into a different container.
 *
 * The function accepts the React content to render and a DOM node that should
 * receive that content. An optional third argument can provide a stable portal
 * key. The returned portal can be rendered anywhere a React node can normally
 * be rendered.
 */

import { type FC, type ReactElement, type ReactNode, useState } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PortalContentProps {
  readonly children: ReactNode;
}

export interface PortalTargetProps {
  readonly target: Element;
  readonly children: ReactNode;
}

export interface KeyedPortalProps {
  readonly target: Element;
  readonly portalKey: string;
}

export interface PortalInteractionProps {
  readonly target: Element;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic `createPortal(children, domNode)` signature.
 *
 * The returned portal is rendered as part of the component's React output,
 * but the portal's DOM nodes are inserted into the supplied DOM container.
 */
export const BasicCreatePortalExample: FC<PortalTargetProps> = ({ target, children }): ReactElement => {
  return (
    <section>
      <h2>Basic createPortal</h2>
      {createPortal(children, target)}
    </section>
  );
};

/**
 * Demonstrates that the first argument can be any ReactNode.
 *
 * A portal is not limited to a single HTML element. It can contain text,
 * fragments, components, arrays of elements, or other renderable React nodes.
 */
export const PortalReactNodeExample: FC<PortalTargetProps> = ({ target, children }): ReactElement => {
  return (
    <section>
      <h2>ReactNode as portal content</h2>
      {createPortal(
        <>
          <p>Portal content can contain arbitrary React nodes.</p>
          {children}
        </>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates rendering into a specific DOM element.
 *
 * The second argument is the actual DOM node that receives the portal's
 * rendered elements, rather than a CSS selector or an element identifier.
 */
export const SpecificDomTargetExample: FC<PortalTargetProps> = ({ target, children }): ReactElement => {
  return (
    <section>
      <h2>Specific DOM target</h2>
      {createPortal(
        <div data-portal-content="specific-target">
          <p>This content is inserted into the supplied DOM element.</p>
          {children}
        </div>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates that `createPortal` returns a React portal that can be
 * conditionally included in the component's render output.
 *
 * The portal is mounted when `isOpen` is true and removed when it becomes false.
 */
export const ConditionalCreatePortalExample: FC<PortalInteractionProps> = ({ target }): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <section>
      <h2>Conditional createPortal</h2>
      <button type="button" onClick={() => setIsOpen((current) => !current)}>
        {isOpen ? "Close portal" : "Open portal"}
      </button>

      {isOpen
        ? createPortal(
            <div role="status">
              <p>The portal is currently mounted.</p>
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates that portal content can contain interactive elements.
 *
 * The portal does not turn the rendered content into static DOM. Its
 * descendants remain ordinary React elements and can respond to state changes.
 */
export const InteractivePortalExample: FC<PortalInteractionProps> = ({ target }): ReactElement => {
  const [count, setCount] = useState<number>(0);

  return (
    <section>
      <h2>Interactive portal</h2>
      <p>Parent-owned count: {count}</p>

      {createPortal(
        <div>
          <button type="button" onClick={() => setCount((current) => current + 1)}>
            Increment from portal
          </button>
          <p>The portal button updates state owned by its React parent.</p>
        </div>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates the optional third argument of `createPortal`.
 *
 * The optional key identifies the portal within React's reconciliation model.
 * It is useful when the application renders multiple portal entries and their
 * identity needs to remain stable across updates.
 */
export const KeyedPortalExample: FC<KeyedPortalProps> = ({ target, portalKey }): ReactElement => {
  return (
    <section>
      <h2>Keyed portal</h2>
      {createPortal(
        <div>
          <p>
            This portal has the key: <code>{portalKey}</code>
          </p>
        </div>,
        target,
        portalKey,
      )}
    </section>
  );
};

/**
 * Demonstrates that the portal's DOM destination is independent from the
 * component's normal DOM position.
 *
 * The surrounding React component can render in one location while the
 * portal content is inserted into a separate target element.
 */
export const SeparateDomDestinationExample: FC<PortalInteractionProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>Separate DOM destination</h2>
      <p>This paragraph is rendered normally inside the current section.</p>

      {createPortal(
        <p data-portal-content="separate-destination">This paragraph is rendered into the separate portal target.</p>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates a common misconception about the second argument.
 *
 * `createPortal` expects an actual DOM node. Passing a string such as
 * `"portal-root"` does not perform a selector lookup.
 */
export const DomNodeRequirementExample: FC<PortalInteractionProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>DOM node requirement</h2>
      <p>
        The target supplied to createPortal is an actual DOM element: <code>{target.nodeName.toLowerCase()}</code>
      </p>

      {createPortal(<p>The second argument is the DOM node itself, not its ID string.</p>, target)}
    </section>
  );
};

/**
 * Demonstrates that the portal target is not automatically created by
 * `createPortal`.
 *
 * The caller is responsible for obtaining or creating the destination DOM node
 * before passing it to `createPortal`.
 */
export const ExistingTargetRequirementExample: FC<PortalInteractionProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>Existing target requirement</h2>
      {createPortal(<p>This portal uses an already available DOM target.</p>, target)}
    </section>
  );
};

/**
 * Demonstrates that a portal can contain a complete component subtree.
 *
 * `createPortal` does not flatten the supplied React node. Components,
 * fragments, and their descendants remain part of the React tree.
 */
export const ComponentTreePortalExample: FC<PortalInteractionProps> = ({ target }): ReactElement => {
  const PortalMessage: FC = (): ReactElement => {
    return (
      <div>
        <strong>Portal component</strong>
        <p>A complete React component subtree can be rendered through createPortal.</p>
      </div>
    );
  };

  return (
    <section>
      <h2>Component tree through a portal</h2>
      {createPortal(<PortalMessage />, target)}
    </section>
  );
};

/**
 * Demonstrates a common misconception about portal placement.
 *
 * The portal target controls where the portal's DOM nodes are inserted, but
 * `createPortal` does not move the parent component itself.
 */
export const ParentIsNotMovedExample: FC<PortalInteractionProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>Parent is not moved</h2>
      <p>This parent component remains in its normal DOM position.</p>

      {createPortal(<p>Only this portal content is inserted into the target.</p>, target)}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PortalDemo: FC = (): ReactElement => {
  const portalTarget: HTMLElement | null =
    typeof document !== "undefined" ? document.getElementById("portal-root") : null;

  if (!portalTarget) {
    return (
      <main>
        <h1>createPortal</h1>
        <p>The portal target element is not available.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>createPortal</h1>

      <section>
        <h2>1. Basic createPortal</h2>
        <BasicCreatePortalExample target={portalTarget}>
          <p>This content is rendered through createPortal.</p>
        </BasicCreatePortalExample>
      </section>

      <section>
        <h2>2. ReactNode as portal content</h2>
        <PortalReactNodeExample target={portalTarget}>
          <strong>Additional React content.</strong>
        </PortalReactNodeExample>
      </section>

      <section>
        <h2>3. Specific DOM target</h2>
        <SpecificDomTargetExample target={portalTarget}>
          <p>The target is the actual DOM element supplied to createPortal.</p>
        </SpecificDomTargetExample>
      </section>

      <section>
        <h2>4. Conditional portal</h2>
        <ConditionalCreatePortalExample target={portalTarget} />
      </section>

      <section>
        <h2>5. Interactive portal</h2>
        <InteractivePortalExample target={portalTarget} />
      </section>

      <section>
        <h2>6. Keyed portal</h2>
        <KeyedPortalExample target={portalTarget} portalKey="example-portal" />
      </section>

      <section>
        <h2>7. Separate DOM destination</h2>
        <SeparateDomDestinationExample target={portalTarget} />
      </section>

      <section>
        <h2>8. DOM node requirement</h2>
        <DomNodeRequirementExample target={portalTarget} />
      </section>

      <section>
        <h2>9. Existing target requirement</h2>
        <ExistingTargetRequirementExample target={portalTarget} />
      </section>

      <section>
        <h2>10. Component tree through a portal</h2>
        <ComponentTreePortalExample target={portalTarget} />
      </section>

      <section>
        <h2>11. Parent is not moved</h2>
        <ParentIsNotMovedExample target={portalTarget} />
      </section>
    </main>
  );
};

export default PortalDemo;

// ---------------------------------------------------------------------
// Summary
// `createPortal` renders React children into a specified DOM node.
// The first argument is React content and the second argument is an actual DOM node.
// An optional third argument provides a portal key for React reconciliation.
// The portal target is not created automatically by createPortal.
// The portal target controls where the portal's DOM nodes are inserted.
// The parent component itself remains in its original DOM position.
// Portal content can contain components, fragments, interactive elements, and other React nodes.
// Conditional rendering can mount and unmount portals normally.
// A portal does not create a separate React root.
// ---------------------------------------------------------------------
