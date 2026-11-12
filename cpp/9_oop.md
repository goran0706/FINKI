# The Four Pillars of OOP

---

## 1. Encapsulation

**Encapsulation** is the mechanism of bundling data (fields) and the functions (methods) that operate on that data into
a single unit (class), while restricting direct external access to internal fields through access modifiers,
and forcing all interaction to go through controlled methods that validate input and enforce invariants.

**Purpose**

- Protect internal state from direct external modification
- Ensure the object remains in a valid and consistent state at all times
- Centralize and enforce rules around state changes inside the class
- Control precisely how fields are read, updated, and exposed
- Decouple internal representation from external code

**Do**

- Declare all fields private by default
- Expose state only through methods that carry semantic meaning
- Validate all input and enforce invariants inside every mutating method
- Bundle data and the behavior that directly operates on that data in the same class
- Design mutators to reject or correct any input that would leave the object in an invalid state

**Do Not**

- Declare fields public or allow uncontrolled direct mutation
- Declare private fields with trivial getters and setters that bypass validation — identical in effect to public fields
- Expose raw internal state without control or filtering
- Scatter behavior that belongs to the class across external functions or other classes
- Separate data from the logic that is directly responsible for maintaining its correctness

---

## 2. Abstraction

**Abstraction** is the mechanism of exposing only the essential behavior of a class or system through a well-defined
interface, while hiding all internal implementation details and complexity. It applies at multiple levels — within a
class by hiding implementation details behind a well-defined public interface with meaningful method names,
and at design level by defining abstract classes and interfaces.

**Purpose**

- Hide internal implementation details from anything that uses the class
- Expose only the operations that are relevant and necessary at each level of the system
- Reduce complexity by exposing what a unit does, not how it does it
- Enable multiple distinct implementations to exist behind the same interface
- Allow internal implementation to change freely without affecting code that depends on the interface

**Do**

- Expose only methods that represent what the class does, not how it does it
- Hide all internal logic, helper methods, and intermediate state as private
- Use interfaces or abstract classes to model concepts that have multiple concrete implementations
- Name methods after the intent and outcome they represent, not the mechanism they use internally
- Design each layer of the system to depend only on the abstraction directly below it, never on concrete details

**Do Not**

- Expose internal logic, helper methods, or implementation-specific details through the public interface
- Leak implementation detail through method names, parameter types, or return types that force users to understand
  internals
- Create abstract classes or interfaces for a single concrete type that will never have another implementation
- Allow consumers of a class to depend on how something is implemented rather than what it does
- Introduce speculative abstractions for imagined future needs — abstract only what is genuinely generalized now

---

## 3. Inheritance

**Inheritance** is the mechanism by which a derived class acquires the fields and methods of a base class, extending or
overriding its behavior, and is correctly applied only when a strict is-a relationship exists — meaning the derived type
is a more specific version of the base type and can replace it in any context without breaking expected behavior.

**Purpose**

- Reuse and extend existing behavior from a base class without duplication
- Model genuine hierarchical is-a relationships between types in the domain
- Enforce a shared behavioral contract across all types in a hierarchy
- Enable polymorphic usage of derived types through a common base reference
- Centralize shared logic in the base class so all derived types benefit from it consistently

**Do**

- Apply inheritance only when the derived class is a more specific version of the base class
- Ensure the derived class satisfies every behavioral contract the base class establishes
- Keep inheritance hierarchies shallow — deep hierarchies indicate design problems
- Override methods only to extend or specialize behavior, never to suppress or contradict base class behavior
- Ensure the derived class can replace the base class in any context without breaking expected behavior

**Do Not**

- Use inheritance purely for code reuse when no is-a relationship exists — use composition instead
- Build deep or wide inheritance hierarchies that are difficult to reason about and brittle to change
- Override a method in a derived class in a way that breaks or contradicts base class behavior
- Inherit from a class just to access its internals or utilities when no subtype relationship exists
- Mix unrelated responsibilities into a hierarchy because they happen to share some implementation

---

## 4. Polymorphism

**Polymorphism** is the mechanism by which different concrete classes that share a common base type or interface each
provide their own implementation of the same method, allowing a single call made through a base type reference to
resolve to the correct concrete implementation at runtime based on the actual type of the object.

**Purpose**

- Allow a single interface to represent and invoke multiple distinct implementations transparently
- Enable behavior to vary across types without the calling code knowing or caring about the concrete type
- Eliminate type-based conditionals that would otherwise grow with every new type added
- Allow new types to be introduced by adding new classes without modifying any existing call site
- Enable runtime behavior selection driven by object type rather than explicit branching logic

**Do**

- Define shared behavior through a base class or interface and let each concrete type provide its own correct
  implementation
- Write all calling code against the base type or interface, never against a concrete type
- Add new behavior by introducing new classes that implement the existing interface, leaving all existing code untouched
- Ensure every concrete implementation fully honors the contract defined by the base type
- Rely on runtime dispatch to select the correct behavior rather than inspecting type explicitly

**Do Not**

- Use if/else chains or switch statements that branch on the concrete type of an object — this is polymorphism
  deliberately avoided
- Cast a base type reference to a concrete type to access type-specific behavior — this breaks the abstraction and
  couples call sites to concrete implementations
- Expose concrete types in APIs where the base type or interface is sufficient
- Provide a derived class that violates or partially implements the contract of the base type, breaking substitutability
- Duplicate behavior across concrete classes instead of centralizing shared logic in the base type and overriding only
  what genuinely differs