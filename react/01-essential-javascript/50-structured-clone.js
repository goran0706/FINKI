/**
 * structuredClone()
 * =================
 *
 * The structuredClone() function creates a deep clone of a value using the
 * structured clone algorithm. Unlike shallow-copy techniques such as spread
 * syntax and Object.assign(), nested objects and arrays are cloned as well.
 */

// ---------------------------------------------------------------------
// 1. Basic deep cloning
// ---------------------------------------------------------------------

const original = {
  name: "John",
  age: 30,
  address: {
    city: "Skopje",
    country: "North Macedonia",
  },
};

const clone = structuredClone(original);

console.log(clone);
// {
//   name: "John",
//   age: 30,
//   address: { city: "Skopje", country: "North Macedonia" }
// }

// The top-level objects are different references.
console.log(original === clone); // false

// Nested objects are also different references.
console.log(original.address === clone.address); // false

// ---------------------------------------------------------------------
// 2. Deep cloning nested arrays and objects
// ---------------------------------------------------------------------

const user = {
  name: "John",
  skills: ["JavaScript", "TypeScript"],
  profile: {
    active: true,
    preferences: {
      theme: "dark",
    },
  },
};

const clonedUser = structuredClone(user);

// Mutating the clone does not affect the original.
clonedUser.skills.push("React");
clonedUser.profile.preferences.theme = "light";

console.log(clonedUser.skills); // [ "JavaScript", "TypeScript", "React" ]
console.log(user.skills); // [ "JavaScript", "TypeScript" ]

console.log(clonedUser.profile.preferences.theme); // "light"
console.log(user.profile.preferences.theme); // "dark"

// Every nested object/array was cloned.
console.log(user.skills === clonedUser.skills); // false
console.log(user.profile === clonedUser.profile); // false
console.log(user.profile.preferences === clonedUser.profile.preferences); // false

// ---------------------------------------------------------------------
// 3. Shallow copy vs. structuredClone()
// ---------------------------------------------------------------------

const data = {
  name: "John",
  settings: {
    theme: "dark",
  },
};

// Spread syntax creates only a shallow copy.
const shallowCopy = { ...data };

// structuredClone() creates a deep copy.
const deepCopy = structuredClone(data);

shallowCopy.settings.theme = "light";

console.log(data.settings.theme); // "light"
console.log(deepCopy.settings.theme); // "dark"

// The nested object is shared by the shallow copy.
console.log(data.settings === shallowCopy.settings); // true

// The nested object is independent in the deep clone.
console.log(data.settings === deepCopy.settings); // false

// ---------------------------------------------------------------------
// 4. Arrays
// ---------------------------------------------------------------------

const numbers = [
  [1, 2],
  [3, 4],
  [5, 6],
];

const clonedNumbers = structuredClone(numbers);

clonedNumbers[0].push(7);

console.log(clonedNumbers); // [ [ 1, 2, 7 ], [ 3, 4 ], [ 5, 6 ] ]
console.log(numbers); // [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ] ]

// The outer array and nested arrays are separate objects.
console.log(numbers === clonedNumbers); // false
console.log(numbers[0] === clonedNumbers[0]); // false

// ---------------------------------------------------------------------
// 5. Supported primitive values
// ---------------------------------------------------------------------

const primitives = {
  string: "hello",
  number: 42,
  boolean: true,
  nullValue: null,
  undefinedValue: undefined,
  bigint: 123n,
};

const clonedPrimitives = structuredClone(primitives);

console.log(clonedPrimitives);
// {
//   string: "hello",
//   number: 42,
//   boolean: true,
//   nullValue: null,
//   undefinedValue: undefined,
//   bigint: 123n
// }

// Primitive values themselves are copied by value.
console.log(clonedPrimitives.string); // "hello"
console.log(clonedPrimitives.number); // 42
console.log(clonedPrimitives.boolean); // true
console.log(clonedPrimitives.nullValue); // null
console.log(clonedPrimitives.undefinedValue); // undefined
console.log(clonedPrimitives.bigint); // 123n

// ---------------------------------------------------------------------
// 6. Date objects
// ---------------------------------------------------------------------

const originalDate = new Date("2026-01-15T12:00:00.000Z");
const clonedDate = structuredClone(originalDate);

console.log(clonedDate instanceof Date); // true
console.log(clonedDate.getTime() === originalDate.getTime()); // true

// The Date objects are separate references.
console.log(originalDate === clonedDate); // false

clonedDate.setUTCFullYear(2030);

console.log(clonedDate.getUTCFullYear()); // 2030
console.log(originalDate.getUTCFullYear()); // 2026

// ---------------------------------------------------------------------
// 7. RegExp objects
// ---------------------------------------------------------------------

const originalRegex = /javascript/gi;
const clonedRegex = structuredClone(originalRegex);

console.log(clonedRegex instanceof RegExp); // true
console.log(clonedRegex.source); // "javascript"
console.log(clonedRegex.flags); // "gi"

console.log(originalRegex === clonedRegex); // false

// ---------------------------------------------------------------------
// 8. Map
// ---------------------------------------------------------------------

const originalMap = new Map([
  ["name", "John"],
  ["age", 30],
]);

const clonedMap = structuredClone(originalMap);

console.log(clonedMap instanceof Map); // true
console.log(clonedMap.get("name")); // "John"
console.log(clonedMap.get("age")); // 30

console.log(originalMap === clonedMap); // false

clonedMap.set("age", 31);

console.log(clonedMap.get("age")); // 31
console.log(originalMap.get("age")); // 30

// ---------------------------------------------------------------------
// 9. Set
// ---------------------------------------------------------------------

const originalSet = new Set(["JavaScript", "TypeScript", "React"]);
const clonedSet = structuredClone(originalSet);

console.log(clonedSet instanceof Set); // true
console.log(clonedSet.has("React")); // true

console.log(originalSet === clonedSet); // false

clonedSet.add("Node.js");

console.log(clonedSet.has("Node.js")); // true
console.log(originalSet.has("Node.js")); // false

// ---------------------------------------------------------------------
// 10. Nested Map and Set values
// ---------------------------------------------------------------------

const originalData = {
  users: new Map([["user-1", { name: "John" }]]),
  roles: new Set(["admin", "editor"]),
};

const clonedData = structuredClone(originalData);

// The container objects are independent.
console.log(originalData.users === clonedData.users); // false
console.log(originalData.roles === clonedData.roles); // false

// Nested Map values are also cloned.
console.log(originalData.users.get("user-1") === clonedData.users.get("user-1")); // false

clonedData.users.get("user-1").name = "Jane";
clonedData.roles.add("viewer");

console.log(originalData.users.get("user-1").name); // "John"
console.log(clonedData.users.get("user-1").name); // "Jane"

console.log(originalData.roles.has("viewer")); // false
console.log(clonedData.roles.has("viewer")); // true

// ---------------------------------------------------------------------
// 11. Typed arrays
// ---------------------------------------------------------------------

const originalBuffer = new Uint8Array([10, 20, 30]);
const clonedBuffer = structuredClone(originalBuffer);

console.log(clonedBuffer instanceof Uint8Array); // true
console.log(clonedBuffer); // Uint8Array(3) [10, 20, 30]

clonedBuffer[0] = 99;

console.log(clonedBuffer[0]); // 99
console.log(originalBuffer[0]); // 10

// The underlying data is cloned rather than shared.
console.log(originalBuffer === clonedBuffer); // false

// ---------------------------------------------------------------------
// 12. Circular references
// ---------------------------------------------------------------------

const circularObject = {
  name: "John",
};

circularObject.self = circularObject;

const clonedCircularObject = structuredClone(circularObject);

console.log(clonedCircularObject.name); // "John"
console.log(clonedCircularObject.self === clonedCircularObject); // true

// structuredClone() can preserve circular references.
// JSON.stringify() cannot serialize this structure.

// ---------------------------------------------------------------------
// 13. Circular references vs. JSON serialization
// ---------------------------------------------------------------------

const circularData = {
  name: "John",
};

circularData.self = circularData;

// This would throw a TypeError:
//
// JSON.stringify(circularData);

// structuredClone() handles the circular reference.
const clonedCircularData = structuredClone(circularData);

console.log(clonedCircularData.self === clonedCircularData); // true

// ---------------------------------------------------------------------
// 14. Functions cannot be cloned
// ---------------------------------------------------------------------

const dataWithFunction = {
  name: "John",
  greet() {
    return "Hello";
  },
};

// structuredClone() throws DataCloneError when a value contains
// a function that cannot be cloned.
//
// const clone = structuredClone(dataWithFunction);

// Functions are intentionally not part of the structured cloneable
// value types.

// ---------------------------------------------------------------------
// 15. Symbols cannot be cloned
// ---------------------------------------------------------------------

const symbolValue = Symbol("id");

// A Symbol value itself cannot be structured-cloned.
//
// structuredClone(symbolValue); // DataCloneError

// Symbol-keyed properties are also not preserved by structuredClone().
const symbolKey = Symbol("id");

const objectWithSymbol = {
  name: "John",
  [symbolKey]: 123,
};

const clonedObjectWithSymbol = structuredClone(objectWithSymbol);

console.log(clonedObjectWithSymbol.name); // "John"
console.log(Object.getOwnPropertySymbols(clonedObjectWithSymbol)); // []

// ---------------------------------------------------------------------
// 16. Error when a value cannot be cloned
// ---------------------------------------------------------------------

try {
  structuredClone(() => "hello");
} catch (error) {
  console.log(error.name); // "DataCloneError"
}

// structuredClone() does not silently skip unsupported values.
// It throws when the value being cloned contains a non-cloneable value.

// ---------------------------------------------------------------------
// 17. Property descriptors are not preserved
// ---------------------------------------------------------------------

const source = {};

Object.defineProperty(source, "id", {
  value: 123,
  enumerable: false,
  writable: false,
  configurable: false,
});

const clonedSource = structuredClone(source);

console.log(Object.keys(source)); // []
console.log(Object.keys(clonedSource)); // [ "id" ]

// The clone contains an ordinary data property rather than preserving
// the original property descriptor.
console.log(Object.getOwnPropertyDescriptor(clonedSource, "id"));
// {
//   value: 123,
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// ---------------------------------------------------------------------
// 18. Class instances
// ---------------------------------------------------------------------

class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}

const originalUser = new User("John");
const clonedUserInstance = structuredClone(originalUser);

console.log(originalUser instanceof User); // true
console.log(clonedUserInstance instanceof User); // false

console.log(clonedUserInstance.name); // "John"

// The own data is cloned, but the custom prototype is not preserved
// as an instance of the original application-defined class.
//
// clonedUserInstance.greet(); // TypeError

// ---------------------------------------------------------------------
// 19. React state and immutable updates
// ---------------------------------------------------------------------

const state = {
  user: {
    name: "John",
    preferences: {
      theme: "dark",
    },
  },
  notifications: [
    { id: 1, read: false },
    { id: 2, read: true },
  ],
};

const nextState = structuredClone(state);

nextState.user.preferences.theme = "light";
nextState.notifications[0].read = true;

console.log(state.user.preferences.theme); // "dark"
console.log(nextState.user.preferences.theme); // "light"

console.log(state.notifications[0].read); // false
console.log(nextState.notifications[0].read); // true

// structuredClone() can be useful when a complete independent
// snapshot is required. For React state updates, however, cloning
// the entire state tree is often unnecessary and less efficient than
// updating only the branches that actually changed.

// ---------------------------------------------------------------------
// 20. structuredClone() vs. JSON serialization
// ---------------------------------------------------------------------

const complexValue = {
  createdAt: new Date("2026-01-15T12:00:00.000Z"),
  numbers: [1, 2, 3],
  metadata: new Map([["source", "api"]]),
};

const structuredCloneResult = structuredClone(complexValue);
const jsonCloneResult = JSON.parse(JSON.stringify(complexValue));

console.log(structuredCloneResult.createdAt instanceof Date); // true
console.log(jsonCloneResult.createdAt instanceof Date); // false

console.log(structuredCloneResult.metadata instanceof Map); // true
console.log(jsonCloneResult.metadata instanceof Map); // false

console.log(jsonCloneResult);
// {
//   createdAt: "2026-01-15T12:00:00.000Z",
//   numbers: [1, 2, 3],
//   metadata: {}
// }

// structuredClone() is designed to clone a broader set of
// JavaScript data types without converting them to JSON text.

// ---------------------------------------------------------------------
// 21. What structuredClone() does not mean
// ---------------------------------------------------------------------

const sourceObject = {
  nested: {
    value: 10,
  },
};

const clonedObject = structuredClone(sourceObject);

// structuredClone() creates a new object graph.
console.log(sourceObject !== clonedObject); // true
console.log(sourceObject.nested !== clonedObject.nested); // true

// It does NOT:
//
// - preserve object identity between the original and clone
// - clone functions
// - clone Symbols
// - preserve custom class prototypes
// - preserve property descriptors
// - guarantee that every JavaScript value is cloneable

// ---------------------------------------------------------------------
// 22. When to use structuredClone()
// ---------------------------------------------------------------------

const applicationData = {
  user: {
    name: "John",
    preferences: {
      language: "en",
    },
  },
  items: [
    { id: 1, quantity: 2 },
    { id: 2, quantity: 1 },
  ],
};

const snapshot = structuredClone(applicationData);

// A snapshot can be modified independently from the source.
snapshot.user.preferences.language = "mk";
snapshot.items[0].quantity = 10;

console.log(applicationData.user.preferences.language); // "en"
console.log(applicationData.items[0].quantity); // 2

console.log(snapshot.user.preferences.language); // "mk"
console.log(snapshot.items[0].quantity); // 10

// ---------------------------------------------------------------------
// 23. Important distinction: deep clone does not mean deep freeze
// ---------------------------------------------------------------------

const mutableClone = structuredClone({
  settings: {
    theme: "dark",
  },
});

mutableClone.settings.theme = "light";

console.log(mutableClone.settings.theme); // "light"

// The cloned object is still mutable.
// structuredClone() copies a value; it does not freeze it.
//
// Object.freeze() is a separate operation with different semantics.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - structuredClone() creates a deep clone using the structured clone algorithm.
// - Nested objects and arrays receive independent references.
// - It supports many built-in types such as Date, RegExp, Map, Set, and typed arrays.
// - Circular references can be cloned.
// - Functions and Symbols cannot be structured-cloned.
// - Custom class instances do not retain their original class prototype.
// - Property descriptors are not preserved as descriptors.
// - The clone is mutable unless it is explicitly frozen afterward.
// - structuredClone() is generally more capable than JSON serialization for cloning data.
// - Deep cloning an entire object is not automatically the best approach for React state updates.
// - Use it when an independent copy of a supported value is actually required.
