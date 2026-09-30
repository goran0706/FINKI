/**
 * Reference vs. Value
 * ===================
 *
 * JavaScript always copies values when values are assigned or passed to functions.
 * The important distinction is the kind of value being copied: primitive values are
 * copied directly, while object values are references to objects.
 *
 * This distinction explains why changing one variable can affect another, why `===`
 * compares objects by identity, why shallow copies can still share nested objects,
 * and why React state and props should be treated as immutable data.
 */

// ---------------------------------------------------------------------
// 1. Two categories of values
// ---------------------------------------------------------------------

// JavaScript values are either primitives or objects.
// Primitives: string, number, bigint, boolean, undefined, null, symbol.
// Objects:    objects, arrays, functions, dates, maps, sets, and other object values.
//
// A primitive variable contains the primitive value.
// An object variable contains a reference value that identifies the object.
// The variable does not contain the object's properties directly.

// ---------------------------------------------------------------------
// 2. Primitives are copied by value
// ---------------------------------------------------------------------

// Assigning a primitive copies its value.
// Changing the new variable does not affect the original variable.

let originalCount = 10;
let copiedCount = originalCount; // copies the value `10`

copiedCount = 20;

console.log(originalCount); // 10 - unchanged
console.log(copiedCount); // 20

// Primitive values are immutable: they cannot be changed in place.
// An operation that appears to modify a primitive instead produces another value.

let greeting = "hello";
const shouted = greeting.toUpperCase();

console.log(greeting); // "hello" - the original string is unchanged
console.log(shouted); // "HELLO" - a new string value

// ---------------------------------------------------------------------
// 3. Object values contain references
// ---------------------------------------------------------------------

// Assigning an object copies its reference value, not the object itself.
// Both variables therefore refer to the same object.

const original = { name: "Ada" };
const alias = original; // copies the reference value

alias.name = "Grace"; // mutates the shared object

console.log(original.name); // "Grace" - visible through both variables
console.log(alias.name); // "Grace"
console.log(original === alias); // true - both refer to the same object

// Conceptually:
//
//   original --+
//              +--> { name: "Grace" }
//   alias -----+

// Arrays are objects, so assignment behaves the same way.

const list = [1, 2, 3];
const sameList = list; // copies the reference value

sameList.push(4); // mutates the shared array

console.log(list); // [1, 2, 3, 4]
console.log(list === sameList); // true

// JavaScript always copies the value being assigned.
// For primitives, that value is the primitive itself.
// For objects, that value is a reference to the object.

// ---------------------------------------------------------------------
// 4. Mutation vs. reassignment
// ---------------------------------------------------------------------

// Mutation changes the contents of an existing object.
// Every variable referring to that object observes the mutation.
//
// Reassignment changes which value a variable refers to.
// Other variables are not affected by that reassignment.

let first = { count: 1 };
let second = first; // both variables refer to one object

second.count = 2; // mutation of the shared object
console.log(first.count); // 2 - `first` sees the mutation

second = { count: 3 }; // reassignment to a different object

console.log(first.count); // 2 - `first` still refers to the original object
console.log(second.count); // 3 - `second` refers to the new object
console.log(first === second); // false - different objects

// `const` prevents reassignment of the binding, but it does not make
// the object itself immutable.

const settings = { theme: "light" };

settings.theme = "dark"; // allowed - mutates the object
// settings = {theme: "dark"};             // TypeError - attempts to reassign the binding

// ---------------------------------------------------------------------
// 5. Equality compares object identity
// ---------------------------------------------------------------------

// `===` compares object values by identity.
// Two separately created objects are different objects,
// even when all of their properties contain the same values.

const pointA = { x: 1, y: 2 };
const pointB = { x: 1, y: 2 };
const pointC = pointA;

console.log(pointA === pointB); // false - different objects
console.log(pointA === pointC); // true - same object

// Creating an independent object copy gives the copy its own identity.
// The copy is therefore not `===` to the original.

// ---------------------------------------------------------------------
// 6. Shallow copies vs. deep copies
// ---------------------------------------------------------------------

// A shallow copy creates a new top-level object.
// Primitive properties are copied as values, while nested object properties
// still contain references to the same nested objects.

const user = {
  name: "Ada",
  address: { city: "London" },
};

const shallowCopy = {
  name: user.name, // copies the primitive value
  address: user.address, // copies the nested object's reference
};

console.log(shallowCopy === user); // false - different top-level objects
console.log(shallowCopy.address === user.address); // true - same nested object

shallowCopy.name = "Grace";
console.log(user.name); // "Ada" - top-level primitive is independent

shallowCopy.address.city = "Paris";
console.log(user.address.city); // "Paris" - nested object is still shared

// A deep copy creates independent copies of nested objects as well.
// This example manually creates a new nested object.

const deepCopy = {
  name: user.name,
  address: { city: user.address.city },
};

console.log(deepCopy === user); // false - different top-level objects
console.log(deepCopy.address === user.address); // false - different nested objects

deepCopy.address.city = "Berlin";
console.log(user.address.city); // "Paris" - the original is unaffected

// JavaScript provides built-in ways to create copies.
// Spread syntax and array methods such as `slice()` create shallow copies.
// `structuredClone()` can create deep copies for supported structured-cloneable values.
//
// A copy operation should therefore be chosen according to whether nested
// objects need to remain shared or become independent.

// ---------------------------------------------------------------------
// 7. Passing values to functions
// ---------------------------------------------------------------------

// Function arguments follow the same value-copying rule as assignments.
// A primitive argument copies the primitive value.
// An object argument copies the reference value.

function increment(value) {
  value += 1;
}

let count = 10;

increment(count);

console.log(count); // 10 - the function changed only its local binding

function rename(user) {
  user.name = "Grace";
}

const person = { name: "Ada" };

rename(person);

console.log(person.name); // "Grace" - the function mutated the shared object

// The function receives its own parameter binding.
// For an object argument, that binding contains a copy of the reference value.

// ---------------------------------------------------------------------
// 8. Why this matters in React
// ---------------------------------------------------------------------

// State should be treated as read-only data.
// Mutating an object or array held in state preserves its reference.
// If that same reference is supplied as the new state, React can treat the
// state as unchanged according to its Object.is-based state comparison.
//
// Create a new object or array when updating state instead of mutating
// the existing state value.

const currentUser = {
  name: "Ada",
  age: 30,
};

// Mutation keeps the same reference.
currentUser.age = 31;

console.log(currentUser); // {name: "Ada", age: 31}

// An immutable-style update creates a new object.
const updatedUser = {
  ...currentUser,
  age: 32,
};

console.log(updatedUser === currentUser); // false - different object identity

// If a prop contains an object or array, the component receives the same
// reference value. Mutating that value therefore mutates the object owned
// by the code that originally created it.
//
// Object and array literals created during a component render also produce
// new object identities on each render. Reference-based comparisons such as
// dependency comparison and `React.memo` can therefore observe them as different.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JavaScript always copies values; primitive values are copied directly, while object values are references.
// - Primitive values are immutable, so changing one primitive variable does not affect another.
// - Assigning an object copies its reference value, so both variables can refer to the same object.
// - Mutation changes an existing object; reassignment changes which value a variable refers to.
// - `const` prevents reassignment of a binding but does not make the referenced object immutable.
// - `===` compares objects by identity, so separately created objects are not equal even when their contents match.
// - A shallow copy creates a new top-level object but can share nested objects; a deep copy creates independent nested objects.
// - Function arguments follow the same value-copying rules as assignments.
// - React state and props should be treated as immutable data, with new objects or arrays created for updates.
