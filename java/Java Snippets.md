# Java SE 8 Fundamentals & Programmer

### A Simple Class

```java
public class Simple {

    public static void main(Strings[] args) {

    }
}
```

### The Most Simple Class

```java
class Useless {

}
```

### Java Class Structure

```java
// provides a namespace for the class and uniquely identifies the class
// package name is not mandatory but is strongly recommended.
package <package_name>;

import <import_packages>;

public class ClassName {
    
    <variables>; // (also known as fields)
     
    <constructor(s)>;
    
    <other methods>;
}
```

### Java Naming Conventions

```java
// Class banes are nouns in upper camel case
public class CreditCard {
    // Constants should be declared in all uppercase letters.
    public final int VISA = 5001;

    // Variable names are short but meaningful in lower camel case.
    public String accountName;
    public String cardName;
    public Date expDate;


    // methods should be verbs, in lower camel case.
    public double getCharges() {
        // ...
    }

    public void displayCharge() {
        // ...
    }
}
```

### Code Blocks

```java
// Code blocks are defined in braces
public class HelloWorld {
    public static void main(Strings[] args) {
        System.out.prinln("Hello World");
    }
}
```

### A _main_ Class Example

```java
// Main class because Java VM recognize the main method as the starting point for every Java Program
public class HelloWorld {

    // The main method - an entry point to the program
    public static void main(Strings[] args) {

        // program output
        System.out.prinln("Hello World");
    }
}
```

### Primitive Data Types

```
Integer | Floating Point | Character | True/False
_________________________________________________
bytes   | float          | char      | boolean
short   | double         |
int     |
long    |
_________________________________________________
1,2,3,4 | 3.0            | 'a'       | true
7L      | 22.0F          | '\u0061'  | false
0xff    | .3337F         | '\n'      |
0b, 0B  | 4.022E23       |           |

Append uppercase or lowercase "L" or "F" to the number to specify a long or a float number.
```

### Numeric Literals

- Any number of underscore characters ( _ ) can appear between digits in a numeric field.
- This can improve the readability of your code.

```java
public class Numberics {
    long creditCardNumber = 1234_5678_9012_3456L;
    long socialSecurityNumber = 999_999_9999L;
    long hexBytes = 0xFF_EC_DE_5E;
    long hexWords = 0xCAFE_BABE;
    long maxLong = 0x7fff_ffff_ffff_ffffL;
    byte nybbles = 0b0010_0101;
    long bytes = 0b11010010_01101001_10010100_10010010;
}
```

### Operators

* **Simple assignment operator**
    * = Simple assignment operator


* **Arithmetic operators**
    *
        + Additive operator

    +
        - Subtraction operator

    -
        * Multiplication operator

    * / Division operator
    * % Remainder operator


* **Unary operators**
    *
        + Unary plus operator; indicates positive

    +
        - Unary minus operator; negates an expression

    * ++ Increment operator; increments a value by 1
    * -- Decrement operator; decrements a value by 1
    * ! Logical complement operator; inverts the value of a boolean


* **Equality and relational operators**
    * == Equal to
    * != Not equal to
    * \> Greater than
    * \> = Greater than or equal to
    * <  Less than
    * <= Less than or equal to


* **Conditional operators**
    * && Conditional AND
    * || Conditional OR
    * ?: Ternary


* Type comparison operator
    * instanceof Compares an object to a specified type

### Control Flow

**_if else_** Statement

```java
public class IfElse {
    public static void main(Strings[] args) {
        int a = 1;
        int b = 2;

        if (a == b) {
            System.out.prinln("True");
        } else {
            System.out.println("False");
        }
    }
}
```

**_switch_** Statement

```java
public class SwitchStatement {
    public static void main(Strings[] args) {
        String color = "Blue";
        String shirt = "Shirt";

        switch (color) {
            case "Blue":
                shirt = "Blue" + shirt;
                break;
            case "Red":
                shirt = "Red" + shirt;
                break;
            default:
                shirt = "White" + shirt;
        }

        System.out.println("Shirt type: " + shirt);
    }
}
```

**while** Loop

```java
public class WhileLoop {
    public static void main(Strings[] args) {
        int x = 10;

        while (x < 20) { // expression returning boolean value
            System.out.println("value of x : " + x);
            x++;
            System.out.println("\n");
        }
    }
}
```

**while** Loop

```java
public class DoWhileLoop {
    public static void main(Strings[] args) {
        int x = 10;

        do {
            System.out.println("value of x : " + x);
            x++;
            System.out.println("\n");
        } while (x < 20); // expression returning boolean value
    }
}
```

**for** Loop

```java
public class ForLoop {
    public static void main(Strings[] args) {

        for (int i = 0; i < 10; i++) {
            System.out.println("i: " + i);
        }
    }
}
```

**forEach** Loop

```java
public class ForLoop {
    public static void main(Strings[] args) {

        String[] names = new String[3];
        names[0] = "John";
        names[1] = "Jane";
        names[2] = "Tom";

        for (String name : names) {
            System.out.println("Name: " + name);
        }
    }
}
```

### Strings (_Immutable_)

```java
public class Strings {
    public static void main(Strings[] args) {
        char letter = 'a';

        String string1 = "Hello";
        String string2 = "World";
        String string3 = "";
        String dontDoThis = "Bad Practice";

        string3 = string1 + string2; // concatenate strings
        System.out.println("Output: " + string3);

        // String concatenation
        String result1 = string1 + " " + string2;
        String result2 = string1.concat(" ").concat(string2);
        System.out.println(result1);
        System.out.println(result2);
    }
}
```

### StringBuilder (_Mutable_)

```java
public class StringOperations {

    public static void main(Strings[] args) {
        StringBuilder sb = new StringBuilder("Hello");
        System.out.println("Output: " + sb);

        sb.append(" World");
        System.out.println("Output: " + sb);

        sb.append("!").append(" are").append(" you?");
        System.out.println("Output: " + sb);

        sb.insert(12, " How");
        System.out.println("Output: " + sb);

        System.out.println("Length: " + sb.length());
        System.out.println("Substring: " + sb.substring(0, 5));
    }
}
```

### A Simple Java Class: Employee

A Java class is often used to represent a concept

```java
package com.example.domain;

// class declaration
public class Employee {

    // fields
    public int empId;
    public String name;
    public String ssn;
    public double salary;

    // a default (no arguments) constructor
    public Employee() {
        // ... used to initialize fields
    }

    // an overloaded constructor
    public Employee(String name) {
        // ... use this reference when there are similar variable names
        this.name = name;
    }

    // a method
    public int getEmpId() {
        return empId;
    }
}
```

### Methods

When a class has data fields, a common practice is to provide methods for storing data (setter methods)
and retrieving data (getter methods) from the fields.

```java
package com.example.domain;

public class Employee {
    private int empId;
    // other fields...

    // Setter method
    public void setEmpId(int value) {
        empId = value;
    }

    // Getter method
    public int getEmpId() {
        return empId;
    }

    // Getter and Setter methods for other fields... 
    // often a pair of methods to set and get the current field value.
}
```

### Creating an Instance of a Class

To construct or create an instance (object) of the _Employee_ class, use the **_new_** keyword.

```java
public class MainClass {
    public static void main(Strings[] args) {
        Employee emp = new Employee();

        // legal if the field is public, but not good OOP practice
        emp.empId = 101;

        // use a method instead
        emp.setEmpId(101);
        emp.setName("John Smith");
        emp.setSsn("011-22-3467");
        emp.setSalary(12345.57);
    }
}
```

### Constructors

- A constructor is used to create an instance of a class
- Constructors can take parameters
- A constructor is declared with the same name as its class

```java
public class Employee {
    public Employee() {
        // A simple no-argument (no-arg) constructor
    }
}
```

### package Statement

- The _**package**_ keyword is used in Java to group classes together.
- A package is _implemented_ as a folder and, like a folder, provides a _**namespace**_ to a class.
- A package uniquely identifies the class.

### import Statement

- The **_import_** keyword is used to identify classes you want to reference in your class.
- It is good practice to use the full package and class name rather than the wildcard * to avoid class name conflicts.
- import statements follow the package declaration and precede the class declaration.
- An **import** statement is not required.
- By default, your class always imports **java.lang.***
- You do not need to import classes that are in the same package.
- The **import** statement has the "has" relationship.

```java
package com.exmaple.domain;

import com.example.domain.Manager; // unused import

// You can import a single class
import java.util.LocalDate;

// You can import an entire package
import java.util.*;

// You can include multiple import statements
import java.util.Date;
import java.util.Calendar;
```

### Java Is Pass-By-Value

```java
public class PassByValue {
    public static void main(String[] args) {
        // Pass-BY-Value 

        // Primitive types
        int x = 3;
        int y = x;
        // the value of x is copied and passed to y;
        // if x is later modified, the value of y remains unchanged;

        // Object types
        Employee x = new Employee();
        Employee y = x;
        // the value if the right side of an assignment is a reference to memory that stores a Java object
        // the reference is some address in memory
        // after the assignment, the value of y is the same as the value of x
        // a reference to the same object
    }
}
```

### Objects Passed as Parameters

```java
public class ObjectPassTest {
    public static void main(String[] args) {
        ObjectPassTest test = new ObjectPassTest();

        Employee emp = new Employee();
        emp.setSalary(120_000);

        test.foo(emp);
    }

    public void foo(Employee e) {
        e.setSalary(130_000);
        e = new Employee();
        e.setSalary(140_000);
    }
}
```

### Garbage Collection

- When an object is instantiated by using the new keyword, memory is allocated for the object. The scope of an object
  reference depends on where the object is instantiated.
- When someMethod completes, the memory referenced by emp is no longer accessible.
- Java's garbage collector recognizes when an instance is no longer accessible and eligible for collection

```java
public class SomeClass {
    public static void someMethod() {
        // When someMethod completes, the memory referenced by emp is no longer accessible.
        Employee emp = new Employee();
        // operations on emp
    }

    public static void main(String[] args) {
        someMethod();

        Employee emp = new Employee();
        emp = null; // Should also get garbage collected
    }
}
```

### Object-Oriented Programming Concepts

There are four object-oriented programming concepts:

- **Encapsulation**
- **Inheritance**
- **Polymorphism**
- **Abstraction**

### Encapsulation

- Encapsulation is one of the four fundamental object-oriented programming concepts.
- The term **encapsulation** means to enclose in a capsule, or to wrap something around an object to cover it.
- Encapsulation covers, or wraps the internal workings of a Java object.

    - Data variables, or fields, are hidden from the user of the object
    - Methods, the functions in Java, provide an explicit service to the user of the object but hide the implementation
    - As long as the services do not change, the implementation can be modified without impacting the user

Encapsulation: **Public and Private Access Modifiers**

- The _**public**_ keyword, applied to fields and methods, allows any class in any package to access the field or
  method.
- The _**private**_ keyword, applied to fields and methods, allows access only to other methods within the class itself.
- The _**private**_ keyword can also be applied to a method to hide an implementation detail.

Encapsulation: **The 3 steps for encapsulation**

- Declare fields private
- Remove all setters and provide methods that make sense in the context of the class
- Remove the no-arg constructor; implement a constructor to set the value of all fields

Encapsulation: **The two best practices for methods**

- Hide as many of the implementation details as possible
- Name the method in a way that clearly identifies its use or functionality

Encapsulation: **Benefits**

- Protects an object from unwanted access by clients
- Prevents assigning undesired values for its variables by the clients, which can make the state of an object usntable
- Allows changing the class implementation without modifying the client interface

```java
public class Employee {
    // Step 1: Declare private fields.
    private final int empId;
    private String name;
    private final String ssn;
    private double salary;

    // Steps 2: Implement a constructor to set the value of all fields.
    // JavaVM removes the default no-arg constructor, unless explicitly added.
    public Employee(int empId, String name, String ssn, double salary) {
        this.empId = empId;
        this.name = name;
        this.ssn = ssn;
        this.salary = salary;
    }

    // Step 3: Remove setters, implement methods that make sense in the context of the class
    public void changeName(String newName) {
        if (newName != null) {
            name = newName;
        }
    }

    public void increaseSalary(double increase) {
        salary += increase;
    }

    public void decreaseSalary(double increase) {
        salary -= increase;
    }
}
```

### Subclassing

In an object-oriented language like Java, **subclassing** is used to define a new class in terms of an existing one.
The keyword **_extends_** creates the **inheritance relationship**. Inheritance helps to avoid code duplication.
Although a child class inherits all the methods and fields from a parent class, it does not inherit constructors.
There are two ways to gain a constructor:

- Explicitly write your own constructor
- Use the default constructor
    - if you don't declare a constructor, a default no-arg constructor is provided for you
    - if you declare your own constructor, the default constructor is no longer provided

To construct an instance of a subclass it is often easiest to call the constructor of the parent class.

- The **_super_** keyword is used to call a parents constructor
- It must be the first statement of the constructor
- If it is not provided a default call to **_super()_** is inserted for you
- The **_super_** keyword may also be used to invoker a parents method or to access a private (non-private) field.

```java
public class Manager extends Employee {
    private final String departmentName;

    public Manager(String department) {
        super();
        this.departmentName = department;
    }

    public String getDepartmentName() {
        return departmentName;
    }
}
```

### Overloading

Overloading allows us to design a class that will call for **constructors** or **methods** that will have the **same
name** but with **different arguments**. Overloaded constructor or method is called based on parameters specified.
Two rules apply to it:

- Argument lists must differ
- Return types can be different

**Overloading Constructors**

```java
public class OverloadingConstructors {

    // Constructors
    public Overloading() {
    }

    public Overloading(int i) {
    }

    public Overloading(float f) {
    }

    public Overloading(double d) {
    }

    public Overloading(String s) {
    }

    public Overloading(int i, float f, double d, String s) {
    }
}
```

**Overloading Methods**

```java
public class OverloadingMethods {

    // Methods
    public void print(int i);

    public void print(float f);

    public void print(double d);

    public void print(String s);

    public String print();

    public String print(String s);
}
```

```java
public class Box {

    private final double length;
    private final double width;
    private final double height;

    public Box() {
        this.length = 1;
        this.width = 1;
        this.height = 1;
    }

    public Box(double length) {
        this.width = this.length = this.height = length;
    }

    public Box(double length, double width, double height) {
        this.length = length;
        this.width = width;
        this.height = height;
    }

    double volume() {
        return width * height * length;
    }
}
```

Ove

### Single Inheritance

The Java programming language permits a class to extend only one other class. This is called **single inheritance**.
Diamond Problem.

### Access Control

There are four access levels that can be applied to data fields and methods. Classes can be default (no modifier) or
public.

- **private** - same class
- **default** - same class; same package
- **protected** - same class; same package; subclasses in another package (subclass friendly);
- **public** - universe;

A good practice when working with fields is to **make fields as inaccessible as possible**, and provide **clear intent**
for the **use of fields through methods**.

```java
public class AccessControl {
    // accessible only within the class
    private final int result = 10;

    // accessible within the same class 
    // accessible within the same package
    // accessible within the subclasses in another package (subclass friendly);
    protected int getResult() {
        return result;
    }
}
```

### Overriding Methods

Consider a requirement to provide a String that represents some details about the Employee class fields.
By creating a method with the same signature in the subclass as the method in the parent class, you are **_overriding_**
the method. The overriding method cannot be less accessible than the method in the parent class.
It cannot use a more strict access control.

```java
public class Employee {
    private final int empId;
    private final String ssn;
    private String name;
    private double salary;


    public Employee(int empId, String name, String ssn, double salary) {
        this.empId = empId;
        this.name = name;
        this.ssn = ssn;
        this.salary = salary;
    }

    public void changeName(String newName) {
        if (newName != null) {
            name = newName;
        }
    }

    public void increaseSalary(double increase) {
        salary += increase;
    }

    public void decreaseSalary(double increase) {
        salary -= increase;
    }
}

public class Manager extends Employee {
    private final String departmentName;

    public Manager(String department) {
        super();
        this.departmentName = department;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    @Override
    public void increaseSalary(double increase) {
        // a subclass can invoke a parent method by using the super keyword.
        super.increaseSalary();
        System.out.println("Salary increased: " + increase);
    }
}
```

### Virtual Method Invocation

An **aspect of polymorphism** is called **Virtual Method Invocation**.

- Use more generic reference when creating an instance of an object.
- Call a method using the more generic reference. At run time the method that is executed is referenced from the
  more specific class that was instantiated from.

```java
public class MainClass {
    public static void main(String[] args) {
        Emplyoee e = new Manager();
        e.getDepartmentName();
    }
}
```

### Polymorphism

A good practice is to pass parameters and write methods that use the most generic possible form of your object.

```java
public class BadBonus {
    public double getBonusPercent(Employee e) {
        return 0.05;
    }

    public double getBonusPercent(Manager m) {
        return 0.10;
    }

    public double getBonusPercent(Engineer e) {
        return 0.15;
    }
}

public class GoodBonus {
    public static double getBonusPercent(Employee e) {
        // ...
    }
}

public class Employee {
    public double calcBonus() {
        return this.getSalary() * GoodBonus.getBonusPercent(this);
    }
}
```

### Using instanceof keyword

The Java language provides the instanceof keyword to determine an object's class type at rune time.

```java
public class GoodBonus {
    public static double getBonusPercent(Employee e) {
        if (e instanceof Manager) {
            return 0.15;
        } else if (e instanceof Engineer) {
            return 0.10;
        } else {
            return 0.05;
        }
    }
}
```

**Examples**:

```java
public class Test {
    public static float average(int[] values) {
        float result = 0;

        for (int i = 1; i < values.length; i++) {
            result += values[i];
        }

        return result / values.length;
    }

    public static void main(String[] args) {
        int[] numbers = {100, 200, 300};
        System.out.println(average(numbers)); // 166.66667
    }
}
```

```java
public class Test {

    public static void main(String[] args) {
        String s1 = "Test";
        String s2 = "Test";

        if (s1 == s2) {
            // == checks for reference equality with objects
            System.out.println("Same");
        }

        if (s1.equals(s2)) {
            // equals checks the contest
            System.out.println("Equals");
        }

        String s3 = "Test";
        String s4 = "Test";

        if (s3 == s4) {
            // == checks for reference equality with objects
            System.out.println("Same 2");
        }

        if (s3.equals(s4)) {
            // equals checks the contest
            System.out.println("Equals 2");
        }
    }
}
```
