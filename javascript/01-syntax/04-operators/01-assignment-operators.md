## Assignment Operators

## Overview

Assignment operators store values into variables, object properties, or other valid assignment targets. JavaScript
assignment is an expression, not only a statement. The assignment operation evaluates the right-hand expression, stores
the resulting value into the target, and produces the assigned value as the result of the expression. Assignment
behavior differs depending on the assigned value type. Primitive values are copied by value, while objects, arrays, and
functions are copied by reference.

## Assignment Operator (`=`)

**Assignment Operator (`=`):** Assigns the evaluated result of the right-hand expression to the left-hand assignment
target. The target must be a valid reference, such as a variable binding, object property, array element, or
destructuring pattern. The assignment operation returns the assigned value, allowing assignments to participate inside
larger expressions.

| Operator | Description                                                       |
|:---------|:------------------------------------------------------------------|
| `=`      | Assigns the right-hand expression result to the left-hand target. |

## Compound Assignment Operators

**Compound Assignment Operators:** Operators that combine an operation with assignment. They evaluate the existing value
of the target, apply the operation, and assign the resulting value back to the same target. Compound assignment
evaluates the left-hand reference only once. This differs from manually writing the equivalent expression multiple
times, where repeated property access or function evaluation could produce different results.

| Category   | Operators                               |
|:-----------|:----------------------------------------|
| Arithmetic | `+=`, `-=`, `*=`, `/=`, `%=`, `**=`     |
| Bitwise    | `&=`, `\|=`, `^=`, `<<=`, `>>=`, `>>>=` |
| Logical    | `&&=`, `\|\|=`, `??=`                   |

## Arithmetic Assignment

**Arithmetic Assignment Operators:** Apply a mathematical operation using the current target value and assign the result
back to the target. The `+=` operator has special behavior because it also performs string concatenation when string
conversion occurs.

| Operator | Operation                 |
|:---------|:--------------------------|
| `+=`     | Addition assignment       |
| `-=`     | Subtraction assignment    |
| `*=`     | Multiplication assignment |
| `/=`     | Division assignment       |
| `%=`     | Remainder assignment      |
| `**=`    | Exponentiation assignment |

## Bitwise Assignment

**Bitwise Assignment Operators:** Apply bitwise operations to the current value and store the resulting 32-bit integer
conversion back into the target. Bitwise assignment operators convert numeric values to signed 32-bit integers during
evaluation. They should not be used when preserving full JavaScript `Number` precision is required.

| Operator | Operation                       |
|:---------|:--------------------------------|
| `&=`     | Bitwise AND assignment          |
| `\|=`    | Bitwise OR assignment           |
| `^=`     | Bitwise XOR assignment          |
| `<<=`    | Left shift assignment           |
| `>>=`    | Signed right shift assignment   |
| `>>>=`   | Unsigned right shift assignment |

## Logical Assignment

**Logical Assignment Operators:** Combine logical evaluation with assignment while using short-circuit behavior. The
right-hand expression is evaluated only when the logical condition requires assignment. The difference between these
operators is the condition used to determine whether assignment occurs.

| Operator | Behavior                                                      |
|:---------|:--------------------------------------------------------------|
| `&&=`    | Assigns only when the current value is truthy.                |
| `\|\|=`  | Assigns only when the current value is falsy.                 |
| `??=`    | Assigns only when the current value is `null` or `undefined`. |

| Operator | Assignment Condition      |
|:---------|:--------------------------|
| `&&=`    | Existing value is truthy  |
| `\|\|=`  | Existing value is falsy   |
| `??=`    | Existing value is nullish |

The behavioral difference between `||=` and `??=` is significant. `||=` treats all falsy values as missing, including
`false`, `0`, `NaN`, and `""`. `??=` only treats `null` and `undefined` as missing values.

## Destructuring Assignment

**Destructuring Assignment:** A syntax form that extracts values from iterable objects or properties from objects and
assigns them to multiple targets in a single assignment operation. Destructuring assignment follows normal assignment
semantics after extracting the values. Default values are applied only when the extracted value is `undefined`, not when
it is `null`.

## Primitive Assignment

**Primitive Value Assignment:** Assigning a primitive value creates an independent copy of the value. Changing one
variable does not modify another variable containing the same primitive value.

Primitive values include:

| Type        |
|:------------|
| `undefined` |
| `null`      |
| Boolean     |
| Number      |
| BigInt      |
| String      |
| Symbol      |

## Object Reference Assignment

**Object Reference Assignment:** Assigning an object does not duplicate the object. JavaScript assigns the object
reference, causing multiple variables or properties to point to the same object identity. Mutation through one reference
affects all references pointing to the same object. Assignment and copying are separate operations. Creating a new
object requires an explicit copying mechanism such as structured cloning or shallow copying techniques.

This behavior applies to:

- Objects.
- Arrays.
- Functions.
- Other reference types.

## Assignment and Mutation

* **Mutation:** Changes the internal state of an existing object while keeping the same object identity.
* **Reassignment:** Changes which value a variable binding references.

These operations have different effects in application architecture. Mutation affects all references sharing the same
object, whereas reassignment only changes the binding being reassigned.

## Best Practices

* **Understand Value vs. Reference Assignment:** Primitive values are copied by value, while objects, arrays, functions,
  and other reference types are assigned by reference. Modifying a shared object through one reference affects every
  variable pointing to that same object.
* **Avoid Assuming Assignment Creates Copies:** Assignment never duplicates an object. When independent object state is
  required, explicitly create a copy using an appropriate cloning strategy (such as shallow copying or structured
  cloning).
* **Distinguish Reassignment from Mutation:** Reassigning a variable changes the value its binding references. Mutating
  an object changes the contents of the existing object without changing the binding. These operations have very
  different effects when multiple references share the same object.
* **Use `??=` When Initializing Optional Values:** `??=` preserves valid falsy values such as `0`, `false`, and empty
  strings because it assigns only when the existing value is `null` or `undefined`.
* **Avoid Using `||=` When Falsy Values Are Valid:** `||=` treats every falsy value (`0`, `false`, `""`, `NaN`, `null`,
  and `undefined`) as missing. Use it only when every falsy value truly represents the absence of meaningful data.
* **Prefer Compound Assignment for Simple State Updates:** Operators such as `+=`, `-=`, and `*=` clearly communicate
  that an existing value is being updated while ensuring the left-hand assignment target is evaluated only once.
* **Avoid Overly Complex Assignment Expressions:** Although assignment is an expression and may legally appear inside
  larger expressions, deeply nested or chained assignments reduce readability and make debugging more difficult.
* **Use Destructuring for Structured Data:** Destructuring assignment improves readability when extracting multiple
  values from arrays or objects, especially when working with function parameters, API responses, or configuration
  objects.
* **Keep Assignments Explicit:** Avoid combining multiple unrelated assignments into a single statement. Clear, isolated
  assignments make execution order easier to understand and maintain.