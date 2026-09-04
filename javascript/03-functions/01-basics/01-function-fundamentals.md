# Function Fundamentals

## What Is a Function

**Function:** A reusable block of executable code designed to perform a specific operation when invoked. Functions allow
code to be grouped into independent units that can receive input values, perform operations, and optionally produce
output values. Functions are objects in JavaScript, which means they can be assigned to variables, stored in data
structures, passed as arguments, and returned from other functions.

A function consists of:

| Component     | Description                                     |
|:--------------|:------------------------------------------------|
| Function name | Identifier used to reference the function       |
| Parameters    | Named input variables received during execution |
| Function body | Statements executed when the function runs      |
| Return value  | Optional result produced after execution        |

## Function Declaration

**Function Declaration:** A function created using the `function` keyword followed by an identifier. Function
declarations are processed during the creation phase of the execution context, which allows them to be invoked before
their position in the source code through a behavior known as function hoisting, creating named functions that can be
referenced throughout their accessible scope.

## Function Definition

**Function Definition:** The complete creation of a function, including its name, parameters, and executable body. A
function definition describes what the function does but does not execute it, since execution occurs only when the
function is invoked, maintaining a clear separation between the definition phase where the function object is created
and the execution phase where the function body runs.

| Phase      | Behavior                   |
|:-----------|:---------------------------|
| Definition | Function object is created |
| Invocation | Function body is executed  |

## Function Expression

**Function Expression:** A function created as part of an expression and usually assigned to a variable. Unlike function
declarations, function expressions are evaluated during runtime when execution reaches the expression, and they can be
created as either named function expressions with an internal name or anonymous function expressions with no identifier,
where the storing variable determines how the function can be accessed.

| Type                          | Description                   |
|:------------------------------|:------------------------------|
| Named function expression     | Function has an internal name |
| Anonymous function expression | Function has no identifier    |

## Function Declaration vs Function Expression

Function declarations and function expressions differ in syntax position, hoisting behavior, name requirements, and
creation timing, where function declarations are commonly used for reusable named operations while expressions are often
used when functions are treated as values.

| Feature           | Function Declaration       | Function Expression  |
|:------------------|:---------------------------|:---------------------|
| Syntax position   | Statement                  | Expression           |
| Hoisting behavior | Fully hoisted              | Variable rules apply |
| Name required     | Yes                        | Optional             |
| Creation timing   | Execution context creation | Runtime evaluation   |

## Anonymous Functions

**Anonymous Function:** A function without an identifier. Anonymous functions are commonly used when a function is
created only for immediate use, such as providing temporary behavior as callback functions, storing functions as values
in function expressions, or creating functions dynamically through higher-order functions, though they cannot reference
themselves by name unless assigned through another mechanism.

| Scenario               | Purpose                      |
|:-----------------------|:-----------------------------|
| Callback functions     | Provide temporary behavior   |
| Function expressions   | Store functions as values    |
| Higher-order functions | Create functions dynamically |

## Arrow Functions

**Arrow Function:** A shorter function syntax introduced in ECMAScript 2015 that provides a concise way to create
function expressions. Arrow functions do not have their own `this` binding or `arguments` object, capturing `this` from
the surrounding lexical scope instead, which makes them commonly used for callbacks and short operations where lexical
context behavior is desired rather than traditional constructor usage.

| Behavior               | Traditional Function | Arrow Function |
|:-----------------------|:---------------------|:---------------|
| Own `this` binding     | Yes                  | No             |
| Constructor usage      | Possible             | Not possible   |
| Own `arguments` object | Yes                  | No             |
| Concise syntax         | No                   | Yes            |

## Function Creation and Execution

**Function Creation:** The process where JavaScript creates a function object from a function definition without
executing its body, leaving execution to occur only after invocation. This separation between creation and execution
allows functions to be stored in variables or properties, passed as arguments, produced by other functions, and delayed
until required.

| Capability | Description                         |
|:-----------|:------------------------------------|
| Stored     | Assigned to variables or properties |
| Passed     | Used as arguments                   |
| Returned   | Produced by other functions         |
| Delayed    | Executed later when required        |

## Best Practices

* **Use function declarations for reusable named operations:** They provide clear naming and are suitable for functions
  that represent a defined operation.
* **Use function expressions when functions are treated as values:** Expressions are appropriate when assigning
  functions to variables, properties, or passing them dynamically.
* **Use descriptive function names:** Names should describe the operation performed rather than the implementation
  details.
* **Avoid unnecessary anonymous functions:** When a function has complex logic or is reused, giving it a name improves
  debugging and readability.
* **Use arrow functions when lexical `this` behavior is required:** Arrow functions are not interchangeable with regular
  functions because their context behavior differs.