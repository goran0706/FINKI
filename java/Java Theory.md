# Programming

**IT - Information Technology**

All technology involved in information management and processing. Including: hardware, software, operating systems and
infrastructure.

**What is programming?**

Creating a set of instructions that can be executed by a computer in order to perform a specific task.

**How does a computer think?**

Computers don't think, they do what they are told.

**Frontend:**

- Visual interface
- No communication with the database
- Clientside

**Backend:**

- Logic
- Direct communication with the database
- Server side

# Java

Java is an **object-oriented programming** language. It got successful because of the **write once, run anywhere** principle.
This means that the same code can run on different devices. This works, because the Java code gets interpreted by a
special piece of software (JRE, Java Runtime Environment) that should be installed on devices that run Java. This is not
so special nowadays.

However, Java is still used a lot. Mainly for backend purposes (logic of applications that you can't see as an end
user). You can write APIs and other pieces of backend logic in Java.

Java Editions:

- Java SE
- Java EE
- Java ME
- Java Card

Java creates an object from a class when you instantiate it using the new keyword. Instantiating happens in a fixed
order, you need to know this order for the exam and it's actually useful in your day to day work as well.

This is the order:

- static initializers (blocks like these: static { } ) and static fields in the order they appear in the file

- instance variables and instance initializers (blocks like this: { } )

- constructor goes last

When there are no references to the object anymore, the object becomes eligible for garbage collection. The garbage
collector frees up the space on the heap once it runs. The garbage collector is controlled by the JVM (Java Virtual
Machine). You can suggest to the JVM it should garbage collect, but you cannot force it.

## What is OOP?

Objects Oriented Programming. Program consists of objects that contain data and functions and logic.

- **Encapsulation** - Classes have private fields and public methods to access the fields.
- **Inheritance** - A class can get properties and methods from a parent class
- **Polymorphism** - You can refer to a class by its parent

### Inheritance

Classes can inherit from a parent class. They can only have one direct parent.

This child class inherits all fields and methods from the parent class that are visible (access modifiers)
inside the child class.

Why inheritance:

- Avoids duplicate code
- Better structure and better maintenance
- Option to bundle different classes as the same kind (which again avoids duplicate code)

### Polymorphism

Referring to a class not with the class types exactly, but with another type that also represents the class

Non code example:

- I will bring my animal to next week's class
- I will bring my buddy to next week's class
- I will bring my dog to next week's class
- I will bring my Labrador to next week's class

Animal, buddy, dog and Labrador are all valid ways to address the labrador.

## Data Types

- Primitive
    - Integer (Byte, Short, Int, Long)
    - Floating Point (Float, Double)
    - Boolean (True, False)
    - Character
- Non-Primitive (Reference)
    - String
    - Array
    - Objects
    - Etc...

## Arrays

Arrays are used to store multiple values in a single variable, instead of declaring separate variables for each value.

- An array is **an object containing a fixed number of values of the same type**.
- The elements of an array are indexed, which means we can access them with numbers (called **indices**).
- There are primitive type arrays and object type arrays. This means we can use arrays of int, float, boolean, ...
  but also arrays of String, Object and custom types as well.

## Constructor

Constructors simply initializes all fields of the object with their default values.
Strings are initialized to null and integers to zero.

## Packages

A package in Java is used to group related classes. Think of it as a folder in a file directory.
We use packages to avoid name conflicts, and to write a better maintainable code.

Packages are divided into two categories:

- **Built-in Packages** (packages from the Java API)
- **User-defined Packages** (create your own packages)

## Types of Variables

There are three types of variables in Java:

- Local (non-static)
- Instance (non-static)
- Static

When a variable is declared as static, then a single copy of the variable is created and shared among all objects at a
class level.

### Static Variable

- Static variables can be accessed using class name
- Static variables can be accessed by static and non-static methods
- Static variables are shared among all instances of a class
- Static variables are like a global variable and are available to all methods

### Non-Static Variable

- Non-static variables can be accessed using instance of a class
- Non-static variables cannot be accessed inside a static method
- Non-static variables are specific to that instance of a class
- Non-static variables are like a local variable, and they can be accessed through only instance of a class

## Access Modifiers

- **private**
    - class
- **default** (no modifier)
    - class, package
- **protected**
    - class, package, subclasses in different packages
- **public**
    - world

## Non-access Modifiers

For classes:

- **final** - The class cannot be inherited by other classes
- **abstract** - The class cannot be instantiated (must be inherited from another class)

For **attributes** and **methods**:

- **final** - Attributes and methods cannot be overridden/modified
- **abstract** - Attributes and methods belong to the class, rather than an object
- **static** - Can only be used in an abstract class, and can only be used on methods. The methods do not have a body.
  The body is provided by the subclass (inherited from).
- **transient** - Attributes and methods are skipped when serializing the object containing them
- **synchronized** - Methods can only be accessed by one thread at a time
- **volatile** - The value of an attribute is not cached thread-locally, and is always read from the "main memory"

## Abstract Class vs. Interface

An abstract class is a class that is declared abstract - it may or may not include abstract methods.
Abstract classes cannot be instantiated, but they can be subclassed.
**If a class includes abstract methods, then the class itself must be declared abstract.**

- **Abstract Class and Interface:** Abstract classes are similar to interfaces. You cannot instantiate them, and they
  may contain a mix of methods
  declared with or without an implementation.
- **Abstract Class:** You can declare fields that are not fields that are not static and final, and define public,
  protected, and private
  concrete methods.
- **Interface:** All fields are automatically public, static, and final, and all methods that you declare or define (as
  default methods) are public.

**Which should we use, abstract classes or interfaces?**

**Abstract Class:**

- You want to share code among several closely related classes.
- Have many common methods or fields, or require access modifiers other than public
- You want to declare non-static or non-final fields.

**Interface:**

- Unrelated classes would implement your interface
- You want to specify the behavior of a particular data type, but not concerned about who implements it behavior
- You want to take advantage or multiple inheritance of type

## Collections Framework

The Java Collections Framework is a set of interfaces in the packages java.util and java.util.concurrent.
They provide client programs with various models of how to organize their objects, and various implementations of each
model

These models are sometimes called abstract data types, and we need them because different programs need different ways
of organizing their objects.

# Java SE 8 Fundamentals

**JDK 8**: The Java SE Development Kit includes the command-line Java compiler (javac) and the Java Runtime
Environment (JRE),
which supplies the command needed to execute Java applications.

**Java API Documentation**: The API documentation is the application programming interface specification.

Objectives:

- Contrast the terms "platform-dependent" and "platform-independent"
- Describe the purpose of the JVM
- Explain the difference between a procedural program and an object-oriented program
- Describe the purpose of javac and java executables
- Verify the Java version on your system
- Run a Java program from the command line

**Purpose of a Computer Program**

A computer program is a set of instructions that run on a computer or other digital device.

- At the machine level, the program consists of binary instructions (1s and 0s) - machine code.
- Most programs are written in high-level code (readable) - must be translated to machine code.

Programs written in most languages usually require numerous modifications to run on more than one type of computing
platform, a combination (of a CPU and operating system).
This platform-dependence is because most languages require you to write code specific to the underlying platform.
Popular programming languages, such as C and C++, require programmers to compile and link their programs, resulting in
an executable program unique to the underlying platform.
A compiler is an application that converts a program that you write into a CPU-specific code called machine code.
These platform-specific files (binary files) are often combined with other files, such as libraries of pre-written code,
using a linker to create a platform-dependent program,
called an executable, which can be executed by an end user. Unlike C and C++, the Java programming language is
platform-independent.

**Key Features of the Java Language**
Some of the features that set Java apart from most other languages are that:

- it is platform-independent
- it is object-oriented

**Java Is Platform-Independent**

A Java program can run on several CPUs and operating system combinations, such as the Solaris OS on an SPARC chip,
Mac OS X on an Intel chip, and Microsoft Windows on an Intel chip, usually with few or no modifications.
Java programs are compiled using a Java compiler. The resulting format of a compiled Java program is
platform-independent Java bytecode instead of CPU-specific machine code.

**Java Programs Run In a Java Virtual Machine**

A virtual machine gets its name because it is a piece of software that runs code, a task usually accomplished by the CPU
or hardware machine.
For Java to be platform-independent, a virtual machine called the JVM is required on every platform where your program
will run.
The JVM is responsible for interpreting Java code, loading Java classes, and executing Java programs.

However, a Java program needs more than just a JVM to execute. A Java program also needs a set of standard Java class
libraries for the platform.
Java class libraries are libraries of pre-written code that can be combined with the code that your write to create
robust applications.

Combined, the JVM software and Java class libraries are referred to as the Java Runtime Environment (JRE). Java Runtime
Environment are available from Oracle for many common platforms.

**Procedural Programming Languages**

- Many early programming languages followed a paradigm called **Procedural Programming**.
- These languages use a **sequential pattern** of program execution.
- Drawbacks to procedural programming:
  - Difficult to translate real-world use cases to a sequential pattern
  - Difficult to maintain programs
  - Difficult to enhance as needed

**Java is an Object-Oriented Language**

Object-oriented programming differs from procedural programming, because procedural programming stresses the **sequence
** of coding steps required to solve a problem, whereas
object-oriented programming stresses the **interaction** of objects. Java is an object-oriented programming language.
One of the main goals of an OO language is to create
objects - pieces of autonomous code - that can interact with other objects to solve a problem. OO programming languages
began in 1967 and have led to popular programming languages as
C++, upon which Java is loosely based.

This provides many benefits:

- **Modularity**: The source code for an object can be written and maintained independently of the source code for other
  objects. After it is created, an object can be easily passed around inside the system.
- **Information hiding**: By interacting only with an object's methods, the details of its internal implementation
  remain hidden from the outside world.
- **Code reuse**: If an object already exists (perhaps written by another software developer) you can use that object in
  your program.
- **Maintainability**: If a particular object is found to be problematic, you can create another slightly modified one
  and simply replace the original one in your application.
  This is analogous to fixing mechanical problems in the real world. If a bolt breaks, you replace the bolt, not the
  entire machine.

# Java Programming

What is Java?

- Java is two things: programming language and a platform.

As a **programming language**, Java was designed to be:

- simple, object-oriented, and familiar
- robust and secure
- architecturally neutral and portable (platform independent)
- interpreted, threaded, and dynamic
- high performing

As a **platform** Java has two components:

- The **Java Virtual Machine** (**JVM**)
- The **Java Application Programming Interface** (**API**)

Execution:

1. Your Java Application
2. Java API
3. Java Virtual Machine (JVM)
4. Hardware/OS

The Java Platform Cont.

In Java, applications are both compiled and interpreted.
The Java compiler compiles your application source code to an intermediate language that is interpreted by the JVM.
In other words, bytecode is like the "machine code" for the JVM.

- The bytecode is platform independent and can therefore be interpreted by any JVM.
- JVM are built specific to particular platforms (hardware and OS)

**_Java Application >> Javac >> Bytecode >> JVM >> Machine Code >> Hardware/OS_**

There are three primary editions of Java:

- Java EE
- Java SE
- Java ME

## Object-Oriented Programming

**Java is an object-oriented programming language**.
Object-oriented programming represents a way of creating code:

- The created code mimics real world entities or "objects"
- Objects are software bundles of data and related procedures
- For example, a bank account object would contain data such as its balance, account number, and owner information
- A bank account object would also contain procedures to open, debit, credit, apply interest, and close an account.
- The result of mimicking the real world is code that more aptly matches the problem the programmer is trying to solve
- This process of writing code to be like the real world is called **_abstraction_**
- OOP has several distinct advantages, if done properly
  - OOP is more extensible, allowing you to add things to your application faster and easier than with structured
    code.
  - OOP is easier to maintain.
  - OOP provides better organization for code reuse and library functionality

```pre
_____________
Bank Account
_____________
-balance
-id
-owner
_____________
+debit()
+credit()
+open()
+close()
+applyInterest()
```

### Objects vs. Primitives

In Java, most of the time you deal with objects.

- There are eight primitive data types: byte, short, int, long, float, double, char, boolean
- Everything else in Java is an object!

Using objects is fundamental to using and writing Java!

```java
Customer c=new Customer();

// For example, the following is illegal:
        int chaptersToStudy=3,4,5; // ILLEGAL

// A primitive may only store one value:
        int chapterToStudy=3; // LEGAL
```

The technical term for creating an object is **_instantiation_**.

- When a reference is defined, it does not create the object.
- Defining a reference only means that it is ready to point to an object.
- The object is created when "new" is used.

### Stack and Heap

In the memory managed by the JVM behind the scenes, objects references and the objects assigned to them are managed by *
*_stacks_** and the **_heap_**.

- Stacks are a list of references defined within a given block of code (also known as a **_scope_**)
- The heap is where all objects are actually stored in memory
- References in different stacks can point to the same objects on the heap.

### Initializing Data

Creating an object is called instantiation.

- You instantiate an object using the **new** keyword.
- Some object types allow information to be given during instantiation
- This allows instance variables of the object to be set (initialized) when the object is created
- This is opposed to modifying them after the object is created

When you create an object with the **new** keyword, you are actually calling a special method called a **constructor**.

- The constructor is responsible for initialization of an object when it is instantiated
- Constructor methods can only be called during instantiation
- All objects have at least one constructor but can have as many as they want or need
- The benefit of multiple constructors is flexibility
- Depending on what information you have when you create an object, you may have the **ability to pass in all, some, or
  no data.**

```java
// Customers may submit all information (name, address, phone, email, and so on...)
Customer c=new Customer("Jason","Eagan","999-9999","jason@something.com");

// Some might only submit their email address
        Customer c=new Customer("jason@something.com");

// Still others might enter their name and address but no phone or email
        Customer c=new Customer("Jason","Eagan");
```

An object is called a **_class_**:

- A _class_ defines what data objects of that type can store and what functions they can perform.
- A _class_ is a template or a blue-print for object creation.
- An object is really an instance of a class.
- Many object instances can be generated from one class.
- Note: Each file may only contain one **"public"** top level class.
- Other top level classes may be added to the same file, but they must not list an access modifier (these will be
  discussed in detail in the **"Encapsulation"** section).

```java
// HelloWorld file
public class HelloWorld {
}

class HelperClass {
}
```

Instance variables are defined before the methods in the class

- In fact, the order of instance variables and methods is not important in Java.
- Conventionally, instance variables are listed near the top of classes and before methods.
- Conventionally, instance variables, constructors and methods are grouped together for easy location.
- Use the dot notation to access both object data and object methods.

```java
Car myCar=new Car();
        myCar.color="white";
        myCar.type="Sedan";
        myCar.printDescription();
        myCar.start();

// The return type void means nothing is returned from this method
// The return statement terminates a method, so no code belongs after the return statement.
        System.out.println(desc);
        System.out.println(myCar.getDescription());
```

### Building Constructors

A constructor enables passing initial values into the object so that we do not need setting in separate lines of code.

- Constructors are special methods
- Constructor methods have the same name as the class itself
- Constructors look just like methods, but they have no return type, not even void
- Constructors are invoked only by using the **new** keyword, not the dot notation like methods.
- Constructors save the extra step of initializing your data after instantiation of the object.

Behind the scenes, several things are actually done when you use the new keyword:

1. **"new"** dynamically allocates space on the heap
2. The object is created and its instance variables are initialized with **default** values
3. Explicit initialization is executed
4. The last step is to call the constructor, thereby initializing the instance variables based on what the constructor
   indicates

What are the default values referred to in the second step?

- The default values differ based on the type of the instance variable.
- Only **instance** and **static** variables have default values. Any variables declared in a method must be explicitly
  initialized before they are used.

Default Constructor

The **_default_** constructor is a **no-arguments** constructor that is provided by Java if you define a class without
explicitly defining any constructors.

- One of the most common mistakes in Java is to rely on a default constructor that no longer exists.

```java
public class Car {
    String color;
    String type;

    Car(String c, String t) {
        color = c;
        type = t;
    }
}
```

## Class vs. Object

- Class: a template for object creation
- Object: An instantiation of a clas, something concrete created using a class template

### Static Variables

Java allows you to tie variables not only to each object but also to the class.
Data associated with the class instead of the object is stored in class variables (versus instance variables for objects
or instances)

- Class variables are also called static variables.
- They are called static variables because the static keyword is used to identify them.
- No matter how many instances are created, there is but one variable shared among the instances.

### Static Method

As you learned in class, data can be stored in objects but can also be associated with the class itself.
Data associated with the class is held in static variables.
Likewise, methods that operate on static data or provide functionality to the class are called static methods.

The **static** keyword can also be applied to a method. A static method, like a static variable, is associated with
the class, not the objects (instances).

- Static methods are also called class methods (versus non-static methods, which are instance methods)
- To call an instance (non-static) method, you must have an object reference.
- To call a static method, you only need the name of the class (not needed if called within the same class)

**Static methods essentially have two purposes:**

- **They are used to access (update or fetch) class variable data**
  - Although this can be done with any instance of the class, it is considered more appropriate to use class methods
    for this purpose.
  - In some cases, you may not have an instance of an object created before the data is needed.
  - You don't want to have to create an object just to be able to access class variables.

- **Static methods provide functionality without the need for an object/instance**
  - For example, mathematical formulas are great reasons to have static methods
  - Should you have to create an instance of some object to compute, sine, cosine, or tangent? (Examine the Math
    class)

### Initialization Block vs. Static Initialization Block

- Initialization Block is executed in the order that they are listed.
  - Code is executed every single time an object is initialized

- Static Initialization Block:
  - The code will be executed just once only when the class is loaded.
  - It can only access static variables and static methods

```java
{
        color="Red";
        }

static {
        count=10;
        }
```

### this Keyword Rules

- this() constructor must be the first line in chaining constructors, or inheritance
- this tells Java to look for a variable directly on the object in the Heap.
- this can be used to avoid name collision or variable shadowing.

### Scope

Variables and methods have a certain range in which they exist and where they can be accessed:

- The concept here is known as scope.
- There are different levels of scope.
- Scope pertains to where data exists (to which context it belongs)
- Scope can most easily be identified by curly brackets{}, in other words, a code block

A number of different locations for variables:

- **Inside a class**
- **Inside a class but defined as static**
- **Inside a method (as parameters to a method)**

There are different levels of scope, and you refer to them in different ways:

- **Instance variables**
- **Static variables**
- **Local variables**

To help understand scope, it is also important to know that **every method call gets its own frame on the stack.**

```java
public class BankAccount {
    double balance = 150.00; // Instance variable

    public void withdraw(double amount) { // amount is a local variable
        balance = balance - amount;
    }
}
```

## Garbage Collection

The Java runtime environment manages memory for you!

- You never have to destroy an object explicitly or manage the memory it uses.
- The Java runtime environment deletes objects when it determines that they are no longer being used. This process is
  known as garbage collection.
- The Java runtime environment's garbage collector periodically searches memory for "free" (unreferenced) objects that
  are no longer needed.
- When it finds one, it removes it from the heap.
- In the example above, an object was no longer referenced because it fell out of scope, a kind of indirect "
  de-reference".
- In the code below, an object reference can be reused, causing the original object to be directly de-referenced and
  therefore subject to garbage collection.

```java
Customer c=new Customer();
        c=new Customer(); // Same reference - different objects
```

### Java Memory Leaks

```java
public class Main {
    static Car car;

    static void doSomething(Car car) {
        myCar = car; // Manual memory leak... we unnecessarily store the variable to the static variable and sits in memory forever
        System.out.println("My car " + myCar);
        myCar = null; // clean up to avoid memory leaks
    }
}
```

## Packages

Packaging is a way to organize your classes. Packages have many uses:

- Packages make it easier to find and use types: classes, interfaces, enumerations.
- Packages help to avoid naming conflicts.
- Packages help control access to code.
- Packages represent namespaces and a folder hierarchy.
- You can create multiple levels of packages using periods (dots)

Think of package as a code folder. They help developers bundle groups of related types together.

- Some examples include making a security package, a data access package, or a formatting package.

To create a package and put your class in a package, you need to include a package statement as
the first line of code in the Java source code file.

```java
package transport;

public class Car {
}
```

To expedite coding, use import statements.

- Import statements allow you to list the names of classes you use in a file
  you can use shorthand naming.
- If you are going to use more than one class in a package, you can import a whole package with one import statement.
- A class can have as many import statements as needed.
- All import statements must go between the package statement and the class declaration
- Unlike C++ _include_ statements, _import_ statements do not actually make your bytecode any larger.
- Imports just allow you to type less.
- Imports can make to compile take longer. When the compiler writes the bytecode, the full names of all types are
  included.

```java
import com.intertech.transport.Car;

public class RoadWay {

    public static void main(String[] args) {
        Car myCar;
        myCar = new Car();
    }

}
```

```java
package com.techcompany.transport;

import java.awt.*;
import java.util.*;
import java.net.URL;

public class Car {
}
```

The asterisk (*) in the import statement can be used only to specify all the classes within a package.

- It cannot be used to match a subset of the classes in a package or import "nested" packages.
- For example, the following code does not import all the class in the transport package that begin with A.
- If the same class name can be found in multiple wildcard imports, you will need to explicitly reference the one you
  with to use.

```java
import transport.A*; //won't compile
```

```java
import java.*; //won't import anything
```

```java
import com.techcompany.consulting.*;
import com.techcompany.training.Customer;
```

If you have no imports listed, you still have access to two packages:

1. The package that you are currently in
2. The java.lang package

The java.lang package has classes that are fundamental to nearly every program you write.

### Classpath

The classpath is a system variable that allows you to tell the compiler and class loader where you store your files (the
bytecode and other application files)

### Java Archive (JAR)

Java Archive allows multiple files to be stored into a single archive, bundle up into a compact file or library.

- The JAR format allows multiple files to be stored in a single Java archive.
- The JAR format is simply the old-fashioned ZIP file format
- Typically, a JAR file contains class files and auxiliary resources associated with your application
- However, it's just a ZIP file, so you can put anything you would like into a JAR file.

Why use a JAR? Some reasons include the following:

- **Security**: You can digitally sign the contents of a JAR file.
- Users who recognize your signature can then optionally grant your software security privileges it wouldn't otherwise
  have.
- **Compression**: ZIP files are more compact and thereby decrease the time and space needed to download it, copy it and
  store it.
- **Package versioning**: A JAR file can hold data about the files it contains, such as vendor and version information.
- **Portability**: The mechanism for handling JAR files is a standard part of the Java platform's core API.

JAR files are the typical means to distribute your code/application.

- When you hear the term "library" in Java, this often refers to the classes in one or more JAR files.
- In fact, the Java API is distributed in a JAR file.
- Check out the lib folder in the JDK.

`jar cf jar-file input-file(s)`

## Coding Standards

Coding has style, the aesthetic way that we write code. We should write code that is aesthetic and legible.

- In Java most developers follow some simple coding standards that every aspiring Java programmer should know.
- Java is a free-form language, so you can place white space anywhere you want. However, it's up to you to make your
  code legible.
- Java is case-sensitive!
- Class-names are always in capital case.
- Java uses upper and lower camelcase convention

```java
public void foo(){
        // code
        }

public void foo()
        {
        // code
        }
```

## Encapsulation

**Encapsulation** and/or **data hiding** are terms in object-oriented programming that are often used interchangeably.

- **Encapsulation** is the technique of bundling data with methods that operate on that data
- **Data hiding** is building classes such that direct access to an object's data is prohibited, except through the
  encapsulating methods.
- In Java, the modifiers **public** and **private** are most commonly used means to control access.
- With encapsulation/data hiding, data stored in an object is hidden, or private, while using public methods (exposing
  methods) to manipulate the data.

### Getters and Setters

Appropriately encapsulated objects with proper data hiding can solve these issues.

- Encapsulation hides the detail of how things get done.
- These exposed pieces are commonly referred to as the **"interface of the class"**
- **Accessors** and **mutators** are called **getters** and **setters** in Java

### Access modifiers

To use encapsulation, you need to limit access to some part of the objects.
Access modifiers can be used on almost any part of the class definition.
This includes static or instance variables, static or instance methods, constructors, and the class itself.
There are actually four distinct access modifiers:

- **public** - Access is not limited
- **private** - Access is allowed only by the declaring class
- **protected** - Access is allowed by the declaring class, any class in the same package, and any descendant (
  extending) class
- **default** - Access is allowed by the declaring class and from any class in the same package

## Inheritance

It is very common for classes to have very similar functionality. How can common code between classes be shared to
maximize reuse.

- One way to maximize reuse is to isolate common functionality/data into separate classes
- Inheritance is another powerful tool for code reuse.
- Inheritance describes an "is a" relationship.
- To create an inheritance relationship, use the _extends_ keyword when declaring the class
- One benefit of inheritance is immediately obvious: it lessens the amount of code needed to create a new class
- Another use is the reuse of the extended class's code.

When you extend another class, inherit all the attributes and behaviors of the super class.

- In other words, all the methods and instance variables of the extended class are automatically part of the class.
- Java is a single-inheritance OOP language. This means that in Java, **each class can only extend one class!**
- Some OOP languages (C++, Python) offer multiple inheritance.
- A class can only extend one class, but the class you extend might have already extended another clas.

There are several words used to describe inheritance.

- Java syntax reads Employee "extends" Person
- It is common to hear or read that Person is the "super" class of the "sub" or "subordinate" Employee class.
- Other words are general/specific classes or parent/child classes.

### Chaining Constructors

The best way to solve the initialization of the variables from the parent class is to use "chained" constructors.

- The _**this**_ keyword is a reference to the current object and is used to call another constructor in the same class.
- In every object, there is also a _**super**_ keyword, which is a reference to the parent class.
- Even when a subclass does not call on a super class's constructor explicitly, the compiler inserts a call to the super
  class's default constructor implicitly.

Protected access means that the state or behavior is available to code in the same class, same package, and to subtypes
in any other package. Let's look at some examples that use the following class:

```java
package com.intertech.examples;

public class Person {
    protected void doSomething() {
        System.out.println("Doing something");
    }
}
```

In this first example, calling doSomething() is legal, because it is being invoked from a class in the same package.

```java
package com.intertech.examples;

public class PersonTester {
    public static void main(String[] args) {
        Person p = new Person();
        p.doSomething();
    }
}
```

Although this next example defines a class in a different package than the one which contains Person, calling
doSomething() is legal because Employee extends Person

```java
package com.something.else;

import com.intertech.examples.Person;

public class Employee extends Person {
    public void testingProtectedMethod() {
        doSomething();
    }
}
```

When dealing with code that is in a different package from the one that contains the protected state or behavior, it's
not enough for the call to be made with a subtype object. The object must be called within a subtype class. For example,
the following is illegal. Even though the object being used is an Employee (a subtype of Person), the code has been
defined in a class that is not a subtype of, nor in the same package, as Person.

```java
package com.something.else;

public class EmployeeTester {
    public static void main(String[] args) {
        Employee e = new Employee();
        e.doSomething() // ILLEGAL
    }
}
```

The most surprising rule, however, is that when accessing protected state or behavior from a different package, it can
only be accessed with an object reference that is the same type as the class it is defined in. For example, here we have
an Employee class. The class is defined in a different package from Person, but it is a subtype of Person. Therefore,
the doSomething() method is available to Employee. It is NOT, however, available for a Person object (where the method
is defined!) or a Musician object (another subtype of Person) when they are used in this Employee class:

```java
package com.something.else;

import com.intertech.examples.Person;
import com.intertech.examples.Musician; /* Musician extends Person */

public class Employee extends Person {
    public void testingProtectedMethod() {
        doSomething();  // LEGAL
    }

    public static void main(String[] args) {
        Employee e = new Employee();
        e.doSomething(); // LEGAL
        Person p = new Person();
        p.doSomething(); // ILLEGAL
        Musician m = new Musician();
        m.doSomething(); // ILLEGAL
    }
}
```

I mentioned that when chaining constructors, the call to the super constructor must be the first statement in the constructor.  And that's true.  Assuming the Person class contains a no-arg constructor, the following constructor is valid:

```java
public Employee() {
  super();
  deptId = 281;
}
```
...whereas this one is not:
```java
public Employee() {
  deptId = 281;
  super();
}
```

I want to clarify that using super with the dot operator, to invoke a super type's method (other than a constructor) or access its state, is NOT bound by the first statement rule.

Both of these examples are valid:

```java
public void driveLikeDad() {
  super.drive();
  doSomethingElse();
}
```

and...

```java
public void driveLikeDad() {
  doSomethingElse();
  super.drive();
}
```

### Overloading Methods

Java allows you to reuse the same name for any number of methods. This is called method **overloading**.
The Java compiler uses the name of the method and the arguments of method to determine uniqueness. This is called the "**signature**" of the method.

```java
public Person(String firstName, String lastName) {}
public Person(String firstName, String lastName, int age) {}
public Person(String firstName, String lastName, int age, String address) {}
```

### Overriding Methods

Overriding is changing the definition of a method a class inherits.
- Overriding is done when a class inherits some functionality through a method from an extended class, but you want to change that functionality.

To successfully override a method, the method must have the same signature.
- In other words, the name and parameters of the overriding method must be exactly the same as the overridden method.
- If the method names are the same, but the parameters are different, you are overloading, rather than overriding the method (and must follow the rules described for overloading)

Once it is determined that you are overriding a method, a few more rules must be followed:
- The return type must be the same or a subtype of the overridden return type
- An overriding method cannot be less accessible than the inherited method.
- Overriding methods cannot declare additional exceptions than those declared in the overridden method, UNLESS the new exception(s) are either a subtype of one of the overridden exceptions, or is a runtime exception.
- Static and private methods cannot be overridden. They can only be "hidden". This means that these methods are resolved by their reference variables at compile time. Overridden methods, in contrast, are resolved at runtime.

### Covariant Returns

A covariant return is where a subtype is listed in the place of a supertype.
- Overridden methods may use a covariant return

```java
public class GrandFatherRegistry {
    public GrandFater whosMyAncestor(String ssn) {
      ...
    }
}

public class FatherRegistry extends GrandFatherRegistry {
    public Father whosMyAncestor(String ssn) {
      ...
    }
}
```

The primary reason for **covariant returns** is to allow a caller to expect a more specific type of return than the one declared in the overridden method.

### The Three Faces of Final modifier

The modifier means **"unable to change"**. The final keyword can be used for three different things:
- **_final_** **before a variable** makes the variable a **constant**.
- **_final_** **before a method** makes it so the **method cannot be overridden**.
- **_final_** **before a class** makes that **class cannot be extended**.

To create a constant, just add the final modifier when you declare a variable.
- Final variables can be local (in a method) or a variable (static or instance) of a class
- Constants are usually static
- By convention, constant names are in uppercase. If needed, underscores ("_") are used to separate words.
- If you have a constant instance variable, you can set the value for that **constant in the constructor** or with **explicit initialization.**
- Final variables must be set before they are used
- Trying to set a final outside explicit initialization or in a constructor results in a compiler error.

- The String class is final. You can't inherit from String and change its functionality
- Java Enum constants are implemented implicitly as static and final

```java
public class FinalTest {
    public static final int LESS_TRAVELED = 0; //explicit initialization
    public final int SHORTEST;
    public FinalTest() {
        SHORTEST = 1; //constructor initialization
    }
}
```

```java
public class FinalTest {
    public static final int LESS_TRAVELED = 0; //explicit initialization
    public final int SHORTEST;
    public void foo() {
        SHORTEST = 1; //compiler error - cannot assign a value to final variable SHORTEST
    }
}
```

Switch Statements Revisited
When we discussed Switch statements in the Java Syntax section, I mentioned that each case statement had to use a value that was understood at compile time (variables and return values from methods cannot be used).  At that point in the course, the only value that fit that description was a literal value.  For example, the following code uses char literals for each case statement:

```java
char studentGrade = 'A';
switch (studentGrade) {
    case 'A':
        System.out.println("Student received an A");
        break;
    case 'B':
        System.out.println("Student received a B");
        break;
      default:
        System.out.println("Student received a C or lower");
}
```
Now that we've learned about "final," we can add constants to our short list of valid case values.  Constant works because their value is known at compile time.  So the following is legal:

```java
final char A_GRADE = 'A';
final char B_GRADE = 'B';
char studentGrade = 'A';
switch (studentGrade) {
    case A_GRADE:
        System.out.println("Student received an A");
        break;
    case B_GRADE:
        System.out.println("Student received a B");
        break;
    default:
        System.out.println("Student received a C or lower");
}
```

```java
public class Person {
  {
    System.out.println("Person: First Instance Initialization Block");
  }
  static {
    System.out.println("Person: First Static Block");
  }
  {
    System.out.println("Person: Second Instance Initialization Block");
  }
  static {
    System.out.println("Person: Second Static Block");
  }
  public Person() {
    System.out.println("Person()");
  }
  public void sayHello() {
    System.out.println("Person: Hello!");
  }
}
```

```java
public class Employee extends Person {
  {
    System.out.println("Employee: First Instance Initialization Block");
  }
  static {
    System.out.println("Employee: First Static Block");
  }
  {
    System.out.println("Employee: Second Instance Initialization Block");
  }
  static {
    System.out.println("Employee: Second Static Block");
  }
  public Employee() {
    System.out.println("Employee()");
  }
}
```

```java
public class Instructor extends Employee {
  {
    System.out.println("Instructor: First Instance Initialization Block");
    str1 = "First Instance Initialization String";
  }
  static {
    System.out.println("Instructor: First Static Block");
    str1 = "First Static Initialization String";
  }
  public static String str1 = "Explicit Initialization String";
  {
    System.out.println("Instructor: Second Instance Initialization Block");
    str1 = "Second Instance Initialization String";
  }
  static {
    System.out.println("Instructor: Second Static Block");
    str1 = "Second Static Initialization String";
  }
  public Instructor() {
    System.out.println("Instructor()");
  }
}
```

## Polymorphism

- Polymorphism is a word with Greek origins that loosely translates to the ability to take on many ("poly") forms ("morphism").
- In programming, it means a class has the same interface or set of methods but different implementation.
- In a word, polymorphism is about substitutability. This principle provide OOP languages like Java with extreme code flexibility.

**Polymorphism is the ability for any one object to be referred by several types of references.** As long as the Object type is a descendant of the reference type, it is legal.

```java
Employee e = new Employee();

Person p = new Employee();
```

Even though the reference type is of a Person type, at runtime Java figures out which method is called based on the actual object type.
- This is referred to as **"Dynamic Method Dispatching"** or **"Virtual Method Invocation"**
- When the code runs, the virtual machine looks for a definition of invoked method in the object first.
- Then the virtual machine traverses up the inheritance tree looking for the method in question
- This is why final methods execute faster. There is no need to figure out dynamically where a method is defined.


### Why use polymorphism?

- Polymorphism promotes **flexibility and separation of concerns**
- The **power of polymorphism lies into the concept of overriding methods.**


### Object Type Casting

Casting in primitive data types is used to force truncation of larger types such as int into smaller types such as byte.
With objects, casting is used to return an object to a more specific type.

```java
Person p = new Employee();
Employee m = (Employee) p;

// or 

((Employee) p).title = "instructor";
```

- To protect the casts at runtime, use the _instanceof_ operator.
- The _instanceof_ operator can be used not only to case appropriately but to execute code conditionally.

### The Object Class

Two commonly overridden methods can further demonstrate polymorphism.
- The method toString() is used to convert objects to Strings. Default definition is a hashcode reference to the object's location in the heap.
- The methods equals() is used to compare objects. Default definition is the same as using == operator.
- Both toString() and equals() are originally defined in the class java.lang.Object
- When overriding the equals, it is also generally necessary to override the hashCode() method.
  - The hashCode() method is another method defined in java.lang.Object
  - The hashCode() method returns an integer identifying an object
  - It is used when storing objects in hash data structures (covered later)
  - In essence, the hashCode() is used by a hash data structure to determine whether two objects it holds are in the same compartment.
  - Therefore, if two objects are considered equal based on the equals method, they should also return the same hash code with the hashCode() method.

Everything in Java (except primitives) "is a" Object - literally! That is, every class in Java eventually extends java.lang.Object.
- If you don't extend a class as your parent you automatically extend java.lang.Object
- Therefore, every Java object is an Object, whether you like it or not!

## Abstract Classes

Abstract classes allow a designer to generalize functionality of classes without providing implementation details.
- This is useful when capturing similarities between classes.
- Similarities, often indicate that classes like Rectangle and Circle should be related in some way.

Java allows developers to leave the definition, or implementation, of a method off.
- Use the abstract modifier in front of the method name and include no code block (curly braces) to signify that the method is only a placeholder.
- Abstract methods have no implementation.
- Abstract classes can not be instantiated.
- Abstract classes can contain non-abstract methods.
- Abstract classes are classes strictly designed to be extended.

The most common question that arises when first dealing with abstract classes is, why?

- Polymorphism!
- By creating a relationship between Rectangle and Circle through the Shape class, you can now use Circles and Rectangles interchangeably as shapes.

### Abstract Recap

- Abstract methods have no {}, no implementation
- If a class has even one abstract method, that class must be abstract
- Abstract classes can not be instantiated, so the new keyword can not be used to create instances of abstract classes
- Descendant classes of an abstract class must implement the inherited abstract methods or become abstract themselves.
- Abstract classes provide generalizations, or relationships, between classes. This relationship can be exploited using polymorphism.

**Modifiers**

When a method is described as being abstract, it doesn't have an implementation.  It relies on a subtype to implement the method.  Therefore, certain modifiers, such as private, static, and final cannot be used on an abstract method.  If you think about this logically, it makes sense.  Private, static, and/or final methods cannot be overridden, and all abstract methods must be overridden.  Therefore these modifiers cannot appear in an abstract method declaration.  By the way, that's the trick to remembering what's legal and not legal when defining a concrete implementation of an abstract method: they follow the same rules declared for overriding methods.

**Inheritance**

When we say that a concrete subtype must make sure all abstract methods are overridden, it doesn't necessarily mean that all of the abstract methods are implemented in the subtype.  Basically, the rule is that for a class to be concrete, it must make sure that any method call has some concrete definition that can be invoked.  And that concrete definition could be defined in a supertype (even in an abstract class!)

For example, imagine there are three classes: Person (abstract), Employee (abstract), and Consultant (concrete).  For Consultant to compile, all of the abstract methods in Person and Employee must have a concrete implementation.  As such the following compiles:

```java
public abstract class Person {
    protected String firstName;
    public abstract String getName();
}


public abstract class Employee extends Person {
   protected String title;
   public abstract double pay();
    public String getName()  {
        return title + ": " + firstName;
    }
}


public class Consultant extends Employee {
    public double pay() {
        return 80_000.0;
    }
} 
```
Notice that Person defines an abstract method (getName()), and it is not implemented in the Consultant class. This is perfectly OK because Employee defines getName(). When we instantiate a Consultant and call getName(), the concrete implementation defined in Employee is available... and that satisfies the main rule: a class may become concrete (non-abstract), as long as all abstract methods in its hierarchy have a corresponding concrete implementation.

## Interfaces

An interface is a pseudo-class.

- Interfaces are defined in their own file with a .java extension
- In the definition, replace the _class_ keyword with the _interface_ keyword.
- Interfaces can only contain methods that are **public** and are one (and only one) of these types: **abstract**, **default**, or **static**
- Since the public modifier is implied, sometimes it is not present in the declaration
- Also, if neither abstract, default, or static is listed in the declaration, it is set as abstract.
- In addition to methods, interfaces can only contain variables that are public, static, and final. These three modifiers are all implied, so they do not need to appear in the definition.

Abstract interface methods follow the same rules as abstract methods in abstract classes.
- Up until Java SE 8 this was the only type of method permitted in an interface.
- With the release of Java SE 8, default and static methods were added to the language.

Interfaces are implemented by classes:

- Like an abstract class, no instances of an interface are ever created.
- An interface defines behavior expected of implementers.
- A class can implement an unlimited number of interfaces.
- Using the _implements_ keyword in a class definition **indicates the class lives up to the behavior defined in the interface.**
  - In other words, the class overrides the methods defined in the interface.

### What Interfaces Do?

As with abstract classes, a common question asked when first dealing with interfaces is what interfaces do?
- Again, polymorphism
- Variable references can be typed by interface types
- Therefore, you can store a Circle, Rectangle, or Cat in a Drawable reference variable.

- Interfaces can also be used as the type for method parameters
- Interfaces provide Java with a pseudo means of having multiple inheritance
  - A class can extend only one class, but it can implement an unlimited number of interfaces

- Sometimes interfaces are named by adjectives or include the word listener or interface in the name.
  - Adjectival interfaces usually end in "able", suggesting the capability they add to implementing classes.
  - Some JDK interface names include Runn**able**, Serializ**able**, Clone**able** and Action**Listener**.

```java
public class PayService {
    public void cutCheck(Payable pay) {
        // ... do the work of paying something or someone
    }
}

public interface Payable {
    public double pay();
}
```


While an IDE or a compiler will complain if you make this mistake, you won't have these tools when taking the exam.  So remember: all interface methods are public, even if they don't use the public keyword.

Therefore given the following legal interface:

```java
public interface Payable {
    double pay();
}
```
Unlike interface methods, concrete implementations MUST include the public modifier.  Therefore, the following code will not compile because pay() is missing the "public" modifier.

```java
public class Consultant implements Payable {
  double pay() {
    return 80_000.0;
  }
}
```
The correct code is:


```java
public class Consultant implements Payable {
  public double pay() {
    return 80_000.0;
  }
}
```

## Lambda

An interface that doesn't contain any methods at all, it is called a **"Marker"** interface. A marker interface is typically used by the JRE to determine that an object adheres to some rule or is able to perform an action, etc.
- For example, a class that implements java.io.Serializable informs the JRE that objects of this type may be serialized ( a term that means an object's state
  may be turned into a byte array which could be saved as a file, sent over a network, etc).

An interface that has one, and only one abstract method is known as a **"Functional Interface"**.
- Even if an interface contains multiple default and/or static methods, it is still considered "functional" if it is limited to one abstract method.
- The single exception to the "only one abstract method" rule is if the additional abstract methods are overriding ones declared in java.lang.Object
- Java SE 8 gives us a new syntax to take advantage of functional interfaces: **the lambda expression**

A lambda expression (or simply, "lambda"), is a syntax used to pass a block of code into a method that accepts a functional interface parameter.
- Rather than creating an entire class that implements the functional interface, the developer is able to simply pass in an implementation of the interface's sole method.

```java
// The functional interface, Payable, defines a method to give an employee a raise
public interface Payable {
    public abstract double raiseSalary(double percentage);
}

// A cutCheck method accepts a Payable as a parameter
public void cutCheck(Payable p) {
    double updateSalary = p.raiseSalary(.04);
}

// A Consultant class implements the interface
public class Consultant implements Payable {
    private double salary = 80_000;
    public double raiseSalary(double percentage) {
        return salary + (salary * percentage);
    }
}

// Using lambda
cutCheck(
        (double percentage) -> {return salary + (salary * percentage)}
)
```

### Lambda syntax

1. Method params or empty parentheses
2. Arrow Token (Separator)
3. Method body

- If there is only one parameter, and the parameter type has been omitted, the parentheses that surround the parameter are optional
- If there is only one statement in the body, the curly braces "return" keyword, and semicolon are optional. However, they all exists together as a group: either they all appear together or they are omitted together.

### Predicate

Java includes a functional interface called **"Predicate"** to handle a very common scenario: a "test" method is invoked with a parameters, resulting in a boolean outcome.

- The type is Predicate<T> where "T" can be any type needed in the test.
- It's single abstract method is: boolean test(T t)
- The syntax of T is called **"Generics"**

### Static Methods

Applications need constant values on occasion. Java has a feature to allow constants and static methods to be imported (from either a class or an interface) without importing the entire class.

```java
import static com.somecompany.SafeDriver.printMaxSpeed;
```

## Arrays

An array is an object that represents a homogeneous collection of integer-indexed objects. An array is an object like any other Java object, so you instantiate these object with the new keyword.

Creating an array:
- Declare the array reference
- Instantiate the array with the new keyword
- Populate each element of the array

There are two syntaxes for declaring an array. The square brackets can appear after the type or after the variable name.

```java
int[] intArrayOne;
int intArrayTwo[];
```

- Arrays can be instantiated using the new keyword
- After an array is instantiated you can populate the elements
- After the array has been populated then you can access the elements by their integer index
- Arrays have a special syntax built in that allow declaration, instantiation, and assignment all in one step. It is allowed when you declare the array initially.
- The length of the array is equal to the number of elements declared.
- The array besides the elements, only holds one piece of information, it's length.
- The length of an array is a read-only attribute that is set when the array is created
- The length of an array is commonly used to iterate through all elements of an array.
- Array's length is of fixed size, the array itself cannot be automatically resized. While arrays cannot be resized, a special method
  in the System class allows the contents of the array to be copied to another array (possibly with a different size).
  - The System class provides a number of utility functions
  - The arrayCopy() method allows you to copy elements from one array to another array.
- Arrays are not limited to primitive data types. Arrays can hold any Java object type.

### Arrays and Polymorphism

Because arrays can hold more than just primitives, they become a very good way to see polymorphism in action.

```java
Employee[] stuff = new Employee[3];
stuff[0] = new Manager();
stuff[1] = new Secretary();
stuff[2] = new Employee();
```

### Multi-Dimensional Arrays

Java supports multi-dimensional arrays.
- Each dimension uses its own set of square brackets
- Java multi-dimensional arrays are nested arrays, or "arrays of arrays".

Balance the Brackets

Make sure both sides are balanced with the same number of square brackets:

```java
int[][] credentials = new int[3][2]; // legal
int[][] credentials2 = new int[3]; /* Illegal. Missing the 2nd dimension */
```

Square Bracket Placement

Just like regular arrays, the square brackets can go to the right of the type, or the right of the identifier:

```java
int[][] credentials = new int[3][2];
//or

int credentials[][] = new int[3][2]; 
//They can be split up as well (though this is uncommon). For example a 3 dimensional array could legally be declared as:

int[] moreStuff[][] = new int[3][3][2];
//or

int[][] moreStuff[] = new int[3][3][2];
```

Initializing the Final Dimension

The first dimension must be given a size during its definition.  It is legal to initialize the other dimensions after the array has been defined.  For example the code below is legal.

```java
int[][][] moreStuff = new int[3][3][];
moreStuff[0][2] = new int[2]; // Line A
moreStuff[0][2][0] = 0;
moreStuff[0][2][1] = 1;
```

While this is legal, note that Line A is adding a 3rd dimension to only one member of 2nd dimension.  In other words, if you tried to access another 2nd dimension value and add an int to its 3rd dimension, it would throw a NullPointerException at runtime:

moreStuff[0][1][0] = 0; /* ILLEGAL! Only [0][2] has a third dimension. */
There can't be any gaps of size definition between the first dimension and the subsequent dimensions: The following three lines of code are illegal and would not compile:

```java
int[][][] moreStuff  = new int[3][][3];
int[][][] moreStuff2 = new int[][3][3];
int[][][] moreStuff3 = new int[][][3];
```

### Sorting and Searching Arrays

- Arrays have a supporting class to aid in sorting. java.lang.Arrays class is a companion to all array objects that provides searching, sorting, filling, and comparing functionality.
- Use the static Arrays.sort() method to sort an array.
- Arrays.binarySearch() searches an array and returns the index of the searched for element. Arrays must be sorted for a binary search to work.

### Varargs

The vararg syntax specifies an argument type followed by an ellipsis (...). This indicates the method can take zero or more arguments of that type.

## Collections

An array is a group of many objects or primitives. The collection framework offers an alternative means of grouping objects.
- The collection framework is a set of prebuilt data structure components
- Arrays and collections both have their strengths and weaknesses. Each has its proper place in Java applications.

**Arrays:**
- Not resizable
- Stores primitives or Objects
- Homogenous
- Special [] bracket notation to access elements
- Special syntax for initialization

**Collections:**
- Dynamically sized
- Stores only Objects
- Can be heterogeneous
- Use methods to access elements
- No special initialization syntax

There are two basic types in the collection framework, all of which are found in the java.util package:
- Collections
- Maps

### ArrayList

- The ArrayList is a collection that represents a dynamically resizable array and is a good place to start an exploration of Collections.
- Creating and populating the list is simple. It is a matter of instantiating an ArrayList instance and using the add() method to add elements to the ArrayList.
- The size of the ArrayList is not set when constructed. The list keeps growing as Strings are added to it.
- Because the collections all work the same way, they can be easily replaced by another collection data structure when required.
- Additionally, any collection object can be turned into an array with a call to toArray() method on the collection.
- This method acts as bridge between array-based and collection-based APIs.

### Iterator

One feature of the Collection API is using an Iterator to traverse a list.
- Iterators allow for traversal of a collection in a way that is similar to using a for loop to traverse all elements of an array.
- Iterator is another type defined in the java.util package. To obtain an iterator, use the iterator() method.

The Iterator interface defines only three methods:
- public boolean hasNext()
- public Object next()
- public void remove()

### Lists

- The List interface is a subtype () of the Collection interface.
- Lists have the following characteristics:
  - They maintain the order of the elements they contain
  - They allow duplicate entries of any given object
  - They can be manually sorted
- The following are the most common List implementations:
  - ArrayList
  - LinkedList
- Because list are ordered, they also have an index, just like an array. The index can be used to get, set, and remove elements in the list.

**ArrayLists** have the following traits:
- They are fast at random access
- They are slower at adding and removing elements in the middle
- This is because elements in the ArrayList must physically be moved in order to insert/remove elements in the middle.

**LinkedLists** are practically the opposite:
- They are slower at random access
- They are faster at adding and removing elements in the middle

### Sets

The Set interface is also a subtype (or sub-interface) of the Collection interface. Sets have the following characteristics:
- No duplicate objects are allowed in a set. The equals method is used to determine whether an object is a duplicate.
- Genrally speaking, the order of the elements in a set are not maintained.
- Therefore, the elements of a set are returned in no particular order when using an iterator.

The most common Set implementations are:
- HashSet
- TreeSet

**TreeSets** are ordered Sets:
- TreeSets rely on the use of the compareTo() method to sort stored components automatically
- Otherwise, the TreeSet uses a Comparator that is passed to the constructor during instantiation (the Comparator is covered in the next chapter)
- Internally, TreeSet use a Tree organization to organize the set, but you have no control over links between parents and children in the tree.
- Even though TreeSets are ordered, items in the set are not indexed. Therefore, you cannot insert or fetch values from a particular index.


### Queue

The Queue interface defines a data structure with a head and tail. A Queue is a data structure that generally behaves like a line at a restaurant or airline ticket counter.
The Queue interface defines methods for adding, removing and exampling the elements in a queue.
- add(), remove(), element() (Exception throwing methods)
- offer(), poll(), peek() (Non-exception throwing methods)

#### ArrayBlockingQueue

An ArrayBlockingQueue implements a first-in-first-out (FIFO) Queue.
- The head of the queue is the element that has been in the Queue for the longest time
- The tail of the queue is the element that has been in the Queue for the shortest time
- New elements are added to the tail and elements are pulled from the head

ArrayBlockingQueue hold a fixed number of elements
- That is they have a capacity that is set when the Queue is created. The capacity cannot be changed.

#### PriorityQueue

A PriorityQueue works like a restaurant or ticket counter line that allows first-class or "premium" diners or passengers to skip to the head of the line.
- In other words, elements with a "higher" order are moved to the head of the queue.
- The elements are ordered according to their natural ordering

Also, a PriorityQueue is unbounded with regard to capacity.
- As elements are added to the PriorityQueue, its capacity grows automatically.

### Deque

Deque is essentially a queue that allows elements to be inserted and removed at both ends.
- In fact, deque is short for **"double ended queue"**
- It is usually pronounced "deck"
- Usually, there is no capacity on the number of elements allowed in a Deque.

- addFirst(), removeFirst(), getFirst(), addLast(), removeLast(), getLast() (Exception throwing methods)
- offerFirst(), pollFirst(), peekFirst(), offerLast(), pollLast(), peekLast() (Non-exception throwing methods)

#### ArrayDeque
The ArrayDeque is a commonly used implementation of the Deque interface.
- As is generally the case with Deques, ArrayDeque as no size limit (capacity). They grow as necessary to support the elements added to them.
- Also, as is generally the case with Deques, null elements are not allowed in an ArrayDeque.
- ArrayDeque objects are not thread-safe.

### Maps

Maps, while part of the Collection Framework, are not associated with the Collection interface.
- Instead, there is a special Map interface used to define the functionality of these data structures.
- Maps are collections of data in associated key and value pairs.
- They have object keys instead of numeric indexes
- Adding, removing and sorting elements to a map is done by key
- No duplicate keys are allowed
- Keys can be any object, but they are typically String or Integers
- Duplicates values are allowed, each associated with a different unique key.

**The HashMap and TreeMap are analogous to HashSet and TreeSet.**

### Limitations of Collections

- The first limitation is that collections can not store primitive data types.
  - Collections store all of their elements in Object references
  - We can use a Wrapper classes to work with primitives data types.
- The second limitation is that everything in a collection is treated or stored as an Object reference
  - Collections can be heterogeneous data structures. This makes collections powerful data structures capable of grouping all sorts of objects/data.

Wrappers have a couple of uses:
- Wrappers allow you to add primitives to collections
- Wrappers attach functionality to primitive data types.

To create a wrapper instance, pass the associated primitive into the constructor for the wrapper
```java
List list = new ArrayList();
int j = 7;
list.add(Integer.valueOf(j));
```

To get the primitive back out of the wrapper object
```java
Integer wrapInt = Integer.valueOf(7);
in j = wrapInt.intValue();

Character wrapChar = Character.valueOf('a');
char ch = wrapChar.charValue();
```

### Generics and AutoBoxing

To remove some limitations on collections, powerful new features were added to the syntax in Java 5

**Generics** allow you to specify the intended data type to be stored in a reference.
**Autoboxing** is the automatic conversion the compiler makes between Java primitives and their corresponding object wrapper classes.

#### Diamond Operator

Generics allow to be more type safe when coding homogeneous collections. The diamond operator was added to reduce typing when declaring generic types.

- It is called the diamond operator because the operator is shaped like a diamond. <>
- Using the diamond operator, only the reference has to be specified with generic typing
- The actual instance can use the diamond operator to suggest to that the instance will be of the same type as the reference

### Comparable

- Collections and Arrays can automatically sort the basic types Strings, chars, ints, and so on all have a "natural ordering"
- To get Collections and Arrays to sort your custom types, the types must implement the Comparable interface.
- **To implement the Comparable interface, the class must implement the compareTo() method.**


### Comparator

- Another more flexible approach to implementing order is to pass a sorting object into the sort() method of Arrays or Collections.
- A sorting object is an object that implements the Comparator interface
  - Comparator is located in the java.util package
  - A class implementing the Comparator interface must implement the compare() method
  - The compare() method takes two Objects as arguments
  - The compare() method returns a positive number if the first argument is larger than the second, zero if they are equal, and a negative number otherwise.


Comparator can be used to compare any two objects.
- **When comparing like objects, it is best to use the Comparable interface when possible.**
- **The comparator is useful when comparing elements of a heterogeneous collection and a third-party classes you don't have the source to.**


Just as we can add type parameters to our collections (thus eliminating the need to cast reference variables), we can also add them to the Comparable<T> and Comparator<T> interfaces.  Whatever type you replace T with is used in the compareTo(T t) and compare(T t1, T t2) methods respectively.

Here's an example of using Comparable with a type parameter (note that the type is Comparable<MyDate> and the compareTo method defines a MyDate parameter.

```java
public class MyDate implements Comparable<MyDate> {
  private int month;
  private int day;
  private int year;
  public int compareTo(MyDate date) {
    int result = 0;
    if( year != date.year ) {
      result = year - date.year;
    } else if( month != date.month ) {
      result = month - date.month;
    } else if( day != date.day ) {
      result = day - date.day;
    }
    return result;
  }
}
```
... and here's an example of Comparator.  Note the type parameter listed with Comparator<MyDate> and that the compare method includes MyDate parameters.


```java
import java.util.Comparator;
public class MyDateComparator implements Comparator<MyDate> {
  public int compare(MyDate date1, MyDate date2) {
  int result = 0;
  if( date1.getYear() != date2.getYear() ) {
    result = date1.getYear() - date2.getYear();
    } else if( date1.getMonth() != date2.getMonth() ) {
      result = date1.getMonth() - date2.getMonth();
    } else if( date1.getDay() != date2.getDay() ) {
      result = date1.getDay() - date2.getDay();
    }
    return result;
  }
}
```


## Exception Handling

A throwable in Java is an event that disrupts the normal flow of a program.
- When a problem occurs within a method, the method creates an object and hands it off to the runtime system.
- That object is called a Throwable object
- Throwable is a class defined in java.lang
- The act of sending a Throwable object to the runtime system is called "throwing"

### Throwable

A Throwable contains information that is useful to the developer and perhaps the application itself.
- It contains a snapshot of the execution stack at the time it was created
- It also contains a message string that provides more information about the problem
- In the case where one problem caused another which caused another and so on, the Throwable may contain another Throwable.

There are two general categories, or more precisely, two subclasses of Throwable objects: **errors** and **exceptions**.

- An error represents a serious problem that an application should not try to recover from.
- For example, when the JVM runs out of memory, it throws an OutOfMemoryError.
- Exceptions are problems that an application might want to capture, react to, or in some cases actually try to recover from.
