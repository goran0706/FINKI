/**
 * var, let, const
 * ===============
 *
 * JavaScript provides three variable declaration keywords: `var`, `let`, and `const`.
 * They differ in scope, initialization behavior, redeclaration rules, and reassignment rules.
 *
 * A variable is a named reference to a value stored in memory.
 * A declaration creates the variable binding in the current scope, while an assignment gives
 * that binding a value.
 */

// ---------------------------------------------------------------------
// 1. Scope: function-scoped vs. block-scoped
// ---------------------------------------------------------------------

// `var` is function-scoped: its binding is visible throughout the nearest
// enclosing function, including outside nested blocks such as `if` or `for`.
function checkVarScope() {
  if (true) {
    var functionScoped = "visible outside this block";
  }

  console.log(functionScoped); // "visible outside this block"
}

checkVarScope();

// `let` and `const` are block-scoped: their bindings are visible only within
// the nearest enclosing block, such as an `if`, `for`, or function body.
function checkLetScope() {
  if (true) {
    let blockScoped = "visible only inside this block";
    console.log(blockScoped); // "visible only inside this block"
  }

  // console.log(blockScoped); // ReferenceError: blockScoped is not defined
}

checkLetScope();

// ---------------------------------------------------------------------
// 2. Hoisting and the Temporal Dead Zone (TDZ)
// ---------------------------------------------------------------------

// All three declarations are processed when their scope is created.
// What differs is whether the binding is initialized before execution reaches
// the declaration and what happens when the binding is accessed beforehand.

// `var` is initialized to `undefined` before execution reaches its declaration.
console.log(hoistedVar); // undefined
var hoistedVar = "assigned later";
console.log(hoistedVar); // "assigned later"

// `let` and `const` are not initialized before execution reaches their declarations.
// Accessing either binding during this period throws a ReferenceError.
// This period is called the Temporal Dead Zone (TDZ).

// console.log(hoistedLet); // ReferenceError: Cannot access 'hoistedLet' before initialization
let hoistedLet = "initialized here";
console.log(hoistedLet); // "initialized here"

// console.log(hoistedConst); // ReferenceError: Cannot access 'hoistedConst' before initialization
const hoistedConst = "initialized here";
console.log(hoistedConst); // "initialized here"

// ---------------------------------------------------------------------
// 3. Redeclaration
// ---------------------------------------------------------------------

// `var` allows the same binding to be declared more than once in the same scope.
var redeclared = 1;
var redeclared = 2;

console.log(redeclared); // 2

// `let` and `const` do not allow redeclaration of the same binding in the same scope.
let notRedeclared = 1;
// let notRedeclared = 2; // SyntaxError: Identifier 'notRedeclared' has already been declared

const alsoNotRedeclared = 1;
// const alsoNotRedeclared = 2; // SyntaxError: Identifier 'alsoNotRedeclared' has already been declared

// ---------------------------------------------------------------------
// 4. Reassignment
// ---------------------------------------------------------------------

// `var` and `let` bindings can be reassigned after declaration.
var reassignableVar = 1;
reassignableVar = 2;

let reassignableLet = 1;
reassignableLet = 2;

console.log(reassignableVar, reassignableLet); // 2 2

// `const` bindings cannot be reassigned after initialization.
const fixedConst = 1;
// fixedConst = 2; // TypeError: Assignment to constant variable.

// `const` declarations must be initialized when they are declared.
// const missingInit; // SyntaxError: Missing initializer in const declaration

// `const` prevents reassignment of the binding, not mutation of the referenced value.
const user = { name: "John Doe" };
user.name = "Jane Doe"; // OK - the object can still be mutated

console.log(user.name); // "Jane Doe"

// ---------------------------------------------------------------------
// 5. Attachment to the global object
// ---------------------------------------------------------------------

// In a browser's classic script at the top level, `var` creates a property
// on the global object. Top-level `let` and `const` do not.
// This does not apply to ES modules, where top-level bindings are module-scoped.
var globalVar = "on the global object";
let globalLet = "not on the global object";
const globalConst = "also not on the global object";

console.log(typeof window !== "undefined" && window.globalVar); // "on the global object"
console.log(typeof window !== "undefined" && window.globalLet); // false
console.log(typeof window !== "undefined" && window.globalConst); // false

// ---------------------------------------------------------------------
// 6. The classic `var` loop behavior
// ---------------------------------------------------------------------

// `var` creates one function-scoped binding for the loop variable.
// Every callback therefore closes over the SAME `i` binding.
function logWithVar() {
  const callbacks = [];

  for (var i = 0; i < 3; i++) {
    callbacks.push(() => console.log(i));
  }

  console.log(i); // 3 - the same `i` is still accessible

  callbacks.forEach((callback) => callback()); // 3, 3, 3
}

logWithVar();

// `let` creates a separate per-iteration binding for a `for` loop.
// Each callback therefore closes over that iteration's value of `i`.
function logWithLet() {
  const callbacks = [];

  for (let i = 0; i < 3; i++) {
    callbacks.push(() => console.log(i));
  }

  // console.log(i); // ReferenceError: i is not defined

  callbacks.forEach((callback) => callback()); // 0, 1, 2
}

logWithLet();

// ---------------------------------------------------------------------
// 7. Choosing between them
// ---------------------------------------------------------------------

// Prefer `const` when the binding does not need to be reassigned.
// Use `let` when the binding must be reassigned during the program's execution.
// Avoid `var` in modern JavaScript because its function scope and redeclaration
// behavior can make bindings harder to reason about.

const person = { name: "John Doe", age: 30 };
let retryCount = 0;
retryCount = retryCount + 1;

console.log(person.name, retryCount); // "John Doe" 1

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `var` is function-scoped, initialized to `undefined`, redeclarable, and reassignable.
// - `let` is block-scoped, remains uninitialized in the TDZ, and is reassignable but not redeclarable.
// - `const` is block-scoped, remains uninitialized in the TDZ, and must be initialized at declaration.
// - `const` prevents reassignment of its binding, but objects and arrays referenced by that binding can still be mutated.
// - In a browser's classic top-level script, `var` creates a property on the global object; `let` and `const` do not.
