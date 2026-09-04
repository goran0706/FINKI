# Form Events and Validation Flow

## Overview of Form Interactions

Form management involves tracking user inputs, state modifications, validation changes, and submission cycles. Modern
web applications intercept native form behaviors to perform asynchronous validation, AJAX data submissions, and dynamic
UI updates.

| Form Event    | Fires When...                                                                            | Bubbles? | Default Behavior                           |
|:--------------|:-----------------------------------------------------------------------------------------|:---------|:-------------------------------------------|
| **`input`**   | Value changes on every keystroke, check, or slider move                                  | Yes      | None                                       |
| **`change`**  | Value changes are committed (e.g., blur on text fields, immediate on selects/checkboxes) | Yes      | None                                       |
| **`submit`**  | Form is submitted via button click or Enter key                                          | Yes      | Navigates/POSTs to `action` URL            |
| **`reset`**   | Form reset button is clicked                                                             | Yes      | Resets fields to initial HTML values       |
| **`invalid`** | Form validation fails during submission or check                                         | No       | Displays native browser validation tooltip |

## The `submit` Event and Prevention

The `submit` event fires on the `<form>` element when a user attempts to submit it. Intercepting this event allows
applications to validate inputs client-side and submit data via `fetch()` without causing a full-page reload.

```javascript
const form = document.querySelector('#registration-form');

form.addEventListener('submit', (event) => {
    // Prevent default browser HTTP page reload
    event.preventDefault();

    // Gather form data using FormData API
    const formData = new FormData(form);
    const dataObject = Object.fromEntries(formData.entries());

    console.log('Submitted data payload:', dataObject);

    // Submit asynchronously via fetch
    submitDataToServer(dataObject);
});
```

## `input` vs. `change` Events

Choosing the correct event for form field tracking ensures optimal performance and expected user experience.

```javascript
const emailInput = document.querySelector('#email');

// Fires CONTINUOUSLY on every typed character
emailInput.addEventListener('input', (event) => {
    validateEmailFormat(event.target.value);
});

// Fires ONCE when the input loses focus (blur) after alteration
emailInput.addEventListener('change', (event) => {
    saveDraftToServer(event.target.value);
});
```

| Feature                 | `input` Event                                      | `change` Event                             |
|:------------------------|:---------------------------------------------------|:-------------------------------------------|
| **Firing Frequency**    | Real-time (every keystroke / character alteration) | Deferred (on commit, blur, or selection)   |
| **Text Inputs**         | Fires instantly per character                      | Fires when focus leaves the field (`blur`) |
| **Checkboxes / Radios** | Fires instantly on click                           | Fires instantly on click                   |
| **Select Dropdowns**    | Fires instantly on selection                       | Fires instantly on selection               |

## Native Constraint Validation API

Modern HTML5 forms support native validation constraints (`required`, `minlength`, `pattern`, `type="email"`). You can
hook into validation states using the Constraint Validation API.

```javascript
const usernameInput = document.querySelector('#username');

usernameInput.addEventListener('input', () => {
    if (usernameInput.validity.valueMissing) {
        usernameInput.setCustomValidity('Username is mandatory.');
    } else if (usernameInput.validity.tooShort) {
        usernameInput.setCustomValidity('Username must be at least 3 characters.');
    } else {
        // Clear custom error message to mark field valid
        usernameInput.setCustomValidity('');
    }
});
```

## Use Cases

* **Single-Page Application AJAX Submissions:** Intercepting `submit` to send data via `fetch()` or `axios` without page
  reloads.
* **Real-Time Input Validation:** Using `input` events to provide live password strength checks or character countdowns.
* **Auto-Save Drafts:** Triggering `change` or debounced `input` events to save user input to `localStorage`
  automatically.
* **Custom Error Styling:** Intercepting the `invalid` event to apply custom CSS error styles instead of relying solely
  on native browser tooltips.

## Best Practices

* **Always Call `event.preventDefault()` on Form Submissions:** Prevent default page reloads when building client-side
  JavaScript form handlers.
* **Use `FormData` for Easy Data Extraction:** Pass the `<form>` element directly to `new FormData(form)` to easily
  extract all field key-value pairs without manual DOM querying.
* **Differentiate `input` and `change` Intent:** Use `input` for live typing feedback/validation and `change` for heavy
  operations (like checking database username availability or saving drafts).
* **Leverage Native HTML5 Validation:** Utilize built-in attributes (`required`, `type="email"`, `pattern`) before
  writing complex custom validation scripts.