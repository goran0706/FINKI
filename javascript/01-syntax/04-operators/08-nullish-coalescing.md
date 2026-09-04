# Nullish Coalescing Operator (`??`)

## Overview

The nullish coalescing operator (`??`) provides a fallback value when the left-hand operand is `null` or `undefined`.
Unlike the logical OR operator (`||`), nullish coalescing does not use general truthiness evaluation. It only treats the
two nullish values as absent. The operator is designed for situations where values such as `0`, `false`, or an empty
string represent valid data and must not be replaced.

| Operator | Missing Value Condition     |
|:---------|:----------------------------|
| `\|\|`   | Any falsy value             |
| `??`     | Only `null` and `undefined` |

## Nullish Coalescing Behavior

**Nullish Coalescing Operator (`??`):** Evaluates the left-hand operand and returns it unless it is `null` or
`undefined`. When the left-hand operand is nullish, the right-hand operand is evaluated and returned. The operator
performs no Boolean conversion and does not check for general falsiness.

| Left Operand          | Result                |
|:----------------------|:----------------------|
| Any non-nullish value | Returns left operand  |
| `null`                | Returns right operand |
| `undefined`           | Returns right operand |

```javascript
console.log(10 ?? 100);         // 10
console.log(false ?? true);     // false
console.log(0 ?? 100);          // 0
console.log(null ?? 100);       // 100
console.log(undefined ?? 100);  // 100
```

## Difference Between `??` and `||`

**Logical OR Fallback (`||`):** Determines fallback behavior based on truthiness. If the left-hand operand is any falsy
value, the right-hand operand is evaluated and returned.

**Nullish Fallback (`??`):** Determines fallback behavior based only on nullish checking. The right-hand operand is
evaluated only when the left-hand operand is `null` or `undefined`.

| Value       | `value \|\| fallback` | `value ?? fallback` |
|:------------|:----------------------|:--------------------|
| `false`     | Uses fallback         | Keeps `false`       |
| `0`         | Uses fallback         | Keeps `0`           |
| `-0`        | Uses fallback         | Keeps `-0`          |
| `""`        | Uses fallback         | Keeps `""`          |
| `NaN`       | Uses fallback         | Keeps `NaN`         |
| `null`      | Uses fallback         | Uses fallback       |
| `undefined` | Uses fallback         | Uses fallback       |

```javascript
const value = 0;

console.log(value || 100);        // 100
console.log(value ?? 100);        // 0

console.log(null ?? 100);          // 100
console.log(undefined ?? 100);    // 100
```

## Short-Circuit Evaluation

**Nullish Short-Circuiting:** The right-hand operand is evaluated only when the left-hand operand is `null` or
`undefined`. If the left-hand operand contains any other value, including falsy values such as `0`, `false`, or an empty
string, evaluation stops immediately and the left-hand value is returned. The behavior is similar to `&&` and `||`
short-circuit evaluation, but it uses nullish checking instead of truthiness checking.

```javascript
function fallback() {
    console.log("fallback executed");
    return 100;
}

console.log(5 ?? fallback());
// 5
// fallback() is not executed

console.log(null ?? fallback());
// fallback executed
// 100
```

## Nullish Assignment (`??=`)

**Nullish Assignment Operator (`??=`):** Assigns a new value only when the current value is `null` or `undefined`.
Unlike normal assignment, `??=` preserves existing falsy values such as `0`, `false`, and `""`. `??=` is commonly used
for initializing optional configuration values, caches, and lazy state creation where existing falsy values must remain
unchanged.

| Operator | Assignment Condition              |
|:---------|:----------------------------------|
| `??=`    | Assign only when value is nullish |

## Interaction With Default Parameters

**Default Value Semantics:** Function default parameters use `undefined` detection rather than general falsiness. This
means `undefined` triggers the default value, whereas `null` does not trigger the default value. Nullish coalescing
differs because it treats both `null` and `undefined` as missing values.

## Combining With Other Logical Operators

**Operator Restriction:** JavaScript does not allow direct mixing of `??` with `&&` or `||` without explicit grouping.
This restriction prevents ambiguous expressions where truthiness-based and nullish-based logic are combined without
clear intent. Parentheses are required to define the intended evaluation order.

```javascript
// SyntaxError
// const value = null || undefined ?? "Guest";

// Correct
const value = (null || undefined) ?? "Guest";

console.log(value);
// Guest
```

## Common Use Cases

* **Configuration Values:** Preserve explicit configuration values such as `false`, `0`, or empty strings while
  providing defaults only when the value is absent.
* **Optional Data Sources:** Handle missing values returned from APIs, databases, or external systems without
  overwriting valid empty values.
* **Lazy Initialization:** Create values only when an existing value has not been assigned.

## Best Practices

* **Use `??` instead of `||` when handling optional values:** If `0`, `false`, `NaN`, or `""` are valid values, `||`
  incorrectly treats them as missing.
* **Use `??=` for initialization where absence is the condition:** It communicates that only `null` and `undefined`
  represent an uninitialized state.
* **Do not use nullish coalescing as general validation:** `??` only checks for missing values. It does not verify type,
  format, range, or business rules.
* **Avoid unnecessary fallback chains:** Multiple fallback operators can hide invalid data states. Validate external
  data separately before applying defaults.