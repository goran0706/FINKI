# Boolean Conversion

[//]: # (TODO: MORE DETAILS)

Boolean conversion determines whether a value is considered **truthy** or **falsy** through the **ToBoolean** abstract
operation. This conversion occurs automatically in conditional statements, logical operators, and other language
constructs requiring a boolean value.

## Truthy Values

Truthy values convert to `true` during boolean conversion. Except a small set of falsy values, all JavaScript values are
truthy.

## Falsy Values

These values always convert to `false` during boolean conversion. The falsy values are:

- `false`
- `0`
- `-0`
- `0n`
- `NaN`
- `""`
- `null`
- `undefined`

