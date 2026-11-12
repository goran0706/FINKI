# C++ Classes and Objects

## Table of Contents

1. [Foundational Concepts](#1-foundational-concepts)
2. [Class Fundamentals](#2-class-fundamentals)
3. [Constructors and Object Lifetime](#3-constructors-and-object-lifetime)
4. [Destructors and Resource Management](#4-destructors-and-resource-management)
5. [Access Control and Encapsulation](#5-access-control-and-encapsulation)
6. [Member Functions and the `this` Pointer](#6-member-functions-and-the-this-pointer)
7. [Operator Overloading](#7-operator-overloading)
8. [Copy Semantics](#8-copy-semantics)
9. [Move Semantics and Rvalue References](#9-move-semantics-and-rvalue-references)
10. [Inheritance and Type Hierarchies](#10-inheritance-and-type-hierarchies)
11. [Polymorphism Through Virtual Functions](#11-polymorphism-through-virtual-functions)
12. [Abstract Classes and Interfaces](#12-abstract-classes-and-interfaces)
13. [Object Relationships and Composition](#13-object-relationships-and-composition)
14. [Smart Pointers and Automatic Resource Management](#14-smart-pointers-and-automatic-resource-management)
15. [The Rule of Zero, Three, and Five](#15-the-rule-of-zero-three-and-five)
16. [Modern C++ Class Features](#16-modern-c-class-features)
17. [Exception Safety and RAII](#17-exception-safety-and-raii)
18. [Design Principles and Best Practices](#18-design-principles-and-best-practices)

---

## 1. Foundational Concepts

### 1.1 What Is a Class?

A **class** in C++ is fundamentally a user-defined type that encapsulates data and the operations that can be performed
on that data. This concept, central to object-oriented programming, represents an evolution from C's struct-based
procedural approach. Bjarne Stroustrup designed classes to provide abstraction mechanisms that allow programmers to
create types that are as natural to use as built-in types while maintaining the efficiency that C is known for.

At its core, a class defines a new type in your program's type system. When you declare a class, you are essentially
teaching the compiler about a new kind of entity that will exist in your program. This entity has properties (data
members) and behaviors (member functions). The class serves as a blueprint or template from which individual objects (
instances) can be created.

Consider the conceptual difference between a class and an object: a class is the abstract definition, while an object is
a concrete instantiation of that definition. If we define a class `BankAccount`, the class itself describes what it
means to be a bank account—it has an account number, a balance, and operations like deposit and withdraw. When we create
a specific `BankAccount` object, we're creating a particular account with its own unique account number and balance.

The power of classes lies in their ability to combine data and functionality into a single cohesive unit. This is in
stark contrast to C-style programming, where data structures and the functions that operate on them are separate
entities. Classes enforce a tighter coupling between data and behavior, which, when done correctly, leads to more
maintainable and understandable code.

Understanding this fundamental concept is crucial: a class is not just a collection of variables and functions grouped
together. It represents a complete abstraction of a real-world or conceptual entity, with carefully controlled
interfaces and internal implementation details that remain hidden from users of the class. This separation between
interface (what the class does) and implementation (how it does it) is one of the most powerful aspects of
object-oriented design.

```cpp
// A minimal class definition demonstrating the concept
class Point {
   private:
       double x;  // Data member (property)
       double y;  // Data member (property)
       
   public:
       // Member function (behavior)
       double distanceFromOrigin() const {
           return std::sqrt(x * x + y * y);
       }
};
```

In this simple example, `Point` is a class that binds together the coordinates `x` and `y` with operations that make
sense for a point, such as calculating its distance from the origin. The class creates a new type in our program's
vocabulary—we can now speak of `Point` objects as naturally as we speak of `int` or `double` values.

### 1.2 The Philosophy Behind Classes

The design of C++ classes reflects several key philosophical principles that distinguish object-oriented programming
from procedural programming. Understanding these principles is crucial for effective use of classes, as they inform
design decisions and help you write more robust, maintainable code.

**Abstraction** is perhaps the most fundamental principle. Classes provide data abstraction, allowing programmers to
work at a higher level of conceptual organization. When using a `std::vector`, you think in terms of "adding an element"
rather than "reallocating memory and copying bytes." The class abstracts away the implementation details and presents a
clean interface. This abstraction allows you to focus on *what* you want to accomplish rather than *how* to accomplish
it at a low level. The beauty of abstraction is that it allows the implementation to evolve and improve over time
without affecting code that uses the abstraction.

**Encapsulation** works hand-in-hand with abstraction. By controlling access to an object's internal state through
access specifiers (`private`, `protected`, `public`), classes enforce boundaries between the implementation and the
interface. This separation allows the implementation to change without affecting code that uses the class, a principle
known as *information hiding*. When you make data members private and provide public methods to access them, you create
a contract with users of your class: they can rely on the interface remaining stable, while you retain the freedom to
change how things work internally. This flexibility is invaluable in large software systems where changes are
inevitable.

**Type Safety** is another critical aspect of C++ classes. Classes integrate with C++'s type system, enabling
compile-time checking of operations. When you define a class, you're defining what operations are valid on objects of
that type. The compiler can verify that your code only performs legal operations, catching many errors before runtime.
This compile-time checking is a significant advantage over dynamically typed languages, where such errors only surface
during execution. The type system also enables function overloading and template specialization, powerful tools for
writing generic yet type-safe code.

**Resource Management** is where classes truly shine in C++. Classes are the primary mechanism for implementing Resource
Acquisition Is Initialization (RAII), a fundamental C++ idiom. By tying resource lifetime to object lifetime, classes
make it natural to write exception-safe code that doesn't leak resources. When an object is destroyed, its destructor is
automatically called, releasing any resources it owns. This automatic cleanup is guaranteed even in the presence of
exceptions, a property that's difficult to achieve with manual resource management.

These philosophical principles work together to create a programming paradigm where objects model concepts from your
problem domain, making programs more intuitive to write, read, and maintain. The key insight is that classes are not
just about code organization—they're about modeling reality in a way that the computer can enforce and verify.

### 1.3 Classes vs Structs in C++

One of the most common questions beginners ask is: "What's the difference between a class and a struct in C++?" The
answer is deceptively simple: the only difference is the default access level. In a `struct`, members are public by
default; in a `class`, members are private by default.

```cpp
// These two definitions are functionally equivalent

struct PointStruct {
    double x, y;     // Public by default
};

class PointClass {
   public:
       double x, y;  // Must explicitly specify public
};
```

However, this technical equivalence masks an important stylistic convention in C++ programming. The distinction between
`struct` and `class` carries semantic weight that communicates intent to other programmers.

Idiomatic C++ uses `struct` for passive data structures—types that are essentially collections of related data with
little or no invariant to maintain. A `struct` signals to readers that the type is a simple aggregate where all data is
public and there are no complex behaviors. Think of it as a "Plain Old Data" type (POD) or a simple record type. When
you see a `struct`, you expect to be able to access and modify its members directly without going through accessor
methods.

Conversely, `class` is used when you need to maintain invariants, hide implementation details, or provide significant
behavioral functionality. A class represents an abstraction with a well-defined interface and a protected internal
state. The use of `class` signals that there's more going on than simple data aggregation—there are rules about how the
data can be accessed and modified, and the class enforces those rules.

This convention is more than mere style—it provides valuable documentation. When reading code, seeing `struct`
immediately tells you that you're dealing with simple data, while `class` indicates that you need to understand the
abstraction and its interface. Violating this convention can confuse readers and lead to misuse of your types.

```cpp
// Appropriate use of struct - simple data aggregate
struct Color {
    unsigned char red;
    unsigned char green;
    unsigned char blue;
    unsigned char alpha;
};

// Appropriate use of class - maintains invariants
class BankAccount {
   private:
       double balance;  // Must remain non-negative
       std::string accountNumber;
       
   public:
       void deposit(double amount) {
           if (amount > 0) {
               balance += amount;
           }
       }
       
       bool withdraw(double amount) {
           if (amount > 0 && amount <= balance) {
               balance -= amount;
               return true;
           }
           return false;
       }
};
```

The `BankAccount` class enforces the invariant that the balance cannot be negative and that the account number cannot be
modified after creation. These constraints would be difficult to maintain if the data were public. The `Color` struct,
on the other hand, is just a convenient grouping of related values with no constraints to enforce—any combination of RGB
values is valid.

This convention is not a hard rule but rather a guideline that helps communicate intent. When you see a `struct`, you
expect a simple data holder. When you see a `class`, you expect encapsulation and behavior. Following this convention
makes your code more readable and helps prevent misuse of your types.

---

## 2. Class Fundamentals

### 2.1 Class Declaration and Definition

In C++, there is an important distinction between declaring a class and defining it. Understanding this distinction is
crucial for managing dependencies and compilation times in larger projects.

A **class declaration** introduces the class name into a scope and tells the compiler that a class of this name exists.
This is also known as a *forward declaration*. A class declaration allows the compiler to know that a type exists
without knowing its complete structure. This incomplete type information is sufficient for certain uses, particularly
when working with pointers or references to the type.

A **class definition** provides the complete specification of the class, including all its members—both data and
functions. The definition tells the compiler everything it needs to know about the class's size, layout, and interface.

The distinction matters because C++ requires the compiler to know the size of an object when allocating storage for it.
Pointers and references have a fixed size regardless of what they point to, so the complete class definition isn't
needed for pointer or reference declarations. However, to create an actual object or call member functions, the compiler
must see the complete definition.

**Forward Declaration**: You can declare a class without defining it, which is useful for breaking circular dependencies
and reducing compilation dependencies:

```cpp
// Forward declaration
class Account;

// Now we can use Account* or Account& in class declarations
class Transaction {
   private:
       Account* sourceAccount;  // OK - only pointer
       // Account source;       // ERROR - needs complete type
 
   public:
       void process();
};

// Later, provide the full definition
class Account {
   private:
       double balance;
       std::vector<Transaction*> transactions;
 
   public:
       void addTransaction(Transaction* t);
};
```

This pattern is particularly important in large codebases where you want to minimize header dependencies. By using
forward declarations in header files and only including the full definitions in source files, you can significantly
reduce compilation times. When a header changes, only the files that directly include it need to be recompiled, not
every file that transitively depends on it.

There's also a practical consideration: forward declarations help break circular dependencies. If class A needs to know
about class B, and class B needs to know about class A, at least one of them must use forward declaration and
pointers/references rather than direct inclusion and member objects.

**Complete Definition**: A complete class definition specifies all data members and member functions:

```cpp
class Rectangle {
   private:
       // Data members
       double width;
       double height;
       
   public:
       // Constructor
       Rectangle(double w, double h) : width(w), height(h) {}
       
       // Member functions
       double area() const {
           return width * height;
       }
       
       double perimeter() const {
           return 2 * (width + height);
       }
       
       void scale(double factor) {
           width *= factor;
           height *= factor;
       }
};
```

This definition tells the compiler everything it needs to know about `Rectangle`: its size (two `double` values), its
alignment requirements, and what operations can be performed on it. With this information, the compiler can generate
code for creating `Rectangle` objects, calling their methods, and managing their memory.

### 2.2 Data Members

Data members, also called *member variables* or *instance variables*, represent the state of an object. Each object of a
class has its own copy of the data members (except for static members, which we'll discuss later). The collective values
of an object's data members define that object's current state.

The design of data members is a critical aspect of class design. You should aim to represent the minimal set of
information needed to define an object's state. Derived or computed values should generally be calculated on demand
rather than stored, unless performance profiling demonstrates otherwise. This principle helps maintain class invariants
and reduces the risk of inconsistent state.

The types of data members can be anything: built-in types, other class types, pointers, references (with limitations),
or arrays. The choice of types and their organization determines the object's memory layout and size. The compiler
arranges data members in memory in the order they're declared, though it may add padding for alignment purposes.

```cpp
class Student {
   private:
       std::string name;           // String object
       int studentId;              // Built-in type
       std::vector<double> grades; // Container
       const int enrollmentYear;   // Const member
       
   public:
       Student(std::string n, int id, int year)
           : name(std::move(n)), studentId(id), 
             enrollmentYear(year) {}
};
```

Several important considerations govern the use of data members:

**Order matters for initialization**: Data members are initialized in the order they are declared in the class, not the
order they appear in the constructor's initializer list. This is a subtle but important point that can lead to bugs if
misunderstood. The reason for this rule is consistency—the compiler needs a predictable order for initialization and
destruction, and declaration order provides that consistency. If initialization order depended on the initializer list
order, different constructors could initialize members in different orders, leading to unpredictable behavior.

```cpp
class OrderExample {
    int first;
    int second;
    
public:
    // This looks like second is initialized before first,
    // but actually first is initialized first (declaration order)
    OrderExample(int val) : second(val), first(second + 1) {
        // DANGER: first might be initialized with uninitialized second!
    }
};
```

**Const members**: A `const` data member must be initialized in the constructor's initializer list and cannot be
modified afterward. This is useful for representing immutable properties of an object—characteristics that are set at
creation and never change. For example, a person's birthdate or a file's creation timestamp might be const members.
Note that having const members affects the class's assignability—objects with const members cannot be assigned to after
construction (though they can be copy-constructed).

**Reference members**: Like const members, references must be initialized in the initializer list. Once bound, they
cannot be rebound to refer to a different object. Reference members are less common than pointers because they limit the
class's assignability and move semantics. However, they're useful when an object must always refer to some other object
and that relationship is fundamental to the object's identity.

**Static members**: These belong to the class itself, not to any particular instance. We'll explore them in detail
later, but it's important to understand that static members have fundamentally different lifetime and initialization
semantics than instance members.

The key principle in choosing data members is to represent the minimal set of information needed to define an object's
state. Redundant data increases the risk of inconsistency and makes the class harder to maintain. For example, if you
store both a temperature in Celsius and the same temperature in Fahrenheit, you must ensure they stay synchronized—it's
better to store one and compute the other on demand.

### 2.3 Member Functions

Member functions, also called *methods*, define the operations that can be performed on objects of the class. They have
access to the object's data members and can modify the object's state (unless declared `const`). Member functions are
the primary mechanism through which clients interact with objects—they form the class's public interface.

The fundamental distinction between member functions and free functions is that member functions have an implicit `this`
pointer that refers to the object on which they're called. This gives them direct access to the object's data members
and other member functions without needing to pass the object as an explicit parameter.

There are several ways to define member functions, each with its own implications for code organization and performance:

**Inline Definition**: The function body is provided within the class definition:

```cpp
class Circle {
   private:
       double radius;
       
   public:
       // Inline definition
       double area() const {
           return 3.14159 * radius * radius;
       }
};
```

Functions defined inside the class definition are implicitly `inline`, which is a hint to the compiler that it might
expand the function call inline rather than generate a separate function call. This can improve performance for small,
frequently-called functions by eliminating function call overhead. However, `inline` is just a hint—the compiler may
ignore it if the function is too complex or if inlining would increase code size excessively.

Inline definitions are convenient for very short functions—typically one or two lines—but they have a downside: any
change to the function body requires recompiling all files that include the header. For larger functions or functions
that change frequently, out-of-line definitions are preferable.

**Out-of-line Definition**: The function is declared in the class but defined separately:

```cpp
class Circle {
   private:
       double radius;
 
   public:
       double area() const;  // Declaration
       double circumference() const;
};

// Definitions outside the class
double Circle::area() const {
    return 3.14159 * radius * radius;
}

double Circle::circumference() const {
    return 2 * 3.14159 * radius;
}
```

The **scope resolution operator** `::` connects the function definition to the class. This is the preferred approach for
larger functions or when separating interface (header file) from implementation (source file). This separation is
important for managing compilation dependencies—changes to the implementation don't require recompiling code that uses
the class.

Out-of-line definitions also help keep the class definition clean and focused. A class definition should clearly
communicate the class's interface—what operations are available and what they do. Long function bodies obscure this
interface, making the class harder to understand at a glance.

**Const Member Functions**: Functions marked `const` promise not to modify the object's state:

```cpp
class Point {
   private:
       double x, y;
 
   public:
       // Const member function - promises not to modify x or y
       double magnitude() const {
           return std::sqrt(x * x + y * y);
       }
       
       // Non-const member function - can modify state
       void normalize() {
           double mag = magnitude();
           if (mag != 0) {
               x /= mag;
               y /= mag;
           }
       }
};
```

The `const` qualifier is part of the function's type signature. A const object can only call const member functions.
This const-correctness is crucial for writing robust code—it allows the compiler to enforce your intention that certain
operations do not modify the object's state.

Const-correctness propagates through your code. If a function takes a `const` reference to an object, it can only call
that object's const member functions. This enforces a clear distinction between operations that observe state (const)
and operations that modify state (non-const). Getting const-correctness right from the beginning is much easier than
retrofitting it later, as it requires changes throughout the codebase.

It's worth noting that const member functions can modify mutable members (marked with the `mutable` keyword) and can
modify objects through pointers or references, even if those objects are logically part of the object's state. This
reflects the distinction between *physical constness* (the bits don't change) and *logical constness* (the observable
state doesn't change). C++ enforces physical constness, but good design requires maintaining logical constness as well.

### 2.4 The Basic Class Structure

Let's examine a complete, well-structured class that demonstrates the fundamental components working together. This
example illustrates several important design principles that we'll explore in depth throughout this guide:

```cpp
class Temperature {
   private:
       // Data members
       double kelvin;  // Stored in absolute temperature
       
       // Private helper function
       bool isValid(double k) const {
           return k >= 0.0;  // Absolute zero check
       }
       
   public:
       // Constructor
       Temperature(double k = 273.15) : kelvin(k) {
           if (!isValid(kelvin)) {
               throw std::invalid_argument("Temperature below absolute zero");
           }
       }
       
       // Const member functions (observers/getters)
       double getCelsius() const {
           return kelvin - 273.15;
       }
       
       double getFahrenheit() const {
           return (kelvin - 273.15) * 9.0/5.0 + 32.0;
       }
       
       double getKelvin() const {
           return kelvin;
       }
       
       // Non-const member functions (mutators/setters)
       void setKelvin(double k) {
           if (!isValid(k)) {
               throw std::invalid_argument("Temperature below absolute zero");
           }
           kelvin = k;
       }
       
       void setCelsius(double c) {
           setKelvin(c + 273.15);
       }
       
       void setFahrenheit(double f) {
           setCelsius((f - 32.0) * 5.0/9.0);
       }
};
```

This class demonstrates several important design principles that distinguish well-crafted classes from poorly designed
ones:

**Single Representation**: The temperature is stored internally in Kelvin, the SI unit. This design decision reflects an
important principle: avoid redundant storage. We could have stored the temperature in three different units (Kelvin,
Celsius, and Fahrenheit), but that would create opportunities for inconsistency. What if someone modifies one value but
forgets to update the others? By storing in a single canonical form and computing other representations on demand, we
eliminate this entire class of bugs.

The choice of Kelvin as the internal representation is deliberate. Kelvin is the absolute temperature scale with a
natural zero point, making it easier to enforce the physical constraint that temperature cannot be negative. This is an
example of choosing a representation that makes invariants easier to maintain.

**Validation and Invariant Maintenance**: The class maintains a crucial invariant: temperature cannot be below absolute
zero. This validation is centralized in the `isValid` helper function and consistently applied in both the constructor
and setter methods. Notice how `setCelsius` and `setFahrenheit` delegate to `setKelvin`, which performs the validation.
This ensures that validation logic appears in exactly one place, making it easier to maintain and impossible to
accidentally bypass.

This centralization of validation is a key principle of encapsulation. If validation were scattered throughout the code,
we'd have to remember to perform it everywhere, and any place we forget becomes a potential bug. By routing all
modifications through a single validation point, we make it impossible to create an invalid `Temperature` object.

**Interface Flexibility**: While stored in Kelvin internally, the class provides convenient interfaces for working with
Celsius and Fahrenheit. This reflects an important design principle: the internal representation should be chosen for
correctness and efficiency, while the interface should be chosen for convenience and ease of use. Users of the class
don't need to know or care that temperatures are stored in Kelvin—they can work in whatever units are most natural for
their application.

**Const Correctness**: Getter functions are marked `const`, making it clear they do not modify the object's state. This
distinction between observers (which read state) and mutators (which modify state) is fundamental to designing clear,
predictable interfaces. When you see a const function, you know immediately that calling it won't change the object—this
makes it safe to call from const contexts and helps readers understand the function's purpose.

**Encapsulation and Information Hiding**: The internal representation (Kelvin) is private. Users interact through a
clean public interface that hides the implementation details. This separation provides flexibility—we could change the
internal representation to store in Celsius instead, and as long as we maintain the public interface, no client code
would need to change. This is the essence of the interface/implementation separation that makes large software systems
maintainable.

This structure—private data with validation, public interface functions, and maintenance of invariants—is the hallmark
of well-designed classes. It provides a template that you can apply to most class design problems: identify the minimal
state needed, choose a representation that makes invariants easy to maintain, hide that representation, and provide a
clean interface that's convenient for users.

---

## 3. Constructors and Object Lifetime

### 3.1 What Are Constructors?

A **constructor** is a special member function that is automatically called when an object is created. Its purpose is to
initialize the object to a valid state, ensuring that from the moment of creation, the object is ready to be used. The
name of a constructor is the same as the class name, and it has no return type (not even `void`).

The philosophy behind constructors reflects a fundamental principle of C++: objects should always be in a valid, usable
state. Unlike some languages that allow objects to exist in a partially initialized state, C++ requires that
construction either fully succeeds or fails (typically by throwing an exception). This "all or nothing" approach
prevents the creation of zombie objects that appear to exist but are actually unusable.

Constructors are crucial because, in C++, unlike some other languages, objects are not automatically initialized to safe
default values. If you create an object without initializing it, its data members contain whatever happened to be in
that memory location—undefined values that lead to unpredictable behavior. Constructors ensure that every object begins
life in a well-defined state, with all its members properly initialized.

The design of constructors in C++ embodies the "you don't pay for what you don't use" principle. C++ doesn't mandate
default initialization for all types because it would impose overhead in cases where immediate initialization isn't
needed. However, for class types, the constructor gives the class author complete control over initialization, allowing
them to enforce whatever invariants the class requires.

Understanding constructors requires grasping the distinction between *initialization* and *assignment*. In many
programming languages, these concepts are blurred together, but in C++, they're fundamentally different. Initialization
happens when an object comes into being; assignment happens to an already-existing object. Constructors perform
initialization, and getting this right—particularly for members that are themselves class types—can significantly impact
performance and correctness.

```cpp
class Account {
   private:
       std::string owner;
       double balance;
       int accountNumber;
       
   public:
       // Constructor ensures all members are initialized
       Account(std::string name, double initialBalance)
           : owner(std::move(name)), 
             balance(initialBalance),
             accountNumber(generateAccountNumber()) {
           
           if (balance < 0) {
               throw std::invalid_argument("Initial balance cannot be negative");
           }
       }
       
   private:
       static int generateAccountNumber() {
           static int counter = 1000;
           return counter++;
       }
};
```

In this example, the constructor guarantees that every `Account` object has a valid owner name, a non-negative balance,
and a unique account number. Without the constructor, creating an `Account` object would leave these members
uninitialized, leading to undefined behavior. The constructor is the gatekeeper that ensures only valid `Account`
objects can exist.

Notice the validation logic in the constructor body. If the initial balance is negative, the constructor throws an
exception. This prevents the creation of an invalid object—if construction fails, no object exists, and the caller must
handle the exception. This is vastly preferable to creating an object in an invalid state and hoping the caller
remembers to check for validity.

### 3.2 Default Constructor

A **default constructor** is one that can be called with no arguments. This might mean a constructor with no parameters,
or a constructor where all parameters have default values. The default constructor occupies a special place in C++
because it's called in several important contexts that don't provide explicit initialization arguments.

Understanding when the default constructor is called is essential for avoiding subtle bugs. It's called when you declare
an object without an initializer, when you create arrays of objects, when class members have no explicit initializer,
and when creating objects with default construction syntax. Each of these contexts represents a situation where the
compiler needs to create an object but has no initialization arguments to work with.

```cpp
class Point {
   private:
       double x, y;
 
   public:
       // Default constructor
       Point() : x(0.0), y(0.0) {}
       
       // Also a default constructor - all parameters have defaults
       // Point(double xVal = 0.0, double yVal = 0.0) 
       //     : x(xVal), y(yVal) {}
};
```

The distinction between a default constructor with no parameters and one with default parameters is subtle but
important. Both can be called without arguments, but they have different implications for class design. A constructor
with default parameters is more flexible—it can serve as both a default constructor and a parameterized constructor—but
it also means that the default values are part of your class's interface. Changing them could break existing code that
relies on those defaults.

**Compiler-Generated Default Constructor**: If you don't declare any constructors, the compiler will generate a default
constructor for you. This synthesized default constructor default-initializes each member, which has specific
consequences depending on the member's type:

For built-in types like `int` or pointers, default-initialization means they're left with undefined values—whatever
happened to be in memory. This is a common source of bugs. For class types, default-initialization means calling their
default constructors. So a `std::string` member will be initialized to an empty string, even though the compiler
generated the constructor.

```cpp
class Simple {
    int value;        // Uninitialized if using compiler-generated default constructor
    std::string text; // Initialized to empty string (std::string's default constructor)
};

Simple s;  // s.value contains garbage; s.text is ""
```

This behavior reflects C++'s philosophy of not imposing unnecessary overhead. If the compiler automatically initialized
all members to zero, it would cost performance even when you're about to immediately assign different values. However,
this puts the burden on programmers to ensure proper initialization.

The compiler's rules about when it generates a default constructor are precise and important: once you declare any
constructor, the compiler will not generate a default constructor. This is a deliberate design decision—if you've taken
control of construction, the compiler assumes you know what you're doing and doesn't second-guess you.

```cpp
class NoDefault {
   public:
       NoDefault(int x) {}  // Now there's no default constructor
};

NoDefault obj;     // ERROR: no default constructor
NoDefault obj(5);  // OK
```

This behavior can be surprising when you add a parameterized constructor to a class that previously had only the
compiler-generated default constructor. Suddenly, code that creates arrays or uses default construction breaks. This is
why it's often good practice to explicitly provide a default constructor even if you have other constructors.

You can explicitly request the compiler-generated default constructor using `= default`:

```cpp
class Point {
   public:
       Point() = default;  // Use compiler-generated version
       Point(double x, double y);
};
```

This syntax makes your intentions explicit: you want the default constructor, and you want the compiler's version. It
also works with the other special member functions, providing a clear way to request the default implementation while
still declaring the function.

### 3.3 Parameterized Constructors

Parameterized constructors accept arguments to initialize the object with specific values. They allow objects to be
created in various states based on the provided arguments, giving the class user flexibility in how objects are
initialized.

The design of parameterized constructors requires careful thought about what initialization scenarios make sense for
your class. You should provide constructors that correspond to natural ways of creating objects in your problem domain.
For example, a `Rectangle` might have a constructor taking width and height, or a constructor taking two `Point` objects
representing opposite corners. Both represent valid, natural ways to specify a rectangle.

```cpp
class Rectangle {
   private:
       double width, height;
       
   public:
       // Parameterized constructor
       Rectangle(double w, double h) : width(w), height(h) {
           if (width <= 0 || height <= 0) {
               throw std::invalid_argument("Dimensions must be positive");
           }
       }
       
       // Another parameterized constructor for squares
       explicit Rectangle(double side) : width(side), height(side) {
           if (side <= 0) {
               throw std::invalid_argument("Side must be positive");
           }
       }
};
```

The **`explicit` keyword** on the single-argument constructor is significant. It prevents implicit conversions, which
can cause subtle bugs. Without `explicit`, writing `Rectangle r = 5.0;` would be allowed—the compiler would implicitly
convert `5.0` to a `Rectangle` by calling the single-argument constructor. This implicit conversion might not be what
you intended, leading to confusing bugs.

The `explicit` keyword forces users to write `Rectangle r(5.0);` or `Rectangle r{5.0};`, making the construction
explicit. This small syntactic requirement dramatically improves code clarity and prevents accidental conversions. The
rule of thumb is simple: make single-argument constructors `explicit` unless you specifically want implicit conversions.

There's an important consideration when designing constructors: what combinations of parameters make sense? You could
provide many constructors for different scenarios, but too many constructors make the class harder to use. Users must
figure out which constructor to call and what each parameter means. A good approach is to provide constructors for the
most common use cases and use default parameters for variations.

Another consideration is validation. Constructors should validate their parameters and throw exceptions if given invalid
values. This enforces the principle that objects should always be in a valid state. It's better to fail fast at
construction than to create an invalid object that causes problems later. The validation logic should be as thorough as
necessary to maintain your class's invariants.

### 3.4 Member Initializer Lists

The **member initializer list** is the preferred way to initialize data members in C++. It appears between the
constructor parameter list and the constructor body, starting with a colon (`:`). Understanding why initializer lists
are preferred over assignment in the constructor body requires understanding how object construction works in C++.

When a constructor executes, member initialization happens before the constructor body runs. If you don't provide an
initializer in the initializer list, members are default-initialized. Then, if you assign to them in the constructor
body, you're replacing their initial values. For built-in types, this might not matter much, but for class types, it can
mean significant wasted work—the member is first default-constructed, then assigned a new value.

```cpp
class Complex {
    private:
        double real, imag;
        const int id;
        
    public:
        Complex(double r, double i, int identifier)
            : real(r), imag(i), id(identifier) {
            // Constructor body can perform additional work
        }
};
```

Let's explore why initializer lists are preferred with a detailed example that shows the performance difference:

```cpp
class Inefficient {
    std::string name;

    public:
        Inefficient(std::string n) { // 1. Default-constructs empty string
            name = n;                // 2. Assigns n to name (copies)                
        }
};

class Efficient {
   std::string name;
   
    public:
       Efficient(std::string n) 
           : name(std::move(n)) {  // Directly constructs name from n (moves)
       }
};
```

In the inefficient version, `name` is first default-constructed to an empty string, then `n` is assigned to it. This
involves allocating memory for the empty string (which is immediately discarded) and then allocating new memory and
copying the contents of `n`. In the efficient version, `name` is directly constructed from `n` (with move semantics),
requiring only a single memory allocation.

For complex objects, this difference can be substantial. Imagine a member that's a `std::vector` containing thousands of
elements. Default-constructing it and then assigning to it is vastly more expensive than directly constructing it with
the desired contents.

Some members must be initialized in the initializer list because they cannot be assigned after construction:

**Const members** cannot be modified after initialization, so they must be initialized in the initializer list. Trying
to assign to them in the constructor body is a compile error.

**Reference members** must be bound at initialization. References cannot be "reseated" to refer to a different object,
so they must be initialized in the initializer list.

**Members of class types without default constructors** cannot be default-initialized, so you must provide explicit
initialization in the initializer list.

**Base class subobjects** (in inheritance) must be initialized in the initializer list if they don't have default
constructors.

There's a critical point about initialization order that often catches programmers by surprise: members are initialized
in the order they are declared in the class, not the order they appear in the initializer list. This rule exists to
ensure consistent initialization and destruction order, but it can lead to subtle bugs if you're not aware of it.

```cpp
class OrderMatters {
   int first;
   int second;
   
    public:
       // This looks like second is initialized before first,
       // but actually first is initialized first (declaration order)
       OrderMatters(int val) : second(val), first(second + 1) {
          // Dangerous! first might be initialized with uninitialized second
       }
};
```

In this example, even though the initializer list shows `second` before `first`, the members are initialized in
declaration order: `first`, then `second`. This means `first` is initialized using the value of `second`, but `second`
hasn't been initialized yet! The value of `first` is undefined.

The best practice is to list initializers in the same order as member declaration. This makes the code's behavior
obvious and prevents the above class of bugs. Many compilers will warn you if the initializer list order doesn't match
the declaration order, precisely because of this potential for confusion.

### 3.5 Delegating Constructors (C++11)

Delegating constructors, introduced in C++11, allow one constructor to call another constructor of the same class. This
feature reduces code duplication and centralizes initialization logic, making classes easier to maintain.

Before delegating constructors, if you had multiple constructors that shared common initialization logic, you had three
options: duplicate the logic across constructors, factor it into a private init() method, or use default parameters.
Each approach had drawbacks—duplication violates DRY (Don't Repeat Yourself), init() methods can't initialize const or
reference members, and default parameters aren't always appropriate.

```cpp
class Point {
   private:
      double x, y;
       
   public:
      // Main constructor
      Point(double xVal, double yVal) : x(xVal), y(yVal) {
         // Perform validation
         validateCoordinates();
      }
      
      // Delegate to the main constructor
      Point() : Point(0.0, 0.0) {}
      
      Point(double val) : Point(val, val) {}
       
   private:
      void validateCoordinates() {
         // Validation logic in one place
      }
};
```

Delegation happens in the initializer list using constructor call syntax. When a constructor delegates to another, the
delegated-to constructor runs first, fully initializing the object, then the delegating constructor's body runs. This is
different from member initialization—when delegating, you cannot initialize any members in the initializer list. The
delegated constructor takes full responsibility for initialization.

This feature is particularly valuable for classes with complex initialization logic or validation. You can designate
one "master" constructor that contains all the initialization and validation logic, and have other constructors delegate
to it with appropriate arguments. This ensures that validation and initialization logic appears in exactly one place,
making it easier to maintain and impossible to accidentally bypass.

Consider a more complex example with validation:

```cpp
class BankAccount {
   private:
      std::string owner;
      double balance;
      std::string accountType;
      
      void validateBalance(double bal) {
         if (bal < 0) {
            throw std::invalid_argument("Balance cannot be negative");
         }
      }
      
   public:
      // Master constructor
      BankAccount(std::string name, double initialBalance, std::string type)
         : owner(std::move(name)), balance(initialBalance), accountType(std::move(type)) {
         validateBalance(balance);
         // Other initialization logic
      }
      
      // Delegating constructors
      BankAccount(std::string name, double initialBalance)
         : BankAccount(std::move(name), initialBalance, "Standard") {}
      
      BankAccount(std::string name)
         : BankAccount(std::move(name), 0.0) {}
};
```

Here, all three constructors ultimately route through the master constructor, ensuring that validation always happens.
This pattern makes the class more maintainable—if we need to add more validation or initialization logic, we add it in
one place.

### 3.6 Object Lifetime and Constructor Execution

Understanding when constructors execute is crucial for managing resources correctly and avoiding subtle bugs. Objects
can have different storage durations, and the timing of construction differs for each. This section explores these
differences in detail, as they have profound implications for program behavior.

**Automatic Storage (Stack Objects)**:

Automatic objects are created on the stack and have a lifetime tied to the scope in which they're declared. Their
construction happens when control reaches their declaration, and destruction happens when control leaves their scope.
This predictable, deterministic lifetime makes automatic storage the preferred choice for most objects.

```cpp
void function() {
    Point p(1.0, 2.0);  // Constructor called here
    // Use p
}  // Destructor called here when p goes out of scope
```

The beauty of automatic storage is its simplicity and safety. You don't need to remember to clean up—destruction is
automatic and guaranteed. Even if an exception is thrown, destructors for all constructed automatic objects are called
during stack unwinding. This makes automatic storage ideal for RAII (Resource Acquisition Is Initialization), which
we'll explore in depth later.

However, automatic storage has limitations. The size must be known at compile time, and the object's lifetime is
strictly bound to its scope. For objects that need to outlive their creating scope or whose size isn't known until
runtime, other storage durations are necessary.

**Static Storage**:

Static objects have a lifetime that extends for the entire program duration. They're constructed before main() begins (
for globals) or on first use (for local statics), and destroyed after main() completes. Static storage introduces
complexities around initialization order that don't exist with automatic storage.

```cpp
Point& getGlobalPoint() {
    static Point p(0.0, 0.0);  // Constructed on first call
    return p;
}  // Destructor called at program termination
```

Local static objects (like `p` above) are initialized the first time control passes through their declaration. This "
initialize on first use" pattern, often called the Meyers Singleton, avoids the static initialization order fiasco that
plagues global static objects. It ensures that the object is initialized before it's used, regardless of when the
function is first called.

Global static objects (those declared at namespace scope) have a more complex initialization story. Within a single
translation unit, they're initialized in declaration order. But across translation units, the initialization order is
undefined. This is the static initialization order fiasco—if one global object's constructor uses another global object,
you can't be sure the second object has been constructed yet.

```cpp
// File1.cpp
std::string globalString = "Hello";

// File2.cpp
extern std::string globalString;
size_t globalLength = globalString.length();  // DANGER: globalString might not be initialized yet!
```

The solution is to avoid globals that depend on other globals, or use local statics which are initialized on first use.

**Dynamic Storage (Heap Objects)**:

Dynamic objects are created with `new` and destroyed with `delete`. Their lifetime is under explicit programmer control,
which provides maximum flexibility but also maximum responsibility. With dynamic storage, you must ensure that every
`new` has a corresponding `delete`, and that `delete` is called exactly once.

```cpp
Point* p = new Point(1.0, 2.0);  // Constructor called
// Use *p
delete p;  // Destructor called explicitly
```

Modern C++ strongly discourages raw `new` and `delete`. Instead, use smart pointers (`std::unique_ptr`,
`std::shared_ptr`) which provide automatic lifetime management while maintaining the flexibility of dynamic allocation.
We'll explore smart pointers in detail in Section 14.

The key danger with dynamic storage is resource leaks. If an exception is thrown between `new` and `delete`, or if there
are multiple return paths, and you forget to `delete` on one path, memory leaks. Smart pointers solve this by tying the
resource's lifetime to an automatic object's lifetime, bringing the benefits of automatic storage to dynamically
allocated memory.

**Construction and Destruction Order**:

The order of construction and destruction follows strict rules that ensure objects are destroyed in the reverse order of
construction. This mirrors the way a stack works and ensures that objects don't access other objects that have already
been destroyed.

For local automatic objects, construction order is the order of declaration, and destruction order is the reverse. For
members of a class, construction order is the declaration order in the class definition, and destruction order is the
reverse. For base and derived classes, base class portions are constructed before derived, and destroyed after.

```cpp
void demonstrateOrder() {
   std::cout << "1. About to construct first\n";
   Point first(0, 0);
   std::cout << "2. About to construct second\n";
   Point second(1, 1);
   std::cout << "3. About to construct third\n";
   Point third(2, 2);
   std::cout << "4. About to exit scope\n";
}
// Destruction happens in reverse: third, second, first
```

This ordering is crucial for maintaining invariants. If object A depends on object B, you must ensure B is constructed
before A and destroyed after A. With automatic objects in the same scope, this is achieved by declaration order. With
member objects, it's achieved by declaration order in the class definition.

Understanding object lifetime is foundational to using C++ effectively. The language gives you precise control over when
objects are created and destroyed, but with that control comes the responsibility to get it right. RAII—tying resource
lifetime to object lifetime—turns this responsibility into a strength, making resource management automatic and
exception-safe.

---

## 4. Destructors and Resource Management

### 4.1 What Is a Destructor?

A **destructor** is a special member function that is automatically called when an object's lifetime ends. Its name is
the class name preceded by a tilde (`~`), and like constructors, it has no return type. Unlike constructors, a class can
have only one destructor, and it takes no parameters—there's only one way to destroy an object.

The primary purpose of a destructor is to release any resources the object acquired during its lifetime. This includes
freeing dynamically allocated memory, closing file handles, releasing locks, disconnecting network connections, or any
other cleanup necessary to prevent resource leaks. The destructor is your last chance to perform cleanup before the
object ceases to exist.

Destructors are the cornerstone of one of C++'s most important idioms: **RAII (Resource Acquisition Is
Initialization)**. This pattern, which we'll explore in depth later, ties resource lifetime to object lifetime.
When an object is created, it acquires resources (in the constructor). When the object is destroyed, it releases those
resources (in the destructor). This tight coupling between object lifetime and resource lifetime makes resource
management automatic and exception-safe.

The philosophy behind destructors reflects C++'s principle of "you don't pay for what you don't use" while ensuring that
cleanup happens automatically. The destructor is called automatically at well-defined points in your program,
guaranteeing cleanup without requiring explicit cleanup calls. This is a significant improvement over languages that
rely on garbage collection or manual cleanup, as it provides deterministic, predictable resource release.

```cpp
class FileHandler {
   private:
      FILE* file;
   
   public:
      FileHandler(const char* filename) {
         file = fopen(filename, "r");
         if (!file) {
            throw std::runtime_error("Cannot open file");
         }
      }
   
      ~FileHandler() {
         if (file) {
            fclose(file);  // Release resource
         }
      }
      
      // Disable copying to prevent double-close
      FileHandler(const FileHandler&) = delete;
      FileHandler& operator=(const FileHandler&) = delete;
};
```

This pattern—acquiring a resource in the constructor and releasing it in the destructor—is the foundation of RAII, one
of C++'s most powerful idioms. Notice that we don't need to remember to close the file—it happens automatically when the
`FileHandler` object is destroyed. This automatic cleanup works even in the presence of exceptions, making the code
exception-safe by default.

The destructor also serves another critical purpose: it provides an opportunity to maintain class invariants during
destruction. Some classes need to perform cleanup actions that go beyond simple resource release—they might need to
flush buffers, update persistent state, notify observers, or perform other finalization tasks. The destructor is where
this logic belongs.

### 4.2 When Destructors Are Called

Destructors are called automatically in several well-defined contexts. Understanding these contexts is crucial for
correctly managing resources and avoiding bugs related to object lifetime. The automatic nature of destructor calls is
what makes RAII powerful—you don't have to remember to clean up because the language guarantees it will happen.

**End of Scope**: For automatic (stack) objects, the destructor is called when the object goes out of scope. This
happens at the closing brace of the scope in which the object was declared, or when a return, goto, or exception exits
the scope. The predictability of this behavior is what makes automatic storage ideal for resource management.

```cpp
void function() {
    FileHandler fh("data.txt");
    // Use fh
}  // fh's destructor called here automatically
```

This automatic destruction is what makes RAII so powerful—you don't need to remember to clean up. The language
guarantees cleanup happens, even if there are multiple return paths, early returns, or exceptions. This guarantee
eliminates an entire class of bugs common in languages without deterministic destruction.

Consider a function with multiple return paths:

```cpp
void complexFunction(bool condition) {
   FileHandler fh("data.txt");
   
   if (condition) {
      // Do something
      return;  // fh destroyed here
   }
   
   // Do something else
   if (anotherCondition) {
      return;  // fh destroyed here too
   }
   
   // More code
}  // fh destroyed here as well
```

In a language without deterministic destruction, you'd need to explicitly close the file before each return, and it's
easy to forget one. With RAII, cleanup happens automatically on every path.

**Explicit Deletion**: For dynamic (heap) objects created with `new`, the destructor is called when you call `delete`.
This gives you explicit control over object lifetime, but also places the burden of calling `delete` on you. Forgetting
to call `delete`, calling it more than once, or calling it at the wrong time are all common sources of bugs.

```cpp
FileHandler* fh = new FileHandler("data.txt");
// Use *fh
delete fh;  // Calls destructor and frees memory
```

Modern C++ strongly discourages raw `new`/`delete`. Instead, use smart pointers (`std::unique_ptr`, `std::shared_ptr`)
that automatically call `delete` when appropriate, bringing the benefits of automatic destruction to dynamically
allocated objects.

**Exception Unwinding**: When an exception is thrown, destructors are called for all automatic objects constructed since
entering the try block. This exception unwinding mechanism is crucial for exception safety—it ensures that resources are
released even when errors occur.

```cpp
void risky() {
    FileHandler fh1("file1.txt");
    FileHandler fh2("file2.txt");
    
    // If this throws...
    dangerousOperation();
    
    // ...fh2's destructor is called, then fh1's destructor
    // This guarantees resources are released even during exceptions
}
```

This behavior is crucial for exception safety. Resources managed by objects with destructors are automatically cleaned
up even when exceptions occur. This is why RAII is so important—it makes exception-safe code natural and automatic.
Without RAII, you'd need extensive try/catch blocks to ensure cleanup happens in all paths, and it's easy to miss cases.

The exception unwinding mechanism has specific rules: destructors are called for all fully-constructed objects. If an
object's constructor throws an exception (and the object is therefore not fully constructed), its destructor is not
called. However, destructors are called for all of its member subobjects that were successfully constructed.

**Array Deletion**: When deleting an array of objects, the destructor is called for each element in reverse order of
construction. This is why you must use `delete[]` for arrays—plain `delete` only destroys the first element and causes
undefined behavior.

```cpp
FileHandler* handlers = new FileHandler[10];
// ...
delete[] handlers;  // Calls destructor for each of the 10 elements
```

Note the `[]` in `delete[]`—it's essential. Using plain `delete` on an array only destroys the first element and frees
the memory incorrectly, causing undefined behavior. The `[]` tells the compiler this is an array deletion and to call
destructors for all elements. This is another reason to prefer `std::vector` or `std::array` over raw arrays—they handle
this automatically.

**Program Termination**: Static and global objects are destroyed when the program terminates, in reverse order of their
construction. This happens after `main()` returns or when `exit()` is called. However, if the program terminates
abnormally (e.g., via `std::terminate()` or a crash), destructors may not be called.

The destructor calling mechanism is remarkably robust. It handles multiple exit paths, exceptions, and complex object
hierarchies while maintaining strict ordering guarantees. Understanding when destructors are called allows you to write
classes that reliably manage resources without leaks or double-frees.

### 4.3 Compiler-Generated Destructor

If you don't declare a destructor, the compiler generates one for you. This synthesized destructor destroys each member
in reverse order of their declaration, calling their destructors if they are class types. For many classes, the
compiler-generated destructor is exactly what you need.

For simple classes containing only class-type members that manage their own resources (like `std::string`,
`std::vector`, `std::unique_ptr`), the compiler-generated destructor is sufficient and preferred. These members know how
to clean up after themselves, so the class doesn't need to do anything special.

```cpp
class Person {
   private:
      std::string name;
      std::vector<std::string> addresses;
      
      // Compiler-generated destructor is fine
      // It will destroy addresses, then name
};
```

When `Person` is destroyed, the compiler-generated destructor automatically calls the destructors for `addresses` (which
frees its dynamic array) and `name` (which frees its string buffer). You don't need to write any cleanup code—the
members handle it themselves. This is the ideal case and demonstrates the power of RAII—each object manages its own
resources, and destruction chains automatically.

However, if your class directly owns resources—raw pointers to dynamically allocated memory, file handles, network
connections, locks, or any other resources that need explicit release—you must define a destructor to release them. The
compiler-generated destructor won't do it for you because it doesn't know that a raw pointer points to memory that needs
to be freed or that an int might be a file descriptor that needs to be closed.

```cpp
class DynamicArray {
   private:
      int* data;
      size_t size;
   
   public:
      DynamicArray(size_t n) : data(new int[n]), size(n) {}
   
      ~DynamicArray() {
         delete[] data;  // Must manually release
      }
};
```

This illustrates an important principle: if a class directly manages a resource (has a raw pointer, file handle, etc.),
it needs a custom destructor. The general rule is that if you need a custom destructor, you probably also need custom
copy operations (copy constructor and copy assignment operator). This observation leads to the Rule of Three/Five, which
we'll discuss in Section 15.

Modern C++ style strongly prefers wrapping resources in RAII classes rather than managing them directly. Instead of a
raw pointer, use `std::unique_ptr` or `std::vector`. Instead of a raw file handle, use `std::fstream` or a custom RAII
wrapper. This allows you to return to the Rule of Zero—no custom special member functions needed because your members
manage themselves.

### 4.4 Virtual Destructors

When using inheritance and polymorphism, destructors become more complex and require careful attention. The issue arises
when you delete an object through a base class pointer. If the base class destructor is not virtual, only the base class
portion of the object is destroyed—the derived class destructor is never called, leading to resource leaks.

This is one of the most common bugs in C++ code that uses inheritance. The problem is subtle because the code appears to
work—it compiles without warnings and runs without crashing (usually). But resources are leaking, and the leak may not
be obvious until the program has been running for a while.

```cpp
class Base {
   public:
      ~Base() {  // Non-virtual destructor - DANGEROUS
         // Base cleanup
      }
};

class Derived : public Base {
   private:
      int* data;
   
   public:
      Derived() : data(new int[100]) {}
   
      ~Derived() {
         delete[] data;  // NEVER CALLED if deleted through Base*
      }
};

// Dangerous code
Base* ptr = new Derived();
delete ptr;  // Only Base::~Base() called, data leaked!
```

Let's understand what happens here in detail. When you call `delete ptr`, the compiler looks at the static type of
`ptr` (which is `Base*`) and calls `Base`'s destructor. Since the destructor is not virtual, there's no dynamic
dispatch—the compiler directly calls `Base::~Base()`. This destructor cleans up the `Base` portion of the object but
knows nothing about the `Derived` portion. The `Derived` destructor never runs, so `data` is never deleted, causing a
memory leak.

The solution is to make the base class destructor virtual:

```cpp
class Base {
   public:
      virtual ~Base() { // Virtual destructor
         // Base cleanup
      }
};
   
class Derived : public Base {
   private:
      int* data;

   public:
      Derived() : data(new int[100]) {}

      ~Derived() override {
         delete[] data;  // Now this IS called
      }
};

// Safe code
Base* ptr = new Derived();
delete ptr;  // Calls Derived::~Derived(), then Base::~Base()
```

With a virtual destructor, when you call `delete ptr`, dynamic dispatch occurs. The system looks up the actual type of
the object (which is `Derived`) and calls `Derived::~Derived()`. After the derived destructor completes, the base
destructor is automatically called. This ensures complete cleanup of the entire object.

The performance impact of virtual destructors is minimal—just the overhead of one virtual function call during
destruction. The correctness gain is enormous. Without virtual destructors in polymorphic base classes, resource leaks
are nearly inevitable.

**Rule of thumb**: If a class is designed to be inherited from (has virtual functions or is intended as a base class),
its destructor should be virtual. If a class is not designed for inheritance, its destructor should be non-virtual (to
avoid the overhead of the virtual table) and the class should be marked `final` to prevent inheritance.

```cpp
// Designed for polymorphism - virtual destructor
class Shape {
    public:
       virtual void draw() const = 0;
       virtual ~Shape() = default;
};

// Not designed for inheritance - non-virtual destructor, marked final
class Point final {
    public:
       ~Point() = default;
};
```

There's an important exception: pure virtual destructors. You can make a destructor pure virtual, which makes the class
abstract (can't be instantiated) while still providing a destructor. However, you must provide a definition for the pure
virtual destructor, unlike other pure virtual functions:

```cpp
class Abstract {
    public:
       virtual ~Abstract() = 0;  // Pure virtual destructor
};

Abstract::~Abstract() {  // Must provide definition
   // Cleanup code
}
```

This pattern is rare but useful when you want an abstract base class that doesn't have any other pure virtual functions.

### 4.5 The Interplay of Constructors and Destructors

Constructors and destructors work together to manage object lifetime, and understanding their interaction is crucial for
writing correct C++ code. The order of operations is strictly defined and mirrors the structure of your classes,
ensuring that objects are always destroyed in a safe order.

**Construction order**:

1. Base class subobjects (in declaration order if there are multiple base classes)
2. Member objects (in declaration order in the class definition)
3. Constructor body

**Destruction order** (reverse of construction):

1. Destructor body
2. Member objects (reverse declaration order)
3. Base class subobjects (reverse declaration order)

This ordering ensures that an object's dependencies are alive throughout its lifetime. Members and base class portions
are fully constructed before the derived class constructor body runs, and they remain alive until after the derived
class destructor body completes. This prevents accessing destroyed objects, which would cause undefined behavior.

```cpp
class Member {
   public:
       Member() { std::cout << "Member constructed\n"; }
       ~Member() { std::cout << "Member destroyed\n"; }
};

class Base {
   public:
       Base() { std::cout << "Base constructed\n"; }
       virtual ~Base() { std::cout << "Base destroyed\n"; }
};

class Derived : public Base {
   private:
       Member m;
       
   public:
       Derived() { std::cout << "Derived constructed\n"; }
       ~Derived() override { std::cout << "Derived destroyed\n"; }
};

// Creating a Derived object prints:
// Base constructed
// Member constructed
// Derived constructed

// Destroying it prints:
// Derived destroyed
// Member destroyed
// Base destroyed
```

This predictable order is what makes RAII reliable. Resources are acquired in a well-defined order during construction
and released in the opposite order during destruction, ensuring that dependencies are respected. If member A uses member
B, declaring B before A in the class definition ensures B is constructed before A and destroyed after A.

The interaction becomes more complex with inheritance hierarchies:

```cpp
class GrandParent {
    public:
       GrandParent() { std::cout << "GrandParent\n"; }
       virtual ~GrandParent() { std::cout << "~GrandParent\n"; }
};

class Parent : public GrandParent {
    Member m1;
    
    public:
        Parent() { std::cout << "Parent\n"; }
        ~Parent() override { std::cout << "~Parent\n"; }
};

class Child : public Parent {
    Member m2;
    
    public:
        Child() { std::cout << "Child\n"; }
        ~Child() override { std::cout << "~Child\n"; }
};

// Construction: GrandParent, m1, Parent, m2, Child
// Destruction: ~Child, m2, ~Parent, m1, ~GrandParent
```

Notice how construction starts at the top of the hierarchy and works down, while destruction starts at the bottom and
works up. Members are constructed and destroyed at their class level in the hierarchy. This ensures that when any
constructor or destructor runs, all base classes and members up to that point are fully constructed and valid.

Understanding this ordering is essential for writing correct constructors and destructors. Your constructor can safely
use base class members and previously-constructed members. Your destructor can safely use base class members and all
members (which are still alive when your destructor body runs). However, you cannot safely use members that are declared
after the current point in the class definition during initialization, as they haven't been constructed yet.

This predictable order is one of C++'s greatest strengths. It provides the foundation for RAII and makes it possible to
write complex object hierarchies that reliably manage resources without leaks or double-frees.

---

## 5. Access Control and Encapsulation

### 5.1 The Philosophy of Encapsulation

**Encapsulation** is the principle of bundling data and the methods that operate on that data within a single unit (the
class), while restricting direct access to some of the object's components. This is one of the fundamental principles of
object-oriented programming, and in C++, it's enforced through access specifiers.

The rationale behind encapsulation is multifaceted and goes to the heart of why object-oriented programming is valuable.
At its core, encapsulation is about managing complexity. As programs grow larger, the relationships between different
parts of the code become increasingly complex. Without encapsulation, any part of the program can interact with any
other part in arbitrary ways, making it nearly impossible to understand or modify the system without breaking something.

Encapsulation addresses this complexity by establishing clear boundaries. A class defines a public interface—the
operations clients can perform—and hides its implementation details. This separation has several critical benefits:

**Maintainability**: By hiding implementation details, you can change how a class works internally without affecting
code that uses the class. As long as the public interface remains stable, clients are insulated from changes. This is
crucial in large systems where components are maintained by different teams over long periods. Without encapsulation,
every internal change could potentially break client code, making the system brittle and resistant to improvement.

Consider a class that stores data in a vector. If the vector is public, clients might rely on vector-specific operations
like indexing or iterating. If you later discover that a different data structure would be more efficient, you can't
make the change without breaking client code. If the vector is private and accessed only through a public interface, you
can change the implementation freely as long as the interface behavior remains the same.

**Invariant Enforcement**: Classes often need to maintain certain relationships between their data members—invariants
that must always be true for the object to be in a valid state. For example, a `BankAccount` should never have a
negative balance, a `Date` should never represent an invalid date like February 30th, and a sorted container should
maintain its sort order.

By making data private and providing controlled access through public methods, the class can enforce these invariants.
Every modification goes through code that checks and maintains the invariants, making it impossible (barring bugs) for
the object to enter an invalid state. This is far superior to hoping that all client code remembers to maintain the
invariants—a hope that's inevitably disappointed as code evolves.

**Separation of Concerns**: Encapsulation creates a clear boundary between what a class does (its public interface) and
how it does it (its private implementation). This separation makes code easier to understand and reason about. When
using a class, you only need to understand its interface, not its implementation. When modifying a class, you know
exactly what parts are internal (and can be changed) and what parts are public (and must remain stable).

This separation is particularly valuable during code review and maintenance. A reviewer can understand what a class does
by reading its public interface, without needing to understand the implementation details. A maintainer can safely
modify private implementation as long as the public interface behavior doesn't change.

Consider a class without encapsulation:

```cpp
// Poor design - no encapsulation
struct BankAccount {
    double balance;
    std::string owner;
};

// Anyone can violate invariants
BankAccount account;
account.balance = -1000.0;  // Oops! Negative balance
```

Versus a properly encapsulated design:

```cpp
class BankAccount {
   private:
       double balance;
       std::string owner;
 
   public:
       BankAccount(std::string name, double initial) 
           : owner(std::move(name)), balance(initial) {
           if (balance < 0) {
               throw std::invalid_argument("Initial balance cannot be negative");
           }
       }
       
       bool withdraw(double amount) {
           if (amount > 0 && amount <= balance) {
               balance -= amount;
               return true;
           }
           return false;  // Invariant preserved - balance stays non-negative
       }
       
       void deposit(double amount) {
           if (amount > 0) {
               balance += amount;
           }
       }
       
       double getBalance() const {
           return balance;
       }
};
```

The encapsulated version ensures that the balance can never become negative—the class controls all modifications to its
internal state. There's no way for client code to accidentally (or intentionally) create an invalid `BankAccount`. This
guarantee holds throughout the program's execution, making the code more reliable and easier to reason about.

Encapsulation is not about being secretive or making things difficult for class users. It's about creating well-defined,
maintainable abstractions that can evolve over time without breaking client code. It's about preventing bugs by making
invalid states unrepresentable. And it's about managing complexity by limiting the ways different parts of the system
can interact.

### 5.2 Access Specifiers: public, private, protected

C++ provides three access specifiers to control the visibility of class members. These keywords establish boundaries
around different parts of a class, determining who can access what. Understanding how to use these specifiers
effectively is fundamental to good class design.

**public**: Members are accessible from anywhere the object is accessible. This forms the class's interface—the
operations that clients can perform. Public members are what users of your class interact with; they define what the
class can do. The public interface should be stable (changing it breaks client code) and complete (it should provide all
the functionality users need).

```cpp
class Calculator {
   public:
       double add(double a, double b) const {
           return a + b;
       }
       
       double multiply(double a, double b) const {
           return a * b;
       }
};

// Public members can be called from anywhere
Calculator calc;
double result = calc.add(5.0, 3.0);  // OK
```

Public members should be carefully designed. Every public member is a commitment—it becomes part of your class's
contract with its users. Removing or changing a public member breaks client code, so public interfaces should be as
minimal as possible while still being complete. Adding a member later is usually fine; removing or changing one is
breaking.

**private**: Members are only accessible from within the class itself and from friend functions/classes. This hides
implementation details from clients. Private members are internal to the class—they're the "how" that supports the "
what" of the public interface.

```cpp
class SecureStorage {
   private:
       std::vector<std::byte> encryptedData;
       
       void decrypt() {
           // Implementation detail - clients shouldn't call this
       }
       
   public:
       void retrieveData(std::string& output, const std::string& password) {
           if (validatePassword(password)) {
               decrypt();
               // Copy decrypted data to output
           }
       }
       
   private:
       bool validatePassword(const std::string& pwd) {
           // Password validation logic
           return true;
       }
};

// SecureStorage storage;
// storage.decrypt();  // ERROR: private member
// storage.retrieveData(data, "password");  // OK: public interface
```

Private members can be changed freely without affecting client code. This is the key benefit of encapsulation—the
implementation can evolve independently of the interface. You can change data structures, algorithms, helper functions,
anything that's private, as long as the public interface behavior remains the same.

**protected**: Members are accessible from within the class and from derived classes, but not from outside the
inheritance hierarchy. This is primarily used with inheritance to provide access to base class internals for derived
classes while still hiding them from general clients.

```cpp
class Shape {
   protected:
       double area;  // Derived classes can access this
       
       void setArea(double a) {
           area = a;
       }
       
   public:
       double getArea() const {
           return area;
       }
};

class Circle : public Shape {
   public:
       Circle(double radius) {
           setArea(3.14159 * radius * radius);  // OK: can access protected member
       }
};

// Circle c(5.0);
// c.setArea(10.0);  // ERROR: setArea is protected
// double a = c.getArea();  // OK: getArea is public
```

Protected members are a compromise between private and public. They're more accessible than private (derived classes can
use them) but more restricted than public (general clients cannot). Use protected sparingly—protected members are part
of the interface for derived classes, and changing them can break derived classes just as changing public members can
break clients.

The choice between private and protected is subtle but important. Private is more restrictive and therefore
safer—changes to private members can only break the class itself, not derived classes. Protected is more flexible for
inheritance but creates more coupling. As a general rule, prefer private unless there's a clear need for derived class
access.

### 5.3 Design Guidelines for Access Control

Choosing the right access level for each member is a design decision that affects maintainability and flexibility. Here
are some principles to guide these decisions, based on decades of C++ experience:

**Minimize Public Interface**: Make members private by default and only expose what's necessary. A smaller public
interface is easier to maintain and gives you more freedom to change the implementation. Every public member is a
commitment that constrains future evolution.

Think of the public interface as a contract with users of your class. You're promising that these operations will remain
available and behave in specified ways. Breaking that contract requires changing all client code, which may be
impractical or impossible in large systems. Therefore, make the interface as small as possible while still being
complete.

This doesn't mean making the interface difficult to use. It means being thoughtful about what operations belong in the
public interface. Helper functions that are only useful within the class should be private. Implementation details
should be private. Only the core operations that define what the class does should be public.

**Never Expose Data Members**: Except in the rare case of simple data aggregates (where a `struct` is more appropriate),
data members should be private. Access them through getter and setter functions that can enforce invariants and provide
a stable interface.

```cpp
// Poor design
class BadRectangle {
   public:
       double width, height;  // Direct access - no validation possible
};

// Better design
class GoodRectangle {
   private:
       double width, height;
       
   public:
       void setWidth(double w) {
           if (w > 0) width = w;
       }
       
       double getWidth() const {
           return width;
       }
       
       // Similarly for height...
};
```

The benefits of using accessor functions go beyond validation. They provide a stable interface even if the internal
representation changes. For example, you might initially store width and height, but later decide to store area and
aspect ratio instead. With private data accessed through functions, you can make this change without breaking client
code—the get/set functions simply compute width and height from the new representation.

Accessor functions also provide a place to add logging, debugging, or other cross-cutting concerns without modifying all
the places that access the data. They make the code more maintainable and flexible.

**Protected vs Private for Base Classes**: When designing a class hierarchy, use `protected` for members that derived
classes legitimately need to access. However, be conservative—`protected` members are part of the derived class's
interface, and changing them can break derived classes just as changing public members can break clients.

The decision between private and protected involves trade-offs. Private provides better encapsulation and more freedom
to change the implementation, but it limits what derived classes can do. Protected provides more flexibility for
inheritance but creates more coupling between base and derived classes.

A good approach is to start with private and change to protected only when there's a demonstrated need. If you're
designing a class hierarchy where derived classes will be implemented by others (like a framework or library), protected
members are more justifiable. If you control all the derived classes, private members with protected accessor methods
might be better.

**Use private for True Implementation Details**: Helper functions, temporary state, caching, or anything that's purely
an optimization or implementation choice should be private. These are details that users of the class shouldn't care
about and that should be free to change.

```cpp
class DataProcessor {
    private:
       std::vector<int> data;
       mutable std::map<std::string, int> cache;  // Caching - implementation detail
       
       void rebuildCache() {  // Helper - implementation detail
           cache.clear();
           // Rebuild cache
       }
       
    public:
       int getValue(const std::string& key) const {
           if (cache.find(key) != cache.end()) {
               return cache[key];
           }
           int value = expensiveComputation(key);
           cache[key] = value;  // OK: mutable member can be modified in const function
           return value;
       }
};
```

The cache is an implementation detail. Users of the class don't need to know it exists. If we later decide that caching
hurts more than it helps, we can remove it without affecting any code that uses the class. This is the power of
encapsulation—the freedom to improve the implementation without affecting clients.

### 5.4 Friends: Breaking Encapsulation Deliberately

Sometimes, you need to grant specific external functions or classes access to a class's private members. The **`friend`
** mechanism allows this while maintaining encapsulation for everyone else. Friends are a controlled way to break
encapsulation when there's a good reason.

**Friend Functions**: A free function declared as a friend can access private and protected members. This is commonly
used for operator overloading when the operator needs to be a non-member function but requires access to private data.

```cpp
class Complex {
   private:
       double real, imag;
       
   public:
       Complex(double r, double i) : real(r), imag(i) {}
       
       // Declare operator+ as a friend so it can access private members
       friend Complex operator+(const Complex& lhs, const Complex& rhs);
};

// Friend function can access private members
Complex operator+(const Complex& lhs, const Complex& rhs) {
    return Complex(lhs.real + rhs.real, lhs.imag + rhs.imag);
}
```

Why not make this a member function? For symmetric binary operators like `+`, making them non-member friends allows for
more natural syntax and implicit conversions on both operands. A member function `operator+` would require the left
operand to be the object, preventing `5 + complexNum` (though `complexNum + 5` would work). As a non-member friend, both
operands are treated equally.

**Friend Classes**: An entire class can be declared as a friend, giving all its member functions access to private
members. This creates tight coupling but can be appropriate for closely related classes that work together to implement
an abstraction.

```cpp
class Engine;  // Forward declaration

class Car {
   private:
       Engine* engine;
       double fuelLevel;
       
       // Mechanic can access everything
       friend class Mechanic;
};

class Mechanic {
   public:
       void diagnose(Car& car) {
           // Can access car's private members
           if (car.fuelLevel < 0.1) {
               // Low fuel warning
           }
       }
};
```

Friend classes are useful for implementing complex abstractions that require multiple cooperating classes. For example,
iterators are often friends of their container classes, as they need access to the container's internal structure to
navigate it.

**Use Friends Sparingly**: While useful, friends violate encapsulation and create coupling. A class's friends are part
of its implementation, not its public interface. Changing private members may require changing friend code. This
coupling makes the code harder to maintain and understand.

Friends should be used primarily for:

1. Operator overloading where non-member functions need private access
2. Tightly coupled helper classes (like iterators)
3. Testing code that needs to verify internal state

Avoid using friends as a shortcut to bypass proper interface design. If you find yourself making many friends,
reconsider your class design—perhaps the public interface is too restrictive or the responsibilities are poorly
distributed.

The friend mechanism is a pragmatic compromise. It acknowledges that sometimes you need to break encapsulation, but it
does so in a controlled, documented way. The friend declaration makes the coupling explicit and searchable, unlike other
languages where back-door access might be hidden.

---

## 6. Member Functions and the `this` Pointer

### 6.1 The Implicit `this` Pointer

Every non-static member function receives an implicit parameter called `this`, which is a pointer to the object on which
the function was called. This pointer allows the function to access the object's members and distinguishes between
different objects of the same class. Understanding `this` is fundamental to understanding how member functions work.

The `this` pointer is implicit—you don't see it in the parameter list, and the compiler automatically provides it. When
you call a member function on an object, the compiler transforms the call to pass a pointer to that object as the `this`
parameter. This mechanism is how member functions know which object's data to access.

The type of `this` depends on whether the member function is `const`:

* In a non-const member function: `this` has type `ClassName* const` (const pointer to non-const object)
* In a const member function: `this` has type `const ClassName* const` (const pointer to const object)

The const-ness of `this` in const member functions is how C++ enforces that const member functions don't modify the
object. Since `this` points to a const object, attempting to modify members through it is a compile error.

```cpp
class Counter {
   private:
       int value;
       
   public:
       Counter() : value(0) {}
       
       void increment() {
           // Equivalent ways to access member:
           value++;           // Implicit use of this
           this->value++;     // Explicit use of this
           (*this).value++;   // Dereferencing this
       }
       
       int getValue() const {
           // In const function, this has type: const Counter* const
           return this->value;
       }
};
```

Typically, you don't need to use `this` explicitly—the compiler knows that unqualified member names refer to the current
object. However, there are specific situations where explicit use of `this` is necessary or beneficial. These situations
arise often enough that every C++ programmer should be comfortable with `this`.

The name `this` is a keyword in C++, and it's always a pointer (never a reference). This differs from some other
languages where `this` or `self` might be a reference. The pointer nature of `this` means you use `->` to access members
when using it explicitly.

### 6.2 When to Use `this` Explicitly

While the compiler handles `this` implicitly most of the time, there are situations where explicit use is necessary or
beneficial:

**Disambiguating Member Names from Parameters**: When a parameter has the same name as a member variable, `this->` is
needed to access the member. This situation arises when you want to use the same natural name for both the parameter and
the member it initializes.

```cpp
class Person {
   private:
       std::string name;
       int age;
       
   public:
       void setName(std::string name) {
           this->name = name;  // Disambiguate member from parameter
       }
       
       void setAge(int age) {
           this->age = age;    // Disambiguate member from parameter
       }
};
```

Modern C++ style tends to avoid this issue by using different naming conventions. Some developers use trailing
underscores for members (`name_`), some use a prefix (`m_name` or `mName`), and some just use different parameter
names (`newName`). However, using `this->` is perfectly valid and makes the code's intent very clear.

The advantage of using `this->` for disambiguation is that it allows you to use the most natural, descriptive names for
both parameters and members. The disadvantage is that it's slightly more verbose. Choose the approach that works best
for your team's coding standards.

**Returning the Current Object**: Returning `*this` enables method chaining and is essential for implementing certain
operators. This is a powerful pattern that allows fluent interfaces—code that reads like natural language.

```cpp
class Builder {
   private:
       int value;
       std::string text;
       
   public:
       Builder& setValue(int v) {
           value = v;
           return *this;  // Return reference to current object
       }
       
       Builder& setText(std::string t) {
           text = std::move(t);
           return *this;
       }
};

// Method chaining enabled by returning *this
Builder builder;
builder.setValue(42).setText("hello");
```

Method chaining works because each method returns a reference to `*this`, allowing the next method to be called on the
same object. This creates a fluent interface where method calls can be chained together, often reading like a sentence
in English. This pattern is popular in builder classes, query builders, and configuration objects.

The key detail is returning `*this` (the object itself) by reference, not returning `this` (the pointer). Returning the
pointer would require a different syntax (`builder.setValue(42)->setText("hello")`) and wouldn't support the fluent
pattern as naturally.

**Passing the Current Object to Another Function**: Sometimes you need to pass the current object to a function or
register it with another object. This is common in observer patterns, callback registration, and event systems.

```cpp
class Widget {
   public:
       void registerWithManager(WidgetManager& manager) {
           manager.addWidget(this);  // Pass pointer to current object
       }
};
```

Here, we're passing a pointer to the current object to the manager, which will store it and call back to it later. This
pattern is fundamental to many design patterns, particularly those involving callbacks or event handling.

Note that we pass `this` (the pointer) rather than `&(*this)` (taking the address of the dereferenced pointer). Both are
equivalent, but `this` is simpler and more idiomatic.

**Avoiding Ambiguity in Template Code**: In templates, `this->` can be necessary to access dependent names—names that
depend on template parameters. This is a subtle issue that arises in template class hierarchies:

```cpp
template<typename T>
class Base {
    protected:
        void baseFunction() {}
};

template<typename T>
class Derived : public Base<T> {
    public:
        void derivedFunction() {
            this->baseFunction();  // this-> required for dependent name
            // baseFunction();     // May not compile - dependent name issue
        }
};
```

This is a complex topic related to two-phase lookup in templates, but the key point is that `this->` can resolve certain
template-related ambiguities.

### 6.3 Const Member Functions and `this`

When you declare a member function as `const`, you're making a promise that the function won't modify the object's
state. Technically, this is enforced by making `this` point to a const object within that function. This
const-correctness is one of C++'s most important features for writing reliable code.

```cpp
class Point {
   private:
       double x, y;
       mutable int cacheHits;  // mutable members can be modified even in const functions
       
   public:
       Point(double x, double y) : x(x), y(y), cacheHits(0) {}
       
       // Const member function: this has type const Point* const
       double magnitude() const {
           cacheHits++;  // OK: mutable member
           // x = 0;     // ERROR: cannot modify non-mutable member
           return std::sqrt(x * x + y * y);
       }
       
       // Non-const member function: this has type Point* const
       void setX(double newX) {
           x = newX;  // OK: can modify members
       }
};

const Point p(3.0, 4.0);
double m = p.magnitude();  // OK: const object can call const functions
// p.setX(5.0);            // ERROR: const object cannot call non-const functions
```

The distinction between const and non-const member functions is fundamental to C++'s type system. A const object can
only call const member functions, ensuring that operations on const objects can't modify them. This allows you to pass
objects by const reference and know that they won't be modified, enabling both efficiency (pass by reference) and
safety (const guarantee).

The `const` qualifier is part of the function's signature. You can have two overloads that differ only in const-ness:

```cpp
class Container {
   private:
       std::vector<int> data;
       
   public:
       // Non-const version: called for non-const objects
       int& operator[](size_t index) {
           return data[index];
       }
       
       // Const version: called for const objects
       const int& operator[](size_t index) const {
           return data[index];
       }
};

Container c;
const Container cc;

int& ref = c[0];        // Calls non-const operator[]
// int& ref2 = cc[0];   // ERROR: cannot bind non-const ref to const int
const int& cref = cc[0]; // OK: calls const operator[]
```

This pattern allows const objects to access elements while preventing modification, and non-const objects to modify
elements. The const version returns a const reference (can't be used to modify), while the non-const version returns a
non-const reference (can be used to modify).

There's an important distinction between *physical constness* (the bits don't change) and *logical constness* (the
observable state doesn't change). The `mutable` keyword allows members to be modified in const member functions,
supporting logical constness. This is useful for caching, reference counting, and other implementation details that
don't affect the object's logical state.

```cpp
class ExpensiveComputation {
   mutable bool cached;
   mutable int cachedResult;
   
    public:
       int compute() const {
           if (!cached) {
               cachedResult = expensiveOperation();
               cached = true;
           }
           return cachedResult;
       }
};
```

The `compute` function is logically const (it doesn't change the object's observable state) but physically non-const (it
modifies the cache). The `mutable` keyword allows this, supporting the important pattern of transparent caching.

### 6.4 Static Member Functions

Static member functions are associated with the class itself rather than with any particular object. They don't receive
a `this` pointer and therefore cannot access non-static members directly. Static member functions represent operations
that belong to the class conceptually but don't require an instance.

```cpp
class MathUtils {
   public:
       static double square(double x) {
           return x * x;
       }
       
       static double cube(double x) {
           return x * x * x;
       }
};

// Called on the class, not on an object
double sq = MathUtils::square(5.0);
double cb = MathUtils::cube(3.0);
```

Static member functions are called on the class name (using `::`) rather than on an object. You can also call them on an
object, but this is misleading—the function doesn't use the object at all. Calling on the class name makes the static
nature explicit and is preferred.

Static member functions are useful for several purposes:

**Factory Methods**: Functions that create and return objects of the class.

```cpp
class Point {
    private:
       double x, y;
       Point(double x, double y) : x(x), y(y) {}  // Private constructor
       
    public:
       static Point createCartesian(double x, double y) {
           return Point(x, y);
       }
       
       static Point createPolar(double r, double theta) {
           return Point(r * cos(theta), r * sin(theta));
       }
};

Point p1 = Point::createCartesian(3.0, 4.0);
Point p2 = Point::createPolar(5.0, 0.927);
```

Factory methods provide named constructors, making code more readable when there are multiple ways to construct an
object.

**Utilities Related to the Class**: Operations that are conceptually related to the class but don't need object state.

**Managing Static Data Members**: Functions that provide controlled access to static members.

```cpp
class Database {
   private:
       static int connectionCount;
       
   public:
       Database() {
           connectionCount++;
       }
       
       ~Database() {
           connectionCount--;
       }
       
       // Static function to access static member
       static int getConnectionCount() {
           return connectionCount;
       }
};

// Definition of static member (in .cpp file)
int Database::connectionCount = 0;

// Usage
Database db1, db2;
int count = Database::getConnectionCount();  // Returns 2
```

Static member functions can only access static members and other static functions. They can't access `this` because
there is no object. Attempting to use non-static members in a static function is a compile error.

### 6.5 Method Chaining and Fluent Interfaces

Returning `*this` from member functions enables method chaining, creating fluent interfaces that read naturally and are
often easier to use than traditional APIs. This pattern has become increasingly popular in modern C++.

```cpp
class SqlQuery {
   private:
       std::string query;
       
   public:
       SqlQuery& select(const std::string& columns) {
           query = "SELECT " + columns;
           return *this;
       }
       
       SqlQuery& from(const std::string& table) {
           query += " FROM " + table;
           return *this;
       }
       
       SqlQuery& where(const std::string& condition) {
           query += " WHERE " + condition;
           return *this;
       }
       
       std::string build() const {
           return query + ";";
       }
};

// Fluent interface in action
SqlQuery query;
std::string sql = query.select("name, age").from("users").where("age > 18").build();
```

This pattern is particularly popular in builder classes, configuration objects, and domain-specific embedded languages.
The key is returning a reference to `*this` so that the result of one method call is the object itself, ready for the
next method call.

Fluent interfaces have advantages and disadvantages. They can make code more readable, especially when the methods form
a natural sentence. They can reduce the need for intermediate variables. However, they can also make code harder to
debug (which method in the chain failed?), can violate the principle of one operation per line, and can make it harder
to check return values.

Use method chaining judiciously. It's best for cases where:

1. The operations form a natural sequence
2. The order matters and is enforced by the types
3. The operations are simple modifications or configurations
4. Errors are either impossible or handled by exceptions

Avoid method chaining when:

1. Operations can fail and you need to check return values
2. The order doesn't matter or isn't obvious
3. Debugging would be complicated by not knowing which step failed
4. The chain becomes too long and hurts readability

---

## 7. Operator Overloading

### 7.1 The Philosophy of Operator Overloading

Operator overloading allows you to define how operators work with your custom types, making user-defined classes behave
like built-in types. When done correctly, this creates intuitive interfaces that improve code readability and
expressiveness. When done poorly, it creates confusion and unmaintainable code.

The C++ philosophy is that user-defined types should have the same privileges and capabilities as built-in types. If you
can write `int c = a + b;` for integers, you should be able to write `Complex c = a + b;` for complex numbers. Operator
overloading is the mechanism that makes this possible.

However, with this power comes responsibility. The fundamental principle of operator overloading is that overloaded
operators should provide semantics that match user expectations based on the operator's conventional meaning. Bjarne
Stroustrup emphasizes that overloaded operators should:

* Provide semantics that match user expectations for that operator
* Maintain the natural behavior and associativity of the operator
* Not surprise users with unexpected side effects or meanings

For example, overloading `+` for a `Matrix` class to perform matrix addition is intuitive—users expect `+` to mean
addition. Overloading `+` to perform matrix multiplication would be confusing because `+` suggests addition, not
multiplication. For multiplication, use `*`, which aligns with user expectations.

The goal is to make your types feel natural to use. When someone familiar with mathematics sees `a + b` for complex
numbers or matrices, they should intuitively understand what it means. The operator should behave consistently with
built-in types—for example, `a + b` should produce a new value without modifying `a` or `b`, just as `3 + 4` doesn't
modify 3 or 4.

```cpp
class Complex {
   private:
       double real, imag;
       
   public:
       Complex(double r = 0, double i = 0) : real(r), imag(i) {}
       
       // Overload + to add complex numbers
       Complex operator+(const Complex& other) const {
           return Complex(real + other.real, imag + other.imag);
       }
       
       // This matches mathematical expectations
};

Complex c1(1, 2), c2(3, 4);
Complex sum = c1 + c2;  // Natural and readable
```

There's an important distinction between operators that should be members and those that should be non-members.
Operators that fundamentally belong to the left operand (like `+=`, `*=`, `[]`, `->`) should be members. Operators that
treat both operands symmetrically (like `+`, `*`, `==`) should often be non-members (possibly friends) to allow implicit
conversions on both sides.

### 7.2 Overloading Arithmetic Operators

Arithmetic operators (`+`, `-`, `*`, `/`, `%`) typically return new objects representing the result of the operation.
They should be const member functions or non-member functions (preferably non-member for symmetry), and they should not
modify their operands.

```cpp
class Fraction {
   private:
       int numerator, denominator;

       void reduce() {
           int gcd_val = std::gcd(numerator, denominator);
           numerator /= gcd_val;
           denominator /= gcd_val;
       }
       
   public:
       Fraction(int num, int denom = 1) 
           : numerator(num), denominator(denom) {
           if (denominator == 0) {
               throw std::invalid_argument("Denominator cannot be zero");
           }
           reduce();
       }
       
       // Addition
       Fraction operator+(const Fraction& other) const {
           Fraction result(
               numerator * other.denominator + other.numerator * denominator,
               denominator * other.denominator
           );
           result.reduce();
           return result;
       }
       
       // Multiplication  
       Fraction operator*(const Fraction& other) const {
           Fraction result(
               numerator * other.numerator,
               denominator * other.denominator
           );
           result.reduce();
           return result;
       }
       
       // Unary minus
       Fraction operator-() const {
           return Fraction(-numerator, denominator);
       }
};

Fraction f1(1, 2);  // 1/2
Fraction f2(1, 3);  // 1/3
Fraction sum = f1 + f2;  // 5/6
Fraction product = f1 * f2;  // 1/6
Fraction neg = -f1;  // -1/2
```

Key design decisions for arithmetic operators:

**Return New Objects**: Arithmetic operators return new objects representing the result. They don't modify their
operands. This matches the behavior of built-in types—`3 + 4` doesn't modify 3 or 4, it produces 7.

**Const Member Functions**: They're declared `const` because they don't change the object's state. This allows
arithmetic operations on const objects and clearly documents that the operation doesn't have side effects.

**Maintain Invariants**: The implementation maintains class invariants. In this example, fractions are always stored in
reduced form. The operator implementations ensure that results are also in reduced form.

**Prefer Non-Member for Symmetry**: For binary operators where both operands should be treated equally, non-member
functions allow implicit conversions on both operands:

```cpp
class Fraction {
   // ... as before ...
   
   // Friend declaration for non-member operator
   friend Fraction operator+(const Fraction& lhs, const Fraction& rhs);
};

// Non-member operator allows conversions on both sides
Fraction operator+(const Fraction& lhs, const Fraction& rhs) {
   Fraction result(
       lhs.numerator * rhs.denominator + rhs.numerator * lhs.denominator,
       lhs.denominator * rhs.denominator
   );
   result.reduce();
   return result;
}

Fraction f(1, 2);
Fraction sum1 = f + Fraction(1, 3);  // Works
Fraction sum2 = Fraction(1, 3) + f;  // Also works
```

### 7.3 Overloading Comparison Operators

Comparison operators (`==`, `!=`, `<`, `<=`, `>`, `>=`) should return `bool` and be `const`. In C++20, you can use the
spaceship operator (`<=>`) to generate all comparisons from a single definition.

**Pre-C++20 Approach**:

```cpp
class Point {
   private:
       double x, y;

   public:
       Point(double x, double y) : x(x), y(y) {}
       
       bool operator==(const Point& other) const {
           return x == other.x && y == other.y;
       }
       
       bool operator!=(const Point& other) const {
           return !(*this == other);  // Implement in terms of ==
       }
       
       bool operator<(const Point& other) const {
           // Lexicographic comparison
           if (x < other.x) return true;
           if (x > other.x) return false;
           return y < other.y;
       }
       
       bool operator<=(const Point& other) const {
           return !(other < *this);
       }
       
       bool operator>(const Point& other) const {
           return other < *this;
       }
       
       bool operator>=(const Point& other) const {
           return !(*this < other);
       }
};
```

Notice the pattern: implement `==` and `<`, then define the others in terms of these. This reduces code duplication and
ensures consistency. However, this approach requires writing six functions for complete comparison support.

**C++20 Approach (Spaceship Operator)**:

```cpp
#include <compare>

class Point {
   private:
       double x, y;
       
   public:
       Point(double x, double y) : x(x), y(y) {}
       
       // Default spaceship operator generates all comparisons
       auto operator<=>(const Point& other) const = default;
       
       // For complete equality, also need ==
       bool operator==(const Point& other) const = default;
};
```

The spaceship operator `<=>` returns a comparison category indicating the relationship between the objects. The compiler
automatically generates all six comparison operators from this single definition. This dramatically reduces boilerplate
code and ensures consistency.

The spaceship operator can return different comparison categories:

* `std::strong_ordering`: Total ordering with equivalence (like integers)
* `std::weak_ordering`: Total ordering without equivalence (like case-insensitive strings)
* `std::partial_ordering`: Partial ordering (like floating-point with NaN)

For most classes, the defaulted spaceship operator is sufficient. For classes requiring custom comparison logic, you can
provide your own implementation:

```cpp
class CaseInsensitiveString {
    std::string data;
    
    public:
        auto operator<=>(const CaseInsensitiveString& other) const {
            return compareIgnoreCase(data, other.data);
        }
    
        bool operator==(const CaseInsensitiveString& other) const {
            return compareIgnoreCase(data, other.data) == 0;
        }
};
```

### 7.4 Overloading Assignment Operators

The assignment operator `=` is special because it's automatically generated by the compiler if you don't provide one.
However, for classes managing resources, you typically need a custom implementation.

The copy assignment operator is called when assigning one existing object to another. It differs from the copy
constructor in that the target object already exists and may own resources that need to be released.

```cpp
class DynamicArray {
   private:
       int* data;
       size_t size;
       
   public:
       // Constructor
       DynamicArray(size_t n) : data(new int[n]), size(n) {
           std::fill(data, data + size, 0);
       }
       
       // Destructor
       ~DynamicArray() {
           delete[] data;
       }
       
       // Copy assignment operator
       DynamicArray& operator=(const DynamicArray& other) {
           // 1. Self-assignment check
           if (this == &other) {
               return *this;
           }
           
           // 2. Release old resources
           delete[] data;
           
           // 3. Allocate new resources
           size = other.size;
           data = new int[size];
           
           // 4. Copy data
           std::copy(other.data, other.data + size, data);
           
           // 5. Return *this for chaining
           return *this;
       }
};
```

Critical aspects of assignment operators:

**Self-Assignment Check**: Without checking `if (this == &other)`, self-assignment (`arr = arr;`) would delete the data
before copying it, resulting in undefined behavior. While self-assignment might seem unlikely, it can occur in generic
code or complex expressions.

**Return `*this`**: Assignment operators should return a reference to `*this` to support chaining: `a = b = c;`. This
matches the behavior of built-in types and user expectations.

**Resource Management**: The operator must release current resources before acquiring new ones. This is where exception
safety becomes important—if `new` throws, the object is left in an invalid state in the above implementation.

**Exception Safety Problem**: The implementation above has an exception safety issue. If `new int[size]` throws, the
object is left in an invalid state (data was deleted but not replaced). We'll address this with the copy-and-swap idiom
in Section 8.

**Compound Assignment**: It's idiomatic to implement arithmetic assignment operators (`+=`, `-=`, etc.) and then
implement the arithmetic operators in terms of them:

```cpp
class Vector2D {
   private:
       double x, y;
       
   public:
       Vector2D(double x, double y) : x(x), y(y) {}
       
       // Compound assignment
       Vector2D& operator+=(const Vector2D& other) {
           x += other.x;
           y += other.y;
           return *this;
       }
       
       Vector2D& operator*=(double scalar) {
           x *= scalar;
           y *= scalar;
           return *this;
       }
};

// Implement + in terms of +=
Vector2D operator+(Vector2D lhs, const Vector2D& rhs) {
    lhs += rhs;  // Reuse +=
    return lhs;
}

// Implement * in terms of *=
Vector2D operator*(Vector2D v, double scalar) {
    v *= scalar;
    return v;
}
```

This approach reduces code duplication and ensures consistency between related operators. The compound assignment
operator modifies the object in place and returns a reference. The arithmetic operator creates a copy, modifies it using
the compound assignment operator, and returns the modified copy.

### 7.5 Overloading Stream Operators

Stream insertion (`<<`) and extraction (`>>`) operators allow your classes to work with C++ iostreams. These must be
non-member functions because the left operand is a stream object, not your class.

```cpp
class Book {
   private:
       std::string title;
       std::string author;
       int year;
       
       // Declare stream operators as friends to access private members
       friend std::ostream& operator<<(std::ostream& os, const Book& book);
       friend std::istream& operator>>(std::istream& is, Book& book);
       
   public:
       Book(std::string t, std::string a, int y)
           : title(std::move(t)), author(std::move(a)), year(y) {}
};

// Stream insertion - outputs object to stream
std::ostream& operator<<(std::ostream& os, const Book& book) {
    os << book.title << " by " << book.author << " (" << book.year << ")";
    return os;  // Return stream for chaining
}

// Stream extraction - reads object from stream
std::istream& operator>>(std::istream& is, Book& book) {
    std::getline(is, book.title);
    std::getline(is, book.author);
    is >> book.year;
    is.ignore();  // Consume newline
    return is;    // Return stream for chaining
}

// Usage
Book book("1984", "George Orwell", 1949);
std::cout << book << '\n';  // Calls operator<<

Book inputBook("", "", 0);
std::cin >> inputBook;  // Calls operator>>
```

Key points for stream operators:

**Return the Stream by Reference**: This enables chaining: `std::cout << book1 << book2;`. Returning by reference avoids
copying the stream (which isn't copyable) and allows multiple operations in one expression.

**Parameter Types**: Take the object by `const` reference for `<<` (we're just reading it) and by non-const reference
for `>>` (we're modifying it). Take the stream by non-const reference in both cases since we're modifying the stream.

**Friend Declaration**: Typically declare these as friend functions to access private members. Alternatively, they can
use public accessors, but this may not provide enough information to properly serialize/deserialize the object.

**Error Handling**: Stream operators should check the stream state and set error flags appropriately if operations fail.
The extraction operator should validate input and leave the stream in a good state if parsing fails.

### 7.6 Overloading Subscript Operator

The subscript operator `[]` provides array-like access to elements. It's particularly useful for container classes. You
typically provide both const and non-const versions to support both reading and writing.

```cpp
class IntArray {
   private:
       int* data;
       size_t size;
       
   public:
       IntArray(size_t n) : data(new int[n]()), size(n) {}
       
       ~IntArray() {
           delete[] data;
       }
       
       // Non-const version: allows modification
       int& operator[](size_t index) {
           if (index >= size) {
               throw std::out_of_range("Index out of bounds");
           }
           return data[index];
       }
       
       // Const version: read-only access
       const int& operator[](size_t index) const {
           if (index >= size) {
               throw std::out_of_range("Index out of bounds");
           }
           return data[index];
       }
       
       size_t getSize() const { return size; }
};

// Usage
IntArray arr(10);
arr[0] = 42;           // Calls non-const operator[]
int value = arr[0];    // Calls non-const operator[]

const IntArray& cref = arr;
// cref[0] = 42;       // ERROR: calls const operator[], returns const int&
int val = cref[0];     // OK: calls const operator[]
```

The dual overload pattern (const and non-const versions) is common for operators that provide access to internal data.
The const version returns a const reference, preventing modification. The non-const version returns a non-const
reference, allowing modification.

This pattern ensures that const correctness is maintained. Const objects can access elements but can't modify them.
Non-const objects can both access and modify elements. The compiler automatically selects the appropriate version based
on whether the object is const.

### 7.7 Function Call Operator

Overloading `operator()` creates **functors** (function objects)—objects that can be called like functions. This is
powerful for callbacks, customizable algorithms, and stateful functions.

```cpp
class Multiplier {
   private:
       double factor;
       
   public:
       explicit Multiplier(double f) : factor(f) {}
       
       // Overload () operator
       double operator()(double x) const {
           return x * factor;
       }
};

// Usage
Multiplier times2(2.0);
double result = times2(5.0);  // Calls operator(), returns 10.0

// Use with algorithms
std::vector<double> values = {1.0, 2.0, 3.0, 4.0, 5.0};
Multiplier times3(3.0);
std::transform(values.begin(), values.end(), values.begin(), times3);
// values is now {3.0, 6.0, 9.0, 12.0, 15.0}
```

Functors have several advantages over plain function pointers:

**State**: They can maintain state (like `factor` above). Each instance can have different behavior based on its state.

**Inline Optimization**: The compiler can more easily inline functor calls than function pointer calls, leading to
better performance.

**Type Safety**: Functors are strongly typed. The compiler can verify that you're using them correctly.

**STL Compatibility**: Functors work seamlessly with STL algorithms, which expect callable objects.

Functors can be more complex, with multiple overloads of `operator()`:

```cpp
class Printer {
public:
   void operator()(int x) const {
       std::cout << "Int: " << x << '\n';
   }
   
   void operator()(const std::string& s) const {
       std::cout << "String: " << s << '\n';
   }
};

Printer print;
print(42);        // Calls operator()(int)
print("hello");   // Calls operator()(const std::string&)
```

With C++11 lambdas, the need for functors has decreased—lambdas are often more convenient for simple cases. However,
functors are still valuable for complex callable objects that need to be reused, named, or have sophisticated state
management.

### 7.8 Conversion Operators

Conversion operators allow implicit or explicit conversions from your class to other types. They're declared without a
return type (the return type is the conversion target type). Use `explicit` to prevent unwanted implicit conversions.

```cpp
class Celsius {
   private:
       double temp;
       
   public:
       explicit Celsius(double t) : temp(t) {}
       
       // Conversion to double
       explicit operator double() const {
           return temp;
       }
       
       // Conversion to bool (for conditional testing)
       explicit operator bool() const {
           return temp > 0.0;  // True if above freezing
       }
};

Celsius c(25.0);
double t = static_cast<double>(c);  // Explicit conversion required
if (c) {  // Explicit operator bool allows this
    std::cout << "Above freezing\n";
}
```

The `explicit` keyword prevents implicit conversions, which can avoid subtle bugs. Without `explicit`, writing
`double t = c;` would implicitly call the conversion operator, which might not be what you want. Implicit conversions
can lead to ambiguous overload resolution and surprising behavior.

**Best Practices**:

**Use `explicit`**: Make conversion operators `explicit` by default to prevent surprises. Only make conversions implicit
when the conversion is obviously correct and never surprising.

**Conversion to bool**: The `bool` conversion is special—it's used in conditional contexts (`if`, `while`, etc.). Make
it `explicit` to prevent surprising conversions in arithmetic contexts.

**Avoid Conversion Chains**: Be careful with classes that can convert to each other. Chains of implicit conversions can
create ambiguity and confusing code.

Conversion operators are useful but should be used sparingly. They're most appropriate when the conversion is
fundamentally sound and represents a natural relationship between the types. For example, converting a `std::string` to
`const char*` makes sense because strings are essentially character arrays with additional functionality.

---

## 8. Copy Semantics

### 8.1 The Copy Constructor

A **copy constructor** creates a new object as a copy of an existing object. It's called when you create an object by
copying another object, pass an object by value, return an object by value (though often elided), or initialize elements
in a container.

The signature of a copy constructor is:

```cpp
ClassName(const ClassName& other);
```

The parameter is a const reference to the same type. It's a reference because passing by value would require calling the
copy constructor to make the copy, which would be infinitely recursive. It's const because copying shouldn't modify the
source object.

Understanding when the copy constructor is called is crucial for understanding object lifetime and resource management
in C++. It's called in these situations:

* Explicit copy initialization: `MyClass obj2(obj1);` or `MyClass obj2 = obj1;`
* Passing by value: `void func(MyClass obj);` called with `func(myObj);`
* Returning by value: `MyClass func() { MyClass obj; return obj; }`
* Container operations: `vec.push_back(myObj);`

**Compiler-Generated Copy Constructor**: If you don't define a copy constructor, the compiler generates one that
performs memberwise copy—copying each member using its copy constructor or assignment. For many classes, this default
behavior is correct.

```cpp
class Simple {
    int value;
    std::string text;
    // Compiler-generated copy constructor:
    // Simple(const Simple& other) 
    //     : value(other.value), text(other.text) {}
};
```

For simple classes with no resource management—classes that contain only built-in types and class types that manage
their own resources (like `std::string`, `std::vector`, `std::unique_ptr`)—the compiler-generated copy constructor is
usually sufficient and should be used. Explicitly requesting the default with `= default` makes your intentions clear:

```cpp
class Simple {
public:
   Simple(const Simple&) = default;
};
```

However, when your class manages resources—dynamic memory, file handles, network connections, locks—you typically need a
custom copy constructor to perform **deep copying**. The compiler-generated version would perform shallow copying, which
is rarely what you want for resource-managing classes.

### 8.2 Deep Copy vs Shallow Copy and C-Strings

This distinction is crucial when dealing with pointers, dynamic memory, and especially C-strings. Understanding the
difference can prevent some of the most common and pernicious bugs in C++.

**Shallow Copy**: Copies the pointer value itself, not what it points to. Both objects end up pointing to the same data.
This is almost never what you want for resource-managing classes, as it leads to double-deletion problems.

**Deep Copy**: Allocates new memory and copies the actual data. Each object has its own independent copy. This is the
correct behavior for most resource-managing classes.

Let's explore this with C-strings, which present unique challenges in C++ classes:

```cpp
class ShallowString {
   char* data;
   
public:
   ShallowString(const char* str) {
       data = new char[strlen(str) + 1];
       strcpy(data, str);
   }
   
   // Compiler-generated copy constructor does shallow copy
   // ShallowString(const ShallowString& other) : data(other.data) {}
   
   ~ShallowString() {
       delete[] data;  // DISASTER: double delete!
   }
};

// Problem:
ShallowString s1("hello");
ShallowString s2 = s1;  // Shallow copy - both point to same memory
// When s2 is destroyed, it deletes the memory
// When s1 is destroyed, it tries to delete already-freed memory = crash!
```

Let's understand what goes wrong here in detail. When `s2` is created as a copy of `s1`, the compiler-generated copy
constructor copies the `data` pointer. Now both `s1.data` and `s2.data` point to the same memory location. When `s2`
goes out of scope and is destroyed, its destructor calls `delete[] data`, freeing the memory. Later, when `s1` goes out
of scope, its destructor also calls `delete[] data` on the same memory location, which is now invalid. This is undefined
behavior and typically causes a crash.

The solution is a deep copy that allocates new memory and copies the actual string data:

```cpp
class DeepString {
    char* data;
    
    public:
        DeepString(const char* str) {
            data = new char[strlen(str) + 1];
            strcpy(data, str);
        }
    
        // Custom copy constructor - deep copy
        DeepString(const DeepString& other) {
            data = new char[strlen(other.data) + 1];
            strcpy(data, other.data);  // Copy the data, not the pointer
        }
    
        ~DeepString() {
            delete[] data;  // Safe: each object owns its own memory
        }
};

// Now safe:
DeepString s1("hello");
DeepString s2 = s1;  // Deep copy - s2 has its own "hello"
// Both destructors can safely delete their respective memory
```

### 8.3 Managing C-Strings in Classes

C-strings require special care in C++ classes because they're raw character arrays that need manual memory management.
Understanding the differences between `char*`, `char[]`, and `std::string` is essential:

```cpp
class CStringExamples {
private:
    // Three different approaches to string storage
    char* dynamicCString;        // Requires manual memory management
    char fixedCString[50];       // Fixed-size, no allocation needed
    std::string modernString;    // Automatic memory management
    
public:
    // Constructor handling C-strings
    CStringExamples(const char* input) {
        // Dynamic C-string - must allocate and copy
        if (input) {
            size_t len = std::strlen(input);
            dynamicCString = new char[len + 1];  // +1 for null terminator!
            std::strcpy(dynamicCString, input);
            // Safer alternative:
            // std::strncpy(dynamicCString, input, len);
            // dynamicCString[len] = '\0';  // Ensure null termination
        } else {
            dynamicCString = nullptr;
        }
        
        // Fixed C-string - no allocation, but must check size
        if (input && std::strlen(input) < 50) {
            std::strncpy(fixedCString, input, 49);
            fixedCString[49] = '\0';  // Ensure null termination
        } else {
            fixedCString[0] = '\0';  // Empty string
        }
        
        // std::string - handles everything automatically
        if (input) {
            modernString = input;
        }
    }
    
    // Copy constructor - must deep copy C-strings
    CStringExamples(const CStringExamples& other) {
        // Deep copy dynamic C-string
        if (other.dynamicCString) {
            size_t len = std::strlen(other.dynamicCString);
            dynamicCString = new char[len + 1];
            std::strcpy(dynamicCString, other.dynamicCString);
        } else {
            dynamicCString = nullptr;
        }
        
        // Copy fixed C-string
        std::strcpy(fixedCString, other.fixedCString);
        
        // std::string copy is automatic
        modernString = other.modernString;
    }
    
    // Destructor - only dynamic C-string needs cleanup
    ~CStringExamples() {
        delete[] dynamicCString;  // Must use delete[], not delete!
        // fixedCString is automatic
        // modernString is automatic
    }
    
    // Setter demonstrating C-string management
    void setDynamicCString(const char* newValue) {
        if (newValue) {
            // Must delete old, allocate new
            delete[] dynamicCString;
            size_t len = std::strlen(newValue);
            dynamicCString = new char[len + 1];
            std::strcpy(dynamicCString, newValue);
        }
    }
    
    // Converting between C-string and std::string
    void conversionExamples() {
        // C-string to std::string (easy and safe)
        if (dynamicCString) {
            std::string s = dynamicCString;
        }
        
        // std::string to C-string (returns pointer to internal buffer)
        const char* cstr = modernString.c_str();
        // DANGER: cstr becomes invalid when modernString changes!
        // The pointer is only valid as long as the string exists and isn't modified
        
        // Safe: copy to your own buffer
        std::strcpy(fixedCString, modernString.c_str());
    }
};
```

**Critical C-String Rules**:

1. **Always allocate `strlen(str) + 1`** bytes for the null terminator. Forgetting this leads to buffer overruns.

2. **Use `delete[]` not `delete`** for character arrays allocated with `new char[]`. Using plain `delete` causes
   undefined behavior.

3. **Prefer `strncpy` over `strcpy`** to avoid buffer overflows, and manually ensure null termination:
   ```cpp
   strncpy(dest, src, n - 1);
   dest[n - 1] = '\0';
   ```

4. **Deep copy required** in copy constructor and copy assignment operator. Shallow copying leads to double-deletion
   bugs.

5. **Prefer `std::string`** unless you're interfacing with C APIs that require C-strings. `std::string` handles all the
   memory management automatically and is exception-safe.

Common pitfalls with C-strings in classes:

```cpp
class CStringPitfalls {
private:
    char* data;
    
public:
    // WRONG: Forgetting null terminator
    void badInitialization() {
        data = new char[10];
        std::strncpy(data, "Hello World", 10);  // Truncated, NO null terminator!
        // Now strlen(data) causes undefined behavior
    }
    
    // WRONG: Buffer overflow
    void bufferOverflow(const char* input) {
        char buffer[10];
        std::strcpy(buffer, input);  // If input > 9 chars, overflow!
        // Use strncpy and ensure null termination instead
    }
    
    // WRONG: Using deleted memory (dangling pointer)
    const char* danglingPointer() {
        std::string temp = "temporary";
        return temp.c_str();  // Returns pointer to deleted memory!
    }
    
    // WRONG: Using assignment in constructor body instead of member initializer
    void inefficientInitialization(const char* input) {
        data = new char[50];  // First allocation
        std::strcpy(data, input);
        // Should have sized allocation to actual string length + 1
    }
};
```

**Best Practice**: Modern C++ strongly prefers `std::string` over C-strings. Use C-strings only at API boundaries when
interfacing with C libraries:

```cpp
class ModernApproach {
private:
    std::string data;  // Handles everything automatically
    
public:
    ModernApproach(const char* input) : data(input ? input : "") {}
    
    // All special members work correctly automatically
    // No manual memory management needed
    
    // Only convert to C-string at API boundaries
    void callCApi() {
        some_c_function(data.c_str());
    }
};
```

The advantages of `std::string` over raw C-strings are overwhelming:

* Automatic memory management (no leaks, no double-deletes)
* Exception safety
* Bounds checking (with `at()`)
* Rich set of member functions for manipulation
* Efficient (small string optimization, move semantics)
* Interoperates with C APIs via `c_str()`

### 8.4 Copy Assignment Operator

The copy assignment operator is called when assigning one existing object to another. It's similar to the copy
constructor but must handle the fact that the target object already exists and may own resources that need to be
released.

The signature is:

```cpp
ClassName& operator=(const ClassName& other);
```

The key differences from the copy constructor:

* The target object already exists and may need cleanup
* Must check for self-assignment
* Returns a reference to `*this` to enable chaining

```cpp
class String {
   char* data;
    
public:
   String(const char* str = "") {
       data = new char[std::strlen(str) + 1];
       std::strcpy(data, str);
   }
   
   // Copy constructor
   String(const String& other) {
       data = new char[std::strlen(other.data) + 1];
       std::strcpy(data, other.data);
   }
   
   // Copy assignment operator
   String& operator=(const String& other) {
       // 1. Self-assignment check
       if (this == &other) {
           return *this;
       }
       
       // 2. Free existing resource
       delete[] data;
       
       // 3. Allocate and copy new resource
       data = new char[std::strlen(other.data) + 1];
       std::strcpy(data, other.data);
       
       // 4. Return *this
       return *this;
   }
   
   ~String() {
       delete[] data;
   }
};
```

The assignment operator must:

**Check for Self-Assignment**: Without checking `if (this == &other)`, self-assignment (`str = str;`) would delete
`data` before copying from it, reading from deleted memory. While self-assignment might seem rare, it can occur in
generic code or when using references/pointers.

**Release Current Resources**: Before acquiring new resources, free the old ones to prevent memory leaks.

**Acquire and Copy New Resources**: Allocate new memory and copy the data from the source.

**Return `*this`**: Return a reference to the current object to support assignment chaining like `a = b = c;`.

However, this implementation has a critical **exception safety** problem: if `new` throws an exception (out of memory),
the object is left in an invalid state—`data` was deleted but not replaced with valid memory. This violation of the
basic exception safety guarantee is unacceptable.

### 8.5 Copy-and-Swap Idiom

The **copy-and-swap idiom** is an elegant technique that provides strong exception safety for assignment operators. It
leverages the copy constructor and a swap function to implement assignment safely and concisely.

```cpp
class String {
   char* data;
   size_t length;
    
public:
   String(const char* str = "") 
       : length(std::strlen(str)), data(new char[length + 1]) {
       std::strcpy(data, str);
   }
   
   // Copy constructor
   String(const String& other) 
       : length(other.length), data(new char[length + 1]) {
       std::strcpy(data, other.data);
   }
   
   // swap function
   void swap(String& other) noexcept {
       std::swap(data, other.data);
       std::swap(length, other.length);
   }
   
   // Assignment via copy-and-swap
   String& operator=(String other) {  // Note: pass by value
       swap(other);  // Swap with the copy
       return *this;
       // other (containing old data) destroyed on return
   }
   
   ~String() {
       delete[] data;
   }
};
```

How copy-and-swap works:

1. The **parameter is passed by value**, which invokes the **copy constructor** to create a temporary copy of the
   source. This is where allocation happens and where an exception might be thrown.

2. We **swap** the current object's data with the temporary copy's data using a no-throw swap function.

3. The **temporary** (now containing the old data) is **destroyed** when the function returns, automatically cleaning up
   the old resources.

Benefits of copy-and-swap:

**Strong Exception Safety**: If copying throws (during parameter passing), the assignment operator hasn't modified
`*this`. The operation either fully succeeds or has no effect—this is the strong guarantee.

**Self-Assignment Safety**: Self-assignment works correctly, though inefficiently (it makes an unnecessary copy). Some
implementations add a self-assignment check as an optimization.

**Code Reuse**: The implementation leverages the copy constructor and swap function, avoiding code duplication. The
logic for copying is in one place (the copy constructor).

**Simplicity**: The implementation is straightforward and difficult to get wrong, unlike manual resource management.

The copy-and-swap idiom is the preferred way to implement copy assignment in modern C++ when you need custom copy
semantics. It provides exception safety and code reuse with minimal complexity.

### 8.6 Preventing Copies

Sometimes you want to prevent copying entirely. Objects representing unique resources (file handles, mutexes,
`unique_ptr`s) should not be copyable. In C++11 and later, use `= delete`:

```cpp
class Unique {
public:
   Unique() = default;
   
   // Delete copy operations
   Unique(const Unique&) = delete;
   Unique& operator=(const Unique&) = delete;
   
   // Still allow move operations (see next section)
   Unique(Unique&&) = default;
   Unique& operator=(Unique&&) = default;
};

Unique u1;
// Unique u2 = u1;  // ERROR: copy constructor deleted
Unique u2 = std::move(u1);  // OK: move constructor
```

Classes that manage unique resources often delete copy operations to prevent accidental duplication. This makes the
ownership semantics explicit—these objects can be moved but not copied.

Pre-C++11, you would declare copy operations private without defining them:

```cpp
class Noncopyable {
private:
   Noncopyable(const Noncopyable&);  // Declared but not defined
   Noncopyable& operator=(const Noncopyable&);
};
```

Attempting to copy would cause a link error (private) or linker error (undefined). The modern `= delete` approach is
clearer and provides better error messages.

---

## 9. Move Semantics and Rvalue References

### 9.1 The Motivation for Move Semantics

Before C++11, copying was the only way to transfer object state. This was inefficient for temporary objects or when
transferring ownership. Consider a function returning a large vector:

```cpp
std::vector<int> createLargeVector() {
    std::vector<int> vec(1000000);
    // Fill vec...
    return vec;  // In C++03, this could involve copying millions of integers
}

std::vector<int> myVec = createLargeVector();  // Another potential copy
```

In pre-C++11 C++, this could involve copying millions of integers multiple times—once when returning from the function,
and potentially again during assignment. Return Value Optimization (RVO) could eliminate some copies, but not all, and
it wasn't guaranteed.

Move semantics solve this by allowing resources to be transferred (moved) from temporary objects instead of copied. When
a function returns a vector, instead of copying all the elements, we can just transfer ownership of the internal buffer.
This is dramatically more efficient—instead of allocating new memory and copying millions of integers, we just copy a
few pointers.

Move semantics address several inefficiencies in pre-C++11 C++:

* Returning large objects from functions
* Passing temporary objects to functions
* Growing containers (vector reallocation, for example)
* Swapping objects

In all these cases, we know the source object is temporary or will no longer be needed, so copying is wasteful. Move
semantics let us "steal" the resources from the source instead.

### 9.2 Lvalues and Rvalues

Understanding value categories is essential for move semantics. C++ classifies expressions into categories based on
their properties, with lvalues and rvalues being the most important.

**Lvalue**: An expression that refers to an object with a persistent identity. You can take its address, and it persists
beyond a single expression. Typically, has a name.

```cpp
int x = 5;      // x is an lvalue
int* p = &x;    // Can take address of lvalue
```

**Rvalue**: An expression that refers to a temporary object or a value that doesn't have persistent identity. You cannot
take its address, and it doesn't persist beyond the expression that uses it.

```cpp
int y = 5 + 3;  // "5 + 3" is an rvalue (temporary result)
// int* p = &(5 + 3);  // ERROR: can't take address of rvalue
```

The key insight: rvalues are temporary. Since they're about to be destroyed anyway, we can safely "steal" their
resources. This is the foundation of move semantics.

**Rvalue Reference**: A new kind of reference (introduced in C++11) that binds to rvalues, written as `T&&`. This allows
functions to detect when they're called with a temporary and optimize accordingly.

```cpp
void process(int& x) {
    std::cout << "Lvalue reference\n";
}

void process(int&& x) {
    std::cout << "Rvalue reference\n";
}

int a = 10;
process(a);        // Calls lvalue version
process(20);       // Calls rvalue version (20 is temporary)
process(a + 5);    // Calls rvalue version (a + 5 is temporary)
```

This overload resolution based on value category is how move semantics work. When you pass a temporary, the compiler
selects the rvalue reference overload, which can move instead of copy.

### 9.3 Move Constructor

A **move constructor** transfers resources from a temporary (rvalue) object to a new object, leaving the source in a
valid but unspecified state. It's an optimization that avoids expensive copying when the source is temporary.

The signature:

```cpp
ClassName(ClassName&& other) noexcept;
```

The parameter is a rvalue reference (`&&`). The `noexcept` specification is important—it tells the compiler this
operation won't throw, enabling certain optimizations (like in `std::vector` reallocation).

```cpp
class Buffer {
   private:
       char* data;
       size_t size;
       
   public:
       // Regular constructor
       Buffer(size_t s) : data(new char[s]), size(s) {
           std::cout << "Allocating " << size << " bytes\n";
       }
       
       // Copy constructor (deep copy)
       Buffer(const Buffer& other) : data(new char[other.size]), size(other.size) {
           std::cout << "Copying " << size << " bytes\n";
           std::memcpy(data, other.data, size);
       }
       
       // Move constructor (transfer ownership)
       Buffer(Buffer&& other) noexcept 
           : data(other.data), size(other.size) {
           std::cout << "Moving " << size << " bytes\n";
           // Leave source in valid state
           other.data = nullptr;
           other.size = 0;
       }
       
       ~Buffer() {
           delete[] data;
       }
};

Buffer createBuffer() {
    return Buffer(1000);  // Returns temporary
}

Buffer b = createBuffer();  // Move constructor called (no copy!)
```

Key points about move constructors:

**Takes Rvalue Reference**: The parameter type `T&&` indicates this constructor is called for temporaries.

**Mark `noexcept`**: When possible, mark move constructors `noexcept`. This enables important optimizations,
particularly in containers. For example, `std::vector` will use move operations during reallocation only if they're
`noexcept`; otherwise, it copies to maintain the strong exception safety guarantee.

**Leave Source Valid**: After the move, the source object must be in a valid state (its destructor will be called).
Typically, this means setting pointers to `nullptr` and counters to zero.

**Transfer Resources, Don't Allocate**: The whole point of moving is to avoid allocation. The move constructor should
just transfer ownership of existing resources, not allocate new ones.

The move constructor is automatically called when:

* Returning a local object from a function (unless RVO eliminates it entirely)
* Passing a temporary to a function by value
* Initializing an object with `std::move(other)`

### 9.4 Move Assignment Operator

Similar to the move constructor, but for assignment. It transfers resources from a temporary to an existing object.

The signature:

```cpp
ClassName& operator=(ClassName&& other) noexcept;
```

```cpp
class Buffer {
    // ... (previous members)
    
    // Move assignment operator
    Buffer& operator=(Buffer&& other) noexcept {
        if (this == &other) {
            return *this;
        }
        
        // Free existing resources
        delete[] data;
        
        // Steal resources from other
        data = other.data;
        size = other.size;
        
        // Leave other in valid state
        other.data = nullptr;
        other.size = 0;
        
        return *this;
    }
};
```

Or using the copy-and-swap idiom (works for both copy and move):

```cpp
Buffer& operator=(Buffer other) noexcept {  // Pass by value
    swap(other);  // Works for both copy and move
    return *this;
}
```

When the parameter is passed by value, the compiler chooses the copy constructor for lvalues or the move constructor for
rvalues automatically. Then we swap with that copy/moved object. This unified approach handles both copy and move
assignment with a single function.

### 9.5 std::move

`std::move` is a cast that converts a lvalue to a rvalue reference, enabling move operations on named objects. Despite
its name, it doesn't actually move anything—it just changes the value category.

```cpp
Buffer b1(1000);
Buffer b2(2000);

// b2 = b1;              // Calls copy assignment
b2 = std::move(b1);      // Calls move assignment

// After move, b1 is valid but unspecified (probably empty)
// Don't use b1 except to reassign or destroy it
```

Understanding what `std::move` does and doesn't do is crucial:

**What it does**: Cast a lvalue to a rvalue reference, making it eligible for move operations.

**What it doesn't do**: Actually move anything. The move happens when a move constructor or move assignment operator is
called.

After `std::move`, the object is in a **valid but unspecified state**. This means:

You **can**:

* Destroy it (destructor must work on moved-from objects)
* Assign to it (give it a new value)
* Call member functions that don't depend on the object's value

You **should not**:

* Use its value
* Assume it has any particular state
* Pass it to functions that expect meaningful values

```cpp
Buffer b1(1000);
Buffer b2 = std::move(b1);  // Move from b1

// b1 is now in a valid but unspecified state

// OK: Destroy b1
// OK: Assign to b1
b1 = Buffer(500);

// NOT OK: Use b1's value
// size_t s = b1.size;  // Don't do this - value is unspecified
```

`std::move` is essential when you know you're done with an object and want to transfer its resources to something else.
Common uses include:

* Returning local objects that you want to move (though modern compilers often optimize this without explicit
  `std::move`)
* Moving objects into containers
* Implementing move constructors and assignment operators
* Transferring ownership of unique resources

### 9.6 Perfect Forwarding

Perfect forwarding preserves the value category (lvalue/rvalue) when passing arguments through template functions. This
is essential for generic code that needs to pass arguments to other functions without changing their properties.

```cpp
template<typename T>
void wrapper(T&& arg) {  // Universal/forwarding reference
    // Without forward:
    // process(arg);  // Always passes as lvalue
    
    // With forward:
    process(std::forward<T>(arg));  // Preserves lvalue/rvalue
}

int x = 5;
wrapper(x);        // Forwards as lvalue to process
wrapper(10);       // Forwards as rvalue to process
```

`T&&` in a template context is a **universal reference** (also called **forwarding reference**), not a rvalue
reference. It can bind to both lvalues and rvalues through reference collapsing rules:

* If `T` is `int&`, `T&&` becomes `int&` (lvalue reference)
* If `T` is `int`, `T&&` becomes `int&&` (rvalue reference)

`std::forward<T>` casts `arg` to the appropriate category based on `T`. This preserves whether the original argument was
a lvalue or rvalue.

Perfect forwarding is crucial for:

* Wrapper functions that pass arguments to other functions
* Factory functions (like `std::make_unique`, `std::make_shared`)
* Generic code that forwards arguments to constructors
* Libraries that need to perfectly forward user-provided arguments

```cpp
// Factory function using perfect forwarding
template<typename T, typename... Args>
std::unique_ptr<T> make_unique(Args&&... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}

// Usage
auto p1 = make_unique<Buffer>(1000);  // Forwards 1000 as rvalue
int size = 2000;
auto p2 = make_unique<Buffer>(size);  // Forwards size as lvalue
```

### 9.7 Return Value Optimization (RVO) and Copy Elision

Compilers can eliminate copies and moves when returning objects, even changing the program's observable behavior. This
optimization is so important that C++17 made certain cases mandatory.

```cpp
Buffer createBuffer() {
    Buffer temp(1000);
    return temp;  // Might be elided (no move/copy at all)
}
```

**Named Return Value Optimization (NRVO)**: When returning a named local variable, the compiler may construct it
directly in the caller's space, eliminating the copy/move entirely.

**Guaranteed Copy Elision (C++17)**: When returning a temporary (prvalue), copy/move is **guaranteed to be elided**. The
object is constructed directly in the destination.

```cpp
Buffer b = Buffer(1000);  // Direct construction, no copy/move (C++17)
Buffer b = createBuffer(); // May or may not be elided depending on compiler
```

Important: **Don't use `std::move` on return values**. It prevents RVO:

```cpp
Buffer createBuffer() {
    Buffer temp(1000);
    return std::move(temp);  // DON'T DO THIS - prevents RVO!
}
```

The compiler automatically treats return values as rvalues when beneficial. Adding `std::move` can actually make things
worse by:

* Preventing RVO (which eliminates the operation entirely)
* Being redundant when the compiler would already use move
* Potentially binding to the wrong overload in complex scenarios

The guideline is simple: just return local variables normally. Trust the compiler to optimize appropriately. Use
`std::move` on return only in rare cases where you're returning a non-local variable or member.

---

## 10. Inheritance and Type Hierarchies

### 10.1 The Concept of Inheritance

**Inheritance** models "is-a" relationships: a Dog is-a Animal, a Circle is-a Shape. The derived class (child/subclass)
inherits members from the base class (parent/superclass) and can add new members or override existing behavior.

Inheritance is one of the core mechanisms of object-oriented programming, enabling code reuse and polymorphism. However,
it's also one of the most frequently misused features in C++. Understanding when to use inheritance and when to prefer
other mechanisms (like composition) is crucial for good design.

```cpp
class Animal {
   protected:
       std::string name;
       int age;
       
   public:
       Animal(std::string n, int a) : name(std::move(n)), age(a) {}
       
       virtual void makeSound() const {
           std::cout << "Some generic animal sound\n";
       }
       
       void eat() const {
           std::cout << name << " is eating\n";
       }
       
       virtual ~Animal() = default;
};

class Dog : public Animal {
   private:
       std::string breed;
       
   public:
       Dog(std::string n, int a, std::string b) 
           : Animal(std::move(n), a), breed(std::move(b)) {}
       
       // Override base class method
       void makeSound() const override {
           std::cout << "Woof! Woof!\n";
       }
       
       // Add new method specific to Dog
       void fetch() const {
           std::cout << name << " is fetching\n";
       }
};

// Usage
Dog buddy("Buddy", 3, "Golden Retriever");
buddy.makeSound();  // Calls Dog::makeSound
buddy.eat();        // Calls inherited Animal::eat
buddy.fetch();      // Calls Dog::fetch

Animal* ptr = &buddy;
ptr->makeSound();   // Polymorphism: calls Dog::makeSound
```

Inheritance establishes relationships that enable code reuse and polymorphism. The derived class automatically gains all
the public and protected members of the base class, reducing duplication. More importantly, inheritance enables
polymorphism—the ability to treat objects of different types uniformly through a common interface.

However, modern C++ design often prefers composition to inheritance. Inheritance creates tight coupling between base and
derived classes—changes to the base can break derived classes. Composition is more flexible and creates looser coupling.
The general guideline is: use inheritance for true "is-a" relationships where polymorphism is needed; use composition
for "has-a" relationships or code reuse without polymorphism.

### 10.2 Access Control in Inheritance

The inheritance access specifier controls how base class members are inherited into the derived class. This is separate
from the access specifiers within the class (public, protected, private).

**Public Inheritance** (`class Derived : public Base`):

This is the most common form and represents a true "is-a" relationship. Public members of the base remain public in the
derived class, protected members remain protected, and private members are inaccessible (but still exist as part of the
object).

```cpp
class Base {
   public:
       int pubData;
       
   protected:
       int protData;
       
   private:
       int privData;
};

class PublicDerived : public Base {
    // pubData is public
    // protData is protected
    // privData is inaccessible
};
```

Public inheritance is what you should use when the derived class truly "is-a" kind of the base class. It means the
derived class can be used anywhere the base class is expected—this is the Liskov Substitution Principle.

**Protected Inheritance** (`class Derived : protected Base`):

All public and protected members of the base become protected in the derived class. This is rare and used mainly for
implementation inheritance where you want to expose base functionality to your derived classes but not to clients.

**Private Inheritance** (`class Derived : private Base`):

All public and protected members of the base become private in the derived class. This represents "
implemented-in-terms-of" rather than "is-a". The derived class uses the base class's implementation but doesn't expose
it.

```cpp
class PrivateDerived : private Base {
    // pubData is private
    // protData is private
    // privData is inaccessible
public:
    // Can selectively expose base members
    using Base::pubData;  // Makes pubData public again
};
```

**Guideline**: Use public inheritance for true "is-a" relationships. Prefer composition to private/protected
inheritance—it's usually clearer and more flexible. If you find yourself using private or protected inheritance,
reconsider whether composition would be better.

### 10.3 Constructor and Destructor Execution Order

Understanding the order in which constructors and destructors execute in inheritance hierarchies is crucial for correct
resource management. The order ensures that all parts of an object are properly initialized before the derived class
tries to use them.

When creating derived objects, construction happens in this order:

1. **Base class constructor** executes first (most derived to least derived if multiple inheritance)
2. **Member objects** are constructed (in declaration order)
3. **Derived class constructor body** executes

When destroying objects, the process is reversed:

1. **Derived class destructor body** executes
2. **Member objects** are destroyed (reverse declaration order)
3. **Base class destructor** executes

This ordering ensures that:

* Base class components are ready before derived class construction
* Derived class components are gone before base class destruction
* Dependencies are respected throughout the object's lifetime

```cpp
class Base {
   public:
       Base() { std::cout << "Base constructed\n"; }
       virtual ~Base() { std::cout << "Base destroyed\n"; }
};

class Member {
   public:
       Member() { std::cout << "Member constructed\n"; }
       ~Member() { std::cout << "Member destroyed\n"; }
};

class Derived : public Base {
   private:
       Member m;
       
   public:
       Derived() { std::cout << "Derived constructed\n"; }
       ~Derived() override { std::cout << "Derived destroyed\n"; }
};

// Creating Derived d;
// Prints:
// Base constructed
// Member constructed
// Derived constructed

// Destroying d:
// Derived destroyed
// Member destroyed
// Base destroyed
```

This predictable order is what makes resource management work correctly in inheritance hierarchies. If you have a
resource in the base class that the derived class uses, you're guaranteed the base class is fully constructed before the
derived class tries to use it.

The reverse destruction order ensures that when the base class destructor runs, it can assume the derived class portion
is gone but its own members are still valid. This allows the base class to clean up its resources correctly.

### 10.4 Calling Base Class Constructors

Derived classes must initialize their base class portion. This is done in the member initializer list using the base
class name:

```cpp
class Vehicle {
   protected:
       std::string manufacturer;
       int year;
       
   public:
       Vehicle(std::string mfr, int y) 
           : manufacturer(std::move(mfr)), year(y) {}
};

class Car : public Vehicle {
   private:
       int numDoors;
       
   public:
       Car(std::string mfr, int y, int doors)
           : Vehicle(std::move(mfr), y),  // Call base constructor
             numDoors(doors) {}
};
```

If you don't explicitly call a base constructor, the compiler attempts to call the base class's default constructor. If
no default constructor exists, you'll get a compilation error. This is a common source of confusion—you must explicitly
initialize base classes that don't have default constructors.

```cpp
class Base {
public:
   Base(int x) {}  // No default constructor
};

class Derived : public Base {
public:
   // ERROR: Must call Base constructor
   // Derived() {}
   
   // Correct: Explicitly call Base constructor
   Derived() : Base(0) {}
};
```

The order of initialization is always base classes first, regardless of the order in the initializer list. So even if
you write:

```cpp
Derived() : member(0), Base(0) {}  // Member first in list
```

The Base constructor still runs first, then members are initialized. This is the same rule as with member
initialization—the declaration order (which puts base classes first) determines the actual initialization order.

### 10.5 Method Overriding and the `override` Keyword

**Overriding** replaces a base class virtual method with a derived class implementation. For overriding to work, the
base class method must be virtual, and the signatures must match exactly.

```cpp
class Shape {
   public:
       virtual double area() const = 0;  // Pure virtual
       virtual void draw() const {
           std::cout << "Drawing generic shape\n";
       }
       virtual ~Shape() = default;
};

class Circle : public Shape {
   private:
       double radius;
       
   public:
       Circle(double r) : radius(r) {}
       
       // Override pure virtual function
       double area() const override {
           return 3.14159 * radius * radius;
       }
       
       // Override virtual function
       void draw() const override {
           std::cout << "Drawing circle\n";
       }
};
```

The **`override` keyword** (C++11) is technically optional but highly recommended. It provides several benefits:

**Catches Typos**: If you misspell the function name, the compiler will catch it because you're claiming to override
something that doesn't exist.

**Catches Signature Mismatches**: If you get the parameters wrong (wrong type, wrong const-ness, etc.), the compiler
will tell you this doesn't actually override anything.

**Documents Intent**: Anyone reading the code immediately knows this function is meant to override a base class
function.

**Prevents Silent Bugs**: Without `override`, a typo or signature mismatch silently creates a new function instead of
overriding the base class function. This is very hard to debug.

```cpp
class Derived : public Base {
    // void draw() const overide {  // Typo in 'override' - ERROR caught
    // void draw() override {        // Wrong signature (missing const) - ERROR caught
    void draw() const override {    // Correct
        // ...
    }
};
```

Always use `override` when overriding virtual functions. The compiler will enforce that you're actually overriding
something, preventing subtle bugs.

### 10.6 The `final` Keyword

The `final` keyword prevents further overriding or inheritance, providing both optimization opportunities and design
enforcement.

**Final Methods**: Prevents derived classes from overriding this method.

```cpp
class Base {
   public:
      virtual void method() const final {
         // No derived class can override this
      }
};

class Derived : public Base {
    // void method() const override {}  // ERROR: can't override final
};
```

**Final Classes**: Prevents any class from inheriting from this class.

```cpp
class FinalClass final {
    // Cannot be inherited from
};

// class Derived : public FinalClass {};  // ERROR: can't inherit from final
```

Use `final` when:

**Optimization**: The compiler can potentially make optimizations knowing no override exists (devirtualization).

**Security/Correctness**: When the implementation must not change for security or correctness reasons.

**Design Intent**: To document that a class or method is not designed for further extension.

However, use `final` judiciously. It limits extensibility, which goes against the open/closed principle (open for
extension, closed for modification). Only use it when there's a clear reason to prevent inheritance or overriding.

---

## 11. Polymorphism Through Virtual Functions

### 11.1 What Is Polymorphism?

Polymorphism means "many forms"—the ability to treat objects of different types through a common interface. In C++,
runtime polymorphism is achieved through virtual functions and inheritance. This is one of the most powerful features of
object-oriented programming, enabling code that works with types that didn't exist when the code was written.

The fundamental idea is that you can write code that operates on base class pointers or references, and the actual
method called is determined at runtime based on the object's actual type, not the pointer's type. This runtime
binding—also called dynamic dispatch or late binding—is what makes polymorphism possible.

With polymorphism, you can write code that works with base class pointers/references, and the actual method called is
determined at runtime based on the object's actual type:

```cpp
void processShape(const Shape& shape) {
    std::cout << "Area: " << shape.area() << '\n';
    shape.draw();
}

Circle circle(5.0);
Rectangle rect(4.0, 6.0);

processShape(circle);  // Calls Circle's area() and draw()
processShape(rect);    // Calls Rectangle's area() and draw()
```

This is powerful because `processShape` works correctly for any Shape, even types that didn't exist when `processShape`
was written. If tomorrow you create a `Triangle` class that inherits from `Shape`, `processShape` will work with it
without any modifications. This extensibility is the key benefit of polymorphism.

Polymorphism enables several important design patterns and principles:

* **Open/Closed Principle**: Code is open for extension (new shapes) but closed for modification (processShape doesn't
  change)
* **Dependency Inversion**: High-level code (processShape) depends on abstractions (Shape) rather than concrete types
* **Plugin Architecture**: New functionality can be added without modifying existing code

However, polymorphism has costs: virtual function calls are slightly slower than direct calls, and objects with virtual
functions require extra memory for the virtual table pointer. These costs are usually negligible compared to the
benefits of flexible, extensible code, but they're worth understanding.

### 11.2 Virtual Functions

A **virtual function** is a member function that can be overridden in derived classes. When called through a base
pointer/reference, the derived class version is invoked. This is the mechanism that enables polymorphism in C++.

The `virtual` keyword tells the compiler to use dynamic dispatch for this function. Without `virtual`, calling a
function through a base pointer would always call the base class version, defeating polymorphism.

```cpp
class Animal {
public:
    virtual void speak() const {
        std::cout << "Animal sound\n";
    }
    
    virtual ~Animal() = default;
};

class Cat : public Animal {
public:
    void speak() const override {
        std::cout << "Meow\n";
    }
};

class Dog : public Animal {
public:
    void speak() const override {
        std::cout << "Woof\n";
    }
};

// Polymorphic behavior
Animal* animals[] = {
    new Cat(),
    new Dog(),
    new Animal()
};

for (Animal* animal : animals) {
    animal->speak();  // Calls appropriate speak() based on actual type
}

// Cleanup
for (Animal* animal : animals) {
    delete animal;  // Calls appropriate destructor (virtual)
}
```

Without `virtual`, calling `animal->speak()` would always call `Animal::speak()`, regardless of whether the actual
object is a `Cat`, `Dog`, or `Animal`. The `virtual` keyword enables dynamic dispatch—the function called is determined
by the object's runtime type, not the pointer's compile-time type.

Virtual functions are the cornerstone of runtime polymorphism in C++. They enable writing generic code that works with
many different types through a common interface. This is fundamentally different from template-based (compile-time)
polymorphism, where the specific type must be known at compile time.

### 11.3 How Virtual Functions Work: The vtable

Understanding the implementation of virtual functions helps you use them effectively and understand their performance
characteristics. The mechanism involves two key components: the virtual table (vtable) and the virtual pointer (
vpointer).

**Vtable**: Each class with virtual functions has a static vtable—an array of function pointers to that class's virtual
functions. There's one vtable per class (not per object), shared by all instances of that class.

**Vpointer**: Each object of a class with virtual functions contains a hidden pointer (vpointer) to its class's vtable.
This pointer is typically added as the first member of the object, though this is implementation-defined.

When you call a virtual function through a pointer/reference, the mechanism works like this:

1. Dereference the vpointer to get the object's vtable
2. Look up the function pointer in the vtable (at a fixed offset for each virtual function)
3. Call the function through that pointer

```
Object in memory:
[vpointer] -> Class's vtable: [&Class::func1, &Class::func2, ...]
[data members...]
```

This indirection adds minimal overhead—one pointer dereference and one indexed lookup. For most applications, this cost
is negligible compared to the benefits of polymorphism. However, in performance-critical inner loops, it can matter,
which is why some codebases avoid virtual functions in hot paths.

The vtable mechanism has some important implications:

**Size Overhead**: Objects with virtual functions are larger by one pointer (typically 8 bytes on 64-bit systems). For
large objects, this is insignificant. For small objects or large arrays, it can matter.

**Performance**: Virtual function calls are slightly slower than direct calls (one extra indirection). Modern CPUs can
often predict and pipeline these calls, minimizing the impact.

**Cannot be Inlined**: Virtual function calls generally cannot be inlined by the compiler (though devirtualization can
sometimes enable this). If your function is very small and called frequently, this might matter.

Understanding these implementation details helps you make informed decisions about when to use virtual functions. For
most code, the benefits outweigh the costs, but for performance-critical code, you should measure and understand the
tradeoffs.

### 11.4 Pure Virtual Functions and Abstract Classes

A **pure virtual function** is declared with `= 0` and must be overridden by derived classes. A class with one or more
pure virtual functions is **abstract**—you cannot create instances of it. Abstract classes serve as interfaces or
partially-implemented base classes.

```cpp
class IDrawable {
public:
    virtual void draw() const = 0;  // Pure virtual
    virtual ~IDrawable() = default;
};
```

An abstract class cannot be instantiated:

```cpp
// IDrawable obj;  // ERROR: cannot instantiate abstract class
```

Abstract classes are used to define interfaces—contracts that derived classes must fulfill. They represent concepts that
are inherently abstract (like "shape" or "drawable") and only make sense when concretized.

Concrete derived classes must implement all pure virtual functions to become instantiable:

```cpp
class Circle : public IDrawable {
public:
    void draw() const override {
        std::cout << "Drawing circle\n";
    }
    // Now Circle is concrete and can be instantiated
};

Circle c;  // OK
IDrawable* ptr = &c;  // OK: polymorphic pointer
```

Pure virtual functions can optionally have implementations (this is unusual but allowed):

```cpp
class Base {
public:
    virtual void method() = 0;  // Pure virtual
};

// Provide implementation
void Base::method() {
    std::cout << "Default implementation\n";
}

class Derived : public Base {
public:
    void method() override {
        Base::method();  // Can call base implementation
        std::cout << "Extended behavior\n";
    }
};
```

This pattern allows you to provide a default implementation that derived classes can optionally use. It's useful when
you want to force derived classes to explicitly override the function (making the class abstract) but still provide a
reusable implementation.

Abstract classes are fundamental to good object-oriented design. They allow you to:

* Define interfaces that multiple unrelated classes can implement
* Specify contracts that derived classes must fulfill
* Create hierarchies where the base represents an abstract concept
* Enable polymorphism without committing to a specific implementation

### 11.5 Polymorphism Best Practices

Polymorphism is powerful but must be used thoughtfully. Here are guidelines for effective use:

**Virtual Destructors**: Always make destructors virtual in base classes designed for polymorphism. This ensures proper
cleanup when deleting through base pointers:

```cpp
class Base {
public:
    virtual ~Base() = default;  // Virtual destructor
};
```

Without a virtual destructor, deleting a derived object through a base pointer only calls the base destructor, leaking
resources in the derived class. This is one of the most common bugs in C++ polymorphic code.

**Prefer Composition to Inheritance**: Inheritance creates tight coupling between base and derived classes. Changes to
the base can break derived classes, and the inheritance hierarchy becomes rigid. Composition is more flexible:

```cpp
// Tight coupling via inheritance - problematic
class Stack : public std::vector<int> {
    // Exposes all vector operations, many inappropriate for a stack
};

// Loose coupling via composition - better
class Stack {
private:
    std::vector<int> data;  // Composition
public:
    void push(int val) { data.push_back(val); }
    int pop() {
        int val = data.back();
        data.pop_back();
        return val;
    }
};
```

The inheritance version exposes all of `vector`'s methods, including ones that violate the stack abstraction (like
random access or insertion in the middle). The composition version only exposes stack operations, maintaining a clean
interface.

**Use Interfaces**: Define abstract interfaces for polymorphic behavior. This separates interface from implementation
and enables multiple implementations:

```cpp
class ILogger {
public:
    virtual void log(const std::string& message) = 0;
    virtual ~ILogger() = default;
};

class FileLogger : public ILogger {
public:
    void log(const std::string& message) override {
        // Write to file
    }
};

class ConsoleLogger : public ILogger {
public:
    void log(const std::string& message) override {
        std::cout << message << '\n';
    }
};

void processData(ILogger& logger) {
    logger.log("Processing...");
    // Works with any ILogger implementation
}
```

This design allows adding new logger types without modifying code that uses loggers. The `processData` function depends
on the abstraction (`ILogger`), not on concrete implementations.

**Avoid Deep Hierarchies**: Deep inheritance hierarchies become difficult to understand and maintain. Prefer shallow,
wide hierarchies or composition. If your hierarchy is more than 3-4 levels deep, consider whether composition or other
patterns would be clearer.

**Design for Extension or Prevention**: Either design a class for inheritance (virtual destructor, protected members,
documented extension points) or prevent inheritance (`final` class, private/protected constructors). The middle ground—a
class that can be inherited from but wasn't designed for it—leads to problems.

---

## 12. Abstract Classes and Interfaces

### 12.1 Abstract Classes as Contracts

An **abstract class** defines a contract—a set of operations that derived classes must implement. It represents an
incomplete type that serves as a foundation for concrete implementations. Abstract classes model concepts that are
inherently abstract and only make sense when concretized.

The power of abstract classes lies in their ability to specify what operations must be supported without dictating how
they're implemented. This separation of interface from implementation is fundamental to good object-oriented design.

```cpp
class Database {
public:
    // Pure virtual functions define the contract
    virtual void connect(const std::string& connectionString) = 0;
    virtual void disconnect() = 0;
    virtual void executeQuery(const std::string& query) = 0;
    virtual ~Database() = default;
    
protected:
    // Can include shared implementation
    void logConnection(const std::string& info) {
        std::cout << "Connection: " << info << '\n';
    }
};

class MySQLDatabase : public Database {
public:
    void connect(const std::string& connectionString) override {
        logConnection("MySQL: " + connectionString);
        // MySQL-specific connection code
    }
    
    void disconnect() override {
        // MySQL-specific disconnection
    }
    
    void executeQuery(const std::string& query) override {
        // MySQL-specific query execution
    }
};

class PostgreSQLDatabase : public Database {
public:
    void connect(const std::string& connectionString) override {
        logConnection("PostgreSQL: " + connectionString);
        // PostgreSQL-specific connection code
    }
    
    void disconnect() override {
        // PostgreSQL-specific disconnection
    }
    
    void executeQuery(const std::string& query) override {
        // PostgreSQL-specific query execution
    }
};
```

The abstract `Database` class allows code to work with any database type through polymorphism:

```cpp
void performDatabaseOperation(Database& db, const std::string& query) {
    db.connect("server=localhost");
    db.executeQuery(query);
    db.disconnect();
}

MySQLDatabase mysql;
PostgreSQLDatabase postgres;

performDatabaseOperation(mysql, "SELECT * FROM users");
performDatabaseOperation(postgres, "SELECT * FROM users");
```

This design provides enormous flexibility. You can add new database types without modifying `performDatabaseOperation`.
You can swap database implementations at runtime. You can test with mock databases. All these benefits stem from
depending on the abstraction rather than concrete implementations.

Abstract classes can contain a mix of pure virtual functions (which must be overridden) and regular functions (which
provide default or shared behavior). This allows you to specify the minimal interface that derived classes must
implement while providing useful common functionality.

### 12.2 Interface Design Principles

An **interface** in C++ is typically a class with only pure virtual functions—no data members, no implementation. This
creates a pure contract that classes can implement.

In C++, unlike languages like Java or C#, there's no special `interface` keyword. Instead, you create interfaces using
abstract classes with only pure virtual functions. By convention, interface names often start with "I" (though this is
not universally followed).

```cpp
class ISerializable {
public:
    virtual std::string serialize() const = 0;
    virtual void deserialize(const std::string& data) = 0;
    virtual ~ISerializable() = default;
};

class IComparable {
public:
    virtual int compareTo(const IComparable& other) const = 0;
    virtual ~IComparable() = default;
};

// A class can implement multiple interfaces
class Person : public ISerializable, public IComparable {
private:
    std::string name;
    int age;
    
public:
    Person(std::string n, int a) : name(std::move(n)), age(a) {}
    
    // Implement ISerializable
    std::string serialize() const override {
        return name + "," + std::to_string(age);
    }
    
    void deserialize(const std::string& data) override {
        size_t pos = data.find(',');
        name = data.substr(0, pos);
        age = std::stoi(data.substr(pos + 1));
    }
    
    // Implement IComparable
    int compareTo(const IComparable& other) const override {
        const Person& otherPerson = dynamic_cast<const Person&>(other);
        if (age < otherPerson.age) return -1;
        if (age > otherPerson.age) return 1;
        return name.compare(otherPerson.name);
    }
};
```

**Interface Design Guidelines**:

**Keep interfaces small and focused**: An interface should represent a single concept or capability. Large interfaces
are harder to implement and often require implementers to provide functionality they don't need. This is the Interface
Segregation Principle—clients shouldn't be forced to depend on methods they don't use.

**Avoid data members**: Interfaces should define behavior, not data. Including data members creates implementation
dependencies and reduces flexibility.

**Prefer many small interfaces over one large interface**: It's better to have multiple focused interfaces that classes
can implement as needed as one monolithic interface. This provides more flexibility and better expresses the
capabilities of implementers.

**Make interfaces stable**: Changing an interface breaks all implementations. Once published, an interface should remain
stable. If you need to extend an interface, consider creating a new derived interface rather than modifying the existing
one.

```cpp
// Original interface
class ILogger {
public:
    virtual void log(const std::string& message) = 0;
    virtual ~ILogger() = default;
};

// Extended interface (doesn't modify ILogger)
class IStructuredLogger : public ILogger {
public:
    virtual void logWithContext(const std::string& message, 
                                const std::map<std::string, std::string>& context) = 0;
};
```

This approach allows existing `ILogger` implementations to continue working while enabling new implementations to
provide extended functionality.

### 12.3 Abstract Classes vs Concrete Classes

Understanding the distinction between abstract and concrete classes helps you design clear, effective hierarchies:

**Abstract classes**:

- Cannot be instantiated (have at least one pure virtual function)
- Serve as base classes for other classes
- Define interfaces or partial implementations
- Represent abstract concepts that require specialization

**Concrete classes**:

- Can be instantiated (implement all pure virtual functions)
- May be derived from abstract classes
- Represent complete, usable types
- Implement specific functionality

```cpp
// Abstract base
class Shape {
protected:
    std::string color;
    
public:
    Shape(std::string c) : color(std::move(c)) {}
    virtual double area() const = 0;  // Pure virtual - makes class abstract
    
    // Concrete method - provides shared functionality
    std::string getColor() const { return color; }
    
    virtual ~Shape() = default;
};

// Abstract intermediate class
class Polygon : public Shape {
protected:
    int sides;
    
public:
    Polygon(std::string c, int s) : Shape(std::move(c)), sides(s) {}
    
    // Still doesn't implement area() - remains abstract
    // Adds new concrete functionality
    int getSides() const { return sides; }
};

// Concrete class
class Triangle : public Polygon {
private:
    double base, height;
    
public:
    Triangle(std::string c, double b, double h) 
        : Polygon(std::move(c), 3), base(b), height(h) {}
    
    // Implements pure virtual function - now concrete
    double area() const override {
        return 0.5 * base * height;
    }
};

// Triangle t("red", 5.0, 3.0);  // OK: concrete class
// Shape s("blue");              // ERROR: abstract class
// Polygon p("green", 4);        // ERROR: abstract class
```

This hierarchy demonstrates the proper use of abstraction levels. `Shape` defines the most general interface. `Polygon`
adds functionality specific to polygons while remaining abstract (since it doesn't make sense to have a "generic
polygon" without knowing the specific type). `Triangle` is concrete and can be instantiated.

The key insight is that abstraction levels should match conceptual abstraction. If a concept doesn't make sense on its
own (like "shape" or "polygon"), make it abstract. Only classes that represent complete, instantiable concepts should be
concrete.

---

## 13. Object Relationships and Composition

### 13.1 Types of Object Relationships

Object-oriented design involves understanding how objects relate to each other. These relationships determine how
objects interact and depend on each other, affecting coupling, cohesion, and overall system design. The main
relationship types represent different levels of coupling and ownership:

**Association**: One object knows about another and can interact with it, but doesn't control its lifetime. This is the
loosest form of relationship—the objects are aware of each other but independent.

**Aggregation**: A "has-a" relationship where the whole contains parts, but parts can exist independently. The container
doesn't own the contained objects in a lifetime sense.

**Composition**: A stronger "has-a" relationship where parts cannot exist without the whole. The container owns the
contained objects and their lifetimes are tied together.

**Dependency**: One object uses another temporarily, typically as a method parameter. This is the weakest
relationship—no persistent connection exists.

Understanding these relationships helps you design systems with appropriate coupling. Tighter relationships create more
coupling but can simplify resource management. Looser relationships reduce coupling but require more careful lifetime
management.

### 13.2 Association

**Association** represents a general relationship between objects where one object needs to interact with another but
doesn't own it. The associated object is typically held by pointer or reference, and its lifetime is managed
independently.

Association is appropriate when objects need to work together but have independent lifecycles. For example, a student
has an advisor (a professor), but the professor exists independently of the student.

```cpp
class Professor {
private:
    std::string name;
    
public:
    Professor(std::string n) : name(std::move(n)) {}
    std::string getName() const { return name; }
};

class Student {
private:
    std::string name;
    Professor* advisor;  // Association - doesn't own the professor
    
public:
    Student(std::string n) : name(std::move(n)), advisor(nullptr) {}
    
    void setAdvisor(Professor* prof) {
        advisor = prof;
    }
    
    std::string getAdvisorName() const {
        return advisor ? advisor->getName() : "None";
    }
};

// Usage
Professor drSmith("Dr. Smith");
Student alice("Alice");
alice.setAdvisor(&drSmith);  // Alice knows about Dr. Smith

// Both can exist independently
```

In this design, `Student` doesn't delete `advisor` in its destructor—the professor exists independently. Multiple
students might share the same advisor. The professor might teach courses even if they advise no students. This
independence is what characterizes association.

The use of a raw pointer for association is appropriate here because we're not expressing ownership. However, in modern
C++, you might prefer using `std::weak_ptr` if the professor is managed by `std::shared_ptr` elsewhere, or you might use
references if the relationship is always valid.

### 13.3 Aggregation

**Aggregation** represents a "whole-part" relationship where the part can exist independently of the whole. The
container has a collection of parts, but those parts have independent lifetimes. Think of it as a "has-a" relationship
where the has-a is not exclusive.

Aggregation is typically implemented using pointers or references in a container. The key distinction from composition
is that the contained objects can outlive the container.

```cpp
class Engine {
private:
    int horsepower;
    
public:
    Engine(int hp) : horsepower(hp) {}
    int getHorsepower() const { return horsepower; }
};

class Car {
private:
    std::string model;
    std::vector<Engine*> engines;  // Aggregation - doesn't own engines
    
public:
    Car(std::string m) : model(std::move(m)) {}
    
    void addEngine(Engine* engine) {
        engines.push_back(engine);
    }
    
    // Car doesn't delete engines - they exist independently
    ~Car() = default;
};

// Usage
Engine v6(280);
Engine v8(400);

Car sedan("Sedan");
sedan.addEngine(&v6);

Car sports("Sports");
sports.addEngine(&v8);

// Engines outlive cars and can be shared
```

In this example, engines can be shared between cars (though this might not make physical sense, it demonstrates the
concept). When a car is destroyed, the engines continue to exist. Someone else is responsible for the engines'
lifetimes.

Aggregation is useful when:

* Objects are shared among multiple containers
* The container doesn't have exclusive ownership
* Parts might be created before the container or outlive it
* You want to express a "uses" relationship rather than "owns"

### 13.4 Composition

**Composition** represents a strong ownership relationship where the part's lifetime is tied to the whole. The part
cannot exist without the whole, and when the whole is destroyed, the parts are destroyed with it. This is exclusive
ownership—one container owns the parts.

Composition is the strongest form of "has-a" relationship. It models situations where the parts truly belong to the
whole and don't make sense independently.

```cpp
class Engine {
private:
    int horsepower;
    
public:
    Engine(int hp) : horsepower(hp) {
        std::cout << "Engine created\n";
    }
    
    ~Engine() {
        std::cout << "Engine destroyed\n";
    }
    
    int getHorsepower() const { return horsepower; }
};

class Car {
private:
    std::string model;
    Engine engine;  // Composition - Car owns engine
    
public:
    Car(std::string m, int hp) 
        : model(std::move(m)), engine(hp) {}
    
    // Engine is automatically destroyed when Car is destroyed
};

// Usage
{
    Car myCar("Sedan", 200);
    // Engine created
    // Use car...
} // Car destroyed, Engine automatically destroyed
```

Modern C++ often uses `std::unique_ptr` for composition with dynamic allocation, making ownership explicit:

```cpp
class Car {
private:
    std::string model;
    std::unique_ptr<Engine> engine;  // Composition with unique ownership
    
public:
    Car(std::string m, int hp) 
        : model(std::move(m)), 
          engine(std::make_unique<Engine>(hp)) {}
    
    // Engine automatically deleted when Car is destroyed
};
```

The `std::unique_ptr` makes the ownership relationship explicit and automatic. You don't need to write a custom
destructor—the smart pointer handles cleanup. This is the modern C++ idiom for composition with dynamic allocation.

Composition is appropriate when:

* The part has no meaning outside the whole
* The part's lifetime is tied to the whole
* The relationship represents exclusive ownership
* You want automatic, exception-safe cleanup

### 13.5 Composition Over Inheritance

Modern C++ design favors composition over inheritance. This principle—"favor composition over inheritance"—stems from
decades of experience showing that composition creates more flexible, maintainable systems.

Why prefer composition? Several reasons:

**Flexibility**: Behavior can be changed at runtime by swapping composed objects. With inheritance, the type hierarchy
is fixed at compile time.

**Loose Coupling**: Changes to composed components don't affect the container's interface. With inheritance, changes to
the base class can break derived classes.

**Easier Testing**: Composed components can be easily mocked or substituted for testing. Inheritance relationships are
harder to mock without complex frameworks.

**Avoid Fragile Base Class Problem**: Changes to base classes can inadvertently break derived classes in subtle ways.
Composition avoids this entire class of problems.

**Multiple Behaviors**: A class can compose multiple different behaviors, while C++ only supports single implementation
inheritance.

**Inheritance approach (tight coupling, problematic)**:

```cpp
class Stack : public std::vector<int> {
    // Inherits all vector methods, including inappropriate ones
    // Clients can call clear(), resize(), operator[], etc.
    // The abstraction is broken
};
```

This design is problematic because it exposes all of `vector`'s operations, many of which violate the stack abstraction.
Clients can access elements randomly, insert in the middle, or clear the entire stack—operations that don't make sense
for a stack.

**Composition approach (loose coupling, better)**:

```cpp
class Stack {
private:
    std::vector<int> data;  // Composition
    
public:
    void push(int value) {
        data.push_back(value);
    }
    
    int pop() {
        int value = data.back();
        data.pop_back();
        return value;
    }
    
    bool isEmpty() const {
        return data.empty();
    }
    
    // Only stack operations exposed
};
```

This design only exposes stack operations. The implementation (using a vector) is hidden. If you later decide a
different data structure would be better, you can change it without affecting clients. The abstraction is preserved.

**Guideline**: Use inheritance for true "is-a" relationships where polymorphism is needed. Use composition for "has-a"
relationships, code reuse without polymorphism, or when you want more flexibility. When in doubt, prefer
composition—it's easier to change composition to inheritance than vice versa.

---

## 14. Smart Pointers and Automatic Resource Management

### 14.1 The Problem with Raw Pointers

Raw pointers in C++ give you power and control but require manual resource management. Every `new` must be paired with
`delete`, and this pairing must happen on every code path, including error paths. This is error-prone and leads to
common bugs:

```cpp
void problematic() {
    int* ptr = new int(42);
    
    // Lots of code...
    
    if (someCondition) {
        return;  // Memory leak! Forgot to delete
    }
    
    if (someError) {
        throw std::runtime_error("Error");  // Memory leak! Exception path
    }
    
    delete ptr;  // Only reached if no early return or exception
}
```

This code has multiple problems: memory leaks on the early return path and the exception path. You might think "just
remember to delete before returning," but in complex functions with multiple return points and error conditions, it's
easy to miss a path. And if an exception is thrown, all bets are off unless you have comprehensive try/catch blocks.

Smart pointers solve this by tying resource lifetime to object lifetime (RAII). The resource is acquired in the smart
pointer's constructor and released in its destructor. Since destructors are automatically called when objects go out of
scope—even during exceptions—cleanup is automatic and exception-safe.

### 14.2 std::unique_ptr: Unique Ownership

`std::unique_ptr` represents unique ownership of a resource. Only one `unique_ptr` can own a resource at a time. This
models exclusive ownership—the most common and efficient ownership pattern.

```cpp
#include <memory>

void example() {
    std::unique_ptr<int> ptr(new int(42));
    // Or better, use make_unique (C++14):
    auto ptr2 = std::make_unique<int>(42);
    
    // Use like raw pointer
    *ptr2 = 100;
    
    // Automatically deleted when ptr2 goes out of scope
}

class Resource {
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource released\n"; }
};

void demonstrateUniquePtr() {
    std::unique_ptr<Resource> res1(new Resource());
    // Resource acquired
    
    // std::unique_ptr<Resource> res2 = res1;  // ERROR: cannot copy
    std::unique_ptr<Resource> res2 = std::move(res1);  // OK: move ownership
    
    // res1 is now nullptr, res2 owns the resource
} // Resource released (res2's destructor called)
```

**Key characteristics of std::unique_ptr**:

**Move-only**: Cannot be copied, only moved. This enforces unique ownership at compile time. If you need to transfer
ownership, you must explicitly use `std::move`, making the transfer obvious.

**Zero overhead**: On most platforms, `unique_ptr` has the same size and performance as a raw pointer. The abstraction
is free—you get automatic cleanup without paying for it.

**Automatic deletion**: The resource is automatically deleted when the `unique_ptr` is destroyed. No manual cleanup
needed.

**Can be used in containers**: You can put `unique_ptr` in vectors, maps, etc., enabling containers of dynamically
allocated objects with automatic cleanup.

**Custom deleters**: Can use custom deletion functions for non-`delete` resources (file handles, etc.).

**Use `std::make_unique`**: Prefer `make_unique` over `new` for exception safety and clarity:

```cpp
// Problematic (exception safety issue in complex expressions)
processData(std::unique_ptr<Data>(new Data()), computeValue());
// If computeValue() throws, the Data might leak

// Safe
processData(std::make_unique<Data>(), computeValue());
```

**Use cases for std::unique_ptr**:

* Ownership of dynamically allocated objects (most common case)
* Factory functions returning new objects
* Resource management (files, sockets, handles)
* Pimpl idiom (pointer to implementation)
* Anywhere you would use `new`/`delete` but want automatic cleanup

```cpp
class Widget {
private:
    std::unique_ptr<Impl> pImpl;  // Pimpl idiom
    
public:
    Widget() : pImpl(std::make_unique<Impl>()) {}
    // Automatic cleanup, no need for custom destructor
};
```

### 14.3 std::shared_ptr: Shared Ownership

`std::shared_ptr` allows multiple pointers to share ownership of a resource through reference counting. The resource is
deleted when the last `shared_ptr` to it is destroyed.

```cpp
void demonstrateSharedPtr() {
    std::shared_ptr<int> ptr1 = std::make_shared<int>(42);
    std::cout << "Count: " << ptr1.use_count() << '\n';  // 1
    
    {
        std::shared_ptr<int> ptr2 = ptr1;  // Share ownership
        std::cout << "Count: " << ptr1.use_count() << '\n';  // 2
        
        *ptr2 = 100;  // Both see the change
        std::cout << "*ptr1: " << *ptr1 << '\n';  // 100
    }  // ptr2 destroyed, count decrements
    
    std::cout << "Count: " << ptr1.use_count() << '\n';  // 1
}  // ptr1 destroyed, count reaches 0, resource deleted
```

**Key characteristics of std::shared_ptr**:

**Reference counted**: Maintains a count of how many `shared_ptr`s point to the resource.

**Thread-safe reference count**: The reference count operations are atomic and thread-safe. However, accessing the
pointed-to object is not automatically thread-safe.

**Slightly more overhead**: Larger than `unique_ptr` (two pointers: one to object, one to control block) and reference
count operations have small overhead.

**Can be copied and moved**: Multiple `shared_ptr`s can own the same resource.

**Last shared_ptr deletes**: When the last `shared_ptr` is destroyed, the resource is deleted.

**Control Block**: `shared_ptr` maintains a control block containing:

- Reference count (strong references)
- Weak count (weak references)
- Deleter (custom deletion function if provided)
- Allocator (custom allocator if provided)

**Use cases for std::shared_ptr**:

* Shared ownership of resources (multiple owners)
* Caching (multiple clients might hold the same cached data)
* Graph structures where nodes can have multiple parents
* Callbacks that need to keep objects alive
* Situations where ownership is unclear or shared

```cpp
class Node {
public:
    std::shared_ptr<Node> left;
    std::shared_ptr<Node> right;
    int value;
    
    Node(int v) : value(v) {}
};

auto root = std::make_shared<Node>(1);
root->left = std::make_shared<Node>(2);
root->right = std::make_shared<Node>(3);

// Shared ownership - nodes deleted when no longer referenced
```

**Prefer `std::make_shared`**: Like `make_unique`, prefer `make_shared` for exception safety and efficiency:

```cpp
auto p = std::make_shared<Widget>();  // One allocation
// vs
std::shared_ptr<Widget> p(new Widget());  // Two allocations
```

`make_shared` allocates the object and control block together in one allocation, improving performance and cache
locality.

### 14.4 std::weak_ptr: Non-Owning Observer

`std::weak_ptr` observes an object owned by `shared_ptr` without affecting its lifetime. It prevents circular reference
problems where shared_ptrs create cycles that prevent deletion.

```cpp
class Node {
public:
    std::shared_ptr<Node> next;  // Strong reference
    std::weak_ptr<Node> prev;    // Weak reference - breaks cycle
    int value;
    
    Node(int v) : value(v) {}
};

void demonstrateWeakPtr() {
    auto node1 = std::make_shared<Node>(1);
    auto node2 = std::make_shared<Node>(2);
    
    node1->next = node2;  // Strong reference
    node2->prev = node1;  // Weak reference - no cycle!
    
    // To use weak_ptr, convert to shared_ptr
    if (auto prev = node2->prev.lock()) {
        std::cout << "Previous node: " << prev->value << '\n';
    }
}  // Both nodes properly deleted
```

Without the weak pointer, this would create a circular reference: node1 owns node2 (via `next`), and node2 owns node1 (
via `prev`). Both reference counts would remain above zero even when no external references exist, causing a memory
leak. The weak pointer breaks the cycle.

**Key methods of std::weak_ptr**:

**`lock()`**: Returns `shared_ptr` if object still exists, otherwise returns empty `shared_ptr`. This is the primary way
to access the object—you must first upgrade the weak pointer to a shared pointer.

```cpp
std::weak_ptr<Widget> weak = shared;
if (auto strong = weak.lock()) {
    // Object exists, use it through strong
    strong->doSomething();
} else {
    // Object was deleted
}
```

**`expired()`**: Returns `true` if referenced object has been deleted. Useful for quick checks.

**`use_count()`**: Returns the reference count (number of `shared_ptr`s). Not particularly useful in most code.

**Use cases for std::weak_ptr**:

* Breaking circular references in data structures (doubly-linked lists, graphs, parent-child relationships)
* Caching without keeping objects alive (cache entries can be deleted if not in use)
* Observer pattern implementations (observers don't keep subjects alive)
* Temporary references where you don't want to extend lifetime

```cpp
class Observer {
    std::weak_ptr<Subject> subject;
    
public:
    void setSubject(std::shared_ptr<Subject> s) {
        subject = s;
    }
    
    void notify() {
        if (auto s = subject.lock()) {
            // Subject still exists
            s->doSomething();
        } else {
            // Subject was deleted
        }
    }
};
```

### 14.5 Custom Deleters

Smart pointers can use custom deleters for resources that aren't managed with `delete`. This is essential when wrapping
C APIs or other resources.

```cpp
// File handle management
void fileDeleter(FILE* fp) {
    if (fp) {
        std::fclose(fp);
        std::cout << "File closed\n";
    }
}

void useCustomDeleter() {
    std::unique_ptr<FILE, decltype(&fileDeleter)> 
        file(std::fopen("data.txt", "r"), &fileDeleter);
    
    if (file) {
        // Use file
    }
}  // fileDeleter called automatically

// Lambda deleter
auto filePtr = std::unique_ptr<FILE, std::function<void(FILE*)>>(
    std::fopen("data.txt", "r"),
    [](FILE* fp) {
        if (fp) {
            std::fclose(fp);
        }
    }
);

// Array deletion
auto arr = std::unique_ptr<int[]>(new int[10]);
// Automatically uses delete[] instead of delete
```

Custom deleters enable RAII for any resource, not just memory. This is fundamental to modern C++ resource
management—every resource should be wrapped in a RAII class (either a smart pointer with custom deleter or a dedicated
class).

---

## 15. The Rule of Zero, Three, and Five

### 15.1 The Rule of Zero

**Rule of Zero**: Classes that don't directly manage resources should not define custom special member functions (
destructor, copy constructor, copy assignment, move constructor, move assignment). Let the compiler generate them.

The Rule of Zero is the ideal—most classes should follow it. Modern C++ with smart pointers and standard containers
makes this achievable for most classes.

```cpp
// Good - follows Rule of Zero
class Person {
private:
    std::string name;
    std::vector<std::string> addresses;
    std::unique_ptr<PhoneNumber> phone;
    
public:
    Person(std::string n) : name(std::move(n)) {}
    
    // No custom destructor, copy/move operations needed
    // Compiler-generated versions work correctly
};
```

This class manages no resources directly—it uses `std::string`, `std::vector`, and `std::unique_ptr`, all of which
manage their own resources. The compiler-generated special members work perfectly: the destructor calls the destructors
of members, the copy constructor copies members, etc.

The Rule of Zero is the best case because:

* No chance of getting resource management wrong
* Less code to write and maintain
* Compiler-generated operations are often more efficient
* Code is clearer—no special member functions to understand

Strive to make all your classes follow the Rule of Zero. Use standard library classes and smart pointers to manage
resources rather than managing them directly.

### 15.2 The Rule of Three (C++03)

**Rule of Three**: If a class needs a custom destructor, copy constructor, or copy assignment operator, it probably
needs all three.

This rule applies to classes that directly manage resources (raw pointers, file handles, etc.). If you need one of these
special members, you probably need them all to manage the resource correctly.

```cpp
class LegacyString {
private:
    char* data;
    
public:
    // Constructor
    LegacyString(const char* str) {
        data = new char[std::strlen(str) + 1];
        std::strcpy(data, str);
    }
    
    // 1. Destructor
    ~LegacyString() {
        delete[] data;
    }
    
    // 2. Copy constructor
    LegacyString(const LegacyString& other) {
        data = new char[std::strlen(other.data) + 1];
        std::strcpy(data, other.data);
    }
    
    // 3. Copy assignment operator
    LegacyString& operator=(const LegacyString& other) {
        if (this != &other) {
            delete[] data;
            data = new char[std::strlen(other.data) + 1];
            std::strcpy(data, other.data);
        }
        return *this;
    }
};
```

Without all three, you risk double-deletion and resource leaks. If you have a destructor but not copy operations, the
compiler-generated copy will do a shallow copy, leading to double-deletion. If you have copy operations but not a
destructor, resources leak.

### 15.3 The Rule of Five (C++11 and later)

**Rule of Five**: If a class needs a custom destructor, copy constructor, copy assignment, move constructor, or move
assignment, it probably needs all five.

This extends the Rule of Three for C++11's move semantics. If you're managing resources, you should provide move
operations for efficiency.

```cpp
class ModernString {
private:
    char* data;
    size_t length;
    
public:
    // Constructor
    ModernString(const char* str = "") {
        length = std::strlen(str);
        data = new char[length + 1];
        std::strcpy(data, str);
    }
    
    // 1. Destructor
    ~ModernString() {
        delete[] data;
    }
    
    // 2. Copy constructor
    ModernString(const ModernString& other) 
        : length(other.length) {
        data = new char[length + 1];
        std::strcpy(data, other.data);
    }
    
    // 3. Copy assignment
    ModernString& operator=(const ModernString& other) {
        if (this != &other) {
            delete[] data;
            length = other.length;
            data = new char[length + 1];
            std::strcpy(data, other.data);
        }
        return *this;
    }
    
    // 4. Move constructor
    ModernString(ModernString&& other) noexcept 
        : data(other.data), length(other.length) {
        other.data = nullptr;
        other.length = 0;
    }
    
    // 5. Move assignment
    ModernString& operator=(ModernString&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            length = other.length;
            other.data = nullptr;
            other.length = 0;
        }
        return *this;
    }
};
```

### 15.4 Choosing the Right Rule

The decision tree is simple:

**Does your class directly manage a resource (raw pointer, file handle, etc.)?**

- No → **Rule of Zero** (use smart pointers and standard containers)
- Yes → **Rule of Five** (provide all five special members)

**Modern approach**: Wrap resources to return to Rule of Zero:

```cpp
class FileHandle {
    FILE* file;
public:
    // Rule of Five implemented once in this wrapper
    FileHandle(const char* path) : file(std::fopen(path, "r")) {}
    ~FileHandle() { if (file) std::fclose(file); }
    // ... copy/move operations with proper FILE* management
};

class FileProcessor {
    FileHandle handle;  // Back to Rule of Zero!
public:
    FileProcessor(const char* path) : handle(path) {}
    // No special members needed - compiler-generated work fine
};
```

This approach—creating resource-managing classes that follow the Rule of Five, then using those classes to build
higher-level classes that follow the Rule of Zero—is the modern C++ idiom for resource management.

---

## 16. Modern C++ Class Features

### 16.1 Default and Delete (C++11)

Explicitly control special member function generation with `= default` and `= delete`:

```cpp
class Noncopyable {
public:
    Noncopyable() = default;
    
    // Delete copy operations
    Noncopyable(const Noncopyable&) = delete;
    Noncopyable& operator=(const Noncopyable&) = delete;
    
    // Allow move operations
    Noncopyable(Noncopyable&&) = default;
    Noncopyable& operator=(Noncopyable&&) = default;
};

Noncopyable obj1;
// Noncopyable obj2 = obj1;  // ERROR: copy deleted
Noncopyable obj2 = std::move(obj1);  // OK: move allowed
```

`= default` explicitly requests the compiler-generated version, making your intent clear. `= delete` prevents the
operation, with better error messages than the pre-C++11 private-and-undefined approach.

### 16.2 Delegating Constructors (C++11)

One constructor can call another, reducing code duplication:

```cpp
class Widget {
    int value;
    std::string name;
    
public:
    // Primary constructor
    Widget(int v, std::string n) : value(v), name(std::move(n)) {
        // Common initialization logic
        validate();
    }
    
    // Delegating constructors
    Widget() : Widget(0, "default") {}
    Widget(int v) : Widget(v, "unnamed") {}
    Widget(std::string n) : Widget(0, std::move(n)) {}
    
private:
    void validate() {
        // Validation logic in one place
    }
};
```

### 16.3 Inherited Constructors (C++11)

Derived classes can inherit base constructors:

```cpp
class Base {
public:
    Base(int x) {}
    Base(double x, std::string s) {}
};

class Derived : public Base {
public:
    using Base::Base;  // Inherit all Base constructors
    
    // Additional derived-specific constructor
    Derived(std::string s) : Base(42, s) {}
};

Derived d1(10);              // Calls inherited Base(int)
Derived d2(3.14, "test");    // Calls inherited Base(double, string)
Derived d3("hello");         // Calls Derived(string)
```

### 16.4 In-Class Member Initializers (C++11)

Initialize members at declaration:

```cpp
class Widget {
private:
    int value = 42;                    // Default value
    std::string name = "Widget";       // Default value
    std::vector<int> data{1, 2, 3};   // Brace initialization
    
public:
    Widget() = default;  // Uses in-class initializers
    
    Widget(int v) : value(v) {}  // Overrides default for value
};
```

### 16.5 constexpr Constructors and Members (C++11/14/20)

Enable compile-time object construction:

```cpp
class Point {
    double x, y;
    
public:
    constexpr Point(double x, double y) : x(x), y(y) {}
    
    constexpr double getX() const { return x; }
    constexpr double getY() const { return y; }
    
    constexpr double distanceFromOrigin() const {
        return std::sqrt(x * x + y * y);  // C++14: non-trivial constexpr
    }
};

// Compile-time evaluation
constexpr Point origin(0, 0);
constexpr Point p(3, 4);
constexpr double dist = p.distanceFromOrigin();  // Computed at compile time
```

### 16.6 Inline Variables (C++17)

Define static members in the class definition:

```cpp
class Configuration {
public:
    inline static int maxConnections = 100;
    inline static std::string defaultPath = "/var/data";
    
    // No separate definition needed in .cpp file!
};

// Usage
int max = Configuration::maxConnections;
```

### 16.7 Structured Bindings and Classes (C++17)

Decompose objects:

```cpp
class Point {
public:
    double x, y;
};

Point getPoint() {
    return {3.0, 4.0};
}

// Structured binding
auto [x, y] = getPoint();
std::cout << x << ", " << y << '\n';
```

### 16.8 Spaceship Operator (C++20)

Generate all comparison operators:

```cpp
#include <compare>

class Version {
    int major, minor, patch;
    
public:
    Version(int maj, int min, int pat) 
        : major(maj), minor(min), patch(pat) {}
    
    // Generate all six comparison operators
    auto operator<=>(const Version&) const = default;
    bool operator==(const Version&) const = default;
};

Version v1(1, 2, 3);
Version v2(1, 3, 0);

bool b = (v1 < v2);  // All comparisons work
```

---

## 17. Exception Safety and RAII

### 17.1 Exception Safety Guarantees

Classes should provide guarantees about their behavior in the presence of exceptions:

**No-throw Guarantee**: Operation will not throw exceptions (mark with `noexcept`). This is the strongest guarantee.

**Strong Guarantee**: If operation fails, program state is unchanged (commit-or-rollback semantics).

**Basic Guarantee**: If operation fails, no resources are leaked and objects are in valid state.

**No Guarantee**: No promises (avoid this).

```cpp
class SafeVector {
    int* data;
    size_t size, capacity;
    
public:
    // No-throw guarantee
    void swap(SafeVector& other) noexcept {
        std::swap(data, other.data);
        std::swap(size, other.size);
        std::swap(capacity, other.capacity);
    }
    
    // Strong guarantee via copy-and-swap
    SafeVector& operator=(const SafeVector& other) {
        SafeVector temp(other);  // If this throws, *this unchanged
        swap(temp);              // No-throw
        return *this;
    }
    
    // Basic guarantee
    void push_back(int value) {
        if (size == capacity) {
            reserve(capacity * 2);  // Might throw
        }
        data[size++] = value;  // No-throw
    }
};
```

### 17.2 RAII (Resource Acquisition Is Initialization)

RAII is a fundamental C++ idiom: tie resource lifetime to object lifetime.

**Principle**: Acquire resources in constructors, release in destructors. Leverages automatic object destruction to
guarantee cleanup.

```cpp
class FileHandle {
    FILE* file;
    
public:
    // Acquire in constructor
    explicit FileHandle(const char* path, const char* mode) {
        file = std::fopen(path, mode);
        if (!file) {
            throw std::runtime_error("Cannot open file");
        }
    }
    
    // Release in destructor
    ~FileHandle() {
        if (file) {
            std::fclose(file);
        }
    }
    
    // Prevent copying
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
    
    FILE* get() { return file; }
};

void processFile(const char* path) {
    FileHandle fh(path, "r");
    // Use fh.get()
    
    if (errorCondition) {
        throw std::runtime_error("Error");
    }
    
    // File automatically closed in all paths (normal return or exception)
}
```

### 17.3 Exception-Safe Class Design

```cpp
class ExceptionSafeList {
    struct Node {
        int data;
        std::unique_ptr<Node> next;
        Node(int d) : data(d) {}
    };
    
    std::unique_ptr<Node> head;
    size_t count;
    
public:
    void push_front(int value) {
        // 1. Create new node (might throw)
        auto newNode = std::make_unique<Node>(value);
        
        // 2. Link it (no-throw)
        newNode->next = std::move(head);
        head = std::move(newNode);
        
        // 3. Update count (no-throw)
        ++count;
        
        // Strong guarantee: if make_unique throws, list unchanged
    }
};
```

---

## 18. Design Principles and Best Practices

### 18.1 SOLID Principles

**Single Responsibility Principle**: A class should have one reason to change.

**Open/Closed Principle**: Open for extension, closed for modification.

**Liskov Substitution Principle**: Derived classes must be substitutable for base classes.

**Interface Segregation Principle**: Don't force clients to depend on methods they don't use.

**Dependency Inversion Principle**: Depend on abstractions, not concretions.

### 18.2 General Best Practices

* **Prefer Composition to Inheritance**: Favor has-a over is-a relationships
* **Program to Interfaces**: Depend on abstract interfaces, not concrete implementations
* **Const Correctness**: Use `const` wherever appropriate
* **Initialize All Members**: Use member initializers or in-class initializers
* **Make Data Private**: Encapsulate data and provide controlled access
* **Use Smart Pointers**: Prefer `unique_ptr`/`shared_ptr` over raw pointers
* **Follow the Rule of Zero**: Avoid defining special members unless necessary
* **Mark Single-Argument Constructors explicit**: Prevent unwanted implicit conversions
* **Use `override` and `final`**: Make intent clear and catch errors
* **Keep Classes Small and Focused**: Each class should do one thing well
