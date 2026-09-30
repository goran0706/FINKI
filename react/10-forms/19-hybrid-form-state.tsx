/**
 * Hybrid Form State
 * ==================
 *
 * A hybrid form combines controlled and uncontrolled form controls in the same form. React state
 * owns values that the application needs to react to immediately, while the DOM owns values that
 * only need to be read at specific points such as form submission.
 *
 * This approach can reduce unnecessary state management when only some fields need reactive
 * behavior. A controlled field uses `value` or `checked` together with an `onChange` handler,
 * while an uncontrolled field uses `defaultValue` or `defaultChecked` and can be read through
 * `FormData` or a ref.
 *
 * Hybrid forms must still keep each individual control consistently controlled or uncontrolled
 * for its lifetime. The distinction is made per control, not per form, so controlled and
 * uncontrolled fields can safely coexist in one `<form>`.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HybridFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
  readonly initialRole: string;
  readonly initialSubscribed: boolean;
}

export interface ControlledNameProps {
  readonly initialValue: string;
}

export interface UncontrolledEmailProps {
  readonly initialValue: string;
}

export interface HybridSubscriptionProps {
  readonly initialSubscribed: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ControlledName: React.FC<ControlledNameProps> = ({ initialValue }): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  return (
    <div>
      <label>
        Name
        <input type="text" name="name" value={name} onChange={handleChange} />
      </label>

      <p>Character count: {name.length}</p>
    </div>
  );
};

export const UncontrolledEmail: React.FC<UncontrolledEmailProps> = ({ initialValue }): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" name="email" defaultValue={initialValue} />
    </label>
  );
};

export const HybridSubscription: React.FC<HybridSubscriptionProps> = ({ initialSubscribed }): React.ReactElement => {
  const [subscribed, setSubscribed] = React.useState<boolean>(initialSubscribed);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSubscribed(event.target.checked);
  };

  return (
    <label>
      <input type="checkbox" name="subscribed" value="yes" checked={subscribed} onChange={handleChange} />
      Subscribe to notifications
    </label>
  );
};

export const HybridForm: React.FC<HybridFormProps> = ({
  initialName,
  initialEmail,
  initialRole,
  initialSubscribed,
}): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [subscribed, setSubscribed] = React.useState<boolean>(initialSubscribed);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleSubscribedChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSubscribed(event.target.checked);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);
    const email: FormDataEntryValue | null = formData.get("email");
    const role: FormDataEntryValue | null = formData.get("role");

    console.log("Controlled name:", name);
    console.log("Controlled subscription:", subscribed);
    console.log("Uncontrolled email:", email);
    console.log("Uncontrolled role:", role);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" value={name} onChange={handleNameChange} />
      </label>

      <label>
        Email
        <input type="email" name="email" defaultValue={initialEmail} />
      </label>

      <label>
        Role
        <select name="role" defaultValue={initialRole}>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
        </select>
      </label>

      <label>
        <input type="checkbox" name="subscribed" value="yes" checked={subscribed} onChange={handleSubscribedChange} />
        Subscribe to notifications
      </label>

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
      <h1>Hybrid Form State</h1>

      <h2>1. Controlled Field with Reactive Derived UI</h2>
      <ControlledName initialValue="John Doe" />

      <h2>2. Uncontrolled Field Read at Submission Time</h2>
      <UncontrolledEmail initialValue="john@example.com" />

      <h2>3. Controlled Checkbox State</h2>
      <HybridSubscription initialSubscribed={true} />

      <h2>4. Combining Controlled and Uncontrolled Fields</h2>
      <HybridForm
        initialName="John Doe"
        initialEmail="john@example.com"
        initialRole="Developer"
        initialSubscribed={false}
      />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A hybrid form combines controlled and uncontrolled controls in the same form.
// - Controlled fields store their current values in React state.
// - Uncontrolled fields store their current values in the DOM.
// - Controlled fields are useful when other UI must react to their changes immediately.
// - Uncontrolled fields can be read with `FormData` when their values are needed.
// - `defaultValue` and `defaultChecked` initialize uncontrolled controls without continuously controlling them.
// - `value` and `checked` make individual controls controlled by React.
// - Each control should remain consistently controlled or uncontrolled throughout its lifetime.
// - Controlled and uncontrolled fields can safely coexist inside the same form.
