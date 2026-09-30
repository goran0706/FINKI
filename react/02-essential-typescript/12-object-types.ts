/**
 * Object Types
 * ============
 *
 * An object type describes the shape of an object by defining its properties
 * and the types of values those properties can contain. Object types allow
 * TypeScript to check that objects contain the expected properties and values.
 */

// -----------------------------------------------------------------------
// 1. Defining object types
// -----------------------------------------------------------------------

// An object type specifies the name and type of each property.
let user: {
  name: string;
  age: number;
} = {
  name: "John Doe",
  age: 30,
};

console.log(user); // { name: 'John Doe', age: 30 }

// Each property must contain a value that matches its declared type.
// user = { name: 30, age: "John Doe" }; // TS2322: Type 'number' is not assignable to type 'string'.

// -----------------------------------------------------------------------
// 2. Accessing object properties
// -----------------------------------------------------------------------

// TypeScript knows the type of each property from the object type.
const username: string = user.name;
const age: number = user.age;

console.log(username); // "John Doe"
console.log(age); // 30

// TypeScript prevents access to properties that are not part of the object type.
// console.log(user.email); // TS2339: Property 'email' does not exist on type '{ name: string; age: number; }'.

// -----------------------------------------------------------------------
// 3. Multiple object properties
// -----------------------------------------------------------------------

// An object type can contain any number of properties with different types.
let product: {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
} = {
  id: 1,
  name: "Keyboard",
  price: 99.99,
  inStock: true,
};

console.log(product.id); // 1
console.log(product.name); // "Keyboard"
console.log(product.price); // 99.99
console.log(product.inStock); // true

// Every required property must be present.
// product = { id: 1, name: "Keyboard", price: 99.99 };
// TS2741: Property 'inStock' is missing in type ... but required in type ...

// -----------------------------------------------------------------------
// 4. Nested object types
// -----------------------------------------------------------------------

// Object properties can themselves contain objects with their own types.
let customer: {
  name: string;
  address: {
    city: string;
    country: string;
  };
} = {
  name: "John Doe",
  address: {
    city: "Skopje",
    country: "North Macedonia",
  },
};

console.log(customer.name); // "John Doe"
console.log(customer.address.city); // "Skopje"
console.log(customer.address.country); // "North Macedonia"

// TypeScript also checks the types of nested properties.
// customer.address.city = 100; // TS2322: Type 'number' is not assignable to type 'string'.

// -----------------------------------------------------------------------
// 5. Object properties with arrays
// -----------------------------------------------------------------------

// Object properties can contain arrays with their own element types.
let team: {
  name: string;
  members: string[];
} = {
  name: "Frontend",
  members: ["John", "Jane", "Mark"],
};

console.log(team.name); // "Frontend"
console.log(team.members); // [ 'John', 'Jane', 'Mark' ]
console.log(team.members[0]); // "John"

// The array property can only contain values of its declared element type.
// team.members.push(42); // TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

// -----------------------------------------------------------------------
// 6. Object properties with functions
// -----------------------------------------------------------------------

// Object properties can also be functions with their own parameter and return types.
let calculator: {
  add: (a: number, b: number) => number;
  multiply: (a: number, b: number) => number;
} = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
};

console.log(calculator.add(10, 5)); // 15
console.log(calculator.multiply(10, 5)); // 50

// Function parameters and return values are checked according to their declared types.
// calculator.add("10", 5); // TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

// -----------------------------------------------------------------------
// 7. Readonly object properties
// -----------------------------------------------------------------------

// A readonly property can be read but cannot be reassigned after initialization.
const configuration: {
  readonly environment: string;
  readonly port: number;
} = {
  environment: "development",
  port: 3000,
};

console.log(configuration.environment); // "development"
console.log(configuration.port); // 3000

// configuration.port = 4000; // TS2540: Cannot assign to 'port' because it is a read-only property.

// Readonly applies to reassignment of the property itself.
// It does not make the entire object deeply immutable.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - An object type describes the shape of an object and the types of its properties.
// - Each property can have its own type, including primitive, array, object, or function types.
// - TypeScript checks both top-level and nested object properties.
// - Required properties must be present when creating a value with an object type.
// - Object properties can contain arrays and functions with their own type definitions.
// - Readonly properties cannot be reassigned after initialization.
