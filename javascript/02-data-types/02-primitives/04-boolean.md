# Boolean Operational Logic

* **Boolean Values:** Explicit logical state markers containing exclusively the exact primitive constants `true` or
  `false`.


* **Truthy Values:** Any value evaluated within a logical or boolean comparison pipeline that does not explicitly match
  one of the predefined language falsy markers. All objects, arrays, empty functions, and non-empty strings are
  inherently truthy.


* **Falsy Values:** The absolute set of values that automatically resolve to a boolean status of `false` when evaluated
  inside a conditional structure. There are exactly eight falsy values in JavaScript:
    1. `false` (Logical primitive)
    2. `0` (Numeric zero)
    3. `-0` (Signed numeric zero)
    4. `0n` (BigInt zero representation)
    5. `""` (Empty string literal)
    6. `null` (Absent reference)
    7. `undefined` (Uninitialized binding)
    8. `NaN` (Invalid arithmetic result)

## Boolean Operational Logic Examples

```javascript
// 1. Boolean Primitives
let isComplete = true;
let hasError = false;

console.log(typeof isComplete); // "boolean"


// 2. The 8 Falsy Values in JavaScript
// Every item below evaluates to false inside a conditional check (e.g., if/else)
const falsyList = [
    false,
    0,
    -0,
    0n,
    "",
    null,
    undefined,
    NaN
];

falsyList.forEach((val, index) => {
    if (!val) {
        console.log(`Falsy item ${index + 1} correctly triggered the conditional block`);
    }
});


// 3. Truthy Values
// Anything not on the falsy list is truthy, including empty arrays and objects
if ([]) {
    console.log("Empty arrays are truthy!");
}

if ({}) {
    console.log("Empty objects are truthy!");
}

if ("hello") {
    console.log("Non-empty strings are truthy!");
}
```