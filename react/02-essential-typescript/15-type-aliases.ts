/**
 * Type Aliases
 * ============
 *
 * A type alias gives a name to a type so it can be reused throughout a program.
 * Type aliases are useful for describing object shapes and other custom types.
 */

// -----------------------------------------------------------------------
// 1. Defining type aliases
// -----------------------------------------------------------------------

// A type alias is created with the `type` keyword.
type User = {
  name: string;
  age: number;
};

const user: User = {
  name: "John Doe",
  age: 30,
};

console.log(user); // { name: 'John Doe', age: 30 }

// The alias can be used anywhere the same object type is required.
const anotherUser: User = {
  name: "Jane Doe",
  age: 28,
};

console.log(anotherUser); // { name: 'Jane Doe', age: 28 }

// -----------------------------------------------------------------------
// 2. Reusing type aliases
// -----------------------------------------------------------------------

// A type alias can be used for multiple values with the same structure.
const user1: User = {
  name: "John Doe",
  age: 30,
};

const user2: User = {
  name: "Jane Doe",
  age: 28,
};

console.log(user1.name); // "John Doe"
console.log(user2.name); // "Jane Doe"

// TypeScript checks every value against the aliased type.
// const invalidUser: User = { name: "John Doe" };
// TS2741: Property 'age' is missing in type ...

// -----------------------------------------------------------------------
// 3. Type aliases for primitive types
// -----------------------------------------------------------------------

// Type aliases can also give names to primitive types.
type UserId = number;
type Username = string;
type IsActive = boolean;

const id: UserId = 101;
const username: Username = "johndoe";
const active: IsActive = true;

console.log(id); // 101
console.log(username); // "johndoe"
console.log(active); // true

// The alias does not create a new runtime type.
// It only gives an existing type another name.

// -----------------------------------------------------------------------
// 4. Type aliases for arrays
// -----------------------------------------------------------------------

// A type alias can describe an array type.
type Usernames = string[];
type Scores = number[];

const usernames: Usernames = ["john", "jane", "mark"];
const scores: Scores = [10, 20, 30];

console.log(usernames); // [ 'john', 'jane', 'mark' ]
console.log(scores); // [ 10, 20, 30 ]

// The element types are still checked.
// usernames.push(100); // TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

// -----------------------------------------------------------------------
// 5. Type aliases for function types
// -----------------------------------------------------------------------

// A type alias can describe the parameters and return type of a function.
type Add = (a: number, b: number) => number;

const add: Add = (a, b) => a + b;

console.log(add(10, 5)); // 15

// The function must match the aliased function type.
// const invalidAdd: Add = (a: string, b: string) => a + b;
// TS2322: Type '(a: string, b: string) => string' is not assignable to type 'Add'.

// -----------------------------------------------------------------------
// 6. Type aliases with optional properties
// -----------------------------------------------------------------------

// Type aliases can describe objects containing optional properties.
type Product = {
  name: string;
  price: number;
  description?: string;
};

const product: Product = {
  name: "Keyboard",
  price: 99.99,
};

console.log(product.name); // "Keyboard"
console.log(product.price); // 99.99
console.log(product.description); // undefined

// The optional property can also be provided.
const detailedProduct: Product = {
  name: "Mouse",
  price: 49.99,
  description: "Wireless mouse",
};

console.log(detailedProduct); // { name: 'Mouse', price: 49.99, description: 'Wireless mouse' }

// -----------------------------------------------------------------------
// 7. Type aliases with nested objects
// -----------------------------------------------------------------------

// Type aliases can describe complex object structures.
type Address = {
  city: string;
  country: string;
};

type Customer = {
  name: string;
  address: Address;
};

const customer: Customer = {
  name: "John Doe",
  address: {
    city: "Skopje",
    country: "North Macedonia",
  },
};

console.log(customer.name); // "John Doe"
console.log(customer.address.city); // "Skopje"
console.log(customer.address.country); // "North Macedonia"

// Reusing `Address` keeps the nested object structure consistent.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - A type alias gives a reusable name to an existing type.
// - Type aliases can describe objects, primitives, arrays, and functions.
// - The same alias can be reused for multiple variables and values.
// - Type aliases can include optional properties and nested object types.
// - Type aliases exist only at compile time and do not create new runtime types.
