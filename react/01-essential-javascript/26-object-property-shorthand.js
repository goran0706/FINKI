/**
 * Object Property Shorthand
 * =========================
 *
 * Object property shorthand allows a property name and its value variable
 * to be written only once when both names are the same.
 *
 * It is commonly used when creating objects from variables, function
 * parameters, and other local bindings.
 */

// ---------------------------------------------------------------------
// 1. Basic property shorthand
// ---------------------------------------------------------------------

// Without shorthand, the property name and variable name are repeated.
const name = "John";
const age = 30;

const user = {
  name: name,
  age: age,
};

console.log(user); // { name: "John", age: 30 }

// When the property name matches the variable name, shorthand syntax can be used.
const person = {
  name,
  age,
};

console.log(person); // { name: "John", age: 30 }

// ---------------------------------------------------------------------
// 2. Shorthand with multiple properties
// ---------------------------------------------------------------------

// Every shorthand property reads the value from the variable with the same name.
const firstName = "John";
const lastName = "Doe";
const email = "john@example.com";

const account = {
  firstName,
  lastName,
  email,
};

console.log(account); // { firstName: "John", lastName: "Doe", email: "john@example.com" }

// ---------------------------------------------------------------------
// 3. Shorthand does not rename properties
// ---------------------------------------------------------------------

// Shorthand uses the variable name directly as the property name.
const username = "john";
const role = "admin";

const profile = {
  username,
  role,
};

console.log(profile.username); // "john"
console.log(profile.role); // "admin"

// Use normal `property: value` syntax when the property name should differ.
const displayName = "John Doe";

const userProfile = {
  name: displayName,
};

console.log(userProfile.name); // "John Doe"

// ---------------------------------------------------------------------
// 4. Mixing shorthand and regular properties
// ---------------------------------------------------------------------

// Shorthand properties can be freely combined with regular property definitions.
const title = "Laptop";
const price = 1200;

const product = {
  title,
  price,
  currency: "EUR",
};

console.log(product); // { title: "Laptop", price: 1200, currency: "EUR" }

// ---------------------------------------------------------------------
// 5. Shorthand in function return values
// ---------------------------------------------------------------------

// Shorthand is especially useful when returning objects with locally calculated values.
function createUser(name, age) {
  const active = true;

  return {
    name,
    age,
    active,
  };
}

console.log(createUser("John", 30)); // { name: "John", age: 30, active: true }

// ---------------------------------------------------------------------
// 6. Shorthand with computed values
// ---------------------------------------------------------------------

// Shorthand properties store the current value of the variable, not a live reference.
let count = 1;

const state = {
  count,
};

count = 2;

console.log(state.count); // 1
console.log(count); // 2

// ---------------------------------------------------------------------
// 7. Shorthand with object methods
// ---------------------------------------------------------------------

// Method shorthand defines an object method, whereas property shorthand stores a value.
const userName = "John";

const userMethods = {
  userName,

  greet() {
    return `Hello, ${this.userName}!`;
  },
};

console.log(userMethods.userName); // "John"
console.log(userMethods.greet()); // "Hello, John!"

// ---------------------------------------------------------------------
// 8. Shorthand with function values
// ---------------------------------------------------------------------

// A function stored in a variable can also be added using property shorthand.
function calculateTotal(price, quantity) {
  return price * quantity;
}

const cart = {
  calculateTotal,
};

console.log(cart.calculateTotal(10, 3)); // 30

// ---------------------------------------------------------------------
// 9. Shorthand with destructured values
// ---------------------------------------------------------------------

// Object destructuring and property shorthand work naturally together.
const userData = {
  name: "John",
  age: 30,
};

const { name: userNameValue, age: userAge } = userData;

const userRecord = {
  name: userNameValue,
  age: userAge,
};

console.log(userRecord); // { name: "John", age: 30 }

// ---------------------------------------------------------------------
// 10. Renaming during destructuring and shorthand
// ---------------------------------------------------------------------

// Renamed local variables can be used directly as shorthand property names.
const response = {
  username: "john",
};

const { username: nameValue } = response;

const normalizedUser = {
  nameValue,
};

console.log(normalizedUser); // { nameValue: "john" }

const renamedUser = {
  name: nameValue,
};

console.log(renamedUser); // { name: "john" }

// ---------------------------------------------------------------------
// 11. Shorthand in React-style data objects
// ---------------------------------------------------------------------

// Shorthand is common when constructing component props, state, and payloads.
const id = 42;
const label = "Save";
const disabled = false;

const buttonProps = {
  id,
  label,
  disabled,
};

console.log(buttonProps); // { id: 42, label: "Save", disabled: false }

// ---------------------------------------------------------------------
// 12. Property shorthand uses the variable's value
// ---------------------------------------------------------------------

// The shorthand syntax evaluates the variable and stores its value as a property.
const settings = {
  theme: "dark",
};

const currentSettings = {
  settings,
};

console.log(currentSettings); // { settings: { theme: "dark" } }

// ---------------------------------------------------------------------
// 13. Shorthand and primitive values
// ---------------------------------------------------------------------

// Shorthand works with values of any data type.
const text = "hello";
const number = 42;
const enabled = true;
const empty = null;
const missing = undefined;

const values = {
  text,
  number,
  enabled,
  empty,
  missing,
};

console.log(values);
// { text: "hello", number: 42, enabled: true, empty: null, missing: undefined }

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Object property shorthand omits the repeated property name when it matches the variable name.
// - `name` is shorthand for `name: name`.
// - Shorthand can be mixed with regular property definitions.
// - Shorthand does not rename properties; use `property: value` when names differ.
// - Function values can also use property shorthand.
// - Method shorthand (`method() {}`) is a separate object syntax.
// - Shorthand is commonly used when constructing objects from local variables.
// - The property's value is evaluated when the object is created.
