# Equality and Comparison

## Primitive Value Comparison

**Primitive Comparison:** JavaScript compares primitive values based on their actual value rather than object identity.
For primitive values, equality checks compare the stored value itself across all primitive types:

| Type      | Examples    |
|:----------|:------------|
| String    | `"text"`    |
| Number    | `42`        |
| BigInt    | `10n`       |
| Boolean   | `true`      |
| Undefined | `undefined` |
| Null      | `null`      |
| Symbol    | `Symbol()`  |

## Equality Operators

JavaScript provides two equality systems: strict equality, which compares without conversion, and loose equality, which
performs type conversion.

| Operator | Behavior                                  |
|:---------|:------------------------------------------|
| `===`    | Strict equality without type conversion   |
| `!==`    | Strict inequality without type conversion |
| `==`     | Loose equality with type conversion       |
| `!=`     | Loose inequality with type conversion     |

## Strict Equality (`===`)

**Strict Equality:** Compares two values without converting their types. Two values are strictly equal only when both
their type and value match. Strict equality avoids unexpected conversions and is the standard comparison method in most
JavaScript code.

| Comparison           | Result  |
|:---------------------|:--------|
| `5 === 5`            | `true`  |
| `"5" === 5`          | `false` |
| `true === 1`         | `false` |
| `null === undefined` | `false` |

## Loose Equality (`==`)

**Loose Equality:** Compares values after applying JavaScript's abstract equality conversion rules. Before comparison,
JavaScript may convert one operand type into another. Loose equality can be useful in specific cases but requires
knowledge of its conversion rules.

| Comparison          | Result |
|:--------------------|:-------|
| `"5" == 5`          | `true` |
| `true == 1`         | `true` |
| `null == undefined` | `true` |

## Special Equality Cases

JavaScript has several values with special comparison behavior. `NaN` is the only JavaScript value that is not equal to
itself under normal equality operators, so checking for `NaN` should always use `Number.isNaN()`.

| Comparison           | Result  |
|:---------------------|:--------|
| `NaN === NaN`        | `false` |
| `0 === -0`           | `true`  |
| `null === undefined` | `false` |
| `null == undefined`  | `true`  |

## Object Comparison

**Object Comparison:** JavaScript compares objects by reference identity, not by their internal structure or property
values. Two objects containing identical data are still considered different values when they are created separately.

| Comparison                                 | Result  |
|:-------------------------------------------|:--------|
| Same object reference                      | `true`  |
| Different object with identical properties | `false` |

| Value Relationship             | Equality Result |
|:-------------------------------|:----------------|
| Object compared with itself    | Equal           |
| Two separately created objects | Not equal       |

## Reference Equality

**Reference Equality:** A comparison where two object values are equal only when both variables point to the same object
in memory. Variables storing objects contain references to object locations rather than direct copies of object data,
and assignment between object variables copies the reference. Changing one reference affects the same underlying object
when both variables point to it.

| Operation                        | Result                                  |
|:---------------------------------|:----------------------------------------|
| Copy object reference            | Both variables refer to the same object |
| Create new object with same data | Different reference                     |

## Array Comparison

**Array Comparison:** Arrays follow the same reference equality rules as other objects. Two arrays containing identical
elements are not equal unless they are the same array instance.

| Comparison                          | Result  |
|:------------------------------------|:--------|
| Same array reference                | `true`  |
| Different arrays with same elements | `false` |

| Values                           | Equality  |
|:---------------------------------|:----------|
| Empty array compared with itself | Equal     |
| Two separate empty arrays        | Not equal |

## Comparing Object Contents

**Structural Comparison:** JavaScript does not automatically compare object properties or array elements, meaning
content-based comparison requires explicit logic or dedicated utilities. Serialization-based comparison has limitations
because property order, unsupported values, and object behavior can affect results.

| Method                   | Behavior                                |
|:-------------------------|:----------------------------------------|
| Manual comparison        | Checks properties individually          |
| Serialization comparison | Converts values into comparable strings |
| Deep comparison utility  | Recursively compares nested values      |

## Object.is Comparison

**`Object.is()`:** A comparison method that uses a more precise equality algorithm than strict equality for certain edge
cases. For most application comparisons, `===` remains the standard choice.

| Comparison       | `===`   | `Object.is()` |
|:-----------------|:--------|:--------------|
| `NaN` with `NaN` | `false` | `true`        |
| `0` with `-0`    | `true`  | `false`       |

## Best Practices

* **Prefer strict equality (`===`) for normal comparisons:** It avoids implicit type conversion and makes comparison
  behavior predictable.
* **Do not compare objects or arrays expecting content equality:** JavaScript compares references, not structures.
* **Use dedicated comparison logic for deep equality:** When object contents must match, compare the required properties
  explicitly or use a tested deep comparison approach.
* **Handle `NaN` with `Number.isNaN()`:** Equality operators cannot detect `NaN` because it is not equal to itself.
* **Use `Object.is()` only when its specific behavior is required:** It solves edge cases involving `NaN` and signed
  zero but is not a general replacement for `===`.
* **Avoid loose equality (`==`) unless the conversion is intentional and well understood:** Its coercion rules are
  inconsistent across type pairs and are a common source of subtle bugs.
* **Treat `null == undefined` as the one acceptable use of loose equality:** This specific comparison is a widely
  recognized idiom for checking "no value" without distinguishing between the two, and is safer than writing out both
  checks separately.
* **Never rely on implicit coercion to validate types:** Use explicit checks (`typeof`, `Array.isArray()`, dedicated
  type guards) instead of leaning on how `==` happens to coerce a given value.
* **Be explicit about intent when comparing mixed types:** Convert values to a common type before comparing rather than
  letting the equality operator do it implicitly, so the comparison's behavior is visible in the code itself.
* **Document any intentional fall-through into loose equality or `Object.is()`:** Since these are exceptions to the
  default (`===`), a brief comment prevents future readers from "fixing" it into strict equality and breaking the
  intended behavior.
* **Establish and enforce a team-wide equality standard via linting:** Rules like ESLint's `eqeqeq` catch accidental
  `==` usage automatically, removing the need for manual vigilance during review.
* **Reach for a well-tested utility library for deep equality rather than writing it from scratch:** Recursive
  structural comparison has many edge cases (circular references, special objects like `Date` or `Map`); a maintained
  implementation avoids re-solving already-solved problems.
