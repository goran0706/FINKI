# Type Conversion

[//]: # (TODO: MORE DETAILS)

Type conversion is the process of transforming a value from one data type into another. JavaScript performs conversions
either explicitly, when requested by the programmer, or implicitly during expression evaluation. The ECMAScript
specification defines conversion through a set of abstract operations such as **ToPrimitive**, **ToString**,
**ToNumber**, and **ToBoolean**, which determine how values are converted before an operation is performed.

## Explicit Conversion

Explicit conversion occurs when a conversion is intentionally requested by the programmer using built-in constructors or
conversion functions. The conversion is performed immediately and follows the rules defined by the corresponding
ECMAScript abstract operation.

## Implicit Conversion (Coercion)

Implicit conversion, also known as **type coercion**, occurs automatically when an operator or language construct
requires operands of a particular type. The JavaScript engine applies the appropriate abstract conversion operation
before evaluating the expression. Different operators may invoke different conversion rules depending on their
semantics.

## Abstract Conversion Operations

The ECMAScript specification defines several internal abstract operations responsible for value conversion.
**ToPrimitive** converts objects into primitive values, **ToString** converts values into strings, **ToNumber** converts
values into numeric values, and **ToBoolean** converts values according to JavaScript's truthiness rules. These
operations are internal language mechanisms and cannot be called directly by user code.