/**
 * Discriminated Props
 * ===================
 *
 * Discriminated prop unions use a shared literal property (the discriminant) to constrain
 * and narrow the shape of related properties within a component interface. This eliminates
 * impossible states at the type level and guarantees that specific props are only accessible
 * when their corresponding discriminant condition is active.
 *
 * Shared literal properties act as structural switches, allowing TypeScript to narrow component
 * variants inside conditional branches automatically. This guarantees that parent components supply
 * valid data combinations, enabling safe rendering across distinct UI states.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Discriminated Union Prop Interfaces
// ---------------------------------------------------------------------

export type AsyncComponentProps =
  | {
      readonly status: "loading";
      readonly message: string;
    }
  | {
      readonly status: "success";
      readonly message: string;
      readonly dataItems: ReadonlyArray<string>;
    }
  | {
      readonly status: "error";
      readonly message: string;
      readonly errorCode: number;
    };

// ---------------------------------------------------------------------
// 2. Component Implementing Discriminated Props
// ---------------------------------------------------------------------

export const AsyncDataCard: React.FC<AsyncComponentProps> = (props) => {
  const { status, message } = props;

  return (
    <div className={`card-status-${status}`}>
      <p className="status-message">{message}</p>

      {status === "success" && (
        <ul className="success-list">
          {props.dataItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      {status === "error" && (
        <div className="error-details">
          <span>Error Code: {props.errorCode}</span>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Parent Container Demonstrating Discriminated Variants
// ---------------------------------------------------------------------

export const AsyncDataContainer: React.FC = () => {
  const [currentState, setCurrentState] = useState<"loading" | "success" | "error">("success");

  return (
    <div>
      <h1>Discriminated Props Architecture</h1>
      <p>Demonstrating compile-time state safety using discriminant keys.</p>

      <div>
        <button type="button" onClick={() => setCurrentState("loading")}>
          Show Loading
        </button>
        <button type="button" onClick={() => setCurrentState("success")}>
          Show Success
        </button>
        <button type="button" onClick={() => setCurrentState("error")}>
          Show Error
        </button>
      </div>

      <hr />

      {currentState === "loading" && <AsyncDataCard status="loading" message="Loading records..." />}

      {currentState === "success" && (
        <AsyncDataCard
          status="success"
          message="Data loaded successfully."
          dataItems={["Record Alpha", "Record Beta", "Record Gamma"]}
        />
      )}

      {currentState === "error" && <AsyncDataCard status="error" message="Failed to connect." errorCode={500} />}
    </div>
  );
};

export default AsyncDataContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Shared Discriminator Keys: Using a common literal property allows TypeScript to differentiate distinct component configurations.
// - Compile-Time State Protection: Invalid data combinations are strictly rejected by the compiler at build time.
// - Automatic Property Narrowing: Conditional checks narrow the union type to expose companion properties safely.
// - Clean Component Destructuring: Common properties are safely destructured upfront, while variant-specific properties use narrowed references.
// - Parent Contract Compliance: Consumers must satisfy the exact property requirements mandated by the selected discriminant variant.
