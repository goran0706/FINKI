/**
 * Lifting State
 * =============
 *
 * Lifting state up involves moving state to the closest common ancestor of components that need to
 * share or synchronize data. When two or more sibling components rely on the same changing data,
 * maintaining separate local states leads to inconsistency and synchronization bugs.
 *
 * By lifting the state to their common parent, the parent becomes the single source of truth. The
 * parent passes the current state value down to siblings as read-only props and provides handler
 * callbacks to allow siblings to request state updates.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TemperatureInputProps {
  readonly scale: "celsius" | "fahrenheit";
  readonly temperature: string;
  readonly onTemperatureChange: (value: string) => void;
}

// ---------------------------------------------------------------------
// 2. Helper Functions
// ---------------------------------------------------------------------

function toCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

function tryConvert(temperature: string, convert: (input: number) => number): string {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return "";
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const TemperatureInput: React.FC<TemperatureInputProps> = ({ scale, temperature, onTemperatureChange }) => {
  const scaleNames = {
    celsius: "Celsius",
    fahrenheit: "Fahrenheit",
  };

  return (
    <fieldset>
      <legend>Enter temperature in {scaleNames[scale]}:</legend>
      <input
        type="number"
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
        placeholder={`Degrees in ${scaleNames[scale]}`}
      />
    </fieldset>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const LiftingStateContainer: React.FC = () => {
  // Lifted state: Single source of truth managed at common parent level
  const [temperature, setTemperature] = useState<string>("");
  const [scale, setScale] = useState<"celsius" | "fahrenheit">("celsius");

  const handleCelsiusChange = (value: string): void => {
    setScale("celsius");
    setTemperature(value);
  };

  const handleFahrenheitChange = (value: string): void => {
    setScale("fahrenheit");
    setTemperature(value);
  };

  // Calculate derived temperature values dynamically for both children
  const celsius = scale === "fahrenheit" ? tryConvert(temperature, toCelsius) : temperature;
  const fahrenheit = scale === "celsius" ? tryConvert(temperature, toFahrenheit) : temperature;

  return (
    <div>
      <h1>08 - Lifting State</h1>

      <h2>1. Synced Temperature Converters Sharing Ancestor State</h2>
      <TemperatureInput scale="celsius" temperature={celsius} onTemperatureChange={handleCelsiusChange} />
      <TemperatureInput scale="fahrenheit" temperature={fahrenheit} onTemperatureChange={handleFahrenheitChange} />
    </div>
  );
};

export default LiftingStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Lifting state up relocates state to the closest common ancestor of dependent components.
// - Moving state to a common parent establishes a single authoritative source of truth.
// - Synced inputs receive calculated state values as props and emit change events upward.
// - Centralizing state prevents data synchronization bugs across sibling component trees.
// - Lifting state replaces duplicate state copies with clean top-down derived data propagation.
