/**
 * useInsertionEffect
 * ==================
 *
 * `useInsertionEffect` runs after React has updated the DOM but before layout
 * Effects run. Its primary purpose is to let CSS-in-JS libraries insert style
 * rules into the document before layout is measured by `useLayoutEffect`.
 *
 * The Hook has the same dependency-array and cleanup model as other Effects,
 * but its execution timing is earlier than `useLayoutEffect`. React may run
 * the setup function before the browser has had an opportunity to perform
 * layout work, allowing dynamically generated CSS rules to exist before
 * layout Effects measure affected elements.
 *
 * `useInsertionEffect` is intentionally restricted. Refs are not generally
 * available for DOM interaction at this stage, and state updates from an
 * insertion Effect are not supported as a normal synchronization mechanism.
 * The Hook should therefore not be used for DOM measurements, subscriptions,
 * event listeners, data fetching, or ordinary application Effects.
 *
 * A cleanup function can remove resources created by the insertion Effect.
 * CSS-in-JS libraries can use this lifecycle to insert and remove generated
 * style rules while keeping style management synchronized with component
 * lifecycles.
 *
 * A common misconception is that `useInsertionEffect` is a faster replacement
 * for `useEffect` or `useLayoutEffect`. Its special timing exists for style
 * insertion. Ordinary application code should generally use `useEffect`, while
 * DOM measurement and pre-paint visual synchronization belong in
 * `useLayoutEffect`.
 */

import { type FC, type ReactNode, useInsertionEffect, useLayoutEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DynamicStyleProps {
  readonly color: string;
}

export interface ScopedStyleProps {
  readonly className: string;
  readonly color: string;
}

export interface StyleRuleProps {
  readonly selector: string;
  readonly declaration: string;
}

export interface LayoutMeasurementProps {
  readonly backgroundColor: string;
}

export interface CleanupStyleProps {
  readonly color: string;
}

export interface InsertionTimingProps {
  readonly color: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Inserts a generated CSS rule into a dedicated style element. The insertion
 * Effect runs before layout Effects, making this pattern suitable for a
 * simplified CSS-in-JS implementation.
 */
export const DynamicStyleExample: FC<DynamicStyleProps> = ({ color }: DynamicStyleProps): ReactNode => {
  useInsertionEffect((): (() => void) => {
    const styleElement: HTMLStyleElement = document.createElement("style");

    styleElement.textContent = `
      .dynamic-insertion-example {
        color: ${color};
        font-weight: 700;
      }
    `;

    document.head.appendChild(styleElement);

    return (): void => {
      styleElement.remove();
    };
  }, [color]);

  return (
    <section>
      <h3>Inserting generated CSS</h3>
      <p className="dynamic-insertion-example">This element receives a dynamically inserted CSS rule.</p>
    </section>
  );
};

/**
 * Demonstrates generating a scoped class name from a component-specific
 * identifier. The insertion Effect manages the CSS rule while the rendered
 * element only consumes the generated class name.
 */
export const ScopedStyleExample: FC<ScopedStyleProps> = ({ className, color }: ScopedStyleProps): ReactNode => {
  useInsertionEffect((): (() => void) => {
    const styleElement: HTMLStyleElement = document.createElement("style");

    styleElement.textContent = `
      .${className} {
        color: ${color};
        padding: 0.5rem;
        border: 1px solid currentColor;
      }
    `;

    document.head.appendChild(styleElement);

    return (): void => {
      styleElement.remove();
    };
  }, [className, color]);

  return (
    <section>
      <h3>Scoping an inserted rule</h3>
      <div className={className}>Scoped dynamically generated styles.</div>
    </section>
  );
};

/**
 * Demonstrates the separation between CSS rule data and the insertion
 * mechanism. The CSS declaration is supplied as data and inserted during the
 * insertion Effect lifecycle.
 */
export const StyleRuleExample: FC<StyleRuleProps> = ({ selector, declaration }: StyleRuleProps): ReactNode => {
  useInsertionEffect((): (() => void) => {
    const styleElement: HTMLStyleElement = document.createElement("style");

    styleElement.textContent = `
      ${selector} {
        ${declaration}
      }
    `;

    document.head.appendChild(styleElement);

    return (): void => {
      styleElement.remove();
    };
  }, [selector, declaration]);

  return (
    <section>
      <h3>Inserting a CSS rule from component data</h3>
      <p className="generated-rule-example">Generated rule target.</p>
    </section>
  );
};

/**
 * Demonstrates why insertion timing matters for CSS-in-JS. The insertion
 * Effect creates the CSS rule before the layout Effect measures the affected
 * element, so the measurement observes the generated styling.
 */
export const LayoutMeasurementExample: FC<LayoutMeasurementProps> = ({
  backgroundColor,
}: LayoutMeasurementProps): ReactNode => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

  useInsertionEffect((): (() => void) => {
    const styleElement: HTMLStyleElement = document.createElement("style");

    styleElement.textContent = `
      .insertion-measurement-example {
        background-color: ${backgroundColor};
        padding: 2rem;
        border: 1px solid currentColor;
        box-sizing: border-box;
      }
    `;

    document.head.appendChild(styleElement);

    return (): void => {
      styleElement.remove();
    };
  }, [backgroundColor]);

  useLayoutEffect((): void => {
    const element: HTMLDivElement | null = elementRef.current;

    if (element === null) {
      return;
    }

    const nextHeight: number = element.getBoundingClientRect().height;

    setHeight((previousHeight: number): number =>
      Object.is(previousHeight, nextHeight) ? previousHeight : nextHeight,
    );
  }, [backgroundColor]);

  return (
    <section>
      <h3>Inserting styles before layout measurement</h3>

      <div ref={elementRef} className="insertion-measurement-example">
        Styled content
      </div>

      <p>Measured height: {height.toFixed(2)}px</p>
    </section>
  );
};

/**
 * Demonstrates cleanup of dynamically inserted CSS. When the dependency
 * changes, React cleans up the previous style element before establishing the
 * next insertion Effect.
 */
export const CleanupStyleExample: FC<CleanupStyleProps> = ({ color }: CleanupStyleProps): ReactNode => {
  useInsertionEffect((): (() => void) => {
    const styleElement: HTMLStyleElement = document.createElement("style");

    styleElement.textContent = `
      .cleanup-style-example {
        color: ${color};
      }
    `;

    document.head.appendChild(styleElement);

    return (): void => {
      styleElement.remove();
    };
  }, [color]);

  return (
    <section>
      <h3>Cleaning up inserted styles</h3>
      <p className="cleanup-style-example">The generated style is removed during cleanup.</p>
    </section>
  );
};

/**
 * Demonstrates that an insertion Effect can react to changing style inputs.
 * The CSS rule is replaced when the dependency changes, while the component's
 * rendered structure remains declarative.
 */
export const InsertionTimingExample: FC<InsertionTimingProps> = ({ color }: InsertionTimingProps): ReactNode => {
  useInsertionEffect((): (() => void) => {
    const styleElement: HTMLStyleElement = document.createElement("style");

    styleElement.textContent = `
      .insertion-timing-example {
        color: ${color};
      }
    `;

    document.head.appendChild(styleElement);

    return (): void => {
      styleElement.remove();
    };
  }, [color]);

  return (
    <section>
      <h3>Updating generated styles</h3>
      <p className="insertion-timing-example">The CSS rule is synchronized with the color prop.</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception by showing where different Effect
 * Hooks belong. Insertion Effects are for style insertion, layout Effects are
 * for pre-paint layout work, and ordinary Effects handle general external
 * synchronization.
 */
export const EffectTimingGotchaExample: FC = (): ReactNode => {
  const codeExample: string = `
// CSS-in-JS style insertion.
useInsertionEffect(() => {
  // Insert generated CSS.
}, [style]);

// DOM measurement or visual synchronization.
useLayoutEffect(() => {
  const width = elementRef.current?.getBoundingClientRect().width;
}, []);

// General external synchronization.
useEffect(() => {
  document.title = title;
}, [title]);
`;

  return (
    <section>
      <h3>Gotcha: insertion is not a general-purpose Effect</h3>
      <pre>{codeExample}</pre>
    </section>
  );
};

/**
 * Demonstrates that state updates are not the purpose of insertion Effects.
 * The component uses ordinary state to control rendered content and reserves
 * the insertion Effect for generated CSS.
 */
export const InsertionStateSeparationExample: FC = (): ReactNode => {
  const [active, setActive] = useState<boolean>(false);

  useInsertionEffect((): (() => void) => {
    const styleElement: HTMLStyleElement = document.createElement("style");

    styleElement.textContent = `
      .insertion-state-example {
        opacity: 1;
        transition: opacity 150ms ease;
      }

      .insertion-state-example.inactive {
        opacity: 0.5;
      }
    `;

    document.head.appendChild(styleElement);

    return (): void => {
      styleElement.remove();
    };
  }, []);

  const toggleActive = (): void => {
    setActive((previousActive: boolean): boolean => !previousActive);
  };

  const className: string = active ? "insertion-state-example" : "insertion-state-example inactive";

  return (
    <section>
      <h3>Separating style insertion from state updates</h3>

      <p className={className}>State controls the class; insertion controls the generated CSS.</p>

      <button type="button" onClick={toggleActive}>
        Toggle state
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseInsertionEffectContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useInsertionEffect</h1>

      <h2>1. Inserting dynamically generated CSS</h2>
      <DynamicStyleExample color="royalblue" />

      <h2>2. Scoping generated CSS to a component class</h2>
      <ScopedStyleExample className="example-scoped-style" color="seagreen" />

      <h2>3. Inserting CSS rules from component data</h2>
      <StyleRuleExample selector=".generated-rule-example" declaration="font-size: 1.25rem; color: darkslateblue;" />

      <h2>4. Inserting styles before layout measurement</h2>
      <LayoutMeasurementExample backgroundColor="lavender" />

      <h2>5. Cleaning up dynamically inserted styles</h2>
      <CleanupStyleExample color="darkorange" />

      <h2>6. Updating generated styles when dependencies change</h2>
      <InsertionTimingExample color="crimson" />

      <h2>7. Choosing the appropriate Effect timing</h2>
      <EffectTimingGotchaExample />

      <h2>8. Separating style insertion from state updates</h2>
      <InsertionStateSeparationExample />
    </main>
  );
};

export default UseInsertionEffectContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useInsertionEffect` is primarily intended for CSS-in-JS style insertion.
// - It runs after DOM mutations but before layout Effects.
// - Its timing allows generated CSS to be available before layout measurements.
// - It should not be used for ordinary application Effects or DOM measurements.
// - A cleanup function can remove dynamically inserted style resources.
// - Dependencies determine when inserted styles are replaced.
// - `useLayoutEffect` is appropriate for DOM measurement and pre-paint visual synchronization.
// - `useEffect` is appropriate for general external synchronization.
// - Insertion Effects should remain small and focused on style insertion.
