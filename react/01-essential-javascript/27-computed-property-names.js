/**
 * Computed Property Names
 * =======================
 *
 * Computed property names let JavaScript calculate an object property name
 * from an expression instead of writing the property name directly.
 * The expression is evaluated and its result is converted to a property key.
 *
 * This file covers computed property names in object literals, dynamic keys,
 * expressions, symbols, methods, destructuring, and practical React patterns.
 */

// ---------------------------------------------------------------------
// 1. Static property names vs. computed property names
// ---------------------------------------------------------------------

// A normal object literal uses a fixed property name:
const user = {
  name: "Ada",
};

console.log(user.name); // "Ada"

// A computed property name is written inside square brackets.
// The expression inside `[]` determines the property name.

const propertyName = "name";

const computedUser = {
  [propertyName]: "Ada",
};

console.log(computedUser.name); // "Ada"
console.log(computedUser[propertyName]); // "Ada"

// The brackets mean "evaluate this expression and use its result as the key".
// They do NOT mean array indexing in this context.

// ---------------------------------------------------------------------
// 2. Using a variable as a property name
// ---------------------------------------------------------------------

// This is useful when the property name is only known at runtime.

const key = "email";

const account = {
  [key]: "ada@example.com",
};

console.log(account.email); // "ada@example.com"
console.log(account[key]); // "ada@example.com"

// Without computed property syntax, `key` would literally become the
// property name "key":

const staticKeyObject = {
  key: "ada@example.com",
};

console.log(staticKeyObject.key); // "ada@example.com"
console.log(staticKeyObject.email); // undefined

// ---------------------------------------------------------------------
// 3. Expressions inside computed property names
// ---------------------------------------------------------------------

// Anything that produces a valid property key can be used inside `[]`.

const firstName = "first";
const lastName = "last";

const person = {
  [firstName + "Name"]: "Ada",
  [lastName + "Name"]: "Lovelace",
};

console.log(person.firstName); // "Ada"
console.log(person.lastName); // "Lovelace"

// Template literals are especially useful for building dynamic keys:

const prefix = "user";
const id = 42;

const record = {
  [`${prefix}_${id}`]: "Ada",
};

console.log(record.user_42); // "Ada"

// The expression is evaluated when the object literal is created.

// ---------------------------------------------------------------------
// 4. Computed property names can use function calls
// ---------------------------------------------------------------------

// The expression does not have to be a simple variable.
// A function call can calculate the property name.

function createKey(prefix, id) {
  return `${prefix}_${id}`;
}

const data = {
  [createKey("user", 1)]: "Ada",
  [createKey("user", 2)]: "Grace",
};

console.log(data.user_1); // "Ada"
console.log(data.user_2); // "Grace"

// This is useful when property names follow a predictable runtime format.

// ---------------------------------------------------------------------
// 5. Numeric property names
// ---------------------------------------------------------------------

// Property keys in ordinary JavaScript objects are strings or symbols.
// Numbers used as property names are converted to strings.

const index = 0;

const values = {
  [index]: "first",
  [index + 1]: "second",
};

console.log(values[0]); // "first"
console.log(values["0"]); // "first"
console.log(values[1]); // "second"

// `0` and `"0"` refer to the same property because the object key is the string "0".

console.log(Object.keys(values)); // ["0", "1"]

// ---------------------------------------------------------------------
// 6. Symbol property names
// ---------------------------------------------------------------------

// Symbols are the other kind of property key besides strings.
// A computed property name can use a Symbol directly.

const idSymbol = Symbol("id");

const object = {
  [idSymbol]: 123,
  name: "Ada",
};

console.log(object[idSymbol]); // 123
console.log(object.name); // "Ada"

// Symbol properties are not returned by Object.keys():
console.log(Object.keys(object)); // ["name"]

// They can be retrieved with Object.getOwnPropertySymbols():
console.log(Object.getOwnPropertySymbols(object)); // [Symbol(id)]

// Symbols are useful for creating keys that do not collide with normal string keys.

// ---------------------------------------------------------------------
// 7. Computed method names
// ---------------------------------------------------------------------

// Computed property names also work for methods.

const methodName = "greet";

const greeter = {
  [methodName]() {
    return "Hello!";
  },
};

console.log(greeter.greet()); // "Hello!"
console.log(greeter[methodName]()); // "Hello!"

// The same syntax works with methods that receive arguments:

const action = "add";

const calculator = {
  [action](a, b) {
    return a + b;
  },
};

console.log(calculator.add(2, 3)); // 5
console.log(calculator[action](4, 5)); // 9

// ---------------------------------------------------------------------
// 8. Multiple computed properties
// ---------------------------------------------------------------------

// An object can contain any combination of static and computed properties.

const idKey = "id";
const nameKey = "name";
const activeKey = "isActive";

const userData = {
  [idKey]: 1,
  [nameKey]: "Ada",
  [activeKey]: true,
  role: "admin",
};

console.log(userData);
// { id: 1, name: "Ada", isActive: true, role: "admin" }

// Computed properties are especially useful when constructing objects
// from data whose field names are determined at runtime.

// ---------------------------------------------------------------------
// 9. Computed property names and duplicate keys
// ---------------------------------------------------------------------

// If the same computed key is produced more than once,
// the later property overwrites the earlier property.

const keyA = "name";
const keyB = "name";

const duplicate = {
  [keyA]: "Ada",
  [keyB]: "Grace",
};

console.log(duplicate.name); // "Grace"

// The object contains only one `name` property.
// The second assignment replaced the first value.

// ---------------------------------------------------------------------
// 10. Computed properties with object spread
// ---------------------------------------------------------------------

// Computed properties can be combined with object spread.

const field = "role";
const defaults = {
  active: true,
};

const profile = {
  ...defaults,
  [field]: "admin",
};

console.log(profile);
// { active: true, role: "admin" }

// If a later property uses the same key, it overwrites the earlier value.

const baseProfile = {
  name: "Ada",
  role: "user",
};

const updatedProfile = {
  ...baseProfile,
  [field]: "admin",
};

console.log(updatedProfile);
// { name: "Ada", role: "admin" }

// This is the same immutable object-update pattern commonly used with React state.

// ---------------------------------------------------------------------
// 11. Building objects dynamically
// ---------------------------------------------------------------------

// Computed property names are useful when transforming a list into an object.

const fields = ["name", "email", "role"];

const emptyUser = {
  [fields[0]]: "",
  [fields[1]]: "",
  [fields[2]]: "",
};

console.log(emptyUser);
// { name: "", email: "", role: "" }

// A more realistic example uses a loop:

const fieldNames = ["firstName", "lastName", "email"];
const valuesByField = {};

for (const fieldName of fieldNames) {
  valuesByField[fieldName] = "";
}

console.log(valuesByField);
// { firstName: "", lastName: "", email: "" }

// Bracket notation is used here because the key is stored in a variable.
// Computed property syntax is mainly useful when creating the object literal itself.

// ---------------------------------------------------------------------
// 12. Computed property names in a function
// ---------------------------------------------------------------------

// A function can create an object whose property name depends on an argument.

function createEntry(key, value) {
  return {
    [key]: value,
  };
}

const entry = createEntry("username", "ada");

console.log(entry);
// { username: "ada" }

// This pattern is useful for generic object-building functions.

// ---------------------------------------------------------------------
// 13. Computed property names and destructuring
// ---------------------------------------------------------------------

// Computed property syntax can also be used when destructuring an object.
// The key is calculated from an expression.

const property = "name";

const { [property]: extractedName } = {
  name: "Ada",
};

console.log(extractedName); // "Ada"

// The syntax can look unusual:
// - `[property]` calculates which property to read.
// - `extractedName` is the local variable that receives its value.
//
// The local variable does not have to have the same name as the property.

// Another example:

const fieldToRead = "email";

const { [fieldToRead]: email } = {
  name: "Ada",
  email: "ada@example.com",
};

console.log(email); // "ada@example.com"

// ---------------------------------------------------------------------
// 14. Computed property names are evaluated at runtime
// ---------------------------------------------------------------------

// The expression inside `[]` runs when the object literal is evaluated.

let counter = 0;

function nextKey() {
  counter += 1;
  return `key${counter}`;
}

const generatedKeys = {
  [nextKey()]: "first",
  [nextKey()]: "second",
};

console.log(generatedKeys);
// { key1: "first", key2: "second" }

console.log(counter); // 2

// This is an important distinction from static property names:
// computed keys can execute code and therefore have runtime behavior.

// ---------------------------------------------------------------------
// 15. Computed property names with expressions and side effects
// ---------------------------------------------------------------------

// Because the expression is evaluated, side effects can occur.
// Avoid unnecessary side effects in property-key expressions.

let currentId = 10;

const item = {
  [`item_${currentId++}`]: "Keyboard",
};

console.log(item.item_10); // "Keyboard"
console.log(currentId); // 11

// Although valid JavaScript, keeping property-key expressions simple
// makes object literals easier to understand and maintain.

// ---------------------------------------------------------------------
// 16. A practical React state example
// ---------------------------------------------------------------------

// Computed property names are common when updating one field in an object.
//
// Given:
// const [form, setForm] = useState({
//   username: "",
//   email: "",
// });
//
// A generic change handler can update whichever field triggered the event:
//
// function handleChange(event) {
//   const { name, value } = event.target;
//
//   setForm((previousForm) => ({
//     ...previousForm,
//     [name]: value,
//   }));
// }
//
// If `name` is "username", the computed property becomes:
//
// {
//   ...previousForm,
//   username: value,
// }
//
// If `name` is "email", it becomes:
//
// {
//   ...previousForm,
//   email: value,
// }
//
// This allows one handler to update multiple form fields.

// ---------------------------------------------------------------------
// 17. A practical React reducer example
// ---------------------------------------------------------------------

// Computed property names are also useful when updating state by a dynamic key.
//
// Example reducer pattern:
//
// function reducer(state, action) {
//   switch (action.type) {
//     case "fieldChanged":
//       return {
//         ...state,
//         [action.field]: action.value,
//       };
//
//     default:
//       return state;
//   }
// }
//
// An action such as:
//
// {
//   type: "fieldChanged",
//   field: "email",
//   value: "ada@example.com",
// }
//
// produces an updated object containing:
//
// {
//   ...state,
//   email: "ada@example.com",
// }
//
// The key comes from runtime data, while the object update remains immutable.

// ---------------------------------------------------------------------
// 18. Computed property names vs. bracket notation
// ---------------------------------------------------------------------

// These two forms solve related but different problems.
//
// Bracket notation accesses an existing property dynamically:

const userObject = {
  name: "Ada",
};

const dynamicKey = "name";

console.log(userObject[dynamicKey]); // "Ada"

// Computed property syntax creates a property dynamically:

const newUserObject = {
  [dynamicKey]: "Ada",
};

console.log(newUserObject); // { name: "Ada" }

// Think of the distinction as:
//
// object[key]   -> read or write a property using a dynamic key
// { [key]: value } -> create a property using a dynamic key

// Both use `[]`, but they appear in different syntactic contexts.

// ---------------------------------------------------------------------
// 19. Property keys are converted to strings except Symbols
// ---------------------------------------------------------------------

// When an object key is not a Symbol, JavaScript converts it to a string.

const numericKey = 42;
const booleanKey = true;

const convertedKeys = {
  [numericKey]: "number key",
  [booleanKey]: "boolean key",
};

console.log(convertedKeys["42"]); // "number key"
console.log(convertedKeys[42]); // "number key"

console.log(convertedKeys["true"]); // "boolean key"
console.log(convertedKeys[true]); // "boolean key"

// This follows JavaScript's property-key model:
// PropertyKey = string | symbol

// ---------------------------------------------------------------------
// 20. Common mistake: omitting the brackets
// ---------------------------------------------------------------------

// When a variable is used without brackets, its NAME becomes the property key.

const dynamicProperty = "username";

const wrong = {
  dynamicProperty: "Ada",
};

const correct = {
  [dynamicProperty]: "Ada",
};

console.log(wrong);
// { dynamicProperty: "Ada" }

console.log(correct);
// { username: "Ada" }

// The brackets are what tell JavaScript to evaluate the variable.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Computed property names use `[expression]` inside an object literal.
// - The expression is evaluated at runtime to determine the property key.
// - Variables, template literals, function calls, arithmetic, and other expressions can be used.
// - Property keys are strings or Symbols; other values are converted to strings.
// - Computed names work for data properties and methods.
// - Computed names can be used while destructuring objects.
// - Computed properties combine naturally with object spread for immutable updates.
// - They are especially useful when updating objects with dynamic fields.
// - React form handlers commonly use `[event.target.name]: event.target.value`.
// - `{ [key]: value }` creates a dynamic property; `object[key]` accesses one.
// - Without brackets, `{ key: value }` creates a property literally named "key".
