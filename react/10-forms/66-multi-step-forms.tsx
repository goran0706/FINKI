/**
 * Multi-Step Forms
 * ================
 *
 * A multi-step form divides one logical submission into several sequential
 * screens. Each step can collect or validate a subset of the complete form
 * data while the parent component preserves the accumulated values between
 * steps.
 *
 * The important distinction is between navigation state and form data. The
 * current step determines which fields are visible, while the accumulated
 * form state remains available when the user moves backward or forward. Final
 * submission should validate the complete data set rather than assuming that
 * every individual step was valid when it was visited.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface MultiStepFormData {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly city: string;
  readonly country: string;
}

interface MultiStepStepProps {
  readonly values: MultiStepFormData;
  readonly onChange: (field: keyof MultiStepFormData, value: string) => void;
}

interface MultiStepNavigationProps {
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly canContinue: boolean;
  readonly isSubmitting: boolean;
  readonly onPrevious: () => void;
}

interface MultiStepSummaryProps {
  readonly values: MultiStepFormData;
}

interface MultiStepFormProps {
  readonly onComplete: (values: MultiStepFormData) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * The first step collects identity information. The values are controlled by
 * the parent so navigating away from this step does not discard them.
 */
export const MultiStepPersonalDetails: React.FC<MultiStepStepProps> = ({ values, onChange }): React.ReactElement => {
  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange("firstName", event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange("lastName", event.target.value);
  };

  return (
    <fieldset>
      <legend>Personal details</legend>

      <label>
        First name
        <input name="firstName" value={values.firstName} onChange={handleFirstNameChange} autoComplete="given-name" />
      </label>

      <label>
        Last name
        <input name="lastName" value={values.lastName} onChange={handleLastNameChange} autoComplete="family-name" />
      </label>
    </fieldset>
  );
};

/**
 * The second step collects contact information. The same parent-owned state
 * continues to represent the complete form while only this step is visible.
 */
export const MultiStepContactDetails: React.FC<MultiStepStepProps> = ({ values, onChange }): React.ReactElement => {
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange("email", event.target.value);
  };

  return (
    <fieldset>
      <legend>Contact details</legend>

      <label>
        Email
        <input name="email" type="email" value={values.email} onChange={handleEmailChange} autoComplete="email" />
      </label>
    </fieldset>
  );
};

/**
 * The third step collects location information. Going back to an earlier
 * step does not recreate the state because the values remain in the parent.
 */
export const MultiStepLocationDetails: React.FC<MultiStepStepProps> = ({ values, onChange }): React.ReactElement => {
  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange("city", event.target.value);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange("country", event.target.value);
  };

  return (
    <fieldset>
      <legend>Location</legend>

      <label>
        City
        <input name="city" value={values.city} onChange={handleCityChange} autoComplete="address-level2" />
      </label>

      <label>
        Country
        <input name="country" value={values.country} onChange={handleCountryChange} autoComplete="country-name" />
      </label>
    </fieldset>
  );
};

/**
 * The final step displays the accumulated values before submission. It does
 * not create another copy of the data, so the displayed values stay synchronized
 * with the parent form state.
 */
export const MultiStepSummary: React.FC<MultiStepSummaryProps> = ({ values }): React.ReactElement => {
  return (
    <fieldset>
      <legend>Review</legend>

      <p>
        Name: {values.firstName} {values.lastName}
      </p>
      <p>Email: {values.email}</p>
      <p>
        Location: {values.city}, {values.country}
      </p>
    </fieldset>
  );
};

/**
 * Navigation controls are separated from the individual steps. The previous
 * button is not a submit control, while the final button submits the complete
 * multi-step form.
 */
export const MultiStepNavigation: React.FC<MultiStepNavigationProps> = ({
  currentStep,
  totalSteps,
  canContinue,
  isSubmitting,
  onPrevious,
}): React.ReactElement => {
  const isFirstStep: boolean = currentStep === 0;
  const isLastStep: boolean = currentStep === totalSteps - 1;

  return (
    <div>
      <button type="button" onClick={onPrevious} disabled={isFirstStep || isSubmitting}>
        Previous
      </button>

      {!isLastStep && (
        <button type="submit" disabled={!canContinue || isSubmitting}>
          Next
        </button>
      )}

      {isLastStep && (
        <button type="submit" disabled={!canContinue || isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      )}
    </div>
  );
};

/**
 * A multi-step form can validate only the fields required by the current
 * step before allowing navigation to the next step.
 */
export const MultiStepForm: React.FC<MultiStepFormProps> = ({ onComplete }): React.ReactElement => {
  const totalSteps: number = 4;

  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [values, setValues] = React.useState<MultiStepFormData>({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    country: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const updateField = (field: keyof MultiStepFormData, value: string): void => {
    setValues((currentValues: MultiStepFormData): MultiStepFormData => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 0:
        return values.firstName.trim() !== "" && values.lastName.trim() !== "";

      case 1:
        return values.email.trim() !== "";

      case 2:
        return values.city.trim() !== "" && values.country.trim() !== "";

      case 3:
        return true;

      default:
        return false;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!isCurrentStepValid()) {
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep((step: number): number => step + 1);
      return;
    }

    setIsSubmitting(true);

    window.setTimeout((): void => {
      onComplete(values);
      setIsSubmitting(false);
    }, 1000);
  };

  const handlePrevious = (): void => {
    setCurrentStep((step: number): number => Math.max(0, step - 1));
  };

  const renderCurrentStep = (): React.ReactElement => {
    switch (currentStep) {
      case 0:
        return <MultiStepPersonalDetails values={values} onChange={updateField} />;

      case 1:
        return <MultiStepContactDetails values={values} onChange={updateField} />;

      case 2:
        return <MultiStepLocationDetails values={values} onChange={updateField} />;

      case 3:
        return <MultiStepSummary values={values} />;

      default:
        return <p>Invalid form step.</p>;
    }
  };

  const canContinue: boolean = isCurrentStepValid();

  return (
    <form onSubmit={handleSubmit}>
      <p>
        Step {currentStep + 1} of {totalSteps}
      </p>

      {renderCurrentStep()}

      <MultiStepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        canContinue={canContinue}
        isSubmitting={isSubmitting}
        onPrevious={handlePrevious}
      />
    </form>
  );
};

/**
 * Validation should not depend only on whether a previous step was visited.
 * A user can navigate backward, change a value, and return to the final step,
 * so the complete data should be validated again before final submission.
 */
export const MultiStepFinalValidation: React.FC = (): React.ReactElement => {
  const [message, setMessage] = React.useState<string>("Complete all required fields before submitting.");

  const handleComplete = (values: MultiStepFormData): void => {
    const hasCompleteData: boolean =
      values.firstName.trim() !== "" &&
      values.lastName.trim() !== "" &&
      values.email.trim() !== "" &&
      values.city.trim() !== "" &&
      values.country.trim() !== "";

    setMessage(hasCompleteData ? "All form data passed final validation." : "Final validation failed.");
  };

  return (
    <div>
      <MultiStepForm onComplete={handleComplete} />
      <p aria-live="polite">{message}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MultiStepForms: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h1>Multi-Step Forms</h1>

      <h2>1. Multi-Step Form Navigation</h2>
      <MultiStepFinalValidation />

      <h2>2. Preserving Values Between Steps</h2>
      <MultiStepForm
        onComplete={(values: MultiStepFormData): void => {
          console.log("Submitted multi-step form:", values);
        }}
      />
    </div>
  );
};

export default MultiStepForms;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A multi-step form divides one logical form into several sequential steps.
// - Parent-owned state preserves values while different steps are rendered.
// - Navigation state and form data should remain conceptually separate.
// - Each step can validate the fields required before allowing navigation forward.
// - Going backward should preserve previously entered values.
// - Final submission should validate the complete accumulated form data.
// - Navigation buttons should use `type="button"` unless they intentionally submit the form.
// - The final step can review the accumulated data before the form is submitted.
