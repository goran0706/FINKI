# String Conversion

[//]: # (TODO: MORE DETAILS)

String conversion transforms a value into its string representation. Primitive values convert directly according to
their defined representations, while objects are first converted to primitive values before being transformed into
strings through the **ToString** abstract operation.

## Number to String

Numeric values are converted into their textual representation without changing their numeric value. Special numeric
values such as `NaN`, `Infinity`, and `-Infinity` have predefined string representations defined by the language
specification.

## Boolean to String

Boolean values convert directly to the strings `"true"` and `"false"` through the **ToString** abstract operation.

## Object to String

Objects are first converted to a primitive value using **ToPrimitive**. If no custom primitive conversion exists,
JavaScript typically falls back to object string representations such as `"[object Object]"`, although individual object
types may provide more specific results.
