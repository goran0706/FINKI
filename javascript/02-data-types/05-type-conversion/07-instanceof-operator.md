# `instanceof` Operator

[//]: # (TODO: MORE DETAILS)


The `instanceof` operator determines whether an object's prototype chain contains the `prototype` property of a
constructor function. It is commonly used to test whether an object inherits from a particular constructor.

## Prototype-Chain Checking

`instanceof` walks the object's prototype chain until it either finds the constructor's prototype object or reaches the
end of the chain. The result depends entirely on prototype inheritance rather than object structure.

## `Symbol.hasInstance`

Constructors may customize the behavior of `instanceof` by defining the `Symbol.hasInstance` method, allowing
user-defined logic to determine whether an object satisfies the comparison.

## Cross-Realm Behavior

Objects created in different JavaScript realms, such as separate browser windows or iframes, have different constructor
objects. As a result, `instanceof` comparisons may return unexpected results even when the objects represent the same
built-in type.
