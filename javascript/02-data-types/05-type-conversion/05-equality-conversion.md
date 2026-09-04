# Equality Comparisons

[//]: # (TODO: MORE DETAILS)

JavaScript provides two equality algorithms. Loose equality may perform type coercion before comparison, while strict
equality compares values without performing type conversion.

## Loose Equality (`==`)

Loose equality compares values after applying the ECMAScript Abstract Equality Comparison algorithm. When operands have
different types, the engine may perform one or more implicit conversions before determining equality.

## Strict Equality (`===`)

Strict equality compares both type and value without performing type conversion. Operands of different types are always
considered unequal.

## `!=` vs `!==`

The `!=` operator performs loose inequality by applying the same conversion rules used by loose equality before negating
the result. The `!==` operator performs strict inequality without applying type conversion.
