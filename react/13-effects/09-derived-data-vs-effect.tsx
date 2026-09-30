/**
 * Derived Data vs Effect
 * ======================
 *
 * Derived data is a value that can be calculated from existing props or state.
 * Because React already has those source values during rendering, the derived
 * value can usually be calculated directly in the component body without
 * storing it separately in state.
 *
 * An Effect runs after a render commits and is intended to synchronize with an
 * external system. Using an Effect to calculate derived data introduces a
 * second state update: the component renders with the old derived value, the
 * Effect runs, and another render is scheduled with the calculated value.
 *
 * Derived collections can use `useMemo` when their calculation is
 * computationally expensive and the inputs are stable. `useMemo` is still a
 * rendering optimization, not a synchronization mechanism, and the calculation
 * must remain pure.
 *
 * A value should be stored in state when it represents independent state that
 * cannot be reliably reconstructed from the current props and state. A value
 * that is merely another representation, filter, total, or transformation of
 * existing reactive data is normally derived data instead.
 */

import { type ChangeEvent, type FC, type ReactElement, useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DerivedFullNameProps {
  readonly initialFirstName: string;
  readonly initialLastName: string;
}

export interface EffectFullNameProps {
  readonly initialFirstName: string;
  readonly initialLastName: string;
}

export interface DerivedTotalProps {
  readonly initialPrice: number;
  readonly initialQuantity: number;
}

export interface DerivedFilterProps {
  readonly initialItems: readonly string[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const DerivedFullName: FC<DerivedFullNameProps> = ({ initialFirstName, initialLastName }): ReactElement => {
  const [firstName, setFirstName] = useState<string>(initialFirstName);
  const [lastName, setLastName] = useState<string>(initialLastName);

  const fullName: string = `${firstName} ${lastName}`;

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLastName(event.target.value);
  };

  return (
    <section>
      <label htmlFor="derived-full-name-first">First name</label>
      <input id="derived-full-name-first" value={firstName} onChange={handleFirstNameChange} />

      <label htmlFor="derived-full-name-last">Last name</label>
      <input id="derived-full-name-last" value={lastName} onChange={handleLastNameChange} />

      <p>Full name: {fullName}</p>
    </section>
  );
};

export const EffectFullName: FC<EffectFullNameProps> = ({ initialFirstName, initialLastName }): ReactElement => {
  const [firstName, setFirstName] = useState<string>(initialFirstName);
  const [lastName, setLastName] = useState<string>(initialLastName);
  const [fullName, setFullName] = useState<string>(`${initialFirstName} ${initialLastName}`);

  useEffect((): void => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLastName(event.target.value);
  };

  return (
    <section>
      <label htmlFor="effect-full-name-first">First name</label>
      <input id="effect-full-name-first" value={firstName} onChange={handleFirstNameChange} />

      <label htmlFor="effect-full-name-last">Last name</label>
      <input id="effect-full-name-last" value={lastName} onChange={handleLastNameChange} />

      <p>Full name: {fullName}</p>
    </section>
  );
};

export const DerivedTotal: FC<DerivedTotalProps> = ({ initialPrice, initialQuantity }): ReactElement => {
  const [price, setPrice] = useState<number>(initialPrice);
  const [quantity, setQuantity] = useState<number>(initialQuantity);

  const total: number = price * quantity;

  const increasePrice = (): void => {
    setPrice((previousPrice: number): number => previousPrice + 1);
  };

  const increaseQuantity = (): void => {
    setQuantity((previousQuantity: number): number => previousQuantity + 1);
  };

  return (
    <section>
      <p>Price: ${price}</p>
      <p>Quantity: {quantity}</p>
      <p>Total: ${total}</p>

      <button type="button" onClick={increasePrice}>
        Increase price
      </button>

      <button type="button" onClick={increaseQuantity}>
        Increase quantity
      </button>
    </section>
  );
};

export const DerivedFilter: FC<DerivedFilterProps> = ({ initialItems }): ReactElement => {
  const [items] = useState<readonly string[]>(initialItems);
  const [query, setQuery] = useState<string>("");

  const filteredItems: readonly string[] = useMemo<readonly string[]>((): readonly string[] => {
    const normalizedQuery: string = query.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return items;
    }

    return items.filter((item: string): boolean => item.toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  return (
    <section>
      <label htmlFor="derived-filter-query">Filter</label>
      <input id="derived-filter-query" value={query} onChange={handleQueryChange} />

      <ul>
        {filteredItems.map((item: string): ReactElement => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const DerivedDataVsEffectExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Deriving a value directly from state</h2>
      <DerivedFullName initialFirstName="John" initialLastName="Doe" />

      <h2>2. Storing derived data with an unnecessary Effect</h2>
      <EffectFullName initialFirstName="John" initialLastName="Doe" />

      <h2>3. Calculating a derived numeric value during rendering</h2>
      <DerivedTotal initialPrice={10} initialQuantity={2} />

      <h2>4. Deriving a filtered collection with memoization</h2>
      <DerivedFilter initialItems={["React", "TypeScript", "JavaScript", "CSS"]} />
    </main>
  );
};

export default DerivedDataVsEffectExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Derived data can usually be calculated directly from current props and
//   state.
// - Storing derived data in state creates a second source of truth and can
//   require an unnecessary Effect and additional render.
// - Effects are intended for synchronizing with external systems, not for
//   calculating ordinary derived values.
// - `useMemo` can cache an expensive pure calculation but is not a replacement
//   for state or an Effect-based synchronization mechanism.
// - Derived calculations should remain pure and should not mutate external
//   systems.
// - A value that can be reconstructed completely from current reactive inputs
//   generally does not need its own state.
// - Independent state is appropriate when a value represents information that
//   cannot be reliably derived from the other current values.
// - Filtering, formatting, totals, and combined display values are common forms
//   of derived data.
