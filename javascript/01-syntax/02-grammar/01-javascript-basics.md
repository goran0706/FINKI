# JavaScript Syntax Basics

## Case Sensitivity

JavaScript is fully case-sensitive across identifiers, keywords, and property names. `myVar`, `myvar`, and `MyVar` are
three distinct bindings.

```javascript
let value = 1;
let Value = 2;
console.log(value, Value); // 1 2 — different variables
```

## Whitespace & Line Terminators

Spaces, tabs, and line breaks separate tokens but are otherwise insignificant to the parser — except their role in
Automatic Semicolon Insertion.

```javascript
let x = 5;   // identical to: let x = 5;
```

## Identifiers

Names used for variables, functions, and properties. Must start with a letter, `_`, or `$`, followed by letters, digits,
`_`, or `$`. Cannot start with a digit and cannot match a reserved keyword.

```javascript
let _private = 1;
let $element = 2;
let user1 = 3;
// let 1user = 4;   // ❌ SyntaxError — cannot start with a digit
```

## Keywords & Reserved Words

Tokens reserved by the language grammar and unavailable as identifiers (e.g. `let`, `const`, `function`, `return`,
`class`, `if`, `typeof`). Some are only reserved in strict mode (e.g. `implements`, `interface`, `package`).

```javascript
// let class = 5; // ❌ SyntaxError — "class" is a reserved word
```

## Literals

Fixed values written directly into source code, representing a value of a given type without computation.

```javascript
42;             // number literal
"hello";        // string literal
true;           // boolean literal
null;           // null literal
undefined;      // undefined value
{ a: 1 };       // object literal
[1, 2, 3];      // array literal
/ab+c/;         // regular expression literal
```

## Statements

Syntactic units of purpose that command the engine to perform an action. Statements control execution flow, declare
bindings, or loop through data blocks. They do not automatically evaluate to a value.

```javascript
let x = 5;        // declaration statement
if (x > 0) {      // control-flow statement
    console.log("positive");
}
```

## Expressions

Any valid unit of code that resolves to a single value. Expressions can be literals, variable references, operations, or
function evaluations, and they are frequently nested inside statements as data inputs.

```javascript
// Statement vs Expression
let x = 5;        // statement (declaration), "5" is the expression inside it
x + 2;            // expression statement — evaluates to 7 but the value is discarded
```

## Blocks

A pair of curly braces `{ }` grouping zero or more statements into a single compound statement. Blocks introduce their
own scope for `let`/`const` bindings but do not by themselves create a value.

```javascript
{
    let scoped = "only visible inside this block";
    console.log(scoped);
}
// console.log(scoped); // ❌ ReferenceError — out of scope
```

## Semicolons

Syntactic punctuation elements used to explicitly terminate statements, acting as unambiguous boundary lines between
distinct operational commands.

```javascript
let a = 1;
let b = 2; // two statements, one line — semicolons make the boundary explicit
```

## Automatic Semicolon Insertion (ASI)

A built-in parser correction mechanism. If a semicolon is missing where a statement boundary is grammatically required,
the parser automatically inserts one if it encounters a newline character, a closing brace `}`, or the end of the
program script.

* *Restricted Productions:* Semicolons are inserted automatically immediately after keywords like `return`, `throw`,
  `break`, `continue`, or `yield` if followed by a newline, which can completely alter code behavior by returning
  `undefined` prematurely.

```javascript
// ASI pitfall
function getValue() {
    return { value: 42 };
}

console.log(getValue()); // undefined — ASI inserted a semicolon after "return"
```
