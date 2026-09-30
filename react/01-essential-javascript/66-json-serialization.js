/**
 * JSON Serialization
 * ==================
 *
 * JSON serialization converts JavaScript values into JSON-compatible text
 * representations. It is commonly used when data must cross a process,
 * network, storage, or application boundary.
 */

// ---------------------------------------------------------------------
// 1. Serialization and deserialization
// ---------------------------------------------------------------------

const user = { id: 1, name: "Alice" };
const serializedUser = JSON.stringify(user); // '{"id":1,"name":"Alice"}'
const deserializedUser = JSON.parse(serializedUser); // { id: 1, name: "Alice" }

// ---------------------------------------------------------------------
// 2. Serialization produces text
// ---------------------------------------------------------------------

const data = { name: "Alice", active: true };
const serialized = JSON.stringify(data);
// `typeof serialized` is "string".

// ---------------------------------------------------------------------
// 3. Serialization of primitive values and arrays
// ---------------------------------------------------------------------

JSON.stringify("hello"); // '"hello"'
JSON.stringify(42); // "42"
JSON.stringify(true); // "true"
JSON.stringify(null); // "null"
const numbersJson = JSON.stringify([1, 2, 3]); // "[1,2,3]"

// ---------------------------------------------------------------------
// 4. Serialization of nested data
// ---------------------------------------------------------------------

const profile = {
  id: 1,
  name: "Alice",
  address: { city: "Skopje", country: "North Macedonia" },
  roles: ["admin", "editor"],
};
const profileJson = JSON.stringify(profile);

// ---------------------------------------------------------------------
// 5. Handling undefined, functions, and symbols
// ---------------------------------------------------------------------

const account = {
  id: 1,
  name: "Alice",
  nickname: undefined, // Omitted from objects
  login() {
    return true;
  }, // Omitted from objects
  [Symbol("secret")]: "hidden", // Ignored
};
const accountJson = JSON.stringify(account); // '{"id":1,"name":"Alice"}'

// ---------------------------------------------------------------------
// 6. Undefined array elements, NaN, and Infinity
// ---------------------------------------------------------------------

const valuesJson = JSON.stringify([1, undefined, 3]); // "[1,null,3]" (undefined elements become null)
const numericJson = JSON.stringify({
  valid: 10,
  nan: NaN, // Converted to null
  positiveInfinity: Infinity, // Converted to null
});

// ---------------------------------------------------------------------
// 7. Dates and collections (Map, Set, BigInt)
// ---------------------------------------------------------------------

const event = { createdAt: new Date("2026-01-01T12:00:00.000Z") };
const eventJson = JSON.stringify(event); // Serialized via toJSON() to an ISO string

const dataWithCollections = {
  map: new Map([["id", 1]]),
  set: new Set(["admin"]),
};
// Map and Set serialize to empty objects `{}`. BigInt values throw a TypeError by default.

// ---------------------------------------------------------------------
// 8. Replacer function
// ---------------------------------------------------------------------

const person = { name: "Alice", password: "secret", age: 30 };
const safeJson = JSON.stringify(person, (key, value) => {
  if (key === "password") {
    return undefined; // Omits property
  }
  return value;
});

// ---------------------------------------------------------------------
// 9. Replacer array
// ---------------------------------------------------------------------

const employee = {
  id: 1,
  name: "Alice",
  department: "Engineering",
  salary: 5000,
};
const selectedFields = JSON.stringify(employee, ["id", "name"]); // '{"id":1,"name":"Alice"}'

// ---------------------------------------------------------------------
// 10. Pretty serialization
// ---------------------------------------------------------------------

const settings = { theme: "dark", language: "en", notifications: true };
const formattedJson = JSON.stringify(settings, null, 2); // Formatted with 2 spaces indentation

// ---------------------------------------------------------------------
// 11. Custom toJSON() method
// ---------------------------------------------------------------------

const userRecord = {
  id: 1,
  name: "Alice",
  toJSON() {
    return {
      id: this.id,
      displayName: this.name,
    };
  },
};
const userRecordJson = JSON.stringify(userRecord);

// ---------------------------------------------------------------------
// 12. Reviver function with JSON.parse()
// ---------------------------------------------------------------------

const jsonText = '{"name":"Alice","createdAt":"2026-01-01T00:00:00.000Z"}';
const restored = JSON.parse(jsonText, (key, value) => {
  if (key === "createdAt") {
    return new Date(value); // Restores string back into a Date object
  }
  return value;
});

// ---------------------------------------------------------------------
// 13. Serialization limitations and circular references
// ---------------------------------------------------------------------

const cyclicObject = {};
cyclicObject.self = cyclicObject;
// JSON.stringify(cyclicObject); // Throws TypeError due to circular structure.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Serialization converts JavaScript values into JSON text (`JSON.stringify()`), while deserialization converts text back (`JSON.parse()`).
// - Unsupported values like `undefined`, functions, symbols, and `BigInt` require special handling or are omitted/converted.
// - Replacer functions/arrays, pretty-printing, and custom `toJSON()` methods provide fine-grained control over output.
// - Reviver functions help restore rich types like `Date` objects during deserialization.
// - Circular references cannot be serialized.
