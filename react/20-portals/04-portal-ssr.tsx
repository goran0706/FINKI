/**
 * Portals and Server-Side Rendering
 * ==================================
 *
 * `createPortal` requires a real DOM node as its destination. During server-side
 * rendering there is no browser DOM, so a portal cannot be created by querying
 * `document` or by creating a DOM container on the server.
 *
 * A server-rendered application can instead render the portal destination as
 * part of the HTML shell and resolve that element after hydration. The portal
 * should render only after the client has obtained the destination so that the
 * server-rendered output and the client's initial render remain consistent.
 */

import { type FC, type ReactElement, type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SSRPortalProps {
  readonly children: ReactNode;
}

export interface SSRContainerProps {
  readonly containerId: string;
}

export interface HydrationSafePortalProps {
  readonly containerId: string;
  readonly children: ReactNode;
}

export interface SSRFallbackProps {
  readonly containerId: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic SSR constraint of `createPortal`.
 *
 * The browser's `document` object does not exist during server rendering.
 * The component therefore waits until the client has mounted before looking
 * up the portal destination.
 */
export const HydrationSafePortal: FC<HydrationSafePortalProps> = ({ containerId, children }): ReactElement | null => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect((): void => {
    const element: HTMLElement | null = document.getElementById(containerId);

    setContainer(element);
  }, [containerId]);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
};

/**
 * Demonstrates the client-only nature of DOM lookup.
 *
 * The `document` check prevents the component from attempting to access a
 * browser global during server rendering. The actual lookup still occurs only
 * after the component mounts in the browser.
 */
export const BrowserOnlyContainerLookup: FC<SSRContainerProps> = ({ containerId }): ReactElement => {
  const [containerExists, setContainerExists] = useState<boolean>(false);

  useEffect((): void => {
    const element: HTMLElement | null = document.getElementById(containerId);

    setContainerExists(element !== null);
  }, [containerId]);

  return (
    <section>
      <h2>Browser-only container lookup</h2>
      <p>
        {containerExists
          ? "The portal destination exists in the browser."
          : "The portal destination has not been resolved yet."}
      </p>
    </section>
  );
};

/**
 * Demonstrates a hydration-safe fallback.
 *
 * The server and the client's initial render can both display the fallback.
 * After hydration, the effect resolves the destination and the portal can be
 * rendered without requiring the server to create a DOM node.
 */
export const HydrationFallbackExample: FC<SSRContainerProps> = ({ containerId }): ReactElement => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect((): void => {
    setContainer(document.getElementById(containerId));
  }, [containerId]);

  return (
    <section>
      <h2>Hydration-safe fallback</h2>

      {container ? (
        createPortal(<p>This content is now rendered into the client-side portal destination.</p>, container)
      ) : (
        <p>The portal content is waiting for the browser to resolve its destination.</p>
      )}
    </section>
  );
};

/**
 * Demonstrates a portal that has no destination.
 *
 * If the expected container is absent from the server-rendered HTML or from
 * the client document, the component should handle that condition explicitly
 * instead of passing `null` to `createPortal`.
 */
export const MissingContainerExample: FC<SSRFallbackProps> = ({ containerId }): ReactElement => {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [resolved, setResolved] = useState<boolean>(false);

  useEffect((): void => {
    setContainer(document.getElementById(containerId));
    setResolved(true);
  }, [containerId]);

  return (
    <section>
      <h2>Missing portal container</h2>

      {!resolved ? (
        <p>Resolving the portal destination...</p>
      ) : container ? (
        createPortal(<p>The expected portal destination was found.</p>, container)
      ) : (
        <p>No element with the requested portal container ID exists.</p>
      )}
    </section>
  );
};

/**
 * Demonstrates a server-rendered HTML shell containing a dedicated portal
 * destination.
 *
 * In a real SSR application, an element such as `#portal-root` can be included
 * in the HTML document shell. The React component can then find that element
 * after hydration and render portal content into it.
 */
export const ServerShellContainerExample: FC<SSRContainerProps> = ({ containerId }): ReactElement => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect((): void => {
    const element: HTMLElement | null = document.getElementById(containerId);

    setContainer(element);
  }, [containerId]);

  return (
    <section>
      <h2>Server HTML shell container</h2>

      <p>The destination is expected to have been provided by the surrounding HTML document.</p>

      {container ? createPortal(<div role="status">Portal content mounted after hydration.</div>, container) : null}
    </section>
  );
};

/**
 * Demonstrates that the portal destination should not be created by accessing
 * `document` during render.
 *
 * Render must remain safe for server execution. Browser DOM work belongs in
 * effects or another client-only lifecycle boundary.
 */
export const ClientInitializationExample: FC<SSRContainerProps> = ({ containerId }): ReactElement => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect((): void => {
    const element: HTMLElement | null = document.getElementById(containerId);

    setContainer(element);
    setIsClient(true);
  }, [containerId]);

  return (
    <section>
      <h2>Client initialization</h2>

      {!isClient ? (
        <p>Rendering the server-compatible initial state.</p>
      ) : container ? (
        createPortal(<p>The portal destination is available after client initialization.</p>, container)
      ) : (
        <p>Client initialization completed, but the destination was not found.</p>
      )}
    </section>
  );
};

/**
 * Demonstrates that portal content should not be rendered into a destination
 * that exists only on the client when the initial server markup assumes that
 * the content already exists.
 *
 * The initial render intentionally returns `null`; the portal is introduced
 * only after the client has mounted.
 */
export const PostHydrationPortalExample: FC<SSRPortalProps> = ({ children }): ReactElement => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect((): void => {
    setContainer(document.getElementById("portal-root"));
  }, []);

  return (
    <>
      <p>The application can hydrate normally before introducing the portal content.</p>

      {container ? createPortal(children, container) : null}
    </>
  );
};

/**
 * Demonstrates an important SSR misconception.
 *
 * `createPortal` does not make a component universally server-renderable.
 * The portal destination must still be a valid DOM node, which means a
 * browser DOM must exist before the portal can be created.
 */
export const PortalSSRConstraintExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Portal SSR constraint</h2>
      <p>
        createPortal requires a DOM destination, so portal rendering must account for the absence of the browser DOM
        during SSR.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PortalSSRDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>Portals and Server-Side Rendering</h1>

      <section>
        <h2>1. Hydration-safe portal</h2>
        <HydrationSafePortal containerId="portal-root">
          <p>This content is mounted into the portal destination after hydration.</p>
        </HydrationSafePortal>
      </section>

      <section>
        <h2>2. Browser-only container lookup</h2>
        <BrowserOnlyContainerLookup containerId="portal-root" />
      </section>

      <section>
        <h2>3. Hydration-safe fallback</h2>
        <HydrationFallbackExample containerId="portal-root" />
      </section>

      <section>
        <h2>4. Missing container handling</h2>
        <MissingContainerExample containerId="missing-portal-root" />
      </section>

      <section>
        <h2>5. Server HTML shell container</h2>
        <ServerShellContainerExample containerId="portal-root" />
      </section>

      <section>
        <h2>6. Client initialization</h2>
        <ClientInitializationExample containerId="portal-root" />
      </section>

      <section>
        <h2>7. Post-hydration portal</h2>
        <PostHydrationPortalExample>
          <div>
            <strong>Portal content</strong>
            <p>This subtree is introduced after the client mounts.</p>
          </div>
        </PostHydrationPortalExample>
      </section>

      <PortalSSRConstraintExample />
    </main>
  );
};

export default PortalSSRDemo;

// ---------------------------------------------------------------------
// Summary
// `createPortal` requires a real DOM node and therefore cannot directly create a portal destination during SSR.
// The browser `document` must not be accessed during server rendering.
// A portal destination can be included in the server-rendered HTML shell and resolved after hydration.
// Client-only DOM lookup belongs in an effect or another client-only lifecycle boundary.
// Rendering a fallback or null before hydration keeps the initial server and client output consistent.
// A missing portal destination should be handled explicitly rather than passed to createPortal.
// SSR does not turn a portal into a separate React root or eliminate its DOM requirements.
// ---------------------------------------------------------------------
