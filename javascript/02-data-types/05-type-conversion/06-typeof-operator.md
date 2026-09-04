# `typeof` Operator

[//]: # (TODO: MORE DETAILS)

The `typeof` operator returns a string describing the runtime type classification of its operand. Primitive values
produce predefined type names, while most objects produce `"object"` or `"function"` depending on their callable
behavior.

## Primitive Type Results

The `typeof` operator returns standardized string values representing JavaScript's primitive types and object
categories. These results are defined by the ECMAScript specification.

## `typeof` Limitations

`typeof` provides only broad runtime classifications and cannot distinguish between different built-in object types such
as arrays, dates, maps, or regular expressions, all of which generally produce `"object"`.

## `typeof null`

For historical compatibility reasons, `typeof null` returns `"object"` even though `null` is a primitive value. This
behavior is standardized and cannot be changed without breaking existing JavaScript code.

## `typeof` Undeclared Variables

Unlike most operations, `typeof` can be applied to undeclared identifiers without throwing a `ReferenceError`. In this
case, it returns `"undefined"`.
