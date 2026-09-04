# Object Fundamentals

## Object Concept

An object is a data structure that stores related values and behavior through properties. Objects are one of the core
building blocks of JavaScript, allowing multiple pieces of information to be grouped together under a single value. An
object consists of properties where each property has a key and an associated value. When a function is stored as an
object property, it becomes a method.

| Value Type       | Can Be Stored |
|:-----------------|:--------------|
| Primitive values | Yes           |
| Other objects    | Yes           |
| Arrays           | Yes           |
| Functions        | Yes           |

## Objects and Primitive Types

JavaScript values are divided into primitive values and objects. Primitive values represent single, immutable values,
whereas objects represent collections of properties and can be modified after creation. Primitive values include String,
Number, BigInt, Boolean, Undefined, Null, and Symbol. Objects include object literals, arrays, functions, maps, sets,
and class instances.

| Feature               | Primitive Values | Objects |
|:----------------------|:-----------------|:--------|
| Store multiple values | No               | Yes     |
| Mutable               | No               | Yes     |
| Compared by value     | Yes              | No      |
| Compared by reference | No               | Yes     |
| Have properties       | Limited          | Yes     |

## Object Properties

A property is a named value stored inside an object that allows data to be organized using meaningful names instead of
relying only on positions. Properties can store both data and behavior.

| Component | Description                |
|:----------|:---------------------------|
| Key       | Identifies the property    |
| Value     | Stores the associated data |

## Object Mutability

Objects are mutable values, meaning their properties can be changed after the object is created. An object can have
properties added, updated, or removed, while the object itself remains the same instance unless a new object is created.

## Object Reference Behavior

Objects behave differently from primitive values because they are reference types. A variable storing an object does not
contain the object directly; it stores a reference to the object in memory. When an object is assigned to another
variable, the reference is copied instead of the object itself, meaning multiple variables can point to the same object.

## Object Identity

Every object has its own unique identity. Two objects with identical properties are still different objects if they were
created separately because object identity depends on whether two references point to the exact same object in memory.
Objects are considered equal only when they reference the same object.

## Object Copying Behavior

Assigning an object does not create a copy; instead, the new variable receives another reference to the existing object.
This causes changes made through one reference to affect all other references pointing to the same object. Creating
independent copies requires explicit copying techniques.

## Objects as Reference Types

Understanding reference behavior is important when working with nested objects, arrays, and application state.

| Operation                 | Behavior                  |
|:--------------------------|:--------------------------|
| Assignment                | Copies reference          |
| Function argument passing | Passes reference value    |
| Comparison                | Checks reference identity |

## Objects and Memory

Objects are stored separately from the variables that reference them. A variable provides access to an object through
its reference, and when no references remain pointing to an object, it becomes eligible for automatic garbage collection
handled by the JavaScript engine.

## Objects as the Foundation of JavaScript

Many JavaScript features are built around objects, making an understanding of objects essential for mastering more
advanced language concepts.

| Feature       | Relationship                            |
|:--------------|:----------------------------------------|
| Arrays        | Specialized objects                     |
| Functions     | Objects with callable behavior          |
| Classes       | Syntax built on prototype-based objects |
| Maps and Sets | Built-in collection objects             |

## Use Cases

Objects are used whenever related data and behavior need to be grouped together.

* Representing entities by modeling real-world or application concepts.
* Storing structured data by organizing information using named properties.
* Creating reusable structures by grouping data and methods together.
* Building complex systems throughout JavaScript applications and APIs.

## Performance Considerations

Object performance depends on how objects are created, accessed, and modified. Objects are efficient for storing related
data, but large or frequently changing object structures should be designed carefully.

| Factor           | Description                                       |
|:-----------------|:--------------------------------------------------|
| Property access  | Optimized for named property lookup               |
| Object structure | Consistent structures improve engine optimization |
| References       | Copying objects does not duplicate data           |

## Best Practices

* **Understand reference behavior:** Objects are assigned and compared by reference rather than by value.
* **Use objects to represent related data:** Objects provide a clear structure for grouping properties together.
* **Avoid unnecessary object mutation:** Frequent structural changes can make data flow harder to track.
* **Remember that arrays and functions are objects:** Many JavaScript features rely on underlying object capabilities.
* **Choose the appropriate data structure:** Objects are best when data is organized by named properties rather than
  sequential positions.