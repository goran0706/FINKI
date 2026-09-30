/**
 * Typed Animation and Transition Events
 * =====================================
 *
 * React provides `AnimationEvent<T>` for CSS animation lifecycle events and `TransitionEvent<T>`
 * for CSS transition lifecycle events. The generic element parameter identifies the element
 * receiving the handler and gives `currentTarget` an element-specific TypeScript type.
 *
 * Animation events expose information about CSS keyframe animations, including the animation name,
 * elapsed time, and pseudo-element involved in the event. Events such as `onAnimationStart`,
 * `onAnimationIteration`, and `onAnimationEnd` correspond to different stages of a CSS animation.
 *
 * Transition events describe the transition of a CSS property from one computed value to another.
 * `propertyName` identifies the property being transitioned, while `elapsedTime` reports the
 * transition time that has passed when the event was dispatched.
 */

import React, { type AnimationEvent, type ReactElement, type TransitionEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AnimationLifecycleProps {
  readonly label: string;
}

export interface AnimationTimingProps {
  readonly label: string;
}

export interface TransitionPropertyProps {
  readonly label: string;
}

export interface TransitionTimingProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `AnimationEvent<HTMLDivElement>` identifies a CSS animation event whose
 * `currentTarget` is an HTML div element.
 */
export const AnimationLifecycle: React.FC<AnimationLifecycleProps> = ({ label }): ReactElement => {
  const handleAnimationStart = (event: AnimationEvent<HTMLDivElement>): void => {
    console.log("Animation started:", event.animationName);
  };

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>): void => {
    console.log("Animation ended:", event.animationName);
  };

  return (
    <>
      <style>
        {`
                    @keyframes typedAnimationLifecycle {
                        from {
                            opacity: 0.25;
                        }
                        to {
                            opacity: 1;
                        }
                    }
                `}
      </style>

      <div
        onAnimationStart={handleAnimationStart}
        onAnimationEnd={handleAnimationEnd}
        style={{
          animation: "typedAnimationLifecycle 1s ease-in-out",
        }}
      >
        {label}
      </div>
    </>
  );
};

/**
 * `elapsedTime` reports the amount of animation time that has elapsed when
 * the animation event occurs, excluding time spent before the animation starts.
 */
export const AnimationTiming: React.FC<AnimationTimingProps> = ({ label }): ReactElement => {
  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>): void => {
    console.log("Animation:", event.animationName);
    console.log("Elapsed time:", event.elapsedTime);
  };

  return (
    <>
      <style>
        {`
                    @keyframes typedAnimationTiming {
                        from {
                            transform: translateX(0);
                        }
                        to {
                            transform: translateX(40px);
                        }
                    }
                `}
      </style>

      <div
        onAnimationEnd={handleAnimationEnd}
        style={{
          animation: "typedAnimationTiming 1s ease-in-out",
        }}
      >
        {label}
      </div>
    </>
  );
};

/**
 * `TransitionEvent<HTMLDivElement>` exposes the CSS property currently
 * transitioning through `propertyName`.
 */
export const TransitionProperty: React.FC<TransitionPropertyProps> = ({ label }): ReactElement => {
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>): void => {
    console.log("Transitioned property:", event.propertyName);
  };

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      style={{
        transition: "opacity 500ms ease-in-out",
        opacity: 0.5,
      }}
    >
      {label}
    </div>
  );
};

/**
 * `TransitionEvent<T>` also exposes the elapsed transition time. The event
 * represents completion of the CSS transition for the reported property.
 */
export const TransitionTiming: React.FC<TransitionTimingProps> = ({ label }): ReactElement => {
  const [active, setActive] = React.useState<boolean>(false);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>): void => {
    console.log("Property:", event.propertyName);
    console.log("Elapsed time:", event.elapsedTime);
  };

  const handleClick = (): void => {
    setActive((previous: boolean): boolean => !previous);
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Toggle Transition
      </button>

      <div
        onTransitionEnd={handleTransitionEnd}
        style={{
          marginTop: 8,
          opacity: active ? 1 : 0.25,
          transition: "opacity 500ms ease-in-out",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const TypedAnimationTransitionEventsDemo: React.FC = (): ReactElement => {
  return (
    <div>
      <h2>1. Reading Animation Lifecycle Events</h2>
      <AnimationLifecycle label="CSS animation" />

      <h2>2. Reading Animation Timing</h2>
      <AnimationTiming label="Timed CSS animation" />

      <h2>3. Identifying a Transitioned Property</h2>
      <TransitionProperty label="CSS transition" />

      <h2>4. Reading Transition Timing</h2>
      <TransitionTiming label="Toggle this transition" />
    </div>
  );
};

export default TypedAnimationTransitionEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React CSS animation handlers use the specialized `AnimationEvent<T>` type.
// - `event.animationName` identifies the CSS animation associated with the event.
// - `event.elapsedTime` reports animation time at the point the event is dispatched.
// - React CSS transition handlers use the specialized `TransitionEvent<T>` type.
// - `event.propertyName` identifies the CSS property associated with a transition event.
// - `TransitionEvent<T>` also exposes `elapsedTime` for the completed transition.
// - Animation events describe CSS animation lifecycle stages, while transition
//   events describe changes between computed CSS property values.
