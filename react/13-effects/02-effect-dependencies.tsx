/**
 * Effect Dependencies
 * ===================
 *
 * The dependency array passed to `useEffect` tells React which reactive values
 * determine when an Effect must be synchronized again. After a component
 * commits, React compares each dependency with its value from the previous
 * committed render using `Object.is`. If at least one dependency differs, React
 * runs the previous cleanup and then runs the new setup.
 *
 * Reactive values include props, state, and variables or functions declared
 * directly inside the component. Dependencies should describe the values used
 * by the Effect rather than being chosen merely to control how often the
 * Effect runs. An Effect with no dependency array runs after every committed
 * render. An empty dependency array does not react to changing component
 * values.
 *
 * Objects, arrays, and functions are compared by reference rather than by their
 * contents. Creating one of these values during every render therefore gives
 * the Effect a new dependency on every render, even when its contents appear
 * unchanged. When possible, primitive values or values created inside the
 * Effect can avoid unnecessary synchronization caused by unstable references.
 *
 * Omitting a dependency that the Effect reads can make the Effect observe a
 * stale value. The dependency array is therefore part of the Effect's
 * synchronization contract, not a performance-only setting.
 */

import { type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface EveryRenderEffectProps {
  readonly label: string;
}

export interface ReactiveDependencyProps {
  readonly initialName: string;
}

export interface EmptyDependencyProps {
  readonly initialName: string;
}

export interface ObjectDependencyProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const EveryRenderEffect: FC<EveryRenderEffectProps> = ({ label }): ReactElement => {
  const [count, setCount] = useState<number>(0);

  useEffect((): void => {
    document.title = `${label}: ${count}`;
  });

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>{label}</p>
      <p>Count: {count}</p>

      <button type="button" onClick={increment}>
        Re-render
      </button>
    </section>
  );
};

export const ReactiveDependency: FC<ReactiveDependencyProps> = ({ initialName }): ReactElement => {
  const [name, setName] = useState<string>(initialName);

  useEffect((): void => {
    document.title = `Hello, ${name}`;
  }, [name]);

  const updateName = (): void => {
    setName((previousName: string): string => (previousName === "John Doe" ? "Jane Doe" : "John Doe"));
  };

  return (
    <section>
      <p>Current name: {name}</p>

      <button type="button" onClick={updateName}>
        Change name
      </button>
    </section>
  );
};

export const EmptyDependency: FC<EmptyDependencyProps> = ({ initialName }): ReactElement => {
  const [name, setName] = useState<string>(initialName);

  useEffect((): void => {
    document.title = `Initial name: ${name}`;
  }, []);

  const updateName = (): void => {
    setName((previousName: string): string => (previousName === "John Doe" ? "Jane Doe" : "John Doe"));
  };

  return (
    <section>
      <p>Current name: {name}</p>
      <p>The Effect does not react to later name changes.</p>

      <button type="button" onClick={updateName}>
        Change name
      </button>
    </section>
  );
};

export const ObjectDependency: FC<ObjectDependencyProps> = ({ initialName }): ReactElement => {
  const [name, setName] = useState<string>(initialName);
  const [count, setCount] = useState<number>(0);

  // Objects, arrays, and functions are compared by reference rather than by their contents.
  // Creating one of these values during every render therefore gives the Effect a new dependency on every render.
  const person: { readonly name: string } = { name };
  const numbers: number[] = [1, 2, 3, 4, 5];
  const print = () => console.log(person.name);

  useEffect((): void => {
    document.title = `Person: ${person.name}`;
    numbers.forEach((num) => console.log(num));
    print();
  }, [person, numbers, print]);

  // useEffect((): void => {
  //   const person: { readonly name: string } = { name };
  //   const numbers: number[] = [1, 2, 3, 4, 5];
  //   const print = () => console.log(person.name);

  //   document.title = `Person: ${person.name}`;
  //   numbers.forEach((num) => console.log(num));
  //   print();
  // }, []);

  const changeCount = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  const changeName = (): void => {
    setName((previousName: string): string => (previousName === "John Doe" ? "Jane Doe" : "John Doe"));
  };

  return (
    <section>
      <p>Name: {name}</p>
      <p>Unrelated count: {count}</p>

      <button type="button" onClick={changeCount}>
        Change unrelated state
      </button>

      <button type="button" onClick={changeName}>
        Change name
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EffectDependenciesExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. An Effect without dependencies runs after every commit</h2>
      <EveryRenderEffect label="Every-render Effect" />

      <h2>2. A dependency makes an Effect react to a specific value</h2>
      <ReactiveDependency initialName="John Doe" />

      <h2>3. An empty dependency array does not track later state changes</h2>
      <EmptyDependency initialName="John Doe" />

      <h2>4. Object identity can cause an Effect to re-run</h2>
      <ObjectDependency initialName="John Doe" />
    </main>
  );
};

export default EffectDependenciesExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The dependency array describes the reactive values an Effect synchronizes with.
// - React compares dependency values with their previous values using `Object.is`.
// - An Effect without a dependency array runs after every committed render.
// - An empty dependency array does not react to changing props or state read by the Effect.
// - Objects, arrays, and functions are compared by reference, not by contents.
// - Creating an object during every render can therefore cause an Effect to re-run even when its contents are equivalent.
// - Omitting a reactive value used by an Effect can cause stale synchronization.
// - Dependencies should represent the Effect's actual reactive inputs rather than being selected only to suppress Effect executions.
