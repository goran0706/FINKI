# Number Conversion

[//]: # (TODO: MORE DETAILS)

Number conversion transforms values into JavaScript's `Number` type through the **ToNumber** abstract operation.
Primitive values follow predefined conversion rules, while objects are first converted to primitive values before
numeric conversion is attempted.

## String to Number

Strings representing valid numeric literals are converted into their corresponding numeric values. Strings that cannot
be interpreted as valid numbers produce `NaN`, indicating that numeric conversion failed.

## Boolean to Number

Boolean values convert deterministically into numeric values. `true` becomes `1`, while `false` becomes `0`.

## Object to Number

Objects are first converted to primitive values through **ToPrimitive**. The resulting primitive value is then converted
using the standard numeric conversion rules.

## `NaN` and Conversion Failures

`NaN` represents the result of numeric operations that cannot produce a valid numeric value. It is a numeric value
itself, although it represents an undefined or unrepresentable result rather than a mathematical number.
