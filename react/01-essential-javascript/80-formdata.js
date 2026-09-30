/**
 * FormData
 * ========
 *
 * FormData represents form controls as a collection of key/value pairs.
 * It simplifies gathering input data, handling file uploads, and submitting
 * structured payloads via network requests or React workflows.
 */

// ---------------------------------------------------------------------
// 1. Creating FormData
// ---------------------------------------------------------------------

const form = document.querySelector("#profile-form");

// Automatically collects successful controls from an HTML form:
const formDataFromForm = new FormData(form);

// Or construct an empty instance manually to populate programmatically:
const manualData = new FormData();

// ---------------------------------------------------------------------
// 2. Querying and Inspecting Data
// ---------------------------------------------------------------------

// - get(name)    -> Returns the first value associated with the field name
// - getAll(name) -> Returns an array of all values for a given name (e.g., checkboxes, multi-selects)
// - has(name)    -> Returns a boolean indicating whether the field exists

const name = formDataFromForm.get("name");
const allTags = formDataFromForm.getAll("tags");
const hasEmail = formDataFromForm.has("email");

// ---------------------------------------------------------------------
// 3. Modifying FormData (Append, Set, Delete)
// ---------------------------------------------------------------------

const data = new FormData();

// - append(name, value) -> Adds a new value without removing existing ones
data.append("tag", "react");
data.append("tag", "typescript");

// - set(name, value)    -> Replaces all existing values for a name with a single value
data.set("tag", "javascript");

// - delete(name)        -> Removes all entries associated with the name
data.delete("tag");

// ---------------------------------------------------------------------
// 4. Iteration and Conversion
// ---------------------------------------------------------------------

// Iterating over entries:
for (const [key, value] of data.entries()) {
  // value can be a string or a File object
}

// Converting to a plain object (note: loses repeated keys, keeping only the final value):
const dataObject = Object.fromEntries(data);

// ---------------------------------------------------------------------
// 5. Handling Files and Special Types
// ---------------------------------------------------------------------

// File inputs and Blobs are automatically preserved as File objects:
const fileInput = document.querySelector("input[type='file']");
const fileData = new FormData();

if (fileInput?.files[0]) {
  fileData.append("avatar", fileInput.files[0]);
}

// Non-string primitives (numbers, booleans) passed to append() are auto-converted to strings:
fileData.append("count", 42); // stored as string "42"

// ---------------------------------------------------------------------
// 6. Network Transmission with fetch()
// ---------------------------------------------------------------------

async function submitData(formElement) {
  const payload = new FormData(formElement);

  const response = await fetch("/api/submit", {
    method: "POST",
    body: payload,
    // NOTE: Never manually set 'Content-Type: multipart/form-data'.
    // The browser automatically generates and sets the correct boundary header.
  });

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`);
  }

  return response;
}

// For application/x-www-form-urlencoded requests instead of multipart, convert via URLSearchParams:
const urlEncodedString = new URLSearchParams(payload).toString();

// ---------------------------------------------------------------------
// 7. FormData in React
// ---------------------------------------------------------------------

// function ProfileForm() {
//   function handleSubmit(event) {
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//     const username = data.get("username");
//     // Process data directly without manual React state management
//   }
//
//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="username" defaultValue="Ana" />
//       <button type="submit">Submit</button>
//     </form>
//   );
// }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - FormData organizes key/value pairs for standard form data structuring and submission.
// - Instantiated from an existing form (`new FormData(form)`) or built manually (`new FormData()`).
// - Use `get()`, `getAll()`, `has()`, `append()`, `set()`, and `delete()` to inspect and mutate fields.
// - Automatically captures files (`File` / `Blob`) and converts primitive values to strings.
// - Essential for `fetch()` network requests and uncontrolled React forms, with the browser managing `multipart/form-data` boundaries.
