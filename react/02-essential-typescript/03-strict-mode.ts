/**
 * Strict Mode
 * ===========
 *
 * Strict mode enables a stricter set of JavaScript runtime rules and is
 * activated in TypeScript output when targeting environments that support it.
 */

// ---------------------------------------------------------------------
// 1. Enabling strict mode
// ---------------------------------------------------------------------

"use strict";

// In JavaScript, "use strict" enables strict mode for the current script
// or function scope.

// TypeScript modules are always emitted as strict-mode code by modern
// TypeScript configurations when they are compiled to JavaScript modules.

// ---------------------------------------------------------------------
// 2. Strict mode prevents accidental global variables
// ---------------------------------------------------------------------

"use strict";

// Without strict mode, assigning to an undeclared identifier can create
// a global variable in non-module JavaScript environments.
//
// username = "john"; // ReferenceError in strict mode

let username = "john";

console.log(username); // "john"

// Always declare variables explicitly with let, const, or another
// appropriate declaration.

/**
 * TypeScript catches undeclared identifiers during compilation:
 //
 // username = "john";
 // // Cannot find name 'username'.
 //
 // This means TypeScript's type checker prevents many problems before
 // JavaScript is executed.
 */

// ---------------------------------------------------------------------
// 3. Strict mode prevents accidental writes to read-only properties
// ---------------------------------------------------------------------

("use strict");

const user = {};

Object.defineProperty(user, "id", {
  value: 1,
  writable: false,
});

// user.id = 2;
// TypeError in strict mode because the property is read-only.

console.log(user.id); // 1

// ---------------------------------------------------------------------
// 4. Strict mode prevents deleting non-configurable properties
// ---------------------------------------------------------------------

("use strict");

const settings = {};

Object.defineProperty(settings, "theme", {
  value: "dark",
  configurable: false,
});

// delete settings.theme;
// TypeError in strict mode.

console.log(settings.theme); // "dark"

// ---------------------------------------------------------------------
// 5. Strict mode changes this inside regular functions
// ---------------------------------------------------------------------

("use strict");

function showThis() {
  return this;
}

// In strict-mode JavaScript, a regular function called without an explicit
// receiver gets undefined as its this value.
console.log(showThis()); // undefined

// TypeScript can report an implicit this issue depending on compiler
// configuration, especially with noImplicitThis enabled.

// ---------------------------------------------------------------------
// 6. Arrow functions and this
// ---------------------------------------------------------------------

("use strict");

const userObject = {
  name: "John",

  showName() {
    const getName = () => this.name;
    return getName();
  },
};

console.log(userObject.showName()); // "John"

// Arrow functions do not create their own this value.
// They capture this from the surrounding lexical scope.

// ---------------------------------------------------------------------
// 7. Strict mode and function parameters
// ---------------------------------------------------------------------

("use strict");

// Strict mode does not allow duplicate parameter names.
//
// function sum(value, value) {
//   return value;
// }
//
// SyntaxError in strict mode.

// TypeScript also rejects duplicate parameter declarations.

// ---------------------------------------------------------------------
// 8. Strict mode and octal literals
// ---------------------------------------------------------------------

("use strict");

// Legacy octal literals are not allowed in strict mode.
//
// const value = 010;
// SyntaxError

// Use an explicit representation instead.
const decimalValue = 10;
const octalValue = 0o10;

console.log(decimalValue); // 10
console.log(octalValue); // 8

// ---------------------------------------------------------------------
// 9. Strict mode is different from TypeScript strict checking
// ---------------------------------------------------------------------

// "use strict" is a JavaScript runtime directive.
// TypeScript's "strict" compiler option enables compile-time checks.
//
// tsconfig.json:
//
// {
//   "compilerOptions": {
//     "strict": true
//   }
// }

// These concepts are related but not identical:
//
// "use strict"
// -> JavaScript runtime semantics
//
// "strict": true
// -> TypeScript compiler type-checking configuration

// ---------------------------------------------------------------------
// 10. TypeScript strict compiler option
// ---------------------------------------------------------------------

// TypeScript provides a collection of strict type-checking options.
//
// The most common configuration is:
//
// {
//   "compilerOptions": {
//     "strict": true
//   }
// }

// This enables a family of checks including:
//
// - noImplicitAny
// - strictNullChecks
// - strictFunctionTypes
// - strictBindCallApply
// - strictPropertyInitialization
// - noImplicitThis
// - useUnknownInCatchVariables
// - alwaysStrict

// ---------------------------------------------------------------------
// 11. noImplicitAny
// ---------------------------------------------------------------------

// With strict: true, parameters cannot silently fall back to any.
//
// function greet(name) {
//   return `Hello, ${name}`;
// }
//
// Error:
// Parameter 'name' implicitly has an 'any' type.

// Provide the type explicitly.
function greet(name: string): string {
  return `Hello, ${name}`;
}

console.log(greet("John")); // "Hello, John"

// ---------------------------------------------------------------------
// 12. strictNullChecks
// ---------------------------------------------------------------------

// With strictNullChecks enabled, null and undefined are not assignable
// to ordinary types unless they are explicitly included.

let usernameValue: string = "john";

// usernameValue = null;
// Error when strictNullChecks is enabled.

// Include null explicitly when it is a valid state.
let optionalUsername: string | null = null;

optionalUsername = "john";

console.log(optionalUsername); // "john"

// ---------------------------------------------------------------------
// 13. strictPropertyInitialization
// ---------------------------------------------------------------------

// strictPropertyInitialization requires class properties to be initialized
// when they are declared as required properties.

class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const userInstance = new User("John");

console.log(userInstance.name); // "John"

// A required property that is never initialized can produce a compiler error:
//
// class Product {
//   name: string;
// }
//
// Error:
// Property 'name' has no initializer and is not definitely assigned
// in the constructor.

// ---------------------------------------------------------------------
// 14. noImplicitThis
// ---------------------------------------------------------------------

// With noImplicitThis enabled, TypeScript checks that this has a known type.

const person = {
  name: "John",

  greet() {
    return `Hello, ${this.name}`;
  },
};

console.log(person.greet()); // "Hello, John"

// TypeScript can infer the type of this from the containing object.

/**
 * Explicit this parameters can be used when a function needs a specific
 * this type:
 //
 // function greet(this: User) {
 //   return `Hello, ${this.name}`;
 // }
 //
 // This parameter is used by TypeScript for type checking and is not a
 // normal runtime argument.
 */

// ---------------------------------------------------------------------
// 15. useUnknownInCatchVariables
// ---------------------------------------------------------------------

// With strict checking enabled, catch variables are treated as unknown.

try {
  throw new Error("Something went wrong");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message); // "Something went wrong"
  }
}

// Narrowing unknown before accessing properties makes error handling safer.

// ---------------------------------------------------------------------
// 16. Strict function type checking
// ---------------------------------------------------------------------

type Handler = (value: string) => void;

const handler: Handler = (value) => {
  console.log(value);
};

handler("Hello"); // "Hello"

// Strict function type checking makes assignments between function types
// more precise, especially when parameter types differ.

// ---------------------------------------------------------------------
// 17. alwaysStrict
// ---------------------------------------------------------------------

// TypeScript's alwaysStrict option controls strict-mode parsing and
// emission:
//
// {
//   "compilerOptions": {
//     "alwaysStrict": true
//   }
// }

// When enabled, TypeScript parses each source file in strict mode and
// emits "use strict" where the selected module output requires it.

// Modern TypeScript projects commonly use modules, where strict-mode
// semantics are already part of the JavaScript module environment.

// ---------------------------------------------------------------------
// 18. Modules and strict mode
// ---------------------------------------------------------------------

// This file is a TypeScript module if it contains an import or export.
//
// export const language = "TypeScript";

// ES modules are always strict mode.

// The important distinction is:
//
// JavaScript script:
// -> may require "use strict"
//
// JavaScript module:
// -> strict mode automatically

// ---------------------------------------------------------------------
// 19. TypeScript strictness is primarily compile-time
// ---------------------------------------------------------------------

// TypeScript's strict options improve the correctness of source code
// before it becomes JavaScript.

function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

console.log(calculateTotal(20, 3)); // 60

// calculateTotal("20", 3);
// Error:
// Argument of type 'string' is not assignable to parameter of type 'number'.

// The TypeScript compiler catches the invalid call before runtime.

// ---------------------------------------------------------------------
// 20. Recommended tsconfig configuration
// ---------------------------------------------------------------------

// A typical modern TypeScript project can start with:
//
// {
//   "compilerOptions": {
//     "strict": true
//   }
// }

// Individual strict checks can be configured separately when necessary,
// but disabling strict mode broadly weakens TypeScript's static guarantees.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------

// - "use strict" enables JavaScript strict-mode runtime semantics.
// - Strict mode prevents several legacy and error-prone JavaScript behaviors.
// - TypeScript has a separate "strict" compiler option.
// - "strict": true enables a family of stronger static type checks.
// - noImplicitAny prevents untyped parameters and variables from silently
//   becoming any.
// - strictNullChecks requires null and undefined to be represented explicitly.
// - strictPropertyInitialization checks required class property initialization.
// - noImplicitThis improves type checking for this.
// - useUnknownInCatchVariables makes caught errors safer to handle.
// - alwaysStrict controls strict-mode parsing and emission.
// - JavaScript modules are inherently strict mode.
// - TypeScript strictness is primarily compile-time, while "use strict" affects
//   JavaScript runtime semantics.
// - For modern TypeScript applications, "strict": true is generally the
//   foundation for predictable static type checking.
