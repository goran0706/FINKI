/**
 * Optional Properties
 * ===================
 *
 * Optional properties are object properties that may be present or omitted.
 * A `?` after the property name marks the property as optional.
 */

// -----------------------------------------------------------------------
// 1. Defining optional properties
// -----------------------------------------------------------------------

// An optional property can be included or omitted when creating an object.
let user: {
  name: string;
  age?: number;
} = {
  name: "John Doe",
};

console.log(user); // { name: 'John Doe' }

// The optional property can also be provided.
user = {
  name: "Jane Doe",
  age: 28,
};

console.log(user); // { name: 'Jane Doe', age: 28 }

// -----------------------------------------------------------------------
// 2. Accessing optional properties
// -----------------------------------------------------------------------

// An optional property may not exist, so TypeScript includes `undefined` in its type.
const age: number | undefined = user.age;

console.log(age); // 28

// When the property is omitted, its value is `undefined`.
const userWithoutAge: {
  name: string;
  age?: number;
} = {
  name: "John Doe",
};

console.log(userWithoutAge.age); // undefined

// -----------------------------------------------------------------------
// 3. Checking optional properties
// -----------------------------------------------------------------------

// Check that an optional property exists before using it as its required type.
if (user.age !== undefined) {
  console.log(user.age.toFixed(0)); // "28"
}

// A truthiness check can also be used when zero is not a valid value.
if (user.age) {
  console.log(user.age.toFixed(0)); // "28"
}

// -----------------------------------------------------------------------
// 4. Optional properties with different types
// -----------------------------------------------------------------------

// Any property type can be made optional.
let product: {
  name: string;
  price?: number;
  description?: string;
} = {
  name: "Keyboard",
};

console.log(product); // { name: 'Keyboard' }

product.price = 99.99;
product.description = "Mechanical keyboard";

console.log(product.price); // 99.99
console.log(product.description); // "Mechanical keyboard"

// -----------------------------------------------------------------------
// 5. Optional properties and object assignment
// -----------------------------------------------------------------------

// An object only needs to contain the required properties.
const account: {
  username: string;
  email?: string;
  verified?: boolean;
} = {
  username: "johndoe",
};

console.log(account); // { username: 'johndoe' }

// Optional properties can be added later.
account.email = "[john@example.com](mailto:john@example.com)";
account.verified = true;

console.log(account.email); // "[john@example.com](mailto:john@example.com)"
console.log(account.verified); // true

// -----------------------------------------------------------------------
// 6. Optional properties in function parameters
// -----------------------------------------------------------------------

// Optional properties are useful when functions accept objects with
// configuration values that callers do not always need to provide.
function createUser(options: { name: string; age?: number }): string {
  if (options.age !== undefined) {
    return `${options.name} (${options.age})`;
  }

  return options.name;
}

console.log(createUser({ name: "John Doe" })); // "John Doe"
console.log(createUser({ name: "Jane Doe", age: 28 })); // "Jane Doe (28)"

// -----------------------------------------------------------------------
// 7. Optional properties vs required properties
// -----------------------------------------------------------------------

// Required properties must always be provided.
let requiredUser: {
  name: string;
  age: number;
} = {
  name: "John Doe",
  age: 30,
};

console.log(requiredUser); // { name: 'John Doe', age: 30 }

// age is required, so it cannot be omitted.
// requiredUser = { name: "John Doe" };
// TS2741: Property 'age' is missing in type ...

// The same property becomes optional when `?` is added.
let optionalUser: {
  name: string;
  age?: number;
} = {
  name: "John Doe",
};

console.log(optionalUser); // { name: 'John Doe' }

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - An optional property is declared by placing `?` after the property name.
// - Optional properties may be present or omitted when creating an object.
// - Accessing an optional property produces a value that may be `undefined`.
// - Optional properties should be checked before using them as their required type.
// - Any object property type can be made optional.
// - Optional properties are useful for configuration objects and flexible function parameters.
