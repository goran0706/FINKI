# Java Theory

A structured reference for learning Java, from language fundamentals to
object-oriented programming, collections, lambdas, and exception
handling.

> **Compatibility:** The explanations and examples target modern Java
> syntax and are intended to be compatible with Java 27. They avoid
> preview features. Some historical terminology is retained only where
> useful for understanding older material. Verify version-specific APIs
> against the Java 27 API documentation.

## Contents

1. [Programming and Java](#1-programming-and-java)
2. [How Java Runs](#2-how-java-runs)
3. [Types, Variables, and Operators](#3-types-variables-and-operators)
4. [Control Flow and Methods](#4-control-flow-and-methods)
5. [Arrays and Varargs](#5-arrays-and-varargs)
6. [Classes and Objects](#6-classes-and-objects)
7. [Encapsulation and Access
   Control](#7-encapsulation-and-access-control)
8. [Inheritance and Polymorphism](#8-inheritance-and-polymorphism)
9. [Abstract Classes and
   Interfaces](#9-abstract-classes-and-interfaces)
10. [Packages and Java Application
    Structure](#10-packages-and-java-application-structure)
11. [Generics and Wrapper Types](#11-generics-and-wrapper-types)
12. [Collections Framework](#12-collections-framework)
13. [Lambdas and Functional
    Interfaces](#13-lambdas-and-functional-interfaces)
14. [Exception Handling](#14-exception-handling)
15. [Memory and Garbage Collection](#15-memory-and-garbage-collection)
16. [Coding Conventions and Best
    Practices](#16-coding-conventions-and-best-practices)

------------------------------------------------------------------------

## 1. Programming and Java

### What is programming?

Programming is the process of expressing instructions and rules in a
form a computer can execute. A program can process input, apply logic,
store or retrieve data, and produce output.

Computers do not interpret intent. They execute instructions according
to the language runtime, operating system, and hardware.

### Frontend and backend

- **Frontend:** The part of an application through which users
  interact. It may run in a browser, desktop application, or mobile
  application.
- **Backend:** Server-side application logic, APIs, authorization,
  persistence, integrations, and other operations that clients should
  not perform directly.

These are architectural roles, not strict language categories. A
frontend can communicate with backend APIs; it should generally not
connect directly to a production database.

### What is Java?

Java is both a programming language and a runtime platform. It is
statically typed, class-based, and object-oriented, and it also supports
procedural and functional programming styles.

Java is widely used for backend services, enterprise systems, desktop
tools, Android development (with important platform-specific details),
and other applications.

### Java editions and terminology

- **Java SE (Java Platform, Standard Edition):** The core language,
  JVM, and standard libraries.
- **Jakarta EE:** Enterprise specifications and APIs built on Java SE.
  Older material may call this Java EE.
- **Java ME:** A platform for certain constrained or embedded
  environments.
- **Java Card:** A platform for applications on smart cards and
  similarly constrained devices.

The **JDK** (Java Development Kit) includes tools for developing Java
applications, such as the compiler and launcher, along with the runtime
components needed to run them.

------------------------------------------------------------------------

## 2. How Java Runs

### Source code, bytecode, and the JVM

The usual execution path is:

``` text
Java source (.java)
       |
       | javac
       v
Java bytecode (.class)
       |
       | JVM loads and executes it
       v
Machine instructions on the current platform
```

1. You write source code in `.java` files.
2. The Java compiler, `javac`, checks the source and compiles it into
   bytecode.
3. The Java Virtual Machine (JVM) loads classes, verifies bytecode, and
   executes it. A JVM may interpret bytecode and compile frequently
   executed code to native machine code using a just-in-time (JIT)
   compiler.
4. The operating system and CPU execute the resulting machine
   instructions.

Bytecode is designed to be portable. The JVM implementation is
platform-specific, which is a major part of Java's "write once, run
anywhere" model. Portability is not an absolute guarantee: native
libraries, filesystem assumptions, operating-system behavior, and
runtime-version differences can still affect an application.

### JVM, runtime libraries, and JDK

- **JVM:** Loads and executes Java bytecode.
- **Java standard libraries / APIs:** Reusable classes and interfaces,
  such as `String`, `List`, `Path`, and `Instant`.
- **JDK:** Development tools plus the runtime components and libraries
  required to build and run Java applications.

"JRE" historically described a runtime distribution containing a JVM and
runtime libraries. Modern JDK distributions do not always provide a
separately installable JRE, so do not assume that every Java
installation includes a distinct `jre` directory.

### Check the installed version and run a program

``` bash
java --version
javac --version
```

For a simple file named `Hello.java`:

``` java
void main() {
    System.out.println("Hello, Java!");
}
```

Modern Java supports compact source files and instance `main` methods
for simple programs. For conventional class-based examples and broad
tooling compatibility, use:

``` java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

Compile and run the conventional form:

``` bash
javac Hello.java
java Hello
```

Use the launch form supported by the installed JDK and the exact source
style you choose. For projects, prefer a build tool and an explicit
project structure over compiling individual files manually.

------------------------------------------------------------------------

## 3. Types, Variables, and Operators

### Primitive and reference types

Java has eight primitive types:

Type Typical use
  ----------- ----------------------------------------
`byte`      Small signed integer
`short`     Short signed integer
`int`       General-purpose integer
`long`      Large signed integer
`float`     Single-precision floating-point number
`double`    Double-precision floating-point number
`char`      UTF-16 code unit
`boolean`   `true` or `false`

All other types are reference types, including classes, interfaces,
arrays, enums, records, and `String`. A reference variable holds a
reference to an object or `null`; it is not the object itself.

``` java
int quantity = 3;                 // Primitive value
String name = "Amina";            // Reference to a String object
int[] quantities = {2, 3, 5};     // Reference to an array object
```

A primitive variable contains its primitive value. A reference variable
can refer to an object; multiple variables can refer to the same object.

### Variables: local, instance, and static

- **Local variable:** Declared inside a method, constructor, or block.
  It must be definitely assigned before it is read; it does not
  automatically receive a usable default value.
- **Instance field:** Belongs to each object. Every instance has its
  own field state unless the field refers to shared data.
- **Static field:** Belongs to the class and is shared by instances of
  that class.

``` java
class Counter {
    private static int createdCount; // Shared by all Counter objects
    private int value;               // Separate value for each object

    Counter() {
        createdCount++;
    }

    int value() {
        return value;
    }

    void increment() {
        value++;
    }

    static int createdCount() {
        return createdCount;
    }
}
```

Prefer accessing static members through the class name, such as
`Counter.createdCount()`, rather than through an instance.

### Default field values

Fields receive default values when an object or class is initialized:
numeric primitives become zero, `boolean` becomes `false`, and reference
fields become `null`. Local variables do not receive these defaults in a
way that permits reading them before assignment.

Do not confuse a field's default value with a constructor's
responsibility. Constructors establish the object's intended initial
state; robust constructors usually validate inputs and initialize
required fields explicitly.

### `var` and type inference

Local-variable type inference allows the compiler to infer a local
variable's static type from its initializer:

``` java
var message = "Hello"; // Inferred type: String
var count = 3;         // Inferred type: int
```

`var` does not make Java dynamically typed. The inferred type is fixed
at compile time. A local `var` declaration needs an initializer, and
`var` is not a replacement for a type in every declaration context.

### Primitive wrappers and boxing

Each primitive has a corresponding wrapper class, such as
`int`/`Integer` and `double`/`Double`. Wrappers are objects and are
needed when a type parameter or API requires a reference type.

``` java
Integer count = 10; // Boxing: int value becomes an Integer
int value = count;  // Unboxing: Integer becomes int
```

Java performs boxing and unboxing automatically in many contexts.
Unboxing a `null` wrapper throws `NullPointerException`. For numerical
calculations involving money, do not rely on binary floating-point types
such as `double` for exact decimal arithmetic; consider `BigDecimal`
with an explicit rounding policy.

### `null` and equality

`null` means a reference does not refer to an object. Calling an
instance method through a null reference throws `NullPointerException`.

For primitives, `==` compares values. For references, `==` compares
whether both references identify the same object (or are both `null`).
Use `equals` when you want logical equality and the type defines it
appropriately:

``` java
String first = new String("Java");
String second = new String("Java");

System.out.println(first == second);      // false: different objects
System.out.println(first.equals(second)); // true: equal text
```

For null-safe equality, `Objects.equals(a, b)` is often useful.

------------------------------------------------------------------------

## 4. Control Flow and Methods

Control-flow statements include `if`/`else`, `switch`, loops (`for`,
enhanced `for`, `while`, `do-while`), and branching statements such as
`break`, `continue`, and `return`.

A method defines a named operation. Its declaration specifies its name,
parameter types, return type, and applicable modifiers.

``` java
static int add(int left, int right) {
    return left + right;
}
```

- `static` means the method belongs to the class rather than an
  instance.
- `int` is the return type.
- `left` and `right` are parameters.
- `return` supplies the result and ends the method call.

Java is **pass-by-value**. For a primitive argument, the primitive value
is copied into the parameter. For an object argument, the reference
value is copied: the method can mutate the referenced object, but
reassigning the parameter does not reassign the caller's variable.

### Overloading

Methods can share a name if their parameter lists differ in a way that
distinguishes their signatures. Changing only the return type does not
create a valid overload.

``` java
static int format(int value) {
    return value;
}

static String format(String value) {
    return "[" + value + "]";
}
```

Overload resolution is performed by the compiler using the declared
types and applicable conversion rules.

------------------------------------------------------------------------

## 5. Arrays and Varargs

### Arrays

An array is an object with a fixed length. Its elements all have the
same component type, which may be a primitive type or a reference type.
Indexing begins at zero.

``` java
int[] scores = {82, 91, 77};

System.out.println(scores[0]);       // 82
System.out.println(scores.length);   // 3
```

An invalid index causes `ArrayIndexOutOfBoundsException`. A
reference-type array can contain `null` elements.

Arrays are fixed-size; assigning a new array to the same variable does
not resize the original array. Use a collection such as `ArrayList` when
you need a resizable sequence.

### Multidimensional arrays

Java multidimensional arrays are arrays whose elements may themselves be
arrays. Rows can therefore have different lengths or be `null`.

``` java
int[][] grid = {
    {1, 2, 3},
    {4, 5},
    {6}
};
```

The declaration `new int[3][2]` creates an array of three rows, each
containing two integers. The declaration `new int[3][]` creates the
outer array but leaves each row reference initially `null`.

### Sorting and searching

`java.util.Arrays` provides static utility methods for sorting,
searching, filling, and comparing arrays.

``` java
import java.util.Arrays;

int[] numbers = {7, 2, 5};
Arrays.sort(numbers);
int index = Arrays.binarySearch(numbers, 5);
```

Binary search requires the array to be sorted according to the same
ordering used for the search. If the value is absent, `binarySearch`
returns a negative insertion-point encoding; it does not simply return
`-1` in every case.

### Varargs

A varargs parameter allows a method to receive zero or more arguments of
one declared element type:

``` java
static int sum(int... values) {
    int total = 0;
    for (int value : values) {
        total += value;
    }
    return total;
}
```

A varargs parameter is treated as an array inside the method and must be
the final parameter in the parameter list.

------------------------------------------------------------------------

## 6. Classes and Objects

### Class versus object

A **class** declares a type: its fields, constructors, and methods. An **object** is a runtime instance of a class. One
class can be used to
create many objects, each with its own instance state.

``` java
class BankAccount {
    private final String owner;
    private long balanceInCents;

    BankAccount(String owner, long openingBalanceInCents) {
        if (owner == null || owner.isBlank()) {
            throw new IllegalArgumentException("Owner is required");
        }
        if (openingBalanceInCents < 0) {
            throw new IllegalArgumentException("Opening balance cannot be negative");
        }

        this.owner = owner;
        this.balanceInCents = openingBalanceInCents;
    }

    String owner() {
        return owner;
    }

    long balanceInCents() {
        return balanceInCents;
    }

    void deposit(long amountInCents) {
        if (amountInCents <= 0) {
            throw new IllegalArgumentException("Deposit must be positive");
        }
        balanceInCents += amountInCents;
    }
}
```

`new BankAccount(...)` creates an object and invokes a constructor. The
reference variable stores a reference to that object.

### Constructors

A constructor has the same name as the class and has no return type. It
initializes an object as part of object creation. Constructors can be
overloaded.

If a class declares **no constructor at all**, the compiler provides a
no-argument default constructor. If you declare any constructor, that
automatic default constructor is not provided.

Use `this.field` to distinguish an instance field from a parameter with
the same name. `this(...)` invokes another constructor in the same class
and, in traditional constructor syntax, must be the first constructor
invocation. A constructor may also invoke a superclass constructor with
`super(...)`. Modern Java has expanded constructor-body rules in recent
releases, so consult the target release's language specification when
using advanced initialization patterns; simple examples should keep
constructor invocations first.

### Initialization order

For ordinary class initialization, understand these principles:

1. Static field initializers and static initializer blocks execute once
   when the class is initialized, in textual order.
2. When an instance is created, instance fields and instance
   initializer blocks execute in textual order as part of construction.
3. The superclass portion is initialized before the subclass's instance
   initialization and constructor body.
4. The constructor body completes the initialization work for that
   class.

Initialization order can become subtle with inheritance. Keep field
initializers simple and avoid calling overridable methods from
constructors.

### `static` fields and methods

A static member belongs to the class, not to a particular instance. Use
it for behavior or state that genuinely applies to the class as a whole.
Static mutable state can introduce hidden coupling and concurrency
problems, so it should not be used as a default substitute for object
design.

### `final`

- A `final` local variable or field can be assigned only once.
- A `final` method cannot be overridden by a subclass.
- A `final` class cannot be subclassed.

A final reference cannot be reassigned, but that does **not**
automatically make the referenced object immutable.

### Records

A record is a concise way to declare a class whose primary purpose is to
carry data:

``` java
record Person(String name, int age) {}
```

The compiler provides component accessors, a canonical constructor, and
implementations of `equals`, `hashCode`, and `toString`. Records are
implicitly final and their component fields are final, but a record is
not automatically deeply immutable if a component refers to a mutable
object.

### Enums

An enum defines a fixed set of named constants:

``` java
enum Status {
    NEW,
    IN_PROGRESS,
    COMPLETE
}
```

Enums are types, not merely integer constants. They can also have
fields, constructors, and methods. Their constructors are not called
directly by application code.

------------------------------------------------------------------------

## 7. Encapsulation and Access Control

### Encapsulation

Encapsulation combines state and behavior and controls how callers
interact with an object. **Data hiding** is the practice of preventing
callers from depending on internal representation.

Private fields are common, but encapsulation is not simply "add getters
and setters to every field." Expose operations that preserve the
object's rules and invariants.

For example, a bank account should expose `deposit(amount)` rather than
allow arbitrary assignment to its balance. This keeps validation close
to the state it protects.

### Access modifiers

  -----------------------------------------------------------------------
Modifier Access
  ----------------------------------- -----------------------------------
`public`                            Accessible wherever the declaring
type/member is accessible

`protected`                         Accessible in the same package, and
under subclass-specific rules from
other packages

No modifier (package-private)       Accessible only within the same
package

`private`                           Accessible within the declaring
top-level class's permitted
private-access scope, including
nested types as allowed by Java
  -----------------------------------------------------------------------

Top-level classes and interfaces can generally be `public` or
package-private. Member access rules are more nuanced than a simple
"protected means all subclasses can access it": cross-package protected
access is subject to rules involving the accessing subclass and the
qualifying reference type.

Choose the least permissive visibility that meets the design
requirement. Public APIs are compatibility commitments.

------------------------------------------------------------------------

## 8. Inheritance and Polymorphism

### Inheritance

A class uses `extends` to inherit from one direct superclass. Java
classes have single class inheritance, though a class may implement
multiple interfaces.

Inheritance expresses an "is-a" relationship. Use it when the subtype
can honor the behavioral contract of its parent. Do not use inheritance
only to reuse a few lines of code; composition is often a better choice.

``` java
class Animal {
    void makeSound() {
        System.out.println("Some sound");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Bark");
    }
}
```

### Polymorphism and dynamic dispatch

A reference can be declared using a superclass or interface type while
referring to an instance of a concrete subtype:

``` java
Animal animal = new Dog();
animal.makeSound(); // Bark
```

The compiler checks which operations are available through the declared
type (`Animal`). At runtime, an overridden instance method is selected
according to the actual object's class. This is dynamic method dispatch.

Polymorphism allows code to work with a contract rather than a specific
implementation.

### Overriding and `@Override`

Overriding supplies a subtype-specific implementation of an inherited
instance method. The overriding method must obey Java's rules for
signature, return type, visibility, and checked exceptions. Static
methods are hidden rather than overridden; private methods are not
overridden.

Use `@Override` so the compiler can detect mistakes such as misspelling
a method name or accidentally changing its parameter list.

### Casting and `instanceof`

Upcasting to a superclass or interface is generally safe:

``` java
Animal animal = new Dog();
```

Down-casting asserts that the object is actually compatible with the more
specific type. An invalid cast throws `ClassCastException`. Prefer
polymorphic operations and pattern matching for `instanceof` when a type
test is genuinely required:

``` java
if (animal instanceof Dog dog) {
    dog.makeSound();
}
```

Avoid unnecessary casts; they often indicate that the abstraction is too
weak or the design needs reconsideration.

### `Object`, `equals`, and `hashCode`

Every ordinary Java class ultimately inherits from `Object`. Important
methods include `toString`, `equals`, and `hashCode`.

- The default `equals` implementation compares object identity.
- A class may override `equals` to define logical equality.
- If two objects are equal according to `equals`, they must return the
  same `hashCode`.
- Unequal objects may share a hash code.
- If equality is overridden, `hashCode` must be implemented
  consistently, especially for hash-based collections.

Records generate value-based equality using their components by default.

------------------------------------------------------------------------

## 9. Abstract Classes and Interfaces

### Abstract classes

An abstract class cannot be instantiated directly. It can contain
fields, constructors, implemented methods, and abstract methods. A
concrete subclass must provide implementations for all inherited
abstract methods that remain unimplemented.

Use an abstract class when related types need a shared base
implementation or shared instance state.

### Interfaces

An interface declares a contract that classes can implement. A class can
implement multiple interfaces even though it can extend only one class.

``` java
interface Payable {
    long amountDueInCents();
}

class Invoice implements Payable {
    private final long amountDueInCents;

    Invoice(long amountDueInCents) {
        this.amountDueInCents = amountDueInCents;
    }

    @Override
    public long amountDueInCents() {
        return amountDueInCents;
    }
}
```

Interface abstract methods are implicitly public. Implementations must
be public; an implementation cannot reduce the visibility of the
interface method.

Interfaces may also contain: - `default` methods, which provide an
inherited implementation; - `static` methods, called through the
interface name; - `private` helper methods, used internally by interface
methods.

Interface fields are implicitly `public static final`; they represent
constants, not per-instance state.

### Choosing between them

Prefer an interface when callers need a capability or contract that may
have unrelated implementations. Prefer an abstract class when a family
of related classes benefits from shared instance state or a common
implementation. They can be used together: an abstract class may
implement an interface.

------------------------------------------------------------------------

## 10. Packages and Java Application Structure

A package groups related types, provides a namespace, and participates
in access control. The package declaration normally appears at the top
of a source file:

``` java
package com.example.billing;
```

The directory layout normally mirrors the package name. For example,
`com.example.billing.Invoice` is conventionally stored under
`com/example/billing/Invoice.java`.

Use imports to refer to types by simple name:

``` java
import java.util.List;
import java.util.ArrayList;
```

A wildcard import such as `import java.util.*;` imports accessible types
in that package; it does not import subpackages. Imports are a
source-level naming convenience and do not bundle libraries into the
application.

### Classpath, modules, and JAR files

- **Classpath:** Tells Java tools and class loaders where to find
  class files and JARs in classpath-based applications.
- **JAR:** An archive commonly used to package class files and
  resources.
- **Java Platform Module System (JPMS):** Introduced in Java 9;
  modules can declare dependencies and which packages they export.

A library is not automatically part of the JDK just because it is
written in Java. Projects normally use a build tool such as Maven or
Gradle to declare dependencies and produce repeatable builds.

------------------------------------------------------------------------

## 11. Generics and Wrapper Types

### Why generics exist

Generics let types and methods be parameterized by other types. They
improve compile-time type safety and reduce explicit casts.

``` java
List<String> names = new ArrayList<>();
names.add("Amina");
// names.add(42); // Compile-time error
String first = names.getFirst();
```

The exact collection API available depends on the selected Java release.
If portability to older releases matters, `names.get(0)` is broadly
supported.

### Generic type parameters

A type parameter such as `T` represents a type supplied by the caller.
Common conventions include `T` (type), `E` (element), `K` (key), `V`
(value), and `R` (result).

The diamond operator `<>` lets the compiler infer generic type arguments
from context:

``` java
List<String> names = new ArrayList<>();
```

Generics use reference types, not primitive types. Use `List<Integer>`,
not `List<int>`; boxing and unboxing bridge the primitive and wrapper
forms.

### Type erasure and limitations

Java implements most generics through type erasure. Generic type
information is used for compile-time checking, but many parameterized
types do not exist as distinct runtime classes. Consequently, you
generally cannot write `new T()` or `new List<String>[10]`, and you
cannot use a primitive type as a generic type argument.

### Comparable and Comparator

`Comparable<T>` defines a type's natural ordering through `compareTo`.
`Comparator<T>` defines an ordering externally and allows multiple ways
to sort the same type.

``` java
import java.util.Comparator;

record Employee(String name, int age) {}

Comparator<Employee> byAge =
        Comparator.comparingInt(Employee::age);

Comparator<Employee> byName =
        Comparator.comparing(Employee::name);
```

Prefer comparator factory methods over subtracting numbers to compare
them; subtraction can overflow. Comparators used with sorted sets and
maps should be consistent with the equality behavior expected by the
application.

------------------------------------------------------------------------

## 12. Collections Framework

The Collections Framework provides interfaces and implementations for
storing and working with groups of objects. `Map` belongs to the
framework but is not a subtype of `Collection`.

### Arrays versus collections

  -----------------------------------------------------------------------
Property Array Collection
  ----------------------- ----------------------- -----------------------
Size Fixed after creation Usually resizable

Elements Primitive values or References; primitives
references use wrappers

Access Index syntax for arrays API methods; index
access depends on the
collection

Typical use Fixed-size data, Dynamic groups, sets,
low-level APIs queues, maps
  -----------------------------------------------------------------------

Collections are generic, so prefer declarations such as `List<String>`
over raw types such as `List`. Raw types discard generic type checking
and can produce runtime type errors.

### Core interfaces and typical implementations

  -----------------------------------------------------------------------
Interface Main idea Common implementations
  ----------------------- ----------------------- -----------------------
`List<E>`               Ordered sequence;       `ArrayList`,
duplicates allowed      `LinkedList`

`Set<E>`                No duplicate elements   `HashSet`,
according to its        `LinkedHashSet`,
equality/ordering rules `TreeSet`

`Queue<E>`              Usually processes       `ArrayDeque`,
elements in a defined   `PriorityQueue`,
queue order             `ArrayBlockingQueue`

`Deque<E>`              Supports                `ArrayDeque`,
insertion/removal at    `LinkedList`
both ends

`Map<K,V>`              Key-value associations; `HashMap`,
keys are unique         `LinkedHashMap`,
`TreeMap`
  -----------------------------------------------------------------------

### `List`

A `List` preserves sequence order and permits duplicates. `ArrayList` is
the usual default for a general-purpose list because indexed access is
fast and appending is efficient on average. Inserting or removing
elements near the beginning or middle can require shifting elements.

`LinkedList` has different performance characteristics, but it is not
automatically faster for middle insertion: locating the position still
requires traversal. Choose it only when its actual operation profile is
beneficial.

### `Set`

A set does not permit duplicate elements according to its
implementation's equality or ordering rules.

- `HashSet` does not guarantee iteration order.
- `LinkedHashSet` maintains a defined encounter order, normally
  insertion order.
- `TreeSet` keeps elements sorted according to natural ordering or a
  supplied comparator.

For `HashSet`, implement `equals` and `hashCode` consistently. For
`TreeSet`, the comparator or natural ordering determines whether two
values occupy the same sorted-set position.

### `Queue` and `Deque`

A queue represents a processing order. For many queue operations, Java
provides two forms:

- `add`, `remove`, and `element` may throw an exception when the
  operation cannot be completed.
- `offer`, `poll`, and `peek` return a special failure value instead.

`ArrayDeque` is a common non-thread-safe implementation for queue and
stack-like behavior. It does not permit `null` elements. `PriorityQueue`
retrieves elements according to priority ordering, not FIFO arrival
order. `ArrayBlockingQueue` is a bounded, thread-safe queue useful for
coordination between threads.

### `Map`

A map stores key-value pairs. Keys are unique; values may be duplicated.

- `HashMap` does not guarantee iteration order.
- `LinkedHashMap` maintains a defined encounter order.
- `TreeMap` orders keys by natural ordering or a comparator.

Map keys should have stable equality and hash-code behavior while they
are stored in a hash-based map.

### Iterators and modifying collections

An `Iterator<E>` provides `hasNext()` and `next()`, and may support
`remove()` when the implementation allows it. Enhanced `for` loops are
often simpler for read-only traversal.

Do not structurally modify most collections through the collection
itself while iterating with an iterator unless the API explicitly
supports that pattern. Use the iterator's supported removal operation or
an appropriate bulk operation. Fail-fast behavior is a best-effort
bug-detection mechanism, not a thread-safety guarantee.

### Immutable and unmodifiable collections

An unmodifiable view prevents mutation through that view, but the
underlying collection may still change. An immutable collection factory
such as `List.of(...)` does not expose mutation operations and rejects
`null` elements. Neither concept necessarily makes mutable objects
stored inside the collection deeply immutable.

------------------------------------------------------------------------

## 13. Lambdas and Functional Interfaces

### Functional interfaces

A functional interface has one abstract method (ignoring methods that
match public methods of `Object`). It can be implemented by a lambda
expression or method reference. `@FunctionalInterface` asks the compiler
to verify that the interface meets the rule.

``` java
@FunctionalInterface
interface Greeting {
    String greet(String name);
}
```

### Lambda expressions

A lambda supplies an implementation of a functional interface:

``` java
Greeting greeting = name -> "Hello, " + name;
System.out.println(greeting.greet("Amina"));
```

A lambda is not a freestanding function type in Java; its target type
is a functional interface. The compiler infers parameter types from that
target type in many contexts.

### Common functional interfaces

  -----------------------------------------------------------------------
Interface Main method Purpose
  ----------------------- ----------------------- -----------------------
`Predicate<T>`          `boolean test(T)`       Test a condition

`Function<T,R>`         `R apply(T)`            Transform a value

`Consumer<T>`           `void accept(T)`        Consume a value without
returning a result

`Supplier<T>`           `T get()`               Provide a value

`UnaryOperator<T>`      `T apply(T)`            Transform a value into
the same type

`BinaryOperator<T>`     `T apply(T,T)`          Combine two values of
the same type
  -----------------------------------------------------------------------

Java also provides primitive-specialized interfaces, such as
`IntPredicate` and `IntFunction<R>`, which can reduce boxing in suitable
code.

### Method references

A method reference is shorthand for a lambda that delegates to an
existing method or constructor:

``` java
names.forEach(System.out::println);
```

Common forms include a static method reference (`Integer::parseInt`), a
bound instance method reference (`System.out::println`), an unbound
instance method reference (`String::length` in a compatible context),
and a constructor reference (`ArrayList::new`).

### Variable capture

A lambda may capture local variables only when they are final or
effectively final. Effectively final means the variable is assigned once
and is not subsequently reassigned. This restriction applies to the
local variable binding; it does not make a referenced object immutable
or thread-safe.

### Default and static interface methods

An interface can declare default methods with an implementation and
static methods called through the interface name. These features support
API evolution and related behavior. They do not turn interfaces into
ordinary classes or allow interface instances to be constructed
directly.

------------------------------------------------------------------------

## 14. Exception Handling

An exception represents an event that interrupts the normal flow of
execution. Java represents exceptions and serious runtime errors using
`Throwable`.

### Exception hierarchy

``` text
Throwable
├── Error
└── Exception
    └── RuntimeException
```

- **`Error`:** Indicates serious conditions that applications
  generally should not attempt to handle as routine business failures.
- **Checked exception:** An exception other than `RuntimeException`
  and its subclasses, and other than `Error` and its subclasses. A
  method must catch it or declare it in its `throws` clause, subject
  to Java's compile-time rules.
- **Unchecked exception:** `RuntimeException` and its subclasses. The
  compiler does not require callers to catch or declare them.

The hierarchy is simplified here; there are many subclasses. Choose
exception types that express the failure meaningfully.

### `try`, `catch`, and `finally`

``` java
try {
    int result = Integer.parseInt("not a number");
    System.out.println(result);
} catch (NumberFormatException exception) {
    System.err.println("Input must be an integer.");
} finally {
    System.out.println("This cleanup section normally runs.");
}
```

Catch the most specific exception that you can handle meaningfully.
Avoid catching `Exception` or `Throwable` merely to hide a failure. A
`finally` block normally runs when control leaves the `try` statement,
but it is not an absolute guarantee under abrupt JVM or process
termination.

### `throw` and `throws`

- `throw` throws an exception object.
- `throws` declares exception types that a method or constructor may
  propagate.

``` java
static void requirePositive(int value) {
    if (value <= 0) {
        throw new IllegalArgumentException("Value must be positive");
    }
}
```

Use `IllegalArgumentException` for invalid method arguments when
appropriate. Do not use exceptions as the ordinary mechanism for
expected branching.

### Try-with-resources

Use try-with-resources for resources implementing `AutoCloseable`, such
as many file and stream APIs. Resources are closed automatically when
the block exits, including when an exception occurs.

``` java
try (var reader = java.nio.file.Files.newBufferedReader(
        java.nio.file.Path.of("input.txt"))) {
    System.out.println(reader.readLine());
} catch (java.io.IOException exception) {
    System.err.println("Could not read the file: " + exception.getMessage());
}
```

### Custom exceptions and exception chaining

Create a custom exception when it gives callers meaningful information
or a useful recovery boundary. When translating a lower-level failure
into a higher-level one, preserve the original exception as the cause:

``` java
throw new IllegalStateException("Could not load customer", cause);
```

Preserving the cause makes diagnostics possible. Do not silently discard
exceptions or expose sensitive internal details to end users.

------------------------------------------------------------------------

## 15. Memory and Garbage Collection

### References, objects, and memory

A reference variable is not the object itself. Multiple references can
point to the same object, so a mutation through one reference may be
visible through another.

The JVM uses memory areas with different roles, including stacks for
execution frames and a heap for objects. This is a useful conceptual
model, but it is too simplistic to say that all local variables or
references are always physically stored on a stack: implementation
optimizations can change physical placement without changing Java's
observable behavior.

### Garbage collection

The garbage collector automatically reclaims heap memory occupied by
objects that are no longer reachable under the JVM's reachability rules.
An object becomes eligible for collection when it is no longer
reachable, but collection timing is not guaranteed.

Setting a variable to `null` does not force collection and is usually
unnecessary for short-lived local variables. `System.gc()` is only a
request or suggestion to the runtime; it does not guarantee that a
particular object will be collected.

### Memory leaks in managed languages

Java can still have memory leaks when the application unintentionally
retains references to objects it no longer needs. Common causes include
unbounded static collections, listeners that are never deregistered,
caches without eviction policies, and long-lived objects retaining large
object graphs.

Garbage collection cannot reclaim an object that remains reachable, even
if the application no longer considers it useful.

### Resource management is different from memory management

Garbage collection is not a substitute for closing files, sockets,
database connections, or other external resources. Use
try-with-resources for resources that implement `AutoCloseable`, and
follow the lifecycle rules of the API being used.

------------------------------------------------------------------------

## 16. Coding Conventions and Best Practices

- Use `UpperCamelCase` for class, interface, enum, and record names.
- Use `lowerCamelCase` for variables and method names.
- Use uppercase names with underscores for constants, conventionally
  `static final` fields whose values represent constants.
- Keep fields private unless a clear design reason requires broader
  visibility.
- Prefer meaningful names and small methods with a clear purpose.
- Validate inputs at boundaries and maintain class invariants.
- Prefer interfaces in variable and parameter declarations when the
  implementation is not part of the contract, for example
  `List<String> names = new ArrayList<>();`.
- Prefer composition to inheritance unless the subtype relationship
  is behaviorally sound.
- Use generics; avoid raw collections.
- Use `try-with-resources` for closeable resources.
- Do not catch exceptions merely to log and ignore them.
- Do not use mutable static fields as a substitute for explicit
  dependencies.
- Use `BigDecimal` or integer minor units for exact monetary values,
  with an explicit rounding policy.
- Write tests for observable behavior, including invalid inputs and
  boundary cases.
- Use a build tool and a consistent formatter/linter for non-trivial
  projects.

------------------------------------------------------------------------
