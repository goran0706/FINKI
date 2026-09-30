/**
 * Dependent Fields
 * =================
 *
 * Dependent fields are form controls whose available values, validation rules, or behavior depend
 * on the current value of another field. A common example is a country field controlling the list
 * of available cities, or a subscription type controlling which options are available in another
 * field.
 *
 * The dependent field should derive its options and behavior from the controlling state. When the
 * controlling value changes, previously selected dependent values may become invalid and should be
 * reconciled explicitly rather than being assumed to remain valid.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DependentFieldOption {
  readonly value: string;
  readonly label: string;
}

export interface DependentFieldBasicProps {
  readonly initialCountry: string;
  readonly initialCity: string;
}

export interface DependentFieldMultipleProps {
  readonly initialPlan: "basic" | "pro" | "enterprise";
  readonly initialBillingCycle: "monthly" | "yearly";
}

export interface DependentFieldResetProps {
  readonly initialCountry: string;
  readonly initialCity: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const DependentFieldBasic: React.FC<DependentFieldBasicProps> = ({
  initialCountry,
  initialCity,
}): React.ReactElement => {
  const [country, setCountry] = React.useState<string>(initialCountry);
  const [city, setCity] = React.useState<string>(initialCity);

  const citiesByCountry: Record<string, readonly DependentFieldOption[]> = {
    mk: [
      {
        value: "skopje",
        label: "Skopje",
      },
      {
        value: "tetovo",
        label: "Tetovo",
      },
    ],
    de: [
      {
        value: "berlin",
        label: "Berlin",
      },
      {
        value: "munich",
        label: "Munich",
      },
    ],
    fr: [
      {
        value: "paris",
        label: "Paris",
      },
      {
        value: "lyon",
        label: "Lyon",
      },
    ],
  };

  const availableCities: readonly DependentFieldOption[] = citiesByCountry[country] ?? [];

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const nextCountry: string = event.target.value;

    setCountry(nextCountry);
    setCity("");
  };

  return (
    <div>
      <label>
        Country
        <select value={country} onChange={handleCountryChange}>
          <option value="">Select a country</option>
          <option value="mk">North Macedonia</option>
          <option value="de">Germany</option>
          <option value="fr">France</option>
        </select>
      </label>

      <label>
        City
        <select
          value={city}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
            setCity(event.target.value);
          }}
          disabled={availableCities.length === 0}
        >
          <option value="">Select a city</option>

          {availableCities.map((option: DependentFieldOption): React.ReactElement => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export const DependentFieldMultiple: React.FC<DependentFieldMultipleProps> = ({
  initialPlan,
  initialBillingCycle,
}): React.ReactElement => {
  const [plan, setPlan] = React.useState<"basic" | "pro" | "enterprise">(initialPlan);
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">(initialBillingCycle);

  const availableCycles: readonly ("monthly" | "yearly")[] =
    plan === "basic" ? ["monthly", "yearly"] : plan === "pro" ? ["monthly", "yearly"] : ["yearly"];

  const handlePlanChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const nextPlan: "basic" | "pro" | "enterprise" = event.target.value as "basic" | "pro" | "enterprise";

    setPlan(nextPlan);

    if (nextPlan === "enterprise" && billingCycle === "monthly") {
      setBillingCycle("yearly");
    }
  };

  return (
    <div>
      <label>
        Plan
        <select value={plan} onChange={handlePlanChange}>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </label>

      <label>
        Billing cycle
        <select
          value={billingCycle}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
            setBillingCycle(event.target.value as "monthly" | "yearly");
          }}
        >
          {availableCycles.map((cycle: "monthly" | "yearly"): React.ReactElement => (
            <option key={cycle} value={cycle}>
              {cycle === "monthly" ? "Monthly" : "Yearly"}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export const DependentFieldReset: React.FC<DependentFieldResetProps> = ({
  initialCountry,
  initialCity,
}): React.ReactElement => {
  const [country, setCountry] = React.useState<string>(initialCountry);
  const [city, setCity] = React.useState<string>(initialCity);
  const [error, setError] = React.useState<string>("");

  const citiesByCountry: Record<string, readonly string[]> = {
    mk: ["skopje", "tetovo"],
    de: ["berlin", "munich"],
  };

  const availableCities: readonly string[] = citiesByCountry[country] ?? [];

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const nextCountry: string = event.target.value;

    setCountry(nextCountry);
    setError("");

    setCity((currentCity: string): string => (availableCities.includes(currentCity) ? currentCity : ""));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const isCityValid: boolean = availableCities.includes(city);

    if (!isCityValid) {
      setError("Select a city that belongs to the selected country.");
      return;
    }

    setError("");
    console.log({
      country,
      city,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Country
        <select value={country} onChange={handleCountryChange}>
          <option value="">Select a country</option>
          <option value="mk">North Macedonia</option>
          <option value="de">Germany</option>
        </select>
      </label>

      <label>
        City
        <select
          value={city}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
            setCity(event.target.value);
            setError("");
          }}
          disabled={availableCities.length === 0}
        >
          <option value="">Select a city</option>

          {availableCities.map((option: string): React.ReactElement => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {error !== "" && <p role="alert">{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Dependent Fields</h1>

      <h2>1. Deriving Available Options from Another Field</h2>
      <DependentFieldBasic initialCountry="mk" initialCity="" />

      <h2>2. Changing Available Values Based on a Selected Plan</h2>
      <DependentFieldMultiple initialPlan="basic" initialBillingCycle="monthly" />

      <h2>3. Reconciling a Dependent Value When Its Parent Changes</h2>
      <DependentFieldReset initialCountry="mk" initialCity="skopje" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Dependent fields derive their available options or behavior from another field's current value.
// - The controlling field is the source of truth for the dependency.
// - Changing the controlling field can invalidate the currently selected dependent value.
// - Invalid dependent values should be cleared or otherwise reconciled when their available options change.
// - A dependent field can be disabled when its controlling field does not provide enough information to populate it.
// - Conditional option lists should be derived from current state rather than duplicated in separate visibility state.
// - Submission validation should verify that a dependent value is still valid for the current controlling value.
// - A value that was valid under one controlling selection is not necessarily valid after that selection changes.
// - Stable option values should be used as React keys when rendering dependent option lists.
