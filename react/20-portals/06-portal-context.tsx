/**
 * Portal Context
 * ==============
 *
 * A portal changes the DOM location of its rendered elements without removing
 * those elements from the React tree. Because React context follows the React
 * tree rather than the physical DOM tree, a component rendered through a portal
 * can read context provided by an ancestor above the `createPortal` call.
 *
 * This means portals can consume shared context such as themes, localization,
 * application state, or other dependency values without requiring a separate
 * context provider at the portal's DOM destination.
 */

import { createContext, type FC, type ReactElement, type ReactNode, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PortalTheme {
  readonly background: string;
  readonly foreground: string;
  readonly label: string;
}

export interface ThemeContextValue {
  readonly theme: PortalTheme;
  readonly toggleTheme: () => void;
}

export interface PortalContextProps {
  readonly target: HTMLElement;
}

export interface PortalThemeContentProps {
  readonly title: string;
}

export interface PortalProviderProps {
  readonly children: ReactNode;
}

export interface PortalContextContainerProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Provides theme state to the React subtree.
 *
 * The provider's position in the React tree determines which descendants can
 * consume the context. Portal DOM placement does not change that relationship.
 */
export const PortalThemeProvider: FC<PortalProviderProps> = ({ children }): ReactElement => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const theme: PortalTheme = isDark
    ? {
        background: "#222222",
        foreground: "#ffffff",
        label: "Dark",
      }
    : {
        background: "#ffffff",
        foreground: "#222222",
        label: "Light",
      };

  const toggleTheme = (): void => {
    setIsDark((current) => !current);
  };

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Consumes theme context from inside a portal.
 *
 * The portal content is mounted into a different DOM container, but the
 * component still reads the nearest `ThemeContext.Provider` in the React tree.
 */
export const PortalThemeContent: FC<PortalThemeContentProps> = ({ title }): ReactElement => {
  const context: ThemeContextValue | null = useContext(ThemeContext);

  if (!context) {
    return <p>No theme context is available.</p>;
  }

  const { theme, toggleTheme } = context;

  return (
    <div
      style={{
        background: theme.background,
        color: theme.foreground,
        padding: "1rem",
      }}
    >
      <strong>{title}</strong>
      <p>Context value received: {theme.label}</p>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
    </div>
  );
};

/**
 * Renders a context consumer through a portal.
 *
 * The provider is an ancestor in the React tree even though the portal content
 * is inserted into a separate DOM node.
 */
export const BasicPortalContextExample: FC<PortalContextProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>Context through a portal</h2>

      {createPortal(<PortalThemeContent title="Portal consumer" />, target)}
    </section>
  );
};

/**
 * Demonstrates that a portal can consume context and update context-owned
 * state at the same time.
 *
 * The button is physically rendered in the portal destination, while its
 * `toggleTheme` function comes from the React context provider.
 */
export const InteractivePortalContextExample: FC<PortalContextProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>Interactive context through a portal</h2>

      {createPortal(<PortalThemeContent title="Interactive portal consumer" />, target)}
    </section>
  );
};

/**
 * Demonstrates multiple portal consumers reading the same context.
 *
 * Both consumers are rendered into the same portal target, but each remains
 * connected to the same provider through the React tree.
 */
export const MultiplePortalConsumersExample: FC<PortalContextProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>Multiple portal consumers</h2>

      {createPortal(
        <>
          <PortalThemeContent title="First consumer" />
          <PortalThemeContent title="Second consumer" />
        </>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates that context is not determined by the portal container's
 * physical position in the DOM.
 *
 * The portal target can be attached directly to `document.body` while the
 * context provider remains elsewhere in the React tree.
 */
export const BodyPortalContextExample: FC<PortalContextProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>Context with a body-level portal</h2>

      {createPortal(<PortalThemeContent title="Body-level portal" />, target)}
    </section>
  );
};

/**
 * Demonstrates a common misconception: placing a portal target outside a
 * provider in the DOM does not prevent the portal from receiving context.
 *
 * Context lookup follows React ownership, not DOM ancestry.
 */
export const DomHierarchyMisconceptionExample: FC<PortalContextProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>DOM hierarchy misconception</h2>

      {createPortal(<PortalThemeContent title="Consumer outside DOM provider" />, target)}
    </section>
  );
};

/**
 * Demonstrates the opposite case: a component that is not rendered under the
 * provider's React subtree cannot consume that provider's context merely
 * because its DOM node happens to be inside the same portal container.
 */
export const ContextOwnershipExample: FC<PortalContextContainerProps> = ({ children }): ReactElement => {
  return (
    <section>
      <h2>React ownership determines context</h2>
      {children}
    </section>
  );
};

/**
 * Demonstrates context consumption without a portal.
 *
 * This establishes the ordinary React context relationship used by the portal
 * examples: the consumer is a descendant of the provider in the React tree.
 */
export const NormalContextConsumerExample: FC = (): ReactElement => {
  const context: ThemeContextValue | null = useContext(ThemeContext);

  return (
    <section>
      <h2>Normal context consumer</h2>
      <p>Current theme: {context?.theme.label ?? "No provider"}</p>
    </section>
  );
};

/**
 * Demonstrates that a portal does not require another context provider at its
 * destination.
 *
 * The existing provider is sufficient because the portal remains connected to
 * the same React tree.
 */
export const NoSecondProviderExample: FC<PortalContextProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>No second provider required</h2>

      {createPortal(<PortalThemeContent title="Single provider, portal consumer" />, target)}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PortalContextDemo: FC = (): ReactElement => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect((): (() => void) => {
    const existingTarget: HTMLElement | null = document.getElementById("portal-context-root");

    if (existingTarget) {
      setPortalTarget(existingTarget);

      return (): void => {
        // The existing container is owned by the surrounding document.
      };
    }

    const createdTarget: HTMLDivElement = document.createElement("div");

    createdTarget.id = "portal-context-root";
    document.body.appendChild(createdTarget);
    setPortalTarget(createdTarget);

    return (): void => {
      createdTarget.remove();
    };
  }, []);

  return (
    <PortalThemeProvider>
      <main>
        <h1>Portal Context</h1>

        <section>
          <h2>1. Normal context consumer</h2>
          <NormalContextConsumerExample />
        </section>

        <section>
          <h2>2. Context through a portal</h2>
          {portalTarget ? (
            <BasicPortalContextExample target={portalTarget} />
          ) : (
            <p>Preparing the portal destination.</p>
          )}
        </section>

        <section>
          <h2>3. Interactive context through a portal</h2>
          {portalTarget ? <InteractivePortalContextExample target={portalTarget} /> : null}
        </section>

        <section>
          <h2>4. Multiple portal consumers</h2>
          {portalTarget ? <MultiplePortalConsumersExample target={portalTarget} /> : null}
        </section>

        <section>
          <h2>5. Body-level portal</h2>
          {portalTarget ? <BodyPortalContextExample target={portalTarget} /> : null}
        </section>

        <section>
          <h2>6. DOM hierarchy misconception</h2>
          {portalTarget ? <DomHierarchyMisconceptionExample target={portalTarget} /> : null}
        </section>

        <ContextOwnershipExample>
          <p>Context follows React ownership rather than DOM placement.</p>
        </ContextOwnershipExample>

        <section>
          <h2>8. No second provider required</h2>
          {portalTarget ? <NoSecondProviderExample target={portalTarget} /> : null}
        </section>
      </main>
    </PortalThemeProvider>
  );
};

export default PortalContextDemo;

// ---------------------------------------------------------------------
// Summary
// React context follows the React tree rather than the physical DOM tree.
// A component rendered through a portal can consume context from its React ancestors.
// A portal does not require another context provider at its DOM destination.
// Portal consumers can read context and update context-owned state normally.
// Multiple portal consumers can share the same context provider.
// A portal target can be attached directly to document.body without breaking context.
// DOM ancestry does not determine which React context provider a portal consumer receives.
// A component outside the provider's React subtree cannot access that provider merely because its DOM node is nearby.
// ---------------------------------------------------------------------
