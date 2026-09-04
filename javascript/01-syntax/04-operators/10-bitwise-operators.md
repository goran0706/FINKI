# Bitwise Operators

## Overview

Bitwise operators perform operations on the binary representation of numeric values. JavaScript numbers are stored
internally as double-precision floating-point values, but bitwise operations convert operands into signed 32-bit
integers before performing the operation. After the operation completes, the result is converted back into a JavaScript
`Number`. Bitwise operators are mainly used for low-level operations, flags, masks, binary protocols, and
performance-sensitive integer manipulation.

| Behavior                        | Result                                           |
|:--------------------------------|:-------------------------------------------------|
| Operate on integers             | Uses signed 32-bit representation                |
| Support floating-point operands | Values are converted to integers first           |
| Preserve large numbers          | No, values outside 32-bit range lose information |

## Bitwise Operator List

| Operator | Name                 | Operation                                        |
|:---------|:---------------------|:-------------------------------------------------|
| `&`      | Bitwise AND          | Sets bits that exist in both operands            |
| `\|`     | Bitwise OR           | Sets bits that exist in either operand           |
| `^`      | Bitwise XOR          | Sets bits that exist in one operand but not both |
| `~`      | Bitwise NOT          | Inverts all bits                                 |
| `<<`     | Left Shift           | Shifts bits left                                 |
| `>>`     | Signed Right Shift   | Shifts bits right while preserving sign          |
| `>>>`    | Unsigned Right Shift | Shifts bits right while filling with zeros       |

## 32-Bit Integer Conversion

**Integer Conversion:** Before a bitwise operation executes, JavaScript converts operands into signed 32-bit integers.
The conversion process consists of converting the value to a Number, converting the Number to a 32-bit integer
representation, performing the bitwise operation, and converting the result back into a Number. Fractional components
are removed during conversion.

| Input      | Converted Value |
|:-----------|:----------------|
| `1.9`      | `1`             |
| `-1.9`     | `-1`            |
| `NaN`      | `0`             |
| `Infinity` | `0`             |

## Bitwise AND (`&`)

**Bitwise AND:** Compares each bit position and returns `1` only when both corresponding bits are `1`. Common uses
include checking bit flags, applying masks, and extracting specific bits.

| A | B | Result |
|:--|:--|:-------|
| 0 | 0 | 0      |
| 0 | 1 | 0      |
| 1 | 0 | 0      |
| 1 | 1 | 1      |

## Bitwise OR (`|`)

**Bitwise OR:** Compares each bit position and returns `1` when either corresponding bit is `1`. Common uses include
combining bit flags and setting specific bits.

| A | B | Result |
|:--|:--|:-------|
| 0 | 0 | 0      |
| 0 | 1 | 1      |
| 1 | 0 | 1      |
| 1 | 1 | 1      |

## Bitwise XOR (`^`)

**Bitwise XOR:** Returns `1` when the two corresponding bits are different. Common uses include toggling bits and
comparing binary states.

| A | B | Result |
|:--|:--|:-------|
| 0 | 0 | 0      |
| 0 | 1 | 1      |
| 1 | 0 | 1      |
| 1 | 1 | 0      |

## Bitwise NOT (`~`)

**Bitwise NOT:** Inverts every bit in the 32-bit representation.

```javascript
~x === -(x + 1)
```

```javascript
~5
```

```javascript
-(5 + 1)
```

```javascript
-6
```

## Left Shift (`<<`)

**Left Shift:** Moves bits to the left and fills the empty right positions with zeros. Each left shift multiplies an
integer by powers of two when no overflow occurs. Only the lower five bits of the shift amount are used for 32-bit
integers.

```javascript
value << 1
```

```javascript
value * 2
```

## Signed Right Shift (`>>`)

**Signed Right Shift:** Moves bits right while preserving the sign bit. Positive numbers receive zeros on the left,
while negative numbers receive ones on the left, maintaining the sign of signed integers.

## Unsigned Right Shift (`>>>`)

**Unsigned Right Shift:** Moves bits right while filling the left side with zeros. Unlike `>>`, it does not preserve the
sign bit, meaning negative numbers become large positive numbers because the sign bit is treated as a normal bit.

## Bitwise Assignment Operators

JavaScript provides compound assignment versions of bitwise operators that modify the existing variable value.

| Operator | Equivalent        |
|:---------|:------------------|
| `&=`     | `x = x & value`   |
| `\|=`    | `x = x \| value`  |
| `^=`     | `x = x ^ value`   |
| `<<=`    | `x = x << value`  |
| `>>=`    | `x = x >> value`  |
| `>>>=`   | `x = x >>> value` |

## Bit Flags

**Bit Flags:** A common use of bitwise operations is storing multiple Boolean states inside a single integer, where each
bit represents an independent state. Bitwise OR combines flags, and Bitwise AND checks whether a flag exists.

| Bit    | Meaning      |
|:-------|:-------------|
| `0001` | Permission A |
| `0010` | Permission B |
| `0100` | Permission C |

## Bitwise Operators and Precision

**Integer Limitation:** Bitwise operations should not be used for arbitrary large numbers because JavaScript converts
values into signed 32-bit integers. Values larger than the supported range lose information. For large integer
calculations, use `BigInt` instead.

## Bitwise Operators vs Mathematical Operations

**Binary Processing:** Bitwise operators are not replacements for normal arithmetic.

| Operation              | Appropriate Tool   |
|:-----------------------|:-------------------|
| Financial calculations | Decimal arithmetic |
| General multiplication | `*`                |
| Binary masks           | Bitwise operators  |
| Network protocols      | Bitwise operators  |
| Large integers         | `BigInt`           |

## Best Practices

* **Use bitwise operators for binary data manipulation, not general arithmetic:** Bitwise conversion to 32-bit integers
  can silently change values.
* **Do not use bitwise tricks for performance without measurement:** Modern JavaScript engines optimize normal
  arithmetic effectively.
* **Avoid using bitwise operators for integer validation:** Operations such as `value | 0` truncate values and can hide
  invalid input.
* **Use `BigInt` for integers outside the safe 32-bit range:** Bitwise operators are limited by their 32-bit conversion
  behavior.
* **Document bit masks clearly:** Binary flags are compact but can become difficult to maintain without describing the
  meaning of each bit.
* **Prefer readable boolean structures when binary storage is unnecessary:** Objects containing named properties are
  often clearer than manually managed bit flags.