/**
 * Interfaces
 * =================
 *
 * An interface describes the structure of an object by defining its properties
 * and their types. Interfaces are commonly used to describe object contracts
 * that can be implemented and extended.
 */

// -----------------------------------------------------------------------
// 1. Defining interfaces
// -----------------------------------------------------------------------

// An interface is declared with the `interface` keyword.
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John Doe",
  age: 30,
};

console.log(user); // { name: 'John Doe', age: 30 }

// TypeScript checks that the object satisfies the interface.
// const invalidUser: User = { name: "John Doe" };
// TS2741: Property 'age' is missing in type ...

// -----------------------------------------------------------------------
// 2. Optional properties
// -----------------------------------------------------------------------

// Interface properties can be optional by using `?`.
interface Product {
  name: string;
  price: number;
  description?: string;
}

const product: Product = {
  name: "Keyboard",
  price: 99.99,
};

console.log(product); // { name: 'Keyboard', price: 99.99 }

const detailedProduct: Product = {
  name: "Mouse",
  price: 49.99,
  description: "Wireless mouse",
};

console.log(detailedProduct); // { name: 'Mouse', price: 49.99, description: 'Wireless mouse' }

// -----------------------------------------------------------------------
// 3. Readonly properties
// -----------------------------------------------------------------------

// An interface can mark properties as readonly.
interface Configuration {
  readonly environment: string;
  readonly port: number;
}

const configuration: Configuration = {
  environment: "development",
  port: 3000,
};

console.log(configuration.environment); // "development"
console.log(configuration.port); // 3000

// configuration.port = 4000;
// TS2540: Cannot assign to 'port' because it is a read-only property.

// -----------------------------------------------------------------------
// 4. Function properties
// -----------------------------------------------------------------------

// Interfaces can describe function properties.
interface Calculator {
  add: (a: number, b: number) => number;
  multiply: (a: number, b: number) => number;
}

const calculator: Calculator = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
};

console.log(calculator.add(10, 5)); // 15
console.log(calculator.multiply(10, 5)); // 50

// -----------------------------------------------------------------------
// 5. Nested interfaces
// -----------------------------------------------------------------------

// Interfaces can reference other interfaces to describe nested structures.
interface Address {
  city: string;
  country: string;
}

interface Customer {
  name: string;
  address: Address;
}

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

// -----------------------------------------------------------------------
// 6. Extending interfaces
// -----------------------------------------------------------------------

// An interface can extend another interface and inherit its properties.
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

const employee: Employee = {
  name: "John Doe",
  age: 30,
  employeeId: 101,
  department: "Engineering",
};

console.log(employee.name); // "John Doe"
console.log(employee.age); // 30
console.log(employee.employeeId); // 101
console.log(employee.department); // "Engineering"

// Employee must contain both the properties inherited from Person
// and its own properties.

// -----------------------------------------------------------------------
// 7. Interfaces for function parameters
// -----------------------------------------------------------------------

// Interfaces are useful for describing the shape of objects passed to functions.
interface UserProfile {
  name: string;
  age: number;
}

function greetUser(profile: UserProfile): string {
  return `Hello, ${profile.name}!`;
}

const profile: UserProfile = {
  name: "Jane Doe",
  age: 28,
};

console.log(greetUser(profile)); // "Hello, Jane Doe!"

// The function accepts any object that satisfies the UserProfile structure.

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - An interface describes the structure of an object.
// - Interface properties can be required, optional, or readonly.
// - Interfaces can describe nested objects and function properties.
// - An interface can extend another interface and inherit its properties.
// - Interfaces are useful for defining reusable object contracts.
// - Interfaces can be used to type objects passed to functions.
