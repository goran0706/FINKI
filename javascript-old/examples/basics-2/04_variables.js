/* -------------------------------------------------------------------------- */
/*             Variable is a data storage. Containers for some values.        */
/* -------------------------------------------------------------------------- */
// * variable_name --> {required} The name of the variable, used when calling it.
// * = --> {optional} Assignment, defining the variable, giving it a value.
// * value --> {required when using assignment (=)} The value of the variable (default: undefined)

/*
  Variables

  Variables are data storage or data containers.
  Variables have unique names called identifiers.
  Variables can be declared using:

  nothing:
  - global scope when declared in global scope
  - function scope when declared inside a function
  - re-declarable
  - re-assignable
  - subject to hoisting
  - not a subject to the TDZ
  - creates a property on the global object

  var:
  - global scope when declared in global scope
  - function scope when declared inside a function
  - re-declarable
  - re-assignable
  - subject to hoisting
  - not a subject to the TDZ
  - creates a property on the global object

  let:
  - block scoped
  - not re-declarable
  - re-assignable
  - not subject to hoisting
  - subject to the TDZ
  - does not create a property on the global object

  const:
  - block scoped
  - not re-declarable
  - not re-assignable
  - not subject to hoisting
  - subject to the TDZ
  - does not create a property on the global object
  - must be initialized when declared

  Naming variables:
  - camelCase
  - only letters and digits
  - starting with $ is allowed
  - string with _ is allowed
  - keywords are not allowed
  - starting with digits is not allowed
  - special characters are not allowed

  Casing:
  JavaScript is case sensitive.

  camelCase ✅
  PascalCase ✅
  CAPITAL_SNAKE_CASE ✅
  snake_case ❌
  kebab-case ❌
*/

const variable = "This is a string value";
const num = 19;
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const obj = { num: 1 };

{
  /* Declaration and initialization */

  var foo; // variable declaration
  foo = 10; // variable initialization
  var foo = 10; // variable declaration and initialization

  // multiple variable declaration inline
  var num1, num2, num3;

  // multiple variable declaration and initialization inline
  var num1 = 1,
    num2 = 2,
    num3 = 3;

  var number1,
    number2,
    number3 = 1000;

  // Data storage which can be re-declared and re-assigned
  car = "AUDI";
  car = "BMW";
  car = "Mercedes-Benz";

  // Data storage which can be re-declared and re-assigned
  var car = "AUDI";
  var car = "BMW";
  var car = "Mercedes-Benz";

  // Data storage which can be re-assigned
  let car1 = "AUDI";
  car1 = "BMW";
  car1 = "Mercedes-Benz";

  // Data storage which cannot be re-assigned
  const car2 = "AUDI"; // car2 = "BMW"; TypeError: Assignment to constant variable.

  // Data storage which cannot be re-assigned useful to define constant values
  const NUMBER_PI = 3.14;
}

{
  /* Casing */

  var userName = "John"; /* camelCase ✅ */
  var UserName = "John"; /* PascalCase ✅ */
  var NUMBER_PI = 3.14; /* CAPITAL_SNAKE_CASE ✅ */
  var user_name = "John"; /* snake_case ❌ */
  // var user-name = "John"; /* kebab-case ❌ */
}

{
  /* Naming */

  var userLoggedIn; // ❌
  var isUserLoggedIn; // ✅

  var access; // ❌
  var hasAccess; // ✅

  var play; // ❌
  var canPlay; // ✅

  var provideAddress; // ❌
  var shouldProvideAddress; // ✅

  var isNotAllowed; // 😠
  isNotAllowed = true;
  isNotAllowed = false; // 😠

  var isAllowed; // 😇
  isAllowed = true;
  isAllowed = false; // 😇
}

{
  /* Temporal Dead Zone */

  // var is hoisted to top therefore is not a subject to the temporal dead zone
  console.log(greet); // undefined
  var greet = "Hello";

  // block scoped variables are subject to the temporal dead zone
  console.log(number); // Uncaught ReferenceError: number is not defined at <anonymous>
  const number = 10;

  console.log(greet); // undefined - var is hoisted to top therefore is not a subject to the temporal dead zone
  var greet = "Hello";

  console.log(number1); // Uncaught ReferenceError: number is not defined at <anonymous>
  let number1 = 10;

  console.log(number2); // Uncaught ReferenceError: number is not defined at <anonymous>
  const number2 = 10;

  console.log(number3); // Uncaught ReferenceError: number is not defined at <anonymous>
  number3 = 10;
}

/*
  Shadowed variables

  In computer programming, variable shadowing occurs when a variable declared within a certain scope (decision block, method, or inner class) has the same name
  as a variable declared in an outer scope. At the level of identifiers (names, rather than variables), this is known as name masking.
  This outer variable is said to be shadowed by the inner variable, while the inner identifier is said to mask the outer identifier.
  This can lead to confusion, as it may be unclear which variable subsequent uses of the shadowed variable name refer to, which depends on the name resolution rules
  of the language.
*/

{
  /* Shadowed variables and Variable masking */

  var count = 0; // this outer variable is said to be shadowed by the inner variable

  function incrementCount() {
    var count = 0; // the inner identifier is said to mask the outer identifier.
    return function () {
      return count++;
    };
  }
}

{
  /* Scope */

  // Scope is WHEN and WHERE VARIABLES and FUNCTIONS are visible to other JavaScript code.
  // - global scope -visible anywhere, to any code block
  // - local scope - visible only inside the function
  // - block scope - visible only inside the code block

  number = 10; // global scope, creates property on global object

  var number1 = 10; // global scope, creates property on the global object

  let number2 = 10; // block scope

  const number3 = 10; // block scope

  function foo() {
    var number4 = 10; // function scope

    for (i = 0; i < 1; i++) {
      // function scope, creates property on global object
      console.log("i accessible inside loop", i);
    }
    console.log("i accessible outside loop", i);

    // function scope
    for (var j = 0; j < 1; j++) {
      console.log("j accessible inside loop", j);
    }
    console.log("j accessible outside loop", j);

    // block scope
    for (let k = 0; k < 1; k++) {
      console.log("k accessible inside loop", k);
    }

    // block scope
    for (const l = 0; l < 1; l++) {
      console.log("l accessible inside loop", l);
    }
  }

  /* Scope Chain due to Closures */
  function scopeChain() {
    var number1 = 10;
    return function () {
      var number2 = 10;
      return function () {
        var number3 = 10;
        return function () {
          number1 + number2 + number3;
        };
      };
    };
  }

  const scopeChain = () => {
    var a = 10;
    return () => {
      var b = 10;
      return () => {
        var c = 10;
        return () => {
          a + b + c;
        };
      };
    };
  };
}
