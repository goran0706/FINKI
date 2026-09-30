/**
 * Forms
 * =====
 *
 * HTML forms provide controls for collecting and submitting user input.
 * Understanding native form elements, validation, and data extraction is
 * essential before building controlled or uncontrolled forms in React.
 */

// ---------------------------------------------------------------------
// 1. Form Element and Common Attributes
// ---------------------------------------------------------------------

const form = document.querySelector("#profile-form");

// Common control attributes:
// - name        -> Identifies the field in form data / submissions
// - id          -> Unique identifier, enables explicit label association
// - value       -> Current control content or selection option value
// - required    -> Enforces mandatory field constraint validation
// - disabled    -> Excludes control from user interaction and submission
// - readOnly    -> Prevents editing while keeping the value submittable

// ---------------------------------------------------------------------
// 2. Specialized Input Types & Selection States
// ---------------------------------------------------------------------

// Numeric inputs expose `.valueAsNumber` for direct numeric parsing:
const ageInput = document.querySelector("#age");
const age = ageInput.valueAsNumber; // Returns a number or NaN if invalid/empty

// Checkboxes and radios use `.checked` instead of `.value` for selection state:
const termsCheckbox = document.querySelector("#terms");
const isAccepted = termsCheckbox.checked;

// Radio buttons sharing the same `name` attribute form a mutually exclusive group.

// ---------------------------------------------------------------------
// 3. Select and Textarea Elements
// ---------------------------------------------------------------------

// Single select value:
const countrySelect = document.querySelector("#country");
const selectedCountry = countrySelect.value;

// Multiple select values:
const langSelect = document.querySelector("#languages");
const selectedLangs = Array.from(langSelect.selectedOptions, (opt) => opt.value);

// Textarea value:
const descInput = document.querySelector("#description");
const descValue = descInput.value;

// ---------------------------------------------------------------------
// 4. Buttons and Form Submission Handling
// ---------------------------------------------------------------------

// Button types:
// - type="submit" -> Triggers form submission (default inside forms)
// - type="reset"  -> Resets controls to their initial values
// - type="button" -> Performs custom actions without submitting the form

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevents default browser page navigation/reload

  const submitter = event.submitter; // Identifies which specific button triggered submission
  const action = submitter?.dataset.action;
});

// ---------------------------------------------------------------------
// 5. Native Constraint Validation
// ---------------------------------------------------------------------

const emailInput = document.querySelector("#email");

// Programmatic validation checks:
const isValid = form.checkValidity(); // Returns true if all constraints pass
form.reportValidity(); // Validates constraints and displays browser error bubbles

// Detailed constraint state via the `.validity` state object:
if (emailInput.validity.valueMissing) {
  // Required field is empty
} else if (emailInput.validity.typeMismatch) {
  // Value does not match expected format (e.g., email)
}

// Custom error message injection:
emailInput.setCustomValidity("Please provide a valid company email address.");

// ---------------------------------------------------------------------
// 6. Collecting Form Data with FormData
// ---------------------------------------------------------------------

const formData = new FormData(form);

const firstName = formData.get("firstName"); // First matching value for a name
const allTags = formData.getAll("tags"); // All values for fields with the same name (e.g., checkboxes)
const allEntries = Array.from(formData.entries());

// ---------------------------------------------------------------------
// 7. Form Elements in React
// ---------------------------------------------------------------------

// React uses the same native form elements, typically managed through
// controlled components (state synchronization) or uncontrolled components (refs / FormData).
//
// function UserForm() {
//   function handleSubmit(event) {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     // Process form data
//   }
//
//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="username" required />
//       <button type="submit">Save</button>
//     </form>
//   );
// }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Forms group input controls for structured data collection, validation, and submission.
// - Specialized input types (`text`, `email`, `number`, `checkbox`, `radio`, `file`) manage unique state models.
// - Use `.valueAsNumber` for numeric inputs and `.checked` for boolean toggle/radio states.
// - `FormData` streamlines collecting successful form controls into clean key/value pairs.
// - Native constraint validation provides built-in rules, error checking (`checkValidity`), and custom messages (`setCustomValidity`).
// - React mirrors these native elements while offering powerful state-synchronization patterns.
