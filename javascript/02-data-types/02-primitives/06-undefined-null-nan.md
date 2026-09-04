# Undefined, Null, and NaN Diagnostics

* **Difference Between Undefined and Null:**
    * `undefined` is the structural language baseline default indicating that a variable name has been declared, but has
      not yet been initialized with a value.
    * `null` is an explicit, active assignment indicating that a variable intentionally points to empty reference data.
    * *Equality Testing:* Weak abstract comparison evaluates them as matching (`undefined == null` is `true`), whereas
      strict type comparison isolates them completely (`undefined === null` is `false`).


* **NaN Behavior:** `NaN` has the unique distinction of being completely identity-isolated. It is the only value in
  JavaScript that is completely unequal to itself under any comparison operator, including strict checks (`NaN === NaN`
  evaluates to `false`).


* **Checking NaN:**
    * *Global `isNaN()`:* Casts the argument to a `Number` type before checking, producing false positives by returning
      `true` for non-numeric values that fail conversion (e.g., `isNaN("text") === true`).
    * *Strict `Number.isNaN()`:* Robust, spec-compliant checking tool. It skips type coercion entirely and returns
      `true` if and only if the argument is currently the literal primitive value `NaN`.

## Undefined, Null, and NaN Diagnostics Examples

```javascript
// 1. Undefined vs Null Initialization
let uninitializedVar;
console.log(uninitializedVar);  // undefined

let emptyReference = null;
console.log(emptyReference);    // null

// Equality Testing
console.log(undefined == null);  // true (Weak abstract comparison)
console.log(undefined === null); // false (Strict comparison separates them)


// 2. NaN Identity Isolation
let badMath = 0 / 0;
console.log(badMath === NaN);         // false (NaN is never equal to itself)
console.log(Object.is(badMath, NaN)); // true  (Object.is correctly identifies NaN)


// 3. Global isNaN() vs Strict Number.isNaN()
// Global isNaN forces type coercion, leading to false positives
console.log(isNaN("hello")); // true ("hello" gets coerced to NaN)
console.log(isNaN("123"));   // false ("123" gets coerced to valid number 123)

// Strict Number.isNaN skips coercion entirely
console.log(Number.isNaN("hello")); // false (It is a string, not literal NaN)
console.log(Number.isNaN(0 / 0));   // true  (It is strictly literal NaN)
```