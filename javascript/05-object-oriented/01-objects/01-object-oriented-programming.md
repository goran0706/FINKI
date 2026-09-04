# Object-Oriented Programming Introduction

## Object-Oriented Programming Concept

**Object-Oriented Programming (OOP):** A programming approach that organizes software around objects containing
properties for data and methods for behavior to model entities and relationships.

## Objects and Classes

An **object** is a value containing properties and methods, while a **class** serves as a blueprint used to create
object instances with a shared structure and behavior.

| Concept         | Purpose                     |
|:----------------|:----------------------------|
| Class           | Defines the structure       |
| Object instance | Represents a created object |

## Classes and Instances

An **instance** is an individual object created from a class, possessing its own property values while accessing shared
class methods.

| Component  | Description                  |
|:-----------|:-----------------------------|
| Class      | Defines object template      |
| Instance   | Created object               |
| Properties | Store instance-specific data |
| Methods    | Provide shared behavior      |

## Object State and Behavior

Objects combine internal **state** (data stored) and **behavior** (actions performed) to represent application concepts.

| Object Component | Example                   |
|:-----------------|:--------------------------|
| State            | User name, account status |
| Behavior         | Login, update profile     |

## Object-Oriented Programming Principles

Object-oriented programming relies on four core principles to organize and share behavior:

* Encapsulation
* Inheritance
* Polymorphism
* Abstraction

## Encapsulation

**Encapsulation:** The practice of combining data and behavior inside an object while separating internal state
management from the public interface to prevent unintended data modifications.

## Inheritance

**Inheritance:** A mechanism where a derived class receives properties and behavior from a base class, implemented in
JavaScript through underlying prototypes.

| Class         | Purpose                      |
|:--------------|:-----------------------------|
| Base class    | Provides common behavior     |
| Derived class | Extends or modifies behavior |

## Polymorphism

**Polymorphism:** The ability for different objects to share a common interface while providing unique implementations
for the same operation.

## Abstraction

**Abstraction:** The practice of exposing essential behavior through simple interfaces while hiding internal logic and
implementation details.

## Classes and Object-Oriented Design

Classes provide structures to define properties, methods, inheritance, and interfaces.

| Feature     | Purpose                        |
|:------------|:-------------------------------|
| Properties  | Store object state             |
| Methods     | Define behavior                |
| Inheritance | Reuse and extend functionality |
| Interfaces  | Define object usage patterns   |

## JavaScript and Object-Oriented Programming

JavaScript supports object-oriented programming using objects, prototypes, and classes, where classes are built directly
on top of the prototype system.

| Feature           | Internal Mechanism           |
|:------------------|:-----------------------------|
| Class methods     | Prototype methods            |
| Class inheritance | Prototype chain              |
| Instances         | Objects linked to prototypes |

## Prototype-Based vs Class-Based Thinking

JavaScript provides modern class syntax while maintaining underlying prototype-based behavior rather than traditional
class hierarchies.

| Feature           | Traditional OOP | JavaScript                  |
|:------------------|:----------------|:----------------------------|
| Inheritance model | Class hierarchy | Prototype chain             |
| Object creation   | Class templates | Objects and constructors    |
| Modern syntax     | Classes         | Classes built on prototypes |

## Object-Oriented Programming Benefits

| Benefit         | Description                                         |
|:----------------|:----------------------------------------------------|
| Reusability     | Share common behavior                               |
| Organization    | Group related data and logic                        |
| Maintainability | Separate responsibilities                           |
| Extensibility   | Add new behavior through inheritance or composition |

## Use Cases

* **Modeling entities:** Represent application concepts as objects.
* **Organizing large applications:** Separate responsibilities into related structures.
* **Creating reusable components:** Share common behavior across objects.
* **Managing complex systems:** Use object relationships to structure code.

## Design Considerations

| Approach            | Suitable When                               |
|:--------------------|:--------------------------------------------|
| Objects and classes | Data and behavior naturally belong together |
| Functions           | Simple transformations or operations        |
| Composition         | Flexible behavior combinations are needed   |

## Best Practices

* **Use objects when data and behavior belong together:** Ensure classes represent meaningful, focused entities.
* **Keep classes focused on one responsibility:** Avoid creating classes that manage unrelated concerns.
* **Design objects around clear responsibilities:** Build well-defined objects that remain easy to reuse and modify.
* **Understand JavaScript classes are built on prototypes:** Recognize that class syntax does not replace the core
  prototype system.
* **Prefer composition when inheritance becomes complex:** Combine smaller behaviors to maintain cleaner code
  structures.