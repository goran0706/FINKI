/**
 * Destructuring Objects
 * =====================
 *
 * Object destructuring allows properties to be extracted from an object
 * and assigned to variables using a concise syntax.
 *
 * It is commonly used when working with function parameters, API data,
 * configuration objects, and values returned from other functions.
 */

// ---------------------------------------------------------------------
// 1. Basic object destructuring
// ---------------------------------------------------------------------

// The variable names in the destructuring pattern match object property names.
const user = {
  name: "John",
  age: 30,
};

const { name, age } = user;

console.log(name); // "John"
console.log(age); // 30

// ---------------------------------------------------------------------
// 2. Destructuring specific properties
// ---------------------------------------------------------------------

// Only the properties listed in the pattern are extracted from the object.
const account = {
  id: 1,
  username: "john",
  role: "admin",
};

const { username, role } = account;

console.log(username); // "john"
console.log(role); // "admin"

// ---------------------------------------------------------------------
// 3. Property names determine what is extracted
// ---------------------------------------------------------------------

// Destructuring matches property names rather than position.
const product = {
  name: "Laptop",
  price: 1200,
  category: "Computer",
};

const { category, name, price } = product;

console.log(name); // "Laptop"
console.log(price); // 1200
console.log(category); // "Computer"

// ---------------------------------------------------------------------
// 4. Renaming variables
// ---------------------------------------------------------------------

// Use `property: variable` syntax when the variable should have a different name.
const customer = {
  name: "John Doe",
  email: "john@example.com",
};

const { name: customerName, email: customerEmail } = customer;

console.log(customerName); // "John Doe"
console.log(customerEmail); // "john@example.com"

// ---------------------------------------------------------------------
// 5. Destructuring with `const` and `let`
// ---------------------------------------------------------------------

// Destructuring can be used with both `const` and `let` bindings.
const settings = {
  theme: "dark",
  language: "en",
};

const { theme } = settings;
let { language } = settings;
language = "de";

console.log(theme); // "dark"
console.log(language); // "de"

// ---------------------------------------------------------------------
// 6. Destructuring existing variables
// ---------------------------------------------------------------------

// Wrap destructuring assignment in parentheses when assigning to existing variables.
let firstName;
let lastName;

const person = {
  firstName: "John",
  lastName: "Doe",
};

({ firstName, lastName } = person);

console.log(firstName); // "John"
console.log(lastName); // "Doe"

// ---------------------------------------------------------------------
// 7. Missing properties
// ---------------------------------------------------------------------

// A missing property evaluates to `undefined` without throwing an error.
const profile = {
  name: "John",
};

const { name: profileName, age: profileAge } = profile;

console.log(profileName); // "John"
console.log(profileAge); // undefined

// ---------------------------------------------------------------------
// 8. Default values
// ---------------------------------------------------------------------

// Default values are applied only when the destructured property is `undefined`.
const options = {
  theme: "dark",
};

const { theme: selectedTheme, language: selectedLanguage = "en" } = options;

console.log(selectedTheme); // "dark"
console.log(selectedLanguage); // "en"

const preferences = {
  language: null,
};

const { language: preferenceLanguage = "en" } = preferences;
console.log(preferenceLanguage); // null (`null` does not trigger defaults)

// ---------------------------------------------------------------------
// 9. Rest properties
// ---------------------------------------------------------------------

// The rest property collects all remaining unextracted properties into a new object.
const userRecord = {
  id: 1,
  name: "John",
  role: "admin",
  active: true,
};

const { id, ...details } = userRecord;

console.log(id); // 1
console.log(details); // { name: "John", role: "admin", active: true }

// ---------------------------------------------------------------------
// 10. Renaming with rest properties
// ---------------------------------------------------------------------

// Rest properties can be combined with property renaming.
const employee = {
  id: 10,
  name: "Jane",
  department: "Engineering",
  location: "Skopje",
};

const { name: employeeName, ...employeeDetails } = employee;

console.log(employeeName); // "Jane"
console.log(employeeDetails); // { id: 10, department: "Engineering", location: "Skopje" }

// ---------------------------------------------------------------------
// 11. Nested object destructuring
// ---------------------------------------------------------------------

// Destructuring patterns can recursively access properties inside nested objects.
const userProfile = {
  name: "John",
  address: {
    city: "Skopje",
    country: "North Macedonia",
  },
};

const {
  address: { city, country },
} = userProfile;

console.log(city); // "Skopje"
console.log(country); // "North Macedonia"

const {
  address,
  address: { city: userCity },
} = userProfile;

console.log(address); // { city: "Skopje", country: "North Macedonia" }
console.log(userCity); // "Skopje"

// ---------------------------------------------------------------------
// 12. Nested defaults
// ---------------------------------------------------------------------

// Defaults can be used at different levels of a nested structure.
const accountSettings = {
  name: "John",
};

const { name: accountName, preferences: { theme: accountTheme = "light" } = {} } = accountSettings;

console.log(accountName); // "John"
console.log(accountTheme); // "light"

// ---------------------------------------------------------------------
// 13. Destructuring function parameters
// ---------------------------------------------------------------------

// Objects can be destructured directly inside function parameter lists.
function describeUser({ name, age }) {
  return `${name} is ${age} years old.`;
}

const personData = {
  name: "John",
  age: 30,
};

console.log(describeUser(personData)); // "John is 30 years old."

// ---------------------------------------------------------------------
// 14. Renaming function parameters
// ---------------------------------------------------------------------

// Parameter destructuring supports property renaming.
function getUserLabel({ name: userName, role: userRole }) {
  return `${userName} (${userRole})`;
}

console.log(getUserLabel({ name: "Jane", role: "admin" })); // "Jane (admin)"

// ---------------------------------------------------------------------
// 15. Default values in function parameters
// ---------------------------------------------------------------------

// Defaults can be applied to destructured parameters, including fallback objects.
function createLabel({ name = "Unknown", role = "user" }) {
  return `${name} (${role})`;
}

console.log(createLabel({ name: "John" })); // "John (user)"
console.log(createLabel({})); // "Unknown (user)"

function describeAccount({ name = "Unknown" } = {}) {
  return name;
}

console.log(describeAccount()); // "Unknown"
console.log(describeAccount({ name: "John" })); // "John"

// ---------------------------------------------------------------------
// 16. Destructuring returned objects
// ---------------------------------------------------------------------

// Destructuring is useful for unpacking objects returned from functions.
function getCoordinates() {
  return {
    x: 10,
    y: 20,
  };
}

const { x, y } = getCoordinates();

console.log(x); // 10
console.log(y); // 20

// ---------------------------------------------------------------------
// 17. Destructuring objects with computed property names
// ---------------------------------------------------------------------

// Computed property names allow extracting properties dynamically.
const field = "email";

const contact = {
  email: "john@example.com",
};

const { [field]: emailAddress } = contact;

console.log(emailAddress); // "john@example.com"

// ---------------------------------------------------------------------
// 18. Destructuring does not clone the values
// ---------------------------------------------------------------------

// Destructuring copies references rather than performing deep clones.
const data = {
  user: {
    name: "John",
  },
};

const { user: extractedUser } = data;
extractedUser.name = "Jane";

console.log(data.user.name); // "Jane"

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Object destructuring extracts properties into local variables.
// - Property names determine which values are extracted.
// - Properties can be renamed using `property: variable` syntax.
// - Missing properties produce `undefined` unless a default is specified.
// - Default values are triggered only when the property value is `undefined`.
// - Rest properties collect remaining properties into a new object.
// - Nested objects can be destructured recursively.
// - Object destructuring can be used directly within function parameters.
// - Destructuring returned objects helps unpack multiple related values cleanly.
// - Destructuring assigns existing values by reference and does not deep-clone objects.
