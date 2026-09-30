/**
 * Conditional Fields
 * ===================
 *
 * Conditional fields are form controls whose presence or behavior depends on another value in the
 * form. A common example is showing an additional field only when a user selects a particular
 * option, such as displaying a company name when the account type is "business".
 *
 * Conditional rendering should be derived from the current form state rather than maintained as a
 * separate visibility state. When a controlling value changes, the dependent field can therefore
 * appear or disappear automatically without creating a second source of truth.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ConditionalFieldBasicProps {
  readonly initialAccountType: "personal" | "business";
}

export interface ConditionalFieldMultipleProps {
  readonly initialContactMethod: "email" | "phone" | "none";
}

export interface ConditionalFieldCleanupProps {
  readonly initialAccountType: "personal" | "business";
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ConditionalFieldBasic: React.FC<ConditionalFieldBasicProps> = ({
  initialAccountType,
}): React.ReactElement => {
  const [accountType, setAccountType] = React.useState<"personal" | "business">(initialAccountType);
  const [companyName, setCompanyName] = React.useState<string>("");

  const handleAccountTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setAccountType(event.target.value as "personal" | "business");
  };

  return (
    <div>
      <label>
        Account type
        <select value={accountType} onChange={handleAccountTypeChange}>
          <option value="personal">Personal</option>
          <option value="business">Business</option>
        </select>
      </label>

      {accountType === "business" && (
        <label>
          Company name
          <input
            type="text"
            value={companyName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              setCompanyName(event.target.value);
            }}
          />
        </label>
      )}
    </div>
  );
};

export const ConditionalFieldMultiple: React.FC<ConditionalFieldMultipleProps> = ({
  initialContactMethod,
}): React.ReactElement => {
  const [contactMethod, setContactMethod] = React.useState<"email" | "phone" | "none">(initialContactMethod);
  const [email, setEmail] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");

  const handleContactMethodChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setContactMethod(event.target.value as "email" | "phone" | "none");
  };

  return (
    <div>
      <label>
        Preferred contact method
        <select value={contactMethod} onChange={handleContactMethodChange}>
          <option value="none">None</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
      </label>

      {contactMethod === "email" && (
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              setEmail(event.target.value);
            }}
          />
        </label>
      )}

      {contactMethod === "phone" && (
        <label>
          Phone
          <input
            type="tel"
            value={phone}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              setPhone(event.target.value);
            }}
          />
        </label>
      )}
    </div>
  );
};

export const ConditionalFieldCleanup: React.FC<ConditionalFieldCleanupProps> = ({
  initialAccountType,
}): React.ReactElement => {
  const [accountType, setAccountType] = React.useState<"personal" | "business">(initialAccountType);
  const [companyName, setCompanyName] = React.useState<string>("");

  const handleAccountTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const nextAccountType: "personal" | "business" = event.target.value as "personal" | "business";

    setAccountType(nextAccountType);

    if (nextAccountType === "personal") {
      setCompanyName("");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const submittedCompanyName: string = accountType === "business" ? companyName : "";

    console.log({
      accountType,
      companyName: submittedCompanyName,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Account type
        <select value={accountType} onChange={handleAccountTypeChange}>
          <option value="personal">Personal</option>
          <option value="business">Business</option>
        </select>
      </label>

      {accountType === "business" && (
        <label>
          Company name
          <input
            type="text"
            name="companyName"
            value={companyName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              setCompanyName(event.target.value);
            }}
          />
        </label>
      )}

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
      <h1>Conditional Fields</h1>

      <h2>1. Rendering a Field from Another Field's Value</h2>
      <ConditionalFieldBasic initialAccountType="personal" />

      <h2>2. Rendering Different Fields for Different Conditions</h2>
      <ConditionalFieldMultiple initialContactMethod="none" />

      <h2>3. Handling Values When a Conditional Field Disappears</h2>
      <ConditionalFieldCleanup initialAccountType="personal" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Conditional fields appear or disappear based on the current form state.
// - Visibility should normally be derived from the controlling value instead of stored separately.
// - Multiple conditional branches can render different fields for different controlling values.
// - A field that is conditionally hidden can still have its value stored in React state.
// - Hiding a controlled input does not automatically clear the state value associated with it.
// - If a hidden value should not be submitted, the submission logic must explicitly exclude it.
// - Clearing a dependent value when its controlling condition changes can prevent stale data from being reused.
// - Conditional rendering and conditional submission are separate concerns and should be handled deliberately.
// - Conditional fields may also require conditional validation because a hidden field may no longer be required.
