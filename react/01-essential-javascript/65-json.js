/**
 * JSON
 * ====
 *
 * JSON (JavaScript Object Notation) is a text format commonly used to
 * represent structured data. JavaScript provides JSON.parse() for converting
 * JSON text into JavaScript values and JSON.stringify() for converting
 * JavaScript values into JSON text.
 */

// ---------------------------------------------------------------------
// 1. JSON is text
// ---------------------------------------------------------------------

const jsonText = '{"name":"Alice","age":30}';
// `typeof jsonText` is "string".

// ---------------------------------------------------------------------
// 2. JSON values
// ---------------------------------------------------------------------

const jsonString = '"hello"';
const jsonNumber = "42";
const jsonBoolean = "true";
const jsonNull = "null";
const jsonObject = '{"active":true}';
const jsonArray = "[1,2,3]";

// ---------------------------------------------------------------------
// 3. JSON object syntax
// ---------------------------------------------------------------------

const userJson = `{
  "id": 1,
  "name": "Alice",
  "active": true
}`;

// ---------------------------------------------------------------------
// 4. JSON arrays
// ---------------------------------------------------------------------

const usersJson = `[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]`;

// ---------------------------------------------------------------------
// 5. JSON.parse()
// ---------------------------------------------------------------------

const text = '{"name":"Alice","age":30}';
const user = JSON.parse(text);
// `user.name` is "Alice", `user.age` is 30.

// ---------------------------------------------------------------------
// 6. Parsing different JSON values
// ---------------------------------------------------------------------

JSON.parse('"hello"'); // "hello"
JSON.parse("42"); // 42
JSON.parse("true"); // true
JSON.parse("null"); // null
JSON.parse("[1,2,3]"); // [1, 2, 3]

// ---------------------------------------------------------------------
// 7. Parsing nested JSON
// ---------------------------------------------------------------------

const responseText = `{
  "user": { "id": 1, "name": "Alice" },
  "roles": ["admin", "editor"]
}`;
const responseData = JSON.parse(responseText);

// ---------------------------------------------------------------------
// 8. Invalid JSON
// ---------------------------------------------------------------------

// const invalidJson = "{name: 'Alice'}";
// JSON.parse(invalidJson); // Throws SyntaxError (requires double quotes).

// ---------------------------------------------------------------------
// 9. JSON.stringify()
// ---------------------------------------------------------------------

const product = { id: 1, name: "Keyboard", price: 99 };
const productJson = JSON.stringify(product);
// '{"id":1,"name":"Keyboard","price":99}'

// ---------------------------------------------------------------------
// 10. Stringifying arrays and primitives
// ---------------------------------------------------------------------

const numbersText = JSON.stringify([1, 2, 3]); // "[1,2,3]"
const primitiveText = JSON.stringify("hello"); // '"hello"'

// ---------------------------------------------------------------------
// 11. JSON.parse() reverses JSON.stringify()
// ---------------------------------------------------------------------

const original = { name: "Alice", roles: ["admin"] };
const restored = JSON.parse(JSON.stringify(original));

// ---------------------------------------------------------------------
// 12. Nested objects and arrays
// ---------------------------------------------------------------------

const dashboard = {
  user: { id: 10, preferences: { theme: "dark" } },
  notifications: [{ id: 1, read: false }],
};
const dashboardJson = JSON.stringify(dashboard);
const restoredDashboard = JSON.parse(dashboardJson);

// ---------------------------------------------------------------------
// 13. Property ordering and whitespace
// ---------------------------------------------------------------------

const object = { first: 1, second: 2 };
const textValue = JSON.stringify(object); // '{"first":1,"second":2}'
const compactJson = '{"name":"Alice","age":30}';
JSON.parse(compactJson);

// ---------------------------------------------------------------------
// 14. Pretty-printing JSON
// ---------------------------------------------------------------------

const dataObject = { name: "Alice", roles: ["admin"] };
const prettyJson = JSON.stringify(dataObject, null, 2);

// ---------------------------------------------------------------------
// 15. Unsupported values in JSON.stringify()
// ---------------------------------------------------------------------

const complexValue = {
  name: "Alice",
  nickname: undefined, // Omitted
  login() {}, // Omitted
  [Symbol("secret")]: "hidden", // Ignored
  nan: NaN, // Converted to null
  infinity: Infinity, // Converted to null
};
const complexJson = JSON.stringify(complexValue);

// ---------------------------------------------------------------------
// 16. Arrays with unsupported values
// ---------------------------------------------------------------------

const values = [1, undefined, 3];
const valuesJson = JSON.stringify(values); // "[1,null,3]"

// ---------------------------------------------------------------------
// 17. Dates in JSON
// ---------------------------------------------------------------------

const createdAt = new Date("2026-01-01T00:00:00.000Z");
const dateJson = JSON.stringify({ createdAt }); // Serialized as ISO string

const parsedDateData = JSON.parse(dateJson);
const parsedDate = new Date(parsedDateData.createdAt); // Converted back manually

// ---------------------------------------------------------------------
// 18. JSON and object identity
// ---------------------------------------------------------------------

const originalObject = { user: { name: "Alice" } };
const copiedObject = JSON.parse(JSON.stringify(originalObject));
// Creates new instances (useful for simple deep copies of JSON-safe data).

// ---------------------------------------------------------------------
// 19. BigInt limitations
// ---------------------------------------------------------------------

const largeNumber = { value: 123n };
// JSON.stringify(largeNumber); // Throws TypeError (BigInt is unsupported).

// ---------------------------------------------------------------------
// 20. Error handling with JSON.parse()
// ---------------------------------------------------------------------

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

// ---------------------------------------------------------------------
// 21. JSON and HTTP APIs
// ---------------------------------------------------------------------

async function loadUser() {
  const response = await fetch("/api/user");
  return response.json(); // Parses response body as JSON.
}

async function createUser(userData) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JSON provides a standard text-based format for exchanging structured data.
// - `JSON.parse()` converts JSON strings into JavaScript values, while `JSON.stringify()` serializes values into JSON text.
// - Supported types include strings, numbers, booleans, null, objects, and arrays.
// - Undefined values, functions, symbols, and BigInts cannot be serialized directly.
// - `JSON.parse()` throws a `SyntaxError` if text is malformed, requiring explicit validation for application schemas.
