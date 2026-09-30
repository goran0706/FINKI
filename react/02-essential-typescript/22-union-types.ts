/**
 * Union Types
 * ===========
 *
 * A union type allows a value to be one of several possible types. Union types
 * are created with the `|` operator and are useful when a value can legitimately
 * have different forms.
 */

// -----------------------------------------------------------------------
// 1. Defining union types
// -----------------------------------------------------------------------

// A union type allows a value to be either a string or a number.
let value: string | number = "Hello";

console.log(value); // "Hello"

value = 100;

console.log(value); // 100

// Only values matching one of the union members are allowed.
// value = true; // TS2322: Type 'boolean' is not assignable to type 'string | number'.

// -----------------------------------------------------------------------
// 2. Union types with variables
// -----------------------------------------------------------------------

// Union types can be used for variables whose values may have different types.
let id: string | number = 101;

console.log(id); // 101

id = "user-101";

console.log(id); // "user-101"

// -----------------------------------------------------------------------
// 3. Union types with function parameters
// -----------------------------------------------------------------------

// Function parameters can accept values of multiple types.
function printValue(value: string | number): void {
  console.log(value);
}

printValue("Hello"); // "Hello"
printValue(100); // 100

// The argument must match at least one member of the union.
// printValue(true); // TS2345: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.

// -----------------------------------------------------------------------
// 4. Union types with return values
// -----------------------------------------------------------------------

// A function can return values of different types.
function getId(useString: boolean): string | number {
  if (useString) {
    return "user-101";
  }

  return 101;
}

console.log(getId(true)); // "user-101"
console.log(getId(false)); // 101

// -----------------------------------------------------------------------
// 5. Union types with object properties
// -----------------------------------------------------------------------

// Object properties can also use union types.
type Product = {
  id: number | string;
  name: string;
};

const product1: Product = {
  id: 101,
  name: "Keyboard",
};

const product2: Product = {
  id: "product-101",
  name: "Mouse",
};

console.log(product1.id); // 101
console.log(product2.id); // "product-101"

// -----------------------------------------------------------------------
// 6. Literal union types
// -----------------------------------------------------------------------

// A union can contain specific literal values instead of broad types.
let status: "pending" | "success" | "error" = "pending";

console.log(status); // "pending"

status = "success";

console.log(status); // "success"

// Only the specified literal values are allowed.
// status = "loading"; // TS2322: Type '"loading"' is not assignable to type '"pending" | "success" | "error"'.

// -----------------------------------------------------------------------
// 7. Union types with arrays
// -----------------------------------------------------------------------

// A union can describe an array whose elements can have multiple types.
let values: (string | number)[] = ["John", 30, "Jane", 28];

console.log(values); // [ 'John', 30, 'Jane', 28 ]

values.push(42);
values.push("Mark");

console.log(values); // [ 'John', 30, 'Jane', 28, 42, 'Mark' ]

// Every array element must match one of the union members.
// values.push(true); // TS2345: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.

// -----------------------------------------------------------------------
// 8. Narrowing union types
// -----------------------------------------------------------------------

// TypeScript narrows a union after checking which type the value contains.
function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return value.toFixed(2);
}

console.log(formatValue("hello")); // "HELLO"
console.log(formatValue(10)); // "10.00"

// Inside each branch, TypeScript knows the narrowed type.

// -----------------------------------------------------------------------
// 9. Union types with null
// -----------------------------------------------------------------------

// A union can explicitly allow a value to be null.
let selectedUser: string | null = "John Doe";

console.log(selectedUser); // "John Doe"

selectedUser = null;

console.log(selectedUser); // null

// A null check narrows the value back to string.
if (selectedUser !== null) {
  console.log(selectedUser.toUpperCase());
}

// -----------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------
// - A union type allows a value to have one of several possible types.
// - Union types are created with the `|` operator.
// - Union types can be used with variables, parameters, return values, properties, and arrays.
// - Literal unions restrict a value to a specific set of allowed values.
// - TypeScript narrows union types through checks such as `typeof` and `null` checks.
// - Union types are useful when multiple valid forms of a value need to be represented.
