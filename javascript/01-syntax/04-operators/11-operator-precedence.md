# Operator Precedence

## Overview

Operator precedence defines the order in which JavaScript evaluates operators within a single expression. When an
expression contains multiple operators, JavaScript uses precedence rules to determine which operations execute first.
Precedence affects only the grouping of operators—it does not define the order in which every part of an expression is
evaluated. For instance, because multiplication has higher precedence than addition, the expression `2 + 3 * 4` is
evaluated as `2 + (3 * 4)`, resulting in `14`.

`2 + 3 * 4`

## Precedence Rules

**Higher Precedence Executes First:** Operators with higher precedence bind their operands more strongly than operators
with lower precedence. The following table shows common JavaScript operator precedence from highest to lowest.

| Precedence Level | Operators                                                                   |
|:-----------------|:----------------------------------------------------------------------------|
| Highest          | Member access (`.`), optional chaining (`?.`), function calls (`()`), `new` |
| High             | Exponentiation (`**`)                                                       |
| High             | Unary operators (`!`, `~`, `+`, `-`, `typeof`, `void`, `delete`)            |
| High             | Multiplication (`*`), division (`/`), remainder (`%`)                       |
| Medium           | Addition (`+`), subtraction (`-`)                                           |
| Medium           | Shift operators (`<<`, `>>`, `>>>`)                                         |
| Medium           | Relational operators (`<`, `>`, `<=`, `>=`, `in`, `instanceof`)             |
| Medium           | Equality operators (`==`, `!=`, `===`, `!==`)                               |
| Lower            | Bitwise AND (`&`)                                                           |
| Lower            | Bitwise XOR (`^`)                                                           |
| Lower            | Bitwise OR (`\|`)                                                           |
| Lower            | Logical AND (`&&`)                                                          |
| Lower            | Logical OR (`\|\|`)                                                         |
| Lower            | Nullish coalescing (`??`)                                                   |
| Lower            | Conditional operator (`?:`)                                                 |
| Lower            | Assignment operators (`=`, `+=`, `-=`, `??=`, etc.)                         |
| Lowest           | Comma operator (`,`)                                                        |

## Associativity

**Associativity:** When multiple operators have the same precedence level, associativity determines the evaluation
direction. JavaScript operators are either left-associative or right-associative.

| Type              | Direction                    |
|:------------------|:-----------------------------|
| Left-associative  | Evaluated from left to right |
| Right-associative | Evaluated from right to left |

## Left Associativity

**Left-Associative Operators:** Operators at the same precedence level are grouped from left to right. For example,
`a - b + c` is evaluated as `(a - b) + c`.

`a - b + c`

Common left-associative operators include:

| Operators         |
|:------------------|
| Addition          |
| Subtraction       |
| Multiplication    |
| Division          |
| Remainder         |
| Logical operators |

## Right Associativity

**Right-Associative Operators:** Operators are grouped from right to left. Because each assignment returns the assigned
value, an expression like `a = b = c = 10` is evaluated as `a = (b = (c = 10))`.

`a = b = c = 10`

Common right-associative operators include:

| Operators                   |
|:----------------------------|
| Exponentiation (`**`)       |
| Assignment operators        |
| Conditional operator (`?:`) |

## Parentheses

**Grouping Override:** Parentheses explicitly control evaluation order and override normal precedence rules. They
improve readability even when JavaScript precedence already produces the expected result, and they should be used when
the intended order is not obvious, when multiple operators are combined, or when business logic depends on exact
grouping.

## Evaluation Order vs Precedence

* **Operator Precedence:** Determines how an expression is grouped.
* **Evaluation Order:** Determines when individual operands and subexpressions are evaluated.

These concepts are separate. In an expression like `functionA() + functionB() * functionC()`, precedence dictates that
multiplication groups before addition, but evaluation order still follows JavaScript rules where operands and function
calls execute from left to right.

`functionA() + functionB() * functionC()`

## Short-Circuit Operators

**Short-Circuit Evaluation:** Logical operators and nullish coalescing operators may skip evaluation of the right-hand
operand, directly affecting observable behavior when expressions contain function calls, mutations, or other side
effects.

| Operator | Skips Right Side When    |
|:---------|:-------------------------|
| `&&`     | Left side is falsy       |
| `\|\|`   | Left side is truthy      |
| `??`     | Left side is not nullish |

## Assignment Evaluation

**Assignment Precedence:** Assignment operators have lower precedence than most arithmetic, comparison, and logical
operators, meaning the calculated value is assigned only after operations like addition complete. For example,
`result = a + b` is evaluated as `result = (a + b)`.

`result = a + b`

## Exponentiation Special Case

**Exponentiation Associativity:** The exponentiation operator is right-associative. Therefore, `2 ** 3 ** 2` is
evaluated as `2 ** (3 ** 2)` rather than `(2 ** 3) ** 2`.

`2 ** 3 ** 2`

## Unary and Exponentiation Relationship

**Unary Restriction:** The exponentiation operator has special grammar rules when used alongside unary operators.
Expressions involving unary operators and exponentiation require explicit parentheses to eliminate ambiguity and
communicate the intended operation, such as `-(2 ** 3)`, which evaluates the exponent first.

`-(2 ** 3)`

## Best Practices

* **Use parentheses when expression intent is not immediately obvious:** Relying on complex precedence rules increases
  maintenance risk.
* **Do not confuse precedence with execution order:** Precedence determines grouping, while evaluation order determines
  when expressions execute.
* **Avoid side effects inside complex expressions:** Combining assignments, function calls, and logical operators in one
  expression makes execution behavior harder to reason about.
* **Prefer readable expressions to compressed expressions:** Shorter code is not always clearer code, and explicit
  grouping often improves correctness.
* **Know precedence rules for language fundamentals:** Arithmetic, comparison, logical operators, assignment, and
  short-circuit behavior are common sources of subtle JavaScript bugs.