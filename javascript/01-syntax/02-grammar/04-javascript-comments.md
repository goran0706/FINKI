# Comments

* **Comments:** Non-executable annotations stripped during tokenization.
    * *Single-line:* Denoted by `//`, ignoring all following text on that line.
    * *Multi-line:* Block containers bounded by `/*` and `*/`.
    * *JSDoc:* Informational blocks bounded by `/**` and `*/` containing specific annotations (`@param`, `@returns`)
      processed by tooling for static type checks.

```javascript
// This is a single line comment
var count = 0; // you can also add comments after code, not before


/*
    This is a multiline comment.
        The comment is on multiple lines.
            This is the third line of the comment.
 */
var /* decleare count */ count = /* assign value to count */ 0;


/**
 * Calculates the sum of two numbers.
 *
 * @param {number} [a=0] The first number.
 * @param {number} [b=0] The second number.
 * @returns {number} The sum of `a` and `b`.
 */
function sum(a, b) {
    return a + b;
}
```
